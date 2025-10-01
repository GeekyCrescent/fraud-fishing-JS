import { useEffect, useState } from "react";

interface Stats {
  pendientes: number;
  aceptados: number;
  usuarios: number;
  alertas: number;
}

interface Report {
  id: string;
  url: string;
  status: string;
}

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        setStats(data.stats);
        setReports(data.reports);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Tarjetas */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h3 className="text-gray-500">Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendientes}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h3 className="text-gray-500">Aceptados</h3>
            <p className="text-3xl font-bold text-green-600">{stats.aceptados}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h3 className="text-gray-500">Usuarios</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.usuarios}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h3 className="text-gray-500">Alertas</h3>
            <p className="text-3xl font-bold text-red-600">{stats.alertas}</p>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-bold mb-4">Últimos Reportes</h3>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">URL</th>
              <th className="p-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{r.id}</td>
                <td className="p-2 text-blue-600 underline">{r.url}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      r.status === "Pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
