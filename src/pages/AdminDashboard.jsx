import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../lib/i18n.jsx";
import AdminLayout from "../components/AdminLayout.jsx";

const PAGE_SIZE = 10;

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    client_code: "",
    google_sheet_id: "",
    sheet_tab_name: "Sheet1",
  });

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("*, creator:created_by (full_name)")
      .order("created_at", { ascending: false });
    if (!error) setClients(data);
    setLoading(false);
  }

  async function handleCreateClient(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("clients").insert({
      name: form.name,
      client_code: form.client_code,
      google_sheet_id: form.google_sheet_id || null,
      sheet_tab_name: form.sheet_tab_name || "Sheet1",
      created_by: userData?.user?.id || null,
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

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.client_code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "linked" && c.google_sheet_id) ||
        (statusFilter === "not_linked" && !c.google_sheet_id);
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const kpis = {
    total: clients.length,
    linked: clients.filter((c) => c.google_sheet_id).length,
    notLinked: clients.filter((c) => !c.google_sheet_id).length,
    lastUpdated: clients[0] ? new Date(clients[0].created_at) : null,
  };

  return (
    <AdminLayout>
      <style>{css}</style>

      <header className="pz-header">
        <div>
          <h1 className="pz-title">{t("clients_heading")}</h1>
          <p className="pz-subtitle">Manage all parties and their Google Sheet integration</p>
        </div>
        <button className="pz-primary-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? t("cancel_button") : `+ ${t("new_client_button").replace("+ ", "")}`}
        </button>
      </header>

      <div className="pz-kpi-grid">
        <KpiCard icon="👥" label="Total Parties" value={kpis.total} sub="All registered parties" />
        <KpiCard icon="🔗" label="Linked" value={kpis.linked} sub="Connected to Google Sheets" accent="green" />
        <KpiCard icon="⛔" label="Not Linked" value={kpis.notLinked} sub="Not connected yet" accent="orange" />
        <KpiCard
          icon="📅"
          label="Last Updated"
          value={kpis.lastUpdated ? "Today" : "—"}
          sub={kpis.lastUpdated ? kpis.lastUpdated.toLocaleDateString() : ""}
        />
      </div>

      {showForm && (
        <form className="pz-card pz-form" onSubmit={handleCreateClient}>
          <div className="pz-form-grid">
            <div>
              <label className="pz-label">{t("client_name_label")}</label>
              <input
                className="pz-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="pz-label">{t("client_code_label")}</label>
              <input
                className="pz-input"
                value={form.client_code}
                onChange={(e) => setForm({ ...form, client_code: e.target.value })}
                placeholder="001"
                required
              />
            </div>
            <div>
              <label className="pz-label">{t("sheet_id_label")}</label>
              <input
                className="pz-input"
                value={form.google_sheet_id}
                onChange={(e) => setForm({ ...form, google_sheet_id: e.target.value })}
              />
            </div>
            <div>
              <label className="pz-label">{t("sheet_tab_label")}</label>
              <input
                className="pz-input"
                value={form.sheet_tab_name}
                onChange={(e) => setForm({ ...form, sheet_tab_name: e.target.value })}
                placeholder="Sheet1"
              />
            </div>
          </div>
          {error && <div className="pz-error">{error}</div>}
          <button className="pz-primary-btn" type="submit" disabled={saving}>
            {saving ? t("saving") : t("save_client_button")}
          </button>
        </form>
      )}

      <div className="pz-card">
        <div className="pz-toolbar">
          <div className="pz-search-wrap">
            <span className="pz-search-icon">🔍</span>
            <input
              className="pz-search-input"
              placeholder="Search parties..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="pz-filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="linked">Linked</option>
            <option value="not_linked">Not Linked</option>
          </select>
        </div>

        {loading ? (
          <p className="pz-muted">{t("loading")}</p>
        ) : pageItems.length === 0 ? (
          <p className="pz-muted">{t("no_clients_yet")}</p>
        ) : (
          <>
            <table className="pz-table">
              <thead>
                <tr>
                  <th>{t("table_name")}</th>
                  <th>{t("table_code")}</th>
                  <th>{t("table_sheet")}</th>
                  <th>{t("table_date")}</th>
                  <th>Added By</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/admin/clients/${c.id}`} className="pz-row-link">
                        {c.name}
                      </Link>
                    </td>
                    <td className="pz-code">{c.client_code}</td>
                    <td>
                      {c.google_sheet_id ? (
                        <span className="pz-badge pz-badge-green">{t("sheet_linked")}</span>
                      ) : (
                        <span className="pz-badge pz-badge-gray">{t("sheet_not_linked")}</span>
                      )}
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="pz-muted-cell">{c.creator?.full_name || "—"}</td>
                    <td className="pz-actions-cell">
                      <button
                        className="pz-menu-btn"
                        onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                      >
                        ⋮
                      </button>
                      {openMenuId === c.id && (
                        <div className="pz-menu">
                          <Link to={`/admin/clients/${c.id}`} className="pz-menu-item">
                            View Details
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pz-pagination">
              <span className="pz-muted">
                Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} results
              </span>
              <div className="pz-page-btns">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  ‹
                </button>
                <span className="pz-page-current">{page}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function KpiCard({ icon, label, value, sub, accent }) {
  return (
    <div className="pz-card pz-kpi">
      <div className={`pz-kpi-icon pz-kpi-icon-${accent || "default"}`}>{icon}</div>
      <div>
        <div className="pz-kpi-value">{value}</div>
        <div className="pz-kpi-label">{label}</div>
        <div className="pz-kpi-sub">{sub}</div>
      </div>
    </div>
  );
}

const css = `
  .pz-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
  .pz-title { font-size: 26px; font-weight: 800; color: var(--text-primary); margin: 0 0 4px; }
  .pz-subtitle { font-size: 13px; color: var(--text-muted); margin: 0; }
  .pz-primary-btn {
    padding: 11px 20px; border-radius: 10px; border: none;
    background: var(--accent); color: #fff; font-size: 14px; font-weight: 600; cursor: pointer;
  }

  .pz-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 18px; }
  .pz-kpi { display: flex; align-items: center; gap: 14px; padding: 18px; }
  .pz-kpi-icon {
    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
    background: var(--accent-soft);
  }
  .pz-kpi-icon-green { background: rgba(34,197,94,0.15); }
  .pz-kpi-icon-orange { background: rgba(245,158,11,0.15); }
  .pz-kpi-value { font-size: 22px; font-weight: 800; color: var(--text-primary); line-height: 1.2; }
  .pz-kpi-label { font-size: 12px; color: var(--text-secondary); font-weight: 600; }
  .pz-kpi-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  .pz-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .pz-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .pz-label { font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; font-weight: 600; display: block; }
  .pz-input {
    width: 100%; padding: 10px 12px; border-radius: 8px;
    border: 1px solid var(--input-border); background: var(--input-bg);
    color: var(--text-primary); font-size: 14px; outline: none; box-sizing: border-box;
  }
  .pz-error { background: #FDECEA; color: #B3261E; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }

  .pz-toolbar { display: flex; gap: 12px; margin-bottom: 16px; }
  .pz-search-wrap { flex: 1; position: relative; }
  .pz-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 13px; opacity: 0.5; }
  .pz-search-input {
    width: 100%; padding: 9px 12px 9px 34px; border-radius: 8px;
    border: 1px solid var(--input-border); background: var(--input-bg); color: var(--text-primary);
    font-size: 13px; outline: none; box-sizing: border-box;
  }
  .pz-filter-select {
    padding: 9px 14px; border-radius: 8px; border: 1px solid var(--input-border);
    background: var(--input-bg); color: var(--text-primary); font-size: 13px;
  }

  .pz-muted { color: var(--text-muted); font-size: 14px; }
  .pz-table { width: 100%; border-collapse: collapse; }
  .pz-table th {
    text-align: start; font-size: 12px; color: var(--text-secondary); font-weight: 600;
    padding: 10px 8px; border-bottom: 1px solid var(--card-border);
  }
  .pz-table td { padding: 12px 8px; font-size: 13.5px; color: var(--text-primary); border-bottom: 1px solid var(--row-border); }
  .pz-code { font-family: monospace; font-size: 12px; color: var(--text-secondary); }
  .pz-muted-cell { color: var(--text-muted); font-size: 13px; }
  .pz-row-link { color: var(--text-primary); text-decoration: none; font-weight: 600; }
  .pz-badge { font-size: 11px; padding: 3px 10px; border-radius: 999px; }
  .pz-badge-green { background: rgba(34,197,94,0.15); color: #16A34A; }
  .pz-badge-gray { background: rgba(148,163,184,0.15); color: var(--text-muted); }

  .pz-actions-cell { position: relative; text-align: end; }
  .pz-menu-btn { background: none; border: none; cursor: pointer; font-size: 16px; color: var(--text-secondary); padding: 4px 8px; }
  .pz-menu {
    position: absolute; right: 0; top: 100%; z-index: 10;
    background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 8px;
    padding: 4px; min-width: 140px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }
  .pz-menu-item { display: block; padding: 8px 10px; font-size: 13px; color: var(--text-primary); text-decoration: none; border-radius: 6px; }
  .pz-menu-item:hover { background: var(--hover-bg); }

  .pz-pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
  .pz-page-btns { display: flex; align-items: center; gap: 8px; }
  .pz-page-btns button {
    width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--input-border);
    background: var(--input-bg); color: var(--text-primary); cursor: pointer;
  }
  .pz-page-btns button:disabled { opacity: 0.4; cursor: not-allowed; }
  .pz-page-current {
    width: 28px; height: 28px; border-radius: 6px; background: var(--accent); color: #fff;
    display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600;
  }

  @media (max-width: 900px) {
    .pz-kpi-grid { grid-template-columns: 1fr 1fr; }
    .pz-form-grid { grid-template-columns: 1fr; }
  }
`;
