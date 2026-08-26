"use client";

import { useState, useEffect } from "react";
import { TimelineContent, TimelineSlot, DayInfo, DEFAULT_TIMELINE } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  MapPin,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Clock,
  Mic,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TimelineEditorProps {
  initialTimeline: TimelineContent;
  onSaveSuccess?: (updatedTimeline: TimelineContent) => void;
}

export default function TimelineEditor({ initialTimeline, onSaveSuccess }: TimelineEditorProps) {
  const [timeline, setTimeline] = useState<TimelineContent>(() => {
    const base = initialTimeline || DEFAULT_TIMELINE;
    return {
      ...base,
      days: base.days && base.days.length > 0 ? base.days : DEFAULT_TIMELINE.days,
      slots: base.slots && base.slots.length > 0 ? base.slots : DEFAULT_TIMELINE.slots,
    };
  });

  useEffect(() => {
    if (initialTimeline) {
      setTimeline({
        ...DEFAULT_TIMELINE,
        ...initialTimeline,
        days: initialTimeline.days && initialTimeline.days.length > 0 ? initialTimeline.days : DEFAULT_TIMELINE.days,
        slots: initialTimeline.slots && initialTimeline.slots.length > 0 ? initialTimeline.slots : DEFAULT_TIMELINE.slots,
      });
    }
  }, [initialTimeline]);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Quản lý Ngày (Day Management)
  const handleDayChange = (dayNum: number, field: keyof DayInfo, value: string) => {
    const updatedDays = timeline.days.map((d) =>
      d.dayNumber === dayNum ? { ...d, [field]: value } : d
    );
    setTimeline({ ...timeline, days: updatedDays });
  };

  const addDay = () => {
    // Generate unique new dayNumber
    const existingDayNumbers = timeline.days.map((d) => d.dayNumber);
    const maxDayNum = existingDayNumbers.length > 0 ? Math.max(...existingDayNumbers) : 0;
    const nextDayNum = maxDayNum + 1;
    const displayNum = nextDayNum < 10 ? `0${nextDayNum}` : `${nextDayNum}`;

    const newDay: DayInfo = {
      dayNumber: nextDayNum,
      dayTitle: `Ngày ${displayNum}`,
      dateText: "21/09/2026",
      subTitle: `Chương trình Ngày ${displayNum}`,
      location: "May Plaza Hotel Thái Nguyên",
    };

    const initialSlot: TimelineSlot = {
      id: `ts-${Date.now()}`,
      dayNumber: nextDayNum,
      dayTitle: `Ngày ${displayNum}`,
      timeSlot: "08:00 - 11:30",
      title: "Chương trình / Hoạt động mới",
      description: "Mô tả nội dung chi tiết hoạt động trong ngày...",
      location: "Khách sạn May Plaza",
      highlight: false,
    };

    setTimeline({
      ...timeline,
      days: [...timeline.days, newDay],
      slots: [...timeline.slots, initialSlot],
    });
  };

  const removeDay = (dayNum: number) => {
    if (timeline.days.length <= 1) {
      alert("Cần giữ lại ít nhất 1 ngày trong lịch trình sự kiện!");
      return;
    }

    const dayToDelete = timeline.days.find((d) => d.dayNumber === dayNum);
    const slotsCount = timeline.slots.filter((s) => s.dayNumber === dayNum).length;

    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa "${dayToDelete?.dayTitle || `Ngày ${dayNum}`}" (${dayToDelete?.dateText}) cùng toàn bộ ${slotsCount} mốc thời gian của ngày này?`
      )
    ) {
      return;
    }

    const updatedDays = timeline.days.filter((d) => d.dayNumber !== dayNum);
    const updatedSlots = timeline.slots.filter((s) => s.dayNumber !== dayNum);

    setTimeline({
      ...timeline,
      days: updatedDays,
      slots: updatedSlots,
    });
  };

  const moveDay = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= timeline.days.length) return;

    const updatedDays = [...timeline.days];
    const temp = updatedDays[index];
    updatedDays[index] = updatedDays[targetIndex];
    updatedDays[targetIndex] = temp;

    setTimeline({ ...timeline, days: updatedDays });
  };

  // 2. Quản lý Mốc Thời Gian (Slots Management)
  const handleSlotChange = (slotId: string, field: keyof TimelineSlot, value: any) => {
    const updated = timeline.slots.map((s) =>
      s.id === slotId ? { ...s, [field]: value } : s
    );
    setTimeline({ ...timeline, slots: updated });
  };

  const addSlot = (dayNum: number) => {
    const dayItem = timeline.days.find((d) => d.dayNumber === dayNum);
    const newSlot: TimelineSlot = {
      id: `ts-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      dayNumber: dayNum,
      dayTitle: dayItem?.dayTitle || `Ngày ${dayNum}`,
      timeSlot: "14:00 - 16:30",
      title: "Hoạt động / Phiên làm việc mới",
      description: "Mô tả chi tiết nội dung chương trình...",
      location: dayItem?.location || "Hội trường May Plaza Hotel",
      highlight: false,
    };
    setTimeline({ ...timeline, slots: [...timeline.slots, newSlot] });
  };

  const removeSlot = (id: string) => {
    setTimeline({ ...timeline, slots: timeline.slots.filter((s) => s.id !== id) });
  };

  const moveSlot = (slotId: string, dayNum: number, direction: "up" | "down") => {
    // Find all slots for this day
    const daySlots = timeline.slots.filter((s) => s.dayNumber === dayNum);
    const currentDaySlotIdx = daySlots.findIndex((s) => s.id === slotId);
    if (currentDaySlotIdx === -1) return;

    const targetDaySlotIdx = direction === "up" ? currentDaySlotIdx - 1 : currentDaySlotIdx + 1;
    if (targetDaySlotIdx < 0 || targetDaySlotIdx >= daySlots.length) return;

    // Swap in daySlots
    const temp = daySlots[currentDaySlotIdx];
    daySlots[currentDaySlotIdx] = daySlots[targetDaySlotIdx];
    daySlots[targetDaySlotIdx] = temp;

    // Reconstruct global slots: replace slots of this day in-place
    const otherSlots = timeline.slots.filter((s) => s.dayNumber !== dayNum);
    setTimeline({
      ...timeline,
      slots: [...otherSlots, ...daySlots],
    });
  };

  // 3. Reset Defaults
  const handleResetDefaults = () => {
    if (window.confirm("Đặt lại toàn bộ Lịch trình sự kiện về mặc định ban đầu?")) {
      setTimeline(DEFAULT_TIMELINE);
    }
  };

  // 4. Lưu dữ liệu
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("timeline", timeline);
    setSaving(false);

    if (res.success) {
      onSaveSuccess?.(timeline);
      setMsg({ type: "success", text: "Đã cập nhật toàn bộ lịch trình và ngày sự kiện thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Không thể lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Quản Trị Lịch Trình & Các Ngày Sự Kiện (Timeline)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Thêm, sửa, xóa, đổi thứ tự các Ngày sự kiện (Ngày 1, 2, 3...) và chi tiết từng mốc thời gian, phiên thảo luận, địa điểm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Mặc Định
          </button>

          <button
            type="button"
            onClick={addDay}
            className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Thêm Ngày Mới
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu Thay Đổi
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
            msg.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* 1. Header config */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          1. Cấu Hình Tiêu Đề Khu Vực Lịch Trình
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Huy Hiệu (Badge Nhỏ)</label>
            <input
              type="text"
              value={timeline.badge || ""}
              onChange={(e) => setTimeline({ ...timeline, badge: e.target.value })}
              placeholder="VD: LỊCH TRÌNH CHUYÊN NGHIỆP"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Lớn (Title)</label>
            <input
              type="text"
              value={timeline.title || ""}
              onChange={(e) => setTimeline({ ...timeline, title: e.target.value })}
              placeholder="VD: Chương Trình Chi Tiết 3 Ngày Diễn Đàn"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none font-bold"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phụ Đề Mô Tả Ngắn (Subtitle)</label>
            <input
              type="text"
              value={timeline.subtitle || ""}
              onChange={(e) => setTimeline({ ...timeline, subtitle: e.target.value })}
              placeholder="VD: Chuỗi hoạt động phong phú gồm Triển lãm, Diễn đàn cấp cao, B2B Matching, Gala Dinner..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Banner Quy Mô Sự Kiện & Chân Banner (Footer Strip) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          2. Cấu Hình Banner Quy Mô &amp; Chân Banner (Footer Banner Strip)
        </h3>
        <p className="text-xs text-slate-500">
          Chỉnh sửa tiêu đề nhỏ, dòng ngày tháng 📅 và dòng địa điểm 📍 hiển thị dưới đáy banner quy mô.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu Đề Nhỏ Trên Banner (Eyebrow)
            </label>
            <input
              type="text"
              value={timeline.bannerEyebrow || ""}
              onChange={(e) => setTimeline({ ...timeline, bannerEyebrow: e.target.value })}
              placeholder="VD: ✦ Quy mô sự kiện · 3 ngày sôi động ✦"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              📅 Dòng Ngày Ở Chân Banner (Banner Date Footer)
            </label>
            <input
              type="text"
              value={timeline.bannerDateText || ""}
              onChange={(e) => setTimeline({ ...timeline, bannerDateText: e.target.value })}
              placeholder="VD: 18 – 20 / 09 / 2026"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              📍 Dòng Địa Điểm Ở Chân Banner (Banner Location Footer)
            </label>
            <input
              type="text"
              value={timeline.bannerLocationText || ""}
              onChange={(e) => setTimeline({ ...timeline, bannerLocationText: e.target.value })}
              placeholder="VD: May Plaza Hotel, Thái Nguyên"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* 5 Con số thống kê banner */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-800 mb-2">
            5 Chỉ Số Thống Kê Quy Mô Sự Kiện (Cards)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {(timeline.bannerStats && timeline.bannerStats.length > 0
              ? timeline.bannerStats
              : (DEFAULT_TIMELINE.bannerStats || [])
            ).map((stat, sIdx) => (
              <div key={stat.id || sIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase">Chỉ số #{sIdx + 1}</span>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Số / Giá trị</label>
                  <input
                    type="text"
                    value={stat.value || ""}
                    onChange={(e) => {
                      const currentStats = [...(timeline.bannerStats || DEFAULT_TIMELINE.bannerStats || [])];
                      currentStats[sIdx] = { ...currentStats[sIdx], value: e.target.value };
                      setTimeline({ ...timeline, bannerStats: currentStats });
                    }}
                    placeholder="100+"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-black text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Nhãn (Label)</label>
                  <input
                    type="text"
                    value={stat.label || ""}
                    onChange={(e) => {
                      const currentStats = [...(timeline.bannerStats || DEFAULT_TIMELINE.bannerStats || [])];
                      currentStats[sIdx] = { ...currentStats[sIdx], label: e.target.value };
                      setTimeline({ ...timeline, bannerStats: currentStats });
                    }}
                    placeholder="Phiên B2B"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Phụ đề (Sub)</label>
                  <input
                    type="text"
                    value={stat.sub || ""}
                    onChange={(e) => {
                      const currentStats = [...(timeline.bannerStats || DEFAULT_TIMELINE.bannerStats || [])];
                      currentStats[sIdx] = { ...currentStats[sIdx], sub: e.target.value };
                      setTimeline({ ...timeline, bannerStats: currentStats });
                    }}
                    placeholder="Kết nối 1:1"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-[11px] text-slate-700 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Days List & Slot Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              3. Danh Sách Các Ngày Diễn Ra Sự Kiện ({timeline.days.length} Ngày)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bạn có thể tự do thêm bớt ngày, chỉnh ngày diễn ra, chủ đề và các mốc thời gian chi tiết của từng ngày.
            </p>
          </div>

          <button
            type="button"
            onClick={addDay}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm Ngày Mới
          </button>
        </div>

        {timeline.days.map((dayItem, dayIdx) => {
          const dayNum = dayItem.dayNumber;
          const daySlots = timeline.slots.filter((s) => s.dayNumber === dayNum);

          return (
            <div
              key={dayNum}
              className="bg-white border-2 border-emerald-100 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm relative transition-all"
            >
              {/* Day Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-emerald-900 bg-emerald-100/80 px-3.5 py-1.5 rounded-xl border border-emerald-300">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    {dayItem.dayTitle || `Ngày ${dayNum}`} · {dayItem.dateText}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    ({daySlots.length} mốc hoạt động)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Di chuyển thứ tự Ngày */}
                  <button
                    type="button"
                    disabled={dayIdx === 0}
                    onClick={() => moveDay(dayIdx, "up")}
                    className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Đổi thứ tự ngày lên trên"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={dayIdx === timeline.days.length - 1}
                    onClick={() => moveDay(dayIdx, "down")}
                    className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Đổi thứ tự ngày xuống dưới"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  {/* Thêm mốc thời gian cho ngày này */}
                  <button
                    type="button"
                    onClick={() => addSlot(dayNum)}
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm Mốc Giờ
                  </button>

                  {/* Xóa Ngày */}
                  {timeline.days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(dayNum)}
                      className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 font-semibold transition-colors cursor-pointer"
                      title="Xóa toàn bộ ngày này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Xóa Ngày</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Day Config Inputs (Tên thẻ, ngày diễn ra, chủ đề, địa điểm) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tên Thẻ Ngày
                  </label>
                  <input
                    type="text"
                    value={dayItem.dayTitle || ""}
                    onChange={(e) => handleDayChange(dayNum, "dayTitle", e.target.value)}
                    placeholder="VD: Ngày 01"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Ngày Diễn Ra (Text)
                  </label>
                  <input
                    type="text"
                    value={dayItem.dateText || ""}
                    onChange={(e) => handleDayChange(dayNum, "dateText", e.target.value)}
                    placeholder="VD: 18/09/2026"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Chủ Đề Ngày
                  </label>
                  <input
                    type="text"
                    value={dayItem.subTitle || ""}
                    onChange={(e) => handleDayChange(dayNum, "subTitle", e.target.value)}
                    placeholder="VD: Khai mạc & Diễn đàn..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Địa Điểm Ngày
                  </label>
                  <input
                    type="text"
                    value={dayItem.location || ""}
                    onChange={(e) => handleDayChange(dayNum, "location", e.target.value)}
                    placeholder="VD: May Plaza Hotel Thái Nguyên"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Slots List for this day */}
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                    Các Mốc Thời Gian Trong {dayItem.dayTitle || `Ngày ${dayNum}`}:
                  </span>
                  <button
                    type="button"
                    onClick={() => addSlot(dayNum)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm mốc giờ mới
                  </button>
                </div>

                {daySlots.length === 0 ? (
                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2">
                    <p className="text-xs text-slate-500 italic">Chưa có mốc thời gian nào cho ngày này.</p>
                    <button
                      type="button"
                      onClick={() => addSlot(dayNum)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Mốc Thời Gian Đầu Tiên
                    </button>
                  </div>
                ) : (
                  daySlots.map((slot, slotIdx) => (
                    <div
                      key={slot.id}
                      className={`border rounded-xl p-4 space-y-3 transition-all ${
                        slot.highlight
                          ? "bg-amber-50/40 border-amber-300 shadow-sm"
                          : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Slot Top Header */}
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            {slot.timeSlot || "Chưa đặt giờ"} — {slot.title || "Chưa có tên"}
                          </span>
                          {slot.highlight && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                              <Sparkles className="w-3 h-3 text-amber-600" /> Trọng điểm
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Di chuyển slot up/down */}
                          <button
                            type="button"
                            disabled={slotIdx === 0}
                            onClick={() => moveSlot(slot.id, dayNum, "up")}
                            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                            title="Di chuyển lên"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={slotIdx === daySlots.length - 1}
                            onClick={() => moveSlot(slot.id, dayNum, "down")}
                            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                            title="Di chuyển xuống"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Xóa slot */}
                          <button
                            type="button"
                            onClick={() => removeSlot(slot.id)}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors ml-1"
                            title="Xóa mốc giờ này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Slot Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Khung Giờ
                          </label>
                          <input
                            type="text"
                            value={slot.timeSlot || ""}
                            onChange={(e) => handleSlotChange(slot.id, "timeSlot", e.target.value)}
                            placeholder="VD: 13:00 - 14:00"
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:border-emerald-600 focus:outline-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Tên Hoạt Động / Chương Trình
                          </label>
                          <input
                            type="text"
                            value={slot.title || ""}
                            onChange={(e) => handleSlotChange(slot.id, "title", e.target.value)}
                            placeholder="VD: Lễ Khai mạc Diễn đàn SME..."
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:border-emerald-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Diễn Giả / Chủ Trì (tùy chọn)
                          </label>
                          <input
                            type="text"
                            value={slot.speaker || ""}
                            onChange={(e) => handleSlotChange(slot.id, "speaker", e.target.value)}
                            placeholder="VD: Lãnh đạo UBND tỉnh..."
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Địa Điểm / Phòng (tùy chọn)
                          </label>
                          <input
                            type="text"
                            value={slot.location || ""}
                            onChange={(e) => handleSlotChange(slot.id, "location", e.target.value)}
                            placeholder="VD: Hội trường tầng 3..."
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center pt-5">
                          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!slot.highlight}
                              onChange={(e) => handleSlotChange(slot.id, "highlight", e.target.checked)}
                              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-semibold text-amber-900">
                              🌟 Hoạt động trọng điểm (Nổi bật)
                            </span>
                          </label>
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Mô Tả Chi Tiết Nội Dung
                          </label>
                          <textarea
                            rows={2}
                            value={slot.description || ""}
                            onChange={(e) => handleSlotChange(slot.id, "description", e.target.value)}
                            placeholder="Nhập mô tả tóm tắt nội dung của phiên hoạt động này..."
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}
