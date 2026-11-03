// O CL0 (20/10/2026): a variação do R2 anterior copiada da Técnica, com os ajustes que um closer pediu. Com o painel e o deck locais.
// Rodada de 30/10/2026: o CL0 ficou com 22 slides. Confere no navegador: os dez slides que saíram e a ordem (o campo logo depois de "Zyron, o
// olheiro que não pisca"); a lista de profissionais do 18 com os valores novos e a soma de R$ 30.000; a faixa de R$ 5 a 30 mil por mês no 20; os
// três planos do 21 como Assessoria Start, Pro e Elite (o segundo nome em dourado), o texto das colunas palavra por palavra, os avanços (1 a 3
// as colunas sem preço, 4 a 6 o preço de um plano por vez, em 12x sem juros, e 7 a recomendação e a chamada), o rodapé legal sempre na tela; a
// garantia como último slide e só nele; a regra dos 24 px e do palco; o roteiro e o apresentador (sem o slide do investimento e sem o Bem-vindo);
// e que a principal, a técnica e a acompanhamento seguem como eram.
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
const TOTAL = 22, VALOR = 18, INTERESSE = 20, PLANOS = 21, GARANTIA = 22, DOSSIE = 12;
// o texto do closer (rodada de 30/10/2026), com o nome do David como a casa escreve
const COLUNAS = {
  scouting: ['Análise de vídeos com IA: identificação de pontos fortes e prioridades.', 'Avaliação e evolução: diagnóstico inicial, relatórios de performance e histórico do atleta.',
    'Analista de performance: acompanhamento por nosso scout para desenvolvimento do atleta.', 'Formação: acesso aos sete módulos de desenvolvimento.',
    'Preparação para peneiras: guia sobre os critérios observados pelos avaliadores.'],
  pro: ['Assessor de carreira: ligação semanal para orientar e acompanhar os próximos passos.', 'Desenvolvimento orientado: aplicação dos sete módulos à realidade do atleta.',
    'Oportunidades: pelo menos 5 oportunidades direcionadas por trimestre conforme planejamento de carreira do atleta.', 'Comunidade e aulas extras: troca com outros atletas e conteúdos complementares.'],
  legacy: ['Assessor de carreira: acompanhamento diário, com relatório e ligação semanal.', 'David Willer: encontro individual mensal e acompanhamento direto pelo WhatsApp.',
    'Plano de carreira personalizado: metas e próximos passos definidos para o atleta.',
    'Mais oportunidades: pelo menos 10 oportunidades direcionadas por trimestre conforme planejamento de carreira do atleta.',
    'Suporte para seletivas: organização de vídeos, avaliações e planejamento da logística com a família.', 'Grupo limitado a dez atletas.']
};
const CABECALHOS = {
  scouting: ['Análise e formação para evoluir no futebol', 'Assessoria Start', 'R$ 997 vitalício', '12x sem juros de R$ 83,08', ''],
  pro: ['Orientação semanal e acesso a oportunidades', 'Assessoria Pro', 'R$ 1.497 vitalício', '12x sem juros de R$ 124,75', 'Tudo da Assessoria Start, mais:'],
  legacy: ['Acompanhamento diário e planejamento individual', 'Assessoria Elite', 'R$ 2.997 vitalício', '12x sem juros de R$ 249,75', 'Tudo da Assessoria Pro, com acompanhamento ampliado:']
};
const PROFISSIONAIS = [['Personal Soccer (treinador físico)', 'R$ 7.200'], ['Analista Esportivo + Inteligência artificial', 'R$ 5.000'], ['Psicólogo(a) esportivo', 'R$ 3.600'],
  ['Nutricionista', 'R$ 3.600'], ['Imagem e Posicionamento (redes sociais)', 'R$ 3.600'], ['Assessor de Carreira Esportiva', 'R$ 7.000']];
const SAIRAM = [1, 5, 103, 13, 108, 14, 18, 22, 24, 25];
// o que está de fato visível (opacidade e display de toda a cadeia)
const VIS = `(e => { for (let x = e; x && x !== document.body; x = x.parentElement) { const c = getComputedStyle(x); if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) < .05) return false; } return true; })`;
try {
  const admin = new Cliente(s.painel); await admin.entra(s.adminLogin, s.adminSenha);
  const versoes = (await admin.get('/api/versoes')).j.versoes;
  const v = versoes.find(x => x.id === 'r2a-cl0');
  ok(!!v && v.nome === 'CL0' && v.caminho === '/variacoes/cl0/' && v.validacao === 'nao-validada', 'o painel achou o CL0 sozinho no variacoes.json (r2a-cl0, não validada)');
  ok(/22 slides/.test(v.resumo || ''), 'o resumo do painel diz 22 slides (' + (v.resumo || '').slice(0, 60) + ')');
  const leads = {};
  for (const [id, nome] of Object.entries(NOMES)) {
    const r = await admin.post('/api/atletas', { ficha: { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: nome, versao: 'r2a-cl0', gerente: 'Rafael', vagas: '4' } });
    ok(r.status === 201, id + ': lead do CL0 criado');
    leads[id] = r.j.t;
  }
  const base = s.decks['r2-anterior'] + '/variacoes/cl0/?a=';
  const a = await nav.aba(base + leads.legacy + '#' + INTERESSE, { largura: 1920, altura: 1080 });
  ok(await a.ate(`document.querySelectorAll('#stage > .slide').length === ${TOTAL} && window.VARIACAO_NOME === 'CL0' && ${ativo} === ${INTERESSE} && /Lucas/.test(document.body.textContent)`, 15000), 'a página abre com ' + TOTAL + ' slides e o nome CL0');
  const slide = n => `document.querySelectorAll('#stage > .slide')[${n - 1}]`;

  /* ---------- o que saiu e a ordem ---------- */
  const origens = await a.avalia(`[...document.querySelectorAll('#stage > .slide')].map(s => Number(s.dataset.slideOrigem))`);
  ok(SAIRAM.every(o => !origens.includes(o)), 'os dez slides pedidos saíram (nenhuma origem ' + SAIRAM.join(', ') + ' na página)');
  ok(origens.join() === '2,4,6,7,102,8,9,101,10,11,12,107,15,16,104,105,106,17,19,20,23,21', 'a sequência: o campo (102) logo depois do "olheiro que não pisca" (7) (' + origens.join(',') + ')');
  const t4 = normal(await a.avalia(`${slide(4)}.textContent`)), t5 = normal(await a.avalia(`${slide(5)}.textContent`));
  ok(/Zyron/.test(t4) && /O olheiro que não pisca/.test(t4), 'o 4 é o "Zyron, o olheiro que não pisca"');
  ok(/segue a bola/.test(t5) && /vê os 22/.test(t5), 'o 5 é "A observação segue a bola. A IA vê os 22."');
  const tudo = normal(await a.avalia(`[...document.querySelectorAll('#stage > .slide')].map(s => s.textContent).join(' ')`));
  ok(!/Quem banca a operação|Bem-vindo,|inimigo em comum|Quem já esteve aí/i.test(tudo) || /A decisão/.test(tudo), 'nada dos slides removidos sobrou no texto (Até lá, Bem-vindo, inimigo em comum, depoimento da mãe, A decisão)');
  ok(await a.avalia(`${slide(DOSSIE)}.classList.contains('ds-slide')`), 'o dossiê do atleta é o ' + DOSSIE);
  ok((await a.avalia('window.ROTEIRO[12].nome')) === 'Assessoria Start: sete módulos para evoluir' && /Assessoria Start/.test(await a.avalia('window.ROTEIRO[12].fala.join(" ")')) && !/Scout PRO/.test(await a.avalia('JSON.stringify(window.ROTEIRO[12])')), 'o slide 13 (formação) tem o nome certo no apresentador e na visão geral, sem Scout PRO');
  const css = await a.avalia("(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g', bubbles: true })); return 1; })()"); // a visão geral: a miniatura do 13 sem o espaçamento de letras do título dela
  ok(await a.ate("document.querySelector('#overview.on .ov-item:nth-child(13) .th h2')", 6000) && (await a.avalia("getComputedStyle(document.querySelector('#overview.on .ov-item:nth-child(13) .th h2')).letterSpacing")) === 'normal', 'a miniatura do slide 13 na visão geral não herda o espaçamento de letras do título da visão geral');
  await a.avalia("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); 1");
  ok(!/Scout PRO|Legacy|Assessoria PRO/.test(normal(await a.avalia(`[...document.querySelectorAll('#stage > .slide')].map(s => s.innerText).join(' ')`))), 'nenhum slide fala em Scout PRO, Legacy ou Assessoria PRO (é Start, Pro e Elite)');

  /* ---------- o 18: a lista de profissionais e a soma ---------- */
  await a.vai('about:blank'); await a.vai(base + leads.legacy + '#' + VALOR);
  await a.ate(`${ativo} === ${VALOR} && /Lucas/.test(document.body.textContent)`, 10000); await espera(1200);
  const linhas = await a.avalia(`[...${slide(VALOR)}.querySelectorAll('.costs p')].map(p => [p.querySelector('span').textContent.trim(), p.querySelector('b').textContent.replace(/\\/ano/, '').trim()])`);
  ok(JSON.stringify(linhas) === JSON.stringify(PROFISSIONAIS), 'a lista de profissionais com os valores novos (' + linhas.map(l => l.join(' ')).join(' | ') + ')');
  ok(await a.ate(`${slide(VALOR)}.querySelector('[data-soma]').textContent.trim() === 'R$ 30.000'`, 6000), 'a soma termina em R$ 30.000');
  ok(/as seis falarem/.test(normal(await a.avalia(`${slide(VALOR)}.textContent`))) && !/Comportamento/.test(normal(await a.avalia(`${slide(VALOR)}.textContent`))), 'o texto diz "as seis" e não tem a frente Comportamento');

  /* ---------- o 20: a faixa e as falas ---------- */
  await a.vai('about:blank'); await a.vai(base + leads.legacy + '#' + INTERESSE);
  await a.ate(`${ativo} === ${INTERESSE} && /Lucas/.test(document.body.textContent)`, 10000);
  const t20 = normal(await a.avalia(`${slide(INTERESSE)}.textContent`));
  ok(/fecha ganhando de R\$ 5 a 30 mil por mês/.test(t20) && !/por volta de|30 mil\+/.test(t20), 'o 20: "fecha ganhando de R$ 5 a 30 mil por mês" (sem "por volta de" nem o "+")');
  ok((await a.avalia(`getComputedStyle(${slide(INTERESSE)}.querySelector('.t.sand-l')).textTransform`)) === 'uppercase', 'o 20 mostra a faixa em caixa alta');

  /* ---------- o 21, avanço por avanço ---------- */
  await a.vai('about:blank'); await a.vai(base + leads.legacy + '#' + (PLANOS - 1));
  await a.ate(`${ativo} === ${PLANOS - 1} && /Lucas/.test(document.body.textContent)`, 10000);
  await a.avalia(seta('ArrowRight'));
  ok(await a.ate(`${ativo} === ${PLANOS}`, 5000), 'a seta entra nos planos (' + PLANOS + ')');
  const titulo = normal(await a.avalia(`${slide(PLANOS)}.querySelector('.t').textContent`));
  ok(titulo === 'Vocês não estão mais sozinhos.' && (await a.avalia(`${slide(PLANOS)}.querySelector('.t .sand-l').textContent`)) === 'sozinhos', 'o título: "Vocês não estão mais sozinhos.", com o destaque em "sozinhos"');
  const precosVisiveis = `[...${slide(PLANOS)}.querySelectorAll('*')].filter(e => !e.children.length && /R\\$/.test(e.textContent) && ${VIS}(e)).length`;
  const legal = `(() => { const l = ${slide(PLANOS)}.querySelector('.cl0-legal'); return l && ${VIS}(l) && l.textContent; })()`;
  const ESPERADO = [0, 0, 0, 0, 2, 4, 6, 6]; // valores "R$" visíveis por avanço: 2 por plano (o preço e a parcela), um plano por vez
  for (let k = 0; k <= 7; k++) {
    if (k) { await a.avalia(seta('ArrowRight')); await espera(600); } else await espera(600);
    const n = await a.avalia(precosVisiveis);
    ok(n === ESPERADO[k], 'avanço ' + k + ': ' + ESPERADO[k] + ' valores em R$ na tela do 21 (' + n + ')');
    const rec = await a.avalia(`[...${slide(PLANOS)}.querySelectorAll('.pl-rec, .pl-ideal span, .cl0-chamada')].filter(${VIS}).map(e => e.textContent.replace(/\\s+/g, ' ').trim()).join(' | ')`);
    if (k < 7) ok(!rec, 'avanço ' + k + ': sem a recomendação e sem a chamada');
    else ok(/minha recomendação/i.test(rec) && /Escolha o acompanhamento para o seu atleta/.test(rec), 'avanço 7: a recomendação ("' + rec + '")');
    ok((await a.avalia(legal)) === 'Encaminhamentos representam oportunidades reais, sem garantia de aprovação ou contratação.', 'avanço ' + k + ': o rodapé legal na tela');
    if (k >= 4 && k <= 6) {
      const quem = ['scouting', 'pro', 'legacy'][k - 4];
      const visivel = await a.avalia(`['scouting', 'pro', 'legacy'].filter(id => ${VIS}(${slide(PLANOS)}.querySelector('.pl-col.' + id + ' .pl-pr'))).join()`);
      ok(visivel === ['scouting', 'pro', 'legacy'].slice(0, k - 3).join(), 'avanço ' + k + ': o preço de ' + quem + ' entra agora, um por vez (' + visivel + ')');
    }
  }
  ok((await a.avalia(`${ativo}`)) === PLANOS && (await a.avalia(`(() => { const s = ${slide(PLANOS)}; return [...s.querySelectorAll('[data-step]')].filter(e => !e.closest('[data-if]:not(.on), [data-ifnot].off')).reduce((m, e) => Math.max(m, +e.dataset.step), 0); })()`)) === 7, 'o 21 tem 7 avanços');
  const col = await a.avalia(`(() => { const o = {}; ['scouting', 'pro', 'legacy'].forEach(id => { const c = ${slide(PLANOS)}.querySelector('.pl-col.' + id);
    o[id] = { hd: [c.querySelector('.pl-ds').textContent, c.querySelector('.pl-nm').textContent, c.querySelector('.pl-pr').textContent, c.querySelector('.pl-pc').textContent, c.querySelector('.pl-mais').textContent].map(t => t.replace(/\\s+/g, ' ').trim()),
      vant: [...c.querySelectorAll('.pl-vant p')].map(p => p.textContent.replace(/\\s+/g, ' ').trim()),
      dourado: [...c.querySelectorAll('.pl-nm .pl-ou')].map(e => e.textContent), cor: getComputedStyle(c.querySelector('.pl-nm .pl-ou')).color, branco: getComputedStyle(c.querySelector('.pl-nm .pl-br')).color }; }); return o; })()`);
  for (const id of ['scouting', 'pro', 'legacy']) {
    ok(JSON.stringify(col[id].vant) === JSON.stringify(COLUNAS[id]), id + ': a lista bate com o texto do closer' + (JSON.stringify(col[id].vant) === JSON.stringify(COLUNAS[id]) ? '' : ': ' + JSON.stringify(col[id].vant)));
    ok(JSON.stringify(col[id].hd) === JSON.stringify(CABECALHOS[id]), id + ': o cabeçalho (' + col[id].hd.filter(Boolean).join(' · ') + ')');
    ok(col[id].dourado.length === 1 && col[id].dourado[0] === CABECALHOS[id][1].split(' ')[1] && col[id].cor !== col[id].branco, id + ': o segundo nome do plano em dourado (' + col[id].dourado.join() + ')');
  }
  ok((await a.avalia(`[...${slide(PLANOS)}.querySelectorAll('.pl-col .pl-nm')].every(e => getComputedStyle(e).textTransform === 'uppercase')`)), 'os nomes dos planos em caixa alta');
  ok(!/Davi\b/.test(await a.avalia(`${slide(PLANOS)}.textContent`)), 'David Willer, como a casa escreve');
  // a regra da casa com tudo revelado: 24 px ou mais, dentro do palco, colunas até 988 px
  const regra = n => `(() => { const st = document.querySelector('#stage').getBoundingClientRect(), k = st.width / 1920, s = ${slide(n)}; const ruins = [];
    const w = document.createTreeWalker(s, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const e = w.currentNode.parentElement; if (!w.currentNode.textContent.trim() || !${VIS}(e) || e.closest('.counter')) continue;
      const fs = parseFloat(getComputedStyle(e).fontSize); const r = e.getBoundingClientRect();
      if (fs < 24) ruins.push('fonte ' + fs + ': ' + w.currentNode.textContent.trim().slice(0, 30));
      if (r.left < st.left - 1 || r.right > st.right + 1 || r.top < st.top - 1 || r.bottom > st.bottom + 1) ruins.push('fora do palco: ' + w.currentNode.textContent.trim().slice(0, 30)); }
    return ruins; })()`;
  const r21 = await a.avalia(regra(PLANOS));
  ok(!r21.length, 'o 21: nada abaixo de 24 px nem fora do palco' + (r21.length ? ': ' + r21.slice(0, 4).join(' | ') : ''));
  const fundo = await a.avalia(`(() => { const st = document.querySelector('#stage').getBoundingClientRect(), k = st.height / 1080; return Math.max(...[...${slide(PLANOS)}.querySelectorAll('.pl-vant p')].map(p => (p.getBoundingClientRect().bottom - st.top) / k)); })()`);
  ok(fundo <= 988, 'a coluna mais comprida termina em ' + Math.round(fundo) + ' px (até 988)');
  const sobre = await a.avalia(`(() => { const s = ${slide(PLANOS)}, cs = [...s.querySelectorAll('.t, .cl0-chamada, .pl-ideal > p, .pl-hd, .cl0-legal')].filter(${VIS}).map(e => [e, e.getBoundingClientRect()]); const ruins = [];
    cs.forEach(([e, r], i) => cs.slice(i + 1).forEach(([f, q]) => { if (e.contains(f) || f.contains(e)) return; const x = Math.min(r.right, q.right) - Math.max(r.left, q.left), y = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top); if (x > 2 && y > 2) ruins.push((e.className || e.tagName) + ' x ' + (f.className || f.tagName)); })); return ruins; })()`);
  ok(!sobre.length, 'o 21: título, chamada, selo da Elite, cabeçalhos e rodapé sem texto sobre texto' + (sobre.length ? ': ' + sobre.join(', ') : ''));
  // com os planos de menos coluna (Start e Pro na ficha), o 21 também abre e a recomendação cai na coluna certa
  for (const [id, col_] of [['pro', 'pro'], ['scouting', 'scouting']]) {
    await a.vai('about:blank'); await a.vai(base + leads[id] + '#' + PLANOS);
    await a.ate(`${ativo} === ${PLANOS} && /Lucas/.test(document.body.textContent)`, 10000); await espera(1200);
    ok(await a.avalia(`${VIS}(${slide(PLANOS)}.querySelector('.pl-col.${col_} .pl-rec'))`), id + ': a recomendação aparece na coluna dele com tudo revelado');
  }

  /* ---------- a garantia é o último slide e só nela ---------- */
  const antes = normal(await a.avalia(`[...document.querySelectorAll('#stage > .slide')].slice(0, ${GARANTIA - 1}).map(s => s.textContent).join(' ')`)).replace('sem garantia de aprovação ou contratação', '');
  ok(!/garantia/i.test(antes), 'nenhum slide antes do último fala de garantia' + (/garantia/i.test(antes) ? ' (achei: ' + antes.match(/.{40}garantia.{40}/i)[0] + ')' : ''));
  ok(/Garantia/.test(await a.avalia(`${slide(GARANTIA)}.textContent`)), 'o ' + GARANTIA + ' (o último) é a garantia');
  ok(!/10x/.test(tudo), 'nenhum slide fala em 10x');
  for (const n of [VALOR, INTERESSE, GARANTIA]) {
    await a.vai('about:blank'); await a.vai(base + leads.legacy + '#' + n);
    await a.ate(`${ativo} === ${n} && /Lucas/.test(document.body.textContent)`, 10000); await espera(1500);
    const r = await a.avalia(regra(n));
    ok(!r.length, 'o ' + n + ': nada abaixo de 24 px nem fora do palco' + (r.length ? ': ' + r.slice(0, 3).join(' | ') : ''));
  }
  // a seta no último slide não vai a lugar nenhum
  await a.avalia(seta('ArrowRight')); await espera(300);
  ok((await a.avalia(ativo)) === GARANTIA, 'depois da garantia não há mais slide');

  /* ---------- o apresentador ---------- */
  const R = await a.avalia(`(() => { const r = window.ROTEIRO; const p = n => r[n - 1] || {}; return {
    n: r.length, nomes: [${INTERESSE}, ${PLANOS}, ${GARANTIA}].map(n => p(n).nome), interesse: p(${INTERESSE}).fala.join(' '), planos: p(${PLANOS}).fala, atencao: p(${PLANOS}).atencao, silencio: p(${PLANOS}).silencio,
    garantia: p(${GARANTIA}).atencao, obj: (window.OBJECOES.find(o => /Tem garantia/.test(o.q)) || {}).prev, checklist: (window.CHECKLIST || []).join(' | '), todas: JSON.stringify(r) }; })()`);
  ok(R.n === TOTAL, 'o roteiro tem ' + TOTAL + ' entradas, na mesma sequência dos slides');
  ok(R.nomes.join(' | ') === 'Interesse alinhado | Os planos | Garantia incondicional', 'o roteiro do ' + INTERESSE + ' ao ' + GARANTIA + ' (' + R.nomes.join(', ') + ')');
  ok(!/\[faixa\]/.test(R.interesse) && /R\$ 5 a 30 mil por mês/.test(R.interesse) && !/áudio|mãe/i.test(R.interesse), 'Interesse alinhado: a faixa fixa, sem ponte com o áudio da mãe (o slide saiu)');
  const iPreco = R.planos.findIndex(f => /R\$ 997/.test(f)), iAvanco7 = R.planos.findIndex(f => /Sétimo avanço/.test(f));
  ok(iPreco > 0 && /Quarto avanço, a Assessoria Start/.test(R.planos[iPreco]) && /Quinto avanço, a Assessoria Pro/.test(R.planos[iPreco]) && /Sexto avanço, a Assessoria Elite/.test(R.planos[iPreco]) && R.planos.slice(0, iPreco).every(f => !/R\$/.test(f)), 'Os planos: nada de dinheiro antes do quarto avanço, e um preço por avanço');
  ok(/12x sem juros de R\$ 83,08/.test(R.planos[iPreco]) && /12x sem juros de R\$ 124,75/.test(R.planos[iPreco]) && /12x sem juros de R\$ 249,75/.test(R.planos[iPreco]), 'Os planos: as parcelas de 12x na fala');
  ok(iAvanco7 > iPreco && R.planos.every(f => !/avanço \d/.test(f)), 'os avanços por extenso (o ordem-garantia.js troca número depois de "o ", até no fim de "avanço")');
  ok(R.planos.some(f => /Pix ou no cartão/.test(f)) && R.silencio, 'o fechamento (Pix ou cartão) e o silêncio vieram pros planos');
  ok(/para de prestar atenção e começa a pensar no bolso/.test(R.atencao) && /06\/10\/2026/.test(R.atencao) && /dez oportunidades por trimestre/.test(R.atencao), 'Os planos: o porquê do closer, a decisão de 06/10/2026 invertida só aqui e as oportunidades por trimestre');
  const trecho = JSON.stringify([R.planos, R.atencao]);
  ok(!/Scout PRO|Legacy|Assessoria PRO|10x sem juros|encaminhamentos por mês/.test(trecho), 'o roteiro dos planos só usa Start, Pro e Elite, 12x e oportunidades por trimestre');
  ok(/no fim da apresentação/.test(R.garantia) && !/Bem-vindo/.test(R.garantia + R.obj), 'a Garantia diz que fica no fim, sem prometer o Bem-vindo');
  ok(/CL0: conferi que a garantia só aparece no último slide/.test(R.checklist), 'o checklist do CL0');
  ok(!/slide 05|no 13:|do 13,|número \(slide 24\)|a vaga \(slide|\(18 e 19\)/.test(R.todas), 'o roteiro não aponta pra slide que saiu (05, 13, A decisão, O investimento, Até lá)');
  // o apresentador: sem o chip do investimento, com a garantia no lugar do Bem-vindo, e o Silêncio leva aos planos
  const p = await nav.aba(base + leads.legacy + '&presenter#3', { largura: 1480, altura: 920 });
  ok(await p.ate("document.querySelector('#pz-notes') && document.querySelector('#pz-notes').textContent.length > 0", 15000), 'o apresentador abre');
  await p.avalia(`document.querySelector('[data-tab="fech"]').click(); 1`);
  const chips = normal(await p.avalia(`document.querySelector('#tab-fech .pz-chips').textContent`));
  ok(/Os planos \(21\)/.test(chips) && !/O investimento/.test(chips) && /Garantia incondicional \(22\)/.test(chips) && !/Bem-vindo/.test(chips) && !/A vaga|O começo/.test(chips), 'o Fechamento: chips dos planos e da garantia, sem investimento, vaga nem Bem-vindo (' + chips + ')');
  ok(/12x sem juros de R\$ 249,75/.test(normal(await p.avalia(`document.querySelector('#tab-fech').textContent`))) && !/10x/.test(await p.avalia(`document.querySelector('#tab-fech').textContent`)), 'o Fechamento fala em 12x');
  await p.avalia(`document.querySelector('[data-a="silence"]').click(); 1`);
  ok(await a.ate(`${ativo} === ${PLANOS}`, 6000), 'o Silêncio (S) do apresentador, de qualquer slide, leva a tela da família aos planos, onde o número é dito');
  await p.avalia(`document.querySelector('[data-a="silence"]').click(); 1`);
  await Promise.race([p.envia('Page.close').catch(() => {}), espera(400)]);

  /* ---------- as outras páginas seguem como eram ---------- */
  for (const [pid, caminho] of [['r2a-principal', '/'], ['r2a-tecnica', '/variacoes/tecnica/'], ['r2a-acompanhamento', '/variacoes/acompanhamento/']]) {
    const t = (await admin.post('/api/atletas', { ficha: { nome: 'Lucas Almeida da Silva', plano: 'Assessoria de Elite Legacy', versao: pid } })).j.t;
    await a.vai('about:blank'); await a.vai(s.decks['r2-anterior'] + caminho + '?a=' + t + '#27');
    await a.ate(`${ativo} === 27 && /Lucas/.test(document.body.textContent)`, 10000);
    const o = await a.avalia(`(() => { const ss = document.querySelectorAll('#stage > .slide'); return { n: ss.length, v: window.VARIACAO_NOME, t27: ss[26].textContent.replace(/\\s+/g, ' '), t29: (ss[28].querySelector('.t') || {}).textContent || '', cl0: !!document.querySelector('.cl0-planos, link[href*="cl0.css"]'), p: window.PARCELAS_N || 10 }; })()`);
    ok(o.n === 32 && !o.cl0 && o.v !== 'CL0' && o.p === 10, pid + ': 32 slides, 10x e nada do CL0 na página');
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
