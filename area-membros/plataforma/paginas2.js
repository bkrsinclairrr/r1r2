/* Área de membros: telas Vídeos e leituras, Evolução e Plano de carreira. */
(function (W) {
  'use strict';
  const D = W.D, G = W.G, U = W.UI, E = W.E, P = W.P;
  const { ic, chip, av, k, barra, card, seg, sel, cabeca, esc, cum } = U;
  const sinal = n => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n);
  const leituraChip = l => l === 'bom' ? chip('Decisão boa', 'ia', 'check') : chip('A melhorar', 'am', 'ajuste');

  /* ================= VÍDEOS E LEITURAS ================= */
  function lanceAtual(v) {
    const ls = v.lances;
    let i = E.vid.lance;
    if (i < 0 || i >= ls.length) i = Math.floor(ls.length * .34);
    return { i, l: ls[i] };
  }
  P.leituras = {
    titulo: 'Vídeos e leituras',
    html() {
      if (E.vid.sel < 0 || E.vid.sel >= D.VIDEOS.length) E.vid.sel = D.VIDEOS.length - 1;
      const v = D.VIDEOS[E.vid.sel], ls = v.lances, { i, l } = lanceAtual(v), n = ls.length, bons = v.bons;
      const nv = D.VIDEO_NOVO;
      const lista = D.VIDEOS.slice().reverse().map(x => '<button type="button" class="vi' + (x.i === E.vid.sel ? ' on' : '') + '" data-set="vid.sel=' + x.i + ';vid.lance=-1"><span class="th"></span><div><p class="vt">' + esc(x.titulo) + '</p><p class="vm">' + D.ddmm(x.data) + ' · ' + D.mmss(x.dur) + ' · ' + x.n + ' lances</p></div><b class="vp">' + D.pct(x.lances) + '%</b></button>').join('');
      const marc = ls.map((x, j) => '<button type="button" class="mk ' + x.leitura + (j === i ? ' on' : '') + '" style="left:' + (x.t / v.dur * 100).toFixed(2) + '%" data-set="vid.lance=' + j + '" aria-label="' + esc(x.tipo) + ' ' + D.mmss(x.t) + '"></button>').join('');
      const linhas = ls.map((x, j) => '<tr class="' + (j === i ? 'on' : '') + '" data-set="vid.lance=' + j + '"><td class="num">' + D.mmss(x.t) + '</td><td>' + esc(x.tipo) + '</td><td>' + leituraChip(x.leitura) + '</td><td class="nt">' + esc(x.nota || '—') + '</td></tr>').join('');
      return cabeca('Vídeos e leituras', 'Zyron · lance a lance', '<button type="button" class="btn">' + ic('filtro') + 'Filtrar</button><button type="button" class="btn pri">' + ic('up') + 'Enviar vídeo</button>') +
        '<div class="g-vid"><aside class="vlist"><div class="vl-h"><span class="k">Vídeos</span><b>' + (D.VIDEOS.length + 1) + '</b></div>' +
        '<div class="vi novo"><span class="th"></span><div><p class="vt">' + esc(nv.titulo) + '</p><p class="vm">Hoje, ' + nv.hora + ' · ' + D.mmss(nv.dur) + '</p><span class="prog ia"><i style="width:' + nv.lendo + '%"></i></span></div>' + chip('Lendo', 'ia') + '</div>' + lista + '</aside>' +
        '<div class="col mid">' +
        card(esc(v.titulo) + ' · ' + D.ddmm(v.data), '<div class="frame"><div class="vz" id="c-vz"></div><span class="ft ftl">' + D.mmss(l.t) + ' · ' + esc(l.tipo).toUpperCase() + '</span><span class="ft ftr ' + l.leitura + '">' + (l.leitura === 'bom' ? 'DECISÃO BOA' : 'A MELHORAR') + '</span></div>' +
          '<div class="ctl"><button type="button" class="pl" aria-label="Reproduzir">' + ic('play') + '</button><span class="tm">' + D.mmss(l.t) + ' / ' + D.mmss(v.dur) + '</span><div class="scr"><i class="bar"></i><i class="head" style="left:' + (l.t / v.dur * 100).toFixed(2) + '%"></i>' + marc + '</div><span class="vel">1x</span></div>' +
          '<div class="lance"><div><p class="lt">' + esc(l.tipo) + ' · ' + D.mmss(l.t) + '</p><p class="ln">' + esc(l.nota || 'Sem nota neste lance.') + '</p></div>' + leituraChip(l.leitura) +
          '<span class="nav"><button type="button" class="ib" data-set="vid.lance=' + Math.max(0, i - 1) + '" aria-label="Lance anterior">' + ic('seta', 'inv') + '</button><button type="button" class="ib" data-set="vid.lance=' + Math.min(n - 1, i + 1) + '" aria-label="Próximo lance">' + ic('seta') + '</button></span></div>',
          { acao: chip('Visão do Zyron', 'ia', 'olho') }) +
        card('Lances do vídeo', '<div class="rolagem"><table class="tbl cl"><thead><tr><th>Minuto</th><th>Tipo</th><th>Leitura</th><th>Nota</th></tr></thead><tbody>' + linhas + '</tbody></table></div>', { acao: '<span class="k">' + n + ' lances</span>', cls: 'tab' }) +
        '</div><div class="col">' +
        card('Relatório da leitura', '<div class="rel-r"><div class="rosca" id="c-rosca"></div><ul class="leg"><li><i class="ia"></i><b>' + bons + '</b> decisões boas</li><li><i class="am"></i><b>' + (n - bons) + '</b> a melhorar</li></ul></div>' +
          '<p class="k ia">Pontos fortes</p><ul class="lst fortes">' + D.FORTES.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>' +
          '<p class="k am">Prioridades</p><ul class="lst prior">' + D.PRIORIDADES.map(t => '<li>' + esc(t.nome) + '</li>').join('') + '</ul>' +
          '<p class="nota-r">Lances marcados neste vídeo: todos os lances em que o atleta participa. <b>Leitura do Zyron.</b></p>' +
          '<div class="btns"><button type="button" class="btn">' + ic('baixar') + 'Baixar relatório</button><button type="button" class="btn">' + ic('chat') + 'Falar com o Scout</button></div>') +
        card('Enviar vídeo', '<div class="drop">' + ic('up') + '<p><b>Arraste o vídeo aqui</b> ou escolha um arquivo</p><span>mp4, até 5 minutos e 250 MB</span></div>') +
        '</div></div>';
    },
    pos(el) {
      const v = D.VIDEOS[E.vid.sel], { l } = lanceAtual(v);
      G.visaoZyron(el.querySelector('#c-vz'), l);
      G.rosca(el.querySelector('#c-rosca'), v.bons, v.lances.length, { tam: 150, espessura: 15 });
      const row = el.querySelector('tr.on'); if (row) row.scrollIntoView({ block: 'nearest' });
    }
  };

  /* ================= EVOLUÇÃO ================= */
  P.evolucao = {
    titulo: 'Evolução',
    html() {
      const pm = D.porMes(), p = D.periodo('30'), ini = pm[0], fim = pm[pm.length - 1];
      const baixo = D.porTipo(D.LANCES.filter(l => l.mes <= -3)), cima = D.porTipo(D.LANCES.filter(l => l.mes >= -1));
      const tipos = D.TIPOS.map((t, j) => ({ t, a: baixo[j], b: cima[j] })).filter(x => x.b.n >= 8).sort((x, y) => y.b.n - x.b.n);
      const marcos = [
        [D.ATLETA.entrada, 'Entrada na casa', 'Perfil aprovado e plano de carreira montado'],
        [D.VIDEOS[0].data, 'Primeiro vídeo lido', 'O Zyron leu ' + D.VIDEOS[0].n + ' lances'],
        [D.somaDias(2, D.ATLETA.entrada), 'Primeiro encaminhamento', 'Perfil enviado a um clube da rede'],
        [D.somaDias(12, D.ATLETA.entrada), 'Perfil publicado na AGN Football', 'Visível para clubes e agentes'],
        [D.VIDEOS[9].data, '10 vídeos lidos', 'Histórico de evolução com 10 pontos'],
        [D.VIDEOS[10].data, 'Decisões boas passam de 70%', 'Média de ' + pm[3].rotulo + ': ' + pm[3].taxa + '%'],
        [D.somaDias(-4), 'Avaliação presencial marcada', 'Clube da Série A (SP)']
      ];
      const docs = [
        ['Relatório quinzenal · nº 7', D.somaDias(-3), 'Analista de performance'], ['Relatório quinzenal · nº 6', D.somaDias(-17), 'Analista de performance'],
        ['Relatório de entrada', D.ATLETA.entrada, 'De onde você parte'], ['Guia de preparação pra peneira', D.somaDias(-100), 'O que o avaliador olha'], ['Histórico de evolução', D.HOJE, 'Todos os relatórios num lugar só']
      ];
      const tabela = '<table class="tbl"><thead><tr><th>Mês</th><th>Vídeos</th><th>Lances</th><th>Decisões boas</th><th>Taxa</th></tr></thead><tbody>' + pm.map(m => '<tr><td>' + D.cap(m.rotulo) + '</td><td class="num">' + m.videos + '</td><td class="num">' + m.n + '</td><td class="num">' + m.bons + '</td><td class="num">' + m.taxa + '%</td></tr>').join('') + '</tbody></table>';
      return cabeca('Evolução', 'Fernando Silva · desde ' + D.mes3(D.ATLETA.entrada),
        seg('evo.vista', [['grafico', ic('evolucao') + 'Gráfico'], ['tabela', ic('lista') + 'Tabela']], E.evo.vista)) +
        '<section class="kpis k3"><div class="kpi"><div>' + k('Decisões boas · mês atual') + '<p class="kv">' + fim.taxa + '%</p><p class="kd up">' + ic('sobe') + sinal(fim.taxa - ini.taxa) + ' pts desde ' + ini.rotulo + ' (' + ini.taxa + '%)</p></div><svg class="spk" data-spk="' + pm.map(m => m.taxa).join(',') + '"></svg></div>' +
        '<div class="kpi"><div>' + k('Lances lidos') + '<p class="kv">' + D.LANCES.length + '</p><p class="kd">' + D.VIDEOS.length + ' vídeos · ' + p.atual.length + ' nos últimos 30 dias</p></div><svg class="spk" data-spk="' + cum(pm.map(m => m.n)).join(',') + '"></svg></div>' +
        '<div class="kpi"><div>' + k('Encaminhamentos') + '<p class="kv">' + D.encTotal() + '</p><p class="kd">desde ' + D.mes3(D.ATLETA.entrada) + ' · ' + D.encMes() + ' neste mês</p></div><svg class="spk" data-spk="' + cum(D.ENC_HISTORICO.concat([D.encMes()])).join(',') + '"></svg></div></section>' +
        '<div class="g-evo"><div class="col">' +
        card('Decisões boas por mês', E.evo.vista === 'grafico' ? '<svg class="graf" id="c-linha"></svg><p class="fonte">Lances marcados em cada mês: todos os lances em que o atleta participa. Leitura do Zyron.</p>' : tabela, { acao: chip(D.ATLETA.categoria + ' · ' + D.ATLETA.posicao) }) +
        card('Por tipo de lance: início e agora', '<div class="dbh"><span></span><span class="lgd"><i class="o"></i>Início · ' + pm[0].rotulo + ' e ' + pm[1].rotulo + '</span><span class="lgd"><i class="f"></i>Agora · ' + pm[3].rotulo + ' e ' + pm[4].rotulo + '</span></div><ul class="db">' +
          tipos.map(x => { const d = x.b.taxa - x.a.taxa; return '<li><span class="nm">' + esc(x.t) + '</span><span class="tr"><i class="lk" style="left:' + Math.min(x.a.taxa, x.b.taxa) + '%;width:' + Math.abs(d) + '%"></i><i class="o" style="left:' + x.a.taxa + '%" title="' + x.a.n + ' lances"></i><i class="f" style="left:' + x.b.taxa + '%" title="' + x.b.n + ' lances"></i></span><b>' + x.b.taxa + '%</b><span class="dl ' + (d >= 0 ? 'up' : 'dn') + '">' + sinal(d) + '</span></li>'; }).join('') +
          '</ul><div class="eixo"><span>0%</span><span>50%</span><span>100%</span></div>') +
        card('Pontos fortes e prioridades', '<div class="fp2"><div><p class="k ia">Pontos fortes</p><ul class="lst fortes">' + D.FORTES.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul></div><div><p class="k am">Prioridades</p><ul class="lst prior">' + D.PRIORIDADES.map(t => '<li>' + esc(t.nome) + '</li>').join('') + '</ul></div></div>') +
        '</div><div class="col">' +
        card('Marcos', '<ol class="marcos">' + marcos.map(m => '<li><span class="mt">' + D.ddmm(m[0]) + '</span><div><p>' + esc(m[1]) + '</p><span>' + esc(m[2]) + '</span></div></li>').join('') + '</ol>') +
        card('Relatórios', '<ul class="docs">' + docs.map(d => '<li>' + ic('doc') + '<div><p>' + esc(d[0]) + '</p><span>' + D.ddmm(d[1]) + ' · ' + esc(d[2]) + '</span></div><a class="ib" href="#/evolucao" aria-label="Baixar">' + ic('baixar') + '</a></li>').join('') + '</ul>') +
        '</div></div>';
    },
    pos(el) {
      const l = el.querySelector('#c-linha');
      if (l) G.linha(l, D.porMes().map(m => ({ rotulo: m.rotulo, valor: m.taxa, n: m.n })), { fs: 14, pr: 76 });
      el.querySelectorAll('[data-spk]').forEach(s => G.spark(s, s.dataset.spk.split(',').map(Number)));
    }
  };

  /* ================= PLANO DE CARREIRA ================= */
  P.plano = {
    titulo: 'Plano de carreira',
    html() {
      const A = D.ATLETA, pr90 = D.porTipo(D.periodo('90').atual);
      const metas = D.PRIORIDADES.map(p => { const x = pr90.find(t => t.tipo === p.tipo); return { p, atual: x.taxa, n: x.n }; });
      const tarefas = [
        ['Chute de fora da área: 3 séries de 8', 'Seg, qua e sex', 'Treino'], ['Assistir: Finalização de média distância (12 min)', 'Até quarta', 'Aula'],
        ['Enviar o vídeo do jogo de sábado', 'Domingo', 'Vídeo'], ['Assinar a autorização para a avaliação presencial', 'Até ' + D.ddmm(D.somaDias(10)), 'Família'], ['Ligação com o estrategista esportivo', 'Segunda, 18:30', 'Equipe']
      ];
      const feitas = Object.values(E.plano.tarefas).filter(Boolean).length;
      const frentes = [
        ['Ser visto', 'Ativo', 'ok', [['Perfil aprovado', 1], ['Publicado na AGN Football', 1], [D.encTotal() + ' encaminhamentos desde ' + D.mes3(A.entrada), 1]], 100],
        ['Ser preparado', 'Em andamento', 'ia', [['Jogo lido a cada vídeo novo', 1], ['Metas do ciclo e treino com direção', 1], ['Aulas: ' + D.MODULOS.reduce((a, m) => a + m.feitas, 0) + ' de ' + D.MODULOS.reduce((a, m) => a + m.aulas, 0), 0]], 64],
        ['Ser apresentado', 'Próximos passos', 'on', [['Seletiva · ' + D.ddmm(D.SELETIVA) + ' · Goiânia (GO)', 0], ['Avaliação presencial · ' + D.ddmm(D.AVAL) + ' · São Paulo (SP)', 0], ['Logística planejada com a família', 0]], 18]
      ];
      const marcos = [
        [D.util(3), 'Ligação da semana', 'Estrategista esportivo · 18:30', 'tel'], [D.util(6), 'Relatório quinzenal', 'Analista de performance', 'doc'],
        [D.util(13), 'Assessoria individual', 'David Willer · 19:00', 'estrela'], [D.SELETIVA, 'Seletiva acompanhada', 'Goiânia (GO) · Sub-17', 'bola'], [D.AVAL, 'Avaliação presencial', 'Clube da Série A · São Paulo (SP)', 'pino']
      ];
      const equipe = [[D.EQUIPE[0], 'Estrategista de carreiras · todo dia'], [D.EQUIPE[1], 'Acompanhamento e logística · todo dia'], [D.EQUIPE[2], 'Próxima assessoria: ' + D.ddmm(D.util(13))], [D.EQUIPE[3], 'Próxima ligação: ' + D.ddmm(D.util(3))], [D.EQUIPE[4], 'Próximo relatório: ' + D.ddmm(D.util(6))]];
      const inclui = [
        ['perfil', 'Estrategista de carreiras', 'Todo dia', 'Último contato: hoje'], ['perfil', 'Gerente de carreira', 'Todo dia', 'Último contato: hoje'],
        ['estrela', 'David Willer', 'Assessoria individual · todo mês', 'Próxima: ' + D.ddmm(D.util(13))], ['tel', 'Estrategista esportivo', 'Toda semana', 'Próxima: ' + D.ddmm(D.util(3))],
        ['clube', 'Encaminhamentos', 'Pelo menos 15 por mês', D.encMes() + ' neste mês'], ['link', 'Conexão direta com clubes e AGN', 'Perfil publicado', 'Ativa desde ' + D.ddmm(D.somaDias(12, A.entrada))],
        ['bola', 'Seletivas acompanhadas', 'Logística planejada', '1 agendada: ' + D.ddmm(D.SELETIVA)], ['aulas', 'Sete módulos de aulas', 'Aulas e aulas extras', D.MODULOS.reduce((a, m) => a + m.feitas, 0) + ' de ' + D.MODULOS.reduce((a, m) => a + m.aulas, 0) + ' concluídas'],
        ['atletas', 'Turma de 10', 'Atenção máxima', 'Turma ' + D.cap(D.mes3(A.entrada)) + ' · ativa']
      ];
      return cabeca('Plano de carreira', 'Objetivo: jogar profissionalmente', chip(A.plano, 'on') + '<button type="button" class="btn">' + ic('baixar') + 'Baixar plano</button>') +
        '<section class="frentes">' + frentes.map(f => '<div class="card fr"><div class="fr-h"><h3>' + f[0] + '</h3>' + chip(f[1], f[2]) + '</div><ul class="chk">' + f[3].map(t => '<li class="' + (t[1] ? 'ok' : '') + '">' + ic(t[1] ? 'check' : 'circulo') + esc(t[0]) + '</li>').join('') + '</ul>' + barra(f[4], 100, f[2] === 'on' ? '' : f[2]) + '</div>').join('') + '</section>' +
        '<div class="g-plano"><div class="col">' +
        card('Metas do ciclo', '<ul class="metas">' + metas.map(m => '<li><div class="mh"><p>' + esc(m.p.nome) + '</p><span><b>' + m.atual + '%</b> de decisões boas · meta ' + m.p.meta + '%</span></div><span class="meta-b"><i style="width:' + Math.min(100, m.atual) + '%"></i><em style="left:' + m.p.meta + '%"></em></span><p class="ms">' + (m.p.meta - m.atual > 0 ? 'Faltam ' + (m.p.meta - m.atual) + ' pontos' : 'Meta atingida') + ' · ' + m.n + ' lances nos últimos 90 dias</p></li>').join('') + '</ul>') +
        card('Esta semana', '<ul class="tarefas">' + tarefas.map((t, j) => '<li class="' + (E.plano.tarefas[j] ? 'ok' : '') + '" data-tarefa="' + j + '"><span class="cb">' + ic('check') + '</span><div><p>' + esc(t[0]) + '</p><span>' + esc(t[1]) + '</span></div>' + chip(t[2], '') + '</li>').join('') + '</ul>', { acao: '<span class="k">' + feitas + ' de ' + tarefas.length + '</span>' }) +
        '</div><div class="col">' +
        card('Próximos passos', '<ol class="agl">' + marcos.map(m => '<li><span class="dt"><span>' + D.DIA3[m[0].getDay()] + '</span><b>' + D.ddmm(m[0]) + '</b></span><div><p>' + esc(m[1]) + '</p><span>' + esc(m[2]) + '</span></div>' + ic(m[3]) + '</li>').join('') + '</ol>') +
        card('Quem acompanha', '<ul class="time">' + equipe.map(e => '<li>' + av(e[0].ini, '', e[0].online ? 'onl' : '') + '<div><p>' + esc(e[0].nome) + '</p><span>' + esc(e[1]) + '</span></div><a class="ib" href="#/mensagens" aria-label="Mensagem">' + ic('chat') + '</a></li>').join('') + '</ul>') +
        '</div></div>' +
        card('O que o seu plano inclui', '<div class="inclui">' + inclui.map(t => '<div class="inc"><span class="ii">' + ic(t[0]) + '</span><div><p>' + esc(t[1]) + '</p><span>' + esc(t[2]) + '</span><em>' + esc(t[3]) + '</em></div></div>').join('') + '</div>', { acao: chip(A.plano, 'on') });
    },
    pos(el) { el.querySelectorAll('[data-spk]').forEach(s => G.spark(s, s.dataset.spk.split(',').map(Number))); }
  };
})(window);
