// As duas etapas do painel (R1 do SDR, R2 do closer) e os vários decks: quem vê o quê, o lead de cada etapa, o link de cada uma, o formato
// dos decks de antes (/api/publico), as variações de cada deck, as criadas pelo admin e a sincronização com todos os decks juntos.
// Os decks de R1, R2 anterior e R2 B são de mentira (controláveis); o R2 novo é o de verdade.
// Uso: node testes/teste-etapas.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { sobe, RAIZ_PAINEL } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';
import { sobeDeck, paginaFalsa, manifestoReal } from './_deck-falso.mjs';

const { ok, fim } = verificador('Etapas e decks');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ_PAINEL, 'regras.js'), 'utf8'), ctx);
const R = ctx.window.R2_REGRAS;
const MIN = 60 * 1000;
const clone = o => JSON.parse(JSON.stringify(o));

// os decks: o R2 novo é o de verdade (espelho da pasta); os outros três são de mentira
const dR2 = await sobeDeck(), dR1 = await sobeDeck(), dAnt = await sobeDeck(), dB = await sobeDeck();
const publicaPaginas = (deck, paginas) => {
  paginas.forEach(p => deck.poe(p.caminho, { corpo: p.html }));
  deck.poe('/variacoes.json', { corpo: JSON.stringify({ v: 1, gerado: new Date().toISOString(), paginas: paginas.map(p => p.entrada) }), tipo: 'application/json' });
};
const r1Principal = paginaFalsa('principal', 16, { nome: 'Principal', resumo: 'O R1 do SDR.', quando: 'A primeira apresentação.', validacao: 'em-validacao', lead: { nome: true, foto: false } });
const antPrincipal = paginaFalsa('principal', 25, { nome: 'Principal', resumo: 'O R2 de 25 slides.', quando: 'Só se precisar de 25 slides.', validacao: 'em-validacao', lead: { nome: true, foto: false } });
const antTecnica = paginaFalsa('tecnica', 25, { nome: 'Técnica', resumo: 'A técnica de 25 slides.', quando: 'Lead com vivência no meio.', validacao: 'em-validacao', lead: { nome: true, foto: false } });
const bPrincipal = paginaFalsa('principal', 27, { nome: 'Principal', resumo: 'O R2 com nome e primeiro sobrenome.', quando: 'Só se precisar desse endereço.', validacao: 'em-validacao', lead: { nome: true, foto: true } });
const bTecnica = paginaFalsa('tecnica', 27, { nome: 'Técnica', resumo: 'A técnica da B.', quando: 'Mesmo critério.', validacao: 'em-validacao', lead: { nome: true, foto: true } });
publicaPaginas(dR1, [r1Principal]);
publicaPaginas(dAnt, [antPrincipal, antTecnica]);
publicaPaginas(dB, [bPrincipal, bTecnica]);
const s = await sobe({ deck: false, decksExternos: { r2: dR2.url, r1: dR1.url, 'r2-anterior': dAnt.url, 'r2-b': dB.url } });
try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  const SENHA = 'senha-boa-123456';
  const cria = async (login, nome, papel) => { await admin.post('/api/usuarios', { login, nome, papel, senha: SENHA }); const c = new Cliente(s.painel); await c.entra(login, SENHA); return c; };
  const rafa = await cria('rafa.sdr', 'Rafa SDR', 'sdr'), bia = await cria('bia.sdr', 'Bia SDR', 'sdr');
  const carla = await cria('carla.closer', 'Carla Closer', 'closer');
  const anon = new Cliente(s.painel);
  const lista = async cli => (await cli.get('/api/versoes')).j;
  const ids = j => j.versoes.map(v => v.id).sort().join();
  const pg = (j, id) => j.versoes.find(v => v.id === id);
  const arquivo = () => JSON.parse(fs.readFileSync(path.join(s.dados, 'versoes.json'), 'utf8'));
  const sinc = () => admin.post('/api/versoes?acao=sincronizar', {});
  const hoje = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
  const fichaR1 = { nome: 'Lucas Almeida da Silva', posicao: 'volante', idade: '15', cidade: 'Natal', origem: 'Zyron', caracteristicas: 'arrancada', experiencia: 'Sub-15', r2data: hoje, r2hm: '19:30' };

  /* ---------------- A. quem vê o quê ---------------- */
  console.log('\nA. as variações de cada papel');
  const a = await lista(admin);
  ok(ids(a) === 'principal,r1-principal,r2a-principal,r2a-tecnica,r2b-principal,r2b-tecnica,tecnica', 'o admin vê as variações de todos os decks: as 2 do R2 novo, as 2 do R2 anterior, as 2 do R2 B e a do R1 (' + ids(a) + ')');
  ok(a.decks.length === 4 && a.decks.every(d => d.fonte === 'deck' && d.falhou === false && d.problemas === 0), 'os 4 decks foram sincronizados sozinhos na primeira abertura, nenhum com problema');
  const ac = await lista(carla), as = await lista(rafa);
  ok(ids(ac) === 'principal,r2a-principal,r2a-tecnica,r2b-principal,r2b-tecnica,tecnica' && ac.decks.map(d => d.id).sort().join() === 'r2,r2-anterior,r2-b', 'o closer vê só as do R2 (3 decks)');
  ok(ids(as) === 'r1-principal' && as.decks.map(d => d.id).join() === 'r1', 'o SDR vê só a do R1 (1 deck)');
  ok((await anon.get('/api/versoes')).status === 401, 'sem login, nada: 401');
  ok(a.versoes.every(v => ['r1', 'r2'].includes(v.etapa) && v.deck && v.origem && v.recursos && typeof v.recursos.nomeTela === 'boolean'), 'cada variação traz a etapa, o deck, a origem e o que o deck faz (recursos)');
  ok(a.versoes.every(v => v.origem === (R.DECKS.find(d => d.id === v.deck) && { r2: dR2.url, 'r2-anterior': dAnt.url, 'r2-b': dB.url, r1: dR1.url }[v.deck])), 'a origem de cada variação é a do deck dela');
  ok(R.DECKS.every(d => a.versoes.filter(v => v.deck === d.id).every(v => JSON.stringify(v.recursos) === JSON.stringify(d.recursos))), 'os recursos de cada variação são os do deck no catálogo');
  ok(pg(a, 'r1-principal').lead.nome === true && pg(a, 'r1-principal').lead.foto === false && pg(a, 'r2a-principal').lead.foto === false && pg(a, 'principal').lead.foto === true, 'o que a variação mostra do lead segue o que o deck faz (o R1 e o R2 anterior nunca mostram a foto)');
  ok(a.decks.find(d => d.id === 'r2-anterior').paginas === 2 && a.decks.find(d => d.id === 'r1').paginas === 1, 'cada deck diz quantas páginas tem');
  ok(ac.decks.every(d => d.falha === '') && a.decks.every(d => typeof d.falha === 'string'), 'o detalhe técnico da falha é só do admin (o closer recebe "falha" vazio)');

  /* ---------------- B. criar o lead de cada etapa ---------------- */
  console.log('\nB. o lead de cada etapa');
  const novo = (cli, corpo) => cli.post('/api/atletas', corpo);
  const r1a = await novo(rafa, { ficha: fichaR1 });
  ok(r1a.status === 201 && r1a.j.etapa === 'r1' && r1a.j.registro.etapa === 'r1', 'o SDR cria um lead e ele é R1 (sem dizer a etapa)');
  ok(r1a.j.link === dR1.url + '/?a=' + r1a.j.t, 'o link do R1 sai do deck de entrada do R1');
  ok((await novo(rafa, { ficha: fichaR1, etapa: 'r2' })).status === 403, 'o SDR pedindo R2: 403');
  ok((await novo(carla, { ficha: { nome: 'Pedro Costa' }, etapa: 'r1' })).status === 403, 'o closer pedindo R1: 403');
  const r2a = await novo(carla, { ficha: { nome: 'Pedro Henrique Costa', plano: 'Scouting' } });
  ok(r2a.status === 201 && r2a.j.etapa === 'r2' && r2a.j.link === dR2.url + '/?a=' + r2a.j.t, 'o closer cria R2, com o link do deck de entrada do R2');
  const adR1 = await novo(admin, { ficha: fichaR1, etapa: 'r1' }), adR2 = await novo(admin, { ficha: { nome: 'Davi Lima' } });
  ok(adR1.j.etapa === 'r1' && adR2.j.etapa === 'r2', 'o admin escolhe a etapa (sem dizer, é R2)');
  ok((await novo(rafa, { ficha: {} })).status === 201, 'ficha vazia é aceita: 201');

  /* ---------------- C. a ficha de cada etapa ---------------- */
  console.log('\nC. a ficha de cada etapa');
  const tR1 = r1a.j.t, fR1 = r1a.j.registro.ficha;
  ok(fR1.nome === fichaR1.nome && fR1.posicao === 'volante' && fR1.idade === '15' && fR1.cidade === 'Natal' && fR1.origem === 'Zyron' && fR1.r2data === hoje && fR1.r2hm === '19:30', 'a ficha do R1 guarda nome, posição, idade, cidade, origem, o que chamou atenção, experiência e o dia e a hora da R2');
  const suja = await novo(rafa, { ficha: Object.assign({}, fichaR1, { plano: 'Scouting', apelido: 'Luquinhas', gerente: 'Fulano', pe: 'Destro', altura: '170', nomeTela: 'sem', semFoto: 'sim', pular: 'leva', vagas: '3', prazoContato: 'ainda hoje' }) });
  const fs1 = suja.j.registro.ficha;
  ok(!('plano' in fs1) && !('apelido' in fs1) && !('gerente' in fs1) && fs1.pe === 'Destro' && fs1.altura === '170' && !('nomeTela' in fs1) && fs1.semFoto === 'sim' && !('pular' in fs1) && !('vagas' in fs1) && !('prazoContato' in fs1), 'o que é só do R2 (plano, apelido, gerente, nome na tela, foto, slide opcional, prazos) não fica no R1; pé e altura ficam (desde 18/10/2026)');
  const comVar = await novo(rafa, { ficha: Object.assign({}, fichaR1, { versao: 'tecnica' }) });
  ok(comVar.status === 400, 'variação do R2 num R1: 400');
  const r2comR1 = await novo(carla, { ficha: { nome: 'Pedro Costa', versao: 'r1-principal' } });
  ok(r2comR1.status === 400, 'variação do R1 num R2: 400');
  ok((await novo(carla, { ficha: { nome: 'Pedro Costa', versao: 'r2a-tecnica', nomeTela: 'sem', pular: 'leva' } })).status === 201, 'o closer escolhe uma variação de outro deck do R2 (a Técnica do R2 anterior)');
  const tAnt = (await novo(carla, { ficha: { nome: 'Pedro Costa', versao: 'r2a-tecnica', nomeTela: 'sem', pular: 'leva', semFoto: 'sim' } })).j;
  // desde 18/10/2026 o R2 anterior segue o Nome na tela (como o R2 novo); slide opcional ele continua sem
  ok(tAnt.registro.ficha.nomeTela === 'sem' && !('pular' in tAnt.registro.ficha) && tAnt.registro.ficha.semFoto === 'sim' && tAnt.registro.ficha.versao === 'r2a-tecnica', 'o R2 anterior segue o nome na tela e a foto, mas não tira slide: o slide opcional não fica na ficha');
  const tBp = (await novo(carla, { ficha: { nome: 'Pedro Costa', versao: 'r2b-principal', nomeTela: 'so-nome', semFoto: 'sim' } })).j;
  ok(!('nomeTela' in tBp.registro.ficha) && tBp.registro.ficha.semFoto === 'sim', 'o R2 B segue a foto (semFoto fica) mas não o nome na tela');
  const tNovo = (await novo(carla, { ficha: { nome: 'Pedro Costa' } })).j;
  ok(tAnt.checklist.previa === true && tNovo.checklist.previa === false && tBp.checklist.previa === false, 'o deck sem prévia no quadro (R2 anterior) já vem com a prévia cumprida; no R2 novo e no R2 B, a prévia segue sendo um item a olhar');
  const salva = await rafa.put('/api/atletas?t=' + tR1, { ficha: Object.assign({}, fR1, { cidade: 'Parnamirim', plano: 'Scouting' }), base: r1a.j.registro.fichaEm });
  ok(salva.status === 200 && salva.j.registro.ficha.cidade === 'Parnamirim' && !('plano' in salva.j.registro.ficha), 'o SDR salva a ficha do R1 (e o plano continua de fora)');
  ok(salva.j.registro.historico.slice(-1)[0].o === 'salvou a ficha (cidade)', 'o histórico anota só o campo que mudou');

  /* ---------------- D. o que o deck lê ---------------- */
  console.log('\nD. o que o deck lê (/api/r2) e o formato dos decks de antes (/api/publico)');
  const publico = async (t, op) => { const r = await fetch(s.painel + '/api/r2?t=' + t, { headers: { Origin: dR1.url } }); return Object.assign(await r.json(), { _s: r.status }); };
  const pr1 = await publico(tR1);
  ok(pr1.estado === 'ok' && pr1.versao.id === 'r1-principal' && pr1.versao.caminho === '/' && pr1.versao.origem === dR1.url, 'o R1 aponta pro deck do R1 (id, caminho e origem)');
  ok(Object.keys(pr1.ficha).sort().join() === 'cidade,experiencia,idade,nome,origem,caracteristicas,posicao,r2dia,r2hora,semFoto'.split(',').sort().join() && pr1.ficha.r2dia && pr1.ficha.r2hora === '19h30' && !('foto' in pr1) && !('video' in pr1), 'a ficha pública do R1 só leva o que o deck dele usa (a ficha do atleta e o dia e a hora da R2), sem foto nem vídeo');
  const p2 = await publico(tAnt.t);
  ok(p2.versao.id === 'r2a-tecnica' && p2.versao.caminho === '/variacoes/tecnica/' && p2.versao.origem === dAnt.url, 'o R2 numa variação do R2 anterior aponta pro deck dele (o deck de entrada leva o lead pra lá)');
  const leg = await fetch(s.painel + '/api/publico?id=' + tR1, { headers: { Origin: dR1.url } });
  const lj = await leg.json();
  ok(leg.status === 200 && lj.id === tR1 && lj.ficha.nome === fichaR1.nome && lj.versao.origem === dR1.url && !('estado' in lj) && !('foto' in lj), 'o /api/publico?id= (o que os decks de antes leem) responde no formato de antes: { id, ficha, atualizadoEm, versao }');
  ok(leg.headers.get('access-control-allow-origin') === dR1.url, '... com CORS só pro deck dele (não mais "*")');
  const legFora = await fetch(s.painel + '/api/publico?id=' + tR1, { headers: { Origin: 'https://outro.exemplo' } });
  ok(legFora.status === 200 && !legFora.headers.get('access-control-allow-origin'), 'de outra origem, sem CORS');
  const sem = await fetch(s.painel + '/api/publico?id=' + 'a'.repeat(26));
  ok(sem.status === 404 && (await sem.json()).erro, 'código que não existe: 404 com { erro }');
  ok((await fetch(s.painel + '/api/publico?id=nao-e-codigo')).status === 404 && (await fetch(s.painel + '/api/publico')).status === 404, 'código de outro formato, ou sem código: 404');
  await rafa.post('/api/link?t=' + tR1 + '&acao=revogar', {});
  const rev = await fetch(s.painel + '/api/publico?id=' + tR1);
  ok(rev.status === 404 && (await publico(tR1)).estado === 'revogado', 'link revogado: o formato de antes dá 404 (os decks de antes só olham se deu certo), o novo diz "revogado"');
  await rafa.post('/api/link?t=' + tR1 + '&acao=reativar', {});
  ok((await fetch(s.painel + '/api/publico?id=' + tR1)).status === 200, 'reativado, volta');
  ok((await fetch(s.painel + '/api/video?id=' + tR1)).status === 404, 'o /api/video?id= (nome de antes) aceita o código e responde 404 sem vídeo');

  /* ---------------- E. o R1 não usa foto, vídeo nem leitura ---------------- */
  console.log('\nE. o R1 não usa foto, vídeo nem leitura');
  const jpg = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAAA//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==', 'base64').toString('base64');
  ok((await rafa.put('/api/foto?t=' + tR1, { retrato: jpg, avatar: jpg, autorizo: true })).status === 400, 'foto no R1: 400 ("o R1 não usa a foto")');
  ok((await rafa.put('/api/leitura?t=' + tR1, { autorizar: true })).status === 400, 'vídeo e leitura no R1: 400');
  ok((await rafa.get('/api/leitura?t=' + tR1)).status === 400 && (await rafa.del('/api/leitura?t=' + tR1)).status === 400, '... também pra ler e apagar');
  ok((await carla.put('/api/foto?t=' + tR1, { retrato: jpg, avatar: jpg, autorizo: true })).status === 403, 'o closer não mexe no R1 de um SDR: 403');
  ok((await carla.get('/api/atletas?t=' + tR1)).status === 403 && (await bia.get('/api/atletas?t=' + tR1)).status === 403, 'nem lê (closer e outro SDR): 403');
  ok((await admin.get('/api/atletas?t=' + tR1)).status === 200, 'o admin vê');

  /* ---------------- F. checklist e validade ---------------- */
  console.log('\nF. o checklist e a validade do R1');
  const ck0 = (await rafa.get('/api/atletas?t=' + tR1)).j;
  ok(ck0.checklist.foto === true && ck0.checklist.plano === true && ck0.checklist.previa === true && ck0.checklist.posicao === true && ck0.checklist.call === true && ck0.checklist.nome === false && ck0.estado === 'rascunho', 'R1: foto, plano e prévia não se pedem; falta só conferir o nome (' + ck0.estado + ')');
  const conf = await rafa.put('/api/atletas?t=' + tR1, { ficha: ck0.registro.ficha, base: ck0.registro.fichaEm, conferido: { nome: true } });
  ok(conf.j.estado === 'pronto' && conf.j.checklist.nome === true, 'nome conferido: o R1 fica pronto');
  const semIdade = await novo(rafa, { ficha: { nome: 'Davi Souza', posicao: 'meia', cidade: 'Natal', r2data: hoje, r2hm: '10:00' } });
  ok(semIdade.j.checklist.posicao === false, 'sem idade, o item da ficha do slide 02 não fecha');
  const semData = await novo(rafa, { ficha: { nome: 'Davi Souza' } });
  const dias = (Date.parse(semData.j.registro.venceEm) - Date.parse(semData.j.registro.criadoEm)) / 864e5;
  ok(dias > 29.9 && dias < 30.1, 'R1 sem dia da R2: o link vale 30 dias a partir de agora (' + dias.toFixed(2) + ')');
  const dias2 = (Date.parse(r2a.j.registro.venceEm) - Date.parse(r2a.j.registro.criadoEm)) / 864e5;
  ok(dias2 > 6.9 && dias2 < 7.1, 'R2 sem dia da call: 7 dias, como sempre (' + dias2.toFixed(2) + ')');
  const comData = (Date.parse(r1a.j.registro.venceEm) - Date.parse(hoje + 'T23:59:59-03:00')) / 864e5;
  ok(Math.abs(comData - 7) < 0.1, 'R1 com dia da R2: vale até 7 dias depois dele');

  /* ---------------- G. a lista de cada um e a troca de dono ---------------- */
  console.log('\nG. a lista e o dono');
  const lr = (await rafa.get('/api/atletas')).j.itens, lc = (await carla.get('/api/atletas')).j.itens, lt = (await admin.get('/api/atletas?todos=1')).j.itens;
  ok(lr.every(i => i.etapa === 'r1') && lr.length >= 3 && lc.every(i => i.etapa === 'r2'), 'a lista de cada um traz os dele, com a etapa');
  ok(lt.some(i => i.etapa === 'r1') && lt.some(i => i.etapa === 'r2'), 'o admin vê os de todos, das duas etapas');
  ok((await admin.put('/api/atletas?t=' + tR1, { dono: 'carla.closer' })).status === 400, 'o admin não passa um R1 pra um closer: 400');
  ok((await admin.put('/api/atletas?t=' + r2a.j.t, { dono: 'rafa.sdr' })).status === 400, 'nem um R2 pra um SDR: 400');
  const passa = await admin.put('/api/atletas?t=' + tR1, { dono: 'bia.sdr' });
  ok(passa.status === 200 && (await bia.get('/api/atletas?t=' + tR1)).status === 200 && (await rafa.get('/api/atletas?t=' + tR1)).status === 403, 'passa o R1 de um SDR pra outro: o dono novo vê e o antigo não');
  ok((await rafa.del('/api/atletas?t=' + tR1)).status === 403 && (await bia.del('/api/atletas?t=' + tR1)).status === 200, 'só o dono (ou o admin) apaga');

  /* ---------------- H. importar o R1 do SDR no R2 do closer ---------------- */
  console.log('\nH. o closer importa o R1 do SDR');
  const tImp = (await novo(rafa, { ficha: Object.assign({}, fichaR1, { nome: 'Joao Pedro da Silva' }) })).j.t;
  const imp = await carla.post('/api/importar', { id: dR1.url + '/?a=' + tImp });
  ok(imp.status === 200 && imp.j.ficha.nome === 'Joao Pedro da Silva' && imp.j.ficha.posicao === 'volante' && imp.j.ficha.idade === '15' && imp.j.ficha.cidade === 'Natal' && imp.j.ficha.r2data === hoje && imp.j.ficha.r2hm === '19:30', 'o closer cola o link do R1 e a ficha vem mapeada pro R2 (nome, posição, idade, cidade, dia e hora da R2)');
  ok(!('versao' in imp.j.ficha) && !('plano' in imp.j.ficha), 'sem variação nem plano (o closer escolhe)');
  ok((await carla.post('/api/importar', { id: tImp })).status === 200 && (await carla.post('/api/importar', { id: 'z'.repeat(26) })).status === 404 && (await anon.post('/api/importar', { id: tImp })).status === 401, 'só o código também serve; código que não existe: 404; sem login: 401');

  /* ---------------- I. variações criadas pelo admin, de qualquer deck ---------------- */
  console.log('\nI. variações criadas pelo admin');
  const cria1 = await admin.post('/api/versoes', { nome: 'R1 curto', base: 'r1-principal', quando: 'Lead com pouco tempo', lead: { nome: false, foto: true } });
  const slug1 = cria1.j && cria1.j.criada;
  const v1 = cria1.j && pg(cria1.j, slug1);
  ok(cria1.status === 201 && v1.etapa === 'r1' && v1.deck === 'r1' && v1.base === 'r1-principal' && v1.origem === dR1.url, 'o admin cria uma variação em cima da página do R1: ela é do R1');
  ok(v1.lead.nome === true && v1.lead.foto === true, 'o R1 preserva o primeiro nome e permite foto');
  const cria2 = await admin.post('/api/versoes', { nome: 'Técnica de 25 sem pressa', base: 'r2a-tecnica' });
  const slug2 = cria2.j && cria2.j.criada;
  ok(cria2.status === 201 && pg(cria2.j, slug2).etapa === 'r2' && pg(cria2.j, slug2).deck === 'r2-anterior', 'em cima da técnica do R2 anterior: é do R2 e do deck dele');
  ok((await admin.post('/api/versoes', { nome: 'Principal', base: 'r1-principal' })).status === 400 && (await admin.post('/api/versoes', { nome: 'R1 curto', base: 'r1-principal' })).status === 400, 'nome repetido na mesma etapa: 400 (Principal e o que já existe)');
  ok((await admin.post('/api/versoes', { nome: 'R1 curto', base: 'tecnica' })).status === 201, '(o mesmo nome em outra etapa pode)');
  ok(ids(await lista(rafa)).split(',').includes(slug1) && !ids(await lista(rafa)).split(',').includes(slug2) && ids(await lista(carla)).split(',').includes(slug2), 'o SDR vê a variação do R1 e o closer a do R2, e nenhum vê a da outra etapa');
  const tc1 = await novo(rafa, { ficha: Object.assign({}, fichaR1, { versao: slug1 }) });
  ok(tc1.status === 201 && (await publico(tc1.j.t)).versao.origem === dR1.url, 'o SDR gera um R1 com a variação criada');
  ok((await novo(carla, { ficha: { nome: 'Pedro Costa', versao: slug1 } })).status === 400, 'o closer não usa a variação do R1: 400');
  const pl = await admin.put('/api/versoes?id=r2b-principal', { lead: { nome: false } });
  ok(pl.status === 400, 'o admin não tira o nome do lead num deck que não segue isso (R2 B): 400');
  ok((await admin.put('/api/versoes?id=r2a-principal', { lead: { nome: false } })).status === 200 && (await admin.put('/api/versoes?id=r2a-principal', { lead: { nome: true } })).status === 200, 'no R2 anterior (que segue o Nome na tela desde 18/10/2026) dá pra tirar e voltar o nome');
  ok((await admin.put('/api/versoes?id=r1-principal', { lead: { foto: true } })).status === 200, 'permite ligar a foto no R1: 200');
  ok((await admin.put('/api/versoes?id=r2b-principal', { lead: { foto: false } })).status === 200, 'no R2 B (que mostra a foto) dá pra tirar a foto');
  ok((await admin.put('/api/versoes?id=r1-principal', { arquivada: true })).status === 400 && (await admin.put('/api/versoes?id=principal', { arquivada: true })).status === 400, 'a principal de cada etapa não arquiva');
  ok((await admin.put('/api/versoes?id=r2a-principal', { arquivada: true, nota: 'não usar mais' })).status === 200 && (await admin.put('/api/versoes?id=r2a-principal', { arquivada: false })).status === 200, 'a principal do R2 anterior arquiva e volta');
  ok((await carla.put('/api/versoes?id=r2a-principal', { nota: 'x' })).status === 403 && (await rafa.post('/api/versoes', { nome: 'Mais uma', base: 'r1-principal' })).status === 403, 'closer e SDR não ajustam nem criam variação: 403');

  /* ---------------- J. a sincronização com todos os decks ---------------- */
  console.log('\nJ. a sincronização com todos os decks');
  const novaR1 = paginaFalsa('rapido', 10, { nome: 'R1 rápido', resumo: 'Dez slides.', quando: 'Lead com pressa.', validacao: 'em-validacao', lead: { nome: true, foto: false } });
  publicaPaginas(dR1, [r1Principal, novaR1]);
  dB.global({ derruba: true });
  const j1 = await sinc();
  ok(j1.status === 200 && pg(j1.j, 'r1-rapido') && pg(j1.j, 'r1-rapido').etapa === 'r1' && pg(j1.j, 'r1-rapido').nova === true && pg(j1.j, 'r1-rapido').caminho === '/variacoes/rapido/', 'uma página nova no deck do R1 aparece como variação do R1 (r1-rapido), "nova", sem cadastro');
  const dbB = j1.j.decks.find(d => d.id === 'r2-b'), dbR1 = j1.j.decks.find(d => d.id === 'r1');
  ok(dbB.falhou === true && /sem resposta/.test(dbB.falha) && dbB.problemas === 2 && dbR1.falhou === false && dbR1.paginas === 2, 'o R2 B fora do ar não atrapalha os outros: ele marca a falha e as 2 páginas com problema; o R1 sincroniza as 2 dele');
  ok(j1.j.decks.filter(d => d.id !== 'r2-b').every(d => d.falhou === false && d.problemas === 0), 'os outros decks seguem sem problema');
  const ar = arquivo();
  ok(ar.decks && ['r2', 'r2-anterior', 'r2-b', 'r1'].every(id => ar.decks[id] && ar.decks[id].origem) && !('deck' in ar) && ar.decks['r2-b'].falha && ar.decks['r2-b'].okEm && ar.decks['r2-b'].paginas.length === 2, 'versoes.json guarda cada deck em decks (e o R2 B, que sincronizou antes, guarda a última lista boa)');
  dB.global({});
  // o R2 novo some do ar: os R2 dele caem na principal, e a variação de outro deck não é afetada
  dR2.poe('/variacoes/tecnica/', { status: 500, corpo: 'x' });
  await sinc(); const j2 = await sinc();
  ok(pg(j2.j, 'tecnica').saude.falhas === 2 && pg(j2.j, 'r2a-tecnica').saude.ok === true, 'a Técnica do R2 novo falhando 2 vezes não mexe nas páginas dos outros decks');
  const tTec = (await novo(carla, { ficha: { nome: 'Pedro Costa', versao: 'tecnica' } })).j.t;
  ok((await publico(tTec)).versao.id === 'principal' && (await publico(tAnt.t)).versao.id === 'r2a-tecnica', 'o R2 na Técnica quebrada abre a Principal do R2 novo; o R2 do R2 anterior segue na página dele');
  dR2.tira('/variacoes/tecnica/');
  // uma página do deck do R1 sai: o R1 que a usava abre a principal do R1 (não a do R2)
  const tRap = (await novo(rafa, { ficha: Object.assign({}, fichaR1, { versao: 'r1-rapido' }) })).j.t;
  publicaPaginas(dR1, [r1Principal]);
  await sinc();
  const pRap = await publico(tRap);
  ok(pRap.versao.id === 'r1-principal' && pRap.versao.origem === dR1.url && pRap.ficha.nome === fichaR1.nome, 'a página do R1 saiu do deck: o lead abre a principal do R1 (e a ficha segue)');
  const vRap = pg(await lista(rafa), 'r1-rapido');
  ok(vRap && vRap.sumiu === true, 'a variação sumida continua na lista do SDR, marcada');
  // manifesto do R1 tentando usar o id de outro deck
  const roubo = paginaFalsa('r2a-roubo', 5, { nome: 'Roubo', resumo: 'x', quando: 'y' });
  dR2.poe('/variacoes.json', { corpo: JSON.stringify({ v: 1, gerado: new Date().toISOString(), paginas: [manifestoReal().paginas[0], roubo.entrada] }), tipo: 'application/json' });
  dR2.poe(roubo.caminho, { corpo: roubo.html });
  const j3 = await sinc();
  ok(/começo de id que é de outro deck/.test(j3.j.decks.find(d => d.id === 'r2').falha) && !pg(j3.j, 'r2a-roubo'), 'o R2 novo não pode ter página com o começo de id de outro deck (r2a-): o manifesto é recusado e o painel fica com a última lista');
  dR2.tira('/variacoes.json');

  /* ---------------- K. o que o deck de entrada precisa saber ---------------- */
  console.log('\nK. a origem que vai pro deck');
  const ps = await sinc();
  ok(ps.j.versoes.every(v => v.origem && /^http:\/\/127\.0\.0\.1:\d+$/.test(v.origem)), 'toda variação tem uma origem (a do deck, sem barra no fim)');
  const sess = await carla.get('/api/sessao');
  ok(sess.j.config.etapas.join() === 'r2' && sess.j.config.decks.length === 4 && sess.j.config.decks.find(d => d.id === 'r1').entrada === true && sess.j.config.decks.every(d => d.recursos), 'a config da sessão traz as etapas do papel e os decks (origem, entrada, recursos)');
  ok((await rafa.get('/api/sessao')).j.config.etapas.join() === 'r1' && (await admin.get('/api/sessao')).j.config.etapas.join() === 'r1,r2', 'SDR: r1; admin: r1 e r2');
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await s.fecha();
  for (const d of [dR2, dR1, dAnt, dB]) await d.fecha();
}
fim();
