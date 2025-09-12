interface DashboardProps {
  user: { correo: string } | null;
}

export default function Dashboard({ user }: DashboardProps) {
  return (
    <div className="h-screen bg-[#f9f9f9] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-[#00204D]">
        Bienvenido al Dashboard
      </h1>
      {user && (
        <p className="mt-4 text-lg text-gray-600">
          Sesión iniciada como: {user.correo}
        </p>
      )}
    </div>
  );
}
