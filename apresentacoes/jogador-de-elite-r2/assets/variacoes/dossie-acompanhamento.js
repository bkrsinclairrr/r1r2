/* Relatório pronto: usa somente os valores salvos para este lead. Sem média, clube ou compatibilidade inventados. */
(function () {
  'use strict';
  const esc = v => String(v || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const indicadores = [['Ataque', 'Ataque'], ['Defesa', 'Defesa'], ['Chute', 'Chute'], ['Domínio', 'Dominio'],
    ['Marcação', 'Marcacao'], ['Finalização', 'Finalizacao'], ['Drible', 'Drible'], ['Passe', 'Passe'],
    ['Velocidade', 'Velocidade'], ['Leitura de jogo', 'Leitura']];
  const nota = v => v !== '' && v != null && /^\d{1,3}$/.test(String(v)) && Number(v) <= 100 ? Number(v) : null;
  const matches = f => [1, 2, 3].map(n => ({ clube: f['match' + n + 'Clube'], pais: f['match' + n + 'Pais'],
    liga: f['match' + n + 'Liga'], posicao: f['match' + n + 'Posicao'], categoria: f['match' + n + 'Categoria'],
    motivo: f['match' + n + 'Motivo'], compatibilidade: nota(f['match' + n + 'Compatibilidade']) })).filter(m => m.clube);
  const avatar = '<span class="zx-avatar"><img data-if="avatarOk" data-src="avatarUrl" alt="Foto do atleta"><b data-ifnot="avatarOk" data-bind="fotoIni"></b></span>';
  const percent = m => m.compatibilidade === null ? '' : '<strong class="zx-percent">' + m.compatibilidade + '%<small>compatibilidade</small></strong>';
  const clube = m => '<article class="zx-match"><div class="zx-clube-ini" aria-hidden="true">' + esc(String(m.clube).slice(0, 2).toUpperCase()) + '</div><div class="zx-match-text"><p class="zx-k">Perfil compatível</p><h3>' + esc(m.clube) + '</h3><p class="zx-muted">' + esc([m.pais, m.liga].filter(Boolean).join(' · ')) + '</p>'
    + '<div class="zx-tags">' + [m.posicao, m.categoria].filter(Boolean).map(t => '<span>' + esc(t) + '</span>').join('') + '</div>'
    + (m.motivo ? '<p class="zx-motivo">' + esc(m.motivo) + '</p>' : '') + '</div>' + percent(m) + '</article>';
  const falhas = new Set();
  window.R2_PERSONAL = {
    derivados(f, d, aid, painel) {
      // a foto do painel em todos os quadros (capa, perfil, relatório, oportunidades, oferta e Bem-vindo); fora da tela no painel, as iniciais.
      // Sem link (teste com a ficha gravada à mão), _foto.src e _foto.avatarSrc
      const foto = f._foto && f._foto.ok && f.semFoto !== 'sim' && f.nomeTela !== 'sem';
      const url = tipo => !foto ? '' : aid ? (Number(f._foto.versao) > 0 ? painel + '/api/foto?t=' + encodeURIComponent(aid) + '&v=' + tipo + '&n=' + Number(f._foto.versao) : '')
        : String((tipo === 'avatar' ? f._foto.avatarSrc || f._foto.src : f._foto.src) || '');
      const ret = url('retrato'), av = url('avatar');
      const geral = nota(f.zyronGeral);
      return { fotoUrl: falhas.has(ret) ? '' : ret, avatarUrl: falhas.has(av) ? '' : av,
        fotoOk: ret && !falhas.has(ret) ? '1' : '', avatarOk: av && !falhas.has(av) ? '1' : '', fotoIni: d.fotoIni || '',
        nomeCompleto: d.nomeCompleto || '', relatorioPronto: f.zyronResumo || f.zyronFoco || geral !== null || indicadores.some(([, id]) => nota(f['zyron' + id]) !== null) ? '1' : '',
        geralTxt: geral === null ? '' : String(geral), matchesOk: matches(f).length ? '1' : '', videoOk: '', posterOk: '', leituraOk: '', videoSrc: '', posterUrl: '' };
    },
    render(root, f, d) {
      const lista = matches(f);
      root.querySelectorAll('.zx-oportunidades').forEach(e => e.classList.toggle('zx-compacto', lista.length >= 2));
      const partes = {
        campo: () => {
          const pos = [['CA', 380, 78, 'CA'], ['ALE', 150, 210, 'PE'], ['MC', 380, 210, 'MEI'], ['ADD', 610, 210, 'PD'],
            ['VOL-e', 280, 320, 'VOL'], ['VOL-d', 480, 320, 'VOL'], ['LE', 100, 422, 'LE'], ['ZAG-e', 280, 422, 'ZAG'], ['ZAG-d', 480, 422, 'ZAG'], ['LD', 660, 422, 'LD'], ['GOL', 380, 515, 'GOL']];
          return '<svg viewBox="0 0 760 570" role="img" aria-label="Seu perfil em uma formação ilustrativa de quatro dois três um"><defs><pattern id="zx-grama" width="760" height="114" patternUnits="userSpaceOnUse"><rect width="760" height="57" fill="#0d3929"/><rect y="57" width="760" height="57" fill="#103e2d"/></pattern></defs><rect width="760" height="570" rx="12" fill="url(#zx-grama)"/><g fill="none" stroke="#b4cabb" stroke-width="2" opacity=".65"><rect x="25" y="20" width="710" height="535"/><path d="M25 285h710"/><circle cx="380" cy="285" r="69"/><path d="M235 20v100h290V20M300 20v48h160V20M235 555V455h290v100M300 555v-48h160v48"/></g>'
            + pos.map(([id, x, y, sigla]) => { const selecionado = id === d.posId; return '<g transform="translate(' + x + ' ' + y + ')">' + (selecionado ? '<circle r="46" fill="#e8ce75" opacity=".13"/><circle r="36" fill="#b39125" stroke="#ffe6a3" stroke-width="2"/>' : '<circle r="31" fill="#06241a" stroke="#547764"/>') + '<text text-anchor="middle" dominant-baseline="middle" font-family="Archivo,sans-serif" font-weight="700" font-size="24" fill="' + (selecionado ? '#fff0b5' : '#e7eee9') + '">' + sigla + '</text><text y="' + (y > 450 ? -52 : 68) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-weight="600" font-size="24" fill="#f2db8d">' + (selecionado ? esc(d.nomeCampo || d.nome || 'Você') : '') + '</text></g>'; }).join('') + '</svg>';
        },
        identidade: () => '<div class="zx-ident">' + avatar + '<div><p class="zx-k">Montado para você</p><h3 data-bind="nome" data-fb="Seu perfil"></h3><p class="zx-muted">' + esc([f.zyronCategoria, f.cidade, f.posicao].filter(Boolean).join(' · ')) + '</p></div>'
          + (d.geralTxt !== '' ? '<div class="zx-geral"><b>' + d.geralTxt + '</b><small>geral</small></div>' : '') + '</div>',
        perfil: () => '<h3>Seu perfil</h3><dl>' + [['Nome', f.nome], ['Idade', f.idade ? f.idade + ' anos' : ''], ['Posição', f.posicao], ['Categoria', f.zyronCategoria], ['Cidade', f.cidade], ['Altura', d.alturaTxt], ['Melhor pé', f.pe]]
          .filter(([, v]) => v).map(([k, v]) => '<div><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>').join('') + '</dl>',
        indicadores: () => {
          const validos = indicadores.filter(([, id]) => nota(f['zyron' + id]) !== null);
          return validos.length ? validos.map(([titulo, id]) => { const n = nota(f['zyron' + id]); return '<div class="zx-indicador"><div><span>' + titulo + '</span><strong>' + n + '</strong></div><span class="zx-bar"><i style="width:' + n + '%"></i></span></div>'; }).join('')
            : '<p class="zx-vazio">Os indicadores da leitura entram aqui depois de preparados. Nenhuma nota foi atribuída nesta apresentação.</p>';
        },
        destaque: () => lista.length ? clube(lista[0]) : '<div class="zx-vazio">O Zyron cruza posição, categoria e perfil de jogo com as características dos clubes. Os matches confirmados do seu relatório aparecem aqui.</div>',
        clubes: () => lista.length ? lista.map(clube).join('') : '<div class="zx-vazio">Os clubes compatíveis serão apresentados a partir do seu relatório. A equipe confirma o contexto de cada oportunidade antes de organizar o próximo passo.</div>'
      };
      root.querySelectorAll('[data-dossie]').forEach(e => { const fn = partes[e.dataset.dossie]; if (!fn) return;
        const chave = JSON.stringify(f) + '|' + e.dataset.dossie;
        if (e.dataset.dossieFeito !== chave) { e.innerHTML = fn(); e.dataset.dossieFeito = chave; }
      });
      root.querySelectorAll('img[data-src="fotoUrl"],img[data-src="avatarUrl"]').forEach(img => {
        if (img.dataset.erroLigado) return; img.dataset.erroLigado = '1';
        img.addEventListener('error', () => { falhas.add(img.getAttribute('src')); window.dispatchEvent(new Event('r2-rebind')); });
      });
    }
  };
  // O roteiro desta página acompanha o que está na tela, sem a demonstração ao vivo do modelo anterior.
  const r = window.ROTEIRO;
  r[3] = { ...r[3], fala: ['"[atleta], aqui estão dois jeitos de olhar pro seu jogo. Num, o que sobra é a memória de uma peneira. No outro, o seu perfil fica registrado, com direção de desenvolvimento e os clubes compatíveis."',
    'Leia os contrastes da tela e confirme o que a família já viveu.'], atencao: 'A coluna A resposta já está completa. Não anuncie leitura ao vivo nem deixe a coluna como suspense.' };
  r[9] = { ...r[9], nome: 'Seu perfil e encaixe em campo', fala: ['"[atleta], é o seu perfil e a sua posição. A formação é ilustrativa; o ponto é mostrar onde o seu perfil atua."',
    '"Clube não procura só um bom jogador: procura o perfil que faz sentido naquela função. Daqui a pouco eu mostro os matches que constam no seu relatório."'], atencao: 'Use somente indicadores preenchidos. Não diga que a formação representa uma vaga confirmada.' };
  r[12] = { nome: 'IA na prática: relatório preparado', min: 2, fala: ['"[atleta], este é o seu dossiê. A leitura foi preparada antes da nossa conversa, e o que está aqui veio do seu relatório."',
    'Explique os indicadores presentes, a leitura do perfil e a prioridade. Se um dado estiver vazio, não complete com exemplo de outro atleta.',
    '"O valor está em transformar o que a IA encontrou em um próximo passo pra você. Não é um relatório pra guardar: é uma direção pra trabalhar."'], perguntas: ['Você reconhece esses pontos no seu jogo?'], crm: [], atencao: 'Sem vídeo do atleta e sem cálculo ao vivo. Dados somente do relatório preenchido no painel.' };
  r[15] = { nome: 'Oportunidades do seu perfil', min: 2, fala: ['"[atleta], o seu perfil não precisa servir pra todo clube. Precisa encontrar os clubes onde ele faz sentido."',
    'Com matches preenchidos, explique o clube, a posição, a categoria e o motivo do encaixe. A compatibilidade é a do relatório, não chance de contratação.',
    '"Aqui começa a oportunidade: o match mostra onde olhar. A equipe confirma o cenário e orienta a preparação. No Legacy, também acompanha a apresentação e os encaminhamentos."'], perguntas: ['Consegue ver por que o seu perfil encaixa nesses contextos?'], crm: [], atencao: 'Match não é vaga, convocação ou contratação. Sem matches preenchidos, explique o processo e não cite um clube.' };
  r[16] = { ...r[16], fala: ['"Se vocês montassem por conta uma estrutura com essas sete frentes, esta simulação anual fecha em R$20 mil."',
    'Revele cada item e espere a família acompanhar a soma. A conta é uma comparação ilustrativa da estrutura, não orçamento de profissionais individuais.',
    '"Aqui a proposta é colocar IA e profissionais trabalhando juntos, dentro do escopo escolhido."'], atencao: 'Ancoragem única: R$20.000 por ano. Os sete itens somam esse total.' };
  // Elimina referências herdadas à execução da análise na reunião e à ancoragem anterior.
  const limpa = v => typeof v === 'string' ? v.replace(/30\.000/g, '20.000').replace(/leitura ao vivo/gi, 'relatório preparado')
    .replace(/resultado ao vivo/gi, 'relatório do atleta').replace(/ao vivo, aqui na nossa chamada/gi, 'no relatório preparado') :
    Array.isArray(v) ? v.map(limpa) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, limpa(x)])) : v;
  window.ROTEIRO = r.map(limpa);
  window.OBJECOES = (window.OBJECOES || []).map(o => {
    if (o.q === 'Vou ver outras opções') return { ...o, prev: 'O perfil em campo, o relatório preparado e os clubes compatíveis mostram o caminho pensado para o atleta.', resposta: [
      '"Compare como cada opção transforma o perfil do atleta em direção: dados, leitura individual, prioridade de desenvolvimento e acompanhamento no ritmo do plano."',
      '"O dossiê que vocês viram foi preparado para o [atleta]. Os matches mostram onde o perfil faz sentido e a equipe orienta o próximo passo."'] };
    if (o.q === 'Isso de inteligência artificial funciona mesmo?') return { ...o, prev: 'Use os indicadores, a leitura e os matches preenchidos no relatório do atleta.', resposta: [
      '"O relatório do [atleta] está aqui: os indicadores que vieram da leitura, os pontos fortes e a prioridade. O objetivo é transformar os dados em decisões de desenvolvimento."',
      'Mostre somente os dados presentes e explique o contexto dos clubes compatíveis. Não atribua a compatibilidade a uma vaga confirmada.' ] };
    return limpa(o);
  });
  window.CHECKLIST = ['Conferi o nome e sobrenome, se preenchido, e a foto opcional com autorização do responsável.', 'Preenchi o relatório já pronto, sem estimar notas ausentes.',
    'Preenchi somente os clubes compatíveis do relatório e o motivo do encaixe.', 'Conferi Scout PRO R$247,90 ou Legacy R$500 e o prazo efetivo da garantia.', 'Olhei a capa (Montado para, com a foto), o slide 02 e os dados do atleta nos slides 09, 12, 15 e 22.'];
})();
