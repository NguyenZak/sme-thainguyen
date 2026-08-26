"use client";

import { useState, useEffect } from "react";
import { BoothsContent, BoothItem, DEFAULT_BOOTHS } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { uploadImageToStorage } from "@/lib/cmsClient";
import { useAutoSave } from "@/hooks/useAutoSave";
import AutoSaveHeaderBadge from "@/components/admin/AutoSaveHeaderBadge";
import RichTextarea from "@/components/admin/RichTextarea";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Copy,
  Search,
  Filter,
  Sparkles,
  Layers,
  MapPin,
  Tag,
  DollarSign,
  Info,
  Maximize2,
  Check,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";

interface BoothsEditorProps {
  initialBooths: BoothsContent;
  onSaveSuccess?: (updatedBooths: BoothsContent) => void;
}

export default function BoothsEditor({ initialBooths, onSaveSuccess }: BoothsEditorProps) {
  const [booths, setBooths] = useState<BoothsContent>({
    badge: initialBooths.badge || DEFAULT_BOOTHS.badge,
    title: initialBooths.title || DEFAULT_BOOTHS.title,
    subtitle: initialBooths.subtitle || DEFAULT_BOOTHS.subtitle,
    mapImageUrl: initialBooths.mapImageUrl || DEFAULT_BOOTHS.mapImageUrl,
    totalBooths: initialBooths.totalBooths ?? DEFAULT_BOOTHS.totalBooths ?? 100,
    availableBooths: initialBooths.availableBooths ?? DEFAULT_BOOTHS.availableBooths ?? 35,
    boothPackageBadge: initialBooths.boothPackageBadge || DEFAULT_BOOTHS.boothPackageBadge || "Gian hàng tiêu chuẩn",
    boothPackageTitle: initialBooths.boothPackageTitle || DEFAULT_BOOTHS.boothPackageTitle || "Gian hàng Triển lãm 2m x 1,5m",
    boothPackageNote: initialBooths.boothPackageNote ?? DEFAULT_BOOTHS.boothPackageNote ?? "Mỗi gian hàng BTC sẽ sắp sẵn 2 bàn + 2 ghế + 1 Standee",
    priceVND: initialBooths.priceVND ?? DEFAULT_BOOTHS.priceVND ?? 8500000,
    priceFormatted: initialBooths.priceFormatted || DEFAULT_BOOTHS.priceFormatted || "8.500.000",
    priceUnit: initialBooths.priceUnit || DEFAULT_BOOTHS.priceUnit || "VNĐ / Gian",
    inclusions: initialBooths.inclusions && initialBooths.inclusions.length > 0 ? initialBooths.inclusions : (DEFAULT_BOOTHS.inclusions || []),
    ctaText: initialBooths.ctaText || DEFAULT_BOOTHS.ctaText || "Đăng ký gian hàng ngay",
    modalTitle: initialBooths.modalTitle || DEFAULT_BOOTHS.modalTitle || "Sơ đồ Chi tiết Mặt bằng Triển lãm",
    modalSubtitle: initialBooths.modalSubtitle || DEFAULT_BOOTHS.modalSubtitle || "Kéo giữ chuột để di chuyển (trái/phải/lên/xuống). Lăn chuột hoặc bấm +/- để zoom.",
    modalBottomNote: initialBooths.modalBottomNote || DEFAULT_BOOTHS.modalBottomNote || "Mặt bằng 100 gian hàng tiêu chuẩn & VIP tại Trung tâm Tổ chức Sự kiện May Plaza",
    items: initialBooths.items && initialBooths.items.length > 0 ? initialBooths.items : (DEFAULT_BOOTHS.items || []),
  });

  useEffect(() => {
    if (initialBooths) {
      setBooths({
        badge: initialBooths.badge || DEFAULT_BOOTHS.badge,
        title: initialBooths.title || DEFAULT_BOOTHS.title,
        subtitle: initialBooths.subtitle || DEFAULT_BOOTHS.subtitle,
        mapImageUrl: initialBooths.mapImageUrl || DEFAULT_BOOTHS.mapImageUrl,
        totalBooths: initialBooths.totalBooths ?? DEFAULT_BOOTHS.totalBooths ?? 100,
        availableBooths: initialBooths.availableBooths ?? DEFAULT_BOOTHS.availableBooths ?? 35,
        boothPackageBadge: initialBooths.boothPackageBadge || DEFAULT_BOOTHS.boothPackageBadge || "Gian hàng tiêu chuẩn",
        boothPackageTitle: initialBooths.boothPackageTitle || DEFAULT_BOOTHS.boothPackageTitle || "Gian hàng Triển lãm 2m x 1,5m",
        boothPackageNote: initialBooths.boothPackageNote ?? DEFAULT_BOOTHS.boothPackageNote ?? "Mỗi gian hàng BTC sẽ sắp sẵn 2 bàn + 2 ghế + 1 Standee",
        priceVND: initialBooths.priceVND ?? DEFAULT_BOOTHS.priceVND ?? 8500000,
        priceFormatted: initialBooths.priceFormatted || DEFAULT_BOOTHS.priceFormatted || "8.500.000",
        priceUnit: initialBooths.priceUnit || DEFAULT_BOOTHS.priceUnit || "VNĐ / Gian",
        inclusions: initialBooths.inclusions && initialBooths.inclusions.length > 0 ? initialBooths.inclusions : (DEFAULT_BOOTHS.inclusions || []),
        ctaText: initialBooths.ctaText || DEFAULT_BOOTHS.ctaText || "Đăng ký gian hàng ngay",
        modalTitle: initialBooths.modalTitle || DEFAULT_BOOTHS.modalTitle || "Sơ đồ Chi tiết Mặt bằng Triển lãm",
        modalSubtitle: initialBooths.modalSubtitle || DEFAULT_BOOTHS.modalSubtitle || "Kéo giữ chuột để di chuyển (trái/phải/lên/xuống). Lăn chuột hoặc bấm +/- để zoom.",
        modalBottomNote: initialBooths.modalBottomNote || DEFAULT_BOOTHS.modalBottomNote || "Mặt bằng 100 gian hàng tiêu chuẩn & VIP tại Trung tâm Tổ chức Sự kiện May Plaza",
        items: initialBooths.items && initialBooths.items.length > 0 ? initialBooths.items : (DEFAULT_BOOTHS.items || []),
      });
    }
  }, [initialBooths]);

  const { saveStatus, lastSavedTime, errorMessage, saveNow } = useAutoSave(
    "booths",
    booths,
    { onSaveSuccess }
  );

  const [uploadingMap, setUploadingMap] = useState(false);

  // Search & Filter state for booth inventory
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "reserved" | "sold">("all");

  // Inclusions handlers (Thêm / Sửa / Xóa quyền lợi)
  const handleAddInclusion = () => {
    const current = booths.inclusions || [];
    setBooths({
      ...booths,
      inclusions: [...current, "Quyền lợi tiêu chuẩn bổ sung mới"],
    });
  };

  const handleEditInclusion = (index: number, value: string) => {
    const current = [...(booths.inclusions || [])];
    current[index] = value;
    setBooths({ ...booths, inclusions: current });
  };

  const handleRemoveInclusion = (index: number) => {
    const current = [...(booths.inclusions || [])];
    current.splice(index, 1);
    setBooths({ ...booths, inclusions: current });
  };

  const handleResetInclusions = () => {
    setBooths({
      ...booths,
      inclusions: DEFAULT_BOOTHS.inclusions || [],
    });
  };

  // Booth Items handlers (Thêm / Sửa / Xóa / Nhân bản gian hàng)
  const handleItemChange = (index: number, field: keyof BoothItem, value: any) => {
    const updated = [...booths.items];
    updated[index] = { ...updated[index], [field]: value };
    setBooths({ ...booths, items: updated });
  };

  const addBooth = () => {
    const nextNum = booths.items.length + 1;
    const formattedNum = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    const nextCode = `A-${formattedNum}`;
    const newB: BoothItem = {
      id: `b-${Date.now()}`,
      boothCode: nextCode,
      areaName: "Khu Vực A - Công Nghệ & Chuyển Đổi Số",
      size: "2m x 1.5m",
      priceVND: booths.priceVND || 8500000,
      status: "available",
      description: "Gian hàng tiêu chuẩn",
    };
    setBooths({ ...booths, items: [...booths.items, newB] });
  };

  const duplicateBooth = (index: number) => {
    const source = booths.items[index];
    const nextNum = booths.items.length + 1;
    const formattedNum = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    const cloned: BoothItem = {
      ...source,
      id: `b-${Date.now()}`,
      boothCode: `${source.boothCode.slice(0, 2)}${formattedNum}`,
      status: "available",
      reservedBy: undefined,
    };
    setBooths({ ...booths, items: [...booths.items, cloned] });
  };

  const removeBooth = (index: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa gian hàng này?")) {
      const updated = booths.items.filter((_, i) => i !== index);
      setBooths({ ...booths, items: updated });
    }
  };

  const handleMapUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMap(true);
    const { url, error } = await uploadImageToStorage(file);
    setUploadingMap(false);

    if (error || !url) {
      alert("Tải sơ đồ thất bại: " + (error || "Lỗi không xác định"));
    } else {
      setBooths({ ...booths, mapImageUrl: url });
    }
  };

  // Filtered booth items for table/list view
  const filteredItems = booths.items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => {
      const matchSearch =
        searchQuery === "" ||
        item.boothCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.areaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.reservedBy && item.reservedBy.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });

  const countAvailable = booths.items.filter((b) => b.status === "available").length;
  const countReserved = booths.items.filter((b) => b.status === "reserved").length;
  const countSold = booths.items.filter((b) => b.status === "sold").length;

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Sticky Header / Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 bg-white/80 backdrop-blur sticky top-0 z-20 py-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>10 · Sơ Đồ &amp; Gian Hàng Triển Lãm (Booths)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý toàn bộ thông tin tiêu đề, báo giá gói, quyền lợi bao gồm, hình ảnh sơ đồ mặt bằng và danh sách từng gian hàng.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <AutoSaveHeaderBadge
            status={saveStatus}
            lastSavedTime={lastSavedTime}
            errorMessage={errorMessage}
            onManualSave={() => saveNow()}
          />
        </div>
      </div>

      {/* Overview Stats Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Tổng Gian Hàng</div>
            <div className="text-lg font-extrabold text-slate-900">{booths.items.length} gian</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-green-700">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Còn Trống</div>
            <div className="text-lg font-extrabold text-green-600">{countAvailable} gian</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Đã Đặt Cọc</div>
            <div className="text-lg font-extrabold text-amber-600">{countReserved} gian</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Đã Bán / Kín</div>
            <div className="text-lg font-extrabold text-rose-600">{countSold} gian</div>
          </div>
        </div>
      </div>

      {/* 1. Cấu hình Tiêu đề Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. TIÊU ĐỀ & MÔ TẢ PHẦN GIAN HÀNG
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Thẻ Đầu Mục</label>
            <input
              type="text"
              value={booths.badge}
              onChange={(e) => setBooths({ ...booths, badge: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Chính</label>
            <input
              type="text"
              value={booths.title}
              onChange={(e) => setBooths({ ...booths, title: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <RichTextarea
              label="Phụ Đề Mô Tả Ngắn"
              value={booths.subtitle}
              onChange={(val) => setBooths({ ...booths, subtitle: val })}
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* 2. Cấu hình Gói Gian Hàng & Báo Giá */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <DollarSign className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. CẤU HÌNH GÓI GIAN HÀNG & BÁO GIÁ
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Gói Gian Hàng</label>
            <input
              type="text"
              value={booths.boothPackageBadge || ""}
              onChange={(e) => setBooths({ ...booths, boothPackageBadge: e.target.value })}
              placeholder="Gian hàng tiêu chuẩn"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Gói Gian Hàng</label>
            <input
              type="text"
              value={booths.boothPackageTitle || ""}
              onChange={(e) => setBooths({ ...booths, boothPackageTitle: e.target.value })}
              placeholder="Gian hàng Triển lãm 2m x 1,5m"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-bold"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi Chú Nổi Bật / Trang Bị Sẵn
            </label>
            <input
              type="text"
              value={booths.boothPackageNote || ""}
              onChange={(e) => setBooths({ ...booths, boothPackageNote: e.target.value })}
              placeholder="Mỗi gian hàng BTC sẽ sắp sẵn 2 bàn + 2 ghế + 1 Standee"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Giá Thuê Hiển Thị (Formatted)</label>
            <input
              type="text"
              value={booths.priceFormatted || ""}
              onChange={(e) => setBooths({ ...booths, priceFormatted: e.target.value })}
              placeholder="8.500.000"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-emerald-600 font-extrabold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Đơn Vị Tính Giá</label>
            <input
              type="text"
              value={booths.priceUnit || ""}
              onChange={(e) => setBooths({ ...booths, priceUnit: e.target.value })}
              placeholder="VNĐ / Gian"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chữ Trên Nút Đăng Ký (CTA)</label>
            <input
              type="text"
              value={booths.ctaText || ""}
              onChange={(e) => setBooths({ ...booths, ctaText: e.target.value })}
              placeholder="Đăng ký gian hàng ngay"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Quản lý Quyền lợi bao gồm (Inclusions - Thêm / Sửa / Xóa) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. QUYỀN LỢI & TRANG BỊ BAO GỒM ({(booths.inclusions || []).length} MỤC)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetInclusions}
              className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 font-semibold bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
              title="Khôi phục danh sách mặc định"
            >
              <RotateCcw className="w-3 h-3" /> Khôi Phục Mặc Định
            </button>
            <button
              type="button"
              onClick={handleAddInclusion}
              className="inline-flex items-center gap-1 text-[11px] text-white font-bold bg-[#0D3B2E] hover:bg-[#07241C] px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm Quyền Lợi
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Các hạng mục quyền lợi hiển thị trong danh sách tích xanh của gian hàng tiêu chuẩn. Bạn có thể tự do thêm, sửa nội dung hoặc xóa từng dòng.
        </p>

        <div className="space-y-2.5">
          {(booths.inclusions || []).map((inc, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <input
                type="text"
                value={inc}
                onChange={(e) => handleEditInclusion(idx, e.target.value)}
                placeholder="Nhập nội dung quyền lợi gian hàng..."
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveInclusion(idx)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors shrink-0"
                title="Xóa quyền lợi này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {(booths.inclusions || []).length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
              Chưa có quyền lợi nào. Bấm <strong>&quot;Thêm Quyền Lợi&quot;</strong> để tạo mục đầu tiên.
            </div>
          )}
        </div>
      </div>

      {/* 4. Cấu hình Sơ đồ mặt bằng & Lightbox Modal */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Maximize2 className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            4. HÌNH ẢNH SƠ ĐỒ MẶT BẰNG & LIGHTBOX MODAL
          </h3>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-4">
          {booths.mapImageUrl && (
            <div className="relative w-full md:w-56 h-36 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-950 flex items-center justify-center">
              <img
                src={booths.mapImageUrl}
                alt="Booth Map Preview"
                className="w-full h-full object-contain"
              />
              <span className="absolute bottom-1 right-1 bg-black/70 text-[10px] text-amber-300 px-2 py-0.5 rounded font-mono">
                Sơ đồ hiện tại
              </span>
            </div>
          )}

          <div className="flex-1 space-y-3 w-full">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL Ảnh Sơ Đồ</label>
              <input
                type="text"
                value={booths.mapImageUrl}
                onChange={(e) => setBooths({ ...booths, mapImageUrl: e.target.value })}
                placeholder="/images/so-do.jpg hoặc URL ảnh online"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs">
                {uploadingMap ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-emerald-400" />}
                <span>{uploadingMap ? "Đang tải ảnh sơ đồ lên server..." : "Tải ảnh sơ đồ mới từ máy tính"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleMapUpload} disabled={uploadingMap} />
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Trong Modal Phóng To</label>
            <input
              type="text"
              value={booths.modalTitle || ""}
              onChange={(e) => setBooths({ ...booths, modalTitle: e.target.value })}
              placeholder="Sơ đồ Chi tiết Mặt bằng Triển lãm"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hướng Dẫn Điều Khiển / Zoom</label>
            <input
              type="text"
              value={booths.modalSubtitle || ""}
              onChange={(e) => setBooths({ ...booths, modalSubtitle: e.target.value })}
              placeholder="Kéo giữ chuột để di chuyển (trái/phải/lên/xuống)..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi Chú Chân Modal</label>
            <input
              type="text"
              value={booths.modalBottomNote || ""}
              onChange={(e) => setBooths({ ...booths, modalBottomNote: e.target.value })}
              placeholder="Mặt bằng 100 gian hàng tiêu chuẩn & VIP tại May Plaza"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Quản lý Danh sách Chi tiết Từng Gian Hàng */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>5. DANH SÁCH CHI TIẾT TỪNG GIAN HÀNG ({booths.items.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm, sửa mã gian (A-01, A-02...), kích thước, giá thuê, trạng thái (Còn trống / Đã cọc / Đã bán) và tên đơn vị đăng ký.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={addBooth}
              className="inline-flex items-center justify-center gap-1 text-xs text-white font-bold bg-[#0D3B2E] hover:bg-[#07241C] px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 text-emerald-400" /> Thêm Gian Hàng Mới
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã gian (A-01...), khu vực hoặc tên đơn vị..."
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "all" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Tất cả ({booths.items.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("available")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "available" ? "bg-green-600 text-white font-bold" : "text-green-700 hover:bg-green-50"
              }`}
            >
              Còn trống ({countAvailable})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("reserved")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "reserved" ? "bg-amber-600 text-white font-bold" : "text-amber-700 hover:bg-amber-50"
              }`}
            >
              Đã cọc ({countReserved})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("sold")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "sold" ? "bg-rose-600 text-white font-bold" : "text-rose-700 hover:bg-rose-50"
              }`}
            >
              Đã bán ({countSold})
            </button>
          </div>
        </div>

        {/* Booth Items Cards List */}
        <div className="space-y-3.5 max-h-[800px] overflow-y-auto pr-1">
          {filteredItems.map(({ item: b, originalIndex: idx }) => (
            <div
              key={b.id || idx}
              className={`border rounded-2xl p-4 space-y-3 transition-all ${
                b.status === "available"
                  ? "bg-white border-green-200/80 shadow-xs"
                  : b.status === "reserved"
                  ? "bg-amber-50/30 border-amber-200"
                  : "bg-slate-50 border-slate-200 opacity-90"
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    {b.boothCode || `Gian #${idx + 1}`}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      b.status === "available"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : b.status === "reserved"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-rose-100 text-rose-800 border-rose-200"
                    }`}
                  >
                    {b.status === "available" ? "🟢 Còn trống" : b.status === "reserved" ? "🟡 Đã đặt cọc" : "🔴 Đã bán"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => duplicateBooth(idx)}
                    title="Nhân bản tạo gian hàng tiếp theo"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg font-semibold transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Nhân bản</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeBooth(idx)}
                    title="Xóa gian hàng này"
                    className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-2 py-1 rounded-lg font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Xóa</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mã Gian Hàng</label>
                  <input
                    type="text"
                    value={b.boothCode}
                    onChange={(e) => handleItemChange(idx, "boothCode", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none font-mono font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Khu Vực Triển Lãm</label>
                  <input
                    type="text"
                    value={b.areaName}
                    onChange={(e) => handleItemChange(idx, "areaName", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Trạng Thái Gian</label>
                  <select
                    value={b.status}
                    onChange={(e) => handleItemChange(idx, "status", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none font-semibold cursor-pointer"
                  >
                    <option value="available">🟢 Còn trống (Available)</option>
                    <option value="reserved">🟡 Đã đặt cọc (Reserved)</option>
                    <option value="sold">🔴 Đã bán (Sold)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kích Thước</label>
                  <input
                    type="text"
                    value={b.size}
                    onChange={(e) => handleItemChange(idx, "size", e.target.value)}
                    placeholder="2m x 1.5m"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Giá Thuê (VNĐ)</label>
                  <input
                    type="number"
                    value={b.priceVND}
                    onChange={(e) => handleItemChange(idx, "priceVND", Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-emerald-700 focus:outline-none font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tên Đơn Vị Đăng Ký (Nếu đã cọc / đã bán)
                  </label>
                  <input
                    type="text"
                    value={b.reservedBy || ""}
                    onChange={(e) => handleItemChange(idx, "reservedBy", e.target.value)}
                    placeholder="VD: Công ty Cổ phần May Plaza"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-4">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Ghi Chú / Vị Trí Gian Hàng
                  </label>
                  <input
                    type="text"
                    value={b.description || ""}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    placeholder="VD: Gian hàng góc 2 mặt tiền ngay lối vào chính sảnh hội nghị"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
              Không tìm thấy gian hàng nào khớp với tìm kiếm / bộ lọc.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
