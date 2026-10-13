/* Roteiro do Estrategista Esportivo (SDR) para a R1.
   Fonte única: alimenta o modo apresentador e o arquivo notas-do-apresentador.md.
   Base: PLAYBOOK_SDR.md (números entre parênteses), CASOS.md e APRESENTACAO_R1.md.
   [atleta] e [responsável] são trocados pelos nomes da ficha no modo apresentador. */

window.ROTEIRO = [
  { nome: 'E se?', min: 1,
    fala: [
      '"O que mudaria pra vocês se ele fosse visto assim, lance a lance?"',
      'Pro atleta (6.5): sonho e o que falta.'
    ],
    perguntas: [
      'O que mudaria pra vocês se ele fosse visto assim?',
      '[atleta], em que time você sonha jogar?',
      'O que você sente que tá faltando pra você chegar lá?'
    ],
    crm: ['Sonho do atleta', 'O que ele acha que falta'],
    atencao: 'Espere a resposta. Sem ela, não passe pro Zyron: o produto só entra depois que a família disse o que quer.'
  },
  { nome: 'Ficha do atleta', min: 1,
    fala: [
      'Com a ficha dele na tela, chame o atleta pelo nome: "[atleta], a conversa de hoje é sobre o teu jogo. Essa é a tua ficha."',
      'Confirme os dados sem refazer o que já está no CRM: "Posição, idade e cidade estão certos?"'
    ],
    perguntas: ['Posição, idade e cidade estão certos?'],
    crm: ['Dados corrigidos, se algo estava errado: nome, posição, idade, cidade'],
    atencao: 'Nome, posição, idade e cidade vêm do painel: cadastre o atleta antes da call e abra o deck pelo link dele (?a=). Sem o painel, preencha a ficha no apresentador. Sem nome, o slide mostra "Você". Só o primeiro nome vai pra tela.'
  },
  { nome: 'Zyron', min: 1,
    fala: [
      'Se o lead veio do Zyron: "É o mesmo Zyron que analisou o [atleta]. A diferença é que, dentro da assessoria, ele acompanha o [atleta] o tempo todo."',
      '"Clube grande já escolhe atleta assim há anos, aqui e lá fora, só que por dentro, sem o garoto nem saber que foi visto desse jeito. Agora isso chegou até vocês. Mas não é qualquer atleta que tem acesso."',
      '"Vou te mostrar ele trabalhando."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Exclusividade: o acesso ao Zyron é pra quem passa pelo filtro.'
  },
  { nome: 'O Zyron trabalhando (vídeo)', min: 3,
    fala: [
      'Antes do play: "Repara no que ele marca em cada lance." Dê play e fique quieto.',
      'Depois: "Consegue imaginar o jogo do [atleta] passando por aí?"'
    ],
    perguntas: ['Consegue imaginar o jogo do [atleta] passando por aí?'],
    crm: [],
    atencao: 'Compartilhe a guia com áudio. Os capítulos ao lado do vídeo são clicáveis: use pra voltar no trecho que responde uma objeção. Se o vídeo travar na chamada, não insista: vá pro próximo slide e explique com os cinco verbos.'
  },
  { nome: 'Como o Zyron funciona', min: 0.5,
    fala: [
      '"O que você viu, em cinco verbos: a ficha e o vídeo entram, o Zyron lê cada lance, sai o relatório, o estrategista de carreiras acompanha, e a gente conecta."'
    ],
    perguntas: [],
    crm: [],
    atencao: '30 segundos, sem travar a conversa. Reforce a autorização expressa do responsável: é resposta pronta pro "isso é golpe?".'
  },
  { nome: 'Olhômetro ou dados reais', min: 1,
    fala: [
      'Leia em voz alta só a coluna do olhômetro e pergunte: "Foi assim nas peneiras dele?"',
      'Fecho: "Os grandes clubes já escolhem jogador com dados há anos, por dentro. Agora essa leitura joga do lado do [atleta]."'
    ],
    perguntas: ['Foi assim nas peneiras dele?'],
    crm: [],
    atencao: 'Não cite nome de clube como exemplo de quem usa dados.'
  },
  { nome: 'O encaixe', min: 1,
    fala: [
      '"Ele não precisa ser o melhor entre 22. Precisa ser encontrado por quem procura o perfil dele. Todo elenco tem uma lacuna."',
      '"O Zyron encontra o perfil. A gente faz a ponte."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'É aqui que a família entende o que é a assessoria: a IA encontra, a gente conecta. Nunca prometa clube, prazo ou contrato.'
  },
  { nome: 'IA na Prática (ao vivo)', min: 3,
    fala: [
      'Ponte, logo depois do encaixe: "Até aqui eu te mostrei o Zyron com o jogo dos outros. Agora eu quero te mostrar com o teu, [atleta]. Ao vivo, aqui na nossa chamada."',
      'Antes do play, olhando pro atleta: "Presta atenção: o que aparecer agora fala só de você." Troque o compartilhamento do Meet pro vídeo do [atleta] e rode a leitura do Zyron na frente da família.',
      'Enquanto o Zyron lê, fique quieto. Deixe a família ver o jogo dele passando pela análise, lance a lance.',
      'O resultado é dito ao vivo, no Meet, por quem conduz a leitura, com as palavras da análise. O slide não antecipa nada. Depois, volte o compartilhamento pro deck.'
    ],
    perguntas: ['[atleta], alguém já tinha olhado o teu jogo desse jeito?', '[responsável], o que vocês sentiram vendo o jogo dele lido assim?'],
    crm: ['Reação do atleta e da família à leitura ao vivo, com as palavras deles.', 'Empolgação do atleta (0 a 10)'],
    atencao: 'O slide não mostra resultado de propósito: quem fala o resultado é quem conduz a leitura, ao vivo, no Meet. Não antecipe, não resuma antes da hora e não diga nada que a análise não mostrou. Teste antes da call: o vídeo do [atleta] aberto e o compartilhamento de tela com áudio. Vídeo e dados só com autorização expressa do responsável. Sem vídeo do atleta (lead frio, sem vídeo), pule este slide.'
  },
  { nome: 'A base do Zyron', min: 1,
    fala: [
      '"O perfil do [atleta] é cruzado com a base do Zyron: mais de 250 clubes parceiros, aqui e lá fora. Esses 10 são só o começo."',
      '"E quem faz a ponte com eles é a nossa equipe."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Fale de rede e de encaixe, nunca de "vaga garantida" em clube. Se perguntarem qual clube: "Isso depende do perfil dele, e é o Gestor de Carreiras que te mostra o plano."'
  },
  { nome: 'Você para de jogar sozinho', min: 1.5,
    fala: [
      'Diferencial (6.11): "Aqui o [atleta] não fica solto. Ele vai ter um gerente de carreira acompanhando o desenvolvimento dele todo dia. E um estrategista de carreiras do Zyron só dele. Isso não existe em escolinha, em peneira, em lugar nenhum."',
      'Na coluna da direita, olhando pros pais (8.6): "Depois que ele entra, quem corre atrás é a gente."',
      'Locomoção (6.8), sempre com "quando", nunca com "se".'
    ],
    perguntas: ['Quando o [atleta] for pro clube, pode ser em outro estado. Ele tem condição de ir? Alguém da família acompanha, ou ele vai sozinho?'],
    crm: ['Locomoção pra outro estado'],
    atencao: 'Se perguntarem de viagem: "Quando o clube chamar, o gerente de carreira cuida disso junto com vocês." Não diga que a empresa paga viagem.'
  },
  { nome: 'Do seu lado', min: 1,
    fala: [
      '"Ele vai ter um gerente de carreira acompanhando o desenvolvimento dele todo dia."',
      'A gente só ganha quando ele ganha (6.10): "Deixa eu te fazer uma pergunta: faz algum sentido pra gente, que já revelou centenas de atletas, querer lucrar em cima de vocês, sendo que a gente ganha no contrato profissional do [atleta]?"',
      'Depois do "não": "Pois é. A gente só ganha quando ele ganha. Por isso a gente escolhe muito bem com quem trabalha."'
    ],
    perguntas: ['Faz algum sentido pra gente querer lucrar em cima de vocês, sendo que a gente ganha no contrato profissional dele?'],
    crm: ['Respondeu "não faz sentido lucrar em cima"?'],
    atencao: 'Espere o "não" em voz alta. Quem responde passa a defender a ideia, e o Gestor ancora o valor em cima disso.'
  },
  { nome: 'AGN Football', min: 0.5,
    fala: [
      '"A gente tem relação direta com a AGN Football. Tem jogador nosso publicado lá. Te mando o link logo depois da nossa conversa."'
    ],
    perguntas: [],
    crm: ['Link da AGN enviado? (logo depois da call)'],
    atencao: 'Prova que a família confere sozinha. Mande o link com a confirmação da R2.'
  },
  { nome: 'Jogadores que passaram pela AGN', min: 0.5,
    fala: [
      'Apontando a tela: "E pra vocês terem noção do nível: esses são jogadores que passaram pela AGN Football. É nesse canal que estão publicados atletas nossos."',
      '"Não precisa acreditar em mim: vocês conferem sozinhos. O link da AGN vai pro teu WhatsApp depois da nossa conversa."'
    ],
    perguntas: ['[atleta], conhece algum deles?'],
    crm: [],
    atencao: 'Precisão: são jogadores que passaram pela AGN, não atletas da Jogador de Elite. Nunca diga que são nossos, que a AGN contrata ou que garante clube, e não cite clube, valor ou história de nenhum deles além do que está na tela. Se a família reconhecer alguém, deixe ela falar: é a prova mais forte do slide.'
  },
  { nome: 'O preço da disciplina', min: 1.5,
    fala: [
      'Escada do sim: uma pergunta por vez, esperando cada resposta. A terceira é pro pai e pra mãe.',
      'Logo depois, decisores (6.9): quem decide e como decide.'
    ],
    perguntas: [
      '[atleta], você quer ser jogador profissional?',
      'Está disposto a pagar o preço da disciplina, mesmo nos dias ruins?',
      '[responsável], vocês apoiam ele nisso?',
      'Além de você, quem mais participa dessa decisão em casa?',
      'Quando vocês decidem uma coisa importante pro [atleta], como costuma ser? Os dois juntos?',
      'Me passa o número dele(a), que eu mando a confirmação pros dois.'
    ],
    crm: ['Decisores e como decidem', 'Telefones dos decisores'],
    atencao: 'Cada "sim" dito em voz alta, na frente dos pais, vira compromisso que o próprio atleta cobra depois.'
  },
  { nome: 'O próximo', min: 0.5,
    fala: [
      'Virada de valor percebido (6.5): "[atleta], imagina você entrando em campo com a camisa do [clube dos sonhos], sabendo que teve um gerente de carreira e o Zyron cuidando de cada detalhe até ali. É isso que a gente constrói."'
    ],
    perguntas: [],
    crm: [],
    atencao: 'Fale do resultado final, nunca do entregável e nunca com número de preço.'
  },
  { nome: 'O próximo passo', min: 2,
    fala: [
      'Missão do atleta (6.14): "[atleta], na conversa com o Gestor de Carreiras eu quero você lá, com teu pai e tua mãe, contando pra eles o que me contou hoje. Combinado?"',
      'Pré-compromisso (6.15): "Na conversa, o Gestor vai mostrar o plano do [atleta] e o investimento. Se fizer sentido, vocês decidem ali mesmo, os dois juntos?" Espere o "sim". "Por isso é importante estarem os dois: é nessa conversa que a vaga dele na turma é definida."',
      'Agendar (6.16), sempre dois horários: "Ele tem [dia/hora] ou [dia/hora]. Qual fica melhor?"',
      'Fechar (10): "Fechado: [dia] às [hora], com vocês e o [atleta]. O horário fica reservado só pro [atleta]. Me confirma com um confirmo?"'
    ],
    perguntas: ['Se fizer sentido, vocês decidem ali mesmo, juntos?', 'Fica melhor [dia/hora] ou [dia/hora]?'],
    crm: ['Pré-compromisso de decidir na R2', 'Missão dada ao atleta', 'R2: dia e hora', 'Todos os decisores confirmados'],
    atencao: 'Só desligue depois do "confirmo". Sem "confirmo", não conta como agendado. Os dois nomes e os dois telefones vão pro CRM.'
  }
];

window.OBJECOES = [
  { q: 'Quanto custa?', slides: [16], resposta: [
    '"Cada perfil é individual, então o plano do [atleta] é montado pra ele, e o investimento vem junto com o plano."',
    '"Olha o que entra nisso: um gerente de carreira acompanhando ele todo dia e o Zyron, com um estrategista de carreiras só dele."',
    '"E pensa comigo: faz sentido a gente querer lucrar em cima de vocês, sendo que a gente ganha no contrato profissional dele? O Gestor te mostra o plano e o valor juntos. Fica melhor [dia/hora] ou [dia/hora]?"',
    'Nunca passe preço. Nunca abra slide de valores.'
  ]},
  { q: 'Isso é golpe? É peneira paga?', slides: [12, 13, 11], resposta: [
    '"Pergunta justa. Tem muita coisa errada nesse meio, e é por isso que a gente trabalha diferente."',
    '"Peneira paga cobra pra olhar o menino um dia, no olhômetro. Aqui ele é analisado com dados pelo Zyron, tem gerente de carreira todo dia, e a gente só ganha quando ele assina contrato."',
    'Mostre a AGN, o David nas assinaturas e a autorização expressa do responsável.'
  ]},
  { q: 'Isso de inteligência artificial funciona mesmo?', slides: [4, 6, 8], resposta: [
    '"Clube grande já escolhe atleta assim há anos, aqui e lá fora, só que sempre por dentro, sem o atleta nem saber que foi visto desse jeito."',
    '"A novidade é que agora isso chegou até o atleta. Mas não é qualquer um que tem acesso: só quem passa pelo nosso filtro, como o [atleta] tá passando agora."',
    'Se a leitura ao vivo já rodou (slide 8): "Vocês viram com o jogo do [atleta], ao vivo, aqui na nossa chamada."'
  ]},
  { q: 'Vou pensar / Agora não é o momento', slides: [16], resposta: [
    '"Pensar sobre o quê exatamente? A conversa com o Gestor é justamente pra vocês decidirem com o plano do [atleta] na mão."',
    'Se for momento: "Com [idade] anos, cada mês conta. A base tem prazo."'
  ]},
  { q: 'Preciso ver com meu marido / minha esposa', slides: [16], resposta: [
    '"Perfeito, é exatamente por isso que a conversa com o Gestor é com vocês dois. Qual horário vocês dois conseguem juntos?"',
    '"Me passa o número dele(a)? Mando a confirmação pros dois."'
  ]},
  { q: 'Me manda as informações por aqui', slides: [16], resposta: [
    '"Não tem folder porque não é pacote: o plano é montado pro [atleta], com gerente de carreira e estrategista de carreiras do Zyron dele. Por isso a conversa. [dia/hora] ou [dia/hora]?"'
  ]},
  { q: 'Não tenho tempo', slides: [10], resposta: [
    '"É rápido e no horário de vocês. Pode ser à noite ou no fim de semana. Qual fica melhor?"',
    '"E depois que o [atleta] entra, quem corre atrás é a gente. Vocês não vão precisar tirar tempo do trabalho pra tocar isso."'
  ]},
  { q: 'Ele já tem empresário / já tá num clube', slides: [10, 5], resposta: [
    '"Ótimo, isso mostra que ele tem nível. Me diz uma coisa: tem alguém acompanhando o desenvolvimento dele todo dia? Nesse último ano, em quantos testes ele foi levado?"',
    '"Aqui ele teria gerente de carreira todo dia e um estrategista de carreiras do Zyron só dele. O Gestor te mostra o que muda."'
  ]},
  { q: 'Ele é muito novo / já tá velho', slides: [], resposta: [
    'Novo: "Novo é vantagem. Quanto antes começa, mais janela ele tem."',
    'Velho: "É exatamente por isso que não dá pra esperar. O Gestor te mostra como aproveitar a janela que ele tem agora."'
  ]},
  { q: 'Ele não pode ir pra outro estado', slides: [10], resposta: [
    '"Hoje ele não precisa ir pra lugar nenhum. Isso só acontece quando o clube chamar, e o gerente de carreira cuida disso junto com vocês."',
    '"Me conta o que pesa mais: ele ir sozinho, ou a família não conseguir acompanhar?"'
  ]},
  { q: 'Vocês são tipo uma escolinha?', slides: [6, 10], resposta: [
    '"Escolinha treina. A gente leva pro clube. Gerente de carreira todo dia, estrategista de carreiras do Zyron só dele e relação direta com a AGN Football."'
  ]}
];
