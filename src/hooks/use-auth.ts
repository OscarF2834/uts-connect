// src/hooks/use-auth.ts

import { useState } from "react";
import api from "@/services/api";
import { setToken, setUser, clearSession } from "@/lib/auth";
import type { LoginData, RegisterData } from "@/schemas/auth";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  // LOGIN
  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);

      const res = await api.post("/login", data);

      setToken(res.data.token);
      setUser({
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role?.name ?? "student",
      });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, message: error.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER
  const register = async (data: RegisterData & { role: string }) => {
    try {
      setIsLoading(true);
      console.log("📦 Datos enviados al backend (/register):", data);

      const res = await api.post("/register", data);

      setToken(res.data.token);
      setUser({
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role?.name ?? "student",
      });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, message: error.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    clearSession();
    window.location.href = "/auth";
  };

  return {
    login,
    register,
    logout,
    isLoading,
  };
};
