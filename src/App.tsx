import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Student from "./pages/Student";
import Professor from "./pages/Professor";
import NotFound from "./pages/NotFound";
import Pedidos from "./pages/Pedidos";
import CrearPedido from "./pages/CrearPedido";
import VerPedido from "./pages/VerPedido";
import Notificaciones from "./pages/Notificaciones";
import Clientes from "./pages/Clientes";
import Favores from "./pages/Favores";
import Productos from "./pages/Productos";
import RegistroVendedor from "./pages/RegistroVendedor";
import CrearProducto from "./pages/CrearProducto";
import CrearFavor from "./pages/CrearFavor";
import MisProductos from "./pages/MisProductos";
import MisFavores from "./pages/MisFavores";
import EditarItem from "./pages/EditarItem";
import { CartProvider } from "./context/CartContext";
import FloatingCart from "@/components/FloatingCart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <FloatingCart />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/student" element={<Student />} />
            <Route path="/professor" element={<Professor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}

            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/pedidos/nuevo" element={<CrearPedido />} />
            <Route path="/pedidos/:id" element={<VerPedido />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/favores" element={<Favores />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/registro-vendedor" element={<RegistroVendedor />} />
            <Route path="/crear-producto" element={<CrearProducto />} />
            <Route path="/crear-favor" element={<CrearFavor />} />
            <Route path="/mis-productos" element={<MisProductos />} />
            <Route path="/mis-favores" element={<MisFavores />} />
            <Route path="/editar-item/:tipo/:id" element={<EditarItem />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
