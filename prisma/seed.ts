import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Pega as credenciais das variáveis de ambiente (arquivo .env)
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Administrador Geral";

  // Se não tiver configurado no .env, avisa e não faz nada (segurança)
  if (!adminEmail || !adminPassword) {
    console.warn("⚠️  AVISO: ADMIN_EMAIL ou ADMIN_PASSWORD não definidos no .env.");
    console.warn("   -> O usuário Admin NÃO foi criado/atualizado.");
    console.warn("   -> Adicione essas variáveis no seu arquivo .env para configurar o acesso.");
    return;
  }

  const passwordHash = await hash(adminPassword, 10);

  // Cria ou atualiza o Admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordHash,
      role: "ADMIN",
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin configurado com sucesso: ${admin.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });