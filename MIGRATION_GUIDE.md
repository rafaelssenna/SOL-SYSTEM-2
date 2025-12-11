# 🚀 Guia de Migração - Turborepo

## ✅ O que foi feito

### 1. Estrutura do Monorepo
- ✅ Criado package.json raiz com workspaces
- ✅ Configurado turbo.json com tasks otimizadas
- ✅ Criado diretório `apps/web/` para aplicação principal
- ✅ Criado diretório `packages/` para código compartilhado

### 2. Migração do Código
Todos os arquivos foram migrados de `src/` para `apps/web/src/`:

- ✅ `src/app/*` → `apps/web/src/app/*`
- ✅ `src/components/*` → `apps/web/src/components/*`
- ✅ `src/services/*` → `apps/web/src/services/*`
- ✅ `src/store/*` → `apps/web/src/store/*`
- ✅ `src/types/*` → `apps/web/src/types/*`
- ✅ `src/lib/*` → `apps/web/src/lib/*`

### 3. Configuração
- ✅ package.json do apps/web com todas dependências
- ✅ next.config.ts atualizado
- ✅ tsconfig.json configurado
- ✅ tailwind.config.ts com design system moderno
- ✅ .env.example criado
- ✅ .gitignore atualizado
- ✅ eslint.config.mjs configurado

### 4. Melhorias no Código
- ✅ globals.css moderno com dark mode
- ✅ layout.tsx com fonts Google otimizadas
- ✅ providers.tsx com React Query e Theme
- ✅ api.ts usando variável de ambiente
- ✅ auth store com SSR safety

## 📋 Próximos Passos

### Passo 1: Instalar Dependências

```bash
# Na raiz do projeto
cd c:\Users\mjaco\Desktop\SOL\SOL---FRONTEND-main

# Limpar node_modules antigos (opcional)
rm -rf node_modules package-lock.json

# Instalar com npm workspaces
npm install

# Isso vai instalar:
# - Turbo na raiz
# - Todas as dependências do apps/web
```

### Passo 2: Configurar Variáveis de Ambiente

```bash
# Copiar .env.example
cp apps/web/.env.example apps/web/.env.local

# Editar .env.local com suas credenciais
# (VSCode ou seu editor favorito)
```

### Passo 3: Rodar em Desenvolvimento

```bash
# Rodar com Turbo (recomendado)
npm run dev

# Ou apenas o apps/web
cd apps/web
npm run dev
```

### Passo 4: Testar Build

```bash
# Build de produção
npm run build

# Testar produção localmente
npm run start
```

## 🔧 Resolução de Problemas

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules apps/web/node_modules
npm install
```

### Erro: "Turbo not found"
```bash
# Instalar turbo globalmente (opcional)
npm install -g turbo

# Ou usar via npx
npx turbo dev
```

### Erro no Tailwind CSS
```bash
# Rebuild do Tailwind
cd apps/web
npm run build
```

### Port 3000 já em uso
```bash
# Matar processo na porta 3000
npx kill-port 3000

# Ou usar outra porta
PORT=3001 npm run dev
```

## 🎨 Estrutura de Imports

### Antes (código antigo)
```typescript
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { cn } from "@/lib/utils";
```

### Depois (Turborepo)
```typescript
// Continua igual! O @ aponta para apps/web/src
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { cn } from "@/lib/utils";

// No futuro, pacotes compartilhados:
import { Button } from "@sol/ui";
import { User } from "@sol/types";
```

## 📦 Adicionar Novo Package Compartilhado

```bash
# Criar novo package
mkdir -p packages/ui
cd packages/ui

# Criar package.json
npm init -y

# Configurar como workspace
# (adicionar em package.json raiz workspaces)
```

## 🚀 Deploy

### Railway (Frontend Atual)
```bash
# Build command
npm run build --filter=@sol/web

# Start command
npm run start --filter=@sol/web

# Root directory
/
```

### Vercel
```bash
# Root directory: apps/web
# Build command: turbo build --filter=@sol/web
# Output directory: apps/web/.next
```

## 🔄 Comparação: Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Estrutura** | Single app | Monorepo |
| **Package Manager** | npm padrão | npm workspaces |
| **Build Tool** | Next.js | Turborepo + Next.js |
| **Cache** | Apenas Next.js | Turbo + Next.js |
| **Packages Compartilhados** | ❌ | ✅ (preparado) |
| **TypeScript** | Projeto único | Workspace completo |
| **Escalabilidade** | Limitada | Excelente |

## 📈 Benefícios do Turborepo

1. **Build Cache Inteligente**: Turbo só rebuilda o que mudou
2. **Execução Paralela**: Tasks rodam simultaneamente
3. **Packages Compartilhados**: Reutilize código entre apps
4. **Monorepo Moderno**: Gerenciamento simplificado
5. **Melhor DX**: Developer Experience aprimorada

## 🎯 Roadmap

- ✅ Configuração inicial do Turbo
- ✅ Migração do código existente
- ⏳ Criação de `packages/ui`
- ⏳ Criação de `packages/types`
- ⏳ Criação de `packages/config`
- ⏳ Setup do Prisma (se backend local)
- ⏳ Setup do tRPC (se backend local)
- ⏳ Refatoração completa da UI
- ⏳ Testes automatizados
- ⏳ CI/CD com GitHub Actions

## 💡 Dicas

1. **Use `turbo` para tudo**: `turbo dev`, `turbo build`, `turbo lint`
2. **Filter específico**: `turbo build --filter=@sol/web`
3. **Limpe o cache**: `turbo clean` se algo estranho acontecer
4. **Docs do Turbo**: https://turbo.build/repo/docs

## 🆘 Suporte

Se encontrar problemas:
1. Veja a documentação do Turborepo
2. Verifique os logs de erro
3. Tente limpar caches e reinstalar
4. Abra uma issue no repositório

---

**Migração concluída com sucesso! 🎉**
