import LandingPageClient from "@/components/LandingPageClient";
import { getAllLandingPageContent } from "@/lib/cmsServer";

export default async function Home() {
  const content = await getAllLandingPageContent();

  return <LandingPageClient initialContent={content} />;
}

