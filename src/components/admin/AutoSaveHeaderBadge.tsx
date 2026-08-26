"use client";

import { SaveStatus } from "@/hooks/useAutoSave";
import { Loader2, CheckCircle2, AlertCircle, CloudCheck, Sparkles } from "lucide-react";

interface Props {
  status: SaveStatus;
  lastSavedTime?: string | null;
  errorMessage?: string | null;
  onManualSave?: () => void;
}

export default function AutoSaveHeaderBadge({
  status,
  lastSavedTime,
  errorMessage,
  onManualSave,
}: Props) {
  if (status === "saving") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 shadow-sm animate-pulse">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600 shrink-0" />
        <span>Đang tự động lưu...</span>
      </div>
    );
  }

  if (status === "saved") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-sm transition-all">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Đã tự động lưu {lastSavedTime ? `(${lastSavedTime})` : ""}</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 text-red-800 text-xs font-bold border border-red-200 shadow-sm">
        <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
        <span className="truncate max-w-[200px]">{errorMessage || "Lỗi lưu dữ liệu"}</span>
        {onManualSave && (
          <button
            type="button"
            onClick={onManualSave}
            className="underline hover:text-red-950 font-black ml-1 cursor-pointer"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  // idle
  return (
    <div
      onClick={onManualSave}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 transition-colors ${
        onManualSave ? "cursor-pointer" : ""
      }`}
      title={onManualSave ? "Click để lưu tức thì" : "Hệ thống tự động lưu khi chỉnh sửa"}
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
      <span>{lastSavedTime ? `Đã lưu lúc ${lastSavedTime}` : "Tự động lưu"}</span>
    </div>
  );
}
