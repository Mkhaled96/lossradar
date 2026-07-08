import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const palettes = {
  light: {
    "--bg": "#F4F1EA",
    "--sidebar-bg": "#1F2937",
    "--card-bg": "#FFFFFF",
    "--card-border": "#E5E0D5",
    "--text-primary": "#1F2937",
    "--text-secondary": "#6B7280",
    "--text-muted": "#9CA3AF",
    "--input-bg": "#FFFFFF",
    "--input-border": "#D8D3C7",
    "--row-border": "#F0EDE4",
    "--hover-bg": "#F7F4EC",
    "--accent": "#D9762E",
    "--accent-soft": "#FDE7DC",
  },
  dark: {
    "--bg": "#0F1117",
    "--sidebar-bg": "#15171E",
    "--card-bg": "#1A1D26",
    "--card-border": "rgba(255,255,255,0.08)",
    "--text-primary": "#F4F1EA",
    "--text-secondary": "#9CA3AF",
    "--text-muted": "#6B7280",
    "--input-bg": "#22252F",
    "--input-border": "rgba(255,255,255,0.1)",
    "--row-border": "rgba(255,255,255,0.06)",
    "--hover-bg": "rgba(255,255,255,0.03)",
    "--accent": "#F5642A",
    "--accent-soft": "rgba(245,100,42,0.15)",
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("lr_theme") || "light");

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("lr_theme", next);
  }

  const vars = palettes[theme];
  const style = Object.fromEntries(Object.entries(vars));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{ ...style, minHeight: "100vh", background: "var(--bg)" }}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
