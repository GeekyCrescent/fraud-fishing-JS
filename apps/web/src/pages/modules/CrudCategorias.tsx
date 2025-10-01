import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSettings,
  FiSearch,
} from "react-icons/fi";

interface Categoria {
  id: number;
  name: string;
  description: string;
}

export default function CrudCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nueva, setNueva] = useState({ name: "", description: "" });
  const [detalle, setDetalle] = useState<Categoria | null>(null);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filtro, setFiltro] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data);
        setPage(1);
      })
      .catch(() => setError("No se pudieron cargar las categorías"));
  }, []);

  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((cat) =>
      cat.name.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [categorias, filtro]);

  const totalPages = Math.max(1, Math.ceil(categoriasFiltradas.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return categoriasFiltradas.slice(start, start + pageSize);
  }, [categoriasFiltradas, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [filtro]);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva),
      });
      if (!res.ok) throw new Error();
      const creada = await res.json();
      setCategorias((curr) => [...curr, creada]);
      setNueva({ name: "", description: "" });
      setShowForm(false);
      setTimeout(() => {
        const pages = Math.ceil((categorias.length + 1) / pageSize);
        setPage(pages);
      }, 0);
    } catch {
      setError("No se pudo crear la categoría");
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      const res = await fetch(`http://localhost:3000/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setCategorias((curr) => curr.filter((c) => c.id !== id));
      if (detalle?.id === id) setDetalle(null);
    } catch {
      setError("No se pudo eliminar la categoría (quizá está en uso)");
    }
  };

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editando) return;
    try {
      const res = await fetch(`http://localhost:3000/categories/${editando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editando),
      });
      if (!res.ok) throw new Error();
      const actualizada = await res.json();
      setCategorias((curr) =>
        curr.map((c) => (c.id === actualizada.id ? actualizada : c))
      );
      setEditando(null);
    } catch {
      setError("No se pudo actualizar la categoría");
    }
  };

  return (
    <div className="min-h-screen text-gray-900 py-8 px-4">
      <div className="w-full m-0 p-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <h2 className="text-[22px] font-semibold tracking-tight">
              Categorías: <span className="font-bold">{categorias.length}</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-200 text-white px-4 py-2 rounded-lg shadow-sm"
              onClick={() => setShowForm(true)}
            >
              <FiPlus className="text-[18px]" />
              Agregar nueva categoría
            </button>
            <button
              className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg"
              title="Configuración de tabla"
            >
              <FiSettings className="text-[18px]" />
              <span className="hidden sm:inline">Configuración de tabla</span>
            </button>
          </div>
        </div>

        {/* Filtro */}
        <div className="mb-4">
          <div className="relative max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="text-teal-600 text-sm mb-3 bg-teal-50 border border-teal-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wide">
                <th className="py-3 px-6 text-left font-semibold">Nombre</th>
                <th className="py-3 px-4 text-left font-semibold">Descripción</th>
                <th className="py-3 px-4 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((cat) => (
                <tr
                  key={cat.id}
                  className="last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="py-6 px-4 font-medium text-gray-900">
                    {cat.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{cat.description}</td>
                  <td className="py-3 px-4 flex justify-end gap-2">
                    <button
                      onClick={() => setDetalle(cat)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => setEditando(cat)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(cat.id)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-400 text-sm">
                    {filtro
                      ? `No se encontraron categorías que coincidan con "${filtro}"`
                      : "No hay categorías para mostrar."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con paginación */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 bg-white mt-2 rounded-lg shadow-sm">
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
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="ml-2">
              {pageItems.length > 0
                ? `${(page - 1) * pageSize + 1}–${Math.min(
                    page * pageSize,
                    categoriasFiltradas.length
                  )} de ${categoriasFiltradas.length}`
                : `0 de ${categoriasFiltradas.length}`}
            </span>
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>


        {/* Modal Crear */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <form
              onSubmit={handleCrear}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Agregar categoría</h3>
              <input
                className="bg-white border border-gray-300 text-gray-900 p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Nombre"
                value={nueva.name}
                onChange={(e) => setNueva((n) => ({ ...n, name: e.target.value }))}
                required
              />
              <input
                className="bg-white border border-gray-300 text-gray-900 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Descripción"
                value={nueva.description}
                onChange={(e) => setNueva((n) => ({ ...n, description: e.target.value }))}
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 rounded-lg bg-teal-400 hover:bg-teal-200 text-white" type="submit">
                  Crear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Ver */}
        {detalle && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-1 text-gray-900">{detalle.name}</h3>
              <p className="mb-5 text-gray-700">{detalle.description}</p>
              <div className="flex justify-end">
                <button
                  className="bg-teal-400 hover:bg-teal-200 text-white px-4 py-2 rounded-lg"
                  onClick={() => setDetalle(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {editando && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <form
              onSubmit={handleEditar}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Editar categoría</h3>
              <input
                className="bg-white border border-gray-300 text-gray-900 p-2 rounded w-full mb-3 focus:ring-2 focus:ring-teal-200"
                value={editando.name}
                onChange={(e) => setEditando({ ...editando, name: e.target.value })}
                required
              />
              <input
                className="bg-white border border-gray-300 text-gray-900 p-2 rounded w-full mb-4 focus:ring-2 focus:ring-teal-200"
                value={editando.description}
                onChange={(e) => setEditando({ ...editando, description: e.target.value })}
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={() => setEditando(null)}
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white" type="submit">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
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
        className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
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
                ? "bg-teal-500 text-white border-teal-600"
                : "border-gray-200 hover:bg-gray-100"
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
        className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        {">"}
      </button>
    </div>
  );
}
