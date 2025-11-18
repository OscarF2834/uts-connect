import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditarItem: React.FC = () => {
  const navigate = useNavigate();
  const { tipo, id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    if (tipo === "producto") {
      api.get(`/productos/${id}`).then(res => {
        setForm(res.data);
        setLoading(false);
      }).catch(() => setError("No se pudo cargar el producto"));
    } else if (tipo === "favor") {
      api.get(`/favores/${id}`).then(res => {
        setForm(res.data);
        setLoading(false);
      }).catch(() => setError("No se pudo cargar el favor"));
    }
  }, [tipo, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (tipo === "producto") {
        await api.put(`/productos/${id}`, {
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: form.precio,
          stock: form.stock,
          categoria: form.categoria
        });
        navigate("/mis-productos");
      } else if (tipo === "favor") {
        await api.put(`/favores/${id}`, {
          descripcion: form.descripcion,
          recompensa: form.recompensa,
          estado: form.estado
        });
        navigate("/mis-favores");
      }
    } catch {
      setError("No se pudo actualizar");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <main className="p-6 max-w-lg mx-auto">
      <button className="mb-4 px-4 py-2 bg-gray-200 rounded" onClick={() => navigate(tipo === "producto" ? "/mis-productos" : "/mis-favores")}>Regresar</button>
      <h1 className="text-2xl font-bold mb-6">Editar {tipo === "producto" ? "Producto" : "Favor"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {tipo === "producto" ? (
          <>
            <div>
              <label className="block mb-1 font-medium">Nombre</label>
              <input type="text" name="nombre" value={form.nombre || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Descripción</label>
              <textarea name="descripcion" value={form.descripcion || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Precio</label>
              <input type="number" name="precio" value={form.precio || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Stock</label>
              <input type="number" name="stock" value={form.stock || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Categoría</label>
              <input type="text" name="categoria" value={form.categoria || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block mb-1 font-medium">Descripción</label>
              <textarea name="descripcion" value={form.descripcion || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Recompensa</label>
              <input type="number" name="recompensa" value={form.recompensa || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Estado</label>
              <input type="text" name="estado" value={form.estado || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </>
        )}
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
    </main>
  );
};
export default EditarItem;
