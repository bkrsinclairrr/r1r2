// As cópias do painel batem com o deck? CAMPO_POSICOES, PRAZOS e os planos (regras.js contra o assets/roteiro.js do
// R2 novo), o reconhecimento da posição (o posicaoNoCampo do painel contra o do deck.js, numa lista de entradas) e o
// componente do relatório (relatorio-leitura.js igual byte a byte). Uso: node testes/teste-igualdade.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { RAIZ_PAINEL, RAIZ_DECK } from './servidor.mjs';
import { verificador } from './_util.mjs';

const { ok, fim } = verificador('Igualdade painel x deck');
const deck = { window: {} }; vm.createContext(deck);
vm.runInContext(fs.readFileSync(path.join(RAIZ_DECK, 'assets', 'roteiro.js'), 'utf8'), deck);
const painel = { window: {} }; vm.createContext(painel);
vm.runInContext(fs.readFileSync(path.join(RAIZ_PAINEL, 'regras.js'), 'utf8'), painel);
const W = deck.window, R = painel.window.R2_REGRAS;

ok(JSON.stringify(R.CAMPO_POSICOES) === JSON.stringify(W.CAMPO_POSICOES), 'CAMPO_POSICOES igual no painel e no deck');
ok(JSON.stringify(R.PRAZOS) === JSON.stringify(W.PRAZOS), 'PRAZOS igual no painel e no deck');
ok(JSON.stringify(R.PLANOS.slice().sort()) === JSON.stringify(W.PLANOS.map(p => p.nome).sort()), 'os nomes dos três planos batem');
const antigosDeck = {}; W.PLANOS.forEach(p => (p.antigos || []).forEach(a => { antigosDeck[a] = p.nome; }));
ok(JSON.stringify(R.PLANOS_ANTIGOS) === JSON.stringify(antigosDeck), 'os nomes antigos dos planos batem');
ok(R.LEGACY === (W.PLANOS.find(p => p.id === 'legacy') || {}).nome, 'o nome do Legacy bate');

// o posicaoNoCampo do deck, tirado do deck.js como está (str, semAcento e a função)
const fonte = fs.readFileSync(path.join(RAIZ_DECK, 'assets', 'deck.js'), 'utf8');
const trecho = n => { const i = fonte.indexOf(n); if (i < 0) throw new Error('não achei ' + n); return fonte.slice(i, fonte.indexOf('\n', i)); };
const ini = fonte.indexOf('  function posicaoNoCampo(txt) {'), fimF = fonte.indexOf('\n  }\n', ini) >= 0 ? fonte.indexOf('\n  }\n', ini) : fonte.indexOf('\r\n  }\r\n', ini);
const corpoFn = fonte.slice(ini, fimF) + '\n  }';
const ctx = { window: { CAMPO_POSICOES: W.CAMPO_POSICOES } }; vm.createContext(ctx);
vm.runInContext(trecho('const str = v =>') + '\n' + trecho('const semAcento = s =>') + '\n' + corpoFn + '\nthis.posicaoNoCampo = posicaoNoCampo;', ctx);
const ENTRADAS = ['goleiro', 'Goleira', 'lateral direito', 'Lateral-esquerda', 'zagueiro', 'zagueiro esquerdo', 'Zaga', 'defensor', 'volante', 'primeiro volante pela esquerda',
  'meia', 'Meio-campo', 'armador', 'meia central', 'ponta esquerda', 'ponta direita', 'ponta', 'extremo esquerdo', 'atacante', 'centroavante', 'camisa 9', 'segundo atacante',
  'GOL', 'ld', 'LE', 'zag', 'vol', 'mc', 'ale', 'add', 'ca', 'lateral', 'meia-atacante', 'ala', '', 'Zagueiro (canhoto)', 'volante; meia', 'ÁRBITRO', 'goleiro reserva'];
const dif = ENTRADAS.filter(e => R.posicaoNoCampo(e) !== ctx.posicaoNoCampo(e));
ok(!dif.length, 'posição reconhecida igual em ' + ENTRADAS.length + ' entradas' + (dif.length ? ' (diferente: ' + dif.join(', ') + ')' : ''));
ok(R.posicaoNoCampo('zagueiro') === 'ZAG-d' && R.posicaoNoCampo('ponta esquerda') === 'ALE' && R.posicaoNoCampo('lateral') === '', 'exemplos: zagueiro é ZAG-d, ponta esquerda é ALE, só "lateral" não casa');

// os nomes do atleta (nome e sobrenome na tela, primeiro nome na fala): a mesma tabela no painel e no deck. O deck.js é
// lido como está: o bloco de NOME_PARTICULAS até o fim de nomesDoAtleta.
{
  const iniN = fonte.indexOf('  const NOME_PARTICULAS'), iniF = fonte.indexOf('  function nomesDoAtleta', iniN);
  const fimN = fonte.indexOf('\r\n  }\r\n', iniF) >= 0 ? fonte.indexOf('\r\n  }\r\n', iniF) : fonte.indexOf('\n  }\n', iniF);
  if (iniN < 0 || iniF < 0 || fimN < 0) throw new Error('não achei nomesDoAtleta no deck.js');
  const cn = { window: {} }; vm.createContext(cn);
  vm.runInContext(trecho('const str = v =>') + '\n' + trecho('const semAcento = s =>') + '\n' + fonte.slice(iniN, fimN) + '\n  }\nthis.nomesDoAtleta = nomesDoAtleta;', cn);
  // [nome completo, primeiro nome (a fala), nome e sobrenome (a tela)]
  const NOMES = [
    ['Lucas', 'Lucas', 'Lucas'], ['Lucas Silva', 'Lucas', 'Lucas Silva'], ['Lucas Almeida da Silva', 'Lucas', 'Lucas Silva'],
    ['Lucas Almeida Silva', 'Lucas', 'Lucas Almeida Silva'], ['Lucas da Silva', 'Lucas', 'Lucas Silva'],
    ['João Pedro Silva', 'João Pedro', 'João Pedro Silva'], ['João Pedro da Silva', 'João Pedro', 'João Pedro Silva'], ['João Marcelo Silva', 'João', 'João Marcelo Silva'],
    ['João Vitor Pereira Lima', 'João Vitor', 'João Vitor Lima'], ['Ana Beatriz Santos Oliveira', 'Ana Beatriz', 'Ana Beatriz Oliveira'],
    ['Pedro Henrique da Silva Júnior', 'Pedro Henrique', 'Pedro Henrique Silva'], ['Pedro Silva Júnior', 'Pedro', 'Pedro Silva Júnior'], ['Neymar Júnior', 'Neymar', 'Neymar Júnior'],
    ['Neymar da Silva Santos Júnior', 'Neymar', 'Neymar Santos Júnior'], ['Wellington Albuquerque Figueiredo Junior', 'Wellington', 'Wellington Figueiredo'],
    ['Maximiliano Bartolomeu dos Santos Albuquerque Figueiredo', 'Maximiliano', 'Maximiliano Figueiredo'], ['Maximiliano Vasconcelos Albuquerque', 'Maximiliano', 'Maximiliano Albuquerque'],
    ['Kaio Henrique', 'Kaio', 'Kaio Henrique'], ['Maria e Silva', 'Maria', 'Maria Silva'], ['  lucas   silva ', 'lucas', 'lucas silva'], ['', '', '']
  ];
  const errosN = [];
  NOMES.forEach(([entrada, primeiro, tela]) => {
    [['painel', R.nomesDoAtleta], ['deck', cn.nomesDoAtleta]].forEach(([quem, fn]) => {
      const r = fn(entrada);
      if (r.primeiro !== primeiro || r.tela !== tela) errosN.push(quem + ' "' + entrada + '": ' + r.primeiro + ' | ' + r.tela + ' (esperava ' + primeiro + ' | ' + tela + ')');
    });
  });
  ok(!errosN.length, 'nome e sobrenome iguais no painel e no deck, e como esperado, em ' + NOMES.length + ' nomes' + (errosN.length ? ': ' + errosN.slice(0, 3).join('; ') : ''));
  ok(NOMES.every(([e]) => cn.nomesDoAtleta(e).tela.length <= 24), 'a tela nunca passa de 24 letras (' + NOMES.length + ' nomes)');
  ok(R.comoChama('Lucas Almeida da Silva', '') === 'Lucas Silva' && R.comoChama('Lucas Almeida da Silva', 'Joãozinho') === 'Joãozinho' && R.comoFala('Lucas Almeida da Silva', '') === 'Lucas' && R.comoFala('Lucas Almeida da Silva', 'Joãozinho') === 'Joãozinho' && R.nomeDossie('Lucas Almeida da Silva') === 'LUCAS SILVA',
    'comoChama, comoFala e nomeDossie: o apelido manda; sem ele, nome e sobrenome na tela e o primeiro nome na fala');

  // a escolha "Nome e primeiro sobrenome" (regra 'primeiro'): a mesma tabela no painel e no deck. [nome completo, primeiro nome, tela]
  const NOMES_P = [
    ['Lucas', 'Lucas', 'Lucas'], ['Lucas Silva', 'Lucas', 'Lucas Silva'], ['Lucas Almeida da Silva', 'Lucas', 'Lucas Almeida'],
    ['Lucas Almeida Silva', 'Lucas', 'Lucas Almeida Silva'], ['Lucas da Silva', 'Lucas', 'Lucas Silva'],
    ['João Pedro Silva', 'João Pedro', 'João Pedro Silva'], ['João Pedro da Silva', 'João Pedro', 'João Pedro Silva'], ['João Marcelo Silva', 'João', 'João Marcelo Silva'],
    ['João Vitor Pereira Lima', 'João Vitor', 'João Vitor Pereira'], ['Ana Beatriz Santos Oliveira', 'Ana Beatriz', 'Ana Beatriz Santos'],
    ['Pedro Henrique da Silva Júnior', 'Pedro Henrique', 'Pedro Henrique Silva'], ['Pedro Silva Júnior', 'Pedro', 'Pedro Silva Júnior'], ['Neymar Júnior', 'Neymar', 'Neymar Júnior'],
    ['Neymar da Silva Santos Júnior', 'Neymar', 'Neymar Silva'], ['Wellington Albuquerque Figueiredo Junior', 'Wellington', 'Wellington Albuquerque'],
    ['Lucas da Silva Júnior', 'Lucas', 'Lucas Silva Júnior'], ['Carlos Eduardo da Silva Júnior', 'Carlos Eduardo', 'Carlos Eduardo Silva'],
    ['Maximiliano Bartolomeu dos Santos Albuquerque Figueiredo', 'Maximiliano', 'Maximiliano Bartolomeu'], ['Maximiliano Vasconcelos Albuquerque', 'Maximiliano', 'Maximiliano Vasconcelos'],
    ['Kaio Henrique', 'Kaio', 'Kaio Henrique'], ['Maria e Silva', 'Maria', 'Maria Silva'], ['  lucas   silva ', 'lucas', 'lucas silva'], ['', '', '']
  ];
  const errosP = [];
  NOMES_P.forEach(([entrada, primeiro, tela]) => {
    [['painel', R.nomesDoAtleta], ['deck', cn.nomesDoAtleta]].forEach(([quem, fn]) => {
      const r = fn(entrada, 'primeiro');
      if (r.primeiro !== primeiro || r.tela !== tela) errosP.push(quem + ' "' + entrada + '": ' + r.primeiro + ' | ' + r.tela + ' (esperava ' + primeiro + ' | ' + tela + ')');
    });
  });
  ok(!errosP.length, 'nome e primeiro sobrenome: iguais no painel e no deck, e como esperado, em ' + NOMES_P.length + ' nomes' + (errosP.length ? ': ' + errosP.slice(0, 3).join('; ') : ''));
  ok(NOMES_P.every(([e]) => cn.nomesDoAtleta(e, 'primeiro').tela.length <= 24), 'com o primeiro sobrenome, a tela também nunca passa de 24 letras');
  // sem o segundo argumento, o resultado é o de sempre (nome e último sobrenome): a regra nova não mexe no padrão
  ok(NOMES.every(([e]) => JSON.stringify(R.nomesDoAtleta(e)) === JSON.stringify(R.nomesDoAtleta(e, ''))), 'regra vazia é a regra de sempre (o último sobrenome)');
  // as escolhas do painel em comoChama e nomeDossie
  ok(R.comoChama('Lucas Almeida da Silva', '', 'primeiro-sobrenome') === 'Lucas Almeida' && R.comoChama('Lucas Almeida da Silva', '', 'so-nome') === 'Lucas' && R.comoChama('Lucas Almeida da Silva', '', 'sem') === ''
    && R.comoChama('Lucas Almeida da Silva', 'Joãozinho', 'sem') === '' && R.comoChama('Lucas Almeida da Silva', 'Joãozinho', 'so-nome') === 'Joãozinho' && R.comoChama('João Pedro da Silva', '', 'so-nome') === 'João Pedro'
    && R.nomeDossie('Lucas Almeida da Silva', 'primeiro-sobrenome') === 'LUCAS ALMEIDA' && R.nomeDossie('Lucas Almeida da Silva', 'so-nome') === 'LUCAS SILVA',
    'comoChama e nomeDossie nas escolhas do R2: primeiro sobrenome, só o primeiro nome (o apelido manda) e sem nome (nada na tela)');
}

const a = fs.readFileSync(path.join(RAIZ_PAINEL, 'relatorio-leitura.js')), b = fs.readFileSync(path.join(RAIZ_DECK, 'assets', 'relatorio-leitura.js'));
ok(Buffer.compare(a, b) === 0, 'relatorio-leitura.js igual byte a byte no painel e no deck');
fim();
