import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ClientDetail() {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", progress: 0 });

  async function loadData() {
    setLoading(true);
    const [{ data: clientData }, { data: projectsData }] = await Promise.all([
      supabase.from("clients").select("*").eq("id", clientId).single(),
      supabase
        .from("projects")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false }),
    ]);
    setClient(clientData);
    setProjects(projectsData || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  async function handleCreateProject(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { error: insertError } = await supabase.from("projects").insert({
      client_id: clientId,
      name: form.name,
      progress: Number(form.progress),
    });

    setSaving(false);

    if (insertError) {
      setError("حصل خطأ، حاول تاني");
      return;
    }

    setForm({ name: "", progress: 0 });
    setShowForm(false);
    loadData();
  }

  async function updateProgress(projectId, newProgress) {
    await supabase.from("projects").update({ progress: newProgress }).eq("id", projectId);
    loadData();
  }

  if (loading) {
    return <div style={styles.page}>جارٍ التحميل...</div>;
  }

  return (
    <div style={styles.page}>
      <Link to="/admin" style={styles.backLink}>← رجوع للعملاء</Link>

      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>{client?.client_code}</div>
          <h1 style={styles.heading}>{client?.name}</h1>
        </div>
        <button style={styles.primaryButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? "إلغاء" : "+ مشروع جديد"}
        </button>
      </header>

      {showForm && (
        <form style={styles.card} onSubmit={handleCreateProject}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>اسم المشروع</label>
              <input
                style={styles.input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: تحليل خسائر الربع الأول"
                required
              />
            </div>
            <div>
              <label style={styles.label}>نسبة الإنجاز المبدئية (%)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                max="100"
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: e.target.value })}
              />
            </div>
          </div>
          {error && <div style={styles.errorBox}>{error}</div>}
          <button style={styles.primaryButton} type="submit" disabled={saving}>
            {saving ? "جارٍ الحفظ..." : "حفظ المشروع"}
          </button>
        </form>
      )}

      <div style={styles.card}>
        {projects.length === 0 ? (
          <p style={styles.muted}>لسه معملتش أي مشروع للعميل ده.</p>
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
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F4F1EA",
    padding: "40px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    direction: "rtl",
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
    margin: "20px 0 28px",
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
    marginBottom: "20px",
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
};
