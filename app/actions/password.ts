"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validations";
import { hash, compare } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { DEFAULT_USER_PASSWORD } from "@/lib/constants";

export async function changeOwnPassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Não autorizado" };

  const rawData = Object.fromEntries(formData.entries());
  const validated = changePasswordSchema.safeParse(rawData);

  // Retorna o primeiro erro de validação do Zod, se houver
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { currentPassword, newPassword } = validated.data;
  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "Usuário não encontrado" };

    const isCurrentValid = await compare(currentPassword, user.password);
    if (!isCurrentValid) return { error: "A senha atual está incorreta" };

    // IMPEDE QUE O USUÁRIO DEFINA A SENHA PADRÃO NOVAMENTE
    // Verifica se DEFAULT_USER_PASSWORD existe para evitar erro de comparação
    if (DEFAULT_USER_PASSWORD && newPassword === DEFAULT_USER_PASSWORD) {
      return {
        error:
          "Você não pode definir a senha padrão como sua senha permanente.",
      };
    }

    const hashedPassword = await hash(newPassword, 12);

    // Atualiza APENAS a senha
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return { error: "Erro interno ao atualizar senha" };
  }
}

export async function adminResetPassword(targetUserId: string) {
  const session = await getServerSession(authOptions);

  // Apenas ADMIN pode resetar senhas de outros
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Permissão negada" };
  }

  // Segurança: Se a senha padrão não estiver carregada (erro de .env), aborta
  if (!DEFAULT_USER_PASSWORD) {
    return {
      error: "Erro de configuração: Senha padrão não definida no sistema.",
    };
  }

  try {
    const hashedPassword = await hash(DEFAULT_USER_PASSWORD, 12);

    await prisma.user.update({
      where: { id: targetUserId },
      data: { password: hashedPassword },
    });

    revalidatePath(`/admin/usuarios`);

    return {
      success: true,
      message: `Senha resetada para: ${DEFAULT_USER_PASSWORD}`,
    };
  } catch (error) {
    console.error("Erro ao resetar senha:", error);
    return { error: "Erro ao resetar senha" };
  }
}
