import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

/**
 * Xác thực phiên đăng nhập admin dựa trên cookie Supabase (JWT của người dùng).
 * Trả về true nếu request đến từ một tài khoản đã đăng nhập hợp lệ.
 *
 * Dùng cho các API route nhạy cảm (duyệt thanh toán, xem analytics, test tools)
 * để chặn truy cập ẩn danh từ bên ngoài.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}
