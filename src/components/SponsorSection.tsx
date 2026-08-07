"use client";

import { motion } from "framer-motion";
import { Award, Download, CheckCircle2, Star, ArrowRight } from "lucide-react";

interface SponsorTier {
  name: string;
  badgeColor: string;
  borderAccent: string;
  price: string;
  popular?: boolean;
  perks: string[];
}

const SPONSOR_TIERS: SponsorTier[] = [
  {
    name: "Nhà tài trợ Chiến lược",
    badgeColor: "bg-purple-900 text-white font-extrabold",
    borderAccent: "border-purple-600 shadow-purple-100",
    price: "100.000.000 VNĐ",
    popular: true,
    perks: [
      "Vị trí Logo Chiến lược độc quyền trên toàn bộ ấn phẩm Diễn đàn & Backdrop",
      "Phát biểu 15 phút tại Lễ Khai mạc Diễn đàn SME 2026",
      "Khu vực Triển lãm VIP 02-03 gian hàng vị trí trung tâm sảnh",
      "10 Thẻ VIP Đại biểu tham dự trọn gói + Gala Dinner",
      "Bài viết PR độc quyền trên báo chí & Trang chủ Diễn đàn",
      "Chiếu Video quảng bá Doanh nghiệp tại màn hình LED chính",
    ],
  },
  {
    name: "Nhà tài trợ Kim Cương",
    badgeColor: "bg-[#0D3B2E] text-white font-bold",
    borderAccent: "border-emerald-600 shadow-emerald-100",
    price: "70.000.000 VNĐ",
    perks: [
      "Vị trí Logo Kim Cương trên toàn bộ ấn phẩm Diễn đàn & Backdrop",
      "Phát biểu 10 phút tại Lễ Khai mạc Diễn đàn SME 2026",
      "Khu vực Triển lãm VIP 02 gian hàng vị trí trung tâm sảnh",
      "05 Thẻ VIP Đại biểu tham dự trọn gói + 05 Đêm Gala Dinner",
      "Bài viết PR độc quyền trên báo chí & Trang chủ Diễn đàn",
      "Chiếu Video quảng bá Doanh nghiệp tại màn hình LED chính",
    ],
  },
  {
    name: "Nhà tài trợ Vàng",
    badgeColor: "bg-amber-500 text-slate-950 font-bold",
    borderAccent: "border-amber-300 shadow-amber-50",
    price: "50.000.000 VNĐ",
    perks: [
      "Vị trí Logo Nhà tài trợ Vàng trên backdrop & tài liệu sự kiện",
      "Khu vực Triển lãm 01 gian hàng tiêu chuẩn tại sảnh",
      "03 Thẻ Đại biểu tham dự trọn gói + 03 Đêm Gala Dinner",
      "Tuyên dương tặng Kỷ niệm chương tại Lễ Bế mạc",
      "Đăng tải thông tin quảng bá trên Fanpage & website TASME",
    ],
  },
  {
    name: "Nhà tài trợ Bạc",
    badgeColor: "bg-slate-700 text-white font-bold",
    borderAccent: "border-slate-300",
    price: "30.000.000 VNĐ",
    perks: [
      "Vị trí Logo Nhà tài trợ Bạc trên backdrop sự kiện",
      "02 Thẻ Đại biểu tham dự trọn gói + Gala Dinner",
      "Đặt 01 Standee quảng bá tại sảnh triển lãm",
      "Tuyên dương thương hiệu tại Lễ Khai mạc",
    ],
  },
  {
    name: "Nhà tài trợ Đồng",
    badgeColor: "bg-amber-800 text-white font-bold",
    borderAccent: "border-amber-200",
    price: "15.000.000 VNĐ",
    perks: [
      "Vị trí Logo Nhà tài trợ Đồng trên ấn phẩm tài liệu",
      "01 Thẻ Đại biểu tham dự trọn gói + Gala Dinner",
      "Quảng bá danh xưng trên các kênh truyền thông Diễn đàn",
    ],
  },
  {
    name: "Đơn vị Đồng hành",
    badgeColor: "bg-teal-700 text-white font-bold",
    borderAccent: "border-teal-300",
    price: "10.000.000 VNĐ",
    perks: [
      "Vị trí Logo Đơn vị Đồng hành trên ấn phẩm truyền thông phụ",
      "01 Thẻ Đại biểu tham dự trọn gói + Gala Dinner",
      "Trao chứng nhận Đơn vị Đồng hành tại Diễn đàn",
    ],
  },
];

import { SponsorsContent } from "@/constants/defaultContent";

export default function SponsorSection({ content }: { content?: any }) {
  const handleDownloadPDF = () => {
    alert("Đang tải Hồ sơ Mời Tài trợ SME Vietnam 2026 (PDF)...");
  };

  return (
    <section id="sponsors" className="py-20 bg-[#F4FBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            03 · THƯ MỜI TÀI TRỢ &amp; 04 · GÓI TÀI TRỢ
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            Các Gói Quyền lợi Đồng hành Tài trợ
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Khẳng định vị thế dẫn đầu, tiếp cận trực tiếp hơn 500+ doanh nhân &amp; lãnh đạo cấp cao toàn quốc.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-white text-[#0D3B2E] border border-emerald-200 shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#22C55E]" />
              <span>Tải Hồ sơ Mời tài trợ (PDF)</span>
            </button>
            <a
              href="#register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 shadow-md transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Đăng ký Tài trợ ngay</span>
            </a>
          </div>
        </motion.div>

        {/* Sponsor Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPONSOR_TIERS.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`bg-white rounded-2xl p-6 border ${tier.borderAccent} shadow-sme shadow-sme-hover flex flex-col justify-between relative overflow-hidden ${
                tier.popular ? "ring-2 ring-[#22C55E]" : ""
              }`}
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${tier.badgeColor}`}>
                      {tier.name}
                    </span>
                    {tier.popular && (
                      <span className="bg-[#22C55E] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 shadow-sm">
                        <Star className="w-3 h-3 fill-amber-300 stroke-none" /> Vị trí VIP
                      </span>
                    )}
                  </div>
                  <div className="pt-1">
                    <p className="text-2xl font-black text-[#0D3B2E]" style={{ fontFamily: "var(--font-wix-display), sans-serif" }}>
                      {tier.price}
                    </p>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <ul className="space-y-3">
                  {tier.perks.map((perk, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <a
                  href="#register"
                  onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("selectRegistrationTab", { detail: { tab: "sponsor", sponsorTier: tier.name } }))}
                  className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    tier.popular
                      ? "bg-[#22C55E] text-white hover:bg-[#16A34A] shadow-md"
                      : "bg-slate-100 text-[#0D3B2E] hover:bg-slate-200"
                  }`}
                >
                  <span>Chọn gói tài trợ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
