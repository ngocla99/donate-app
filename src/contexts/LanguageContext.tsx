import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "vi" | "en";

type Translations = {
  [key: string]: {
    vi: string;
    en: string;
  };
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations: Translations = {
  // Header
  "nav.home": {
    vi: "Trang Chủ",
    en: "Home",
  },
  "nav.dashboard": {
    vi: "Bảng Điều Khiển",
    en: "Dashboard",
  },
  "nav.announcements": {
    vi: "Thông Báo",
    en: "Announcements",
  },
  "auth.login": {
    vi: "Đăng Nhập",
    en: "Login",
  },
  "auth.register": {
    vi: "Đăng Ký",
    en: "Register",
  },
  "auth.logout": {
    vi: "Đăng Xuất",
    en: "Logout",
  },
  "auth.welcome": {
    vi: "Chào mừng",
    en: "Welcome",
  },
  "auth.myAccount": {
    vi: "Tài Khoản Của Tôi",
    en: "My Account",
  },

  // Auth Forms
  "auth.welcomeBack": {
    vi: "Chào Mừng Trở Lại",
    en: "Welcome Back",
  },
  "auth.loginToAccount": {
    vi: "Đăng nhập vào tài khoản của bạn để quản lý các khoản quyên góp và tùy chọn",
    en: "Login to your account to manage your donations and preferences",
  },
  "auth.joinCommunity": {
    vi: "Tham Gia Cộng Đồng Của Chúng Tôi",
    en: "Join Our Community",
  },
  "auth.createAccount": {
    vi: "Tạo tài khoản để theo dõi các khoản quyên góp của bạn và kết nối với cộng đồng Phật giáo của chúng tôi",
    en: "Create an account to track your donations and connect with our Buddhist community",
  },
  "auth.email": {
    vi: "Thư điện tử",
    en: "Email",
  },
  "auth.password": {
    vi: "Mật khẩu",
    en: "Password",
  },
  "auth.forgotPassword": {
    vi: "Quên mật khẩu?",
    en: "Forgot password?",
  },
  "auth.fullName": {
    vi: "Họ và Tên",
    en: "Full Name",
  },
  "auth.termsAgreement": {
    vi: "Bằng cách đăng ký, bạn đồng ý với",
    en: "By registering, you agree to our",
  },
  "auth.termsOfService": {
    vi: "Điều Khoản Dịch Vụ",
    en: "Terms of Service",
  },
  "auth.and": {
    vi: "và",
    en: "and",
  },
  "auth.privacyPolicy": {
    vi: "Chính Sách Bảo Mật",
    en: "Privacy Policy",
  },
  "auth.createAccountButton": {
    vi: "Tạo Tài Khoản",
    en: "Create Account",
  },
  "auth.creatingAccount": {
    vi: "Đang tạo tài khoản...",
    en: "Creating account...",
  },
  "auth.loggingIn": {
    vi: "Đang đăng nhập...",
    en: "Logging in...",
  },

  // Home
  "home.heroTitle": {
    vi: "Hỗ Trợ Cộng Đồng Phật Giáo Của Chúng Tôi Thông Qua Sự Cho Đi Chánh Niệm",
    en: "Support Our Buddhist Community Through Mindful Giving",
  },
  "home.heroSubtitle": {
    vi: "Tham gia cộng đồng từ bi của chúng tôi trong việc hỗ trợ trùng tu chùa, các chương trình thiền định và các sáng kiến từ thiện.",
    en: "Join our compassionate community in supporting temple renovations, meditation programs, and charitable initiatives.",
  },
  "home.donateNow": {
    vi: "Quyên Góp Ngay",
    en: "Donate Now",
  },
  "home.learnMore": {
    vi: "Tìm Hiểu Thêm",
    en: "Learn More",
  },
  "home.joinCommunity": {
    vi: "Tham Gia Cộng Đồng Của Chúng Tôi",
    en: "Join Our Community",
  },
  "home.joinDescription": {
    vi: "Tạo tài khoản để theo dõi các khoản quyên góp của bạn, nhận nhắc nhở cá nhân hóa và kết nối với cộng đồng Phật giáo của chúng tôi.",
    en: "Create an account to track your donations, receive personalized reminders, and connect with our Buddhist community.",
  },

  // Footer
  "footer.quickLinks": {
    vi: "Liên Kết Nhanh",
    en: "Quick Links",
  },
  "footer.contact": {
    vi: "Liên Hệ",
    en: "Contact",
  },
  "footer.copyright": {
    vi: "Đã đăng ký bản quyền.",
    en: "All rights reserved.",
  },

  // Dashboard
  "dashboard.title": {
    vi: "Bảng Điều Khiển Của Bạn",
    en: "Your Dashboard",
  },
  "dashboard.welcome": {
    vi: "Chào mừng",
    en: "Welcome",
  },
  "dashboard.personalDashboard": {
    vi: "Bảng điều khiển quyên góp cá nhân của bạn",
    en: "Your personal donation dashboard",
  },
  "dashboard.description": {
    vi: "Đây là nơi bạn sẽ xem lịch sử quyên góp và quản lý tùy chọn của bạn.",
    en: "This is where you will view your donation history and manage your preferences.",
  },
  "dashboard.recentDonations": {
    vi: "Quyên Góp Gần Đây",
    en: "Recent Donations",
  },
  "dashboard.recentActivity": {
    vi: "Hoạt động đóng góp gần đây của bạn",
    en: "Your recent donation activity",
  },
  "dashboard.noDonations": {
    vi: "Chưa có quyên góp nào. Hãy thực hiện đóng góp đầu tiên của bạn ngay hôm nay!",
    en: "No donations yet. Make your first contribution today!",
  },
  "dashboard.reminderSettings": {
    vi: "Cài Đặt Nhắc Nhở",
    en: "Reminder Settings",
  },
  "dashboard.reminderDescription": {
    vi: "Quản lý nhắc nhở quyên góp của bạn",
    en: "Manage your donation reminders",
  },
  "dashboard.reminderConfig": {
    vi: "Cấu hình cách thức và thời điểm bạn muốn nhận nhắc nhở quyên góp.",
    en: "Configure how and when you want to receive donation reminders.",
  },

  // Stats
  "stats.overview": {
    vi: "Tổng Quan Quyên Góp",
    en: "Donation Overview",
  },
  "stats.totalDonations": {
    vi: "Tổng Quyên Góp",
    en: "Total Donations",
  },
  "stats.lifetimeContributions": {
    vi: "Đóng góp trọn đời",
    en: "Lifetime contributions",
  },
  "stats.recentActivity": {
    vi: "Hoạt Động Gần Đây",
    en: "Recent Activity",
  },
  "stats.newDonationsThisWeek": {
    vi: "Quyên góp mới tuần này",
    en: "New donations this week",
  },
  "stats.donors": {
    vi: "Người Quyên Góp",
    en: "Donors",
  },
  "stats.communityMembers": {
    vi: "Thành viên cộng đồng",
    en: "Community members",
  },
  "stats.annualGoal": {
    vi: "Mục Tiêu Hàng Năm",
    en: "Annual Goal",
  },
  "stats.of": {
    vi: "của",
    en: "of",
  },

  // Announcements
  "announcements.title": {
    vi: "Thông Báo",
    en: "Announcements",
  },
  "announcements.description": {
    vi: "Cập nhật mới nhất và tình trạng quyên góp từ cộng đồng của chúng tôi",
    en: "Latest updates and donation status from our community",
  },
  "announcements.event": {
    vi: "event",
    en: "event",
  },
  "announcements.update": {
    vi: "update",
    en: "update",
  },
  "announcements.donation": {
    vi: "donation",
    en: "donation",
  },
  "announcements.community": {
    vi: "community",
    en: "community",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "vi",
  setLanguage: () => {},
  t: () => "",
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage as Language) || "vi"; // Default to Vietnamese
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
