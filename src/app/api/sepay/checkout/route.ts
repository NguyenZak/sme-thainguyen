import { NextResponse } from "next/server";
import { SePayPgClient } from "sepay-pg-node";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registrationId, amount, description, returnUrl } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    let merchantId = process.env.SEPAY_MERCHANT_ID || "";
    let secretKey = process.env.SEPAY_SECRET_KEY || "";
    let isSandbox = process.env.SEPAY_SANDBOX === "true";

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: configRow } = await supabase
        .from("site_sections")
        .select("content")
        .eq("id", "site_config")
        .single();

      if (configRow?.content) {
        const cfg = configRow.content;
        if (cfg.sepayMerchantId) merchantId = cfg.sepayMerchantId;
        if (cfg.sepaySecretKey) secretKey = cfg.sepaySecretKey;
        if (cfg.sepaySandbox !== undefined) isSandbox = cfg.sepaySandbox;
      }
    }

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
