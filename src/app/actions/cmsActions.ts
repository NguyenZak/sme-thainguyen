"use server";

import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "src", "data", "cms_store.json");

function updateLocalStore(key: string, content: any) {
  try {
    let existingData: Record<string, any> = {};
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      existingData = JSON.parse(raw || "{}");
    }
    existingData[key] = content;
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(existingData, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to write to local cms_store.json:", e);
  }
}

export async function updateSectionAction(key: string, newContent: any) {
  try {
    // 1. Always persist locally to disk so settings survive builds & restarts
    updateLocalStore(key, newContent);

    // 2. Try to sync to Supabase if connected
    try {
      const cookieStore = await cookies();
      const supabase = createServerSupabase(cookieStore);

      await supabase.from("site_sections").upsert({
        id: key,
        content: newContent,
        updated_at: new Date().toISOString(),
      });
    } catch (supabaseErr) {
      console.warn("Supabase upsert warning:", supabaseErr);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi cập nhật dữ liệu" };
  }
}
