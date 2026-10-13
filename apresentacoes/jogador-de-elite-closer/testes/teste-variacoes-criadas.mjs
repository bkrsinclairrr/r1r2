// As variações que o admin cria no painel (sobre a página de uma apresentação do deck): o slug gerado, a classificação, o que cada
// uma mostra do lead (nome e sobrenome, foto), editar, arquivar; o closer escolhendo uma por lead; o deck abrindo a página da base
// com o que a variação deixa aparecer. Confere a API (permissão, validação, persistência), o uso nos R2, o deck e as telas.
// Uso: node testes/teste-variacoes-criadas.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { sobe, RAIZ_DECK, RAIZ_PAINEL } from './servidor.mjs';
import { Cliente, verificador, fotosDeTeste, b64 } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const { ok, fim } = verificador('Variações criadas no painel');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ_PAINEL, 'regras.js'), 'utf8'), ctx);
const R = ctx.window.R2_REGRAS;
ok(R.SLUG_OK.test('tecnica-sem-foto-k7m2') && !R.SLUG_OK.test('Tecnica') && !R.SLUG_OK.test('a--b') && !R.SLUG_OK.test('-a') && !R.SLUG_OK.test('a b'), 'o slug é de letras minúsculas e números separados por hífen');

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
  const lista = async cli => (await cli.get('/api/versoes')).j.versoes;
  const cria = (corpo, cli) => (cli || admin).post('/api/versoes', corpo);

  /* ---------------- A. criar ---------------- */
  ok((await cria({ nome: 'X Y', base: 'tecnica' }, carla)).status === 403, 'closer não cria variação: 403');
  ok((await cria({ nome: 'X Y', base: 'tecnica' }, anon)).status === 401, 'sem login não cria: 401');
  ok((await admin.pede('POST', '/api/versoes', { texto: '{"nome":"X Y","base":"tecnica"}' })).status === 415, 'pedido que não vem em JSON é recusado (415)');
  ok((await cria({ base: 'tecnica' })).status === 400 && (await cria({ nome: 'A', base: 'tecnica' })).status === 400, 'sem nome, ou com nome de uma letra: 400');
  ok((await cria({ nome: 'Variação boa' })).status === 400 && (await cria({ nome: 'Variação boa', base: 'xyz' })).status === 400, 'sem base, ou com base que não existe no deck: 400');
  ok((await cria({ nome: 'Variação boa', base: 'tecnica', validacao: 'quase' })).status === 400, 'classificação fora da lista: 400');
  ok((await cria({ nome: 'Variação boa', base: 'tecnica', lead: 'sim' })).status === 400, 'lead que não é objeto: 400');
  ok((await lista(admin)).length === R.VERSOES.length, 'nada disso criou variação (' + (await lista(admin)).length + ')');

  const c1 = await cria({ nome: 'Técnica sem foto', base: 'tecnica', quando: 'Lead que não autorizou a foto', validacao: 'em-validacao', nota: 'Teste de outubro', lead: { nome: true, foto: false } });
  const slug1 = c1.j && c1.j.criada;
  ok(c1.status === 201 && /^tecnica-sem-foto-[a-z2-7]{4}$/.test(slug1), 'o admin cria uma variação e o painel gera o slug (' + slug1 + ')');
  const v1 = c1.j.versoes.find(v => v.id === slug1);
  ok(v1 && v1.nome === 'Técnica sem foto' && v1.base === 'tecnica' && v1.criada === true && v1.caminho === '/variacoes/tecnica/' && v1.quando === 'Lead que não autorizou a foto' && v1.nota === 'Teste de outubro' &&
    v1.validacao === 'em-validacao' && v1.lead.nome === true && v1.lead.foto === false && v1.arquivada === false, 'ela usa a página da base e guarda nome, descrição, nota, classificação e o que mostra do lead');
  const baseTec = c1.j.versoes.find(v => v.id === 'tecnica'); // a base, como a API devolve (a lista vem do variacoes.json do deck)
  ok(v1.opcionais.length > 0 && JSON.stringify(v1.opcionais) === JSON.stringify(baseTec.opcionais) && v1.resumo === baseTec.resumo &&
    v1.opcionais.every(o => R.VERSOES.find(v => v.id === 'tecnica').opcionais.some(x => x.id === o.id && x.rotulo === o.rotulo && x.ajuda === o.ajuda)), 'e herda os slides opcionais e a descrição da base');
  ok(v1.criadoPor && v1.criadoPor.login === s.adminLogin && v1.criadoEm, 'o admin vê quem criou e quando');
  const gc = (await lista(carla)).find(v => v.id === slug1);
  ok(gc && gc.criada === true && gc.base === 'tecnica' && !('criadoPor' in gc) && !('ajustadoPor' in gc), 'o closer vê a variação nova (sem quem criou nem quando)');
  ok((await cria({ nome: 'TÉCNICA sem FOTO', base: 'principal' })).status === 400 && /Já existe/.test((await cria({ nome: 'tecnica  sem foto', base: 'principal' })).j.erro), 'nome repetido (mesmo com outra caixa ou acento): 400 "Já existe"');
  ok((await cria({ nome: R.VERSOES.find(v => v.id === 'tecnica').nome, base: 'principal' })).status === 400, 'nome igual ao de uma página do deck: 400');
  const c2 = await cria({ nome: '<b>Geral</b> sem lead', base: 'principal', lead: { nome: false } });
  const v2 = c2.j.versoes.find(v => v.id === c2.j.criada);
  ok(c2.status === 201 && v2.nome === 'Geral sem lead' && v2.validacao === 'nao-validada' && v2.lead.nome === false && v2.lead.foto === false && v2.quando === '', 'sem o nome do lead a variação não mostra a foto, o HTML do nome sai e a classificação de partida é "não validada"');
  const slugs = [slug1, c2.j.criada];
  for (let i = 1; i <= 5; i++) slugs.push((await cria({ nome: 'Teste igual ' + i, base: 'principal' })).j.criada);
  ok(new Set(slugs).size === slugs.length && slugs.every(x => R.SLUG_OK.test(x)), 'cada slug é único e no formato certo (' + slugs.length + ' variações)');
  const arq = JSON.parse(fs.readFileSync(path.join(s.dados, 'versoes.json'), 'utf8'));
  ok(Array.isArray(arq.criadas) && arq.criadas.length === slugs.length && arq.criadas[0].id === slug1 && arq.criadas[0].base === 'tecnica', 'versoes.json guarda as variações criadas');
  const ord = (await lista(admin)).map(v => v.id);
  ok(ord.slice(0, 2).join() === 'principal,tecnica' && ord[2] === slug1, 'a lista segue: páginas do deck, depois as criadas, dentro da mesma classificação');

  /* ---------------- B. o uso nos R2 ---------------- */
  const base = { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: 'Assessoria PRO', r2data: new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10), r2hm: '19:30' };
  const criaR2 = async (extra, foto) => {
    const r = await admin.post('/api/atletas', { ficha: Object.assign({}, base, extra) });
    if (r.status !== 201) throw new Error('não criou: ' + r.status + ' ' + r.texto);
    if (foto) await admin.put('/api/foto?t=' + r.j.t, { retrato: b64(F('retrato-a.jpg')), avatar: b64(F('avatar-a.jpg')), autorizo: true });
    return r.j.t;
  };
  const le = async t => (await admin.get('/api/atletas?t=' + t)).j;
  const publico = async t => (await fetch(s.painel + '/api/r2?t=' + t, { headers: { Origin: s.deck } })).json();
  const t1 = await criaR2({ versao: slug1, pular: 'leva' });
  const j1 = await le(t1);
  ok(j1.registro.ficha.versao === slug1 && j1.registro.ficha.pular === 'leva', 'o closer cria um R2 com a variação nova (o slug fica na ficha) e o slide opcional da base vale');
  const p1 = await publico(t1);
  ok(p1.versao.id === slug1 && p1.versao.caminho === '/variacoes/tecnica/' && p1.ficha.semFoto === 'sim' && !('nomeTela' in p1.ficha), '/api/r2 manda a página da base e só o que a variação deixa: sem foto, com nome');
  ok(j1.checklist.foto && !j1.checklist.nome, 'o checklist não pede a foto (a variação não mostra), mas pede o nome conferido');
  ok(j1.link === s.deck + '/?a=' + t1, 'o link do lead é o de sempre, sem o slug');
  const t2 = await criaR2({ versao: c2.j.criada });
  const p2 = await publico(t2);
  ok(p2.versao.caminho === '/' && p2.ficha.nomeTela === 'sem' && p2.ficha.semFoto === 'sim', 'variação sem o nome do lead: a tela fica geral (nome e foto fora)');
  const j2 = await le(t2);
  ok(j2.checklist.foto && j2.checklist.nome && j2.estado === 'pronto', '... e o R2 fica Pronto sem foto nem nome conferido (' + j2.estado + ')');
  const ruim = await admin.post('/api/atletas', { ficha: Object.assign({}, base, { versao: 'nao-existe-zzzz' }) });
  ok(ruim.status === 400 && /não existe mais/.test(ruim.j.erro), 'variação que não existe: o R2 não é criado em silêncio na Principal (400)');
  const r5 = await admin.put('/api/atletas?t=' + t1, { ficha: Object.assign({}, base, { versao: 'nao-existe-zzzz' }), base: j1.registro.fichaEm });
  ok(r5.status === 400 && (await le(t1)).registro.ficha.versao === slug1, '... nem a troca pra uma que não existe (a ficha segue na variação de antes)');
  const ok1 = await admin.put('/api/atletas?t=' + t1, { ficha: Object.assign({}, base, { versao: 'principal' }), base: j1.registro.fichaEm });
  ok(ok1.status === 200 && !('versao' in ok1.j.registro.ficha), 'trocar pra Principal vale e a Principal não fica gravada');
  await admin.put('/api/atletas?t=' + t1, { ficha: Object.assign({}, base, { versao: slug1, pular: 'leva' }), base: ok1.j.registro.fichaEm });

  // uma variação criada noutra instância (o cache daqui ainda não conhece): o servidor lê de novo antes de recusar
  await lista(admin);
  const arq2 = JSON.parse(fs.readFileSync(path.join(s.dados, 'versoes.json'), 'utf8'));
  arq2.criadas.push({ id: 'fora-do-cache-q7q7', nome: 'Fora do cache', base: 'principal', quando: '', validacao: 'nao-validada', nota: '', lead: { nome: true, foto: true }, arquivada: false, criadoPor: { login: 'x', nome: 'X' }, criadoEm: new Date().toISOString() });
  fs.writeFileSync(path.join(s.dados, 'versoes.json'), JSON.stringify(arq2));
  const tfc = await criaR2({ versao: 'fora-do-cache-q7q7' });
  ok((await le(tfc)).registro.ficha.versao === 'fora-do-cache-q7q7' && (await publico(tfc)).versao.id === 'fora-do-cache-q7q7', 'variação criada noutra instância: o servidor lê de novo e o R2 usa ela (nada cai na Principal)');

  /* ---------------- C. editar e arquivar ---------------- */
  const put = (id, corpo, cli) => (cli || admin).put('/api/versoes?id=' + id, corpo);
  const e1 = await put(slug1, { nome: 'Técnica sem a foto', quando: 'Foto não autorizada ou sem foto boa', validacao: 'validada', nota: 'Fechou 2 de 3', lead: { foto: true } });
  const w1 = e1.j.versoes.find(v => v.id === slug1);
  ok(e1.status === 200 && w1.nome === 'Técnica sem a foto' && w1.quando === 'Foto não autorizada ou sem foto boa' && w1.validacao === 'validada' && w1.nota === 'Fechou 2 de 3' && w1.lead.foto === true && w1.id === slug1, 'o admin muda nome, descrição, classificação, nota e a foto da variação criada (o slug não muda)');
  ok(e1.j.versoes[0].id === slug1, 'e ela, validada, vai pro topo da lista');
  ok((await put(slug1, { nome: R.VERSOES.find(v => v.id === 'principal').nome })).status === 400 && (await put(slug1, { nome: 'A' })).status === 400, 'nome repetido ou curto na edição: 400');
  ok((await put('tecnica', { nome: 'Outro nome' })).status === 400 && (await put('tecnica', { quando: 'x' })).status === 400, 'página do código não muda de nome nem de descrição: 400');
  ok((await put(slug1, { nome: 'Técnica sem a foto' })).status === 200, 'salvar o mesmo nome na própria variação vale (não é nome repetido)');
  ok((await put(slug1, { validacao: 'validada' }, carla)).status === 403 && (await put('nao-existe', { nota: 'x' })).status === 404, 'closer não edita (403) e variação que não existe dá 404');
  await put(slug1, { lead: { foto: false } });
  const arq1 = await put(slug1, { arquivada: true });
  const ga = (await lista(carla)).find(v => v.id === slug1);
  ok(arq1.status === 200 && ga.arquivada === true, 'o admin arquiva: a lista marca arquivada (a tela esconde dos closers)');
  const pa = await publico(t1);
  ok(pa.versao.id === slug1 && pa.versao.caminho === '/variacoes/tecnica/' && pa.ficha.semFoto === 'sim', 'o R2 que já usa a variação arquivada continua abrindo a página e com o que ela deixa');
  ok((await put('principal', { arquivada: true })).status === 400, 'a Principal não arquiva: 400');
  ok((await put('tecnica', { arquivada: true })).status === 200 && (await lista(carla)).find(v => v.id === 'tecnica').arquivada === true && (await put('tecnica', { arquivada: false })).status === 200, 'uma página do deck arquiva e volta');
  await put(slug1, { arquivada: false });
  // o limite
  let n = 0, ultimo = null;
  for (; n < 70; n++) { ultimo = await cria({ nome: 'Lote ' + n, base: 'principal' }); if (ultimo.status !== 201) break; }
  const ativas = (await lista(admin)).filter(v => v.criada && !v.arquivada).length;
  ok(ultimo.status === 400 && /Já são 60 variações ativas/.test(ultimo.j.erro) && ativas === 60, 'passou de 60 variações ativas: 400, "Arquive as que não servem mais" (' + ativas + ' ativas)');
  const lote = (await lista(admin)).filter(v => v.criada && /^lote-/.test(v.id));
  await put(lote[0].id, { arquivada: true });
  const dep = await cria({ nome: 'Depois do arquivo', base: 'principal' });
  ok(dep.status === 201, 'arquivar uma variação libera uma vaga');
  for (const v of lote.slice(1)) await put(v.id, { arquivada: true });

  /* ---------------- D. o deck ---------------- */
  const NOME = "Array.from(document.querySelectorAll('[data-bind=\"nome\"]')).map(e => e.textContent.trim()).filter(Boolean)[0] || ''";
  const fotoPedida = "Array.from(document.images).some(i => /api\\/foto/.test(i.src)) || performance.getEntriesByType('resource').some(r => /api\\/foto/.test(r.name))";
  const pronto = "document.querySelectorAll('#stage > .slide.active').length === 1 && window.getComputedStyle(document.querySelector('#viewport')).visibility !== 'hidden'";
  const td = await criaR2({ versao: slug1 }, true);
  const D1 = await nav.aba(s.deck + '/?a=' + td + '#1', { largura: 1920, altura: 1080 });
  await D1.ate("location.pathname === '/variacoes/tecnica/' && " + pronto, 15000); await espera(1800);
  ok((await D1.avalia('location.pathname')) === '/variacoes/tecnica/' && !(await D1.avalia(fotoPedida)) && (await D1.avalia(NOME)) === 'Lucas Silva', 'R2 da variação criada sobre a técnica: o deck abre a técnica, o nome aparece e a foto nem é pedida');
  const tg = await criaR2({ versao: c2.j.criada }, true);
  const D2 = await nav.aba(s.deck + '/?a=' + tg + '#2', { largura: 1920, altura: 1080 });
  await D2.ate("location.pathname === '/' && " + pronto, 15000); await espera(1800);
  const txt = await D2.avalia("Array.from(document.querySelectorAll('#stage > .slide')).map(x => x.textContent).join(' ')");
  ok(!/Lucas|Silva|Almeida/.test(txt) && !(await D2.avalia(fotoPedida)), 'R2 da variação sem o nome do lead (sobre a principal): nenhum slide traz o nome e a foto nem é pedida');
  const excD = [D1, D2].flatMap(a => a.console_.filter(m => /^EXC/.test(m)));
  ok(!excD.length, 'nenhuma exceção de JavaScript no deck' + (excD.length ? ': ' + excD.slice(0, 2).join(' | ') : ''));

  /* ---------------- E. as telas ---------------- */
  const entra = async (aba, login, senha) => {
    await aba.ate("!document.querySelector('#v-entrar').hidden");
    await aba.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = ${JSON.stringify(login)}; f.senha.value = ${JSON.stringify(senha)}; f.requestSubmit(); return 1; })()`);
    return aba.ate("!document.querySelector('#v-app').hidden");
  };
  const cartoes = aba => aba.avalia("Array.from(document.querySelectorAll('#versoes-lista .versao-card')).map(c => c.dataset.v).join(',')");
  const A = await nav.aba(s.painel + '/#/versoes', { largura: 1500, altura: 1000 });
  const C = await nav2.aba(s.painel + '/#/versoes', { largura: 1500, altura: 1000 });
  ok(await entra(A, s.adminLogin, s.adminSenha) && await entra(C, 'carla.closer', SENHA), 'o admin e a closer entram no painel');
  await A.ate("document.querySelectorAll('#versoes-lista .versao-card').length > 0");
  await C.ate("document.querySelectorAll('#versoes-lista .versao-card').length > 0");
  ok(await A.avalia("!document.querySelector('#bt-nova-variacao').hidden") && await C.avalia("document.querySelector('#bt-nova-variacao').hidden"), 'só o admin vê o botão "+ Nova variação"');
  ok(/Gerar apresentação pra um lead/.test(await C.avalia("document.querySelector('#versoes-lista .versao-card').textContent")) && /Variações do R2/.test(await C.avalia("document.querySelector('#tab-versoes').textContent")), 'os botões e a aba usam as palavras "variação" e "gerar apresentação pra um lead"');

  // o admin cria pelo diálogo
  await A.avalia("document.querySelector('#bt-nova-variacao').click(); 1");
  ok(await A.ate("document.querySelector('#d-variacao').open"), '"+ Nova variação" abre o diálogo');
  ok(await A.avalia("Array.from(document.querySelectorAll('#dv-base option')).map(o => o.value).join() === " + JSON.stringify(R.VERSOES.map(v => v.id).join()) + " && document.querySelector('#dv-validacao').value === 'nao-validada'"), 'a base lista as páginas do deck e a classificação de partida é "Não validada"');
  await A.avalia("document.querySelector('#dv-lead-nome').click(); 1");
  ok(await A.avalia("document.querySelector('#dv-lead-foto').disabled && !document.querySelector('#dv-lead-foto').checked"), 'desmarcar o nome do lead desliga a foto no diálogo');
  await A.avalia("document.querySelector('#dv-lead-nome').click(); 1"); // o nome volta; a foto continua desmarcada (e agora liberada)
  await A.avalia(`(() => { document.querySelector('#dv-nome').value = 'Principal sem foto'; document.querySelector('#dv-base').value = 'principal'; document.querySelector('#dv-quando').value = 'Lead sem foto boa'; document.querySelector('#dv-validacao').value = 'validada'; document.querySelector('#f-variacao').requestSubmit(); return 1; })()`);
  ok(await A.ate("!document.querySelector('#d-variacao').open && /^Variação criada\\. O slug dela é principal-sem-foto-[a-z2-7]{4}\\.$/.test(document.querySelector('#aviso').textContent)"), 'criar fecha o diálogo e avisa o slug gerado');
  const vNova = (await lista(admin)).find(v => v.nome === 'Principal sem foto');
  ok(vNova && vNova.base === 'principal' && vNova.validacao === 'validada' && vNova.lead.nome === true && vNova.lead.foto === false && vNova.quando === 'Lead sem foto boa', 'a variação criada pela tela vale no servidor (' + (vNova && vNova.id) + ')');
  ok(await A.avalia("(() => { const c = document.querySelector('#versoes-lista [data-v=\"" + (vNova && vNova.id) + "\"]'); return !!c && c.classList.contains('novo') && c.textContent.includes(" + JSON.stringify('Baseada em: ' + R.VERSOES.find(v => v.id === 'principal').nome) + ") && /Validada/.test(c.querySelector('.versao-titulo').textContent) && c.querySelector('code').textContent === '" + (vNova && vNova.id) + "'; })()"), 'a ficha dela aparece em destaque, com a base, a classificação e o slug');
  ok((await A.avalia("document.querySelector('#versoes-lista .versao-card').dataset.v")) === slug1 || (await A.avalia("document.querySelector('#versoes-lista .versao-card .versao-titulo .chip').textContent")) === 'Validada', 'e as validadas vêm primeiro na lista');
  await A.avalia("document.querySelector('#bt-nova-variacao').click(); 1");
  await A.avalia(`(() => { document.querySelector('#dv-nome').value = 'principal SEM foto'; document.querySelector('#f-variacao').requestSubmit(); return 1; })()`);
  ok(await A.ate("/Já existe uma variação com esse nome/.test(document.querySelector('#dv-erro').textContent) && document.querySelector('#d-variacao').open"), 'nome repetido pelo diálogo: o erro aparece e o diálogo fica aberto');
  await A.avalia("document.querySelector('#dv-cancelar').click(); 1");

  // a closer vê e usa
  await C.avalia('location.reload(); 1');
  await C.ate("!!document.querySelector('#versoes-lista [data-v=\"" + vNova.id + "\"]')"); // a página nova (a de antes do reload ainda não tem a variação)
  ok((await cartoes(C)).split(',').includes(vNova.id) && !(await C.avalia("document.querySelector('#versoes-lista details.ajustes')")), 'a closer recarrega e vê a variação nova, sem os ajustes do admin');
  await C.avalia("document.querySelector('#versoes-lista [data-v=\"" + vNova.id + "\"] a.bt.ouro').click(); 1");
  ok(await C.ate("!document.querySelector('#v-editor').hidden && document.querySelector('#versoes input[value=\"" + vNova.id + "\"]') && document.querySelector('#versoes input[value=\"" + vNova.id + "\"]').checked"), '"Gerar apresentação pra um lead" abre o R2 novo com a variação já marcada');
  const secoes = await C.avalia("Array.from(document.querySelectorAll('#f-editor > .sec')).map(x => x.id).slice(0, 2).join()");
  ok(secoes === 's-versao,s-foto', 'a escolha da variação é a primeira seção do R2');
  ok(await C.avalia("!document.querySelector('#nt-bloco').hidden && document.querySelector('#foto-tela-bloco').hidden && /não mostra a foto do lead/.test(document.querySelector('#lead-nota').textContent)"), 'a variação não mostra a foto: some a caixa da foto e o editor explica');
  const picker = await C.avalia("Array.from(document.querySelectorAll('#versoes .versao')).map(l => l.querySelector('input').value).join()");
  const ordemPicker = picker.split(',');
  ok(ordemPicker.indexOf(vNova.id) >= 0 && ordemPicker.indexOf(vNova.id) < ordemPicker.indexOf('principal'), 'no seletor, a validada vem antes da Principal em validação (' + ordemPicker.slice(0, 4).join(', ') + ')');
  await C.avalia(`(() => { const f = document.querySelector('#f-editor'); const e = f.elements.namedItem('nome'); e.value = 'Marcos Antônio Pereira'; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
  await C.avalia("document.querySelector('#ed-salvar').click(); 1");
  ok(await C.ate("/^#\\/r2\\/[a-z2-7]{26}$/.test(location.hash)"), 'a closer gera a apresentação do lead (o R2 nasce)');
  const tC = (await C.avalia('location.hash')).slice(5);
  ok((await le(tC)).registro.ficha.versao === vNova.id, 'e o R2 fica com a variação criada pelo admin (' + vNova.id + ')');

  // editar o nome pelo admin: o chip do R2 acompanha
  await A.avalia("document.querySelector('#versoes-lista details[data-v=\"" + vNova.id + "\"]').open = true; 1");
  await A.avalia(`(() => { const d = document.querySelector('#versoes-lista details[data-v="${vNova.id}"]'); d.querySelector('[data-aj=nomeVar]').value = 'Principal para lead sem foto'; return 1; })()`);
  await A.avalia("document.querySelector('#versoes-lista [data-salva-aj=\"" + vNova.id + "\"]').click(); 1");
  ok(await A.ate("document.querySelector('#aviso').textContent === 'Ajustes salvos.' && document.querySelector('#versoes-lista [data-v=\"" + vNova.id + "\"] h3').textContent === 'Principal para lead sem foto'"), 'o admin renomeia a variação pelos ajustes');
  await C.avalia("location.hash = '#/'; 1");
  await C.avalia('location.reload(); 1');
  ok(await C.ate("Array.from(document.querySelectorAll('#lista .item')).some(i => /Marcos/.test(i.textContent) && /Principal para lead sem foto/.test(i.querySelector('.chips').textContent))", 15000), 'na lista da closer, o R2 mostra a variação com o nome novo');

  // arquivar
  await A.avalia("document.querySelector('#versoes-lista details[data-v=\"" + vNova.id + "\"] [data-aj=arquivada]').click(); document.querySelector('#versoes-lista [data-salva-aj=\"" + vNova.id + "\"]').click(); 1");
  ok(await A.ate("document.querySelector('#versoes-lista [data-v=\"" + vNova.id + "\"]').classList.contains('arquivada') && /Arquivada/.test(document.querySelector('#versoes-lista [data-v=\"" + vNova.id + "\"] .versao-titulo').textContent)"), 'o admin arquiva: a ficha fica com a marca "Arquivada"');
  await C.avalia("location.hash = '#/versoes'; 1");
  await C.avalia('location.reload(); 1');
  await C.ate("document.querySelectorAll('#versoes-lista .versao-card').length > 0");
  ok(!(await cartoes(C)).split(',').includes(vNova.id), 'a closer não vê mais a variação arquivada na aba');
  await C.avalia("location.hash = '#/novo'; 1");
  await C.ate("!document.querySelector('#v-editor').hidden && document.querySelectorAll('#versoes .versao').length > 0");
  ok(!(await C.avalia("!!document.querySelector('#versoes input[value=\"" + vNova.id + "\"]')")), 'nem no seletor de um R2 novo');
  await C.avalia("location.hash = '#/novo/" + vNova.id + "'; 1");
  await espera(600);
  ok(await C.avalia("document.querySelector('#versoes input[value=principal]').checked"), 'um link #/novo/<slug> de variação arquivada abre na Principal');
  await C.avalia("location.hash = '#/r2/" + tC + "'; 1");
  await C.ate("!document.querySelector('#v-editor').hidden && /Marcos/.test(document.querySelector('#ed-titulo').textContent)");
  await espera(600);
  ok(await C.avalia("(() => { const r = document.querySelector('#versoes input[value=\"" + vNova.id + "\"]'); return !!r && r.checked && /Arquivada/.test(r.closest('label').textContent); })()"), 'o R2 que já usa a variação arquivada abre nela, com a marca "Arquivada", e a closer não perde a escolha');

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
