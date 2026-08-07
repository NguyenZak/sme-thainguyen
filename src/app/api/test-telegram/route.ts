import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { botToken, chatId, threadId } = await request.json();

    if (!botToken || !chatId) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ Telegram Bot Token và Chat ID!" },
        { status: 400 }
      );
    }

    const testMsg =
      `🤖 <b>KIỂM TRA KẾT NỐI TELEGRAM BOT - SME VIỆT NAM 2026</b>\n\n` +
      `✅ Kết nối từ CMS Admin thành công!\n` +
      (threadId ? `📌 <b>Topic ID:</b> <code>${threadId}</code>\n` : "") +
      `⏰ Thời gian: ${new Date().toLocaleString("vi-VN")}\n\n` +
      `<i>Hệ thống đã sẵn sàng tự động gửi thông báo theo từng Topic cho 3 loại Form Đăng ký!</i>`;

    const payload: Record<string, any> = {
      chat_id: chatId,
      text: testMsg,
      parse_mode: "HTML",
    };

    if (threadId && !isNaN(parseInt(threadId, 10))) {
      payload.message_thread_id = parseInt(threadId, 10);
    }

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const resData = await res.json();

    if (resData.ok) {
      return NextResponse.json({
        success: true,
        message: "Gửi tin nhắn thử nghiệm Telegram thành công! Hãy kiểm tra ứng dụng Telegram.",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Lỗi từ Telegram API: ${resData.description || "Bot Token hoặc Chat ID/Topic ID không hợp lệ"}`,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Lỗi kết nối: ${error?.message || "Không thể kết nối Telegram"}` },
      { status: 500 }
    );
  }
}
