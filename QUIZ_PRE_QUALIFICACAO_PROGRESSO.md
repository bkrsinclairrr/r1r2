# QUIZ_PRE_QUALIFICACAO_PROGRESSO.md

Atualizado em 24/10/2026 (madrugada). O quiz de pré-qualificação está CONSTRUÍDO, testado e publicado como PRÉVIA, já com a segunda rodada de pedidos do dono (noite de 23/10). Este arquivo diz onde está cada coisa e o que ainda é do dono, pra qualquer conta ou sessão retomar sem reler a conversa.

## Estado
- **Código:** `C:\Users\Me\Desktop\mnkk\quiz-zyron\` (estático, sem build e sem npm). Comece pelo `quiz-zyron\README.md` e pelos documentos em `quiz-zyron\docs\` (decisões 1 a 47, contrato, dados, integração, mapa de persuasão, riscos assumidos, guia visual, copy, contraste).
- **Prévia no ar (Vercel, projeto `quiz-zyron`, conta bkrsinclairrr):** https://quiz-zyron-90ul5e4im-ls-projects-d9965387.vercel.app (pede login da Vercel; logado na conta, abre). Produção NÃO publicada: `quiz-zyron.vercel.app` responde 404.
- **Vercel:** o projeto está com a atribuição automática do domínio de produção desligada (`autoAssignCustomDomains: false`). Ligada, a Vercel transformava a implantação em produção pública mesmo sem `--prod` (aconteceu duas vezes em 23/10; as duas foram removidas). Desligada, `npx --yes vercel deploy --yes` sai como prévia. Pra produção: `--prod` e depois `vercel promote <url> --yes` (ver `docs/integracao.md`).
- **Sem commit e sem push** (o briefing proíbe git). Tudo está como arquivo novo, não rastreado, em `quiz-zyron/`.
- **Modo de ensaio:** sem `endpoint` no `config/geral.json`, o lead fica só no navegador; nada é coletado de verdade até o dono ligar o destino.

## ATENÇÃO: a fonte do quiz mudou de lugar (24/10/2026)
O quiz está em PRODUÇÃO em https://aizyron.com/quiz/ (PR #48 mergeado). Daqui pra frente se trabalha direto em `C:\Users\Me\Downloads\voxen\vide-match\public\quiz\`, numa sessão do Claude Code aberta nesse projeto (contexto no CLAUDE.md de lá). Esta pasta `quiz-zyron` vira histórico. Não edite o quiz aqui.

## Sincronizado em 30/10/2026: o que aconteceu no vide-match depois da cópia daqui
Esta pasta ficou parada no estado de 24/10 (commits 998109f e 323f026). A `main` do vide-match chegou a `15cc79a` em 26/10. Docs, testes (`node quiz/testes/roda-tudo.mjs`) e ferramentas agora moram em `vide-match\quiz\` (fora do `public/`), então as cópias de `docs/`, `testes/` e `ferramentas/` daqui estão DESATUALIZADAS: use as de lá.
- #48 (24/10): quiz entra em produção em `public/quiz/`.
- #51: selo "Selecione" da primeira tela centralizado, em caixa alta, com o dedo pra baixo.
- #52: escudos dos 11 clubes, dica de arrastar que pisca e sai, conversa do Fernando na T07, fim no WhatsApp da equipe; traz `quiz/` (docs, testes, ferramentas) pra `main`.
- #53: um atleta por posição na conversa da T07; "Estrategista Esportivo" no lugar de "Scout".
- #54: T11 sem apertar e segurar (um toque e segue).
- #55 e #56: dica de rolar piscando (da T05 em diante), dica do trilho dura mais, chat do Fernando mais diferente, "Está nos jornais!" em destaque.
- #57: "mano" vira "Fernando" e "Me belisca" vira "Tô até sem palavras" na T07.
- Fora do quiz (#43 a #47, #49, #50): oportunidades com proposta na ficha, importados do CRM em Jogadores, filtros e notas de iniciante, ficha com foto em pé, perfil pelo formulário do `/avaliacao/perfil`, Comparativo só depois do vídeo.
- Continua pendente (do dono): `endpoint` do webhook de leads e `landingUrl` da VSL no `config/geral.json`; sem isso o quiz segue em modo de ensaio.
- Git daqui: `main` está 2 commits à frente de `r1r2/main` (998109f e 323f026), sem push. O checkout local do vide-match está na branch `fix/quiz-selecione-posicao` (já mesclada, atrás da `main`): antes de trabalhar lá, criar branch nova a partir de `origin/main`.

## Onde o quiz vai ao ar de verdade: aizyron.com/quiz/ (24/10/2026)
- O destino é o projeto da Vercel `vide-match` (domínio `aizyron.com`), NÃO o projeto `quiz-zyron` (esse foi só a prévia de desenvolvimento). Repositório: `bkrsinclairrr/vide-match`; a cópia atual fica em `C:\Users\Me\Downloads\voxen\vide-match` (a de `Desktop\VOXEN\vide-match` está parada em 16/10).
- O quiz entra como arquivos estáticos em `public/quiz/` (cópia do deployável de `mnkk/quiz-zyron`: index.html, css, js, config, assets) e 3 blocos novos no `vercel.json` (noindex em `/quiz/`, cache dos assets e o redirecionamento de `/quiz` para `/quiz/`). A fonte e os testes continuam em `mnkk/quiz-zyron`: edite lá e copie de volta.
- Branch `feat/quiz-pre-qualificacao` (commit `111579e`, a partir da `main` de 24/10), enviada ao GitHub, SEM merge. Prévia pela integração do GitHub: https://vide-match-5d932oobd-ls-projects-d9965387.vercel.app/quiz/ (conferida no Chrome: sem violação de CSP e sem erro no console). Produção = mergear essa branch na `main`.
- A implantação pela CLI foi bloqueada pela Vercel ("commit author doesn't have permission"); o push da branch funciona.
- Ao ligar o `endpoint` do lead em `public/quiz/config/geral.json`, incluir o domínio dele no `connect-src` do CSP do `vercel.json` do site, senão o navegador bloqueia o envio.

## Segunda rodada (pedidos do dono na noite de 23/10/2026)
T02 sem o bloco do responsável; T01 com "Selecione", a luz direcionada e a legenda das siglas; CA virou AT (Atacante); T05 com o cartão "O adversário que ninguém te mostrou: o olhômetro"; T06 com "Você não precisa ser o novo Neymar" e dois números da FIFA; T07 e T08 rolando sozinhas; "Inicialmente R$ 30 mil+ por mês"; foto da mãe na T10; T12 virou "a chance" (avaliação gratuita, nada de venda); "Número do WhatsApp" na T13; diagnóstico sem investimento e com o botão "Continuar". Detalhes em `quiz-zyron/docs/decisoes.md`, itens 36 a 47.

## Resultado (24/10/2026)
- Suíte local: 257 de 257 verificações em 10 testes (`node testes/roda-tudo.mjs`). LCP mediano de 1,74 s com 4G lento e CPU 4 vezes mais lenta.
- Links das provas: 35 de 36 abrem (5 só pelo navegador); a PEN-07 (doi.org) responde 403 a robô.
- Prévia: 6 de 6 (`teste-publicacao.mjs`): 82 arquivos no ar idênticos aos locais, noindex, MP3 com pedido parcial, robots.txt. Conferida também no Chrome do dono (T01, T05 e T06), sem erro no console.

## O que falta do dono
1. `endpoint` (destino dos leads) e `landingUrl` (a landing com a VSL) no `quiz-zyron/config/geral.json`. O `docs/integracao.md` traz um webhook pronto pra planilha do Google (já com a coluna `chance`).
2. IDs do pixel (Meta e Utmify), se quiser rastreamento (só adulto, depois do aceite de cookies).
3. Os escudos que a casa não tem (Chelsea, Liverpool, Leverkusen, Brentford); até lá entra selo de texto.
4. Ouvir o áudio e aprovar as legendas (desligadas) e dizer de que site é o print do Cambridge United (o cartão cita o anúncio oficial do clube).
5. Decidir a proteção da prévia (pede login) e, quando quiser, a produção (`--prod` e `promote`).
6. Os pontos de advogado listados em `docs/riscos-assumidos.md`.

## Como seguir
- Ajustar copy: `quiz-zyron/config/copy.pt-BR.json`, e rodar `node testes/teste-regras-da-casa.mjs`. Se mexer no selo, no título ou no apoio da capa, mude também o topo da T01 no `quiz-zyron/index.html` (o teste avisa).
- Ligar o que está desligado: `docs/integracao.md`.
- Republicar a prévia: dentro de `quiz-zyron`, `npx --yes vercel deploy --yes`, conferir que o JSON diz `"target": null` (prévia) e rodar `node testes/teste-publicacao.mjs <url>` (no Git Bash, com `MSYS_NO_PATHCONV=1` antes).
