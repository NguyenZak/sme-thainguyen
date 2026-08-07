"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import GeneralEditor from "@/components/admin/GeneralEditor";
import HeroEditor from "@/components/admin/HeroEditor";
import StatisticsEditor from "@/components/admin/StatisticsEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import BenefitsEditor from "@/components/admin/BenefitsEditor";
import TimelineEditor from "@/components/admin/TimelineEditor";
import TicketFeeEditor from "@/components/admin/TicketFeeEditor";
import SponsorsEditor from "@/components/admin/SponsorsEditor";
import BoothsEditor from "@/components/admin/BoothsEditor";
import RegistrationsManager from "@/components/admin/RegistrationsManager";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import {
  DEFAULT_SITE_CONFIG,
  DEFAULT_HERO,
  DEFAULT_STATISTICS,
  DEFAULT_ABOUT,
  DEFAULT_BENEFITS,
  DEFAULT_TIMELINE,
  DEFAULT_TICKET_FEE,
  DEFAULT_SPONSORS,
  DEFAULT_BOOTHS,
  DEFAULT_FOOTER,
} from "@/constants/defaultContent";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("general");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [data, setData] = useState<{
    site_config: any;
    hero: any;
    statistics: any;
    about: any;
    benefits: any;
    timeline: any;
    ticket_fee: any;
    sponsors: any;
    booths: any;
    footer: any;
  }>({
    site_config: DEFAULT_SITE_CONFIG,
    hero: DEFAULT_HERO,
    statistics: DEFAULT_STATISTICS,
    about: DEFAULT_ABOUT,
    benefits: DEFAULT_BENEFITS,
    timeline: DEFAULT_TIMELINE,
    ticket_fee: DEFAULT_TICKET_FEE,
    sponsors: DEFAULT_SPONSORS,
    booths: DEFAULT_BOOTHS,
    footer: DEFAULT_FOOTER,
  });

  const [registrationsCount, setRegistrationsCount] = useState(0);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.email) {
          setUserEmail(user.email);
        }

        // Fetch sections
        const { data: sections } = await supabase.from("site_sections").select("id, content");
        if (sections && sections.length > 0) {
          const loadedMap: any = {};
          sections.forEach((sec) => {
            loadedMap[sec.id] = sec.content;
          });
          setData((prev) => ({
            site_config: { ...DEFAULT_SITE_CONFIG, ...(loadedMap.site_config || {}) },
            hero: { ...DEFAULT_HERO, ...(loadedMap.hero || {}) },
            statistics: { ...DEFAULT_STATISTICS, ...(loadedMap.statistics || {}) },
            about: { ...DEFAULT_ABOUT, ...(loadedMap.about || {}) },
            benefits: { ...DEFAULT_BENEFITS, ...(loadedMap.benefits || {}) },
            timeline: { ...DEFAULT_TIMELINE, ...(loadedMap.timeline || {}) },
            ticket_fee: { ...DEFAULT_TICKET_FEE, ...(loadedMap.ticket_fee || {}) },
            sponsors: { ...DEFAULT_SPONSORS, ...(loadedMap.sponsors || {}) },
            booths: { ...DEFAULT_BOOTHS, ...(loadedMap.booths || {}) },
            footer: { ...DEFAULT_FOOTER, ...(loadedMap.footer || {}) },
          }));
        }

        // Count pending registrations
        const { count } = await supabase
          .from("registrations")
          .select("*", { count: "exact", head: true });
        if (count !== null) {
          setRegistrationsCount(count);
        }
      } catch (err) {
        console.error("Admin data load error", err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader userEmail={userEmail} />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          registrationsCount={registrationsCount}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <span className="text-xs">Đang tải dữ liệu cấu hình CMS...</span>
            </div>
          ) : (
            <>
              {activeTab === "general" && (
                <GeneralEditor initialConfig={data.site_config} initialFooter={data.footer} />
              )}
              {activeTab === "hero" && <HeroEditor initialHero={data.hero} />}
              {activeTab === "statistics" && (
                <StatisticsEditor initialStats={data.statistics} />
              )}
              {activeTab === "about" && <AboutEditor initialAbout={data.about} />}
              {activeTab === "benefits" && (
                <BenefitsEditor initialBenefits={data.benefits} />
              )}
              {activeTab === "timeline" && (
                <TimelineEditor initialTimeline={data.timeline} />
              )}
              {activeTab === "ticket_fee" && (
                <TicketFeeEditor initialFee={data.ticket_fee} />
              )}
              {activeTab === "sponsors" && (
                <SponsorsEditor initialSponsors={data.sponsors} />
              )}
              {activeTab === "booths" && <BoothsEditor initialBooths={data.booths} />}
              {activeTab === "registrations" && <RegistrationsManager />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
