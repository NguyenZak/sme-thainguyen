import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get("registrationId");

    if (!registrationId) {
      return NextResponse.json(
        { success: false, message: "Thiếu registrationId" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const cleanId = registrationId.replace(/[^a-zA-Z0-9-]/g, "");

      const { data, error } = await supabase
        .from("registrations")
        .select("id, status, notes, created_at")
        .or(`notes.ilike.%${cleanId}%`)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          success: true,
          status: data[0].status || "pending",
          registrationId,
        });
      }
    }

    return NextResponse.json({
      success: true,
      status: "pending",
      registrationId,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      status: "pending",
      error: String(err?.message || err),
    });
  }
}
