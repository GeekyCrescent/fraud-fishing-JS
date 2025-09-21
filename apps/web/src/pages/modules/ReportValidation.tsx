import { useEffect, useMemo, useState } from "react";

type Report = {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  image?: string;
  created_at: string;
  updated_at: string;
};

type StatusTab = "pending" | "in_progress";

const STATUS_LABEL: Record<Report["status"], string> = {
  pending: "Pendiente",
  in_progress: "En proceso",
  resolved: "Aceptado",
  rejected: "Denegado",
};

function StatusBadge({ status }: { status: Report["status"] }) {
  const style =
    status === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : status === "in_progress"
      ? "bg-blue-100 text-blue-800"
      : status === "resolved"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${style}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function ReportValidation() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<StatusTab>("pending");
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 1) Fetch según pestaña (pending | in_progress)
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const url = `http://localhost:3000/reports?status=${tab}`;

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Report[]) => setReports(Array.isArray(data) ? data : []))
      .catch((e) => {
        if (e.name !== "AbortError") setError("No se pudieron cargar los reportes.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [tab]);

  // 2) Búsqueda local + filtro por status (por si el backend no filtra)
  const filtered = useMemo(() => {
    const base = reports;
    // Filtra por status según la pestaña seleccionada
    const filteredByTab = base.filter((r) => r.status === tab);
    if (!q.trim()) return filteredByTab;
    const k = q.toLowerCase();
    return filteredByTab.filter(
      (r) =>
        r.title.toLowerCase().includes(k) ||
        r.description.toLowerCase().includes(k) ||
        String(r.userId).includes(k)
    );
  }, [reports, q, tab]);

  // 3) Cambios de estado con actualización optimista
  const handleChangeStatus = async (id: number, nextStatus: Report["status"]) => {
    const target = reports.find((r) => r.id === id);
    if (!target) return;

    // Reglas: pending → in_progress; in_progress → resolved|rejected
    if (target.status === "pending" && nextStatus !== "in_progress") return;
    if (
      target.status === "in_progress" &&
      !["resolved", "rejected"].includes(nextStatus)
    )
      return;

    const ok = confirm(
      `¿Confirmas cambiar el estado del reporte #${id} a "${STATUS_LABEL[nextStatus]}"?`
    );
    if (!ok) return;

    // Estado optimista
    const prev = reports;
    setReports((curr) =>
      curr.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );

    try {
      const res = await fetch(`http://localhost:3000/reports/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Al cambiar de estado ya no pertenece a la pestaña actual → lo quitamos de la lista
      setReports((curr) => curr.filter((r) => r.id !== id));
    } catch {
      alert("No se pudo actualizar el estado. Se revirtió el cambio.");
      setReports(prev);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#00204D]">📝 Gestión de Reportes</h2>
          <p className="text-sm text-gray-500">
            Filtra por estado y cambia el flujo de cada reporte.
          </p>
        </div>

        {/* Tabs solo pending / in_progress */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1">
          {[
            { key: "pending", label: "Pendientes" },
            { key: "in_progress", label: "En proceso" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key as StatusTab)}
              className={`px-4 py-2 text-sm rounded-lg transition ${
                tab === (key as StatusTab)
                  ? "bg-white shadow font-semibold"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Búsqueda */}
      <div className="flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título, descripción o ID de usuario…"
          className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="animate-pulse rounded-xl border p-6">
          <div className="h-6 w-56 rounded bg-gray-200 mb-4" />
          <div className="h-10 w-full rounded bg-gray-200 mb-2" />
          <div className="h-10 w-full rounded bg-gray-200 mb-2" />
          <div className="h-10 w-full rounded bg-gray-200" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          {q
            ? "No hay resultados para tu búsqueda."
            : tab === "pending"
            ? "No hay reportes pendientes."
            : "No hay reportes en proceso."}
        </div>
      ) : tab === "in_progress" ? (
        // Vista card para "En proceso": acciones Aceptar / Denegar
        <div className="space-y-6">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-gray-200 bg-white p-6 mb-6 shadow flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-[#00204D]">#{r.id}</span>
                  <StatusBadge status={r.status} />
                </div>
                <div className="font-semibold text-xl">{r.title}</div>
                <div className="text-gray-700">{r.description}</div>
                <div className="text-sm text-gray-500">
                  Usuario: <span className="font-mono">{r.userId}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Actualizado: {formatDate(r.updated_at)}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-8">
                <button
                  title="Aceptar"
                  onClick={() => handleChangeStatus(r.id, "resolved")}
                  className="px-4 py-2 text-base rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Aceptar
                </button>
                <button
                  title="Denegar"
                  onClick={() => handleChangeStatus(r.id, "rejected")}
                  className="px-4 py-2 text-base rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Denegar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Tabla para "Pendientes": acción única → En proceso
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-[#00204D] text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Título</th>
                <th className="p-3 text-left">Descripción</th>
                <th className="p-3 text-left">Usuario</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Creado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">#{r.id}</td>
                  <td className="p-3">{r.title}</td>
                  <td className="p-3 line-clamp-2 max-w-[28ch]">{r.description}</td>
                  <td className="p-3">{r.userId}</td>
                  <td className="p-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="p-3 text-sm text-gray-600">{formatDate(r.created_at)}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center">
                      <button
                        title="Mover a En proceso"
                        onClick={() => handleChangeStatus(r.id, "in_progress")}
                        className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        En proceso
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
