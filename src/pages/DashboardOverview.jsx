import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AdminLayout from "../components/AdminLayout.jsx";

export default function DashboardOverview() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    const { data } = await supabase
      .from("clients")
      .select("id, created_at")
      .order("created_at", { ascending: true });
    setClients(data || []);
    setLoading(false);
  }

  const monthly = buildMonthlyGrowth(clients);

  return (
    <AdminLayout>
      <style>{css}</style>
      <h1 className="do-title">Dashboard</h1>

      <div className="do-kpi-grid">
        <KpiCard icon="👥" label="عدد العملاء (Parties)" value={clients.length} />
        <KpiCard icon="🔔" label="عدد التنبيهات" value={0} note="لسه مش متوصلة" />
        <KpiCard icon="📥" label="عدد الطلبات" value={0} note="لسه مش متوصلة" />
      </div>

      <div className="do-card">
        <div className="do-card-title">نمو عدد العملاء شهر عن شهر</div>
        {loading ? (
          <p className="do-muted">جارٍ التحميل...</p>
        ) : monthly.length === 0 ? (
          <p className="do-muted">لسه مفيش بيانات كفاية نرسم بيها الرسم البياني.</p>
        ) : (
          <LineChart data={monthly} />
        )}
      </div>
    </AdminLayout>
  );
}

function KpiCard({ icon, label, value, note }) {
  return (
    <div className="do-card do-kpi">
      <div className="do-kpi-icon">{icon}</div>
      <div>
        <div className="do-kpi-value">{value}</div>
        <div className="do-kpi-label">{label}</div>
        {note && <div className="do-kpi-note">{note}</div>}
      </div>
    </div>
  );
}

function buildMonthlyGrowth(clients) {
  if (clients.length === 0) return [];
  const counts = {};
  clients.forEach((c) => {
    const d = new Date(c.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  const sortedKeys = Object.keys(counts).sort();
  let running = 0;
  return sortedKeys.map((k) => {
    running += counts[k];
    return { month: k, total: running };
  });
}

function LineChart({ data }) {
  const w = 600;
  const h = 160;
  const max = Math.max(...data.map((d) => d.total), 1);
  const stepX = data.length > 1 ? w / (data.length - 1) : 0;
  const points = data
    .map((d, i) => {
      const x = data.length > 1 ? i * stepX : w / 2;
      const y = h - (d.total / max) * (h - 20) - 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="do-linechart" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
      {data.map((d, i) => {
        const x = data.length > 1 ? i * stepX : w / 2;
        const y = h - (d.total / max) * (h - 20) - 10;
        return (
          <g key={d.month}>
            <circle cx={x} cy={y} r="3.5" fill="var(--accent)" />
            <text x={x} y={h - 2} fontSize="9" fill="var(--text-muted)" textAnchor="middle">
              {d.month.slice(5)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const css = `
  .do-title { font-size: 26px; font-weight: 800; color: var(--text-primary); margin: 0 0 20px; }
  .do-kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 16px; }
  .do-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 20px;
  }
  .do-kpi { display: flex; align-items: center; gap: 14px; }
  .do-kpi-icon {
    width: 40px; height: 40px; border-radius: 50%; background: var(--accent-soft);
    display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
  }
  .do-kpi-label { font-size: 12px; color: var(--text-secondary); }
  .do-kpi-value { font-size: 24px; font-weight: 800; color: var(--text-primary); }
  .do-kpi-note { font-size: 11px; color: #B45309; margin-top: 2px; }
  .do-card-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }
  .do-muted { color: var(--text-muted); font-size: 13px; }
  .do-linechart { width: 100%; height: 160px; }

  @media (max-width: 700px) {
    .do-kpi-grid { grid-template-columns: 1fr; }
  }
`;
