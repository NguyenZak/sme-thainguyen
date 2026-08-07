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
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Diễn Giả & Khách Mời VIP (Keynote Speakers)</h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý danh sách các diễn giả, chuyên gia kinh tế, bài phát biểu & hình ảnh chân dung.
          </p>
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

      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">TIÊU ĐỀ PHẦN DIỄN GIẢ</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Huy Hiệu (Badge)</label>
          <input
            type="text"
            value={speakersContent.badge || ""}
            onChange={(e) => setSpeakersContent({ ...speakersContent, badge: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề (Title)</label>
          <input
            type="text"
            value={speakersContent.title || ""}
            onChange={(e) => setSpeakersContent({ ...speakersContent, title: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Mô Tả Phụ (Subtitle)</label>
          <input
            type="text"
            value={speakersContent.subtitle || ""}
            onChange={(e) => setSpeakersContent({ ...speakersContent, subtitle: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Speakers List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">DANH SÁCH DIỄN GIẢ</h3>
          <button
            type="button"
            onClick={addSpeaker}
            className="inline-flex items-center gap-1 text-xs text-slate-900 hover:text-black font-bold"
          >
            <Plus className="w-4 h-4" /> Thêm Diễn Giả
          </button>
        </div>

        <div className="space-y-4">
          {items.map((spk, idx) => (
            <div key={spk.id || idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <span className="text-xs font-bold text-slate-900">DIỄN GIẢ #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSpeaker(idx)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa diễn giả</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-3 flex flex-col items-center gap-2">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-300 shrink-0">
                    <Image src={spk.imageUrl} alt={spk.name} fill className="object-cover object-top" />
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors shadow-sm">
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
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Họ & Tên</label>
                      <input
                        type="text"
                        value={spk.name}
                        onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Huy Hiệu (Badge)</label>
                      <input
                        type="text"
                        value={spk.badge || ""}
                        onChange={(e) => handleItemChange(idx, "badge", e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Chức Vụ</label>
                      <input
                        type="text"
                        value={spk.title}
                        onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Tổ Chức / Đơn Vị</label>
                      <input
                        type="text"
                        value={spk.organization}
                        onChange={(e) => handleItemChange(idx, "organization", e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Chủ Đề Phát Biểu Main Keynote</label>
                    <input
                      type="text"
                      value={spk.topic || ""}
                      onChange={(e) => handleItemChange(idx, "topic", e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Thành tựu nổi bật</label>
                    <textarea
                      value={spk.achievements || ""}
                      onChange={(e) => handleItemChange(idx, "achievements", e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none resize-none"
                      placeholder="Ví dụ: 20+ năm tư vấn chính sách kinh tế..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Vì sao nên nghe</label>
                    <textarea
                      value={spk.whyListen || ""}
                      onChange={(e) => handleItemChange(idx, "whyListen", e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none resize-none"
                      placeholder="Ví dụ: Cung cấp chiến lược triển khai thực tế..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Giá trị bài nói</label>
                    <textarea
                      value={spk.speechValue || ""}
                      onChange={(e) => handleItemChange(idx, "speechValue", e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none resize-none"
                      placeholder="Ví dụ: Hướng dẫn mô hình kết nối đầu tư và đột phá doanh thu..."
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
