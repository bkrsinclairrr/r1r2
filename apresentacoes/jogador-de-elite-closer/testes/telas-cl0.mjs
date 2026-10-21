// Capturas do CL0 (R2 anterior, /variacoes/cl0/), 1920 x 1080, com o atleta vindo do painel de teste: os slides 27 a 32 com tudo
// revelado, nos três planos, e o 29 avanço por avanço (0 a 5) com o Legacy. Uma execução do Chrome por vez, telas numa pasta.
// Uso: node testes/telas-cl0.mjs <pasta-de-saida> [pagina] [plano...]
//   pagina: cl0 (padrão), tecnica, principal ou acompanhamento (a mesma captura de outra página, pra comparar antes e depois)
//   planos: legacy, pro, scouting (padrão: os três)
// DECK_PASTA_R2_ANTERIOR aponta outra cópia do deck (ex.: a versão de antes de uma edição), como nos outros testes.
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZES } from './servidor.mjs';
import { Cliente, fotosDeTeste, b64, espera } from './_util.mjs';

const { abreChrome } = await import('./_cdp.mjs');
const SAIDA = path.resolve(process.argv[2] || 'telas-cl0');
const PAGINA = process.argv[3] || 'cl0';
const PLANOS = process.argv.slice(4).length ? process.argv.slice(4) : ['legacy', 'pro', 'scouting'];
const NOMES = { legacy: 'Assessoria de Elite Legacy', pro: 'Assessoria PRO', scouting: 'Scout PRO' };
const SLIDES = [27, 28, 29, 30, 31, 32];
fs.mkdirSync(SAIDA, { recursive: true });

const s = await sobe({ deck: true, decks: ['r2-anterior'] });
const fotos = fotosDeTeste(RAIZES.r2);
const admin = new Cliente(s.painel);
await admin.entra(s.adminLogin, s.adminSenha);
await admin.get('/api/versoes'); // a primeira abertura da lista sincroniza com os decks locais
const base = { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', idade: '15', cidade: 'Natal', pe: 'Destro', altura: '178', origem: 'Zyron', caracteristicas: 'leitura de jogo e saída de bola', sonho: 'jogar na Europa', r2data: '2026-10-25', r2hm: '19:30', prazoContato: 'ainda hoje', gerente: 'Rafael', vagas: '4', proximaTurma: 'novembro' };
const sem = "(() => { const st = document.createElement('style'); st.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}.hud,.progress{display:none!important}'; document.head.appendChild(st); return 1; })()";
const seta = k => "document.dispatchEvent(new KeyboardEvent('keydown', { key: '" + k + "', bubbles: true, cancelable: true })); 1";
try {
  for (const plano of PLANOS) {
    const ficha = Object.assign({}, base, { plano: NOMES[plano] }, { versao: 'r2a-' + PAGINA });
    const r = await admin.post('/api/atletas', { ficha });
    if (r.status !== 201) throw new Error('lead: ' + r.status + ' ' + r.texto);
    await admin.put('/api/foto?t=' + r.j.t, { retrato: b64(path.join(fotos, 'retrato-b.jpg')), avatar: b64(path.join(fotos, 'avatar-b.jpg')), autorizo: true });
    const g = await admin.post('/api/link?t=' + r.j.t + '&acao=gerar', {});
    if (g.status !== 200) throw new Error('gerar link: ' + g.status + ' ' + g.texto);
    const caminho = PAGINA === 'principal' ? '/' : '/variacoes/' + PAGINA + '/';
    const c = await abreChrome({ largura: 1920, altura: 1080 });
    try {
      for (const n of SLIDES) {
        await c.vai('about:blank');
        await c.vai(s.decks['r2-anterior'] + caminho + '?a=' + r.j.t + '#' + n);
        await c.ate("document.querySelectorAll('#stage > .slide.active').length === 1", 10000);
        await c.avalia(sem);
        await espera(900);
        await c.foto(path.join(SAIDA, PAGINA + '-' + plano + '-' + n + '.png'));
      }
      // o 29 avanço por avanço: do 28 uma seta (avanço 0) e mais uma seta por avanço
      if (plano === 'legacy') {
        await c.vai('about:blank');
        await c.vai(s.decks['r2-anterior'] + caminho + '?a=' + r.j.t + '#28');
        await c.ate("document.querySelectorAll('#stage > .slide.active').length === 1", 10000);
        await c.avalia(sem);
        await espera(600);
        await c.avalia(seta('ArrowRight'));
        const total = await c.avalia("document.querySelectorAll('#planos [data-step]').length ? Math.max(...[...document.querySelectorAll('#planos [data-step]')].filter(e => !e.closest('[data-if]:not(.on), [data-ifnot].off')).map(e => +e.dataset.step)) : 0");
        for (let k = 0; k <= total; k++) {
          if (k) await c.avalia(seta('ArrowRight'));
          await espera(500);
          await c.foto(path.join(SAIDA, PAGINA + '-legacy-29-avanco-' + k + '.png'));
        }
      }
      const exc = c.console_.filter(m => /EXC/.test(m));
      if (exc.length) console.log(plano + ': ' + exc.slice(0, 3).join(' | '));
    } finally { await c.fecha(); }
    console.log('ok', PAGINA, plano);
  }
} finally {
  await s.fecha();
  fs.rmSync(fotos, { recursive: true, force: true });
}
