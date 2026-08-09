"use client";

import { useEffect, useState } from "react";
import { SiteConfig } from "@/constants/defaultContent";
import { updateSectionAction } from "@/app/actions/cmsActions";
import { toast } from "@/components/ui/Toast";
import {
  QrCode,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CreditCard,
  Building2,
  Key,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  Check,
} from "lucide-react";

interface SepayQrEditorProps {
  initialConfig: SiteConfig;
  onSaveSuccess?: (updatedConfig: SiteConfig) => void;
}

export default function SepayQrEditor({ initialConfig, onSaveSuccess }: SepayQrEditorProps) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateSectionAction("site_config", config);
      if (res.success) {
        toast.success(
          "Đã lưu cấu hình SePay VietQR! 🎉",
          "Thông tin tài khoản ngân hàng & QR code thanh toán đã được cập nhật."
        );
        if (onSaveSuccess) {
          onSaveSuccess(config);
        }
      } else {
        toast.error(
          "Lưu thất bại!",
          res.error || "Có lỗi xảy ra khi lưu vào hệ thống."
        );
      }
    } catch (err: any) {
      toast.error(
        "Lưu thất bại!",
        err.message || "Lỗi hệ thống."
      );
    } finally {
      setSaving(false);
    }
  };

  const getWebhookUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/api/sepay/webhook`;
    }
    return "https://domain-cua-ban.com/api/sepay/webhook";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
    toast.info(
      "Đã sao chép! 📋",
      "Đường dẫn Webhook SePay đã được lưu vào bộ nhớ tạm."
    );
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl pb-16">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Cấu Hình Thanh Toán QR (SePay VietQR)</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
                Vé Đại Biểu
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý tài khoản ngân hàng nhận tiền và tự động khớp lệnh quét mã VietQR dành riêng cho bán vé đại biểu.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 shrink-0"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Hình QR</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Form Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Enable/Disable Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-slate-900 block">Kích hoạt Cổng VietQR SePay</label>
                <p className="text-xs text-slate-500">Hiển thị mã QR ngân hàng tự động trên modal xác nhận bán vé đại biểu.</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.sepayEnabled ?? false}
                  onChange={(e) => setConfig({ ...config, sepayEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Bank Info Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" /> Ngân Hàng Thụ Hưởng (Bank Code)
                </label>
                <select
                  value={config.sepayBankCode || "MB"}
                  onChange={(e) => setConfig({ ...config, sepayBankCode: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                >
                  <option value="MB">MBBank (Ngân hàng Quân Đội - MB)</option>
                  <option value="VCB">Vietcombank (VCB)</option>
                  <option value="ICB">VietinBank (ICB)</option>
                  <option value="TCB">Techcombank (TCB)</option>
                  <option value="ACB">ACB (Ngân hàng Á Châu)</option>
                  <option value="VPB">VPBank (VPB)</option>
                  <option value="BIDV">BIDV (Đầu tư & Phát triển)</option>
                  <option value="TPB">TPBank (TPB)</option>
                  <option value="STB">Sacombank (STB)</option>
                  <option value="MSB">MSB (Hàng Hải)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" /> Số Tài Khoản Ngân Hàng
                </label>
                <input
                  type="text"
                  placeholder="0388925432"
                  value={config.sepayAccountNumber || ""}
                  onChange={(e) => setConfig({ ...config, sepayAccountNumber: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Tên Chủ Tài Khoản (Viết Hoa Không Dấu)
                </label>
                <input
                  type="text"
                  placeholder="HIEP HOI DNNVV THAI NGUYEN"
                  value={config.sepayAccountName || ""}
                  onChange={(e) => setConfig({ ...config, sepayAccountName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 uppercase focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-500" /> SePay API Key / Secret (Dùng Xác Thực Webhook)
                </label>
                <input
                  type="password"
                  placeholder="Nhập API Key SePay..."
                  value={config.sepayApiKey || ""}
                  onChange={(e) => setConfig({ ...config, sepayApiKey: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                />
                <p className="text-[11px] text-slate-500 mt-1">Dùng để xác thực webhook tự động cập nhật trạng thái đơn hàng khi tiền vào tài khoản.</p>
              </div>
            </div>
          </div>

          {/* Webhook Endpoint Guide Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-3 border border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Đường Dẫn Webhook Cấu Hình Trên SePay.vn
              </h3>
              <a
                href="https://my.sepay.vn"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Mở my.sepay.vn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Copy đường dẫn bên dưới và dán vào phần <b>Webhooks</b> trong tài khoản SePay của bạn để hệ thống tự động cập nhật trạng thái thanh toán 24/7.
            </p>

            <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
              <span className="truncate flex-1">{getWebhookUrl()}</span>
              <button
                onClick={() => copyToClipboard(getWebhookUrl())}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedWebhook ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWebhook ? "Đã copy" : "Sao chép"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Live Preview Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" /> Xem Trước Mã QR Thanh Toán
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.sepayEnabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                {config.sepayEnabled ? "Đang bật" : "Đã tắt"}
              </span>
            </div>

            {config.sepayEnabled && config.sepayAccountNumber ? (
              <div className="space-y-4 text-center">
                <div className="bg-[#0D3B2E] text-white p-5 rounded-2xl space-y-4 border border-emerald-800 shadow-inner">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-amber-300">
                    <span>💳 VIETQR SEPAY PAYMENT</span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Mẫu hiển thị</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl inline-block shadow-md border border-slate-200">
                    <img
                      src={`https://qr.sepay.vn/img?bank=${config.sepayBankCode || "MB"}&acc=${config.sepayAccountNumber}&template=compact&amount=500000&des=SME2026DEMO`}
                      alt="Demo VietQR SePay"
                      className="w-36 h-36 object-contain mx-auto"
                    />
                  </div>

                  <div className="text-[11px] space-y-1 text-slate-200 text-left bg-black/30 p-3 rounded-xl border border-white/10 font-sans">
                    <div><span className="text-slate-400">Ngân hàng:</span> <b className="text-white">{config.sepayBankCode || "MBBank"}</b></div>
                    <div><span className="text-slate-400">Số tài khoản:</span> <b className="font-mono text-emerald-400">{config.sepayAccountNumber}</b></div>
                    <div><span className="text-slate-400">Chủ tài khoản:</span> <b className="uppercase text-white">{config.sepayAccountName || "N/A"}</b></div>
                    <div><span className="text-slate-400">Nội dung CK mẫu:</span> <b className="font-mono text-amber-300">SME2026DEMO</b></div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 italic">
                  Mã QR sẽ tự động hiển thị số tiền tương ứng với số lượng vé đại biểu được đăng ký.
                </p>
              </div>
            ) : (
              <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  Tính năng VietQR SePay đang bị tắt hoặc chưa nhập Số tài khoản ngân hàng.
                </p>
                <p className="text-[11px] text-slate-400">
                  Bật công tắc và nhập đủ thông tin ngân hàng bên trái để mở xem trước.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
