// Screenshots do R2 novo (1920 x 1080) com o atleta vindo do painel de teste: foto, sem foto, foto que dá 404, nome curto,
// nome longo, apelido, os três planos, ficha vazia e link vencido. Uma execução do Chrome por vez, telas numa pasta.
// Uso: node testes/telas-deck.mjs <pasta-de-saida> [padrao|tecnica] [cenario...]
//   cenários: legacy-foto, pro-foto, scouting-foto, legacy-sem-foto, foto-404, nome-longo, apelido, vazia, vencido, cor
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZ_DECK } from './servidor.mjs';
import { Cliente, fotosDeTeste, b64, espera } from './_util.mjs';

const { abreChrome } = await import('./_cdp.mjs');
const SAIDA = path.resolve(process.argv[2] || 'telas');
const VARIANTE = process.argv[3] || 'padrao';
const PEDIDOS = process.argv.slice(4);
fs.mkdirSync(SAIDA, { recursive: true });
const SLIDES = [1, 2, 9, 10, 11, 12, 13, 14, 21, 22, 23, 24, 25, 30, 32, 33]; // numeração de 33 slides (os seis do bloco da página institucional: 10, 13, 14, 22, 23 e 24)

const s = await sobe({ deck: true });
const fotos = fotosDeTeste(RAIZ_DECK);
const F = n => path.join(fotos, n);
const admin = new Cliente(s.painel);
await admin.entra(s.adminLogin, s.adminSenha);
const base = { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', idade: '15', cidade: 'Natal', pe: 'Destro', altura: '178', origem: 'Zyron', caracteristicas: 'leitura de jogo e saída de bola', sonho: 'jogar na Europa', r2data: '2026-10-15', r2hm: '19:30', prazoContato: 'ainda hoje', prazoZyron: 'no dia seguinte', gerente: 'Rafael' };
async function atleta(ficha, foto) {
  const r = await admin.post('/api/atletas', { ficha });
  if (foto) await admin.put('/api/foto?t=' + r.j.t, { retrato: b64(F('retrato-' + foto + '.jpg')), avatar: b64(F('avatar-' + foto + '.jpg')), autorizo: true });
  return r.j.t;
}
const CENARIOS = {
  'legacy-foto': async () => atleta(Object.assign({}, base, { plano: 'Assessoria de Elite Legacy', vagas: '4', proximaTurma: 'novembro' }), 'b'),
  'pro-foto': async () => atleta(Object.assign({}, base, { plano: 'Assessoria PRO' }), 'a'),
  'scouting-foto': async () => atleta(Object.assign({}, base, { plano: 'Scouting' }), 'a'),
  'legacy-sem-foto': async () => atleta(Object.assign({}, base, { plano: 'Assessoria de Elite Legacy', vagas: '4' }), ''),
  'foto-404': async () => { const t = await atleta(Object.assign({}, base, { plano: 'Assessoria de Elite Legacy', vagas: '4' }), 'a'); fs.rmSync(path.join(s.dados, 'fotos', t), { recursive: true, force: true }); return t; },
  'nome-longo': async () => atleta(Object.assign({}, base, { nome: 'Maximiliano Bartolomeu dos Santos Albuquerque Figueiredo', plano: 'Assessoria de Elite Legacy', vagas: '2' }), 'b'),
  'sobrenome': async () => atleta(Object.assign({}, base, { nome: 'Maximiliano Albuquerque', apelido: 'Maximiliano Albuquerque', plano: 'Assessoria de Elite Legacy', vagas: '2' }), 'b'),
  'apelido': async () => atleta(Object.assign({}, base, { nome: 'João Vitor Pereira Lima', apelido: 'Joãozinho', plano: 'Assessoria PRO' }), 'b'),
  'vazia': async () => atleta({ nome: 'Al' }, ''),
  'vencido': async () => { const t = await atleta(Object.assign({}, base, { plano: 'Scouting' }), 'a'); const a = path.join(s.dados, 'atletas', t + '.json'); const d = JSON.parse(fs.readFileSync(a, 'utf8')); d.venceEm = new Date(Date.now() - 1000).toISOString(); fs.writeFileSync(a, JSON.stringify(d)); return t; },
  'cor': async () => atleta(Object.assign({}, base, { plano: 'Assessoria de Elite Legacy', vagas: '4' }), 'b')
};
const lista = PEDIDOS.length ? PEDIDOS : Object.keys(CENARIOS);
const rel = VARIANTE === 'tecnica' ? 'variacoes/tecnica/' : '';
try {
  for (const nome of lista) {
    const t = await CENARIOS[nome]();
    const c = await abreChrome({ largura: 1920, altura: 1080 });
    try {
      const so = nome === 'vencido' ? [1] : SLIDES;
      for (const n of so) {
        await c.vai('about:blank');
        await c.vai(s.deck + '/' + rel + '?a=' + t + '#' + n);
        await c.ate("document.querySelectorAll('#stage > .slide.active').length === 1 || document.querySelector('#je-inativo')", 10000);
        if (nome === 'cor') await c.avalia("document.documentElement.classList.add('foto-cor'); 1");
        await c.avalia("(() => { const st = document.createElement('style'); st.textContent = '*{animation:none!important;transition:none!important}.hud,.progress{display:none!important}'; document.head.appendChild(st); return 1; })()");
        await espera(nome === 'foto-404' ? 1800 : 1300);
        await c.foto(path.join(SAIDA, VARIANTE + '-' + nome + '-' + String(n).padStart(2, '0') + '.png'));
      }
      const exc = c.console_.filter(m => /EXC/.test(m));
      if (exc.length) console.log(nome + ': ' + exc.slice(0, 3).join(' | '));
    } finally { await c.fecha(); }
    console.log('ok', VARIANTE, nome);
  }
} finally {
  await s.fecha();
  fs.rmSync(fotos, { recursive: true, force: true });
}
