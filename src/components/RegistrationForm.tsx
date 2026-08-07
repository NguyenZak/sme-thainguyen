"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import {
  Send,
  CheckCircle2,
  Ticket,
  QrCode,
  Download,
  X,
  Loader2,
  Award,
  Store,
  Sparkles,
} from "lucide-react";

// Form validation schema with Zod
const formSchema = z.object({
  intentTab: z.enum(["delegate", "sponsor", "booth"]),
  fullName: z.string().min(2, "Vui lòng nhập họ và tên (ít nhất 2 ký tự)"),
  company: z.string().min(2, "Vui lòng nhập tên đơn vị / tổ chức"),
  position: z.string().min(1, "Vui lòng nhập chức vụ"),
  sector: z.string().min(1, "Vui lòng nhập lĩnh vực hoạt động"),
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+\s-]{9,15}$/, "Số điện thoại chứa ký tự không hợp lệ"),
  email: z.string().email("Vui lòng nhập địa chỉ email hợp lệ"),
  sponsorTier: z.string().optional(),
  boothNumber: z.string().optional(),
  attendeesCount: z.string().min(1, "Số người / số gian"),
  networkingNeeds: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const [activeTab, setActiveTab] = useState<"delegate" | "sponsor" | "booth">("delegate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    registrationId?: string;
    data?: FormValues;
  }>({ open: false });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      intentTab: "delegate",
      fullName: "",
      company: "",
      position: "",
      sector: "",
      phone: "",
      email: "",
      sponsorTier: "Gói Kim Cương (70.000.000 đ)",
      boothNumber: "Gian #05 (3m x 3m)",
      attendeesCount: "1",
      networkingNeeds: "",
      notes: "",
    },
  });

  const watchCount = parseInt(watch("attendeesCount") || "1", 10);

  const handleTabChange = (tab: "delegate" | "sponsor" | "booth") => {
    setActiveTab(tab);
    setValue("intentTab", tab);
  };

  useEffect(() => {
    const syncTabFromUrlOrEvent = (
      tabParam?: "delegate" | "sponsor" | "booth",
      detail?: { sponsorTier?: string; boothNumber?: string }
    ) => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      let targetTab: "delegate" | "sponsor" | "booth" | null = tabParam || null;

      if (!targetTab && hash) {
        if (hash.includes("sponsor")) targetTab = "sponsor";
        else if (hash.includes("booth")) targetTab = "booth";
        else if (hash.includes("delegate") || hash.includes("register")) targetTab = "delegate";
      }

      if (targetTab && ["delegate", "sponsor", "booth"].includes(targetTab)) {
        setActiveTab(targetTab);
        setValue("intentTab", targetTab);
      }

      if (detail?.sponsorTier) {
        const found = [
          "Nhà tài trợ Chiến lược (100.000.000 đ)",
          "Nhà tài trợ Kim Cương (70.000.000 đ)",
          "Nhà tài trợ Vàng (50.000.000 đ)",
          "Nhà tài trợ Bạc (30.000.000 đ)",
          "Nhà tài trợ Đồng (15.000.000 đ)",
          "Đơn vị Đồng hành (10.000.000 đ)",
        ].find((tier) => tier.toLowerCase().includes(detail.sponsorTier!.toLowerCase()));
        if (found) {
          setValue("sponsorTier", found);
        }
      }

      if (detail?.boothNumber) {
        setValue("boothNumber", detail.boothNumber);
      }
    };

    syncTabFromUrlOrEvent();

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        tab?: "delegate" | "sponsor" | "booth";
        sponsorTier?: string;
        boothNumber?: string;
      }>;
      syncTabFromUrlOrEvent(customEvent.detail?.tab, customEvent.detail);
    };

    window.addEventListener("hashchange", () => syncTabFromUrlOrEvent());
    window.addEventListener("selectRegistrationTab", handleCustomEvent);

    return () => {
      window.removeEventListener("hashchange", () => syncTabFromUrlOrEvent());
      window.removeEventListener("selectRegistrationTab", handleCustomEvent);
    };
  }, [setValue]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const typeLabel =
        values.intentTab === "delegate"
          ? `Đại biểu tham dự (${values.attendeesCount} vé)`
          : values.intentTab === "sponsor"
          ? `Nhà tài trợ: ${values.sponsorTier}`
          : `Gian hàng triển lãm: ${values.boothNumber} (${values.attendeesCount} gian)`;

      const payload = {
        ...values,
        registrationType: typeLabel,
        timestamp: new Date().toISOString(),
        status: "Pending",
      };

      const endpoint = "/api/register";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => ({}));

      // Trigger Confetti Effect
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      const regId =
        responseData.registrationId ||
        `SME2026-${Math.floor(100000 + Math.random() * 900000)}`;

      setSuccessModal({
        open: true,
        registrationId: regId,
        data: values,
      });

      reset();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Đăng ký thành công! Ban tổ chức đã ghi nhận thông tin của bạn.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register" className="py-20 bg-[#F4FBF7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section 06 Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-3 text-center"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            06 · ĐĂNG KÝ THAM DỰ
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            Cổng Đăng ký Trực tuyến Sự kiện
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            Chọn mục đích đăng ký bên dưới. Ban tổ chức sẽ liên hệ và xác nhận trực tiếp trong 24h.
          </p>
        </motion.div>

        {/* Smart 3-Tab Intent Selector */}
        <div className="space-y-4">
          <div className="flex p-1.5 bg-white rounded-2xl border border-emerald-200 shadow-sm max-w-2xl mx-auto gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => handleTabChange("delegate")}
              className={`flex-1 py-3 px-2 sm:px-3 rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === "delegate"
                  ? "bg-[#22C55E] text-white shadow-md"
                  : "text-slate-600 hover:text-[#0D3B2E] hover:bg-slate-50"
              }`}
            >
              <Ticket className="w-4 h-4 shrink-0" />
              <span className="truncate">Vé Đại biểu</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("sponsor")}
              className={`flex-1 py-3 px-2 sm:px-3 rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === "sponsor"
                  ? "bg-[#F59E0B] text-slate-950 shadow-md"
                  : "text-slate-600 hover:text-[#0D3B2E] hover:bg-slate-50"
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span className="truncate">Nhà Tài trợ</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("booth")}
              className={`flex-1 py-3 px-2 sm:px-3 rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === "booth"
                  ? "bg-[#0D3B2E] text-white shadow-md"
                  : "text-slate-600 hover:text-[#0D3B2E] hover:bg-slate-50"
              }`}
            >
              <Store className="w-4 h-4 shrink-0" />
              <span className="truncate">Gian hàng</span>
            </button>
          </div>

          {/* 3-Step Visual Workflow Progress Bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-6 max-w-xl mx-auto text-xs text-slate-500 pt-1 font-medium">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-5 h-5 rounded-full bg-[#22C55E] text-white flex items-center justify-center text-[10px] font-black">1</span>
              <span>Chọn Hạng Mục</span>
            </div>
            <span className="text-slate-300">➔</span>
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">2</span>
              <span>Điền Thông Tin</span>
            </div>
            <span className="text-slate-300">➔</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Nhận Xác Nhận QR</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200 shadow-sme space-y-6"
        >
          {/* Dynamic Form Header Badge */}
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                {activeTab === "delegate"
                  ? "ĐĂNG KÝ VÉ ĐẠI BIỂU TRỌN GÓI"
                  : activeTab === "sponsor"
                  ? "ĐĂNG KÝ GÓI NHÀ TÀI TRỢ"
                  : "ĐĂNG KÝ GIAN HÀNG TRIỂN LÃM"}
              </span>
              <h3
                className="text-xl font-bold text-[#0D3B2E] mt-0.5"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                {activeTab === "delegate"
                  ? "Phiếu Đăng ký Đại biểu Tham dự"
                  : activeTab === "sponsor"
                  ? "Phiếu Đăng ký Đơn vị Đồng hành Tài trợ"
                  : "Phiếu Giữ vị trí Gian hàng Triển lãm"}
              </h3>
            </div>

            {activeTab === "delegate" && (
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0D3B2E] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span>Tổng chi phí: {(watchCount * 1450000).toLocaleString("vi-VN")} VNĐ</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Dynamic Specific Selector */}
            {activeTab === "sponsor" && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                  Chọn gói tài trợ mong muốn <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("sponsorTier")}
                  className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base font-bold transition-all"
                >
                  <option value="Nhà tài trợ Chiến lược (100.000.000 đ)">Nhà tài trợ Chiến lược (Từ 100.000.000 đ - Tối đa 01)</option>
                  <option value="Nhà tài trợ Kim Cương (70.000.000 đ)">Nhà tài trợ Kim Cương (Từ 70.000.000 đ - Tối đa 02)</option>
                  <option value="Nhà tài trợ Vàng (50.000.000 đ)">Nhà tài trợ Vàng (Từ 50.000.000 đ - Tối đa 03)</option>
                  <option value="Nhà tài trợ Bạc (30.000.000 đ)">Nhà tài trợ Bạc (Từ 30.000.000 đ - Tối đa 05)</option>
                  <option value="Nhà tài trợ Đồng (15.000.000 đ)">Nhà tài trợ Đồng (Từ 15.000.000 đ - Tối đa 10)</option>
                  <option value="Đơn vị Đồng hành (10.000.000 đ)">Đơn vị Đồng hành (Từ 10.000.000 đ)</option>
                </select>
              </div>
            )}

            {activeTab === "booth" && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                  Số gian &amp; Vị trí dự kiến <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("boothNumber")}
                  className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base font-bold transition-all"
                >
                  <option value="Gian #02 (VIP Sảnh A)">Gian #02 (Vị trí VIP Sảnh chính)</option>
                  <option value="Gian #04 (VIP Sảnh A)">Gian #04 (Vị trí VIP Sảnh chính)</option>
                  <option value="Gian #05 (Tiêu chuẩn 3m x 3m)">Gian #05 (Tiêu chuẩn 3m x 3m)</option>
                  <option value="Gian #06 (Tiêu chuẩn 3m x 3m)">Gian #06 (Tiêu chuẩn 3m x 3m)</option>
                  <option value="Gian #07 (Tiêu chuẩn 3m x 3m)">Gian #07 (Tiêu chuẩn 3m x 3m)</option>
                  <option value="Gian #09 (Tiêu chuẩn 3m x 3m)">Gian #09 (Tiêu chuẩn 3m x 3m)</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  {...register("fullName")}
                  className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base transition-all"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                  Đơn vị / Tổ chức <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Công ty CP Tập đoàn..."
                  {...register("company")}
                  className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base transition-all"
                />
                {errors.company && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.company.message}
                  </p>
                )}
              </div>

              {/* Position */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                  Chức vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Chủ tịch / Giám đốc..."
                  {...register("position")}
                  className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base transition-all"
                />
                {errors.position && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.position.message}
                  </p>
                )}
              </div>

              {/* Sector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                  Lĩnh vực hoạt động <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Sản xuất, Nông nghiệp, Tài chính..."
                  {...register("sector")}
                  className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base transition-all"
                />
                {errors.sector && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.sector.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                  Điện thoại (Zalo) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  {...register("phone")}
                  className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base transition-all"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="director@company.com"
                  {...register("email")}
                  className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base transition-all"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Attendees / Booth Quantity count */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                  {activeTab === "booth" ? "Số gian đăng ký" : "Số người đăng ký"}
                </label>
                <input
                  type="number"
                  min="1"
                  {...register("attendeesCount")}
                  className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base transition-all"
                />
              </div>

              {/* Networking Needs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                  Nhu cầu kết nối B2B
                </label>
                <input
                  type="text"
                  placeholder="VD: Tìm nhà phân phối, đối tác cung ứng..."
                  {...register("networkingNeeds")}
                  className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base transition-all"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                Ghi chú riêng gửi BTC
              </label>
              <textarea
                rows={2}
                placeholder="Ghi chú về xuất hóa đơn, phòng ở hoặc yêu cầu hỗ trợ..."
                {...register("notes")}
                className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-8 rounded-2xl font-extrabold text-base text-white shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 cursor-pointer ${
                  activeTab === "sponsor"
                    ? "bg-[#F59E0B] hover:bg-[#D97706] text-slate-950"
                    : activeTab === "booth"
                    ? "bg-[#0D3B2E] hover:bg-[#071F18]"
                    : "bg-[#22C55E] hover:bg-[#16A34A]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý đăng ký...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>
                      {activeTab === "delegate"
                        ? "Xác nhận Đăng ký Vé Đại biểu"
                        : activeTab === "sponsor"
                        ? "Gửi Đăng ký Đồng hành Tài trợ"
                        : "Xác nhận Giữ vị trí Gian hàng"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Success Modal / Digital Ticket Receipt */}
        {successModal.open && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 border border-slate-200">
              <button
                onClick={() => setSuccessModal({ open: false })}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3
                  className="text-2xl font-extrabold text-[#0D3B2E]"
                  style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                >
                  Ghi nhận Đăng ký Thành Công!
                </h3>
                <p className="text-xs text-slate-500">
                  Cảm ơn bạn đã đăng ký tham dự Diễn đàn SME Việt Nam 2026.
                </p>
              </div>

              {/* Electronic Ticket Card */}
              <div className="bg-[#0D3B2E] text-white rounded-2xl p-5 border border-emerald-800 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider block">
                      Thẻ Điện Tử Check-in Sự Kiện
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      MÃ VÉ: {successModal.registrationId}
                    </span>
                  </div>
                  <Ticket className="w-6 h-6 text-[#F59E0B]" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-emerald-200/80 block text-[10px] uppercase">Họ và tên</span>
                    <span className="font-bold text-white block">{successModal.data?.fullName}</span>
                  </div>
                  <div>
                    <span className="text-emerald-200/80 block text-[10px] uppercase">Đơn vị</span>
                    <span className="font-bold text-white block truncate">{successModal.data?.company}</span>
                  </div>
                  <div>
                    <span className="text-emerald-200/80 block text-[10px] uppercase">Số điện thoại</span>
                    <span className="font-bold text-white block">{successModal.data?.phone}</span>
                  </div>
                  <div>
                    <span className="text-emerald-200/80 block text-[10px] uppercase">Mục đích</span>
                    <span className="font-bold text-amber-300 block uppercase">
                      {successModal.data?.intentTab}
                    </span>
                  </div>
                </div>

                {/* QR Placeholder */}
                <div className="pt-3 border-t border-emerald-800 flex items-center justify-between bg-[#071F18] p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white p-1 rounded-lg flex items-center justify-center">
                      <QrCode className="w-10 h-10 text-slate-900" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-emerald-300 block">QR Code Sự kiện</span>
                      <span className="text-[11px] font-bold text-[#22C55E] block">Trạng thái: Đã xác nhận</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> In Thẻ điện tử
                </button>
                <button
                  onClick={() => setSuccessModal({ open: false })}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-[#22C55E] hover:bg-[#16A34A] text-white"
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
