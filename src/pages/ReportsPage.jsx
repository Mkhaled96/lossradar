import AdminLayout from "../components/AdminLayout.jsx";

export default function ReportsPage() {
  return (
    <AdminLayout>
      <div style={{ maxWidth: 560 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1F2937", margin: "0 0 16px" }}>Reports</h1>
        <div style={{ background: "#fff", border: "1px solid #E5E0D5", borderRadius: 14, padding: 24 }}>
          <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            تقارير الخسائر والأداء لكل Party — لسه هنبنيها. المقترح: تقرير شهري لكل Party، مقارنة Party مع Party، تقرير أداء سائقين، تقرير حالة المزامنة، تقرير Complaints.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
