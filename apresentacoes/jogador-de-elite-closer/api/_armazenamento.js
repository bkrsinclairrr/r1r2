// Armazenamento do Painel do Closer: o único lugar que fala com o Blob ou com o disco. Nenhuma rota importa @vercel/blob.
// Dois drivers, a mesma interface:
//   blob (padrão, produção): Vercel Blob privado, com o BLOB_READ_WRITE_TOKEN da loja deste painel (nunca a do painel no ar).
//   arquivo (ARMAZENAMENTO=arquivo, testes e desenvolvimento): a pasta ARMAZENAMENTO_DIR faz o papel da loja. ETag igual
//     ao sha1 do conteúdo, gravação atômica (arquivo temporário e rename) e uma trava por caminho, que emula o ifMatch do
//     Blob quando várias requisições chegam ao mesmo tempo no mesmo processo Node.
// le(c) -> { dados, etag } | null              grava(c, dados, { etag, novo })   (etag: só se não mudou; novo: só se não existe)
// mudaJson(c, vazio, muda)                     lê, muda e grava com versão, repetindo se outra gravação chegou antes
// gravaBin(c, buffer, { tipo, novo })          leBin(c, { range }) -> { fluxo, tamanho, parte, total } | null
// apaga([caminhos])   lista(prefixo) -> [{ caminho, tamanho, enviadoEm }]   copia(de, para, tipo)
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';

export const DRIVER = String(process.env.ARMAZENAMENTO || '').trim().toLowerCase() === 'arquivo' ? 'arquivo' : 'blob';
const espera = ms => new Promise(r => setTimeout(r, ms));

// gravação recusada porque o arquivo mudou (etag) ou já existe (novo): quem chamou lê de novo e repete
export class Conflito extends Error {
  constructor(msg) { super(msg || 'precondition failed'); this.name = 'Conflito'; }
}
export const conflito = e => e instanceof Conflito || !!(e && (e.name === 'BlobPreconditionFailedError' || /already exists|precondition/i.test(String(e.message))));

// todo caminho é montado pelas rotas a partir de código e login conferidos; aqui só confere de novo (nada de .. nem barra no começo)
const CAMINHO_OK = /^[a-z0-9][a-z0-9._-]*(\/[a-z0-9][a-z0-9._-]*)*\/?$/;
function confere(c, pasta) {
  const s = String(c || '');
  if (!s || s.length > 300 || !CAMINHO_OK.test(s) || s.split('/').some(p => p === '.' || p === '..')) throw new Error('Caminho inválido no armazenamento.');
  if (!pasta && s.endsWith('/')) throw new Error('Caminho inválido no armazenamento.');
  return s;
}

/* =============================== driver arquivo =============================== */
const RAIZ = path.resolve(process.env.ARMAZENAMENTO_DIR || 'dados-teste');
const local = c => path.join(RAIZ, ...confere(c).split('/'));
const etagDe = buf => '"' + crypto.createHash('sha1').update(buf).digest('hex') + '"';

// uma fila por caminho: quem chega depois espera quem chegou antes terminar (leitura e gravação do mesmo arquivo)
const travas = new Map();
async function comTrava(c, fn) {
  const antes = travas.get(c) || Promise.resolve();
  let solta;
  const minha = new Promise(r => { solta = r; });
  const fila = antes.then(() => minha);
  travas.set(c, fila);
  await antes;
  try { return await fn(); } finally {
    solta();
    if (travas.get(c) === fila) travas.delete(c);
  }
}
// grava num temporário e troca de nome: quem lê nunca vê o arquivo pela metade. No Windows o rename falha se alguém
// está lendo naquele instante (EPERM, EBUSY): tenta de novo
async function escreveAtomico(p, buf) {
  await fsp.mkdir(path.dirname(p), { recursive: true });
  const tmp = p + '.' + crypto.randomBytes(6).toString('hex') + '.tmp';
  await fsp.writeFile(tmp, buf);
  for (let i = 0; ; i++) {
    try { await fsp.rename(tmp, p); return; } catch (e) {
      if (i >= 20 || !['EPERM', 'EBUSY', 'EACCES'].includes(e.code)) { try { await fsp.unlink(tmp); } catch { /* nada */ } throw e; }
      await espera(15 + i * 10);
    }
  }
}
const leArquivo = async p => { try { return await fsp.readFile(p); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } };

const arquivo = {
  async le(c) {
    return comTrava(c, async () => {
      const buf = await leArquivo(local(c));
      return buf ? { dados: JSON.parse(buf.toString('utf8')), etag: etagDe(buf) } : null;
    });
  },
  async grava(c, dados, { etag, novo } = {}) {
    const buf = Buffer.from(JSON.stringify(dados));
    return comTrava(c, async () => {
      const p = local(c), atual = await leArquivo(p);
      if (etag && (!atual || etagDe(atual) !== etag)) throw new Conflito();
      if (!etag && novo && atual) throw new Conflito('already exists');
      await escreveAtomico(p, buf);
      return { etag: etagDe(buf) };
    });
  },
  async gravaBin(c, buf, { novo } = {}) {
    return comTrava(c, async () => {
      const p = local(c);
      if (novo && (await leArquivo(p))) throw new Conflito('already exists');
      await escreveAtomico(p, buf);
      return { etag: etagDe(buf) };
    });
  },
  async leBin(c, { range } = {}) {
    const p = local(c);
    let st;
    try { st = await fsp.stat(p); } catch (e) { if (e.code === 'ENOENT') return null; throw e; }
    const total = st.size;
    const m = /^bytes=(\d*)-(\d*)$/.exec(String(range || ''));
    if (m && (m[1] || m[2]) && total > 0) {
      let ini = m[1] ? parseInt(m[1], 10) : Math.max(0, total - parseInt(m[2], 10));
      let fim = m[1] && m[2] ? Math.min(parseInt(m[2], 10), total - 1) : total - 1;
      if (ini <= fim && ini < total) {
        return { fluxo: fs.createReadStream(p, { start: ini, end: fim }), tamanho: fim - ini + 1, parte: 'bytes ' + ini + '-' + fim + '/' + total, total };
      }
    }
    return { fluxo: fs.createReadStream(p), tamanho: total, parte: '', total };
  },
  async apaga(lista) {
    for (const c of lista) await comTrava(c, async () => { try { await fsp.unlink(local(c)); } catch (e) { if (e.code !== 'ENOENT') throw e; } });
  },
  async lista(prefixo) {
    const pre = confere(prefixo, true);
    const base = pre.endsWith('/') ? pre : pre.slice(0, pre.lastIndexOf('/') + 1);
    const out = [];
    async function anda(rel) {
      let itens;
      try { itens = await fsp.readdir(path.join(RAIZ, ...rel.split('/').filter(Boolean)), { withFileTypes: true }); } catch (e) { if (e.code === 'ENOENT') return; throw e; }
      for (const it of itens) {
        const r = rel + it.name;
        if (it.isDirectory()) await anda(r + '/');
        else if (!it.name.endsWith('.tmp') && r.startsWith(pre)) {
          const st = await fsp.stat(path.join(RAIZ, ...r.split('/')));
          out.push({ caminho: r, tamanho: st.size, enviadoEm: st.mtime.toISOString() });
        }
      }
    }
    await anda(base);
    return out;
  },
  async copia(de, para) {
    const buf = await leArquivo(local(de));
    if (!buf) throw new Error('Arquivo de origem não existe.');
    return this.gravaBin(para, buf, { novo: true });
  }
};

/* =============================== driver blob =============================== */
let sdk = null;
const B = async () => sdk || (sdk = await import('@vercel/blob'));
const ACESSO = 'private';

const blob = {
  async le(c) {
    const { get } = await B();
    const r = await get(confere(c), { access: ACESSO, useCache: false });
    if (!r || r.statusCode !== 200 || !r.stream) return null;
    // resposta comprimida vem com ETag fraco (W/"..."); o ifMatch do put só aceita o forte, que tem o mesmo valor
    return { dados: JSON.parse(await new Response(r.stream).text()), etag: String(r.blob.etag || '').replace(/^W\//, '') };
  },
  async grava(c, dados, { etag, novo } = {}) {
    const { put } = await B();
    const op = { access: ACESSO, addRandomSuffix: false, contentType: 'application/json', cacheControlMaxAge: 60 };
    if (etag) op.ifMatch = etag; else if (!novo) op.allowOverwrite = true;
    const r = await put(confere(c), JSON.stringify(dados), op);
    return { etag: r.etag };
  },
  async gravaBin(c, buf, { tipo, novo } = {}) {
    const { put } = await B();
    const r = await put(confere(c), buf, { access: ACESSO, addRandomSuffix: false, contentType: tipo || 'application/octet-stream', cacheControlMaxAge: 3600, allowOverwrite: !novo });
    return { etag: r.etag };
  },
  async leBin(c, { range } = {}) {
    const { get } = await B();
    const pedido = /^bytes=\d*-\d*$/.test(String(range || '')) ? String(range) : '';
    const r = await get(confere(c), { access: ACESSO, headers: pedido ? { range: pedido } : undefined });
    if (!r || !r.stream) return null;
    const parte = r.headers.get('content-range') || '';
    const tamanho = Number(r.headers.get('content-length')) || (r.blob && r.blob.size) || 0;
    return { fluxo: Readable.fromWeb(r.stream), tamanho, parte, total: parte ? Number(parte.split('/')[1]) || 0 : tamanho };
  },
  async apaga(lista) {
    const { del } = await B();
    const cs = lista.map(c => confere(c));
    for (let i = 0; i < cs.length; i += 500) await del(cs.slice(i, i + 500));
  },
  async lista(prefixo) {
    const { list } = await B();
    const out = [];
    let cursor;
    do {
      const pag = await list({ prefix: confere(prefixo, true), cursor, limit: 1000 });
      for (const b of pag.blobs) out.push({ caminho: b.pathname, tamanho: b.size, enviadoEm: new Date(b.uploadedAt).toISOString() });
      cursor = pag.hasMore ? pag.cursor : undefined;
    } while (cursor);
    return out;
  },
  async copia(de, para, tipo) {
    const { copy } = await B();
    const r = await copy(confere(de), confere(para), { access: ACESSO, addRandomSuffix: false, contentType: tipo || undefined, cacheControlMaxAge: 3600 });
    return { etag: r.etag };
  }
};

const D = DRIVER === 'arquivo' ? arquivo : blob;
export const le = c => D.le(c);
export const grava = (c, dados, op) => D.grava(c, dados, op);
export const gravaBin = (c, buf, op) => D.gravaBin(c, buf, op);
export const leBin = (c, op) => D.leBin(c, op);
export const apaga = async lista => { const l = (Array.isArray(lista) ? lista : [lista]).filter(Boolean); if (l.length) await D.apaga(l); };
export const lista = prefixo => D.lista(prefixo);
export const copia = (de, para, tipo) => D.copia(de, para, tipo);
// apaga tudo o que começa com o prefixo (as fotos ou o vídeo de um atleta): devolve quantos arquivos saíram
export async function apagaPasta(prefixo) {
  const itens = await lista(prefixo);
  await apaga(itens.map(i => i.caminho));
  return itens.length;
}

// lê, muda e grava com a versão lida (ifMatch). Se outra gravação chegou no meio, lê de novo e repete: ninguém perde edição.
// vazio: o que usar quando o arquivo não existe (função), ou null pra não criar (devolve null).
// muda(dados, existia) altera dados; devolve false pra não gravar nada, ou um valor pra a função devolver no lugar dos dados.
export async function mudaJson(c, vazio, muda, { tentativas = 14 } = {}) {
  for (let i = 0; i < tentativas; i++) {
    const atual = await le(c);
    if (!atual && vazio === null) return null;
    const dados = atual ? atual.dados : vazio();
    const volta = await muda(dados, !!atual);
    if (volta === false) return dados;
    try {
      await grava(c, dados, atual ? { etag: atual.etag } : { novo: true });
      return volta === undefined ? dados : volta;
    } catch (e) {
      if (!conflito(e)) throw e;
      await espera(20 + Math.random() * 60 * (i + 1));
    }
  }
  throw new Error('Muita gente salvando ao mesmo tempo. Tente de novo.');
}
