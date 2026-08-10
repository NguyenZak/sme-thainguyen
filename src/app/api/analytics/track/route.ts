import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// Utility to parse device from user agent
function parseDeviceType(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|hpwOS|Opera M(obi|ini)/.test(
      userAgent
    )
  ) {
    return "mobile";
  }
  return "desktop";
}

// Utility to parse simplified source referrer
function parseTrafficSource(referrer: string): "direct" | "google" | "facebook" | "zalo" | "referral" {
  if (!referrer) return "direct";
  const lowerRef = referrer.toLowerCase();
  if (lowerRef.includes("google.com") || lowerRef.includes("google.com.vn")) return "google";
  if (lowerRef.includes("facebook.com") || lowerRef.includes("fb.com") || lowerRef.includes("m.facebook.com")) return "facebook";
  if (lowerRef.includes("zalo.me") || lowerRef.includes("zalo")) return "zalo";
  return "referral";
}

export async function POST(req: NextRequest) {
  try {
    // Chống spam tracking: tối đa 120 lượt / phút / IP (đủ cho điều hướng thật)
    const ip = getClientIp(req);
    const rl = rateLimit(`track:${ip}`, 120, 60_000);
    if (!rl.ok) {
      return NextResponse.json({ success: false }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const userAgent = req.headers.get("user-agent") || body.userAgent || "";
    const referrer = req.headers.get("referer") || body.referrer || "";
    const path = body.path || "/";
    const sessionId = body.sessionId || "anon_" + Math.random().toString(36).substring(2, 9);
    
    const deviceType = body.deviceType || parseDeviceType(userAgent);
    const source = parseTrafficSource(referrer);
    const nowIso = new Date().toISOString();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Attempt inserting into page_views table
      const { error: insertError } = await supabase.from("page_views").insert([
        {
          path,
          referrer,
          source,
          device_type: deviceType,
          session_id: sessionId,
          user_agent: userAgent,
          created_at: nowIso,
        },
      ]);

      // If page_views table doesn't exist or RLS blocks it, fallback to maintaining aggregated stats in site_sections table
      if (insertError) {
        // Fetch current traffic_analytics section from site_sections
        const { data: existingSec } = await supabase
          .from("site_sections")
          .select("content")
          .eq("id", "traffic_analytics_data")
          .maybeSingle();

        const currentData = (existingSec?.content as any) || {
          totalVisits: 0,
          todayVisits: 0,
          todayDate: new Date().toISOString().split("T")[0],
          history: {},
          devices: { mobile: 0, desktop: 0, tablet: 0 },
          sources: { direct: 0, google: 0, facebook: 0, zalo: 0, referral: 0 },
          topPages: {},
          sessions: {},
          recentVisits: [],
        };

        const todayStr = new Date().toISOString().split("T")[0];
        if (currentData.todayDate !== todayStr) {
          currentData.todayDate = todayStr;
          currentData.todayVisits = 0;
        }

        currentData.totalVisits = (currentData.totalVisits || 0) + 1;
        currentData.todayVisits = (currentData.todayVisits || 0) + 1;
        currentData.history[todayStr] = (currentData.history[todayStr] || 0) + 1;

        if (!currentData.devices) currentData.devices = { mobile: 0, desktop: 0, tablet: 0 };
        currentData.devices[deviceType] = (currentData.devices[deviceType] || 0) + 1;

        if (!currentData.sources) currentData.sources = { direct: 0, google: 0, facebook: 0, zalo: 0, referral: 0 };
        currentData.sources[source] = (currentData.sources[source] || 0) + 1;

        if (!currentData.topPages) currentData.topPages = {};
        const pageKey = path === "/" ? "Trang chủ" : path;
        currentData.topPages[pageKey] = (currentData.topPages[pageKey] || 0) + 1;

        if (!currentData.sessions) currentData.sessions = {};
        currentData.sessions[sessionId] = true;

        const newVisitRecord = {
          id: Math.random().toString(36).substring(2, 9),
          path,
          deviceType,
          source,
          timestamp: nowIso,
        };

        currentData.recentVisits = [newVisitRecord, ...(currentData.recentVisits || []).slice(0, 49)];

        await supabase.from("site_sections").upsert({
          id: "traffic_analytics_data",
          content: currentData,
          updated_at: nowIso,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
