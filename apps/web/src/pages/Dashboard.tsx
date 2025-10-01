import { NavLink, Outlet } from "react-router-dom";
import {
  HomeIcon,
  Cog6ToothIcon,
  ChartPieIcon,
  UserIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"; // 👈 usa outline para el estilo fino

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 h-screen flex flex-col bg-white border-r-1 border-teal-500">
        {/* Logo */}
        <div className="p-6 text-2xl font-bold text-teal-700">
          Fraud<span className="text-black">Fishing</span>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 space-y-2">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-teal-100 text-teal-700 font-semibold"
                  : "text-gray-700 hover:bg-teal-50"
              }`
            }
          >
            <HomeIcon className="w-5 h-5 text-teal-600" />
            Dashboard
          </NavLink>

          <NavLink
            to="reportes"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-teal-100 text-teal-700 font-semibold"
                  : "text-gray-700 hover:bg-teal-50"
              }`
            }
          >
            <Cog6ToothIcon className="w-5 h-5 text-teal-600" />
            Reportes
          </NavLink>

          <NavLink
            to="usuarios"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-teal-100 text-teal-700 font-semibold"
                  : "text-gray-700 hover:bg-teal-50"
              }`
            }
          >
            <UserIcon className="w-5 h-5 text-teal-600" />
            Usuarios
          </NavLink>

          <NavLink
            to="categorias"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-teal-100 text-teal-700 font-semibold"
                  : "text-gray-700 hover:bg-teal-50"
              }`
            }
          >
            <ChartPieIcon className="w-5 h-5 text-teal-600" />
            Categorías
          </NavLink>

          <NavLink
            to="admins"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-teal-100 text-teal-700 font-semibold"
                  : "text-gray-700 hover:bg-teal-50"
              }`
            }
          >
            <PlusCircleIcon className="w-5 h-5 text-teal-600" />
            Admins
          </NavLink>

          <NavLink
            to="validar"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-teal-100 text-teal-700 font-semibold"
                  : "text-gray-700 hover:bg-teal-50"
              }`
            }
          >
            <DocumentTextIcon className="w-5 h-5 text-teal-600" />
            Validar Reportes
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <NavLink
            to="help"
            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-teal-50 rounded-lg"
          >
            <QuestionMarkCircleIcon className="w-5 h-5 text-teal-600" />
            Cerrar Sesión
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* Aquí se renderizan los módulos */}
      </main>
    </div>
  );
}
