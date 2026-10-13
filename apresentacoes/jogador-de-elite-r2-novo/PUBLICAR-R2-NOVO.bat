@echo off
cd /d "%~dp0"
echo.
echo ==========================================================
echo  Publicando o R2 NOVO (projeto jogador-de-elite-r2-novo)
echo  Isto NAO mexe no R2 atual.
echo ==========================================================
echo.
call node gera-manifesto.mjs
if errorlevel 1 goto erro
call npx --yes vercel deploy --prod --yes
echo.
echo ==========================================================
echo  Procure acima a linha "Production: https://..."
echo  Esse e o link novo. Copie e abra no navegador.
echo ==========================================================
echo.
pause
exit /b 0

:erro
echo.
echo O variacoes.json nao foi gerado: veja o erro acima. Nada foi publicado.
echo.
pause
exit /b 1
