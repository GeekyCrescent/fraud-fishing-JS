import { useEffect, useState } from "react";

interface Reporte {
  id: number;
  url: string;
  estado: string;
}

export default function CrudReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);

  const fetchReportes = async () => {
    const res = await fetch("http://localhost:3000/api/reportes");
    const data = await res.json();
    setReportes(data);
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const eliminarReporte = async (id: number) => {
    await fetch(`http://localhost:3000/api/reportes/${id}`, { method: "DELETE" });
    fetchReportes();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Reportes</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">URL</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.url}</td>
              <td className="p-2">{r.estado}</td>
              <td className="p-2 flex gap-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded">Editar</button>
                <button
                  onClick={() => eliminarReporte(r.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
