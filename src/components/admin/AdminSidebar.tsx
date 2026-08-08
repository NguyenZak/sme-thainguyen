"use client";

import {
  Sliders,
  Menu,
  Flame,
  BarChart3,
  Info,
  Sparkles,
  CalendarDays,
  Ticket,
  ClipboardList,
  Handshake,
  Store,
  MapPin,
  Users,
} from "lucide-react";

export type AdminTab =
  | "general"
  | "navbar"
  | "hero"
  | "statistics"
  | "about"
  | "speakers"
  | "benefits"
  | "timeline"
  | "ticket_fee"
  | "registration"
  | "sponsors"
  | "booths"
  | "footer"
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
    { id: "general", label: "Cấu hình chung, Logo & Favicon", icon: Sliders },
    { id: "navbar", label: "Menu & Navbar", icon: Menu },
    { id: "hero", label: "Hero Banner & Countdown", icon: Flame },
    { id: "statistics", label: "Con số Thống kê", icon: BarChart3 },
    { id: "about", label: "Về Diễn Đàn (About)", icon: Info },
    { id: "speakers", label: "Diễn Giả Keynote", icon: Users },
    { id: "benefits", label: "Giá trị & Quyền lợi", icon: Sparkles },
    { id: "timeline", label: "Lịch trình 3 Ngày", icon: CalendarDays },
    { id: "ticket_fee", label: "Chi phí & Giá Vé", icon: Ticket },
    { id: "registration", label: "Nội dung Đăng ký", icon: ClipboardList },
    { id: "sponsors", label: "Nhà Tài Trợ", icon: Handshake },
    { id: "booths", label: "Gian Hàng Triển Lãm", icon: Store },
    { id: "footer", label: "Chân Trang & Bản Đồ", icon: MapPin },
    { id: "registrations", label: "Quản Lý Đơn Đăng Ký", icon: Users, badge: registrationsCount },
  ];

  return (
    <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col font-sans md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto z-20">
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
              className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm font-bold"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span className="truncate leading-normal">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`ml-2 shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? "bg-white text-slate-900" : "bg-slate-200 text-slate-800"
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
