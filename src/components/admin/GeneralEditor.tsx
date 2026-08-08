"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SiteConfig, FooterContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { uploadImageToStorage } from "@/lib/cmsClient";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  FileSpreadsheet,
  Bot,
  Mail,
  Eye,
  EyeOff,
  LayoutGrid,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Globe,
  Sparkles,
  Copy,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/components/ui/Toast";

interface GeneralEditorProps {
  initialConfig: SiteConfig;
  initialFooter: FooterContent;
  onSaveSuccess?: (updatedConfig: SiteConfig, updatedFooter: FooterContent) => void;
}

export default function GeneralEditor({ initialConfig, initialFooter, onSaveSuccess }: GeneralEditorProps) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [footer, setFooter] = useState<FooterContent>(initialFooter);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    setFooter(initialFooter);
  }, [initialFooter]);

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [testingTg, setTestingTg] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("File quá lớn!", "Vui lòng chọn ảnh logo dung lượng dưới 5MB để tải trang nhanh.");
      return;
    }

    setUploadingLogo(true);
    try {
      const { url, error } = await uploadImageToStorage(file);
      if (error || !url) {
        toast.error("Tải ảnh thất bại!", error || "Lỗi không xác định khi upload.");
      } else {
        setConfig((prev) => ({ ...prev, logoUrl: url }));
        setFooter((prev) => ({ ...prev, logoSrc: url }));
        toast.success("Tải Logo thành công! 🖼️", "Đã cập nhật logo mới cho website.");
      }
    } catch (err: any) {
      toast.error("Lỗi upload ảnh!", err?.message || "Không thể upload");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.warning("File quá lớn!", "Vui lòng chọn ảnh favicon dưới 2MB.");
      return;
    }

    setUploadingFavicon(true);
    try {
      const { url, error } = await uploadImageToStorage(file);
      if (error || !url) {
        toast.error("Tải favicon thất bại!", error || "Lỗi không xác định.");
      } else {
        setConfig((prev) => ({ ...prev, faviconUrl: url }));
        toast.success("Tải Favicon thành công! 🌐", "Đã cập nhật biểu tượng favicon cho trình duyệt.");
      }
    } catch (err: any) {
      toast.error("Lỗi upload favicon!", err?.message || "Không thể upload");
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const updatedFooter = {
      ...footer,
      logoSrc: config.logoUrl || footer.logoSrc || "/logo.png",
    };

    const res1 = await updateSectionAction("site_config", config);
    const res2 = await updateSectionAction("footer", updatedFooter);

    setSaving(false);
    if (res1.success && res2.success) {
      toast.success("Lưu thành công! 🎉", "Đã cập nhật logo, favicon, cấu hình chung, Telegram & Google Sheets.");
      setMsg({ type: "success", text: "Đã cập nhật logo, favicon, cấu hình chung, Telegram & Google Sheets thành công!" });
      onSaveSuccess?.(config, updatedFooter);
    } else {
      toast.error("Lưu thất bại!", res1.error || res2.error || "Lỗi khi lưu dữ liệu.");
      setMsg({ type: "error", text: res1.error || res2.error || "Lỗi khi lưu dữ liệu." });
    }
  };

  const handleTestTelegram = async (threadId?: string) => {
    if (!config.telegramBotToken || !config.telegramChatId) {
      toast.warning("Thiếu thông tin!", "Vui lòng nhập Telegram Bot Token và Chat ID trước khi thử nghiệm.");
      return;
    }

    setTestingTg(true);
    try {
      const res = await fetch("/api/test-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botToken: config.telegramBotToken,
          chatId: config.telegramChatId,
          threadId: threadId || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Test thành công! 🤖", data.message);
      } else {
        toast.error("Thử nghiệm thất bại!", data.message);
      }
    } catch (err: any) {
      toast.error("Lỗi kết nối Telegram!", err?.message || "Không thể kết nối Telegram API");
    } finally {
      setTestingTg(false);
    }
  };

  const [testingGs, setTestingGs] = useState(false);

  const handleTestGoogleSheet = async () => {
    if (!config.googleSheetScriptUrl) {
      toast.warning("Thiếu thông tin!", "Vui lòng nhập Google Apps Script URL trước khi kiểm tra!");
      return;
    }

    setTestingGs(true);
    try {
      const res = await fetch("/api/test-google-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scriptUrl: config.googleSheetScriptUrl }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Test Google Sheet thành công! 📊", data.message);
      } else {
        toast.error("Thử nghiệm thất bại!", data.message);
      }
    } catch (err: any) {
      toast.error("Lỗi kết nối!", err?.message || "Không thể kết nối Google Apps Script");
    } finally {
      setTestingGs(false);
    }
  };

  const [testEmailInput, setTestEmailInput] = useState("");
  const [testingEmail, setTestingEmail] = useState(false);

  const handleTestEmail = async () => {
    if (!config.googleSheetScriptUrl) {
      toast.warning("Thiếu thông tin!", "Vui lòng nhập Google Apps Script URL trước!");
      return;
    }
    if (!testEmailInput || !testEmailInput.includes("@")) {
      toast.warning("Email không hợp lệ!", "Vui lòng nhập địa chỉ Email của bạn để nhận Mail thử nghiệm.");
      return;
    }

    setTestingEmail(true);
    try {
      const res = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptUrl: config.googleSheetScriptUrl,
          testEmail: testEmailInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Đã gửi Mail thử nghiệm thành công! ✉️", data.message);
      } else {
        toast.error("Gửi Mail thất bại!", data.message);
      }
    } catch (err: any) {
      toast.error("Lỗi kết nối!", err?.message || "Không thể kết nối API Test Email");
    } finally {
      setTestingEmail(false);
    }
  };

  const SECTION_ITEMS = [
    { id: "hero", label: "Banner Hero chính (Tiêu đề & Đếm ngược)", icon: "🚀" },
    { id: "statistics", label: "Con số thống kê ấn tượng", icon: "📊" },
    { id: "about", label: "Tổng quan Diễn đàn & Thành phần tham dự", icon: "ℹ️" },
    { id: "speakers", label: "Diễn giả & Khách mời danh dự", icon: "🎤" },
    { id: "benefits", label: "5 Giá trị cốt lõi / Quyền lợi đồng hành", icon: "💎" },
    { id: "timeline", label: "Lịch trình 3 ngày diễn đàn", icon: "📅" },
    { id: "sponsors", label: "Nhà tài trợ & Đơn vị đồng hành", icon: "🤝" },
    { id: "booths", label: "Sơ đồ & Đăng ký 100 gian hàng triển lãm", icon: "🎪" },
    { id: "ticket_fee", label: "Bảng giá vé & Chi phí tham dự", icon: "🎟️" },
    { id: "registration", label: "Form Đăng ký trực tuyến", icon: "📝" },
  ];

  const toggleSection = async (sectionId: string) => {
    const current = config.hiddenSections || [];
    let updated: string[];
    const item = SECTION_ITEMS.find((s) => s.id === sectionId);

    if (current.includes(sectionId)) {
      updated = current.filter((id) => id !== sectionId);
      toast.info("Đã bật hiển thị phần! 👁️", `Phần "${item?.label}" đã hiển thị ra ngoài Trang chủ.`);
    } else {
      updated = [...current, sectionId];
      toast.warning("Đã tạm ẩn phần! 🙈", `Phần "${item?.label}" đã được ẩn hoàn toàn khỏi Trang chủ.`);
    }

    const updatedConfig = { ...config, hiddenSections: updated };
    setConfig(updatedConfig);

    // Tự động lưu ngay lập tức xuống CSDL Supabase và làm mới cache Landing Page
    const res = await updateSectionAction("site_config", updatedConfig);
    if (res.success) {
      onSaveSuccess?.(updatedConfig, footer);
    } else {
      toast.error("Lỗi tự động lưu!", res.error || "Không thể cập nhật trạng thái ẩn section.");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cấu Hình Chung, Telegram & Google Sheets</h2>
          <p className="text-xs text-slate-500 mt-1">Quản lý thông tin sự kiện, kết nối bot Telegram thông báo theo từng Topic và đường dẫn Google Sheet tự động.</p>
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

      {/* ── Section Visibility Management Card ─────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xs">
              <LayoutGrid className="w-4 h-4 text-indigo-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">QUẢN LÝ ẨN / HIỆN TẠM THỜI CÁC SECTIONS TRÊN LANDING PAGE</h3>
              <p className="text-[11px] text-slate-500">Tùy chỉnh Bật/Tắt hiển thị từng khối nội dung trên Trang chủ diễn đàn 1-Click.</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            Hiển thị: {SECTION_ITEMS.length - (config.hiddenSections?.length || 0)} / {SECTION_ITEMS.length} phần
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {SECTION_ITEMS.map((item) => {
            const isHidden = config.hiddenSections?.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleSection(item.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isHidden
                    ? "bg-slate-50 border-slate-200 opacity-60 hover:opacity-100"
                    : "bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0">{item.icon}</span>
                  <span className={`text-xs font-semibold truncate ${isHidden ? "text-slate-500 line-through" : "text-slate-900"}`}>
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isHidden
                        ? "bg-slate-200 text-slate-600"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {isHidden ? "Đang ẩn" : "Hiển thị"}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isHidden
                        ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CARD: QUẢN LÝ LOGO & FAVICON WEBSITE ─────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">HÌNH ẢNH LOGO & FAVICON WEBSITE</h3>
              <p className="text-[11px] text-slate-500">Quản lý hình ảnh thương hiệu hiển thị trên Header, Footer, tab trình duyệt và chia sẻ liên kết mạng xã hội.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ── Sub-card 1: Logo Website ────────────────────── */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">1. Logo Chính Website</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  Header & Footer
                </span>
              </div>
            </div>

            {/* Dual Theme Preview Box */}
            <div className="grid grid-cols-2 gap-3">
              {/* Header Dark Green Preview */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-full h-24 rounded-xl bg-[#0B3026] p-3 border border-emerald-800 shadow-inner flex items-center justify-center relative overflow-hidden">
                  {config.logoUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={config.logoUrl}
                        alt="Logo Preview Header"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-300 font-bold">Chưa có logo</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">Xem trên Header (Nền tối)</span>
              </div>

              {/* White Background Preview */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-full h-24 rounded-xl bg-white p-3 border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden">
                  {config.logoUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={config.logoUrl}
                        alt="Logo Preview Light"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-bold">Chưa có logo</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">Xem trên Nền sáng</span>
              </div>
            </div>

            {/* Logo Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0">
                {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploadingLogo ? "Đang tải ảnh lên..." : "Tải Logo từ máy tính"}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setConfig((prev) => ({ ...prev, logoUrl: "/logo.png" }));
                  setFooter((prev) => ({ ...prev, logoSrc: "/logo.png" }));
                  toast.info("Đã đặt lại!", "Logo đã được đưa về đường dẫn mặc định (/logo.png).");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                title="Đặt lại logo mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mặc định</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Đường dẫn URL Logo</label>
              <input
                type="text"
                placeholder="/logo.png hoặc https://..."
                value={config.logoUrl || ""}
                onChange={(e) => {
                  setConfig({ ...config, logoUrl: e.target.value });
                  setFooter({ ...footer, logoSrc: e.target.value });
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Khuyên dùng: <b>PNG nền trong suốt</b> hoặc SVG, WebP. Tự động đồng bộ sang Header & Footer.
              </p>
            </div>
          </div>

          {/* ── Sub-card 2: Favicon Website ────────────────── */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">2. Favicon Trình Duyệt</span>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
                  Tab & Bookmark
                </span>
              </div>
            </div>

            {/* Interactive Browser Tab Mockup */}
            <div className="w-full bg-slate-200/90 rounded-xl p-2.5 border border-slate-300 shadow-inner">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
                <span>Mô phỏng Tab trình duyệt Chrome / Safari</span>
                <span className="text-[9px] bg-slate-300/80 px-1.5 py-0.5 rounded font-mono">Live Mockup</span>
              </div>

              {/* Tab element */}
              <div className="max-w-xs bg-white rounded-t-lg px-3 py-2 border-t border-x border-slate-300/80 shadow-sm flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-4 h-4 relative shrink-0 rounded overflow-hidden">
                    <Image
                      src={config.faviconUrl || config.logoUrl || "/logo.png"}
                      alt="Favicon Tab Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-800 truncate">
                    {config.metaTitle || config.siteName || "DIỄN ĐÀN SME VIỆT NAM 2026"}
                  </span>
                </div>
                <span className="text-slate-400 hover:text-slate-600 text-xs font-bold leading-none px-1 cursor-default">
                  ×
                </span>
              </div>
              <div className="h-1 bg-white rounded-b-lg shadow-sm" />
            </div>

            {/* Favicon Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0">
                {uploadingFavicon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploadingFavicon ? "Đang tải favicon..." : "Tải Favicon từ máy tính"}</span>
                <input
                  type="file"
                  accept="image/x-icon,image/png,image/svg+xml,image/jpeg,image/webp,.ico,.png"
                  className="hidden"
                  onChange={handleFaviconUpload}
                  disabled={uploadingFavicon}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  const src = config.logoUrl || "/logo.png";
                  setConfig((prev) => ({ ...prev, faviconUrl: src }));
                  toast.success("Đã đồng bộ từ Logo! 🔄", "Favicon đã được gán trùng với ảnh Logo chính.");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
                title="Sử dụng ảnh Logo làm Favicon"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Dùng từ Logo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfig((prev) => ({ ...prev, faviconUrl: "/logo.png" }));
                  toast.info("Đã đặt lại!", "Favicon đã được đưa về mặc định (/logo.png).");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                title="Đặt lại favicon mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mặc định</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Đường dẫn URL Favicon (.ico / .png / .svg)</label>
              <input
                type="text"
                placeholder="/logo.png hoặc /favicon.ico"
                value={config.faviconUrl || ""}
                onChange={(e) => setConfig({ ...config, faviconUrl: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Kích cỡ tối ưu: <b>32x32px, 64x64px, hoặc 180x180px</b> (tương thích cả trình duyệt máy tính, điện thoại & Apple Touch Icon).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. THÔNG BÁO TỰ ĐỘNG TELEGRAM BOT & CHIA TOPIC */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">THÔNG BÁO TỰ ĐỘNG TELEGRAM BOT & PHÂN LOẠI TOPIC</h3>
              <p className="text-[11px] text-slate-500">Bật tính năng này để nhận thông báo tự động phân loại theo từng Topic (Chủ đề) trong Telegram Supergroup.</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.telegramEnabled ?? false}
              onChange={(e) => setConfig({ ...config, telegramEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Telegram Bot Token</label>
            <input
              type="text"
              placeholder="VD: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
              value={config.telegramBotToken || ""}
              onChange={(e) => setConfig({ ...config, telegramBotToken: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Telegram Chat ID / Group ID</label>
            <input
              type="text"
              placeholder="VD: -1001234567890 hoặc 987654321"
              value={config.telegramChatId || ""}
              onChange={(e) => setConfig({ ...config, telegramChatId: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* ── Telegram Forum Topics Config ───────────────────────────────── */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              📌 CẤU HÌNH TOPIC ID GỬI TIN CHO 3 FORM (FORUM TOPICS)
            </h4>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
              Tùy chọn phân loại
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Nếu Group Telegram của bạn có bật <b>Forum Topics (Chủ đề)</b>, điền Topic ID bên dưới để tin nhắn đăng ký gửi chính xác vào từng Topic tương ứng. <i>(Để trống nếu gửi vào Kênh chung/General)</i>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                🎟️ Topic ID - Đăng ký Đại biểu
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="VD: 2"
                  value={config.telegramThreadIdDelegate || ""}
                  onChange={(e) => setConfig({ ...config, telegramThreadIdDelegate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleTestTelegram(config.telegramThreadIdDelegate)}
                  disabled={testingTg}
                  title="Gửi tin nhắn test tới Topic Đại Biểu"
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 transition-colors text-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                💎 Topic ID - Nhà Tài Trợ
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="VD: 5"
                  value={config.telegramThreadIdSponsor || ""}
                  onChange={(e) => setConfig({ ...config, telegramThreadIdSponsor: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleTestTelegram(config.telegramThreadIdSponsor)}
                  disabled={testingTg}
                  title="Gửi tin nhắn test tới Topic Nhà Tài Trợ"
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 transition-colors text-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                🎪 Topic ID - Gian Hàng Triển Lãm
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="VD: 8"
                  value={config.telegramThreadIdBooth || ""}
                  onChange={(e) => setConfig({ ...config, telegramThreadIdBooth: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleTestTelegram(config.telegramThreadIdBooth)}
                  disabled={testingTg}
                  title="Gửi tin nhắn test tới Topic Gian Hàng"
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 transition-colors text-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] text-slate-500">
            Cách lấy Topic ID: Trong Telegram Group, nhấp chuột phải vào tên Topic &gt; <b>Copy Link Topic</b> &gt; Số cuối cùng chính là Topic ID (Ví dụ: <code>https://t.me/c/12345/<b>8</b></code> &rarr; ID là <b>8</b>).
          </span>
          <button
            type="button"
            onClick={() => handleTestTelegram()}
            disabled={testingTg}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0"
          >
            {testingTg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Test Kênh Chung (General)
          </button>
        </div>
      </div>

      {/* 2. TỰ ĐỘNG GHI VÀO GOOGLE SHEETS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">TỰ ĐỘNG ĐẨY ĐĂNG KÝ VÀO GOOGLE SHEETS</h3>
              <p className="text-[11px] text-slate-500">Tự động ghi từng lượt đăng ký mới trên Landing Page thành 1 dòng trong file Google Sheet của bạn.</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.googleSheetEnabled ?? true}
              onChange={(e) => setConfig({ ...config, googleSheetEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Google Apps Script Web App URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={config.googleSheetScriptUrl || ""}
              onChange={(e) => setConfig({ ...config, googleSheetScriptUrl: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
            />
            <button
              type="button"
              onClick={handleTestGoogleSheet}
              disabled={testingGs}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0 shadow-sm"
            >
              {testingGs ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Gửi Thử Nghiệm
            </button>
          </div>
        </div>

        {/* ── Test Email Box ───────────────────────────────────────────── */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
          <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
            ✉️ TEST GỬI EMAIL XÁC NHẬN TỰ ĐỘNG THỬ NGHIỆM
          </label>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Nhập email của bạn (VD: zak@gmail.com)"
              value={testEmailInput}
              onChange={(e) => setTestEmailInput(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleTestEmail}
              disabled={testingEmail}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0 shadow-sm"
            >
              {testingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
              Test Gửi Mail Ngay
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            Bấm nút để hệ thống thử bắn 1 Email xác nhận đính kèm Poster tới địa chỉ Email của bạn nhằm kiểm tra việc cấp quyền và kiểm tra hòm thư!
          </p>
        </div>

        {/* ── Hướng dẫn 4 Bước cài đặt Google Apps Script ─────────────────── */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              📋 HƯỚNG DẪN 4 BƯỚC TẠO LINK GOOGLE SHEET TỰ ĐỘNG
            </h4>
            <button
              type="button"
              onClick={() => {
                const codeStr = `function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var ticketType = (data.registrationType || data.intentTab || "").toLowerCase();
    var targetSheetName = "Đại biểu";
    if (ticketType.indexOf("booth") !== -1 || ticketType.indexOf("gian hàng") !== -1 || ticketType.indexOf("gian") !== -1) {
      targetSheetName = "Gian hàng";
    } else if (ticketType.indexOf("sponsor") !== -1 || ticketType.indexOf("tài trợ") !== -1) {
      targetSheetName = "Tài trợ";
    }
    var sheet = ss.getSheetByName(targetSheetName);
    if (!sheet) { sheet = ss.insertSheet(targetSheetName); }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Thời Gian Đăng Ký", "Họ và Tên", "Số Điện Thoại", "Email", "Tên Doanh Nghiệp / Đơn Vị", "Chức Vụ", "Chi Tiết Đăng Ký", "Ghi Chú / Nhu Cầu"]);
      sheet.getRange("A1:H1").setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
    }
    var timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    var fullName = data.fullName || data.full_name || "Quý khách";
    var phone = data.phone || "N/A";
    var email = data.email || "";
    var company = data.company || data.company_name || "N/A";
    var position = data.position || "N/A";
    var detailInfo = data.registrationType || data.intentTab || "N/A";
    var notes = data.notes || data.networkingNeeds || "Không có";
    sheet.appendRow([timestamp, fullName, phone, email, company, position, detailInfo, notes]);
    if (email && email.indexOf("@") !== -1) {
      try {
        var regId = "SME2026-" + Math.floor(100000 + Math.random() * 900000);
        var subject = "[SME VIỆT NAM 2026] XÁC NHẬN ĐĂNG KÝ THÀNH CÔNG - " + fullName.toUpperCase();
        var htmlTemplate = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;"><div style="background-color: #0D3B2E; color: #ffffff; padding: 24px; text-align: center;"><h1 style="margin: 0; font-size: 18px; text-transform: uppercase; font-weight: bold;">DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026</h1><p style="margin: 6px 0 0 0; font-size: 13px; color: #a7f3d0;">May Plaza Hotel Thái Nguyên | 18 - 20/09/2026</p></div><div style="padding: 24px; color: #334155; line-height: 1.6; font-size: 14px;"><p>Kính gửi <b>' + fullName + '</b>,</p><p>Ban Tổ Chức Diễn đàn SME Việt Nam 2026 xin chân thành cảm ơn Quý khách đã đăng ký thông tin tham dự sự kiện.</p><div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #22c55e; border-radius: 8px; padding: 16px; margin: 20px 0;"><h3 style="margin: 0 0 12px 0; font-size: 14px; color: #0f172a; text-transform: uppercase;">📋 THÔNG TIN ĐĂNG KÝ CỦA QUÝ KHÁCH:</h3><table style="width: 100%; border-collapse: collapse; font-size: 13px;"><tr><td style="padding: 4px 0; color: #64748b; width: 140px;">Mã xác nhận:</td><td style="padding: 4px 0; font-weight: bold; color: #0D3B2E;">' + regId + '</td></tr><tr><td style="padding: 4px 0; color: #64748b;">Họ và Tên:</td><td style="padding: 4px 0; font-weight: bold;">' + fullName + '</td></tr><tr><td style="padding: 4px 0; color: #64748b;">Số điện thoại:</td><td style="padding: 4px 0; font-weight: bold;">' + phone + '</td></tr><tr><td style="padding: 4px 0; color: #64748b;">Email:</td><td style="padding: 4px 0; font-weight: bold;">' + email + '</td></tr><tr><td style="padding: 4px 0; color: #64748b;">Doanh nghiệp:</td><td style="padding: 4px 0; font-weight: bold;">' + company + '</td></tr><tr><td style="padding: 4px 0; color: #64748b;">Chức vụ:</td><td style="padding: 4px 0; font-weight: bold;">' + position + '</td></tr><tr><td style="padding: 4px 0; color: #64748b;">Nội dung đăng ký:</td><td style="padding: 4px 0; font-weight: bold; color: #d97706;">' + detailInfo + '</td></tr><tr><td style="padding: 4px 0; color: #64748b;">Ghi chú / Nhu cầu:</td><td style="padding: 4px 0; font-style: italic;">' + notes + '</td></tr></table></div><div style="background-color: #eff6ff; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 13px; color: #1e40af;">📍 <b>THỜI GIAN & ĐỊA ĐIỂM SỰ KIỆN:</b><br>• <b>Thời gian:</b> 18 - 20 tháng 09 năm 2026<br>• <b>Địa điểm:</b> May Plaza Hotel Thái Nguyên (Số 668 Phan Đình Phùng, TP. Thái Nguyên)</div><p>Bộ phận Thư ký Ban Tổ Chức sẽ liên hệ với Quý khách trong vòng <b>24 giờ làm việc</b> để hỗ trợ hoàn tất thủ tục.</p><p>Trân trọng,<br><b>BAN TỔ CHỨC DIỄN ĐÀN SME VIỆT NAM 2026</b></p></div></div>';
        MailApp.sendEmail({ to: email, subject: subject, htmlBody: htmlTemplate });
      } catch (mErr) {}
    }
    return ContentService.createTextOutput(JSON.stringify({status:"success", message:"Đã ghi vào " + targetSheetName + " & gửi email xác nhận!"})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status:"error",message:err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}`;
                navigator.clipboard.writeText(codeStr);
                toast.success("Đã copy mã Google Apps Script (+ Tự Động Gửi Email)! 📋", "Dán mã này vào Apps Script của Google Sheet.");
              }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-[11px] font-bold transition-colors"
            >
              📋 Copy Mã Script 3 Tab + Tự Động Gửi Email Xác Nhận
            </button>
          </div>

          <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
            <li>Mở file <b>Google Sheet</b> của bạn &gt; Menu <b>Tiện ích mở rộng (Extensions)</b> &gt; Chọn <b>Apps Script</b>.</li>
            <li>Xóa mã mặc định và dán đoạn mã Script (bấm nút <b>Copy Mã Script 1-Click</b> ở trên).</li>
            <li>Bấm nút <b>Triển khai (Deploy)</b> &gt; <b>Tạo bản triển khai mới (New deployment)</b> &gt; Chọn loại <b>Ứng dụng web (Web App)</b>.</li>
            <li>Mục <b>"Ai có quyền truy cập" (Who has access)</b>: Chọn <b>"Bất kỳ ai" (Anyone)</b> rồi bấm <b>Triển khai</b> &gt; Copy URL dán vào ô bên trên.</li>
          </ol>
        </div>
      </div>

      {/* Thông tin sự kiện cơ bản */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">THÔNG TIN SỰ KIỆN & BAN TỔ CHỨC</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tên Sự Kiện Đầy Đủ</label>
            <input
              type="text"
              value={config.siteName}
              onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Đơn Vị Tổ Chức (Organizer)</label>
            <input
              type="text"
              value={config.organizer}
              onChange={(e) => setConfig({ ...config, organizer: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hotline Liên Hệ</label>
            <input
              type="text"
              value={config.hotline}
              onChange={(e) => {
                setConfig({ ...config, hotline: e.target.value });
                setFooter({ ...footer, contactHotline: e.target.value });
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Hỗ Trợ</label>
            <input
              type="email"
              value={config.email}
              onChange={(e) => {
                setConfig({ ...config, email: e.target.value });
                setFooter({ ...footer, contactEmail: e.target.value });
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Địa Điểm Tổ Chức</label>
            <input
              type="text"
              value={config.address}
              onChange={(e) => {
                setConfig({ ...config, address: e.target.value });
                setFooter({ ...footer, contactAddress: e.target.value });
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* SEO Metadata */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">CẤU HÌNH SEO METADATA</h3>
        
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thẻ Tiêu Đề Web (Meta Title)</label>
          <input
            type="text"
            value={config.metaTitle}
            onChange={(e) => setConfig({ ...config, metaTitle: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thẻ Mô Tả (Meta Description)</label>
          <textarea
            rows={3}
            value={config.metaDescription}
            onChange={(e) => setConfig({ ...config, metaDescription: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 leading-relaxed focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* ── SePay VietQR Payment Integration Card ───────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs">
              💳
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">CỔNG THANH TOÁN QUÉT MÃ VIETQR SEPAY (TỰ ĐỘNG BÁN VÉ)</h3>
              <p className="text-[11px] text-slate-500">Bật/tắt tính năng quét mã QR ngân hàng tự động xác nhận chuyển khoản cho khách hàng.</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.sepayEnabled ?? false}
              onChange={(e) => setConfig({ ...config, sepayEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {config.sepayEnabled && (
          <div className="pt-3 border-t border-slate-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Ngân Hàng (Bank Code)</label>
                <select
                  value={config.sepayBankCode || "MB"}
                  onChange={(e) => setConfig({ ...config, sepayBankCode: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="MB">MBBank (MB)</option>
                  <option value="VCB">Vietcombank (VCB)</option>
                  <option value="ICB">VietinBank (ICB)</option>
                  <option value="TCB">Techcombank (TCB)</option>
                  <option value="ACB">ACB</option>
                  <option value="VPB">VPBank (VPB)</option>
                  <option value="BIDV">BIDV</option>
                  <option value="TPB">TPBank (TPB)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số Tài Khoản Ngân Hàng</label>
                <input
                  type="text"
                  placeholder="0388925432"
                  value={config.sepayAccountNumber || ""}
                  onChange={(e) => setConfig({ ...config, sepayAccountNumber: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Chủ Tài Khoản (Viết Hoa)</label>
                <input
                  type="text"
                  placeholder="NGUYEN ZAK"
                  value={config.sepayAccountName || ""}
                  onChange={(e) => setConfig({ ...config, sepayAccountName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SePay API Key / Secret (Webhooks Webhook Token)</label>
              <input
                type="password"
                placeholder="Nhập API Key SePay..."
                value={config.sepayApiKey || ""}
                onChange={(e) => setConfig({ ...config, sepayApiKey: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">NỘI DUNG FOOTER & MẠNG XÃ HỘI</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Đoạn Văn Giới Thiệu Ở Footer</label>
          <textarea
            rows={3}
            value={footer.aboutText}
            onChange={(e) => setFooter({ ...footer, aboutText: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 leading-relaxed focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Facebook Link</label>
            <input
              type="text"
              value={footer.socialLinks?.facebook || ""}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...(footer.socialLinks || {}), facebook: e.target.value },
                })
              }
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Zalo Official Link</label>
            <input
              type="text"
              value={footer.socialLinks?.zalo || ""}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...(footer.socialLinks || {}), zalo: e.target.value },
                })
              }
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">YouTube Link</label>
            <input
              type="text"
              value={footer.socialLinks?.youtube || ""}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...(footer.socialLinks || {}), youtube: e.target.value },
                })
              }
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bản Quyền Copyright Text</label>
          <input
            type="text"
            value={footer.copyrightText}
            onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
          />
        </div>
      </div>
    </form>
  );
}
