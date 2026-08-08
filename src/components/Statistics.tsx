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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-10 mb-8 relative z-10">
      <div className="bg-[#0B3026] text-white rounded-2xl shadow-2xl border border-emerald-800/80 p-5 sm:p-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-emerald-800/60">
        {items.map((item, idx) => {
          const IconComp = ICON_MAP[item.iconName || ""] || Users;

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-2.5 sm:mb-3 shadow-inner">
                <IconComp className="w-6 h-6 sm:w-7 sm:h-7 text-[#F59E0B]" />
              </div>
              <div
                className="text-2xl sm:text-4xl font-black text-[#F59E0B] tracking-tight"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                <Counter end={item.value} suffix={item.suffix} formatZero={item.value < 10} />
              </div>
              <p className="text-[11px] sm:text-xs font-extrabold text-emerald-100 mt-1.5 uppercase tracking-wider">
                {item.label}
              </p>
              {item.subtext && (
                <p className="text-[10px] text-emerald-200/70 mt-1 line-clamp-1 max-w-[200px]">
                  {item.subtext}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
