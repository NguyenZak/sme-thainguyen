"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Statistics from "@/components/Statistics";
import AboutEvent from "@/components/AboutEvent";
import Benefits from "@/components/Benefits";
import Timeline from "@/components/Timeline";
import SpeakersSection from "@/components/SpeakersSection";
import RegistrationFee from "@/components/RegistrationFee";
import SponsorSection from "@/components/SponsorSection";
import BoothSection from "@/components/BoothSection";
import RegistrationForm from "@/components/RegistrationForm";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import { createClient } from "@/utils/supabase/client";
import {
  SiteConfig,
  NavbarContent,
  HeroContent,
  StatisticsContent,
  AboutContent,
  BenefitsContent,
  TimelineContent,
  SpeakersContent,
  TicketFeeContent,
  SponsorsContent,
  BoothsContent,
  RegistrationContent,
  FaqContent,
  FooterContent,
} from "@/constants/defaultContent";

export interface LandingContent {
  siteConfig: SiteConfig;
  navbar: NavbarContent;
  hero: HeroContent;
  statistics: StatisticsContent;
  about: AboutContent;
  benefits: BenefitsContent;
  timeline: TimelineContent;
  speakers: SpeakersContent;
  ticketFee: TicketFeeContent;
  sponsors: SponsorsContent;
  booths: BoothsContent;
  registration: RegistrationContent;
  faq: FaqContent;
  footer: FooterContent;
}

const KEY_TO_PROP: Record<string, keyof LandingContent> = {
  site_config: "siteConfig",
  navbar: "navbar",
  hero: "hero",
  statistics: "statistics",
  about: "about",
  benefits: "benefits",
  timeline: "timeline",
  speakers: "speakers",
  ticket_fee: "ticketFee",
  sponsors: "sponsors",
  booths: "booths",
  registration: "registration",
  faq: "faq",
  footer: "footer",
};

interface LandingPageClientProps {
  initialContent: LandingContent;
}

export default function LandingPageClient({ initialContent }: LandingPageClientProps) {
  const [content, setContent] = useState<LandingContent>(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("landing_realtime_sections")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_sections" },
        (payload) => {
          if (payload.new && (payload.new as any).id) {
            const rowId = (payload.new as any).id;
            const newContent = (payload.new as any).content;
            const propKey = KEY_TO_PROP[rowId];

            if (propKey && newContent) {
              setContent((prev) => ({
                ...prev,
                [propKey]: Array.isArray(newContent)
                  ? newContent
                  : { ...prev[propKey], ...newContent },
              }));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const hiddenSections = content.siteConfig?.hiddenSections || [];
  const isVisible = (key: string) => !hiddenSections.includes(key);

  return (
    <main className="min-h-screen flex flex-col font-sans bg-[#F8FAFC]">
      {/* 1. Navigation Bar */}
      <Navbar content={content.navbar} />

      {/* 2. Hero Section with Embedded Countdown */}
      {isVisible("hero") && <Hero content={content.hero} />}
      {isVisible("statistics") && <Statistics content={content.statistics} />}

      {/* 3. About Forum & Core Purpose */}
      {isVisible("about") && <AboutEvent content={content.about} />}

      {/* 4. Keynote Speakers & Experts */}
      {isVisible("speakers") && <SpeakersSection content={content.speakers} />}

      {/* 5. Attendee Benefits & Core Value Propositions */}
      {isVisible("benefits") && <Benefits content={content.benefits} />}

      {/* 6. Agenda Timeline */}
      {isVisible("timeline") && <Timeline content={content.timeline} />}

      {/* 7. Sponsors Logo Wall & Packages */}
      {isVisible("sponsors") && <SponsorSection content={content.sponsors} />}

      {/* 8. Exhibition Booth Section */}
      {isVisible("booths") && <BoothSection content={content.booths} />}

      {/* 9. Registration Fee & Inclusions Card */}
      {isVisible("ticket_fee") && <RegistrationFee content={content.ticketFee} />}

      {/* 10. Direct Online Registration Form */}
      {isVisible("registration") && (
        <RegistrationForm
          content={content.registration}
          siteConfig={content.siteConfig}
          ticketFee={content.ticketFee}
        />
      )}

      {/* 11. FAQ Accordion Section */}
      {isVisible("faq") && <FaqSection content={content.faq} />}

      {/* 12. Footer */}
      <Footer content={content.footer} />

      {/* 13. Mobile Floating Sticky CTA */}
      {isVisible("registration") && <MobileStickyCTA content={content.registration} />}
    </main>
  );
}
