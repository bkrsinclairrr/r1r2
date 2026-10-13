// Um deck de mentira que o teste controla, pros testes da sincronização. Por padrão espelha a pasta do R2 novo como ela está (o
// variacoes.json e as páginas de verdade); por cima disso o teste troca a resposta de qualquer caminho (status, corpo, atraso, conexão
// derrubada, redirecionamento) e conta o que o painel pediu.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { RAIZ_DECK } from './servidor.mjs';

export const sha1 = b => crypto.createHash('sha1').update(b).digest('hex');
const clone = o => JSON.parse(JSON.stringify(o));
export const manifestoReal = () => JSON.parse(fs.readFileSync(path.join(RAIZ_DECK, 'variacoes.json'), 'utf8'));

// o HTML de uma página de mentira: o motor do deck (assets/deck.js) e N slides
export function htmlDe(slides, { motor = true, antes = '' } = {}) {
  return '<!doctype html><html><head><meta charset="utf-8"><title>pagina de teste</title></head><body>' + antes +
    Array.from({ length: slides }, (_, i) => '<section class="slide">' + (i + 1) + '</section>').join('') + (motor ? '<script src="assets/deck.js"></script>' : '') + '</body></html>';
}
// uma página nova do deck: o HTML e a entrada dela no variacoes.json (com o hash do HTML)
export function paginaFalsa(id, slides, extra = {}) {
  const html = htmlDe(slides);
  const entrada = Object.assign({
    id, caminho: id === 'principal' ? '/' : '/variacoes/' + id + '/', nome: 'Página ' + id, resumo: 'Resumo da página ' + id + '.', quando: 'Quando usar a página ' + id + '.',
    validacao: 'nao-validada', lead: { nome: true, foto: true }, slides, opcionais: [], hash: sha1(html)
  }, extra);
  return { id, html, entrada, caminho: entrada.caminho };
}

export async function sobeDeck() {
  const regras = new Map(), pedidos = [], timers = new Set();
  let global = {}; // { derruba, atraso }: vale pra qualquer caminho
  const espelha = (pathname, res) => {
    let rel;
    try { rel = decodeURIComponent(pathname).replace(/^\/+/, ''); } catch { res.statusCode = 400; return res.end('ruim'); }
    if (!rel || rel.endsWith('/')) rel += 'index.html';
    const p = path.join(RAIZ_DECK, ...rel.split('/'));
    if (!p.startsWith(RAIZ_DECK + path.sep) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.statusCode = 404; return res.end('Não encontrado.'); }
    res.setHeader('Content-Type', p.endsWith('.json') ? 'application/json; charset=utf-8' : p.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8');
    res.end(fs.readFileSync(p));
  };
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    pedidos.push(u.pathname);
    const r = regras.get(u.pathname);
    const entrega = () => {
      if (global.derruba || (r && r.derruba)) return req.socket.destroy();
      if (!r) return espelha(u.pathname, res);
      res.statusCode = r.status || 200;
      if (r.local) res.setHeader('Location', r.local);
      res.setHeader('Content-Type', r.tipo || 'text/html; charset=utf-8');
      const corpo = r.corpo == null ? '' : r.corpo;
      if (r.picotado) { res.write(corpo.subarray(0, 1024)); return res.end(corpo.subarray(1024)); } // sem Content-Length
      res.end(corpo);
    };
    const atraso = (r && r.atraso) || global.atraso || 0;
    if (atraso) { const t = setTimeout(() => { timers.delete(t); entrega(); }, atraso); timers.add(t); } else entrega();
  });
  await new Promise((ok, erro) => { srv.once('error', erro); srv.listen(0, '127.0.0.1', ok); });
  const url = 'http://127.0.0.1:' + srv.address().port;
  const deck = {
    url,
    pedidos: () => pedidos.slice(),
    zera: () => { pedidos.length = 0; },
    conta: caminho => pedidos.filter(p => p === caminho).length,
    poe: (caminho, regra) => { regras.set(caminho, regra); },
    tira: caminho => { regras.delete(caminho); },
    global: g => { global = g || {}; },
    // publica o variacoes.json: o de verdade, mais as páginas dadas (menos as de "tira"), e o patch de campos por id ("muda")
    publica: (extras = [], { tira = [], muda = {} } = {}) => {
      const m = clone(manifestoReal());
      m.gerado = new Date().toISOString();
      m.paginas = m.paginas.filter(p => !tira.includes(p.id)).map(p => Object.assign(p, muda[p.id] || {})).concat(extras.map(e => clone(e.entrada || e)));
      deck.poe('/variacoes.json', { corpo: JSON.stringify(m), tipo: 'application/json' });
      return m;
    },
    fecha: async () => {
      timers.forEach(t => clearTimeout(t));
      await new Promise(r => { srv.close(r); srv.closeAllConnections && srv.closeAllConnections(); });
    }
  };
  return deck;
}

// um servidor que só conta o que chega (pra provar que o painel não segue um redirecionamento pra outro endereço)
export async function sobeAlvo() {
  const pedidos = [];
  const srv = http.createServer((req, res) => { pedidos.push(req.url); res.end('alvo'); });
  await new Promise((ok, erro) => { srv.once('error', erro); srv.listen(0, '127.0.0.1', ok); });
  return { url: 'http://127.0.0.1:' + srv.address().port, pedidos, fecha: () => new Promise(r => { srv.close(r); srv.closeAllConnections && srv.closeAllConnections(); }) };
}
