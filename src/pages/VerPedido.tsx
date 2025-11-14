import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Pedido {
  id: number;
  descripcion: string;
  recompensa: number | null;
  estado: string;
  user: {
    name: string;
  };
}

const VerPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    axios.get(`/favores/${id}`).then((res) => setPedido(res.data));
  }, [id]);

  const eliminar = () => {
    axios.delete(`/favores/${id}`).then(() => navigate("/pedidos"));
  };

  if (!pedido) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Detalle del Pedido</CardTitle>
        </CardHeader>

        <CardContent>
          <p><strong>Descripción:</strong> {pedido.descripcion}</p>
          <p><strong>Estado:</strong> {pedido.estado}</p>
          <p><strong>Recompensa:</strong> {pedido.recompensa ?? "Ninguna"}</p>
          <p><strong>Solicitado por:</strong> {pedido.user?.name}</p>

          <div className="flex gap-4 mt-6">
            <Button variant="destructive" onClick={eliminar}>
              Eliminar
            </Button>
            <Button variant="outline" onClick={() => navigate("/pedidos")}>
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerPedido;
