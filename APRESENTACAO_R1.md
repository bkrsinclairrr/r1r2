# APRESENTACAO_R1.md

Versão: v2 (29/09/2026)
Deck da R1 do Estrategista Esportivo, reescrito pra persuasão máxima: a
dor de não ser visto na frente, o Zyron como o mecanismo que resolve essa
dor, e o próximo passo (R2) no fim. Deck atual:
https://jogador-de-elite.vercel.app/ (16 slides, projeto
`jogador-de-elite-call` no Genspark). Prompt pronto pro Opus 5.5, com a
copy canônica de cada slide: `APRESENTACAO_R1_PROMPT.md`. Falas:
`PLAYBOOK_SDR.md`. Casos: `CASOS.md`.

Changelog:
- v2: auditoria do v1 contra o deck publicado, o PLAYBOOK_SDR e o
  PLAYBOOK_CLOSER. (a) A dor ganha cinco slides: entra o craque do
  bairro (05), que troca "só comigo" por "pode ser o meu". (b) O vídeo
  do Zyron vem antes da explicação (09 antes do 10): ver antes de ler, e
  o mecanismo vira o resumo do que a família viu. (c) "Scout" vira
  "scouter". (d) Nas telas do Zyron, "jogo inteiro" vira "cada lance do
  vídeo": o Zyron analisa o vídeo que a família envia, e a família cobra
  o que leu. (e) "Pagar viagem" sai da tela do 13: falado passa,
  escrito parece que a empresa paga a viagem. (f) O bloco R2 volta à
  ordem publicada: o v1 tinha reordenado, e o slide do ganha-ganha diz
  "os valores apresentados a seguir". (g) O prompt ganha o padrão técnico
  real do Genspark, arquivo de notas (o projeto não tem campo de notas),
  contador de página e sistema visual antes de construir. (h) Novos:
  roteiro do vídeo com narração, slide de socorro por objeção, riscos de
  afirmação, ritmo da call e variações de título pra testar.
- v1: criação. Deck reordenado pela dor (SPIN e Sandler), seção do Zyron
  com vídeo de demonstração, preço fora da R1, padrões de template
  removidos, autorização expressa do responsável dentro do deck.

---

## 1. Diagnóstico do deck atual

Conferido no HTML publicado em 29/09/2026: 16 slides, um arquivo do
Genspark cada, e nenhum cita o Zyron.

O que já funciona e fica:
- Identidade: preto (#07080A), dourado (#C9A24A e #E8CE8E), tipografia
  condensada (Saira, Barlow, Archivo), foto noturna de estádio. O azul
  #7FAEFF já existe no deck, nos slides de dados e inteligência, então
  "azul é o Zyron" não cria cor nova.
- Provas reais: Kaio (Internacional), Joãozinho (Grêmio), Gama, David
  Willer, AGN Football e o vídeo de acompanhamento.
- Notas legais ("nenhum resultado é garantido", "não há promessa de
  contratação"). Protegem a empresa e passam seriedade pra quem chega
  desconfiado.

O que trava a conversão:
1. Começa pela solução. Os slides 02 a 05 mostram estrutura, jornada e
   dados antes de qualquer dor. A regra de ouro do SPIN é "sem
   necessidade explícita, não se fala do produto" (`spinselling.md`), e
   o Sandler manda a dor e o impacto antes da proposta. O deck novo abre
   pela dor e só apresenta o Zyron depois que a família disse em voz
   alta o que quer (slide 07).
2. A dor de não ser visto não tem nenhum slide, e é a dor mais forte da
   R1 (PLAYBOOK_SDR 6.4). Agora ela ocupa cinco (02 a 06).
3. O Zyron não existe no deck. O slide 05 ("Dados que viram
   direcionamento") fala de "inteligência" sem nome, sem mecanismo e sem
   demonstração. Agora são cinco slides, com vídeo.
4. Mostra valor na R1. O slide 16 ancora R$ 6.997 e o 14 promete
   "Garantia incondicional", e o PLAYBOOK_SDR proíbe o Estrategista de
   falar preço (regras da casa, 8.1 e 15). Esse bloco foi pro fim, atrás
   de um divisor, pro Gestor de Carreiras usar na R2.
5. Linguagem de processo e cara de template: "Etapa 01 a 06", rótulos
   01/02/03, grades de seis cards iguais. Os dois playbooks já evitam
   linguagem de onboarding e de processo com a família, e o Opus 5.5
   repete esses padrões se eles não forem proibidos pelo nome.
6. Slide do David com "Mentoria" (a casa diz "assessoria", nunca
   "mentoria") e frase quebrada ("David um empresário de sucesso ao
   lado").
7. Texto pequeno demais pra celular em chamada de vídeo: rótulos, notas
   e contadores usam fontes de 17 a 25 px.

## 2. O arco novo

21 slides na R1, mais um divisor e os 4 slides da R2.

| Ato | Slides | O que a família sente | Base |
| --- | --- | --- | --- |
| Abertura | 01 | "É sobre ser visto." | Rapport (Sandler) |
| A dor | 02 a 06 | "Ele nunca foi visto de verdade. Acontece com muito garoto bom. E custa." | SPIN problema e implicação; Sandler dor e impacto |
| A virada | 07 | "É isso que a gente quer." | SPIN necessidade explícita |
| O Zyron | 08 a 12 | "Existe um jeito de ele ser visto lance a lance. E encontrado." | Mecanismo único, demonstração, contraste |
| O que muda | 13 | "Ele não fica sozinho, e o peso sai das nossas costas." | Valor e esforço percebido |
| A prova | 14 a 17 | "Já aconteceu com gente como ele." | Probabilidade percebida de sucesso |
| O compromisso | 18 a 21 | "Ele quer, a gente apoia, e o próximo passo é claro." | Compromisso, escassez, pré-compromisso |

O deck acompanha a R1, não substitui. Abertura, contexto e experiências
(PLAYBOOK_SDR 6.1 a 6.3) acontecem com a capa na tela. Nos slides 02, 05,
06 e 07 o Estrategista para e deixa a família falar: quem responde em voz
alta se convence sozinho. Cada slide tem a sua fala nas notas do
apresentador (bloco `<slides>` do prompt), que o Opus entrega num arquivo
à parte.

Ritmo da call (estimativa pra ensaio): abertura e contexto 3 min (01),
dor 8 min (02 a 06), virada 1 min (07), Zyron 8 min (08 a 12, com 2 do
vídeo), o que muda 1,5 min (13), prova 3 min (14 a 16), compromisso 4 min
(18 a 21). Total de 28,5 minutos. Passou de 30, corte o 17 e depois o 05.

## 3. Mapa de persuasão, slide a slide

| Slide | Título na tela | Função | Gatilho | Oferta imperdível | Playbook |
| --- | --- | --- | --- | --- | --- |
| 01 | Talento que ninguém vê não vira contrato. | Nomear a tese | Curiosidade | | 6.1 a 6.3 |
| 02 | Quantas peneiras você já fez? | Abrir a dor pela boca deles | Autopersuasão, empatia | | 6.4 |
| 03 | 54 segundos | Dar número à sensação | Especificidade, contraste | | 6.4 |
| 04 | Não foi você que falhou. Foi o olhômetro. | Fundo da dor e alívio da culpa | Inimigo comum, empatia | | 6.4 |
| 05 | Todo bairro tem um craque que ninguém viu. | Tornar a dor coletiva: não é só comigo, e pode ser o meu | Prova social do problema, aversão ao arrependimento | | 6.6 |
| 06 | Não ser visto custa caro. | Custo de ficar parado | Aversão à perda, urgência | Régua do valor pra R2 | 6.6 e 6.7 |
| 07 | E se alguém visse cada lance seu? | Necessidade explícita | Futuro imaginado | Valor percebido | 6.5 |
| 08 | ZYRON. O olheiro que não pisca. | Nomear o mecanismo | Mecanismo único, novidade | Probabilidade | 02 |
| 09 | Veja o Zyron trabalhando. | Provar o mecanismo antes de explicá-lo | Demonstração | Probabilidade | 02 |
| 10 | Como o Zyron funciona | Dar nome ao que a família viu e mostrar o que vem depois do relatório | Transparência, mecanismo único | Probabilidade, esforço | 02 |
| 11 | Olhômetro ou dados reais. | Contraste | Contraste, autoridade | Valor percebido | 6.11 e 8.11 |
| 12 | Em algum lugar, um clube precisa exatamente do jogador que você já é. | Virada de crença: ser encontrado, não ser o melhor | Reenquadramento, esperança crível | Probabilidade | 02 |
| 13 | Você para de jogar sozinho. | O que muda pros dois decisores | Afinidade, alívio | Esforço e valor percebido | 6.11 e 8.6 |
| 14 | Todo contrato começa com alguém sendo visto. | Caso real | Prova social | Probabilidade | 6.12 e 13 |
| 15 | Do seu lado, quem já fez esse caminho. | Autoridade | Autoridade | Probabilidade | 6.12 |
| 16 | Nossos atletas também aparecem aqui. | Prova que a família confere sozinha | Autoridade por associação | Probabilidade | 6.12 e 10 |
| 17 | Veja com seus próprios olhos. (opcional) | Prova visual | Prova social | Probabilidade | |
| 18 | Três perguntas. Resposta em voz alta. | Compromisso público | Compromisso e consistência | | Escada do sim |
| 19 | O próximo pode ser você. | Se enxergar nos casos | Futuro imaginado, identificação | Valor percebido | 6.5 |
| 20 | 10 atletas por turma. | Escassez com motivo | Escassez | | 6.15 |
| 21 | Uma conversa com o Gestor de Carreiras. | Pré-compromisso e R2 marcada | Compromisso, próximo passo claro | Tempo de execução (o próximo passo já sai com dia e hora) | 6.15, 6.16 e 10 |

Onde cada doutrina da casa entrou:
- SPIN (`spinselling.md`): situação e problema em 02 e 03, implicação em
  04 a 06, necessidade explícita em 07, e só então o produto (08).
- Sandler (card do método): rapport em 01, dor e impacto em 02 a 06,
  compromisso em 18 e 21. O combinado de abertura (o "combinado inicial"
  que o PLAYBOOK_CLOSER 4.2 já usa na R2) entra na nota do 01.
- Oferta imperdível (`oferta-imperdivel.md`): probabilidade percebida em
  09 e 12 a 16 (caso parecido e prova que a família confere); esforço
  percebido em 13 (o peso sai da família); valor percebido em 07, 11 e
  19 (o resultado final, nunca o entregável); tempo de execução em 21.
- Predictable Revenue (`predictablerevenue.md`): pedir licença e deixar o
  cliente falar (notas do 01, 02 e 05), o atleta como aliado de dentro
  (a missão dele, na nota do 21) e proposta que se conquista (preço fora
  da R1).
- Gatilhos da casa (PLAYBOOK_SDR e CASOS): mecanismo único e novidade em
  08 a 11, prova social e autoridade em 14 a 16, escassez com motivo real
  em 20, compromisso e consistência em 18 e 21, aversão à perda em 04 a 06.

Recursos de copy que atravessam o deck:
- Inimigo comum: o olhômetro. Não o avaliador, não o atleta, não a
  família. "Não foi você que falhou" tira a culpa de quem já ouviu muito
  não, e quem sente alívio com a gente confia na gente.
- Especificidade: 22, 1, 20, 54. Número conta a dor melhor que adjetivo.
- Ecos: "olhou pro outro lado" (04) volta em "não olha pro lado" (08);
  os 54 segundos (03) viram "cada lance seu" (07); o craque que "só não
  foi visto" (05) volta em "Kaio foi visto. Joãozinho foi visto." (19);
  o "a gente te liga" (06) volta na tabela (11). O eco faz a família
  ligar a dor à solução sem ninguém explicar.
- Ver antes de ler: o vídeo (09) vem antes da explicação (10).
- Luz e cor contam a história: a dor é escura e sem cor; o túnel (07)
  acende; o Zyron é azul; a prova e a marca são douradas. Azul é máquina,
  dourado é a nossa equipe.
- Vocabulário de vestiário, não de escritório: peneira, coletivo,
  craque, várzea, olhômetro. Nunca etapa, jornada ou onboarding.
- Uma ideia por slide, e perguntas nos slides que abrem conversa.

Variações de título pra testar (uma por vez, em 20 calls cada; o critério
é a taxa de R2 marcada com todos os decisores, que é o critério de
repasse do CRM, PLAYBOOK_SDR 12. Sem isso, é palpite):

| Slide | Título atual | Variação B | O que testa |
| --- | --- | --- | --- |
| 04 | Não foi você que falhou. Foi o olhômetro. | Não foi falta de talento. Foi falta de olhar. | Culpa no método, sem dizer "você" |
| 07 | E se alguém visse cada lance seu? | E se ninguém mais olhasse pro lado? | Desejo de ser visto contra dor do olhar desviado |
| 12 | Em algum lugar, um clube precisa exatamente do jogador que você já é. | Em algum lugar, um clube procura um jogador com o seu perfil. | Força da promessa contra segurança da afirmação |
| 21 | Uma conversa com o Gestor de Carreiras. | Sua vaga na turma é definida nesta conversa. | Próximo passo contra motivo pra ir |

## 4. O Zyron no deck

O pedido era uma seção objetiva, com o vídeo mostrando como funciona.
Ficou assim:
- 08, o nome e a metáfora: "o olheiro que não pisca", com "não olha pro
  lado, não cansa, não esquece" respondendo ponto a ponto ao olhômetro.
- 09, o vídeo, logo depois do nome. O vídeo é a explicação: ver antes de
  ler convence mais e dispensa a aula antes do play.
- 10, o mecanismo em cinco verbos, que agora é o resumo do que a família
  viu: recebe (ficha e vídeo), analisa (lance a lance), relata (relatório
  de performance, sempre atualizado), acompanha (um scouter do Zyron só
  do atleta, vídeo novo, relatório novo), conecta (perfil cruzado com o
  que os clubes procuram, e a ponte é com a gente). Se o vídeo travar no
  compartilhamento de tela, este slide sozinho já explica o Zyron.
- 11, o contraste lado a lado, fechando com "os grandes clubes já
  escolhem jogador com dados há anos, por dentro" (PLAYBOOK_SDR 8.11).
- 12, o encaixe: sempre tem um time que precisa das características que
  ele já tem. O Zyron encontra o perfil, a gente faz a ponte. A nota
  legal do encaminhamento (a mesma do deck atual) fica no rodapé.

Se você preferir explicar e depois mostrar (como no v1), troque a ordem
dos slides 09 e 10 e a nota do 09.

O que a tela diz e o que o Zyron faz:
- O Zyron analisa o vídeo que a família envia (o "DVD" do PLAYBOOK_SDR
  02), não jogos inteiros. Por isso as telas dizem "cada lance do
  vídeo". O slide 07 pergunta "E se alguém visse cada lance seu?", que é
  hipótese, não promessa.
- A tela chama o acompanhamento de "scouter do Zyron". Os playbooks
  dizem "agente do Zyron". O Estrategista fala uma coisa e o slide mostra
  outra: escolha um nome só e ajuste o outro lugar.

Autorização expressa do responsável: aparece em três slides (09, 10 e
21). Está alinhada com a proteção reforçada que a LGPD dá a dado de
criança e adolescente (art. 14), e é resposta pronta pro "isso é golpe?":
quem pede autorização por escrito não está escondendo nada.

Roteiro sugerido pro vídeo de demonstração (90 segundos a 2 minutos, tela
do Zyron com narração curta). Cada frase da narração precisa ser verdade
no produto: se o Zyron não faz alguma coisa (por exemplo, atualizar o
relatório a cada vídeo novo), tire a frase daqui e do slide 10. Se o
vídeo usar atleta ou dados simulados, a legenda continua "Demonstração do
Zyron", sem apresentar como caso real. Nenhum número na tela que o Zyron
não gere de verdade.

| Cena | Tempo | O que aparece | Narração |
| --- | --- | --- | --- |
| Entrada | 0:00 a 0:15 | A ficha (idade, altura, peso, posição, pé) e o vídeo subindo. Selo: "Autorização do responsável: recebida". | "Este é o Zyron. Tudo começa com a ficha do atleta e o vídeo do jogo dele. E só começa com a autorização do responsável." |
| Leitura | 0:15 a 0:45 | O vídeo rodando, caixa de rastreamento em volta do atleta, marcações lance a lance: com bola, sem bola. | "O Zyron assiste a cada lance do vídeo. Com a bola e, principalmente, sem ela: onde o atleta se posiciona e como decide. Ele não olha pro lado, não cansa e não esquece nenhum lance." |
| Relatório | 0:45 a 1:05 | O relatório se montando: pontos fortes, o que evoluir, perfil de jogo. | "Sai o relatório de performance: pontos fortes, o que evoluir e o perfil de jogo. Dado real, não achismo." |
| Acompanhamento | 1:05 a 1:25 | Um segundo vídeo entra e o relatório se atualiza, mostrando a evolução. | "Chegou vídeo novo? Sai relatório novo. O scouter do Zyron acompanha o atleta o tempo todo e registra a evolução, jogo a jogo." |
| Encaixe | 1:25 a 1:45 | O perfil cruzado com o que os clubes procuram e a equipe assumindo a ponte. | "E aqui está o que a peneira nunca fez: o Zyron cruza o perfil do atleta com o que os clubes estão procurando. Quando há encaixe, a nossa equipe faz a ponte." |
| Fecho | 1:45 a 1:55 | Marca Zyron. Legenda: "Demonstração do Zyron. Nenhum resultado é garantido." | "Zyron. O olheiro que não pisca." |

Se o vídeo seguir essa ordem, é só copiar os passos pro campo
PASSOS_DO_VIDEO do prompt, e o slide 09 descreve exatamente o que a
família vai ver. Texto pronto pro campo: "a ficha e o vídeo entrando, com a
autorização do responsável; a leitura lance a lance; o relatório de
performance; a evolução com vídeo novo; o perfil cruzado com o que os
clubes procuram".

## 5. Slide de socorro por objeção

O deck é linear, mas a conversa não é. Quando a objeção aparecer, o
Estrategista pula pro slide que responde, responde com a fala do
PLAYBOOK_SDR 8 e volta.

| Objeção | Slides de socorro |
| --- | --- |
| "Isso é golpe?" / "É peneira paga?" (8.3) | 16 (o link da AGN que a família confere), 15 (David e as assinaturas), 10 (autorização expressa do responsável) |
| "Isso de inteligência artificial funciona mesmo?" (8.11) | 09 (o vídeo) e 11 (olhômetro ou dados reais) |
| "Vocês são tipo uma escolinha?" (8.10) | 11 e 13 |
| "Vou pensar" / "Agora não é o momento" (8.4) | 06 (o preço de não ser visto) e 20 (a turma) |
| "Ele é muito novo" / "Ele já tá velho" (8.8) | 06 (a base tem prazo) e 14 (o caso mais parecido) |
| "Não tenho tempo" (8.6) | 13 (a coluna da família) |
| "Quanto custa?" (8.1) | 21 (a conversa com o Gestor de Carreiras). Nunca abrir o bloco R2. |

## 6. O que ficou fora dos slides, de propósito

- Preço e valores em R$: bloco R2, atrás do divisor (PLAYBOOK_SDR,
  regras da casa, 8.1 e 15).
- 95% de encaminhamento, média de 3 meses, salário de 20 a 30 mil e
  "centenas de atletas": não entram no slide sem documento que prove.
  Slide é publicidade por escrito, a família tira print, e pelo CDC (art.
  37 e 38) o ônus de provar a informação é de quem anuncia; na fala o
  cuidado é o mesmo (art. 30). E com esse público, que já ouviu falar de
  golpe, prova específica e conferível (foto da assinatura, link da AGN)
  convence mais que número grande. Quando houver documento, os campos
  ANOS_DE_MERCADO e ATLETAS_ENCAMINHADOS do prompt ativam a faixa de
  números do slide 15. Na fala, o Estrategista segue usando os números
  da casa (PLAYBOOK_SDR 6.12).
- "Restam 2 ou 3 vagas": só com o número real da semana (campo
  VAGAS_RESTANTES). Escassez que a família descobre que era inventada
  derruba a confiança no resto do deck.
- "A gente só ganha quando ele ganha": fica na fala (PLAYBOOK_SDR 6.10) e
  no slide de ganha-ganha da R2, que já explica pra onde vai o valor.
  Escrita, a frase precisa da explicação do investimento ao lado.
- "Perfil aprovado" e "você foi escolhido": ficam na fala (6.13). Escrito
  em todo deck, vira promessa de seleção que a família guarda e cobra.
- "Pagar viagem" (PLAYBOOK_CLOSER 6.6): saiu da tela do 13. Falado, vem
  com o contexto (o gerente organiza a ida quando o clube chamar).
  Escrito, parece que a empresa paga a viagem.
- Prazo, clube ou contrato prometido: em nenhum slide.

## 7. Riscos de afirmação (decisões suas)

Linhas que continuam no deck e que vale você conferir uma vez:
1. Slide 12, título: "precisa exatamente do jogador que você já é" é
   absoluto. É a tese que você pediu ("sempre tem um time que precisa das
   características que ele já tem"), e a nota legal protege, mas é a
   linha mais forte do deck. Se quiser a versão mais segura: "Em algum
   lugar, um clube procura um jogador com o seu perfil." Troque no título
   do slide 12, no prompt.
2. Slide 03: os "20 minutos de coletivo" e os "22 em campo" são a
   narrativa da casa (PLAYBOOK_SDR 02 e 6.4), e a conta aparece na tela.
   Se uma família disser que a peneira dela foi diferente, a nota do
   apresentador já traz a resposta ("faz a conta da sua").
3. Slide 11, fecho: "os grandes clubes já escolhem jogador com dados há
   anos" é verdade em geral, e o deck não cita clube nenhum. Mantenha
   sem nome de clube.
4. Slide 16: "tem atleta nosso publicado lá" só vale com o link e pelo
   menos um atleta conferidos (PLAYBOOK_SDR 16, itens 5 e 10).
5. Bloco R2, "Garantia incondicional": o deck publicado promete a
   devolução de 100% do investimento, e o PLAYBOOK_CLOSER 9.6 responde
   "Tem garantia?" sem oferecer devolução. Um dos dois precisa mudar
   antes de a R2 rodar com uma promessa que o script do Closer não
   sustenta.

## 8. Sessão com o Opus 5.5

1. Duplique o projeto `jogador-de-elite-call` no Genspark. O deck atual
   continua no ar até o novo ser aprovado, e a cópia já leva as imagens
   e os slides da R2.
2. Suba o vídeo de demonstração em `assets/video/zyron-demo.mp4`.
3. Preencha o bloco `<dados>` do prompt (seção 9).
4. Selecione o Opus 5.5 e cole o prompt (tudo abaixo da linha marcada).
   Se a caixa de texto cortar, anexe o arquivo e escreva: "Siga o prompt
   do arquivo anexo."
5. Confira a ordem dos slides no projeto (a do prompt, 01 a 26) e o
   arquivo `notas-do-apresentador.md`, que o Opus entrega porque o
   projeto não tem campo de notas.
6. Revise com os prompts abaixo, um de cada vez e só se precisar. O Opus
   5.5 responde melhor quando o padrão a evitar tem nome: pedir "menos
   cara de IA" só troca um padrão por outro.

Revisão visual, se algum slide ficou com cara de template:
> Liste, slide por slide, os padrões visuais que você usou: fundo,
> tipografia, rótulos, cartões, ícones, divisores e molduras. Marque os
> que se repetem em mais de três slides. Refaça os slides [números]
> trocando esses padrões por soluções desenhadas pra este deck. Não mude
> nenhuma palavra.

Revisão de legibilidade:
> A família vê este deck num celular, com a tela compartilhada numa
> chamada de vídeo, a uns 20% do tamanho original. Aponte todo texto que
> ficaria ilegível assim e aumente. Corte espaço vazio antes de cortar
> texto. Não mude nenhuma palavra.

Revisão de fidelidade:
> Compare o texto de cada slide com o bloco <slides> do primeiro prompt,
> palavra por palavra. Liste toda diferença, número que não estava lá,
> travessão ou nota do apresentador que foi parar na tela. Corrija.

Revisão técnica:
> Confira que todo slide segue o padrão do projeto: 1920×1080, elementos
> com data-object, nenhuma fonte nova, contador de página "NN / 26" com
> 24 px ou mais, e a ordem dos slides no projeto igual à do prompt. Liste
> o que corrigiu. Não mude nenhuma palavra.

7. Faça uma R1 de ensaio com o deck e cronometre (ritmo esperado na seção
   2). Passou de 30 minutos, o slide 17 é o primeiro a sair, depois o 05.
8. Aprovado, exporte e publique no lugar do deck atual.

## 9. Dados pra completar

| Campo no prompt | O que é | Onde aparece |
| --- | --- | --- |
| VIDEO_ZYRON, DURACAO_VIDEO_ZYRON, PASSOS_DO_VIDEO | Arquivo, duração e o que o vídeo mostra, na ordem | 09 |
| TITULO_DAVID | Como o David quer ser apresentado | 15 |
| ANOS_DE_MERCADO, ATLETAS_ENCAMINHADOS | Números da casa, com documento | 15 |
| VAGAS_RESTANTES | Número real da semana | 20 |
| DURACAO_CONVERSA_GESTOR | Já vem com 45 minutos (PLAYBOOK_CLOSER 04 fala em 45 a 60) | 21 |

Fora do bloco de dados, confirmar antes de colar:
1. O que o relatório do Zyron traz de verdade. O slide 10 diz "com bola,
   sem bola, decisão, posicionamento" e "pontos fortes, o que evoluir,
   seu perfil de jogo". Se for diferente, troque no prompt e na narração
   do vídeo.
2. A cadência do relatório. O slide 10 diz "sempre atualizado" e "vídeo
   novo, relatório novo". Se o relatório sai por outra regra (por semana,
   por jogo), troque.
3. O scouter: é pessoa ou agente de IA? Qual o canal e a frequência de
   contato no dia a dia (PLAYBOOK_SDR 16, item 2)? A tela diz "um scouter
   do Zyron só seu, de olho na sua evolução o tempo todo", sem dizer se é
   gente ou máquina. E os playbooks chamam de "agente do Zyron": escolha
   um nome só.
4. O que o Zyron recebe: só o vídeo compilado (o "DVD") ou também jogos
   completos? Quantos minutos? As telas dizem "cada lance do vídeo". Se
   ele analisa jogo completo, o texto pode subir pra "jogo inteiro", mas
   só com isso confirmado.
5. O termo de autorização do responsável: o deck promete, em três slides
   (09, 10 e 21), que nada entra no Zyron sem ele. Ele precisa existir,
   assinado, antes do primeiro vídeo.

---

Última atualização: 29/09/2026 às 18:51 (horário de Brasília).
