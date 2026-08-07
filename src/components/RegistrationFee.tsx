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
  "Thẻ Đại biểu trọn gói tham dự 100+ phiên B2B Matching",
];

import { TicketFeeContent } from "@/constants/defaultContent";

export default function RegistrationFee({ content }: { content?: TicketFeeContent }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            Chi phí Tham dự
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            Lệ phí Đăng ký Đại biểu Trọn gói
          </h2>
          <p className="text-slate-600 text-base">
            Gói quyền lợi cao cấp đã bao gồm toàn bộ dịch vụ ăn ở, gala dinner và truyền thông cho 01 đại biểu.
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

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left side: Fee summary */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-emerald-800/80 pb-8 lg:pb-0 lg:pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-[#F59E0B] text-xs font-bold border border-amber-500/30">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" /> Vé Đại biểu Chính thức
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-200 uppercase tracking-wider">
                  Chi phí niêm yết
                </p>
                <div className="mt-2 flex flex-wrap items-baseline justify-center lg:justify-start gap-1.5 sm:gap-2">
                  <span
                    className="text-3xl sm:text-5xl font-black text-[#F59E0B] tracking-tight"
                    style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                  >
                    1.450.000
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-slate-200 shrink-0">VNĐ</span>
                  <span className="text-xs sm:text-sm font-medium text-slate-300 whitespace-nowrap shrink-0">/ Đại biểu</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href="#register"
                  onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("selectRegistrationTab", { detail: { tab: "delegate" } }))}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-extrabold text-base bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <span>Đăng ký tham dự ngay</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <p className="text-xs text-emerald-200 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cam kết quyền lợi từ Ban tổ chức TASME
                </p>
              </div>
            </div>

            {/* Right side: Included services */}
            <div className="lg:col-span-7 space-y-4">
              <h3
                className="text-lg font-bold text-emerald-100 uppercase tracking-wider flex items-center gap-2"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                <Ticket className="w-5 h-5 text-[#F59E0B]" /> Gói dịch vụ đã bao gồm:
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                {INCLUSIONS.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex items-start gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-slate-100">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
