#!/bin/bash
# UBlue TV - Script de Deploy Automatizado para Vercel
# Uso: ./deploy.sh

set -e

echo "🚀 UBlue TV - Iniciando Deploy para Vercel"
echo "=========================================="

# Verifica se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto (onde está package.json)"
    exit 1
fi

# Verifica se git está disponível
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado. Instale git primeiro:"
    echo "   Windows: winget install Git.Git"
    echo "   Mac: brew install git"
    echo "   Linux: sudo apt install git"
    exit 1
fi

# Verifica se vercel CLI está disponível
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Verifica status do git
echo "📋 Verificando status do repositório..."
git status

# Build de produção
echo "🔨 Fazendo build de produção..."
npm run build

# Deploy no Vercel
echo "☁️  Fazendo deploy no Vercel..."
vercel --prod

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Sua aplicação está no ar!"