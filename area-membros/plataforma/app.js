/* Área de membros: o casco da plataforma (menu lateral, barra de cima, rotas por #/nome e os cliques). */
(function (W) {
  'use strict';
  const D = W.D, G = W.G, U = W.UI, P = W.P, E = W.E, { ic, av, esc } = U;
  const NAV = [
    [null, [['inicio', 'Início', 'inicio']]],
    ['Desempenho', [['mapa', 'Mapa de desempenho', 'mapa'], ['leituras', 'Vídeos e leituras', 'video'], ['evolucao', 'Evolução', 'evolucao']]],
    ['Carreira', [['plano', 'Plano de carreira', 'plano'], ['oportunidades', 'Oportunidades', 'clube', D.encMes()], ['perfil', 'Meu perfil', 'perfil']]],
    ['Acompanhamento', [['agenda', 'Agenda', 'agenda'], ['mensagens', 'Mensagens', 'chat', 2], ['aulas', 'Aulas', 'aulas']]],
    ['Rede', [['atletas', 'Atletas da casa', 'atletas']]]
  ];
  const ROTAS = NAV.reduce((a, g) => a.concat(g[1]), []);
  const TAB = ['inicio', 'mapa', 'leituras', 'plano', 'oportunidades'];
  const A = D.ATLETA;
  const item = ([id, nome, icone, n]) => '<a href="#/' + id + '" data-rota="' + id + '">' + ic(icone) + '<span>' + nome + '</span>' + (n ? '<b class="nb">' + n + '</b>' : '') + '</a>';

  function casca() {
    document.getElementById('app').innerHTML =
      '<div class="app"><aside class="side"><a class="brand" href="#/inicio"><b>Jogador de Elite</b><span>Área de membros</span></a>' +
      '<nav class="nav">' + NAV.map(([g, its]) => (g ? '<p class="nav-g">' + g + '</p>' : '') + its.map(item).join('')).join('') + '</nav>' +
      '<div class="side-user">' + av(A.ini, '', 'on') + '<div><b>' + esc(A.nome) + '</b><span>' + esc(A.plano) + '</span></div></div><p class="demo"><i></i>Conta de demonstração · dados ilustrativos</p></aside>' +
      '<div class="main"><header class="top"><a class="brand-m" href="#/inicio"><b>Jogador de Elite</b></a><div class="busca">' + ic('busca') + '<span>Buscar vídeo, relatório ou clube</span><kbd>/</kbd></div>' +
      '<div class="top-r"><a class="btn" href="#/mensagens">' + ic('chat') + '<span>Falar com o Scout</span></a><button type="button" class="ib sino" aria-label="Notificações">' + ic('sino') + '<i></i></button>' +
      '<div class="eu">' + av(A.ini, 'sm', 'on') + '<div><b>' + esc(A.nome) + '</b><span>' + esc(A.planoCurto) + '</span></div>' + ic('baixo') + '</div></div></header>' +
      '<main class="view" id="view"></main></div></div>' +
      '<nav class="tabbar">' + TAB.map(id => { const r = ROTAS.find(x => x[0] === id); return '<a href="#/' + id + '" data-rota="' + id + '">' + ic(r[2]) + '<span>' + (id === 'oportunidades' ? 'Clubes' : id === 'leituras' ? 'Vídeos' : r[1].split(' ')[0]) + '</span></a>'; }).join('') + '<button type="button" data-sheet>' + ic('grid') + '<span>Mais</span></button></nav>' +
      '<div class="sheet" id="sheet"><div class="sheet-c"><p class="k">Mais telas</p>' + ROTAS.filter(r => TAB.indexOf(r[0]) < 0).map(r => '<a href="#/' + r[0] + '" data-rota="' + r[0] + '">' + ic(r[2]) + r[1] + '</a>').join('') + '</div></div>';
  }

  const rota = () => { const r = (location.hash.match(/^#\/([a-z]+)/) || [])[1]; return P[r] ? r : 'inicio'; };
  function render(manter) {
    const id = rota(), pg = P[id], v = document.getElementById('view'), y = v.scrollTop;
    v.innerHTML = pg.html();
    document.querySelectorAll('[data-rota]').forEach(a => a.classList.toggle('on', a.dataset.rota === id));
    document.body.dataset.rota = id;
    document.title = pg.titulo + ' · Jogador de Elite';
    document.getElementById('sheet').classList.remove('aberto');
    if (pg.pos) pg.pos(v);
    v.querySelectorAll('[data-spk]').forEach(s => G.spark(s, s.dataset.spk.split(',').map(Number)));
    v.scrollTop = manter ? y : 0;
    document.body.dataset.pronto = '1';
  }

  /* data-set="mapa.camada=lances;vid.lance=-1" muda o estado e redesenha a tela */
  const valor = s => (/^-?\d+$/.test(s) ? Number(s) : s);
  function muda(caminho, v) { const p = caminho.split('.'); let o = E; for (let i = 0; i < p.length - 1; i++) o = o[p[i]]; o[p[p.length - 1]] = valor(v); }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-set]');
    if (t) { t.dataset.set.split(';').forEach(par => { const [c, v] = par.split('='); muda(c, v); }); render(true); return; }
    const tf = e.target.closest('[data-tarefa]');
    if (tf) { const j = tf.dataset.tarefa; E.plano.tarefas[j] = !E.plano.tarefas[j]; render(true); return; }
    if (e.target.closest('[data-sheet]')) { document.getElementById('sheet').classList.toggle('aberto'); return; }
    if (e.target.id === 'sheet') document.getElementById('sheet').classList.remove('aberto');
  });
  document.addEventListener('change', e => { const s = e.target.closest('select[data-bind]'); if (s) { muda(s.dataset.bind, s.value); render(true); } });
  addEventListener('hashchange', () => render(false));
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => render(true), 160); });

  const inicia = () => { casca(); render(false); };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(inicia);
})(window);
