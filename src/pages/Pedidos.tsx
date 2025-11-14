import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { host } from "@/data/login";

interface Pedido {
  id: number;
  descripcion: string;
  recompensa: number | null;
  estado: string;
  user: {
    name: string;
  };
}

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
  axios.get(`${host}/favores`)
    .then((res) => setPedidos(res.data))
    .catch((err) => console.error(err));
}, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Pedidos</h1>

        <Button onClick={() => navigate("/pedidos/nuevo")}>
          Crear Pedido
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pedidos.map((p) => (
          <Card
            key={p.id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/pedidos/${p.id}`)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{p.descripcion}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Estado:</strong> {p.estado}</p>
              <p><strong>Recompensa:</strong> {p.recompensa ?? "Ninguna"}</p>
              <p className="text-muted-foreground text-sm">
                Creado por: {p.user?.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pedidos;
