// Isolamento por link no mesmo navegador (o complemento do ferramentas-r2\teste-colisao.mjs), com o painel e o R2 novo locais.
// Uso: node testes/teste-isolamento.mjs
// Dois links abertos no mesmo Chrome: editar a ficha no apresentador do A não muda o B; uma chave je-r2-ficha:<código> por
// link; chave com _vistoEm de 13 horas sai na abertura seguinte; no máximo 5 fichas de link guardadas (a do link aberto
// nunca sai); "Encerrar e limpar" apaga a chave do link; código fora do formato vira deck sem link.
import fs from 'node:fs';
import { sobe, RAIZ_DECK } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const s = await sobe({ deck: true });
const { ok, fim } = verificador('Isolamento por link');
const nav = await abreNavegador();
try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  const cria = async (nome, origem, car) => (await admin.post('/api/atletas', { ficha: { nome, origem, caracteristicas: car, posicao: 'volante', plano: 'Assessoria PRO' } })).j.t;
  const tA = await cria('Ana Lima', 'Zyron', 'passe longo'), tB = await cria('Bia Souza', 'Zyron', 'drible curto');
  const url = (t, extra = '') => s.deck + '/?a=' + t + extra;
  // entre parênteses: o || solto, colado com === nas esperas, faria a espera passar com qualquer texto
  const NOME = "((document.querySelector('[data-bind=\"nome\"]') || {}).textContent || '')";
  const CAR = "(document.querySelector('[data-bind=\"selecaoContexto\"]') || {}).textContent || ''";

  const A = await nav.aba(url(tA, '#2'), { largura: 1920, altura: 1080 });
  const B = await nav.aba(url(tB, '#2'), { largura: 1920, altura: 1080 });
  ok(await A.ate(`${NOME} === 'Ana Lima'`) && await B.ate(`${NOME} === 'Bia Souza'`), 'A mostra Ana Lima e B mostra Bia Souza');
  const PA = await nav.aba(url(tA, '&presenter#2'));
  ok(await PA.ate("document.querySelector('#f-caracteristicas') && document.querySelector('#f-caracteristicas').value === 'passe longo'"), 'o apresentador do A abre com a ficha da Ana');
  await PA.avalia("(() => { const e = document.querySelector('#f-caracteristicas'); e.value = 'passe longo e cabeceio'; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()");
  ok(await A.ate(`${CAR} === 'passe longo e cabeceio'`, 5000), 'editar no apresentador do A muda a tela do A');
  await espera(800);
  ok((await B.avalia(CAR)) === 'drible curto' && (await B.avalia(NOME)) === 'Bia Souza', 'e a tela do B continua com a ficha da Bia');
  const chaves = (await A.avalia("Object.keys(localStorage).filter(k => k.startsWith('je-r2-ficha')).sort().join(',')")).split(',');
  ok(chaves.length === 2 && chaves.includes('je-r2-ficha:' + tA) && chaves.includes('je-r2-ficha:' + tB), 'uma chave por link: je-r2-ficha:<código> (' + chaves.length + ')');
  ok(!(await A.avalia("Object.keys(localStorage).some(k => k === 'je-r2-ficha')")), 'nenhuma chave sem código foi criada pelos links');
  const visto = JSON.parse(await A.avalia(`localStorage.getItem('je-r2-ficha:${tA}')`))._vistoEm;
  ok(Date.now() - visto < 60000, 'a ficha do link guarda _vistoEm (a hora da última abertura)');

  // higiene: 13 horas sem uso sai; no máximo 5 fichas de link
  const fake = c => c.repeat(26).slice(0, 26);
  await A.avalia(`(() => {
    const agora = Date.now();
    localStorage.setItem('je-r2-ficha:${fake('c')}', JSON.stringify({ _a: '${fake('c')}', nome: 'Caio', _vistoEm: agora - 13 * 3600e3 }));
    ${['d', 'e', 'f', 'g', 'h'].map((c, i) => `localStorage.setItem('je-r2-ficha:${fake(c)}', JSON.stringify({ _a: '${fake(c)}', nome: 'X${c}', _vistoEm: agora - ${(i + 1) * 60000} }));`).join('\n')}
    localStorage.setItem('je-r2-ficha', JSON.stringify({ nome: 'Velho', _vistoEm: agora - 14 * 3600e3 }));
    return 1; })()`);
  const C = await nav.aba(url(tA, '#1'), { largura: 1920, altura: 1080 });
  await C.ate(`${NOME} === 'Ana Lima'`);
  await espera(500);
  const depois = (await C.avalia("Object.keys(localStorage).filter(k => k.startsWith('je-r2-ficha')).sort().join(',')")).split(',');
  ok(!depois.includes('je-r2-ficha:' + fake('c')), 'a ficha com 13 horas sem uso saiu do navegador na abertura seguinte');
  ok(!depois.includes('je-r2-ficha'), 'a ficha sem link com 14 horas sem uso também saiu');
  ok(depois.length <= 5 && depois.includes('je-r2-ficha:' + tA), 'ficaram no máximo 5 fichas de link, com a do link aberto (' + depois.length + ')');
  ok(depois.includes('je-r2-ficha:' + fake('d')) && !depois.includes('je-r2-ficha:' + fake('h')), 'saem as menos usadas (as mais antigas)');

  // código fora do formato: deck sem link (a ficha do navegador)
  const X = await nav.aba(s.deck + '/?a=lucas-almeida-x7k2m9pq#2', { largura: 1920, altura: 1080 });
  await espera(1500);
  ok(!(await X.avalia("Object.keys(localStorage).some(k => k.indexOf('je-r2-ficha:lucas') === 0)")) && (await X.avalia(NOME)) !== 'Ana Lima', 'código do painel antigo (outro formato): o deck age como sem link, sem chave nova e sem puxar ninguém');

  // "Encerrar e limpar"
  await PA.avalia("document.querySelector('#pz-encerrar').click(); 1");
  await espera(800);
  ok(!(await A.avalia(`localStorage.getItem('je-r2-ficha:${tA}')`)) && !!(await A.avalia(`localStorage.getItem('je-r2-ficha:${tB}')`)), '"Encerrar e limpar" no apresentador do A apaga só a ficha do A');
  const exc = [A, B, PA, C].flatMap(a => a.console_.filter(m => /^EXC/.test(m)));
  ok(!exc.length, 'nenhuma exceção de JavaScript' + (exc.length ? ': ' + exc.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha();
  await s.fecha();
}
fim();
