"use client";

import { useState } from "react";
import { AboutContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { uploadImageToStorage } from "@/lib/cmsClient";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";

interface AboutEditorProps {
  initialAbout: AboutContent;
}

export default function AboutEditor({ initialAbout }: AboutEditorProps) {
  const [about, setAbout] = useState<AboutContent>(initialAbout);
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
      setMsg({ type: "success", text: "Đã cập nhật bài viết Giới thiệu Diễn đàn thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Lỗi lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Về Diễn Đàn (About Event)</h2>
          <p className="text-xs text-slate-400">Quản lý tiêu đề, bài viết giới thiệu, danh sách gạch đầu dòng nổi bật và hình ảnh minh họa.</p>
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

      {/* Nội dung bài viết */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">TIÊU ĐỀ & VĂN BẢN MÔ TẢ</h3>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Huy Hiệu (Badge)</label>
          <input
            type="text"
            value={about.badge}
            onChange={(e) => setAbout({ ...about, badge: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Tiêu Đề Lớn (Title)</label>
          <input
            type="text"
            value={about.title}
            onChange={(e) => setAbout({ ...about, title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Cụm Từ Nổi Bật (Highlight Text)</label>
          <input
            type="text"
            value={about.highlightText}
            onChange={(e) => setAbout({ ...about, highlightText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Đoạn Văn Mô Tả 1</label>
          <textarea
            rows={3}
            value={about.descriptionParagraph1}
            onChange={(e) => setAbout({ ...about, descriptionParagraph1: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Đoạn Văn Mô Tả 2</label>
          <textarea
            rows={3}
            value={about.descriptionParagraph2}
            onChange={(e) => setAbout({ ...about, descriptionParagraph2: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Gạch đầu dòng nổi bật */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">GẠCH ĐẦU DÒNG NỔI BẬT</h3>
          <button
            type="button"
            onClick={addBullet}
            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
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
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeBullet(idx)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hình ảnh sự kiện */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">HÌNH ẢNH SỰ KIỆN MINH HỌA</h3>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          {about.imageUrl && (
            <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-800 shrink-0">
              <Image src={about.imageUrl} alt="About preview" fill className="object-cover" />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">URL Hình Ảnh</label>
              <input
                type="text"
                value={about.imageUrl}
                onChange={(e) => setAbout({ ...about, imageUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors">
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
