# APRESENTACAO_R2_PLANOS_PROMPT.md

Versão: v2 (05/10/2026)
Prompt pro Opus 5.5 remodelar o deck da R2 com três planos: Scouting (R$ 997), Scouting PRO (R$ 1.497) e Assessoria de Elite Legacy (R$ 2.997). É só o briefing: nada foi aplicado no deck. Fonte editável do R2: `C:\Users\Me\Downloads\bum\jogador-de-elite-r2` (fora do repo, sem git). Deck publicado: https://jogador-de-elite-r2.vercel.app/ (o slide 12 é a referência do dono).

Changelog:
- v2: sem link de pagamento no deck (o Gestor manda o link pelo WhatsApp, na call, depois de acertar o plano); Scouting PRO posicionado como o mais acessível e Legacy como o mais completo, com as alavancas e as regras pra isso ser verdadeiro; perguntas pra acertar o plano no roteiro.
- v1: criação, a partir do deck local da R2 (25 slides), de `roteiro.js`, `deck.js`, do PLAYBOOK_CLOSER v9 e do CASOS v7.

Como usar:
1. Leia `<premissas>` e corrija o que estiver errado antes de enviar. É o que o Opus vai assumir sem perguntar.
2. Abra o Opus 5.5 com acesso a `C:\Users\Me\Downloads\bum` e a este repo. Envie tudo abaixo da linha marcada, ou escreva: "Siga o prompt do arquivo APRESENTACAO_R2_PLANOS_PROMPT.md".
3. O Opus não publica nada. Você abre o deck local, testa os três planos e só então pede o deploy.

=============== COPIE DAQUI PRA BAIXO ===============

<tarefa>
Você vai remodelar o deck da R2 do Jogador de Elite, a ferramenta que o Gestor de Carreiras usa na call de fechamento com a família do atleta, pra vender três planos no lugar de um: Scouting, Scouting PRO e Assessoria de Elite Legacy. Hoje o deck apresenta um plano único, R$ 3.997 por ano. Isto não é troca de preço: os planos mudam o que a família recebe, com que frequência alguém olha pro atleta e quem fica do lado dele. Tela, roteiro, apresentador, objeções e notas precisam contar isso do mesmo jeito, sem nenhuma promessa que o plano não cumpre.

O papel do deck nessa parte é acertar o melhor plano pra família e fechar. O link de pagamento não entra no deck: acertado o plano, o Gestor manda o link pelo WhatsApp, de preferência na própria call, e vende. E duas coisas precisam ficar claras na tela: o Scouting PRO é o plano mais acessível pra ter gente de verdade do lado do atleta, e o Legacy é o mais completo.

O que entregar:
1. O deck padrão e a variação técnica remodelados.
2. Modo apresentador, roteiro, objeções e `notas-do-gestor.md` coerentes com os planos.
3. A identidade dos três planos (descritor de papel, promessa, cor, como o Gestor fala de cada um), aplicada na tela e registrada nas notas. Os nomes já são do dono (ver `<os_tres_planos>`): o seu trabalho é o branding em volta deles.
4. Um relatório final curto, no formato de `<entrega>`.

Limites: não faça deploy, não rode git nem commit no repo `mnkk`, não edite os playbooks nem os docs `APRESENTACAO_*.md`. O que fazer neles entra só no relatório.

Escreva pro dono: português do Brasil, informal e direto, sem travessão (nem o longo nem o curto) em nenhum texto: tela, roteiro, notas, comentário de código, relatório. Use ponto, vírgula, dois-pontos ou parênteses.
</tarefa>

<palavras_do_dono>
Fonte primária, transcrita com ortografia e concordância ajustadas, sem mudar as palavras. Em dúvida entre este briefing e as palavras abaixo, vale o que o dono escreveu.

Sobre o pedido (a referência é o slide 12 do deck publicado): "Preciso que você crie planos, no final, que você vai criar os nomes dos planos, com o branding devido, para basicamente o plano básico, intermediário e avançado, com o branding para esses nomes devido. 'Legacy, Plus, etc...' Os planos são Scouting, Scouting PRO e Assessoria de Elite Legacy. Respectivamente." E: "Remodele isso aí no R2 da forma como deve ser feita."

Scouting: "Scouting precisa ter somente o básico, sobre a parte do Zyron que vai ter acesso contínuo, e um agente humano para elaborar relatórios quinzenais de performance e avanços obtidos. Além de overdelivery de acesso a algumas coisinhas, coloque algumas 3 coisas a mais que façam sentido, mas que não seja tão intermediário ou avançado. Valor de 997 desse."

Scouting PRO: "O outro, de 1497, que vai ser o PRO, que vai ter acompanhamento do scouter semanal. Ligação, vai fazer o acompanhamento ali com ele, vai ter acesso aos nutricionistas, acesso a um estrategista esportivo, acesso a um grupo de networking com outros atletas, conexões diretas com atletas para networking e direito a encontros com a equipe de gestão de carreiras para ver o que vai precisar para o jogador ser encaminhado."

Assessoria de Elite Legacy: "Na parte da assessoria de elite legacy, preciso que você inclua tudo anteriormente, mas muda a parte de que vai ter acesso diário com o scouter, de que vai ter acesso direto com o David, com conexões, clubes, e tudo mais. Esse 2997."

Segunda mensagem do dono (05/10/2026): "Não vai ter link na apresentação, apenas acertar qual o melhor plano possível, e fechamos. E com base nisso, mandamos o link, de preferência em call, e vendemos. Atente-se também a formas de deixar o preço intermediário como o mais 'acessível' mas o Legacy como o mais completo, deixe isso claro na apresentação."

Leituras adotadas onde as palavras deixam margem (todas entram no relatório final):
- "Agente humano" do Scouting é o analista de performance, cargo público do CASOS.md (item 0): quem manda relatório e mede a evolução. Na tela, nunca "agente".
- Legacy: o acompanhamento do scouter sobe de semanal (PRO) pra diário, e entra o acesso direto ao David. Se o dono quis dizer que o David substitui o scouter, é só trocar uma linha: diga no relatório qual leitura você usou.
- "Branding devido": os três nomes não mudam. Branding é descritor de papel, promessa, cor, grafia e fala.
- "Acesso contínuo ao Zyron": o atleta manda vídeo novo e sai relatório novo (como o deck já descreve), sem limite numérico escrito na tela.
- "Não vai ter link na apresentação": nenhum link de pagamento em lugar nenhum do deck, nem na tela da família, nem no apresentador, nem em `roteiro.js`, nas variações ou nas notas.
- "Intermediário como o mais 'acessível'": o dono pôs "acessível" entre aspas, no sentido de ao alcance, não de o mais barato (o Scouting custa menos). O PRO é o jeito mais acessível de ter uma pessoa do lado do atleta toda semana, e o Legacy é o mais completo. O texto precisa continuar verdadeiro quando o Scouting aparece na tela.
</palavras_do_dono>

<contexto>
Jogador de Elite é uma assessoria de carreira pra atletas de base (13 a 17 anos). O deck da R2 é a ferramenta do Gestor de Carreiras (o Closer) na segunda call, com pai, mãe e atleta juntos, em tela compartilhada. A família já fez a R1 com o estrategista esportivo (o SDR), viu o deck da R1 e combinou decidir na R2. Chega ansiosa e meio desconfiada: desconfiança se vence com prova concreta, e uma promessa que não se sustenta derruba a confiança no resto.

Como a casa vende (PLAYBOOK_CLOSER v9, regras que o deck herda):
- A gente seleciona, a família também escolhe. O investimento é o custo mínimo pra estrutura existir, e o lucro vem do contrato profissional do atleta.
- Um valor por vez, na tela e na fala. Depois do número, silêncio. Descer de plano é pelo escopo, nunca por desconto: "existe um formato mais enxuto, com [o que muda]".
- Garantia antes do número. O link de pagamento fica fora do deck: acertado o plano, o Gestor manda o link pelo WhatsApp, de preferência na própria call, e só depois do sim. Dois finais: Modo A (fecha na call) e Modo B (a equipe decide e o Gestor volta em hora marcada).
- Palavras da casa: "assessoria" (nunca "mentoria", "programa" ou "pacote"), "o Zyron" no masculino, "encaminhado" nunca vira "contratado". Nunca se promete contrato, clube, prazo ou renda.
- O PLAYBOOK_CLOSER já pedia esta definição: a seção 16, item 3, é "o que muda entre os planos, pra descer de plano pelo escopo". Este trabalho responde esse item.

Quem é quem (use estes termos):

| Termo | Como o deck usa hoje | Regra pra este trabalho |
| --- | --- | --- |
| o Zyron | IA própria. Lê o vídeo que a família envia, lance a lance | Nos três planos. Nunca "jogos inteiros". Sempre no masculino |
| scouter | "Um scouter do Zyron só seu", quem acompanha o atleta | O dono pôs ligação semanal (PRO) e acesso diário (Legacy). Escreva frases verdadeiras nas duas leituras ("seu scouter, com o Zyron do seu lado, liga toda semana"). Sem explicar a diferença na tela |
| analista de performance | Cargo público (CASOS.md, item 0), faz relatório e mede a evolução | É o "agente humano" do Scouting. Na tela: "analista de performance" ou "uma pessoa da equipe". Nunca "agente" (soa como agente de jogador) |
| gerente de carreira | Acompanha todo dia e organiza a ida ao clube | Fica no Legacy como está. No PRO só aparece como "equipe de gestão de carreiras", nos encontros |
| estrategista esportivo | Cargo público do SDR, quem fez a R1 | O dono pôs "acesso a um estrategista esportivo" no PRO. Mantenha o termo, sem dizer que é a mesma pessoa da R1 |
| David | Não aparece no R2 hoje | David Willer, o rosto da casa (assinando com o Joãozinho e com o Gama no deck da R1). O cargo dele nunca foi definido: não invente, diga "o David" |
| Gestor de Carreiras | Quem apresenta a R2 | |
</contexto>

<fonte_da_verdade>
- Base: a cópia local `C:\Users\Me\Downloads\bum\jogador-de-elite-r2`. Ela é mais nova que a publicada: no local o "IA na Prática" é o slide 13 (Depoimento 14, Nem tudo é talento 15, AGN 16); no publicado ele ainda está no 16. O slide 12 é idêntico nos dois. Parta do local, nunca do publicado.
- Os docs `APRESENTACAO_R2.md`, `APRESENTACAO_R2_PROMPT.md` e `APRESENTACAO_R2_VARIACOES.md` (repo `mnkk`) estão desatualizados em relação ao deck: dizem "nenhum slide mostra preço", falam de 26 a 30 slides e de dossiê. Use só pra entender intenção e estilo. Onde divergirem do código, vale o código.
- PLAYBOOK_CLOSER.md e CASOS.md valem pra doutrina e vocabulário.
- Arquivos do R2: `index.html` (25 slides), `assets/roteiro.js` (roteiro, objeções, follow-up, PLANOS, PRECO_TELA, PARCELA_TELA, CHECKLIST, PROIBIDOS), `assets/deck.js` (motor: palco, apresentador, ficha), `assets/deck.css` e `assets/r2.css` (visual), `assets/variacoes/tecnica.js` e `variacoes/tecnica/index.html` (variação técnica: mesmos slides nas mesmas posições, copy própria), `variacoes/index.html` (página de escolha), `notas-do-gestor.md` (espelho em texto do roteiro, fora do deploy pelo `.vercelignore`).
- Fim de linha: CRLF em `index.html`, `roteiro.js`, `deck.js`, `tecnica.js`, `tecnica/index.html` e `notas-do-gestor.md`; LF em `variacoes/index.html`; `r2.css` é misto. Preserve. A ferramenta de edição pode gravar LF: confira com contagem no fim.
</fonte_da_verdade>

<estado_atual>
Os 25 slides do local: 01 Capa · 02 Por que você · 03 Alinhamento · 04 O planejamento de carreira · 05 E se? · 06 Zyron · 07 O Zyron trabalhando (vídeo) · 08 Como o Zyron funciona · 09 Olhômetro ou dados reais · 10 O encaixe · 11 A base do Zyron · 12 O que ninguém mais tem · 13 IA na Prática (ao vivo) · 14 Depoimento de uma mãe · 15 Nem tudo é talento · 16 AGN Football · 17 O valor real (R$ 30.000 por ano, sete frentes, revelação item a item) · 18 Até lá, a gente investe · 19 Não é pra qualquer um (turma de 10) · 20 Quando a gente ganha · 21 Garantia incondicional · 22 A vaga · 23 Montando por conta · 24 O investimento (`id="silencio"`) · 25 Bem-vindo. Tempo de tela somado: 56 min (a call é de 45 a 60).

O slide 12 é a referência do dono. Tabela "Sozinho, na peneira" x "Com a gente", quatro linhas: Quem analisa (o Zyron, com dados reais do jogo dele) · Quem acompanha (o gerente de carreira, todo dia) · Quem leva aos clubes (a gente: +250 clubes na rede e AGN Football) · Quem corre o risco (a gente, que só ganha quando ele fecha). Fecha com "O olhômetro pode não ter visto você. O Zyron viu." Hoje o "Com a gente" é o serviço inteiro. Com três planos, "Quem acompanha" e "Quem leva aos clubes" passam a variar por plano: os três planos são três níveis das linhas do 12. Por isso o 12 é o espelho da remodelação.

Onde o plano único está cravado:
- Tela: 14 (rodapé "10 atletas por turma"), 19 (turma de 10), 22 (vaga, turma, "em até 3 meses, mais de 93%"), 23 e 24 (benefícios do plano único, âncora de R$ 30.000, R$ 3.997 por ano, 10x sem juros de R$ 399,70, "R$ 30 mil+ por mês"), 25 (Bem-vindo: "Todo dia", "O dia da assinatura", post "Imagine este anúncio").
- `roteiro.js`: `ROTEIRO` dos slides 23 e 24 (linhas 257 a 286), o comentário do topo, `OBJECOES` (valor alto, não tenho o dinheiro agora, vou ver outras opções, vou pensar), `FOLLOWUP`, `PLANOS` (linhas 414 a 421, quatro planos antigos com link do Kirvano), `PRECO_TELA` e `PARCELA_TELA` (424 a 426), `CHECKLIST`, `PROIBIDOS`.
- `deck.js`: `SILENCE_SLIDE` achado por `id="silencio"` (linha 17); `derived()` (35 a 54) e `cond()` (57 a 66, aceita `a|b`, `a&b`, `!a` e `k=v`); `payBtns` (426 a 428); o bloco `cur === VAGA` do `renderCtl` (487 a 499), que fala o `PRECO_TELA` fixo e mostra o cartão de link; o handler `data-pay` (516); campos `plano` e `valor` da ficha (613 e 614); `onField` plano para valor (658 a 662); `planoFechado` (625) e `crmText` (730 a 747); tabela `LER` com número de slide fixo (758 a 768); `renderFech`, com os cartões de link (792 a 811).
- Também: `tecnica.js` (o "número, uma vez" perto das linhas 210 a 221), `tecnica/index.html` (mesmos slides 23 e 24), `variacoes/index.html` (linha 74 cita R$ 3.997), `notas-do-gestor.md` (linhas 3 a 22, slides 23 e 24, e a tabela de links perto da linha 577).
- Hoje a tela da família nunca mostra plano nem link, e o apresentador mostra o link do plano da ficha (cartões na aba Fechamento, botões no cursor do 24). Isso sai (P10). `PLANOS` atual: Assessoria de Elite - Legacy R$ 2.997,00, Assessoria de Elite R$ 1.497,90, Scouting PRO R$ 497,90 e Scouter R$ 47,90 por mês.

Armadilhas do motor:
- `data-bind` usa `textContent` (só texto). `data-if` e `data-ifnot` só ligam e desligam classe: o CSS (`deck.css`, linhas 139 e 140) é que esconde. Pra lista de itens, use blocos com `data-if` ou um renderizador.
- `data-step` revela por avanço e o apresentador mostra o que entra no próximo (`renderCtl`). A miniatura (visão geral e apresentador) clona o slide, então reflete o plano da ficha.
- Não tire o `id="silencio"` do slide do número.
- Ficha salva no navegador pode ter `plano` com nome antigo: vazio ou desconhecido vira Legacy, sem quebrar.
- O comentário HTML do slide 23 diz "vêm juntos no 23" (é no 24). Corrija quando mexer.
</estado_atual>

<os_tres_planos>
Eixo que organiza tudo: a frequência com que alguém olha pro atleta. A cada 15 dias, toda semana, todo dia. É a linha "Quem acompanha" do slide 12 em três velocidades. Use isso como espinha da identidade e do slide dos planos.

Os planos são cumulativos: o PRO tem tudo do Scouting, o Legacy tem tudo do PRO.

| | Scouting | Scouting PRO | Assessoria de Elite Legacy |
| --- | --- | --- | --- |
| Nível | Básico | Intermediário | Avançado |
| Preço (P2) | R$ 997 por ano, 10x sem juros de R$ 99,70 | R$ 1.497 por ano, 10x sem juros de R$ 149,70 | R$ 2.997 por ano, 10x sem juros de R$ 299,70 |
| Ritmo | A cada 15 dias | Toda semana | Todo dia |
| Papel na tela e na fala | Pra começar: o degrau de entrada | O mais acessível com gente do seu lado | O mais completo |

Scouting (só o básico):
- Acesso contínuo ao Zyron: o atleta manda vídeo novo, sai relatório novo.
- Um analista de performance faz relatório quinzenal de performance e dos avanços obtidos.
- Três extras pequenos, que não invadem o PRO nem o Legacy. Proposta (P9), o dono valida: (1) relatório de entrada, a linha de base de onde o atleta parte, que também dá régua pros avanços; (2) histórico de evolução, todos os relatórios num lugar só pra família ver o antes e o depois; (3) guia de preparação pra peneira, o que os avaliadores olham e como o atleta se apresenta em vinte minutos, que responde direto o "olhômetro" do 12. Guarde os três como dado editável num lugar só.

Scouting PRO (tudo do Scouting, mais):
- Acompanhamento semanal do scouter, por ligação.
- Acesso a nutricionistas.
- Acesso a um estrategista esportivo.
- Acesso a um grupo de networking com outros atletas.
- Conexões diretas com atletas, pra networking.
- Direito a encontros com a equipe de gestão de carreiras, pra ver o que o atleta vai precisar pra ser encaminhado.

Assessoria de Elite Legacy (tudo do PRO, mais):
- Acesso diário ao scouter (sobe da ligação semanal do PRO).
- Acesso direto ao David, com as conexões e os clubes dele, e tudo mais.
- E o que o deck promete hoje pro serviço completo (P4): gerente de carreira todo dia, as sete frentes, o perfil levado aos clubes da rede e à AGN, "quando o clube chamar, a ida organizada com vocês".

Nada além disto. Sem número que o dono não deu (quantas ligações, encontros, consultas, vídeos por ciclo), sem prazo, sem serviço novo. Nutricionista e estrategista: use um verbo que não prometa mais que o "acesso" do dono (nada de consulta individual nem de quantidade). Encaminhamento a clubes, AGN, +250 clubes e os 93% em até 3 meses são do Legacy: no PRO e no Scouting a tela e a fala não atribuem isso ao plano. O PRO só promete os encontros pra ver o que falta pro encaminhamento.

Posicionamento (pedido do dono): o PRO é o "acessível" e o Legacy é o mais completo, e isso precisa ficar claro na tela e na fala. O Scouting custa menos que o PRO, então "acessível" tem que ser verdadeiro quando os três aparecem: o PRO é o jeito mais acessível de ter uma pessoa do seu lado toda semana, com nutricionistas, estrategista e a equipe de gestão de carreiras; o Legacy é o único com o scouter todo dia, o David direto e as conexões e clubes. Nunca escreva "o mais barato" nem "o mais acessível de todos" no PRO. Alavancas honestas, use as que cabem em cada slide e na fala:
1. Papel escrito: cada plano com um descritor que diz o seu papel (Pra começar, O mais acessível com gente do seu lado, O mais completo).
2. A diferença pro degrau de cima, em uma linha: o que o Legacy acrescenta ao PRO (scouter todo dia, David direto, conexões e clubes) e o que o PRO acrescenta ao Scouting (ligação toda semana, nutricionistas, estrategista, networking, encontros com a equipe). Na tela só no 23. No apresentador, como a frase que o Gestor diz se a família perguntar "e o outro?".
3. A relação de preço, que é verdadeira: o PRO custa cerca de metade do Legacy (R$ 1.497 e R$ 2.997) e o Scouting cerca de um terço. Pode aparecer como frase no 24 do PRO, sem escrever o número do outro plano.
4. A parcela como número grande no 24 (10x de R$ 149,70 no PRO), do jeito que o deck já faz com o R$ 399,70.
5. Na fala, o "por dia no prazo médio de 3 meses" que o PLAYBOOK_CLOSER já usa (seção 07): menos de R$ 17 por dia no PRO, menos de R$ 34 no Legacy, menos de R$ 12 no Scouting. Só na fala, como hoje: não volta pra tela.
6. A ordem da conversa: Legacy abre (é o completo e dá a régua), o PRO entra como o formato mais enxuto e acessível, e o Scouting só quando o caixa realmente pedir.
Fora: "mais vendido", "mais escolhido", "recomendado pela maioria", selo de oferta, escassez nova, contagem regressiva, dado de popularidade que não existe.
</os_tres_planos>

<premissas>
O que você assume sem perguntar. Aplique o default, registre no relatório e deixe cada ponto fácil de reverter. "Confirmar" é o que o dono ainda precisa validar.

P1. Nomes e preços como o dono definiu. Os nomes não mudam.
P2 (confirmar). Os valores são anuais e parcelam em 10x sem juros, o mesmo formato do deck hoje (R$ 3.997 por ano, 10x de R$ 399,70). Tickets no `PLANOS` (vão pro CRM): R$ 997,00, R$ 1.497,00 e R$ 2.997,00. O Kirvano antigo usa centavos (R$ 1.497,90), então o ticket final é o que o dono confirmar.
P3. Planos cumulativos.
P4 (confirmar). O deck de hoje inteiro descreve o Legacy, o plano de abertura da conversa (no PLAYBOOK_CLOSER: "padrão, o mais vendido, primeiro sempre que o CRM não mostra aperto financeiro"). PRO e Scouting são os formatos mais enxutos pra descer pelo escopo, e o PRO é o degrau mais provável. Sem ficha, o deck mostra o Legacy. O deck funciona nos dois sentidos: o Gestor pode abrir pelo PRO escolhendo-o na ficha e subir pro Legacy se a família quiser o completo.
P5 (confirmar). "Turma de 10" e vagas só valem pro Legacy: o argumento é "o máximo que o gerente de carreira acompanha de perto, todo dia", e só o Legacy tem o todo dia.
P6 (confirmar). A garantia incondicional vale nos três planos.
P7 (confirmar, sobretudo pro Scouting). "A gente só ganha se você ganhar" e "esse valor só custeia os profissionais parceiros" são regra da casa (PLAYBOOK_CLOSER, regras da casa) e ficam nos três planos. Isole essas linhas pra ser fácil restringir.
P8 (confirmar). A âncora de R$ 30.000 por ano (sete frentes) e "um atleta médio nosso fecha ganhando R$ 30 mil+ por mês" acompanham só o Legacy.
P9 (confirmar). Os três extras do Scouting são proposta, não decisão.
P10. Sem link de pagamento no deck (decisão do dono). Remova os campos `link` do `PLANOS`, o `payBtns`, o handler `data-pay`, os cartões "Links de pagamento" da aba Fechamento, o bloco de link do cursor do 24, a tabela de links e o comentário dos links (`roteiro.js` linhas 414 e 415, notas linhas 573 a 582). Mantenha `ticket`. Ajuste os textos que citam link: a atenção do slide 24 ("Link de pagamento só depois do sim (aba Fechamento)"), `FOLLOWUP.sim`, `CHECKLIST`, o hint do campo `plano`, a linha "Plano e link de pagamento" do `LER` e as linhas 17 e 18 das notas. O que sobra é o lembrete: o link só vai depois do sim, pelo WhatsApp, na call, e o Gestor tem o link fora do deck.
P11 (confirmar). O deck passa a ter só três planos. Saem do `PLANOS` a "Assessoria de Elite" (R$ 1.497,90) e o "Scouter" mensal (R$ 47,90), que seguem no PLAYBOOK até o dono decidir.
P12. Números de prova (93%, +250, +75, 10+): não mexa onde estão, e não os repita nos slides de plano como se fossem entrega do Scouting ou do PRO.
P13. "Acessível" e "completo" valem só nos sentidos de `<os_tres_planos>`. Nada de dado de popularidade, que não existe.
</premissas>

<arquitetura>
Direção recomendada. Se o código mostrar um jeito melhor, ajuste e justifique no relatório. As regras duras não mudam.

A. Fluxo na tela. Os slides 01 a 22 mantêm ordem e número: o #12 e todo link por número seguem valendo, e a tabela LER, `OBJECOES[].slides` e os "slide NN" do roteiro dependem disso. Só 23, 24 e 25 mudam de função. O total continua 25.
- 23, "Os planos" (era "Montando por conta", cuja lista de benefícios o 24 já repete): sem nenhum preço. Uma matriz que ecoa o 12: uma coluna por plano (Scouting, Scouting PRO, Legacy), cada uma com o nome, o descritor de papel (Pra começar, O mais acessível com gente do seu lado, O mais completo) e linhas curtas: quem lê o seu jogo, quem acompanha (o ritmo: a cada 15 dias, toda semana, todo dia), quem cuida de você, quem conecta você. Célula que o plano não tem fica vazia e apagada, nunca com travessão. Cada coluna entra por avanço (`data-step`, como o 17 revela as frentes). Cada célula com até seis palavras. Uma linha em dourado no pé faz a pergunta que acerta o plano: "Qual ritmo faz sentido pro [atleta]?". O plano da ficha aparece destacado, como a recomendação do Gestor, sem cara de tabela de preços.
- 24 (`id="silencio"`, continua sendo o slide do número, do Silêncio e do "fale o número e pare"): um plano por vez, o da ficha. Nome com a identidade do plano, descritor de papel, ritmo, o que inclui (só o que o plano entrega, começando por "Tudo do [plano de baixo], mais:"), preço por ano e parcelamento, com a parcela em número grande como o deck já faz. No PRO, a frase verdadeira de relação com o Legacy ("cerca de metade do valor do Legacy"). No Legacy, a lista inteira, com o que ele acrescenta ao PRO em destaque. Âncora de R$ 30.000 e "R$ 30 mil+ por mês" só no Legacy (P8). A nota legal do rodapé acompanha o plano.
- 25 (Bem-vindo): o bloco "Hoje, Todo dia, O dia da assinatura" segue o ritmo do plano: "Todo dia" (Legacy), "Toda semana" (PRO), "A cada 15 dias" (Scouting), só com campos da ficha e prazos confirmados. Contrato, assinatura, AGN e o post "Imagine este anúncio" ficam só no Legacy. No PRO e no Scouting essa parte vira o próximo passo do plano, sem prazo inventado.
- Por que assim: respeita "um valor por vez", mostra os três planos sem cara de cardápio, deixa o PRO como o acessível e o Legacy como o completo antes do número, e, como a matriz vem antes do número, a transparência ajuda a desconfiança da família. Preço dentro da matriz seria outra decisão do dono: não faça por conta própria.

B. Dados num lugar só. `window.PLANOS` em `roteiro.js` vira a fonte única. Um item por plano, por exemplo: `id`, `nome`, `ritmo`, `preco`, `parcela`, `ticket`, `descritor` (o papel), `promessa`, `inclui[]` (só o que o plano acrescenta), `extras[]` (Scouting), `sai[]` (o que sai ao descer pra ele), `diferenca` (uma linha: o que o degrau de cima acrescenta). Sem `link`. Tela (23, 24, 25), apresentador e `notas-do-gestor.md` leem ou espelham dali. A variação técnica carrega o mesmo `roteiro.js` e herda. `derived()` ganha `planoId` (`scouting`, `pro` ou `legacy`; vazio ou desconhecido vira `legacy`) e o que a tela precisar, e `data-if="planoId=legacy"` já funciona no `cond`. Remova `PRECO_TELA` e `PARCELA_TELA` e tudo que os usa.

C. O resto do deck. Só mexa onde a tela promete algo que o plano da ficha não tem.
- 12: layout intacto. Uma nota de escopo discreta (`.legal`, 24 px): a estrutura completa é a do Legacy, cada plano entrega uma parte dela.
- 14 (rodapé "10 atletas por turma"), 19 (turma) e 22 (vagas, "em até 3 meses, mais de 93%", "o dia da assinatura"): só no Legacy, com `data-if`. Com PRO ou Scouting na ficha, 22 vira um "o começo" curto, sem escassez nem prazo inventado.
- 20 e 21: ficam pros três, com as notas legais que já têm. No roteiro do 20, avise que a faixa de contrato é referência da casa, não promessa do plano.
- 04, 08, 17, 18: descrevem o serviço completo. Ficam. Se achar uma frase que o Gestor vai dizer a um plano menor e que seja falsa, corrija no roteiro (fala e atenção), não na tela.
- Procure por "turma" e "gerente de carreira" no `index.html` inteiro pra não deixar nenhum resíduo.

D. Apresentador.
- Ficha: o campo `plano` com os três nomes. O hint lembra a regra de escolha da casa: Legacy se a ficha não mostra aperto financeiro; PRO se a dor financeira é forte ou na objeção de caixa depois do Legacy; Scouting só se o caixa não comporta o PRO. O campo `valor` só fica se ainda tiver uso. O campo `planoFechado` usa os mesmos nomes. Texto do CRM com nome e ticket novos.
- "Fale o número e pare": usa preço e parcela do plano da ficha. A conferência "a tela mostra X e o link é do plano Y" deixa de existir: a tela e a ficha vêm do mesmo plano e não há link.
- Controle pra trocar de plano, no Fechamento e no cursor do 24: três botões que trocam o `plano` da ficha, e a tela da família acompanha em tempo real. Serve pra descer e pra subir. Ao trocar, o apresentador mostra o que sai (`sai[]`) ou o que entra (`diferenca`), pra o Gestor falar "existe um formato mais enxuto, e o que muda é isto" ou "se vocês quiserem o completo, o Legacy acrescenta isto".
- Link: não existe no deck (P10). Na aba Fechamento ficam os botões de slide, o Silêncio, o Modo A e o Modo B, o "Depois do sim" e o "Depois do ainda não".
- `LER`: renumere o que mudar e descreva o que o plano escolhido muda no 23, 24 e 25.

E. Roteiro e objeções (voz do dono: frases curtas, "pro", "pra", "tô", "vocês", Gestor falando com [pai], [mãe], [atleta]). Siga o esquema atual de cada item (`nome`, `min`, `fala`, `perguntas`, `crm`, `atencao`, `modoB` quando existir). Variável nova entra no mapa do `fill()` e no comentário do topo do `roteiro.js`.
- ROTEIRO 23: antes de recomendar, perguntas pra acertar o plano sem falar de dinheiro (BANT não é interrogatório), na linha de "Qual ritmo faz sentido pro [atleta]? Um relatório a cada 15 dias, alguém ligando toda semana ou alguém do lado dele todo dia?", "Vocês querem nutricionista e estrategista junto?" e "Vocês querem o David direto, com as conexões e os clubes dele?". A resposta aponta o plano, o Gestor recomenda um em voz alta e só então vai pro 24.
- ROTEIRO 24: o número uma vez, com o preço e a parcela do plano da ficha, e silêncio. Depois do "Pix ou cartão?", o Gestor manda o link do plano fechado pelo WhatsApp, na própria call, e faz o pagamento com a família na linha. Use as alavancas de `<os_tres_planos>` pra o PRO soar como o acessível e o Legacy como o completo, e a regra de recomendação da casa: Legacy primeiro, PRO como o formato mais enxuto, Scouting só se o caixa pedir. Um valor por vez.
- Como trocar de plano, com o que sai em cada degrau: do Legacy pro PRO saem o todo dia do scouter (vira semanal), o acesso direto ao David e as conexões e clubes dele, e o que o deck só promete ao serviço completo. Do PRO pro Scouting saem a ligação semanal, nutricionistas, estrategista, grupo e conexões de networking e os encontros com a equipe. Ao descer, o Gestor diz em voz alta que o encaminhamento aos clubes é do Legacy.
- `OBJECOES`: atualize "O valor tá muito alto", "Não tenho o dinheiro agora" e "Vou ver outras opções" com o escopo real de cada plano, as alavancas do acessível e nenhum desconto. Crie "Qual a diferença entre os planos?", apontando o 23. Não crie política de subir de plano nem de abatimento, e não responda "dá pra subir depois?" com regra inventada: deixe fora e liste no relatório.
- `PROIBIDOS`: acrescente "mostrar mais de um preço ao mesmo tempo; atribuir clube, AGN ou contrato ao Scouting e ao PRO; descer de plano por desconto; mandar o link antes do sim". `CHECKLIST` e `FOLLOWUP.sim`: tire a menção a link pronto no deck (P10).
- `min`: 23 e 24 somam o tempo que o antigo 23 tinha mais o que for preciso. Atualize o total em `notas-do-gestor.md`. Se passar de 59 minutos, enxugue.

F. Variação técnica e notas.
- Mesmos slides 23, 24 e 25 e mesmas posições, copy própria onde a técnica já tem (par pra par, menos entusiasmo). Atualize `tecnica.js` e `tecnica/index.html`, e a linha 74 de `variacoes/index.html`.
- `notas-do-gestor.md`: regenere pra bater com o roteiro (cabeçalho nas linhas 3 a 22, slides 23 e 24), apague a seção "Links de pagamento" e acrescente "Como falar de cada plano".
</arquitetura>

<identidade_dos_planos>
Os nomes são do dono: Scouting, Scouting PRO, Assessoria de Elite Legacy ("Legacy" na fala curta). Grafia: "Scouting", "Scouting PRO" (PRO sempre em caixa alta) e "Assessoria de Elite Legacy". Na tela, em Saira Condensed caixa alta, como todo título do deck. O branding é o que vai em volta do nome. Proponha e aplique, dentro destas balizas:

- Espinha: os três planos são três passos da tese da R2 ("ser visto é o começo, o plano leva até o clube"). Scouting, ser visto. Scouting PRO, ser preparado. Legacy, ser apresentado (a clubes, no sentido do deck: encaminhar é apresentar o atleta, nunca contratar). O ritmo amarra os três: a cada 15 dias, toda semana, todo dia.
- Cor, só com tokens que já existem. No deck, azul (`--blue`) é o Zyron, dados e leitura do jogo; dourado (`--gold`, `--gold-l`) é gente e carreira. A escada segue isso: Scouting azul, Scouting PRO azul com dourado (a leitura mais o time), Legacy dourado. Nenhuma cor nova.
- Por plano, um descritor de papel (Barlow Condensed, caixa alta) e uma promessa de uma linha. Os descritores são o que deixa claro quem é quem: Scouting, "Pra começar"; Scouting PRO, "O mais acessível com gente do seu lado"; Legacy, "O mais completo". Pode ajustar a redação, não o sentido nem a verdade (ver Posicionamento em `<os_tres_planos>`). Promessas, direção e não texto final: Scouting, "Seu jogo lido de 15 em 15 dias."; Scouting PRO, "Seu jogo lido e gente de verdade do seu lado, toda semana."; Legacy, "O caminho inteiro, direto com o David." Tom do deck: direto, sem adjetivo de anúncio, sem exclamação, sem "exclusivo", "premium", "VIP", "bônus", "brinde". Na tela o extra do Scouting não se chama overdelivery nem bônus: "Também vem" ou parecido.
- Fora: selo, pílula, ícone genérico, glassmorphism, tabela com cara de página de preços de SaaS.
- Registre em `notas-do-gestor.md` a seção "Como falar de cada plano": nome, descritor, promessa, o que entra, o que não entra, as alavancas do acessível e a frase pra trocar de plano.
</identidade_dos_planos>

<regras_duras>
1. Nada além do que está em `<os_tres_planos>`. Cada linha na tela e no roteiro sai dali. Sem número, prazo ou serviço novo.
2. Nunca prometer contrato, clube, prazo ou renda. "Encaminhado" nunca vira "contratado". "Acesso ao David, às conexões e aos clubes" não é promessa de clube: todo slide novo que fale de clube, conexão ou David leva a nota legal que o deck já usa ("Não há promessa de contratação ou de clube específico").
3. Um valor por vez na tela, sempre. O 23 não tem preço. Trocar de plano é pelo escopo, nunca por desconto.
4. Nenhum link de pagamento em lugar nenhum do deck: nem na tela, nem no apresentador, nem em `roteiro.js`, nas variações ou nas notas. A tela da família nunca mostra ficha, roteiro, objeção nem sinais de budget.
5. Linguagem: português do Brasil com acento, sem travessão. "Assessoria", nunca "mentoria", "programa", "pacote" ou "produto" na tela. O deck já usa "plano de carreira" pro documento do atleta: nos slides de plano, chame pelo nome ("o Scouting PRO") e evite o "o plano" solto. Sem "etapa", "jornada", "onboarding", "passo a passo" e, como o roteiro já manda, sem "acessos" como rótulo de fluxo: o dono escreveu "acesso a nutricionistas", mas a tela fala de gente fazendo coisa, com um verbo que não prometa mais que "acesso".
6. Visual: tokens e classes que já existem (`deck.css`, `r2.css`). Palco 1920x1080. Título com 96 px ou mais, lista com 32 px ou mais, nada abaixo de 24 px, nem nota legal nem contador. Até cerca de 30 palavras corridas por slide, fora colunas e listas curtas. Nenhuma animação além da `.rise`. Todo slide funciona parado (compartilhamento de tela trava animação).
7. Não quebre o motor: sincronização família e apresentador (canal `je-r2`, chave `je-r2-ficha`), revelação por avanço, Silêncio (tecla S), visão geral (G), vídeo e áudio, ficha antiga salva no navegador.
8. Não use imagem gerada por IA. Foto do David só se o dono pedir: ela existe em `jogador-de-elite-r1\assets\david\`, e o R2 hoje não carrega nenhuma.
9. Papéis verdadeiros: "acessível" e "completo" só nos sentidos de `<os_tres_planos>`. Sem "mais vendido", "mais escolhido" nem dado de popularidade.
</regras_duras>

<processo>
0. Backup antes de tocar em qualquer arquivo: copie a pasta inteira do R2 pra `C:\Users\Me\Downloads\bum\backup-r2-2026-10-05-antes-dos-planos`. Fora da pasta do projeto, senão vai junto no deploy. Confira contagem de arquivos e tamanho (a pasta tem dois vídeos de uns 75 a 78 MB).
1. Leia, nesta ordem: `assets/roteiro.js` (inteiro), `index.html` (slides 12 e 17 a 25), `assets/deck.js` (os trechos de `<estado_atual>`), `assets/r2.css` (`.cmp`, `.beneficios`, `.pillars`, `.costs`, `.legal`), `assets/variacoes/tecnica.js`, `variacoes/tecnica/index.html` (slides 23 a 25), `notas-do-gestor.md` (linhas 3 a 22, slides 23 e 24, tabela de links) e, no repo `mnkk`, PLAYBOOK_CLOSER.md (regras da casa, seção 07, seção 16) e CASOS.md (itens 0 e 3). Não abra `assets/fonts/fonts.css` (base64, 640 KB), os vídeos nem o áudio.
2. Poste um plano curto no chat (slide a slide: o que muda, o que fica) e siga em frente sem esperar resposta: o dono aprovou o escopo ao pedir este trabalho. Pare só nos casos de `<parar_e_perguntar>`.
3. Implemente nesta ordem: dados (`PLANOS`), motor (`deck.js`), slides (`index.html` e `r2.css`), roteiro e objeções, variação técnica, notas.
4. Verifique (`<verificacao>`) e só então escreva o relatório.
</processo>

<verificacao>
- `node --check` em `deck.js`, `roteiro.js` e `tecnica.js` (Node 24 está instalado).
- Screenshot em Chrome headless, 1920x1080, uma execução por vez: `chrome.exe --headless=new --hide-scrollbars --window-size=1920,1080 --virtual-time-budget=6000 --user-data-dir=<pasta única por execução> --screenshot=<caminho> "<url>#N"`. Tire 12, 23, 24 e 25 nos três planos e sem plano; 19 e 22 no Legacy e no PRO; e o 23 e o 24 da variação técnica. Pra trocar o plano, grave `je-r2-ficha` no localStorage com uma página temporária fora do projeto que grava e redireciona pro deck. Não deixe parâmetro de teste no deck. Olhe cada imagem: texto cortado, sobreposição com contador ou nota legal, quebra feia de linha, e se os descritores "O mais acessível com gente do seu lado" e "O mais completo" estão legíveis e claros.
- Procure "undefined", "null", "NaN", "{{" e colchete solto no texto da tela da família, em todos os estados.
- Procure nos dois decks, em `roteiro.js`, `tecnica.js` e nas notas: "3.997", "399,70", "PRECO_TELA", "PARCELA_TELA", "Assessoria de Elite - Legacy", "Scouter -", "kirvano", "pay.", "payBtns", "data-pay" e número de slide velho. Não pode sobrar nenhum link de pagamento.
- Teste com a ficha antiga (plano com nome antigo) e sem ficha.
- Confira que cada arquivo manteve o fim de linha de antes.
- O preview local abre em `file:///C:/Users/Me/Downloads/bum/jogador-de-elite-r2/index.html`.
</verificacao>

<entrega>
Relatório final no chat, curto (uns 40 linhas), português do Brasil, sem travessão:
1. O que mudou, por arquivo, uma linha cada.
2. Mapa de slides antigo e novo. O esperado é nenhum slide mudar de número; se algum mudou, diga qual e onde renumerou.
3. As premissas P1 a P13, uma linha cada: o que você usou e o que muda se o dono disser o contrário. Inclua a leitura que adotou pro Legacy (scouter diário mais David) e como ficou o "acessível" do PRO.
4. O que saiu do deck: os links de pagamento (tela, apresentador, `roteiro.js`, notas), com os arquivos e linhas.
5. Pendências que só o dono resolve: ter à mão, fora do deck, o link de cada plano (o Legacy já existe no Kirvano; Scouting R$ 997 e Scouting PRO R$ 1.497 ainda não existem); alinhar na dashboard o catálogo de produtos e tickets usado em Vendas, com nomes e valores novos; validar os três extras do Scouting; decidir regra de subir de plano, limite de vídeos, número de encontros do PRO e formato do nutricionista e do estrategista, que ficaram sem número de propósito.
6. Onde os playbooks ficam inconsistentes, só listar: PLAYBOOK_CLOSER.md nas linhas 11 a 16, 76 a 78, 152, 466 a 486, 567, 619 e 843 a 846 (inclui a tabela de links, que fica com os valores antigos), e os espelhos `playbook-closer.html`, `distribuir/playbook-closer.html` e `vercel/playbook-closer/index.html`. Diga também que `APRESENTACAO_R2.md`, `APRESENTACAO_R2_PROMPT.md` e `APRESENTACAO_R2_VARIACOES.md` seguem desatualizados.
7. Como abrir e testar local, e a frase: "Não publicado. Aguardo o seu ok pro deploy."
</entrega>

<parar_e_perguntar>
Não pare pelas premissas: aplique o default e registre. Pare e pergunte, uma rodada só, curta, se: (a) o backup falhar; (b) o código local divergir do descrito aqui de um jeito que muda a arquitetura (por exemplo, o slide do número não ter mais `id="silencio"`); (c) precisar de um dado que não existe em lugar nenhum (cargo do David, número de encontros) e não houver jeito seguro de deixar o campo vazio; (d) duas regras duras entrarem em conflito.
</parar_e_perguntar>
