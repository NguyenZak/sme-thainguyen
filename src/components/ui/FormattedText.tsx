"use client";

import React from "react";

interface FormattedTextProps {
  content?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "span" | "p" | "div" | "h2" | "h3";
}

export default function FormattedText({
  content = "",
  className = "",
  style,
  as: Component = "span",
}: FormattedTextProps) {
  if (!content) return null;

  let cleaned = content.trim();

  // Strip wrapping <p>...</p> if it's only a single paragraph tag to prevent double block margins
  if (
    cleaned.startsWith("<p>") &&
    cleaned.endsWith("</p>") &&
    (cleaned.match(/<p>/g) || []).length === 1
  ) {
    cleaned = cleaned.substring(3, cleaned.length - 4).trim();
  }

  // If text has no HTML tags, preserve plain line breaks (\n -> <br />)
  const hasHtml = /<[a-z][\s\S]*>/i.test(cleaned);
  if (!hasHtml) {
    cleaned = cleaned.replace(/\n/g, "<br />");
  }

  return (
    <Component
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
}
