import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ClientDetail from "./pages/ClientDetail.jsx";
import ClientPortal from "./pages/ClientPortal.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clients/:clientId" element={<ClientDetail />} />
        <Route path="/client" element={<ClientPortal />} />
      </Routes>
    </BrowserRouter>
  );
}
