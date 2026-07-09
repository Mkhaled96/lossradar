import AdminLayout from "../components/AdminLayout.jsx";

export default function HistoryPage() {
  return (
    <AdminLayout>
      <style>{`
        .ph-title { font-size: 26px; font-weight: 800; color: var(--text-primary); margin: 0 0 16px; }
        .ph-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px; padding: 24px; max-width: 560px; }
        .ph-text { color: var(--text-secondary); font-size: 14px; line-height: 1.7; margin: 0; }
      `}</style>
      <h1 className="ph-title">History</h1>
      <div className="ph-card">
        <p className="ph-text">سجل كل حركة حصلت في النظام (مين عمل إيه وإمتى) — محتاج جدول جديد في القاعدة (activity_log) هنضيفه في الخطوة الجاية.</p>
      </div>
    </AdminLayout>
  );
}
