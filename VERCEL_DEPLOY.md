# 🚀 Guia de Deploy no Vercel

## ✅ Git Push Completo!

Seu código foi enviado para:
**https://github.com/rafaelssenna/SOL-SYSTEM-2**

---

## 📋 Passos para Deploy no Vercel

### Opção 1: Via Vercel Dashboard (Recomendado)

1. **Acesse**: https://vercel.com/new

2. **Import Git Repository**:
   - Clique em "Import Project"
   - Conecte sua conta do GitHub
   - Selecione: `rafaelssenna/SOL-SYSTEM-2`

3. **Configure o Projeto**:
   ```
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: cd ../.. && turbo build --filter=@sol/web
   Output Directory: apps/web/.next
   Install Command: npm install
   ```

4. **Environment Variables** (Adicionar):
   ```
   NEXT_PUBLIC_API_URL=https://sol-backend-production.up.railway.app
   ```

5. **Deploy**:
   - Clique em "Deploy"
   - Aguarde ~2-3 minutos

6. **Acesse**:
   - Sua URL será: `https://sol-system-2.vercel.app` (ou similar)

---

### Opção 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd c:\Users\mjaco\Desktop\SOL\SOL---FRONTEND-main
vercel

# Seguir prompts:
# - Set up and deploy? Y
# - Which scope? (sua conta)
# - Link to existing project? N
# - Project name: sol-system-2
# - In which directory is your code located? apps/web
# - Want to override settings? Y
#   - Build Command: turbo build --filter=@sol/web
#   - Output Directory: .next
#   - Development Command: turbo dev --filter=@sol/web

# Deploy em produção
vercel --prod
```

---

## ⚙️ Configuração Avançada (vercel.json)

Se quiser, crie um `vercel.json` na raiz:

```json
{
  "buildCommand": "cd apps/web && npm run build",
  "devCommand": "cd apps/web && npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next"
}
```

---

## 🔧 Troubleshooting

### Erro: "Module not found"
**Solução**: Verificar se todas as dependências estão no `apps/web/package.json`

### Erro: "Build failed"
**Solução**:
1. Limpar cache no Vercel Dashboard
2. Verificar Build Command: `turbo build --filter=@sol/web`
3. Root Directory deve ser: `apps/web`

### Erro: "Cannot find workspace"
**Solução**:
- Build Command deve ser: `cd ../.. && turbo build --filter=@sol/web`
- Ou usar Root Directory como `.` (raiz do repo)

---

## 🎯 Após o Deploy

1. **Teste o Login**: Acesse `/login` na URL do Vercel
2. **Teste o Dashboard**: Faça login e veja se carrega
3. **Verifique API**: Certifique-se que está conectando ao Railway

---

## 📊 URLs Esperadas

- **Frontend Vercel**: https://sol-system-2.vercel.app
- **Backend Railway**: https://sol-backend-production.up.railway.app
- **GitHub Repo**: https://github.com/rafaelssenna/SOL-SYSTEM-2

---

## 🔄 Próximos Deploys

Após o primeiro deploy, qualquer push para `main` fará deploy automático!

```bash
# Fazer mudanças
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Vercel vai detectar e fazer deploy automaticamente! 🚀
```

---

**Deploy realizado com sucesso! 🎉**

*Tempo estimado total: 2-5 minutos*
