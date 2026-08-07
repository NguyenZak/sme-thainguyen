"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Search,
  RefreshCw,
  FileSpreadsheet,
  Loader2,
  Users,
  Award,
  Store,
  Filter,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export interface RegistrationRecord {
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
}

export type FormCategory = "all" | "delegate" | "sponsor" | "booth";

export function getFormCategory(ticketType: string): "delegate" | "sponsor" | "booth" {
  const t = (ticketType || "").toLowerCase();
  if (t.includes("sponsor") || t.includes("tài trợ") || t.includes("gói tài trợ")) {
    return "sponsor";
  }
  if (t.includes("booth") || t.includes("gian hàng") || t.includes("gian")) {
    return "booth";
  }
  return "delegate";
}

export function getCategoryBadge(category: "delegate" | "sponsor" | "booth") {
  switch (category) {
    case "delegate":
      return {
        label: "🎟️ Đại biểu Tham dự",
        bg: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "sponsor":
      return {
        label: "💎 Nhà Tài Trợ",
        bg: "bg-purple-50 text-purple-700 border-purple-200",
      };
    case "booth":
      return {
        label: "🎪 Gian Hàng Triển Lãm",
        bg: "bg-amber-50 text-amber-800 border-amber-200",
      };
  }
}

export default function RegistrationsManager() {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FormCategory>("all");
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

  const updateStatus = async (
    id: string,
    newStatus: "pending" | "confirmed" | "completed" | "cancelled"
  ) => {
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

  const deleteRegistration = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa lượt đăng ký của "${name}" không?`)) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("registrations").delete().eq("id", id);
      if (!error) {
        setRegistrations((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Xóa thất bại: " + error.message);
      }
    } catch (err) {
      console.error("Failed to delete registration", err);
    }
  };

  // ── Thống kê theo 3 Form & Trạng thái ────────────────────────────────────
  const delegateCount = registrations.filter(
    (r) => getFormCategory(r.ticket_type) === "delegate"
  ).length;
  const sponsorCount = registrations.filter(
    (r) => getFormCategory(r.ticket_type) === "sponsor"
  ).length;
  const boothCount = registrations.filter(
    (r) => getFormCategory(r.ticket_type) === "booth"
  ).length;
  const completedCount = registrations.filter((r) => r.status === "completed").length;

  const filteredList = registrations.filter((r) => {
    const category = getFormCategory(r.ticket_type);
    const matchesCategory = categoryFilter === "all" || category === categoryFilter;

    const matchesSearch =
      r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.ticket_type?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    if (filteredList.length === 0) return;

    const headers = [
      "Form Đăng Ký",
      "Họ và Tên",
      "Số Điện Thoại",
      "Email",
      "Tên Doanh Nghiệp",
      "Chức Vụ",
      "Chi Tiết Đăng Ký",
      "Trạng Thái",
      "Ngày Đăng Ký",
      "Ghi Chú",
    ];

    const rows = filteredList.map((r) => {
      const cat = getFormCategory(r.ticket_type);
      const catLabel =
        cat === "delegate"
          ? "Đại biểu Tham dự"
          : cat === "sponsor"
          ? "Nhà Tài Trợ"
          : "Gian Hàng Triển Lãm";

      const statusLabel =
        r.status === "completed"
          ? "Đã xử lý xong"
          : r.status === "confirmed"
          ? "Đã xác nhận"
          : r.status === "cancelled"
          ? "Đã hủy"
          : "Chờ xử lý";

      return [
        `"${catLabel}"`,
        `"${r.full_name}"`,
        `"${r.phone}"`,
        `"${r.email}"`,
        `"${r.company_name}"`,
        `"${r.position}"`,
        `"${r.ticket_type}"`,
        `"${statusLabel}"`,
        `"${new Date(r.created_at).toLocaleString("vi-VN")}"`,
        `"${(r.notes || "").replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Danh_sach_dang_ky_${categoryFilter}_SME_2026_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Quản Lý Danh Sách Đăng Ký Tham Dự
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp & Xử lý dữ liệu từ 3 Form Đăng ký trên Landing Page (<b>Đại Biểu</b>, <b>Nhà Tài Trợ</b>, <b>Gian Hàng</b>).
          </p>
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

      {/* ── Stat Cards Summary ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setCategoryFilter("all")}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            categoryFilter === "all"
              ? "bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/20"
              : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
              TẤT CẢ ĐĂNG KÝ
            </span>
            <Filter className="w-4 h-4 opacity-70" />
          </div>
          <div className="text-2xl font-black mt-2">{registrations.length}</div>
          <div className="text-[10px] mt-1 opacity-70 flex items-center justify-between">
            <span>Tổng lượt đăng ký</span>
            {completedCount > 0 && <span className="font-bold">✅ Đã xong {completedCount}</span>}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setCategoryFilter("delegate")}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            categoryFilter === "delegate"
              ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-600/20"
              : "bg-white text-slate-900 border-slate-200 hover:bg-blue-50/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-200">
              🎟️ FORM 1: ĐẠI BIỂU
            </span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black mt-2">{delegateCount}</div>
          <p className="text-[10px] text-slate-500 mt-1">Đăng ký tham dự diễn đàn</p>
        </button>

        <button
          type="button"
          onClick={() => setCategoryFilter("sponsor")}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            categoryFilter === "sponsor"
              ? "bg-purple-700 text-white border-purple-700 ring-2 ring-purple-700/20"
              : "bg-white text-slate-900 border-slate-200 hover:bg-purple-50/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-200">
              💎 FORM 2: NHÀ TÀI TRỢ
            </span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black mt-2">{sponsorCount}</div>
          <p className="text-[10px] text-slate-500 mt-1">Đăng ký đồng hành & tài trợ</p>
        </button>

        <button
          type="button"
          onClick={() => setCategoryFilter("booth")}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            categoryFilter === "booth"
              ? "bg-amber-600 text-white border-amber-600 ring-2 ring-amber-600/20"
              : "bg-white text-slate-900 border-slate-200 hover:bg-amber-50/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-200">
              🎪 FORM 3: GIAN HÀNG
            </span>
            <Store className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black mt-2">{boothCount}</div>
          <p className="text-[10px] text-slate-500 mt-1">Đăng ký gian hàng triển lãm</p>
        </button>
      </div>

      {/* ── Filters Bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo họ tên, doanh nghiệp, số điện thoại, email, thông tin đăng ký..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as FormCategory)}
          className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none w-full sm:w-auto font-semibold shadow-sm"
        >
          <option value="all">📂 Tất cả 3 Form ({registrations.length})</option>
          <option value="delegate">🎟️ Form 1: Đăng ký Đại Biểu ({delegateCount})</option>
          <option value="sponsor">💎 Form 2: Đăng ký Nhà Tài Trợ ({sponsorCount})</option>
          <option value="booth">🎪 Form 3: Đăng ký Gian Hàng ({boothCount})</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none w-full sm:w-auto font-semibold shadow-sm"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">🟡 Chờ xử lý (Pending)</option>
          <option value="confirmed">🔵 Đã xác nhận (Confirmed)</option>
          <option value="completed">✅ Đã xử lý xong (Completed)</option>
          <option value="cancelled">🔴 Đã hủy vé (Cancelled)</option>
        </select>
      </div>

      {/* ── Data Table ───────────────────────────────────────────────────── */}
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
                  <th className="px-4 py-3.5">Form Đăng Ký</th>
                  <th className="px-4 py-3.5">Họ và Tên</th>
                  <th className="px-4 py-3.5">Doanh Nghiệp & Chức Vụ</th>
                  <th className="px-4 py-3.5">Liên Hệ</th>
                  <th className="px-4 py-3.5">Chi Tiết Gói / Gian Hàng</th>
                  <th className="px-4 py-3.5">Ngày Đăng Ký</th>
                  <th className="px-4 py-3.5 text-center">Trạng Thái</th>
                  <th className="px-4 py-3.5 text-right">Thao Tác Fast</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredList.map((r) => {
                  const category = getFormCategory(r.ticket_type);
                  const badge = getCategoryBadge(category);
                  const isDone = r.status === "completed";

                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors ${
                        isDone ? "bg-emerald-50/40 hover:bg-emerald-50/70" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Form Badge */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Full Name & Notes */}
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          <span>{r.full_name}</span>
                        </div>
                        {r.notes && (
                          <div className="text-[11px] font-normal text-slate-500 mt-0.5 italic">
                            Ghi chú: {r.notes}
                          </div>
                        )}
                      </td>

                      {/* Company & Position */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900">{r.company_name}</div>
                        <div className="text-[11px] text-slate-500">{r.position}</div>
                      </td>

                      {/* Phone & Email */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono text-slate-900 font-semibold">{r.phone}</div>
                        <div className="text-[11px] text-slate-500">{r.email}</div>
                      </td>

                      {/* Ticket / Booth / Sponsor detail */}
                      <td className="px-4 py-3.5 font-semibold text-slate-700">
                        <span
                          className="px-2 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-[11px] inline-block max-w-[200px] truncate"
                          title={r.ticket_type}
                        >
                          {r.ticket_type === "standard" ? "Vé Tiêu Chuẩn" : r.ticket_type}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                        {new Date(r.created_at).toLocaleDateString("vi-VN")}
                      </td>

                      {/* Status Selector */}
                      <td className="px-4 py-3.5 text-center">
                        <select
                          value={r.status}
                          onChange={(e) => updateStatus(r.id, e.target.value as any)}
                          className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                            r.status === "completed"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : r.status === "confirmed"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : r.status === "cancelled"
                              ? "bg-red-50 text-red-800 border-red-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="pending">🟡 Chờ xử lý</option>
                          <option value="confirmed">🔵 Đã xác nhận</option>
                          <option value="completed">✅ Đã xử lý xong</option>
                          <option value="cancelled">🔴 Đã hủy vé</option>
                        </select>
                      </td>

                      {/* Fast Action Buttons */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.status !== "completed" ? (
                            <button
                              type="button"
                              onClick={() => updateStatus(r.id, "completed")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-sm"
                              title="Đánh dấu đã liên hệ & xử lý xong dữ liệu"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Xong</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateStatus(r.id, "pending")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-semibold transition-all"
                              title="Mở lại trạng thái chờ xử lý"
                            >
                              Mở lại
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => deleteRegistration(r.id, r.full_name)}
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                            title="Xóa lượt đăng ký này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
