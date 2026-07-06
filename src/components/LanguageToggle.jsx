import { useLanguage } from "../lib/i18n.jsx";

export default function LanguageToggle({ style }) {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      style={{
        position: "absolute",
        top: "20px",
        insetInlineEnd: "20px",
        padding: "6px 14px",
        borderRadius: "999px",
        border: "1px solid #D8D3C7",
        background: "#FFFFFF",
        color: "#1F2937",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        zIndex: 10,
        ...style,
      }}
    >
      {lang === "ar" ? "EN" : "عربي"}
    </button>
  );
}
