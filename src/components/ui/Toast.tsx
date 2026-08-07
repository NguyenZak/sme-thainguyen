"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

// Global Event Emitter for Toast notifications anywhere in Client Components
type ToastListener = (toast: ToastMessage) => void;
const listeners: Set<ToastListener> = new Set();

export const toast = {
  success: (title: string, description?: string, duration = 4000) => {
    emitToast({ id: Math.random().toString(36).substring(2, 9), type: "success", title, description, duration });
  },
  error: (title: string, description?: string, duration = 5000) => {
    emitToast({ id: Math.random().toString(36).substring(2, 9), type: "error", title, description, duration });
  },
  info: (title: string, description?: string, duration = 4000) => {
    emitToast({ id: Math.random().toString(36).substring(2, 9), type: "info", title, description, duration });
  },
  warning: (title: string, description?: string, duration = 4000) => {
    emitToast({ id: Math.random().toString(36).substring(2, 9), type: "warning", title, description, duration });
  },
};

function emitToast(toastData: ToastMessage) {
  listeners.forEach((listener) => listener(toastData));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (newToast: ToastMessage) => {
      setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      aria-live="assertive"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((item) => (
        <ToastItem key={item.id} toast={item} onClose={() => removeToast(item.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  const getTheme = () => {
    switch (toast.type) {
      case "success":
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          accentBg: "bg-emerald-500",
          bg: "bg-white/95 backdrop-blur-md border-emerald-200/80 shadow-emerald-500/10",
          titleColor: "text-slate-900",
          descColor: "text-slate-600",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
          accentBg: "bg-red-500",
          bg: "bg-white/95 backdrop-blur-md border-red-200/80 shadow-red-500/10",
          titleColor: "text-slate-900",
          descColor: "text-slate-600",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          accentBg: "bg-amber-500",
          bg: "bg-white/95 backdrop-blur-md border-amber-200/80 shadow-amber-500/10",
          titleColor: "text-slate-900",
          descColor: "text-slate-600",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
          accentBg: "bg-blue-500",
          bg: "bg-white/95 backdrop-blur-md border-blue-200/80 shadow-blue-500/10",
          titleColor: "text-slate-900",
          descColor: "text-slate-600",
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-4 shadow-xl transition-all duration-300 transform ${
        exiting ? "opacity-0 translate-x-12 scale-95" : "opacity-100 translate-x-0 scale-100 animate-slide-in"
      } ${theme.bg}`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">{theme.icon}</div>
        <div className="flex-1 min-w-0 pr-2">
          <h4 className={`text-xs font-bold ${theme.titleColor} leading-snug`}>{toast.title}</h4>
          {toast.description && (
            <p className={`text-[11px] font-medium ${theme.descColor} mt-0.5 leading-relaxed`}>{toast.description}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Bar Timer */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${theme.accentBg} animate-progress`}
          style={{ animationDuration: `${toast.duration || 4000}ms` }}
        />
      </div>
    </div>
  );
}
