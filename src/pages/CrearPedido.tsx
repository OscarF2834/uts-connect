import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/auth";
import { host } from "@/data/login";

interface FormData {
  descripcion: string;
  recompensa: number | null;
}

const CrearPedido = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    axios
      .post(`${host}/favores`, {
        ...data,
        user_id: getUser(), // este debe ser EL ID
      })
      .then(() => navigate("/pedidos"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Crear Pedido</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <textarea
              {...register("descripcion", { required: true })}
              className="w-full p-2 border rounded"
              placeholder="Describe tu pedido"
            />

            <input
              type="number"
              {...register("recompensa")}
              placeholder="Recompensa (opcional)"
              className="w-full p-2 border rounded"
            />

            <Button type="submit" className="w-full">
              Crear Pedido
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrearPedido;
