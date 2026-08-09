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

    const content = body.content || body.description || body.code || "";
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
