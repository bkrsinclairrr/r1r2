/* Roteiro do Gestor de Carreiras (Closer) para a R2.
   Fonte única: alimenta o modo apresentador e o arquivo notas-do-gestor.md.
   Base: PLAYBOOK_CLOSER v9 (números entre parênteses são as seções dele; "slide NN" é o slide do deck)
   e CASOS.md / PLAYBOOK_SDR (AGN Football, casos, números da casa).
   A R2 não começa do zero: o SDR já coletou tudo, o Gestor confirma, apresenta o plano e fecha.
   Três planos (window.PLANOS, no fim deste arquivo): até o 22 a tela mostra a estrutura completa, a do Legacy;
   o 23 mostra os três com o investimento de cada um e o 24 fecha com o número do plano da ficha.
   [atleta], [responsável], [pai], [mãe], [gerente], [característica], [experiência], [sonho],
   [primeiro foco], [locomoção], [dor], [peneiras], [investido], [faixa], [vagas],
   [hora], [idade + 1], [link AGN], [caso], [clube do caso], [país do caso], [link do caso], [posição]
   são trocados pelos dados da ficha. Do plano da ficha: [plano] (Scout PRO, Assessoria PRO ou Legacy),
   [preço] (o valor, vitalício), [parcela] (das 10x sem juros), [ritmo] (a cada 15 dias, toda semana ou todo dia)
   e [por dia] (o valor dividido em 3 meses, só na fala).
   A ordem segue a Bíblia das Vendas (processo-r2, window.ETAPAS no fim deste arquivo). O inimigo comum é o olhômetro
   (04, e a resposta no 11); o atleta se vê em campo no 10. silencio: os três pontos de pergunta e silêncio (04, 13 e 24),
   que o apresentador marca; no 04 e no 13 a tecla S conta ali mesmo, sem trocar de slide.
   O 13 (v2, 08/10/2026) mostra o vídeo do atleta e o relatório que o Gestor deixou pronto no painel (Leitura do atleta);
   sem vídeo no painel, é a leitura ao vivo de sempre. A fala tem as duas versões. */

window.ROTEIRO = [
  { nome: 'Capa', min: 1,
    fala: [
      'Conexão pelo nome (4.1): "[pai], [mãe], [atleta], prazer. Eu sou o gestor de carreiras. Li tudo o que vocês conversaram com o estrategista esportivo, e hoje eu trago o planejamento de carreira do [atleta]."',
      'O gancho, apontando o título: "E eu começo pelo que travou ele até aqui: o olhômetro não viu o jogo do [atleta]."',
      'Veio do Zyron: "Mas o Zyron viu. [atleta], você foi pré-selecionado: o Zyron analisou o teu vídeo e a equipe aprovou o teu perfil. É por isso que eu tô aqui."',
      'Veio do formulário ou sem origem: "[atleta], a gente leu a tua história. O plano que eu vou te mostrar foi montado a partir dela."',
      'Olhando pro atleta, não pros pais: "E guarda isso, [atleta]: se você tá vendo essa apresentação, é porque tem o que é preciso. A gente não perde tempo montando plano pra quem não tem."'
    ],
    perguntas: [],
    crm: ['Quem está na call (pai, mãe, atleta) e se algum decisor falta.'],
    atencao: 'Chame cada um pelo nome desde o primeiro minuto. Decisor fora da call: pare aqui e reagende. O gancho apresenta o inimigo comum, o olhômetro: avaliar a olho, em poucos minutos, sem dado e sem acompanhamento depois. Família, atleta e você ficam do mesmo lado da mesa contra ele. Ataque o método, nunca o avaliador nem clube nenhum. O selo de dossiê leva o nome do atleta e, com o link do painel (?a=), o código do registro dele: o deck é o dossiê dele. Bastidor ao vivo (01) só se for verdade: vire pro lado e resolva em voz alta o contrato de outro atleta. A frase "se você está vendo isso" volta em vários slides: é o fio da conversa, e ela é pro atleta.'
  },
  { nome: 'Por que você', min: 1.5,
    fala: [
      'Veio do Zyron: "[atleta], o Zyron analisou o teu vídeo, e a equipe aprovou o que viu: [característica]. Não é todo mundo que chega até essa conversa."',
      'Veio do formulário: "[atleta], você contou pra gente: [experiência]. Foi isso que a equipe viu. Você já é jogador, o que falta é o caminho."',
      'Sem contexto: "A equipe analisou o teu jogo e aprovou o teu perfil. Por isso vocês estão aqui."',
      'Exclusividade (03): "Eu não falo com toda família. Se o [atleta] chegou até aqui, é porque tem o perfil que a gente procura."',
      'Plante o espelho, como quem acabou de perceber: "Sabe que, lendo o teu perfil, você me lembrou muito um atleta nosso? Daqui a pouco eu te mostro quem é." Não fale o nome ainda: a curiosidade segura a atenção até o slide 16.',
      'O plano é dele, olhando pro atleta: "Esse plano é só do [atleta]: nenhum outro atleta tem o mesmo. Ele sai da tua história e do teu jogo."',
      'Ponte: "Hoje eu trago o plano pra levar você até lá."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Confirme o que ele já contou, nunca pergunte de novo. "Só do [atleta]" é sobre o plano, nunca sobre o nível dele: nada de "você é único", "especial" ou "o melhor". Use as palavras do Contexto do CRM. O atleta sai deste slide sabendo que foi escolhido. O espelho só entra com o caso real preenchido na ficha (grupo Caso espelho); sem caso, pule a frase.'
  },
  { nome: 'O combinado', min: 5,
    fala: [
      '"Antes de te mostrar o plano, deixa eu confirmar o que eu já sei, pra não gastar o tempo de vocês com pergunta repetida. Eu confirmo, vocês corrigem."',
      'Leia cada linha da tela com as palavras deles (4.3): "[mãe], você falou pro estrategista esportivo que [dor]. Continua assim?"',
      'Aspiração: "[atleta], se tudo der certo, onde você quer estar daqui a dois anos?"',
      'Impacto (4.4): "De 0 a 10, quanto vocês querem ver o [atleta] num clube profissional?" Espere. "E por que esse número?" Resposta menor que 10: "E por que não é menos?"',
      'Combinado (4.2), lendo a linha de baixo da tela: "Vocês combinaram com o estrategista esportivo que, se o plano fizer sentido, decidem hoje, os dois juntos. Continua valendo? Pode ser não, tudo bem. Só não vale \'vou pensar\'." Espere o sim dos dois.',
      'Necessidade explícita (4.5): "Vocês querem que eu mostre como seria o plano do [atleta]?" Espere o "quero".'
    ],
    perguntas: ['Continua assim? Mudou alguma coisa?', '[atleta], onde você quer estar daqui a dois anos?', 'De 0 a 10, quanto vocês querem ver ele num clube? Por quê?', 'Se fizer sentido, vocês decidem hoje, juntos?', 'Querem que eu mostre o plano?'],
    crm: ['O que mudou desde a R1.', 'A aspiração do atleta, com as palavras dele.'],
    atencao: 'É aqui que você previne o "preciso ver com minha esposa" e o "vou pensar": os dois decisores na call e o combinado dito em voz alta, e agora também escrito na tela, pra você apontar de novo no 24. Quem justifica o próprio número se convence sozinho. Resposta morna ao "querem ver o plano?": volte pro impacto antes de seguir. A tela mostra só o que a família lê; as perguntas ficam na fala.'
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
    atencao: 'É a dor da Bíblia (etapa 02), antes do plano. O olhômetro é o inimigo comum, e família, atleta e você ficam do mesmo lado da mesa. Ataque o método, nunca a pessoa: o avaliador de peneira faz o que dá em vinte minutos com dezenas de garotos. Nada que chame avaliador de incompetente, e nenhum clube citado. "Vinte minutos" e "dividida entre 22" são a referência da tela: ajuste ao que a família contou e não invente número. Depois da pergunta, silêncio: aperte S (aqui o silêncio conta sem trocar de slide). A coluna "A resposta" é preenchida no 11, com o Zyron. Desarma "já tentamos peneira", "será que ele é bom o suficiente?" e "vou ver outras opções" antes de aparecerem.'
  },
  { nome: 'O planejamento de carreira', min: 5,
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
    atencao: 'Amarre cada etapa ao que eles disseram no alinhamento. Não prometa prazo, clube ou contrato. O tripé da Bíblia fica escrito na tela: Ser visto, Ser preparado e Ser apresentado são o passo de cada plano do 23, um por degrau. Previne "ele não pode ir pra outro estado": hoje ele não vai pra lugar nenhum, isso só acontece quando o clube chamar. O caminho da tela é a estrutura completa, a do Legacy: gerente de carreira, vitrine com clubes e AGN e a ida organizada. Com o PRO ou o Scout PRO na ficha, não diga que o plano dele entrega isso: o 23 mostra o que cada plano entrega.'
  },
  { nome: 'E se?', min: 0.5,
    fala: [
      'Ponte do plano, apontando a etapa "Agora" do slide anterior: "Eu falei que o Zyron e o gerente de carreira leem o jogo do [atleta]. Deixa eu te mostrar o que isso quer dizer."',
      '"E se alguém visse cada lance dele? Cada decisão, cada movimento sem a bola, e levasse isso até quem procura exatamente um jogador como ele?"',
      '"O que mudaria pra vocês se ele fosse visto assim?" Espere.'
    ],
    perguntas: ['O que mudaria pra vocês se ele fosse visto assim?'],
    crm: [],
    atencao: 'Bloco do Zyron (slides 06 a 09), o mesmo que a família viu na R1, e depois o campo (10) e a resposta ao olhômetro (11), que são novos. Sonho e o que falta já estão na ficha e foram confirmados no 03: não pergunte de novo. Se todos os decisores estavam na R1, passe rápido do 06 ao 09 e use cada slide como lembrete; se um decisor não estava, mostre inteiro, com o vídeo. O 10 e o 11 são sempre inteiros.'
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
    atencao: 'O 07 abre como a resposta ao olhômetro do 04: gelo na tela, laranja só no olhômetro. Exclusividade: o acesso ao Zyron é pra quem passa pelo filtro. O Zyron analisa o vídeo que a família envia, lance a lance: nunca diga que ele assiste jogos inteiros. "Precisão" aqui é lance a lance, mesmo critério e evidência em vídeo: nunca percentual de acerto, nunca "a IA não erra", nunca "mais preciso que qualquer olheiro".'
  },
  { nome: 'O Zyron trabalhando (vídeo)', min: 1.5,
    fala: [
      'Antes do play: "Repara no que ele marca em cada lance." Dê o play (espaço no deck ou os capítulos no apresentador) e fique quieto.',
      'Depois: "Consegue imaginar o jogo do [atleta] passando por aí? É isso que entra no plano dele, a cada vídeo novo."'
    ],
    perguntas: ['Consegue imaginar o jogo do [atleta] passando por aí?'],
    crm: [],
    atencao: 'Compartilhe a guia com áudio e teste antes. Se todos os decisores viram o vídeo na R1, não rode inteiro: use os capítulos "O relatório: o que treinar" e "A base de clubes". Se travar na chamada, siga pro próximo slide e explique com os cinco verbos. Com o vídeo do atleta no painel, quem prova é o jogo dele, no 13: aqui, rode só "A leitura lance a lance" e "A base de clubes".'
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
  { nome: 'O seu lugar em campo', min: 2.5,
    fala: [
      'Olhando pro atleta, apontando o marcador em destaque: "Olha o seu lugar, [atleta]. [posição], aqui no campo."',
      '"Todo elenco tem uma lacuna. Você não precisa ser o melhor entre 22. Precisa ser encontrado por quem procura um [posição] como você."',
      '"O Zyron encontra o perfil. A gente faz a ponte, e o gerente de carreira prepara o [atleta] pra quando o clube chamar."',
      'A base, apontando a faixa de clubes: "O perfil do [atleta] é cruzado com a base do Zyron: mais de 250 clubes, aqui e lá fora. Esses dez são só o começo. E quem faz a ponte com eles é a nossa equipe."',
      'O cartão, sem ler tudo: "E esse é o teu cartão: quem você é hoje. A leitura do teu jogo vem daqui a pouco, ao vivo."',
      'Pro atleta, e espere: "Se imagina aí?"'
    ],
    perguntas: ['[atleta], se imagina aí?'],
    crm: ['A reação do atleta ao campo, com as palavras dele.'],
    atencao: 'A peça central da exclusividade: o atleta se vê dentro do jogo, na posição dele, com o nome dele. O campo sai da posição da ficha: sem posição reconhecida, ele aparece sem destaque, com "O seu lugar entra aqui." Preencha antes da call, e pé e altura, se tiver, pro cartão. A formação é ilustrativa: nenhum jogador, escudo ou clube escalado. A lacuna é a ideia, não um fato sobre um clube: nunca diga que existe vaga num clube específico, nem prometa clube, prazo ou contrato. O cartão mostra só o que está na ficha: sem nota, sem atributo, sem porcentagem. A leitura do jogo é do 13, dita ao vivo. Se perguntarem qual clube: "Isso depende do perfil dele e de como ele evolui; é o que o gerente de carreira acompanha com vocês." Fale de rede e de encaixe, nunca de "vaga garantida".'
  },
  { nome: 'Olhômetro × Zyron', min: 1,
    fala: [
      'Feche a coluna do 04: "Lembra da coluna vazia? Aqui ela tá preenchida." Leia linha por linha, o olhômetro e depois o Zyron: "Os lances que calharem de ser vistos, contra todos os lances do vídeo. Atenção dividida entre 22, contra só em você. A memória do avaliador, contra um relatório com a evidência em vídeo. \'A gente te liga\', contra o acompanhamento da tua evolução. Um clube, num dia, contra quem procura o teu perfil."',
      'O título, em voz alta: "O olhômetro olha. O Zyron mede."',
      'Fecho: "Os grandes clubes já escolhem jogador com dados há anos, por dentro. Agora essa leitura joga do lado do [atleta]."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'A mesma tabela do 04, na mesma ordem: a família reconhece as linhas e vê a resposta encaixar. Não cite nome de clube como exemplo de quem usa dados. As peneiras a família já contou no 04: não pergunte de novo. Aqui fique só na análise: o slide 12 volta ao olhômetro pelo lado do serviço inteiro.'
  },
  { nome: 'O que ninguém mais tem', min: 2.5,
    fala: [
      'Volte ao olhômetro do 04, agora pelo serviço inteiro: "Vocês já me contaram como foi nas peneiras. Agora olha o resto: quem acompanha, quem leva aos clubes e quem corre o risco."',
      'Linha por linha: "Na peneira, quem analisa é um avaliador em vinte minutos. Aqui, é o Zyron, com dados reais do jogo dele. Hoje, com inteligência artificial, os clubes estão cada vez mais escolhendo atleta assim."',
      '"Depois da peneira, ninguém acompanha. Aqui, o gerente de carreira olha pra ele todo dia."',
      '"Na peneira, quem leva ele pros clubes são vocês, torcendo pra alguém olhar. Aqui, somos nós, com mais de 250 clubes na rede e a AGN Football."',
      '"E o risco: na peneira, é todo de vocês. Aqui, a gente só ganha quando ele fecha."',
      'A virada, pro atleta: "[atleta], o olhômetro pode não ter te visto. O Zyron viu. Se não tivesse visto, você não estaria nessa conversa."',
      'Pro atleta (6.3), com o Legacy na ficha: "Gerente de carreira todo dia e um agente só teu. Isso é estrutura de atleta profissional. Você vai começar a viver como um."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Depois do olhômetro (04) e do bloco do Zyron (06 a 11), use este slide como resumo do serviço inteiro: passe rápido por "quem analisa", que o 04 e o 11 já mostraram, e demore em quem acompanha, quem leva aos clubes e quem corre o risco. Este slide desarma três objeções antes de aparecerem: "já tentamos peneira", "isso de IA funciona?" e "vou ver outras opções". As peneiras a família já contou no 04: use os números dela, sem perguntar de novo. Termine na virada: a peneira que não viu ele vira prova de que o problema não era ele. A coluna "Com a gente" é a estrutura completa, a da Assessoria de Elite Legacy (a nota no pé da tela diz isso). Com o PRO ou o Scout PRO na ficha, fale da estrutura, não do plano: gerente de carreira todo dia e a ida aos clubes são do Legacy. O 23 volta a estas linhas, plano por plano.'
  },
  { nome: 'IA na Prática', min: 5,
    fala: [
      'Com o vídeo dele no painel, a tela mostra o jogo dele lance a lance. Ponte, logo depois do 12: "Agora eu quero que vocês vejam o jogo do [atleta] como ninguém olhou até hoje: lance a lance."',
      'Olhando pro atleta: "[atleta], presta atenção: o que aparece agora é só seu." Dê o play (espaço ou o botão; o vídeo começa mudo e o Som liga o áudio) e fique quieto.',
      'Um avanço por vez, uma frase por avanço. Avanço 1, a linha do tempo e os lances: "Na peneira, o olhômetro viu vinte minutos de coletivo. Aqui é cada lance do vídeo, com o minuto e o porquê." Se o painel diz "uma seleção de lances", troque por "aqui são os lances que a gente marcou, com o minuto e o porquê".',
      'Avanço 2, a rosca e os pontos fortes: leia o número da rosca como está na tela e os pontos fortes, sem inflar nada.',
      'Avanço 3, as prioridades e o primeiro foco: "E aqui é o que a gente treina primeiro. Não é defeito: é o caminho."',
      'Peça pra família escolher um lance da lista e comente esse. No apresentador, os lances são capítulos: clique e o vídeo pula pra ele, 2 s antes.',
      'A fonte, sempre como o painel diz: com "Leitura do Zyron", "o Zyron leu o teu vídeo"; com "Leitura da equipe", "a nossa equipe leu o teu vídeo, lance a lance", e o Zyron não entra nessa frase.',
      'Fecho, apontando a frase de baixo: "Isso existe porque o [atleta] mandou este vídeo. Outro vídeo, outro relatório. A cada vídeo novo, um relatório novo."',
      'Sem vídeo no painel, a tela é a leitura ao vivo de sempre: "Eu falei que o Zyron viu. Agora eu quero que vocês vejam com os próprios olhos o jogo do [atleta] do jeito que o Zyron vê. Ao vivo, aqui na nossa chamada." Antes do play: "[atleta], presta atenção: o que aparecer agora fala só de você." Troque o compartilhamento do Meet pro vídeo do [atleta], rode a leitura na frente da família e fique quieto. O resultado é dito ao vivo, por quem conduz a leitura; o slide não antecipa nada.'
    ],
    silencio: '"[pai], [mãe], o que vocês sentiram vendo o jogo dele lido assim?" E pare. Deixe a família falar primeiro.',
    perguntas: ['[atleta], alguém já tinha olhado o teu jogo desse jeito?', '[pai], [mãe], o que vocês sentiram vendo o jogo dele lido assim?', 'Qual lance vocês querem que eu comente?'],
    crm: ['Reação do atleta e da família à leitura, com as palavras deles.', 'O lance que a família escolheu e o que disseram dele.'],
    atencao: 'Com vídeo no painel, o slide só mostra o que o painel guardou, na fonte que o painel diz (Zyron ou Equipe). Não diga nada que os lances e os textos não mostram: nada de nota geral, ranking, percentil ou comparação com outros atletas. Com "Leitura da equipe", nada na sua fala atribui a leitura ao Zyron. A rosca é só a conta dos lances marcados: leia pontos fortes e prioridades, os dois, sem inflar. O relatório da call é deste vídeo: não prometa que é o relatório do plano (o plano entrega a leitura de cada vídeo novo, no ritmo dele). Privacidade: vídeo de menor, só com a autorização do responsável registrada no painel, só pelo link da apresentação dele, e ele sai do ar sozinho em 90 dias; nunca mostre o vídeo de um atleta a quem não é da família dele. Sem vídeo no painel, com o painel fora do ar ou com o vídeo que não carrega, o slide volta sozinho pra leitura ao vivo (o apresentador avisa) e vale a regra de sempre: o slide não mostra resultado, quem fala é quem conduz a leitura, ao vivo, no Meet. Teste antes da call: play, som e pular pelos lances. Vem logo depois do 12 de propósito: a virada "o olhômetro pode não ter visto você" vira prova na hora, com o jogo dele. Depois da pergunta, o silêncio: aperte S (aqui conta sem trocar de slide).'
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
  { nome: 'AGN Football', min: 2.5,
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
    atencao: 'Como ser sagaz com o espelho: fale como quem acabou de perceber, não como quem leu. Plante no 02 ("você me lembrou um atleta nosso"), revele aqui com nome, clube e link, e retome no 20 ("igual o [caso]") e no 25. Escolha o perfil mais parecido em posição, idade e nível, na tabela do CASOS.md ou nos publicados da AGN: é a semelhança que faz o atleta se enxergar ali. Só caso real e nosso: a família abre o link na hora, e um caso inventado derruba a venda e a empresa. Quanto mais nomes, com o link de cada um, mais a família entende que não é sorte, é método (14). A AGN divulga: não diga que ela contrata ou garante clube. A arte do avanço mostra jogadores que passaram pela AGN, não atletas da Jogador de Elite: nunca diga que são nossos e não cite clube, valor ou história de nenhum deles além do que está na tela. Se a família reconhecer alguém, deixe ela falar.'
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
    atencao: 'O slide abre só com a pergunta: espere o chute da família antes do primeiro avanço. Cada avanço mostra uma frente com o valor anual, e a soma da direita sobe junto; o último avanço destaca o total, R$ 30.000 por ano, com tudo junto. O apresentador mostra o que entra no próximo avanço. Ordem do playbook: régua, conta, sem certeza (este slide), até lá e filtro (18 e 19), contrato (20), garantia (21), a vaga (22), os planos (23), número (24), silêncio. Aqui é o valor da estrutura inteira, a do Legacy, não o preço de um plano. Previne "o valor tá muito alto".'
  },
  { nome: 'Até lá, a gente investe', min: 2,
    fala: [
      '"Até lá, quem investe no [atleta] somos nós. Tempo: o gerente de carreira olhando pra ele todo dia. Esforço: contato com clube, vídeo, avaliação, a ida pro clube. Profissionais: as sete frentes. Tecnologia: o Zyron."',
      '"O que vocês investem é só o custo mínimo pra essa estrutura existir, com o gerente de carreira e os profissionais dedicados a ele. O resto é investimento nosso, porque a gente acredita nele."',
      'Esforço zero (6.6): "E a partir de agora isso não é mais um peso de vocês. Vocês não precisam aprender nada novo, não precisam mudar a rotina, não precisam sair correndo atrás de clube. A única coisa que fica com vocês é continuar apoiando o [atleta] em casa."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Resposta pronta pro "mas vocês não ganham no contrato? Por que cobram?": o lucro vem do contrato; isso aqui é o custo mínimo da estrutura até o contrato sair. Nunca fale "onboarding", "etapas", "acessos": é promessa pro pai e pra mãe, não fluxo de produto. Aqui é a estrutura inteira, a do Legacy. Com o PRO ou o Scout PRO na ficha, não prometa ao plano o gerente de carreira todo dia; Os sete módulos de formação já estão no Scout PRO. O acompanhamento humano e os encaminhamentos seguem o escopo de cada plano. O 23 mostra o que cada plano entrega.'
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
  { nome: 'Garantia total', min: 1.5,
    fala: [
      '"E pra vocês começarem tranquilos: garantia total. Todo o valor investido é devolvido."',
      'No Legacy, a média, apontando a tela: "A média de fechamento dos nossos atletas é de cerca de três meses."',
      '"A gente confia no trabalho, na estrutura e no método. Por isso, se vocês aplicarem o método e não fizer sentido pro momento de vocês, o dinheiro volta inteiro. Sem burocracia."',
      '"O risco de começar fica com a gente. O único risco de verdade é o [atleta] ficar parado mais um ano."',
      'A diferença, com franqueza: "A garantia é do investimento. Contrato ninguém sério garante: quem te promete contrato tá mentindo. O que a gente garante é o trabalho, todo dia."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Confira o prazo e as condições da devolução antes da call (campo Prazo da garantia na ficha). Se houver prazo, fale o prazo. A garantia vem antes do número de propósito: tira o medo de errar na hora de decidir. Responde "tem garantia?", "e se não der certo?" e parte do "vou pensar". Pra acionar, a família comprova que aplicou o método, como diz o rodapé do 21: se perguntarem, diga com clareza, sem esconder. A média de três meses só aparece com o Legacy na ficha; é dado da casa, não prazo.'
  },
  { nome: 'A vaga', min: 2,
    fala: [
      'Só com o Legacy na ficha (turma e vaga na tela). Escassez, só com o número real da semana (08): "Dessa turma de 10, restam [vagas]."',
      'Início imediato, no Legacy: "Confirmando hoje, o [gerente] entra em contato com vocês, e o Zyron já começa a acompanhar o [atleta]."',
      'O relógio (9.3), no Legacy, apontando o caminho da tela: "Hoje, a vaga. Em até três meses, mais de 93% dos nossos estão encaminhados. E o dia que importa pra vocês e pra gente: a assinatura. Se decidir hoje, esse relógio começa hoje. Se decidir daqui a uma semana, o [atleta] começa uma semana depois."',
      'Com a Assessoria PRO ou o Scout PRO na ficha, a tela vira "o começo": "Confirmando hoje, a equipe entra em contato com vocês, e o Zyron começa a ler o jogo do [atleta]. A cada vídeo novo, sai um relatório novo. E o ritmo, vocês escolhem agora."',
      'Ponte pros planos: "Agora eu te mostro como ter isso do lado do [atleta]."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Vagas só com o número real da semana; prazo só com o prazo confirmado (campos da ficha). Turma, vagas, os 93% em até três meses e o dia da assinatura são do Legacy: com o PRO ou o Scout PRO na ficha, a tela não mostra nada disso, e a fala também não. O 23 mostra os planos com o investimento de cada um, e o 24 fecha com o plano da ficha.'
  },
  { nome: 'Os planos', min: 3,
    fala: [
      'Ponte, sem falar de dinheiro, lendo o título: "[atleta], na peneira você ficou sozinho. Daqui pra frente, não fica mais. O que muda de um plano pro outro é quem fica do teu lado, e o acompanhamento que você recebe. O Zyron tá nos três."',
      'Um avanço por coluna (→ ou espaço). Cada coluna é a parte de um plano: o ritmo, o investimento e o que ele tem, cargo por cargo. Scout PRO: "Pra começar: o Zyron lê cada vídeo novo e aponta os teus pontos fortes e prioridades, o analista de performance manda o relatório da tua evolução, e você tem o relatório de entrada, o histórico e o guia da peneira."',
      'Assessoria PRO: "Tudo do Scout PRO, e uma equipe do teu lado toda semana: o teu estrategista de carreiras liga, você tem os sete módulos de aulas (performance, psicologia, nutrição, comportamento e imagem), conta com um estrategista esportivo, entra no networking com outros atletas e nas aulas extras, e a gestão de carreiras faz pelo menos 5 encaminhamentos de oportunidades por mês, pra clubes do Brasil e do mundo. Tudo isso por metade do Legacy."',
      'Assessoria de Elite Legacy, a coluna em destaque: "Tudo da Assessoria PRO, e o ideal, o completo: o teu estrategista de carreiras e o gerente de carreira de perto todo dia, assessoria individual com o David Willer todo mês e acompanhamento direto com ele no WhatsApp. A gestão de carreiras faz pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora, com conexão direta com clubes e com a AGN. O estrategista esportivo liga toda semana, em cima dos teus relatórios e do teu desenvolvimento, você tem um plano de carreira feito pro teu jogo, e quem corre atrás de clube, vídeo e avaliação é a gente. Nas seletivas, a gente acompanha e planeja a logística com vocês. E a turma é de 10: atenção máxima, de perto."',
      'O investimento tá no topo de cada coluna, com a parcela em destaque. Leia uma vez, apontando, sem fazer conta: "O Scout PRO fica em R$ 997, a Assessoria PRO em R$ 1.497 e o Legacy em R$ 2.997, todos vitalícios, em 10x sem juros." E volte pro ritmo.',
      'As perguntas que acertam o plano, sem falar de dinheiro: "Qual ritmo faz sentido pro [atleta]? Um relatório, alguém ligando toda semana ou alguém do lado dele todo dia?" Espere. "Vocês querem os sete módulos de aulas e um estrategista junto?" Espere. "E o David Willer de perto, com assessoria individual todo mês e as conexões e os clubes dele: é o que vocês querem agora?" Espere.',
      'Recomende um, em voz alta, com as palavras deles: "Pelo que vocês me falaram, eu recomendo o [plano]." Se a resposta apontou outro, troque o plano no apresentador antes do último avanço. Último avanço: o [plano] aparece destacado na tela, como a sua recomendação.',
      'Ponte pro número: "Agora eu te mostro o investimento do [plano]."'
    ],
    perguntas: ['Qual ritmo faz sentido pro [atleta]? Relatório, acompanhamento semanal ou diário?', 'Vocês querem os sete módulos de aulas e um estrategista junto?', 'Vocês querem o David Willer de perto, com assessoria individual todo mês?'],
    crm: ['O ritmo que a família escolheu, com as palavras deles, e o plano que você recomendou.'],
    atencao: 'O título volta ao 12 ("Sozinho, na peneira"): é a dor que a família já contou, e cada coluna responde com quem fica do lado do atleta. Deixe o título pesar um segundo antes da primeira coluna. Ao lado do ritmo, o passo do tripé do 05 (Ser visto, Ser preparado, Ser apresentado), um por degrau. O 23 mostra cada plano na sua parte, com o investimento no topo da coluna, pra família ver tudo (decisão do dono, 06/10/2026). Cada coluna é a parte de um plano: o topo com o ritmo e o investimento, embaixo o que ele acrescenta ao degrau de baixo, cargo por cargo. Não leia tudo: aponte o que muda de um degrau pro outro. O Legacy aparece em destaque, com a moldura que brilha e o rótulo "O ideal": é o completo e tem a lista mais longa. Se a ficha recomendar outro plano, fale com franqueza: "o ideal é o Legacy; pro momento de vocês, a Assessoria PRO coloca uma equipe do lado dele toda semana, por metade do valor". Apresente pelo ritmo, não pelo preço: o número falado com silêncio é o do 24, o do plano recomendado. Ordem da casa: o Legacy abre (tudo o que a família viu até o 22 é a estrutura dele), a Assessoria PRO entra como o formato mais enxuto: uma equipe do lado dele toda semana, por metade do Legacy, e o Scout PRO só se o caixa realmente pedir. BANT não é interrogatório: as perguntas são de ritmo, não de dinheiro. A conexão direta com clubes e AGN, os 15 encaminhamentos por mês, a turma e os 93% são do Legacy: não atribua ao PRO nem ao Scout PRO. O encaminhamento vem a partir da Assessoria PRO, com pelo menos 5 por mês. Nunca "o mais barato", "o mais vendido" ou "o mais escolhido". Se perguntarem qual compensa, responda pelo ritmo, não pela diferença de preço.'
  },
  { nome: 'O investimento', min: 4,
    silencio: 'O número, uma vez, com a parcela. E silêncio: quem fala primeiro depois do preço perde.',
    fala: [
      'O número, uma vez, apontando a tela: "[pai], [mãe], o investimento no [plano] é de [preço], em 10x sem juros de [parcela]." E pare. Tecla S.',
      'Por que é vitalício, se perguntarem ou depois do silêncio: "É vitalício porque a gente tem certeza do nosso trabalho: vocês investem uma vez e não pagam de novo. Esse valor só custeia os profissionais parceiros que vão cuidar do [atleta]: ele paga o trabalho deles, não é o nosso lucro. O nosso lucro vem do contrato profissional." E olhando pro atleta: "[atleta], a gente só ganha se você ganhar."',
      'Depois do silêncio: "E com garantia total: todo o valor investido de volta."',
      'No Legacy, o completo, apontando a tela: "Um atleta médio nosso fecha ganhando, em média, R$ 30 mil+ por mês. A parcela é uma fração de um mês de contrato, quando ele fechar." E, se o valor pesar: "É o único com o estrategista de carreiras e o gerente de carreira todo dia, assessoria individual com o David Willer todo mês e pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora."',
      'Na Assessoria PRO, a acessível, apontando a tela: "É uma equipe do lado do [atleta] toda semana: o estrategista de carreiras, os sete módulos de aulas e pelo menos 5 encaminhamentos de oportunidades por mês, por cerca de metade do valor do Legacy."',
      'No Scout PRO, o começo: "É o jeito de começar, com o Zyron e um analista de performance olhando pro jogo dele."',
      'Por dia, do plano da tela, se o valor pesar: no Legacy, "No prazo médio de 3 meses, dá [por dia] por dia."; no PRO e no Scout PRO, "Dividido nos primeiros 3 meses, dá [por dia] por dia."',
      'Fechamento (Modo A, 08): "Confirmando hoje, eu já aviso o [gerente]. Fica melhor no Pix ou no cartão?" No PRO e no Scout PRO: "eu já aviso a equipe".',
      'Depois do "Pix ou cartão?": mande no WhatsApp o link de pagamento do [plano], na própria call, e faça o pagamento com a família na linha. O link não está no deck: tenha o de cada plano à mão.',
      'Objeção: acolha, isole e volte: "Resolvido isso, eu confirmo agora. Pix ou cartão?"',
      'Trocar de plano, pelo escopo e nunca por desconto. Pra descer: "Existe um formato mais enxuto, a Assessoria PRO, e o que muda é isto." Pra subir: "Se vocês quiserem o completo, o Legacy acrescenta isto." Use os botões de plano no apresentador: a tela do 24 troca junto, e o apresentador mostra o que sai ou o que entra. Descendo pro Scout PRO, diga em voz alta: "o encaminhamento pra clubes vem a partir da Assessoria PRO." Saindo do Legacy: "a conexão direta com clubes e AGN e os 15 encaminhamentos por mês são do Legacy; na Assessoria PRO, são pelo menos 5."',
      '"Vocês combinaram de decidir hoje, lembra? Pode ser não, tudo bem. O que tá faltando pro sim?"'
    ],
    modoB: [
      '"Olha, eu não vou te vender nada hoje. Antes de abrir a vaga, eu apresento o [atleta] pro [gerente] e pra nossa equipe técnica, e são eles que decidem se ele entra nessa turma." No PRO e no Scout PRO, sem vaga nem turma: "eu apresento o [atleta] pra nossa equipe técnica, e são eles que decidem se ele entra."',
      '"Enquanto isso, conversem entre vocês e com o [atleta]. Se a equipe aprovar, vocês estão dentro?"',
      '"Amanhã até [hora] eu te dou o retorno da equipe. Fica de olho no telefone."',
      'No retorno: "[pai], boa notícia: o [gerente] e a equipe aprovaram o [atleta]. A vaga é dele até [hora]. Pra confirmar, é o investimento que eu te passei. Pix ou cartão?" No PRO e no Scout PRO: "a equipe aprovou o [atleta], e a entrada dele fica aprovada até [hora]."'
    ],
    perguntas: ['Pix ou cartão?'],
    crm: ['Resultado, plano fechado e forma de pagamento.', 'Modo B: a hora do retorno e o "estamos dentro".'],
    atencao: 'Aqui o número é o do plano da ficha (o 23 já mostrou os três), já com o parcelamento (10 x a parcela = o valor total): Scout PRO, R$ 997 vitalício, 10x de R$ 99,70; Assessoria PRO, R$ 1.497 vitalício, 10x de R$ 149,70; Legacy, R$ 2.997 vitalício, 10x de R$ 299,70. Fale o número uma vez e aperte S. Regra de ouro: depois do número, silêncio. Quem fala primeiro depois do preço perde. Os 3 meses do "por dia" são só a conta: no PRO e no Scout PRO, não diga "prazo médio" nem ligue esses 3 meses ao encaminhamento: os 93% em até três meses são dado do Legacy. Travou no valor: isole ("tirando o valor, tem mais alguma coisa?"), diagnostique (retorno ou dinheiro agora) e volte no slide 17, 20, 21 ou 23. Modo B só se a análise da equipe for real, e a tela não muda. Link de pagamento: fora do deck, pelo WhatsApp, só depois do sim.'
  },
  { nome: 'Bem-vindo', min: 3,
    fala: [
      'O fecho do campo, apontando a miniatura: "Olha o teu lugar de novo, [atleta]. O olhômetro não viu. A partir de hoje, a gente vê."',
      'Áudio de boas-vindas, com a frase da tela: "Bem-vindo, [atleta]." No Legacy: "A partir de hoje, o teu contrato profissional é o nosso objetivo." Na Assessoria PRO: "A partir de hoje, você tem uma equipe do teu lado, toda semana." No Scout PRO: "A partir de hoje, o teu jogo é lido de 15 em 15 dias."',
      'Só no Legacy, a imaginação, devagar, apontando o post da tela: "[atleta], imagina comigo. Daqui a alguns meses o teu telefone toca. É o [gerente]: \'o clube quer você\'. Você assina. No dia seguinte o teu nome tá publicado, igual o Joãozinho, igual o Kaio. Quem é a primeira pessoa que você liga?" Espere a resposta.',
      'Só no Legacy, pros pais: "[pai], [mãe], e nesse dia a gente ganha junto. Por isso, a partir de agora, quem corre atrás é a gente."',
      'O começo: no Legacy, "O [gerente] entra em contato com vocês, e o Zyron já começa a acompanhar o [atleta]." No PRO e no Scout PRO, "A equipe entra em contato com vocês, e o Zyron já começa a ler cada vídeo novo do [atleta]." E aponte o próximo passo da tela: no PRO, os encontros com a equipe de gestão de carreiras; no Scout PRO, o próximo vídeo.',
      'Indicação, na hora: "[atleta], tem algum colega de time que joga no teu nível? A gente faz a avaliação dele também."'
    ],
    perguntas: ['No Legacy: quem é a primeira pessoa que você liga quando assinar?'],
    crm: ['Venda concluída no CRM e cadastro em Vendas (produto e ticket do plano fechado; a venda entra pendente até a aprovação do Executive).', 'A indicação.', 'O dia do primeiro contato (no Legacy, do gerente).'],
    atencao: 'A imaginação sela a decisão: quem descreve o dia da assinatura em voz alta não volta atrás no dia seguinte. O post da tela é ilustrativo: diga "imagina", nunca "vai ser". Com caso espelho, feche com ele: "igual o [caso]". Na indicação, peça o contato do responsável do colega, não do menino. Só prometa prazo confirmado. No PRO e no Scout PRO, a tela não tem post, contrato nem AGN: fique no ritmo do plano e no próximo passo, sem prazo. A miniatura do campo só aparece com posição reconhecida na ficha.'
  }
];

/* As etapas da Bíblia das Vendas (processo-r2) e os slides de cada uma. O apresentador mostra a etapa no cabeçalho;
   o 03 e o 12 cobrem duas. A Bíblia cita estes números: mudou aqui, muda lá. */
window.ETAPAS = [
  { nome: 'Conexão', slides: [1, 2, 3] },
  { nome: 'Dor e sonho', slides: [3, 4, 12] },
  { nome: 'O plano', slides: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
  { nome: 'Fechamento', slides: [17, 18, 19, 20, 21, 22, 23, 24] },
  { nome: 'Próximo passo', slides: [25] }
];

/* O campo do slide 10 (e a miniatura do 25): a posição da ficha, texto livre do painel, vira um marcador da formação 4-3-3.
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
  { q: 'O valor tá muito alto', slides: [17, 18, 20, 21, 23, 24], prev: 'Cenário comprado, a estrutura e o Zyron apresentados, a conta da estrutura (slide 17), o contrato (slide 20) e os planos (slide 23) antes do número.', resposta: [
    'Acolher e isolar: "Entendo. Tirando o valor, tem mais alguma coisa que impede o [atleta] de começar?"',
    'Diagnosticar: "Quando você fala que tá alto: você não vê o retorno, ou é o dinheiro agora?"',
    'Se for retorno, com o Legacy na tela: "É o completo: o estrategista de carreiras e o gerente de carreira do lado dele todo dia, assessoria individual com o David Willer todo mês e pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora, além de tudo do PRO. Sozinhos, vocês iam pagar R$ 30.000 por ano por essa estrutura, e sem certeza nenhuma."',
    'Se for retorno, com a Assessoria PRO na tela: "É uma equipe do lado dele toda semana: o estrategista de carreiras ligando, os sete módulos de aulas, um estrategista esportivo, networking e aulas extras, e pelo menos 5 encaminhamentos de oportunidades por mês, pra clubes do Brasil e do mundo, por cerca de metade do valor do Legacy."',
    'Se for retorno, com o Scout PRO na tela: "É o começo: o Zyron lendo cada vídeo novo e um analista de performance medindo a evolução dele a cada 15 dias."',
    'Por dia, do plano da tela: no Legacy, "No prazo médio de 3 meses, dá [por dia] por dia."; no PRO e no Scout PRO, "Dividido nos primeiros 3 meses, dá [por dia] por dia." Os 3 meses do PRO e do Scout PRO são só a conta, não prazo de encaminhamento.',
    'E o contrato, como referência da casa: "Lembra: hoje um atleta que a gente coloca fecha por volta de [faixa] por mês. O Joãozinho entrou numa situação parecida e hoje tá no Grêmio." Com caso espelho, use ele: "o [caso] tinha o mesmo perfil e hoje tá no [clube do caso]." Com o PRO ou o Scout PRO, não diga que o plano leva a esse contrato.',
    'O risco: "E se vocês aplicarem o método e não fizer sentido, todo o valor investido volta. Garantia total. O risco fica com a gente."',
    'Se for o dinheiro agora: "Se o dinheiro não fosse problema, o [atleta] começava hoje?" / "Então vamos resolver a forma: dá pra fazer em 10x sem juros. E se precisar, existe um formato mais enxuto." Desça um degrau pelo escopo, com os botões de plano no apresentador: ele mostra o que sai. Descendo pro Scout PRO, diga que o encaminhamento pra clubes vem a partir da Assessoria PRO.',
    'Mais vaga, quando o clima pedir: "Você acha que o sonho dele não vale parcelas mensais de [x] ou [y]?"',
    'Conduzir: "Então eu confirmo agora. Pix ou cartão?"'
  ], proibido: 'Desconto, "vou ver com meu gerente", baixar valor sem mudar o escopo' },
  { q: 'Preciso ver com minha esposa / meu marido', slides: [3], prev: 'O SDR marca a R2 com os dois; você confirma os dois antes e reforça o combinado no slide 03.', resposta: [
    '"Faz todo sentido, é decisão de família. E você, se dependesse só de você, o [atleta] começava?" (disse sim: virou aliado; hesitou: a objeção real é outra)',
    '"Então, se a [mãe] topar, vocês estão dentro?"',
    '"Liga pra ela agora e coloca no viva-voz. Em 10 minutos eu mostro o plano do [atleta], e vocês decidem juntos."',
    '"O que você acha que ela vai perguntar? Me fala que eu já te respondo."',
    'Modo B: "Eu apresento o [atleta] pra equipe hoje, e amanhã às [hora] eu falo com vocês dois com o retorno."'
  ], proibido: 'Mandar a proposta por WhatsApp "pra você mostrar pra ela".' },
  { q: 'Vou pensar', slides: [24, 21], prev: 'Combinado dito em voz alta no slide 03: "só não vale \'vou pensar\'".', resposta: [
    '"Claro. Pensar sobre o quê exatamente? O valor, conversar com mais alguém, ou alguma dúvida sobre o plano?"',
    '"O que vocês vão saber amanhã que não sabem agora?"',
    'O relógio, no Legacy: "Mais de 93% dos nossos são encaminhados em até três meses. Se decidir hoje, esses três meses começam hoje. Se decidir daqui a uma semana, o [atleta] começa uma semana depois." No PRO e no Scout PRO, sem os 93%: "Se decidir hoje, o Zyron começa a ler o jogo dele agora. Se decidir daqui a uma semana, ele começa uma semana depois."',
    'Sem risco: "E vocês podem decidir hoje tranquilos: se aplicarem o método e não fizer sentido, todo o valor investido volta. Garantia total."',
    '"Vocês combinaram com o estrategista esportivo de decidir hoje. O que tá faltando?"',
    'Modo B: "Pensem hoje, que eu levo o [atleta] pra equipe. Amanhã às [hora] eu te dou o retorno, e aí vocês me dizem se estão dentro."'
  ] },
  { q: 'Quanto tempo até ele ir pra um clube?', slides: [15, 22], prev: 'Os 93% em até três meses no slide 15 e o caminho da tela no slide 22.', resposta: [
    '"Mais de 93% dos nossos atletas são encaminhados pra clubes em até três meses."',
    '"Encaminhar é o clube que precisa do perfil dele receber ele pra avaliação. Dali em diante é o jogo dele, com o gerente de carreira preparando ele todo dia pra esse momento."',
    '"E quanto antes começa, antes esse relógio anda. Decidindo hoje, os três meses começam hoje."',
    'Com o Scout PRO na tela: "O encaminhamento pra clubes vem a partir da Assessoria PRO." Com a Assessoria PRO: "Na Assessoria PRO, a gestão de carreiras faz pelo menos 5 encaminhamentos de oportunidades por mês, pra clubes do Brasil e do mundo, e os encontros com a equipe mostram o que falta pro [atleta] ser encaminhado." Os 93% e os três meses são do Legacy: não use como prazo do PRO nem do Scout PRO.'
  ], proibido: 'Prometer data de contrato ou clube. Encaminhamento não é contratação.' },
  { q: 'Será que ele é bom o suficiente?', slides: [15, 2, 4, 10, 13, 19], prev: '"Se você está vendo isso, é porque tem o que é preciso" desde a capa, "não foi você, foi o olhômetro" (slide 04), o seu lugar em campo (slide 10), o jogo dele lido lance a lance (slide 13) e "nem tudo é talento" no slide 15.', resposta: [
    '"Se não fosse, ele não estaria nessa conversa. A equipe e o Zyron aprovaram o perfil dele: a gente só investe em quem acredita que vai chegar."',
    '"E nem tudo é talento. Talento ele tem. O que faltou até agora foi alguém levando ele até o clube certo, na hora certa."',
    'Com caso espelho: "O [caso] tinha o mesmo perfil, e a mesma dúvida em casa. Hoje tá no [clube do caso]."',
    'Com a leitura no 13: "Vocês viram: os pontos fortes estão ali, lance a lance, e as prioridades também. É por elas que a gente começa." Os dois, sem inflar.'
  ], proibido: 'Pôr o perfil do atleta em dúvida, nem pra "ser sincero". Dar nota geral ou comparar com outros atletas.' },
  { q: 'Mas vocês não ganham no contrato? Por que cobram?', slides: [20, 18, 24], prev: 'O "até lá, a gente investe" (slide 18) e o contrato (slide 20) antes do número.', resposta: [
    '"Exatamente: o nosso lucro vem do contrato. Isso aqui não é lucro, é o custo mínimo com os profissionais dedicados ao [atleta] até o contrato sair. Sem eles, não tem contrato pra ninguém ganhar." No Legacy, nomeie o gerente de carreira e as sete frentes; na Assessoria PRO, o estrategista de carreiras, o estrategista esportivo e os sete módulos de aulas.',
    '"Até lá, quem investe tempo, esforço, profissionais e tecnologia nele somos nós."'
  ] },
  { q: 'E se ele for dos que não chegam lá?', slides: [19, 15, 5], prev: 'Escada do sim no slide 19, com o atleta dizendo em voz alta que faz a parte dele.', resposta: [
    'No Legacy: "Mais de 93% dos nossos são encaminhados em até três meses. Quem fica pra trás, quase sempre, é por falta de disciplina e de compromisso: a parte que depende dele."',
    '"É por isso que a gente escolhe com quem trabalha. Ele passou no filtro." No Legacy, some: "e ele tem o gerente de carreira e o Zyron em cima todo dia." Na Assessoria PRO: "e ele tem o estrategista de carreiras ligando toda semana e a equipe olhando o que falta."',
    'Não pergunte pro atleta "você vai ser dos que não chegam?": é pressão direta sobre o menino.'
  ] },
  { q: 'E se não der certo? / Tem garantia?', slides: [21], prev: 'A garantia aparece antes do número, no slide 21.', resposta: [
    '"Tem. Garantia total: se vocês aplicarem o método e entenderem que não faz sentido, todo o valor investido volta, sem burocracia."',
    'Como acionar, se perguntarem: "Vocês mostram que aplicaram o método, como tá no contrato, e o valor volta inteiro." No Legacy, some: "E a média de fechamento dos nossos atletas é de cerca de três meses."',
    '"O que ninguém sério garante é contrato: quem te promete contrato tá mentindo. O que a gente tem é o trabalho, no ritmo que vocês escolheram, o Zyron, e a gente só ganha quando ele ganha. Se ele não avançar, quem perde primeiro somos nós." No Legacy, nomeie: o gerente de carreira todo dia.',
    '"O risco de verdade é ele ficar parado mais um ano."'
  ] },
  { q: 'Não tenho o dinheiro agora', slides: [24, 23], prev: 'Sinais de budget da ficha pra escolher o plano antes do 23: Legacy se a ficha não mostra aperto financeiro, Assessoria PRO se a dor financeira é forte.', resposta: [
    '"Se tivesse, ele começava hoje?"',
    '"Então o problema é só a forma. Dá pra fazer em 10x sem juros, ou num formato mais enxuto. Qual cabe melhor?"',
    'Do Legacy pra Assessoria PRO, pelo escopo: "Existe um formato mais enxuto, a Assessoria PRO: o estrategista de carreiras liga toda semana em vez de estar do lado dele todo dia, e saem o gerente de carreira, a assessoria individual com o David Willer, a ligação semanal do estrategista esportivo, a conexão direta com clubes e AGN e o acompanhamento das seletivas. O encaminhamento continua: pelo menos 5 oportunidades por mês, pra clubes do Brasil e do mundo, em vez de 15." Troque no apresentador: o 24 mostra o PRO.',
    'Da Assessoria PRO pro Scout PRO, só se o caixa não comporta o PRO: "O Scout PRO é o começo: o Zyron lendo cada vídeo novo e o relatório do analista de performance a cada 15 dias. Os sete módulos continuam no Scout PRO. Saem a ligação do estrategista de carreiras e o estrategista esportivo, o networking e as aulas extras, os encontros com a equipe e o encaminhamento pra clubes."',
    '"Assim que resolver a forma, a equipe já entra em contato. Isso não espera."'
  ], proibido: 'Desconto. Desce de plano só pelo escopo.' },
  { q: 'Ele não pode ir pra outro estado', slides: [5, 3], prev: 'Locomoção confirmada no alinhamento (slide 03) e "quando o clube chamar" no plano (slide 05).', resposta: [
    '"Hoje ele não precisa ir pra lugar nenhum. Isso só acontece quando o clube chamar." No Legacy, some: "e o gerente de carreira organiza a ida com vocês."',
    '"E vocês falaram pro estrategista esportivo: [locomoção]. Então isso a gente resolve junto quando chegar a hora."'
  ] },
  { q: 'Já tentamos peneira / empresário e não deu', slides: [4, 11, 12, 15], prev: 'O olhômetro antes do plano (slide 04), a resposta nos slides 11 e 12 e o "nem tudo é talento" no 15.', resposta: [
    '"Quantos garotos tinham nessa peneira? E quanto tempo olharam pra ele? Vinte minutos de coletivo?"',
    '"Então não foi ele que não deu certo. Foi o olhômetro. Ninguém analisou o jogo dele de verdade, e ninguém acompanhou ele depois. É exatamente isso que o Zyron e a gente fazem."',
    'No Legacy: "Nem tudo é talento: faltou quem levasse ele ao clube certo. Aqui, mais de 93% são encaminhados em até três meses."'
  ] },
  { q: 'Ele ainda é novo / Ano que vem a gente vê', slides: [22, 5], prev: 'A janela de idade no plano (slide 05).', resposta: [
    '"Com [idade + 1], a janela fica maior ou menor? Esperar um ano é um ano a menos de janela." No Legacy, com turma, some: "e é deixar a vaga dessa turma pra outro menino."',
    '"Os clubes estão pedindo jogador agora. Daqui a um ano, esse pedido vai pra quem começou hoje."'
  ] },
  { q: 'Isso é confiável?', slides: [14, 15, 16, 21, 9], prev: 'O depoimento de uma mãe (14), os números (15), a AGN (16), a garantia (21) e a autorização expressa do responsável no "como o Zyron funciona" (09) antes da pergunta.', resposta: [
    '"Vocês ouviram a mãe. E mais de 93% dos nossos são encaminhados em até três meses."',
    '"A gente tem relação direta com a AGN Football, com jogador nosso publicado lá. O Joãozinho fechou com o Grêmio, o Kaio com o Internacional. Te mando o link agora." [link AGN]',
    'Com caso espelho: "E o [caso], que tem o perfil do [atleta], tá lá também: [link do caso]."',
    '"E tem garantia total: aplicou o método e não fez sentido, todo o valor investido volta."',
    '"E aqui tá o nosso [site, Instagram ou CNPJ]."'
  ] },
  { q: 'Manda por WhatsApp que eu vejo com calma', slides: [], resposta: [
    '"O plano é do [atleta], não é folder. Explicado aqui, com vocês, é que ele faz sentido. O que você precisa ver pra decidir?"'
  ], proibido: 'Mandar proposta ou valor por WhatsApp.' },
  { q: 'Vou ver outras opções', slides: [12, 13, 16, 8, 4], prev: 'O olhômetro (04) e a comparação do slide 12 já fizeram as perguntas por eles; a leitura ao vivo do jogo dele (13) e o vídeo do Zyron (08) mostram o que ninguém mais tem.', resposta: [
    '"Compara mesmo. Pergunta pra eles: analisam o atleta com dados reais ou no olhômetro? Tem alguém acompanhando de verdade, no ritmo que vocês escolheram? Tem um agente como o Zyron? Leem o jogo do atleta ao vivo, na frente de vocês? E como eles ganham: em cima de vocês, ou só quando o atleta fecha?"',
    'Com o Legacy na tela, some: "Tem gerente de carreira todo dia? Levam o atleta aos clubes? Têm relação direta com a AGN?" E, com turma: "Só lembra que a vaga do [atleta] aqui não fica aberta pra sempre. A turma é de 10."',
    'Com a Assessoria PRO na tela, a acessível: "E vê quem coloca uma equipe do lado dele toda semana, com sete módulos de aulas, um estrategista esportivo e pelo menos 5 encaminhamentos por mês, por esse investimento."'
  ] },
  { q: 'Qual a diferença entre os planos?', slides: [23, 12], prev: 'A matriz do 23 responde antes da pergunta: as linhas do 12, em três ritmos.', resposta: [
    'O ritmo, antes do valor: "A diferença é com que frequência tem alguém olhando pro [atleta]: a cada 15 dias, toda semana ou todo dia. O Zyron tá nos três."',
    'Scout PRO: "Pra começar: o Zyron lê cada vídeo novo, e um analista de performance manda relatório a cada 15 dias."',
    'Assessoria PRO: "Tudo isso e uma equipe do lado dele toda semana: o estrategista de carreiras liga, ele tem os sete módulos de aulas, conta com um estrategista esportivo, entra no networking com outros atletas e nas aulas extras, e a gestão de carreiras faz pelo menos 5 encaminhamentos de oportunidades por mês, pra clubes do Brasil e do mundo. Por metade do Legacy."',
    'Legacy: "O completo: tudo do PRO, o estrategista de carreiras do lado dele todo dia, o gerente de carreira e assessoria individual com o David Willer todo mês, com acompanhamento direto no WhatsApp. E pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora, com conexão direta com clubes e com a AGN, e as seletivas acompanhadas, com a logística planejada."',
    'Conduzir: "Pelo que vocês me falaram, eu recomendo o [plano]. Faz sentido?"'
  ], proibido: 'Responder pela diferença de preço em vez do ritmo, chamar o PRO de "o mais barato" ou de "o mais vendido", atribuir ao PRO o que é do Legacy (conexão direta com clubes e AGN, os 15 encaminhamentos por mês) ou encaminhamento ao Scout PRO.' },
  { q: 'Isso de inteligência artificial funciona mesmo?', slides: [8, 9, 10, 11, 13, 2], prev: 'O Zyron trabalhando (08), os cinco verbos (09), o seu lugar em campo (10), olhômetro contra Zyron (11) e a leitura ao vivo do jogo dele (13).', resposta: [
    '"Clube grande já escolhe atleta assim há anos, aqui e lá fora, só que sempre por dentro, sem o atleta nem saber que foi visto desse jeito. A novidade é que agora isso chegou até o atleta."',
    '"É o que vocês viram no vídeo: o Zyron cruza o jogo do atleta com o que cada clube precisa. Por isso mais de 93% são encaminhados em até três meses."',
    'Se a leitura ao vivo já rodou (slide 13): "E vocês viram com o jogo do [atleta], ao vivo, aqui na nossa chamada."'
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

/* Os três planos: fonte única da tela (23 os planos, 24 o investimento, 25 bem-vindo), do apresentador e das notas-do-gestor.md.
   Do degrau de baixo pro de cima, e cumulativos: o PRO tem tudo do Scout PRO, o Legacy tem tudo do PRO.
   O plano da ficha (campo plano) é o que a tela mostra; vazio ou nome antigo vira o Legacy.
   Sem link de pagamento no deck: acertado o plano, o Gestor manda o link pelo WhatsApp, na call, só depois do sim.
   ticket: o que vai pro CRM e pro cadastro em Vendas. preco e parcela: o 23 (os três) e o 24 (o da ficha), vitalício, em 10x sem juros. porDia: só na fala (3 meses).
   marca: o nome com a cor de cada parte (az: azul, o Zyron e a leitura; ou: dourado, gente e carreira; br: branco; pre: a linha de cima,
   menor, menos no 23, onde o nome inteiro fica numa linha só). artigo: "a" quando o nome é feminino (a Assessoria PRO: "Tudo da
   Assessoria PRO, mais"); sem artigo, vale "o". antigos: nomes de antes (o Scouting PRO virou Assessoria PRO em 07/10/2026), pra ficha
   salva no navegador e o painel com o nome antigo continuarem mostrando o plano certo.
   descritor: o papel do plano na tela (23 e 24). selo: o papel no cartão do 25, sem conta de preço (sem selo, vale o descritor). promessa: a linha dele no 24. fala: como o Gestor fala dele. passo: o passo da tese da R2.
   rotulo e inclui: a lista do 24 (no PRO, só o que ele acrescenta ao Scout PRO; no Legacy, o que ele acrescenta ao PRO, em destaque).
   base: a linha que fecha a lista do Legacy. extras: o "Também vem" do Scout PRO (proposta, P9: o dono valida).
   vantagens: a parte do plano no 23, cargo por cargo ([cargo, benefício] ou [cargo, benefício, chave]: com chave, a linha só aparece
   se o plano tiver a chave, ex.: turma), só o que ele acrescenta ao degrau de baixo. O Legacy, o ideal, tem a lista mais longa.
   bemVindo, rotina e proximo: o 25 do PRO e do Scout PRO (o do Legacy é o de sempre, com o gerente e a assinatura).
   sai: o que sai ao descer pra ele, a partir do degrau de cima. diferenca: o que o degrau de cima acrescenta, em uma linha.
   descer e subir: a frase do Gestor ao trocar pra ele (o apresentador completa com o que sai ou o que entra).
   Premissas, uma chave cada, pra reverter num lugar só: turma (P5, turma de 10 e vagas: slides 14, 19 e 22), garantia (P6, a linha
   do 24), contrato (P7, "só custeia os profissionais parceiros" e "a gente só ganha se você ganhar" no 24), ancora e retorno
   (P8, R$ 30.000 por ano e R$ 30 mil+ por mês no 24). Leitura do Legacy: o estrategista de carreiras sobe pra todo dia e entra o David direto;
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

window.CHECKLIST = [
  'Li a ficha e o Contexto do lead no CRM (origem, o que chamou atenção no Zyron, o que ele contou no formulário)',
  'Vi o vídeo do atleta',
  'Separei sonho, dor, peneiras e o que falta, com as palavras deles',
  'Escolhi o caso espelho: atleta nosso de verdade, mesmo perfil (posição, idade, nível), do CASOS.md ou publicado na AGN, com o link',
  'Defini o primeiro foco e escolhi na ficha o plano que vou recomendar: Legacy se a ficha não mostra aperto financeiro, Assessoria PRO se a dor financeira é forte, Scout PRO só se o caixa não comporta o PRO',
  'Tenho à mão, fora do deck, o link de pagamento de cada plano (vai no WhatsApp só depois do sim)',
  'Conferi a faixa de contrato que posso citar e o prazo da garantia',
  'Link da AGN pronto pra mandar no WhatsApp',
  'Conferi posição, pé e altura do atleta (o campo do slide 10 depende da posição)',
  'Testei o vídeo do Zyron (slide 08) e o depoimento da mãe (slide 14) com o áudio no compartilhamento de tela',
  'Subi o vídeo do atleta no painel (Leitura do atleta), com a autorização do responsável, marquei os lances e olhei a prévia',
  'Testei o vídeo no deck (play, som, pular pelos lances no apresentador)',
  'Conferi se a fonte do relatório é Zyron ou Equipe, de verdade',
  'Se não subi o vídeo, deixei o vídeo do atleta aberto pra leitura ao vivo no Meet (IA na Prática, slide 13)',
  'Conferi vagas e data da próxima turma (só aparecem com o Legacy)',
  'Confirmei pai, mãe e atleta na call',
  'Deck aberto em tela cheia e apresentador em outra janela'
];

window.PROIBIDOS = 'Proibido: começar do zero com quem já tem contexto; perguntar de novo o que está na ficha; prometer contrato, clube ou valor de contrato; inventar caso, clube ou número; trocar "encaminhado" por "contratado"; desconto; proposta por WhatsApp; correr atrás da família; pôr o perfil do atleta em dúvida; vender pela diferença de preço em vez do ritmo; atribuir ao PRO o que é do Legacy (conexão direta com clubes e AGN, os 15 encaminhamentos por mês) ou encaminhamento ao Scout PRO; descer de plano por desconto; mandar o link antes do sim; dar nota ou atributo ao atleta; dizer que o Zyron tem percentual de acerto; chamar o avaliador de incompetente; citar clube como quem usa dados; dizer que existe vaga num clube específico; dizer que o Zyron leu um relatório marcado à mão; dar nota geral, ranking, percentil ou comparação com outros atletas; mostrar o vídeo de um atleta a quem não é da família dele; prometer que o relatório da call é o do plano (o plano entrega a leitura de cada vídeo novo, no ritmo dele).';
