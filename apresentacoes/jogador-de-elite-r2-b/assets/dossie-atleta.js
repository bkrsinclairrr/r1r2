/* O dossiê do atleta e o inimigo em comum (pedido do dono, 18/10/2026): os dois slides logo depois da IA na Prática, nos três decks
   do R2 (o R2 novo, o R2 B e o R2 anterior, com as variações). Este arquivo e o dossie-atleta.css são iguais nos três decks.
   O dossiê: o nome em cima da foto e os dados embaixo dela (à esquerda), o vídeo que a IA fez com a análise no centro, com o mapa de
   calor embaixo, e à direita as oportunidades que a equipe mapeou, com o plano de carreira. O vídeo e o mapa só entram com "Tenho o
   vídeo do jogador" ligado no painel; as oportunidades, com clubes na lista. Sem nada disso (ou na apresentação sem nome nem foto), as
   setas passam direto pelo dossiê (data-so-se="dsMostra" no slide). O plano de carreira fica no lugar que sobrar: embaixo das
   oportunidades, sozinho à direita ou no centro.
   O inimigo em comum: o avaliador que não olha todo mundo, e o tempo e o dinheiro que a família contou no painel (peneiras, gasto e
   anos tentando). Sem os números, o quadro mostra a conta sem números: nada é inventado.
   Tudo que vem do painel entra escapado. O vídeo, o quadro dele e o mapa que não carregam somem da tela, sem ícone quebrado.
   Desde 20/10/2026: o mapa de calor também pode vir da lista do painel (ficha.mapaCalor, o id da posição): o SVG sai do mapa-calor.js, sem
   arquivo, e o subtítulo diz a verdade ("onde atua um zagueiro": é o mapa típico da posição, não um dado do jogo dele). O arquivo enviado
   antes, quando existe, tem prioridade. E o vídeo segue a proporção dele (largura e altura vêm do painel; sem elas, do próprio vídeo quando
   carrega): deitado, a largura do centro; quadrado ou em pé, mais alto e centralizado; em pé com o mapa, o mapa vai pro lado, com o campo em
   pé. Na IA na Prática, a caixa do vídeo encolhe na largura pra caber o vídeo em pé inteiro (antes ele saía cortado). */
(function () {
  'use strict';
  const str = v => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // a prévia do painel (o link ainda não foi gerado) leva a chave em todo pedido ao painel: o foto-atleta.js é quem sabe dela
  const comChave = u => (window.FotoAtleta && window.FotoAtleta.comChave ? window.FotoAtleta.comChave(u) : u);
  const falhas = new Set();
  let ultimo = null;

  /* as oportunidades do painel: "Clube~detalhe|Clube~detalhe" (o painel já limpa: até 6, sem tag, sem clube repetido) */
  function oportunidades(texto) {
    return str(texto).split('|').map(p => {
      const i = p.indexOf('~');
      return i < 0 ? { clube: p.trim(), detalhe: '' } : { clube: p.slice(0, i).trim(), detalhe: p.slice(i + 1).trim() };
    }).filter(o => o.clube).slice(0, 6);
  }
  // a sigla do escudo: as iniciais das duas primeiras palavras que contam (sem "de", "da", "do" e sem FC, EC, Clube...)
  const FORA_DA_SIGLA = ['de', 'da', 'do', 'das', 'dos', 'e', 'fc', 'ec', 'sc', 'ac', 'cf', 'cr', 'se', 'aa', 'ca', 'clube', 'club', 'futebol', 'esporte', 'associacao', 'sociedade'];
  function sigla(clube) {
    const p = str(clube).normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^A-Za-z0-9]+/).filter(Boolean);
    const conta = p.filter(x => FORA_DA_SIGLA.indexOf(x.toLowerCase()) < 0);
    return (conta.length ? conta : p).slice(0, 2).map(x => x[0].toUpperCase()).join('');
  }
  const inteiro = (v, max) => { const s = str(v); const n = /^\d+$/.test(s) ? parseInt(s, 10) : 0; return n > 0 && n <= max ? n : 0; };
  const brl = n => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
  const maiuscula = s => (s ? s[0].toUpperCase() + s.slice(1) : s); // meia vira Meia (o resto como o painel escreveu)

  window.DossieAtleta = {
    oportunidades, sigla,
    /* f: a ficha; d: os dados que o deck já montou (nome, idade, pé, altura, posição); aid e painel: o código do link e o painel dele.
       O vídeo e o mapa saem do painel pelo código (sem link, no teste com a ficha gravada à mão, de _video.src e _mapa.src) */
    derivados(f, d, aid, painel) {
      const semNome = str(f.nomeTela) === 'sem';
      const comVideo = str(f.temVideo) === 'sim' && !semNome;
      const ok = u => !!u && !falhas.has(u);
      const vid = comVideo && f._video && typeof f._video === 'object' && f._video.ok ? f._video : null;
      const vsrc = vid ? (aid ? comChave(painel + '/api/video?t=' + encodeURIComponent(aid)) : str(vid.src)) : '';
      const psrc = vid && vid.temPoster ? (aid ? comChave(painel + '/api/video?t=' + encodeURIComponent(aid) + '&poster=1') : str(vid.posterSrc)) : '';
      const mp = comVideo && f._mapa && typeof f._mapa === 'object' && f._mapa.ok ? f._mapa : null;
      const mv = mp ? parseInt(mp.versao, 10) || 0 : 0;
      const msrc = mp ? (aid ? (mv ? comChave(painel + '/api/foto?t=' + encodeURIComponent(aid) + '&v=mapa&n=' + mv) : '') : str(mp.src)) : '';
      // o mapa da lista (a posição que o closer escolheu no painel); o arquivo enviado antes, quando carrega, vale mais
      const MC = window.MapaCalor;
      const mid = comVideo && MC && MC.temId(str(f.mapaCalor)) && !ok(msrc) ? str(f.mapaCalor) : '';
      const ops = semNome ? [] : oportunidades(f.oportunidades);
      const V = ok(vsrc), M = ok(msrc) || !!mid, O = ops.length > 0;
      // a proporção do vídeo (largura sobre altura): do painel; sem ela, a que o vídeo mostrou quando carregou
      const vv = f._video && typeof f._video === 'object' ? f._video : null;
      const ar = vv && vv.largura > 0 && vv.altura > 0 ? vv.largura / vv.altura : (vistos[vsrc] || 0);
      const r = {
        dsV: V ? '1' : '', dsM: M ? '1' : '', dsO: O ? '1' : '',
        dsMostra: !semNome && (V || M || O) ? '1' : '',
        dsVideoSrc: V ? vsrc : '', dsPosterUrl: V && ok(psrc) ? psrc : '', dsMapaUrl: M && !mid ? msrc : '', dsMapaId: mid,
        // o subtítulo do mapa: o da lista diz de que posição ele é (verdade); o arquivo de antes segue com o texto de sempre
        dsMapaSub: '· ' + (mid ? MC.sub(mid) : 'onde o seu jogo acontece'),
        dsAr: ar,
        // o plano de carreira: no centro, quando só tem as oportunidades; senão, à direita (embaixo delas, ou sozinho)
        dsPlanoCentro: !V && !M ? '1' : '', dsPlanoLado: V || M ? '1' : '',
        dsNome: str(d.nomeAssinatura || d.nome),
        dsOps: ops,
        dsDados: [
          ['Posição', maiuscula(str(f.posicao))],
          ['Idade', d.idade ? d.idade + ' anos' : ''],
          ['Altura', str(d.alturaTxt)],
          ['Pé', str(d.peTxt)],
          ['Categoria', str(f.categoria)],
          ['Onde joga', str(f.clubeAtual)],
          ['Cidade', str(f.cidade)]
        ].filter(x => x[1]).slice(0, 6),
        dsResumo: !semNome && (V || M || O) ? [V ? 'vídeo analisado' : '', M ? 'mapa de calor' : '', O ? ops.length + (ops.length === 1 ? ' oportunidade' : ' oportunidades') : ''].filter(Boolean).join(', ') : ''
      };
      // o título do dossiê segue o que está na tela
      r.dsTitulo1 = V || M ? (O ? 'O seu jogo, lido.' : 'O seu jogo,') : 'Onde o seu jogo';
      r.dsTitulo2 = V || M ? (O ? 'Os caminhos, mapeados.' : 'como nenhuma peneira viu.') : 'pode encaixar.';
      // o inimigo em comum: o tempo e o dinheiro que a família contou (vazio: o quadro sem números)
      const pen = inteiro(f.peneirasFeitas, 200), gasto = inteiro(f.gastoPeneiras, 5000000), anos = inteiro(f.anosTentando, 30);
      Object.assign(r, {
        inPeneiras: pen ? String(pen) : '', inPeneirasK: pen === 1 ? 'peneira feita' : 'peneiras feitas',
        inGasto: gasto ? brl(gasto) : '', inGastoK: 'gastos em peneiras',
        inAnos: anos ? String(anos) : '', inAnosK: anos === 1 ? 'ano tentando' : 'anos tentando',
        inNumeros: pen || gasto || anos ? '1' : '',
        // a fala do apresentador: [nº de peneiras], [gasto com peneiras], [anos tentando]
        inPeneirasTxt: pen ? pen + (pen === 1 ? ' peneira' : ' peneiras') : '', inAnosTxt: anos ? anos + (anos === 1 ? ' ano' : ' anos') : ''
      });
      return r;
    },
    /* o que não dá pra fazer só com data-bind: as listas, o nome em até duas linhas e o vídeo do dossiê (som, erro, espaço do teclado) */
    atualiza(root, d) {
      ultimo = d;
      const ar = d.dsAr > 0 ? d.dsAr : 0;
      ajustaIA(ar);
      root.querySelectorAll('.ds-slide').forEach(s => {
        s.classList.toggle('ds-com-v', !!d.dsV);
        s.classList.toggle('ds-com-m', !!d.dsM);
        // a proporção do vídeo: em pé (mais alto que largo) e quadrado mudam o desenho do centro
        const emPe = !!d.dsV && ar > 0 && ar < .8, quadrado = !!d.dsV && ar >= .8 && ar < 1.25;
        s.classList.toggle('ds-em-pe', emPe);
        s.classList.toggle('ds-quadrado', quadrado);
        const pl = s.querySelector('.ds-player');
        if (pl) {
          if (ar > 0) { pl.style.setProperty('--ds-ar', String(ar)); pl.style.setProperty('--ds-arn', ar.toFixed(4)); }
          else { pl.style.removeProperty('--ds-ar'); pl.style.removeProperty('--ds-arn'); }
        }
        // o mapa da lista: o SVG do mapa-calor.js (em pé quando o vídeo em pé deixa o mapa do lado)
        const caixa = s.querySelector('.ds-mapa-img');
        if (caixa) {
          let alvo = caixa.querySelector('.ds-mapa-svg');
          const chave = d.dsMapaId && window.MapaCalor ? d.dsMapaId + (emPe ? ':v' : ':h') : '';
          if (chave && !alvo) { alvo = document.createElement('div'); alvo.className = 'ds-mapa-svg'; caixa.appendChild(alvo); }
          if (alvo && alvo.dataset.chave !== chave) {
            alvo.dataset.chave = chave;
            alvo.innerHTML = chave ? window.MapaCalor.svg(d.dsMapaId, { vertical: emPe }) : '';
          }
          caixa.classList.toggle('com-svg', !!chave);
        }
        s.classList.toggle('ds-com-o', !!d.dsO);
        s.classList.toggle('ds-muitas', (d.dsOps || []).length >= 5); // cinco ou seis clubes: o plano ao lado fica mais curto
        // o vídeo do dossiê é o vídeo do slide (o espaço dá play e pausa) só quando ele está na tela
        if (d.dsV) s.dataset.video = 'v-dossie'; else delete s.dataset.video;
        const ops = d.dsOps || [], dados = d.dsDados || [];
        const kOps = JSON.stringify(ops), kDados = JSON.stringify(dados);
        const lista = s.querySelector('[data-ds="ops"]');
        if (lista && lista.dataset.feito !== kOps) {
          lista.dataset.feito = kOps;
          lista.classList.toggle('ds-compacto', ops.length >= 5);
          lista.innerHTML = ops.map(o => '<li><span class="ds-escudo" aria-hidden="true"><svg viewBox="0 0 56 64"><path d="M28 2 L53 10 V30 C53 46 42 56 28 62 C14 56 3 46 3 30 V10 Z"/></svg><b>' +
            esc(sigla(o.clube)) + '</b></span><div class="ds-op-t"><p class="ds-clube">' + esc(o.clube) + '</p>' + (o.detalhe ? '<p class="ds-det">' + esc(o.detalhe) + '</p>' : '') + '</div></li>').join('');
        }
        const dl = s.querySelector('[data-ds="dados"]');
        if (dl && dl.dataset.feito !== kDados) {
          dl.dataset.feito = kDados;
          dl.innerHTML = dados.map(x => '<div><p class="k">' + esc(x[0]) + '</p><p class="v">' + esc(x[1]) + '</p></div>').join('');
        }
        // o nome em cima da foto: até duas linhas; encolhe até 32 px antes de passar disso
        const nm = s.querySelector('.ds-nome');
        if (nm) {
          nm.style.fontSize = '';
          const base = parseFloat(getComputedStyle(nm).fontSize) || 56, lh = parseFloat(getComputedStyle(nm).lineHeight) || base;
          let fs = base;
          for (let i = 0; i < 24 && fs * .94 >= 32 && (nm.scrollHeight > lh / base * fs * 2 + 2 || nm.scrollWidth > nm.clientWidth + 1); i++) { fs *= .94; nm.style.fontSize = fs.toFixed(1) + 'px'; }
        }
        const v = s.querySelector('video[data-src="dsVideoSrc"]');
        if (v) ouveProporcao(v);
        if (v && !v.dataset.dsLigado) {
          v.dataset.dsLigado = '1';
          const pl = v.closest('.player');
          const marca = () => { if (pl) pl.classList.toggle('com-som', !v.muted); };
          const som = pl && pl.querySelector('.som');
          if (som) som.addEventListener('click', () => { v.muted = !v.muted; marca(); });
          v.addEventListener('volumechange', marca);
          v.addEventListener('error', () => {
            const u = v.getAttribute('src');
            if (!u || falhas.has(u)) return;
            falhas.add(u); try { v.pause(); } catch (e) { /* nada */ }
            window.dispatchEvent(new Event('je-dossie'));
          });
        }
      });
      // o mapa e o quadro do vídeo que não carregam: somem (um ouvinte por imagem)
      root.querySelectorAll('img[data-src="dsMapaUrl"], img[data-src="dsPosterUrl"]').forEach(img => {
        if (img.dataset.dsErro) return;
        img.dataset.dsErro = '1';
        img.addEventListener('error', () => { const u = img.getAttribute('src'); if (u && !falhas.has(u)) { falhas.add(u); window.dispatchEvent(new Event('je-dossie')); } });
      });
      root.querySelectorAll('video[data-poster="dsPosterUrl"]').forEach(v => {
        if (d.dsPosterUrl && falhas.has(d.dsPosterUrl)) v.removeAttribute('poster');
      });
      // o inimigo em comum: os números do quadro contam do zero quando o slide entra na tela (só no palco, uma vez por entrada)
      root.querySelectorAll('.in-slide').forEach(s => {
        s.querySelectorAll('[data-conta]').forEach(b => { b.dataset.alvo = str(d[b.dataset.conta]); });
        const nums = s.querySelector('.in-nums'); if (nums) nums.classList.toggle('in-um', !!d.inPeneiras !== !!d.inAnos);
        if (s.dataset.contaLigada || !s.parentElement || s.parentElement.id !== 'stage' || typeof MutationObserver !== 'function') return;
        s.dataset.contaLigada = '1';
        let estava = s.classList.contains('active');
        new MutationObserver(() => {
          const agora = s.classList.contains('active');
          if (agora && !estava) conta(s);
          estava = agora;
        }).observe(s, { attributes: true, attributeFilter: ['class'] });
      });
    }
  };
  /* a proporção que o vídeo mostrou quando carregou (o vídeo de antes de 20/10/2026 não tem largura e altura no painel): guarda pelo endereço
     e redesenha uma vez. Vale pro vídeo do dossiê e pro da IA na Prática */
  const vistos = {};
  function ouveProporcao(v) {
    if (v.dataset.dsAr) return;
    v.dataset.dsAr = '1';
    v.addEventListener('loadedmetadata', () => {
      const u = v.getAttribute('src');
      if (!u || !(v.videoWidth > 0 && v.videoHeight > 0) || vistos[u]) return;
      vistos[u] = v.videoWidth / v.videoHeight;
      if (ultimo && !(ultimo.dsAr > 0)) window.dispatchEvent(new Event('je-dossie'));
    });
  }
  /* a IA na Prática (o vídeo dele lance a lance): a caixa do player tem 16:9 marcado na página. Com o vídeo em pé, ela encolhe na largura, no
     mesmo lugar e centralizada, pro vídeo caber inteiro (o player do deck corta o que sobra); os cantos (.brackets) acompanham. Sem proporção,
     a caixa de sempre */
  function ajustaIA(ar) {
    const p = document.getElementById('p-atleta');
    if (!p) return;
    const v = p.querySelector('video');
    if (v) ouveProporcao(v);
    const proporcao = ar > 0 ? ar : (v && vistos[v.getAttribute('src')]) || 0;
    const br = p.nextElementSibling && p.nextElementSibling.classList.contains('brackets') ? p.nextElementSibling : null;
    if (!p.dataset.caixa) p.dataset.caixa = ['left', 'top', 'width', 'height'].map(k => parseFloat(p.style[k]) || 0).join(',');
    const [l, t, w, h] = p.dataset.caixa.split(',').map(Number);
    if (!w || !h) return;
    const larg = proporcao > 0 ? Math.min(w, Math.round(h * proporcao)) : w, esq = l + Math.round((w - larg) / 2);
    [p, br].forEach(e => { if (e) { e.style.left = esq + 'px'; e.style.width = larg + 'px'; } });
    p.classList.toggle('ia-proporcao', proporcao > 0);
  }
  /* a contagem: de 0 ao número da família em 1,2 s, com o formato dele (R$ 4.800, 6, 3). "Reduzir movimento": o número já pronto */
  let reduz = false;
  try { reduz = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* sem matchMedia */ }
  function conta(s) {
    if (reduz) return;
    s.querySelectorAll('[data-conta]').forEach(b => {
      const alvo = str(b.dataset.alvo), n = parseInt(alvo.replace(/\D/g, ''), 10);
      if (!alvo || !Number.isFinite(n) || n <= 0) return;
      const fmt = /^R\$/.test(alvo) ? v => brl(v) : v => String(v);
      const t0 = performance.now() + 420, dur = 1200;
      b.textContent = fmt(0);
      const passo = t => {
        if (str(b.dataset.alvo) !== alvo || !s.classList.contains('active')) { b.textContent = str(b.dataset.alvo); return; }
        const k = Math.max(0, Math.min(1, (t - t0) / dur)), e = 1 - Math.pow(1 - k, 3);
        b.textContent = k >= 1 ? alvo : fmt(Math.round(n * e));
        if (k < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
  }
  // o tamanho do nome depende da fonte: refaz quando ela termina de carregar e quando o slide da vez muda
  window.addEventListener('hashchange', () => requestAnimationFrame(() => { if (ultimo) window.DossieAtleta.atualiza(document, ultimo); }));
  if (document.fonts) document.fonts.ready.then(() => { if (ultimo) window.DossieAtleta.atualiza(document, ultimo); });
})();
