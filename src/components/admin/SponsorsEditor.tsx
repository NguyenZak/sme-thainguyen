"use client";

import { useState } from "react";
import { SponsorsContent, SponsorItem } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { uploadImageToStorage } from "@/lib/cmsClient";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";

interface SponsorsEditorProps {
  initialSponsors: SponsorsContent;
}

export default function SponsorsEditor({ initialSponsors }: SponsorsEditorProps) {
  const [sponsors, setSponsors] = useState<SponsorsContent>(initialSponsors);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleItemChange = (index: number, field: keyof SponsorItem, value: any) => {
    const updated = [...sponsors.items];
    updated[index] = { ...updated[index], [field]: value };
    setSponsors({ ...sponsors, items: updated });
  };

  const addSponsor = () => {
    const newSp: SponsorItem = {
      id: `sp-${Date.now()}`,
      name: "Tên Doanh Nghiệp Tài Trợ",
      tier: "gold",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=150&fit=crop",
    };
    setSponsors({ ...sponsors, items: [...sponsors.items, newSp] });
  };

  const removeSponsor = (index: number) => {
    const updated = sponsors.items.filter((_, i) => i !== index);
    setSponsors({ ...sponsors, items: updated });
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("sponsors", sponsors);
    setSaving(false);

    if (res.success) {
      setMsg({ type: "success", text: "Đã cập nhật danh sách nhà tài trợ thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Lỗi lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Nhà Tài Trợ & Đối Tác Đồng Hành</h2>
          <p className="text-xs text-slate-500 mt-1">Thêm, chỉnh sửa danh sách logo nhà tài trợ theo từng phân cấp (Kim cương, Vàng, Bạc, Đồng).</p>
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
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">CẤU HÌNH TIÊU ĐỀ SECTION</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Badge</label>
            <input
              type="text"
              value={sponsors.badge}
              onChange={(e) => setSponsors({ ...sponsors, badge: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Phân Đoạn</label>
            <input
              type="text"
              value={sponsors.title}
              onChange={(e) => setSponsors({ ...sponsors, title: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phụ Đề Mô Tả Ngắn</label>
            <input
              type="text"
              value={sponsors.subtitle}
              onChange={(e) => setSponsors({ ...sponsors, subtitle: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Hồ Sơ Mời Tài Trợ (File PDF) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>📥 HỒ SƠ MỜI TÀI TRỢ (FILE PDF / TÀI LIỆU)</span>
          </h3>
          {sponsors.prospectusPdfUrl && (
            <a
              href={sponsors.prospectusPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
            >
              <span>Xem Thử File PDF</span> &rarr;
            </a>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Khi khách hàng nhấp vào nút <strong>&quot;Tải Hồ sơ Mời tài trợ (PDF)&quot;</strong> trên trang chủ, hệ thống sẽ mở hoặc tải file này.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Đường Dẫn URL File Hồ Sơ PDF</label>
            <input
              type="text"
              placeholder="https://... hoặc /documents/ho-so-moi-tai-tro-sme-2026.pdf"
              value={sponsors.prospectusPdfUrl || ""}
              onChange={(e) => setSponsors({ ...sponsors, prospectusPdfUrl: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tải File PDF Từ Máy Tính Lên Cloud Storage</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors">
                <Upload className="w-4 h-4" />
                <span>Chọn File PDF / Tài Liệu Tải Lên</span>
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
                      alert("Tải file PDF thất bại: " + (error || "Lỗi không xác định"));
                    } else {
                      setSponsors({ ...sponsors, prospectusPdfUrl: url });
                      alert("Đã tải file PDF lên thành công!");
                    }
                  }}
                />
              </label>
              {sponsors.prospectusPdfUrl ? (
                <span className="text-xs text-emerald-700 font-semibold truncate max-w-md">
                  ✓ Đã có file: {sponsors.prospectusPdfUrl}
                </span>
              ) : (
                <span className="text-xs text-slate-400 italic">Chưa có file PDF tải lên</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách Nhà tài trợ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">DANH SÁCH NHÀ TÀI TRỢ ({sponsors.items.length})</h3>
          <button
            type="button"
            onClick={addSponsor}
            className="inline-flex items-center gap-1 text-[11px] text-slate-900 hover:text-black font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
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

              {/* Logo preview */}
              <div className="w-28 h-20 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-2 shrink-0 relative overflow-hidden shadow-sm">
                {sp.logoUrl ? (
                  <Image src={sp.logoUrl} alt={sp.name} width={100} height={60} className="object-contain max-h-16" />
                ) : (
                  <span className="text-[10px] text-slate-400">Chưa có logo</span>
                )}
              </div>

              {/* Form fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tên Nhà Tài Trợ / Doanh Nghiệp</label>
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
                    <option value="diamond">💎 Kim Cương (Diamond)</option>
                    <option value="gold">🥇 Vàng (Gold)</option>
                    <option value="silver">🥈 Bạc (Silver)</option>
                    <option value="bronze">🥉 Đồng (Bronze)</option>
                    <option value="co-organizer">🤝 Đơn vị Đồng tổ chức</option>
                    <option value="companion">⭐ Đơn vị Đồng hành</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">URL Website Doanh Nghiệp</label>
                  <input
                    type="text"
                    value={sp.websiteUrl || ""}
                    onChange={(e) => handleItemChange(idx, "websiteUrl", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
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
    </form>
  );
}
