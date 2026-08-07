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
    //   content: "SME2026-622755 chuyen tien ve",
    //   transferType: "in",
    //   transferAmount: 1450000,
    //   accumulated: 50000000,
    //   subAccount: null,
    //   referenceCode: "FT24080812345"
    // }

    const content = body.content || body.description || "";
    const regMatch = content.match(/SME2026[-\s]?\d{6}/i);

    if (!regMatch) {
      return NextResponse.json({ success: true, message: "Không tìm thấy mã đăng ký trong nội dung chuyển khoản" });
    }

    const registrationId = regMatch[0].toUpperCase().replace(/\s+/, "-");
    const amount = body.transferAmount || 0;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Cập nhật trạng thái trong Supabase registrations
      const { data: record } = await supabase
        .from("registrations")
        .select("*")
        .ilike("notes", `%${registrationId}%`)
        .single();

      if (record) {
        await supabase
          .from("registrations")
          .update({ status: "completed" })
          .eq("id", record.id);
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
