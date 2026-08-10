"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Share2,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Sparkles,
  Search,
  MessageCircle,
  ExternalLink,
  Users,
  Calendar,
} from "lucide-react";

interface AnalyticsData {
  summary: {
    totalVisits: number;
    todayVisits: number;
    yesterdayVisits: number;
    growthVsYesterday: number;
    uniqueSessions: number;
  };
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  sources: {
    direct: number;
    google: number;
    facebook: number;
    zalo: number;
    referral: number;
  };
  dailyTrend: { date: string; count: number }[];
  topPages: { page: string; count: number }[];
  recentVisits: {
    id: string;
    path: string;
    deviceType: "mobile" | "desktop" | "tablet";
    source: string;
    timestamp: string;
  }[];
}

export default function TrafficAnalyticsSection() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; count: number } | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      }
    } catch (err) {
      console.error("Failed to fetch traffic analytics", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading && !data) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-slate-600" />
          <span className="text-xs font-medium text-slate-500">Đang tải thống kê truy cập...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { summary, devices, sources, dailyTrend, topPages, recentVisits } = data;

  // Filter daily trend by time range
  const filteredTrend = dailyTrend.slice(-timeRange);
  const maxVal = Math.max(...filteredTrend.map((d) => d.count), 10);

  // Total devices calc
  const totalDeviceVisits = (devices.mobile || 0) + (devices.desktop || 0) + (devices.tablet || 0);
  const mobilePercent = totalDeviceVisits > 0 ? Math.round(((devices.mobile || 0) / totalDeviceVisits) * 100) : 0;
  const desktopPercent = totalDeviceVisits > 0 ? Math.round(((devices.desktop || 0) / totalDeviceVisits) * 100) : 0;
  const tabletPercent = totalDeviceVisits > 0 ? Math.round(((devices.tablet || 0) / totalDeviceVisits) * 100) : 0;

  // Total sources calc
  const totalSourceVisits =
    (sources.direct || 0) +
    (sources.google || 0) +
    (sources.facebook || 0) +
    (sources.zalo || 0) +
    (sources.referral || 0);

  const getSourcePercent = (val: number) =>
    totalSourceVisits > 0 ? Math.round((val / totalSourceVisits) * 100) : 0;

  // Format date helper
  const formatDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return `${diffSec} giây trước`;
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
      return `${Math.floor(diffSec / 86400)} ngày trước`;
    } catch {
      return "Vừa xong";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* 1. Header with Title & Refresh button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Thống Kê Truy Cập Website</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3 h-3 text-blue-500" /> Live Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi lưu lượng người dùng, thiết bị sử dụng và nguồn truy cập đến website Diễn đàn SME 2026.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setTimeRange(7)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                timeRange === 7 ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              7 ngày
            </button>
            <button
              onClick={() => setTimeRange(14)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                timeRange === 14 ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              14 ngày
            </button>
            <button
              onClick={() => setTimeRange(30)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                timeRange === 30 ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              30 ngày
            </button>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Visits */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tổng lượt xem trang</span>
            <div className="p-1.5 bg-blue-100/60 rounded-lg text-blue-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {summary.totalVisits.toLocaleString("vi-VN")}
          </div>
          <div className="text-[11px] text-slate-500">
            Khách độc lập: <strong className="text-slate-700 font-semibold">{summary.uniqueSessions}</strong>
          </div>
        </div>

        {/* Metric 2: Today Visits */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Truy cập Hôm nay</span>
            <div className="p-1.5 bg-emerald-100/60 rounded-lg text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {summary.todayVisits.toLocaleString("vi-VN")}
            </span>
            <span
              className={`inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                summary.growthVsYesterday >= 0
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {summary.growthVsYesterday >= 0 ? `+${summary.growthVsYesterday}%` : `${summary.growthVsYesterday}%`}
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Hôm qua: <strong className="text-slate-700">{summary.yesterdayVisits}</strong> lượt
          </div>
        </div>

        {/* Metric 3: Top Device */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Thiết bị phổ biến</span>
            <div className="p-1.5 bg-indigo-100/60 rounded-lg text-indigo-600">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            Mobile {mobilePercent}%
          </div>
          <div className="text-[11px] text-slate-500">
            Máy tính: <strong className="text-slate-700">{desktopPercent}%</strong> | Tablet: {tabletPercent}%
          </div>
        </div>

        {/* Metric 4: Primary Source */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Nguồn chính</span>
            <div className="p-1.5 bg-amber-100/60 rounded-lg text-amber-600">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            Trực tiếp {getSourcePercent(sources.direct)}%
          </div>
          <div className="text-[11px] text-slate-500">
            Google: <strong className="text-slate-700">{getSourcePercent(sources.google)}%</strong> | MXH: {getSourcePercent(sources.facebook + sources.zalo)}%
          </div>
        </div>
      </div>

      {/* 3. Traffic Trend SVG Bar Chart */}
      <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-b from-slate-50/40 to-white space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Biểu Đồ Biến Động Lượt Truy Cập</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Xu hướng số lượt xem trang trong {timeRange} ngày gần nhất.
            </p>
          </div>
          {hoveredPoint && (
            <div className="text-right text-xs bg-slate-900 text-slate-100 px-3 py-1 rounded-lg font-medium shadow-sm animate-in fade-in duration-150">
              {formatDateLabel(hoveredPoint.date)}: <span className="font-bold text-emerald-400">{hoveredPoint.count}</span> lượt
            </div>
          )}
        </div>

        {/* Chart Graphics */}
        <div className="pt-4 pb-2">
          <div className="h-44 w-full flex items-end justify-between gap-1.5 sm:gap-2 px-1 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-slate-300 w-full" />
              <div className="border-b border-slate-300 w-full" />
              <div className="border-b border-slate-300 w-full" />
            </div>

            {filteredTrend.map((item, idx) => {
              const heightPercent = Math.max(8, Math.round((item.count / maxVal) * 100));
              const isToday = idx === filteredTrend.length - 1;

              return (
                <div
                  key={item.date}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative z-10"
                  onMouseEnter={() => setHoveredPoint(item)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Bar */}
                  <div className="w-full h-36 flex items-end justify-center">
                    <div
                      className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                        isToday
                          ? "bg-slate-900 group-hover:bg-slate-800 shadow-md"
                          : "bg-slate-300 group-hover:bg-slate-500"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  {/* Date label */}
                  <span className={`text-[10px] font-medium transition-colors ${
                    isToday ? "text-slate-900 font-bold" : "text-slate-400 group-hover:text-slate-700"
                  }`}>
                    {formatDateLabel(item.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Devices & Sources Breakdown (Grid 2 Spans) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Distribution Card */}
        <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-500" /> Thiết Bị Sử Dụng
            </h3>
            <span className="text-[11px] font-medium text-slate-400">Tỷ lệ %</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Mobile */}
            <div>
              <div className="flex items-center justify-between text-slate-700 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-500" /> Điện thoại (Mobile)
                </span>
                <span className="font-bold text-slate-900">{mobilePercent}% ({devices.mobile || 0})</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${mobilePercent}%` }} />
              </div>
            </div>

            {/* Desktop */}
            <div>
              <div className="flex items-center justify-between text-slate-700 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-slate-700" /> Máy tính (Desktop)
                </span>
                <span className="font-bold text-slate-900">{desktopPercent}% ({devices.desktop || 0})</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-800 rounded-full" style={{ width: `${desktopPercent}%` }} />
              </div>
            </div>

            {/* Tablet */}
            <div>
              <div className="flex items-center justify-between text-slate-700 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <Tablet className="w-3.5 h-3.5 text-purple-500" /> Máy tính bảng (Tablet)
                </span>
                <span className="font-bold text-slate-900">{tabletPercent}% ({devices.tablet || 0})</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${tabletPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources Card */}
        <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-slate-500" /> Nguồn Lưu Lượng (Traffic Sources)
            </h3>
            <span className="text-[11px] font-medium text-slate-400">Kênh</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Direct */}
            <div>
              <div className="flex items-center justify-between text-slate-700 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-600" /> Trực tiếp (Direct Link)
                </span>
                <span className="font-bold text-slate-900">{getSourcePercent(sources.direct)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-700 rounded-full" style={{ width: `${getSourcePercent(sources.direct)}%` }} />
              </div>
            </div>

            {/* Google */}
            <div>
              <div className="flex items-center justify-between text-slate-700 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-emerald-600" /> Google Search
                </span>
                <span className="font-bold text-slate-900">{getSourcePercent(sources.google)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${getSourcePercent(sources.google)}%` }} />
              </div>
            </div>

            {/* Facebook & Zalo */}
            <div>
              <div className="flex items-center justify-between text-slate-700 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-blue-500" /> Mạng xã hội (Facebook / Zalo)
                </span>
                <span className="font-bold text-slate-900">{getSourcePercent(sources.facebook + sources.zalo)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${getSourcePercent(sources.facebook + sources.zalo)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Top Content Views & Recent Visits Stream (Grid 2 Spans) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages Card */}
        <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Top Khu Vực Được Xem Nhiều Nhất
          </h3>

          <div className="space-y-2">
            {topPages.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Chưa có dữ liệu lượt xem trang. Dữ liệu thực sẽ xuất hiện khi người dùng truy cập.
              </div>
            ) : (
              topPages.map((tp, i) => (
                <div key={tp.page} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-medium text-slate-800 truncate">{tp.page}</span>
                  </div>
                  <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {tp.count} lượt
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Visitor Activity Stream */}
        <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" /> Nhật Ký Ghé Thăm Mới Nhất
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Realtime
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {recentVisits.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Chưa có nhật ký truy cập thực tế.
              </div>
            ) : (
              recentVisits.map((visit) => (
                <div
                  key={visit.id || Math.random().toString()}
                  className="flex items-center justify-between py-2 px-2.5 bg-slate-50/60 rounded-lg text-xs hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {visit.deviceType === "mobile" ? (
                      <Smartphone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    ) : visit.deviceType === "tablet" ? (
                      <Tablet className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    ) : (
                      <Monitor className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className="font-medium text-slate-800 truncate">{visit.path || "/"}</span>
                    <span className="text-[10px] text-slate-400 capitalize px-1.5 py-0.2 bg-white rounded border border-slate-200 shrink-0">
                      {visit.source || "direct"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 font-normal">
                    {formatTimeAgo(visit.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
