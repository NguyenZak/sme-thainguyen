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
import {
  RegistrationContent,
  DEFAULT_REGISTRATION,
  SiteConfig,
  DEFAULT_SITE_CONFIG,
  TicketFeeContent,
  DEFAULT_TICKET_FEE,
} from "@/constants/defaultContent";
import { toast } from "@/components/ui/Toast";

const formSchema = z
  .object({
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
    attendeesCount: z.string().optional(),
    networkingNeeds: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.intentTab !== "sponsor" && (!data.attendeesCount || data.attendeesCount.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Số người / số gian không được để trống",
        path: ["attendeesCount"],
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

export default function RegistrationForm({
  content,
  siteConfig,
  ticketFee,
}: {
  content?: RegistrationContent;
  siteConfig?: SiteConfig;
  ticketFee?: TicketFeeContent;
}) {
  const registration = content || DEFAULT_REGISTRATION;
  const config = siteConfig || DEFAULT_SITE_CONFIG;
  const unitPrice = ticketFee?.priceVND || config.eventPriceVND || DEFAULT_TICKET_FEE.priceVND;
  const [activeTab, setActiveTab] = useState<"delegate" | "sponsor" | "booth">("delegate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    registrationId?: string;
    data?: FormValues;
    status?: "pending" | "completed" | "confirmed";
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
      sponsorTier: registration.sponsorTiers[0] || "",
      boothNumber: registration.boothOptions[0] || "",
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
        else if (hash.includes("delegate")) targetTab = "delegate";
      }

      if (targetTab) {
        setActiveTab(targetTab);
        setValue("intentTab", targetTab);
      }

      if (detail?.sponsorTier) {
        const found = registration.sponsorTiers.find((tier) =>
          tier.toLowerCase().includes(detail.sponsorTier!.toLowerCase())
        );
        if (found) {
          setValue("sponsorTier", found);
        }
      }

      if (detail?.boothNumber) {
        const foundBooth = registration.boothOptions.find((option) =>
          option.toLowerCase().includes(detail.boothNumber!.toLowerCase())
        );
        setValue("boothNumber", foundBooth || detail.boothNumber);
      }
    };

    const onHashChange = () => syncTabFromUrlOrEvent();
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        tab?: "delegate" | "sponsor" | "booth";
        sponsorTier?: string;
        boothNumber?: string;
      }>;
      syncTabFromUrlOrEvent(customEvent.detail?.tab, customEvent.detail);
    };

    syncTabFromUrlOrEvent();
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("selectRegistrationTab", handleCustomEvent);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("selectRegistrationTab", handleCustomEvent);
    };
  }, [registration.boothOptions, registration.sponsorTiers, setValue]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const typeLabel =
        values.intentTab === "delegate"
          ? `Đại biểu tham dự (${values.attendeesCount} vé)`
          : values.intentTab === "sponsor"
          ? `Nhà tài trợ: ${values.sponsorTier}`
          : `Gian hàng triển lãm: ${values.boothNumber} (${values.attendeesCount} gian)`;

      const emailSubject =
        values.intentTab === "delegate"
          ? registration.delegateEmailSubject
          : values.intentTab === "sponsor"
          ? registration.sponsorEmailSubject
          : registration.boothEmailSubject;

      const emailBody =
        values.intentTab === "delegate"
          ? registration.delegateEmailBody
          : values.intentTab === "sponsor"
          ? registration.sponsorEmailBody
          : registration.boothEmailBody;

      const emailPosterUrl =
        values.intentTab === "delegate"
          ? registration.delegatePosterUrl
          : values.intentTab === "sponsor"
          ? registration.sponsorPosterUrl
          : registration.boothPosterUrl;

      const clientRegId = `SME2026-${Math.floor(100000 + Math.random() * 900000)}`;

      const payload = {
        ...values,
        registrationId: clientRegId,
        registrationType: typeLabel,
        emailSubject,
        emailBody,
        emailPosterUrl,
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

      const regId = responseData.registrationId || clientRegId;

      toast.success(
        "Đăng ký thành công!",
        "Ban tổ chức đã ghi nhận thông tin & sẽ liên hệ với bạn trong 24h."
      );

      setSuccessModal({
        open: true,
        registrationId: regId,
        data: values,
        status: values.intentTab === "delegate" && config.sepayEnabled ? "pending" : "completed",
      });

      reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.success(
        "Đăng ký thành công!",
        "Ban tổ chức đã ghi nhận thông tin của bạn."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register" className="py-20 bg-[#F4FBF7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section 06 Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-3 text-center max-w-5xl mx-auto"
        >
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            {registration.sectionBadge}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            {registration.sectionTitle}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            {registration.sectionDescription}
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
              <span className="truncate">{registration.delegateTab}</span>
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
              <span className="truncate">{registration.sponsorTab}</span>
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
              <span className="truncate">{registration.boothTab}</span>
            </button>
          </div>

          {/* 3-Step Visual Workflow Progress Bar */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-4 max-w-xl mx-auto text-[10.5px] sm:text-xs text-slate-500 pt-1 font-medium">
            <div className="flex items-center gap-1 sm:gap-1.5 text-emerald-700 font-bold whitespace-nowrap shrink-0">
              <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#22C55E] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0">1</span>
              <span>Chọn Hạng Mục</span>
            </div>
            <span className="text-slate-300 text-[10px] shrink-0">➔</span>
            <div className="flex items-center gap-1 sm:gap-1.5 text-emerald-800 font-bold whitespace-nowrap shrink-0">
              <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0">2</span>
              <span>Điền Thông Tin</span>
            </div>
            <span className="text-slate-300 text-[10px] shrink-0">➔</span>
            <div className="flex items-center gap-1 sm:gap-1.5 text-slate-400 whitespace-nowrap shrink-0">
              <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0">3</span>
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
                  ? registration.delegateTab
                  : activeTab === "sponsor"
                  ? registration.sponsorTab
                  : registration.boothTab}
              </span>
              <h3
                className="text-xl font-bold text-[#0D3B2E] mt-0.5"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                {activeTab === "delegate"
                  ? registration.delegateIntro
                  : activeTab === "sponsor"
                  ? registration.sponsorIntro
                  : registration.boothIntro}
              </h3>
            </div>

            {activeTab === "delegate" && (
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0D3B2E] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span>Tổng chi phí: {(watchCount * unitPrice).toLocaleString("vi-VN")} VNĐ</span>
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
                  {registration.sponsorTiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
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

            {/* Attendees Count & B2B Networking Needs */}
            {activeTab !== "sponsor" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Number of Attendees */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                    Số người đăng ký <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    {...register("attendeesCount")}
                    className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base font-bold transition-all"
                  />
                  {errors.attendeesCount && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.attendeesCount.message}
                    </p>
                  )}
                </div>

                {/* B2B Networking Needs */}
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
            )}

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
                    <span>Đang gửi thông tin...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{registration.submitButtonText}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Success Modal / Digital Ticket Receipt */}
        {successModal.open && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            {(() => {
              const tab = successModal.data?.intentTab || "delegate";
              const isDelegateSepay = tab === "delegate" && config?.sepayEnabled && config?.sepayAccountNumber;
              const isCompleted = successModal.status === "completed";

              let modalTitle = isDelegateSepay
                ? isCompleted
                  ? "Thanh Toán Thành Công & Đã Xác Nhận!"
                  : "Đơn Đăng Ký Đã Lưu — Chờ Thanh Toán"
                : "Ghi nhận Đăng ký Thành Công!";

              let cardTagline = "THẺ ĐẠI BIỂU DỰ HỘI NGHỊ & B2B MATCHING";
              let cardBg = "bg-[#0D3B2E] border-emerald-800 text-white";
              let accentText = "text-emerald-300";
              let detailLabel = "Số lượng vé";
              let detailVal = `${successModal.data?.attendeesCount || 1} vé tham dự`;

              if (tab === "sponsor") {
                modalTitle = "Xác Nhận Đăng Ký Nhà Tài Trợ & Đồng Hành!";
                cardTagline = "THẺ ĐỐI TÁC / NHÀ TÀI TRỢ CHÍNH THỨC";
                cardBg = "bg-purple-950 border-purple-800 text-white";
                accentText = "text-purple-300";
                detailLabel = "Gói Tài Trợ Chọn";
                detailVal = successModal.data?.sponsorTier || "Gói Đồng Hành";
              } else if (tab === "booth") {
                modalTitle = "Xác Nhận Đăng Ký Gian Hàng Triển Lãm!";
                cardTagline = "THẺ ĐĂNG KÝ GIAN HÀNG TRIỂN LÃM SME 2026";
                cardBg = "bg-amber-950 border-amber-800 text-white";
                accentText = "text-amber-300";
                detailLabel = "Gian Hàng";
                detailVal = `${successModal.data?.boothNumber || "Mã Gian Hàng"} (${successModal.data?.attendeesCount || 1} gian)`;
              }

              return (
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative space-y-6 border border-slate-200 my-8">
                  <button
                    onClick={() => setSuccessModal({ open: false })}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center space-y-2">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-inner ${isDelegateSepay && !isCompleted ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
                      {isDelegateSepay && !isCompleted ? <Loader2 className="w-8 h-8 animate-spin" /> : <CheckCircle2 className="w-8 h-8" />}
                    </div>
                    <h3
                      className="text-xl sm:text-2xl font-black text-slate-900"
                      style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                    >
                      {modalTitle}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                        isDelegateSepay && !isCompleted
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-emerald-100 text-emerald-900 border-emerald-300"
                      }`}>
                        {isDelegateSepay
                          ? isCompleted
                            ? "🟢 TRẠNG THÁI: ĐÃ THANH TOÁN (SEPAY VERIFIED)"
                            : "⏳ TRẠNG THÁI: GIAO DỊCH TREO (CHỜ THANH TOÁN)"
                          : "✅ TRẠNG THÁI: ĐÃ GHI NHẬN THÔNG TIN"}
                      </span>
                    </div>
                  </div>

                  {/* 2-Column Layout: Left = Ticket Details, Right = Dedicated QR Code Payment / Check-in */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                    {/* Left Column: Electronic Ticket Card */}
                    <div className={`${cardBg} rounded-2xl p-5 border space-y-4 relative overflow-hidden shadow-lg flex flex-col justify-between`}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/20 pb-3">
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider block ${accentText}`}>
                              {cardTagline}
                            </span>
                            <span className="text-xs font-mono font-bold text-white">
                              MÃ ĐĂNG KÝ: {successModal.registrationId}
                            </span>
                          </div>
                          <Ticket className="w-6 h-6 text-[#F59E0B] shrink-0" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-white/70 block text-[10px] uppercase">Họ và tên</span>
                            <span className="font-bold text-white block">{successModal.data?.fullName || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-white/70 block text-[10px] uppercase">Số điện thoại</span>
                            <span className="font-bold font-mono text-white block">{successModal.data?.phone || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-white/70 block text-[10px] uppercase">Email</span>
                            <span className="font-bold text-white block truncate">{successModal.data?.email || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-white/70 block text-[10px] uppercase">Đơn vị / Công ty</span>
                            <span className="font-bold text-white block truncate">{successModal.data?.company || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-white/70 block text-[10px] uppercase">Chức vụ</span>
                            <span className="font-bold text-white block truncate">{successModal.data?.position || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-white/70 block text-[10px] uppercase">{detailLabel}</span>
                            <span className="font-bold text-amber-300 block font-mono">{detailVal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Networking Needs / Notes if entered */}
                      {(successModal.data?.networkingNeeds || successModal.data?.notes) && (
                        <div className="pt-2 border-t border-white/20 text-xs mt-auto">
                          <span className="text-white/70 block text-[10px] uppercase mb-0.5">Nhu cầu / Ghi chú</span>
                          <p className="text-white/90 text-[11px] italic bg-black/20 p-2 rounded-lg leading-relaxed">
                            {successModal.data?.networkingNeeds || successModal.data?.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: QR Code Payment / Check-in Card */}
                    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg">
                      {isDelegateSepay && !isCompleted ? (() => {
                        const amountVal = Number(successModal.data?.attendeesCount || 1) * Number(unitPrice || 0);
                        const amountFormatted = amountVal.toLocaleString("vi-VN");
                        const qrCodeUrl = config.customQrImage || `https://qr.sepay.vn/img?bank=${config.sepayBankCode || "MB"}&acc=${config.sepayAccountNumber}&template=compact2&amount=${amountVal}&des=${successModal.registrationId}`;

                        return (
                          <div className="space-y-3 flex flex-col items-center text-center h-full justify-between">
                            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2.5">
                              <span className="text-xs font-bold uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                                💳 Cổng Thanh Toán VietQR SePay
                              </span>
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                                ⏳ Chờ chuyển khoản
                              </span>
                            </div>

                            <div className="bg-white p-2.5 rounded-xl border border-slate-200 inline-block shadow-md">
                              <img
                                src={qrCodeUrl}
                                alt="VietQR SePay Payment"
                                className="w-48 h-auto object-contain mx-auto"
                              />
                            </div>

                            <div className="w-full text-left bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                              <div className="flex justify-between"><span className="text-slate-400">Ngân hàng:</span> <b className="text-white font-bold">{config.sepayBankCode || "MBBank"}</b></div>
                              <div className="flex justify-between"><span className="text-slate-400">Số tài khoản:</span> <b className="font-mono text-emerald-400">{config.sepayAccountNumber}</b></div>
                              <div className="flex justify-between"><span className="text-slate-400">Chủ tài khoản:</span> <b className="uppercase text-white truncate max-w-[150px]">{config.sepayAccountName}</b></div>
                              <div className="flex justify-between"><span className="text-slate-400">Số tiền:</span> <b className="text-amber-300 font-mono">{amountFormatted} VNĐ</b></div>
                              <div className="flex justify-between items-center pt-1 border-t border-slate-800"><span className="text-slate-400">Nội dung CK:</span> <b className="font-mono text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">{successModal.registrationId}</b></div>
                            </div>

                            <p className="text-[10px] text-slate-400 italic">
                              ⚡ Đơn hàng đang ở trạng thái treo. Khi chuyển khoản xong, SePay sẽ tự động duyệt ngay 24/7!
                            </p>
                          </div>
                        );
                      })() : (
                        /* Verified Check-in QR Right Column */
                        <div className="flex flex-col items-center justify-center text-center h-full space-y-4 py-4">
                          <div className="w-24 h-24 bg-white p-3 rounded-2xl flex items-center justify-center border border-slate-200 shadow-md">
                            <QrCode className="w-20 h-20 text-slate-900" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-white uppercase tracking-wider block">QR Code Check-in Sự kiện</span>
                            <span className="text-xs font-bold text-emerald-400 block bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block">
                              Trạng thái: Đã Xác Nhận Chính Thức
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 italic max-w-xs">
                            🎉 Giao dịch đã hoàn tất! Vui lòng lưu thông tin hoặc xuất thẻ điện tử để trình diện khi tham dự sự kiện.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-2">
                    {isDelegateSepay && !isCompleted && (
                      <button
                        onClick={async () => {
                          const amountVal = Number(successModal.data?.attendeesCount || 1) * Number(unitPrice || 0);
                          const qrUrl = config.customQrImage || `https://qr.sepay.vn/img?bank=${config.sepayBankCode || "MB"}&acc=${config.sepayAccountNumber}&template=compact2&amount=${amountVal}&des=${successModal.registrationId}`;
                          try {
                            const res = await fetch(qrUrl);
                            const blob = await res.blob();
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = `Ma_QR_Thanh_Toan_${successModal.registrationId}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            toast.success("Đã tải ảnh QR! 💾", "Mã QR kèm đầy đủ thông tin chuyển khoản đã được lưu.");
                          } catch {
                            window.open(qrUrl, "_blank");
                          }
                        }}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Lưu Ảnh Mã QR
                      </button>
                    )}
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-colors border border-slate-300 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> In Thẻ điện tử
                    </button>
                    <button
                      onClick={() => setSuccessModal({ open: false })}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-black text-white transition-colors cursor-pointer"
                    >
                      Hoàn tất
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
}
