@echo off
REM UBlue TV - Script de Deploy Automatizado para Vercel (Windows)
REM Uso: deploy.bat

echo 🚀 UBlue TV - Iniciando Deploy para Vercel
echo ==========================================

REM Verifica se está no diretório correto
if not exist "package.json" (
    echo ❌ Erro: Execute este script na raiz do projeto (onde está package.json)
    exit /b 1
)

REM Verifica se git está disponível
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git não encontrado. Instale git primeiro:
    echo    winget install Git.Git
    echo    OU baixe em: https://git-scm.com/download/win
    exit /b 1
)

REM Verifica se vercel CLI está disponível
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Instalando Vercel CLI...
    npm install -g vercel
)

REM Verifica status do git
echo 📋 Verificando status do repositório...
git status

REM Build de produção
echo 🔨 Fazendo build de produção...
npm run build

REM Deploy no Vercel
echo ☁️  Fazendo deploy no Vercel...
vercel --prod

echo ✅ Deploy concluído com sucesso!
echo 🌐 Sua aplicação está no ar!