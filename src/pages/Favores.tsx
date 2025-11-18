import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FavorCard, { Favor } from "../components/FavorCard";
import { getUser, getUserRole } from "../lib/auth";
import api from "../services/api";

const Favores: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const role = getUserRole();
  const [favores, setFavores] = useState<Favor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/favores").then(res => {
      let favoresDisponibles = res.data;
      if (role === "vendedor") {
        favoresDisponibles = favoresDisponibles.filter((f: any) => f.user_id !== user.id);
      }
      setFavores(favoresDisponibles);
      setLoading(false);
    });
  }, [role, user]);

  // Determinar pantalla principal de regreso
  const handleRegresar = () => {
    if (location.state?.from === "student" || role === "vendedor") {
      navigate("/student");
    } else {
      navigate("/clientes");
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <button className="mb-4 px-4 py-2 bg-gray-200 rounded" onClick={handleRegresar}>Regresar</button>
      <h1 className="text-2xl font-bold mb-6">Favores disponibles</h1>
      {loading ? <div>Cargando...</div> : (
        favores.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Sin favores por el momento</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favores.map((favor: any) => (
              <FavorCard key={favor.id} favor={{
                id: favor.id,
                title: favor.titulo || favor.title,
                description: favor.descripcion,
                price: favor.recompensa || favor.price,
                author: favor.user?.name || favor.author,
                location: favor.ubicacion || favor.location,
                user_id: favor.user_id // <-- Asegura que el id del vendedor esté presente
              }} />
            ))}
          </div>
        )
      )}
    </main>
  );
};
export default Favores;
