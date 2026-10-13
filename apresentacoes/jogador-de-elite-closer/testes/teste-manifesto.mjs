// O gera-manifesto.mjs do deck: o variacoes.json que o painel lê pra sincronizar sozinho. Confere o do deck de verdade (em dia, com o que
// as páginas dizem) e o que o gerador recusa numa pasta de teste (bloco faltando, opcional que não bate com o HTML, nome repetido,
// travessão, pasta com nome ruim) e o --confere.
// Uso: node testes/teste-manifesto.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { RAIZ_DECK } from './servidor.mjs';
import { verificador } from './_util.mjs';

const { ok, fim } = verificador('Manifesto do deck');
const GERADOR = path.join(RAIZ_DECK, 'gera-manifesto.mjs');
const roda = (...args) => { const r = spawnSync(process.execPath, [GERADOR, ...args], { encoding: 'utf8' }); return { codigo: r.status, saida: (r.stdout || '') + (r.stderr || '') }; };
const sha1 = b => crypto.createHash('sha1').update(b).digest('hex');

/* ---------------- o deck de verdade ---------------- */
ok(fs.existsSync(GERADOR), 'o gerador existe no deck');
const real = roda('--confere');
ok(real.codigo === 0 && /em dia/.test(real.saida), 'o variacoes.json do deck está em dia com as páginas (' + real.saida.trim() + ')');
const manifesto = JSON.parse(fs.readFileSync(path.join(RAIZ_DECK, 'variacoes.json'), 'utf8'));
ok(manifesto.v === 1 && manifesto.paginas[0].id === 'principal' && manifesto.paginas[0].caminho === '/', 'a principal vem primeiro, com o caminho /');
ok(manifesto.paginas.every(p => (p.id === 'principal' ? p.caminho === '/' : p.caminho === '/variacoes/' + p.id + '/')), 'o caminho de cada página sai da pasta dela');
ok(manifesto.paginas.every(p => {
  const arq = path.join(RAIZ_DECK, ...p.caminho.split('/').filter(Boolean), 'index.html');
  const html = fs.readFileSync(arq, 'utf8');
  const secoes = [...html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<section\b[^>]*\bclass="slide[^"]*"[^>]*>/g)].map(m => m[0]);
  return p.slides === secoes.length && p.hash === sha1(fs.readFileSync(arq)) && p.opcionais.every(o => secoes[o.slide - 1] && secoes[o.slide - 1].includes('data-opcional="' + o.id + '"'));
}), 'o número de slides, o hash e a posição de cada slide opcional batem com a página');
ok(manifesto.paginas.every(p => p.nome && p.resumo && p.quando && ['validada', 'em-validacao', 'nao-validada'].includes(p.validacao) && typeof p.lead.nome === 'boolean' && typeof p.lead.foto === 'boolean'), 'toda página tem nome, resumo, quando usar, classificação de partida e o que mostra do lead');
ok(!/[—–]/.test(JSON.stringify(manifesto)), 'sem travessão no manifesto');
const g1 = fs.readFileSync(path.join(RAIZ_DECK, 'variacoes.json'), 'utf8');
ok(roda('--confere').codigo === 0 && fs.readFileSync(path.join(RAIZ_DECK, 'variacoes.json'), 'utf8') === g1, 'o --confere não mexe no arquivo');

/* ---------------- uma pasta de teste ---------------- */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'deck-manifesto-'));
const bloco = (o) => '<script type="application/json" id="r2-variacao">\n' + JSON.stringify(o, null, 2) + '\n</script>';
const pagina = (b, slides = 3, extra = '') => '<!doctype html><html><head><meta charset="utf-8"><title>x</title>' + (b === null ? '' : bloco(b)) + '</head><body><div id="stage">' +
  Array.from({ length: slides }, (_, i) => '<section class="slide"' + (extra && i === 1 ? ' ' + extra : '') + '>' + (i + 1) + '</section>').join('') + '</div></body></html>';
const base = { nome: 'Principal', resumo: 'O deck.', quando: 'Na dúvida.' };
const escreve = (rel, conteudo) => { const arq = path.join(tmp, ...rel.split('/')); fs.mkdirSync(path.dirname(arq), { recursive: true }); fs.writeFileSync(arq, conteudo); };
const limpa = () => { fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp); };
try {
  limpa();
  escreve('index.html', pagina(base));
  const a = roda(tmp);
  ok(a.codigo === 0 && fs.existsSync(path.join(tmp, 'variacoes.json')), 'uma pasta só com a principal gera o variacoes.json');
  const m1 = JSON.parse(fs.readFileSync(path.join(tmp, 'variacoes.json'), 'utf8'));
  ok(m1.paginas.length === 1 && m1.paginas[0].slides === 3 && m1.paginas[0].validacao === 'nao-validada' && m1.paginas[0].lead.nome === true && m1.paginas[0].lead.foto === true && m1.paginas[0].opcionais.length === 0, 'sem classificação nem lead no bloco: "não validada", nome e foto ligados, nenhum opcional');

  // página nova: só a pasta e o bloco
  escreve('variacoes/quente/index.html', pagina({ nome: 'Lead quente', resumo: 'Direto ao plano.', quando: 'Já conversou com o estrategista.', lead: { nome: true, foto: false }, opcionais: [{ id: 'extra', rotulo: 'O que o {nome} ganha', ajuda: 'Um slide a mais.' }] }, 4, 'data-opcional="extra"'));
  const b = roda(tmp);
  const m2 = JSON.parse(fs.readFileSync(path.join(tmp, 'variacoes.json'), 'utf8'));
  const q = m2.paginas.find(p => p.id === 'quente');
  ok(b.codigo === 0 && m2.paginas.length === 2 && q && q.caminho === '/variacoes/quente/' && q.slides === 4 && q.lead.foto === false && q.opcionais[0].slide === 2 && q.nome === 'Lead quente', 'página nova (uma pasta com o bloco): aparece no manifesto, com os slides contados e o opcional na posição certa');
  ok(roda(tmp, '--confere').codigo === 0, 'logo depois de gerar, o --confere passa');
  fs.appendFileSync(path.join(tmp, 'variacoes', 'quente', 'index.html'), '\n<!-- mexi -->\n');
  const c = roda(tmp, '--confere');
  ok(c.codigo === 1 && /desatualizado/.test(c.saida) && /quente/.test(c.saida), 'a página mudou depois de gerar: o --confere falha e diz qual (' + c.saida.split('\n')[0] + ')');
  ok(roda(tmp).codigo === 0 && roda(tmp, '--confere').codigo === 0, 'gerar de novo resolve');
  // um comentário que cita a tag de slide não conta como slide
  escreve('variacoes/quente/index.html', pagina({ nome: 'Lead quente', resumo: 'Direto.', quando: 'Quando.' }, 4).replace('<body>', '<body><!-- <section class="slide"> citado --> '));
  roda(tmp);
  ok(JSON.parse(fs.readFileSync(path.join(tmp, 'variacoes.json'), 'utf8')).paginas.find(p => p.id === 'quente').slides === 4, 'uma tag de slide citada num comentário HTML não vira slide');

  // o que o gerador recusa
  const recusa = (rel, conteudo, regex, texto) => {
    const antes = fs.existsSync(path.join(tmp, ...rel.split('/'))) ? fs.readFileSync(path.join(tmp, ...rel.split('/'))) : null;
    escreve(rel, conteudo);
    const r = roda(tmp);
    ok(r.codigo === 1 && regex.test(r.saida), texto + ' (' + r.saida.split('\n').slice(1, 2).join('').trim().slice(0, 90) + ')');
    if (antes) fs.writeFileSync(path.join(tmp, ...rel.split('/')), antes); else fs.rmSync(path.join(tmp, ...rel.split('/')), { recursive: true, force: true });
  };
  const Q = 'variacoes/quente/index.html', Z = 'variacoes/zeta/index.html';
  recusa(Z, pagina(null), /falta o bloco/, 'página sem o bloco r2-variacao é recusada');
  recusa(Z, '<html><head><script type="application/json" id="r2-variacao">{ não é json }</script></head><body><section class="slide">1</section></body></html>', /não é um JSON válido/, 'bloco com JSON quebrado é recusado');
  recusa(Z, pagina({ nome: 'Zeta', quando: 'Quando.' }), /falta "resumo"/, 'sem resumo é recusado');
  recusa(Z, pagina({ nome: 'Zeta', resumo: 'x', quando: 'y', validacao: 'quase' }), /"validacao" tem que ser/, 'classificação fora da lista é recusada');
  recusa(Z, pagina({ nome: 'Zeta', resumo: 'x', quando: 'y', lead: { nome: 'sim' } }), /"lead" tem que ser/, 'lead que não é booleano é recusado');
  recusa(Z, pagina({ nome: 'Zeta', resumo: 'x', quando: 'y', opcionais: [{ id: 'sumido', rotulo: 'R', ajuda: 'A' }] }), /nenhum slide tem data-opcional="sumido"/, 'opcional declarado que nenhum slide tem é recusado');
  recusa(Z, pagina({ nome: 'Zeta', resumo: 'x', quando: 'y' }, 3, 'data-opcional="solto"'), /não está declarado em "opcionais"/, 'slide com data-opcional que o bloco não declara é recusado');
  recusa(Z, pagina({ nome: 'Lead quente', resumo: 'x', quando: 'y' }), /já é de outra página/, 'nome repetido (de outra página) é recusado');
  recusa(Z, pagina({ nome: 'Zeta', resumo: 'tem ' + String.fromCharCode(0x2014) + ' travessão', quando: 'y' }), /travessão/, 'travessão no texto é recusado (regra da casa)');
  recusa(Z, pagina({ nome: 'Zeta', resumo: 'x', quando: 'y' }, 0), /nenhum slide/, 'página sem slide é recusada');
  recusa('variacoes/Zeta Maiuscula/index.html', pagina({ nome: 'Z2', resumo: 'x', quando: 'y' }), /nome da pasta/, 'pasta com nome fora de letras minúsculas, números e hífen é recusada');
  recusa(Z, pagina({ nome: 'Z<b>', resumo: 'x', quando: 'y' }), /não pode ter/, 'texto com < ou > é recusado');
  fs.rmSync(path.join(tmp, 'variacoes.json'));
  ok(roda(tmp, '--confere').codigo === 1, 'sem o variacoes.json, o --confere falha e manda gerar');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
fim();
