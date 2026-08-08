"use client";

import { useState } from "react";
import { HeroContent, DEFAULT_HERO } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Flame,
  Clock,
  Calendar,
  MapPin,
  Ticket,
  Store,
  Award,
  Type,
  Layers,
  RotateCcw,
} from "lucide-react";

interface HeroEditorProps {
  initialHero: HeroContent;
}

export default function HeroEditor({ initialHero }: HeroEditorProps) {
  const [hero, setHero] = useState<HeroContent>({
    ...DEFAULT_HERO,
    ...(initialHero || {}),
    keywords:
      initialHero?.keywords && initialHero.keywords.length > 0
        ? initialHero.keywords
        : DEFAULT_HERO.keywords,
    tickerMessages:
      initialHero?.tickerMessages && initialHero.tickerMessages.length > 0
        ? initialHero.tickerMessages
        : DEFAULT_HERO.tickerMessages,
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dynamic Typewriter Keywords Handlers
  const handleKeywordChange = (index: number, value: string) => {
    const updated = [...hero.keywords];
    updated[index] = value;
    setHero({ ...hero, keywords: updated });
  };

  const addKeyword = () => {
    setHero({
      ...hero,
      keywords: [...hero.keywords, "TỪ KHÓA MỚI " + (hero.keywords.length + 1)],
    });
  };

  const removeKeyword = (index: number) => {
    const updated = hero.keywords.filter((_, i) => i !== index);
    setHero({ ...hero, keywords: updated });
  };

  const moveKeyword = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= hero.keywords.length) return;
    const updated = [...hero.keywords];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setHero({ ...hero, keywords: updated });
  };

  // Social Proof Ticker Messages Handlers
  const handleTickerChange = (index: number, value: string) => {
    const updated = [...hero.tickerMessages];
    updated[index] = value;
    setHero({ ...hero, tickerMessages: updated });
  };

  const addTicker = () => {
    setHero({
      ...hero,
      tickerMessages: [
        ...hero.tickerMessages,
        "🔥 Khách hàng vừa hoàn tất đăng ký thành công (" + new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + ")",
      ],
    });
  };

  const removeTicker = (index: number) => {
    const updated = hero.tickerMessages.filter((_, i) => i !== index);
    setHero({ ...hero, tickerMessages: updated });
  };

  const moveTicker = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= hero.tickerMessages.length) return;
    const updated = [...hero.tickerMessages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setHero({ ...hero, tickerMessages: updated });
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (window.confirm("Bạn có chắc chắn muốn đặt lại toàn bộ nội dung Hero về mặc định ban đầu?")) {
      setHero(DEFAULT_HERO);
    }
  };

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("hero", hero);
    setSaving(false);

    if (res.success) {
      setMsg({ type: "success", text: "Đã lưu cài đặt toàn bộ nội dung Hero Banner thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Không thể lưu thay đổi." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-16">
      {/* Top Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Quản Trị Hero Banner & Đếm Ngược
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Thêm, sửa, xóa toàn bộ nội dung phần Hero: Huy hiệu đầu trang, bản tin chạy chữ, tiêu đề đa tầng, từ khóa gõ tự động, đếm ngược, địa điểm và các nút hành động (CTA).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Khôi phục nội dung mẫu mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Mặc Định
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu Thay Đổi
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
            msg.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* 1. Top Badges (Huy hiệu đầu trang) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Award className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            1. Huy Hiệu & Nhãn Chào Mừng Đầu Trang (Top Badges)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Thẻ 1 (Đèn nhấp nháy xanh - Chào mừng sự kiện)
            </label>
            <input
              type="text"
              value={hero.badgeText || ""}
              onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
              placeholder="VD: Chào mừng Đại hội HHDNNVV tỉnh Thái Nguyên · Nhiệm kỳ 2026 – 2031"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Xóa trống nếu không muốn hiển thị thẻ này.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Thẻ 2 (Huy hiệu huân chương danh dự - Màu vàng)
            </label>
            <input
              type="text"
              value={hero.honorBadgeText || ""}
              onChange={(e) => setHero({ ...hero, honorBadgeText: e.target.value })}
              placeholder="VD: 🏅 Huân chương Lao động hạng Ba"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Xóa trống nếu không muốn hiển thị thẻ này.</p>
          </div>
        </div>
      </div>

      {/* 2. Live Ticker Messages (Bản tin thông báo nhảy chữ trực tiếp) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Bản Tin Thông Báo Chạy Chữ Trực Tiếp (Social Proof Live Tickers)
            </h3>
          </div>
          <button
            type="button"
            onClick={addTicker}
            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Thông Báo
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Các tin nhắn thông báo lượt đăng ký vé, gian hàng, tài trợ sẽ tự động đổi sau mỗi 4.5 giây tạo hiệu ứng tương tác trực tiếp sôi nổi.
        </p>

        <div className="space-y-2.5">
          {hero.tickerMessages.map((ticker, idx) => (
            <div key={idx} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="w-7 text-center font-mono text-[11px] font-bold text-slate-500 shrink-0">
                #{idx + 1}
              </span>
              <input
                type="text"
                value={ticker}
                onChange={(e) => handleTickerChange(idx, e.target.value)}
                placeholder="Nội dung thông báo nhảy chữ..."
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveTicker(idx, "up")}
                  className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-200 transition-colors"
                  title="Di chuyển lên"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === hero.tickerMessages.length - 1}
                  onClick={() => moveTicker(idx, "down")}
                  className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-200 transition-colors"
                  title="Di chuyển xuống"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeTicker(idx)}
                  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                  title="Xóa thông báo này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {hero.tickerMessages.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">Chưa có thông báo chạy chữ nào.</p>
              <button
                type="button"
                onClick={addTicker}
                className="mt-2 text-xs text-emerald-600 font-bold hover:underline"
              >
                + Thêm thông báo đầu tiên
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Titles & Slogans (Tiêu đề & Khẩu hiệu) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Type className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            3. Tiêu Đề Chính, Phụ Đề & Khẩu Hiệu (Main Titles & Slogans)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu Đề Dòng 1 (Tiền tố trên chữ gõ động)
            </label>
            <input
              type="text"
              value={hero.titlePrefix !== undefined ? hero.titlePrefix : "DIỄN ĐÀN"}
              onChange={(e) => setHero({ ...hero, titlePrefix: e.target.value })}
              placeholder="VD: DIỄN ĐÀN"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu Đề Dòng 2 (Hậu tố dưới chữ gõ động)
            </label>
            <input
              type="text"
              value={hero.titleSuffix !== undefined ? hero.titleSuffix : "SME VIỆT NAM 2026"}
              onChange={(e) => setHero({ ...hero, titleSuffix: e.target.value })}
              placeholder="VD: SME VIỆT NAM 2026"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu Đề Phụ Tiếng Anh (English Subtitle)
            </label>
            <input
              type="text"
              value={hero.englishTitle || ""}
              onChange={(e) => setHero({ ...hero, englishTitle: e.target.value })}
              placeholder="VD: Vietnam SME Prosperity Link Forum 2026"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Khẩu Hiệu / Slogan Diễn Đàn (Tagline / Quotes)
            </label>
            <input
              type="text"
              value={hero.sloganText || ""}
              onChange={(e) => setHero({ ...hero, sloganText: e.target.value })}
              placeholder="VD: “Kết nối giao thương, vươn tầm quốc tế” • Connecting SME – Going Global"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none italic"
            />
          </div>
        </div>
      </div>

      {/* 4. Typewriter Dynamic Keywords (Từ khóa hiệu ứng gõ máy chữ) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Danh Sách Từ Khóa Động (Hiệu ứng Gõ Máy Chữ Typewriter)
            </h3>
          </div>
          <button
            type="button"
            onClick={addKeyword}
            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Từ Khóa
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Các từ khóa này sẽ xuất hiện lần lượt với hiệu ứng gõ chữ rực rỡ (màu xanh ngọc – vàng hổ phách) ở trung tâm tiêu đề Hero.
        </p>

        <div className="space-y-2.5">
          {hero.keywords.map((kw, idx) => (
            <div key={idx} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="w-7 text-center font-mono text-[11px] font-bold text-slate-500 shrink-0">
                #{idx + 1}
              </span>
              <input
                type="text"
                value={kw}
                onChange={(e) => handleKeywordChange(idx, e.target.value)}
                placeholder="Nhập từ khóa gõ chữ..."
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold uppercase focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveKeyword(idx, "up")}
                  className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-200 transition-colors"
                  title="Di chuyển lên"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === hero.keywords.length - 1}
                  onClick={() => moveKeyword(idx, "down")}
                  className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-200 transition-colors"
                  title="Di chuyển xuống"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                {hero.keywords.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeKeyword(idx)}
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                    title="Xóa từ khóa này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Countdown Timer & Target Date (Đồng hồ đếm ngược) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Clock className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            5. Đồng Hồ Đếm Ngược Sự Kiện (Live Countdown Timer)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu Đề Nhãn Đếm Ngược
            </label>
            <input
              type="text"
              value={hero.countdownLabel || "Đếm ngược sự kiện:"}
              onChange={(e) => setHero({ ...hero, countdownLabel: e.target.value })}
              placeholder="VD: Đếm ngược sự kiện:"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Thời Gian Đích (Chọn ngày giờ trên lịch)
            </label>
            <input
              type="datetime-local"
              value={(() => {
                try {
                  const d = new Date(hero.targetDateISO || "2026-09-18T08:00:00+07:00");
                  if (isNaN(d.getTime())) return "2026-09-18T08:00";
                  const pad = (n: number) => (n < 10 ? "0" + n : n);
                  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                } catch {
                  return "2026-09-18T08:00";
                }
              })()}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  const d = new Date(val);
                  setHero({ ...hero, targetDateISO: d.toISOString() });
                }
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none font-semibold cursor-pointer [color-scheme:light]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              ISO: <span className="font-mono text-slate-700 font-bold">{hero.targetDateISO}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 6. Event Details Card (Thông tin Thời gian & Địa điểm) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            6. Thẻ Chi Tiết Sự Kiện (Thời Gian & Địa Điểm)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Khối 1: Thời Gian Sự Kiện</span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nhãn Thời Gian</label>
              <input
                type="text"
                value={hero.dateLabel || "Thời gian"}
                onChange={(e) => setHero({ ...hero, dateLabel: e.target.value })}
                placeholder="VD: Thời gian"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Văn Bản Ngày Diễn Ra</label>
              <input
                type="text"
                value={hero.eventDateText || ""}
                onChange={(e) => setHero({ ...hero, eventDateText: e.target.value })}
                placeholder="VD: 18 - 20 tháng 09, 2026"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Khối 2: Địa Điểm Sự Kiện</span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nhãn Địa Điểm</label>
              <input
                type="text"
                value={hero.venueLabel || "Địa điểm"}
                onChange={(e) => setHero({ ...hero, venueLabel: e.target.value })}
                placeholder="VD: Địa điểm"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tên & Địa Chỉ Khách Sạn / Trung Tâm</label>
              <input
                type="text"
                value={hero.venueText || ""}
                onChange={(e) => setHero({ ...hero, venueText: e.target.value })}
                placeholder="VD: Khách sạn May Plaza, Tỉnh Thái Nguyên"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7. Action CTA Buttons (Các nút bấm kêu gọi hành động) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Ticket className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            7. Các Nút Bấm Kêu Gọi Hành Động (CTA Buttons Hero)
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          Tùy chỉnh tiêu đề và liên kết cho 3 nút hành động chính của phần Hero. Để trống tiêu đề nút nếu muốn ẩn nút đó.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CTA 1: Delegate */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-emerald-700" />
                Nút 1 (Đại biểu)
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                Xanh Lá
              </span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Văn bản nút:</label>
              <input
                type="text"
                value={hero.primaryCtaText || ""}
                placeholder="VD: ĐĂNG KÝ ĐẠI BIỂU THAM GIA"
                onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Đường dẫn liên kết:</label>
              <input
                type="text"
                value={hero.primaryCtaLink || "#register"}
                onChange={(e) => setHero({ ...hero, primaryCtaLink: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* CTA 2: Booth */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-amber-700" />
                Nút 2 (Gian hàng)
              </span>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-100/80 px-2 py-0.5 rounded-full">
                Vàng Cam
              </span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Văn bản nút:</label>
              <input
                type="text"
                value={hero.secondaryCtaText || ""}
                placeholder="VD: ĐĂNG KÝ GIAN HÀNG"
                onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Đường dẫn liên kết:</label>
              <input
                type="text"
                value={hero.secondaryCtaLink || "#register"}
                onChange={(e) => setHero({ ...hero, secondaryCtaLink: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* CTA 3: Sponsor */}
          <div className="p-4 bg-slate-100/80 rounded-xl border border-slate-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-700" />
                Nút 3 (Tài trợ)
              </span>
              <span className="text-[10px] text-slate-600 font-bold bg-slate-200 px-2 py-0.5 rounded-full">
                Đen Mờ
              </span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Văn bản nút:</label>
              <input
                type="text"
                value={hero.tertiaryCtaText || ""}
                placeholder="VD: THAM KHẢO GÓI TÀI TRỢ"
                onChange={(e) => setHero({ ...hero, tertiaryCtaText: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Đường dẫn liên kết:</label>
              <input
                type="text"
                value={hero.tertiaryCtaLink || "#sponsors"}
                onChange={(e) => setHero({ ...hero, tertiaryCtaLink: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating or Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          Đặt Lại Mặc Định
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu Toàn Bộ Cài Đặt Hero
        </button>
      </div>
    </form>
  );
}
