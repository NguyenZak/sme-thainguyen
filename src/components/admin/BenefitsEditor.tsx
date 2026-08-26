"use client";

import { useState, useEffect } from "react";
import { BenefitsContent, BenefitItem } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { useAutoSave } from "@/hooks/useAutoSave";
import AutoSaveHeaderBadge from "@/components/admin/AutoSaveHeaderBadge";
import RichTextarea from "@/components/admin/RichTextarea";
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
  onSaveSuccess?: (updatedBenefits: BenefitsContent) => void;
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

export default function BenefitsEditor({ initialBenefits, onSaveSuccess }: BenefitsEditorProps) {
  const [benefits, setBenefits] = useState<BenefitsContent>(initialBenefits);

  useEffect(() => {
    setBenefits(initialBenefits);
  }, [initialBenefits]);

  const { saveStatus, lastSavedTime, errorMessage, saveNow } = useAutoSave(
    "benefits",
    benefits,
    { onSaveSuccess }
  );

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

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">05 · Giá Trị &amp; Quyền Lợi Tham Gia</h2>
          <p className="text-xs text-slate-500 mt-1">
            Chỉnh sửa, thêm hoặc xóa các thẻ giá trị dành cho doanh nghiệp tham dự.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <AutoSaveHeaderBadge
            status={saveStatus}
            lastSavedTime={lastSavedTime}
            errorMessage={errorMessage}
            onManualSave={() => saveNow()}
          />
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm Quyền Lợi
          </button>
        </div>
      </div>

      {/* ── Section header fields ────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          TIÊU ĐỀ PHẦN QUYỀN LỢI
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Thẻ</label>
            <input
              type="text"
              value={benefits.badge}
              onChange={(e) => setBenefits({ ...benefits, badge: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Chính</label>
            <input
              type="text"
              value={benefits.title}
              onChange={(e) => setBenefits({ ...benefits, title: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phụ Đề Mô Tả Ngắn</label>
            <input
              type="text"
              value={benefits.subtitle}
              onChange={(e) => setBenefits({ ...benefits, subtitle: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── Benefit Items ────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            DANH SÁCH QUYỀN LỢI ({benefits.items.length})
          </h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm Quyền Lợi
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm group"
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
                      className="text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-colors leading-none text-[10px] px-1"
                      title="Di lên"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(idx, idx + 1)}
                      disabled={idx === benefits.items.length - 1}
                      className="text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-colors leading-none text-[10px] px-1"
                      title="Di xuống"
                    >
                      ▼
                    </button>
                  </div>
                  <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-900">
                    QUYỀN LỢI #{idx + 1}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  disabled={benefits.items.length <= 1}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 disabled:opacity-20 disabled:cursor-not-allowed px-2 py-1 rounded-lg text-[11px] font-medium transition-all"
                  title="Xóa quyền lợi này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa
                </button>
              </div>

              {/* Icon picker */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Icon
                </label>
                <select
                  value={item.iconName}
                  onChange={(e) => handleItemChange(idx, "iconName", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
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
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Badge (tùy chọn)
                </label>
                <input
                  type="text"
                  value={item.badge ?? ""}
                  placeholder="VD: Networking VIP"
                  onChange={(e) => handleItemChange(idx, "badge", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tên Quyền Lợi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <RichTextarea
                  label="Mô Tả Chi Tiết *"
                  value={item.description}
                  onChange={(val) => handleItemChange(idx, "description", val)}
                  rows={2.5}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add button at bottom (repeated for convenience) */}
        <button
          type="button"
          onClick={addItem}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 hover:border-slate-900 hover:bg-slate-50 text-slate-700 hover:text-slate-900 py-4 rounded-2xl text-xs font-bold transition-all bg-white"
        >
          <Plus className="w-4 h-4" />
          Thêm Quyền Lợi Mới
        </button>
      </div>
    </div>
  );
}
