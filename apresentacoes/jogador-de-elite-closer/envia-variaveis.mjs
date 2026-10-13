// Manda as variáveis do .env.local desta pasta pro projeto jogador-de-elite-closer na Vercel (ambiente Production).
// Roda pelo ENVIA-VARIAVEIS.bat, na máquina do dono, depois do gera-segredos.mjs e do "vercel link". Não imprime
// nenhum valor. Só manda as 6 desta lista: o BLOB_READ_WRITE_TOKEN a Vercel cria quando a loja de Blob é ligada.
// Trava: se esta pasta estiver ligada a outro projeto (o painel atual, por exemplo), para sem mandar nada.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const NOMES = ['PAINEL_SEGREDO', 'PAINEL_ADMIN_LOGIN', 'PAINEL_ADMIN_HASH', 'CRON_SECRET', 'DECK_ORIGINS', 'DECK_URL'];
// os três segredos entram como Secret (ninguém lê de volta no painel da Vercel); endereços e login, como Config
const SEGREDOS = ['PAINEL_SEGREDO', 'PAINEL_ADMIN_HASH', 'CRON_SECRET'];
const PROJETO = /^jogador-de-elite-closer(-2)?$/;

const arq = path.join(AQUI, '.env.local');
if (!fs.existsSync(arq)) { console.error('Não achei o .env.local nesta pasta. Rode antes: node gera-segredos.mjs'); process.exit(1); }
let projeto = {};
try { projeto = JSON.parse(fs.readFileSync(path.join(AQUI, '.vercel', 'project.json'), 'utf8')); } catch { projeto = null; }
if (!projeto || !projeto.projectId) { console.error('Esta pasta ainda não está ligada a um projeto da Vercel. Rode o ENVIA-VARIAVEIS.bat (ele liga antes de mandar).'); process.exit(1); }
if (!PROJETO.test(String(projeto.projectName || ''))) {
  console.error('Esta pasta está ligada ao projeto "' + (projeto.projectName || projeto.projectId) + '", não ao jogador-de-elite-closer. Não mandei nada.');
  console.error('Apague a pasta .vercel daqui e rode o ENVIA-VARIAVEIS.bat de novo.');
  process.exit(1);
}

const valores = {};
for (const linha of fs.readFileSync(arq, 'utf8').split(/\r?\n/)) {
  if (/^\s*#/.test(linha)) continue;
  const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(linha);
  if (!m) continue;
  let v = m[2];
  if (/^'.*'$/.test(v) || /^".*"$/.test(v)) v = v.slice(1, -1);
  valores[m[1]] = v;
}

// npx pelo cmd no Windows (o .cmd não roda sem ele); os argumentos são fixos, nenhum vem de fora
const npx = (args, entrada) => {
  const op = { cwd: AQUI, input: entrada, stdio: ['pipe', 'ignore', 'pipe'], encoding: 'utf8' };
  return process.platform === 'win32' ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npx ' + args.join(' ')], op) : spawnSync('npx', args, op);
};

console.log('Projeto: ' + projeto.projectName + '. Mandando ' + NOMES.length + ' variáveis pra Production (os valores não aparecem).\n');
let falhas = 0;
for (const nome of NOMES) {
  if (!valores[nome]) { console.log('FALTA   ' + nome + ' (não está no .env.local)'); falhas++; continue; }
  // o valor vai pela entrada padrão, nunca na linha de comando
  const tipo = SEGREDOS.includes(nome) ? '--sensitive' : '--no-sensitive';
  const r = npx(['--yes', 'vercel', 'env', 'add', nome, 'production', tipo, '--yes', '--non-interactive'], valores[nome]);
  if (r.status === 0) console.log('OK      ' + nome);
  else {
    falhas++;
    const msg = String(r.stderr || '').split(/\r?\n/).filter(l => l.trim() && !l.includes(valores[nome])).slice(-2).join(' ');
    console.log('FALHOU  ' + nome + (/already exists|já existe/i.test(msg) ? ' (já existe no projeto: apague em Settings, Environment Variables, e rode de novo)' : msg ? ' (' + msg.slice(0, 200) + ')' : ''));
  }
}
console.log(falhas ? '\n' + falhas + ' variável(is) não foram. Veja o passo 2 do PASSO-A-PASSO-VARIAVEIS.md (dá pra fazer na mão).' : '\nPronto: as 6 variáveis estão no projeto. Agora o passo 3 (a loja de Blob).');
process.exitCode = falhas ? 1 : 0;
