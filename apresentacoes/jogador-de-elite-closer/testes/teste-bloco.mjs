// O bloco da página institucional nos decks (o método, o campo olhômetro × IA, o encaixe, os 326 atletas, os clubes e parceiros e o
// mosaico): cada página tem os slides nas posições certas, nada fica abaixo de 24 px nem fora do palco, o campo troca de modo com o
// clique nos dois botões, o 326 conta até o número da casa, ?bloco=estatico para a animação e o manifesto declara os opcionais só
// onde o deck sabe tirar slide da sequência (o R2 novo). Os decks de verdade vêm da pasta do lado (como nos outros testes).
// Uso: node testes/teste-bloco.mjs
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZES } from './servidor.mjs';
import { verificador } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const { ok, fim } = verificador('Bloco da página institucional');

const SEIS = ['metodo', 'campo', 'encaixe', 'registro', 'clubes', 'rostos'];
const R2 = { metodo: 10, campo: 13, encaixe: 14, registro: 22, clubes: 23, rostos: 24 };
const ANT = { metodo: 9, campo: 11, encaixe: 12, registro: 19, clubes: 20, rostos: 21 };
// deck, o endereço, as páginas (caminho, quantos slides e onde ficam os do bloco) e se o deck deixa tirar slide (os opcionais do manifesto)
const DECKS = [
  { id: 'r2', nome: 'R2 novo', opcionais: true, paginas: [
    { caminho: '/', total: 33, pos: R2 }, { caminho: '/variacoes/tecnica/', total: 33, pos: R2, tecnica: true }] },
  { id: 'r2-b', nome: 'R2 B', opcionais: false, paginas: [
    { caminho: '/', total: 33, pos: R2 }, { caminho: '/variacoes/tecnica/', total: 33, pos: R2, tecnica: true }] },
  { id: 'r2-anterior', nome: 'R2 anterior', opcionais: false, paginas: [
    { caminho: '/', total: 30, pos: ANT }, { caminho: '/variacoes/tecnica/', total: 30, pos: ANT, tecnica: true },
    { caminho: '/variacoes/acompanhamento/', total: 30, pos: Object.assign({}, ANT, { encaixe: 10, campo: 12 }) }] },
  { id: 'r1', nome: 'R1', opcionais: false, r1: true, paginas: [
    { caminho: '/', total: 20, pos: { campo: 7, registro: 13, clubes: 14, rostos: 18 } }] }
];

// a regra da casa, no slide ativo (animação desligada antes): texto de 24 px ou mais, nada fora do palco
const AUDITA = `(() => {
  const s = document.querySelector('#stage > .slide.active'), r = s.getBoundingClientRect();
  const visivel = el => { for (let e = el; e && e !== s.parentElement; e = e.parentElement) { const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.5) return false; } return true; };
  const pequenas = [], fora = [], textos = [];
  const w = document.createTreeWalker(s, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const tx = w.currentNode, t = tx.textContent.trim(); if (!t) continue;
    const el = tx.parentElement; if (!visivel(el)) continue;
    textos.push(t);
    if (parseFloat(getComputedStyle(el).fontSize) < 24) pequenas.push(t.slice(0, 28));
    const b = el.getBoundingClientRect();
    if (b.width && (b.right > r.right + 3 || b.bottom > r.bottom + 3 || b.left < r.left - 3 || b.top < r.top - 3)) fora.push(t.slice(0, 28));
  }
  const quebradas = [...s.querySelectorAll('img')].filter(i => visivel(i) && i.getAttribute('src') && i.complete && !i.naturalWidth).length;
  return { pequenas, fora, quebradas, texto: textos.join(' | ') };
})()`;

const s = await sobe({ deck: true, decks: ['r2-anterior', 'r2-b', 'r1'] });
const nav = await abreNavegador();
try {
  for (const deck of DECKS) {
    const origem = deck.id === 'r2' ? s.decks.r2 : s.decks[deck.id];
    const manifesto = JSON.parse(fs.readFileSync(path.join(RAIZES[deck.id], 'variacoes.json'), 'utf8'));
    for (const pg of deck.paginas) {
      const rotulo = deck.nome + ' ' + pg.caminho;
      const ids = Object.keys(pg.pos);
      const a = await nav.aba(origem + pg.caminho + '#1', { largura: 1920, altura: 1080 });
      await a.ate("document.querySelectorAll('#stage > .slide').length > 0 && document.querySelector('#stage > .slide.active')", 20000);
      await espera(900);
      await a.avalia("(() => { const st = document.createElement('style'); st.textContent = '*{animation:none!important;transition:none!important}.hud,.progress{display:none!important}'; document.head.appendChild(st); return 1; })()");

      // as posições: o slide de cada parte é o que o cadastro, o README e o painel dizem
      const achados = await a.avalia(`(() => { const ss = [...document.querySelectorAll('#stage > .slide')]; const o = { total: ss.length };
        ${JSON.stringify(SEIS)}.forEach(id => { const i = ss.findIndex(x => x.classList.contains('bl-' + id)); if (i >= 0) o[id] = i + 1; }); return o; })()`);
      ok(achados.total === pg.total, rotulo + ': tem ' + pg.total + ' slides (' + achados.total + ')');
      ok(ids.every(id => achados[id] === pg.pos[id]) && SEIS.filter(id => achados[id]).length === ids.length,
        rotulo + ': os slides do bloco estão em ' + ids.map(id => id + '=' + pg.pos[id]).join(', ') + ' (achei ' + ids.map(id => id + '=' + achados[id]).join(', ') + ')');

      // cada slide do bloco: a regra de 24 px, nada fora do palco, sem travessão, sem imagem quebrada
      for (const id of ids) {
        await a.avalia(`location.hash = '#${pg.pos[id]}'; 1`);
        await a.ate(`document.querySelector('#stage > .slide.active').classList.contains('bl-${id}')`, 5000);
        await espera(350);
        const r = await a.avalia(AUDITA);
        ok(r.pequenas.length === 0 && r.fora.length === 0 && r.quebradas === 0, rotulo + ' / ' + id + ' (slide ' + pg.pos[id] + '): texto de 24 px ou mais, nada fora do palco, sem imagem quebrada'
          + (r.pequenas.length ? ' | pequeno: ' + r.pequenas.slice(0, 3).join(', ') : '') + (r.fora.length ? ' | fora: ' + r.fora.slice(0, 3).join(', ') : ''));
        ok(!/[\u2013\u2014]|undefined|NaN|\{\{/.test(r.texto) && r.texto.length > 20, rotulo + ' / ' + id + ': sem travessão, undefined nem NaN, e com texto');
      }

      // o campo: abre no olhômetro e os dois botões trocam o modo com um clique (e voltam)
      await a.avalia(`location.hash = '#${pg.pos.campo}'; 1`);
      await a.ate("document.querySelector('#stage > .slide.active').classList.contains('bl-campo')", 5000);
      await espera(500);
      const modo = () => a.avalia(`(() => { const c = document.querySelector('#stage > .slide.active'); return JSON.stringify({ ia: c.classList.contains('bl-ia'),
        n: c.querySelector('.bl-conta strong').textContent, o: c.querySelector('[data-bl-modo=olho]').getAttribute('aria-pressed'), i: c.querySelector('[data-bl-modo=ia]').getAttribute('aria-pressed') }); })()`);
      const inicio = JSON.parse(await modo());
      ok(inicio.ia === false && inicio.o === 'true' && inicio.i === 'false' && Number(inicio.n) < 22, rotulo + ': o campo abre no olhômetro (' + inicio.n + ' de 22 observados)');
      await a.avalia("document.querySelector('#stage > .slide.active [data-bl-modo=ia]').click(); 1"); await espera(500);
      const ia = JSON.parse(await modo());
      ok(ia.ia === true && ia.n === '22' && ia.i === 'true' && ia.o === 'false', rotulo + ': o clique em "Inteligência artificial" mostra os 22 (' + ia.n + ')');
      await a.avalia("document.querySelector('#stage > .slide.active [data-bl-modo=olho]').click(); 1"); await espera(500);
      const volta = JSON.parse(await modo());
      ok(volta.ia === false && volta.o === 'true', rotulo + ': o clique em "Olhômetro" volta');
      if (deck.r1) {
        // o R1 não é conduzido por avanço: sem clique, o campo vira sozinho pra IA em uns 7 segundos
        await a.avalia(`location.hash = '#1'; 1`); await espera(300);
        await a.avalia(`location.hash = '#${pg.pos.campo}'; 1`); await espera(7800);
        ok(JSON.parse(await modo()).ia === true, rotulo + ': sem clique, o campo vira sozinho pra IA');
      }

      // o 326 conta até o número da casa
      await a.avalia(`location.hash = '#${pg.pos.registro}'; 1`);
      ok(await a.ate("(document.querySelector('#stage > .slide.active [data-bl-conta]') || {}).textContent === '326'", 6000), rotulo + ': o contador do 326 chega em 326');

      // o manifesto: opcionais só onde o deck tira slide da sequência
      const html = fs.readFileSync(path.join(RAIZES[deck.id], ...pg.caminho.split('/').filter(Boolean), 'index.html'), 'utf8');
      const pagina = manifesto.paginas.find(p => p.caminho === pg.caminho);
      const declarados = pagina.opcionais.filter(o => SEIS.includes(o.id)).map(o => o.id + '@' + o.slide);
      const marcados = SEIS.filter(id => html.includes('data-opcional="' + id + '"'));
      if (deck.opcionais) ok(declarados.join() === SEIS.map(id => id + '@' + pg.pos[id]).join() && marcados.length === 6, rotulo + ': o variacoes.json declara os seis opcionais, cada um no slide dele (' + declarados.join(', ') + ')');
      else ok(declarados.length === 0 && marcados.length === 0, rotulo + ': este deck não tira slide da sequência, então o bloco não declara opcional');

      const exc = a.console_.filter(m => /^EXC/.test(m));
      ok(exc.length === 0, rotulo + ': nenhuma exceção de JavaScript' + (exc.length ? ': ' + exc.slice(0, 2).join(' | ') : ''));

      // R2 anterior: a aba Ler antes (que fala por origem de slide) lista os seis entre os que mostram o nome do lead
      if (deck.id === 'r2-anterior') {
        const P = await nav.aba(origem + pg.caminho + '?presenter#1', { largura: 1500, altura: 1000 });
        await P.ate("document.querySelector('#tab-ler') && document.querySelector('#tab-ler').textContent.includes('Nome do atleta')", 15000);
        const dois = n => String(n).padStart(2, '0');
        const lista = SEIS.map(id => dois(pg.pos[id]));
        const esperado = lista.slice(0, -1).join(', ') + ' e ' + lista[lista.length - 1];
        ok((await P.avalia("document.querySelector('#tab-ler').textContent")).includes(esperado), rotulo + ': a aba Ler antes lista os seis slides do bloco entre os que mostram o nome (' + esperado + ')');
      }
    }
  }

  // ?bloco=estatico: a animação para (o campo fica no quadro de uma foto) e o campo continua clicável
  const E = await nav.aba(s.decks.r2 + '/?bloco=estatico#13', { largura: 1920, altura: 1080 });
  await E.ate("document.querySelector('#stage > .slide.active.bl-campo') && document.documentElement.classList.contains('bl-estatico')", 15000);
  await espera(900);
  const quadro = () => E.avalia("document.querySelectorAll('#stage > .slide.active .bl-pl')[3].getAttribute('transform') + '|' + document.querySelector('#stage > .slide.active .bl-bola').getAttribute('cx')");
  const q1 = await quadro(); await espera(900); const q2 = await quadro();
  ok(!!q1 && q1 === q2, '?bloco=estatico: o campo fica parado (' + q1 + ')');
  await E.avalia("document.querySelector('#stage > .slide.active [data-bl-modo=ia]').click(); 1"); await espera(400);
  ok(await E.avalia("document.querySelector('#stage > .slide.active').classList.contains('bl-ia') && document.querySelector('#stage > .slide.active .bl-conta strong').textContent === '22'"), '?bloco=estatico: e o clique na IA ainda troca o modo');
  ok(E.console_.filter(m => /^EXC/.test(m)).length === 0, '?bloco=estatico: nenhuma exceção de JavaScript');
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha();
  await s.fecha();
}
fim();
