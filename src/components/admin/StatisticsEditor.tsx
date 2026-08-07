"use client";

import { useState } from "react";
import { StatisticsContent, StatisticItem } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface StatisticsEditorProps {
  initialStats: StatisticsContent;
}

export default function StatisticsEditor({ initialStats }: StatisticsEditorProps) {
  const [stats, setStats] = useState<StatisticsContent>(initialStats);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleItemChange = (index: number, field: keyof StatisticItem, value: any) => {
    const updated = [...stats.items];
    updated[index] = { ...updated[index], [field]: value };
    setStats({ ...stats, items: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("statistics", stats);
    setSaving(false);

    if (res.success) {
      setMsg({ type: "success", text: "Đã cập nhật các con số thống kê thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Không thể lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Con Số Thống Kê Nổi Bật</h2>
          <p className="text-xs text-slate-500 mt-1">Thay đổi giá trị các con số ấn tượng (500+ Doanh chủ, 100+ Gian hàng, 50+ B2B matching...).</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.items.map((item, idx) => (
          <div key={item.id || idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>MỤC THỐNG KÊ #{idx + 1}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Giá Trị Số (Number)</label>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => handleItemChange(idx, "value", Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hậu Vị (Suffix: +, NGÀY...)</label>
                <input
                  type="text"
                  value={item.suffix}
                  onChange={(e) => handleItemChange(idx, "suffix", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nhãn Tiêu Đề (Label)</label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleItemChange(idx, "label", e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dòng Mô Tả Phụ (Subtext)</label>
              <input
                type="text"
                value={item.subtext}
                onChange={(e) => handleItemChange(idx, "subtext", e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
