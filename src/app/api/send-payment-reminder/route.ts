import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

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

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`reminder:${ip}`, 10, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, message: "Thao tác quá nhanh." },
        { status: 429 }
      );
    }

    const data = await request.json();
    const {
      registrationId,
      fullName,
      email,
      phone,
      company,
      registrationType,
      totalCalculatedAmount,
      sepayBankCode,
      sepayAccountNumber,
      sepayAccountName,
      qrCodeUrl,
      isUserConfirmedPaid,
    } = data;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    let telegramToken = process.env.TELEGRAM_BOT_TOKEN || "";
    let telegramChatId = process.env.TELEGRAM_CHAT_ID || "";
    let telegramEnabled = true;
    let googleSheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || process.env.GOOGLE_SCRIPT_URL || "";
    let googleSheetEnabled = true;

    // Fetch latest config from Supabase if available
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: configRow } = await supabase
          .from("site_sections")
          .select("content")
          .eq("id", "site_config")
          .single();

        if (configRow?.content) {
          const cfg = configRow.content;
          if (cfg.telegramChatId) telegramChatId = cfg.telegramChatId;
          if (cfg.telegramEnabled !== undefined) telegramEnabled = cfg.telegramEnabled;
          if (cfg.googleSheetScriptUrl) googleSheetUrl = cfg.googleSheetScriptUrl;
          if (cfg.googleSheetEnabled !== undefined) googleSheetEnabled = cfg.googleSheetEnabled;
        }
      } catch (err) {
        console.warn("Error fetching site_config for reminder:", err);
      }
    }

    const formattedAmount = Number(totalCalculatedAmount || 0).toLocaleString("vi-VN");
    const regCode = registrationId || "SME2026";
    const qrImgUrl = qrCodeUrl || `https://qr.sepay.vn/img?bank=${sepayBankCode || "MB"}&acc=${sepayAccountNumber}&template=compact2&amount=${totalCalculatedAmount}&des=${regCode}`;

    // Case A: User clicked "XÁC NHẬN ĐÃ THANH TOÁN" button
    if (isUserConfirmedPaid) {
      if (telegramEnabled && telegramToken && telegramChatId) {
        try {
          const formattedChatId = normalizeTelegramChatId(telegramChatId);
          const tgMsg =
            `🟢 <b>KHÁCH HÀNG XÁC NHẬN ĐÃ CHUYỂN KHOẢN</b>\n` +
            `━━━━━━━━━━━━━━━━━━━\n` +
            `🆔 <b>Mã ĐK:</b> <code>${regCode}</code>\n` +
            `👤 <b>Họ tên:</b> ${fullName || "N/A"}\n` +
            `🏢 <b>Đơn vị:</b> ${company || "N/A"}\n` +
            `📞 <b>SĐT:</b> ${phone || "N/A"}\n` +
            `📧 <b>Email:</b> ${email || "N/A"}\n` +
            `💰 <b>Số tiền chuyển khoản:</b> <b>${formattedAmount} VNĐ</b>\n` +
            `📋 <b>Nội dung đăng ký:</b> ${registrationType || "N/A"}\n` +
            `⏰ <i>Thời gian bấm nút: ${new Date().toLocaleString("vi-VN")}</i>\n\n` +
            `👉 <i>Vui lòng kiểm tra tài khoản ngân hàng đối soát giao dịch!</i>`;

          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: formattedChatId,
              text: tgMsg,
              parse_mode: "HTML",
            }),
          });
        } catch (tgErr) {
          console.warn("Failed to send Telegram user confirmed paid alert:", tgErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Đã gửi thông báo xác nhận chuyển khoản tới Ban tổ chức.",
      });
    }

    // Case B: 3-Minute Payment Reminder Email + Telegram Notification
    let emailStatusText = "Chưa gửi Email";

    const reminderSubject = `[SME VIỆT NAM 2026] SẮP ĐĂNG KÝ THÀNH CÔNG - HÓA ĐƠN THANH TOÁN & MÃ QR VÉ (${regCode})`;
    const reminderBody =
      `Kính gửi Quý đại biểu <b>${fullName}</b>,<br/><br/>` +
      `Đơn đăng ký tham dự Diễn đàn SME Việt Nam 2026 của Quý khách (Mã đăng ký: <b>${regCode}</b>) đã được hệ thống ghi nhận tạm thời 90%.<br/><br/>` +
      `<b>📌 HÓA ĐƠN THANH TOÁN CHI TIẾT:</b><br/>` +
      `• <b>Họ tên:</b> ${fullName}<br/>` +
      `• <b>Đơn vị / Công ty:</b> ${company || "N/A"}<br/>` +
      `• <b>Số điện thoại:</b> ${phone || "N/A"}<br/>` +
      `• <b>Nội dung gói vé:</b> ${registrationType || "Vé Đại biểu tham dự trọn gói"}<br/>` +
      `• <b>Tổng tiền thanh toán:</b> <b style="color: #d97706; font-size: 16px;">${formattedAmount} VNĐ</b><br/><br/>` +
      `<b>💳 THÔNG TIN CHUYỂN KHOẢN VIETQR:</b><br/>` +
      `• Ngân hàng: <b>${sepayBankCode || "MBBank"}</b><br/>` +
      `• Số tài khoản: <b>${sepayAccountNumber || ""}</b><br/>` +
      `• Chủ tài khoản: <b>${sepayAccountName || ""}</b><br/>` +
      `• Nội dung chuyển khoản: <b style="color: #059669;">${regCode}</b><br/><br/>` +
      `Quý khách có thể mở ứng dụng Ngân hàng và quét mã VietQR đính kèm bên dưới để hoàn tất giữ suất vé chính thức trong 24 giờ. Ban Tổ Chức rất hân hạnh được đón tiếp Quý khách!`;

    if (email && email.includes("@") && googleSheetEnabled && googleSheetUrl && googleSheetUrl !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      try {
        const gsRes = await fetch(googleSheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            full_name: fullName,
            email,
            phone,
            company,
            company_name: company,
            registrationId: regCode,
            paymentStatus: "PENDING_REMINDER_3MIN",
            emailSubject: reminderSubject,
            customSubject: reminderSubject,
            emailBody: reminderBody,
            customBody: reminderBody,
            posterUrl: qrImgUrl,
            emailPosterUrl: qrImgUrl,
            timestamp: new Date().toISOString(),
          }),
        });

        const gsData = await gsRes.json().catch(() => ({}));
        if (gsData.status === "success" || gsData.emailSuccess || gsRes.ok) {
          emailStatusText = "✅ Đã gửi Email nhắc nhở thanh toán 3 phút";
        } else {
          emailStatusText = gsData.message || "Google Apps Script chưa phản hồi";
        }
      } catch (err: any) {
        console.warn("Error sending reminder email via GAS:", err);
        emailStatusText = "Lỗi kết nối tới Google Apps Script";
      }
    }

    // Send Telegram alert about 3-min reminder
    if (telegramEnabled && telegramToken && telegramChatId) {
      try {
        const formattedChatId = normalizeTelegramChatId(telegramChatId);
        const tgMsg =
          `⏳ <b>NHẮC NHỞ THANH TOÁN TỰ ĐỘNG (3 PHÚT)</b>\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `🆔 <b>Mã ĐK:</b> <code>${regCode}</code>\n` +
          `👤 <b>Họ tên:</b> ${fullName || "N/A"}\n` +
          `🏢 <b>Đơn vị:</b> ${company || "N/A"}\n` +
          `📞 <b>SĐT:</b> ${phone || "N/A"}\n` +
          `📧 <b>Email:</b> ${email || "N/A"}\n` +
          `💰 <b>Tổng chi phí:</b> <b>${formattedAmount} VNĐ</b>\n` +
          `📨 <b>Trạng thái:</b> ${emailStatusText}\n` +
          `⏰ <i>Hệ thống vừa tự động gửi Email hóa đơn & mã VietQR đính kèm cho khách!</i>`;

        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: formattedChatId,
            text: tgMsg,
            parse_mode: "HTML",
          }),
        });
      } catch (tgErr) {
        console.warn("Failed to send Telegram 3-min reminder alert:", tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Đã gửi Email và thông báo nhắc nhở thanh toán 3 phút.",
    });
  } catch (error) {
    console.error("Error sending payment reminder:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống." },
      { status: 500 }
    );
  }
}
