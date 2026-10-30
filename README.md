# UBlue TV - Universo Blue

**O seu canal favorito, em qualquer lugar, a qualquer momento.**

Plataforma OTT completa de streaming de TV ao vivo, com canais nacionais de Moçambique, conteúdo internacional, Creator Hub, Business Center, Partner Network e UBlue AI Engine.

## 🚀 Funcionalidades Principais

- **Portal Principal** - Landing page com pacotes, canais em destaque, FAQ e roadmap
- **App de TV** - Player HLS com EPG, troca de canais, controle remoto virtual, sintonizador multi-fonte
- **Creator Hub** - Agendador 24/7, Sound Effects Studio, Open Broadcast Network, Media Enhancement
- **Business Center** - Publicidade, monetização, analytics
- **Partner Network** - Propostas de parceria globais (Google, Akamai, Cloudflare, Telecoms)
- **AI Engine Studio** - Geração de conteúdo com IA
- **UBlue Originals** - Conteúdo original exclusivo
- **IPTV Global Hub** - Integração com iptv-org (canais mundiais verificados)
- **Broadcast Atlas** - Emissoras de TV terrestres globais
- **TMDb & TVmaze Integration** - Filmes e séries favoritos
- **Rei dos Canais** - Esportes e canais brasileiros ao vivo
- **Finance Center** - Pagamentos M-Pesa/e-Mola, carteira digital, UBlue Pay Gateway
- **Media Ingestion Studio** - Robô de ingestão e verificação de streams (Pilar 1)

## 🛠 Stack Tecnológica

- **Frontend**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS 4 + @tailwindcss/vite
- **Streaming**: hls.js + CORS Proxy integrado
- **Payments**: M-Pesa, e-Mola, Cartão (simulado)
- **State**: React Hooks + LocalStorage
- **Deploy**: Vercel + GitHub Actions

## 📦 Instalação Local

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/universo-blue-ultimate.git
cd universo-blue-ultimate

# Instale dependências (usa legacy-peer-deps para compatibilidade)
npm install --legacy-peer-deps

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves de API

# Rode em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Type check
npm run lint
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz:

```env
# TMDB API (para filmes e séries)
VITE_TMDB_API_KEY=sua_chave_tmdb

# OMDb API (para metadados de TV)
VITE_OMDB_API_KEY=sua_chave_omdb

# Google Generative AI (para AI Engine)
VITE_GEMINI_API_KEY=sua_chave_gemini

# Rei dos Canais API
VITE_REIDOSCANAIS_API_KEY=sua_chave_reidoscanais

# NetCombo/Claro Solr EPG
VITE_NETCOMBO_API_KEY=sua_chave_netcombo
```

## 🚀 Deploy no Vercel

### Opção 1: Deploy Automático via GitHub Actions (Recomendado)

1. **Crie um repositório no GitHub** e faça push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: UBlue TV Platform"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/universo-blue-ultimate.git
   git push -u origin main
   ```

2. **Conecte no Vercel**:
   - Acesse [vercel.com](https://vercel.com) e faça login com GitHub
   - Clique em "Add New Project" → Import Git Repository
   - Selecione `universo-blue-ultimate`
   - Configure:
     - Framework Preset: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install --legacy-peer-deps`
   - Adicione as variáveis de ambiente (Environment Variables)
   - Clique em **Deploy**

3. **Configure GitHub Actions Secrets** (para auto-deploy):
   - No GitHub: Settings → Secrets and variables → Actions
   - Adicione:
     - `VERCEL_TOKEN` (de [vercel.com/account/tokens](https://vercel.com/account/tokens))
     - `VERCEL_ORG_ID` (do projeto no Vercel)
     - `VERCEL_PROJECT_ID` (do projeto no Vercel)

### Opção 2: Deploy Manual via Vercel CLI

```bash
# Instale Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── app/           # App shell, LivePlayer, EPG, Search
│   ├── auth/          # AuthModal, UserRegistrationGate
│   ├── broadcast/     # BroadcastAtlas, RealBroadcastPlayer
│   ├── creator/       # CreatorHub, Scheduler, SoundEffects
│   ├── finance/       # UBlueFinanceCenter, Payment Labs
│   ├── iptv/          # IptvOrgHub
│   ├── ott/           # OttEngineeringCenter, Monetization
│   ├── partner/       # PartnerNetwork, GlobalProposal
│   ├── payments/      # UBluePayGateway, FinanceCenterModal
│   ├── portal/        # Navbar, Hero, Packages, Channels
│   ├── tmdb/          # TmdbMoviesHub
│   ├── tvmaze/        # TvmazeWebChannelsHub
│   ├── tuner/         # ChannelTunerModal, UltraTunerTab
│   ├── wallet/        # UBlueWalletModal
│   └── wireframes/    # WireframeStudio, Device Screens
├── engine/            # Subscription, Payment, Media engines
├── services/          # Stream resolver, Auth, AI, Tuner, TurboEdge
├── types/             # TypeScript definitions
├── data/              # Mock data, channel lists, specs
└── App.tsx            # Main router & state management
```

## 🌐 APIs Integradas

| API | Uso | Status |
|-----|-----|--------|
| **iptv-org** | Canais globais verificados | ✅ Ativo |
| **TMDb** | Filmes, séries, favoritos | ✅ Ativo |
| **TVmaze** | Web channels, metadata | ✅ Ativo |
| **Rei dos Canais** | Esportes BR, canais ao vivo | ✅ Ativo |
| **NetCombo/Claro** | EPG Solr Gatekeeper | ✅ Proxy |
| **OMDb** | Metadados de TV linear | ✅ Ativo |
| **Google Gemini** | AI Engine Studio | ✅ Ativo |

## 🏗 Arquitetura de Engenharia (Pilares)

1. **Pilar 1 - Media Ingestion Engine**: Scraper automatizado, normalizador e validador de sinais .m3u8
2. **Pilar 2 - Global Partnership Proposal**: Proposta comercial para Google, Akamai, Cloudflare, Telecoms
3. **Pilar 3 - UBlue Pay Gateway**: Gateway universal de pagamentos com webhooks M-Pesa/e-Mola

## 📱 Modos de Dispositivo

- **Mobile** - Menu inferior (thumb-friendly), cards empilhados
- **Tablet** - Grid equilibrado, sidebar colapsável
- **Desktop** - Atalhos de teclado, layout widescreen, hover states
- **Smart TV (10ft)** - Cards grandes, navegação por setas, foco visual destacado

## 📄 Licença

Apache-2.0 - Veja [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com 💙 para Moçambique e o mundo lusófono**

*Universo Blue - Conectando culturas através da tecnologia*