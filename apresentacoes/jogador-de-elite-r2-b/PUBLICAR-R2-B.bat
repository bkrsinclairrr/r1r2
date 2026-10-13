@echo off
cd /d "%~dp0"
echo.
echo ==========================================================
echo  Publicando a VARIACAO B do R2 (nome e primeiro sobrenome),
echo  projeto jogador-de-elite-r2-b.
echo  Isto NAO mexe no jogador-de-elite-r2-novo.
echo ==========================================================
echo.
call npx --yes vercel link --yes --project jogador-de-elite-r2-b
if errorlevel 1 goto erro
call npx --yes vercel deploy --prod --yes
echo.
echo ==========================================================
echo  Procure acima a linha "Production: https://..."
echo  O endereco tem que ser https://jogador-de-elite-r2-b.vercel.app
echo ==========================================================
echo.
pause
exit /b 0

:erro
echo.
echo Nao consegui ligar a pasta ao projeto. Nada foi publicado.
echo.
pause
exit /b 1
