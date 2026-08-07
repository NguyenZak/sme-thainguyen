"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Target, Users, ShieldCheck, Award } from "lucide-react";

const ATTENDEE_TAGS = [
  "Lãnh đạo Chính phủ & Các Bộ ngành Trung ương",
  "Lãnh đạo Tỉnh ủy, HĐND, UBND tỉnh Thái Nguyên",
  "Hiệp hội Doanh nghiệp nhỏ và vừa các tỉnh, thành",
  "Ban quản lý các Khu công nghiệp & Cụm công nghiệp",
  "500+ CEO, Chủ tịch Doanh nghiệp & Nhà đầu tư tiêu biểu",
  "Tổ chức xúc tiến thương mại FDI & Khách quốc tế",
];

import { AboutContent, DEFAULT_ABOUT } from "@/constants/defaultContent";

export default function AboutEvent({ content }: { content?: AboutContent }) {
  const data = content || DEFAULT_ABOUT;
  return (
    <section id="about" className="py-20 bg-[#F4FBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            01 · TỔNG QUAN - Về sự kiện
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            Diễn đàn Kết Nối Giao Thương SME Việt Nam 2026
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Nơi hội tụ &amp; cất cánh của cộng đồng Doanh nghiệp vừa và nhỏ Việt Nam — Sự kiện kinh tế trọng điểm do TASME Thái Nguyên chủ trì, mang sứ mệnh tạo đột phá về kết nối cung cầu, mở rộng chuỗi cung ứng và xúc tiến đầu tư quy mô toàn quốc.
          </p>
        </motion.div>

        {/* 4 Numbered Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sme shadow-sme-hover flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="text-xs font-black text-[#22C55E] uppercase tracking-widest block">01</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0D3B2E] flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0D3B2E]">Kết nối giao thương</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Tổ chức 100+ phiên gặp gỡ B2B trực tiếp 1:1 theo nhu cầu ngành nghề giữa các đại biểu doanh nghiệp toàn quốc.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#0D3B2E] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Giao thương B2B trực tiếp
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sme shadow-sme-hover flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="text-xs font-black text-[#22C55E] uppercase tracking-widest block">02</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0D3B2E] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0D3B2E]">Xúc tiến đầu tư – tài chính</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Giới thiệu danh mục các dự án ưu đãi đầu tư, hạ tầng KCN &amp; giải pháp tài chính xanh hỗ trợ DNNVV.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#0D3B2E] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Tiếp cận Quỹ đầu tư
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sme shadow-sme-hover flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="text-xs font-black text-[#22C55E] uppercase tracking-widest block">03</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0D3B2E] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0D3B2E]">Ký kết hợp tác (MOU)</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Nơi diễn ra các nghi thức ký kết Biên bản ghi nhớ hợp tác chiến lược, hợp đồng kinh tế giá trị cao.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#0D3B2E] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Ký kết hợp đồng ngay sự kiện
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sme shadow-sme-hover flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="text-xs font-black text-[#22C55E] uppercase tracking-widest block">04</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0D3B2E] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0D3B2E]">Quảng bá Thái Nguyên</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Tôn vinh văn hóa Trà Đệ nhất danh sơn, giới thiệu môi trường đầu tư năng động của tỉnh Thái Nguyên.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#0D3B2E] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Quảng bá thương hiệu địa phương
            </div>
          </motion.div>
        </div>

        {/* Thành phần tham dự Matrix Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#0B3026] text-white rounded-3xl p-8 border border-emerald-800 space-y-6 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800 pb-4">
            <div>
              <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider block">Thành phần Tham dự Trọng điểm</span>
              <h3 className="text-xl font-bold text-white mt-1">Quy tụ hơn 500+ Đại biểu &amp; Khách mời Cấp cao</h3>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-700 w-fit">
              Toàn quốc &amp; FDI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ATTENDEE_TAGS.map((tag, idx) => (
              <div key={idx} className="flex items-center gap-2.5 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80 text-xs font-medium text-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
