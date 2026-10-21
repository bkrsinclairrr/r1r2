/* CL0 (20/10/2026): a Técnica com os ajustes que um closer pediu. Carrega depois de assets/variacoes/tecnica.js e antes de
   assets/ordem-garantia.js (ver variacoes/cl0/index.html). Não copia a Técnica: troca só o que o CL0 muda, pra o diff ficar pequeno.
   - window.PLANOS: o texto do closer nos três planos (o 23, os planos, e o 24, o investimento) e sem a linha da garantia no 24
     (garantia: false). O nome interno de cada plano fica o de sempre, porque a ficha salva pelo painel procura o plano por ele;
     muda só o que a tela mostra (marca). "mais" é o rótulo de cima da lista no 23 (vazio: sem rótulo); cargo vazio vira linha sem
     negrito. As duas coisas são do deck.js e não mudam nada nas páginas que não usam.
   - window.ROTEIRO: Interesse alinhado (20), A vaga (22), Os planos (23), O investimento (24) e Bem-vindo (25).
   - window.CHECKLIST: um item a mais.
   Os números de slide do roteiro são os de origem (data-slide-origem): o ordem-garantia.js troca pelos da tela, como na Técnica. Por isso os
   avanços vão por extenso ("o quarto avanço"): número depois de "o " (até no fim de "avanço") ele lê como slide e troca.
   Termos do closer (assessor de carreira) só do 22 ao 25 e nas falas deles; o resto do deck segue com os termos de antes. O nome
   é David Willer, como no resto da casa: é o que a mãe do áudio diz (conferido em 20/10/2026), e não o "Davi" da mensagem. */
(function () {
  'use strict';
  window.VARIACAO_NOME = 'CL0';
  const [scouting, pro, legacy] = window.PLANOS;
  const nada = { extras: [], base: [] };
  window.PLANOS = [
    { ...scouting, ...nada,
      descritor: 'Análise e formação para evoluir no futebol',
      selo: 'Análise e formação',
      promessa: 'Análise com IA, avaliação e evolução e os sete módulos de formação.',
      fala: 'O Scout PRO é análise e formação pra evoluir no futebol: a análise dos vídeos com IA, a avaliação e a evolução com relatórios de performance e o histórico, o analista de performance acompanhando o desenvolvimento, os sete módulos de desenvolvimento e o guia pra preparação das peneiras.',
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
      sai: ['a ligação semanal do assessor de carreira', 'o desenvolvimento orientado: os sete módulos aplicados à realidade do atleta', 'as oportunidades: pelo menos cinco encaminhamentos por mês, pra clubes no Brasil e no exterior', 'a comunidade com outros atletas e as aulas extras'],
      diferenca: 'o assessor de carreira ligando toda semana pra orientar os próximos passos, os sete módulos aplicados à realidade do atleta, pelo menos cinco encaminhamentos por mês pra clubes no Brasil e no exterior, e a comunidade com outros atletas e as aulas extras',
      garantia: false },
    { ...pro, ...nada,
      descritor: 'Orientação semanal e acesso a oportunidades',
      selo: 'Orientação toda semana',
      promessa: 'Toda semana, o assessor de carreira liga. Todo mês, pelo menos cinco encaminhamentos.',
      fala: 'A Assessoria PRO é orientação toda semana e acesso a oportunidades, por cerca de metade do valor do Legacy: tudo do Scout PRO, o assessor de carreira ligando toda semana pra orientar os próximos passos, os sete módulos aplicados à realidade do [atleta], pelo menos cinco encaminhamentos por mês pra clubes no Brasil e no exterior, e a comunidade com outros atletas e as aulas extras.',
      rotulo: 'Tudo do Scout PRO, mais:',
      mais: 'Tudo do Scout PRO, mais:',
      inclui: [
        'Assessor de carreira: ligação semanal e próximos passos.',
        'Desenvolvimento orientado: os sete módulos na sua realidade.',
        'Oportunidades: pelo menos cinco encaminhamentos por mês.',
        'Comunidade e aulas extras: troca com outros atletas.'
      ],
      vantagens: [
        ['Assessor de carreira', 'ligação semanal para orientar e acompanhar os próximos passos.'],
        ['Desenvolvimento orientado', 'aplicação dos sete módulos à realidade do atleta.'],
        ['Oportunidades', 'pelo menos cinco encaminhamentos por mês para clubes no Brasil e no exterior.'],
        ['Comunidade e aulas extras', 'troca com outros atletas e conteúdos complementares.']
      ],
      bemVindo: 'A partir de hoje, você tem orientação do seu lado, toda semana.',
      rotina: 'O seu assessor de carreira liga pra orientar os próximos passos, e a IA analisa cada vídeo novo.',
      proximo: 'A ligação do assessor de carreira, pra ver o que você precisa pra ser encaminhado.',
      subir: 'Se vocês quiserem orientação toda semana e acesso a oportunidades',
      sai: ['o assessor de carreira todo dia (na Assessoria PRO, ele liga toda semana)', 'o encontro individual com o David Willer todo mês e o acompanhamento direto pelo WhatsApp', 'o plano de carreira personalizado', 'os 15 encaminhamentos por mês, com a apresentação do perfil a clubes da rede e à AGN (na Assessoria PRO, são pelo menos cinco)', 'o suporte nas seletivas: vídeos, avaliações e a logística', 'o grupo limitado a dez atletas'],
      diferenca: 'o assessor de carreira todo dia, com relatório e ligação toda semana, o encontro individual com o David Willer todo mês e o acompanhamento direto pelo WhatsApp, o plano de carreira personalizado, pelo menos 15 encaminhamentos por mês, com a apresentação do perfil a clubes da rede e à AGN, e o suporte nas seletivas, com a logística planejada com vocês',
      garantia: false },
    { ...legacy, ...nada,
      marca: [['Assessoria Elite', 'pre'], ['Legacy', 'ou']],
      descritor: 'Acompanhamento diário e planejamento individual',
      selo: 'Acompanhamento diário',
      promessa: 'O caminho inteiro, todo dia, com o David por perto.',
      fala: 'O Legacy é o acompanhamento diário e o planejamento individual, o ideal: tudo da Assessoria PRO, o assessor de carreira todo dia, com relatório e ligação toda semana, encontro individual com o David Willer todo mês e acompanhamento direto pelo WhatsApp, o plano de carreira com metas e próximos passos, pelo menos 15 encaminhamentos por mês, com o perfil apresentado a clubes da rede e à AGN, e o suporte nas seletivas, com a logística planejada com vocês. Grupo limitado a dez atletas.',
      mais: 'Tudo da Assessoria PRO, com acompanhamento ampliado:',
      inclui: [
        'Assessor de carreira: acompanhamento diário e ligação semanal.',
        'David Willer: encontro individual mensal e WhatsApp direto.',
        'Plano de carreira personalizado: metas e próximos passos.',
        'Mais oportunidades: pelo menos 15 encaminhamentos por mês.',
        'Suporte para seletivas: vídeos, avaliações e logística.'
      ],
      base: ['E tudo da Assessoria PRO e do Scout PRO.'],
      vantagens: [
        ['Assessor de carreira', 'acompanhamento diário, com relatório e ligação semanal.'],
        ['David Willer', 'encontro individual mensal e acompanhamento direto pelo WhatsApp.'],
        ['Plano de carreira personalizado', 'metas e próximos passos definidos para o atleta.'],
        ['Mais oportunidades', 'pelo menos 15 encaminhamentos por mês, com apresentação do perfil a clubes da rede e à AGN.'],
        ['Suporte para seletivas', 'organização de vídeos, avaliações e planejamento da logística com a família.'],
        ['', 'Grupo limitado a dez atletas.', 'turma']
      ],
      subir: 'Se vocês quiserem o acompanhamento diário',
      garantia: false }
  ];

  const R = window.ROTEIRO || [];
  const troca = (nome, novo) => { const i = R.findIndex(r => r && r.nome === nome); if (i >= 0) R[i] = Object.assign({}, R[i], novo); };

  troca('Interesse alinhado', {
    fala: [
      '"Vocês conhecem como o meio cobra. A gente ganha no contrato profissional do [atleta]: hoje, um atleta que a gente coloca num clube fecha ganhando de R$ 5 a 30 mil por mês. É nesse momento, e só nele, que a gente lucra."',
      'A ponte com o áudio do slide 14, só se a família ouviu: "Lembram da mãe que vocês ouviram? Ela contou que ofereceram 5 mil por mês pro filho dela. É ali que essa faixa começa."',
      '"Vocês mesmos disseram pro estrategista esportivo que não faz sentido a gente lucrar em cima de vocês. E não lucra. O interesse de vocês e o nosso é o mesmo: a assinatura."',
      'O espelho de volta: "Foi assim com o [caso]: hoje ele tá no [clube do caso]."',
      'Cenário (05), curto: "[pai], o que muda na vida de vocês quando ele assinar?" Silêncio.'
    ],
    atencao: 'CL0: a faixa da tela é fixa, R$ 5 a 30 mil por mês, e não segue o campo "Quanto um atleta nosso fecha" da ficha. A mãe do áudio diz "ofereceram 5 mil por mês" (conferido no áudio): cite só isso, sem nome, sem clube e sem outro valor; se o depoimento não tocou, não cite a mãe. Pra família que já viu promessa no meio, interesse alinhado convence mais que entusiasmo. O número é referência do que já acontece, nunca promessa: cada contrato depende do clube, da categoria e do desempenho. Não fale mal de empresário: compare modelos, não pessoas. A faixa é referência da casa, de atleta nosso que fechou, não entrega de nenhum plano. Com o Scout PRO na ficha, não diga que o plano leva a esse contrato: o encaminhamento pra clubes vem a partir da Assessoria PRO.'
  });

  troca('A vaga', {
    fala: [
      'Só com o Legacy na ficha (turma e vaga na tela). Escassez, só com o número real da semana (08): "Dessa turma de 10, restam [vagas]."',
      'Início imediato, no Legacy: "Confirmando hoje, o assessor de carreira entra em contato com vocês, e o Zyron começa a acompanhar o [atleta] imediatamente."',
      'O relógio, no Legacy, com a janela que eles mesmos deram (9.3): "Vocês falaram da janela dele. Hoje, a vaga. Em até três meses, mais de 93% dos nossos estão encaminhados. Se decidir hoje, esse relógio começa hoje. Se decidir daqui a uma semana, começa uma semana depois."',
      'Com a Assessoria PRO ou o Scout PRO na ficha, a tela vira "o começo": "Confirmando hoje, a equipe entra em contato e o Zyron começa a ler o jogo dele imediatamente. A cada vídeo novo, um relatório novo. O acompanhamento, vocês escolhem agora."',
      'Ponte pros planos, sem falar de dinheiro: "Agora, o que cada acompanhamento entrega."'
    ],
    atencao: 'CL0: "imediatamente" é o que a tela diz quando a ficha não traz o prazo do Zyron. Vagas só com o número real da semana; prazo do contato só com o prazo confirmado (campos da ficha). Turma, vagas, os 93% em até três meses e o dia da assinatura são do Legacy: com o PRO ou o Scout PRO na ficha, a tela não mostra nada disso, e a fala também não. O 23 mostra os planos primeiro e os preços depois, e o 24 fecha com o plano da ficha.'
  });

  troca('Os planos', {
    min: 4,
    fala: [
      'Ponte, sem falar de dinheiro, lendo o título: "Hoje quem opera a carreira dele são vocês, no tempo que sobra do trabalho. Vocês não estão mais sozinhos. O que muda de um plano pro outro é quanto dessa operação passa pra gente, e com que frequência."',
      'Primeiro avanço, o Scout PRO, sem preço: "Análise e formação pra evoluir no futebol: a análise dos vídeos com IA, com os pontos fortes e as prioridades, o diagnóstico inicial, os relatórios de performance e o histórico, o nosso scout acompanhando o desenvolvimento como analista de performance, os sete módulos de desenvolvimento e o guia dos critérios que os avaliadores observam nas peneiras."',
      'Segundo avanço, a Assessoria PRO: "Tudo do Scout PRO, mais orientação toda semana: o assessor de carreira liga toda semana pra orientar os próximos passos, os sete módulos aplicados à realidade do [atleta], pelo menos cinco encaminhamentos por mês pra clubes no Brasil e no exterior, e a comunidade com outros atletas e as aulas extras."',
      'Terceiro avanço, a Assessoria Elite Legacy, a coluna em destaque: "Tudo da Assessoria PRO, com o acompanhamento ampliado, o ideal: o assessor de carreira todo dia, com relatório e ligação toda semana, encontro individual com o David Willer todo mês e acompanhamento direto pelo WhatsApp, o plano de carreira com as metas e os próximos passos do [atleta], pelo menos 15 encaminhamentos por mês, com o perfil apresentado a clubes da rede e à AGN, e o suporte nas seletivas: vídeos, avaliações e a logística planejada com vocês. E o grupo é limitado a dez atletas."',
      'Calibração, ainda sem preço, no idioma deles: "Pelo que vocês conhecem do jogo dele, de que acompanhamento ele precisa agora: o relatório, o assessor ligando toda semana ou alguém em cima todo dia?" Espere. "E o David Willer de perto, com encontro individual todo mês: é o que vocês querem agora?" Espere. Deixe o [pai] responder.',
      'Só depois, no quarto avanço, os preços das três colunas juntos: "R$ 997, R$ 1.497 e R$ 2.997, todos vitalícios, em 10x sem juros: R$ 99,70, R$ 149,70 e R$ 299,70." Uma vez, sem enfeite.',
      'Quinto avanço, a recomendação e a chamada da tela ("Escolha o acompanhamento para o seu atleta"): "Pelo que você me falou, eu recomendo o [plano]." Se a resposta apontou outro, troque o plano no apresentador antes desse avanço.',
      'Ponte, sem enfeite: "Agora o investimento do [plano]."'
    ],
    perguntas: ['De que acompanhamento o jogo dele precisa agora: relatório, orientação toda semana ou acompanhamento diário?', 'O David Willer de perto, com encontro individual todo mês, é o que vocês querem agora?'],
    crm: ['O acompanhamento que a família escolheu, com as palavras do [pai], e o plano que você recomendou.'],
    atencao: 'CL0: os planos vêm primeiro, sem preço, e os preços das três colunas entram juntos no quarto avanço. O porquê, nas palavras do closer que pediu: quando a pessoa vê o preço, ela para de prestar atenção e começa a pensar no bolso. Isso inverte, só no CL0, a decisão do dono de 06/10/2026 (o investimento no topo de cada coluna); nas outras páginas o preço continua no topo. Não fale número antes do quarto avanço, nem se perguntarem: "já chego lá, primeiro quero que vocês vejam o que cada um entrega". Cada coluna é o que o plano acrescenta ao de baixo: aponte o que muda, não leia tudo. O Legacy vem em destaque, como o ideal. Encaminhamento é oportunidade real, não aprovação nem contratação: o rodapé diz isso e fica sempre na tela. O David Willer, os 15 encaminhamentos, a apresentação a clubes da rede e à AGN e o grupo de dez são do Legacy: não atribua à Assessoria PRO nem ao Scout PRO. O encaminhamento vem a partir da Assessoria PRO, com pelo menos cinco por mês. A garantia não entra aqui nem no 24: ela tem o slide dela, o 21, depois do investimento. Nunca "o mais barato", "o mais vendido" ou "o mais escolhido".'
  });

  troca('O investimento', {
    fala: [
      'O número, uma vez: "[pai], [mãe], o investimento no [plano] é de [preço], em 10x sem juros de [parcela]." E pare. Tecla S.',
      'O porquê do vitalício, de igual pra igual: "É vitalício porque a gente tem certeza do trabalho: vocês investem uma vez e não pagam de novo. Esse valor só custeia os profissionais parceiros que vão cuidar dele: paga o trabalho deles. O nosso lucro vem do contrato dele." E olhando pro atleta: "[atleta], a gente só ganha se você ganhar."',
      'No Legacy, de igual pra igual, apontando a tela: "Vocês sabem quanto um contrato paga. Um atleta nosso fecha ganhando de R$ 5 a 30 mil por mês: a parcela é uma fração de um mês de contrato, quando ele fechar."',
      'Na Assessoria PRO, a acessível, sem enfeite: "Orientação toda semana, com o assessor de carreira ligando, os sete módulos aplicados à realidade dele e pelo menos cinco encaminhamentos por mês. Cerca de metade do valor do Legacy."',
      'No Scout PRO, o começo: "É a análise dos vídeos com IA, a avaliação e a evolução com o nosso analista de performance e os sete módulos de formação."',
      'Por dia, do plano da tela, se o valor pesar: no Legacy, "No prazo médio de 3 meses, dá [por dia] por dia."; no PRO e no Scout PRO, "Dividido nos primeiros 3 meses, dá [por dia] por dia."',
      'Se perguntarem da devolução aqui: "Já chego nisso, é a próxima tela." A garantia tem o slide dela, o 21, logo depois deste.',
      'Fechamento (Modo A, 08): "Confirmando hoje, eu já aviso o [gerente]. Fica melhor no Pix ou no cartão?" No PRO e no Scout PRO: "eu já aviso a equipe".',
      'Depois do "Pix ou cartão?": mande no WhatsApp o link de pagamento do [plano], na própria call, e faça o pagamento com a família na linha. O link não está no deck: tenha o de cada plano à mão.',
      'Objeção: acolha, isole e volte: "Resolvido isso, eu confirmo agora. Pix ou cartão?"',
      'Trocar de plano, pelo escopo e nunca por desconto: "Existe um formato mais enxuto, a Assessoria PRO, e o que muda é isto." / "Se vocês quiserem o acompanhamento diário, o Legacy acrescenta isto." Use os botões de plano no apresentador: a tela do 24 troca junto, e o apresentador mostra o que sai ou o que entra. Descendo pro Scout PRO: "o encaminhamento pra clubes vem a partir da Assessoria PRO." Saindo do Legacy: "a apresentação do perfil a clubes da rede e à AGN e os 15 encaminhamentos por mês são do Legacy; na Assessoria PRO, são pelo menos cinco."',
      '"Vocês combinaram de decidir hoje, lembra? Pode ser não, tudo bem. O que tá faltando pro sim?"'
    ],
    atencao: 'CL0: esta tela não tem a linha da garantia; a garantia é o slide seguinte (21), e é lá que você fala dela. A lista da esquerda é a do closer, em uma linha por item. Aqui o número é o do plano da ficha (o 23 já mostrou os três), já com o parcelamento (10 x a parcela = o valor total): Scout PRO, R$ 997 vitalício, 10x de R$ 99,70; Assessoria PRO, R$ 1.497 vitalício, 10x de R$ 149,70; Legacy, R$ 2.997 vitalício, 10x de R$ 299,70. Fale o número uma vez e aperte S. Regra de ouro: depois do número, silêncio. Quem fala primeiro depois do preço perde. Os 3 meses do "por dia" são só a conta: no PRO e no Scout PRO, não ligue esses 3 meses ao encaminhamento: os 93% em até três meses são dado do Legacy. Travou no valor: isole ("tirando o valor, tem mais alguma coisa?"), diagnostique (retorno ou dinheiro agora) e volte no slide 17, 20 ou 23. Família do meio que pede pra "pensar com calma" quase sempre quer sentir controle: Modo B, se a análise da equipe for real. Link de pagamento: fora do deck, pelo WhatsApp, só depois do sim.'
  });

  troca('Bem-vindo', {
    fala: [
      'Áudio de boas-vindas, com a frase da tela: "Bem-vindo, [atleta]." No Legacy: "A partir de hoje, o teu contrato profissional é o nosso objetivo." Na Assessoria PRO: "A partir de hoje, você tem orientação do teu lado, toda semana." No Scout PRO: "A partir de hoje, o teu jogo é lido de 15 em 15 dias."',
      'Só no Legacy, a imaginação, devagar, apontando o post da tela: "[atleta], imagina comigo. Daqui a alguns meses o teu telefone toca. É o [gerente]: \'o clube quer você\'. Você assina. Quem é a primeira pessoa que você liga?" Espere a resposta.',
      'Só no Legacy, pros pais: "[pai], [mãe], nesse dia a gente ganha junto. Por isso, a partir de agora, quem opera a carreira dele é a gente."',
      'O começo: no Legacy, "O assessor de carreira entra em contato com vocês, e o Zyron começa a acompanhar o [atleta] imediatamente." No PRO e no Scout PRO, "A equipe entra em contato com vocês, e a IA já começa a analisar cada vídeo novo dele." E o próximo passo da tela: no PRO, a ligação do assessor de carreira; no Scout PRO, o próximo vídeo.',
      'Indicação, na hora, no idioma deles: "Vocês conhecem o meio: tem algum colega de time dele que joga nesse nível? A gente faz a avaliação dele também."'
    ],
    crm: ['Venda concluída no CRM e cadastro em Vendas (produto e ticket do plano fechado; a venda entra pendente até a aprovação do Executive).', 'A indicação.', 'O dia do primeiro contato (no Legacy, do assessor de carreira).']
  });

  window.CHECKLIST = (window.CHECKLIST || []).concat([
    'CL0: conferi que a garantia só aparece no slide 31, depois dos preços (o 29 e o 30 não falam dela)',
    'CL0: no 29, os preços só entram no quarto avanço, depois das três colunas; não falo número antes'
  ]);
})();
