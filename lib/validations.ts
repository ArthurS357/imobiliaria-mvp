import { z } from "zod";

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
    propertyId: z.string(), // <--- MUDANÇA: Removemos .cuid() para aceitar qualquer ID válido do banco
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
    timeOfDay: z.enum(["MANHA", "TARDE"]),
    name: z.string().min(2, "Nome muito curto"),
    email: z.string().email("Email inválido"),
    phone: z.string().or(z.literal("")).optional(), // <--- MUDANÇA: Aceita explicitamente string vazia ""
});