"use client";

import { useState, useEffect } from "react";
import {
  SponsorsContent,
  SponsorItem,
  SponsorPackageTier,
  SponsorPriorityCategory,
  SponsorMilestone,
  DEFAULT_SPONSORS,
} from "@/constants/defaultContent";
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
  Award,
  Star,
  Building2,
  FileText,
  Clock,
  Layers,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";

interface SponsorsEditorProps {
  initialSponsors: SponsorsContent;
  onSaveSuccess?: (updatedSponsors: SponsorsContent) => void;
}

export default function SponsorsEditor({ initialSponsors, onSaveSuccess }: SponsorsEditorProps) {
  const [sponsors, setSponsors] = useState<SponsorsContent>({
    ...DEFAULT_SPONSORS,
    ...(initialSponsors || {}),
    packages: Array.isArray(initialSponsors?.packages)
      ? initialSponsors.packages
      : DEFAULT_SPONSORS.packages || [],
    priorityCategories: Array.isArray(initialSponsors?.priorityCategories)
      ? initialSponsors.priorityCategories
      : DEFAULT_SPONSORS.priorityCategories || [],
    milestones: Array.isArray(initialSponsors?.milestones)
      ? initialSponsors.milestones
      : DEFAULT_SPONSORS.milestones || [],
    items: Array.isArray(initialSponsors?.items)
      ? initialSponsors.items
      : DEFAULT_SPONSORS.items || [],
  });

  useEffect(() => {
    if (initialSponsors) {
      setSponsors({
        ...DEFAULT_SPONSORS,
        ...initialSponsors,
        packages: Array.isArray(initialSponsors.packages)
          ? initialSponsors.packages
          : DEFAULT_SPONSORS.packages || [],
        priorityCategories: Array.isArray(initialSponsors.priorityCategories)
          ? initialSponsors.priorityCategories
          : DEFAULT_SPONSORS.priorityCategories || [],
        milestones: Array.isArray(initialSponsors.milestones)
          ? initialSponsors.milestones
          : DEFAULT_SPONSORS.milestones || [],
        items: Array.isArray(initialSponsors.items)
          ? initialSponsors.items
          : DEFAULT_SPONSORS.items || [],
      });
    }
  }, [initialSponsors]);

  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Packages & Tiers Handlers
  const handlePackageChange = (
    index: number,
    field: keyof SponsorPackageTier,
    value: any
  ) => {
    const updated = [...(sponsors.packages || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSponsors({ ...sponsors, packages: updated });
  };

  const addPackage = () => {
    const newPkg: SponsorPackageTier = {
      id: `pkg-${Date.now()}`,
      name: "Gói Tài Trợ Mới",
      price: "Từ 50.000.000 VNĐ",
      badgeColor: "bg-emerald-900 text-white font-bold",
      borderAccent: "border-emerald-500 shadow-emerald-50",
      popular: false,
      perks: [
        "Logo hiển thị trên backdrop và ấn phẩm chính",
        "01 Gian trưng bày tiêu chuẩn",
        "04 Thẻ Thư mời Đại biểu tham dự trọn gói",
        "Tham gia phiên kết nối B2B Matching",
      ],
    };
    setSponsors({
      ...sponsors,
      packages: [...(sponsors.packages || []), newPkg],
    });
  };

  const removePackage = (index: number) => {
    if ((sponsors.packages || []).length <= 1) {
      alert("Cần giữ lại ít nhất 1 gói tài trợ!");
      return;
    }
    const updated = (sponsors.packages || []).filter((_, i) => i !== index);
    setSponsors({ ...sponsors, packages: updated });
  };

  const movePackage = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const pkgs = sponsors.packages || [];
    if (targetIndex < 0 || targetIndex >= pkgs.length) return;
    const updated = [...pkgs];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSponsors({ ...sponsors, packages: updated });
  };

  // Perks per package handlers
  const handlePerkChange = (
    pkgIndex: number,
    perkIndex: number,
    value: string
  ) => {
    const updated = [...(sponsors.packages || [])];
    const updatedPerks = [...updated[pkgIndex].perks];
    updatedPerks[perkIndex] = value;
    updated[pkgIndex] = { ...updated[pkgIndex], perks: updatedPerks };
    setSponsors({ ...sponsors, packages: updated });
  };

  const addPerk = (pkgIndex: number) => {
    const updated = [...(sponsors.packages || [])];
    updated[pkgIndex] = {
      ...updated[pkgIndex],
      perks: [...updated[pkgIndex].perks, "Quyền lợi tài trợ bổ sung mới"],
    };
    setSponsors({ ...sponsors, packages: updated });
  };

  const removePerk = (pkgIndex: number, perkIndex: number) => {
    const updated = [...(sponsors.packages || [])];
    updated[pkgIndex] = {
      ...updated[pkgIndex],
      perks: updated[pkgIndex].perks.filter((_, i) => i !== perkIndex),
    };
    setSponsors({ ...sponsors, packages: updated });
  };

  // 2. Priority Categories Handlers
  const handleCategoryChange = (
    index: number,
    field: keyof SponsorPriorityCategory,
    value: string
  ) => {
    const updated = [...(sponsors.priorityCategories || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSponsors({ ...sponsors, priorityCategories: updated });
  };

  const addCategory = () => {
    const newCat: SponsorPriorityCategory = {
      id: `cat-${Date.now()}`,
      name: "Hạng mục tài trợ chuyên biệt mới",
      fee: "Từ 20 Triệu",
    };
    setSponsors({
      ...sponsors,
      priorityCategories: [...(sponsors.priorityCategories || []), newCat],
    });
  };

  const removeCategory = (index: number) => {
    const updated = (sponsors.priorityCategories || []).filter((_, i) => i !== index);
    setSponsors({ ...sponsors, priorityCategories: updated });
  };

  // 3. Milestones Handlers
  const handleMilestoneChange = (
    index: number,
    field: keyof SponsorMilestone,
    value: string
  ) => {
    const updated = [...(sponsors.milestones || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSponsors({ ...sponsors, milestones: updated });
  };

  const addMilestone = () => {
    const newMs: SponsorMilestone = {
      id: `ms-${Date.now()}`,
      time: "Trước 15/09/2026",
      desc: "Nội dung tiến độ và yêu cầu hoàn tất hồ sơ tài trợ...",
    };
    setSponsors({
      ...sponsors,
      milestones: [...(sponsors.milestones || []), newMs],
    });
  };

  const removeMilestone = (index: number) => {
    const updated = (sponsors.milestones || []).filter((_, i) => i !== index);
    setSponsors({ ...sponsors, milestones: updated });
  };

  // 4. Sponsor Logos Handlers
  const handleItemChange = (index: number, field: keyof SponsorItem, value: any) => {
    const updated = [...sponsors.items];
    updated[index] = { ...updated[index], [field]: value };
    setSponsors({ ...sponsors, items: updated });
  };

  const addSponsor = () => {
    const newSp: SponsorItem = {
      id: `sp-${Date.now()}`,
      name: "Tên Doanh Nghiệp Tài Trợ Mới",
      tier: "gold",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=150&fit=crop",
    };
    setSponsors({ ...sponsors, items: [...sponsors.items, newSp] });
  };

  const removeSponsor = async (index: number) => {
    if (!window.confirm("Xóa nhà tài trợ này khỏi danh sách?")) return;
    const updated = sponsors.items.filter((_, i) => i !== index);
    const updatedSponsors = { ...sponsors, items: updated };
    setSponsors(updatedSponsors);
    // Auto-save ngay lập tức
    const res = await updateSectionAction("sponsors", updatedSponsors);
    if (res.success) {
      setMsg({ type: "success", text: "Đã xóa nhà tài trợ và lưu thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Xóa thất bại, thử lại." });
      // Rollback nếu lỗi
      setSponsors(sponsors);
    }
  };

  const handleLogoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(index);
    const { url, error } = await uploadImageToStorage(file);
    setUploadingIdx(null);

    if (error || !url) {
      alert("Tải logo thất bại: " + (error || "Lỗi không xác định"));
    } else {
      handleItemChange(index, "logoUrl", url);
    }
  };

  // Reset defaults
  const handleResetDefaults = () => {
    if (window.confirm("Đặt lại toàn bộ nội dung Gói Quyền Lợi Tài Trợ & Logo về mặc định?")) {
      setSponsors(DEFAULT_SPONSORS);
    }
  };

  // Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("sponsors", sponsors);
    setSaving(false);

    if (res.success) {
      onSaveSuccess?.(sponsors);
      setMsg({ type: "success", text: "Đã cập nhật toàn bộ Gói Quyền Lợi Tài Trợ & Danh Sách Logo thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Lỗi lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-16">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Quản Trị Các Gói Quyền Lợi Đồng Hành Tài Trợ (Sponsors)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Toàn quyền thêm, sửa, xóa các gói tài trợ (Chiến lược, Kim Cương, Vàng, Bạc, Đồng, Đồng hành), bảng quyền lợi chi tiết, hạng mục ưu tiên, mốc tiến độ và danh sách logo nhà tài trợ.
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

      {/* 1. Header & PDF */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          1. Tiêu Đề & Hồ Sơ Mời Tài Trợ (PDF)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Badge (Thẻ Huy Hiệu)</label>
            <input
              type="text"
              value={sponsors.badge || ""}
              onChange={(e) => setSponsors({ ...sponsors, badge: e.target.value })}
              placeholder="VD: THƯ MỜI TÀI TRỢ & CÁC GÓI QUYỀN LỢI"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Chính Phần Tài Trợ</label>
            <input
              type="text"
              value={sponsors.title || ""}
              onChange={(e) => setSponsors({ ...sponsors, title: e.target.value })}
              placeholder="VD: Các Gói Quyền Lợi Đồng Hành Tài Trợ"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phụ Đề Mô Tả Ngắn</label>
            <input
              type="text"
              value={sponsors.subtitle || ""}
              onChange={(e) => setSponsors({ ...sponsors, subtitle: e.target.value })}
              placeholder="VD: Lựa chọn gói tài trợ phù hợp với chiến lược quảng bá thương hiệu..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Đường Dẫn File Hồ Sơ Mời Tài Trợ (PDF)</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={sponsors.prospectusPdfUrl || ""}
                onChange={(e) => setSponsors({ ...sponsors, prospectusPdfUrl: e.target.value })}
                placeholder="https://... hoặc đường dẫn file PDF"
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none"
              />
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shrink-0 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.zip,.rar"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSaving(true);
                    const { url, error } = await uploadImageToStorage(file);
                    setSaving(false);
                    if (error || !url) {
                      alert("Tải file PDF thất bại: " + (error || "Lỗi"));
                    } else {
                      setSponsors({ ...sponsors, prospectusPdfUrl: url });
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sponsorship Packages & Tiers */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              2. Các Gói Quyền Lợi Đồng Hành Tài Trợ ({sponsors.packages?.length || 0} Gói)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm, sửa giá tiền, chỉnh sửa từng dòng quyền lợi và xóa các gói tài trợ.
            </p>
          </div>
          <button
            type="button"
            onClick={addPackage}
            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Gói Tài Trợ
          </button>
        </div>

        <div className="space-y-6">
          {(sponsors.packages || []).map((pkg, pIdx) => (
            <div
              key={pkg.id || pIdx}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 relative group"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-900 uppercase">
                    GÓI TÀI TRỢ #{pIdx + 1}:
                  </span>
                  <span className="text-xs font-bold text-slate-800">{pkg.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      checked={!!pkg.popular}
                      onChange={(e) => handlePackageChange(pIdx, "popular", e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>Vị trí VIP</span>
                  </label>

                  <button
                    type="button"
                    disabled={pIdx === 0}
                    onClick={() => movePackage(pIdx, "up")}
                    className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                    title="Di chuyển lên"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={pIdx === (sponsors.packages?.length || 0) - 1}
                    onClick={() => movePackage(pIdx, "down")}
                    className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                    title="Di chuyển xuống"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  {(sponsors.packages?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => removePackage(pIdx)}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded transition-colors"
                      title="Xóa gói tài trợ này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tên Gói Tài Trợ
                  </label>
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => handlePackageChange(pIdx, "name", e.target.value)}
                    placeholder="VD: Nhà tài trợ Kim Cương"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <RichTextarea
                    label="Mức Kinh Phí / Giá Tài Trợ (Kèm giới hạn số lượng)"
                    subLabel="💡 Bấm Enter để xuống dòng chủ động"
                    value={pkg.price}
                    onChange={(val) => handlePackageChange(pIdx, "price", val)}
                    placeholder="VD: Từ 100.000.000 VNĐ&#10;(Tối đa 01)"
                    rows={2}
                  />
                </div>
              </div>

              {/* Danh sách quyền lợi chi tiết */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    Danh Sách Quyền Lợi Chi Tiết ({pkg.perks.length} Mục)
                  </label>
                  <button
                    type="button"
                    onClick={() => addPerk(pIdx)}
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-bold"
                  >
                    <Plus className="w-3 h-3" /> Thêm Dòng Quyền Lợi
                  </button>
                </div>

                <div className="space-y-2">
                  {pkg.perks.map((perk, perkIdx) => (
                    <div key={perkIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <input
                        type="text"
                        value={perk}
                        onChange={(e) => handlePerkChange(pIdx, perkIdx, e.target.value)}
                        placeholder="Nội dung quyền lợi..."
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removePerk(pIdx, perkIdx)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Xóa quyền lợi này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Priority Specific Categories */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              3. Các Hạng Mục Tài Trợ Ưu Tiên Chuyên Biệt
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm, sửa, xóa các hạng mục tài trợ sự kiện cụ thể (Gala, Trà, Nền tảng B2B, v.v.).
            </p>
          </div>
          <button
            type="button"
            onClick={addCategory}
            className="inline-flex items-center gap-1 text-[11px] text-amber-800 hover:text-amber-950 font-bold bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Hạng Mục
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(sponsors.priorityCategories || []).map((cat, cIdx) => (
            <div key={cat.id || cIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600">Hạng mục #{cIdx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeCategory(cIdx)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Xóa hạng mục này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Tên Hạng Mục</label>
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => handleCategoryChange(cIdx, "name", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Mức Kinh Phí Quy Đổi</label>
                <input
                  type="text"
                  value={cat.fee}
                  onChange={(e) => handleCategoryChange(cIdx, "fee", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-emerald-800 font-extrabold focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Milestones Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              4. Mốc Thời Gian Quyền Lợi Nhà Tài Trợ
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm, sửa, xóa các mốc tiến độ bàn giao hồ sơ & kinh phí.
            </p>
          </div>
          <button
            type="button"
            onClick={addMilestone}
            className="inline-flex items-center gap-1 text-[11px] text-slate-900 hover:text-black font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Mốc Thời Gian
          </button>
        </div>

        <div className="space-y-3">
          {(sponsors.milestones || []).map((ms, mIdx) => (
            <div key={ms.id || mIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="w-40 shrink-0">
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Mốc Thời Gian</label>
                <input
                  type="text"
                  value={ms.time}
                  onChange={(e) => handleMilestoneChange(mIdx, "time", e.target.value)}
                  placeholder="VD: Trước 31/08/2026"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Nội Dung Yêu Cầu</label>
                <input
                  type="text"
                  value={ms.desc}
                  onChange={(e) => handleMilestoneChange(mIdx, "desc", e.target.value)}
                  placeholder="Nội dung tiến độ..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => removeMilestone(mIdx)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0 mt-3"
                title="Xóa mốc này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Confirmed Sponsors Logos */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              5. Danh Sách Logo Nhà Tài Trợ Đã Xác Nhận ({sponsors.items.length} Logo)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm logo, phân cấp (Kim cương, Vàng, Bạc, Đồng, Đồng hành) và link website doanh nghiệp.
            </p>
          </div>
          <button
            type="button"
            onClick={addSponsor}
            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Nhà Tài Trợ
          </button>
        </div>

        <div className="space-y-4">
          {sponsors.items.map((sp, idx) => (
            <div key={sp.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900">NHÀ TÀI TRỢ #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSponsor(idx)}
                  className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-28 h-20 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-2 shrink-0 relative overflow-hidden shadow-sm">
                  {sp.logoUrl ? (
                    <Image src={sp.logoUrl} alt={sp.name} width={100} height={60} className="object-contain max-h-16" />
                  ) : (
                    <span className="text-[10px] text-slate-400">Chưa có logo</span>
                  )}
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tên Doanh Nghiệp</label>
                    <input
                      type="text"
                      value={sp.name}
                      onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hạng Tài Trợ (Tier)</label>
                    <select
                      value={sp.tier}
                      onChange={(e) => handleItemChange(idx, "tier", e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                    >
                      <option value="co-organizer">🤝 Đơn vị Trực tiếp Chỉ đạo & Tổ chức</option>
                      <option value="diamond">💎 Kim Cương (Diamond)</option>
                      <option value="gold">🥇 Vàng (Gold)</option>
                      <option value="silver">🥈 Bạc (Silver)</option>
                      <option value="bronze">🥉 Đồng (Bronze)</option>
                      <option value="companion">⭐ Đơn vị Đồng hành / Truyền thông</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">URL Website Doanh Nghiệp</label>
                    <input
                      type="text"
                      value={sp.websiteUrl || ""}
                      onChange={(e) => handleItemChange(idx, "websiteUrl", e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tải Logo Lên</label>
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-medium cursor-pointer transition-colors border border-slate-300 w-full justify-center shadow-sm">
                      {uploadingIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{uploadingIdx === idx ? "Đang upload..." : "Chọn file logo"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(idx, e)} disabled={uploadingIdx === idx} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Banner Kêu Gọi Đồng Hành (Bottom CTA Banner) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          5. Cấu Hình Banner Kêu Gọi Đồng Hành (Bottom CTA Banner)
        </h3>
        <p className="text-xs text-slate-500">
          Chỉnh sửa nội dung banner xanh ở cuối phần Tài Trợ (*"Đưa thương hiệu của bạn tiếp cận 500+ Doanh nghiệp..."*).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Huy Hiệu Banner (CTA Badge)
            </label>
            <input
              type="text"
              value={sponsors.ctaBadge || ""}
              onChange={(e) => setSponsors({ ...sponsors, ctaBadge: e.target.value })}
              placeholder="VD: CƠ HỘI KHẲNG ĐỊNH THƯƠNG HIỆU"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chữ Trên Nút Đăng Ký (CTA Button)
            </label>
            <input
              type="text"
              value={sponsors.ctaButtonText || ""}
              onChange={(e) => setSponsors({ ...sponsors, ctaButtonText: e.target.value })}
              placeholder="VD: Đăng Ký Đồng Hành Ngay"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu Đề Lớn Banner (CTA Title)
            </label>
            <input
              type="text"
              value={sponsors.ctaTitle || ""}
              onChange={(e) => setSponsors({ ...sponsors, ctaTitle: e.target.value })}
              placeholder="VD: Đưa thương hiệu của bạn tiếp cận 500+ Doanh nghiệp & Lãnh đạo"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Đoạn Văn Mô Tả Banner (CTA Subtitle)
            </label>
            <input
              type="text"
              value={sponsors.ctaSubtitle || ""}
              onChange={(e) => setSponsors({ ...sponsors, ctaSubtitle: e.target.value })}
              placeholder="VD: Trở thành Nhà tài trợ chính thức của Diễn đàn SME Việt Nam 2026 để nhận trọn bộ đặc quyền truyền thông và gian hàng VIP."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
