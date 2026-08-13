"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Ticket, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

const INCLUSIONS = [
  "2 Đêm lưu trú tại Khách sạn 4-Star May Plaza Hotel",
  "Bữa sáng Buffet cao cấp hàng ngày",
  "Các bữa ăn trưa chính theo chương trình",
  "02 Đêm tiệc Gala Dinner & Giao lưu nghệ thuật đẳng cấp",
  "01 Standee giới thiệu doanh nghiệp tại sảnh Diễn đàn",
  "Quảng bá thông tin Doanh nghiệp trên Ấn phẩm Diễn đàn",
  "Thẻ Tham gia trọn gói tham dự 100+ phiên B2B Matching",
];

import { TicketFeeContent, DEFAULT_TICKET_FEE } from "@/constants/defaultContent";

export default function RegistrationFee({ content }: { content?: TicketFeeContent }) {
  const badge = content?.badge || DEFAULT_TICKET_FEE.badge;
  const title = content?.title || DEFAULT_TICKET_FEE.title;
  const subtitle = content?.subtitle || DEFAULT_TICKET_FEE.subtitle;
  const ticketBadgeText = content?.ticketBadgeText || DEFAULT_TICKET_FEE.ticketBadgeText;
  const priceLabel = content?.priceLabel || DEFAULT_TICKET_FEE.priceLabel || "CHI PHÍ NIÊM YẾT";
  const priceVND = content?.priceVND ?? DEFAULT_TICKET_FEE.priceVND;
  const originalPriceVND = content?.originalPriceVND ?? DEFAULT_TICKET_FEE.originalPriceVND;
  const priceUnitText = content?.priceUnitText || DEFAULT_TICKET_FEE.priceUnitText || "/ Gói (2 Đại biểu + 1 Gian hàng)";
  const packageIncludesNote = content?.packageIncludesNote || DEFAULT_TICKET_FEE.packageIncludesNote || "Đã bao gồm 02 Đại biểu chính thức & 01 Gian hàng Triển lãm tiêu chuẩn";
  const sharedRoomPrice = content?.extraDelegateSharedRoomPriceVND ?? DEFAULT_TICKET_FEE.extraDelegateSharedRoomPriceVND ?? 350000;
  const singleRoomPrice = content?.extraDelegateSingleRoomPriceVND ?? DEFAULT_TICKET_FEE.extraDelegateSingleRoomPriceVND ?? 700000;
  const lunchPrice = content?.extraDelegateLunchPriceVND ?? DEFAULT_TICKET_FEE.extraDelegateLunchPriceVND ?? 200000;

  const inclusionsTitle = content?.inclusionsTitle || DEFAULT_TICKET_FEE.inclusionsTitle || "Gói dịch vụ đã bao gồm:";
  const inclusions = content?.inclusions?.length ? content.inclusions : DEFAULT_TICKET_FEE.inclusions;
  const ctaText = content?.ctaText || DEFAULT_TICKET_FEE.ctaText;
  const ctaLink = content?.ctaLink || DEFAULT_TICKET_FEE.ctaLink || "#register";
  const guaranteeText = content?.guaranteeText || DEFAULT_TICKET_FEE.guaranteeText;
  const earlyBirdLabel = content?.earlyBirdLabel || DEFAULT_TICKET_FEE.earlyBirdLabel || "Đăng ký ngay";
  const remainingSlots = content?.remainingSlots ?? DEFAULT_TICKET_FEE.remainingSlots ?? 45;
  const totalSlots = content?.totalSlots ?? DEFAULT_TICKET_FEE.totalSlots ?? 100;
  const earlyBirdSlotText = content?.earlyBirdSlotText || `Còn ${remainingSlots} / ${totalSlots} suất`;
  const progressPercent = totalSlots > 0 ? Math.min(100, Math.max(5, Math.round(((totalSlots - remainingSlots) / totalSlots) * 100))) : 85;

  const discountPercent =
    originalPriceVND && originalPriceVND > priceVND
      ? Math.round(((originalPriceVND - priceVND) / originalPriceVND) * 100)
      : 0;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto space-y-4"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            {badge}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            {title}
          </h2>
          <p className="text-slate-600 text-base max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Highlighted Ticket Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-[#0B3026] via-[#0D3B2E] to-emerald-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden border border-emerald-700/60"
        >
          {/* Decorative Background Accents */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#F59E0B]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#22C55E]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left side: Fee summary */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-emerald-800/80 pb-8 lg:pb-0 lg:pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-[#F59E0B] text-xs font-bold border border-amber-500/30">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" /> {ticketBadgeText}
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-200 uppercase tracking-wider mb-1">
                  {priceLabel}
                </p>

                {/* Strikethrough Price / Giá gạch */}
                {originalPriceVND && originalPriceVND > priceVND ? (
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <span className="text-base sm:text-xl font-bold text-slate-300/80 line-through tracking-tight decoration-red-500/80 decoration-2">
                      {originalPriceVND.toLocaleString("vi-VN")} VNĐ
                    </span>
                    {discountPercent > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[11px] font-extrabold border border-red-500/30">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                ) : null}

                {/* Main Selling Price / Giá ưu đãi chính */}
                <div className="flex flex-wrap items-baseline justify-center lg:justify-start gap-1.5 sm:gap-2">
                  <span
                    className="text-3xl sm:text-5xl font-black text-[#F59E0B] tracking-tight"
                    style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                  >
                    {priceVND.toLocaleString("vi-VN")}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-slate-200 shrink-0">VNĐ</span>
                  <span className="text-xs sm:text-sm font-medium text-slate-300 whitespace-nowrap shrink-0">{priceUnitText}</span>
                </div>

                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11.5px] font-bold flex items-center gap-1.5 justify-center lg:justify-start">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{packageIncludesNote}</span>
                </div>
              </div>

              {/* Early Bird Progress Bar */}
              <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-700/50 space-y-2 text-xs text-emerald-200 text-left">
                <div className="flex items-center justify-between font-bold">
                  <span>{earlyBirdLabel}</span>
                  <span className="text-amber-400">{earlyBirdSlotText}</span>
                </div>
                <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800">
                  <div
                    className="h-full bg-gradient-to-r from-[#22C55E] to-[#F59E0B] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={ctaLink}
                  onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("selectRegistrationTab", { detail: { tab: "delegate" } }))}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-extrabold text-base bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <p className="text-xs text-emerald-200 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> {guaranteeText}
                </p>
              </div>
            </div>

            {/* Right side: Included services & Extra Delegate Rates */}
            <div className="lg:col-span-7 space-y-5">
              <h3
                className="text-lg font-bold text-emerald-100 uppercase tracking-wider flex items-center gap-2"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                <Ticket className="w-5 h-5 text-[#F59E0B]" /> {inclusionsTitle}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-1 gap-2.5">
                {inclusions.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                    className="flex items-start gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-slate-100">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Extra Delegate Cost Policy Note Box */}
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 text-xs text-emerald-100 space-y-2">
                <p className="font-extrabold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                  📌 Chi phí Đại biểu cá nhân / Đại biểu phát sinh thêm:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] font-medium text-slate-200 pt-0.5">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="text-emerald-300 font-bold block mb-0.5">🏨 Phòng nghỉ Khách sạn 4* May Plaza:</span>
                    • Ở ghép (2 người/phòng): <strong className="text-amber-300">{sharedRoomPrice.toLocaleString("vi-VN")}đ</strong>/đêm/người<br />
                    • Phòng 1 người: <strong className="text-amber-300">{singleRoomPrice.toLocaleString("vi-VN")}đ</strong>/đêm/người
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="text-emerald-300 font-bold block mb-0.5">🍽️ Ăn uống theo chương trình:</span>
                    • Ăn trưa ngày 18 & 19/9: <strong className="text-emerald-400">Miễn phí 02 bữa theo chương trình</strong><br />
                    • Ăn trưa Ngày 20/9 (Tham dự thêm): <strong className="text-amber-300">{(content?.day20LunchPriceVND ?? DEFAULT_TICKET_FEE.day20LunchPriceVND ?? 100000).toLocaleString("vi-VN")}đ</strong> / người<br />
                    • Bữa sáng Buffet & Tiệc Gala Dinner: <strong className="text-emerald-400">Miễn phí trọn gói</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
