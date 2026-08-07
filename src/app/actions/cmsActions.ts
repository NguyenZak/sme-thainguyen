"use server";

import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
export async function updateSectionAction(key: string, newContent: any) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerSupabase(cookieStore);

    const { error } = await supabase.from("site_sections").upsert({
      id: key,
      content: newContent,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi cập nhật dữ liệu" };
  }
}
