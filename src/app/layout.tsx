import type { Metadata } from "next";
import { Wix_Madefor_Display, Inter } from "next/font/google";
import "./globals.css";

const wixDisplay = Wix_Madefor_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-wix-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

import { getSectionContent } from "@/lib/cmsServer";
import { SiteConfig } from "@/constants/defaultContent";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSectionContent<SiteConfig>("site_config");

  const title =
    siteConfig.metaTitle ||
    "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026 | May Plaza Hotel Thai Nguyen";
  const description =
    siteConfig.metaDescription ||
    "Sự kiện xúc tiến thương mại & mở rộng thị trường trọng điểm 2026 dành cho cộng đồng Doanh nghiệp vừa và nhỏ Việt Nam. 18-20/09/2026 tại May Plaza Hotel Thái Nguyên.";
  const iconUrl = siteConfig.faviconUrl || siteConfig.logoUrl || "/logo.png";
  
  let rawOg = siteConfig.ogImageUrl || siteConfig.logoUrl || "/images/hero-bg.jpg";
  const ogImgUrl = rawOg.startsWith("http")
    ? rawOg
    : `https://sme-thainguyen.vercel.app${rawOg.startsWith("/") ? "" : "/"}${rawOg}`;

  return {
    metadataBase: new URL("https://sme-thainguyen.vercel.app"),
    title,
    description,
    keywords: [
      "Diễn đàn SME Việt Nam 2026",
      "TASME Thái Nguyên",
      "Kết nối giao thương SME",
      "Xúc tiến thương mại",
      "May Plaza Hotel Thai Nguyen",
      "B2B Matching",
      "Đăng ký gian hàng",
      "Tài trợ diễn đàn SME",
    ],
    authors: [{ name: siteConfig.organizer || "Hiệp hội DNNVV tỉnh Thái Nguyên (TASME)" }],
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    openGraph: {
      title,
      description,
      url: "https://sme-thainguyen.vercel.app",
      siteName: siteConfig.siteName || "DIỄN ĐÀN SME VIỆT NAM 2026",
      images: [
        {
          url: ogImgUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImgUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

import { ToastContainer } from "@/components/ui/Toast";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = await getSectionContent<SiteConfig>("site_config");
  const faviconHref = siteConfig.faviconUrl || siteConfig.logoUrl || "/logo.png";
  
  let rawOg = siteConfig.ogImageUrl || siteConfig.logoUrl || "/images/hero-bg.jpg";
  const fullOgImgUrl = rawOg.startsWith("http")
    ? rawOg
    : `https://sme-thainguyen.vercel.app${rawOg.startsWith("/") ? "" : "/"}${rawOg}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": siteConfig.siteName || "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026",
    "description": siteConfig.metaDescription || "Sự kiện xúc tiến thương mại & mở rộng thị trường trọng điểm 2026 dành cho cộng đồng Doanh nghiệp vừa và nhỏ Việt Nam.",
    "image": [fullOgImgUrl],
    "startDate": "2026-09-18T08:00:00+07:00",
    "endDate": "2026-09-20T17:30:00+07:00",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "May Plaza Hotel Thai Nguyen",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Số 668 Phan Đình Phùng",
        "addressLocality": "TP. Thái Nguyên",
        "addressRegion": "Thái Nguyên",
        "postalCode": "250000",
        "addressCountry": "VN"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": siteConfig.organizer || "Hiệp hội Doanh nghiệp nhỏ và vừa tỉnh Thái Nguyên (TASME)",
      "url": "https://sme-thainguyen.vercel.app"
    }
  };

  return (
    <html
      lang="vi"
      className={`${wixDisplay.variable} ${inter.variable} scroll-smooth`}
    >
      <head>
        <link rel="icon" href={faviconHref} />
        <link rel="apple-touch-icon" href={faviconHref} />
        <meta property="og:image" content={fullOgImgUrl} />
        <meta property="og:image:secure_url" content={fullOgImgUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content={fullOgImgUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-[#1A1A1A] antialiased selection:bg-[#0B5ED7] selection:text-white">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
