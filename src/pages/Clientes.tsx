import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, getUserName } from "../lib/auth";
import { useAuth } from "../hooks/use-auth";
import axios from "axios";

const Clientes: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = getUser();
  const userName = getUserName();
  const [showVendedor, setShowVendedor] = useState(false);
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);

  useEffect(() => {
    if (user?.email?.includes("@uts.edu.co")) {
      setShowVendedor(true);
    }
  }, [user]);

  useEffect(() => {
    if (showNotificaciones && user?.id) {
      axios.get("/notificaciones").then((res) => {
        const notis = res.data.filter((n: any) => n.user_id === user.id);
        setNotificaciones(notis);
      });
    }
  }, [showNotificaciones, user]);

  return (
    <main className="p-6 max-w-md mx-auto flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenido, {userName || "Usuario"}
      </h1>
      <div className="flex flex-col gap-4 w-full">
        <button
          className="w-full bg-indigo-600 text-white py-2 rounded shadow"
          onClick={() => navigate("/favores")}
        >
          Ver favores disponibles
        </button>
        <button
          className="w-full bg-purple-600 text-white py-2 rounded shadow"
          onClick={() => navigate("/productos")}
        >
          Ver productos disponibles
        </button>
        {showVendedor && (
          <button
            className="w-full bg-green-600 text-white py-2 rounded shadow"
            onClick={() => navigate("/registro-vendedor")}
          >
            Regístrese como vendedor
          </button>
        )}
        <button
          className="w-full bg-yellow-500 text-white py-2 rounded shadow"
          onClick={() => setShowNotificaciones((v) => !v)}
        >
          {showNotificaciones
            ? "Ocultar notificaciones"
            : "Ver mis notificaciones"}
        </button>
        {showNotificaciones && (
          <div className="mt-4 w-full">
            <h2 className="text-lg font-bold mb-2">Mis notificaciones</h2>
            {notificaciones.length === 0 ? (
              <div className="text-gray-500">No tienes notificaciones.</div>
            ) : (
              <ul className="space-y-2">
                {notificaciones.map((n) => (
                  <li
                    key={n.id}
                    className={`border rounded p-3 ${
                      n.leida ? "" : "border-primary"
                    }`}
                  >
                    <div className="font-semibold">{n.mensaje}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(n.fecha_envio).toLocaleString()}
                    </div>
                    {n.estado && (
                      <div
                        className={`mt-1 font-bold ${
                          n.estado === "aceptada"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {n.estado === "aceptada"
                          ? "Solicitud aceptada"
                          : "Solicitud rechazada"}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <button
          className="w-full bg-red-500 text-white py-2 rounded shadow mt-6"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
};

export default Clientes;
