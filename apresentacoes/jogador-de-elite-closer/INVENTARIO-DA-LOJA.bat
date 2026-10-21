@echo off
cd /d "%~dp0"
echo.
echo ==========================================================
echo  Inventario da loja de Blob do PAINEL (jogador-de-elite-closer)
echo  So LISTA: o espaco por pasta e os videos de cada lead.
echo  Nada e apagado. A senha da loja fica so durante a lista.
echo ==========================================================
echo.
if not exist ".vercel\project.json" goto semlink
findstr /c:"jogador-de-elite-closer" ".vercel\project.json" >nul
if errorlevel 1 goto semlink
call npx --yes vercel env pull .env.blob --environment=production --yes >nul
node --env-file=.env.blob limpa-videos-da-loja.mjs > inventario-da-loja.txt
del /q .env.blob
type inventario-da-loja.txt
echo.
echo ==========================================================
echo  A lista ficou tambem em inventario-da-loja.txt (nesta pasta).
echo  Pra apagar os videos marcados com "sai", rode no terminal:
echo    node --env-file=.env.blob limpa-videos-da-loja.mjs --apagar
echo  (depois de puxar a senha de novo; veja o comeco do arquivo).
echo ==========================================================
echo.
pause
exit /b 0

:semlink
echo Esta pasta nao esta ligada ao projeto jogador-de-elite-closer.
echo Nada foi feito.
echo.
pause
exit /b 1
