import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import {
  DEFAULT_SITE_CONFIG,
  DEFAULT_HERO,
  DEFAULT_STATISTICS,
  DEFAULT_ABOUT,
  DEFAULT_BENEFITS,
  DEFAULT_TIMELINE,
  DEFAULT_SPEAKERS,
  DEFAULT_TICKET_FEE,
  DEFAULT_SPONSORS,
  DEFAULT_BOOTHS,
  DEFAULT_FOOTER,
  DEFAULT_NAVBAR,
  DEFAULT_REGISTRATION,
  DEFAULT_FAQ_CONTENT,
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

const DEFAULTS: Record<string, any> = {
  site_config: DEFAULT_SITE_CONFIG,
  navbar: DEFAULT_NAVBAR,
  hero: DEFAULT_HERO,
  statistics: DEFAULT_STATISTICS,
  about: DEFAULT_ABOUT,
  benefits: DEFAULT_BENEFITS,
  timeline: DEFAULT_TIMELINE,
  speakers: DEFAULT_SPEAKERS,
  ticket_fee: DEFAULT_TICKET_FEE,
  sponsors: DEFAULT_SPONSORS,
  booths: DEFAULT_BOOTHS,
  registration: DEFAULT_REGISTRATION,
  faq: DEFAULT_FAQ_CONTENT,
  footer: DEFAULT_FOOTER,
};

export async function getSectionContent<T>(key: string): Promise<T> {
  const fallback = DEFAULTS[key] as T;
  try {
    const cookieStore = await cookies();
    const supabase = createServerSupabase(cookieStore);
    const { data, error } = await supabase
      .from("site_sections")
      .select("content")
      .eq("id", key)
      .single();

    if (error || !data || !data.content) {
      return fallback;
    }

    return { ...fallback, ...data.content };
  } catch (err) {
    return fallback;
  }
}

export async function getAllLandingPageContent() {
  const [
    siteConfig,
    navbar,
    hero,
    statistics,
    about,
    benefits,
    timeline,
    speakers,
    ticketFee,
    sponsors,
    booths,
    registration,
    faq,
    footer,
  ] = await Promise.all([
    getSectionContent<SiteConfig>("site_config"),
    getSectionContent<NavbarContent>("navbar"),
    getSectionContent<HeroContent>("hero"),
    getSectionContent<StatisticsContent>("statistics"),
    getSectionContent<AboutContent>("about"),
    getSectionContent<BenefitsContent>("benefits"),
    getSectionContent<TimelineContent>("timeline"),
    getSectionContent<SpeakersContent>("speakers"),
    getSectionContent<TicketFeeContent>("ticket_fee"),
    getSectionContent<SponsorsContent>("sponsors"),
    getSectionContent<BoothsContent>("booths"),
    getSectionContent<RegistrationContent>("registration"),
    getSectionContent<FaqContent>("faq"),
    getSectionContent<FooterContent>("footer"),
  ]);

  return {
    siteConfig,
    navbar,
    hero,
    statistics,
    about,
    benefits,
    timeline,
    speakers,
    ticketFee,
    sponsors,
    booths,
    registration,
    faq,
    footer,
  };
}
