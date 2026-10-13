/* Relatório da leitura do atleta: um componente só, o mesmo arquivo no painel (prévia) e no deck R2 (slide 13).
   Cópia idêntica em jogador-de-elite-painel/relatorio-leitura.js e jogador-de-elite-r2/assets/relatorio-leitura.js:
   mudou um, copie no outro. Só desenha e conta o que a leitura guardou (lances marcados, pontos fortes, prioridades).
   Nada é estimado, sorteado ou gerado aqui. Sem nota geral, ranking, percentil ou comparação com outros atletas.
   Todo texto que vem do painel entra escapado. As cores ficam no CSS de quem usa (classes rl-*). */
(function (raiz) {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const mmss = t => { const s = Math.max(0, Math.floor(Number(t) || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const LEITURA = { bom: 'bom', ajustar: 'a melhorar' };

  // a leitura como veio do painel, conferida de novo (o deck não confia em nada que não passou por aqui)
  function confere(leitura, duracaoS) {
    const l = leitura && typeof leitura === 'object' ? leitura : {};
    const dur = Number(duracaoS) > 0 ? Number(duracaoS) : 0;
    const lances = (Array.isArray(l.lances) ? l.lances : [])
      .filter(x => x && Number.isFinite(Number(x.t)) && Number(x.t) >= 0 && (!dur || Number(x.t) <= dur + 1) && typeof x.tipo === 'string' && (x.leitura === 'bom' || x.leitura === 'ajustar'))
      .map(x => ({ t: Number(x.t), tipo: x.tipo, leitura: x.leitura, nota: typeof x.nota === 'string' ? x.nota : '' }))
      .sort((a, b) => a.t - b.t);
    const lista = v => (Array.isArray(v) ? v : []).filter(x => typeof x === 'string' && x.trim()).slice(0, 3);
    return {
      origem: l.origem === 'zyron' || l.origem === 'equipe' ? l.origem : '',
      criterio: l.criterio === 'todos' ? 'todos' : 'selecao',
      lances, fortes: lista(l.fortes), prioridades: lista(l.prioridades)
    };
  }

  // as contas: só sobre os lances marcados
  function derivados(leitura, duracaoS, trabalhar) {
    const l = confere(leitura, duracaoS);
    const n = l.lances.length, bons = l.lances.filter(x => x.leitura === 'bom').length;
    // a lista curta da tela: até 4, os que têm nota primeiro, na ordem do vídeo; o resto fica no apresentador
    const comNota = l.lances.filter(x => x.nota), semNota = l.lances.filter(x => !x.nota);
    const curtos = comNota.concat(semNota).slice(0, 4).sort((a, b) => a.t - b.t);
    const foco = String(trabalhar || '').trim() || l.prioridades[0] || '';
    return {
      leitura: l, n, bons, ajustar: n - bons,
      rosca: n >= 5, pct: n >= 10 ? Math.round((bons / n) * 100) : null,
      curtos, foco,
      fonte: l.origem === 'zyron' ? 'Leitura do Zyron.' : l.origem === 'equipe' ? 'Leitura da equipe.' : '',
      criterio: l.criterio === 'todos' ? 'Lances marcados neste vídeo: todos os lances em que o atleta participa.' : 'Lances marcados neste vídeo: uma seleção de lances do vídeo.'
    };
  }

  // a rosca: verde-oliva o que foi bom, areia o que é pra melhorar; no meio, "X de N" (a porcentagem só com 10 ou mais)
  function rosca(d) {
    if (!d.rosca) return '';
    const r = 80, c = 2 * Math.PI * r, bom = c * (d.bons / d.n);
    return '<div class="rl-rosca"><svg viewBox="0 0 200 200" aria-hidden="true">' +
      '<circle class="rl-r-fundo" cx="100" cy="100" r="' + r + '" fill="none" stroke-width="22"/>' +
      '<circle class="rl-r-ajustar" cx="100" cy="100" r="' + r + '" fill="none" stroke-width="22" stroke-dasharray="' + c.toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 100 100)"/>' +
      (d.bons ? '<circle class="rl-r-bom" cx="100" cy="100" r="' + r + '" fill="none" stroke-width="22" stroke-dasharray="' + bom.toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 100 100)"/>' : '') +
      '</svg><div class="rl-r-meio"><p class="rl-r-n">' + d.bons + ' <span>de ' + d.n + '</span></p>' + (d.pct != null ? '<p class="rl-r-pct">' + d.pct + '%</p>' : '') + '</div></div>' +
      '<p class="rl-r-leg">decisões boas</p>';
  }
  const listaHtml = (titulo, itens, cls) => itens.length
    ? '<div class="rl-bloco ' + cls + '"><p class="rl-k">' + esc(titulo) + '</p><ul class="rl-lista">' + itens.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>' : '';
  const fortes = d => listaHtml('Pontos fortes', d.leitura.fortes, 'rl-fortes');
  const prioridades = d => listaHtml('Prioridades', d.leitura.prioridades, 'rl-prior');
  const foco = d => d.foco ? '<div class="rl-bloco rl-foco"><p class="rl-k">Primeiro foco</p><p class="rl-v">' + esc(d.foco) + '</p></div>' : '';

  // a linha do tempo: um marcador por lance, na posição do minuto; bom cheio, a melhorar vazado
  function linha(d, duracaoS) {
    const dur = Number(duracaoS) > 0 ? Number(duracaoS) : (d.leitura.lances.length ? d.leitura.lances[d.leitura.lances.length - 1].t + 1 : 1);
    // com muitos lances, marcadores menores (a linha continua inteira, sem esconder nenhum)
    return '<div class="rl-linha' + (d.n > 24 ? ' denso' : '') + '"><div class="rl-trilho"></div>' + d.leitura.lances.map(x =>
      '<button type="button" class="rl-m ' + (x.leitura === 'bom' ? 'bom' : 'ajustar') + '" data-t="' + x.t + '" style="left:' + Math.min(100, (x.t / dur) * 100).toFixed(2) + '%" title="' + esc(mmss(x.t) + ' · ' + x.tipo + ' · ' + LEITURA[x.leitura]) + '" tabindex="-1"></button>').join('') +
      '<p class="rl-t0">0:00</p><p class="rl-t1">' + mmss(dur) + '</p></div>';
  }
  // a lista curta (até 4) e a lista inteira, que vira capítulo no apresentador
  const linhaLance = x => '<span class="tm">' + mmss(x.t) + '</span><span class="ct">' + esc(x.tipo) + ' · ' + LEITURA[x.leitura] + (x.nota ? ': ' + esc(x.nota) : '') + '</span>';
  const curtos = d => d.curtos.map(x => '<li class="' + (x.leitura === 'bom' ? 'bom' : 'ajustar') + '" data-t="' + x.t + '"><i></i><span class="tm">' + mmss(x.t) + '</span><span class="tp">' + esc(x.tipo) + '</span><span class="lt">' + LEITURA[x.leitura] + '</span></li>').join('');
  // nos capítulos o vídeo pula 2 s antes do lance, pra dar contexto
  const capitulos = d => d.leitura.lances.map(x => '<li data-t="' + Math.max(0, x.t - 2) + '" data-lance="' + x.t + '">' + linhaLance(x) + '</li>').join('');
  // o lance que está passando no vídeo (até 4 s depois do minuto marcado), pra chamada sobre o vídeo
  const lanceEm = (d, t) => { let a = null; d.leitura.lances.forEach(x => { if (t >= x.t - .3 && t <= x.t + 4) a = x; }); return a; };

  raiz.RelatorioLeitura = { esc, mmss, LEITURA, confere, derivados, rosca, fortes, prioridades, foco, linha, curtos, capitulos, lanceEm };
})(typeof window !== 'undefined' ? window : globalThis);
