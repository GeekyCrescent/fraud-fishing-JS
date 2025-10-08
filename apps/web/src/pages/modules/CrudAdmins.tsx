import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEye,
  FiMoreHorizontal,
  FiSearch,
} from "react-icons/fi";

interface AdminStats {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_super_admin: boolean;
  created_at: string; // ISO
  reportCount: number;
  commentCount: number;
  likeCount: number;
}

export default function CrudAdmins() {
  const [admins, setAdmins] = useState<AdminStats[]>([]);
  const [detalle, setDetalle] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [tipoNuevo, setTipoNuevo] = useState<"admin" | "super_admin">("admin");
  const [nuevo, setNuevo] = useState({ name: "", email: "", password: "" });

  const [filtro, setFiltro] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof AdminStats | "">("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Función para obtener token de autorización
  const authHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Carga solo administradores desde /admin/user/stats filtrando is_admin = true O is_super_admin = true
  useEffect(() => {
    fetch("http://localhost:3000/admin/user/stats", {
      headers: authHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos completos del endpoint:", data); // ← LOG 1
        
        // Filtrar usuarios que son administradores O super administradores
        const adminUsers = (data?.users ?? []).filter((user: AdminStats) => 
          user.is_admin || user.is_super_admin
        );
        
        console.log("Usuarios filtrados como admins:", adminUsers); // ← LOG 2
        
        // Log específico para cada usuario
        adminUsers.forEach((user: { name: any; is_admin: any; is_super_admin: any; }) => {
          console.log(`Usuario: ${user.name}, is_admin: ${user.is_admin}, is_super_admin: ${user.is_super_admin}`); // ← LOG 3
        });
        
        setAdmins(adminUsers);
        setPage(1);
      })
      .catch(() => setError("No se pudieron cargar los administradores"));
  }, []);

  // ===== KPIs (tarjetas) =====
  const { total, nuevosSemana, superAdmins, nuevosDia } = useMemo(() => {
    const now = new Date().getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const oneDayMs = 24 * 60 * 60 * 1000;
    let t = 0,
      n = 0,
      sa = 0,
      d = 0;

    for (const admin of admins) {
      t++;
      if (admin.is_super_admin) sa++;
      const created = new Date(admin.created_at).getTime();
      if (now - created <= sevenDaysMs) n++;
      if (now - created <= oneDayMs) d++;
    }
    return { total: t, nuevosSemana: n, superAdmins: sa, nuevosDia: d };
  }, [admins]);

  // Filtro por nombre/email
  const filtrados = useMemo(() => {
    const f = filtro.trim().toLowerCase();
    if (!f) return admins;
    return admins.filter(
      (admin) => admin.name.toLowerCase().includes(f) || admin.email.toLowerCase().includes(f)
    );
  }, [admins, filtro]);

  // Ordenamiento
  const ordenados = useMemo(() => {
    if (!sortKey) return filtrados;
    const arr = [...filtrados];
    arr.sort((a, b) => {
      const va = a[sortKey] as any;
      const vb = b[sortKey] as any;

      if (sortKey === "created_at") {
        const da = new Date(va).getTime();
        const db = new Date(vb).getTime();
        return sortDir === "asc" ? da - db : db - da;
      }
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return arr;
  }, [filtrados, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(ordenados.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return ordenados.slice(start, start + pageSize);
  }, [ordenados, page, pageSize]);

  useEffect(() => setPage(1), [filtro, sortKey, sortDir, pageSize]);

  const toggleSort = (key: keyof AdminStats) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
    } else {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Seleccionar el endpoint correcto según el tipo
      const endpoint = tipoNuevo === "super_admin" 
        ? "http://localhost:3000/admin/register-super"  // ← Para Super Admin
        : "http://localhost:3000/admin/register";       // ← Para Admin normal

      console.log("Endpoint seleccionado:", endpoint);
      console.log("Tipo:", tipoNuevo);
      console.log("Datos a enviar:", nuevo);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(nuevo), // Solo name, email, password
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error("Error del backend:", errorData);
        throw new Error();
      }
      
      // Recargar la lista de administradores
      const ref = await fetch("http://localhost:3000/admin/user/stats", {
        headers: authHeaders(),
      });
      const data = await ref.json();
      console.log("Lista actualizada:", data);
      
      const adminUsers = (data?.users ?? []).filter((user: AdminStats) => 
        user.is_admin || user.is_super_admin
      ).map((user: AdminStats) => ({
        ...user,
        is_admin: Boolean(user.is_admin),
        is_super_admin: Boolean(user.is_super_admin || 0)  // Manejar undefined
      }));
      
      setAdmins(adminUsers);
      setShowForm(false);
      setNuevo({ name: "", email: "", password: "" });
      setTipoNuevo("admin"); // Reset al tipo por defecto
      
    } catch {
      setError("No se pudo crear el administrador");
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Eliminar este administrador?")) return;
    try {
      const res = await fetch(`http://localhost:3000/admin/user/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setAdmins((curr) => curr.filter((admin) => admin.id !== id));
      if (detalle?.id === id) setDetalle(null);
    } catch {
      setError("No se pudo eliminar el administrador");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h2 className="text-[22px] font-semibold tracking-tight">
            Administradores
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
            <button
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-sm cursor-pointer"
              onClick={() => {
                setShowForm(true)
                setTipoNuevo("admin");
              }}
            >
              <FiPlus className="text-[18px]" />
              Agregar admin
            </button>
            <button
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-sm cursor-pointer"
              onClick={() => {
                setShowForm(true)
                setTipoNuevo("super_admin");
              }}
            >
              <FiPlus className="text-[18px]" />
              Agregar super admin
            </button>
          </div>
        </div>

        {/* Tarjetas KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            title="Administradores totales"
            value={total}
            tone="solid"
          />
          <KpiCard
            title="Nuevos (7 días)"
            value={nuevosSemana}
            tone="soft"
          />
          <KpiCard
            title="Nuevos (Hoy)"
            value={nuevosDia}
            tone="soft"
          />
          <KpiCard
            title="Super Admins"
            value={superAdmins}
            tone="soft"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Tabla simplificada - Solo Nombre, Email, Rol, Creado */}
        <div className="w-full text-sm text-left text-gray-600">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="text-gray-600">
                <Th onClick={() => toggleSort("name")} active={sortKey === "name"} dir={sortDir}>Nombre</Th>
                <Th onClick={() => toggleSort("email")} active={sortKey === "email"} dir={sortDir}>Email</Th>
                <Th onClick={() => toggleSort("is_super_admin")} active={sortKey === "is_super_admin"} dir={sortDir}>Rol</Th>
                <Th onClick={() => toggleSort("created_at")} active={sortKey === "created_at"} dir={sortDir}>Creado</Th>
                <th className="py-3 pr-4 text-right w-0">Acciones</th>
              </tr>
            </thead>

            {/* importante: igual que CrudUsuarios */}
            <tbody className="divide-y divide-gray-300">
              {pageItems.map((admin) => (
                <RowAdmin
                  key={admin.id}
                  admin={admin}
                  onView={() => setDetalle(admin)}
                  onDelete={() => handleEliminar(admin.id)}
                />
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">
                    {filtro
                      ? `No se encontraron administradores con "${filtro}"`
                      : "No hay administradores."}
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
                  <option key={n} value={n}>
                    {n}
                  </option>
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

        {/* Modal crear - MEJORADO */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <form
              onSubmit={handleCrear}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
            >
              {/* HEADER mejorado que muestra claramente el tipo */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  {tipoNuevo === "admin" ? "Agregar Administrador" : "Agregar Super Administrador"}
                </h3>
                
                {/* Badge que muestra el tipo seleccionado */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Creando:</span>
                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                    tipoNuevo === "super_admin"
                      ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'
                      : 'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border border-teal-300'
                  }`}>
                    {tipoNuevo === "super_admin" ? "👑 Super Admin" : "⚙️ Admin"}
                  </span>
                </div>
                
                {/* Selector para cambiar el tipo */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Tipo de administrador:</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border-2 transition ${
                        tipoNuevo === "admin"
                          ? 'bg-teal-50 border-teal-300 text-teal-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setTipoNuevo("admin")}
                    >
                      ⚙️ Administrador
                    </button>
                    <button
                      type="button"
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border-2 transition ${
                        tipoNuevo === "super_admin"
                          ? 'bg-purple-50 border-purple-300 text-purple-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setTipoNuevo("super_admin")}
                    >
                      👑 Super Admin
                    </button>
                  </div>
                </div>
              </div>

              {/* Campos del formulario */}
              <input
                className="border p-2 rounded w-full mb-3"
                placeholder="Nombre"
                value={nuevo.name}
                onChange={(e) => setNuevo((n) => ({ ...n, name: e.target.value }))}
                required
              />
              <input
                className="border p-2 rounded w-full mb-3"
                placeholder="Email"
                type="email"
                value={nuevo.email}
                onChange={(e) => setNuevo((n) => ({ ...n, email: e.target.value }))}
                required
              />
              <input
                className="border p-2 rounded w-full mb-4"
                placeholder="Contraseña"
                type="password"
                value={nuevo.password}
                onChange={(e) => setNuevo((n) => ({ ...n, password: e.target.value }))}
                required
              />

              {/* Información adicional sobre permisos */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">
                  {tipoNuevo === "super_admin" ? "Permisos de Super Administrador:" : "Permisos de Administrador:"}
                </div>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>✓ Gestionar reportes y usuarios</li>
                  <li>✓ Validar contenido</li>
                  {tipoNuevo === "super_admin" && (
                    <li className="font-semibold">✓ Gestionar otros administradores</li>
                  )}
                </ul>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition" 
                  onClick={() => {
                    setShowForm(false);
                    setTipoNuevo("admin"); // Reset al cerrar
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`px-4 py-2 text-white rounded transition ${
                    tipoNuevo === "super_admin"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-teal-600 hover:bg-teal-700"
                  }`}
                >
                  Crear {tipoNuevo === "super_admin" ? "Super Admin" : "Admin"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal detalle simplificado */}
        {detalle && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-1">{detalle.name}</h3>
              <p className="text-gray-700 mb-2">{detalle.email}</p>
              
              {/* Rol destacado con colores diferentes */}
              <div className="mb-4">
                <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-lg ${
                  detalle.is_super_admin 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                }`}>
                  {detalle.is_super_admin ? "🔥 Super Administrador" : "⚙️ Administrador"}
                </span>
              </div>

              <div className="text-sm text-gray-500 mb-5 bg-gray-50 p-3 rounded-lg">
                <strong>Creado:</strong> {new Date(detalle.created_at).toLocaleString()}
              </div>

              <div className="flex justify-end">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg" onClick={() => setDetalle(null)}>
                  Cerrar
                </button>
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
    <div className={`rounded-2xl ${base} p-5 shadow-sm`}>
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

/* ====== Fila simplificada - Solo 4 columnas ====== */
function RowAdmin({
  admin,
  onView,
  onDelete,
}: {
  admin: AdminStats;
  onView: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Convertir a booleanos para asegurar tipos correctos
  const isSuperAdmin = Boolean(admin.is_super_admin);
  const isAdmin = Boolean(admin.is_admin);

  console.log(`${admin.name}: is_admin=${admin.is_admin} (${typeof admin.is_admin}), is_super_admin=${admin.is_super_admin} (${typeof admin.is_super_admin})`);

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
        <div className="text-lg font-semibold">{admin.name}</div>
      </td>
      <td className="py-4">
        <div className="text-base">{admin.email}</div>
      </td>

      {/* Mantén exactamente tus clases del badge de Rol */}
      <td className="py-4 px-4">
        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
          isSuperAdmin
            ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'
            : isAdmin
            ? 'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border border-teal-300'
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
        }`}>
          {isSuperAdmin ? "👑 Super Admin" : isAdmin ? "⚙️ Admin" : "👤 Usuario"}
        </span>
      </td>

      <td className="py-4">
        <div className="text-gray-600 text-sm">
          {new Date(admin.created_at).toLocaleDateString()}
        </div>
        <div className="text-gray-400 text-xs">
          {new Date(admin.created_at).toLocaleTimeString()}
        </div>
      </td>

      <td className="py-4 pr-4">
        <div className="relative flex justify-end" ref={menuRef}>
          <button
            className="p-2 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label="Más acciones"
          >
            <FiMoreHorizontal />
          </button>
          {open && (
            <div className="absolute right-0 top-9 w-40 bg-white shadow-lg rounded z-10">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => { onView(); setOpen(false); }}
              >
                <FiEye /> Ver
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={() => { onDelete(); setOpen(false); }}
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
