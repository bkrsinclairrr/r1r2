/* Área de membros: telas Oportunidades, Meu perfil, Agenda, Mensagens, Aulas e Atletas da casa. */
(function (W) {
  'use strict';
  const D = W.D, G = W.G, U = W.UI, E = W.E, P = W.P;
  const { ic, chip, av, k, barra, card, seg, sel, cabeca, esc } = U;
  const exterior = o => !/\((?:[A-Z]{2})\)$/.test(o.lugar);

  /* ================= OPORTUNIDADES ================= */
  function cartaoOp(o) {
    const datas = { enc: 'Encaminhado ' + D.ddmm(o.enc), ana: 'Atualizado ' + D.ddmm(o.mov), vid: 'Pedido em ' + D.ddmm(o.mov), ava: 'Avaliação em ' + (o.quando ? D.ddmm(o.quando) : '') };
    return '<article class="oc"><div class="oc-h"><span class="esc">' + ic(/Academia/.test(o.clube) ? 'aulas' : 'clube') + '</span><div><p class="cl">' + esc(o.clube) + '</p><p class="lc">' + esc(o.lugar) + ' · ' + o.cat + '</p></div></div>' +
      '<p class="bs">Busca: <b>' + esc(o.busca) + '</b></p>' + (o.nota ? '<p class="on">' + esc(o.nota) + '</p>' : '') +
      '<div class="oc-f"><span class="vl">' + ic('cadeado') + 'Valores: <b>A consultar</b></span><span class="dt">' + datas[o.etapa] + '</span></div></article>';
  }
  P.oportunidades = {
    titulo: 'Oportunidades',
    html() {
      const f = E.op.filtro, ops = D.OPORT.filter(o => f === 'todos' || (f === 'brasil' ? !exterior(o) : exterior(o)));
      const por = e => ops.filter(o => o.etapa === e);
      const enc = D.encMes(), mes = D.ENC_HISTORICO.concat([enc]);
      const nomes = [-4, -3, -2, -1, 0].map(m => D.MES3[(D.HOJE.getMonth() + m + 12) % 12]);
      const maxB = 20;
      const quadro = '<div class="quadro">' + D.ETAPAS.map(([e, nome]) => {
        const l = por(e), vis = e === 'enc' ? l.slice(0, 4) : l;
        return '<div class="qc"><div class="qc-h"><h3>' + nome + '</h3><b>' + l.length + '</b></div>' + vis.map(cartaoOp).join('') + (l.length > vis.length ? '<p class="mais">+ ' + (l.length - vis.length) + ' encaminhados</p>' : '') + '</div>';
      }).join('') + '</div>';
      const lista = '<section class="card tab"><table class="tbl"><thead><tr><th>Clube</th><th>Local</th><th>Categoria</th><th>Perfil procurado</th><th>Etapa</th><th>Atualizado</th><th>Valores</th></tr></thead><tbody>' +
        ops.map(o => '<tr><td><b>' + esc(o.clube) + '</b></td><td>' + esc(o.lugar) + '</td><td>' + o.cat + '</td><td>' + esc(o.busca) + '</td><td>' + chip(D.ETAPAS.find(x => x[0] === o.etapa)[1], o.etapa === 'ava' ? 'on' : o.etapa === 'vid' ? 'am' : 'ia') + '</td><td class="num">' + D.ddmm(o.mov) + '</td><td>' + chip('A consultar', '', 'cadeado') + '</td></tr>').join('') + '</tbody></table></section>';
      return cabeca('Oportunidades', 'Clubes e academias que receberam o perfil',
        seg('op.vista', [['quadro', ic('grid') + 'Quadro'], ['lista', ic('lista') + 'Lista']], E.op.vista) + '<button type="button" class="btn pri">' + ic('chat') + 'Falar com o Scout</button>') +
        '<section class="kpis"><div class="kpi"><div>' + k('Encaminhados · este mês') + '<p class="kv">' + enc + '</p><p class="kd">Mínimo de 15 por mês</p>' + barra(enc, 15, 'ia') + '</div></div>' +
        '<div class="kpi"><div>' + k('Em análise') + '<p class="kv">' + por('ana').length + '</p><p class="kd">Com a comissão técnica</p></div></div>' +
        '<div class="kpi"><div>' + k('Pediram mais vídeo') + '<p class="kv">' + por('vid').length + '</p><p class="kd">Responder no prazo</p></div></div>' +
        '<div class="kpi"><div>' + k('Avaliação marcada') + '<p class="kv">' + por('ava').length + '</p><p class="kd">' + (por('ava')[0] ? D.ddmm(por('ava')[0].quando) + ' · ' + esc(por('ava')[0].lugar) : 'Nenhuma') + '</p></div></div></section>' +
        '<div class="filtro-op">' + [['todos', 'Todos'], ['brasil', 'Brasil'], ['exterior', 'Exterior']].map(([v, t]) => '<button type="button" class="chipb' + (f === v ? ' on' : '') + '" data-set="op.filtro=' + v + '">' + t + '<b>' + D.OPORT.filter(o => v === 'todos' || (v === 'brasil' ? !exterior(o) : exterior(o))).length + '</b></button>').join('') + '<span class="nota-v">' + ic('cadeado') + 'Os valores de cada oportunidade são passados pelo Scout, numa ligação com a família.</span></div>' +
        (E.op.vista === 'quadro' ? quadro : lista) +
        '<div class="g-op3">' +
        card('Seletiva acompanhada', '<div class="prox-top"><div class="dt"><span>' + D.mes3(D.SELETIVA) + '</span><b>' + D.dd(D.SELETIVA) + '</b></div><div><p class="pt1">Seletiva Sub-17 · Goiânia (GO)</p><p class="pt2">Acompanhada pelo gerente de carreira</p></div></div><ul class="chk"><li class="ok">' + ic('check') + 'Inscrição confirmada</li><li class="ok">' + ic('check') + 'Hospedagem e deslocamento planejados</li><li>' + ic('circulo') + 'Autorização dos responsáveis</li></ul>', { acao: chip('em ' + D.diasEntre(D.HOJE, D.SELETIVA) + ' dias', 'on') }) +
        card('Encaminhamentos por mês', '<div class="colunas"><div class="plot">' + mes.map((v, j) => '<div class="col-b' + (j === mes.length - 1 ? ' atual' : '') + '" style="--v:' + (v / maxB * 100).toFixed(1) + '"><b>' + v + '</b><i></i></div>').join('') + '<span class="min" style="bottom:' + (15 / maxB * 100) + '%"><em>mínimo 15</em></span></div><div class="ex">' + nomes.map(n => '<span>' + n + '</span>').join('') + '</div></div>', { acao: '<span class="k">' + D.encTotal() + ' desde ' + D.mes3(D.ATLETA.entrada) + '</span>' }) +
        card('Perfil na AGN Football', '<ul class="chk"><li class="ok">' + ic('check') + 'Perfil publicado</li><li class="ok">' + ic('check') + 'Vídeo destaque atualizado ' + D.relativo(D.VIDEOS[11].data)  + '</li><li class="ok">' + ic('check') + 'Visível para clubes e agentes</li></ul><a class="btn mt" href="#/perfil">' + ic('olho') + 'Ver como os clubes veem</a>') +
        '</div>';
    }
  };

  /* ================= MEU PERFIL ================= */
  P.perfil = {
    titulo: 'Meu perfil',
    html() {
      const A = D.ATLETA, tipos = D.porTipo(D.LANCES).filter(t => t.n >= 30).sort((a, b) => b.taxa - a.taxa).slice(0, 3);
      const dest = destaque(), v = D.VIDEOS[dest.v];
      const dado = (r, x) => '<div><span>' + r + '</span><b>' + x + '</b></div>';
      return cabeca('Meu perfil', 'Como os clubes veem você', chip('Visível para clubes', 'ok', 'olho') + '<button type="button" class="btn">' + ic('link') + 'Copiar link</button><button type="button" class="btn pri">' + ic('lapis') + 'Editar dados</button>') +
        '<div class="g-perfil"><div class="col">' +
        '<section class="card atl-c"><div class="atl-top">' + av(A.ini, 'xl') + '<div><h2>' + esc(A.nome) + '</h2><p class="pos">' + esc(A.posicao).toUpperCase() + '</p><div class="chips">' + chip('Perfil aprovado', 'ok', 'check') + chip('Em encaminhamento', 'ia') + '</div></div></div>' +
        '<div class="dados">' + dado('Idade', A.idade + ' anos') + dado('Categoria', A.categoria) + dado('Altura', A.altura) + dado('Pé', A.pe) + dado('Cidade', A.cidade + ', ' + A.uf) + dado('Dossiê nº', A.dossie) + '</div>' +
        '<p class="k">Onde ele mais acerta</p><div class="aneis">' + tipos.map((t, j) => '<div class="anel"><div class="rosca" data-r="' + t.taxa + '"></div><p>' + esc(t.tipo) + '</p><span>' + t.n + ' lances lidos</span></div>').join('') + '</div>' +
        '<div class="btns"><button type="button" class="btn pri">' + ic('chat') + 'Falar com o Scout</button><button type="button" class="btn">' + ic('doc') + 'Baixar perfil em PDF</button></div></section>' +
        card('Vídeo destaque', '<div class="frame"><div class="vz" id="c-dest"></div><span class="ft ftl">' + D.mmss(dest.t) + ' · ' + esc(dest.tipo).toUpperCase() + '</span><span class="ft ftr bom">DECISÃO BOA</span></div><div class="lance"><div><p class="lt">' + esc(dest.nota) + '</p><p class="ln">' + esc(v.titulo) + ' · ' + D.ddmm(v.data) + ' · lido pelo Zyron</p></div><button type="button" class="btn">' + ic('play') + 'Assistir</button></div>', { acao: chip('Visível para clubes', 'ok') }) +
        '</div><div class="col">' +
        card('Posição em campo', '<div class="form" id="c-form"></div><p class="rod">4-3-3 · atualizado hoje · Scout</p>', { acao: chip(A.posicao, 'on') }) +
        card('Mensagens de clubes', '<aside class="popup"><div class="pp-h">' + av('CL', 'sm', 'ia') + '<div><p>Clube da Série B · Paraná</p><span>Departamento de captação · ' + D.relativo(D.somaDias(-3)) + '</span></div></div><p class="bolha">Recebemos o perfil do ' + esc(A.primeiro) + ' e queremos ver mais jogos dele. Podem enviar os vídeos dos últimos dois meses?</p><div class="pp-in">Escreva uma mensagem...' + ic('enviar') + '</div></aside>', { acao: chip('1 nova', 'ia') }) +
        card('Visibilidade', '<ul class="chk"><li class="ok">' + ic('check') + 'Perfil publicado na AGN Football</li><li class="ok">' + ic('check') + 'Rede de mais de 250 clubes</li><li class="ok">' + ic('check') + 'Último acesso de clube: ontem</li></ul>') +
        '</div></div>';
    },
    pos(el) {
      G.formacao(el.querySelector('#c-form'), D.ATLETA.posId, D.ATLETA.nome);
      G.visaoZyron(el.querySelector('#c-dest'), destaque());
      el.querySelectorAll('[data-r]').forEach(b => { const r = Number(b.dataset.r); G.rosca(b, r, 100, { tam: 112, espessura: 12 }); b.querySelector('.rm').innerHTML = '<b>' + r + '<small>%</small></b>'; });
    }
  };
  // o lance que vira vídeo destaque: o último passe bom com nota
  function destaque() { return D.LANCES.slice().reverse().find(l => l.tipo === 'Passe' && l.leitura === 'bom' && l.nota && l.x > 50) || D.LANCES[D.LANCES.length - 1]; }

  /* ================= AGENDA ================= */
  function eventosAgenda() {
    const ev = [], ini = new Date(D.HOJE.getFullYear(), D.HOJE.getMonth() - 1, 1, 12), fim = new Date(D.HOJE.getFullYear(), D.HOJE.getMonth() + 3, 0, 12);
    const quinta0 = D.somaDias(((4 - D.HOJE.getDay() + 7) % 7) + 0, D.HOJE); // a próxima quinta
    for (let d = new Date(ini); d <= fim; d.setDate(d.getDate() + 1)) {
      const x = new Date(d);
      if (x.getDay() === 1) ev.push({ d: x, tipo: 'lig', hora: '18:30', t: 'Ligação semanal', q: 'Estrategista esportivo' });
      if (x.getDay() === 3 && Math.round(D.diasEntre(quinta0, x) / 7) % 2 === 0) ev.push({ d: x, tipo: 'aula', hora: '19:00', t: 'Aula ao vivo', q: 'Turma de 10' });
      if (x.getDay() === 4 && D.diasEntre(quinta0, x) % 14 === 0) ev.push({ d: x, tipo: 'rel', hora: '', t: 'Relatório quinzenal', q: 'Analista de performance' });
      if (x.getDate() === 22 && x.getDay() >= 1 && x.getDay() <= 5) ev.push({ d: x, tipo: 'dav', hora: '19:00', t: 'Assessoria individual', q: 'David Willer' });
    }
    ev.push({ d: D.SELETIVA, tipo: 'mar', hora: '08:00', t: 'Seletiva · Goiânia (GO)', q: 'Acompanhada pelo gerente de carreira' });
    ev.push({ d: D.AVAL, tipo: 'mar', hora: '14:00', t: 'Avaliação presencial', q: 'Clube da Série A · São Paulo (SP)' });
    return ev.sort((a, b) => a.d - b.d || (a.hora || '').localeCompare(b.hora || ''));
  }
  const TIPO_EV = { lig: ['Ligação', 'tel'], aula: ['Aula', 'aulas'], rel: ['Relatório', 'doc'], dav: ['David', 'estrela'], mar: ['Marco', 'pino'] };
  P.agenda = {
    titulo: 'Agenda',
    html() {
      const ev = eventosAgenda(), h = D.HOJE, y = h.getFullYear(), m = h.getMonth(), prim = new Date(y, m, 1, 12), ult = new Date(y, m + 1, 0, 12);
      const ini = D.somaDias(-prim.getDay(), prim), semanas = Math.ceil((prim.getDay() + ult.getDate()) / 7);
      let cel = '';
      for (let i = 0; i < semanas * 7; i++) {
        const d = D.somaDias(i, ini), fora = d.getMonth() !== m, ehHoje = D.diasEntre(d, h) === 0;
        const es = ev.filter(e => D.diasEntre(e.d, d) === 0);
        cel += '<div class="dia' + (fora ? ' fora' : '') + (ehHoje ? ' hoje' : '') + '"><b>' + d.getDate() + '</b>' + es.slice(0, 2).map(e => '<span class="ev ' + e.tipo + '">' + (e.hora ? e.hora + ' ' : '') + esc(e.t) + '</span>').join('') + (es.length > 2 ? '<em>+' + (es.length - 2) + '</em>' : '') + '</div>';
      }
      const prox = ev.filter(e => e.d >= D.HOJE && e.tipo !== 'mar').slice(0, 5).concat(ev.filter(e => e.d >= D.HOJE && e.tipo === 'mar')).sort((a, b) => a.d - b.d || (a.hora || '').localeCompare(b.hora || ''));
      return cabeca(D.cap(D.MESES[m]) + ' de ' + y, 'Agenda', '<span class="leg-ev">' + Object.keys(TIPO_EV).map(t => '<span><i class="ev ' + t + '"></i>' + TIPO_EV[t][0] + '</span>').join('') + '</span>') +
        '<div class="g-ag"><section class="card cal"><div class="sem">' + D.DIA3.map(s => '<span>' + s + '</span>').join('') + '</div><div class="grade" style="grid-template-rows:repeat(' + semanas + ',1fr)">' + cel + '</div></section>' +
        card('Próximos', '<ol class="agl">' + prox.map(e => '<li class="' + e.tipo + '"><span class="dt"><span>' + D.DIA3[e.d.getDay()] + '</span><b>' + D.ddmm(e.d) + '</b></span><div><p>' + esc(e.t) + '</p><span>' + (e.hora ? e.hora + ' · ' : '') + esc(e.q) + '</span></div>' + ic(TIPO_EV[e.tipo][1]) + '</li>').join('') + '</ol>') + '</div>';
    }
  };

  /* ================= MENSAGENS ================= */
  const hh = (n, hm) => ({ n, hm });
  function threads() {
    const ont = D.somaDias(-1), hoje = D.HOJE;
    return {
      scout: { dia: [[ont, [['ele', '18:02', 'Fernando, o Clube da Série B pediu mais vídeo. Consegue enviar os jogos dos últimos dois meses?', { t: 'Pedido de vídeo', s: 'Clube da Série B · Paraná · Sub-17', i: 'video' }], ['eu', '18:40', 'Mando hoje à noite. O vídeo de sábado serve?'], ['ele', '18:44', 'Serve. Quanto mais lances de jogo, melhor pro Zyron ler.']]],
        [hoje, [['ele', '08:20', 'O Zyron já está lendo o vídeo de hoje. Te aviso quando terminar.', { t: D.VIDEO_NOVO.titulo, s: 'Zyron lendo · ' + D.VIDEO_NOVO.lendo + '%', i: 'video' }], ['ele', '08:31', 'Sobre a avaliação do dia ' + D.dd(D.AVAL) + '/' + D.mm(D.AVAL) + ' em São Paulo: a logística já está combinada com o gerente de carreira.'], ['eu', '08:33', 'Pode ligar hoje à noite para falar dos valores?'], ['ele', '08:35', 'Os valores de cada oportunidade eu passo para a família, numa ligação. Combinado: hoje, às 19h.']]]] },
      gerente: { dia: [[ont, [['ele', '17:10', 'Passei o roteiro de viagem da avaliação. Falta só a autorização dos responsáveis.', { t: 'Roteiro de viagem', s: 'PDF · 2 páginas', i: 'doc' }], ['eu', '17:32', 'Assinamos amanhã e mandamos por aqui.']]]] },
      david: { dia: [[D.somaDias(-18), [['ele', '19:40', 'Boa conversa hoje, Fernando. Segue o resumo da nossa assessoria individual.', { t: 'Resumo da assessoria', s: 'PDF · outubro', i: 'doc' }]]]] },
      esportivo: { dia: [[D.somaDias(-3), [['ele', '18:55', 'Segunda a gente fecha o treino de finalização. Mande o vídeo do sábado até domingo.']]]] },
      analista: { dia: [[D.somaDias(-3), [['ele', '10:12', 'O relatório quinzenal nº 7 está disponível.', { t: 'Relatório quinzenal · nº 7', s: 'PDF · decisões boas e prioridades', i: 'doc' }]]]] },
      turma: { dia: [[D.somaDias(-2), [['ele', '20:01', 'Pessoal, a aula ao vivo de quarta é sobre nutrição de pré-jogo. Levem dúvidas.']]]] }
    };
  }
  const LISTA_MSG = [['scout', 'Scout', 'Estrategista de carreiras', 'SC', 2, 'Os valores eu passo numa ligação.', 'hoje', true], ['gerente', 'Gerente de carreira', 'Acompanhamento e logística', 'GC', 0, 'Assinamos amanhã e mandamos por aqui.', 'ontem', true], ['david', 'David Willer', 'Assessoria individual', 'DW', 0, 'Segue o resumo da nossa assessoria.', D.ddmm(D.somaDias(-18)), false], ['esportivo', 'Estrategista esportivo', 'Relatório e ligação', 'EE', 0, 'Mande o vídeo do sábado até domingo.', D.ddmm(D.somaDias(-3)), false], ['analista', 'Analista de performance', 'Relatório quinzenal', 'AP', 0, 'O relatório quinzenal nº 7 está disponível.', D.ddmm(D.somaDias(-3)), false], ['turma', 'Turma de 10', 'Grupo · 10 atletas', 'T10', 0, 'Aula ao vivo de quarta: nutrição de pré-jogo.', D.ddmm(D.somaDias(-2)), false]];
  P.mensagens = {
    titulo: 'Mensagens',
    html() {
      const id = E.msg.sel, th = threads()[id], info = LISTA_MSG.find(x => x[0] === id);
      const rotuloDia = d => D.diasEntre(d, D.HOJE) === 0 ? 'Hoje' : D.diasEntre(d, D.HOJE) === 1 ? 'Ontem' : D.ddmm(d);
      const msgs = th.dia.map(([d, ms]) => '<p class="dia-s"><span>' + rotuloDia(d) + '</span></p>' + ms.map(m => '<div class="msg ' + (m[0] === 'eu' ? 'meu' : 'ele') + '"><div class="bol"><p>' + esc(m[2]) + '</p>' + (m[3] ? '<div class="anx">' + ic(m[3].i) + '<div><b>' + esc(m[3].t) + '</b><span>' + esc(m[3].s) + '</span></div></div>' : '') + '<small>' + m[1] + '</small></div></div>').join('')).join('');
      return '<div class="g-msg"><aside class="conv"><div class="conv-h"><h1>Mensagens</h1><button type="button" class="ib" aria-label="Nova mensagem">' + ic('mais') + '</button></div><div class="conv-b"><span>' + ic('busca') + 'Buscar conversa</span></div><ul>' +
        LISTA_MSG.map(c => '<li><button type="button" class="' + (c[0] === id ? 'on' : '') + '" data-set="msg.sel=' + c[0] + '">' + av(c[3], '', c[7] ? 'onl' : '') + '<div><p>' + esc(c[1]) + '</p><span>' + esc(c[5]) + '</span></div><em>' + c[6] + (c[4] ? '<b>' + c[4] + '</b>' : '') + '</em></button></li>').join('') + '</ul></aside>' +
        '<section class="thr"><header class="thr-h">' + av(info[3], 'sm', info[7] ? 'onl' : '') + '<div><p>' + esc(info[1]) + '</p><span>' + (info[7] ? '<i class="pt-on"></i>Online agora · ' : '') + esc(info[2]) + '</span></div><span class="thr-a"><button type="button" class="ib" aria-label="Ligar">' + ic('tel') + '</button><button type="button" class="ib" aria-label="Vídeo">' + ic('video') + '</button></span></header><div class="msgs">' + msgs + '</div><div class="comp"><span class="ib">' + ic('clipe') + '</span><span class="in">Escreva uma mensagem...</span><button type="button" class="ib env" aria-label="Enviar">' + ic('enviar') + '</button></div></section>' +
        '<aside class="inf">' + av(info[3], 'lg', info[7] ? 'onl' : '') + '<h2>' + esc(info[1]) + '</h2><p>' + esc(info[2]) + '</p><dl><dt>Ritmo</dt><dd>' + esc((D.EQUIPE.find(e => e.id === id) || { ritmo: 'Grupo' }).ritmo) + '</dd><dt>Seu contato desde</dt><dd>' + D.ddmm(D.ATLETA.entrada) + '</dd></dl>' +
        (id === 'scout' ? '<div class="nota-v">' + ic('cadeado') + '<p>Valores das oportunidades: <b>a consultar</b> com o Scout.</p></div>' : '') +
        '<p class="k">Arquivos</p><ul class="docs"><li>' + ic('doc') + '<div><p>Relatório quinzenal nº 7</p><span>PDF</span></div></li><li>' + ic('doc') + '<div><p>Roteiro de viagem</p><span>PDF</span></div></li><li>' + ic('video') + '<div><p>Jogo Sub-17</p><span>Vídeo · ' + D.ddmm(D.somaDias(-1)) + '</span></div></li></ul></aside></div>';
    }
  };

  /* ================= AULAS ================= */
  P.aulas = {
    titulo: 'Aulas',
    html() {
      const tot = D.MODULOS.reduce((a, m) => a + m.aulas, 0), fe = D.MODULOS.reduce((a, m) => a + m.feitas, 0);
      const icones = ['bola', 'evolucao', 'perfil', 'estrela', 'chat', 'olho', 'alvo'];
      return cabeca('Aulas', 'Sete módulos · ' + fe + ' de ' + tot + ' aulas concluídas', '<span class="prog-top">' + barra(fe, tot, 'ia') + '<b>' + Math.round(100 * fe / tot) + '%</b></span>') +
        '<div class="g-aulas"><section class="card cont"><div class="aula-th"><span class="play">' + ic('play') + '</span><i style="width:40%"></i></div><div class="aula-i"><p class="k ia">Continuar de onde parou</p><h2>Finalização de média distância</h2><p class="sub">Performance e desenvolvimento atlético · aula 8 de 9 · 12 min</p><div class="aula-b">' + barra(40, 100, 'ia') + '<span>4:50 de 12:00</span></div><button type="button" class="btn pri">' + ic('play') + 'Continuar</button></div></section>' +
        card('Ao vivo', '<div class="prox-top"><div class="dt"><span>' + D.DIA3[D.util(3).getDay()] + '</span><b>' + D.dd(D.util(3)) + '</b></div><div><p class="pt1">Nutrição de pré-jogo</p><p class="pt2">Aula ao vivo · 19:00 · turma de 10</p></div></div><button type="button" class="btn">' + ic('cal') + 'Adicionar à agenda</button>', { acao: chip('Em ' + D.diasEntre(D.HOJE, D.util(3)) + ' dias', 'on') }) + '</div>' +
        '<div class="mods">' + D.MODULOS.map((m, j) => '<article class="mod"><span class="mi">' + ic(icones[j]) + '</span><h3>' + esc(m.nome) + '</h3><p class="mp"><b>' + m.feitas + '</b> de ' + m.aulas + ' aulas</p>' + barra(m.feitas, m.aulas, m.feitas === m.aulas ? 'ok' : 'ia') + '<p class="mn">' + (m.feitas === m.aulas ? 'Módulo concluído' : 'Próxima: ' + esc(m.prox)) + '</p></article>').join('') +
        '<article class="mod extra"><span class="mi">' + ic('mais') + '</span><h3>Aulas extras</h3><p class="mp"><b>3</b> novas este mês</p><p class="mn">Rotina de recuperação · Leitura de jogo · Mentalidade em avaliações</p></article></div>';
    }
  };

  /* ================= ATLETAS DA CASA ================= */
  P.atletas = {
    titulo: 'Atletas da casa',
    html() {
      const f = E.atl, A = D.ATLETA;
      const todos = D.CASA.filter(c => (f.cat === 'todas' || c[3] === f.cat) && (f.pos === 'todas' || c[2] === f.pos));
      const poss = Array.from(new Set(D.CASA.map(c => c[2]))).sort();
      const voce = '<article class="at voce"><span class="tag">Você</span>' + av(A.ini, 'lg', 'on') + '<div class="tx"><p class="nm">' + esc(A.nome) + '</p><p class="mt">' + A.posicao + ' · ' + A.categoria + ' · ' + A.uf + '</p></div>' + chip('Mapa atualizado', 'ia') + '</article>';
      const cards = (f.cat === 'todas' || f.cat === A.categoria) && (f.pos === 'todas' || f.pos === A.posicao) ? voce : '';
      return cabeca('Atletas da casa', 'Mais de 300 atletas acompanhados', '<span class="conta-g"><b>300+</b> atletas</span>') +
        '<div class="filtros">' + '<div class="chips-f">' + ['todas', 'Sub-14', 'Sub-15', 'Sub-16', 'Sub-17'].map(c => '<button type="button" class="chipb' + (f.cat === c ? ' on' : '') + '" data-set="atl.cat=' + c + '">' + (c === 'todas' ? 'Todas as categorias' : c) + '</button>').join('') + '</div>' +
        sel('atl.pos', [['todas', 'Todas as posições']].concat(poss.map(p => [p, p])), f.pos, 'Posição') + '<span class="conta">Mostrando <b>' + (Math.min(todos.length, cards ? 23 : 24) + (cards ? 1 : 0)) + '</b> de 300+</span></div>' +
        '<div class="g-atl">' + cards + todos.slice(0, cards ? 23 : 24).map(c => '<article class="at"><span class="tag">' + c[1] + '</span>' + av(c[0].replace(/[^A-Z]/g, ''), 'lg') + '<div class="tx"><p class="nm">' + esc(c[0]) + '</p><p class="mt">' + esc(c[2]) + ' · ' + c[3] + '</p></div>' + chip(c[4], c[5]) + '</article>').join('') + '</div>' +
        '<div class="pag"><button type="button" class="ib" aria-label="Anterior">' + ic('seta', 'inv') + '</button><b class="on">1</b><b>2</b><b>3</b><span>…</span><b>13</b><button type="button" class="ib" aria-label="Próxima">' + ic('seta') + '</button></div>';
    }
  };
})(window);
