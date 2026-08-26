"use client";

import { useState, useEffect } from "react";
import { StatisticsContent, StatisticItem, DEFAULT_STATISTICS } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { useAutoSave } from "@/hooks/useAutoSave";
import AutoSaveHeaderBadge from "@/components/admin/AutoSaveHeaderBadge";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, MapPin, Building2, Handshake, Calendar, Banknote, Users, Globe2, Store } from "lucide-react";

interface StatisticsEditorProps {
  initialStats: StatisticsContent;
  onSaveSuccess?: (updatedStats: StatisticsContent) => void;
}

export default function StatisticsEditor({ initialStats, onSaveSuccess }: StatisticsEditorProps) {
  const [stats, setStats] = useState<StatisticsContent>({
    items: initialStats?.items && initialStats.items.length > 0 ? initialStats.items : DEFAULT_STATISTICS.items,
  });

  useEffect(() => {
    if (initialStats) {
      setStats({
        items: initialStats.items && initialStats.items.length > 0 ? initialStats.items : DEFAULT_STATISTICS.items,
      });
    }
  }, [initialStats]);

  const { saveStatus, lastSavedTime, errorMessage, saveNow } = useAutoSave(
    "statistics",
    stats,
    { onSaveSuccess }
  );

  const handleItemChange = (index: number, field: keyof StatisticItem, value: any) => {
    const updated = [...stats.items];
    updated[index] = { ...updated[index], [field]: value };
    setStats({ ...stats, items: updated });
  };

  const addItem = () => {
    const newItem: StatisticItem = {
      id: `stat-${Date.now()}`,
      value: 100,
      suffix: "+",
      label: "Mục Thống Kê Mới",
      subtext: "Mô tả chi tiết",
      iconName: "MapPin",
    };
    setStats({ ...stats, items: [...stats.items, newItem] });
  };

  const removeItem = (index: number) => {
    if (stats.items.length <= 1) {
      alert("Cần giữ lại ít nhất 1 mục thống kê!");
      return;
    }
    const updated = stats.items.filter((_, i) => i !== index);
    setStats({ ...stats, items: updated });
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">03 · Con Số Thống Kê Nổi Bật (Statistics)</h2>
          <p className="text-xs text-slate-500 mt-1">Thêm, sửa, xóa và thay đổi các chỉ số thống kê ấn tượng hiển thị trên website.</p>
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
            <Plus className="w-4 h-4" />
            Thêm Chỉ Số
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.items.map((item, idx) => (
          <div key={item.id || idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm relative group">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase">MỤC THỐNG KÊ #{idx + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Xóa mục này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hậu Vị (Suffix: +, ++, NGÀY...)</label>
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
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Biểu Tượng (Icon)</label>
                <select
                  value={item.iconName || "MapPin"}
                  onChange={(e) => handleItemChange(idx, "iconName", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="MapPin">MapPin (Địa điểm / Tỉnh thành)</option>
                  <option value="Building2">Building2 (Doanh nghiệp)</option>
                  <option value="Handshake">Handshake (Gian hàng / Bắt tay)</option>
                  <option value="Calendar">Calendar (Sự kiện / MOU)</option>
                  <option value="Banknote">Banknote (Quỹ đầu tư / Tài chính)</option>
                  <option value="Users">Users (Đại biểu / Con người)</option>
                  <option value="Globe2">Globe2 (Quốc tế / FDI)</option>
                  <option value="Store">Store (Gian hàng)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dòng Phụ Trợ (Subtext)</label>
                <input
                  type="text"
                  value={item.subtext || ""}
                  onChange={(e) => handleItemChange(idx, "subtext", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                  placeholder="Không bắt buộc"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-6 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm Mục Thống Kê Mới
        </button>
      </div>
    </div>
  );
}
