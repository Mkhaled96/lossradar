import AdminLayout from "../components/AdminLayout.jsx";

export default function FinancePage() {
  return (
    <AdminLayout>
      <div style={{ maxWidth: 560 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1F2937", margin: "0 0 16px" }}>Finance</h1>
        <div style={{ background: "#fff", border: "1px solid #E5E0D5", borderRadius: 14, padding: 24 }}>
          <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            حسابات ومدفوعات العملاء — لسه محتاجين نحدد الهيكل بالظبط (اشتراك شهري؟ حسب عدد المركبات؟) قبل ما نبنيها.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
