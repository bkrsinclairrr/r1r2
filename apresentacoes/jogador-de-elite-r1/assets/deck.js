/* Jogador de Elite · Deck R1
   Modo deck (o que a família vê) e modo apresentador (?presenter), sincronizados. */
(function () {
  'use strict';
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg';
  const isPresenter = /[?&]presenter\b/.test(location.search);
  const slides = qsa('#stage > .slide');
  const N = slides.length;
  const ROT = window.ROTEIRO || [];
  const AID = (new URLSearchParams(location.search).get('a') || '').trim();
  const FKEY = 'je-r1-ficha' + (AID ? '-' + AID : '');

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ } }
  };
  let ficha = store.get(FKEY, {});
  // link do painel (?a=<id>): outro atleta começa com a ficha limpa, antes de qualquer coisa ir pra tela
  if (AID && ficha._a !== AID) { ficha = { _a: AID }; store.set(FKEY, ficha); }
  let cur = 0;

  /* ---------------- contador e títulos ---------------- */
  slides.forEach((s, i) => {
    const c = document.createElement('div');
    c.className = 'counter';
    c.innerHTML = '<b>' + String(i + 1).padStart(2, '0') + '</b> / ' + N;
    s.appendChild(c);
    s.dataset.title = ROT[i] ? ROT[i].nome : 'Slide ' + (i + 1);
  });

  /* ---------------- desenhos em SVG ---------------- */
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };

  function pitchLines(g, x, y, w, h, vertical, color) {
    const L = { stroke: color, 'stroke-width': 2, fill: 'none' };
    el('rect', Object.assign({ x, y, width: w, height: h }, L), g);
    if (!vertical) {
      const sx = w / 105, sy = h / 68;
      el('line', Object.assign({ x1: x + w / 2, y1: y, x2: x + w / 2, y2: y + h }, L), g);
      el('circle', Object.assign({ cx: x + w / 2, cy: y + h / 2, r: 9.15 * sx }, L), g);
      [[x, 1], [x + w, -1]].forEach(([gx, d]) => {
        el('rect', Object.assign({ x: d > 0 ? gx : gx - 16.5 * sx, y: y + h / 2 - 20.15 * sy, width: 16.5 * sx, height: 40.3 * sy }, L), g);
        el('rect', Object.assign({ x: d > 0 ? gx : gx - 5.5 * sx, y: y + h / 2 - 9.15 * sy, width: 5.5 * sx, height: 18.3 * sy }, L), g);
      });
    } else {
      const sx = w / 68, sy = h / 105;
      el('line', Object.assign({ x1: x, y1: y + h / 2, x2: x + w, y2: y + h / 2 }, L), g);
      el('circle', Object.assign({ cx: x + w / 2, cy: y + h / 2, r: 9.15 * sx }, L), g);
      [[y, 1], [y + h, -1]].forEach(([gy, d]) => {
        el('rect', Object.assign({ x: x + w / 2 - 20.15 * sx, y: d > 0 ? gy : gy - 16.5 * sy, width: 40.3 * sx, height: 16.5 * sy }, L), g);
        el('rect', Object.assign({ x: x + w / 2 - 9.15 * sx, y: d > 0 ? gy : gy - 5.5 * sy, width: 18.3 * sx, height: 5.5 * sy }, L), g);
      });
    }
  }

  function drawEncaixe(svg) {
    if (!svg) return;
    const defs = el('defs', {}, svg);
    const gw = el('filter', { id: 'glowE', x: '-100%', y: '-100%', width: '300%', height: '300%' }, defs);
    el('feGaussianBlur', { stdDeviation: '6', result: 'b' }, gw);
    const mm = el('feMerge', {}, gw); el('feMergeNode', { in: 'b' }, mm); el('feMergeNode', { in: 'SourceGraphic' }, mm);
    const mk = el('marker', { id: 'arrE', markerWidth: 10, markerHeight: 10, refX: 5, refY: 5, orient: 'auto' }, defs);
    el('path', { d: 'M0 0 L10 5 L0 10 Z', fill: '#7FAEFF' }, mk);
    pitchLines(svg, 20, 30, 500, 780, true, 'rgba(255,255,255,.16)');
    [[270, 778], [80, 600], [200, 690], [340, 690], [165, 425], [375, 425], [90, 230], [400, 250]].forEach(([x, y]) =>
      el('circle', { cx: x, cy: y, r: 11, fill: '#2B3139', stroke: '#454C57', 'stroke-width': 2 }, svg));
    el('path', { d: 'M470 524 C 502 400, 506 270, 498 150', stroke: '#7FAEFF', 'stroke-width': 2.5, fill: 'none', 'stroke-dasharray': '8 8', 'marker-end': 'url(#arrE)', opacity: .8 }, svg);
    const gaps = [
      { x: 462, y: 560, label: 'lateral que chega ao fundo', lx: 500, ly: 634, anchor: 'end' },
      { x: 270, y: 540, label: 'volante que sai jogando', lx: 270, ly: 488, anchor: 'middle' },
      { x: 270, y: 118, label: '9 de área', lx: 270, ly: 188, anchor: 'middle' }
    ];
    gaps.forEach(g => {
      el('circle', { cx: g.x, cy: g.y, r: 34, fill: 'rgba(127,174,255,.10)', stroke: '#7FAEFF', 'stroke-width': 2.5, 'stroke-dasharray': '7 6', class: 'pulse' }, svg);
      el('circle', { cx: g.x, cy: g.y, r: 6, fill: '#7FAEFF', filter: 'url(#glowE)' }, svg);
      const t = el('text', { x: g.lx, y: g.ly, 'text-anchor': g.anchor, fill: '#FFFFFF', 'font-family': 'Archivo', 'font-weight': 500, 'font-size': 27, stroke: '#07080A', 'stroke-width': 9, 'paint-order': 'stroke', 'stroke-linejoin': 'round' }, svg);
      t.textContent = g.label;
    });
  }

  function drawRede(svg) {
    if (!svg) return;
    seed = 29;
    const C = [470, 500];
    const defs = el('defs', {}, svg);
    const gw = el('filter', { id: 'glowR', x: '-100%', y: '-100%', width: '300%', height: '300%' }, defs);
    el('feGaussianBlur', { stdDeviation: '5', result: 'b' }, gw);
    const mm = el('feMerge', {}, gw); el('feMergeNode', { in: 'b' }, mm); el('feMergeNode', { in: 'SourceGraphic' }, mm);
    [170, 290, 410].forEach(r => el('circle', { cx: C[0], cy: C[1], r, fill: 'none', stroke: 'rgba(127,174,255,.09)', 'stroke-width': 1.5 }, svg));
    const dots = [];
    for (let i = 0; i < 190; i++) {
      const a = rnd() * Math.PI * 2, r = 125 + Math.pow(rnd(), .75) * 350;
      dots.push([C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r * .96]);
    }
    const faint = el('g', { stroke: 'rgba(127,174,255,.07)', 'stroke-width': 1 }, svg);
    dots.forEach((d, i) => { if (i % 5 === 0) el('line', { x1: C[0], y1: C[1], x2: d[0], y2: d[1] }, faint); });
    dots.forEach(d => el('circle', { cx: d[0], cy: d[1], r: 1.6 + rnd() * 2.4, fill: '#7FAEFF', opacity: (.18 + rnd() * .45).toFixed(2) }, svg));
    const clubs = [
      ['Sport', 'Brasil', -90, 380], ['Hertha BSC', 'Alemanha', -50, 330], ['Ceará', 'Brasil', -12, 390],
      ['Hannover 96', 'Alemanha', 24, 320], ['Goiás', 'Brasil', 58, 380], ['Wigan Athletic', 'Inglaterra', 90, 330],
      ['Avaí', 'Brasil', 128, 370], ['Darmstadt 98', 'Alemanha', 164, 290], ['Ponte Preta', 'Brasil', 200, 350],
      ['Náutico', 'Brasil', 236, 330]
    ];
    const lines = el('g', {}, svg);
    clubs.forEach(([name, country, deg, r]) => {
      const a = deg * Math.PI / 180, x = C[0] + Math.cos(a) * r, y = C[1] + Math.sin(a) * r;
      el('line', { x1: C[0], y1: C[1], x2: x, y2: y, stroke: 'rgba(127,174,255,.5)', 'stroke-width': 1.6 }, lines);
      el('circle', { cx: x, cy: y, r: 17, fill: 'none', stroke: 'rgba(127,174,255,.35)', 'stroke-width': 1.5 }, svg);
      el('circle', { cx: x, cy: y, r: 7.5, fill: '#7FAEFF', filter: 'url(#glowR)' }, svg);
      const c = Math.cos(a);
      let anchor = 'middle', lx = x, ly = y, cy2;
      if (c > .3) { anchor = 'start'; lx = x + 28; ly = y + 2; }
      else if (c < -.3) { anchor = 'end'; lx = x - 28; ly = y + 2; }
      else if (Math.sin(a) < 0) { ly = y - 58; } else { ly = y + 50; }
      cy2 = ly + 30;
      const t1 = el('text', { x: lx, y: ly, 'text-anchor': anchor, fill: '#FFFFFF', 'font-family': 'Archivo', 'font-weight': 600, 'font-size': 28 }, svg);
      t1.textContent = name;
      const t2 = el('text', { x: lx, y: cy2, 'text-anchor': anchor, fill: '#8B939D', 'font-family': 'Barlow Condensed', 'font-weight': 600, 'font-size': 24, 'letter-spacing': '2.5' }, svg);
      t2.textContent = country.toUpperCase();
    });
    el('circle', { cx: C[0], cy: C[1], r: 104, fill: 'none', stroke: 'rgba(201,162,74,.28)', 'stroke-width': 1.5 }, svg);
    el('circle', { cx: C[0], cy: C[1], r: 84, fill: '#0C1016', stroke: '#C9A24A', 'stroke-width': 3 }, svg);
    const t = el('text', { x: C[0], y: C[1] + 14, 'text-anchor': 'middle', fill: '#E8CE8E', 'font-family': 'Saira Condensed', 'font-weight': 800, 'font-size': 42, 'data-bind': 'nomeOuVoce', 'data-fit': '1' }, svg);
    t.textContent = 'VOCÊ';
  }

  /* ---------------- personalização (ficha → slides) ---------------- */
  function derived() {
    const d = {};
    const full = String(ficha.nome || '').trim();
    d.nome = full.split(/\s+/)[0] || '';
    d.nomeOuVoce = (d.nome || 'Você').toUpperCase();
    d.posicao = String(ficha.posicao || '').trim();
    d.idade = String(ficha.idade || '').trim();
    d.cidade = String(ficha.cidade || '').trim();
    d.r2dia = String(ficha.r2dia || '').trim();
    d.r2hora = String(ficha.r2hora || '').trim();
    const origem = String(ficha.origem || '').trim();
    d.origemZyron = origem === 'Zyron' ? '1' : '';
    d.origemForm = origem.indexOf('Formulário') === 0 ? '1' : '';
    d.origemOutro = !d.origemZyron && !d.origemForm ? '1' : '';
    d.caracteristicas = String(ficha.caracteristicas || '').trim();
    d.experiencia = String(ficha.experiencia || '').trim();
    if (window.FotoAtleta) Object.assign(d, window.FotoAtleta.derivados(ficha, d, AID, painelDoLead));
    return d;
  }
  function applyBind(root) {
    const d = derived();
    qsa('[data-bind]', root).forEach(e => { e.textContent = d[e.dataset.bind] || ''; });
    qsa('[data-fit]', root).forEach(e => { const n = (e.textContent || '').length; e.setAttribute('font-size', n > 9 ? 28 : n > 6 ? 34 : 42); });
    qsa('[data-if]', root).forEach(e => e.classList.toggle('on', !!d[e.dataset.if]));
    qsa('[data-ifnot]', root).forEach(e => e.classList.toggle('off', !!d[e.dataset.ifnot]));
    if (window.FotoAtleta) window.FotoAtleta.atualiza(root, d);
  }

  /* ---------------- mensagens entre deck e apresentador ---------------- */
  let chan = null;
  try { chan = new BroadcastChannel('je-r1' + (AID ? '-' + AID : '')); } catch (e) { chan = null; }
  let peer = isPresenter ? window.opener : null;
  const me = isPresenter ? 'p' : 'd';
  const seen = new Set();
  function send(m) {
    m._id = Date.now() + '-' + Math.random().toString(36).slice(2);
    m._from = me;
    try { if (chan) chan.postMessage(m); } catch (e) { /* canal fechado */ }
    try { if (peer && !peer.closed) peer.postMessage(Object.assign({ __je: 1 }, m), '*'); } catch (e) { /* janela fechada */ }
  }
  function receive(m, handler) {
    if (!m || !m._id || m._from === me || seen.has(m._id)) return;
    seen.add(m._id);
    handler(m);
  }
  function listen(handler) {
    if (chan) chan.onmessage = e => receive(e.data, handler);
    window.addEventListener('message', e => {
      if (!e.data || !e.data.__je) return;
      if (peer && e.source !== peer) return;
      receive(e.data, handler);
    });
    window.addEventListener('storage', e => {
      if (e.key === FKEY) { ficha = store.get(FKEY, {}); handler({ t: 'ficha-local' }); }
    });
  }

  /* ---------------- apresentação do painel: o link ?a=<id> traz o nome e os campos do atleta ---------------- */
  // O painel (jogador-de-elite-closer, o Painel de Apresentações) guarda o que a família vê de cada atleta. Os campos que vêm de lá valem
  // sobre os deste navegador (e o que foi apagado lá some daqui); o resto da ficha, o que se anota na call, continua aqui.
  const PAINEL = 'https://jogador-de-elite-closer.vercel.app';
  /* O painel de antes (jogador-de-elite-painel) guardou os leads que já receberam o link: este painel responde 404 pra um código que não
     é dele, e o código dele tem 26 letras (a-z e 2-7), diferente dos de antes (nome-8letras). Só nesse caso, e só nesse endereço fixo,
     o deck pergunta ao painel de antes: os links já enviados seguem abrindo. */
  const PAINEL_DE_ANTES = 'https://jogador-de-elite-painel.vercel.app';
  const CODIGO_NOVO = /^[a-z2-7]{26}$/;
  /* O link do lead é um só por etapa (este deck é o de entrada do R1) e a variação é escolhida no painel: se ela for de outra página ou de
     outro deck, o painel manda onde (versao: { caminho, origem }) e este deck leva o lead pra lá, com o mesmo ?a= e o mesmo #slide. Só vale
     uma origem desta lista (os decks do painel), nunca a que vier da rede. */
  const DECKS_OK = ['https://jogador-de-elite-r2-novo.vercel.app', 'https://jogador-de-elite-r2.vercel.app', 'https://jogador-de-elite-r2-b.vercel.app', 'https://jogador-de-elite-r1.vercel.app'];
  const CAMINHO_OK = /^\/(variacoes\/[a-z0-9-]+\/)?$/;
  const destinoDe = j => {
    const v = j && j.versao;
    if (!v || typeof v.caminho !== 'string' || !CAMINHO_OK.test(v.caminho)) return null;
    const o = typeof v.origem === 'string' && v.origem ? v.origem.replace(/\/+$/, '') : location.origin;
    return o === location.origin || DECKS_OK.indexOf(o) >= 0 ? { origem: o, caminho: v.caminho } : null;
  };
  function iraVersao(d) {
    if (!d || location.protocol === 'file:') return false;
    if (d.origem === location.origin && location.pathname.replace(/index\.html$/, '') === d.caminho) return false;
    location.replace(d.origem + d.caminho + location.search + location.hash);
    return true;
  }
  // o lead de um painel, pelo endereço que o deck sempre usou (/api/publico?id=)
  let painelDoLead = PAINEL;
  const buscaLead = base => fetch(base + '/api/publico?id=' + encodeURIComponent(AID), { cache: 'no-store' })
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then(j => { painelDoLead = base; return j; });
  function carregaPainel(depois, aviso) {
    if (!AID || typeof fetch !== 'function') return;
    buscaLead(PAINEL)
      .catch(e => (e && e.message === '404' && !CODIGO_NOVO.test(AID) ? buscaLead(PAINEL_DE_ANTES) : Promise.reject(e)))
      .then(j => {
        if (iraVersao(destinoDe(j))) return;
        const f = (j && j.ficha) || {};
        (Array.isArray(ficha._p) ? ficha._p : []).forEach(k => { if (!(k in f)) delete ficha[k]; });
        Object.keys(f).forEach(k => { ficha[k] = f[k]; });
        if (j.foto && j.foto.ok) ficha._foto = j.foto; else delete ficha._foto;
        ficha._a = AID; ficha._p = Object.keys(f);
        store.set(FKEY, ficha);
        depois();
        if (aviso) aviso('Apresentação do painel: ' + (f.nome || AID) + '. O que veio do painel vale sobre esta ficha; pra mudar de vez, mude no painel.', true);
      })
      .catch(() => { if (aviso) aviso('Não consegui carregar a apresentação do painel (' + AID + '). A tela usa a ficha deste navegador.', false); });
  }
  function avisoPainel(txt, bom) {
    const p = qs('#pz-painel'); if (!p) return;
    p.hidden = false; p.textContent = txt; p.style.color = bom ? '' : '#F08A7E';
  }

  /* ---------------- miniaturas ---------------- */
  function thumb(i) {
    const c = slides[i].cloneNode(true);
    c.classList.remove('active');
    c.removeAttribute('data-video');
    qsa('[id]', c).forEach(e => { if (!e.closest('defs')) e.removeAttribute('id'); });
    qsa('video', c).forEach(v => {
      const img = document.createElement('img');
      img.src = v.getAttribute('poster') || '';
      img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
      v.replaceWith(img);
    });
    qsa('audio', c).forEach(a => a.remove());
    qsa('.play, .ap-play', c).forEach(b => b.setAttribute('tabindex', '-1'));
    return c;
  }
  function mountThumb(box, i) {
    box.innerHTML = '';
    if (i < 0 || i >= N) return;
    const mini = document.createElement('div');
    mini.className = 'mini';
    mini.appendChild(thumb(i));
    box.appendChild(mini);
    const fitMini = () => { mini.style.transform = 'scale(' + (box.clientWidth / 1920) + ')'; };
    fitMini();
    requestAnimationFrame(fitMini);
  }

  drawEncaixe(qs('#encaixe'));
  drawRede(qs('#rede'));
  window.addEventListener('je-foto-atleta', () => applyBind(document));
  applyBind(document);

  if (isPresenter) presenter(); else deck();

  /* =============================================================
     MODO DECK
     ============================================================= */
  function deck() {
    const stage = qs('#stage');
    const fit = () => {
      const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      document.documentElement.style.setProperty('--s', s);
    };
    fit();
    window.addEventListener('resize', fit);

    const hashIdx = () => { const n = parseInt((location.hash || '').replace('#', ''), 10); return Number.isFinite(n) ? n - 1 : 0; };
    cur = Math.max(0, Math.min(N - 1, hashIdx()));
    slides[cur].classList.add('active');
    updateHud();

    function go(i) {
      i = Math.max(0, Math.min(N - 1, i));
      if (i === cur) return;
      pauseIn(slides[cur]);
      slides[cur].classList.remove('active');
      cur = i;
      slides[cur].classList.add('active');
      try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) { /* file:// sem history */ }
      updateHud();
      send({ t: 'state', i: cur });
    }
    function updateHud() {
      qs('#hud-pos').textContent = (cur + 1) + ' / ' + N;
      qs('#progress').style.width = ((cur + 1) / N * 100) + '%';
      document.title = 'Jogador de Elite · R1 · ' + String(cur + 1).padStart(2, '0');
    }
    window.addEventListener('hashchange', () => go(hashIdx()));

    /* vídeos */
    qsa('.player').forEach(p => {
      const v = qs('video', p), b = qs('.play', p);
      b.addEventListener('click', () => { const r = v.play(); if (r && r.catch) r.catch(() => {}); });
      v.addEventListener('play', () => p.classList.add('playing'));
      v.addEventListener('ended', () => p.classList.remove('playing'));
    });
    qsa('.chapters').forEach(list => {
      const v = document.getElementById(list.dataset.for);
      const items = qsa('li', list);
      items.forEach(li => li.addEventListener('click', () => seek(v, parseFloat(li.dataset.t))));
      v.addEventListener('timeupdate', () => {
        let on = 0;
        items.forEach((li, k) => { if (v.currentTime >= parseFloat(li.dataset.t) - .2) on = k; });
        items.forEach((li, k) => li.classList.toggle('on', k === on && !v.paused));
      });
      v.addEventListener('pause', () => items.forEach(li => li.classList.remove('on')));
    });
    /* áudios (depoimento): a onda acende até onde já tocou */
    const mmss = t => Number.isFinite(t) ? Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0') : '0:00';
    qsa('.audio-player').forEach(p => {
      const a = document.getElementById(p.dataset.for); if (!a) return;
      const onda = qs('.ap-onda', p), barras = qsa('i', onda), tempo = qs('.ap-tempo', p);
      const pinta = () => {
        const k = a.duration ? a.currentTime / a.duration : 0, n = Math.round(k * barras.length);
        barras.forEach((b, j) => b.classList.toggle('on', j < n));
        tempo.textContent = a.duration ? mmss(a.currentTime) + ' / ' + mmss(a.duration) : mmss(a.currentTime);
      };
      qs('.ap-play', p).addEventListener('click', () => { if (a.paused) seek(a, a.currentTime); else a.pause(); });
      onda.addEventListener('click', e => {
        const r = onda.getBoundingClientRect();
        if (a.duration) { a.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * a.duration; pinta(); }
      });
      a.addEventListener('play', () => p.classList.add('tocando'));
      a.addEventListener('pause', () => p.classList.remove('tocando'));
      a.addEventListener('ended', () => p.classList.remove('tocando'));
      ['timeupdate', 'loadedmetadata', 'durationchange', 'seeked'].forEach(ev => a.addEventListener(ev, pinta));
      pinta();
    });
    function seek(v, t) {
      if (!v) return;
      try { v.currentTime = t; } catch (e) { /* ainda carregando */ }
      const r = v.play(); if (r && r.catch) r.catch(() => {});
    }
    function pauseIn(s) { qsa('video, audio', s).forEach(v => { try { v.pause(); } catch (e) { /* nada */ } }); }
    function slideVideo() { const id = slides[cur].dataset.video; return id ? document.getElementById(id) : null; }

    /* teclado */
    let numBuf = '', numT = 0;
    document.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if (qs('#overview').classList.contains('on')) {
        if (k === 'Escape' || k === 'g' || k === 'G') { e.preventDefault(); toggleOverview(false); }
        return;
      }
      if (k === 'ArrowRight' || k === 'PageDown' || k === 'ArrowDown') { e.preventDefault(); go(cur + 1); }
      else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'ArrowUp') { e.preventDefault(); go(cur - 1); }
      else if (k === ' ' || k === 'Enter') {
        e.preventDefault();
        if (k === 'Enter' && numBuf) { go(parseInt(numBuf, 10) - 1); numBuf = ''; return; }
        const v = slideVideo();
        if (v) { if (v.paused) seek(v, v.currentTime); else v.pause(); }
        else if (k === ' ') go(cur + 1);
      }
      else if (k === 'Home') { e.preventDefault(); go(0); }
      else if (k === 'End') { e.preventDefault(); go(N - 1); }
      else if (k === 'f' || k === 'F') toggleFs();
      else if (k === 'p' || k === 'P') openPresenter();
      else if (k === 'g' || k === 'G') toggleOverview(true);
      else if (/^\d$/.test(k)) {
        numBuf += k; clearTimeout(numT);
        numT = setTimeout(() => { if (numBuf) { go(parseInt(numBuf, 10) - 1); numBuf = ''; } }, 900);
      }
    }, true);

    /* toque: deslizar */
    let tx = 0, ty = 0;
    stage.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });

    /* barra de controle */
    let hudT = 0;
    const showHud = () => { document.body.classList.add('show-hud'); clearTimeout(hudT); hudT = setTimeout(() => document.body.classList.remove('show-hud'), 2200); };
    document.addEventListener('mousemove', showHud);
    qs('#hud').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const a = b.dataset.act;
      if (a === 'prev') go(cur - 1);
      if (a === 'next') go(cur + 1);
      if (a === 'overview') toggleOverview(true);
      if (a === 'presenter') openPresenter();
      if (a === 'fullscreen') toggleFs();
    });
    showHud();

    function toggleFs() {
      if (!document.fullscreenElement) { const r = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); if (r && r.catch) r.catch(() => {}); }
      else if (document.exitFullscreen) document.exitFullscreen();
    }

    /* visão geral */
    let ovBuilt = false;
    function toggleOverview(on) {
      const ov = qs('#overview');
      if (on && !ovBuilt) {
        const grid = qs('#ov-grid');
        slides.forEach((s, i) => {
          const it = document.createElement('div');
          it.className = 'ov-item';
          it.innerHTML = '<div class="th"></div><p class="nm"><b>' + String(i + 1).padStart(2, '0') + '</b>' + s.dataset.title + '</p>';
          it.addEventListener('click', () => { toggleOverview(false); go(i); });
          grid.appendChild(it);
        });
        ovBuilt = true;
      }
      ov.classList.toggle('on', !!on);
      if (on) {
        qsa('.ov-item', ov).forEach((it, i) => {
          it.classList.toggle('cur', i === cur);
          const th = qs('.th', it);
          if (!th.firstChild) mountThumb(th, i);
          else qs('.mini', th).style.transform = 'scale(' + (th.clientWidth / 1920) + ')';
        });
        const c = qsa('.ov-item', ov)[cur]; if (c) c.scrollIntoView({ block: 'center' });
      }
    }

    function openPresenter() {
      const url = location.pathname + location.search + (location.search ? '&' : '?') + 'presenter';
      const w = window.open(url, 'je-r1-presenter', 'width=1440,height=900');
      if (w) { peer = w; } else { alert('Libere pop-ups pra abrir o modo apresentador.'); }
    }

    listen(m => {
      if (m.t === 'goto') go(m.i);
      else if (m.t === 'hello') send({ t: 'state', i: cur });
      else if (m.t === 'ficha') { ficha = m.ficha || {}; applyBind(document); }
      else if (m.t === 'ficha-local') applyBind(document);
      else if (m.t === 'seek') { if (cur !== m.slide) go(m.slide); seek(document.getElementById(m.id), m.time); }
      else if (m.t === 'pause') pauseIn(slides[cur]);
    });
    carregaPainel(() => { applyBind(document); send({ t: 'ficha', ficha }); });
  }

  /* =============================================================
     MODO APRESENTADOR
     ============================================================= */
  function presenter() {
    document.documentElement.classList.add('is-presenter');
    document.body.classList.add('is-presenter');
    qs('#viewport').style.display = 'none';
    qs('#hud').style.display = 'none';
    qs('#progress').style.display = 'none';
    qsa('video, audio').forEach(v => { v.preload = 'none'; });

    const cum = []; ROT.reduce((a, r, i) => (cum[i] = a + r.min), 0);
    const vidIdx = slides.findIndex(s => s.dataset.video === 'v-zyron');
    const app = document.createElement('div');
    app.className = 'pz';
    app.innerHTML = `
      <header class="pz-top">
        <p class="pz-brand">Jogador de Elite <span>R1 · Modo apresentador</span></p>
        <div class="pz-nav"><button data-a="prev">◀</button><span id="pz-pos">1 / ${N}</span><button data-a="next">▶</button></div>
        <div class="pz-clock"><span id="pz-time">00:00</span><button data-a="timer" id="pz-tbtn">Iniciar</button><button data-a="treset">Zerar</button></div>
        <p class="pz-link" id="pz-link">Conectando ao deck…</p>
      </header>
      <main class="pz-main">
        <section class="pz-left">
          <div class="pz-prev">
            <div><div class="pz-thumb" id="pz-cur"></div><p class="pz-cap">Agora na tela da família</p></div>
            <div><div class="pz-thumb" id="pz-next"></div><p class="pz-cap">Próximo</p></div>
          </div>
          <div class="pz-notes" id="pz-notes"></div>
        </section>
        <aside class="pz-right">
          <nav class="pz-tabs"><button data-tab="ficha" class="on">Ficha da R1</button><button data-tab="obj">Objeções</button><button data-tab="lista">Slides</button></nav>
          <div class="pz-tab on" id="tab-ficha"></div>
          <div class="pz-tab" id="tab-obj"></div>
          <div class="pz-tab" id="tab-lista"></div>
        </aside>
      </main>`;
    document.body.appendChild(app);

    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const fill = s => {
      const d = derived();
      let out = esc(s);
      if (d.nome) out = out.replace(/\[atleta\]/g, '<b class="pz-name">' + esc(d.nome) + '</b>');
      const resp = String(ficha.responsavel || '').trim().split(/\s+/)[0];
      if (resp) out = out.replace(/\[responsável\]/g, '<b class="pz-name">' + esc(resp) + '</b>');
      return out;
    };

    /* notas */
    function renderNotes() {
      const r = ROT[cur] || {};
      const box = qs('#pz-notes');
      const sec = (title, arr, cls) => arr && arr.length ? `<div class="pz-sec ${cls || ''}"><p class="pz-h">${title}</p><ul>${arr.map(x => '<li>' + fill(x) + '</li>').join('')}</ul></div>` : '';
      box.innerHTML = `
        <div class="pz-title"><span>${String(cur + 1).padStart(2, '0')}</span>${esc(r.nome || '')}<em>${r.min ? r.min.toString().replace('.', ',') + ' min · até aqui ' + String(cum[cur]).replace('.', ',') + ' min' : ''}</em></div>
        ${sec('Fale', r.fala)}
        ${sec('Pergunte e espere a resposta', r.perguntas, 'ask')}
        ${sec('Anote na ficha', r.crm, 'crm')}
        ${r.atencao ? `<div class="pz-sec warn"><p class="pz-h">Atenção</p><p>${fill(r.atencao)}</p></div>` : ''}
        ${cur === vidIdx ? chaptersHtml() : ''}
        ${audioHtml()}`;
      qsa('[data-seek]', box).forEach(b => b.addEventListener('click', () => send({ t: 'seek', id: b.dataset.id || 'v-zyron', slide: b.dataset.id ? cur : vidIdx, time: parseFloat(b.dataset.seek) })));
      qsa('[data-pausa]', box).forEach(b => b.addEventListener('click', () => send({ t: 'pause' })));
    }
    // slide com áudio (data-video aponta pra um <audio>): tocar e pausar na tela da família
    function audioHtml() {
      const id = slides[cur].dataset.video, a = id ? document.getElementById(id) : null;
      if (!a || a.tagName !== 'AUDIO') return '';
      return `<div class="pz-sec"><p class="pz-h">Áudio na tela da família (compartilhe a guia com áudio)</p><div class="pz-chips"><button data-seek="0" data-id="${esc(id)}">Tocar do início</button><button data-pausa>Pausar</button></div><p class="pz-small">Espaço no deck também dá play e pausa.</p></div>`;
    }
    function chaptersHtml() {
      const items = qsa('#stage .chapters li').map(li => `<button data-seek="${li.dataset.t}"><b>${esc(qs('.tm', li).textContent)}</b> ${esc(qs('.ct', li).textContent)}</button>`).join('');
      return `<div class="pz-sec"><p class="pz-h">Pular no vídeo (toca na tela da família)</p><div class="pz-chips">${items}</div></div>`;
    }

    function show(i) {
      cur = Math.max(0, Math.min(N - 1, i));
      qs('#pz-pos').textContent = (cur + 1) + ' / ' + N;
      mountThumb(qs('#pz-cur'), cur);
      mountThumb(qs('#pz-next'), cur + 1);
      renderNotes();
      qsa('#tab-lista li').forEach((li, k) => li.classList.toggle('cur', k === cur));
      if (!timerOn && !elapsed && cur > 0) toggleTimer();
    }
    window.addEventListener('resize', () => { mountThumb(qs('#pz-cur'), cur); mountThumb(qs('#pz-next'), cur + 1); });

    /* cronômetro */
    let timerOn = false, elapsed = 0, t0 = 0;
    function tick() {
      const ms = elapsed + (timerOn ? Date.now() - t0 : 0);
      const s = Math.floor(ms / 1000);
      const el2 = qs('#pz-time');
      el2.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
      el2.classList.toggle('late', s > 30 * 60);
    }
    function toggleTimer() {
      if (timerOn) { elapsed += Date.now() - t0; timerOn = false; } else { t0 = Date.now(); timerOn = true; }
      qs('#pz-tbtn').textContent = timerOn ? 'Pausar' : 'Iniciar';
    }
    setInterval(tick, 500);

    app.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'prev') send({ t: 'goto', i: cur - 1 }), show(cur - 1);
      if (b.dataset.a === 'next') send({ t: 'goto', i: cur + 1 }), show(cur + 1);
      if (b.dataset.a === 'timer') toggleTimer();
      if (b.dataset.a === 'treset') { elapsed = 0; timerOn = false; qs('#pz-tbtn').textContent = 'Iniciar'; tick(); }
      if (b.dataset.tab) {
        qsa('.pz-tabs button').forEach(x => x.classList.toggle('on', x === b));
        qsa('.pz-tab').forEach(x => x.classList.toggle('on', x.id === 'tab-' + b.dataset.tab));
      }
    });
    document.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); send({ t: 'goto', i: cur + 1 }); show(cur + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); send({ t: 'goto', i: cur - 1 }); show(cur - 1); }
    });

    /* ficha da R1 */
    const F = [
      ['Personaliza o deck (a família vê)', [
        ['nome', 'Nome do atleta', 'text', 'Aparece nos slides 02, 08, 09 e 15. Só o primeiro nome vai pra tela'],
        ['posicao', 'Posição', 'text', 'Slide 02'], ['idade', 'Idade', 'text', 'Slide 02'], ['cidade', 'Cidade', 'text', 'Slide 02'],
        ['r2dia', 'Dia da R2', 'text', 'Slide 16. Ex.: quinta, 02/10'], ['r2hora', 'Hora da R2', 'text', 'Slide 16. Ex.: 19h30']
      ]],
      ['Contexto do lead (vai pro CRM, não aparece nos slides)', [
        ['origem', 'Origem do lead', 'select', '', ['', 'Zyron', 'Formulário do Instagram', 'Frio, sem vídeo', 'Outro']],
        ['caracteristicas', 'O que chamou atenção no Zyron', 'text', 'Do Contexto do CRM. Ex.: arrancada e cruzamento com o pé bom'],
        ['experiencia', 'Experiência que ele contou no formulário', 'text', 'Do Contexto do CRM. Ex.: Sub-15 do América de Natal']
      ]],
      ['Quem está na call', [
        ['dadosZyron', 'Dados do Zyron (se houver)', 'area'],
        ['responsavel', 'Responsável na call', 'text'], ['pe', 'Pé dominante', 'text'],
        ['pai', 'Pai', 'text'], ['mae', 'Mãe', 'text'], ['outro', 'Outro responsável', 'text']
      ]],
      ['Diagnóstico', [
        ['treina', 'Treina hoje (onde, quantas vezes por semana)', 'text'],
        ['times', 'Times e experiências', 'area'],
        ['peneiras', 'Peneiras e avaliações (quantas, em quais clubes, o que disseram)', 'area'],
        ['observado', 'Se sentiu observado de verdade em quantas', 'text'],
        ['sonho', 'Sonho do atleta', 'text'], ['falta', 'O que ele acha que falta', 'text'],
        ['dor', 'Dor da família (palavras deles)', 'area'],
        ['tipoDor', 'Tipo de dor', 'select', '', ['', 'Financeira', 'Emocional', 'Tempo e idade']],
        ['investido', 'Já investiram (R$ e em quê)', 'text'],
        ['locomocao', 'Locomoção pra outro estado', 'text']
      ]],
      ['Decisão', [
        ['decisores', 'Decisores e como decidem', 'area'], ['telefones', 'Telefones dos decisores', 'text'],
        ['lucro', 'Respondeu "não faz sentido lucrar em cima"', 'check'],
        ['apresentou', 'Apresentou gerente de carreira e Zyron', 'check'],
        ['precomp', 'Pré-compromisso de decidir na R2', 'check'],
        ['missao', 'Missão dada ao atleta', 'check'],
        ['empolgacao', 'Empolgação do atleta (0 a 10)', 'number'],
        ['caso', 'Caso citado', 'text'], ['agn', 'Link da AGN enviado', 'check'],
        ['objecoes', 'Objeções que apareceram', 'area'], ['budget', 'Sinais de budget', 'area'],
        ['confirmados', 'Todos os decisores confirmados na R2', 'check']
      ]]
    ];
    const tf = qs('#tab-ficha');
    tf.innerHTML = '<p class="pz-small" id="pz-painel" hidden></p>' + F.map(([g, fields]) => `<fieldset><legend>${g}</legend>${fields.map(([id, lab, type, hint, opts]) => {
      const v = ficha[id] == null ? '' : ficha[id];
      let input;
      if (type === 'area') input = `<textarea id="f-${id}" rows="2">${esc(v)}</textarea>`;
      else if (type === 'select') input = `<select id="f-${id}">${opts.map(o => `<option${o === v ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
      else if (type === 'check') return `<label class="ck"><input type="checkbox" id="f-${id}"${v ? ' checked' : ''}> ${lab}</label>`;
      else input = `<input id="f-${id}" type="${type === 'number' ? 'number' : 'text'}" value="${esc(v)}"${type === 'number' ? ' min="0" max="10"' : ''}>`;
      return `<label><span>${lab}</span>${input}${hint ? `<small>${hint}</small>` : ''}</label>`;
    }).join('')}</fieldset>`).join('') + `
      <div class="pz-actions"><button id="f-copy">Copiar ficha pro CRM</button><button id="f-clear" class="ghost">Nova call (limpar ficha)</button></div>
      <p class="pz-small">A ficha fica salva só neste navegador. Limpe ao terminar cada call.</p>`;
    const onField = e => {
      const t = e.target; if (!t.id || t.id.indexOf('f-') !== 0) return;
      ficha[t.id.slice(2)] = t.type === 'checkbox' ? t.checked : t.value;
      store.set(FKEY, ficha);
      send({ t: 'ficha', ficha });
      renderNotes();
    };
    tf.addEventListener('input', onField);
    tf.addEventListener('change', onField);
    qs('#f-copy').addEventListener('click', () => {
      const txt = crmText();
      const done = () => { const b = qs('#f-copy'); b.textContent = 'Copiado'; setTimeout(() => { b.textContent = 'Copiar ficha pro CRM'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done));
      else fallbackCopy(txt, done);
    });
    function fallbackCopy(txt, done) {
      const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { alert(txt); }
      ta.remove();
    }
    qs('#f-clear').addEventListener('click', () => {
      if (!confirm('Limpar a ficha desta call? Copie pro CRM antes.')) return;
      ficha = {}; store.set(FKEY, ficha); send({ t: 'ficha', ficha });
      qsa('input,textarea,select', tf).forEach(x => { if (x.type === 'checkbox') x.checked = false; else x.value = ''; });
      renderNotes();
    });
    function crmText() {
      const f = k => { const v = ficha[k]; return v === true ? 'sim' : v === false || v == null || v === '' ? '' : String(v); };
      const sn = k => ficha[k] ? 'sim' : 'não';
      return [
        `Origem: ${f('origem')}`,
        `Dados do Zyron: ${f('dadosZyron')}`,
        `Características que chamaram atenção (Zyron): ${f('caracteristicas')}`,
        `Experiência que ele contou (formulário): ${f('experiencia')}`,
        `Atleta: ${f('nome')}, ${f('idade')}, ${f('posicao')}, pé ${f('pe')}`,
        `Mora em: ${f('cidade')}`,
        `Pai: ${f('pai')} | Mãe: ${f('mae')} | Outro responsável: ${f('outro')}`,
        `Decisores e como decidem: ${f('decisores')}`,
        `Telefones dos decisores: ${f('telefones')}`,
        `Treina hoje: ${f('treina')}`,
        `Times e experiências: ${f('times')}`,
        `Peneiras e avaliações: ${f('peneiras')}`,
        `Se sentiu observado de verdade em: ${f('observado')}`,
        `Sonho do atleta: ${f('sonho')}`,
        `O que ele acha que falta: ${f('falta')}`,
        `Dor da família (palavras deles): ${f('dor')}`,
        `Tipo de dor: ${f('tipoDor')}`,
        `Já investiram: ${f('investido')}`,
        `Locomoção pra outro estado: ${f('locomocao')}`,
        `Respondeu "não faz sentido lucrar em cima"? ${sn('lucro')}`,
        `Apresentou gerente de carreira e Zyron? ${sn('apresentou')}`,
        `Pré-compromisso de decidir na R2? ${sn('precomp')}`,
        `Empolgação do atleta (0 a 10): ${f('empolgacao')}`,
        `Missão dada ao atleta? ${sn('missao')}`,
        `Caso citado: ${f('caso')}`,
        `Link da AGN enviado? ${sn('agn')}`,
        `Objeções que apareceram: ${f('objecoes')}`,
        `Sinais de budget: ${f('budget')}`,
        `R2: ${f('r2dia')} ${f('r2hora')} | Todos os decisores confirmados? ${sn('confirmados')}`
      ].join('\n');
    }

    /* objeções */
    const to = qs('#tab-obj');
    to.innerHTML = '<p class="pz-small">Responda, pule pro slide de socorro e volte. O SDR não negocia e nunca passa preço.</p>' +
      (window.OBJECOES || []).map((o, k) => `<details class="pz-obj"><summary>${esc(o.q)}</summary><ul>${o.resposta.map(r => '<li data-fill="' + k + '">' + esc(r) + '</li>').join('')}</ul>${o.slides.length ? `<div class="pz-chips">${o.slides.map(n => `<button data-go="${n - 1}">Slide ${String(n).padStart(2, '0')} · ${esc(ROT[n - 1] ? ROT[n - 1].nome : '')}</button>`).join('')}</div>` : ''}</details>`).join('');
    to.addEventListener('toggle', e => {
      const d = e.target; if (!d.open) return;
      const k = qs('li', d) ? qs('li', d).dataset.fill : null;
      if (k != null) qsa('li', d).forEach((li, j) => { li.innerHTML = fill(OBJECOES[k].resposta[j]); });
    }, true);

    /* lista de slides */
    const tl = qs('#tab-lista');
    tl.innerHTML = '<ol class="pz-list">' + ROT.map((r, i) => `<li data-go="${i}"><b>${String(i + 1).padStart(2, '0')}</b>${esc(r.nome)}<em>${String(r.min).replace('.', ',')} min</em></li>`).join('') + '</ol>';
    app.addEventListener('click', e => {
      const g = e.target.closest('[data-go]'); if (!g) return;
      const i = parseInt(g.dataset.go, 10); send({ t: 'goto', i }); show(i);
    });

    let linked = false;
    listen(m => {
      if (m.t === 'state') { if (!linked) { linked = true; qs('#pz-link').textContent = 'Deck conectado'; qs('#pz-link').classList.add('ok'); } show(m.i); }
      else if (m.t === 'ficha' || m.t === 'ficha-local') { if (m.ficha) ficha = m.ficha; renderNotes(); }
    });
    const h = parseInt((location.hash || '').replace('#', ''), 10);
    show(Number.isFinite(h) ? h - 1 : 0);
    carregaPainel(() => {
      qsa('#tab-ficha input, #tab-ficha select, #tab-ficha textarea').forEach(el => {
        const k = el.id.slice(2);
        if (el.id.indexOf('f-') === 0 && el.type !== 'checkbox') el.value = ficha[k] == null ? '' : ficha[k];
      });
      renderNotes();
    }, avisoPainel);
    send({ t: 'hello' });
    setTimeout(() => { if (!linked) { qs('#pz-link').textContent = 'Abra o deck pelo botão Apresentador'; } }, 1500);
  }
})();
