/* Jogador de Elite · Deck R2 (Gestor de Carreiras)
   Modo família (a tela compartilhada) e modo apresentador (?presenter), sincronizados.
   Vinte e quatro slides, na ordem da Bíblia das Vendas (processo-r2): conexão (capa com o inimigo comum, por que você),
   a dor (04, o olhômetro), o plano (05, com o tripé), o bloco do Zyron (06 a 09: e se, Zyron, vídeo, cinco verbos), o seu lugar
   em campo (10, o campo e o cartão do atleta), olhômetro contra Zyron (11), o que ninguém mais tem, IA na Prática (13, a leitura ao
   vivo), o depoimento de uma mãe (14, áudio), nem tudo é talento, AGN, valor real (revelado item a item), até lá a gente investe,
   o filtro e a escada do sim, contrato, garantia, a vaga (o começo, fora do Legacy), os planos (23), o investimento do plano da
   ficha (24, o número e o Silêncio) e boas-vindas (25, com a miniatura do campo). Três planos (window.PLANOS, roteiro.js): o da
   ficha muda o 23, o 24 e o 25, e turma e vaga só aparecem no Legacy. Sem link de pagamento no deck. Elementos com data-step
   aparecem um avanço por vez. A leitura do atleta (13): com o vídeo dele no painel (?a=<id>), o 13 mostra o vídeo, o nome e o
   relatório que o Gestor deixou pronto (relatorio-leitura.js); sem vídeo, painel fora do ar ou vídeo que não carrega, o 13 de
   sempre, com a leitura ao vivo no Meet, sem erro na tela da família (o apresentador é que fica sabendo). */
(function () {
  'use strict';
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const isPresenter = /[?&]presenter\b/.test(location.search);
  const slides = qsa('#stage > .slide');
  const N = slides.length;
  const ROT = window.ROTEIRO || [];
  const AID = (new URLSearchParams(location.search).get('a') || '').trim();
  const FKEY = window.R2_PERSONAL ? 'je-r2-dossie-ficha-' + (AID || 'exemplo') : 'je-r2-ficha' + (AID ? '-' + AID : '');
  const SILENCE_SLIDE = slides.findIndex(s => s.id === 'silencio');
  const VAGA = SILENCE_SLIDE; // slide do número: Silêncio, "fale o número e pare" e o fechamento
  const TURMA = slides.findIndex(s => s.querySelector('#turma')); // a vaga (turma de 10, só no Legacy; nos outros, o começo)
  const MATRIZ = slides.findIndex(s => s.id === 'planos' || s.hasAttribute('data-oferta')); // os planos: os três com o investimento de cada um, e o da ficha destacado no último avanço

  /* <dados> da operação: vazios contam como vazios e nunca viram texto na tela */
  const DADOS = { gerente: '', analista: '', prazoContato: '', prazoZyron: '', faixaContrato: 'R$ 20 a 30 mil+', linkAgn: '', duracao: 50 };
  const ORIGENS = ['', 'Zyron', 'Formulário do Instagram', 'Frio, sem vídeo', 'Outro'];

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ } }
  };
  let ficha = store.get(FKEY, {});
  // link do painel (?a=<id>): outro atleta começa com a ficha limpa, antes de qualquer coisa ir pra tela
  if (AID && ficha._a !== AID) { ficha = { _a: AID }; store.set(FKEY, ficha); }
  let cur = 0, curStep = null;
  // o vídeo ou o quadro do atleta não carregou: o 13 volta pra leitura ao vivo e a capa pro desenho, sem erro na tela
  let videoFalhou = false, posterFalhou = false;

  /* ---------------- dados derivados ---------------- */
  const filled = v => v === true || (typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && v.trim() !== '');
  const str = v => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v));
  /* os três planos (window.PLANOS, roteiro.js), do degrau de baixo pro de cima. O da ficha é o que a tela mostra;
     vazio ou nome antigo (de antes dos três planos) vira o Legacy, e a ficha salva no navegador continua funcionando */
  const PLANOS = (window.PLANOS || []).filter(p => p && p.id);
  const PLANO_PADRAO = PLANOS.find(p => p.id === 'legacy') || PLANOS[PLANOS.length - 1] || null;
  // o nome de hoje ou um nome de antes do mesmo plano (antigos: o Scouting PRO virou Assessoria PRO)
  const planoPorNome = nome => PLANOS.find(p => p.nome === str(nome) || (p.antigos || []).includes(str(nome))) || null;
  const planoDe = nome => planoPorNome(nome) || PLANO_PADRAO;
  const comArtigo = p => (p.artigo || 'o') + ' ' + (p.curto || p.nome); // a Assessoria PRO, o Legacy
  const doPlano = p => (p.artigo === 'a' ? 'da ' : 'do ') + p.nome; // Tudo da Assessoria PRO, Tudo do Scouting
  // na ficha salva (no navegador ou no painel), o nome de antes vira o de hoje, e o select do apresentador acha o plano
  const nomeDeHoje = f => ['plano', 'planoFechado'].forEach(k => { const p = f[k] && planoPorNome(f[k]); if (p) f[k] = p.nome; });
  nomeDeHoje(ficha);
  const cap = k => k[0].toUpperCase() + k.slice(1);
  /* a posição da ficha (texto livre do painel) no campo do 10: caixa baixa, sem acento, e a primeira linha de
     window.CAMPO_POSICOES (roteiro.js) que casar. ZAG e VOL têm dois marcadores: com "esquerdo" ou "esquerda" no texto,
     o da esquerda; sem lado, o da direita. Não casou: vazio, e o campo fica sem destaque (nunca chuta posição) */
  const semAcento = s => str(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[-_/.,;:()]+/g, ' ').replace(/\s+/g, ' ').trim();
  function posicaoNoCampo(txt) {
    const t = semAcento(txt);
    if (!t) return '';
    const tem = termo => (' ' + t + ' ').indexOf(' ' + termo + ' ') >= 0;
    const regra = (window.CAMPO_POSICOES || []).find(([termos, , exato]) => termos.some(x => (exato ? t === x : tem(x))));
    if (!regra) return '';
    const id = regra[1];
    if (id === 'ZAG' || id === 'VOL') return id + (tem('esquerdo') || tem('esquerda') ? '-e' : '-d');
    return id;
  }
  // pé e altura, só pro cartão do 10: o que não dá pra ler com certeza não aparece
  function peTxt(v) {
    const t = semAcento(v);
    if (!t) return '';
    if (/\b(destro|destra|direito|direita)\b/.test(t)) return 'Destro';
    if (/\b(canhoto|canhota|esquerdo|esquerda)\b/.test(t)) return 'Canhoto';
    if (/\b(ambidestro|ambidestra|ambos|os dois)\b/.test(t)) return 'Ambidestro';
    const s = str(v);
    return s.length > 20 ? '' : s[0].toUpperCase() + s.slice(1);
  }
  // altura em centímetros (178) ou em metros (1,78); fora de 100 a 230 cm, não aparece
  function alturaTxt(v) {
    const n = parseFloat(str(v).replace(',', '.').replace(/[^\d.]/g, ''));
    if (!Number.isFinite(n)) return '';
    const cm = n < 3 ? Math.round(n * 100) : Math.round(n);
    return cm >= 100 && cm <= 230 ? (cm / 100).toFixed(2).replace('.', ',') + ' m' : '';
  }
  function derived() {
    const d = {};
    Object.keys(ficha).forEach(k => { d[k] = typeof ficha[k] === 'boolean' ? ficha[k] : str(ficha[k]); });
    ['gerente', 'analista', 'prazoContato', 'prazoZyron', 'faixaContrato', 'linkAgn'].forEach(k => { if (!filled(d[k])) d[k] = DADOS[k]; });
    d.nome = str(ficha.nome).split(/\s+/)[0] || '';
    d.nomeUp = d.nome.toUpperCase();
    const idade = parseInt(str(ficha.idade), 10);
    d.idade = Number.isFinite(idade) ? String(idade) : '';
    d.idadeMais1 = Number.isFinite(idade) ? String(idade + 1) : '';
    d.posicaoMin = str(ficha.posicao).toLowerCase();
    d.posicaoUp = str(ficha.posicao).toUpperCase();
    d.posId = posicaoNoCampo(ficha.posicao); // o marcador do atleta no campo (10 e 25): GOL, LD, ZAG-d, VOL-e...
    d.posCampo = d.posId ? str(ficha.posicao) + ' (' + d.posId.split('-')[0] + ')' : '';
    d.peTxt = peTxt(ficha.pe);
    d.alturaTxt = alturaTxt(ficha.altura);
    // o código do dossiê: os 8 caracteres finais do id do painel (?a=<id>), em caixa alta. É só o registro dele, nunca vaga ou fila
    const aid = AID || str(ficha._a);
    d.dossieCod = aid ? aid.replace(/[^A-Za-z0-9]/g, '').slice(-8).toUpperCase() : '';
    d.dossieNo = d.dossieCod ? 'Nº ' + d.dossieCod : '';
    // a leitura do atleta (13): o vídeo e o relatório que o painel guardou (ficha._video e ficha._leitura, do carregaPainel).
    // Com o link do painel, o vídeo sai de /api/video; sem ele (teste com a ficha gravada à mão), de _video.src
    const vid = ficha._video && typeof ficha._video === 'object' ? ficha._video : null;
    const vidOk = !!(vid && vid.ok);
    d.videoSrc = vidOk ? (aid ? painelDoLead + '/api/video?id=' + encodeURIComponent(aid) : str(vid.src)) : '';
    d.posterUrl = vidOk && vid.temPoster ? (aid ? painelDoLead + '/api/video?id=' + encodeURIComponent(aid) + '&poster=1' : str(vid.posterSrc)) : '';
    d.videoOk = d.videoSrc && !videoFalhou ? '1' : '';
    d.posterOk = d.posterUrl && !posterFalhou ? '1' : '';
    const RL = window.RelatorioLeitura;
    const lei = RL && d.videoOk ? RL.derivados(ficha._leitura, vid.duracaoS, d.trabalhar) : null;
    d.leituraOk = lei && lei.n && lei.leitura.origem ? '1' : '';
    d.leituraFonte = d.leituraOk ? lei.leitura.origem : '';
    d.leituraResumo = d.videoOk ? 'vídeo: sim' + (d.leituraOk ? ', ' + lei.n + ' lances, fonte ' + (lei.leitura.origem === 'zyron' ? 'Zyron' : 'equipe') : ', sem leitura') : '';
    const origem = str(ficha.origem);
    d.origemZyron = origem === 'Zyron' ? '1' : '';
    d.origemForm = origem.indexOf('Formulário') === 0 ? '1' : '';
    d.origemOutro = !d.origemZyron && !d.origemForm ? '1' : '';
    const v = parseInt(str(ficha.vagas), 10);
    d.vagasN = Number.isFinite(v) && v >= 1 && v <= 10 ? v : 0;
    d.vagas = d.vagasN ? String(d.vagasN) : '';
    d.vagasFrase2 = d.vagasN === 1 ? 'resta 1 vaga.' : d.vagasN ? 'restam ' + d.vagasN + ' vagas.' : '';
    // plano da ficha: planoId (scouting, pro ou legacy), os textos dele e as premissas (planoTurma, planoGarantia,
    // planoContrato, planoAncora, planoRetorno), que ligam e desligam partes da tela com data-if
    const pl = planoDe(ficha.plano) || {};
    d.planoId = str(pl.id);
    d.planoNome = str(pl.nome);
    ['descritor', 'promessa', 'ritmo', 'preco', 'parcela', 'rotulo', 'relacao', 'bemVindo', 'rotina', 'proximo'].forEach(k => { d['plano' + cap(k)] = str(pl[k]); });
    ['turma', 'garantia', 'contrato', 'ancora', 'retorno'].forEach(k => { d['plano' + cap(k)] = pl[k] ? '1' : ''; });
    d.planoSelo = str(pl.selo || pl.descritor); // o papel no cartão do 25, sem conta de preço
    d.planoExtras = Array.isArray(pl.extras) && pl.extras.length ? '1' : '';
    // cada plano, pra matriz do 23 e o tripé do 05: data-bind="pro.descritor", "legacy.ritmo", "scouting.passo"...
    PLANOS.forEach(p => ['nome', 'curto', 'descritor', 'ritmo', 'preco', 'parcela', 'passo'].forEach(k => { d[p.id + '.' + k] = str(p[k]); }));
    // o rótulo da parte de cada plano no 23: o primeiro degrau tem tudo, vitalício; os outros, tudo do degrau de baixo, mais
    PLANOS.forEach((p, i) => { d[p.id + '.mais'] = i ? 'Tudo ' + doPlano(PLANOS[i - 1]) + ', mais' : 'Vitalício, você tem'; });
    if (window.R2_PERSONAL) Object.assign(d, window.R2_PERSONAL.derivados(ficha, d, aid, painelDoLead));
    if (window.FotoAtleta) Object.assign(d, window.FotoAtleta.derivados(ficha, d, AID, painelDoLead));
    return d;
  }

  /* condição: a|b (qualquer), a&b (todos), !a (negação), k=v (igualdade) */
  function cond(expr, d) {
    return expr.split('|').some(any => any.split('&').every(t => {
      t = t.trim(); let neg = false;
      if (t[0] === '!') { neg = true; t = t.slice(1); }
      let r;
      if (t.indexOf('=') > 0) { const [k, val] = t.split('='); r = filled(d[k]) && String(d[k]) === val; }
      else r = filled(d[t]);
      return neg ? !r : r;
    }));
  }

  const posLabel = i => (i + 1) + ' / ' + N;
  /* revelação item a item: elementos com data-step="n" aparecem um avanço de cada vez */
  // só conta o que está ligado na tela (data-if, data-ifnot): o 13 só tem avanços quando a leitura veio do painel
  const ligado = e => !e.closest('[data-if]:not(.on), [data-ifnot].off');
  const stepsIn = i => (i >= 0 && i < N ? qsa('[data-step]', slides[i]).filter(ligado).reduce((m, e) => Math.max(m, parseInt(e.dataset.step, 10) || 0), 0) : 0);
  // data-soma mostra a soma dos data-valor já revelados (sobe a cada avanço); data-marca="n" ganha destaque a partir do passo n
  const brl = v => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
  const somaAte = (root, n) => qsa('[data-step][data-valor]', root).filter(e => n == null || (parseInt(e.dataset.step, 10) || 0) <= n).reduce((t, e) => t + (parseFloat(e.dataset.valor) || 0), 0);
  function contaAte(el, alvo) {
    const de = parseFloat(el.dataset.atual);
    el.dataset.atual = alvo;
    let reduz = false; try { reduz = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* sem matchMedia */ }
    if (!el.isConnected || !Number.isFinite(de) || de === alvo || reduz) { el.textContent = brl(alvo); return; }
    const t0 = performance.now(), dur = 500;
    const passo = t => {
      if (String(el.dataset.atual) !== String(alvo)) return; // outro avanço já mudou o alvo
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = brl(de + (alvo - de) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
    // janela escondida ou coberta pausa a animação: o valor certo entra mesmo assim
    setTimeout(() => { if (String(el.dataset.atual) === String(alvo)) el.textContent = brl(alvo); }, dur + 80);
  }
  function showSteps(root, n) {
    qsa('[data-step]', root).forEach(e => e.classList.toggle('shown', n == null || (parseInt(e.dataset.step, 10) || 0) <= n));
    qsa('[data-marca]', root).forEach(e => e.classList.toggle('marcado', n == null || n >= (parseInt(e.dataset.marca, 10) || 0)));
    qsa('[data-soma]', root).forEach(e => contaAte(e, somaAte(root, n)));
  }
  slides.forEach((s, i) => {
    const c = document.createElement('div'); c.className = 'counter';
    c.innerHTML = '<b>' + String(i + 1).padStart(2, '0') + '</b> / ' + String(N).padStart(2, '0');
    s.appendChild(c);
    s.dataset.title = ROT[i] ? ROT[i].nome : 'Slide ' + (i + 1);
  });

  /* ---------------- desenhos ---------------- */
  let uidN = 0;
  const uid = () => 'u' + (++uidN) + '_';
  function dossierClosed() {
    const u = uid();
    return '<svg viewBox="0 0 900 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs>' +
      '<linearGradient id="' + u + 'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#17273E"/><stop offset="1" stop-color="#0A121E"/></linearGradient>' +
      '<linearGradient id="' + u + 'k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F1C2E"/><stop offset="1" stop-color="#080E17"/></linearGradient>' +
      '<filter id="' + u + 'g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="26"/></filter>' +
      '<filter id="' + u + 's" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="6"/></filter></defs>' +
      '<ellipse cx="450" cy="604" rx="410" ry="40" fill="#000" opacity=".65" filter="url(#' + u + 's)"/>' +
      '<rect x="96" y="112" width="708" height="468" rx="16" fill="none" stroke="#E6DBB8" stroke-width="34" opacity=".3" filter="url(#' + u + 'g)"/>' +
      '<path d="M104 150 H372 L402 112 H788 a16 16 0 0 1 16 16 V564 a16 16 0 0 1 -16 16 H120 a16 16 0 0 1 -16 -16 Z" fill="url(#' + u + 'k)"/>' +
      '<rect x="112" y="158" width="676" height="412" rx="10" fill="#F1E9CF" opacity=".24" filter="url(#' + u + 's)"/>' +
      '<rect x="100" y="170" width="700" height="410" rx="14" fill="url(#' + u + 'b)" stroke="rgba(230,219,184,.32)" stroke-width="1.5"/>' +
      '<path d="M116 171 H784" stroke="#E6DBB8" stroke-opacity=".65" stroke-width="2"/>' +
      '<rect x="170" y="280" width="450" height="164" rx="6" fill="#0A1422" stroke="#C8B88A" stroke-opacity=".75" stroke-width="1.5"/>' +
      '<text x="200" y="330" font-family="Barlow Condensed" font-weight="600" font-size="26" letter-spacing="6" fill="#C8B88A">DOSSIÊ DO ATLETA</text>' +
      '<text x="198" y="400" font-family="Saira Condensed" font-weight="800" font-size="66" fill="#FFFFFF" data-bind="nomeUp" data-fit-svg="390"></text>' +
      '<text x="200" y="432" font-family="Barlow Condensed" font-weight="600" font-size="26" letter-spacing="4" fill="#7F93A8" data-bind="dossieNo"></text>' +
      '<g transform="rotate(-8 566 226)"><rect x="472" y="196" width="188" height="60" rx="4" fill="rgba(6,11,20,.55)" stroke="#9DB06A" stroke-width="3"/><text x="566" y="237" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="32" letter-spacing="5" fill="#9DB06A">APROVADO</text></g>' +
      '<rect x="664" y="170" width="20" height="410" fill="#C8B88A" opacity=".85"/><rect x="664" y="170" width="4" height="410" fill="#F1E9CF" opacity=".6"/>' +
      '</svg>';
  }
  qsa('[data-dossier="closed"]').forEach(el => { el.innerHTML = dossierClosed(); });

  /* o campo (data-campo="cheio" no 10, "mini" no 25): formação 4-3-3 ilustrativa, vista de cima, com o ataque pra cima.
     O atleta (posId) vem preenchido em areia, com anel gelo estático e o nome num chip; os outros marcadores ficam apagados
     (aço sobre navy). Nenhum jogador, escudo ou clube. Sem posição reconhecida: o 10 fica sem destaque, com "O seu lugar entra
     aqui.", e o 25 esconde a miniatura (data-if="posId"). Na miniatura, os outros marcadores viram pontos, sem sigla. */
  const CAMPO_XY = { CA: [.5, .15], ALE: [.17, .25], ADD: [.83, .25], MC: [.5, .42], 'VOL-e': [.27, .56], 'VOL-d': [.73, .56],
    LE: [.12, .73], 'ZAG-e': [.37, .78], 'ZAG-d': [.63, .78], LD: [.88, .73], GOL: [.5, .92] };
  const CW = 500, CH = 773;
  function campoSvg(posId, mini, nome) {
    const u = uid(), m = 14, iw = CW - 2 * m, ih = CH - 2 * m, sx = iw / 68, sy = ih / 105;
    const n1 = v => v.toFixed(1), X = f => n1(m + f * iw), Y = f => n1(m + f * ih);
    const L = 'fill="none" stroke="rgba(200,184,138,.35)" stroke-width="' + (mini ? 3 : 2) + '"';
    const sigla = id => id.split('-')[0];
    let s = '<svg viewBox="0 0 ' + CW + ' ' + CH + '" aria-hidden="true"><defs><linearGradient id="' + u + 'g" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#14261F"/><stop offset="1" stop-color="#0D1A1B"/></linearGradient></defs>' +
      '<rect width="' + CW + '" height="' + CH + '" rx="6" fill="url(#' + u + 'g)"/>';
    for (let i = 0; i < 10; i += 2) s += '<rect x="' + m + '" y="' + n1(m + i * ih / 10) + '" width="' + iw + '" height="' + n1(ih / 10) + '" fill="rgba(157,176,106,.04)"/>';
    s += '<rect x="' + m + '" y="' + m + '" width="' + iw + '" height="' + ih + '" ' + L + '/>' +
      '<line x1="' + m + '" y1="' + Y(.5) + '" x2="' + (CW - m) + '" y2="' + Y(.5) + '" ' + L + '/>' +
      '<circle cx="' + X(.5) + '" cy="' + Y(.5) + '" r="' + n1(9.15 * sx) + '" ' + L + '/>';
    [[m, 1], [CH - m, -1]].forEach(([gy, d]) => {
      const pa = 16.5 * sy, ga = 5.5 * sy;
      s += '<rect x="' + n1(m + iw / 2 - 20.15 * sx) + '" y="' + n1(d > 0 ? gy : gy - pa) + '" width="' + n1(40.3 * sx) + '" height="' + n1(pa) + '" ' + L + '/>' +
        '<rect x="' + n1(m + iw / 2 - 9.15 * sx) + '" y="' + n1(d > 0 ? gy : gy - ga) + '" width="' + n1(18.3 * sx) + '" height="' + n1(ga) + '" ' + L + '/>';
    });
    const r = mini ? 14 : 33;
    Object.keys(CAMPO_XY).filter(id => id !== posId).forEach(id => {
      const [fx, fy] = CAMPO_XY[id];
      s += '<circle cx="' + X(fx) + '" cy="' + Y(fy) + '" r="' + r + '" fill="#0A1422" stroke="rgba(127,147,168,.6)" stroke-width="2"/>';
      if (!mini) s += '<text x="' + X(fx) + '" y="' + Y(fy) + '" text-anchor="middle" dominant-baseline="central" font-family="Barlow Condensed" font-weight="600" font-size="25" letter-spacing="1" fill="#8FA2B5">' + sigla(id) + '</text>';
    });
    // o chip do nome (ou o aviso sem posição): o ajustaChips acerta a largura depois que o nome entra
    const chip = (cx, cy, fs, txt, nome) => '<g class="chip" data-cx="' + n1(cx) + '"><rect x="' + n1(cx - 90) + '" y="' + n1(cy - fs * .75) + '" width="180" height="' + n1(fs * 1.5) + '" rx="4" fill="#060B14" stroke="#C8B88A" stroke-width="2"/>' +
      '<text x="' + n1(cx) + '" y="' + n1(cy) + '" text-anchor="middle" dominant-baseline="central" font-family="Saira Condensed" font-weight="800" font-size="' + fs + '" fill="#E6DBB8"' +
      (nome ? ' data-bind="nomeUp" data-fb="VOCÊ" data-fit-svg="' + (CW - 60) + '"' : '') + '>' + esc(txt) + '</text></g>';
    if (posId && CAMPO_XY[posId]) {
      const [fx, fy] = CAMPO_XY[posId], cx = m + fx * iw, cy = m + fy * ih, R = mini ? 40 : 38, fs = mini ? 64 : 40;
      s += '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + (R + 24) + '" fill="none" stroke="rgba(127,196,234,.28)" stroke-width="2"/>' +
        '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + (R + 12) + '" fill="none" stroke="#7FC4EA" stroke-width="3"/>' +
        '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + R + '" fill="#C8B88A"/>' +
        '<text x="' + n1(cx) + '" y="' + n1(cy) + '" text-anchor="middle" dominant-baseline="central" font-family="Barlow Condensed" font-weight="700" font-size="' + (mini ? 44 : 28) + '" letter-spacing="1" fill="#060B14">' + sigla(posId) + '</text>';
      // o nome embaixo do marcador; se ali ele cobre outro marcador, em cima, à direita ou à esquerda (vale o lugar que cobre
      // menos, nessa ordem de preferência). Cada lugar é puxado pra dentro do campo antes de contar, e cobrir o marcador do
      // próprio atleta (e o anel dele) nunca vale: com nome e sobrenome o rótulo é largo e, na ponta ou no gol, não cabe do lado
      const gap = R + 30 + fs * .75, hw = (String(nome || 'VOCÊ').length * fs * .5 + fs) / 2, hh = fs * .75, lado = R + 20 + hw;
      const dentro = ([x, y]) => [Math.max(8 + hw, Math.min(CW - 8 - hw, x)), Math.max(8 + hh, Math.min(CH - 8 - hh, y))];
      const cobre = ([x, y]) => {
        const px = Math.max(0, hw + R + 24 - Math.abs(cx - x)), py = Math.max(0, hh + R + 24 - Math.abs(cy - y));
        return (px > 0 && py > 0 ? 1e9 + px * py : 0) + Object.keys(CAMPO_XY).filter(id => id !== posId).reduce((a, id) => {
          const ox = Math.max(0, hw + r - Math.abs(m + CAMPO_XY[id][0] * iw - x)), oy = Math.max(0, hh + r - Math.abs(m + CAMPO_XY[id][1] * ih - y));
          return a + ox * oy;
        }, 0);
      };
      const lugares = [[cx, cy + gap], [cx, cy - gap], [cx + lado, cy], [cx - lado, cy],
        [cx + hw * .5, cy + gap], [cx - hw * .5, cy + gap], [cx + hw * .5, cy - gap], [cx - hw * .5, cy - gap]].map(dentro);
      const [xc, yc] = lugares.reduce((melhor, l) => (cobre(l) < cobre(melhor) ? l : melhor));
      s += chip(xc, yc, fs, 'VOCÊ', true);
    } else if (!mini) {
      s += chip(m + iw / 2, m + .335 * ih, 34, 'O seu lugar entra aqui.', false);
    }
    return s + '</svg>';
  }
  // o chip acompanha a largura do texto e não sai do campo
  function ajustaChips(root) {
    qsa('[data-campo] .chip', root).forEach(g => {
      const r = qs('rect', g), tx = qs('text', g), cx = parseFloat(g.dataset.cx), fs = parseFloat(tx.getAttribute('font-size')) || 40;
      let w = 0;
      try { w = tx.getComputedTextLength(); } catch (e) { /* sem layout */ }
      if (!w) w = tx.textContent.length * fs * .5;
      const rw = w + fs, x = Math.max(8, Math.min(CW - 8 - rw, cx - rw / 2));
      r.setAttribute('x', x.toFixed(1)); r.setAttribute('width', rw.toFixed(1));
      tx.setAttribute('x', (x + rw / 2).toFixed(1));
    });
  }

  /* turma de 10 (slide da vaga): ocupadas, livres e a vaga dele, só com o número real da semana */
  function drawTurma(box, d) {
    if (!box) return;
    const n = d.vagasN, you = n ? 10 - n : -1;
    let row = '';
    for (let i = 0; i < 10; i++) row += '<i class="' + (i === you ? 'you' : n && i < you ? 'taken' : '') + '"></i>';
    box.innerHTML = '<p class="hd"><span>Turma de 10</span>' + (n ? '<b>' + (n === 1 ? 'resta 1 vaga' : 'restam ' + n + ' vagas') + '</b>' : '') + '</p>' +
      '<div class="row">' + row + '</div>' +
      (n ? '<p class="you-l">Vaga reservada' + (d.nome ? ': ' + esc(d.nomeUp) : '') + '</p>' : '');
  }

  /* planos: o nome com a cor da marca (data-plano-marca="pro" ou "atual"), a parte de cada plano no 23, cargo por cargo
     (data-plano-vantagens="pro", de window.PLANOS[].vantagens), as listas do plano da ficha no 24 (data-plano-lista="inclui")
     e um texto do plano da ficha com o Zyron em azul (data-plano-campo="rotina") */
  const comZyron = t => esc(t).replace(/Zyron/g, '<span class="ice">Zyron</span>');
  function marcaHtml(p) {
    if (!p) return '';
    return (p.marca && p.marca.length ? p.marca : [[p.nome, '']]).map(([t, c]) => '<span class="pl-' + esc(c || 'br') + '">' + esc(t) + '</span>').join(' ');
  }
  function drawPlanos(root) {
    const atual = planoDe(ficha.plano);
    const porId = id => (id === 'atual' ? atual : PLANOS.find(p => p.id === id)) || null;
    qsa('[data-plano-atual]', root).forEach(e => { e.dataset.planoAtual = atual ? atual.id : ''; }); // a cor da etiqueta segue o plano
    qsa('[data-plano-marca]', root).forEach(e => { e.innerHTML = marcaHtml(porId(e.dataset.planoMarca)); });
    // a parte de cada plano no 23: [cargo, benefício], só o que ele acrescenta ao degrau de baixo
    qsa('[data-plano-vantagens]', root).forEach(e => {
      const p = porId(e.dataset.planoVantagens), v = p && Array.isArray(p.vantagens) ? p.vantagens : [];
      // [cargo, benefício, chave]: com chave, a linha só aparece se o plano tiver a chave (ex.: turma, P5)
      e.innerHTML = v.filter(([, , k]) => !k || !!p[k]).map(([c, t]) => '<p><b>' + comZyron(str(c)) + ':</b> ' + comZyron(str(t)) + '</p>').join('');
    });
    qsa('[data-plano-campo]', root).forEach(e => { e.innerHTML = comZyron(atual ? str(atual[e.dataset.planoCampo]) : ''); });
    qsa('[data-plano-lista]', root).forEach(e => {
      const v = atual ? atual[e.dataset.planoLista] : null, arr = Array.isArray(v) ? v.map(str).filter(Boolean) : [];
      e.innerHTML = arr.map(t => '<p>' + comZyron(t) + '</p>').join('');
      e.classList.toggle('vazio', !arr.length);
    });
  }

  /* ---------------- personalização ---------------- */
  function fitSvg(el) {
    const max = parseFloat(el.dataset.fitSvg);
    if (!el.dataset.base) el.dataset.base = el.getAttribute('font-size');
    let fs = parseFloat(el.dataset.base);
    el.setAttribute('font-size', fs);
    try {
      let len = el.getComputedTextLength(), guard = 0;
      while (len > max && fs > 10 && guard++ < 40) { fs *= .92; el.setAttribute('font-size', fs.toFixed(1)); len = el.getComputedTextLength(); }
    } catch (e) { /* elemento sem layout */ }
  }
  function fitHtml(el) {
    const max = parseFloat(el.dataset.fit);
    if (!el.dataset.base) el.dataset.base = parseFloat(getComputedStyle(el).fontSize) || 40;
    let fs = parseFloat(el.dataset.base), guard = 0;
    el.style.fontSize = fs + 'px';
    while (el.scrollWidth > max && fs > 16 && guard++ < 40) { fs *= .93; el.style.fontSize = fs.toFixed(1) + 'px'; }
  }
  function applyBind(root, d) {
    d = d || derived();
    // desenhos antes do bind: os nomes dentro deles também são preenchidos
    qsa('#turma', root).forEach(s => drawTurma(s, d));
    // o campo: redesenha só quando a posição muda (o nome entra pelo data-bind logo abaixo)
    qsa('[data-campo]', root).forEach(e => {
      const k = (d.posId || '-') + '|' + e.dataset.campo + '|' + d.nomeUp;
      if (e.dataset.desenho !== k) { e.innerHTML = campoSvg(d.posId, e.dataset.campo === 'mini', d.nomeUp); e.dataset.desenho = k; }
    });
    drawPlanos(root);
    if (window.R2_PERSONAL) window.R2_PERSONAL.render(root, ficha, d);
    // a leitura do atleta (13): o relatório é redesenhado só quando a leitura muda; todo texto do painel entra escapado
    const RL = window.RelatorioLeitura;
    if (RL) qsa('[data-rl]', root).forEach(e => {
      const dur = ficha._video && ficha._video.duracaoS;
      const k = d.leituraOk ? JSON.stringify(ficha._leitura) + '|' + d.trabalhar + '|' + dur : '';
      if (e.dataset.rlFeito === k) return;
      e.dataset.rlFeito = k;
      if (!k) { e.innerHTML = ''; return; }
      const dl = RL.derivados(ficha._leitura, dur, d.trabalhar), q = e.dataset.rl;
      if (q === 'fonte' || q === 'criterio') e.textContent = dl[q];
      else if (q === 'linha') e.innerHTML = RL.linha(dl, dur);
      else if (typeof RL[q] === 'function') e.innerHTML = RL[q](dl);
    });
    // o vídeo e o quadro do painel: troca só quando muda (não recarrega à toa); o apresentador não baixa o vídeo
    qsa('[data-src]', root).forEach(e => {
      if (isPresenter && e.tagName === 'VIDEO') return;
      const v = d[e.dataset.src] || '';
      if ((e.getAttribute('src') || '') !== v) { if (v) e.setAttribute('src', v); else e.removeAttribute('src'); }
    });
    qsa('[data-poster]', root).forEach(e => { const v = d[e.dataset.poster] || ''; if ((e.getAttribute('poster') || '') !== v) { if (v) e.setAttribute('poster', v); else e.removeAttribute('poster'); } });
    // o espaço e os capítulos só ligam no vídeo do atleta quando ele está na tela
    qsa('[data-video-se]', root).forEach(s => { if (d.videoOk) s.dataset.video = s.dataset.videoSe; else delete s.dataset.video; });
    qsa('[data-bind]', root).forEach(e => { const v = d[e.dataset.bind]; e.textContent = filled(v) ? v : (e.dataset.fb || ''); });
    qsa('[data-if]', root).forEach(e => e.classList.toggle('on', cond(e.dataset.if, d)));
    qsa('[data-ifnot]', root).forEach(e => e.classList.toggle('off', cond(e.dataset.ifnot, d)));
    if (root === document) { qsa('[data-fit-svg]').forEach(fitSvg); qsa('[data-fit]').forEach(fitHtml); ajustaChips(document); }
    if (window.FotoAtleta) window.FotoAtleta.atualiza(root, d);
    return d;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (window.R2_PERSONAL) window.addEventListener('r2-rebind', () => applyBind(document));

  /* ---------------- mensagens ---------------- */
  let chan = null;
  try { chan = new BroadcastChannel(window.R2_PERSONAL ? 'je-r2-dossie-' + (AID || 'exemplo') : 'je-r2' + (AID ? '-' + AID : '')); } catch (e) { chan = null; }
  let peer = isPresenter ? window.opener : null;
  const me = isPresenter ? 'p' : 'd';
  const seen = new Set();
  function send(m) {
    m._id = Date.now() + '-' + Math.random().toString(36).slice(2);
    m._from = me;
    try { if (chan) chan.postMessage(m); } catch (e) { /* canal fechado */ }
    try { if (peer && !peer.closed) peer.postMessage(Object.assign({ __je2: 1 }, m), '*'); } catch (e) { /* janela fechada */ }
  }
  function listen(handler) {
    const recv = m => { if (!m || !m._id || m._from === me || seen.has(m._id)) return; seen.add(m._id); handler(m); };
    if (chan) chan.onmessage = e => recv(e.data);
    window.addEventListener('message', e => { if (!e.data || !e.data.__je2) return; if (peer && e.source !== peer) return; recv(e.data); });
    window.addEventListener('storage', e => { if (e.key === FKEY) { ficha = store.get(FKEY, {}); handler({ t: 'local' }); } });
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
  let painelDoLead = PAINEL; // o painel de onde veio o lead (o vídeo dele sai do mesmo)
  // o lead de um painel, pelo endereço que o deck sempre usou (/api/publico?id=)
  const buscaLead = base => fetch(base + '/api/publico?id=' + encodeURIComponent(AID), { cache: 'no-store' })
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then(j => { painelDoLead = base; return j; });
  function carregaPainel(depois, aviso) {
    if (!AID || typeof fetch !== 'function') return;
    buscaLead(PAINEL)
      .catch(e => (e && e.message === '404' && !CODIGO_NOVO.test(AID) ? buscaLead(PAINEL_DE_ANTES) : Promise.reject(e)))
      .then(j => {
        const f = (j && j.ficha) || {};
        (Array.isArray(ficha._p) ? ficha._p : []).forEach(k => { if (!(k in f)) delete ficha[k]; });
        Object.keys(f).forEach(k => { ficha[k] = f[k]; });
        nomeDeHoje(ficha);
        if (j.foto && j.foto.ok) ficha._foto = j.foto; else delete ficha._foto;
        // a leitura do atleta (13): o vídeo e o relatório vêm só do painel; o que sumiu lá some daqui
        if (j.video && j.video.ok) ficha._video = j.video; else delete ficha._video;
        if (j.video && j.video.ok && j.leitura) ficha._leitura = j.leitura; else delete ficha._leitura;
        videoFalhou = false; posterFalhou = false;
        ficha._a = AID; ficha._p = Object.keys(f);
        store.set(FKEY, ficha);
        depois();
        if (aviso) aviso('Apresentação do painel: ' + (f.nome || AID) + '. O que veio do painel vale sobre esta ficha; pra mudar de vez, mude no painel.' +
          (window.R2_PERSONAL ? ' O slide 12 mostra o relatório; os clubes compatíveis aparecem no 15.' : (j.video && j.video.ok ? (j.leitura ? '' : ' O vídeo está no painel, mas sem lances marcados: o 12 mostra só o vídeo.') : ' Sem vídeo no painel: o 12 vai pra leitura ao vivo.')), true);
      })
      .catch(() => { if (aviso) aviso('Não consegui carregar a apresentação do painel (' + AID + '). A tela usa a ficha deste navegador.', false); });
  }
  function avisoPainel(txt, bom) {
    const p = qs('#pz-painel'); if (!p) return;
    p.hidden = false; p.textContent = txt; p.style.color = bom ? '' : '#E2552B';
  }

  /* ---------------- miniaturas ---------------- */
  function thumb(i, step) {
    const c = slides[i].cloneNode(true);
    c.classList.remove('active');
    showSteps(c, step);
    c.removeAttribute('data-video');
    qsa('[id]', c).forEach(e => { if (!e.closest('defs')) e.removeAttribute('id'); });
    // vídeo vira a capa: miniatura não carrega nem toca nada
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
  function mountThumb(box, i, step) {
    box.innerHTML = '';
    if (i == null || i < 0 || i >= N) return;
    const mini = document.createElement('div'); mini.className = 'mini'; mini.appendChild(thumb(i, step)); box.appendChild(mini);
    const f = () => { mini.style.transform = 'scale(' + (box.clientWidth / 1920) + ')'; };
    f(); requestAnimationFrame(f);
  }

  window.addEventListener('je-foto-atleta', () => applyBind(document));
  applyBind(document);
  // as medidas do nome (data-fit, o chip do campo) dependem da fonte: refaz quando ela termina de carregar
  try { document.fonts.ready.then(() => applyBind(document)); } catch (e) { /* sem document.fonts */ }
  if (isPresenter) presenter(); else deck();

  /* =============================================================
     MODO FAMÍLIA
     ============================================================= */
  function deck() {
    const stage = qs('#stage');
    const fit = () => document.documentElement.style.setProperty('--s', Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    fit(); window.addEventListener('resize', fit);

    const hashIdx = () => { const n = parseInt((location.hash || '').replace('#', ''), 10); return Number.isFinite(n) ? n - 1 : 0; };
    cur = hashIdx();
    if (!(cur >= 0 && cur < N)) cur = 0;
    // passo da revelação no slide atual: entrar avançando começa do zero; pular direto (hash, visão geral, apresentador) mostra tudo
    let step = stepsIn(cur);
    showSteps(slides[cur], step);
    slides[cur].classList.add('active');
    updateHud();

    function go(i, n) {
      if (i == null || i < 0 || i >= N) return;
      const full = stepsIn(i);
      if (i === cur && n == null) return; // pedir o slide em que já está não muda o passo revelado
      n = n == null ? full : Math.max(0, Math.min(n, full));
      if (i === cur) {
        if (n === step) return;
        step = n; showSteps(slides[cur], step);
        send({ t: 'state', i: cur, step });
        return;
      }
      pauseIn(slides[cur]);
      slides[cur].classList.remove('active');
      cur = i; step = n;
      showSteps(slides[cur], step);
      slides[cur].classList.add('active');
      try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) { /* file:// */ }
      updateHud();
      send({ t: 'state', i: cur, step });
    }
    const next = () => { if (step < stepsIn(cur)) go(cur, step + 1); else go(cur + 1, 0); };
    const prev = () => { if (step > 0) go(cur, step - 1); else go(cur - 1); };
    function updateHud() {
      qs('#hud-pos').textContent = posLabel(cur);
      qs('#progress').style.width = ((cur + 1) / N * 100) + '%';
      document.title = 'Jogador de Elite · R2 · ' + posLabel(cur);
    }
    window.addEventListener('hashchange', () => go(hashIdx()));

    /* vídeo */
    const play = v => { const r = v && v.play(); if (r && r.catch) r.catch(() => {}); };
    function seek(v, t) { if (!v) return; try { v.currentTime = t; } catch (e) { /* ainda carregando */ } play(v); }
    function pauseIn(s) { qsa('video, audio', s).forEach(v => { try { v.pause(); } catch (e) { /* nada */ } }); }
    const slideVideo = () => { const id = slides[cur].dataset.video; return id ? document.getElementById(id) : null; };
    qsa('.player').forEach(p => {
      const v = qs('video', p), b = qs('.play', p);
      b.addEventListener('click', () => play(v));
      v.addEventListener('play', () => p.classList.add('playing'));
      v.addEventListener('ended', () => p.classList.remove('playing'));
    });
    // capítulos: o clique pula o vídeo e o item da vez acende. Delegado na lista, porque a do vídeo do atleta (13) é
    // montada depois, quando a leitura chega do painel
    qsa('.chapters').forEach(list => {
      const v = document.getElementById(list.dataset.for);
      list.addEventListener('click', e => { const li = e.target.closest('li[data-t]'); if (li) seek(v, parseFloat(li.dataset.t)); });
      v.addEventListener('timeupdate', () => {
        const items = qsa('li', list); let on = 0;
        items.forEach((li, k) => { if (v.currentTime >= parseFloat(li.dataset.t) - .2) on = k; });
        items.forEach((li, k) => li.classList.toggle('on', k === on && !v.paused));
      });
      v.addEventListener('pause', () => qsa('li', list).forEach(li => li.classList.remove('on')));
    });
    /* o vídeo do atleta (13): começa mudo, com o botão de som; os lances da linha do tempo e da lista curta pulam o vídeo
       (2 s antes do lance); a chamada do lance aparece sobre o vídeo quando o minuto passa por ele. Se o vídeo não carregar,
       o 13 volta pra leitura ao vivo sem erro na tela, e o apresentador recebe o aviso */
    const va = document.getElementById('v-atleta');
    if (va) {
      const pa = va.closest('.player'), ch = qs('.ia-chamada', pa), sl = va.closest('.slide');
      const marcaSom = () => pa.classList.toggle('com-som', !va.muted);
      qs('.som', pa).addEventListener('click', () => { va.muted = !va.muted; marcaSom(); });
      va.addEventListener('volumechange', marcaSom);
      sl.addEventListener('click', e => { const m = e.target.closest('.rl-m, .rl-curtos li[data-t]'); if (m) seek(va, Math.max(0, parseFloat(m.dataset.t) - 2)); });
      va.addEventListener('timeupdate', () => {
        const RL = window.RelatorioLeitura;
        const l = RL && ficha._leitura && ficha._video ? RL.derivados(ficha._leitura, ficha._video.duracaoS, '') : null;
        const x = l && RL.lanceEm(l, va.currentTime);
        ch.hidden = !x;
        if (x) { qs('.lk', ch).textContent = RL.mmss(x.t) + ' · ' + x.tipo + ' · ' + RL.LEITURA[x.leitura]; qs('.nt', ch).textContent = x.nota || ''; ch.classList.toggle('ajustar', x.leitura === 'ajustar'); }
      });
      va.addEventListener('error', () => {
        if (!va.getAttribute('src') || videoFalhou) return;
        videoFalhou = true; pauseIn(sl); applyBind(document); send({ t: 'videoFalhou' });
      });
    }
    qsa('img[data-src]').forEach(img => img.addEventListener('error', () => { if (img.getAttribute('src') && !posterFalhou) { posterFalhou = true; applyBind(document); } }));
    /* áudio (depoimento): a onda acende até onde já tocou */
    const mmss = t => Number.isFinite(t) ? Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0') : '0:00';
    qsa('.audio-player').forEach(p => {
      const a = document.getElementById(p.dataset.for); if (!a) return;
      const onda = qs('.ap-onda', p), barras = qsa('i', onda), tempo = qs('.ap-tempo', p);
      const pinta = () => {
        const k = a.duration ? a.currentTime / a.duration : 0, n = Math.round(k * barras.length);
        barras.forEach((b, j) => b.classList.toggle('on', j < n));
        tempo.textContent = a.duration ? mmss(a.currentTime) + ' / ' + mmss(a.duration) : mmss(a.currentTime);
      };
      qs('.ap-play', p).addEventListener('click', () => { if (a.paused) play(a); else a.pause(); });
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

    /* teclado */
    let numBuf = '', numT = 0;
    document.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if (qs('#overview').classList.contains('on')) { if (k === 'Escape' || k === 'g' || k === 'G') { e.preventDefault(); toggleOverview(false); } return; }
      if (k === ' ' && slideVideo()) { e.preventDefault(); const v = slideVideo(); if (v.paused) play(v); else v.pause(); }
      else if (k === 'ArrowRight' || k === 'PageDown' || k === 'ArrowDown' || k === ' ') { e.preventDefault(); next(); }
      else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'ArrowUp') { e.preventDefault(); prev(); }
      else if (k === 'Enter') { e.preventDefault(); if (numBuf) { const n = parseInt(numBuf, 10); numBuf = ''; go(n - 1); } }
      else if (k === 'Home') { e.preventDefault(); go(0); }
      else if (k === 'End') { e.preventDefault(); go(N - 1); }
      else if (k === 'f' || k === 'F') toggleFs();
      else if (k === 'p' || k === 'P') openPresenter();
      else if (k === 'g' || k === 'G') toggleOverview(true);
      else if (k === 'v' || k === 'V') abrirVariacoes();
      else if (/^\d$/.test(k)) { numBuf += k; clearTimeout(numT); numT = setTimeout(() => { const n = parseInt(numBuf, 10); numBuf = ''; go(n - 1); }, 900); }
    }, true);

    let tx = 0, ty = 0;
    stage.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { if (dx < 0) next(); else prev(); } }, { passive: true });

    let hudT = 0;
    const showHud = () => { document.body.classList.add('show-hud'); clearTimeout(hudT); hudT = setTimeout(() => document.body.classList.remove('show-hud'), 2200); };
    document.addEventListener('mousemove', showHud);
    qs('#hud').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const a = b.dataset.act;
      if (a === 'prev') prev(); if (a === 'next') next(); if (a === 'overview') toggleOverview(true); if (a === 'presenter') openPresenter(); if (a === 'fullscreen') toggleFs();
      if (a === 'variacoes') abrirVariacoes();
    });
    // página de escolha da variação (antes da call: não é tela pra família)
    function abrirVariacoes() { location.href = '/variacoes/'; }
    showHud();
    function toggleFs() {
      if (!document.fullscreenElement) { const r = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); if (r && r.catch) r.catch(() => {}); }
      else if (document.exitFullscreen) document.exitFullscreen();
    }

    let ovBuilt = false;
    function toggleOverview(on) {
      const ov = qs('#overview');
      if (on && !ovBuilt) {
        slides.forEach((s, i) => {
          const it = document.createElement('div'); it.className = 'ov-item';
          it.innerHTML = '<div class="th"></div><p class="nm"><b>' + String(i + 1).padStart(2, '0') + '</b>' + esc(s.dataset.title) + '</p>';
          it.addEventListener('click', () => { toggleOverview(false); go(i); });
          qs('#ov-grid').appendChild(it);
        });
        ovBuilt = true;
      }
      ov.classList.toggle('on', !!on);
      if (on) {
        qsa('.ov-item', ov).forEach((it, i) => { it.classList.toggle('cur', i === cur); mountThumb(qs('.th', it), i); });
        const c = qsa('.ov-item', ov)[cur]; if (c) c.scrollIntoView({ block: 'center' });
      }
    }
    function openPresenter() {
      const url = location.pathname + location.search + (location.search ? '&' : '?') + 'presenter';
      const w = window.open(url, 'je-r2-presenter', 'width=1480,height=920');
      if (w) peer = w; else alert('Libere pop-ups pra abrir o modo apresentador.');
    }

    listen(m => {
      if (m.t === 'goto') go(m.i, m.step);
      else if (m.t === 'next') next();
      else if (m.t === 'prev') prev();
      else if (m.t === 'hello') send({ t: 'state', i: cur, step });
      else if (m.t === 'ficha') { ficha = m.ficha || {}; applyBind(document); }
      else if (m.t === 'local') applyBind(document);
      else if (m.t === 'seek') { go(m.slide); seek(document.getElementById(m.id), m.time); }
      else if (m.t === 'pause') pauseIn(slides[cur]);
      else if (m.t === 'som' && va) { va.muted = !va.muted; }
    });
    send({ t: 'state', i: cur, step });
    carregaPainel(() => { applyBind(document); send({ t: 'ficha', ficha }); });
  }

  /* =============================================================
     MODO APRESENTADOR
     ============================================================= */
  function presenter() {
    document.documentElement.classList.add('is-presenter');
    document.body.classList.add('is-presenter');
    qs('#hud').style.display = 'none'; qs('#progress').style.display = 'none';
    qsa('video, audio').forEach(v => { v.preload = 'none'; });

    const app = document.createElement('div');
    app.className = 'pz';
    app.innerHTML = `
      <header class="pz-top">
        <p class="pz-brand">Jogador de Elite <span>R2 · Gestor de Carreiras</span></p>
        <p id="pz-var" title="Versão do deck aberta na janela da família" style="margin:0;font:600 13px var(--f-label);letter-spacing:.18em;text-transform:uppercase;color:var(--sand-l);border:1px solid rgba(200,184,138,.45);border-radius:4px;padding:5px 8px;white-space:nowrap">${esc(window.VARIACAO_NOME || 'Deck padrão')}</p>
        <div class="pz-nav"><button data-a="prev">◀</button><span id="pz-pos">1</span><button data-a="next">▶</button></div>
        <div class="pz-clock"><span id="pz-time">00:00</span><span class="pz-small">/ ${DADOS.duracao}:00</span><button data-a="timer" id="pz-tbtn">Iniciar</button><button data-a="treset">Zerar</button></div>
        <button data-a="silence" id="pz-sil" title="Tecla S">Silêncio (S)</button>
        <p class="pz-link" id="pz-link">Conectando ao deck…</p>
      </header>
      <main class="pz-main">
        <section class="pz-left">
          <div class="pz-prev">
            <div><div class="pz-thumb" id="pz-cur"></div><p class="pz-cap">Agora na tela da família</p></div>
            <div><div class="pz-thumb" id="pz-next"></div><p class="pz-cap">Próximo</p></div>
          </div>
          <div id="pz-ctl"></div>
          <div class="pz-notes" id="pz-notes"></div>
        </section>
        <aside class="pz-right">
          <nav class="pz-tabs"><button data-tab="ficha" class="on">Ficha</button><button data-tab="ler">Ler antes</button><button data-tab="obj">Objeções</button><button data-tab="fech">Fechamento</button></nav>
          <div class="pz-tab on" id="tab-ficha"></div>
          <div class="pz-tab" id="tab-ler"></div>
          <div class="pz-tab" id="tab-obj"></div>
          <div class="pz-tab" id="tab-fech"></div>
        </aside>
      </main>
      <footer class="pz-foot"><b>Lembrete.</b> ${esc(window.PROIBIDOS || '')}</footer>`;
    document.body.appendChild(app);

    const first = s => String(s || '').trim().split(/\s+/)[0] || '';
    const minusc = s => (s ? s[0].toLowerCase() + s.slice(1) : '');
    function fill(s) {
      const d = derived(), pl = planoDe(ficha.plano) || {};
      const map = {
        '[atleta]': d.nome, '[responsável]': first(ficha.responsavel), '[pai]': first(ficha.pai), '[mãe]': first(ficha.mae), '[gerente]': d.gerente,
        '[idade]': d.idade, '[idade + 1]': d.idadeMais1, '[característica]': d.caracteristicas, '[experiência]': d.experiencia, '[sonho]': d.sonho,
        '[primeiro foco]': d.trabalhar, '[locomoção]': d.locomocao, '[dor]': d.dor, '[peneiras]': d.peneiras, '[investido]': d.investido, '[vagas]': d.vagas,
        '[faixa]': d.faixaContrato, '[link AGN]': d.linkAgn,
        '[caso]': str(ficha.casoNome), '[clube do caso]': str(ficha.casoClube), '[país do caso]': str(ficha.casoPais), '[link do caso]': str(ficha.casoLink),
        '[hora]': str(ficha.horaRetorno), '[posição]': str(ficha.posicao).toLowerCase(),
        // do plano da ficha (vazio ou nome antigo: Legacy)
        '[plano]': str(pl.curto || pl.nome), '[preço]': pl.preco ? pl.preco + ', vitalício' : '', '[parcela]': str(pl.parcela), '[ritmo]': minusc(str(pl.ritmo)), '[por dia]': str(pl.porDia)
      };
      let out = esc(s);
      Object.keys(map).forEach(k => { if (map[k]) out = out.split(esc(k)).join('<b class="pz-name">' + esc(map[k]) + '</b>'); });
      return out;
    }
    function save(extra) {
      if (extra) Object.assign(ficha, extra);
      store.set(FKEY, ficha);
      send({ t: 'ficha', ficha });
      refreshAll(applyBind(document));
    }

    /* ----- trocar de plano (23, 24 e aba Fechamento): a tela da família acompanha ----- */
    let troca = null; // a última troca: { de, para }, pra mostrar o que sai ao descer e o que entra ao subir
    const emLista = arr => (arr.length > 1 ? arr.slice(0, -1).join(', ') + ' e ' + arr[arr.length - 1] : arr[0] || '');
    function trocaHtml() {
      if (!troca) return '';
      const a = PLANOS.indexOf(troca.de), b = PLANOS.indexOf(troca.para);
      if (a < 0 || b < 0 || a === b || troca.para !== planoDe(ficha.plano)) return '';
      if (b < a) {
        // descer: sai o que cada degrau de baixo perde (sai[] de cada um)
        const sai = PLANOS.slice(b, a).reverse().reduce((t, p) => t.concat(p.sai || []), []);
        return `<p class="pz-say" style="margin-top:10px">${fill('"' + (troca.para.descer || 'Existe um formato mais enxuto, ' + comArtigo(troca.para)) + '. O que muda: sai ' + emLista(sai) + '."')}</p>` +
          (troca.para.id === 'scouting' ? '<p class="pz-small"><b>Diga em voz alta:</b> o encaminhamento pra clubes vem a partir da Assessoria PRO.</p>'
            : troca.de.id === 'legacy' ? '<p class="pz-small"><b>Diga em voz alta:</b> a conexão direta com clubes e AGN e os 15 encaminhamentos por mês são do Legacy; na Assessoria PRO, são pelo menos 5.</p>' : '');
      }
      // subir: entra o que cada degrau de cima acrescenta (diferenca de cada degrau de baixo)
      const entra = PLANOS.slice(a, b).map(p => p.diferenca).filter(Boolean);
      return `<p class="pz-say" style="margin-top:10px">${fill('"' + (troca.para.subir || 'Se vocês quiserem mais') + ', ' + comArtigo(troca.para) + ' acrescenta ' + emLista(entra) + '."')}</p>`;
    }
    function planoCtl(titulo) {
      const at = planoDe(ficha.plano);
      return `<div class="pz-ctl"><p class="pz-h">${titulo}</p><div class="pz-mode">${PLANOS.map(p => `<button data-plano-troca="${esc(p.id)}" class="${p === at ? 'on' : ''}">${esc(p.curto || p.nome)}</button>`).join('')}</div>${trocaHtml()}</div>`;
    }
    function trocarPlano(id) {
      const para = PLANOS.find(p => p.id === id), de = planoDe(ficha.plano);
      if (!para || planoPorNome(ficha.plano) === para) return;
      if (de !== para) troca = { de, para };
      save({ plano: para.nome }); syncForm();
    }

    /* ----- roteiro e controles do slide ----- */
    const list = arr => '<ul>' + arr.map(x => '<li>' + fill(x) + '</li>').join('') + '</ul>';
    // a etapa da Bíblia em que a call está (window.ETAPAS, roteiro.js); o 03 e o 12 cobrem duas
    const etapasDe = n => (window.ETAPAS || []).filter(e => (e.slides || []).indexOf(n) >= 0).map(e => e.nome);
    function renderNotes() {
      const r = ROT[cur] || {}, et = etapasDe(cur + 1);
      const sec = (title, arr, cls) => arr && arr.length ? `<div class="pz-sec ${cls || ''}"><p class="pz-h">${title}</p>${list(arr)}</div>` : '';
      qs('#pz-notes').innerHTML = `
        <div class="pz-title"><span>${String(cur + 1).padStart(2, '0')}</span>${esc(r.nome || '')}<em>${r.min ? String(r.min).replace('.', ',') + ' min' : ''}</em></div>
        <p class="pz-etapa">${et.length ? `Etapa da Bíblia: <b>${et.map(esc).join(' · ')}</b>` : ''}${r.silencio ? '<span class="pz-siltag">Pergunta e silêncio</span>' : ''}</p>
        ${objsHere()}
        ${r.silencio ? `<div class="pz-sec sil"><p class="pz-h">Pergunte e fique em silêncio · tecla S${cur === SILENCE_SLIDE ? '' : ' (o silêncio conta aqui, sem trocar de slide)'}</p><p class="pz-say">${fill(r.silencio)}</p></div>` : ''}
        ${sec('Fale', r.fala)}${sec('Modo B, se precisar (a tela não muda)', r.modoB)}${sec('Pergunte e espere a resposta', r.perguntas, 'ask')}${sec('Anote na ficha', r.crm, 'crm')}
        ${r.atencao ? `<div class="pz-sec warn"><p class="pz-h">Atenção</p><p>${fill(r.atencao)}</p></div>` : ''}`;
    }
    // o que o slide desarma: o inverso de OBJECOES[].slides (a fonte é uma só); clique e a resposta abre na aba Objeções
    function objsHere() {
      const list = (window.OBJECOES || []).map((o, k) => [o, k]).filter(([o]) => o.slides.indexOf(cur + 1) >= 0);
      return list.length ? `<div class="pz-sec desarma"><p class="pz-h">Este slide desarma</p><div class="pz-chips">${list.map(([o, k]) => `<button data-obj="${k}">${esc(o.q)}</button>`).join('')}</div></div>` : '';
    }
    function openObj(k) {
      qsa('.pz-tabs button').forEach(x => x.classList.toggle('on', x.dataset.tab === 'obj'));
      qsa('.pz-tab').forEach(x => x.classList.toggle('on', x.id === 'tab-obj'));
      const d = qs('.pz-obj[data-k="' + k + '"]'); if (!d) return;
      qsa('.pz-obj').forEach(x => { x.open = x === d; });
      d.scrollIntoView({ block: 'start' });
    }
    function renderCtl() {
      const box = qs('#pz-ctl'); const o = str(ficha.origem);
      let h = '';
      const vid = slides[cur].dataset.video;
      if (vid) {
        const el = document.getElementById(vid);
        // depoimento em áudio: tocar do início e pausar na tela da família
        if (el && el.tagName === 'AUDIO') h = `<div class="pz-ctl"><p class="pz-h">Áudio na tela da família (compartilhe com áudio)</p><div class="pz-mode"><button data-seek="0" data-vid="${vid}">Tocar do início</button><button data-a="vpause">Pausar</button></div><p class="pz-small">Espaço no deck também dá play e pausa.</p></div>`;
        else {
          const ch = qsa('.chapters li', slides[cur]).map(li => [li.dataset.t, qs('.tm', li).textContent, qs('.ct', li).textContent]);
          const atleta = vid === 'v-atleta', d = derived();
          h = `<div class="pz-ctl"><p class="pz-h">${atleta ? 'O vídeo do atleta na tela da família: clique num lance e o vídeo pula pra ele (2 s antes)' : 'Vídeo na tela da família (compartilhe com áudio)'}</p><div class="pz-mode">${atleta ? '<button data-seek="0" data-vid="v-atleta">Do início</button>' : ''}${ch.map(c => `<button data-seek="${c[0]}" data-vid="${vid}">${esc(c[1])} · ${esc(c[2])}</button>`).join('')}${atleta ? '<button data-a="som">Som</button>' : ''}<button data-a="vpause">Pausar</button></div>` +
            (atleta ? (d.leituraOk ? `<p class="pz-small"><b>Fonte desta leitura: ${d.leituraFonte === 'zyron' ? 'o Zyron' : 'a equipe'}.</b> ${d.leituraFonte === 'zyron' ? 'Pode dizer que o Zyron leu.' : 'Diga "a nossa equipe leu o seu vídeo". Não diga que o Zyron leu: esses lances foram marcados à mão.'} O vídeo começa mudo: Som liga o áudio.</p>` : '<p class="pz-small"><b>Só o vídeo, sem lances:</b> a tela mostra "Leitura em preparação". Marque os lances no painel (Leitura do atleta) e recarregue o deck.</p>') : '') + '</div>';
        }
      } else if (slides[cur].dataset.videoSe) {
        h = '<div class="pz-ctl warn"><p class="pz-h">Sem vídeo do atleta no painel</p><p class="pz-say">O 12 está na leitura ao vivo, como sempre: troque o compartilhamento pro vídeo dele no Meet. Pra mostrar o jogo dele lance a lance, suba o vídeo na Leitura do atleta, no painel.</p></div>';
      }
      if (cur <= 1) h = `<div class="pz-ctl"><p class="pz-h">Origem do lead (muda o texto na tela)</p><div class="pz-mode">${[['Zyron', 'Zyron'], ['Formulário do Instagram', 'Formulário'], ['Frio, sem vídeo', 'Sem contexto']].map(([v, l]) => `<button data-origem="${esc(v)}" class="${o === v ? 'on' : ''}">${l}</button>`).join('')}</div></div>`;
      // os planos: a recomendação é o plano da ficha, destacado no último avanço; trocar aqui move o destaque na tela
      if (cur === MATRIZ) h = planoCtl('Plano da ficha (o último avanço destaca na tela como a sua recomendação)');
      if (cur === VAGA) {
        // a tela e a fala vêm do mesmo plano, o da ficha, sem link no deck
        const p = planoDe(ficha.plano) || {};
        const fala = fill('"[pai], [mãe], o investimento no [plano] é de [preço], em 10x sem juros de [parcela]."');
        h = `<div class="pz-ctl"><p class="pz-h">Fale o número e pare</p><p class="pz-say">${fala}</p><p class="pz-small"><b>Na tela, um plano só:</b> ${esc(p.nome || '')}, ${esc(p.preco || '')} vitalício e 10x sem juros de ${esc(p.parcela || '')}. Link de pagamento: fora do deck, pelo WhatsApp, só depois do sim.</p></div>` +
          planoCtl('Trocar de plano, pelo escopo (a tela da família troca junto)');
      }
      // o campo (10) e a miniatura (25) dependem da posição da ficha
      const campo = qs('[data-campo]', slides[cur]);
      if (campo) {
        const d = derived(), pos = str(ficha.posicao);
        h += d.posId
          ? `<div class="pz-ctl"><p class="pz-h">O campo na tela</p><p class="pz-say">${esc(pos)}: marcado como ${esc(d.posId.split('-')[0])}${d.peTxt || d.alturaTxt ? '' : '. Pé e altura vazios: o cartão mostra só o resto'}.</p></div>`
          : `<div class="pz-ctl warn"><p class="pz-h">${campo.dataset.campo === 'mini' ? 'A miniatura do campo não aparece' : 'O campo está sem destaque'}</p><p class="pz-say">Preencha a posição na ficha (aba Ficha, grupo Atleta).${pos ? ` "${esc(pos)}" não casa com nenhum marcador: escreva como goleiro, lateral direito, zagueiro, volante, meia, ponta esquerda ou atacante.` : ''}</p></div>`;
      }
      // slide com revelação item a item: o que está na tela e o que entra no próximo avanço
      const total = stepsIn(cur);
      if (total) {
        const s = curStep == null ? total : curStep;
        // texto do que entra no próximo avanço, sem os itens de outros passos que estão dentro dele; a soma vem à parte.
        // Só conta o que está ligado na tela (data-if); data-passo, se houver, dá o nome curto do avanço
        const texto = e => { const c = e.cloneNode(true); qsa('[data-step], [data-soma]', c).forEach(x => x.remove()); qsa('b', c).forEach(x => x.before(' ')); return c.textContent.replace(/\s+/g, ' ').trim(); };
        const visivel = e => !e.closest('[data-if]:not(.on), [data-ifnot].off');
        const proxEls = s < total ? qsa('[data-step="' + (s + 1) + '"]', slides[cur]).filter(visivel) : [];
        const passos = proxEls.map(e => e.dataset.passo).filter(Boolean);
        let prox = passos.length ? passos.join(' · ') : proxEls.filter(e => !e.classList.contains('legal') && !e.querySelector('[data-soma]')).map(texto).filter(Boolean).join(' · ').slice(0, 160);
        if (s < total && qs('[data-soma]', slides[cur])) prox += ' · soma na tela: ' + brl(somaAte(slides[cur], s + 1)) + ' por ano';
        h += `<div class="pz-ctl"><p class="pz-h">Revelação item a item · ${s} de ${total} na tela</p><p class="pz-say">${s < total ? 'Próximo avanço (→ ou espaço): ' + esc(prox) : 'Tudo na tela. O próximo avanço vai pro próximo slide.'}</p></div>`;
      }
      box.innerHTML = h;
    }
    app.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.origem != null) { save({ origem: b.dataset.origem }); syncForm(); return; }
      if (b.dataset.obj != null) { openObj(b.dataset.obj); return; }
      if (b.dataset.planoTroca != null) { trocarPlano(b.dataset.planoTroca); return; }
      if (b.dataset.go != null) { send({ t: 'goto', i: parseInt(b.dataset.go, 10) }); return; }
      if (b.dataset.seek != null) { send({ t: 'seek', id: b.dataset.vid, slide: cur, time: parseFloat(b.dataset.seek) }); return; }
      const a = b.dataset.a;
      if (a === 'vpause') send({ t: 'pause' });
      if (a === 'som') send({ t: 'som' });
      if (a === 'prev') send({ t: 'prev' });
      if (a === 'next') send({ t: 'next' });
      if (a === 'timer') toggleTimer();
      if (a === 'treset') { elapsed = 0; timerOn = false; qs('#pz-tbtn').textContent = 'Iniciar'; tick(); }
      if (a === 'silence') toggleSilence();
      if (b.dataset.tab) { qsa('.pz-tabs button').forEach(x => x.classList.toggle('on', x === b)); qsa('.pz-tab').forEach(x => x.classList.toggle('on', x.id === 'tab-' + b.dataset.tab)); }
    });

    function show(i, s) {
      cur = i; curStep = s == null ? null : s;
      qs('#pz-pos').textContent = posLabelPz();
      mountThumbs();
      renderNotes(); renderCtl();
      if (!timerOn && !elapsed && cur > 0) toggleTimer();
    }
    function refreshAll(d) {
      d = d || derived();
      renderNotes(); renderCtl(); renderLer(d); renderObjBtns(); renderFech();
      qs('#pz-pos').textContent = posLabelPz();
      mountThumbs();
    }
    // "Próximo": o próximo item do mesmo slide, enquanto houver; depois, o próximo slide
    function mountThumbs() {
      const total = stepsIn(cur), s = curStep == null ? total : curStep;
      mountThumb(qs('#pz-cur'), cur, s);
      if (s < total) mountThumb(qs('#pz-next'), cur, s + 1);
      else mountThumb(qs('#pz-next'), cur + 1 < N ? cur + 1 : null, 0);
    }
    function posLabelPz() {
      const total = stepsIn(cur), s = curStep == null ? total : curStep;
      return posLabel(cur) + (total ? ' · ' + s + '/' + total : '');
    }
    window.addEventListener('resize', mountThumbs);

    /* ----- cronômetro e silêncio ----- */
    let timerOn = false, elapsed = 0, t0 = 0;
    function tick() {
      const s = Math.floor((elapsed + (timerOn ? Date.now() - t0 : 0)) / 1000);
      const el = qs('#pz-time');
      el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
      el.classList.toggle('mid', s > DADOS.duracao * 60 && s <= 60 * 60);
      el.classList.toggle('late', s > 60 * 60);
      if (silOn) { const q = Math.floor((Date.now() - silStart) / 1000); qs('#pz-sil').textContent = 'Silêncio: ' + Math.floor(q / 60) + ':' + String(q % 60).padStart(2, '0'); }
    }
    function toggleTimer() { if (timerOn) { elapsed += Date.now() - t0; timerOn = false; } else { t0 = Date.now(); timerOn = true; } qs('#pz-tbtn').textContent = timerOn ? 'Pausar' : 'Iniciar'; }
    setInterval(tick, 250);
    let silOn = false, silStart = 0, silReturn = null;
    function toggleSilence() {
      const b = qs('#pz-sil');
      if (!silOn) {
        silOn = true; silStart = Date.now(); silReturn = null; b.classList.add('on');
        // nos pontos de pergunta e silêncio do roteiro (04 e 13, campo silencio), conta ali mesmo; de qualquer outro slide,
        // o Silêncio leva ao momento do número (24, data-silencio), sem revelar o que vem depois dele, e volta quando para
        const aqui = cur === SILENCE_SLIDE || !!(ROT[cur] && ROT[cur].silencio);
        if (!aqui) { silReturn = cur; const ps = parseInt(slides[SILENCE_SLIDE].dataset.silencio, 10); send({ t: 'goto', i: SILENCE_SLIDE, step: Number.isFinite(ps) ? ps : undefined }); }
      }
      else { silOn = false; b.classList.remove('on'); b.textContent = 'Silêncio (S)'; if (silReturn != null) send({ t: 'goto', i: silReturn }); silReturn = null; }
    }
    document.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); toggleSilence(); }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); send({ t: 'next' }); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); send({ t: 'prev' }); }
    });

    /* ----- ficha ----- */
    const F = [
      ['Atleta (a família vê)', [
        ['nome', 'Nome do atleta', 'text', 'Só o primeiro nome aparece na tela'], ['idade', 'Idade', 'number'],
        ['posicao', 'Posição', 'text', 'Desenha o campo e a miniatura de boas-vindas. Ex.: goleiro, lateral direito, zagueiro, volante, meia, ponta esquerda, atacante. Posição que o deck não reconhece: o campo fica sem destaque'], ['cidade', 'Cidade', 'text'],
        ['pe', 'Pé', 'select', 'Cartão do perfil em campo. Vazio: a linha some', ['', 'Destro', 'Canhoto', 'Ambidestro']],
        ['altura', 'Altura (cm)', 'number', 'Cartão do perfil em campo, em metros. Vazio: a linha some'],
        ['origem', 'Origem do lead', 'select', 'Muda os slides 01 e 02: Zyron (o Zyron viu), formulário (a história dele) ou sem contexto', ORIGENS],
        ['caracteristicas', 'O que chamou atenção no Zyron', 'text', 'Do Contexto do CRM. Aparece no 02 se veio do Zyron'],
        ['experiencia', 'Experiência que ele contou no formulário', 'text', 'Do Contexto do CRM. Ex.: Sub-15 do América de Natal. Aparece no 02 se veio do formulário']
      ]],
      ['Contexto do SDR (orienta o plano)', [
        ['sonho', 'Sonho do atleta', 'text', 'Vira o destino do plano'], ['falta', 'O que ele acha que falta', 'text'], ['dor', 'Dor da família (palavras deles)', 'area'],
        ['treina', 'Treina hoje', 'text'], ['locomocao', 'Locomoção pra outro estado', 'text'],
        ['trabalhar', 'Primeiro foco do plano', 'text', 'Você define, a partir do vídeo e do Zyron. Aparece no planejamento']
      ]],
      ['Equipe', [
        ['gestor', 'Seu nome (Gestor)', 'text', 'Só na mensagem de confirmação'], ['gerente', 'Gerente de carreira', 'text'], ['analista', 'Analista de performance', 'text'],
        ['prazoContato', 'Quando o gerente entra em contato', 'text', 'Só o que a operação cumpre. Ex.: ainda hoje'], ['prazoZyron', 'Quando o Zyron começa', 'text', 'Ex.: no dia seguinte']
      ]],
      ['Caso espelho (na apresentação da AGN)', [
        ['casoNome', 'Atleta nosso com o mesmo perfil', 'text', 'O "ele me lembra muito você". Só caso real: tabela do CASOS.md ou publicado na AGN. Vazio: o quadro fica fora da apresentação da AGN'],
        ['casoClube', 'Clube que ele fechou', 'text', 'Ex.: Wigan Athletic'], ['casoPais', 'País do clube', 'text', 'Ex.: Inglaterra'],
        ['casoLink', 'Link da publicação dele na AGN', 'text', 'Pra mandar no WhatsApp na hora em que você fala o nome']
      ]],
      ['Contrato, garantia e AGN', [
        ['faixaContrato', 'Quanto um atleta nosso fecha', 'text', 'Aparece no contrato, seguido de "por mês". Padrão: R$ 20 a 30 mil+. Só o que vocês comprovam com contrato'],
        ['garantiaPrazo', 'Prazo da garantia (se houver)', 'text', 'Prazo real da garantia incondicional. Vazio: a linha do prazo fica fora da tela'],
        ['linkAgn', 'Link da AGN Football', 'text', 'Pra mandar no WhatsApp durante a apresentação da AGN']
      ]],
      ['Turma e investimento', [
        ['vagas', 'Vagas restantes (número real da semana)', 'number', 'Só no Legacy, na turma e no começo'], ['proximaTurma', 'Próxima turma abre em', 'text', 'Só no Legacy, no começo'],
        ['plano', 'Plano que vou recomendar', 'select', 'A tela da família mostra este plano: o destaque dos planos, o investimento e as boas-vindas (turma e vaga só no Legacy). Regra da casa: Legacy se a ficha não mostra aperto financeiro; Assessoria PRO se a dor financeira é forte ou na objeção de caixa depois do Legacy; Scouting só se o caixa não comporta o PRO. Vazio ou nome antigo: a tela mostra o Legacy', [''].concat(PLANOS.map(p => p.nome))],
        ['horaRetorno', 'Hora do retorno (Modo B)', 'text', 'Ex.: 19h']
      ]],
      ['Da R1 (só você vê)', [
        ['responsavel', 'Quem fala pela família', 'text'], ['pai', 'Pai', 'text'], ['mae', 'Mãe', 'text'], ['outro', 'Outro responsável', 'text'],
        ['decisores', 'Decisores e como decidem', 'area'], ['telefones', 'Telefones dos decisores', 'text'], ['dadosZyron', 'Dados do Zyron', 'area'],
        ['times', 'Times e experiências', 'area'], ['peneiras', 'Peneiras e avaliações', 'area', 'Falado nos slides de avaliação e comparação'], ['investido', 'Já investiram (a régua, só falada)', 'text'],
        ['lucro', 'Respondeu que não faz sentido a gente lucrar em cima', 'check'], ['precomp', 'Pré-compromisso de decidir na R2', 'check'], ['empolgacao', 'Empolgação do atleta (0 a 10)', 'number'],
        ['objecoes', 'Objeções que apareceram', 'area'], ['budget', 'Sinais de budget', 'area'], ['confirmados', 'Todos os decisores confirmados', 'check'], ['r2dia', 'R2: dia', 'text'], ['r2hora', 'R2: hora', 'text']
      ]],
      ['Resultado da R2', [
        ['resultado', 'Resultado', 'select', '', ['', 'Venda', 'Retorno marcado', 'Ainda não']], ['mudou', 'O que mudou desde a R1', 'area'], ['aspiracao', 'Aspiração do atleta (palavras dele)', 'text'],
        ['planoFechado', 'Plano fechado', 'select', 'Produto e ticket vão pro CRM e pro cadastro em Vendas', [''].concat(PLANOS.map(p => p.nome))], ['objecoesR2', 'Objeções na R2', 'area'], ['proximoContato', 'Próximo contato', 'text'],
        ['indicacao', 'Indicação (contato do responsável)', 'text'], ['observacoes', 'Observações', 'area']
      ]]
    ];
    const tf = qs('#tab-ficha');
    function fieldHtml([id, lab, type, hint, opts]) {
      const v = ficha[id] == null ? '' : ficha[id];
      if (type === 'check') return `<label class="ck"><input type="checkbox" id="f-${id}"${v === true ? ' checked' : ''}> ${lab}</label>`;
      let input;
      if (type === 'area') input = `<textarea id="f-${id}" rows="2">${esc(v)}</textarea>`;
      else if (type === 'select') {
        // valor antigo, digitado antes da lista, continua visível
        const all = v !== '' && opts.indexOf(v) < 0 ? opts.concat([v]) : opts;
        input = `<select id="f-${id}">${all.map(o => `<option value="${esc(o)}"${o === v ? ' selected' : ''}>${esc(o || 'escolha')}</option>`).join('')}</select>`;
      }
      else input = `<input id="f-${id}" type="${type === 'number' ? 'number' : 'text'}" value="${esc(v)}">`;
      return `<label><span>${lab}</span>${input}${hint ? `<small>${hint}</small>` : ''}</label>`;
    }
    tf.innerHTML = `
      <p class="pz-small" id="pz-painel" hidden></p>
      <fieldset class="pz-import"><legend>Importar a ficha da R1</legend>
        <label><span>Cole aqui a ficha do CRM (R1)</span><textarea id="imp-txt" placeholder="O texto do botão Copiar ficha pro CRM da R1"></textarea></label>
        <div class="pz-actions"><button id="imp-go">Ler ficha</button></div>
        <div id="imp-out"></div>
      </fieldset>
      ${F.map(([g, fields]) => `<fieldset><legend>${g}</legend>${fields.map(fieldHtml).join('')}</fieldset>`).join('')}
      <div class="pz-actions"><button id="f-crm">Copiar resultado pro CRM</button><button id="f-dia">Copiar resumo do mesmo dia</button><button id="f-clear" class="ghost">Nova call (limpar ficha)</button></div>
      <p class="pz-small">Copie pro CRM antes de limpar. A ficha guarda dados de menor só neste navegador.</p>`;
    const onField = e => {
      const t = e.target;
      if (!t.id || t.id.indexOf('f-') !== 0) return;
      const id = t.id.slice(2);
      const antes = planoDe(ficha.plano);
      ficha[id] = t.type === 'checkbox' ? t.checked : t.value;
      // trocar o plano pela ficha também mostra o que sai ou o que entra (no 23, no 24 e no Fechamento)
      if (id === 'plano') { const depois = planoDe(ficha.plano); if (antes && depois && antes !== depois) troca = { de: antes, para: depois }; }
      if (id === 'resultado' && t.value === 'Venda' && !str(ficha.planoFechado) && planoPorNome(ficha.plano)) { ficha.planoFechado = ficha.plano; setVal('planoFechado', ficha.plano); }
      save();
    };
    tf.addEventListener('input', onField); tf.addEventListener('change', onField);

    function setVal(id, v) { const el = qs('#f-' + id); if (!el) return; if (el.type === 'checkbox') el.checked = v === true; else el.value = v == null ? '' : v; }
    function syncForm() { F.forEach(([, fields]) => fields.forEach(f => setVal(f[0], ficha[f[0]]))); }

    /* importar a ficha da R1 */
    const LINHAS = {
      'Origem': ['origem', 'Origem'], 'Dados do Zyron': ['dadosZyron', 'Dados do Zyron'],
      'Características que chamaram atenção (Zyron)': ['caracteristicas', 'O que chamou atenção no Zyron'],
      'Experiência que ele contou (formulário)': ['experiencia', 'Experiência do formulário'],
      'Mora em': ['cidade', 'Cidade'], 'Decisores e como decidem': ['decisores', 'Decisores'], 'Telefones dos decisores': ['telefones', 'Telefones'],
      'Treina hoje': ['treina', 'Treina hoje'], 'Times e experiências': ['times', 'Times'], 'Peneiras e avaliações': ['peneiras', 'Peneiras'],
      'Sonho do atleta': ['sonho', 'Sonho'], 'O que ele acha que falta': ['falta', 'O que falta'], 'Dor da família (palavras deles)': ['dor', 'Dor'],
      'Já investiram': ['investido', 'Já investiram'], 'Locomoção pra outro estado': ['locomocao', 'Locomoção'],
      'Objeções que apareceram': ['objecoes', 'Objeções'], 'Sinais de budget': ['budget', 'Sinais de budget']
    };
    qs('#imp-go').addEventListener('click', () => {
      const txt = qs('#imp-txt').value || '';
      const got = [];
      const put = (k, v, lab) => { v = String(v == null ? '' : v).trim(); if (v === '') return; ficha[k] = v; got.push([lab || k, v]); };
      const yes = (k, v, lab) => { const t = String(v || '').trim().toLowerCase(); if (t === 'sim' || t === 'não' || t === 'nao') { ficha[k] = t === 'sim'; got.push([lab, t]); } };
      txt.split(/\r?\n/).forEach(line => {
        const i = line.indexOf(':'); if (i < 0) return;
        const lab = line.slice(0, i).trim(), val = line.slice(i + 1).trim();
        if (LINHAS[lab]) put(LINHAS[lab][0], val, LINHAS[lab][1]);
        else if (lab === 'Atleta') {
          const p = val.split(',').map(x => x.trim());
          put('nome', p[0], 'Nome'); put('idade', (p[1] || '').replace(/\D/g, ''), 'Idade'); put('posicao', p[2], 'Posição'); put('pe', (p[3] || '').replace(/^pé\s*/i, ''), 'Pé');
        }
        else if (lab === 'Pai') {
          const m = /^(.*?)\s*\|\s*Mãe:\s*(.*?)\s*\|\s*Outro responsável:\s*(.*)$/.exec(val);
          if (m) { put('pai', m[1], 'Pai'); put('mae', m[2], 'Mãe'); put('outro', m[3], 'Outro responsável'); } else put('pai', val, 'Pai');
        }
        else if (lab.indexOf('Empolgação') === 0) put('empolgacao', val, 'Empolgação');
        else if (lab === 'R2') {
          const parts = val.split('|'); const when = (parts[0] || '').trim();
          const m = /^(.*?)\s*(\d{1,2}\s*[h:]\s*\d{0,2})\s*$/i.exec(when);
          if (m) { put('r2dia', m[1].replace(/,\s*$/, ''), 'R2: dia'); put('r2hora', m[2], 'R2: hora'); } else put('r2dia', when, 'R2: dia');
          const c = /confirmados\?\s*(sim|não|nao)/i.exec(val); if (c) yes('confirmados', c[1], 'Decisores confirmados');
        }
      });
      // perguntas de sim ou não, que não têm dois-pontos
      const YN = [['Respondeu', 'lucro', 'Não faz sentido lucrar em cima'], ['Pré-compromisso', 'precomp', 'Pré-compromisso']];
      txt.split(/\r?\n/).forEach(line => {
        const m = /^(.*\?)\s*(sim|não|nao)\s*$/i.exec(line.trim()); if (!m || /^R2:/.test(line.trim())) return;
        const y = YN.find(x => m[1].indexOf(x[0]) === 0); if (y) yes(y[1], m[2], y[2]);
      });
      syncForm(); save();
      qs('#imp-out').innerHTML = got.length ? `<div class="pz-read-out"><p class="pz-h">Conferência: o que foi lido</p>${got.map(g => `<div><b>${esc(g[0])}:</b> ${esc(g[1])}</div>`).join('')}<p class="pz-small">Confira o que vai pra tela (origem, o que chamou atenção, experiência, sonho, dor) e defina o primeiro foco do plano.</p></div>` : '<p class="pz-small">Nenhuma linha reconhecida. Cole o texto do botão "Copiar ficha pro CRM" da R1.</p>';
    });

    const copy = (txt, btn, label) => {
      const done = () => { btn.textContent = 'Copiado'; setTimeout(() => { btn.textContent = label; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, () => fallback(txt, done)); else fallback(txt, done);
    };
    const fallback = (txt, done) => {
      const ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      if (ok) done(); else window.prompt('Não deu pra copiar sozinho. Copie daqui (Ctrl+C):', txt);
    };
    const plain = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    const resumoDia = () => plain(fill(window.FOLLOWUP.nao[0][1])).replace(/^"|"$/g, '');
    function crmText() {
      const d = derived(); const f = k => str(ficha[k]);
      const pf = planoPorNome(ficha.planoFechado);
      return [
        'Resultado da R2: ' + f('resultado'),
        'Atleta: ' + f('nome') + ', ' + d.idade + ', ' + f('posicao') + ', ' + f('cidade') + (d.peTxt ? ', ' + d.peTxt : '') + (d.alturaTxt ? ', ' + d.alturaTxt : ''),
        'Origem: ' + f('origem'),
        'O que mudou desde a R1: ' + f('mudou'),
        'Aspiração do atleta: ' + f('aspiracao'),
        'Primeiro foco do plano: ' + f('trabalhar'),
        'Plano fechado: ' + f('planoFechado') + (pf ? ' · ' + pf.ticket : ''),
        'Objeções na R2: ' + f('objecoesR2'),
        'Próximo contato: ' + f('proximoContato'),
        'Retorno combinado: ' + f('horaRetorno'),
        'Indicação: ' + f('indicacao'),
        'Observações: ' + f('observacoes')
      ].join('\n');
    }
    qs('#f-crm').addEventListener('click', e => copy(crmText(), e.target, 'Copiar resultado pro CRM'));
    qs('#f-dia').addEventListener('click', e => copy(resumoDia(), e.target, 'Copiar resumo do mesmo dia'));
    qs('#f-clear').addEventListener('click', () => {
      if (!confirm('Limpar a ficha desta call? Copie pro CRM antes de limpar.')) return;
      ficha = {}; troca = null; store.set(FKEY, ficha); send({ t: 'ficha', ficha });
      syncForm(); qs('#imp-out').innerHTML = ''; qs('#imp-txt').value = '';
      refreshAll(applyBind(document));
    });

    /* ----- ler antes ----- */
    const LER = [
      ['Nome do atleta', 'nome', '01, 02, 05, 10, 13, 16, 18, 19, 20, 22, 23, 25, 101, 102, 103, 104, 105 e 106 (e o selo de dossiê no canto)'], ['Origem do lead', 'origem', '01 e 02 (muda o texto)'],
      ['O que chamou atenção no Zyron', 'caracteristicas', '02, se veio do Zyron'], ['Experiência do formulário', 'experiencia', '02, se veio do formulário'],
      ['Posição, idade, cidade', 'posicao|idade|cidade', '02, 05 e o cartão do 10'], ['Posição que desenha o campo', 'posCampo', '10 (o campo) e 25 (a miniatura); vazio: campo sem destaque'],
      ['Pé e altura', 'peTxt|alturaTxt', 'cartão do 10 (vazio: a linha some)'], ['Código do dossiê (link do painel)', 'dossieCod', '01, 02, 10 e o selo no canto'],
      ['Sonho do atleta', 'sonho', '05'],
      ['Locomoção', 'locomocao', '05'], ['Primeiro foco do plano', 'trabalhar', '05, falado no 09 e o primeiro foco do relatório do 13'],
      ...(window.R2_PERSONAL ? [
        ['Relatório preparado no painel', 'zyronResumo|zyronFoco', '13 (a leitura e a prioridade do atleta)'],
        ['Clubes compatíveis do relatório', 'match1Clube|match2Clube|match3Clube', '16 (oportunidades preenchidas para este perfil)']
      ] : [['Vídeo e leitura do painel', 'leituraResumo', '13 (o jogo dele, lance a lance), 01 (o quadro na capa) e 05; sem vídeo, o 13 é a leitura ao vivo']]),
      ['Peneiras que ele fez', 'peneiras', '04, 11 e 12, só falado'], ['Caso espelho (nome, clube, país)', 'casoNome&casoClube', '02 (plantar), 16 (tela), 20 e 25'], ['Link do caso espelho', 'casoLink', '16, no WhatsApp'],
      ['Link da AGN', 'linkAgn', '16, no WhatsApp'], ['Já investiram (régua)', 'investido', '17, só falado'],
      ['Não faz sentido lucrar em cima', 'lucro', '20, só falado'], ['Quanto um atleta nosso fecha', 'faixaContrato', '20'], ['Prazo da garantia', 'garantiaPrazo', 'Garantia, depois dos preços (vazio: some)'],
      ['Plano que vou recomendar', 'plano', '23 (destaque no último avanço), 24 (o número e o que inclui) e 25; turma e vaga (14, 19 e 22) só no Legacy; vazio mostra o Legacy'],
      ['Vagas e próxima turma', 'vagas', '22, só no Legacy'], ['Gerente de carreira', 'gerente', '25, só no Legacy (e falado no 22 e no 24)'],
      ['Prazos confirmados', 'prazoContato&prazoZyron', '22 e 25 (o contato do gerente, só no Legacy)'], ['Hora do retorno', 'horaRetorno', '24, Modo B']
    ];
    function renderLer(d) {
      d = d || derived();
      const shown = k => k.split(/[|&]/).map(x => { const v = d[x]; return v === true ? 'sim' : filled(v) ? String(v) : ''; }).filter(Boolean).join(' · ');
      qs('#tab-ler').innerHTML = `
        <table class="pz-read"><tr><th>O que ler na ficha</th><th>Valor agora</th><th>Onde usar</th></tr>
        ${LER.map(r => { const ok = cond(r[1], d); return `<tr><td>${esc(r[0])}</td><td class="${ok ? 'ok' : 'miss'}">${ok ? esc(shown(r[1])) : 'falta'}</td><td>${esc(window.R2_REFERENCIA ? window.R2_REFERENCIA(r[2]) : r[2])}</td></tr>`; }).join('')}</table>
        <fieldset style="margin-top:12px"><legend>10 minutos antes da call</legend>${(window.CHECKLIST || []).map((c, k) => `<label class="ck"><input type="checkbox" data-chk="${k}"${ficha['chk' + k] ? ' checked' : ''}> ${esc(c)}</label>`).join('')}</fieldset>
        <div class="pz-actions"><button id="f-conf">Copiar mensagem de confirmação</button></div>`;
      qsa('[data-chk]', qs('#tab-ler')).forEach(c => c.addEventListener('change', () => { ficha['chk' + c.dataset.chk] = c.checked; store.set(FKEY, ficha); }));
      qs('#f-conf').addEventListener('click', e => {
        const t = (first(ficha.pai) || '[pai]') + ', aqui é o ' + (str(ficha.gestor) || '[seu nome]') + ', gestor de carreiras. Tô com o planejamento de carreira do ' + (d.nome || '[atleta]') + ' pronto pra nossa conversa das ' + (str(ficha.r2hora) || '[hora]') + '. Você, a ' + (first(ficha.mae) || '[mãe]') + ' e ele confirmados?';
        copy(t, e.target, 'Copiar mensagem de confirmação');
      });
    }

    /* ----- objeções ----- */
    qs('#tab-obj').innerHTML = `<div class="pz-method">${(window.METODO_OBJECAO || []).map(m => `<span>${esc(m)}</span>`).join('')}</div><p class="pz-small">${esc(window.PROIBIDO_OBJECAO || '')}</p>
      <div id="obj-list"></div>`;
    function renderObjBtns() {
      qs('#obj-list').innerHTML = (window.OBJECOES || []).map((o, k) => `<details class="pz-obj" data-k="${k}"><summary>${esc(o.q)}</summary>${o.prev ? `<p class="pz-small"><b>Prevenção:</b> ${fill(o.prev)}</p>` : ''}${list(o.resposta)}${o.proibido ? `<p class="pz-small"><b>Proibido:</b> ${esc(o.proibido)}</p>` : ''}<div class="pz-chips">${o.slides.filter(n => n >= 1 && n <= N).map(n => `<button data-go="${n - 1}">Slide ${String(n).padStart(2, '0')} · ${esc(ROT[n - 1] ? ROT[n - 1].nome : '')}</button>`).join('')}</div></details>`).join('');
    }

    /* ----- fechamento ----- */
    function renderFech() {
      const r = ROT[VAGA] || {};
      const p = planoDe(ficha.plano) || {}, n2 = i => String(i + 1).padStart(2, '0');
      qs('#tab-fech').innerHTML = `
        <div class="pz-chips">${TURMA >= 0 ? `<button data-go="${TURMA}">${p.turma ? 'A vaga' : 'O começo'} (${n2(TURMA)})</button>` : ''}${MATRIZ >= 0 ? `<button data-go="${MATRIZ}">Os planos (${n2(MATRIZ)})</button>` : ''}<button data-go="${VAGA}">O investimento (${n2(VAGA)})</button><button data-a="silence">Silêncio (S)</button><button data-go="${N - 1}">Bem-vindo (${n2(N - 1)})</button></div>
        ${PLANOS.length ? `<div class="pz-sec plano"><p class="pz-h">Plano na tela da família</p>
          <div class="pz-plan on"><div class="pz-plan-hd"><p class="pz-plan-nm">${esc(p.nome || '')}</p><b class="pz-plan-tk">${esc(p.ticket || '')}</b></div><p class="pz-plan-ds">${esc(p.descritor || '')} · ${/^A cada \d+ dias$/i.test(p.ritmo || '') ? '' : esc(p.ritmo || '') + ' · '}${esc(p.preco || '')} vitalício, 10x sem juros de ${esc(p.parcela || '')}</p></div>
          ${planoCtl('Trocar de plano, pelo escopo (a tela da família troca junto)')}
          <p class="pz-small">Link de pagamento: fora do deck. Depois do sim, mande no WhatsApp o link do plano fechado, na própria call, e acompanhe o pagamento na linha. Antes do sim, link nenhum.</p></div>` : ''}
        <div class="pz-sec"><p class="pz-h">Modo A: fechar na call</p>${list(r.fala || [])}</div>
        <div class="pz-sec"><p class="pz-h">Modo B: o retorno da equipe (a tela não muda)</p>${list(r.modoB || [])}</div>
        <div class="pz-sec ask"><p class="pz-h">Depois do sim</p>${list(window.FOLLOWUP.sim)}</div>
        <div class="pz-sec crm"><p class="pz-h">Depois do ainda não</p><p>${esc(window.FOLLOWUP.naoIntro)}</p><ul>${window.FOLLOWUP.nao.map(n => `<li><b>${esc(n[0])}:</b> ${fill(n[1])}</li>`).join('')}</ul>
        <div class="pz-actions"><button id="f-dia2">Copiar resumo do mesmo dia</button></div></div>`;
      qs('#f-dia2').addEventListener('click', e => copy(resumoDia(), e.target, 'Copiar resumo do mesmo dia'));
    }

    let linked = false;
    listen(m => {
      if (m.t === 'state') { if (!linked) { linked = true; qs('#pz-link').textContent = 'Deck conectado'; qs('#pz-link').classList.add('ok'); } show(m.i, m.step); }
      else if (m.t === 'ficha') { ficha = m.ficha || {}; syncForm(); refreshAll(applyBind(document)); }
      else if (m.t === 'local') { syncForm(); refreshAll(applyBind(document)); }
      else if (m.t === 'videoFalhou') { videoFalhou = true; refreshAll(applyBind(document)); avisoPainel('O vídeo do atleta não carregou na tela da família: o 12 voltou pra leitura ao vivo. Troque o compartilhamento pro vídeo dele no Meet.', false); }
    });
    const h = parseInt((location.hash || '').replace('#', ''), 10);
    cur = Number.isFinite(h) && h >= 1 && h <= N ? h - 1 : 0;
    show(cur);
    refreshAll();
    carregaPainel(() => { syncForm(); refreshAll(applyBind(document)); }, avisoPainel);
    send({ t: 'hello' });
    setTimeout(() => { if (!linked) qs('#pz-link').textContent = 'Abra o deck pelo botão Apresentador'; }, 1500);
  }
})();
