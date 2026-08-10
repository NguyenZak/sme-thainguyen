import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    let totalVisits = 0;
    let todayVisits = 0;
    let yesterdayVisits = 0;
    let uniqueSessions = 0;

    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
    const sourceCounts = { direct: 0, google: 0, facebook: 0, zalo: 0, referral: 0 };
    const topPagesMap: Record<string, number> = {};
    const dailyTrendMap: Record<string, number> = {};
    let recentVisits: any[] = [];

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Seed empty dates for last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      dailyTrendMap[dateKey] = 0;
    }

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // 1. Try querying page_views table in Supabase
      const { data: pageViews, error } = await supabase
        .from("page_views")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2000);

      if (!error && pageViews && pageViews.length > 0) {
        totalVisits = pageViews.length;
        const sessionSet = new Set<string>();

        pageViews.forEach((row: any) => {
          const rowDateStr = row.created_at ? row.created_at.split("T")[0] : "";

          if (rowDateStr === todayStr) {
            todayVisits++;
          } else if (rowDateStr === yesterdayStr) {
            yesterdayVisits++;
          }

          if (rowDateStr && dailyTrendMap[rowDateStr] !== undefined) {
            dailyTrendMap[rowDateStr]++;
          }

          if (row.session_id) sessionSet.add(row.session_id);

          const dev = (row.device_type || "desktop") as "mobile" | "desktop" | "tablet";
          if (deviceCounts[dev] !== undefined) deviceCounts[dev]++;

          const src = (row.source || "direct") as keyof typeof sourceCounts;
          if (sourceCounts[src] !== undefined) sourceCounts[src]++;

          const pathLabel = row.path === "/" ? "Trang chủ" : row.path;
          topPagesMap[pathLabel] = (topPagesMap[pathLabel] || 0) + 1;
        });

        uniqueSessions = sessionSet.size;
        recentVisits = pageViews.slice(0, 15).map((r) => ({
          id: r.id,
          path: r.path,
          deviceType: r.device_type,
          source: r.source,
          timestamp: r.created_at,
        }));
      } else {
        // 2. Fallback querying site_sections table id 'traffic_analytics_data'
        const { data: sec } = await supabase
          .from("site_sections")
          .select("content")
          .eq("id", "traffic_analytics_data")
          .maybeSingle();

        if (sec?.content) {
          const content = sec.content as any;
          totalVisits = content.totalVisits || 0;
          todayVisits = content.todayVisits || 0;
          yesterdayVisits = content.history?.[yesterdayStr] || 0;

          if (content.sessions) {
            uniqueSessions = Object.keys(content.sessions).length;
          } else if (totalVisits > 0) {
            uniqueSessions = totalVisits;
          }

          if (content.devices) Object.assign(deviceCounts, content.devices);
          if (content.sources) Object.assign(sourceCounts, content.sources);
          if (content.topPages) Object.assign(topPagesMap, content.topPages);

          if (content.history) {
            Object.keys(dailyTrendMap).forEach((dateKey) => {
              if (content.history[dateKey] !== undefined) {
                dailyTrendMap[dateKey] = content.history[dateKey];
              }
            });
          }

          if (Array.isArray(content.recentVisits)) {
            recentVisits = content.recentVisits.slice(0, 15);
          }
        }
      }
    }

    // Calculate growth percentage vs yesterday based purely on actual numbers
    let growthVsYesterday = 0;
    if (yesterdayVisits > 0) {
      growthVsYesterday = Math.round(((todayVisits - yesterdayVisits) / yesterdayVisits) * 100);
    } else if (todayVisits > 0) {
      growthVsYesterday = 100;
    }

    // Convert daily trend to sorted array
    const dailyTrend = Object.entries(dailyTrendMap).map(([date, count]) => ({
      date,
      count,
    }));

    // Convert top pages to sorted array
    const topPages = Object.entries(topPagesMap)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return NextResponse.json({
      success: true,
      summary: {
        totalVisits,
        todayVisits,
        yesterdayVisits,
        growthVsYesterday,
        uniqueSessions,
      },
      devices: deviceCounts,
      sources: sourceCounts,
      dailyTrend,
      topPages,
      recentVisits,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
