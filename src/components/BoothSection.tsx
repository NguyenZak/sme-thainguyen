"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Maximize2, CheckCircle2, ArrowRight, Sparkles, X } from "lucide-react";

const BOOTH_INCLUSIONS = [
  "Mặt bằng gian tiêu chuẩn 3m x 3m theo sơ đồ Ban Tổ chức",
  "Vách ngăn, biển tên gian & hệ khung trưng bày chuyên nghiệp",
  "01 Bàn tiếp khách + 02 Ghế tiêu chuẩn + Hệ chiếu sáng & điện 220V",
  "Ổ cắm điện & kết nối Internet Wi-Fi tốc độ cao riêng khu vực",
  "Hiển thị logo & thông tin doanh nghiệp trên sơ đồ & catalogue Diễn đàn",
  "Hỗ trợ vận chuyển, sắp xếp hàng hóa ngày lắp đặt (18/9)",
];

import { BoothsContent } from "@/constants/defaultContent";

export default function BoothSection({ content }: { content?: any }) {
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState<number | null>(5);

  const handleSelectBooth = (num: number) => {
    setSelectedBooth(num);
  };

  return (
    <section id="booths" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            05 · GIAN HÀNG TRIỂN LÃM
          </span>
          <h2
            className="text-2xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            Thông tin &amp; đăng ký gian hàng
          </h2>
          <p className="text-sm sm:text-lg text-slate-700 leading-relaxed max-w-4xl">
            Khu triển lãm quy mô 100 gian hàng, hoạt động liên tục trong 03 ngày — không gian trưng bày sản phẩm, giải pháp, dịch vụ và kết nối trực tiếp với đại biểu, nhà mua hàng, nhà đầu tư.
          </p>
        </div>

        {/* Exhibition Info Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left 7 cols: Floor Plan Diagram Interactive Preview */}
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
                <span>Sơ đồ Mặt bằng (Nhấp để chọn gian)</span>
              </div>
              <button
                onClick={() => setFloorPlanOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-xs font-semibold text-white border border-emerald-700/50 transition-colors w-full sm:w-auto justify-center"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Phóng to Sơ đồ
              </button>
            </div>

            {/* Interactive Grid of booths - Mobile 2 Columns / Desktop 4 Columns */}
            <div className="bg-[#071F18] rounded-2xl p-4 sm:p-6 border border-emerald-900 space-y-4 sm:space-y-6 relative min-h-[300px] flex flex-col justify-between">
              {/* Stage indicator */}
              <div className="w-full bg-[#22C55E]/20 border border-[#22C55E]/40 text-center py-2.5 rounded-xl text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-emerald-300">
                SÂN KHẤU CHÍNH &amp; HỘI TRƯỜNG MAY PLAZA
              </div>

              {/* Grid of 12 interactive booth cards - 2 cols on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 py-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const num = i + 1;
                  const isTaken = num === 1 || num === 3 || num === 8;
                  const isVIP = num === 2 || num === 4;
                  const isSelected = selectedBooth === num;

                  return (
                    <button
                      key={i}
                      disabled={isTaken}
                      onClick={() => handleSelectBooth(num)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer min-h-[56px] flex flex-col justify-center items-center ${
                        isSelected
                          ? "bg-[#22C55E] border-white text-white shadow-lg ring-4 ring-amber-400 scale-105"
                          : isTaken
                          ? "bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                          : isVIP
                          ? "bg-amber-500/20 border-amber-400/50 text-amber-300 hover:bg-amber-500/30"
                          : "bg-emerald-950/80 border-emerald-800 text-emerald-200 hover:bg-emerald-900"
                      }`}
                    >
                      <span className="text-[10px] font-bold block uppercase">Gian #{num}</span>
                      <span className="text-xs font-extrabold block">3m x 3m</span>
                      <span className="text-[9px] font-semibold block mt-0.5">
                        {isSelected
                          ? "Đang chọn"
                          : isTaken
                          ? "Đã đặt"
                          : isVIP
                          ? "VIP"
                          : "Còn trống"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selection banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 border-t border-emerald-900 pt-3 gap-2">
                <span className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  {selectedBooth ? `Đang chọn: Gian #${selectedBooth}` : "Chạm chọn gian trên sơ đồ"}
                </span>
                <a
                  href="#register"
                  className="text-[#22C55E] hover:underline font-bold text-xs"
                >
                  Tiến hành giữ vị trí gian →
                </a>
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
                  const boothStr = selectedBooth ? `Gian #${selectedBooth < 10 ? "0" + selectedBooth : selectedBooth} (3m x 3m)` : "Gian #05 (3m x 3m)";
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("selectRegistrationTab", { detail: { tab: "booth", boothNumber: boothStr } }));
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-sm bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-md transition-all"
              >
                <span>Đăng ký gian {selectedBooth ? `#${selectedBooth}` : ""} ngay</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floor Plan Modal */}
        {floorPlanOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
              <button
                onClick={() => setFloorPlanOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <X className="w-6 h-6" />
              </button>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase">Mặt bằng 100 gian hàng</span>
                <h3 className="text-2xl font-bold text-[#0D3B2E]">Sơ đồ Khu vực Triển lãm May Plaza</h3>
              </div>

              <div className="bg-[#0B3026] text-[#0D3B2E] rounded-2xl p-6 sm:p-8 border border-emerald-800 space-y-6">
                <div className="w-full bg-[#22C55E] text-white text-center py-3 rounded-xl font-bold text-xs sm:text-sm tracking-widest uppercase">
                  KHU VỰC SÂN KHẤU CHÍNH (CAPACITY 500+ KHÁCH)
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                  {Array.from({ length: 16 }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const boothNum = idx + 1;
                        const boothStr = `Gian #${boothNum < 10 ? "0" + boothNum : boothNum} (3m x 3m)`;
                        setSelectedBooth(boothNum);
                        setFloorPlanOpen(false);
                        if (typeof window !== "undefined") {
                          window.dispatchEvent(new CustomEvent("selectRegistrationTab", { detail: { tab: "booth", boothNumber: boothStr } }));
                        }
                      }}
                      className="p-3 sm:p-4 rounded-xl border border-emerald-700 bg-emerald-950 text-center hover:border-amber-400 transition-colors"
                    >
                      <span className="text-xs font-extrabold text-amber-400 block">GIAN #{idx + 1}</span>
                      <span className="text-[11px] text-slate-300 block">3m x 3m</span>
                      <span className="text-[10px] text-emerald-300 font-semibold block mt-1">Chọn gian này →</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <a
                  href="#register"
                  onClick={() => {
                    setFloorPlanOpen(false);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("selectRegistrationTab", { detail: { tab: "booth" } }));
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-[#22C55E] text-white font-bold text-sm shadow"
                >
                  Tiến hành Đăng ký
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
