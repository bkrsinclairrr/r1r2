// Teste de concorrência e de segurança das rotas do Painel do Closer, com o driver de arquivo (nada sai da máquina).
// Uso: node testes/teste-concorrencia.mjs
// 1. 6 closers criam 5 atletas cada, ao mesmo tempo: 30 registros, 5 itens no índice de cada closer, nenhum perdido.
// 2. 10 gravações ao mesmo tempo no MESMO atleta (ficha, foto, vídeo, link, prévia, presença): nenhuma perdida; duas
//    salvando a ficha com a mesma base: uma passa, a outra recebe 409 com quem salvou e quando.
// 3. /api/r2 com código de outro formato, inexistente, vencido e revogado: sem dado nenhum, na forma combinada; o tempo
//    de resposta do inexistente parecido com o do existente.
// 4. /api/r2 e /api/foto nunca devolvem dono, quem criou, nota, histórico, quem autorizou, validade nem caminho de arquivo.
// 5. CORS: origem fora de DECK_ORIGINS não recebe Access-Control-Allow-Origin; a permitida recebe só ela.
// 6. Escrita só com JSON (415 no resto), cookie HttpOnly; Secure; SameSite=Strict, sessão de 12 h, usuário removido perde
//    o acesso na hora.
// 7. Limpeza diária: foto e vídeo vencidos somem, registro 180 dias depois do link some, sem o segredo do Cron dá 401.
// 8. Gerar outro link: o código velho vira "nao-encontrado", fotos e vídeo vão junto.
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZ_DECK } from './servidor.mjs';
import { Cliente, verificador, fotosDeTeste, b64, espera } from './_util.mjs';

const T_OK = /^[a-z2-7]{26}$/;
const s = await sobe({ deck: false });
const { ok, fim } = verificador('Concorrência e segurança');
const fotos = fotosDeTeste(RAIZ_DECK);
const F = n => path.join(fotos, n);
const arqDados = (...p) => path.join(s.dados, ...p);
const leDado = (...p) => JSON.parse(fs.readFileSync(arqDados(...p), 'utf8'));
const mexeDado = (p, muda) => { const a = arqDados(...p.split('/')); const d = JSON.parse(fs.readFileSync(a, 'utf8')); muda(d); fs.writeFileSync(a, JSON.stringify(d)); };
const mediana = a => { const b = a.slice().sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };

try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);

  // os 6 closers, criados ao mesmo tempo (o usuarios.json também é disputado)
  const closers = Array.from({ length: 6 }, (_, i) => Object.assign(new Cliente(s.painel), { login: 'closer' + (i + 1), nome: 'Closer ' + (i + 1), senha: 'senha-teste-' + (i + 1) + '-xyz' }));
  const cria = await Promise.all(closers.map(c => admin.post('/api/usuarios', { login: c.login, nome: c.nome, papel: 'closer', senha: c.senha })));
  ok(cria.every(r => r.status === 200), 'os 6 closers foram criados ao mesmo tempo (' + cria.map(r => r.status).join(',') + ')');
  const us = await admin.get('/api/usuarios');
  ok(us.j && us.j.usuarios.length === 7, 'a lista de usuários tem os 6 closers e o admin (' + (us.j && us.j.usuarios.length) + ')');
  ok(us.j && us.j.usuarios.every(u => !('hash' in u)), 'a lista de usuários nunca devolve o hash da senha');
  for (const c of closers) await c.entra(c.login, c.senha);

  /* ---------------- 1. 30 criações ao mesmo tempo ---------------- */
  console.log('\n1. 6 closers, 5 atletas cada, ao mesmo tempo');
  const pedidos = closers.flatMap((c, i) => [1, 2, 3, 4, 5].map(k => c.post('/api/atletas', { ficha: { nome: 'Atleta ' + (i + 1) + '-' + k + ' Teste', posicao: 'volante', plano: 'Assessoria PRO' } }).then(r => ({ c, r }))));
  const criados = await Promise.all(pedidos);
  ok(criados.every(x => x.r.status === 201), 'as 30 criações responderam 201');
  const codigos = criados.map(x => x.r.j && x.r.j.t);
  ok(new Set(codigos).size === 30 && codigos.every(t => T_OK.test(t)), '30 códigos diferentes, todos com 26 letras a-z e 2-7');
  ok(criados.every(x => x.r.j.link === s.deck + '/?a=' + x.r.j.t || x.r.j.link.endsWith('/?a=' + x.r.j.t)), 'o link de cada um é o deck com ?a=<código>');
  const noDisco = fs.readdirSync(arqDados('atletas')).filter(n => n.endsWith('.json'));
  ok(noDisco.length === 30, 'os 30 registros existem no armazenamento (' + noDisco.length + ')');
  for (const c of closers) {
    const meus = criados.filter(x => x.c === c).map(x => x.r.j.t).sort();
    const idx = leDado('indices', c.login + '.json');
    const lista = await c.get('/api/atletas');
    const daLista = (lista.j.itens || []).map(i => i.t).sort();
    ok(Object.keys(idx.itens).length === 5 && JSON.stringify(daLista) === JSON.stringify(meus), c.login + ': índice com os 5 dele, nenhum perdido e nenhum de outro');
  }
  const todos = await admin.get('/api/atletas?todos=1');
  ok(todos.j && todos.j.itens.length === 30, 'o admin vê os 30 com ?todos=1 (' + (todos.j && todos.j.itens.length) + ')');
  const deOutro = await closers[0].get('/api/atletas?t=' + criados.find(x => x.c === closers[1]).r.j.t);
  ok(deOutro.status === 403, 'closer abrindo o R2 de outro closer: 403 (' + deOutro.status + ')');
  const semNome = await closers[0].post('/api/atletas', { ficha: { posicao: 'meia' } });
  ok(semNome.status === 201, 'criar sem nome: 201 (' + semNome.status + ')');

  /* ---------------- 2. 10 gravações ao mesmo tempo no mesmo atleta ---------------- */
  console.log('\n2. 10 gravações ao mesmo tempo no mesmo atleta');
  const c1 = closers[0];
  const t = criados.find(x => x.c === c1).r.j.t;
  const reg0 = (await c1.get('/api/atletas?t=' + t)).j.registro;
  const base = reg0.fichaEm, ficha0 = reg0.ficha;
  const aut = await c1.put('/api/leitura?t=' + t, { autorizar: true });
  ok(aut.status === 200, 'autorização do vídeo registrada antes (' + aut.status + ')');
  const video = 'videos/' + t + '/abcdefghijkl1234.mp4';
  fs.mkdirSync(arqDados('videos', t), { recursive: true });
  fs.copyFileSync(path.join(RAIZ_DECK, 'assets', 'video', 'poster-zyron-filme.jpg'), arqDados('videos', t, 'abcdefghijkl1234.mp4'));
  const sids = ['sidaaaaaaaaaaaaaaaaa', 'sidbbbbbbbbbbbbbbbbb', 'sidccccccccccccccccc'];
  const pub = new Cliente(s.painel);
  const ops = await Promise.all([
    c1.put('/api/atletas?t=' + t, { ficha: Object.assign({}, ficha0, { cidade: 'Natal' }), base }),
    c1.put('/api/atletas?t=' + t, { ficha: Object.assign({}, ficha0, { sonho: 'Jogar na Europa' }), base }),
    c1.put('/api/foto?t=' + t, { retrato: b64(F('retrato-a.jpg')), avatar: b64(F('avatar-a.jpg')), autorizo: true }),
    c1.put('/api/foto?t=' + t, { retrato: b64(F('retrato-b.jpg')), avatar: b64(F('avatar-b.jpg')), autorizo: true }),
    c1.put('/api/leitura?t=' + t, { video: { arquivo: video, tipo: 'video/mp4', bytes: 1000, duracaoS: 30 } }),
    c1.post('/api/link?t=' + t + '&acao=renovar', { dias: 30 }),
    c1.put('/api/atletas?t=' + t, { previa: true }),
    ...sids.map(sid => pub.pede('POST', '/api/chamada?t=' + t, { texto: JSON.stringify({ t, sid }) }))
  ]);
  const [fA, fB, ft1, ft2, vid, lnk, prv, ...ch] = ops;
  const fichas = [fA, fB];
  ok(fichas.filter(r => r.status === 200).length === 1 && fichas.filter(r => r.status === 409).length === 1, 'as duas fichas com a mesma base: uma 200 e uma 409 (' + fichas.map(r => r.status).join(',') + ')');
  const o409 = fichas.find(r => r.status === 409), o200 = fichas.find(r => r.status === 200);
  ok(o409 && o409.j.conflito && o409.j.conflito.por === 'Closer 1' && T_OK.test(t) && Date.parse(o409.j.conflito.em) > 0, 'o 409 diz quem salvou e quando (' + (o409 && JSON.stringify(o409.j.conflito)) + ')');
  ok([ft1, ft2, vid, lnk, prv].every(r => r.status === 200), 'foto, foto, vídeo, link e prévia: todos 200 (' + [ft1, ft2, vid, lnk, prv].map(r => r.status).join(',') + ')');
  ok(ch.every(r => r.status === 200) && ch.filter(r => r.j.conflito === null).length === 1 && ch.filter(r => r.j.conflito && r.j.conflito.desde).length === 2, 'presença: uma sessão fica com ela e as outras duas recebem o aviso de conflito');
  const fin = (await admin.get('/api/atletas?t=' + t)).j.registro;
  const venceu = o200 === fA ? 'cidade' : 'sonho';
  ok(venceu === 'cidade' ? fin.ficha.cidade === 'Natal' && !fin.ficha.sonho : fin.ficha.sonho === 'Jogar na Europa' && !fin.ficha.cidade, 'a ficha que passou está no registro e a recusada não entrou (' + venceu + ')');
  ok(fin.foto && fin.foto.versao === 2 && fin.foto.autorizadoEm, 'as duas fotos entraram em ordem: versão final 2, com autorização registrada');
  const arqsFoto = fs.readdirSync(arqDados('fotos', t)).sort();
  ok(JSON.stringify(arqsFoto) === JSON.stringify(['avatar-2.jpg', 'retrato-2.jpg']), 'só a versão atual ficou no armazenamento (' + arqsFoto.join(', ') + ')');
  ok(fin.video && fin.video.arquivo === video && fin.video.autorizadoEm, 'o vídeo registrado está no registro');
  ok(Date.parse(fin.venceEm) > Date.now() + 29 * 864e5, 'a validade renovada (30 dias) está no registro');
  ok(fin.conferido && fin.conferido.previa, 'a prévia marcada está no registro');
  const hist = fin.historico.map(h => h.o).join(' | ');
  // as duas fotos: ou as duas entraram em sequência (enviou e trocou), ou uma ficou valendo e a outra voltou com o aviso
  const avisada = [ft1, ft2].filter(r => r.j.aviso).length;
  const fotosOk = avisada === 0 ? hist.includes('enviou a foto') && hist.includes('trocou a foto') : avisada === 1 && hist.includes('enviou a foto');
  ok(fotosOk && ['salvou a ficha', 'enviou o vídeo', 'renovou o link'].every(x => hist.includes(x)), 'o histórico tem cada ação que passou, e a foto substituída voltou avisada (nenhuma perdida em silêncio; avisos: ' + avisada + ')');
  const idx1 = leDado('indices', 'closer1.json').itens[t];
  ok(idx1 && idx1.rev === fin.rev && idx1.foto === 2 && idx1.video === true, 'o índice ficou com a revisão mais nova do registro (rev ' + (idx1 && idx1.rev) + ' de ' + fin.rev + ')');
  // sobrescrever depois do 409: manda de novo com a base nova
  const sob = await c1.put('/api/atletas?t=' + t, { ficha: Object.assign({}, fin.ficha, { cidade: 'Recife' }), base: o409.j.conflito.base });
  ok(sob.status === 200 && sob.j.registro.ficha.cidade === 'Recife', 'sobrescrever com a base que o 409 mandou: 200');

  /* ---------------- 3. /api/r2 nos estados do link ---------------- */
  console.log('\n3. /api/r2: formato errado, inexistente, vencido, revogado e ok');
  const r2 = c => pub.get('/api/r2?t=' + c);
  const formato = await r2('NAO-E-CODIGO');
  ok(formato.status === 404 && JSON.stringify(formato.j) === '{"estado":"nao-encontrado"}', 'código de outro formato: 404 {"estado":"nao-encontrado"}');
  const inexiste = await r2('a'.repeat(26));
  ok(inexiste.status === 404 && JSON.stringify(inexiste.j) === '{"estado":"nao-encontrado"}', 'código que não existe: 404 {"estado":"nao-encontrado"}');
  const tV = criados.find(x => x.c === closers[2]).r.j.t;
  mexeDado('atletas/' + tV + '.json', d => { d.venceEm = new Date(Date.now() - 60000).toISOString(); });
  const venc = await r2(tV);
  ok(venc.status === 200 && JSON.stringify(venc.j) === '{"estado":"expirado"}', 'vencido: 200 {"estado":"expirado"}, sem dado nenhum');
  const tR = criados.find(x => x.c === closers[3]).r.j.t;
  await closers[3].post('/api/link?t=' + tR + '&acao=revogar', {});
  const rev = await r2(tR);
  ok(rev.status === 200 && JSON.stringify(rev.j) === '{"estado":"revogado"}', 'revogado: 200 {"estado":"revogado"}, sem dado nenhum');
  const okR = await r2(t);
  ok(okR.status === 200 && okR.j.estado === 'ok' && okR.j.ficha.nome && okR.j.foto && okR.j.foto.versao === 2, 'valendo: 200 com a ficha e a foto (versão 2)');
  const tempos = { existe: [], naoExiste: [] };
  for (let i = 0; i < 40; i++) {
    tempos.existe.push((await r2(t)).ms);
    tempos.naoExiste.push((await r2('b'.repeat(25) + String.fromCharCode(97 + (i % 26)))).ms);
  }
  const me = mediana(tempos.existe), mn = mediana(tempos.naoExiste);
  ok(Math.abs(me - mn) < 5 || (mn / me > 0.5 && mn / me < 2), 'tempo de resposta parecido: existente ' + me.toFixed(1) + ' ms, inexistente ' + mn.toFixed(1) + ' ms (mediana de 40)');

  /* ---------------- 4. nada de dado interno nas rotas públicas ---------------- */
  console.log('\n4. o que as rotas públicas nunca devolvem');
  await c1.put('/api/atletas?t=' + t, { ficha: (await c1.get('/api/atletas?t=' + t)).j.registro.ficha, base: (await c1.get('/api/atletas?t=' + t)).j.registro.fichaEm, nota: 'NOTA-SECRETA-123' });
  await c1.put('/api/leitura?t=' + t, { leitura: { origem: 'equipe', criterio: 'selecao', lances: [{ t: 3, tipo: 'Passe', leitura: 'bom', nota: 'bom passe' }, { t: 9, tipo: 'Desarme', leitura: 'ajustar', nota: '' }], fortes: ['passe'], prioridades: ['desarme'] } });
  const pubR2 = await r2(t);
  // por texto: nada de dado interno em lugar nenhum da resposta
  const proibidas = ['donoLogin', 'criadoPor', 'historico', 'autorizadoPor', 'autorizadoEm', 'venceEm', 'fotos/', 'videos/', 'atletas/', 'closer1', 'Closer 1', 'NOTA-SECRETA-123', 'fichaPor', 'conferido', 'dono', 'rev"'];
  const achadas = proibidas.filter(p => pubR2.texto.includes(p));
  ok(pubR2.j.video && pubR2.j.leitura && achadas.length === 0, '/api/r2 com vídeo e leitura e sem nenhum dado interno no texto' + (achadas.length ? ' (achei: ' + achadas.join(', ') + ')' : ''));
  // por chave: só o combinado em cada nível (a "nota" que existe é a do lance, que aparece no slide, não a nota privada)
  const so = (o, chaves) => Object.keys(o || {}).every(k => chaves.includes(k));
  const pj = pubR2.j;
  ok(so(pj, ['estado', 't', 'atualizadoEm', 'versao', 'ficha', 'foto', 'video', 'leitura']) && so(pj.versao, ['id', 'caminho', 'origem']) && so(pj.foto, ['ok', 'versao']) && so(pj.video, ['ok', 'duracaoS', 'temPoster']) &&
    so(pj.leitura, ['origem', 'criterio', 'lances', 'fortes', 'prioridades']) && pj.leitura.lances.every(l => so(l, ['t', 'tipo', 'leitura', 'nota'])) &&
    so(pj.ficha, ['nome', 'apelido', 'idade', 'posicao', 'cidade', 'pe', 'altura', 'origem', 'caracteristicas', 'experiencia', 'sonho', 'plano', 'gerente', 'prazoContato', 'prazoZyron', 'r2dia', 'r2hora', 'vagas', 'proximaTurma', 'nomeTela', 'pular']),
  '/api/r2 só com as chaves combinadas em cada nível (versão, ficha, foto, vídeo e leitura)');
  const fotoPub = await pub.get('/api/foto?t=' + t + '&v=retrato&n=2');
  const cab = [...fotoPub.h.entries()].map(([k, v]) => k + ': ' + v).join('\n');
  ok(fotoPub.status === 200 && fotoPub.h.get('content-type') === 'image/jpeg' && fotoPub.buf[0] === 0xFF && fotoPub.buf[1] === 0xD8, '/api/foto entrega o JPEG');
  ok(!proibidas.some(p => cab.includes(p)), '/api/foto sem chave interna nos cabeçalhos');
  ok(fotoPub.h.get('cache-control') === 'private, max-age=3600' && /noindex/.test(fotoPub.h.get('x-robots-tag')) && fotoPub.h.get('x-content-type-options') === 'nosniff' && fotoPub.h.get('cross-origin-resource-policy') === 'cross-origin', '/api/foto com os cabeçalhos combinados (cache privado, noindex, nosniff, CORP)');
  const versaoVelha = await pub.get('/api/foto?t=' + t + '&v=retrato&n=1');
  ok(versaoVelha.status === 404, 'a versão anterior da foto não existe mais: 404');
  const fotoRev = await pub.get('/api/foto?t=' + tR + '&v=retrato&n=1');
  ok(fotoRev.status === 404, 'foto de link revogado: 404');
  const vidPub = await pub.get('/api/video?t=' + t, { cabecalhos: { Range: 'bytes=0-99' } });
  ok(vidPub.status === 206 && vidPub.buf.length === 100 && /^bytes 0-99\//.test(vidPub.h.get('content-range')), '/api/video em pedaços (206, Range)');

  /* ---------------- 5. CORS ---------------- */
  console.log('\n5. CORS');
  const DECK = 'https://jogador-de-elite-r2-novo.vercel.app';
  const corsDe = async o => (await pub.get('/api/r2?t=' + t, { origem: o })).h;
  const ruim = await corsDe('https://outro-site.example');
  ok(!ruim.get('access-control-allow-origin') && /Origin/.test(ruim.get('vary') || ''), 'origem de fora: sem Access-Control-Allow-Origin (e Vary: Origin)');
  const parecido = await corsDe(DECK + '.outro.example');
  ok(!parecido.get('access-control-allow-origin'), 'origem parecida com a do deck (sufixo): sem Access-Control-Allow-Origin');
  const certo = await corsDe(DECK);
  ok(certo.get('access-control-allow-origin') === DECK, 'a origem do deck recebe exatamente ela (' + certo.get('access-control-allow-origin') + ')');
  ok((await corsDe('http://localhost:5173')).get('access-control-allow-origin') === 'http://localhost:5173', 'fora de produção, localhost é aceito (teste local)');
  process.env.VERCEL_ENV = 'production';
  ok(!(await corsDe('http://localhost:5173')).get('access-control-allow-origin'), 'em produção, localhost não é aceito');
  ok((await corsDe(DECK)).get('access-control-allow-origin') === DECK, 'em produção, a origem do deck continua aceita');
  delete process.env.VERCEL_ENV;
  const pre = await pub.pede('OPTIONS', '/api/chamada?t=' + t, { origem: DECK, cabecalhos: { 'Access-Control-Request-Method': 'POST' } });
  ok(pre.status === 204 && pre.h.get('access-control-allow-origin') === DECK, 'pré-voo da presença: 204 com a origem do deck');
  ok(![ruim, certo].some(h => h.get('access-control-allow-origin') === '*'), 'nunca "*"');

  /* ---------------- 6. só JSON, cookie, sessão e usuário removido ---------------- */
  console.log('\n6. escrita só com JSON, cookie e sessão');
  ok((await c1.pede('POST', '/api/atletas', { texto: '{"ficha":{"nome":"Fulano"}}' })).status === 415, 'criar com texto puro: 415');
  ok((await c1.pede('PUT', '/api/foto?t=' + t, { corpo: fs.readFileSync(F('retrato-a.jpg')), tipo: 'image/jpeg' })).status === 415, 'foto em binário (image/jpeg): 415');
  ok((await new Cliente(s.painel).pede('POST', '/api/sessao', { texto: 'login=admin&senha=x', tipo: 'application/x-www-form-urlencoded' })).status === 415, 'login por formulário: 415');
  ok((await c1.pede('DELETE', '/api/atletas?t=' + t)).status === 415 && fs.existsSync(arqDados('atletas', t + '.json')), 'apagar sem corpo JSON: 415, e nada sumiu');
  const sc = c1.setCookie;
  ok(/HttpOnly/.test(sc) && /Secure/.test(sc) && /SameSite=Strict/.test(sc) && /Max-Age=43200/.test(sc), 'cookie HttpOnly; Secure; SameSite=Strict; Max-Age=43200 (12 h)');
  const seis = closers[5];
  ok((await seis.get('/api/atletas')).status === 200, 'closer6 entra antes de ser removido');
  ok((await admin.del('/api/usuarios?login=closer6')).status === 200, 'o admin remove o closer6');
  ok((await seis.get('/api/atletas')).status === 401, 'o closer6 perde o acesso na hora (401), com o mesmo cookie');
  ok((await new Cliente(s.painel).get('/api/atletas')).status === 401, 'sem sessão: 401');
  ok((await new Cliente(s.painel).post('/api/sessao', { login: 'admin', senha: 'errada-errada' })).status === 401, 'senha errada: 401');

  /* ---------------- 7. limpeza diária ---------------- */
  console.log('\n7. limpeza diária');
  const tF = criados.find(x => x.c === closers[4]).r.j.t;
  const c5 = closers[4];
  ok((await c5.put('/api/foto?t=' + tF, { retrato: b64(F('retrato-a.jpg')), avatar: b64(F('avatar-a.jpg')), autorizo: true })).status === 200, 'foto enviada no atleta que vai vencer');
  mexeDado('atletas/' + tF + '.json', d => { d.foto.venceEm = new Date(Date.now() - 1000).toISOString(); });
  const tVelho = criados.filter(x => x.c === closers[4])[1].r.j.t;
  mexeDado('atletas/' + tVelho + '.json', d => { d.venceEm = new Date(Date.now() - 181 * 864e5).toISOString(); });
  fs.mkdirSync(arqDados('fotos', 'zzzzzzzzzzzzzzzzzzzzzzzzzz'), { recursive: true });
  fs.writeFileSync(arqDados('fotos', 'zzzzzzzzzzzzzzzzzzzzzzzzzz', 'retrato-1.jpg'), 'sobra');
  ok((await pub.get('/api/limpeza')).status === 401, 'limpeza sem o segredo do Cron: 401');
  const lp = await pub.get('/api/limpeza', { cabecalhos: { Authorization: 'Bearer ' + s.cronSecret } });
  ok(lp.status === 200 && lp.j.fotosVencidas === 1 && lp.j.apagados === 1 && lp.j.sobras >= 1, 'limpeza: 1 foto vencida, 1 registro antigo e a sobra (' + JSON.stringify(lp.j) + ')');
  ok(!fs.existsSync(arqDados('fotos', tF)) || fs.readdirSync(arqDados('fotos', tF)).length === 0, 'os arquivos da foto vencida sumiram');
  ok(!fs.existsSync(arqDados('atletas', tVelho + '.json')) && !leDado('indices', 'closer5.json').itens[tVelho], 'o registro antigo sumiu, e do índice também');
  ok((await c5.get('/api/atletas?t=' + tF)).j.registro.foto === null, 'o registro da foto vencida ficou sem foto');

  /* ---------------- 8. gerar outro link ---------------- */
  console.log('\n8. gerar outro link');
  const antes = (await c1.get('/api/atletas?t=' + t)).j.registro;
  const reg = await c1.post('/api/link?t=' + t + '&acao=regenerar', {});
  const t2 = reg.j && reg.j.t;
  ok(reg.status === 200 && T_OK.test(t2) && t2 !== t, 'código novo (' + reg.status + ')');
  ok((await r2(t)).status === 404 && (await r2(t)).j.estado === 'nao-encontrado', 'o link velho responde nao-encontrado');
  const novoR2 = await r2(t2);
  ok(novoR2.status === 200 && novoR2.j.estado === 'ok' && novoR2.j.foto && novoR2.j.foto.versao === antes.foto.versao && novoR2.j.video, 'o link novo vale, com a mesma foto e o vídeo');
  ok((await pub.get('/api/foto?t=' + t2 + '&v=avatar&n=' + antes.foto.versao)).status === 200, 'a foto foi junto pro código novo');
  ok(!fs.existsSync(arqDados('fotos', t)) || fs.readdirSync(arqDados('fotos', t)).length === 0, 'as fotos do código velho sumiram');
  const idxF = leDado('indices', 'closer1.json').itens;
  ok(!idxF[t] && idxF[t2], 'o índice trocou o código');
  ok((await c1.del('/api/atletas?t=' + t2)).status === 200 && (await r2(t2)).status === 404 && !fs.existsSync(arqDados('atletas', t2 + '.json')), 'apagar tudo: registro, fotos e vídeo somem e o link responde nao-encontrado');
  ok(!fs.existsSync(arqDados('fotos', t2)) || fs.readdirSync(arqDados('fotos', t2)).length === 0, 'as fotos do atleta apagado sumiram do armazenamento');
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await s.fecha();
  fs.rmSync(fotos, { recursive: true, force: true });
}
fim();
