// Gera o anexo da área de membros (as seis telas de index.html) em PNG e PDF, com o Chrome instalado.
// Uso, na raiz do repo: node area-membros/gerar.mjs [--hoje AAAA-MM-DD] [--saida pasta]
// Abre o index.html com ?raw (as seis telas empilhadas em tamanho real, sem o modo de apresentação).
// Padrão: distribuir/area-de-membros/ (um PNG por tela, 2160 x 2880, pra mandar no WhatsApp)
// e distribuir/area-de-membros.pdf (as seis telas num arquivo só). As datas das telas saem do
// dia da geração; --hoje fixa outro dia. Antes de salvar, confere se as fontes da marca carregaram
// e avisa se algum conteúdo estourou a tela da plataforma ou passou da margem.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync, mkdtempSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const pasta = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opcao = (nome) => { const i = args.indexOf(nome); return i >= 0 ? args[i + 1] : null; };
const hoje = opcao('--hoje');
if (hoje && !/^\d{4}-\d{2}-\d{2}$/.test(hoje)) throw new Error('--hoje no formato AAAA-MM-DD');
const pastaPng = path.resolve(opcao('--saida') || path.join(pasta, '..', 'distribuir', 'area-de-membros'));
const arquivoPdf = path.join(path.dirname(pastaPng), path.basename(pastaPng) + '.pdf');
const NOMES = ['01-capa', '02-mapa-de-desempenho', '03-evolucao', '04-plano-de-carreira', '05-oportunidades-em-clubes', '06-a-casa'];
const W = 1080, H = 1440;

// O perfil do Chrome precisa de caminho absoluto: com caminho relativo a porta de depuração não abre.
const perfil = mkdtempSync(path.join(os.tmpdir(), 'area-membros-'));
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
  await envia('Runtime.enable');
  const errosJs = [];
  eventos.push((m) => { if (m.method === 'Runtime.exceptionThrown') errosJs.push(m.params.exceptionDetails.text + ' ' + JSON.stringify(m.params.exceptionDetails.exception && m.params.exceptionDetails.exception.description)); });
  await envia('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: false });
  const carregou = new Promise((r) => eventos.push((m) => { if (m.method === 'Page.loadEventFired') r(); }));
  await envia('Page.navigate', { url: pathToFileURL(path.join(pasta, 'index.html')).href + '?raw' + (hoje ? `&hoje=${hoje}` : '') });
  await carregou;
  await avalia('document.fonts.ready.then(() => true)');
  for (let i = 0; i < 100 && !(await avalia('document.body.dataset.pronto === "1"')); i++) await espera(100);
  if (errosJs.length) throw new Error('erro de JavaScript na página: ' + errosJs.join(' | '));
  if (!(await avalia('document.body.dataset.pronto === "1"'))) throw new Error('as telas não terminaram de montar');
  await espera(300);

  const faltando = await avalia(`['800 90px "Saira Condensed"', '600 30px "Barlow Condensed"', '400 30px "Archivo"', '700 30px "Archivo"']
    .filter((f) => !document.fonts.check(f))`);
  if (faltando.length) throw new Error('fontes não carregaram: ' + faltando.join(', '));

  const avisos = await avalia(`(() => {
    const out = [];
    document.querySelectorAll('.page').forEach((pg, i) => {
      const n = String(i + 1).padStart(2, '0'), pr = pg.getBoundingClientRect();
      pg.querySelectorAll('.tela, .tcorpo, .cena').forEach((el) => {
        if (el.scrollHeight > el.clientHeight + 1) out.push(n + ': ' + el.className + ' estourou ' + (el.scrollHeight - el.clientHeight) + 'px na altura');
      });
      pg.querySelectorAll('*').forEach((el) => {
        if (el.closest('svg, .janela, .celular')) return;
        if (![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) return;
        const range = document.createRange();
        range.selectNodeContents(el);
        const q = [...range.getClientRects()];
        if (!q.length) return;
        // o que um bloco com overflow escondido já corta de propósito (a grade de atletas some no degradê) não conta
        const topo = Math.min(...q.map((r) => r.top));
        for (let a = el.parentElement; a && a !== pg; a = a.parentElement) {
          const cs = getComputedStyle(a);
          if ((cs.overflow === 'hidden' || cs.overflowY === 'hidden') && topo >= a.getBoundingClientRect().bottom - 1) return;
        }
        const dir = Math.max(...q.map((r) => r.right)) - pr.left, baixo = Math.max(...q.map((r) => r.bottom)) - pr.top;
        const t = '"' + el.textContent.trim().slice(0, 40) + '"';
        if (dir > ${W} - 40) out.push(n + ': passa da margem direita (' + Math.round(dir) + 'px) ' + t);
        if (baixo > ${H} - 20) out.push(n + ': passa do pé da página (y=' + Math.round(baixo) + ') ' + t);
        // texto cortado pelo próprio bloco (ellipsis ou overflow)
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow === 'hidden') out.push(n + ': texto cortado ' + t);
      });
    });
    return out;
  })()`);
  avisos.forEach((a) => console.warn('aviso, tela ' + a));

  const total = await avalia('document.querySelectorAll(".page").length');
  if (total !== NOMES.length) throw new Error(`esperava ${NOMES.length} telas, achei ${total}`);
  mkdirSync(pastaPng, { recursive: true });
  for (let i = 0; i < total; i++) {
    const foto = await envia('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true,
      clip: { x: 0, y: i * H, width: W, height: H, scale: 1 },
    });
    writeFileSync(path.join(pastaPng, NOMES[i] + '.png'), Buffer.from(foto.data, 'base64'));
  }

  const pdf = await envia('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
  writeFileSync(arquivoPdf, Buffer.from(pdf.data, 'base64'));
  console.log(`${total} telas -> ${pastaPng} e ${arquivoPdf}${avisos.length ? `, ${avisos.length} aviso(s)` : ', sem avisos'}`);
  ws.close();
} finally {
  chrome.kill();
  await espera(500);
  try { rmSync(perfil, { recursive: true, force: true }); } catch { /* o Chrome às vezes segura arquivos por alguns ms */ }
}
