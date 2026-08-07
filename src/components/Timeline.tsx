"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Sparkles } from "lucide-react";

interface ScheduleItem {
  time: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

interface DaySchedule {
  day: string;
  date: string;
  title: string;
  items: ScheduleItem[];
}

const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: "Ngày 01",
    date: "18/09/2026",
    title: "Khai mạc & Diễn đàn Kết nối Giao thương",
    items: [
      {
        time: "13:00 - 14:00",
        title: "Đón tiếp Đại biểu & Check-in Khách sạn May Plaza",
        desc: "Nhận phòng khách sạn, làm thủ tục đăng ký, phát thẻ đại biểu và bộ tài liệu Diễn đàn.",
      },
      {
        time: "14:00 - 14:30",
        title: "Lễ Khai mạc Diễn đàn SME Việt Nam 2026",
        desc: "Phát biểu khai mạc của Lãnh đạo UBND tỉnh Thái Nguyên & Chủ tịch TASME.",
        highlight: true,
      },
      {
        time: "14:30 - 17:00",
        title: "Phiên Diễn đàn: Giải pháp Mở rộng Thị trường & Chuyển đổi số",
        desc: "Tham luận từ các chuyên gia kinh tế hàng đầu, thảo luận cơ chế hỗ trợ doanh nghiệp vừa và nhỏ.",
      },
      {
        time: "18:00 - 21:00",
        title: "Tiệc Chào mừng (Welcome Dinner)",
        desc: "Giao lưu kết nối doanh nhân đầu xuân, thưởng thức ẩm thực trà & đặc sản Thái Nguyên.",
      },
    ],
  },
  {
    day: "Ngày 02",
    date: "19/09/2026",
    title: "B2B Matching - Xúc tiến Đầu tư & Gala Dinner",
    items: [
      {
        time: "08:00 - 11:30",
        title: "Phiên Kết nối Giao thương Trực tiếp (100+ B2B Meetings)",
        desc: "Tổ chức gặp gỡ 1:1 theo nhu cầu ngành nghề giữa các đại biểu doanh nghiệp toàn quốc.",
        highlight: true,
      },
      {
        time: "11:30 - 13:30",
        title: "Tiệc trưa Networking tại Nhà hàng May Plaza",
        desc: "Dùng bữa trưa và thảo luận cơ hội hợp tác kinh doanh.",
      },
      {
        time: "14:00 - 17:00",
        title: "Hội thảo Xúc tiến Đầu tư & Tham quan Triển lãm Gian hàng",
        desc: "Trải nghiệm khu gian hàng triển lãm sản phẩm tiêu biểu và dự án xúc tiến đầu tư các tỉnh.",
      },
      {
        time: "18:30 - 21:30",
        title: "GALA DINNER ĐẲNG CẤP - VẬN HỘI MỚI",
        desc: "Chương trình nghệ thuật đặc sắc, vinh danh nhà tài trợ, kết nối doanh nhân tỏa sáng.",
        highlight: true,
      },
    ],
  },
  {
    day: "Ngày 03",
    date: "20/09/2026",
    title: "Tham quan Thực địa Factory Visit & Bế mạc",
    items: [
      {
        time: "08:00 - 11:00",
        title: "Factory Visit: Tham quan Doanh nghiệp / Hợp tác xã tiêu biểu",
        desc: "Tham quan mô hình sản xuất nông nghiệp công nghệ cao, HTX Chè Thái Nguyên & nhà máy KCN.",
      },
      {
        time: "11:00 - 12:00",
        title: "Lễ Bế mạc Diễn đàn & Trao Biên bản Ghi nhớ Hợp tác (MOU)",
        desc: "Ký kết giao thương, trao giấy chứng nhận tham gia và tổng kết diễn đàn.",
        highlight: true,
      },
      {
        time: "12:00 - 13:30",
        title: "Tiệc chia tay (Farewell Lunch) & Check-out",
        desc: "Tiễn đoàn đại biểu, chụp ảnh lưu niệm.",
      },
    ],
  },
];

import { TimelineContent } from "@/constants/defaultContent";

export default function Timeline({ content }: { content?: TimelineContent }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="timeline" className="py-20 bg-[#F4FBF7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            02 · HÀNH TRÌNH 3 NGÀY - Chương trình sự kiện
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2E] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
          >
            Lịch trình diễn ra sự kiện (18–20/09/2026)
          </h2>
          <p className="text-slate-600 text-base">
            Lịch trình làm việc bài bản, tối ưu hóa cơ hội giao thương và gắn kết doanh nhân.
          </p>
        </motion.div>

        {/* Day Tabs Switcher */}
        <div className="flex justify-center p-1.5 bg-white rounded-2xl border border-emerald-200 shadow-sm max-w-xl mx-auto gap-2">
          {SCHEDULE_DATA.map((data, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === idx
                  ? "bg-[#0D3B2E] text-white shadow-md"
                  : "text-slate-600 hover:text-[#0D3B2E] hover:bg-slate-50"
              }`}
            >
              <span>{data.day}</span>
              <span
                className={`text-[11px] font-medium ${
                  activeTab === idx ? "text-[#F59E0B]" : "text-slate-400"
                }`}
              >
                {data.date}
              </span>
            </button>
          ))}
        </div>

        {/* Active Schedule Panel */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-emerald-100 shadow-sme p-6 sm:p-10 space-y-8"
        >
          {/* Day Title */}
          <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                {SCHEDULE_DATA[activeTab].day} — {SCHEDULE_DATA[activeTab].date}
              </span>
              <h3
                className="text-xl sm:text-2xl font-extrabold text-[#0D3B2E] mt-1"
                style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
              >
                {SCHEDULE_DATA[activeTab].title}
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg w-fit">
              <MapPin className="w-4 h-4 text-[#F59E0B]" /> May Plaza Hotel Thái Nguyên
            </div>
          </div>

          {/* Timeline list */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-200 space-y-8">
            {SCHEDULE_DATA[activeTab].items.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Bullet node */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full border-2 bg-white transition-colors ${
                    item.highlight
                      ? "border-[#22C55E] bg-[#22C55E]"
                      : "border-slate-300"
                  }`}
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0D3B2E]">
                      <Clock className="w-3.5 h-3.5" /> {item.time}
                    </span>
                    {item.highlight && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        <Sparkles className="w-3 h-3 text-[#F59E0B]" /> Hoạt động trọng điểm
                      </span>
                    )}
                  </div>
                  <h4
                    className="text-lg font-bold text-[#0D3B2E] pt-1"
                    style={{ fontFamily: "var(--font-wix-display), sans-serif" }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
