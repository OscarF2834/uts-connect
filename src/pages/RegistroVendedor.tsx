import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUser, setUser } from "../lib/auth";

const RegistroVendedor: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    imagen: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Obtiene el id del rol 'vendedor' desde la API
  const getVendedorRoleId = async () => {
    const res = await api.get("/roles");
    const vendedorRole = res.data.find((r: any) => r.name === "vendedor");
    return vendedorRole ? vendedorRole.id : null;
  };

  const actualizarRol = async () => {
    try {
      const roleId = await getVendedorRoleId();
      if (!roleId) throw new Error("No se encontró el rol vendedor");
      const res = await api.put(`/users/${user.id}`, { role_id: roleId });
      // Actualizar el usuario en sesión con el nuevo rol y datos actualizados
      setUser({ ...user, role: "vendedor", ...res.data });
    } catch (err) {
      setError("No se pudo actualizar el rol");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post(`/emprendimientos`, {
        user_id: user.id,
        nombre: form.nombre,
        descripcion: form.descripcion,
        categoria: form.categoria,
        imagen: form.imagen,
        estado: "activo"
      });
      await actualizarRol();
      navigate("/student");
    } catch (err) {
      setError("No se pudo registrar el emprendimiento");
    } finally {
      setLoading(false);
    }
  };

  const handleVendedorFavor = async () => {
    setLoading(true);
    setError(null);
    try {
      await actualizarRol();
      navigate("/student");
    } catch (err) {
      setError("No se pudo actualizar el rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <button className="mb-4 px-4 py-2 bg-gray-200 rounded" onClick={() => navigate("/clientes")}>Regresar</button>
      <h1 className="text-2xl font-bold mb-6">Registro de Vendedor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nombre del emprendimiento</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Categoría</label>
          <input type="text" name="categoria" value={form.categoria} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Imagen (opcional)</label>
          <input type="text" name="imagen" value={form.imagen} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="URL de la imagen" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse como vendedor"}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button className="text-indigo-600 underline" onClick={handleVendedorFavor} disabled={loading}>
          Registrarse como vendedor de favores
        </button>
      </div>
      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
    </main>
  );
};
export default RegistroVendedor;
