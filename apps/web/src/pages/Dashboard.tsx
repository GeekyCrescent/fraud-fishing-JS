import { NavLink, Outlet } from "react-router-dom";
<<<<<<< Updated upstream
import {
  HomeIcon,
  Cog6ToothIcon,
  ChartPieIcon,
  UserIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"; // 👈 usa outline para el estilo fino
=======
>>>>>>> Stashed changes

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
<<<<<<< Updated upstream
      <aside className="w-64 h-screen flex flex-col bg-white border-r-1 border-teal-300">
        {/* Logo */}
        <div className="p-6 text-2xl font-bold text-teal-500">
          Fraud<span className="text-black">Fishing</span>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 space-y-2">
=======
      <aside className="w-64 bg-white text-gray-700 flex flex-col border-r border-gray-200">
        <div className="p-6 text-2xl font-bold border-b border-gray-200 text-[#00204D]">
          FraudFishing
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
>>>>>>> Stashed changes
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
<<<<<<< Updated upstream
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
=======
              `flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? "bg-[#00B5BC] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
             Dashboard
          </NavLink>
          <NavLink
            to="reportes"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? "bg-[#00B5BC] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
             Reportes
          </NavLink>
          <NavLink
            to="usuarios"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? "bg-[#00B5BC] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
             Usuarios
          </NavLink>
          <NavLink
            to="categorias"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? "bg-[#00B5BC] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
             Categorías
          </NavLink>
          <NavLink
            to="admins"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? "bg-[#00B5BC] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
             Admins
          </NavLink>
          <NavLink
            to="validar"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? "bg-[#00B5BC] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
             Validar Reportes
          </NavLink>
        </nav>

        <button className="p-4 text-sm flex items-center gap-2 text-gray-600 hover:bg-gray-100 border-t border-gray-200">
          Cerrar Sesión
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-4 shadow">
          <h1 className="text-lg font-bold text-[#00204D]">Panel de Control</h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-600">Admin User</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header>

        {/* Aquí se cargan las páginas */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
>>>>>>> Stashed changes
    </div>
  );
}
