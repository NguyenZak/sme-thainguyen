"use client";

import { useState, useEffect } from "react";
import RichTextarea from "@/components/admin/RichTextarea";
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  Ticket,
  Store,
  Handshake,
  MapPin,
  ChevronDown,
  X,
} from "lucide-react";
import { FaqItem, FaqContent, DEFAULT_FAQ_CONTENT, DEFAULT_FAQS } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cms";
import { toast } from "@/components/ui/Toast";

const CATEGORY_OPTIONS: { id: FaqItem["category"]; label: string; icon: any }[] = [
  { id: "general", label: "Chung & Địa điểm", icon: MapPin },
  { id: "ticket", label: "Vé đại biểu", icon: Ticket },
  { id: "booth", label: "Gian hàng B2B", icon: Store },
  { id: "sponsor", label: "Gói tài trợ", icon: Handshake },
  { id: "all", label: "Tất cả", icon: Sparkles },
];

interface FaqEditorProps {
  initialContent?: FaqContent;
  onSaveSuccess?: (updatedContent: FaqContent) => void;
}

export default function FaqEditor({ initialContent, onSaveSuccess }: FaqEditorProps) {
  const [content, setContent] = useState<FaqContent>(initialContent || DEFAULT_FAQ_CONTENT);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [previewOpenId, setPreviewOpenId] = useState<string | null>("faq-1");
  const [searchTerm, setSearchTerm] = useState("");

  const items = content.items && content.items.length > 0 ? content.items : DEFAULT_FAQS;

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await updateSectionAction("faq", content);
      if (res.success) {
        onSaveSuccess?.(content);
        toast.success("Lưu FAQ thành công! 🎉", "Đã cập nhật danh sách câu hỏi thường gặp lên trang chủ.");
      } else {
        toast.error("Lưu thất bại!", res.error || "Không thể lưu dữ liệu FAQ.");
      }
    } catch (err: any) {
      toast.error("Lỗi khi lưu!", err?.message || "Đã xảy ra lỗi kết nối.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = () => {
    const newItem: FaqItem = {
      id: `faq-${Date.now()}`,
      category: "general",
      badge: "Mới",
      question: "Câu hỏi mới cần giải đáp?",
      answer: "Nội dung câu trả lời chi tiết và hướng dẫn dành cho doanh nghiệp / đại biểu tham gia diễn đàn.",
    };
    setContent((prev) => ({
      ...prev,
      items: [newItem, ...(prev.items || [])],
    }));
    setEditingItem(newItem);
    toast.info("Đã tạo câu hỏi mới!", "Hãy chỉnh sửa nội dung câu hỏi và câu trả lời ở bên dưới.");
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này khỏi danh sách FAQ?")) {
      setContent((prev) => ({
        ...prev,
        items: (prev.items || []).filter((item) => item.id !== id),
      }));
      if (editingItem?.id === id) {
        setEditingItem(null);
      }
      toast.success("Đã xóa câu hỏi!", "Nhớ bấm nút 'Lưu Thay Đổi' để cập nhật lên trang web.");
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setContent((prev) => ({ ...prev, items: newItems }));
  };

  const handleUpdateItem = (updated: FaqItem) => {
    setContent((prev) => ({
      ...prev,
      items: (prev.items || []).map((item) => (item.id === updated.id ? updated : item)),
    }));
    setEditingItem(updated);
  };

  const handleResetDefaults = () => {
    if (confirm("Khôi phục toàn bộ danh sách 6 câu hỏi FAQ chuẩn của Ban tổ chức?")) {
      setContent(DEFAULT_FAQ_CONTENT);
      setEditingItem(null);
      toast.info("Đã khôi phục mặc định!", "Danh sách FAQ đã quay về bản mẫu chuẩn.");
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.badge && item.badge.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl pb-24">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100/80 border border-emerald-200 text-emerald-800 rounded-xl">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Quản Lý Câu Hỏi Thường Gặp (FAQ)</h2>
            <p className="text-xs text-slate-500">
              Thêm, sửa, xóa các câu hỏi giải đáp thắc mắc và tự động đồng bộ Google FAQ Schema Rich Snippets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Visible Toggle */}
          <button
            type="button"
            onClick={() => setContent((prev) => ({ ...prev, visible: prev.visible === false ? true : false }))}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              content.visible === false
                ? "bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200"
                : "bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100"
            }`}
            title={content.visible === false ? "Bật hiển thị khối FAQ trên trang chủ" : "Tắt hiển thị khối FAQ trên trang chủ"}
          >
            <span className={`w-2 h-2 rounded-full ${content.visible === false ? "bg-slate-400" : "bg-emerald-500"}`} />
            <span>{content.visible === false ? "Đang ẩn" : "Đang hiện"}</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Khôi phục câu hỏi mẫu mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mặc định</span>
          </button>

          <button
            type="button"
            onClick={handleAddNew}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm Câu Hỏi Mới</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
          </button>
        </div>
      </div>

      {/* Section Header Settings */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>1. Tiêu Đề Khối FAQ Trên Website</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Tag Nhỏ</label>
            <input
              type="text"
              value={content.badgeText || ""}
              onChange={(e) => setContent({ ...content, badgeText: e.target.value })}
              placeholder="GIẢI ĐÁP THẮC MẮC THƯỜNG GẶP"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Chính (Heading H2)</label>
            <input
              type="text"
              value={content.title || ""}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              placeholder="Câu Hỏi Thường Gặp (FAQ) Về Diễn Đàn"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô Tả Phụ (Subtitle)</label>
            <input
              type="text"
              value={content.subtitle || ""}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              placeholder="Tổng hợp thông tin quan trọng nhất giúp Quý doanh nghiệp, Đại biểu và Nhà tài trợ..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Item List & Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: FAQ List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Danh Sách Câu Hỏi ({items.length})
              </span>

              {/* Search input */}
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Lọc nhanh câu hỏi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200">
                  Không tìm thấy câu hỏi nào. Bấm &quot;+ Thêm Câu Hỏi Mới&quot; để tạo.
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = editingItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setEditingItem(item)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500"
                          : "bg-white hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            #{index + 1}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {item.badge}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">
                            [{item.category}]
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.question}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {item.answer}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0 pt-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                          title="Di chuyển lên"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(index, "down")}
                          disabled={index === items.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                          title="Di chuyển xuống"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="p-1 text-emerald-600 hover:text-emerald-800 rounded hover:bg-emerald-100 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-100 transition-colors"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form / Live Mockup (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {editingItem ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chỉnh Sửa Câu Hỏi</span>
                </span>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Danh Mục Câu Hỏi
                    </label>
                    <select
                      value={editingItem.category}
                      onChange={(e) =>
                        handleUpdateItem({
                          ...editingItem,
                          category: e.target.value as FaqItem["category"],
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none"
                    >
                      {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Badge Tag Nhỏ
                    </label>
                    <input
                      type="text"
                      value={editingItem.badge || ""}
                      onChange={(e) =>
                        handleUpdateItem({ ...editingItem, badge: e.target.value })
                      }
                      placeholder="VD: Quyền lợi Vé"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Câu Hỏi (Question)
                  </label>
                  <input
                    type="text"
                    value={editingItem.question}
                    onChange={(e) =>
                      handleUpdateItem({ ...editingItem, question: e.target.value })
                    }
                    placeholder="Nhập câu hỏi..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <RichTextarea
                    label="Câu Trả Lời Chi Tiết (Answer)"
                    subLabel="💡 Hỗ trợ in đậm <b>, gạch đầu dòng •, xuống dòng..."
                    rows={4}
                    value={editingItem.answer}
                    onChange={(val) =>
                      handleUpdateItem({ ...editingItem, answer: val })
                    }
                    placeholder="Nhập nội dung giải đáp chi tiết..."
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    ID: {editingItem.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      toast.success("Đã hoàn tất chỉnh sửa!", "Bấm 'Lưu Thay Đổi' phía trên để áp dụng.");
                    }}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Xong
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700">Chọn câu hỏi bên trái để chỉnh sửa</h4>
              <p className="text-[11px] text-slate-500">
                Hoặc bấm nút <b>&quot;+ Thêm Câu Hỏi Mới&quot;</b> để thêm câu hỏi giải đáp cho doanh nghiệp.
              </p>
            </div>
          )}

          {/* Live Preview Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xem Trước Hiển Thị (Live Preview)</span>
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                Accordion Mockup
              </span>
            </div>

            <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
              {items.slice(0, 3).map((item) => {
                const isOpen = previewOpenId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      isOpen
                        ? "bg-white border-emerald-400 shadow-sm"
                        : "bg-white/80 border-slate-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setPreviewOpenId(isOpen ? null : item.id)}
                      className="w-full p-2.5 text-left flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="text-[11px] font-bold text-slate-900 line-clamp-1">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-emerald-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-2.5 pb-2.5 pt-1 text-[11px] text-slate-600 border-t border-slate-100 leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
