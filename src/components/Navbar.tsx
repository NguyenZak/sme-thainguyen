"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Calendar } from "lucide-react";
import { NavbarContent, DEFAULT_NAVBAR } from "@/constants/defaultContent";

export default function Navbar({ content }: { content?: NavbarContent }) {
  const data = content || DEFAULT_NAVBAR;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0B3026]/95 backdrop-blur-md shadow-lg py-3 border-b border-emerald-800/40 text-white"
          : "bg-[#0B3026] py-4 text-white border-b border-emerald-900/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link href="#" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0 pr-1">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 shadow-sm border border-emerald-100 transition-transform group-hover:scale-105 shrink-0">
              <Image
                src={data.logoSrc}
                alt="Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="font-extrabold text-xs sm:text-base tracking-tight leading-tight text-white truncate"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                {data.brandName}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-emerald-300 truncate">
                {data.brandSub}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {data.navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-100 hover:text-emerald-300 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Header Action Button */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-200 font-medium pr-3 border-r border-emerald-700/50">
              <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{data.brandSub}</span>
            </div>
            <a
              href={data.ctaLink}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("selectRegistrationTab", { detail: { tab: "delegate" } }))}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <span>{data.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <a
              href={data.ctaLink}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("selectRegistrationTab", { detail: { tab: "delegate" } }))}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#22C55E] text-white whitespace-nowrap shrink-0 shadow-sm"
            >
              {data.mobileRegisterText}
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-emerald-900/60 border border-emerald-700/50 text-white shrink-0"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B3026] border-b border-emerald-800 px-4 pt-4 pb-6 mt-3 space-y-4 shadow-2xl">
          <div className="flex flex-col gap-2">
            {data.navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-4 rounded-xl text-base font-semibold text-slate-100 hover:bg-emerald-800/60 hover:text-emerald-300 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-emerald-800 flex flex-col gap-3">
            <a
              href={data.ctaLink}
              onClick={() => {
                setMobileMenuOpen(false);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("selectRegistrationTab", { detail: { tab: "delegate" } }));
                }
              }}
              className="w-full text-center py-3 rounded-xl font-bold bg-[#22C55E] text-white shadow-md"
            >
              {data.ctaText}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
