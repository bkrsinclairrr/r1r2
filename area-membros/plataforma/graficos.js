/* Área de membros: os gráficos (campo com mapa de calor, linha, rosca, sparkline, formação e a visão do Zyron).
   Cores por papel: gelo = decisão boa e dados, âmbar = a melhorar (par validado: ΔE 21 em visão normal e em daltonismo),
   oliva = concluído, areia = carreira e destaque. O calor vai do azul fundo ao areia e ao creme (claridade só sobe). */
(function (W) {
  'use strict';
  const D = W.D;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => 'u' + Math.random().toString(36).slice(2, 8);
  const C = { ice: '#7FC4EA', am: '#E0A94B', sand: '#C8B88A', sandL: '#E6DBB8', olive: '#9DB06A', muted: '#7F93A8', dim: '#3E4E62', bg: '#060B14', panel: '#0A1422' };

  /* ---------- a dica que acompanha o ponteiro ---------- */
  let tipEl = null;
  const tip = {
    mostra(html, x, y) {
      if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'tip'; document.body.appendChild(tipEl); }
      tipEl.innerHTML = html; tipEl.style.display = 'block';
      const r = tipEl.getBoundingClientRect();
      tipEl.style.left = Math.min(innerWidth - r.width - 8, Math.max(8, x + 14)) + 'px';
      tipEl.style.top = Math.min(innerHeight - r.height - 8, Math.max(8, y + 14)) + 'px';
    },
    some() { if (tipEl) tipEl.style.display = 'none'; }
  };

  /* ---------- o campo (105 x 68 m, ataque pra direita) ---------- */
  const RAMPA = [[0, 31, 74, 107, 0], [.14, 31, 74, 107, .34], [.34, 95, 166, 207, .58], [.58, 200, 184, 138, .82], [.8, 230, 219, 184, .93], [1, 255, 250, 236, 1]];
  function corCalor(v) {
    for (let i = 1; i < RAMPA.length; i++) {
      if (v <= RAMPA[i][0]) { const a = RAMPA[i - 1], b = RAMPA[i], t = (v - a[0]) / (b[0] - a[0]); return [1, 2, 3, 4].map(k => a[k] + (b[k] - a[k]) * t); }
    }
    return RAMPA[RAMPA.length - 1].slice(1);
  }
  function linhasCampo(mini, extra) {
    const sw = mini ? 1 : 1.6, L = ' fill="none" stroke="rgba(200,184,138,.42)" stroke-width="' + sw + '" vector-effect="non-scaling-stroke"';
    return (extra || '') + '<rect x="0" y="0" width="105" height="68"' + L + '/><path d="M52.5 0V68"' + L + '/><circle cx="52.5" cy="34" r="9.15"' + L + '/>' +
      '<rect x="0" y="13.84" width="16.5" height="40.32"' + L + '/><rect x="88.5" y="13.84" width="16.5" height="40.32"' + L + '/>' +
      '<rect x="0" y="24.84" width="5.5" height="18.32"' + L + '/><rect x="99.5" y="24.84" width="5.5" height="18.32"' + L + '/>' +
      '<path d="M16.5 26.68A9.15 9.15 0 0 1 16.5 41.32M88.5 26.68A9.15 9.15 0 0 0 88.5 41.32"' + L + '/>' +
      '<rect x="-1.6" y="30.34" width="1.6" height="7.32"' + L + '/><rect x="105" y="30.34" width="1.6" height="7.32"' + L + '/>' +
      '<circle cx="52.5" cy="34" r=".45" fill="rgba(200,184,138,.6)"/><circle cx="11" cy="34" r=".4" fill="rgba(200,184,138,.6)"/><circle cx="94" cy="34" r=".4" fill="rgba(200,184,138,.6)"/>';
  }
  function gramado(u) {
    let s = '<defs><radialGradient id="' + u + '" cx=".5" cy=".5" r=".72"><stop offset="0" stop-color="#16301F"/><stop offset="1" stop-color="#0B1919"/></radialGradient></defs><rect x="-2" y="-2" width="109" height="72" fill="url(#' + u + ')"/>';
    for (let i = 0; i < 10; i += 2) s += '<rect x="' + (i * 10.5) + '" y="0" width="10.5" height="68" fill="rgba(157,176,106,.05)"/>';
    return s;
  }

  /* o campo com o calor dos lances (camada "calor") ou os lances um a um (camada "lances").
     o: { camada, mini, tercos, anota, rotulos, sigma, tabela } */
  function campo(box, ls, o) {
    o = o || {};
    box.classList.add('pitch');
    const w = box.clientWidth, h = box.clientHeight || w * 72 / 109, u = uid();
    box.innerHTML = '<svg class="pf" viewBox="-2 -2 109 72" aria-hidden="true">' + gramado(u) + '</svg><canvas></canvas>' +
      '<svg class="pl" viewBox="-2 -2 109 72">' + linhasCampo(o.mini, o.tercos ? '<path d="M35 0V68M70 0V68" fill="none" stroke="rgba(127,196,234,.45)" stroke-width="1.4" vector-effect="non-scaling-stroke"/>' : '') + '<g class="mk"></g><g class="an"></g></svg>';
    const cv = box.querySelector('canvas'), fx = w * 2 / 109, fy = h * 2 / 72, fw = w * 105 / 109, fh = h * 68 / 72, dpr = Math.max(2, W.devicePixelRatio || 1);
    cv.style.cssText = 'left:' + fx + 'px;top:' + fy + 'px;width:' + fw + 'px;height:' + fh + 'px;opacity:' + (o.camada === 'lances' ? .5 : 1);
    cv.width = Math.round(fw * dpr); cv.height = Math.round(fh * dpr);
    const GW = 210, GH = 136, g = new Float32Array(GW * GH);
    const sigma = o.sigma || (ls.length < 80 ? 5.2 : ls.length < 220 ? 4.2 : 3.4), sg = sigma / .5, R = Math.ceil(sg * 3), ker = [];
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) ker.push(dx, dy, Math.exp(-(dx * dx + dy * dy) / (2 * sg * sg)));
    ls.forEach(l => {
      const cx = Math.round(l.x / .5), cy = Math.round(l.y / .5);
      for (let i = 0; i < ker.length; i += 3) { const X = cx + ker[i], Y = cy + ker[i + 1]; if (X >= 0 && X < GW && Y >= 0 && Y < GH) g[Y * GW + X] += ker[i + 2]; }
    });
    let max = 0, imax = 0;
    for (let i = 0; i < g.length; i++) if (g[i] > max) { max = g[i]; imax = i; }
    if (max > 0) {
      const off = document.createElement('canvas'); off.width = GW; off.height = GH;
      const oc = off.getContext('2d'), img = oc.createImageData(GW, GH);
      for (let i = 0; i < g.length; i++) { const c = corCalor(Math.pow(g[i] / max, .82)); img.data[i * 4] = c[0]; img.data[i * 4 + 1] = c[1]; img.data[i * 4 + 2] = c[2]; img.data[i * 4 + 3] = Math.round(c[3] * 255); }
      oc.putImageData(img, 0, 0);
      const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(off, 0, 0, cv.width, cv.height);
    }
    const mx = (imax % GW) * .5, my = Math.floor(imax / GW) * .5;
    const px = x => fx + x / 105 * fw, py = y => fy + y / 68 * fh;
    const NS = 'http://www.w3.org/2000/svg';

    if (o.camada === 'lances') {
      const mk = box.querySelector('.mk'), r = o.mini ? 1 : 1.25;
      mk.innerHTML = ls.map(l => l.leitura === 'bom'
        ? '<circle data-i="' + l.id + '" cx="' + l.x + '" cy="' + l.y + '" r="' + r + '" fill="' + C.ice + '" stroke="#06101B" stroke-width="1" vector-effect="non-scaling-stroke"/>'
        : '<circle data-i="' + l.id + '" cx="' + l.x + '" cy="' + l.y + '" r="' + r + '" fill="#06101B" stroke="' + C.am + '" stroke-width="2" vector-effect="non-scaling-stroke"/>').join('');
      box.onpointermove = e => {
        const t = e.target.closest && e.target.closest('[data-i]');
        if (!t) return tip.some();
        const l = D.LANCES[Number(t.dataset.i)], v = D.VIDEOS[l.v];
        tip.mostra('<b>' + esc(l.tipo) + '</b> · ' + (l.leitura === 'bom' ? '<span class="t-ia">decisão boa</span>' : '<span class="t-am">a melhorar</span>') + '<br><span class="t-m">' + esc(v.titulo) + ' · ' + D.ddmm(v.data) + ' · ' + D.mmss(l.t) + '</span>' + (l.nota ? '<br>' + esc(l.nota) : ''), e.clientX, e.clientY);
      };
      box.onpointerleave = () => tip.some();
    }
    if (o.tercos && ls.length) {
      const t = D.terços(ls), nomes = ['Terço defensivo', 'Meio-campo', 'Último terço'], mais = t.indexOf(Math.max.apply(null, t));
      [17.5, 52.5, 87.5].forEach((x, i) => {
        const d = document.createElement('p'); d.className = 'terco' + (i === 2 ? ' alto' : '');
        d.style.left = px(x) + 'px'; d.innerHTML = '<b>' + t[i] + '%</b><span>' + nomes[i] + '</span>'; box.appendChild(d);
      });
    }
    if (o.anota && max > 0 && w >= 520) {
      const sv = box.querySelector('.an');
      [[3.2, 'rgba(127,196,234,.95)', 2.2], [6, 'rgba(127,196,234,.4)', 1.4]].forEach(([r, c, wd]) => {
        const k = document.createElementNS(NS, 'circle'); k.setAttribute('cx', mx); k.setAttribute('cy', my); k.setAttribute('r', r);
        k.setAttribute('fill', 'none'); k.setAttribute('stroke', c); k.setAttribute('stroke-width', wd); k.setAttribute('vector-effect', 'non-scaling-stroke'); sv.appendChild(k);
      });
      const n = document.createElement('div'); n.className = 'nota';
      n.innerHTML = '<p>Zona mais ativa</p><p>' + esc(D.cap(D.nomeZona(mx, my))) + '</p>'; box.appendChild(n);
      const nw = n.offsetWidth, nh = n.offsetHeight, ax = px(mx), ay = py(my);
      let left = ax - nw - 64, top = ay - nh / 2 - 44;
      if (left < fx + 10) left = ax + 64;
      top = Math.max(fy + 40, Math.min(top, fy + fh - nh - 86));
      n.style.left = left + 'px'; n.style.top = top + 'px';
      const ln = document.createElementNS(NS, 'path'), toM = (vx, vy) => [(vx - fx) / fw * 105, (vy - fy) / fh * 68];
      const a = toM(left + (left < ax ? nw : 0), top + nh / 2), b = [mx + (left < ax ? -6 : 6) * .72, my - 6 * .55];
      ln.setAttribute('d', 'M' + a[0].toFixed(2) + ' ' + a[1].toFixed(2) + 'L' + b[0].toFixed(2) + ' ' + b[1].toFixed(2));
      ln.setAttribute('fill', 'none'); ln.setAttribute('stroke', 'rgba(127,196,234,.8)'); ln.setAttribute('stroke-width', 1.6); ln.setAttribute('vector-effect', 'non-scaling-stroke'); sv.appendChild(ln);
    }
    if (o.rotulos) {
      box.insertAdjacentHTML('beforeend', '<p class="ataque">Ataque <svg class="ic"><use href="#i-seta"/></svg></p>' +
        (o.camada === 'lances'
          ? '<p class="escala"><i class="m b"></i>Decisão boa<i class="m a"></i>A melhorar</p>'
          : '<p class="escala">Menos lances<i class="gr"></i>Mais</p>'));
    }
    return { pico: [mx, my] };
  }

  /* ---------- linha: uma série por mês, com cruzamento e dica ----------
     serie: [{ rotulo, valor, n }], o: { min, max, ticks, fmt, fs, pl, pr, pt, pb } */
  function linha(svg, serie, o) {
    o = o || {};
    const w = svg.clientWidth || 600, h = svg.clientHeight || 220, fs = o.fs || 14, pl = o.pl || 44, pr = o.pr || 70, pt = o.pt || 18, pb = o.pb || 32;
    const lo = o.min != null ? o.min : 50, hi = o.max != null ? o.max : 80, ticks = o.ticks || [50, 60, 70, 80], fmt = o.fmt || (v => v + '%');
    const x = i => pl + i * (w - pl - pr) / Math.max(1, serie.length - 1), y = v => pt + (hi - v) * (h - pt - pb) / (hi - lo);
    const u = uid();
    let s = '<defs><linearGradient id="' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(127,196,234,.24)"/><stop offset="1" stop-color="rgba(127,196,234,0)"/></linearGradient></defs>';
    ticks.forEach(v => {
      s += '<line x1="' + pl + '" x2="' + (w - pr + 14) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="rgba(200,214,232,' + (v === lo ? '.2' : '.08') + ')" stroke-width="1"/>' +
        '<text x="' + (pl - 10) + '" y="' + y(v) + '" text-anchor="end" dominant-baseline="central" font-family="Barlow Condensed" font-weight="600" font-size="' + fs + '" fill="' + C.muted + '">' + fmt(v) + '</text>';
    });
    const pts = serie.map((p, i) => [x(i), y(p.valor)]);
    const d = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
    s += '<path d="' + d + 'L' + x(serie.length - 1).toFixed(1) + ' ' + y(lo) + 'L' + pl + ' ' + y(lo) + 'Z" fill="url(#' + u + ')"/>' +
      '<path d="' + d + '" fill="none" stroke="' + C.ice + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
    s += '<line class="cx" x1="0" x2="0" y1="' + pt + '" y2="' + (h - pb) + '" stroke="rgba(200,214,232,.35)" stroke-width="1" style="display:none"/>';
    pts.forEach((p, i) => {
      const ult = i === pts.length - 1;
      s += '<circle class="pt" data-i="' + i + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (ult ? 6 : 4.5) + '" fill="' + C.ice + '" stroke="#0B1626" stroke-width="2.5"/>' +
        '<text x="' + p[0] + '" y="' + (h - pb + 22) + '" text-anchor="middle" font-family="Barlow Condensed" font-weight="600" font-size="' + fs + '" letter-spacing="1.5" fill="' + (ult ? C.sandL : C.muted) + '">' + esc(serie[i].rotulo.toUpperCase()) + '</text>';
    });
    const ul = pts[pts.length - 1];
    s += '<text x="' + (ul[0] + 14) + '" y="' + (ul[1] + 1) + '" dominant-baseline="central" font-family="Saira Condensed" font-weight="800" font-size="' + Math.round(fs * 1.9) + '" fill="#fff">' + fmt(serie[serie.length - 1].valor) + '</text>';
    s += '<rect class="hit" x="' + pl + '" y="0" width="' + (w - pl - pr + 20) + '" height="' + h + '" fill="transparent"/>';
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h); svg.innerHTML = s;
    const hit = svg.querySelector('.hit'), cx = svg.querySelector('.cx');
    const ponto = e => { const r = svg.getBoundingClientRect(), px = (e.clientX - r.left) * (w / r.width); let b = 0; pts.forEach((p, i) => { if (Math.abs(p[0] - px) < Math.abs(pts[b][0] - px)) b = i; }); return b; };
    hit.addEventListener('pointermove', e => {
      const i = ponto(e), p = serie[i];
      cx.setAttribute('x1', pts[i][0]); cx.setAttribute('x2', pts[i][0]); cx.style.display = '';
      tip.mostra('<span class="t-m">' + esc(p.rotulo.toUpperCase()) + '</span><br><b class="tv">' + fmt(p.valor) + '</b> ' + (o.rot || 'decisões boas') + (p.n ? '<br><span class="t-m">' + p.n + ' lances lidos</span>' : ''), e.clientX, e.clientY);
    });
    hit.addEventListener('pointerleave', () => { cx.style.display = 'none'; tip.some(); });
  }

  /* sparkline: só a forma, com o último ponto marcado */
  function spark(svg, vals, o) {
    o = o || {};
    const w = svg.clientWidth || 100, h = svg.clientHeight || 32, p = 4, mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), r = mx - mn || 1;
    const x = i => p + i * (w - 2 * p) / (vals.length - 1), y = v => p + (mx - v) * (h - 2 * p) / r;
    const d = 'M' + vals.map((v, i) => x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join('L');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.innerHTML = '<path d="' + d + '" fill="none" stroke="' + (o.cor || C.ice) + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="' + x(vals.length - 1) + '" cy="' + y(vals[vals.length - 1]) + '" r="3.2" fill="' + (o.cor || C.ice) + '" stroke="#0A1422" stroke-width="2"/>';
  }

  /* rosca: o que foi bom (gelo) e o que fica pra melhorar (âmbar), com respiro entre os dois */
  function rosca(box, bons, n, o) {
    o = o || {};
    const S = o.tam || 180, r = S / 2 - 14, c = 2 * Math.PI * r, gap = n > 1 && bons > 0 && bons < n ? 6 : 0, sw = o.espessura || 16;
    const fb = Math.max(0, c * bons / n - gap), fa = Math.max(0, c * (n - bons) / n - gap);
    const p = n >= 10 ? Math.round(100 * bons / n) : null;
    box.style.width = S + 'px'; box.style.height = S + 'px';
    box.innerHTML = '<svg viewBox="0 0 ' + S + ' ' + S + '" aria-hidden="true"><circle cx="' + S / 2 + '" cy="' + S / 2 + '" r="' + r + '" fill="none" stroke="rgba(200,214,232,.08)" stroke-width="' + sw + '"/>' +
      '<circle cx="' + S / 2 + '" cy="' + S / 2 + '" r="' + r + '" fill="none" stroke="' + C.am + '" stroke-width="' + sw + '" stroke-dasharray="' + fa.toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(' + (-90 + 360 * bons / n + (gap / c) * 180) + ' ' + S / 2 + ' ' + S / 2 + ')"/>' +
      '<circle cx="' + S / 2 + '" cy="' + S / 2 + '" r="' + r + '" fill="none" stroke="' + C.ice + '" stroke-width="' + sw + '" stroke-dasharray="' + fb.toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(' + (-90 + (gap / c) * 180) + ' ' + S / 2 + ' ' + S / 2 + ')"/></svg>' +
      '<div class="rm"><b>' + bons + '<small> de ' + n + '</small></b>' + (p != null ? '<span>' + p + '%</span>' : '') + '</div>';
  }

  /* ---------- a formação 4-3-3 (vertical), com o atleta em destaque ---------- */
  const XY = { CA: [.5, .15], ALE: [.17, .25], ADD: [.83, .25], MC: [.5, .44], 'VOL-e': [.25, .58], 'VOL-d': [.75, .58], LE: [.12, .76], 'ZAG-e': [.37, .8], 'ZAG-d': [.63, .8], LD: [.88, .76], GOL: [.5, .93] };
  function formacao(box, posId, nome) {
    const CW = 360, CH = 520, m = 12, iw = CW - 2 * m, ih = CH - 2 * m, u = uid(), sx = iw / 68, sy = ih / 105, f1 = v => v.toFixed(1);
    const X = f => f1(m + f * iw), Y = f => f1(m + f * ih), L = ' fill="none" stroke="rgba(200,184,138,.4)" stroke-width="1.6"';
    let s = '<svg viewBox="0 0 ' + CW + ' ' + CH + '" aria-hidden="true"><defs><linearGradient id="' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14261F"/><stop offset="1" stop-color="#0D1A1B"/></linearGradient></defs><rect width="' + CW + '" height="' + CH + '" rx="10" fill="url(#' + u + ')"/>';
    for (let i = 0; i < 10; i += 2) s += '<rect x="' + m + '" y="' + f1(m + i * ih / 10) + '" width="' + iw + '" height="' + f1(ih / 10) + '" fill="rgba(157,176,106,.04)"/>';
    s += '<rect x="' + m + '" y="' + m + '" width="' + iw + '" height="' + ih + '"' + L + '/><line x1="' + m + '" y1="' + Y(.5) + '" x2="' + (CW - m) + '" y2="' + Y(.5) + '"' + L + '/><circle cx="' + X(.5) + '" cy="' + Y(.5) + '" r="' + f1(9.15 * sx) + '"' + L + '/>';
    [[m, 1], [CH - m, -1]].forEach(([gy, d]) => {
      const pa = 16.5 * sy, ga = 5.5 * sy;
      s += '<rect x="' + f1(m + iw / 2 - 20.15 * sx) + '" y="' + f1(d > 0 ? gy : gy - pa) + '" width="' + f1(40.3 * sx) + '" height="' + f1(pa) + '"' + L + '/><rect x="' + f1(m + iw / 2 - 9.15 * sx) + '" y="' + f1(d > 0 ? gy : gy - ga) + '" width="' + f1(18.3 * sx) + '" height="' + f1(ga) + '"' + L + '/>';
    });
    Object.keys(XY).forEach(id => {
      const [fx, fy] = XY[id], me = id === posId, cx = m + fx * iw, cy = m + fy * ih, sg = id.split('-')[0];
      if (me) {
        s += '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="38" fill="none" stroke="rgba(127,196,234,.28)" stroke-width="2"/><circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="30" fill="none" stroke="' + C.ice + '" stroke-width="3"/><circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="24" fill="' + C.sand + '"/>' +
          '<text x="' + f1(cx) + '" y="' + f1(cy) + '" text-anchor="middle" dominant-baseline="central" font-family="Barlow Condensed" font-weight="700" font-size="22" letter-spacing="1" fill="' + C.bg + '">' + sg + '</text>';
      } else {
        s += '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="20" fill="' + C.panel + '" stroke="rgba(127,147,168,.55)" stroke-width="2"/><text x="' + f1(cx) + '" y="' + f1(cy) + '" text-anchor="middle" dominant-baseline="central" font-family="Barlow Condensed" font-weight="600" font-size="16" letter-spacing=".5" fill="#8FA2B5">' + sg + '</text>';
      }
    });
    const me = XY[posId];
    if (me) {
      const cx = m + me[0] * iw, cy = m + me[1] * ih, w = String(nome).length * 11 + 28;
      s += '<g><rect x="' + f1(cx - w / 2) + '" y="' + f1(cy - 78) + '" width="' + f1(w) + '" height="30" rx="6" fill="' + C.bg + '" stroke="' + C.sand + '" stroke-width="1.6"/><text x="' + f1(cx) + '" y="' + f1(cy - 63) + '" text-anchor="middle" dominant-baseline="central" font-family="Saira Condensed" font-weight="800" font-size="19" fill="' + C.sandL + '">' + esc(String(nome).toUpperCase()) + '</text></g>';
    }
    box.innerHTML = s + '</svg>';
  }

  /* ---------- a visão do Zyron: o jogo visto de cima, com o atleta marcado no lance ---------- */
  const FORM_A = [[6, 34], [26, 10], [22, 26], [22, 42], [26, 58], [38, 20], [40, 34], [38, 48], [60, 12], [64, 34], [60, 56]]; // 4-3-3 atacando pra direita (o 7º, na linha do meio, é o atleta)
  const FORM_B = [[99, 34], [80, 10], [84, 26], [84, 42], [80, 58], [68, 14], [70, 28], [70, 42], [68, 54], [52, 24], [52, 44]]; // 4-4-2 atacando pra esquerda
  function visaoZyron(box, l, o) {
    o = o || {};
    const w = box.clientWidth, h = box.clientHeight || w * 72 / 109, u = uid(), r = D.rng(l.id * 31 + 7);
    const bx = l.x, by = l.y, dx = (bx - 52) * .32, dy = (by - 34) * .25;
    const jit = () => (r() - .5) * 3.2;
    const A = FORM_A.map(([x, y], i) => i === 6 ? [bx, by] : [Math.max(2, Math.min(103, x + dx + jit())), Math.max(2, Math.min(66, y + dy * .6 + jit()))]);
    const B = FORM_B.map(([x, y]) => [Math.max(2, Math.min(103, x + dx * .8 + jit())), Math.max(2, Math.min(66, y + dy * .6 + jit()))]);
    const ang = r() * .8 - .4, trail = [[bx - 9 * Math.cos(ang) - 3, by - 9 * Math.sin(ang)], [bx - 4.5, by - 4 * Math.sin(ang)], [bx, by]];
    const ball = [bx + 1.6, by + .8];
    const bom = l.leitura === 'bom', cor = bom ? C.ice : C.am;
    let s = '<svg viewBox="-2 -2 109 72" aria-hidden="true">' + gramado(u) + '<g>' + linhasCampo(true) + '</g>';
    B.forEach(p => { s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="1.05" fill="rgba(127,147,168,.55)"/>'; });
    A.forEach((p, i) => { if (i !== 6) s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="1.15" fill="#CFE8F6" fill-opacity=".85"/>'; });
    s += '<path d="M' + trail.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + '" fill="none" stroke="' + C.sand + '" stroke-width="1.2" stroke-linecap="round" stroke-opacity=".75" vector-effect="non-scaling-stroke"/>';
    s += '<circle cx="' + ball[0].toFixed(1) + '" cy="' + ball[1].toFixed(1) + '" r=".8" fill="#fff"/>';
    s += '<circle cx="' + bx + '" cy="' + by + '" r="1.8" fill="' + C.sand + '" stroke="' + C.bg + '" stroke-width=".5"/>';
    const q = 4.2, k = 1.6; // colchetes em volta do atleta
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { s += '<path d="M' + (bx + sx * q) + ' ' + (by + sy * (q - k)) + 'L' + (bx + sx * q) + ' ' + (by + sy * q) + 'L' + (bx + sx * (q - k)) + ' ' + (by + sy * q) + '" fill="none" stroke="' + cor + '" stroke-width="1.8" vector-effect="non-scaling-stroke"/>'; });
    const tx = Math.min(Math.max(bx, 14), 88), ty = by > 14 ? by - 6.6 : by + 8.6;
    s += '<g><rect x="' + (tx - 11) + '" y="' + (ty - 2.1) + '" width="22" height="4.2" rx=".8" fill="' + C.bg + '" fill-opacity=".9" stroke="' + cor + '" stroke-width=".35"/><text x="' + tx + '" y="' + ty + '" text-anchor="middle" dominant-baseline="central" font-family="Barlow Condensed" font-weight="700" font-size="2.7" letter-spacing=".15" fill="#fff">' + esc(o.rotulo || 'FERNANDO SILVA · 8') + '</text></g>';
    box.innerHTML = s + '</svg>';
  }

  W.G = { tip, campo, linha, spark, rosca, formacao, visaoZyron, esc, uid, C };
})(window);
