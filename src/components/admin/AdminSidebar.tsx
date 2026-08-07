"use client";

import {
  Globe,
  Flame,
  BarChart3,
  Info,
  Sparkles,
  CalendarDays,
  Ticket,
  Award,
  Store,
  Users,
} from "lucide-react";

export type AdminTab =
  | "general"
  | "hero"
  | "statistics"
  | "about"
  | "benefits"
  | "timeline"
  | "ticket_fee"
  | "sponsors"
  | "booths"
  | "registrations";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  registrationsCount?: number;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  registrationsCount = 0,
}: AdminSidebarProps) {
  const menuItems: { id: AdminTab; label: string; icon: any; badge?: number }[] = [
    { id: "general", label: "Cấu hình chung & SEO", icon: Globe },
    { id: "hero", label: "Hero Banner & Countdown", icon: Flame },
    { id: "statistics", label: "Con số Thống kê", icon: BarChart3 },
    { id: "about", label: "Về Diễn Đàn (About)", icon: Info },
    { id: "benefits", label: "Giá trị & Quyền lợi", icon: Sparkles },
    { id: "timeline", label: "Lịch trình 3 Ngày", icon: CalendarDays },
    { id: "ticket_fee", label: "Chi phí & Giá Vé", icon: Ticket },
    { id: "sponsors", label: "Nhà Tài Trợ", icon: Award },
    { id: "booths", label: "Gian Hàng Triển Lãm", icon: Store },
    { id: "registrations", label: "Quản Lý Đăng Ký", icon: Users, badge: registrationsCount },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 p-4 shrink-0 flex flex-col font-sans min-h-[calc(100vh-4rem)]">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-3">
        Danh Mục Quản Lý Nội Dung
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? "bg-slate-950 text-emerald-400" : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
