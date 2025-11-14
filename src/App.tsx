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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
