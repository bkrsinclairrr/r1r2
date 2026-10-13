# APRESENTACAO_R2_LEITURA_ATLETA_PROMPT.md

Versão: v2 (08/10/2026), continuação de `APRESENTACAO_R2_REFORMULACAO_PROMPT.md` (v1)
Prompt pro Opus 5.5 construir a "Leitura do atleta": um painel pra subir o vídeo de um atleta específico, marcar os lances e gerar o relatório dele, e a parte de IA do R2 (slide 13) mostrando, pra família, o vídeo dele, o nome dele e esse relatório. É só o briefing: nada foi aplicado. Fonte editável: `C:\Users\Me\Downloads\bum\jogador-de-elite-r2` e `C:\Users\Me\Downloads\bum\jogador-de-elite-painel` (fora do repo, sem git).

Changelog:
- v2: o dono esclareceu o "campo". Não é o campo de futebol (leitura errada da v1, P1). É um campo da parte de IA do R2 com o vídeo do atleta, o nome dele e um relatório, como o painel do print `referencias-r2/painel-relatorio-referencia.webp`. A v1 já foi aplicada no deck local (08/10/2026, entre 16:34 e 17:16: olhômetro no 04, campo de futebol e cartão no 10, ETAPAS e "desarma" no apresentador, paleta navy-seal, `pe` e `altura` no painel). Este v2 parte desse estado.
- v1: reformulação geral (olhômetro como inimigo, dossiê, paleta, Bíblia).

Como usar:
1. Leia `<premissas>` e corrija o que estiver errado. A P3 (de onde vêm os números do relatório) é a que mais importa.
2. Rode na sessão que aplicou a v1 ("Apresentação R2 reformulação prompt") ou numa nova com acesso a `C:\Users\Me\Downloads\bum` e a este repo. Envie tudo abaixo da linha marcada.
3. O Opus não publica nada. Você abre o painel e o deck locais, sobe um vídeo de teste e só então pede os deploys.

=============== COPIE DAQUI PRA BAIXO ===============

<tarefa>
O dono quer que a R2 prove, na tela, que o planejamento de carreira é DE UM atleta, não de qualquer um. Na parte de IA (slide 13, "IA na Prática"), em vez de um quadro vazio que espera a leitura ao vivo, a família vê o vídeo do filho, o nome dele e o relatório do jogo dele, que o Gestor deixou pronto antes da call. Persuasão máxima, sem inventar nada.

Duas peças:
1. Painel (projeto `jogador-de-elite-painel`): uma tela "Leitura do atleta" dentro de cada apresentação, onde o Gestor sobe o vídeo daquele atleta, marca os lances (minuto, tipo, bom ou a melhorar), escreve pontos fortes e prioridades e vê o relatório pronto. Também importa os mesmos dados de um arquivo JSON, pra quando o Zyron exportar.
2. Deck R2 (padrão e técnica): o slide 13 passa a mostrar o vídeo do atleta, o nome, a linha do tempo com os lances marcados e o relatório (rosca de boas decisões, pontos fortes, prioridades, primeiro foco), revelados por avanço. Sem leitura no painel, o slide funciona como hoje (leitura ao vivo no Meet).

O que entregar:
1. Painel com upload, marcação, importação, prévia, apagar, e as rotas novas.
2. Deck padrão e variação técnica com o slide 13 novo, a ficha, o apresentador (lances viram capítulos) e o roteiro.
3. Cópia de exclusividade ("é pra ele") afinada nos slides 01, 02, 05, 13, 24 e 25.
4. A Bíblia (`processo-r2/index.html` e os PDFs de `distribuir/`) atualizada.
5. Um relatório final curto, no formato de `<entrega>`.

Limites: nenhum deploy (painel, deck, técnica, Bíblia), nenhum git no repo `mnkk`, nada de playbooks, de docs `APRESENTACAO_*.md` nem do R1. O que fizer falta neles entra só no relatório. Os preços, planos, garantia e o resto do deck ficam como estão.

Escreva pro dono: português do Brasil, informal e direto, sem travessão (nem o longo nem o curto) em nenhum texto: tela, roteiro, notas, comentário de código, relatório.
</tarefa>

<palavras_do_dono>
Fonte primária, transcrita com ortografia ajustada. Em dúvida entre este briefing e as palavras abaixo, vale o que o dono escreveu.

"Aperfeiçoe isso aí, porque precisa ser muito persuasivo, e precisa ter um campo na parte de IA. Encontre isso com base no que era o R2, pra colocarmos um painel pra upar o vídeo do jogador específico e gerar um relatório como esse, pra mostrar pra ele que ele é exclusivo, único, especial. Faça isso. Tenha um campo no R2 que vai ter, na apresentação pra pessoa, o vídeo que o closer já vai ter colocado pra aparecer, junto com o nome, etc. É um planejamento de carreira específica pra aquele atleta. Não pra outros. É pra ele. Precisa ter isso como base, persuasão máxima. Aperfeiçoe isso e atualize."

A imagem que ele mandou: `referencias-r2/painel-relatorio-referencia.webp`, o print de um vídeo de rede social com um notebook mostrando um painel de análise de futebol. Dá pra ver: um quadro de vídeo de treino no alto, uma rosca vermelha e verde com um número no meio (46.7), listas de atletas e lances com marcadores verdes e vermelhos e um filtro de categorias na lateral. É de um produto de terceiros: use a ideia (vídeo + rosca + lista marcada), não o visual nem os dados.

Leituras adotadas (todas entram no relatório):
- "Campo" é um campo de dados e de vídeo da parte de IA, não o campo de futebol. O slide 10 da v1 (campo de futebol com o atleta na posição) fica como está até o dono decidir (P1).
- "Na parte de IA, com base no que era o R2": o slide 13 (IA na Prática) já é o quadro "Vídeo do atleta" + "Resultado da leitura" vazio, com a leitura feita ao vivo no Meet. É ali.
- "O vídeo que o closer já vai ter colocado": o Gestor sobe o vídeo no painel antes da call. Na call, o deck só toca.
- "Gerar um relatório como esse": o relatório é montado a partir dos lances marcados e dos textos do painel. Quem faz a leitura e a origem dos números estão em `<modelo_do_relatorio>` e na P3.
- "Exclusivo, único, especial": o relatório existe porque aquele atleta mandou aquele vídeo. Outro vídeo, outro relatório. É verdade e é o argumento. Não é "você é o melhor": o relatório mostra pontos fortes e prioridades.
</palavras_do_dono>

<estado_atual>
Conferido em 08/10/2026 às 17h30 (os arquivos podem ter mudado desde então: confirme antes de editar).

Deck R2, 25 slides: 01 Capa · 02 Por que você · 03 O combinado · 04 O olhômetro · 05 O planejamento de carreira · 06 E se? · 07 Zyron · 08 O Zyron trabalhando (vídeo) · 09 Como o Zyron funciona · 10 O seu lugar em campo · 11 Olhômetro × Zyron · 12 O que ninguém mais tem · 13 IA na Prática (ao vivo) · 14 Depoimento de uma mãe · 15 Nem tudo é talento · 16 AGN · 17 O valor real · 18 Até lá, a gente investe · 19 Não é pra qualquer um · 20 Quando a gente ganha · 21 Garantia total · 22 A vaga · 23 Os planos · 24 O investimento · 25 Bem-vindo. Soma de `min` no `roteiro.js`: 59.

O slide 13 de hoje (`index.html`): `.ia-call` (barra "Ao vivo", quadro `.tela` com o chip "Zyron lendo", o disco de play e o rótulo "Vídeo do atleta / O jogo do [nome]"), `.ia-passos` (1 O seu vídeo na tela, 2 O Zyron lê o seu perfil, 3 O resultado aparece) e `.ia-res` ("Resultado da leitura: Revelado ao vivo, nesta chamada."). A atenção do roteiro diz: "o slide não mostra resultado de propósito, quem fala é quem conduz a leitura, ao vivo". Essa regra era do dono antes do pedido novo: ela passa a valer só quando NÃO há leitura no painel.

Motor do deck (`assets/deck.js`): `data-video="<id>"` no `<section>` liga o espaço ao play do vídeo daquele slide; `.player` (botão de play), `.chapters` (lista de `li[data-t]` que pula o vídeo; o apresentador monta os capítulos do slide atual a partir dela), `thumb()` troca `<video>` por imagem nas miniaturas, `data-step` revela por avanço, `data-if`, `data-ifnot`, `data-bind`, `derived()`, `cond()`. A ficha vem do `localStorage` (`je-r2-ficha`), do painel (`carregaPainel`, que busca `PAINEL + '/api/publico?id=' + AID` e copia `ficha` pra ficha local) e do apresentador, sincronizados pelo canal `je-r2`. O primeiro foco do plano é o campo `trabalhar` da ficha. Já existem `dossieCod`, `peTxt`, `alturaTxt`, `posId`, `campoSvg()` (slide 10 e miniatura do 25), `ETAPAS` e o "Este slide desarma" no apresentador.

Painel (`jogador-de-elite-painel`, ES modules, `@vercel/blob` 2.8.1, Vercel Blob em modo privado):
- `api/_base.js`: `CAMPOS` e `limpaFicha()` (só o que está em `CAMPOS` passa), `leJson`/`gravaJson`/`apagaBlob`, `mudaIndice`/`leIndice`/`resumo`, `exige()` (sessão), `PASTA`, `ID_OK`, `PAPEIS` (sdr, gestor, admin).
- `api/apresentacoes.js`: CRUD por id (`<primeiro>-<ultimo>-<8 aleatórios>`). O DELETE apaga só o JSON.
- `api/publico.js`: GET `?id=`, sem login, CORS `*`, devolve `{ id, ficha, atualizadoEm }`.
- `index.html`: `GRUPOS` (os campos do editor), diálogo `#editor`, lista de apresentações.
- `vercel.json`: CSP `default-src 'self'`, `connect-src 'self'`, `img-src 'self' data:`, sem `media-src` (cai no `default-src`), `X-Frame-Options: DENY`.
- O SDK instalado exporta `@vercel/blob/client` com `upload`, `handleUpload` e upload multipart, aceitando `access: 'private'`. Confira a assinatura em `node_modules/@vercel/blob/dist/client.d.ts` antes de escrever. O `get(path, { access: 'private', useCache: false, headers })` devolve um stream; veja se o `headers` deixa passar um `Range` pra servir o vídeo em pedaços.
- `.env.local` tem o token do Blob. Nunca imprima nem copie o conteúdo dele.
</estado_atual>

<modelo_do_relatorio>
O relatório é um conjunto de dados reais marcados por alguém (ou exportados pelo Zyron). O deck só desenha e conta. Nada é estimado, sorteado nem "gerado" pelo código.

Registro da apresentação (`apresentacoes/<id>.json`) ganha dois blocos opcionais, além de `ficha`:

```
video: { arquivo, tipo, bytes, duracaoS, poster, autorizadoPor, autorizadoEm, venceEm }
leitura: {
  origem:   'zyron' | 'equipe',        // quem fez a leitura (obrigatório pra publicar)
  criterio: 'todos' | 'selecao',       // 'todos' = todos os lances do vídeo em que ele participa; 'selecao' = uma seleção
  lances:   [{ t, tipo, leitura, nota }],  // t em segundos; tipo de uma lista fixa; leitura 'bom' | 'ajustar'; nota até 70 caracteres
  fortes:   [texto, ...],              // até 3, até 70 caracteres cada
  prioridades: [texto, ...],           // até 3
  por, em                              // login e data de quem salvou
}
```

Lista de tipos (dado editável num lugar só): Passe, Condução, Drible, Finalização, Desarme, Marcação, Posicionamento, Cobertura, Jogo sem a bola, Bola parada, Defesa.

Derivados (calculados no cliente, mostrados só quando cabem):
- `n`: lances marcados. `bons`: quantos 'bom'. `ajustar`: os outros.
- Rosca "decisões boas": aparece com `n >= 5`. Centro: `bons de n` em número grande. A porcentagem inteira só com `n >= 10`, menor, embaixo.
- Linha do tempo: um marcador por lance, na posição `t / duracaoS`. Bom em verde-oliva claro (`--olive-l`), a melhorar em areia (`--sand`), vazado. O laranja-sinal NÃO entra aqui: é só do olhômetro.
- Primeiro foco: o campo `trabalhar` da ficha; sem ele, a primeira prioridade; sem nenhuma, a linha não aparece.
- Rodapé fixo da leitura, sempre visível: "Lances marcados neste vídeo: todos os lances em que o atleta participa." (ou "uma seleção de lances da equipe"), mais a fonte: "Leitura do Zyron." ou "Leitura da equipe."

Nunca: nota geral ("overall"), posição num ranking, comparação com outros atletas, "percentil", "potencial" em número, previsão de clube ou de carreira. Os números do relatório descrevem lances daquele vídeo e mais nada.

A fonte decide a cópia. Com `origem = 'zyron'`, o slide pode dizer "o Zyron leu". Com `origem = 'equipe'`, o slide diz "a nossa equipe leu o seu vídeo" e nenhuma frase da tela, da fala ou do apresentador atribui essa leitura ao Zyron. O painel pede essa escolha com um aviso: "Escolha Zyron só se os lances e os textos vieram do Zyron. Se foram marcados à mão, escolha Equipe."
</modelo_do_relatorio>

<arquitetura>
Direção recomendada. Se o código mostrar um jeito melhor, ajuste e justifique no relatório. As regras duras não mudam.

A. Painel: a tela "Leitura do atleta".
- Entrada: um botão "Leitura do atleta" em cada apresentação da lista e no editor (abre um diálogo ou uma tela própria). O bloco aparece pra quem edita a apresentação (qualquer papel). A lista ganha um selo discreto "vídeo ✓" e "N lances" (via `resumo()`).
- Passo 1, autorização: antes de qualquer upload, uma caixa obrigatória: "Tenho a autorização expressa do responsável legal pra usar o vídeo deste atleta." Grava `autorizadoPor` e `autorizadoEm`. Sem ela, o upload fica desligado.
- Passo 2, vídeo: enviar um arquivo (mp4 de preferência, também webm e mov). Antes de subir, o navegador confere (`canPlayType`, `loadedmetadata`): se não toca, avisa que o celular às vezes grava em formato que o Chrome não abre (HEVC) e pede mp4. Limites de P5: até 5 minutos e 250 MB. Barra de progresso, cancelar, trocar, apagar. O upload vai direto do navegador pro Blob (`upload()` do `@vercel/blob/client`, multipart) porque a função da Vercel não recebe corpo grande. Rota `api/leitura-upload.js` com `handleUpload`: exige sessão e id válido, fixa o caminho (`videos/<id>/<nome aleatório>.<ext>`), limita tipo e tamanho em `onBeforeGenerateToken`. Não dependa do `onUploadCompleted` (o callback não alcança o localhost): quando o `upload()` termina, o cliente chama `PUT api/leitura?id=` pra registrar o caminho em `video`.
- Passo 3, marcar lances: o vídeo tocando no painel (URL de objeto local enquanto sobe, depois `/api/video`), com os botões "Marcar lance" (tecla M), "Bom" e "A melhorar" (teclas B e A) e um menu de tipo. Cada marcação grava o `t` atual, o tipo e a leitura, e abre a nota (até 70 caracteres). Tabela editável embaixo (corrigir minuto, tipo, leitura, nota; apagar; ordenar por minuto). Clicar numa linha pula o vídeo pro lance. Em volta do `t`, deixe 2 s de folga antes do lance quando o painel pular.
- Passo 4, textos: pontos fortes (até 3) e prioridades (até 3), os campos `origem` e `criterio` com o aviso do `<modelo_do_relatorio>`.
- Passo 5, prévia e importação: "Ver relatório" renderiza o mesmo componente do deck. "Importar JSON" aceita `{ origem, criterio, lances, fortes, prioridades }`, valida (mesmos limites, `t` dentro da duração, tipo na lista; linha inválida vira lista de erros, não perde o resto) e preenche a tela. "Exportar JSON" faz o inverso. O esquema é o mesmo nos dois sentidos.
- Poster: o painel captura um quadro do vídeo num instante que o Gestor escolhe (um `canvas` com `toBlob` JPEG, até 960 px de largura) e sobe junto (`video.poster`). Serve de capa do slide 13 antes do play e do dossiê da capa (P8).
- Validade e apagar: `video.venceEm` = upload + 90 dias (P4). Passando disso, `/api/video` e `/api/publico` deixam de entregar o vídeo e o poster, e o próximo salvamento da apresentação apaga os blobs. O botão "Apagar vídeo e leitura" apaga os blobs e limpa `video` e `leitura`. O DELETE da apresentação (`apresentacoes.js`) passa a apagar também os blobs de vídeo e de poster dela.
- Visual: o do painel de hoje, só com os controles novos. Não precisa seguir a paleta navy-seal do R2.

B. API do painel.
- `api/leitura-upload.js`: `handleUpload`, como acima. Só POST. 
- `api/leitura.js`: `GET ?id=` devolve `video` e `leitura` completos (com login). `PUT ?id=` salva `video` e `leitura` com `limpaLeitura()` (função nova em `_base.js`, no padrão do `limpaFicha`: limites, tipos, listas, números; texto aparado; nada de HTML). `DELETE ?id=` apaga vídeo, poster e leitura. Gravação com o mesmo cuidado do `gravaJson` e do índice (ETag), pra dois Gestores não se atropelarem.
- `api/video.js`: `GET ?id=` (vídeo) e `GET ?id=&poster=1` (quadro), sem login, como o `publico`. Só serve se o id existe, `autorizadoEm` está preenchido e `venceEm` não passou; senão 404. Suporte a `Range` (responde 206 com `Content-Range` e `Accept-Ranges: bytes`), pra a barra pular. Cabeçalhos: `Content-Type` do arquivo, `Cache-Control: private, max-age=3600`, `X-Robots-Tag: noindex`, `X-Content-Type-Options: nosniff`. Streaming (não carregue o arquivo na memória). Confirme que o limite de 4,5 MB de resposta da Vercel não pega uma resposta em stream e defina `maxDuration` se o plano permitir. Se o `get()` do Blob não deixar passar `Range`, diga isso no relatório e proponha o plano B, em vez de entregar um vídeo que não pula.
- `api/publico.js`: passa a devolver também `leitura` (só os campos que a família vê: origem, criterio, lances, fortes, prioridades) e `video` (só `duracaoS`, `temPoster` e `ok: true`), nunca caminho de Blob, `autorizadoPor` nem `venceEm`. Sem `video.ok`, nada de leitura vai pro deck.
- `vercel.json` do painel: CSP com `connect-src 'self' https://*.vercel-storage.com` (o upload direto) e `media-src 'self' blob:` (a prévia local). Mude só isso.
- CORS do `api/video.js`: `video` e `img` cross-origin não precisam, mas se usar `crossorigin` no deck, devolva `Access-Control-Allow-Origin` só pros domínios dos decks (`jogador-de-elite-r2.vercel.app`), não `*`.

C. Deck: o slide 13.
- Título de direção: "O jogo do [nome]. Lance a lance." Selo "Dossiê · [nome] · nº [código]" (já existe). Sem nome, "O seu jogo. Lance a lance."
- Estados (um só `data-` lê `leitura` e `video` da ficha e escolhe):
  1. Vídeo e leitura: o desenho completo abaixo.
  2. Só vídeo: o player com o nome e o rótulo "Leitura em preparação", sem rosca nem listas. O apresentador avisa "marque os lances no painel".
  3. Nada (sem `?a=`, sem vídeo, painel fora do ar, vídeo vencido, vídeo que não carrega): o slide de hoje, intacto, com a leitura ao vivo no Meet. Nunca mostre erro pra família.
- Layout (palco 1920x1080, mínimo de 24 px): à esquerda, o player (uns 1000 x 562, com os `brackets`), a linha do tempo com os marcadores logo embaixo e, sobre o vídeo, a chamada do lance atual quando o minuto passa por um marcador ("0:42 · Passe · bom" e a nota). À direita, o relatório em coluna: cabeçalho "Relatório de [nome]" e a fonte ("Leitura do Zyron" ou "Leitura da equipe"), a rosca com "X de N", "Pontos fortes", "Prioridades" e "Primeiro foco". No pé, o rodapé fixo dos critérios (ver `<modelo_do_relatorio>`) e a nota legal "Vídeo do atleta usado somente com autorização expressa do responsável legal."
- Revelação por avanço (`data-step`): 0 o vídeo, o nome e a fonte. 1 a linha do tempo e a lista curta dos lances (até 4 mais marcantes por minuto, o resto fica no apresentador). 2 a rosca e os pontos fortes. 3 as prioridades, o primeiro foco e o fecho: "A cada vídeo novo, um relatório novo." O apresentador mostra o que entra no próximo avanço, como nos outros slides.
- Vídeo: `<video id="v-atleta" playsinline preload="metadata" muted>`, poster do atleta, `src` = `PAINEL + '/api/video?id=' + AID`. Começa mudo (política de autoplay e ruído de campo), com botão de som. `data-video="v-atleta"` no `<section>` liga o espaço. O botão e a tecla funcionam nas duas janelas como nos outros vídeos. Se o `error` do vídeo disparar, cai no estado 3.
- `.chapters`: montada em JS quando a leitura chega (cada lance vira um `li[data-t]` com minuto, tipo e nota). O `carregaPainel` é assíncrono e os handlers de `.chapters` e `.player` são ligados na inicialização: religue depois de montar a lista, sem duplicar ouvintes. O apresentador lista os lances do slide 13 como capítulos clicáveis: o Gestor pula pro lance que quer comentar, na tela da família.
- Miniaturas e visão geral (`thumb()`): o vídeo vira o poster, sem carregar o arquivo.
- Ficha e painel: `carregaPainel` guarda `j.leitura` e `j.video` em `ficha._leitura` e `ficha._video` (chaves com sublinhado, como `_a` e `_p`: não são campo de formulário). Ao mudar de atleta, saem junto. Dado que sumiu do painel some da ficha. Sem `AID`, o que estiver em `ficha._leitura` vale (isso permite testar com a ficha gravada à mão no `localStorage`, sem parâmetro de teste no deck).
- Variação técnica: o mesmo slide 13 na mesma posição, com a cópia sóbria ("Leitura do vídeo do atleta: [nome]").

D. Exclusividade ("é pra ele") nos outros slides. Pente fino, sem slide novo:
- 01 Capa: quando houver `poster`, o dossiê da capa ganha o quadro do vídeo dele (duotone navy), no lugar do desenho genérico. Sem poster, como está.
- 02 Por que você: a fala ganha "Esse plano é só do [nome]: nenhum outro atleta tem o mesmo." (é verdade: ele sai da ficha e do vídeo dele).
- 05 O planejamento: o título "O plano do [nome]." ganha a linha "Feito a partir do seu vídeo e da sua história." (só quando houver vídeo; senão "da sua história").
- 13: "Isso existe porque o [nome] mandou este vídeo. Outro vídeo, outro relatório."
- 24 e 25: a linha "Plano do [nome]" no 24 e o fecho do 25 repetem o nome, sem adjetivo de anúncio.
- Nada de "exclusivo", "único", "especial" como adjetivo solto. A exclusividade é mostrada: o nome, o vídeo, os lances dele. Se a palavra aparecer, é na fala do Gestor, sobre o plano ("é só do [nome]"), nunca sobre o nível do atleta.

E. Roteiro, objeções e notas.
- ROTEIRO 13: `min` de 3 pra 5. Falas com a leitura no painel: "[atleta], presta atenção: o que aparece agora é só seu." Play e silêncio. Um avanço por vez, uma frase por avanço: o que o olhômetro viu em vinte minutos contra "cada lance do vídeo, com o minuto e o porquê" (só com `criterio = todos`; com `selecao`, "os lances que a equipe marcou"). Peça pra família escolher um lance e comente-o. Fecho: "A cada vídeo novo, um relatório novo." As perguntas de hoje ficam ("O que vocês sentiram vendo o jogo dele lido assim?"). Mantenha, como alternativa, o roteiro da leitura ao vivo pro estado 3.
- Tempo: o total de `min` hoje é 59. Cortar 2 pra caber o 13: sugestão, 08 (2,5 pra 1,5, porque o vídeo do próprio atleta já prova) e 12 (3 pra 2,5). Se discordar, ajuste e diga qual. O total fica em até 59.
- `atencao` do 13: troque a regra "o slide não mostra resultado" por "o slide só mostra o que o painel guardou, na fonte que o painel diz (Zyron ou Equipe); sem leitura no painel, vale a leitura ao vivo". Acrescente o aviso de privacidade: vídeo de menor, só com a autorização, só pelo link da apresentação, expira em 90 dias.
- `CHECKLIST`: "Subi o vídeo do atleta no painel, com a autorização do responsável, marquei os lances e olhei a prévia", "Testei o vídeo no deck (play, som, pular pelos lances)", "Conferi se a fonte do relatório é Zyron ou Equipe, de verdade". Troque o item do vídeo ao vivo por "Se não subi o vídeo, deixei o vídeo do atleta aberto pra leitura ao vivo".
- `PROIBIDOS`: acrescente "dizer que o Zyron leu um relatório marcado à mão; dar nota geral, ranking, percentil ou comparação com outros atletas; mostrar o vídeo de um atleta a quem não é da família dele; prometer que o relatório da call é o do plano (o plano entrega a leitura de cada vídeo novo, no ritmo dele)".
- `OBJECOES`: acrescente o 13 a "Será que ele é bom o suficiente?" (pontos fortes e prioridades, os dois, sem inflar) e mantenha em "Isso de inteligência artificial funciona mesmo?". Nada de objeção nova.
- `LER` (ficha): a linha do 13 passa a ler o vídeo e a leitura do painel ("vídeo: sim/não, N lances, fonte"). O banner `#pz-painel` do apresentador avisa quando falta o vídeo: "Sem vídeo no painel: o 13 vai pra leitura ao vivo".
- `notas-do-gestor.md`: regere pelo script de sempre (`vm` + `roteiro.js`).

F. Bíblia (`processo-r2/index.html`) e PDFs.
- Regra 1 ("Gere o máximo de valor"): "a família vê o jogo do filho como nunca viu: o vídeo dele, lance a lance, com o relatório pronto" (slide 13).
- Pré-R2: acrescente "Suba o vídeo do atleta no painel, com a autorização do responsável, marque os lances e confira a fonte".
- Etapa 03: "Prove com o jogo dele" no lugar de "Prove ao vivo", e mantenha a leitura ao vivo como plano B.
- Regere os PDFs com `node processo-r2/gerar-pdf.mjs` e confira os dois de `distribuir/` como na v1 (abra os dois e, se forem o mesmo material, o novo vai por cima do velho).
</arquitetura>

<premissas>
O que você assume sem perguntar. Aplique o default, registre no relatório e deixe cada ponto fácil de reverter. "Confirmar" é o que o dono ainda precisa validar.

P1 (confirmar). O campo de futebol com o atleta na posição, do slide 10, foi leitura errada do pedido e fica como está, só pra não desfazer trabalho. Se o dono não o quiser, o 10 volta a ser "O encaixe" com a base de clubes, sem o campo e sem o cartão de pé e altura (o código `campoSvg`, `CAMPO_POSICOES`, `peTxt` e `alturaTxt` sai junto). Não faça isso sem o dono pedir.
P2. O lugar é o slide 13. A numeração de 01 a 25 não muda.
P3 (confirmar, a mais importante). O relatório vem de dados reais: lances marcados à mão no painel ou importados de um JSON do Zyron. O deck nunca estima nada. A fonte ("Zyron" ou "Equipe") é obrigatória e decide a cópia. Se o Zyron já exporta os lances (minuto, tipo, leitura), o dono me diz o formato e o importador passa a ler esse formato.
P4 (confirmar). O vídeo e o quadro expiram 90 dias depois do upload. É vídeo de menor: o padrão é apagar.
P5 (confirmar). Limites do vídeo: 5 minutos e 250 MB; mp4 H.264 recomendado.
P6. Qualquer papel que edita a apresentação (sdr, gestor, admin) pode subir o vídeo, desde que marque a autorização.
P7. Teste local, sem deploy. Pode usar `npx vercel dev` na pasta do painel com o `.env.local` (a store de Blob é a de produção): crie um atleta de teste ("Teste Leitura"), suba um vídeo curto, marque os lances e apague tudo no fim, inclusive os blobs. Nunca imprima o conteúdo do `.env.local`. Se `vercel dev` não funcionar, valide as rotas com funções chamadas por um script e o deck com a ficha gravada à mão.
P8. O quadro (poster) entra no slide 13 e na capa. Se a captura de quadro complicar o painel, entregue o 13 com poster e diga que a capa ficou pra depois.
P9. Os 2 minutos a mais do 13 saem do 08 e do 12 (E).
P10. O painel não ganha a paleta navy-seal.
</premissas>

<regras_duras>
Valem todas as da v1 (`APRESENTACAO_R2_REFORMULACAO_PROMPT.md`, `<regras_duras>`): sem promessa de contrato, clube, prazo ou renda; sem dado fabricado; um valor por vez; sem link de pagamento; português com acento e sem travessão; visual 1920x1080, nada abaixo de 24 px, só `.rise` de animação; militarismo só como estética; motor intacto. Mais estas:

1. Verdade da leitura. Nenhum número, lance, ponto forte ou prioridade que o painel não tenha guardado. Nenhum texto "gerado" pelo deck. A rosca e os contadores são contas sobre os lances marcados.
2. Fonte honesta. "O Zyron leu" só com `origem = 'zyron'`. Com `origem = 'equipe'`, nada na tela, na fala, no apresentador nem nas notas atribui a leitura ao Zyron. O painel não deixa publicar sem escolher a fonte.
3. Sem comparação. Sem nota geral, ranking, percentil, "melhor que X%", "potencial". Nada que o relatório não descreva num lance daquele vídeo.
4. Privacidade de menor. Vídeo só com autorização registrada (quem e quando). Só sai por `/api/video?id=` de um id válido, nunca por listagem, nunca com caminho de Blob exposto na resposta pública. `noindex`. Expira. É apagado com a apresentação. Nenhum log com o conteúdo do vídeo. O rodapé "Vídeo do atleta usado somente com autorização expressa do responsável legal" fica no slide 13.
5. Falha silenciosa pra família. Vídeo que não carrega, painel fora do ar ou leitura incompleta: o slide cai pro estado seguinte, sem mensagem de erro na tela da família. O apresentador é quem recebe o aviso.
6. Segredos. Não leia, imprima nem copie o `.env.local`. Não grave token em arquivo do deck. O deck só usa a URL pública do painel, como já faz.
7. O laranja-sinal continua só do olhômetro. Lance "a melhorar" não é laranja.
8. Texto vindo do painel (nota do lance, pontos fortes, prioridades, nome) entra na tela só como texto (`textContent`/`data-bind`). Se montar HTML com ele, escape tudo.
9. Fim de linha e bytes: como na v1. O `r2.css` é editado em bytes. Os arquivos do painel são LF.
</regras_duras>

<processo>
0. Backup antes de tocar em qualquer arquivo: o R2 pra `C:\Users\Me\Downloads\bum\backup-r2-2026-10-08-antes-da-leitura-do-atleta` e o painel (sem `node_modules` nem `.env.local`) pra `backup-painel-2026-10-08-antes-da-leitura-do-atleta`, e `processo-r2/` mais os dois PDFs de `distribuir/` pra `backup-biblia-2026-10-08-antes-da-leitura-do-atleta`. Todos dentro de `bum`, fora das pastas dos projetos.
1. Leia, nesta ordem: `APRESENTACAO_R2_REFORMULACAO_PROMPT.md` (contexto e regras da v1), `referencias-r2/painel-relatorio-referencia.webp`, o painel inteiro (`api/_base.js`, `api/apresentacoes.js`, `api/publico.js`, o `index.html` do painel e o `vercel.json`), `node_modules/@vercel/blob/dist/client.d.ts` e `index.d.ts` (só as assinaturas de `upload`, `handleUpload` e `get`), no R2 o slide 13 do `index.html`, o `deck.js` (`carregaPainel`, `data-video`, `.player`, `.chapters`, `thumb`, `derived`, apresentador, `LER`), o `roteiro.js` (ROTEIRO 13, OBJECOES, CHECKLIST, PROIBIDOS), a variação técnica e o `processo-r2/index.html` (texto).
2. Poste um plano curto no chat e siga em frente sem esperar resposta. Pare só nos casos de `<parar_e_perguntar>`.
3. Implemente nesta ordem: modelo e `limpaLeitura` (`_base.js`), rotas (`leitura-upload`, `leitura`, `video`, `publico`), CSP, tela do painel, componente do relatório (um só, usado na prévia do painel e no deck: desenho em SVG/HTML sem biblioteca, sem CDN), slide 13 e motor do deck, ficha e apresentador, técnica, roteiro e notas, pente fino de exclusividade (D), Bíblia e PDFs.
4. Verifique (`<verificacao>`) e só então escreva o relatório.
</processo>

<verificacao>
- `node --check` em tudo que é JS (deck, roteiro, técnica, rotas e `_base.js`; nas rotas, `node --check` aceita ES module com `.mjs` ou use `node --input-type=module --check`).
- Painel, de verdade: com `vercel dev` (P7), faça login, crie o atleta de teste, marque a autorização, suba um mp4 curto de uns 20 MB e outro de uns 150 MB (gere com `ffmpeg` se houver; se não houver, use um vídeo qualquer que o dono já tenha na máquina: pergunte antes de abrir pasta pessoal), cancele um upload no meio, marque 12 lances, salve, recarregue e confira que tudo voltou. Importe um JSON válido e um com erros (tipo fora da lista, `t` maior que a duração, texto com `<script>`): o válido entra, o inválido vira lista de erros e o texto sai sem HTML.
- `/api/video`: `curl -s -D - -o NUL -H "Range: bytes=0-1023"` devolve 206 com `Content-Range`; sem autorização ou id errado devolve 404; depois de apagar, 404. Confira também `Accept-Ranges` e que a barra do player pula (no Chrome headless, `currentTime` depois de um `seek`).
- `/api/publico`: sem login, só os campos permitidos. Procure na resposta "videos/", "autorizadoPor" e "venceEm": não podem aparecer.
- Deck: grave `je-r2-ficha` no `localStorage` com `_leitura` e `_video` (a URL do vídeo de teste) numa página temporária fora do projeto e abra o 13. Screenshots 1920x1080, uma execução por vez, nos três estados e nos quatro avanços: vídeo e leitura, só vídeo, nada; com `origem` Zyron e Equipe; com 4, 5, 9, 10 e 40 lances (a rosca some abaixo de 5 e a porcentagem abaixo de 10); com nota de 70 caracteres e com nome longo. Olhe cada imagem: texto cortado, sobreposição, legibilidade a 24 px, a chamada do lance sobre o vídeo, marcadores sem laranja.
- Apresentador: os lances aparecem como capítulos clicáveis do 13 e pulam o vídeo na tela da família; o aviso de "sem vídeo no painel" aparece; a ficha sincroniza entre as janelas.
- Procure "undefined", "null", "NaN", "{{", "overall", "percentil", "scouter", qualquer travessão (o longo, U+2014, e o curto, U+2013) e "o Zyron leu" perto de `equipe` em tela, roteiro, técnica, notas e Bíblia.
- Números de slide: nada mudou de lugar, mas confira por script que toda menção a "slide 13" e "no 13" ainda faz sentido.
- Fim de linha por arquivo (conte os bytes, não use `grep`) e `diff` do `r2.css` contra o backup.
- Total de `min` até 59 e 25 slides.
- Apague tudo que o teste criou: o atleta de teste, os blobs (`list` no prefixo `videos/` e `apresentacoes/`), a ficha gravada no navegador.
- Abra os dois PDFs da Bíblia.
</verificacao>

<entrega>
Relatório final no chat, curto (uns 40 linhas), português do Brasil, sem travessão:
1. O que mudou, por arquivo, uma linha cada (painel, deck, técnica, Bíblia).
2. Como ficou o fluxo, em 6 linhas: do upload à tela da família, com os estados e o que cai pra leitura ao vivo.
3. O que provou funcionar e como: upload grande, seek por Range, privacidade da rota pública, expiração, apagar em cascata. E o que NÃO conseguiu provar.
4. P1 a P10, uma linha cada: o que usou e o que muda se o dono disser o contrário.
5. As três frases mais fortes que entraram no 13 e as de exclusividade dos slides 01, 02, 05, 24 e 25.
6. Pendências que só o dono resolve: os deploys (painel antes, depois o R2 e a técnica; a ordem importa porque o deck novo chama rotas que só existem no painel novo), a Bíblia, o formato de exportação do Zyron (P3), validade de 90 dias e limites do vídeo (P4 e P5), o destino do campo de futebol do 10 (P1), quem vai marcar os lances na rotina (tempo por vídeo).
7. Onde os playbooks ficam inconsistentes (só listar) e que os `APRESENTACAO_R2*.md` seguem desatualizados.
8. Como abrir e testar local, e a frase: "Não publicado. Aguardo o seu ok pro deploy."
</entrega>

<parar_e_perguntar>
Não pare pelas premissas: aplique o default e registre. Pare e pergunte, uma rodada só, curta, se: (a) o backup falhar; (b) o `get()` do Blob privado não permitir servir o vídeo em pedaços e nenhum plano B simples funcionar; (c) o upload direto pro Blob privado não funcionar com o SDK instalado; (d) o código local divergir do descrito aqui de um jeito que muda a arquitetura; (e) uma regra dura entrar em conflito com um pedido do dono (por exemplo, ele querer um número que o painel não tem, como nota geral); (f) precisar abrir arquivo pessoal do dono pra ter um vídeo de teste.
</parar_e_perguntar>
