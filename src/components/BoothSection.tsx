"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  LayoutGrid,
  CheckCircle2,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowRight,
  Move,
} from "lucide-react";
import { BoothsContent, DEFAULT_BOOTHS } from "@/constants/defaultContent";
import FormattedText from "@/components/ui/FormattedText";

const BOOTH_INCLUSIONS = [
  "Mặt bằng gian tiêu chuẩn diện tích 2m x 1,5m theo sơ đồ Ban Tổ chức",
  "01 Standee, Vách ngăn, biển tên gian & hệ khung trưng bày chuyên nghiệp",
  "Ổ cắm điện & kết nối Internet Wi-Fi tốc độ cao riêng khu vực",
  "02 Bàn + 02 Ghế tiêu chuẩn + Hệ chiếu sáng & điện 220V",
  "Hiển thị logo & thông tin doanh nghiệp trên sơ đồ & catalogue Diễn đàn",
  "Hỗ trợ vận chuyển, sắp xếp hàng hóa ngày lắp đặt (18/9)",
];

export default function BoothSection({ content }: { content?: BoothsContent }) {
  const badge = content?.badge || DEFAULT_BOOTHS.badge;
  const title = content?.title || DEFAULT_BOOTHS.title;
  const subtitle = content?.subtitle || DEFAULT_BOOTHS.subtitle;
  const mapImageUrl = content?.mapImageUrl || DEFAULT_BOOTHS.mapImageUrl || "/images/so-do.jpg";

  const boothPackageBadge = content?.boothPackageBadge || DEFAULT_BOOTHS.boothPackageBadge || "Gian hàng tiêu chuẩn";
  const boothPackageTitle = content?.boothPackageTitle || DEFAULT_BOOTHS.boothPackageTitle || "Gian hàng Triển lãm 2m x 1,5m";
  const boothPackageNote = content?.boothPackageNote || DEFAULT_BOOTHS.boothPackageNote || "Mỗi gian hàng BTC sẽ sắp sẵn 2 bàn + 2 ghế + 1 Standee";
  const priceFormatted = content?.priceFormatted || (content?.priceVND ? content.priceVND.toLocaleString("vi-VN") : DEFAULT_BOOTHS.priceFormatted || "8.500.000");
  const priceUnit = content?.priceUnit || DEFAULT_BOOTHS.priceUnit || "VNĐ / Gian";
  const inclusions = (content?.inclusions && content.inclusions.length > 0) ? content.inclusions : (DEFAULT_BOOTHS.inclusions || BOOTH_INCLUSIONS);
  const ctaText = content?.ctaText || DEFAULT_BOOTHS.ctaText || "Đăng ký gian hàng ngay";
  const modalTitle = content?.modalTitle || DEFAULT_BOOTHS.modalTitle || "Sơ đồ Chi tiết Mặt bằng Triển lãm";
  const modalSubtitle = content?.modalSubtitle || DEFAULT_BOOTHS.modalSubtitle || "Kéo giữ chuột để di chuyển (trái/phải/lên/xuống). Lăn chuột hoặc bấm +/- để zoom.";
  const modalBottomNote = content?.modalBottomNote || DEFAULT_BOOTHS.modalBottomNote || "Mặt bằng 100 gian hàng tiêu chuẩn & VIP tại Trung tâm Tổ chức Sự kiện May Plaza";
  const boothItems = (content?.items && content.items.length > 0) ? content.items : (DEFAULT_BOOTHS.items || []);

  const [floorPlanOpen, setFloorPlanOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);
  const touchDistRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when modal opens/closes
  useEffect(() => {
    if (floorPlanOpen) {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [floorPlanOpen]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(Number((prev + 0.5).toFixed(2)), 4.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const next = Math.max(Number((prev - 0.5).toFixed(2)), 1);
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleSetPreset = useCallback((preset: number) => {
    setZoomLevel(preset);
    if (preset === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, []);

  const handlePan = useCallback((dx: number, dy: number) => {
    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!floorPlanOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFloorPlanOpen(false);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePan(100, 0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handlePan(-100, 0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePan(0, 100);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handlePan(0, -100);
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === "0" || e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [floorPlanOpen, handlePan, handleZoomIn, handleZoomOut, handleResetZoom]);

  // Pointer drag events for smooth multi-directional panning (mouse & single touch/pen)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    startPosRef.current = { x: position.x, y: position.y };
    hasMovedRef.current = false;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMovedRef.current = true;
    }

    setPosition({
      x: startPosRef.current.x + dx,
      y: startPosRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {
        // ignore
      }
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const zoomDelta = e.deltaY < 0 ? 0.3 : -0.3;
    setZoomLevel((prev) => {
      const next = Math.min(Math.max(Number((prev + zoomDelta).toFixed(2)), 1), 4.5);
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  // Multi-touch pinch zoom for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchDistRef.current;
      touchDistRef.current = dist;
      setZoomLevel((prev) => {
        const next = Math.min(Math.max(Number((prev * factor).toFixed(2)), 1), 4.5);
        if (next === 1) {
          setPosition({ x: 0, y: 0 });
        }
        return next;
      });
    }
  };

  const handleTouchEnd = () => {
    touchDistRef.current = null;
  };

  // Toggle zoom on image click only if user did not drag
  const handleImageClick = () => {
    if (hasMovedRef.current) return;
    if (zoomLevel === 1) {
      setZoomLevel(2.2);
    } else {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
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
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            {title}
          </h2>
          <FormattedText
            content={subtitle}
            as="p"
            className="text-sm sm:text-lg text-slate-700 leading-relaxed max-w-4xl"
          />
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
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm mb-6">
              <LayoutGrid className="w-5 h-5 text-[#F59E0B] shrink-0" />
              <span>Sơ đồ Mặt bằng Triển lãm (Nhấp vào ảnh để xem chi tiết)</span>
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
                {boothPackageBadge}
              </span>
              <h3
                className="text-2xl font-extrabold text-[#0D3B2E]"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                {boothPackageTitle}
              </h3>
              {boothPackageNote && (
                <div className="p-3 bg-amber-500/10 border border-amber-400/40 rounded-xl text-amber-950 text-xs font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <FormattedText content={boothPackageNote} as="span" />
                </div>
              )}
              <div className="flex items-baseline gap-2 pt-1">
                <span
                  className="text-3xl font-black text-[#22C55E]"
                  style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                >
                  {priceFormatted}
                </span>
                <span className="text-sm font-bold text-slate-600">{priceUnit}</span>
              </div>
            </div>

            <hr className="border-emerald-200" />

            <div className="space-y-3">
              <p className="text-xs font-bold text-[#0D3B2E] uppercase tracking-wider">
                {boothPackageBadge} – bao gồm:
              </p>
              <ul className="space-y-2.5 text-xs font-medium text-slate-700">
                {inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    <FormattedText content={item} as="span" />
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
                        detail: { tab: "sponsor" },
                      })
                    );
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-sm bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-md transition-all hover:shadow-lg"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floor Plan Lightbox / Interactive Multi-directional Pan & Zoom Modal */}
        <AnimatePresence>
          {floorPlanOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-2 sm:p-5 overflow-hidden select-none"
            >
              {/* Modal Top Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl px-3 sm:px-4 py-2.5 text-white z-20 shadow-2xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                    <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-base font-bold text-white leading-tight flex items-center gap-2">
                      <span>{modalTitle}</span>
                      <span className="hidden md:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        <Move className="w-3 h-3" /> Kéo chuột di chuyển 4 chiều
                      </span>
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
                      {modalSubtitle}
                    </p>
                  </div>
                </div>

                {/* Zoom Toolbar & Preset buttons & Close */}
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  {/* Preset quick zoom buttons */}
                  <div className="hidden lg:flex items-center bg-slate-800/80 rounded-xl p-0.5 border border-slate-700/80 text-[11px] font-semibold">
                    {[1, 1.5, 2, 3].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handleSetPreset(preset)}
                        className={`px-2 py-1 rounded-lg transition-all ${
                          zoomLevel === preset
                            ? "bg-emerald-600 text-white font-bold shadow-sm"
                            : "text-slate-300 hover:text-white hover:bg-slate-700"
                        }`}
                      >
                        {preset * 100}%
                      </button>
                    ))}
                  </div>

                  {/* Main Zoom In/Out/Reset Box */}
                  <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 1}
                      title="Thu nhỏ (-)"
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                    >
                      <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    <span className="px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold text-amber-400 min-w-[45px] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>

                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 4.5}
                      title="Phóng to (+)"
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                    >
                      <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    <div className="w-[1px] h-4 bg-slate-700 mx-1" />

                    <button
                      onClick={handleResetZoom}
                      title="Đặt lại vị trí ban đầu (Phím 0 hoặc R)"
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Về giữa</span>
                    </button>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setFloorPlanOpen(false)}
                    className="p-2 sm:p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors flex items-center justify-center cursor-pointer"
                    title="Đóng sơ đồ (ESC)"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Main Pannable & Zoomable Image Viewport */}
              <div
                ref={viewportRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`w-full flex-1 my-2 relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 flex items-center justify-center touch-none select-none ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{ touchAction: "none" }}
              >
                {/* Background grid pattern indicating canvas */}
                <div
                  className="absolute inset-0 opacity-[0.07] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                  }}
                />

                {/* Zoomable & Pannable Image Canvas */}
                <div
                  onClick={handleImageClick}
                  className="will-change-transform max-w-full max-h-full flex items-center justify-center select-none"
                  style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${zoomLevel})`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.15s ease-out",
                  }}
                >
                  <img
                    src={mapImageUrl}
                    alt="Sơ đồ gian hàng Full HD"
                    draggable={false}
                    className="max-w-none w-auto max-h-[72vh] object-contain rounded-xl shadow-2xl border border-slate-700/60 pointer-events-none select-none"
                  />
                </div>
              </div>

              {/* Modal Bottom Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl px-3 sm:px-4 py-2.5 text-white z-20 shadow-xl">
                <span className="text-xs text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="line-clamp-1">
                    {modalBottomNote}
                  </span>
                </span>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setFloorPlanOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex-1 sm:flex-none cursor-pointer"
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
                              detail: { tab: "sponsor" },
                            })
                          );
                        }, 100);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-none cursor-pointer"
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

