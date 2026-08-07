"use client";

import { useState } from "react";
import { NavbarContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, X } from "lucide-react";

interface NavbarEditorProps {
  initialNavbar: NavbarContent;
}

export default function NavbarEditor({ initialNavbar }: NavbarEditorProps) {
  const [navbar, setNavbar] = useState<NavbarContent>(initialNavbar);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLinkChange = (index: number, field: keyof NavbarContent, value: string) => {
    if (field === "navLinks") return;
    setNavbar({ ...navbar, [field]: value });
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
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Thanh điều hướng (Navbar)</h2>
          <p className="text-xs text-slate-400">Quản lý logo, tiêu đề thương hiệu, liên kết menu và nút kêu gọi hành động.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu Thay Đổi
        </button>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
            msg.type === "success"
              ? "bg-emerald-950/70 border border-emerald-800 text-emerald-300"
              : "bg-red-950/70 border border-red-800 text-red-300"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tên Thương Hiệu</label>
            <input
              type="text"
              value={navbar.brandName}
              onChange={(e) => setNavbar({ ...navbar, brandName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Dòng Phụ</label>
            <input
              type="text"
              value={navbar.brandSub}
              onChange={(e) => setNavbar({ ...navbar, brandSub: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">URL Logo</label>
            <input
              type="text"
              value={navbar.logoSrc}
              onChange={(e) => setNavbar({ ...navbar, logoSrc: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nút CTA Văn Bản</label>
            <input
              type="text"
              value={navbar.ctaText}
              onChange={(e) => setNavbar({ ...navbar, ctaText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">URL CTA</label>
            <input
              type="text"
              value={navbar.ctaLink}
              onChange={(e) => setNavbar({ ...navbar, ctaLink: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Danh sách liên kết menu</h3>
          <button
            type="button"
            onClick={addNavLink}
            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm liên kết
          </button>
        </div>

        <div className="space-y-3">
          {navbar.navLinks.map((link, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-950 border border-slate-800 rounded-2xl p-3">
              <div className="md:col-span-5">
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Tên liên kết</label>
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => handleNavLinkChange(idx, "name", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-6">
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Đường dẫn</label>
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => handleNavLinkChange(idx, "href", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-1 flex items-end justify-end">
                <button
                  type="button"
                  onClick={() => removeNavLink(idx)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-950 border border-red-800 text-red-400 hover:bg-red-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Nhãn nút Đăng ký Mobile</h3>
        <input
          type="text"
          value={navbar.mobileRegisterText}
          onChange={(e) => setNavbar({ ...navbar, mobileRegisterText: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
        />
      </div>
    </form>
  );
}
