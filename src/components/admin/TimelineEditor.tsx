"use client";

import { useState, useEffect } from "react";
import { TimelineContent, TimelineSlot } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";

interface TimelineEditorProps {
  initialTimeline: TimelineContent;
  onSaveSuccess?: (updatedTimeline: TimelineContent) => void;
}

export default function TimelineEditor({ initialTimeline, onSaveSuccess }: TimelineEditorProps) {
  const [timeline, setTimeline] = useState<TimelineContent>(initialTimeline);

  useEffect(() => {
    setTimeline(initialTimeline);
  }, [initialTimeline]);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSlotChange = (index: number, field: keyof TimelineSlot, value: any) => {
    const updated = [...timeline.slots];
    updated[index] = { ...updated[index], [field]: value };
    setTimeline({ ...timeline, slots: updated });
  };

  const addSlot = (dayNum: number) => {
    const newSlot: TimelineSlot = {
      id: `ts-${Date.now()}`,
      dayNumber: dayNum,
      dayTitle: `Ngày ${dayNum}`,
      timeSlot: "09:00 - 10:00",
      title: "Chương trình mới",
      description: "Mô tả nội dung chương trình",
      location: "Hội trường Grand Ballroom",
    };
    setTimeline({ ...timeline, slots: [...timeline.slots, newSlot] });
  };

  const removeSlot = (id: string) => {
    setTimeline({ ...timeline, slots: timeline.slots.filter((s) => s.id !== id) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("timeline", timeline);
    setSaving(false);

    if (res.success) {
      onSaveSuccess?.(timeline);
      setMsg({ type: "success", text: "Đã cập nhật lịch trình sự kiện 3 ngày thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Không thể lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Lịch Trình 3 Ngày Diễn Đàn</h2>
          <p className="text-xs text-slate-500 mt-1">Thêm, sửa, xóa các mốc thời gian, tiêu đề, diễn giả và địa điểm diễn ra chương trình.</p>
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

      {/* Title & Badge */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">CẤU HÌNH TIÊU ĐỀ LỊCH TRÌNH</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Badge</label>
            <input
              type="text"
              value={timeline.badge}
              onChange={(e) => setTimeline({ ...timeline, badge: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Lịch Trình</label>
            <input
              type="text"
              value={timeline.title}
              onChange={(e) => setTimeline({ ...timeline, title: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phụ Đề Mô Tả Ngắn</label>
            <input
              type="text"
              value={timeline.subtitle}
              onChange={(e) => setTimeline({ ...timeline, subtitle: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3 Days Tabs */}
      {[1, 2, 3].map((dayNum) => {
        const dayInfo = timeline.days.find((d) => d.dayNumber === dayNum);
        const daySlots = timeline.slots.filter((s) => s.dayNumber === dayNum);

        return (
          <div key={dayNum} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                NGÀY {dayNum}: {dayInfo?.dayTitle || `Ngày ${dayNum}`} ({dayInfo?.dateText})
              </h3>
              <button
                type="button"
                onClick={() => addSlot(dayNum)}
                className="inline-flex items-center gap-1 text-[11px] text-slate-900 hover:text-black font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Mốc Thời Gian
              </button>
            </div>

            <div className="space-y-4">
              {daySlots.map((slot) => {
                const globalIndex = timeline.slots.findIndex((s) => s.id === slot.id);
                return (
                  <div key={slot.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Mốc thời gian</span>
                      <button
                        type="button"
                        onClick={() => removeSlot(slot.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg font-semibold transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Khung Giờ</label>
                        <input
                          type="text"
                          value={slot.timeSlot}
                          onChange={(e) => handleSlotChange(globalIndex, "timeSlot", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tên Chương Trình / Bài Trình Bày</label>
                        <input
                          type="text"
                          value={slot.title}
                          onChange={(e) => handleSlotChange(globalIndex, "title", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Diễn Giả / Đơn Vị</label>
                        <input
                          type="text"
                          value={slot.speaker || ""}
                          onChange={(e) => handleSlotChange(globalIndex, "speaker", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Địa Điểm / Phòng</label>
                        <input
                          type="text"
                          value={slot.location || ""}
                          onChange={(e) => handleSlotChange(globalIndex, "location", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mô Tả Tóm Tắt</label>
                        <input
                          type="text"
                          value={slot.description || ""}
                          onChange={(e) => handleSlotChange(globalIndex, "description", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </form>
  );
}
