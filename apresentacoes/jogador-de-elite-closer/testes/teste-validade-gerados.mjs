// A validade que quem monta escolhe, a seção Gerados (o espaço de cada lead e a exclusão em lote), a limpeza do lead marcado pra sumir
// quando vence e o link vencido em todos os decks (o R2 anterior e o R1 também mostram "link inativo"). Também confere a capa da
// variação Acompanhamento: "Montado para" com a foto, o nome e o sobrenome e o "Dossiê nº".
// Uso: node testes/teste-validade-gerados.mjs
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZES } from './servidor.mjs';
import { Cliente, verificador, fotosDeTeste, b64 } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const { ok, fim } = verificador('Validade e Gerados');
const s = await sobe({ deck: true, decks: ['r2-anterior', 'r2-b', 'r1'] });
const nav = await abreNavegador();
const fotos = fotosDeTeste(RAIZES.r2);
const arqDados = (...p) => path.join(s.dados, ...p);
const mexeDado = (p, muda) => { const a = arqDados(...p.split('/')); const d = JSON.parse(fs.readFileSync(a, 'utf8')); muda(d); fs.writeFileSync(a, JSON.stringify(d)); };
const H = 3600e3, DIA = 24 * H;
// a pasta de fotos de um lead sem nenhum arquivo (o driver de arquivo deixa a pasta vazia; no Blob não existe pasta)
const semArquivos = (...p) => !fs.existsSync(arqDados(...p)) || !fs.readdirSync(arqDados(...p)).length;
const perto = (a, b) => Math.abs(Date.parse(a) - Date.parse(b)) < 2000;
try {
  const admin = new Cliente(s.painel); await admin.entra(s.adminLogin, s.adminSenha);
  const SENHA = 'senha-boa-123456';
  const cria = async (login, nome, papel) => { await admin.post('/api/usuarios', { login, nome, papel, senha: SENHA }); const c = new Cliente(s.painel); await c.entra(login, SENHA); return c; };
  const ana = await cria('ana.closer', 'Ana Closer', 'closer');
  const beto = await cria('beto.closer', 'Beto Closer', 'closer');
  const amanha = new Date(Date.now() + DIA).toISOString().slice(0, 10);

  /* ---------------- 1. a validade escolhida ao gerar ---------------- */
  console.log('\n1. a validade escolhida ao gerar');
  const em2h = new Date(Date.now() + 2 * H).toISOString();
  const c1 = await ana.post('/api/atletas', { ficha: { nome: 'Carlos Eduardo Souza', r2data: amanha, r2hm: '19:30' }, link: { venceEm: em2h, apagarAoVencer: true } });
  ok(c1.status === 201 && perto(c1.j.registro.venceEm, em2h) && c1.j.registro.venceManual === true && c1.j.registro.apagarAoVencer === true, 'gerado com a validade escolhida (daqui a 2 h) e marcado pra apagar quando vencer');
  const t1 = c1.j.t;
  ok((await ana.post('/api/atletas', { ficha: { nome: 'X' }, link: { venceEm: new Date(Date.now() - H).toISOString() } })).status === 400, 'validade no passado: 400');
  ok((await ana.post('/api/atletas', { ficha: { nome: 'X' }, link: { venceEm: new Date(Date.now() + 61 * DIA).toISOString() } })).status === 400, 'validade além de 60 dias: 400');
  ok((await ana.post('/api/atletas', { ficha: { nome: 'X' }, link: { venceEm: 'amanhã' } })).status === 400, 'validade que não é data: 400');
  const c2 = await ana.post('/api/atletas', { ficha: { nome: 'Pedro Lima', r2data: amanha, r2hm: '10:00' } });
  ok(c2.status === 201 && !c2.j.registro.venceManual && !c2.j.registro.apagarAoVencer && Date.parse(c2.j.registro.venceEm) > Date.now() + 7 * DIA, 'sem escolher: a automática (7 dias depois da call)');
  const t2 = c2.j.t;

  /* ---------------- 2. a call muda de dia: a escolhida fica, a automática acompanha ---------------- */
  console.log('\n2. a call muda de dia');
  const depois = new Date(Date.now() + 10 * DIA).toISOString().slice(0, 10);
  let r = (await ana.get('/api/atletas?t=' + t1)).j.registro;
  await ana.put('/api/atletas?t=' + t1, { base: r.fichaEm, ficha: Object.assign({}, r.ficha, { r2data: depois }) });
  ok(perto((await ana.get('/api/atletas?t=' + t1)).j.registro.venceEm, em2h), 'a validade escolhida não muda quando o dia da call muda');
  r = (await ana.get('/api/atletas?t=' + t2)).j.registro;
  const antes2 = r.venceEm;
  await ana.put('/api/atletas?t=' + t2, { base: r.fichaEm, ficha: Object.assign({}, r.ficha, { r2data: depois }) });
  ok(Date.parse((await ana.get('/api/atletas?t=' + t2)).j.registro.venceEm) > Date.parse(antes2), 'a automática vai junto com a call');

  /* ---------------- 3. a ação validade no lead gerado ---------------- */
  console.log('\n3. a ação validade');
  const em3d = new Date(Date.now() + 3 * DIA).toISOString();
  let v = await ana.post('/api/link?t=' + t2 + '&acao=validade', { venceEm: em3d });
  ok(v.status === 200 && perto(v.j.registro.venceEm, em3d) && v.j.registro.venceManual === true, 'escolhe a validade de um lead já gerado');
  v = await ana.post('/api/link?t=' + t2 + '&acao=validade', { apagarAoVencer: true });
  ok(v.status === 200 && v.j.registro.apagarAoVencer === true && perto(v.j.registro.venceEm, em3d), 'marca "apagar quando vencer" sem mexer na validade');
  v = await ana.post('/api/link?t=' + t2 + '&acao=validade', { auto: true });
  ok(v.status === 200 && v.j.registro.venceManual === false && Date.parse(v.j.registro.venceEm) > Date.now() + 7 * DIA, 'volta pra automática');
  ok((await ana.post('/api/link?t=' + t2 + '&acao=validade', { venceEm: new Date(Date.now() - 1000).toISOString() })).j.erro.includes('Revogar'), 'no passado: o erro diz pra usar Revogar');
  ok((await beto.post('/api/link?t=' + t2 + '&acao=validade', { venceEm: em3d })).status === 403, 'outro closer não mexe na validade: 403');
  ok((await ana.get('/api/atletas')).j.itens.some(it => it.t === t1 && it.venceManual && it.apagarAoVencer), 'a lista leva a validade escolhida e o "apaga ao vencer"');

  /* ---------------- 4. vencido: a família vê o link inativo em todos os decks ---------------- */
  console.log('\n4. link vencido nos decks');
  const ft = { retrato: b64(path.join(fotos, 'retrato-a.jpg')), avatar: b64(path.join(fotos, 'avatar-a.jpg')), autorizo: true };
  const lista = (await admin.get('/api/versoes')).j.versoes; // a primeira leitura sincroniza com os decks (a Acompanhamento vem de lá)
  const vencidos = {};
  for (const [id, etapa] of [['r2a-acompanhamento', 'r2'], ['r2a-principal', 'r2'], ['r1-principal', 'r1'], ['r2b-principal', 'r2'], ['principal', 'r2']]) {
    const c = await admin.post('/api/atletas', { etapa, ficha: { nome: 'Lucas Almeida da Silva', versao: id } });
    ok(c.status === 201, id + ': gerado'); vencidos[id] = c.j.t;
  }
  // primeiro valendo: a página abre com o nome (e guarda a ficha no navegador)
  for (const [id, t] of Object.entries(vencidos)) {
    const ver = lista.find(x => x.id === id);
    const a = await nav.aba(s.decks[ver.deck] + ver.caminho + '?a=' + t + '#2', { largura: 1920, altura: 1080 });
    ok(await a.ate(`/LUCAS/i.test(document.querySelector('#stage>.slide.active').innerText)`, 12000), id + ': valendo, o slide 02 mostra o nome');
    mexeDado('atletas/' + t + '.json', d => { d.venceEm = new Date(Date.now() - 1000).toISOString(); });
    await a.avalia('location.reload();1'); await espera(500);
    ok(await a.ate(`(document.querySelector('#je-inativo')||{}).textContent==='Este link não está mais ativo. Fale com o seu gestor de carreiras.'`, 12000), id + ': vencido, a família vê "Este link não está mais ativo"');
    ok(!/LUCAS/i.test(await a.avalia(`document.body.innerText`)), id + ': e nada do atleta fica na tela');
    await Promise.race([a.envia('Page.close').catch(() => {}), espera(700)]);
  }

  /* ---------------- 5. a capa da Acompanhamento: Montado para, foto, nome e sobrenome ---------------- */
  console.log('\n5. a capa da Acompanhamento');
  const ac = await ana.post('/api/atletas', { ficha: { nome: 'Carlos Eduardo de Souza', versao: 'r2a-acompanhamento' } });
  ok((await ana.put('/api/foto?t=' + ac.j.t, ft)).status === 200, 'foto enviada');
  const verAc = lista.find(x => x.id === 'r2a-acompanhamento');
  const capa = await nav.aba(s.decks[verAc.deck] + verAc.caminho + '?a=' + ac.j.t + '#1', { largura: 1920, altura: 1080 });
  ok(await capa.ate(`document.querySelector('.zx-retrato>img')?.naturalWidth>0`, 12000), 'a foto aparece no quadro do "Montado para"');
  const cap = await capa.avalia(`document.querySelector('.zx-retrato-caption').innerText.replace(/\\s+/g,' ')`);
  ok(/Montado para CARLOS EDUARDO SOUZA/i.test(cap) && /Dossiê nº [A-Z2-7]{8}/.test(cap), 'a placa: "Montado para", nome e sobrenome e "Dossiê nº" (' + cap + ')');
  ok(await capa.avalia(`(()=>{const e=document.querySelector('.zx-retrato-caption strong');return e.scrollWidth<=e.parentElement.clientWidth+1&&parseFloat(getComputedStyle(e).fontSize)>=24})()`), 'o nome cabe na placa, em 24 px ou mais');
  ok(/CARLOS EDUARDO SOUZA,/i.test(await capa.avalia(`document.querySelector('#stage>.slide.active h1').innerText.replace(/\\s+/g,' ')`)), 'o título da capa chama pelo nome e sobrenome');
  const fotoEm = await capa.avalia(`[...document.querySelectorAll('#stage>.slide')].flatMap((sl,i)=>[...sl.querySelectorAll('img')].some(img=>/api\\/foto/.test(img.getAttribute('src')||''))?[i+1]:[])`);
  ok(fotoEm.includes(1) && fotoEm.includes(2) && fotoEm.length >= 5, 'a foto vai pros quadros do deck, não só pro slide 02 (' + fotoEm.join(', ') + ')');
  const cods = await capa.avalia(`[...new Set([...document.querySelectorAll('[data-bind="dossieCod"],[data-bind="selecaoCodigo"]')].map(e=>e.textContent).filter(Boolean))]`);
  ok(cods.length === 1 && cods[0] === ac.j.t.slice(-8).toUpperCase(), 'o código do dossiê é o mesmo em todos os slides (' + cods.join(', ') + ')');
  // a foto fora da tela: os quadros mostram as iniciais do nome e sobrenome
  let rr = (await ana.get('/api/atletas?t=' + ac.j.t)).j.registro;
  await ana.put('/api/atletas?t=' + ac.j.t, { base: rr.fichaEm, ficha: Object.assign({}, rr.ficha, { semFoto: 'sim' }) });
  await capa.avalia('location.reload();1'); await espera(600);
  ok(await capa.ate(`document.querySelector('.zx-retrato>b')?.textContent==='CS' && getComputedStyle(document.querySelector('.zx-retrato>b')).display!=='none'`, 12000), 'sem a foto na tela: o quadro mostra CS');
  await Promise.race([capa.envia('Page.close').catch(() => {}), espera(700)]);

  /* ---------------- 6. Gerados: o espaço de cada um ---------------- */
  console.log('\n6. Gerados');
  ok((await ana.put('/api/foto?t=' + t1, ft)).status === 200, 'foto no primeiro lead');
  const g = await ana.get('/api/atletas?gerados=1');
  const g1 = g.j.itens.find(it => it.t === t1);
  ok(g.status === 200 && g1 && g1.espaco.foto > 1000 && g1.espaco.ficha > 100 && g1.espaco.total === g1.espaco.ficha + g1.espaco.foto + g1.espaco.video, 'cada lead traz o espaço (ficha, foto e vídeo) em bytes');
  ok(g.j.totalBytes === g.j.itens.reduce((x, it) => x + it.espaco.total, 0), 'e o total');
  ok(!g.j.itens.some(it => it.donoLogin !== 'ana.closer'), 'o closer vê só os dele');
  ok((await admin.get('/api/atletas?gerados=1&todos=1')).j.itens.some(it => it.donoLogin === 'ana.closer'), 'o admin vê os de todos');
  ok(!('espaco' in ((await ana.get('/api/atletas')).j.itens[0] || {})), 'a lista de sempre não lista a loja (sem gerados=1)');

  /* ---------------- 7. exclusão em lote ---------------- */
  console.log('\n7. exclusão em lote');
  const b1 = (await beto.post('/api/atletas', { ficha: { nome: 'Do Beto' } })).j.t;
  const x1 = (await ana.post('/api/atletas', { ficha: { nome: 'Pra excluir 1' } })).j.t;
  const x2 = (await ana.post('/api/atletas', { ficha: { nome: 'Pra excluir 2' } })).j.t;
  await ana.put('/api/foto?t=' + x1, ft);
  ok(fs.existsSync(arqDados('fotos', x1)), 'a foto existe antes');
  const d = await ana.del('/api/atletas', { json: { ts: [x1, x2, b1] } });
  ok(d.status === 200 && d.j.apagados.length === 2 && d.j.recusados.length === 1 && d.j.recusados[0] === b1, 'exclui os dois dela e recusa o do Beto');
  ok(!fs.existsSync(arqDados('atletas', x1 + '.json')) && !fs.existsSync(arqDados('atletas', x2 + '.json')) && semArquivos('fotos', x1), 'registro e foto saem da loja');
  ok(!(await ana.get('/api/atletas')).j.itens.some(it => [x1, x2].includes(it.t)), 'e saem do índice');
  ok(fs.existsSync(arqDados('atletas', b1 + '.json')), 'o do Beto fica');
  ok((await new Cliente(s.painel).get('/api/r2?t=' + x1)).j.estado === 'nao-encontrado', 'o link excluído para de funcionar');
  ok((await ana.del('/api/atletas', { json: { ts: [] } })).status === 400, 'lista vazia: 400');
  ok((await ana.del('/api/atletas', { json: { ts: Array.from({ length: 51 }, (_, i) => 'a'.repeat(24) + 'abcdefghijklmnopqrstuvwxyz234567'[i % 32] + 'abcdefghijklmnopqrstuvwxyz234567'[Math.floor(i / 32)]) } })).status === 400, 'mais de 50: 400');

  /* ---------------- 8. a limpeza apaga o lead vencido marcado ---------------- */
  console.log('\n8. limpeza');
  mexeDado('atletas/' + t1 + '.json', x => { x.venceEm = new Date(Date.now() - 1000).toISOString(); });
  const lp = await new Cliente(s.painel).get('/api/limpeza', { cabecalhos: { Authorization: 'Bearer ' + s.cronSecret } });
  ok(lp.status === 200 && lp.j.apagadosAoVencer >= 1, 'a limpeza conta os apagados ao vencer (' + JSON.stringify(lp.j) + ')');
  ok(!fs.existsSync(arqDados('atletas', t1 + '.json')) && semArquivos('fotos', t1), 'o lead vencido marcado sumiu (registro e foto)');
  ok(fs.existsSync(arqDados('atletas', t2 + '.json')), 'o que não venceu fica');

  /* ---------------- 9. a tela: validade no editor e a seção Gerados ---------------- */
  console.log('\n9. a tela');
  const P = await nav.aba(s.painel + '/#/novo', { largura: 1400, altura: 1000 });
  await P.ate(`!document.querySelector('#v-entrar').hidden`);
  await P.avalia(`(()=>{const f=document.querySelector('#f-entrar');f.login.value='ana.closer';f.senha.value=${JSON.stringify(SENHA)};f.requestSubmit();return 1})()`);
  ok(await P.ate(`!document.querySelector('#v-editor').hidden && !document.querySelector('#s-validade').hidden`), 'o editor novo mostra a validade do link');
  ok(/vai expirar/.test(await P.avalia(`document.querySelector('#vd-info').textContent`)) && /Automática/.test(await P.avalia(`document.querySelector('#vd-info').textContent`)), 'sem escolher: diz a automática');
  ok(await P.avalia(`document.querySelector('[data-vd="call+2h"]').disabled`), 'sem a call: os atalhos da call ficam desligados');
  await P.avalia(`(()=>{const n=document.querySelector('#f-editor [name=nome]');n.value='Gabriel Rocha';n.dispatchEvent(new Event('input',{bubbles:true}));const d=document.querySelector('#f-editor [name=r2data]');d.value=${JSON.stringify(amanha)};d.dispatchEvent(new Event('input',{bubbles:true}));const h=document.querySelector('#f-editor [name=r2hm]');h.value='19:30';h.dispatchEvent(new Event('input',{bubbles:true}));return 1})()`);
  ok(!(await P.avalia(`document.querySelector('[data-vd="call+2h"]').disabled`)), 'com o dia e a hora da call: os atalhos ligam');
  await P.avalia(`document.querySelector('[data-vd="call+2h"]').click();document.querySelector('#vd-apagar').click();1`);
  ok(/escolhida por você/.test(await P.avalia(`document.querySelector('#vd-info').textContent`)), 'escolhida antes de gerar: o texto muda');
  await P.avalia(`document.querySelector('#ed-salvar').click();1`);
  ok(await P.ate(`location.hash.length===31 && !document.querySelector('#s-link').hidden`), 'gerou o link');
  const tP = await P.avalia(`location.hash.slice(5)`);
  let regP = (await ana.get('/api/atletas?t=' + tP)).j.registro;
  ok(regP.venceManual && regP.apagarAoVencer && perto(regP.venceEm, new Date(Date.parse(amanha + 'T19:30:00-03:00') + 2 * H).toISOString()), 'o servidor guardou 2 h depois da call e o apagar ao vencer');
  await P.avalia(`document.querySelector('[data-vd="agora+3d"]').click();1`);
  ok(await P.ate(`/daqui a 3 dias/.test(document.querySelector('#vd-info').textContent)`), 'no lead gerado, o atalho vale na hora');
  regP = (await ana.get('/api/atletas?t=' + tP)).j.registro;
  ok(Math.abs(Date.parse(regP.venceEm) - (Date.now() + 3 * DIA)) < 60e3, '... e o servidor guardou');
  await P.avalia(`location.hash='#/gerados';1`);
  ok(await P.ate(`!document.querySelector('#aba-gerados').hidden && document.querySelectorAll('#ger-lista .ger-item').length>0`), 'a seção Gerados abre com a lista');
  ok(/apresentaç(ão|ões) gerada/.test(await P.avalia(`document.querySelector('#ger-resumo').textContent`)), 'com o total ocupado');
  await P.avalia(`document.querySelector('[data-ger-apresentado="${tP}"]').click();1`);
  ok(await P.ate(`/Apresentado/.test(document.querySelector('.ger-item[data-t="${tP}"] .chips').textContent)`), 'marcar como apresentado muda a etiqueta');
  await P.avalia(`document.querySelector('#ger-sel-feitos').click();1`);
  ok(await P.ate(`document.querySelector('.ger-item[data-t="${tP}"] input').checked && !document.querySelector('#ger-excluir').disabled`), '"Selecionar apresentados e expirados" marca o apresentado');
  P.dialogo.aceita = true;
  await P.avalia(`document.querySelector('#ger-excluir').click();1`);
  ok(await P.ate(`!document.querySelector('.ger-item[data-t="${tP}"]')`, 12000), 'excluir tira da lista');
  ok((await ana.get('/api/atletas?t=' + tP)).status === 404, '... e do servidor');
  ok(!P.console_.some(e => e.startsWith('EXC')), 'sem exceção de JavaScript no painel' + (P.console_.length ? ': ' + P.console_.slice(0, 2).join(' | ') : ''));
} catch (e) { console.error(e); ok(false, 'o teste parou: ' + e.message); }
finally { await nav.fecha(); await s.fecha(); fs.rmSync(fotos, { recursive: true, force: true }); }
fim();
