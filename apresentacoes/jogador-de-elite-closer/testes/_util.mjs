// Utilitários dos testes do Painel do Closer: cliente HTTP com cookie, verificação com contagem e as fotos de teste.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const AQUI = path.dirname(fileURLToPath(import.meta.url));
export const espera = ms => new Promise(r => setTimeout(r, ms));

// um navegador de mentira: guarda o cookie da sessão e manda de volta
export class Cliente {
  constructor(base) { this.base = base; this.cookie = ''; this.setCookie = ''; }
  async pede(metodo, caminho, { json, texto, corpo, tipo, origem, cabecalhos } = {}) {
    const h = Object.assign({}, cabecalhos);
    if (this.cookie) h.Cookie = this.cookie;
    if (origem) h.Origin = origem;
    let body;
    if (json !== undefined) { body = JSON.stringify(json); h['Content-Type'] = 'application/json'; }
    else if (texto !== undefined) { body = texto; h['Content-Type'] = tipo || 'text/plain;charset=UTF-8'; }
    else if (corpo !== undefined) { body = corpo; if (tipo) h['Content-Type'] = tipo; }
    const t0 = performance.now();
    const r = await fetch(this.base + caminho, { method: metodo, headers: h, body, redirect: 'manual' });
    const ms = performance.now() - t0;
    const sc = r.headers.get('set-cookie');
    if (sc) {
      this.setCookie = sc;
      const m = /^([^=]+)=([^;]*)/.exec(sc);
      if (m) this.cookie = m[2] ? m[1] + '=' + m[2] : '';
    }
    const ct = r.headers.get('content-type') || '';
    const buf = Buffer.from(await r.arrayBuffer());
    let j = null;
    if (ct.includes('application/json')) { try { j = JSON.parse(buf.toString('utf8')); } catch { j = null; } }
    return { status: r.status, j, buf, texto: buf.toString('utf8'), h: r.headers, ms };
  }
  get(c, op) { return this.pede('GET', c, op); }
  post(c, json, op) { return this.pede('POST', c, Object.assign({ json }, op)); }
  put(c, json, op) { return this.pede('PUT', c, Object.assign({ json }, op)); }
  // como o painel no navegador: toda escrita vai com corpo JSON (o servidor recusa o resto com 415)
  del(c, op) { return this.pede('DELETE', c, Object.assign({ json: {} }, op)); }
  async entra(login, senha) {
    const r = await this.post('/api/sessao', { login, senha });
    if (r.status !== 200) throw new Error('não entrou como ' + login + ': ' + r.status + ' ' + r.texto);
    return r;
  }
}

// contagem de verificações: OK / FALHA, e o código de saída no fim
export function verificador(titulo) {
  let falhas = 0, total = 0;
  const ok = (cond, txt) => { total++; console.log((cond ? 'OK    ' : 'FALHA ') + txt); if (!cond) falhas++; return !!cond; };
  const fim = () => { console.log('\n' + titulo + ': ' + (total - falhas) + ' de ' + total + ' verificações passaram.'); process.exitCode = falhas ? 1 : 0; return falhas; };
  return { ok, fim, get falhas() { return falhas; } };
}

// as fotos de teste (gera-fotos-teste.py), numa pasta temporária; devolve o caminho
export function fotosDeTeste(deckPasta) {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'closer-fotos-'));
  execFileSync('python', ['-I', path.join(AQUI, 'gera-fotos-teste.py'), deckPasta, pasta], { stdio: 'ignore' });
  return pasta;
}
export const b64 = arq => fs.readFileSync(arq).toString('base64');
