// src/pages/Auth.tsx

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  loginSchema,
  registerSchema,
  type LoginData,
  type RegisterData,
} from "@/schemas/auth";

import { useAuth } from "@/hooks/use-auth";
import { isAuthenticated } from "@/lib/auth";

import { GraduationCap, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

const Auth = () => {
  const [active, setActive] = useState("login");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) navigate("/");
  }, []);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginData) => {
    const res = await login(data);
    if (!res.ok) {
      setError(res.message || "Error al iniciar sesión");
      return;
    }
    navigate("/");
  };

  const onRegister = async (data: RegisterData) => {
    const res = await register({ ...data, role: "student" });
    if (!res.ok) {
      setError(res.message || "No se pudo registrar");
      return;
    }
    navigate("/");
  };
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://productosgourmet.online/blog/wp-content/uploads/2017/04/como-distinguir-un-buen-cafe-1.png')`
      }}
    >
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 items-center justify-center bg-primary rounded-xl mb-3">
            <GraduationCap className="w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">RappiUts</h1>
        </div>

        <Card>
          <CardHeader>
            <Tabs value={active} onValueChange={setActive}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">
                {error}
              </p>
            )}

            <Tabs value={active}>
              {/* LOGIN */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLogin)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      {isLoading ? "Cargando..." : "Entrar"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* REGISTER */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegister)}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
  control={registerForm.control}
  name="password_confirmation"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Confirmar Contraseña</FormLabel>
      <FormControl>
        <Input {...field} type="password" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


                    <Button type="submit" className="w-full">
                      {isLoading ? "Creando..." : "Registrar"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Auth;
