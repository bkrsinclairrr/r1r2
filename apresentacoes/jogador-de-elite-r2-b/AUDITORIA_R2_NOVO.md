# Auditoria do R2 novo contra o que você mandou

Feita em 09/10/2026, no `jogador-de-elite-r2-novo` (26 slides). Fontes lidas: `APRESENTACAO_R2_PROMPT.md`, `APRESENTACAO_R2_PLANOS_PROMPT.md`, `APRESENTACAO_R2_REFORMULACAO_PROMPT.md`, `APRESENTACAO_R2_LEITURA_ATLETA_PROMPT.md`, `APRESENTACAO_R2_VARIACOES.md`, o CASOS.md, o site da AGN e as 19 imagens de `imagesr2`.

Método: um script abre o deck no Chrome e passa por cada passo de cada slide, nos dois decks (padrão e técnica), com Legacy, Assessoria PRO, Scouting e ficha vazia. Foram 396 estados de tela. Cada estado é conferido contra as regras duras dos briefings. O que não dá pra medir na tela (roteiro, objeções, notas) foi conferido por leitura e por script nos arquivos.

## Resultado, regra por regra

| Regra | De onde vem | Resultado |
| --- | --- | --- |
| Sem travessão | todos os briefings | 0 na tela, no roteiro, nas notas, na técnica e no deck.js |
| "Assessoria", "o Zyron", "estrategista de carreiras"; nunca scouter, Scouting PRO, mentoria, programa, pacote | reformulação, regras duras 5 | 0 na tela |
| Sem "garantido", "exclusivo", "SEAL", "overall" | reformulação, regras duras 3, 5 e 7 | 0 na tela |
| Sem dado inventado: percentil, ranking, "melhor que", nota geral | reformulação regra 3, leitura regra 3 | 0 na tela. A plataforma (09) é tela ilustrativa e não tem número |
| Nada abaixo de 24 px | reformulação, regras duras 6 | Achei 15 textos de 20 a 22 px nos slides 14, 17, 22 e 26, do deck anterior. Subi todos pra 24 px. Agora 0 |
| Nada fora do palco de 1920 x 1080 | idem | 0 |
| Sem "undefined", "NaN", "{{", colchete solto ou "null", também com ficha vazia | regras de conteúdo | 0 |
| Sem link de pagamento nem preço antigo | regras duras 4 | 0 |
| Título com 96 px ou mais | identidade visual | 09: 100 px, 10: 104 px, 18: 104 px |
| Laranja só do olhômetro | regras duras e leitura 7 | Os 3 slides novos não usam laranja. As regras que usam são as do olhômetro e os alertas do apresentador |
| Animação só `.rise` | regras duras 6 | Nos 3 slides novos, só `.rise`. Continuam os que já existiam: `pulse` e `scan` (linguagem do Zyron, herdada do R1) e `pl-ideal` e `pl-reflexo` (moldura do Legacy, pedido da rodada dos planos). Todos desligam com "reduzir movimento" |
| Conexão direta com clubes e AGN, 15 encaminhamentos por mês e David de perto são só do Legacy | regras duras 9 | O slide 18 e o 10 mudam com o plano da ficha. Testado nos 3 planos |
| Nota legal nos slides que falam de clube, conexão ou David | planos, regra 2 | O 18 tem a nota da casa ("Não há promessa de contratação ou de clube específico") e a da AGN |
| Motor intacto: tecla S, visão geral, apresentador, ficha antiga, painel | regras duras 8 | S, de outro slide, leva a tela pro 24 (os planos) no último avanço. Apresentador abre e a aba Fechamento lista o fechamento |
| Roteiro: uma fala por slide e soma até 59 min | reformulação, arquitetura A | 26 falas, 59 min |
| Etapas da Bíblia cobrem todos os slides | reformulação, arquitetura E | Os 26 slides estão em alguma etapa |
| Objeções apontam pra slides que existem | reformulação, verificação | 17 objeções, todas com slide válido (a "manda por WhatsApp" nunca teve slide de socorro) |
| Notas do Gestor refeitas do roteiro | reformulação, processo 4 | 26 slides, 59 min no cabeçalho |

## O que mudei por causa da auditoria

- Slide 09: lista com bolinhas no lugar de "01 a 04" (a casa evita rótulo numerado) e "por onde ele joga" no mapa de calor.
- Slide 10: título de 7 palavras ("IA que não dorme. Gente que acompanha.") e descrições dos planos em 32 px.
- Slide 18: texto cortado pela metade, "Encaminhamos o perfil dele. Viabilizamos a ida.", David como "o rosto da casa" só com os números da casa (sem currículo inventado) e a nota legal completa.
- Slides 14, 17, 22 e 26: fontes de 20 a 22 px subiram pra 24 px.
- Roteiro e notas: fala do David com as palavras do plano ("assessoria individual todo mês e acompanhamento direto no WhatsApp").

## O que não deu pra verificar

- O vídeo do Zyron e o dos clubes (75 MB cada) não vão na prévia de um arquivo só. Os pôsteres vão.
- A Leitura do atleta com vídeo de verdade (envio, marcação e relatório) depende do painel publicado. O painel no ar ainda não tem as rotas novas.
- O deploy no Vercel: o sistema bloqueou o meu comando. O arquivo `PUBLICAR-R2-NOVO.bat` faz isso com dois cliques.

## Decisões que continuam com você

1. Acompanhamento humano 24/7: a equipe entrega? Hoje os planos dizem a cada 15 dias, toda semana ou todo dia. Só a IA está como 24 horas.
2. Currículo real do David (anos, atletas, clubes) pra entrar no 18 com base em fato. O site da AGN não cita o David.
3. O que da plataforma já está no ar. Até lá, o 09 fica como tela ilustrativa.
4. Ok da AGN pra aparecer no deck com o nome e a descrição do site deles.
5. Se o visual do 09 deve ir além da tela ilustrativa: radar sem número, comparativo entre planos, grade de cartões.

## Mudança de 11/10/2026

A Garantia total saiu do 23 e passou pra depois dos planos: agora é o slide 25, entre os planos (24) e o Bem-vindo (26). Ela mostra os três valores de uma vez, sem avanço: Scouting R$ 997, Assessoria PRO R$ 1.497 e Legacy R$ 2.997, todos vitalícios, em 10x sem juros. Os slides 23 (A vaga) e 24 (Os planos) subiram uma posição, e todas as referências a número de slide no roteiro, nas objeções, nas etapas, na ficha, nas notas e na técnica foram renumeradas. O texto da garantia continua "Garantia total", com a condição do contrato no rodapé.

## Painel do closer e slide 19 (11/10/2026, noite)

O deck foi de 26 pra 27 slides. Entrou o 19, "O que o {nome} leva": seis linhas, uma por avanço (IA, gente, conexões, oportunidades, tempo e garantia), com o retrato dele, todas pelo plano da ficha. Do 19 ao 26 de antes, cada slide andou uma casa. O roteiro continua em 59 minutos: o 04 foi de 5 pra 4,5 e o 13 e o 17 de 2,5 pra 2.

O atleta agora vem do Painel do Closer (projeto novo, `jogador-de-elite-closer`, ainda não publicado) pelo link `?a=<código de 26 letras>`: foto, nome, apelido, ficha, vídeo e leitura. Cada link tem a sua ficha no navegador, o seu canal e a sua janela de apresentador. Link revogado, vencido ou trocado mostra só "Este link não está mais ativo. Fale com o seu gestor de carreiras."

| Verificação | Resultado |
| --- | --- |
| Auditoria de tela (`ferramentas-r2\auditoria2.mjs`): 27 slides, padrão e técnica, 9 variantes cada (3 planos, ficha vazia, 3 com foto, nome longo e apelido) | 1.017 estados, 0 violações, nenhuma exceção de JavaScript |
| Isolamento por link (`ferramentas-r2\teste-colisao.mjs`) | Antes: a aba da Bia mostrava a Ana e o apresentador da Ana mexia no slide da Bia. Depois: tudo certo, sem mudar o teste |
| Testes do painel com o deck (`jogador-de-elite-closer\testes`) | 231 de 231: concorrência 76, foto 29, igualdade 8, isolamento 14, leitura e importação 55, navegador 49 |
| Números de slide | 159 trocas conferidas uma a uma; as etapas cobrem os 27; cada objeção aponta pra slides de título compatível |
| Travessão | 0 no deck, no roteiro, na técnica, nas notas, no painel e nas ferramentas |
| Fim de linha | Cada arquivo no estilo de antes. O `r2.css` começa com o backup inteiro, byte a byte (com os bytes Latin-1), e o bloco novo está em ASCII e LF |
| Notas do Gestor | Regeradas do roteiro: 27 slides, 59 min, a garantia por extenso no lugar do `[garantia]` |
| Foto em navy ou em cor (D10) | Navy por padrão: casa com a paleta, não briga com o laranja do olhômetro e deixa fotos diferentes parecidas. A cor reconhece o rosto mais rápido. Foto escura no navy apaga o rosto: peça foto clara |

Backup de antes desta rodada: `Downloads\bum\backup-r2novo-2026-10-11-antes-do-painel-closer` (31 arquivos, sem o `.env.local`).

## Nome e sobrenome na tela (11/10/2026, depois do deploy)

Pedido do dono: a tela passa a dizer o nome e o sobrenome, e não só o primeiro nome. A regra (a mesma no `deck.js` e no `regras.js` do painel, conferida pelo `teste-igualdade` numa tabela de 21 nomes):

- Na tela (títulos, frases, carimbo do dossiê, contrato, anúncio): o primeiro nome e o último sobrenome do nome completo. Lucas Almeida da Silva vira Lucas Silva. Nome composto comum fica inteiro (João Pedro da Silva vira João Pedro Silva; João Vitor Pereira Lima vira João Vitor Lima). Com três palavras e nenhuma "da", "de" ou "do", o nome todo (Lucas Almeida Silva). Júnior, Filho e Neto vão junto do sobrenome.
- Até 24 letras. Passou, perde o Júnior, depois o composto, e por fim fica só o primeiro nome.
- O campo "Como a gente chama ele" continua mandando em tudo: preenchido, a tela diz o que está lá (Joãozinho). O carimbo e o contrato seguem o nome legal.
- Na fala do apresentador (as frases entre aspas e a mensagem de confirmação), o primeiro nome, ou o apelido.
- Nomes curtos (até 14 letras) ficam juntos na mesma linha. O rótulo do campo (11 e 27) leva o nome da tela até 12 letras, depois só o primeiro nome.

O que a mudança mostrou e foi corrigido:

| Achado | Correção |
| --- | --- |
| Slide 19 do Legacy com nome de 13 letras ou mais: o título quebra em duas linhas e a condição da garantia sobrepunha o rodapé. A auditoria de texto por tamanho não pega texto sobre texto | Com nome longo, a lista fica 70 px mais junta (só nesse caso). Auditoria nova: `ferramentas-r2\auditoria3.mjs`, com a checagem de texto sobre texto |
| Rótulo do nome no campo (11 e 27): feito pra primeiro nome, ficava largo, cobria o marcador do atleta na ponta, no gol e no ataque, ou saía do campo; e o texto encolhia abaixo de 24 px na tela | O rótulo escolhe o lugar já dentro do campo e nunca cobre o marcador do atleta; o texto só tem até 12 letras |
| Título do 24 quebrava no meio do nome ("A vaga do Lucas / Silva.") | Nome curto fica junto (`white-space: nowrap` só até 14 letras) |
| Slide 11: com nome de 13 letras ou mais o título quebrava em 4 linhas e a coluna da esquerda batia no rodapé (nos dois decks) | Título de 80 px em vez de 96 px, só nesse caso |
| Slide 4: com nome de 22 letras ou mais o título de 110 px quebrava e cobria a frase de baixo. Slide 2 da técnica: o de 130 px quebrava em 4 linhas | 96 px no 4 e 110 px no 2, só nesse caso |

Verificação: a auditoria nova (`ferramentas-r2\auditoria3.mjs`) passou por 1.808 estados (27 slides, padrão e técnica, 17 fichas, incluindo composto, Júnior, nome curto de 14 letras, nome longo e apelido de 24 letras), com texto sobre texto, texto fora do palco, texto abaixo de 24 px e imagem quebrada: 0 violações. O campo (11 e 27) foi explorado em 88 combinações de posição e nome: 0 casos com o rótulo cobrindo o marcador do atleta, saindo do campo ou abaixo de 24 px na tela.

## Variação B: nome e primeiro sobrenome (branch b-primeiro-sobrenome, 11/10/2026)

O mesmo deck, com uma regra só trocada em `nomesDoAtleta` (deck.js): a tela diz o primeiro nome e o PRIMEIRO sobrenome. Lucas Almeida da Silva vira Lucas Almeida (na principal vira Lucas Silva); João Vitor Pereira Lima vira João Vitor Pereira; João Pedro da Silva continua João Pedro Silva. Publicada em jogador-de-elite-r2-b.vercel.app, no mesmo Painel do Closer: o mesmo link `?a=<código>` abre nos dois, trocando só o endereço. O exemplo ao vivo do painel segue mostrando a regra principal (último sobrenome).
