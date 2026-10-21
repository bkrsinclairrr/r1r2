// O vídeo do atleta depois de 20/10/2026, com o painel local, o driver de arquivo e o Blob de mentira do servidor de teste (envioDeTeste):
// - o envio de ponta a ponta pelo painel no Chrome (o diálogo, a autorização, o arquivo, o upload() de verdade do vendor/blob-client.js, a
//   capa automática tirada do próprio vídeo, a largura e a altura) e o vídeo em pé na proporção dele;
// - sem limite de tamanho e de tempo, a guarda do espaço de todos os vídeos (VIDEOS_ESPACO_MAX_MB) no navegador e no servidor;
// - o vencimento de 24 horas, com a hora na tela, e o "Renovar por 24 h";
// - o "Salvar leitura" sem nada obrigatório (sem mudança, fecha sem ir ao servidor; sem a fonte, salva e avisa);
// - a passada de limpeza dos vídeos (vencido, sobra de envio com mais de 2 horas, arquivo de lead que não existe; o de agora fica), o
//   "de vez em quando" (no máximo uma vez por hora) e o Cron leve /api/limpeza?so=videos; a limpeza diária limpa o registro do vencido;
// - o vídeo em stream no driver de arquivo (o link assinado é só do Blob), o ?via=proxy do dono e o Server-Timing;
// - o vercel.json (os Crons de vídeo, uma vez por dia cada, e o domínio do Blob no media-src);
// - "Quando o Zyron começa": só "imediatamente", e o prazo de antes salvo vira "imediatamente";
// - nenhum campo obrigatório: rascunho vazio salvo e o link gerado sem preencher nada.
// Uso: node testes/teste-video.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { sobe, RAIZ_PAINEL } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';
import { geraClipe } from './_clipe.mjs';

const { ok, fim } = verificador('Vídeo do atleta (24 horas, sem limite, envio e limpeza)');
const nomeAleatorio = () => { const a = 'abcdefghijkmnpqrstuvwxyz23456789'; return Array.from(crypto.randomBytes(24), x => a[x % a.length]).join(''); };
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'closer-video-'));
const s = await sobe({ deck: true, envioDeTeste: true });
const nav = await abreNavegador();
const H = 3600e3;
try {
  const admin = new Cliente(s.painel), anon = new Cliente(s.painel); await admin.entra(s.adminLogin, s.adminSenha);
  const B = await import(pathToFileURL(path.join(RAIZ_PAINEL, 'api', '_base.js')).href);
  const emPe = await geraClipe(nav, { largura: 360, altura: 640, segundos: 2 });
  const CLIPE = path.join(temp, 'clipe-em-pe.webm'); fs.writeFileSync(CLIPE, emPe);
  const TXT = path.join(temp, 'nao-e-video.txt'); fs.writeFileSync(TXT, 'oi');
  ok(emPe.length > 1000, 'clipe em pé gerado no Chrome (' + emPe.length + ' bytes)');
  const regDe = t => JSON.parse(fs.readFileSync(path.join(s.dados, 'atletas', t + '.json'), 'utf8'));
  const gravaReg = (t, muda) => { const r = regDe(t); muda(r); fs.writeFileSync(path.join(s.dados, 'atletas', t + '.json'), JSON.stringify(r)); };
  const existe = c => fs.existsSync(path.join(s.dados, ...c.split('/')));
  const poe = (c, buf, horas) => { const p = path.join(s.dados, ...c.split('/')); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, buf); if (horas) { const d = new Date(Date.now() - horas * H); fs.utimesSync(p, d, d); } return c; };

  /* ---------- o envio pelo painel, de ponta a ponta ---------- */
  const t = (await admin.post('/api/atletas', { ficha: { nome: 'Lucas Prado', posicao: 'volante', temVideo: 'sim', plano: 'Assessoria PRO' } })).j.t;
  const g0 = (await admin.get('/api/leitura?t=' + t)).j;
  ok(g0.regras.validadeHoras === 24 && g0.regras.envio === true && g0.regras.tetoBytes === 2 * 1024 ** 3 && g0.espaco && g0.espaco.max === 600 * 1024 * 1024 && (g0.espaco.usado === 0 || g0.espaco.usado === null),
    'GET da leitura: 24 horas, o envio liberado (teste), o teto técnico de 2 GB e o espaço dos vídeos (600 MB; o usado só se a instância já listou)');
  const P = await nav.aba(s.painel + '/', { largura: 1440, altura: 1000 });
  await P.ate("!document.querySelector('#v-entrar').hidden");
  await P.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = ${JSON.stringify(s.adminLogin)}; f.senha.value = ${JSON.stringify(s.adminSenha)}; f.requestSubmit(); return 1; })()`);
  await P.ate("!document.querySelector('#v-app').hidden");
  // o upload() do navegador vai pro Blob de mentira
  await P.avalia(`window.process = { env: { VERCEL_BLOB_API_URL: ${JSON.stringify(s.blobFalso.url)} } }; 1`);
  await P.avalia(`location.hash = '#/r2/${t}'; 1`);
  await P.ate("!document.querySelector('#v-editor').hidden && !document.querySelector('#vd-bloco').hidden", 15000);
  ok(/24 horas depois do envio/.test(await P.avalia("document.querySelector('#vd-bloco').textContent")) && !/250 MB|5 minutos|90 dias/.test(await P.avalia("document.querySelector('#vd-bloco').textContent + document.querySelector('#leitura').textContent")),
    'os textos do painel falam do vencimento de 24 horas e não falam mais de 250 MB, 5 minutos nem 90 dias');
  await P.avalia("document.querySelector('#va-enviar').click(); 1");
  ok(await P.ate("document.querySelector('#leitura').open && /Lucas/.test(document.querySelector('#lt-titulo').textContent) && !document.querySelector('#lt-autoriza').disabled", 10000), 'o diálogo do vídeo abre');
  await P.avalia("document.querySelector('#lt-autoriza').click(); 1");
  ok(await P.ate("document.querySelector('#lt-autoriza').disabled && !document.querySelector('#lt-p2').classList.contains('off')", 8000), 'a autorização do responsável: uma marcação, e o envio libera');
  await P.arquivos('#lt-arquivo', [TXT]);
  ok(await P.ate("/mp4|webm|mov/.test(document.querySelector('#lt-video-erro').textContent)", 5000) && !s.blobFalso.envios.length, 'arquivo que não é vídeo: recusado no navegador, nada sobe');
  const t0 = Date.now();
  await P.arquivos('#lt-arquivo', [CLIPE]);
  if (!ok(await P.ate("/Vídeo enviado/.test(document.querySelector('#aviso').textContent)", 30000), 'o vídeo sobe pelo diálogo e é registrado (' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)'))
    console.log('  diagnóstico:', JSON.stringify(await P.avalia("({ erro: document.querySelector('#lt-video-erro').textContent, prog: document.querySelector('#lt-progresso-txt').textContent, aviso: document.querySelector('#aviso').textContent })")), JSON.stringify(s.blobFalso.envios), P.console_.slice(-5).join(' | '));
  const r1 = regDe(t);
  const envs = s.blobFalso.envios.map(e => e.pathname);
  ok(r1.video && r1.video.tipo === 'video/webm' && r1.video.bytes === emPe.length && r1.video.largura === 360 && r1.video.altura === 640 && r1.video.duracaoS > 1 && r1.video.duracaoS < 3,
    'o registro: tipo, tamanho, a duração lida no navegador (' + r1.video.duracaoS + ' s, mesmo sem ela no cabeçalho do webm) e as medidas (360 x 640)');
  ok(r1.video.poster && /\.jpg$/.test(r1.video.poster) && existe(r1.video.poster) && existe(r1.video.arquivo) && envs.includes(r1.video.arquivo) && envs.includes(r1.video.poster),
    'a capa automática: tirada do próprio vídeo e enviada junto, no mesmo registro');
  ok(Math.abs(Date.parse(r1.video.venceEm) - (Date.now() + 24 * H)) < 5 * 60e3, 'vence 24 horas depois do envio');
  const info = await P.avalia("document.querySelector('#lt-video-info').textContent");
  ok(/Sai do ar (hoje|amanhã) às \d{1,2}h(\d\d)?\./.test(info), 'o diálogo mostra o dia e a hora em que o vídeo sai do ar ("' + info + '")');
  ok(await P.avalia("(() => { const v = document.querySelector('#lt-video'); const r = v.getBoundingClientRect(); return v.style.getPropertyValue('--ar').trim() === '360 / 640' && r.height > r.width * 1.6; })()"), 'no painel, o vídeo aparece em pé, na proporção dele');
  const pub = (await anon.get('/api/r2?t=' + t)).j;
  ok(pub.video && pub.video.largura === 360 && pub.video.altura === 640 && pub.video.temPoster, 'a /api/r2 manda as medidas e a capa pro deck');

  /* ---------- "Salvar leitura": nada obrigatório ---------- */
  await P.avalia("document.querySelector('#lt-salvar').click(); 1");
  ok(await P.ate("!document.querySelector('#leitura').open", 5000) && !regDe(t).leitura, 'sem mudança, "Salvar leitura" fecha sem ir ao servidor');
  await P.avalia("document.querySelector('#va-lances').click(); 1");
  await P.ate("document.querySelector('#leitura').open && document.querySelector('#lt-video').readyState >= 1", 15000);
  await P.avalia("document.querySelector('#lt-bom').click(); 1");
  ok(await P.ate("document.querySelectorAll('#lt-lances tr[data-i]').length === 1", 5000), 'um lance marcado, sem escolher a fonte');
  await P.avalia("document.querySelector('#lt-salvar').click(); 1");
  ok(await P.ate("/Sem a fonte/.test(document.querySelector('#aviso').textContent)", 8000) && regDe(t).leitura && regDe(t).leitura.lances.length === 1 && regDe(t).leitura.origem === '',
    'sem a fonte, a leitura é salva e o painel avisa que o relatório não aparece no slide');
  // "Renovar por 24 h": o vídeo que ia sair do ar em 1 hora ganha mais 24
  gravaReg(t, r => { r.video.venceEm = new Date(Date.now() + H).toISOString(); });
  await P.avalia("document.querySelector('#lt-fechar').click(); 1"); await espera(300);
  await P.avalia("document.querySelector('#va-lances').click(); 1");
  await P.ate("document.querySelector('#leitura').open && /Lucas/.test(document.querySelector('#lt-titulo').textContent) && !document.querySelector('#lt-renovar').hidden", 10000);
  await P.avalia("document.querySelector('#lt-renovar').click(); 1");
  ok(await P.ate("/Vídeo renovado/.test(document.querySelector('#aviso').textContent)", 8000) && Math.abs(Date.parse(regDe(t).video.venceEm) - (Date.now() + 24 * H)) < 5 * 60e3,
    '"Renovar por 24 h": mais 24 horas a partir de agora, sem enviar de novo');
  ok(regDe(t).historico.some(h => /renovou o vídeo por mais 24 horas/.test(h.o)), 'o histórico anota a renovação');
  await P.avalia("document.querySelector('#lt-fechar').click(); 1");

  /* ---------- a guarda do espaço dos vídeos ---------- */
  process.env.VIDEOS_ESPACO_MAX_MB = String(emPe.length * 1.5 / 1048576);
  const cheio = await admin.post('/api/leitura', { type: 'blob.generate-client-token', payload: { pathname: 'videos/' + t + '/' + nomeAleatorio() + '.webm', clientPayload: JSON.stringify({ t, tipo: 'video', bytes: emPe.length }) } });
  ok(cheio.status === 400 && /espaço dos vídeos está cheio/.test(cheio.j.erro) && /Gerados/.test(cheio.j.erro), 'servidor: sem espaço pro arquivo novo, o token não sai e a mensagem diz o que fazer ("' + cheio.j.erro + '")');
  const capaOk = await admin.post('/api/leitura', { type: 'blob.generate-client-token', payload: { pathname: 'videos/' + t + '/' + nomeAleatorio() + '.jpg', clientPayload: JSON.stringify({ t, tipo: 'poster' }) } });
  ok(capaOk.status === 200 && /^vercel_blob_client_/.test(capaOk.j.clientToken), 'a capa (pequena) não passa pela guarda');
  await P.avalia("document.querySelector('#va-lances').click(); 1");
  await P.ate("document.querySelector('#leitura').open", 10000);
  const n0 = s.blobFalso.envios.length;
  await P.avalia("document.querySelector('#lt-escolher').disabled = false; 1");
  await P.arquivos('#lt-arquivo', [CLIPE]);
  ok(await P.ate("/espaço dos vídeos está cheio/.test(document.querySelector('#lt-video-erro').textContent)", 5000) && s.blobFalso.envios.length === n0, 'navegador: o arquivo que não cabe é avisado antes de subir');
  const ger = (await admin.get('/api/atletas?gerados=1&todos=1')).j;
  ok(ger.videos && ger.videos.usado >= emPe.length && ger.videos.max === Math.round(emPe.length * 1.5), 'a aba Gerados recebe o espaço de todos os vídeos contra a guarda');
  delete process.env.VIDEOS_ESPACO_MAX_MB;
  await P.avalia("document.querySelector('#lt-fechar').click(); 1");
  const grande = await admin.post('/api/leitura', { type: 'blob.generate-client-token', payload: { pathname: 'videos/' + t + '/' + nomeAleatorio() + '.mp4', clientPayload: JSON.stringify({ t, tipo: 'video', bytes: 400 * 1024 * 1024 }) } });
  ok(grande.status === 200, 'sem limite por vídeo: o token sai pra um arquivo de 400 MB (cabe nos 600 MB)');

  /* ---------- o vídeo servido ---------- */
  const v1 = await anon.get('/api/video?t=' + t, { cabecalhos: { Range: 'bytes=0-99' } });
  ok(v1.status === 206 && !v1.h.get('location') && /video;dur=\d+/.test(v1.h.get('server-timing') || ''), 'driver de arquivo: o vídeo segue em stream (206), sem link assinado, e com o Server-Timing');
  const vp = await admin.get('/api/video?t=' + t + '&via=proxy', { cabecalhos: { Range: 'bytes=0-9' } });
  ok(vp.status === 206, '?via=proxy (o painel do dono, pra tirar a capa): stream do mesmo endereço');
  ok(/leitura;dur=\d+/.test((await admin.get('/api/leitura?t=' + t)).h.get('server-timing') || ''), 'a leitura também manda o Server-Timing');
  const A = await import(pathToFileURL(path.join(RAIZ_PAINEL, 'api', '_armazenamento.js')).href);
  ok((await A.linkAssinado('videos/x/y.mp4')) === null, 'o link assinado só existe no Blob (no driver de arquivo devolve nada e a rota segue em stream)');
  gravaReg(t, r => { r.video.venceEm = new Date(Date.now() - 60e3).toISOString(); });
  ok((await admin.put('/api/leitura?t=' + t, { renovar: true })).status === 400, 'vídeo que já venceu não renova (envie de novo)');

  /* ---------- a passada de limpeza dos vídeos ---------- */
  const tVivo = (await admin.post('/api/atletas', { ficha: { nome: 'Vivo' } })).j.t;
  const atual = poe('videos/' + tVivo + '/' + nomeAleatorio() + '.webm', emPe, 30);
  const capaAtual = poe('videos/' + tVivo + '/' + nomeAleatorio() + '.jpg', Buffer.from('capa'), 30);
  await admin.put('/api/leitura?t=' + tVivo, { autorizar: true });
  await admin.put('/api/leitura?t=' + tVivo, { video: { arquivo: atual, tipo: 'video/webm', bytes: emPe.length, duracaoS: 2, poster: capaAtual } });
  const sobraVelha = poe('videos/' + tVivo + '/' + nomeAleatorio() + '.webm', emPe, 3);
  const sobraNova = poe('videos/' + tVivo + '/' + nomeAleatorio() + '.webm', emPe, 0.5);
  const orfao = poe('videos/' + 'q'.repeat(26) + '/' + nomeAleatorio() + '.mp4', emPe, 0.1);
  const vencido = regDe(t).video.arquivo, capaVencida = regDe(t).video.poster;
  const p1 = await B.passadaVideos();
  ok(!existe(vencido) && !existe(capaVencida), 'a passada apaga o vídeo e a capa vencidos');
  ok(!existe(sobraVelha) && existe(sobraNova), 'a sobra de envio com mais de 2 horas sai; a de meia hora (envio que pode estar registrando) fica');
  ok(!existe(orfao), 'o arquivo de um lead que não existe sai');
  ok(existe(atual) && existe(capaAtual), 'o vídeo e a capa de agora de um lead vivo nunca saem');
  ok(p1.vencidos === 1 && p1.sobras === 1 && p1.orfaos === 1 && p1.usado === emPe.length * 2 + 4, 'a contagem da passada (' + JSON.stringify(p1) + '), sem nome nenhum');
  const d1 = await B.passadaDeVezEmQuando(), d2 = await B.passadaDeVezEmQuando();
  ok((d1 === null || typeof d1 === 'object') && d2 === null, 'de vez em quando: no máximo uma passada por hora por instância');
  const semAuth = await anon.get('/api/limpeza?so=videos');
  const leve = await anon.get('/api/limpeza?so=videos&h=3', { cabecalhos: { Authorization: 'Bearer ' + s.cronSecret } });
  ok(semAuth.status === 401 && leve.status === 200 && leve.j.ok === true && typeof leve.j.usado === 'number' && !('registros' in leve.j), 'o Cron leve (?so=videos): só com o segredo, e só a passada dos vídeos');
  const diaria = await anon.get('/api/limpeza', { cabecalhos: { Authorization: 'Bearer ' + s.cronSecret } });
  ok(diaria.status === 200 && diaria.j.ok === true && regDe(t).video === null && regDe(t).leitura === null && regDe(tVivo).video.arquivo === atual, 'a limpeza diária limpa o registro do vídeo vencido e deixa o vivo');

  /* ---------- o vercel.json ---------- */
  const vj = JSON.parse(fs.readFileSync(path.join(RAIZ_PAINEL, 'vercel.json'), 'utf8'));
  const crons = vj.crons || [];
  ok(crons.length === 4 && crons.every(c => /^\d{1,2} \d{1,2} \* \* \*$/.test(c.schedule)) && new Set(crons.map(c => c.path)).size === 4 && crons.filter(c => /so=videos/.test(c.path)).length === 3,
    'os Crons: a limpeza diária e três passadas de vídeo, cada uma uma vez por dia (o plano gratuito não aceita mais que isso por Cron)');
  const csp = vj.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
  ok(/media-src 'self' blob: https:\/\/\*\.vercel-storage\.com/.test(csp) && vj.functions['api/video.js'].maxDuration === 60, 'a CSP aceita o vídeo vindo do Blob (link assinado) e a rota do vídeo pode levar até 60 s');
  ok(fs.readdirSync(path.join(RAIZ_PAINEL, 'api')).filter(f => !f.startsWith('_')).length === 12, 'continuam 12 funções (o limite do plano gratuito)');

  /* ---------- "Quando o Zyron começa": imediatamente ---------- */
  const tz = (await admin.post('/api/atletas', { ficha: { nome: 'Prazo Velho', prazoZyron: 'no dia seguinte' } })).j;
  ok(tz.registro.ficha.prazoZyron === 'imediatamente', 'o prazo de antes que chega no painel vira "imediatamente"');
  gravaReg(tz.t, r => { r.ficha.prazoZyron = 'em até 48 horas'; });
  ok((await anon.get('/api/r2?t=' + tz.t)).j.ficha.prazoZyron === 'imediatamente', 'lead salvo antes com "em até 48 horas": o deck recebe "imediatamente" (não some)');
  await P.avalia("location.hash = '#/novo'; 1");
  await P.ate("!document.querySelector('#v-editor').hidden", 10000);
  const z = await P.avalia("(() => { const s = document.querySelector('[name=prazoZyron]'); return { opcoes: [...s.options].map(o => o.value).filter(Boolean), valor: s.value }; })()");
  ok(z.opcoes.join() === 'imediatamente' && z.valor === 'imediatamente', 'no painel, "Quando o Zyron começa" só tem "imediatamente", e já vem marcado');

  /* ---------- nenhum campo obrigatório ---------- */
  ok(!/\*/.test(await P.avalia("[...document.querySelectorAll('#s-call .campo > span')].map(s => s.textContent).join(' ')")), 'Dia, Hora e Plano sem o asterisco de obrigatório');
  const antes = ((await admin.get('/api/atletas')).j.itens || []).length;
  await P.avalia("document.querySelector('#ed-salvar').click(); 1");
  ok(await P.ate("/^#\\/r2\\/[a-z2-7]{26}$/.test(location.hash)", 12000), 'o rascunho vazio (nada preenchido) é salvo');
  const tv = (await P.avalia('location.hash')).slice(5);
  await P.avalia("document.querySelector('#bt-gerar-link').click(); 1");
  ok(await P.ate("!document.querySelector('#s-link').hidden && /\\?a=[a-z2-7]{26}/.test(document.querySelector('#lk-url').value)", 15000) && ((await admin.get('/api/atletas')).j.itens || []).length === antes + 1,
    'e o link é gerado sem preencher nada');
  ok((await anon.get('/api/r2?t=' + tv)).j.estado === 'ok', 'a família abre esse link');
  const exc = P.console_.filter(m => /^EXC/.test(m));
  ok(!exc.length, 'nenhuma exceção no painel' + (exc.length ? ': ' + exc.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha();
  await s.fecha();
  try { fs.rmSync(temp, { recursive: true, force: true }); } catch { /* nada */ }
}
fim();
