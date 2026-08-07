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
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import { getAllLandingPageContent } from "@/lib/cmsServer";

export default async function Home() {
  const content = await getAllLandingPageContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BusinessEvent",
    "name": content.siteConfig.siteName,
    "startDate": content.hero.targetDateISO || "2026-09-18T08:00:00+07:00",
    "endDate": "2026-09-20T17:00:00+07:00",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": content.hero.venueText || "May Plaza Hotel Thai Nguyen",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": content.siteConfig.address,
        "addressLocality": "Thái Nguyên",
        "addressRegion": "Thái Nguyên",
        "postalCode": "250000",
        "addressCountry": "VN"
      }
    },
    "image": [
      "https://sme-thainguyen.vercel.app/images/hero-bg.jpg",
      "https://sme-thainguyen.vercel.app/logo.png"
    ],
    "description": content.siteConfig.metaDescription,
    "offers": {
      "@type": "Offer",
      "url": "https://sme-thainguyen.vercel.app#register",
      "price": content.ticketFee.priceVND.toString(),
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock"
    },
    "organizer": {
      "@type": "Organization",
      "name": content.siteConfig.organizer
    }
  };

  return (
    <main className="min-h-screen flex flex-col font-sans bg-[#F8FAFC]">
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Navigation Bar */}
      <Navbar content={content.navbar} />

      {/* 2. Hero Section with Embedded Countdown */}
      <Hero content={content.hero} />
      <Statistics content={content.statistics} />

      {/* 3. About Forum & Core Purpose */}
      <AboutEvent content={content.about} />

      {/* 4. Keynote Speakers & Experts (Authority & Prestige) */}
      <SpeakersSection content={content.speakers} />

      {/* 5. Attendee Benefits & Core Value Propositions */}
      <Benefits content={content.benefits} />

      {/* 6. 3-Day Program Agenda Timeline */}
      <Timeline content={content.timeline} />

      {/* 7. Sponsors Logo Wall & Sponsorship Packages (Social Proof & Trust) */}
      <SponsorSection content={content.sponsors} />

      {/* 8. 100 Booth Exhibition & Interactive Floor Plan */}
      <BoothSection content={content.booths} />

      {/* 9. Registration Fee & Inclusions Card (Offer Transparency) */}
      <RegistrationFee content={content.ticketFee} />

      {/* 10. Direct Online Registration Form (Action Destination) */}
      <RegistrationForm content={content.registration} />

      {/* 11. Footer & Location Google Maps */}
      <Footer content={content.footer} />

      {/* 12. Mobile Floating Sticky CTA */}
      <MobileStickyCTA content={content.registration} />
    </main>
  );
}
