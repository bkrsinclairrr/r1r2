// Chrome sem janela com várias abas (CDP), pros testes de navegador do Painel do Closer. Perfil temporário, apagado no fim.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const espera = ms => new Promise(r => setTimeout(r, ms));

export async function abreNavegador() {
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'closer-chrome-'));
  const porta = 9700 + Math.floor(Math.random() * 250);
  const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${porta}`, `--user-data-dir=${perfil}`, '--window-size=1600,1000', '--no-first-run',
    '--no-default-browser-check', '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 150; i++) { try { await fetch(`http://127.0.0.1:${porta}/json/version`); break; } catch { await espera(100); } }
  const abas = [];
  async function aba(url, { largura = 1600, altura = 1000, toque = false } = {}) {
    const alvo = await (await fetch(`http://127.0.0.1:${porta}/json/new?about:blank`, { method: 'PUT' })).json();
    const ws = new WebSocket(alvo.webSocketDebuggerUrl);
    await new Promise(ok => ws.addEventListener('open', ok, { once: true }));
    let seq = 0; const pend = new Map(); const ouvintes = []; const console_ = [];
    ws.addEventListener('message', ev => {
      const m = JSON.parse(ev.data);
      if (m.id && pend.has(m.id)) { const { ok, erro } = pend.get(m.id); pend.delete(m.id); m.error ? erro(new Error(JSON.stringify(m.error))) : ok(m.result); }
      else if (m.method) {
        if (m.method === 'Runtime.exceptionThrown') console_.push('EXC ' + ((m.params.exceptionDetails.exception || {}).description || m.params.exceptionDetails.text));
        if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') console_.push('ERR ' + m.params.args.map(a => a.value).join(' '));
        ouvintes.forEach(f => f(m));
      }
    });
    const envia = (method, params = {}) => new Promise((ok, erro) => { const id = ++seq; pend.set(id, { ok, erro }); ws.send(JSON.stringify({ id, method, params })); });
    await envia('Page.enable'); await envia('Runtime.enable'); await envia('DOM.enable');
    await envia('Emulation.setDeviceMetricsOverride', { width: largura, height: altura, deviceScaleFactor: 1, mobile: false });
    if (toque) await envia('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    // confirm() e alert(): a resposta padrão é "OK"; o teste pode trocar (dialogo.aceita = false)
    const dialogo = { aceita: true, ultimos: [] };
    ouvintes.push(m => { if (m.method === 'Page.javascriptDialogOpening') { dialogo.ultimos.push(m.params.message); envia('Page.handleJavaScriptDialog', { accept: dialogo.aceita }).catch(() => {}); } });
    const avalia = async expr => {
      const r = await envia('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error('JS: ' + ((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text));
      return r.result.value;
    };
    const ate = async (expr, ms = 15000, passo = 150) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await avalia(expr)) return true; } catch { /* carregando */ } await espera(passo); } return false; };
    const vai = async u => { await envia('Page.navigate', { url: u }); await espera(400); };
    const foto = async arq => { const r = await envia('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(arq, Buffer.from(r.data, 'base64')); };
    const arquivos = async (seletor, lista) => {
      const doc = await envia('DOM.getDocument', { depth: -1 });
      const { nodeId } = await envia('DOM.querySelector', { nodeId: doc.root.nodeId, selector: seletor });
      await envia('DOM.setFileInputFiles', { nodeId, files: lista });
    };
    const mouse = (type, x, y, extra = {}) => envia('Input.dispatchMouseEvent', Object.assign({ type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 }, extra));
    const arrasta = async (x0, y0, x1, y1, passos = 8) => {
      await mouse('mousePressed', x0, y0);
      for (let i = 1; i <= passos; i++) { await mouse('mouseMoved', x0 + (x1 - x0) * i / passos, y0 + (y1 - y0) * i / passos); await espera(16); }
      await mouse('mouseReleased', x1, y1);
    };
    const roda = (x, y, deltaY) => envia('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY });
    const toqueEv = (type, pontos) => envia('Input.dispatchTouchEvent', { type, touchPoints: pontos.map(([x, y], i) => ({ x, y, id: i + 1 })) });
    const pinca = async (cx, cy, d0, d1, passos = 8) => {
      await toqueEv('touchStart', [[cx - d0 / 2, cy], [cx + d0 / 2, cy]]);
      for (let i = 1; i <= passos; i++) { const d = d0 + (d1 - d0) * i / passos; await toqueEv('touchMove', [[cx - d / 2, cy], [cx + d / 2, cy]]); await espera(16); }
      await toqueEv('touchEnd', []);
    };
    await vai(url);
    const a = { envia, avalia, ate, vai, foto, arquivos, arrasta, roda, pinca, mouse, dialogo, console_, fecha: () => { try { ws.close(); } catch { /* nada */ } } };
    abas.push(a);
    return a;
  }
  const fecha = async () => { abas.forEach(a => a.fecha()); proc.kill(); await espera(500); try { fs.rmSync(perfil, { recursive: true, force: true }); } catch { /* nada */ } };
  return { aba, fecha };
}
export { espera };
