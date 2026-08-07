"use client";

import { useEffect, useState } from "react";
import { SiteConfig, FooterContent } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { Save, CheckCircle2, AlertCircle, Loader2, Send, FileSpreadsheet, Bot } from "lucide-react";
import { toast } from "@/components/ui/Toast";

interface GeneralEditorProps {
  initialConfig: SiteConfig;
  initialFooter: FooterContent;
  onSaveSuccess?: (updatedConfig: SiteConfig, updatedFooter: FooterContent) => void;
}

export default function GeneralEditor({ initialConfig, initialFooter, onSaveSuccess }: GeneralEditorProps) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [footer, setFooter] = useState<FooterContent>(initialFooter);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    setFooter(initialFooter);
  }, [initialFooter]);

  const [saving, setSaving] = useState(false);
  const [testingTg, setTestingTg] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res1 = await updateSectionAction("site_config", config);
    const res2 = await updateSectionAction("footer", footer);

    setSaving(false);
    if (res1.success && res2.success) {
      toast.success("Lưu thành công!", "Đã cập nhật cấu hình chung, Telegram & Google Sheets.");
      setMsg({ type: "success", text: "Đã cập nhật cấu hình chung, Telegram & Google Sheets thành công!" });
      onSaveSuccess?.(config, footer);
    } else {
      toast.error("Lưu thất bại!", res1.error || res2.error || "Lỗi khi lưu dữ liệu.");
      setMsg({ type: "error", text: res1.error || res2.error || "Lỗi khi lưu dữ liệu." });
    }
  };

  const handleTestTelegram = async (threadId?: string) => {
    if (!config.telegramBotToken || !config.telegramChatId) {
      toast.warning("Thiếu thông tin!", "Vui lòng nhập Telegram Bot Token và Chat ID trước khi thử nghiệm.");
      return;
    }

    setTestingTg(true);
    try {
      const res = await fetch("/api/test-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botToken: config.telegramBotToken,
          chatId: config.telegramChatId,
          threadId: threadId || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Test thành công! 🤖", data.message);
      } else {
        toast.error("Thử nghiệm thất bại!", data.message);
      }
    } catch (err: any) {
      toast.error("Lỗi kết nối Telegram!", err?.message || "Không thể kết nối Telegram API");
    } finally {
      setTestingTg(false);
    }
  };

  const [testingGs, setTestingGs] = useState(false);

  const handleTestGoogleSheet = async () => {
    if (!config.googleSheetScriptUrl) {
      toast.warning("Thiếu thông tin!", "Vui lòng nhập Google Apps Script URL trước khi kiểm tra!");
      return;
    }

    setTestingGs(true);
    try {
      const res = await fetch("/api/test-google-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scriptUrl: config.googleSheetScriptUrl }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Test Google Sheet thành công! 📊", data.message);
      } else {
        toast.error("Thử nghiệm thất bại!", data.message);
      }
    } catch (err: any) {
      toast.error("Lỗi kết nối!", err?.message || "Không thể kết nối Google Apps Script");
    } finally {
      setTestingGs(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cấu Hình Chung, Telegram & Google Sheets</h2>
          <p className="text-xs text-slate-500 mt-1">Quản lý thông tin sự kiện, kết nối bot Telegram thông báo theo từng Topic và đường dẫn Google Sheet tự động.</p>
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

      {/* 1. THÔNG BÁO TỰ ĐỘNG TELEGRAM BOT & CHIA TOPIC */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">THÔNG BÁO TỰ ĐỘNG TELEGRAM BOT & PHÂN LOẠI TOPIC</h3>
              <p className="text-[11px] text-slate-500">Bật tính năng này để nhận thông báo tự động phân loại theo từng Topic (Chủ đề) trong Telegram Supergroup.</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.telegramEnabled ?? false}
              onChange={(e) => setConfig({ ...config, telegramEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Telegram Bot Token</label>
            <input
              type="text"
              placeholder="VD: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
              value={config.telegramBotToken || ""}
              onChange={(e) => setConfig({ ...config, telegramBotToken: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Telegram Chat ID / Group ID</label>
            <input
              type="text"
              placeholder="VD: -1001234567890 hoặc 987654321"
              value={config.telegramChatId || ""}
              onChange={(e) => setConfig({ ...config, telegramChatId: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* ── Telegram Forum Topics Config ───────────────────────────────── */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              📌 CẤU HÌNH TOPIC ID GỬI TIN CHO 3 FORM (FORUM TOPICS)
            </h4>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
              Tùy chọn phân loại
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Nếu Group Telegram của bạn có bật <b>Forum Topics (Chủ đề)</b>, điền Topic ID bên dưới để tin nhắn đăng ký gửi chính xác vào từng Topic tương ứng. <i>(Để trống nếu gửi vào Kênh chung/General)</i>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                🎟️ Topic ID - Đăng ký Đại biểu
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="VD: 2"
                  value={config.telegramThreadIdDelegate || ""}
                  onChange={(e) => setConfig({ ...config, telegramThreadIdDelegate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleTestTelegram(config.telegramThreadIdDelegate)}
                  disabled={testingTg}
                  title="Gửi tin nhắn test tới Topic Đại Biểu"
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 transition-colors text-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                💎 Topic ID - Nhà Tài Trợ
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="VD: 5"
                  value={config.telegramThreadIdSponsor || ""}
                  onChange={(e) => setConfig({ ...config, telegramThreadIdSponsor: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleTestTelegram(config.telegramThreadIdSponsor)}
                  disabled={testingTg}
                  title="Gửi tin nhắn test tới Topic Nhà Tài Trợ"
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 transition-colors text-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                🎪 Topic ID - Gian Hàng Triển Lãm
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="VD: 8"
                  value={config.telegramThreadIdBooth || ""}
                  onChange={(e) => setConfig({ ...config, telegramThreadIdBooth: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleTestTelegram(config.telegramThreadIdBooth)}
                  disabled={testingTg}
                  title="Gửi tin nhắn test tới Topic Gian Hàng"
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 transition-colors text-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] text-slate-500">
            Cách lấy Topic ID: Trong Telegram Group, nhấp chuột phải vào tên Topic &gt; <b>Copy Link Topic</b> &gt; Số cuối cùng chính là Topic ID (Ví dụ: <code>https://t.me/c/12345/<b>8</b></code> &rarr; ID là <b>8</b>).
          </span>
          <button
            type="button"
            onClick={() => handleTestTelegram()}
            disabled={testingTg}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0"
          >
            {testingTg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Test Kênh Chung (General)
          </button>
        </div>
      </div>

      {/* 2. TỰ ĐỘNG GHI VÀO GOOGLE SHEETS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">TỰ ĐỘNG ĐẨY ĐĂNG KÝ VÀO GOOGLE SHEETS</h3>
              <p className="text-[11px] text-slate-500">Tự động ghi từng lượt đăng ký mới trên Landing Page thành 1 dòng trong file Google Sheet của bạn.</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.googleSheetEnabled ?? true}
              onChange={(e) => setConfig({ ...config, googleSheetEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Google Apps Script Web App URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={config.googleSheetScriptUrl || ""}
              onChange={(e) => setConfig({ ...config, googleSheetScriptUrl: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
            />
            <button
              type="button"
              onClick={handleTestGoogleSheet}
              disabled={testingGs}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0 shadow-sm"
            >
              {testingGs ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Gửi Thử Nghiệm
            </button>
          </div>
        </div>

        {/* ── Hướng dẫn 4 Bước cài đặt Google Apps Script ─────────────────── */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              📋 HƯỚNG DẪN 4 BƯỚC TẠO LINK GOOGLE SHEET TỰ ĐỘNG
            </h4>
            <button
              type="button"
              onClick={() => {
                const codeStr = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Thời Gian", "Họ và Tên", "Số Điện Thoại", "Email", "Tên Doanh Nghiệp", "Chức Vụ", "Loại Đăng Ký", "Ghi Chú"]);
      sheet.getRange("A1:H1").setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
    }
    var timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    sheet.appendRow([timestamp, data.fullName||data.full_name||"N/A", data.phone||"N/A", data.email||"N/A", data.company||data.company_name||"N/A", data.position||"N/A", data.registrationType||data.intentTab||"N/A", data.notes||data.networkingNeeds||""]);
    return ContentService.createTextOutput(JSON.stringify({status:"success"})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status:"error",message:err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}`;
                navigator.clipboard.writeText(codeStr);
                toast.success("Đã copy mã Google Apps Script! 📋", "Dán mã này vào Apps Script của Google Sheet.");
              }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-[11px] font-bold transition-colors"
            >
              📋 Copy Mã Script 1-Click
            </button>
          </div>

          <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
            <li>Mở file <b>Google Sheet</b> của bạn &gt; Menu <b>Tiện ích mở rộng (Extensions)</b> &gt; Chọn <b>Apps Script</b>.</li>
            <li>Xóa mã mặc định và dán đoạn mã Script (bấm nút <b>Copy Mã Script 1-Click</b> ở trên).</li>
            <li>Bấm nút <b>Triển khai (Deploy)</b> &gt; <b>Tạo bản triển khai mới (New deployment)</b> &gt; Chọn loại <b>Ứng dụng web (Web App)</b>.</li>
            <li>Mục <b>"Ai có quyền truy cập" (Who has access)</b>: Chọn <b>"Bất kỳ ai" (Anyone)</b> rồi bấm <b>Triển khai</b> &gt; Copy URL dán vào ô bên trên.</li>
          </ol>
        </div>
      </div>

      {/* Thông tin sự kiện cơ bản */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">THÔNG TIN SỰ KIỆN & BAN TỔ CHỨC</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tên Sự Kiện Đầy Đủ</label>
            <input
              type="text"
              value={config.siteName}
              onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Đơn Vị Tổ Chức (Organizer)</label>
            <input
              type="text"
              value={config.organizer}
              onChange={(e) => setConfig({ ...config, organizer: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hotline Liên Hệ</label>
            <input
              type="text"
              value={config.hotline}
              onChange={(e) => {
                setConfig({ ...config, hotline: e.target.value });
                setFooter({ ...footer, contactHotline: e.target.value });
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Hỗ Trợ</label>
            <input
              type="email"
              value={config.email}
              onChange={(e) => {
                setConfig({ ...config, email: e.target.value });
                setFooter({ ...footer, contactEmail: e.target.value });
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Địa Điểm Tổ Chức</label>
            <input
              type="text"
              value={config.address}
              onChange={(e) => {
                setConfig({ ...config, address: e.target.value });
                setFooter({ ...footer, contactAddress: e.target.value });
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* SEO Metadata */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">CẤU HÌNH SEO METADATA</h3>
        
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thẻ Tiêu Đề Web (Meta Title)</label>
          <input
            type="text"
            value={config.metaTitle}
            onChange={(e) => setConfig({ ...config, metaTitle: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thẻ Mô Tả (Meta Description)</label>
          <textarea
            rows={3}
            value={config.metaDescription}
            onChange={(e) => setConfig({ ...config, metaDescription: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 leading-relaxed focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Footer Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">NỘI DUNG FOOTER & MẠNG XÃ HỘI</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Đoạn Văn Giới Thiệu Ở Footer</label>
          <textarea
            rows={3}
            value={footer.aboutText}
            onChange={(e) => setFooter({ ...footer, aboutText: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 leading-relaxed focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Facebook Link</label>
            <input
              type="text"
              value={footer.socialLinks?.facebook || ""}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...(footer.socialLinks || {}), facebook: e.target.value },
                })
              }
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Zalo Official Link</label>
            <input
              type="text"
              value={footer.socialLinks?.zalo || ""}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...(footer.socialLinks || {}), zalo: e.target.value },
                })
              }
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">YouTube Link</label>
            <input
              type="text"
              value={footer.socialLinks?.youtube || ""}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...(footer.socialLinks || {}), youtube: e.target.value },
                })
              }
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bản Quyền Copyright Text</label>
          <input
            type="text"
            value={footer.copyrightText}
            onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
          />
        </div>
      </div>
    </form>
  );
}
