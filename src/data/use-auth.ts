import { useState } from "react";
import { API } from "@/data/api";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data) => {
    try {
      setIsLoading(true);

      const res = await API.post("/login", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role.name);

      window.location.href = res.data.user.role.name === "professor"
        ? "/professor"
        : "/student";

    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    try {
      setIsLoading(true);

      const res = await API.post("/register", {
        ...data,
        role: "student"
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role.name);

      window.location.href = "/student";

    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.post("/logout");
    } catch (_) {}

    localStorage.clear();
    window.location.href = "/auth";
  };

  return { login, register, logout, isLoading };
}
