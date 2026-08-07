"use client";

import { useState, useEffect } from "react";
import { Award, Ticket } from "lucide-react";
import { RegistrationContent, DEFAULT_REGISTRATION } from "@/constants/defaultContent";

export default function MobileStickyCTA({ content }: { content?: RegistrationContent }) {
  const data = content || DEFAULT_REGISTRATION;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past Hero (250px)
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  const handleSelectTab = (tabName: "delegate" | "sponsor" | "booth") => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("selectRegistrationTab", { detail: { tab: tabName } })
      );
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B3026]/95 backdrop-blur-md border-t border-emerald-800/60 p-3 shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <a
          href="#register"
          onClick={() => handleSelectTab("delegate")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-extrabold text-xs bg-[#22C55E] text-white shadow-md active:scale-95 transition-transform truncate"
        >
          <Ticket className="w-4 h-4 shrink-0" />
          <span className="truncate">{data.mobileDelegateLabel}</span>
        </a>

        <a
          href="#register"
          onClick={() => handleSelectTab("sponsor")}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs bg-[#F59E0B] text-slate-950 shadow-md active:scale-95 transition-transform shrink-0"
        >
          <Award className="w-4 h-4 shrink-0" />
          <span>{data.mobileSponsorLabel}</span>
        </a>
      </div>
    </div>
  );
}
