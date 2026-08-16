"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, MapPin, Sparkles, Users, Utensils, LayoutList, BookOpen, Mic2 } from "lucide-react";

/** Animated counter that counts up when scrolled into view */
function AnimatedValue({ raw }: { raw: string }) {
  // Extract numeric part and suffix (e.g. "100+" → 100, "+")
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return <span>{raw}</span>;
  const end = parseInt(match[1], 10);
  const suffix = match[2] ?? "";

  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const duration = 1800;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end]);

  const display = end < 10 ? String(count).padStart(2, "0") : count;
  return <span ref={ref}>{display}{suffix}</span>;
}

interface ScheduleItem {
  time: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

interface DaySchedule {
  day: string;
  date: string;
  title: string;
  items: ScheduleItem[];
}

const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: "Ngày 01",
    date: "18/09/2026",
    title: "Khai mạc & Diễn đàn Kết nối Giao thương",
    items: [
      {
        time: "13:00 - 14:00",
        title: "Đón tiếp Đại biểu & Check-in Khách sạn May Plaza",
        desc: "Nhận phòng khách sạn, làm thủ tục đăng ký, phát thẻ đại biểu và bộ tài liệu Diễn đàn.",
      },
      {
        time: "14:00 - 14:30",
        title: "Lễ Khai mạc Diễn đàn SME Việt Nam 2026",
        desc: "Phát biểu khai mạc của Lãnh đạo UBND tỉnh Thái Nguyên & Chủ tịch TASME.",
        highlight: true,
      },
      {
        time: "14:30 - 17:00",
        title: "Phiên Diễn đàn: Giải pháp Mở rộng Thị trường & Chuyển đổi số",
        desc: "Tham luận từ các chuyên gia kinh tế hàng đầu, thảo luận cơ chế hỗ trợ doanh nghiệp vừa và nhỏ.",
      },
      {
        time: "18:00 - 21:00",
        title: "Tiệc Chào mừng (Welcome Dinner)",
        desc: "Giao lưu kết nối doanh nhân đầu xuân, thưởng thức ẩm thực trà & đặc sản Thái Nguyên.",
      },
    ],
  },
  {
    day: "Ngày 02",
    date: "19/09/2026",
    title: "B2B Matching - Xúc tiến Đầu tư & Gala Dinner",
    items: [
      {
        time: "08:00 - 11:30",
        title: "Phiên Kết nối Giao thương Trực tiếp (100+ B2B Meetings)",
        desc: "Tổ chức gặp gỡ 1:1 theo nhu cầu ngành nghề giữa các đại biểu doanh nghiệp toàn quốc.",
        highlight: true,
      },
      {
        time: "11:30 - 13:30",
        title: "Tiệc trưa Networking tại Nhà hàng May Plaza",
        desc: "Dùng bữa trưa và thảo luận cơ hội hợp tác kinh doanh.",
      },
      {
        time: "14:00 - 17:00",
        title: "Hội thảo Xúc tiến Đầu tư & Tham quan Triển lãm Gian hàng",
        desc: "Trải nghiệm khu gian hàng triển lãm sản phẩm tiêu biểu và dự án xúc tiến đầu tư các tỉnh.",
      },
      {
        time: "18:30 - 21:30",
        title: "GALA DINNER ĐẲNG CẤP - VẬN HỘI MỚI",
        desc: "Chương trình nghệ thuật đặc sắc, vinh danh nhà tài trợ, kết nối doanh nhân tỏa sáng.",
        highlight: true,
      },
    ],
  },
  {
    day: "Ngày 03",
    date: "20/09/2026",
    title: "Tham quan Thực địa Factory Visit & Bế mạc",
    items: [
      {
        time: "08:00 - 11:00",
        title: "Factory Visit: Tham quan Doanh nghiệp / Hợp tác xã tiêu biểu",
        desc: "Tham quan mô hình sản xuất nông nghiệp công nghệ cao, HTX Chè Thái Nguyên & nhà máy KCN.",
      },
      {
        time: "11:00 - 12:00",
        title: "Lễ Bế mạc Diễn đàn & Trao Biên bản Ghi nhớ Hợp tác (MOU)",
        desc: "Ký kết giao thương, trao giấy chứng nhận tham gia và tổng kết diễn đàn.",
        highlight: true,
      },
      {
        time: "12:00 - 13:00",
        title: "Check-out Khách sạn & Kết thúc Diễn đàn",
        desc: "Tiễn đoàn đại biểu, hoàn tất thủ tục trả phòng và bế mạc sự kiện.",
      },
    ],
  },
];

import { TimelineContent, DEFAULT_TIMELINE } from "@/constants/defaultContent";

export default function Timeline({ content }: { content?: TimelineContent }) {
  const badge = content?.badge || DEFAULT_TIMELINE.badge;
  const title = content?.title || DEFAULT_TIMELINE.title;
  const subtitle = content?.subtitle || DEFAULT_TIMELINE.subtitle;
  const days = content?.days && content.days.length > 0 ? content.days : DEFAULT_TIMELINE.days;
  const slots = content?.slots && content.slots.length > 0 ? content.slots : DEFAULT_TIMELINE.slots;

  const [activeTab, setActiveTab] = useState(0);

  const activeDay = days[activeTab] || days[0];
  const activeDayNumber = activeDay?.dayNumber ?? (activeTab + 1);
  const activeSlots = slots.filter((s) => s.dayNumber === activeDayNumber);

  return (
    <section id="timeline" className="py-20 bg-[#F4FBF7]">
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

        {/* Event Scale Summary — PREMIUM banner */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #071f18 0%, #0D3B2E 45%, #0a2d22 100%)",
          }}
        >
          {/* Animated rotating conic border */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-3xl z-0"
            style={{
              background:
                "conic-gradient(from var(--angle,0deg), transparent 65%, #22C55E 75%, #F59E0B 80%, #22C55E 85%, transparent 95%)",
              padding: "2px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
            animate={{ "--angle": ["0deg", "360deg"] } as never}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          {/* Background glow blobs */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-emerald-500/10 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-amber-500/10 blur-[60px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 rounded-full bg-emerald-700/10 blur-[50px]" />
          </div>

          {/* Dot pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Top gold accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent z-10" />

          <div className="relative z-10 px-6 pt-8 pb-6">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="flex items-center justify-center gap-3 mb-7"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-500/40" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-emerald-400 whitespace-nowrap">
                ✦ Quy mô sự kiện · 3 ngày sôi động ✦
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-500/40" />
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {[
                { icon: Users,      value: "100+", label: "Phiên B2B",      sub: "Kết nối 1:1 trực tiếp",  accent: "#22C55E" },
                { icon: Utensils,   value: "02",   label: "Gala Dinner",    sub: "Đẳng cấp & nghệ thuật",  accent: "#F59E0B" },
                { icon: LayoutList, value: "01",   label: "Diễn đàn chính", sub: "Quy mô quốc gia",         accent: "#22C55E" },
                { icon: BookOpen,   value: "05",   label: "Chuyên đề",      sub: "Nội dung chuyên sâu",     accent: "#F59E0B" },
                { icon: Mic2,       value: "20+",  label: "Diễn giả",       sub: "Chuyên gia hàng đầu",     accent: "#22C55E" },
              ].map(({ icon: Icon, value, label, sub, accent }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="relative flex flex-col items-center gap-3 rounded-2xl px-3 py-5 text-center cursor-default group"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  {/* Hover highlight */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "rgba(255,255,255,0.06)", boxShadow: `0 0 24px ${accent}22` }} />

                  {/* Icon ring */}
                  <div className="relative z-10">
                    <motion.div
                      className="absolute inset-0 rounded-2xl blur-lg"
                      style={{ backgroundColor: accent }}
                      animate={{ opacity: [0.15, 0.35, 0.15] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    />
                    <div
                      className="relative flex items-center justify-center w-12 h-12 rounded-2xl"
                      style={{ background: `${accent}22`, border: `1.5px solid ${accent}55` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: accent }} />
                    </div>
                  </div>

                  {/* Number */}
                  <motion.span
                    className="relative z-10 text-5xl font-black leading-none tracking-tight text-white"
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.4 + i * 0.1 }}
                  >
                    <AnimatedValue raw={value} />
                  </motion.span>

                  {/* Gold underline */}
                  <div className="relative z-10 w-8 h-[2px] rounded-full" style={{ backgroundColor: accent }} />

                  {/* Label */}
                  <span className="relative z-10 text-[12px] font-extrabold uppercase tracking-[0.18em] text-white/90 leading-tight">
                    {label}
                  </span>

                  {/* Sub-label */}
                  <span className="relative z-10 text-[11px] text-white/40 leading-snug">
                    {sub}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Bottom strip */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0 }}
              className="mt-7 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6"
            >
              <span className="text-[11px] text-white/35 tracking-widest uppercase">📅 18 – 20 / 09 / 2026</span>
              <div className="hidden sm:block w-px h-3 bg-white/20" />
              <span className="text-[11px] text-white/35 tracking-widest uppercase">📍 May Plaza Hotel, Thái Nguyên</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Day Tabs Switcher */}
        <div className="flex justify-center p-1.5 bg-white rounded-2xl border border-emerald-200 shadow-sm max-w-xl mx-auto gap-2">
          {days.map((dayItem, idx) => (
            <button
              key={dayItem.dayNumber || idx}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === idx
                  ? "bg-[#0D3B2E] text-white shadow-md"
                  : "text-slate-600 hover:text-[#0D3B2E] hover:bg-slate-50"
              }`}
            >
              <span>{dayItem.dayTitle || `Ngày ${dayItem.dayNumber}`}</span>
              <span
                className={`text-[11px] font-medium ${
                  activeTab === idx ? "text-[#F59E0B]" : "text-slate-400"
                }`}
              >
                {dayItem.dateText}
              </span>
            </button>
          ))}
        </div>

        {/* Active Schedule Panel */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-emerald-100 shadow-sme p-6 sm:p-10 space-y-8"
        >
          {/* Day Title */}
          <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                {activeDay?.dayTitle || `Ngày ${activeDay?.dayNumber}`} — {activeDay?.dateText}
              </span>
              {activeDay?.subTitle && (
                <h3
                  className="text-xl sm:text-2xl font-extrabold text-[#0D3B2E] mt-1"
                  style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                >
                  {activeDay.subTitle}
                </h3>
              )}
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg w-fit">
              <MapPin className="w-4 h-4 text-[#F59E0B]" /> {activeDay?.location || "May Plaza Hotel Thái Nguyên"}
            </div>
          </div>

          {/* Timeline list */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-200 space-y-8">
            {activeSlots.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Chưa có lịch trình cho ngày này.</p>
            ) : (
              activeSlots.map((item, idx) => (
                <div key={item.id || idx} className="relative group">
                  {/* Bullet node */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full border-2 bg-white transition-colors ${
                      item.highlight
                        ? "border-[#22C55E] bg-[#22C55E]"
                        : "border-slate-300"
                    }`}
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0D3B2E]">
                        <Clock className="w-3.5 h-3.5" /> {item.timeSlot}
                      </span>
                      {item.highlight && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          <Sparkles className="w-3 h-3 text-[#F59E0B]" /> Hoạt động trọng điểm
                        </span>
                      )}
                      {item.speaker && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                          👤 {item.speaker}
                        </span>
                      )}
                      {item.location && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                          📍 {item.location}
                        </span>
                      )}
                    </div>
                    <h4
                      className="text-lg font-bold text-[#0D3B2E] pt-1"
                      style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                    >
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

