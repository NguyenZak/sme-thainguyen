"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, ExternalLink, Move } from "lucide-react";

import { FooterContent } from "@/constants/defaultContent";

export default function Footer({ content }: { content?: any }) {
  const [isMapInteractive, setIsMapInteractive] = useState(true);

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Organizer Brand (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-white p-1 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="TASME Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <h3
                  className="text-base font-extrabold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                >
                  TASME THÁI NGUYÊN
                </h3>
                <p className="text-xs text-[#F4B400] font-semibold">
                  Hiệp hội Doanh nghiệp nhỏ và vừa tỉnh Thái Nguyên
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Ban tổ chức Diễn đàn Kết Nối Giao Thương SME Việt Nam 2026 — Đơn vị đồng hành cùng sự phát triển bền vững và hội nhập quốc tế của cộng đồng doanh nghiệp vừa và nhỏ Việt Nam.
            </p>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F4B400] shrink-0 mt-0.5" />
                <span>
                  <strong>Địa điểm sự kiện:</strong> May Plaza Hotel, Số 668 Phan Đình Phùng, Phường Đồng Quang, TP. Thái Nguyên, Việt Nam
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0B5ED7] shrink-0" />
                <span>
                  <strong>Hotline Ban tổ chức:</strong> 0815 340 488 / 0912 888 999
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#0B5ED7] shrink-0" />
                <span>
                  <strong>Email:</strong> contact@tasmethainguyen.vn
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#F4B400] shrink-0" />
                <span>
                  <strong>Website chính thức:</strong>{" "}
                  <a
                    href="https://tasmethainguyen.vn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    https://tasmethainguyen.vn
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4
              className="text-sm font-bold text-slate-200 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
            >
              Điều hướng Sự kiện
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Giới thiệu Diễn đàn
                </a>
              </li>
              <li>
                <a href="#timeline" className="hover:text-white transition-colors">
                  Chương trình 03 ngày (18-20/09)
                </a>
              </li>
              <li>
                <a href="#sponsors" className="hover:text-white transition-colors">
                  Gói Nhà tài trợ (Kim Cương / Vàng / Bạc / Đồng)
                </a>
              </li>
              <li>
                <a href="#booths" className="hover:text-white transition-colors">
                  Sơ đồ &amp; Đăng ký Gian hàng Triển lãm
                </a>
              </li>
              <li>
                <a href="#register" className="hover:text-white transition-colors">
                  Cổng Đăng ký Đại biểu Trực tuyến
                </a>
              </li>
            </ul>

            <div className="pt-3 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Theo dõi kênh truyền thông:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-400 transition-all"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-400 font-bold text-xs transition-all"
                  aria-label="Zalo"
                >
                  Zalo
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-red-400 hover:border-red-400 transition-all"
                  aria-label="Youtube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Interactive Map (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4
                className="text-sm font-bold text-slate-200 uppercase tracking-wider"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                Bản đồ May Plaza Hotel
              </h4>
              <a
                href="https://www.google.com/maps/place/May+Plaza+Hotel/@21.5782896,105.8327195,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#22C55E] hover:underline flex items-center gap-1 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-full shadow-sm"
              >
                Mở Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Map Canvas Wrapper */}
            <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-emerald-800 bg-[#071F18] shadow-lg group">
              <iframe
                title="May Plaza Hotel Thai Nguyen Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.8715916488604!2d105.8327195!3d21.578289599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313526d9c181fb37%3A0x6b8f9dc1b97be78d!2sMay%20Plaza%20Hotel!5e1!3m2!1svi!2s!4v1786076645684!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className={`w-full h-full transition-all duration-300 ${
                  isMapInteractive ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-85"
                }`}
              />

              {/* Mobile/Desktop Pan Mode Toggle Overlay Pill */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none px-2">
                <button
                  type="button"
                  onClick={() => setIsMapInteractive((prev) => !prev)}
                  className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/90 text-white text-[11px] font-bold border border-emerald-500/50 shadow-md backdrop-blur-md hover:bg-slate-900 cursor-pointer"
                >
                  <Move className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>{isMapInteractive ? "Bản đồ đang bật di chuyển" : "Bấm để bật di chuyển"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 TASME THÁI NGUYÊN. All rights reserved.</p>
          <p>
            Diễn đàn Kết Nối Giao Thương SME Việt Nam 2026 • 18–20/09/2026
          </p>
        </div>
      </div>
    </footer>
  );
}
