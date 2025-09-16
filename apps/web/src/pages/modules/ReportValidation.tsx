export default function ReportValidation() {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#00204D]">📝 Validar / Denegar Reportes</h2>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-[#00204D] text-white">
            <tr>
              {/* 👉 Ajusta estas columnas según tu backend */}
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-left">Usuario</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* 👉 Aquí harás .map() cuando conectes al backend */}
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3">#</td>
              <td className="p-3">Título de reporte</td>
              <td className="p-3">Descripción breve</td>
              <td className="p-3">usuario@correo.com</td>
              <td className="p-3">2025-09-11</td>
              <td className="p-3 text-center space-x-2">
                <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                  Validar
                </button>
                <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                  Denegar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
