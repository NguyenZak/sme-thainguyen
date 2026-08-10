"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * Tự đăng xuất admin sau 3 ngày kể từ lần đăng nhập gần nhất.
 * Chạy phía client nên hoạt động trên mọi gói Supabase (kể cả Free).
 * Nếu dùng gói Pro, nên bật thêm "Time-box user sessions" = 72h trong
 * Supabase → Authentication → Sessions để enforce ở server.
 */
const MAX_SESSION_MS = 3 * 24 * 60 * 60 * 1000; // 3 ngày
const CHECK_INTERVAL_MS = 60 * 1000; // kiểm tra mỗi phút
const STORAGE_KEY = "cms_login_at";

export default function SessionTimeout() {
  useEffect(() => {
    // Khởi tạo mốc thời gian nếu chưa có (áp cho phiên đã đăng nhập từ trước)
    const existing = Number(localStorage.getItem(STORAGE_KEY));
    if (!existing || Number.isNaN(existing)) {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }

    async function forceLogout() {
      try {
        await createClient().auth.signOut();
      } catch {
        // bỏ qua lỗi signOut, vẫn điều hướng về login
      }
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = "/admin/login?expired=1";
    }

    function check() {
      const started = Number(localStorage.getItem(STORAGE_KEY));
      if (!started || Number.isNaN(started) || Date.now() - started > MAX_SESSION_MS) {
        forceLogout();
      }
    }

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    const onFocus = () => check();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return null;
}
