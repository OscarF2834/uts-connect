import { useEffect, useState } from "react";

import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Notificacion {
  id: number;
  mensaje: string;
  fecha_envio: string;
  leida: boolean;
  estado?: string;
  user_id?: number;
  solicitud_user_id?: number; // id del cliente que hizo la solicitud
}

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [modalId, setModalId] = useState<number | null>(null);
  const [accion, setAccion] = useState<"aceptada" | "rechazada" | null>(null);

  useEffect(() => {
    setLoading(true);
    axios.get("/notificaciones").then((res) => {
      setNotificaciones(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    });
  }, []);

  const abrirModal = (id: number, tipo: "aceptada" | "rechazada") => {
    setModalId(id);
    setAccion(tipo);
    setRespuesta("");
  };

  const handleAccion = async () => {
    if (modalId == null || !accion) return;
    setLoading(true);
    // Actualiza la notificación original
    await axios.put(`/notificaciones/${modalId}`, { estado: accion, leida: true });
    setNotificaciones((prev) => prev.map(n => n.id === modalId ? { ...n, estado: accion, leida: true } : n));
    // Envía notificación al cliente
    const noti = notificaciones.find(n => n.id === modalId);
    if (noti && noti.solicitud_user_id) {
      await axios.post("/notificaciones", {
        user_id: noti.solicitud_user_id,
        mensaje: `Tu solicitud fue ${accion}. Respuesta: ${respuesta}`,
        fecha_envio: new Date().toISOString(),
        leida: false,
        estado: accion
      });
    }
    setLoading(false);
    setModalId(null);
    setAccion(null);
    setRespuesta("");
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Notificaciones</h1>
      <div className="space-y-4">
        {notificaciones.map((n) => (
          <Card key={n.id} className={n.leida ? "" : "border-primary"}>
            <CardHeader>
              <CardTitle className="text-lg">{n.mensaje}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {new Date(n.fecha_envio).toLocaleString()}
              </p>
              {n.estado === "pendiente" || !n.estado ? (
                <div className="mt-2 flex gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded" disabled={loading} onClick={() => abrirModal(n.id, "aceptada")}>Aceptar</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded" disabled={loading} onClick={() => abrirModal(n.id, "rechazada")}>Rechazar</button>
                </div>
              ) : (
                <div className={`mt-2 font-bold ${n.estado === "aceptada" ? "text-green-600" : "text-red-600"}`}>
                  {n.estado === "aceptada" ? "Solicitud aceptada" : "Solicitud rechazada"}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Modal para respuesta */}
      {modalId && accion && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h4 className="text-lg font-bold mb-2">Respuesta al cliente</h4>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={3}
              placeholder="Escribe tu respuesta..."
              value={respuesta}
              onChange={e => setRespuesta(e.target.value)}
              disabled={loading}
            />
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => { setModalId(null); setAccion(null); }} disabled={loading}>Cancelar</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleAccion} disabled={loading || !respuesta}>
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
