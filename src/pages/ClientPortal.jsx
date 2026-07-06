import { useLanguage } from "../lib/i18n.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";

export default function ClientPortal() {
  const { t } = useLanguage();
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", position: "relative", minHeight: "100vh" }}>
      <LanguageToggle />
      <h1>{t("client_portal_heading")}</h1>
    </div>
  );
}
