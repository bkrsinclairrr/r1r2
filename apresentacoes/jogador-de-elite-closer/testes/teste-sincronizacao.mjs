// A sincronização do painel com o deck: o painel lê o variacoes.json que o deck publica, mostra cada página como variação, confere se cada
// uma funciona e manda a família pra Principal quando a página dela quebra. Roda contra o deck de verdade (o variacoes.json dele) e contra
// um deck de mentira que o teste controla (página nova, página que cai, que sai, manifesto estragado, deck fora do ar ou lento).
// Uso: node testes/teste-sincronizacao.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { sobe, RAIZ_PAINEL } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';
import { sobeDeck, sobeAlvo, paginaFalsa, htmlDe, manifestoReal } from './_deck-falso.mjs';

const { ok, fim } = verificador('Sincronização com o deck');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ_PAINEL, 'regras.js'), 'utf8'), ctx);
const R = ctx.window.R2_REGRAS;
const MIN = 60 * 1000, DIA = 24 * 60 * MIN;
const clone = o => JSON.parse(JSON.stringify(o));

const deck = await sobeDeck();
const alvo = await sobeAlvo();
const s = await sobe({ deck: false, deckExterno: deck.url });
try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  const SENHA = 'senha-da-carla-123';
  await admin.post('/api/usuarios', { login: 'carla.closer', nome: 'Carla Closer', papel: 'closer', senha: SENHA });
  const carla = new Cliente(s.painel); await carla.entra('carla.closer', SENHA);
  const anon = new Cliente(s.painel);

  const lista = async cli => (await cli.get('/api/versoes')).j;
  const sinc = () => admin.post('/api/versoes?acao=sincronizar', {});
  const put = (id, corpo) => admin.put('/api/versoes?id=' + id, corpo);
  const cria = corpo => admin.post('/api/versoes', corpo);
  const arquivo = () => JSON.parse(fs.readFileSync(path.join(s.dados, 'versoes.json'), 'utf8'));
  // mexe no versoes.json por fora (envelhecer uma data, apagar o que o painel leu) e "toca" no painel pra ele largar o que tinha em memória
  const muda = async f => { const d = arquivo(); f(d); fs.writeFileSync(path.join(s.dados, 'versoes.json'), JSON.stringify(d)); await put('principal', { nota: '' }); };
  const ids = j => j.versoes.map(v => v.id).sort().join();
  const pg = (j, id) => j.versoes.find(v => v.id === id);
  const publico = async t => (await fetch(s.painel + '/api/r2?t=' + t, { headers: { Origin: deck.url } })).json();
  const base = { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: 'Assessoria PRO', r2data: new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10), r2hm: '19:30' };
  const criaR2 = async extra => {
    const r = await admin.post('/api/atletas', { ficha: Object.assign({}, base, extra) });
    if (r.status !== 201) throw new Error('não criou o R2: ' + r.status + ' ' + r.texto);
    return r.j.t;
  };
  const real = manifestoReal();

  /* ---------------- A. com o deck de verdade ---------------- */
  console.log('\nA. com o deck de verdade (o variacoes.json que ele publica)');
  ok(!fs.existsSync(path.join(s.dados, 'versoes.json')), 'no começo, o painel nunca falou com o deck');
  const a1 = await lista(carla); // a closer abre a aba Variações: o painel sincroniza sozinho
  ok(a1.deck.fonte === 'deck' && a1.deck.falha === '' && a1.deck.paginas === real.paginas.length && a1.deck.problemas === 0 && a1.deck.desatualizadas === 0 && a1.deck.sumiram === 0,
    'a primeira abertura da lista sincroniza sozinha: ' + a1.deck.paginas + ' páginas, nenhuma com problema, nenhuma com o variacoes.json velho');
  ok(a1.deck.gerado === real.gerado && a1.deck.okEm && a1.deck.em && Date.now() - Date.parse(a1.deck.em) < 15000 && a1.deck.origem === deck.url, 'o painel sabe quando o variacoes.json foi gerado, quando falou com o deck e com qual');
  ok(a1.versoes.length === real.paginas.length && ids(a1) === real.paginas.map(p => p.id).sort().join(), 'a lista é a do deck (' + ids(a1) + ')');
  ok(real.paginas.every(p => {
    const v = pg(a1, p.id), rv = R.VERSOES.find(x => x.id === p.id);
    return v && v.nome === p.nome && v.resumo === p.resumo && v.quando === p.quando && v.caminho === p.caminho && JSON.stringify(v.opcionais) === JSON.stringify(p.opcionais) && v.validacao === p.validacao &&
      rv && rv.nome === v.nome && rv.resumo === v.resumo && rv.quando === v.quando && rv.caminho === v.caminho && JSON.stringify(rv.opcionais.map(o => [o.id, o.rotulo, o.ajuda])) === JSON.stringify(v.opcionais.map(o => [o.id, o.rotulo, o.ajuda]));
  }), 'cada página traz o que o deck diz (nome, resumo, quando usar, slides opcionais) e é igual ao cadastro de reserva do código');
  ok(a1.versoes.every(v => v.saude && v.saude.ok === true && v.saude.falhas === 0 && v.saude.desatualizado === false && v.nova === false && v.sumiu === false), 'todas as páginas abrem, com o motor do deck e o número de slides certo');
  ok(a1.versoes.every(v => !('hash' in v) && !('slides' in v) && !('visto' in v) && !('ajustadoPor' in v) && !('criadoPor' in v)), 'o closer não recebe hash, contagem de slides nem quem mexeu');
  ok(deck.conta('/variacoes.json') === 1 && real.paginas.every(p => deck.conta(p.caminho) === 1), 'o painel pediu o variacoes.json uma vez e cada página uma vez');

  deck.zera();
  await lista(carla); await lista(admin);
  ok(deck.pedidos().length === 0, 'abrir a lista de novo dentro de 2 minutos não vai ao deck outra vez');
  await muda(d => { d.decks.r2.em = new Date(Date.now() - 3 * MIN).toISOString(); });
  deck.zera();
  const juntas = await Promise.all(Array.from({ length: 6 }, (_, i) => (i % 2 ? admin : carla).get('/api/versoes')));
  ok(juntas.every(r => r.status === 200 && r.j.deck.falha === ''), 'passados 2 minutos, seis aberturas ao mesmo tempo respondem 200');
  ok(deck.conta('/variacoes.json') === 1 && real.paginas.every(p => deck.conta(p.caminho) === 1), '... e viram uma sincronização só (um pedido ao variacoes.json, um por página)');

  /* ---------------- B. quem pode mandar sincronizar ---------------- */
  console.log('\nB. quem pode mandar sincronizar');
  deck.zera();
  ok((await anon.post('/api/versoes?acao=sincronizar', {})).status === 401, 'sem login: 401');
  ok((await carla.post('/api/versoes?acao=sincronizar', {})).status === 403, 'closer: 403');
  ok((await admin.pede('POST', '/api/versoes?acao=sincronizar', { texto: '{}' })).status === 415, 'pedido que não vem em JSON: 415');
  ok((await admin.get('/api/versoes?acao=sincronizar')).status === 200 && deck.pedidos().length === 0, 'um GET com ?acao=sincronizar não força nada (só o POST do admin)');
  ok(deck.pedidos().length === 0, 'nenhum desses pedidos chegou ao deck');
  const b1 = await sinc();
  ok(b1.status === 200 && Array.isArray(b1.j.versoes) && b1.j.deck && b1.j.deck.falha === '' && deck.conta('/variacoes.json') === 1, 'o admin manda sincronizar na hora: 200, com a lista e o estado da sincronização');

  /* ---------------- C. página nova no deck ---------------- */
  console.log('\nC. página nova no deck');
  const rapida = paginaFalsa('rapida', 5, {
    nome: 'Lead quente', resumo: 'Vai direto ao plano.', quando: 'Já conversou com o estrategista.', validacao: 'validada', lead: { nome: true, foto: false },
    opcionais: [{ id: 'extra', slide: 3, rotulo: 'O que o {nome} ganha', ajuda: 'Um slide a mais.' }]
  });
  deck.poe(rapida.caminho, { corpo: rapida.html });
  deck.publica([rapida]);
  deck.zera();
  ok(ids(await lista(carla)) === 'principal,tecnica' && deck.pedidos().length === 0, 'o deck ganhou uma página, mas dentro dos 2 minutos o painel ainda não foi ver');
  ok((await anon.get('/api/limpeza')).status === 401 && deck.pedidos().length === 0, 'a limpeza diária sem o segredo do Cron: 401, e o painel nem fala com o deck');
  const cron = await anon.get('/api/limpeza', { cabecalhos: { Authorization: 'Bearer ' + s.cronSecret } });
  ok(cron.status === 200 && deck.conta('/variacoes.json') === 1 && deck.conta(rapida.caminho) === 1, 'o Cron diário sincroniza com o deck (a página nova foi conferida)');
  const c1 = await lista(carla);
  const rp = pg(c1, 'rapida');
  ok(c1.versoes.length === 3 && c1.deck.paginas === 3 && rp && rp.nome === 'Lead quente' && rp.caminho === '/variacoes/rapida/' && rp.quando === 'Já conversou com o estrategista.' && rp.resumo === 'Vai direto ao plano.',
    'a página nova aparece no painel sem ninguém cadastrar nada, com o nome, o resumo e o quando usar do deck');
  ok(rp.opcionais.length === 1 && rp.opcionais[0].id === 'extra' && rp.opcionais[0].rotulo === 'O que o {nome} ganha' && rp.lead.nome === true && rp.lead.foto === false, 'e com o slide opcional e o que ela mostra do lead (nome sim, foto não)');
  ok(rp.validacao === 'validada' && c1.versoes[0].id === 'rapida' && rp.nova === true && rp.saude.ok === true && rp.criada === false && rp.sumiu === false, 'a classificação de partida é a do deck (a mais validada vai pro topo), a página é "nova" e abre');
  ok(!R.VERSOES.some(v => v.id === 'rapida'), '(o cadastro de reserva do código não sabe dela: ela veio só do deck)');

  const tRapida = await criaR2({ versao: 'rapida', pular: 'extra' });
  const pr = await publico(tRapida);
  ok(pr.versao.id === 'rapida' && pr.versao.caminho === '/variacoes/rapida/' && pr.ficha.pular === 'extra' && pr.ficha.semFoto === 'sim', 'um R2 nessa página abre ela, com o slide opcional dela e sem foto (é o que ela mostra do lead)');
  const tLeva = await criaR2({ versao: 'rapida', pular: 'leva' });
  ok(!(await admin.get('/api/atletas?t=' + tLeva)).j.registro.ficha.pular, 'o slide opcional "leva" (de outras páginas) não vale nela');
  const cv = await cria({ nome: 'Quente sem pressa', base: 'rapida', quando: 'Pra lead que vai pensar.' });
  const slugCriada = cv.j && cv.j.criada;
  ok(cv.status === 201 && pg(cv.j, slugCriada).base === 'rapida' && pg(cv.j, slugCriada).caminho === '/variacoes/rapida/', 'o admin cria uma variação em cima da página nova');
  const tCriada = await criaR2({ versao: slugCriada });
  ok((await publico(tCriada)).versao.caminho === '/variacoes/rapida/', '... e o R2 dela abre a página da base');

  // a classificação do deck vale até o admin decidir; depois vale a do admin
  deck.publica([rapida], { muda: { tecnica: { validacao: 'validada' } } });
  await sinc();
  ok(pg(await lista(carla), 'tecnica').validacao === 'validada', 'o deck muda a classificação da Técnica pra "validada": vale, porque o admin nunca decidiu');
  ok((await put('rapida', { validacao: 'nao-validada' })).status === 200 && pg(await lista(carla), 'rapida').validacao === 'nao-validada', 'o admin classifica a página nova como "não validada"');
  deck.publica([Object.assign(clone(rapida), { entrada: Object.assign(clone(rapida.entrada), { validacao: 'em-validacao' }) })], { muda: { tecnica: { validacao: 'validada' } } });
  await sinc();
  ok(pg(await lista(carla), 'rapida').validacao === 'nao-validada', 'o deck passa a dizer "em validação", mas a sincronização não desfaz o que o admin decidiu');
  await muda(d => { d.decks.r2.paginas.find(p => p.id === 'rapida').visto = new Date(Date.now() - 8 * DIA).toISOString(); });
  ok(pg(await lista(carla), 'rapida').nova === false, 'depois de uma semana, a página deixa de ser "nova"');

  /* ---------------- D. a saúde de cada página ---------------- */
  console.log('\nD. a saúde de cada página');
  deck.publica([rapida], { muda: { tecnica: { validacao: 'validada' } } });
  const estado = async () => { const r = await sinc(); return { r, v: pg(r.j, 'rapida'), d: r.j.deck }; };
  const normal = () => deck.poe(rapida.caminho, { corpo: rapida.html });
  deck.poe(rapida.caminho, { status: 500, corpo: 'erro do servidor' });
  let e = await estado();
  ok(e.v.saude.ok === false && /HTTP 500/.test(e.v.saude.motivo) && e.v.saude.falhas === 1 && e.d.problemas === 1, 'a página responde 500: a saúde marca "não abre (HTTP 500)", uma falha, e a faixa conta 1 com problema (' + e.v.saude.motivo + ')');
  ok((await publico(tRapida)).versao.id === 'rapida', 'uma falha só não tira a página do ar: o R2 ainda abre ela (pode ser um soluço de rede)');
  e = await estado();
  ok(e.v.saude.falhas === 2, 'segunda conferência seguida com falha: duas falhas');
  const pq = await publico(tRapida);
  ok(pq.estado === 'ok' && pq.versao.id === 'principal' && pq.versao.caminho === '/' && pq.ficha.nome === base.nome, 'com duas falhas seguidas, o R2 abre a Principal em vez de uma página quebrada');
  ok(pq.ficha.semFoto === 'sim', '... e a ficha segue a variação escolhida (ela não mostra a foto, então a Principal também não mostra)');
  ok((await publico(tCriada)).versao.caminho === '/', 'a variação criada em cima dessa página cai na Principal junto');
  ok((await publico(await criaR2({ versao: 'tecnica' }))).versao.caminho === '/variacoes/tecnica/', 'as outras páginas seguem normais');
  normal();
  e = await estado();
  ok(e.v.saude.ok === true && e.v.saude.falhas === 0 && e.d.problemas === 0 && (await publico(tRapida)).versao.id === 'rapida', 'a página volta: a saúde zera e o R2 volta a abrir ela');
  deck.poe(rapida.caminho, { status: 500, corpo: 'x' }); await sinc(); normal(); await sinc(); deck.poe(rapida.caminho, { status: 500, corpo: 'x' });
  ok((await estado()).v.saude.falhas === 1, 'falhas que não são seguidas não somam (500, ok, 500: uma falha)');

  const casos = [
    ['sem o motor do deck (assets/deck.js)', { corpo: htmlDe(5, { motor: false }) }, /motor do deck/],
    ['com mais slides do que o variacoes.json diz', { corpo: htmlDe(6) }, /6 slides e o variacoes\.json diz 5/],
    ['com menos slides do que o variacoes.json diz', { corpo: htmlDe(4) }, /4 slides e o variacoes\.json diz 5/],
    ['respondendo 404', { status: 404, corpo: 'nada' }, /HTTP 404/],
    ['redirecionando pra outro endereço (o painel não segue)', { status: 302, local: alvo.url + '/roubado' }, /HTTP 302/],
    ['com a conexão derrubada', { derruba: true }, /não respondeu \(sem resposta\)/],
    ['grande demais (3 MB)', { corpo: Buffer.alloc(3 * 1024 * 1024, 97) }, /é grande demais/],
    ['grande demais, sem Content-Length', { corpo: Buffer.alloc(3 * 1024 * 1024, 97), picotado: true }, /é grande demais/]
  ];
  for (const [txt, regra, rx] of casos) {
    deck.poe(rapida.caminho, regra);
    e = await estado();
    ok(e.r.status === 200 && e.v.saude.ok === false && rx.test(e.v.saude.motivo), 'página ' + txt + ': marcada com problema (' + e.v.saude.motivo + ')');
  }
  ok(alvo.pedidos.length === 0, 'o painel não seguiu o redirecionamento: o outro endereço não recebeu pedido nenhum');

  // não é erro: a página mudou depois do variacoes.json (ou só ganhou um comentário)
  deck.poe(rapida.caminho, { corpo: htmlDe(5, { antes: '<!-- um comentário novo -->' }) });
  e = await estado();
  ok(e.v.saude.ok === true && e.v.saude.desatualizado === true && e.d.desatualizadas === 1 && e.d.problemas === 0, 'a página mudou depois do variacoes.json: segue funcionando, com o aviso "variacoes.json velho"');
  ok((await publico(tRapida)).versao.id === 'rapida', '... e o R2 abre ela do mesmo jeito');
  deck.poe(rapida.caminho, { corpo: htmlDe(5, { antes: '<!-- <section class="slide"> citado --><section class="slide-final">2</section>' }) });
  e = await estado();
  ok(e.v.saude.ok === false && /6 slides/.test(e.v.saude.motivo), 'uma tag de slide dentro de um comentário não conta, mas um slide de verdade a mais conta (' + e.v.saude.motivo + ')');

  // devagar: o painel desiste no prazo e a rota responde
  deck.poe(rapida.caminho, { corpo: rapida.html, atraso: 5500 });
  const tl = Date.now();
  e = await estado();
  const ms = Date.now() - tl;
  ok(e.r.status === 200 && e.v.saude.ok === false && /demorou demais/.test(e.v.saude.motivo) && ms < 7000, 'página que demora mais de 4 segundos: o painel desiste (' + e.v.saude.motivo + ') e a rota responde em ' + (ms / 1000).toFixed(1) + ' s');
  normal(); e = await estado();
  ok(e.v.saude.ok === true && e.v.saude.falhas === 0, 'e quando a página volta ao normal, volta a "funcionando"');

  /* ---------------- E. página que sai do deck ---------------- */
  console.log('\nE. página que sai do deck');
  deck.publica([], { muda: { tecnica: { validacao: 'validada' } } });
  deck.zera();
  const e1 = await sinc();
  const rs = pg(e1.j, 'rapida');
  ok(e1.status === 200 && rs && rs.sumiu === true && e1.j.deck.sumiram === 1 && e1.j.deck.paginas === 2 && e1.j.deck.problemas === 0, 'a página sai do deck: continua na lista, marcada "saiu do deck" (e não conta como página com problema)');
  ok(deck.conta('/variacoes/rapida/') === 0, 'o painel não confere uma página que o deck não lista mais');
  const ps = await publico(tRapida);
  ok(ps.estado === 'ok' && ps.versao.id === 'principal' && ps.versao.caminho === '/' && (await publico(tCriada)).versao.caminho === '/', 'os R2 que usavam ela abrem a Principal na hora, sem esperar duas conferências');
  ok((await cria({ nome: 'Em cima de quem saiu', base: 'rapida' })).status === 400, 'o admin não cria uma variação em cima de uma página que saiu do deck: 400');
  ok((await carla.get('/api/versoes')).j.versoes.some(v => v.id === 'rapida' && v.sumiu === true), 'o closer também vê que ela saiu (a tela não deixa escolher)');
  deck.publica([rapida], { muda: { tecnica: { validacao: 'validada' } } });
  const e2 = await sinc();
  ok(pg(e2.j, 'rapida').sumiu === false && e2.j.deck.sumiram === 0 && pg(e2.j, 'rapida').saude.ok === true && (await publico(tRapida)).versao.id === 'rapida', 'a página volta pro deck: deixa de ser "saiu", é conferida e os R2 dela voltam a abri-la');
  deck.publica([], { muda: { tecnica: { validacao: 'validada' } } }); await sinc();
  ok((await put('rapida', { arquivada: true })).status === 200 && pg(await lista(admin), 'rapida').arquivada === true, 'o admin arquiva uma página que saiu, pra tirar do caminho');
  await put('rapida', { arquivada: false });
  deck.publica([rapida], { muda: { tecnica: { validacao: 'validada' } } }); await sinc();

  /* ---------------- F. variacoes.json estragado ---------------- */
  console.log('\nF. o variacoes.json do deck vem estragado: o painel fica com a última lista boa');
  const antes = await lista(admin);
  const idsAntes = ids(antes), okAntes = antes.deck.okEm, arqAntes = JSON.stringify({ a: arquivo().ajustes, c: arquivo().criadas });
  const bom = () => { const m = clone(manifestoReal()); m.paginas.push(clone(rapida.entrada)); return m; };
  const ruim = async (txt, regra, rx) => {
    deck.poe('/variacoes.json', regra);
    const r = await sinc();
    ok(r.status === 200 && rx.test(r.j.deck.falha) && r.j.deck.okEm === okAntes && r.j.deck.fonte === 'deck' && ids(r.j) === idsAntes, txt + ' (' + r.j.deck.falha + ')');
  };
  const man = f => { const m = bom(); f(m); return { corpo: JSON.stringify(m), tipo: 'application/json' }; };
  await ruim('JSON quebrado', { corpo: '{ isto não é json', tipo: 'application/json' }, /não é um JSON válido/);
  await ruim('uma página de erro em HTML com status 200', { corpo: '<html><body>Algo deu errado</body></html>' }, /não é um JSON válido/);
  await ruim('formato (v) que o painel não conhece', man(m => { m.v = 2; }), /formato que o painel não conhece/);
  await ruim('nenhuma página', man(m => { m.paginas = []; }), /de 1 a 40/);
  await ruim('41 páginas', man(m => { for (let i = 0; i < 40; i++) m.paginas.push(Object.assign(clone(rapida.entrada), { id: 'p' + String(i).padStart(2, '0'), caminho: '/variacoes/p' + String(i).padStart(2, '0') + '/', nome: 'Pagina ' + i })); }), /de 1 a 40/);
  await ruim('sem a página principal', man(m => { m.paginas = m.paginas.filter(p => p.id !== 'principal'); }), /falta a página principal/);
  await ruim('um id repetido', man(m => { m.paginas.push(Object.assign(clone(rapida.entrada), { nome: 'Outro nome' })); }), /aparece duas vezes/);
  await ruim('um id com letra maiúscula', man(m => { m.paginas[2].id = 'Rapida'; }), /id de página inválido/);
  await ruim('um caminho que não bate com o id', man(m => { m.paginas[2].caminho = '/variacoes/outra/'; }), /caminho que não bate/);
  await ruim('um caminho pra outro endereço', man(m => { m.paginas[2].caminho = '//evil.example/x'; }), /caminho que não bate/);
  ok(!deck.pedidos().some(p => /evil/.test(p)), '(e o painel não pediu nada desse outro endereço)');
  await ruim('dois nomes iguais (sem olhar acento nem caixa)', man(m => { m.paginas[2].nome = m.paginas[1].nome.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }), /é de duas páginas/);
  await ruim('uma página sem o hash', man(m => { delete m.paginas[2].hash; }), /sem o hash/);
  await ruim('uma página sem nome', man(m => { m.paginas[2].nome = ''; }), /sem nome, resumo ou "quando usar"/);
  await ruim('um slide opcional depois do último slide', man(m => { m.paginas[2].opcionais[0].slide = 99; }), /opcional extra fora do formato/);
  await ruim('o variacoes.json não existe (404)', { status: 404, corpo: 'nada' }, /HTTP 404/);
  await ruim('o deck responde 500', { status: 500, corpo: 'x' }, /HTTP 500/);
  await ruim('o variacoes.json redireciona', { status: 302, local: alvo.url + '/x' }, /HTTP 302/);
  await ruim('o variacoes.json é grande demais', { corpo: Buffer.alloc(3 * 1024 * 1024, 32), tipo: 'application/json' }, /grande demais/);
  await ruim('a conexão cai', { derruba: true }, /sem resposta/);
  ok(alvo.pedidos.length === 0, 'nenhum redirecionamento foi seguido');
  ok(JSON.stringify({ a: arquivo().ajustes, c: arquivo().criadas }) === arqAntes, 'nada disso mexeu no que o admin fez (ajustes e variações criadas)');
  const f1 = await lista(admin);
  ok(f1.versoes.every(v => v.saude && v.saude.ok === true), 'as páginas da última lista boa continuam sendo conferidas');
  deck.poe('/variacoes.json', { corpo: JSON.stringify(bom()), tipo: 'application/json' });
  const f2 = await sinc();
  ok(f2.j.deck.falha === '' && f2.j.deck.okEm !== okAntes && Date.parse(f2.j.deck.okEm) > Date.parse(okAntes), 'o variacoes.json bom volta: a falha some e a "última leitura boa" avança');

  /* ---------------- G. deck fora do ar ou lento ---------------- */
  console.log('\nG. deck fora do ar ou lento');
  const tTec = await criaR2({ versao: 'tecnica' });
  deck.global({ derruba: true });
  let tg = Date.now();
  const g1 = await sinc();
  ok(g1.status === 200 && /sem resposta/.test(g1.j.deck.falha) && g1.j.deck.okEm === f2.j.deck.okEm && ids(g1.j) === ids(f2.j) && Date.now() - tg < 3000, 'deck fora do ar: a rota responde 200 na hora, com a falha anotada e a última lista boa');
  ok(g1.j.versoes.every(v => v.saude.ok === false && v.saude.falhas === 1) && g1.j.deck.problemas === 3, 'todas as páginas aparecem com uma falha');
  ok((await publico(tTec)).versao.caminho === '/variacoes/tecnica/' && (await publico(tRapida)).versao.caminho === '/variacoes/rapida/', 'uma conferência com falha não derruba ninguém ainda');
  deck.zera();
  const gc = await lista(carla);
  ok(deck.pedidos().length === 0, 'enquanto o deck está fora, o painel não martela: abrir a lista de novo não tenta de novo antes dos 2 minutos');
  ok(gc.deck.falhou === true && gc.deck.falha === '' && gc.deck.okEm === g1.j.deck.okEm, 'o closer vê que falhou (e de quando é a lista que ficou), sem o texto técnico da falha');
  await sinc();
  ok((await publico(tTec)).versao.id === 'principal' && (await publico(tRapida)).versao.id === 'principal' && (await publico(tRapida)).estado === 'ok', 'duas conferências seguidas fora do ar: os R2 abrem a Principal (o link nunca dá erro por causa disso)');
  await muda(d => { Object.values(d.decks.r2.saude).forEach(x => { x.em = new Date(Date.now() - 20 * MIN).toISOString(); }); });
  ok((await publico(tTec)).versao.caminho === '/variacoes/tecnica/', 'uma conferência com falha de mais de 15 minutos não conta: a página volta a abrir');
  deck.global({ atraso: 5500 });
  tg = Date.now();
  const g2 = await sinc();
  const msLento = Date.now() - tg;
  ok(g2.status === 200 && /demorou demais/.test(g2.j.deck.falha) && msLento < 8500, 'deck lento (5,5 s por resposta): a sincronização inteira desiste dentro do orçamento e responde em ' + (msLento / 1000).toFixed(1) + ' s (a função da Vercel para aos 10)');
  deck.global({});
  const g3 = await sinc();
  ok(g3.j.deck.falha === '' && g3.j.versoes.every(v => v.saude.ok === true && v.saude.falhas === 0) && (await publico(tTec)).versao.caminho === '/variacoes/tecnica/', 'o deck volta: tudo funcionando de novo, e os R2 voltam às páginas deles');

  /* ---------------- H. sem nenhuma leitura boa ---------------- */
  console.log('\nH. o painel nunca conseguiu ler o variacoes.json: vale o cadastro de reserva do código');
  await muda(d => { delete d.decks.r2; });
  deck.global({ derruba: true });
  const h1 = await lista(carla);
  ok(h1.deck.fonte === 'codigo' && h1.deck.okEm === '' && h1.deck.falhou === true && h1.deck.paginas === R.VERSOES.length, 'deck fora desde o começo: a lista é a do código (' + R.VERSOES.length + ' páginas) e o painel diz que é a de reserva');
  ok(h1.deck.falha === '' && /sem resposta/.test((await lista(admin)).deck.falha), 'o closer só fica sabendo que falhou; o motivo técnico é do admin'); 
  ok(R.VERSOES.every(rv => { const v = pg(h1, rv.id); return v && v.nome === rv.nome && v.caminho === rv.caminho && v.saude && v.saude.ok === false; }) && !pg(h1, 'rapida'), 'as duas páginas de sempre aparecem; a que veio só do deck não aparece (o painel não a conhece)');
  const h2 = pg(h1, slugCriada);
  ok(h2 && h2.base === 'principal' && h2.caminho === '/', 'a variação criada em cima da página que ele não conhece usa a Principal por enquanto');
  deck.global({});
  const h3 = await sinc();
  ok(h3.j.deck.fonte === 'deck' && h3.j.deck.okEm && h3.j.deck.falha === '' && pg(h3.j, 'rapida') && pg(h3.j, slugCriada).base === 'rapida' && pg(h3.j, slugCriada).caminho === '/variacoes/rapida/', 'o deck volta: a lista do deck assume e a variação criada recupera a base certa');

  /* ---------------- I. o que o deck escreve não é confiado ---------------- */
  console.log('\nI. o texto que vem do deck é limpo antes de chegar nos closers');
  const suja = paginaFalsa('suja', 3, { nome: '<img src=x onerror=alert(1)>Boa', resumo: 'Tem <script>roubar()</script> dentro.', quando: '<b>Negrito</b> e & "aspas"', opcionais: [{ id: 'op', slide: 2, rotulo: '<i>Rótulo</i>', ajuda: 'Ajuda <u>sublinhada</u>' }] });
  deck.poe(suja.caminho, { corpo: suja.html });
  deck.publica([rapida, suja]);
  const i1 = await sinc();
  const sv = pg(i1.j, 'suja');
  ok(sv && sv.nome === 'Boa' && !/[<>]/.test(JSON.stringify(sv)) && sv.resumo.startsWith('Tem') && sv.quando.includes('Negrito'), 'nome, resumo, quando usar e opcionais saem sem HTML (' + (sv && sv.nome) + ')');
  deck.publica([rapida]); await sinc();

  /* ---------------- J. o admin mexe enquanto o painel sincroniza ---------------- */
  console.log('\nJ. o admin mexe enquanto o painel sincroniza: nada se perde');
  deck.publica([rapida], { muda: { principal: { quando: 'Mudou no deck.' } } });
  const antesJ = arquivo();
  const par = await Promise.all([sinc(), put('tecnica', { nota: 'nota do admin' }), put('principal', { nota: 'outra nota' }), cria({ nome: 'Variação em paralelo', base: 'tecnica' }), cria({ nome: 'Segunda em paralelo', base: 'principal' })]);
  const dj = arquivo();
  ok(par.every(r => r.status === 200 || r.status === 201), 'a sincronização e quatro mudanças do admin, ao mesmo tempo, dão certo');
  ok(dj.ajustes.tecnica.nota === 'nota do admin' && dj.ajustes.principal.nota === 'outra nota' && dj.criadas.length === antesJ.criadas.length + 2 && dj.decks.r2.paginas.find(p => p.id === 'principal').quando === 'Mudou no deck.', 'as notas, as duas variações novas e o que o deck mudou: tudo ficou no versoes.json');

  /* ---------------- K. o que o versoes.json guarda ---------------- */
  console.log('\nK. o que fica guardado');
  const k = arquivo();
  ok(k.v === 1 && Array.isArray(k.criadas) && typeof k.ajustes === 'object' && k.decks && k.decks.r2 && k.decks.r2.origem === deck.url && k.decks.r2.em && k.decks.r2.okEm && Array.isArray(k.decks.r2.paginas) && typeof k.decks.r2.saude === 'object' && typeof k.decks.r2.sumiram === 'object', 'versoes.json: ajustes, criadas e o que o painel sabe do deck (origem, datas, páginas, saúde, quem saiu)');
  ok(JSON.stringify(k).length < 30000 && !/nome|foto|Lucas/i.test(JSON.stringify(k.decks.r2.saude)), 'é pequeno e a saúde não guarda corpo de página nem dado de atleta (' + JSON.stringify(k).length + ' bytes)');
  ok(k.decks.r2.paginas.every(p => /^[a-f0-9]{40}$/.test(p.hash) && Number.isInteger(p.slides) && p.visto), 'cada página guarda o hash, os slides e quando o painel a viu pela primeira vez');
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await s.fecha(); await deck.fecha(); await alvo.fecha();
}
fim();
