import { NextResponse } from "next/server";

export function normalizeTelegramChatId(input: string): string {
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

export function normalizeTelegramThreadId(input: any): number | undefined {
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
    const { botToken, chatId, threadId } = await request.json();

    if (!botToken || !chatId) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ Telegram Bot Token và Chat ID!" },
        { status: 400 }
      );
    }

    const formattedChatId = normalizeTelegramChatId(chatId);
    const formattedThreadId = normalizeTelegramThreadId(threadId);

    const testMsg =
      `🤖 <b>KIỂM TRA KẾT NỐI TELEGRAM BOT - SME VIỆT NAM 2026</b>\n\n` +
      `✅ Kết nối từ CMS Admin thành công!\n` +
      `🆔 <b>Chat ID:</b> <code>${formattedChatId}</code>\n` +
      (formattedThreadId ? `📌 <b>Topic ID:</b> <code>${formattedThreadId}</code>\n` : "") +
      `⏰ Thời gian: ${new Date().toLocaleString("vi-VN")}\n\n` +
      `<i>Hệ thống đã sẵn sàng tự động gửi thông báo theo từng Topic cho 3 loại Form Đăng ký!</i>`;

    const payload: Record<string, any> = {
      chat_id: formattedChatId,
      text: testMsg,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "💬 Test Nút Zalo", url: "https://zalo.me/0388925432" },
            { text: "🌐 Mở Trang CMS Admin", url: "https://smevietnam2026.vn/admin" },
          ],
        ],
      },
    };

    if (formattedThreadId !== undefined) {
      payload.message_thread_id = formattedThreadId;
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
        message: `Gửi tin nhắn thử nghiệm Telegram thành công! (Chat ID: ${formattedChatId}${formattedThreadId ? `, Topic: ${formattedThreadId}` : ""})`,
      });
    } else {
      let hint = "";
      if (resData.description?.includes("chat not found") || resData.description?.includes("bot is not a member")) {
        hint = " -> Gợi ý: Hãy đảm bảo bạn đã THÊM BOT VÀO GROUP và cấp quyền gửi tin nhắn!";
      } else if (resData.description?.includes("thread not found") || resData.description?.includes("message thread not found")) {
        hint = " -> Gợi ý: Topic ID không tồn tại trong Group này hoặc Group chưa bật tính năng Forum Topics!";
      }

      return NextResponse.json({
        success: false,
        message: `Lỗi từ Telegram API: ${resData.description || "Bot Token / Chat ID / Topic ID không hợp lệ"}${hint}`,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Lỗi kết nối: ${error?.message || "Không thể kết nối Telegram"}` },
      { status: 500 }
    );
  }
}
