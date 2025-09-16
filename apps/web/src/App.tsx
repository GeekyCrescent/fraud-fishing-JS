import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/modules/DashboardHome";
import ReportValidation from "./pages/modules/ReportValidation";
import CrudReportes from "./pages/modules/CrudReportes";
import CrudCategorias from "./pages/modules/CrudCategorias";
import CrudUsuarios from "./pages/modules/CrudUsuarios";
import CrudAdmins from "./pages/modules/CrudAdmins";

export default function App() {
  const [user, setUser] = useState<{ correo: string } | null>(null);

  return (
    <Routes>
      <Route path="/" element={<Login setUser={setUser} />} />
      
      {/* Dashboard con rutas hijas */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="reportes" element={<ReportValidation />} />
        <Route path="crud-reportes" element={<CrudReportes />} />
        <Route path="crud-categorias" element={<CrudCategorias />} />
        <Route path="crud-usuarios" element={<CrudUsuarios />} />
        <Route path="crud-admins" element={<CrudAdmins />} />
      </Route>
    </Routes>
  );
}
