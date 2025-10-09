import { useEffect, useState, useMemo } from "react";
import {
  FiUsers,
  FiClipboard,
  FiTag,
  FiShield,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertTriangle,
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
        const [usersRes, catsRes, reportsRes, valRes] = await Promise.all([
          fetch("http://localhost:3000/admin/user/stats").then((r) => r.json()),
          fetch("http://localhost:3000/categories").then((r) => r.json()),
          fetch("http://localhost:3000/reports").then((r) => r.json()),
          fetch("http://localhost:3000/report-validations").then((r) => r.json()),
        ]);

        const users = usersRes?.users ?? [];
        const admins = users.filter((u: any) => u.is_admin).length;
        const usuarios = users.length - admins;
        const categorias = catsRes?.length ?? 0;
        const reportes = reportsRes?.length ?? 0;
        const validaciones = valRes?.length ?? 0;
        const recientes = reportsRes.slice(0, 5);
        const ultimosUsuarios = users.slice(-5).reverse();
        const topCategorias = catsRes.slice(0, 5);

        setData({
          usuarios,
          admins,
          categorias,
          reportes,
          validaciones,
          recientes,
          ultimosUsuarios,
          topCategorias,
        });
      } catch {
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
      { name: "Validaciones", value: data.validaciones },
    ];
  }, [data]);

  const barData = [
    { name: "Enero", reportes: 120, usuarios: 80 },
    { name: "Febrero", reportes: 140, usuarios: 95 },
    { name: "Marzo", reportes: 200, usuarios: 120 },
    { name: "Abril", reportes: 160, usuarios: 130 },
    { name: "Mayo", reportes: 220, usuarios: 180 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-[#00204D]">
            Dashboard general
          </h1>
          <p className="text-gray-500 text-sm">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <KpiCard icon={<FiUsers />} title="Usuarios" value={data.usuarios} />
              <KpiCard icon={<FiShield />} title="Admins" value={data.admins} />
              <KpiCard icon={<FiTag />} title="Categorías" value={data.categorias} />
              <KpiCard icon={<FiClipboard />} title="Reportes" value={data.reportes} />
              <KpiCard icon={<FiCheckCircle />} title="Validaciones" value={data.validaciones} />
            </div>

            {/* Gráficos */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie */}
              <div className="bg-white border rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Distribución general</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Barras */}
              <div className="bg-white border rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Actividad mensual (demo)
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
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

            {/* Línea temporal */}
            <section className="bg-white border rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Crecimiento y tendencia (usuarios vs reportes)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usuarios" stroke="#3B82F6" strokeWidth={3} />
                  <Line type="monotone" dataKey="reportes" stroke="#14B8A6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </section>

            {/* Actividad reciente */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Últimos reportes */}
              <div className="bg-white border rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Últimos reportes</h2>
                <RecentList
                  headers={["#", "URL", "Estado"]}
                  data={data.recientes.map((r: any) => [
                    r.id,
                    r.url,
                    r.status ?? "Pendiente",
                  ])}
                />
              </div>

              {/* Nuevos usuarios */}
              <div className="bg-white border rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Usuarios recientes</h2>
                <RecentList
                  headers={["#", "Nombre", "Email"]}
                  data={data.ultimosUsuarios.map((u: any) => [
                    u.id,
                    u.name,
                    u.email,
                  ])}
                />
              </div>

              {/* Top categorías */}
              <div className="bg-white border rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Top categorías</h2>
                <RecentList
                  headers={["#", "Nombre", "Descripción"]}
                  data={data.topCategorias.map((c: any) => [
                    c.id,
                    c.name,
                    c.description,
                  ])}
                />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

/* ====== KpiCard ====== */
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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-transform hover:scale-105">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-3xl font-semibold text-teal-600">{value}</div>
      </div>
      <div className="text-teal-500 text-3xl opacity-70">{icon}</div>
    </div>
  );
}

/* ====== Mini Tabla ====== */
function RecentList({
  headers,
  data,
}: {
  headers: string[];
  data: (string | number)[][];
}) {
  return (
    <table className="w-full text-sm">
      <thead className="text-gray-600 border-b">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="text-left py-2">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr
            key={i}
            className="border-b last:border-none hover:bg-gray-50 transition"
          >
            {row.map((cell, j) => (
              <td key={j} className="py-2">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
