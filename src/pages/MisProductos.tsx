import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/auth";
import api from "../services/api";

const MisProductos: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/productos`).then(res => {
      // Filtrar productos por emprendimiento del usuario
      const misProductos = res.data.filter((p: any) => p.emprendimiento?.user_id === user.id);
      setProductos(misProductos);
      setLoading(false);
    });
  }, [user.id]);

  const handleEliminar = async (id: number, nombre: string) => {
    const confirmado = window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`);
    if (!confirmado) return;
    await api.delete(`/productos/${id}`);
    setProductos(productos.filter((p: any) => p.id !== id));
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <button className="mb-4 px-4 py-2 bg-gray-200 rounded" onClick={() => navigate("/student")}>Regresar</button>
      <h1 className="text-2xl font-bold mb-6">Mis Productos</h1>
      {loading ? <div>Cargando...</div> : (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Nombre</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p: any) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.nombre}</td>
                <td className="p-2">{p.descripcion}</td>
                <td className="p-2">${p.precio}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => navigate(`/editar-item/producto/${p.id}`)}>Editar</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleEliminar(p.id, p.nombre)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};
export default MisProductos;
