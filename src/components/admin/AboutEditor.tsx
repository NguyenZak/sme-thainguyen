"use client";

import { useState, useEffect } from "react";
import { AboutContent, AttendeeTag, FeatureCard, DEFAULT_ABOUT } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { uploadImageToStorage } from "@/lib/cmsClient";
import RichTextarea from "@/components/admin/RichTextarea";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  Layers,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import Image from "next/image";

interface AboutEditorProps {
  initialAbout: AboutContent;
  onSaveSuccess?: (updatedAbout: AboutContent) => void;
}

export default function AboutEditor({ initialAbout, onSaveSuccess }: AboutEditorProps) {
  const [about, setAbout] = useState<AboutContent>({
    ...DEFAULT_ABOUT,
    ...(initialAbout || {}),
    featureCards:
      initialAbout?.featureCards && initialAbout.featureCards.length > 0
        ? initialAbout.featureCards
        : DEFAULT_ABOUT.featureCards,
    attendeeTags:
      initialAbout?.attendeeTags && initialAbout.attendeeTags.length > 0
        ? initialAbout.attendeeTags
        : DEFAULT_ABOUT.attendeeTags,
    bullets:
      initialAbout?.bullets && initialAbout.bullets.length > 0
        ? initialAbout.bullets
        : DEFAULT_ABOUT.bullets,
  });

  useEffect(() => {
    if (initialAbout) {
      setAbout({
        ...DEFAULT_ABOUT,
        ...initialAbout,
        featureCards:
          initialAbout.featureCards && initialAbout.featureCards.length > 0
            ? initialAbout.featureCards
            : DEFAULT_ABOUT.featureCards,
        attendeeTags:
          initialAbout.attendeeTags && initialAbout.attendeeTags.length > 0
            ? initialAbout.attendeeTags
            : DEFAULT_ABOUT.attendeeTags,
        bullets:
          initialAbout.bullets && initialAbout.bullets.length > 0
            ? initialAbout.bullets
            : DEFAULT_ABOUT.bullets,
      });
    }
  }, [initialAbout]);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Feature Cards handlers
  const handleFeatureCardChange = (index: number, field: keyof FeatureCard, value: string) => {
    const updated = [...about.featureCards];
    updated[index] = { ...updated[index], [field]: value };
    setAbout({ ...about, featureCards: updated });
  };

  const addFeatureCard = () => {
    const nextRank = about.featureCards.length + 1;
    const formattedRank = nextRank < 10 ? `0${nextRank}` : `${nextRank}`;
    const newCard: FeatureCard = {
      id: `card-${Date.now()}`,
      rank: formattedRank,
      title: "Tính năng nổi bật mới",
      description: "Mô tả chi tiết giá trị và cơ hội hợp tác kết nối tại diễn đàn...",
      footerLabel: "Giao thương trực tiếp",
      footerText: "Tạo cơ hội đột phá doanh thu và mở rộng thị trường.",
      iconName: "Target",
    };
    setAbout({ ...about, featureCards: [...about.featureCards, newCard] });
  };

  const removeFeatureCard = (index: number) => {
    if (about.featureCards.length <= 1) {
      alert("Cần giữ lại ít nhất 1 thẻ tính năng!");
      return;
    }
    const updated = about.featureCards.filter((_, i) => i !== index);
    setAbout({ ...about, featureCards: updated });
  };

  const moveFeatureCard = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= about.featureCards.length) return;
    const updated = [...about.featureCards];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setAbout({ ...about, featureCards: updated });
  };

  // 2. Attendee Tags handlers
  const handleAttendeeTagChange = (index: number, field: keyof AttendeeTag, value: any) => {
    const updated = [...about.attendeeTags];
    updated[index] = { ...updated[index], [field]: value };
    setAbout({ ...about, attendeeTags: updated });
  };

  const addAttendeeTag = () => {
    const nextRank = about.attendeeTags.length + 1;
    const formattedRank = nextRank < 10 ? `0${nextRank}` : `${nextRank}`;
    const newTag: AttendeeTag = {
      id: `tag-${Date.now()}`,
      rank: formattedRank,
      label: "Nhóm đại biểu mới",
      sub: "Đại diện cơ quan / tổ chức / doanh nhân tham dự",
      tier: "gold",
      iconName: "Users",
      count: "100+ Đại biểu",
    };
    setAbout({ ...about, attendeeTags: [...about.attendeeTags, newTag] });
  };

  const removeAttendeeTag = (index: number) => {
    if (about.attendeeTags.length <= 1) {
      alert("Cần giữ lại ít nhất 1 thẻ thành phần tham dự!");
      return;
    }
    const updated = about.attendeeTags.filter((_, i) => i !== index);
    setAbout({ ...about, attendeeTags: updated });
  };

  const moveAttendeeTag = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= about.attendeeTags.length) return;
    const updated = [...about.attendeeTags];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setAbout({ ...about, attendeeTags: updated });
  };

  // 3. Bullets handlers
  const handleBulletChange = (index: number, value: string) => {
    const updated = [...about.bullets];
    updated[index] = value;
    setAbout({ ...about, bullets: updated });
  };

  const addBullet = () => {
    setAbout({ ...about, bullets: [...about.bullets, "Điểm nổi bật mới của diễn đàn"] });
  };

  const removeBullet = (index: number) => {
    const updated = about.bullets.filter((_, i) => i !== index);
    setAbout({ ...about, bullets: updated });
  };

  // Image Upload
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

  // Reset defaults
  const handleResetDefaults = () => {
    if (window.confirm("Đặt lại toàn bộ nội dung phần Giới Thiệu (About) về mặc định?")) {
      setAbout(DEFAULT_ABOUT);
    }
  };

  // Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("about", about);
    setSaving(false);

    if (res.success) {
      onSaveSuccess?.(about);
      setMsg({ type: "success", text: "Đã cập nhật toàn bộ nội dung Giới thiệu & Thành phần tham dự thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Lỗi lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Info className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Quản Trị Về Diễn Đàn & Thành Phần Tham Dự (About)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Toàn quyền thêm, sửa, xóa các thẻ tính năng 01-04, 6 thẻ thành phần đại biểu trọng điểm VIP, bài viết giới thiệu & hình ảnh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Mặc Định
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 cursor-pointer"
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

      {/* 1. Header & Text Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
          1. Tiêu Đề & Văn Bản Mô Tả Giới Thiệu
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Huy Hiệu (Badge Nhỏ)</label>
            <input
              type="text"
              value={about.badge || ""}
              onChange={(e) => setAbout({ ...about, badge: e.target.value })}
              placeholder="VD: 01 · TỔNG QUAN - Về sự kiện"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Lớn (Title)</label>
            <input
              type="text"
              value={about.title || ""}
              onChange={(e) => setAbout({ ...about, title: e.target.value })}
              placeholder="VD: Diễn đàn Kết Nối Giao Thương SME Việt Nam 2026"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cụm Từ Nổi Bật (Highlight Text)</label>
            <input
              type="text"
              value={about.highlightText || ""}
              onChange={(e) => setAbout({ ...about, highlightText: e.target.value })}
              placeholder="VD: Vietnam SME Prosperity Link Forum 2026"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <RichTextarea
              label="Đoạn Văn Mô Tả Giới Thiệu Chính"
              subLabel="💡 Hỗ trợ in đậm <b>, nghiêng <i>, xuống dòng..."
              value={about.descriptionParagraph1 || ""}
              onChange={(val) => setAbout({ ...about, descriptionParagraph1: val })}
              placeholder="Nhập đoạn văn mô tả tổng quan sự kiện..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* 2. Numbered Feature Cards Grid (4 Thẻ tính năng tổng quan) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Các Thẻ Tính Năng Tổng Quan (Feature Cards)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm, sửa, xóa các thẻ tính năng (Kết nối giao thương, Xúc tiến đầu tư, Ký kết MOU, Quảng bá...).
            </p>
          </div>
          <button
            type="button"
            onClick={addFeatureCard}
            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Thẻ Tính Năng
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {about.featureCards.map((card, idx) => (
            <div key={card.id || idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 relative group">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-black text-emerald-900 uppercase">
                  THẺ TÍNH NĂNG #{idx + 1} (Số thứ tự: {card.rank})
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveFeatureCard(idx, "up")}
                    className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                    title="Di chuyển lên"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === about.featureCards.length - 1}
                    onClick={() => moveFeatureCard(idx, "down")}
                    className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                    title="Di chuyển xuống"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  {about.featureCards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureCard(idx)}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded transition-colors"
                      title="Xóa thẻ này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mã Số (Rank)</label>
                  <input
                    type="text"
                    value={card.rank || ""}
                    onChange={(e) => handleFeatureCardChange(idx, "rank", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Biểu Tượng (Icon)</label>
                  <select
                    value={card.iconName || "Target"}
                    onChange={(e) => handleFeatureCardChange(idx, "iconName", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Target">Target (Mục tiêu / Kết nối)</option>
                    <option value="Users">Users (Người dùng / Đại biểu)</option>
                    <option value="ShieldCheck">ShieldCheck (Ký kết MOU)</option>
                    <option value="Award">Award (Vinh danh / Quảng bá)</option>
                    <option value="TrendingUp">TrendingUp (Đầu tư / Tăng trưởng)</option>
                    <option value="Building2">Building2 (Doanh nghiệp)</option>
                    <option value="Globe2">Globe2 (Quốc tế)</option>
                    <option value="Landmark">Landmark (Chính phủ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tiêu Đề Thẻ</label>
                <input
                  type="text"
                  value={card.title || ""}
                  onChange={(e) => handleFeatureCardChange(idx, "title", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <RichTextarea
                  label="Nội Dung Mô Tả"
                  value={card.description || ""}
                  onChange={(val) => handleFeatureCardChange(idx, "description", val)}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nhãn Ghi Chú Đáy (Footer Label)</label>
                <input
                  type="text"
                  value={card.footerLabel || ""}
                  onChange={(e) => handleFeatureCardChange(idx, "footerLabel", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-emerald-800 font-semibold focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Attendee Tags (Thành phần tham dự trọng điểm VIP/GOLD/STANDARD) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Khối Thành Phần Tham Dự Trọng Điểm (Attendee Tags)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm, sửa, xóa các thẻ đại biểu (Lãnh đạo Chính phủ, 500+ CEO, Quỹ đầu tư, FDI, BQL KCN...).
            </p>
          </div>
          <button
            type="button"
            onClick={addAttendeeTag}
            className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-bold bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Nhóm Đại Biểu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {about.attendeeTags.map((tag, idx) => (
            <div key={tag.id || idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 relative group">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-black text-slate-900 uppercase">
                  ĐẠI BIỂU #{idx + 1} ({tag.rank})
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveAttendeeTag(idx, "up")}
                    className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                    title="Di chuyển lên"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === about.attendeeTags.length - 1}
                    onClick={() => moveAttendeeTag(idx, "down")}
                    className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                    title="Di chuyển xuống"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  {about.attendeeTags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAttendeeTag(idx)}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded transition-colors"
                      title="Xóa nhóm này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phân Cấp (Tier)</label>
                  <select
                    value={tag.tier}
                    onChange={(e) => handleAttendeeTagChange(idx, "tier", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="vip">★ VIP (Nổi bật Vàng)</option>
                    <option value="gold">◆ GOLD (Nổi bật Xanh)</option>
                    <option value="standard">STANDARD (Tiêu chuẩn)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Biểu Tượng (Icon)</label>
                  <select
                    value={tag.iconName || "Crown"}
                    onChange={(e) => handleAttendeeTagChange(idx, "iconName", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Landmark">Landmark (Chính phủ)</option>
                    <option value="Crown">Crown (Lãnh đạo / CEO)</option>
                    <option value="TrendingUp">TrendingUp (Quỹ đầu tư)</option>
                    <option value="Building2">Building2 (Hiệp hội)</option>
                    <option value="Globe2">Globe2 (Quốc tế / FDI)</option>
                    <option value="Factory">Factory (KCN / Khu kinh tế)</option>
                    <option value="Award">Award (Vinh danh)</option>
                    <option value="Users">Users (Đại biểu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tên Nhóm Đại Biểu</label>
                <input
                  type="text"
                  value={tag.label || ""}
                  onChange={(e) => handleAttendeeTagChange(idx, "label", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dòng Chi Tiết / Phụ Đề</label>
                <input
                  type="text"
                  value={tag.sub || ""}
                  onChange={(e) => handleAttendeeTagChange(idx, "sub", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Huy Hiệu Số Lượng (Pill Badge)</label>
                <input
                  type="text"
                  value={tag.count || ""}
                  onChange={(e) => handleAttendeeTagChange(idx, "count", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bullets */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Gạch Đầu Dòng Ý Nổi Bật (Highlights)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Thêm, sửa, xóa các luận điểm cốt lõi của sự kiện.</p>
          </div>
          <button
            type="button"
            onClick={addBullet}
            className="inline-flex items-center gap-1 text-[11px] text-slate-900 hover:text-black font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Ý Nổi Bật
          </button>
        </div>

        <div className="space-y-2">
          {about.bullets.map((b, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-6 text-center text-xs font-bold text-slate-400 shrink-0">#{idx + 1}</span>
              <input
                type="text"
                value={b}
                onChange={(e) => handleBulletChange(idx, e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
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

      {/* 5. Image */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
          5. Hình Ảnh Sự Kiện Minh Họa
        </h3>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          {about.imageUrl && (
            <div className="relative w-44 h-32 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-sm">
              <Image src={about.imageUrl} alt="About preview" fill className="object-cover" />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL Hình Ảnh</label>
              <input
                type="text"
                value={about.imageUrl || ""}
                onChange={(e) => setAbout({ ...about, imageUrl: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
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
