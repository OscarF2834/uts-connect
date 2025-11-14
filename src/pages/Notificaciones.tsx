import { useEffect, useState } from "react";

import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Notificacion {
  id: number;
  mensaje: string;
  fecha_envio: string;
  leida: boolean;
}

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    axios.get("/notificaciones").then((res) => setNotificaciones(res.data));
  }, []);

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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notificaciones;
