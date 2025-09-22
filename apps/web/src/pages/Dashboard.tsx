import { Routes, Route, Link } from "react-router-dom";
import DashboardHome from "./modules/DashboardHome";
import ReportValidation from "./modules/ReportValidation";
import CrudReportes from "./modules/CrudReportes";
import CrudCategorias from "./modules/CrudCategorias";
import CrudUsuarios from "./modules/CrudUsuarios";
import CrudAdmins from "./modules/CrudAdmins";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#00204D] text-white flex flex-col">
        <div className="p-6 text-center font-bold text-xl border-b border-[#00B5BC]">
          FraudFishing
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="" className="block p-2 rounded hover:bg-[#00B5BC]">
            Dashboard
          </Link>
          <Link to="reportes" className="block p-2 rounded hover:bg-[#00B5BC]">
            Validar/Denegar Reportes
          </Link>
          <Link to="crud-reportes" className="block p-2 rounded hover:bg-[#00B5BC]">
            CRUD Reportes
          </Link>
          <Link to="crud-categorias" className="block p-2 rounded hover:bg-[#00B5BC]">
            CRUD Categorías
          </Link>
          <Link to="crud-usuarios" className="block p-2 rounded hover:bg-[#00B5BC]">
            CRUD Usuarios
          </Link>
          <Link to="crud-admins" className="block p-2 rounded hover:bg-[#00B5BC]">
            CRUD Admins
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#00204D]">Dashboard</h1>
          <div className="text-sm text-gray-600">admin@demo.com</div>
        </header>

        <section className="bg-white p-6 rounded-lg shadow">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="reportes" element={<ReportValidation />} />
            <Route path="crud-reportes" element={<CrudReportes />} />
            <Route path="crud-categorias" element={<CrudCategorias />} />
            <Route path="crud-usuarios" element={<CrudUsuarios />} />
            <Route path="crud-admins" element={<CrudAdmins />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}
