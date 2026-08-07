import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Statistics from "@/components/Statistics";
import AboutEvent from "@/components/AboutEvent";
import Benefits from "@/components/Benefits";
import Timeline from "@/components/Timeline";
import RegistrationFee from "@/components/RegistrationFee";
import SponsorSection from "@/components/SponsorSection";
import BoothSection from "@/components/BoothSection";
import RegistrationForm from "@/components/RegistrationForm";
import Footer from "@/components/Footer";
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
      "https://smevietnam2026.vn/images/hero-bg.jpg",
      "https://smevietnam2026.vn/logo.png"
    ],
    "description": content.siteConfig.metaDescription,
    "offers": {
      "@type": "Offer",
      "url": "https://smevietnam2026.vn#register",
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

      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section with Embedded Statistics */}
      <Hero content={content.hero} statsContent={content.statistics} />

      {/* About Forum & Purpose */}
      <AboutEvent content={content.about} />

      {/* Attendee Benefits & Value */}
      <Benefits content={content.benefits} />

      {/* 3-Day Program Timeline */}
      <Timeline content={content.timeline} />

      {/* Registration Fee & Inclusions Card */}
      <RegistrationFee content={content.ticketFee} />

      {/* Sponsorship Packages (Diamond/Gold/Silver/Bronze) */}
      <SponsorSection content={content.sponsors} />

      {/* Booth Exhibition & Interactive Floor Plan */}
      <BoothSection content={content.booths} />

      {/* Online Registration Form */}
      <RegistrationForm />

      {/* Footer & Location Map */}
      <Footer content={content.footer} />
    </main>
  );
}
