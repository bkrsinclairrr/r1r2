// O mapa de calor por posição (20/10/2026), com o painel e os decks locais e o driver de arquivo. Confere: a ficha guarda o mapa da lista
// (mapaCalor, ou "sem") e a /api/r2 manda; no painel, a grade das 11 posições, a sugestão pela posição da ficha, a escolha que fica depois de
// salvar e o "Sem mapa"; nos três decks (as oito páginas do R2), o SVG desenhado embaixo do vídeo com o subtítulo verdadeiro ("onde atua um
// zagueiro"), o dossiê que abre só com o mapa, o mapa enviado como imagem antes valendo mais que o da lista, e o vídeo em pé com o mapa do
// lado (o campo em pé) e na IA na Prática sem corte. Os vídeos são clipes gerados no Chrome do teste (_clipe.mjs).
// Uso: node testes/teste-mapa-calor.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { sobe } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';
import { geraClipe } from './_clipe.mjs';

const { ok, fim } = verificador('Mapa de calor por posição');
const nomeAleatorio = () => { const a = 'abcdefghijkmnpqrstuvwxyz23456789'; return Array.from(crypto.randomBytes(24), x => a[x % a.length]).join(''); };
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'closer-mapa-'));
const MAPA = path.join(temp, 'mapa.jpg');
execFileSync('python', ['-I', '-c', `from PIL import Image, ImageDraw
im = Image.new('RGB', (900, 580), (22, 74, 46)); d = ImageDraw.Draw(im)
d.ellipse([420, 160, 700, 360], fill=(230, 60, 40)); im.save(r'${MAPA}', 'JPEG', quality=85)`]);
const s = await sobe({ deck: true, decks: ['r2-anterior', 'r2-b'] });
const nav = await abreNavegador();
const ativo = "[...document.querySelectorAll('#stage > .slide')].findIndex(s => s.classList.contains('active')) + 1";
const BASE = { nome: 'Carlos Eduardo Souza', posicao: 'zagueiro', idade: '17', origem: 'Zyron', plano: 'Assessoria de Elite Legacy', temVideo: 'sim' };
try {
  const admin = new Cliente(s.painel), anon = new Cliente(s.painel); await admin.entra(s.adminLogin, s.adminSenha);
  const versoes = (await admin.get('/api/versoes')).j.versoes;
  const deitado = await geraClipe(nav, { largura: 640, altura: 360, segundos: 2 });
  const emPe = await geraClipe(nav, { largura: 360, altura: 640, segundos: 2 });
  ok(deitado.length > 1000 && emPe.length > 1000, 'dois clipes de teste gerados no Chrome (deitado ' + deitado.length + ' bytes, em pé ' + emPe.length + ' bytes)');
  async function lead(ficha, clipe, dims, leitura) {
    const r = await admin.post('/api/atletas', { ficha: Object.assign({}, BASE, ficha) });
    const t = r.j.t;
    if (clipe) {
      const arq = 'videos/' + t + '/' + nomeAleatorio() + '.webm', p = path.join(s.dados, ...arq.split('/'));
      fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, clipe);
      await admin.put('/api/leitura?t=' + t, { autorizar: true });
      await admin.put('/api/leitura?t=' + t, { video: Object.assign({ arquivo: arq, tipo: 'video/webm', bytes: clipe.length, duracaoS: 2 }, dims || {}) });
      if (leitura) await admin.put('/api/leitura?t=' + t, { leitura });
    }
    return t;
  }

  /* ---------- a ficha e a /api/r2 ---------- */
  const t1 = await lead({ mapaCalor: 'ZAG-d' }, deitado, { largura: 640, altura: 360 });
  const r1 = (await admin.get('/api/atletas?t=' + t1)).j.registro;
  const p1 = (await anon.get('/api/r2?t=' + t1)).j;
  ok(r1.ficha.mapaCalor === 'ZAG-d' && p1.ficha.mapaCalor === 'ZAG-d' && p1.video.largura === 640 && p1.video.altura === 360, 'a ficha guarda o mapa da lista e a /api/r2 manda o mapa e as medidas do vídeo');
  const lixo = (await admin.post('/api/atletas', { ficha: Object.assign({}, BASE, { mapaCalor: '<script>' }) })).j.registro.ficha;
  const sem = (await admin.post('/api/atletas', { ficha: Object.assign({}, BASE, { mapaCalor: 'sem' }) })).j.registro.ficha;
  ok(!('mapaCalor' in lixo) && sem.mapaCalor === 'sem', 'mapa fora da lista fica de fora; "sem" é aceito (o closer escolheu não mostrar)');
  const item = ((await admin.get('/api/atletas')).j.itens || []).find(i => i.t === t1);
  ok(item && item.mapa === true, 'a lista do painel conta o mapa da lista como mapa do lead');

  /* ---------- as oito páginas: o SVG embaixo do vídeo, o subtítulo e o dossiê só com o mapa ---------- */
  const PAGINAS = [['principal', 18], ['tecnica', 18], ['r2b-principal', 18], ['r2b-tecnica', 18], ['r2a-principal', 16], ['r2a-tecnica', 16], ['r2a-acompanhamento', 16], ['r2a-cl0', 16]];
  for (const [id, ds] of PAGINAS) {
    const ver = versoes.find(v => v.id === id);
    if (!ok(!!ver, id + ': no catálogo')) continue;
    const t = await lead({ versao: id, mapaCalor: 'ZAG-e', posicao: 'zagueiro esquerdo' }, deitado, { largura: 640, altura: 360 });
    const a = await nav.aba(s.decks[ver.deck] + ver.caminho + '?a=' + t + '#' + ds, { largura: 1920, altura: 1080 });
    ok(await a.ate(`document.querySelector('.ds-slide.active .ds-mapa-svg svg')`, 15000), id + ': o mapa da posição desenhado no dossiê (' + ds + ')');
    const D = await a.avalia(`(() => { const s = document.querySelector('.ds-slide'); const sv = s.querySelector('.ds-mapa-svg svg'), img = s.querySelector('.ds-mapa-img img');
      return { sub: s.querySelector('[data-bind="dsMapaSub"]').textContent, vb: sv.getAttribute('viewBox'), aria: sv.getAttribute('aria-label'), img: getComputedStyle(img).display, rede: performance.getEntriesByType('resource').some(r => /mapa/.test(r.name) && !/mapa-calor\\.js/.test(r.name)) }; })()`);
    ok(D.sub === '· onde atua um zagueiro' && D.vb === '0 0 1050 680' && /zagueiro/.test(D.aria) && D.img === 'none' && !D.rede, id + ': "Mapa de calor · onde atua um zagueiro", o campo deitado, sem imagem e sem pedido de rede pro mapa');
    await a.fecha();
  }
  // só o mapa (sem vídeo nem oportunidades): o dossiê aparece
  const tSo = await lead({ mapaCalor: 'CA', posicao: 'centroavante' }, null);
  const so = await nav.aba(s.decks.r2 + '/?a=' + tSo + '#17', { largura: 1920, altura: 1080 });
  await so.ate(`${ativo} === 17 && /Carlos/.test(document.body.textContent)`, 15000); await espera(600);
  for (let i = 0; i < 6 && (await so.avalia(ativo)) === 17; i++) { await so.avalia("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })); 1"); await espera(150); }
  ok((await so.avalia(ativo)) === 18 && await so.avalia("!!document.querySelector('.ds-slide.active .ds-mapa-svg svg') && !document.querySelector('.ds-slide.active').classList.contains('ds-com-v')"), 'só com o mapa da lista, a seta entra no dossiê e ele mostra o mapa');
  await so.fecha();
  // "Sem mapa": nada de mapa no dossiê
  const tSem = await lead({ mapaCalor: 'sem' }, deitado, { largura: 640, altura: 360 });
  const sm = await nav.aba(s.decks.r2 + '/?a=' + tSem + '#18', { largura: 1920, altura: 1080 });
  await sm.ate("document.querySelector('.ds-slide.active .ds-player')", 15000); await espera(500);
  ok(await sm.avalia("!document.querySelector('.ds-slide').classList.contains('ds-com-m') && !document.querySelector('.ds-mapa-svg svg')"), '"Sem mapa": o dossiê fica só com o vídeo');
  await sm.fecha();
  // o mapa enviado como imagem antes de 20/10/2026 vale mais que o da lista
  const tVelho = await lead({ mapaCalor: 'MC' }, deitado, { largura: 640, altura: 360 });
  const mv = await admin.put('/api/foto?t=' + tVelho, { mapa: fs.readFileSync(MAPA).toString('base64') });
  const ve = await nav.aba(s.decks.r2 + '/?a=' + tVelho + '#18', { largura: 1920, altura: 1080 });
  ok(mv.status === 200 && await ve.ate("(() => { const i = document.querySelector('.ds-slide.active .ds-mapa-img img'); return i && i.complete && i.naturalWidth > 0 && getComputedStyle(i).display !== 'none'; })()", 15000)
    && await ve.avalia("!document.querySelector('.ds-mapa-svg svg') && document.querySelector('[data-bind=\"dsMapaSub\"]').textContent === '· onde o seu jogo acontece'"),
    'o mapa enviado como imagem antes vale mais que o da lista (e o subtítulo de sempre)');
  await ve.fecha();

  /* ---------- o vídeo em pé: o mapa do lado, o campo em pé; a IA na Prática sem corte ---------- */
  const lances = [{ t: .4, tipo: 'Passe', leitura: 'bom' }, { t: 1.1, tipo: 'Drible', leitura: 'bom' }];
  for (const [deck, caminho, ds, ia] of [['r2', '/', 18, 17], ['r2-anterior', '/variacoes/cl0/', 16, 15], ['r2-b', '/', 18, 17]]) {
    const idV = deck === 'r2' ? 'principal' : deck === 'r2-b' ? 'r2b-principal' : 'r2a-cl0';
    const tP = await lead({ versao: idV, mapaCalor: 'LD', posicao: 'lateral direito' }, emPe, { largura: 360, altura: 640 });
    const a = await nav.aba(s.decks[deck] + caminho + '?a=' + tP + '#' + ds, { largura: 1920, altura: 1080 });
    await a.ate("document.querySelector('.ds-slide.active .ds-mapa-svg svg')", 15000); await espera(2200);
    const G = await a.avalia(`(() => { const st = document.querySelector('#stage').getBoundingClientRect(), k = st.width / 1920, s = document.querySelector('.ds-slide');
      const r = e => { const q = e.getBoundingClientRect(); return { x: (q.left - st.left) / k, y: (q.top - st.top) / k, w: q.width / k, h: q.height / k }; };
      return { cls: s.className, p: r(s.querySelector('.ds-player')), m: r(s.querySelector('.ds-mapa-img')), vb: s.querySelector('.ds-mapa-svg svg').getAttribute('viewBox'),
        chip: r(s.querySelector('.ds-chip')), som: r(s.querySelector('.ds-player .som')) }; })()`);
    ok(/ds-em-pe/.test(G.cls) && Math.abs(G.p.w / G.p.h - 360 / 640) < .02 && G.p.h >= 650 && G.m.x >= G.p.x + G.p.w && G.vb === '0 0 680 1050',
      deck + ': vídeo em pé no dossiê: a caixa na proporção dele (' + Math.round(G.p.w) + ' x ' + Math.round(G.p.h) + '), o mapa ao lado e o campo em pé');
    ok(G.chip.y > G.som.y + G.som.h, deck + ': o selo do vídeo desce pro pé (não bate no botão do som)');
    await a.fecha();
    // a IA na Prática com lances: a caixa encolhe na largura, no mesmo lugar, e o vídeo inteiro (contain)
    await admin.put('/api/leitura?t=' + tP, { leitura: { origem: 'equipe', lances } });
    const b = await nav.aba(s.decks[deck] + caminho + '?a=' + tP + '#' + ia, { largura: 1920, altura: 1080 });
    ok(await b.ate("(() => { const p = document.getElementById('p-atleta'); return p && p.classList.contains('ia-proporcao') && document.querySelector('#v-atleta').getAttribute('src'); })()", 15000), deck + ': a IA na Prática recebe o vídeo em pé');
    const I = await b.avalia(`(() => { const p = document.getElementById('p-atleta'), br = p.nextElementSibling; return { l: p.style.left, w: p.style.width, bl: br.style.left, bw: br.style.width, fit: getComputedStyle(p.querySelector('video')).objectFit }; })()`);
    ok(I.w === '266px' && I.l === '407px' && I.bw === I.w && I.bl === I.l && I.fit === 'contain', deck + ': a caixa da IA na Prática com 266 px de largura, centralizada (407 px), os cantos junto e o vídeo inteiro (' + JSON.stringify(I) + ')');
    await b.fecha();
  }
  // o vídeo deitado: a caixa de sempre na IA na Prática (840 x 473)
  const tD = await lead({ versao: 'principal' }, deitado, { largura: 640, altura: 360 }, { origem: 'equipe', lances });
  const d = await nav.aba(s.decks.r2 + '/?a=' + tD + '#17', { largura: 1920, altura: 1080 });
  await d.ate("document.getElementById('p-atleta') && document.querySelector('#v-atleta').getAttribute('src')", 15000); await espera(800);
  ok((await d.avalia("document.getElementById('p-atleta').style.width")) === '840px', 'vídeo deitado: a IA na Prática segue com a caixa de 840 px');
  await d.fecha();

  /* ---------- o painel: a grade, a sugestão, a escolha e o "Sem mapa" ---------- */
  const tE = await lead({ mapaCalor: undefined, posicao: 'volante pela esquerda' }, deitado, { largura: 640, altura: 360 });
  const P = await nav.aba(s.painel + '/', { largura: 1440, altura: 1000 });
  await P.ate("!document.querySelector('#v-entrar').hidden");
  await P.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = ${JSON.stringify(s.adminLogin)}; f.senha.value = ${JSON.stringify(s.adminSenha)}; f.requestSubmit(); return 1; })()`);
  await P.ate("!document.querySelector('#v-app').hidden");
  await P.avalia(`location.hash = '#/r2/${tE}'; 1`);
  ok(await P.ate("!document.querySelector('#v-editor').hidden && !document.querySelector('#vd-bloco').hidden && document.querySelectorAll('#mc-grade [data-mapa]').length === 12", 15000), 'o painel mostra a grade: Sem mapa e as 11 posições');
  const G0 = await P.avalia("(() => ({ val: document.querySelector('[name=mapaCalor]').value, sug: [...document.querySelectorAll('#mc-grade .sug')].map(i => i.closest('[data-mapa]').dataset.mapa), marc: [...document.querySelectorAll('#mc-grade [aria-checked=true]')].map(b => b.dataset.mapa), previa: document.querySelector('#mc-previa').textContent }))()");
  ok(G0.val === 'VOL-e' && G0.sug.join() === 'VOL-e' && G0.marc.join() === 'VOL-e' && /onde atua um volante/.test(G0.previa), 'a posição da ficha (volante pela esquerda) vem sugerida e marcada, com a prévia e o que o slide diz');
  await P.avalia("(() => { const p = document.querySelector('[name=posicao]'); p.value = 'meia'; p.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()");
  ok((await P.avalia("document.querySelector('[name=mapaCalor]').value")) === 'MC', 'sem escolha ainda, trocar a posição troca a sugestão (meia vira MC)');
  await P.avalia("document.querySelector('#mc-grade [data-mapa=\"CA\"]').click(); 1");
  await P.avalia("(() => { const p = document.querySelector('[name=posicao]'); p.value = 'goleiro'; p.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()");
  ok((await P.avalia("document.querySelector('[name=mapaCalor]').value")) === 'CA' && /Mudanças não salvas/.test(await P.avalia("document.querySelector('#ed-salvo').textContent")), 'escolhido o centroavante, a posição não troca mais o mapa (e o editor marca mudança)');
  await P.avalia("document.querySelector('#f-editor').requestSubmit(); 1");
  ok(await P.ate("/Salvo/.test(document.querySelector('#ed-salvo').textContent)", 10000), 'salvo');
  ok(((await admin.get('/api/atletas?t=' + tE)).j.registro.ficha || {}).mapaCalor === 'CA', 'a escolha chega na ficha (CA)');
  await P.avalia("document.querySelector('#mc-grade [data-mapa=\"sem\"]').click(); 1");
  ok(/Sem mapa de calor/.test(await P.avalia("document.querySelector('#mc-previa').textContent")), '"Sem mapa" mostra que o dossiê fica só com o vídeo');
  await P.avalia("document.querySelector('#f-editor').requestSubmit(); 1");
  await P.ate("/Salvo/.test(document.querySelector('#ed-salvo').textContent)", 10000);
  ok(((await admin.get('/api/atletas?t=' + tE)).j.registro.ficha || {}).mapaCalor === 'sem', '"Sem mapa" fica salvo como escolha (sem)');
  // o lead com o mapa enviado como imagem: "Trocar por um da lista" apaga o arquivo e abre a grade
  await P.avalia(`location.hash = '#/r2/${tVelho}'; 1`);
  ok(await P.ate("!document.querySelector('#mc-atual').hidden && document.querySelector('#mc-escolha').hidden", 15000), 'lead com o mapa de antes: o painel mostra a imagem e esconde a grade');
  await P.avalia("document.querySelector('#mc-trocar').click(); 1");
  ok(await P.ate("document.querySelector('#mc-atual').hidden && !document.querySelector('#mc-escolha').hidden", 10000) && !((await admin.get('/api/atletas?t=' + tVelho)).j.registro.mapa || {}).versao,
    '"Trocar por um da lista" apaga o arquivo e abre a grade');
  const exc = P.console_.filter(m => /^EXC/.test(m));
  ok(!exc.length, 'nenhuma exceção no painel' + (exc.length ? ': ' + exc.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha();
  await s.fecha();
  try { fs.rmSync(temp, { recursive: true, force: true }); } catch { /* nada */ }
}
fim();
