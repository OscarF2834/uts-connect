import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/auth";
import api from "../services/api";

const MisFavores: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [favores, setFavores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/favores`).then(res => {
      const misFavores = res.data.filter((f: any) => f.user_id === user.id);
      setFavores(misFavores);
      setLoading(false);
    });
  }, [user.id]);

  const handleEliminar = async (id: number, descripcion: string) => {
    const confirmado = window.confirm(`¿Estás seguro de eliminar el favor "${descripcion}"?`);
    if (!confirmado) return;
    await api.delete(`/favores/${id}`);
    setFavores(favores.filter((f: any) => f.id !== id));
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <button className="mb-4 px-4 py-2 bg-gray-200 rounded" onClick={() => navigate("/student")}>Regresar</button>
      <h1 className="text-2xl font-bold mb-6">Mis Favores</h1>
      {loading ? <div>Cargando...</div> : (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Descripción</th>
              <th className="p-2">Recompensa</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {favores.map((f: any) => (
              <tr key={f.id} className="border-b">
                <td className="p-2">{f.descripcion}</td>
                <td className="p-2">${f.recompensa}</td>
                <td className="p-2">{f.estado}</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => navigate(`/editar-item/favor/${f.id}`)}>Editar</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleEliminar(f.id, f.descripcion)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};
export default MisFavores;
