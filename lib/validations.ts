import { z } from "zod";

// =========================================
// SCHEMAS EXISTENTES
// =========================================

// Schema para Login
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

// Schema para Contato (Lead)
export const leadSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(), // Aceita string vazia ou undefined
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres"),
});

// Schema para Visita
export const visitSchema = z.object({
  propertyId: z.string(), // Retirado .cuid() para ser mais permissivo com IDs legados se houver
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
  timeOfDay: z.enum(["MANHA", "TARDE"]),
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  phone: z.string().or(z.literal("")).optional(), // Aceita explicitamente string vazia ""
});

// =========================================
// NOVOS SCHEMAS (Gestão de Senha)
// =========================================

// Regras de complexidade da senha (usado na validação da nova senha)
export const passwordSchema = z
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "Deve conter pelo menos um número")
  .regex(
    /[^A-Za-z0-9]/,
    "Deve conter pelo menos um caractere especial (!@#$%^&*)",
  );

// Schema para o formulário de troca de senha (Server Action)
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirmação é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "A nova senha não pode ser igual à atual",
    path: ["newPassword"],
  });
