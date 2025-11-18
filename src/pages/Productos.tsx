import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductCard, { Product } from "../components/ProductCard";
import { getUser, getUserRole } from "../lib/auth";
import api from "../services/api";

const Productos: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const role = getUserRole();
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/productos").then(res => {
      let productosDisponibles = res.data;
      if (role === "vendedor") {
        productosDisponibles = productosDisponibles.filter((p: any) => p.emprendimiento?.user_id !== user.id);
      }
      setProductos(productosDisponibles);
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
      <h1 className="text-2xl font-bold mb-6">Productos disponibles</h1>
      {loading ? <div>Cargando...</div> : (
        productos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Sin productos por el momento</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productos.map((producto: any) => (
              <ProductCard key={producto.id} product={{
                id: producto.id,
                title: producto.nombre || producto.title,
                description: producto.descripcion,
                price: producto.precio,
                image: producto.imagen_url,
                author: producto.emprendimiento?.nombre || producto.author
              }} />
            ))}
          </div>
        )
      )}
    </main>
  );
};
export default Productos;
