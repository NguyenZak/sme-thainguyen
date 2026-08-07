"use client";

import { motion } from "framer-motion";
import {
  Users,
  Building2,
  TrendingUp,
  Share2,
  Globe2,
  Tv,
} from "lucide-react";

const BENEFITS = [
  {
    icon: <Users className="w-6 h-6 text-[#22C55E]" />,
    title: "100+ Phiên B2B Matching",
    description: "Kết nối giao thương 1:1 trực tiếp với các đối tác thương mại, nhà cung ứng và hệ thống phân phối lớn toàn quốc.",
  },
  {
    icon: <Building2 className="w-6 h-6 text-[#0D3B2E]" />,
    title: "Gặp gỡ Lãnh đạo Chính phủ",
    description: "Đối thoại trực tiếp với các cấp lãnh đạo Trung ương, Bộ ngành và UBND tỉnh Thái Nguyên về chính sách hỗ trợ SME.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-[#F59E0B]" />,
    title: "Xúc tiến Đầu tư & Dự án",
    description: "Tiếp cận các quỹ đầu tư, dự án công nghiệp, logistics và cơ hội hợp tác kinh doanh trọng điểm vùng Trung du Miền núi phía Bắc.",
  },
  {
    icon: <Share2 className="w-6 h-6 text-[#22C55E]" />,
    title: "Mở rộng Mạng lưới Doanh nhân",
    description: "Giao lưu, thắt chặt mối quan hệ kinh doanh với hơn 500+ CEO, Chủ tịch tập đoàn và chủ doanh nghiệp trên cả nước.",
  },
  {
    icon: <Globe2 className="w-6 h-6 text-[#0D3B2E]" />,
    title: "Cộng đồng SME Quốc gia",
    description: "Gia nhập hệ sinh thái doanh nghiệp lớn mạnh, tiếp cận cơ hội giao thương liên tỉnh và chuỗi giá trị toàn cầu.",
  },
  {
    icon: <Tv className="w-6 h-6 text-[#22C55E]" />,
    title: "Quảng bá Truyền thông Rộng khắp",
    description: "Thương hiệu doanh nghiệp xuất hiện trên các báo đài lớn (VTV, Thái Nguyên TV, VnExpress, Báo Doanh Nhân) và ấn phẩm Diễn đàn.",
  },
];

import { BenefitsContent } from "@/constants/defaultContent";

export default function Benefits({ content }: { content?: BenefitsContent }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            Quyền lợi Hội viên &amp; Đại biểu
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            Giá trị thực tế dành cho Doanh nghiệp tham dự
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Sự kiện không chỉ là cơ hội mở rộng thị trường mà còn là đòn bẩy nâng tầm thương hiệu và kết nối chuỗi cung ứng.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-[#F4FBF7] p-8 rounded-2xl border border-emerald-100 shadow-sme shadow-sme-hover flex flex-col gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3
                className="text-xl font-bold text-[#0D3B2E] group-hover:text-[#22C55E] transition-colors"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                {benefit.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
