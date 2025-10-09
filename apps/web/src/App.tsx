import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Módulos
import DashboardHome from "./pages/modules/DashboardHome";
import CrudUsuarios from "./pages/modules/CrudUsuarios";
import CrudReportes from "./pages/modules/CrudReportes";
import CrudCategorias from "./pages/modules/CrudCategorias";
import CrudAdmins from "./pages/modules/CrudAdmins";
import ReportValidation from "./pages/modules/ReportValidation";

import { useState } from "react";

function App() {
  const [, setUser] = useState<{ correo: string } | null>(null);

  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login setUser={setUser} />} />

      {/* Dashboard con sidebar */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="usuarios" element={<CrudUsuarios />} />
        <Route path="reportes" element={<CrudReportes />} />
        <Route path="categorias" element={<CrudCategorias />} />
        <Route path="admins" element={<CrudAdmins />} />
        <Route path="validar" element={<ReportValidation />} />
      </Route>
    </Routes>
  );
}

export default App;
