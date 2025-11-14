import axios from "axios";
import { getToken } from "@/lib/auth";
import { host } from "@/data/login";

const api = axios.create({
  baseURL: host, // ej: http://127.0.0.1:8000/api
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
