import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../lib/auth";
import api from "../services/api";

const CrearProducto: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const categoriaNavegada = location.state?.categoria || "";
  const [emprendimientoId, setEmprendimientoId] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: categoriaNavegada
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Consultar el emprendimiento del usuario para obtener el id
    fetch(`http://127.0.0.1:8000/api/emprendimientos/user/${user.id}`)
      .then(r => r.json())
      .then(res => {
        if (res && res.length > 0) {
          setEmprendimientoId(res[0].id);
          if (!form.categoria) {
            setForm(f => ({ ...f, categoria: res[0].categoria || "" }));
          }
        }
      });
  }, [user, form.categoria]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post(`/productos`, {
        emprendimiento_id: emprendimientoId,
        nombre: form.nombre,
        descripcion: form.descripcion,
        categoria: form.categoria,
        precio: form.precio,
        stock: form.stock
      });
      navigate("/student");
    } catch (err) {
      setError("No se pudo registrar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <button className="mb-4 px-4 py-2 bg-gray-200 rounded" onClick={() => navigate("/student")}>Regresar</button>
      <h1 className="text-2xl font-bold mb-6">Registrar Producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nombre del producto</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Precio</label>
          <input type="number" name="precio" value={form.precio} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Categoría</label>
          <input type="text" name="categoria" value={form.categoria} onChange={handleChange} className="w-full border rounded px-3 py-2" required disabled={!!categoriaNavegada} />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Producto"}
        </button>
      </form>
      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
    </main>
  );
};
export default CrearProducto;
