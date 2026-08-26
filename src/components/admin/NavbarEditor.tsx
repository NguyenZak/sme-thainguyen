"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NavbarContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { uploadImageToStorage } from "@/lib/cmsClient";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, Upload, RotateCcw, Image as ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/Toast";

import { useAutoSave } from "@/hooks/useAutoSave";
import AutoSaveHeaderBadge from "@/components/admin/AutoSaveHeaderBadge";

interface NavbarEditorProps {
  initialNavbar: NavbarContent;
  onSaveSuccess?: (updatedNavbar: NavbarContent) => void;
}

export default function NavbarEditor({ initialNavbar, onSaveSuccess }: NavbarEditorProps) {
  const [navbar, setNavbar] = useState<NavbarContent>(initialNavbar);

  useEffect(() => {
    setNavbar(initialNavbar);
  }, [initialNavbar]);

  const { saveStatus, lastSavedTime, errorMessage, saveNow } = useAutoSave(
    "navbar",
    navbar,
    { onSaveSuccess }
  );

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("File quá lớn!", "Vui lòng chọn ảnh logo dưới 5MB để tối ưu tốc độ tải trang.");
      return;
    }

    setUploadingLogo(true);
    try {
      const { url, error } = await uploadImageToStorage(file);
      if (error || !url) {
        toast.error("Tải ảnh thất bại!", error || "Không thể upload file.");
      } else {
        setNavbar((prev) => ({ ...prev, logoSrc: url }));
        toast.success("Tải logo thành công! 🖼️", "Đã cập nhật logo cho thanh điều hướng.");
      }
    } catch (err: any) {
      toast.error("Lỗi khi tải ảnh!", err?.message || "Lỗi không xác định");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleNavLinkChange = (index: number, key: keyof NavbarContent["navLinks"][0], value: string) => {
    const updated = [...navbar.navLinks];
    updated[index] = { ...updated[index], [key]: value };
    setNavbar({ ...navbar, navLinks: updated });
  };

  const addNavLink = () => {
    setNavbar({
      ...navbar,
      navLinks: [...navbar.navLinks, { name: "Mục mới", href: "#" }],
    });
  };

  const removeNavLink = (index: number) => {
    setNavbar({
      ...navbar,
      navLinks: navbar.navLinks.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">01 · Thanh Điều Hướng (Navbar) &amp; Logo</h2>
          <p className="text-xs text-slate-500 mt-1">Quản lý logo thương hiệu, tiêu đề, liên kết menu và nút kêu gọi hành động.</p>
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

      {/* ── CARD: CẤU HÌNH LOGO & THƯƠNG HIỆU ─────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">CẤU HÌNH LOGO & THƯƠNG HIỆU</h3>
              <p className="text-[11px] text-slate-500">Logo hiển thị tại góc trái thanh Menu điều hướng và các vị trí thương hiệu.</p>
            </div>
          </div>
        </div>

        {/* Logo Preview & Upload Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Dark green background mock header */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-xl bg-[#0B3026] p-2 border border-emerald-800 shadow-md flex items-center justify-center relative overflow-hidden shrink-0">
                {navbar.logoSrc ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={navbar.logoSrc}
                      alt="Logo Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-[10px] text-emerald-300 font-bold">Chưa có</span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Xem trên Header</span>
            </div>

            {/* Light background mock */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-xl bg-white p-2 border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden shrink-0">
                {navbar.logoSrc ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={navbar.logoSrc}
                      alt="Logo Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 font-bold">Chưa có</span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Nền trắng</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900">
                {navbar.brandName || "Chưa đặt tên thương hiệu"}
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm">
                Định dạng khuyên dùng: <b>PNG nền trong suốt (transparent)</b> hoặc SVG, WebP.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0">
              {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{uploadingLogo ? "Đang tải ảnh..." : "Tải Logo từ máy tính"}</span>
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
                setNavbar({ ...navbar, logoSrc: "/logo.png" });
                toast.info("Đã đặt lại!", "Logo đã được đưa về đường dẫn mặc định (/logo.png).");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors shrink-0"
              title="Đặt lại logo mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mặc định</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Đường dẫn URL Logo hoặc Tên file</label>
            <input
              type="text"
              placeholder="/logo.png hoặc https://..."
              value={navbar.logoSrc}
              onChange={(e) => setNavbar({ ...navbar, logoSrc: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Thương Hiệu Chính</label>
            <input
              type="text"
              value={navbar.brandName}
              onChange={(e) => setNavbar({ ...navbar, brandName: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dòng Phụ (Subtitle thương hiệu)</label>
            <input
              type="text"
              value={navbar.brandSub}
              onChange={(e) => setNavbar({ ...navbar, brandSub: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày diễn ra sự kiện (Hiển thị góc Lịch Header)</label>
            <input
              type="text"
              value={navbar.eventDateText || ""}
              placeholder="VD: 18 - 20/09/2026"
              onChange={(e) => setNavbar({ ...navbar, eventDateText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nút CTA Văn Bản</label>
            <input
              type="text"
              value={navbar.ctaText}
              onChange={(e) => setNavbar({ ...navbar, ctaText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">URL CTA Link</label>
            <input
              type="text"
              value={navbar.ctaLink}
              onChange={(e) => setNavbar({ ...navbar, ctaLink: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">DANH SÁCH LIÊN KẾT MENU</h3>
          <button
            type="button"
            onClick={addNavLink}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-black bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm liên kết
          </button>
        </div>

        <div className="space-y-3">
          {navbar.navLinks.map((link, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="md:col-span-5">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tên liên kết</label>
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => handleNavLinkChange(idx, "name", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <div className="md:col-span-6">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Đường dẫn (#id hoặc URL)</label>
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => handleNavLinkChange(idx, "href", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-mono"
                />
              </div>
              <div className="md:col-span-1 flex items-end justify-end">
                <button
                  type="button"
                  onClick={() => removeNavLink(idx)}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
                  title="Xóa liên kết này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">NHÃN NÚT ĐĂNG KÝ MOBILE</h3>
        <input
          type="text"
          value={navbar.mobileRegisterText}
          onChange={(e) => setNavbar({ ...navbar, mobileRegisterText: e.target.value })}
          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
        />
      </div>
    </div>
  );
}
