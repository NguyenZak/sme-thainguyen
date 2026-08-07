import { createClient as createBrowserSupabase } from "@/utils/supabase/client";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function uploadImageToStorage(file: File): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createBrowserSupabase();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `cms-uploads/${fileName}`;

    // Try uppercase 'CMS-MEDIA' (as named in Supabase Dashboard) then fallback to 'cms-media'
    let bucketName = "CMS-MEDIA";
    let { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { upsert: true });

    if (uploadError && uploadError.message?.includes("not found")) {
      bucketName = "cms-media";
      const retry = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { upsert: true });
      uploadError = retry.error;
    }

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return { url: publicUrlData.publicUrl, error: null };
      }
    }

    console.warn("Supabase storage upload failed/skipped. Falling back to Base64 Data URL...", uploadError);

    // Fallback: Convert to Base64 Data URL so the image works seamlessly in CMS preview & save
    const base64Url = await fileToBase64(file);
    return { url: base64Url, error: null };
  } catch (err: any) {
    console.warn("Upload exception. Falling back to Base64 Data URL...", err);
    try {
      const base64Url = await fileToBase64(file);
      return { url: base64Url, error: null };
    } catch (fallbackErr: any) {
      return { url: null, error: err?.message || "Upload failed" };
    }
  }
}

