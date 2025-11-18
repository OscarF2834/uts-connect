import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Bell, PlusCircle, GraduationCap, LogOut, Package, HandHeart } from 'lucide-react';
import { isAuthenticated, getUserRole, getUserName, getUser } from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import AlertaProductoFavor from './AlertaProductoFavor';

const Student = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const userName = getUserName();
  const user = getUser();
  const [showAlerta, setShowAlerta] = useState<null | 'producto' | 'favor'>(null);
  const [hasEmprendimiento, setHasEmprendimiento] = useState(false);
  const [categoriaEmprendimiento, setCategoriaEmprendimiento] = useState("");

  useEffect(() => {
    if (!isAuthenticated() || getUserRole() !== 'vendedor') {
      navigate('/auth');
    }
    // Consultar si el usuario tiene emprendimiento usando el nuevo endpoint
    fetch(`http://127.0.0.1:8000/api/emprendimientos/user/${user.id}`)
      .then(r => r.json())
      .then(res => {
        if (res && res.length > 0) {
          setHasEmprendimiento(true);
          setCategoriaEmprendimiento(res[0].categoria);
        } else {
          setHasEmprendimiento(false);
        }
      });
  }, [navigate, user]);

  // Lógica para crear producto
  const handleCrearProducto = () => {
    if (hasEmprendimiento) {
      setShowAlerta('producto');
    } else {
      if (window.confirm('No tienes un emprendimiento registrado. ¿Deseas registrar uno ahora?')) {
        navigate('/registro-vendedor');
      } else {
        setShowAlerta('producto');
      }
    }
  };

  // Lógica para crear favor
  const handleCrearFavor = () => {
    setShowAlerta('favor');
  };

  // Acciones después de la alerta
  const onContinueAlerta = () => {
    if (showAlerta === 'producto') {
      if (hasEmprendimiento) {
        navigate('/crear-producto', { state: { categoria: categoriaEmprendimiento } });
      } else {
        navigate('/crear-producto');
      }
    } else if (showAlerta === 'favor') {
      navigate('/crear-favor');
    }
    setShowAlerta(null);
  };
  const onCancelAlerta = () => {
    setShowAlerta(null);
    navigate('/student');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Pedidos UTS</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Bienvenido, {userName || 'Vendedor'}
          </h2>
          <p className="text-muted-foreground">
            Gestiona tus productos, favores y notificaciones
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta agrupada para Productos */}
          <Card className="shadow-soft hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Package className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Productos</CardTitle>
              <CardDescription>Gestiona tus productos físicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleCrearProducto}>Crear Producto</Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/mis-productos')}>Ver Mis productos</Button>
              </div>
            </CardContent>
          </Card>
          {/* Tarjeta agrupada para Favores */}
          <Card className="shadow-soft hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <HandHeart className="w-8 h-8 text-secondary mb-2" />
              <CardTitle>Favores</CardTitle>
              <CardDescription>Gestiona tus favores y servicios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button variant="secondary" className="w-full" onClick={handleCrearFavor}>Crear Favor</Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/mis-favores')}>Ver Mis favores</Button>
              </div>
            </CardContent>
          </Card>
          {/* Notificaciones */}
          <Card className="shadow-soft hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/notificaciones')}>
            <CardHeader>
              <Bell className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Revisa tus mensajes y avisos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Ver Notificaciones</Button>
            </CardContent>
          </Card>
          {/* Tarjeta para Comprar Productos */}
          <Card className="shadow-soft hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/productos')}>
            <CardHeader>
              <Package className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Comprar Productos</CardTitle>
              <CardDescription>Explora y adquiere productos disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="success">Ir a Productos</Button>
            </CardContent>
          </Card>
          {/* Tarjeta para Adquirir un Favor */}
          <Card className="shadow-soft hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/favores')}>
            <CardHeader>
              <HandHeart className="w-8 h-8 text-pink-600 mb-2" />
              <CardTitle>Adquirir un Favor</CardTitle>
              <CardDescription>Solicita favores o servicios publicados</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">Ir a Favores</Button>
            </CardContent>
          </Card>
        </div>
        {showAlerta && (
          <AlertaProductoFavor onContinue={onContinueAlerta} onCancel={onCancelAlerta} />
        )}
      </main>
    </div>
  );
};

export default Student;
