"use client";

import { useState } from "react";
import {
  Users,
  Store,
  Mic,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flame,
  Calendar,
  Sparkles,
  QrCode,
  Sliders,
  HelpCircle,
  MapPin,
  ChevronRight,
  Zap,
  BarChart3,
  Ticket,
  Handshake,
  ArrowUpRight,
  ShieldCheck,
  Check,
  RefreshCw,
} from "lucide-react";
import { AdminTab } from "./AdminSidebar";
import { RegistrationRecord, getFormCategory } from "./RegistrationsManager";
import {
  SiteConfig,
  NavbarContent,
  HeroContent,
  StatisticsContent,
  AboutContent,
  SpeakersContent,
  BenefitsContent,
  TimelineContent,
  TicketFeeContent,
  SponsorsContent,
  BoothsContent,
  RegistrationContent,
  FaqContent,
  FooterContent,
} from "@/constants/defaultContent";

interface DashboardOverviewProps {
  data: {
    site_config: SiteConfig;
    navbar: NavbarContent;
    hero: HeroContent;
    statistics: StatisticsContent;
    about: AboutContent;
    speakers: SpeakersContent;
    benefits: BenefitsContent;
    timeline: TimelineContent;
    ticket_fee: TicketFeeContent;
    sponsors: SponsorsContent;
    booths: BoothsContent;
    registration: RegistrationContent;
    faq: FaqContent;
    footer: FooterContent;
  };
  registrations: RegistrationRecord[];
  registrationsCount: number;
  onNavigateTab: (tab: AdminTab) => void;
}

export default function DashboardOverview({
  data,
  registrations,
  registrationsCount,
  onNavigateTab,
}: DashboardOverviewProps) {
  // Compute registration metrics
  const totalRegs = registrationsCount || registrations.length || 0;
  const pendingRegs = registrations.filter((r) => r.status === "pending" || !r.status).length;
  const confirmedRegs = registrations.filter(
    (r) => r.status === "confirmed" || r.status === "completed"
  ).length;

  // Categories breakdown
  const delegateRegs = registrations.filter((r) => getFormCategory(r.ticket_type) === "delegate").length;
  const sponsorRegs = registrations.filter((r) => getFormCategory(r.ticket_type) === "sponsor").length;
  const boothRegs = registrations.filter((r) => getFormCategory(r.ticket_type) === "booth").length;

  // Percentages
  const delegatePercent = totalRegs > 0 ? Math.round((delegateRegs / totalRegs) * 100) : 0;
  const sponsorPercent = totalRegs > 0 ? Math.round((sponsorRegs / totalRegs) * 100) : 0;
  const boothPercent = totalRegs > 0 ? Math.round((boothRegs / totalRegs) * 100) : 0;

  // Booth inventory metrics
  const boothItems = data.booths?.items || [];
  const totalBooths = data.booths?.totalBooths || 100;
  const reservedBoothsCount = boothItems.filter((b) => b.status === "reserved").length;
  const soldBoothsCount = boothItems.filter((b) => b.status === "sold").length;
  const occupiedBoothsCount = reservedBoothsCount + soldBoothsCount;
  const availableBoothsCount = Math.max(0, totalBooths - occupiedBoothsCount);
  const boothOccupancyRate = totalBooths > 0 ? Math.round((occupiedBoothsCount / totalBooths) * 100) : 0;

  // Speakers and Sponsors metrics
  const speakersCount = data.speakers?.items?.length || 0;
  const sponsorsCount = data.sponsors?.items?.length || 0;

  // Ticket fee info
  const priceFormatted = data.ticket_fee?.priceVND
    ? new Intl.NumberFormat("vi-VN").format(data.ticket_fee.priceVND) + " VNĐ"
    : "3.500.000 VNĐ";

  // SePay QR Status
  const sepayActive = Boolean(
    data.site_config?.sepayAccountNumber && data.site_config?.sepayAccountName
  );

  // Hidden sections count
  const hiddenSectionsCount = data.site_config?.hiddenSections?.length || 0;

  // Recent 5 registrations
  const recentRegistrations = registrations.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl pb-16 font-sans text-slate-900">
      {/* 1. Header (shadcn/ui Page Header style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Realtime
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Tổng quan chỉ số hoạt động sự kiện, tình trạng gian hàng và đăng ký trực tuyến.
          </p>
        </div>

        {/* Action Buttons (shadcn/ui Button components style) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab("hero")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium border border-slate-200 bg-white hover:bg-slate-100 text-slate-900 transition-colors shadow-sm cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-slate-500" />
            Cấu hình Banner
          </button>
          <button
            onClick={() => onNavigateTab("registrations")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            Quản lý Đơn đăng ký ({totalRegs})
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 Grid - shadcn/ui Card style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng đơn đăng ký */}
        <div
          onClick={() => onNavigateTab("registrations")}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng Đơn Đăng Ký</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">{totalRegs}</div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Đã duyệt: <strong className="text-emerald-700">{confirmedRegs}</strong></span>
            <span>Chờ xử lý: <strong className="text-amber-700">{pendingRegs}</strong></span>
          </div>
        </div>

        {/* Card 2: Gian hàng triển lãm */}
        <div
          onClick={() => onNavigateTab("booths")}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Gian Hàng Triển Lãm</span>
            <Store className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {occupiedBoothsCount}
              <span className="text-sm font-normal text-slate-400">/{totalBooths}</span>
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {boothOccupancyRate}%
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Đã giữ: <strong className="text-slate-700">{reservedBoothsCount}</strong></span>
            <span>Còn trống: <strong className="text-emerald-700">{availableBoothsCount}</strong></span>
          </div>
        </div>

        {/* Card 3: Diễn giả & Tài trợ */}
        <div
          onClick={() => onNavigateTab("speakers")}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Diễn Giả &amp; Nhà Tài Trợ</span>
            <Mic className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {speakersCount} <span className="text-xs font-normal text-slate-500">Diễn giả</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Nhà tài trợ: <strong className="text-slate-700">{sponsorsCount}</strong></span>
            <span className="text-slate-700 font-medium">Keynote</span>
          </div>
        </div>

        {/* Card 4: Giá vé & QR Payment */}
        <div
          onClick={() => onNavigateTab("sepay_qr")}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Giá Vé &amp; SePay QR</span>
            <QrCode className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold tracking-tight text-slate-900 truncate">
            {priceFormatted}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Trạng thái SePay:</span>
            {sepayActive ? (
              <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                Đã bật
              </span>
            ) : (
              <span className="text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
                Tắt
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Section Overview & Analytics (shadcn/ui Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Spans): Category Breakdown & Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Registration Category Breakdown Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Phân loại Đơn Đăng ký</h3>
                <p className="text-xs text-slate-500 mt-0.5">Tỷ lệ theo loại hình đăng ký của khách hàng.</p>
              </div>
              <button
                onClick={() => onNavigateTab("registrations")}
                className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Simple Clean Progress Bars */}
            <div className="space-y-3 pt-2">
              {/* Delegates */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>🎟️ Đại biểu ({delegateRegs})</span>
                  <span className="font-semibold">{delegatePercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full" style={{ width: `${delegatePercent}%` }} />
                </div>
              </div>

              {/* Sponsors */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>💎 Nhà tài trợ ({sponsorRegs})</span>
                  <span className="font-semibold">{sponsorPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-700 rounded-full" style={{ width: `${sponsorPercent}%` }} />
                </div>
              </div>

              {/* Booths */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>🎪 Gian hàng ({boothRegs})</span>
                  <span className="font-semibold">{boothPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500 rounded-full" style={{ width: `${boothPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Registrations Table Card (shadcn/ui Table style) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Đơn Đăng ký Gần đây</h3>
                <p className="text-xs text-slate-500 mt-0.5">Top 5 đơn đăng ký mới nhất nhận được.</p>
              </div>
              <button
                onClick={() => onNavigateTab("registrations")}
                className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                Tất cả đơn <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentRegistrations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">Chưa có dữ liệu đăng ký.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                      <th className="py-3 px-4">Khách hàng</th>
                      <th className="py-3 px-4">Doanh nghiệp</th>
                      <th className="py-3 px-4">Loại hình</th>
                      <th className="py-3 px-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {recentRegistrations.map((reg) => {
                      const category = getFormCategory(reg.ticket_type);
                      const label =
                        category === "delegate"
                          ? "Đại biểu"
                          : category === "sponsor"
                          ? "Tài trợ"
                          : "Gian hàng";

                      return (
                        <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-medium text-slate-900">
                            <div>{reg.full_name || "—"}</div>
                            <div className="text-[11px] text-slate-400 font-normal">{reg.phone || reg.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div>{reg.company_name || "Cá nhân"}</div>
                            <div className="text-[11px] text-slate-400">{reg.position || ""}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                              {label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {reg.status === "confirmed" || reg.status === "completed" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Đã duyệt
                              </span>
                            ) : reg.status === "cancelled" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                                Đã hủy
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                Chờ xử lý
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Span): Infrastructure & Shortcuts */}
        <div className="space-y-6">
          {/* Infrastructure Health */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Trạng thái CMS &amp; Web
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Database:</span>
                <span className="font-medium text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Đã kết nối
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Realtime:</span>
                <span className="font-medium text-emerald-700">Đang bật</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Cổng SePay QR:</span>
                {sepayActive ? (
                  <span className="font-medium text-emerald-700">Hoạt động</span>
                ) : (
                  <span className="font-medium text-amber-700">Chưa cấu hình</span>
                )}
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Mục ẩn trên Web:</span>
                <span className="font-medium text-slate-900">{hiddenSectionsCount} phần</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts (shadcn/ui Tile Buttons) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Lối tắt quản lý
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigateTab("hero")}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-left font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-slate-500" /> Hero Banner
              </button>

              <button
                onClick={() => onNavigateTab("speakers")}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-left font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-slate-500" /> Diễn Giả
              </button>

              <button
                onClick={() => onNavigateTab("booths")}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-left font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4 text-slate-500" /> Gian Hàng
              </button>

              <button
                onClick={() => onNavigateTab("sponsors")}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-left font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Handshake className="w-4 h-4 text-slate-500" /> Tài Trợ
              </button>

              <button
                onClick={() => onNavigateTab("ticket_fee")}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-left font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-slate-500" /> Chi Phí Vé
              </button>

              <button
                onClick={() => onNavigateTab("faq")}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-left font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" /> FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
