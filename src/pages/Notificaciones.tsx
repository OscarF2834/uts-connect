import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "../lib/auth";
import { useNavigate } from "react-router-dom";

// URL base del backend
const API_URL = "http://127.0.0.1:8000/api";

interface Notificacion {
  id: number;
  mensaje: string;
  fecha_envio: string;
  leida: boolean;
  estado?: string;
  user_id: number;
  destinatario_id: number;
}

const Notificaciones = () => {
  const navigate = useNavigate();

  // Guardar usuario una sola vez
  const [usuario] = useState(() => getUser());

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [modalId, setModalId] = useState<number | null>(null);
  const [accion, setAccion] = useState<"aceptada" | "rechazada" | null>(null);

  /** 📌 Formatear fecha para Laravel (Y-m-d H:i:s) */
  const fechaLaravel = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  };

  /** 📌 Cargar notificaciones */
  useEffect(() => {
    if (!usuario) return;

    setLoading(true);

    axios
      .get(`${API_URL}/notificaciones/destinatario/${usuario.id}`)
      .then((res) => {
        setNotificaciones(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error cargando notificaciones:", err);
        setNotificaciones([]);
      })
      .finally(() => setLoading(false));
  }, [usuario]);

  /** 📌 Abrir modal */
  const abrirModal = (id: number, tipo: "aceptada" | "rechazada") => {
    setModalId(id);
    setAccion(tipo);
    setRespuesta("");
  };

  /** 📌 Ejecutar acción Aceptar / Rechazar */
  const handleAccion = async () => {
    if (!modalId || !accion || !usuario) return;

    setLoading(true);

    const notiOriginal = notificaciones.find((n) => n.id === modalId);
    if (!notiOriginal) {
      alert("Error: la notificación ya no está disponible.");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Actualiza notificación original
      await axios.put(`${API_URL}/notificaciones/${modalId}`, {
        estado: accion,
        leida: true,
        respuesta: respuesta,
      });

      // Actualizar UI
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id === modalId ? { ...n, estado: accion, leida: true } : n
        )
      );

      // 2️⃣ Crear notificación para el cliente
      await axios.post(`${API_URL}/notificaciones`, {
        user_id: usuario.id,
        destinatario_id: notiOriginal.user_id,
        mensaje: `Tu solicitud fue ${accion}. Respuesta: ${respuesta}`,
        fecha_envio: fechaLaravel(),
        leida: false,
        estado: accion,
      });
    } catch (error) {
      console.error("Error enviando respuesta:", error);
      alert("Hubo un problema enviando la respuesta.");
    }

    setLoading(false);
    setModalId(null);
    setAccion(null);
    setRespuesta("");
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notificaciones</h1>

        {/* Botón regresar */}
        <button
          onClick={() => navigate("/student")}
          className="px-4 py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-700 transition"
        >
          Regresar
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Sin notificaciones */}
      {!loading && notificaciones.length === 0 && (
        <p className="text-gray-500 text-lg text-center py-12">
          No tienes notificaciones por el momento.
        </p>
      )}

      {/* Lista */}
      <div className="space-y-4">
        {notificaciones.map((n) => (
          <Card key={n.id} className={!n.leida ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="text-lg">{n.mensaje}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                {new Date(n.fecha_envio).toLocaleString()}
              </p>

              {n.estado === "pendiente" || !n.estado ? (
                <div className="mt-2 flex gap-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    disabled={loading}
                    onClick={() => abrirModal(n.id, "aceptada")}
                  >
                    Aceptar
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    disabled={loading}
                    onClick={() => abrirModal(n.id, "rechazada")}
                  >
                    Rechazar
                  </button>
                </div>
              ) : (
                <div
                  className={`mt-2 font-bold ${
                    n.estado === "aceptada" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {n.estado === "aceptada"
                    ? "Solicitud aceptada"
                    : "Solicitud rechazada"}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {modalId && accion && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h4 className="text-lg font-bold mb-2">
              Respuesta al cliente ({accion})
            </h4>

            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={3}
              placeholder="Escribe tu respuesta..."
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              disabled={loading}
            />

            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setModalId(null);
                  setAccion(null);
                }}
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                onClick={handleAccion}
                disabled={loading || !respuesta}
              >
                {loading ? "Enviando..." : "Enviar respuesta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
