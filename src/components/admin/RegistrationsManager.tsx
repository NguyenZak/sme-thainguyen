"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Search, Download, RefreshCw, CheckCircle2, Clock, XCircle, FileSpreadsheet, Loader2 } from "lucide-react";

export interface RegistrationRecord {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  company_name: string;
  position: string;
  ticket_type: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export default function RegistrationsManager() {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRegistrations(data);
      }
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const updateStatus = async (id: string, newStatus: "pending" | "confirmed" | "cancelled") => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("registrations")
        .update({ status: newStatus })
        .eq("id", id);

      if (!error) {
        setRegistrations((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const exportToCSV = () => {
    if (registrations.length === 0) return;

    const headers = ["Họ và Tên", "Số Điện Thoại", "Email", "Tên Doanh Nghiệp", "Chức Vũ", "Gói Vé", "Trạng Thái", "Ngày Đăng Ký", "Ghi Chú"];
    const rows = filteredList.map((r) => [
      `"${r.full_name}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.company_name}"`,
      `"${r.position}"`,
      `"${r.ticket_type}"`,
      `"${r.status}"`,
      `"${new Date(r.created_at).toLocaleString("vi-VN")}"`,
      `"${(r.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Danh_sach_dang_ky_SME_2026_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredList = registrations.filter((r) => {
    const matchesSearch =
      r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) ||
      r.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản Lý Danh Sách Đăng Ký Tham Dự</h2>
          <p className="text-xs text-slate-500 mt-1">Xem, tìm kiếm, xác nhận trạng thái và xuất danh sách khách hàng tham dự sang Excel/CSV.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRegistrations}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Làm Mới
          </button>
          <button
            onClick={exportToCSV}
            disabled={filteredList.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Xuất File CSV ({filteredList.length})
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo họ tên, doanh nghiệp, số điện thoại, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none w-full sm:w-auto font-semibold shadow-sm"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">🟡 Chờ xác nhận (Pending)</option>
          <option value="confirmed">🟢 Đã xác nhận (Confirmed)</option>
          <option value="cancelled">🔴 Đã hủy (Cancelled)</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
            <span className="text-xs">Đang tải danh sách đăng ký...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Chưa có lượt đăng ký nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Họ và Tên</th>
                  <th className="px-4 py-3.5">Doanh Nghiệp & Chức Vũ</th>
                  <th className="px-4 py-3.5">Liên Hệ</th>
                  <th className="px-4 py-3.5">Gói Vé</th>
                  <th className="px-4 py-3.5">Ngày Đăng Ký</th>
                  <th className="px-4 py-3.5 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredList.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {r.full_name}
                      {r.notes && <div className="text-[11px] font-normal text-slate-500 mt-0.5 italic">Ghi chú: {r.notes}</div>}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{r.company_name}</div>
                      <div className="text-[11px] text-slate-500">{r.position}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-slate-900 font-semibold">{r.phone}</div>
                      <div className="text-[11px] text-slate-500">{r.email}</div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
                        {r.ticket_type === "standard" ? "Vé Tiêu Chuẩn" : r.ticket_type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                      {new Date(r.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value as any)}
                        className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          r.status === "confirmed"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : r.status === "cancelled"
                            ? "bg-red-50 text-red-800 border-red-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="cancelled">Đã hủy vé</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
