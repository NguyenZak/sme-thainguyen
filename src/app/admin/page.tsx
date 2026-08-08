"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import GeneralEditor from "@/components/admin/GeneralEditor";
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
import RegistrationsManager from "@/components/admin/RegistrationsManager";
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
  const [activeTab, setActiveTab] = useState<AdminTab>("general");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
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
            sponsors: { ...DEFAULT_SPONSORS, ...(loadedMap.sponsors || {}) },
            booths: { ...DEFAULT_BOOTHS, ...(loadedMap.booths || {}) },
            registration: { ...DEFAULT_REGISTRATION, ...(loadedMap.registration || {}) },
            faq: { ...DEFAULT_FAQ_CONTENT, ...(loadedMap.faq || {}) },
            footer: { ...DEFAULT_FOOTER, ...(loadedMap.footer || {}) },
          });
        }

        const { count } = await supabase.from("registrations").select("*", { count: "exact", head: true });
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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <AdminHeader userEmail={userEmail} />

      <div className="flex-1 flex flex-col md:flex-row min-w-0 relative">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          registrationsCount={registrationsCount}
        />

        <main className="flex-1 p-6 md:p-8 bg-slate-100 min-w-0">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
              <span className="text-xs font-medium">Đang tải dữ liệu cấu hình CMS...</span>
            </div>
          ) : (
            <>
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
              {activeTab === "navbar" && <NavbarEditor initialNavbar={data.navbar} />}
              {activeTab === "hero" && <HeroEditor initialHero={data.hero} />}
              {activeTab === "statistics" && (
                <StatisticsEditor initialStats={data.statistics} />
              )}
              {activeTab === "about" && <AboutEditor initialAbout={data.about} />}
              {activeTab === "speakers" && (
                <SpeakersEditor initialSpeakers={data.speakers} />
              )}
              {activeTab === "benefits" && (
                <BenefitsEditor initialBenefits={data.benefits} />
              )}
              {activeTab === "timeline" && (
                <TimelineEditor initialTimeline={data.timeline} />
              )}
              {activeTab === "ticket_fee" && (
                <TicketFeeEditor initialFee={data.ticket_fee} />
              )}
              {activeTab === "registration" && (
                <RegistrationEditor initialRegistration={data.registration} />
              )}
              {activeTab === "sponsors" && (
                <SponsorsEditor initialSponsors={data.sponsors} />
              )}
              {activeTab === "booths" && <BoothsEditor initialBooths={data.booths} />}
              {activeTab === "faq" && <FaqEditor initialContent={data.faq} />}
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
