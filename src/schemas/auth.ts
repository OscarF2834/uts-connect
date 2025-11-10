// src/schemas/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo no válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Correo no válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  password_confirmation: z.string().min(6, "Mínimo 6 caracteres"),
});

export type RegisterData = z.infer<typeof registerSchema>;
