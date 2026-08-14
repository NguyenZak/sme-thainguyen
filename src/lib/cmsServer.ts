import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
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

const STORE_PATH = path.join(process.cwd(), "src", "data", "cms_store.json");

function getLocalStoreContent(key: string): any {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      const json = JSON.parse(raw || "{}");
      return json[key];
    }
  } catch (e) {
    // ignore
  }
  return null;
}

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
  const codeDefault = DEFAULTS[key] as T;
  const localSaved = getLocalStoreContent(key);
  const baseFallback = localSaved
    ? (Array.isArray(codeDefault)
        ? (Array.isArray(localSaved) ? localSaved : codeDefault)
        : { ...codeDefault, ...localSaved })
    : codeDefault;

  try {
    const cookieStore = await cookies();
    const supabase = createServerSupabase(cookieStore);
    const { data, error } = await supabase
      .from("site_sections")
      .select("content")
      .eq("id", key)
      .single();

    if (error || !data || !data.content) {
      return baseFallback as T;
    }

    return (Array.isArray(baseFallback)
      ? data.content
      : { ...baseFallback, ...data.content }) as T;
  } catch (err) {
    return baseFallback as T;
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
