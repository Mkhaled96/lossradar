import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../lib/i18n.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";

export default function ClientPortal() {
  const { t } = useLanguage();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from("profiles")
      .select("client_id")
      .eq("id", userData.user.id)
      .single();

    if (profile?.client_id) {
      const [{ data: clientData }, { data: projectsData }] = await Promise.all([
        supabase.from("clients").select("*").eq("id", profile.client_id).single(),
        supabase
          .from("projects")
          .select("*")
          .eq("client_id", profile.client_id)
          .order("created_at", { ascending: false }),
      ]);
      setClient(clientData);
      setProjects(projectsData || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return <div style={styles.page}>{t("loading")}</div>;
  }

  return (
    <div style={styles.page}>
      <LanguageToggle />
      <button style={styles.logoutButton} onClick={handleLogout}>
        {t("logout_button")}
      </button>

      <header style={styles.header}>
        <div style={styles.eyebrow}>{client?.client_code}</div>
        <h1 style={styles.heading}>{client?.name || t("client_portal_heading")}</h1>
      </header>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>{t("new_project_button").replace("+ ", "")}</h2>
        {projects.length === 0 ? (
          <p style={styles.muted}>{t("no_projects_yet")}</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} style={styles.projectRow}>
              <div style={styles.projectHeader}>
                <span style={styles.projectName}>{p.name}</span>
                <span style={styles.projectPercent}>{p.progress}%</span>
              </div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${p.progress}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F4F1EA",
    padding: "40px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: "relative",
  },
  logoutButton: {
    position: "absolute",
    top: "20px",
    insetInlineStart: "40px",
    padding: "6px 14px",
    borderRadius: "999px",
    border: "1px solid #D8D3C7",
    background: "transparent",
    color: "#6B7280",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  header: { margin: "20px 0 28px" },
  eyebrow: {
    fontSize: "13px",
    letterSpacing: "2px",
    color: "#D9762E",
    fontWeight: 600,
    marginBottom: "4px",
    fontFamily: "monospace",
  },
  heading: { fontSize: "28px", fontWeight: 700, color: "#1F2937", margin: 0 },
  card: {
    background: "#FFFFFF",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #E5E0D5",
  },
  sectionTitle: { fontSize: "16px", fontWeight: 700, color: "#1F2937", margin: "0 0 16px" },
  muted: { color: "#9CA3AF", fontSize: "14px" },
  projectRow: { padding: "16px 0", borderBottom: "1px solid #F0EDE4" },
  projectHeader: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  projectName: { fontSize: "15px", fontWeight: 600, color: "#1F2937" },
  projectPercent: { fontSize: "14px", fontWeight: 700, color: "#D9762E" },
  progressTrack: {
    width: "100%",
    height: "8px",
    background: "#F0EDE4",
    borderRadius: "999px",
    overflow: "hidden",
  },
  progressFill: { height: "100%", background: "#D9762E", borderRadius: "999px" },
};
