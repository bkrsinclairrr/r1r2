// O mapa-calor.js mora aqui (na raiz do painel) e vai igual, byte a byte, pra assets/ dos três decks do R2 (R2 novo, R2 B e R2 anterior).
// Mudou o mapa-calor.js? Rode na pasta do painel: node copia-mapa-calor.mjs   (só conferir, sem copiar: node copia-mapa-calor.mjs --confere)
// O testes/teste-igualdade.mjs confere as quatro cópias. Fica fora do deploy (.vercelignore).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DECKS = ['jogador-de-elite-r2-novo', 'jogador-de-elite-r2-b', 'jogador-de-elite-r2'];
const fonte = fs.readFileSync(path.join(AQUI, 'mapa-calor.js'));
const confere = process.argv.includes('--confere');
let diferentes = 0;
for (const d of DECKS) {
  const alvo = path.join(AQUI, '..', d, 'assets', 'mapa-calor.js');
  const igual = fs.existsSync(alvo) && Buffer.compare(fs.readFileSync(alvo), fonte) === 0;
  if (igual) { console.log('igual: ' + d); continue; }
  if (confere) { console.log('DIFERENTE: ' + d); diferentes++; continue; }
  fs.writeFileSync(alvo, fonte);
  console.log('copiado: ' + d);
}
if (diferentes) { console.log(diferentes + ' cópia(s) diferente(s). Rode sem --confere pra copiar.'); process.exit(1); }
