import { createClient as createBrowserSupabase } from "@/utils/supabase/client";

export async function uploadImageToStorage(file: File): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createBrowserSupabase();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `cms-uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("cms-media")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("cms-media")
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err?.message || "Upload failed" };
  }
}
