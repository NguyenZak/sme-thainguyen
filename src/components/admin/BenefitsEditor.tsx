"use client";

import { useState } from "react";
import { BenefitsContent, BenefitItem } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";

interface BenefitsEditorProps {
  initialBenefits: BenefitsContent;
}

const ICON_OPTIONS = [
  "Users",
  "Building2",
  "TrendingUp",
  "Globe2",
  "Tv",
  "Handshake",
  "Award",
  "Star",
  "Zap",
  "ShieldCheck",
  "Briefcase",
  "BarChart2",
  "Store",
  "Landmark",
  "Megaphone",
  "Lightbulb",
  "Target",
  "CircleDollarSign",
];

function newItem(index: number): BenefitItem {
  return {
    id: `ben-${Date.now()}-${index}`,
    title: "Quyền lợi mới",
    description: "Mô tả ngắn về quyền lợi này...",
    iconName: "Star",
    badge: "",
  };
}

export default function BenefitsEditor({ initialBenefits }: BenefitsEditorProps) {
  const [benefits, setBenefits] = useState<BenefitsContent>(initialBenefits);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── item helpers ──────────────────────────────────────────────────────────
  const handleItemChange = (index: number, field: keyof BenefitItem, value: string) => {
    const updated = [...benefits.items];
    updated[index] = { ...updated[index], [field]: value };
    setBenefits({ ...benefits, items: updated });
  };

  const addItem = () => {
    const newItems = [...benefits.items, newItem(benefits.items.length)];
    setBenefits({ ...benefits, items: newItems });
  };

  const removeItem = (index: number) => {
    if (benefits.items.length <= 1) return; // keep at least 1
    const updated = benefits.items.filter((_, i) => i !== index);
    setBenefits({ ...benefits, items: updated });
  };

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= benefits.items.length) return;
    const updated = [...benefits.items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setBenefits({ ...benefits, items: updated });
  };

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await updateSectionAction("benefits", benefits);
    setSaving(false);
    if (res.success) {
      setMsg({ type: "success", text: "Đã cập nhật các giá trị & quyền lợi thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Không thể lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Giá Trị &amp; Quyền Lợi Tham Gia</h2>
          <p className="text-xs text-slate-400">
            Chỉnh sửa, thêm hoặc xóa các thẻ giá trị dành cho doanh nghiệp tham dự.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu Thay Đổi
        </button>
      </div>

      {/* ── Status msg ──────────────────────────────────────────────────── */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
            msg.type === "success"
              ? "bg-emerald-950/70 border border-emerald-800 text-emerald-300"
              : "bg-red-950/70 border border-red-800 text-red-300"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {msg.text}
        </div>
      )}

      {/* ── Section header fields ────────────────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
          TIÊU ĐỀ PHẦN QUYỀN LỢI
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Badge Thẻ</label>
            <input
              type="text"
              value={benefits.badge}
              onChange={(e) => setBenefits({ ...benefits, badge: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tiêu Đề Chính</label>
            <input
              type="text"
              value={benefits.title}
              onChange={(e) => setBenefits({ ...benefits, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">Phụ Đề Mô Tả Ngắn</label>
            <input
              type="text"
              value={benefits.subtitle}
              onChange={(e) => setBenefits({ ...benefits, subtitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── Benefit Items ────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
            DANH SÁCH QUYỀN LỢI ({benefits.items.length})
          </h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm Quyền Lợi
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 group"
            >
              {/* Card header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Move up/down */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveItem(idx, idx - 1)}
                      disabled={idx === 0}
                      className="text-slate-600 hover:text-slate-300 disabled:opacity-20 transition-colors leading-none text-[10px] px-1"
                      title="Di lên"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(idx, idx + 1)}
                      disabled={idx === benefits.items.length - 1}
                      className="text-slate-600 hover:text-slate-300 disabled:opacity-20 transition-colors leading-none text-[10px] px-1"
                      title="Di xuống"
                    >
                      ▼
                    </button>
                  </div>
                  <GripVertical className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-xs font-bold text-emerald-400">
                    QUYỀN LỢI #{idx + 1}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  disabled={benefits.items.length <= 1}
                  className="flex items-center gap-1 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 disabled:cursor-not-allowed px-2 py-1 rounded-lg text-[11px] font-medium transition-all"
                  title="Xóa quyền lợi này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa
                </button>
              </div>

              {/* Icon picker */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Icon
                </label>
                <select
                  value={item.iconName}
                  onChange={(e) => handleItemChange(idx, "iconName", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Badge (tùy chọn)
                </label>
                <input
                  type="text"
                  value={item.badge ?? ""}
                  placeholder="VD: Networking VIP"
                  onChange={(e) => handleItemChange(idx, "badge", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Tên Quyền Lợi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Mô Tả Chi Tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add button at bottom (repeated for convenience) */}
        <button
          type="button"
          onClick={addItem}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-700 hover:border-emerald-500/60 hover:bg-emerald-500/5 text-slate-500 hover:text-emerald-400 py-4 rounded-2xl text-xs font-bold transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm Quyền Lợi Mới
        </button>
      </div>
    </form>
  );
}
