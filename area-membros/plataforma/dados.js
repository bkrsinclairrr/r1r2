/* Área de membros: os dados do atleta de demonstração (Fernando Silva).
   Tudo aqui é ilustrativo e gerado por regra fixa (semente), pra a imagem sair sempre igual: os lances de cada vídeo,
   as taxas por mês e por tipo, os clubes (anônimos), a agenda e as conversas. As datas saem do dia da geração
   (?hoje=AAAA-MM-DD fixa outro dia). Nada aqui chama a rede: é uma maquete navegável, não um sistema. */
(function (W) {
  'use strict';

  /* ---------- o dia ---------- */
  const qh = new URLSearchParams(location.search).get('hoje');
  const HOJE = qh && /^\d{4}-\d{2}-\d{2}$/.test(qh) ? new Date(qh + 'T12:00:00') : new Date();
  HOJE.setHours(12, 0, 0, 0);
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const MES3 = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const DIA3 = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const dia = (m, d) => { const x = new Date(HOJE.getFullYear(), HOJE.getMonth() + m, d, 12); return x; };
  const somaDias = (n, base) => { const x = new Date(base || HOJE); x.setDate(x.getDate() + n); return x; };
  const util = n => { const d = somaDias(n); while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1); return d; };
  const dd = d => String(d.getDate()).padStart(2, '0');
  const mm = d => String(d.getMonth() + 1).padStart(2, '0');
  const ddmm = d => dd(d) + '/' + mm(d);
  const mes3 = d => MES3[d.getMonth()];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const diasEntre = (a, b) => Math.round((b - a) / 864e5);
  const mmss = t => { const s = Math.max(0, Math.floor(t)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const mesmoMes = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  const relativo = d => { const n = diasEntre(d, HOJE); return n <= 0 ? 'hoje' : n === 1 ? 'ontem' : 'há ' + n + ' dias'; };

  /* ---------- sorteio com semente ---------- */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function gauss(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function escolhe(r, pares) { const tot = pares.reduce((a, p) => a + p[1], 0); let x = r() * tot; for (const p of pares) { if ((x -= p[1]) <= 0) return p[0]; } return pares[pares.length - 1][0]; }

  /* ---------- o atleta ---------- */
  const ATLETA = {
    nome: 'Fernando Silva', primeiro: 'Fernando', ini: 'FS', posicao: 'Meia central', posId: 'MC', categoria: 'Sub-17', idade: 16,
    cidade: 'Uberlândia', uf: 'MG', pe: 'Destro', altura: '1,76 m', plano: 'Assessoria de Elite Legacy', planoCurto: 'Legacy',
    dossie: 'K4T9Q2MX', entrada: dia(-4, 16)
  };

  /* ---------- vídeos e lances ---------- */
  // [mês relativo, dia, lances, título, duração em segundos]: 14 vídeos lidos, 486 lances (cada vídeo até 5 minutos)
  const PLANO_VIDEOS = [
    [-4, 18, 34, 'Treino coletivo', 212], [-4, 27, 35, 'Jogo-treino', 268],
    [-3, 9, 35, 'Jogo Sub-17', 285], [-3, 23, 35, 'Treino coletivo', 198],
    [-2, 6, 35, 'Jogo Sub-17', 276], [-2, 17, 35, 'Jogo-treino', 231], [-2, 28, 34, 'Campeonato · rodada 6', 255],
    [-1, 4, 36, 'Treino coletivo', 290], [-1, 12, 36, 'Jogo Sub-17', 222], [-1, 21, 36, 'Jogo-treino', 247], [-1, 28, 35, 'Campeonato · rodada 9', 280],
    [0, -7, 33, 'Treino coletivo', 263], [0, -4, 34, 'Jogo Sub-17', 238], [0, -1, 33, 'Jogo-treino', 274]
  ];
  // decisões boas por mês: 58 · 63 · 66 · 71 · 74 (contas exatas: 40/69, 44/70, 69/104, 101/143, 74/100)
  const BONS_MES = { '-4': 40, '-3': 44, '-2': 69, '-1': 101, '0': 74 };
  const TIPOS = ['Passe', 'Condução', 'Drible', 'Finalização', 'Desarme', 'Posicionamento', 'Jogo sem a bola', 'Bola parada'];
  // peso de cada tipo na hora de sortear quais lances são "bons" (o que sobra vira "a melhorar")
  const PESO_BOM = { 'Passe': 1.7, 'Jogo sem a bola': 1.45, 'Condução': 1.25, 'Posicionamento': 1.15, 'Desarme': .95, 'Bola parada': .9, 'Drible': .8, 'Finalização': .62 };
  // de onde saem os lances: no começo mais fundo no campo, hoje mais perto da área (campo de 105 x 68 m, ataque pra direita)
  const GRUPOS_ANTES = [{ x: 50, y: 24, sx: 7, sy: 6, w: .26 }, { x: 44, y: 35, sx: 8, sy: 6, w: .22 }, { x: 74, y: 27, sx: 6, sy: 6, w: .12 }, { x: 33, y: 31, sx: 7, sy: 8, w: .16 }, { x: 60, y: 47, sx: 7, sy: 5, w: .09 }, { x: 25, y: 23, sx: 6, sy: 6, w: .1 }, { x: 88, y: 32, sx: 4, sy: 5, w: .04 }, { x: 40, y: 52, sx: 7, sy: 5, w: .05 }];
  const GRUPOS_AGORA = [{ x: 66, y: 21, sx: 7, sy: 5, w: .25 }, { x: 55, y: 33, sx: 8, sy: 6, w: .17 }, { x: 84, y: 26, sx: 5, sy: 6, w: .13 }, { x: 42, y: 30, sx: 7, sy: 8, w: .11 }, { x: 72, y: 47, sx: 7, sy: 5, w: .09 }, { x: 94, y: 33, sx: 3, sy: 4, w: .06 }, { x: 28, y: 24, sx: 7, sy: 6, w: .11 }, { x: 57, y: 12, sx: 7, sy: 3, w: .05 }, { x: 48, y: 52, sx: 7, sy: 5, w: .05 }];
  const NOTAS = {
    'Passe': { bom: ['Quebrou a linha com passe vertical', 'Passe entre linhas sob pressão', 'Inversão rápida pro lado livre', 'Tabela curta pra ganhar a frente'], ajustar: ['Passe sem olhar o lado cego', 'Bola forte demais pro companheiro', 'Segurou a bola um toque além'] },
    'Condução': { bom: ['Conduziu pra fora da pressão', 'Levou a bola até o terço final'], ajustar: ['Cabeça baixa na condução', 'Condução pro lado da marcação'] },
    'Drible': { bom: ['Drible curto no espaço apertado', 'Mudança de direção sem perder a bola'], ajustar: ['Tentou o drible com o time livre', 'Drible no meio, perto da própria área'] },
    'Finalização': { bom: ['Chute colocado de dentro da área'], ajustar: ['Finalização de média distância sem ângulo', 'Chute com o pé fraco, sem equilíbrio', 'Bola alta por falta de ajuste do corpo'] },
    'Desarme': { bom: ['Desarme no tempo certo', 'Antecipação na linha de passe'], ajustar: ['Entrada atrasada no duelo', 'Foi ao chão cedo demais'] },
    'Posicionamento': { bom: ['Ocupou o espaço entre volante e zagueiro', 'Se ofereceu no lado oposto da bola'], ajustar: ['Ficou na sombra do marcador', 'Distância grande pro volante'] },
    'Jogo sem a bola': { bom: ['Ataque ao espaço no tempo certo', 'Desmarque de ruptura nas costas do volante'], ajustar: ['Atacou o espaço cedo demais'] },
    'Bola parada': { bom: ['Cobrança na segunda trave'], ajustar: ['Cobrança curta demais pra primeira trave'] }
  };

  function geraVideosELances() {
    const r = rng(2026);
    const videos = [], lances = [];
    PLANO_VIDEOS.forEach((pv, vi) => {
      const [m, d, n, titulo, dur] = pv;
      const data = d <= 0 ? somaDias(d) : dia(m, d);
      const v = { i: vi, data, titulo, dur, n, mes: m };
      videos.push(v);
      const p = vi / (PLANO_VIDEOS.length - 1);
      const ts = [];
      for (let j = 0; j < n; j++) ts.push(14 + r() * (dur - 24));
      ts.sort((a, b) => a - b);
      ts.forEach((t, j) => {
        const g = r() < (1 - p) ? GRUPOS_ANTES : GRUPOS_AGORA;
        let x, y;
        for (;;) {
          const gr = escolhe(r, g.map(k => [k, k.w]));
          x = gr.x + gauss(r) * gr.sx; y = gr.y + gauss(r) * gr.sy;
          if (x > 1.5 && x < 103.5 && y > 1.5 && y < 66.5) break;
        }
        const tipo = x < 35
          ? escolhe(r, [['Desarme', .35], ['Passe', .35], ['Condução', .1], ['Posicionamento', .12], ['Bola parada', .08]])
          : x < 70
            ? escolhe(r, [['Passe', .42], ['Condução', .17], ['Desarme', .12], ['Posicionamento', .1], ['Jogo sem a bola', .12], ['Drible', .04], ['Bola parada', .03]])
            : escolhe(r, [['Passe', .28], ['Drible', .2], ['Finalização', .17], ['Jogo sem a bola', .25], ['Condução', .06], ['Bola parada', .04]]);
        lances.push({ id: lances.length, v: vi, t: Math.round(t), tipo, x: +x.toFixed(1), y: +y.toFixed(1), leitura: 'ajustar', nota: '', mes: m, data });
      });
    });
    const rBons = rng(77);
    // em cada mês, os "bons" são divididos entre os vídeos (quase por igual) e sorteados com peso por tipo: a conta do mês fecha exata
    [-4, -3, -2, -1, 0].forEach(m => {
      const vs = videos.filter(v => v.mes === m), N = vs.reduce((acc, v) => acc + v.n, 0);
      let resta = BONS_MES[String(m)];
      vs.forEach((v, k) => {
        const b = k === vs.length - 1 ? resta : Math.round(BONS_MES[String(m)] * v.n / N);
        resta -= b;
        lances.filter(l => l.v === v.i).map(l => ({ l, k: Math.pow(Math.max(1e-9, rBons()), 1 / PESO_BOM[l.tipo]) })).sort((x, y) => y.k - x.k).slice(0, b).forEach(o => { o.l.leitura = 'bom'; });
      });
    });
    const rn = rng(404);
    lances.forEach(l => {
      if (rn() < .5) { const pool = NOTAS[l.tipo][l.leitura]; l.nota = pool[Math.floor(rn() * pool.length)]; }
    });
    // o vídeo mais novo chegou hoje e o Zyron ainda está lendo: ele só entra nas contas quando terminar
    const novo = { i: videos.length, data: HOJE, titulo: 'Jogo Sub-17', dur: 281, n: 0, mes: 0, lendo: 64, hora: '08:12' };
    return { videos, lances, novo };
  }
  const BASE = geraVideosELances();
  const VIDEOS = BASE.videos, LANCES = BASE.lances, VIDEO_NOVO = BASE.novo;
  VIDEOS.forEach(v => { v.lances = LANCES.filter(l => l.v === v.i); v.bons = v.lances.filter(l => l.leitura === 'bom').length; });

  /* ---------- contas ---------- */
  const taxa = ls => ls.length ? ls.filter(l => l.leitura === 'bom').length / ls.length : 0;
  const pct = ls => Math.round(taxa(ls) * 100);
  function terços(ls) {
    const c = [0, 0, 0];
    ls.forEach(l => { c[l.x < 35 ? 0 : l.x < 70 ? 1 : 2]++; });
    return porCento(c);
  }
  function corredores(ls) {
    const c = [0, 0, 0];
    ls.forEach(l => { c[l.y < 22.67 ? 0 : l.y < 45.33 ? 1 : 2]++; });
    return porCento(c);
  }
  function porCento(c) { // porcentagens inteiras que somam 100 (maior resto)
    const n = c.reduce((a, b) => a + b, 0) || 1, cru = c.map(v => 100 * v / n), base = cru.map(Math.floor);
    let falta = 100 - base.reduce((a, b) => a + b, 0);
    cru.map((v, i) => [v - base[i], i]).sort((a, b) => b[0] - a[0]).slice(0, falta).forEach(([, i]) => { base[i]++; });
    return base;
  }
  const porTipo = ls => TIPOS.map(t => { const g = ls.filter(l => l.tipo === t); return { tipo: t, n: g.length, bons: g.filter(l => l.leitura === 'bom').length, taxa: pct(g) }; });
  const porMes = () => [-4, -3, -2, -1, 0].map(m => { const g = LANCES.filter(l => l.mes === m); return { m, rotulo: MES3[(HOJE.getMonth() + m + 12) % 12], n: g.length, bons: g.filter(l => l.leitura === 'bom').length, taxa: pct(g), videos: VIDEOS.filter(v => v.mes === m).length }; });
  function periodo(chave) { // últimos N dias (ou tudo), e o período anterior do mesmo tamanho
    if (chave === 'tudo') return { atual: LANCES, anterior: [], dias: 0 };
    const dias = Number(chave), fim = HOJE, ini = somaDias(-dias), ini0 = somaDias(-2 * dias);
    return { atual: LANCES.filter(l => l.data > ini && l.data <= fim), anterior: LANCES.filter(l => l.data > ini0 && l.data <= ini), dias };
  }
  function nomeZona(x, y) {
    const t = x < 35 ? 'terço defensivo' : x < 70 ? 'meio-campo' : 'último terço';
    const c = y < 22.67 ? 'corredor esquerdo' : y < 45.33 ? 'corredor central' : 'corredor direito';
    return t + ', ' + c;
  }

  /* ---------- oportunidades em clubes (clubes anônimos) ---------- */
  const ETAPAS = [['enc', 'Encaminhado'], ['ana', 'Em análise'], ['vid', 'Pediu mais vídeo'], ['ava', 'Avaliação marcada']];
  const AVAL = util(40), SELETIVA = util(25);
  const OPORT = [
    { id: 1, clube: 'Clube da Série A', lugar: 'São Paulo (SP)', cat: 'Sub-17', busca: 'meia de criação, destro', etapa: 'ava', enc: somaDias(-26), mov: somaDias(-4), quando: AVAL, nota: 'Logística combinada com a família' },
    { id: 2, clube: 'Clube da Série B', lugar: 'Paraná (PR)', cat: 'Sub-17', busca: 'meia com chegada na área', etapa: 'vid', enc: somaDias(-19), mov: somaDias(-3), nota: 'Pediu vídeos dos últimos dois meses' },
    { id: 3, clube: 'Clube da Série A', lugar: 'Rio Grande do Sul (RS)', cat: 'Sub-17', busca: 'meia de transição', etapa: 'vid', enc: somaDias(-21), mov: somaDias(-6), nota: 'Quer ver jogo com o time atacando' },
    { id: 4, clube: 'Clube da 2ª divisão', lugar: 'Portugal', cat: 'Sub-19', busca: 'meia de transição', etapa: 'ana', enc: somaDias(-12), mov: somaDias(-5), nota: 'Em análise pela comissão técnica' },
    { id: 5, clube: 'Clube da Série A', lugar: 'Minas Gerais (MG)', cat: 'Sub-17', busca: 'volante com saída de bola', etapa: 'ana', enc: somaDias(-14), mov: somaDias(-7), nota: 'Em análise pela comissão técnica' },
    { id: 6, clube: 'Clube da Série B', lugar: 'Goiás (GO)', cat: 'Sub-17', busca: 'meia com bom passe', etapa: 'ana', enc: somaDias(-16), mov: somaDias(-9), nota: 'Em análise pela comissão técnica' },
    { id: 7, clube: 'Academia universitária', lugar: 'Estados Unidos', cat: 'Sub-17', busca: 'meia com bom passe · bolsa de estudo', etapa: 'enc', enc: somaDias(-1), mov: somaDias(-1) },
    { id: 8, clube: 'Clube da Série A', lugar: 'Rio de Janeiro (RJ)', cat: 'Sub-17', busca: 'meia de criação', etapa: 'enc', enc: somaDias(-1), mov: somaDias(-1) },
    { id: 9, clube: 'Clube da Série C', lugar: 'Santa Catarina (SC)', cat: 'Sub-17', busca: 'meia com chegada na área', etapa: 'enc', enc: somaDias(-2), mov: somaDias(-2) },
    { id: 10, clube: 'Clube da 1ª divisão', lugar: 'Portugal', cat: 'Sub-19', busca: 'meia de transição', etapa: 'enc', enc: somaDias(-3), mov: somaDias(-3) },
    { id: 11, clube: 'Clube da Série B', lugar: 'Bahia (BA)', cat: 'Sub-17', busca: 'meia central, destro', etapa: 'enc', enc: somaDias(-4), mov: somaDias(-4) },
    { id: 12, clube: 'Clube da Série A', lugar: 'Pernambuco (PE)', cat: 'Sub-17', busca: 'meia com bom passe', etapa: 'enc', enc: somaDias(-5), mov: somaDias(-5) },
    { id: 13, clube: 'Clube da Série C', lugar: 'Mato Grosso (MT)', cat: 'Sub-17', busca: 'meia central', etapa: 'enc', enc: somaDias(-6), mov: somaDias(-6) },
    { id: 14, clube: 'Academia universitária', lugar: 'Canadá', cat: 'Sub-17', busca: 'meia de transição · bolsa de estudo', etapa: 'enc', enc: somaDias(-7), mov: somaDias(-7) },
    { id: 15, clube: 'Clube da 2ª divisão', lugar: 'Espanha', cat: 'Sub-19', busca: 'meia com chegada na área', etapa: 'enc', enc: somaDias(-8), mov: somaDias(-8) }
  ];
  const ENC_HISTORICO = [11, 15, 17, 16]; // jun, jul, ago, set (o mês de agora sai da lista acima)
  const encMes = () => OPORT.filter(o => mesmoMes(o.enc, HOJE)).length;
  const encTotal = () => ENC_HISTORICO.reduce((a, b) => a + b, 0) + encMes();

  /* ---------- plano, aulas, equipe, agenda, mensagens, atletas ---------- */
  const EQUIPE = [
    { id: 'scout', nome: 'Scout', papel: 'Estrategista de carreiras', ritmo: 'Todo dia', ini: 'SC', online: true },
    { id: 'gerente', nome: 'Gerente de carreira', papel: 'Acompanhamento e logística', ritmo: 'Todo dia', ini: 'GC', online: true },
    { id: 'david', nome: 'David Willer', papel: 'Assessoria individual', ritmo: 'Todo mês', ini: 'DW', online: false },
    { id: 'esportivo', nome: 'Estrategista esportivo', papel: 'Relatório e ligação', ritmo: 'Toda semana', ini: 'EE', online: false },
    { id: 'analista', nome: 'Analista de performance', papel: 'Relatório quinzenal', ritmo: 'A cada 15 dias', ini: 'AP', online: false }
  ];
  const MODULOS = [
    { nome: 'Performance e desenvolvimento atlético', aulas: 9, feitas: 7, prox: 'Finalização de média distância' },
    { nome: 'Dados e inteligência (Zyron)', aulas: 5, feitas: 5, prox: 'Como ler o seu relatório' },
    { nome: 'Psicologia esportiva', aulas: 6, feitas: 4, prox: 'Rotina de foco antes do jogo' },
    { nome: 'Nutrição', aulas: 6, feitas: 4, prox: 'Alimentação em dia de jogo' },
    { nome: 'Comportamento', aulas: 5, feitas: 3, prox: 'Comunicação com a comissão técnica' },
    { nome: 'Imagem e posicionamento', aulas: 6, feitas: 2, prox: 'Perfil em redes sociais' },
    { nome: 'Acompanhamento e direcionamento', aulas: 7, feitas: 3, prox: 'Como funciona uma avaliação presencial' }
  ];
  const PRIORIDADES = [
    { nome: 'Finalização de média distância', tipo: 'Finalização', meta: 60 },
    { nome: 'Duelo defensivo no meio', tipo: 'Desarme', meta: 70 },
    { nome: 'Drible em espaço curto', tipo: 'Drible', meta: 65 }
  ];
  const FORTES = ['Passe entre linhas sob pressão', 'Ataque ao espaço no tempo certo', 'Primeiro toque orientado'];
  const CASA = [
    ['G. S.', 'PR', 'Volante', 'Sub-16', 'Vídeo lido hoje', 'ia'], ['M. A.', 'BA', 'Lateral esquerdo', 'Sub-15', 'Plano atualizado', 'ok'], ['R. C.', 'SP', 'Zagueiro', 'Sub-17', 'Encaminhado', 'on'],
    ['L. F.', 'RS', 'Goleiro', 'Sub-17', 'Avaliação marcada', 'on'], ['P. H.', 'PE', 'Centroavante', 'Sub-16', 'Relatório novo', 'ia'], ['J. V.', 'GO', 'Ponta direita', 'Sub-14', 'Vídeo lido hoje', 'ia'],
    ['D. M.', 'SC', 'Meia', 'Sub-15', 'Encaminhado', 'on'], ['K. S.', 'CE', 'Lateral direito', 'Sub-17', 'Plano atualizado', 'ok'], ['T. N.', 'MG', 'Ponta esquerda', 'Sub-16', 'Relatório novo', 'ia'],
    ['A. B.', 'RJ', 'Volante', 'Sub-17', 'Encaminhado', 'on'], ['I. C.', 'DF', 'Zagueiro', 'Sub-15', 'Vídeo lido hoje', 'ia'], ['W. L.', 'AM', 'Atacante', 'Sub-16', 'Plano atualizado', 'ok'],
    ['B. R.', 'PA', 'Meia', 'Sub-14', 'Relatório novo', 'ia'], ['E. P.', 'MT', 'Goleiro', 'Sub-15', 'Vídeo lido hoje', 'ia'], ['V. S.', 'PB', 'Ponta esquerda', 'Sub-17', 'Encaminhado', 'on'],
    ['H. M.', 'ES', 'Zagueiro', 'Sub-16', 'Relatório novo', 'ia'], ['C. A.', 'MS', 'Meia', 'Sub-17', 'Avaliação marcada', 'on'], ['N. T.', 'SP', 'Lateral direito', 'Sub-16', 'Plano atualizado', 'ok'],
    ['O. G.', 'PR', 'Centroavante', 'Sub-17', 'Vídeo lido hoje', 'ia'], ['F. D.', 'MG', 'Volante', 'Sub-15', 'Relatório novo', 'ia'], ['Y. R.', 'BA', 'Ponta direita', 'Sub-16', 'Encaminhado', 'on'],
    ['U. P.', 'RS', 'Zagueiro', 'Sub-17', 'Plano atualizado', 'ok'], ['Z. L.', 'GO', 'Meia', 'Sub-14', 'Vídeo lido hoje', 'ia'], ['Q. M.', 'SC', 'Lateral esquerdo', 'Sub-16', 'Relatório novo', 'ia']
  ];

  W.D = { HOJE, MESES, MES3, DIAS, DIA3, dia, somaDias, util, dd, mm, ddmm, mes3, cap, diasEntre, mmss, mesmoMes, relativo, rng, gauss, escolhe,
    ATLETA, VIDEOS, LANCES, VIDEO_NOVO, TIPOS, taxa, pct, terços, corredores, porTipo, porMes, periodo, nomeZona,
    ETAPAS, AVAL, SELETIVA, OPORT, ENC_HISTORICO, encMes, encTotal, EQUIPE, MODULOS, PRIORIDADES, FORTES, CASA };
})(window);
