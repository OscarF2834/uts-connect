import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/auth";
import api from "../services/api";

const CrearFavor: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [form, setForm] = useState({
    descripcion: "",
    recompensa: "",
    estado: "pendiente"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post(`/favores`, {
        user_id: user.id,
        descripcion: form.descripcion,
        recompensa: form.recompensa,
        estado: form.estado
      });
      navigate("/student");
    } catch (err) {
      setError("No se pudo registrar el favor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <button className="mb-4 px-4 py-2 bg-gray-200 rounded" onClick={() => navigate("/student")}>Regresar</button>
      <h1 className="text-2xl font-bold mb-6">Registrar Favor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Descripción del favor</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Recompensa</label>
          <input type="number" name="recompensa" value={form.recompensa} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Estado</label>
          <input type="text" name="estado" value={form.estado} onChange={handleChange} className="w-full border rounded px-3 py-2" required disabled />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Favor"}
        </button>
      </form>
      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
    </main>
  );
};
export default CrearFavor;
