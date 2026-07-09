import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../lib/i18n.jsx";
import { useTheme } from "../lib/theme.jsx";

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

const BREADCRUMB_LABELS = {
  admin: "Owner Dashboard",
  parties: "Parties",
  users: "Users",
  reports: "Reports",
  history: "History",
  complaints: "Complaints",
  finance: "Finance",
  dashboard: "Dashboard",
};

export default function AdminLayout({ children }) {
  const { t, lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openCrm, setOpenCrm] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", userData.user.id)
      .single();
    setProfile({ ...data, email: userData.user.email });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const crumbs = ["admin", ...location.pathname.split("/").filter((p) => p && p !== "admin")];
  const initials = (profile?.full_name || profile?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="al-shell" data-theme={theme}>
      <style>{css}</style>

      <aside className={`al-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="al-brand-row">
          {!collapsed && (
            <span className="al-brand-mark">
              loss<span className="al-accent">radar</span>
            </span>
          )}
          <button className="al-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="al-nav">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.key} className="al-nav-group">
                <button
                  className={`al-nav-item al-nav-toggle ${
                    location.pathname.startsWith("/admin/parties") ||
                    location.pathname.startsWith("/admin/users") ||
                    location.pathname.startsWith("/admin/history") ||
                    location.pathname.startsWith("/admin/complaints")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setOpenCrm(!openCrm)}
                >
                  <span className="al-nav-icon">{item.icon}</span>
                  {!collapsed && <span className="al-nav-label">{item.label}</span>}
                  {!collapsed && <span className="al-chevron">{openCrm ? "▾" : "▸"}</span>}
                </button>
                {openCrm && !collapsed && (
                  <div className="al-nav-children">
                    {item.children.map((c) => (
                      <Link
                        key={c.path}
                        to={c.path}
                        className={`al-nav-child ${
                          location.pathname === c.path ? "active" : ""
                        }`}
                      >
                        <span className="al-dot" />
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.key}
                to={item.path}
                className={`al-nav-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="al-nav-icon">{item.icon}</span>
                {!collapsed && <span className="al-nav-label">{item.label}</span>}
              </Link>
            )
          )}
        </nav>

        <div className="al-profile-wrap">
          <button className="al-profile" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
            <div className="al-avatar">{initials}</div>
            {!collapsed && (
              <div className="al-profile-info">
                <div className="al-profile-name">{profile?.full_name || "Owner"}</div>
              </div>
            )}
            {!collapsed && <span className="al-profile-caret">▾</span>}
          </button>

          {profileMenuOpen && (
            <div className="al-profile-menu">
              <button className="al-profile-menu-item">
                <span className="al-menu-icon">👤</span> My Profile
              </button>
              <button className="al-profile-menu-item">
                <span className="al-menu-icon">⚙️</span> Settings
              </button>
              <button className="al-profile-menu-item al-menu-logout" onClick={handleLogout}>
                <span className="al-menu-icon">🚪</span> {t("logout_button")}
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="al-main">
        <div className="al-topbar">
          <div className="al-breadcrumb">
            {crumbs.map((c, i) => (
              <span key={i}>
                {i > 0 && <span className="al-crumb-sep"> / </span>}
                <span className={i === crumbs.length - 1 ? "al-crumb-active" : ""}>
                  {BREADCRUMB_LABELS[c] || c}
                </span>
              </span>
            ))}
          </div>
          <div className="al-topbar-actions">
            <button className="al-icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button className="al-icon-btn al-lang-btn" onClick={toggleLang}>
              {lang === "ar" ? "EN" : "AR"}
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

const css = `
  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background: var(--bg);
  }
  .al-shell {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Inter', 'Segoe UI', sans-serif;
    transition: background 0.2s ease;
  }
  .al-sidebar {
    width: 240px;
    flex-shrink: 0;
    background: var(--sidebar-bg);
    color: #F4F1EA;
    display: flex;
    flex-direction: column;
    padding: 20px 14px;
    transition: width 0.2s ease;
  }
  .al-sidebar.collapsed { width: 68px; align-items: center; }

  .al-brand-row { display: flex; align-items: center; justify-content: space-between; padding: 4px 6px 20px; }
  .al-brand-mark { font-size: 17px; font-weight: 800; color: #fff; }
  .al-accent { color: var(--accent); }
  .al-collapse-btn {
    background: rgba(255,255,255,0.06); border: none; color: #D1D5DB;
    width: 26px; height: 26px; border-radius: 6px; cursor: pointer; font-size: 13px;
  }

  .al-nav { flex: 1; display: flex; flex-direction: column; gap: 3px; width: 100%; }
  .al-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px;
    border-radius: 8px;
    color: #D1D5DB;
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 500;
    background: none;
    border: none;
    width: 100%;
    cursor: pointer;
    text-align: left;
  }
  .al-nav-item:hover { background: rgba(255,255,255,0.06); }
  .al-nav-item.active { background: var(--accent); color: #fff; }
  .al-nav-icon { font-size: 14px; width: 18px; text-align: center; }
  .al-nav-label { flex: 1; }
  .al-chevron { font-size: 10px; opacity: 0.6; }

  .al-nav-children { display: flex; flex-direction: column; margin: 2px 0 6px 30px; gap: 1px; }
  .al-nav-child {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 10px;
    border-radius: 6px;
    color: #9CA3AF;
    text-decoration: none;
    font-size: 13px;
  }
  .al-nav-child:hover { background: rgba(255,255,255,0.05); color: #E5E7EB; }
  .al-nav-child.active { color: var(--accent); font-weight: 600; }
  .al-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; opacity: 0.6; }

  .al-profile-wrap { position: relative; margin-top: 8px; width: 100%; }
  .al-profile {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 8px;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 14px;
    width: 100%;
    background: none;
    border-left: none; border-right: none; border-bottom: none;
    cursor: pointer;
  }
  .al-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--accent); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; flex-shrink: 0;
  }
  .al-profile-info { min-width: 0; flex: 1; text-align: left; }
  .al-profile-name { font-size: 13px; font-weight: 600; color: #F4F1EA; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .al-profile-caret { font-size: 10px; color: #9CA3AF; }

  .al-profile-menu {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 0;
    right: 0;
    background: var(--sidebar-bg);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 6px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    z-index: 40;
  }
  .al-profile-menu-item {
    display: flex; align-items: center; gap: 10px;
    width: 100%;
    padding: 9px 10px;
    border-radius: 7px;
    background: none;
    border: none;
    color: #D1D5DB;
    font-size: 13px;
    cursor: pointer;
    text-align: left;
  }
  .al-profile-menu-item:hover { background: rgba(255,255,255,0.06); }
  .al-menu-icon { font-size: 13px; width: 16px; text-align: center; }
  .al-menu-logout { color: #F87171; }

  .al-main { flex: 1; padding: 24px 32px; min-width: 0; }
  .al-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .al-breadcrumb { font-size: 12px; color: var(--text-muted); text-transform: capitalize; }
  .al-crumb-active { color: var(--accent); font-weight: 600; }
  .al-crumb-sep { margin: 0 4px; }
  .al-topbar-actions { display: flex; gap: 8px; }
  .al-icon-btn {
    width: 34px; height: 34px; border-radius: 999px;
    border: 1px solid var(--card-border);
    background: var(--card-bg);
    color: var(--text-primary);
    cursor: pointer;
    font-size: 14px;
    display: flex; align-items: center; justify-content: center;
  }
  .al-lang-btn { width: auto; padding: 0 12px; font-size: 12px; font-weight: 700; }

  @media (max-width: 900px) {
    .al-shell { flex-direction: column; }
    .al-sidebar { width: 100% !important; flex-direction: row; align-items: center; padding: 10px 14px; }
    .al-sidebar .al-nav { flex-direction: row; overflow-x: auto; }
    .al-nav-children { display: none !important; }
    .al-profile-wrap { display: none; }
    .al-main { padding: 18px; }
  }
`;
