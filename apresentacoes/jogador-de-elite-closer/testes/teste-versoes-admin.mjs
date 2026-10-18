// A classificação de cada versão do R2 (Validada, Em validação, Não validada) e o que cada versão mostra do lead (nome e
// sobrenome, foto), que o admin ajusta no painel sem publicar nada; e a foto do lead fora da tela por R2. Confere a API (login,
// permissão, validação, persistência), o que vale de verdade (a /api/r2, o checklist), o deck e as telas.
// Uso: node testes/teste-versoes-admin.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { sobe, RAIZ_DECK, RAIZ_PAINEL } from './servidor.mjs';
import { Cliente, verificador, fotosDeTeste, b64 } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const { ok, fim } = verificador('Classificação e lead por versão');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ_PAINEL, 'regras.js'), 'utf8'), ctx);
const R = ctx.window.R2_REGRAS;

ok(R.VALIDACOES.map(n => n.id).join() === 'validada,em-validacao,nao-validada' && R.VALIDACAO_PADRAO === 'nao-validada', 'três níveis de classificação, do mais validado ao menos, e a de partida é "não validada"');
ok(R.VERSOES.every(v => R.VALIDACOES.some(n => n.id === v.validacao) && v.lead && typeof v.lead.nome === 'boolean' && typeof v.lead.foto === 'boolean'), 'toda versão do cadastro tem classificação de partida e o que mostra do lead');
const ord = R.ordenaVersoes([{ id: 'a', validacao: 'nao-validada' }, { id: 'b', validacao: 'validada' }, { id: 'c', validacao: 'em-validacao' }, { id: 'd', validacao: 'validada' }]);
ok(ord.map(v => v.id).join('') === 'bdca', 'a ordem vai do mais validado ao menos, e dentro do mesmo nível segue o cadastro (' + ord.map(v => v.id).join('') + ')');

const s = await sobe({ deck: true });
const fotos = fotosDeTeste(RAIZ_DECK);
const F = n => path.join(fotos, n);
const nav = await abreNavegador(), nav2 = await abreNavegador();
try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  const SENHA = 'senha-da-carla-123';
  await admin.post('/api/usuarios', { login: 'carla.closer', nome: 'Carla Closer', papel: 'closer', senha: SENHA });
  const carla = new Cliente(s.painel); await carla.entra('carla.closer', SENHA);
  const anon = new Cliente(s.painel);

  /* ---------------- A. a API ---------------- */
  ok((await anon.get('/api/versoes')).status === 401, 'sem login, GET /api/versoes dá 401');
  const g0 = (await carla.get('/api/versoes')).j;
  ok(g0.versoes.length === R.VERSOES.length && g0.versoes.every(v => v.id && v.nome && v.caminho && v.resumo && v.quando && v.validacao && 'nota' in v && v.lead && Array.isArray(v.opcionais)), 'o closer recebe cada versão com classificação, nota e o que mostra do lead');
  ok(g0.versoes.every(v => !('ajustadoPor' in v) && !('ajustadoEm' in v)), 'e não recebe quem ajustou nem quando (só o admin)');
  ok(g0.niveis.length === 3 && g0.versoes.map(v => v.id).join() === R.VERSOES.map(v => v.id).join(), 'a lista vem na ordem do cadastro enquanto todas têm a mesma classificação');
  ok((await admin.get('/api/versoes')).j.versoes.every(v => 'ajustadoPor' in v && v.ajustadoPor === null), 'o admin recebe quem ajustou (ninguém, ainda)');
  const put = (cli, id, corpo, op) => cli.put('/api/versoes?id=' + id, corpo, op);
  ok((await put(carla, 'tecnica', { validacao: 'validada' })).status === 403, 'closer não ajusta: 403');
  ok((await put(anon, 'tecnica', { validacao: 'validada' })).status === 401, 'sem login não ajusta: 401');
  ok((await admin.pede('PUT', '/api/versoes?id=tecnica', { texto: '{"validacao":"validada"}' })).status === 415, 'ajuste que não vem em JSON é recusado (415)');
  ok((await put(admin, 'nao-existe', { validacao: 'validada' })).status === 404, 'versão que não existe: 404');
  ok((await put(admin, 'tecnica', { validacao: 'quase' })).status === 400, 'classificação fora da lista: 400');
  ok((await put(admin, 'tecnica', {})).status === 400, 'pedido sem nada pra mudar: 400');
  ok((await put(admin, 'tecnica', { lead: 'sim' })).status === 400, 'lead que não é objeto: 400');
  const p1 = await put(admin, 'tecnica', { validacao: 'validada', nota: 'Fechou <b>5</b> de 8 calls ' + 'x'.repeat(200) });
  ok(p1.status === 200 && p1.j.versoes[0].id === 'tecnica' && p1.j.versoes[0].validacao === 'validada', 'o admin classifica a técnica como validada e ela vai pro topo da lista');
  ok(!/[<>]/.test(p1.j.versoes[0].nota) && p1.j.versoes[0].nota.length <= 160 && p1.j.versoes[0].nota.startsWith('Fechou 5 de 8 calls'), 'a nota sai sem HTML e com no máximo 160 letras (' + p1.j.versoes[0].nota.length + ')');
  ok(p1.j.versoes[0].ajustadoPor && p1.j.versoes[0].ajustadoPor.login === s.adminLogin && p1.j.versoes[0].ajustadoEm, 'o admin vê quem ajustou e quando');
  const g1 = (await carla.get('/api/versoes')).j;
  ok(g1.versoes[0].id === 'tecnica' && g1.versoes[0].validacao === 'validada' && g1.versoes[1].validacao === 'em-validacao', 'o closer já vê a nova classificação e a nova ordem');
  ok(g1.versoes.every(v => !('ajustadoPor' in v)), '... sem quem ajustou');
  const arq = JSON.parse(fs.readFileSync(path.join(s.dados, 'versoes.json'), 'utf8'));
  ok(arq.ajustes.tecnica.validacao === 'validada' && !('principal' in arq.ajustes), 'versoes.json guarda só o que o admin ajustou (a técnica)');
  const par = await Promise.all([put(admin, 'principal', { validacao: 'em-validacao', nota: 'em teste' }), put(admin, 'tecnica', { nota: 'a técnica segue' })]);
  const g2 = (await admin.get('/api/versoes')).j.versoes;
  ok(par.every(r => r.status === 200) && g2.find(v => v.id === 'principal').nota === 'em teste' && g2.find(v => v.id === 'tecnica').nota === 'a técnica segue' && g2.find(v => v.id === 'tecnica').validacao === 'validada', 'dois ajustes ao mesmo tempo em versões diferentes: os dois ficam (nada se perde)');

  const l1 = await put(admin, 'principal', { lead: { nome: false } });
  const lp = l1.j.versoes.find(v => v.id === 'principal').lead;
  ok(lp.nome === false && lp.foto === false, 'sem o nome do lead, a foto também sai (a foto só aparece com o nome)');
  const l2 = await put(admin, 'principal', { lead: { foto: true } });
  ok(l2.j.versoes.find(v => v.id === 'principal').lead.foto === false, 'pedir a foto com o nome desligado não liga a foto');
  const l3 = await put(admin, 'principal', { lead: { nome: true, foto: true } });
  ok(JSON.stringify(l3.j.versoes.find(v => v.id === 'principal').lead) === '{"nome":true,"foto":true}', 'ligar o nome e a foto de novo vale');

  /* ---------------- B. o que vale de verdade ---------------- */
  const base = { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: 'Assessoria PRO', r2data: new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10), r2hm: '19:30' };
  const cria = async (extra, foto, cli) => {
    const c = cli || admin;
    const r = await c.post('/api/atletas', { ficha: Object.assign({}, base, extra) });
    if (r.status !== 201) throw new Error('não criou: ' + r.status + ' ' + r.texto);
    if (foto) await c.put('/api/foto?t=' + r.j.t, { retrato: b64(F('retrato-a.jpg')), avatar: b64(F('avatar-a.jpg')), autorizo: true });
    return r.j.t;
  };
  const le = async t => (await admin.get('/api/atletas?t=' + t)).j;
  const publico = async t => (await fetch(s.painel + '/api/r2?t=' + t, { headers: { Origin: s.deck } })).json();

  const tf = await cria({ versao: 'tecnica', semFoto: 'sim' }, true);
  const jf = await le(tf);
  ok(jf.registro.ficha.semFoto === 'sim' && (await publico(tf)).ficha.semFoto === 'sim', 'a foto do lead fora da tela por R2: a ficha grava semFoto e a /api/r2 manda');
  const tx = await cria({ semFoto: 'nao', nomeTela: 'so-nome' });
  ok(!('semFoto' in (await le(tx)).registro.ficha), 'semFoto só aceita "sim" (outro valor é descartado)');
  const t0 = await cria({});
  ok(!('semFoto' in (await publico(t0)).ficha) && !(await le(t0)).checklist.foto, 'sem escolha nenhuma, a foto aparece e é pedida (checklist sem foto = falta)');
  const jsf = await le(await cria({ semFoto: 'sim' }));
  ok(jsf.checklist.foto && !jsf.checklist.nome && jsf.estado === 'rascunho', 'com a foto fora da tela, a foto não é pedida, mas o nome conferido continua sendo (' + jsf.estado + ')');

  // o admin tira a foto de uma versão: vale pros R2 já salvos, sem salvar de novo
  const tt = await cria({ versao: 'tecnica' }, true);
  ok(!('semFoto' in (await publico(tt)).ficha), 'antes do ajuste, a foto da técnica vai pra tela');
  await put(admin, 'tecnica', { lead: { nome: true, foto: false } });
  const ptt = await publico(tt);
  ok(ptt.ficha.semFoto === 'sim' && !('nomeTela' in ptt.ficha), 'o admin tira a foto da técnica: o R2 já salvo passa a mandar semFoto (o nome continua)');
  ok(!ptt.foto && ptt.versao.id === 'tecnica', '... e a /api/r2 não manda a foto (o deck nem fica sabendo dela), mas segue entregando a versão certa');
  const jt = await le(await cria({ versao: 'tecnica' }));
  ok(jt.checklist.foto && !jt.checklist.nome, 'o checklist de um R2 da técnica não pede a foto (a versão não mostra), mas pede o nome conferido');
  await put(admin, 'tecnica', { lead: { nome: false } });
  const ptn = await publico(tt);
  ok(ptn.ficha.nomeTela === 'sem' && ptn.ficha.semFoto === 'sim', 'o admin tira o nome do lead da técnica: a /api/r2 manda "sem nome" e sem foto');
  const jn = await le(await cria({ versao: 'tecnica' }));
  ok(jn.checklist.foto && jn.checklist.nome && jn.estado === 'pronto', 'e o R2 da técnica já fica Pronto sem foto nem nome conferido (' + jn.estado + ')');
  const pp = await publico(await cria({}, true));
  ok(!('nomeTela' in pp.ficha), 'os R2 da principal não mudam com o ajuste da técnica');

  /* ---------------- C. o deck ---------------- */
  const NOME = "Array.from(document.querySelectorAll('[data-bind=\"nome\"]')).map(e => e.textContent.trim()).filter(Boolean)[0] || ''";
  const fotoPedida = "Array.from(document.images).some(i => /api\\/foto/.test(i.src)) || performance.getEntriesByType('resource').some(r => /api\\/foto/.test(r.name))";
  const pronto = "document.querySelectorAll('#stage > .slide.active').length === 1 && window.getComputedStyle(document.querySelector('#viewport')).visibility !== 'hidden'";
  await put(admin, 'tecnica', { lead: { nome: true, foto: true } });
  const tc = await cria({}, true), tsf = await cria({ semFoto: 'sim' }, true);
  const Cm = await nav.aba(s.deck + '/?a=' + tc + '#1', { largura: 1920, altura: 1080 });
  await Cm.ate(pronto, 15000); await espera(1800);
  ok(await Cm.avalia(fotoPedida) && (await Cm.avalia(NOME)) === 'Lucas Silva', 'o controle: com a foto ligada, a tela mostra o nome e pede a foto');
  const Sf = await nav.aba(s.deck + '/?a=' + tsf + '#1', { largura: 1920, altura: 1080 });
  await Sf.ate(pronto, 15000); await espera(1800);
  ok(!(await Sf.avalia(fotoPedida)), 'com a foto fora da tela deste R2, a foto nem é pedida ao painel');
  ok((await Sf.avalia(NOME)) === 'Lucas Silva' && /Montado para Lucas Almeida da Silva\./.test(await Sf.avalia('document.body.textContent')), '... e o nome continua na tela (títulos e capa)');
  ok(await Sf.avalia("Array.from(document.querySelectorAll('[data-bind=\"fotoIni\"]')).some(e => e.textContent.trim() === 'LS')"), '... e o quadro da foto mostra as iniciais do nome e sobrenome (LS)');
  await put(admin, 'tecnica', { lead: { nome: true, foto: false } });
  const tvf = await cria({ versao: 'tecnica' }, true);
  const Vf = await nav.aba(s.deck + '/?a=' + tvf + '#1', { largura: 1920, altura: 1080 });
  await Vf.ate("location.pathname === '/variacoes/tecnica/' && " + pronto, 15000); await espera(1800);
  ok(!(await Vf.avalia(fotoPedida)) && (await Vf.avalia(NOME)) === 'Lucas Silva', 'versão que não mostra a foto: a foto não é pedida e o nome aparece');
  await put(admin, 'tecnica', { lead: { nome: false } });
  const tvn = await cria({ versao: 'tecnica' }, true);
  const Vn = await nav.aba(s.deck + '/?a=' + tvn + '#2', { largura: 1920, altura: 1080 });
  await Vn.ate("location.pathname === '/variacoes/tecnica/' && " + pronto, 15000); await espera(1800);
  const txt = await Vn.avalia("Array.from(document.querySelectorAll('#stage > .slide')).map(x => x.textContent).join(' ')");
  ok(!/Lucas|Silva|Almeida/.test(txt) && !(await Vn.avalia(fotoPedida)), 'versão que não mostra o nome do lead: nenhum slide traz o nome e a foto nem é pedida');
  await put(admin, 'tecnica', { lead: { nome: true, foto: true } });
  const excD = [Cm, Sf, Vf, Vn].flatMap(a => a.console_.filter(m => /^EXC/.test(m)));
  ok(!excD.length, 'nenhuma exceção de JavaScript no deck' + (excD.length ? ': ' + excD.slice(0, 2).join(' | ') : ''));

  /* ---------------- D. as telas ---------------- */
  const entra = async (aba, login, senha) => {
    await aba.ate("!document.querySelector('#v-entrar').hidden");
    await aba.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = ${JSON.stringify(login)}; f.senha.value = ${JSON.stringify(senha)}; f.requestSubmit(); return 1; })()`);
    return aba.ate("!document.querySelector('#v-app').hidden");
  };
  const badges = aba => aba.avalia("Array.from(document.querySelectorAll('#versoes-lista .versao-card')).map(c => c.dataset.v + ':' + c.querySelector('.versao-titulo .chip').textContent.trim()).join(',')");
  // ordem e classificação de partida desta rodada: tecnica validada, principal em validação
  const C = await nav2.aba(s.painel + '/#/versoes', { largura: 1500, altura: 1000 });
  ok(await entra(C, 'carla.closer', SENHA), 'a closer entra no painel');
  ok(await C.ate("document.querySelectorAll('#versoes-lista .versao-card').length === " + R.VERSOES.length), 'a closer abre a aba Versões do R2');
  ok((await badges(C)) === 'tecnica:Validada,principal:Em validação', 'a closer vê a classificação ao lado do nome e a mais validada primeiro (' + await badges(C) + ')');
  ok(await C.avalia("!document.querySelector('#versoes-lista details.ajustes') && !document.querySelector('#versoes-lista [data-salva-aj]')"), 'e não vê os ajustes do admin');
  ok(/a técnica segue/.test(await C.avalia("document.querySelector('#versoes-lista [data-v=tecnica]').textContent")) && /No R2 do lead: aparecem o nome e o sobrenome do lead, com a foto dele/.test(await C.avalia("document.querySelector('#versoes-lista [data-v=tecnica]').textContent")), 'cada ficha traz a nota e o que a versão mostra do lead');
  await C.avalia("location.hash = '#/novo'; 1");
  await C.ate("!document.querySelector('#v-editor').hidden && document.querySelectorAll('#versoes .versao').length === " + R.VERSOES.length);
  const picker = await C.avalia("Array.from(document.querySelectorAll('#versoes .versao')).map(l => l.querySelector('input').value + ':' + l.querySelector('.chip').textContent.trim()).join(',')");
  ok(picker === 'tecnica:Validada,principal:Em validação', 'no editor, as versões vêm do mais validado ao menos, cada uma com a classificação ao lado (' + picker + ')');
  ok(await C.avalia("document.querySelector('#versoes input[value=principal]').checked"), 'e a versão marcada de partida continua sendo a principal');

  // o admin ajusta pela tela
  const A = await nav.aba(s.painel + '/#/versoes', { largura: 1500, altura: 1000 });
  ok(await entra(A, s.adminLogin, s.adminSenha) && await A.ate("document.querySelectorAll('#versoes-lista details.ajustes').length === " + R.VERSOES.length), 'o admin vê os ajustes em cada versão');
  await A.avalia("document.querySelector('#versoes-lista details[data-v=principal]').open = true; 1");
  await A.avalia(`(() => { const d = document.querySelector('#versoes-lista details[data-v=principal]'); const s = d.querySelector('[data-aj=validacao]'); s.value = 'validada'; d.querySelector('[data-aj=nota]').value = 'Deck de sempre, aprovado'; return 1; })()`);
  await A.avalia("document.querySelector('#versoes-lista [data-salva-aj=principal]').click(); 1");
  ok(await A.ate("document.querySelector('#aviso').textContent === 'Ajustes salvos.'"), 'salvar os ajustes avisa "Ajustes salvos."');
  ok((await badges(A)) === 'principal:Validada,tecnica:Validada', 'a classificação nova aparece na lista (com as duas validadas, vale a ordem do cadastro) (' + await badges(A) + ')');
  ok(await A.avalia("document.querySelector('#versoes-lista details[data-v=principal]').open"), 'o bloco de ajustes que estava aberto continua aberto');
  const gp = (await admin.get('/api/versoes')).j.versoes.find(v => v.id === 'principal');
  ok(gp.validacao === 'validada' && gp.nota === 'Deck de sempre, aprovado', 'e vale no servidor');
  // nome desmarcado desliga a foto
  await A.avalia("document.querySelector('#versoes-lista details[data-v=principal] [data-aj=nome]').click(); 1");
  ok(await A.avalia("(() => { const f = document.querySelector('#versoes-lista details[data-v=principal] [data-aj=foto]'); return f.disabled && !f.checked; })()"), 'desmarcar o nome do lead desliga e bloqueia a foto');
  await A.avalia("document.querySelector('#versoes-lista details[data-v=principal] [data-aj=nome]').click(); 1");
  ok(await A.avalia("document.querySelector('#versoes-lista details[data-v=principal] [data-aj=foto]').disabled === false"), '... e marcar de novo libera');

  // o editor segue o que a versão mostra do lead
  const tui = await cria({ nome: 'Pedro Henrique Costa', plano: 'Scouting' }, true);
  const abreEditor = async () => { await A.vai(s.painel + '/#/r2/' + tui); await A.avalia('location.reload(); 1'); await A.ate("!document.querySelector('#v-editor').hidden && document.querySelector('#ed-titulo').textContent.includes('PEDRO') || /Pedro/.test(document.querySelector('#ed-titulo').textContent)"); await espera(500); };
  const estadoEd = () => A.avalia("JSON.stringify({ nt: !document.querySelector('#nt-bloco').hidden, foto: !document.querySelector('#foto-tela-bloco').hidden, nota: document.querySelector('#lead-nota').hidden ? '' : document.querySelector('#lead-nota').textContent, ex: document.querySelector('#ex-nome').textContent, ftNota: document.querySelector('#ft-nota-sem').hidden ? '' : document.querySelector('#ft-nota-sem').textContent })").then(JSON.parse);
  await put(admin, 'principal', { lead: { nome: true, foto: true } });
  await abreEditor();
  const e1 = await estadoEd();
  ok(e1.nt && e1.foto && !e1.nota && e1.ex === 'Pedro Henrique Costa, você foi escolhido.' && !e1.ftNota, 'versão que mostra nome e foto: o editor mostra as duas escolhas');
  await put(admin, 'principal', { lead: { nome: true, foto: false } });
  await abreEditor();
  const e2 = await estadoEd();
  ok(e2.nt && !e2.foto && /não mostra a foto do lead/.test(e2.nota) && /não usa a foto/.test(e2.ftNota) && e2.ex === 'Pedro Henrique Costa, você foi escolhido.', 'versão que não mostra a foto: some a caixa da foto e o editor explica (' + e2.nota + ')');
  ok(await A.avalia("(() => { const li = Array.from(document.querySelectorAll('#checklist li')).slice(0, 2); return li[0].classList.contains('ok') && /Não precisa/.test(li[0].textContent) && !/Não precisa/.test(li[1].textContent); })()"), '... e o checklist não pede a foto, mas pede o nome conferido');
  await put(admin, 'principal', { lead: { nome: false } });
  await abreEditor();
  const e3 = await estadoEd();
  ok(!e3.nt && !e3.foto && /não mostra o nome nem a foto do lead/.test(e3.nota) && e3.ex === 'Você foi escolhido.', 'versão que não mostra o nome do lead: some a escolha de nome e de foto, e o exemplo vira "Você foi escolhido."');
  ok(await A.avalia("Array.from(document.querySelectorAll('#checklist li')).slice(0, 2).every(li => li.classList.contains('ok') && /Não precisa/.test(li.textContent))"), '... e o checklist não pede nem a foto nem o nome conferido');
  await put(admin, 'principal', { lead: { nome: true, foto: true } });
  await abreEditor();

  // a foto do lead por R2, pela tela
  ok(await A.avalia("document.querySelector('#c-foto-tela').checked && !document.querySelector('#foto-tela-bloco').hidden"), 'a caixa "Mostrar a foto do lead na tela" começa marcada');
  await A.avalia("document.querySelector('#c-foto-tela').click(); 1");
  ok(await A.avalia("document.querySelector('#ed-salvo').classList.contains('sujo') && document.querySelector('#ex-nome-nota').textContent.includes('mostram as iniciais (PC)')"), 'desmarcar conta como mudança e a tela avisa que os quadros mostram as iniciais (PC, de Pedro Henrique Costa)');
  ok(await A.avalia("/não vai pra tela/.test(document.querySelector('#ft-nota-sem').textContent) && !document.querySelector('#ft-nota-sem').hidden"), '... e a seção da foto explica que ela fica guardada');
  await A.avalia("document.querySelector('#ed-salvar').click(); 1");
  await A.ate("!document.querySelector('#ed-salvo').classList.contains('sujo')");
  ok((await le(tui)).registro.ficha.semFoto === 'sim', 'salvar grava semFoto na ficha');
  ok(await A.avalia("Array.from(document.querySelectorAll('#checklist li')).slice(0, 1).every(li => li.classList.contains('ok') && /Não precisa/.test(li.textContent))", 5000), 'e o checklist não pede mais a foto');
  await A.avalia("document.querySelector('#c-foto-tela').click(); document.querySelector('#ed-salvar').click(); 1");
  await A.ate("!document.querySelector('#ed-salvo').classList.contains('sujo')");
  ok(!('semFoto' in (await le(tui)).registro.ficha), 'marcar de novo e salvar tira o semFoto (volta ao padrão)');
  // criar R2 e gerar o link
  await A.avalia("location.hash = '#/novo'; 1");
  await A.ate("!document.querySelector('#v-editor').hidden");
  ok((await A.avalia("document.querySelector('#ed-salvar').textContent")) === 'Criar R2 e gerar o link', 'o botão do R2 novo diz "Criar R2 e gerar o link"');

  const excP = [A, C].flatMap(a => a.console_.filter(m => /^EXC/.test(m)));
  ok(!excP.length, 'nenhuma exceção de JavaScript no painel' + (excP.length ? ': ' + excP.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha(); await nav2.fecha();
  await s.fecha();
  fs.rmSync(fotos, { recursive: true, force: true });
}
fim();
