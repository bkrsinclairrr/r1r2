/* Oferta alternativa: mesmos produtos da ficha do painel, escopo preservado, dois tickets próprios desta página.
   Rodada de 03/11/2026 (o closer Pedro): a página ficou com 24 slides (eram 32). A capa e o "Por que você" viraram um slide só (o de
   escolha, que já leva o nome, a foto e o perfil), o Zyron e o vídeo dele viraram um slide só, e saíram os cinco verbos, o encaixe
   ("próximo Neymar"), o seu perfil em campo, o olhômetro × Zyron, o "Peneira decide no olhômetro" e as oportunidades do perfil. No
   plano de R$ 500 (Legacy), o David Willer sai e entra "Pedro ou Cleiton", o estrategista esportivo deixa de ser uma linha própria
   (era o mesmo estrategista da linha de cima) e "Gestão de carreiras" virou "Oportunidades". Os números de slide do roteiro são os de
   origem (data-slide-origem): o ordem-garantia.js troca pelos da tela. Por isso os avanços vão por extenso ("Segundo avanço"): número
   depois de "o " (até no fim de "avanço") ele lê como slide e troca. */
(function () {
  'use strict';
  window.VARIACAO_NOME = 'Acompanhamento';
  const [scouting, pro, legacy] = window.PLANOS;
  window.PLANOS = [
    { ...scouting, ticket: 'R$ 247,90', preco: 'R$ 247,90', parcela: 'R$ 24,79', porDia: 'menos de R$ 3',
      descritor: 'A leitura do seu jogo', selo: 'Seu jogo com direção',
      promessa: 'A IA acompanha todo dia. O analista entrega o relatório.',
      diferenca: 'a equipe de carreira todo dia, aulas, acompanhamento individual e encaminhamentos para clubes',
      sai: ['a equipe de carreira e o gerente todo dia', 'a assessoria individual e o networking', 'os encaminhamentos e a conexão com clubes', 'o acompanhamento e a logística das seletivas'] },
    { ...legacy, ticket: 'R$ 500,00', preco: 'R$ 500', parcela: 'R$ 50', porDia: 'menos de R$ 6',
      descritor: 'Sua carreira acompanhada todo dia', selo: 'Uma equipe do seu lado',
      promessa: 'O caminho inteiro, todo dia, com a equipe de carreira do seu lado.',
      inclui: [...pro.inclui, ...legacy.inclui].map(l => l.replace('com o David Willer', 'com o Pedro ou o Cleiton').replace(' e um estrategista esportivo', '')),
      vantagens: [
        ['Estrategista e gerente de carreira', 'acompanhamento todo dia, com relatório e ligação toda semana e direção para aplicar os sete módulos.'],
        ['Pedro ou Cleiton', 'assessoria individual todo mês e contato no WhatsApp.'],
        ['Oportunidades', 'pelo menos 15 encaminhamentos por mês, no Brasil e no mundo.'],
        ['Clubes', 'conexão direta e apresentação do seu perfil.'],
        ['Networking e aulas extras', 'conexões com atletas, além dos módulos.'],
        ['Plano de carreira', 'feito pro seu jogo; a equipe busca clube, vídeo e avaliação.'],
        ['Seletivas', 'acompanhamento e logística planejada com vocês.'],
        ['Turma de 10', 'atenção de perto no seu desenvolvimento.', 'turma']
      ],
      base: ['E tudo do Scout PRO.'], subir: 'Se vocês querem o acompanhamento de carreira todo dia',
      fala: 'O Legacy reúne a leitura do Zyron, a equipe de carreira todo dia, assessoria individual, aulas, conexões e acompanhamento das oportunidades.' }
  ];
  window.ROTEIROS_EXTRAS = {
    acompanhamento: { nome: 'O acompanhamento diário', min: 1.5, fala: [
      '"[atleta], você foi escolhido pelo que a equipe viu no seu jogo. Agora essa leitura precisa virar rotina."',
      '"O investimento paga o funcionamento da IA e o trabalho dos profissionais que vão acompanhar você. O Zyron acompanha o seu jogo diariamente a partir dos vídeos enviados."',
      '"No Scout PRO, o analista entrega o relatório. No Legacy, o estrategista e o gerente acompanham de perto todo dia, além das aulas, das conexões e das oportunidades."',
      '"Não é pagar pra ser escolhido. Você já passou por essa etapa. É colocar a estrutura pra trabalhar no seu desenvolvimento."'
    ], perguntas: ['Qual acompanhamento faz sentido pro momento de vocês?'], crm: [],
      atencao: 'Acompanhamento diário da IA nos dois planos; contato humano diário no Legacy. O Scout PRO mantém o relatório humano. Não prometa análise sem vídeo, resposta humana 24 horas nem contratação.' },
    oferta: { nome: 'Os dois planos', min: 2, fala: [
      '"[atleta], os dois começam com o seu jogo sendo lido pelo Zyron. O que muda é a estrutura humana do seu lado."',
      '"O Scout PRO é R$ 247,90, ou 10x sem juros de R$ 24,79: o Zyron, relatório do analista, histórico da evolução e sete módulos de formação."',
      '"O Legacy é R$ 500, ou 10x sem juros de R$ 50: tudo do Scout PRO, com a equipe de carreira todo dia, assessoria individual, aulas, conexões e acompanhamento das oportunidades."',
      '"Pelo que vocês me contaram, eu recomendo o [plano]. Faz sentido?" Espere a resposta antes de seguir à garantia.'
    ], silencio: 'Fale o investimento do plano recomendado e espere a família responder.',
      perguntas: ['Qual dos dois acompanha melhor o momento de vocês?'], crm: ['Plano escolhido e forma de pagamento.'],
      modoB: ['Só quando houver análise real da equipe: combine um horário concreto pra retornar com o resultado.'],
      atencao: 'Mesma construção de preço nos dois planos. Não apresente o antigo intermediário nem os preços antigos. Não dê desconto: o que muda é o escopo.' }
  };
  window.OBJECOES = [
    { q: 'Qual a diferença entre os planos?', slides: [23, 24], resposta: window.ROTEIROS_EXTRAS.oferta.fala.slice(0, 3) },
    { q: 'O valor tá alto / não tenho agora', slides: [17, 24], resposta: [
      '"Entendo. Tirando o investimento, tem mais alguma coisa que impede vocês de começar?"',
      '"Os dois podem ser pagos em 10x sem juros. O Scout PRO preserva a leitura e o relatório; o Legacy acrescenta a equipe de carreira todo dia. Qual escopo cabe no momento de vocês?"'
    ], proibido: 'Desconto, preço antigo ou prometer no Scout PRO as entregas do Legacy.' },
    { q: 'E se não fizer sentido? / Tem garantia?', slides: [21], resposta: [] },
    { q: 'Isso garante um clube?', slides: [5], resposta: [
      '"Não. O compromisso é com o trabalho, o acompanhamento e o escopo contratado. Quem decide contratar é o clube. A garantia é de devolução do investimento."'
    ] }
  ];
  window.CHECKLIST = ['Li a ficha e o Contexto do lead; a escolha do atleta se apoia em dados reais.',
    'Conferi o plano: Scout PRO R$ 247,90 (10x R$ 24,79) ou Legacy R$ 500 (10x R$ 50).',
    'Confirmei o prazo da garantia incondicional e o link de pagamento correto desta oferta.',
    'Testei o vídeo, a leitura e o nome do atleta antes de compartilhar a tela.'];

  // o roteiro dos slides que mudaram (R é o roteiro.js: o índice é a origem menos 1)
  const R = window.ROTEIRO || [];
  const troca = (origem, novo) => { if (R[origem - 1]) R[origem - 1] = Object.assign({}, R[origem - 1], novo); };
  const reescreve = (origem, pares) => {
    const mapeia = v => typeof v === 'string' ? pares.reduce((t, [de, para]) => t.replace(de, para), v) : Array.isArray(v) ? v.map(mapeia)
      : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, mapeia(x)])) : v;
    if (R[origem - 1]) R[origem - 1] = mapeia(R[origem - 1]);
  };

  // a abertura: a capa (origem 1) e o "Por que você" (origem 2) são um slide só, o de escolha. Fica o roteiro dos dois juntos
  troca(2, {
    nome: 'Abertura: por que você', min: 2,
    fala: [
      'Conexão pelo nome (4.1): "[pai], [mãe], [atleta], prazer. Eu sou o gestor de carreiras. Li tudo o que vocês conversaram com o estrategista esportivo, e hoje eu trago o planejamento de carreira do [atleta]."',
      'Veio do Zyron: "[atleta], o Zyron analisou o teu vídeo, e a equipe aprovou o que viu: [característica]. Não é todo mundo que chega até essa conversa."',
      'Veio do formulário: "[atleta], você contou pra gente: [experiência]. Foi isso que a equipe viu. Você já é jogador, o que falta é o caminho."',
      'Sem contexto: "A equipe analisou o teu jogo e aprovou o teu perfil. Por isso vocês estão aqui."',
      'Exclusividade (03): "Eu não falo com toda família. Se o [atleta] chegou até aqui, é porque tem o perfil que a gente procura."',
      'Olhando pro atleta, não pros pais: "E guarda isso, [atleta]: se você tá vendo essa apresentação, é porque tem o que é preciso. A gente não perde tempo montando plano pra quem não tem."',
      'Plante o espelho, como quem acabou de perceber: "Sabe que, lendo o teu perfil, você me lembrou muito um atleta nosso? Daqui a pouco eu te mostro quem é." Não fale o nome ainda: a curiosidade segura a atenção.',
      'O plano é dele, olhando pro atleta: "Esse plano é só do [atleta]: nenhum outro atleta tem o mesmo. Ele sai da tua história e do teu jogo."',
      'Ponte: "Hoje eu trago o plano pra levar você até lá."'
    ],
    crm: ['Quem está na call (pai, mãe, atleta) e se algum decisor falta.'],
    atencao: 'Este é o primeiro slide da apresentação: ele reúne o que eram a capa e o "Por que você". Chame cada um pelo nome desde o primeiro minuto. Decisor fora da call: pare aqui e reagende. Confirme o que ele já contou, nunca pergunte de novo. "Só do [atleta]" é sobre o plano, nunca sobre o nível dele: nada de "você é único", "especial" ou "o melhor". Use as palavras do Contexto do CRM. O atleta sai deste slide sabendo que foi escolhido. O espelho só entra com o caso real preenchido na ficha (grupo Caso espelho); sem caso, pule a frase. Esta página não tem o slide que revela o caso: se plantar o espelho, conte quem é de viva voz mais adiante.'
  });

  // o Zyron (origem 7) e o vídeo dele (origem 8) são um slide só
  troca(7, {
    nome: 'Zyron e o vídeo', min: 2.5,
    fala: [
      'Abra como a resposta, apontando o rótulo: "Lembra da coluna vazia do olhômetro? A resposta tem nome: o Zyron."',
      'Veio do Zyron: "É o mesmo Zyron que analisou o vídeo do [atleta]. Dentro da assessoria, ele acompanha o [atleta] o tempo todo, com um estrategista de carreiras só dele."',
      '"O olhômetro olha. O Zyron mede: lê cada lance do vídeo, com o mesmo critério pra todo atleta, e mostra a evidência em vídeo de cada ponto."',
      '"Clube grande já escolhe atleta assim há anos, aqui e lá fora, só que por dentro, sem o garoto nem saber que foi visto desse jeito. Agora isso trabalha do lado do [atleta]. E não é qualquer atleta que tem acesso: só quem passa pelo filtro."',
      '"Vou te mostrar ele trabalhando." Antes do play: "Repara no que ele marca em cada lance." Dê o play (espaço no deck ou os capítulos no apresentador) e fique quieto.',
      'Depois: "Consegue imaginar o jogo do [atleta] passando por aí? É isso que entra no plano dele, a cada vídeo novo."'
    ],
    perguntas: ['Consegue imaginar o jogo do [atleta] passando por aí?'],
    crm: [],
    atencao: 'O Zyron e o vídeo dele estão no mesmo slide (eram dois). Abre como a resposta ao olhômetro do 04: gelo na tela, laranja só no olhômetro. Exclusividade: o acesso ao Zyron é pra quem passa pelo filtro. O Zyron analisa o vídeo que a família envia, lance a lance: nunca diga que ele assiste jogos inteiros. "Precisão" aqui é lance a lance, mesmo critério e evidência em vídeo: nunca percentual de acerto, nunca "a IA não erra", nunca "mais preciso que qualquer olheiro". Compartilhe a guia com áudio e teste o vídeo antes. Se todos os decisores viram o vídeo na R1, não rode inteiro: use os capítulos "O relatório: o que treinar" e "A base de clubes". Se travar na chamada, siga pro próximo slide e explique, nas suas palavras, a leitura lance a lance, o relatório e o acompanhamento. Com o vídeo do atleta no painel, quem prova é o jogo dele, no 13: aqui, rode só "A leitura lance a lance" e "A base de clubes".'
  });

  // frases de outros slides que apontavam pra um slide que saiu
  troca(6, {
    atencao: 'Bloco do Zyron, o mesmo que a família viu na R1: este slide e o do Zyron com o vídeo, logo depois. Sonho e o que falta já estão na ficha e vieram da ficha do SDR: não pergunte de novo. Se todos os decisores estavam na R1, passe rápido e use o vídeo só pelos capítulos; se um decisor não estava, mostre inteiro, com o vídeo.'
  });
  reescreve(25, [['O fecho do campo, apontando a miniatura: "Olha o teu lugar de novo, [atleta].', 'A miniatura do campo, apontando: "Olha o teu lugar, [atleta].']]);
  // o "23" do roteiro é a tela dos três planos, que esta página não tem: com 24 slides, o 23 virou a garantia
  reescreve(5, [['são o passo de cada plano do 23, um por degrau.', 'são o passo de cada plano, que a tela dos planos mostra.'], ['o 23 mostra o que cada plano entrega.', 'a tela dos planos mostra o que cada plano entrega.']]);
  reescreve(18, [['O 23 mostra o que cada plano entrega.', 'A tela dos planos mostra o que cada plano entrega.']]);
  reescreve(22, [['O 23 mostra os planos com o investimento de cada um, e o 24 fecha com o plano da ficha.', 'A tela dos planos mostra os dois planos com o investimento de cada um e fecha com o plano da ficha.']]);
})();
