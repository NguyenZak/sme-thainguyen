"use client";

import { useState } from "react";
import { BoothsContent, BoothItem } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { uploadImageToStorage } from "@/lib/cmsClient";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";

interface BoothsEditorProps {
  initialBooths: BoothsContent;
}

export default function BoothsEditor({ initialBooths }: BoothsEditorProps) {
  const [booths, setBooths] = useState<BoothsContent>(initialBooths);
  const [saving, setSaving] = useState(false);
  const [uploadingMap, setUploadingMap] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleItemChange = (index: number, field: keyof BoothItem, value: any) => {
    const updated = [...booths.items];
    updated[index] = { ...updated[index], [field]: value };
    setBooths({ ...booths, items: updated });
  };

  const addBooth = () => {
    const nextCode = `A-0${booths.items.length + 1}`;
    const newB: BoothItem = {
      id: `b-${Date.now()}`,
      boothCode: nextCode,
      areaName: "Khu Vực A - Công Nghệ & Chuyển Đổi Số",
      size: "3m x 3m",
      priceVND: 7500000,
      status: "available",
      description: "Gian hàng tiêu chuẩn",
    };
    setBooths({ ...booths, items: [...booths.items, newB] });
  };

  const removeBooth = (index: number) => {
    const updated = booths.items.filter((_, i) => i !== index);
    setBooths({ ...booths, items: updated });
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("booths", booths);
    setSaving(false);

    if (res.success) {
      setMsg({ type: "success", text: "Đã cập nhật danh sách sơ đồ gian hàng triển lãm thành công!" });
    } else {
      setMsg({ type: "error", text: res.error || "Không thể lưu dữ liệu." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sơ Đồ & Gian Hàng Triển Lãm</h2>
          <p className="text-xs text-slate-500 mt-1">Thay đổi hình ảnh mặt bằng gian hàng, giá thuê và quản lý trạng thái từng gian hàng (Còn trống / Đặt cọc / Đã bán).</p>
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

      {/* Tiêu Đề Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">CẤU HÌNH TIÊU ĐỀ PHẦN GIAN HÀNG</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Thẻ</label>
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
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phụ Đề Mô Tả Ngắn</label>
            <input
              type="text"
              value={booths.subtitle}
              onChange={(e) => setBooths({ ...booths, subtitle: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Sơ đồ mặt bằng */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">HÌNH ẢNH SƠ ĐỒ MẶT BẰNG (FLOOR PLAN MAP)</h3>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          {booths.mapImageUrl && (
            <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-slate-200 shrink-0">
              <Image src={booths.mapImageUrl} alt="Booth Map" fill className="object-cover" />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL Ảnh Sơ Đồ</label>
              <input
                type="text"
                value={booths.mapImageUrl}
                onChange={(e) => setBooths({ ...booths, mapImageUrl: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                {uploadingMap ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{uploadingMap ? "Đang tải ảnh sơ đồ..." : "Tải ảnh sơ đồ từ máy tính"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleMapUpload} disabled={uploadingMap} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách gian hàng */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">DANH SÁCH GIAN HÀNG ({booths.items.length})</h3>
          <button
            type="button"
            onClick={addBooth}
            className="inline-flex items-center gap-1 text-[11px] text-slate-900 hover:text-black font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Gian Hàng Mới
          </button>
        </div>

        <div className="space-y-4">
          {booths.items.map((b, idx) => (
            <div key={b.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900">GIAN HÀNG #{idx + 1} ({b.boothCode})</span>
                <button
                  type="button"
                  onClick={() => removeBooth(idx)}
                  className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Trạng Thái Gian Hàng</label>
                  <select
                    value={b.status}
                    onChange={(e) => handleItemChange(idx, "status", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none font-semibold"
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
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Giá Gian Hàng (VNĐ)</label>
                  <input
                    type="number"
                    value={b.priceVND}
                    onChange={(e) => handleItemChange(idx, "priceVND", Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tên Đơn Vị Đăng Ký (Nếu có)</label>
                  <input
                    type="text"
                    value={b.reservedBy || ""}
                    onChange={(e) => handleItemChange(idx, "reservedBy", e.target.value)}
                    placeholder="Để trống nếu chưa có"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
