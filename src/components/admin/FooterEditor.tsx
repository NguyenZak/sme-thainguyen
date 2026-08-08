"use client";

import { useState } from "react";
import { FooterContent, DEFAULT_FOOTER } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import RichTextarea from "@/components/admin/RichTextarea";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Share2,
  Map,
  RotateCcw,
  Plus,
  Trash2,
} from "lucide-react";

interface FooterEditorProps {
  initialFooter: FooterContent;
  onSaveSuccess?: (updatedFooter: FooterContent) => void;
}

export default function FooterEditor({ initialFooter, onSaveSuccess }: FooterEditorProps) {
  const [footer, setFooter] = useState<FooterContent>({
    ...DEFAULT_FOOTER,
    ...(initialFooter || {}),
    // Seed contactHotlines from legacy contactHotline if not yet migrated
    contactHotlines:
      initialFooter?.contactHotlines?.length
        ? initialFooter.contactHotlines.map((h) =>
            typeof h === "string" ? { title: "Hotline", phone: h } : h
          )
        : initialFooter?.contactHotline
        ? [{ title: "Hotline", phone: initialFooter.contactHotline }]
        : DEFAULT_FOOTER.contactHotlines ?? [{ title: "Ban Thư ký", phone: "0988.123.456" }],
    socialLinks: {
      ...DEFAULT_FOOTER.socialLinks,
      ...(initialFooter?.socialLinks || {}),
    },
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleResetDefaults = () => {
    if (window.confirm("Đặt lại toàn bộ thông tin Chân Trang (Footer) về mặc định?")) {
      setFooter(DEFAULT_FOOTER);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateSectionAction("footer", footer);
    setSaving(false);

    if (res.success) {
      setMsg({ type: "success", text: "Đã lưu cài đặt Chân Trang & Bản Đồ thành công!" });
      onSaveSuccess?.(footer);
    } else {
      setMsg({ type: "error", text: res.error || "Không thể lưu thay đổi." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Map className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Quản Trị Chân Trang & Bản Đồ Google Maps (Footer)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Tùy chỉnh thông tin liên hệ ban tổ chức, địa chỉ, hotline, email, mạng xã hội và nhúng bản đồ vị trí khách sạn May Plaza.
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
            Lưu Chân Trang
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

      {/* 1. Organizer info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          1. Thông Tin Ban Tổ Chức & Giới Thiệu Chân Trang
        </h3>

        <div>
          <RichTextarea
            label="Đoạn Văn Giới Thiệu Ngắn Chân Trang (About Text)"
            subLabel="💡 Hỗ trợ in đậm <b>, nghiêng <i>, xuống dòng..."
            value={footer.aboutText || ""}
            onChange={(val) => setFooter({ ...footer, aboutText: val })}
            placeholder="VD: Diễn đàn Kết nối giao thương Doanh nghiệp nhỏ và vừa Việt Nam 2026..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Dòng Bản Quyền Chân Trang (Copyright)
          </label>
          <input
            type="text"
            value={footer.copyrightText || ""}
            onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
            placeholder="VD: © 2026 TASME Thái Nguyên. Bản quyền thuộc về Hiệp hội Doanh nghiệp nhỏ và vừa tỉnh Thái Nguyên."
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Contact details */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          2. Địa Chỉ & Đường Dây Nóng Liên Hệ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Địa Chỉ Tổ Chức Sự Kiện
            </label>
            <input
              type="text"
              value={footer.contactAddress || ""}
              onChange={(e) => setFooter({ ...footer, contactAddress: e.target.value })}
              placeholder="VD: Khách sạn May Plaza, Số 668 Đường Phan Đình Phùng, TP. Thái Nguyên"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Hotline Ban Thư Ký / Ban Tổ Chức
              </label>
              <button
                type="button"
                onClick={() =>
                  setFooter({
                    ...footer,
                    contactHotlines: [...(footer.contactHotlines ?? []), { title: "Hotline", phone: "" }],
                  })
                }
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm số
              </button>
            </div>
            {(footer.contactHotlines ?? []).map((hotline, idx) => (
              <div key={idx} className="space-y-1.5 bg-emerald-50/60 border border-emerald-200 rounded-xl p-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Tiêu đề / Chức danh</label>
                    <input
                      type="text"
                      value={hotline.title}
                      onChange={(e) => {
                        const updated = [...(footer.contactHotlines ?? [])];
                        updated[idx] = { ...hotline, title: e.target.value };
                        setFooter({ ...footer, contactHotlines: updated });
                      }}
                      placeholder="VD: Ban Thư ký"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  {(footer.contactHotlines ?? []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (footer.contactHotlines ?? []).filter((_, i) => i !== idx);
                        setFooter({ ...footer, contactHotlines: updated, contactHotline: (updated[0] as any)?.phone ?? "" });
                      }}
                      className="p-1.5 mt-4 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors shrink-0"
                      title="Xóa số này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <input
                    type="tel"
                    value={hotline.phone}
                    onChange={(e) => {
                      const updated = [...(footer.contactHotlines ?? [])];
                      updated[idx] = { ...hotline, phone: e.target.value };
                      setFooter({ ...footer, contactHotlines: updated, contactHotline: updated[0]?.phone ?? "" });
                    }}
                    placeholder="VD: 0988.xxx.xxx"
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-none placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Tiếp Nhận Hồ Sơ & Đăng Ký
            </label>
            <input
              type="email"
              value={footer.contactEmail || ""}
              onChange={(e) => setFooter({ ...footer, contactEmail: e.target.value })}
              placeholder="VD: btc@sme-thainguyen.vn"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Thời Gian Làm Việc / Trực Hỗ Trợ
            </label>
            <input
              type="text"
              value={footer.workingHours || ""}
              onChange={(e) => setFooter({ ...footer, workingHours: e.target.value })}
              placeholder="VD: Thứ Hai - Thứ Bảy: 08:00 - 17:30 (Trực hotline 24/7)"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Social Media Links */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-emerald-600" />
          3. Liên Kết Mạng Xã Hội (Social Links)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook Fanpage URL</label>
            <input
              type="text"
              value={footer.socialLinks?.facebook || ""}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...footer.socialLinks, facebook: e.target.value },
                })
              }
              placeholder="https://facebook.com/..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Zalo Official / Nhóm Zalo URL</label>
            <input
              type="text"
              value={footer.socialLinks?.zalo || ""}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...footer.socialLinks, zalo: e.target.value },
                })
              }
              placeholder="https://zalo.me/..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">YouTube Channel URL</label>
            <input
              type="text"
              value={footer.socialLinks?.youtube || ""}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...footer.socialLinks, youtube: e.target.value },
                })
              }
              placeholder="https://youtube.com/..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">TikTok Channel URL</label>
            <input
              type="text"
              value={footer.socialLinks?.tiktok || ""}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...footer.socialLinks, tiktok: e.target.value },
                })
              }
              placeholder="https://tiktok.com/@..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* 4. Google Maps Embed */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Map className="w-4 h-4 text-emerald-600" />
          4. Bản Đồ Google Maps Vị Trí Sự Kiện
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Google Maps Embed URL (Iframe Src Link)
          </label>
          <input
            type="text"
            value={footer.mapEmbedUrl || ""}
            onChange={(e) => setFooter({ ...footer, mapEmbedUrl: e.target.value })}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Dán đường link `src` trong mã nhúng bản đồ từ Google Maps.
          </p>
        </div>

        {footer.mapEmbedUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200 h-48 w-full mt-3">
            <iframe
              src={footer.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Preview"
            />
          </div>
        )}
      </div>
    </form>
  );
}
