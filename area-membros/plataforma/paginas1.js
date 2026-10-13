/* Área de membros: telas Início e Mapa de desempenho. */
(function (W) {
  'use strict';
  const D = W.D, G = W.G, U = W.UI, E = W.E, P = W.P;
  const { ic, chip, av, k, barra, card, seg, sel, cabeca, esc, cum } = U;
  const sinal = n => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n);
  const zonaCurta = (x, y) => (x < 35 ? 'Defesa' : x < 70 ? 'Meio-campo' : 'Ataque') + ' · ' + (y < 22.67 ? 'esquerda' : y < 45.33 ? 'centro' : 'direita');
  const leituraChip = l => l === 'bom' ? chip('Decisão boa', 'ia', 'check') : chip('A melhorar', 'am', 'ajuste');

  /* a lista "por tipo de lance": a barra é a parte de decisões boas */
  function listaTipos(ls) {
    const t = D.porTipo(ls).filter(x => x.n).sort((a, b) => b.n - a.n);
    return '<ul class="tipos">' + t.map(x => '<li><span class="nm">' + esc(x.tipo) + '</span><span class="tr"><i style="width:' + x.taxa + '%"></i></span><b>' + x.taxa + '%</b><span class="qt">' + x.n + '</span></li>').join('') + '</ul>';
  }

  /* a lista "por vídeo": o mais novo primeiro */
  function listaVideos(ls) {
    const vs = D.VIDEOS.filter(v => ls.some(l => l.v === v.i)).reverse().slice(0, 8);
    return '<ul class="tipos pv">' + vs.map(v => { const g = ls.filter(l => l.v === v.i), t = D.pct(g); return '<li><span class="nm">' + esc(v.titulo.split('·')[0].trim()) + ' · ' + D.ddmm(v.data) + '</span><span class="tr"><i style="width:' + t + '%"></i></span><b>' + t + '%</b><span class="qt">' + g.length + '</span></li>'; }).join('') + '</ul>';
  }

  /* ================= INÍCIO ================= */
  P.inicio = {
    titulo: 'Início',
    html() {
      const A = D.ATLETA, p30 = D.periodo('30'), pm = D.porMes();
      const tx = D.pct(p30.atual), delta = tx - D.pct(p30.anterior);
      const vids30 = D.VIDEOS.filter(v => v.data > D.somaDias(-30)).length;
      const enc = D.encMes();
      const aval = D.OPORT.find(o => o.etapa === 'ava');
      const dias = D.diasEntre(D.HOJE, D.AVAL);
      const prio = D.PRIORIDADES[0], pr = D.porTipo(D.periodo('90').atual).find(x => x.tipo === prio.tipo);
      const dataExt = D.DIAS[D.HOJE.getDay()] + ', ' + D.HOJE.getDate() + ' de ' + D.MESES[D.HOJE.getMonth()];
      const kpi = (rot, val, sub, spk, extra) => '<div class="kpi"><div><p class="k">' + rot + '</p><p class="kv">' + val + '</p>' + sub + (extra || '') + '</div>' + (spk ? '<svg class="spk" data-spk="' + spk + '"></svg>' : '') + '</div>';
      const atividade = [
        ['video', 'O Zyron está lendo “' + D.VIDEO_NOVO.titulo + '”', 'Enviado hoje, ' + D.VIDEO_NOVO.hora, chip('64%', 'ia')],
        ['clube', 'Perfil encaminhado a 2 clubes', 'Ontem', ''],
        ['doc', 'Relatório quinzenal disponível', 'Há 3 dias', chip('Novo', 'on')],
        ['video', 'O Clube da Série B pediu mais vídeo', 'Há 3 dias', ''],
        ['aulas', 'Aula concluída: Alimentação em dia de jogo', 'Há 4 dias', ''],
        ['cal', 'Avaliação presencial marcada: Clube da Série A (SP)', 'Há 4 dias', '']
      ];
      return cabeca('Bom dia, ' + A.primeiro, D.cap(dataExt),
        chip('Perfil aprovado', 'ok', 'check') + chip('Dossiê nº ' + A.dossie, '') + '<a class="btn pri" href="#/leituras">' + ic('up') + 'Enviar vídeo</a>') +
        '<section class="kpis">' +
        kpi('Vídeos lidos', D.VIDEOS.length, '<p class="kd up">' + ic('sobe') + '+' + vids30 + ' nos últimos 30 dias</p>', cum(pm.map(m => m.videos)).join(',')) +
        kpi('Lances lidos', D.LANCES.length, '<p class="kd">Lance a lance, pelo Zyron</p>', cum(pm.map(m => m.n)).join(',')) +
        kpi('Decisões boas · 30 dias', tx + '%', '<p class="kd up">' + ic('sobe') + sinal(delta) + ' pts vs. 30 dias anteriores</p>', pm.map(m => m.taxa).join(',')) +
        kpi('Encaminhamentos', enc, '<p class="kd">Este mês · mínimo de 15</p>', '', barra(enc, 15, 'ia')) +
        '</section>' +
        '<div class="g-ini"><div class="col">' +
        card('Mapa de calor', '<div class="pitch" id="c-ini"></div>', { acao: '<span class="card-a">' + chip('Últimos 30 dias') + '<a class="lnk" href="#/mapa">Abrir mapa' + ic('seta') + '</a></span>' }) +
        card('Atividade recente', '<ul class="feed">' + atividade.map(a => '<li><span class="fi">' + ic(a[0]) + '</span><div><p>' + a[1] + '</p><span>' + a[2] + '</span></div>' + a[3] + '</li>').join('') + '</ul>') +
        '</div><div class="col">' +
        card('Próximo compromisso', '<div class="prox-top"><div class="dt"><span>' + D.mes3(D.AVAL) + '</span><b>' + D.dd(D.AVAL) + '</b></div><div><p class="pt1">Avaliação presencial</p><p class="pt2">' + esc(aval.clube) + ' · ' + esc(aval.lugar) + ' · ' + aval.cat + '</p></div></div>' +
          '<ul class="chk"><li class="ok">' + ic('check') + 'Roteiro de viagem planejado</li><li class="ok">' + ic('check') + 'Documentos do atleta enviados</li><li>' + ic('circulo') + 'Autorização dos responsáveis</li><li>' + ic('circulo') + 'Aula: como funciona uma avaliação presencial</li></ul>',
          { acao: chip('em ' + dias + ' dias', 'on'), cls: 'prox' }) +
        card('Primeiro foco do mês', '<p class="foco-t">' + esc(prio.nome) + '</p><div class="foco-m"><span>' + pr.taxa + '% de decisões boas</span><span>meta ' + prio.meta + '%</span></div>' + barra(pr.taxa, prio.meta, 'ia') +
          '<ul class="chk"><li>' + ic('circulo') + 'Chute de fora da área: 3 séries de 8</li><li>' + ic('circulo') + 'Aula: finalização de média distância (12 min)</li><li>' + ic('circulo') + 'Enviar o vídeo do próximo jogo</li></ul>', { acao: '<a class="lnk" href="#/plano">Plano' + ic('seta') + '</a>' }) +
        card('Seu time', '<ul class="time">' + D.EQUIPE.map(e => '<li>' + av(e.ini, '', e.online ? 'onl' : '') + '<div><p>' + esc(e.nome) + '</p><span>' + esc(e.papel) + ' · ' + esc(e.ritmo.toLowerCase()) + '</span></div><a class="ib" href="#/mensagens" aria-label="Mensagem">' + ic('chat') + '</a></li>').join('') + '</ul>') +
        '</div></div>';
    },
    pos(el) {
      G.campo(el.querySelector('#c-ini'), D.periodo('30').atual, { tercos: true, rotulos: false });
    }
  };

  /* ================= MAPA DE DESEMPENHO ================= */
  function filtraMapa() {
    const m = E.mapa;
    let base = m.video !== 'todos' ? D.LANCES.filter(l => l.v === Number(m.video)) : (m.periodo === 'tudo' ? D.LANCES : D.periodo(m.periodo).atual);
    if (m.tipo !== 'todos') base = base.filter(l => l.tipo === m.tipo);
    if (m.leitura !== 'todas') base = base.filter(l => l.leitura === m.leitura);
    return base;
  }
  function comparacao() { // [lances de antes, lances de agora, rótulo antes, rótulo agora]
    const m = E.mapa, f = ls => ls.filter(l => (m.tipo === 'todos' || l.tipo === m.tipo) && (m.leitura === 'todas' || l.leitura === m.leitura));
    if (m.video === 'todos' && m.periodo !== 'tudo') {
      const p = D.periodo(m.periodo);
      return [f(p.anterior), f(p.atual), m.periodo + ' dias anteriores', 'Últimos ' + m.periodo + ' dias'];
    }
    return [f(D.LANCES.filter(l => l.mes === -4)), f(D.LANCES.filter(l => l.mes === 0)), 'Primeiro mês', 'Mês atual'];
  }
  P.mapa = {
    titulo: 'Mapa de desempenho',
    html() {
      const m = E.mapa, ls = filtraMapa(), p = m.periodo, nVid = new Set(ls.map(l => l.v)).size;
      const vids = D.VIDEOS.slice().reverse().map(v => [v.i, v.titulo + ' · ' + D.ddmm(v.data)]);
      const cor = D.corredores(ls), tx = D.pct(ls);
      const [antes, agora, rA, rB] = comparacao();
      const tA = D.terços(antes), tB = D.terços(agora);
      const recentes = ls.slice().sort((a, b) => b.v - a.v || a.t - b.t).slice(0, 8);
      const periodoTxt = m.video !== 'todos' ? 'Vídeo selecionado' : m.periodo === 'tudo' ? 'Todo o período' : 'Últimos ' + m.periodo + ' dias';
      const insA = agora.length && antes.length ? D.terços(agora)[2] - D.terços(antes)[2] : null;
      return cabeca('Mapa de desempenho', 'Fernando Silva · ' + D.ATLETA.posicao + ' · ' + D.ATLETA.categoria,
        seg('mapa.camada', [['calor', ic('mapa') + 'Calor'], ['lances', ic('pontos') + 'Lances']], m.camada)) +
        '<div class="filtros">' + sel('mapa.periodo', [['30', 'Últimos 30 dias'], ['90', 'Últimos 90 dias'], ['tudo', 'Todo o período']], m.periodo, 'Período') +
        sel('mapa.video', [['todos', 'Todos os vídeos']].concat(vids), m.video, 'Vídeo') +
        sel('mapa.tipo', [['todos', 'Todos os tipos']].concat(D.TIPOS.map(t => [t, t])), m.tipo, 'Tipo de lance') +
        sel('mapa.leitura', [['todas', 'Todas as leituras'], ['bom', 'Decisões boas'], ['ajustar', 'A melhorar']], m.leitura, 'Leitura') +
        '<span class="conta"><b>' + ls.length + '</b> lances · ' + nVid + (nVid === 1 ? ' vídeo' : ' vídeos') + '</span></div>' +
        '<div class="g-mapa"><div class="col">' +
        card('Campo · ' + periodoTxt, '<div class="pitch" id="c-mapa"></div><div class="cor"><p><span>Corredor esquerdo</span><b>' + cor[0] + '%</b></p><p><span>Corredor central</span><b>' + cor[1] + '%</b></p><p><span>Corredor direito</span><b>' + cor[2] + '%</b></p><p class="sep"><span>Decisões boas</span><b>' + tx + '%</b></p></div>',
          { acao: chip(m.camada === 'calor' ? 'Mapa de calor' : 'Lances um a um', 'ia') }) +
        card('Comparar', '<div class="cmp"><figure><div class="pitch" id="c-a"></div><figcaption><span>' + esc(D.cap(rA)) + '</span><b>' + tA[2] + '%</b> dos lances no último terço</figcaption></figure><figure><div class="pitch" id="c-b"></div><figcaption><span>' + esc(rB) + '</span><b>' + tB[2] + '%</b> dos lances no último terço</figcaption></figure></div>', { acao: '<span class="k">' + antes.length + ' e ' + agora.length + ' lances</span>' }) +
        '</div><div class="col">' +
        card('Leitura do mapa', '<ul class="ins"><li>' + ic('alvo') + '<p>Zona mais ativa: <b id="ins-zona">…</b></p></li><li>' + ic('sobe') + '<p>Último terço: <b>' + tB[2] + '% dos lances</b>' + (insA != null ? ' (' + sinal(insA) + ' pts vs. ' + rA.toLowerCase() + ')' : '') + '</p></li><li>' + ic('seta') + '<p>Corredor esquerdo concentra <b>' + cor[0] + '%</b> dos lances; o direito, <b>' + cor[2] + '%</b>.</p></li></ul>') +
        card('Por tipo de lance', ls.length ? listaTipos(ls) : '<p class="vazio">Nenhum lance nesse filtro.</p>', { acao: '<span class="k">% boas · lances</span>' }) +
        card('Por vídeo', ls.length ? listaVideos(ls) : '<p class="vazio">Nenhum lance nesse filtro.</p>', { acao: '<span class="k">% boas · lances</span>' }) +
        '</div></div>' +
        card('Lances marcados', '<table class="tbl"><thead><tr><th>Vídeo</th><th>Minuto</th><th>Tipo</th><th>Zona</th><th>Leitura</th><th>Nota do Zyron</th></tr></thead><tbody>' +
          recentes.map(l => { const v = D.VIDEOS[l.v]; return '<tr><td><b>' + esc(v.titulo) + '</b><span class="sub">' + D.ddmm(v.data) + '</span></td><td class="num">' + D.mmss(l.t) + '</td><td>' + esc(l.tipo) + '</td><td>' + zonaCurta(l.x, l.y) + '</td><td>' + leituraChip(l.leitura) + '</td><td class="nt">' + esc(l.nota || '—') + '</td></tr>'; }).join('') +
          '</tbody></table>', { acao: '<span class="k">' + Math.min(8, ls.length) + ' de ' + ls.length + '</span>', cls: 'tab' });
    },
    pos(el) {
      const m = E.mapa, ls = filtraMapa();
      const r = G.campo(el.querySelector('#c-mapa'), ls, { camada: m.camada, tercos: true, anota: m.camada === 'calor' && ls.length > 20, rotulos: true });
      const z = el.querySelector('#ins-zona'); if (z) z.textContent = ls.length ? D.nomeZona(r.pico[0], r.pico[1]) : 'sem lances';
      const [antes, agora] = comparacao();
      G.campo(el.querySelector('#c-a'), antes, { mini: true });
      G.campo(el.querySelector('#c-b'), agora, { mini: true });
    }
  };
})(window);
