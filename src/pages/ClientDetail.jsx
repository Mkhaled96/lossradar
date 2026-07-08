import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../lib/i18n.jsx";
import AdminLayout from "../components/AdminLayout.jsx";

export default function ClientDetail() {
  const { t } = useLanguage();
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [projectError, setProjectError] = useState("");
  const [projectForm, setProjectForm] = useState({ name: "", progress: 0 });

  const [showUserForm, setShowUserForm] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [userError, setUserError] = useState("");
  const [userSuccess, setUserSuccess] = useState("");
  const [userForm, setUserForm] = useState({ email: "", password: "", full_name: "" });

  async function loadData() {
    setLoading(true);
    const [{ data: clientData }, { data: projectsData }, { data: usersData }] = await Promise.all([
      supabase.from("clients").select("*").eq("id", clientId).single(),
      supabase
        .from("projects")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false }),
    ]);
    setClient(clientData);
    setProjects(projectsData || []);
    setUsers(usersData || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  async function handleCreateProject(e) {
    e.preventDefault();
    setProjectError("");
    setSavingProject(true);

    const { error: insertError } = await supabase.from("projects").insert({
      client_id: clientId,
      name: projectForm.name,
      progress: Number(projectForm.progress),
    });

    setSavingProject(false);

    if (insertError) {
      setProjectError(t("generic_error"));
      return;
    }

    setProjectForm({ name: "", progress: 0 });
    setShowProjectForm(false);
    loadData();
  }

  function updateProgress(projectId, newProgress) {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, progress: newProgress } : p))
    );
    supabase.from("projects").update({ progress: newProgress }).eq("id", projectId);
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    setUserError("");
    setUserSuccess("");
    setSavingUser(true);

    const { data, error: fnError } = await supabase.functions.invoke("create-party-user", {
      body: {
        email: userForm.email,
        password: userForm.password,
        full_name: userForm.full_name,
        client_id: clientId,
      },
    });

    setSavingUser(false);

    if (fnError || !data?.success) {
      setUserError(data?.error || t("generic_error"));
      return;
    }

    setUserSuccess(t("user_created_success"));
    setUserForm({ email: "", password: "", full_name: "" });
    setShowUserForm(false);
    loadData();
  }

  if (loading) {
    return <div style={styles.page}>{t("loading")}</div>;
  }

  return (
    <AdminLayout>
      <Link to="/admin/parties" style={styles.backLink}>
        {t("back_to_clients")}
      </Link>

      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>{client?.client_code}</div>
          <h1 style={styles.heading}>{client?.name}</h1>
        </div>
      </header>

      {/* ===== Projects section ===== */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{t("new_project_button").replace("+ ", "")}</h2>
        <button style={styles.primaryButton} onClick={() => setShowProjectForm(!showProjectForm)}>
          {showProjectForm ? t("cancel_button") : t("new_project_button")}
        </button>
      </div>

      {showProjectForm && (
        <form style={styles.card} onSubmit={handleCreateProject}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>{t("project_name_label")}</label>
              <input
                style={styles.input}
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{t("project_progress_label")}</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                max="100"
                value={projectForm.progress}
                onChange={(e) => setProjectForm({ ...projectForm, progress: e.target.value })}
              />
            </div>
          </div>
          {projectError && <div style={styles.errorBox}>{projectError}</div>}
          <button style={styles.primaryButton} type="submit" disabled={savingProject}>
            {savingProject ? t("saving") : t("save_project_button")}
          </button>
        </form>
      )}

      <div style={styles.card}>
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
              <input
                type="range"
                min="0"
                max="100"
                value={p.progress}
                onChange={(e) => updateProgress(p.id, Number(e.target.value))}
                style={styles.slider}
              />
            </div>
          ))
        )}
      </div>

      {/* ===== Users section ===== */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{t("users_heading")}</h2>
        <button style={styles.primaryButton} onClick={() => setShowUserForm(!showUserForm)}>
          {showUserForm ? t("cancel_button") : t("new_user_button")}
        </button>
      </div>

      {showUserForm && (
        <form style={styles.card} onSubmit={handleCreateUser}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>{t("user_email_label")}</label>
              <input
                style={styles.input}
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{t("user_password_label")}</label>
              <input
                style={styles.input}
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div>
              <label style={styles.label}>{t("user_fullname_label")}</label>
              <input
                style={styles.input}
                value={userForm.full_name}
                onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
              />
            </div>
          </div>
          {userError && <div style={styles.errorBox}>{userError}</div>}
          <button style={styles.primaryButton} type="submit" disabled={savingUser}>
            {savingUser ? t("saving") : t("save_user_button")}
          </button>
        </form>
      )}

      {userSuccess && <div style={styles.successBox}>{userSuccess}</div>}

      <div style={styles.card}>
        {users.length === 0 ? (
          <p style={styles.muted}>{t("no_users_yet")}</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{t("user_fullname_label")}</th>
                <th style={styles.th}>{t("user_email_label")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.full_name || "—"}</td>
                  <td style={styles.tdCode}>{u.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
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
  backLink: {
    color: "#D9762E",
    fontSize: "14px",
    textDecoration: "none",
    fontWeight: 600,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "20px 0 20px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "28px 0 12px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#1F2937",
    margin: 0,
  },
  eyebrow: {
    fontSize: "13px",
    letterSpacing: "2px",
    color: "#D9762E",
    fontWeight: 600,
    marginBottom: "4px",
    fontFamily: "monospace",
  },
  heading: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#1F2937",
    margin: 0,
  },
  primaryButton: {
    padding: "11px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#D9762E",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "12px",
    border: "1px solid #E5E0D5",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },
  label: {
    fontSize: "13px",
    color: "#4B5563",
    marginBottom: "6px",
    fontWeight: 500,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #D8D3C7",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  errorBox: {
    background: "#FDECEA",
    color: "#B3261E",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
  },
  successBox: {
    background: "#E7F5EC",
    color: "#1E7A46",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
  },
  muted: {
    color: "#9CA3AF",
    fontSize: "14px",
  },
  projectRow: {
    padding: "16px 0",
    borderBottom: "1px solid #F0EDE4",
  },
  projectHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  projectName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#1F2937",
  },
  projectPercent: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#D9762E",
  },
  progressTrack: {
    width: "100%",
    height: "8px",
    background: "#F0EDE4",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  progressFill: {
    height: "100%",
    background: "#D9762E",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },
  slider: {
    width: "100%",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "start",
    fontSize: "13px",
    color: "#6B7280",
    fontWeight: 600,
    padding: "10px 8px",
    borderBottom: "1px solid #E5E0D5",
  },
  td: {
    padding: "12px 8px",
    fontSize: "14px",
    color: "#1F2937",
    borderBottom: "1px solid #F0EDE4",
  },
  tdCode: {
    padding: "12px 8px",
    fontSize: "12px",
    color: "#9CA3AF",
    borderBottom: "1px solid #F0EDE4",
    fontFamily: "monospace",
  },
};
