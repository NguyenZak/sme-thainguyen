"use client";

import { useState } from "react";
import { HeroContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, Loader2, PenSquare, MonitorSmartphone, ArrowRight } from "lucide-react";

interface PageBuilderEditorProps {
  initialHero: HeroContent;
}

const editableClass =
  "outline-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-lg bg-slate-900/80";

export default function PageBuilderEditor({ initialHero }: PageBuilderEditorProps) {
  const [hero, setHero] = useState<HeroContent>(initialHero);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const updateField = (key: keyof HeroContent, value: string) => {
    setHero((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const result = await updateSectionAction("hero", hero);
    setSaving(false);

    if (result.success) {
      setMsg({ type: "success", text: "Đã lưu Hero trực tiếp thành công!" });
    } else {
      setMsg({ type: "error", text: result.error || "Lỗi khi lưu Hero." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Page Builder cho Hero</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Xem trước trực tiếp nội dung Hero và chỉnh sửa ngay bằng văn bản hoặc bảng điều khiển bên phải.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu Page Builder
        </button>
      </div>

      {msg && (
        <div
          className={`rounded-2xl border px-4 py-3 text-xs font-semibold ${
            msg.type === "success"
              ? "border-emerald-600/40 bg-emerald-950/70 text-emerald-300"
              : "border-red-600/40 bg-red-950/70 text-red-300"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1.2fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-slate-950/20">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-emerald-300">
                <PenSquare className="h-4 w-4 text-emerald-400" />
            </div>

            <div className="space-y-5">
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateField("badgeText", e.currentTarget.textContent || "")}
                className={`${editableClass} inline-block px-3 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-300 border border-emerald-500/20`}
              >
                {hero.badgeText}
              </div>

              <div className="space-y-4">
                <h1
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateField("mainTitle", e.currentTarget.textContent || "")}
                  className={`${editableClass} text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight sm:leading-tight`}
                >
                  {hero.mainTitle}
                </h1>

                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateField("subTitle", e.currentTarget.textContent || "")}
                  className={`${editableClass} max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed`}
                >
                  {hero.subTitle}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateField("eventDateText", e.currentTarget.textContent || "")}
                    className={`${editableClass} rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-emerald-200`}
                  >
                    {hero.eventDateText}
                  </div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateField("venueText", e.currentTarget.textContent || "")}
                    className={`${editableClass} rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200`}
                  >
                    {hero.venueText}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <a
                  href={hero.primaryCtaLink || "#"}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                >
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateField("primaryCtaText", e.currentTarget.textContent || "")}
                    className="inline-block"
                  >
                    {hero.primaryCtaText}
                  </span>
                </a>
                <a
                  href={hero.secondaryCtaLink || "#"}
                  className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:bg-slate-800"
                >
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateField("secondaryCtaText", e.currentTarget.textContent || "")}
                    className="inline-block"
                  >
                    {hero.secondaryCtaText}
                  </span>
                </a>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">
                <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
                  <MonitorSmartphone className="h-4 w-4 text-emerald-400" />
                  Preview trực tiếp Hero
                </div>
                <p className="text-xs leading-relaxed">
                  Các thay đổi được cập nhật ngay trong preview này. Sau khi sửa xong nội dung, nhấn
                  <span className="font-bold text-emerald-300"> Lưu Page Builder </span> để ghi vào CMS.
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-[0.24em]">Chỉnh sửa nhanh</h3>
              <p className="text-xs text-slate-400">Bảng điều khiển này đồng bộ với preview ở bên trái.</p>
            </div>

            <div className="space-y-4">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-[0.2em]">Badge Hero</label>
              <input
                type="text"
                value={hero.badgeText}
                onChange={(e) => updateField("badgeText", e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-[0.2em]">Tiêu đề chính</label>
              <input
                type="text"
                value={hero.mainTitle}
                onChange={(e) => updateField("mainTitle", e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-[0.2em]">Phụ đề</label>
              <textarea
                rows={3}
                value={hero.subTitle}
                onChange={(e) => updateField("subTitle", e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-[0.2em]">Nút chính</label>
              <input
                type="text"
                value={hero.primaryCtaText}
                onChange={(e) => updateField("primaryCtaText", e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                value={hero.primaryCtaLink}
                onChange={(e) => updateField("primaryCtaLink", e.target.value)}
                placeholder="Đường dẫn nút chính"
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-300 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-[0.2em]">Nút phụ</label>
              <input
                type="text"
                value={hero.secondaryCtaText}
                onChange={(e) => updateField("secondaryCtaText", e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                value={hero.secondaryCtaLink}
                onChange={(e) => updateField("secondaryCtaLink", e.target.value)}
                placeholder="Đường dẫn nút phụ"
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-300 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-400">
            <p className="font-semibold text-slate-200 mb-3">Lưu ý</p>
            <ul className="space-y-2 list-disc pl-4">
              <li>Nội dung có thể sửa trực tiếp trong preview.</li>
              <li>Nút Lưu sẽ ghi dữ liệu vào phần Hero của CMS.</li>
              <li>Đây là mẫu block editor đơn giản, dễ mở rộng cho các section khác.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
