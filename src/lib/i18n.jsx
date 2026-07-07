import { createContext, useContext, useState } from "react";

const translations = {
  ar: {
    dir: "rtl",
    login_eyebrow: "تسجيل الدخول",
    login_heading: "ابدأ المراقبة",
    login_email: "البريد الإلكتروني",
    login_password: "كلمة المرور",
    login_button: "دخول",
    login_error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    login_tagline: "ترصد كل خسارة. تكشف كل نمط. تتحكم في كل قرار.",
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
  const [lang, setLang] = useState(localStorage.getItem("lr_lang") || "ar");

  function toggleLang() {
    const next = lang === "ar" ? "en" : "ar";
    setLang(next);
    localStorage.setItem("lr_lang", next);
  }

  const t = (key) => translations[lang][key] || key;
  const dir = translations[lang].dir;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
