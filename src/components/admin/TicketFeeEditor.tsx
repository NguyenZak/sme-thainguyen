"use client";

import { useState, useEffect } from "react";
import { TicketFeeContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";

interface TicketFeeEditorProps {
  initialFee: TicketFeeContent;
  onSaveSuccess?: (updatedFee: TicketFeeContent) => void;
}

export default function TicketFeeEditor({ initialFee, onSaveSuccess }: TicketFeeEditorProps) {
  const [fee, setFee] = useState<TicketFeeContent>(initialFee);

  useEffect(() => {
    setFee(initialFee);
  }, [initialFee]);

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
      onSaveSuccess?.(fee);
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Giá Vé Ưu Đãi (Giá Bán - VNĐ) <span className="text-emerald-600 font-bold">*(VD: 1450000)*</span>
            </label>
            <input
              type="number"
              value={fee.priceVND || ""}
              onChange={(e) => setFee({ ...fee, priceVND: Number(e.target.value) })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-bold"
            />
            {fee.priceVND ? (
              <p className="text-[11px] text-slate-500 mt-1">
                Hiển thị: <strong className="text-amber-600">{Number(fee.priceVND).toLocaleString("vi-VN")} VNĐ</strong>
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Giá Gốc / Giá Gạch (VNĐ) <span className="text-amber-600 font-bold">*(Hiển thị gạch ngang, VD: 2500000)*</span>
            </label>
            <input
              type="number"
              value={fee.originalPriceVND || ""}
              onChange={(e) => setFee({ ...fee, originalPriceVND: Number(e.target.value) })}
              placeholder="VD: 2500000"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-medium"
            />
            {fee.originalPriceVND ? (
              <p className="text-[11px] text-slate-500 mt-1">
                Hiển thị: <span className="line-through text-slate-400 font-semibold">{Number(fee.originalPriceVND).toLocaleString("vi-VN")} VNĐ</span>
                {fee.priceVND && fee.originalPriceVND > fee.priceVND && (
                  <span className="ml-1 text-red-600 font-bold">
                    (-{Math.round(((fee.originalPriceVND - fee.priceVND) / fee.originalPriceVND) * 100)}%)
                  </span>
                )}
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Huy Hiệu Vé (Ticket Badge)</label>
            <input
              type="text"
              value={fee.ticketBadgeText || ""}
              onChange={(e) => setFee({ ...fee, ticketBadgeText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chữ Nút Đăng Ký (CTA Text)</label>
            <input
              type="text"
              value={fee.ctaText || ""}
              onChange={(e) => setFee({ ...fee, ctaText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cam Kết & Bảo Hành (Guarantee Text)</label>
            <input
              type="text"
              value={fee.guaranteeText || ""}
              onChange={(e) => setFee({ ...fee, guaranteeText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Vé Ưu Đãi Đăng Ký Sớm & Thanh Tiến Độ (Early Bird Progress) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">TIẾN ĐỘ VÉ ƯU ĐÃI ĐĂNG KÝ SỚM</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tùy chỉnh dòng thông báo và thanh số lượng suất vé ưu đãi còn lại.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu Đề Dòng Vé Ưu Đãi
            </label>
            <input
              type="text"
              value={fee.earlyBirdLabel || ""}
              placeholder="VD: Vé ưu đãi Đăng ký sớm"
              onChange={(e) => setFee({ ...fee, earlyBirdLabel: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Số Suất Còn Lại (Suất) <span className="text-amber-600 font-bold">*(VD: 15)*</span>
            </label>
            <input
              type="number"
              value={fee.remainingSlots !== undefined ? fee.remainingSlots : ""}
              placeholder="VD: 15"
              onChange={(e) => {
                const remaining = Number(e.target.value);
                const total = fee.totalSlots || 100;
                setFee({
                  ...fee,
                  remainingSlots: remaining,
                  earlyBirdSlotText: `Còn ${remaining} / ${total} suất`,
                });
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tổng Số Suất Ban Đầu <span className="text-slate-500">*(VD: 100)*</span>
            </label>
            <input
              type="number"
              value={fee.totalSlots !== undefined ? fee.totalSlots : ""}
              placeholder="VD: 100"
              onChange={(e) => {
                const total = Number(e.target.value);
                const remaining = fee.remainingSlots || 15;
                setFee({
                  ...fee,
                  totalSlots: total,
                  earlyBirdSlotText: `Còn ${remaining} / ${total} suất`,
                });
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-medium"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chữ Hiển Thị Số Suất Tùy Chọn <span className="text-slate-500">*(Mặc định tự sinh: &quot;Còn 15 / 100 suất&quot;)*</span>
            </label>
            <input
              type="text"
              value={fee.earlyBirdSlotText || ""}
              placeholder="VD: Còn 15 / 100 suất"
              onChange={(e) => setFee({ ...fee, earlyBirdSlotText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-medium"
            />
          </div>
        </div>

        {/* Live Preview Bar */}
        <div className="pt-2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Xem Trước Hiển Thị Thực Tế:</label>
          <div className="bg-[#0B3026] p-4 rounded-2xl border border-emerald-800 space-y-2 text-xs text-emerald-200">
            <div className="flex items-center justify-between font-bold">
              <span className="text-emerald-100">{fee.earlyBirdLabel || "Vé ưu đãi Đăng ký sớm"}</span>
              <span className="text-amber-400 font-extrabold">{fee.earlyBirdSlotText || `Còn ${fee.remainingSlots || 15} / ${fee.totalSlots || 100} suất`}</span>
            </div>
            <div className="w-full h-2.5 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800">
              <div
                className="h-full bg-gradient-to-r from-[#22C55E] to-[#F59E0B] rounded-full transition-all duration-300"
                style={{
                  width: `${
                    fee.totalSlots && fee.totalSlots > 0
                      ? Math.min(100, Math.max(5, Math.round((((fee.totalSlots || 100) - (fee.remainingSlots || 15)) / (fee.totalSlots || 100)) * 100)))
                      : 85
                  }%`,
                }}
              />
            </div>
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
