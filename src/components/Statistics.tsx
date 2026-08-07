"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Handshake, CalendarDays, Wine, TrendingUp } from "lucide-react";

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
    <section className="relative -mt-2 sm:-mt-8 z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#0B3026] text-white rounded-2xl shadow-sme border border-emerald-800/60 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Stat 1: 100+ Business Matching */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-emerald-900/40 transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center mb-3 shadow-sm">
            <Handshake className="w-7 h-7 text-[#22C55E]" />
          </div>
          <div
            className="text-3xl sm:text-4xl font-extrabold text-[#22C55E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            <Counter end={100} suffix="+" formatZero={false} />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-emerald-200 mt-1 uppercase tracking-wider">
            Business Matching
          </p>
        </motion.div>

        {/* Stat 2: 03 Ngày diễn ra sự kiện */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-emerald-900/40 transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center mb-3 shadow-sm">
            <CalendarDays className="w-7 h-7 text-[#22C55E]" />
          </div>
          <div
            className="text-3xl sm:text-4xl font-extrabold text-[#22C55E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            <Counter end={3} formatZero={true} />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-emerald-200 mt-1 uppercase tracking-wider">
            Ngày diễn ra sự kiện
          </p>
        </motion.div>

        {/* Stat 3: 02 Đêm Gala Dinner */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-emerald-900/40 transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center mb-3 shadow-sm">
            <Wine className="w-7 h-7 text-[#F59E0B]" />
          </div>
          <div
            className="text-3xl sm:text-4xl font-extrabold text-[#22C55E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            <Counter end={2} formatZero={true} />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-emerald-200 mt-1 uppercase tracking-wider">
            Đêm Gala Dinner
          </p>
        </motion.div>

        {/* Stat 4: Hàng nghìn Cơ hội giao thương */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-emerald-900/40 transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center mb-3 shadow-sm">
            <TrendingUp className="w-7 h-7 text-[#22C55E]" />
          </div>
          <div
            className="text-3xl sm:text-4xl font-extrabold text-[#22C55E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            Hàng nghìn
          </div>
          <p className="text-xs sm:text-sm font-semibold text-emerald-200 mt-1 uppercase tracking-wider">
            Cơ hội giao thương
          </p>
        </motion.div>
      </div>
    </section>
  );
}
