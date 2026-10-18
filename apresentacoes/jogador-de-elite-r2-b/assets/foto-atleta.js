/* A foto autorizada aparece em um único momento: o slide de escolha do atleta. */
(function () {
  'use strict';
  const falhas = new Set();
  let ultimo;
  window.FotoAtleta = {
    derivados(f, d, aid, painel) {
      const ft = f.semFoto !== 'sim' && f.nomeTela !== 'sem' && f._foto && f._foto.ok ? f._foto : null;
      const versao = ft ? Number(ft.versao) : 0;
      const url = ft ? (aid && versao > 0 ? painel + '/api/foto?t=' + encodeURIComponent(aid) + '&v=retrato&n=' + versao : !aid ? String(ft.src || '') : '') : '';
      const nome = String(d.nome || '');
      return { selecaoFotoUrl: falhas.has(url) ? '' : url, selecaoFotoOk: url && !falhas.has(url) ? '1' : '',
        selecaoInicial: (nome || 'JE').slice(0, nome ? 1 : 2).toUpperCase(),
        selecaoPerfil: [f.posicao, f.idade ? f.idade + ' anos' : '', f.cidade].filter(Boolean).join(' · '),
        selecaoContexto: f.caracteristicas || f.experiencia || '',
        selecaoCodigo: aid ? aid.slice(-6).toUpperCase() : '',
        // Os demais slides preservam seus nomes, iniciais e desenhos, sem repetir a imagem.
        fotoUrl: '', avatarUrl: '', fotoOk: '', avatarOk: '' };
    },
    atualiza(root, d) {
      ultimo = d;
      root.querySelectorAll('.escolha-atleta').forEach(e => e.classList.toggle('com-contexto', !!d.selecaoContexto));
      root.querySelectorAll('img[data-src="selecaoFotoUrl"]').forEach(img => {
        const url = d.selecaoFotoUrl || '';
        if ((img.getAttribute('src') || '') !== url) { if (url) img.setAttribute('src', url); else img.removeAttribute('src'); }
        if (img.dataset.fotoErro) return; img.dataset.fotoErro = '1';
        img.addEventListener('error', () => { falhas.add(img.getAttribute('src')); window.dispatchEvent(new Event('je-foto-atleta')); });
      });
      root.querySelectorAll('.escolha-nome').forEach(e => {
        e.style.fontSize = d.selecaoContexto ? '96px' : '106px';
        for (let i = 0; e.scrollWidth > 940 && i < 30; i++) e.style.fontSize = (parseFloat(e.style.fontSize) * .94) + 'px';
      });
      // O titulo da formacao nunca cobre a grade, com o slide parado ou ativo (a navegacao troca a classe sem disparar hashchange, entao nao da pra esperar o .active):
      // primeiro tenta tres linhas (.fa-3 desce a grade e encolhe o cartao do 7); so se ainda nao couber o titulo diminui.
      root.querySelectorAll('.formacao-atleta').forEach(s => {
        const h = s.querySelector('.formacao-intro h2'), grid = s.querySelector('.formacao-grid');
        if (!h || !grid) return;
        h.style.fontSize = ''; s.classList.remove('fa-3');
        const folga = () => grid.getBoundingClientRect().top - h.getBoundingClientRect().bottom;
        if (folga() < 15) s.classList.add('fa-3');
        for (let i = 0; folga() < 15 && i < 20; i++) h.style.fontSize = (parseFloat(getComputedStyle(h).fontSize) * .94) + 'px';
      });
    }
  };
  window.addEventListener('hashchange', () => requestAnimationFrame(() => { if (ultimo) window.FotoAtleta.atualiza(document, ultimo); }));
  if (document.fonts) document.fonts.ready.then(() => { if (ultimo) window.FotoAtleta.atualiza(document, ultimo); });
  // A fala do slide acompanha a imagem e os dados opcionais, sem inventar avaliação.
  if (window.ROTEIRO && window.ROTEIRO[1]) window.ROTEIRO[1] = { ...window.ROTEIRO[1], nome: 'Por que você: seu perfil, seu próximo passo', fala: [
    '"[atleta], você foi escolhido para esta conversa. Esta apresentação foi preparada para o seu perfil e para o próximo passo que você busca no futebol."',
    'Mostre o nome e, se houver, a foto do jogador. Use o contexto preenchido no painel para explicar o que chamou atenção. Campo vazio não é uma conclusão sobre o atleta.',
    '"O objetivo é transformar a leitura do seu jogo em direção: entender o ponto de partida, trabalhar a evolução e escolher os próximos passos."'],
    atencao: 'A foto é opcional e aparece somente neste slide. Dados e contexto vazios permanecem vazios. Escolha para a conversa não é promessa de vaga ou contratação.' };
  const formacao = document.querySelector('#stage > .formacao-atleta');
  if (formacao && window.ROTEIRO) {
    const indice = [...document.querySelectorAll('#stage > .slide')].indexOf(formacao);
    window.ROTEIRO[indice] = { ...window.ROTEIRO[indice], nome: 'Scout PRO: sete módulos para evoluir', fala: [
      '"[atleta], entender o seu jogo é o começo. Evoluir também pede formação: saber o que trabalhar, aplicar na rotina e acompanhar o que mudou."',
      '"O Scout PRO reúne a leitura do Zyron, o relatório do analista a cada 15 dias e os sete módulos de formação. Performance, psicologia, nutrição, comportamento e imagem fazem parte dessa trilha."',
      '"Na Assessoria PRO e no Legacy, o acompanhamento humano acrescenta orientação no ritmo de cada plano. Os módulos já fazem parte do Scout PRO."'],
      atencao: 'Sete módulos incluídos no Scout PRO. Orientação humana e encaminhamentos seguem os planos. Não prometa resultado esportivo ou contratação.' };
  }
})();
