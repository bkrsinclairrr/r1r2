# Quiz Zyron: diagnóstico do atleta (Voxen | Zyron)

Quiz de pré-qualificação: o atleta chega do anúncio, responde 14 telas de um toque em menos de 4 minutos, recebe o diagnóstico e segue pra landing com a VSL. Estático (HTML, CSS e módulos JavaScript, sem build e sem npm), publicado na Vercel.

Briefing: `../QUIZ_PRE_QUALIFICACAO_PROMPT.md`. Decisões, contrato, dados, integração, persuasão, riscos, visual, copy e contraste: `docs/`.

## Rodar no computador

```
node testes/servidor.mjs
```

Abra `http://127.0.0.1:4400`. Com `?debug=1`, aparece o painel de ensaio (estado, caminho, pontuação, eventos e o payload).

## Testes

Chrome local controlado por CDP (Chrome em `C:/Program Files/Google/Chrome/Application/chrome.exe`, ou a variável `CHROME`). Um teste por vez: dois Chrome em paralelo derrubam a suíte.

```
node testes/roda-tudo.mjs                       a suíte local (uns 20 minutos)
node testes/roda-tudo.mjs --fontes              mais os links das provas (internet)
node testes/roda-tudo.mjs --publicacao <url>    mais a prévia no ar
```

| Teste | O que confere |
| --- | --- |
| `teste-pontuacao.mjs` | Os limites dos tiers (44, 45, 69, 70), a T12 (a chance) sem forçar o C, "ainda não sei", "quero entender", "hobby", o máximo (100 e 94) e a pontuação sem idade |
| `teste-dados.mjs` | O payload no schema e na regra de ficha do Painel do Closer, eventos sem dado de pessoa, a URL da landing, a fila (falha de rede e tempo limite, sem duplicar) e o modo de ensaio |
| `teste-regras-da-casa.mjs` | Travessão em qualquer arquivo, o topo da capa no `index.html` igual à copy, palavras proibidas, ressalva, preço, títulos com até 9 palavras, os números da T08 com o universo e cada fato ligado a uma prova com fonte (com as 4 telas opcionais ligadas) |
| `teste-caminhos.mjs` | Os 12 caminhos do aceite, ponta a ponta, com a sequência de telas, o payload e a varredura de texto e de eventos; o caminho 1 toca a cada 3 s e ouve o áudio inteiro; os caminhos 13 e 14 são de quem volta pela capa (seguir de onde parou e recomeçar) |
| `teste-acessibilidade.mjs` | O quiz inteiro só no teclado, foco visível e em ordem, foco no título, espelhos anunciados, alvos de 44 px, 320 px e zoom de 200%, reduzir movimento e o contraste |
| `teste-audio.mjs` | Os 5 estados do áudio com evento e pontuação, seek, velocidade, `play()` recusado, arquivo ausente e o Continuar em 10 s |
| `teste-segurar.mjs` | Soltar antes, completar, Enter, Espaço e "Confirmar sem segurar" |
| `teste-consentimento.mjs` | Nenhuma tag antes da idade nem pra menor, a folha só pra adulto e com ID, botões iguais, rejeitar e aceitar |
| `teste-desempenho.mjs` | Com 4G lento e CPU 4 vezes mais lenta, em HTTP/2: carga, LCP e CLS (mediana de 3 visitas), JavaScript comprimido e nenhum terceiro; a capa antes do JavaScript, sem piscar pra quem volta no meio e sem pular quando a T01 monta |
| `teste-aparelhos.mjs` | As telas em 360, 390, 412, 768 e 1440 px (capturas em `capturas/`) e o navegador do Instagram (Android e iOS) |
| `teste-fontes.mjs` | Cada link do `provas.json` (o que não abre vira aviso) |
| `teste-publicacao.mjs <url>` | A prévia no ar: 200, noindex, MP3, arquivos idênticos aos locais, robots.txt e capturas da T01 e da T14 |

`node testes/telas.mjs [largura] [altura] [pasta]` tira as capturas de uma largura só.

## Configurar e publicar

Endpoint do lead, landing, pixel e telas opcionais: `docs/integracao.md` (inclui um webhook pronto pra planilha do Google). Publicar a prévia, dentro desta pasta: `npx --yes vercel link --project quiz-zyron --yes` e `npx --yes vercel deploy --yes` (sem `--prod`); depois apague o `.env.local`.

## Ferramentas

- `ferramentas/gera-waveform.py`: a onda do áudio (48 barras) e a versão de 64 kbps (`uv run --python 3.12 --no-project --with soundfile --with numpy --with imageio-ffmpeg python -I ferramentas/gera-waveform.py`).
- `ferramentas/escudos.py`: copia os escudos do deck R2 pro quiz em 96 por 96 (`uv run --python 3.12 --no-project --with pillow python -I ferramentas/escudos.py`).
- `ferramentas/contraste.mjs`: mede os pares de cor e reescreve `docs/contraste.md`.
