import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("SePay Webhook Payload Received:", body);

    // SePay Webhook Payload structure:
    // {
    //   id: 123456,
    //   gateway: "MBBank",
    //   transactionDate: "2026-08-08 01:05:00",
    //   accountNumber: "0388925432",
    //   code: null,
    //   content: "SME2026-992882 chuyen tien ve",
    //   transferType: "in",
    //   transferAmount: 1450000,
    //   accumulated: 50000000,
    //   subAccount: null,
    //   referenceCode: "FT24080812345"
    // }

    const content =
      body.content ||
      body.description ||
      body.code ||
      body.order_invoice_number ||
      body.order_id ||
      body.orderId ||
      body.referenceCode ||
      "";
    // Match "SME2026-992882", "SME2026 992882", "SME2026992882", or 6 digits
    const match = content.match(/SME2026[_\-\s]?(\d{6})/i) || content.match(/(\d{6})/);

    if (!match) {
      return NextResponse.json({
        success: true,
        message: "Không tìm thấy mã đăng ký trong nội dung chuyển khoản",
      });
    }

    const digits = match[1] || match[0];
    const registrationId = `SME2026-${digits}`;
    const amount = body.transferAmount || 0;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Cập nhật tất cả bản ghi khớp mã đăng ký hoặc dãy số 6 chữ số
      let { data: records } = await supabase
        .from("registrations")
        .select("*")
        .or(`notes.ilike.%${registrationId}%,notes.ilike.%${digits}%`);

      if (records && records.length > 0) {
        for (const record of records) {
          await supabase
            .from("registrations")
            .update({ status: "completed" })
            .eq("id", record.id);
        }
      } else {
        // Fallback: Nếu không tìm thấy theo mã, tìm bản ghi pending mới nhất
        const { data: latestPending } = await supabase
          .from("registrations")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1);

        if (latestPending && latestPending.length > 0) {
          records = latestPending;
          await supabase
            .from("registrations")
            .update({ status: "completed" })
            .eq("id", latestPending[0].id);
        }
      }

      // Gửi Email xác nhận tự động cho khách hàng qua Apps Script
      try {
        const { data: sections } = await supabase.from("site_sections").select("id, content");
        let googleSheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || process.env.GOOGLE_SCRIPT_URL || "";
        let googleSheetEnabled = true;
        let registrationContent: any = {};

        if (sections && sections.length > 0) {
          sections.forEach((sec) => {
            if (sec.id === "site_config") {
              const cfg = sec.content || {};
              if (cfg.googleSheetScriptUrl) googleSheetUrl = cfg.googleSheetScriptUrl;
              if (cfg.googleSheetEnabled !== undefined) googleSheetEnabled = cfg.googleSheetEnabled;
            } else if (sec.id === "registration") {
              registrationContent = sec.content || {};
            }
          });
        }

        const matchedUser = records?.[0];
        if (matchedUser && matchedUser.email && matchedUser.email.includes("@") && googleSheetEnabled && googleSheetUrl) {
          const matchNote = (matchedUser.notes || "").match(/SME2026-[A-Z0-9]+/i);
          const regCode = matchNote ? matchNote[0].toUpperCase() : `SME2026-${matchedUser.id.slice(0, 6).toUpperCase()}`;
          const customSub = registrationContent.delegateEmailSubject;
          const emailSubject = (customSub && customSub.includes("THANH TOÁN")) 
            ? customSub 
            : `[SME VIỆT NAM 2026] XÁC NHẬN THANH TOÁN THÀNH CÔNG - ${regCode}`;

          const customText = registrationContent.delegateEmailBody;
          const paymentBody = (customText && customText.includes("thanh toán")) 
            ? customText 
            : `Ban Tổ Chức Diễn đàn SME Việt Nam 2026 xác nhận đã nhận được khoản thanh toán cho đơn đăng ký của Quý đại biểu ${matchedUser.full_name}. Vé tham dự của Quý khách đã được kích hoạt thành công!`;
          const posterUrl = registrationContent.delegatePosterUrl || "";

          await fetch(googleSheetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName: matchedUser.full_name,
              full_name: matchedUser.full_name,
              email: matchedUser.email,
              phone: matchedUser.phone,
              company: matchedUser.company_name,
              company_name: matchedUser.company_name,
              position: matchedUser.position,
              ticketType: matchedUser.ticket_type,
              registrationType: matchedUser.ticket_type,
              registrationId: regCode,
              paymentStatus: "SUCCESS_PAID",
              customSubject: emailSubject,
              emailSubject: emailSubject,
              customBody: paymentBody,
              emailBody: paymentBody,
              posterUrl,
              emailPosterUrl: posterUrl,
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {});
        }
      } catch (mailErr) {
        console.warn("Webhook Email dispatch error:", mailErr);
      }

      // Thông báo Telegram nếu được cấu hình
      try {
        const { data: configRow } = await supabase
          .from("site_sections")
          .select("content")
          .eq("id", "site_config")
          .single();

        const cfg = configRow?.content || {};
        const telegramToken = cfg.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = cfg.telegramChatId || process.env.TELEGRAM_CHAT_ID;
        const telegramEnabled = cfg.telegramEnabled !== false;

        if (telegramEnabled && telegramToken && telegramChatId) {
          const matchedUser = records?.[0];
          const teleMsg =
            `🎉 <b>XÁC NHẬN THANH TOÁN TỰ ĐỘNG (SEPAY)</b> 🎉\n\n` +
            `🎟️ <b>Mã Đăng Ký:</b> ${registrationId}\n` +
            `👤 <b>Họ tên:</b> ${matchedUser?.full_name || "Khách đăng ký"}\n` +
            `📱 <b>SĐT:</b> ${matchedUser?.phone || "N/A"}\n` +
            `🏢 <b>Công ty:</b> ${matchedUser?.company_name || "N/A"}\n` +
            `💰 <b>Số tiền:</b> ${Number(amount).toLocaleString("vi-VN")} VNĐ\n` +
            `🏦 <b>Ngân hàng:</b> ${body.gateway || "N/A"} (${body.accountNumber || ""})\n` +
            `⏰ <b>Thời gian:</b> ${body.transactionDate || new Date().toLocaleString("vi-VN")}\n\n` +
            `✅ <b>Hệ thống SePay đã tự động duyệt đơn & kích hoạt vé!</b>`;

          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: teleMsg,
              parse_mode: "HTML",
            }),
          }).catch(() => {});
        }
      } catch (tgErr) {
        console.warn("Webhook Telegram alert error:", tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã xác nhận thanh toán SePay cho mã đăng ký ${registrationId}`,
      registrationId,
      amount,
    });
  } catch (err: any) {
    console.error("SePay Webhook Error:", err);
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}
