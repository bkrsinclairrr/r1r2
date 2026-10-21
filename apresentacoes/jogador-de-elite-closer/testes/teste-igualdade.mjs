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

// desde 18/10/2026 o R2 anterior e o R1 usam o mesmo nomesDoAtleta (o R2 anterior pra tela, o R1 pra placa do slide 02): o bloco é igual ao
// do R2 novo, tirando o fim de linha
{
  const bloco = txt => { const s = txt.replace(/\r\n/g, '\n'), i = s.indexOf('  const NOME_PARTICULAS'), f = s.indexOf('\n  }\n', s.indexOf('  function nomesDoAtleta', i)); return i < 0 || f < 0 ? null : s.slice(i, f); };
  const ref = bloco(fonte);
  for (const d of ['jogador-de-elite-r2', 'jogador-de-elite-r1']) {
    const b2 = bloco(fs.readFileSync(path.join(RAIZ_PAINEL, '..', d, 'assets', 'deck.js'), 'utf8'));
    ok(!!ref && b2 === ref, 'nomesDoAtleta do ' + d + ' igual ao do R2 novo');
  }
  // as iniciais do quadro sem foto: o foto-atleta.js é o mesmo nos quatro decks, e o painel tem a mesma conta
  const fa = d => fs.readFileSync(path.join(RAIZ_PAINEL, '..', d, 'assets', 'foto-atleta.js'), 'utf8').replace(/\r\n/g, '\n');
  ok(['jogador-de-elite-r2', 'jogador-de-elite-r2-b', 'jogador-de-elite-r1'].every(d => fa(d) === fa('jogador-de-elite-r2-novo')), 'foto-atleta.js igual nos quatro decks (tirando o fim de linha)');
  const cf = { window: {}, document: { querySelector: () => null, querySelectorAll: () => [] }, addEventListener() {} };
  cf.window = cf; vm.createContext(cf);
  vm.runInContext(fa('jogador-de-elite-r2-novo'), cf);
  const casos = [['Carlos Eduardo Souza', 'CS'], ['Lucas Almeida da Silva', 'LS'], ['Pedro Henrique da Silva Júnior', 'PS'], ['Kaio', 'K'], ['Joãozinho', 'J'], ['Ícaro de Ávila', 'ÍÁ'], ['', '']];
  ok(casos.every(([n, e]) => cf.FotoAtleta.iniciais(n) === e), 'as iniciais do quadro sem foto: ' + casos.map(([n]) => (n || '(vazio)') + ' → ' + cf.FotoAtleta.iniciais(n)).join(', '));
}

const a = fs.readFileSync(path.join(RAIZ_PAINEL, 'relatorio-leitura.js')), b = fs.readFileSync(path.join(RAIZ_DECK, 'assets', 'relatorio-leitura.js'));
ok(Buffer.compare(a, b) === 0, 'relatorio-leitura.js igual byte a byte no painel e no deck');
// o escudo das oportunidades (18/10/2026): a sigla do painel (regras.js) igual à do slide do dossiê (dossie-atleta.js), e o dossie-atleta.js e o
// dossie-atleta.css iguais nos três decks do R2 (fora o fim de linha)
{
  const ds = { window: {}, document: { fonts: null }, addEventListener: () => {} }; ds.window = ds; vm.createContext(ds);
  vm.runInContext(fs.readFileSync(path.join(RAIZ_DECK, 'assets', 'dossie-atleta.js'), 'utf8'), ds);
  const CLUBES = ['Ferroviária', 'Benfica', 'Athletico-PR', 'Red Bull Bragantino', 'Esporte Clube Bahia', 'Sporting Clube de Portugal', 'Grêmio Novorizontino', 'CR Flamengo',
    'Associação Ferroviária de Esportes', 'São Paulo FC', 'A.D. São Caetano', '1º de Maio', 'Clube', 'Vasco da Gama', 'Ceará SC', 'Club Athletico Paranaense'];
  const difs = CLUBES.filter(c => R.siglaClube(c) !== ds.DossieAtleta.sigla(c));
  ok(!difs.length, 'a sigla do escudo é a mesma no painel e no slide em ' + CLUBES.length + ' clubes' + (difs.length ? ' (diferente: ' + difs.join(', ') + ')' : ''));
  ok(R.siglaClube('Red Bull Bragantino') === 'RB' && R.siglaClube('Esporte Clube Bahia') === 'B' && R.siglaClube('Athletico-PR') === 'AP', 'exemplos: Red Bull Bragantino é RB, Esporte Clube Bahia é B, Athletico-PR é AP');
  const le = (d, a) => fs.readFileSync(path.join(RAIZ_PAINEL, '..', d, 'assets', a), 'utf8').replace(/\r\n/g, '\n');
  for (const a of ['dossie-atleta.js', 'dossie-atleta.css']) {
    const base = le('jogador-de-elite-r2-novo', a);
    ok(['jogador-de-elite-r2-b', 'jogador-de-elite-r2'].every(d => le(d, a) === base), a + ' igual no R2 novo, no R2 B e no R2 anterior');
  }
}
// o mapa de calor por posição (20/10/2026): o mapa-calor.js igual byte a byte no painel e nos três decks do R2 (node copia-mapa-calor.mjs copia),
// as posições da lista do painel (regras.js) iguais às do módulo e às do campo do deck, e cada SVG pequeno e sem nada de fora
{
  const mc = fs.readFileSync(path.join(RAIZ_PAINEL, 'mapa-calor.js'));
  const copias = ['jogador-de-elite-r2-novo', 'jogador-de-elite-r2-b', 'jogador-de-elite-r2'].filter(d => {
    const p = path.join(RAIZ_PAINEL, '..', d, 'assets', 'mapa-calor.js');
    return !fs.existsSync(p) || Buffer.compare(fs.readFileSync(p), mc) !== 0;
  });
  ok(!copias.length, 'mapa-calor.js igual byte a byte no painel e nos três decks do R2' + (copias.length ? ' (diferente: ' + copias.join(', ') + '; rode node copia-mapa-calor.mjs)' : ''));
  const cm = { window: {} }; cm.window = cm; vm.createContext(cm);
  vm.runInContext(mc.toString('utf8'), cm);
  const M = cm.MapaCalor;
  ok(JSON.stringify(M.ids) === JSON.stringify(R.MAPAS_CALOR), 'as posições do mapa de calor iguais no painel e no módulo (' + M.ids.join(', ') + ')');
  const marcadores = [...new Set(ENTRADAS.map(e => R.posicaoNoCampo(e)).filter(Boolean))];
  ok(marcadores.every(id => M.temId(id)), 'toda posição que o campo do deck reconhece tem mapa (' + marcadores.length + ' marcadores)');
  const ruins = [];
  M.ids.forEach(id => [false, true].forEach(vertical => {
    const s = M.svg(id, { vertical });
    const fora = s.replace('xmlns="http://www.w3.org/2000/svg"', '');
    if (!/^<svg [^>]*viewBox="0 0 (1050 680|680 1050)"/.test(s) || !s.endsWith('</svg>') || /https?:|href=|<script|<image/i.test(fora) || s.length > 6144) ruins.push(id + (vertical ? ' em pé' : '') + ' (' + s.length + ' bytes)');
  }));
  ok(!ruins.length, 'os 11 mapas, deitados e em pé: SVG fechado, sem referência de fora e com menos de 6 KB' + (ruins.length ? ': ' + ruins.join(', ') : ''));
  ok(M.svg('xx') === '' && M.sub('ZAG-e') === 'onde atua um zagueiro' && M.sub('ALE') === 'onde atua um ponta esquerda', 'id que não existe não desenha nada; o subtítulo diz a posição');
  const a1 = M.svg('MC'), a2 = M.svg('MC');
  ok(a1 !== a2 && a1.replace(/mc\d+_/g, '') === a2.replace(/mc\d+_/g, ''), 'o mesmo mapa sai igual toda vez (sem sorteio), só com ids próprios pra conviver na mesma página');
}

fim();
