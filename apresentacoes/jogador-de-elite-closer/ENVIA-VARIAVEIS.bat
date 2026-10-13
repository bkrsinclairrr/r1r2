@echo off
cd /d "%~dp0"
echo.
echo ==========================================================
echo  Painel do Closer: cria o projeto jogador-de-elite-closer
echo  na Vercel, liga esta pasta a ele e manda as 6 variaveis
echo  do .env.local. Nenhum valor aparece na tela.
echo  Isto NAO mexe no painel atual, no R1 nem no R2 atual.
echo ==========================================================
echo.
if not exist ".env.local" goto semenv
call npx --yes vercel project add jogador-de-elite-closer
call npx --yes vercel link --yes --project jogador-de-elite-closer
if errorlevel 1 goto semlink
node envia-variaveis.mjs
echo.
echo ==========================================================
echo  Proximo passo: criar a loja de Blob privada e ligar ao
echo  projeto, passo 3 do PASSO-A-PASSO-VARIAVEIS.md.
echo  Depois: PUBLICAR-CLOSER.bat
echo ==========================================================
echo.
pause
exit /b 0

:semenv
echo Falta o .env.local nesta pasta. Rode antes: node gera-segredos.mjs
echo.
pause
exit /b 1

:semlink
echo.
echo Nao consegui ligar esta pasta ao projeto. Veja a mensagem acima.
echo Nada foi mandado pra Vercel.
echo.
pause
exit /b 1
