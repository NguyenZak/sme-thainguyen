"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormattedText from "@/components/ui/FormattedText";
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  Ticket,
  Store,
  Handshake,
  MapPin,
  FileText,
  PhoneCall,
  Search,
} from "lucide-react";

import { FaqItem, FaqContent, DEFAULT_FAQ_CONTENT } from "@/constants/defaultContent";

export default function FaqSection({ content }: { content?: FaqContent }) {
  const data = content || DEFAULT_FAQ_CONTENT;
  const faqList: FaqItem[] = Array.isArray(content?.items) ? content.items : DEFAULT_FAQ_CONTENT.items;
  const badge = data.badgeText || DEFAULT_FAQ_CONTENT.badgeText;
  const title = data.title || DEFAULT_FAQ_CONTENT.title;
  const subtitle = data.subtitle || DEFAULT_FAQ_CONTENT.subtitle;

  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqList.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (data.visible === false) return null;

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>{badge}</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            {title}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Filter Pills & Search Box */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "Tất cả câu hỏi", icon: Sparkles },
              { id: "ticket", label: "Vé tham gia", icon: Ticket },
              { id: "booth", label: "Gian hàng B2B", icon: Store },
              { id: "sponsor", label: "Gói tài trợ", icon: Handshake },
              { id: "general", label: "Chung & Địa điểm", icon: MapPin },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0D3B2E] text-white shadow-md shadow-emerald-900/20 scale-102"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm nhanh câu hỏi (vd: vé, gian hàng, tài trợ, hóa đơn)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              Không tìm thấy câu hỏi phù hợp với từ khóa &quot;{searchQuery}&quot;. Vui lòng liên hệ Hotline 0815.340.488 để được hỗ trợ trực tiếp!
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-emerald-50/40 border-emerald-300 shadow-md shadow-emerald-900/5"
                      : "bg-slate-50/70 hover:bg-slate-100/80 border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1 min-w-0">
                      {faq.badge && (
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          {faq.badge}
                        </span>
                      )}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "bg-emerald-600 text-white rotate-180"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-emerald-200/60 pt-3.5 space-y-3">
                          <p>{faq.answer}</p>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <a
                              href="#register"
                              onClick={() => {
                                if (typeof window !== "undefined") {
                                  window.dispatchEvent(
                                    new CustomEvent("selectRegistrationTab", {
                                      detail: {
                                        tab: faq.category === "sponsor" || faq.category === "booth" ? "sponsor" : "delegate",
                                      },
                                    })
                                  );
                                }
                              }}
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-300 px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all"
                            >
                              <FileText className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Đăng ký ngay</span>
                            </a>
                            <a
                              href="tel:0815340488"
                              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
                              <span>Hotline: 0815.340.488</span>
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
