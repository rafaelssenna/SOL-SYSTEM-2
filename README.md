# SOL System - Monorepo

Sistema de Otimização de Logística - Plataforma inteligente de compras corporativas com IA.

## 🏗️ Arquitetura Turborepo

Este projeto utiliza [Turborepo](https://turbo.build) para gerenciar um monorepo moderno e eficiente.

```
SOL-SYSTEM/
├── apps/
│   └── web/                    # Aplicação Next.js principal
│       ├── src/
│       │   ├── app/            # App Router (Next.js 15)
│       │   ├── components/     # Componentes React
│       │   ├── services/       # API clients
│       │   ├── store/          # Zustand stores
│       │   ├── types/          # TypeScript types
│       │   └── lib/            # Utilitários
│       └── package.json
├── packages/                   # Pacotes compartilhados (futuro)
│   ├── ui/                     # Componentes UI reutilizáveis
│   ├── types/                  # Tipos compartilhados
│   └── config/                 # Configurações compartilhadas
├── turbo.json                  # Configuração Turborepo
└── package.json                # Workspace raiz
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+
- npm 10+

### Instalação

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp apps/web/.env.example apps/web/.env.local

# Rodar em desenvolvimento
npm run dev
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia dev server (Turbo)
npm run dev:web          # Inicia apenas apps/web

# Build
npm run build            # Build de produção (Turbo)

# Lint
npm run lint             # ESLint em todos os apps

# Database (Prisma)
npm run db:generate      # Gera Prisma Client
npm run db:push          # Sincroniza schema com DB
npm run db:migrate       # Roda migrações
npm run db:studio        # Abre Prisma Studio

# Utilitários
npm run clean            # Limpa node_modules e caches
npm run format           # Formata código com Prettier
```

## 🎨 Stack Tecnológica

### Frontend
- **Framework**: Next.js 15.1.3 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5+
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **State**: Zustand 5+
- **Query**: TanStack React Query 5+
- **Forms**: React Hook Form + Zod

### Backend (API Externa)
- **URL**: https://sol-backend-production.up.railway.app
- **Tech**: Next.js API Routes + tRPC
- **Database**: PostgreSQL + Prisma
- **AI**: OpenAI GPT-4 Vision

### DevOps
- **Monorepo**: Turborepo 2.6+
- **Package Manager**: npm workspaces
- **Deploy**: Railway / Vercel
- **CI/CD**: GitHub Actions (configurar)

## 🔐 Variáveis de Ambiente

Crie `apps/web/.env.local`:

```env
# API Backend
NEXT_PUBLIC_API_URL=https://sol-backend-production.up.railway.app

# Database (se rodar localmente)
DATABASE_URL=postgresql://user:password@localhost:5432/sol_db

# OpenAI (se rodar localmente)
OPENAI_API_KEY=sk-...

# NextAuth (se implementar)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-aqui
```

## 📦 Estrutura do App Web

### Rotas

```
apps/web/src/app/
├── (auth)/                 # Grupo de rotas de autenticação
│   ├── login/              # Página de login
│   └── register/           # Página de registro
├── (dashboard)/            # Grupo de rotas autenticadas
│   ├── dashboard/          # Dashboard principal
│   ├── items/              # Gestão de itens
│   ├── suppliers/          # Gestão de fornecedores
│   ├── quotations/         # Cotações
│   ├── negotiations/       # Negociações
│   ├── search/             # Busca de mercado
│   ├── reports/            # Relatórios
│   └── settings/           # Configurações
├── layout.tsx              # Layout raiz
├── page.tsx                # Página inicial (redirect)
└── providers.tsx           # React Query + Theme providers
```

### Componentes

```
apps/web/src/components/
├── ui/                     # Componentes base (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
└── layout/                 # Componentes de layout
    └── sidebar.tsx
```

### Services (API)

```
apps/web/src/services/api.ts
├── authService             # Login, registro, me
├── itemsService            # CRUD de itens + identificação
├── suppliersService        # CRUD de fornecedores
├── quotationsService       # Cotações
├── negotiationsService     # Negociações automáticas
├── analyticsService        # Dashboard e métricas
├── marketSearchService     # Busca em marketplaces
├── webSearchService        # Busca web com OpenAI
└── cashGuardianService     # IA de economia
```

## 🎯 Funcionalidades Principais

### 1. Identificação Automática
- 📸 **Por Foto**: GPT-4 Vision identifica produto
- ✍️ **Por Descrição**: NLP extrai especificações
- 📄 **Por Arquivo**: Analisa PDFs e desenhos técnicos

### 2. Busca Inteligente de Mercado
- 🔍 Busca em e-commerces e marketplaces
- 🤖 IA compara preços e qualidade
- 📍 Busca fornecedores locais em tempo real

### 3. Negociação Automática
- 💬 Negocia via WhatsApp/Email
- 🎯 Define metas de desconto
- 📊 Histórico completo de conversas

### 4. Cash Guardian (IA Financeira)
- 💰 Analisa se compra é necessária
- ⚠️ Alerta sobre preços suspeitos
- 📈 Sugere melhor momento para comprar
- 🔍 Detecta oportunidades de economia

### 5. Analytics e Compliance
- 📊 Dashboard executivo
- 💾 Rastreabilidade total
- 🚨 Alertas de fraude
- 📑 Relatórios em PDF

## 🔧 Desenvolvimento

### Adicionar Nova Página

```bash
# Criar nova rota
mkdir apps/web/src/app/(dashboard)/nova-pagina
touch apps/web/src/app/(dashboard)/nova-pagina/page.tsx
```

### Adicionar Novo Componente

```bash
# Criar componente UI
touch apps/web/src/components/ui/novo-componente.tsx
```

### Adicionar Novo Service

```typescript
// Em apps/web/src/services/api.ts
export const novoService = {
  list: async () => {
    const response = await api.get("/api/novo");
    return response.data;
  },
};
```

## 📚 Migração do Código Antigo

Os arquivos do projeto anterior (`src/`) foram migrados para:

- `src/app/*` → `apps/web/src/app/*`
- `src/components/*` → `apps/web/src/components/*`
- `src/services/*` → `apps/web/src/services/*`
- `src/store/*` → `apps/web/src/store/*`
- `src/types/*` → `apps/web/src/types/*`
- `src/lib/*` → `apps/web/src/lib/*`

## 🎨 Design System (Em Desenvolvimento)

Planejamento futuro:
- `packages/ui` - Componentes compartilhados
- `packages/types` - Tipos TypeScript
- `packages/config` - ESLint, Tailwind, etc.

## 🐛 Debug

```bash
# Ver build cache do Turbo
npx turbo run build --dry=json

# Limpar cache do Turbo
npx turbo clean

# Ver dependências do workspace
npm ls --workspaces
```

## 📖 Documentação

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch (`git checkout -b feature/nome`)
3. Commit suas mudanças (`git commit -m 'Add feature'`)
4. Push para a branch (`git push origin feature/nome`)
5. Abra um Pull Request

## 📄 Licença

Privado - SOL System

---

**Desenvolvido com ❤️ pela equipe SOL**
