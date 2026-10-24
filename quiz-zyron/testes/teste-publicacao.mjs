// Publicação: a PRÉVIA na Vercel (nunca produção). Confere: / responde 200 com X-Robots-Tag noindex; o MP3 com Content-Type
// audio/mpeg e Accept-Ranges bytes (pedido parcial 206); cada arquivo publicado idêntico ao local (sha256, o mesmo que curl mais cmp);
// robots.txt bloqueando tudo; e capturas da T01 e da T14 tiradas do endereço publicado (em modo de ensaio: sem endpoint, nada sai).
// Prévia com a proteção da Vercel ligada (pede login): as conferências de HTTP passam pela CLI logada (`vercel curl`, que faz o bypass
// sem ninguém ler token), e as capturas no ar ficam como aviso: com os arquivos idênticos, a tela é a das capturas locais.
// Uso: node testes/teste-publicacao.mjs https://quiz-zyron-xxxx.vercel.app
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { abreChrome, espera, verificador } from './_cdp.mjs';
import { quiz, caminhoCompleto } from './_quiz.mjs';
import { arquivos, RAIZ } from './_util.mjs';

const { ok, fim } = verificador('Publicação');
const base = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https:\/\/[\w.-]+\.vercel\.app$/.test(base)) { console.log('Uso: node testes/teste-publicacao.mjs https://<prévia>.vercel.app'); process.exit(2); }
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qz-pub-'));

// pedido direto (prévia aberta) ou pela CLI (prévia protegida): { status, cab (minúsculas), corpo (Buffer) }
async function direto(caminho, { range } = {}) {
  const r = await fetch(base + caminho, { redirect: 'manual', headers: range ? { Range: range } : {} });
  const cab = {}; r.headers.forEach((v, k) => { cab[k] = v; });
  return { status: r.status, cab, corpo: Buffer.from(await r.arrayBuffer()) };
}
function pelaCli(caminho, { range } = {}) {
  const corpoArq = path.join(tmp, 'corpo'), cabArq = path.join(tmp, 'cab');
  [corpoArq, cabArq].forEach(f => fs.rmSync(f, { force: true }));
  const extra = ['--silent', '--output', corpoArq, '--dump-header', cabArq].concat(range ? ['--range', range.replace(/^bytes=/, '')] : []);
  execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['--yes', 'vercel', 'curl', caminho || '/', '--deployment', base, '--', ...extra],
    { cwd: RAIZ, stdio: 'ignore', shell: process.platform === 'win32', timeout: 120000, env: Object.assign({}, process.env, { MSYS_NO_PATHCONV: '1' }) });
  const linhas = fs.existsSync(cabArq) ? fs.readFileSync(cabArq, 'utf8').split(/\r?\n/) : [];
  const ultimoStatus = linhas.map((l, i) => [l, i]).filter(([l]) => /^HTTP\//.test(l)).pop();
  const cab = {};
  let status = 0;
  if (ultimoStatus) {
    status = parseInt(ultimoStatus[0].split(' ')[1], 10);
    for (const l of linhas.slice(ultimoStatus[1] + 1)) { const m = /^([^:]+):\s*(.*)$/.exec(l); if (m) cab[m[1].toLowerCase()] = cab[m[1].toLowerCase()] ? cab[m[1].toLowerCase()] + ', ' + m[2] : m[2]; }
  }
  return { status, cab, corpo: fs.existsSync(corpoArq) ? fs.readFileSync(corpoArq) : Buffer.alloc(0) };
}

try {
  const primeiro = await direto('/');
  const protegida = primeiro.status === 401 || primeiro.status === 403 || (primeiro.status >= 300 && primeiro.status < 400 && /vercel\.com\/(sso|login)/.test(primeiro.cab.location || ''));
  if (protegida) console.log('AVISO a prévia exige login da Vercel (proteção de implantação): as conferências passam pela CLI logada (vercel curl)');
  const pede = protegida ? async (c, op) => pelaCli(c, op) : direto;

  const r = await pede('/');
  ok(r.status === 200 && /<title>/.test(r.corpo.toString('utf8')), `/ responde ${r.status} com a página do quiz`);
  ok(/noindex/.test(r.cab['x-robots-tag'] || ''), `X-Robots-Tag: ${r.cab['x-robots-tag']}`);
  ok(/frame-ancestors 'none'/.test(r.cab['content-security-policy'] || ''), 'a política de segurança de conteúdo está no ar');

  const mp3 = await pede('/assets/audio/depoimento-mae-64k.mp3', { range: 'bytes=0-1023' });
  ok(mp3.status === 206 && /^audio\/mpeg/.test(mp3.cab['content-type'] || '') && /bytes/.test(mp3.cab['accept-ranges'] || ''), `MP3: ${mp3.status}, ${mp3.cab['content-type']}, Accept-Ranges ${mp3.cab['accept-ranges']}`);

  const rb = (await pede('/robots.txt')).corpo.toString('utf8');
  ok(/User-agent:\s*\*/i.test(rb) && /Disallow:\s*\/\s*$/m.test(rb), 'robots.txt bloqueia tudo');

  // cada arquivo publicado igual ao local (o que o .vercelignore não tira)
  const ignora = fs.readFileSync(path.join(RAIZ, '.vercelignore'), 'utf8').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const fica = rel => !ignora.some(p => p.startsWith('*.') ? rel.endsWith(p.slice(1)) : rel === p || rel.startsWith(p + '/')) && !/^(vercel\.json)$/.test(rel) && !rel.split('/').some(p => p.startsWith('.'));
  const locais = arquivos().map(f => path.relative(RAIZ, f).split(path.sep).join('/')).filter(fica);
  // em toda PRÉVIA a Vercel injeta no fim do index.html o script da barra de comentários dela (vercel.live); em produção não existe.
  // Só essa linha sai antes de comparar, e o teste avisa que ela estava lá
  const injetada = /<script[^>]*src="https:\/\/vercel\.live\/[^"]*"[^>]*><\/script>/;
  const diferentes = [];
  let barraDaVercel = false;
  for (const rel of locais) {
    const resp = await pede('/' + (rel === 'index.html' ? '' : rel));
    let corpo = resp.corpo;
    if (rel === 'index.html' && injetada.test(corpo.toString('utf8'))) { barraDaVercel = true; corpo = Buffer.from(corpo.toString('utf8').replace(injetada, '')); }
    if (resp.status !== 200 || sha(corpo) !== sha(fs.readFileSync(path.join(RAIZ, rel)))) diferentes.push(`${rel} (${resp.status})`);
  }
  if (barraDaVercel) console.log('AVISO a prévia traz o script da barra de comentários da Vercel (vercel.live), que ela injeta só em prévia');
  ok(!diferentes.length, `${locais.length} arquivos publicados idênticos aos locais` + (diferentes.length ? ': diferem ' + diferentes.slice(0, 6).join(', ') : ''));

  // T01 e T14 tiradas do endereço publicado (só com a prévia aberta: o Chrome do teste não passa pelo login da Vercel)
  if (protegida) {
    console.log('AVISO capturas da T01 e da T14 no ar não tiradas: a prévia pede login. Com os arquivos idênticos, as telas são as de capturas/390/');
  } else {
    const pasta = path.join(RAIZ, 'capturas', 'publicado');
    fs.mkdirSync(pasta, { recursive: true });
    const c = await abreChrome();
    try {
      const q = quiz(c);
      await q.abre(base + '/');
      await espera(1200);
      await c.foto(path.join(pasta, '01-posicao.png'));
      await caminhoCompleto(q, { contato: { nome: 'Teste', zap: '11955554444' } });
      await espera(1200);
      await c.foto(path.join(pasta, '14-resultado.png'));
      const fora = c.pedidos.filter(p => !p.url.startsWith(base) && !p.url.startsWith('data:'));
      ok(true, 'capturas da T01 e da T14 tiradas do endereço publicado (capturas/publicado/)');
      ok(!fora.length, 'no ar, sem pixel configurado: nenhum pedido a terceiro' + (fora.length ? ': ' + fora.map(p => p.url).slice(0, 3).join(', ') : ''));
      ok(!c.pedidos.some(p => p.metodo === 'POST'), 'sem endpoint configurado, o lead fica em modo de ensaio (nenhum POST)');
      ok(!c.console_.length, 'sem erro no console no ar' + (c.console_.length ? ': ' + c.console_.slice(0, 2).join(' | ') : ''));
    } finally { await c.fecha(); }
  }
} catch (e) {
  ok(false, 'erro: ' + e.message);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
  fim();
}
