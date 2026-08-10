"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Exclude admin pages from traffic analytics tracking
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastTrackedPath.current === pathname) return;

    lastTrackedPath.current = pathname;

    try {
      // Get or create anonymous session ID in sessionStorage
      let sessionId = sessionStorage.getItem("sme_analytics_sid");
      if (!sessionId) {
        sessionId = "sid_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
        sessionStorage.setItem("sme_analytics_sid", sessionId);
      }

      const referrer = typeof document !== "undefined" ? document.referrer : "";
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";

      fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: pathname,
          referrer,
          userAgent,
          sessionId,
        }),
        keepalive: true,
      }).catch((err) => {
        // Silent error handling for non-blocking analytics tracker
        console.debug("Analytics track payload send warning:", err);
      });
    } catch (e) {
      // Ignore
    }
  }, [pathname]);

  return null; // Pure tracking logic component, renders no DOM elements
}
