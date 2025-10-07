import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEye,
  FiMoreHorizontal,
  FiSearch,
  FiFlag,
} from "react-icons/fi";

interface Report {
  id: number;
  url: string;
  title?: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  statusId?: number;        
  voteCount?: number;      
  commentCount?: number;   
  createdAt?: string;
  reporterName?: string;  
  tags?: Tag[];
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface ReportForCreate {
  url: string;
  title?: string;
  description?: string;
  categoryId?: number;
}

interface Sibling extends Report {}

export default function CrudReportes() {
  const [reportes, setReportes] = useState<Report[]>([]);
  const [detalle, setDetalle] = useState<Report | null>(null);
  const [siblings, setSiblings] = useState<Sibling[] | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [nuevo, setNuevo] = useState<ReportForCreate>({ url: "" });

  const [filtro, setFiltro] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] =
    useState<keyof Report | "">("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const API = "http://localhost:3000";
  const authHeaders = (): Record<string, string> => {
    const t = localStorage.getItem("accessToken");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };
  // ===== Carga de reportes (GET /reports) =====
  const fetchReportes = async () => {
    setError("");
    try {
      const res = await fetch(`${API}/reports/active`);
      if (!res.ok) throw new Error();
      const data: Report[] = await res.json();
      setReportes(data ?? []);
      setPage(1);
    } catch {
      setError("No se pudieron cargar los reportes");
    }
  };

  // ===== Obtener tags de un reporte =====
  const fetchReportTags = async (reportId: number): Promise<Tag[]> => {
    try {
      const res = await fetch(`${API}/reports/${reportId}/tags`);
      if (!res.ok) throw new Error();
      const tags: Tag[] = await res.json();
      return tags;
    } catch {
      console.error('Error al cargar tags del reporte');
      return [];
    }
  };

  // ===== Obtener categoría de un reporte =====
  const fetchReportCategory = async (reportId: number): Promise<string> => {
    try {
      const res = await fetch(`${API}/reports/${reportId}/category`);
      if (!res.ok) throw new Error();
      const response: { categoryName: string } = await res.json();  
      return response.categoryName;  
    } catch {
      console.error('Error al cargar categoría del reporte');
      return 'Sin categoría';
    }
  };

  // ===== Función mejorada para ver detalles =====
  const handleVerDetalle = async (rep: Report) => {
    // Cargar tags y categoría en paralelo
    const [tags, categoryName] = await Promise.all([
      fetchReportTags(rep.id),
      fetchReportCategory(rep.id)
    ]);

    // Actualizar el reporte con los datos adicionales
    const reporteCompleto = {
      ...rep,
      tags,
      categoryName
    };

    setDetalle(reporteCompleto);
    await fetchSiblings(rep.url);
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  // ===== KPIs =====
  const { total, populares, conComentarios, hoy } = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    let t = 0, pop = 0, cc = 0, d = 0;
    for (const r of reportes) {
      t++;
      if ((r.voteCount ?? 0) > 0) pop++;
      if ((r.commentCount ?? 0) > 0) cc++;
      if (r.createdAt && (now - new Date(r.createdAt).getTime() <= oneDay)) d++;
    }
    return { total: t, populares: pop, conComentarios: cc, hoy: d };
  }, [reportes]);

  // ===== Filtro y ordenamiento =====
  const filtrados = useMemo(() => {
    const f = filtro.trim().toLowerCase();
    if (!f) return reportes;
    return reportes.filter((r) => {
      const u = r.url?.toLowerCase() ?? "";
      const t = r.title?.toLowerCase() ?? "";
      const d = r.description?.toLowerCase() ?? "";
      return u.includes(f) || t.includes(f) || d.includes(f);
    });
  }, [reportes, filtro]);

  const ordenados = useMemo(() => {
    if (!sortKey) return filtrados;
    const arr = [...filtrados];
    arr.sort((a, b) => {
      const va = a[sortKey] as any;
      const vb = b[sortKey] as any;

      if (sortKey === "createdAt") {
        const da = va ? new Date(va).getTime() : 0;
        const db = vb ? new Date(vb).getTime() : 0;
        return sortDir === "asc" ? da - db : db - da;
      }
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc" ? (va ?? 0) - (vb ?? 0) : (vb ?? 0) - (va ?? 0);
    });
    return arr;
  }, [filtrados, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(ordenados.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return ordenados.slice(start, start + pageSize);
  }, [ordenados, page, pageSize]);

  useEffect(() => setPage(1), [filtro, sortKey, sortDir, pageSize]);

  const toggleSort = (key: keyof Report) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
    } else {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    }
  };

  // ===== Crear (POST /reports) =====
  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(nuevo),
      });
      if (!res.ok) throw new Error();
      await fetchReportes();
      setShowForm(false);
      setNuevo({ url: "" });
    } catch {
      setError("No se pudo crear el reporte");
    }
  };

  // ===== Eliminar (DELETE /reports/:id) =====
  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Eliminar este reporte?")) return;
    try {
      const res = await fetch(`${API}/reports/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      });
      if (!res.ok) throw new Error();
      setReportes((curr) => curr.filter((r) => r.id !== id));
      if (detalle?.id === id) setDetalle(null);
    } catch {
      setError("No se pudo eliminar el reporte");
    }
  };

  // ===== Siblings (GET /reports/siblings?url=...) =====
  const fetchSiblings = async (url: string) => {
    setSiblings(null);
    try {
      const res = await fetch(`${API}/reports/siblings?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error();
      const data: Sibling[] = await res.json();
      setSiblings(data ?? []);
    } catch {
      setSiblings([]);
    }
  };

  // ===== UI =====
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h2 className="text-[22px] font-semibold tracking-tight">Reportes</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por URL, título o descripción…"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
            <button
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-sm"
              onClick={() => setShowForm(true)}
            >
              <FiPlus className="text-[18px]" />
              Agregar reporte
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard title="Total" value={total} tone="solid" />
          <KpiCard title="Populares (con votos)" value={populares} tone="soft" />
          <KpiCard title="Con comentarios" value={conComentarios} tone="soft" />
          <KpiCard title="Nuevos (hoy)" value={hoy} tone="soft" />
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="text-gray-500 text-xs uppercase">
                <Th onClick={() => toggleSort("url")} active={sortKey === "url"} dir={sortDir}>URL</Th>
                <Th onClick={() => toggleSort("title")} active={sortKey === "title"} dir={sortDir}>Título</Th>
                <Th onClick={() => toggleSort("voteCount")} active={sortKey === "voteCount"} dir={sortDir}>Votos</Th>
                <Th onClick={() => toggleSort("commentCount")} active={sortKey === "commentCount"} dir={sortDir}>Comentarios</Th>
                <Th onClick={() => toggleSort("createdAt")} active={sortKey === "createdAt"} dir={sortDir}>Creado</Th>
                <th className="py-3 pr-4 text-right w-56">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((rep) => (
                <RowReporte
                  key={rep.id}
                  rep={rep}
                  onView={() => handleVerDetalle(rep)} 
                  onDelete={() => handleEliminar(rep.id)}
                />
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-400">
                    {filtro ? `Sin resultados para "${filtro}"` : "No hay reportes."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer paginación */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Filas por página</span>
              <select
                className="border border-gray-300 rounded-md px-2 py-1 bg-white"
                value={pageSize}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPageSize(v);
                  setPage(1);
                }}
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="ml-2">
                {pageItems.length > 0
                  ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, ordenados.length)} de ${ordenados.length}`
                  : `0 de ${ordenados.length}`}
              </span>
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>

        {/* Modal crear */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <form onSubmit={handleCrear} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Agregar reporte</h3>
              <input
                className="border p-2 rounded w-full mb-3"
                placeholder="URL (https://...)"
                value={nuevo.url}
                onChange={(e) => setNuevo((n) => ({ ...n, url: e.target.value }))}
                required
              />
              <input
                className="border p-2 rounded w-full mb-3"
                placeholder="Título (opcional)"
                value={nuevo.title ?? ""}
                onChange={(e) => setNuevo((n) => ({ ...n, title: e.target.value }))}
              />
              <textarea
                className="border p-2 rounded w-full mb-3"
                placeholder="Descripción (opcional)"
                rows={3}
                value={nuevo.description ?? ""}
                onChange={(e) => setNuevo((n) => ({ ...n, description: e.target.value }))}
              />
              <input
                className="border p-2 rounded w-full mb-4"
                placeholder="CategoryId (opcional)"
                type="number"
                value={nuevo.categoryId ?? ""}
                onChange={(e) =>
                  setNuevo((n) => ({ ...n, categoryId: e.target.value ? Number(e.target.value) : undefined }))
                }
              />
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 bg-gray-100 rounded" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded">
                  Crear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal detalle MEJORADO */}
        {detalle && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"> {/* ← Aumenté el ancho */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">
                    {detalle.title || detalle.url}
                  </h3>
                  <a
                    href={detalle.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-700 hover:underline break-all"
                  >
                    {detalle.url}
                  </a>
                  {detalle.description && (
                    <p className="text-gray-700 mt-2">{detalle.description}</p>
                  )}
                  
                  {/* NUEVA SECCIÓN: Categoría */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-600">Categoría:</span>
                      <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                        {detalle.categoryName || 'Sin categoría'}
                      </span>
                    </div>
                  </div>

                  {/* NUEVA SECCIÓN: Tags */}
                  <div className="mt-4">
                    <div className="text-sm font-semibold text-gray-600 mb-2">Tags:</div>
                    {detalle.tags && detalle.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {detalle.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm"
                            style={{
                              backgroundColor: tag.color || '#E5E7EB',
                              color: '#374151'
                            }}
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin tags</span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mt-4">
                    Creado: {detalle.createdAt ? new Date(detalle.createdAt).toLocaleString() : "—"}
                  </div>
                </div>
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded"
                  onClick={() => setDetalle(null)}
                >
                  Cerrar
                </button>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-3 my-5 text-center">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-gray-500">Votos</div>
                  <div className="text-xl font-semibold">{detalle.voteCount ?? 0}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-gray-500">Comentarios</div>
                  <div className="text-xl font-semibold">{detalle.commentCount ?? 0}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="text-xl font-semibold">{detalle.statusId ?? "—"}</div>
                </div>
              </div>

              {/* Hermanos por URL */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FiFlag /> Otros reportes de esta URL
                  </h4>
                  <span className="text-sm text-gray-500">{siblings?.length ?? 0}</span>
                </div>

                {!siblings && <div className="text-gray-400">Cargando…</div>}
                {siblings && siblings.length === 0 && (
                  <div className="text-gray-400">No hay más reportes de esta URL.</div>
                )}
                {siblings && siblings.length > 0 && (
                  <ul className="space-y-3 max-h-72 overflow-auto pr-1">
                    {siblings.map((s) => (
                      <li key={s.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-medium">
                              {s.title || "(sin título)"} · #{s.id}
                            </div>
                            <div className="text-xs text-gray-500">
                              {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span>👍 {s.voteCount ?? 0}</span>
                            <span>💬 {s.commentCount ?? 0}</span>
                            <button
                              className="px-3 py-1 border rounded hover:bg-white"
                              onClick={() => handleVerDetalle(s)} 
                            >
                              Ver
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====== KpiCard ====== */
function KpiCard({
  title,
  value,
  tone = "soft",
}: {
  title: string;
  value: number | string;
  tone?: "solid" | "soft";
}) {
  const base =
    tone === "solid"
      ? "bg-teal-600 text-white hover:bg-teal-700"
      : "bg-teal-50 text-teal-900 border border-teal-100 hover:bg-teal-100";
  const numberStyle =
    tone === "solid" ? "text-3xl font-semibold" : "text-3xl font-bold text-teal-700";

  return (
    <div className={`rounded-2xl ${base} p-5 shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer`}>
      <div className="text-sm opacity-90">{title}</div>
      <div className={numberStyle}>{value}</div>
    </div>
  );
}

/* ====== Header cell con ordenamiento ====== */
function Th({
  children,
  onClick,
  active,
  dir,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  dir?: "asc" | "desc";
}) {
  return (
    <th
      className="py-3 px-2 text-left font-bold text-[13px] select-none cursor-pointer"
      onClick={onClick}
      title="Ordenar"
    >
      <div className="inline-flex items-center gap-1">
        {children}
        {active && <span className="text-gray-400">{dir === "asc" ? "▲" : "▼"}</span>}
      </div>
    </th>
  );
}

/* ====== Fila ====== */
function RowReporte({
  rep,
  onView,
  onDelete,
}: {  
  rep: Report;
  onView: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <tr className="border-t hover:bg-teal-50/40">
      <td className="py-4 pl-4">
        <a href={rep.url} target="_blank" rel="noreferrer" className="text-teal-700 hover:underline break-all">
          {rep.url}
        </a>
      </td>
      <td className="py-4">{rep.title ?? "—"}</td>
      <td className="py-4">{rep.voteCount ?? 0}</td>
      <td className="py-4">{rep.commentCount ?? 0}</td>
      <td className="py-4">{rep.statusId ?? "—"}</td>
      <td className="py-4">{rep.createdAt ? new Date(rep.createdAt).toLocaleString() : "—"}</td>
      <td className="py-4 pr-4">
        <div className="relative flex justify-end" ref={menuRef}>
          <button className="p-2 rounded hover:bg-teal-50" onClick={() => setOpen((v) => !v)} aria-label="Más acciones">
            <FiMoreHorizontal />
          </button>
          {open && (
            <div className="absolute right-0 top-9 w-56 bg-white border rounded shadow">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                onClick={() => {
                  onView();
                  setOpen(false);
                }}
              >
                <FiEye /> Ver
              </button>

              <div className="border-t my-1" />
              {/* Cambiar status rápido (IDs de ejemplo) */}
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
              >
                <FiTrash2 /> Eliminar
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ====== Paginación ====== */
function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const pages = useMemo(() => {
    const arr: (number | string)[] = [];
    const push = (v: number | string) => arr.push(v);
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) push(i);
      return arr;
    }
    push(1);
    if (page > 3) push("…");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) push(i);
    if (page < totalPages - 2) push("…");
    push(totalPages);
    return arr;
  }, [page, totalPages]);

  return (
    <div className="flex items-center gap-2">
      <button
        className="px-2 py-1 rounded border border-gray-200 hover:bg-teal-50 disabled:opacity-50"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        {"<"}
      </button>
      {pages.map((p, i) =>
        typeof p === "number" ? (
          <button
            key={`${p}-${i}`}
            className={`px-3 py-1 rounded border ${
              p === page
                ? "bg-teal-600 text-white border-teal-600"
                : "border-gray-200 hover:bg-teal-50"
            }`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ) : (
          <span key={`dots-${i}`} className="px-2 text-gray-500">
            {p}
          </span>
        )
      )}
      <button
        className="px-2 py-1 rounded border border-gray-200 hover:bg-teal-50 disabled:opacity-50"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        {">"}
      </button>
    </div>
  );
}
