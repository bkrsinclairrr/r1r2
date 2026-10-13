// Servidor de teste do Painel do Closer, imitando a Vercel, e (opcional) os decks ao lado, todos em 127.0.0.1.
// - Painel: as rotas de api/ (req.query, req.body como os helpers da Vercel: JSON, texto e octet-stream; limite de 4,5 MB
//   no corpo), os rewrites do vercel.json (o /api/publico dos decks de antes vai pra /api/r2) e os arquivos estáticos, com os
//   cabeçalhos do vercel.json. O frame-src da CSP aponta pros decks locais.
// - Decks: a pasta de cada um (R2 novo, R2 anterior, R2 B e R1), cada um num servidor próprio. O assets/deck.js sai com os endereços de
//   produção trocados pelos locais (o do painel, os dos outros decks e o do painel de antes, que é um de mentira: s.painelAntigo), só
//   na resposta: o arquivo não muda. O R2 novo sobe com deck: true; os outros, pelo nome em decks: ['r2-anterior', 'r2-b', 'r1'].
//   O painel de antes de mentira responde só ao que o teste pôs em s.painelAntigo.leads e anota os pedidos em s.painelAntigo.pedidos.
// - Armazenamento: sempre o driver de arquivo, numa pasta temporária (ou --dados). Nunca toca em loja de Blob.
// - Sem PAINEL_SEGREDO no ambiente, gera segredo e admin de teste na hora (a senha volta no objeto e, na linha de
//   comando, aparece no console). Não lê .env.local: pra usar o do painel, rode com node --env-file=.env.local.
// - Quais decks o painel conhece neste teste: só os que sobem aqui (DECKS_ATIVOS), cada um com o endereço local (DECKS_ORIGENS). Sem
//   pedir decks, só o R2 novo (como era antes do R1 entrar no painel).
// Uso em teste:  const s = await sobe({ deck: true, decks: ['r1'] }); ... await s.fecha();
// Linha de comando:  node testes/servidor.mjs [--porta 4310] [--deck-porta 4320] [--dados <pasta>] [--sem-deck] [--todos-os-decks]
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { PassThrough } from 'node:stream';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
export const RAIZ_PAINEL = path.resolve(AQUI, '..');
export const RAIZ_DECK = path.resolve(process.env.DECK_PASTA || path.join(RAIZ_PAINEL, '..', 'jogador-de-elite-r2-novo'));
// a pasta de cada deck (as variáveis DECK_PASTA_<ID> trocam, como DECK_PASTA troca a do R2 novo)
export const RAIZES = {
  r2: RAIZ_DECK,
  'r2-anterior': path.resolve(process.env.DECK_PASTA_R2_ANTERIOR || path.join(RAIZ_PAINEL, '..', 'jogador-de-elite-r2')),
  'r2-b': path.resolve(process.env.DECK_PASTA_R2_B || path.join(RAIZ_PAINEL, '..', 'jogador-de-elite-r2-b')),
  r1: path.resolve(process.env.DECK_PASTA_R1 || path.join(RAIZ_PAINEL, '..', 'jogador-de-elite-r1'))
};
// os endereços de produção que o assets/deck.js de cada deck pode ter: o painel (o novo e o de antes) e os decks
const PAINEL_NO_AR = 'https://jogador-de-elite-closer.vercel.app';
const PAINEL_DE_ANTES = 'https://jogador-de-elite-painel.vercel.app';
const DECK_NO_AR = {
  r2: 'https://jogador-de-elite-r2-novo.vercel.app', 'r2-anterior': 'https://jogador-de-elite-r2.vercel.app',
  'r2-b': 'https://jogador-de-elite-r2-b.vercel.app', r1: 'https://jogador-de-elite-r1.vercel.app'
};
const LIMITE_CORPO = 4.5 * 1024 * 1024; // o limite de corpo das funções da Vercel
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8'
};

function hashSenha(senha) {
  const sal = crypto.randomBytes(16);
  return 'scrypt$' + sal.toString('hex') + '$' + crypto.scryptSync(String(senha), sal, 64).toString('hex');
}
const escuta = (srv, porta) => new Promise((ok, erro) => { srv.once('error', erro); srv.listen(porta || 0, '127.0.0.1', () => ok(srv.address().port)); });

// o corpo como os helpers da Vercel (@vercel/node): lido inteiro antes da rota, req.body preguiçoso pelo tipo, e o fluxo
// reposto pra quem ouve 'data' e 'end'
function ajudantes(req, corpoBuf, queryExtra) {
  const u = new URL(req.url, 'http://x');
  const query = {};
  u.searchParams.forEach((v, k) => { query[k] = k in query ? [].concat(query[k], v) : v; });
  req.query = query;
  const tipo = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  let feito = false, valor;
  Object.defineProperty(req, 'body', {
    configurable: true, enumerable: true,
    get() {
      if (feito) return valor;
      feito = true;
      if (req.headers['content-type'] === undefined) { valor = undefined; return valor; }
      if (tipo === 'application/json') { const s = corpoBuf.toString(); try { valor = s ? JSON.parse(s) : {}; } catch { const e = new Error('Invalid JSON'); e.statusCode = 400; throw e; } }
      else if (tipo === 'application/octet-stream') valor = corpoBuf;
      else if (tipo === 'text/plain') valor = corpoBuf.toString();
      else valor = undefined;
      return valor;
    }
  });
  const replica = new PassThrough();
  const onOriginal = req.on.bind(req);
  req.read = replica.read.bind(replica);
  req.on = req.addListener = (nome, cb) => (nome === 'data' || nome === 'end' ? replica.on(nome, cb) : onOriginal(nome, cb));
  replica.end(corpoBuf);
}

function leCorpo(req) {
  return new Promise((ok, erro) => {
    const partes = []; let n = 0, estourou = false;
    req.on('data', p => { n += p.length; if (n > LIMITE_CORPO) estourou = true; else partes.push(p); });
    req.on('end', () => ok(estourou ? null : Buffer.concat(partes)));
    req.on('error', erro);
  });
}

async function leVercelJson(raiz) {
  try { return JSON.parse(await fsp.readFile(path.join(raiz, 'vercel.json'), 'utf8')); } catch { return {}; }
}
async function cabecalhosDoVercel(raiz, troca) {
  const cfg = await leVercelJson(raiz);
  const lista = [];
  (cfg.headers || []).forEach(h => (h.headers || []).forEach(x => lista.push([x.key, troca ? troca(x.key, x.value) : x.value])));
  return lista;
}

async function serveArquivo(res, p, req, reescreve) {
  let st;
  try { st = await fsp.stat(p); } catch { res.statusCode = 404; return res.end('Não encontrado.'); }
  if (st.isDirectory()) { p = path.join(p, 'index.html'); try { st = await fsp.stat(p); } catch { res.statusCode = 404; return res.end('Não encontrado.'); } }
  res.setHeader('Content-Type', MIME[path.extname(p).toLowerCase()] || 'application/octet-stream');
  if (reescreve) {
    const txt = reescreve(p, await fsp.readFile(p));
    if (txt != null) { res.setHeader('Content-Length', Buffer.byteLength(txt)); return res.end(txt); }
  }
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || ''));
  res.setHeader('Accept-Ranges', 'bytes');
  if (m && (m[1] || m[2])) {
    const ini = m[1] ? parseInt(m[1], 10) : Math.max(0, st.size - parseInt(m[2], 10));
    const fim = m[1] && m[2] ? Math.min(parseInt(m[2], 10), st.size - 1) : st.size - 1;
    if (ini <= fim) {
      res.statusCode = 206;
      res.setHeader('Content-Range', 'bytes ' + ini + '-' + fim + '/' + st.size);
      res.setHeader('Content-Length', fim - ini + 1);
      return fs.createReadStream(p, { start: ini, end: fim }).pipe(res);
    }
  }
  res.setHeader('Content-Length', st.size);
  fs.createReadStream(p).pipe(res);
}

// arquivo que não pode sair: segredos, a pasta de teste, dependências e as próprias rotas
const BLOQUEADO_PAINEL = rel => /(^|\/)\./.test(rel) || /^(api|testes|node_modules|dados-teste)(\/|$)/.test(rel) || /\.(md|bat|mjs)$/i.test(rel);
const BLOQUEADO_DECK = rel => /(^|\/)\./.test(rel) || /\.(md|bat)$/i.test(rel);

// o rewrite do vercel.json do painel: { source: '/api/publico', destination: '/api/r2' } vira o caminho da função (a query segue)
function reescreveRota(rewrites, pathname) {
  for (const r of rewrites || []) if (r && r.source === pathname && typeof r.destination === 'string') return r.destination;
  return pathname;
}

export async function sobe({ porta = 0, deckPorta = 0, dados = '', deck = true, deckExterno = '', decks = [], decksExternos = {}, log = false } = {}) {
  // a pasta dos dados: --dados, ou ARMAZENAMENTO_DIR do ambiente (o .env.local de desenvolvimento), ou uma temporária
  const fixa = dados || process.env.ARMAZENAMENTO_DIR || '';
  const pasta = fixa ? path.resolve(RAIZ_PAINEL, fixa) : fs.mkdtempSync(path.join(os.tmpdir(), 'closer-dados-'));
  const temp = !fixa;
  const srvPainel = http.createServer(), srvDeck = deck ? http.createServer() : null;
  const pPainel = await escuta(srvPainel, porta);
  const pDeck = srvDeck ? await escuta(srvDeck, deckPorta) : 0;
  const painelUrl = 'http://127.0.0.1:' + pPainel, deckUrl = srvDeck ? 'http://127.0.0.1:' + pDeck : String(deckExterno || '').replace(/\/+$/, '');

  // o painel de antes (jogador-de-elite-painel), de mentira: o R1 e o R2 anterior perguntam a ele quando o painel novo responde 404 pra um código que
  // não é do formato dele. Só responde ao que o teste põe em leads ({ <id>: { ficha, video?, leitura? } }) e anota cada pedido em pedidos.
  const antigo = { url: '', leads: {}, pedidos: [] };
  const srvAntigo = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    antigo.pedidos.push(req.method + ' ' + u.pathname + u.search);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const id = u.searchParams.get('id') || '', lead = Object.prototype.hasOwnProperty.call(antigo.leads, id) ? antigo.leads[id] : null;
    if (u.pathname !== '/api/publico' || !lead) { res.statusCode = 404; return res.end(JSON.stringify({ erro: 'Apresentação não encontrada.' })); }
    res.end(JSON.stringify(Object.assign({ id, atualizadoEm: new Date().toISOString() }, lead)));
  });
  antigo.url = 'http://127.0.0.1:' + await escuta(srvAntigo, 0);

  // os outros decks (os de antes e o R1), cada um no seu servidor
  const outros = {};
  for (const id of decks) {
    if (!RAIZES[id] || id === 'r2') continue;
    const srv = http.createServer();
    outros[id] = { srv, url: 'http://127.0.0.1:' + await escuta(srv, 0) };
  }
  // os endereços locais de cada deck: o do R2 novo, os de cima e os externos (um deck de mentira que o teste controla)
  const origens = {};
  if (deckUrl) origens.r2 = deckUrl;
  Object.entries(outros).forEach(([id, o]) => { origens[id] = o.url; });
  Object.entries(decksExternos).forEach(([id, u]) => { origens[id] = String(u).replace(/\/+$/, ''); });

  // o ambiente antes de carregar as rotas (elas leem na carga)
  process.env.ARMAZENAMENTO = 'arquivo';
  process.env.ARMAZENAMENTO_DIR = pasta;
  let adminSenha = '';
  if (!process.env.PAINEL_SEGREDO) {
    process.env.PAINEL_SEGREDO = crypto.randomBytes(32).toString('base64url');
    process.env.PAINEL_ADMIN_LOGIN = 'admin';
    adminSenha = 'teste-' + crypto.randomBytes(9).toString('base64url');
    process.env.PAINEL_ADMIN_HASH = hashSenha(adminSenha);
  }
  if (!process.env.CRON_SECRET) process.env.CRON_SECRET = crypto.randomBytes(24).toString('base64url');
  if (deckUrl) { process.env.DECK_URL = deckUrl; process.env.DECK_ORIGINS = Object.values(origens).join(','); }
  else if (Object.keys(origens).length) process.env.DECK_ORIGINS = Object.values(origens).join(',');
  // o painel só conhece os decks que estão aqui (sem pedir mais nenhum, só o R2 novo)
  process.env.DECKS_ORIGENS = JSON.stringify(origens);
  process.env.DECKS_ATIVOS = (Object.keys(origens).length ? Object.keys(origens) : ['r2']).join(',');

  const rotas = new Map();
  const rota = async nome => {
    if (!rotas.has(nome)) rotas.set(nome, (await import(pathToFileURL(path.join(RAIZ_PAINEL, 'api', nome + '.js')).href)).default);
    return rotas.get(nome);
  };
  const frames = Object.values(origens).join(' ');
  const cabPainel = await cabecalhosDoVercel(RAIZ_PAINEL, (k, v) => (k === 'Content-Security-Policy' && frames ? v.replace(/frame-src [^;]+/, 'frame-src ' + frames) : v));
  const rewrites = (await leVercelJson(RAIZ_PAINEL)).rewrites || [];

  srvPainel.on('request', async (req, res) => {
    const u = new URL(req.url, 'http://x');
    cabPainel.forEach(([k, v]) => res.setHeader(k, v));
    try {
      const destino = reescreveRota(rewrites, u.pathname);
      const m = /^\/api\/([a-z0-9-]+)\/?$/.exec(destino);
      if (m) {
        if (m[1].startsWith('_') || !fs.existsSync(path.join(RAIZ_PAINEL, 'api', m[1] + '.js'))) { res.statusCode = 404; return res.end('NOT_FOUND'); }
        const corpoBuf = await leCorpo(req);
        if (corpoBuf === null) { res.statusCode = 413; res.setHeader('Content-Type', 'text/plain'); return res.end('Request Entity Too Large'); }
        ajudantes(req, corpoBuf);
        const h = await rota(m[1]);
        await h(req, res);
        if (log) console.log(req.method, u.pathname, res.statusCode);
        return;
      }
      let rel = decodeURIComponent(u.pathname).replace(/^\/+/, '');
      if (!rel) rel = 'index.html';
      if (BLOQUEADO_PAINEL(rel)) { res.statusCode = 404; return res.end('Não encontrado.'); }
      const p = path.join(RAIZ_PAINEL, ...rel.split('/'));
      if (!p.startsWith(RAIZ_PAINEL + path.sep)) { res.statusCode = 403; return res.end(); }
      await serveArquivo(res, p, req);
    } catch (e) {
      if (e && e.statusCode === 400) { res.statusCode = 400; return res.end('Invalid JSON'); }
      console.error('servidor de teste:', e);
      if (!res.headersSent) { res.statusCode = 500; res.end('erro no servidor de teste'); } else res.destroy();
    }
  });

  // um deck local: a pasta dele, com o deck.js trocando os endereços de produção pelos locais (só na resposta)
  const servidorDeDeck = async (srv, id) => {
    const raiz = RAIZES[id];
    const cab = await cabecalhosDoVercel(raiz, (k, v) => (k === 'Content-Security-Policy' ? v.replace(PAINEL_NO_AR, painelUrl) : v));
    const troca = txt => {
      let o = txt.split(PAINEL_NO_AR).join(painelUrl).split(PAINEL_DE_ANTES).join(antigo.url);
      Object.entries(DECK_NO_AR).forEach(([d, prod]) => { if (origens[d]) o = o.split(prod).join(origens[d]); });
      return o;
    };
    srv.on('request', async (req, res) => {
      const u = new URL(req.url, 'http://x');
      cab.forEach(([k, v]) => res.setHeader(k, v));
      let rel = decodeURIComponent(u.pathname).replace(/^\/+/, '');
      if (!rel || rel.endsWith('/')) rel += 'index.html';
      if (BLOQUEADO_DECK(rel)) { res.statusCode = 404; return res.end('Não encontrado.'); }
      const p = path.join(raiz, ...rel.split('/'));
      if (!p.startsWith(raiz + path.sep)) { res.statusCode = 403; return res.end(); }
      await serveArquivo(res, p, req, (arq, buf) => (arq.endsWith(path.join('assets', 'deck.js')) ? troca(buf.toString('utf8')) : null));
    });
  };
  if (srvDeck) await servidorDeDeck(srvDeck, 'r2');
  for (const [id, o] of Object.entries(outros)) await servidorDeDeck(o.srv, id);

  const fecha = async () => {
    const todos = [srvPainel, srvDeck, srvAntigo, ...Object.values(outros).map(o => o.srv)].filter(Boolean);
    await Promise.all(todos.map(x => new Promise(r => x.close(r))));
    todos.forEach(x => x.closeAllConnections && x.closeAllConnections());
    if (temp) { try { fs.rmSync(pasta, { recursive: true, force: true }); } catch { /* nada */ } }
  };
  return { painel: painelUrl, deck: deckUrl, decks: origens, painelAntigo: antigo, adminLogin: process.env.PAINEL_ADMIN_LOGIN || 'admin', adminSenha, dados: pasta, cronSecret: process.env.CRON_SECRET, fecha };
}

// linha de comando
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
  const s = await sobe({ porta: +arg('--porta', 4310), deckPorta: +arg('--deck-porta', 4320), dados: arg('--dados', ''), deck: !process.argv.includes('--sem-deck'),
    decks: process.argv.includes('--todos-os-decks') ? ['r2-anterior', 'r2-b', 'r1'] : [], log: true });
  console.log('Painel do Closer (teste): ' + s.painel);
  Object.entries(s.decks).forEach(([id, u]) => console.log('Deck ' + id + ' (teste): ' + u));
  console.log('Dados (driver de arquivo): ' + s.dados);
  if (s.adminSenha) console.log('Login: ' + s.adminLogin + '   Senha de teste (só desta execução): ' + s.adminSenha);
  console.log('Ctrl+C pra parar.');
  process.on('SIGINT', async () => { await s.fecha(); process.exit(0); });
}
