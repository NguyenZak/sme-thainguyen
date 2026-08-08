"use client";

import { motion } from "framer-motion";
import {
  Users,
  Building2,
  TrendingUp,
  Globe2,
  Tv,
  Handshake,
  Award,
  Star,
  Zap,
  ShieldCheck,
  Briefcase,
  BarChart2,
  Store,
  Landmark,
  Megaphone,
  Lightbulb,
  Target,
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react";

import { BenefitsContent } from "@/constants/defaultContent";

// ── Icon resolver (matches CMS ICON_OPTIONS) ─────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Building2,
  TrendingUp,
  Globe2,
  Tv,
  Handshake,
  Award,
  Star,
  Zap,
  ShieldCheck,
  Briefcase,
  BarChart2,
  Store,
  Landmark,
  Megaphone,
  Lightbulb,
  Target,
  CircleDollarSign,
};

// Tier coloring by index (cycles if more than 3 tiers)
const TIER_STYLES = [
  {
    iconBg: "bg-emerald-50 border-emerald-200",
    iconColor: "text-[#22C55E]",
    accent: "group-hover:text-[#22C55E]",
    glow: "group-hover:shadow-[0_0_24px_4px_rgba(34,197,94,0.18)]",
  },
  {
    iconBg: "bg-[#0D3B2E]/5 border-[#0D3B2E]/20",
    iconColor: "text-[#0D3B2E]",
    accent: "group-hover:text-[#0D3B2E]",
    glow: "group-hover:shadow-[0_0_24px_4px_rgba(13,59,46,0.12)]",
  },
  {
    iconBg: "bg-amber-50 border-amber-200",
    iconColor: "text-[#F59E0B]",
    accent: "group-hover:text-[#F59E0B]",
    glow: "group-hover:shadow-[0_0_24px_4px_rgba(245,158,11,0.18)]",
  },
];

function BenefitCard({
  title,
  description,
  iconName,
  badge,
  idx,
  delay,
}: {
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  idx: number;
  delay: number;
}) {
  const Icon = ICON_MAP[iconName] ?? Star;
  const tier = TIER_STYLES[idx % TIER_STYLES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={`relative bg-[#F4FBF7] p-8 rounded-2xl border border-emerald-100 shadow-sme flex flex-col gap-4 group transition-all duration-300 ${tier.glow}`}
    >
      {/* Badge top-right */}
      {badge && (
        <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-200 rounded-full px-2 py-0.5 bg-white">
          {badge}
        </span>
      )}

      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.12, rotate: 6 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-sm ${tier.iconBg}`}
      >
        <Icon className={`w-6 h-6 ${tier.iconColor}`} />
      </motion.div>

      {/* Text */}
      <h3
        className={`text-xl font-bold text-[#0D3B2E] transition-colors duration-200 ${tier.accent}`}
        style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
      >
        {title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-[#22C55E] to-transparent"
        initial={{ width: 0 }}
        whileInView={{ width: "60%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
      />
    </motion.div>
  );
}

export default function Benefits({ content }: { content?: BenefitsContent }) {
  // Use CMS data if available, else fall back to hardcoded defaults
  const items = content?.items ?? DEFAULT_ITEMS;
  const title = content?.title ?? "Giá trị thực tế dành cho Doanh nghiệp tham dự";
  const subtitle =
    content?.subtitle ??
    "Sự kiện không chỉ là cơ hội mở rộng thị trường mà còn là đòn bẩy nâng tầm thương hiệu và kết nối chuỗi cung ứng.";
  const badge = content?.badge ?? "Quyền lợi Hội viên & Đại biểu";

  // Split into rows: first N-remainder fill the top grid (multiples of 3)
  // Last row: remainder cards centered
  const PER_ROW = 3;
  const remainder = items.length % PER_ROW;
  const topItems = remainder === 0 ? items : items.slice(0, items.length - remainder);
  const bottomItems = remainder === 0 ? [] : items.slice(items.length - remainder);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
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
          <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Top rows — full grid of 3 */}
        {topItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topItems.map((item, i) => (
              <BenefitCard
                key={item.id || i}
                idx={i}
                delay={i * 0.1}
                title={item.title}
                description={item.description}
                iconName={item.iconName}
                badge={item.badge}
              />
            ))}
          </div>
        )}

        {/* Bottom row — centered remainder */}
        {bottomItems.length > 0 && (
          <div
            className={`grid grid-cols-1 gap-6 ${
              bottomItems.length === 1
                ? "md:w-1/2 lg:w-1/3 mx-auto"
                : bottomItems.length === 2
                ? "md:grid-cols-2 lg:w-2/3 mx-auto"
                : "md:grid-cols-3"
            }`}
          >
            {bottomItems.map((item, i) => (
              <BenefitCard
                key={item.id || i}
                idx={topItems.length + i}
                delay={0.3 + i * 0.1}
                title={item.title}
                description={item.description}
                iconName={item.iconName}
                badge={item.badge}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Hardcoded fallback (used when CMS has no data) ───────────────────────────
const DEFAULT_ITEMS = [
  {
    id: "ben-1",
    iconName: "Users",
    title: "Kết nối trực tiếp với 500+ CEO",
    description:
      "Tham gia sự kiện cùng mạng lưới doanh nhân cấp cao và mở rộng quan hệ với các Chủ tịch, Tổng giám đốc hàng đầu.",
    badge: "Networking VIP",
  },
  {
    id: "ben-2",
    iconName: "Building2",
    title: "Đăng ký 100+ phiên B2B",
    description:
      "Đặt lịch gặp gỡ trực tiếp trong hơn 100 phiên B2B Matching để tìm kiếm khách hàng, nhà cung ứng và đối tác tiềm năng.",
    badge: "B2B Matching",
  },
  {
    id: "ben-3",
    iconName: "TrendingUp",
    title: "Tiếp cận Quỹ đầu tư",
    description:
      "Gặp gỡ các quỹ đầu tư và nhà tài trợ chiến lược, mở ra cơ hội kêu gọi vốn và hợp tác phát triển dự án.",
    badge: "Investment",
  },
  {
    id: "ben-4",
    iconName: "Globe2",
    title: "Tham gia 3 Gala Networking",
    description:
      "Tham dự ba đêm Gala Networking cao cấp để mở rộng kết nối, đàm phán hợp tác và gia tăng nhận diện thương hiệu.",
    badge: "Gala Dinner",
  },
  {
    id: "ben-5",
    iconName: "Tv",
    title: "Truyền thông trên Báo chí",
    description:
      "Doanh nghiệp được xuất hiện trên các kênh báo chí đối tác của sự kiện và truyền thông rộng rãi trước, trong và sau diễn đàn.",
    badge: "Media",
  },
];
