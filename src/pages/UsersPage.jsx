import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AdminLayout from "../components/AdminLayout.jsx";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, role, client_id, clients:client_id (name, client_code)")
      .order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  return (
    <AdminLayout>
      <style>{css}</style>
      <h1 className="up-title">Users</h1>
      <div className="up-card">
        {loading ? (
          <p className="up-muted">جارٍ التحميل...</p>
        ) : users.length === 0 ? (
          <p className="up-muted">لسه مفيش أي Users متعملين.</p>
        ) : (
          <table className="up-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الدور</th>
                <th>الـ Party</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name || "—"}</td>
                  <td>
                    <span className={`up-badge up-badge-${u.role}`}>{u.role}</span>
                  </td>
                  <td>{u.clients ? `${u.clients.name} (${u.clients.client_code})` : "—"}</td>
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
  .up-title { font-size: 24px; font-weight: 700; color: #1F2937; margin: 0 0 20px; }
  .up-card { background: #fff; border: 1px solid #E5E0D5; border-radius: 14px; padding: 20px; }
  .up-muted { color: #9CA3AF; font-size: 14px; }
  .up-table { width: 100%; border-collapse: collapse; }
  .up-table th { text-align: start; font-size: 12px; color: #6B7280; padding: 8px; border-bottom: 1px solid #E5E0D5; }
  .up-table td { padding: 10px 8px; font-size: 14px; color: #1F2937; border-bottom: 1px solid #F0EDE4; }
  .up-badge { font-size: 11px; padding: 3px 10px; border-radius: 999px; text-transform: capitalize; }
  .up-badge-owner { background: #FDE7DC; color: #B45309; }
  .up-badge-admin { background: #DBEAFE; color: #1D4ED8; }
  .up-badge-client { background: #E7F5EC; color: #1E7A46; }
`;
