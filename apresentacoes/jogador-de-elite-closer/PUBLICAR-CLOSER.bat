@echo off
cd /d "%~dp0"
echo.
echo ==========================================================
echo  Publicando o PAINEL DO CLOSER, projeto jogador-de-elite-closer
echo  Isto NAO mexe no painel atual, jogador-de-elite-painel,
echo  nem no R1 nem no R2 atual.
echo ==========================================================
echo.
if not exist ".vercel\project.json" goto semlink
findstr /c:"jogador-de-elite-closer" ".vercel\project.json" >nul
if errorlevel 1 goto outro
call npx --yes vercel deploy --prod --yes
echo.
echo ==========================================================
echo  Procure acima a linha "Aliased" ou "Production".
echo  O endereco do painel tem que ser:
echo    https://jogador-de-elite-closer.vercel.app
echo  Se for outro, NAO publique o R2 novo ainda:
echo  veja o passo 4 do PASSO-A-PASSO-VARIAVEIS.md.
echo ==========================================================
echo.
pause
exit /b 0

:semlink
echo Esta pasta ainda nao esta ligada ao projeto. Rode antes o
echo ENVIA-VARIAVEIS.bat e ligue a loja de Blob, passos 2 e 3 do
echo PASSO-A-PASSO-VARIAVEIS.md. Nada foi publicado.
echo.
pause
exit /b 1

:outro
echo Esta pasta esta ligada a OUTRO projeto da Vercel. Nada foi publicado.
echo Apague a pasta .vercel daqui e rode o ENVIA-VARIAVEIS.bat de novo.
echo.
pause
exit /b 1
