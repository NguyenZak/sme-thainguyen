import type { Metadata } from "next";
import { Wix_Madefor_Display, Inter } from "next/font/google";
import Script from "next/script";
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
import { SiteConfig, FaqItem, DEFAULT_FAQS } from "@/constants/defaultContent";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSectionContent<SiteConfig>("site_config");

  const title =
    siteConfig.metaTitle ||
    "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026 | May Plaza Hotel Thai Nguyen";
  const description =
    siteConfig.metaDescription ||
    "Sự kiện xúc tiến thương mại & mở rộng thị trường trọng điểm 2026 dành cho cộng đồng Doanh nghiệp vừa và nhỏ Việt Nam. 18-20/09/2026 tại May Plaza Hotel Thái Nguyên.";
  const iconUrl = siteConfig.faviconUrl || siteConfig.logoUrl || "/logo.png";
  const canonicalUrl = siteConfig.canonicalUrl || "https://sme-thainguyen.vercel.app";
  
  let rawOg = siteConfig.ogImageUrl || siteConfig.logoUrl || "/images/hero-bg.jpg";
  const ogImgUrl = rawOg.startsWith("http")
    ? rawOg
    : `https://sme-thainguyen.vercel.app${rawOg.startsWith("/") ? "" : "/"}${rawOg}`;

  const customKeywords = siteConfig.keywords && siteConfig.keywords.length > 0
    ? siteConfig.keywords
    : [
        "Diễn đàn SME Việt Nam 2026",
        "TASME Thái Nguyên",
        "Kết nối giao thương SME",
        "Xúc tiến thương mại Thái Nguyên",
        "May Plaza Hotel Thai Nguyen",
        "B2B Matching",
        "Đăng ký gian hàng triển lãm",
        "Tài trợ diễn đàn SME",
        "Hội doanh nghiệp vừa và nhỏ",
      ];

  return {
    metadataBase: new URL("https://sme-thainguyen.vercel.app"),
    title,
    description,
    keywords: customKeywords,
    authors: [{ name: siteConfig.organizer || "Hiệp hội DNNVV tỉnh Thái Nguyên (TASME)" }],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "vi-VN": canonicalUrl,
      },
    },
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
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
  const canonicalUrl = siteConfig.canonicalUrl || "https://sme-thainguyen.vercel.app";
  
  let rawOg = siteConfig.ogImageUrl || siteConfig.logoUrl || "/images/hero-bg.jpg";
  const fullOgImgUrl = rawOg.startsWith("http")
    ? rawOg
    : `https://sme-thainguyen.vercel.app${rawOg.startsWith("/") ? "" : "/"}${rawOg}`;

  // Complete Schema.org Structured Data Graph
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "@id": `${canonicalUrl}#event`,
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
          "url": canonicalUrl
        },
        "offers": {
          "@type": "Offer",
          "url": `${canonicalUrl}#register`,
          "price": (siteConfig.eventPriceVND || 1450000).toString(),
          "priceCurrency": "VND",
          "availability": "https://schema.org/InStock",
          "validFrom": "2026-01-01T00:00:00+07:00"
        }
      },
      {
        "@type": "Organization",
        "@id": `${canonicalUrl}#organization`,
        "name": siteConfig.organizer || "Hiệp hội Doanh nghiệp nhỏ và vừa tỉnh Thái Nguyên (TASME)",
        "url": canonicalUrl,
        "logo": fullOgImgUrl,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": siteConfig.hotline || "0815.340.488",
          "contactType": "customer service",
          "areaServed": "VN",
          "availableLanguage": ["Vietnamese", "English"]
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": DEFAULT_FAQS.map((faq: FaqItem) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Trang chủ",
            "item": canonicalUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Diễn đàn SME Việt Nam 2026",
            "item": `${canonicalUrl}#about`
          }
        ]
      }
    ]
  };

  return (
    <html
      lang="vi"
      className={`${wixDisplay.variable} ${inter.variable} scroll-smooth`}
    >
      <head>
        <link rel="icon" href={faviconHref} />
        <link rel="apple-touch-icon" href={faviconHref} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:image" content={fullOgImgUrl} />
        <meta property="og:image:secure_url" content={fullOgImgUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content={fullOgImgUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-[#1A1A1A] antialiased selection:bg-[#0B5ED7] selection:text-white">
        {/* Google Analytics 4 */}
        {siteConfig.gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${siteConfig.gaMeasurementId}');
              `}
            </Script>
          </>
        )}

        {/* Meta Pixel (Facebook Pixel) */}
        {siteConfig.facebookPixelId && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${siteConfig.facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
