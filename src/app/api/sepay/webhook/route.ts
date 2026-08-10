import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Webhook SePay — TẠM THỜI TẮT (auto-confirm).
 *
 * Bảo mật: endpoint này từng không xác thực, cho phép giả lập thanh toán.
 * Nay yêu cầu bắt buộc:
 *   - Đặt biến môi trường SEPAY_WEBHOOK_API_KEY
 *   - SePay gửi header "Authorization: Apikey <KEY>" trùng khớp
 * Nếu chưa cấu hình env → webhook bị vô hiệu hóa (trả 403), không xử lý gì.
 *
 * Muốn bật lại tự động duyệt: đặt SEPAY_WEBHOOK_API_KEY (env hosting) và khai
 * cùng API key đó trong dashboard SePay. Trong lúc tắt, duyệt đơn thủ công
 * trong CMS (đã được bảo vệ đăng nhập).
 */
export async function POST(request: Request) {
  try {
    const expectedKey = process.env.SEPAY_WEBHOOK_API_KEY;

    // Vô hiệu hóa nếu chưa cấu hình khóa xác thực
    if (!expectedKey) {
      return NextResponse.json(
        { success: false, message: "Webhook SePay đang tắt." },
        { status: 403 }
      );
    }

    // Xác thực API key: hỗ trợ "Apikey <KEY>", "Bearer <KEY>" hoặc raw
    const authHeader = request.headers.get("authorization") || "";
    const provided = authHeader.replace(/^(Apikey|Bearer)\s+/i, "").trim();
    if (!provided || provided !== expectedKey) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const content =
      body.content ||
      body.description ||
      body.code ||
      body.order_invoice_number ||
      body.order_id ||
      body.orderId ||
      body.referenceCode ||
      "";
    // Chỉ khớp đúng mã đăng ký SME2026-xxxxxx (bỏ fallback 6 số mơ hồ)
    const match = content.match(/SME2026[_\-\s]?(\d{6})/i);

    if (!match) {
      return NextResponse.json({
        success: true,
        message: "Không tìm thấy mã đăng ký hợp lệ trong nội dung chuyển khoản",
      });
    }

    const digits = match[1];
    const registrationId = `SME2026-${digits}`;
    const amount = body.transferAmount || 0;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Ưu tiên service role để cập nhật trạng thái bỏ qua RLS (nếu có)
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Chỉ cập nhật bản ghi khớp CHÍNH XÁC mã đăng ký (không auto-duyệt đơn khác)
      const { data: records } = await supabase
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
        // Không khớp mã → KHÔNG tự duyệt đơn nào, để BTC xử lý thủ công
        return NextResponse.json({
          success: true,
          message: `Không có đơn khớp mã ${registrationId}. Cần duyệt thủ công.`,
        });
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
      } catch {
        console.warn("Webhook Email dispatch error");
      }

      // Thông báo Telegram nếu được cấu hình (token chỉ lấy từ biến môi trường)
      try {
        const { data: configRow } = await supabase
          .from("site_sections")
          .select("content")
          .eq("id", "site_config")
          .single();

        const cfg = configRow?.content || {};
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
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
      } catch {
        console.warn("Webhook Telegram alert error");
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã xác nhận thanh toán SePay cho mã đăng ký ${registrationId}`,
      registrationId,
      amount,
    });
  } catch {
    console.error("SePay Webhook Error");
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
