# APRESENTACAO_R2_PROMPT.md

Versão: v1 (29/09/2026)
Prompt pronto pro Opus 5.5 gerar o deck da R2 (Gestor de Carreiras, a call
de fechamento): o site da família, o modo apresentador e o roteiro. A copy
de cada slide, o roteiro e as objeções estão aqui dentro. Estratégia, mapa
de persuasão, riscos e prompts de revisão: `APRESENTACAO_R2.md`.

Changelog:
- v1: criação, a partir do PLAYBOOK_CLOSER, do CASOS e do deck da R1
  publicado (https://jogador-de-elite-r1.vercel.app/).

Como usar:
1. Duplique o projeto do deck da R1 (`jogador-de-elite-r1`) como base do R2
   (`jogador-de-elite-r2`). O R1 continua no ar, intocado. Se o Opus não
   enxergar o projeto, anexe junto do prompt os três arquivos do motor:
   `assets/deck.js`, `assets/deck.css` e `assets/roteiro.js` do R1.
2. Confirme que a pasta `assets` tem as imagens e os vídeos do R1. A R2
   reaproveita só `kaio-01.jpg`, `joaozinho-02.jpg`, o vídeo do Zyron e o
   poster. Todo o resto é desenho novo em SVG.
3. Preencha o bloco `<dados>`. O que ficar entre colchetes, o Opus trata
   como vazio e não inventa.
4. Decida os pontos da seção 9 de `APRESENTACAO_R2.md` (Modo B, prazos,
   garantia) antes de colar: eles mudam texto deste prompt.
5. Selecione o Opus 5.5, copie tudo que está abaixo da linha marcada e
   envie. Se a caixa de texto cortar o prompt, anexe este arquivo e
   escreva: "Siga o prompt do arquivo anexo."
6. Publique no Vercel como site estático. O link é só do Gestor: o deck
   nunca vai pra família.

=============== COPIE DAQUI PRA BAIXO ===============

<tarefa>
Você vai criar o deck "Jogador de Elite · R2": a ferramenta que o Gestor de Carreiras usa na segunda call com a família de um atleta, a call de fechamento. É um site estático, no mesmo padrão do deck da R1 (https://jogador-de-elite-r1.vercel.app/), com dois modos: o da família (a tela compartilhada) e o do apresentador (a janela só do Gestor, com roteiro, ficha e objeções).

O deck tem um trabalho só: fazer a família sair da call tendo decidido, com clareza e sem pressão, entrar na assessoria, ou com o retorno da equipe combinado, com dia e hora. Não é uma proposta pra enviar: é o apoio de uma conversa de 45 a 60 minutos. Nenhum slide mostra preço ou valor.

Duas exigências, com o mesmo peso. Persuasivo: cada slide tem uma função de fechamento, e a copy já está escrita. Funcional: o Gestor chega sabendo tudo (a ficha da R1 entra no deck), conduz pelo roteiro, e o deck se ajusta ao que a família contou.

Capricha. É nesta conversa que a família decide o futuro do atleta. Queremos o deck mais persuasivo e mais bonito que você consegue fazer, sem nenhuma informação falsa: com esse público, uma única promessa que não se sustenta derruba a confiança no resto.
</tarefa>

<contexto>
Quem somos: Jogador de Elite, assessoria de carreira para atletas de base. Cada atleta tem um gerente de carreira acompanhando o desenvolvimento dele todo dia e o Zyron, nosso mecanismo próprio de inteligência artificial (sempre "o Zyron", no masculino), com um scouter só dele. A turma é fechada, com 10 atletas. Escolinha treina, peneira decide no olhômetro e empresário liga quando dá: aqui o atleta é analisado com dados reais e acompanhado todo dia.

Nossa postura: a gente não vende, a gente seleciona, e a família também escolhe com quem trabalhar. Quem precisa da vaga é o atleta. O deck nunca pede, nunca implora e nunca empurra: fala de turma, vaga e plano, não de produto ou pacote, e não tem cara de anúncio (nada de selo de oferta, contagem regressiva, exclamação ou botão de comprar). Vendemos assessoria, em planos de valores diferentes, e o deck nunca fala de valor: o Gestor diz o valor em voz alta, na hora certa, e a tela fica em silêncio.

Quem assiste: o atleta (13 a 17 anos), o pai, a mãe ou o responsável, todos juntos, numa chamada de vídeo, muitas vezes pelo celular. Já fizeram a R1 com o Estrategista Esportivo, viram o deck da R1 e combinaram decidir nesta conversa, os dois juntos. Chegam ansiosos e ainda um pouco desconfiados, e desconfiança se vence com prova concreta, não com adjetivo.

Quem apresenta: o Gestor de Carreiras (o Closer). Ele leu a ficha da R1, viu o vídeo do atleta e chega sabendo nomes, dor, números das peneiras, sonho e o que a família já gastou. Nunca pergunta de novo o que já está na ficha.

O que a R1 deixou aberto: no slide 24 da R1, o "plano individual" apareceu tarjado, com quatro seções (O que muda pra você, Quem cuida de você todo dia, O caminho até os clubes, Como a sua vaga é definida) e a promessa de que o Gestor só abre esse plano com a família toda junta. A R1 mostrou "Kaio foi visto. Joãozinho foi visto. O próximo pode ser você." e fechou com o combinado de 45 minutos: se fizer sentido, decidem ali mesmo. A R2 é o momento de abrir o plano.

A tese da R2, numa frase: ser visto é o começo, e o plano é o que leva até o clube. O atleta foi visto; agora vem o plano dele, montado em cima do que a família contou, com quem cuida dele todo dia e com o caminho até quem procura o perfil dele.

Precisão que a família vai cobrar depois: o Zyron analisa o vídeo que a família envia; o acompanhamento contínuo é do scouter do Zyron; o encaminhamento depende do atleta e das oportunidades, e nunca se promete contrato, clube, prazo ou renda.

Regras comerciais: nenhum slide, e nenhuma linha do roteiro, traz preço, valor, parcela, desconto ou faixa de ganho de atleta. O deck nunca é enviado à família: só se compartilha a tela.
</contexto>

<dados>
Preenchidos pelo dono do projeto. Campo que ainda estiver entre colchetes conta como vazio: remova o elemento que depende dele e nunca invente um valor no lugar.

GERENTE_NOME: [nome do gerente de carreira]
ANALISTA_NOME: [nome do analista de performance, se o dono quiser mostrar]
PRAZO_PRIMEIRO_CONTATO: [quando o gerente de carreira entra em contato depois do sim. Ex.: ainda hoje. Só o que a operação cumpre]
PRAZO_ZYRON: [quando o Zyron começa a acompanhar depois do sim. Ex.: no dia seguinte. Só o que a operação cumpre]
LINK_AGN: [link do perfil da AGN Football]
SITE: [endereço do site]
INSTAGRAM: [perfil do Instagram]
CNPJ: [número do CNPJ]
ENCAMINHAMENTO_PERCENTUAL: [só com documento que comprove. Vazio: nenhum percentual aparece na tela nem no roteiro]
DURACAO_CONVERSA: 45 minutos

CASOS (só o que estiver preenchido aparece na tela):
- Joãozinho | clube: Grêmio | posição: [posição] | idade na entrada: [idade] | tempo até o resultado: [tempo] | dúvida que a família teve: [dúvida]
- Kaio | clube: Internacional | posição: [posição] | idade na entrada: [idade] | tempo até o resultado: [tempo] | dúvida que a família teve: [dúvida]
</dados>

<ficha>
Campos que o Gestor preenche por call, na aba Ficha do apresentador. O deck guarda tudo em localStorage (chave `je-r2-ficha`) e atualiza a tela da família em tempo real. "Slides" diz onde o campo aparece. Os valores de `<dados>` (gerente, analista, prazoContato, prazoZyron, linkAgn, site, instagram, cnpj) entram como valor padrão da ficha e podem ser trocados na call.

Personalizam a tela da família:
- nome (só o primeiro nome do atleta): 01, 03, 05 a 07, 11 a 16, 18 a 26.
- foto (imagem do atleta, opcional, P2): 02, 12 e 26.
- posicao, idade, cidade: 10 e 26. `idadeMais1` é derivado de idade.
- clube (clube dos sonhos): 09.
- responsavel (primeiro nome de quem fala pela família): 04.
- peneirasN e observadoN (números): 04.
- dor (palavras da família), falta (o que o atleta acha que falta), sonho: 04 e 23.
- tipoDor (Financeira, Emocional ou Tempo e idade): escolhe o cenário, 08 a 10.
- pontoForte, trabalhar, perfilJogo: 02.
- dores (seis marcas, uma por linha do slide 13): 13.
- nota (0 a 10): 05 e 23.
- sim1, sim2, sim3 (marcas): 11 e 23.
- lucro (marca, "respondeu que não faz sentido a gente lucrar em cima"): 23.
- caso (Joãozinho, Kaio, AGN ou Outro), casoPosicao, casoIdade, casoTempo, casoClube, casoDuvida: 17. Se os campos do caso vierem de CASOS em `<dados>`, preencha sozinho ao escolher o caso.
- gerente, analista, prazoContato, prazoZyron: 14, 24, 26 e 29.
- linkAgn, site, instagram, cnpj: 18.
- vagas (1 a 10, número real da semana) e proximaTurma (texto): 24.
- modo (A ou B) e horaRetorno (texto, ex.: 19h): 24 e 25.
- pularDura (marca): pula o slide 06.

Só do apresentador (nunca aparecem na tela da família):
- Vindos da R1: origem, dadosZyron, pe, pai, mae, outro, decisores, telefones, treina, times, peneiras (texto), observado (texto), investido, locomocao, apresentou, precomp, empolgacao, missao, agn, objecoes, budget, confirmados, r2dia, r2hora.
- Resultado da R2: resultado (Venda, Retorno marcado ou Ainda não), planoFechado (texto livre, sem valor), objecoesR2, proximoContato, indicacao, observacoes.

Importar a ficha da R1: um campo "Cole aqui a ficha do CRM (R1)" e o botão "Ler ficha". O texto colado é o que a R1 gera no botão "Copiar ficha pro CRM": uma linha por campo, no formato "Rótulo: valor". Mapa de rótulos:
- "Origem" para origem; "Dados do Zyron" para dadosZyron.
- "Atleta: nome, idade, posição, pé X" para nome, idade, posicao e pe (separe por vírgula).
- "Mora em" para cidade.
- "Pai: X | Mãe: Y | Outro responsável: Z" para pai, mae e outro.
- "Decisores e como decidem" para decisores; "Telefones dos decisores" para telefones.
- "Treina hoje" para treina; "Times e experiências" para times.
- "Peneiras e avaliações" para peneiras; "Se sentiu observado de verdade em" para observado.
- "Sonho do atleta" para sonho; "O que ele acha que falta" para falta.
- "Dor da família (palavras deles)" para dor; "Tipo de dor" para tipoDor.
- "Já investiram" para investido; "Locomoção pra outro estado" para locomocao.
- Perguntas de sim ou não (lucro, apresentou, precomp, missao, agn, confirmados): "sim" marca, "não" desmarca. São elas: `Respondeu "não faz sentido lucrar em cima"?`, "Apresentou gerente de carreira e Zyron?", "Pré-compromisso de decidir na R2?", "Missão dada ao atleta?", "Link da AGN enviado?" e o trecho "Todos os decisores confirmados?" da linha "R2: dia hora | ...".
- "Empolgação do atleta (0 a 10)" para empolgacao; "Caso citado" para caso.
- "Objeções que apareceram" para objecoes; "Sinais de budget" para budget.
- "R2: dia hora | ..." para r2dia e r2hora.
Linha que não bater é ignorada. Depois de ler, mostre o que foi lido, campo a campo, pra conferência. Extraia o primeiro número inteiro de `peneiras` e de `observado` pra sugerir peneirasN e observadoN (editáveis).

Derivados que o deck calcula: nome (primeiro nome), idadeMais1, notaFrase ("E por que 10?"), vagasFrase ("Nesta turma, restam 3 vagas." ou "resta 1 vaga."), `dores` visíveis (até três), plural de "vez" e "vezes".
</ficha>

<arco>
O deck conta uma história em oito atos, e a luz acompanha a emoção de cada um. Ela começa fria e sóbria na retomada da dor, esquenta com o dossiê e as cenas, e chega mais alta na decisão:

1. Abertura (01 a 03): conexão pelo nome, o que o Gestor viu no jogo, o combinado.
2. A dor, retomada (04 a 06): com as palavras e os números da própria família. Poucos elementos, muito respiro.
3. A necessidade e o desejo (07 a 10): o plano está pronto e a família diz que quer ver; o cenário certo pro tipo de dor.
4. O compromisso (11): a parte da família, dita em voz alta.
5. O plano aberto (12 a 16): as quatro seções que a R1 deixou tarjadas: o que muda, quem cuida, o caminho até os clubes e a soma "Ele + nós".
6. A prova (17 e 18): o caso mais parecido e o que a família confere sozinha.
7. O valor, sem número (19 a 22): montar sozinho, o "não prometemos contrato", o ganha-ganha e o silêncio.
8. A decisão (23 a 26): o resumo dos sins, a vaga (Modo A) ou o retorno da equipe (Modo B) e a boas-vindas.
Apoio do Gestor (27 a 30): divisor interno e três slides de socorro por objeção.

Ecos de propósito com a R1, mantenha todos: o dossiê tarjado do R1 (24) volta trancado no 07 e aberto do 12 ao 16; "Foi visto. Agora, o plano." (01) responde ao "Kaio foi visto. Joãozinho foi visto." do R1; "A gente escolhe atleta. Vocês escolhem com quem trabalhar." (03) completa o "A gente não vende vaga. A gente escolhe atleta." do R1; a régua (05) e o silêncio (22) são a régua e o número do Gestor.
</arco>

<sem_repeticao_com_o_r1>
O deck da R1 já está no ar, e a família viu. A R2 tem a mesma marca, mas uma linguagem visual e uma copy próprias. Estes recursos já foram usados na R1 e NÃO voltam (o número entre parênteses é o slide da R1):
- Marcas de contagem em giz (03). O "54 segundos" e o campo com 22 pontos e um cone de visão (04).
- A chuteira em close na grama, com texto à esquerda (05). O campo de várzea com poste de luz e bola parada (06): a R2 não usa poste nem cone de luz de cima como luz principal.
- Três colunas com rótulos DINHEIRO, CONFIANÇA e TEMPO e a faixa escura com a pergunta embaixo (07).
- O túnel com luz azul (08). A tela do Zyron com grade azul, cantoneiras de mira e linha de varredura como cenário (09, 10): na R2 essa linguagem só aparece onde o Zyron é citado, e como detalhe pequeno, exceto no slide 30.
- Os cinco verbos ligados por um feixe (11). A tabela OLHÔMETRO x ZYRON (12). O campo visto de cima com lacunas (13). A rede radial de clubes com o número grande (14).
- As tiras verticais de foto com as colunas PRA VOCÊ e PRA SUA FAMÍLIA (15). A colagem editorial de Kaio e Joãozinho (16). A colagem do David (17). O celular com o feed da AGN (18).
- As três perguntas empilhadas com filetes (20). O carimbo "Perfil aprovado" com a ficha do atleta (21): a R2 não usa nenhum carimbo.
- Os três painéis "Kaio, Joãozinho, Você" (22). As dez colunas verticais de vagas (23): a R2 usa armários de vestiário. O feixe dourado diagonal de refletor (21, 25). A linha do tempo Hoje, Próximo, Depois (25).
Não use estas frases da R1 na tela: "A gente não vende vaga", "Talento que ninguém vê não vira contrato", "Não foi você que falhou", "Foi o olhômetro", "54 segundos", "Todo bairro tem um craque", "O próximo pode ser você", "Perfil aprovado". Também não repita na tela os números que a R1 publicou (clubes parceiros, anos de mercado, atletas revelados): a R2 prova por conferência, não por número.
Podem voltar, de propósito: o motor do R1 (palco, HUD, visão geral, modo apresentador, ficha), os tokens de cor e tipografia, as classes de texto e o dossiê com tarjas (é o plano da R1, agora aberto).
</sem_repeticao_com_o_r1>

<identidade_visual>
Mesma marca da R1. A família precisa reconhecer.

Formato: palco de 1920×1080 (16:9), escalado pra caber em qualquer tela, como no motor do R1.

Cores (tokens do deck.css do R1, não invente cor nova):
- Fundo #07080A. Painéis #0A0D12 e #14181F.
- Dourado da marca #C9A24A. Dourado claro #E8CE8E, pra destacar texto.
- Texto: #FFFFFF em títulos, #C9CFD7 no corpo, #8B939D em legendas e notas.
- Azul do Zyron #7FAEFF: só onde o Zyron for citado (slides 14, 16, 30 e o texto "Zyron" onde aparecer). Dourado é gente e carreira; azul é dados e leitura do jogo.

Tipografia (as fontes já estão no projeto): Saira Condensed 700/800 pra títulos e números, Barlow Condensed 500/600 pra rótulos curtos em caixa alta, Archivo 400/500/600 pro corpo. Reaproveite as classes do R1: `.t` e `.t-96` a `.t-150`, `.sub`, `.b` e `.b-40` a `.b-56`, `.label`, `.legal`, `.counter`.

Legibilidade (regra dura, porque a família vê numa tela pequena):
- Título com 96 px ou mais. Número de impacto com 220 px ou mais.
- Corpo com 40 px ou mais. Nenhum texto abaixo de 24 px, nem nota legal, nem contador.
- Até cerca de 30 palavras de texto corrido por slide. Slides em colunas, diagrama ou lista podem passar disso, desde que cada bloco seja curto.
- Texto sobre fundo com imagem sempre com degradê escuro por trás.

Direção de arte da R2: objetos sob uma só luz. A R1 foi fotografada; a R2 é desenhada. Cada slide de cena tem UM objeto em SVG (o dossiê, o telefone, a camisa no vestiário, o portão, a ponte, os armários, o relógio de parede, a viga em equilíbrio), com uma única fonte de luz quente, grão sutil e muito preto ao redor. Composição simples, formas grandes, gradientes suaves, desfoque leve nas luzes, sem contorno grosso, sem clip-art, sem rosto e sem pessoas. Se a cena ficar fraca, simplifique: só o objeto e a luz, sobre fundo liso (como a cena do craque do bairro na R1). Fotos reais só nas provas (17) e no vídeo (30).

Movimento: no máximo uma animação de entrada por slide, curta (classe `.rise` do R1). Todo slide funciona parado, porque compartilhamento de tela em chamada trava animação. Exceção justificada: o dossiê destrancando no slide 12, com no máximo 1,2 segundo, que também funciona parado, já aberto.
</identidade_visual>

<padroes_a_evitar>
Estes padrões aparecem por padrão em deck gerado por IA e deixam tudo com cara de template. Não use nenhum:
- Rótulos numerados "01", "02", "03" em cards, etapas, seções ou listas. (O contador de página no canto é a única numeração permitida.)
- Grade de cards iguais com ícone, título e uma linha.
- Linguagem de processo: "etapa", "jornada", "onboarding", "setup", "acessos", "passo a passo".
- Pílulas: botões, selos ou tags com borda totalmente arredondada.
- Glassmorphism, cartão translúcido com desfoque, brilho neon.
- Texto com degradê e palavra em itálico de destaque dentro de título.
- Fundo creme ou off-white.
- Ícones genéricos: lâmpada, foguete, alvo, troféu, raio, check verde, X vermelho.
- Clichês de IA: cérebro de circuito, mão de robô, holograma, rosto digital, partículas flutuando, degradê roxo e rosa.
- Clichês de fechamento e de dinheiro: aperto de mão, cifrão, moeda, cofre, cartão de crédito, confete, fogos, seta verde pra cima, contagem regressiva, selo de oferta.
- Gráfico, barra de progresso ou porcentagem com número inventado.
- Travessão (— ou –) em qualquer texto. Use ponto, vírgula ou dois-pontos.
- Rótulo em caixa alta em cima de todo título. Use só onde ele situa a família.
</padroes_a_evitar>

<regras_de_conteudo>
- O texto de cada slide está em <slides> e vai pra tela exatamente assim. Você decide quebra de linha, hierarquia e destaque; não reescreve, não resume e não acrescenta frase. Cada palavra foi escolhida por um motivo de fechamento.
- Nenhum valor: nada de R$, preço, parcela, desconto, faixa de renda, percentual de aprovação ou nome de plano em slide, roteiro, ficha, comentário ou arquivo do site. O Gestor diz o valor em voz alta.
- Não invente número, clube, atleta, depoimento, prêmio ou parceria. Todo número na tela é prova que a família pode cobrar depois. Os únicos números do deck são os que o Gestor preenche (idade, peneiras, nota, vagas) e "10 atletas por turma".
- Toda variável tem fallback, declarado no slide. Nunca apareça na tela `{{ }}`, colchete, "undefined", "null" ou campo em branco. Se a frase depende do dado e não há fallback, o bloco some. Em rótulos como "PLANO INDIVIDUAL · {{nome}}", sem nome o trecho " · {{nome}}" inteiro some. Slide com `data-need` sem o campo preenchido é pulado.
- Precisão sobre o Zyron: ele analisa o vídeo que a família envia ("cada lance do vídeo"). Nunca escreva que ele assiste "jogos inteiros". O acompanhamento contínuo é do "scouter do Zyron": use sempre "scouter", nunca "scout" nem "agente". Não prometa contrato, clube, prazo, salário ou porcentagem.
- Notas legais: legíveis (24 px ou mais), discretas, no rodapé. Elas protegem a empresa e passam seriedade pra família desconfiada.
- Português do Brasil, com acento. A marca é "Jogador de Elite". O serviço é "assessoria", nunca "mentoria", "programa" ou "pacote". O cargo é "Gestor de Carreiras"; quem acompanha todo dia é o "gerente de carreira".
- O modo da família nunca mostra nada do apresentador: nem ficha, nem roteiro, nem "sinais de budget", nem objeções.
- A ficha guarda dados de menores só neste navegador. Mantenha o botão "Nova call (limpar ficha)" e o aviso: "Copie pro CRM antes de limpar."
</regras_de_conteudo>

<padrao_tecnico>
O deck é um site estático, sem build, publicado no Vercel, no padrão do deck da R1:
- Arquivos: `index.html` (ou `deck.html`), `assets/deck.css`, `assets/deck.js`, `assets/roteiro.js`, `assets/fonts/fonts.css` (com as fontes) e as mídias em `assets/`.
- Reaproveite do R1 o motor, sem reescrever do zero: `deck.css` com os tokens em `:root`; o palco fixo de 1920×1080 escalado por CSS (`--s`); cada slide como `<section class="slide">`; elementos com `class="a"` em posição absoluta; o contador "NN / N" em cada slide; o HUD que aparece ao mover o mouse; a barra de progresso; a visão geral (tecla G) com miniaturas; a navegação por setas, PageUp, PageDown, espaço, toque e hash (`#n`); a tela cheia (F); o modo apresentador em outra janela (`?presenter`, tecla P), sincronizado por BroadcastChannel e postMessage; o cronômetro; a ficha em localStorage; `data-bind`, `data-if` e `data-ifnot`; o player de vídeo com capítulos clicáveis; o CSS de impressão.
- Troque o que é específico da R1: a chave de armazenamento (`je-r2-ficha`), o canal (`je-r2`), o nome da janela do apresentador, os títulos das janelas ("Jogador de Elite · R2"), todos os desenhos SVG da R1, os campos da ficha, o roteiro, as objeções e os textos do HUD.
- Se o projeto da R1 não estiver disponível, use os arquivos do R1 anexados. Se nem isso houver, construa o motor com as características acima.
- `<meta name="robots" content="noindex">` em todas as páginas. Nenhum serviço externo, nenhuma biblioteca, nenhuma fonte nova.
- Contador "NN / N" em cada slide, com 24 px ou mais. Ele mostra a posição entre os slides ativos e se atualiza quando a ficha muda.
- Também gere `notas-do-gestor.md`, com o mesmo conteúdo do roteiro na ordem dos slides, pra ler fora do app.

Esquema do roteiro (`assets/roteiro.js`), igual ao do R1: `window.ROTEIRO = [{ nome, min, fala: [], perguntas: [], crm: [], atencao }]`, um item por slide, na ordem, e `window.OBJECOES = [{ q, slides: [], resposta: [] }]`. No modo apresentador, `[atleta]` e `[responsável]` são trocados pelos nomes da ficha. Em "crm", escreva o que o Gestor anota na ficha da R2.
</padrao_tecnico>

<funcional>
Prioridade P1 (obrigatório):
1. Aba Ficha no apresentador, com todos os campos de `<ficha>`, agrupados por assunto, e atualização da tela da família em tempo real.
2. Importar a ficha da R1: campo, botão "Ler ficha" e conferência do que foi lido, como descrito em `<ficha>`.
3. Regras de exibição por atributo: `data-need="campo"` (o slide só existe se o campo estiver preenchido), `data-only="tipoDor=Financeira"` (cenários; se tipoDor estiver vazio, mostre os três) e `data-mode="A"` ou `data-mode="B"` (fechamento; se modo estiver vazio, mostre os dois). Setas, HUD, contador e visão geral pulam os slides que não valem; na visão geral eles aparecem apagados, com o motivo ("sem ponto forte", "outro cenário", "outro modo"). `data-apendice` (slides 27 a 30): fica fora da navegação linear e do total do contador, e só abre pela aba Objeções, pela visão geral ou pelo apresentador; nesses slides o contador mostra "Apoio 1 / 4", e a seta pra trás volta ao slide de onde o Gestor saiu.
4. Fallback de toda variável, como em `<regras_de_conteudo>`.
5. Aba Roteiro do Gestor (é o painel padrão): por slide, "Fale", "Pergunte e espere a resposta", "Anote na ficha", "Atenção" e o tempo. Miniatura do slide atual e do próximo, como no R1.
6. Aba Ler antes: a tabela "O que ler na ficha → onde usar na R2" com o valor atual de cada campo (o que falta aparece em destaque) e o checklist dos 10 minutos antes da call: li a ficha inteira; vi o vídeo do atleta; escolhi o caso mais parecido; conferi vagas e data da próxima turma; confirmei pai, mãe e atleta na call; deck aberto em tela cheia e apresentador em outra janela. Com o botão "Copiar mensagem de confirmação": "[pai], aqui é o [seu nome], gestor de carreiras. Tô com a ficha do [atleta] aberta pra nossa conversa das [hora]. Você, a [mãe] e ele confirmados?"
7. Aba Objeções (bloco `<objecoes>`), com o método em cima e botões que pulam pro slide de socorro. Um botão "Voltar" leva ao slide de onde saiu.
8. Aba Fechamento: alternador Modo A e Modo B (grava em `modo`), o roteiro de cada um, e botões que levam ao slide certo. Botão Silêncio (tecla S no apresentador): mostra na janela do Gestor um contador crescente ("Silêncio: 0:07") e leva a tela da família ao slide 22. Segundo toque encerra e volta. Também nesta aba: o "Depois do sim" e o "Depois do ainda não" de `<followup>`.
9. Cronômetro com alvo em DURACAO_CONVERSA (45 minutos) e alerta em 60.
10. Bloco "Resultado da R2" na ficha e os botões "Copiar resultado pro CRM" e "Copiar resumo do mesmo dia", com o texto de `<followup>`.

Prioridade P2 (entregue depois do P1, se couber):
11. Marcar a nota de 0 a 10 no slide 05 a partir do apresentador (botões de 0 a 10): o número acende na tela da família e o valor vai pra `nota`. E marcar cada frase do slide 11 (sim1, sim2, sim3): a frase acende.
12. Foto do atleta: upload no apresentador, reduzida a até 900 px no maior lado (canvas, JPEG), guardada em localStorage e enviada ao deck pelo canal. Tratamento duotone dourado nos slides 02, 12 e 26. Sem foto, esses slides funcionam com a cena.
13. Lembretes fixos no rodapé do apresentador: "Proibido: perguntar de novo o que está na ficha; falar do plano antes do 'quero'; desconto; proposta por WhatsApp; correr atrás da família; pôr o perfil do atleta em dúvida; linguagem de processo."
</funcional>

<assets>
No projeto (herdados do R1): `kaio-01.jpg` (Kaio assinando contrato com o Internacional), `joaozinho-02.jpg` (Joãozinho assinando com o Grêmio ao lado de David Willer), `video/zyron-demo.mp4`, `video/poster-zyron.jpg` e `zyron-leitura.jpg` (trecho da demonstração do Zyron). Use só esses. As outras imagens do R1 (estádio, túnel, chuteira, David, AGN) não entram.

Todo o resto é desenho em SVG, descrito em cada slide. Nenhuma imagem gerada por IA.
</assets>

<slides>

SLIDE 01 · CAPA
Objetivo: reabrir a conversa de onde a R1 parou e nomear o que vem: o plano. Pessoal em três segundos.
Na tela:
- Rótulo: CONVERSA COM O GESTOR DE CARREIRAS
- Título: {{nome}} (o primeiro nome do atleta, gigante). Sem nome: Agora, o plano.
- Frase em dourado claro, só com nome: Foi visto. Agora, o plano.
- Rodapé: Jogador de Elite · Assessoria de carreira
Visual: um dossiê fechado sobre uma mesa escura, em perspectiva suave, com a etiqueta "Plano individual" e o nome do atleta na capa (se houver). A luz quente sai das bordas do próprio dossiê. Título à esquerda, o dossiê à direita, grande. Sem foto.
Tempo: 1 min.
Fale: conexão pelo nome (PLAYBOOK_CLOSER 4.1): "[pai], [mãe], [atleta], prazer. [atleta], parabéns: você foi escolhido. Eu li tudo o que você conversou com o estrategista esportivo, e fiz questão de ver teu material."
Anote: quem está na call (pai, mãe, atleta) e se algum decisor falta.
Atenção: chame cada um pelo nome desde o primeiro minuto. Decisor fora da call: pare aqui e reagende (9.2). Bastidor ao vivo (01 do Closer) só se for verdade: vire pro lado e resolva em voz alta o contrato de outro atleta.

SLIDE 02 · O QUE EU VI (data-need="pontoForte")
Objetivo: dar antes de pedir. Mostrar que o atleta foi visto de verdade, com algo específico do jogo dele.
Na tela:
- Rótulo: O QUE EU VI
- Título: Eu vi o seu jogo.
- Linha: PONTO FORTE · {{pontoForte}}
- Linha, só se preenchida: ONDE A GENTE TRABALHA PRIMEIRO · {{trabalhar}}
- Linha, só se preenchida: PERFIL DE JOGO · {{perfilJogo}}
- Legenda: Primeira leitura. O relatório completo vem com o acompanhamento.
Visual: à esquerda o texto; à direita a foto do atleta em duotone dourado, com cantoneiras azuis do Zyron como única moldura (se houver foto), ou só as cantoneiras vazias, se não houver. Sem cards.
Tempo: 1,5 min.
Fale: "[atleta], eu vi o teu material e fiz questão de te falar: [ponto forte]."
Pergunte: "Isso é o que você sente que é o teu jogo?"
Atenção: só use se o Analista de Performance ou o Zyron te passou algo real. O slide some sozinho se o ponto forte estiver vazio.

SLIDE 03 · O QUE A GENTE COMBINOU
Objetivo: reforçar o pré-compromisso da R1 e tirar a defensiva: os dois lados escolhem.
Na tela:
- Título: O que a gente combinou.
- Linha 1: Vocês dois e {{nome|o atleta}}, aqui, juntos.
- Linha 2: Eu mostro o plano com clareza. Vocês me dizem sim ou não, com sinceridade.
- Linha 3, em dourado: Pode ser não. Tudo bem.
- Rodapé, em cinza: A gente escolhe atleta. Vocês escolhem com quem trabalhar.
Visual: sem foto. Coluna estreita de texto à esquerda, com muito respiro; à direita, apenas a luz do dossiê fechado, pequeno, como no 01. Sem filetes empilhados e sem marcas de contagem.
Tempo: 1,5 min.
Fale (4.2): "Vocês combinaram com o estrategista esportivo que, se o plano fizer sentido, decidem hoje, os dois juntos. Continua valendo? Pode ser não, tudo bem. Só não vale 'vou pensar'."
Pergunte: "Continua valendo?"
Anote: pré-compromisso reafirmado (sim ou não).
Atenção: espere o "continua valendo" em voz alta. Só a linha "Pode ser não. Tudo bem." está na tela: o "só não vale vou pensar" é falado, com leveza.

SLIDE 04 · EU LI TUDO
Objetivo: retomar a dor com as palavras e os números da família. Quem confirma a própria dor em voz alta se convence sozinho.
Na tela:
- Rótulo: O QUE VOCÊS ME CONTARAM
- Título: Eu li tudo o que vocês me contaram.
- Números, só se peneirasN e observadoN existirem: {{peneirasN}} peneiras. {{observadoN}} {{vez|vezes}} visto de verdade.
- Citação, só se dor existir: “{{dor}}” e a autoria, {{responsavel|A família}}, na R1.
- Citação, só se falta existir: “{{falta}}” e a autoria, {{nome|O atleta}}, na R1.
- Pergunta em dourado: Continua assim?
Visual: um único glifo de aspas grande em dourado; as citações em branco, corpo grande; os dois números em Saira, 220 px ou mais, lado a lado, com a legenda em Barlow. Sem cards, sem marcas de giz. A pergunta em faixa própria, embaixo.
Tempo: 3 min.
Fale (4.3): "[mãe], você falou pro estrategista que [dor literal]. Continua assim?" / "E [atleta], você disse que o que falta é [resposta]. Ainda sente isso?" / "[atleta], você contou que fez [nº] peneiras e só se sentiu observado de verdade em [nº]. É isso?"
Pergunte: "E sendo sincero: no olhômetro, com aquele monte de garoto e vinte minutos de coletivo, você acha que o avaliador conseguiu analisar o teu jogo com precisão?" (espere o "não") / "[pai], [mãe], e quanto custou cada uma dessas peneiras pra vocês? Viagem, inscrição, dia de trabalho perdido?"
Anote: correções à dor, se mudou desde a R1.
Atenção: proibido perguntar de novo o que já está na ficha: confirme e aprofunde. A pergunta do custo é falada; a tela não mostra valor.

SLIDE 05 · DE 0 A 10
Objetivo: fazer a família medir o próprio desejo e justificar. Quem justifica o número se convence sozinho.
Na tela:
- Título: De 0 a 10, quanto vocês querem ver {{nome|ele}} num clube profissional?
- Régua de 0 a 10, com as onze marcas. O número escolhido cresce e acende em dourado.
- Fecho, só depois de marcado: E por que {{nota}}?
Visual: uma régua comprida atravessando o slide, como uma régua de medir (é a "régua" do fechamento). Onze marcas, números em Saira. Sem barra de progresso e sem porcentagem.
Tempo: 2 min.
Fale (4.4): "De 0 a 10, quanto vocês querem ver o [atleta] num clube profissional?" [Pai: "Dez."] "E por que dez?"
Pergunte: se a nota for menor que 10: "Por que não é menos?"
Anote: a nota da família (0 a 10).
Atenção: quem justifica o próprio número se convence sozinho. Não interrompa.

SLIDE 06 · E SE O FUTEBOL NÃO DER CERTO? (pula com pularDura)
Objetivo: a dor real, sem rodeio, e logo depois a saída. É o único slide de dor funda da R2.
Na tela:
- Título: E se o futebol não der certo?
- Linha: O que {{nome|ele}} vai fazer da vida?
- Linha em cinza: Vocês já pensaram no custo de não tentar?
Visual: quase vazio. Uma linha de horizonte finíssima, o texto à esquerda, e o silêncio como elemento de design.
Tempo: 1,5 min.
Fale (4.4): "Sinceramente, [pai]: se o futebol não der certo, o que o [atleta] vai fazer da vida? Vocês já pensaram no custo de não tentar?"
Atenção: aqui o silêncio pesa. Não fale por cima e não mude de assunto: quem descreve o medo em voz alta sente o alívio de ver uma saída logo depois, e a saída é o próximo slide. Se a conversa não permitir, marque "Pular pergunta dura" na ficha e o slide some.

SLIDE 07 · O PLANO ESTÁ PRONTO
Objetivo: a necessidade explícita. O plano só se mostra depois do "quero" da família.
Na tela:
- Rótulo: PLANO INDIVIDUAL · {{nome}}
- Título: O plano do {{nome|atleta}} está pronto.
- Corpo: Ele foi montado em cima de tudo o que vocês me contaram. Falta uma coisa.
- Pergunta em dourado: Vocês querem que eu abra?
Visual: o dossiê da R1 (slide 24), ainda trancado e tarjado, agora grande à direita, com o cadeado e as quatro seções nomeadas: O que muda pra você, Quem cuida de você todo dia, O caminho até os clubes, Como a sua vaga é definida. Tarjas em dourado listrado, como na R1. É o eco de propósito.
Tempo: 1 min.
Fale (4.5): "Vocês querem que eu mostre como seria o plano do [atleta]?"
Pergunte: "Vocês querem que eu abra?" Espere o "quero".
Atenção: PROIBIDO falar do plano antes do "quero". Resposta morna: volte pro impacto (slide 05). Sem o "quero", não avance.

SLIDE 08 · O TELEFONE (data-only="tipoDor=Financeira")
Objetivo: o cenário da mudança de vida. A família imagina o depois.
Na tela:
- Título: Imagina {{nome|ele}} te ligando do clube.
- Corpo: Ele vai contar que assinou. Qual é a primeira coisa que vocês fazem?
- Linha em dourado: O que muda na vida de vocês quando ele estiver num clube profissional?
Visual: cena em SVG: uma mesa de cozinha à noite e um celular aceso, com a chamada de "{{nome|Filho}}" (só o nome na tela do celular). A luz vem do celular. Sem rosto.
Tempo: 3 min.
Fale (05 do Closer): "[pai], o que muda na vida de vocês quando o [atleta] estiver num clube profissional?" / "Imagina ele te ligando do clube pra contar que assinou. Qual a primeira coisa que vocês fazem?"
Atenção: depois de cada cenário, silêncio: quem descreve o futuro em voz alta já se vê nele. Não cite salário nem faixa de ganho: o deck não cita, o roteiro não cita, e nenhuma renda é prometida.

SLIDE 09 · A CAMISA (data-only="tipoDor=Emocional")
Objetivo: o cenário do sonho.
Na tela:
- Título: Imagina você entrando em campo com a camisa {{clube|do clube dos seus sonhos}}.
- Corpo: Quem você quer ver na arquibancada?
- Linha em dourado: Depois de tanto “não” nas peneiras, como vai ser ver ele assim?
Visual: cena em SVG: um vestiário, uma camisa pendurada num cabide sob uma única luz, com o nome do atleta nas costas em tipografia (sem número, sem escudo, sem patrocinador) e um banco de madeira. Sem pessoas.
Tempo: 3 min.
Fale (05): "[atleta], imagina você entrando em campo com a camisa do [clube dos sonhos]. Quem você quer ver na arquibancada?" / "[mãe], depois de tanto 'não' nas peneiras, como vai ser ver ele assim?"
Atenção: silêncio depois de cada pergunta. A tela usa o clube do campo `clube`; sem ele, "do clube dos seus sonhos".

SLIDE 10 · A JANELA (data-only="tipoDor=Tempo e idade")
Objetivo: o cenário da janela da base. A perda de esperar.
Na tela:
- Título: Com {{idade}} anos, a janela da base está aberta agora. Sem idade: Hoje, a janela da base está aberta.
- Corpo: Um ano parado, com {{idadeMais1}}, a conversa é outra. Sem idade: Um ano parado, e a conversa é outra.
- Pergunta em dourado: Quanto tempo ele ainda tem pra entrar numa base?
Visual: cena em SVG: um portão de estádio pesado, entreaberto, com a luz do campo passando pela fresta. A fresta é a janela, e uma sombra já começa a fechar o portão. Sem pessoas.
Tempo: 3 min.
Fale (05): "Com [idade], a janela da base tá aberta agora. Em média, um ano parado, com [idade + 1], a conversa é outra." (sem prazo em meses: não prometa tempo)
Atenção: não diga "em média 3 meses até o clube": é promessa de prazo, e a tela não a traz.

SLIDE 11 · A PARTE DE VOCÊS, EM VOZ ALTA
Objetivo: o compromisso dito em voz alta, na frente da família. Pergunte, não mande.
Na tela:
- Rótulo: COMPROMISSO DE PALAVRA
- Título: A parte de vocês, em voz alta.
- Frase 1: Eu quero ser jogador profissional.
- Frase 2: Eu vou treinar todo dia e cumprir o que meu gerente de carreira passar, mesmo nos dias ruins.
- Frase 3: Nós apoiamos {{nome|ele}}, mesmo quando for difícil.
- Nota legal: De palavra. Nada a assinar aqui.
Visual: as três frases em coluna larga, cada uma com uma barra vertical de luz à esquerda que acende em dourado quando marcada (sim1, sim2, sim3); apagada, é cinza. Espaço generoso. Sem filetes horizontais empilhados (a R1 já fez), sem numeração. Ao fundo, bem discreto, o dossiê fechado.
Tempo: 3 min.
Fale (6.1, escada do sim): "[atleta], você quer ser jogador profissional?" [Atleta: "Quero."] "Você está disposto a pagar o preço da disciplina, mesmo nos dias ruins?" [Atleta: "Tô."] "[pai], [mãe], vocês apoiam ele nisso, mesmo quando for difícil?" [Família: "Apoiamos."]
Anote: sim1, sim2 e sim3.
Atenção: o sim do atleta na frente dos pais pesa mais que qualquer argumento, e a família sente que está sendo avaliada, não vendida. Pergunte, não mande: se o atleta hesitar, volte pro sonho dele (slide 05) em vez de insistir. Se ENCAMINHAMENTO_PERCENTUAL estiver preenchido em `<dados>`, o filtro pode ser falado; sem ele, use: "A gente só avança com quem se compromete. Talento abre a porta, disciplina mantém."

SLIDE 12 · O PLANO SE ABRE
Objetivo: o pagamento do gancho da R1. A abertura do plano é o momento dramático da call.
Na tela:
- Rótulo: PLANO INDIVIDUAL · {{nome}}
- Título: Agora eu posso te mostrar.
- Linha em dourado: Liberado nesta conversa, com a família toda junta.
Visual: o dossiê do slide 07, agora destrancando: o cadeado abre, as tarjas se dissolvem da esquerda pra direita e os quatro títulos ficam legíveis, com luz saindo das frestas. Animação de até 1,2 s; o slide também funciona parado, já aberto. Foto do atleta em duotone no canto superior da ficha, se houver.
Tempo: 1 min.
Fale: "Vocês combinaram, vocês se comprometeram. Agora eu abro o plano do [atleta], montado em cima do que vocês me contaram."
Atenção: cinco segundos. Não explique nada ainda.

SLIDE 13 · O QUE MUDA PRA VOCÊ
Objetivo: a primeira seção do plano, escrita em resultado final, não em entregável (valor percebido). O plano é montado em cima do que a família falou.
Na tela:
- Rótulo: PLANO INDIVIDUAL · {{nome}}
- Título: O que muda pra você.
- Até três blocos, os marcados em `dores`. Sem marcação, use os três primeiros (A, B e C). Cada bloco é a fala da família em cinza e, logo abaixo, o que muda em branco:
  A. “Nas peneiras ninguém olhou ele direito.” / Ele para de depender do olhômetro: é analisado com dados reais, do jeito que os clubes estão escolhendo hoje.
  B. “Ninguém de clube vê ele.” / Ele deixa de ser invisível pros clubes: entra numa rede com relação direta com a AGN Football.
  C. “Ele tá sem acompanhamento.” / Ele para de estar sozinho: alguém enxerga a evolução dele todo dia e decide a hora certa de levar pro clube.
  D. “Ninguém cobra ele, ninguém acompanha.” / Ele nunca mais fica largado: tem alguém de olho nele o tempo todo, puxando ele pro melhor resultado.
  E. “Não sei o que ele precisa melhorar.” / Ele sabe exatamente o que fazer pra evoluir, com o gerente e o Zyron ajustando a rota dele.
  F. “Não sei se ele tá no nível.” / Ele passa a ter uma resposta real sobre o próprio nível, não mais achismo.
Visual: a página aberta do dossiê ocupando o slide. Sem cabeçalho de colunas e sem tabela: cada bloco é uma frase em duas linhas, com um filete dourado curto na vertical ligando a fala ao resultado. Nada de cards e de três colunas.
Tempo: 4 min.
Fale (6.4): "Com base no que vocês contaram, o plano do [atleta] é esse." Depois, um bloco por vez: "[mãe], você disse que [fala da família]. Aqui muda: [resultado]."
Anote: quais dores a família reconheceu.
Atenção: mostre só o que a família falou. Fale resultado, nunca entregável. Nada de preço aqui.

SLIDE 14 · QUEM CUIDA DO ATLETA, TODO DIA
Objetivo: a segunda seção do plano: o diferencial (gerente de carreira e Zyron), com nome e rosto humano.
Na tela:
- Rótulo: PLANO INDIVIDUAL · {{nome}}
- Título: Quem cuida de {{nome|você}}, todo dia.
- Linha GERENTE DE CARREIRA · {{gerente|Um gerente de carreira só dele}}: Acompanha o desenvolvimento dele todo dia: evolução, treino e a hora certa de levar ele pros clubes.
- Linha ANALISTA DE PERFORMANCE · {{analista}}: Mede a evolução e entrega o relatório.
- Linha, em azul, ZYRON E SCOUTER: Analisa cada lance dos vídeos dele e acompanha a evolução o tempo todo.
Visual: a página do dossiê, com três linhas horizontais: o papel à esquerda em Saira grande, a descrição à direita em Archivo. O nome do gerente é o maior elemento. O traço azul só na linha do Zyron. Sem colunas de três, sem cards, sem ícones, sem fotos de pessoas.
Tempo: 3 min.
Fale (6.3): "O [atleta] vai ter um gerente de carreira, o [nome do gerente], acompanhando o desenvolvimento dele todo dia. E vai ter o Zyron, o nosso mecanismo exclusivo: um scouter só dele, acompanhando e mantendo contato o tempo todo. Isso não existe em escolinha, em peneira, em empresário, em lugar nenhum." / "Lembra do que você falou das peneiras? [nº] peneiras, e observado de verdade em [nº]. Aquilo é olhômetro. Hoje, com inteligência artificial, os clubes estão cada vez mais escolhendo atleta com base em dados reais. O Zyron analisa o [atleta] exatamente assim." / Pro atleta: "Gerente de carreira todo dia e um scouter só teu. Isso é estrutura de atleta profissional. Você vai começar a viver como um."
Atenção: números da casa (dez anos, centenas de atletas) só falados se você consegue comprovar; na tela, nunca.

SLIDE 15 · O CAMINHO ATÉ OS CLUBES
Objetivo: a terceira seção do plano: as conexões. O Zyron encontra o perfil; a equipe faz a ponte.
Na tela:
- Rótulo: PLANO INDIVIDUAL · {{nome}}
- Título: O caminho até os clubes.
- Linha 1: O Zyron cruza o perfil de {{nome|você}} com o que os clubes procuram.
- Linha 2: O gerente de carreira leva esse perfil até quem procura, por relação direta e pela AGN Football.
- Linha 3: Quando o clube chamar, ele organiza a ida com vocês.
- Fecho: O Zyron encontra. A gente faz a ponte.
- Nota legal: O encaminhamento depende do desenvolvimento, do desempenho, do perfil do atleta e das oportunidades disponíveis. Não há promessa de contratação ou de clube específico.
Visual: cena em SVG: uma ponte sobre um rio escuro, à noite. Na margem esquerda, uma pequena luz com uma placa; na direita, as luzes distantes de estádios e cidades, sem nome. Os cabos da ponte em dourado; um único ponto de luz azul no meio do vão (o Zyron). Sem mapa, sem rede radial, sem nomes de clubes.
Tempo: 3 min.
Fale (6.3 e 05): "O Zyron acha o time que precisa exatamente daquele estilo de jogo, e a gente faz a ponte." / "Quando ele for pro clube em [estado], [quem acompanha, da ficha] vai junto, como vocês falaram. E o gerente de carreira organiza essa ida com vocês."
Pergunte: se a ficha não tiver a locomoção: "Quando o [atleta] for pro clube, pode ser em outro estado. Alguém da família acompanha, ou ele vai sozinho?"
Atenção: não prometa clube, prazo ou contrato, e não cite nome de clube como exemplo.

SLIDE 16 · ELE + NÓS
Objetivo: a soma que resume o plano. Ele faz a parte dele, a gente faz a nossa, e o peso sai das costas da família.
Na tela:
- Título: Ele + nós.
- Coluna ELE: Talento. Disciplina nos dias ruins. Treinar todo dia e cumprir o que o gerente de carreira passar.
- Coluna NÓS: Gerente de carreira todo dia. O Zyron e o scouter dele. As conexões com quem procura o perfil.
- Fecho: Junto, isso muda a chance de sair da peneira e chegar ao clube certo.
- Linha em dourado: A parte de vocês continua a mesma: apoiar em casa. O resto é nosso.
- Só se ENCAMINHAMENTO_PERCENTUAL estiver preenchido: {{percentual}}% dos atletas que entram são encaminhados. (Sem o dado, essa linha não existe.)
Visual: "ELE" e "NÓS" como duas palavras enormes de peso igual, unidas por um "+" dourado grande no centro. Abaixo de cada uma, as três linhas. Nada de duas colunas com filete e nada de duas peças encaixadas (a R1 já fez).
Tempo: 2 min.
Fale (6.3 e 6.6): "Isso tudo é a prova por A mais B: A, o [atleta] tem talento e disciplina, a parte dele. B, a gente tem o mecanismo e as conexões, a parte da gente. Junto, é o que muda a chance dele de sair da peneira e chegar no clube certo." / "A partir de agora isso não é mais um peso de vocês. Vocês não precisam aprender nada novo, não precisam mudar a rotina, não precisam sair correndo atrás de clube. Isso vira trabalho nosso. A única coisa que fica com vocês é continuar apoiando o [atleta] em casa, do jeito que vocês já fazem."
Atenção: "ligar atrás de clube, torcer pra alguém olhar" pode ser falado. Não diga que a empresa paga viagem.

SLIDE 17 · O CASO MAIS PARECIDO
Objetivo: probabilidade percebida de sucesso: um caso real, o mais parecido em posição, idade e nível.
Na tela:
- Rótulo: O CASO MAIS PARECIDO
- Título: {{caso}}
- Frase, só com posição e idade: Também era {{casoPosicao}}. Entrou com {{casoIdade}} anos, numa situação muito parecida com a do {{nome|atleta}}.
- Frase sem esses dados: Acompanhado de perto, do treino até a mesa de assinatura.
- Resultado em dourado, só com tempo e clube: Em {{casoTempo}}, fechou com o {{casoClube}}. Só com o clube: {{casoClube}}.
- Linha, só com casoDuvida: A família dele também perguntou: “{{casoDuvida}}”
- Nota legal: Cada trajetória tem seu próprio contexto. Nenhum resultado é garantido.
Visual: uma única foto vertical e grande do caso (`kaio-01.jpg` para Kaio, `joaozinho-02.jpg` para Joãozinho), com o degradê da marca, ao lado da "ficha do caso": uma página do dossiê com os dados. Caso AGN ou Outro: só a ficha, sem foto. Sem colagem editorial e sem painéis lado a lado.
Tempo: 3 min.
Fale (6.5): "O estrategista esportivo comentou com vocês do [caso]. Ele também era [posição], entrou com [idade], numa situação muito parecida com a do [atleta]. Em [tempo], fechou com o [clube]." / "Foi assim com o Joãozinho, que hoje tá no Grêmio, com o Kaio e com vários outros."
Anote: o caso citado.
Atenção: o caso principal é sempre o mais parecido em posição, idade e nível, nunca o mais famoso. Só cite posição, idade e tempo se estiverem no CASOS.md.

SLIDE 18 · CONFIRA POR CONTA PRÓPRIA
Objetivo: prova externa que a família confere sozinha. Reduz o risco percebido e responde ao "isso é confiável?".
Na tela:
- Título: Tudo o que eu falei, vocês conferem.
- Itens, só os preenchidos: AGN Football · {{linkAgn}}. Site · {{site}}. Instagram · {{instagram}}. CNPJ · {{cnpj}}.
- Linha em dourado: Nada do {{nome|atleta}} é usado sem a autorização expressa de vocês.
Visual: uma barra de endereço de navegador desenhada, com o primeiro item digitado em dourado; abaixo, os outros itens em linhas simples. Sem mockup de celular (a R1 já fez).
Tempo: 2 min.
Fale (9.11): "A gente tem relação direta com a AGN Football, e tem jogador nosso publicado lá. O Joãozinho fechou com o Grêmio, o Kaio também passou por aqui. E aqui tá o nosso [site, Instagram ou CNPJ]. Vou te mandar tudo agora, no WhatsApp."
Atenção: mandar link de prova pode; mandar proposta por WhatsApp, nunca. Os itens vazios somem. Se nenhum item estiver preenchido, pule o slide.

SLIDE 19 · SE VOCÊS FOSSEM MONTAR ISSO POR CONTA
Objetivo: a conta, em palavras, sem número: o que seria montar tudo sozinho. Contraste, sem preço.
Na tela:
- Título: Se vocês fossem montar isso por conta.
- Linha: Um gerente de carreira particular, todo dia.
- Linha: Um preparador físico.
- Linha: Um analista de desempenho.
- Linha: Alguém pra montar o vídeo e levar pros clubes.
- Linha: Viagem pra cada avaliação.
- Fecho em dourado: Cinco agendas. Nenhuma conversa entre elas. E nenhuma tem o Zyron.
- Linha em cinza: Mesmo assim, ele continuaria dependendo do olhômetro. Ninguém garante que seria encaminhado.
Visual: cena em SVG: uma semana em calendário com cinco blocos de cores diferentes, sobrepostos e desencontrados: o caos das agendas. Só o caos; a harmonia fica implícita. Sem tabela de preços e sem ícones de dinheiro.
Tempo: 2 min.
Fale (07): régua: "Vocês já investiram [valor da ficha] nesse sonho, e ele continua sem ser visto por quem decide." Conta: "Agora pensa comigo: se vocês fossem montar isso por conta, iam precisar de um gerente de carreira particular acompanhando ele todo dia, preparador físico, analista de desempenho, alguém pra montar o vídeo e levar pros clubes, e viagem pra cada avaliação." Sem certeza: "E mesmo assim ele ia continuar dependendo do olhômetro de um avaliador de peneira. Ninguém garante que ele seria encaminhado, e nenhum deles tem o Zyron."
Atenção: o valor que a família já investiu é dito em voz alta, e a tela não mostra valor nenhum. O custo de mercado só entra na fala se estiver confirmado em `APRESENTACAO_R2.md`, seção 11.

SLIDE 20 · A GENTE NÃO PROMETE CONTRATO
Objetivo: confiança pela franqueza. Diz o que não promete, e por isso o que promete vale.
Na tela:
- Título: A gente não promete contrato.
- Linha em cinza: Quem promete, mente.
- Bloco em dourado, O QUE A GENTE PROMETE:
  Acompanhar {{nome|ele}} todo dia.
  Analisar cada lance do vídeo dele com dados.
  Levar o perfil dele até quem procura.
  Estar com vocês quando o clube chamar.
- Nota legal: O encaminhamento depende do desenvolvimento, do desempenho, do perfil do atleta e das oportunidades disponíveis. Não há promessa de contratação ou de clube específico.
Visual: a frase negativa grande e cinza, à esquerda; as quatro promessas à direita, em branco, com um traço dourado curto à esquerda de cada. Contraste só por tipografia: sem X, sem check, sem vermelho e sem verde.
Tempo: 1,5 min.
Fale (9.6): "Quem te promete contrato tá mentindo. O que a gente tem é gerente de carreira todo dia e o Zyron. Se ele não avançar, quem perde primeiro somos nós. O risco de verdade é ele ficar parado mais um ano."
Atenção: esta é a resposta pro "tem garantia?". Só mude se a política de devolução estiver confirmada (`APRESENTACAO_R2.md`, seção 9).

SLIDE 21 · UMA RELAÇÃO DE GANHA-GANHA
Objetivo: dizer, com todas as letras, como a assessoria se sustenta. Honestidade sobre o investimento e sobre o contrato.
Na tela:
- Título: Uma relação de ganha-ganha.
- Lado VOCÊS: O que vocês investem na assessoria sustenta a estrutura que cuida do {{nome|atleta}}: gerente de carreira, analista de performance e Zyron.
- Lado NÓS: A gente ganha no contrato profissional dele.
- Fecho: Sem essa estrutura, não tem contrato pra ninguém ganhar.
Visual: uma viga horizontal em equilíbrio sobre um único ponto dourado, desenhada em SVG, com os dois lados em peso igual. Tipografia grande. Sem tabela, sem linha do tempo, sem gráfico.
Tempo: 2 min.
Fale (07, "contrato"): "Vocês mesmos disseram pro estrategista esportivo: não faz sentido a gente lucrar em cima de vocês. Nosso lucro vem do contrato profissional do [atleta]. Essa parte do investimento é por conta dos gastos com o gerente de carreira e os profissionais dedicados a ele." / Se perguntarem "por que cobram?" (9.4): "Exatamente: nosso lucro vem do contrato. Isso aqui não é lucro, é o gasto com o gerente de carreira e os profissionais dedicados ao [atleta] até o contrato sair. Sem eles, não tem contrato pra ninguém ganhar."
Anote: a resposta da família ao "faz sentido a gente lucrar em cima de vocês?".

SLIDE 22 · O PLANO DO ATLETA (o silêncio)
Objetivo: a tela quieta no momento do valor. O Gestor diz o valor em voz alta e fica em silêncio.
Na tela:
- Rótulo: ASSESSORIA INDIVIDUAL
- Título: O plano do {{nome|atleta}}.
Visual: o dossiê aberto, calmo, centralizado, com a luz. Nada mais na tela. Sem número e sem texto extra.
Tempo: 1 min, mais o silêncio.
Fale (07, número): diga um valor por vez, o do plano escolhido, e pare. "O investimento no plano do [atleta] é de [valor]."
Atenção: regra de ouro: depois do número, silêncio. Nada de justificar, emendar desconto ou perguntar "o que acharam?". Quem fala primeiro depois do preço perde. Use o botão Silêncio (tecla S). Apresente o plano padrão primeiro; desça só pelo escopo ("existe um formato mais enxuto, com [o que muda no plano]"), nunca por desconto.

SLIDE 23 · DEIXA EU RESUMIR
Objetivo: o resumo dos sins, antes de pedir a decisão. A família ouve a própria decisão sendo construída.
Na tela:
- Título: Deixa eu resumir o que vocês me falaram.
- Linha, só com dor: {{dor}}
- Linha, só com nota: Vocês querem ver {{nome|ele}} num clube profissional: nota {{nota}}.
- Linha, só com sim1 ou sim2: Ele está comprometido, e disse isso em voz alta.
- Linha, só com lucro: Vocês mesmos disseram que não faz sentido a gente lucrar em cima de vocês.
- Linha: O plano tem gerente de carreira todo dia e o Zyron.
- Pergunta em dourado: Faz sentido pra vocês?
Visual: uma folha do dossiê com até cinco linhas curtas, cada uma com uma barra dourada fina à esquerda. A pergunta grande, embaixo, sozinha. Sem marcas de check.
Tempo: 2 min.
Fale (Modo A 1): "Deixa eu resumir o que vocês me falaram: [dor com as palavras deles]. Querem ver o [atleta] num clube, nota [nota]. Ele tá comprometido. E vocês mesmos disseram que não faz sentido a gente lucrar em cima de vocês. O plano tem gerente de carreira todo dia e o Zyron. Faz sentido pra vocês?"
Atenção: o "faz sentido" é o sim mais importante da call. Espere. Se disserem que sim, Modo A. Se a família estiver com pé atrás com vendedor, ou faltar um decisor, Modo B.

SLIDE 24 · A VAGA DO ATLETA (data-mode="A")
Objetivo: o Modo A: fechar na call, com escassez real e início imediato.
Na tela:
- Rótulo: PLANO INDIVIDUAL · COMO A SUA VAGA É DEFINIDA
- Título: A vaga do {{nome|atleta}}.
- Linha, só com vagas: Dessa turma de 10, {{vagasFrase}} A próxima abre em {{proximaTurma}}. (sem proximaTurma, só a primeira frase)
- Linha, só com idade: Com {{idade}} anos, esperar a próxima turma é perder janela.
- Linha: Confirmando hoje, o gerente de carreira entra em contato {{prazoContato|assim que a vaga é confirmada}}, e o Zyron começa a acompanhar {{nome|o atleta}} {{prazoZyron|em seguida}}.
Visual: cena em SVG: dez armários de vestiário em fileira. Os ocupados apagados, os livres com luz (conforme `vagas`; sem o dado, todos iguais e sem contagem). Um deles está aberto, com uma camisa pendurada e uma plaquinha com o nome do atleta. Sem colunas verticais de vagas.
Tempo: 3 min.
Fale (Modo A): 2) "Então eu confirmo a vaga do [atleta] agora. Fica melhor no Pix ou no cartão?" 3) "Show. Assim que cair o pagamento, eu já aviso o [gerente], e ele te chama [prazo]. O Zyron já começa a olhar o jogo do [atleta] [prazo do Zyron]." 4) "Dessa turma de 10, restam [vagas]. A próxima abre em [data]." 5) Depois de tratar a objeção: "Resolvido isso, eu confirmo a vaga dele agora. Pix ou cartão?" 6) "Vocês combinaram de decidir hoje, lembra? Pode ser não, tudo bem. O que tá faltando pro sim?"
Atenção: só fale de prazo se PRAZO_PRIMEIRO_CONTATO e PRAZO_ZYRON estiverem confirmados. Escassez só com o número real da semana.

SLIDE 25 · O RETORNO DA EQUIPE (data-mode="B")
Objetivo: o Modo B: quando a família precisa sentir controle, a decisão vai pra equipe, com dia e hora.
Na tela:
- Rótulo: PLANO INDIVIDUAL · COMO A SUA VAGA É DEFINIDA
- Título: Eu levo o {{nome|atleta}} pra equipe.
- Corpo: A equipe técnica analisa o caso dele antes de a vaga ser aberta. Amanhã, até {{horaRetorno}}, eu volto com o retorno. (sem horaRetorno: Amanhã eu volto com o retorno.)
- Pergunta em dourado: Se a equipe aprovar, vocês estão dentro?
- Linha em cinza: Até lá, conversem entre vocês e com {{nome|o atleta}}.
Visual: cena em SVG: um relógio de parede analógico numa parede escura, marcando a hora do retorno (se houver `horaRetorno`; senão, sem relógio e só o texto). Ponteiros dourados. Sem contagem regressiva e sem urgência agressiva.
Tempo: 3 min.
Fale (Modo B): 1) "Olha, eu não vou te vender nada hoje. Antes de abrir a vaga, eu apresento o [atleta] pro [gerente] e pra nossa equipe técnica, e são eles que decidem se ele entra nessa turma." 2) "Enquanto isso, conversem entre vocês e com o [atleta]. Se a equipe aprovar, vocês estão dentro?" 3) "Amanhã até [hora] eu te dou o retorno da equipe. Fica de olho no telefone." 4) No retorno: "[pai], boa notícia: o [gerente] e a equipe aprovaram o [atleta]. A vaga é dele até [hora]. Pra confirmar, é o investimento que eu te passei. Pix ou cartão?"
Anote: horaRetorno, e que a família disse "estamos dentro" ao condicional.
Atenção: só use o Modo B se a análise da equipe é real. A tela diz que a equipe analisa o caso; se o retorno é sempre "aprovado", a tela promete uma seleção que não existe. Nunca corra atrás da família: volte na hora combinada.

SLIDE 26 · BEM-VINDO
Objetivo: o pós-venda emocional e o início imediato (Sandler, "post-sell"): tira o medo do "e agora?".
Na tela:
- Título: Bem-vindo, {{nome|atleta}}.
- Linha: A partir de agora, quem corre atrás é a gente.
- Bloco HOJE: O gerente de carreira {{gerente}} entra em contato {{prazoContato|com vocês}}. (sem gerente: O gerente de carreira entra em contato com vocês.)
- Bloco NAS PRIMEIRAS 48 HORAS, só com prazoZyron: O Zyron começa a acompanhar {{nome|o atleta}} {{prazoZyron}}, e o gerente alinha os primeiros passos com vocês. Sem prazoZyron: O Zyron começa a acompanhar {{nome|o atleta}}.
- Linha em cinza: Vocês não precisam aprender nada novo nem mudar a rotina.
Visual: o armário do slide 24, agora aberto e iluminado, com a camisa e o nome do atleta, em escala grande; a foto do atleta, se houver, presa na porta em duotone. Luz dourada mais alta que nos slides anteriores. Sem confete, sem fogos, sem carimbo.
Tempo: 3 min.
Fale (10): áudio de boas-vindas: "Bem-vindo, [atleta]. Teu gerente de carreira e o Zyron começam contigo agora." / "[pai], [mãe], a partir de agora quem corre atrás é a gente. O [gerente] entra em contato com vocês [prazo], e o Zyron já começa a acompanhar o [atleta]." / Indicação, na hora: "[atleta], tem algum colega de time que joga no teu nível? A gente faz a avaliação dele também."
Anote: venda concluída no CRM e cadastro em Vendas (produto e ticket do plano fechado; a venda entra pendente até a aprovação do Executive); a indicação; o dia do primeiro contato do gerente.
Atenção: na indicação, peça o contato do responsável do colega, não do menino. Só prometa prazo confirmado. O "nas primeiras 48 horas" só aparece se PRAZO_ZYRON estiver preenchido.

SLIDE 27 · APOIO DO GESTOR (divisor interno)
Na tela: Apoio do Gestor de Carreiras · uso interno
Visual: fundo liso, discreto. É só um marcador, com `data-apendice`; o Gestor pula pra um dos slides seguintes pelo apresentador, e o divisor nunca aparece na sequência normal.

SLIDE 28 · COMPARA MESMO
Objetivo: a objeção "vou ver outras opções". Em vez de defender, entrega os critérios.
Na tela:
- Título: Compara mesmo.
- Subtítulo: Cinco perguntas pra fazer a qualquer outra opção.
- Pergunta: Analisa o atleta com dados reais ou no olhômetro?
- Pergunta: Tem alguém acompanhando o atleta todo dia?
- Pergunta: Tem um scouter como o do Zyron?
- Pergunta: Quantos atletas encaminharam, e dá pra conferir?
- Pergunta: Tem relação direta com quem divulga atleta, como a AGN Football?
- Fecho em dourado: A vaga do {{nome|atleta}} não fica aberta pra sempre. A turma é de 10.
Visual: uma prancheta de avaliação desenhada em SVG, com as cinco perguntas sem numeração e sem check. Tipografia grande.
Tempo: 2 min.
Fale (9.13): "Compara mesmo. Pergunta pra eles: analisam o atleta com dados reais ou no olhômetro? Tem gerente de carreira acompanhando todo dia? Tem um scouter como o do Zyron? Quantos atletas encaminham, e dá pra conferir? Têm relação direta com a AGN?" / "Só lembra que a vaga do [atleta] aqui não fica aberta pra sempre. A turma é de 10."
Atenção: não fale mal de ninguém. Fora da tela, de propósito: a pergunta "cobram mensalidade ou só ganham quando o atleta ganha?": escrita, ela esconde que existe investimento.

SLIDE 29 · O RELÓGIO NÃO PARA
Objetivo: a objeção "vou pensar". Custo de esperar, com fato, sem pressão.
Na tela:
- Título: Enquanto vocês pensam, o relógio não para.
- Linha: Decidindo hoje, o gerente de carreira entra em contato {{prazoContato|logo em seguida}}.
- Linha: Decidindo daqui a uma semana, {{nome|o atleta}} começa uma semana depois.
- Pergunta em dourado: O que vocês vão saber amanhã que não sabem agora?
Visual: um relógio de parede grande, desenhado em SVG, visto de lado e em sombra, com os ponteiros dourados. Não é a linha do tempo da R1. Sem contagem regressiva.
Tempo: 1,5 min.
Fale (9.3): "Claro. Pensar sobre o quê exatamente? O valor, conversar com mais alguém, ou alguma dúvida sobre o plano?" / "O que vocês vão saber amanhã que não sabem agora?" / "Vocês combinaram com o estrategista esportivo de decidir hoje. O que tá faltando?" / Modo B: "Pensem hoje, que eu levo o [atleta] pra equipe. Amanhã às [hora] eu te dou o retorno, e aí vocês me dizem se estão dentro."

SLIDE 30 · REVER O ZYRON
Objetivo: a família pede pra rever, ou pergunta "isso de inteligência artificial funciona mesmo?".
Na tela:
- Título: Rever o Zyron trabalhando.
- Linha: Menos de 2 minutos que explicam mais que qualquer slide.
- Lista de capítulos clicáveis ao lado do vídeo, iguais aos do R1 (0:00 O olhômetro, 0:22 A leitura lance a lance, 0:31 O relatório: o que treinar, 0:35 A IA e o seu scouter, 0:53 A base de clubes, 1:25 O Zyron na prática).
- Nota legal: Demonstração do Zyron. Vídeos e dados de atletas são usados somente com autorização expressa do responsável legal.
Visual: aqui, e só aqui, pode voltar a moldura com as cantoneiras azuis do Zyron e o player do R1, porque é uma ferramenta de consulta, não um momento da história.
Tempo: 2,5 min.
Fale (SDR 8.11): "Clube grande já escolhe atleta assim há anos, aqui e lá fora, só que sempre por dentro, sem o atleta nem saber que foi visto desse jeito. A novidade é que agora isso chegou até o atleta."
Atenção: compartilhe a guia com áudio. Os capítulos são clicáveis: volte no trecho que responde à dúvida.

</slides>

<followup>
Depois do sim (PLAYBOOK_CLOSER 10):
1. Pagamento na própria call: "faz agora comigo na linha".
2. Registro: venda concluída no CRM e cadastro em Vendas, com o produto e o ticket do plano fechado. Entra pendente até a aprovação do Executive.
3. Áudio de boas-vindas pro atleta.
4. Indicação na hora, com o contato do responsável do colega. Vira lead pro SDR.
5. Início imediato, só com o prazo confirmado: gerente de carreira e Zyron.

Depois do "ainda não" (PLAYBOOK_CLOSER 11): o Gestor volta sempre com motivo (retorno da equipe, caso, cenário), nunca pedindo.
- Mesmo dia: "[pai], resumo da nossa conversa: vocês me falaram que [dor com as palavras deles]. O plano do [atleta] resolve isso, com gerente de carreira todo dia e o Zyron. Amanhã às [hora] eu te trago o retorno da equipe." (é o texto do botão "Copiar resumo do mesmo dia")
- Data combinada: liga na hora marcada, com o retorno da equipe ou com todos os decisores. Retoma a dor e conduz a decisão.
- +1 dia: caso parecido ou link da AGN Football.
- +3 dias: "A vaga do [atleta] ainda tá separada, mas a turma tá fechando." Só se a vaga realmente estiver separada.
- +7 dias: o cenário de novo: idade, janela, o que muda na vida da família.
- +14 dias: só se a equipe realmente vai liberar a vaga: "A equipe vai liberar a vaga do [atleta] pros próximos aprovados amanhã. Se quiserem garantir, me responde hoje."
- Depois: devolve pro SDR, que reaborda em 30 dias. O histórico fica no CRM.
</followup>

<objecoes>
Método (PLAYBOOK_CLOSER 9), mostrado no topo da aba: 1 acolher, 2 isolar ("tirando isso, tem mais alguma coisa?"), 3 diagnosticar, 4 responder com as palavras da família, 5 conduzir de volta pra decisão. Um "não" é informação. Proibido: desconto, "vou ver com meu gerente", baixar valor sem mudar o escopo. Cada item abaixo vira um item de `OBJECOES` (`q`, `slides`, `resposta`); `slides` são os de socorro.

- "O valor tá muito alto" (9.1). Slides 19, 21 e 22. Acolher e isolar: "Entendo. Tirando o valor, tem mais alguma coisa que impede o [atleta] de começar?" Diagnosticar: "Quando você fala que tá alto: você não vê o retorno, ou é o dinheiro agora?" Se for retorno: "Cada perfil é individual, e o do [atleta] tem um gerente de carreira olhando pra ele todo dia, e um scouter do Zyron só dele. Sozinhos, vocês iam precisar de vários profissionais, cada um com a sua agenda, e sem certeza nenhuma." Se for o dinheiro agora: "Se o dinheiro não fosse problema, o [atleta] começava hoje? Então vamos resolver a forma: dá pra fazer em [condição de pagamento]. E se precisar, existe um formato mais enxuto, com [o que muda no plano]." Conduzir: "Então eu confirmo a vaga dele. Pix ou cartão?"
- "Preciso ver com minha esposa / meu marido" (9.2). Slide 3. "Faz todo sentido, é decisão de família. E você, se dependesse só de você, o [atleta] começava?" / "Então, se a [mãe] topar, vocês estão dentro?" / "Liga pra ela agora e coloca no viva-voz. Em 10 minutos eu explico o gerente de carreira e o Zyron, e vocês decidem juntos." Modo B: "Eu apresento o [atleta] pra equipe hoje, e amanhã às [hora] eu falo com vocês dois com o retorno." Proibido: mandar a proposta por WhatsApp pra ele mostrar pra ela.
- "Vou pensar" (9.3). Slides 29 e 23. Ver o slide 29.
- "Mas vocês não ganham no contrato? Por que cobram?" (9.4). Slide 21. "Exatamente: nosso lucro vem do contrato. Isso aqui não é lucro, é o gasto com o gerente de carreira e os profissionais dedicados ao [atleta] até o contrato sair. Sem eles, não tem contrato pra ninguém ganhar."
- "E se ele for dos que não chegam lá?" (9.5). Slide 11. "Isso depende do compromisso dele, e é por isso que o combinado foi em voz alta. É também por isso que ele tem gerente de carreira e Zyron em cima todo dia." Se ENCAMINHAMENTO_PERCENTUAL estiver preenchido, pode citar o filtro. Não pergunte pro atleta "você vai ser dos 5%?": é pressão direta sobre o menino.
- "E se não der certo? / Tem garantia?" (9.6). Slide 20. "Quem te promete contrato tá mentindo. O que a gente tem é gerente de carreira todo dia e o Zyron. Se ele não avançar, quem perde primeiro somos nós. O risco de verdade é ele ficar parado mais um ano."
- "Não tenho o dinheiro agora" (9.7). "Se tivesse, ele começava hoje?" / "Então o problema é só a forma. Dá pra fazer em [condição de pagamento], ou no formato mais enxuto. Qual cabe melhor?" / "Assim que resolver a forma, o gerente de carreira já liga [prazo confirmado]."
- "Ele não pode ir pra outro estado" (9.8). Slide 15. "Hoje ele não precisa ir pra lugar nenhum. Isso só acontece quando o clube chamar, e o gerente de carreira organiza com vocês." / "E vocês falaram pro estrategista esportivo que [solução da ficha]. Então isso a gente resolve junto quando chegar a hora."
- "Já tentamos peneira / empresário e não deu" (9.9). Slides 4 e 19. "Quantos garotos tinham nessa peneira? E quanto tempo olharam pra ele? Vinte minutos de coletivo?" / "Então não foi ele que não deu certo. Foi o olhômetro. Ninguém analisou o jogo dele de verdade, e ninguém acompanhou ele depois. É exatamente isso que o Zyron e o gerente de carreira fazem."
- "Ele ainda é novo / Ano que vem a gente vê" (9.10). Slides 10 e 29. "Com [idade + 1], a janela fica maior ou menor? O [caso] entrou com [idade do caso]. Esperar um ano é deixar a vaga de base pra outro menino."
- "Isso é confiável?" (9.11). Slides 18 e 17. "A gente tem relação direta com a AGN Football, com jogador nosso publicado lá. O Joãozinho fechou com o Grêmio, o Kaio também passou por aqui. E aqui tá o nosso [site, Instagram ou CNPJ]."
- "Manda por WhatsApp que eu vejo com calma" (9.12). "O plano é do [atleta], não é folder. Explicado aqui, com vocês, é que ele faz sentido. O que você precisa ver pra decidir?"
- "Vou ver outras opções" (9.13). Slide 28. "Compara mesmo. Pergunta pra eles: [as cinco perguntas]. Só lembra que a vaga do [atleta] aqui não fica aberta pra sempre. A turma é de 10."
- "Isso de inteligência artificial funciona mesmo?" (PLAYBOOK_SDR 8.11). Slides 30 e 14. "Clube grande já escolhe atleta assim há anos, aqui e lá fora, só que sempre por dentro, sem o atleta nem saber que foi visto desse jeito. A novidade é que agora isso chegou até o atleta."
</objecoes>

<como_entregar>
1. Antes do primeiro slide, escreva o sistema visual da R2 em até 10 linhas: como o objeto e a luz se combinam nas cenas em SVG, a escala tipográfica, o uso do dourado e do azul, e o que muda em relação à R1. Siga esse sistema em todos os slides.
2. Construa o site: `index.html`, `assets/deck.css`, `assets/deck.js`, `assets/roteiro.js`, a ficha e os recursos de `<funcional>`, reaproveitando o motor da R1.
3. Gere o deck inteiro: slides 01 a 30, na ordem, com as regras de exibição de `<funcional>`.
4. Gere `assets/roteiro.js` a partir dos blocos "Tempo", "Fale", "Pergunte", "Anote" e "Atenção" de cada slide e de `<objecoes>`, e o arquivo `notas-do-gestor.md`.
5. Antes de entregar, confira cada slide contra o `<checklist>` e rode os `<testes_de_aceite>`. Corrija o que falhar.
6. No fim, me mande quatro coisas: a lista dos slides com uma linha sobre a solução visual de cada um; o que ficou de P2 pra depois; os pontos em que você precisou desviar do pedido, com o motivo; e como rodar e testar o site localmente.
</como_entregar>

<testes_de_aceite>
Rode no navegador, com o site aberto e o apresentador em outra janela:
1. Ficha vazia e `<dados>` vazio: nenhum `{{ }}`, colchete, "undefined" ou campo em branco em nenhum slide. O slide 02 é pulado (sem ponto forte) e o 18 também (sem link nenhum). Os slides 08, 09 e 10 ficam visíveis (tipoDor vazio) e os 24 e 25 também (modo vazio). Os slides 27 a 30 ficam fora da sequência.
2. Cole a ficha de teste abaixo e clique em "Ler ficha": os campos são preenchidos, a conferência lista o que foi lido, e peneirasN e observadoN são sugeridos como 9 e 2.
3. Marque tipoDor como Financeira: só o slide 08 permanece entre os cenários, e a navegação por setas pula 09 e 10. Volte pra vazio: os três voltam.
4. Marque modo B: o slide 24 some da navegação; marque modo A: o 25 some.
5. Marque os campos pontoForte, trabalhar e perfilJogo: o slide 02 aparece com as três linhas. Apague: o slide some.
6. Marque duas dores em `dores`: o slide 13 mostra só elas. Nenhuma marcada: mostra as três primeiras.
7. Botão Silêncio: o contador sobe no apresentador, e a tela da família vai pro slide 22. O segundo toque volta.
8. A tela da família nunca mostra nada do apresentador (ficha, roteiro, "budget", objeções). Teste em duas janelas.
9. Busque no código-fonte e nos arquivos por "R$", "parcela", "desconto", "—" e "–", e por "reais" fora de "dados reais": nenhuma ocorrência fora do texto de regras.
10. Recarregue a página: a ficha continua. "Nova call (limpar ficha)" limpa e pede confirmação.

Ficha de teste (dados fictícios):
Origem: Zyron
Dados do Zyron:
Atleta: Davi, 15, lateral direito, pé direito
Mora em: Goiânia
Pai: Marcos | Mãe: Juliana | Outro responsável:
Decisores e como decidem: os dois juntos
Telefones dos decisores:
Treina hoje: escolinha, 3 vezes por semana
Times e experiências: sub-15 do time da cidade
Peneiras e avaliações: 9 peneiras, 4 clubes, "a gente te liga"
Se sentiu observado de verdade em: 2
Sonho do atleta: jogar num clube grande
O que ele acha que falta: alguém ver ele de verdade
Dor da família (palavras deles): A gente gasta, viaja, e ele volta calado.
Tipo de dor: Emocional
Já investiram: viagens e inscrições
Locomoção pra outro estado: a mãe acompanha
Respondeu "não faz sentido lucrar em cima"? sim
Apresentou gerente de carreira e Zyron? sim
Pré-compromisso de decidir na R2? sim
Empolgação do atleta (0 a 10): 9
Missão dada ao atleta? sim
Caso citado: Joãozinho
Link da AGN enviado? sim
Objeções que apareceram:
Sinais de budget:
R2: quinta, 02/10 19h30 | Todos os decisores confirmados? sim
</testes_de_aceite>

<checklist>
- O texto de cada slide está idêntico ao de <slides>, sem frase a mais nem a menos?
- Apareceu algum valor, preço, parcela, desconto, faixa de renda, percentual, número, clube, atleta, depoimento ou parceria que não está neste prompt? Se sim, tire.
- Sobrou travessão, rótulo numerado ou qualquer item de <padroes_a_evitar>?
- Algum recurso visual ou frase de <sem_repeticao_com_o_r1> voltou? Se sim, troque.
- Todo texto com 24 px ou mais, títulos com 96 px ou mais, corpo com 40 px ou mais? Reduzido ao tamanho de um celular, o título de cada slide ainda se lê?
- O azul fica só com o Zyron e o dourado com a marca e a carreira?
- Em nenhum slide o Zyron "assiste jogos inteiros"? Em todos, "scouter" e nunca "scout" ou "agente"?
- As notas legais dos slides 11, 15, 17, 20 e 30 estão lá, legíveis?
- Cada cena em SVG tem um só objeto e uma só luz? Nenhuma pessoa, rosto ou escudo desenhado?
- Toda variável tem fallback? Nenhum `{{ }}`, colchete ou "undefined" na tela com a ficha vazia?
- O modo da família nunca mostra nada do apresentador?
- Os P1 de <funcional> funcionam, e os testes de <testes_de_aceite> passaram?
- `notas-do-gestor.md` e `roteiro.js` têm o mesmo conteúdo, na ordem dos slides?
</checklist>
