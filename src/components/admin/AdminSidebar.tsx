"use client";

import {
  LayoutDashboard,
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
  HelpCircle,
  QrCode,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type AdminTab =
  | "dashboard"
  | "general"
  | "sepay_qr"
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
  | "faq"
  | "footer"
  | "registrations";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  registrationsCount?: number;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  registrationsCount = 0,
  isCollapsed = false,
  onToggleSidebar,
}: AdminSidebarProps) {
  const menuItems: { id: AdminTab; label: string; icon: any; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard Tổng Quan", icon: LayoutDashboard },
    { id: "general", label: "Cấu hình chung, Logo & Favicon", icon: Sliders },
    { id: "sepay_qr", label: "Thanh Toán QR (SePay)", icon: QrCode },
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
    { id: "faq", label: "Câu Hỏi Thường Gặp (FAQ)", icon: HelpCircle },
    { id: "footer", label: "Chân Trang & Bản Đồ", icon: MapPin },
    { id: "registrations", label: "Quản Lý Đơn Đăng Ký", icon: Users, badge: registrationsCount },
  ];

  const activeItem = menuItems.find((item) => item.id === activeTab);

  return (
    <aside
      className={`w-full ${
        isCollapsed ? "md:w-20 p-2.5" : "md:w-72 p-4"
      } bg-white border-r border-slate-200 shrink-0 flex flex-col font-sans md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto z-20 transition-all duration-300`}
    >
      {/* Header / Title bar with toggle button */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        {!isCollapsed ? (
          <>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 truncate">
              Danh Mục Quản Lý Nội Dung
            </span>
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Thu gọn Sidebar"
                aria-label="Thu gọn Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full flex justify-center">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Mở rộng Sidebar"
                aria-label="Mở rộng Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile view toggle info header */}
      <div className="md:hidden flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {activeItem && <activeItem.icon className="w-4 h-4 text-slate-700 shrink-0" />}
          <span className="text-xs font-bold text-slate-800 truncate">
            {activeItem?.label || "Danh Mục"}
          </span>
        </div>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          >
            {isCollapsed ? "Mở danh mục" : "Thu gọn"}
          </button>
        )}
      </div>

      {/* Navigation list */}
      <nav className={`space-y-1 ${isCollapsed ? "hidden md:block" : "block"}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center p-2.5" : "justify-between px-3.5 py-2.5"
              } rounded-xl text-xs font-semibold transition-all relative group cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm font-bold"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {!isCollapsed ? (
                <>
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
                </>
              ) : (
                <>
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 border border-white text-[9px] font-extrabold text-white">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                  {/* Tooltip on desktop hover */}
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap hidden md:block">
                    {item.label}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-1.5 bg-slate-700 text-white px-1.5 py-0.5 rounded-full text-[10px]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

