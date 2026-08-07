"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminHeader({ userEmail }: { userEmail?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-none">CMS QUẢN TRỊ NỘI DUNG</h1>
          <p className="text-xs text-slate-400 mt-1">Diễn Đàn SME Việt Nam 2026</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-800/60 px-3 py-1.5 rounded-lg transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Xem Landing Page
        </Link>

        {userEmail && (
          <span className="hidden md:inline-block text-xs font-medium text-slate-400 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-lg">
            {userEmail}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-950 border border-red-900/60 px-3 py-1.5 rounded-lg transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Đăng Xuất
        </button>
      </div>
    </header>
  );
}
