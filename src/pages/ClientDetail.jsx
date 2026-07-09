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
    return (
      <AdminLayout>
        <p className="cd-muted">{t("loading")}</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <style>{css}</style>
      <Link to="/admin/parties" className="cd-back">
        {t("back_to_clients")}
      </Link>

      <header className="cd-header">
        <div className="cd-code">{client?.client_code}</div>
        <h1 className="cd-title">{client?.name}</h1>
      </header>

      {/* ===== Projects ===== */}
      <div className="cd-section-header">
        <h2 className="cd-section-title">{t("new_project_button").replace("+ ", "")}</h2>
        <button className="cd-btn" onClick={() => setShowProjectForm(!showProjectForm)}>
          {showProjectForm ? t("cancel_button") : t("new_project_button")}
        </button>
      </div>

      {showProjectForm && (
        <form className="cd-card" onSubmit={handleCreateProject}>
          <div className="cd-form-grid">
            <div>
              <label className="cd-label">{t("project_name_label")}</label>
              <input
                className="cd-input"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="cd-label">{t("project_progress_label")}</label>
              <input
                className="cd-input"
                type="number"
                min="0"
                max="100"
                value={projectForm.progress}
                onChange={(e) => setProjectForm({ ...projectForm, progress: e.target.value })}
              />
            </div>
          </div>
          {projectError && <div className="cd-error">{projectError}</div>}
          <button className="cd-btn" type="submit" disabled={savingProject}>
            {savingProject ? t("saving") : t("save_project_button")}
          </button>
        </form>
      )}

      <div className="cd-card">
        {projects.length === 0 ? (
          <p className="cd-muted">{t("no_projects_yet")}</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="cd-project-row">
              <div className="cd-project-head">
                <span className="cd-project-name">{p.name}</span>
                <span className="cd-project-pct">{p.progress}%</span>
              </div>
              <div className="cd-track">
                <div className="cd-fill" style={{ width: `${p.progress}%` }} />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={p.progress}
                onChange={(e) => updateProgress(p.id, Number(e.target.value))}
                className="cd-slider"
              />
            </div>
          ))
        )}
      </div>

      {/* ===== Users ===== */}
      <div className="cd-section-header">
        <h2 className="cd-section-title">{t("users_heading")}</h2>
        <button className="cd-btn" onClick={() => setShowUserForm(!showUserForm)}>
          {showUserForm ? t("cancel_button") : t("new_user_button")}
        </button>
      </div>

      {showUserForm && (
        <form className="cd-card" onSubmit={handleCreateUser}>
          <div className="cd-form-grid">
            <div>
              <label className="cd-label">{t("user_email_label")}</label>
              <input
                className="cd-input"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="cd-label">{t("user_password_label")}</label>
              <input
                className="cd-input"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="cd-label">{t("user_fullname_label")}</label>
              <input
                className="cd-input"
                value={userForm.full_name}
                onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
              />
            </div>
          </div>
          {userError && <div className="cd-error">{userError}</div>}
          <button className="cd-btn" type="submit" disabled={savingUser}>
            {savingUser ? t("saving") : t("save_user_button")}
          </button>
        </form>
      )}

      {userSuccess && <div className="cd-success">{userSuccess}</div>}

      <div className="cd-card">
        {users.length === 0 ? (
          <p className="cd-muted">{t("no_users_yet")}</p>
        ) : (
          <table className="cd-table">
            <thead>
              <tr>
                <th>{t("user_fullname_label")}</th>
                <th>{t("user_email_label")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name || "—"}</td>
                  <td className="cd-code-cell">{u.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

const css = `
  .cd-back { color: var(--accent); font-size: 13px; text-decoration: none; font-weight: 600; }
  .cd-header { margin: 16px 0 24px; }
  .cd-code { font-size: 12px; letter-spacing: 2px; color: var(--accent); font-weight: 600; font-family: monospace; margin-bottom: 4px; }
  .cd-title { font-size: 24px; font-weight: 800; color: var(--text-primary); margin: 0; }

  .cd-section-header { display: flex; justify-content: space-between; align-items: center; margin: 24px 0 12px; }
  .cd-section-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0; }
  .cd-btn {
    padding: 10px 18px; border-radius: 8px; border: none;
    background: var(--accent); color: #fff; font-size: 14px; font-weight: 600; cursor: pointer;
  }

  .cd-card {
    background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px;
    padding: 20px; margin-bottom: 12px;
  }
  .cd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .cd-label { font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; font-weight: 600; display: block; }
  .cd-input {
    width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--input-border);
    background: var(--input-bg); color: var(--text-primary); font-size: 14px; outline: none; box-sizing: border-box;
  }
  .cd-error { background: #FDECEA; color: #B3261E; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }
  .cd-success { background: rgba(34,197,94,0.12); color: #16A34A; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }
  .cd-muted { color: var(--text-muted); font-size: 14px; }

  .cd-project-row { padding: 14px 0; border-bottom: 1px solid var(--row-border); }
  .cd-project-head { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .cd-project-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
  .cd-project-pct { font-size: 13px; font-weight: 700; color: var(--accent); }
  .cd-track { width: 100%; height: 8px; background: var(--row-border); border-radius: 999px; overflow: hidden; margin-bottom: 8px; }
  .cd-fill { height: 100%; background: var(--accent); border-radius: 999px; }
  .cd-slider { width: 100%; }

  .cd-table { width: 100%; border-collapse: collapse; }
  .cd-table th { text-align: start; font-size: 12px; color: var(--text-secondary); padding: 8px; border-bottom: 1px solid var(--card-border); }
  .cd-table td { padding: 10px 8px; font-size: 14px; color: var(--text-primary); border-bottom: 1px solid var(--row-border); }
  .cd-code-cell { font-size: 11px; color: var(--text-muted); font-family: monospace; }
`;
