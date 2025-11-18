import React, { useState } from "react";
import api from "../services/api";
import { getUser } from "../lib/auth";

export type Favor = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  author?: string;
  location?: string;
  user_id?: number;
};

const FavorCard: React.FC<{ favor: Favor }> = ({ favor }) => {
  const [showModal, setShowModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const user = getUser();

  const handleSeleccionar = () => {
    setShowModal(true);
  };

  const handleEnviarMensaje = async () => {
    setEnviando(true);
    try {
      await api.post("/notificaciones", {
        user_id: favor.user_id, // id del vendedor
        mensaje: mensaje,
        fecha_envio: new Date().toISOString().slice(0, 19).replace('T', ' '), // formato MySQL
        leida: false,
        estado: "pendiente",
        respuesta: null,
      });
      setEnviado(true);
    } catch {
      // Manejar error
    }
    setEnviando(false);
  };

  return (
    <article className="bg-white rounded-lg shadow p-4 flex flex-col">
      <h3 className="font-semibold text-gray-800">{favor.title}</h3>
      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{favor.description}</p>
      <div className="mt-auto flex items-center justify-between pt-3">
        <div className="text-xs text-gray-500">{favor.location}</div>
        <span className="text-sm font-bold text-indigo-600">
          {favor.price != null ? `$${favor.price}` : "A convenir"}
        </span>
        <button className="text-sm bg-green-600 text-white px-3 py-1 rounded" onClick={handleSeleccionar}>
          Seleccionar
        </button>
      </div>
      {/* Marca de agua con el nombre del dueño */}
      <div className="text-xs text-gray-400 text-right mt-2 opacity-80 select-none">
        @{favor.author}
      </div>
      {/* Modal para enviar mensaje */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h4 className="text-lg font-bold mb-2">Enviar mensaje al vendedor</h4>
            {enviado ? (
              <>
                <div className="text-green-600 font-semibold mb-4">Mensaje enviado correctamente.</div>
                <div className="flex gap-2 justify-end">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => { setShowModal(false); setEnviado(false); setMensaje(""); }}>
                    Cerrar
                  </button>
                </div>
              </>
            ) : (
              <>
                <textarea
                  className="w-full border rounded p-2 mb-4"
                  rows={3}
                  placeholder="Escribe tu mensaje..."
                  value={mensaje}
                  onChange={e => setMensaje(e.target.value)}
                  disabled={enviando}
                />
                <div className="flex gap-2 justify-end">
                  <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowModal(false)} disabled={enviando}>Cancelar</button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleEnviarMensaje} disabled={enviando || !mensaje}>
                    {enviando ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default FavorCard;
