/* Oferta alternativa: mesmos produtos da ficha do painel, escopo preservado, dois tickets próprios desta página. */
(function () {
  'use strict';
  window.VARIACAO_NOME = 'Acompanhamento';
  const [scouting, pro, legacy] = window.PLANOS;
  window.PLANOS = [
    { ...scouting, ticket: 'R$ 247,90', preco: 'R$ 247,90', parcela: 'R$ 24,79', porDia: 'menos de R$ 3',
      descritor: 'A leitura do seu jogo', selo: 'Seu jogo com direção',
      promessa: 'A IA acompanha todo dia. O analista entrega o relatório a cada 15 dias.',
      diferenca: 'a equipe de carreira todo dia, aulas, acompanhamento individual e encaminhamentos para clubes',
      sai: ['a equipe de carreira e o gerente todo dia', 'a assessoria individual e o networking', 'os encaminhamentos, a conexão com clubes e a AGN', 'o acompanhamento e a logística das seletivas'] },
    { ...legacy, ticket: 'R$ 500,00', preco: 'R$ 500', parcela: 'R$ 50', porDia: 'menos de R$ 6',
      descritor: 'Sua carreira acompanhada todo dia', selo: 'Uma equipe do seu lado',
      inclui: [...pro.inclui, ...legacy.inclui],
      vantagens: [
        ['Estrategista e gerente de carreira', 'acompanhamento todo dia.'],
        ['David Willer', 'assessoria individual todo mês e contato no WhatsApp.'],
        ['Estrategista esportivo', 'direção para aplicar os sete módulos, relatório e ligação toda semana.'],
        ['Gestão de carreiras', 'pelo menos 15 encaminhamentos por mês, no Brasil e no mundo.'],
        ['Clubes e AGN Football', 'conexão direta e apresentação do seu perfil.'],
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
      '"No Scout PRO, o analista entrega o relatório a cada 15 dias. No Legacy, o estrategista e o gerente acompanham de perto todo dia, além das aulas, das conexões e das oportunidades."',
      '"Não é pagar pra ser escolhido. Você já passou por essa etapa. É colocar a estrutura pra trabalhar no seu desenvolvimento."'
    ], perguntas: ['Qual acompanhamento faz sentido pro momento de vocês?'], crm: [],
      atencao: 'Acompanhamento diário da IA nos dois planos; contato humano diário no Legacy. O Scout PRO mantém o relatório humano a cada 15 dias. Não prometa análise sem vídeo, resposta humana 24 horas nem contratação.' },
    oferta: { nome: 'Os dois planos', min: 2, fala: [
      '"[atleta], os dois começam com o seu jogo sendo lido pelo Zyron. O que muda é a estrutura humana do seu lado."',
      '"O Scout PRO é R$ 247,90, ou 10x sem juros de R$ 24,79: o Zyron, relatório do analista a cada 15 dias, histórico da evolução e sete módulos de formação."',
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
    { q: 'Isso garante um clube?', slides: [5, 10], resposta: [
      '"Não. O compromisso é com o trabalho, o acompanhamento e o escopo contratado. Quem decide contratar é o clube. A garantia é de devolução do investimento."'
    ] }
  ];
  window.CHECKLIST = ['Li a ficha e o Contexto do lead; a escolha do atleta se apoia em dados reais.',
    'Conferi o plano: Scout PRO R$ 247,90 (10x R$ 24,79) ou Legacy R$ 500 (10x R$ 50).',
    'Confirmei o prazo da garantia incondicional e o link de pagamento correto desta oferta.',
    'Testei o vídeo, a leitura e o nome do atleta antes de compartilhar a tela.'];
})();
