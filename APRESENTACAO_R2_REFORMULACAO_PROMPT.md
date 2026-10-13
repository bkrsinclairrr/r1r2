# APRESENTACAO_R2_REFORMULACAO_PROMPT.md

Versão: v1 (08/10/2026)
Prompt pro Opus 5.5 reformular o deck da R2: inimigo comum (o olhômetro contra a IA), exclusividade do atleta, o campo dele, copy incisiva e paleta navy-seal, tudo ancorado na Bíblia das Vendas. É só o briefing: nada foi aplicado. Fonte editável do R2: `C:\Users\Me\Downloads\bum\jogador-de-elite-r2` (fora do repo, sem git). Deck publicado: https://jogador-de-elite-r2.vercel.app/. Bíblia das Vendas: https://bibliadasvendas-rho.vercel.app/ (fonte local: `processo-r2/index.html`, PDF em `distribuir/`).

Nota (08/10/2026, depois da execução): o "campo" do pedido NÃO era o campo de futebol. Era um painel com o vídeo do atleta e um relatório na parte de IA. A correção e o que construir estão em `APRESENTACAO_R2_LEITURA_ATLETA_PROMPT.md` (v2). Esta v1 já foi aplicada no deck local.

Changelog:
- v1: criação, a partir do deck local do R2 (25 slides, três planos vitalícios), da Bíblia das Vendas (processo padrão da R2, v1 de 07/10/2026) e de duas referências visuais em `referencias-r2/` (campo e cartão do atleta).

Como usar:
1. Leia `<premissas>` e corrija o que estiver errado antes de enviar. É o que o Opus vai assumir sem perguntar. A mais importante é a P1: eu não consegui ver a imagem que você citou no pedido do campo, e usei os prints da pasta `referencias-r2/` como referência. Se a imagem era outra, troque os arquivos antes de enviar.
2. Abra o Opus 5.5 com acesso a `C:\Users\Me\Downloads\bum` e a este repo. Envie tudo abaixo da linha marcada, ou escreva: "Siga o prompt do arquivo APRESENTACAO_R2_REFORMULACAO_PROMPT.md".
3. O Opus não publica nada. Você abre o deck local, confere e só então pede o deploy.

=============== COPIE DAQUI PRA BAIXO ===============

<tarefa>
Você vai reformular o deck da R2 do Jogador de Elite, a ferramenta que o Gestor de Carreiras usa na call de fechamento com pai, mãe e atleta, pra ele ficar muito mais persuasivo, incisivo e pessoal, sem mudar o que a casa vende. A régua é a Bíblia das Vendas, o processo padrão da R2: o deck tem que executar aquele processo na tela, etapa por etapa, e cada slide tem que desarmar uma objeção antes de ela aparecer.

O dono pediu cinco coisas:
1. Um inimigo comum: o olhômetro, o jeito de avaliar jogador a olho, em poucos minutos, sem dado e sem acompanhamento depois. Do outro lado, a IA (o Zyron), que lê cada lance do vídeo com critério. Família, atleta e Gestor ficam do mesmo lado da mesa.
2. Exclusividade do atleta: o deck tem que parecer o dossiê dele, feito só pra ele, não uma apresentação que roda igual pra todo mundo.
3. Um campo, como na referência: o campo de futebol com o atleta marcado na posição dele, mais um cartão com os dados dele.
4. Persuasão incisiva e material mais completo: cortar rodeio, afirmar, contrastar, e fechar as lacunas que o processo da Bíblia pede e o deck ainda não cobre.
5. Paleta navy-seal: navy profundo, areia, verde-oliva, aço, com um laranja-sinal só pro inimigo.

O que fica como está: o vídeo do Zyron, o áudio do depoimento da mãe, a leitura ao vivo (IA na Prática), a AGN, os três planos com nomes, preços, vantagens, vitalício, garantia e 10x sem juros, e o motor (apresentador, ficha, painel, sincronização). Reformular é mexer na ordem, na tela, na copy e na identidade, não nas promessas.

O que entregar:
1. O deck padrão e a variação técnica reformulados.
2. Modo apresentador, roteiro, objeções e `notas-do-gestor.md` coerentes com a nova ordem.
3. A Bíblia (`processo-r2/index.html` e os dois PDFs de `distribuir/`) atualizada nas referências de slide e nos dois slides novos. A paleta da Bíblia não muda.
4. Os campos novos do painel, só localmente (ver P5).
5. Um relatório final curto, no formato de `<entrega>`.

Limites: não faça deploy de nada (deck, painel, Bíblia), não rode git nem commit no repo `mnkk`, não edite os playbooks, os docs `APRESENTACAO_*.md` nem o R1. O que fazer neles entra só no relatório.

Escreva pro dono: português do Brasil, informal e direto, sem travessão (nem o longo nem o curto) em nenhum texto: tela, roteiro, notas, comentário de código, relatório. Use ponto, vírgula, dois-pontos ou parênteses. Faixa de número é "01 a 03".
</tarefa>

<palavras_do_dono>
Fonte primária, transcrita com ortografia ajustada, sem mudar as palavras. Em dúvida entre este briefing e as palavras abaixo, vale o que o dono escreveu.

"Vamos gerar um prompt pra reformular o R2. Se baseie na Bíblia das Vendas (https://bibliadasvendas-rho.vercel.app/) e refaça, sendo um material muito persuasivo, que vai ter a exclusividade do atleta, vai ter um campo conforme na imagem, que vai ser do jogador. Trabalha o inimigo em comum: os avaliadores, os caras que fazem no olhômetro, que com IA ela analisa com precisão. O vídeo você deixa, áudio e tal. Seja mais persuasivo, atue de uma forma incisiva. Seja melhor. Aperfeiçoe isso. Mais completo. Paleta de cores meio navy-seal."

Leituras adotadas onde as palavras deixam margem (todas entram no relatório):
- "Bíblia das Vendas" é o `processo-r2/index.html` (17 slides, "O processo de venda que fecha o plano na call"), o mesmo conteúdo do link. É a doutrina: o deck obedece a ela, e onde o deck divergir dela, o deck muda.
- "Um campo conforme na imagem, que vai ser do jogador": o campo de futebol (tático, visto de cima) com o atleta marcado na posição dele, mais um cartão com os dados dele. A referência está em `referencias-r2/campo-time-sombra.png` (o campo, com o jogador em destaque no meio de uma formação 4-3-3) e `referencias-r2/cartao-atleta.png` (o cartão do atleta). São de uma plataforma de terceiros: serve de referência de estrutura, não de identidade (ver P1).
- "Inimigo em comum": o olhômetro, que é um método, não uma pessoa. O avaliador de peneira faz o que dá em vinte minutos com dezenas de garotos. O deck ataca o método, não o profissional, e não ataca clube nenhum.
- "A IA analisa com precisão": precisão no sentido do que o Zyron faz de verdade, e só isso: lê cada lance do vídeo que a família envia, com o mesmo critério pra todo atleta, e entrega relatório com a evidência em vídeo de cada ponto. Nunca percentual de acerto, nunca "a IA não erra" (ver `<regras_duras>`, item 2).
- "O vídeo você deixa, áudio e tal": o vídeo do Zyron, o vídeo dos clubes e o áudio da mãe ficam, com o mesmo arquivo e o mesmo comportamento. Só a pele do player acompanha a paleta nova.
- "Navy-seal": estética, não militarismo. Navy, areia, oliva, aço, rótulos de dossiê. Sem insígnia, emblema, tridente, arma, soldado, caveira, nem referência a unidade militar real. O público são famílias de atletas de 13 a 17 anos.
- "Mais completo": os dois slides novos (o olhômetro e o campo), a Bíblia visível no apresentador (etapa e objeção que cada slide desarma) e o pente fino na copy de todos os slides.
</palavras_do_dono>

<contexto>
Jogador de Elite é uma assessoria de carreira pra atletas de base (13 a 17 anos). O deck da R2 é a ferramenta do Gestor de Carreiras (o Closer) na segunda call, com pai, mãe e atleta juntos, em tela compartilhada. A família já fez a R1 com o estrategista esportivo (o SDR), viu o deck da R1 e combinou decidir na R2. Chega ansiosa e meio desconfiada. Desconfiança se vence com prova concreta, e uma promessa que não se sustenta derruba a confiança no resto.

Como a casa vende (PLAYBOOK_CLOSER v9 e Bíblia):
- A gente seleciona, a família também escolhe. O investimento é o custo mínimo pra estrutura existir, e o lucro vem do contrato profissional do atleta.
- Um valor por vez, na tela e na fala. Depois do número, silêncio. Descer de plano é pelo escopo, nunca por desconto.
- Garantia antes do número. Link de pagamento fora do deck: acertado o plano, o Gestor manda pelo WhatsApp, na call, só depois do sim.
- Palavras da casa: "assessoria" (nunca "mentoria", "programa" ou "pacote"), "o Zyron" no masculino, "encaminhado" nunca vira "contratado". Nunca se promete contrato, clube, prazo ou renda.

Quem é quem (use estes termos):

| Termo | Uso |
| --- | --- |
| o Zyron | IA própria. Lê o vídeo que a família envia, lance a lance. Nunca "jogos inteiros". Sempre no masculino |
| estrategista de carreiras | Quem acompanha o atleta com o Zyron (antes era "scouter"). Na tela, "scouter" não aparece |
| gerente de carreira | Acompanha todo dia e organiza a ida ao clube (Legacy) |
| estrategista esportivo | Cargo do SDR, quem fez a R1. No PRO e no Legacy, também o profissional que liga toda semana |
| analista de performance | Quem manda o relatório quinzenal do Scouting |
| David Willer | Rosto da casa. Assessoria individual todo mês no Legacy |
| Gestor de Carreiras | Quem apresenta a R2 |
| o olhômetro | Palavra da casa pro jeito de avaliar a olho, em poucos minutos |
| Assessoria PRO | Nome atual do antigo "Scouting PRO". Feminino: "a Assessoria PRO" |
</contexto>

<a_biblia_em_uma_pagina>
O que a Bíblia manda, e onde isso vive no deck novo. Leia `processo-r2/index.html` inteiro antes de começar (só o texto: o CSS e as fontes em base64 não interessam).

| Bíblia | No deck |
| --- | --- |
| A R2 não é apresentação, é planejamento de carreira. A família tem que se sentir avaliada, não vendida | Tom e títulos de todo o deck. Slides 02 e 19 |
| Regra 1, gere o máximo de valor: leitura ao vivo do Zyron | Slide 13, intacto e reforçado pelo campo (10) e pela virada (04 a 11) |
| Regra 2, feche na call: combinado de decidir hoje, dito em voz alta | Slide 03, com o combinado visível na tela ("Pode ser não, tudo bem. Só não vale vou pensar") |
| Regra 3, antecipe objeções | Cada slide desarma uma objeção. O apresentador passa a mostrar qual (ver `<arquitetura>`, E) |
| Pré-R2: ficha, caso espelho, teste do deck | `CHECKLIST`. O espelho é plantado no 02 e revelado no 16 |
| Etapa 01, conexão: nome, "você foi escolhido" | Slides 01 a 03 |
| Etapa 02, dor e sonho: "0 a 10", "o olhômetro analisou o teu jogo de verdade?", silêncio | Slides 03 e 04. O olhômetro sobe pra antes do plano |
| Etapa 03, o plano: tripé Ser visto, Ser preparado, Ser apresentado; prova ao vivo; caso espelho | Slides 05 a 16 |
| "Você vende carreira. Não assessoria. Não relatório." | Nenhum título de slide fala em relatório, encontro ou assessoria como produto. Fala do atleta chegando no clube |
| Etapa 04, fechamento: ordem do valor (régua, conta, filtro, contrato, garantia, planos, número) | Slides 17 a 24, na mesma ordem |
| Escada do sim | Slide 19 |
| Planos pelo ritmo, o Legacy abre | Slide 23. O 24 é o número |
| Pergunta de ouro: "O que tá faltando pro sim?" | Slide 24 (fala e apresentador) |
| Etapa 05, próximo passo: link, registro, boas-vindas, indicação; Modo B | Slide 25 e `FOLLOWUP` |

Gatilhos que a Bíblia rotula (compromisso e consistência, autopersuasão, aversão à perda, prova social, autoridade, segurança, urgência, ancoragem): mantenha onde estão, só com dado real. A urgência é a janela de idade, que é fato. A escassez é a turma de 10 do Legacy, só com o número real da ficha.
</a_biblia_em_uma_pagina>

<fonte_da_verdade>
- Base: a cópia local `C:\Users\Me\Downloads\bum\jogador-de-elite-r2`. Parta dela, nunca do publicado.
- `assets/roteiro.js` (ROTEIRO, OBJECOES, FOLLOWUP, PLANOS, CHECKLIST, PROIBIDOS) é a fonte única da fala e dos planos. `assets/deck.js` é o motor (palco, apresentador, ficha, painel). `assets/deck.css` e `assets/r2.css` são o visual. `index.html` tem os 25 slides. `assets/zyron-desenhos.js` desenha o Zyron. `assets/variacoes/tecnica.js` e `variacoes/tecnica/index.html` são a variação técnica. `variacoes/index.html` é a página de escolha. `notas-do-gestor.md` é o espelho em texto do roteiro (fora do deploy pelo `.vercelignore`).
- Bíblia: `C:\Users\Me\Desktop\mnkk\processo-r2\index.html`, `fonts.css` e `gerar-pdf.mjs` (regera os PDFs em `distribuir/`). O site https://bibliadasvendas-rho.vercel.app/ tem o mesmo conteúdo, mas não achei a pasta de publicação dele no repo nem em `bum`: não tente publicar, só liste no relatório.
- Painel: `C:\Users\Me\Downloads\bum\jogador-de-elite-painel` (`api/_base.js` com `CAMPOS`, `index.html` com `GRUPOS`).
- Doutrina e vocabulário: `PLAYBOOK_CLOSER.md` (regras da casa, seções 07 e 16) e `CASOS.md` (itens 0 e 3), no repo `mnkk`.
- Fim de linha (conferido em 08/10/2026 contando bytes, não com `grep`): `index.html`, `assets/roteiro.js`, `assets/deck.js`, `assets/deck.css`, `assets/variacoes/tecnica.js`, `variacoes/tecnica/index.html` e `notas-do-gestor.md` são CRLF. `variacoes/index.html` e `assets/zyron-desenhos.js` são LF. `assets/r2.css` é misto (as 18 últimas linhas, do comentário "revelação item a item" pro fim, são LF) e tem bytes Latin-1 em comentários, ou seja, não é UTF-8 válido. Regra: edite o `r2.css` em bytes (Python `rb`/`wb`, trocas codificadas em UTF-8) e compare com o backup. Nunca leia e regrave o `r2.css` com `readFileSync(..., 'utf8')` nem com a ferramenta de edição (ela normaliza tudo pra CRLF). Os outros arquivos do R2 são UTF-8 válido, mas a ferramenta de edição pode gravar LF: confira com contagem no fim.
- Não abra `assets/fonts/fonts.css` (base64, 640 KB), os vídeos nem o áudio.
</fonte_da_verdade>

<estado_atual>
Os 25 slides do local: 01 Capa · 02 Por que você · 03 Alinhamento · 04 O planejamento de carreira · 05 E se? · 06 Zyron · 07 O Zyron trabalhando (vídeo) · 08 Como o Zyron funciona · 09 Olhômetro ou dados reais · 10 O encaixe · 11 A base do Zyron · 12 O que ninguém mais tem · 13 IA na Prática (ao vivo) · 14 Depoimento de uma mãe (áudio) · 15 Nem tudo é talento · 16 AGN Football · 17 O valor real (R$ 30.000 por ano, sete frentes, revelação item a item) · 18 Até lá, a gente investe · 19 Não é pra qualquer um (escada do sim, turma de 10 no Legacy) · 20 Quando a gente ganha · 21 Garantia total · 22 A vaga (Legacy) ou O começo (PRO e Scouting) · 23 Os planos (três colunas, `id="planos"`) · 24 O investimento (`id="silencio"`) · 25 Bem-vindo. Tempo de tela somado: uns 56 min (a call é de 45 a 60).

O que já existe e você reaproveita:
- A capa já tem um dossiê (`data-dossier="closed"`, classe `dz-tilt`, função `dossierClosed()` no `deck.js`) e o 02 tem o cartão "Perfil aprovado" (nome, posição, idade, cidade, vindos do painel). A linguagem de dossiê é do deck.
- O 09 já compara olhômetro e Zyron em cinco linhas (quanto do jogo é visto, atenção, o que fica registrado, depois, quem fica sabendo de você). O 12 compara "Sozinho, na peneira" e "Com a gente" em quatro linhas e fecha com "O olhômetro pode não ter visto você. O Zyron viu." O 10 diz "Todo elenco tem uma lacuna". O 11 mostra a base de mais de 250 clubes e dez deles na tela.
- Variáveis da ficha (`data-bind`, `data-if`, `data-ifnot`, `data-step`): nome, idade, posicao, cidade, origem (origemZyron, origemForm, origemOutro), caracteristicas, experiencia, vagas, plano, gerente, faixa, caso espelho e outras. `AID` vem de `?a=<id>` e o `carregaPainel` busca o painel.

Diagnóstico (confira lendo `index.html` e `roteiro.js`; é o porquê da reformulação):
1. O olhômetro só aparece no 09, depois de oito slides, e volta no 12. A Bíblia manda a pergunta do olhômetro na etapa de dor e sonho, antes do plano. Hoje o inimigo chega tarde.
2. A capa não tem inimigo nem gancho: apresenta o plano, não a tensão.
3. A personalização é nome, posição, idade e cidade num cartão do 02. Em nenhum slide o atleta aparece num lugar, numa posição, dentro do jogo.
4. O 10 e o 11 têm um minuto cada e dizem coisas que pedem uma imagem só: o elenco tem lacuna, e tem 250 clubes procurando perfil.
5. O `OBJECOES[].slides` diz qual slide responde cada objeção, mas o apresentador não mostra o inverso (o que cada slide desarma) nem a etapa da Bíblia em que a call está.
</estado_atual>

<direcao_criativa>
Direção, não texto final. Os exemplos de linha mostram o tom e já passam pelas regras de verdade. Reescreva com a ficha do atleta em mente.

1. O inimigo comum: o olhômetro.
- Ele ganha nome, rosto gráfico e cor. O laranja-sinal (`--signal`) é dele e só dele: aparece em tudo que é olhômetro (a coluna dele, o selo, o risco), nunca em decoração. Quando o Zyron entra, a cor muda pra azul-gelo (`--ice`). O olho do espectador aprende sem texto: laranja é o que vem ferindo, azul é a resposta.
- Escalada em cinco batidas: gancho na capa (01), definição (04), a resposta (07 a 09), o duelo (11 e 12), a virada pro atleta (13: o jogo dele lido ao vivo). Depois, o inimigo vira prova de que o problema nunca foi o atleta (15, 20, 25).
- Define o inimigo pelo método, com quatro fatos que a família reconhece (use o que ela contou na R1: [peneiras]): um avaliador, poucos minutos, dezenas de garotos, nenhum acompanhamento depois. O que o olhômetro vê é "os lances que calharem de ser vistos".
- O Zyron é a resposta, definida pelo que faz: lê cada lance do vídeo que a família enviou, com o mesmo critério pra todo atleta, e entrega o que treinar com a evidência em vídeo de cada ponto. "Precisão" aqui é lance a lance, medido, repetível, registrado.
- Linhas de direção: "Peneira é olhômetro." / "Um avaliador. Vinte minutos. Vinte e dois em campo." / "O olhômetro viu os lances que calharam de ser vistos." / "Não foi você que não deu certo. Foi o olhômetro." / "O olhômetro olha. O Zyron mede." / "O olhômetro pode não ter visto você. O Zyron viu."
- Respeite o roteiro atual: não cite clube como exemplo de quem usa dados ("os grandes clubes já escolhem jogador com dados há anos, por dentro" é a frase da casa, sem nome). Nada que chame o avaliador de incompetente: o método é que não dá conta.

2. Exclusividade do atleta: o deck é o dossiê dele.
- O nome dele nos títulos que já têm o nome e em mais três lugares: capa, campo (10) e Bem-vindo (25). Sem nome, o deck cai pra "Você", como hoje.
- Selo de dossiê na capa e nos cabeçalhos: "Dossiê · [nome]". Com `AID`, um código curto vindo do id do painel (os 8 caracteres finais, em caixa alta), como "Dossiê nº 7F3K2A9B". Sem `AID`, sem código. O código é só o identificador do registro dele, nunca um número de "vaga" ou "fila".
- O campo e o cartão (slide 10) são a peça central da exclusividade: o atleta se vê dentro do jogo.
- Exclusividade verdadeira: o filtro é real (o Zyron analisa, a equipe aprova) e o plano é montado com a história dele. A frase "Eu não falo com toda família" fica. "Exclusivo" como adjetivo de anúncio não entra; a exclusividade se sente pelo nome, pelos dados e pela posição dele na tela. Nada de "só hoje", "últimas vagas" ou contador inventado.

3. Persuasão incisiva (copy).
- Título: afirmação ou ordem, até sete palavras, verbo no presente, sem pergunta retórica fraca. Uma tese por slide.
- Contraste explícito: antes e depois, olhômetro e Zyron, sozinho e com a gente. Cada slide tem uma tensão e uma saída.
- Frase de tela curta: até 18 palavras. Corte "meio", "um pouco", "acho que", "de certa forma", gerúndio em fila e voz passiva.
- Número concreto só se for da casa e verdadeiro (250 clubes, 93% em até três meses, 75 no último mês, mais de dez anos, os valores da estrutura, os planos). Nenhum número novo.
- Quando fala com o atleta, fala com ele: ordem curta e direta ("Olha o seu lugar, [nome]."). Com os pais, a conta e o risco de esperar.
- O custo de esperar é fato, não ameaça: um ano parado é um ano a menos de janela de idade. Nada de "o que ele vai fazer da vida" na tela e nada que pressione o atleta (o roteiro já proíbe perguntar "você vai ser dos que não chegam?").
- Três pontos de pergunta e silêncio, marcados no apresentador: 04 (o olhômetro analisou o teu jogo de verdade?), 13 (o que vocês sentiram vendo o jogo dele lido assim?) e 24 (o número). Cada um com o "silêncio" dito na fala.
- Pente fino em todos os 25 slides: toda frase que o Gestor vai deixar na tela passa pelo teste "dá pra cortar uma palavra? dá pra trocar uma pergunta por uma afirmação? isso é verdade pro plano da ficha?". Registre no relatório, por slide, a linha que mais mudou.

4. Cobertura da Bíblia que o deck ainda não tinha (o "mais completo"):
- O olhômetro antes do plano (slide 04, novo).
- O campo e o cartão do atleta (slide 10, novo), com a volta no 25.
- O tripé Ser visto, Ser preparado, Ser apresentado dito na tela do plano (05) e amarrado aos três planos do 23 (o `passo` que o `PLANOS` já tem).
- O combinado de decidir hoje visível no 03.
- O apresentador com a etapa da Bíblia e o que cada slide desarma (ver `<arquitetura>`, E).
</direcao_criativa>

<identidade_visual>
Paleta navy-seal. Dark só, como o deck é hoje. Redefina os tokens por papel e troque os literais de cor em todo lugar (css, html, js, SVG). Procure por `#C9A24A`, `#E8CE8E`, `201,162,74`, `232,206,142`, `#7FAEFF`, `127,174,255`, `#07080A`, `#0A0D12`, `#14181F` e pelos nomes `--gold`, `--blue`, `--panel`.

| Token | Valor de partida | Papel |
| --- | --- | --- |
| `--bg` | `#060B14` | fundo, navy quase preto |
| `--panel` / `--panel2` | `#0A1422` / `#12233A` | cartões, navy profundo |
| `--line` | `rgba(200,214,232,.14)` | filetes |
| `--body` / `--muted` | `#C9D3DF` / `#7F93A8` | texto corrido e texto secundário (aço) |
| `--sand` / `--sand-l` | `#C8B88A` / `#E6DBB8` | era o dourado: carreira, o plano, destaque, o nome do atleta |
| `--olive` / `--olive-l` | `#6B7B45` / `#9DB06A` | aprovado, check, o campo, "o ideal". Olive só em fundo e linha, olive-l em texto |
| `--ice` | `#7FC4EA` | era o azul do Zyron: IA, dados, leitura |
| `--signal` | `#E2552B` | só o olhômetro, o risco e alertas |

Mantenha os nomes antigos como alias (`--gold` aponta pra `--sand`, `--blue` pra `--ice`) só se isso evitar regressão; o alvo é os nomes novos nos arquivos. Os valores acima são ponto de partida: ajuste a olho nos screenshots, e prove o contraste com script (texto corrido e texto médio, WCAG AA: 4,5 pra texto até 28 px, 3 pra texto grande) sobre `--bg` e `--panel`.

Linguagem visual, sem militarismo e sem imagem gerada por IA:
- Dossiê tático: filetes finos em areia, marcas de canto (os `brackets` que já existem, em areia ou gelo), coordenadas e códigos discretos, rótulos de dossiê em Barlow Condensed caixa alta com espaçamento largo ("DOSSIÊ", "PERFIL APROVADO", "EM CAMPO"), curvas de nível ou grade bem sutis no fundo (SVG inline, opacidade baixa). O `.zgrid` do Zyron vira grade em `--ice`.
- Fontes: as mesmas, locais (Saira Condensed, Barlow Condensed, Archivo). Nenhuma fonte nova, nenhum CDN. Sem estêncil.
- Foto: as que já existem (`tunel.jpg`, `kaio-01.jpg`, `joaozinho-02.jpg`, `agn-*`), com tratamento duotone navy/areia por CSS se ajudar. Nenhuma foto nova de soldado, arma, farda ou unidade.
- Vídeo e áudio: os mesmos arquivos. Os pôsteres (`poster-*.jpg`) ficam. A pele do player e do botão de áudio acompanham a paleta.
- Movimento: só `.rise`, como hoje. Todo slide funciona parado (compartilhamento de tela trava animação). O halo do atleta no campo é estático.
- A variação técnica usa a mesma paleta e a mesma estrutura, com voz mais sóbria.
</identidade_visual>

<arquitetura>
Direção recomendada. Se o código mostrar um jeito melhor, ajuste e justifique no relatório. As regras duras não mudam.

A. Ordem e numeração. Só os slides 04 a 11 mudam de lugar. Os slides 12 a 25 ficam exatamente nos mesmos números, porque a Bíblia, as objeções, o `LER`, as notas e os PDFs citam 12, 13, 17, 21, 23, 24 e 25 por número. O total continua 25.

| Novo | Slide | Antigo |
| --- | --- | --- |
| 01 | Capa: gancho com o inimigo + dossiê fechado | 01 |
| 02 | Por que você | 02 |
| 03 | O combinado (alinhamento) | 03 |
| 04 | O olhômetro (NOVO) | |
| 05 | O planejamento de carreira (tripé) | 04 |
| 06 | E se alguém visse cada lance seu? | 05 |
| 07 | Zyron | 06 |
| 08 | O Zyron trabalhando (vídeo) | 07 |
| 09 | Como o Zyron funciona | 08 |
| 10 | O seu lugar em campo (NOVO, funde o encaixe e a base) | 10 + 11 |
| 11 | Olhômetro × Zyron: a resposta | 09 |
| 12 a 25 | iguais | 12 a 25 |

Mapa pra remapear `OBJECOES[].slides`, os "slide NN" e "no NN" das falas e atenções, o `LER` do `deck.js`, as dicas da ficha, `tecnica.js`, `variacoes/index.html` e `notas-do-gestor.md`: 04→05, 05→06, 06→07, 07→08, 08→09, 09→11, 10→10, 11→10, o resto igual. Rode um script que lista toda ocorrência de `slide`, `slides:` e "no NN" e confira cada uma. Os slides 04 e 10 novos entram nas `slides` das objeções que eles respondem (ver `<arquitetura>`, D).

Tempo: o 04 soma uns 2 min, o 10 uns 2,5 (os dois antigos somavam 2). O total deve ficar em até 59 min. Se passar, enxugue 14, 19 ou os `min` do bloco do Zyron, e diga qual.

B. Slides novos e reformulados (o essencial; o resto é a copy do pente fino).

01 Capa. Mantém o dossiê animado, que ganha a pele nova (pasta navy, etiqueta areia). Selo "Dossiê · [nome]" e o código do `AID`. O gancho é o inimigo, sem depender da origem: "O olhômetro não viu o seu jogo." Quem veio do Zyron (`origemZyron`) ganha a segunda linha "O Zyron viu." Quem veio do formulário ou sem origem (`origemForm`, `origemOutro`) ganha "A gente leu a sua história." (a capa já ramifica por origem, só reaproveite). "Se você está vendo isso, é porque tem o que é preciso." fica: é o fio da conversa.

02 Por que você. Fica, com a pele nova e o "Perfil aprovado" mais forte. Plantar o espelho continua na fala.

03 O combinado. O combinado de decidir hoje fica visível na tela, em uma linha: "Vocês combinaram decidir hoje. Pode ser não. Só não vale vou pensar." As perguntas da Bíblia (0 a 10, "por que esse número?", aspiração, impacto) ficam na fala e no apresentador; a tela só mostra o que a família lê. Mantém os campos da ficha que já alimentam esse slide.

04 O olhômetro (NOVO). A dor, com o inimigo definido. Layout de direção: título "Peneira é olhômetro." e uma tabela de cinco linhas só com o lado do olhômetro (quanto do seu jogo é visto, atenção, o que fica registrado, depois, quem fica sabendo de você), em laranja-sinal; ao lado, uma coluna vazia, tracejada, rotulada "A resposta" (a resposta aparece no 11, que repete a tabela e preenche a coluna: o mesmo desenho, completo). Uma linha de fala na tela: "Não foi você que não deu certo. Foi o olhômetro." Na fala do Gestor: "Foi assim nas peneiras dele? [peneiras]" e a pergunta da Bíblia ("o avaliador analisou o teu jogo de verdade?"), seguida de silêncio. Desarma: "já tentamos peneira ou empresário", "será que ele é bom o suficiente?". Sem número novo: "vinte minutos de coletivo" e "dividida entre 22" são os que o 09 já usa, e o roteiro manda ajustar ao que a família contou.

05 O planejamento de carreira. Já é o plano dele: agora o tripé fica explícito na tela, com os três verbos da Bíblia ligados ao `passo` do `PLANOS` ("Ser visto", "Ser preparado", "Ser apresentado") e um fecho: "Talento sem os três fica parado em casa." O plano continua sendo o caminho do atleta (agora, todo dia, vitrine, quando o clube chamar, destino). Título de carreira, nunca de relatório ou de assessoria.

06 E se alguém visse cada lance seu? Fica como ponte.

07 a 09. Zyron, vídeo e cinco verbos. Mesmos arquivos e mesma ordem. O 07 passa a abrir como "a resposta ao olhômetro" (frase de título e cor azul-gelo). O vídeo e o áudio do vídeo ficam como estão.

10 O seu lugar em campo (NOVO). A peça central da exclusividade. Especificação:
- Referência: `referencias-r2/campo-time-sombra.png` (o campo vertical em cartão, formação 4-3-3, os marcadores anônimos, um deles em destaque com anel) e `referencias-r2/cartao-atleta.png` (o cartão com nome, posição, idade, pé, altura). Use a estrutura, não a identidade: sem roxo, sem logotipo, sem o nome "Time sombra", sem nenhum texto de lá.
- Campo em SVG inline, visto de cima, formação 4-3-3 como ilustração: GOL, LD, ZAG, ZAG, LE, VOL, MC, VOL, ALE, CA, ADD. Verde-oliva escuro com tom navy, linhas em areia a 35% (linhas de campo, círculo central, grandes áreas). Marcadores de 64 px ou mais com a sigla em 24 px ou mais. Legenda em 24 px: "Formação ilustrativa." Nenhum jogador real, nenhum escudo, nenhum clube escalado.
- Posição do atleta: o campo `posicao` da ficha (texto livre do painel) é normalizado (minúsculas, sem acento) e mapeado pro marcador: goleiro→GOL; lateral direito ou "ld"→LD; lateral esquerdo ou "le"→LE; zagueiro, zaga, defensor→ZAG (se vier "direito" ou "esquerdo", o da direita ou da esquerda); volante, primeiro volante→VOL; meia, meio-campo, meia central, armador→MC; ponta esquerda, extremo esquerdo→ALE; ponta direita, extremo direito→ADD; atacante, centroavante, camisa 9, segundo atacante→CA; "ponta" ou "extremo" sem lado→ADD. Escreva a tabela como dado editável (objeto no `deck.js` ou no `roteiro.js`), com o termo em caixa baixa sem acento. Sem `posicao`, ou posição que não casa: o campo aparece sem destaque, com a frase "O seu lugar entra aqui." e o apresentador avisa "preencha a posição na ficha". Nunca chute uma posição.
- O marcador do atleta: preenchido em areia, anel em azul-gelo estático, nome dele em 36 px ou mais em chip logo abaixo. O resto dos marcadores fica apagado (aço sobre navy).
- Cartão do atleta, ao lado do campo: nome, posição em destaque (caixa alta, areia), idade, cidade, pé (se houver), altura (se houver), o selo "Perfil aprovado" e o código do dossiê. Só mostra o que está preenchido (`data-if`), sem placeholder, "undefined" ou linha vazia.
- Proibido no cartão: nota geral ("overall"), barras de atributo, "FIN 92", porcentagens, "disponível", "contrato até". Nada que o Zyron não tenha lido e que a família não tenha visto ao vivo. O cartão é a ficha do atleta, não um ranking. A leitura do jogo dele é do 13 e é dita ao vivo.
- Mensagem: "Todo elenco tem uma lacuna." e a base, que sai do antigo 11: "Mais de 250 clubes procuram perfil." Mantenha a presença dos dez clubes do antigo 11 exatamente como estão hoje (leia o markup antigo e preserve o conteúdo, sem acrescentar nem trocar nenhum clube) numa faixa menor, se couber. Título direção: "O seu lugar em campo." Subtítulo de direção: "O Zyron encontra o perfil. A gente faz a ponte."
- O 25 (Bem-vindo) ganha o fecho: o mesmo campo, em miniatura, com o marcador agora preenchido e o nome dele ("Bem-vindo, [nome].").
- Desarma: "ele não é bom o suficiente", "isso funciona mesmo?", "o filtro é só marketing".

11 Olhômetro × Zyron. O antigo 09 vira a resposta do 04: a mesma tabela, a mesma ordem de linhas, agora com as duas colunas (olhômetro em laranja-sinal, Zyron em azul-gelo). Fecho de sempre: "Os grandes clubes já escolhem jogador com dados há anos, por dentro. Agora essa leitura joga do seu lado."

12 a 25. Mesmos slides, mesma ordem, pele nova e pente fino. Pontos que o dono pediu pra reforçar e que o deck já tem lugar pra eles:
- 12: o "olhômetro pode não ter visto você. O Zyron viu." fecha o duelo e liga na leitura ao vivo do 13.
- 13: o slide mais valioso (Regra 1 da Bíblia). A tela continua sem resultado; só o enquadramento muda: "O que aparecer agora fala só de você, [nome]." com o selo de dossiê.
- 17 a 24: a ordem do valor da Bíblia (régua, conta, filtro, contrato, garantia, planos, número) não muda.
- 19: a escada do sim fica com cara de compromisso: três degraus visíveis, uma pergunta por avanço.
- 24: o número, uma vez, e o silêncio. Nada de elemento novo na tela do número.
- 25: o fecho do campo. O resto do 25 (por plano) fica como está.

C. Dados e motor.
- `window.ROTEIRO`: reordene as entradas nas posições novas, crie as duas novas (04 e 10) no esquema atual (`nome`, `min`, `fala`, `perguntas`, `crm`, `atencao`), e ajuste as falas. Variável nova entra no mapa do `fill()` e no comentário do topo do `roteiro.js`.
- Ficha: o campo `posicao` já existe. Acrescente `pe` (Destro, Canhoto ou Ambidestro) e `altura` (em cm), opcionais, pro cartão do 10 (P5). `derived()` ganha o marcador do campo (`posId`) e o código do dossiê (`dossieCod`, vindo do `AID`). `cond()` já aceita `a|b`, `a&b`, `!a` e `k=v`.
- Campo e cartão: um renderizador SVG no `deck.js` (como o `dossierClosed()` e o `zyron-desenhos.js` fazem) que serve o 10 e a miniatura do 25. A miniatura dos slides (visão geral e apresentador) clona o slide e deve refletir a posição.
- Não quebre o motor (ver `<regras_duras>`, item 8).

D. Roteiro e objeções (voz do dono: frases curtas, "pro", "pra", "tô", "vocês", Gestor falando com [pai], [mãe], [atleta]).
- ROTEIRO 04: abertura da dor, a pergunta do olhômetro, o silêncio, a virada "não foi você". 2 min.
- ROTEIRO 10: o campo ("olha o seu lugar, [atleta]"), a lacuna, a base, e a pergunta "se imagina aí?". Sem prometer clube, sem dizer que existe vaga num clube específico: a lacuna é a ideia, não um fato sobre um clube.
- ROTEIRO 01, 03, 05, 07, 11: ajuste de fala pra nova ordem e pro inimigo.
- `OBJECOES`: remapeie os `slides`, acrescente o 04 em "Já tentamos peneira / empresário e não deu", em "Será que ele é bom o suficiente?" e em "Vou ver outras opções"; acrescente o 10 em "Será que ele é bom o suficiente?" e em "Isso de inteligência artificial funciona mesmo?". Nada de objeção nova: se achar que falta uma, liste no relatório.
- `CHECKLIST`: acrescente "Conferi posição, pé e altura do atleta (o campo do slide 10 depende da posição)" e remapeie os números de slide do teste de vídeo e áudio. `PROIBIDOS`: acrescente "dar nota ou atributo ao atleta; dizer que o Zyron tem percentual de acerto; chamar o avaliador de incompetente; citar clube como quem usa dados; dizer que existe vaga num clube específico".
- `FOLLOWUP`: sem mudança de conteúdo. O caso espelho do +1 dia fica.

E. Apresentador.
- Etapa da Bíblia: uma tabela `ETAPAS` no `roteiro.js`, com a lista de slides de cada etapa (Conexão: 01, 02, 03. Dor e sonho: 03, 04, 12. O plano: 05 a 16. Fechamento: 17 a 24. Próximo passo: 25). O apresentador mostra a etapa no cabeçalho do slide atual, e o 03 mostra as duas que ele cobre ("Conexão · Dor e sonho").
- O que o slide desarma: derive do `OBJECOES[].slides` (o inverso). O apresentador mostra "Este slide desarma: tá caro, já tentamos peneira". Sem dado duplicado: a fonte é o `OBJECOES`.
- Marcador de silêncio nos três pontos (04, 13, 24), usando o que o motor já tem pra o 24 (`id="silencio"`, tecla S). Não mude o comportamento do 24.
- Ficha: campos `pe` e `altura` no grupo "O atleta" do apresentador, e a dica do `posicao` diz que a posição desenha o campo do 10.
- `LER` (tabela de leitura da ficha com número de slide fixo): renumere e acrescente o que o 04 e o 10 leem.

F. Variação técnica. Mesmas posições, mesma paleta, copy própria, voz sóbria (par pra par, menos entusiasmo). O 04 e o 10 existem nela também: o 04 como "O método de avaliação por observação: o que ele deixa passar", o 10 como a mesma peça visual com legenda técnica. Atualize `tecnica.js`, `tecnica/index.html` e a página `variacoes/index.html`.

G. Bíblia. Em `processo-r2/index.html`: atualize as referências de slide ("slides 04 a 16", "slides 01 a 03", etc.) pra nova numeração, acrescente uma linha no que for da etapa 02 ("o olhômetro vem antes do plano: slide 04") e no tripé da etapa 03 ("o seu lugar em campo: slide 10"), e confira que cada preço e número de slide citado bate com o deck novo. Regere o PDF: `node processo-r2/gerar-pdf.mjs` escreve `distribuir/processo-de-venda-r2.pdf`. O `distribuir/Bibliadasvendas.pdf` é mais velho (data e tamanho diferentes) e tudo indica que é o mesmo material com outro nome: abra os dois pra confirmar e, se for, copie o novo por cima dele pra não circular a versão velha. O backup do passo 0 cobre os dois. O script confere fontes e avisa texto fora da margem. Título em Saira Condensed caixa alta precisa de entrelinha 1.0 ou mais (com 0.9, a cedilha encosta na linha de baixo). No Chrome headless com `--remote-debugging-port`, o `--user-data-dir` tem que ser caminho absoluto.

H. Painel (só local, sem deploy). Backup da pasta antes. Campo novo entra em três lugares: `CAMPOS` no `api/_base.js` (a rota `publico` só devolve o que está lá), `GRUPOS` no `index.html` e a ficha dos decks. Acrescente `pe` e `altura` ao grupo do atleta, com dica "desenha o cartão do slide 10 do R2". Procure nas dicas do painel qualquer número de slide do R2 e renumere. Se mexer demais, deixe só no deck (ficha local) e diga no relatório.
</arquitetura>

<premissas>
O que você assume sem perguntar. Aplique o default, registre no relatório e deixe cada ponto fácil de reverter. "Confirmar" é o que o dono ainda precisa validar.

P1 (confirmar). O "campo conforme na imagem" é o campo de futebol com o atleta marcado na posição, mais o cartão do atleta, e a referência são os dois prints de `referencias-r2/`. Eles vêm de uma plataforma de terceiros: use a estrutura, não copie nome, cor, logotipo, texto nem a nota geral. Se o dono quis dizer outra coisa (por exemplo, um campo de preenchimento da ficha), pare e pergunte.
P2. Paleta navy-seal nos tokens de `<identidade_visual>`, como ponto de partida. Vale pro R2 (padrão e técnica). O R1, o painel e a Bíblia ficam na paleta atual, então o R1 e o R2 passam a ter peles diferentes: diga isso no relatório.
P3. A ordem de `<arquitetura>`, A: 04 e 10 novos, 04 a 11 remapeados, 12 a 25 intactos, total 25.
P4. Planos, preços, vantagens, vitalício, 10x, garantia, âncora de R$ 30.000, turma de 10 e vagas: nada muda. Só a pele, a ordem e a copy de persuasão. Se uma frase nova sugerir promessa que o plano não cumpre, ela não entra.
P5. Dois campos novos na ficha, opcionais: `pe` e `altura`. O cartão só mostra o que estiver preenchido.
P6. O código do dossiê é o final do `AID` em caixa alta. Sem `AID`, não aparece.
P7. A urgência é a janela de idade (fato). A escassez só entra com o número real da ficha (turma e vagas do Legacy). Nada de relógio, contador ou "últimas vagas" que a ficha não sustente.
P8. A variação técnica ganha os dois slides novos, a paleta e a mesma numeração.
P9. A Bíblia (texto e PDFs) acompanha o deck novo. O site da Bíblia não é publicado por você.
P10. Nenhum deploy: deck, variação, painel e Bíblia ficam locais até o dono pedir.
</premissas>

<regras_duras>
1. Nunca prometer contrato, clube, prazo ou renda. "Encaminhado" nunca vira "contratado". Todo slide que fale de clube, conexão ou David leva a nota legal que o deck já usa.
2. Incisivo não é enganoso. Proibido na tela, na fala e nas notas: percentual de acerto ou "precisão de X%" do Zyron; "a IA não erra"; "mais preciso que qualquer olheiro"; afirmar que clube ou avaliador X faz isso ou aquilo; chamar o avaliador de incompetente; escassez, urgência ou prazo que a ficha não sustente; pressão direta sobre o atleta ("o que você vai fazer da vida", "você vai ser dos que não chegam"). "Precisão" só no sentido de lance a lance, mesmo critério, evidência em vídeo.
3. Nenhum dado fabricado: sem nota geral, sem atributo, sem barra, sem porcentagem de desempenho, sem caso, clube ou número que o dono não deu. O Zyron lê o vídeo que a família envia, nunca "jogos inteiros". O resultado da leitura é dito ao vivo, no 13, nunca na tela antes.
4. Um valor por vez na tela, sempre. O 23 mostra os três planos como está. Descer de plano é pelo escopo, nunca por desconto. Sem link de pagamento em lugar nenhum do deck.
5. Linguagem: português do Brasil com acento, sem travessão. "Assessoria", nunca "mentoria", "programa", "pacote" ou "produto" na tela. "O Zyron" no masculino. "Estrategista de carreiras", nunca "scouter". "Assessoria PRO", nunca "Scouting PRO". Sem "etapa", "jornada", "onboarding", "passo a passo" nem "acessos" como rótulo de fluxo na tela da família (a palavra "Etapa" só aparece no apresentador, onde é a etapa da Bíblia).
6. Visual: tokens e classes existentes onde der (`deck.css`, `r2.css`), palco 1920x1080, título com 96 px ou mais, lista com 32 px ou mais, nada abaixo de 24 px (nem nota legal, nem sigla do campo, nem contador). Até cerca de 30 palavras corridas por slide, fora colunas e listas curtas. Nenhuma animação além da `.rise`. Todo slide funciona parado. Nenhuma imagem gerada por IA e nenhuma foto nova.
7. Militarismo só como estética de dossiê. Sem insígnia, emblema, tridente, arma, soldado, caveira nem unidade real. Sem a palavra "SEAL" na tela.
8. Não quebre o motor: sincronização família e apresentador (canal `je-r2`, chave `je-r2-ficha`), revelação por avanço (`data-step`), Silêncio (tecla S e `id="silencio"` no 24), visão geral (G), vídeo e áudio, ficha antiga salva no navegador (plano com nome antigo vira o certo; vazio vira Legacy), carregamento do painel (`?a=<id>`, `carregaPainel`).
9. Papéis verdadeiros: "o ideal" e "o mais completo" só no Legacy, "uma equipe do seu lado, por metade do Legacy" só no PRO. Sem "mais vendido", "mais escolhido" nem dado de popularidade. A conexão direta com clubes e AGN, os 15 encaminhamentos por mês, a turma e os 93% em até três meses são do Legacy: não atribua ao PRO nem ao Scouting.
10. Arquivos: preserve o fim de linha de cada um e os bytes Latin-1 do `r2.css` (ver `<fonte_da_verdade>`).
</regras_duras>

<processo>
0. Backup antes de tocar em qualquer arquivo: copie a pasta inteira do R2 pra `C:\Users\Me\Downloads\bum\backup-r2-2026-10-08-antes-da-reformulacao`, o painel pra `backup-painel-2026-10-08-antes-da-reformulacao` (os dois na pasta `bum`, fora das pastas dos projetos, senão vão junto no deploy) e `processo-r2/` e os dois PDFs de `distribuir/` pra `C:\Users\Me\Downloads\bum\backup-biblia-2026-10-08`. Confira contagem de arquivos e tamanho (o R2 tem dois vídeos de uns 75 a 78 MB).
1. Leia, nesta ordem: `processo-r2/index.html` (texto), `assets/roteiro.js` (inteiro), `index.html` do R2 (inteiro), `assets/deck.js` (`derived()`, `cond()`, `renderCtl`, `dossierClosed`, `LER`, `carregaPainel`, ficha), `assets/r2.css` e `assets/deck.css` (só pra achar cores e classes: `.cmp`, `.doc`, `.page`, `.pillars`, `.costs`, `.beneficios`, `.legal`, `.brackets`, `.zgrid`), `assets/zyron-desenhos.js`, `assets/variacoes/tecnica.js`, `variacoes/tecnica/index.html`, `notas-do-gestor.md` (cabeçalho e a estrutura) e, no repo `mnkk`, PLAYBOOK_CLOSER.md (regras da casa, seção 07, seção 16) e CASOS.md (itens 0 e 3). Veja as duas imagens de `referencias-r2/`.
2. Poste um plano curto no chat (slide a slide: o que muda, o que fica) e siga em frente sem esperar resposta: o dono aprovou o escopo ao pedir este trabalho. Pare só nos casos de `<parar_e_perguntar>`.
3. Implemente nesta ordem: tokens e pele (css, html, js, SVG), dados (`roteiro.js`: ROTEIRO, OBJECOES, ETAPAS, CHECKLIST, PROIBIDOS), motor (`deck.js`: campo, cartão, derived, apresentador), slides (`index.html`), variação técnica, notas, Bíblia e PDFs, painel local.
4. Regere o `notas-do-gestor.md` com um script Node que carrega `roteiro.js` num `vm` e escreve o formato das notas. O cabeçalho escrito à mão e o parágrafo do áudio no 14 são os únicos textos à mão; mantenha os dois.
5. Verifique (`<verificacao>`) e só então escreva o relatório.
</processo>

<verificacao>
- `node --check` em `deck.js`, `roteiro.js`, `tecnica.js` e `zyron-desenhos.js` (Node 24 está instalado).
- Screenshots em Chrome headless, 1920x1080, uma execução por vez (em paralelo não gera arquivo): `chrome.exe --headless=new --hide-scrollbars --window-size=1920,1080 --virtual-time-budget=6000 --user-data-dir=<pasta absoluta única por execução> --screenshot=<caminho de cygpath -m> "<url>#N"`. Tire os 25 slides do padrão com o Legacy na ficha e monte folhas de contato 3x3 com PIL, e olhe todas. Tire também o 10 e o 25 com cada posição (goleiro, lateral direito, zagueiro, volante, meia, ponta esquerda, atacante) e sem posição; o 13, 23 e 24 nos três planos; e o 04, o 10 e o 11 da variação técnica. Pra trocar a ficha, grave `je-r2-ficha` no localStorage com uma página temporária fora do projeto que grava e redireciona pro deck. Não deixe parâmetro de teste no deck. Olhe cada imagem: texto cortado, sobreposição com contador ou nota legal, quebra feia de linha, sigla do campo legível, marcador do atleta destacado, laranja só onde é olhômetro.
- Contraste: script que pega os tokens e confere texto corrido e texto médio sobre `--bg` e `--panel` (4,5 até 28 px, 3 pra texto grande). Liste os pares e o resultado.
- Procure "undefined", "null", "NaN", "{{", colchete solto, "overall", "%" fora dos números da casa, "scouter", "Scouting PRO", "garantido", "exclusivo", "SEAL" e qualquer travessão (o longo, U+2014, e o curto, U+2013) no texto da tela, no roteiro, na técnica, nas notas e na Bíblia.
- Procure números de slide velhos: um script que lista toda ocorrência de `slide`, `slides:` e "no NN" em `roteiro.js`, `deck.js`, `tecnica.js`, `variacoes/index.html`, `notas-do-gestor.md`, `processo-r2/index.html` e nas dicas do painel, e confira cada uma contra o mapa de `<arquitetura>`, A. Confira também, por script, que cada número em `OBJECOES[].slides` aponta pra um slide cujo título combina com a objeção.
- Sem link de pagamento e sem "3.997", "399,70", "kirvano" ou "pay." em lugar nenhum.
- Teste com a ficha antiga (plano com nome antigo), sem ficha, sem `AID` e com `?a=<id>` (o painel pode não responder localmente: confira que a tela cai na ficha do navegador sem quebrar).
- Confira que cada arquivo manteve o fim de linha de antes e que o `r2.css` bate com o backup fora das linhas editadas (`diff`).
- Confira o total de minutos (até 59) e o número de slides (25) na capa do `notas-do-gestor.md`.
- Abra os dois PDFs da Bíblia: texto cortado, fontes, número de slide citado.
- O preview local abre em `file:///C:/Users/Me/Downloads/bum/jogador-de-elite-r2/index.html`.
</verificacao>

<entrega>
Relatório final no chat, curto (uns 45 linhas), português do Brasil, sem travessão:
1. O que mudou, por arquivo, uma linha cada.
2. Mapa de slides antigo e novo, e a confirmação de que 12 a 25 ficaram nos mesmos números (ou o que mudou e onde renumerou).
3. As premissas P1 a P10, uma linha cada: o que você usou e o que muda se o dono disser o contrário. Inclua a leitura do "campo" (P1) e a diferença de pele entre R1 e R2.
4. Por slide, a linha de tela que mais mudou no pente fino (antes e depois, só dos 8 a 10 mais importantes) e as três frases mais incisivas que entraram.
5. O que o deck passa a desarmar, por slide (a tabela derivada do `OBJECOES`).
6. Pendências que só o dono resolve: deploy do deck (e da variação técnica), do painel (pra `pe` e `altura` chegarem pelo link `?a=`) e da Bíblia (de onde ela é publicada, que não está no repo); conferir os dez clubes do 10 com o jurídico; decidir se o R1 ganha a mesma pele; objeções novas que você achou que faltam.
7. Onde os playbooks ficam inconsistentes, só listar: PLAYBOOK_CLOSER.md e os espelhos `playbook-closer.html`, `distribuir/playbook-closer.html` e `vercel/playbook-closer/index.html` (citam números de slide do R2 e a ordem antiga). Diga também que `APRESENTACAO_R2.md`, `APRESENTACAO_R2_PROMPT.md`, `APRESENTACAO_R2_PLANOS_PROMPT.md` e `APRESENTACAO_R2_VARIACOES.md` seguem desatualizados.
8. Como abrir e testar local, e a frase: "Não publicado. Aguardo o seu ok pro deploy."
</entrega>

<parar_e_perguntar>
Não pare pelas premissas: aplique o default e registre. Pare e pergunte, uma rodada só, curta, se: (a) o backup falhar; (b) o código local divergir do descrito aqui de um jeito que muda a arquitetura (por exemplo, o 24 não ter mais `id="silencio"` ou o `OBJECOES` ter outro formato); (c) as imagens de `referencias-r2/` mostrarem outra coisa que não um campo e um cartão de atleta (P1); (d) uma regra dura entrar em conflito com um pedido do dono (por exemplo, um slide que só funcione com nota geral ou com número que não existe); (e) a paleta nova reprovar no contraste e a correção exigir mudar o papel de um token.
</parar_e_perguntar>
