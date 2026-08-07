"use client";

import { useState } from "react";
import { TicketFeeContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";

interface TicketFeeEditorProps {
  initialFee: TicketFeeContent;
}

export default function TicketFeeEditor({ initialFee }: TicketFeeEditorProps) {
  const [fee, setFee] = useState<TicketFeeContent>(initialFee);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInclusionChange = (index: number, value: string) => {
    const updated = [...fee.inclusions];
    updated[index] = value;
    setFee({ ...fee, inclusions: updated });
  };

  const addInclusion = () => {
    setFee({ ...fee, inclusions: [...fee.inclusions, "Quyền lợi tham dự mới"] });
  };

  const removeInclusion = (index: number) => {
    const updated = fee.inclusions.filter((_, i) => i !== index);
    setFee({ ...fee, inclusions: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("ticket_fee", fee);
    setSaving(false);

    if (res.success) {
      setMsg({ type: "success", text: "Đã cập nhật giá vé & quyền lợi gói tham dự thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Không thể lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Chi Phí Tham Dự & Gói Vé</h2>
          <p className="text-xs text-slate-500 mt-1">Thay đổi giá vé tham dự, giá gốc trước giảm, danh sách quyền lợi và chính sách hoàn tiền.</p>
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

      {/* Tiêu Đề Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">CẤU HÌNH TIÊU ĐỀ PHẦN LỆ PHÍ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Thẻ</label>
            <input
              type="text"
              value={fee.badge}
              onChange={(e) => setFee({ ...fee, badge: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Chính</label>
            <input
              type="text"
              value={fee.title}
              onChange={(e) => setFee({ ...fee, title: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phụ Đề Mô Tả Ngắn</label>
            <input
              type="text"
              value={fee.subtitle}
              onChange={(e) => setFee({ ...fee, subtitle: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Giá Vé & Thông Tin Ưu Đãi */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">GIÁ VÉ & THÔNG TIN ƯU ĐÃI</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Giá Vé Ưu Đãi (VNĐ)</label>
            <input
              type="number"
              value={fee.priceVND}
              onChange={(e) => setFee({ ...fee, priceVND: Number(e.target.value) })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Giá Gốc Niêm Yết (VNĐ)</label>
            <input
              type="number"
              value={fee.originalPriceVND}
              onChange={(e) => setFee({ ...fee, originalPriceVND: Number(e.target.value) })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Huy Hiệu Vé (Ticket Badge)</label>
            <input
              type="text"
              value={fee.ticketBadgeText}
              onChange={(e) => setFee({ ...fee, ticketBadgeText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chữ Nút Đăng Ký (CTA Text)</label>
            <input
              type="text"
              value={fee.ctaText}
              onChange={(e) => setFee({ ...fee, ctaText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cam Kết & Bảo Hành (Guarantee Text)</label>
            <input
              type="text"
              value={fee.guaranteeText}
              onChange={(e) => setFee({ ...fee, guaranteeText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Danh sách dịch vụ bao gồm trong vé */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">DANH SÁCH QUYỀN LỢI ĐI KÈM VÉ</h3>
          <button
            type="button"
            onClick={addInclusion}
            className="inline-flex items-center gap-1 text-[11px] text-slate-900 hover:text-black font-bold"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Quyền Lợi
          </button>
        </div>

        <div className="space-y-2">
          {fee.inclusions.map((inc, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={inc}
                onChange={(e) => handleInclusionChange(idx, e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeInclusion(idx)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
