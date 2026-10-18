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

## Versões do R2 no painel (12/10/2026)

Pedido do dono: as variações do R2 ficam todas no Painel do Closer, com a escolha do nome na tela e do slide na sequência, sem link espalhado e sem projeto novo por variação. O que mudou:

- **Cadastro único** (`regras.js` do painel, lista `VERSOES`): Principal (`/`) e Técnica (`/variacoes/tecnica/`). O closer escolhe a versão na seção "Versão do R2" do R2 de cada atleta; a aba "Versões do R2" mostra todas, com quando usar, e abre cada uma de exemplo. Como acrescentar uma: `COMO-ACRESCENTAR-VERSAO.md` na pasta do painel. (Depois da sincronização, abaixo, a lista vem do `variacoes.json` do deck e o `VERSOES` do `regras.js` ficou só como reserva.)
- **Um link só por atleta**: `/?a=<código>`, qualquer que seja a versão. A `/api/r2` manda `versao: { id, caminho }` e o deck vai pra página certa na entrada (mesmo `?a=`, mesmo `#slide`, mesmo `?presenter`), uma vez só; a troca no painel no meio da call não derruba a tela, e a prévia do painel acompanha ao salvar. O caminho fica na ficha do navegador (`_v`) pra a volta ir direto. Só valem `/` e `/variacoes/<slug>/`.
- **Nome na tela por R2** (`ficha.nomeTela`): nome e último sobrenome (padrão), nome e primeiro sobrenome (a regra da variação B, que passa a ser uma escolha e não precisa mais de projeto próprio), só o primeiro nome, ou sem nome nem foto (também sem o vídeo do atleta; o checklist não pede foto nem nome conferido; a fala do apresentador segue com o nome).
- **Slide na sequência** (`data-opcional="leva"` no 19, nas duas páginas; `ficha.pular` no painel): as setas passam direto pelo slide tirado, sem renumerar, e o salto direto (número mais Enter, visão geral, `#19`) continua valendo pra quando a família pergunta. O Próximo do apresentador pula, a visão geral apaga o slide, e o botão da prévia do painel aparece riscado.
- O botão Variações e a tecla V, com link de atleta, abrem o R2 dele no painel (outra aba); sem link, a página de exemplos de sempre.

Verificação: `testes/teste-versoes.mjs` (94: cadastro contra as páginas do deck, API, o que o deck recebe, ida pra versão, slide pulado, os quatro nomes, sem nome e sem foto, telas do painel e prévia), `teste-igualdade` 15, concorrência 76, foto 29, isolamento 14, leitura e importação 55, navegador 49 e o `teste-colisao`. Auditoria (`auditoria3.mjs`): 1.808 estados das 17 fichas de antes e mais 551 das fichas novas (sem nome, só o primeiro nome, primeiro sobrenome em nome longo e comum, 19 tirado), padrão e técnica: 0 violações e nenhuma exceção de JavaScript.

## Classificação das versões e foto do lead (12/10/2026)

Pedido do dono: ao lado de cada variação, uma classificação de quanto ela já foi validada, e, nas variações que precisarem, a opção de mostrar o nome e o sobrenome do lead, com foto ou sem, marcada no painel. O que mudou, quase tudo no Painel do Closer (o deck só ganhou `ficha.semFoto`):

- **Classificação** (Validada, Em validação, Não validada), escolhida pelo admin na aba "Versões do R2" (com uma nota que os closers veem). Aparece ao lado do nome da versão na aba e no seletor do R2, com a mais validada primeiro. Vale na hora, sem publicar: fica em `versoes.json` na loja de Blob.
- **O que a versão mostra do lead** (`lead.nome`, `lead.foto`), também ajustado pelo admin por versão. Sem o nome, a versão vira geral (a tela não mostra nome nem foto, o closer não vê as escolhas e o checklist não pede foto nem nome conferido); sem a foto, o nome aparece e o quadro mostra a inicial. Vale também pros R2 já salvos: a `/api/r2` aplica o que a versão deixa (`fichaEfetiva`).
- **Foto fora da tela por lead** (`semFoto`): a caixa "Mostrar a foto do lead na tela" no R2. O deck não pede a foto ao painel e o quadro mostra a inicial do nome.
- O botão do R2 novo diz "Criar R2 e gerar o link" e a seção do link virou "Link da apresentação". O link continua um só por lead (`/?a=<código>`).

Verificação: `teste-versoes-admin.mjs` (70: permissões, validação, persistência, o que vale de verdade, o deck sem foto e sem nome, as telas), `teste-versoes.mjs` 94, igualdade 15, concorrência 76, foto 29, isolamento 14, leitura e importação 55 e navegador 49. Auditoria (`auditoria3.mjs`) da ficha nova com `semFoto` em nome longo, padrão e técnica: 113 estados, 0 violações e nenhuma exceção de JavaScript.

## Sincronização das variações com o painel (12/10/2026)

Pedido do dono: sincronizar com o painel os R2 que já existem e os que vierem, sempre em dia e funcionando. O que mudou:

- **O deck publica a própria lista.** Cada página (a raiz e cada `variacoes/<slug>/`) declara quem é num bloco `<script type="application/json" id="r2-variacao">` no `<head>`: nome, resumo, quando usar, classificação de partida, o que mostra do lead e os slides opcionais. O `gera-manifesto.mjs` lê as páginas e escreve o `variacoes.json` (id e caminho pela pasta, número de slides e posição de cada opcional pelo HTML, hash de cada arquivo). Ele recusa bloco faltando, JSON quebrado, opcional que não bate com o HTML, nome repetido, pasta com nome ruim e travessão. O `PUBLICAR-R2-NOVO.bat` roda o gerador antes de publicar e para se algo estiver errado; o `.vercelignore` deixa o gerador de fora e o `vercel.json` serve o `variacoes.json` sem cache.
- **O painel lê esse arquivo sozinho** (na abertura da lista depois de 2 minutos, todo dia no Cron e no botão "Sincronizar agora") e confere cada página: abre, tem o motor do deck e o número de slides certo. Página nova aparece lá sem cadastro. Página que quebra ou sai do deck é avisada, e o link do lead abre a Principal em vez de dar erro (a ficha segue a variação escolhida, então a privacidade do lead não muda).
- A página de exemplos (`variacoes/index.html`) lista sozinha as páginas novas do `variacoes.json`.
- Pra acrescentar uma página: copiar a pasta, trocar o bloco, rodar o gerador e publicar o deck. Passo a passo em `COMO-ACRESCENTAR-VERSAO.md`, na pasta do painel.

Verificação: `testes/teste-manifesto.mjs` 28 (o gerador e o `variacoes.json` em dia), `teste-sincronizacao.mjs` 106 (deck de verdade e deck de mentira: página nova, página que cai, que sai, manifesto estragado, deck fora do ar ou lento, o Cron, permissões), `teste-sincronizacao-telas.mjs` 46 (faixa, selos, botão desabilitado, seletor, "Sincronizar agora", nada de HTML vindo do deck na tela) e `teste-paginas.mjs` 24, que percorre cada página do `variacoes.json` (link abre ela, nº de slides, nome e foto como ela declara, cada opcional sai e volta, sem exceção). O mesmo `teste-paginas` numa cópia do deck com uma página nova criada só com a pasta e o bloco (`variacoes/direta/`, sem foto) deu 35: o painel e o teste a descobriram sozinhos. Mais `teste-versoes` 95, `teste-versoes-admin` 70, `teste-variacoes-criadas` 71, igualdade 15, concorrência 76, foto 29, isolamento 14, leitura e importação 55, navegador 49 e o `teste-colisao`. A auditoria (`auditoria3.mjs`, que agora percorre as páginas do `variacoes.json`) numa amostra de 7 fichas (padrão, ficha vazia, com foto, nome longo, 19 tirado, sem foto e sem nome): 777 estados nas duas páginas e 385 na página nova da cópia, 0 violações e nenhuma exceção de JavaScript. O HTML dos slides não mudou nesta rodada (só entrou o bloco no `<head>`), por isso a amostra e não a varredura de 17 fichas.

## Painel único com as duas etapas e os quatro decks (12/10/2026)

Pedido do dono: todos os decks de R2 e os de R1 no painel, a diferença entre SDR e closer no painel, e a escolha feita lá, com as variações que ele for criando. O que mudou:

- **Um painel só** (o Painel de Apresentações, `jogador-de-elite-closer`) com duas etapas: R1 (o SDR) e R2 (o closer). Cada papel vê as variações, os leads e os decks da etapa dele; o admin vê as duas e cria variações sobre a página de qualquer deck. O catálogo: R2 novo (este), R2 anterior (25 slides), R2 B (nome e primeiro sobrenome) e R1.
- **Um link por etapa.** O do R1 sai do deck do R1 e o do R2 sai deste deck. Este é o deck de entrada do R2: se a variação escolhida no painel é de outro deck, a `/api/r2` manda `versao: { id, caminho, origem }` e o `assets/deck.js` leva o lead pra lá (mesmo `?a=`, mesmo `#slide`), só pras 4 origens de `DECKS_OK` e só pra `/` ou `/variacoes/<slug>/`. Origem fora da lista, origem parecida (`...vercel.app.evil.example`) e caminho estranho (`//evil.example/`) são ignorados: o lead fica onde está. O destino guardado na ficha (`_v`) passa a ser `{ o, c }` (o formato de antes, só o caminho, ainda vale).
- **O que mudou neste deck:** só o trecho do redirecionamento no `assets/deck.js` (`DECKS_OK`, `destinoDe`, `destinoSalvo`, `iraVersao`). Slides, motor e visual ficaram como estavam, por isso não rodei a varredura de layout de novo.
- Os outros decks entraram no catálogo: R2 B, R2 anterior e R1 ganharam o bloco `r2-variacao` e o `variacoes.json`; o R1 e o R2 anterior passaram a ler o lead do painel novo (mesmo endereço de antes, `/api/publico?id=`) e, pros links que o painel de antes já mandou às famílias, perguntam a ele quando o novo responde 404.
- A `/api/r2` só manda a foto quando a tela dela mostra (foto fora da tela pelo closer ou pela variação), então a escolha vale até no R2 B, que não conhece o `semFoto`.
- Passo a passo pra acrescentar página ou deck: `COMO-ACRESCENTAR-VERSAO.md`, na pasta do painel.

Verificação (tudo local, sem tocar na produção): `teste-paginas` 61 (as 7 páginas dos 4 decks: o link de entrada da etapa leva até cada uma, nº de slides, nome e foto como cada deck faz, cada opcional sai e volta), `teste-decks` 37 (os decks de verdade com o painel de verdade: o R1 e o R2 anterior leem pelo endereço de antes, o deck de entrada leva o lead pra outro deck, trocar a variação com o mesmo link, a defesa contra origem fora da lista, os links do painel de antes), `teste-etapas` 86, `teste-etapas-telas` 51, `teste-migracao` 18 (a atualização em cima do `versoes.json` e dos leads de antes), `teste-versoes` 95, `teste-versoes-admin` 70, `teste-variacoes-criadas` 71, `teste-sincronizacao` 106, `teste-sincronizacao-telas` 46, `teste-manifesto` 28, igualdade 15, concorrência 76, foto 35, isolamento 14, leitura e importação 55 e navegador 49 (913 verificações nos 17 testes do painel), mais o `teste-colisao` do deck (cada link com a sua ficha e o seu canal). Um defeito injetado de propósito (o deck aceitando qualquer origem) fez o `teste-decks` acusar 2 falhas.

## Bloco da página institucional: seis slides novos (17/10/2026)

Pedido do dono: levar as partes da /institucional (aizyron.com/institucional) pros materiais de apoio dos vendedores, com as mesmas animações e com a persuasão da apresentação. Backups de antes: `backup-r2novo-2026-10-17-antes-do-bloco-institucional` (e um por deck: r2b, r2, r1). Nada foi publicado.

**O que entrou.** R2 novo e R2 B (padrão e técnica): 33 slides, +7 min de tela (59 para 66). O 10 (o método: a IA encontra, a gente conduz), o 13 (o campo animado, olhômetro × IA), o 14 (você não precisa ser o próximo Neymar, com o radar), o 22 (326 atletas enviados, no cartão creme), o 23 (clubes e parceiros, com as faixas de escudos) e o 24 (o mosaico "cada rosto, uma história"). Todos opcionais no Painel do Closer (7 opcionais por página, com o "leva"). Os números dos outros slides andaram: 10 e 11 andam 1, 12 a 18 andam 3 e 19 a 27 andam 6. Roteiro, etapas, objeções, checklist, aba Ler antes e notas do gestor foram renumerados e refeitos (33 falas, 66 min).

**Nas outras páginas.** R2 anterior, técnica e acompanhamento (24 para 30 slides): os mesmos seis, sem opcional, porque o motor dessas páginas não tem o recurso de tirar slide da sequência. Na acompanhamento o encaixe vem antes do "seu perfil e encaixe em campo", pra não repetir a ideia logo depois. R1 (16 para 20): só o campo (7), os 326 (13), os clubes e parceiros (14) e o mosaico (18). O método e o encaixe ficaram de fora porque o R1 já tem "como o Zyron funciona" e "o encaixe". O R1 tem paleta própria (preto, dourado e azul): o bloco dele usa `bloco-r1.css`, e o campo vira sozinho do olhômetro pra IA em 7 segundos, porque o R1 não tem avanço por passo.

**Exceções às regras da casa, e como desligar.**
- Animação além de `.rise`: o campo (22 jogadores e a bola, com requestAnimationFrame), as barras, a cadeia, o radar, as faixas de escudos, o mosaico e o contador do 326. Só roda no slide ativo. No campo (13), dois botões, "Olhômetro" e "Inteligência artificial", trocam o modo com um clique, no mesmo slide (abre sempre no olhômetro). Chaves: `?bloco=estatico` no endereço, `window.BLOCO.animar = false` e o "reduzir movimento" do aparelho (tudo para no quadro final).
- Nota, atributo e percentual: a institucional mostra velocidade de cada jogador, notas por indicador e "compatibilidade %". Aqui nada disso aparece (barras cheias com um visto, radar sem número, campo sem velocidade). `window.BLOCO.numeros = true` devolve os números; deixei desligado por causa da regra de não dar nota nem atributo.
- Marca e números como na institucional: Voxen | Zyron, 326, @assessoria.voxen e os parceiros comerciais (Adidas, Nike, Cloudflare, AWS Amazon e A.E.K. London, com acordo confirmado pelo dono). A nota legal dos escudos ficou na tela (não indicam patrocínio, uso da plataforma nem promessa de clube).
- Fotos de outros atletas: o mosaico e a arte do 326 são do arquivo público do Instagram da casa. A regra "usar a foto de outro atleta" ficou esclarecida no PROIBIDOS (vale pra foto da pessoa da call).
- O texto do dono, ajustado pelas regras: "um clube específico está procurando" virou "um clube está procurando"; "e nós sabemos qual clube é esse" ficou de fora (não pode existir vaga num clube específico); "o scout conduz" virou "a gente conduz" (o deck não chama a pessoa de scout, e Scout PRO é um plano); "atleta certo, clube certo" virou "o encaixe é método" ("certo" é palavra proibida pro encaminhamento). O 326 diz "enviados", como na arte: nunca "contratados".

**O que a auditoria achou.** Os seis slides novos: 0 violações (texto de 24 px ou mais, nada fora do palco, texto sobre texto, palavras proibidas, travessão, imagem quebrada), em 356 estados no R2 novo padrão, 281 na técnica, 143 no R2 B, 162 no R2 anterior e 20 no R1. A auditoria achou coisas que já existiam antes, conferidas no backup, e que em 17/10/2026 foram corrigidas: slides 02 (escolha) e 19 (formação, era o 16), que tinham texto de 19 a 23 px e uma sobreposição com nome longo (agora o texto tem 24 px ou mais e o título da formação nunca cobre a grade); no R2 anterior, o slide da acompanhamento "seu perfil e encaixe em campo" (travessão no nome da formação, rótulos de 14 px, título de 88 px), a sobreposição "A leitura do seu jogo" com "Scout PRO" no slide dos planos e a palavra "incondicional" na garantia, que o dono manteve em 17/10/2026 (a auditoria continua acusando essa palavra no slide 29 do R2 anterior, como exceção aceita); no R1, "o melhor da peneira" no slide do encaixe, que virou "o destaque da peneira", e o texto pequeno nos slides 2, 9 e 11. No R2 anterior, a linha "A gente só ganha se você ganhar." também cobria a nota legal do slide dos planos com o Scout PRO (a coluna passava de 990 px); agora a lista aperta só nesse plano e os outros ficaram iguais. Na acompanhamento, o texto de 24 px do dossiê empurrava clubes de nome muito longo pro rodapé: no slide 11 o nome do clube vai até 2 linhas e a folga sob o título caiu de 80 para 24 px, e no slide 18, com dois ou três clubes, a liga vai até 1 linha e o motivo até 3 (o texto inteiro continua na ficha do painel). Na tela do relatório (slide 15) o card do clube mantém as etiquetas de posição e categoria: pra caber em 24 px a folga do quadro foi apertada (topo da identidade, abas, grade e espaço entre os cards). Rodada completa depois das correções (todas as variantes de nome, foto e slide tirado): R2 novo 3852 estados e R2 B 2919, sem nenhuma violação; R1 420 estados, sem violação; R2 anterior 3276 estados, com o último achado (o slide dos planos com Scout PRO) corrigido e reconferido nas cinco variantes que o acusavam (780 estados, sem violação).

**O que ficou com você.**
- Rodar o Painel do Closer depois do deploy (ele sincroniza os opcionais sozinho pelo variacoes.json, já regerado nos quatro decks).
- Dizer se a palavra "scout" volta pro título do 10, e se os números (velocidade, barras, percentual) podem voltar com `BLOCO.numeros = true`.
- Confirmar quem é o homem da foto do 326 (a fala manda responder só o que o dono confirmou) e se algum clube da faixa quer sair.
- Revisar o tempo: com os seis slides a call passa de 60 min se tudo entrar. Os de prova (22, 23 e 24) são os primeiros a tirar.
