"use client";

import { useState } from "react";
import { SpeakersContent, SpeakerItem } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { uploadImageToStorage } from "@/lib/cmsClient";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, Upload, Mic } from "lucide-react";
import Image from "next/image";

interface SpeakersEditorProps {
  initialSpeakers: SpeakersContent;
}

export default function SpeakersEditor({ initialSpeakers }: SpeakersEditorProps) {
  const [speakersContent, setSpeakersContent] = useState<SpeakersContent>(initialSpeakers);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const items = speakersContent.items || [];

  const handleItemChange = (index: number, field: keyof SpeakerItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setSpeakersContent({ ...speakersContent, items: updated });
  };

  const addSpeaker = () => {
    const newSpeaker: SpeakerItem = {
      id: `spk-${Date.now()}`,
      name: "Diễn giả mới",
      title: "Chức vụ / Chuyên gia",
      organization: "Tổ chức / Doanh nghiệp",
      topic: "Chủ đề bài phát biểu",
      badge: "Keynote Speaker",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    };
    setSpeakersContent({ ...speakersContent, items: [...items, newSpeaker] });
  };

  const removeSpeaker = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setSpeakersContent({ ...speakersContent, items: updated });
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(index);
    const { url, error } = await uploadImageToStorage(file);
    setUploadingIdx(null);

    if (error || !url) {
      alert("Tải ảnh thất bại: " + (error || "Lỗi không xác định"));
    } else {
      handleItemChange(index, "imageUrl", url);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("speakers", speakersContent);
    setSaving(false);

    if (res.success) {
      setMsg({ type: "success", text: "Đã cập nhật danh sách Diễn giả thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Lỗi lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Diễn Giả & Khách Mời VIP (Keynote Speakers)</h2>
          <p className="text-xs text-slate-400">
            Quản lý danh sách các diễn giả, chuyên gia kinh tế, bài phát biểu & hình ảnh chân dung.
          </p>
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

      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">TIÊU ĐỀ PHẦN DIỄN GIẢ</h3>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Huy Hiệu (Badge)</label>
          <input
            type="text"
            value={speakersContent.badge || ""}
            onChange={(e) => setSpeakersContent({ ...speakersContent, badge: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Tiêu Đề (Title)</label>
          <input
            type="text"
            value={speakersContent.title || ""}
            onChange={(e) => setSpeakersContent({ ...speakersContent, title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Mô Tả Phụ (Subtitle)</label>
          <input
            type="text"
            value={speakersContent.subtitle || ""}
            onChange={(e) => setSpeakersContent({ ...speakersContent, subtitle: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Speakers List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">DANH SÁCH DIỄN GIẢ</h3>
          <button
            type="button"
            onClick={addSpeaker}
            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <Plus className="w-4 h-4" /> Thêm Diễn Giả
          </button>
        </div>

        <div className="space-y-4">
          {items.map((spk, idx) => (
            <div key={spk.id || idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
              <button
                type="button"
                onClick={() => removeSpeaker(idx)}
                className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-3 flex flex-col items-center gap-2">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                    <Image src={spk.imageUrl} alt={spk.name} fill className="object-cover object-top" />
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer transition-colors">
                    {uploadingIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>Đổi ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(idx, e)}
                      disabled={uploadingIdx === idx}
                    />
                  </label>
                </div>

                <div className="sm:col-span-9 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Họ & Tên</label>
                      <input
                        type="text"
                        value={spk.name}
                        onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Huy Hiệu (Badge)</label>
                      <input
                        type="text"
                        value={spk.badge || ""}
                        onChange={(e) => handleItemChange(idx, "badge", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Chức Vụ</label>
                      <input
                        type="text"
                        value={spk.title}
                        onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Tổ Chức / Đơn Vị</label>
                      <input
                        type="text"
                        value={spk.organization}
                        onChange={(e) => handleItemChange(idx, "organization", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Chủ Đề Phát Biểu Main Keynote</label>
                    <input
                      type="text"
                      value={spk.topic || ""}
                      onChange={(e) => handleItemChange(idx, "topic", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
