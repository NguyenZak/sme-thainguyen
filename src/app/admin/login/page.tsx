"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Lock, Mail, AlertCircle, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";
  const expired = searchParams.get("expired") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Tài khoản hoặc mật khẩu không chính xác.");
      } else {
        // Đặt lại mốc phiên 3 ngày cho lần đăng nhập này
        try {
          localStorage.setItem("cms_login_at", String(Date.now()));
        } catch {}
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Đã xảy ra lỗi đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative z-10">
      {/* Header Logo & Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white shadow-md mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SME VIỆT NAM 2026</h1>
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">Cổng Quản Trị Hệ Thống CMS</p>
      </div>

      {expired && !errorMsg && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>Phiên đăng nhập đã hết hạn (quá 3 ngày). Vui lòng đăng nhập lại.</div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>{errorMsg}</div>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Email Quản Trị Viên</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Mật Khẩu</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang Đăng Nhập...
            </>
          ) : (
            "Đăng Nhập CMS Admin"
          )}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Back to Site Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-slate-700 hover:text-black text-sm font-medium transition-colors bg-white px-4 py-2 rounded-lg border border-slate-300 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Về Trang Chủ
      </Link>

      <Suspense fallback={<div className="text-slate-600 text-xs">Đang tải...</div>}>
        <LoginForm />
      </Suspense>

      <div className="mt-8 text-center text-xs text-slate-500">
        &copy; 2026 SME Vietnam CMS Engine. Powered by Supabase & Next.js
      </div>
    </div>
  );
}
