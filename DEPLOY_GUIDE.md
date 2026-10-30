# Guia Completo de Deploy - UBlue TV no Vercel

## 📋 Pré-requisitos

1. **Git** instalado
2. **Node.js 18+** instalado
3. Conta no **GitHub**
4. Conta no **Vercel** (gratuita)

---

## 1️⃣ Instalar Git (Windows)

### Opção A: Winget (Recomendado)
```powershell
# Abra PowerShell como Administrador
winget install --id Git.Git -e --source winget
```

### Opção B: Instalador Manual
1. Baixe em: https://git-scm.com/download/win
2. Execute o instalador
3. **Importante**: Marque "Git from the command line and also from 3rd-party software"
4. Reinicie o terminal/PowerShell

### Verifique a instalação:
```powershell
git --version
# Deve mostrar: git version 2.x.x
```

---

## 2️⃣ Configurar Repositório Local

Na pasta do projeto (`D:\888\universo-blue-ultimate`):

```powershell
# Inicializa git
git init
git branch -M main

# Configura usuário (ajuste seus dados)
git config user.name "Seu Nome"
git config user.email "seu@email.com"

# Adiciona todos os arquivos
git add .

# Primeiro commit
git commit -m "feat: Initial commit - UBlue TV Platform"
```

---

## 3️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. **Repository name**: `universo-blue-ultimate`
3. **Description**: `UBlue TV - Plataforma OTT completa para Moçambique e mundo lusófono`
4. **Visibility**: Public ou Private (sua escolha)
5. **NÃO marque**: "Add a README file", "Add .gitignore", "Choose a license"
6. Clique em **Create repository**

---

## 4️⃣ Conectar e Fazer Push

```powershell
# Adiciona remote (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/universo-blue-ultimate.git

# Verifica
git remote -v

# Push inicial
git push -u origin main
```

---

## 5️⃣ Deploy no Vercel

### Método 1: Via Dashboard Vercel (Mais Fácil)

1. Acesse: https://vercel.com
2. Login com GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Selecione `universo-blue-ultimate` → **Import**
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`
6. **Environment Variables** (adicione todas):
   ```
   VITE_TMDB_API_KEY=sua_chave_tmdb
   VITE_OMDB_API_KEY=sua_chave_omdb
   VITE_GEMINI_API_KEY=sua_chave_gemini
   VITE_REIDOSCANAIS_API_KEY=sua_chave_reidoscanais
   VITE_NETCOMBO_API_KEY=sua_chave_netcombo
   ```
7. Clique em **Deploy**
8. Aguarde ~2-3 minutos
9. ✅ **Pronto!** Sua URL será: `https://universo-blue-ultimate.vercel.app`

### Método 2: Via Vercel CLI

```powershell
# Instala CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 6️⃣ Configurar Auto-Deploy (GitHub Actions)

### No Vercel:
1. Acesse seu projeto no Vercel
2. Settings → **Git** → Conecte o repositório GitHub
3. Anote: **Project ID** e **Organization ID**

### No GitHub:
1. Repositório → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** (adicione 3):
   - `VERCEL_TOKEN` → Token de: https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` → Organization ID do Vercel
   - `VERCEL_PROJECT_ID` → Project ID do Vercel

### Resultado:
- Todo `push` para `main` → Deploy automático em produção
- Pull Requests → Deploy de preview

---

## 7️⃣ Configurar Domínio Personalizado (Opcional)

### No Vercel:
1. Project → **Settings** → **Domains**
2. **Add** → Digite seu domínio (ex: `tv.universoblue.co.mz`)
3. Configure DNS no seu provedor:
   - **A Record**: `@` → `76.76.21.21`
   - **CNAME**: `www` → `cname.vercel-dns.com`
4. Aguarde propagação (até 24h)

---

## 🔧 Variáveis de Ambiente Necessárias

| Variável | Obrigatória | Onde Obter |
|----------|-------------|------------|
| `VITE_TMDB_API_KEY` | Sim | https://www.themoviedb.org/settings/api |
| `VITE_OMDB_API_KEY` | Não | http://www.omdbapi.com/apikey.aspx |
| `VITE_GEMINI_API_KEY` | Sim | https://aistudio.google.com/app/apikey |
| `VITE_REIDOSCANAIS_API_KEY` | Não | https://reidoscanais.si |
| `VITE_NETCOMBO_API_KEY` | Não | NetCombo/Claro |

---

## 📁 Arquivos de Configuração Criados

| Arquivo | Função |
|---------|--------|
| `.gitignore` | Ignora node_modules, dist, .env, etc. |
| `vercel.json` | Configuração Vercel (rewrites, headers) |
| `.github/workflows/deploy.yml` | Auto-deploy via GitHub Actions |
| `.env.example` | Template de variáveis de ambiente |
| `deploy.bat` / `deploy.sh` | Script de deploy manual |
| `setup-git.bat` / `setup-git.sh` | Configuração inicial do Git |

---

## ✅ Checklist Final

- [ ] Git instalado e configurado
- [ ] Repositório no GitHub criado
- [ ] Push para GitHub feito
- [ ] Projeto importado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy funcionando
- [ ] GitHub Actions secrets configurados
- [ ] Domínio personalizado (opcional)
- [ ] Testar: Player HLS, Pagamentos, Tuner, AI Engine

---

## 🆘 Troubleshooting

### Build falha com erro de peer dependency
```bash
# Use legacy peer deps
npm install --legacy-peer-deps
```

### Erro de CORS no player
- Verifique se `/api/proxy-stream` e `/api/proxy-playlist` funcionam
- Logs no Vercel: Project → Functions → View Logs

### Variáveis de ambiente não carregam
- No Vercel: Settings → Environment Variables → Redeploy
- Prefixo obrigatório: `VITE_` para variáveis client-side

### Git push rejeitado
```bash
# Force push (cuidado!)
git push -u origin main --force
```

---

## 📞 Suporte

- **Issues**: https://github.com/SEU_USUARIO/universo-blue-ultimate/issues
- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev/guide/

---

**Última atualização**: 19/10/2026  
**Versão**: 1.0.0