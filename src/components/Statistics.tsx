"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Handshake, CalendarDays, Wine, TrendingUp, Building2, Banknote, MapPin, Users, Store, Globe2 } from "lucide-react";
import { StatisticsContent, DEFAULT_STATISTICS } from "@/constants/defaultContent";

const ICON_MAP: Record<string, any> = {
  Users: Users,
  MapPin: MapPin,
  Globe2: Globe2,
  Calendar: CalendarDays,
  Store: Store,
  Handshake: Handshake,
  Building2: Building2,
  Banknote: Banknote,
};

function Counter({ end, duration = 2.5, suffix = "", formatZero = true }: { end: number; duration?: number; suffix?: string; formatZero?: boolean }) {
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

export default function Statistics({ content }: { content?: StatisticsContent }) {
  const items = content?.items && content.items.length > 0 ? content.items : DEFAULT_STATISTICS.items;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-12 mb-10 relative z-10">
      <div className={`bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 p-5 sm:p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${Math.min(items.length, 5)} gap-4 sm:gap-6`}>
        {items.map((item, idx) => {
          const IconComp = ICON_MAP[item.iconName || ""] || MapPin;

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: "easeOut" }}
              className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mb-2 sm:mb-3 shadow-sm">
                <IconComp className="w-6 h-6 sm:w-7 sm:h-7 text-[#22C55E]" />
              </div>
              <div
                className="text-2xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                <Counter end={item.value} suffix={item.suffix} formatZero={item.value < 10 && item.value > 0} />
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
                {item.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
