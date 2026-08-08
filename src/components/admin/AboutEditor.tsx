"use client";

import { useState } from "react";
import { AboutContent, AttendeeTag, DEFAULT_ABOUT } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { uploadImageToStorage } from "@/lib/cmsClient";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";

interface AboutEditorProps {
  initialAbout: AboutContent;
}

export default function AboutEditor({ initialAbout }: AboutEditorProps) {
  const [about, setAbout] = useState<AboutContent>({
    ...initialAbout,
    attendeeTags: initialAbout.attendeeTags || DEFAULT_ABOUT.attendeeTags,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleBulletChange = (index: number, value: string) => {
    const updated = [...about.bullets];
    updated[index] = value;
    setAbout({ ...about, bullets: updated });
  };

  const addBullet = () => {
    setAbout({ ...about, bullets: [...about.bullets, "Điểm nổi bật mới"] });
  };

  const removeBullet = (index: number) => {
    const updated = about.bullets.filter((_, i) => i !== index);
    setAbout({ ...about, bullets: updated });
  };

  const handleAttendeeTagChange = (index: number, field: keyof AttendeeTag, value: any) => {
    const updated = [...(about.attendeeTags || DEFAULT_ABOUT.attendeeTags)];
    updated[index] = { ...updated[index], [field]: value };
    setAbout({ ...about, attendeeTags: updated });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToStorage(file);
    setUploading(false);

    if (error || !url) {
      alert("Tải ảnh thất bại: " + (error || "Lỗi không xác định"));
    } else {
      setAbout({ ...about, imageUrl: url });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("about", about);
    setSaving(false);

    if (res.success) {
      setMsg({ type: "success", text: "Đã cập nhật bài viết & khối Thành phần tham dự thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Lỗi lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Về Diễn Đàn & Thành Phần Tham Dự</h2>
          <p className="text-xs text-slate-500 mt-1">Quản lý bài viết giới thiệu, 6 thẻ Thành phần tham dự trọng điểm & hình ảnh minh họa.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer"
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

      {/* Nội dung bài viết */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. TIÊU ĐỀ & VĂN BẢN MÔ TẢ GIỚI THIỆU</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Huy Hiệu (Badge)</label>
          <input
            type="text"
            value={about.badge}
            onChange={(e) => setAbout({ ...about, badge: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Lớn (Title)</label>
          <input
            type="text"
            value={about.title}
            onChange={(e) => setAbout({ ...about, title: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Cụm Từ Nổi Bật (Highlight Text)</label>
          <input
            type="text"
            value={about.highlightText}
            onChange={(e) => setAbout({ ...about, highlightText: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Đoạn Văn Mô Tả 1</label>
          <textarea
            rows={3}
            value={about.descriptionParagraph1}
            onChange={(e) => setAbout({ ...about, descriptionParagraph1: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Đoạn Văn Mô Tả 2</label>
          <textarea
            rows={3}
            value={about.descriptionParagraph2}
            onChange={(e) => setAbout({ ...about, descriptionParagraph2: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* THÀNH PHẦN THAM DỰ TRỌNG ĐIỂM (6 THẺ ĐẠI BIỂU) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. THÀNH PHẦN THAM DỰ TRỌNG ĐIỂM (6 THẺ ĐẠI BIỂU)</h3>
          <p className="text-xs text-slate-500 mt-1">Chỉnh sửa nội dung 6 thẻ đại biểu trọng điểm (Lãnh đạo Chính phủ, 500+ CEO, Quỹ đầu tư, Hiệp hội, FDI, BQL KCN).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {(about.attendeeTags || DEFAULT_ABOUT.attendeeTags).map((tag, idx) => (
            <div key={tag.id || idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase">THẺ ĐẠI BIỂU #{idx + 1} ({tag.rank})</span>
                <select
                  value={tag.tier}
                  onChange={(e) => handleAttendeeTagChange(idx, "tier", e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-800 focus:outline-none"
                >
                  <option value="vip">★ VIP (Nổi bật Vàng)</option>
                  <option value="gold">◆ GOLD (Nổi bật Xanh)</option>
                  <option value="standard">STANDARD (Tiêu chuẩn)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tên Nhóm / Tiêu Đề</label>
                <input
                  type="text"
                  value={tag.label}
                  onChange={(e) => handleAttendeeTagChange(idx, "label", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dòng Chi Tiết / Phụ Đề</label>
                <input
                  type="text"
                  value={tag.sub}
                  onChange={(e) => handleAttendeeTagChange(idx, "sub", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Huy Hiệu Số Lượng (Pill)</label>
                  <input
                    type="text"
                    value={tag.count}
                    onChange={(e) => handleAttendeeTagChange(idx, "count", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Biểu Tượng (Icon)</label>
                  <select
                    value={tag.iconName}
                    onChange={(e) => handleAttendeeTagChange(idx, "iconName", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Landmark">Landmark (Chính phủ)</option>
                    <option value="Crown">Crown (Lãnh đạo / CEO)</option>
                    <option value="TrendingUp">TrendingUp (Quỹ đầu tư)</option>
                    <option value="Building2">Building2 (Hiệp hội)</option>
                    <option value="Globe2">Globe2 (Quốc tế / FDI)</option>
                    <option value="Factory">Factory (KCN / Khu kinh tế)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gạch đầu dòng nổi bật */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. GẠCH ĐẦU DÒNG NỔI BẬT</h3>
          <button
            type="button"
            onClick={addBullet}
            className="inline-flex items-center gap-1 text-[11px] text-slate-900 hover:text-black font-bold"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Ý Nổi Bật
          </button>
        </div>

        <div className="space-y-2">
          {about.bullets.map((b, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={b}
                onChange={(e) => handleBulletChange(idx, e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeBullet(idx)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hình ảnh sự kiện */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">4. HÌNH ẢNH SỰ KIỆN MINH HỌA</h3>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          {about.imageUrl && (
            <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-200 shrink-0">
              <Image src={about.imageUrl} alt="About preview" fill className="object-cover" />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL Hình Ảnh</label>
              <input
                type="text"
                value={about.imageUrl}
                onChange={(e) => setAbout({ ...about, imageUrl: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{uploading ? "Đang tải ảnh..." : "Tải ảnh từ máy tính"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
