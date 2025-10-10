import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setUser: (user: { correo: string }) => void;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    is_admin: boolean;
  };
}

export default function Login({ setUser }: LoginProps) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = { email: correo, password: contrasena };
    console.log("Enviando payload:", payload); // 1. Verifica lo que se envía

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Respuesta del servidor:", res); // 2. Verifica la respuesta completa

      if (!res.ok) {
        let msg = "Credenciales incorrectas";
        try {
          const err = await res.json();
          console.error("Error en la respuesta (JSON):", err); // 3. Verifica el error del JSON
          msg = err.message ?? msg;
        } catch (jsonError) {
          console.error("No se pudo parsear el JSON de error:", jsonError);
        }
        setError(msg);
        return;
      }

      const data: LoginResponse = await res.json();
      console.log("Datos recibidos (éxito):", data); // 4. Verifica los datos si todo va bien

      // Solo admins
      if (!data.user.is_admin) {
        setError("Solo los administradores pueden ingresar.");
        return;
      }
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Guarda usuario en tu estado global/local
      setUser({ correo: data.user.email});

      navigate("/dashboard");
    } catch (err) {
      console.error("Error en el bloque catch (fetch falló):", err); // 5. Verifica el error de conexión
      setError("Error de conexión");
    }
  };


  return (
    <div className="flex h-screen font-sans">
      {/* Panel izquierdo (formulario) */}
      <div className="flex flex-1 bg-white items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="Fraud Fishing"
            className="mx-auto mb-10 w-64"
          />

          <h2 className="text-2xl font-bold text-[#00204D] mb-4">
            Inicia sesión
          </h2>
          <p className="text-gray-600 mb-6">
            Accede con tus credenciales
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center space-y-4"
          >
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-[#00B5BC]"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-[#00B5BC]"
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#00B5BC] text-white 
                         font-bold text-lg hover:bg-[#009da3] transition-colors cursor-pointer"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>

      {/* Panel derecho (bienvenida) */}
      <div className="flex flex-1 bg-gradient-to-br from-[#00204D] to-[#00B5BC] 
                      items-center justify-center text-center text-white p-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">¡Bienvenido!</h2>
          <p className="max-w-xs mx-auto">
            Ingresa tus datos para acceder al dashboard y gestionar tu información.
          </p>
        </div>
      </div>
    </div>
  );
}
