import { useEffect, useState } from "react";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

export default function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const fetchUsuarios = async () => {
    const res = await fetch("http://localhost:3000/api/usuarios");
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const eliminarUsuario = async (id: number) => {
    await fetch(`http://localhost:3000/api/usuarios/${id}`, { method: "DELETE" });
    fetchUsuarios();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Usuarios</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.nombre}</td>
              <td className="p-2">{u.correo}</td>
              <td className="p-2 flex gap-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded">Editar</button>
                <button
                  onClick={() => eliminarUsuario(u.id)}
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
