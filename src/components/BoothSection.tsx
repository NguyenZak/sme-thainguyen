"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  LayoutGrid,
  Maximize2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { BoothsContent, DEFAULT_BOOTHS } from "@/constants/defaultContent";

const BOOTH_INCLUSIONS = [
  "Mặt bằng gian tiêu chuẩn 3m x 3m theo sơ đồ Ban Tổ chức",
  "Vách ngăn, biển tên gian & hệ khung trưng bày chuyên nghiệp",
  "01 Bàn tiếp khách + 02 Ghế tiêu chuẩn + Hệ chiếu sáng & điện 220V",
  "Ổ cắm điện & kết nối Internet Wi-Fi tốc độ cao riêng khu vực",
  "Hiển thị logo & thông tin doanh nghiệp trên sơ đồ & catalogue Diễn đàn",
  "Hỗ trợ vận chuyển, sắp xếp hàng hóa ngày lắp đặt (18/9)",
];

export default function BoothSection({ content }: { content?: BoothsContent }) {
  const badge = content?.badge || DEFAULT_BOOTHS.badge;
  const title = content?.title || DEFAULT_BOOTHS.title;
  const subtitle = content?.subtitle || DEFAULT_BOOTHS.subtitle;
  const mapImageUrl = content?.mapImageUrl || DEFAULT_BOOTHS.mapImageUrl || "/images/so-do.jpg";

  const [floorPlanOpen, setFloorPlanOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Reset zoom when modal opens/closes
  useEffect(() => {
    if (floorPlanOpen) {
      setZoomLevel(1);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [floorPlanOpen]);

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && floorPlanOpen) {
        setFloorPlanOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [floorPlanOpen]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => setZoomLevel(1);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  return (
    <section id="booths" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            {badge}
          </span>
          <h2
            className="text-2xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            {title}
          </h2>
          <p className="text-sm sm:text-lg text-slate-700 leading-relaxed max-w-4xl">
            {subtitle}
          </p>
        </div>

        {/* Exhibition Info Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left 7 cols: Floor Plan Diagram Image Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-[#0B3026] rounded-3xl p-5 sm:p-8 text-white relative overflow-hidden border border-emerald-800 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                <LayoutGrid className="w-5 h-5 text-[#F59E0B] shrink-0" />
                <span>Sơ đồ Mặt bằng Triển lãm (Nhấp để phóng to)</span>
              </div>
              <button
                onClick={() => setFloorPlanOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-xs font-bold text-white border border-emerald-700/60 transition-all w-full sm:w-auto justify-center shadow-sm hover:scale-105 active:scale-95"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> Phóng to Sơ đồ
              </button>
            </div>

            {/* Clickable Floor Plan Image Container */}
            <div
              onClick={() => setFloorPlanOpen(true)}
              className="group relative bg-[#071F18] rounded-2xl overflow-hidden border border-emerald-900/80 cursor-pointer transition-all duration-300 hover:border-emerald-500/50 shadow-inner"
            >
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#071F18] flex items-center justify-center p-2">
                <img
                  src={mapImageUrl}
                  alt="Sơ đồ gian hàng Diễn đàn Thái Nguyên SME"
                  className="w-full h-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
              </div>

              {/* Hover Badge Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-amber-400/30 shadow-lg">
                    <ZoomIn className="w-3.5 h-3.5" /> Chạm để zoom
                  </span>
                </div>
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Khu vực 100+ Gian hàng May Plaza
                  </span>
                  <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Xem full HD <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right 5 cols: Package Info & Price */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 bg-[#F4FBF7] rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sme space-y-6"
          >
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase">
                Gian hàng tiêu chuẩn
              </span>
              <h3
                className="text-2xl font-extrabold text-[#0D3B2E]"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                Gian hàng Triển lãm 3m x 3m
              </h3>
              <div className="flex items-baseline gap-2 pt-1">
                <span
                  className="text-3xl font-black text-[#22C55E]"
                  style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                >
                  8.500.000
                </span>
                <span className="text-sm font-bold text-slate-600">VNĐ / Gian</span>
              </div>
            </div>

            <hr className="border-emerald-200" />

            <div className="space-y-3">
              <p className="text-xs font-bold text-[#0D3B2E] uppercase tracking-wider">
                Gian hàng tiêu chuẩn – bao gồm:
              </p>
              <ul className="space-y-2.5 text-xs font-medium text-slate-700">
                {BOOTH_INCLUSIONS.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <a
                href="#register"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(
                      new CustomEvent("selectRegistrationTab", {
                        detail: { tab: "booth" },
                      })
                    );
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-sm bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-md transition-all hover:shadow-lg"
              >
                <span>Đăng ký gian hàng ngay</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floor Plan Lightbox / Interactive Zoom Modal */}
        <AnimatePresence>
          {floorPlanOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 overflow-hidden select-none"
            >
              {/* Modal Top Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-white z-10 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      Sơ đồ Chi tiết Mặt bằng Triển lãm
                    </h3>
                    <p className="text-[11px] text-slate-400 hidden sm:block">
                      Cuộn chuột hoặc bấm nút (+/-) để phóng to thu nhỏ. Click vào ảnh để toggle zoom.
                    </p>
                  </div>
                </div>

                {/* Zoom Toolbar & Close button */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 1}
                      title="Thu nhỏ"
                      className="p-2 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>

                    <span className="px-2 sm:px-3 text-xs font-bold text-amber-400 min-w-[50px] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>

                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 4}
                      title="Phóng to"
                      className="p-2 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    <div className="w-[1px] h-5 bg-slate-700 mx-1" />

                    <button
                      onClick={handleResetZoom}
                      title="Đặt lại 100%"
                      className="p-2 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setFloorPlanOpen(false)}
                    className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors"
                    title="Đóng sơ đồ (ESC)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Zoomable Image Viewport */}
              <div
                ref={viewportRef}
                onWheel={handleWheel}
                className="w-full flex-1 my-3 relative overflow-auto rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
              >
                <div
                  className="transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "center center",
                  }}
                  onClick={() => {
                    // Toggle zoom on click: if 1x -> 2x, if zoomed -> 1x
                    if (zoomLevel === 1) {
                      setZoomLevel(2);
                    } else {
                      setZoomLevel(1);
                    }
                  }}
                >
                  <img
                    src={mapImageUrl}
                    alt="Sơ đồ gian hàng Full HD"
                    className="max-w-none w-auto max-h-[75vh] object-contain rounded-xl shadow-2xl border border-slate-700/50"
                  />
                </div>
              </div>

              {/* Modal Bottom Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-white z-10 shadow-xl">
                <span className="text-xs text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Mặt bằng 100 gian hàng tiêu chuẩn & VIP tại Trung tâm Tổ chức Sự kiện May Plaza
                  </span>
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setFloorPlanOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex-1 sm:flex-none"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      setFloorPlanOpen(false);
                      if (typeof window !== "undefined") {
                        setTimeout(() => {
                          const regEl = document.getElementById("register");
                          if (regEl) {
                            regEl.scrollIntoView({ behavior: "smooth" });
                          }
                          window.dispatchEvent(
                            new CustomEvent("selectRegistrationTab", {
                              detail: { tab: "booth" },
                            })
                          );
                        }, 100);
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-none cursor-pointer"
                  >
                    <span>Tiến hành Đăng ký gian</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

