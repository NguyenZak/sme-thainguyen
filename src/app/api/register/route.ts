import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

function getFormCategory(ticketType: string): "delegate" | "sponsor" | "booth" {
  const t = (ticketType || "").toLowerCase();
  if (t.includes("sponsor") || t.includes("tài trợ") || t.includes("gói tài trợ")) return "sponsor";
  if (t.includes("booth") || t.includes("gian hàng") || t.includes("gian")) return "booth";
  return "delegate";
}

function normalizeTelegramChatId(input: string): string {
  if (!input) return "";
  let clean = input.trim();
  const linkMatch = clean.match(/t\.me\/c\/(\d+)/);
  if (linkMatch) {
    clean = linkMatch[1];
  }
  clean = clean.replace(/[^0-9-]/g, "");
  if (/^\d{9,}$/.test(clean)) {
    return `-100${clean}`;
  }
  return clean;
}

function normalizeTelegramThreadId(input: any): number | undefined {
  if (input === undefined || input === null || input === "") return undefined;
  const str = String(input).trim();
  const linkMatch = str.match(/t\.me\/c\/\d+\/(\d+)/);
  if (linkMatch) {
    const num = parseInt(linkMatch[1], 10);
    return isNaN(num) ? undefined : num;
  }
  const cleanNum = parseInt(str.replace(/[^0-9]/g, ""), 10);
  return isNaN(cleanNum) ? undefined : cleanNum;
}

export async function POST(request: Request) {
  try {
    // Chống spam: tối đa 5 lượt đăng ký / phút / IP
    const ip = getClientIp(request);
    const rl = rateLimit(`register:${ip}`, 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, message: "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const data = await request.json();

    const registrationId = data.registrationId || `SME2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    let telegramToken = process.env.TELEGRAM_BOT_TOKEN || "";
    let telegramChatId = process.env.TELEGRAM_CHAT_ID || "";
    let telegramEnabled = false;

    let threadIdDelegate = "";
    let threadIdSponsor = "";
    let threadIdBooth = "";

    let googleSheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || process.env.GOOGLE_SCRIPT_URL || "";
    let googleSheetEnabled = true;

    // 1. Save to Supabase Registrations Table & fetch site_config settings
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Insert registration record
        const fullName = data.fullName || data.full_name || "N/A";
        const phone = data.phone || "N/A";
        const email = data.email || "N/A";
        const company = data.company || data.company_name || "N/A";
        const position = data.position || "N/A";
        const ticketType = data.registrationType || data.intentTab || "standard";
        const initialStatus = "pending";
        const userNotes = data.notes || (data.networkingNeeds ? `Nhu cầu: ${data.networkingNeeds}` : "");
        const notes = `[Mã ĐK: ${registrationId}] ${userNotes}`.trim();

        const { error: insertError } = await supabase.from("registrations").insert({
          full_name: fullName,
          phone,
          email,
          company_name: company,
          position,
          ticket_type: ticketType,
          notes,
          status: initialStatus,
        });

        if (insertError) {
          console.error("Supabase insert error with status field, retrying without status:", insertError);
          await supabase.from("registrations").insert({
            full_name: fullName,
            phone,
            email,
            company_name: company,
            position,
            ticket_type: ticketType,
            notes,
          });
        }

        // Get CMS site_config settings if available
        const { data: configRow } = await supabase
          .from("site_sections")
          .select("content")
          .eq("id", "site_config")
          .single();

        if (configRow?.content) {
          const cfg = configRow.content;
          // Bot token chỉ lấy từ biến môi trường (không lưu trong config public-read)
          if (cfg.telegramChatId) telegramChatId = cfg.telegramChatId;
          if (cfg.telegramEnabled !== undefined) telegramEnabled = cfg.telegramEnabled;

          if (cfg.telegramThreadIdDelegate) threadIdDelegate = cfg.telegramThreadIdDelegate;
          if (cfg.telegramThreadIdSponsor) threadIdSponsor = cfg.telegramThreadIdSponsor;
          if (cfg.telegramThreadIdBooth) threadIdBooth = cfg.telegramThreadIdBooth;

          if (cfg.googleSheetScriptUrl) googleSheetUrl = cfg.googleSheetScriptUrl;
          if (cfg.googleSheetEnabled !== undefined) googleSheetEnabled = cfg.googleSheetEnabled;
        }
      } catch (dbErr) {
        console.warn("Failed to process Supabase DB operations:", dbErr);
      }
    }

    const fullName = data.fullName || data.full_name || "N/A";
    const phone = data.phone || "N/A";
    const email = data.email || "N/A";
    const company = data.company || data.company_name || "N/A";
    const position = data.position || "N/A";
    const ticketType = data.registrationType || data.intentTab || "standard";
    const notes = data.notes || (data.networkingNeeds ? `Nhu cầu: ${data.networkingNeeds}` : null);

    // 2. Forward to Google Apps Script (Google Sheets) & Send Confirmation Email
    let emailStatusText = email && email.includes("@")
      ? "✅ Đã gửi Email xác nhận kèm Poster"
      : "⚠️ Khách không điền Email";

    if (googleSheetEnabled && googleSheetUrl && googleSheetUrl !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      try {
        const gsRes = await fetch(googleSheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            timestamp: new Date().toISOString(),
          }),
        });
        const gsData = await gsRes.json().catch(() => ({}));
        if (gsData.emailStatus) {
          emailStatusText = gsData.emailStatus;
        }
      } catch (gsErr) {
        console.warn("Failed to forward to Google Apps Script:", gsErr);
      }
    }

    // 3. Send Telegram Notification Alert to Specific Forum Topic if enabled
    if (telegramEnabled && telegramToken && telegramChatId) {
      try {
        const category = getFormCategory(ticketType);
        let categoryTitle = "🎟️ ĐĂNG KÝ THAM GIA";
        let targetThreadIdStr = threadIdDelegate;

        if (category === "sponsor") {
          categoryTitle = "💎 ĐĂNG KÝ NHÀ TÀI TRỢ & ĐỐI TÁC";
          targetThreadIdStr = threadIdSponsor;
        } else if (category === "booth") {
          categoryTitle = "🎪 ĐĂNG KÝ GIAN HÀNG TRIỂN LÃM";
          targetThreadIdStr = threadIdBooth;
        }

        const formattedChatId = normalizeTelegramChatId(telegramChatId);
        const formattedThreadId = normalizeTelegramThreadId(targetThreadIdStr);

        const tgMsg =
          `🔔 <b>${categoryTitle}</b>\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `👤 <b>Họ tên:</b> ${fullName}\n` +
          `🏢 <b>Công ty / Đơn vị:</b> ${company}\n` +
          `💼 <b>Chức vụ:</b> ${position}\n` +
          `📞 <b>Số điện thoại:</b> ${phone}\n` +
          `📧 <b>Email:</b> ${email}\n` +
          `📨 <b>Trạng thái Mail:</b> ${emailStatusText}\n` +
          `📋 <b>Chi tiết nhu cầu:</b> ${ticketType}\n` +
          `📝 <b>Ghi chú:</b> ${notes || "Không có"}\n` +
          `⏰ <i>Thời gian: ${new Date().toLocaleString("vi-VN")}</i>`;

        const cleanPhone = phone.replace(/[^0-9]/g, "");
        const zaloUrl = cleanPhone ? `https://zalo.me/${cleanPhone}` : null;

        const actionButtons: Array<{ text: string; url: string }> = [];
        if (zaloUrl) {
          actionButtons.push({ text: "💬 Chat Zalo Khách", url: zaloUrl });
        }
        if (cleanPhone) {
          actionButtons.push({ text: "📞 Gọi Ngay", url: `tel:${cleanPhone}` });
        }

        const payload: Record<string, any> = {
          chat_id: formattedChatId,
          text: tgMsg,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [actionButtons],
          },
        };

        // Determine Telegram Group Forum Topic (message_thread_id)
        if (formattedThreadId !== undefined) {
          payload.message_thread_id = formattedThreadId;
        }

        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (tgErr) {
        console.warn("Failed to send Telegram alert:", tgErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký thành công! Ban tổ chức sẽ liên hệ với bạn trong 24h.",
        registrationId,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing registration:", error);
    return NextResponse.json(
      { success: false, message: "Đã có lỗi xảy ra. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
