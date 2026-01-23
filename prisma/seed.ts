import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Criptografar a senha padrão
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // 2. Criar o usuário Admin (usando upsert para não dar erro se já existir)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@imobiliaria.com' },
    update: {}, // Se já existe, não faz nada
    create: {
      email: 'admin@imobiliaria.com',
      name: 'Administrador Principal',
      password: hashedPassword,
      role: 'ADMIN', // Importante: String maiúscula conforme nossa lógica
    },
  })

  console.log('✅ Usuário Admin criado com sucesso:', admin)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })