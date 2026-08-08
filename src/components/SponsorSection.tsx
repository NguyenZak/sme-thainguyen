"use client";

import { motion } from "framer-motion";
import FormattedText from "@/components/ui/FormattedText";
import {
  Award,
  Download,
  CheckCircle2,
  Star,
  ArrowRight,
  ShieldCheck,
  Building2,
  Handshake,
  Crown,
  Gem,
  Sparkles,
  Layers,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import {
  DEFAULT_SPONSORS,
  SponsorItem,
  SponsorPackageTier,
  SponsorPriorityCategory,
  SponsorMilestone,
  SponsorsContent,
} from "@/constants/defaultContent";

export default function SponsorSection({ content }: { content?: SponsorsContent }) {
  const data = content || DEFAULT_SPONSORS;
  const sponsorsList: SponsorItem[] = Array.isArray(content?.items)
    ? content.items
    : DEFAULT_SPONSORS.items;
  const packages: SponsorPackageTier[] = Array.isArray(content?.packages)
    ? content.packages
    : (DEFAULT_SPONSORS.packages || []);
  const priorityCategories: SponsorPriorityCategory[] = Array.isArray(content?.priorityCategories)
    ? content.priorityCategories
    : (DEFAULT_SPONSORS.priorityCategories || []);
  const milestones: SponsorMilestone[] = Array.isArray(content?.milestones)
    ? content.milestones
    : (DEFAULT_SPONSORS.milestones || []);

  const badge = data.badge || DEFAULT_SPONSORS.badge;
  const title = data.title || DEFAULT_SPONSORS.title;
  const subtitle = data.subtitle || DEFAULT_SPONSORS.subtitle;
  const prospectusPdfUrl = data.prospectusPdfUrl || DEFAULT_SPONSORS.prospectusPdfUrl;

  const coOrganizers = sponsorsList.filter((s) => s.tier === "co-organizer");
  const diamondSponsors = sponsorsList.filter((s) => s.tier === "diamond");
  const goldSponsors = sponsorsList.filter((s) => s.tier === "gold");
  const silverBronzeSponsors = sponsorsList.filter((s) => s.tier === "silver" || s.tier === "bronze");
  const companionSponsors = sponsorsList.filter((s) => s.tier === "companion" || !s.tier);

  const handleDownloadPDF = () => {
    const pdfUrl = prospectusPdfUrl || DEFAULT_SPONSORS.prospectusPdfUrl;
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      alert("Hồ sơ Mời tài trợ (PDF) đang được Ban Tổ chức TASME cập nhật bản mới nhất. Vui lòng liên hệ Hotline: 0815.340.488 để nhận trực tiếp!");
    }
  };

  const renderLogoTile = (
    item: SponsorItem,
    heightClass: string = "h-16 sm:h-20"
  ) => {
    const tileNode = (
      <div className={`relative ${heightClass} flex items-center justify-center p-2 group transition-all duration-300`}>
        {item.logoUrl ? (
          <Image
            src={item.logoUrl}
            alt={item.name}
            width={240}
            height={100}
            className={`${heightClass} w-auto object-contain filter group-hover:scale-108 transition-transform duration-300`}
          />
        ) : (
          <div className="flex items-center justify-center text-slate-800 font-extrabold text-sm sm:text-base text-center group-hover:text-emerald-700 transition-colors">
            <span className="truncate px-2">{item.name}</span>
          </div>
        )}
      </div>
    );

    if (item.websiteUrl && item.websiteUrl !== "#") {
      return (
        <a
          key={item.id}
          href={item.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
          className="block cursor-pointer"
        >
          {tileNode}
        </a>
      );
    }

    return (
      <div key={item.id} title={item.name}>
        {tileNode}
      </div>
    );
  };

  return (
    <section id="sponsors" className="py-20 bg-[#F4FBF7] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* ===================================================== */}
        {/* CORE: BẢNG CÁC GÓI QUYỀN LỢI ĐỒNG HÀNH TÀI TRỢ         */}
        {/* ===================================================== */}
        <div id="sponsor-packages" className="space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto space-y-4"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
              {badge}
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight mb-3"
              style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
            >
              {title}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto">
              {subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-white text-[#0D3B2E] border border-emerald-200 shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#22C55E]" />
                <span>Tải Hồ sơ Mời tài trợ (PDF)</span>
              </button>
              <a
                href="#register"
                onClick={() =>
                  typeof window !== "undefined" &&
                  window.dispatchEvent(
                    new CustomEvent("selectRegistrationTab", {
                      detail: { tab: "sponsor" },
                    })
                  )
                }
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 shadow-md transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Đăng ký Tài trợ ngay</span>
              </a>
            </div>
          </motion.div>

          {/* Sponsor Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((tier, idx) => (
              <motion.div
                key={tier.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`bg-white rounded-2xl p-6 border ${tier.borderAccent || "border-slate-200"} shadow-sme hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
                  tier.popular ? "ring-2 ring-[#22C55E]" : ""
                }`}
              >
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${tier.badgeColor || "bg-slate-900 text-white"}`}>
                        {tier.name}
                      </span>
                      {tier.popular && (
                        <span className="bg-[#22C55E] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 shadow-sm">
                          <Star className="w-3 h-3 fill-amber-300 stroke-none" /> Vị trí VIP
                        </span>
                      )}
                    </div>
                    <div className="pt-1">
                      <FormattedText
                        content={tier.price}
                        as="div"
                        className="text-xl sm:text-2xl font-black text-[#0D3B2E] leading-snug"
                        style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                      />
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
                    onClick={() =>
                      typeof window !== "undefined" &&
                      window.dispatchEvent(
                        new CustomEvent("selectRegistrationTab", {
                          detail: { tab: "sponsor", sponsorTier: tier.name },
                        })
                      )
                    }
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                      tier.popular
                        ? "bg-[#22C55E] text-white hover:bg-[#16A34A] shadow-md"
                        : "bg-slate-100 text-[#0D3B2E] hover:bg-slate-200"
                    }`}
                  >
                    <span>Chọn gói tài trợ này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* ===================================================== */}
        {/* SECTION 2: DANH SÁCH LOGO ĐƠN VỊ ĐỒNG HÀNH ĐÃ XÁC NHẬN */}
        {/* ===================================================== */}
        {sponsorsList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-10 pt-10 border-t border-emerald-800/20"
          >
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                ĐỐI TÁC ĐỒNG HÀNH ĐÃ XÁC NHẬN
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0D3B2E]">
                Các Doanh Nghiệp &amp; Đơn Vị Đồng Hành Cùng Diễn Đàn
              </h3>
            </div>

            {/* Group 1: Đơn vị Trực tiếp Chỉ đạo & Tổ chức */}
            {coOrganizers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4 text-center"
              >
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-900 bg-purple-100/60 px-4 py-1.5 rounded-full border border-purple-200">
                  <Crown className="w-4 h-4 text-purple-700" />
                  <span>ĐƠN VỊ TRỰC TIẾP CHỈ ĐẠO &amp; TỔ CHỨC</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 max-w-4xl mx-auto pt-2">
                  {coOrganizers.map((sp) => renderLogoTile(sp, "h-20 sm:h-24"))}
                </div>
              </motion.div>
            )}

            {/* Group 2: Nhà Tài Trợ Kim Cương */}
            {diamondSponsors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="space-y-4 text-center pt-4"
              >
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-950 bg-emerald-100/60 px-4 py-1.5 rounded-full border border-emerald-200">
                  <Gem className="w-4 h-4 text-emerald-600" />
                  <span>NHÀ TÀI TRỢ KIM CƯƠNG</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 max-w-5xl mx-auto pt-2">
                  {diamondSponsors.map((sp) => renderLogoTile(sp, "h-16 sm:h-20"))}
                </div>
              </motion.div>
            )}

            {/* Group 3: Nhà Tài Trợ Vàng */}
            {goldSponsors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4 text-center pt-4"
              >
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-950 bg-amber-100/60 px-4 py-1.5 rounded-full border border-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>NHÀ TÀI TRỢ VÀNG</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 max-w-5xl mx-auto pt-2">
                  {goldSponsors.map((sp) => renderLogoTile(sp, "h-14 sm:h-16"))}
                </div>
              </motion.div>
            )}

            {/* Group 4: Nhà Tài Trợ Bạc & Đồng */}
            {silverBronzeSponsors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="space-y-4 text-center pt-4"
              >
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-200/60 px-4 py-1.5 rounded-full border border-slate-300">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <span>NHÀ TÀI TRỢ BẠC &amp; ĐỒNG</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-5xl mx-auto pt-2">
                  {silverBronzeSponsors.map((sp) => renderLogoTile(sp, "h-12 sm:h-14"))}
                </div>
              </motion.div>
            )}

            {/* Group 5: Đơn Vị Đồng Hành & Bảo Trợ Truyền Thông */}
            {companionSponsors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-4 text-center pt-4"
              >
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-100/60 px-4 py-1.5 rounded-full border border-teal-200">
                  <Handshake className="w-4 h-4 text-teal-600" />
                  <span>ĐƠN VỊ ĐỒNG HÀNH &amp; BẢO TRỢ TRUYỀN THÔNG</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-6xl mx-auto pt-2">
                  {companionSponsors.map((sp) => renderLogoTile(sp, "h-12 sm:h-14"))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Banner kêu gọi tài trợ tiếp theo */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-[#0D3B2E] to-[#124e3d] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg border border-emerald-800"
        >
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Cơ Hội Khẳng Định Thương Hiệu</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold">
              Đưa thương hiệu của bạn tiếp cận 500+ Doanh nghiệp &amp; Lãnh đạo
            </h3>
            <p className="text-emerald-200 text-xs sm:text-sm max-w-xl">
              Trở thành Nhà tài trợ chính thức của Diễn đàn SME Việt Nam 2026 để nhận trọn bộ đặc quyền truyền thông và gian hàng VIP.
            </p>
          </div>
          <a
            href="#register"
            onClick={() =>
              typeof window !== "undefined" &&
              window.dispatchEvent(
                new CustomEvent("selectRegistrationTab", {
                  detail: { tab: "sponsor" },
                })
              )
            }
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Handshake className="w-4 h-4" />
            <span>Đăng Ký Đồng Hành Ngay</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
