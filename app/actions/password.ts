"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validations";
import { hash, compare } from "bcryptjs";
import { revalidatePath } from "next/cache";

const DEFAULT_PASSWORD = "Mat026!";

export async function changeOwnPassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Não autorizado" };

  const rawData = Object.fromEntries(formData.entries());
  const validated = changePasswordSchema.safeParse(rawData);

  // CORREÇÃO AQUI: Troquei .errors por .issues
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
    if (newPassword === DEFAULT_PASSWORD) {
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
    return { error: "Erro interno ao atualizar senha" };
  }
}

export async function adminResetPassword(targetUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return { error: "Permissão negada" };

  try {
    const hashedPassword = await hash(DEFAULT_PASSWORD, 12);

    await prisma.user.update({
      where: { id: targetUserId },
      data: { password: hashedPassword },
    });

    revalidatePath(`/admin/usuarios`);
    return {
      success: true,
      message: `Senha resetada para ${DEFAULT_PASSWORD}`,
    };
  } catch (error) {
    return { error: "Erro ao resetar senha" };
  }
}
