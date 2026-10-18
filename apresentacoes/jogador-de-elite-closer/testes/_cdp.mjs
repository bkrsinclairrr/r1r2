// Ajudante mínimo de Chrome DevTools Protocol pros scripts de tela (Chrome headless, perfil temporário, uma aba). O Chrome pode vir da variável CHROME.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export const espera = ms => new Promise(r => setTimeout(r, ms));

export async function abreChrome({ largura = 1500, altura = 1000 } = {}) {
  const perfil = mkdtempSync(path.join(os.tmpdir(), 'teste-cdp-'));
  const porta = 9500 + Math.floor(Math.random() * 400);
  const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${porta}`, `--user-data-dir=${perfil}`, `--window-size=${largura},${altura}`,
    '--no-first-run', '--no-default-browser-check', '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let wsUrl;
  for (let i = 0; i < 150 && !wsUrl; i++) {
    try { wsUrl = (await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json()).find(a => a.type === 'page').webSocketDebuggerUrl; } catch { await espera(100); }
  }
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));
  let seq = 0; const pend = new Map(); const ouvintes = [];
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { const { ok, erro } = pend.get(m.id); pend.delete(m.id); m.error ? erro(new Error(JSON.stringify(m.error))) : ok(m.result); }
    else if (m.method) ouvintes.forEach(f => f(m));
  });
  const envia = (method, params = {}) => new Promise((ok, erro) => { const id = ++seq; pend.set(id, { ok, erro }); ws.send(JSON.stringify({ id, method, params })); });
  await envia('Page.enable'); await envia('Runtime.enable'); await envia('DOM.enable'); await envia('Log.enable');
  await envia('Emulation.setDeviceMetricsOverride', { width: largura, height: altura, deviceScaleFactor: 1, mobile: false });
  const avalia = async (expr) => {
    const r = await envia('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error('JS: ' + (r.exceptionDetails.exception && r.exceptionDetails.exception.description || r.exceptionDetails.text));
    return r.result.value;
  };
  const vai = async (url) => { await envia('Page.navigate', { url }); await espera(1500); };
  const ate = async (expr, ms = 30000, passo = 250) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await avalia(expr)) return true; } catch { /* ainda carregando */ } await espera(passo); } return false; };
  const arquivos = async (seletor, lista) => {
    const doc = await envia('DOM.getDocument', { depth: -1 });
    const { nodeId } = await envia('DOM.querySelector', { nodeId: doc.root.nodeId, selector: seletor });
    await envia('DOM.setFileInputFiles', { nodeId, files: lista });
  };
  const tecla = async (key) => {
    const code = 'Key' + key.toUpperCase();
    await envia('Input.dispatchKeyEvent', { type: 'keyDown', key, code, text: key, windowsVirtualKeyCode: key.toUpperCase().charCodeAt(0) });
    await envia('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: key.toUpperCase().charCodeAt(0) });
  };
  const foto = async (arq) => { const r = await envia('Page.captureScreenshot', { format: 'png' }); writeFileSync(arq, Buffer.from(r.data, 'base64')); };
  const console_ = []; ouvintes.push(m => { if (m.method === 'Runtime.consoleAPICalled') console_.push(m.params.args.map(a => a.value).join(' ')); if (m.method === 'Log.entryAdded') console_.push('LOG ' + m.params.entry.level + ' ' + m.params.entry.text + ' ' + (m.params.entry.url || '')); if (m.method === 'Runtime.exceptionThrown') console_.push('EXC ' + (m.params.exceptionDetails.exception && m.params.exceptionDetails.exception.description)); });
  const fecha = async () => { try { ws.close(); } catch { /* nada */ } proc.kill(); await espera(400); try { rmSync(perfil, { recursive: true, force: true }); } catch { /* nada */ } };
  const aoEvento = f => ouvintes.push(f);
  return { envia, avalia, vai, ate, arquivos, tecla, foto, fecha, console_, aoEvento };
}
