import { NextResponse } from "next/server";
import { SePayPgClient } from "sepay-pg-node";

export async function POST(request: Request) {
  try {
    // Gateway SePay TẠM THỜI TẮT. Bật lại bằng cách đặt SEPAY_GATEWAY_ENABLED=true
    // cùng SEPAY_MERCHANT_ID / SEPAY_SECRET_KEY trong biến môi trường (không lưu
    // secret trong CMS/DB nữa). Trong lúc tắt, dùng QR chuyển khoản VietQR.
    if (process.env.SEPAY_GATEWAY_ENABLED !== "true") {
      return NextResponse.json(
        { success: false, message: "Cổng thanh toán SePay đang tắt. Vui lòng chuyển khoản qua mã QR." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { registrationId, amount, description, returnUrl } = body;

    // Secret chỉ lấy từ biến môi trường — KHÔNG đọc từ config public-read
    const merchantId = process.env.SEPAY_MERCHANT_ID || "";
    const secretKey = process.env.SEPAY_SECRET_KEY || "";
    const isSandbox = process.env.SEPAY_SANDBOX === "true";

    if (!merchantId || !secretKey) {
      return NextResponse.json(
        { success: false, message: "Chưa cấu hình SePay Merchant ID và Secret Key trong CMS!" },
        { status: 400 }
      );
    }

    const client = new SePayPgClient({
      env: isSandbox ? "sandbox" : "production",
      merchant_id: merchantId,
      secret_key: secretKey,
    });

    const checkoutUrl = client.checkout.initCheckoutUrl();
    const fields = client.checkout.initOneTimePaymentFields({
      order_invoice_number: registrationId || `SME2026-${Date.now()}`,
      order_amount: Number(amount || 0),
      currency: "VND",
      order_description: description || `Thanh toan ve dai bieu SME 2026 ${registrationId}`,
      success_url: returnUrl || "https://sme-vietnam.vn",
      cancel_url: returnUrl || "https://sme-vietnam.vn",
    });

    return NextResponse.json({
      success: true,
      checkoutUrl,
      fields,
    });
  } catch (err: any) {
    console.error("SePay PG Checkout Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Lỗi khởi tạo thanh toán SePay PG API" },
      { status: 500 }
    );
  }
}
