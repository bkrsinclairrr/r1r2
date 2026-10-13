/* Variação técnica da R2: família que já conhece a AGN e entende de futebol.
   Carrega depois de assets/roteiro.js e antes de assets/deck.js (ver variacoes/tecnica/index.html).
   Troca o roteiro (window.ROTEIRO), põe as objeções de quem conhece o meio na frente das do padrão
   (window.OBJECOES) e acrescenta itens ao checklist (window.CHECKLIST). Os três planos (window.PLANOS),
   follow-up e proibidos continuam os do padrão; o deck não tem link de pagamento. Nada do deck padrão é alterado.

   Os 27 slides ficam nas mesmas posições do padrão, pra aba Ler antes (números fixos no deck.js)
   continuar certa, inclusive os dois da reformulação de 08/10/2026: o 03 (o que a avaliação por observação
   deixa passar, o inimigo comum na voz de quem conhece o meio) e o 11 (o perfil dele em campo). Muda a copy e a persuasão:
   - Conversa de par pra par: nunca explicar o básico (peneira, olhômetro, o que é a AGN).
   - Insight central: informação a família já tem; o que falta é operação todo dia, com dado e acesso.
   - Perguntas de calibração: o pai mostra o que sabe e chega sozinho à conclusão.
   - Precisão no lugar de entusiasmo: cada número uma vez, sem adjetivo, "encaminhado" definido.
   - A AGN aparece uma vez (slide 17), como referência que eles já têm, não como prova.
   - Interesse alinhado (a gente só lucra no contrato) contra o ceticismo de quem já viu promessa no meio.
   Mesma doutrina do PLAYBOOK_CLOSER: combinado de decidir hoje, necessidade explícita, ancoragem antes
   do número, garantia logo depois do número (pedido do dono, 11/10/2026), silêncio, Modo A e Modo B. */

(function () {
  // aparece no topo do apresentador, pra o Gestor saber qual versão está na tela da família
  window.VARIACAO_NOME = 'Variação técnica';
  const PADRAO = window.ROTEIRO || [];
  const VAGA_PADRAO = PADRAO.find(r => r.modoB) || {}; // o Modo B do padrão (slide do investimento)
  // bloco do Zyron (05 a 08, trazido do R1): o roteiro vem do padrão. O campo (11) e o olhômetro contra o Zyron (12)
  // também vêm do padrão, no idioma de quem é do meio
  const doPadrao = nome => Object.assign({}, PADRAO.find(r => r.nome === nome) || { nome, min: 1, fala: [], perguntas: [], crm: [], atencao: '' });
  const BLOCO_ZYRON = ['E se?', 'Zyron', 'O Zyron trabalhando (vídeo)', 'Como o Zyron funciona'].map(doPadrao);
  // os três slides de 09/10/2026 (a plataforma, quem olha por ele, a rede): mesma tela do padrão, fala de igual pra igual
  const PLATAFORMA = Object.assign(doPadrao('A plataforma'), {
    fala: [
      'De igual pra igual, apontando a tela: "Isto é uma tela ilustrativa do que o [atleta] passa a ter: o vídeo, os clipes por tipo de lance, o mapa de calor e o relatório no mesmo lugar. Vocês que acompanham o jogo vão ver onde cada coisa entra."',
      'Um avanço por cartão: "O mapa de calor mostra por onde ele joga. O clipe é o lance, não a opinião de alguém. O relatório aponta pontos fortes e prioridades, cada um com o vídeo que prova."',
      '"A diferença pra observação: o que foi visto fica guardado e dá pra rever, e dá pra mostrar pra quem decide."',
      'Calibração: "O que vocês trocariam nessa tela pra ela servir pro [atleta]?" Espere.'
    ],
    perguntas: ['O que vocês trocariam nessa tela pra ela servir pro [atleta]?']
  });
  const QUEM_OLHA = Object.assign(doPadrao('Quem olha por ele'), {
    fala: [
      '"O Zyron fica ligado 24 horas e lê cada vídeo novo, sem enfeite: marca o lance e atualiza o relatório."',
      'Avanço 1: "Do lado de cá, um agente humano acompanha o [atleta], lê o relatório e define o próximo foco com vocês."',
      'Avanço 2: "O ritmo da parte humana é o do plano: relatório do analista a cada 15 dias no Scout PRO, ligação toda semana na Assessoria PRO, de perto todo dia no Legacy."',
      'Apontando o centro, com a foto dele: "A IA e a equipe, em volta do [atleta]."',
      'Calibração: "Pro nível do [atleta], que ritmo faz sentido?" Espere.'
    ],
    perguntas: ['Pro nível do [atleta], que ritmo faz sentido: 15 dias, toda semana ou todo dia?']
  });
  const REDE = Object.assign(doPadrao('A rede'), {
    fala: [
      '"A gente encaminha o perfil do [atleta], com vídeo e relatório, a quem decide, e organiza a ida. A decisão é do clube."',
      'A AGN, sem explicar: "Vocês já conhecem a AGN. A gente tem relação direta, e o site é agnfootball.com." Mande o [link AGN].',
      'Os clubes, só os números da casa: "Mais de 250 clubes na rede e mais de 75 encaminhamentos no último mês."',
      'O selo com a foto dele, sem enfeite: na Assessoria PRO e no Legacy, "o perfil dele fica pronto pra encaminhar"; no Scout PRO, "o encaminhamento começa na Assessoria PRO".',
      'O David: "O David Willer é o rosto da casa, e a casa está há mais de dez anos nisso, com centenas de atletas revelados." No Legacy: "Tem assessoria individual com ele todo mês e acompanhamento direto no WhatsApp."',
      'A linha do plano, lida uma vez, sem promessa de clube: "Quem decide é o clube. O nosso trabalho é fazer o perfil chegar a quem decide."'
    ],
    perguntas: ['Vocês já conheciam a AGN Football?']
  });
  const CAMPO = Object.assign(doPadrao('O seu lugar em campo'), {
    nome: 'O perfil em campo',
    fala: [
      'Pro [pai], de igual pra igual: "Vocês sabem que clube contrata pela carência do elenco, não pelo melhor da peneira. Esse é o perfil do [atleta], na posição dele: [posição]."',
      '"O Zyron cruza esse perfil com o que cada clube da base está pedindo: mais de 250, aqui e lá fora. A ponte é com a gente."',
      'O cartão, apontando o retrato, sem ler: "É a ficha dele hoje: o rosto, a posição, o lugar dele. A leitura do jogo vem daqui a pouco."',
      'Calibração: "Pelo que vocês conhecem, que tipo de elenco precisa de um [posição] como ele?" Espere. Deixe o [pai] responder.'
    ],
    perguntas: ['Que tipo de elenco precisa de um jogador como ele?'],
    crm: ['O que o [pai] disse sobre o elenco que precisa dele, com as palavras dele.'],
    atencao: 'Variação técnica: a mesma peça do padrão, com legenda técnica. Quem é do meio sabe ler formação: deixe o [pai] comentar a posição. A formação é ilustrativa: nenhum jogador, escudo ou clube escalado, e a carência é a ideia, não um fato sobre um clube. Nunca diga que existe vaga num clube específico, nem prometa clube, prazo ou contrato. O cartão é a ficha, sem nota nem atributo: a leitura do jogo é do 14, ao vivo. Sem posição reconhecida na ficha, o campo fica sem destaque: preencha antes da call. A foto no cartão não mede nada: não comente físico nem aparência.'
  });
  const OLHO = doPadrao('Olhômetro × Zyron');
  Object.assign(OLHO, {
    nome: 'Observação ou dados reais',
    fala: [
      'Sem explicar o olhômetro, que eles conhecem: aponte a coluna do Zyron e pergunte: "É esse tipo de leitura que faltou nas avaliações dele?"',
      'Fecho: "Os grandes clubes já escolhem jogador com dados há anos, por dentro. Agora essa leitura joga do lado do [atleta]."'
    ],
    perguntas: ['É esse tipo de leitura que faltou nas avaliações dele?'],
    atencao: 'Variação técnica: não leia a coluna da observação, a família conhece. Fique na coluna do Zyron: é a coluna vazia do 03, agora preenchida. Não cite nome de clube como exemplo de quem usa dados. O slide 13 volta ao tema pelo lado da operação.'
  });

  window.ROTEIRO = [
    { nome: 'Capa', min: 1,
      fala: [
        'Conexão pelo nome (4.1), sem cerimônia: "[pai], [mãe], [atleta], prazer. Eu sou o gestor de carreiras. Li a conversa de vocês com o estrategista esportivo e já entendi que vocês conhecem o meio. Então eu não vou gastar o tempo de vocês explicando o que vocês já sabem."',
        'Com o link do painel (nome na capa e foto no slide de escolha), olhando pro atleta: "[atleta], antes de começar: isso aqui foi montado hoje pra você. Seu nome, sua posição, seu dossiê. Nenhum outro atleta tem esta apresentação." Sem o link do painel, siga pro gancho.',
        'O gancho, apontando o título, sem explicar: "Vocês sabem melhor do que eu: observação não é leitura. Até hoje, viram o [atleta] no que deu pra ver."',
        'Veio do Zyron: "[atleta], o Zyron leu o teu vídeo e a equipe aprovou o teu perfil. Por isso eu tô aqui."',
        'Veio do formulário: "[atleta], eu li a tua trajetória. O plano parte dela."',
        'A pauta, dita de cara: "Hoje eu mostro o plano, como a gente opera e quanto custa. No fim, vocês me dizem se faz sentido. Se não fizer, me falem onde não fez."'
      ],
      perguntas: [],
      crm: ['Quem está na call (pai, mãe, atleta) e se algum decisor falta.', 'O que a família já conhece do meio (base de clube, federação, empresário, AGN), com as palavras deles.'],
      atencao: 'Variação técnica: família que já conhece a AGN e entende de futebol. Aqui vende competência e precisão, não entusiasmo. Não explique peneira, olhômetro nem o que é a AGN: pra quem é do meio, explicar o básico é perder autoridade. Fale menos, pergunte mais e deixe o [pai] mostrar o que sabe. Decisor fora da call: pare e reagende. Se a ficha mostra uma família que não conhece o meio, troque pro deck padrão antes de começar. A abertura "montado hoje pra você" só vale com o link do painel e a foto opcional dele no slide de escolha (confira na aba Ler antes). Sem adjetivo sobre o atleta: nada de "especial", "único" ou "o melhor".'
    },
    { nome: 'Por que você', min: 1.5,
      fala: [
        'Veio do Zyron: "[atleta], o Zyron leu o teu vídeo com dados e a equipe aprovou o que viu: [característica]. Isso não é elogio: é o que o teu jogo mostrou."',
        'Veio do formulário: "[atleta], você contou: [experiência]. A equipe leu isso e aprovou o perfil. Jogador você já é."',
        'Sem contexto: "A equipe analisou o teu jogo e aprovou o teu perfil."',
        'Calibração, pro [pai]: "Vocês que acompanham o jogo dele de perto: isso bate com o que vocês veem? O que vocês acrescentariam?" Escute e anote. As palavras dele voltam no slide 04.',
        'Plante o espelho, só com caso real na ficha: "Lendo o perfil dele, me veio um atleta nosso com o mesmo perfil. Daqui a pouco eu mostro quem é." Não fale o nome ainda: a revelação é no slide 17.',
        'Apontando o cartão com o retrato, sem enfeite: "É o perfil aprovado do [atleta]. Nenhum outro atleta tem este plano."',
        'Ponte: "Hoje eu mostro o caminho daqui até o clube."'
      ],
      perguntas: ['Isso bate com o que vocês veem no jogo dele? O que vocês acrescentariam?'],
      crm: ['O que o [pai] acrescentou sobre o jogo do atleta, com as palavras dele.'],
      atencao: 'Pra quem entende de futebol, a leitura do jogo é a prova de competência. Fale de característica de jogo, nunca de "dom" ou "talento nato". Se o [pai] corrigir ou acrescentar algo, concorde com o que for verdade e anote: ele acabou de virar coautor do plano. Confirme o que já está no CRM, nunca pergunte de novo.'
    },
    { nome: 'O que a observação deixa passar', min: 2,
      fala: [
        'Sem explicar o básico, pro [pai]: "Vocês conhecem avaliação por observação melhor do que eu. Ele já fez [peneiras]. Me diz: em qual delas o avaliador teve tempo de ler o jogo dele de verdade?" Silêncio. Deixe o [pai] diagnosticar.',
        'Aponte as linhas, sem ler tudo: "Quanto do jogo é visto, a atenção, o que fica registrado, o depois. É o limite do método, não de quem avalia."',
        'A virada, sóbria, apontando a frase de baixo: "Não foi falta de jogo. Foi falta de leitura."',
        'A coluna tracejada: "Essa coluna eu preencho daqui a pouco."'
      ],
      silencio: '"Em qual delas o avaliador teve tempo de ler o jogo dele de verdade?" E pare. Quem responde é o [pai].',
      perguntas: ['Em qual das peneiras o avaliador teve tempo de ler o jogo dele de verdade?'],
      crm: ['O diagnóstico do [pai] sobre as avaliações, com as palavras dele.'],
      atencao: 'Variação técnica: o inimigo comum é o mesmo do padrão (avaliar a olho, em poucos minutos, sem dado e sem acompanhamento), dito como método, na voz de quem conhece o meio. Quem é do futebol já viu avaliação por observação por dentro: deixe o [pai] dizer o limite, não explique. Ataque o método, nunca quem avalia, e não cite clube. Depois da pergunta, silêncio: aperte S (conta aqui, sem trocar de slide). A coluna da resposta é preenchida no 12.'
    },
    { nome: 'O planejamento de carreira', min: 4.5,
      fala: [
        '"Esse é o plano do [atleta]. Vocês sabem que talento sem operação fica parado. Isso aqui é a operação, etapa por etapa."',
        'Agora: "O gerente de carreira e o Zyron leem o jogo dele e definem o que evoluir primeiro. No caso dele: [primeiro foco]." Se o [pai] acrescentou algo no slide 02, amarre aqui: "e o que você falou, [pai], entra junto."',
        'Todo dia: "Treino com direção, o gerente de carreira acompanhando e um estrategista de carreiras do Zyron só dele."',
        'A ponte: "O perfil dele vai pra quem tem carência de um jogador como ele, nos mais de 250 clubes da rede."',
        'Quando o clube chamar: "O gerente organiza a ida com vocês. Vocês me falaram: [locomoção]."',
        'Destino: "E tudo isso existe pra uma coisa: [sonho]."',
        'A + B (06), no idioma deles: "A parte do [atleta] é jogo e disciplina. A nossa é método, dado e acesso. Vocês sabem que uma sem a outra não fecha contrato."',
        'Com a Assessoria PRO ou o Scout PRO na ficha, feche pela estrutura, não pelo plano: "Essa é a operação inteira. Daqui a pouco eu mostro em que ritmo dá pra ter ela do lado dele agora."'
      ],
      perguntas: ['Faz sentido esse caminho? Alguma etapa que vocês fariam diferente?'],
      crm: ['O que a família sugeriu mudar no plano, se sugeriu.'],
      atencao: 'Pergunta aberta de propósito: quem é do meio quer opinar. Se sugerirem algo, responda o que cabe dentro do plano, sem prometer o que a operação não faz. Não prometa prazo, clube ou contrato. Previne "ele não pode ir pra outro estado": hoje ele não vai pra lugar nenhum, isso só acontece quando o clube chamar. O caminho da tela é a estrutura completa, a do Legacy: gerente de carreira, a ponte com a rede de clubes e a ida organizada. Com o PRO ou o Scout PRO na ficha, não diga que o plano entrega isso: o 25 mostra o que cada plano entrega.'
    },
    ...BLOCO_ZYRON,
    PLATAFORMA,
    QUEM_OLHA,
    CAMPO,
    OLHO,
    { nome: 'Conhecer o caminho não é estar nele', min: 2,
      fala: [
        'Abra pela experiência deles, não pela peneira: "Vocês já conhecem o caminho: peneira, avaliação, empresário. A leitura do jogo a gente já viu no 03 e no 12. Além dela, o que faltou em cada tentativa?" Espere. Deixe o [pai] diagnosticar.',
        'Linha por linha, de igual pra igual: "Quem lê o jogo dele hoje é o olho treinado de vocês, e um avaliador quando dá. Aqui é o Zyron, com dados reais do vídeo dele. Clube grande já escolhe assim há anos, aqui e lá fora, só que por dentro. A diferença é que agora isso trabalha do lado do atleta."',
        '"Quem acompanha todo dia hoje são vocês, no tempo que sobra do trabalho. Aqui é o gerente de carreira, todo dia."',
        '"Quem sabe qual clube precisa de um jogador como ele, e quando? Hoje, um contato, quando atende. Aqui, a rede de mais de 250 clubes e o que cada um está pedindo."',
        '"E o risco: por conta própria, é todo de vocês. Aqui, a gente só ganha quando ele fecha."',
        'A virada: "Informação vocês já têm. O que faltava era operação. É isso que a gente faz: não é ensinar o caminho, é andar nele com ele, todo dia."'
      ],
      perguntas: ['O que faltou em cada uma das tentativas?'],
      crm: ['O diagnóstico do [pai] sobre o que faltou, com as palavras dele.'],
      atencao: 'Depois da observação (03) e do bloco do Zyron (05 a 12), este slide fecha o raciocínio pelo lado da operação. Este é o insight da variação: o gargalo de uma família que conhece o meio não é saber, é operar todo dia com dado e acesso. Reconheça o que eles sabem e mostre o limite; nunca diminua. Desarma "a gente mesmo consegue fazer isso" e "vou ver outras opções" antes de aparecerem. A coluna "Com a gente" é a estrutura completa, a da Assessoria de Elite Legacy (a nota no pé da tela diz isso). Com o PRO ou o Scout PRO na ficha, fale da estrutura, não do plano: gerente de carreira todo dia e a rede de clubes são do Legacy. O 25 volta a estas linhas, plano por plano.'
    },
    // IA na Prática (14) e depoimento de uma mãe (15): os mesmos slides e o mesmo roteiro do padrão
    Object.assign(doPadrao('IA na Prática'), {
      fala: [
        'Com o vídeo dele no painel, a ponte no idioma deles: "Vocês leem jogo com o olho treinado. Agora eu quero que vocês vejam o jogo do [atleta] lido lance a lance, com o minuto e o porquê."'
      ].concat((PADRAO.find(r => r.nome === 'IA na Prática') || { fala: [] }).fala.slice(1)),
      atencao: (PADRAO.find(r => r.nome === 'IA na Prática') || { atencao: '' }).atencao + ' Variação técnica: família do meio quer opinar sobre o jogo. Deixe o [pai] comentar depois da leitura, não durante, e pergunte qual lance ele quer ver de novo.'
    }),
    doPadrao('Depoimento de uma mãe'),
    { nome: 'Talento é o mínimo', min: 2,
      fala: [
        '"Vocês sabem: talento é o mínimo. Tem muito jogador bom parado, e não é por falta de bola. É porque ninguém levou o jogo dele, com dado, ao clube que precisa daquele perfil, na hora certa."',
        'Os números, sem adjetivo: "Mais de 93% dos nossos atletas são encaminhados pra clubes em até três meses. Mais de 75 só no último mês. Mais de 250 clubes na rede. Mais de dez anos fazendo isso."',
        'A definição, antes que perguntem: "E encaminhar, pra ficar claro, é o clube receber o atleta pra avaliação. Não é contrato. Dali pra frente é o jogo dele, com o gerente de carreira preparando ele todo dia."',
        'Pro atleta: "[atleta], talento você tem. A operação é com a gente."'
      ],
      perguntas: ['Faz sentido pra vocês que o gargalo até agora não foi talento?'],
      crm: [],
      atencao: 'Família do meio desconfia de número solto. Diga cada número uma vez, sem enfeite, e defina "encaminhado" antes que perguntem: aqui a precisão é a credibilidade. Nunca troque encaminhado por contratado. Responde "quanto tempo demora?" e "ele é bom o suficiente?".'
    },
    { nome: 'Antes do post', min: 2,
      fala: [
        'A AGN uma vez, e só: "Vocês já conhecem a AGN e já viram quem fecha. O post mostra a assinatura. O caminho até ela fica fora da foto."',
        'Aponte os casos: "O Joãozinho, no Grêmio. O Kaio, no Internacional. O que ninguém vê no post é o que veio antes: o vídeo lido com dado, o gerente todo dia, o perfil na mesa de quem tinha a carência."',
        'O espelho, com o caso da ficha: "[atleta], lembra do atleta que eu falei? É o [caso]. Mesmo perfil que o teu. Fechou com o [clube do caso], [país do caso]." Mande o link na hora: [link do caso]',
        '"O último quadro é o próximo. É o do [atleta]."'
      ],
      perguntas: ['Pelo que vocês conhecem do meio, o que separa quem fecha de quem fica parado?'],
      crm: [],
      atencao: 'Variação técnica: a AGN aparece uma vez, como referência que eles já têm, não como prova. Link da AGN só se pedirem. A prova aqui é o processo e o caso espelho mais parecido em posição, idade e nível. Só caso real e nosso, com link: família do meio confere na hora. A AGN divulga: não diga que ela contrata ou garante clube.'
    },
    REDE,
    // o 19 (11/10/2026, painel do closer): o mesmo slide do padrão, lido como inventário
    { nome: 'O que ele leva', min: 1.5,
      fala: [
        'Ponte, sem enfeite: "Antes do valor, numa tela só, o que entra pro [atleta] a partir de hoje." Um avanço por linha.',
        'Leia cada linha uma vez, como está na tela, sem adjetivo: IA, gente, conexões, oportunidades, tempo e garantia. Cada uma segue o plano da ficha; no Scout PRO, conexões e oportunidades começam na Assessoria PRO.',
        'Tempo, com precisão: "O contato e o começo do Zyron são prazos que a equipe cumpre." Só no Legacy: "Em até 3 meses, mais de 93% dos nossos estão encaminhados a clubes. É referência dos atletas que a gente acompanha, não prazo de contrato."',
        'Garantia: "Com [garantia], nos termos do contrato."',
        'Calibração, pro [pai]: "Desses seis, qual é o gargalo dele hoje?" Espere. E siga pro valor.'
      ],
      perguntas: ['Desses seis, qual é o gargalo dele hoje?'],
      crm: ['O gargalo que o [pai] apontou, com as palavras dele.'],
      atencao: (PADRAO.find(r => r.nome === 'O que ele leva') || { atencao: '' }).atencao + ' Variação técnica: leia como inventário, não como vantagem. Família do meio desconfia de lista longa: uma frase por linha e siga.'
    },
    { nome: 'O valor real', min: 3.5,
      fala: [
        'Régua (07): "Vocês já investiram [investido] nessa carreira. E vocês sabem melhor do que ninguém quanto custa cada frente."',
        'A tela abre só com a pergunta: "Quanto custa cada frente, por conta? Vocês que já pesquisaram: quanto vocês acham que dá por ano?" Espere o número deles.',
        'Um avanço por frente (→ ou espaço), sem explicar o que eles já sabem: "Performance: R$ 6.500 por ano." / "Dados e inteligência, o Zyron: R$ 5.000." / "Psicologia: R$ 2.500." / "Nutrição: R$ 3.000." / "Comportamento: R$ 3.500." / "Imagem e posicionamento: R$ 3.000." / "Acompanhamento e direcionamento: R$ 6.500."',
        'A soma da direita sobe a cada frente (6.500, 11.500, 14.000, 17.000, 20.500, 23.500 e 30.000). Deixe o número trabalhar; se o [pai] tinha chutado um valor, compare em voz alta quando a soma passar dele.',
        'Último avanço, o total em destaque: "Somando, R$ 30.000 por ano. E o difícil nem é pagar: é fazer as sete falarem entre si, com o Zyron no meio."',
        'Sem certeza: "E mesmo pagando tudo isso, ninguém entrega a rede de clubes junto."',
        'Calibração: "Bate com o que vocês já pesquisaram?"'
      ],
      perguntas: ['Quanto vocês acham que dá por ano, por conta?', 'Bate com o que vocês já pesquisaram?'],
      crm: ['O número que a família chutou.'],
      atencao: 'O slide abre só com a pergunta: espere o número deles antes do primeiro avanço; quem é do meio gosta de acertar. Cada avanço mostra uma frente com o valor anual, e a soma da direita sobe junto; o último avanço destaca o total, R$ 30.000 por ano, com tudo junto. Família do meio pode contestar um valor: não brigue, concorde que varia (o rodapé diz isso) e volte pro ponto: o que ninguém monta sozinho é a integração e o acesso. Ordem: régua, conta, sem certeza (este slide), até lá e critério (21 e 22), contrato (23), a vaga (24), os planos e o número (25), silêncio e a garantia (26). Aqui é o valor da estrutura inteira, a do Legacy, não o preço de um plano.'
    },
    { nome: 'Até lá, a gente banca', min: 2,
      fala: [
        '"Até lá, quem banca a operação somos nós. Tempo: o gerente de carreira todo dia. Esforço: contato com clube, vídeo, avaliação, a ida pro clube. Profissionais: as sete frentes. Tecnologia: o Zyron."',
        '"O que vocês investem é o custo mínimo pra essa estrutura existir, com o gerente de carreira e os profissionais dedicados a ele. O resto é investimento nosso."',
        'Esforço zero (6.6), pra quem hoje opera a carreira sozinho: "E o que hoje é trabalho de vocês, ligar, mandar vídeo, correr atrás de avaliação, passa pra gente. Vocês voltam a ser pai e mãe do jogador, não o empresário dele."'
      ],
      perguntas: [],
      crm: [],
      atencao: 'A frase do "voltam a ser pai e mãe, não o empresário dele" é pra família que hoje toca a carreira sozinha: é alívio, não crítica. Resposta pronta pro "por que cobram?": o lucro vem do contrato; isso é o custo mínimo da estrutura até lá. Nunca fale "onboarding", "etapas", "acessos". Aqui é a operação inteira, a do Legacy. Com o PRO ou o Scout PRO na ficha, não prometa ao plano o gerente de carreira todo dia; Os sete módulos de formação já estão incluídos no Scout PRO. O acompanhamento humano e os encaminhamentos seguem cada plano. O 25 mostra o que cada plano entrega.'
    },
    { nome: 'Critério, não volume', min: 3,
      fala: [
        '"Esse custo só existe pra quem passou no filtro. Chega muito vídeo e muito cadastro, o Zyron analisa, a equipe aprova. O [atleta] passou."',
        '"Quem entra é escolhido pelo jogo, não pelo pagamento. Pra quem não passa, não tem preço: não tem vaga."',
        'Só com o Legacy na ficha, a turma da tela: "A turma fecha em 10, porque é o máximo que um gerente de carreira acompanha de perto, todo dia."',
        'Escada do sim (6.1), direta: "[atleta], você quer ser jogador profissional?" Espere. "Tá disposto a cumprir o que o teu gerente de carreira passar, nos dias bons e nos ruins?" Espere. "[pai], [mãe], vocês sustentam isso com ele?"'
      ],
      perguntas: ['[atleta], você quer ser jogador profissional?', 'Tá disposto a cumprir o que o teu gerente de carreira passar?', 'Vocês sustentam isso com ele?'],
      crm: [],
      atencao: 'Família do meio respeita critério: ela sabe que clube também seleciona. O sim do atleta na frente dos pais pesa mais que qualquer argumento. Pergunte, não mande; se ele hesitar, volte pro sonho dele, nunca pressione. Previne "e se ele for dos que não chegam lá?". A turma de 10 é do Legacy: com o PRO ou o Scout PRO na ficha, a tela não mostra turma nem a linha do gerente de carreira, e você fica no critério.'
    },
    { nome: 'Interesse alinhado', min: 2.5,
      fala: [
        '"Vocês conhecem como o meio cobra. A gente ganha no contrato profissional do [atleta]: hoje, um atleta que a gente coloca fecha por volta de [faixa] por mês, no mínimo. É nesse momento, e só nele, que a gente lucra."',
        '"Vocês mesmos disseram pro estrategista esportivo que não faz sentido a gente lucrar em cima de vocês. E não lucra. O interesse de vocês e o nosso é o mesmo: a assinatura."',
        'O espelho de volta: "Foi assim com o [caso]: hoje ele tá no [clube do caso]."',
        'Cenário (05), curto: "[pai], o que muda na vida de vocês quando ele assinar?" Silêncio.'
      ],
      perguntas: ['O que muda na vida de vocês quando ele assinar?'],
      crm: [],
      atencao: 'Pra família que já viu promessa no meio, interesse alinhado convence mais que entusiasmo. O número é referência do que já acontece, nunca promessa: cada contrato depende do clube, da categoria e do desempenho. Não fale mal de empresário: compare modelos, não pessoas. Previne "por que vocês cobram?". A faixa é referência da casa, de atleta nosso que fechou, não entrega de nenhum plano. Com o Scout PRO na ficha, não diga que o plano leva a esse contrato: o encaminhamento pra clubes vem a partir da Assessoria PRO.'
    },
    { nome: 'A vaga', min: 2,
      fala: [
        'Só com o Legacy na ficha (turma e vaga na tela). Escassez, só com o número real da semana (08): "Dessa turma de 10, restam [vagas]."',
        'Início imediato, no Legacy: "Confirmando hoje, o [gerente] entra em contato com vocês, e o Zyron já começa a acompanhar o [atleta]."',
        'O relógio, no Legacy, com a janela que eles mesmos deram (9.3): "Vocês falaram da janela dele. Hoje, a vaga. Em até três meses, mais de 93% dos nossos estão encaminhados. Se decidir hoje, esse relógio começa hoje. Se decidir daqui a uma semana, começa uma semana depois."',
        'Com a Assessoria PRO ou o Scout PRO na ficha, a tela vira "o começo": "Confirmando hoje, a equipe entra em contato e o Zyron começa a ler o jogo dele. A cada vídeo novo, um relatório novo. O ritmo, vocês escolhem agora."',
        'Ponte pros planos: "Agora, em que ritmo."'
      ],
      perguntas: [],
      crm: [],
      atencao: 'Vagas só com o número real da semana; prazo só com o prazo confirmado (campos da ficha). Turma, vagas, os 93% em até três meses e o dia da assinatura são do Legacy: com o PRO ou o Scout PRO na ficha, a tela não mostra nada disso, e a fala também não. O 25 mostra os planos com o investimento de cada um e fecha com o plano da ficha, o do número falado.'
    },
    { nome: 'Os planos', min: 7,
      silencio: 'O número, uma vez, com a parcela. E silêncio: quem fala primeiro depois do preço perde.',
      fala: [
        'Ponte, sem falar de dinheiro, lendo o título: "Hoje quem opera a carreira dele são vocês, no tempo que sobra do trabalho. Com a gente, vocês não operam mais sozinhos. O que muda de um plano pro outro é quanto dessa operação passa pra gente, e com que frequência. A leitura do Zyron é a mesma nos três."',
        'Um avanço por coluna (→ ou espaço), sem enfeite. Cada coluna é a parte de um plano, cargo por cargo. Scout PRO: "Leitura do Zyron a cada vídeo novo, com pontos fortes e prioridades, relatório do analista de performance, relatório de entrada, histórico, o guia da peneira e sete módulos de formação para trabalhar a evolução."',
        'Assessoria PRO: "Tudo do Scout PRO, e uma equipe do lado dele toda semana: o estrategista de carreiras liga, ele tem os sete módulos de aulas, conta com um estrategista esportivo, entra no networking com outros atletas e nas aulas extras, e a gestão de carreiras faz pelo menos 5 encaminhamentos de oportunidades por mês, pra clubes do Brasil e do mundo. Por metade do Legacy."',
        'Assessoria de Elite Legacy, a coluna em destaque: "Tudo da Assessoria PRO, e a operação completa, a ideal: o estrategista de carreiras e o gerente de carreira todo dia, assessoria individual com o David Willer todo mês e acompanhamento direto no WhatsApp, pelo menos 15 encaminhamentos de oportunidades por mês, mundo afora, conexão direta com clubes e com a AGN, o estrategista esportivo ligando toda semana em cima dos relatórios, o plano de carreira, contato com clube, vídeo e avaliação por nossa conta, as seletivas acompanhadas, com a logística planejada, e a turma de 10."',
        'O investimento tá no topo de cada coluna, com a parcela em destaque, sem enfeite: "R$ 997, R$ 1.497 e R$ 2.997, todos vitalícios, em 10x sem juros." E volte pro ritmo.',
        'Calibração, no idioma deles: "Pelo que vocês conhecem do jogo dele, que ritmo ele pede? Relatório, alguém ligando toda semana ou alguém em cima todo dia?" Espere. "Um estrategista junto para aplicar a formação e orientar a rotina faz diferença pra ele agora?" Espere. "E o David Willer de perto, com assessoria individual todo mês e as conexões e os clubes dele: é o que vocês querem agora?" Espere.',
        'Recomende um, com as palavras do [pai]: "Pelo que você me falou, eu recomendo o [plano]." Se a resposta apontou outro, troque o plano no apresentador antes do último avanço. Último avanço: o [plano] aparece destacado.',
        'O número, uma vez: "[pai], [mãe], o investimento no [plano] é de [preço], em 10x sem juros de [parcela]." E pare. Tecla S.',
        'O porquê do vitalício, de igual pra igual: "É vitalício porque a gente tem certeza do trabalho: vocês investem uma vez e não pagam de novo. Esse valor só custeia os profissionais parceiros que vão cuidar dele: paga o trabalho deles. O nosso lucro vem do contrato dele." E olhando pro atleta: "[atleta], a gente só ganha se você ganhar."',
        'Depois do silêncio, sem enfeite: "Com [garantia]."',
        'No Legacy, de igual pra igual: "Vocês sabem quanto um contrato paga. Um atleta médio nosso fecha ganhando, em média, R$ 30 mil+ por mês: a parcela é uma fração de um mês de contrato, quando ele fechar."',
        'Na Assessoria PRO, a acessível, sem enfeite: "Uma equipe do lado dele toda semana, com sete módulos de aulas e pelo menos 5 encaminhamentos por mês. Cerca de metade do valor do Legacy."',
        'No Scout PRO, o começo: "É a leitura do Zyron, o relatório do analista de performance e os sete módulos de formação para trabalhar a evolução."',
        'Por dia, do plano da tela, se o valor pesar: no Legacy, "No prazo médio de 3 meses, dá [por dia] por dia."; no PRO e no Scout PRO, "Dividido nos primeiros 3 meses, dá [por dia] por dia."',
        'Fechamento (Modo A, 08): "Confirmando hoje, eu já aviso o [gerente]. Fica melhor no Pix ou no cartão?" No PRO e no Scout PRO: "eu já aviso a equipe".',
        'Depois do "Pix ou cartão?": mande no WhatsApp o link de pagamento do [plano], na própria call, e faça o pagamento com a família na linha. O link não está no deck: tenha o de cada plano à mão.',
        'Objeção: acolha, isole e volte: "Resolvido isso, eu confirmo agora. Pix ou cartão?"',
        'Trocar de plano, pelo escopo e nunca por desconto: "Existe um formato mais enxuto, a Assessoria PRO, e o que muda é isto." / "Se vocês quiserem a operação completa, o Legacy acrescenta isto." Use os botões de plano no apresentador: a tela do 25 troca junto, e o apresentador mostra o que sai ou o que entra. Descendo pro Scout PRO: "o encaminhamento pra clubes vem a partir da Assessoria PRO." Saindo do Legacy: "a conexão direta com clubes e AGN e os 15 encaminhamentos por mês são do Legacy; na Assessoria PRO, são pelo menos 5."',
        '"Vocês combinaram de decidir hoje, lembra? Pode ser não, tudo bem. O que tá faltando pro sim?"'
      ],
      fechaDe: 7,
      modoB: VAGA_PADRAO.modoB || [],
      perguntas: ['Que acompanhamento o jogo dele pede: relatório, equipe semanal ou acompanhamento diário?', 'Um estrategista junto para orientar a rotina faz diferença pra ele agora?', 'O David Willer de perto, com assessoria individual todo mês, é o que vocês querem agora?', 'Pix ou cartão?'],
      crm: ['O ritmo que a família escolheu, com as palavras do [pai], e o plano que você recomendou.', 'Resultado, plano fechado e forma de pagamento.', 'Modo B: a hora do retorno e o "estamos dentro".'],
      atencao: 'O 25 mostra cada plano na sua parte, com o investimento no topo da coluna (decisão do dono, 06/10/2026). Cada coluna é a parte de um plano, com o que ele acrescenta ao de baixo, cargo por cargo: aponte o que muda, não leia tudo. O Legacy vem em destaque, como o ideal: é a operação completa, com a lista mais longa. Se a ficha recomendar outro plano, diga com franqueza que o ideal é o Legacy e que o PRO coloca uma equipe do lado dele toda semana, por metade do valor. Apresente pelo ritmo, não pelo preço; o número falado com silêncio é o do plano recomendado, o destacado no último avanço. Família do meio compara linha por linha: deixe o [pai] ler as colunas e opinar antes de recomendar. Ordem da casa: o Legacy abre (a operação que eles viram até o 24 é a dele), a Assessoria PRO entra como o formato mais enxuto: uma equipe do lado dele toda semana, por metade do Legacy, e o Scout PRO só se o caixa realmente pedir. A conexão direta com clubes e AGN, os 15 encaminhamentos por mês, a turma e os 93% são do Legacy: não atribua ao PRO nem ao Scout PRO. O encaminhamento vem a partir da Assessoria PRO, com pelo menos 5 por mês. Nunca "o mais barato", "o mais vendido" ou "o mais escolhido". O número e o fechamento ficam neste mesmo slide. O número é o do plano da ficha, o destacado no último avanço, já com o parcelamento (10 x a parcela = o valor total): Scout PRO, R$ 997 vitalício, 10x de R$ 99,70; Assessoria PRO, R$ 1.497 vitalício, 10x de R$ 149,70; Legacy, R$ 2.997 vitalício, 10x de R$ 299,70. Fale o número uma vez e aperte S. Regra de ouro: depois do número, silêncio. Quem fala primeiro depois do preço perde. Os 3 meses do "por dia" são só a conta: no PRO e no Scout PRO, não ligue esses 3 meses ao encaminhamento: os 93% em até três meses são dado do Legacy. Travou no valor: isole ("tirando o valor, tem mais alguma coisa?"), diagnostique (retorno ou dinheiro agora) e volte no slide 20, 23, 26 ou 25. Família do meio que pede pra "pensar com calma" quase sempre quer sentir controle: Modo B, se a análise da equipe for real. A tela não muda. Link de pagamento: fora do deck, pelo WhatsApp, só depois do sim.'
    },
    { nome: 'Garantia total', min: 1.5,
      fala: [
        '"E pra vocês começarem tranquilos: [garantia]."',
      'Aponte os três valores, sem enfeite e sem comparar: "Nos três, se vocês aplicarem o método e não fizer sentido pro momento de vocês, o valor investido volta inteiro, nos termos do contrato."',
        'No Legacy, a média, apontando a tela: "A média de fechamento dos nossos atletas é de cerca de três meses."',
        '"A gente confia no trabalho, na estrutura e no método. Por isso, se vocês aplicarem o método e não fizer sentido pro momento de vocês, o dinheiro volta inteiro. Sem burocracia."',
        '"O risco de começar fica com a gente. O único risco de verdade é o [atleta] ficar parado mais um ano."',
        'Franqueza, que essa família reconhece: "A garantia é do investimento. Contrato ninguém sério garante, e vocês sabem disso melhor do que ninguém. O que a gente garante é o trabalho, todo dia."'
      ],
      perguntas: [],
      crm: [],
      atencao: 'Confira o prazo e as condições da devolução antes da call (campo Prazo da garantia na ficha). Se houver prazo, fale o prazo. A garantia vem logo depois do número, com os três valores na tela de uma vez (pedido do dono, 11/10/2026): é o único slide em que os três aparecem sem avanço. Fale só o valor do plano da ficha, uma vez, e use a garantia pra tirar o medo de errar na hora de decidir. A condição (método aplicado, nos termos do contrato) fica no rodapé: não diga "incondicional". Responde "tem garantia?", "e se não der certo?" e parte do "vou pensar". Pra acionar, a família comprova que aplicou o método, como diz o rodapé do 26: se perguntarem, diga com clareza, sem esconder. A média de três meses só aparece com o Legacy na ficha; é dado da casa, não prazo.'
    },
    { nome: 'Bem-vindo', min: 3,
      fala: [
        'Áudio de boas-vindas, com a frase da tela: "Bem-vindo, [atleta]." No Legacy: "A partir de hoje, o teu contrato profissional é o nosso objetivo." Na Assessoria PRO: "A partir de hoje, você tem uma equipe do teu lado, toda semana." No Scout PRO: "A partir de hoje, o teu jogo é lido de 15 em 15 dias."',
        'Só no Legacy, a imaginação, devagar, apontando o post da tela: "[atleta], imagina comigo. Daqui a alguns meses o teu telefone toca. É o [gerente]: \'o clube quer você\'. Você assina. Quem é a primeira pessoa que você liga?" Espere a resposta.',
        'Só no Legacy, pros pais: "[pai], [mãe], nesse dia a gente ganha junto. Por isso, a partir de agora, quem opera a carreira dele é a gente."',
        'O começo: no Legacy, "O [gerente] entra em contato com vocês, e o Zyron já começa a acompanhar o [atleta]." No PRO e no Scout PRO, "A equipe entra em contato com vocês, e o Zyron já começa a ler cada vídeo novo dele." E o próximo passo da tela: no PRO, os encontros com a equipe de gestão de carreiras; no Scout PRO, o próximo vídeo.',
        'Indicação, na hora, no idioma deles: "Vocês conhecem o meio: tem algum colega de time dele que joga nesse nível? A gente faz a avaliação dele também."'
      ],
      perguntas: ['No Legacy: quem é a primeira pessoa que você liga quando assinar?'],
      crm: ['Venda concluída no CRM e cadastro em Vendas (produto e ticket do plano fechado; a venda entra pendente até a aprovação do Executive).', 'A indicação.', 'O dia do primeiro contato (no Legacy, do gerente).'],
      atencao: 'A imaginação sela a decisão: quem descreve o dia da assinatura em voz alta não volta atrás no dia seguinte. O post da tela é ilustrativo: diga "imagina", nunca "vai ser". Com caso espelho, feche com ele: "igual o [caso]". Família do meio indica bem: peça o contato do responsável do colega, não do menino. Só prometa prazo confirmado. No PRO e no Scout PRO, a tela não tem post nem contrato: fique no ritmo do plano e no próximo passo, sem prazo.'
    }
  ];

  /* objeções de quem conhece o meio, na frente das do padrão (os números de slide valem nas duas versões) */
  const OBJ_TECNICA = [
    { q: 'A gente mesmo consegue fazer isso / conhecemos gente no meio', slides: [13, 21, 20], prev: 'O "conhecer o caminho não é estar nele" (13) e o "quem banca a operação" (21) antes do número.', resposta: [
      'Acolher, de verdade: "Vocês conseguem muita coisa, e o [atleta] chegou até aqui por causa de vocês."',
      'Isolar: "Tirando isso, tem mais alguma coisa que impede ele de começar?"',
      'Diagnosticar: "Hoje, quanto tempo por semana vocês conseguem dedicar a isso? E quantos clubes vocês alcançam com dado do jogo dele, sabendo quem tem carência daquela posição agora?"',
      'Responder, com o Legacy na tela: "Contato vocês têm. O que a gente soma é operação todo dia, o Zyron lendo o jogo dele com dado e a rede de mais de 250 clubes dizendo o que precisa. Contato abre uma porta. Operação abre a certa, na hora certa." Com a Assessoria PRO na tela: "Contato vocês têm. O que a gente soma é uma equipe do lado dele toda semana, com dado do jogo dele: o estrategista de carreiras, os sete módulos de aulas, um estrategista e a gestão de carreiras, com pelo menos 5 encaminhamentos por mês."',
      'Conduzir: "Então a pergunta é se vocês querem continuar operando sozinhos ou ter essa operação do lado dele. Eu confirmo a vaga?"'
    ], proibido: 'Diminuir o que a família sabe ou os contatos que ela tem.' },
    { q: 'A gente já conhece a AGN, a gente mesmo manda o vídeo', slides: [17, 13, 18], prev: 'O "antes do post" (17): o post mostra a assinatura, não o caminho até ela.', resposta: [
      '"A AGN é a vitrine de quem já fechou. O que leva até ali vem antes do post: o vídeo lido com dado, o gerente todo dia e o perfil apresentado a quem tem a carência." Gerente todo dia e perfil apresentado aos clubes são do Legacy: com o PRO ou o Scout PRO na tela, fique no vídeo lido com dado e no ritmo do plano.',
      '"Mandar o vídeo é a parte fácil. Difícil é saber pra quem, quando, e o que acompanhar depois. É isso que a gente opera."',
      'Conduzir: "Faz sentido ter isso do lado do [atleta]?"'
    ], proibido: 'Falar mal da AGN ou dizer que ela contrata, garante clube ou depende da gente.' },
    { q: 'Empresário só cobra quando sai o contrato. Por que pagar antes?', slides: [23, 21, 26, 25], prev: 'O custo da operação (21) e o interesse alinhado (23) antes do número, e a garantia (26) logo depois.', resposta: [
      '"Faz sentido perguntar. A gente também ganha no contrato: nesse ponto, o modelo é o mesmo."',
      '"A diferença é o que acontece até o contrato. Quem só ganha no fim não tem como bancar estrutura antes disso. Aqui tem gente e o Zyron trabalhando nele desde hoje. Isso tem custo, e o investimento cobre só esse custo mínimo." No Legacy, nomeie: o gerente de carreira todo dia e as sete frentes. Na Assessoria PRO: o estrategista de carreiras toda semana, o estrategista esportivo e os sete módulos de aulas.',
      '"E se vocês aplicarem o método e não fizer sentido, é [garantia]. O risco de começar é nosso."',
      'Conduzir: "Resolvido isso, eu confirmo agora. Pix ou cartão?"'
    ], proibido: 'Atacar empresário ou citar alguém pelo nome. Compare modelos, não pessoas.' },
    { q: 'Quais dados o Zyron usa? Como é esse relatório?', slides: [7, 8, 12, 13, 2, 11, 9, 10], prev: 'O Zyron trabalhando (07), os cinco verbos (08), dados reais contra o olho (12 e 13), o que o Zyron leu no vídeo (02) e a ficha dele no campo (11).', resposta: [
      '"Ele recebe a ficha do atleta, idade, altura, peso e posição, e o vídeo compilado dele jogando. Com isso entrega um relatório do jogo e acha o clube que precisa exatamente daquele estilo."',
      '"É o que clube grande faz há anos, aqui e lá fora, por dentro, sem o atleta ver o processo. A novidade é isso trabalhando do lado do atleta."',
      'Se pedirem uma métrica que você não tem na mão: "Isso vem no relatório do analista de performance, que acompanha ele depois que ele entra." Não invente métrica.'
    ], proibido: 'Inventar métrica, porcentagem ou nome de clube que usa o Zyron.' }
  ];
  window.OBJECOES = OBJ_TECNICA.concat(window.OBJECOES || []);

  window.CHECKLIST = (window.CHECKLIST || []).concat([
    'Variação técnica: confirmei na ficha que a família já conhece a AGN e o meio do futebol (se não, uso o deck padrão)',
    'Separei duas leituras do jogo dele pra falar de igual pra igual: o que o jogo já resolve e o primeiro foco'
  ]);
})();
