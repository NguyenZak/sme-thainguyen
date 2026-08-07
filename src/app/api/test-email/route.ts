import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { scriptUrl, testEmail } = await request.json();

    if (!scriptUrl) {
      return NextResponse.json({ success: false, message: "Thiếu Google Apps Script Web App URL!" }, { status: 400 });
    }

    if (!testEmail || !testEmail.includes("@")) {
      return NextResponse.json({ success: false, message: "Vui lòng nhập Email hợp lệ để nhận Mail thử nghiệm!" }, { status: 400 });
    }

    const testPayload = {
      fullName: "Nguyễn Zak (Kiểm Tra Email)",
      phone: "0388925432",
      email: testEmail,
      company: "TZ Media / SME Việt Nam",
      position: "Giám Đốc",
      intentTab: "delegate",
      registrationType: "Vé Đại biểu (Test Email)",
      notes: "Email thử nghiệm hệ thống gửi tự động từ CMS Admin SME 2026",
      emailSubject: "[TEST MAIL] KIỂM TRA HỆ THỐNG GỬI EMAIL TỰ ĐỘNG - SME 2026",
      emailBody: "Chúc mừng! Hệ thống gửi Email xác nhận tự động qua Google Apps Script đã hoạt động hoàn hảo.",
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });

    const data = await res.json().catch(() => ({}));

    if (data.status === "success" || data.emailSuccess) {
      return NextResponse.json({
        success: true,
        message: `Đã gửi mail thử thành công tới ${testEmail}! Hãy kiểm tra Hòm thư (gồm cả Hộp thư rác / Spam).`,
        details: data,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.emailStatus || data.message || "Google Apps Script phản hồi nhưng chưa gửi được mail. Hãy kiểm tra Cấp quyền Google Apps Script!",
        details: data,
      });
    }
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err?.message || "Không thể kết nối tới Google Apps Script URL!",
    }, { status: 500 });
  }
}
