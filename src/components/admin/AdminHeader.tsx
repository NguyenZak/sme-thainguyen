"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink, ShieldCheck, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  userEmail?: string;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function AdminHeader({
  userEmail,
  isCollapsed = false,
  onToggleSidebar,
}: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 font-sans shadow-sm">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 shadow-xs cursor-pointer"
            title={isCollapsed ? "Mở rộng thanh menu (Sidebar)" : "Thu gọn thanh menu (Sidebar)"}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-slate-700" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-slate-700" />
            )}
          </button>
        )}

        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-base font-bold text-slate-900 leading-none">CMS QUẢN TRỊ NỘI DUNG</h1>
          <p className="text-xs text-slate-500 mt-1">Diễn Đàn SME Việt Nam 2026</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-black bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Xem Landing Page
        </Link>

        {userEmail && (
          <span className="hidden md:inline-block text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
            {userEmail}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Đăng Xuất
        </button>
      </div>
    </header>
  );
}

