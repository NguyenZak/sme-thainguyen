export type SectionKey =
  | "site_config"
  | "hero"
  | "statistics"
  | "about"
  | "benefits"
  | "timeline"
  | "ticket_fee"
  | "sponsors"
  | "booths"
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
  telegramBotToken?: string;
  telegramChatId?: string;
  telegramEnabled?: boolean;
  googleSheetScriptUrl?: string;
  googleSheetEnabled?: boolean;
}

export interface HeroContent {
  badgeText: string;
  mainTitle: string;
  subTitle: string;
  keywords: string[];
  eventDateText: string;
  targetDateISO: string;
  venueText: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  tertiaryCtaText: string;
  tertiaryCtaLink: string;
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
  inclusions: string[];
  ctaText: string;
  guaranteeText: string;
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
  totalBooths: number;
  availableBooths: number;
  items: BoothItem[];
}

export interface FooterContent {
  aboutText: string;
  contactAddress: string;
  contactHotline: string;
  contactEmail: string;
  workingHours: string;
  socialLinks: {
    facebook?: string;
    zalo?: string;
    youtube?: string;
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
  telegramBotToken: "",
  telegramChatId: "",
  telegramEnabled: false,
  googleSheetScriptUrl: "",
  googleSheetEnabled: true,
};

export const DEFAULT_HERO: HeroContent = {
  badgeText: "VIETNAM SME PROSPERITY LINK 2026 • CHÀO MỪNG ĐẠI HỘI TASME NHIỆM KỲ 2026 - 2031",
  mainTitle: "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG",
  subTitle: "DOANH NGHIỆP NHỎ VÀ VỪA VIỆT NAM 2026",
  keywords: [
    "KẾT NỐI GIAO THƯƠNG",
    "VƯƠN TẦM QUỐC TẾ",
    "XÚC TIẾN ĐẦU TƯ FDI",
    "LIÊN KẾT CHUỖI CUNG ỨNG"
  ],
  eventDateText: "18 - 20 tháng 09, 2026",
  targetDateISO: "2026-09-18T08:00:00+07:00",
  venueText: "Khách sạn May Plaza, Tỉnh Thái Nguyên",
  primaryCtaText: "ĐĂNG KÝ VÉ ĐẠI BIỂU",
  primaryCtaLink: "#register",
  secondaryCtaText: "HỒ SƠ NHÀ TÀI TRỢ",
  secondaryCtaLink: "#sponsors",
  tertiaryCtaText: "SƠ ĐỒ 100 GIAN HÀNG",
  tertiaryCtaLink: "#booths",
};

export const DEFAULT_STATISTICS: StatisticsContent = {
  items: [
    {
      id: "stat-1",
      value: 500,
      suffix: "+",
      label: "ĐẠI BIỂU DỰ KIẾN",
      subtext: "Lãnh đạo cơ quan, hiệp hội, SME toàn quốc & đối tác FDI quốc tế",
      iconName: "Users"
    },
    {
      id: "stat-2",
      value: 100,
      suffix: "+",
      label: "GIAN HÀNG TRIỂN LÃM",
      subtext: "Trưng bày sản phẩm, công nghệ & giải pháp phát triển bền vững",
      iconName: "Store"
    },
    {
      id: "stat-3",
      value: 50,
      suffix: "+",
      label: "PHIÊN B2B MATCHING",
      subtext: "Kết nối trực tiếp 1:1 giữa nhà cung ứng & nhà mua hàng",
      iconName: "Handshake"
    },
    {
      id: "stat-4",
      value: 3,
      suffix: " NGÀY",
      label: "CHUỖI HOẠT ĐỘNG",
      subtext: "B2B Matching, Diễn đàn cấp cao, Gala Dinner & Đại hội TASME",
      iconName: "Calendar"
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
  statCardLabel: "Không gian kết nối giao thương thực tế"
};

export const DEFAULT_BENEFITS: BenefitsContent = {
  badge: "GIÁ TRỊ ĐỒNG HÀNH",
  title: "5 GIÁ TRỊ CỐT LÕI DÀNH CHO ĐỐI TÁC & NHÀ TÀI TRỢ",
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
  title: "CHƯƠNG TRÌNH CHI TIẾT 3 NGÀY DIỄN ĐÀN",
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
  title: "ĐĂNG KÝ VÉ THAM DỰ DIỄN ĐÀN",
  subtitle: "Trọn gói quyền lợi tham dự chuỗi hoạt động 3 ngày tại Thái Nguyên.",
  priceVND: 1450000,
  originalPriceVND: 2000000,
  ticketBadgeText: "ƯU ĐÃI ĐĂNG KÝ SỚM",
  inclusions: [
    "Thẻ tham dự trọn vẹn chuỗi sự kiện 3 ngày (18 - 20/09/2026)",
    "Tham gia các phiên kết nối giao thương B2B Matching 1:1",
    "01 Vé tham dự Đêm Gala Dinner sang trọng (Tối 19/09)",
    "Thưởng thức 04 tiệc trà Teabreak cao cấp trong suốt diễn đàn",
    "Bộ tài liệu sự kiện, Sổ tay doanh nhân & Quà tặng từ BTC",
    "Cơ hội bốc thăm may mắn với nhiều giải thưởng giá trị"
  ],
  ctaText: "ĐĂNG KÝ GIỮ CHỖ NGAY",
  guaranteeText: "Hoàn tiền 100% nếu sự kiện hủy hoặc thay đổi lịch trình bất khả kháng"
};

export const DEFAULT_SPONSORS: SponsorsContent = {
  badge: "ĐỐI TÁC & NHÀ TÀI TRỢ",
  title: "DANH SÁCH NHÀ TÀI TRỢ & ĐƠN VỊ ĐỒNG HÀNH",
  subtitle: "Xin chân thành cảm ơn các Tập đoàn, Ngân hàng, Doanh nghiệp và Đơn vị truyền thông đã tin tưởng và đồng hành cùng Diễn đàn SME Việt Nam 2026.",
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
  badge: "KIEU HÀNG TRIỂN LÃM",
  title: "SƠ ĐỒ & ĐĂNG KÝ GIAN HÀNG",
  subtitle: "100+ gian hàng tiêu chuẩn & đặc biệt dành cho các doanh nghiệp giới thiệu sản phẩm dịch vụ.",
  mapImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop",
  totalBooths: 100,
  availableBooths: 35,
  items: [
    {
      id: "b-101",
      boothCode: "A-01",
      areaName: "Khu Vực A - Công Nghệ & Chuyển Đổi Số",
      size: "3m x 3m",
      priceVND: 8500000,
      status: "available",
      description: "Gian hàng góc 2 mặt tiền ngay lối vào chính"
    },
    {
      id: "b-102",
      boothCode: "A-02",
      areaName: "Khu Vực A - Công Nghệ & Chuyển Đổi Số",
      size: "3m x 3m",
      priceVND: 7500000,
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
}

export interface SpeakersContent {
  badge: string;
  title: string;
  subtitle: string;
  items: SpeakerItem[];
}

export const DEFAULT_SPEAKERS: SpeakersContent = {
  badge: "DIỄN GIẢ & KHÁCH MỜI DANH DỰ",
  title: "ĐỘI NGŨ DIỄN GIẢ VÀ CHUYÊN GIA ĐẦU NGÀNH",
  subtitle: "Lắng nghe các bài chia sẻ chiến lược và góc nhìn chuyên sâu từ các nhà quản lý, diễn giả hàng đầu.",
  items: [
    {
      id: "spk-1",
      name: "TS. Nguyễn Văn Nam",
      title: "Chuyên gia Kinh tế Trưởng",
      organization: "Viện Nghiên cứu Quản lý Kinh tế Trung ương",
      topic: "Xu hướng phát triển kinh tế SME & Cơ hội bứt phá chuỗi giá trị 2026",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      badge: "Diễn giả Keynote"
    },
    {
      id: "spk-2",
      name: "Ông Trần Đức Minh",
      title: "Phó Cục trưởng Cục Xúc tiến Thương mại",
      organization: "Bộ Công Thương",
      topic: "Chiến lược xúc tiến xuất khẩu & Mở rộng thị trường quốc tế cho doanh nghiệp vừa và nhỏ",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
      badge: "Khách mời Danh dự"
    },
    {
      id: "spk-3",
      name: "Bà Lê Thị Thu Hà",
      title: "Giám đốc Chuyển đổi số Doanh nghiệp",
      organization: "Tập đoàn Viễn thông VNPT",
      topic: "Ứng dụng AI và Công nghệ số nâng cao năng suất quản trị cho SME",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
      badge: "Chuyên gia Công nghệ"
    },
    {
      id: "spk-4",
      name: "Ông Hoàng Văn Thái",
      title: "Chủ tịch Hội đồng Quản trị",
      organization: "Hiệp hội Doanh nghiệp NV Tỉnh Thái Nguyên (TASME)",
      topic: "Kết nối nguồn lực địa phương & Hỗ trợ doanh nghiệp phát triển bền vững",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
      badge: "Ban Tổ Chức"
    }
  ]
};

export const DEFAULT_FOOTER: FooterContent = {
  aboutText: "Diễn đàn Kết nối Giao thương SME Việt Nam 2026 là sự kiện xúc tiến thương mại quy mô lớn quy tụ 500+ doanh nghiệp trên toàn quốc.",
  contactAddress: "May Plaza Hotel Thai Nguyen, 668 Phan Đình Phùng, TP. Thái Nguyên",
  contactHotline: "0988.123.456",
  contactEmail: "contact@smevietnam2026.vn",
  workingHours: "Thứ 2 - Thứ 7: 08:00 - 17:30",
  socialLinks: {
    facebook: "https://facebook.com",
    zalo: "https://zalo.me",
    youtube: "https://youtube.com"
  },
  copyrightText: "© 2026 Diễn đàn SME Việt Nam. Bảo lưu mọi quyền."
};
