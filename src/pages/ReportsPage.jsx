import AdminLayout from "../components/AdminLayout.jsx";

export default function ReportsPage() {
  return (
    <AdminLayout>
      <style>{`
        .ph-title { font-size: 26px; font-weight: 800; color: var(--text-primary); margin: 0 0 16px; }
        .ph-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px; padding: 24px; max-width: 560px; }
        .ph-text { color: var(--text-secondary); font-size: 14px; line-height: 1.7; margin: 0; }
      `}</style>
      <h1 className="ph-title">Reports</h1>
      <div className="ph-card">
        <p className="ph-text">تقارير الخسائر والأداء لكل Party — لسه هنبنيها. المقترح: تقرير شهري لكل Party، مقارنة Party مع Party، تقرير أداء سائقين، تقرير حالة المزامنة، تقرير Complaints.</p>
      </div>
    </AdminLayout>
  );
}
