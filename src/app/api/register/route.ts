import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("New Registration Received:", data);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    let telegramToken = process.env.TELEGRAM_BOT_TOKEN || "";
    let telegramChatId = process.env.TELEGRAM_CHAT_ID || "";
    let telegramEnabled = false;

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
        const notes = data.notes || (data.networkingNeeds ? `Nhu cầu: ${data.networkingNeeds}` : null);

        await supabase.from("registrations").insert({
          full_name: fullName,
          phone,
          email,
          company_name: company,
          position,
          ticket_type: ticketType,
          notes,
          status: "pending",
        });

        // Get CMS site_config settings if available
        const { data: configRow } = await supabase
          .from("site_sections")
          .select("content")
          .eq("id", "site_config")
          .single();

        if (configRow?.content) {
          const cfg = configRow.content;
          if (cfg.telegramBotToken) telegramToken = cfg.telegramBotToken;
          if (cfg.telegramChatId) telegramChatId = cfg.telegramChatId;
          if (cfg.telegramEnabled !== undefined) telegramEnabled = cfg.telegramEnabled;
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

    // 2. Send Telegram Notification Alert if enabled
    if (telegramEnabled && telegramToken && telegramChatId) {
      try {
        const tgMsg =
          `🔔 <b>ĐĂNG KÝ MỚI - SME VIỆT NAM 2026</b>\n\n` +
          `👤 <b>Họ tên:</b> ${fullName}\n` +
          `🏢 <b>Công ty:</b> ${company}\n` +
          `💼 <b>Chức vụ:</b> ${position}\n` +
          `📞 <b>SĐT:</b> ${phone}\n` +
          `📧 <b>Email:</b> ${email}\n` +
          `🎟️ <b>Đăng ký:</b> ${ticketType}\n` +
          `📝 <b>Ghi chú:</b> ${notes || "Không có"}\n\n` +
          `⏰ <i>Thời gian: ${new Date().toLocaleString("vi-VN")}</i>`;

        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: tgMsg,
            parse_mode: "HTML",
          }),
        });
      } catch (tgErr) {
        console.warn("Failed to send Telegram alert:", tgErr);
      }
    }

    // 3. Forward to Google Apps Script (Google Sheets) if configured & enabled
    if (googleSheetEnabled && googleSheetUrl && googleSheetUrl !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      try {
        await fetch(googleSheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (gsErr) {
        console.warn("Failed to forward to Google Apps Script:", gsErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký thành công! Ban tổ chức sẽ liên hệ với bạn trong 24h.",
        registrationId: `SME2026-${Math.floor(100000 + Math.random() * 900000)}`,
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
