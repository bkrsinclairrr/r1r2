// Gera os segredos do Painel do Closer direto no .env.local desta pasta (o .vercelignore e o .gitignore seguram esse
// arquivo) e imprime SÓ a senha inicial do admin, uma vez. Uso, uma vez só: node gera-segredos.mjs
// Não lê nem sobrescreve um .env.local que já exista. Pra gerar de novo, apague o arquivo e rode outra vez: a senha do
// admin muda e quem estiver logado sai (o PAINEL_SEGREDO novo invalida os cookies).
// O BLOB_READ_WRITE_TOKEN não entra aqui: a Vercel cria quando a loja de Blob nova é ligada ao projeto (passo 3 do
// PASSO-A-PASSO-VARIAVEIS.md). Nunca use o token da loja do painel atual.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ARQ = path.join(AQUI, '.env.local');
const DECK = 'https://jogador-de-elite-r2-novo.vercel.app';

if (fs.existsSync(ARQ)) {
  console.error('Já existe um .env.local nesta pasta e eu não mexi nele. Pra gerar de novo, apague o arquivo e rode outra vez.');
  process.exit(1);
}

// senha de 4 grupos de 4, sem as letras e números que se confundem (0 e o, 1 e l, i)
const ALFA = 'abcdefghjkmnpqrstuvwxyz23456789';
const senha = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => ALFA[crypto.randomInt(ALFA.length)]).join('')).join('-');
// o mesmo formato do hashSenha do api/_base.js: scrypt$<sal em hex>$<hash em hex>
const sal = crypto.randomBytes(16);
const hash = 'scrypt$' + sal.toString('hex') + '$' + crypto.scryptSync(senha, sal, 64).toString('hex');
const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

const linhas = [
  '# Painel do Closer (projeto jogador-de-elite-closer): variáveis de produção, geradas pelo gera-segredos.mjs em ' + hoje + '.',
  '# Não versionar, não copiar pra outro projeto, não colar em chat. O ENVIA-VARIAVEIS.bat manda estas linhas pra Vercel.',
  'PAINEL_SEGREDO=' + crypto.randomBytes(48).toString('base64url'),
  'PAINEL_ADMIN_LOGIN=admin',
  // aspas simples: o valor tem $ e não pode ser lido como variável
  "PAINEL_ADMIN_HASH='" + hash + "'",
  'CRON_SECRET=' + crypto.randomBytes(32).toString('base64url'),
  'DECK_ORIGINS=' + DECK,
  'DECK_URL=' + DECK,
  '# BLOB_READ_WRITE_TOKEN: a Vercel cria quando a loja de Blob nova é ligada ao projeto. Nunca o da loja do painel atual.',
  ''
];
// wx: falha se o arquivo aparecer entre a conferência lá de cima e aqui (nunca sobrescreve)
fs.writeFileSync(ARQ, linhas.join('\n'), { flag: 'wx', mode: 0o600 });

// confere com a função de login do próprio painel que a senha bate com o hash gravado
let confere = null;
try { ({ confereSenha: confere } = await import(pathToFileURL(path.join(AQUI, 'api', '_base.js')).href)); } catch { confere = null; }
if (confere && !confere(senha, hash)) {
  fs.rmSync(ARQ);
  console.error('A senha não bateu com o hash na conferência do painel. Apaguei o .env.local; rode de novo.');
  process.exit(1);
}

console.log('.env.local criado nesta pasta com PAINEL_SEGREDO, PAINEL_ADMIN_LOGIN, PAINEL_ADMIN_HASH, CRON_SECRET, DECK_ORIGINS e DECK_URL.');
console.log('Senha inicial do admin (login: admin): ' + senha);
console.log('Ela não fica salva em lugar nenhum. Anote agora e troque no primeiro acesso (Trocar senha, no painel).');
