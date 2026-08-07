"use client";

import { useState } from "react";
import { NavbarContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";

interface NavbarEditorProps {
  initialNavbar: NavbarContent;
}

export default function NavbarEditor({ initialNavbar }: NavbarEditorProps) {
  const [navbar, setNavbar] = useState<NavbarContent>(initialNavbar);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("navbar", navbar);
    setSaving(false);

    if (res.success) {
      setMsg({ type: "success", text: "Đã lưu cấu hình Navbar thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Không thể lưu thay đổi." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Thanh điều hướng (Navbar)</h2>
          <p className="text-xs text-slate-500 mt-1">Quản lý logo, tiêu đề thương hiệu, liên kết menu và nút kêu gọi hành động.</p>
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

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">CẤU HÌNH LOGO & THƯƠNG HIỆU</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Thương Hiệu</label>
            <input
              type="text"
              value={navbar.brandName}
              onChange={(e) => setNavbar({ ...navbar, brandName: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dòng Phụ</label>
            <input
              type="text"
              value={navbar.brandSub}
              onChange={(e) => setNavbar({ ...navbar, brandSub: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">URL Logo</label>
            <input
              type="text"
              value={navbar.logoSrc}
              onChange={(e) => setNavbar({ ...navbar, logoSrc: e.target.value })}
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
    </form>
  );
}
