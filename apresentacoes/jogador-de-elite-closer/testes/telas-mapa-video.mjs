// Capturas do vídeo analisado e do mapa de calor (20/10/2026), 1920 x 1080, com o painel e os decks locais: o dossiê com vídeo deitado e em
// pé, com e sem mapa, só o mapa, a IA na Prática com vídeo em pé, e a grade dos mapas no painel. Os clipes são gerados no Chrome (_clipe.mjs).
// Uso: node testes/telas-mapa-video.mjs <pasta-de-saida>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { sobe } from './servidor.mjs';
import { Cliente } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';
import { geraClipe } from './_clipe.mjs';

const SAIDA = path.resolve(process.argv[2] || 'telas-mapa-video');
fs.mkdirSync(SAIDA, { recursive: true });
const nomeAleatorio = () => { const a = 'abcdefghijkmnpqrstuvwxyz23456789'; return Array.from(crypto.randomBytes(24), x => a[x % a.length]).join(''); };
const sem = "(() => { const st = document.createElement('style'); st.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}.hud,.progress{display:none!important}'; document.head.appendChild(st); return 1; })()";

const s = await sobe({ deck: true, decks: ['r2-anterior', 'r2-b'] });
const nav = await abreNavegador();
try {
  const admin = new Cliente(s.painel); await admin.entra(s.adminLogin, s.adminSenha);
  await admin.get('/api/versoes');
  const deitado = await geraClipe(nav, { largura: 640, altura: 360, segundos: 3 });
  const emPe = await geraClipe(nav, { largura: 360, altura: 640, segundos: 3 });
  const BASE = { nome: 'Carlos Eduardo Souza', posicao: 'zagueiro', idade: '17', altura: '182', pe: 'Destro', categoria: 'Sub-17', cidade: 'Niterói', origem: 'Zyron',
    plano: 'Assessoria de Elite Legacy', temVideo: 'sim', oportunidades: 'Ferroviária~Série C|Benfica~Portugal' };
  async function lead(ficha, clipe, dims, leitura) {
    const t = (await admin.post('/api/atletas', { ficha: Object.assign({}, BASE, ficha) })).j.t;
    if (clipe) {
      const arq = 'videos/' + t + '/' + nomeAleatorio() + '.webm', p = path.join(s.dados, ...arq.split('/'));
      fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, clipe);
      await admin.put('/api/leitura?t=' + t, { autorizar: true });
      const r = await admin.put('/api/leitura?t=' + t, { video: Object.assign({ arquivo: arq, tipo: 'video/webm', bytes: clipe.length, duracaoS: 3 }, dims || {}) });
      if (r.status !== 200) throw new Error('vídeo: ' + r.texto);
      if (leitura) await admin.put('/api/leitura?t=' + t, { leitura });
    }
    return t;
  }
  const CENAS = [
    ['deitado-com-mapa', { mapaCalor: 'ZAG-d' }, deitado, { largura: 640, altura: 360 }],
    ['em-pe-com-mapa', { mapaCalor: 'LD', posicao: 'lateral direito' }, emPe, { largura: 360, altura: 640 }],
    ['em-pe-sem-mapa', { mapaCalor: 'sem' }, emPe, { largura: 360, altura: 640 }],
    ['em-pe-sem-medidas', { mapaCalor: 'MC', posicao: 'meia' }, emPe, null],
    ['so-mapa', { mapaCalor: 'CA', posicao: 'centroavante', oportunidades: '' }, null, null]
  ];
  for (const [nome, ficha, clipe, dims] of CENAS) {
    const t = await lead(ficha, clipe, dims);
    for (const [deck, caminho, n] of [['r2', '/', 18], ['r2-anterior', '/variacoes/cl0/', 16]]) {
      const a = await nav.aba(s.decks[deck] + caminho + '?a=' + t + '#' + n, { largura: 1920, altura: 1080 });
      await a.ate("document.querySelector('#stage > .slide.active')", 10000);
      await espera(1500); await a.avalia(sem); await espera(400);
      await a.foto(path.join(SAIDA, nome + '-' + deck + '.png'));
      console.log(nome, deck, JSON.stringify(await a.avalia("(() => { const s = document.querySelector('.ds-slide'); const r = e => e ? [Math.round(e.getBoundingClientRect().x), Math.round(e.getBoundingClientRect().y), Math.round(e.getBoundingClientRect().width), Math.round(e.getBoundingClientRect().height)] : null; return { cls: s.className, player: r(s.querySelector('.ds-player')), mapa: r(s.querySelector('.ds-mapa-img')), sub: (s.querySelector('[data-bind=dsMapaSub]') || {}).textContent }; })()")));
      await a.fecha();
    }
  }
  // a IA na Prática com o vídeo em pé e lances marcados
  const lances = [{ t: .5, tipo: 'Passe', leitura: 'bom' }, { t: 1.2, tipo: 'Drible', leitura: 'bom' }, { t: 2.1, tipo: 'Desarme', leitura: 'ajustar' }];
  const tIA = await lead({ mapaCalor: 'ZAG-d' }, emPe, { largura: 360, altura: 640 }, { origem: 'equipe', lances });
  for (const [deck, caminho, n] of [['r2', '/', 17], ['r2-anterior', '/', 15]]) {
    const a = await nav.aba(s.decks[deck] + caminho + '?a=' + tIA + '#' + n, { largura: 1920, altura: 1080 });
    await a.ate("document.querySelector('#stage > .slide.active')", 10000);
    await espera(1500); await a.avalia(sem); await espera(400);
    await a.foto(path.join(SAIDA, 'ia-em-pe-' + deck + '.png'));
    console.log('ia', deck, await a.avalia("(() => { const p = document.getElementById('p-atleta'); return p ? p.style.left + ' ' + p.style.width + ' ' + p.className : 'sem player'; })()"));
    await a.fecha();
  }
  // o painel: a grade dos mapas, com a posição sugerida
  const tP = await lead({ mapaCalor: '', posicao: 'zagueiro esquerdo' }, deitado, { largura: 640, altura: 360 });
  const P = await nav.aba(s.painel + '/', { largura: 1440, altura: 1000 });
  await P.ate("!document.querySelector('#v-entrar').hidden");
  await P.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = ${JSON.stringify(s.adminLogin)}; f.senha.value = ${JSON.stringify(s.adminSenha)}; f.requestSubmit(); return 1; })()`);
  await P.ate("!document.querySelector('#v-app').hidden");
  await P.avalia(`location.hash = '#/r2/${tP}'; 1`);
  await P.ate("!document.querySelector('#v-editor').hidden && !document.querySelector('#vd-bloco').hidden", 15000);
  await espera(800);
  await P.avalia("document.querySelector('#s-video').scrollIntoView({ block: 'start' }); 1");
  await espera(400);
  await P.foto(path.join(SAIDA, 'painel-grade.png'));
  await P.fecha();
} finally {
  await nav.fecha();
  await s.fecha();
}
