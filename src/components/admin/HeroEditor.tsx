"use client";

import { useState } from "react";
import { HeroContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";

interface HeroEditorProps {
  initialHero: HeroContent;
}

export default function HeroEditor({ initialHero }: HeroEditorProps) {
  const [hero, setHero] = useState<HeroContent>(initialHero);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleKeywordChange = (index: number, value: string) => {
    const updated = [...hero.keywords];
    updated[index] = value;
    setHero({ ...hero, keywords: updated });
  };

  const addKeyword = () => {
    setHero({ ...hero, keywords: [...hero.keywords, "TỪ KHÓA MỚI"] });
  };

  const removeKeyword = (index: number) => {
    const updated = hero.keywords.filter((_, i) => i !== index);
    setHero({ ...hero, keywords: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("hero", hero);
    setSaving(false);

    if (res.success) {
      setMsg({ type: "success", text: "Đã lưu cài đặt Hero Banner & Đếm ngược thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Không thể lưu thay đổi." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hero Banner & Đồng Hồ Đếm Ngược</h2>
          <p className="text-xs text-slate-500 mt-1">Thay đổi tiêu đề chính, phụ đề, các từ khóa gõ chữ tự động và thời gian đếm ngược.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu Thay Đổi
        </button>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
            msg.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          {msg.text}
        </div>
      )}

      {/* Tiêu đề Hero */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">TIÊU ĐỀ & HUY HIỆU (BADGE)</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Thẻ Huy Hiệu (Top Badge Text)</label>
          <input
            type="text"
            value={hero.badgeText}
            onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Dòng 1 (Main Title)</label>
            <input
              type="text"
              value={hero.mainTitle}
              onChange={(e) => setHero({ ...hero, mainTitle: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Dòng 2 (Subtitle/Highlight)</label>
            <input
              type="text"
              value={hero.subTitle}
              onChange={(e) => setHero({ ...hero, subTitle: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Dynamic Keywords */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700">Danh Sách Từ Khóa Động (Hiệu ứng Gõ Chữ)</label>
            <button
              type="button"
              onClick={addKeyword}
              className="inline-flex items-center gap-1 text-[11px] text-slate-900 hover:text-black font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm Từ Khóa
            </button>
          </div>
          <div className="space-y-2">
            {hero.keywords.map((kw, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={kw}
                  onChange={(e) => handleKeywordChange(idx, e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
                {hero.keywords.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeKeyword(idx)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thời gian & Địa điểm */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">THỜI GIAN SỰ KIỆN & COUNTDOWN</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Thời Gian Mục Tiêu Countdown (Chọn ngày giờ trên lịch)
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
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-semibold cursor-pointer [color-scheme:light]"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Định dạng hiện tại: <span className="font-mono text-slate-800 font-bold">{hero.targetDateISO}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Văn Bản Hiển Thị Ngày Sự Kiện</label>
            <input
              type="text"
              value={hero.eventDateText}
              onChange={(e) => setHero({ ...hero, eventDateText: e.target.value })}
              placeholder="VD: 18 - 20 tháng 09, 2026"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Địa Điểm Tóm Tắt (Hero Venue)</label>
            <input
              type="text"
              value={hero.venueText}
              onChange={(e) => setHero({ ...hero, venueText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Các Nút Bấm Action */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">CÁC NÚT BẤM KÍCH HOẠT (CTA BUTTONS)</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-semibold text-slate-800">Nút Chính 1 (Đăng ký)</span>
            <input
              type="text"
              value={hero.primaryCtaText}
              onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-semibold text-slate-800">Nút Phụ 2 (Tài trợ)</span>
            <input
              type="text"
              value={hero.secondaryCtaText}
              onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-semibold text-slate-800">Nút Phụ 3 (Gian hàng)</span>
            <input
              type="text"
              value={hero.tertiaryCtaText}
              onChange={(e) => setHero({ ...hero, tertiaryCtaText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
