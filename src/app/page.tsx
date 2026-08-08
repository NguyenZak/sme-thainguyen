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
import { getAllLandingPageContent } from "@/lib/cmsServer";

export default async function Home() {
  const content = await getAllLandingPageContent();

  const hiddenSections = content.siteConfig.hiddenSections || [];
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

      {/* 4. Keynote Speakers & Experts (Authority & Prestige) */}
      {isVisible("speakers") && <SpeakersSection content={content.speakers} />}

      {/* 5. Attendee Benefits & Core Value Propositions */}
      {isVisible("benefits") && <Benefits content={content.benefits} />}

      {/* 6. 3-Day Program Agenda Timeline */}
      {isVisible("timeline") && <Timeline content={content.timeline} />}

      {/* 7. Sponsors Logo Wall & Sponsorship Packages (Social Proof & Trust) */}
      {isVisible("sponsors") && <SponsorSection content={content.sponsors} />}

      {/* 8. 100 Booth Exhibition & Interactive Floor Plan */}
      {isVisible("booths") && <BoothSection content={content.booths} />}

      {/* 9. Registration Fee & Inclusions Card (Offer Transparency) */}
      {isVisible("ticket_fee") && <RegistrationFee content={content.ticketFee} />}

      {/* 10. Direct Online Registration Form (Action Destination) */}
      {isVisible("registration") && (
        <RegistrationForm
          content={content.registration}
          siteConfig={content.siteConfig}
          ticketFee={content.ticketFee}
        />
      )}

      {/* 11. FAQ Accordion Section (High Conversion & Google FAQ Schema) */}
      <FaqSection />

      {/* 12. Footer & Location Google Maps */}
      <Footer content={content.footer} />

      {/* 13. Mobile Floating Sticky CTA */}
      {isVisible("registration") && <MobileStickyCTA content={content.registration} />}
    </main>
  );
}
