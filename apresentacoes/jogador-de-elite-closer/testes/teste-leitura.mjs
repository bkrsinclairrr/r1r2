// Leitura do atleta (o slide 17 do R2) e "Importar do painel atual", com o painel e o R2 novo locais e o driver de arquivo.
// Uso: node testes/teste-leitura.mjs
// Leitura: com o driver de arquivo, a rota do envio responde 501 (o envio direto pro Blob só existe no ar). O teste põe o
// vídeo na pasta dos dados no mesmo caminho que o navegador usaria na loja (videos/<código>/<nome aleatório>.mp4) e segue
// pelas rotas de verdade: autorização, registro do vídeo, lances, /api/r2, /api/video com Range, outro closer, link
// revogado, vídeo vencido, trocar e apagar. Desde 20/10/2026: sem limite de tamanho e de tempo (só o teto técnico), o vídeo vence em
// 24 horas e a leitura salva sem nada obrigatório (linha estragada vira aviso). O envio pelo navegador está no teste-video.mjs. No Chrome: o 17 do deck pelo link e a Leitura no painel (abrir, importar o
// JSON, salvar). O vídeo é o filme do Zyron que já está no deck: nenhum vídeo de atleta de verdade.
// Importação: as rotas rodam neste processo, então o fetch do painel atual é trocado aqui dentro. Nada sai pra internet.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { sobe, RAIZ_DECK } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const VIDEO = path.join(RAIZ_DECK, 'assets', 'video', 'zyron-filme.mp4');
const POSTER = path.join(RAIZ_DECK, 'assets', 'video', 'poster-zyron-filme.jpg');
const PAINEL_ATUAL = 'https://jogador-de-elite-painel.vercel.app';
const SENHA_B = 'senha-do-bruno-123';

// a duração pelo cabeçalho do MP4 (a caixa mvhd dentro da moov), sem biblioteca
function duracaoMp4(buf) {
  let p = 0;
  while (p + 8 <= buf.length) {
    let tam = buf.readUInt32BE(p), cab = 8;
    const tipo = buf.toString('latin1', p + 4, p + 8);
    if (tam === 1) { tam = Number(buf.readBigUInt64BE(p + 8)); cab = 16; } else if (tam === 0) tam = buf.length - p;
    if (tipo === 'moov') {
      for (let q = p + cab; q + 8 <= p + tam; q += buf.readUInt32BE(q)) {
        if (buf.toString('latin1', q + 4, q + 8) !== 'mvhd') continue;
        return buf[q + 8] === 1 ? Number(buf.readBigUInt64BE(q + 32)) / buf.readUInt32BE(q + 28) : buf.readUInt32BE(q + 24) / buf.readUInt32BE(q + 20);
      }
      return 0;
    }
    if (tam < 8) return 0;
    p += tam;
  }
  return 0;
}
const nomeAleatorio = () => { const a = 'abcdefghijkmnpqrstuvwxyz23456789'; return Array.from(crypto.randomBytes(24), x => a[x % a.length]).join(''); };
const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

// o fetch das rotas pro painel atual, trocado: tudo que não é 127.0.0.1 fica anotado e responde o que o teste mandar
const fetchReal = globalThis.fetch;
const chamadas = [];
let responde = null;
globalThis.fetch = async (url, op) => {
  const u = String(url && url.url ? url.url : url);
  if (u.startsWith('http://127.0.0.1')) return fetchReal(url, op);
  chamadas.push(u);
  if (!responde) throw new TypeError('fetch failed (sem internet no teste)');
  return responde(u);
};

const s = await sobe({ deck: true });
const { ok, fim } = verificador('Leitura e importação');
const nav = await abreNavegador();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'closer-leitura-'));
try {
  const admin = new Cliente(s.painel), anon = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  await admin.post('/api/usuarios', { login: 'bruno.closer', nome: 'Bruno Closer', papel: 'closer', senha: SENHA_B });
  const bruno = new Cliente(s.painel); await bruno.entra('bruno.closer', SENHA_B);
  const t = (await admin.post('/api/atletas', { ficha: { nome: 'Lucas Prado', origem: 'Zyron', posicao: 'volante', plano: 'Assessoria PRO' } })).j.t;
  const poeArquivo = (c, origem) => { const p = path.join(s.dados, ...c.split('/')); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.copyFileSync(origem, p); return p; };
  const faixa = (cli, a, b, extra = '') => cli.get('/api/video?t=' + t + extra, { cabecalhos: { Range: 'bytes=' + a + '-' + b } });

  /* ---------- a leitura pelas rotas ---------- */
  const buf = fs.readFileSync(VIDEO);
  const dur = duracaoMp4(buf);
  ok(dur > 0, 'o vídeo de teste tem ' + dur + ' s e ' + (buf.length / 1048576).toFixed(1) + ' MB');
  const g0 = await admin.get('/api/leitura?t=' + t);
  ok(g0.status === 200 && g0.j.video === null && g0.j.regras.envio === false && g0.j.regras.validadeHoras === 24 && !('maxBytes' in g0.j.regras) && !('maxSegundos' in g0.j.regras),
    'GET da leitura: sem vídeo, validade de 24 horas, sem limite de tamanho e de tempo, e o envio marcado como só no ar');
  const env = await admin.post('/api/leitura', { type: 'blob.generate-client-token', payload: { pathname: 'videos/' + t + '/' + nomeAleatorio() + '.mp4', clientPayload: JSON.stringify({ t, tipo: 'video' }) } });
  ok(env.status === 501, 'o token de envio pro Blob, com o driver de arquivo: 501 (' + env.status + ')');

  const arq = 'videos/' + t + '/' + nomeAleatorio() + '.mp4', capa = 'videos/' + t + '/' + nomeAleatorio() + '.jpg';
  const pVideo = poeArquivo(arq, VIDEO), pCapa = poeArquivo(capa, POSTER);
  const dadosVideo = { arquivo: arq, tipo: 'video/mp4', bytes: buf.length, duracaoS: dur, poster: capa };
  const semAut = await admin.put('/api/leitura?t=' + t, { video: dadosVideo });
  ok(semAut.status === 400 && /autoriza/i.test(semAut.j.erro), 'registrar o vídeo antes da autorização: 400 ("' + semAut.j.erro + '")');
  const aut = await admin.put('/api/leitura?t=' + t, { autorizar: true });
  ok(aut.status === 200 && /\(admin\)/.test(aut.j.video.autorizadoPor) && Date.now() - Date.parse(aut.j.video.autorizadoEm) < 60000, 'a autorização fica registrada: quem (' + aut.j.video.autorizadoPor + ') e quando');
  const outraPasta = await admin.put('/api/leitura?t=' + t, { video: Object.assign({}, dadosVideo, { arquivo: 'videos/' + 'b'.repeat(26) + '/' + nomeAleatorio() + '.mp4' }) });
  const absurdo = await admin.put('/api/leitura?t=' + t, { video: Object.assign({}, dadosVideo, { duracaoS: 7 * 3600 }) });
  const teto = await admin.put('/api/leitura?t=' + t, { video: Object.assign({}, dadosVideo, { bytes: 3 * 1024 * 1024 * 1024 }) });
  const tipo = await admin.put('/api/leitura?t=' + t, { video: Object.assign({}, dadosVideo, { tipo: 'text/html' }) });
  ok(outraPasta.status === 400 && absurdo.status === 400 && teto.status === 400 && /2 GB/.test(teto.j.erro) && tipo.status === 400,
    'recusados: vídeo na pasta de outro código, duração absurda (mais de 6 horas, arquivo estragado), acima do teto técnico de 2 GB ou de tipo fora da lista');
  const grande = await admin.put('/api/leitura?t=' + t, { video: Object.assign({}, dadosVideo, { bytes: 600 * 1024 * 1024, duracaoS: 20 * 60 }) });
  ok(grande.status === 200 && grande.j.video.bytes === 600 * 1024 * 1024 && grande.j.video.duracaoS === 1200, 'sem limite por vídeo: 600 MB e 20 minutos são aceitos pelo servidor');
  const reg = await admin.put('/api/leitura?t=' + t, { video: dadosVideo });
  const vence = reg.j && reg.j.video && Date.parse(reg.j.video.venceEm);
  ok(reg.status === 200 && reg.j.valido === true && Math.abs(vence - (Date.now() + 24 * 3600e3)) < 120000, 'o vídeo é registrado e vence sozinho em 24 horas');

  const lances = [
    { t: 8, tipo: 'Passe', leitura: 'bom', nota: 'Passe vertical <b>entre</b> as linhas' },
    { t: 19.5, tipo: 'Drible', leitura: 'bom', nota: 'Tirou o marcador no curto' },
    { t: 33, tipo: 'Desarme', leitura: 'ajustar', nota: 'Chegou atrasado no bote' },
    { t: 47, tipo: 'Posicionamento', leitura: 'bom', nota: 'Fechou o meio na transição' },
    { t: 71.2, tipo: 'Passe', leitura: 'ajustar', nota: 'Perdeu a linha de passe' },
    { t: 98, tipo: 'Finalização', leitura: 'bom', nota: 'Chute de fora no canto' }
  ];
  const leitura = { origem: 'zyron', criterio: 'selecao', lances, fortes: ['Passe vertical', 'Leitura de espaço'], prioridades: ['Proteção de bola', 'Tempo do bote'] };
  const semFonte = await admin.put('/api/leitura?t=' + t, { leitura: Object.assign({}, leitura, { origem: '' }) });
  const pubSemFonte = await anon.get('/api/r2?t=' + t, { origem: s.deck });
  ok(semFonte.status === 200 && semFonte.j.leitura.origem === '' && semFonte.j.leitura.lances.length === 6 && pubSemFonte.j.video && !pubSemFonte.j.leitura,
    'leitura sem a fonte é salva (nada é obrigatório) e o deck recebe só o vídeo, sem o relatório');
  const vazia = await admin.put('/api/leitura?t=' + t, { leitura: { origem: '', lances: [] } });
  ok(vazia.status === 200 && vazia.j.leitura.lances.length === 0, 'leitura vazia (nenhum lance) também é salva');
  const depoisDoFim = await admin.put('/api/leitura?t=' + t, { leitura: Object.assign({}, leitura, { lances: lances.concat([{ t: dur + 30, tipo: 'Passe', leitura: 'bom' }, { t: dur + 1, tipo: 'Drible', leitura: 'bom' }]) }) });
  const tipoRuim = await admin.put('/api/leitura?t=' + t, { leitura: Object.assign({}, leitura, { lances: lances.concat([{ t: 10, tipo: 'Golaço', leitura: 'bom' }]) }) });
  ok(depoisDoFim.status === 200 && depoisDoFim.j.leitura.lances.length === 7 && depoisDoFim.j.avisos.length === 1 && /fora do vídeo/.test(depoisDoFim.j.avisos[0]) && depoisDoFim.j.leitura.lances.some(l => Math.abs(l.t - Math.round(dur * 10) / 10) < 0.11),
    'lance muito depois do fim do vídeo fica de fora com aviso, o resto é salvo; o que passa por 1 segundo vai pro fim do vídeo');
  ok(tipoRuim.status === 200 && tipoRuim.j.leitura.lances.length === 6 && /Golaço/.test(tipoRuim.j.avisos[0]), 'lance com tipo fora da lista fica de fora com aviso, os outros 6 são salvos');
  const sal = await admin.put('/api/leitura?t=' + t, { leitura });
  ok(sal.status === 200 && sal.j.leitura.lances.length === 6 && sal.j.leitura.lances.every(l => !/[<>]/.test(l.nota)), 'a leitura é salva com os 6 lances, e a nota perde a marcação HTML ("' + sal.j.leitura.lances[0].nota + '")');

  /* ---------- o que a família recebe ---------- */
  const pub = await anon.get('/api/r2?t=' + t, { origem: s.deck });
  ok(pub.status === 200 && pub.j.video && pub.j.video.ok && pub.j.video.temPoster && Math.abs(pub.j.video.duracaoS - dur) < 0.2 && pub.j.leitura && pub.j.leitura.lances.length === 6 && pub.j.leitura.origem === 'zyron',
    '/api/r2 entrega o vídeo (ok, duração, capa) e a leitura com os 6 lances');
  ok(!/videos\/|\.mp4|\.jpg|autorizado|bruno|"por"/i.test(pub.texto), '/api/r2 não mostra caminho de arquivo, quem autorizou nem quem salvou');
  const v1 = await faixa(anon, 0, 99);
  ok(v1.status === 206 && v1.h.get('content-range') === 'bytes 0-99/' + buf.length && v1.buf.equals(buf.subarray(0, 100)) && v1.h.get('content-type') === 'video/mp4' && v1.h.get('accept-ranges') === 'bytes',
    'o vídeo sai por /api/video em pedaços: 206, Content-Range e os bytes certos');
  const meio = await faixa(anon, 5000000, 5000999);
  ok(meio.status === 206 && meio.buf.equals(buf.subarray(5000000, 5001000)), 'um pedaço do meio também (é o que a barra do player pede ao pular)');
  ok(v1.h.get('cache-control') === 'private, max-age=3600' && /noindex/.test(v1.h.get('x-robots-tag') || '') && v1.h.get('x-content-type-options') === 'nosniff' && v1.h.get('cross-origin-resource-policy') === 'cross-origin',
    'cabeçalhos do vídeo: privado, noindex, nosniff e liberado pro deck (CORP)');
  const head = await anon.pede('HEAD', '/api/video?t=' + t);
  ok(head.status === 200 && Number(head.h.get('content-length')) === buf.length && head.buf.length === 0, 'HEAD dá o tamanho sem mandar o vídeo');
  const cap = await anon.get('/api/video?t=' + t + '&poster=1');
  ok(cap.status === 200 && cap.h.get('content-type') === 'image/jpeg' && cap.buf.equals(fs.readFileSync(POSTER)), 'a capa sai por /api/video?poster=1');
  const nada = await anon.get('/api/video?t=' + 'c'.repeat(26), { cabecalhos: { Range: 'bytes=0-9' } });
  const torto = await anon.get('/api/video?t=..%2Fatletas%2F' + t, { cabecalhos: { Range: 'bytes=0-9' } });
  ok(nada.status === 404 && torto.status === 404, 'código que não existe ou fora do formato: 404');

  /* ---------- outro closer e link revogado ---------- */
  const gB = await bruno.get('/api/leitura?t=' + t), pB = await bruno.put('/api/leitura?t=' + t, { autorizar: true }), dB = await bruno.del('/api/leitura?t=' + t);
  ok(gB.status === 403 && pB.status === 403 && dB.status === 403, 'outro closer não lê, não muda e não apaga a leitura (403)');
  const rev = await admin.post('/api/link?t=' + t + '&acao=revogar', {});
  const [vAnon, vB, vDono] = [await faixa(anon, 0, 9), await faixa(bruno, 0, 9), await faixa(admin, 0, 9)];
  const pubRev = await anon.get('/api/r2?t=' + t, { origem: s.deck });
  ok(rev.status === 200 && vAnon.status === 404 && vB.status === 404 && vDono.status === 206 && pubRev.j.estado === 'revogado' && !pubRev.j.video,
    'link revogado: a família e outro closer recebem 404; o dono ainda vê o vídeo (pra marcar os lances)');
  await admin.post('/api/link?t=' + t + '&acao=reativar', {});

  /* ---------- o 17 do deck pelo link ---------- */
  const D = await nav.aba(s.deck + '/?a=' + t + '#17', { largura: 1920, altura: 1080 });
  const SRC = s.painel + '/api/video?t=' + t;
  const ATIVO = "document.querySelector('#stage > .slide.active')";
  const VIS = "(el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return false; } return true; })";
  ok(await D.ate(`(document.querySelector('#v-atleta') || {}).getAttribute && document.querySelector('#v-atleta').getAttribute('src') === ${JSON.stringify(SRC)}`), 'o 17 aponta o vídeo pra /api/video?t=<código> do painel');
  ok(await D.ate(`document.querySelector('#v-atleta').readyState >= 1 && Math.abs(document.querySelector('#v-atleta').duration - ${dur}) < 1`, 20000), 'o vídeo carrega no deck, vindo do painel (' + dur + ' s)');
  ok((await D.avalia("document.querySelector('#v-atleta').getAttribute('poster')")) === SRC + '&poster=1', 'a capa do vídeo vem de /api/video?poster=1');
  ok((await D.avalia("document.querySelectorAll('[data-rl=\"capitulos\"] li').length")) === 6, 'os 6 lances viram capítulos do vídeo');
  const TXT = `(() => { const vis = ${VIS}, out = [], w = document.createTreeWalker(${ATIVO}, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const n = w.currentNode; if (n.textContent.trim() && vis(n.parentElement)) out.push(n.textContent.trim()); } return out.join(' '); })()`;
  const texto14 = await D.avalia(TXT);
  ok(/O jogo do Lucas Prado/.test(texto14) && /Relatório de Lucas Prado/.test(texto14) && /Leitura do Zyron/.test(texto14), 'o 17 mostra "O jogo do Lucas Prado", "Relatório de Lucas Prado" e a fonte (Leitura do Zyron)');
  ok(!(await D.avalia(`[...${ATIVO}.querySelectorAll('[data-ifnot="videoOk"]')].some(${VIS})`)), 'a leitura ao vivo (sem vídeo) não aparece');
  for (let i = 0; i < 3; i++) { await D.avalia("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); 1"); await espera(250); }
  ok(await D.ate(`${ATIVO}.querySelector('[data-rl="rosca"]').innerHTML.length > 50 && /Passe vertical/.test(${ATIVO}.querySelector('[data-rl="fortes"]').textContent) && /Tempo do bote/.test(${ATIVO}.querySelector('[data-rl="prioridades"]').textContent)`, 5000),
    'nos avanços: a rosca (6 lances), os pontos fortes e as prioridades');
  ok(!(await D.avalia("document.documentElement.outerHTML.includes('videos/')")), 'nenhum caminho de arquivo do painel no deck');

  /* ---------- a Leitura no painel: abrir, importar o JSON, salvar como Equipe ---------- */
  const P = await nav.aba(s.painel + '/');
  await P.ate("!document.querySelector('#v-entrar').hidden");
  await P.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = ${JSON.stringify(s.adminLogin)}; f.senha.value = ${JSON.stringify(s.adminSenha)}; f.requestSubmit(); return 1; })()`);
  await P.ate("!document.querySelector('#v-app').hidden");
  await P.avalia(`location.hash = '#/r2/${t}'; 1`);
  // desde 18/10/2026 o vídeo e os lances ficam em "Vídeo analisado": o "Tenho o vídeo do jogador" liga a seção e, com o vídeo no painel,
  // o "Marcar lances" abre a Leitura
  await P.ate("!document.querySelector('#v-editor').hidden && /Vídeo enviado/.test(document.querySelector('#va-info').textContent)", 15000);
  await P.avalia("(() => { const c = document.querySelector('#c-tem-video'); if (!c.checked) c.click(); return 1; })()");
  ok(await P.ate("!document.querySelector('#vd-bloco').hidden && !document.querySelector('#va-lances').hidden", 8000), 'com "Tenho o vídeo do jogador", a seção mostra o vídeo enviado e o "Marcar lances"');
  await P.avalia("document.querySelector('#va-lances').click(); 1");
  ok(await P.ate(`document.querySelector('#leitura').open && document.querySelector('#lt-video').getAttribute('src') === '/api/video?t=${t}' && document.querySelector('#lt-video').readyState >= 1`, 20000),
    'no painel, a Leitura abre com o vídeo do atleta tocando pelo /api/video (com o login)');
  ok(/Autorizado por/.test(await P.avalia("document.querySelector('#lt-autorizado').textContent")) && (await P.avalia("document.querySelectorAll('#lt-lances tr[data-i]').length")) === 6,
    'mostra quem autorizou e os 6 lances salvos');
  const jsonLeitura = path.join(temp, 'leitura.json');
  fs.writeFileSync(jsonLeitura, JSON.stringify({ origem: 'equipe', criterio: 'todos', lances: lances.slice(0, 5).concat([{ t: 12, tipo: 'Bicicleta', leitura: 'bom' }]), fortes: ['Passe curto'], prioridades: ['Bote'] }));
  await P.arquivos('#lt-json', [jsonLeitura]);
  ok(await P.ate("!document.querySelector('#lt-json-erros').hidden && /Bicicleta/.test(document.querySelector('#lt-json-erros').textContent) && document.querySelectorAll('#lt-lances tr[data-i]').length === 5"),
    'importar o JSON: o lance com tipo fora da lista fica de fora e aparece na lista de erros');
  await P.avalia("document.querySelector('#lt-salvar').click(); 1");
  ok(await P.ate("/Leitura salva/.test(document.querySelector('#aviso').textContent)"), 'salvar a leitura: "Leitura salva. Ela já aparece no slide 17."');
  const gEq = await admin.get('/api/leitura?t=' + t);
  ok(gEq.j.leitura.origem === 'equipe' && gEq.j.leitura.lances.length === 5 && gEq.j.leitura.criterio === 'todos', 'o que a tela salvou chegou na rota (Equipe, 5 lances, todos)');
  await D.vai('about:blank'); await D.vai(s.deck + '/?a=' + t + '#17');
  ok(await D.ate(`/Leitura da equipe/.test(${TXT}) && !/Leitura do Zyron/.test(${TXT})`, 8000), 'com Equipe, o 17 diz "Leitura da equipe" e não fala em leitura do Zyron');
  await P.avalia("document.querySelector('#lt-fechar').click(); 1");

  /* ---------- vencido, trocar e apagar ---------- */
  const regPath = path.join(s.dados, 'atletas', t + '.json');
  const r0 = JSON.parse(fs.readFileSync(regPath, 'utf8'));
  r0.video.venceEm = new Date(Date.now() - 60000).toISOString();
  fs.writeFileSync(regPath, JSON.stringify(r0));
  const pubV = await anon.get('/api/r2?t=' + t, { origem: s.deck });
  const [vV, vVDono] = [await faixa(anon, 0, 9), await faixa(admin, 0, 9)];
  ok(pubV.status === 200 && pubV.j.estado === 'ok' && !pubV.j.video && !pubV.j.leitura && vV.status === 404 && vVDono.status === 404, 'vídeo vencido: some do /api/r2 e /api/video dá 404, até pro dono');
  await D.vai('about:blank'); await D.vai(s.deck + '/?a=' + t + '#17');
  ok(await D.ate(`!document.querySelector('#v-atleta').getAttribute('src') && [...${ATIVO}.querySelectorAll('[data-ifnot="videoOk"]')].some(${VIS})`, 8000), 'no deck, o 17 volta sozinho pra leitura ao vivo');
  const lv = await admin.get('/api/leitura?t=' + t);
  ok(lv.j.vencido === true && lv.j.valido === false, 'o painel mostra o vídeo como vencido');
  const limpa = await admin.put('/api/leitura?t=' + t, { autorizar: true });
  ok(limpa.status === 200 && !fs.existsSync(pVideo) && !fs.existsSync(pCapa), 'o próximo salvamento apaga os arquivos do vídeo vencido');

  const arq2 = 'videos/' + t + '/' + nomeAleatorio() + '.mp4', p2 = poeArquivo(arq2, VIDEO);
  const reg2 = await admin.put('/api/leitura?t=' + t, { video: { arquivo: arq2, tipo: 'video/mp4', bytes: buf.length, duracaoS: dur } });
  await admin.put('/api/leitura?t=' + t, { leitura: Object.assign({}, leitura, { lances: lances.slice(0, 2) }) });
  const arq3 = 'videos/' + t + '/' + nomeAleatorio() + '.mp4', p3 = poeArquivo(arq3, VIDEO);
  const troca = await admin.put('/api/leitura?t=' + t, { video: { arquivo: arq3, tipo: 'video/mp4', bytes: buf.length, duracaoS: dur } });
  ok(reg2.status === 200 && troca.status === 200 && !fs.existsSync(p2) && fs.existsSync(p3) && troca.j.leitura === null, 'trocar o vídeo apaga o arquivo anterior e os lances dele');
  const del = await admin.del('/api/leitura?t=' + t);
  const depois = await admin.get('/api/leitura?t=' + t);
  ok(del.status === 200 && !fs.existsSync(p3) && depois.j.video === null && depois.j.leitura === null, 'apagar leva o vídeo, a capa e a leitura, os arquivos também');
  const hist = ((await admin.get('/api/atletas?t=' + t)).j.registro.historico || []).map(h => h.o);
  ok(['registrou a autorização do vídeo', 'enviou o vídeo (sai do ar em 24 horas)', 'salvou a leitura (6 lances)', 'salvou a leitura (6 lances, sem a fonte)', 'apagou o vídeo e a leitura'].every(x => hist.includes(x)), 'o histórico do R2 anota autorização, envio, leitura (com e sem a fonte) e apagar');

  /* ---------- importar do painel atual ---------- */
  const listaT = async () => ((await admin.get('/api/atletas')).j.itens || []).map(a => a.t).sort().join(',');
  const antes = await listaT();
  const dia = new Date(Date.now() + 4 * 864e5);
  const pSP = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(dia).map(x => [x.type, x.value]));
  const FICHA_LA = { nome: 'Lucas Almeida', idade: '15 anos', posicao: 'volante', cidade: 'Natal', pe: 'Destro', altura: '172 cm', origem: 'Zyron', caracteristicas: 'leitura de jogo',
    plano: 'Scouting PRO', vagas: '4', prazoContato: 'Ainda Hoje', prazoZyron: 'amanhã cedo', r2dia: 'quinta, ' + pSP.day + '/' + pSP.month, r2hora: '19h30' };
  responde = () => json(200, { ficha: FICHA_LA, video: { ok: true, duracaoS: 30 }, leitura: { origem: 'zyron', lances: [{ t: 1, tipo: 'Passe', leitura: 'bom' }] } });
  const im = await admin.post('/api/importar', { id: 'https://jogador-de-elite-r2.vercel.app/?a=lucas-almeida-x7k2m9pq' });
  ok(im.status === 200 && chamadas[chamadas.length - 1] === PAINEL_ATUAL + '/api/publico?id=lucas-almeida-x7k2m9pq', 'importar busca o endereço fixo do painel atual, com o código tirado do link');
  const f = im.j.ficha || {};
  ok(f.nome === 'Lucas Almeida' && f.idade === '15' && f.altura === '172' && f.posicao === 'volante' && f.cidade === 'Natal' && f.pe === 'Destro', 'a ficha vem mapeada (idade e altura só com o número)');
  ok(f.plano === 'Assessoria PRO', 'plano com o nome antigo (Scouting PRO) vira Assessoria PRO');
  ok(f.prazoContato === 'ainda hoje' && !f.prazoZyron && im.j.fora.some(x => /Zyron começa/.test(x)), 'prazo da lista fixa entra; prazo fora da lista fica de fora e vai pra lista de conferir');
  ok(f.r2data === pSP.year + '-' + pSP.month + '-' + pSP.day && f.r2hm === '19:30', 'dia e hora da call viram data e hora (' + f.r2data + ', ' + f.r2hm + ')');
  ok(!f.vagas && im.j.fora.some(x => /Vagas/.test(x)), 'vagas são do Legacy: com a Assessoria PRO, ficam de fora e vão pra lista');
  ok(!/lances|duracao|"video"/.test(im.texto), 'só a ficha: nada do vídeo nem da leitura de lá');
  ok((await listaT()) === antes, 'importar não salva nada (a lista de R2 não mudou)');
  const n0 = chamadas.length;
  const soCodigo = await admin.post('/api/importar', { id: 'lucas-almeida-x7k2m9pq' });
  const ruim = await admin.post('/api/importar', { id: 'https://outro.exemplo/x?a=../../etc' });
  const outroHost = await admin.post('/api/importar', { id: 'https://outro.exemplo/r2/?a=abcdef12' });
  ok(soCodigo.status === 200 && ruim.status === 400 && chamadas.length === n0 + 2 && chamadas[chamadas.length - 1] === PAINEL_ATUAL + '/api/publico?id=abcdef12',
    'aceita só o código; código fora do formato dá 400 sem buscar nada; link de outro endereço usa só o código');
  ok(chamadas.every(u => u.startsWith(PAINEL_ATUAL + '/api/publico?id=')), 'nenhuma busca saiu pra outro endereço (' + chamadas.length + ' buscas, todas no painel atual)');
  responde = () => json(404, { erro: 'não achei' });
  const nf = await admin.post('/api/importar', { id: 'nao-existe-123' });
  responde = () => { throw new TypeError('fetch failed'); };
  const caiu = await admin.post('/api/importar', { id: 'lucas-almeida-x7k2m9pq' });
  responde = () => new Response('<html>oi</html>', { status: 200, headers: { 'content-type': 'text/html' } });
  const estranho = await admin.post('/api/importar', { id: 'lucas-almeida-x7k2m9pq' });
  responde = () => json(200, { ficha: { idade: '15' } });
  const semNome = await admin.post('/api/importar', { id: 'lucas-almeida-x7k2m9pq' });
  const semLogin = await anon.post('/api/importar', { id: 'lucas-almeida-x7k2m9pq' });
  ok(nf.status === 404 && caiu.status === 502 && estranho.status === 502 && semNome.status === 400 && semLogin.status === 401,
    'respostas: não achou (404), painel atual fora do ar (502), resposta estranha (502), sem nome (400), sem login (401)');

  // na tela: o diálogo, a ficha no editor e a lista do que não veio, sem salvar
  responde = () => json(200, { ficha: FICHA_LA });
  await P.avalia("location.hash = '#/'; 1");
  await P.ate("!document.querySelector('#v-lista').hidden");
  await P.avalia("document.querySelector('#bt-importar').click(); 1");
  await P.ate("document.querySelector('#d-importar').open");
  await P.avalia("(() => { document.querySelector('#di-link').value = 'https://jogador-de-elite-r2.vercel.app/?a=lucas-almeida-x7k2m9pq'; document.querySelector('#f-importar').requestSubmit(); return 1; })()");
  const el = n => `document.querySelector('#f-editor').elements.namedItem('${n}').value`;
  ok(await P.ate(`!document.querySelector('#v-editor').hidden && ${el('nome')} === 'Lucas Almeida' && ${el('plano')} === 'Assessoria PRO' && ${el('idade')} === '15' && ${el('prazoContato')} === 'ainda hoje'`),
    'na tela: a ficha importada entra no editor de um R2 novo');
  ok(/Não vieram/.test(await P.avalia("document.querySelector('#ed-erro').textContent")) && /Zyron começa/.test(await P.avalia("document.querySelector('#ed-erro').textContent")), 'e o editor lista o que não veio, pra conferir na mão');
  ok((await listaT()) === antes, 'nada foi salvo antes do closer conferir');
  const exc = [D, P].flatMap(a => a.console_.filter(m => /^EXC/.test(m)));
  ok(!exc.length, 'nenhuma exceção de JavaScript' + (exc.length ? ': ' + exc.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha();
  await s.fecha();
  globalThis.fetch = fetchReal;
  try { fs.rmSync(temp, { recursive: true, force: true }); } catch { /* nada */ }
}
fim();
