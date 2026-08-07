"use client";

import { useState } from "react";
import { BenefitsContent, BenefitItem } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface BenefitsEditorProps {
  initialBenefits: BenefitsContent;
}

export default function BenefitsEditor({ initialBenefits }: BenefitsEditorProps) {
  const [benefits, setBenefits] = useState<BenefitsContent>(initialBenefits);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleItemChange = (index: number, field: keyof BenefitItem, value: any) => {
    const updated = [...benefits.items];
    updated[index] = { ...updated[index], [field]: value };
    setBenefits({ ...benefits, items: updated });
  };

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
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Giá Trị & Quyền Lợi Tham Gia</h2>
          <p className="text-xs text-slate-400">Chỉnh sửa 6 thẻ giá trị nổi bật dành cho doanh nhân và khách tham dự.</p>
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

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
            msg.type === "success"
              ? "bg-emerald-950/70 border border-emerald-800 text-emerald-300"
              : "bg-red-950/70 border border-red-800 text-red-300"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      {/* Header text */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">TIÊU ĐỀ PHẦN QUYỀN LỢI</h3>
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

      {/* 6 Benefit Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.items.map((item, idx) => (
          <div key={item.id || idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>QUYỀN LỢI #{idx + 1}</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Tên Quyền Lợi</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Mô Tả Chi Tiết</label>
              <textarea
                rows={3}
                value={item.description}
                onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
