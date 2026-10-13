// Gera o PDF do processo da R2 a partir do index.html, com o Chrome instalado.
// Uso, na raiz do repo: node processo-r2/gerar-pdf.mjs [saida.pdf] [--png pasta]
// Padrão: distribuir/processo-de-venda-r2.pdf. Antes de salvar, confere se as
// fontes da marca carregaram e avisa se algum texto passou da margem direita
// ou invadiu o rodapé. Com --png, salva também um PNG de 1920×1080 por slide.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync, mkdtempSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const pasta = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const iPng = args.indexOf('--png');
const pastaPng = iPng >= 0 ? path.resolve(args[iPng + 1]) : null;
const saida = path.resolve(args.find((a, i) => !a.startsWith('--') && i !== iPng + 1) || path.join(pasta, '..', 'distribuir', 'processo-de-venda-r2.pdf'));

// O perfil do Chrome precisa de caminho absoluto: com caminho relativo a
// porta de depuração não abre.
const perfil = mkdtempSync(path.join(os.tmpdir(), 'processo-r2-'));
const porta = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${porta}`, `--user-data-dir=${perfil}`,
  '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-gpu',
  '--force-color-profile=srgb', 'about:blank',
], { stdio: 'ignore' });

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function conecta() {
  for (let i = 0; i < 150; i++) {
    try {
      const alvos = await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json();
      return alvos.find((a) => a.type === 'page').webSocketDebuggerUrl;
    } catch { await espera(100); }
  }
  throw new Error(`o Chrome não abriu a porta ${porta} (confira o caminho em CHROME)`);
}

try {
  const ws = new WebSocket(await conecta());
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let seq = 0;
  const pendentes = new Map();
  const eventos = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pendentes.has(m.id)) {
      const { ok, erro } = pendentes.get(m.id);
      pendentes.delete(m.id);
      m.error ? erro(new Error(JSON.stringify(m.error))) : ok(m.result);
    } else if (m.method) eventos.forEach((f) => f(m));
  });
  const envia = (method, params = {}) => new Promise((ok, erro) => {
    const id = ++seq;
    pendentes.set(id, { ok, erro });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const avalia = async (expression) => {
    const r = await envia('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };

  await envia('Page.enable');
  await envia('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  const carregou = new Promise((r) => eventos.push((m) => { if (m.method === 'Page.loadEventFired') r(); }));
  await envia('Page.navigate', { url: pathToFileURL(path.join(pasta, 'index.html')).href + '?raw' });
  await carregou;
  await avalia('document.fonts.ready.then(() => true)');
  await espera(300);

  const faltando = await avalia(`['800 100px "Saira Condensed"', '600 30px "Barlow Condensed"', '400 30px "Archivo"', '600 30px "Archivo"']
    .filter((f) => !document.fonts.check(f))`);
  if (faltando.length) throw new Error('fontes não carregaram: ' + faltando.join(', '));

  const avisos = await avalia(`(() => {
    const out = [];
    document.querySelectorAll('.slide').forEach((s, i) => {
      const sr = s.getBoundingClientRect();
      const n = String(i + 1).padStart(2, '0');
      const temRodape = !!s.querySelector('.foot');
      s.querySelectorAll('*').forEach((el) => {
        if (el.closest('.fill, .tape, .foot, svg') || el.classList.contains('giant')) return;
        if (![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) return;
        const range = document.createRange();
        range.selectNodeContents(el);
        const linhas = [...range.getClientRects()];
        if (!linhas.length) return;
        const direita = Math.max(...linhas.map((q) => q.right)) - sr.left;
        const baixo = Math.max(...linhas.map((q) => q.bottom)) - sr.top;
        const trecho = '"' + el.textContent.trim().slice(0, 40) + '"';
        if (direita > 1800) out.push(n + ': passa da margem direita (' + Math.round(direita) + 'px) ' + trecho);
        if (temRodape && baixo > 985) out.push(n + ': invade o rodapé (y=' + Math.round(baixo) + ') ' + trecho);
      });
    });
    return out;
  })()`);
  avisos.forEach((a) => console.warn('aviso, slide ' + a));

  const total = await avalia('document.querySelectorAll(".slide").length');
  if (pastaPng) {
    mkdirSync(pastaPng, { recursive: true });
    for (let i = 0; i < total; i++) {
      const foto = await envia('Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y: i * 1080, width: 1920, height: 1080, scale: 1 },
      });
      writeFileSync(path.join(pastaPng, `slide-${String(i + 1).padStart(2, '0')}.png`), Buffer.from(foto.data, 'base64'));
    }
  }

  const pdf = await envia('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
  mkdirSync(path.dirname(saida), { recursive: true });
  writeFileSync(saida, Buffer.from(pdf.data, 'base64'));
  console.log(`${total} slides -> ${saida}${pastaPng ? ` (PNGs em ${pastaPng})` : ''}${avisos.length ? `, ${avisos.length} aviso(s)` : ', sem avisos'}`);
  ws.close();
} finally {
  chrome.kill();
  await espera(500);
  try { rmSync(perfil, { recursive: true, force: true }); } catch { /* o Chrome às vezes segura arquivos por alguns ms */ }
}
