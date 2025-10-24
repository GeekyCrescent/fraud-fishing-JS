import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../../network/axiosInstance";

import {
  FiUsers,
  FiClipboard,
  FiTag,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function DashboardHome() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Manejar cada llamada individualmente para mejor control de errores
        let usersRes, catsRes, reportsRes;
        
        try {
          usersRes = await axiosInstance.get("/admin/user/stats", {
            headers: { 'Accept': 'application/json, text/plain, */*' }
          });
        } catch (e) {
          console.error("Error en /admin/user/stats:", e);
          usersRes = { data: { users: [] } };
        }
        
        try {
          catsRes = await axiosInstance.get("/categories");
        } catch (e) {
          console.error("Error en /categories:", e);
          catsRes = { data: [] };
        }
        
        try {
          reportsRes = await axiosInstance.get("/reports");
        } catch (e) {
          console.error("Error en /reports:", e);
          reportsRes = { data: [] };
        }

        const users = usersRes?.data?.users ?? [];
        const admins = users.filter((u: any) => u.is_admin).length;
        const usuarios = users.length - admins;
        const categorias = catsRes?.data?.length ?? 0;
        const reportes = reportsRes?.data?.length ?? 0;
        const recientes = reportsRes?.data?.slice(0, 5) ?? [];
        const ultimosUsuarios = users.slice(-5).reverse();
        const topCategorias = catsRes?.data?.slice(0, 5) ?? [];

        // ===== Calcular datos mensuales reales =====
        const meses = [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const conteoUsuarios: Record<string, number> = {};
        const conteoReportes: Record<string, number> = {};
        meses.forEach((m) => {
          conteoUsuarios[m] = 0;
          conteoReportes[m] = 0;
        });

        // Contar usuarios creados por mes
        users.forEach((u: any) => {
          if (u.created_at) {
            const fecha = new Date(u.created_at);
            const mes = meses[fecha.getMonth()];
            conteoUsuarios[mes]++;
          }
        });
        
        // Contar reportes creados por mes (detecta automáticamente el campo de fecha)
        reportsRes?.data?.forEach((r: any) => {
          const fechaCampo =
            r.created_at ||
            r.createdAt ||
            r.fecha_creacion ||
            r.date ||
            r.created ||
            null;

          if (fechaCampo) {
            const fecha = new Date(fechaCampo);
            if (!isNaN(fecha.getTime())) {
              const mes = meses[fecha.getMonth()];
              conteoReportes[mes]++;
            }
          }
        });


        // Generar dataset para gráficos
        const barData = meses.map((mes) => ({
          name: mes,
          usuarios: conteoUsuarios[mes],
          reportes: conteoReportes[mes],
        }));

        setData({
          usuarios,
          admins,
          categorias,
          reportes,
          recientes,
          ultimosUsuarios,
          topCategorias,
          barData,
        });
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
        setError("No se pudieron cargar los datos del dashboard.");
      }
    };
    fetchAll();
  }, []);

  const COLORS = ["#14B8A6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const pieData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Usuarios", value: data.usuarios },
      { name: "Admins", value: data.admins },
      { name: "Categorías", value: data.categorias },
      { name: "Reportes", value: data.reportes },
    ];
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#00204D]">
            Dashboard general
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Resumen ejecutivo de la plataforma Fraud Fishing
          </p>
        </header>

        {error && (
          <div className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {!data ? (
          <div className="text-center text-gray-500 py-10">Cargando...</div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard icon={<FiUsers />} title="Usuarios" value={data.usuarios} />
              <KpiCard icon={<FiShield />} title="Admins" value={data.admins} />
              <KpiCard icon={<FiTag />} title="Categorías" value={data.categorias} />
              <KpiCard icon={<FiClipboard />} title="Reportes" value={data.reportes} />
            </div>

            {/* Gráficos */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Pie */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Distribución general</h2>
                <ResponsiveContainer width="100%" height={250} className="text-xs sm:text-sm">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: any) =>
                        `${entry.name}: ${(Number(entry.percent ?? 0) * 100).toFixed(0)}%`
                      }
                      dataKey="value"
                    >
                      {pieData.map((_entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Barras con datos reales */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                  Actividad mensual
                </h2>
                <ResponsiveContainer width="100%" height={250} className="text-xs sm:text-sm">
                  <BarChart data={data.barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reportes" fill="#14B8A6" />
                    <Bar dataKey="usuarios" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Línea de crecimiento real */}
            <section className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                Crecimiento y tendencia
              </h2>
              <ResponsiveContainer width="100%" height={250} className="text-xs sm:text-sm">
                <LineChart data={data.barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usuarios" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="reportes" stroke="#14B8A6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </section>

            {/* Actividad reciente */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <RecentBox title="Últimos reportes" headers={["URL", "Estado"]}
                data={data.recientes.map((r: any) => [r.url, r.status ?? "Pendiente"])} />
              <RecentBox title="Usuarios recientes" headers={["Nombre", "Email"]}
                data={data.ultimosUsuarios.map((u: any) => [u.name, u.email])} />
              <RecentBox title="Top categorías" headers={["Nombre", "Descripción"]}
                data={data.topCategorias.map((c: any) => [c.name, c.description])} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-5 flex items-center justify-between hover:shadow-md transition-transform hover:scale-105">
      <div>
        <div className="text-xs sm:text-sm text-gray-500">{title}</div>
        <div className="text-xl sm:text-3xl font-semibold text-teal-600">{value}</div>
      </div>
      <div className="text-teal-500 text-2xl sm:text-3xl opacity-70">{icon}</div>
    </div>
  );
}

/* ====== Reusable box for tables ====== */
function RecentBox({
  title,
  headers,
  data,
}: {
  title: string;
  headers: string[];
  data: (string | number)[][];
}) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {headers.map((h, i) => (
                <th key={i} className="text-left py-2 font-medium text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="py-3 text-center text-gray-400"
                >
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 truncate max-w-[150px]">
                      {typeof cell === "string" && cell.startsWith("http") ? (
                        <a
                          href={cell}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-600 hover:underline"
                        >
                          {cell.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}