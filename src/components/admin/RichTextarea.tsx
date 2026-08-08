"use client";

import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

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
  const editorRef = useRef<any>(null);

  const calculatedHeight = Math.max(rows * 50, 160);

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
            <span className="text-[11px] text-[#22C55E] font-medium">
              {subLabel}
            </span>
          )}
        </div>
      )}

      {/* TinyMCE Rich Text Editor Container */}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
        <Editor
          tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={value || ""}
          onEditorChange={(newContent) => {
            let cleaned = newContent.trim();
            if (
              cleaned.startsWith("<p>") &&
              cleaned.endsWith("</p>") &&
              (cleaned.match(/<p>/g) || []).length === 1
            ) {
              cleaned = cleaned.substring(3, cleaned.length - 4).trim();
            }
            onChange(cleaned);
          }}
          init={{
            height: calculatedHeight,
            menubar: false,
            placeholder: placeholder || "Nhập nội dung văn bản...",
            forced_root_block: "",
            force_br_newlines: true,
            force_p_newlines: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "table",
              "wordcount",
            ],
            toolbar:
              "undo redo | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code preview",
            content_style:
              "body { font-family: Inter, Helvetica, Arial, sans-serif; font-size: 13px; color: #1e293b; line-height: 1.6; }",
            branding: false,
            promotion: false,
            statusbar: false,
            resize: true,
          }}
        />
      </div>
    </div>
  );
}
