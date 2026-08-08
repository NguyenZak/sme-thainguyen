export type SectionKey =
  | "site_config"
  | "navbar"
  | "hero"
  | "statistics"
  | "about"
  | "benefits"
  | "timeline"
  | "ticket_fee"
  | "sponsors"
  | "booths"
  | "registration"
  | "faq"
  | "footer";

export interface SiteConfig {
  siteName: string;
  organizer: string;
  hotline: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  metaTitle: string;
  metaDescription: string;
  eventDateISO: string;
  eventPriceVND: number;
  logoUrl?: string;
  faviconUrl?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  gaMeasurementId?: string;
  facebookPixelId?: string;
  keywords?: string[];
  telegramBotToken?: string;
  telegramChatId?: string;
  telegramThreadIdDelegate?: string;
  telegramThreadIdSponsor?: string;
  telegramThreadIdBooth?: string;
  telegramEnabled?: boolean;
  googleSheetScriptUrl?: string;
  googleSheetEnabled?: boolean;
  sepayEnabled?: boolean;
  sepayBankCode?: string;
  sepayAccountNumber?: string;
  sepayAccountName?: string;
  sepayApiKey?: string;
  hiddenSections?: string[];
}

export interface HeroContent {
  badgeText: string;
  honorBadgeText?: string;
  titlePrefix?: string;
  titleSuffix?: string;
  mainTitle: string;
  subTitle: string;
  englishTitle?: string;
  sloganText?: string;
  keywords: string[];
  tickerMessages: string[];
  countdownLabel?: string;
  eventDateText: string;
  dateLabel?: string;
  targetDateISO: string;
  venueLabel?: string;
  venueText: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  tertiaryCtaText: string;
  tertiaryCtaLink: string;
}

export interface NavbarLink {
  name: string;
  href: string;
}

export interface NavbarContent {
  brandName: string;
  brandSub: string;
  logoSrc: string;
  eventDateText?: string;
  navLinks: NavbarLink[];
  ctaText: string;
  ctaLink: string;
  mobileRegisterText: string;
}

export interface RegistrationContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  delegateTab: string;
  sponsorTab: string;
  boothTab: string;
  delegateIntro: string;
  sponsorIntro: string;
  boothIntro: string;
  sponsorTiers: string[];
  boothOptions: string[];
  submitButtonText: string;
  mobileDelegateLabel: string;
  mobileSponsorLabel: string;
  mobileBoothLabel: string;
  delegateEmailSubject?: string;
  delegateEmailBody?: string;
  delegatePosterUrl?: string;
  sponsorEmailSubject?: string;
  sponsorEmailBody?: string;
  sponsorPosterUrl?: string;
  boothEmailSubject?: string;
  boothEmailBody?: string;
  boothPosterUrl?: string;
}

export interface StatisticItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  subtext: string;
  iconName: string;
}

export interface StatisticsContent {
  items: StatisticItem[];
}

export interface FeatureCard {
  id: string;
  rank: string;
  title: string;
  description: string;
  footerLabel: string;
  footerText: string;
  iconName: string;
}

export interface AttendeeTag {
  id: string;
  rank: string;
  label: string;
  sub: string;
  tier: "vip" | "gold" | "standard";
  iconName: string;
  count: string;
}

export interface AboutContent {
  badge: string;
  title: string;
  highlightText: string;
  descriptionParagraph1: string;
  descriptionParagraph2: string;
  bullets: string[];
  imageUrl: string;
  statCardNumber: string;
  statCardLabel: string;
  featureCards: FeatureCard[];
  attendeeTags: AttendeeTag[];
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface BenefitsContent {
  badge: string;
  title: string;
  subtitle: string;
  items: BenefitItem[];
}

export interface TimelineSlot {
  id: string;
  dayNumber: number;
  dayTitle: string;
  timeSlot: string;
  title: string;
  speaker?: string;
  location?: string;
  description?: string;
}

export interface TimelineContent {
  badge: string;
  title: string;
  subtitle: string;
  days: {
    dayNumber: number;
    dayTitle: string;
    dateText: string;
  }[];
  slots: TimelineSlot[];
}

export interface TicketFeeContent {
  badge: string;
  title: string;
  subtitle: string;
  priceVND: number;
  originalPriceVND: number;
  ticketBadgeText: string;
  earlyBirdLabel?: string;
  remainingSlots?: number;
  totalSlots?: number;
  earlyBirdSlotText?: string;
  inclusions: string[];
  ctaText: string;
  guaranteeText: string;
}

export interface SponsorPackageTier {
  id: string;
  name: string;
  price: string;
  badgeColor?: string;
  borderAccent?: string;
  popular?: boolean;
  perks: string[];
}

export interface SponsorPriorityCategory {
  id: string;
  name: string;
  fee: string;
}

export interface SponsorMilestone {
  id: string;
  time: string;
  desc: string;
}

export interface SponsorItem {
  id: string;
  name: string;
  tier: "diamond" | "gold" | "silver" | "bronze" | "co-organizer" | "companion";
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
}

export interface SponsorsContent {
  badge: string;
  title: string;
  subtitle: string;
  prospectusPdfUrl?: string;
  packages?: SponsorPackageTier[];
  priorityCategories?: SponsorPriorityCategory[];
  milestones?: SponsorMilestone[];
  items: SponsorItem[];
}

export interface BoothItem {
  id: string;
  boothCode: string;
  areaName: string;
  size: string;
  priceVND: number;
  status: "available" | "reserved" | "sold";
  reservedBy?: string;
  description?: string;
}

export interface BoothsContent {
  badge: string;
  title: string;
  subtitle: string;
  mapImageUrl: string;
  totalBooths?: number;
  availableBooths?: number;
  boothPackageBadge?: string;
  boothPackageTitle?: string;
  boothPackageSubtitle?: string;
  boothPackageNote?: string;
  priceVND?: number;
  priceFormatted?: string;
  priceUnit?: string;
  inclusions?: string[];
  ctaText?: string;
  modalTitle?: string;
  modalSubtitle?: string;
  modalBottomNote?: string;
  items: BoothItem[];
}

export interface FooterContent {
  aboutText: string;
  logoSrc?: string;
  brandName?: string;
  brandSub?: string;
  contactAddress: string;
  /** @deprecated Use contactHotlines instead */
  contactHotline: string;
  /** Danh sách nhiều số điện thoại hotline, mỗi số có title riêng */
  contactHotlines?: { title: string; phone: string }[];
  contactEmail: string;
  workingHours: string;
  mapEmbedUrl?: string;
  socialLinks: {
    facebook?: string;
    zalo?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
  };
  copyrightText: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG DOANH NGHIỆP NHỎ VÀ VỪA VIỆT NAM 2026",
  organizer: "Hiệp hội Doanh nghiệp nhỏ và vừa tỉnh Thái Nguyên (TASME)",
  hotline: "0815.340.488",
  email: "contact@tasmethainguyen.vn",
  address: "Khách sạn May Plaza, Số 668 Phan Đình Phùng, TP. Thái Nguyên",
  googleMapsUrl: "https://maps.google.com",
  metaTitle: "Vietnam SME Prosperity Link Forum 2026 | Diễn Đàn Kết Nối Giao Thương SME Việt Nam",
  metaDescription: "Sự kiện xúc tiến thương mại cấp quốc gia quy tụ 500+ đại biểu, 100+ gian hàng triển lãm, kết nối B2B & xúc tiến đầu tư FDI.",
  eventDateISO: "2026-09-18T08:00:00+07:00",
  eventPriceVND: 1450000,
  logoUrl: "/logo.png",
  faviconUrl: "/logo.png",
  ogImageUrl: "/images/hero-bg.jpg",
  canonicalUrl: "https://sme-thainguyen.vercel.app",
  gaMeasurementId: "",
  facebookPixelId: "",
  keywords: [
    "Diễn đàn SME Việt Nam 2026",
    "TASME Thái Nguyên",
    "Kết nối giao thương SME",
    "Xúc tiến thương mại Thái Nguyên",
    "May Plaza Hotel Thai Nguyen",
    "B2B Matching",
    "Đăng ký gian hàng triển lãm",
    "Tài trợ diễn đàn SME",
  ],
  telegramBotToken: "",
  telegramChatId: "",
  telegramThreadIdDelegate: "",
  telegramThreadIdSponsor: "",
  telegramThreadIdBooth: "",
  telegramEnabled: false,
  googleSheetScriptUrl: "",
  googleSheetEnabled: true,
  sepayEnabled: false,
  sepayBankCode: "MB",
  sepayAccountNumber: "0388925432",
  sepayAccountName: "HIEP HOI DNNVV THAI NGUYEN",
  sepayApiKey: "",
  hiddenSections: [],
};

export const DEFAULT_HERO: HeroContent = {
  badgeText: "Chào mừng Đại hội HHDNNVV tỉnh Thái Nguyên · Nhiệm kỳ 2026 – 2031",
  honorBadgeText: "🏅 Huân chương Lao động hạng Ba",
  titlePrefix: "DIỄN ĐÀN",
  titleSuffix: "SME VIỆT NAM 2026",
  mainTitle: "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG",
  subTitle: "DOANH NGHIỆP NHỎ VÀ VỪA VIỆT NAM 2026",
  englishTitle: "Vietnam SME Prosperity Link Forum 2026",
  sloganText: "“Kết nối giao thương, vươn tầm quốc tế” • Connecting SME – Going Global",
  keywords: [
    "KẾT NỐI GIAO THƯƠNG",
    "VƯƠN TẦM QUỐC TẾ",
    "XÚC TIẾN ĐẦU TƯ FDI",
    "LIÊN KẾT CHUỖI CUNG ỨNG"
  ],
  tickerMessages: [
    "🔥 Doanh nhân Nguyễn Văn T. (Hà Nội) vừa đăng ký vé Đại biểu (2 phút trước)",
    "⚡ Công ty Cổ phần Công nghệ ABC vừa đăng ký Gian hàng Triển lãm A-05",
    "⭐ Tập đoàn May Plaza công bố trở thành Nhà tài trợ Kim Cương chính thức",
    "🔥 Doanh nhân Lê Thị M. (Đà Nẵng) vừa hoàn tất đăng ký vé Đại biểu trọn gói",
  ],
  countdownLabel: "Đếm ngược sự kiện:",
  dateLabel: "Thời gian",
  eventDateText: "18 - 20 tháng 09, 2026",
  targetDateISO: "2026-09-18T08:00:00+07:00",
  venueLabel: "Địa điểm",
  venueText: "Khách sạn May Plaza, Tỉnh Thái Nguyên",
  primaryCtaText: "ĐĂNG KÝ ĐẠI BIỂU THAM GIA",
  primaryCtaLink: "#register",
  secondaryCtaText: "ĐĂNG KÝ GIAN HÀNG",
  secondaryCtaLink: "#register",
  tertiaryCtaText: "THAM KHẢO GÓI TÀI TRỢ",
  tertiaryCtaLink: "#sponsors",
};

export const DEFAULT_NAVBAR: NavbarContent = {
  brandName: "SME VIỆT NAM 2026",
  brandSub: "TASME THÁI NGUYÊN",
  logoSrc: "/logo.png",
  eventDateText: "18 - 20/09/2026",
  navLinks: [
    { name: "Giới thiệu", href: "#about" },
    { name: "Chương trình", href: "#timeline" },
    { name: "Thư mời tài trợ", href: "#sponsors" },
    { name: "Gian hàng", href: "#booths" },
    { name: "Đăng ký", href: "#register" },
  ],
  ctaText: "Đăng ký ngay",
  ctaLink: "#register",
  mobileRegisterText: "Đăng ký",
};

export const DEFAULT_REGISTRATION: RegistrationContent = {
  sectionBadge: "06 · ĐĂNG KÝ THAM DỰ",
  sectionTitle: "Cổng Đăng ký Trực tuyến Sự kiện",
  sectionDescription: "Chọn mục đích đăng ký bên dưới. Ban tổ chức sẽ liên hệ và xác nhận trực tiếp trong 24h.",
  delegateTab: "Vé Đại biểu",
  sponsorTab: "Nhà Tài trợ",
  boothTab: "Gian hàng",
  delegateIntro: "Đại biểu tham dự chương trình với quyền lợi trọn gói, kết nối B2B và Gala Dinner.",
  sponsorIntro: "Quý Anh/chị, Đơn vị, Doanh nghiệp điền thông tin bên dưới, Ban tổ chức sẽ liên hệ lại trao đổi quyền lợi trực tiếp trong thời gian sớm nhất!",
  boothIntro: "Đăng ký gian hàng tiêu chuẩn 3m x 3m tại khu triển lãm trung tâm.",
  sponsorTiers: [
    "Nhà tài trợ Chiến lược (100.000.000 đ)",
    "Nhà tài trợ Kim Cương (70.000.000 đ)",
    "Nhà tài trợ Vàng (50.000.000 đ)",
    "Nhà tài trợ Bạc (30.000.000 đ)",
    "Nhà tài trợ Đồng (15.000.000 đ)",
    "Đơn vị Đồng hành (10.000.000 đ)",
  ],
  boothOptions: [
    "Gian #05 (3m x 3m)",
    "Gian #12 (3m x 3m)",
    "Gian #19 (3m x 3m)",
  ],
  submitButtonText: "Gửi thông tin",
  mobileDelegateLabel: "Đăng ký Đại biểu",
  mobileSponsorLabel: "Tài trợ",
  mobileBoothLabel: "Gian hàng",
  delegateEmailSubject: "[SME VIỆT NAM 2026] XÁC NHẬN ĐĂNG KÝ ĐẠI BIỂU THAM DỰ",
  delegateEmailBody: "Ban Tổ Chức Diễn đàn SME Việt Nam 2026 xin chân thành cảm ơn Quý đại biểu đã đăng ký tham dự chuỗi sự kiện trọng điểm xúc tiến thương mại 2026. Bộ phận Thư ký sẽ liên hệ hỗ trợ Quý đại biểu trong vòng 24 giờ làm việc.",
  delegatePosterUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
  sponsorEmailSubject: "[SME VIỆT NAM 2026] XÁC NHẬN ĐĂNG KÝ NHÀ TÀI TRỢ & ĐỒNG HÀNH",
  sponsorEmailBody: "Trân trọng cảm ơn Quý Doanh nghiệp đã đăng ký đồng hành cùng Diễn đàn SME Việt Nam 2026. Ban Thư ký sẽ liên hệ trao đổi chi tiết về các quyền lợi tài trợ & hiện diện thương hiệu.",
  sponsorPosterUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
  boothEmailSubject: "[SME VIỆT NAM 2026] XÁC NHẬN ĐĂNG KÝ GIAN HÀNG TRIỂN LÃM",
  boothEmailBody: "Cảm ơn Quý đơn vị đã đăng ký gian hàng triển lãm tại May Plaza Hotel Thái Nguyên. Bộ phận tư vấn sơ đồ gian hàng sẽ liên hệ xác nhận vị trí gian hàng của Quý đơn vị.",
  boothPosterUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
};

export const DEFAULT_STATISTICS: StatisticsContent = {
  items: [
    {
      id: "stat-1",
      value: 63,
      suffix: "",
      label: "Tỉnh thành",
      subtext: "Đại diện hiệp hội doanh nghiệp 63 tỉnh thành",
      iconName: "MapPin"
    },
    {
      id: "stat-2",
      value: 200,
      suffix: "++",
      label: "Doanh nghiệp TN + ngoại tỉnh",
      subtext: "Doanh nghiệp SME & FDI toàn quốc",
      iconName: "Building2"
    },
    {
      id: "stat-3",
      value: 100,
      suffix: "",
      label: "Gian hàng triển lãm",
      subtext: "Gian hàng chuẩn & VIP tại May Plaza",
      iconName: "Handshake"
    },
    {
      id: "stat-4",
      value: 50,
      suffix: "+",
      label: "MOU dự kiến",
      subtext: "Phiên giao thương kết nối 1:1",
      iconName: "Calendar"
    },
    {
      id: "stat-5",
      value: 10,
      suffix: "",
      label: "Quỹ đầu tư dự kiến",
      subtext: "Quỹ mạo hiểm & Nhà đầu tư",
      iconName: "Banknote"
    }
  ]
};

export const DEFAULT_ABOUT: AboutContent = {
  badge: "TỔNG QUAN SỰ KIỆN",
  title: "KẾT NỐI GIAO THƯƠNG, VƯƠN TẦM QUỐC TẾ",
  highlightText: "Vietnam SME Prosperity Link Forum 2026",
  descriptionParagraph1: "Diễn đàn Kết nối giao thương Doanh nghiệp nhỏ và vừa Việt Nam 2026 được Hiệp hội Doanh nghiệp nhỏ và vừa tỉnh Thái Nguyên (TASME) chủ trì tổ chức chào mừng Đại hội TASME nhiệm kỳ 2026 – 2031.",
  descriptionParagraph2: "Quy mô 100 gian hàng và 500 đại biểu quy tụ đại diện cơ quan quản lý, VCCI, hiệp hội doanh nghiệp các tỉnh thành, doanh nghiệp SME, doanh nghiệp FDI, nhà đầu tư, ngân hàng, quỹ đầu tư & các cơ quan báo chí truyền thông.",
  bullets: [
    "Tạo không gian kết nối giao thương B2B, mở rộng thị trường và liên kết vùng cho cộng đồng SME.",
    "Kết nối doanh nghiệp với đối tác FDI, tập đoàn lớn, nhà mua hàng, tổ chức tài chính & quỹ đầu tư.",
    "Xúc tiến hợp tác thương mại, chuyển đổi số, công nghệ AI & hỗ trợ ký kết MOU / Thỏa thuận đầu tư.",
    "Quảng bá môi trường đầu tư, văn hóa trà Thái Nguyên & sản phẩm tiêu biểu; tôn vinh doanh nhân xuất sắc."
  ],
  imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
  statCardNumber: "100%",
  statCardLabel: "Không gian kết nối giao thương thực tế",
  featureCards: [
    {
      id: "about-card-1",
      rank: "01",
      title: "Kết nối giao thương",
      description: "Tổ chức 100+ phiên gặp gỡ B2B trực tiếp 1:1 theo nhu cầu ngành nghề giữa các đại biểu doanh nghiệp toàn quốc.",
      footerLabel: "Giao thương B2B trực tiếp",
      footerText: "Được thiết kế để tạo ra cơ hội hợp tác ngay tại sự kiện.",
      iconName: "Target",
    },
    {
      id: "about-card-2",
      rank: "02",
      title: "Xúc tiến đầu tư – tài chính",
      description: "Giới thiệu danh mục các dự án ưu đãi đầu tư, hạ tầng KCN & giải pháp tài chính xanh hỗ trợ DNNVV.",
      footerLabel: "Tiếp cận Quỹ đầu tư",
      footerText: "Kết nối doanh nghiệp với nhà đầu tư trong nước và quốc tế.",
      iconName: "Users",
    },
    {
      id: "about-card-3",
      rank: "03",
      title: "Ký kết hợp tác (MOU)",
      description: "Nơi diễn ra các nghi thức ký kết Biên bản ghi nhớ hợp tác chiến lược, hợp đồng kinh tế giá trị cao.",
      footerLabel: "Ký kết hợp đồng ngay sự kiện",
      footerText: "Hỗ trợ quan hệ đối tác chiến lược, hợp tác đầu tư và thỏa thuận mới.",
      iconName: "ShieldCheck",
    },
    {
      id: "about-card-4",
      rank: "04",
      title: "Quảng bá Thái Nguyên",
      description: "Tôn vinh văn hóa Trà Đệ nhất danh sơn, giới thiệu môi trường đầu tư năng động của tỉnh Thái Nguyên.",
      footerLabel: "Quảng bá thương hiệu địa phương",
      footerText: "Tiếp cận đối tác, khách hàng và nhà đầu tư tiềm năng.",
      iconName: "Award",
    },
  ],
  attendeeTags: [
    {
      id: "about-tag-1",
      rank: "01",
      label: "Lãnh đạo Chính phủ & Bộ ngành",
      sub: "Đại diện cơ quan quản lý Nhà nước cấp Trung ương",
      tier: "vip",
      iconName: "Landmark",
      count: "Cấp Bộ trưởng trở lên",
    },
    {
      id: "about-tag-2",
      rank: "02",
      label: "500+ CEO, Chủ tịch Doanh nghiệp",
      sub: "Lãnh đạo cấp cao doanh nghiệp trên toàn quốc",
      tier: "vip",
      iconName: "Crown",
      count: "500+ lãnh đạo",
    },
    {
      id: "about-tag-3",
      rank: "03",
      label: "Nhà đầu tư & Quỹ đầu tư",
      sub: "Quỹ mạo hiểm, Angel Investor & Private Equity",
      tier: "gold",
      iconName: "TrendingUp",
      count: "50+ quỹ đầu tư",
    },
    {
      id: "about-tag-4",
      rank: "04",
      label: "Hiệp hội Doanh nghiệp Toàn quốc",
      sub: "Đại diện hiệp hội ngành nghề 34 tỉnh thành",
      tier: "gold",
      iconName: "Building2",
      count: "63 tỉnh thành",
    },
    {
      id: "about-tag-5",
      rank: "05",
      label: "Đối tác FDI Quốc tế",
      sub: "Doanh nghiệp nước ngoài & tổ chức quốc tế",
      tier: "standard",
      iconName: "Globe2",
      count: "10+ quốc gia",
    },
    {
      id: "about-tag-6",
      rank: "06",
      label: "Ban quản lý KCN & Khu kinh tế",
      sub: "Đại diện khu công nghiệp & khu kinh tế trọng điểm",
      tier: "standard",
      iconName: "Factory",
      count: "20+ KCN",
    },
  ],
};

export const DEFAULT_BENEFITS: BenefitsContent = {
  badge: "GIÁ TRỊ ĐỒNG HÀNH",
  title: "5 Giá Trị Cốt Lõi Dành Cho Đối Tác & Nhà Tài Trợ",
  subtitle: "Tối ưu hóa cơ hội hiện diện thương hiệu, kết nối B2B và mở rộng thị trường tại Diễn đàn.",
  items: [
    {
      id: "ben-1",
      title: "Hiện diện Đúng Đối tượng",
      description: "Tiếp cận trực tiếp 500+ lãnh đạo doanh nghiệp, nhà đầu tư, nhà mua hàng, hiệp hội & cơ quan quản lý nhà nước.",
      iconName: "Users",
      badge: "Hiện diện VIP"
    },
    {
      id: "ben-2",
      title: "Kết nối Có Mục tiêu (B2B Matching)",
      description: "Được ưu tiên đăng ký các phiên B2B Matching 1:1, Investment Matching phù hợp chính xác theo ngành hàng.",
      iconName: "Handshake",
      badge: "Ưu tiên 1:1"
    },
    {
      id: "ben-3",
      title: "Truyền thông Đa điểm chạm",
      description: "Xuất hiện nổi bật trên bộ nhận diện, backdrop, màn hình LED, ấn phẩm chính & báo chí truyền thông toàn quốc.",
      iconName: "TrendingUp"
    },
    {
      id: "ben-4",
      title: "Trưng bày & Trải nghiệm Sản phẩm",
      description: "Sở hữu gian hàng triển lãm tiêu chuẩn 3m x 3m tại khu vực trung tâm sảnh Khách sạn May Plaza.",
      iconName: "Store"
    },
    {
      id: "ben-5",
      title: "Khẳng định Vai trò Đồng hành",
      description: "Được tôn vinh, tri ân tại đêm Gala Dinner, nhận Kỷ niệm chương & Báo cáo đo lường quyền lợi chi tiết sau sự kiện.",
      iconName: "Award"
    }
  ]
};

export const DEFAULT_TIMELINE: TimelineContent = {
  badge: "LỊCH TRÌNH CHUYÊN NGHIỆP",
  title: "Chương Trình Chi Tiết 3 Ngày Diễn Đàn",
  subtitle: "Chuỗi hoạt động phong phú gồm Triển lãm, Diễn đàn cấp cao, B2B Matching, Gala Dinner và Đại hội TASME.",
  days: [
    { dayNumber: 1, dayTitle: "Ngày 1: National Business Matching Day", dateText: "18/09/2026" },
    { dayNumber: 2, dayTitle: "Ngày 2: Vietnam SME Forum 2026", dateText: "19/09/2026" },
    { dayNumber: 3, dayTitle: "Ngày 3: Đại hội HHDNNVV Tỉnh Thái Nguyên", dateText: "20/09/2026" }
  ],
  slots: [
    // Ngày 1
    {
      id: "ts-1",
      dayNumber: 1,
      dayTitle: "Ngày 1",
      timeSlot: "08:00 - 09:00",
      title: "Đón tiếp đại biểu & Check-in",
      location: "Sảnh Khách sạn May Plaza",
      description: "Đón tiếp đoàn Đại biểu, doanh nghiệp SME, FDI, trao thẻ đeo & bộ tài liệu sự kiện."
    },
    {
      id: "ts-2",
      dayNumber: 1,
      dayTitle: "Ngày 1",
      timeSlot: "09:00 - 11:30",
      title: "Lễ Khai mạc Triển lãm & Kết nối B2B Theo Ngành",
      speaker: "Lãnh đạo Bộ Công Thương & Ban Tổ chức TASME",
      location: "Khu vực Triển lãm 100 Gian hàng",
      description: "Cắt băng khai mạc 100 gian hàng; kết nối B2B Matching 1:1; gặp gỡ nhà mua hàng & chuỗi cung ứng; Investment Matching."
    },
    {
      id: "ts-3",
      dayNumber: 1,
      dayTitle: "Ngày 1",
      timeSlot: "18:00 - 21:30",
      title: "Tiệc Đêm Vietnam SME Networking Gala",
      location: "Hội trường Grand Ballroom",
      description: "Đêm tiệc giao lưu nghệ thuật sang trọng, thắt chặt mối quan hệ giao thương giữa các đại biểu & nhà đầu tư."
    },

    // Ngày 2
    {
      id: "ts-4",
      dayNumber: 2,
      dayTitle: "Ngày 2",
      timeSlot: "08:00 - 09:00",
      title: "Lễ Trà Kết Nối & Tea Break Signature",
      location: "Sảnh VIP May Plaza",
      description: "Thưởng thức văn hóa trà Thái Nguyên đặc sắc & giao lưu kết nối doanh nhân."
    },
    {
      id: "ts-5",
      dayNumber: 2,
      dayTitle: "Ngày 2",
      timeSlot: "09:00 - 11:30",
      title: "Diễn đàn Cấp cao Vietnam SME Forum 2026 & Ký kết MOU",
      speaker: "Chuyên gia Kinh tế Trung ương & Diễn giả Công nghệ",
      location: "Hội trường Grand Ballroom",
      description: "Diễn đàn về đầu tư, tài chính, AI, chuyển đổi số, thương mại điện tử, liên kết vùng; Đối thoại chính quyền - doanh nghiệp & Lễ ký kết MOU."
    },
    {
      id: "ts-6",
      dayNumber: 2,
      dayTitle: "Ngày 2",
      timeSlot: "18:00 - 21:30",
      title: "Đêm Gala Dinner Chào mừng Đại hội TASME",
      location: "Hội trường Grand Ballroom",
      description: "Đêm Gala tôn vinh nhà tài trợ, trao kỷ niệm chương, giao lưu văn nghệ & bốc thăm may mắn."
    },

    // Ngày 3
    {
      id: "ts-7",
      dayNumber: 3,
      dayTitle: "Ngày 3",
      timeSlot: "08:00 - 11:30",
      title: "Đại hội Hiệp hội Doanh nghiệp NV Tỉnh Thái Nguyên (Nhiệm kỳ 2026 - 2031)",
      speaker: "Lãnh đạo Tỉnh ủy, UBND Tỉnh Thái Nguyên & Ban Chấp hành",
      location: "Hội trường Trọng tâm",
      description: "Đại hội chính thức nhiệm kỳ 2026 - 2031; ra mắt Ban Chấp hành mới; tri ân khen thưởng & tiệc chúc mừng."
    },
    {
      id: "ts-8",
      dayNumber: 3,
      dayTitle: "Ngày 3",
      timeSlot: "13:30 - 17:00",
      title: "Chương trình Khảo sát Vùng Trà, KCN & Doanh nghiệp Tiêu biểu",
      location: "Vùng trà Tân Cương & KCN Sông Công",
      description: "Đoàn đại biểu tham quan thực tế danh thắng vùng trà Thái Nguyên, khảo sát hạ tầng KCN & doanh nghiệp tiêu biểu."
    }
  ]
};

export const DEFAULT_TICKET_FEE: TicketFeeContent = {
  badge: "CHI PHÍ THAM DỰ",
  title: "Đăng Ký Vé Tham Dự Diễn Đàn",
  subtitle: "Trọn gói quyền lợi tham dự chuỗi hoạt động 3 ngày tại Thái Nguyên.",
  priceVND: 1450000,
  originalPriceVND: 2500000,
  ticketBadgeText: "Vé Đại biểu Chính thức",
  earlyBirdLabel: "Vé ưu đãi Đăng ký sớm",
  remainingSlots: 15,
  totalSlots: 100,
  earlyBirdSlotText: "Còn 15 / 100 suất",
  inclusions: [
    "2 Đêm lưu trú tại Khách sạn 4-Star May Plaza Hotel",
    "Bữa sáng Buffet cao cấp hàng ngày",
    "Các bữa ăn trưa chính theo chương trình",
    "02 Đêm tiệc Gala Dinner & Giao lưu nghệ thuật đẳng cấp",
    "01 Standee giới thiệu doanh nghiệp tại sảnh Diễn đàn",
    "Quảng bá thông tin Doanh nghiệp trên Ấn phẩm Diễn đàn",
    "Thẻ Đại biểu trọn gói tham dự 100+ phiên B2B Matching"
  ],
  ctaText: "Đăng ký tham dự ngay",
  guaranteeText: "Cam kết quyền lợi từ Ban tổ chức TASME"
};

export const DEFAULT_SPONSORS: SponsorsContent = {
  badge: "THƯ MỜI TÀI TRỢ & CÁC GÓI QUYỀN LỢI",
  title: "Các Gói Quyền Lợi Đồng Hành Tài Trợ",
  subtitle: "Lựa chọn gói tài trợ phù hợp với chiến lược quảng bá thương hiệu, tiếp cận 500+ CEO, doanh nghiệp SME & nhà đầu tư FDI.",
  prospectusPdfUrl: "",
  packages: [
    {
      id: "pkg-1",
      name: "Nhà tài trợ Chiến lược",
      badgeColor: "bg-purple-900 text-white font-extrabold",
      borderAccent: "border-purple-600 shadow-purple-100",
      price: "Từ 100.000.000 VNĐ (Tối đa 01)",
      popular: true,
      perks: [
        "Logo mức 100% - Vị trí ưu tiên 1 trên nhận diện, backdrop & màn hình LED",
        "01 Gian trưng bày tiêu chuẩn vị trí ưu tiên 1",
        "Phát biểu tối đa 05 phút hoặc tham gia 01 phiên đối thoại chính",
        "12 Thẻ Thư mời Đại biểu tham dự trọn gói (Gala & Ăn ở)",
        "Tối đa 10 lịch hẹn B2B / Investment Matching ưu tiên",
        "Video thương hiệu 60s (04 lượt phát trước phiên chính & Gala)",
        "03 Bài giới thiệu riêng trên kênh truyền thông của Ban Tổ chức",
        "Kỷ niệm chương đặc biệt + Báo cáo quyền lợi riêng sau sự kiện",
      ],
    },
    {
      id: "pkg-2",
      name: "Nhà tài trợ Kim Cương",
      badgeColor: "bg-[#0D3B2E] text-white font-bold",
      borderAccent: "border-emerald-600 shadow-emerald-100",
      price: "Từ 70.000.000 VNĐ (Tối đa 02)",
      perks: [
        "Logo mức 85% - Vị trí ưu tiên tại các hoạt động trọng tâm",
        "01 Gian trưng bày vị trí ưu tiên",
        "Ưu tiên xem xét 01 vị trí đối thoại chính quyền - doanh nghiệp",
        "08 Thẻ Thư mời Đại biểu tham dự trọn gói",
        "Tối đa 08 lịch hẹn B2B Matching ưu tiên",
        "Video thương hiệu 45s (03 lượt phát trước phiên chính/Gala)",
        "02 Bài giới thiệu riêng trên kênh truyền thông của Ban Tổ chức",
        "Kỷ niệm chương + Báo cáo quyền lợi riêng sau sự kiện",
      ],
    },
    {
      id: "pkg-3",
      name: "Nhà tài trợ Vàng",
      badgeColor: "bg-amber-500 text-slate-950 font-bold",
      borderAccent: "border-amber-300 shadow-amber-50",
      price: "Từ 50.000.000 VNĐ (Tối đa 03)",
      perks: [
        "Logo mức 70% trên bộ nhận diện chính & truyền thông",
        "01 Gian trưng bày tiêu chuẩn",
        "06 Thẻ Thư mời Đại biểu tham dự trọn gói",
        "Tối đa 06 lịch hẹn B2B Matching ưu tiên",
        "Video thương hiệu 30s (02 lượt phát)",
        "01 Bài giới thiệu riêng trên kênh truyền thông của Ban Tổ chức",
        "Kỷ niệm chương + Báo cáo quyền lợi rút gọn",
      ],
    },
    {
      id: "pkg-4",
      name: "Nhà tài trợ Bạc",
      badgeColor: "bg-slate-700 text-white font-bold",
      borderAccent: "border-slate-300",
      price: "Từ 30.000.000 VNĐ (Tối đa 05)",
      perks: [
        "Logo mức 55% tại các điểm chạm phù hợp",
        "01 Gian trưng bày tiêu chuẩn (nếu còn vị trí)",
        "04 Thẻ Thư mời Đại biểu tham dự trọn gói",
        "Tối đa 04 lịch hẹn B2B Matching ưu tiên",
        "Video thương hiệu 30s (01 lượt phát)",
        "01 Bài giới thiệu tổng hợp trên kênh truyền thông BTC",
        "Chứng nhận Nhà tài trợ Bạc + Báo cáo chung",
      ],
    },
    {
      id: "pkg-5",
      name: "Nhà tài trợ Đồng",
      badgeColor: "bg-amber-800 text-white font-bold",
      borderAccent: "border-amber-200",
      price: "Từ 20.000.000 VNĐ (Tối đa 10)",
      perks: [
        "Logo mức 40% ở nhóm đồng tài trợ",
        "Ưu đãi 50% chi phí gian hàng triển lãm",
        "02 Thẻ Thư mời Đại biểu tham dự trọn gói",
        "Tối đa 02 lịch hẹn B2B Matching",
        "Bài giới thiệu tổng hợp & Chứng nhận Nhà tài trợ Đồng",
      ],
    },
    {
      id: "pkg-6",
      name: "Đơn vị Đồng hành",
      badgeColor: "bg-teal-700 text-white font-bold",
      borderAccent: "border-teal-300",
      price: "Từ 10.000.000 VNĐ đến dưới 19.000.000 VNĐ",
      perks: [
        "Ghi nhận logo/thương hiệu theo hạng mục tài trợ cụ thể",
        "01 Thẻ Thư mời Đại biểu tham dự trọn gói",
        "Bài cảm ơn chung & Thư cảm ơn từ Ban Tổ chức TASME",
      ],
    },
  ],
  priorityCategories: [
    { id: "cat-1", name: "Vietnam SME Networking Gala (18/9)", fee: "Từ 100 Triệu" },
    { id: "cat-2", name: "Gala Chào mừng Đại hội (19/9)", fee: "Từ 70 Triệu" },
    { id: "cat-3", name: "Lễ Trà Kết nối & Tea Break Signature", fee: "Từ 50 Triệu" },
    { id: "cat-4", name: "Nền tảng B2B - Công nghệ - Kết nối", fee: "Từ 30 Triệu" },
    { id: "cat-5", name: "Phương tiện - Logistics - Đón đoàn", fee: "Từ 20 Triệu" },
    { id: "cat-6", name: "Truyền thông - Quay chụp - Livestream", fee: "Từ 10 Triệu" },
    { id: "cat-7", name: "Quà tặng & Bộ tài liệu đại biểu", fee: "Từ 10 Triệu" },
    { id: "cat-8", name: "Gian hàng - In ấn - Nhận diện", fee: "Từ 10 Triệu" },
  ],
  milestones: [
    { id: "ms-1", time: "Trước 31/08/2026", desc: "Đăng ký gói tài trợ để bảo đảm quyền lợi trên toàn bộ ấn phẩm chính." },
    { id: "ms-2", time: "Trước 05/09/2026", desc: "Cung cấp Logo, hồ sơ thương hiệu, video & danh sách đại biểu." },
    { id: "ms-3", time: "Trước 10/09/2026", desc: "Hoàn tất kinh phí hoặc bàn giao hiện vật/dịch vụ đồng hành." },
    { id: "ms-4", time: "11 – 17/09/2026", desc: "Truyền thông cao điểm; duyệt kỹ thuật gian hàng & vật phẩm sự kiện." },
    { id: "ms-5", time: "18 – 20/09/2026", desc: "Chính thức diễn ra chuỗi sự kiện tại May Plaza Hotel Thái Nguyên." },
  ],
  items: [
    {
      id: "sp-1",
      name: "Tập Đoàn May Plaza Thái Nguyên",
      tier: "diamond",
      logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&h=150&fit=crop",
      websiteUrl: "https://mayplazahotel.com",
      description: "Đơn vị tài trợ địa điểm & Nhà tài trợ Kim Cương"
    },
    {
      id: "sp-2",
      name: "VietinBank Chi Nhánh Thái Nguyên",
      tier: "gold",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=150&fit=crop",
      websiteUrl: "https://vietinbank.vn",
      description: "Ngân hàng Đồng hành Xúc tiến Đầu tư & Tín dụng SME"
    },
    {
      id: "sp-3",
      name: "Tập Đoàn Bưu Chính Viễn Thông VNPT",
      tier: "gold",
      logoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=150&fit=crop",
      websiteUrl: "https://vnpt.com.vn",
      description: "Đối tác Chuyển đổi số & Hạ tầng Công nghệ Diễn đàn"
    },
    {
      id: "sp-4",
      name: "Công Ty Cổ Phần Đầu Tư & Thương Mại TNG",
      tier: "silver",
      logoUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=300&h=150&fit=crop",
      websiteUrl: "https://tng.vn",
      description: "Nhà tài trợ Bạc & Đơn vị Sản xuất Xuất khẩu Tiêu biểu"
    },
    {
      id: "sp-5",
      name: "Hiệp Hội Doanh Nghiệp NV Tỉnh Thái Nguyên (TASME)",
      tier: "co-organizer",
      logoUrl: "/logo.png",
      websiteUrl: "https://sme-thainguyen.vercel.app",
      description: "Đơn vị Trực tiếp Chỉ đạo & Tổ chức Diễn đàn"
    },
    {
      id: "sp-6",
      name: "Đài Phát Thanh & Truyền Hình Thái Nguyên (TNTV)",
      tier: "companion",
      logoUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&h=150&fit=crop",
      websiteUrl: "https://thainguyentv.vn",
      description: "Đơn vị Bảo trợ Truyền thông Chính thức"
    }
  ]
};

export const DEFAULT_BOOTHS: BoothsContent = {
  badge: "GIAN HÀNG TRIỂN LÃM",
  title: "Sơ Đồ & Đăng Ký Gian Hàng",
  subtitle: "100+ gian hàng tiêu chuẩn & đặc biệt dành cho các doanh nghiệp giới thiệu sản phẩm dịch vụ.",
  mapImageUrl: "/images/so-do.jpg",
  totalBooths: 100,
  availableBooths: 35,
  boothPackageBadge: "Gian hàng tiêu chuẩn",
  boothPackageTitle: "Gian hàng Triển lãm 2m x 1,5m",
  boothPackageNote: "Mỗi gian hàng BTC sẽ sắp sẵn 2 bàn + 2 ghế + 1 Standee",
  priceVND: 8500000,
  priceFormatted: "8.500.000",
  priceUnit: "VNĐ / Gian",
  inclusions: [
    "Mặt bằng gian tiêu chuẩn diện tích 2m x 1,5m theo sơ đồ Ban Tổ chức",
    "01 Standee, Vách ngăn, biển tên gian & hệ khung trưng bày chuyên nghiệp",
    "Ổ cắm điện & kết nối Internet Wi-Fi tốc độ cao riêng khu vực",
    "02 Bàn + 02 Ghế tiêu chuẩn + Hệ chiếu sáng & điện 220V",
    "Hiển thị logo & thông tin doanh nghiệp trên sơ đồ & catalogue Diễn đàn",
    "Hỗ trợ vận chuyển, sắp xếp hàng hóa ngày lắp đặt (18/9)",
  ],
  ctaText: "Đăng ký gian hàng ngay",
  modalTitle: "Sơ đồ Chi tiết Mặt bằng Triển lãm",
  modalSubtitle: "Kéo giữ chuột để di chuyển (trái/phải/lên/xuống). Lăn chuột hoặc bấm +/- để zoom.",
  modalBottomNote: "Mặt bằng 100 gian hàng tiêu chuẩn & VIP tại Trung tâm Tổ chức Sự kiện May Plaza",
  items: [
    {
      id: "b-101",
      boothCode: "A-01",
      areaName: "Khu Vực A - Công Nghệ & Chuyển Đổi Số",
      size: "2m x 1.5m",
      priceVND: 8500000,
      status: "available",
      description: "Gian hàng góc 2 mặt tiền ngay lối vào chính"
    },
    {
      id: "b-102",
      boothCode: "A-02",
      areaName: "Khu Vực A - Công Nghệ & Chuyển Đổi Số",
      size: "2m x 1.5m",
      priceVND: 8500000,
      status: "reserved",
      reservedBy: "Công ty Cổ phần Công nghệ ABC",
      description: "Gian hàng tiêu chuẩn"
    }
  ]
};

export interface SpeakerItem {
  id: string;
  name: string;
  title: string;
  organization: string;
  topic: string;
  imageUrl: string;
  badge?: string;
  achievements?: string;
  whyListen?: string;
  speechValue?: string;
}

export interface SpeakersContent {
  badge: string;
  title: string;
  subtitle: string;
  items: SpeakerItem[];
}

export const DEFAULT_SPEAKERS: SpeakersContent = {
  badge: "DIỄN GIẢ & KHÁCH MỜI DANH DỰ",
  title: "Đội Ngũ Diễn Giả Và Chuyên Gia Đầu Ngành",
  subtitle: "Lắng nghe các bài chia sẻ chiến lược và góc nhìn chuyên sâu từ các nhà quản lý, diễn giả hàng đầu.",
  items: [
    {
      id: "spk-1",
      name: "TS. Nguyễn Văn Nam",
      title: "Chuyên gia Kinh tế Trưởng",
      organization: "Viện Nghiên cứu Quản lý Kinh tế Trung ương",
      topic: "Xu hướng phát triển kinh tế SME & Cơ hội bứt phá chuỗi giá trị 2026",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      badge: "Diễn giả Keynote",
      achievements: "20+ năm nghiên cứu chính sách kinh tế vĩ mô và tư vấn chiến lược cho hàng trăm SME trong nước.",
      whyListen: "Hiểu rõ bối cảnh kinh tế 2026 và các cơ hội tăng trưởng thực tế cho doanh nghiệp vừa và nhỏ.",
      speechValue: "Bài nói cung cấp lộ trình hành động cần thiết để chuyển đổi cơ hội thành hợp đồng và đầu tư.",
    },
    {
      id: "spk-2",
      name: "Ông Trần Đức Minh",
      title: "Phó Cục trưởng Cục Xúc tiến Thương mại",
      organization: "Bộ Công Thương",
      topic: "Chiến lược xúc tiến xuất khẩu & Mở rộng thị trường quốc tế cho doanh nghiệp vừa và nhỏ",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
      badge: "Khách mời Danh dự",
      achievements: "Đã triển khai nhiều chương trình xuất khẩu thành công, mở ra thị trường châu Á và châu Âu cho các SME Việt.",
      whyListen: "Nắm bắt các cơ hội xuất khẩu thực tế và cách doanh nghiệp triển khai kênh quốc tế ngay trong 2026.",
      speechValue: "Bài chia sẻ hướng đến bộ công cụ hành động để tăng doanh số xuất khẩu và gia tăng giá trị chuỗi cung ứng.",
    },
    {
      id: "spk-3",
      name: "Bà Lê Thị Thu Hà",
      title: "Giám đốc Chuyển đổi số Doanh nghiệp",
      organization: "Tập đoàn Viễn thông VNPT",
      topic: "Ứng dụng AI và Công nghệ số nâng cao năng suất quản trị cho SME",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
      badge: "Chuyên gia Công nghệ",
      achievements: "Dẫn dắt các sáng kiến chuyển đổi số cho tập đoàn lớn và SME, giúp tăng hiệu suất vận hành đến 40%.",
      whyListen: "Hiểu cách áp dụng AI thực tiễn cho doanh nghiệp nhỏ mà không cần đầu tư quá lớn.",
      speechValue: "Bài nói khai thác 3 bước chuyển đổi số nhanh, giảm chi phí và nâng cao khả năng cạnh tranh.",
    },
    {
      id: "spk-4",
      name: "Ông Hoàng Văn Thái",
      title: "Chủ tịch Hội đồng Quản trị",
      organization: "Hiệp hội Doanh nghiệp NV Tỉnh Thái Nguyên (TASME)",
      topic: "Kết nối nguồn lực địa phương & Hỗ trợ doanh nghiệp phát triển bền vững",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
      badge: "Ban Tổ Chức",
      achievements: "Lãnh đạo tổ chức nhiều chương trình đồng hành SME, hỗ trợ doanh nghiệp khởi nghiệp và bền vững tại Thái Nguyên.",
      whyListen: "Cập nhật các cơ chế phối hợp nguồn lực địa phương và ưu đãi giúp doanh nghiệp tối ưu hoá đầu tư.",
      speechValue: "Bài trình bày hướng đến cách kết nối doanh nghiệp với chính sách và nguồn lực để hiện thực hoá dự án phát triển.",
    }
  ]
};

export const DEFAULT_FOOTER: FooterContent = {
  aboutText: "Diễn đàn Kết nối Giao thương SME Việt Nam 2026 là sự kiện xúc tiến thương mại quy mô lớn quy tụ 500+ doanh nghiệp trên toàn quốc.",
  logoSrc: "/logo.png",
  brandName: "TASME THÁI NGUYÊN",
  brandSub: "Hiệp hội Doanh nghiệp nhỏ và vừa tỉnh Thái Nguyên",
  contactAddress: "May Plaza Hotel Thai Nguyen, 668 Phan Đình Phùng, TP. Thái Nguyên",
  contactHotline: "0988.123.456",
  contactHotlines: [
    { title: "Ban Thư ký", phone: "0988.123.456" },
  ],
  contactEmail: "contact@smevietnam2026.vn",
  workingHours: "Thứ 2 - Thứ 7: 08:00 - 17:30",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.158586383637!2d105.8361730761214!3d21.579727980208154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31352723c3cf6d0d%3A0x6a0fcfb2bcf1b1a7!2sMay%20Plaza%20Hotel!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn",
  socialLinks: {
    facebook: "https://facebook.com",
    zalo: "https://zalo.me",
    youtube: "https://youtube.com",
    tiktok: "https://tiktok.com",
  },
  copyrightText: "© 2026 Diễn đàn SME Việt Nam. Bảo lưu mọi quyền."
};

export interface FaqItem {
  id: string;
  category: "all" | "ticket" | "booth" | "sponsor" | "general";
  question: string;
  answer: string;
  badge?: string;
}

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    category: "general",
    badge: "Thời gian & Địa điểm",
    question: "Diễn đàn SME Việt Nam 2026 diễn ra vào thời gian và địa điểm nào?",
    answer:
      "Diễn đàn Kết nối Giao thương SME Việt Nam 2026 chính thức diễn ra trong 03 ngày: Từ ngày 18/09/2026 đến hết ngày 20/09/2026 tại Khách sạn May Plaza Hotel Thái Nguyên (Địa chỉ: Số 668 Phan Đình Phùng, TP. Thái Nguyên, Tỉnh Thái Nguyên). Sự kiện mở cửa đón tiếp đại biểu và khách tham quan B2B từ 08:00 sáng đến 17:30 chiều mỗi ngày.",
  },
  {
    id: "faq-2",
    category: "ticket",
    badge: "Quyền lợi Vé",
    question: "Đăng ký vé tham dự Đại biểu bao gồm những quyền lợi gì?",
    answer:
      "Mỗi vé tham dự chính thức bao gồm: (1) Thẻ đeo Đại biểu VIP & Bộ tài liệu hội nghị độc quyền; (2) Tham dự toàn bộ các phiên Keynote & Tọa đàm chuyên sâu với Lãnh đạo Chính phủ, Bộ ngành; (3) Tham gia phiên B2B Networking 1-1 mở rộng mạng lưới khách hàng; (4) Thưởng thức tiệc Teabreak cao cấp giao lưu; (5) Được cấp mã xác nhận điện tử và hỗ trợ xuất hóa đơn VAT theo quy định.",
  },
  {
    id: "faq-3",
    category: "booth",
    badge: "Gian hàng B2B",
    question: "Gian hàng triển lãm tiêu chuẩn có diện tích bao nhiêu và bao gồm những trang thiết bị gì?",
    answer:
      "Mỗi gian hàng tiêu chuẩn tại sảnh triển lãm có kích thước 2.0m x 1.5m (3.0m²), được trang bị hoàn chỉnh gồm: vách ngăn phân tách chuyên nghiệp, 01 Standee/biển tên thương hiệu theo thiết kế chuẩn của BTC, 01 bàn tư vấn kèm 02 ghế đại biểu, hệ thống chiếu sáng, ổ cắm điện riêng và kết nối Internet Wi-Fi tốc độ cao độc quyền.",
  },
  {
    id: "faq-4",
    category: "sponsor",
    badge: "Gói Tài trợ",
    question: "Doanh nghiệp muốn đồng hành tài trợ diễn đàn thì có những hạng mức nào?",
    answer:
      "Ban tổ chức cung cấp 5 hạng mức tài trợ linh hoạt: Đồng hành Chỉ đạo, Nhà tài trợ Kim Cương (Diamond), Nhà tài trợ Vàng (Gold), Nhà tài trợ Bạc & Đồng (Silver/Bronze), và Đơn vị Đồng hành truyền thông. Các nhà tài trợ sẽ được hưởng quyền lợi phát biểu Keynote, bài PR trên báo chí trung ương, logo vị trí VIP trên backdrop sân khấu chính và quyền ưu tiên chọn vị trí gian hàng đẹp nhất.",
  },
  {
    id: "faq-5",
    category: "general",
    badge: "Thanh toán & Hóa đơn",
    question: "Ban tổ chức có hỗ trợ xuất hóa đơn VAT và thanh toán tự động qua mã VietQR không?",
    answer:
      "Có! Hệ thống hỗ trợ thanh toán trực tuyến tự động qua cổng quét mã VietQR (SePay) với xác nhận tự động 24/7. Ngay sau khi thanh toán thành công, hệ thống sẽ gửi Email xác nhận kèm mã số đại biểu. Bộ phận tài chính của Hiệp hội TASME sẽ liên hệ xuất hóa đơn tài chính VAT hợp lệ cho quý doanh nghiệp theo đúng quy định.",
  },
  {
    id: "faq-6",
    category: "general",
    badge: "Hotline hỗ trợ",
    question: "Tôi cần liên hệ trực tiếp với Ban tổ chức bằng cách nào?",
    answer:
      "Quý đại biểu và doanh nghiệp có thể liên hệ trực tiếp với Thường trực Ban Tổ chức Diễn đàn qua Hotline/Zalo: 0815.340.488 (Hỗ trợ 24/7) hoặc gửi Email về địa chỉ: contact@tasmethainguyen.vn. Ban thư ký sẽ phản hồi trong vòng 30 phút làm việc.",
  },
];

export interface FaqContent {
  visible?: boolean;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  items: FaqItem[];
}

export const DEFAULT_FAQ_CONTENT: FaqContent = {
  visible: true,
  badgeText: "GIẢI ĐÁP THẮC MẮC THƯỜNG GẶP",
  title: "Câu Hỏi Thường Gặp (FAQ) Về Diễn Đàn",
  subtitle: "Tổng hợp thông tin quan trọng nhất giúp Quý doanh nghiệp, Đại biểu và Nhà tài trợ dễ dàng chuẩn bị và tham dự sự kiện hiệu quả.",
  items: DEFAULT_FAQS,
};

