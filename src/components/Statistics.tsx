"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Handshake, CalendarDays, Wine, TrendingUp, Building2, Banknote, MapPin } from "lucide-react";

function Counter({ end, duration = 2.8, suffix = "", formatZero = true }: { end: number; duration?: number; suffix?: string; formatZero?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (!isInView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isInView, end, duration]);

  const display = formatZero && count < 10 && end < 10 ? `0${count}` : count;

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

export default function Statistics({ content }: { content?: any }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-12 mb-10 relative z-10">
      <div className="bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 p-5 sm:p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Stat 1: 34 tỉnh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mb-2 sm:mb-3 shadow-sm">
            <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-[#22C55E]" />
          </div>
          <div
            className="text-2xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            <Counter end={34} formatZero={true} />
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
            Tỉnh tham gia
          </p>
        </motion.div>

        {/* Stat 2: 200+ doanh nghiệp TN + ngoại tỉnh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mb-2 sm:mb-3 shadow-sm">
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#22C55E]" />
          </div>
          <div
            className="text-2xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            <Counter end={200} suffix="++" formatZero={false} />
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
            Doanh nghiệp TN + ngoại tỉnh
          </p>
        </motion.div>

        {/* Stat 3: 100 gian hàng */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mb-2 sm:mb-3 shadow-sm">
            <Handshake className="w-6 h-6 sm:w-7 sm:h-7 text-[#22C55E]" />
          </div>
          <div
            className="text-2xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            <Counter end={100} suffix="" formatZero={false} />
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
            Gian hàng triển lãm
          </p>
        </motion.div>

        {/* Stat 4: 50 MOU dự kiến */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mb-2 sm:mb-3 shadow-sm">
            <CalendarDays className="w-6 h-6 sm:w-7 sm:h-7 text-[#22C55E]" />
          </div>
          <div
            className="text-2xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            <Counter end={50} suffix="+" formatZero={false} />
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
            MOU dự kiến
          </p>
        </motion.div>

        {/* Stat 5: 10 quỹ đầu tư dự kiến */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mb-2 sm:mb-3 shadow-sm">
            <Banknote className="w-6 h-6 sm:w-7 sm:h-7 text-[#22C55E]" />
          </div>
          <div
            className="text-2xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            <Counter end={10} formatZero={false} />
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
            Quỹ đầu tư dự kiến
          </p>
        </motion.div>
      </div>
    </div>
  );
}
