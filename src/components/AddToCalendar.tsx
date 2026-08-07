"use client";

import { useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";

interface AddToCalendarProps {
  buttonText?: string;
  className?: string;
  variant?: "hero" | "outline" | "compact";
}

export default function AddToCalendar({
  buttonText = "Thêm vào Lịch",
  className = "",
  variant = "hero",
}: AddToCalendarProps) {
  const [open, setOpen] = useState(false);

  const eventTitle = "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026";
  const eventDetails =
    "Sự kiện xúc tiến thương mại cấp quốc gia quy tụ 500+ Doanh nghiệp, 100+ Gian hàng triển lãm & 50+ phiên B2B Matching.";
  const eventLocation = "May Plaza Hotel Thai Nguyen, 668 Phan Đình Phùng, TP. Thái Nguyên";
  const startDateISO = "20260918T080000";
  const endDateISO = "20260920T170000";

  const isBrowser = typeof window !== "undefined";
  const userAgent = isBrowser ? navigator.userAgent || "" : "";
  const isIOS = isBrowser && /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isAndroid = isBrowser && /Android/.test(userAgent);

  const defaultCalendarOption: "google" | "apple" | "menu" = isAndroid
    ? "google"
    : isIOS
    ? "apple"
    : "menu";

  // Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=${startDateISO}/${endDateISO}&details=${encodeURIComponent(
    eventDetails
  )}&location=${encodeURIComponent(eventLocation)}`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SME Vietnam 2026//NONSGML Event Calendar//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${eventTitle}`,
    `DESCRIPTION:${eventDetails}`,
    `LOCATION:${eventLocation}`,
    `DTSTART:20260918T010000Z`,
    `DTEND:20260920T100000Z`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const handleAppleCalendar = () => {
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  };

  const openGoogleCalendar = () => {
    window.open(googleCalendarUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const handlePrimaryClick = () => {
    if (!isBrowser) {
      setOpen(!open);
      return;
    }

    if (defaultCalendarOption === "google") {
      openGoogleCalendar();
    } else if (defaultCalendarOption === "apple") {
      handleAppleCalendar();
    } else {
      setOpen(!open);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={handlePrimaryClick}
        className={`inline-flex items-center gap-2 font-bold transition-all cursor-pointer ${
          variant === "hero"
            ? "px-5 py-2.5 rounded-full text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-emerald-200 border border-emerald-500/30 backdrop-blur-sm"
            : variant === "compact"
            ? "px-3 py-1.5 rounded-lg text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200"
            : "px-5 py-2.5 rounded-full text-xs sm:text-sm bg-white text-[#0D3B2E] border border-emerald-200 shadow-sm hover:shadow"
        }`}
      >
        <Calendar className="w-4 h-4 text-[#F59E0B]" />
        <span>{buttonText}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full mb-2 right-0 sm:left-0 w-60 bg-white rounded-2xl shadow-2xl border border-emerald-200 p-2.5 z-[100] text-slate-900 animate-in fade-in slide-in-from-bottom-2">
            <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Chọn loại lịch</p>
              <p className="mt-1 text-[10px] text-slate-500">Nút sẽ chọn tự động theo thiết bị của bạn nếu có thể.</p>
            </div>
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-50 hover:text-emerald-950 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Google Calendar</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
