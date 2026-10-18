// Gera assets/bloco-roteiro.js e assets/bloco-roteiro-tecnica.js para os decks que ligam o roteiro pelo data-roteiro
// (R2 anterior e variacoes: window.ROTEIROS_EXTRAS, lido pelo ordem-garantia.js). O texto vem das entradas do R2 novo
// (roteiro.js e variacoes/tecnica.js), com as referencias a numero de slide trocadas por nome (o R2 anterior tem outra numeracao).
// Uso: node gera-bloco-roteiro.mjs <pasta-do-r2-novo> <pasta-de-saida-dos-assets>
import fs from 'node:fs';
import path from 'node:path';

const [, , novo, saida] = process.argv;
const carrega = (rel, ...extra) => {
  const w = {};
  new Function('window', 'document', ...extra, fs.readFileSync(path.join(novo, rel), 'utf8'))(w, {});
  return w;
};
const padrao = carrega('assets/roteiro.js').ROTEIRO;
const wt = {};
// a tecnica le window.ROTEIRO do padrao (PADRAO) e troca; rodo as duas na mesma janela, como o navegador
new Function('window', 'document', fs.readFileSync(path.join(novo, 'assets/roteiro.js'), 'utf8') + '\n' + fs.readFileSync(path.join(novo, 'assets/variacoes/tecnica.js'), 'utf8'))(wt, {});
const tecnica = wt.ROTEIRO;

const NOMES = {
  metodo: 'O método: a IA encontra, a gente conduz',
  campo: ['O campo: olhômetro × IA', 'O campo: observação × IA'],
  encaixe: 'O encaixe: não precisa ser o próximo Neymar',
  registro: '326 atletas enviados',
  clubes: 'Clubes e parceiros',
  rostos: 'Cada rosto, uma história'
};
// numero de slide do R2 novo -> nome (o R2 anterior numera diferente; o 04 e o do olhometro na numeracao de origem dele)
const TROCAS = [
  ['vem no 11, logo depois', 'vem adiante, nos planos, logo depois'],
  ['o ritmo está no 11.', 'o ritmo vem adiante, nos planos.'],
  ['O ritmo da parte humana está no 11: não repita aqui.', 'O ritmo da parte humana de cada plano vem adiante: não repita aqui.'],
  ['o ritmo está no 11, logo depois', 'o ritmo vem adiante, nos planos'],
  ['Complementa o 12 (o seu lugar em campo)', 'Complementa o slide "O seu lugar em campo"'],
  ['As peneiras a família já contou no 03', 'As peneiras a família já contou no 04'],
  ['(o mosaico do 24', '(o mosaico']
];
const limpa = v => typeof v === 'string' ? TROCAS.reduce((s, [a, b]) => s.split(a).join(b), v) : Array.isArray(v) ? v.map(limpa) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, limpa(x)])) : v;
const pega = (lista, nome) => { const r = lista.find(x => x && x.nome === nome); if (!r) throw new Error('nao achei a entrada: ' + nome); return limpa(JSON.parse(JSON.stringify(r))); };

function arquivo(lista, tom) {
  const o = {};
  for (const [id, nome] of Object.entries(NOMES)) o['bloco-' + id] = pega(lista, Array.isArray(nome) ? nome[tom === 'tecnica' ? 1 : 0] : nome);
  const cab = '/* Roteiro dos seis slides do Bloco Voxen | Zyron (17/10/2026, trazidos da pagina /institucional) para os decks que ligam o roteiro\n' +
    '   pelo data-roteiro (R2 anterior e variacoes): o ordem-garantia.js le window.ROTEIROS_EXTRAS. ' + (tom === 'tecnica' ? 'Versao tecnica (de par pra par).' : 'Versao padrao.') + '\n' +
    '   Gerado por ferramentas-r2/gera-bloco-roteiro.mjs a partir do roteiro do R2 novo; mudou la? Gere de novo. Carrega antes do ordem-garantia.js. */\n';
  return cab + '(function () {\n  \'use strict\';\n  window.ROTEIROS_EXTRAS = Object.assign(window.ROTEIROS_EXTRAS || {}, ' + JSON.stringify(o, null, 2).replace(/^/gm, '  ').trimStart() + ');\n})();\n';
}
fs.writeFileSync(path.join(saida, 'bloco-roteiro.js'), arquivo(padrao, 'padrao'), 'utf8');
fs.writeFileSync(path.join(saida, 'bloco-roteiro-tecnica.js'), arquivo(tecnica, 'tecnica'), 'utf8');
// confere: nenhum numero de slide de dois digitos sobrou (alem dos que o ordem-garantia converte, que ficam em origem)
for (const f of ['bloco-roteiro.js', 'bloco-roteiro-tecnica.js']) {
  const t = fs.readFileSync(path.join(saida, f), 'utf8');
  const sobras = [...t.matchAll(/\b(?:no|do|o|slides?) (\d{2})\b/g)].map(m => m[0]);
  console.log(f + ': ' + Object.keys(NOMES).length + ' entradas' + (sobras.length ? ' | referencias de numero que sobraram: ' + sobras.join('; ') : ' | sem referencia de numero'));
}
