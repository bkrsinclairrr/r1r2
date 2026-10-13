# APRESENTACAO_R2_VARIACOES.md

Versão: v8 (02/10/2026)
Variações do deck da R2 (Gestor de Carreiras, o Closer) publicado em
https://jogador-de-elite-r2.vercel.app/. O deck padrão continua intocado;
cada variação é uma página nova, com o mesmo motor e a mesma ficha.
Projeto local: `Downloads/bum/jogador-de-elite-r2`.

Changelog:
- v8: o bloco do Zyron do R1 (e se, Zyron, vídeo do Zyron, como funciona,
  olhômetro ou dados, o encaixe e a base de clubes) entrou nos slides 05 a
  11 do padrão e da técnica, logo depois do plano (04): o plano diz que o
  Zyron lê o jogo do atleta, e o bloco mostra como. Os slides seguintes
  andaram 7 posições (o investimento agora é o 22). 23 slides; os desenhos
  do encaixe e da rede ficam em `assets/zyron-desenhos.js`.
- v7: no deck padrão, o slide 08 (AGN Football) ganhou um avanço: a arte
  dos jogadores que passaram pela AGN entra grande por cima do slide (a
  mesma do R1), e o próximo avanço vai pro 09. A variação técnica não
  mudou: nela a AGN aparece uma vez só, de propósito.
- v6: no investimento (15), o parcelamento vira 10x sem juros de R$ 399,70
  (número um pouco menor) e a linha de baixo vira "Um atleta médio nosso
  fecha ganhando, em média, R$ 30 mil+ por mês" (texto fixo; o slide 12
  continua com a faixa da ficha, padrão R$ 20 a 30 mil+).
- v5: o investimento (15) abre sem preço; o avanço 1 mostra a âncora e
  R$ 3.997 por ano, menor; o avanço 2 mostra 12x sem juros de R$ 333,08 e
  a faixa de contrato (R$ 20 a 30 mil+). Saiu o "menos de R$ 11 por dia".
  O Silêncio para no avanço 1 (`data-silencio`), sem revelar o
  parcelamento.
- v4: no valor real (09), a soma da direita aparece no primeiro avanço e
  sobe a cada frente (6.500, 11.500, 14.000, 17.000, 20.500, 23.500,
  30.000); o último avanço destaca o total. No investimento (15), lista
  "Por um ano, você tem" com os seis benefícios e "A gente só ganha se
  você ganhar". O motor ganhou `data-valor`, `data-soma` e `data-marca`.
- v3: nova ordem do R2, igual no padrão e na técnica: o contrato ("hoje,
  um atleta que a gente coloca num clube...") passa pro 12, logo antes da
  garantia; o valor real (09) abre só com a pergunta e revela uma frente
  por avanço, com valores anuais que somam R$ 30.000 por ano; slide novo
  15, O investimento (R$ 3.997 por ano, acesso anual), que vira o slide do
  Silêncio e do fechamento. 16 slides. O motor ganhou a revelação item a
  item (`data-step`).
- v2: botão Variações na barra do deck (padrão e variações) e tecla V, que
  abrem `/variacoes/` sem digitar o endereço; o topo do apresentador mostra
  qual versão está aberta ("Deck padrão" ou o `VARIACAO_NOME` da variação).
- v1: sistema de variações e a primeira variação, a técnica ("já conhece a
  AGN, já é muito aprofundado no futebol").

---

## 1. Como funciona

| O quê | Onde |
| --- | --- |
| Página onde o Closer escolhe a variação | `/variacoes/` (`variacoes/index.html`). Abre pelo botão Variações na barra do deck ou pela tecla V, em qualquer versão. Só antes da call: não é tela pra família |
| Deck padrão (não muda) | `/` (`index.html`, `assets/roteiro.js`, `assets/deck.js`) |
| Variação técnica | `/variacoes/tecnica/` (`variacoes/tecnica/index.html`) |
| Roteiro da variação técnica | `assets/variacoes/tecnica.js` |

- A página da variação carrega, nesta ordem: `assets/roteiro.js` (o do
  padrão), `assets/variacoes/<slug>.js` (o da variação) e `assets/deck.js`.
  O arquivo da variação troca `window.ROTEIRO`, põe objeções próprias na
  frente de `window.OBJECOES` e acrescenta itens no fim de
  `window.CHECKLIST`. Planos, links de pagamento, follow-up e proibidos
  continuam os do padrão: mudou no `roteiro.js`, vale nas variações.
- Mesma ficha (`je-r2-ficha`) e mesmo canal (`je-r2`): o que o Closer
  preenche numa variação vale na outra. Por isso, uma variação aberta por
  call; duas abas de deck abertas ao mesmo tempo recebem os mesmos
  comandos do apresentador.
- O slug da URL é neutro de propósito (`tecnica`, nunca `conhece-agn`): se
  o Closer compartilhar a janela com a barra de endereço, a família não lê
  como foi classificada.

## 2. Regra pra criar a próxima variação (lead quente, lead frio)

1. Copie `variacoes/tecnica/` pra `variacoes/<slug>/` e
   `assets/variacoes/tecnica.js` pra `assets/variacoes/<slug>.js`. Troque o
   `<script>` da variação na página nova.
2. O motor depende de quatro posições: os slides 01 e 02 (botões de
   origem do lead no apresentador), o slide com `id="silencio"` (o
   investimento: botão Silêncio, "fale o número e pare", aba Fechamento e
   link de pagamento no apresentador), o slide com `#turma` (a vaga) e o
   último slide (boas-vindas). Elementos com `data-step="n"` aparecem um
   avanço por vez (o valor real, 16; a arte da AGN, 15; o investimento, 22); `data-soma` mostra a soma dos
   `data-valor` já revelados e `data-marca="n"` ganha destaque a partir do
   passo n.
3. A aba Ler antes tem os números dos slides fixos no `deck.js` (01, 02,
   03, 04, 08, 09, 11, 12, 15, 16, 17, 18, 19, 20, 21, 22, 23). Variação que
   muda só a copy mantém os 23 slides nessas posições, e a aba continua certa. Variação que muda
   a sequência (mais ou menos slides, outra ordem) deixa a aba Ler antes
   apontando pros números do padrão. Antes de criar uma assim, decida se
   o `deck.js` passa a aceitar a tabela vinda da variação
   (`window.LER || [...]`), que é uma mudança de uma linha no motor.
4. Objeções da variação: `slides` aponta pros números da própria variação.
5. Acrescente o cartão da variação em `variacoes/index.html`, com "quando
   usar" (sinais na ficha da R1) e "o que muda". Na página nova, mantenha o
   botão `data-act="variacoes"` na barra (com `style="width:max-content"`
   no `#hud`, senão o "Tela cheia" quebra em duas linhas) e defina
   `window.VARIACAO_NOME` no arquivo da variação.
6. Regras de conteúdo do deck valem igual: nenhum número, clube, caso ou
   depoimento que não esteja nos docs da casa; "encaminhado" nunca vira
   "contratado"; o Zyron é "o Zyron", com "scouter", nunca "agente"; notas
   legais nos slides com promessa de caminho; sem travessão.

## 3. Variação técnica: já conhece a AGN e entende de futebol

Quando usar (sinais na ficha da R1):
- Citou a AGN pelo nome ou já acompanha os atletas publicados lá.
- Pai, mãe ou atleta com vivência no meio: base de clube, federado,
  ex-jogador, técnico, contato com empresário.
- Fez pergunta técnica na R1: posição, categoria, janela, como o clube
  escolhe.

O que essa família precisa: não precisa ser convencida de que o mercado
existe nem de que a AGN é real. Desconfia de entusiasmo e de número solto,
porque já viu promessa no meio. Compra competência, precisão e interesse
alinhado.

A lógica de persuasão:
- Par pra par. Explicar o básico (peneira, olhômetro, o que é a AGN) é
  perder autoridade. O Closer fala menos e pergunta mais.
- Insight comercial (slide 12): informação a família já tem; o gargalo é
  operação todo dia, com dado e acesso à demanda. É o argumento que muda o
  "a gente mesmo consegue" em "a gente não consegue sozinho, todo dia".
- Autopersuasão por calibração: perguntas em que o pai mostra o que sabe
  e chega sozinho à conclusão ("isso bate com o que vocês veem?", "o que
  faltou em cada tentativa?", "o que esse áudio mostra?", "bate com o que
  vocês já pesquisaram?").
- Prova pelo processo, não pela vitrine: a AGN aparece uma vez (15), como
  referência que eles já têm; o slide mostra o que vem antes do post.
- Interesse alinhado (19) no lugar do entusiasmo: a gente só lucra no
  contrato.
- A dor desta família é a janela: quem conhece o meio sabe que categoria
  passa e não volta. A família estima o prazo no 03, e o Closer usa esse
  prazo de volta no relógio do 21.
- Mesma doutrina do PLAYBOOK_CLOSER: combinado de decidir hoje,
  necessidade explícita, ancoragem antes do número, garantia antes do
  número, silêncio, Modo A e Modo B.

Slide a slide (o que muda na tela em relação ao padrão):

| Slide | Padrão | Técnica |
| --- | --- | --- |
| 01 | "Se você está vendo isso, é porque tem o que é preciso." | "Vocês conhecem o jogo. Hoje, direto ao plano." (formulário: "Montado a partir da sua trajetória.") |
| 02 | "Você foi escolhido." | "Você passou no filtro." / "O Zyron leu o seu vídeo com dados" / rótulo "O que os dados mostraram" |
| 03 | "Deixa eu confirmar o que eu já sei." | "Vocês já contaram. Eu só confirmo." |
| 04 | "Esse plano só existe porque você tem potencial..." e a etapa "Vitrine" com AGN | "Talento sem operação fica parado. Isso aqui é a operação." e a etapa "A ponte", sem AGN |
| 05 | E se? (bloco do Zyron, trazido da R1) | Igual (o roteiro do bloco vem do padrão) |
| 06 | Zyron | Igual (o roteiro do bloco vem do padrão) |
| 07 | O Zyron trabalhando (vídeo) | Igual (o roteiro do bloco vem do padrão) |
| 08 | Como o Zyron funciona | Igual (o roteiro do bloco vem do padrão) |
| 09 | Olhômetro ou dados reais | Igual (o roteiro do bloco vem do padrão; aqui o Closer não lê a coluna do olhômetro, fica na do Zyron) |
| 10 | O encaixe | Igual (o roteiro do bloco vem do padrão) |
| 11 | A base do Zyron, com o nome do atleta no centro da rede | Igual (o roteiro do bloco vem do padrão) |
| 12 | "Peneira decide no olhômetro. Aqui, não." | "Conhecer o caminho não é estar nele.", comparação "por conta própria" x "com a gente" e "Informação vocês já têm. O que faltava era operação." |
| 13 | "Escuta o que um clube mandou pra gente." | "Clube contrata por carência. Escuta essa." e "A carência é do clube. O perfil é seu. A ponte é nossa." (mesmo vídeo) |
| 14 | "Nem tudo é talento." | "Talento é o mínimo." (mesmos números e mesma nota legal) |
| 15 | "AGN Football: onde os nossos atletas aparecem", com o celular da AGN; no avanço, a arte dos jogadores que passaram pela AGN | "Antes do post: o que o post não mostra", com os casos e o processo (vídeo, todo dia, a ponte, o post). A AGN aparece uma vez |
| 16 | "Quanto custaria montar isso por conta?", uma frente por avanço, total "Montando por conta: R$ 30.000 por ano." | "Quanto custa cada frente, por conta?", mesmas frentes e valores, total "Por conta própria" e "O difícil não é contratar cada frente. É fazer as sete falarem entre si." |
| 17 | "Quem investe no [atleta] somos nós." | "Quem banca a operação somos nós." e "scouter" no lugar de "agente" |
| 18 | "Não é pra qualquer um." | "Critério, não volume." e "Quem entra é escolhido pelo jogo, não pelo pagamento." |
| 19 | "Quando a gente ganha" / "É nesse momento, e só nele, que a gente lucra." | "Interesse alinhado" / "A gente lucra no contrato dele. Antes disso, não." |
| 20 | Garantia incondicional | Igual |
| 21 | A vaga | Igual |
| 22 | Abre sem preço: "Acesso anual.", "Por um ano, você tem" (seis benefícios), "paga o trabalho deles, não o nosso lucro" e "A gente só ganha se você ganhar.". Avanço 1: R$ 30.000/ano riscado e R$ 3.997 por ano. Avanço 2: 10x sem juros de R$ 399,70 e "um atleta médio nosso fecha ganhando, em média, R$ 30 mil+ por mês" | Igual, com "Por conta própria" e "O nosso lucro vem do contrato." |
| 23 | "publicado na AGN Football" duas vezes | Sem AGN: "Seu nome no contrato profissional." |

Roteiro: os slides fora do bloco do Zyron reescritos no idioma de quem conhece o meio; o bloco (05 a 11) vem do padrão, com o olhômetro ajustado.
O Modo B do slide 22 vem do padrão.

Objeções novas, no topo da aba Objeções (as 16 do padrão vêm depois):
1. "A gente mesmo consegue fazer isso / conhecemos gente no meio" (12, 17, 16).
2. "A gente já conhece a AGN, a gente mesmo manda o vídeo" (15, 12).
3. "Empresário só cobra quando sai o contrato. Por que pagar antes?" (19, 17, 20, 22).
4. "Quais dados o Zyron usa? Como é esse relatório?" (07, 08, 09, 12, 02, 04). A
   resposta usa só o que está no CASOS.md 3.1 (ficha, vídeo compilado,
   relatório do jogo, clube que precisa daquele estilo) e manda não
   inventar métrica.

Checklist: os 11 itens do padrão e mais 2 (confirmar na ficha que a família
é do meio; separar duas leituras do jogo do atleta).

## 4. Riscos (decisões suas)

1. Os números da tela são os do deck padrão (93%, +250, +75, 10+, os
   valores anuais das sete frentes que somam R$ 30.000, R$ 3.997 por ano e
   a faixa do contrato). Família do meio confere: tenha o documento de cada
   um à mão. O CASOS.md fala em 95%; o deck usa 93%.
2. Slide 08: a legenda "Casos reais de atletas acompanhados" vale só com o
   Joãozinho, o Kaio e o caso espelho reais. Caso espelho só da tabela do
   CASOS.md ou dos publicados na AGN, com link.
3. Escolher a variação errada custa caro: tratar uma família que não é do
   meio como especialista faz o Closer pular a prova de que ela precisa.
   Na dúvida, deck padrão.

---

Última atualização: 01/10/2026 (horário de Brasília).
