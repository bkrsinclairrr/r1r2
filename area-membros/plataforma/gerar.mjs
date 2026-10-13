// Tira os prints da área de membros (desktop e celular) com o Chrome instalado.
// Uso, na raiz do repo: node area-membros/plataforma/gerar.mjs [--hoje AAAA-MM-DD] [--saida pasta] [--so inicio,mapa]
// Padrão: distribuir/plataforma/desktop/NN-nome.png (1440 de largura, 2x) e distribuir/plataforma/celular/NN-nome.png (390, 3x).
// Cada print leva a altura inteira da tela (sem rolagem). Antes de salvar, confere erros de script, rolagem lateral e texto cortado.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync, mkdtempSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const pasta = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opcao = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const hoje = opcao('--hoje');
if (hoje && !/^\d{4}-\d{2}-\d{2}$/.test(hoje)) throw new Error('--hoje no formato AAAA-MM-DD');
const raizSaida = path.resolve(opcao('--saida') || path.join(pasta, '..', '..', 'distribuir', 'plataforma'));
const so = opcao('--so') ? opcao('--so').split(',') : null;

const ALTURA_CELULAR = 1180;
const DESKTOP = ['inicio', 'mapa', 'leituras', 'evolucao', 'plano', 'oportunidades', 'perfil', 'agenda', 'mensagens', 'aulas', 'atletas'];
const CELULAR = ['inicio', 'mapa', 'leituras', 'plano', 'oportunidades', 'perfil', 'mensagens'];

const perfil = mkdtempSync(path.join(os.tmpdir(), 'plataforma-'));
const porta = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${porta}`, `--user-data-dir=${perfil}`, '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--force-color-profile=srgb', 'about:blank'], { stdio: 'ignore' });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function conecta() {
  for (let i = 0; i < 150; i++) {
    try { const alvos = await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json(); return alvos.find((a) => a.type === 'page').webSocketDebuggerUrl; } catch { await espera(100); }
  }
  throw new Error(`o Chrome não abriu a porta ${porta} (confira o caminho em CHROME)`);
}

try {
  const ws = new WebSocket(await conecta());
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let seq = 0;
  const pendentes = new Map(), eventos = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pendentes.has(m.id)) { const { ok, erro } = pendentes.get(m.id); pendentes.delete(m.id); m.error ? erro(new Error(JSON.stringify(m.error))) : ok(m.result); }
    else if (m.method) eventos.forEach((f) => f(m));
  });
  const envia = (method, params = {}) => new Promise((ok, erro) => { const id = ++seq; pendentes.set(id, { ok, erro }); ws.send(JSON.stringify({ id, method, params })); });
  const avalia = async (expression) => { const r = await envia('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
  const erros = [];
  eventos.push((m) => {
    if (m.method === 'Runtime.exceptionThrown') erros.push('exceção: ' + (m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text));
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') erros.push('console.error: ' + m.params.args.map((a) => a.value || a.description).join(' '));
  });
  await envia('Page.enable'); await envia('Runtime.enable');

  const avisos = [];
  const base = pathToFileURL(path.join(pasta, 'index.html')).href;

  async function captura(rota, ordem, modo) {
    const cel = modo === 'celular', w = cel ? 390 : 1440, h0 = cel ? 844 : 900, dpr = cel ? 3 : 2;
    await envia('Emulation.setDeviceMetricsOverride', { width: w, height: h0, deviceScaleFactor: dpr, mobile: cel });
    await envia('Page.navigate', { url: 'about:blank' }); await espera(150);
    const carregou = new Promise((r) => eventos.push(function f(m) { if (m.method === 'Page.loadEventFired') { eventos.splice(eventos.indexOf(f), 1); r(); } }));
    await envia('Page.navigate', { url: base + (hoje ? `?hoje=${hoje}` : '') + '#/' + rota });
    await carregou;
    for (let i = 0; i < 100 && !(await avalia('document.body.dataset.pronto === "1"')); i++) await espera(100);
    await espera(500);
    // a altura da tela inteira: sem rolagem no miolo
    for (let i = 0; i < 4; i++) {
      const extra = await avalia('(() => { const v = document.getElementById("view"); return v.scrollHeight - v.clientHeight; })()');
      if (extra <= 0) break;
      const h = await avalia('innerHeight');
      if (cel && h >= ALTURA_CELULAR) break; // no celular o print é uma tela (um pouco mais alta que a do aparelho), não a página inteira
      await envia('Emulation.setDeviceMetricsOverride', { width: w, height: cel ? Math.min(h + extra, ALTURA_CELULAR) : h + extra, deviceScaleFactor: dpr, mobile: cel });
      await espera(700);
    }
    const rel = await avalia(`(() => {
      const out = [], v = document.getElementById('view'), r = v.getBoundingClientRect();
      if (document.documentElement.scrollWidth > innerWidth + 1) out.push('rolagem lateral: ' + document.documentElement.scrollWidth + 'px numa janela de ' + innerWidth + 'px');
      v.querySelectorAll('*').forEach((el) => {
        if (el.closest('svg, canvas, .scr, .quadro, .rolagem, .card.tab, .vlist, .conv')) return;
        const cs = getComputedStyle(el);
        if ((cs.overflow === 'hidden' || cs.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0 && ![...el.children].length) out.push('texto cortado: "' + el.textContent.trim().slice(0, 50) + '"');
        const b = el.getBoundingClientRect();
        if (b.width > 0 && b.right > r.right + 1 && !el.closest('.popup')) out.push('passa da borda direita (' + Math.round(b.right - r.right) + 'px): <' + el.tagName.toLowerCase() + ' class="' + el.className + '"> ' + el.textContent.trim().slice(0, 30));
      });
      return out.slice(0, 8);
    })()`);
    rel.forEach((a) => avisos.push(`${modo}/${rota}: ${a}`));
    const foto = await envia('Page.captureScreenshot', { format: 'png' });
    const dir = path.join(raizSaida, modo);
    mkdirSync(dir, { recursive: true });
    const arq = path.join(dir, String(ordem).padStart(2, '0') + '-' + rota + '.png');
    writeFileSync(arq, Buffer.from(foto.data, 'base64'));
    return arq;
  }

  const feitos = [];
  for (const [modo, lista] of [['desktop', DESKTOP], ['celular', CELULAR]]) {
    for (let i = 0; i < lista.length; i++) {
      if (so && !so.includes(lista[i])) continue;
      feitos.push(await captura(lista[i], i + 1, modo));
    }
  }
  if (erros.length) avisos.push(...erros.slice(0, 10));
  avisos.forEach((a) => console.warn('aviso, ' + a));
  console.log(`${feitos.length} prints -> ${raizSaida}${avisos.length ? `, ${avisos.length} aviso(s)` : ', sem avisos'}`);
  ws.close();
} finally {
  chrome.kill();
  await espera(500);
  try { rmSync(perfil, { recursive: true, force: true }); } catch { /* o Chrome às vezes segura arquivos por alguns ms */ }
}
