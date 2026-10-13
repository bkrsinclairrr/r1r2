/* Painel de Apresentações (R1 do SDR e R2 do closer): as telas. JS puro, sem biblioteca e sem CDN (a CSP só libera este domínio).
   Rotas por #: #/ os leads do usuário, #/todos (admin), #/novo (o R2; pro SDR, o R1) ou #/novo/<slug da variação> (a etapa é a da variação),
   #/novo-r1 (o admin) e #/r2/<código> o editor (de qualquer etapa; o código diz qual), #/versoes, #/usuarios (admin), #/senha.
   Todo texto que vem do servidor (nome, ficha, histórico) entra escapado (esc) ou como textContent, nunca como HTML cru. */
(function () {
  'use strict';
  const R = window.R2_REGRAS;
  const RL = window.RelatorioLeitura;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sem = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const T_OK = /^[a-z2-7]{26}$/;
  const ESTADOS = { rascunho: ['Rascunho', 'cinza'], pronto: ['Pronto', 'verde'], encerrado: ['Call encerrada', 'cinza'], expirado: ['Link expirado', 'vermelho'], revogado: ['Link revogado', 'vermelho'] };
  // os slides que a prévia abre (números do R2 novo de 27 slides; o deck confirma pelos títulos quando carrega)
  const PREVIA = [
    { nome: 'Capa', n: 1, obrig: true, rot: '01 Capa' },
    { nome: 'Por que você', n: 2, obrig: true, rot: '02 Por que você' },
    { nome: 'O seu lugar em campo', n: 11, obrig: true, rot: '11 Em campo' },
    { nome: 'O que ele leva', n: 19, obrig: false, rot: '19 O que ele leva', opc: 'leva' }, // opc: o slide opcional (R.VERSOES[].opcionais)
    { nome: 'Bem-vindo', n: 27, obrig: true, rot: '27 Bem-vindo' }
  ];
  let eu = null, config = { deckUrl: '', etapas: ['r2'], decks: [] }, itens = [], usuarios = [], filtro = 'proximos', listaTodos = false, destaque = null;
  let filtroEtapa = 'todas'; // a lista do admin: as duas etapas, só o R1 ou só o R2
  let etapaVer = 'r2'; // a etapa da aba Variações (o admin troca; o SDR e o closer têm uma só)
  // As duas etapas: o R1 é do SDR e o R2 do closer; o admin vê as duas. config.etapas diz o que o papel monta; config.decks, os decks do
  // catálogo (cada um com a origem, se é o de entrada e o que faz com a escolha do painel)
  const etapasDoPapel = () => (config.etapas && config.etapas.length ? config.etapas : ['r2']);
  const etapaPadrao = () => (etapasDoPapel().includes('r2') ? 'r2' : 'r1'); // a de #/novo
  const nomeEtapa = e => (e === 'r1' ? 'R1' : 'R2');
  const deckPor = id => (config.decks || []).find(d => d.id === id) || R.deckPor(id) || { id, nome: id, recursos: {} };
  const origemDeEntrada = etapa => { const d = (config.decks || []).find(x => x.etapa === etapa && x.entrada); return String((d && d.origem) || config.deckUrl || '').replace(/\/+$/, ''); };
  // as variações como valem agora (GET /api/versoes: as páginas dos decks e as que o admin criou, com a classificação, a nota e o que cada
  // uma mostra do lead). Até a resposta chegar, vale a reserva do código.
  let versoes = R.RESERVA_TODAS.map(v => Object.assign({ nota: '' }, v, { lead: Object.assign({ nome: true, foto: true }, v.lead) }));
  const versaoPor = (id, etapa) => R.versaoPor(id, versoes, etapa || etapaPadrao());
  let decksInfo = []; // como está a sincronização com cada deck (GET /api/versoes: decks)
  // a página da variação não está funcionando agora: saiu do deck, ou falhou em duas conferências seguidas (uma só pode ser um soluço de
  // rede: aparece o aviso, mas quem monta ainda escolhe, como a /api/r2 ainda abre a página). A principal da etapa nunca é bloqueada: é pra
  // onde as outras caem
  const quebrada = v => !!(v && v.id !== R.padraoDe(v.etapa) && v.base !== R.padraoDe(v.etapa) && (v.sumiu || (v.saude && v.saude.ok === false && v.saude.falhas >= 2)));
  const motivoDe = v => (v.sumiu ? 'A página saiu do deck' : (v.saude && v.saude.motivo) || 'A página não está funcionando agora');
  const COR_VAL = { validada: 'verde', 'em-validacao': 'azul', 'nao-validada': 'cinza' };
  const nomeVal = id => (R.VALIDACOES.find(n => n.id === id) || R.VALIDACOES[R.VALIDACOES.length - 1]).nome;
  const selo = v => `<span class="chip ${COR_VAL[v.validacao] || 'cinza'}" title="Classificação da variação (o admin decide)">${esc(nomeVal(v.validacao))}</span>`;
  let ed = null; // o editor aberto: { t, reg, base, sujo, emCall, check }
  let importado = null; // a ficha que veio do painel atual, pro editor novo
  let hashAtual = location.hash;

  /* ---------------- aviso ---------------- */
  let tAviso;
  function aviso(txt, ruim) {
    const a = $('#aviso');
    a.textContent = txt; a.classList.toggle('ruim', !!ruim); a.classList.add('on');
    clearTimeout(tAviso); tAviso = setTimeout(() => a.classList.remove('on'), ruim ? 6000 : 3200);
  }

  /* ---------------- api ---------------- */
  async function api(caminho, { metodo = 'GET', dados } = {}) {
    const op = { method: metodo, credentials: 'same-origin', headers: {} };
    if (metodo !== 'GET') { op.headers['Content-Type'] = 'application/json'; op.body = JSON.stringify(dados || {}); }
    let r;
    try { r = await fetch('/api/' + caminho, op); } catch (e) { throw new Error('Sem conexão com o painel. Confira a internet.'); }
    let j = {};
    try { j = await r.json(); } catch (e) { /* sem corpo */ }
    if (r.status === 401 && caminho !== 'sessao') { mostraEntrar(j.erro); throw Object.assign(new Error(j.erro || 'Entre de novo.'), { status: 401 }); }
    if (!r.ok) {
      const msg = j.erro || (r.status === 413 ? 'O arquivo ficou grande demais. Tente outra foto.' : 'Algo deu errado. Tente de novo.');
      throw Object.assign(new Error(msg), { status: r.status, j });
    }
    return j;
  }
  async function ocupado(bt, fn) {
    bt.disabled = true; bt.classList.add('ocupado');
    try { return await fn(); } finally { bt.disabled = false; bt.classList.remove('ocupado'); }
  }
  async function copia(txt) {
    try { await navigator.clipboard.writeText(txt); return true; }
    catch (e) {
      const t = document.createElement('textarea'); t.value = txt; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      t.remove(); return ok;
    }
  }
  const deckOrigem = etapa => { try { return new URL(origemDeEntrada(etapa || 'r2')).origin; } catch (e) { return ''; } };
  const linkDo = (t, etapa) => origemDeEntrada(etapa || 'r2') + '/?a=' + t;
  const fotoUrl = (t, v, n) => '/api/foto?t=' + t + '&v=' + v + '&n=' + n;
  const hora = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }); };
  const quando = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit' }) + ' às ' + hora(iso); };
  function ha(iso) {
    const s = Math.round((Date.now() - Date.parse(iso)) / 1000);
    if (!(s >= 0)) return '';
    if (s < 60) return 'agora há pouco';
    if (s < 3600) return 'há ' + Math.round(s / 60) + ' min';
    if (s < 86400) return 'há ' + Math.round(s / 3600) + ' h';
    return 'em ' + quando(iso);
  }
  const callTxt = (data, hm) => [R.diaDaCall(data), R.horaDaCall(hm)].filter(Boolean).join(' · ');
  const inicial = nome => (String(nome || '').trim()[0] || '?').toUpperCase();

  /* ---------------- entrar e sair ---------------- */
  function mostraEntrar(msg) {
    eu = null; ed = null;
    $('#v-app').hidden = true; $('#v-entrar').hidden = false;
    $$('dialog').forEach(d => { if (d.open) d.close(); });
    $('#entrar-erro').textContent = msg && !/sessão acabou/i.test(msg) ? msg : '';
    setTimeout(() => $('#f-entrar [name=login]').focus(), 30);
  }
  function mostraApp(u, cfg) {
    eu = u; config = Object.assign({ deckUrl: '', etapas: ['r2'], decks: [] }, cfg);
    $('#eu-nome').textContent = u.nome;
    $('#eu-papel').textContent = u.papelNome || u.papel;
    const adm = u.papel === 'admin', et = etapasDoPapel(), duas = et.length > 1;
    // cada papel vê o que é da etapa dele: o SDR o R1, o closer o R2, o admin as duas
    $('#marca-sub').textContent = 'Jogador de Elite · ' + (duas ? 'R1 e R2' : nomeEtapa(et[0]));
    $('#tab-meus').textContent = duas ? 'Meus leads' : 'Meus ' + nomeEtapa(et[0]);
    $('#tab-versoes').textContent = duas ? 'Variações' : 'Variações do ' + nomeEtapa(et[0]);
    $('#tab-todos').hidden = !adm; $('#tab-usu').hidden = !adm;
    $('#bt-novo').hidden = !et.includes('r2'); $('#bt-novo-r1').hidden = !et.includes('r1');
    $('#bt-importar').hidden = !et.includes('r2'); // só o R2 importa a ficha de um R1
    $('#filtro-etapa').hidden = !duas; $('#ver-etapa').hidden = !duas;
    $('#ajuda-r1').hidden = !et.includes('r1'); $('#ajuda-r2').hidden = !et.includes('r2');
    if (!et.includes(etapaVer)) etapaVer = et[et.length - 1];
    $('#v-entrar').hidden = true; $('#v-app').hidden = false;
    carregaVersoes();
    rota();
  }
  // as variações como valem agora; se não vier, fica o que já estava (nada quebra)
  async function carregaVersoes() {
    try { const j = await api('versoes'); versoes = j.versoes; decksInfo = j.decks || []; } catch (e) { return; }
    montaVersoes();
    if (!$('#aba-versoes').hidden) desenhaCartoesVersoes();
    if (ed && (ed.reg || !ed.t)) { desenhaOpcionais(tiradosAgora()); desenhaEditor(); }
  }
  $('#f-entrar').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target, bt = $('button[type=submit]', f);
    $('#entrar-erro').textContent = '';
    try {
      const j = await ocupado(bt, () => api('sessao', { metodo: 'POST', dados: { login: f.login.value, senha: f.senha.value } }));
      f.senha.value = '';
      mostraApp(j.usuario, j.config);
    } catch (err) { $('#entrar-erro').textContent = err.message; f.senha.select(); }
  });
  $('#bt-sair').addEventListener('click', async () => {
    if (ed && ed.sujo && !confirm('Tem mudança não salva. Sair mesmo assim?')) return;
    try { await api('sessao', { metodo: 'DELETE' }); } catch (e) { /* sai mesmo assim */ }
    if (ed) ed.sujo = false;
    location.hash = '#/';
    mostraEntrar();
  });

  /* ---------------- rotas ---------------- */
  const temMudanca = () => !!(ed && (ed.sujo || !$('#ft-recorte').hidden));
  function rota() {
    if (!eu) return;
    const h = location.hash || '#/';
    hashAtual = h;
    let m;
    if ((m = /^#\/r2\/([a-z2-7]{26})$/.exec(h))) return abreEditor(m[1]);
    if (h === '#/novo-r1' && etapasDoPapel().includes('r1')) return abreEditor(null, null, 'r1');
    if ((m = /^#\/novo(?:\/([a-z0-9-]+))?$/.exec(h))) return abreEditor(null, m[1]); // #/novo/<slug da variação>: já com a variação marcada (e a etapa dela)
    fechaEditor();
    if (h === '#/todos' && eu.papel === 'admin') return mostraLista(true);
    if (h === '#/usuarios' && eu.papel === 'admin') return mostraAba('usuarios');
    if (h === '#/versoes') return mostraAba('versoes');
    if (h === '#/senha') return mostraAba('senha');
    return mostraLista(false);
  }
  window.addEventListener('hashchange', () => {
    // saindo do editor com mudança não salva: pergunta; se ficar, volta o endereço sem recarregar nada
    const indo = location.hash || '#/';
    const mesmoEditor = ed && ed.t && indo === '#/r2/' + ed.t;
    if (temMudanca() && !mesmoEditor && !confirm('Tem mudança não salva neste lead. Sair sem salvar?')) {
      history.replaceState(null, '', hashAtual);
      return;
    }
    if (ed) ed.sujo = false;
    rota();
  });
  window.addEventListener('beforeunload', e => { if (temMudanca()) { e.preventDefault(); e.returnValue = ''; } });
  function marcaAba(nome) { $$('nav.abas .tab').forEach(t => t.setAttribute('aria-current', t.dataset.aba === nome ? 'page' : 'false')); }
  function mostraAba(nome) {
    $('#v-editor').hidden = true; $('#v-lista').hidden = false;
    $('#aba-lista').hidden = true; $('#aba-usuarios').hidden = nome !== 'usuarios'; $('#aba-senha').hidden = nome !== 'senha'; $('#aba-versoes').hidden = nome !== 'versoes';
    marcaAba(nome);
    if (nome === 'usuarios') carregaUsuarios();
    if (nome === 'versoes') { desenhaCartoesVersoes(); carregaVersoes(); }
  }

  /* ---------------- lista ---------------- */
  async function mostraLista(todos) {
    listaTodos = !!todos;
    $('#v-editor').hidden = true; $('#v-lista').hidden = false;
    $('#aba-lista').hidden = false; $('#aba-usuarios').hidden = true; $('#aba-senha').hidden = true; $('#aba-versoes').hidden = true;
    marcaAba(todos ? 'todos' : 'lista');
    $$('.filtro[data-filtro]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === filtro)));
    $('#lista').innerHTML = '<div class="vazio">Carregando…</div>';
    try {
      itens = (await api('atletas' + (todos ? '?todos=1' : ''))).itens || [];
      desenhaLista();
      // R2 de uma variação que esta tela ainda não conhece (criada há pouco): o chip diria Principal. Lê de novo e redesenha
      if (itens.some(it => it.versao && !versoes.some(v => v.id === it.versao))) carregaVersoes().then(desenhaLista);
    } catch (err) { if (err.status !== 401) $('#lista').innerHTML = '<div class="vazio">' + esc(err.message) + '</div>'; }
  }
  function desenhaLista() {
    const q = sem($('#busca').value.trim()), hoje = R.hojeSP(), et = etapasDoPapel(), duas = et.length > 1;
    $$('#filtro-etapa .filtro').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.etapa === filtroEtapa)));
    let vis = itens.filter(it => !q || sem(it.nome).includes(q) || sem(it.apelido).includes(q) || (listaTodos && sem(it.donoNome).includes(q)));
    if (duas && filtroEtapa !== 'todas') vis = vis.filter(it => (it.etapa || 'r2') === filtroEtapa);
    if (filtro === 'hoje') vis = vis.filter(it => it.r2data === hoje);
    if (filtro === 'proximos') vis = vis.filter(it => (!it.r2data || it.r2data >= hoje) && !['expirado', 'revogado', 'encerrado'].includes(it.estadoTela));
    vis.sort((a, b) => ((a.r2data || '9999') + (a.r2hm || '')).localeCompare((b.r2data || '9999') + (b.r2hm || '')) || String(b.atualizadoEm).localeCompare(String(a.atualizadoEm)));
    if (!itens.length) {
      const rot = duas ? 'lead' : nomeEtapa(et[0]);
      $('#lista').innerHTML = '<div class="vazio"><p class="titulo">Nenhum ' + rot + ' ainda</p><p>Clique em <b>' + (duas ? 'Novo R1 ou Novo R2' : 'Novo ' + rot) + '</b> para gerar uma apresentação. Todos os campos de personalização são opcionais.</p></div>';
      return;
    }
    if (!vis.length) {
      $('#lista').innerHTML = '<div class="vazio">' + (q ? 'Nada com “' + esc($('#busca').value) + '”.' : filtro === 'hoje' ? 'Nenhuma call marcada pra hoje.' : 'Nada por aqui. Veja em <b>Todos</b>.') + '</div>';
      return;
    }
    $('#lista').innerHTML = vis.map(it => {
      const etapa = it.etapa === 'r1' ? 'r1' : 'r2';
      const [est, cor] = ESTADOS[it.estadoTela] || ESTADOS.rascunho;
      const call = callTxt(it.r2data, it.r2hm);
      const av = it.foto ? `<img class="av" src="${esc(fotoUrl(it.t, 'avatar', it.foto))}" alt="" loading="lazy" data-ini="${esc(inicial(it.apelido || it.nome))}">` : `<span class="av ini" aria-hidden="true">${esc(inicial(it.apelido || it.nome))}</span>`;
      const link = linkDo(it.t, etapa);
      const ver = it.versao ? versaoPor(it.versao, etapa) : null;
      return `<article class="item${it.t === destaque ? ' novo' : ''}">
        <div class="item-topo">${av}<div style="min-width:0"><h3>${esc(it.nome)}</h3>
          <p class="meta">${call ? '<b>' + esc(call) + '</b>' : 'Sem dia marcado'}${it.posicao ? ' · ' + esc(it.posicao) : ''}${listaTodos && it.donoNome ? ' · de <b>' + esc(it.donoNome) + '</b>' : ''}</p></div></div>
        <div class="chips">${duas ? `<span class="chip ${etapa}" title="${etapa === 'r1' ? 'R1, do SDR' : 'R2, do closer'}">${nomeEtapa(etapa)}</span>` : ''}${it.emCall ? '<span class="chip pulsa">Em call agora</span>' : ''}<span class="chip ${cor}">${esc(est)}</span>${etapa === 'r1' ? '' : it.plano ? '<span class="chip">' + esc(it.plano) + '</span>' : '<span class="chip cinza">Sem plano</span>'}${ver ? '<span class="chip ' + (COR_VAL[ver.validacao] || 'azul') + '" title="Variação do ' + nomeEtapa(etapa) + ' (' + esc(nomeVal(ver.validacao).toLowerCase()) + ')">' + esc(ver.nome) + '</span>' : ''}${it.video ? '<span class="chip azul">Vídeo</span>' : ''}</div>
        <div class="acoes"><a class="bt ouro" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Abrir o ${nomeEtapa(etapa)}</a><button class="bt" type="button" data-copia="${esc(link)}">Copiar link</button><a class="bt" href="#/r2/${esc(it.t)}">Editar</a>${listaTodos ? `<button class="bt perigo" type="button" data-apaga="${esc(it.t)}">Apagar</button>` : ''}</div>
      </article>`;
    }).join('');
  }
  // avatar que não carrega (foto vencida, link revogado): fica a inicial
  $('#lista').addEventListener('error', e => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.classList.contains('av')) return;
    const s = document.createElement('span'); s.className = 'av ini'; s.setAttribute('aria-hidden', 'true'); s.textContent = img.dataset.ini || '?';
    img.replaceWith(s);
  }, true);
  $('#busca').addEventListener('input', desenhaLista);
  $$('.filtro[data-filtro]').forEach(b => b.addEventListener('click', () => { filtro = b.dataset.filtro; $$('.filtro[data-filtro]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); desenhaLista(); }));
  $$('#filtro-etapa .filtro').forEach(b => b.addEventListener('click', () => { filtroEtapa = b.dataset.etapa; desenhaLista(); }));
  $('#lista').addEventListener('click', async e => {
    const c = e.target.closest('[data-copia]');
    if (c) { aviso((await copia(c.dataset.copia)) ? 'Link copiado.' : 'Não deu pra copiar. Abra o R2 e copie da barra de endereço.', false); return; }
    const ap = e.target.closest('[data-apaga]');
    if (ap) {
      const it = itens.find(x => x.t === ap.dataset.apaga);
      if (!it || !confirm('Apagar tudo do ' + nomeEtapa(it.etapa) + ' de ' + it.nome + '? Foto, vídeo e leitura somem e o link para de funcionar.')) return;
      try { await ocupado(ap, () => api('atletas?t=' + it.t, { metodo: 'DELETE' })); itens = itens.filter(x => x !== it); desenhaLista(); aviso(nomeEtapa(it.etapa) + ' apagado.'); }
      catch (err) { aviso(err.message, true); }
    }
  });

  /* ---------------- a aba Variações do R2: todas, a classificação de cada uma e o que ela mostra do lead ---------------- */
  // O admin cria variações novas (sobre a página de uma apresentação que já existe no deck), muda a classificação, a nota e o que
  // cada uma mostra do lead (nome e sobrenome, foto) e arquiva as que não servem mais: vale na hora, sem publicar
  // o que a variação mostra do lead, em texto: o deck que segue a escolha de nome (o R2 novo) diz pelo que o admin ajustou; os outros, pelo que o deck faz
  const textoLead = v => {
    const rec = v.recursos || { nomeTela: true, foto: true };
    if (rec.dossie) return 'Foto somente no slide de escolha. Nome, relatório e oportunidades do jogador distribuídos na apresentação.';
    if (!rec.nomeTela) return (deckPor(v.deck) || {}).leadTxt || (R.deckPor(v.deck) || {}).leadTxt || (v.lead.nome ? 'aparece o nome do lead' : 'não mostra o nome do lead');
    return v.lead.nome ? 'aparecem o nome e o sobrenome do lead' + (v.lead.foto ? ', com a foto dele' : ', sem a foto dele') : 'não mostra o nome nem a foto do lead (apresentação geral)';
  };
  let novaVariacao = null; // o slug da que acabou de ser criada: a ficha dela fica em destaque
  // a faixa de cima: quando o painel falou com os decks da etapa, quantas páginas e se alguma está com problema. Com um deck só, uma
  // linha; com vários, a linha e depois cada deck
  function desenhaSincronia(adm) {
    const ds = decksInfo.filter(d => d.etapa === etapaVer), faixa = $('#sinc-status');
    $('#bt-sincroniza').hidden = !adm;
    if (!ds.length || !ds.some(d => d.em)) { $('#sinc-texto').textContent = 'Conferindo com ' + (ds.length > 1 ? 'os decks' : 'o deck') + '…'; faixa.classList.remove('problema'); return; }
    const partes = [], d = ds[0];
    if (ds.length === 1) {
      if (d.falhou) partes.push('<b class="ruim">Não consegui falar com o deck ' + esc(ha(d.em)) + '.</b>' + (adm && d.falha ? ' ' + esc(d.falha) + '.' : '') + ' A lista é ' + (d.okEm ? 'a de ' + esc(quando(d.okEm)) : 'a de reserva do painel') + '.');
      else partes.push('<b>Sincronizado com o deck</b> ' + esc(ha(d.em)) + ' · ' + d.paginas + (d.paginas === 1 ? ' página' : ' páginas'));
      if (!d.falhou) partes.push(d.problemas ? '<span class="ruim">' + d.problemas + ' com problema</span>' : 'todas funcionando');
      if (adm && d.desatualizadas) partes.push(d.desatualizadas + ' com o variacoes.json velho (rode o gera-manifesto.mjs)');
      if (adm && d.sumiram) partes.push(d.sumiram + (d.sumiram === 1 ? ' saiu do deck' : ' saíram do deck'));
      $('#sinc-texto').innerHTML = partes.join(' · ');
    } else {
      const falhou = ds.filter(x => x.falhou), paginas = ds.reduce((n, x) => n + x.paginas, 0), problemas = ds.reduce((n, x) => n + x.problemas, 0);
      const em = ds.map(x => x.em).filter(Boolean).sort().pop();
      partes.push('<b' + (falhou.length ? ' class="ruim"' : '') + '>' + (falhou.length ? 'Nem todos os decks responderam' : 'Sincronizado com os decks') + '</b> ' + esc(ha(em)) + ' · ' + paginas + (paginas === 1 ? ' página' : ' páginas'));
      partes.push(problemas ? '<span class="ruim">' + problemas + ' com problema</span>' : 'todas funcionando');
      if (adm && ds.some(x => x.desatualizadas)) partes.push('variacoes.json velho em ' + ds.filter(x => x.desatualizadas).map(x => x.nome).join(', ') + ' (rode o gera-manifesto.mjs)');
      if (adm && ds.some(x => x.sumiram)) partes.push(ds.reduce((n, x) => n + x.sumiram, 0) + ' saiu do deck');
      $('#sinc-texto').innerHTML = partes.join(' · ') + '<ul class="decks">' + ds.map(x => '<li class="' + (x.falhou || x.problemas ? 'ruim' : 'ok') + '"><b>' + esc(x.nome) + '</b>: ' +
        (x.falhou ? 'não consegui falar com o deck' + (adm && x.falha ? ' (' + esc(x.falha) + ')' : '') : x.paginas + (x.paginas === 1 ? ' página' : ' páginas') + (x.problemas ? ', ' + x.problemas + ' com problema' : ', todas funcionando')) + '</li>').join('') + '</ul>';
    }
    faixa.classList.toggle('problema', ds.some(x => x.falhou || x.problemas));
  }
  const seloSaude = (v, adm) => {
    const alvo = nomeEtapa(v.etapa);
    if (v.sumiu) return '<span class="chip cinza" title="A página saiu do deck. Os ' + alvo + ' que usam ela abrem a Principal.">Saiu do deck</span>';
    const x = v.saude;
    if (x && x.ok === false) return x.falhas >= 2
      ? '<span class="chip vermelho" title="' + esc(x.motivo + (quebrada(v) ? ' Os ' + alvo + ' que usam essa página abrem a Principal até ela voltar.' : '')) + '">Com problema</span>'
      : '<span class="chip cinza" title="' + esc(x.motivo + ' Conferindo de novo daqui a pouco.') + '">Conferindo de novo</span>';
    return (x ? '<span class="saude ok" title="A página abre, tem o motor do deck e o número de slides certo.">● Funcionando</span>' : '') + (adm && v.nova ? '<span class="chip azul" title="A página apareceu no deck nos últimos 7 dias.">Nova no deck</span>' : '') +
      (adm && x && x.desatualizado ? '<span class="chip" title="A página mudou depois do variacoes.json: rode o gera-manifesto.mjs no deck.">variacoes.json velho</span>' : '');
  };
  // o motivo em texto, no cartão (no celular não tem mouse pra ver o title): a página bloqueada, pra todos; a falha de uma conferência só, pro admin
  const notaSaude = (v, adm) => {
    if (v.arquivada) return '';
    if (quebrada(v)) return '<p class="meta indisponivel"><b>Indisponível agora:</b> ' + esc(motivoDe(v)) + '. Os ' + nomeEtapa(v.etapa) + ' que usam essa página abrem a Principal' + (v.sumiu && adm ? '. Se não vai mais usar, arquive' : ' até ela voltar') + '.</p>';
    const x = v.saude;
    return adm && x && x.ok === false ? '<p class="meta indisponivel"><b>A última conferência falhou:</b> ' + esc(x.motivo) + '. Confere de novo daqui a pouco.</p>' : '';
  };
  const NOTA_VER = {
    r1: 'Todas as variações da apresentação do R1 num lugar só. A classificação ao lado do nome (Validada, Em validação ou Não validada) mostra o quanto cada uma já foi validada, e a mais validada vem primeiro. A cada lead, o SDR escolhe a variação e gera a apresentação dele: o link é um só por lead, e dá pra trocar de variação até a hora da call. As páginas do deck entram aqui sozinhas e o painel confere se cada uma está funcionando. <b>Abrir exemplo</b> mostra a variação sem lead, só pra ver.'
  };
  function desenhaCartoesVersoes() {
    const adm = !!(eu && eu.papel === 'admin'), et = etapasDoPapel();
    if (!et.includes(etapaVer)) etapaVer = et[et.length - 1];
    const abertos = new Set($$('#versoes-lista details[open]').map(d => d.dataset.v));
    const lista = versoes.filter(v => v.etapa === etapaVer), varios = (config.decks || []).filter(d => d.etapa === etapaVer).length > 1;
    $('#bt-nova-variacao').hidden = !adm;
    $('#vr-titulo').textContent = 'Variações do ' + nomeEtapa(etapaVer);
    $$('#ver-etapa .filtro').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.etapa === etapaVer)));
    // o texto de cima: o do R2 está no HTML; o do R1 entra por aqui (e o do R2 volta quando a etapa volta)
    const nota = $('#aba-versoes .painel > p.nota');
    if (nota) { if (!('r2' in nota.dataset)) nota.dataset.r2 = nota.innerHTML; nota.innerHTML = etapaVer === 'r1' ? NOTA_VER.r1 : nota.dataset.r2; }
    desenhaSincronia(adm);
    $('#versoes-lista').innerHTML = R.ordenaVersoes(lista).filter(v => adm || !v.arquivada).map(v => {
      const rec = v.recursos || { nomeTela: true, foto: true, pular: true };
      const ops = v.opcionais.length && rec.pular ? `<p class="meta"><b>Slides que dá pra tirar da sequência:</b> ${v.opcionais.map(o => esc(o.rotulo.replace('{nome}', 'atleta')) + ' (slide ' + o.slide + ')').join('; ')}.</p>` : '';
      const quandoUsar = v.quando ? `<p class="meta"><b>Quando usar:</b> ${esc(v.quando)}</p>` : '';
      const nota = v.nota ? `<p class="meta"><b>Nota:</b> ${esc(v.nota)}</p>` : '';
      const deBase = v.criada ? `<p class="meta"><b>Baseada em:</b> ${esc(versaoPor(v.base, v.etapa).nome)}${varios ? ' (' + esc(deckPor(v.deck).nome) + ')' : ''}${adm && v.criadoPor ? ' · criada por ' + esc(v.criadoPor.nome) + ' em ' + esc(quando(v.criadoEm)) : ''}</p>` : '';
      const camposCriada = v.criada ? `
            <label class="campo"><span>Nome da variação</span><input class="in" data-aj="nomeVar" maxlength="40" value="${esc(v.nome)}"></label>
            <label class="campo"><span>Quando usar</span><input class="in" data-aj="quando" maxlength="300" value="${esc(v.quando)}"></label>` : '';
      const arquivar = v.id === R.padraoDe(v.etapa) ? '' : `
            <label class="ck largo"><input type="checkbox" data-aj="arquivada"${v.arquivada ? ' checked' : ''}> <span>Arquivada: some pro ${v.etapa === 'r1' ? 'SDR' : 'closer'} (os ${nomeEtapa(v.etapa)} que já usam ela continuam como estão)</span></label>`;
      const ajustes = adm ? `<details class="ajustes" data-v="${esc(v.id)}"${abertos.has(v.id) ? ' open' : ''}><summary>Ajustes do admin</summary>
          <div class="grade">${camposCriada}
            <label class="campo"><span>Classificação</span><select class="in" data-aj="validacao">${R.VALIDACOES.map(n => `<option value="${esc(n.id)}"${n.id === v.validacao ? ' selected' : ''}>${esc(n.nome)}</option>`).join('')}</select></label>
            <label class="campo"><span>Nota (quem monta vê)</span><input class="in" data-aj="nota" maxlength="160" value="${esc(v.nota)}" placeholder="Ex.: fechou 5 de 8 calls"></label>
            <label class="ck"><input type="checkbox" data-aj="nome"${v.lead.nome ? ' checked' : ''}${rec.nomeTela ? '' : ' disabled'}> <span>Aparece o nome e o sobrenome do lead${rec.nomeTela ? '' : ' (este deck sempre mostra o nome)'}</span></label>
            <label class="ck"><input type="checkbox" data-aj="foto"${v.lead.foto ? ' checked' : ''}${v.lead.nome && rec.foto ? '' : ' disabled'}> <span>Aparece a foto do lead${rec.foto ? '' : ' (este deck não mostra a foto)'}</span></label>${arquivar}
          </div>
          <div class="acoes"><button class="bt ouro" type="button" data-salva-aj="${esc(v.id)}">Salvar ajustes</button></div>
          ${v.ajustadoPor ? `<p class="nota">Ajustada por ${esc(v.ajustadoPor.nome)} em ${esc(quando(v.ajustadoEm))}.</p>` : ''}
        </details>` : '';
      const exemplo = String(v.origem || origemDeEntrada(v.etapa)).replace(/\/+$/, '') + v.caminho;
      return `<article class="item versao-card${v.arquivada ? ' arquivada' : ''}${v.id === novaVariacao ? ' novo' : ''}" data-v="${esc(v.id)}"><div class="versao-titulo"><h3>${esc(v.nome)}</h3>${selo(v)}${varios ? `<span class="chip deck" title="O deck desta variação">${esc(deckPor(v.deck).nome)}</span>` : ''}${v.arquivada ? '<span class="chip cinza">Arquivada</span>' : ''}${seloSaude(v, adm)}</div><p class="meta">${esc(v.resumo)}</p>${quandoUsar}${nota}${deBase}${notaSaude(v, adm)}
        <p class="meta"><b>No ${nomeEtapa(v.etapa)} do lead:</b> ${esc(textoLead(v))}.</p>${ops}
        <p class="meta slug">slug <code>${esc(v.id)}</code></p>
        <div class="acoes">${v.arquivada ? '' : (quebrada(v) ? `<span class="bt ouro off" aria-disabled="true" title="${esc(motivoDe(v))}">Gerar apresentação pra um lead</span>` : `<a class="bt ouro" href="#/novo/${esc(v.id)}">Gerar apresentação pra um lead</a>`)}<a class="bt" href="${esc(exemplo)}" target="_blank" rel="noopener noreferrer">Abrir exemplo</a></div>${ajustes}</article>`;
    }).join('') + (etapaVer === 'r2' && (config.decks || []).some(d => d.etapa === 'r2' && d.recursos && d.recursos.nomeTela) ? `<div class="painel versoes-nome"><h2 class="titulo">Nome e foto do lead na tela</h2><p class="nota" style="margin:0 0 10px">Se escolhe no R2 de cada lead, dentro do que a variação mostra. Exemplo com Lucas Almeida da Silva:</p>
      <ul class="versoes-nome-lista">${R.NOMES_TELA.map(n => `<li><b>${esc(n.nome)}</b> · ${n.id === 'sem' ? 'a tela não mostra nome nem foto' : esc(R.comoChama('Lucas Almeida da Silva', '', n.id))}<small>${esc(AJUDA_NOME[n.id])}</small></li>`).join('')}</ul><p class="nota">A foto aparece junto com o nome. A caixa "Mostrar a foto do lead na tela", no R2, tira só a foto: o nome continua e o quadro mostra a inicial. Uma variação que não mostra o nome ou a foto do lead não oferece essas escolhas. Só o R2 novo segue essas escolhas: os outros decks mostram o nome do jeito deles.</p></div>` : '');
  }

  $$('#ver-etapa .filtro').forEach(b => b.addEventListener('click', () => { etapaVer = b.dataset.etapa; desenhaCartoesVersoes(); }));
  $('#bt-sincroniza').addEventListener('click', async e => {
    try {
      const j = await ocupado(e.currentTarget, () => api('versoes?acao=sincronizar', { metodo: 'POST', dados: {} }));
      versoes = j.versoes; decksInfo = j.decks || [];
      montaVersoes(); desenhaCartoesVersoes();
      const ds = decksInfo.filter(d => d.etapa === etapaVer), falhou = ds.some(d => d.falhou), problemas = ds.reduce((n, d) => n + d.problemas, 0);
      const quem = ds.length > 1 ? 'os decks' : 'o deck';
      if (falhou) aviso(ds.length > 1 ? 'Não consegui falar com todos os decks. Fica a última lista dos que não responderam.' : 'Não consegui falar com o deck. Fica a última lista.', true);
      else if (problemas) aviso('Sincronizado com ' + quem + '. ' + problemas + (problemas === 1 ? ' página com problema.' : ' páginas com problema.'), true);
      else aviso('Sincronizado com ' + quem + '.');
    } catch (err) { aviso(err.message, true); }
  });
  // sem o nome do lead na tela, a foto também não aparece
  $('#versoes-lista').addEventListener('change', e => {
    const n = e.target.closest('[data-aj="nome"]');
    if (!n) return;
    const foto = $('[data-aj="foto"]', n.closest('details'));
    foto.disabled = !n.checked;
    if (!n.checked) foto.checked = false;
  });
  $('#versoes-lista').addEventListener('click', async e => {
    const bt = e.target.closest('[data-salva-aj]');
    if (!bt) return;
    const d = bt.closest('details');
    const dados = { validacao: $('[data-aj="validacao"]', d).value, nota: $('[data-aj="nota"]', d).value, lead: { nome: $('[data-aj="nome"]', d).checked, foto: $('[data-aj="foto"]', d).checked } };
    const nomeVar = $('[data-aj="nomeVar"]', d), arquivada = $('[data-aj="arquivada"]', d);
    if (nomeVar) { dados.nome = nomeVar.value; dados.quando = $('[data-aj="quando"]', d).value; }
    if (arquivada) dados.arquivada = arquivada.checked;
    try {
      const j = await ocupado(bt, () => api('versoes?id=' + encodeURIComponent(bt.dataset.salvaAj), { metodo: 'PUT', dados }));
      versoes = j.versoes;
      montaVersoes();
      desenhaCartoesVersoes();
      aviso('Ajustes salvos.');
    } catch (err) { aviso(err.message, true); }
  });

  // Nova variação (só o admin): o nome, a página do deck em que se baseia (de qualquer deck da etapa que está na tela), a classificação e o que
  // mostra do lead; o painel gera o slug. O deck que não segue a escolha de nome ou de foto trava essas caixas
  const ajustaLeadDaBase = () => {
    const b = versoes.find(v => v.id === $('#dv-base').value), rec = (b && b.recursos) || { nomeTela: true, foto: true };
    $('#dv-lead-nome').disabled = !rec.nomeTela; if (!rec.nomeTela) $('#dv-lead-nome').checked = true;
    $('#dv-lead-foto').disabled = !rec.foto || !$('#dv-lead-nome').checked; if (!rec.foto) $('#dv-lead-foto').checked = false;
  };
  $('#bt-nova-variacao').addEventListener('click', () => {
    const dis = versoes.filter(v => v.etapa === etapaVer && !v.criada && !v.arquivada && !quebrada(v));
    const varios = (config.decks || []).filter(d => d.etapa === etapaVer).length > 1;
    $('#dv-base').innerHTML = dis.map(v => `<option value="${esc(v.id)}">${esc(v.nome)}${varios ? ' · ' + esc(deckPor(v.deck).nome) : ''}</option>`).join('');
    $('#dv-validacao').innerHTML = R.VALIDACOES.map(n => `<option value="${esc(n.id)}"${n.id === R.VALIDACAO_PADRAO ? ' selected' : ''}>${esc(n.nome)}</option>`).join('');
    $('#dv-nome').value = ''; $('#dv-quando').value = ''; $('#dv-erro').textContent = '';
    $('#dv-lead-nome').checked = true; $('#dv-lead-foto').checked = true; $('#dv-lead-foto').disabled = false;
    ajustaLeadDaBase();
    $('#d-variacao').showModal();
    setTimeout(() => $('#dv-nome').focus(), 30);
  });
  $('#dv-base').addEventListener('change', ajustaLeadDaBase);
  $('#dv-cancelar').addEventListener('click', () => $('#d-variacao').close());
  $('#dv-lead-nome').addEventListener('change', e => { $('#dv-lead-foto').disabled = !e.target.checked || !((versoes.find(v => v.id === $('#dv-base').value) || {}).recursos || { foto: true }).foto; if (!e.target.checked) $('#dv-lead-foto').checked = false; });
  $('#f-variacao').addEventListener('submit', async e => {
    e.preventDefault();
    $('#dv-erro').textContent = '';
    const dados = { nome: $('#dv-nome').value, base: $('#dv-base').value, quando: $('#dv-quando').value, validacao: $('#dv-validacao').value, lead: { nome: $('#dv-lead-nome').checked, foto: $('#dv-lead-foto').checked } };
    try {
      const j = await ocupado($('#dv-ir'), () => api('versoes', { metodo: 'POST', dados }));
      versoes = j.versoes; novaVariacao = j.criada;
      $('#d-variacao').close();
      montaVersoes(); desenhaCartoesVersoes();
      aviso('Variação criada. O slug dela é ' + j.criada + '.');
      const ficha = $('#versoes-lista [data-v="' + j.criada + '"]');
      if (ficha) ficha.scrollIntoView({ block: 'center' });
    } catch (err) { $('#dv-erro').textContent = err.message; }
  });

  /* ---------------- importar do painel atual ---------------- */
  $('#bt-importar').addEventListener('click', () => { $('#di-erro').textContent = ''; $('#di-link').value = ''; $('#d-importar').showModal(); setTimeout(() => $('#di-link').focus(), 30); });
  $('#di-cancelar').addEventListener('click', () => $('#d-importar').close());
  $('#f-importar').addEventListener('submit', async e => {
    e.preventDefault();
    $('#di-erro').textContent = '';
    try {
      const j = await ocupado($('#di-ir'), () => api('importar', { metodo: 'POST', dados: { id: $('#di-link').value } }));
      importado = { ficha: j.ficha || {}, fora: j.fora || [] };
      $('#d-importar').close();
      if (location.hash === '#/novo') abreEditor(null); else location.hash = '#/novo';
    } catch (err) { $('#di-erro').textContent = err.message; }
  });

  /* ---------------- editor ---------------- */
  const F = $('#f-editor');
  const campo = n => F.elements.namedItem(n);
  // os campos que são um valor só do formulário; a variação (radio) e os slides desmarcados (checkbox) têm funções próprias
  const CHAVES = ['nome', 'apelido', 'nomeTela', 'posicao', 'idade', 'cidade', 'pe', 'altura', 'origem', 'sonho', 'caracteristicas', 'experiencia', 'r2data', 'r2hm', 'plano', 'vagas', 'proximaTurma', 'gerente', 'prazoContato', 'prazoZyron', ...R.CAMPOS_DOSSIE.map(c => c.chave)];
  const campoDossie = c => `<label class="campo${c.area ? ' largo' : ''}"><span>${esc(c.nome)}</span>${c.area
    ? `<textarea class="in" name="${c.chave}" rows="2" maxlength="${c.max}"></textarea>`
    : `<input class="in" name="${c.chave}" ${c.numero ? `type="number" min="${c.numero[0]}" max="${c.numero[1]}" step="1" placeholder="0 a 100"` : `maxlength="${c.max}"`}>`}</label>`;
  $('#dossie-campos').innerHTML = '<div class="grade">' + R.CAMPOS_DOSSIE.filter(c => !c.clube && !c.indicador).map(campoDossie).join('') + '</div>'
    + '<details class="dossie-grupo"><summary>Indicadores individuais do relatório</summary><p class="dica">Notas de 0 a 100, somente as que o Zyron informou. A apresentação não calcula nem completa notas.</p><div class="grade">'
    + R.CAMPOS_DOSSIE.filter(c => c.indicador).map(campoDossie).join('') + '</div></details>'
    + [1, 2, 3].map(n => `<details class="dossie-grupo"${n === 1 ? ' open' : ''}><summary>Clube compatível ${n}</summary><p class="dica">Clube, posição, categoria e motivo do encaixe. O percentual é opcional e deve ser o do relatório. Compatibilidade de perfil não confirma vaga ou convite.</p><div class="grade">${R.CAMPOS_DOSSIE.filter(c => c.clube === n).map(campoDossie).join('')}</div></details>`).join('');
  // o R1 usa só a ficha do atleta, o que vai pro CRM e o dia e a hora da R2 (o resto é do R2)
  const CHAVES_R1 = ['nome', 'posicao', 'idade', 'cidade', 'origem', 'caracteristicas', 'experiencia', 'r2data', 'r2hm'];
  // a etapa do editor aberto (a do lead, ou a do R1 ou R2 novo) e o que o deck da variação marcada faz com a escolha do painel
  const etapaEd = () => (ed && ed.etapa) || etapaPadrao();
  const recursosDe = id => (versaoPor(id, etapaEd()).recursos || { nomeTela: true, foto: true, pular: true });
  const opcoes = (sel, lista) => { sel.innerHTML = '<option value="">escolha</option>' + lista.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join(''); };
  opcoes(campo('pe'), R.PES); opcoes(campo('origem'), R.ORIGENS); opcoes(campo('plano'), R.PLANOS.slice().reverse());
  opcoes(campo('prazoContato'), R.PRAZOS.contato); opcoes(campo('prazoZyron'), R.PRAZOS.zyron);
  $('#posicoes').innerHTML = R.SUGESTOES.map(p => `<option value="${esc(p)}"></option>`).join('');

  function leFicha() {
    const f = {}, et = etapaEd();
    (et === 'r1' ? CHAVES_R1 : CHAVES).forEach(k => { const v = String(campo(k).value || '').trim(); if (v) f[k] = v; });
    if (f.plano !== R.LEGACY) { delete f.vagas; delete f.proximaTurma; }
    if (versaoMarcada() !== R.padraoDe(et)) f.versao = versaoMarcada();
    // o que o deck da variação não faz não conta (o R2 anterior e o R1 não seguem nome na tela, foto nem slide opcional)
    const rec = recursosDe(versaoMarcada());
    if (!rec.nomeTela) delete f.nomeTela;
    if (rec.foto && !$('#c-foto-tela').checked) f.semFoto = 'sim'; // só a foto fica de fora (o nome continua)
    const tirados = tiradosAgora();
    if (rec.pular && tirados.length) f.pular = tirados.join(',');
    return f;
  }
  function poeFicha(f) {
    desenhaNomeTela(true);
    opcoes(campo('plano'), R.planosDaVersao(versaoPor(f && f.versao, etapaEd())).slice().reverse());
    CHAVES.forEach(k => { campo(k).value = f && f[k] != null ? (k === 'plano' ? R.PLANOS_ANTIGOS[f[k]] || f[k] : f[k]) : ''; });
    campo('nota').value = '';
    $('#c-foto-tela').checked = !(f && f.semFoto === 'sim');
    montaVersoes(f && f.versao); // a variação que o R2 já usa aparece mesmo arquivada
    marcaVersao(f && f.versao);
    desenhaOpcionais(String((f && f.pular) || '').split(',').filter(Boolean));
  }

  /* ---------------- variação do R2, nome na tela e slides da sequência ---------------- */
  // As variações vêm de GET /api/versoes (as páginas do cadastro do código e as que o admin criou, com a classificação e o que
  // cada uma mostra do lead): o painel não conhece nenhuma pelo nome. Do mais validado ao menos, cada uma com a classificação ao
  // lado do nome; as arquivadas só aparecem se o R2 já usa. O link do lead é sempre o mesmo; o deck abre a variação que estiver
  // gravada aqui (a /api/r2 manda o caminho da página dela).
  function montaVersoes(manter) {
    const et = etapaEd();
    const atual = manter || ($('#versoes input[name=versao]:checked') ? versaoMarcada() : R.padraoDe(et));
    const varios = (config.decks || []).filter(d => d.etapa === et).length > 1;
    $('#versoes').innerHTML = R.ordenaVersoes(versoes.filter(v => v.etapa === et)).filter(v => !v.arquivada || v.id === atual).map(v => `<label class="versao${quebrada(v) && v.id !== atual ? ' off' : ''}"><input type="radio" name="versao" value="${esc(v.id)}"${quebrada(v) && v.id !== atual ? ' disabled' : ''}><span class="versao-txt"><span class="versao-topo"><b>${esc(v.nome)}</b>${selo(v)}${varios ? `<span class="chip deck" title="O deck desta variação">${esc(deckPor(v.deck).nome)}</span>` : ''}${v.arquivada ? '<span class="chip cinza">Arquivada</span>' : ''}</span><span>${esc(v.resumo)}</span>${v.quando ? `<small><i>Quando usar:</i> ${esc(v.quando)}</small>` : ''}${v.criada ? `<small><i>Baseada em:</i> ${esc(versaoPor(v.base, et).nome)}</small>` : ''}${v.nota ? `<small><i>Nota:</i> ${esc(v.nota)}</small>` : ''}${quebrada(v) ? `<small class="indisponivel">${v.id === atual ? 'Esta página não está funcionando agora' : 'Indisponível agora'}: ${esc(motivoDe(v))}</small>` : ''}</span></label>`).join('');
    marcaVersao(atual);
  }
  montaVersoes();
  const versaoMarcada = () => { const r = $('#versoes input[name=versao]:checked'); return r ? r.value : R.padraoDe(etapaEd()); };
  function marcaVersao(id) { const alvo = versaoPor(id, etapaEd()).id; $$('#versoes input[name=versao]').forEach(r => { r.checked = r.value === alvo; }); }
  const tiradosAgora = () => $$('#opcionais-lista input[type=checkbox]').filter(c => !c.checked).map(c => c.value);
  // os slides opcionais da variação marcada (só nos decks que tiram slide da sequência); tirados: os ids que ficam de fora (o resto entra)
  function desenhaOpcionais(tirados) {
    const ver = versaoPor(versaoMarcada(), etapaEd()), quem = R.comoFala(campo('nome').value, campo('apelido').value) || 'atleta';
    const ops = (ver.recursos || { pular: true }).pular ? ver.opcionais : [];
    $('#opcionais').hidden = !ops.length;
    $('#opcionais-lista').innerHTML = ops.map(o => `<label class="ck"><input type="checkbox" name="opcional" value="${esc(o.id)}"${tirados.includes(o.id) ? '' : ' checked'}><span><b data-rotulo="${esc(o.rotulo)}">${esc(o.rotulo.replace('{nome}', quem))}</b> · slide ${o.slide}<small class="ck-ajuda">${esc(o.ajuda)}</small></span></label>`).join('');
  }
  // o rótulo leva o nome falado do atleta ("O que o Lucas leva"); muda junto com o nome, sem mexer no que está marcado
  function rotulaOpcionais() {
    const quem = R.comoFala(campo('nome').value, campo('apelido').value) || 'atleta';
    $$('#opcionais-lista b[data-rotulo]').forEach(b => { b.textContent = b.dataset.rotulo.replace('{nome}', quem); });
  }
  // as quatro escolhas do nome na tela, cada uma com o nome que o atleta digitado teria (o apelido, se houver, manda por cima)
  const AJUDA_NOME = {
    '': 'O nome e o último sobrenome (Lucas Almeida da Silva vira Lucas Silva).',
    'primeiro-sobrenome': 'O nome e o primeiro sobrenome (Lucas Almeida da Silva vira Lucas Almeida).',
    'so-nome': 'Só o primeiro nome nos títulos e nas frases. A capa (Montado para) e o carimbo do dossiê seguem com nome e sobrenome.',
    'sem': 'Apresentação geral: a tela não mostra nome nem foto do atleta, e a foto não é pedida. A fala do apresentador continua com o nome dele.'
  };
  let nomeTelaDe = null;
  function desenhaNomeTela(forca) {
    const sel = campo('nomeTela'), nome = String(campo('nome').value || '').trim();
    if (!forca && nome === nomeTelaDe) return;
    nomeTelaDe = nome;
    const atual = sel.value, base = nome || 'Lucas Almeida da Silva'; // sem nome digitado, o exemplo é o do texto de ajuda
    sel.innerHTML = R.NOMES_TELA.map(n => `<option value="${esc(n.id)}">${esc(n.nome)}${n.id === 'sem' ? '' : ' · ' + esc(R.comoChama(base, '', n.id))}</option>`).join('');
    sel.value = atual;
  }
  desenhaNomeTela(true);
  function fechaEditor() {
    clearInterval(ed && ed.timer);
    ed = null;
    fechaRecorte();
    $('#v-editor').hidden = true;
  }
  // o que muda de uma etapa pra outra no formulário: o R1 não tem foto, apelido, nome na tela, plano, prazos nem leitura (data-so="r2"), e
  // as dicas e os títulos falam do R1
  function aplicaEtapa(et) {
    const r1 = et === 'r1';
    $$('[data-so="r2"]').forEach(el => { el.hidden = r1; });
    $$('small[data-r1]').forEach(el => { if (!('r2' in el.dataset)) el.dataset.r2 = el.textContent; el.textContent = r1 ? el.dataset.r1 : el.dataset.r2; el.hidden = !el.textContent; });
    $('#s-versao > h2').textContent = 'Variação do ' + nomeEtapa(et);
    $('#versoes').setAttribute('aria-label', 'Variação do ' + nomeEtapa(et));
    $('#call-titulo').textContent = r1 ? 'A R2 marcada' : 'A call';
    $('#call-r1').hidden = !r1;
    $('#conferido-txt').textContent = r1 ? 'Conferi a grafia do nome com a família.' : 'Conferi a grafia do nome com a família (ou com a ficha do SDR).';
    $('#ed-voltar').textContent = '← ' + (etapasDoPapel().length > 1 ? 'Meus leads' : 'Meus ' + nomeEtapa(et));
    $('#lk-abrir').textContent = 'Abrir o ' + nomeEtapa(et);
    $('#lk-dono-rotulo').textContent = 'Dono deste ' + nomeEtapa(et) + ' (admin)';
  }
  async function abreEditor(t, versaoInicial, etapaNova) {
    if (ed && ed.t === t && t) { $('#v-editor').hidden = false; $('#v-lista').hidden = true; return; }
    fechaEditor();
    $('#v-lista').hidden = true; $('#v-editor').hidden = false;
    window.scrollTo(0, 0);
    // o lead novo é da etapa pedida (#/novo-r1), da da variação escolhida (#/novo/<slug>) ou da padrão do papel
    let etapa = etapaNova || etapaPadrao();
    const vi = versaoInicial && versoes.find(v => v.id === versaoInicial);
    if (vi && etapasDoPapel().includes(vi.etapa)) etapa = vi.etapa;
    ed = { t: t || null, etapa, reg: null, base: '', sujo: false, emCall: null, check: null, vistos: new Set(), timer: 0 };
    aplicaEtapa(etapa);
    montaVersoes();
    $('#ed-erro').textContent = ''; $('#ft-erro').textContent = '';
    poeFicha({});
    $('#c-conferido').checked = false;
    if (!t) {
      // #/novo/<slug>: o lead novo já nasce com a variação marcada. Uma variação que o admin criou há pouco pode não estar na lista
      // daqui: lê de novo antes
      if (versaoInicial && !versoes.some(v => v.id === versaoInicial)) await carregaVersoes();
      else carregaVersoes();
      if (!ed || ed.t) return;
      const inicial = versaoInicial && versoes.find(v => v.id === versaoInicial && !v.arquivada);
      if (inicial && inicial.etapa !== ed.etapa && etapasDoPapel().includes(inicial.etapa)) { ed.etapa = inicial.etapa; aplicaEtapa(ed.etapa); montaVersoes(); }
      if (inicial && inicial.etapa === ed.etapa) { marcaVersao(inicial.id); desenhaOpcionais([]); }
      if (importado) {
        poeFicha(Object.assign({}, importado.ficha, inicial && inicial.etapa === ed.etapa ? { versao: inicial.id } : {}));
        if (importado.fora.length) $('#ed-erro').textContent = 'Importado. Não vieram (confira na mão): ' + importado.fora.join(', ') + '.';
        else aviso('Ficha importada. Confira e salve.');
        ed.sujo = true;
        importado = null;
      }
      desenhaEditor();
      montaPrevia(); // o R1 novo diz que abre em outra aba depois de salvar (o R2 novo, que a prévia aparece depois de salvar o nome)
      setTimeout(() => campo('nome').focus(), 30);
      return;
    }
    $('#ed-titulo').textContent = 'Carregando…';
    try {
      const j = await api('atletas?t=' + t);
      if (!ed || ed.t !== t) return;
      // o lead usa uma variação que esta tela ainda não conhece (criada há pouco): lê a lista de novo, senão a ficha abriria na principal
      const usada = j.registro.ficha && j.registro.ficha.versao;
      if (usada && !versoes.some(v => v.id === usada)) { await carregaVersoes(); if (!ed || ed.t !== t) return; }
      recebe(j, true);
      montaPrevia();
      ed.timer = setInterval(confereDeFora, 30000);
    } catch (err) {
      if (err.status === 401) return;
      $('#ed-titulo').textContent = 'Lead não encontrado';
      $('#ed-erro').textContent = err.message;
    }
  }
  // o que o servidor mandou (registro, link, etiqueta, checklist e presença); comFormulario: põe a ficha nos campos
  function recebe(j, comFormulario) {
    const etapa = j.etapa === 'r1' || (j.registro && j.registro.etapa === 'r1') ? 'r1' : 'r2';
    if (ed.etapa !== etapa) { ed.etapa = etapa; aplicaEtapa(etapa); montaVersoes(); }
    ed.reg = j.registro; ed.base = j.registro.fichaEm; ed.estado = j.estado; ed.check = j.checklist; ed.link = j.link;
    if ('emCall' in j) ed.emCall = j.emCall;
    if (comFormulario) {
      poeFicha(j.registro.ficha);
      campo('nota').value = j.registro.nota || '';
      $('#c-conferido').checked = !!(j.registro.conferido && j.registro.ficha && j.registro.conferido.nome === j.registro.ficha.nome);
      ed.sujo = false;
    }
    desenhaEditor();
    if (ed.t) desenhaBotoesPrevia();
  }
  function desenhaEditor() {
    const seletorPlano = campo('plano'), planoAtual = seletorPlano.value;
    const planos = R.planosDaVersao(versaoPor(versaoMarcada(), etapaEd())).slice().reverse();
    opcoes(seletorPlano, planos);
    seletorPlano.value = planos.includes(planoAtual) ? planoAtual : '';
    const et = etapaEd(), r1 = et === 'r1', f = leFicha(), novo = !ed.t, reg = ed.reg;
    $('#ed-titulo').textContent = f.nome || (novo ? 'Novo ' + nomeEtapa(et) : 'Sem nome');
    const [est, cor] = ESTADOS[ed.estado] || (novo ? ['Novo', 'cinza'] : ESTADOS.rascunho);
    const chip = $('#ed-estado'); chip.textContent = ed.emCall ? 'Em call agora' : est; chip.className = 'chip ' + (ed.emCall ? 'pulsa' : cor);
    $('#ed-salvar').textContent = novo ? 'Criar ' + nomeEtapa(et) + ' e gerar o link' : 'Salvar';
    $('#ed-salvo').textContent = ed.sujo ? 'Mudanças não salvas' : reg ? 'Salvo ' + ha(reg.fichaEm) : '';
    $('#ed-salvo').classList.toggle('sujo', !!ed.sujo);
    // o nome e a foto como a tela mostra: a variação diz o que pode aparecer do lead (o admin ajusta), e quem monta escolhe dentro disso.
    // O deck que não segue a escolha (o R2 anterior, o B e o R1) mostra o nome do jeito dele: aí não tem escolha
    const verMarcada = versaoPor(f.versao, et), verSalva = versaoPor(reg && reg.ficha && reg.ficha.versao, et);
    const rec = verMarcada.recursos || { nomeTela: true, foto: true, pular: true };
    $('#s-dossie').hidden = !rec.dossie;
    const leadNome = verMarcada.lead.nome, leadFoto = !!(rec.foto && leadNome && verMarcada.lead.foto);
    const modo = leadNome ? (rec.nomeTela ? (f.nomeTela || '') : (rec.nomeFixo || '')) : 'sem'; // o que a tela mostra do nome (o deck que não segue a escolha mostra do jeito dele)
    const comFoto = leadFoto && modo !== 'sem' && f.semFoto !== 'sim';
    desenhaNomeTela();
    const chama = R.comoChama(f.nome, f.apelido, modo);
    campo('apelido').placeholder = (modo === 'sem' ? '' : R.comoChama(f.nome, '', modo)) || 'Nome e sobrenome';
    // o campo "Como a gente chama ele" só aparece nos decks que usam (o R2 anterior e o R1 ignoram)
    $('#apelido-bloco').hidden = r1 || rec.apelido === false;
    const apAjuda = $('#apelido-ajuda');
    if (!apAjuda.dataset.padrao) apAjuda.dataset.padrao = apAjuda.textContent; // o texto do HTML, antes de este código trocar
    apAjuda.textContent = rec.nomeTela ? apAjuda.dataset.padrao : apAjuda.dataset.fixo;
    rotulaOpcionais();
    $('#nt-bloco').hidden = !(leadNome && rec.nomeTela);
    $('#nome-ajuda').hidden = !r1 && !rec.nomeTela; // a ajuda do R2 novo (nome na tela) não vale nos decks que não seguem a escolha
    $('#foto-tela-bloco').hidden = !(leadFoto && modo !== 'sem');
    const mostraTudo = leadNome && leadFoto && rec.nomeTela;
    $('#lead-nota').hidden = r1 || mostraTudo;
    const deck = deckPor(verMarcada.deck), leadTxtDoDeck = rec.dossie
      ? 'Foto somente no slide de escolha. Primeiro nome no perfil, relatório, oportunidades e oferta. Os campos de personalização são opcionais.'
      : deck.leadTxt || (R.deckPor(verMarcada.deck) || {}).leadTxt;
    $('#lead-nota').textContent = !leadNome ? 'Esta variação não mostra o nome nem a foto do lead na tela (apresentação geral). A fala do apresentador continua com o nome dele.'
      : !rec.nomeTela ? 'No deck ' + deck.nome + ', ' + (leadTxtDoDeck || 'o nome do lead aparece do jeito do deck') + '.'
      : !leadFoto ? 'Esta variação não mostra a foto do lead na tela.' : '';
    $('#nt-ajuda').textContent = AJUDA_NOME[modo] || '';
    $('#ex-nome').closest('.campo').hidden = r1 || !rec.nomeTela;
    $('#ex-nome').textContent = (chama ? chama + ', você' : 'Você') + ' foi escolhido.';
    $('#ex-nome-nota').textContent = [
      f.apelido && modo && modo !== 'sem' ? 'O campo “Como a gente chama ele” está preenchido e manda no nome da tela.' : '',
      leadNome && modo !== 'sem' && !comFoto ? 'Sem a foto na tela: o quadro dela mostra a inicial do nome.' : ''
    ].filter(Boolean).join(' ');
    const semFotoTxt = !leadNome ? 'Esta variação não mostra o nome nem a foto do lead: a tela não usa a foto, e ela não é pedida no checklist.'
      : modo === 'sem' ? 'Este R2 está em “Sem nome nem foto” (veja Nome na tela): a tela não usa a foto, e ela não é pedida no checklist.'
      : !leadFoto ? 'Esta variação não mostra a foto do lead: a tela não usa a foto, e ela não é pedida no checklist.'
      : !comFoto ? 'A foto não vai pra tela deste R2 (“Mostrar a foto do lead” desmarcado): ela não é pedida no checklist e fica guardada.' : '';
    $('#ft-nota-sem').hidden = !semFotoTxt; $('#ft-nota-sem').textContent = semFotoTxt;
    // a variação: o que está marcado e ainda não foi salvo muda o link só depois de salvar
    $('#vr-nota').textContent = reg && verMarcada.id !== verSalva.id ? 'Salve pra o link deste lead abrir a variação ' + verMarcada.nome + '.'
      : quebrada(verMarcada) ? 'A página desta variação não está funcionando agora: o link do lead abre a Principal até ela voltar. (' + motivoDe(verMarcada) + ')' : '';
    // a posição no campo do slide 11 (só o R2)
    const pos = R.posicaoNoCampo(f.posicao), sp = $('#selo-pos');
    sp.textContent = !f.posicao ? 'Sem posição: o campo do slide 11 fica sem destaque.' : pos ? 'Reconhecida no campo: ' + pos : 'Não reconheci: o campo do slide 11 fica sem destaque. Escreva como goleiro, zagueiro, volante, meia, atacante...';
    sp.className = 'selo-pos ' + (!f.posicao ? '' : pos ? 'ok' : 'nao');
    // a call: na capa do R2; no slide 16 do R1
    $('#ex-call').textContent = f.r2data || f.r2hm ? (r1 ? 'No slide 16: R2 de ' : 'Na capa: Call de ') + callTxt(f.r2data, f.r2hm) + '.' : '';
    $$('.so-legacy').forEach(el => el.classList.toggle('fora', f.plano !== R.LEGACY));
    // seções que só existem com o lead criado (e a leitura, só no R2)
    ['#s-link', '#s-hist', '#s-perigo'].forEach(x => { $(x).hidden = novo; });
    $('#s-leitura').hidden = novo || r1 || rec.leitura === false;
    desenhaFoto(); desenhaChecklist(); desenhaLink(); desenhaHistorico();
  }
  // só os campos da ficha, a nota e o "conferi o nome" contam como mudança (a foto e o link têm botão próprio)
  const daFicha = el => !!el && (CHAVES.includes(el.name) || el.name === 'nota' || el.id === 'c-conferido' || el.id === 'c-foto-tela' || el.name === 'versao' || el.name === 'opcional');
  F.addEventListener('input', e => {
    if (!ed || !daFicha(e.target)) return;
    if (e.target.name === 'nome' && $('#c-conferido').checked) $('#c-conferido').checked = false; // mudou o nome: conferir de novo
    ed.sujo = true; desenhaEditor();
  });
  F.addEventListener('change', e => {
    if (!ed || !daFicha(e.target)) return;
    if (e.target.name === 'versao') desenhaOpcionais(tiradosAgora()); // a variação nova traz os slides dela; o que já estava desmarcado e existe nela continua
    ed.sujo = true; desenhaEditor();
  });
  F.addEventListener('submit', e => { e.preventDefault(); salva(); });
  $('#ed-salvar').addEventListener('click', () => salva());

  async function salva(baseForcada) {
    if (!ed) return;
    const ficha = leFicha();
    $('#ed-erro').textContent = '';
    if (recursosDe(versaoMarcada()).dossie) {
      const invalido = R.CAMPOS_DOSSIE.find(c => c.numero && campo(c.chave).value && !campo(c.chave).validity.valid);
      if (invalido) {
        $('#ed-erro').textContent = invalido.nome + ': use um número inteiro de 0 a 100, ou deixe vazio.';
        const el = campo(invalido.chave), grupo = el.closest('details'); if (grupo) grupo.open = true;
        el.focus(); return;
      }
    }
    if (etapaEd() === 'r2' && ficha.vagas && !(+ficha.vagas >= 1 && +ficha.vagas <= 10)) { $('#ed-erro').textContent = 'Vagas: um número de 1 a 10, ou vazio.'; campo('vagas').focus(); return; }
    try {
      if (!ed.t) {
        const j = await ocupado($('#ed-salvar'), () => api('atletas', { metodo: 'POST', dados: { ficha, etapa: etapaEd() } }));
        ed.sujo = false;
        destaque = j.t;
        aviso(nomeEtapa(etapaEd()) + ' criado. O link da apresentação foi gerado e já funciona (seção Link).');
        // o mesmo atleta, agora com código: abre o editor dele (sem perguntar de mudança, já salvou)
        history.replaceState(null, '', '#/r2/' + j.t);
        hashAtual = '#/r2/' + j.t;
        ed.t = j.t;
        if ($('#c-conferido').checked || campo('nota').value.trim()) {
          const j2 = await api('atletas?t=' + j.t, { metodo: 'PUT', dados: { ficha, base: j.registro.fichaEm, nota: campo('nota').value, conferido: { nome: $('#c-conferido').checked } } });
          recebe(j2, false);
        } else recebe(Object.assign({ emCall: null }, j), false);
        montaPrevia();
        ed.timer = setInterval(confereDeFora, 30000);
        return;
      }
      const j = await ocupado($('#ed-salvar'), () => api('atletas?t=' + ed.t, { metodo: 'PUT', dados: { ficha, base: baseForcada || ed.base, nota: campo('nota').value, conferido: { nome: $('#c-conferido').checked } } }));
      ed.sujo = false;
      recebe(j, false);
      aviso('Salvo. A prévia e o R2 já mostram.');
      atualizaPrevia();
    } catch (err) {
      if (err.status === 409 && err.j && err.j.conflito) return conflito(err.j.conflito);
      $('#ed-erro').textContent = err.message;
    }
  }
  // 409: outra pessoa salvou depois que o formulário carregou. Nada do que foi digitado se perde até a pessoa escolher
  let conflitoAtual = null;
  function conflito(c) {
    conflitoAtual = c;
    $('#dc-texto').textContent = (c.por || 'Outra pessoa') + ' salvou esta ficha ' + ha(c.em) + '. Recarregar ou sobrescrever?';
    $('#d-conflito').showModal();
  }
  $('#dc-cancelar').addEventListener('click', () => $('#d-conflito').close());
  $('#dc-sobrescrever').addEventListener('click', () => { $('#d-conflito').close(); salva(conflitoAtual && conflitoAtual.base); });
  $('#dc-recarregar').addEventListener('click', async () => {
    $('#d-conflito').close();
    try { recebe(await api('atletas?t=' + ed.t), true); aviso('Recarregado: o que está salvo agora.'); atualizaPrevia(); } catch (err) { $('#ed-erro').textContent = err.message; }
  });
  // a cada 30 s: a presença (em call agora), a etiqueta e se alguém salvou a ficha enquanto isso
  async function confereDeFora() {
    if (!ed || !ed.t || document.hidden) return;
    try {
      const j = await api('atletas?t=' + ed.t);
      if (!ed || !ed.t || j.registro.t !== ed.t) return;
      const mudou = j.registro.fichaEm !== ed.base;
      ed.emCall = j.emCall; ed.estado = j.estado;
      if (mudou && !ed.sujo) { recebe(j, true); aviso((j.registro.fichaPor && j.registro.fichaPor.nome || 'Alguém') + ' salvou esta ficha. O formulário já mostra.'); atualizaPrevia(); return; }
      if (mudou && ed.sujo) $('#ed-erro').textContent = (j.registro.fichaPor && j.registro.fichaPor.nome || 'Alguém') + ' salvou esta ficha ' + ha(j.registro.fichaEm) + '. Ao salvar, você escolhe: recarregar ou sobrescrever.';
      ed.reg = Object.assign({}, ed.reg, { venceEm: j.registro.venceEm, estado: j.registro.estado, foto: j.registro.foto, video: j.registro.video, historico: j.registro.historico });
      ed.check = Object.assign({}, ed.check, { foto: j.checklist.foto, previa: j.checklist.previa });
      desenhaEditor();
    } catch (e) { /* tenta de novo daqui a pouco */ }
  }

  /* ---------------- checklist ---------------- */
  function desenhaChecklist() {
    const f = leFicha(), reg = ed.reg, et = etapaEd();
    if (et === 'r1') {
      // o R1 não tem foto, plano nem prévia aqui: falta o nome conferido, a ficha do slide 02 e o dia e a hora da R2
      const itensR1 = [
        ['Nome conferido', !!(f.nome && $('#c-conferido').checked), 'Marque "Conferi a grafia do nome".'],
        ['A ficha do slide 02 (posição, idade e cidade)', !!(f.posicao && f.idade && f.cidade), 'O slide 02 do R1 mostra os três.'],
        ['Dia e hora da R2', !!(f.r2data && f.r2hm), 'Aparecem no slide 16.']
      ];
      const prontoR1 = itensR1.every(x => x[1]);
      $('#checklist').innerHTML = itensR1.map(([t, ok, dica]) => `<li class="${ok ? 'ok' : ''}"><i>${ok ? '✓' : ''}</i><span><b>${esc(t)}</b><small>${esc(ok ? '' : dica)}</small></span></li>`).join('') +
        `<li><span class="nota" style="margin:0">${prontoR1 ? 'Com os três feitos, a etiqueta é <b>Pronto</b>' + (ed.sujo ? ' (depois de salvar)' : '') + '.' : 'Você já pode gerar e abrir a apresentação. Essas conferências são opcionais.'}</span></li>`;
      return;
    }
    // a variação e as escolhas deste R2 dizem o que a tela mostra do lead: sem nome, sem nome nem foto; sem foto, só a foto fica de fora.
    // O que a tela não mostra não é pedido (não há o que autorizar nem o que conferir)
    const ver = versaoPor(f.versao, et), sem = !ver.lead.nome || f.nomeTela === 'sem', semFoto = sem || !ver.lead.foto || f.semFoto === 'sim';
    const fotoOk = !!(ed.check && ed.check.foto);
    const itensCk = [
      ['Foto com autorização', semFoto || fotoOk, semFoto ? 'Não precisa: a tela deste R2 não mostra a foto.' : fotoOk && reg.foto ? 'Some em ' + R.dataCurta(reg.foto.venceEm) + '.' : 'Opcional: adicione uma foto para personalizar o slide de escolha.'],
      ['Nome conferido', sem || !!(f.nome && $('#c-conferido').checked), sem ? 'Não precisa: a tela deste R2 não mostra o nome.' : 'Marque "Conferi a grafia do nome".'],
      ['Posição reconhecida no campo', !!R.posicaoNoCampo(f.posicao), 'O slide 11 marca o lugar dele.'],
      ['Plano escolhido', !!f.plano, 'O destaque do slide dos planos.'],
      ['Dia e hora da call', !!(f.r2data && f.r2hm), 'Aparecem na capa.']
    ];
    // a prévia só é item nos decks que abrem no quadro de prévia (nos outros ela abre em outra aba e não há o que marcar); segue a variação marcada,
    // como a foto e o nome (o servidor, que dá a etiqueta, usa a salva: depois de salvar, as duas são a mesma)
    if (!(ver.recursos && ver.recursos.previa === false)) itensCk.push(['Prévia olhada', !!(ed.check && ed.check.previa && !ed.sujo), 'Abra na prévia os slides marcados com •.']);
    const pronto = itensCk.slice(0, 5).every(x => x[1]);
    $('#checklist').innerHTML = itensCk.map(([t, ok, dica]) => `<li class="${ok ? 'ok' : ''}"><i>${ok ? '✓' : ''}</i><span><b>${esc(t)}</b><small>${esc(ok && !/^(Some|Não precisa)/.test(dica) ? '' : dica)}</small></span></li>`).join('') +
      `<li><span class="nota" style="margin:0">${pronto ? 'Com os cinco primeiros feitos, a etiqueta é <b>Pronto</b>' + (ed.sujo ? ' (depois de salvar)' : '') + '.' : 'Você já pode gerar e abrir a apresentação. Preencha apenas o que quiser personalizar.'}</span></li>`;
  }

  /* ---------------- link ---------------- */
  function desenhaLink() {
    if (!ed.t || !ed.reg) return;
    const reg = ed.reg, link = ed.link || linkDo(ed.t, etapaEd());
    $('#lk-url').value = link; $('#lk-abrir').href = link;
    const revogado = reg.estado === 'revogado', encerrado = reg.estado === 'encerrado', expirado = ed.estado === 'expirado';
    $('#lk-info').textContent = revogado ? 'Link revogado: a família vê "este link não está mais ativo". Reative pra voltar a valer.'
      : (expirado ? 'Link vencido em ' + R.dataCurta(reg.venceEm) + '. Renove pra voltar a valer.' : 'Vale até ' + R.dataCurta(reg.venceEm) + ' (fim do dia).') + (encerrado ? ' Call marcada como encerrada.' : '');
    $('#lk-revogar').textContent = revogado ? 'Reativar' : 'Revogar';
    $('#lk-encerrar').textContent = encerrado ? 'Reabrir (call não encerrada)' : 'Marcar call como encerrada';
    $('#lk-encerrar').disabled = revogado;
    $('#lk-call').hidden = !ed.emCall;
    if (ed.emCall) $('#lk-call').textContent = 'Em call agora desde ' + hora(ed.emCall.desde) + ' (o apresentador está aberto).';
    $('#lk-admin').hidden = !(eu && eu.papel === 'admin');
    if (eu && eu.papel === 'admin') montaDonos();
  }
  async function montaDonos() {
    if (!usuarios.length) { try { usuarios = (await api('usuarios')).usuarios || []; } catch (e) { return; } }
    const sel = $('#lk-dono');
    if (!ed || !ed.reg) return;
    // só quem monta essa etapa pode ficar com o lead (o SDR o R1, o closer o R2; o admin as duas)
    const papel = (R.ETAPAS.find(x => x.id === etapaEd()) || {}).papel;
    sel.innerHTML = usuarios.filter(u => u.papel === 'admin' || u.papel === papel).map(u => `<option value="${esc(u.login)}"${u.login === ed.reg.donoLogin ? ' selected' : ''}>${esc(u.nome)} (${esc(u.login)})</option>`).join('');
  }
  $('#lk-copiar').addEventListener('click', async () => aviso((await copia($('#lk-url').value)) ? 'Link copiado.' : 'Não deu pra copiar. Selecione o link e copie.', false));
  async function acaoLink(acao, dados, bt) {
    try { return await ocupado(bt, () => api('link?t=' + ed.t + '&acao=' + acao, { metodo: 'POST', dados: dados || {} })); }
    catch (err) { aviso(err.message, true); return null; }
  }
  $('#lk-renovar').addEventListener('click', async e => {
    const j = await acaoLink('renovar', { dias: +$('#lk-dias').value }, e.currentTarget);
    if (j) { recebe(Object.assign(j, { emCall: ed.emCall }), false); aviso('Link renovado até ' + R.dataCurta(j.registro.venceEm) + '.'); atualizaPrevia(); }
  });
  $('#lk-revogar').addEventListener('click', async e => {
    const revogar = ed.reg.estado !== 'revogado';
    if (revogar && !confirm('Revogar o link? A família deixa de ver na hora (o link continua existindo e dá pra reativar).')) return;
    const j = await acaoLink(revogar ? 'revogar' : 'reativar', {}, e.currentTarget);
    if (j) { recebe(Object.assign(j, { emCall: ed.emCall }), false); aviso(revogar ? 'Link revogado.' : 'Link reativado.'); atualizaPrevia(); }
  });
  $('#lk-encerrar').addEventListener('click', async e => {
    const encerrar = ed.reg.estado !== 'encerrado';
    const j = await acaoLink(encerrar ? 'encerrar' : 'reabrir', {}, e.currentTarget);
    if (j) { recebe(Object.assign(j, { emCall: ed.emCall }), false); aviso(encerrar ? 'Call marcada como encerrada. O link continua valendo até a validade.' : 'Reaberto.'); }
  });
  $('#lk-gerar').addEventListener('click', async e => {
    if (!confirm('Gerar outro link? O link de agora para de funcionar na hora (quem tiver ele vê "não encontrado"). Foto, vídeo e ficha vão pro link novo.')) return;
    const j = await acaoLink('regenerar', {}, e.currentTarget);
    if (!j) return;
    aviso('Link novo gerado. O antigo não funciona mais.');
    ed.sujo = false;
    ed.t = j.t;
    history.replaceState(null, '', '#/r2/' + j.t); hashAtual = '#/r2/' + j.t;
    recebe(Object.assign(j, { emCall: null }), false);
    montaPrevia();
  });
  $('#lk-trocar-dono').addEventListener('click', async e => {
    const login = $('#lk-dono').value;
    if (!login || login === ed.reg.donoLogin) return;
    try { const j = await ocupado(e.currentTarget, () => api('atletas?t=' + ed.t, { metodo: 'PUT', dados: { dono: login } })); recebe(Object.assign(j, { emCall: ed.emCall }), false); aviso('Dono trocado.'); }
    catch (err) { aviso(err.message, true); }
  });
  $('#bt-apagar-tudo').addEventListener('click', async e => {
    const nome = (ed.reg && ed.reg.ficha && ed.reg.ficha.nome) || 'este atleta';
    if (!confirm('Apagar tudo do ' + nomeEtapa(etapaEd()) + ' de ' + nome + '? Foto, vídeo, leitura e ficha somem, e o link para de funcionar. Não dá pra desfazer.')) return;
    try {
      await ocupado(e.currentTarget, () => api('atletas?t=' + ed.t, { metodo: 'DELETE' }));
      ed.sujo = false;
      aviso(nomeEtapa(etapaEd()) + ' apagado.');
      location.hash = '#/';
    } catch (err) { aviso(err.message, true); }
  });
  function desenhaHistorico() {
    const h = (ed.reg && ed.reg.historico) || [];
    $('#hist').innerHTML = h.slice().reverse().map(x => `<li><time>${esc(quando(x.em))}</time> · ${esc(x.por)}: ${esc(x.o)}</li>`).join('') || '<li>Nada ainda.</li>';
  }

  /* ---------------- prévia: o deck de verdade num quadro ---------------- */
  let pvMapa = {}; // nome do slide -> índice (0 a N-1), que o deck manda quando carrega
  // o deck da variação salva sabe abrir dentro do quadro (sem HUD nem apresentador)? O R1 e os decks de antes abrem em outra aba
  const previaEmbutida = () => {
    if (!ed || etapaEd() !== 'r2') return false;
    const ver = versaoPor(ed.reg && ed.reg.ficha && ed.reg.ficha.versao, 'r2');
    return !!(ver.recursos && ver.recursos.previa);
  };
  function montaPrevia() {
    const q = $('#pv-quadro'), et = etapaEd();
    q.innerHTML = '';
    $('#pv-fora').hidden = true;
    if (!ed || !ed.t || !origemDeEntrada(et)) {
      q.innerHTML = '<p class="pv-vazio">' + (et === 'r1' ? 'O R1 abre em outra aba depois de salvar o nome.' : 'A prévia aparece depois de salvar o nome.') + '</p>';
      $('#pv-bts').innerHTML = '';
      $('#pv-nota').textContent = et === 'r1' ? 'Salve o nome pra gerar o link do R1.' : 'Olhe os slides marcados com • antes da call: é o último item do checklist.';
      return;
    }
    if (!previaEmbutida()) {
      q.innerHTML = '<p class="pv-vazio">' + (et === 'r1' ? 'O R1' : 'Este deck') + ' abre em outra aba: não tem prévia aqui.</p>';
      $('#pv-bts').innerHTML = '';
      $('#pv-fora').hidden = false;
      $('#pv-fora').innerHTML = '<a class="bt ouro" href="' + esc(ed.link || linkDo(ed.t, et)) + '" target="_blank" rel="noopener noreferrer">Abrir o ' + nomeEtapa(et) + ' em outra aba</a>';
      $('#pv-nota').textContent = et === 'r1' ? 'Abra o R1 e olhe a ficha do atleta (slide 02) antes da call.' : 'Abra o deck e olhe os slides antes da call.';
      return;
    }
    $('#pv-nota').textContent = 'Olhe os slides marcados com • antes da call: é o último item do checklist.';
    const fr = document.createElement('iframe');
    fr.id = 'pv';
    fr.title = 'Prévia do R2 deste atleta';
    fr.setAttribute('referrerpolicy', 'no-referrer');
    fr.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    fr.src = linkDo(ed.t, 'r2') + '#1';
    q.appendChild(fr);
    pvMapa = {};
    desenhaBotoesPrevia();
  }
  // os botões da prévia; o slide que ficou fora da sequência (variação do R2) não abre: o deck pula ele
  function desenhaBotoesPrevia() {
    if (!ed || !ed.t || !previaEmbutida()) { $('#pv-bts').innerHTML = ''; return; }
    const fora = String((ed.reg && ed.reg.ficha && ed.reg.ficha.pular) || '').split(',').filter(Boolean);
    $('#pv-bts').innerHTML = PREVIA.map(p => {
      const pulado = !!(p.opc && fora.includes(p.opc));
      return `<button class="pv-bt${p.obrig ? ' obrig' : ''}${ed.vistos.has(p.nome) ? ' visto' : ''}${pulado ? ' fora' : ''}" type="button" data-pv="${esc(p.nome)}" aria-pressed="false"${pulado ? ' disabled title="Fora da sequência desta apresentação"' : ''}>${esc(p.rot)}</button>`;
    }).join('');
  }
  const pvJanela = () => { const fr = $('#pv'); return fr && fr.contentWindow; };
  function atualizaPrevia() {
    // a variação salva mudou pra um deck sem prévia (ou o contrário): remonta o quadro
    if (previaEmbutida() !== !!$('#pv')) { montaPrevia(); return; }
    const w = pvJanela(); if (w && deckOrigem('r2')) w.postMessage({ t: 'atualiza' }, deckOrigem('r2'));
  }
  $('#pv-atualizar').addEventListener('click', () => { if ($('#pv')) atualizaPrevia(); else montaPrevia(); });
  $('#pv-bts').addEventListener('click', async e => {
    const b = e.target.closest('[data-pv]'); if (!b || !ed || !ed.t) return;
    const p = PREVIA.find(x => x.nome === b.dataset.pv);
    const i = p.nome in pvMapa ? pvMapa[p.nome] : p.n - 1;
    const w = pvJanela(); if (w) w.postMessage({ t: 'goto', i }, deckOrigem('r2'));
    $$('.pv-bt').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    if (ed.sujo) { aviso('A prévia mostra o que está salvo. Salve pra ver as mudanças.', true); return; }
    ed.vistos.add(p.nome); b.classList.add('visto');
    // os quatro obrigatórios vistos nesta versão: marca no servidor (o checklist mostra)
    if (PREVIA.filter(x => x.obrig).every(x => ed.vistos.has(x.nome)) && !(ed.check && ed.check.previa)) {
      try { const j = await api('atletas?t=' + ed.t, { metodo: 'PUT', dados: { previa: true } }); recebe(Object.assign(j, { emCall: ed.emCall }), false); aviso('Prévia olhada: marcada no checklist.'); }
      catch (err) { /* o checklist fica sem a marca; nada quebra */ }
    }
  });
  window.addEventListener('message', e => {
    if (!deckOrigem('r2') || e.origin !== deckOrigem('r2') || e.source !== pvJanela()) return;
    const d = e.data || {};
    if (d.t === 'deck' && Array.isArray(d.titulos)) d.titulos.forEach((nome, i) => { pvMapa[String(nome)] = i; });
    if (d.t === 'carregado' && ed && ed.t) {
      const msg = { revogado: 'O link está revogado: a família vê só o aviso de link inativo.', expirado: 'O link venceu: a família vê só o aviso de link inativo.', 'nao-encontrado': 'O deck não achou este R2.' }[d.estado];
      $('#pv-nota').textContent = msg || 'Olhe os slides marcados com • antes da call: é o último item do checklist.';
    }
  });

  /* ---------------- foto: o recorte no navegador ----------------
     A foto escolhida é desenhada numa moldura 3:4 (canvas). Arrasta (mouse ou dedo), roda do mouse e pinça dão zoom.
     O quadrado tracejado é o avatar. Na hora de salvar, dois canvas novos (960 x 1280 e 400 x 400) viram JPEG: sai sem EXIF,
     sem GPS e sem nada da câmera. Os dois vão num pedido só, com a autorização marcada. */
  const FT = { fonte: null, W: 0, H: 0, esc: 1, min: 1, max: 4, x: 0, y: 0, fw: 0, fh: 0, dpr: 1, q: { x: 0, y: 0, lado: 0 }, ponteiros: new Map(), modo: '', pinca: 0 };
  const cv = $('#ft-canvas');
  function desenhaFoto() {
    const novo = !ed.t, reg = ed.reg;
    const valida = !!(ed.check && ed.check.foto && reg && reg.foto);
    $('#ft-nota-novo').hidden = !novo;
    const recortando = !$('#ft-recorte').hidden;
    $('#ft-atual').hidden = !valida || recortando;
    $('#ft-zona').hidden = valida || recortando;
    if (valida && !recortando) {
      const n = reg.foto.versao;
      if ($('#ft-atual-ret').dataset.n !== String(n) || $('#ft-atual-ret').dataset.t !== ed.t) {
        $('#ft-atual-ret').src = fotoUrl(ed.t, 'retrato', n); $('#ft-atual-av').src = fotoUrl(ed.t, 'avatar', n);
        $('#ft-atual-ret').dataset.n = String(n); $('#ft-atual-ret').dataset.t = ed.t;
      }
      $('#ft-atual-info').textContent = 'Autorizada por ' + reg.foto.autorizadoPor + ' em ' + R.dataCurta(reg.foto.autorizadoEm) + '. Some em ' + R.dataCurta(reg.foto.venceEm) + '.';
    }
  }
  $('#ft-escolher').addEventListener('click', () => $('#ft-arquivo').click());
  $('#ft-trocar').addEventListener('click', () => $('#ft-arquivo').click());
  $('#ft-arquivo').addEventListener('change', e => { const a = e.target.files && e.target.files[0]; e.target.value = ''; if (a) comecaRecorte(a); });
  const zona = $('#ft-zona');
  ['dragenter', 'dragover'].forEach(ev => zona.addEventListener(ev, e => { e.preventDefault(); zona.classList.add('sobre'); }));
  ['dragleave', 'drop'].forEach(ev => zona.addEventListener(ev, e => { e.preventDefault(); zona.classList.remove('sobre'); }));
  zona.addEventListener('drop', e => { const a = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (a) comecaRecorte(a); });
  const NAO_ABRIU = 'Essa foto não abriu aqui. Se for do iPhone (HEIC), mande em JPG ou tire um print da foto e mande o print.';
  const CORTADA = 'Essa foto está incompleta (o arquivo veio cortado). Mande de novo, ou tire um print da foto e mande o print.';
  // o navegador abre um JPEG ou um PNG cortado no meio sem dar erro (a parte que falta vira cinza ou preto). Antes do recorte,
  // confere o fim: no JPEG, o marcador FF D9 depois da imagem principal (os segmentos antes dela são pulados pelo tamanho, então
  // a miniatura do EXIF não conta); no PNG, o bloco IEND
  async function arquivoInteiro(arq) {
    const b = new Uint8Array(await arq.arrayBuffer());
    if (b[0] === 0xFF && b[1] === 0xD8) {
      let i = 2;
      while (i + 4 <= b.length && b[i] === 0xFF) {
        const m = b[i + 1];
        if (m === 0xDA) {
          for (let k = i + 2; k + 1 < b.length; k++) if (b[k] === 0xFF && b[k + 1] === 0xD9) return true;
          return false;
        }
        if (m === 0xD8 || (m >= 0xD0 && m <= 0xD7) || m === 0x01) { i += 2; continue; }
        i += 2 + ((b[i + 2] << 8) | b[i + 3]);
      }
      return false;
    }
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) {
      for (let k = b.length - 8; k >= 8; k--) if (b[k] === 0x49 && b[k + 1] === 0x45 && b[k + 2] === 0x4E && b[k + 3] === 0x44) return true;
      return false;
    }
    return true; // outros formatos: quem decide é o navegador, ao abrir
  }
  async function abreImagem(arq) {
    if (arq.size > 40 * 1024 * 1024) throw new Error('A foto passa de 40 MB. Mande uma menor, ou tire um print dela.');
    if (!(await arquivoInteiro(arq))) throw new Error(CORTADA);
    let img;
    try { img = await createImageBitmap(arq, { imageOrientation: 'from-image' }); }
    catch (e1) {
      img = await new Promise((ok, erro) => {
        const u = URL.createObjectURL(arq), im = new Image();
        im.onload = () => { ok(im); setTimeout(() => URL.revokeObjectURL(u), 2000); };
        im.onerror = () => { URL.revokeObjectURL(u); erro(new Error(NAO_ABRIU)); };
        im.src = u;
      });
    }
    let w = img.width || img.naturalWidth, h = img.height || img.naturalHeight;
    if (!(w > 0 && h > 0)) throw new Error(NAO_ABRIU);
    if (w < 200 || h < 200) throw new Error('A foto é muito pequena (menos de 200 pixels). Mande uma maior.');
    // foto enorme (5000 x 5000, 50 megapixels): reduz pra 2400 no lado maior antes de recortar
    const k = Math.min(1, 2400 / Math.max(w, h));
    if (k < 1) {
      const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
      const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height);
      if (img.close) img.close();
      return { fonte: c, w: c.width, h: c.height };
    }
    return { fonte: img, w, h };
  }
  async function comecaRecorte(arq) {
    $('#ft-erro').textContent = '';
    if (!ed) return;
    let r;
    try { r = await abreImagem(arq); } catch (err) { $('#ft-erro').textContent = err.message || NAO_ABRIU; return; }
    FT.fonte = r.fonte; FT.W = r.w; FT.H = r.h;
    $('#ft-autoriza').checked = false; $('#ft-salvar').disabled = true;
    $('#ft-recorte').hidden = false; $('#ft-zona').hidden = true; $('#ft-atual').hidden = true;
    medeMoldura();
    FT.min = Math.max(FT.fw / FT.W, FT.fh / FT.H); FT.max = FT.min * 5; FT.esc = FT.min;
    FT.x = (FT.fw - FT.W * FT.esc) / 2; FT.y = (FT.fh - FT.H * FT.esc) / 2.6;
    const lado = FT.fw * (+$('#ft-quad').value || 62) / 100;
    FT.q = { lado, x: (FT.fw - lado) / 2, y: FT.fh * 0.1 };
    limita(); pinta();
    $('#ft-recorte').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function medeMoldura() {
    const r = cv.getBoundingClientRect(), velhoW = FT.fw;
    FT.fw = r.width; FT.fh = r.height; FT.dpr = window.devicePixelRatio || 1;
    cv.width = Math.max(1, Math.round(r.width * FT.dpr)); cv.height = Math.max(1, Math.round(r.height * FT.dpr));
    return velhoW;
  }
  function limita() {
    FT.esc = Math.min(FT.max, Math.max(FT.min, FT.esc));
    const w = FT.W * FT.esc, h = FT.H * FT.esc;
    FT.x = Math.min(0, Math.max(FT.fw - w, FT.x));
    FT.y = Math.min(0, Math.max(FT.fh - h, FT.y));
    const q = FT.q;
    q.lado = Math.min(q.lado, FT.fw, FT.fh);
    q.x = Math.min(FT.fw - q.lado, Math.max(0, q.x));
    q.y = Math.min(FT.fh - q.lado, Math.max(0, q.y));
  }
  function pinta() {
    if (!FT.fonte) return;
    const c = cv.getContext('2d'), d = FT.dpr, q = FT.q;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cv.width, cv.height);
    c.imageSmoothingQuality = 'high';
    c.drawImage(FT.fonte, FT.x * d, FT.y * d, FT.W * FT.esc * d, FT.H * FT.esc * d);
    // o avatar: o resto fica levemente escurecido e o quadrado ganha o tracejado dourado com os cantos
    c.fillStyle = 'rgba(0,0,0,.22)';
    c.beginPath(); c.rect(0, 0, cv.width, cv.height); c.rect(q.x * d, q.y * d, q.lado * d, q.lado * d); c.fill('evenodd');
    c.lineWidth = 2 * d; c.strokeStyle = '#E8CE8E'; c.setLineDash([8 * d, 6 * d]);
    c.strokeRect(q.x * d, q.y * d, q.lado * d, q.lado * d);
    c.setLineDash([]); c.lineWidth = 4 * d;
    const k = 16 * d, X = q.x * d, Y = q.y * d, L = q.lado * d;
    [[X, Y, 1, 1], [X + L, Y, -1, 1], [X, Y + L, 1, -1], [X + L, Y + L, -1, -1]].forEach(([x, y, sx, sy]) => { c.beginPath(); c.moveTo(x, y + sy * k); c.lineTo(x, y); c.lineTo(x + sx * k, y); c.stroke(); });
    $('#ft-zoom').value = String(Math.round(100 * Math.log(FT.esc / FT.min) / Math.log(FT.max / FT.min)) || 0);
    miniaturas();
  }
  // o que vai sair: o retrato e o avatar em miniatura, desenhados do mesmo jeito que o JPEG final
  function recortaEm(canvas, largura, altura, avatar) {
    canvas.width = largura; canvas.height = altura;
    const c = canvas.getContext('2d'), k = 1 / FT.esc, q = FT.q;
    c.imageSmoothingQuality = 'high';
    if (avatar) c.drawImage(FT.fonte, (q.x - FT.x) * k, (q.y - FT.y) * k, q.lado * k, q.lado * k, 0, 0, largura, altura);
    else c.drawImage(FT.fonte, -FT.x * k, -FT.y * k, FT.fw * k, FT.fh * k, 0, 0, largura, altura);
    return canvas;
  }
  function miniaturas() { recortaEm($('#ft-mini-ret'), 90, 120, false); recortaEm($('#ft-mini-av'), 64, 64, true); }
  function zoomEm(cx, cy, fator) {
    const novo = Math.min(FT.max, Math.max(FT.min, FT.esc * fator)), k = novo / FT.esc;
    FT.x = cx - (cx - FT.x) * k; FT.y = cy - (cy - FT.y) * k; FT.esc = novo;
  }
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const dist = () => { const [a, b] = Array.from(FT.ponteiros.values()); return Math.hypot(a.x - b.x, a.y - b.y) || 1; };
  const meio = () => { const [a, b] = Array.from(FT.ponteiros.values()); return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };
  cv.addEventListener('pointerdown', e => {
    if (!FT.fonte) return;
    e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch (x) { /* nada */ }
    const p = pos(e);
    FT.ponteiros.set(e.pointerId, p);
    if (FT.ponteiros.size === 1) {
      const q = FT.q;
      FT.modo = p.x >= q.x && p.x <= q.x + q.lado && p.y >= q.y && p.y <= q.y + q.lado ? 'quadrado' : 'imagem';
    } else if (FT.ponteiros.size === 2) { FT.modo = 'pinca'; FT.pinca = dist(); }
    cv.classList.add('arrastando');
  });
  cv.addEventListener('pointermove', e => {
    const p0 = FT.ponteiros.get(e.pointerId);
    if (!p0) return;
    const p = pos(e), dx = p.x - p0.x, dy = p.y - p0.y;
    FT.ponteiros.set(e.pointerId, p);
    if (FT.modo === 'pinca' && FT.ponteiros.size === 2) { const d = dist(), m = meio(); zoomEm(m.x, m.y, d / FT.pinca); FT.pinca = d; }
    else if (FT.modo === 'quadrado') { FT.q.x += dx; FT.q.y += dy; }
    else if (FT.modo === 'imagem') { FT.x += dx; FT.y += dy; }
    limita(); pinta();
  });
  const solta = e => {
    FT.ponteiros.delete(e.pointerId);
    if (FT.ponteiros.size === 1 && FT.modo === 'pinca') FT.modo = 'imagem';
    if (!FT.ponteiros.size) { FT.modo = ''; cv.classList.remove('arrastando'); }
  };
  cv.addEventListener('pointerup', solta); cv.addEventListener('pointercancel', solta);
  cv.addEventListener('wheel', e => { if (!FT.fonte) return; e.preventDefault(); const p = pos(e); zoomEm(p.x, p.y, Math.exp(-e.deltaY / 400)); limita(); pinta(); }, { passive: false });
  $('#ft-zoom').addEventListener('input', e => {
    if (!FT.fonte) return;
    const alvo = FT.min * Math.pow(FT.max / FT.min, (+e.target.value || 0) / 100);
    zoomEm(FT.fw / 2, FT.fh / 2, alvo / FT.esc); limita(); pinta();
  });
  $('#ft-quad').addEventListener('input', e => {
    if (!FT.fonte) return;
    const q = FT.q, cx = q.x + q.lado / 2, cy = q.y + q.lado / 2;
    q.lado = FT.fw * (+e.target.value || 62) / 100; q.x = cx - q.lado / 2; q.y = cy - q.lado / 2;
    limita(); pinta();
  });
  window.addEventListener('resize', () => {
    if ($('#ft-recorte').hidden || !FT.fonte) return;
    const velho = medeMoldura(), k = velho ? FT.fw / velho : 1;
    FT.x *= k; FT.y *= k; FT.esc *= k; FT.min *= k; FT.max *= k; FT.q.x *= k; FT.q.y *= k; FT.q.lado *= k;
    limita(); pinta();
  });
  $('#ft-autoriza').addEventListener('change', e => { $('#ft-salvar').disabled = !e.target.checked; });
  function fechaRecorte() {
    $('#ft-recorte').hidden = true;
    if (FT.fonte && FT.fonte.close) FT.fonte.close();
    FT.fonte = null; FT.ponteiros.clear();
  }
  $('#ft-cancelar').addEventListener('click', () => { fechaRecorte(); if (ed) desenhaFoto(); });
  const jpeg = (canvas, q) => new Promise(r => canvas.toBlob(r, 'image/jpeg', q));
  async function jpegAte(canvas, max) {
    for (let q = 0.86; q >= 0.5; q -= 0.06) { const b = await jpeg(canvas, q); if (b && b.size <= max) return b; }
    throw new Error('A foto ficou pesada demais. Tente outra.');
  }
  const emBase64 = blob => new Promise((ok, erro) => { const f = new FileReader(); f.onload = () => ok(String(f.result).split(',')[1] || ''); f.onerror = () => erro(new Error('Não consegui ler a foto.')); f.readAsDataURL(blob); });
  $('#ft-salvar').addEventListener('click', async e => {
    if (!$('#ft-autoriza').checked) { $('#ft-erro').textContent = 'Marque a autorização do responsável legal.'; return; }
    $('#ft-erro').textContent = '';
    try {
      const j = await ocupado(e.currentTarget, async () => {
        const ret = await jpegAte(recortaEm(document.createElement('canvas'), 960, 1280, false), 600 * 1024);
        const av = await jpegAte(recortaEm(document.createElement('canvas'), 400, 400, true), 150 * 1024);
        if (!ed.t) { await salva(); if (!ed.t) throw new Error($('#ed-erro').textContent || 'Não consegui gerar a apresentação. Tente de novo.'); }
        return api('foto?t=' + ed.t, { metodo: 'PUT', dados: { retrato: await emBase64(ret), avatar: await emBase64(av), autorizo: true } });
      });
      fechaRecorte();
      recebe(Object.assign(j, { emCall: ed.emCall }), false);
      aviso(j.aviso || 'Foto salva. Ela aparece no slide de escolha do jogador.', !!j.aviso);
      atualizaPrevia();
    } catch (err) { $('#ft-erro').textContent = err.message; }
  });
  $('#ft-apagar').addEventListener('click', async e => {
    if (!confirm('Apagar a foto deste atleta? O R2 volta a mostrar a inicial do nome.')) return;
    try {
      const j = await ocupado(e.currentTarget, () => api('foto?t=' + ed.t, { metodo: 'DELETE' }));
      if (j.registro) recebe(Object.assign(j, { emCall: ed.emCall }), false);
      aviso('Foto apagada.'); atualizaPrevia();
    } catch (err) { aviso(err.message, true); }
  });

  /* ---------------- leitura do atleta: o vídeo dele e o relatório do slide 14 do R2 ----------------
     Portada do painel atual (o id virou o código t). O vídeo sobe direto do navegador pro Blob privado (vendor/blob-client.js
     é o upload() de @vercel/blob/client 2.8.1, empacotado com esbuild). A rota /api/leitura (POST) só libera o envio;
     depois, o painel registra o arquivo com PUT /api/leitura. A prévia usa o mesmo componente do deck (relatorio-leitura.js). */
  const MB = 1024 * 1024;
  const EXT = { 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' };
  let lt = null;
  let envio = null;
  let urlLocal = '';
  const nomeAleatorio = () => { const a = 'abcdefghijkmnpqrstuvwxyz23456789', b = new Uint8Array(24); crypto.getRandomValues(b); return Array.from(b, x => a[x % a.length]).join(''); };
  const mmssEdita = t => RL.mmss(t) + (t % 1 ? ',' + Math.round((t % 1) * 10) : '');
  const leMinuto = s => { const m = /^\s*(\d+)(?::(\d{1,2})(?:[.,](\d))?)?\s*$/.exec(String(s)); if (!m) return NaN; return m[2] == null ? Number(m[1]) : Number(m[1]) * 60 + Number(m[2]) + (m[3] ? Number(m[3]) / 10 : 0); };
  const vencimento = iso => iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '';

  $('#bt-leitura').addEventListener('click', () => { if (ed && ed.t) abreLeitura(ed.t); });
  async function abreLeitura(t) {
    $('#lt-erro').textContent = ''; $('#lt-video-erro').textContent = ''; $('#lt-json-erros').hidden = true; $('#lt-previa').hidden = true;
    $('#leitura').showModal();
    try {
      const j = await api('leitura?t=' + t);
      const l = j.leitura || {};
      lt = { t, nome: j.nome, apelido: j.apelido, video: j.video, valido: j.valido, vencido: j.vencido, regras: j.regras, sujo: false, ultima: 'bom',
        leitura: { origem: l.origem || '', criterio: l.criterio || 'selecao', lances: (l.lances || []).slice(), fortes: (l.fortes || []).slice(), prioridades: (l.prioridades || []).slice() } };
      $('#lt-titulo').textContent = 'Leitura do atleta · ' + (j.nome || '');
      $('#lt-dias').textContent = j.regras.validadeDias;
      $('#lt-tipo').innerHTML = j.regras.tipos.map(x => `<option>${esc(x)}</option>`).join('');
      desenhaLeitura(true);
    } catch (err) { $('#lt-erro').textContent = err.message; }
  }
  function desenhaLeitura(trocaVideo) {
    const v = lt.video || {};
    const autorizado = !!v.autorizadoEm, temVideo = !!(lt.valido && v.arquivo);
    $('#lt-autoriza').checked = autorizado; $('#lt-autoriza').disabled = autorizado;
    $('#lt-autorizado').hidden = !autorizado;
    $('#lt-autorizado').textContent = autorizado ? 'Autorizado por ' + v.autorizadoPor + ' em ' + vencimento(v.autorizadoEm) + '.' : '';
    $('#lt-p2').classList.toggle('off', !autorizado);
    ['#lt-p3', '#lt-p4', '#lt-p5'].forEach(s => $(s).classList.toggle('off', !temVideo));
    $('#lt-escolher').textContent = temVideo ? 'Trocar vídeo' : 'Enviar vídeo';
    $('#lt-escolher').disabled = lt.regras && lt.regras.envio === false;
    if (lt.regras && lt.regras.envio === false && !temVideo) $('#lt-video-erro').textContent = 'O envio de vídeo só funciona no painel publicado (loja de Blob).';
    $('#lt-apagar').hidden = !temVideo && !autorizado;
    $('#lt-video-info').hidden = !temVideo;
    if (temVideo) $('#lt-video-info').textContent = 'Vídeo no painel: ' + RL.mmss(v.duracaoS) + ', ' + (v.bytes / MB).toFixed(1).replace('.', ',') + ' MB. Sai do ar em ' + vencimento(v.venceEm) + '.';
    else if (lt.vencido) $('#lt-video-erro').textContent = 'O vídeo deste atleta passou da validade e saiu do ar. Envie de novo, se ainda tiver a autorização.';
    if (trocaVideo) {
      const vid = $('#lt-video');
      if (urlLocal) vid.src = urlLocal; else if (temVideo) vid.src = '/api/video?t=' + lt.t; else vid.removeAttribute('src');
      $('#lt-poster-img').hidden = !(temVideo && v.poster);
      if (temVideo && v.poster) $('#lt-poster-img').src = '/api/video?t=' + lt.t + '&poster=1&v=' + encodeURIComponent(v.poster.slice(-12));
    }
    $$('[data-forte]').forEach(i => { i.value = lt.leitura.fortes[+i.dataset.forte] || ''; });
    $$('[data-prior]').forEach(i => { i.value = lt.leitura.prioridades[+i.dataset.prior] || ''; });
    $$('[name=lt-origem]').forEach(r => { r.checked = r.value === lt.leitura.origem; });
    $$('[name=lt-criterio]').forEach(r => { r.checked = r.value === lt.leitura.criterio; });
    desenhaLances();
  }
  function desenhaLances(foca) {
    const ls = lt.leitura.lances;
    ls.sort((a, b) => a.t - b.t);
    if (!ls.length) { $('#lt-lances').innerHTML = '<p class="lt-vazio">Nenhum lance marcado. Dê o play e aperte B (bom) ou A (a melhorar) no momento do lance.</p>'; return; }
    const tipos = lt.regras.tipos;
    $('#lt-lances').innerHTML = `<table class="lt-tab"><thead><tr><th>Minuto</th><th>Tipo</th><th>Leitura</th><th>Nota</th><th></th></tr></thead><tbody>${ls.map((x, i) => `<tr data-i="${i}">
      <td class="t"><input class="in" data-c="t" value="${esc(mmssEdita(x.t))}" aria-label="Minuto"></td>
      <td class="tp"><select class="in" data-c="tipo">${tipos.map(t => `<option${t === x.tipo ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></td>
      <td class="le"><select class="in" data-c="leitura"><option value="bom"${x.leitura === 'bom' ? ' selected' : ''}>bom</option><option value="ajustar"${x.leitura === 'ajustar' ? ' selected' : ''}>a melhorar</option></select></td>
      <td><input class="in" data-c="nota" maxlength="70" value="${esc(x.nota || '')}" placeholder="O que ele fez (até 70)"></td>
      <td style="white-space:nowrap"><button class="bt mini" type="button" data-ir="${i}" title="Pular pro lance" aria-label="Pular pro lance">▶</button> <button class="bt mini perigo" type="button" data-tira="${i}" title="Apagar o lance" aria-label="Apagar o lance">✕</button></td></tr>`).join('')}</tbody></table>`;
    if (foca != null) { const n = $('#lt-lances tr[data-i="' + foca + '"] [data-c=nota]'); if (n) { n.focus(); n.scrollIntoView({ block: 'nearest' }); } }
  }
  function marca(leitura) {
    if (!lt || $('#lt-p3').classList.contains('off')) return;
    const vid = $('#lt-video');
    if (!vid.duration) return;
    const t = Math.round(vid.currentTime * 10) / 10;
    lt.ultima = leitura;
    const novo = { t, tipo: $('#lt-tipo').value, leitura, nota: '' };
    lt.leitura.lances.push(novo); lt.sujo = true;
    lt.leitura.lances.sort((a, b) => a.t - b.t);
    desenhaLances(lt.leitura.lances.indexOf(novo));
  }
  $('#lt-bom').addEventListener('click', () => marca('bom'));
  $('#lt-ajustar').addEventListener('click', () => marca('ajustar'));
  $('#lt-marcar').addEventListener('click', () => marca(lt ? lt.ultima : 'bom'));
  document.addEventListener('keydown', e => {
    if (!lt || !$('#leitura').open) return;
    if (e.key === 'Enter' && e.target.dataset && e.target.dataset.c === 'nota') { e.preventDefault(); e.target.blur(); $('#lt-video').focus(); return; }
    if (e.target.closest('input,select,textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase(), vid = $('#lt-video');
    if (k === 'b') { e.preventDefault(); marca('bom'); } else if (k === 'a') { e.preventDefault(); marca('ajustar'); }
    else if (k === 'm') { e.preventDefault(); marca(lt.ultima); }
    else if (k === ' ' && !e.target.closest('button,video')) { e.preventDefault(); if (vid.paused) vid.play().catch(() => {}); else vid.pause(); }
  });
  $('#lt-lances').addEventListener('change', e => {
    const tr = e.target.closest('tr[data-i]'); if (!tr) return;
    const x = lt.leitura.lances[+tr.dataset.i], c = e.target.dataset.c;
    if (c === 't') { const t = leMinuto(e.target.value); if (Number.isFinite(t) && t >= 0 && t <= ($('#lt-video').duration || 1e9)) x.t = Math.round(t * 10) / 10; desenhaLances(); }
    else if (c === 'nota') x.nota = e.target.value.slice(0, 70);
    else x[c] = e.target.value;
    lt.sujo = true;
  });
  $('#lt-lances').addEventListener('input', e => { if (e.target.dataset.c === 'nota') { lt.leitura.lances[+e.target.closest('tr').dataset.i].nota = e.target.value.slice(0, 70); lt.sujo = true; } });
  $('#lt-lances').addEventListener('click', e => {
    const ir = e.target.closest('[data-ir]'), tira = e.target.closest('[data-tira]');
    if (ir) { const vid = $('#lt-video'); vid.currentTime = Math.max(0, lt.leitura.lances[+ir.dataset.ir].t - 2); vid.play().catch(() => {}); }
    if (tira) { lt.leitura.lances.splice(+tira.dataset.tira, 1); lt.sujo = true; desenhaLances(); }
  });
  $$('[data-forte],[data-prior]').forEach(i => i.addEventListener('input', () => { if (lt) lt.sujo = true; }));
  $$('[name=lt-origem],[name=lt-criterio]').forEach(r => r.addEventListener('change', () => { if (lt) lt.sujo = true; }));
  function leituraDaTela() {
    const l = lt.leitura;
    l.fortes = $$('[data-forte]').map(i => i.value.trim()).filter(Boolean);
    l.prioridades = $$('[data-prior]').map(i => i.value.trim()).filter(Boolean);
    l.origem = ($$('[name=lt-origem]').find(r => r.checked) || {}).value || '';
    l.criterio = ($$('[name=lt-criterio]').find(r => r.checked) || {}).value || 'selecao';
    return { origem: l.origem, criterio: l.criterio, lances: l.lances.map(x => ({ t: x.t, tipo: x.tipo, leitura: x.leitura, nota: (x.nota || '').trim() })), fortes: l.fortes, prioridades: l.prioridades };
  }
  $('#lt-autoriza').addEventListener('change', async e => {
    if (!e.target.checked) return;
    try { const j = await api('leitura?t=' + lt.t, { metodo: 'PUT', dados: { autorizar: true } }); lt.video = j.video; lt.valido = j.valido; desenhaLeitura(false); }
    catch (err) { e.target.checked = false; $('#lt-erro').textContent = err.message; }
  });
  $('#lt-escolher').addEventListener('click', () => {
    if (lt.leitura.lances.length && !confirm('Trocar o vídeo apaga os lances marcados neste (eles eram deste vídeo). Seguir?')) return;
    $('#lt-arquivo').click();
  });
  function confereVideo(arq) {
    return new Promise(resolve => {
      if (!EXT[arq.type]) return resolve({ erro: 'Envie mp4 (de preferência), webm ou mov.' });
      if (arq.size > lt.regras.maxBytes) return resolve({ erro: 'O vídeo tem ' + Math.round(arq.size / MB) + ' MB. O limite é 250 MB.' });
      const teste = document.createElement('video');
      if (!teste.canPlayType(arq.type)) return resolve({ erro: 'O Chrome não abre esse formato. Exporte em mp4 (H.264).' });
      const url = URL.createObjectURL(arq);
      let feito = false;
      const fim = r => { if (feito) return; feito = true; clearTimeout(tempo); resolve(Object.assign(r, { url })); };
      const HEVC = 'O vídeo não abriu. Celular às vezes grava em HEVC, que o Chrome não toca: exporte em mp4 (H.264) e envie de novo.';
      const tempo = setTimeout(() => fim({ erro: HEVC }), 20000);
      teste.preload = 'metadata'; teste.muted = true;
      teste.onloadedmetadata = () => {
        if (!(teste.duration > 0) || !teste.videoWidth) return fim({ erro: HEVC });
        if (teste.duration > lt.regras.maxSegundos + 1) return fim({ erro: 'O vídeo tem ' + RL.mmss(teste.duration) + '. O limite é 5 minutos: corte o vídeo e envie de novo.' });
        fim({ duracaoS: Math.round(teste.duration * 10) / 10 });
      };
      teste.onerror = () => fim({ erro: HEVC });
      teste.src = url;
    });
  }
  $('#lt-arquivo').addEventListener('change', async e => {
    const arq = e.target.files && e.target.files[0]; e.target.value = '';
    if (!arq) return;
    $('#lt-video-erro').textContent = ''; $('#lt-erro').textContent = '';
    const c = await confereVideo(arq);
    if (c.erro) { URL.revokeObjectURL(c.url); $('#lt-video-erro').textContent = c.erro; return; }
    let upload;
    try { ({ upload } = await import('/vendor/blob-client.js')); }
    catch (err) { URL.revokeObjectURL(c.url); $('#lt-video-erro').textContent = 'Não consegui abrir o envio. Recarregue o painel.'; return; }
    envio = new AbortController();
    $('#lt-progresso').hidden = false; $('#lt-cancelar').hidden = false; $('#lt-escolher').disabled = true;
    $('#lt-barra').style.width = '0%'; $('#lt-progresso-txt').textContent = 'Enviando: 0%';
    try {
      const r = await upload('videos/' + lt.t + '/' + nomeAleatorio() + '.' + EXT[arq.type], arq, {
        access: 'private', handleUploadUrl: '/api/leitura', contentType: arq.type,
        clientPayload: JSON.stringify({ t: lt.t, tipo: 'video' }), multipart: arq.size > 8 * MB, abortSignal: envio.signal,
        onUploadProgress: p => { $('#lt-barra').style.width = p.percentage + '%'; $('#lt-progresso-txt').textContent = 'Enviando: ' + Math.round(p.percentage) + '% de ' + Math.round(arq.size / MB) + ' MB'; }
      });
      $('#lt-progresso-txt').textContent = 'Registrando o vídeo…';
      const j = await api('leitura?t=' + lt.t, { metodo: 'PUT', dados: { video: { arquivo: r.pathname, tipo: arq.type, bytes: arq.size, duracaoS: c.duracaoS } } });
      if (urlLocal) URL.revokeObjectURL(urlLocal);
      urlLocal = c.url;
      lt.video = j.video; lt.valido = j.valido; lt.vencido = false; lt.leitura.lances = j.leitura ? j.leitura.lances : [];
      desenhaLeitura(true);
      aviso('Vídeo enviado. Agora marque os lances.');
    } catch (err) {
      URL.revokeObjectURL(c.url);
      $('#lt-video-erro').textContent = envio && envio.signal.aborted ? 'Envio cancelado. Nada foi salvo.' : (/client token/i.test(err.message) ? 'O painel não liberou o envio. Confira a autorização e tente de novo.' : err.message || 'O envio falhou. Tente de novo.');
    } finally {
      envio = null; $('#lt-cancelar').hidden = true; $('#lt-escolher').disabled = false;
      setTimeout(() => { $('#lt-progresso').hidden = true; }, 600);
    }
  });
  $('#lt-cancelar').addEventListener('click', () => { if (envio) envio.abort(); });
  $('#lt-apagar').addEventListener('click', async e => {
    if (!confirm('Apagar o vídeo, a capa e a leitura deste atleta? O slide 14 volta pra leitura ao vivo.')) return;
    try {
      await ocupado(e.currentTarget, () => api('leitura?t=' + lt.t, { metodo: 'DELETE' }));
      if (urlLocal) { URL.revokeObjectURL(urlLocal); urlLocal = ''; }
      lt.video = null; lt.valido = false; lt.leitura = { origem: '', criterio: 'selecao', lances: [], fortes: [], prioridades: [] }; lt.sujo = false;
      desenhaLeitura(true); aviso('Vídeo e leitura apagados.');
    } catch (err) { $('#lt-erro').textContent = err.message; }
  });
  $('#lt-poster').addEventListener('click', async e => {
    const vid = $('#lt-video');
    if (!vid.videoWidth) { $('#lt-erro').textContent = 'Dê o play e pause no quadro que você quer.'; return; }
    try {
      await ocupado(e.currentTarget, async () => {
        const k = Math.min(1, 960 / vid.videoWidth), c = document.createElement('canvas');
        c.width = Math.round(vid.videoWidth * k); c.height = Math.round(vid.videoHeight * k);
        c.getContext('2d').drawImage(vid, 0, 0, c.width, c.height);
        const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', .86));
        const { upload } = await import('/vendor/blob-client.js');
        const r = await upload('videos/' + lt.t + '/' + nomeAleatorio() + '.jpg', blob, { access: 'private', handleUploadUrl: '/api/leitura', contentType: 'image/jpeg', clientPayload: JSON.stringify({ t: lt.t, tipo: 'poster' }) });
        const j = await api('leitura?t=' + lt.t, { metodo: 'PUT', dados: { poster: r.pathname } });
        lt.video = j.video;
        $('#lt-poster-img').src = URL.createObjectURL(blob); $('#lt-poster-img').hidden = false;
      });
      aviso('Capa salva.');
    } catch (err) { $('#lt-erro').textContent = err.message || 'Não consegui salvar a capa.'; }
  });
  $('#lt-ver').addEventListener('click', () => {
    const d = RL.derivados(leituraDaTela(), lt.video && lt.video.duracaoS, '');
    $('#lt-previa').hidden = false;
    $('#lt-previa').innerHTML = `<div><p class="rl-k" style="margin-top:0">O jogo do ${esc(R.comoChama(lt.nome, lt.apelido))}</p>${RL.linha(d, lt.video && lt.video.duracaoS)}<ul class="rl-curtos">${RL.curtos(d)}</ul>
      <p class="rl-pe">${esc(d.criterio)} ${esc(d.fonte || 'Escolha a fonte (passo 4).')}</p></div>
      <div>${d.rosca ? RL.rosca(d) : '<p class="rl-pe">A rosca aparece com 5 lances ou mais (a porcentagem, com 10 ou mais).</p>'}${RL.fortes(d)}${RL.prioridades(d)}${RL.foco(d)}
      <p class="rl-pe">O primeiro foco do slide vem da ficha do apresentador (campo Primeiro foco); sem ele, a primeira prioridade.</p></div>`;
  });
  function confereImportado(e) {
    const erros = [], dur = (lt.video && lt.video.duracaoS) || lt.regras.maxSegundos, tipos = lt.regras.tipos;
    const limpo = s => String(s == null ? '' : s).replace(/<[^>]*>/g, ' ').replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 70);
    if (!e || typeof e !== 'object') return { erros: ['O arquivo não é um JSON de leitura.'] };
    const origem = e.origem === 'zyron' || e.origem === 'equipe' ? e.origem : '';
    if (e.origem && !origem) erros.push('Fonte inválida: use "zyron" ou "equipe".');
    const lances = [];
    (Array.isArray(e.lances) ? e.lances : []).forEach((l, i) => {
      const n = i + 1, t = Number(l && l.t), tipo = tipos.find(x => x.toLowerCase() === String((l && l.tipo) || '').trim().toLowerCase());
      if (!Number.isFinite(t) || t < 0 || t > dur) return erros.push('Lance ' + n + ': o minuto está fora do vídeo.');
      if (!tipo) return erros.push('Lance ' + n + ': tipo "' + limpo(l.tipo) + '" fora da lista.');
      if (l.leitura !== 'bom' && l.leitura !== 'ajustar') return erros.push('Lance ' + n + ': a leitura tem que ser "bom" ou "ajustar".');
      lances.push({ t: Math.round(t * 10) / 10, tipo, leitura: l.leitura, nota: limpo(l.nota) });
    });
    const lista = (v, nome) => { const a = (Array.isArray(v) ? v : []).map(limpo).filter(Boolean); if (a.length > 3) erros.push(nome + ': só entram 3.'); return a.slice(0, 3); };
    return { erros, leitura: { origem, criterio: e.criterio === 'todos' ? 'todos' : 'selecao', lances, fortes: lista(e.fortes, 'Pontos fortes'), prioridades: lista(e.prioridades, 'Prioridades') } };
  }
  $('#lt-importar').addEventListener('click', () => $('#lt-json').click());
  $('#lt-json').addEventListener('change', async e => {
    const arq = e.target.files && e.target.files[0]; e.target.value = '';
    if (!arq) return;
    let dados;
    try { dados = JSON.parse(await arq.text()); } catch (err) { dados = null; }
    const r = confereImportado(dados);
    $('#lt-json-erros').hidden = !r.erros.length;
    $('#lt-json-erros').innerHTML = r.erros.map(x => '<li>' + esc(x) + '</li>').join('');
    if (r.leitura) { lt.leitura = r.leitura; lt.sujo = true; desenhaLeitura(false); aviso(r.erros.length ? 'Importado, com ' + r.erros.length + ' linha(s) de fora. Confira a lista.' : 'Leitura importada. Confira e salve.', !!r.erros.length); }
  });
  $('#lt-exportar').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(leituraDaTela(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'leitura-' + lt.t.slice(0, 8) + '.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  $('#lt-salvar').addEventListener('click', async e => {
    $('#lt-erro').textContent = '';
    const l = leituraDaTela();
    if (!l.origem) { $('#lt-erro').textContent = 'Escolha quem fez a leitura: Zyron ou Equipe (passo 4).'; return; }
    if (!l.lances.length) { $('#lt-erro').textContent = 'Marque pelo menos um lance antes de salvar.'; return; }
    try {
      const j = await ocupado(e.currentTarget, () => api('leitura?t=' + lt.t, { metodo: 'PUT', dados: { leitura: l } }));
      lt.video = j.video; lt.leitura = Object.assign(lt.leitura, j.leitura); lt.sujo = false;
      desenhaLances(); aviso('Leitura salva. Ela já aparece no slide 14.'); atualizaPrevia();
    } catch (err) { $('#lt-erro').textContent = err.message; }
  });
  function fechaLeitura() {
    if (envio) { if (!confirm('O vídeo ainda está subindo. Cancelar o envio e fechar?')) return; envio.abort(); }
    if (lt && lt.sujo && !confirm('Tem lance ou texto que não foi salvo. Fechar mesmo assim?')) return;
    const vid = $('#lt-video'); vid.pause(); vid.removeAttribute('src'); vid.load();
    if (urlLocal) { URL.revokeObjectURL(urlLocal); urlLocal = ''; }
    $('#leitura').close();
    lt = null;
    if (ed && ed.t) confereDeFora();
  }
  $('#lt-fechar').addEventListener('click', fechaLeitura);
  $('#lt-fechar2').addEventListener('click', fechaLeitura);
  $('#leitura').addEventListener('cancel', e => { e.preventDefault(); fechaLeitura(); });

  /* ---------------- usuários ---------------- */
  const PAPEL = { sdr: ['SDR (R1)', 'azul'], closer: ['Closer (R2)', ''], admin: ['Admin', 'cinza'] };
  function geraSenha() {
    const alf = 'abcdefghjkmnpqrstuvwxyz23456789', b = new Uint8Array(12); crypto.getRandomValues(b);
    const s = Array.from(b, x => alf[x % alf.length]).join('');
    return s.slice(0, 4) + '-' + s.slice(4, 8) + '-' + s.slice(8, 12);
  }
  $('#bt-gerar').addEventListener('click', () => { $('#f-usuario').senha.value = geraSenha(); });
  async function carregaUsuarios() {
    $('#f-usuario').senha.value = $('#f-usuario').senha.value || geraSenha();
    $('#usuarios').innerHTML = '<tr><td colspan="4">Carregando…</td></tr>';
    try { usuarios = (await api('usuarios')).usuarios || []; desenhaUsuarios(); }
    catch (err) { $('#usuarios').innerHTML = '<tr><td colspan="4">' + esc(err.message) + '</td></tr>'; }
  }
  function desenhaUsuarios() {
    $('#usuarios').innerHTML = usuarios.map(u => {
      const [p, cor] = PAPEL[u.papel] || [u.papel, 'cinza'];
      const mesmo = eu && u.login === eu.login;
      return `<tr><td><b style="color:var(--white)">${esc(u.nome)}</b>${mesmo ? ' <span class="chip cinza">você</span>' : ''}${u.ambiente ? ' <span class="chip cinza">principal</span>' : ''}</td>
        <td><code>${esc(u.login)}</code></td><td><span class="chip ${cor}">${esc(p)}</span></td>
        <td class="acoes-td">${u.ambiente || mesmo ? '' : `<button class="bt mini" type="button" data-reseta="${esc(u.login)}">Nova senha</button> <button class="bt mini perigo" type="button" data-remove="${esc(u.login)}">Remover</button>`}</td></tr>`;
    }).join('') || '<tr><td colspan="4">Ninguém ainda.</td></tr>';
  }
  function recado(nome, login, senha) {
    const txt = 'Painel de Apresentações: ' + location.origin + '\nLogin: ' + login + '\nSenha: ' + senha;
    $('#usuario-recado').innerHTML = `<div class="recado">Mande pra <b>${esc(nome)}</b> (a senha não aparece de novo):<br>Login <code>${esc(login)}</code> · Senha <code>${esc(senha)}</code> <button class="bt mini" type="button" id="bt-recado">Copiar recado</button></div>`;
    $('#bt-recado').addEventListener('click', async () => aviso((await copia(txt)) ? 'Recado copiado.' : 'Não deu pra copiar.', false));
  }
  $('#f-usuario').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target, bt = $('button[type=submit]', f);
    $('#usuario-erro').textContent = '';
    const dados = { nome: f.nome.value, login: f.login.value.trim().toLowerCase(), papel: f.papel.value, senha: f.senha.value };
    if (usuarios.some(u => u.login === dados.login) && !confirm('Esse login já existe. Trocar o nome, o papel e a senha dele?')) return;
    try {
      await ocupado(bt, () => api('usuarios', { metodo: 'POST', dados }));
      recado(dados.nome, dados.login, dados.senha);
      f.reset(); f.senha.value = geraSenha(); delete f.login.dataset.mexeu;
      aviso('Usuário salvo.');
      carregaUsuarios();
    } catch (err) { $('#usuario-erro').textContent = err.message; }
  });
  $('#f-usuario').nome.addEventListener('input', e => {
    const f = $('#f-usuario');
    if (f.login.dataset.mexeu) return;
    const p = e.target.value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z ]/g, '').trim().split(/\s+/).filter(Boolean);
    f.login.value = p.length > 1 ? p[0] + '.' + p[p.length - 1] : (p[0] || '');
  });
  $('#f-usuario').login.addEventListener('input', e => { e.target.dataset.mexeu = e.target.value ? '1' : ''; });
  $('#usuarios').addEventListener('click', async e => {
    const r = e.target.closest('[data-reseta]'), d = e.target.closest('[data-remove]');
    const u = usuarios.find(x => x.login === ((r || d) && (r || d).dataset[r ? 'reseta' : 'remove']));
    if (!u) return;
    try {
      if (r) {
        if (!confirm('Gerar uma senha nova pra ' + u.nome + '? A atual para de funcionar.')) return;
        const senha = geraSenha();
        await ocupado(r, () => api('usuarios', { metodo: 'POST', dados: { login: u.login, nome: u.nome, papel: u.papel, senha } }));
        recado(u.nome, u.login, senha); aviso('Senha nova gerada.');
      } else {
        if (!confirm('Remover o acesso de ' + u.nome + '? A sessão dele cai na hora. Os leads dele continuam (o admin pode passar pra outra pessoa).')) return;
        await ocupado(d, () => api('usuarios?login=' + encodeURIComponent(u.login), { metodo: 'DELETE' }));
        aviso('Acesso removido.'); carregaUsuarios();
      }
    } catch (err) { aviso(err.message, true); }
  });

  /* ---------------- minha senha ---------------- */
  $('#f-senha').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target, bt = $('button[type=submit]', f);
    $('#senha-erro').textContent = '';
    if (f.nova.value !== f.repete.value) { $('#senha-erro').textContent = 'As duas senhas novas não batem.'; return; }
    try {
      await ocupado(bt, () => api('sessao', { metodo: 'PUT', dados: { atual: f.atual.value, nova: f.nova.value } }));
      f.reset(); aviso('Senha trocada.');
    } catch (err) { $('#senha-erro').textContent = err.message; }
  });

  /* ---------------- começo: se a sessão ainda vale, abre direto ---------------- */
  fetch('/api/sessao', { credentials: 'same-origin' })
    .then(r => (r.ok ? r.json() : null))
    .then(j => (j && j.usuario ? mostraApp(j.usuario, j.config) : mostraEntrar()))
    .catch(() => mostraEntrar('Sem conexão com o painel.'));
})();
