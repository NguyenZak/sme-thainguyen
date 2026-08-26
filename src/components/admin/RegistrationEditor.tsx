"use client";

import { useState, useEffect } from "react";
import { RegistrationContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { useAutoSave } from "@/hooks/useAutoSave";
import AutoSaveHeaderBadge from "@/components/admin/AutoSaveHeaderBadge";
import RichTextarea from "@/components/admin/RichTextarea";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, Upload, Eye, Smartphone, Monitor, Mail, Maximize2, X, Sparkles, Edit3, Image as ImageIcon, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/Toast";

interface RegistrationEditorProps {
  initialRegistration: RegistrationContent;
  onSaveSuccess?: (updatedRegistration: RegistrationContent) => void;
}

type FormType = "delegate" | "sponsor" | "booth";

export default function RegistrationEditor({ initialRegistration, onSaveSuccess }: RegistrationEditorProps) {
  const [registration, setRegistration] = useState<RegistrationContent>(initialRegistration);

  useEffect(() => {
    setRegistration(initialRegistration);
  }, [initialRegistration]);

  const { saveStatus, lastSavedTime, errorMessage, saveNow } = useAutoSave(
    "registration",
    registration,
    { onSaveSuccess }
  );

  // Active view mode per form type: "inline_edit" (default direct edit) or "client_preview" (evaluated demo)
  const [activeMode, setActiveMode] = useState<Record<FormType, "inline_edit" | "client_preview">>({
    delegate: "inline_edit",
    sponsor: "inline_edit",
    booth: "inline_edit",
  });

  // Device view inside live preview: "desktop" (660px) or "mobile" (375px)
  const [previewDevice, setPreviewDevice] = useState<Record<FormType, "desktop" | "mobile">>({
    delegate: "desktop",
    sponsor: "desktop",
    booth: "desktop",
  });

  // Modal Preview state
  const [modalFormType, setModalFormType] = useState<FormType | null>(null);

  // Show poster URL input toggle per form
  const [showPosterInput, setShowPosterInput] = useState<Record<FormType, boolean>>({
    delegate: false,
    sponsor: false,
    booth: false,
  });

  // Test data for dynamic tags replacement in preview
  const [testUser, setTestUser] = useState({
    fullName: "Zak",
    company: "Golden",
    phone: "0388925432",
    email: "nguyenvanzak@gmail.com",
    position: "Giám đốc",
  });

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

  // Helper to render interpolated HTML string for recipient preview
  const renderInterpolatedBody = (rawBody?: string) => {
    if (!rawBody) return "";
    let content = rawBody
      .replace(/\{\{fullName\}\}/g, testUser.fullName)
      .replace(/\{\{company\}\}/g, testUser.company)
      .replace(/\{\{phone\}\}/g, testUser.phone)
      .replace(/\{\{email\}\}/g, testUser.email)
      .replace(/\{\{registrationId\}\}/g, "SME2026-144380")
      .replace(/\{\{registrationType\}\}/g, "1 gói chính (02 ĐB) + Ăn trưa 20/09")
      .replace(/\{\{totalCalculatedAmount\}\}/g, "1.650.000 VNĐ");
    return content;
  };

  // Helper to handle uploading poster image
  const handlePosterUpload = (formType: FormType, file?: File | null) => {
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

  // Insert tag helper
  const insertTagToBody = (field: "delegateEmailBody" | "sponsorEmailBody" | "boothEmailBody", tag: string) => {
    const current = registration[field] || "";
    setRegistration({ ...registration, [field]: current + " " + tag });
  };

  // Render Visual Email Canvas (Direct Inline Edit or Evaluated Client Preview)
  const renderVisualEmailCanvas = (formType: FormType, isModal = false) => {
    let subjectField: "delegateEmailSubject" | "sponsorEmailSubject" | "boothEmailSubject";
    let posterField: "delegatePosterUrl" | "sponsorPosterUrl" | "boothPosterUrl";
    let bodyField: "delegateEmailBody" | "sponsorEmailBody" | "boothEmailBody";
    let typeNameField: "delegateEmailTypeName" | "sponsorEmailTypeName" | "boothEmailTypeName";
    let defaultTypeName = "";

    if (formType === "delegate") {
      subjectField = "delegateEmailSubject";
      posterField = "delegatePosterUrl";
      bodyField = "delegateEmailBody";
      typeNameField = "delegateEmailTypeName";
      defaultTypeName = "Đăng ký tham gia (1 vé)";
    } else if (formType === "sponsor") {
      subjectField = "sponsorEmailSubject";
      posterField = "sponsorPosterUrl";
      bodyField = "sponsorEmailBody";
      typeNameField = "sponsorEmailTypeName";
      defaultTypeName = "Đăng ký Nhà tài trợ & Đối tác";
    } else {
      subjectField = "boothEmailSubject";
      posterField = "boothPosterUrl";
      bodyField = "boothEmailBody";
      typeNameField = "boothEmailTypeName";
      defaultTypeName = "Đăng ký Gian hàng Triển lãm";
    }

    const subject = registration[subjectField] || "";
    const posterUrl = registration[posterField] || "";
    const bodyText = registration[bodyField] || "";
    const typeName = registration[typeNameField] || defaultTypeName;

    const mode = activeMode[formType];
    const isDirectEdit = mode === "inline_edit";
    const device = previewDevice[formType];
    const isMobileView = device === "mobile";

    return (
      <div className="space-y-3">
        {/* Top Control Bar: Mode Toggle & Viewport Switcher */}
        <div className="bg-slate-100 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 border border-slate-200 text-xs">
          {/* Left: Interactive Mode Switcher */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMode({ ...activeMode, [formType]: "inline_edit" })}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                isDirectEdit ? "bg-amber-500 text-slate-950 shadow-sm font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Sửa trực tiếp trên Email
            </button>
            <button
              type="button"
              onClick={() => setActiveMode({ ...activeMode, [formType]: "client_preview" })}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                !isDirectEdit ? "bg-emerald-600 text-white shadow-sm font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Xem thực tế thế biến (Zak)
            </button>
          </div>

          {/* Right: Device View Controls */}
          <div className="flex items-center gap-1.5">
            {!isDirectEdit && (
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Test khách:</span>
                <input
                  type="text"
                  value={testUser.fullName}
                  onChange={(e) => setTestUser({ ...testUser, fullName: e.target.value })}
                  className="w-16 bg-slate-50 border border-slate-300 rounded px-1 text-[11px] font-bold"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setPreviewDevice({ ...previewDevice, [formType]: "desktop" })}
              className={`p-1.5 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                !isMobileView ? "bg-slate-900 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
              title="Giao diện Máy tính"
            >
              <Monitor className="w-3.5 h-3.5" /> PC
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice({ ...previewDevice, [formType]: "mobile" })}
              className={`p-1.5 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                isMobileView ? "bg-slate-900 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
              title="Giao diện Điện thoại"
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>

            {!isModal && (
              <button
                type="button"
                onClick={() => setModalFormType(formType)}
                className="ml-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
              >
                <Maximize2 className="w-3 h-3" /> Phóng To
              </button>
            )}
          </div>
        </div>

        {/* Outer Email Client Window Frame */}
        <div
          className={`mx-auto transition-all duration-300 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ${
            isMobileView ? "max-w-[375px]" : "w-full max-w-[660px]"
          }`}
        >
          {/* Email Client Header Bar */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" />
              <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
              <span className="text-[11px] text-slate-400 font-mono ml-2 truncate">Gmail Email Editor</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded font-mono shrink-0">
              {isDirectEdit ? "✏️ ĐANG SỬA TRỰC TIẾP" : "👁️ XEM THỰC TẾ"}
            </div>
          </div>

          {/* Email Subject Bar (Directly Editable inside Gmail Frame) */}
          <div className="bg-slate-900 p-4 border-b border-slate-800 text-white space-y-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> TIÊU ĐỀ EMAIL (SUBJECT):
              </label>
              {isDirectEdit ? (
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setRegistration({ ...registration, [subjectField]: e.target.value })}
                  className="w-full bg-slate-800 text-amber-200 font-bold text-xs sm:text-sm border border-amber-400/50 rounded-xl px-3 py-2 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all shadow-inner"
                  placeholder="Nhập tiêu đề email trực tiếp tại đây..."
                />
              ) : (
                <h5 className="text-xs sm:text-sm font-bold text-slate-100 leading-snug break-words">
                  {subject || "(Chưa có tiêu đề Email)"}
                </h5>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-300 pt-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold flex items-center justify-center text-[11px] shrink-0 shadow">
                SME
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-200 text-[11px] truncate">
                  Ban Tổ Chức SME VIỆT NAM 2026 <span className="text-slate-400 font-normal">&lt;btochuc@smevietnam2026.vn&gt;</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Tới: <span className="text-amber-300 font-mono">{testUser.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actual Email Card Canvas */}
          <div className="bg-slate-100 p-3 sm:p-5">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 font-sans">
              {/* Header Banner - Forest Green */}
              <div className="bg-[#0d3b2e] px-6 py-7 text-center text-white space-y-1.5 border-b border-[#124d3d] relative">
                <h3 className="text-base sm:text-lg font-extrabold tracking-wide uppercase text-white leading-tight">
                  DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026
                </h3>
                <p className="text-xs font-semibold text-[#86efac] tracking-wide">
                  May Plaza Hotel Thái Nguyên | 18 - 20/09/2026
                </p>
              </div>

              {/* Poster Image Section with Inline Upload Controls */}
              <div className="relative bg-slate-950 border-b border-slate-200 group">
                {posterUrl ? (
                  <div className="w-full max-h-60 overflow-hidden flex items-center justify-center bg-slate-900">
                    <img src={posterUrl} alt="Poster Event" className="w-full object-cover max-h-60" />
                  </div>
                ) : isDirectEdit ? (
                  <div className="p-4 text-center bg-slate-900 text-slate-400 text-xs border-b border-dashed border-slate-700">
                    <p className="font-semibold text-slate-300">🖼️ Chưa có Ảnh Poster đính kèm ở đầu Email</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Bấm nút bên dưới để tải ảnh poster từ máy tính hoặc dán link URL.</p>
                  </div>
                ) : null}

                {/* Inline Poster Action Bar (When Direct Editing) */}
                {isDirectEdit && (
                  <div className="bg-slate-900/90 backdrop-blur-xs p-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] rounded-lg shadow transition-colors">
                        <Upload className="w-3.5 h-3.5" /> Tải Ảnh Poster
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePosterUpload(formType, e.target.files?.[0])}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPosterInput({ ...showPosterInput, [formType]: !showPosterInput[formType] })}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> {showPosterInput[formType] ? "Đóng URL" : "Dán Link URL"}
                      </button>
                    </div>

                    {posterUrl && (
                      <button
                        type="button"
                        onClick={() => setRegistration({ ...registration, [posterField]: "" })}
                        className="px-2.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 text-[11px] font-bold rounded-lg border border-red-800 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa Poster
                      </button>
                    )}
                  </div>
                )}

                {/* Poster URL Direct Input Dropdown */}
                {isDirectEdit && showPosterInput[formType] && (
                  <div className="bg-slate-900 p-3 border-t border-slate-800 space-y-1">
                    <label className="block text-[10px] font-mono text-slate-400">URL Hình Ảnh Poster (https://...):</label>
                    <input
                      type="text"
                      value={posterUrl}
                      onChange={(e) => setRegistration({ ...registration, [posterField]: e.target.value })}
                      placeholder="Dán link ảnh Poster tại đây..."
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>

              {/* Email Content Body Container */}
              <div className="p-5 sm:p-7 space-y-5 text-slate-800 text-xs sm:text-sm leading-relaxed">
                {/* Greeting & Directly Editable Body Paragraph */}
                <div className="space-y-3">
                  <p className="text-slate-900 font-normal text-xs sm:text-sm">
                    Kính gửi{" "}
                    <strong className="font-bold text-slate-950">
                      {isDirectEdit ? "{{fullName}}" : testUser.fullName}
                    </strong>
                    ,
                  </p>

                  {/* Direct Inline Editor vs Evaluated Preview */}
                  {isDirectEdit ? (
                    <div className="space-y-2 bg-amber-50/40 border-2 border-dashed border-amber-400/70 rounded-2xl p-3 sm:p-4 shadow-xs">
                      {/* Rich Formatting Toolbar on top of Email text */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-amber-200/80 text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => insertTagToBody(bodyField, "<b>nội dung in đậm</b>")}
                            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-bold text-slate-900"
                            title="In đậm"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTagToBody(bodyField, "<i>nội dung in nghiêng</i>")}
                            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded italic font-serif text-slate-900"
                            title="In nghiêng"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTagToBody(bodyField, "<u>gạch chân</u>")}
                            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded underline text-slate-900"
                            title="Gạch chân"
                          >
                            U
                          </button>
                          <span className="text-slate-300 mx-0.5">|</span>
                          <button
                            type="button"
                            onClick={() => insertTagToBody(bodyField, '<span style="color:#22c55e;">chữ xanh</span>')}
                            className="px-2 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded font-bold text-[11px]"
                          >
                            Chữ Xanh
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTagToBody(bodyField, '<span style="color:#d97706;">chữ vàng</span>')}
                            className="px-2 py-1 bg-amber-100 text-amber-900 hover:bg-amber-200 rounded font-bold text-[11px]"
                          >
                            Chữ Nổi Bật
                          </button>
                        </div>

                        {/* Quick Tag Pills */}
                        <div className="flex flex-wrap items-center gap-1 text-[10px]">
                          <span className="text-amber-800 font-bold hidden sm:inline">Chèn biến:</span>
                          <button
                            type="button"
                            onClick={() => insertTagToBody(bodyField, "<b>{{fullName}}</b>")}
                            className="px-1.5 py-0.5 bg-amber-200 hover:bg-amber-300 rounded text-amber-950 font-bold"
                          >
                            + Họ tên
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTagToBody(bodyField, "<b>{{company}}</b>")}
                            className="px-1.5 py-0.5 bg-amber-200 hover:bg-amber-300 rounded text-amber-950 font-bold"
                          >
                            + Công ty
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTagToBody(bodyField, "<b>{{phone}}</b>")}
                            className="px-1.5 py-0.5 bg-amber-200 hover:bg-amber-300 rounded text-amber-950 font-bold"
                          >
                            + SĐT
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTagToBody(bodyField, "<b>{{registrationId}}</b>")}
                            className="px-1.5 py-0.5 bg-emerald-200 hover:bg-emerald-300 rounded text-emerald-950 font-bold"
                          >
                            + Mã ĐK
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTagToBody(bodyField, "<b>{{registrationType}}</b>")}
                            className="px-1.5 py-0.5 bg-emerald-200 hover:bg-emerald-300 rounded text-emerald-950 font-bold"
                          >
                            + Chi tiết gói
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTagToBody(bodyField, "<b>{{totalCalculatedAmount}}</b>")}
                            className="px-1.5 py-0.5 bg-amber-300 hover:bg-amber-400 rounded text-amber-950 font-bold"
                          >
                            + Tổng tiền
                          </button>
                        </div>
                      </div>

                      {/* Direct Editable Textarea inside paper body */}
                      <textarea
                        rows={4}
                        value={bodyText}
                        onChange={(e) => setRegistration({ ...registration, [bodyField]: e.target.value })}
                        className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-xs sm:text-sm text-slate-900 leading-relaxed font-sans resize-y font-medium"
                        placeholder="Nhập lời cảm ơn hoặc thông báo đính kèm trực tiếp tại đây..."
                      />
                      <div className="text-[10px] text-amber-800 italic text-right font-medium">
                        ✏️ Gõ chữ trực tiếp trên khung giấy thư ở trên.
                      </div>
                    </div>
                  ) : (
                    <div
                      className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          renderInterpolatedBody(bodyText) ||
                          "<p>Ban Tổ Chức Diễn đàn SME Việt Nam 2026 xin chân thành cảm ơn Quý khách đã đăng ký thông tin tham dự sự kiện.</p>",
                      }}
                    />
                  )}
                </div>

                {/* Registration Info Card with Left Green Accent Bar */}
                <div className="bg-[#f8fafc] border border-slate-200 border-l-[4px] border-l-[#22c55e] rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs">
                  <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/80 pb-2.5">
                    {isDirectEdit ? (
                      <input
                        type="text"
                        value={registration.emailInfoTitle ?? "📋 THÔNG TIN ĐĂNG KÝ CỦA QUÝ KHÁCH:"}
                        onChange={(e) => setRegistration({ ...registration, emailInfoTitle: e.target.value })}
                        className="w-full font-extrabold text-xs text-slate-900 bg-amber-100/80 border border-amber-400 rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-600 uppercase tracking-wider shadow-inner"
                        placeholder="Sửa tiêu đề khung thông tin..."
                      />
                    ) : (
                      <span>{registration.emailInfoTitle || "📋 THÔNG TIN ĐĂNG KÝ CỦA QUÝ KHÁCH:"}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-2.5 text-xs pt-1 items-center">
                    <div className="sm:col-span-4 text-slate-500">Mã xác nhận:</div>
                    <div className="sm:col-span-8 font-extrabold text-slate-900 font-mono">SME2026-144380</div>

                    <div className="sm:col-span-4 text-slate-500">Họ và Tên:</div>
                    <div className="sm:col-span-8 font-bold text-slate-900">
                      {isDirectEdit ? "{{fullName}}" : testUser.fullName}
                    </div>

                    <div className="sm:col-span-4 text-slate-500">Số điện thoại:</div>
                    <div className="sm:col-span-8 font-bold text-slate-900 font-mono">
                      {isDirectEdit ? "{{phone}}" : testUser.phone}
                    </div>

                    <div className="sm:col-span-4 text-slate-500">Email:</div>
                    <div className="sm:col-span-8 font-semibold text-blue-600 underline">
                      {isDirectEdit ? "{{email}}" : testUser.email}
                    </div>

                    <div className="sm:col-span-4 text-slate-500">Doanh nghiệp:</div>
                    <div className="sm:col-span-8 font-bold text-slate-900">
                      {isDirectEdit ? "{{company}}" : testUser.company}
                    </div>

                    <div className="sm:col-span-4 text-slate-500">Chức vụ:</div>
                    <div className="sm:col-span-8 font-bold text-slate-900">
                      {isDirectEdit ? "Giám đốc" : testUser.position}
                    </div>

                    <div className="sm:col-span-4 text-slate-500">Nội dung đăng ký:</div>
                    <div className="sm:col-span-8">
                      {isDirectEdit ? (
                        <input
                          type="text"
                          value={registration[typeNameField] ?? defaultTypeName}
                          onChange={(e) => setRegistration({ ...registration, [typeNameField]: e.target.value })}
                          className="w-full font-extrabold text-[#d97706] bg-amber-100/80 border border-amber-400 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-amber-600"
                          placeholder="Sửa nhãn nội dung đăng ký..."
                        />
                      ) : (
                        <span className="font-extrabold text-[#d97706]">{typeName}</span>
                      )}
                    </div>

                    <div className="sm:col-span-4 text-slate-500">Ghi chú / Nhu cầu:</div>
                    <div className="sm:col-span-8 italic text-slate-500">Không có</div>
                  </div>
                </div>

                {/* Event Schedule Box (Light Blue - Fully Inline Editable) */}
                <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-xl p-4 text-xs text-[#1e3a8a] space-y-2">
                  <div className="font-extrabold text-[#1e40af] flex items-center gap-1.5 uppercase tracking-wide">
                    📍 THỜI GIAN & ĐỊA ĐIỂM SỰ KIỆN:
                  </div>
                  <ul className="space-y-1.5 text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#2563eb] font-bold shrink-0">•</span>
                      <strong className="text-[#1e3a8a] shrink-0">Thời gian:</strong>
                      {isDirectEdit ? (
                        <input
                          type="text"
                          value={registration.emailEventTime ?? "18 - 20 tháng 09 năm 2026"}
                          onChange={(e) => setRegistration({ ...registration, emailEventTime: e.target.value })}
                          className="w-full bg-blue-100/80 border border-blue-300 font-bold text-slate-900 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <span>{registration.emailEventTime || "18 - 20 tháng 09 năm 2026"}</span>
                      )}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#2563eb] font-bold shrink-0">•</span>
                      <strong className="text-[#1e3a8a] shrink-0">Địa điểm:</strong>
                      {isDirectEdit ? (
                        <input
                          type="text"
                          value={registration.emailEventLocation ?? "May Plaza Hotel Thái Nguyên (Số 668 Phan Đình Phùng, TP. Thái Nguyên)"}
                          onChange={(e) => setRegistration({ ...registration, emailEventLocation: e.target.value })}
                          className="w-full bg-blue-100/80 border border-blue-300 font-bold text-slate-900 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <span>{registration.emailEventLocation || "May Plaza Hotel Thái Nguyên (Số 668 Phan Đình Phùng, TP. Thái Nguyên)"}</span>
                      )}
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1.5 pt-1 border-t border-blue-200/60 mt-1">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[#2563eb] font-bold">•</span>
                        <strong className="text-[#1e3a8a]">Bản đồ Google Maps:</strong>
                      </div>
                      {isDirectEdit ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={registration.emailMapUrl ?? "https://www.google.com/maps/place/May+Plaza+Hotel/@21.5782896,105.8327195,17z"}
                            onChange={(e) => setRegistration({ ...registration, emailMapUrl: e.target.value })}
                            className="w-full bg-blue-100/80 border border-blue-300 font-mono text-blue-900 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-blue-500"
                            placeholder="Dán link Google Maps tại đây..."
                          />
                        </div>
                      ) : (
                        <a
                          href={registration.emailMapUrl || "https://www.google.com/maps/place/May+Plaza+Hotel/@21.5782896,105.8327195,17z"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 underline bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs transition-colors"
                        >
                          🗺️ Xem Chỉ Đường Trên Google Maps <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </li>
                  </ul>
                </div>

                {/* Sign-off & Footer Message (Inline Editable) */}
                <div className="pt-2 space-y-3 text-xs text-slate-700 leading-relaxed">
                  {isDirectEdit ? (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-amber-800 uppercase">Sửa câu thông báo chân thư:</label>
                      <textarea
                        rows={2}
                        value={registration.emailFooterNote ?? "Bộ phận Thư ký Ban Tổ Chức sẽ liên hệ với Quý khách trong vòng 24 giờ làm việc để hỗ trợ hoàn tất thủ tục."}
                        onChange={(e) => setRegistration({ ...registration, emailFooterNote: e.target.value })}
                        className="w-full bg-amber-50/70 border border-amber-400 text-xs text-slate-900 rounded-lg p-2 font-medium focus:outline-none focus:border-amber-600 resize-y"
                      />
                    </div>
                  ) : (
                    <p>{registration.emailFooterNote || "Bộ phận Thư ký Ban Tổ Chức sẽ liên hệ với Quý khách trong vòng 24 giờ làm việc để hỗ trợ hoàn tất thủ tục."}</p>
                  )}

                  <div className="pt-2">
                    <p className="text-slate-600">Trân trọng,</p>
                    <p className="font-extrabold text-slate-900 uppercase tracking-wide text-xs sm:text-sm mt-0.5">
                      BAN TỔ CHỨC DIỄN ĐÀN SME VIỆT NAM 2026
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Footer Copyright Note */}
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
                Email tự động được gửi từ Hệ thống Ban Tổ Chức SME Việt Nam 2026. Vui lòng không trả lời trực tiếp email này.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full pb-16">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">11 · Nội Dung Form Đăng Ký &amp; Mẫu Email (Registration)</h2>
          <p className="text-xs text-slate-500 mt-1">
            Chỉnh sửa nội dung các Tab và Soạn thảo trực tiếp giao diện Email xác nhận gửi tự động cho khách hàng.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <AutoSaveHeaderBadge
            status={saveStatus}
            lastSavedTime={lastSavedTime}
            errorMessage={errorMessage}
            onManualSave={() => saveNow()}
          />
        </div>
      </div>

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
            <RichTextarea
              label="Phụ đề mô tả ngắn"
              value={registration.sectionDescription}
              onChange={(val) => setRegistration({ ...registration, sectionDescription: val })}
              rows={2.5}
            />
          </div>
        </div>
      </div>

      {/* Tabs Title & Labels */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">TÊN VÀ NHÃN CÁC TAB FORM ĐĂNG KÝ (WEBSITE & MOBILE)</h3>
          <p className="text-xs text-slate-500 mt-0.5">Thay đổi tên các Nút / Tab lựa chọn Form Đăng Ký (Vé đại biểu, Nhà tài trợ, Gian hàng...).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">🎟️ Form 1: Đăng ký Vé / Tham Gia (VD: Vé Đại biểu)</label>
            <input
              type="text"
              value={registration.delegateTab || ""}
              onChange={(e) => setRegistration({ ...registration, delegateTab: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">💎 Form 2: Đăng ký Nhà Tài Trợ (VD: Nhà Tài trợ)</label>
            <input
              type="text"
              value={registration.sponsorTab || ""}
              onChange={(e) => setRegistration({ ...registration, sponsorTab: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-bold"
            />
          </div>
        </div>
      </div>

      {/* Tab Introductions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">NỘI DUNG GIỚI THIỆU TỪNG TAB</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả Tab Đăng ký tham gia</label>
            <input
              type="text"
              value={registration.delegateIntro || ""}
              onChange={(e) => setRegistration({ ...registration, delegateIntro: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả Tab Nhà tài trợ</label>
            <input
              type="text"
              value={registration.sponsorIntro || ""}
              onChange={(e) => setRegistration({ ...registration, sponsorIntro: e.target.value })}
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

      {/* Mobile Labels */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">NHÃN CÁC PHÂN LOẠI TRÊN MOBILE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nhãn Đăng ký tham gia Mobile</label>
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
        </div>
      </div>

      {/* ── Custom Email Templates - Direct Visual Inline Editor Canvas ───────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            ✉️ TRÌNH SOẠN THẢO TRỰC TIẾP TRÊN GIAO DIỆN EMAIL (VISUAL CANVAS)
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Nhấp chuột và gõ nội dung trực tiếp trên bức thư Email thực tế. Thay đổi Tiêu đề, Poster và Lời cảm ơn ngay tại vị trí hiển thị!
          </p>
        </div>

        <div className="space-y-8">
          {/* 1. Form Đăng ký Tham gia */}
          <div className="space-y-3 border border-slate-200 p-4 sm:p-5 rounded-2xl bg-slate-50/60">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                🎟️ 1. MẪU EMAIL XÁC NHẬN - ĐĂNG KÝ THAM GIA
              </h4>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">Form 1</span>
            </div>
            {renderVisualEmailCanvas("delegate")}
          </div>

          {/* 2. Form Nhà Tài Trợ */}
          <div className="space-y-3 border border-slate-200 p-4 sm:p-5 rounded-2xl bg-slate-50/60">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                💎 2. MẪU EMAIL XÁC NHẬN - ĐĂNG KÝ NHÀ TÀI TRỢ
              </h4>
              <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-bold">Form 2</span>
            </div>
            {renderVisualEmailCanvas("sponsor")}
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

      {/* Modal Full-Screen Preview Dialog */}
      {modalFormType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl p-6 text-white space-y-4 relative shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">SOẠN THẢO TRỰC TIẾP TRÀN MÀN HÌNH</h3>
                  <p className="text-xs text-slate-400">
                    Sửa đổi trực tiếp giao diện Email cho{" "}
                    <span className="text-amber-300 font-bold uppercase">{modalFormType}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalFormType(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Email rendering */}
            <div className="py-2">{renderVisualEmailCanvas(modalFormType, true)}</div>

            <div className="flex items-center justify-end border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setModalFormType(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Đóng Màn Hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
