import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../lib/i18n.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "📊", path: "/admin" },
  { key: "reports", label: "Reports", icon: "📄", path: "/admin/reports" },
  {
    key: "crm",
    label: "CRM",
    icon: "👥",
    path: "/admin/parties",
    children: [
      { label: "Parties", path: "/admin/parties" },
      { label: "Users", path: "/admin/users" },
      { label: "History", path: "/admin/history" },
      { label: "Complaints", path: "/admin/complaints" },
    ],
  },
  { key: "finance", label: "Finance", icon: "💰", path: "/admin/finance" },
];

export default function AdminLayout({ children }) {
  const { t } = useLanguage();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="al-shell">
      <style>{css}</style>

      <aside className="al-sidebar">
        <div className="al-brand">
          <span className="al-brand-mark">
            loss<span className="al-accent">radar</span>
          </span>
        </div>

        <nav className="al-nav">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.key}
              className="al-nav-item-wrap"
              onMouseEnter={() => item.children && setOpenMenu(item.key)}
              onMouseLeave={() => item.children && setOpenMenu(null)}
            >
              <Link
                to={item.path}
                className={`al-nav-item ${location.pathname.startsWith(item.path) ? "active" : ""}`}
              >
                <span className="al-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
              {item.children && openMenu === item.key && (
                <div className="al-submenu">
                  {item.children.map((c) => (
                    <Link key={c.path} to={c.path} className="al-submenu-item">
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <button className="al-logout" onClick={handleLogout}>
          🚪 {t("logout_button")}
        </button>
      </aside>

      <main className="al-main">
        <div className="al-topbar">
          <LanguageToggle style={{ position: "static" }} />
        </div>
        {children}
      </main>
    </div>
  );
}

const css = `
  .al-shell {
    display: flex;
    min-height: 100vh;
    background: #F4F1EA;
    font-family: 'Inter', 'Segoe UI', sans-serif;
  }
  .al-sidebar {
    width: 220px;
    flex-shrink: 0;
    background: #1F2937;
    color: #F4F1EA;
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
  }
  .al-brand { padding: 0 8px 24px; }
  .al-brand-mark { font-size: 18px; font-weight: 800; }
  .al-accent { color: #F5642A; }

  .al-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .al-nav-item-wrap { position: relative; }
  .al-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    color: #D1D5DB;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
  }
  .al-nav-item:hover { background: rgba(255,255,255,0.06); }
  .al-nav-item.active { background: #F5642A; color: #fff; }
  .al-nav-icon { font-size: 15px; }

  .al-submenu {
    position: absolute;
    left: 100%;
    top: 0;
    margin-left: 6px;
    background: #1F2937;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 6px;
    min-width: 160px;
    z-index: 30;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  }
  .al-submenu-item {
    display: block;
    padding: 9px 12px;
    color: #D1D5DB;
    text-decoration: none;
    font-size: 13px;
    border-radius: 6px;
  }
  .al-submenu-item:hover { background: rgba(255,255,255,0.08); color: #fff; }

  .al-logout {
    margin-top: auto;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.12);
    background: transparent;
    color: #9CA3AF;
    font-size: 13px;
    cursor: pointer;
    text-align: left;
  }

  .al-main { flex: 1; padding: 24px 40px; min-width: 0; }
  .al-topbar { display: flex; justify-content: flex-end; margin-bottom: 16px; }

  @media (max-width: 900px) {
    .al-shell { flex-direction: column; }
    .al-sidebar { width: 100%; flex-direction: row; align-items: center; padding: 12px 16px; }
    .al-nav { flex-direction: row; overflow-x: auto; }
    .al-brand { padding: 0 12px 0 0; }
    .al-logout { margin-top: 0; margin-left: auto; }
    .al-main { padding: 20px; }
  }
`;
