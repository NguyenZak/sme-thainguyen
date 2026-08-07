"use client";

import { useState } from "react";
import { RegistrationContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";

interface RegistrationEditorProps {
  initialRegistration: RegistrationContent;
}

export default function RegistrationEditor({ initialRegistration }: RegistrationEditorProps) {
  const [registration, setRegistration] = useState<RegistrationContent>(initialRegistration);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleTierChange = (index: number, value: string) => {
    const updated = [...registration.sponsorTiers];
    updated[index] = value;
    setRegistration({ ...registration, sponsorTiers: updated });
  };

  const handleBoothChange = (index: number, value: string) => {
    const updated = [...registration.boothOptions];
    updated[index] = value;
    setRegistration({ ...registration, boothOptions: updated });
  };

  const addSponsorTier = () => {
    setRegistration({ ...registration, sponsorTiers: [...registration.sponsorTiers, "Gói tài trợ mới"] });
  };

  const addBoothOption = () => {
    setRegistration({ ...registration, boothOptions: [...registration.boothOptions, "Gian hàng mới"] });
  };

  const removeSponsorTier = (index: number) => {
    setRegistration({
      ...registration,
      sponsorTiers: registration.sponsorTiers.filter((_, idx) => idx !== index),
    });
  };

  const removeBoothOption = (index: number) => {
    setRegistration({
      ...registration,
      boothOptions: registration.boothOptions.filter((_, idx) => idx !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("registration", registration);
    setSaving(false);

    if (res.success) {
      setMsg({ type: "success", text: "Đã lưu cấu hình phần Đăng ký thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Không thể lưu thay đổi." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Nội dung Form Đăng ký</h2>
          <p className="text-xs text-slate-500 mt-1">Chỉnh sửa nội dung, tiêu đề, các tab lựa chọn, gói tài trợ và các tùy chọn gian hàng.</p>
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

      {/* Header Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">CẤU HÌNH TIÊU ĐỀ PHẦN ĐĂNG KÝ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Section</label>
            <input
              type="text"
              value={registration.sectionBadge}
              onChange={(e) => setRegistration({ ...registration, sectionBadge: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề Section</label>
            <input
              type="text"
              value={registration.sectionTitle}
              onChange={(e) => setRegistration({ ...registration, sectionTitle: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phụ đề mô tả ngắn</label>
            <textarea
              rows={3}
              value={registration.sectionDescription}
              onChange={(e) => setRegistration({ ...registration, sectionDescription: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs Title */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">TÊN 3 TAB ĐĂNG KÝ MẪU</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">🎟️ Tab 1: Đại biểu</label>
            <input
              type="text"
              value={registration.delegateTab}
              onChange={(e) => setRegistration({ ...registration, delegateTab: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">💎 Tab 2: Nhà tài trợ</label>
            <input
              type="text"
              value={registration.sponsorTab}
              onChange={(e) => setRegistration({ ...registration, sponsorTab: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">🎪 Tab 3: Gian hàng</label>
            <input
              type="text"
              value={registration.boothTab}
              onChange={(e) => setRegistration({ ...registration, boothTab: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tab Introductions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">NỘI DUNG GIỚI THIỆU TỪNG TAB</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả Tab Đại biểu</label>
            <input
              type="text"
              value={registration.delegateIntro}
              onChange={(e) => setRegistration({ ...registration, delegateIntro: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả Tab Nhà tài trợ</label>
            <input
              type="text"
              value={registration.sponsorIntro}
              onChange={(e) => setRegistration({ ...registration, sponsorIntro: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả Tab Gian hàng</label>
            <input
              type="text"
              value={registration.boothIntro}
              onChange={(e) => setRegistration({ ...registration, boothIntro: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Sponsor Tiers Option List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">DANH SÁCH CÁC GÓI TÀI TRỢ TRONG DROPDOWN</h3>
          <button
            type="button"
            onClick={addSponsorTier}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 hover:text-black bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Gói
          </button>
        </div>
        <div className="space-y-3">
          {registration.sponsorTiers.map((tier, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={tier}
                onChange={(e) => handleTierChange(index, e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeSponsorTier(index)}
                className="p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
                title="Xóa gói tài trợ này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booth Options List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">TÙY CHỌN GIAN HÀNG TRONG DROPDOWN</h3>
          <button
            type="button"
            onClick={addBoothOption}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 hover:text-black bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Gian Hàng
          </button>
        </div>
        <div className="space-y-3">
          {registration.boothOptions.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleBoothChange(index, e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeBoothOption(index)}
                className="p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
                title="Xóa tùy chọn này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Labels */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">NHÃN CÁC PHÂN LOẠI TRÊN MOBILE</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nhãn Đại biểu Mobile</label>
            <input
              type="text"
              value={registration.mobileDelegateLabel}
              onChange={(e) => setRegistration({ ...registration, mobileDelegateLabel: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nhãn Tài trợ Mobile</label>
            <input
              type="text"
              value={registration.mobileSponsorLabel}
              onChange={(e) => setRegistration({ ...registration, mobileSponsorLabel: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nhãn Gian hàng Mobile</label>
            <input
              type="text"
              value={registration.mobileBoothLabel}
              onChange={(e) => setRegistration({ ...registration, mobileBoothLabel: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button Text */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">NỘI DUNG NÚT GỬI ĐĂNG KÝ</h3>
        <input
          type="text"
          value={registration.submitButtonText}
          onChange={(e) => setRegistration({ ...registration, submitButtonText: e.target.value })}
          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-bold"
        />
      </div>
    </form>
  );
}
