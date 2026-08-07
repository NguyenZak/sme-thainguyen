import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { cookies } from "next/headers";
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
  SiteConfig,
  HeroContent,
  StatisticsContent,
  AboutContent,
  BenefitsContent,
  TimelineContent,
  TicketFeeContent,
  SponsorsContent,
  BoothsContent,
  FooterContent,
} from "@/constants/defaultContent";

const DEFAULTS: Record<string, any> = {
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
    hero,
    statistics,
    about,
    benefits,
    timeline,
    ticketFee,
    sponsors,
    booths,
    footer,
  ] = await Promise.all([
    getSectionContent<SiteConfig>("site_config"),
    getSectionContent<HeroContent>("hero"),
    getSectionContent<StatisticsContent>("statistics"),
    getSectionContent<AboutContent>("about"),
    getSectionContent<BenefitsContent>("benefits"),
    getSectionContent<TimelineContent>("timeline"),
    getSectionContent<TicketFeeContent>("ticket_fee"),
    getSectionContent<SponsorsContent>("sponsors"),
    getSectionContent<BoothsContent>("booths"),
    getSectionContent<FooterContent>("footer"),
  ]);

  return {
    siteConfig,
    hero,
    statistics,
    about,
    benefits,
    timeline,
    ticketFee,
    sponsors,
    booths,
    footer,
  };
}
