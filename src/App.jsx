import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardOverview from "./pages/DashboardOverview.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ClientDetail from "./pages/ClientDetail.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import ComplaintsPage from "./pages/ComplaintsPage.jsx";
import FinancePage from "./pages/FinancePage.jsx";
import ClientPortal from "./pages/ClientPortal.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<DashboardOverview />} />
        <Route path="/admin/parties" element={<AdminDashboard />} />
        <Route path="/admin/clients/:clientId" element={<ClientDetail />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/history" element={<HistoryPage />} />
        <Route path="/admin/complaints" element={<ComplaintsPage />} />
        <Route path="/admin/finance" element={<FinancePage />} />

        <Route path="/client" element={<ClientPortal />} />
      </Routes>
    </BrowserRouter>
  );
}
