// src/lib/auth.ts

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Guardar token
export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Obtener token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Guardar usuario
export const setUser = (user: any) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Obtener usuario
export const getUser = () => {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  return JSON.parse(data);
};

// Obtener nombre
export const getUserName = () => {
  return getUser()?.name || null;
};

// Obtener rol
export const getUserRole = () => {
  return getUser()?.role || null;
};

// ¿Está autenticado?
export const isAuthenticated = () => {
  return !!getToken();
};

// Cerrar sesión
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
