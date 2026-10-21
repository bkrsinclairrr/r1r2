// O CL0 (20/10/2026): a variação do R2 anterior copiada da Técnica, com os ajustes que um closer pediu. Com o painel e o deck locais.
// Confere no navegador: o 27 com a faixa de R$ 5 a 30 mil por mês; o 28 e o 32 com "imediatamente" quando a ficha não tem o prazo; o 29 com o
// título novo, o texto do closer palavra por palavra, nenhum preço nos avanços 0 a 3, os três preços no 4 e a recomendação e a chamada no 5;
// o rodapé legal sempre na tela; o 30 sem a linha da garantia e com a mesma faixa; nenhuma garantia de devolução antes do 31; a regra dos 24
// px e do palco; o roteiro do apresentador e o checklist; e que a principal, a técnica e a acompanhamento seguem como eram.
// Uso: node testes/teste-cl0.mjs
import { sobe } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const { ok, fim } = verificador('CL0');
const s = await sobe({ deck: true, decks: ['r2-anterior'] });
const nav = await abreNavegador();
const NOMES = { legacy: 'Assessoria de Elite Legacy', pro: 'Assessoria PRO', scouting: 'Scout PRO' };
const seta = k => `document.dispatchEvent(new KeyboardEvent('keydown', { key: '${k}', bubbles: true, cancelable: true })); 1`;
const ativo = "[...document.querySelectorAll('#stage > .slide')].findIndex(s => s.classList.contains('active')) + 1";
const normal = t => String(t).replace(/\s+/g, ' ').trim();
// o texto do closer (apêndice 1 do plano), com o nome do David como a casa escreve
const COLUNAS = {
  scouting: ['Análise de vídeos com IA: identificação de pontos fortes e prioridades.', 'Avaliação e evolução: diagnóstico inicial, relatórios de performance e histórico do atleta.',
    'Analista de performance: acompanhamento por nosso scout para desenvolvimento do atleta.', 'Formação: acesso aos sete módulos de desenvolvimento.',
    'Preparação para peneiras: guia sobre os critérios observados pelos avaliadores.'],
  pro: ['Assessor de carreira: ligação semanal para orientar e acompanhar os próximos passos.', 'Desenvolvimento orientado: aplicação dos sete módulos à realidade do atleta.',
    'Oportunidades: pelo menos cinco encaminhamentos por mês para clubes no Brasil e no exterior.', 'Comunidade e aulas extras: troca com outros atletas e conteúdos complementares.'],
  legacy: ['Assessor de carreira: acompanhamento diário, com relatório e ligação semanal.', 'David Willer: encontro individual mensal e acompanhamento direto pelo WhatsApp.',
    'Plano de carreira personalizado: metas e próximos passos definidos para o atleta.', 'Mais oportunidades: pelo menos 15 encaminhamentos por mês, com apresentação do perfil a clubes da rede e à AGN.',
    'Suporte para seletivas: organização de vídeos, avaliações e planejamento da logística com a família.', 'Grupo limitado a dez atletas.']
};
const CABECALHOS = {
  scouting: ['Análise e formação para evoluir no futebol', 'Scout PRO', 'R$ 997 vitalício', '10x sem juros de R$ 99,70', ''],
  pro: ['Orientação semanal e acesso a oportunidades', 'Assessoria PRO', 'R$ 1.497 vitalício', '10x sem juros de R$ 149,70', 'Tudo do Scout PRO, mais:'],
  legacy: ['Acompanhamento diário e planejamento individual', 'Assessoria Elite Legacy', 'R$ 2.997 vitalício', '10x sem juros de R$ 299,70', 'Tudo da Assessoria PRO, com acompanhamento ampliado:']
};
// o que está de fato visível (opacidade e display de toda a cadeia)
const VIS = `(e => { for (let x = e; x && x !== document.body; x = x.parentElement) { const c = getComputedStyle(x); if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) < .05) return false; } return true; })`;
try {
  const admin = new Cliente(s.painel); await admin.entra(s.adminLogin, s.adminSenha);
  const versoes = (await admin.get('/api/versoes')).j.versoes;
  const v = versoes.find(x => x.id === 'r2a-cl0');
  ok(!!v && v.nome === 'CL0' && v.caminho === '/variacoes/cl0/' && v.validacao === 'nao-validada', 'o painel achou o CL0 sozinho no variacoes.json (r2a-cl0, 32 slides, não validada)');
  const leads = {};
  for (const [id, nome] of Object.entries(NOMES)) {
    const r = await admin.post('/api/atletas', { ficha: { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: nome, versao: 'r2a-cl0', gerente: 'Rafael', vagas: '4' } });
    ok(r.status === 201, id + ': lead do CL0 criado');
    leads[id] = r.j.t;
  }
  const base = s.decks['r2-anterior'] + '/variacoes/cl0/?a=';
  const a = await nav.aba(base + leads.legacy + '#27', { largura: 1920, altura: 1080 });
  ok(await a.ate(`document.querySelectorAll('#stage > .slide').length === 32 && window.VARIACAO_NOME === 'CL0' && ${ativo} === 27 && /Lucas/.test(document.body.textContent)`, 15000), 'a página abre com 32 slides e o nome CL0');
  const slide = n => `document.querySelectorAll('#stage > .slide')[${n - 1}]`;
  const t27 = normal(await a.avalia(`${slide(27)}.textContent`));
  ok(/fecha ganhando de R\$ 5 a 30 mil por mês/.test(t27) && !/por volta de|30 mil\+/.test(t27), 'o 27: "fecha ganhando de R$ 5 a 30 mil por mês" (sem "por volta de" nem o "+")');
  ok((await a.avalia(`getComputedStyle(${slide(27)}.querySelector('.t.sand-l')).textTransform`)) === 'uppercase', 'o 27 mostra a faixa em caixa alta');
  for (const [id, t] of Object.entries(leads)) {
    const b = id === 'legacy' ? a : await nav.aba(base + t + '#28', { largura: 1920, altura: 1080 });
    if (id === 'legacy') { await a.vai('about:blank'); await a.vai(base + t + '#28'); }
    await b.ate(`${ativo} === 28 && /Lucas/.test(document.body.textContent)`, 10000); await espera(1500);
    const t28 = normal(await b.avalia(`[...${slide(28)}.querySelectorAll('p')].filter(${VIS}).map(p => p.textContent).join(' ')`));
    ok(/o Zyron começa a (acompanhar o|ler o jogo do) Lucas Silva imediatamente\./.test(t28), id + ': o 28 termina com "imediatamente" sem prazo na ficha');
    if (id === 'legacy') {
      ok(/o assessor de carreira entra em contato/.test(t28) && !/gerente de carreira/.test(t28), 'legacy: o 28 fala do assessor de carreira (o termo do closer)');
      await b.vai('about:blank'); await b.vai(base + t + '#32');
      await b.ate(`${ativo} === 32 && /Lucas/.test(document.body.textContent)`, 10000); await espera(1500);
      const t32 = normal(await b.avalia(`[...${slide(32)}.querySelectorAll('p')].filter(${VIS}).map(p => p.textContent).join(' ')`));
      ok(/começando imediatamente/.test(t32) && /O assessor de carreira Rafael entra em contato/.test(t32), 'legacy: o 32 diz "começando imediatamente" e o assessor de carreira');
    } else await Promise.race([b.envia('Page.close').catch(() => {}), espera(400)]);
  }

  /* ---------- o 29, avanço por avanço ---------- */
  await a.vai('about:blank'); await a.vai(base + leads.legacy + '#28');
  await a.ate(`${ativo} === 28 && /Lucas/.test(document.body.textContent)`, 10000);
  await a.avalia(seta('ArrowRight'));
  ok(await a.ate(`${ativo} === 29`, 5000), 'do 28 a seta entra no 29');
  const titulo = normal(await a.avalia(`${slide(29)}.querySelector('.t').textContent`));
  ok(titulo === 'Vocês não estão mais sozinhos.' && (await a.avalia(`${slide(29)}.querySelector('.t .sand-l').textContent`)) === 'sozinhos', 'o título: "Vocês não estão mais sozinhos.", com o destaque em "sozinhos"');
  const precosVisiveis = `[...${slide(29)}.querySelectorAll('*')].filter(e => !e.children.length && /R\\$/.test(e.textContent) && ${VIS}(e)).length`;
  const legal = `(() => { const l = ${slide(29)}.querySelector('.cl0-legal'); return l && ${VIS}(l) && l.textContent; })()`;
  for (let k = 0; k <= 5; k++) {
    if (k) { await a.avalia(seta('ArrowRight')); await espera(600); } else await espera(600);
    const n = await a.avalia(precosVisiveis);
    if (k <= 3) ok(n === 0, 'avanço ' + k + ': nenhum "R$" na tela do 29 (' + n + ')');
    if (k === 4) ok(n === 6, 'avanço 4: os três preços e as três parcelas aparecem juntos (' + n + ' valores)');
    const rec = await a.avalia(`[...${slide(29)}.querySelectorAll('.pl-rec, .pl-ideal span, .cl0-chamada')].filter(${VIS}).map(e => e.textContent.replace(/\\s+/g, ' ').trim()).join(' | ')`);
    if (k < 5) ok(!rec, 'avanço ' + k + ': sem a recomendação e sem a chamada');
    else ok(/minha recomendação/i.test(rec) && /Escolha o acompanhamento para o seu atleta/.test(rec), 'avanço 5: a recomendação ("' + rec + '")');
    ok((await a.avalia(legal)) === 'Encaminhamentos representam oportunidades reais, sem garantia de aprovação ou contratação.', 'avanço ' + k + ': o rodapé legal na tela');
  }
  ok((await a.avalia(`${ativo}`)) === 29 && (await a.avalia(`(() => { const s = ${slide(29)}; return [...s.querySelectorAll('[data-step]')].filter(e => !e.closest('[data-if]:not(.on), [data-ifnot].off')).reduce((m, e) => Math.max(m, +e.dataset.step), 0); })()`)) === 5, 'o 29 tem 5 avanços');
  // o texto das colunas, palavra por palavra
  const col = await a.avalia(`(() => { const o = {}; ['scouting', 'pro', 'legacy'].forEach(id => { const c = ${slide(29)}.querySelector('.pl-col.' + id);
    o[id] = { hd: [c.querySelector('.pl-ds').textContent, c.querySelector('.pl-nm').textContent, c.querySelector('.pl-pr').textContent, c.querySelector('.pl-pc').textContent, c.querySelector('.pl-mais').textContent].map(t => t.replace(/\\s+/g, ' ').trim()),
      vant: [...c.querySelectorAll('.pl-vant p')].map(p => p.textContent.replace(/\\s+/g, ' ').trim()) }; }); return o; })()`);
  for (const id of ['scouting', 'pro', 'legacy']) {
    ok(JSON.stringify(col[id].vant) === JSON.stringify(COLUNAS[id]), id + ': a lista bate com o texto do closer' + (JSON.stringify(col[id].vant) === JSON.stringify(COLUNAS[id]) ? '' : ': ' + JSON.stringify(col[id].vant)));
    ok(JSON.stringify(col[id].hd) === JSON.stringify(CABECALHOS[id]), id + ': o cabeçalho (' + col[id].hd.filter(Boolean).join(' · ') + ')');
  }
  ok((await a.avalia(`[...${slide(29)}.querySelectorAll('.pl-col.pro .pl-nm, .pl-col.scouting .pl-nm')].every(e => getComputedStyle(e).textTransform === 'uppercase')`)), '"PRO" e os nomes em caixa alta');
  ok(!/Davi\b/.test(await a.avalia(`${slide(29)}.textContent`)), 'David Willer, como a casa escreve (e a mãe diz no áudio)');
  // a regra da casa no 29 todo revelado: 24 px ou mais, dentro do palco, colunas até 988 px
  const regra = n => `(() => { const st = document.querySelector('#stage').getBoundingClientRect(), k = st.width / 1920, s = ${slide(n)}; const ruins = [];
    const w = document.createTreeWalker(s, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const e = w.currentNode.parentElement; if (!w.currentNode.textContent.trim() || !${VIS}(e) || e.closest('.counter')) continue;
      const fs = parseFloat(getComputedStyle(e).fontSize); const r = e.getBoundingClientRect();
      if (fs < 24) ruins.push('fonte ' + fs + ': ' + w.currentNode.textContent.trim().slice(0, 30));
      if (r.left < st.left - 1 || r.right > st.right + 1 || r.top < st.top - 1 || r.bottom > st.bottom + 1) ruins.push('fora do palco: ' + w.currentNode.textContent.trim().slice(0, 30)); }
    return ruins; })()`;
  const r29 = await a.avalia(regra(29));
  ok(!r29.length, 'o 29: nada abaixo de 24 px nem fora do palco' + (r29.length ? ': ' + r29.slice(0, 4).join(' | ') : ''));
  const fundo = await a.avalia(`(() => { const st = document.querySelector('#stage').getBoundingClientRect(), k = st.height / 1080; return Math.max(...[...${slide(29)}.querySelectorAll('.pl-vant p')].map(p => (p.getBoundingClientRect().bottom - st.top) / k)); })()`);
  ok(fundo <= 988, 'a coluna mais comprida termina em ' + Math.round(fundo) + ' px (até 988)');
  const sobre = await a.avalia(`(() => { const s = ${slide(29)}, cs = [...s.querySelectorAll('.t, .cl0-chamada, .pl-ideal > p, .pl-hd, .cl0-legal')].filter(${VIS}).map(e => [e, e.getBoundingClientRect()]); const ruins = [];
    cs.forEach(([e, r], i) => cs.slice(i + 1).forEach(([f, q]) => { if (e.contains(f) || f.contains(e)) return; const x = Math.min(r.right, q.right) - Math.max(r.left, q.left), y = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top); if (x > 2 && y > 2) ruins.push((e.className || e.tagName) + ' x ' + (f.className || f.tagName)); })); return ruins; })()`);
  ok(!sobre.length, 'o 29: título, chamada, selo do Legacy, cabeçalhos e rodapé sem texto sobre texto' + (sobre.length ? ': ' + sobre.join(', ') : ''));

  /* ---------- o 30 e a garantia ---------- */
  for (const [id, t] of Object.entries(leads)) {
    await a.vai('about:blank'); await a.vai(base + t + '#30');
    await a.ate(`${ativo} === 30 && /Lucas/.test(document.body.textContent)`, 10000); await espera(1500);
    const t30 = normal(await a.avalia(`[...${slide(30)}.querySelectorAll('p')].filter(${VIS}).map(p => p.textContent).join(' ')`));
    ok(!/garantia|valor de volta/i.test(t30), id + ': o 30 não fala de garantia');
    if (id === 'legacy') ok(/Um atleta nosso fecha ganhando de R\$ 5 a 30 mil por mês/.test(t30) && !/em média|30 mil\+/.test(t30), 'legacy: o 30 com a mesma faixa do 27, sem "em média"');
    const esq = await a.avalia(`(() => { const st = document.querySelector('#stage').getBoundingClientRect(), k = st.height / 1080; const box = ${slide(30)}.querySelector('.a'); return Math.max(...[...box.querySelectorAll('*')].filter(${VIS}).map(e => (e.getBoundingClientRect().bottom - st.top) / k)); })()`);
    ok(esq <= 990, id + ': a coluna da esquerda do 30 termina em ' + Math.round(esq) + ' px, antes do rodapé legal (990)');
    const r30 = await a.avalia(regra(30));
    ok(!r30.length, id + ': o 30 sem texto abaixo de 24 px nem fora do palco' + (r30.length ? ': ' + r30.slice(0, 3).join(' | ') : ''));
  }
  // nenhuma garantia de devolução antes do 31 (o rodapé do 29 fala de encaminhamento, não de devolução)
  const antes31 = normal(await a.avalia(`[...document.querySelectorAll('#stage > .slide')].slice(0, 30).map(s => s.textContent).join(' ')`)).replace('sem garantia de aprovação ou contratação', '');
  ok(!/garantia/i.test(antes31), 'nenhum slide antes do 31 fala de garantia' + (/garantia/i.test(antes31) ? ' (achei: ' + antes31.match(/.{40}garantia.{40}/i)[0] + ')' : ''));
  ok(/Garantia/.test(await a.avalia(`${slide(31)}.textContent`)), 'o 31 é a garantia');
  for (const n of [27, 28, 31, 32]) {
    await a.vai('about:blank'); await a.vai(base + leads.legacy + '#' + n);
    await a.ate(`${ativo} === ${n} && /Lucas/.test(document.body.textContent)`, 10000); await espera(1500);
    const r = await a.avalia(regra(n));
    ok(!r.length, 'o ' + n + ': nada abaixo de 24 px nem fora do palco' + (r.length ? ': ' + r.slice(0, 3).join(' | ') : ''));
  }

  /* ---------- o apresentador ---------- */
  const R = await a.avalia(`(() => { const r = window.ROTEIRO; const p = n => r[n - 1] || {}; return {
    nomes: [27, 28, 29, 30, 31, 32].map(n => p(n).nome), interesse: p(27).fala.join(' '), planos: p(29).fala, atencao: p(29).atencao, inv: p(30).fala.join(' '),
    vaga: p(28).fala.join(' '), checklist: (window.CHECKLIST || []).join(' | ') }; })()`);
  ok(R.nomes.join(' | ') === 'Interesse alinhado | A vaga | Os planos | O investimento | Garantia incondicional | Bem-vindo', 'o roteiro do 27 ao 32 (' + R.nomes.join(', ') + ')');
  ok(!/\[faixa\]/.test(R.interesse) && /R\$ 5 a 30 mil por mês/.test(R.interesse) && /ofereceram 5 mil por mês/.test(R.interesse) && /slide 18/.test(R.interesse), 'Interesse alinhado: a faixa fixa e a ligação com o áudio da mãe (slide 18)');
  const iPreco = R.planos.findIndex(f => /R\$ 997/.test(f)), iAvanco4 = R.planos.findIndex(f => /quarto avanço/.test(f));
  ok(iPreco > 0 && iPreco === iAvanco4 && R.planos.slice(0, iPreco).every(f => !/R\$/.test(f)), 'Os planos: nada de dinheiro antes do quarto avanço');
  ok(R.planos.every(f => !/avanço \d/.test(f)) && /Quinto avanço/.test(R.planos.join(' ')), 'os avanços por extenso (o ordem-garantia.js troca número depois de "o ", até no fim de "avanço")');
  ok(/para de prestar atenção e começa a pensar no bolso/.test(R.atencao) && /06\/10\/2026/.test(R.atencao) && /o 31/.test(R.atencao), 'Os planos: o porquê do closer, a decisão de 06/10/2026 invertida só aqui e a garantia no 31');
  ok(!/garantia total/i.test(R.inv) && /o 31/.test(R.inv), 'O investimento: sem "garantia total" e apontando o 31');
  ok(/imediatamente/.test(R.vaga) && !/em seguida/.test(R.vaga), 'A vaga: "imediatamente"');
  ok(/CL0: conferi que a garantia só aparece no slide 31/.test(R.checklist), 'o checklist do CL0');

  /* ---------- as outras páginas seguem como eram ---------- */
  for (const [pid, caminho] of [['r2a-principal', '/'], ['r2a-tecnica', '/variacoes/tecnica/'], ['r2a-acompanhamento', '/variacoes/acompanhamento/']]) {
    const t = (await admin.post('/api/atletas', { ficha: { nome: 'Lucas Almeida da Silva', plano: 'Assessoria de Elite Legacy', versao: pid } })).j.t;
    await a.vai('about:blank'); await a.vai(s.decks['r2-anterior'] + caminho + '?a=' + t + '#27');
    await a.ate(`${ativo} === 27 && /Lucas/.test(document.body.textContent)`, 10000);
    const o = await a.avalia(`(() => { const ss = document.querySelectorAll('#stage > .slide'); return { n: ss.length, v: window.VARIACAO_NOME, t27: ss[26].textContent.replace(/\\s+/g, ' '), t29: (ss[28].querySelector('.t') || {}).textContent || '', cl0: !!document.querySelector('.cl0-planos, link[href*="cl0.css"]') }; })()`);
    ok(o.n === 32 && !o.cl0 && o.v !== 'CL0', pid + ': 32 slides e nada do CL0 na página');
    if (pid !== 'r2a-acompanhamento') ok(/por volta de/.test(o.t27) && /R\$ 20 a 30 mil\+/.test(o.t27) && (pid === 'r2a-principal' ? /Você não fica mais sozinho/ : /Vocês não operam mais sozinhos/).test(o.t29), pid + ': o 27 e o 29 de sempre');
  }
  const exc = a.console_.filter(m => /^EXC/.test(m));
  ok(!exc.length, 'nenhuma exceção de JavaScript' + (exc.length ? ': ' + exc.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha();
  await s.fecha();
}
fim();
