# APRESENTACAO_R1_PROMPT.md

Versão: v2 (29/09/2026)
Prompt pronto pro Opus 5.5 gerar o deck da R1 (Estrategista Esportivo).
A copy canônica de cada slide está aqui dentro, no bloco `<slides>`.
Estratégia, mapa de persuasão, roteiro do vídeo e prompts de revisão:
`APRESENTACAO_R1.md`.

Changelog:
- v2: entra o slide 05 (o craque do bairro): a dor ganha cinco slides e o
  deck passa a ter 21 slides na R1 e 26 no total. O vídeo do Zyron (09)
  vem antes da explicação (10). "Scout" vira "scouter". Nas telas do
  Zyron, "jogo inteiro" vira "cada lance do vídeo", porque o Zyron
  analisa o vídeo que a família envia. "Pagar viagem" sai da tela do 13.
  Bloco R2 volta à ordem publicada. Novo bloco `<padrao_tecnico>`, com o
  padrão real do projeto no Genspark. As notas do apresentador vão pra
  um arquivo, porque o projeto não tem campo de notas. O Opus define o
  sistema visual antes de construir. O `<contexto>` ganha a postura da
  casa (a gente não vende, a gente seleciona) e um "quem somos" mais
  completo.
- v1: criação.

Como usar:
1. Duplique o projeto `jogador-de-elite-call` no Genspark. O deck atual
   continua no ar até o novo ser aprovado, e a cópia já leva as imagens
   e os slides da R2.
2. Suba o vídeo de demonstração do Zyron em `assets/video/zyron-demo.mp4`
   (e, se tiver, o poster em `assets/video/poster-zyron.jpg`).
3. Preencha o bloco `<dados>` lá embaixo. O que ficar entre colchetes, o
   Opus trata como vazio e não inventa.
4. Confira o slide 10: se o relatório do Zyron trouxer categorias
   diferentes das que estão lá, troque no texto antes de colar.
5. Selecione o Opus 5.5, copie tudo que está abaixo da linha marcada e
   envie. Se a caixa de texto cortar o prompt, anexe este arquivo e
   escreva: "Siga o prompt do arquivo anexo."

=============== COPIE DAQUI PRA BAIXO ===============

<tarefa>
Você vai reescrever e redesenhar o deck "Jogador de Elite", que já está neste projeto (versão publicada: https://jogador-de-elite.vercel.app/). É o deck que o Estrategista Esportivo mostra na R1, a primeira call com a família de um atleta.

O deck tem um trabalho só: fazer a família sair da call sentindo com clareza a dor de o atleta não ser visto, entendendo que o Zyron resolve exatamente isso, confiando em quem está do outro lado e topando a próxima conversa, com o Gestor de Carreiras.

Capricha em cada slide. Esse deck é a primeira impressão que uma família tem sobre o futuro do filho. Queremos o deck mais persuasivo e mais bonito que você consegue fazer, sem nenhuma informação falsa: com esse público, uma única promessa que não se sustenta derruba a confiança no resto.
</tarefa>

<contexto>
Quem somos: Jogador de Elite, assessoria de carreira para atletas de base. Cada atleta tem um gerente de carreira acompanhando o desenvolvimento dele todo dia e o Zyron, nosso mecanismo próprio de inteligência artificial (sempre "o Zyron", no masculino). A turma é fechada, com 10 atletas. Escolinha treina, peneira decide no olhômetro e empresário liga quando dá: aqui o atleta é analisado com dados reais e acompanhado todo dia.

Nossa postura: a gente não vende, a gente seleciona. A R1 não é uma apresentação de venda, é uma conversa de diagnóstico, e quem fala mais é a família. Quem precisa da vaga é o atleta, então o deck nunca pede, nunca implora e nunca empurra: fala de turma e de vaga, não de produto ou pacote, e não tem cara de anúncio (nada de selo de oferta, contagem regressiva, exclamação ou botão de comprar). O intuito do deck é a família entender o que está em jogo e querer ouvir o plano na próxima conversa. Preço e proposta são da R2, com o Gestor de Carreiras.

Quem assiste: o atleta, de 13 a 17 anos, e o pai, a mãe ou o responsável, numa chamada de vídeo. Muitas vezes pelo celular, com o slide compartilhado numa tela pequena. Muitas famílias já gastaram com peneira e já ouviram falar de golpe de "empresário". Chegam desconfiadas, e desconfiança se vence com prova concreta, não com adjetivo.

Quem apresenta: o Estrategista Esportivo. A call dura de 20 a 30 minutos e é mais conversa que apresentação. Nos slides de pergunta ele para e deixa a família responder, porque quem responde em voz alta se convence sozinho. O deck acompanha a conversa, não substitui.

A tese, numa frase: talento que ninguém vê não vira contrato. A peneira decide no olhômetro: um avaliador, 22 garotos, 20 minutos de coletivo. O Zyron analisa cada lance do vídeo que a família envia e gera relatório de performance. Um scouter do Zyron, dedicado ao atleta, acompanha a evolução dele o tempo todo. O Zyron cruza o perfil do atleta com o que os clubes procuram, e a nossa equipe faz a ponte até esses clubes. Nada do atleta entra no Zyron sem a autorização expressa do responsável.

Precisão que a família vai cobrar depois: o Zyron analisa o vídeo que a família envia, não jogos inteiros; o acompanhamento contínuo é do scouter do Zyron; o encaminhamento depende do atleta e das oportunidades, e nunca se promete contrato, clube, prazo ou salário.

Regra comercial: nos slides 01 a 21 não aparece preço nem valor em R$. Preço é da R2, com o Gestor de Carreiras, e fica num bloco separado no fim do deck.
</contexto>

<dados>
Preenchidos pelo dono do projeto. Campo que ainda estiver entre colchetes conta como vazio: remova o elemento que depende dele e nunca invente um valor no lugar.

VIDEO_ZYRON: video/zyron-demo.mp4
DURACAO_VIDEO_ZYRON: [ex.: 2 minutos]
PASSOS_DO_VIDEO: [o que o vídeo mostra, na ordem. Ex.: a ficha e o vídeo entrando, com a autorização do responsável; a leitura lance a lance; o relatório de performance; a evolução com vídeo novo; o perfil cruzado com o que os clubes procuram]
DURACAO_CONVERSA_GESTOR: 45 minutos
TITULO_DAVID: [cargo do David Willer, do jeito que ele quer ser apresentado]
ANOS_DE_MERCADO: [só com comprovação. Ex.: mais de 10]
ATLETAS_ENCAMINHADOS: [só com lista que comprove. Ex.: centenas de]
VAGAS_RESTANTES: [número real desta semana]
</dados>

<arco>
O deck conta uma história em sete atos, e o visual acompanha a emoção de cada um:

1. Abertura (01): a tese.
2. A dor (02 a 06): os slides mais escuros, silenciosos e tipográficos do deck. Muito respiro, quase nenhuma cor. Ela começa pessoal (a pergunta, a conta, o lance perdido), fica coletiva (o craque do bairro) e termina no preço.
3. A virada (07): a luz entra, na saída do túnel.
4. O Zyron (08 a 12): o azul toma conta. Precisão, leitura, dados. Objetivo e demonstrável: nome, vídeo, mecanismo, contraste, encaixe.
5. O que muda (13): calor humano.
6. A prova (14 a 17): fotos reais, gente de verdade, dourado.
7. O compromisso (18 a 21): foco, clareza, próximo passo.

Os ecos entre slides são de propósito, mantenha todos: o avaliador que "olhou pro outro lado" (04) volta como o olheiro que "não olha pro lado" (08); os "54 segundos" (03) viram "cada lance seu" (07); o craque que "só não foi visto" (05) volta em "Kaio foi visto. Joãozinho foi visto." (19); o "a gente te liga" (06) reaparece na tabela (11); "alguém sendo visto" (14) volta em "Kaio foi visto" (19).
</arco>

<identidade_visual>
Mantenha a identidade do deck atual. Ela já funciona, e a família precisa reconhecer a marca.

Formato: slides 1920×1080 (16:9), no padrão técnico descrito em <padrao_tecnico>.

Cores:
- Fundo #07080A. Painéis #0A0D12 e #14181F.
- Dourado da marca #C9A24A. Dourado claro, pra destacar texto, #E8CE8E.
- Texto: #FFFFFF em títulos, #C9CFD7 no corpo, #8B939D em legendas e notas.
- Azul do Zyron #7FAEFF: a cor da inteligência artificial (já existe no deck atual, nos slides de dados e inteligência). Aparece de leve no slide 07, domina de 08 a 12 e depois só onde o Zyron for citado. Dourado é carreira e conquista; azul é dados e leitura do jogo. Essa separação ensina a família, sem explicar, o que é máquina e o que é a nossa equipe.

Tipografia (Google Fonts, já carregadas no projeto por assets/theme.css):
- Saira Condensed 700/800: títulos e números de impacto.
- Barlow Condensed 500/600: rótulos curtos em caixa alta, espaçamento largo.
- Archivo 400/500/600: corpo.

Legibilidade (regra dura, porque a família vê numa tela pequena):
- Título com 96 px ou mais. Número de impacto com 220 px ou mais.
- Corpo com 40 px ou mais. Nenhum texto abaixo de 24 px, nem nota legal, nem contador de página. O deck atual tem texto de 17 a 25 px: aqui não pode.
- Até cerca de 30 palavras de texto corrido por slide. Slides em colunas, diagrama ou tabela podem passar disso, desde que cada bloco seja curto.
- Texto sobre foto sempre com degradê escuro por trás.

Fotografia: cinematográfica, noturna, estádio, refletor, grão sutil, degradê escuro da esquerda pra direita, como na capa atual. Gente real só nas fotos reais dos assets.

Interface do Zyron (07 a 12): linguagem de visão computacional desenhada em código (SVG/CSS), nunca em imagem gerada. Cantoneiras de mira, caixa de rastreamento em volta do jogador, linha de varredura, grade fina, pontos de mapa de calor. Linhas finas em #7FAEFF, sóbrio e preciso. Nenhum texto ou número falso dentro da interface.

Movimento: no máximo uma animação de entrada por slide, curta, e só se a ferramenta suportar. Todo slide tem que funcionar parado, porque compartilhamento de tela em chamada trava animação.
</identidade_visual>

<padroes_a_evitar>
Estes padrões aparecem por padrão em deck gerado por IA e deixam tudo com cara de template. Não use nenhum:
- Rótulos numerados "01", "02", "03" em cards, etapas, seções ou listas. O deck atual está cheio disso: tire todos. (O contador de página no canto, "NN / 26", é a única numeração permitida.)
- Grade de cards iguais com ícone, título e uma linha.
- Linguagem de processo: "etapa", "jornada", "onboarding", "setup", "passo a passo".
- Pílulas: botões, selos ou tags com borda totalmente arredondada.
- Glassmorphism, cartão translúcido com desfoque, brilho neon.
- Texto com degradê e palavra em itálico de destaque dentro de título.
- Fundo creme ou off-white.
- Ícones genéricos: lâmpada, foguete, alvo, troféu, raio, check verde, X vermelho.
- Clichês de IA: cérebro de circuito, mão de robô, holograma, rosto digital, partículas flutuando, degradê roxo e rosa.
- Gráfico, barra de progresso ou porcentagem com número inventado.
- Travessão (— ou –) em qualquer texto. Use ponto, vírgula ou dois-pontos.
- Rótulo em caixa alta em cima de todo título. Use só onde ele situa a família.
</padroes_a_evitar>

<regras_de_conteudo>
- O texto de cada slide está em <slides> e vai pra tela exatamente assim. Você decide quebra de linha, hierarquia e destaque; não reescreve, não resume e não acrescenta frase. Cada palavra foi escolhida por um motivo de venda.
- Não invente número, clube, atleta, depoimento, prêmio ou parceria. Todo número na tela é prova que a família pode cobrar depois. Se faltar um dado, deixe um marcador visível entre colchetes.
- Precisão sobre o Zyron: ele analisa o vídeo que a família envia ("cada lance do vídeo"). Nunca escreva que ele assiste "jogos inteiros". O acompanhamento contínuo é do "scouter do Zyron": use sempre "scouter", nunca "scout" nem "agente". Não prometa contrato, clube, prazo, salário ou porcentagem.
- Notas legais: legíveis (24 px ou mais), discretas, no rodapé. Elas protegem a empresa e passam seriedade pra família desconfiada.
- Português do Brasil, com acento. A marca é "Jogador de Elite". O serviço é "assessoria", nunca "mentoria".
- Nenhum R$ nos slides 01 a 21.
- A "Nota do apresentador" de cada slide nunca vai na tela. O projeto não tem campo de notas: reúna todas num arquivo `notas-do-apresentador.md`, na ordem dos slides, com o número e o nome de cada um.
</regras_de_conteudo>

<padrao_tecnico>
O projeto é do Genspark e o deck atual segue um padrão. Siga o mesmo, pra tudo continuar editável e exportável:
- Cada slide é um arquivo HTML em slides/, com nome em português, minúsculo e separado por hífen (como capa.html e video-apresentacao.html). Cada arquivo carrega ../assets/theme.css, que só importa as fontes e define o fundo.
- Dentro do body, um único div com class="slide-container" e data-screen-label="NN Nome do slide", de 1920×1080 px, overflow hidden, fundo #07080A e font-family Archivo.
- Todo elemento é posicionado em px, com position:absolute e estilo inline, e traz data-object="true" com data-object-type="textbox", "shape" ou "image". Texto em <p> com margin 0. Desenhos em SVG inline, dentro de um elemento data-object.
- Imagens com <img> e caminho relativo, como ../assets/tunel.jpg. Vídeo com <video controls preload="metadata" playsinline poster="..."> e <source>, sem autoplay, dentro de um elemento data-object-type="image", como no slide de vídeo atual.
- Não carregue fonte nova nem biblioteca externa.
- Contador de página no canto inferior direito de todo slide, atualizado pro novo total ("NN / 26"), com 24 px ou mais.
- Atualize a ordem dos slides no projeto pra que ela seja a numeração de <slides>.
</padrao_tecnico>

<assets>
Imagens que já estão no projeto (pasta assets):
- capa-estadio.jpg: atleta em silhueta no gramado de um estádio à noite.
- tunel.jpg: túnel de estádio com a saída iluminada.
- estadio-final.jpg: estádio vazio à noite, refletores acesos.
- performance.jpg: detalhe de treino de velocidade.
- psicologia.jpg: atleta em vestiário sob luz fria.
- nutricao.jpg: composição de nutrição esportiva.
- imagem-profissional.jpg: atleta em corredor moderno.
- kaio-01.jpg: Kaio assinando contrato com o Internacional.
- kaio-02.jpg: Kaio em arte de divulgação das oitavas de final da Copa do Brasil Sub-17.
- joaozinho-02.jpg: Joãozinho assinando contrato com o Grêmio ao lado de David Willer.
- joaozinho-01.jpg: Joãozinho abraçado com David Willer após a assinatura.
- joaozinho-03.jpg: David e a equipe com Joãozinho no dia da assinatura com o Grêmio.
- david/IMG_0321.jpg: David Willer acompanhando atleta em campo de treino.
- david/IMG_0282.jpg e david/IMG_0287.jpg: David Willer com atleta em centro de treinamento.
- david/IMG_0281.jpg e david/IMG_0288.jpg: atleta assinando contrato com o Gama ao lado de David Willer.
- agn-feed.png: perfil público da AGN Football com atletas e clubes.
- video/apresentacao.mp4, com poster video/poster-apresentacao.jpg: registros reais do acompanhamento.
- video/zyron-demo.mp4: demonstração do Zyron (novo; o dono sobe antes de rodar este prompt). Se não existir o poster video/poster-zyron.jpg, gere um poster escuro com a interface do Zyron.

Imagem nova, só no slide 04: se a ferramenta gerar imagem, crie uma foto cinematográfica, noturna, de um garoto de uns 15 anos em pleno lance, nítido em primeiro plano, e ao fundo, desfocado, um avaliador de prancheta virado pro outro lado. Sem rosto reconhecível, sem logotipo, sem escudo de clube. Se a ferramenta não gerar imagem, use performance.jpg com degradê escuro.

Desenho novo, só no slide 05: feito em SVG, sem gente, descrito no próprio slide.
</assets>

<slides>

SLIDE 01 · CAPA
Objetivo: a tese em três segundos.
Na tela:
- Rótulo: ASSESSORIA DE CARREIRA COM INTELIGÊNCIA ARTIFICIAL
- Título: Jogador de Elite
- Frase: Talento que ninguém vê não vira contrato.
Visual: capa-estadio.jpg em tela cheia, com o degradê da capa atual. Título enorme à esquerda; a frase em dourado claro, logo abaixo.
Nota do apresentador: abertura, contexto e experiências (PLAYBOOK_SDR 6.1 a 6.3) acontecem com a capa na tela. Combinado de abertura: "Vou te mostrar como a gente enxerga o jogo do [atleta]. No fim, vocês me dizem com sinceridade se faz sentido seguir."

SLIDE 02 · A PERGUNTA
Objetivo: a dor começa pela boca da família, não pela nossa.
Na tela:
- Título: Quantas peneiras você já fez?
- Linha em dourado: E em quantas alguém realmente te viu jogar?
Visual: fundo liso, muito respiro. Ao lado do texto, marcas de contagem (risquinhos agrupados de cinco em cinco, como contagem feita na parede), em SVG com traço de giz, cinza. Uma única marca em dourado. É a imagem de peneira atrás de peneira e quase nenhuma vez sendo visto.
Nota do apresentador: pare e pergunte: quantas peneiras, em quais clubes, quantos garotos tinham, quanto tempo jogou, o que disseram na saída e em quantas se sentiu visto de verdade (PLAYBOOK_SDR 6.4). Os dois números vão pro CRM.

SLIDE 03 · A CONTA DO OLHÔMETRO
Objetivo: dar número à sensação. Número específico convence mais que adjetivo.
Na tela:
- Rótulo: A CONTA QUE NINGUÉM FAZ
- Linha: 22 em campo. 1 avaliador. 20 minutos de coletivo.
- Número gigante: 54 segundos
- Linha: de atenção pra cada um. Isso se ele dividir o olhar por igual. E ninguém consegue.
- Fecho em dourado: Anos de treino. 54 segundos pra mostrar.
- Nota legal: 20 minutos ÷ 22 jogadores ≈ 54,5 segundos. E o avaliador não vê um coletivo por dia: vê vários, um atrás do outro.
Visual: "54" enorme em branco, "segundos" menor ao lado. À direita, um campo esquemático em linhas finas com 22 pontos e um único cone de visão, estreito, cobrindo dois ou três deles. O resto do campo no escuro.
Nota do apresentador: "Me fala com sinceridade: você acha que, no olhômetro, o avaliador consegue analisar todos aqueles garotos com precisão?" Espere o "não". Se disserem que a peneira deles foi diferente: "É a conta de um coletivo comum. Faz a conta da sua."

SLIDE 04 · O LANCE QUE NINGUÉM VIU
Objetivo: o fundo da dor e, logo em seguida, o alívio: a culpa não é do atleta.
Na tela:
- Linha 1: Seu melhor lance aconteceu.
- Linha 2: No segundo em que o avaliador olhou pro outro lado.
- Linha 3: Pra peneira, esse lance não existiu.
- Fecho em dourado, maior: Não foi você que falhou. Foi o olhômetro.
Visual: a foto nova descrita em <assets> (ou performance.jpg), em tela cheia, com degradê escuro. Texto à esquerda, uma linha por vez, com bastante espaço entre elas. O fecho separado do resto, como uma virada.
Nota do apresentador: deixe o silêncio trabalhar. Se a família contar uma história de peneira, ouça até o fim antes de passar.

SLIDE 05 · O CRAQUE DO BAIRRO
Objetivo: tornar a dor coletiva. Não é só com ele, e pode ser o filho de qualquer um. O atleta deixa de se sentir sozinho, e a família enxerga o risco de ninguém ver.
Na tela:
- Título: Todo bairro tem um craque que ninguém viu.
- Pergunta em dourado: Você conhece algum?
- Fecho, pequeno e sozinho, embaixo: Ele não era pior. Só não foi visto.
Visual: cena desenhada em SVG, sem gente. Campo de várzea à noite, chão de terra, a silhueta de uma trave torta e um único poste de luz, com o cone de luz caindo sobre uma bola parada no centro. O resto no escuro, quase sem cor. Se a cena ficar fraca, fique só com o cone de luz e a bola sobre fundo liso.
Nota do apresentador: pergunte de verdade: "Você conhece algum garoto que era muito bom e nunca foi visto?" Deixe contar. Devolva com as palavras da pessoa e só então passe: "É exatamente isso que a gente existe pra evitar." Se a família já contou uma história nos slides 02 ou 04, use a dela aqui e siga.

SLIDE 06 · O PREÇO DE NÃO SER VISTO
Objetivo: mostrar que ficar parado também custa, e puxar o valor já gasto, que o Gestor de Carreiras usa na R2.
Na tela:
- Título: Não ser visto custa caro.
- DINHEIRO: Inscrição, passagem, chuteira, dia de trabalho perdido. Peneira atrás de peneira.
- CONFIANÇA: A volta pra casa em silêncio. O "a gente te liga" que nunca tocou.
- TEMPO: A base tem prazo. Cada ano sem ser visto é um ano a menos de janela.
- Pergunta em dourado, no rodapé: Quanto vocês já investiram nesse sonho até hoje?
Visual: três colunas separadas só por filetes finos, sem cards e sem ícones. DINHEIRO, CONFIANÇA e TEMPO em Barlow Condensed dourado. A pergunta numa faixa própria, embaixo.
Nota do apresentador: pergunta obrigatória (PLAYBOOK_SDR 6.7); o valor vai pro CRM. Depois: "Se continuar assim, onde vocês acham que ele vai estar daqui a um ano?" (6.6).

SLIDE 07 · E SE?
Objetivo: a família dizer em voz alta o que quer. Só depois disso o Zyron entra.
Na tela:
- Título: E se alguém visse cada lance seu?
- Corpo: Cada decisão. Cada movimento sem a bola. E levasse tudo isso até quem procura exatamente um jogador como você.
Visual: tunel.jpg em tela cheia. A saída iluminada do túnel é a virada do deck: do escuro pra luz. O azul do Zyron aparece aqui pela primeira vez, sutil, na luz do fim do túnel.
Nota do apresentador: "O que mudaria pra vocês se ele fosse visto assim?" Espere a resposta. Sem ela, não passe pro Zyron.

SLIDE 08 · ZYRON
Objetivo: dar nome e rosto ao mecanismo.
Na tela:
- Rótulo em azul: APRESENTANDO
- Título: ZYRON
- Frase: O olheiro que não pisca.
- Linha: Não olha pro lado. Não cansa. Não esquece.
- Corpo: Inteligência artificial que assiste a cada lance do seu vídeo e transforma o que você faz em campo em dados reais.
Visual: performance.jpg (ou capa-estadio.jpg) escurecida, com a interface do Zyron por cima: cantoneiras de mira e caixa de rastreamento em volta do atleta, linha de varredura atravessando a imagem. "ZYRON" enorme em Saira Condensed branco; "O olheiro que não pisca." em azul.
Nota do apresentador: se o lead veio do Zyron: "É o mesmo Zyron que analisou o [atleta]. A diferença é que, dentro da assessoria, ele acompanha o [atleta] o tempo todo." (PLAYBOOK_SDR 02). Em uma frase: "Clube grande já escolhe atleta assim há anos. Agora isso chegou até o atleta." (8.11). Depois: "Vou te mostrar ele trabalhando."

SLIDE 09 · O ZYRON TRABALHANDO
Objetivo: provar o mecanismo antes de explicá-lo. Ver convence mais que ouvir, e o slide seguinte só dá nome ao que a família acabou de ver.
Na tela:
- Título: Veja o Zyron trabalhando.
- Linha: [DURACAO_VIDEO_ZYRON] que explicam mais que qualquer slide.
- Lista curta ao lado do vídeo: os itens de PASSOS_DO_VIDEO, na ordem, sem numeração.
- Nota legal: Demonstração do Zyron. Vídeos e dados de atletas são usados somente com autorização expressa do responsável legal.
Visual: player grande (60% da largura ou mais) com VIDEO_ZYRON, poster, controles, playsinline, sem autoplay. Moldura com as cantoneiras azuis do Zyron. Se o vídeo ainda não estiver no projeto: poster escuro, botão de play e o marcador "[vídeo do Zyron entra aqui]".
Nota do apresentador: antes do play: "Repara no que ele marca em cada lance." Dê play e fique quieto. Depois: "Consegue imaginar o jogo do [atleta] passando por aí?" Se o vídeo travar na chamada, não insista: vá pro slide 10 e explique com os cinco verbos.

SLIDE 10 · COMO O ZYRON FUNCIONA
Objetivo: dar nome a cada parte do que a família viu e mostrar o que vem depois do relatório: o acompanhamento e a conexão. Mecanismo claro aumenta a crença de que vai funcionar.
Na tela:
- Título: Como o Zyron funciona
- RECEBE: Sua ficha e o vídeo do seu jogo. Com autorização expressa do responsável.
- ANALISA: Cada lance do vídeo: com bola, sem bola, decisão, posicionamento.
- RELATA: Relatório de performance sempre atualizado: pontos fortes, o que evoluir, seu perfil de jogo.
- ACOMPANHA: Um scouter do Zyron só seu, de olho na sua evolução o tempo todo. Vídeo novo, relatório novo.
- CONECTA: Seu perfil cruzado com o que os clubes procuram. A ponte é com a gente.
Visual: os cinco verbos em linha, da esquerda pra direita, ligados por um único feixe azul contínuo (a mesma linha de varredura do slide 08) que atravessa o slide. Sem números, sem cards, sem ícones. Verbo em Saira Condensed azul; explicação em Archivo embaixo. CONECTA em dourado: é onde a nossa equipe entra.
Nota do apresentador: 30 segundos, sem travar a conversa: "O que você viu, em cinco verbos." Ficha e vídeo entram, o relatório sai, o scouter acompanha, a gente conecta.

SLIDE 11 · OLHÔMETRO OU DADOS REAIS
Objetivo: contraste direto. Depois deste slide, a peneira no olhômetro parece coisa do passado.
Na tela:
- Título: Olhômetro ou dados reais.
- Tabela, com as colunas OLHÔMETRO e ZYRON:
  - Quanto do seu jogo é visto | Os lances que calharem de ser vistos | Todos os lances do vídeo
  - Atenção | Dividida entre 22 | Só em você
  - O que fica registrado | A memória do avaliador | Um relatório de performance
  - Depois | "A gente te liga" | Acompanhamento da sua evolução
  - Quem fica sabendo de você | Um clube, num dia | Quem procura o seu perfil
- Fecho: Os grandes clubes já escolhem jogador com dados há anos, por dentro. Agora essa leitura joga do seu lado.
Visual: coluna OLHÔMETRO apagada, cinza, como luz desligada. Coluna ZYRON acesa em azul, com brilho sutil. Sem vermelho e verde, sem X e check.
Nota do apresentador: leia em voz alta só a coluna do olhômetro e pergunte: "Foi assim nas peneiras dele?"

SLIDE 12 · O ENCAIXE
Objetivo: a virada de crença. Ele não precisa ser o melhor entre 22; precisa ser encontrado por quem procura o perfil dele. Aqui a IA encontra a nossa rede.
Na tela:
- Título: Em algum lugar, um clube precisa exatamente do jogador que você já é.
- Corpo: Todo elenco tem uma lacuna. Você não precisa ser o melhor da peneira. Precisa ser encontrado por quem procura o seu perfil.
- Rótulos no desenho do campo: lateral que chega ao fundo · volante que sai jogando · 9 de área
- Fecho, metade em azul e metade em dourado: O Zyron encontra o seu perfil. A gente faz a ponte.
- Nota legal: O encaminhamento depende do desenvolvimento, do desempenho, do perfil do atleta e das oportunidades disponíveis. Não há promessa de contratação ou de clube específico.
Visual: um campo visto de cima, em linhas finas, com três posições marcadas como lacunas, cada uma com seu rótulo. No fecho, "O Zyron encontra o seu perfil." em azul e "A gente faz a ponte." em dourado, encostadas, como duas peças que se completam.
Nota do apresentador: é aqui que a família entende o que é a assessoria: a IA encontra, a gente conecta.

SLIDE 13 · VOCÊ PARA DE JOGAR SOZINHO
Objetivo: o que muda pros dois decisores. Pro atleta, estrutura de profissional. Pra família, o peso sai das costas.
Na tela:
- Título: Você para de jogar sozinho.
- Coluna PRA VOCÊ:
  - Gerente de carreira acompanhando você todo dia.
  - Um scouter do Zyron só seu.
  - Analista de performance medindo sua evolução.
  - Físico, mente, nutrição, comportamento e imagem juntos.
- Coluna PRA SUA FAMÍLIA:
  - Correr atrás de clube, ligar atrás de peneira, torcer pra alguém olhar: isso vira trabalho nosso.
  - A parte de vocês continua a mesma: apoiar em casa.
Visual: à esquerda, uma faixa de tiras verticais de foto (performance.jpg, psicologia.jpg, nutricao.jpg, imagem-profissional.jpg), não cards. À direita, bloco mais calmo e com mais respiro: é o alívio.
Nota do apresentador: na coluna da direita, fale olhando pro pai e pra mãe: "Depois que ele entra, quem corre atrás é a gente." (PLAYBOOK_SDR 8.6). Se perguntarem de viagem: "Quando o clube chamar, o gerente de carreira cuida disso junto com vocês." (8.9).

SLIDE 14 · TODO CONTRATO COMEÇA COM ALGUÉM SENDO VISTO
Objetivo: prova de que o caminho existe, com atletas reais.
Na tela:
- Título: Todo contrato começa com alguém sendo visto.
- Kaio · Internacional · Contrato profissional · Copa do Brasil Sub-17
- Joãozinho · Grêmio · Contrato assinado
- Linha: Acompanhados de perto, do treino até a mesa de assinatura.
Visual: kaio-01.jpg e kaio-02.jpg de um lado, joaozinho-02.jpg e joaozinho-01.jpg do outro, em composição editorial (tamanhos diferentes, nada de grade igual). Nome em Saira Condensed grande, clube em dourado.
Nota do apresentador: compare com o caso mais parecido em posição, idade e nível (CASOS.md): "O perfil dele é muito parecido com o do [caso]."

SLIDE 15 · DO SEU LADO
Objetivo: autoridade de quem está por trás, com provas reais.
Na tela:
- Título: Do seu lado, quem já fez esse caminho.
- Nome: David Willer
- Cargo: [TITULO_DAVID]
- Corpo: Na mesa de assinatura do Joãozinho com o Grêmio. Na assinatura com o Gama. Do campo de treino ao contrato.
- Faixa de números, só com os dois campos preenchidos: [ANOS_DE_MERCADO] anos no futebol · [ATLETAS_ENCAMINHADOS] atletas encaminhados
- Fecho: Isso não acontece uma vez. Acontece de novo.
Visual: joaozinho-03.jpg grande. Em faixa, david/IMG_0321.jpg, david/IMG_0282.jpg, david/IMG_0281.jpg e david/IMG_0288.jpg. Se a faixa de números ficar vazia, o fecho sobe e ocupa o lugar dela.
Nota do apresentador: "Ele vai ter um gerente de carreira acompanhando o desenvolvimento dele todo dia." (PLAYBOOK_SDR 6.11).

SLIDE 16 · AGN FOOTBALL
Objetivo: prova externa, que a família confere sozinha.
Na tela:
- Título: Nossos atletas também aparecem aqui.
- Corpo: Relação direta com a AGN Football, canal do mercado do futebol que divulga atletas no Brasil e no exterior. Tem atleta nosso publicado lá.
- Linha em dourado: O link vai pro seu WhatsApp depois da nossa conversa.
- Nota legal: Registro do perfil público da AGN Football. Nenhuma vinculação a clube ou atleta é oferecida como parte do programa.
Visual: agn-feed.png grande e nítido, dentro de uma moldura de celular, à direita. Texto à esquerda.
Nota do apresentador: mande o link logo depois da call (PLAYBOOK_SDR 10).

SLIDE 17 · VEJA COM SEUS PRÓPRIOS OLHOS (OPCIONAL)
Objetivo: prova visual do acompanhamento.
Na tela:
- Título: Veja com seus próprios olhos.
- Linha: Registros reais do acompanhamento.
Visual: o vídeo atual (video/apresentacao.mp4, poster video/poster-apresentacao.jpg), com a identidade nova.
Nota do apresentador: opcional. Pule se a call já passou de 25 minutos.

SLIDE 18 · O PREÇO DA DISCIPLINA
Objetivo: compromisso dito em voz alta, na frente da família. Também deixa claro que talento sem disciplina não basta.
Na tela:
- Título: Três perguntas. Resposta em voz alta.
- Você quer ser jogador profissional?
- Está disposto a pagar o preço da disciplina, mesmo nos dias ruins?
- Sua família apoia você nisso?
- Fecho em dourado: Talento abre a porta. Disciplina mantém ela aberta.
Visual: as três perguntas empilhadas, grandes, uma por faixa, separadas por filetes. Sem numeração. Fundo liso.
Nota do apresentador: uma pergunta por vez, esperando cada resposta (PLAYBOOK_SDR, escada do sim). A terceira é pro pai e pra mãe.

SLIDE 19 · O PRÓXIMO
Objetivo: o atleta se enxergar na sequência dos casos.
Na tela:
- Linha: Kaio foi visto. Joãozinho foi visto.
- Título: O próximo pode ser você.
- Três painéis: Kaio · Internacional | Joãozinho · Grêmio | Você · capítulo em aberto
- Nota legal: Imagem conceitual. Nenhum resultado é garantido.
Visual: dois painéis com fotos reais (kaio-01.jpg, joaozinho-02.jpg) e um terceiro com silhueta em luz dourada e o texto "Você". O Estrategista pode trocar "Você" pelo nome do atleta antes da call.
Nota do apresentador: "[atleta], imagina você entrando em campo com a camisa do [clube dos sonhos]." (PLAYBOOK_SDR 6.5).

SLIDE 20 · A TURMA
Objetivo: escassez real, com o motivo real.
Na tela:
- Número gigante: 10
- Título: atletas por turma.
- Corpo: Acompanhar de verdade, todo dia, tem limite. Por isso a turma é pequena. Não é estratégia de venda: é o tamanho de um trabalho bem feito.
- Linha, só com VAGAS_RESTANTES preenchido: Nesta turma, restam [VAGAS_RESTANTES] vagas.
Visual: estadio-final.jpg com degradê. "10" enorme em dourado.
Nota do apresentador: não force; a escassez é real, é só dizer.

SLIDE 21 · O PRÓXIMO PASSO
Objetivo: fechar a R1 com o pré-compromisso e a R2 marcada, com todos os decisores.
Na tela:
- Rótulo: O PRÓXIMO PASSO
- Título: Uma conversa com o Gestor de Carreiras.
- Corpo: [DURACAO_CONVERSA_GESTOR], com você e sua família juntos. Ele apresenta o seu plano individual. Se fizer sentido, vocês decidem ali mesmo.
- Destaque em dourado: É nessa conversa que a sua vaga na turma é definida.
- Campo pra preencher na call: Dia ____ · Hora ____
- Nota legal: Vídeos e dados do atleta são usados somente com autorização expressa do responsável legal.
Visual: fundo escuro com um feixe dourado de refletor. Uma linha discreta com três marcos: "Hoje: nossa conversa" (concluído), "Próximo: seu plano com o Gestor de Carreiras" (aceso), "Depois: a turma" (apagado).
Nota do apresentador: missão do atleta (PLAYBOOK_SDR 6.14): "Quero você lá, com seu pai e sua mãe, contando pra eles o que me contou hoje." Pré-compromisso (6.15): "Se fizer sentido, vocês decidem ali mesmo, juntos?" Espere o "sim". Ofereça dois horários (6.16) e só desligue depois do "confirmo" (10).

</slides>

<bloco_r2>
Depois do slide 21 vem o bloco do Gestor de Carreiras, que o Estrategista Esportivo nunca mostra.

SLIDE 22 · DIVISOR
Na tela: R2 · Uso do Gestor de Carreiras
Visual: discreto, fundo liso. É um marcador interno.

SLIDES 23 A 26
São quatro slides que já existem no deck atual, na ordem em que estão publicados: "Tudo em um só lugar", "Garantia incondicional", "Uma relação de ganha-ganha" e "Quanto valeria construir isso separadamente?". Mantenha a ordem, o texto e todos os valores em R$ de cada um. Só três ajustes: tire os travessões (inclusive os usados como marcador de lista), tire a numeração dos rótulos ("01 · Para onde vai o valor" vira "Para onde vai o valor") e aplique a identidade deste prompt, com a regra de legibilidade e o contador de página "NN / 26".
</bloco_r2>

<como_entregar>
1. Antes do primeiro slide, escreva o sistema visual em até 10 linhas: grade, escala tipográfica, uso do dourado e do azul, tratamento das fotos e linguagem da interface do Zyron. Siga esse sistema em todos os slides.
2. Gere o deck inteiro: slides 01 a 21, o divisor (22) e os slides 23 a 26, nessa ordem, e atualize a ordem no projeto.
3. Gere o arquivo notas-do-apresentador.md, com a nota de cada slide.
4. Antes de entregar, confira cada slide contra o <checklist> e corrija o que falhar.
5. No fim, me mande três coisas: a lista dos slides com uma linha sobre a solução visual de cada um; os marcadores entre colchetes que ficaram na tela; e qualquer ponto em que você precisou desviar do pedido, com o motivo.
</como_entregar>

<checklist>
- O texto de cada slide está idêntico ao de <slides>, sem frase a mais nem a menos?
- Apareceu algum número, clube, atleta, depoimento ou parceria que não está neste prompt? Se sim, tire.
- Sobrou travessão, rótulo numerado ou qualquer item de <padroes_a_evitar>?
- Nenhum R$ entre os slides 01 e 21?
- Todo texto com 24 px ou mais, títulos com 96 px ou mais, corpo com 40 px ou mais?
- Reduzido ao tamanho de uma tela de celular, o título de cada slide ainda se lê?
- O azul fica com o Zyron e o dourado com a marca e a carreira?
- Em nenhum slide o Zyron "assiste jogos inteiros"? Em todos, "scouter" e nunca "scout" ou "agente"?
- As notas legais dos slides 03, 09, 12, 16, 19 e 21 estão lá, legíveis?
- O contador de página mostra "NN / 26" em todos os slides, com 24 px ou mais?
- Cada slide segue o <padrao_tecnico> (1920×1080, data-object, nenhuma fonte nova)?
- As notas do apresentador estão no arquivo notas-do-apresentador.md, e não na tela?
</checklist>
