#!/bin/bash
# UBlue TV - Script de Configuração Inicial do Git e GitHub
# Execute este script UMA VEZ após clonar/baixar o projeto

echo "🔧 UBlue TV - Configuração Inicial do Git"
echo "========================================"

# Verifica se git está disponível
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado."
    echo "   Instale com:"
    echo "   - Windows: winget install Git.Git"
    echo "   - Mac: brew install git"
    echo "   - Linux: sudo apt install git"
    echo ""
    echo "   Após instalar, REINICIE O TERMINAL e execute este script novamente."
    exit 1
fi

echo "✅ Git encontrado: $(git --version)"

# Inicializa repositório git se não existir
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositório Git..."
    git init
    git branch -M main
else
    echo "ℹ️  Repositório Git já existe."
fi

# Configura usuário
echo "⚙️  Configurando usuário Git..."
git config user.name "UBlue TV Developer"
git config user.email "dev@universoblue.co.mz"

# Adiciona arquivos
echo "📦 Adicionando arquivos ao Git..."
git add .

# Primeiro commit
echo "💾 Fazendo commit inicial..."
git commit -m "feat: Initial commit - UBlue TV Platform

- Complete OTT streaming platform for Mozambique
- Live TV player with HLS, EPG, multi-source tuner
- Creator Hub, Business Center, Partner Network
- AI Engine Studio, Originals, Finance Center
- IPTV Global (iptv-org), Broadcast Atlas, TMDb, TVmaze
- Rei dos Canais integration for sports
- M-Pesa/e-Mola payments, UBlue Pay Gateway
- Device adaptive engine (Mobile/Tablet/Desktop/Smart TV)
- TurboEdge zero-rating gateway for MZ carriers
- CORS Proxy & Stream Relayer built-in
- Media Ingestion Engine (Pillar 1)
- Global Partnership Proposal (Pillar 2)
- UBlue Pay Gateway & Webhooks (Pillar 3)
- Vercel deployment ready with GitHub Actions"

echo ""
echo "✅ Repositório Git configurado localmente!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Crie um repositório no GitHub:"
echo "   https://github.com/new"
echo "   Nome: universo-blue-ultimate"
echo "   NÃO inicialize com README, .gitignore ou license"
echo ""
echo "2. Conecte o repositório remoto:"
echo "   git remote add origin https://github.com/SEU_USUARIO/universo-blue-ultimate.git"
echo ""
echo "3. Faça o primeiro push:"
echo "   git push -u origin main"
echo ""
echo "4. Configure deploy no Vercel:"
echo "   - Acesse https://vercel.com"
echo "   - Import Git Repository"
echo "   - Selecione este repo"
echo "   - Framework: Vite, Build: npm run build, Output: dist"
echo "   - Install Command: npm install --legacy-peer-deps"
echo "   - Adicione variáveis de ambiente (veja .env.example)"
echo ""
echo "5. Configure GitHub Actions Secrets (para auto-deploy):"
echo "   - Settings > Secrets and variables > Actions"
echo "   - VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
echo ""