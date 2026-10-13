/* Área de membros: pequenos ajudantes de interface (ícones, chips, avatares, barras) e o estado das telas. */
(function (W) {
  'use strict';
  const esc = W.G.esc;
  const ic = (n, cls) => '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>';
  const chip = (txt, tipo, icone) => '<span class="chip' + (tipo ? ' ' + tipo : '') + '">' + (icone ? ic(icone) : '') + txt + '</span>';
  const av = (ini, tam, cls) => '<span class="av' + (tam ? ' ' + tam : '') + (cls ? ' ' + cls : '') + '">' + esc(ini) + '</span>';
  const k = (txt, cls) => '<p class="k' + (cls ? ' ' + cls : '') + '">' + txt + '</p>';
  const barra = (v, max, cls) => '<span class="prog' + (cls ? ' ' + cls : '') + '"><i style="width:' + Math.max(0, Math.min(100, 100 * v / (max || 100))).toFixed(1) + '%"></i></span>';
  const card = (titulo, corpo, o) => { o = o || {}; return '<section class="card' + (o.cls ? ' ' + o.cls : '') + '">' + (titulo ? '<header class="card-h"><h2 class="card-t">' + titulo + '</h2>' + (o.acao || '') + '</header>' : '') + corpo + '</section>'; };
  const seg = (caminho, opcoes, atual) => '<div class="seg" role="group">' + opcoes.map(([v, t]) => '<button type="button" data-set="' + caminho + '=' + v + '" class="' + (String(atual) === String(v) ? 'on' : '') + '">' + t + '</button>').join('') + '</div>';
  const sel = (caminho, opcoes, atual, rotulo) => '<label class="sel">' + (rotulo ? '<span>' + rotulo + '</span>' : '') + '<select data-bind="' + caminho + '">' + opcoes.map(([v, t]) => '<option value="' + esc(v) + '"' + (String(atual) === String(v) ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select>' + ic('baixo') + '</label>';
  const cabeca = (titulo, sub, acoes) => '<header class="ph"><div>' + (sub ? '<p class="k">' + sub + '</p>' : '') + '<h1>' + titulo + '</h1></div><div class="ph-r">' + (acoes || '') + '</div></header>';

  /* estado das telas (o que o membro escolheu) */
  const E = {
    mapa: { periodo: '30', video: 'todos', tipo: 'todos', leitura: 'todas', camada: 'calor', comparar: 'anterior' },
    vid: { sel: 13, lance: -1 },
    evo: { vista: 'grafico' },
    plano: { tarefas: { 0: true, 1: false, 2: false, 3: false, 4: false } },
    op: { vista: 'quadro', filtro: 'todos' },
    agenda: { sel: null },
    msg: { sel: 'scout' },
    aulas: {},
    atl: { cat: 'todas', pos: 'todas' }
  };

  const cum = a => a.reduce((r, v) => { r.push((r.length ? r[r.length - 1] : 0) + v); return r; }, []);
  W.UI = { esc, ic, chip, av, k, barra, card, seg, sel, cabeca, cum };
  W.E = E;
  W.P = {};
})(window);
