"use client";

import { useMemo } from "react";
import { BedDouble, Utensils, Users, Building2, Calendar, FileText, CheckCircle2, Sparkles } from "lucide-react";
import { RegistrationRecord, getFormCategory } from "./RegistrationsManager";

interface Props {
  registrations: RegistrationRecord[];
}

export default function LogisticsSummaryWidget({ registrations }: Props) {
  const summary = useMemo(() => {
    let totalDelegates = 0;
    let singleRoomsNeeded = 0;
    let sharedPeopleCount = 0;
    
    let stay1Night = 0;
    let stay2Nights = 0;
    let stay3Nights = 0;

    let day18LunchMeals = 0;
    let day19LunchMeals = 0;

    let b2bRequestCount = 0;
    let delegateFormCount = 0;
    let sponsorFormCount = 0;
    let boothFormCount = 0;

    registrations.forEach((r) => {
      const category = getFormCategory(r.ticket_type);
      if (category === "delegate") delegateFormCount++;
      if (category === "sponsor") sponsorFormCount++;
      if (category === "booth") boothFormCount++;

      const typeStr = (r.ticket_type || "").toLowerCase();
      const notesStr = (r.notes || "").toLowerCase();

      // Estimate delegate count from string if not parsed directly
      let delegatesInThisRecord = 2; // Default 1 package = 2 delegates
      if (typeStr.includes("1 đại biểu phát sinh") || typeStr.includes("+ 1 đb")) delegatesInThisRecord = 3;
      else if (typeStr.includes("2 đại biểu phát sinh") || typeStr.includes("+ 2 đb")) delegatesInThisRecord = 4;
      else if (typeStr.includes("3 đại biểu phát sinh")) delegatesInThisRecord = 5;
      else if (typeStr.includes("4 đại biểu phát sinh")) delegatesInThisRecord = 6;
      else if (typeStr.includes("5 đại biểu phát sinh")) delegatesInThisRecord = 7;

      totalDelegates += delegatesInThisRecord;

      // Room Type Calculation
      const isSingleRoom = typeStr.includes("phòng đơn") || typeStr.includes("single");
      if (isSingleRoom) {
        singleRoomsNeeded += 1;
      } else {
        sharedPeopleCount += delegatesInThisRecord;
      }

      // Stay duration
      if (typeStr.includes("1 đêm")) stay1Night += delegatesInThisRecord;
      else if (typeStr.includes("3 đêm")) stay3Nights += delegatesInThisRecord;
      else stay2Nights += delegatesInThisRecord; // Default 2 nights

      // Lunch meals calculation
      if (typeStr.includes("trưa 18") || typeStr.includes("18/09") || typeStr.includes("ăn trưa ngày 18")) {
        day18LunchMeals += delegatesInThisRecord;
      }
      if (typeStr.includes("trưa 19") || typeStr.includes("19/09") || typeStr.includes("ăn trưa ngày 19")) {
        day19LunchMeals += delegatesInThisRecord;
      }

      // B2B Networking Needs
      if (notesStr.length > 3 || typeStr.includes("b2b")) {
        b2bRequestCount++;
      }
    });

    const sharedRoomsNeeded = Math.ceil(sharedPeopleCount / 2);

    return {
      totalDelegates,
      singleRoomsNeeded,
      sharedPeopleCount,
      sharedRoomsNeeded,
      stay1Night,
      stay2Nights,
      stay3Nights,
      day18LunchMeals,
      day19LunchMeals,
      b2bRequestCount,
      delegateFormCount,
      sponsorFormCount,
      boothFormCount,
    };
  }, [registrations]);

  if (registrations.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-[#0B3026] via-[#0D3B2E] to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 space-y-6 relative overflow-hidden">
      {/* Decorative Accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-4 relative z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-extrabold border border-amber-500/30 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Bảng Thống Kê Hậu Cần Chuẩn Bị
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Tổng Hợp Xếp Phòng Khách Sạn &amp; Suất Ăn Phục Vụ
          </h2>
          <p className="text-xs text-emerald-200/90 mt-0.5">
            Dữ liệu tổng hợp thời gian thực từ các đơn đăng ký để Ban Quản lý đặt phòng May Plaza và báo bếp chuẩn bị.
          </p>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-700/80 p-3 rounded-2xl text-right shrink-0">
          <span className="text-[11px] text-emerald-300 font-medium block">Tổng Đại Biểu Dự Kiến:</span>
          <span className="text-2xl font-black text-amber-400 tracking-tight">{summary.totalDelegates} người</span>
        </div>
      </div>

      {/* 3 Main Logistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        
        {/* Card 1: Xếp phòng Khách sạn May Plaza */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/15 space-y-3">
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-amber-400" /> 1. Khách Sạn May Plaza
            </span>
            <span className="text-[11px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/30">
              {summary.singleRoomsNeeded + summary.sharedRoomsNeeded} phòng
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl">
              <span className="text-slate-200">🏨 Phòng đơn (Single Room):</span>
              <strong className="text-amber-400 text-sm">{summary.singleRoomsNeeded} phòng</strong>
            </div>
            <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl">
              <span className="text-slate-200">🏨 Ở ghép (Shared Room):</span>
              <strong className="text-emerald-300 text-sm">{summary.sharedRoomsNeeded} phòng ({summary.sharedPeopleCount} người)</strong>
            </div>
            <div className="pt-1 text-[11.5px] text-emerald-200/80 space-y-0.5 font-medium">
              <p>• Lưu trú 2 đêm (18 &amp; 19/09): <strong className="text-white">{summary.stay2Nights} đại biểu</strong></p>
              <p>• Lưu trú 3 đêm (18, 19 &amp; 20/09): <strong className="text-white">{summary.stay3Nights} đại biểu</strong></p>
            </div>
          </div>
        </div>

        {/* Card 2: Báo Bếp Suất Ăn Trưa & Gala */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/15 space-y-3">
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-emerald-400" /> 2. Báo Bếp Suất Ăn
            </span>
            <span className="text-[11px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-400/30">
              Catering
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl">
              <span className="text-slate-200">🍱 Suất ăn trưa Ngày 18/09:</span>
              <strong className="text-amber-400 text-sm">{summary.day18LunchMeals} suất</strong>
            </div>
            <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl">
              <span className="text-slate-200">🍱 Suất ăn trưa Ngày 19/09:</span>
              <strong className="text-amber-400 text-sm">{summary.day19LunchMeals} suất</strong>
            </div>
            <div className="pt-1 text-[11.5px] text-emerald-200/80 space-y-0.5 font-medium">
              <p>• Suất ăn trưa Ngày 20/09: <strong className="text-slate-300">0 suất (Không phục vụ)</strong></p>
              <p>• Tiệc Gala Dinner &amp; Buffet sáng: <strong className="text-white">{summary.totalDelegates} suất</strong></p>
            </div>
          </div>
        </div>

        {/* Card 3: Phân Loại Hồ Sơ & Nhu Cầu B2B */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/15 space-y-3">
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-400" /> 3. Kết Nối &amp; Phân Loại
            </span>
            <span className="text-[11px] bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full font-bold border border-blue-400/30">
              {registrations.length} đơn
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl">
              <span className="text-slate-200">🤝 Nhu cầu kết nối B2B Matching:</span>
              <strong className="text-blue-300 text-sm">{summary.b2bRequestCount} đơn vị</strong>
            </div>
            <div className="pt-1 text-[11.5px] text-emerald-200/80 space-y-1 font-medium">
              <div className="flex justify-between">
                <span>• Đơn Đăng ký Đại biểu:</span>
                <strong className="text-white">{summary.delegateFormCount} đơn</strong>
              </div>
              <div className="flex justify-between">
                <span>• Đơn Nhà Tài Trợ:</span>
                <strong className="text-purple-300">{summary.sponsorFormCount} đơn</strong>
              </div>
              <div className="flex justify-between">
                <span>• Đơn Đặt Gian Hàng:</span>
                <strong className="text-amber-300">{summary.boothFormCount} gian</strong>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
