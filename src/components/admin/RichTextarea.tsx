"use client";

import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  CornerDownLeft,
  Sparkles,
  Eye,
  Edit3,
  ListOrdered,
  Quote,
  Heading2,
  Highlighter,
} from "lucide-react";

interface RichTextareaProps {
  label?: string;
  subLabel?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function RichTextarea({
  label,
  subLabel,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
}: RichTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Insert tag or markdown symbol around selected text
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let replacement = "";
    if (selectedText) {
      replacement = `${prefix}${selectedText}${suffix}`;
    } else {
      replacement = `${prefix}${suffix}`;
    }

    const newValue =
      value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Restore focus and cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const insertLineBreak = () => {
    insertFormatting("\n");
  };

  const insertBullet = () => {
    insertFormatting("• ");
  };

  return (
    <div className="space-y-1.5 w-full">
      {(label || subLabel) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="block text-xs font-semibold text-slate-700">
              {label}
            </label>
          )}
          {subLabel && (
            <span className="text-[11px] text-slate-500 font-medium">
              {subLabel}
            </span>
          )}
        </div>
      )}

      {/* Editor Main Container */}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
        {/* Formatting Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between flex-wrap gap-1">
          {/* Action Tools */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="In đậm (Bold)"
              onClick={() => insertFormatting("<b>", "</b>")}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="In nghiêng (Italic)"
              onClick={() => insertFormatting("<i>", "</i>")}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors flex items-center gap-1"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Gạch chân (Underline)"
              onClick={() => insertFormatting("<u>", "</u>")}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors flex items-center gap-1"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              title="Nổi bật (Highlight)"
              onClick={() => insertFormatting("<mark>", "</mark>")}
              className="p-1.5 hover:bg-amber-100 text-amber-800 rounded-lg text-xs transition-colors flex items-center gap-1"
            >
              <Highlighter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Thêm gạch đầu dòng (Bullet)"
              onClick={insertBullet}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors flex items-center gap-1"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Xuống dòng (Line Break)"
              onClick={insertLineBreak}
              className="p-1.5 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs transition-colors flex items-center gap-1 font-semibold"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span className="text-[10px]">Xuống dòng</span>
            </button>
          </div>

          {/* Mode Switcher: Edit vs Preview */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                activeTab === "edit"
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Edit3 className="w-3 h-3" /> Chỉnh sửa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                activeTab === "preview"
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3 h-3" /> Xem thử
            </button>
          </div>
        </div>

        {/* Editor Body */}
        {activeTab === "edit" ? (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Nhập nội dung văn bản..."}
            className={`w-full p-3 text-xs text-slate-900 bg-white border-0 focus:ring-0 focus:outline-none resize-y ${className}`}
          />
        ) : (
          <div
            className={`w-full p-3 text-xs text-slate-800 bg-slate-50/50 min-h-[80px] leading-relaxed whitespace-pre-line ${className}`}
            dangerouslySetInnerHTML={{
              __html: value || "<span class='text-slate-400 italic'>Chưa có nội dung xem thử...</span>",
            }}
          />
        )}
      </div>
    </div>
  );
}
