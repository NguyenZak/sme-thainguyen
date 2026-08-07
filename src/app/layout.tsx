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

export const metadata: Metadata = {
  metadataBase: new URL("https://smevietnam2026.vn"),
  title: "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026 | May Plaza Hotel Thai Nguyen",
  description:
    "Sự kiện xúc tiến thương mại & mở rộng thị trường trọng điểm 2026 dành cho cộng đồng Doanh nghiệp vừa và nhỏ Việt Nam. 18-20/09/2026 tại May Plaza Hotel Thái Nguyên.",
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
  authors: [{ name: "Hiệp hội DNNVV tỉnh Thái Nguyên (TASME)" }],
  openGraph: {
    title: "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026",
    description:
      "Kết nối doanh nghiệp - Xúc tiến đầu tư - Mở rộng thị trường. Sự kiện quy tụ 100+ phiên B2B Matching, lãnh đạo chính phủ và hàng nghìn cơ hội kinh doanh.",
    url: "https://smevietnam2026.vn",
    siteName: "DIỄN ĐÀN SME VIỆT NAM 2026",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Diễn đàn kết nối giao thương SME Việt Nam 2026",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026",
    description:
      "Kết nối doanh nghiệp - Xúc tiến đầu tư - Mở rộng thị trường. 18-20/09/2026 tại Thái Nguyên.",
    images: ["/images/hero-bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${wixDisplay.variable} ${inter.variable} scroll-smooth`}
    >
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-[#1A1A1A] antialiased selection:bg-[#0B5ED7] selection:text-white">
        {children}
      </body>
    </html>
  );
}
