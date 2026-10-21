// Um clipe de vídeo de teste (webm, VP8), feito no próprio Chrome do teste: um canvas animado gravado com o MediaRecorder. Serve pra testar
// vídeo em pé e deitado sem ffmpeg e sem vídeo de atleta de verdade (é um campo com uma bola andando e o tamanho escrito).
// Uso: const buf = await geraClipe(nav, { largura: 360, altura: 640, segundos: 3 })   (nav: o abreNavegador() do _chrome.mjs)
import { espera } from './_chrome.mjs';

export async function geraClipe(nav, { largura = 640, altura = 360, segundos = 3 } = {}) {
  // aba em segundo plano no Chrome sem janela pode não desenhar: traz pra frente, desenha por timer e tenta de novo se o clipe vier vazio
  for (let tentativa = 1; ; tentativa++) {
    const buf = await umClipe(nav, largura, altura, segundos);
    if (buf.length > 1000 || tentativa >= 3) return buf;
  }
}
async function umClipe(nav, largura, altura, segundos) {
  const a = await nav.aba('about:blank', { largura: 800, altura: 800 });
  try {
    await a.envia('Page.bringToFront').catch(() => {});
    const b64 = await a.avalia(`new Promise((ok, erro) => {
      const c = document.createElement('canvas'); c.width = ${largura}; c.height = ${altura}; document.body.appendChild(c);
      const x = c.getContext('2d'), t0 = performance.now();
      const desenha = () => {
        const t = (performance.now() - t0) / 1000;
        x.fillStyle = '#14261F'; x.fillRect(0, 0, c.width, c.height);
        x.strokeStyle = 'rgba(200,184,138,.6)'; x.lineWidth = 3; x.strokeRect(8, 8, c.width - 16, c.height - 16);
        x.beginPath(); x.arc(c.width / 2, c.height / 2, Math.min(c.width, c.height) / 6, 0, 7); x.stroke();
        x.fillStyle = '#FFD25A'; x.beginPath(); x.arc(c.width * (.2 + .6 * ((t / ${segundos}) % 1)), c.height * (.3 + .4 * Math.sin(t * 2) ** 2), 14, 0, 7); x.fill();
        x.fillStyle = '#fff'; x.font = 'bold 28px Arial'; x.fillText(${largura} + ' x ' + ${altura}, 20, 44);
      };
      const tempo = setInterval(desenha, 33); desenha();
      const rec = new MediaRecorder(c.captureStream(30), { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 1500000 });
      const partes = [];
      rec.ondataavailable = e => { if (e.data && e.data.size) partes.push(e.data); };
      rec.onstop = () => { clearInterval(tempo); const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.onerror = erro; r.readAsDataURL(new Blob(partes, { type: 'video/webm' })); };
      rec.start(250);
      setTimeout(() => rec.stop(), ${segundos} * 1000);
    })`);
    return Buffer.from(b64, 'base64');
  } finally {
    await Promise.race([a.envia('Page.close').catch(() => {}), espera(500)]);
  }
}
