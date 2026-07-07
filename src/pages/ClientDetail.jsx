import { createContext, useContext, useState } from "react";

const translations = {
  ar: {
    dir: "rtl",
    login_eyebrow: "تسجيل الدخول",
    login_heading: "ابدأ المراقبة",
    login_email: "البريد الإلكتروني",
    login_password: "كلمة المرور",
    login_button: "دخول",
    login_loading: "جارٍ التحقق...",
    login_error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    login_tagline: "ترصد كل خسارة. تكشف كل نمط. تتحكم في كل قرار.",
    login_subtitle: "ذكاء تحليل الخسائر",
    login_welcome: "أهلاً بيك تاني",
    login_welcome_sub: "سجّل دخولك عشان توصل للوحة LossRadar بتاعتك",
    login_remember: "فاكرني",
    login_forgot: "نسيت كلمة المرور؟",
    login_or: "أو",
    login_sso: "دخول عبر SSO",
    login_security: "أمان بمستوى المؤسسات",
    login_cert: "معتمد ISO 27001",
    login_footer: "© 2026 LossRadar. جميع الحقوق محفوظة.",

    hero_headline_1: "حوّل بيانات الأسطول",
    hero_headline_2: "لتحليل خسائر",
    hero_headline_3: "قابل للتنفيذ.",
    hero_sub: "رؤى لحظية. قرارات أذكى. خسائر أقل. أداء أعلى.",
    stat_total_loss: "إجمالي الخسارة",
    stat_vs_last: "مقارنة بآخر 30 يوم",
    stat_trips: "رحلة متأخرة",
    stat_violations: "مخالفة",
    insight_alert: "تنبيه تحليلي",
    insight_text: "انحراف المسار بيكلفك",
    insight_of_total: "من إجمالي الخسارة",
    insight_view: "عرض التفاصيل",
    chart_daily_title: "الخسارة اليومية واستهلاك الوقود",
    chart_last_7: "آخر 7 أيام",
    chart_loss: "الخسارة (جنيه)",
    chart_fuel: "استهلاك الوقود (لتر)",
    donut_title: "الخسارة حسب النوع",
    donut_total: "الإجمالي",
    cat_deviation: "انحراف المسار",
    cat_speeding: "السرعة الزايدة",
    cat_braking: "الفرملة المفاجئة",
    cat_idling: "التوقف الزايد",
    driver_title: "أداء السائقين",
    driver_view_all: "عرض الكل",

    owner_eyebrow: "لوحة تحكم الـ Owner",
    clients_heading: "الأطراف",
    new_client_button: "+ طرف جديد",
    cancel_button: "إلغاء",
    client_name_label: "اسم الطرف",
    client_code_label: "كود الطرف",
    sheet_id_label: "Google Sheet ID",
    sheet_tab_label: "اسم التاب (Tab)",
    save_client_button: "حفظ الطرف",
    saving: "جارٍ الحفظ...",
    table_name: "الاسم",
    table_code: "الكود",
    table_sheet: "Google Sheet",
    table_date: "تاريخ الإضافة",
    sheet_linked: "مربوط",
    sheet_not_linked: "مش مربوط",
    no_clients_yet: 'لسه معملتش أي طرف. دوس "+ طرف جديد" فوق عشان تبدأ.',
    loading: "جارٍ التحميل...",
    duplicate_code_error: "كود الطرف ده مستخدم قبل كده، اختار كود مختلف",
    generic_error: "حصل خطأ، حاول تاني",

    back_to_clients: "← رجوع للأطراف",
    new_project_button: "+ مشروع جديد",
    project_name_label: "اسم المشروع",
    project_progress_label: "نسبة الإنجاز المبدئية (%)",
    save_project_button: "حفظ المشروع",
    no_projects_yet: "لسه معملتش أي مشروع للطرف ده.",
    logout_button: "تسجيل الخروج",

    users_heading: "المستخدمين",
    new_user_button: "+ مستخدم جديد",
    user_email_label: "الإيميل (اسم الدخول)",
    user_password_label: "كلمة المرور",
    user_fullname_label: "الاسم",
    save_user_button: "إنشاء المستخدم",
    no_users_yet: "لسه معملتش أي مستخدم لهذا الطرف.",
    user_created_success: "تم إنشاء المستخدم بنجاح",

    client_portal_heading: "بوابة العميل",
  },
  en: {
    dir: "ltr",
    login_eyebrow: "Sign In",
    login_heading: "Start Monitoring",
    login_email: "Email",
    login_password: "Password",
    login_button: "Login",
    login_loading: "Checking...",
    login_error: "Incorrect email or password",
    login_tagline: "Track every loss. Detect every pattern. Control every decision.",
    login_subtitle: "Loss Intelligence",
    login_welcome: "Welcome Back",
    login_welcome_sub: "Sign in to access your LossRadar dashboard",
    login_remember: "Remember me",
    login_forgot: "Forgot password?",
    login_or: "or",
    login_sso: "Sign in with SSO",
    login_security: "Enterprise-grade security",
    login_cert: "ISO 27001 Certified",
    login_footer: "© 2026 LossRadar. All rights reserved.",

    hero_headline_1: "Turn Fleet Data",
    hero_headline_2: "Into Actionable",
    hero_headline_3: "Loss Intelligence.",
    hero_sub: "Real-time insights. Smarter decisions. Lower losses. Higher performance.",
    stat_total_loss: "TOTAL LOSS",
    stat_vs_last: "vs last 30 days",
    stat_trips: "delayed trips",
    stat_violations: "violations",
    insight_alert: "INSIGHT ALERT",
    insight_text: "Route Deviation is costing",
    insight_of_total: "of your total loss",
    insight_view: "View details",
    chart_daily_title: "Daily Loss & Fuel Waste",
    chart_last_7: "Last 7 Days",
    chart_loss: "Loss (EGP)",
    chart_fuel: "Fuel Waste (L)",
    donut_title: "Loss by Category",
    donut_total: "Total",
    cat_deviation: "Route Deviation",
    cat_speeding: "Speeding",
    cat_braking: "Harsh Braking",
    cat_idling: "Excessive Idling",
    driver_title: "Driver Performance",
    driver_view_all: "View all",

    owner_eyebrow: "Owner Dashboard",
    clients_heading: "Parties",
    new_client_button: "+ New Party",
    cancel_button: "Cancel",
    client_name_label: "Party Name",
    client_code_label: "Party Code",
    sheet_id_label: "Google Sheet ID",
    sheet_tab_label: "Tab Name",
    save_client_button: "Save Party",
    saving: "Saving...",
    table_name: "Name",
    table_code: "Code",
    table_sheet: "Google Sheet",
    table_date: "Added On",
    sheet_linked: "Linked",
    sheet_not_linked: "Not Linked",
    no_clients_yet: 'No parties yet. Click "+ New Party" above to start.',
    loading: "Loading...",
    duplicate_code_error: "This party code is already in use, choose a different one",
    generic_error: "Something went wrong, please try again",

    back_to_clients: "← Back to Parties",
    new_project_button: "+ New Project",
    project_name_label: "Project Name",
    project_progress_label: "Initial Progress (%)",
    save_project_button: "Save Project",
    no_projects_yet: "No projects yet for this party.",
    logout_button: "Log Out",

    users_heading: "Users",
    new_user_button: "+ New User",
    user_email_label: "Email (login)",
    user_password_label: "Password",
    user_fullname_label: "Full Name",
    save_user_button: "Create User",
    no_users_yet: "No users yet for this party.",
    user_created_success: "User created successfully",

    client_portal_heading: "Client Portal",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("lr_lang") || "en");

  function toggleLang() {
    const next = lang === "ar" ? "en" : "ar";
    setLang(next);
    localStorage.setItem("lr_lang", next);
  }

  const t = (key) => translations[lang][key] || key;
  // Layout direction is always fixed (ltr) regardless of language —
  // only the text content changes, not the structure of the UI.
  const dir = "ltr";

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
