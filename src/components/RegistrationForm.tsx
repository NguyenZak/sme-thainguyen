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
  CreditCard,
  Users,
  BedDouble,
  Utensils,
  Calendar,
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
  packageCount: z.string().optional(),
  attendeesCount: z.string().optional(),
  extraDelegatesCount: z.string().optional(),
  extraRoomType: z.enum(["shared", "single"]).optional(),
  extraNights: z.number().optional(),
  includeDay20Lunch: z.boolean().optional(),
  totalCalculatedAmount: z.number().optional(),
  networkingNeeds: z.string().optional(),
  notes: z.string().optional(),
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
  const unitPrice = Number(ticketFee?.priceVND) || Number(config?.eventPriceVND) || DEFAULT_TICKET_FEE.priceVND;

  const [activeTab, setActiveTab] = useState<"delegate" | "sponsor">("delegate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    registrationId?: string;
    data?: FormValues;
    status?: "pending" | "completed" | "confirmed";
  }>({ open: false });
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Extra Delegate calculation states
  const [extraRoomType, setExtraRoomType] = useState<"shared" | "single">("shared");
  const [extraNights, setExtraNights] = useState<number>(2);

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
      packageCount: "1",
      extraDelegatesCount: "0",
      extraRoomType: "shared",
      extraNights: 2,
      includeDay20Lunch: false,
      networkingNeeds: "",
      notes: "",
    },
  });

  const defaultPackageDelegates = Number(ticketFee?.defaultPackageDelegatesCount) || 2;
  const watchPackageCountStr = watch("packageCount") || "1";
  const watchPackageCount = Math.max(1, parseInt(watchPackageCountStr, 10) || 1);
  const totalPackageDelegates = watchPackageCount * defaultPackageDelegates;

  const watchExtraDelegatesStr = watch("extraDelegatesCount") || "0";
  const extraDelegatesCount = Math.max(0, parseInt(watchExtraDelegatesStr, 10) || 0);
  const totalDelegatesCount = totalPackageDelegates + extraDelegatesCount;

  const watchIncludeDay20Lunch = extraNights === 3 ? (watch("includeDay20Lunch") || false) : false;
  const day20LunchUnitPrice = Number(ticketFee?.day20LunchPriceVND) ?? DEFAULT_TICKET_FEE.day20LunchPriceVND ?? 100000;
  const day20LunchTotalFee = watchIncludeDay20Lunch ? (totalDelegatesCount * day20LunchUnitPrice) : 0;

  const sharedRoomRate = Number(ticketFee?.extraDelegateSharedRoomPriceVND) ?? DEFAULT_TICKET_FEE.extraDelegateSharedRoomPriceVND ?? 350000;
  const singleRoomRate = Number(ticketFee?.extraDelegateSingleRoomPriceVND) ?? DEFAULT_TICKET_FEE.extraDelegateSingleRoomPriceVND ?? 700000;
  const lunchPricePerMeal = Number(ticketFee?.extraDelegateLunchPriceVND) ?? DEFAULT_TICKET_FEE.extraDelegateLunchPriceVND ?? 0;
  const lunchRate = lunchPricePerMeal * 2; // 2 bữa trưa chính ngày 18 & 19/09 (Miễn phí 0đ)

  const roomRatePerNight = extraRoomType === "single" ? singleRoomRate : sharedRoomRate;
  const extraFeePerDelegate = (roomRatePerNight * extraNights) + lunchRate;
  const totalExtraFees = extraDelegatesCount * extraFeePerDelegate;
  const basePackagePrice = Number(ticketFee?.priceVND) || Number(config?.eventPriceVND) || DEFAULT_TICKET_FEE.priceVND;
  const totalPackagePrice = watchPackageCount * basePackagePrice;
  const totalCalculatedAmount = totalPackagePrice + totalExtraFees + day20LunchTotalFee;

  const handleGatewayCheckout = async () => {
    if (!successModal.registrationId) return;
    setCheckoutLoading(true);
    try {
      const amountVal = successModal.data?.totalCalculatedAmount || totalCalculatedAmount;
      const res = await fetch("/api/sepay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: successModal.registrationId,
          amount: amountVal,
          description: `Thanh toan ve dai bieu ${successModal.registrationId}`,
          returnUrl: window.location.href,
        }),
      });

      const resData = await res.json();
      if (resData.success && resData.checkoutUrl && resData.fields) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = resData.checkoutUrl;

        Object.entries(resData.fields).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
          }
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error("Lỗi cổng thanh toán!", resData.message || "Không thể khởi tạo Cổng SePay.");
      }
    } catch (err: any) {
      toast.error("Lỗi kết nối!", err?.message || "Không thể kết nối Cổng SePay PG API");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleTabChange = (tab: "delegate" | "sponsor") => {
    setActiveTab(tab);
    setValue("intentTab", tab);
  };

  useEffect(() => {
    const syncTabFromUrlOrEvent = (
      tabParam?: "delegate" | "sponsor" | "booth",
      detail?: { sponsorTier?: string; boothNumber?: string }
    ) => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      let targetTab: "delegate" | "sponsor" | null = tabParam === "booth" ? "sponsor" : tabParam === "delegate" || tabParam === "sponsor" ? tabParam : null;

      if (!targetTab && hash) {
        if (hash.includes("sponsor") || hash.includes("booth")) targetTab = "sponsor";
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
  }, [registration.sponsorTiers, setValue]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      let typeLabel = "";
      if (values.intentTab === "delegate") {
        const day20Text = watchIncludeDay20Lunch ? ` + Ăn trưa 20/09 (+${day20LunchTotalFee.toLocaleString("vi-VN")}đ)` : "";
        if (extraDelegatesCount > 0) {
          typeLabel = `Đăng ký tham gia: ${watchPackageCount} gói chính (${totalPackageDelegates} ĐB = ${totalPackagePrice.toLocaleString("vi-VN")}đ) + ${extraDelegatesCount} ĐB phát sinh (+${totalExtraFees.toLocaleString("vi-VN")}đ)${day20Text} -> Tổng ${totalDelegatesCount} ĐB: ${totalCalculatedAmount.toLocaleString("vi-VN")} VNĐ`;
        } else {
          typeLabel = `Đăng ký tham gia: ${watchPackageCount} gói chính (${totalPackageDelegates} ĐB = ${totalPackagePrice.toLocaleString("vi-VN")}đ)${day20Text} -> Tổng: ${totalCalculatedAmount.toLocaleString("vi-VN")} VNĐ`;
        }
      } else {
        typeLabel = `Nhà tài trợ: ${values.sponsorTier}`;
      }

      const emailSubject =
        values.intentTab === "delegate"
          ? registration.delegateEmailSubject
          : registration.sponsorEmailSubject;

      const emailBody =
        values.intentTab === "delegate"
          ? registration.delegateEmailBody
          : registration.sponsorEmailBody;

      const emailPosterUrl =
        values.intentTab === "delegate"
          ? registration.delegatePosterUrl
          : registration.sponsorPosterUrl;

      const clientRegId = `SME2026-${Math.floor(100000 + Math.random() * 900000)}`;

      const payload = {
        ...values,
        packageCount: watchPackageCount,
        packageDelegatesCount: totalPackageDelegates,
        extraDelegatesCount,
        totalDelegatesCount,
        extraRoomType,
        extraNights,
        includeDay20Lunch: watchIncludeDay20Lunch,
        day20LunchTotalFee,
        totalCalculatedAmount: values.intentTab === "delegate" ? totalCalculatedAmount : 0,
        registrationId: clientRegId,
        registrationType: typeLabel,
        attendeesCount: `${totalDelegatesCount} đại biểu (${watchPackageCount} gói [${totalPackageDelegates} ĐB] + ${extraDelegatesCount} phát sinh${watchIncludeDay20Lunch ? " + Ăn trưa 20/9" : ""})`,
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

        {/* Smart 2-Tab Intent Selector */}
        <div className="space-y-4">
          <div className="flex p-1.5 bg-white rounded-2xl border border-emerald-200 shadow-sm max-w-md mx-auto gap-1 sm:gap-2">
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
              className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === "sponsor"
                  ? "bg-[#F59E0B] text-slate-950 shadow-md"
                  : "text-slate-600 hover:text-[#0D3B2E] hover:bg-slate-50"
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span className="truncate">{registration.sponsorTab}</span>
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
                  : registration.sponsorTab}
              </span>
              <h3
                className="text-xl font-bold text-[#0D3B2E] mt-0.5"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                {activeTab === "delegate"
                  ? registration.delegateIntro
                  : registration.sponsorIntro}
              </h3>
            </div>

            {activeTab === "delegate" && (
              <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0D3B2E] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>Tổng chi phí: <strong className="text-emerald-700 font-extrabold text-sm">{totalCalculatedAmount.toLocaleString("vi-VN")} VNĐ</strong></span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  ({watchPackageCount} gói [{totalPackageDelegates} ĐB]{extraDelegatesCount > 0 ? ` + ${extraDelegatesCount} phát sinh` : ""})
                </span>
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

            {/* Separate Delegate Fields: Package Delegates vs Extra Delegates */}
            {activeTab === "delegate" && (
              <div className="space-y-5 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Field 1: Số lượng Gói vé chính đăng ký */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider flex items-center justify-between">
                      <span>Số lượng Gói vé chính</span>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                        {totalPackageDelegates} ĐB / {watchPackageCount} Gói
                      </span>
                    </label>
                    <select
                      {...register("packageCount")}
                      className="input-focus-ring w-full px-4 py-3 rounded-xl border border-emerald-300 bg-white text-slate-900 text-sm sm:text-base font-extrabold transition-all"
                    >
                      <option value="1">01 Gói ({defaultPackageDelegates * 1 < 10 ? `0${defaultPackageDelegates * 1}` : defaultPackageDelegates * 1} Đại biểu trọn gói) - {basePackagePrice.toLocaleString("vi-VN")} VNĐ</option>
                      <option value="2">02 Gói ({defaultPackageDelegates * 2 < 10 ? `0${defaultPackageDelegates * 2}` : defaultPackageDelegates * 2} Đại biểu trọn gói) - {(basePackagePrice * 2).toLocaleString("vi-VN")} VNĐ</option>
                      <option value="3">03 Gói ({defaultPackageDelegates * 3 < 10 ? `0${defaultPackageDelegates * 3}` : defaultPackageDelegates * 3} Đại biểu trọn gói) - {(basePackagePrice * 3).toLocaleString("vi-VN")} VNĐ</option>
                      <option value="4">04 Gói ({defaultPackageDelegates * 4 < 10 ? `0${defaultPackageDelegates * 4}` : defaultPackageDelegates * 4} Đại biểu trọn gói) - {(basePackagePrice * 4).toLocaleString("vi-VN")} VNĐ</option>
                      <option value="5">05 Gói ({defaultPackageDelegates * 5 < 10 ? `0${defaultPackageDelegates * 5}` : defaultPackageDelegates * 5} Đại biểu trọn gói) - {(basePackagePrice * 5).toLocaleString("vi-VN")} VNĐ</option>
                      <option value="6">06 Gói ({defaultPackageDelegates * 6 < 10 ? `0${defaultPackageDelegates * 6}` : defaultPackageDelegates * 6} Đại biểu trọn gói) - {(basePackagePrice * 6).toLocaleString("vi-VN")} VNĐ</option>
                      <option value="7">07 Gói ({defaultPackageDelegates * 7 < 10 ? `0${defaultPackageDelegates * 7}` : defaultPackageDelegates * 7} Đại biểu trọn gói) - {(basePackagePrice * 7).toLocaleString("vi-VN")} VNĐ</option>
                      <option value="8">08 Gói ({defaultPackageDelegates * 8 < 10 ? `0${defaultPackageDelegates * 8}` : defaultPackageDelegates * 8} Đại biểu trọn gói) - {(basePackagePrice * 8).toLocaleString("vi-VN")} VNĐ</option>
                      <option value="9">09 Gói ({defaultPackageDelegates * 9 < 10 ? `0${defaultPackageDelegates * 9}` : defaultPackageDelegates * 9} Đại biểu trọn gói) - {(basePackagePrice * 9).toLocaleString("vi-VN")} VNĐ</option>
                      <option value="10">10 Gói ({defaultPackageDelegates * 10 < 10 ? `0${defaultPackageDelegates * 10}` : defaultPackageDelegates * 10} Đại biểu trọn gói) - {(basePackagePrice * 10).toLocaleString("vi-VN")} VNĐ</option>
                    </select>
                    <p className="text-[11px] text-slate-500">Mỗi gói vé bao gồm {defaultPackageDelegates} suất tham dự trọn gói quyền lợi sự kiện.</p>
                  </div>

                  {/* Field 2: Số đại biểu phát sinh (Ngoài gói chính) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider flex items-center justify-between">
                      <span>Số đại biểu phát sinh thêm</span>
                      {extraDelegatesCount > 0 && (
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                          +{extraDelegatesCount} phát sinh
                        </span>
                      )}
                    </label>
                    <select
                      {...register("extraDelegatesCount")}
                      className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base font-extrabold transition-all"
                    >
                      <option value="0">0 Đại biểu (Không phát sinh thêm)</option>
                      <option value="1">01 Đại biểu phát sinh thêm (+đêm phòng +ăn trưa)</option>
                      <option value="2">02 Đại biểu phát sinh thêm (+đêm phòng +ăn trưa)</option>
                      <option value="3">03 Đại biểu phát sinh thêm (+đêm phòng +ăn trưa)</option>
                      <option value="4">04 Đại biểu phát sinh thêm (+đêm phòng +ăn trưa)</option>
                      <option value="5">05 Đại biểu phát sinh thêm (+đêm phòng +ăn trưa)</option>
                      <option value="6">06 Đại biểu phát sinh thêm (+đêm phòng +ăn trưa)</option>
                      <option value="7">07 Đại biểu phát sinh thêm (+đêm phòng +ăn trưa)</option>
                      <option value="8">08 Đại biểu phát sinh thêm (+đêm phòng +ăn trưa)</option>
                      <option value="9">09 Đại biểu phát sinh thêm (+đêm phòng +ăn trưa)</option>
                      <option value="10">10 Đại biểu phát sinh thêm (+đêm phòng +ăn trưa)</option>
                    </select>
                    <p className="text-[11px] text-slate-500">Đại biểu đi cùng đăng ký thêm ngoài số lượng trong gói.</p>
                  </div>
                </div>

                {/* B2B Networking Needs */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-[#0D3B2E] tracking-wider">
                    Nhu cầu kết nối B2B (Nếu có)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Tìm nhà phân phối, đối tác cung ứng, đầu tư dự án..."
                    {...register("networkingNeeds")}
                    className="input-focus-ring w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm sm:text-base transition-all"
                  />
                </div>

                {/* Day 20 Lunch Option Card - Automatically hidden for 1 or 2 nights stay, only visible for 3 nights stay */}
                {extraNights === 3 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-2xl bg-[#0D3B2E]/5 border border-emerald-300/80 space-y-2"
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("includeDay20Lunch")}
                        className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm block flex items-center gap-1.5">
                          🍱 Đăng ký Bữa Ăn Trưa Ngày 20/09 (+{(day20LunchUnitPrice).toLocaleString("vi-VN")} VNĐ / người)
                        </span>
                        <span className="text-[11.5px] text-slate-600 block mt-0.5">
                          Quý đoàn chọn lưu trú 3 đêm (có Ngày 20/09), vui lòng tích chọn nếu muốn BTC chuẩn bị thêm suất ăn trưa Ngày 20/09 cho {totalDelegatesCount} đại biểu ({day20LunchTotalFee > 0 ? `+${day20LunchTotalFee.toLocaleString("vi-VN")}đ` : "chưa chọn"}).
                        </span>
                      </div>
                    </label>
                  </motion.div>
                )}

                {/* Extra Delegate Sub-card Configuration */}
                {extraDelegatesCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="p-5 rounded-2xl bg-amber-50/90 border border-amber-300/80 space-y-4 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                      <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-600" /> Cấu hình cho {extraDelegatesCount} đại biểu phát sinh
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black">
                        +{extraDelegatesCount} Đại biểu thêm
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Room Choice */}
                      <div className="space-y-2">
                        <label className="block font-bold text-slate-800 flex items-center gap-1">
                          <BedDouble className="w-4 h-4 text-emerald-700" /> Loại phòng Khách sạn 4* May Plaza:
                        </label>
                        <div className="space-y-2">
                          <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${extraRoomType === "shared" ? "bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm" : "bg-white/70 border-slate-200 hover:bg-white"}`}>
                            <input
                              type="radio"
                              name="extraRoomType"
                              checked={extraRoomType === "shared"}
                              onChange={() => setExtraRoomType("shared")}
                              className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">Ở ghép (2 người / phòng)</span>
                              <span className="text-amber-700 font-extrabold">{sharedRoomRate.toLocaleString("vi-VN")}đ</span> / đêm / người
                            </div>
                          </label>

                          <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${extraRoomType === "single" ? "bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm" : "bg-white/70 border-slate-200 hover:bg-white"}`}>
                            <input
                              type="radio"
                              name="extraRoomType"
                              checked={extraRoomType === "single"}
                              onChange={() => setExtraRoomType("single")}
                              className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">Phòng đơn / riêng (1 người / phòng)</span>
                              <span className="text-amber-700 font-extrabold">{singleRoomRate.toLocaleString("vi-VN")}đ</span> / đêm / người
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Nights & Meal Info */}
                      <div className="space-y-3 flex flex-col justify-between">
                        <div>
                          <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-emerald-700" /> Số đêm lưu trú:
                          </label>
                          <select
                            value={extraNights}
                            onChange={(e) => setExtraNights(Number(e.target.value))}
                            className="w-full p-3 rounded-xl border border-slate-300 bg-white font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value={2}>2 Đêm (18 & 19/09)</option>
                            <option value={1}>1 Đêm</option>
                            <option value={3}>3 Đêm</option>
                          </select>
                        </div>

                        <div className="p-3 rounded-xl bg-white/90 border border-amber-200/80 space-y-1 text-[11.5px] mt-auto">
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            <Utensils className="w-3.5 h-3.5 text-emerald-700" /> Quyền lợi ăn uống đi kèm:
                          </p>
                          <p className="text-emerald-700 font-bold">• Ăn trưa ngày 18 & 19/09: Miễn phí 02 bữa theo chương trình</p>
                          <p className="text-emerald-700 font-bold">• Bữa sáng Buffet & Tiệc Gala Dinner: Miễn phí trọn gói</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Live Real-time Price Calculation Summary Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0D3B2E] text-white space-y-3 shadow-md border border-emerald-800">
                  <div className="flex items-center justify-between text-xs border-b border-emerald-800/80 pb-2.5">
                    <span className="text-slate-300 font-medium">Gói trọn gói chính ({watchPackageCount} gói = {totalPackageDelegates < 10 ? `0${totalPackageDelegates}` : totalPackageDelegates} Đại biểu):</span>
                    <span className="font-bold text-white text-sm">{totalPackagePrice.toLocaleString("vi-VN")} VNĐ</span>
                  </div>

                  {extraDelegatesCount > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-amber-300 border-b border-emerald-800/80 pb-2.5">
                      <span>Phí phát sinh {extraDelegatesCount} Đại biểu ({extraNights} đêm {extraRoomType === "single" ? "phòng đơn" : "ở ghép"}):</span>
                      <span className="font-extrabold text-sm text-amber-400">+{totalExtraFees.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                  )}

                  {watchIncludeDay20Lunch && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-amber-300 border-b border-emerald-800/80 pb-2.5">
                      <span>Phí ăn trưa Ngày 20/09 ({totalDelegatesCount} Đại biểu × {day20LunchUnitPrice.toLocaleString("vi-VN")}đ):</span>
                      <span className="font-extrabold text-sm text-amber-400">+{day20LunchTotalFee.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                  )}

                  <div className="flex flex-col items-end pt-0.5">
                    <div className="flex items-center justify-between w-full text-sm sm:text-base font-extrabold text-emerald-400">
                      <span className="uppercase tracking-wide text-xs sm:text-sm">Tổng Chi Phí Thanh Toán:</span>
                      <span className="text-amber-400 text-xl sm:text-2xl font-black">{totalCalculatedAmount.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                    <span className="text-[11px] text-emerald-200/80 italic font-medium mt-1">* Giá trên chưa bao gồm thuế VAT *</span>
                  </div>
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
                className={`w-full py-4 px-8 rounded-2xl font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 cursor-pointer ${
                  activeTab === "sponsor"
                    ? "bg-[#F59E0B] hover:bg-[#D97706] text-slate-950"
                    : "bg-[#22C55E] hover:bg-[#16A34A] text-white"
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

              let cardTagline = "THẺ THAM GIA DỰ HỘI NGHỊ & B2B MATCHING";
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

                  {/* Conditional Layout: 2-Column for Delegate (VietQR/Ticket), Single Column for Sponsor & Booth */}
                  <div className={`grid grid-cols-1 ${tab === "delegate" ? "md:grid-cols-2" : ""} gap-5 items-stretch`}>
                    {/* Left Column: Electronic Ticket Card */}
                    <div className={`${cardBg} rounded-2xl p-5 border space-y-4 relative overflow-hidden shadow-lg flex flex-col justify-between w-full`}>
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

                      {/* Info Notice for Sponsor & Booth */}
                      {tab !== "delegate" ? (
                        <div className="pt-3 border-t border-white/20 text-xs space-y-1.5 bg-black/20 p-3 rounded-xl mt-auto">
                          <span className="text-amber-300 font-extrabold uppercase text-[11px] block flex items-center gap-1">
                            ℹ️ THÔNG BÁO TỪ BAN TỔ CHỨC:
                          </span>
                          <p className="text-white/90 text-xs leading-relaxed">
                            Cảm ơn Quý đơn vị đã đăng ký! Bộ phận Thư ký Ban Tổ Chức sẽ chủ động liên hệ trực tiếp qua số điện thoại <b>{successModal.data?.phone}</b> trong vòng 24 giờ làm việc để trao đổi thủ tục & hợp đồng chính thức.
                          </p>
                        </div>
                      ) : (
                        (successModal.data?.networkingNeeds || successModal.data?.notes) ? (
                          <div className="pt-2 border-t border-white/20 text-xs mt-auto">
                            <span className="text-white/70 block text-[10px] uppercase mb-0.5">Nhu cầu / Ghi chú</span>
                            <p className="text-white/90 text-[11px] italic bg-black/20 p-2 rounded-lg leading-relaxed">
                              {successModal.data?.networkingNeeds || successModal.data?.notes}
                            </p>
                          </div>
                        ) : null
                      )}
                    </div>

                    {/* Right Column: Only rendered for Delegate Form */}
                    {tab === "delegate" && (
                      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg">
                        {isDelegateSepay && !isCompleted ? (() => {
                          const amountVal = successModal.data?.totalCalculatedAmount || totalCalculatedAmount;
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

                              <div className="w-full bg-emerald-950/60 border border-emerald-500/30 p-2.5 rounded-xl text-[11px] text-emerald-300 font-medium text-center space-y-0.5 shadow-sm">
                                <div className="font-bold flex items-center justify-center gap-1 text-emerald-300 text-xs">
                                  <span>✉️ TỰ ĐỘNG GỬI EMAIL XÁC NHẬN</span>
                                </div>
                                <p className="text-[10px] text-emerald-200/90 leading-relaxed">
                                  Sau khi thanh toán thành công, hệ thống sẽ tự động gửi Email xác nhận vé & mã QR check-in tới <b>{successModal.data?.email || "Email đăng ký"}</b>.
                                </p>
                              </div>
                            </div>
                          );
                        })() : (
                          /* Verified Check-in QR Right Column for Delegate */
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
                    )}
                  </div>

                  {config.sepayMode === "gateway" && isDelegateSepay && !isCompleted && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={handleGatewayCheckout}
                        disabled={checkoutLoading}
                        className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {checkoutLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang chuyển hướng tới Cổng SePay PG API...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            <span>Thanh Toán Thẻ Quốc Tế (Visa/Mastercard/JCB) / NAPAS / SePay Checkout</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

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
