/* Roteiro do Gestor de Carreiras (Closer) para a R2.
   Fonte única: alimenta o modo apresentador e o arquivo notas-do-gestor.md.
   Base: PLAYBOOK_CLOSER v9 (números entre parênteses são as seções dele; "slide NN" é o slide do deck)
   e CASOS.md / PLAYBOOK_SDR (AGN Football, casos, números da casa).
   A R2 não começa do zero: o SDR já coletou tudo, o Gestor confirma, apresenta o plano e fecha.
   Três planos (window.PLANOS, no fim deste arquivo): até o 32 a tela mostra a estrutura completa, a do Legacy;
   o 33 mostra os três com o investimento de cada um e destaca o da ficha, que é o número falado com o Silêncio (S).
   [atleta], [responsável], [pai], [mãe], [gerente], [característica], [experiência], [sonho],
   [primeiro foco], [locomoção], [dor], [peneiras], [investido], [faixa], [vagas],
   [hora], [idade + 1], [link AGN], [caso], [clube do caso], [país do caso], [link do caso], [posição]
   são trocados pelos dados da ficha. Do plano da ficha: [plano] (Scout PRO, Assessoria PRO ou Legacy),
   [preço] (o valor, vitalício), [parcela] (das 10x sem juros), [ritmo] (a cada 15 dias, toda semana ou todo dia)
   e [por dia] (o valor dividido em 3 meses, só na fala).
   A ordem segue a Bíblia das Vendas (processo-r2, window.ETAPAS no fim deste arquivo). O inimigo comum é o olhômetro
   (03, e a resposta no 15); o atleta se vê em campo no 12. silencio: os três pontos de pergunta e silêncio (03, 17 e 33),
   que o apresentador marca; no 03 e no 17 a tecla S conta ali mesmo, sem trocar de slide.
   Entraram em 09/10/2026, no projeto novo, o 09 (a plataforma, tela ilustrativa), o 11 (quem olha por ele: a IA 24 horas e a parte humana no ritmo do plano)
   e o 23 (a rede: AGN, clubes e o David). A referência visual deles está em imagesr2 (REFERENCIAS_R2.md).
   A garantia (34) vem depois dos planos, com os três valores na tela de uma vez (pedido de 11/10/2026).
   O 17 (v2, 08/10/2026) mostra o vídeo do atleta e o relatório que o Gestor deixou pronto no painel (Leitura do atleta);
   sem vídeo no painel, é a leitura ao vivo de sempre. A fala tem as duas versões.
   Em 11/10/2026 (painel do closer): o link do Painel do Closer (?a=<código>) traz a foto e o nome do atleta pros slides 01, 02,
   12, 25 e 33 (grande) e 09, 11, 21, 30 e 32 (pequena), e entrou o 25 (o que ele leva: IA, gente, conexões, oportunidades,
   tempo e garantia). Do 27 ao 34 de antes, cada slide andou uma casa (o deck tem 33).
   Em 17/10/2026 entraram 6 slides trazidos da página /institucional, todos opcionais no painel: o método (10), o campo olhômetro × IA (13),
   o encaixe, "você não precisa ser o próximo Neymar" (14), os 326 atletas (22), os clubes e parceiros (23) e o mosaico de rostos (24). O resto andou:
   10 e 11 de antes andaram 1, 12 a 18 andaram 3 e 19 a 27 andaram 6 (o deck tinha 27).
   Em 18/10/2026 entraram o dossiê do atleta (18: a foto e os dados, o vídeo analisado pela IA, o mapa de calor, as oportunidades
   e o plano de carreira; só aparece com dado do painel) e o inimigo em comum (19: o avaliador que não olha todo mundo e o que as
   peneiras custam). Do 18 ao 33 de antes, cada slide andou duas casas (o deck tem 35). Os números das entradas de 11/10 e de
   17/10, acima, são os da época; o resto do arquivo usa os de hoje. [nome completo], [dia da call] e
   [hora da call] vêm da ficha; [garantia] vem de window.GARANTIA, no fim deste arquivo, o lugar único do texto da garantia. */

window.ROTEIRO = [
  { nome: 'Capa', min: 1,
    fala: [
      'Conexão pelo nome (4.1): "[pai], [mãe], [atleta], prazer. Eu sou o gestor de carreiras. Li tudo o que vocês conversaram com o estrategista esportivo, e hoje eu trago o planejamento de carreira do [atleta]."',
      'Com o link do painel (nome na capa e foto no slide de escolha), a abertura, olhando pro atleta e apontando o dossiê: "[atleta], antes de começar: isso aqui foi montado hoje pra você. Seu nome, sua posição, seu dossiê. Nenhum outro atleta tem esta apresentação." Sem o link do painel, siga direto pro gancho.',
      'O gancho, apontando o título: "E eu começo pelo que travou ele até aqui: o olhômetro não viu o jogo do [atleta]."',
      'Veio do Zyron: "Mas o Zyron viu. [atleta], você foi pré-selecionado: o Zyron analisou o teu vídeo e a equipe aprovou o teu perfil. É por isso que eu tô aqui."',
      'Veio do formulário ou sem origem: "[atleta], a gente leu a tua história. O plano que eu vou te mostrar foi montado a partir dela."',
      'Olhando pro atleta, não pros pais: "E guarda isso, [atleta]: se você tá vendo essa apresentação, é porque tem o que é preciso. A gente não perde tempo montando plano pra quem não tem."'
    ],
    perguntas: [],
    crm: ['Quem está na call (pai, mãe, atleta) e se algum decisor falta.'],
    atencao: 'Chame cada um pelo nome desde o primeiro minuto. Decisor fora da call: pare aqui e reagende. O gancho apresenta o inimigo comum, o olhômetro: avaliar a olho, em poucos minutos, sem dado e sem acompanhamento depois. Família, atleta e você ficam do mesmo lado da mesa contra ele. Ataque o método, nunca o avaliador nem clube nenhum. O selo de dossiê leva o nome do atleta e, com o link do painel (?a=), o código do registro dele: o deck é o dossiê dele. Bastidor ao vivo (01) só se for verdade: vire pro lado e resolva em voz alta o contrato de outro atleta. A frase "se você está vendo isso" volta em vários slides: é o fio da conversa, e ela é pro atleta. A abertura "montado hoje pra você" só vale com o link do painel e a foto opcional dele no slide de escolha: confira antes da call, na aba Ler antes (foto, nome e a hora da call). A foto é a que a família autorizou: não comente a aparência dele; "nenhum outro atleta tem esta apresentação" é sobre o material, nunca sobre o nível dele (nada de "especial", "único" ou "o melhor").'
  },
  { nome: 'Por que você', min: 1.5,
    fala: [
      'Veio do Zyron: "[atleta], o Zyron analisou o teu vídeo, e a equipe aprovou o que viu: [característica]. Não é todo mundo que chega até essa conversa."',
      'Veio do formulário: "[atleta], você contou pra gente: [experiência]. Foi isso que a equipe viu. Você já é jogador, o que falta é o caminho."',
      'Sem contexto: "A equipe analisou o teu jogo e aprovou o teu perfil. Por isso vocês estão aqui."',
      'Exclusividade (03): "Eu não falo com toda família. Se o [atleta] chegou até aqui, é porque tem o perfil que a gente procura."',
      'Plante o espelho, como quem acabou de perceber: "Sabe que, lendo o teu perfil, você me lembrou muito um atleta nosso? Daqui a pouco eu te mostro quem é." Não fale o nome ainda: a curiosidade segura a atenção até o slide 22.',
      'O plano é dele, apontando o cartão com o retrato dele: "Esse é o teu perfil aprovado, [atleta]. E esse plano é só teu: nenhum outro atleta tem este plano. Ele sai da tua história e do teu jogo."',
      'Ponte: "Hoje eu trago o plano pra levar você até lá."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Confirme o que ele já contou, nunca pergunte de novo. "Só do [atleta]" é sobre o plano, nunca sobre o nível dele: nada de "você é único", "especial" ou "o melhor". Use as palavras do Contexto do CRM. O atleta sai deste slide sabendo que foi escolhido. O espelho só entra com o caso real preenchido na ficha (grupo Caso espelho); sem caso, pule a frase. O retrato no cartão é a foto autorizada no painel (sem foto, a inicial do nome): ele prova que o plano é dele; não use pra elogiar a aparência.'
  },
  { nome: 'O olhômetro', min: 2,
    fala: [
      'Ponte, olhando pros pais: "Antes do plano, eu quero falar de quem avaliou o [atleta] até hoje. Vocês me contaram: [peneiras]."',
      'Leia a coluna da tela, linha por linha, sem pressa: "Na peneira, o jogo dele é visto nos lances que calharem de ser vistos. A atenção é dividida entre 22. O que fica registrado é a memória de um avaliador. Depois, \'a gente te liga\'. E quem fica sabendo dele é um clube, num dia." Ajuste ao que a família contou.',
      'A pergunta, pro atleta: "[atleta], sendo sincero: no olhômetro, em vinte minutos de coletivo, o avaliador analisou o teu jogo de verdade?" Silêncio. Espere a resposta, sem completar.',
      'Pros pais: "Foi assim nas peneiras dele?" Espere.',
      'A virada, apontando a frase de baixo: "Então guarda isso, [atleta]: não foi você que não deu certo. Foi o olhômetro."',
      'Aponte a coluna tracejada: "Essa coluna fica vazia por enquanto. Daqui a pouco eu mostro o que preenche ela."'
    ],
    silencio: '"[atleta], no olhômetro, em vinte minutos de coletivo, o avaliador analisou o teu jogo de verdade?" E pare. Quem responde é ele.',
    perguntas: ['[atleta], o avaliador analisou o teu jogo de verdade?', 'Foi assim nas peneiras dele?'],
    crm: ['As peneiras com os números da família (quantos garotos, quanto tempo olharam pra ele), com as palavras deles.'],
    atencao: 'É a dor da Bíblia (etapa 02), antes do plano. O olhômetro é o inimigo comum, e família, atleta e você ficam do mesmo lado da mesa. Ataque o método, nunca a pessoa: o avaliador de peneira faz o que dá em vinte minutos com dezenas de garotos. Nada que chame avaliador de incompetente, e nenhum clube citado. "Vinte minutos" e "dividida entre 22" são a referência da tela: ajuste ao que a família contou e não invente número. Depois da pergunta, silêncio: aperte S (aqui o silêncio conta sem trocar de slide). A coluna "A resposta" é preenchida no 15, com o Zyron. Desarma "já tentamos peneira", "será que ele é bom o suficiente?" e "vou ver outras opções" antes de aparecerem.'
  },
  { nome: 'O planejamento de carreira', min: 4.5,
    fala: [
      '"Esse é o plano do [atleta]. Eu vou te mostrar cada etapa e onde ela leva você."',
      'Potencial, apontando a frase da tela: "E repara numa coisa: esse plano só existe porque o [atleta] tem potencial. A parte difícil, que é ter o que é preciso, ele já tem. O resto é método."',
      'Agora: "O Zyron e o gerente de carreira leem o teu jogo e definem o que evoluir primeiro. No teu caso: [primeiro foco]."',
      'Todo dia: "Você treina com direção. O gerente de carreira acompanha, e o Zyron olha o teu jogo como um estrategista de carreiras só teu."',
      'Vitrine: "O teu perfil vai pra quem procura um jogador como você: os mais de 250 clubes da nossa rede e a AGN Football, onde estão publicados os atletas nossos que já fecharam."',
      'Quando o clube chamar: "O gerente organiza a ida com vocês. Vocês me falaram: [locomoção]."',
      'Destino: "E tudo isso existe pra uma coisa: [sonho]."',
      'O tripé, apontando a faixa de baixo: "Pra chegar no clube, todo atleta precisa de três coisas: ser visto, ser preparado e ser apresentado. Talento sem os três fica parado em casa. A gente cuida dos três."',
      'A + B (06): "A, o [atleta] tem talento e disciplina, a parte dele. B, a gente tem o método, o histórico e as conexões. Junto, é isso que muda a chance dele de sair da peneira e chegar no clube certo."',
      'Com a Assessoria PRO ou o Scout PRO na ficha, feche falando da estrutura, não do plano: "Esse é o caminho inteiro. Daqui a pouco eu te mostro como ter ele do teu lado, no ritmo que faz sentido pra vocês."'
    ],
    perguntas: ['Faz sentido esse caminho pra vocês?'],
    crm: [],
    atencao: 'Amarre cada etapa ao que eles disseram até aqui, na ficha e na conversa. Não prometa prazo, clube ou contrato. O tripé da Bíblia fica escrito na tela: Ser visto, Ser preparado e Ser apresentado são o passo de cada plano do 33, um por degrau. Previne "ele não pode ir pra outro estado": hoje ele não vai pra lugar nenhum, isso só acontece quando o clube chamar. O caminho da tela é a estrutura completa, a do Legacy: gerente de carreira, vitrine com clubes e AGN e a ida organizada. Com o PRO ou o Scout PRO na ficha, não diga que o plano dele entrega isso: o 33 mostra o que cada plano entrega.'
  },
  { nome: 'E se?', min: 0.5,
    fala: [
      'Ponte do plano, apontando a etapa "Agora" do slide anterior: "Eu falei que o Zyron e o gerente de carreira leem o jogo do [atleta]. Deixa eu te mostrar o que isso quer dizer."',
      '"E se alguém visse cada lance dele? Cada decisão, cada movimento sem a bola, e levasse isso até quem procura exatamente um jogador como ele?"',
      '"O que mudaria pra vocês se ele fosse visto assim?" Espere.'
    ],
    perguntas: ['O que mudaria pra vocês se ele fosse visto assim?'],
    crm: [],
    atencao: 'Bloco do Zyron (slides 05 a 08), o mesmo que a família viu na R1, e depois o campo (12) e a resposta ao olhômetro (15), que são novos. Sonho e o que falta já estão na ficha: não pergunte de novo. Se todos os decisores estavam na R1, passe rápido do 05 ao 08 e use cada slide como lembrete; se um decisor não estava, mostre inteiro, com o vídeo. O 12 e o 15 são sempre inteiros.'
  },
  { nome: 'Zyron', min: 1,
    fala: [
      'Abra como a resposta, apontando o rótulo: "Lembra da coluna vazia do olhômetro? A resposta tem nome: o Zyron."',
      'Veio do Zyron: "É o mesmo Zyron que analisou o vídeo do [atleta]. Dentro da assessoria, ele acompanha o [atleta] o tempo todo, com um estrategista de carreiras só dele."',
      '"O olhômetro olha. O Zyron mede: lê cada lance do vídeo, com o mesmo critério pra todo atleta, e mostra a evidência em vídeo de cada ponto."',
      '"Clube grande já escolhe atleta assim há anos, aqui e lá fora, só que por dentro, sem o garoto nem saber que foi visto desse jeito. Agora isso trabalha do lado do [atleta]. E não é qualquer atleta que tem acesso: só quem passa pelo filtro."',
      '"Vou te mostrar ele trabalhando."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'O 06 abre como a resposta ao olhômetro do 03: gelo na tela, laranja só no olhômetro. Exclusividade: o acesso ao Zyron é pra quem passa pelo filtro. O Zyron analisa o vídeo que a família envia, lance a lance: nunca diga que ele assiste jogos inteiros. "Precisão" aqui é lance a lance, mesmo critério e evidência em vídeo: nunca percentual de acerto, nunca "a IA não erra", nunca "mais preciso que qualquer olheiro".'
  },
  { nome: 'O Zyron trabalhando (vídeo)', min: 1.5,
    fala: [
      'Antes do play: "Repara no que ele marca em cada lance." Dê o play (espaço no deck ou os capítulos no apresentador) e fique quieto.',
      'Depois: "Consegue imaginar o jogo do [atleta] passando por aí? É isso que entra no plano dele, a cada vídeo novo."'
    ],
    perguntas: ['Consegue imaginar o jogo do [atleta] passando por aí?'],
    crm: [],
    atencao: 'Compartilhe a guia com áudio e teste antes. Se todos os decisores viram o vídeo na R1, não rode inteiro: use os capítulos "O relatório: o que treinar" e "A base de clubes". Se travar na chamada, siga pro próximo slide e explique com os cinco verbos. Com o vídeo do atleta no painel, quem prova é o jogo dele, no 17: aqui, rode só "A leitura lance a lance" e "A base de clubes".'
  },
  { nome: 'Como o Zyron funciona', min: 0.5,
    fala: [
      '"Em cinco verbos: a ficha e o vídeo entram, o Zyron lê cada lance, sai o relatório, o estrategista de carreiras acompanha, e a gente conecta."',
      'Amarre no plano: "É desse relatório que sai o primeiro foco do [atleta]: [primeiro foco]."'
    ],
    perguntas: [],
    crm: [],
    atencao: '30 segundos, sem travar a conversa. Reforce a autorização expressa do responsável: é resposta pronta pro "isso é confiável?".'
  },
  { nome: 'A plataforma', min: 1.5,
    fala: [
      'Ponte, apontando a tela: "Agora eu quero te mostrar onde tudo isso vive. Isto é uma tela ilustrativa da plataforma do [atleta]: o vídeo dele, os clipes por tipo de lance, o mapa de calor e o relatório, tudo no mesmo lugar." Apontando o topo, com a foto dele: "Repara: é o painel do [atleta]."',
      'Um avanço por cartão (→ ou espaço). O mapa de calor: "O Zyron mostra por onde o [atleta] joga." Os clipes: "Cada lance vira um clipe, com o tipo de ação: passe, condução, desarme. Vocês veem o lance, não a opinião de alguém." O relatório: "Pontos fortes e prioridades, cada um com o vídeo que prova."',
      'Contra o olhômetro: "Na peneira, o que o avaliador viu some quando ele vai embora. Aqui, o que o Zyron viu fica guardado em vídeo, pra vocês e pra quem decide."',
      'Pergunta: "O que de uma tela assim ajudaria mais vocês no dia a dia: ver o vídeo dele por tipo de lance ou ler o relatório?" Espere.'
    ],
    perguntas: ['O que ajudaria mais no dia a dia: ver o vídeo por tipo de lance ou ler o relatório?'],
    crm: ['O que a família mais quer ver: clipes, mapa de calor ou relatório, com as palavras dela.'],
    atencao: 'É uma tela ILUSTRATIVA, e a tela não diz mais isso (pedido do dono, 18/10/2026): diga você, em voz alta, e não leia nada como dado dele. Não há nota, percentil nem comparação com outros atletas, e o Zyron não tem percentual de acerto. O mapa de calor é só a ideia: só fale de mapa de calor dele se a leitura do painel de fato trouxer isso. O quadro do vídeo aparece no primeiro cartão só se o vídeo dele estiver no painel, com a autorização do responsável. Antes da call, confirme com o dono o que da plataforma já está no ar e fale só do que está. A referência visual está em imagesr2 (REFERENCIAS_R2.md). A foto no topo é a autorizada no painel; a tela continua ilustrativa, então não diga que a plataforma dele já está pronta.'
  },
  { nome: 'O método: a IA encontra, a gente conduz', min: 1.5,
    fala: [
      'Ponte, depois da plataforma: "Antes de eu falar de quem olha por ele, o princípio por trás de tudo, em duas frases: a IA encontra e a gente conduz."',
      'Apontando o cartão da esquerda, com as barras se enchendo: "A inteligência artificial lê dez indicadores de cada atleta, do passe à marcação, sem cansaço, sem preferência e sem olhômetro. Cada barra é um indicador lido, não uma nota."',
      'Avanço 1, o cartão da equipe: "Do outro lado, um agente humano interpreta a leitura da IA e define o plano de evolução do [atleta]."',
      'Avanço 2: "Ele acompanha cada vídeo novo: cada um vira uma nova leitura e o próximo foco."',
      'Avanço 3: "E faz a conexão: leva o perfil a quem decide, com vídeo e relatório na mão. Quem decide é o clube."',
      'Fecho: "A IA sozinha não conduz ninguém, e só gente volta ao olhômetro. As duas juntas é o que a gente entrega. Agora o ritmo da parte humana em cada plano."'
    ],
    perguntas: ['O que pesa mais pra vocês hoje: ter a leitura do jogo do [atleta] ou ter alguém conduzindo o caminho dele?'],
    crm: ['O que pesa mais pra família: a leitura ou o acompanhamento, com as palavras dela.'],
    atencao: 'Slide do princípio (trazido da página /institucional): aqui é o "porquê", e o ritmo de cada plano vem no 11, logo depois. Os dez indicadores são o que a IA lê, não notas: a tela não mostra número, nota, percentual nem comparação com outros atletas, e você também não dá nenhum. Diga "um agente humano" (o termo da casa) e não prometa o mesmo ritmo em todos os planos: o ritmo está no 11. Só a IA fica ligada 24 horas: nunca "24/7" pro acompanhamento humano. A IA lê o vídeo que a família envia, com autorização do responsável; não diga que ela "acerta" ou "garante" nada. Slide opcional (painel): tire se a call estiver curta.'
  },
  { nome: 'Quem olha por ele', min: 1.5,
    fala: [
      '"O Zyron fica ligado 24 horas: cada vídeo novo do [atleta] ele lê, marca os lances e monta o relatório. Ele não cansa e não esquece."',
      'Avanço 1: "E ele não fica sozinho. Um agente humano acompanha o [atleta]: lê o relatório, define o próximo foco e fala com vocês."',
      'Avanço 2, apontando o selo "O seu plano": "O ritmo da parte humana depende do plano. No Scout PRO, o relatório do analista de performance a cada 15 dias. Na Assessoria PRO, o estrategista de carreiras liga toda semana. No Legacy, o estrategista de carreiras e o gerente de carreira ficam de perto, todo dia."',
      'Apontando o centro, onde está a foto dele: "A IA e a equipe, em volta do [atleta]."',
      'Ponte: "Isso é o acompanhamento. Agora, pra onde ele leva o perfil do [atleta]."'
    ],
    perguntas: ['Hoje, quem acompanha o jogo do [atleta] entre uma peneira e outra?'],
    crm: ['Quem acompanha o atleta hoje, com as palavras da família.'],
    atencao: 'Só a IA fica ligada 24 horas. Nunca diga que tem uma pessoa de plantão 24 horas por dia nem "24/7" pro acompanhamento humano: a parte humana segue o ritmo do plano. O dono pediu "agente humano 24/7"; só depois que ele confirmar que a equipe entrega isso, a tela e esta fala mudam. O selo "O seu plano" segue a ficha: confira o plano antes da call. O "todo dia" e o gerente de carreira de perto são do Legacy: não atribua ao PRO nem ao Scout PRO. O Zyron lê o vídeo que a família envia, com autorização expressa do responsável. O nome e as iniciais lembram que a direção começa no perfil dele; não diga que alguém da equipe está com ele 24 horas.'
  },
  { nome: 'O seu lugar em campo', min: 2.5,
    fala: [
      'Olhando pro atleta, apontando o marcador em destaque: "Olha o seu lugar, [atleta]. [posição], aqui no campo."',
      '"Todo elenco tem uma lacuna. Você não precisa ser o melhor entre 22. Precisa ser encontrado por quem procura um [posição] como você."',
      '"O Zyron encontra o perfil. A gente faz a ponte, e o gerente de carreira prepara o [atleta] pra quando o clube chamar."',
      'A base, apontando a faixa de clubes: "O perfil do [atleta] é cruzado com a base do Zyron: mais de 250 clubes, aqui e lá fora. Esses dez são só o começo. E quem faz a ponte com eles é a nossa equipe."',
      'O cartão, apontando o retrato, sem ler tudo: "E esse é o teu cartão, [atleta]: o teu rosto, a tua posição, quem você é hoje. A leitura do teu jogo vem daqui a pouco."',
      'Pro atleta, e espere: "Se imagina aí?"'
    ],
    perguntas: ['[atleta], se imagina aí?'],
    crm: ['A reação do atleta ao campo, com as palavras dele.'],
    atencao: 'A peça central da exclusividade: o atleta se vê dentro do jogo, na posição dele, com o nome dele. O campo sai da posição da ficha: sem posição reconhecida, ele aparece sem destaque, com "O seu lugar entra aqui." Preencha antes da call, e pé e altura, se tiver, pro cartão. A formação é ilustrativa: nenhum jogador, escudo ou clube escalado. A lacuna é a ideia, não um fato sobre um clube: nunca diga que existe vaga num clube específico, nem prometa clube, prazo ou contrato. O cartão mostra só o que está na ficha: sem nota, sem atributo, sem porcentagem. A leitura do jogo é do 17, dita ao vivo. Se perguntarem qual clube: "Isso depende do perfil dele e de como ele evolui; é o que o gerente de carreira acompanha com vocês." Fale de rede e de encaixe, nunca de "vaga garantida". A foto no cartão não mede nada: não comente físico, altura ou aparência como vantagem.'
  },
  { nome: 'O campo: olhômetro × IA', min: 1.5,
    fala: [
      'Ponte: "Deixa eu mostrar a diferença de um jeito simples. Isto é um campo, 22 jogadores e uma bola."',
      'Ao abrir, o olhômetro: "Isso é o olhômetro: a atenção de quem avalia segue a bola. Repara no foco laranja: ele chega atrasado e só ilumina quem está perto. O número aqui diz quantos dos 22 estão sendo vistos agora. Os outros ninguém viu."',
      'Pergunta, e espere: "Quantos dos 22 você acha que um avaliador consegue olhar de uma vez?"',
      'Clique no botão "Inteligência artificial" (ou peça pro [atleta] clicar), a IA: "Agora a inteligência artificial: os 22 acompanhados do primeiro ao último minuto. Cada atleta é identificado e medido, não só quem está com a bola."',
      'O veredito, que fica sempre na tela: "O problema nunca foi o talento. Sempre foi o método."',
      'Ponte: "Por isso o jogo do [atleta] precisa ser lido por inteiro: todo lance, não só os que calharam de ser vistos."'
    ],
    perguntas: ['Quantos dos 22 você acha que um avaliador consegue olhar de uma vez?'],
    crm: ['A reação da família ao campo, com as palavras dela: se reconheceu a peneira.'],
    atencao: 'A animação é uma ILUSTRAÇÃO (trazida da página /institucional): formação genérica, nenhum jogador, escudo ou clube escalado. O número do contador é só da demonstração, não é dado do [atleta]; a tela não mostra velocidade nem desempenho de ninguém. O laranja é só do olhômetro. O "nunca foi o talento" é sobre o método: não vire elogio ao atleta ("especial", "único", "o melhor"), e não chame o avaliador de incompetente: o limite é humano, não pessoal. As peneiras a família já contou no 03: não pergunte de novo. Se a animação travar no Meet, abra o deck com ?bloco=estatico no fim do endereço (campo parado, mesma mensagem). Slide opcional (painel).'
  },
  { nome: 'O encaixe: não precisa ser o próximo Neymar', min: 1.5,
    fala: [
      'Em voz alta, devagar: "Você não precisa ser o próximo Neymar." Pausa. "Precisa ser o atleta que um clube está procurando."',
      'Avanço 1, o desenho em areia abre no radar: "A IA coleta: cada lance vira dado, dez indicadores do jogo do [atleta]. Este radar é um exemplo ilustrativo, não é dele."',
      'Avanço 2, o contorno branco se desenha: "O perfil encontra o clube: as características são cruzadas com o que cada clube da nossa rede precisa. O contorno branco é o que o clube procura. Quando o desenho se encaixa, aparece o encaixe."',
      'Avanço 3: "E a gente conecta: o perfil do [atleta] é encaminhado a clubes que procuram esse perfil. Quem decide é o clube."',
      'Avanço 4, o fecho: "O encaixe é método. Não é sorte."'
    ],
    perguntas: ['O [atleta] sabe que tipo de jogador os clubes da posição dele procuram hoje?'],
    crm: ['Se a família achava que precisava ser craque pra chegar, com as palavras dela.'],
    atencao: 'O radar é ILUSTRATIVO, com valores fictícios, e a tela não diz mais isso (pedido do dono, 18/10/2026; se perguntarem, é um exemplo): não é do atleta e não tem nome, nota nem percentual. "Encaixe" é a ideia, não um fato sobre um clube: nunca diga que um clube específico procura o [atleta], que existe vaga, nem prometa clube, prazo ou contrato; diga "clubes que procuram esse perfil" e "quem decide é o clube". O Neymar é só contraste: não compare o [atleta] a nenhum jogador nem diga que ele "pode chegar lá". Não use "certo" como garantia ("o clube certo"). Complementa o 12 (o seu lugar em campo): lá o atleta se vê no campo, aqui o perfil dele encontra o que o clube procura. Slide opcional (painel).'
  },
  { nome: 'Olhômetro × Zyron', min: 1,
    fala: [
      'Feche a coluna do 03: "Lembra da coluna vazia? Aqui ela tá preenchida." Leia linha por linha, o olhômetro e depois o Zyron: "Os lances que calharem de ser vistos, contra todos os lances do vídeo. Atenção dividida entre 22, contra só em você. A memória do avaliador, contra um relatório com a evidência em vídeo. \'A gente te liga\', contra o acompanhamento da tua evolução. Um clube, num dia, contra quem procura o teu perfil."',
      'O título, em voz alta: "O olhômetro olha. O Zyron mede."',
      'Fecho: "Os grandes clubes já escolhem jogador com dados há anos, por dentro. Agora essa leitura joga do lado do [atleta]."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'A mesma tabela do 03, na mesma ordem: a família reconhece as linhas e vê a resposta encaixar. Não cite nome de clube como exemplo de quem usa dados. As peneiras a família já contou no 03: não pergunte de novo. Aqui fique só na análise: o slide 16 volta ao olhômetro pelo lado do serviço inteiro.'
  },
  { nome: 'O que ninguém mais tem', min: 2,
    fala: [
      'Volte ao olhômetro do 03, agora pelo serviço inteiro: "Vocês já me contaram como foi nas peneiras. Agora olha o resto: quem acompanha, quem leva aos clubes e quem corre o risco."',
      'Linha por linha: "Na peneira, quem analisa é um avaliador em vinte minutos. Aqui, é o Zyron, com dados reais do jogo dele. Hoje, com inteligência artificial, os clubes estão cada vez mais escolhendo atleta assim."',
      '"Depois da peneira, ninguém acompanha. Aqui, o gerente de carreira olha pra ele todo dia."',
      '"Na peneira, quem leva ele pros clubes são vocês, torcendo pra alguém olhar. Aqui, somos nós, com mais de 250 clubes na rede e a AGN Football."',
      '"E o risco: na peneira, é todo de vocês. Aqui, a gente só ganha quando ele fecha."',
      'A virada, pro atleta: "[atleta], o olhômetro pode não ter te visto. O Zyron viu. Se não tivesse visto, você não estaria nessa conversa."',
      'Pro atleta (6.3), com o Legacy na ficha: "Gerente de carreira todo dia e um agente só teu. Isso é estrutura de atleta profissional. Você vai começar a viver como um."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Depois do olhômetro (03) e do bloco do Zyron (05 a 15), use este slide como resumo do serviço inteiro: passe rápido por "quem analisa", que o 03 e o 15 já mostraram, e demore em quem acompanha, quem leva aos clubes e quem corre o risco. Este slide desarma três objeções antes de aparecerem: "já tentamos peneira", "isso de IA funciona?" e "vou ver outras opções". As peneiras a família já contou no 03: use os números dela, sem perguntar de novo. Termine na virada: a peneira que não viu ele vira prova de que o problema não era ele. A coluna "Com a gente" é a estrutura completa, a da Assessoria de Elite Legacy. Com o PRO ou o Scout PRO na ficha, fale da estrutura, não do plano: gerente de carreira todo dia e a ida aos clubes são do Legacy. O 33 volta a estas linhas, plano por plano.'
  },
  { nome: 'IA na Prática', min: 5,
    fala: [
      'Com o vídeo dele no painel, a tela mostra o jogo dele lance a lance. Ponte, logo depois do 16: "Agora eu quero que vocês vejam o jogo do [atleta] como ninguém olhou até hoje: lance a lance."',
      'Olhando pro atleta: "[atleta], presta atenção: o que aparece agora é só seu." Dê o play (espaço ou o botão; o vídeo começa mudo e o Som liga o áudio) e fique quieto.',
      'Um avanço por vez, uma frase por avanço. Avanço 1, a linha do tempo e os lances: "Na peneira, o olhômetro viu vinte minutos de coletivo. Aqui é cada lance do vídeo, com o minuto e o porquê." Se o painel diz "uma seleção de lances", troque por "aqui são os lances que a gente marcou, com o minuto e o porquê".',
      'Avanço 2, a rosca e os pontos fortes: leia o número da rosca como está na tela e os pontos fortes, sem inflar nada.',
      'Avanço 3, as prioridades e o primeiro foco: "E aqui é o que a gente treina primeiro. Não é defeito: é o caminho."',
      'Peça pra família escolher um lance da lista e comente esse. No apresentador, os lances são capítulos: clique e o vídeo pula pra ele, 2 s antes.',
      'A fonte, sempre como o painel diz: com "Leitura do Zyron", "o Zyron leu o teu vídeo"; com "Leitura da equipe", "a nossa equipe leu o teu vídeo, lance a lance", e o Zyron não entra nessa frase.',
      'Fecho, apontando a frase de baixo: "Isso existe porque o [atleta] mandou este vídeo. Outro vídeo, outro relatório. A cada vídeo novo, um relatório novo."',
      'Sem vídeo no painel, a tela é a leitura ao vivo de sempre: "Eu falei que o Zyron viu. Agora eu quero que vocês vejam com os próprios olhos o jogo do [atleta] do jeito que o Zyron vê. Ao vivo, aqui na nossa chamada." Antes do play: "[atleta], presta atenção: o que aparecer agora fala só de você." Troque o compartilhamento do Meet pro vídeo do [atleta], rode a leitura na frente da família e fique quieto. O resultado é dito ao vivo, por quem conduz a leitura; o slide não antecipa nada.',
      'Com "Tenho o vídeo do jogador" ligado no painel e sem lances marcados, a tela é a leitura ao vivo, e ela vira a ponte: "Agora vocês vão ver o jogo do [atleta] do jeito que a IA leu." Não rode a leitura no Meet: avance pro 18 (o dossiê do atleta), onde o vídeo analisado entra.'
    ],
    silencio: '"[pai], [mãe], o que vocês sentiram vendo o jogo dele lido assim?" E pare. Deixe a família falar primeiro.',
    perguntas: ['[atleta], alguém já tinha olhado o teu jogo desse jeito?', '[pai], [mãe], o que vocês sentiram vendo o jogo dele lido assim?', 'Qual lance vocês querem que eu comente?'],
    crm: ['Reação do atleta e da família à leitura, com as palavras deles.', 'O lance que a família escolheu e o que disseram dele.'],
    atencao: 'Com vídeo no painel, o slide só mostra o que o painel guardou, na fonte que o painel diz (Zyron ou Equipe). Não diga nada que os lances e os textos não mostram: nada de nota geral, ranking, percentil ou comparação com outros atletas. Com "Leitura da equipe", nada na sua fala atribui a leitura ao Zyron. A rosca é só a conta dos lances marcados: leia pontos fortes e prioridades, os dois, sem inflar. O relatório da call é deste vídeo: não prometa que é o relatório do plano (o plano entrega a leitura de cada vídeo novo, no ritmo dele). Privacidade: vídeo de menor, só com a autorização do responsável registrada no painel, só pelo link da apresentação dele, e ele sai do ar sozinho 24 horas depois do envio (o painel renova por mais 24); nunca mostre o vídeo de um atleta a quem não é da família dele. Sem vídeo no painel, com o painel fora do ar ou com o vídeo que não carrega, o slide volta sozinho pra leitura ao vivo (o apresentador avisa) e vale a regra de sempre: o slide não mostra resultado, quem fala é quem conduz a leitura, ao vivo, no Meet. Teste antes da call: play, som e pular pelos lances. Vem logo depois do 16 de propósito: a virada "o olhômetro pode não ter visto você" vira prova na hora, com o jogo dele. Depois da pergunta, o silêncio: aperte S (aqui conta sem trocar de slide).'
  },
  { nome: 'O dossiê do atleta', min: 3,
    fala: [
      'Ponte, logo depois do 17: "[atleta], agora é o teu jogo na tela, do jeito que nenhum avaliador parou pra olhar."',
      'Com o vídeo analisado na tela ("Tenho o vídeo do jogador" ligado no painel): dê o play (espaço ou o botão; o vídeo começa mudo e o Som liga o áudio) e deixe a análise falar. Depois do vídeo: "Isso aqui é o teu jogo lido pela IA. Ninguém numa peneira para pra fazer isso."',
      'O mapa de calor, embaixo do vídeo (ou ao lado, com o vídeo em pé), se estiver na tela. O da lista do painel, que a tela chama "onde atua um [posição]", é o mapa típico da posição: "Esse é o mapa de onde atua um [posição]: é nessa faixa do campo que um clube procura esse perfil." Só o mapa enviado como imagem antes de 20/10, que a tela chama "onde o seu jogo acontece", é do jogo dele: "E esse é o teu mapa de calor."',
      'As oportunidades, à direita: "Aqui estão clubes que procuram um perfil como o teu, mapeados pela nossa equipe a partir do teu jogo: [oportunidades]. Quem decide é o clube. O nosso trabalho é colocar o teu perfil na frente de quem procura."',
      'O plano de carreira, embaixo das oportunidades: "E o caminho é este: agora, a leitura e o primeiro foco; depois, a vitrine; e o destino é o teu: [sonho]."',
      'Pro atleta, olhando pra ele: "[atleta], em algum lugar tem um clube precisando de um jogador exatamente como você. A gente vai trabalhar pra colocar o teu jogo na frente dele."'
    ],
    perguntas: ['[atleta], qual dessas oportunidades mais mexeu com você?', '[pai], [mãe], vocês já tinham visto o jogo dele lido desse jeito?'],
    crm: ['A oportunidade que mais animou o atleta e a reação da família ao vídeo analisado e ao mapa, com as palavras deles.'],
    atencao: 'Só aparece com "Tenho o vídeo do jogador" ligado no painel (o vídeo analisado ou o mapa de calor) ou com oportunidades preenchidas; sem nada disso, as setas passam direto. Com o vídeo analisado e sem lances marcados, o 17 é a ponte e o vídeo entra aqui. As oportunidades são clubes que a equipe mapeou pro perfil: nunca diga que o clube já pediu o [atleta], que existe vaga, nem prometa clube, prazo ou contrato; diga "clubes que procuram esse perfil" e "quem decide é o clube". No Scout PRO, o encaminhamento pra clubes vem a partir da Assessoria PRO: fale da estrutura, não do plano. Leia o vídeo como ele é: não acrescente nota, ranking ou comparação que a análise não mostra. Vídeo de menor: só com a autorização do responsável registrada no painel. Teste antes da call: play, som e o mapa. O mapa de calor da lista do painel é referência da posição, não dado do jogo dele (a tela diz "onde atua um [posição]"): nunca diga "o teu mapa", nem leia a mancha como o que ele fez.'
  },
  { nome: 'O inimigo em comum', min: 2,
    fala: [
      'Direto, olhando pra família: "[pai], [mãe], deixa eu dizer uma coisa que pouca gente fala: o [atleta] não foi mal nas peneiras por falta de talento. Foi falta de quem olhasse."',
      '"Numa peneira, é um avaliador pra vinte e dois em campo. Ele olha quem está perto da bola, em vinte minutos de coletivo. O lance que ele não viu, pra ele, não existiu. E a resposta vem sempre igual: a gente te liga."',
      'A frase do meio, devagar: "Em algum lugar, em algum time, tem alguém precisando de um jogador exatamente como o [atleta]. Só não era quem estava na beira daquele campo."',
      'O quadro da direita, com os números do painel: "Vocês me contaram: [nº de peneiras], [gasto com peneiras] e [anos tentando] nisso. E cada peneira que passa é tempo de base que não volta." Sem os números, leia o quadro: a inscrição, a viagem, o dia de trabalho, os meses esperando uma resposta.',
      'Fecho: "Por isso a peneira não deu certo. O problema nunca foi o jogo dele. É por isso que a gente não deixa o jogo dele na mão de um olhômetro."'
    ],
    perguntas: ['Quantas peneiras ele já fez? E quanto vocês já gastaram com isso, somando viagem e tudo?', 'Quanto tempo mais vocês querem procurar no escuro?'],
    crm: ['As peneiras, o gasto e o tempo que a família contou, com as palavras deles (anote no painel, em As peneiras dele).'],
    atencao: 'O inimigo é o método, o olhômetro: nunca uma pessoa, um avaliador pelo nome, um clube ou um concorrente. Os números do quadro vêm do painel (peneiras, gasto e anos tentando) e são os que a família contou: não arredonde pra cima, não aumente e não invente estatística do mercado; vazio, o quadro mostra a conta sem números. Não diga que o [atleta] seria aprovado se tivesse sido visto: diga que ele não foi visto. Depois da pergunta, espere a resposta.'
  },
  { nome: 'Depoimento de uma mãe', min: 1,
    fala: [
      'Ponte, apontando a frase da tela: "A gente não vende vaga, a gente escolhe atleta. E antes de seguir, eu quero que vocês escutem o depoimento de uma mãe. São 37 segundos."',
      'Dê o play (espaço no deck, o botão do áudio na tela ou "Tocar do início" no apresentador) e fique em silêncio até o fim.',
      'Quando o áudio terminar, pergunte e espere: "[responsável], o que você sentiu ouvindo ela?" Deixe a família falar. Não explique nem complete o que a mãe disse.'
    ],
    perguntas: ['O que você sentiu ouvindo ela?'],
    crm: ['A reação da família ao depoimento, com as palavras deles.'],
    atencao: 'É o mesmo áudio que a R1 usava. Se a família já ouviu, lembre ("lembram da mãe que vocês ouviram na primeira conversa?") e toque de novo só se o clima pedir; se um decisor não ouviu, toque inteiro. Áudio: compartilhe a guia do deck com áudio (no Chrome, marque "Compartilhar áudio da guia") e teste antes da call. Não fale por cima do depoimento. Não diga o nome da mãe nem do filho, nem resultado, clube ou valor que não estejam no próprio áudio: o depoimento fala por si. Se não tocar ou a família não ouvir, siga sem ele e não tente resumir o que ela diz. O rodapé "10 atletas por turma" só aparece com o Legacy na ficha: a turma é dele.'
  },
  { nome: 'Nem tudo é talento', min: 2,
    fala: [
      '"E por que dá certo? Porque nem tudo é talento. Tem muito menino bom parado em casa porque o olhômetro não viu e ninguém levou ele até o clube certo, na hora certa."',
      'Eficiência: "Mais de 93% dos nossos atletas são encaminhados pra clubes em até três meses. Não é sorte: é o Zyron cruzando o jogo dele com o que cada clube precisa, e a nossa rede de mais de 250 clubes."',
      'Conexões: "Só no último mês, foram mais de 75 atletas encaminhados. Clube que recebe jogador nosso volta pedindo mais. É relação de anos: mais de dez anos e centenas de atletas revelados."',
      'Pro atleta: "[atleta], talento você já tem. Se não tivesse, não estaria aqui. O problema nunca foi você: foi o olhômetro. O resto, a conexão, o clube certo, a hora certa, é com a gente."'
    ],
    perguntas: ['Faz sentido pra vocês que o que faltou até agora não foi talento?'],
    crm: [],
    atencao: 'Encaminhar é apresentar o atleta a clubes da rede que precisam do perfil dele. Não é contrato: nunca troque as palavras. Se perguntarem "e depois do encaminhamento?", é o jogo dele, com o gerente de carreira preparando todo dia. Responde "quanto tempo demora?" e "ele é bom o suficiente?" antes da pergunta.'
  },
  { nome: 'AGN Football', min: 2,
    fala: [
      '"E quando dá certo, é aqui que aparece. A gente tem relação direta com a AGN Football, o canal que o mercado do futebol olha pra ver quem tá fechando. Não é só divulgação: é lá que estão publicados os atletas nossos que foram pra clubes do Brasil, da América do Sul e da Europa."',
      'Aponte na tela: "Olha o Joãozinho, assinando com o Grêmio. O Kaio fechou com o Internacional. E não são só eles."',
      'O espelho, com o caso da ficha: "[atleta], lembra que eu falei que você me lembrou um atleta nosso? É o [caso]. Mesmo perfil que o teu. Ele fechou com o [clube do caso], [país do caso]. Tá publicado na AGN, te mando agora." Mande na hora: [link do caso]',
      '"Quando o [atleta] fechar, é lá que ele aparece. Esse último quadro é dele."',
      'Mande o link da AGN no WhatsApp: "Abre aí enquanto a gente conversa." [link AGN]',
      'Avanço (→ ou espaço): a arte dos jogadores que passaram pela AGN entra grande na tela. "E pra vocês terem noção do nível: esses são jogadores que passaram pela AGN Football. É nesse mesmo canal que estão publicados os atletas nossos que fecharam."',
      '"Não precisa acreditar em mim: vocês conferem no link que eu acabei de mandar."'
    ],
    perguntas: ['[atleta], se imagina aí, do lado deles?', '[atleta], conhece algum desses jogadores?'],
    crm: [],
    atencao: 'Como ser sagaz com o espelho: fale como quem acabou de perceber, não como quem leu. Plante no 02 ("você me lembrou um atleta nosso"), revele aqui com nome, clube e link, e retome no 31 ("igual o [caso]") e no 35. Escolha o perfil mais parecido em posição, idade e nível, na tabela do CASOS.md ou nos publicados da AGN: é a semelhança que faz o atleta se enxergar ali. Só caso real e nosso: a família abre o link na hora, e um caso inventado derruba a venda e a empresa. Quanto mais nomes, com o link de cada um, mais a família entende que não é sorte, é método (20). A AGN divulga: não diga que ela contrata ou garante clube. A arte do avanço mostra jogadores que passaram pela AGN, não atletas da Jogador de Elite: nunca diga que são nossos e não cite clube, valor ou história de nenhum deles além do que está na tela. Se a família reconhecer alguém, deixe ela falar.'
  },
  { nome: 'A rede', min: 2,
    fala: [
      'Ponte: "Agora, pra onde isso leva. A gente encaminha o perfil do [atleta] a quem decide, com vídeo e relatório na mão, e organiza a ida quando o clube chamar. Quem decide é o clube: o nosso trabalho é fazer o [atleta] chegar bem preparado."',
      'Apontando o selo com a foto dele: na Assessoria PRO e no Legacy, "o perfil do [atleta] fica pronto pra encaminhar"; no Scout PRO, "o perfil do [atleta] está aqui, e o encaminhamento começa na Assessoria PRO".',
      'Avanço 1, a AGN: "A AGN Football é uma agência de atletas, no Brasil e no exterior, administrada por quem tem 25 anos de gestão de atletas. A gente tem relação direta com eles." Mande o [link AGN] no WhatsApp e diga que o site é agnfootball.com.',
      'Avanço 2, os clubes: "A nossa rede tem mais de 250 clubes, e no último mês foram mais de 75 encaminhamentos." Só esses dois números, os da casa.',
      'Avanço 3, o David: "O David Willer é o rosto da casa, e a casa está há mais de dez anos nisso, com centenas de atletas revelados." No Legacy: "Aqui tem assessoria individual com o David todo mês e acompanhamento direto com ele no WhatsApp." Se perguntarem o que o David já fez, responda só o que o dono confirmou e anote a pergunta.',
      'A linha do plano, lida uma vez: Legacy, conexão direta com clubes e AGN, assessoria individual com o David todo mês e pelo menos 15 encaminhamentos de oportunidades por mês; Assessoria PRO, pelo menos 5 por mês, pra clubes do Brasil e do mundo; Scout PRO, o começo, com o encaminhamento a partir da PRO.',
      'Sem promessa: "Eu não prometo clube, porque quem decide é o clube. O que a gente faz é o trabalho: o perfil dele chega a quem decide, com vídeo e relatório, e a gente viabiliza a ida."'
    ],
    perguntas: ['Vocês já conheciam a AGN Football? Quer que eu mande o link agora?'],
    crm: ['Se a família abriu o link da AGN e o que comentou.'],
    atencao: 'O site da AGN (agnfootball.com) descreve a AGN como uma agência que administra a carreira de atletas, administrada por Augusto Nogueira e Matheus Assaf; o Augusto tem 25 anos de gestão de atletas. O site NÃO cita o David nem a Jogador de Elite: a relação direta é da casa, não do site, e não achei informação pública sobre o David, então não invente currículo dele: o cargo dele nunca foi definido, diga "o David" e use só os números da casa. A nota legal do rodapé (não há promessa de contratação ou de clube específico) fica na tela. Não diga que a AGN representa o [atleta], que vai publicar ou contratar: nenhuma vinculação a clube ou atleta é oferecida (a nota legal está no rodapé). Nomes de craques que o site cita como revelados pelo Augusto (Alexandre Pato, Luiz Adriano e Emerson da Rosa) só em resposta a pergunta, atribuídos ao site, nunca como nossos. A conexão direta com clubes e AGN, os 15 encaminhamentos por mês e o David de perto são do Legacy; o PRO encaminha pelo menos 5 por mês; o Scout PRO não encaminha. Não use "garantido", "certo" nem "vai chegar": diga "encaminhamos" e "viabilizamos". "Pronto pra encaminhar" é sobre o perfil montado, nunca promessa de clube ou contrato.'
  },
  { nome: '326 atletas enviados', min: 1,
    fala: [
      'Ponte, depois da rede: "E isso não é teoria. A casa já enviou 326 atletas." Aponte o número subindo.',
      '"Cada um tem nome, posição e clube de destino, e está tudo registrado no nosso Instagram, o @assessoria.voxen. Vocês podem conferir depois da call."',
      'A palavra: "Enviado é o que a gente fez: o perfil chegou ao clube. Quem contrata é o clube."'
    ],
    perguntas: ['Vocês já conheciam o nosso Instagram? Quer que eu mande o link pelo WhatsApp?'],
    crm: ['Se a família abriu o Instagram e o que comentou.'],
    atencao: 'O 326 é número da casa, confirmado pelo dono, e a palavra é "enviados", como na arte: nunca "contratados" nem "colocados em clube" ("encaminhado" não é "contratado"). Não diga que cada um dos 326 foi contratado, nem cite atleta ou clube como resultado a esperar. A arte é a publicada no Instagram da casa. Se perguntarem quem é o homem da foto, responda só o que o dono confirmou e anote a pergunta; não invente currículo. O link do Instagram vai pelo WhatsApp, nunca no slide. Slide opcional (painel).'
  },
  { nome: 'Clubes e parceiros', min: 1,
    fala: [
      'Apontando as faixas que rolam: "A rede, na prática: do Sul ao Nordeste aqui no Brasil, e da Inglaterra ao Canadá lá fora. Nesta faixa o Brasil, nesta o mundo. São clubes onde atletas nossos estiveram e clubes da nossa base."',
      'A nota, sem pressa: "Os escudos mostram a rede da casa. Isso não quer dizer que o clube usa o Zyron, nem que tem vaga."',
      'Os parceiros: "E as marcas que caminham com a gente, como parceiros comerciais: Adidas, Nike, Cloudflare, AWS e a A.E.K. London."',
      'Ponte: "O que importa é que o perfil do [atleta] chega a quem decide, com vídeo e relatório."'
    ],
    perguntas: ['Algum desses clubes vocês já conheciam?'],
    crm: ['Quais clubes a família reconheceu, com as palavras dela.'],
    atencao: 'Slide de REDE, não de resultado (trazido da página /institucional). Os escudos e marcas são dos titulares, e a nota legal fica na tela: a fala nunca diz que o clube usa dados ou o Zyron, que patrocina, que tem vaga, nem que o [atleta] vai pra algum deles. Os parceiros comerciais (Adidas, Nike, Cloudflare, AWS Amazon, A.E.K. London) têm acordo comercial confirmado pelo dono; diga só "parceiros comerciais". Se perguntarem do acordo, responda só o que o dono confirmou e anote a pergunta. Se algum clube pedir pra sair da faixa, avise o dono. Slide opcional (painel).'
  },
  { nome: 'Cada rosto, uma história', min: 0.5,
    fala: [
      'Deixe a imagem falar por uns segundos, com os rostos aparecendo: "Cada rosto aqui é um atleta que a gente acompanhou: no campo, no aeroporto, na assinatura. Uma história cada um."',
      '"O arquivo completo está no Instagram, @assessoria.voxen."',
      'Ponte: "Agora, o que o [atleta] leva a partir de hoje."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'São fotos de outros atletas da casa, do arquivo publicado no Instagram da própria casa. Mostre como arquivo, não como promessa: nunca diga que o [atleta] terá o mesmo caminho de alguém da foto, nem aponte um atleta pelo rosto ou diga "esse aqui foi pro [clube]". Se a família for sensível a foto de menores, passe direto: o slide é opcional no painel e a apresentação segue pro "O que ele leva".'
  },
  { nome: 'O que ele leva', min: 1.5,
    fala: [
      'Ponte, logo depois da rede, olhando pro atleta: "[atleta], antes de falar de valor, deixa eu juntar numa tela só o que é teu a partir de hoje." Um avanço por linha (→ ou espaço), uma frase por linha.',
      'IA: "O Zyron lê cada lance do teu vídeo, ligado 24 horas."',
      'Gente, do plano da ficha: no Scout PRO, "um analista de performance olha o teu jogo a cada 15 dias"; na Assessoria PRO, "o teu estrategista de carreiras liga toda semana"; no Legacy, "estrategista e gerente de carreira do teu lado, todo dia".',
      'Conexões: no Legacy, "relação direta com a AGN Football e mais de 250 clubes"; na Assessoria PRO, "o teu perfil encaminhado a clubes do Brasil e do mundo"; no Scout PRO, "isso vem a partir da Assessoria PRO".',
      'Oportunidades: no Legacy, "pelo menos 15 encaminhamentos de oportunidades por mês"; na Assessoria PRO, "pelo menos 5 por mês"; no Scout PRO, "a partir da Assessoria PRO".',
      'Tempo, lendo a linha da tela (ela sai dos prazos que a equipe cumpre, escolhidos no painel): "Vocês não esperam no escuro." Só no Legacy: "Em até 3 meses, mais de 93% dos nossos já estão encaminhados a clubes. É a referência dos atletas que a gente acompanha, não prazo de contrato."',
      'Fecho, apontando o retrato: "Isso é do [atleta]. Agora pensa comigo: quanto custaria montar isso por conta?" E avance.'
    ],
    perguntas: ['Desses cinco, qual pesa mais pra vocês hoje?'],
    crm: ['O que a família disse que pesa mais (IA, gente, conexões, oportunidades ou tempo), com as palavras deles.'],
    atencao: 'Junta numa tela só, com o rosto e o nome dele, o que ele leva no plano da ficha: cada linha muda com o plano. Diga só o que está na tela: no Scout PRO, conexões e oportunidades começam na Assessoria PRO. Só a IA fica ligada 24 horas; a parte humana segue o ritmo do plano. O tempo é o que a casa controla (contato e começo do Zyron, da lista fixa de prazos) e, só no Legacy, a referência dos 93% em até 3 meses, com a legenda na tela: nunca prazo de contrato, clube ou renda pra ele. A garantia não entra nesta tela (desde 20/10/2026, pelo pedido de um closer: a garantia só no slide dela): ela vem no 34, depois do número. Se perguntarem aqui, diga que já chega lá. O retrato é o que a família autorizou: não comente a foto nem a aparência dele, fale do plano. Vem antes do "quanto custaria montar isso por conta?" de propósito: o "isso" já está na tela, com o nome dele.'
  },
  { nome: 'O valor real', min: 3.5,
    fala: [
      'Régua (07): "Vocês já investiram [investido] nesse sonho, e ele continua sem ser visto por quem decide."',
      'A tela abre só com a pergunta: "Agora pensa comigo: quanto custaria montar isso por conta?" Espere. Deixe a família chutar um número.',
      'Um avanço por frente (→ ou espaço), falando o nome e o valor anual: "Performance e desenvolvimento atlético: R$ 6.500 por ano." / "Análise de dados e inteligência, o Zyron: R$ 5.000." / "Psicologia esportiva: R$ 2.500." / "Nutrição: R$ 3.000." / "Comportamento: R$ 3.500." / "Imagem e posicionamento: R$ 3.000." / "Acompanhamento e direcionamento: R$ 6.500."',
      'A soma da direita sobe a cada frente (6.500, 11.500, 14.000, 17.000, 20.500, 23.500 e 30.000). Aponte o número subindo, sem pressa: "Já tá em R$ 14.000 por ano, e ainda falta coisa."',
      'Último avanço, o total em destaque, com tudo na tela: "Somando, montar isso por conta custa R$ 30.000 por ano."',
      'Sem certeza: "E mesmo pagando tudo isso, ele ia continuar dependendo do olhômetro de um avaliador de peneira. Ninguém garante que ele seria encaminhado, e nenhum deles tem o Zyron, nem a rede de clubes, nem a AGN."',
      'Versão mais emocional, se o clima pedir: "Vocês gastariam muito mais se precisassem fazer por conta própria. A gente tem a fórmula e tem o potencial do [atleta]."'
    ],
    perguntas: ['Quanto vocês acham que custaria montar isso por conta?'],
    crm: [],
    atencao: 'O slide abre só com a pergunta: espere o chute da família antes do primeiro avanço. Cada avanço mostra uma frente com o valor anual, e a soma da direita sobe junto; o último avanço destaca o total, R$ 30.000 por ano, com tudo junto. O apresentador mostra o que entra no próximo avanço. Ordem do playbook: régua, conta, sem certeza (este slide), até lá e filtro (29 e 30), contrato (31), a vaga (32), os planos e o número (33), silêncio e a garantia (34). Aqui é o valor da estrutura inteira, a do Legacy, não o preço de um plano. Previne "o valor tá muito alto".'
  },
  { nome: 'Até lá, a gente investe', min: 2,
    fala: [
      '"Até lá, quem investe no [atleta] somos nós. Tempo: o gerente de carreira olhando pra ele todo dia. Esforço: contato com clube, vídeo, avaliação, a ida pro clube. Profissionais: as sete frentes. Tecnologia: o Zyron."',
      '"O que vocês investem é só o custo mínimo pra essa estrutura existir, com o gerente de carreira e os profissionais dedicados a ele. O resto é investimento nosso, porque a gente acredita nele."',
      'Esforço zero (6.6): "E a partir de agora isso não é mais um peso de vocês. Vocês não precisam aprender nada novo, não precisam mudar a rotina, não precisam sair correndo atrás de clube. A única coisa que fica com vocês é continuar apoiando o [atleta] em casa."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Resposta pronta pro "mas vocês não ganham no contrato? Por que cobram?": o lucro vem do contrato; isso aqui é o custo mínimo da estrutura até o contrato sair. Nunca fale "onboarding", "etapas", "acessos": é promessa pro pai e pra mãe, não fluxo de produto. Aqui é a estrutura inteira, a do Legacy. Com o PRO ou o Scout PRO na ficha, não prometa ao plano o gerente de carreira todo dia; Os sete módulos de formação já estão no Scout PRO. O acompanhamento humano e os encaminhamentos seguem o escopo de cada plano. O 33 mostra o que cada plano entrega.'
  },
  { nome: 'Não é pra qualquer um', min: 3,
    fala: [
      '"E esse custo só existe pra quem passou no filtro. Chega muito vídeo e muito cadastro, o Zyron analisa, a equipe aprova. O [atleta] passou."',
      '"Pra quem não passa, não tem preço: não tem vaga. Eu não falo com toda família. Se vocês estão aqui, é porque ele tem o que é preciso."',
      'Só com o Legacy na ficha, a turma da tela: "A turma fecha em 10, porque é o máximo que o gerente de carreira acompanha de perto, todo dia."',
      '"A gente só investe em quem acredita que vai chegar."',
      'Escada do sim (6.1), um avanço por degrau, sempre depois do sim do degrau anterior: "[atleta], você quer ser jogador profissional?" Espere. Avance. "Você tá disposto a pagar o preço da disciplina? Treinar, cumprir o que o teu gerente de carreira passar?" Espere. Avance. "[pai], [mãe], vocês apoiam ele nisso, mesmo quando for difícil?"'
    ],
    perguntas: ['[atleta], você quer ser jogador profissional?', 'Tá disposto a pagar o preço da disciplina?', 'Vocês apoiam ele, mesmo quando for difícil?'],
    crm: [],
    atencao: 'A família tem que sentir que está sendo avaliada, não vendida (03). O sim do atleta na frente dos pais pesa mais que qualquer argumento. Pergunte, não mande; se o atleta hesitar, volte pro sonho dele, nunca pressione. Previne "e se ele for dos que não chegam lá?". A tela mostra os três degraus, um por avanço, só com a pergunta: quem responde é o atleta e a família, em voz alta. A turma de 10 é do Legacy: com o PRO ou o Scout PRO na ficha, a tela não mostra turma nem a linha do gerente de carreira, e você fica no filtro.'
  },
  { nome: 'Quando a gente ganha', min: 2.5,
    fala: [
      '"E aqui é onde a gente ganha. Hoje, um atleta que a gente coloca num clube fecha ganhando por volta de [faixa] por mês, no mínimo."',
      '"É nesse momento, e só nele, que a gente lucra: sobre o contrato profissional do [atleta]. Vocês mesmos disseram pro estrategista esportivo que não faz sentido a gente lucrar em cima de vocês. E não lucra."',
      'O espelho de volta: "Foi assim com o [caso]: hoje ele tá no [clube do caso]. É esse dia que a gente espera pro [atleta]. E quando ele assinar, sai na AGN, com o nome dele."',
      'O olhômetro de volta, se a família lembrar da peneira: "Na peneira, o risco era todo de vocês. Aqui, a gente só lucra quando ele assina."',
      'Cenário (05): "[pai], o que muda na vida de vocês quando o [atleta] estiver ganhando isso?" Silêncio.',
      '"Imagina ele te ligando do clube pra contar que assinou. Qual a primeira coisa que vocês fazem?"'
    ],
    perguntas: ['O que muda na vida de vocês quando ele estiver ganhando isso?'],
    crm: [],
    atencao: 'O número é referência do que já acontece, nunca promessa: cada contrato depende do clube, da categoria e do desempenho. Depois da pergunta do "o que muda", silêncio: quem descreve o futuro em voz alta já se vê nele. Previne "por que vocês cobram?". A faixa é referência da casa, de atleta nosso que fechou, não entrega de nenhum plano. Com o Scout PRO na ficha, não diga que o plano leva a esse contrato: o encaminhamento pra clubes vem a partir da Assessoria PRO.'
  },
  { nome: 'A vaga', min: 2,
    fala: [
      'Só com o Legacy na ficha (turma e vaga na tela). Escassez, só com o número real da semana (08): "Dessa turma de 10, restam [vagas]."',
      'Início imediato, no Legacy: "Confirmando hoje, o [gerente] entra em contato com vocês, e o Zyron já começa a acompanhar o [atleta]."',
      'O relógio (9.3), no Legacy, apontando o caminho da tela: "Hoje, a vaga. Em até três meses, mais de 93% dos nossos estão encaminhados. E o dia que importa pra vocês e pra gente: a assinatura. Se decidir hoje, esse relógio começa hoje. Se decidir daqui a uma semana, o [atleta] começa uma semana depois."',
      'Com a Assessoria PRO ou o Scout PRO na ficha, a tela vira "o começo": "Confirmando hoje, a equipe entra em contato com vocês, e o Zyron começa a ler o jogo do [atleta]. A cada vídeo novo, sai um relatório novo. E o ritmo, vocês escolhem agora."',
      'Com o Legacy e o número real de vagas, apontando a vaga dele na turma, com a foto: "Essa é a vaga do [atleta]." Sem número de vagas, a foto fica ao lado do título: aponte o título, sem falar de vaga.',
      'Ponte pros planos: "Agora eu te mostro como ter isso do lado do [atleta]."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Vagas só com o número real da semana; prazo só com o prazo confirmado (campos da ficha). Turma, vagas, os 93% em até três meses e o dia da assinatura são do Legacy: com o PRO ou o Scout PRO na ficha, a tela não mostra nada disso, e a fala também não. O 33 mostra os planos com o investimento de cada um e fecha com o plano da ficha, o do número falado. A foto na vaga é pra ele se ver dentro da turma, não pra criar pressa: nada de "últimas vagas" além do número real.'
  },
  { nome: 'Os planos', min: 7,
    silencio: 'O número, uma vez, com a parcela. E silêncio: quem fala primeiro depois do preço perde.',
    fala: [
      'Ponte, sem falar de dinheiro, lendo o título: "[atleta], na peneira você ficou sozinho. Daqui pra frente, não fica mais. O que muda de um plano pro outro é quem fica do teu lado, e o acompanhamento que você recebe. O Zyron tá nos três."',
      'Um avanço por coluna (→ ou espaço). Cada coluna é a parte de um plano: o ritmo, o investimento e o que ele tem, cargo por cargo. Scout PRO: "Pra começar: o Zyron lê cada vídeo novo e aponta os teus pontos fortes e prioridades, o analista de performance manda o relatório da tua evolução, e você tem o relatório de entrada, o histórico e o guia da peneira."',
      'Assessoria PRO: "Tudo do Scout PRO, e uma equipe do teu lado toda semana: o teu estrategista de carreiras liga, você tem os sete módulos de aulas (performance, psicologia, nutrição, comportamento e imagem), conta com um estrategista esportivo, entra no networking com outros atletas e nas aulas extras, e a gestão de carreiras faz pelo menos 5 encaminhamentos de oportunidades por mês, pra clubes do Brasil e do mundo. Tudo isso por metade do Legacy."',
      'Assessoria de Elite Legacy, a coluna em destaque: "Tudo da Assessoria PRO, e o ideal, o completo: o teu estrategista de carreiras e o gerente de carreira de perto todo dia, assessoria individual com o David Willer todo mês e acompanhamento direto com ele no WhatsApp. A gestão de carreiras faz pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora, com conexão direta com clubes e com a AGN. O estrategista esportivo liga toda semana, em cima dos teus relatórios e do teu desenvolvimento, você tem um plano de carreira feito pro teu jogo, e quem corre atrás de clube, vídeo e avaliação é a gente. Nas seletivas, a gente acompanha e planeja a logística com vocês. E a turma é de 10: atenção máxima, de perto."',
      'O investimento tá no topo de cada coluna, com a parcela em destaque. Leia uma vez, apontando, sem fazer conta: "O Scout PRO fica em R$ 997, a Assessoria PRO em R$ 1.497 e o Legacy em R$ 2.997, todos vitalícios, em 10x sem juros." E volte pro ritmo.',
      'As perguntas que acertam o plano, sem falar de dinheiro: "Qual ritmo faz sentido pro [atleta]? Um relatório, alguém ligando toda semana ou alguém do lado dele todo dia?" Espere. "Vocês querem os sete módulos de aulas e um estrategista junto?" Espere. "E o David Willer de perto, com assessoria individual todo mês e as conexões e os clubes dele: é o que vocês querem agora?" Espere.',
      'Recomende um, em voz alta, com as palavras deles: "Pelo que vocês me falaram, eu recomendo o [plano]." Se a resposta apontou outro, troque o plano no apresentador antes do último avanço. Último avanço: o [plano] aparece destacado na tela, como a sua recomendação.',
      'O número, uma vez, apontando a coluna do plano destacado: "[pai], [mãe], o investimento no [plano] é de [preço], em 10x sem juros de [parcela]." E pare. Tecla S.',
      'Por que é vitalício, se perguntarem ou depois do silêncio: "É vitalício porque a gente tem certeza do nosso trabalho: vocês investem uma vez e não pagam de novo. Esse valor só custeia os profissionais parceiros que vão cuidar do [atleta]: ele paga o trabalho deles, não é o nosso lucro. O nosso lucro vem do contrato profissional." E olhando pro atleta: "[atleta], a gente só ganha se você ganhar."',
      'Depois do silêncio: "E com [garantia]."',
      'No Legacy, o completo: "Um atleta médio nosso fecha ganhando, em média, R$ 30 mil+ por mês. A parcela é uma fração de um mês de contrato, quando ele fechar." E, se o valor pesar: "É o único com o estrategista de carreiras e o gerente de carreira todo dia, assessoria individual com o David Willer todo mês e pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora."',
      'Na Assessoria PRO, a acessível, apontando a coluna: "É uma equipe do lado do [atleta] toda semana: o estrategista de carreiras, os sete módulos de aulas e pelo menos 5 encaminhamentos de oportunidades por mês, por cerca de metade do valor do Legacy."',
      'No Scout PRO, o começo: "É o jeito de começar, com o Zyron e um analista de performance olhando pro jogo dele."',
      'Por dia, do plano da tela, se o valor pesar: no Legacy, "No prazo médio de 3 meses, dá [por dia] por dia."; no PRO e no Scout PRO, "Dividido nos primeiros 3 meses, dá [por dia] por dia."',
      'Fechamento (Modo A, 08): "Confirmando hoje, eu já aviso o [gerente]. Fica melhor no Pix ou no cartão?" No PRO e no Scout PRO: "eu já aviso a equipe".',
      'Depois do "Pix ou cartão?": mande no WhatsApp o link de pagamento do [plano], na própria call, e faça o pagamento com a família na linha. O link não está no deck: tenha o de cada plano à mão.',
      'Objeção: acolha, isole e volte: "Resolvido isso, eu confirmo agora. Pix ou cartão?"',
      'Trocar de plano, pelo escopo e nunca por desconto. Pra descer: "Existe um formato mais enxuto, a Assessoria PRO, e o que muda é isto." Pra subir: "Se vocês quiserem o completo, o Legacy acrescenta isto." Use os botões de plano no apresentador: a tela do 33 troca junto, e o apresentador mostra o que sai ou o que entra. Descendo pro Scout PRO, diga em voz alta: "o encaminhamento pra clubes vem a partir da Assessoria PRO." Saindo do Legacy: "a conexão direta com clubes e AGN e os 15 encaminhamentos por mês são do Legacy; na Assessoria PRO, são pelo menos 5."',
      '"Vocês combinaram de decidir hoje, lembra? Pode ser não, tudo bem. O que tá faltando pro sim?"'
    ],
    fechaDe: 7,
    modoB: [
      '"Olha, eu não vou te vender nada hoje. Antes de abrir a vaga, eu apresento o [atleta] pro [gerente] e pra nossa equipe técnica, e são eles que decidem se ele entra nessa turma." No PRO e no Scout PRO, sem vaga nem turma: "eu apresento o [atleta] pra nossa equipe técnica, e são eles que decidem se ele entra."',
      '"Enquanto isso, conversem entre vocês e com o [atleta]. Se a equipe aprovar, vocês estão dentro?"',
      '"Amanhã até [hora] eu te dou o retorno da equipe. Fica de olho no telefone."',
      'No retorno: "[pai], boa notícia: o [gerente] e a equipe aprovaram o [atleta]. A vaga é dele até [hora]. Pra confirmar, é o investimento que eu te passei. Pix ou cartão?" No PRO e no Scout PRO: "a equipe aprovou o [atleta], e a entrada dele fica aprovada até [hora]."'
    ],
    perguntas: ['Qual ritmo faz sentido pro [atleta]? Relatório, acompanhamento semanal ou diário?', 'Vocês querem os sete módulos de aulas e um estrategista junto?', 'Vocês querem o David Willer de perto, com assessoria individual todo mês?', 'Pix ou cartão?'],
    crm: ['O ritmo que a família escolheu, com as palavras deles, e o plano que você recomendou.', 'Resultado, plano fechado e forma de pagamento.', 'Modo B: a hora do retorno e o "estamos dentro".'],
    atencao: 'O título volta ao 16 ("Sozinho, na peneira"): é a dor que a família já contou, e cada coluna responde com quem fica do lado do atleta. Deixe o título pesar um segundo antes da primeira coluna. Ao lado do ritmo, o passo do tripé do 04 (Ser visto, Ser preparado, Ser apresentado), um por degrau. O 33 mostra cada plano na sua parte, com o investimento no topo da coluna, pra família ver tudo (decisão do dono, 06/10/2026). Cada coluna é a parte de um plano: o topo com o ritmo e o investimento, embaixo o que ele acrescenta ao degrau de baixo, cargo por cargo. Não leia tudo: aponte o que muda de um degrau pro outro. O Legacy aparece em destaque, com a moldura que brilha e o rótulo "O ideal": é o completo e tem a lista mais longa. Se a ficha recomendar outro plano, fale com franqueza: "o ideal é o Legacy; pro momento de vocês, a Assessoria PRO coloca uma equipe do lado dele toda semana, por metade do valor". Apresente pelo ritmo, não pelo preço: o número falado com silêncio é o do plano recomendado, o destacado no último avanço. Ordem da casa: o Legacy abre (tudo o que a família viu até o 32 é a estrutura dele), a Assessoria PRO entra como o formato mais enxuto: uma equipe do lado dele toda semana, por metade do Legacy, e o Scout PRO só se o caixa realmente pedir. BANT não é interrogatório: as perguntas são de ritmo, não de dinheiro. A conexão direta com clubes e AGN, os 15 encaminhamentos por mês, a turma e os 93% são do Legacy: não atribua ao PRO nem ao Scout PRO. O encaminhamento vem a partir da Assessoria PRO, com pelo menos 5 por mês. Nunca "o mais barato", "o mais vendido" ou "o mais escolhido". Se perguntarem qual compensa, responda pelo ritmo, não pela diferença de preço. O número e o fechamento ficam neste mesmo slide. O número é o do plano da ficha, o destacado no último avanço, já com o parcelamento (10 x a parcela = o valor total): Scout PRO, R$ 997 vitalício, 10x de R$ 99,70; Assessoria PRO, R$ 1.497 vitalício, 10x de R$ 149,70; Legacy, R$ 2.997 vitalício, 10x de R$ 299,70. Fale o número uma vez e aperte S. Regra de ouro: depois do número, silêncio. Quem fala primeiro depois do preço perde. Os 3 meses do "por dia" são só a conta: no PRO e no Scout PRO, não diga "prazo médio" nem ligue esses 3 meses ao encaminhamento: os 93% em até três meses são dado do Legacy. Travou no valor: isole ("tirando o valor, tem mais alguma coisa?"), diagnostique (retorno ou dinheiro agora) e volte no slide 28, 31, 34 ou 33. Modo B só se a análise da equipe for real, e a tela não muda. Link de pagamento: fora do deck, pelo WhatsApp, só depois do sim.'
  },
  { nome: 'Garantia total', min: 1.5,
    fala: [
      '"E pra vocês começarem tranquilos: [garantia]."',
    'Aponte os três valores na tela, sem fazer conta e sem comparar um plano com o outro: "Em qualquer um dos três, se vocês aplicarem o método e não fizer sentido pro momento de vocês, o valor investido volta inteiro, nos termos do contrato."',
      'No Legacy, a média, apontando a tela: "A média de fechamento dos nossos atletas é de cerca de três meses."',
      '"A gente confia no trabalho, na estrutura e no método. Por isso, se vocês aplicarem o método e não fizer sentido pro momento de vocês, o dinheiro volta inteiro. Sem burocracia."',
      '"O risco de começar fica com a gente. O único risco de verdade é o [atleta] ficar parado mais um ano."',
      'A diferença, com franqueza: "A garantia é do investimento. Contrato ninguém sério garante: quem te promete contrato tá mentindo. O que a gente garante é o trabalho, todo dia."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Confira o prazo e as condições da devolução antes da call (campo Prazo da garantia na ficha). Se houver prazo, fale o prazo. A garantia vem logo depois do número, com os três valores na tela de uma vez (pedido do dono, 11/10/2026): é o único slide em que os três aparecem sem avanço. Fale só o valor do plano da ficha, uma vez, e use a garantia pra tirar o medo de errar na hora de decidir. A condição (método aplicado, nos termos do contrato) fica no rodapé: não diga "incondicional". Responde "tem garantia?", "e se não der certo?" e parte do "vou pensar". Pra acionar, a família comprova que aplicou o método, como diz o rodapé do 34: se perguntarem, diga com clareza, sem esconder. A média de três meses só aparece com o Legacy na ficha; é dado da casa, não prazo.'
  },
  { nome: 'Bem-vindo', min: 3,
    fala: [
      'O fecho do campo, apontando a miniatura: "Olha o teu lugar de novo, [atleta]. O olhômetro não viu. A partir de hoje, a gente vê."',
      'Áudio de boas-vindas, com a frase da tela: "Bem-vindo, [atleta]." No Legacy: "A partir de hoje, o teu contrato profissional é o nosso objetivo." Na Assessoria PRO: "A partir de hoje, você tem uma equipe do teu lado, toda semana." No Scout PRO: "A partir de hoje, o teu jogo é lido de 15 em 15 dias."',
      'Só no Legacy, a imaginação, devagar, apontando o post da tela: "[atleta], imagina comigo. Daqui a alguns meses o teu telefone toca. É o [gerente]: \'o clube quer você\'. Você assina. No dia seguinte o teu nome tá publicado, igual o Joãozinho, igual o Kaio. Quem é a primeira pessoa que você liga?" Espere a resposta.',
      'Só no Legacy, pros pais: "[pai], [mãe], e nesse dia a gente ganha junto. Por isso, a partir de agora, quem corre atrás é a gente."',
      'Com a foto dele: no Legacy, apontando o anúncio, "imagina esse anúncio com o teu rosto, [atleta]"; na Assessoria PRO e no Scout PRO, apontando o cartão do plano, "esse é o teu plano, com o teu nome".',
      'O começo: no Legacy, "O [gerente] entra em contato com vocês, e o Zyron já começa a acompanhar o [atleta]." No PRO e no Scout PRO, "A equipe entra em contato com vocês, e o Zyron já começa a ler cada vídeo novo do [atleta]." E aponte o próximo passo da tela: no PRO, os encontros com a equipe de gestão de carreiras; no Scout PRO, o próximo vídeo.',
      'Indicação, na hora: "[atleta], tem algum colega de time que joga no teu nível? A gente faz a avaliação dele também."'
    ],
    perguntas: ['No Legacy: quem é a primeira pessoa que você liga quando assinar?'],
    crm: ['Venda concluída no CRM e cadastro em Vendas (produto e ticket do plano fechado; a venda entra pendente até a aprovação do Executive).', 'A indicação.', 'O dia do primeiro contato (no Legacy, do gerente).'],
    atencao: 'A imaginação sela a decisão: quem descreve o dia da assinatura em voz alta não volta atrás no dia seguinte. O post da tela é ilustrativo: diga "imagina", nunca "vai ser". Com caso espelho, feche com ele: "igual o [caso]". Na indicação, peça o contato do responsável do colega, não do menino. Só prometa prazo confirmado. No PRO e no Scout PRO, a tela não tem post, contrato nem AGN: fique no ritmo do plano e no próximo passo, sem prazo. A miniatura do campo só aparece com posição reconhecida na ficha. Com a foto dele, o anúncio continua ilustrativo (a tela não diz; quem diz é você): é "imagina", nunca "vai ser", e a foto não promete contrato.'
  }
];

/* As etapas da Bíblia das Vendas (processo-r2) e os slides de cada uma. O apresentador mostra a etapa no cabeçalho;
   o 16 cobre duas. A Bíblia cita estes números: mudou aqui, muda lá. */
window.ETAPAS = [
  { nome: 'Conexão', slides: [1, 2] },
  { nome: 'Dor e sonho', slides: [3, 16, 19] },
  { nome: 'O plano', slides: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27] },
  { nome: 'Fechamento', slides: [28, 29, 30, 31, 32, 33, 34] },
  { nome: 'Próximo passo', slides: [35] }
];

/* O campo do slide 12 (e a miniatura do 35): a posição da ficha, texto livre do painel, vira um marcador da formação 4-3-3.
   O deck compara em caixa baixa, sem acento e com hífen virando espaço; vale a primeira linha que casar, então o mais
   específico vem antes. [termos, marcador]: o termo como palavra inteira dentro do texto. [termos, marcador, true]: só o
   texto inteiro (as siglas). ZAG e VOL: com "esquerdo" ou "esquerda" no texto, o da esquerda; sem lado, o da direita.
   Posição que não casa (ex.: só "lateral", sem lado): o campo fica sem destaque. Nunca chute uma posição. */
window.CAMPO_POSICOES = [
  [['goleiro', 'goleira'], 'GOL'],
  [['lateral direito', 'lateral direita'], 'LD'],
  [['lateral esquerdo', 'lateral esquerda'], 'LE'],
  [['zagueiro', 'zagueira', 'zaga', 'defensor'], 'ZAG'],
  [['primeiro volante', 'volante'], 'VOL'],
  [['ponta esquerda', 'extremo esquerdo'], 'ALE'],
  [['ponta direita', 'extremo direito'], 'ADD'],
  [['meia central', 'meio campo', 'meia', 'armador'], 'MC'],
  [['centroavante', 'camisa 9', 'segundo atacante', 'atacante'], 'CA'],
  [['ponta', 'extremo'], 'ADD'],
  [['gol'], 'GOL', true], [['ld'], 'LD', true], [['le'], 'LE', true], [['zag'], 'ZAG', true], [['vol'], 'VOL', true],
  [['mc'], 'MC', true], [['ale'], 'ALE', true], [['add'], 'ADD', true], [['ca'], 'CA', true]
];

/* slides: números dos slides que respondem a objeção; prev: como evitar que ela apareça */
window.OBJECOES = [
  { q: 'O valor tá muito alto', slides: [27, 28, 29, 31, 34, 33, 19], prev: 'Cenário comprado, a estrutura e o Zyron apresentados, a conta da estrutura (slide 28), o contrato (slide 31) e os planos (slide 33) antes do número.', resposta: [
    'Acolher e isolar: "Entendo. Tirando o valor, tem mais alguma coisa que impede o [atleta] de começar?"',
    'Diagnosticar: "Quando você fala que tá alto: você não vê o retorno, ou é o dinheiro agora?"',
    'Se for retorno, com o Legacy na tela: "É o completo: o estrategista de carreiras e o gerente de carreira do lado dele todo dia, assessoria individual com o David Willer todo mês e pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora, além de tudo do PRO. Sozinhos, vocês iam pagar R$ 30.000 por ano por essa estrutura, e sem certeza nenhuma."',
    'Se for retorno, com a Assessoria PRO na tela: "É uma equipe do lado dele toda semana: o estrategista de carreiras ligando, os sete módulos de aulas, um estrategista esportivo, networking e aulas extras, e pelo menos 5 encaminhamentos de oportunidades por mês, pra clubes do Brasil e do mundo, por cerca de metade do valor do Legacy."',
    'Se for retorno, com o Scout PRO na tela: "É o começo: o Zyron lendo cada vídeo novo e um analista de performance medindo a evolução dele a cada 15 dias."',
    'Por dia, do plano da tela: no Legacy, "No prazo médio de 3 meses, dá [por dia] por dia."; no PRO e no Scout PRO, "Dividido nos primeiros 3 meses, dá [por dia] por dia." Os 3 meses do PRO e do Scout PRO são só a conta, não prazo de encaminhamento.',
    'E o contrato, como referência da casa: "Lembra: hoje um atleta que a gente coloca fecha por volta de [faixa] por mês. O Joãozinho entrou numa situação parecida e hoje tá no Grêmio." Com caso espelho, use ele: "o [caso] tinha o mesmo perfil e hoje tá no [clube do caso]." Com o PRO ou o Scout PRO, não diga que o plano leva a esse contrato.',
    'O risco: "E se vocês aplicarem o método e não fizer sentido, é [garantia]. O risco fica com a gente."',
    'Se for o dinheiro agora: "Se o dinheiro não fosse problema, o [atleta] começava hoje?" / "Então vamos resolver a forma: dá pra fazer em 10x sem juros. E se precisar, existe um formato mais enxuto." Desça um degrau pelo escopo, com os botões de plano no apresentador: ele mostra o que sai. Descendo pro Scout PRO, diga que o encaminhamento pra clubes vem a partir da Assessoria PRO.',
    'Mais vaga, quando o clima pedir: "Você acha que o sonho dele não vale parcelas mensais de [x] ou [y]?"',
    'Conduzir: "Então eu confirmo agora. Pix ou cartão?"'
  ], proibido: 'Desconto, "vou ver com meu gerente", baixar valor sem mudar o escopo' },
  { q: 'Preciso ver com minha esposa / meu marido', slides: [2], prev: 'O SDR marca a R2 com os dois; você confirma os dois antes de começar.', resposta: [
    '"Faz todo sentido, é decisão de família. E você, se dependesse só de você, o [atleta] começava?" (disse sim: virou aliado; hesitou: a objeção real é outra)',
    '"Então, se a [mãe] topar, vocês estão dentro?"',
    '"Liga pra ela agora e coloca no viva-voz. Em 10 minutos eu mostro o plano do [atleta], e vocês decidem juntos."',
    '"O que você acha que ela vai perguntar? Me fala que eu já te respondo."',
    'Modo B: "Eu apresento o [atleta] pra equipe hoje, e amanhã às [hora] eu falo com vocês dois com o retorno."'
  ], proibido: 'Mandar a proposta por WhatsApp "pra você mostrar pra ela".' },
  { q: 'Vou pensar', slides: [33, 34], prev: 'O combinado que o SDR fechou na marcação (decidir hoje, os dois juntos) e o silêncio depois do número.', resposta: [
    '"Claro. Pensar sobre o quê exatamente? O valor, conversar com mais alguém, ou alguma dúvida sobre o plano?"',
    '"O que vocês vão saber amanhã que não sabem agora?"',
    'O relógio, no Legacy: "Mais de 93% dos nossos são encaminhados em até três meses. Se decidir hoje, esses três meses começam hoje. Se decidir daqui a uma semana, o [atleta] começa uma semana depois." No PRO e no Scout PRO, sem os 93%: "Se decidir hoje, o Zyron começa a ler o jogo dele agora. Se decidir daqui a uma semana, ele começa uma semana depois."',
    'Sem risco: "E vocês podem decidir hoje tranquilos: se aplicarem o método e não fizer sentido, é [garantia]."',
    '"Vocês combinaram com o estrategista esportivo de decidir hoje. O que tá faltando?"',
    'Modo B: "Pensem hoje, que eu levo o [atleta] pra equipe. Amanhã às [hora] eu te dou o retorno, e aí vocês me dizem se estão dentro."'
  ] },
  { q: 'Quanto tempo até ele ir pra um clube?', slides: [21, 32, 23, 27], prev: 'Os 93% em até três meses no slide 21 e o caminho da tela no slide 32.', resposta: [
    '"Mais de 93% dos nossos atletas são encaminhados pra clubes em até três meses."',
    '"Encaminhar é o clube que precisa do perfil dele receber ele pra avaliação. Dali em diante é o jogo dele, com o gerente de carreira preparando ele todo dia pra esse momento."',
    '"E quanto antes começa, antes esse relógio anda. Decidindo hoje, os três meses começam hoje."',
    'Com o Scout PRO na tela: "O encaminhamento pra clubes vem a partir da Assessoria PRO." Com a Assessoria PRO: "Na Assessoria PRO, a gestão de carreiras faz pelo menos 5 encaminhamentos de oportunidades por mês, pra clubes do Brasil e do mundo, e os encontros com a equipe mostram o que falta pro [atleta] ser encaminhado." Os 93% e os três meses são do Legacy: não use como prazo do PRO nem do Scout PRO.'
  ], proibido: 'Prometer data de contrato ou clube. Encaminhamento não é contratação.' },
  { q: 'Será que ele é bom o suficiente?', slides: [21, 2, 3, 12, 14, 17, 18, 19, 30], prev: '"Se você está vendo isso, é porque tem o que é preciso" desde a capa, "não foi você, foi o olhômetro" (slide 03), o seu lugar em campo (slide 12), o jogo dele lido lance a lance (slide 17) e "nem tudo é talento" no slide 21.', resposta: [
    '"Se não fosse, ele não estaria nessa conversa. A equipe e o Zyron aprovaram o perfil dele: a gente só investe em quem acredita que vai chegar."',
    '"E nem tudo é talento. Talento ele tem. O que faltou até agora foi alguém levando ele até o clube certo, na hora certa."',
    'Com caso espelho: "O [caso] tinha o mesmo perfil, e a mesma dúvida em casa. Hoje tá no [clube do caso]."',
    'Com a leitura no 17: "Vocês viram: os pontos fortes estão ali, lance a lance, e as prioridades também. É por elas que a gente começa." Os dois, sem inflar.'
  ], proibido: 'Pôr o perfil do atleta em dúvida, nem pra "ser sincero". Dar nota geral ou comparar com outros atletas.' },
  { q: 'Mas vocês não ganham no contrato? Por que cobram?', slides: [31, 29, 33], prev: 'O "até lá, a gente investe" (slide 29) e o contrato (slide 31) antes do número.', resposta: [
    '"Exatamente: o nosso lucro vem do contrato. Isso aqui não é lucro, é o custo mínimo com os profissionais dedicados ao [atleta] até o contrato sair. Sem eles, não tem contrato pra ninguém ganhar." No Legacy, nomeie o gerente de carreira e as sete frentes; na Assessoria PRO, o estrategista de carreiras, o estrategista esportivo e os sete módulos de aulas.',
    '"Até lá, quem investe tempo, esforço, profissionais e tecnologia nele somos nós."'
  ] },
  { q: 'E se ele for dos que não chegam lá?', slides: [30, 21, 4, 23], prev: 'Escada do sim no slide 30, com o atleta dizendo em voz alta que faz a parte dele.', resposta: [
    'No Legacy: "Mais de 93% dos nossos são encaminhados em até três meses. Quem fica pra trás, quase sempre, é por falta de disciplina e de compromisso: a parte que depende dele."',
    '"É por isso que a gente escolhe com quem trabalha. Ele passou no filtro." No Legacy, some: "e ele tem o gerente de carreira e o Zyron em cima todo dia." Na Assessoria PRO: "e ele tem o estrategista de carreiras ligando toda semana e a equipe olhando o que falta."',
    'Não pergunte pro atleta "você vai ser dos que não chegam?": é pressão direta sobre o menino.'
  ] },
  { q: 'E se não der certo? / Tem garantia?', slides: [34], prev: 'A garantia aparece logo depois do número, no slide 34, com os três valores na tela.', resposta: [
    '"Tem, [garantia], sem burocracia, se vocês aplicarem o método e entenderem que não faz sentido."',
    'Como acionar, se perguntarem: "Vocês mostram que aplicaram o método, como tá no contrato, e o valor volta inteiro." No Legacy, some: "E a média de fechamento dos nossos atletas é de cerca de três meses."',
    '"O que ninguém sério garante é contrato: quem te promete contrato tá mentindo. O que a gente tem é o trabalho, no ritmo que vocês escolheram, o Zyron, e a gente só ganha quando ele ganha. Se ele não avançar, quem perde primeiro somos nós." No Legacy, nomeie: o gerente de carreira todo dia.',
    '"O risco de verdade é ele ficar parado mais um ano."'
  ] },
  { q: 'Não tenho o dinheiro agora', slides: [33], prev: 'Sinais de budget da ficha pra escolher o plano antes do 33: Legacy se a ficha não mostra aperto financeiro, Assessoria PRO se a dor financeira é forte.', resposta: [
    '"Se tivesse, ele começava hoje?"',
    '"Então o problema é só a forma. Dá pra fazer em 10x sem juros, ou num formato mais enxuto. Qual cabe melhor?"',
    'Do Legacy pra Assessoria PRO, pelo escopo: "Existe um formato mais enxuto, a Assessoria PRO: o estrategista de carreiras liga toda semana em vez de estar do lado dele todo dia, e saem o gerente de carreira, a assessoria individual com o David Willer, a ligação semanal do estrategista esportivo, a conexão direta com clubes e AGN e o acompanhamento das seletivas. O encaminhamento continua: pelo menos 5 oportunidades por mês, pra clubes do Brasil e do mundo, em vez de 15." Troque no apresentador: o 33 mostra o PRO.',
    'Da Assessoria PRO pro Scout PRO, só se o caixa não comporta o PRO: "O Scout PRO é o começo: o Zyron lendo cada vídeo novo e o relatório do analista de performance a cada 15 dias. Os sete módulos continuam no Scout PRO. Saem a ligação do estrategista de carreiras e o estrategista esportivo, o networking e as aulas extras, os encontros com a equipe e o encaminhamento pra clubes."',
    '"Assim que resolver a forma, a equipe já entra em contato. Isso não espera."'
  ], proibido: 'Desconto. Desce de plano só pelo escopo.' },
  { q: 'Ele não pode ir pra outro estado', slides: [4], prev: 'A locomoção que a família contou na R1 e o "quando o clube chamar" no plano (slide 04).', resposta: [
    '"Hoje ele não precisa ir pra lugar nenhum. Isso só acontece quando o clube chamar." No Legacy, some: "e o gerente de carreira organiza a ida com vocês."',
    '"E vocês falaram pro estrategista esportivo: [locomoção]. Então isso a gente resolve junto quando chegar a hora."'
  ] },
  { q: 'Já tentamos peneira / empresário e não deu', slides: [3, 13, 15, 16, 19, 21], prev: 'O olhômetro antes do plano (slide 03), a resposta nos slides 15 e 16 e o "nem tudo é talento" no 21.', resposta: [
    '"Quantos garotos tinham nessa peneira? E quanto tempo olharam pra ele? Vinte minutos de coletivo?"',
    '"Então não foi ele que não deu certo. Foi o olhômetro. Ninguém analisou o jogo dele de verdade, e ninguém acompanhou ele depois. É exatamente isso que o Zyron e a gente fazem."',
    'No Legacy: "Nem tudo é talento: faltou quem levasse ele ao clube certo. Aqui, mais de 93% são encaminhados em até três meses."'
  ] },
  { q: 'Ele ainda é novo / Ano que vem a gente vê', slides: [32, 4], prev: 'A janela de idade no plano (slide 04).', resposta: [
    '"Com [idade + 1], a janela fica maior ou menor? Esperar um ano é um ano a menos de janela." No Legacy, com turma, some: "e é deixar a vaga dessa turma pra outro menino."',
    '"Os clubes estão pedindo jogador agora. Daqui a um ano, esse pedido vai pra quem começou hoje."'
  ] },
  { q: 'Isso é confiável?', slides: [20, 21, 22, 24, 25, 26, 34, 8, 10, 11, 23], prev: 'O depoimento de uma mãe (20), os números (21), a AGN (22), a garantia (34) e a autorização expressa do responsável no "como o Zyron funciona" (08) antes da pergunta.', resposta: [
    '"Vocês ouviram a mãe. E mais de 93% dos nossos são encaminhados em até três meses."',
    '"A gente tem relação direta com a AGN Football, com jogador nosso publicado lá. O Joãozinho fechou com o Grêmio, o Kaio com o Internacional. Te mando o link agora." [link AGN]',
    'Com caso espelho: "E o [caso], que tem o perfil do [atleta], tá lá também: [link do caso]."',
    '"E tem [garantia], se vocês aplicarem o método e não fizer sentido."',
    '"E aqui tá o nosso [site, Instagram ou CNPJ]."'
  ] },
  { q: 'Manda por WhatsApp que eu vejo com calma', slides: [], resposta: [
    '"O plano é do [atleta], não é folder. Explicado aqui, com vocês, é que ele faz sentido. O que você precisa ver pra decidir?"'
  ], proibido: 'Mandar proposta ou valor por WhatsApp.' },
  { q: 'Vou ver outras opções', slides: [16, 17, 19, 22, 24, 25, 7, 3, 9], prev: 'O olhômetro (03) e a comparação do slide 16 já fizeram as perguntas por eles; a leitura ao vivo do jogo dele (17) e o vídeo do Zyron (07) mostram o que ninguém mais tem.', resposta: [
    '"Compara mesmo. Pergunta pra eles: analisam o atleta com dados reais ou no olhômetro? Tem alguém acompanhando de verdade, no ritmo que vocês escolheram? Tem um agente como o Zyron? Leem o jogo do atleta ao vivo, na frente de vocês? E como eles ganham: em cima de vocês, ou só quando o atleta fecha?"',
    'Com o Legacy na tela, some: "Tem gerente de carreira todo dia? Levam o atleta aos clubes? Têm relação direta com a AGN?" E, com turma: "Só lembra que a vaga do [atleta] aqui não fica aberta pra sempre. A turma é de 10."',
    'Com a Assessoria PRO na tela, a acessível: "E vê quem coloca uma equipe do lado dele toda semana, com sete módulos de aulas, um estrategista esportivo e pelo menos 5 encaminhamentos por mês, por esse investimento."'
  ] },
  { q: 'Qual a diferença entre os planos?', slides: [33, 27, 16], prev: 'A matriz do 33 responde antes da pergunta: as linhas do 16, em três ritmos.', resposta: [
    'O ritmo, antes do valor: "A diferença é com que frequência tem alguém olhando pro [atleta]: a cada 15 dias, toda semana ou todo dia. O Zyron tá nos três."',
    'Scout PRO: "Pra começar: o Zyron lê cada vídeo novo, e um analista de performance manda relatório a cada 15 dias."',
    'Assessoria PRO: "Tudo isso e uma equipe do lado dele toda semana: o estrategista de carreiras liga, ele tem os sete módulos de aulas, conta com um estrategista esportivo, entra no networking com outros atletas e nas aulas extras, e a gestão de carreiras faz pelo menos 5 encaminhamentos de oportunidades por mês, pra clubes do Brasil e do mundo. Por metade do Legacy."',
    'Legacy: "O completo: tudo do PRO, o estrategista de carreiras do lado dele todo dia, o gerente de carreira e assessoria individual com o David Willer todo mês, com acompanhamento direto no WhatsApp. E pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora, com conexão direta com clubes e com a AGN, e as seletivas acompanhadas, com a logística planejada."',
    'Conduzir: "Pelo que vocês me falaram, eu recomendo o [plano]. Faz sentido?"'
  ], proibido: 'Responder pela diferença de preço em vez do ritmo, chamar o PRO de "o mais barato" ou de "o mais vendido", atribuir ao PRO o que é do Legacy (conexão direta com clubes e AGN, os 15 encaminhamentos por mês) ou encaminhamento ao Scout PRO.' },
  { q: 'Isso de inteligência artificial funciona mesmo?', slides: [7, 8, 10, 13, 14, 12, 15, 17, 18, 2, 9, 11], prev: 'O Zyron trabalhando (07), os cinco verbos (08), o seu lugar em campo (12), olhômetro contra Zyron (15) e a leitura ao vivo do jogo dele (17).', resposta: [
    '"Clube grande já escolhe atleta assim há anos, aqui e lá fora, só que sempre por dentro, sem o atleta nem saber que foi visto desse jeito. A novidade é que agora isso chegou até o atleta."',
    '"É o que vocês viram no vídeo: o Zyron cruza o jogo do atleta com o que cada clube precisa. Por isso mais de 93% são encaminhados em até três meses."',
    'Se a leitura ao vivo já rodou (slide 17): "E vocês viram com o jogo do [atleta], ao vivo, aqui na nossa chamada."'
  ] }
];

window.METODO_OBJECAO = ['Acolher', 'Isolar: "tirando isso, tem mais alguma coisa?"', 'Diagnosticar', 'Responder com as palavras da família', 'Conduzir de volta pra decisão'];
window.PROIBIDO_OBJECAO = 'Um "não" é informação. Proibido: desconto, "vou ver com meu gerente", baixar valor sem mudar o escopo, proposta por WhatsApp.';

window.FOLLOWUP = {
  sim: [
    'Pagamento na própria call: mande no WhatsApp o link de pagamento do plano fechado (você tem o link de cada plano fora do deck) e "faz agora comigo na linha". Link só depois do sim.',
    'Registro: venda concluída no CRM e cadastro em Vendas, com o produto e o ticket do plano fechado. Entra pendente até a aprovação do Executive.',
    'Áudio de boas-vindas pro atleta.',
    'Indicação na hora, com o contato do responsável do colega. Vira lead pro SDR.',
    'Início imediato, só com o prazo confirmado: no Legacy, o gerente de carreira e o Zyron; na Assessoria PRO e no Scout PRO, a equipe e o Zyron.'
  ],
  naoIntro: 'O Gestor volta sempre com motivo (retorno da equipe, um caso, o plano do atleta), nunca pedindo.',
  nao: [
    ['Mesmo dia', '"[pai], resumo da nossa conversa: vocês me falaram que [dor]. O [plano] resolve isso: o Zyron e a nossa equipe olhando pro [atleta], [ritmo]. Amanhã às [hora] eu te trago o retorno da equipe."'],
    ['Data combinada', 'Liga na hora marcada, com o retorno da equipe ou com todos os decisores. Retoma o plano e conduz a decisão.'],
    ['+1 dia', 'O caso espelho com o link da AGN ("lembra do atleta que eu falei que tem o perfil do [atleta]?"), ou outro caso parecido.'],
    ['+3 dias', 'Só no Legacy: "A vaga do [atleta] ainda tá separada, mas a turma tá fechando." Só se a vaga realmente estiver separada.'],
    ['+7 dias', 'O plano de novo: idade, janela, o que muda na vida da família.'],
    ['+14 dias', 'Só no Legacy, e só se a equipe realmente vai liberar a vaga: "A equipe vai liberar a vaga do [atleta] pros próximos aprovados amanhã. Se quiserem garantir, me responde hoje."'],
    ['Depois', 'Devolve pro SDR, que reaborda em 30 dias. O histórico fica no CRM.']
  ]
};

/* Os três planos: fonte única da tela (25 os planos e o número, 27 bem-vindo), do apresentador e das notas-do-gestor.md.
   Do degrau de baixo pro de cima, e cumulativos: o PRO tem tudo do Scout PRO, o Legacy tem tudo do PRO.
   O plano da ficha (campo plano) é o que a tela mostra; vazio ou nome antigo vira o Legacy.
   Sem link de pagamento no deck: acertado o plano, o Gestor manda o link pelo WhatsApp, na call, só depois do sim.
   ticket: o que vai pro CRM e pro cadastro em Vendas. preco e parcela: o 33 (os três, com o da ficha destacado), vitalício, em 10x sem juros. porDia: só na fala (3 meses).
   marca: o nome com a cor de cada parte (az: azul, o Zyron e a leitura; ou: dourado, gente e carreira; br: branco; pre: a linha de cima,
   menor, menos no 33, onde o nome inteiro fica numa linha só). artigo: "a" quando o nome é feminino (a Assessoria PRO: "Tudo da
   Assessoria PRO, mais"); sem artigo, vale "o". antigos: nomes de antes (o Scouting PRO virou Assessoria PRO em 07/10/2026), pra ficha
   salva no navegador e o painel com o nome antigo continuarem mostrando o plano certo.
   descritor: o papel do plano na tela (33). selo: o papel no cartão do 35, sem conta de preço (sem selo, vale o descritor). promessa: a linha dele (sem tela desde que o slide do número saiu). fala: como o Gestor fala dele. passo: o passo da tese da R2.
   rotulo e inclui: a lista do plano (sem tela desde que o slide do número saiu; o 33 usa vantagens).
   base: a linha que fecha a lista do Legacy. extras: o "Também vem" do Scout PRO (proposta, P9: o dono valida).
   vantagens: a parte do plano no 33, cargo por cargo ([cargo, benefício] ou [cargo, benefício, chave]: com chave, a linha só aparece
   se o plano tiver a chave, ex.: turma), só o que ele acrescenta ao degrau de baixo. O Legacy, o ideal, tem a lista mais longa.
   bemVindo, rotina e proximo: o 35 do PRO e do Scout PRO (o do Legacy é o de sempre, com o gerente e a assinatura).
   sai: o que sai ao descer pra ele, a partir do degrau de cima. diferenca: o que o degrau de cima acrescenta, em uma linha.
   descer e subir: a frase do Gestor ao trocar pra ele (o apresentador completa com o que sai ou o que entra).
   Premissas, uma chave cada, pra reverter num lugar só: turma (P5, turma de 10 e vagas: slides 20, 30 e 32), garantia (P6, a linha
   do 34), contrato (P7, "só custeia os profissionais parceiros" no rodapé do 33 e "a gente só ganha se você ganhar" só falado),
   ancora e retorno (P8, R$ 30.000 por ano e R$ 30 mil+ por mês, só falados). Leitura do Legacy: o estrategista de carreiras sobe pra todo dia e entra o David direto;
   se o David substituir o estrategista de carreiras, troque a primeira linha de inclui e a primeira de vantagens do Legacy. */
window.PLANOS = [
  { id: 'scouting', nome: 'Scout PRO', curto: 'Scout PRO', antigos: ['Scouting'], marca: [['Scout', 'az'], ['PRO', 'ou']],
    ticket: 'R$ 997,00', preco: 'R$ 997', parcela: 'R$ 99,70', porDia: 'menos de R$ 12',
    ritmo: 'A cada 15 dias', descritor: 'Pra começar', passo: 'Ser visto',
    promessa: 'Seu jogo com direção: leitura, evolução e sete módulos de formação.',
    fala: 'O Scout PRO combina a leitura do seu jogo pelo Zyron, relatório do analista e sete módulos de formação para você aplicar no desenvolvimento.',
    rotulo: 'Vitalício, você tem',
    inclui: [
      'O Zyron lendo o seu jogo: vídeo novo, relatório novo.',
      'Um analista de performance com relatório: a sua performance e os seus avanços.',
      'Sete módulos de formação: conteúdo para aplicar na sua rotina e no desenvolvimento do seu jogo.'
    ],
    extras: [
      'Relatório de entrada: de onde você parte.',
      'Histórico de evolução: todos os relatórios num lugar só.',
      'Guia de preparação pra peneira: o que o avaliador olha.'
    ],
    vantagens: [
      ['O Zyron', 'lê cada vídeo novo e aponta pontos fortes e prioridades.'],
      ['Analista de performance', 'relatório da sua evolução.'],
      ['Relatório de entrada', 'de onde você parte.'],
      ['Histórico de evolução', 'o quanto você avançou, num lugar só.'],
      ['Guia da peneira', 'o que o avaliador olha em vinte minutos.'],
      ['Sete módulos de formação', 'uma trilha para transformar conhecimento em evolução no seu jogo.']
    ],
    bemVindo: 'A partir de hoje, o seu jogo é lido de 15 em 15 dias.',
    rotina: 'O analista de performance manda o relatório da sua performance e dos seus avanços.',
    proximo: 'Mande o seu próximo vídeo: vídeo novo, relatório novo.',
    descer: 'Existe um formato mais enxuto, o Scout PRO',
    sai: ['a ligação do estrategista de carreiras toda semana', 'o estrategista esportivo e o acompanhamento semanal', 'o networking com outros atletas e as aulas extras', 'a gestão de carreiras com pelo menos 5 encaminhamentos de oportunidades por mês', 'o encaminhamento pra clubes do Brasil e do mundo'],
    diferenca: 'o seu estrategista de carreiras ligando toda semana, um estrategista esportivo, networking e aulas extras, e a gestão de carreiras com pelo menos 5 encaminhamentos de oportunidades por mês, pra clubes do Brasil e do mundo',
    turma: false, garantia: true, contrato: true, ancora: false, retorno: false },
  { id: 'pro', nome: 'Assessoria PRO', curto: 'Assessoria PRO', artigo: 'a', antigos: ['Scouting PRO'], marca: [['Assessoria', 'br'], ['PRO', 'ou']],
    ticket: 'R$ 1.497,00', preco: 'R$ 1.497', parcela: 'R$ 149,70', porDia: 'menos de R$ 17',
    ritmo: 'Toda semana', descritor: 'Uma equipe do seu lado, por metade do Legacy', selo: 'Uma equipe do seu lado', passo: 'Ser preparado',
    promessa: 'Toda semana, o estrategista de carreiras liga. Todo mês, pelo menos 5 encaminhamentos.',
    relacao: '', // o descritor já diz: por metade do Legacy
    fala: 'A Assessoria PRO é uma equipe do lado do [atleta] toda semana, por cerca de metade do valor do Legacy: o estrategista de carreiras liga, ele tem os sete módulos de aulas, um estrategista esportivo, networking e aulas extras, e a gestão de carreiras faz pelo menos 5 encaminhamentos de oportunidades por mês, pra clubes do Brasil e do mundo.',
    rotulo: 'Tudo do Scout PRO, mais:',
    inclui: [
      'Seu estrategista de carreiras liga toda semana.',
      'Sete Módulos de aulas (performance, psicologia, nutrição, comportamento e imagem) e um estrategista esportivo.',
      'Pelo menos 5 encaminhamentos de oportunidades por mês.',
      'Networking com outros atletas e aulas extras.',
      'Encaminhamento para clubes do Brasil e do mundo.'
    ],
    vantagens: [
      ['Estrategista de carreiras', 'liga toda semana pra acompanhar você.'],
      ['Aplicação dos sete módulos', 'um estrategista esportivo orienta seu desenvolvimento.'],
      ['Estrategista esportivo', 'você conta com ele nos próximos passos.'],
      ['Gestão de carreiras', 'pelo menos 5 encaminhamentos de oportunidades por mês.'],
      ['Networking e aulas extras', 'grupo, conexões com atletas e aulas além dos módulos.'],
      ['Encaminhamento', 'para clubes do Brasil e do mundo.']
    ],
    bemVindo: 'A partir de hoje, você tem uma equipe do seu lado, toda semana.',
    rotina: 'O seu estrategista de carreiras liga pra acompanhar você, e o Zyron lê cada vídeo novo.',
    proximo: 'Os encontros com a equipe de gestão de carreiras, pra ver o que você precisa pra ser encaminhado.',
    descer: 'Existe um formato mais enxuto, a Assessoria PRO',
    subir: 'Se vocês quiserem uma equipe do lado dele toda semana',
    sai: ['o estrategista de carreiras todo dia (na Assessoria PRO, ele liga toda semana)', 'o gerente de carreira todo dia', 'a assessoria individual com o David Willer todo mês e o acompanhamento direto no WhatsApp', 'a ligação do estrategista esportivo toda semana', 'os 15 encaminhamentos de oportunidades por mês, mundo afora (na Assessoria PRO, são pelo menos 5)', 'a conexão direta com clubes e AGN', 'as seletivas acompanhadas, com a logística planejada'],
    diferenca: 'o seu estrategista de carreiras e o gerente de carreira todo dia, assessoria individual com o David Willer todo mês, com acompanhamento direto no WhatsApp, o estrategista esportivo ligando toda semana, pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora, a conexão direta com clubes e AGN e as seletivas acompanhadas, com a logística planejada',
    turma: false, garantia: true, contrato: true, ancora: false, retorno: false },
  { id: 'legacy', nome: 'Assessoria de Elite Legacy', curto: 'Legacy', marca: [['Assessoria de Elite', 'pre'], ['Legacy', 'ou']],
    ticket: 'R$ 2.997,00', preco: 'R$ 2.997', parcela: 'R$ 299,70', porDia: 'menos de R$ 34',
    ritmo: 'Todo dia', descritor: 'O mais completo', passo: 'Ser apresentado',
    promessa: 'O caminho inteiro, todo dia, direto com o David.',
    fala: 'O Legacy é o completo, o ideal: tudo da Assessoria PRO, o estrategista de carreiras do lado do [atleta] todo dia, o gerente de carreira, assessoria individual com o David Willer todo mês, com acompanhamento direto no WhatsApp, o estrategista esportivo ligando toda semana, pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora, conexão direta com clubes e AGN e as seletivas acompanhadas, com a logística planejada.',
    rotulo: 'Vitalício, você tem',
    inclui: [
      'Estrategista de carreiras e gerente de carreira, todo dia.',
      'Assessoria individual com o David Willer, todo mês.',
      'Pelo menos 15 encaminhamentos por mês, mundo afora.',
      'Conexão direta com clubes e AGN Football.',
      'Seletivas acompanhadas, com a logística planejada com vocês.'
    ],
    base: ['E tudo da Assessoria PRO e do Scout PRO.'],
    vantagens: [
      ['Estrategista de carreiras', 'do seu lado, todo dia.'],
      ['Gerente de carreira', 'de perto, todo dia.'],
      ['David Willer', 'assessoria individual todo mês e acompanhamento direto no WhatsApp.'],
      ['Gestão de carreiras', 'pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora.'],
      ['Conexão direta com clubes e AGN', 'seu perfil levado aos clubes da rede e à AGN.'],
      ['Estrategista esportivo', 'relatório e ligação toda semana.'],
      ['Plano de carreira', 'feito pro seu jogo.'],
      ['Quem corre atrás é a gente', 'clube, vídeo e avaliação.'],
      ['Seletivas', 'acompanhamento e logística planejada com vocês.'],
      ['Turma de 10', 'atenção máxima no seu desenvolvimento.', 'turma']
    ],
    bemVindo: 'A partir de hoje, o seu contrato profissional é o nosso objetivo.',
    subir: 'Se vocês quiserem o completo',
    turma: true, garantia: true, contrato: true, ancora: true, retorno: true }
];

/* A garantia: o texto da tela (o 34 e a linha do 27) e da fala ([garantia]) sai daqui, de um lugar só, e tem que bater com o
   contrato. D1, padrão (A): "Garantia total", com a condição no rodapé. Opção B (duas camadas): ponha em camadas a primeira
   (ex.: 'Garantia incondicional de 7 dias.') só quando o contrato disser; ela entra no 34, acima do título. Opção C: o texto
   que o dono mandar. Nunca "incondicional" sem o contrato dizer. fala: como o Gestor fala, no meio da frase. */
window.GARANTIA = {
  titulo: 'Garantia total.',
  destaque: 'Todo o valor investido é devolvido.',
  condicao: 'A garantia refere-se ao investimento realizado na assessoria. Pra acionar, é preciso comprovar que o método foi aplicado, conforme os termos do contrato.',
  fala: 'garantia total, todo o valor investido de volta',
  camadas: []
};

/* Os prazos que o closer escolhe no Painel do Closer (lista fixa, promessa travada: só o que a operação cumpre). O deck mostra
   só esses (texto fora da lista não vai pra tela). O painel tem uma cópia (regras.js), conferida por testes/teste-igualdade.mjs. */
window.PRAZOS = {
  contato: ['ainda hoje', 'em até 24 horas', 'em até 48 horas'],
  zyron: ['imediatamente']
};

window.CHECKLIST = [
  'Abri o link do atleta e conferi os dados disponíveis e a foto opcional no slide de escolha',
  'Conferi que a foto é do atleta certo e que a autorização está marcada',
  'Li a ficha e o Contexto do lead no CRM (origem, o que chamou atenção no Zyron, o que ele contou no formulário)',
  'Vi o vídeo do atleta',
  'Separei sonho, dor, peneiras e o que falta, com as palavras deles',
  'Escolhi o caso espelho: atleta nosso de verdade, mesmo perfil (posição, idade, nível), do CASOS.md ou publicado na AGN, com o link',
  'Defini o primeiro foco e escolhi na ficha o plano que vou recomendar: Legacy se a ficha não mostra aperto financeiro, Assessoria PRO se a dor financeira é forte, Scout PRO só se o caixa não comporta o PRO',
  'Tenho à mão, fora do deck, o link de pagamento de cada plano (vai no WhatsApp só depois do sim)',
  'Conferi a faixa de contrato que posso citar e o prazo da garantia',
  'Link da AGN pronto pra mandar no WhatsApp',
  'Conferi posição, pé e altura do atleta (o campo do slide 12 depende da posição)',
  'Testei o vídeo do Zyron (slide 07) e o depoimento da mãe (slide 20) com o áudio no compartilhamento de tela',
  'Subi o vídeo do atleta no painel (Leitura do atleta), com a autorização do responsável, marquei os lances e olhei a prévia',
  'O vídeo do atleta sai do ar 24 horas depois do envio: se subi antes da véspera da call, cliquei em "Renovar por 24 h" no painel',
  'Testei o vídeo no deck (play, som, pular pelos lances no apresentador)',
  'Conferi se a fonte do relatório é Zyron ou Equipe, de verdade',
  'Se não subi o vídeo, deixei o vídeo do atleta aberto pra leitura ao vivo no Meet (IA na Prática, slide 17)',
  'Com o vídeo analisado: conferi no painel o "Tenho o vídeo do jogador", o vídeo, o mapa de calor e as oportunidades, e olhei o dossiê do atleta (18) na prévia',
  'Anotei no painel as peneiras, o gasto e os anos tentando que a família contou (o quadro do 19)',
  'Conferi vagas e data da próxima turma (só aparecem com o Legacy)',
  'Confirmei pai, mãe e atleta na call',
  'Deck aberto em tela cheia e apresentador em outra janela',
  'Confirmei com o dono o que da plataforma já está no ar: a tela do 09 é ilustrativa e eu só falo do que existe',
  'Se for falar do David, confirmei com o dono o que posso dizer dele (o site da AGN não cita o David nem a Jogador de Elite)',
  'Mandei o [link AGN] pelo WhatsApp na hora do 23 e conferi o plano da ficha (o selo "O seu plano" e a linha do 23 seguem ele)',
  'Escolhi quais dos seis slides da página institucional vou usar (10, 13, 14, 24, 25 e 26: cada um é opcional no painel) e, se a call for curta, tirei os de prova (24, 25 e 26)',
  'Se a animação do campo (13) travar no Meet, abro o deck com ?bloco=estatico no fim do endereço (campo parado, mesma mensagem)'
];

window.PROIBIDOS = 'Proibido: dizer "24/7" pro acompanhamento humano (só a IA fica ligada 24 horas); usar a foto de outro atleta no lugar da do atleta da call (o mosaico do 26 é arquivo público da casa, não é a foto dele); mostrar a foto sem a autorização registrada no painel; chamar o atleta de "especial", "único" ou "o melhor"; prometer prazo de contrato; dizer "incondicional" se o contrato tiver condição; dizer que a AGN representa, publica ou contrata o atleta; "garantido", "certo" ou "vai chegar" pro encaminhamento; inventar currículo do David; começar do zero com quem já tem contexto; perguntar de novo o que está na ficha; prometer contrato, clube ou valor de contrato; inventar caso, clube ou número; trocar "encaminhado" por "contratado"; desconto; proposta por WhatsApp; correr atrás da família; pôr o perfil do atleta em dúvida; vender pela diferença de preço em vez do ritmo; atribuir ao PRO o que é do Legacy (conexão direta com clubes e AGN, os 15 encaminhamentos por mês) ou encaminhamento ao Scout PRO; descer de plano por desconto; mandar o link antes do sim; dar nota ou atributo ao atleta; dizer que o Zyron tem percentual de acerto; chamar o avaliador de incompetente; citar clube como quem usa dados; dizer que existe vaga num clube específico; dizer que o Zyron leu um relatório marcado à mão; dar nota geral, ranking, percentil ou comparação com outros atletas; mostrar o vídeo de um atleta a quem não é da família dele; prometer que o relatório da call é o do plano (o plano entrega a leitura de cada vídeo novo, no ritmo dele); citar o escudo de um clube como se ele usasse o Zyron, patrocinasse ou tivesse vaga; trocar "enviados" por "contratados" no 326; comparar o atleta a Neymar ou a qualquer jogador.';
