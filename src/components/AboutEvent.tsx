"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2, Target, Users, ShieldCheck, Award,
  Crown, TrendingUp, Globe2, Building2, Factory, Landmark,
  Sparkles,
} from "lucide-react";

const ATTENDEE_TAGS = [
  {
    rank: "01",
    label: "Lãnh đạo Chính phủ & Bộ ngành",
    sub: "Đại diện cơ quan quản lý Nhà nước cấp Trung ương",
    tier: "vip",
    icon: Landmark,
    count: "Cấp Bộ trưởng trở lên",
  },
  {
    rank: "02",
    label: "500+ CEO, Chủ tịch Doanh nghiệp",
    sub: "Lãnh đạo cấp cao doanh nghiệp trên toàn quốc",
    tier: "vip",
    icon: Crown,
    count: "500+ lãnh đạo",
  },
  {
    rank: "03",
    label: "Nhà đầu tư & Quỹ đầu tư",
    sub: "Quỹ mạo hiểm, Angel Investor & Private Equity",
    tier: "gold",
    icon: TrendingUp,
    count: "50+ quỹ đầu tư",
  },
  {
    rank: "04",
    label: "Hiệp hội Doanh nghiệp Toàn quốc",
    sub: "Đại diện hiệp hội ngành nghề 63 tỉnh thành",
    tier: "gold",
    icon: Building2,
    count: "63 tỉnh thành",
  },
  {
    rank: "05",
    label: "Đối tác FDI Quốc tế",
    sub: "Doanh nghiệp nước ngoài & tổ chức quốc tế",
    tier: "standard",
    icon: Globe2,
    count: "10+ quốc gia",
  },
  {
    rank: "06",
    label: "Ban quản lý KCN & Khu kinh tế",
    sub: "Đại diện khu công nghiệp & khu kinh tế trọng điểm",
    tier: "standard",
    icon: Factory,
    count: "20+ KCN",
  },
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


        {/* Thành phần tham dự — PREMIUM */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #071f18 0%, #0D3B2E 45%, #0a2d22 100%)",
          }}
        >
          {/* Animated conic border */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-3xl z-0"
            style={{
              background:
                "conic-gradient(from var(--angle,0deg), transparent 60%, #F59E0B 72%, #22C55E 78%, #F59E0B 84%, transparent 94%)",
              padding: "2px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
            animate={{ "--angle": ["0deg", "360deg"] } as never}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Background glow blobs */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute -top-10 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[90px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-500/10 blur-[70px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-40 rounded-full bg-emerald-800/10 blur-[60px]" />
          </div>

          {/* Dot pattern */}
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />

          {/* Gold top accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent z-10" />

          <div className="relative z-10 px-6 pt-8 pb-8">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
            >
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-amber-500/50" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-amber-400 whitespace-nowrap">
                    ✦ Thành phần Tham dự Trọng điểm ✦
                  </span>
                  <div className="h-px flex-1 bg-amber-500/20" />
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-extrabold text-white leading-tight"
                  style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                >
                  Quy tụ hơn{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
                    500+
                  </span>{" "}
                  Đại biểu & Khách mời Cấp cao
                </h3>
                <p className="mt-1.5 text-sm text-white/50 max-w-md">
                  Hội tụ lãnh đạo từ Chính phủ, doanh nghiệp hàng đầu và nhà đầu tư quốc tế trong 3 ngày sự kiện.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <span className="px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-bold border border-amber-500/30 uppercase tracking-wide whitespace-nowrap">
                  ✦ Toàn quốc
                </span>
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 uppercase tracking-wide whitespace-nowrap">
                  🌐 FDI Quốc tế
                </span>
              </div>
            </motion.div>

            {/* Attendee cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ATTENDEE_TAGS.map((tag, idx) => {
                const isVip = tag.tier === "vip";
                const isGold = tag.tier === "gold";
                const Icon = tag.icon;
                const accent = isVip ? "#F59E0B" : isGold ? "#22C55E" : "#6B9E8A";
                const bgGrad = isVip
                  ? "from-amber-900/50 to-emerald-950/90"
                  : isGold
                  ? "from-emerald-800/50 to-emerald-950/90"
                  : "from-emerald-900/30 to-emerald-950/80";
                const borderColor = isVip
                  ? "border-amber-500/40"
                  : isGold
                  ? "border-emerald-500/40"
                  : "border-emerald-800/50";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.25 + idx * 0.08 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`relative flex flex-col gap-3 p-5 rounded-2xl border bg-gradient-to-br overflow-hidden cursor-default group ${bgGrad} ${borderColor}`}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `radial-gradient(ellipse at top left, ${accent}15 0%, transparent 70%)` }}
                    />

                    {/* Tier badge — top right */}
                    {(isVip || isGold) && (
                      <span
                        className="absolute top-3.5 right-4 text-[10px] font-black uppercase tracking-widest"
                        style={{ color: `${accent}90` }}
                      >
                        {isVip ? "★ VIP" : "◆ GOLD"}
                      </span>
                    )}

                    {/* Icon + Tier pill row */}
                    <div className="flex items-center gap-3 z-10 relative">
                      <motion.div
                        className="relative flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
                        style={{ background: `${accent}20`, border: `1.5px solid ${accent}40` }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          className="absolute inset-0 rounded-xl blur-md"
                          style={{ backgroundColor: accent }}
                          animate={{ opacity: [0.1, 0.3, 0.1] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.4 }}
                        />
                        <Icon className="w-5 h-5 relative z-10" style={{ color: accent }} />
                      </motion.div>

                      <div>
                        <span
                          className="text-[10px] font-black uppercase tracking-[0.2em] block leading-none mb-0.5"
                          style={{ color: `${accent}bb` }}
                        >
                          {tag.rank}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border"
                          style={{
                            color: accent,
                            backgroundColor: `${accent}15`,
                            borderColor: `${accent}35`,
                          }}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          {tag.count}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px z-10 relative" style={{ background: `${accent}25` }} />

                    {/* Label */}
                    <p
                      className="font-extrabold text-[15px] leading-snug z-10 relative"
                      style={{ color: isVip ? "#FEF3C7" : isGold ? "#D1FAE5" : "#CBD5E1" }}
                    >
                      {tag.label}
                    </p>

                    {/* Sub */}
                    <p className="text-white/45 text-[11.5px] leading-relaxed z-10 relative">{tag.sub}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom stat strip */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="mt-7 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-center"
            >
              {[
                { value: "500+", label: "Đại biểu" },
                { value: "63",   label: "Tỉnh thành" },
                { value: "10+",  label: "Quốc gia" },
                { value: "3",    label: "Ngày sự kiện" },
              ].map(({ value, label }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-lg font-black text-amber-300">{value}</span>
                  <span className="text-[11px] text-white/35 uppercase tracking-widest">{label}</span>
                  {i < 3 && <div className="hidden sm:block w-px h-4 bg-white/15 ml-2" />}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
