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
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Nhà Tài Trợ & Đối Tác Đồng Hành</h2>
          <p className="text-xs text-slate-400">Thêm, chỉnh sửa danh sách logo nhà tài trợ theo từng phân cấp (Kim cương, Vàng, Bạc, Đồng).</p>
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
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">CẤU HÌNH TIÊU ĐỀ SECTION</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Badge</label>
            <input
              type="text"
              value={sponsors.badge}
              onChange={(e) => setSponsors({ ...sponsors, badge: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tiêu Đề Phân Đoạn</label>
            <input
              type="text"
              value={sponsors.title}
              onChange={(e) => setSponsors({ ...sponsors, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Danh sách Nhà tài trợ */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">DANH SÁCH NHÀ TÀI TRỢ ({sponsors.items.length})</h3>
          <button
            type="button"
            onClick={addSponsor}
            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Nhà Tài Trợ
          </button>
        </div>

        <div className="space-y-4">
          {sponsors.items.map((sp, idx) => (
            <div key={sp.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start relative">
              <button
                type="button"
                onClick={() => removeSponsor(idx)}
                className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Logo preview */}
              <div className="w-28 h-20 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center p-2 shrink-0 relative overflow-hidden">
                {sp.logoUrl ? (
                  <Image src={sp.logoUrl} alt={sp.name} width={100} height={60} className="object-contain max-h-16" />
                ) : (
                  <span className="text-[10px] text-slate-500">Chưa có logo</span>
                )}
              </div>

              {/* Form fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full pr-8">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Tên Nhà Tài Trợ / Doanh Nghiệp</label>
                  <input
                    type="text"
                    value={sp.name}
                    onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Hạng Tài Trợ (Tier)</label>
                  <select
                    value={sp.tier}
                    onChange={(e) => handleItemChange(idx, "tier", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
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
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">URL Website Doanh Nghiệp</label>
                  <input
                    type="text"
                    value={sp.websiteUrl || ""}
                    onChange={(e) => handleItemChange(idx, "websiteUrl", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Tải Logo Lên</label>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors border border-slate-800 w-full justify-center">
                    {uploadingIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{uploadingIdx === idx ? "Đang upload..." : "Chọn file logo"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(idx, e)} disabled={uploadingIdx === idx} />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
