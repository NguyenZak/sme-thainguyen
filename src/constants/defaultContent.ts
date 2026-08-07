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
  siteName: "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026",
  organizer: "Hiệp hội Doanh nghiệp nhỏ và vừa tỉnh Thái Nguyên (TASME)",
  hotline: "0988.123.456",
  email: "contact@smevietnam2026.vn",
  address: "May Plaza Hotel Thai Nguyen, 668 Phan Đình Phùng, TP. Thái Nguyên",
  googleMapsUrl: "https://maps.google.com",
  metaTitle: "Diễn Đàn Kết Nối Giao Thương SME Việt Nam 2026",
  metaDescription: "Quy tụ 500+ Doanh nghiệp, 100+ gian hàng triển lãm và 50+ phiên kết nối B2B matching xúc tiến thương mại.",
  eventDateISO: "2026-09-18T08:00:00+07:00",
  eventPriceVND: 1450000,
  telegramBotToken: "",
  telegramChatId: "",
  telegramEnabled: false,
  googleSheetScriptUrl: "",
  googleSheetEnabled: true,
};

export const DEFAULT_HERO: HeroContent = {
  badgeText: "CHƯƠNG TRÌNH XÚC TIẾN THƯƠNG MẠI QUỐC GIA 2026",
  mainTitle: "DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG",
  subTitle: "SME VIỆT NAM 2026",
  keywords: [
    "KẾT NỐI GIAO THƯƠNG",
    "XÚC TIẾN ĐẦU TƯ",
    "MỞ RỘNG THỊ TRƯỜNG",
    "VƯƠN TẦM QUỐC TẾ"
  ],
  eventDateText: "18 - 20 tháng 09, 2026",
  targetDateISO: "2026-09-18T08:00:00+07:00",
  venueText: "May Plaza Hotel Thai Nguyen",
  primaryCtaText: "ĐĂNG KÝ THAM GIA NGAY",
  primaryCtaLink: "#register",
  secondaryCtaText: "ĐĂNG KÝ TÀI TRỢ",
  secondaryCtaLink: "#sponsor",
  tertiaryCtaText: "ĐĂNG KÝ GIAN HÀNG",
  tertiaryCtaLink: "#booth",
};

export const DEFAULT_STATISTICS: StatisticsContent = {
  items: [
    {
      id: "stat-1",
      value: 500,
      suffix: "+",
      label: "DOANH NHÂN & LÃNH ĐẠO",
      subtext: "Quy tụ đại diện các doanh nghiệp SME tiêu biểu toàn quốc",
      iconName: "Users"
    },
    {
      id: "stat-2",
      value: 100,
      suffix: "+",
      label: "GIAN HÀNG TRIỂN LÃM",
      subtext: "Trưng bày sản phẩm, dịch vụ và công nghệ tiên tiến",
      iconName: "Store"
    },
    {
      id: "stat-3",
      value: 50,
      suffix: "+",
      label: "PHIÊN KẾT NỐI B2B",
      subtext: "Giao thương trực tiếp 1:1 mở rộng chuỗi cung ứng",
      iconName: "Handshake"
    },
    {
      id: "stat-4",
      value: 3,
      suffix: " NGÀY",
      label: "CHƯƠNG TRÌNH ĐẶC SẮC",
      subtext: "Hội thảo chuyên đề, Gala Dinner & Xúc tiến đầu tư",
      iconName: "Calendar"
    }
  ]
};

export const DEFAULT_ABOUT: AboutContent = {
  badge: "VỀ CHƯƠNG TRÌNH",
  title: "CẦU NỐI VỮNG CHẮC CHO SỰ PHÁT TRIỂN CỦA DOANH NGHIỆP SME",
  highlightText: "Diễn đàn Kết nối Giao thương SME Việt Nam 2026",
  descriptionParagraph1: "Là sự kiện xúc tiến thương mại quy mô cấp quốc gia nhằm kết nối các doanh nghiệp vừa và nhỏ trên toàn quốc với các đối tác trong và ngoài nước.",
  descriptionParagraph2: "Sự kiện quy tụ hàng trăm doanh chủ, nhà đầu tư, chuyên gia kinh tế đầu ngành cùng đại diện các cơ quan quản lý nhà nước để cùng thảo luận, chia sẻ giải pháp và nâng cao năng lực cạnh tranh trong kỷ nguyên số.",
  bullets: [
    "Kết nối giao thương B2B trực tiếp với hàng trăm doanh nghiệp tiêu biểu.",
    "Tiếp cận thị trường mới và thu hút vốn đầu tư tiềm năng.",
    "Cập nhật các xu hướng công nghệ, chuyển đổi số và phát triển bền vững.",
    "Quảng bá thương hiệu rộng rãi trên các kênh truyền thông báo chí uy tín."
  ],
  imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
  statCardNumber: "100%",
  statCardLabel: "Cơ hội giao thương trực tiếp"
};

export const DEFAULT_BENEFITS: BenefitsContent = {
  badge: "GIÁ TRỊ NỔI BẬT",
  title: "TẠI SAO BẠN NÊN THAM GIA DIỄN ĐÀN?",
  subtitle: "Cơ hội vàng để nâng tầm thương hiệu, gia tăng doanh số và tạo dựng quan hệ chiến lược.",
  items: [
    {
      id: "ben-1",
      title: "Giao thương B2B Trực tiếp",
      description: "Tham gia các phiên B2B Matching 1:1 được sắp xếp khoa học, tìm kiếm nhà cung ứng và khách hàng tiềm năng.",
      iconName: "Handshake",
      badge: "Đặc quyền"
    },
    {
      id: "ben-2",
      title: "Trưng bày & Quảng bá",
      description: "Sở hữu gian hàng triển lãm hiện đại giúp tiếp cận trực tiếp hàng ngàn lượt khách tham quan chuyên nghiệp.",
      iconName: "Store"
    },
    {
      id: "ben-3",
      title: "Cập nhật Tri thức Kinh doanh",
      description: "Lắng nghe các bài chia sẻ từ các diễn giả, chuyên gia hàng đầu về kinh tế số, AI và quản trị doanh nghiệp.",
      iconName: "Lightbulb"
    },
    {
      id: "ben-4",
      title: "Đêm Gala Dinner Sang trọng",
      description: "Tiệc giao lưu buổi tối ấm cúng, tinh tế giúp thắt chặt mối quan hệ ngoại giao và hợp tác kinh doanh lâu dài.",
      iconName: "Utensils"
    },
    {
      id: "ben-5",
      title: "Truyền thông Đa kênh",
      description: "Thương hiệu của bạn xuất hiện trên các trang báo điện tử lớn và các kênh truyền thông chính thức của Diễn đàn.",
      iconName: "TrendingUp"
    },
    {
      id: "ben-6",
      title: "Tiếp cận Nguồn vốn & Khởi nghiệp",
      description: "Gặp gỡ trực tiếp đại diện các quỹ đầu tư, tổ chức tài chính và ngân hàng đồng hành hỗ trợ doanh nghiệp SME.",
      iconName: "DollarSign"
    }
  ]
};

export const DEFAULT_TIMELINE: TimelineContent = {
  badge: "LỊCH TRÌNH CHUYÊN NGHIỆP",
  title: "CHƯƠNG TRÌNH CHI TIẾT 3 NGÀY DIỄN ĐÀN",
  subtitle: "Chuỗi hoạt động phong phú gồm Triển lãm, Hội thảo chuyên đề, B2B Matching và Đêm Gala tôn vinh.",
  days: [
    { dayNumber: 1, dayTitle: "Ngày 1: Khai mạc & Triển lãm", dateText: "18/09/2026" },
    { dayNumber: 2, dayTitle: "Ngày 2: Diễn đàn B2B & Gala", dateText: "19/09/2026" },
    { dayNumber: 3, dayTitle: "Ngày 3: Xúc tiến Đầu tư & Khép lại", dateText: "20/09/2026" }
  ],
  slots: [
    {
      id: "ts-1",
      dayNumber: 1,
      dayTitle: "Ngày 1",
      timeSlot: "08:00 - 09:00",
      title: "Đón tiếp đại biểu & Check-in",
      location: "Sảnh Chính May Plaza Hotel",
      description: "Nhận thẻ đeo, tài liệu sự kiện & thưởng thức tiệc trà teabreak chào mừng."
    },
    {
      id: "ts-2",
      dayNumber: 1,
      dayTitle: "Ngày 1",
      timeSlot: "09:00 - 11:30",
      title: "Lễ Khai mạc Diễn đàng & Cắt băng Khai trương Triển lãm",
      speaker: "Lãnh đạo Bộ Công Thương & Ban Tổ chức TASME",
      location: "Hội trường Grand Ballroom",
      description: "Phát biểu khai mạc, tặng hoa nhà tài trợ và tham quan 100+ gian hàng."
    },
    {
      id: "ts-3",
      dayNumber: 2,
      dayTitle: "Ngày 2",
      timeSlot: "08:30 - 11:30",
      title: "Phiên Kết nối Giao thương B2B Matching Chuyên sâu",
      location: "Khu vực B2B Matching",
      description: "Các cuộc gặp 1:1 theo lịch hẹn trước giữa các Nhà cung ứng và Đối tác mua hàng."
    },
    {
      id: "ts-4",
      dayNumber: 2,
      dayTitle: "Ngày 2",
      timeSlot: "18:00 - 21:30",
      title: "Đêm Gala Dinner & Tôn vinh Doanh nghiệp Tiêu biểu",
      location: "Hội trường Grand Ballroom",
      description: "Tiệc tối sang trọng, biểu diễn nghệ thuật, bốc thăm may mắn và trao chứng nhận."
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
  badge: "ĐỐI TÁC ĐỒNG HÀNH",
  title: "NHÀ TÀI TRỢ & ĐƠN VỊ ĐỒNG HÀNH",
  subtitle: "Xin chân thành cảm ơn các tập đoàn, doanh nghiệp đã tin tưởng và tài trợ cho diễn đàn.",
  items: [
    {
      id: "sp-1",
      name: "Tập Đoàn May Plaza",
      tier: "diamond",
      logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&h=150&fit=crop",
      websiteUrl: "https://mayplazahotel.com"
    },
    {
      id: "sp-2",
      name: "Ngân Hàng Tiêu Biểu",
      tier: "gold",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=150&fit=crop"
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
