"use client";

import { useState } from "react";
import {
  X,
  User,
  Building2,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  BedDouble,
  Utensils,
  CreditCard,
  CheckCircle2,
  Clock,
  MessageSquare,
  Copy,
  ExternalLink,
  Send,
  Loader2,
  FileText,
  ShieldCheck,
  PackageCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/components/ui/Toast";

export interface ExtendedRegistrationRecord {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  company_name: string;
  position: string;
  ticket_type: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  // Parsed / Optional extended fields
  packageCount?: number;
  extraDelegatesCount?: number;
  totalDelegatesCount?: number;
  extraRoomType?: "shared" | "single";
  extraNights?: number;
  includeDay18Lunch?: boolean;
  includeDay19Lunch?: boolean;
  includeDay20Lunch?: boolean;
  totalLunchFee?: number;
  totalCalculatedAmount?: number;
  networkingNeeds?: string;
}

interface ModalProps {
  record: ExtendedRegistrationRecord | null;
  onClose: () => void;
  onConfirmPayment?: (id: string, name: string) => Promise<void>;
  onStatusChange?: (id: string, newStatus: "pending" | "confirmed" | "completed" | "cancelled") => void;
}

export default function RegistrationDetailModal({
  record,
  onClose,
  onConfirmPayment,
  onStatusChange,
}: ModalProps) {
  const [copying, setCopying] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!record) return null;

  const ticketTypeStr = record.ticket_type || "";
  const isSponsor = ticketTypeStr.toLowerCase().includes("sponsor") || ticketTypeStr.toLowerCase().includes("tài trợ");
  const isBooth = ticketTypeStr.toLowerCase().includes("booth") || ticketTypeStr.toLowerCase().includes("gian hàng");
  const isDelegate = !isSponsor && !isBooth;

  // Extract / Parse information from ticket_type string or fields
  const cleanPhone = record.phone ? record.phone.replace(/[^0-9]/g, "") : "";
  const zaloUrl = cleanPhone ? `https://zalo.me/${cleanPhone}` : "";

  // Helper to parse room & delegate count if not directly in columns
  let extraDelegates = record.extraDelegatesCount ?? 0;
  let roomType = record.extraRoomType || (ticketTypeStr.includes("phòng đơn") ? "single" : "shared");
  let nights = record.extraNights || (ticketTypeStr.includes("2 đêm") ? 2 : ticketTypeStr.includes("3 đêm") ? 3 : 1);

  // Parse lunches from string if boolean flags not saved directly
  const hasDay18Lunch = record.includeDay18Lunch ?? (ticketTypeStr.includes("18/09") || ticketTypeStr.includes("18"));
  const hasDay19Lunch = record.includeDay19Lunch ?? (ticketTypeStr.includes("19/09") || ticketTypeStr.includes("19"));
  const hasDay20Lunch = record.includeDay20Lunch ?? (ticketTypeStr.includes("20/09") || ticketTypeStr.includes("20"));

  const handleCopyInfo = () => {
    setCopying(true);
    const summary = `Mã ĐK: ${record.id}\nHọ tên: ${record.full_name}\nSĐT: ${record.phone}\nEmail: ${record.email}\nCông ty: ${record.company_name}\nChức vụ: ${record.position}\nNội dung ĐK: ${record.ticket_type}\nGhi chú: ${record.notes || "Không có"}`;
    navigator.clipboard.writeText(summary);
    toast.success("Đã sao chép! 📋", "Thông tin đăng ký đã được chép vào bộ nhớ tạm.");
    setTimeout(() => setCopying(false), 1500);
  };

  const handleConfirmAction = async () => {
    if (!onConfirmPayment) return;
    setConfirming(true);
    try {
      await onConfirmPayment(record.id, record.full_name);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-[#0D3B2E] text-white p-5 sm:p-6 flex items-start justify-between relative overflow-hidden shrink-0">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-1 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-xs font-bold">
                🆔 {record.id}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase border ${
                  record.status === "completed"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : record.status === "confirmed"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : record.status === "cancelled"
                    ? "bg-red-500/20 text-red-300 border-red-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}
              >
                {record.status === "completed"
                  ? "🟢 Đã thanh toán / Hoàn tất"
                  : record.status === "confirmed"
                  ? "🔵 Đã xác nhận"
                  : record.status === "cancelled"
                  ? "🔴 Đã hủy"
                  : "⏳ Chờ xử lý / Chưa thanh toán"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 pt-1">
              <User className="w-6 h-6 text-amber-400 shrink-0" /> {record.full_name}
            </h2>
            <p className="text-xs text-emerald-200/90 font-medium">
              Đăng ký vào lúc: {new Date(record.created_at).toLocaleString("vi-VN")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="z-10 p-2 text-emerald-200 hover:text-white hover:bg-emerald-800/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700 font-sans">
          
          {/* Quick Contact Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {cleanPhone && (
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 border border-slate-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Gọi điện
              </a>
            )}
            {zaloUrl && (
              <a
                href={zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 font-bold text-blue-700 border border-blue-200 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat Zalo
              </a>
            )}
            {record.email && (
              <a
                href={`mailto:${record.email}`}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 border border-slate-200 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-purple-600" /> Gửi Email
              </a>
            )}
            <button
              onClick={handleCopyInfo}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 font-bold text-amber-800 border border-amber-200 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-amber-600" /> {copying ? "Đã copy!" : "Copy thông tin"}
            </button>
          </div>

          {/* Section 1: Customer Contact & Company Profile */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Building2 className="w-4 h-4 text-emerald-700" /> Thông Tin Đại Biểu &amp; Doanh Nghiệp
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Họ và Tên:</span>
                <span className="font-bold text-slate-900 text-sm">{record.full_name}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Công ty / Đơn vị:</span>
                <span className="font-bold text-slate-900 text-sm">{record.company_name || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Chức vụ:</span>
                <span className="font-semibold text-slate-800">{record.position || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Số điện thoại:</span>
                <span className="font-mono font-bold text-slate-900">{record.phone || "N/A"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 font-medium block">Địa chỉ Email:</span>
                <span className="font-mono font-bold text-slate-900">{record.email || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Registration Detail & Package Breakdown */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4.5 space-y-3">
            <h3 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-200/80 pb-2">
              <PackageCheck className="w-4 h-4 text-emerald-700" /> Nội Dung Đăng Ký Chi Tiết
            </h3>
            <div className="p-3 bg-white rounded-xl border border-emerald-200 font-semibold text-emerald-950 text-xs shadow-xs">
              {record.ticket_type}
            </div>
          </div>

          {/* Section 3: Logistics - Hotel Rooms & Meal Preparation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Hotel Room Allocation */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2.5">
              <h4 className="font-extrabold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-200 pb-2">
                <BedDouble className="w-4 h-4 text-amber-700" /> Khách Sạn May Plaza (Xếp Phòng)
              </h4>
              <div className="space-y-1.5 text-xs text-amber-950">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Loại phòng đăng ký:</span>
                  <span className="font-extrabold text-amber-900">
                    {roomType === "single" ? "Phòng 1 người (Đơn)" : "Ở ghép (2 người/phòng)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Số đêm lưu trú:</span>
                  <span className="font-extrabold text-amber-900">{nights} đêm (Tối 19/09)</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200/90 text-[11.5px] font-bold text-amber-900 space-y-0.5 mt-2">
                  <span className="block text-[10.5px] text-slate-500 uppercase tracking-wider">Phân bổ chuẩn bị phòng:</span>
                  {roomType === "single" ? (
                    <p className="text-emerald-700">🏨 01 Phòng Đơn (Single Room)</p>
                  ) : (
                    <p className="text-emerald-700">🏨 Ở ghép 2 người / phòng</p>
                  )}
                </div>
              </div>
            </div>

            {/* Meals Catering Breakdown */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2.5">
              <h4 className="font-extrabold text-blue-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-blue-200 pb-2">
                <Utensils className="w-4 h-4 text-blue-700" /> Tổng Hợp Suất Ăn Trưa &amp; Gala
              </h4>
              <div className="space-y-1.5 text-xs text-blue-950">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">• Ăn trưa Ngày 20/09:</span>
                  <span className={`font-bold ${hasDay20Lunch ? "text-emerald-700" : "text-slate-400"}`}>
                    {hasDay20Lunch ? "✅ Có đăng ký (+100k)" : "❌ Không đăng ký"}
                  </span>
                </div>
                {(hasDay18Lunch || hasDay19Lunch) && (
                  <div className="flex items-center justify-between text-[11px] text-slate-500 italic pt-1">
                    <span>(Đăng ký cũ: {hasDay18Lunch ? "Trưa 18/9 " : ""}{hasDay19Lunch ? "Trưa 19/9" : ""})</span>
                  </div>
                )}
                <div className="p-2.5 bg-white rounded-xl border border-blue-200/90 text-[11.5px] font-bold text-blue-900 mt-2">
                  ✨ Miễn phí Bữa sáng Buffet &amp; 01 Đêm tiệc Gala Dinner (19/09)
                </div>
              </div>
            </div>

          </div>

          {/* Section 4: Notes & B2B Needs */}
          {record.notes && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" /> Nhu Cầu Kết Nối B2B &amp; Ghi Chú Của Khách:
              </h4>
              <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200">
                &ldquo;{record.notes}&rdquo;
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Đổi trạng thái:</span>
            <select
              value={record.status}
              onChange={(e) => onStatusChange?.(record.id, e.target.value as any)}
              className="text-xs font-extrabold rounded-xl px-3 py-1.5 border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="pending">⏳ Chờ xử lý / Chưa thanh toán</option>
              <option value="confirmed">🔵 Đã xác nhận</option>
              <option value="completed">🟢 Đã thanh toán (Hoàn tất)</option>
              <option value="cancelled">🔴 Đã hủy</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {record.status !== "completed" && onConfirmPayment && (
              <button
                type="button"
                disabled={confirming}
                onClick={handleConfirmAction}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                <span>Xác Nhận Tiền Về (Gửi Mail)</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
