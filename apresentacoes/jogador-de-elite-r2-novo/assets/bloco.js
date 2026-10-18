/* Bloco Voxen | Zyron (17/10/2026): o motor dos slides novos trazidos da /institucional.
   So dois movimentos precisam de script: o campo (olhometro x IA, 22 jogadores e a bola) e o contador do 326.
   O resto (barras, radar, cadeia, faixas de escudos, mosaico) e CSS ligado ao .active e ao data-step do deck.
   O que roda so roda no slide ativo do palco (#stage): as miniaturas e o apresentador sao copias estaticas.

   Chaves (todas reversiveis):
   - window.BLOCO.numeros: false por padrao. As regras da casa proibem nota, atributo e percentual de acerto na tela;
     com true, voltam a velocidade de cada jogador no campo, os numeros das barras e o percentual do radar.
   - window.BLOCO.animar = false, ou ?bloco=estatico na URL, ou "reduzir movimento" no aparelho: tudo parado, so o quadro final. */
(function () {
  'use strict';
  var B = window.BLOCO = window.BLOCO || {};
  if (B.numeros === undefined) B.numeros = false;
  var raiz = document.documentElement;
  var reduz = false;
  try { reduz = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* sem matchMedia */ }
  var estatico = /[?&]bloco=estatico\b/.test(location.search);
  if (estatico) raiz.classList.add('bl-estatico');
  if (B.numeros) raiz.classList.add('bl-numeros');
  var anima = function () { return B.animar !== false && !reduz && !estatico; };

  /* ---------------- campo: 4-3-3 contra 4-4-2 (campo 1000 x 640) ---------------- */
  var CASA = [[70, 320], [210, 130], [200, 260], [200, 380], [210, 510], [350, 190], [330, 320], [350, 450], [470, 140], [500, 320], [470, 500]];
  var FORA = [[930, 320], [790, 140], [800, 265], [800, 375], [790, 500], [650, 120], [640, 260], [640, 380], [650, 520], [560, 250], [560, 390]];
  var BASE = CASA.concat(FORA);
  var FASE = BASE.map(function (_, i) { return i * 1.7; });
  var SVGNS = 'http://www.w3.org/2000/svg';

  function campo(slide) {
    var svg = slide.querySelector('.bl-pitch-svg');
    if (!svg) return null;
    var jog = [].slice.call(svg.querySelectorAll('.bl-pl'));
    var bola = svg.querySelector('.bl-bola');
    var foco = svg.querySelector('.bl-foco');
    var conta = slide.querySelector('.bl-conta strong');
    var vels = [];
    if (B.numeros) {
      jog.forEach(function (g) {
        var t = document.createElementNS(SVGNS, 'text');
        t.setAttribute('class', 'bl-pl-vel'); t.setAttribute('y', '-30'); t.setAttribute('text-anchor', 'middle'); t.textContent = '12 km/h';
        g.appendChild(t); vels.push(t);
      });
    }
    var s = { portador: 9, prox: 6, passe: 0, fx: 500, fy: 320, ultimo: -1, raf: 0, t0: 0, antes: 0, velT: 0 };

    function pos(i, t) {
      var b = BASE[i], d = (i === 0 || i === 11) ? 8 : 26;
      return [b[0] + Math.sin(t * 0.6 + FASE[i]) * d, b[1] + Math.cos(t * 0.45 + FASE[i] * 1.3) * d * 0.8];
    }
    var modoIA = function () { return slide.classList.contains('bl-ia'); };

    function quadro(agora, dt) {
      var t = (agora - s.t0) / 1000;
      // a bola passa entre jogadores do mesmo time a cada ~1,6 s, e de vez em quando a posse troca de time
      s.passe += dt / 1.6;
      if (s.passe >= 1) {
        s.passe = 0; s.portador = s.prox;
        var time = ((s.portador < 11) !== (Math.random() < 0.18)) ? 0 : 11;
        do { s.prox = time + 1 + Math.floor(Math.random() * 10); } while (s.prox === s.portador);
      }
      var a = pos(s.portador, t), c = pos(s.prox, t);
      var e = s.passe < 0.55 ? 0 : (s.passe - 0.55) / 0.45;
      var bx = a[0] + (c[0] - a[0]) * e, by = a[1] + (c[1] - a[1]) * e;
      bola.setAttribute('cx', bx.toFixed(1)); bola.setAttribute('cy', by.toFixed(1));
      // o olhar humano chega atrasado na bola
      var k = 1 - Math.pow(0.95, dt * 60);
      s.fx += (bx - s.fx) * k; s.fy += (by - s.fy) * k;
      foco.setAttribute('cx', s.fx.toFixed(1)); foco.setAttribute('cy', s.fy.toFixed(1));
      var ia = modoIA(), vistos = 0;
      jog.forEach(function (g, i) {
        var p = pos(i, t);
        g.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')');
        var aceso = ia || Math.hypot(p[0] - s.fx, p[1] - s.fy) < 120;
        if (aceso) vistos++;
        g.classList.toggle('lit', aceso);
      });
      if (vistos !== s.ultimo && conta) { s.ultimo = vistos; conta.textContent = String(vistos); }
      if (B.numeros && ia && agora - s.velT > 450) {
        s.velT = agora;
        vels.forEach(function (tx, i) { tx.textContent = (6 + Math.abs(Math.sin(t * 0.8 + FASE[i])) * 20).toFixed(0) + ' km/h'; });
      }
    }

    function laco(agora) {
      var dt = Math.min(0.1, Math.max(0, (agora - s.antes) / 1000)); s.antes = agora;
      quadro(agora, dt);
      s.raf = requestAnimationFrame(laco);
    }
    return {
      liga: function () {
        cancelAnimationFrame(s.raf);
        s.t0 = performance.now(); s.antes = s.t0; s.passe = 0; s.portador = 9; s.prox = 6; s.fx = 500; s.fy = 320; s.ultimo = -1;
        if (anima()) s.raf = requestAnimationFrame(laco); else quadro(s.t0 + 1200, 0.016);
      },
      desliga: function () { cancelAnimationFrame(s.raf); s.raf = 0; },
      // o avanco (data-step) mudou o modo: no quadro parado, redesenha na hora
      modo: function () { if (!s.raf) { s.ultimo = -1; quadro(s.t0 + 1200, 0.016); } }
    };
  }

  /* ---------------- contador (326) ---------------- */
  function contadores(slide, entrando) {
    [].forEach.call(slide.querySelectorAll('[data-bl-conta]'), function (el) {
      var alvo = parseInt(el.getAttribute('data-bl-conta'), 10) || 0;
      el.__bl = (el.__bl || 0) + 1;
      var id = el.__bl;
      if (!entrando || !anima()) { el.textContent = String(alvo); return; }
      var t0 = performance.now(), dur = 2000;
      el.textContent = '0';
      (function passo(agora) {
        if (el.__bl !== id) return;
        var k = Math.min(1, (agora - t0) / dur);
        el.textContent = String(Math.round(alvo * (1 - Math.pow(1 - k, 4))));
        if (k < 1) requestAnimationFrame(passo);
      })(t0);
      // janela escondida pausa o rAF: o numero certo entra mesmo assim
      setTimeout(function () { if (el.__bl === id) el.textContent = String(alvo); }, dur + 120);
    });
  }

  /* ---------------- ligacao com o palco ---------------- */
  var motores = new Map();
  function motorDe(slide) {
    if (!motores.has(slide)) motores.set(slide, slide.getAttribute('data-bl') === 'campo' ? campo(slide) : null);
    return motores.get(slide);
  }

  /* O campo tem dois botoes (olhometro e IA) no mesmo slide: o clique troca o modo (classe bl-ia no slide, que o CSS le).
     Abre sempre no olhometro. data-bl-auto="7000" (R1, que a pessoa nao conduz por avanco) vira sozinho pra IA nesse tempo,
     como a institucional, se ninguem clicou. */
  var timers = new Map();
  function defineModo(slide, ia, clicou) {
    slide.classList.toggle('bl-ia', ia);
    [].forEach.call(slide.querySelectorAll('[data-bl-modo]'), function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-bl-modo') === 'ia') === ia)); });
    if (clicou) { slide.__blToque = true; (timers.get(slide) || []).forEach(clearTimeout); timers.delete(slide); }
    var m = motorDe(slide); if (m) m.modo();
  }
  function botoes(slide) {
    if (slide.__blBotoes) return;
    slide.__blBotoes = true;
    [].forEach.call(slide.querySelectorAll('[data-bl-modo]'), function (b) {
      b.addEventListener('click', function () { defineModo(slide, b.getAttribute('data-bl-modo') === 'ia', true); b.blur(); });
    });
  }
  function auto(slide, entrando) {
    if (slide.getAttribute('data-bl') !== 'campo') return;
    botoes(slide);
    (timers.get(slide) || []).forEach(clearTimeout); timers.delete(slide);
    slide.__blToque = false;
    defineModo(slide, false, false);
    var cfg = slide.getAttribute('data-bl-auto');
    if (entrando && cfg && anima()) timers.set(slide, [setTimeout(function () { if (!slide.__blToque) defineModo(slide, true, false); }, parseInt(cfg, 10) || 7000)]);
  }

  function entra(slide) {
    auto(slide, true);
    var m = motorDe(slide); if (m) m.liga();
    contadores(slide, true);
  }
  function sai(slide) {
    auto(slide, false);
    var m = motorDe(slide); if (m) m.desliga();
    contadores(slide, false);
  }

  function inicia() {
    var palco = document.getElementById('stage');
    if (!palco) return;
    var obs = new MutationObserver(function (lista) {
      var trocou = new Set(), avancou = new Set();
      lista.forEach(function (r) {
        var alvo = r.target;
        if (!alvo.closest) return;
        var s = alvo.classList.contains('bl-slide') ? alvo : alvo.closest('.bl-slide');
        if (!s || !palco.contains(s)) return;
        if (s === alvo) {
          // so conta se o 'active' mudou (o clique do campo muda a classe bl-ia do slide e nao pode reiniciar nada)
          var antes = /(^| )active( |$)/.test(r.oldValue || '');
          var agora = alvo.classList.contains('active');
          if (!antes && agora) trocou.add(s); else if (antes && !agora && !trocou.has(s)) trocou.add(s);
        } else avancou.add(s);
      });
      trocou.forEach(function (s) { if (s.classList.contains('active')) entra(s); else sai(s); });
      avancou.forEach(function (s) { if (!trocou.has(s)) { var m = motorDe(s); if (m) m.modo(); } });
    });
    obs.observe(palco, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    [].forEach.call(palco.querySelectorAll('.bl-slide'), function (s) { if (s.classList.contains('active')) entra(s); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(inicia, 0); });
  else setTimeout(inicia, 0);
})();
