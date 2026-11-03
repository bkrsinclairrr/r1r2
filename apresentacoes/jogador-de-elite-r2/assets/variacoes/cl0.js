/* CL0 (20/10/2026): a Técnica com os ajustes que um closer pediu. Carrega depois de assets/variacoes/tecnica.js e antes de
   assets/ordem-garantia.js (ver variacoes/cl0/index.html). Não copia a Técnica: troca só o que o CL0 muda, pra o diff ficar pequeno.
   Rodada de 30/10/2026 (o mesmo closer): o CL0 ficou com 22 slides (saem a capa, o 05, o encaixe, a leitura do vídeo, o inimigo em
   comum, o depoimento da mãe, o Até lá, A decisão, O investimento e o Bem-vindo), os três planos viraram Assessoria Start, Pro e Elite
   (o segundo nome em dourado), as oportunidades passaram a ser por trimestre, e o preço entra no próprio slide dos planos, um plano
   por vez, em 12x sem juros (window.PARCELAS_N = 12 no HTML; o deck.js usa na fala e no fechamento do apresentador).
   - window.PLANOS: o texto do closer nos três planos. O nome interno de cada plano (nome) fica o de sempre ('Scout PRO', 'Assessoria PRO',
     'Assessoria de Elite Legacy'), porque a ficha salva pelo painel procura o plano por ele; muda só o que a tela e a fala mostram
     (marca e curto). "mais" é o rótulo de cima da lista nos planos (vazio: sem rótulo); cargo vazio vira linha sem negrito. As duas
     coisas são do deck.js e não mudam nada nas páginas que não usam.
   - window.ROTEIRO: Interesse alinhado (20) e Os planos (23, que agora também fecha: tem o número, o silêncio e o Pix ou cartão).
   - window.CHECKLIST: dois itens a mais.
   Os números de slide do roteiro são os de origem (data-slide-origem): o ordem-garantia.js troca pelos da tela, como na Técnica. Por isso os
   avanços vão por extenso ("o quarto avanço"): número depois de "o " (até no fim de "avanço") ele lê como slide e troca.
   Termos do closer (assessor de carreira) só nos planos e nas falas deles; o resto do deck segue com os termos de antes. O nome
   é David Willer, como no resto da casa (o closer escreveu "Davi"). */
(function () {
  'use strict';
  window.VARIACAO_NOME = 'CL0';
  const [scouting, pro, legacy] = window.PLANOS;
  const nada = { extras: [], base: [] };
  window.PLANOS = [
    { ...scouting, ...nada,
      artigo: 'a', curto: 'Assessoria Start', marca: [['Assessoria', 'br'], ['Start', 'ou']],
      parcela: 'R$ 83,08',
      descritor: 'Análise e formação para evoluir no futebol',
      selo: 'Análise e formação',
      promessa: 'Análise com IA, avaliação e evolução e os sete módulos de formação.',
      fala: 'A Assessoria Start é análise e formação pra evoluir no futebol: a análise dos vídeos com IA, a avaliação e a evolução com relatórios de performance e o histórico, o analista de performance acompanhando o desenvolvimento, os sete módulos de desenvolvimento e o guia pra preparação das peneiras.',
      mais: '',
      inclui: [
        'Análise de vídeos com IA: pontos fortes e prioridades.',
        'Avaliação e evolução: diagnóstico, relatórios e histórico.',
        'Analista de performance: o nosso scout acompanhando.',
        'Formação: os sete módulos de desenvolvimento.',
        'Preparação para peneiras: o que os avaliadores observam.'
      ],
      vantagens: [
        ['Análise de vídeos com IA', 'identificação de pontos fortes e prioridades.'],
        ['Avaliação e evolução', 'diagnóstico inicial, relatórios de performance e histórico do atleta.'],
        ['Analista de performance', 'acompanhamento por nosso scout para desenvolvimento do atleta.'],
        ['Formação', 'acesso aos sete módulos de desenvolvimento.'],
        ['Preparação para peneiras', 'guia sobre os critérios observados pelos avaliadores.']
      ],
      rotina: 'O analista de performance acompanha a sua evolução, e a IA analisa cada vídeo novo.',
      sai: ['a ligação semanal do assessor de carreira', 'o desenvolvimento orientado: os sete módulos aplicados à realidade do atleta', 'as oportunidades: pelo menos cinco direcionadas por trimestre, conforme o planejamento de carreira do atleta', 'a comunidade com outros atletas e as aulas extras'],
      diferenca: 'o assessor de carreira ligando toda semana pra orientar os próximos passos, os sete módulos aplicados à realidade do atleta, pelo menos cinco oportunidades direcionadas por trimestre, conforme o planejamento de carreira do atleta, e a comunidade com outros atletas e as aulas extras',
      garantia: false },
    { ...pro, ...nada,
      curto: 'Assessoria Pro', marca: [['Assessoria', 'br'], ['Pro', 'ou']],
      parcela: 'R$ 124,75',
      descritor: 'Orientação semanal e acesso a oportunidades',
      selo: 'Orientação toda semana',
      promessa: 'Toda semana, o assessor de carreira liga. Todo trimestre, pelo menos cinco oportunidades direcionadas.',
      fala: 'A Assessoria Pro é orientação toda semana e acesso a oportunidades, por cerca de metade do valor da Assessoria Elite: tudo da Assessoria Start, o assessor de carreira ligando toda semana pra orientar os próximos passos, os sete módulos aplicados à realidade do [atleta], pelo menos cinco oportunidades direcionadas por trimestre, conforme o planejamento de carreira dele, e a comunidade com outros atletas e as aulas extras.',
      rotulo: 'Tudo da Assessoria Start, mais:',
      mais: 'Tudo da Assessoria Start, mais:',
      inclui: [
        'Assessor de carreira: ligação semanal e próximos passos.',
        'Desenvolvimento orientado: os sete módulos na sua realidade.',
        'Oportunidades: pelo menos cinco direcionadas por trimestre.',
        'Comunidade e aulas extras: troca com outros atletas.'
      ],
      vantagens: [
        ['Assessor de carreira', 'ligação semanal para orientar e acompanhar os próximos passos.'],
        ['Desenvolvimento orientado', 'aplicação dos sete módulos à realidade do atleta.'],
        ['Oportunidades', 'pelo menos 5 oportunidades direcionadas por trimestre conforme planejamento de carreira do atleta.'],
        ['Comunidade e aulas extras', 'troca com outros atletas e conteúdos complementares.']
      ],
      bemVindo: 'A partir de hoje, você tem orientação do seu lado, toda semana.',
      rotina: 'O seu assessor de carreira liga pra orientar os próximos passos, e a IA analisa cada vídeo novo.',
      proximo: 'A ligação do assessor de carreira, pra ver o que você precisa pra ser encaminhado.',
      subir: 'Se vocês quiserem orientação toda semana e acesso a oportunidades',
      sai: ['o assessor de carreira todo dia (na Assessoria Pro, ele liga toda semana)', 'o encontro individual com o David Willer todo mês e o acompanhamento direto pelo WhatsApp', 'o plano de carreira personalizado', 'as oportunidades direcionadas dez por trimestre (na Assessoria Pro, são pelo menos cinco por trimestre)', 'o suporte nas seletivas: vídeos, avaliações e a logística', 'o grupo limitado a dez atletas'],
      diferenca: 'o assessor de carreira todo dia, com relatório e ligação toda semana, o encontro individual com o David Willer todo mês e o acompanhamento direto pelo WhatsApp, o plano de carreira personalizado, pelo menos dez oportunidades direcionadas por trimestre, conforme o planejamento de carreira do atleta, e o suporte nas seletivas, com a logística planejada com vocês',
      garantia: false },
    { ...legacy, ...nada,
      artigo: 'a', curto: 'Assessoria Elite', marca: [['Assessoria', 'br'], ['Elite', 'ou']],
      parcela: 'R$ 249,75',
      descritor: 'Acompanhamento diário e planejamento individual',
      selo: 'Acompanhamento diário',
      promessa: 'O caminho inteiro, todo dia, com o David por perto.',
      fala: 'A Assessoria Elite é o acompanhamento diário e o planejamento individual, o ideal: tudo da Assessoria Pro, o assessor de carreira todo dia, com relatório e ligação toda semana, encontro individual com o David Willer todo mês e acompanhamento direto pelo WhatsApp, o plano de carreira com metas e próximos passos, pelo menos dez oportunidades direcionadas por trimestre, conforme o planejamento de carreira dele, e o suporte nas seletivas, com a logística planejada com vocês. Grupo limitado a dez atletas.',
      mais: 'Tudo da Assessoria Pro, com acompanhamento ampliado:',
      inclui: [
        'Assessor de carreira: acompanhamento diário e ligação semanal.',
        'David Willer: encontro individual mensal e WhatsApp direto.',
        'Plano de carreira personalizado: metas e próximos passos.',
        'Mais oportunidades: pelo menos dez direcionadas por trimestre.',
        'Suporte para seletivas: vídeos, avaliações e logística.'
      ],
      base: ['E tudo da Assessoria Pro e da Assessoria Start.'],
      vantagens: [
        ['Assessor de carreira', 'acompanhamento diário, com relatório e ligação semanal.'],
        ['David Willer', 'encontro individual mensal e acompanhamento direto pelo WhatsApp.'],
        ['Plano de carreira personalizado', 'metas e próximos passos definidos para o atleta.'],
        ['Mais oportunidades', 'pelo menos 10 oportunidades direcionadas por trimestre conforme planejamento de carreira do atleta.'],
        ['Suporte para seletivas', 'organização de vídeos, avaliações e planejamento da logística com a família.'],
        ['', 'Grupo limitado a dez atletas.', 'turma']
      ],
      subir: 'Se vocês quiserem o acompanhamento diário',
      garantia: false }
  ];

  const R = window.ROTEIRO || [];
  const troca = (nome, novo) => { const i = R.findIndex(r => r && r.nome === nome); if (i >= 0) R[i] = Object.assign({}, R[i], novo); };
  // o fechamento (silêncio e Modo B) morava no slide do investimento, que saiu: vem pros planos
  const inv = R.find(r => r && r.nome === 'O investimento') || {};

  // frases das outras fases que apontavam pra um slide que saiu (a leitura ao vivo do vídeo, o 05, A decisão, O investimento): trocam o
  // número por o que existe no CL0. Só os textos de apresentador; nada disso aparece na tela.
  const reescreve = (nome, pares) => {
    const i = R.findIndex(r => r && r.nome === nome); if (i < 0) return;
    const mapeia = v => typeof v === 'string' ? pares.reduce((t, [de, para]) => t.replace(de, para), v) : Array.isArray(v) ? v.map(mapeia)
      : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, mapeia(x)])) : v;
    R[i] = mapeia(R[i]);
  };
  reescreve('Por que você', [['As palavras dele voltam no slide 05.', 'As palavras dele voltam no interesse alinhado e nos planos.']]);
  reescreve('O Zyron trabalhando (vídeo)', [['no 13: aqui', 'no dossiê do atleta: aqui']]);
  reescreve('O perfil em campo', [['a leitura do jogo é do 13, ao vivo', 'a leitura do jogo é do dossiê do atleta']]);
  reescreve('O valor real', [[/Ordem: régua[^]*?silêncio\./, 'Ordem: régua, conta, sem certeza (este slide), critério, interesse alinhado, os planos com os preços e, no fim, a garantia.']]);

  troca('Interesse alinhado', {
    fala: [
      '"Vocês conhecem como o meio cobra. A gente ganha no contrato profissional do [atleta]: hoje, um atleta que a gente coloca num clube fecha ganhando de R$ 5 a 30 mil por mês. É nesse momento, e só nele, que a gente lucra."',
      '"Vocês mesmos disseram pro estrategista esportivo que não faz sentido a gente lucrar em cima de vocês. E não lucra. O interesse de vocês e o nosso é o mesmo: a assinatura."',
      'O espelho de volta: "Foi assim com o [caso]: hoje ele tá no [clube do caso]."',
      'Cenário, curto: "[pai], o que muda na vida de vocês quando ele assinar?" Silêncio.'
    ],
    atencao: 'CL0: a faixa da tela é fixa, R$ 5 a 30 mil por mês, e não segue o campo "Quanto um atleta nosso fecha" da ficha. Pra família que já viu promessa no meio, interesse alinhado convence mais que entusiasmo. O número é referência do que já acontece, nunca promessa: cada contrato depende do clube, da categoria e do desempenho. Não fale mal de empresário: compare modelos, não pessoas. A faixa é referência da casa, de atleta nosso que fechou, não entrega de nenhum plano. Com a Assessoria Start na ficha, não diga que o plano leva a esse contrato: as oportunidades direcionadas vêm a partir da Assessoria Pro.'
  });

  troca('Os planos', {
    min: 6,
    silencio: inv.silencio || 'O número, uma vez, com a parcela. E silêncio: quem fala primeiro depois do preço perde.',
    fala: [
      'Ponte, sem falar de dinheiro, lendo o título: "Hoje quem opera a carreira dele são vocês, no tempo que sobra do trabalho. Vocês não estão mais sozinhos. O que muda de um plano pro outro é quanto dessa operação passa pra gente, e com que frequência."',
      'Primeiro avanço, a Assessoria Start, sem preço: "Análise e formação pra evoluir no futebol: a análise dos vídeos com IA, com os pontos fortes e as prioridades, o diagnóstico inicial, os relatórios de performance e o histórico, o nosso scout acompanhando o desenvolvimento como analista de performance, os sete módulos de desenvolvimento e o guia dos critérios que os avaliadores observam nas peneiras."',
      'Segundo avanço, a Assessoria Pro: "Tudo da Assessoria Start, mais orientação toda semana: o assessor de carreira liga toda semana pra orientar os próximos passos, os sete módulos aplicados à realidade do [atleta], pelo menos cinco oportunidades direcionadas por trimestre, conforme o planejamento de carreira dele, e a comunidade com outros atletas e as aulas extras."',
      'Terceiro avanço, a Assessoria Elite, a coluna em destaque: "Tudo da Assessoria Pro, com o acompanhamento ampliado, o ideal: o assessor de carreira todo dia, com relatório e ligação toda semana, encontro individual com o David Willer todo mês e acompanhamento direto pelo WhatsApp, o plano de carreira com as metas e os próximos passos do [atleta], pelo menos dez oportunidades direcionadas por trimestre, conforme o planejamento de carreira dele, e o suporte nas seletivas: vídeos, avaliações e a logística planejada com vocês. E o grupo é limitado a dez atletas."',
      'Calibração, ainda sem preço, no idioma deles: "Pelo que vocês conhecem do jogo dele, de que acompanhamento ele precisa agora: o relatório, o assessor ligando toda semana ou alguém em cima todo dia?" Espere. "E o David Willer de perto, com encontro individual todo mês: é o que vocês querem agora?" Espere. Deixe o [pai] responder.',
      'Só depois, um preço por avanço, sem enfeite, cada número uma vez. Quarto avanço, a Assessoria Start: "R$ 997, vitalício, em 12x sem juros de R$ 83,08." Quinto avanço, a Assessoria Pro: "R$ 1.497, vitalício, em 12x sem juros de R$ 124,75." Sexto avanço, a Assessoria Elite: "R$ 2.997, vitalício, em 12x sem juros de R$ 249,75." Depois do sexto, tecla S e silêncio: quem fala primeiro depois do preço perde.',
      'O porquê do vitalício, de igual pra igual: "É vitalício porque a gente tem certeza do trabalho: vocês investem uma vez e não pagam de novo. Esse valor só custeia os profissionais parceiros que vão cuidar dele: paga o trabalho deles. O nosso lucro vem do contrato dele." E olhando pro atleta: "[atleta], a gente só ganha se você ganhar."',
      'Na Assessoria Elite, de igual pra igual, apontando a tela: "Vocês sabem quanto um contrato paga. Um atleta nosso fecha ganhando de R$ 5 a 30 mil por mês: a parcela é uma fração de um mês de contrato, quando ele fechar."',
      'Se o valor pesar, a conta por dia do plano da ficha: na Assessoria Elite, "No prazo médio de 3 meses, dá [por dia] por dia."; na Assessoria Pro e na Start, "Dividido nos primeiros 3 meses, dá [por dia] por dia."',
      'Sétimo avanço, a recomendação e a chamada da tela ("Escolha o acompanhamento para o seu atleta"): "Pelo que você me falou, eu recomendo a [plano]." Se a resposta apontou outro, troque o plano no apresentador antes desse avanço.',
      'Se perguntarem da devolução aqui: "Já chego nisso, é a próxima tela." A garantia tem o slide dela, o último.',
      'Fechamento (Modo A): "Confirmando hoje, eu já aviso o [gerente]. Fica melhor no Pix ou no cartão?" Na Assessoria Pro e na Start: "eu já aviso a equipe". Depois do "Pix ou cartão?": mande no WhatsApp o link de pagamento do [plano], na própria call, e faça o pagamento com a família na linha. O link não está no deck: tenha o de cada plano à mão.',
      'Objeção: acolha, isole e volte: "Resolvido isso, eu confirmo agora. Pix ou cartão?"',
      'Trocar de plano, pelo escopo e nunca por desconto: "Existe um formato mais enxuto, a Assessoria Pro, e o que muda é isto." / "Se vocês quiserem o acompanhamento diário, a Assessoria Elite acrescenta isto." Use os botões de plano no apresentador: o destaque da tela troca junto, e o apresentador mostra o que sai ou o que entra. Descendo pra Assessoria Start: "as oportunidades direcionadas vêm a partir da Assessoria Pro." Saindo da Assessoria Elite: "as dez oportunidades por trimestre são da Assessoria Elite; na Assessoria Pro, são pelo menos cinco por trimestre."',
      '"Vocês combinaram de decidir hoje, lembra? Pode ser não, tudo bem. O que tá faltando pro sim?"'
    ],
    modoB: inv.modoB || [],
    perguntas: ['De que acompanhamento o jogo dele precisa agora: relatório, orientação toda semana ou acompanhamento diário?', 'O David Willer de perto, com encontro individual todo mês, é o que vocês querem agora?', 'Pix ou cartão?'],
    crm: ['O acompanhamento que a família escolheu, com as palavras do [pai], e o plano que você recomendou.', 'Resultado, plano fechado e forma de pagamento.', 'Modo B: a hora do retorno e o "estamos dentro".'],
    atencao: 'CL0: este slide mostra os planos primeiro, sem preço, e depois os preços, um por avanço (quarto, quinto e sexto), em 12x sem juros: Assessoria Start, R$ 997 vitalício, 12x de R$ 83,08; Assessoria Pro, R$ 1.497 vitalício, 12x de R$ 124,75; Assessoria Elite, R$ 2.997 vitalício, 12x de R$ 249,75. O porquê, nas palavras do closer que pediu: quando a pessoa vê o preço, ela para de prestar atenção e começa a pensar no bolso. Isso inverte, só no CL0, a decisão do dono de 06/10/2026 (o investimento no topo de cada coluna); nas outras páginas o preço continua no topo. Não fale número antes do quarto avanço, nem se perguntarem: "já chego lá, primeiro quero que vocês vejam o que cada um entrega". Cada coluna é o que o plano acrescenta ao de baixo: aponte o que muda, não leia tudo. A Assessoria Elite vem em destaque, como o ideal. Oportunidade direcionada é oportunidade real, não aprovação nem contratação: o rodapé diz isso e fica sempre na tela. O David Willer, as dez oportunidades por trimestre e o grupo de dez são da Assessoria Elite: não atribua à Assessoria Pro nem à Start. As oportunidades direcionadas vêm a partir da Assessoria Pro, com pelo menos cinco por trimestre. Depois do número, silêncio. Os 3 meses do "por dia" são só a conta: na Assessoria Pro e na Start, não ligue esses 3 meses a oportunidade nenhuma. Travou no valor: isole ("tirando o valor, tem mais alguma coisa?"), diagnostique (retorno ou dinheiro agora) e volte nos slides de valor, de seleção ou de interesse alinhado. Família do meio que pede pra "pensar com calma" quase sempre quer sentir controle: Modo B, se a análise da equipe for real. A garantia não entra aqui: ela tem o slide dela, o último, depois dos preços. Link de pagamento: fora do deck, pelo WhatsApp, só depois do sim. Nunca "o mais barato", "o mais vendido" ou "o mais escolhido".'
  });

  window.CHECKLIST = (window.CHECKLIST || []).concat([
    'CL0: conferi que a garantia só aparece no último slide, depois dos preços (os planos não falam dela)',
    'CL0: nos planos, os preços entram um por vez (quarto, quinto e sexto avanços), depois das três colunas; não falo número antes'
  ]);
})();
