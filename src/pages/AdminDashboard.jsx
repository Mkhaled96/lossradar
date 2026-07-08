import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../lib/i18n.jsx";
import AdminLayout from "../components/AdminLayout.jsx";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    client_code: "",
    google_sheet_id: "",
    sheet_tab_name: "Sheet1",
  });

  async function loadClients() {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setClients(data);
    setLoading(false);
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleCreateClient(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { error: insertError } = await supabase.from("clients").insert({
      name: form.name,
      client_code: form.client_code,
      google_sheet_id: form.google_sheet_id || null,
      sheet_tab_name: form.sheet_tab_name || "Sheet1",
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message.includes("duplicate") ? t("duplicate_code_error") : t("generic_error"));
      return;
    }

    setForm({ name: "", client_code: "", google_sheet_id: "", sheet_tab_name: "Sheet1" });
    setShowForm(false);
    loadClients();
  }

  return (
    <AdminLayout>
      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>{t("owner_eyebrow")}</div>
          <h1 style={styles.heading}>{t("clients_heading")}</h1>
        </div>
        <button style={styles.primaryButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? t("cancel_button") : t("new_client_button")}
        </button>
      </header>

      {showForm && (
        <form style={styles.card} onSubmit={handleCreateClient}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>{t("client_name_label")}</label>
              <input
                style={styles.input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>{t("client_code_label")}</label>
              <input
                style={styles.input}
                value={form.client_code}
                onChange={(e) => setForm({ ...form, client_code: e.target.value })}
                placeholder="CL-001"
                required
              />
            </div>
            <div>
              <label style={styles.label}>{t("sheet_id_label")}</label>
              <input
                style={styles.input}
                value={form.google_sheet_id}
                onChange={(e) => setForm({ ...form, google_sheet_id: e.target.value })}
              />
            </div>
            <div>
              <label style={styles.label}>{t("sheet_tab_label")}</label>
              <input
                style={styles.input}
                value={form.sheet_tab_name}
                onChange={(e) => setForm({ ...form, sheet_tab_name: e.target.value })}
                placeholder="Sheet1"
              />
            </div>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button style={styles.primaryButton} type="submit" disabled={saving}>
            {saving ? t("saving") : t("save_client_button")}
          </button>
        </form>
      )}

      <div style={styles.card}>
        {loading ? (
          <p style={styles.muted}>{t("loading")}</p>
        ) : clients.length === 0 ? (
          <p style={styles.muted}>{t("no_clients_yet")}</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{t("table_name")}</th>
                <th style={styles.th}>{t("table_code")}</th>
                <th style={styles.th}>{t("table_sheet")}</th>
                <th style={styles.th}>{t("table_date")}</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td style={styles.td}>
                    <Link to={`/admin/clients/${c.id}`} style={styles.rowLink}>
                      {c.name}
                    </Link>
                  </td>
                  <td style={styles.tdCode}>{c.client_code}</td>
                  <td style={styles.td}>
                    {c.google_sheet_id ? (
                      <span style={styles.badgeGreen}>{t("sheet_linked")}</span>
                    ) : (
                      <span style={styles.badgeGray}>{t("sheet_not_linked")}</span>
                    )}
                  </td>
                  <td style={styles.td}>{new Date(c.created_at).toLocaleDateString()}</td>
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  eyebrow: {
    fontSize: "13px",
    letterSpacing: "2px",
    color: "#D9762E",
    fontWeight: 600,
    marginBottom: "4px",
  },
  heading: {
    fontSize: "28px",
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
    fontSize: "13px",
    color: "#6B7280",
    borderBottom: "1px solid #F0EDE4",
    fontFamily: "monospace",
  },
  badgeGreen: {
    background: "#E7F5EC",
    color: "#1E7A46",
    fontSize: "12px",
    padding: "3px 10px",
    borderRadius: "999px",
  },
  badgeGray: {
    background: "#F1F0EC",
    color: "#8A8578",
    fontSize: "12px",
    padding: "3px 10px",
    borderRadius: "999px",
  },
  rowLink: {
    color: "#1F2937",
    textDecoration: "none",
    fontWeight: 600,
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
  dashboardLink: {
    padding: "11px 20px",
    borderRadius: "8px",
    border: "1px solid #D8D3C7",
    background: "#FFFFFF",
    color: "#1F2937",
    fontSize: "15px",
    fontWeight: 600,
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  },
};
