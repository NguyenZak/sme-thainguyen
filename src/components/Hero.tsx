"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import FormattedText from "@/components/ui/FormattedText";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Calendar, MapPin, Ticket, Award, ArrowRight, Clock } from "lucide-react";
import NetworkBackground from "./NetworkBackground";
import AddToCalendar from "./AddToCalendar";

import { HeroContent, DEFAULT_HERO } from "@/constants/defaultContent";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function Hero({ content }: { content?: HeroContent }) {
  const data = content || DEFAULT_HERO;
  const words = data.keywords && data.keywords.length > 0 ? data.keywords : DEFAULT_HERO.keywords;
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [tickerIndex, setTickerIndex] = useState(0);
  const tickers = data.tickerMessages && data.tickerMessages.length > 0 ? data.tickerMessages : DEFAULT_HERO.tickerMessages;

  useEffect(() => {
    if (!tickers || tickers.length === 0) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickers]);

  // GSAP Entrance Timeline Animation
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from(".hero-badge", { opacity: 0, y: -25, duration: 0.9 })
        .from(".hero-title", { opacity: 0, y: 35, duration: 1.1 }, "-=0.5")
        .from(".hero-countdown", { opacity: 0, scale: 0.92, duration: 0.9 }, "-=0.6")
        .from(".hero-details", { opacity: 0, y: 30, duration: 0.9 }, "-=0.5");
    },
    { scope: containerRef }
  );

  // Typewriter effect for headline dynamic keywords
  useEffect(() => {
    const currentWord = words[wordIndex % words.length] || words[0] || "";
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentText.length < currentWord.length) {
        timer = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, 85);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2400);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length - 1));
        }, 50);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, words]);

  useEffect(() => {
    const targetDate = new Date(data.targetDateISO || "2026-09-18T08:00:00+07:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data.targetDateISO]);

  return (
    <section ref={containerRef} className="relative min-h-0 sm:min-h-[95vh] flex items-center justify-center pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-[#0B3026]">
      {/* 3D Depth Layer Engine & Cyber Grid Background */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#071F18]">
        {/* 3D Perspective Horizon Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,197,94,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            transform: "perspective(600px) rotateX(60deg) translateY(-20%) scale(1.5)",
            transformOrigin: "center top",
          }}
        />

        {/* 3D Multi-Layered Particle Constellation & Parallax Canvas */}
        <NetworkBackground />

        {/* Ambient Top Light Beam Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#22C55E]/20 via-emerald-600/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071F18]/80 via-transparent to-[#0B3026]" />
      </div>

      {/* Hero Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Trust & Honor Pill Badges + Live Ticker Notification */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-badge flex flex-col items-center gap-3"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            {data.badgeText && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] sm:text-xs font-semibold text-emerald-300 shadow-md backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span>{data.badgeText}</span>
              </span>
            )}
            {data.honorBadgeText && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] sm:text-xs font-bold text-amber-300 shadow-md backdrop-blur-md">
                {data.honorBadgeText}
              </span>
            )}
          </div>

          {/* Dynamic Social Proof Live Ticker */}
          {tickers && tickers.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-xs font-medium text-emerald-200 backdrop-blur-md shadow-inner transition-all">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="animate-in fade-in transition-all duration-300">
                {tickers[tickerIndex % tickers.length]}
              </span>
            </div>
          )}
        </motion.div>

        {/* Main Headline (Typewriter Effect Animation) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }}
          className="hero-title space-y-3 sm:space-y-4"
        >
          <h1
            className="font-black text-white tracking-tight leading-normal sm:leading-relaxed uppercase"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            {data.titlePrefix !== undefined && data.titlePrefix !== "" && (
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-black mb-1">
                {data.titlePrefix}
              </span>
            )}
            {data.titleSuffix !== undefined && data.titleSuffix !== "" && (
              <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100/95 tracking-wide mt-1.5 mb-2">
                {data.titleSuffix}
              </span>
            )}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 inline-block text-3xl sm:text-5xl lg:text-6xl font-black min-h-[1.35em] pt-3 pb-2 px-1 leading-[1.25] sm:leading-[1.25]">
              {currentText}
              <span className="text-[#F59E0B] animate-pulse font-normal ml-0.5 opacity-90">|</span>
            </span>
          </h1>
          {data.englishTitle && (
            <p className="text-sm sm:text-xl font-medium text-emerald-200 tracking-wide">
              {data.englishTitle}
            </p>
          )}
          {data.sloganText && (
            <FormattedText
              content={data.sloganText}
              as="p"
              className="text-xs sm:text-lg text-slate-200 italic max-w-3xl mx-auto px-2"
            />
          )}
        </motion.div>

        {/* Live Countdown Timer (Mobile Grid Optimized) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="hero-countdown inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-6 bg-slate-950/60 border border-emerald-500/30 rounded-2xl px-4 sm:px-6 py-3 text-white backdrop-blur-md shadow-xl max-w-full"
        >
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider sm:pr-3 sm:border-r border-slate-800">
            <Clock className="w-4 h-4 animate-spin text-[#F59E0B]" />
            <span>{data.countdownLabel || "Đếm ngược sự kiện:"}</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-center">
            <div>
              <span className="text-lg sm:text-2xl font-black text-emerald-400 font-mono">
                {timeLeft.days}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase font-semibold">Ngày</span>
            </div>
            <span className="text-slate-600 font-bold">:</span>
            <div>
              <span className="text-lg sm:text-2xl font-black text-white font-mono">
                {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase font-semibold">Giờ</span>
            </div>
            <span className="text-slate-600 font-bold">:</span>
            <div>
              <span className="text-lg sm:text-2xl font-black text-white font-mono">
                {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase font-semibold">Phút</span>
            </div>
            <span className="text-slate-600 font-bold">:</span>
            <div>
              <span className="text-lg sm:text-2xl font-black text-amber-400 font-mono">
                {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase font-semibold">Giây</span>
            </div>
          </div>
        </motion.div>

        {/* Event Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="hero-details hero-glass rounded-2xl p-3 sm:p-4 max-w-fit mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 border border-emerald-500/30 text-left shadow-2xl"
        >
          <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-xl hero-glass-card min-w-[240px]">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-emerald-200 uppercase font-semibold">{data.dateLabel || "Thời gian"}</p>
              <p className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">{data.eventDateText || "18–20/09/2026"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-xl hero-glass-card">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-emerald-200 uppercase font-semibold">{data.venueLabel || "Địa điểm"}</p>
              <p className="text-xs sm:text-sm font-bold text-white whitespace-nowrap leading-tight">{data.venueText || "May Plaza Hotel, Thái Nguyên"}</p>
            </div>
          </div>
        </motion.div>

        {/* 3 Action Buttons - Stacked Full-Width on Mobile for Thumb Ergonomics */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 pb-4 sm:pb-6 w-full max-w-xl sm:max-w-none mx-auto relative z-50">
          {/* 1st Order Primary CTA: Delegate Registration */}
          {data.primaryCtaText && (
            <a
              id="cta-1"
              href={data.primaryCtaLink || "#register"}
              onClick={(e) => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("selectRegistrationTab", { detail: { tab: "delegate" } })
                  );
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-extrabold text-sm bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-xl shadow-emerald-950/60 transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
            >
              <Ticket className="w-4 h-4" />
              <span>{data.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          )}


          {/* 3rd Order Tertiary CTA: Sponsor Packages Prospectus */}
          {data.tertiaryCtaText && (
            <a
              id="cta-3"
              href={data.tertiaryCtaLink || "#sponsors"}
              onClick={(e) => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("selectRegistrationTab", { detail: { tab: "sponsor" } })
                  );
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-extrabold text-sm bg-slate-900/80 hover:bg-slate-950 text-white border border-emerald-500/40 backdrop-blur-md transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>{data.tertiaryCtaText}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
