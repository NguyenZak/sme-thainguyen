import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập." },
        { status: 401 }
      );
    }

    const { scriptUrl } = await request.json();

    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập Google Apps Script URL trước khi kiểm tra!" },
        { status: 400 }
      );
    }

    const testPayload = {
      fullName: "Nguyễn Văn Dùng Thử",
      phone: "0987654321",
      email: "test@sme2026.vn",
      company: "Công Ty Cổ Phần SME Việt Nam (Test)",
      position: "Giám Đốc Điều Hành",
      registrationType: "🎟️ Đăng ký Đại biểu (Kiểm tra từ CMS)",
      notes: "Tin nhắn thử nghiệm tự động đẩy dữ liệu sang Google Sheet",
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });

    if (res.ok) {
      return NextResponse.json({
        success: true,
        message: "Đã gửi dữ liệu thử nghiệm sang Google Sheet thành công! Hãy mở file Google Sheet để kiểm tra dòng mới.",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `HTTP ${res.status}: Google Apps Script trả về lỗi hoặc URL chưa được quyền truy cập công khai (Anyone)`,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Lỗi kết nối: ${error?.message || "Không thể kết nối tới Google Script URL"}` },
      { status: 500 }
    );
  }
}
