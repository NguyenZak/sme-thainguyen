"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import GeneralEditor from "@/components/admin/GeneralEditor";
import SepayQrEditor from "@/components/admin/SepayQrEditor";
import NavbarEditor from "@/components/admin/NavbarEditor";
import HeroEditor from "@/components/admin/HeroEditor";
import StatisticsEditor from "@/components/admin/StatisticsEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import SpeakersEditor from "@/components/admin/SpeakersEditor";
import BenefitsEditor from "@/components/admin/BenefitsEditor";
import TimelineEditor from "@/components/admin/TimelineEditor";
import TicketFeeEditor from "@/components/admin/TicketFeeEditor";
import SponsorsEditor from "@/components/admin/SponsorsEditor";
import BoothsEditor from "@/components/admin/BoothsEditor";
import RegistrationEditor from "@/components/admin/RegistrationEditor";
import FaqEditor from "@/components/admin/FaqEditor";
import FooterEditor from "@/components/admin/FooterEditor";
import DashboardOverview from "@/components/admin/DashboardOverview";
import RegistrationsManager, { RegistrationRecord } from "@/components/admin/RegistrationsManager";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import {
  DEFAULT_SITE_CONFIG,
  DEFAULT_NAVBAR,
  DEFAULT_HERO,
  DEFAULT_STATISTICS,
  DEFAULT_ABOUT,
  DEFAULT_SPEAKERS,
  DEFAULT_BENEFITS,
  DEFAULT_TIMELINE,
  DEFAULT_TICKET_FEE,
  DEFAULT_SPONSORS,
  DEFAULT_BOOTHS,
  DEFAULT_REGISTRATION,
  DEFAULT_FAQ_CONTENT,
  DEFAULT_FOOTER,
  SiteConfig,
  NavbarContent,
  HeroContent,
  StatisticsContent,
  AboutContent,
  SpeakersContent,
  BenefitsContent,
  TimelineContent,
  TicketFeeContent,
  SponsorsContent,
  BoothsContent,
  RegistrationContent,
  FaqContent,
  FooterContent,
} from "@/constants/defaultContent";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [registrationsList, setRegistrationsList] = useState<RegistrationRecord[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved !== null) {
      setSidebarCollapsed(saved === "true");
    }
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  type AdminData = {
    site_config: SiteConfig;
    navbar: NavbarContent;
    hero: HeroContent;
    statistics: StatisticsContent;
    about: AboutContent;
    speakers: SpeakersContent;
    benefits: BenefitsContent;
    timeline: TimelineContent;
    ticket_fee: TicketFeeContent;
    sponsors: SponsorsContent;
    booths: BoothsContent;
    registration: RegistrationContent;
    faq: FaqContent;
    footer: FooterContent;
  };

  const [data, setData] = useState<AdminData>({
    site_config: DEFAULT_SITE_CONFIG,
    navbar: DEFAULT_NAVBAR,
    hero: DEFAULT_HERO,
    statistics: DEFAULT_STATISTICS,
    about: DEFAULT_ABOUT,
    speakers: DEFAULT_SPEAKERS,
    benefits: DEFAULT_BENEFITS,
    timeline: DEFAULT_TIMELINE,
    ticket_fee: DEFAULT_TICKET_FEE,
    sponsors: DEFAULT_SPONSORS,
    booths: DEFAULT_BOOTHS,
    registration: DEFAULT_REGISTRATION,
    faq: DEFAULT_FAQ_CONTENT,
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

        const { data: sections } = await supabase.from("site_sections").select("id, content");
        if (sections && sections.length > 0) {
          const loadedMap: Record<string, unknown> = {};
          sections.forEach((sec) => {
            loadedMap[sec.id] = sec.content;
          });

          setData({
            site_config: { ...DEFAULT_SITE_CONFIG, ...(loadedMap.site_config || {}) },
            navbar: { ...DEFAULT_NAVBAR, ...(loadedMap.navbar || {}) },
            hero: { ...DEFAULT_HERO, ...(loadedMap.hero || {}) },
            statistics: { ...DEFAULT_STATISTICS, ...(loadedMap.statistics || {}) },
            about: { ...DEFAULT_ABOUT, ...(loadedMap.about || {}) },
            speakers: { ...DEFAULT_SPEAKERS, ...(loadedMap.speakers || {}) },
            benefits: { ...DEFAULT_BENEFITS, ...(loadedMap.benefits || {}) },
            timeline: { ...DEFAULT_TIMELINE, ...(loadedMap.timeline || {}) },
            ticket_fee: { ...DEFAULT_TICKET_FEE, ...(loadedMap.ticket_fee || {}) },
            sponsors: loadedMap.sponsors
              ? {
                  ...DEFAULT_SPONSORS,
                  ...(loadedMap.sponsors as any),
                  items: Array.isArray((loadedMap.sponsors as any)?.items)
                    ? (loadedMap.sponsors as any).items
                    : DEFAULT_SPONSORS.items,
                }
              : DEFAULT_SPONSORS,
            booths: { ...DEFAULT_BOOTHS, ...(loadedMap.booths || {}) },
            registration: { ...DEFAULT_REGISTRATION, ...(loadedMap.registration || {}) },
            faq: { ...DEFAULT_FAQ_CONTENT, ...(loadedMap.faq || {}) },
            footer: { ...DEFAULT_FOOTER, ...(loadedMap.footer || {}) },
          });
        }

        const { data: regData, count } = await supabase
          .from("registrations")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false });

        if (regData) {
          setRegistrationsList(regData);
        }
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

    // Supabase Realtime Subscriptions for CMS Site Sections & Registrations Count
    const supabase = createClient();

    const sectionsChannel = supabase
      .channel("admin_realtime_sections")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_sections" },
        (payload) => {
          if (payload.new && (payload.new as any).id) {
            const secId = (payload.new as any).id as keyof AdminData;
            const newContent = (payload.new as any).content;
            if (secId && newContent) {
              setData((prev) => ({
                ...prev,
                [secId]: Array.isArray(newContent) ? newContent : { ...prev[secId], ...newContent },
              }));
            }
          }
        }
      )
      .subscribe();

    const registrationsChannel = supabase
      .channel("admin_realtime_registrations_count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "registrations" },
        async (payload) => {
          const { data: regData, count } = await supabase
            .from("registrations")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false });

          if (regData) {
            setRegistrationsList(regData);
          }
          if (count !== null) {
            setRegistrationsCount(count);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sectionsChannel);
      supabase.removeChannel(registrationsChannel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <AdminHeader
        userEmail={userEmail}
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="flex-1 flex flex-col md:flex-row min-w-0 relative">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          registrationsCount={registrationsCount}
          isCollapsed={sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />

        <main className="flex-1 p-6 md:p-8 bg-slate-100 min-w-0">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
              <span className="text-xs font-medium">Đang tải dữ liệu cấu hình CMS...</span>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardOverview
                  data={data}
                  registrations={registrationsList}
                  registrationsCount={registrationsCount}
                  onNavigateTab={setActiveTab}
                />
              )}
              {activeTab === "general" && (
                <GeneralEditor
                  initialConfig={data.site_config}
                  initialFooter={data.footer}
                  onSaveSuccess={(updatedConfig, updatedFooter) => {
                    setData((prev) => ({
                      ...prev,
                      site_config: updatedConfig,
                      footer: updatedFooter,
                    }));
                  }}
                />
              )}
              {activeTab === "sepay_qr" && (
                <SepayQrEditor
                  initialConfig={data.site_config}
                  onSaveSuccess={(updatedConfig) => {
                    setData((prev) => ({
                      ...prev,
                      site_config: updatedConfig,
                    }));
                  }}
                />
              )}
              {activeTab === "navbar" && (
                <NavbarEditor
                  initialNavbar={data.navbar}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, navbar: updated }))}
                />
              )}
              {activeTab === "hero" && (
                <HeroEditor
                  initialHero={data.hero}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, hero: updated }))}
                />
              )}
              {activeTab === "statistics" && (
                <StatisticsEditor
                  initialStats={data.statistics}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, statistics: updated }))}
                />
              )}
              {activeTab === "about" && (
                <AboutEditor
                  initialAbout={data.about}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, about: updated }))}
                />
              )}
              {activeTab === "speakers" && (
                <SpeakersEditor
                  initialSpeakers={data.speakers}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, speakers: updated }))}
                />
              )}
              {activeTab === "benefits" && (
                <BenefitsEditor
                  initialBenefits={data.benefits}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, benefits: updated }))}
                />
              )}
              {activeTab === "timeline" && (
                <TimelineEditor
                  initialTimeline={data.timeline}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, timeline: updated }))}
                />
              )}
              {activeTab === "ticket_fee" && (
                <TicketFeeEditor
                  initialFee={data.ticket_fee}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, ticket_fee: updated }))}
                />
              )}
              {activeTab === "registration" && (
                <RegistrationEditor
                  initialRegistration={data.registration}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, registration: updated }))}
                />
              )}
              {activeTab === "sponsors" && (
                <SponsorsEditor
                  initialSponsors={data.sponsors}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, sponsors: updated }))}
                />
              )}
              {activeTab === "booths" && (
                <BoothsEditor
                  initialBooths={data.booths}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, booths: updated }))}
                />
              )}
              {activeTab === "faq" && (
                <FaqEditor
                  initialContent={data.faq}
                  onSaveSuccess={(updated) => setData((prev) => ({ ...prev, faq: updated }))}
                />
              )}
              {activeTab === "footer" && (
                <FooterEditor
                  initialFooter={data.footer}
                  onSaveSuccess={(updatedFooter) => {
                    setData((prev) => ({
                      ...prev,
                      footer: updatedFooter,
                    }));
                  }}
                />
              )}
              {activeTab === "registrations" && <RegistrationsManager />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

