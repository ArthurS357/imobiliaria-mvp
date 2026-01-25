# 🏡 Imobiliária MVP

Sistema moderno para gestão e vitrine de imóveis, desenvolvido com as tecnologias mais recentes do ecossistema React. Focado em performance, SEO e experiência do usuário (UX).

![Project Status](https://img.shields.io/badge/status-concluído-green)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-purple)

## ✨ Funcionalidades

### 🔐 Painel Administrativo
- **Autenticação Segura:** Login via e-mail e senha com NextAuth.
- **Gestão de Imóveis:** CRUD completo (Criar, Ler, Atualizar, Deletar).
- **Controle de Status:** Fluxo de aprovação (Pendente -> Disponível -> Vendido).
- **Dashboard:** Métricas rápidas de total de imóveis e vendas.

### 🌍 Área Pública (Cliente)
- **Busca Inteligente:** Filtros por cidade, bairro e tipo de imóvel.
- **Design Responsivo:** Interface adaptada para Celulares, Tablets e Desktop.
- **Conversão:** Botão de WhatsApp integrado com mensagem personalizada.
- **Performance:** Carregamento otimizado com Server Components.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS.
- **Backend:** Next.js API Routes.
- **Banco de Dados:** SQLite (Ambiente Dev) com Prisma ORM.
- **Autenticação:** NextAuth.js v4.
- **Ícones:** Lucide React.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado.

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone [https://github.com/seu-usuario/imobiliaria-mvp.git](https://github.com/seu-usuario/imobiliaria-mvp.git)
   cd imobiliaria-mvp

```

2. **Instale as dependências**
```bash
npm install

```


3. **Configure o Banco de Dados**
```bash
# Gera o arquivo dev.db localmente
npx prisma db push

# Popula o banco com o usuário Admin inicial
npx prisma db seed

```


> **Admin Padrão:**


> * Email: `admin@imobiliaria.com`
> * Senha: `admin123`
> 
> 


4. **Inicie o Servidor**
```bash
npm run dev

```


Acesse `http://localhost:3000` no seu navegador.

## 📂 Estrutura do Projeto

* `/app`: Rotas e páginas (App Router).
* `/components`: Componentes reutilizáveis (Header, Cards, Footer).
* `/lib`: Configurações de serviços (Prisma, Auth).
* `/prisma`: Schema do banco de dados e scripts de seed.

---

Desenvolvido por **Arthur S.** 🚀

```
