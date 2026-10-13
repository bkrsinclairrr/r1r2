/* Regras do R2 novo que o Painel do Closer usa nas telas (navegador) e nas rotas (servidor, por import).
   São cópias de partes do assets/roteiro.js do R2 novo: CAMPO_POSICOES (o campo do slide 11), PRAZOS (as listas fixas
   de prazo, "promessa travada": o closer escolhe, não digita) e os nomes dos planos. testes/teste-igualdade.mjs confere
   que as cópias batem com o deck: mudou lá, muda aqui.
   Sem import e sem export: no navegador entra como script comum; no servidor, por import, e fica em globalThis.R2_REGRAS. */
(function (raiz) {
  'use strict';
  const PLANOS = ['Scout PRO', 'Assessoria PRO', 'Assessoria de Elite Legacy'];
  // A oferta alternativa preserva os nomes dos produtos, com dois escopos próprios.
  // Variações criadas sobre essa página herdam o mesmo caminho e os mesmos dois planos.
  const planosDaVersao = v => v && v.deck === 'r2-anterior' && v.caminho === '/variacoes/acompanhamento/'
    ? PLANOS.filter(p => p !== 'Assessoria PRO') : PLANOS;
  const temDossie = v => !!(v && v.deck === 'r2-anterior' && v.caminho === '/variacoes/acompanhamento/');
  const recursosDaPagina = (deck, pagina) => temDossie({ deck: deck.id, caminho: pagina.caminho })
    ? { ...deck.recursos, foto: true, leitura: false, dossie: true } : deck.recursos;
  const INDICADORES = [['Ataque', 'Ataque'], ['Defesa', 'Defesa'], ['Chute', 'Chute'], ['Domínio', 'Dominio'],
    ['Marcação', 'Marcacao'], ['Finalização', 'Finalizacao'], ['Drible', 'Drible'], ['Passe', 'Passe'],
    ['Velocidade', 'Velocidade'], ['Leitura de jogo', 'Leitura']];
  // Relatório pronto, transcrito do Zyron. Nota e compatibilidade ausentes nunca viram um número calculado.
  const CAMPOS_DOSSIE = [
    { chave: 'zyronCategoria', nome: 'Categoria', max: 40 },
    { chave: 'zyronResumo', nome: 'Leitura do perfil e pontos fortes', max: 220, area: true },
    { chave: 'zyronFoco', nome: 'Prioridade de desenvolvimento', max: 160, area: true },
    { chave: 'zyronGeral', nome: 'Nota geral do relatório', numero: [0, 100] },
    ...INDICADORES.map(([nome, id]) => ({ chave: 'zyron' + id, nome, numero: [0, 100], indicador: true })),
    ...[1, 2, 3].flatMap(n => [
      ['Clube', 'Clube', 70], ['Pais', 'País', 40], ['Liga', 'Liga / competição', 60],
      ['Posicao', 'Posição compatível', 40], ['Categoria', 'Categoria compatível', 40],
      ['Motivo', 'Por que o perfil encaixa', 160]
    ].map(([id, nome, max]) => ({ chave: 'match' + n + id, nome, max, clube: n, area: id === 'Motivo' }))
      .concat({ chave: 'match' + n + 'Compatibilidade', nome: 'Compatibilidade no relatório (%)', numero: [0, 100], clube: n }))
  ];
  const LEGACY = 'Assessoria de Elite Legacy';
  // nome de antes de um plano que mudou de nome (o Scouting PRO virou Assessoria PRO em 07/10/2026)
  const PLANOS_ANTIGOS = { 'Scouting': 'Scout PRO', 'Scouting PRO': 'Assessoria PRO' };
  const PRAZOS = {
    contato: ['ainda hoje', 'em até 24 horas', 'em até 48 horas'],
    zyron: ['no dia seguinte', 'em até 48 horas']
  };
  const PES = ['Destro', 'Canhoto', 'Ambidestro'];
  const ORIGENS = ['Zyron', 'Formulário do Instagram', 'Frio, sem vídeo', 'Outro'];
  // as posições que o painel sugere (as mesmas que o deck reconhece)
  const SUGESTOES = ['goleiro', 'lateral direito', 'lateral esquerdo', 'zagueiro', 'volante', 'meia', 'ponta direita', 'ponta esquerda', 'atacante'];

  /* As variações do R2: o cadastro das páginas do deck. O closer escolhe a variação de cada lead no painel; o link do lead é
     sempre o mesmo (/?a=<código>) e o deck abre a página da variação escolhida. Página nova = uma linha aqui, a página dela no
     deck (variacoes/<slug>/index.html) e, se tiver slide opcional, data-opcional="<id>" no <section> do slide. Cada entrada
     já nasce com as escolhas de nome, sobrenome e foto do lead pro closer (lead, abaixo, vale true nos dois se faltar).
     Além dessas, o admin cria variações no painel (versoes.json): cada uma usa a página de uma daqui (a base) e tem nome,
     classificação, descrição e escolhas de lead próprios, com um slug gerado pelo painel.
       id: o que fica gravado no R2 (não mude depois de usado).
       caminho: a página da versão no deck. O slug é neutro de propósito: a família pode ver o endereço na tela compartilhada.
       opcionais: slides que o closer pode tirar da sequência. Entram por padrão; o deck pula os desmarcados sem renumerar.
       lead: o que a versão mostra do lead na tela. nome: o nome e o sobrenome dele (as escolhas de "Nome na tela" valem só
         se for true); foto: a foto dele (só vale com o nome). Versão geral, sem personalização: { nome: false, foto: false }.
       validacao: a classificação de partida (VALIDACOES). O admin muda no painel, sem publicar nada: o que ele escolhe
         fica em versoes.json e vale sobre o que está aqui, igual ao lead e à nota.
     testes/teste-versoes.mjs confere este cadastro contra as páginas do deck. */
  /* As etapas e os decks. O painel guarda duas etapas de apresentação: o R1 (o SDR) e o R2 (o closer). Cada etapa tem um ou mais
     decks (cada um é um projeto na Vercel com o seu variacoes.json); o catálogo é este. Cada página de um deck é uma variação:
     o id dela no painel é o prefixo do deck mais o id da página (o deck 'r2', o R2 novo, não tem prefixo: os ids de sempre,
     principal e tecnica, ficam como estão). O link do lead é um só por etapa e sai do deck de entrada (entrada: true); se a
     variação escolhida é de outro deck, o deck de entrada leva o lead pra lá (só pras origens deste catálogo).
       etapa: r1 ou r2. quem: quem monta essa etapa. padrao: o id (de página) da variação que vale quando nenhuma foi escolhida.
       origem: o endereço do deck no ar. O servidor pode trocar (DECK_URL pro R2 novo; fora do ar de produção, DECKS_ORIGENS).
       recursos: o que o deck sabe fazer com a escolha do painel. nomeTela: o deck segue a escolha "Nome na tela" (e aceita variação que
         não mostra o nome do lead); foto: mostra a foto do lead (o servidor só manda a foto quando a tela dela mostra: vale até no deck que não conhece o semFoto); pular: tira da sequência os slides opcionais; leitura: o vídeo e a
         leitura do atleta; previa: o deck sabe abrir dentro do quadro de prévia do painel (sem HUD, sem apresentador); sem ela, o painel
         abre o deck em outra aba; apelido: o deck usa o campo "Como a gente chama ele" (falta = usa; false = ignora, e o painel não oferece);
         nomeFixo: o nome que o deck que não segue "Nome na tela" mostra sempre (so-nome ou primeiro-sobrenome; falta = nome e último
         sobrenome). O painel só oferece o que o deck faz (o resto ficaria uma promessa que o deck não cumpre). */
  const ETAPAS = [
    { id: 'r1', nome: 'R1', quem: 'SDR', papel: 'sdr' },
    { id: 'r2', nome: 'R2', quem: 'Closer', papel: 'closer' }
  ];
  const DECKS = [
    { id: 'r2', etapa: 'r2', nome: 'R2 novo', prefixo: '', entrada: true, origem: 'https://jogador-de-elite-r2-novo.vercel.app',
      recursos: { nomeTela: true, foto: true, pular: true, leitura: true, previa: true } },
    { id: 'r2-anterior', etapa: 'r2', nome: 'R2 anterior', prefixo: 'r2a-', entrada: false, origem: 'https://jogador-de-elite-r2.vercel.app',
      leadTxt: 'aparece o primeiro nome do lead; foto no slide de escolha; nome nos demais slides, sem escolha do formato do nome',
      recursos: { nomeTela: false, nomeFixo: 'so-nome', apelido: false, foto: true, pular: false, leitura: true, previa: false } },
    { id: 'r2-b', etapa: 'r2', nome: 'R2 B', prefixo: 'r2b-', entrada: false, origem: 'https://jogador-de-elite-r2-b.vercel.app',
      leadTxt: 'aparecem o nome e o primeiro sobrenome do lead, com a foto dele; este deck não deixa escolher o nome na tela',
      recursos: { nomeTela: false, nomeFixo: 'primeiro-sobrenome', foto: true, pular: false, leitura: true, previa: true } },
    { id: 'r1', etapa: 'r1', nome: 'R1', prefixo: 'r1-', entrada: true, origem: 'https://jogador-de-elite-r1.vercel.app',
      leadTxt: 'aparecem o primeiro nome do lead e a ficha dele (posição, idade e cidade); foto no slide de escolha',
      recursos: { nomeTela: false, nomeFixo: 'so-nome', apelido: false, foto: true, pular: false, leitura: false, previa: false } }
  ];
  const deckPor = id => DECKS.find(d => d.id === id) || null;
  const entradaDe = etapa => DECKS.find(d => d.etapa === etapa && d.entrada) || null;
  const VERSAO_PADRAO = 'principal';
  // o id da variação que vale por padrão em cada etapa (não fica gravado no lead)
  const padraoDe = etapa => (etapa === 'r1' ? 'r1-principal' : VERSAO_PADRAO);
  const VERSOES = [
    {
      id: 'principal', nome: 'R2 · Apresentação completa com foto', caminho: '/',
      resumo: 'O deck completo: explica o caminho do começo, com o olhômetro, o Zyron e a AGN.',
      quando: 'Na dúvida, esta.',
      validacao: 'em-validacao', lead: { nome: true, foto: true },
      opcionais: [{ id: 'leva', rotulo: 'O que o {nome} leva', slide: 19, ajuda: 'Resume o que ele recebe, com o nome e a foto dele. Sem ele, a apresentação vai do 18 direto pro 20.' }]
    },
    {
      id: 'tecnica', nome: 'R2 · Técnica para quem conhece futebol', caminho: '/variacoes/tecnica/',
      resumo: 'Fala de par pra par: não explica o básico, a AGN aparece uma vez só e o foco é a operação e o interesse alinhado.',
      quando: 'Citou a AGN pelo nome, tem vivência no meio (base de clube, federado, ex-jogador, técnico, contato com empresário) ou fez pergunta técnica na R1.',
      validacao: 'em-validacao', lead: { nome: true, foto: true },
      opcionais: [{ id: 'leva', rotulo: 'O que o {nome} leva', slide: 19, ajuda: 'Resume o que ele recebe, com o nome e a foto dele. Sem ele, a apresentação vai do 18 direto pro 20.' }]
    }
  ];
  /* A reserva de cada deck: as páginas que valem se o painel nunca conseguiu ler o variacoes.json dele. Os ids são os da página no
     deck (sem o prefixo); o painel põe o prefixo, a etapa e o deck. Os textos são os mesmos do bloco r2-variacao de cada página. */
  const RESERVA = {
    r2: VERSOES.map(v => Object.assign({}, v)),
    'r2-anterior': [
      {
        id: 'principal', nome: 'R2 · Roteiro clássico completo', caminho: '/',
        resumo: 'O R2 de 25 slides, o de antes do R2 novo, com O combinado e O investimento. A foto aparece no slide de escolha.',
        quando: 'Só se precisar da versão de 25 slides. Na dúvida, use o R2 novo.',
        validacao: 'em-validacao', lead: { nome: true, foto: true }, opcionais: []
      },
      {
        id: 'tecnica', nome: 'R2 · Técnica com roteiro clássico', caminho: '/variacoes/tecnica/',
        resumo: 'A versão técnica do R2 de 25 slides: fala de par pra par, sem explicar o básico. A foto aparece no slide de escolha.',
        quando: 'Lead com vivência no meio (base de clube, federado, ex-jogador, técnico) e só se precisar da versão de 25 slides.',
        validacao: 'em-validacao', lead: { nome: true, foto: true }, opcionais: []
      }
    ],
    'r2-b': [
      {
        id: 'principal', nome: 'R2 · Nome e primeiro sobrenome', caminho: '/',
        resumo: 'O R2 novo com a tela dizendo o nome e o primeiro sobrenome do lead (Lucas Almeida da Silva vira Lucas Almeida).',
        quando: 'Só se precisar desse endereço. No R2 novo, a escolha Nome na tela (primeiro sobrenome) faz o mesmo.',
        validacao: 'em-validacao', lead: { nome: true, foto: true }, opcionais: []
      },
      {
        id: 'tecnica', nome: 'R2 · Técnica com primeiro sobrenome', caminho: '/variacoes/tecnica/',
        resumo: 'A técnica do R2 novo com a tela dizendo o nome e o primeiro sobrenome do lead.',
        quando: 'Mesmo critério da Técnica do R2 novo, só se precisar desse endereço.',
        validacao: 'em-validacao', lead: { nome: true, foto: true }, opcionais: []
      }
    ],
    r1: [
      {
        id: 'principal', nome: 'R1 · Avaliação e convite para R2', caminho: '/',
        resumo: 'A apresentação do SDR em 16 slides: o Zyron, a IA na prática e a AGN, e fecha marcando a R2.',
        quando: 'A primeira apresentação do lead. Na dúvida, esta.',
        validacao: 'em-validacao', lead: { nome: true, foto: true }, opcionais: []
      }
    ]
  };
  /* A classificação de cada versão, do mais validado ao menos: quem decide é o admin (no painel, ao lado da versão). O closer vê
     e escolhe com ela na frente. */
  const VALIDACOES = [
    { id: 'validada', nome: 'Validada' },
    { id: 'em-validacao', nome: 'Em validação' },
    { id: 'nao-validada', nome: 'Não validada' }
  ];
  const VALIDACAO_PADRAO = 'nao-validada';
  // o slug de uma variação (o id que fica gravado no R2): letras minúsculas e números separados por hífen
  const SLUG_OK = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  // a página de um deck como variação do painel: o id é o prefixo do deck mais o id da página; leva a etapa e o deck
  const comoVariacao = (deck, pagina) => Object.assign({}, pagina, { id: deck.prefixo + pagina.id, idLocal: pagina.id, etapa: deck.etapa, deck: deck.id, recursos: recursosDaPagina(deck, pagina) });
  VERSOES.forEach(v => { v.etapa = 'r2'; v.deck = 'r2'; v.idLocal = v.id; v.recursos = deckPor('r2').recursos; });
  // a reserva de todos os decks, já como variações do painel
  const RESERVA_TODAS = [].concat(...DECKS.map(d => (RESERVA[d.id] || []).map(pg => comoVariacao(d, pg))));
  // lista: as variações como valem agora (o que os decks publicam mais o que o admin ajustou). Sem lista, a reserva do código.
  // etapa: só as da etapa (r1 ou r2); o id que não existe nela cai na padrão dela. Item sem etapa (lista antiga) conta como R2.
  const versaoPor = (id, lista, etapa) => {
    const todas = Array.isArray(lista) && lista.length ? lista : RESERVA_TODAS;
    const l = todas.filter(v => !etapa || (v.etapa || 'r2') === etapa);
    return l.find(v => v.id === id) || l.find(v => v.id === padraoDe(etapa || 'r2')) || l[0] || VERSOES[0];
  };
  // do mais validado ao menos; dentro de cada nível, a ordem do cadastro
  const ordemValidacao = id => { const i = VALIDACOES.findIndex(n => n.id === id); return i < 0 ? VALIDACOES.length : i; };
  const ordenaVersoes = lista => lista.map((v, i) => [v, i]).sort((a, b) => ordemValidacao(a[0].validacao) - ordemValidacao(b[0].validacao) || a[1] - b[1]).map(x => x[0]);
  // como a tela chama o atleta, por R2: '' é o padrão (nome e último sobrenome); sem é a apresentação sem nome e sem foto
  const NOMES_TELA = [
    { id: '', nome: 'Nome e sobrenome' },
    { id: 'primeiro-sobrenome', nome: 'Nome e primeiro sobrenome' },
    { id: 'so-nome', nome: 'Só o primeiro nome' },
    { id: 'sem', nome: 'Sem nome nem foto' }
  ];

  /* O campo do slide 11 (e a miniatura do Bem-vindo): cópia de window.CAMPO_POSICOES do roteiro.js do R2 novo.
     A posição (texto livre) é comparada em caixa baixa, sem acento e com hífen virando espaço; vale a primeira linha
     que casar. [termos, marcador]: o termo como palavra inteira. [termos, marcador, true]: só o texto inteiro (siglas).
     ZAG e VOL: com "esquerdo" ou "esquerda" no texto, o da esquerda; sem lado, o da direita. Não casou: vazio. */
  const CAMPO_POSICOES = [
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
  const str = v => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v));
  // o mesmo semAcento e o mesmo posicaoNoCampo do assets/deck.js
  const semAcento = s => str(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[-_/.,;:()]+/g, ' ').replace(/\s+/g, ' ').trim();
  function posicaoNoCampo(txt) {
    const t = semAcento(txt);
    if (!t) return '';
    const tem = termo => (' ' + t + ' ').indexOf(' ' + termo + ' ') >= 0;
    const regra = CAMPO_POSICOES.find(([termos, , exato]) => termos.some(x => (exato ? t === x : tem(x))));
    if (!regra) return '';
    const id = regra[1];
    if (id === 'ZAG' || id === 'VOL') return id + (tem('esquerdo') || tem('esquerda') ? '-e' : '-d');
    return id;
  }

  // o dia e a hora da call como o deck mostra: "quinta, 15/10" e "19h30" (a data vem como AAAA-MM-DD; o dia da semana sai
  // do meio-dia UTC, que é o mesmo dia em São Paulo)
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const DATA_OK = /^(\d{4})-(\d{2})-(\d{2})$/, HORA_OK = /^([01]\d|2[0-3]):([0-5]\d)$/;
  function diaDaCall(iso) {
    const m = DATA_OK.exec(str(iso));
    if (!m) return '';
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12));
    if (d.getUTCMonth() !== +m[2] - 1) return '';
    return DIAS[d.getUTCDay()] + ', ' + m[3] + '/' + m[2];
  }
  function horaDaCall(hm) {
    const m = HORA_OK.exec(str(hm));
    return m ? Number(m[1]) + 'h' + (m[2] === '00' ? '' : m[2]) : '';
  }
  // hoje em São Paulo, AAAA-MM-DD
  function hojeSP(agora) {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(agora || new Date());
    return p.slice(0, 10);
  }
  // DD/MM de uma data ISO, no fuso de São Paulo
  function dataCurta(iso) {
    const t = Date.parse(str(iso));
    if (!Number.isFinite(t)) return '';
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit' }).format(new Date(t));
  }
  /* Os nomes do atleta, a partir do nome completo. primeiro: como se fala (o primeiro nome; os dois primeiros, se for
     composto e comum, como João Pedro). tela: nome e sobrenome, o que aparece nos títulos, nas frases e no carimbo do
     dossiê. Por padrão é o último sobrenome (com Júnior, Filho ou Neto junto); com regra 'primeiro' (a escolha "Nome e
     primeiro sobrenome" do R2), o primeiro sobrenome (a primeira palavra depois do nome que não é "da", "de" ou "do", com o
     Júnior ou Filho que vier logo depois). Nas duas, se o nome tiver até três palavras e nenhuma for "da", "de" ou "do",
     ele todo. Até 24 letras; passou, perde o Júnior, depois o composto e por fim o que sobrar.
     O mesmo código está no deck.js e no regras.js do painel: o testes/teste-igualdade.mjs confere os dois. */
  const NOME_PARTICULAS = ['da', 'de', 'do', 'das', 'dos', 'e'];
  const NOME_SUFIXOS = ['junior', 'jr', 'filho', 'neto', 'sobrinho', 'segundo', 'terceiro'];
  const NOME_SEGUNDOS = ['pedro', 'henrique', 'vitor', 'victor', 'gabriel', 'felipe', 'eduardo', 'gustavo', 'miguel', 'guilherme', 'augusto', 'antonio', 'carlos', 'paulo',
    'luiz', 'luis', 'fernando', 'rafael', 'matheus', 'mateus', 'lucas', 'davi', 'daniel', 'emanuel', 'francisco', 'jose', 'marcos', 'rodrigo', 'thiago', 'tiago', 'vinicius',
    'arthur', 'artur', 'bernardo', 'enzo', 'heitor', 'joao', 'leonardo', 'murilo', 'nicolas', 'otavio', 'samuel', 'ricardo', 'roberto', 'andre', 'bruno', 'caio', 'diego',
    'igor', 'kaua', 'leandro', 'renan', 'wesley', 'yago', 'yuri', 'lucca', 'maria', 'ana', 'clara', 'beatriz', 'eduarda', 'julia', 'luiza', 'vitoria', 'fernanda', 'helena', 'laura'];
  function nomesDoAtleta(completo, regra) {
    const t = str(completo).replace(/\s+/g, ' ').split(' ').filter(Boolean);
    if (!t.length) return { primeiro: '', tela: '' };
    const composto = t.length > 2 && NOME_SEGUNDOS.indexOf(semAcento(t[1])) >= 0 ? 2 : 1;
    const primeiro = t.slice(0, composto).join(' ');
    if (t.length === 1) return { primeiro: primeiro, tela: primeiro };
    const resto = t.slice(composto);
    let sobrenome, sufixo = '';
    if (regra === 'primeiro') {
      const i = resto.findIndex(x => NOME_PARTICULAS.indexOf(semAcento(x)) < 0); // a primeira palavra que não é "da", "de", "do"...
      sobrenome = resto[i < 0 ? 0 : i];
      const seguinte = i >= 0 ? resto[i + 1] : '';
      sufixo = seguinte && NOME_SUFIXOS.indexOf(semAcento(seguinte)) >= 0 ? seguinte : '';
    } else {
      const ultimo = resto[resto.length - 1];
      const comSufixo = resto.length > 1 && NOME_SUFIXOS.indexOf(semAcento(ultimo)) >= 0;
      sobrenome = comSufixo ? resto[resto.length - 2] : ultimo;
      sufixo = comSufixo ? ultimo : '';
    }
    const todos = t.length <= 3 && !t.some(x => NOME_PARTICULAS.indexOf(semAcento(x)) >= 0) ? t.join(' ') : '';
    const lista = [todos, primeiro + ' ' + sobrenome + (sufixo ? ' ' + sufixo : ''), primeiro + ' ' + sobrenome, t[0] + ' ' + sobrenome].filter(Boolean);
    return { primeiro: primeiro, tela: lista.find(x => x.length <= 24) || t[0] };
  }
  // o nome do dossiê: o nome e sobrenome da tela, em caixa alta
  const nomeDossie = (nome, modo) => nomesDoAtleta(nome, modo === 'primeiro-sobrenome' ? 'primeiro' : '').tela.toUpperCase();
  /* como a tela chama o atleta, no R2 com a escolha de nome (nomeTela): '' o apelido, ou nome e sobrenome do nome completo;
     'primeiro-sobrenome' o apelido, ou nome e primeiro sobrenome; 'so-nome' o apelido, ou só o primeiro nome; 'sem' nada
     (a tela fica sem nome e sem foto) */
  function comoChama(nome, apelido, modo) {
    if (modo === 'sem') return '';
    if (str(apelido)) return str(apelido);
    const n = nomesDoAtleta(nome, modo === 'primeiro-sobrenome' ? 'primeiro' : '');
    return modo === 'so-nome' ? n.primeiro : n.tela;
  }
  // como a fala chama o atleta: o apelido, ou o primeiro nome
  const comoFala = (nome, apelido) => str(apelido) || nomesDoAtleta(nome).primeiro;

  raiz.R2_REGRAS = { PLANOS, planosDaVersao, temDossie, recursosDaPagina, CAMPOS_DOSSIE, INDICADORES, LEGACY, PLANOS_ANTIGOS, PRAZOS, PES, ORIGENS, SUGESTOES, CAMPO_POSICOES, DATA_OK, HORA_OK,
    VERSOES, VERSAO_PADRAO, VALIDACOES, VALIDACAO_PADRAO, SLUG_OK, NOMES_TELA, versaoPor, ordenaVersoes,
    ETAPAS, DECKS, RESERVA, RESERVA_TODAS, deckPor, entradaDe, padraoDe, comoVariacao,
    semAcento, posicaoNoCampo, diaDaCall, horaDaCall, hojeSP, dataCurta, nomeDossie, comoChama, comoFala, nomesDoAtleta };
})(typeof window !== 'undefined' ? window : globalThis);
