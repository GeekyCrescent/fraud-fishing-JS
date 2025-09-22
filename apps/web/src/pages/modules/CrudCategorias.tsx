import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiEye } from "react-icons/fi";

interface Categoria {
  id: number;
  name: string;
  description: string;
}

export default function CrudCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtro, setFiltro] = useState("");
  const [nueva, setNueva] = useState({ name: "", description: "" });
  const [detalle, setDetalle] = useState<Categoria | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((res) => res.json())
      .then(setCategorias)
      .catch(() => setError("No se pudieron cargar las categorías"));
  }, []);

  const categoriasFiltradas = categorias.filter((c) =>
    c.name.toLowerCase().includes(filtro.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Categorías</h2>
          <button
            className="flex items-center gap-2 bg-[#00B5BC] hover:bg-[#009ca8] text-white px-4 py-2 rounded shadow"
            onClick={() => setShowForm(true)}
          >
            <FiPlus /> Crear
          </button>
        </div>

        <div className="flex items-center mb-6">
          <input
            className="bg-white border border-gray-300 text-gray-900 p-2 rounded w-72 shadow-sm"
            placeholder="Filtrar por nombre..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categoriasFiltradas.map((cat) => (
                <tr key={cat.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{cat.id}</td>
                  <td className="p-3">{cat.name}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="p-2 rounded hover:bg-[#00B5BC]/10"
                      title="Ver detalle"
                      onClick={() => setDetalle(cat)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className="p-2 rounded hover:bg-red-100"
                      title="Eliminar"
                      onClick={() => handleEliminar(cat.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {categoriasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-400">
                    No hay categorías.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de creación */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
              onSubmit={handleCrear}
              className="bg-white p-8 rounded-lg shadow max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900">Crear Categoría</h3>
              <input
                className="bg-gray-100 border border-gray-300 text-gray-900 p-2 rounded w-full mb-4"
                placeholder="Nombre"
                value={nueva.name}
                onChange={(e) => setNueva((n) => ({ ...n, name: e.target.value }))}
                required
              />
              <input
                className="bg-gray-100 border border-gray-300 text-gray-900 p-2 rounded w-full mb-4"
                placeholder="Descripción"
                value={nueva.description}
                onChange={(e) => setNueva((n) => ({ ...n, description: e.target.value }))}
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded bg-[#00B5BC] hover:bg-[#009ca8] text-white"
                  type="submit"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal de detalle */}
        {detalle && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
              <h3 className="text-xl font-bold mb-2 text-gray-900">{detalle.name}</h3>
              <p className="mb-4 text-gray-700">{detalle.description}</p>
              <button
                className="bg-[#00B5BC] text-white px-4 py-2 rounded"
                onClick={() => setDetalle(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}