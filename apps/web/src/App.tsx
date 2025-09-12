import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.tsx";

export default function App() {
  const [user, setUser] = useState<{ correo: string } | null>(null);

  return (
    <Routes>
      <Route path="/" element={<Login setUser={setUser} />} />
      <Route path="/dashboard" element={<Dashboard user={user} />} />
    </Routes>
  );
}
