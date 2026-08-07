"use client";

import { useState } from "react";
import { RegistrationContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "@/components/ui/Toast";

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

      {/* ── Custom Email Templates for 3 Form Types ───────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            ✉️ CẤU HÌNH MẪU EMAIL XÁC NHẬN TỰ ĐỘNG CHO 3 FORM (KÈM RICH TEXT & POSTER)
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Tùy chỉnh tiêu đề, nội dung HTML Rich Text & Tải ảnh Poster đính kèm ở đầu Email gửi tự động cho khách hàng.
          </p>
        </div>

        {/* Helper Toolbar Components */}
        {(() => {
          const handlePosterUpload = (formType: "delegate" | "sponsor" | "booth", file?: File | null) => {
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
              toast.warning("Ảnh quá lớn!", "Vui lòng chọn file dưới 5MB.");
              return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = e.target?.result as string;
              if (formType === "delegate") {
                setRegistration({ ...registration, delegatePosterUrl: url });
              } else if (formType === "sponsor") {
                setRegistration({ ...registration, sponsorPosterUrl: url });
              } else {
                setRegistration({ ...registration, boothPosterUrl: url });
              }
              toast.success("Tải Poster thành công! 🖼️", "Đã cập nhật ảnh poster cho Email.");
            };
            reader.readAsDataURL(file);
          };

          const insertTag = (field: "delegateEmailBody" | "sponsorEmailBody" | "boothEmailBody", tag: string) => {
            const current = registration[field] || "";
            setRegistration({ ...registration, [field]: current + " " + tag });
          };

          return (
            <div className="space-y-6">
              {/* 1. Email Đại Biểu */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                    🎟️ 1. MẪU EMAIL XÁC NHẬN - ĐĂNG KÝ ĐẠI BIỂU
                  </h4>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">Form 1</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tiêu đề Email (Subject)</label>
                  <input
                    type="text"
                    value={registration.delegateEmailSubject || ""}
                    onChange={(e) => setRegistration({ ...registration, delegateEmailSubject: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none font-semibold"
                  />
                </div>

                {/* Poster Uploader */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-700">🖼️ Ảnh Poster Đính Kèm Ở Đầu Email</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="text"
                      placeholder="URL Ảnh Poster (https://...)"
                      value={registration.delegatePosterUrl || ""}
                      onChange={(e) => setRegistration({ ...registration, delegatePosterUrl: e.target.value })}
                      className="flex-1 w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-mono"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl shrink-0 transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Tải Ảnh Poster
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePosterUpload("delegate", e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {registration.delegatePosterUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-32 bg-slate-900 flex items-center justify-center">
                      <img src={registration.delegatePosterUrl} alt="Poster Preview" className="max-h-32 w-full object-cover" />
                      <span className="absolute bottom-2 right-2 text-[10px] bg-slate-950/80 text-white px-2 py-0.5 rounded font-mono">Xem trước Poster</span>
                    </div>
                  )}
                </div>

                {/* Rich Text Editor Body */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold text-slate-700">✍️ Trình Soạn Thảo Lời Cảm Ơn / Lời Chúc (Nội dung Email)</label>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="text-slate-400">Chèn nhanh biến:</span>
                      <button type="button" onClick={() => insertTag("delegateEmailBody", "<b>{{fullName}}</b>")} className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 font-bold">Họ tên</button>
                      <button type="button" onClick={() => insertTag("delegateEmailBody", "<b>{{company}}</b>")} className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 font-bold">Công ty</button>
                      <button type="button" onClick={() => insertTag("delegateEmailBody", "<b>{{phone}}</b>")} className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 font-bold">SĐT</button>
                    </div>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-300 border-b-0 rounded-t-xl p-2 text-xs">
                    <button type="button" onClick={() => insertTag("delegateEmailBody", "<b>nội dung in đậm</b>")} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold" title="In đậm">B</button>
                    <button type="button" onClick={() => insertTag("delegateEmailBody", "<i>nội dung in nghiêng</i>")} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded italic font-serif" title="In nghiêng">I</button>
                    <button type="button" onClick={() => insertTag("delegateEmailBody", "<u>gạch chân</u>")} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded underline" title="Gạch chân">U</button>
                    <span className="text-slate-300">|</span>
                    <button type="button" onClick={() => insertTag("delegateEmailBody", '<span style="color:#22c55e;">chữ xanh</span>')} className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded font-bold">Chữ Xanh</button>
                    <button type="button" onClick={() => insertTag("delegateEmailBody", '<span style="color:#d97706;">chữ vàng</span>')} className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded font-bold">Chữ Nổi Bật</button>
                  </div>
                  <textarea
                    rows={4}
                    value={registration.delegateEmailBody || ""}
                    onChange={(e) => setRegistration({ ...registration, delegateEmailBody: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-b-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none resize-y leading-relaxed font-mono"
                  />
                </div>
              </div>

              {/* 2. Email Nhà Tài Trợ */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                    💎 2. MẪU EMAIL XÁC NHẬN - ĐĂNG KÝ NHÀ TÀI TRỢ
                  </h4>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-bold">Form 2</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tiêu đề Email (Subject)</label>
                  <input
                    type="text"
                    value={registration.sponsorEmailSubject || ""}
                    onChange={(e) => setRegistration({ ...registration, sponsorEmailSubject: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none font-semibold"
                  />
                </div>

                {/* Poster Uploader */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-700">🖼️ Ảnh Poster Đính Kèm Ở Đầu Email</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="text"
                      placeholder="URL Ảnh Poster (https://...)"
                      value={registration.sponsorPosterUrl || ""}
                      onChange={(e) => setRegistration({ ...registration, sponsorPosterUrl: e.target.value })}
                      className="flex-1 w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-mono"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl shrink-0 transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Tải Ảnh Poster
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePosterUpload("sponsor", e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {registration.sponsorPosterUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-32 bg-slate-900 flex items-center justify-center">
                      <img src={registration.sponsorPosterUrl} alt="Poster Preview" className="max-h-32 w-full object-cover" />
                      <span className="absolute bottom-2 right-2 text-[10px] bg-slate-950/80 text-white px-2 py-0.5 rounded font-mono">Xem trước Poster</span>
                    </div>
                  )}
                </div>

                {/* Rich Text Editor Body */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold text-slate-700">✍️ Trình Soạn Thảo Lời Cảm Ơn / Lời Chúc (Nội dung Email)</label>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="text-slate-400">Chèn nhanh biến:</span>
                      <button type="button" onClick={() => insertTag("sponsorEmailBody", "<b>{{fullName}}</b>")} className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 font-bold">Họ tên</button>
                      <button type="button" onClick={() => insertTag("sponsorEmailBody", "<b>{{company}}</b>")} className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 font-bold">Công ty</button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white border border-slate-300 border-b-0 rounded-t-xl p-2 text-xs">
                    <button type="button" onClick={() => insertTag("sponsorEmailBody", "<b>nội dung in đậm</b>")} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold" title="In đậm">B</button>
                    <button type="button" onClick={() => insertTag("sponsorEmailBody", "<i>nội dung in nghiêng</i>")} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded italic font-serif" title="In nghiêng">I</button>
                    <button type="button" onClick={() => insertTag("sponsorEmailBody", "<u>gạch chân</u>")} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded underline" title="Gạch chân">U</button>
                  </div>
                  <textarea
                    rows={4}
                    value={registration.sponsorEmailBody || ""}
                    onChange={(e) => setRegistration({ ...registration, sponsorEmailBody: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-b-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none resize-y leading-relaxed font-mono"
                  />
                </div>
              </div>

              {/* 3. Email Gian Hàng */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    🎪 3. MẪU EMAIL XÁC NHẬN - ĐĂNG KÝ GIAN HÀNG TRIỂN LÃM
                  </h4>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">Form 3</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tiêu đề Email (Subject)</label>
                  <input
                    type="text"
                    value={registration.boothEmailSubject || ""}
                    onChange={(e) => setRegistration({ ...registration, boothEmailSubject: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none font-semibold"
                  />
                </div>

                {/* Poster Uploader */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-700">🖼️ Ảnh Poster Đính Kèm Ở Đầu Email</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="text"
                      placeholder="URL Ảnh Poster (https://...)"
                      value={registration.boothPosterUrl || ""}
                      onChange={(e) => setRegistration({ ...registration, boothPosterUrl: e.target.value })}
                      className="flex-1 w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-mono"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl shrink-0 transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Tải Ảnh Poster
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePosterUpload("booth", e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {registration.boothPosterUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-32 bg-slate-900 flex items-center justify-center">
                      <img src={registration.boothPosterUrl} alt="Poster Preview" className="max-h-32 w-full object-cover" />
                      <span className="absolute bottom-2 right-2 text-[10px] bg-slate-950/80 text-white px-2 py-0.5 rounded font-mono">Xem trước Poster</span>
                    </div>
                  )}
                </div>

                {/* Rich Text Editor Body */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold text-slate-700">✍️ Trình Soạn Thảo Lời Cảm Ơn / Lời Chúc (Nội dung Email)</label>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="text-slate-400">Chèn nhanh biến:</span>
                      <button type="button" onClick={() => insertTag("boothEmailBody", "<b>{{fullName}}</b>")} className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 font-bold">Họ tên</button>
                      <button type="button" onClick={() => insertTag("boothEmailBody", "<b>{{company}}</b>")} className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 font-bold">Công ty</button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white border border-slate-300 border-b-0 rounded-t-xl p-2 text-xs">
                    <button type="button" onClick={() => insertTag("boothEmailBody", "<b>nội dung in đậm</b>")} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold" title="In đậm">B</button>
                    <button type="button" onClick={() => insertTag("boothEmailBody", "<i>nội dung in nghiêng</i>")} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded italic font-serif" title="In nghiêng">I</button>
                    <button type="button" onClick={() => insertTag("boothEmailBody", "<u>gạch chân</u>")} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded underline" title="Gạch chân">U</button>
                  </div>
                  <textarea
                    rows={4}
                    value={registration.boothEmailBody || ""}
                    onChange={(e) => setRegistration({ ...registration, boothEmailBody: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-b-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none resize-y leading-relaxed font-mono"
                  />
                </div>
              </div>
            </div>
          );
        })()}
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
