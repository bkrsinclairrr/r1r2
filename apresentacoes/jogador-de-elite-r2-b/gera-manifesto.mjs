// Gera o variacoes.json do R2 novo: a lista das páginas do deck (a raiz e variacoes/<slug>/) com o que o Painel do Closer precisa
// saber de cada uma. O Painel lê esse arquivo sozinho, e é assim que uma página nova do deck aparece lá sem ninguém cadastrar nada.
//
// A fonte de cada dado é a própria página: um bloco JSON no <head> (id="r2-variacao") com nome, resumo, quando usar, classificação
// de partida, o que mostra do lead e os slides opcionais (id, rótulo e ajuda). O resto vem da página: o id e o caminho vêm da pasta,
// o número de slides e a posição de cada slide opcional vêm do HTML, e o hash do arquivo diz se o manifesto ficou velho.
//
// Uso:  node gera-manifesto.mjs              escreve o variacoes.json (rode antes de publicar o deck)
//       node gera-manifesto.mjs --confere    não escreve: sai com erro se o variacoes.json não é o que as páginas dizem
//       node gera-manifesto.mjs <pasta>      outra pasta de deck (testes)
// Página nova: copie variacoes/tecnica/ pra variacoes/<slug>/, troque o bloco r2-variacao e rode isto. Ver COMO-ACRESCENTAR-VERSAO.md
// (na pasta do painel).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ARGS = process.argv.slice(2);
const CONFERE = ARGS.includes('--confere');
const RAIZ = path.resolve(ARGS.find(a => !a.startsWith('--')) || AQUI);
const SLUG_OK = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const VALIDACOES = ['validada', 'em-validacao', 'nao-validada'];
const BLOCO = /<script type="application\/json" id="r2-variacao">([\s\S]*?)<\/script>/;
const MARCAS = new RegExp('[' + String.fromCharCode(0x300) + '-' + String.fromCharCode(0x36f) + ']', 'g'); // acentos soltos depois do NFD
const TRAVESSAO = new RegExp('[' + String.fromCharCode(0x2014, 0x2013) + ']');

const erros = [];
const erro = (onde, msg) => erros.push(onde + ': ' + msg);
const texto = (onde, campo, v, max, obrig) => {
  if (v === undefined || v === null || v === '') { if (obrig) erro(onde, 'falta "' + campo + '" no bloco r2-variacao'); return ''; }
  if (typeof v !== 'string') { erro(onde, '"' + campo + '" tem que ser texto'); return ''; }
  const t = v.replace(/\s+/g, ' ').trim();
  if (t.length > max) erro(onde, '"' + campo + '" passa de ' + max + ' letras');
  if (/[<>]/.test(t)) erro(onde, '"' + campo + '" não pode ter < ou >');
  if (TRAVESSAO.test(t)) erro(onde, '"' + campo + '" tem travessão (a casa não usa)');
  return t;
};

// as páginas do deck: a raiz é a principal; cada pasta de variacoes/ com index.html é uma variação (o nome da pasta é o id)
function paginasDoDeck() {
  const lista = [{ id: 'principal', caminho: '/', arq: path.join(RAIZ, 'index.html') }];
  const dir = path.join(RAIZ, 'variacoes');
  if (fs.existsSync(dir)) {
    for (const nome of fs.readdirSync(dir).sort()) {
      const arq = path.join(dir, nome, 'index.html');
      if (fs.statSync(path.join(dir, nome)).isDirectory() && fs.existsSync(arq)) lista.push({ id: nome, caminho: '/variacoes/' + nome + '/', arq });
    }
  }
  return lista;
}

function lePagina(p) {
  const onde = p.id === 'principal' ? 'index.html' : 'variacoes/' + p.id + '/index.html';
  if (!fs.existsSync(p.arq)) { erro(onde, 'o arquivo não existe'); return null; }
  if (!SLUG_OK.test(p.id) || p.id.length > 40) { erro(onde, 'o nome da pasta tem que ser letras minúsculas, números e hífen (até 40)'); return null; }
  const bytes = fs.readFileSync(p.arq);
  const html = bytes.toString('utf8');
  const m = BLOCO.exec(html);
  if (!m) { erro(onde, 'falta o bloco <script type="application/json" id="r2-variacao"> no <head>'); return null; }
  let b;
  try { b = JSON.parse(m[1]); } catch (e) { erro(onde, 'o bloco r2-variacao não é um JSON válido (' + e.message + ')'); return null; }
  if (!b || typeof b !== 'object' || Array.isArray(b)) { erro(onde, 'o bloco r2-variacao tem que ser um objeto'); return null; }
  const nome = texto(onde, 'nome', b.nome, 40, true), resumo = texto(onde, 'resumo', b.resumo, 300, true), quando = texto(onde, 'quando', b.quando, 300, true);
  if (nome && nome.length < 2) erro(onde, '"nome" é curto demais');
  if (b.validacao !== undefined && !VALIDACOES.includes(b.validacao)) erro(onde, '"validacao" tem que ser ' + VALIDACOES.join(', '));
  const lead = { nome: true, foto: true };
  if (b.lead !== undefined) {
    if (!b.lead || typeof b.lead !== 'object' || Array.isArray(b.lead) || ['nome', 'foto'].some(k => b.lead[k] !== undefined && typeof b.lead[k] !== 'boolean')) erro(onde, '"lead" tem que ser { "nome": true|false, "foto": true|false }');
    else { if (b.lead.nome !== undefined) lead.nome = b.lead.nome; if (b.lead.foto !== undefined) lead.foto = b.lead.foto; }
  }
  if (!lead.nome) lead.foto = false; // a foto só aparece com o nome
  // os slides da página, na ordem, e o data-opcional de cada um
  const semComentarios = html.replace(/<!--[\s\S]*?-->/g, ''); // uma tag citada num comentário não é slide
  const secoes = [...semComentarios.matchAll(/<section\b[^>]*\bclass="slide[^"]*"[^>]*>/g)].map(x => x[0]);
  const noHtml = [];
  secoes.forEach((tag, i) => { const o = /\bdata-opcional="([^"]*)"/.exec(tag); if (o) noHtml.push([o[1], i + 1]); });
  const declarados = Array.isArray(b.opcionais) ? b.opcionais : (b.opcionais === undefined ? [] : null);
  if (declarados === null) erro(onde, '"opcionais" tem que ser uma lista');
  const opcionais = [];
  (declarados || []).forEach((o, i) => {
    if (!o || typeof o !== 'object') { erro(onde, 'opcionais[' + i + '] tem que ser um objeto'); return; }
    if (typeof o.id !== 'string' || !SLUG_OK.test(o.id)) { erro(onde, 'opcionais[' + i + '].id tem que ser letras minúsculas, números e hífen'); return; }
    if (opcionais.some(x => x.id === o.id)) { erro(onde, 'o opcional "' + o.id + '" aparece duas vezes'); return; }
    const noSlide = noHtml.filter(([id]) => id === o.id);
    if (noSlide.length !== 1) { erro(onde, 'o opcional "' + o.id + '" está declarado mas ' + (noSlide.length ? 'aparece em mais de um slide' : 'nenhum slide tem data-opcional="' + o.id + '"')); return; }
    opcionais.push({ id: o.id, slide: noSlide[0][1], rotulo: texto(onde, 'opcionais[' + i + '].rotulo', o.rotulo, 60, true), ajuda: texto(onde, 'opcionais[' + i + '].ajuda', o.ajuda, 200, true) });
  });
  noHtml.forEach(([id]) => { if (!(declarados || []).some(o => o && o.id === id)) erro(onde, 'o slide com data-opcional="' + id + '" não está declarado em "opcionais" do bloco r2-variacao'); });
  if (!secoes.length) erro(onde, 'a página não tem nenhum slide (<section class="slide">)');
  return {
    id: p.id, caminho: p.caminho, nome, resumo, quando, validacao: b.validacao || 'nao-validada', lead, slides: secoes.length, opcionais,
    hash: crypto.createHash('sha1').update(bytes).digest('hex')
  };
}

const lidas = paginasDoDeck().map(lePagina).filter(Boolean);
const nomes = new Map();
lidas.forEach(p => {
  const k = p.nome.normalize('NFD').replace(MARCAS, '').toLowerCase();
  if (nomes.has(k)) erro(p.id, 'o nome "' + p.nome + '" já é de outra página (' + nomes.get(k) + ')');
  nomes.set(k, p.id);
});
if (erros.length) {
  console.error('Não gerei o variacoes.json. Ajuste:\n - ' + erros.join('\n - '));
  process.exit(1);
}

const saida = path.join(RAIZ, 'variacoes.json');
const sem = m => JSON.stringify({ v: m.v, paginas: m.paginas });
const novo = { v: 1, gerado: new Date().toISOString(), paginas: lidas };
if (CONFERE) {
  let atual = null;
  try { atual = JSON.parse(fs.readFileSync(saida, 'utf8')); } catch { /* sem arquivo */ }
  if (!atual) { console.error('O variacoes.json não existe ou não é um JSON válido. Rode: node gera-manifesto.mjs'); process.exit(1); }
  if (sem(atual) !== sem(novo)) {
    const ids = new Set([...lidas.map(p => p.id), ...(atual.paginas || []).map(p => p.id)]);
    const velhas = [...ids].filter(id => JSON.stringify((atual.paginas || []).find(p => p.id === id)) !== JSON.stringify(lidas.find(p => p.id === id)));
    console.error('O variacoes.json está desatualizado (' + velhas.join(', ') + '). Rode: node gera-manifesto.mjs');
    process.exit(1);
  }
  console.log('variacoes.json em dia: ' + lidas.length + ' páginas (' + lidas.map(p => p.id).join(', ') + ').');
} else {
  fs.writeFileSync(saida, JSON.stringify(novo, null, 2) + '\n', 'utf8');
  console.log('variacoes.json gerado: ' + lidas.length + ' páginas (' + lidas.map(p => p.id).join(', ') + ').');
}
