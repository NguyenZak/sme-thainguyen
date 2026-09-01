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
  Clock,
  Building2,
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

function cleanHtmlText(input?: string): string {
  if (!input) return "";
  let txt = input;

  txt = txt
    .replace(/&iacutec;/gi, "í")
    .replace(/&iacute;/gi, "í")
    .replace(/&yacute;/gi, "ý")
    .replace(/&ecirc;/gi, "ê")
    .replace(/&agrave;/gi, "à")
    .replace(/&aacute;/gi, "á")
    .replace(/&ocirc;/gi, "ô")
    .replace(/&otilde;/gi, "õ")
    .replace(/&ugrave;/gi, "ù")
    .replace(/&uacute;/gi, "ú")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/<\/?strong>/gi, "")
    .replace(/<\/?b>/gi, "")
    .replace(/<\/?em>/gi, "")
    .replace(/<\/?p>/gi, "");

  return txt.trim();
}

const formSchema = z.object({
  intentTab: z.enum(["delegate", "sponsor", "booth"]),
  isMember: z.boolean().optional(),
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
  includeDay18Lunch: z.boolean().optional(),
  includeDay19Lunch: z.boolean().optional(),
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
  const [isMember, setIsMember] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    registrationId?: string;
    data?: Record<string, any>;
    status?: "pending" | "completed" | "confirmed";
  }>({ open: false });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [userConfirmedPaid, setUserConfirmedPaid] = useState(false);
  const [reminderSecondsLeft, setReminderSecondsLeft] = useState<number>(180);
  const [reminderSent, setReminderSent] = useState(false);
  const [hasPendingPayment, setHasPendingPayment] = useState<any>(null);

  // 1. Restore active payment state from localStorage on page reload / tab open
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("sme_active_payment");
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || !saved.registrationId) return;

      if (saved.status === "pending") {
        const createdAt = saved.createdAt || Date.now();
        const elapsed = Math.floor((Date.now() - createdAt) / 1000);
        const remaining = Math.max(0, 180 - elapsed);

        setSuccessModal({
          open: true,
          registrationId: saved.registrationId,
          data: saved.data,
          status: "pending",
        });
        setReminderSecondsLeft(remaining);
        setUserConfirmedPaid(!!saved.userConfirmedPaid);
        setReminderSent(!!saved.reminderSent || elapsed >= 180);
        setHasPendingPayment(saved);
      }
    } catch (err) {
      console.warn("Failed to restore saved payment state:", err);
    }
  }, []);

  // 2. Cross-tab synchronization via Storage API
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sme_active_payment") {
        if (!e.newValue) {
          setHasPendingPayment(null);
          return;
        }
        try {
          const saved = JSON.parse(e.newValue);
          if (saved && saved.registrationId) {
            setHasPendingPayment(saved);
            if (saved.status === "completed") {
              setSuccessModal((prev) => ({ ...prev, status: "completed", open: true }));
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              toast.success("🟢 Thanh toán thành công!", "Giao dịch đã được xác nhận.");
            } else if (saved.status === "pending") {
              if (saved.userConfirmedPaid !== undefined) setUserConfirmedPaid(saved.userConfirmedPaid);
              if (saved.reminderSent !== undefined) setReminderSent(saved.reminderSent);
            }
          }
        } catch (err) {
          console.warn("Storage sync error:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 3. 3-Minute Countdown timer based on createdAt timestamp
  useEffect(() => {
    if (!successModal.open || successModal.status !== "pending" || reminderSent) return;

    let createdAt = Date.now();
    try {
      const raw = localStorage.getItem("sme_active_payment");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.createdAt) createdAt = parsed.createdAt;
      }
    } catch {}

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - createdAt) / 1000);
      const remaining = Math.max(0, 180 - elapsed);
      setReminderSecondsLeft(remaining);

      if (remaining <= 0 && !reminderSent) {
        trigger3MinReminder();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [successModal.open, successModal.status, reminderSent]);

  // 4. Realtime Status Polling from Supabase (SePay webhook or Admin CMS confirmation)
  useEffect(() => {
    if (!successModal.open || successModal.status !== "pending" || !successModal.registrationId) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/register/status?registrationId=${encodeURIComponent(successModal.registrationId!)}`);
        const resData = await res.json();

        if (resData.success && resData.status === "completed") {
          setSuccessModal((prev) => ({ ...prev, status: "completed" }));
          setHasPendingPayment(null);

          // Update local storage
          try {
            const raw = localStorage.getItem("sme_active_payment");
            if (raw) {
              const parsed = JSON.parse(raw);
              parsed.status = "completed";
              localStorage.setItem("sme_active_payment", JSON.stringify(parsed));
            }
          } catch {}

          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          toast.success(
            "🟢 THANH TOÁN THÀNH CÔNG!",
            "Hệ thống đã nhận chuyển khoản và tự động kích hoạt vé tham dự của bạn."
          );
        }
      } catch (err) {
        console.warn("Polling payment status error:", err);
      }
    };

    checkStatus();
    const pollInterval = setInterval(checkStatus, 5000);
    return () => clearInterval(pollInterval);
  }, [successModal.open, successModal.status, successModal.registrationId]);

  const trigger3MinReminder = async () => {
    if (reminderSent || !successModal.registrationId) return;
    setReminderSent(true);

    // Sync reminderSent to localStorage
    try {
      const raw = localStorage.getItem("sme_active_payment");
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.reminderSent = true;
        localStorage.setItem("sme_active_payment", JSON.stringify(parsed));
      }
    } catch {}

    const amountVal = successModal.data?.totalCalculatedAmount || totalCalculatedAmount;
    const qrCodeUrl = config.customQrImage || `https://qr.sepay.vn/img?bank=${config.sepayBankCode || "MB"}&acc=${config.sepayAccountNumber}&template=compact2&amount=${amountVal}&des=${successModal.registrationId}`;

    try {
      await fetch("/api/send-payment-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: successModal.registrationId,
          fullName: successModal.data?.fullName,
          email: successModal.data?.email,
          phone: successModal.data?.phone,
          company: successModal.data?.company,
          registrationType: successModal.data?.registrationType,
          totalCalculatedAmount: amountVal,
          sepayBankCode: config.sepayBankCode,
          sepayAccountNumber: config.sepayAccountNumber,
          sepayAccountName: config.sepayAccountName,
          qrCodeUrl,
          isUserConfirmedPaid: false,
        }),
      });

      toast.info(
        "📨 Đã gửi Email nhắc nhở thanh toán 3 phút!",
        "Hóa đơn thanh toán kèm mã VietQR đã được tự động gửi tới Email của Quý khách."
      );
    } catch (err) {
      console.warn("Failed to send 3-min reminder:", err);
    }
  };

  const handleUserConfirmPaid = async () => {
    if (userConfirmedPaid || !successModal.registrationId) return;
    setUserConfirmedPaid(true);

    // Sync userConfirmedPaid to localStorage
    try {
      const raw = localStorage.getItem("sme_active_payment");
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.userConfirmedPaid = true;
        localStorage.setItem("sme_active_payment", JSON.stringify(parsed));
      }
    } catch {}

    const amountVal = successModal.data?.totalCalculatedAmount || totalCalculatedAmount;

    try {
      await fetch("/api/send-payment-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: successModal.registrationId,
          fullName: successModal.data?.fullName,
          email: successModal.data?.email,
          phone: successModal.data?.phone,
          company: successModal.data?.company,
          registrationType: successModal.data?.registrationType,
          totalCalculatedAmount: amountVal,
          isUserConfirmedPaid: true,
        }),
      });

      toast.success(
        "✅ Đã gửi xác nhận chuyển khoản!",
        "Ban tổ chức đã nhận thông báo đối soát và đang tự động xác thực cổng thanh toán SePay..."
      );
    } catch (err) {
      console.warn("Failed to confirm paid:", err);
      toast.error("Không thể gửi xác nhận, vui lòng thử lại!");
      setUserConfirmedPaid(false);
    }
  };

  // Extra Delegate calculation states
  const [extraRoomType, setExtraRoomType] = useState<"shared" | "single">("shared");
  const [extraNights, setExtraNights] = useState<number>(1);

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
      isMember: false,
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
      extraNights: 1,
      includeDay18Lunch: false,
      includeDay19Lunch: false,
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

  const watchIncludeDay19Lunch = watch("includeDay19Lunch") || false;

  const lunchUnitPrice = Number(ticketFee?.extraDelegateLunchPriceVND) || DEFAULT_TICKET_FEE.extraDelegateLunchPriceVND || 100000;
  const day19LunchTotalFee = watchIncludeDay19Lunch ? (totalDelegatesCount * lunchUnitPrice) : 0;
  const totalLunchFee = day19LunchTotalFee;

  const sharedRoomRate = Number(ticketFee?.extraDelegateSharedRoomPriceVND) ?? DEFAULT_TICKET_FEE.extraDelegateSharedRoomPriceVND ?? 350000;
  const singleRoomRate = Number(ticketFee?.extraDelegateSingleRoomPriceVND) ?? DEFAULT_TICKET_FEE.extraDelegateSingleRoomPriceVND ?? 700000;

  const roomRatePerNight = extraRoomType === "single" ? singleRoomRate : sharedRoomRate;
  const extraFeePerDelegate = roomRatePerNight * extraNights;
  const totalExtraFees = extraDelegatesCount * extraFeePerDelegate;
  const basePackagePrice = Number(ticketFee?.priceVND) || Number(config?.eventPriceVND) || DEFAULT_TICKET_FEE.priceVND;
  const totalPackagePrice = watchPackageCount * basePackagePrice;
  const totalCalculatedAmount = totalPackagePrice + totalExtraFees + totalLunchFee;

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
        const lunchText = watchIncludeDay19Lunch ? ` + Ăn trưa 19/09 (+${totalLunchFee.toLocaleString("vi-VN")}đ)` : "";
        const memberPrefix = isMember ? "[Thành viên HH DNNVV Thái Nguyên] " : "";

        if (extraDelegatesCount > 0) {
          typeLabel = `${memberPrefix}Đăng ký tham gia: ${watchPackageCount} gói chính (${totalPackageDelegates} ĐB = ${totalPackagePrice.toLocaleString("vi-VN")}đ) + ${extraDelegatesCount} ĐB phát sinh (+${totalExtraFees.toLocaleString("vi-VN")}đ)${lunchText} -> Tổng ${totalDelegatesCount} ĐB: ${totalCalculatedAmount.toLocaleString("vi-VN")} VNĐ`;
        } else {
          typeLabel = `${memberPrefix}Đăng ký tham gia: ${watchPackageCount} gói chính (${totalPackageDelegates} ĐB = ${totalPackagePrice.toLocaleString("vi-VN")}đ)${lunchText} -> Tổng: ${totalCalculatedAmount.toLocaleString("vi-VN")} VNĐ`;
        }
      } else {
        typeLabel = `Nhà tài trợ: ${values.sponsorTier}`;
      }

      const clientRegId = `SME2026-${Math.floor(100000 + Math.random() * 900000)}`;

      let emailSubject = "";
      let emailBody = "";
      if (isMember) {
        emailSubject = `[SME VIỆT NAM 2026] XÁC NHẬN ĐĂNG KÝ HỘI VIÊN HH DNNVV THÁI NGUYÊN - ${clientRegId}`;
        emailBody = `Kính gửi Quý Hội viên ${values.fullName},\n\nBan Tổ Chức Diễn đàn SME Việt Nam 2026 trân trọng xác nhận đã tiếp nhận thành công thông tin đăng ký tham dự của Quý Hội viên (Đơn vị: ${values.company}).\n\nQuyền lợi: Hội viên Hiệp hội Doanh nghiệp nhỏ và vừa tỉnh Thái Nguyên được MIỄN PHÍ TRỌN GÓI tham dự sự kiện. Ban Tổ Chức sẽ chủ động liên hệ và chuẩn bị thẻ đại biểu đón tiếp Quý Hội viên chu đáo nhất.`;
      } else if (values.intentTab === "delegate") {
        emailSubject = registration.delegateEmailSubject || "";
        emailBody = registration.delegateEmailBody || "";
      } else {
        emailSubject = registration.sponsorEmailSubject || "";
        emailBody = registration.sponsorEmailBody || "";
      }

      const emailPosterUrl =
        values.intentTab === "delegate"
          ? registration.delegatePosterUrl || ""
          : registration.sponsorPosterUrl || "";

      const payload = {
        ...values,
        isMember,
        packageCount: watchPackageCount,
        packageDelegatesCount: totalPackageDelegates,
        extraDelegatesCount,
        totalDelegatesCount,
        extraRoomType,
        extraNights,
        includeDay18Lunch: false,
        includeDay19Lunch: watchIncludeDay19Lunch,
        includeDay20Lunch: false,
        totalLunchFee,
        totalCalculatedAmount: values.intentTab === "delegate" ? totalCalculatedAmount : 0,
        registrationId: clientRegId,
        registrationType: typeLabel,
        attendeesCount: `${totalDelegatesCount} đại biểu (${watchPackageCount} gói [${totalPackageDelegates} ĐB] + ${extraDelegatesCount} phát sinh${watchIncludeDay19Lunch ? " + Ăn trưa 19/09" : ""})`,
        emailSubject,
        emailBody,
        emailPosterUrl,
        timestamp: new Date().toISOString(),
        status: isMember ? "Confirmed" : "Pending",
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
        isMember ? "Đăng ký Hội viên thành công!" : "Đăng ký thành công!",
        "Ban tổ chức đã ghi nhận thông tin & sẽ liên hệ với bạn trong 24h."
      );

      setUserConfirmedPaid(false);
      setReminderSecondsLeft(180);
      setReminderSent(false);

      const isDelegateSepay = values.intentTab === "delegate" && !isMember && config.sepayEnabled !== false;
      const initialStatus = isDelegateSepay ? "pending" : "completed";

      if (isDelegateSepay) {
        const savedState = {
          registrationId: regId,
          data: payload,
          status: "pending",
          createdAt: Date.now(),
          userConfirmedPaid: false,
          reminderSent: false,
        };
        try {
          localStorage.setItem("sme_active_payment", JSON.stringify(savedState));
          setHasPendingPayment(savedState);
        } catch (e) {
          console.warn("Failed to save payment state:", e);
        }
      } else {
        localStorage.removeItem("sme_active_payment");
        setHasPendingPayment(null);
      }

      setSuccessModal({
        open: true,
        registrationId: regId,
        data: payload,
        status: initialStatus,
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
            {cleanHtmlText(registration.sectionBadge)}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            {cleanHtmlText(registration.sectionTitle)}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            {cleanHtmlText(registration.sectionDescription)}
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
              <span className="truncate">{cleanHtmlText(registration.delegateTab)}</span>
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
              <span className="truncate">{cleanHtmlText(registration.sponsorTab)}</span>
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
                  ? cleanHtmlText(registration.delegateTab)
                  : cleanHtmlText(registration.sponsorTab)}
              </span>
              <h3
                className="text-xl font-bold text-[#0D3B2E] mt-0.5"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                {activeTab === "delegate"
                  ? cleanHtmlText(registration.delegateIntro)
                  : cleanHtmlText(registration.sponsorIntro)}
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
            {/* Question: Are you a member of Thai Nguyen SME Association? */}
            {activeTab === "delegate" && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border-2 border-emerald-300 shadow-sm space-y-3">
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-emerald-700 text-white shadow-xs">
                      <Building2 className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#0D3B2E]">
                        Bạn có phải là Thành viên HH DNNVV Thái Nguyên không?
                      </h4>
                      <p className="text-[11.5px] sm:text-xs text-slate-600">
                        Thành viên Hiệp hội DNNVV tỉnh Thái Nguyên được đăng ký trực tiếp và <strong className="text-emerald-700 font-bold">bỏ qua bước quét mã QR thanh toán</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMember(true);
                      setValue("isMember", true);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                      isMember
                        ? "bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-400/40"
                        : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isMember ? "border-white bg-white text-emerald-700" : "border-slate-400"}`}>
                        {isMember && <span className="w-2 h-2 rounded-full bg-emerald-700" />}
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm block">ĐÚNG, tôi là Thành viên</span>
                        <span className={`text-[10px] block ${isMember ? "text-emerald-100" : "text-emerald-700 font-bold"}`}>
                          Bỏ qua quét mã QR thanh toán
                        </span>
                      </div>
                    </div>
                    {isMember && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMember(false);
                      setValue("isMember", false);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                      !isMember
                        ? "bg-slate-900 text-white border-slate-950 shadow-md ring-2 ring-slate-400/30"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!isMember ? "border-white bg-white text-slate-900" : "border-slate-400"}`}>
                        {!isMember && <span className="w-2 h-2 rounded-full bg-slate-900" />}
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm block">KHÔNG PHẢI Thành viên</span>
                        <span className={`text-[10px] block ${!isMember ? "text-slate-300" : "text-slate-500"}`}>
                          Quét mã QR thanh toán SePay
                        </span>
                      </div>
                    </div>
                    {!isMember && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                  </button>
                </div>
              </div>
            )}

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

                {/* Lunch Selection Checkbox (Day 19/09 only) */}
                <div className="p-4.5 rounded-2xl bg-[#0D3B2E]/5 border border-emerald-300/80 space-y-3">
                  <label className="block text-xs font-extrabold uppercase text-[#0D3B2E] tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-emerald-700" /> Đăng ký suất ăn trưa theo nhu cầu:
                  </label>

                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${watchIncludeDay19Lunch ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                    <input
                      type="checkbox"
                      {...register("includeDay19Lunch")}
                      className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          🍱 Bữa ăn trưa Ngày 19/09
                        </span>
                        <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-lg border border-amber-300">
                          {lunchUnitPrice.toLocaleString("vi-VN")}đ / bữa / người
                        </span>
                      </div>
                      <span className="text-[11.5px] text-slate-600 block mt-1">
                        {totalDelegatesCount} đại biểu × {lunchUnitPrice.toLocaleString("vi-VN")}đ = <strong className="text-emerald-700 font-extrabold">{day19LunchTotalFee > 0 ? `+${day19LunchTotalFee.toLocaleString("vi-VN")}đ` : "Chưa chọn"}</strong>
                      </span>
                    </div>
                  </label>
                </div>



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
                            <Calendar className="w-4 h-4 text-emerald-700" /> Thời gian lưu trú:
                          </label>
                          <div className="w-full p-2.5 sm:p-3 rounded-xl border border-emerald-300 bg-emerald-50/80 font-bold text-xs text-emerald-950 flex items-center justify-between shadow-xs">
                            <span className="flex items-center gap-1.5">
                              🌙 <strong>1 Đêm (Tối 19/09/2026)</strong>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-extrabold tracking-wide">
                              Trọn gói sự kiện
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/90 border border-amber-200/80 space-y-1 text-[11.5px] mt-auto">
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            <Utensils className="w-3.5 h-3.5 text-emerald-700" /> Quyền lợi ăn uống đi kèm:
                          </p>
                          <p className="text-amber-800 font-bold">• Ăn trưa Ngày 19/09: {lunchUnitPrice.toLocaleString("vi-VN")}đ / bữa / người</p>
                          <p className="text-emerald-700 font-bold">• Bữa sáng Buffet & Tiệc Gala Dinner: Miễn phí trọn gói</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Live Real-time Price Calculation Summary Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0B3026] via-[#0D3B2E] to-[#08281E] text-white space-y-3.5 shadow-lg border border-emerald-700/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 text-xs border-b border-emerald-800/80 pb-3">
                    <span className="text-emerald-100 font-semibold leading-snug">
                      Gói trọn gói chính ({watchPackageCount} gói = {totalPackageDelegates < 10 ? `0${totalPackageDelegates}` : totalPackageDelegates} Đại biểu):
                    </span>
                    <span className="font-extrabold text-white text-sm sm:text-base whitespace-nowrap self-end sm:self-auto">
                      {totalPackagePrice.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>

                  {extraDelegatesCount > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 text-xs border-b border-emerald-800/80 pb-3">
                      <span className="text-amber-200/90 font-medium leading-snug">
                        Phí phát sinh {extraDelegatesCount} Đại biểu ({extraNights} đêm {extraRoomType === "single" ? "phòng đơn" : "ở ghép"}):
                      </span>
                      <span className="font-extrabold text-sm sm:text-base text-amber-400 whitespace-nowrap self-end sm:self-auto">
                        +{totalExtraFees.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  )}

                  {totalLunchFee > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 text-xs border-b border-emerald-800/80 pb-3">
                      <span className="text-amber-200/90 font-medium leading-snug">
                        Phí ăn trưa (Bữa trưa Ngày 19/09):
                      </span>
                      <span className="font-extrabold text-sm sm:text-base text-amber-400 whitespace-nowrap self-end sm:self-auto">
                        +{totalLunchFee.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  )}

                  <div className="pt-1 flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="uppercase tracking-wider text-xs sm:text-sm font-extrabold text-emerald-300">
                        TỔNG CHI PHÍ THANH TOÁN:
                      </span>
                      <div className="flex items-baseline gap-1.5 self-end sm:self-auto whitespace-nowrap">
                        <span
                          className="text-amber-400 text-2xl sm:text-3xl font-black tracking-tight"
                          style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                        >
                          {totalCalculatedAmount.toLocaleString("vi-VN")}
                        </span>
                        <span className="text-amber-300 font-bold text-sm sm:text-base">VNĐ</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-emerald-200/70 italic font-medium text-center sm:text-right">
                      * Giá trên chưa bao gồm thuế VAT *
                    </p>
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
              const isMemberReg = Boolean(
                successModal.data?.isMember ||
                successModal.data?.registrationType?.includes("Thành viên")
              );
              const isDelegateSepay = tab === "delegate" && !isMemberReg && config?.sepayEnabled !== false;
              const isCompleted = successModal.status === "completed" || isMemberReg;

              let modalTitle = isMemberReg
                ? "Xác Nhận Đăng Ký Hội Viên HH DNNVV Thái Nguyên Thành Công!"
                : isDelegateSepay
                ? isCompleted
                  ? "Thanh Toán Thành Công & Đã Xác Nhận!"
                  : "Đơn Đăng Ký Đã Lưu — Chờ Thanh Toán"
                : "Ghi nhận Đăng ký Thành Công!";

              let cardTagline = isMemberReg
                ? "THẺ ĐẠI BIỂU HỘI VIÊN HH DNNVV THÁI NGUYÊN"
                : "THẺ THAM GIA DỰ HỘI NGHỊ & B2B MATCHING";
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
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-3xl w-full shadow-2xl relative space-y-5 sm:space-y-6 border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setSuccessModal({ open: false })}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-100/90 text-slate-500 hover:text-slate-800 transition-colors z-20"
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
                        isMemberReg
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : isDelegateSepay && !isCompleted
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-emerald-100 text-emerald-900 border-emerald-300"
                      }`}>
                        {isMemberReg
                          ? "🏛️ TRẠNG THÁI: HỘI VIÊN HH DNNVV THÁI NGUYÊN"
                          : isDelegateSepay
                          ? isCompleted
                            ? "🟢 TRẠNG THÁI: ĐÃ THANH TOÁN (SEPAY VERIFIED)"
                            : "⏳ TRẠNG THÁI: GIAO DỊCH TREO (CHỜ THANH TOÁN)"
                          : "✅ TRẠNG THÁI: ĐÃ GHI NHẬN THÔNG TIN"}
                      </span>
                    </div>
                  </div>

                  {/* Conditional Layout: 2-Column when Payment QR needed, Single Column for Completed / Member / Sponsor / Booth */}
                  <div className={`grid grid-cols-1 ${tab === "delegate" && isDelegateSepay && !isCompleted ? "md:grid-cols-2" : "max-w-2xl mx-auto"} gap-5 items-stretch w-full`}>
                    {/* Electronic Ticket Card */}
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

                      {/* Info Notice for Sponsor, Booth, Member & Completed Delegates */}
                      {tab !== "delegate" || isMemberReg || isCompleted ? (
                        <div className="pt-3 border-t border-white/20 text-xs space-y-1.5 bg-black/20 p-3 rounded-xl mt-auto">
                          <span className="text-amber-300 font-extrabold uppercase text-[11px] block flex items-center gap-1">
                            ℹ️ THÔNG BÁO TỪ BAN TỔ CHỨC:
                          </span>
                          <p className="text-white/90 text-xs leading-relaxed">
                            {isMemberReg ? (
                              <>Cảm ơn Quý Hội viên đã đăng ký! Ban Tổ Chức đã ghi nhận thông tin và sẽ chủ động liên hệ qua số điện thoại <b>{successModal.data?.phone}</b> để đón tiếp và phục vụ chu đáo nhất.</>
                            ) : tab !== "delegate" ? (
                              <>Cảm ơn Quý đơn vị đã đăng ký! Bộ phận Thư ký Ban Tổ Chức sẽ chủ động liên hệ trực tiếp qua số điện thoại <b>{successModal.data?.phone}</b> trong vòng 24 giờ làm việc để trao đổi thủ tục & hợp đồng chính thức.</>
                            ) : (
                              <>Cảm ơn Quý khách đã đăng ký! Ban Tổ Chức đã ghi nhận thông tin đăng ký của bạn.</>
                            )}
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

                    {/* Right Column: Only rendered when Payment VietQR is needed */}
                    {tab === "delegate" && isDelegateSepay && !isCompleted && (() => {
                      const amountVal = successModal.data?.totalCalculatedAmount || totalCalculatedAmount;
                      const amountFormatted = amountVal.toLocaleString("vi-VN");
                      const bankCode = config?.sepayBankCode || "VCB";
                      const accountNumber = config?.sepayAccountNumber || "1230446868";
                      const accountName = config?.sepayAccountName || "HIEP HOI DNNVV THAI NGUYEN";
                      const qrCodeUrl = config?.customQrImage || `https://qr.sepay.vn/img?bank=${bankCode}&acc=${accountNumber}&template=compact2&amount=${amountVal}&des=${successModal.registrationId}`;

                      return (
                        <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg">
                          <div className="space-y-3 flex flex-col items-center text-center h-full justify-between">
                            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2.5">
                              <span className="text-xs font-bold uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                                💳 Thanh Toán VietQR SePay
                              </span>
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                                ⏳ Chờ chuyển khoản
                              </span>
                            </div>

                            {/* Prominent Payment Countdown Timer Banner */}
                            <div className="w-full bg-slate-950 border border-amber-500/40 p-3 rounded-2xl text-center space-y-1.5 shadow-inner">
                              <div className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                                <span>Thời gian giữ vé & tự động gửi Email:</span>
                              </div>
                              <div className="text-2xl font-black text-amber-300 font-mono tracking-widest flex items-center justify-center gap-1">
                                <span className="bg-amber-950 px-3 py-1 rounded-xl border border-amber-500/40 shadow-sm">
                                  {Math.floor(reminderSecondsLeft / 60).toString().padStart(2, "0")}
                                </span>
                                <span className="animate-pulse text-amber-400 font-sans">:</span>
                                <span className="bg-amber-950 px-3 py-1 rounded-xl border border-amber-500/40 shadow-sm">
                                  {(reminderSecondsLeft % 60).toString().padStart(2, "0")}
                                </span>
                              </div>
                              <p className="text-[10px] text-amber-200/90 leading-tight">
                                {reminderSent
                                  ? "✉️ Đã tự động gửi Email hóa đơn & VietQR tới hộp thư của bạn."
                                  : "Sau khi đếm ngược kết thúc, hệ thống sẽ tự động gửi Email đính kèm Hóa Đơn & Mã QR."}
                              </p>
                            </div>

                            <div className="bg-white p-2.5 rounded-xl border border-slate-200 inline-block shadow-md">
                              <img
                                src={qrCodeUrl}
                                alt="VietQR SePay Payment"
                                className="w-48 h-auto object-contain mx-auto"
                              />
                            </div>

                            <div className="w-full text-left bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                              <div className="flex justify-between"><span className="text-slate-400">Ngân hàng:</span> <b className="text-white font-bold">{bankCode}</b></div>
                              <div className="flex justify-between"><span className="text-slate-400">Số tài khoản:</span> <b className="font-mono text-emerald-400">{accountNumber}</b></div>
                              <div className="flex justify-between"><span className="text-slate-400">Chủ tài khoản:</span> <b className="uppercase text-white truncate max-w-[150px]">{accountName}</b></div>
                              <div className="flex justify-between"><span className="text-slate-400">Số tiền:</span> <b className="text-amber-300 font-mono">{amountFormatted} VNĐ</b></div>
                              <div className="flex justify-between items-center pt-1 border-t border-slate-800"><span className="text-slate-400">Nội dung CK:</span> <b className="font-mono text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">{successModal.registrationId}</b></div>
                            </div>

                            {/* Prominent Confirm Paid Button */}
                            <button
                              type="button"
                              onClick={handleUserConfirmPaid}
                              disabled={userConfirmedPaid}
                              className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                                userConfirmedPaid
                                  ? "bg-slate-800 text-emerald-300 border border-emerald-500/40 cursor-default opacity-90"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse"
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>
                                {userConfirmedPaid
                                  ? "✅ ĐÃ GỬI XÁC NHẬN CHUYỂN KHOẢN (ĐANG ĐỐI SOÁT)"
                                  : "XÁC NHẬN ĐÃ THANH TOÁN"}
                              </span>
                            </button>

                            <div className="w-full bg-emerald-950/60 border border-emerald-500/30 p-2.5 rounded-xl text-[11px] text-emerald-300 font-medium text-center space-y-0.5 shadow-sm">
                              <div className="font-bold flex items-center justify-center gap-1 text-emerald-300 text-xs">
                                <span>✉️ TỰ ĐỘNG GỬI EMAIL XÁC NHẬN</span>
                              </div>
                              <p className="text-[10px] text-emerald-200/90 leading-relaxed">
                                Sau khi thanh toán thành công, hệ thống sẽ tự động gửi Email xác nhận vé tới <b>{successModal.data?.email || "Email đăng ký"}</b>.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
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
                          const amountVal = successModal.data?.totalCalculatedAmount || totalCalculatedAmount;
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

        {/* Floating Sticky Widget when Modal is minimized/closed while pending */}
        {!successModal.open && hasPendingPayment && hasPendingPayment.status === "pending" && (
          <div className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-amber-500/50 flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold shrink-0">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div className="text-left text-xs">
              <div className="font-extrabold text-amber-300">
                ⏳ Giao dịch đếm ngược: <span className="font-mono text-white">{hasPendingPayment.registrationId}</span>
              </div>
              <p className="text-[11px] text-slate-300">Form sẽ giữ đến khi thanh toán hoàn tất.</p>
            </div>
            <button
              onClick={() => {
                setSuccessModal({
                  open: true,
                  registrationId: hasPendingPayment.registrationId,
                  data: hasPendingPayment.data,
                  status: "pending",
                });
              }}
              className="ml-2 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-all shrink-0 cursor-pointer shadow-md"
            >
              Mở lại QR
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
