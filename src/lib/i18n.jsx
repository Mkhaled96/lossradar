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

    owner_eyebrow: "لوحة تحكم الـ Owner",
    clients_heading: "العملاء",
    new_client_button: "+ عميل جديد",
    cancel_button: "إلغاء",
    client_name_label: "اسم العميل",
    client_code_label: "كود العميل",
    sheet_id_label: "Google Sheet ID",
    sheet_tab_label: "اسم التاب (Tab)",
    save_client_button: "حفظ العميل",
    saving: "جارٍ الحفظ...",
    table_name: "الاسم",
    table_code: "الكود",
    table_sheet: "Google Sheet",
    table_date: "تاريخ الإضافة",
    sheet_linked: "مربوط",
    sheet_not_linked: "مش مربوط",
    no_clients_yet: 'لسه معملتش أي عميل. دوس "+ عميل جديد" فوق عشان تبدأ.',
    loading: "جارٍ التحميل...",
    duplicate_code_error: "كود العميل ده مستخدم قبل كده، اختار كود مختلف",
    generic_error: "حصل خطأ، حاول تاني",

    back_to_clients: "← رجوع للعملاء",
    new_project_button: "+ مشروع جديد",
    project_name_label: "اسم المشروع",
    project_progress_label: "نسبة الإنجاز المبدئية (%)",
    save_project_button: "حفظ المشروع",
    no_projects_yet: "لسه معملتش أي مشروع للعميل ده.",

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
    clients_heading: "Clients",
    new_client_button: "+ New Client",
    cancel_button: "Cancel",
    client_name_label: "Client Name",
    client_code_label: "Client Code",
    sheet_id_label: "Google Sheet ID",
    sheet_tab_label: "Tab Name",
    save_client_button: "Save Client",
    saving: "Saving...",
    table_name: "Name",
    table_code: "Code",
    table_sheet: "Google Sheet",
    table_date: "Added On",
    sheet_linked: "Linked",
    sheet_not_linked: "Not Linked",
    no_clients_yet: 'No clients yet. Click "+ New Client" above to start.',
    loading: "Loading...",
    duplicate_code_error: "This client code is already in use, choose a different one",
    generic_error: "Something went wrong, please try again",

    back_to_clients: "← Back to Clients",
    new_project_button: "+ New Project",
    project_name_label: "Project Name",
    project_progress_label: "Initial Progress (%)",
    save_project_button: "Save Project",
    no_projects_yet: "No projects yet for this client.",

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
