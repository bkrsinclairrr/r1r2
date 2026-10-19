// As telas do painel por papel, com os decks de verdade: o SDR vê o R1, o closer o R2, o admin as duas etapas. O formulário do R1 (sem foto, plano,
// nome na tela nem leitura), o checklist do R1, a prévia que abre em outra aba, as variações de cada etapa com o deck de cada uma, a nova variação
// sobre a página de qualquer deck, os usuários com o papel SDR e a importação do R1 pelo closer.
// Uso: node testes/teste-etapas-telas.mjs [--telas <pasta>]   (com --telas, guarda as capturas de tela na pasta)
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZES } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const { ok, fim } = verificador('Telas por etapa');
const PREFIXOS = { r2: '', 'r2-anterior': 'r2a-', 'r2-b': 'r2b-' };
const PAGINAS_R2 = Object.fromEntries(Object.keys(PREFIXOS).map(id =>
  [id, JSON.parse(fs.readFileSync(path.join(RAIZES[id], 'variacoes.json'), 'utf8')).paginas]));
const IDS_R2 = Object.entries(PAGINAS_R2).flatMap(([id, paginas]) => paginas.map(p => PREFIXOS[id] + p.id));
const iT = process.argv.indexOf('--telas');
const PASTA = iT > 0 ? path.resolve(process.argv[iT + 1]) : '';
if (PASTA) fs.mkdirSync(PASTA, { recursive: true });
const s = await sobe({ deck: true, decks: ['r2-anterior', 'r2-b', 'r1'] });
const navS = await abreNavegador(), navC = await abreNavegador(), navA = await abreNavegador();
try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  const SENHA = 'senha-boa-123456';
  const cria = async (login, nome, papel) => { await admin.post('/api/usuarios', { login, nome, papel, senha: SENHA }); return login; };
  await cria('rafa.sdr', 'Rafa SDR', 'sdr'); await cria('carla.closer', 'Carla Closer', 'closer');
  const rafa = new Cliente(s.painel); await rafa.entra('rafa.sdr', SENHA);
  const hoje = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
  const tela = async (aba, nome) => { if (PASTA) await aba.foto(path.join(PASTA, nome)); };
  const entra = async (aba, login, senha) => {
    await aba.ate("!document.querySelector('#v-entrar').hidden");
    await aba.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = ${JSON.stringify(login)}; f.senha.value = ${JSON.stringify(senha)}; f.requestSubmit(); return 1; })()`);
    return aba.ate("!document.querySelector('#v-app').hidden");
  };
  const txt = (aba, sel) => aba.avalia(`(document.querySelector(${JSON.stringify(sel)}) || { textContent: '' }).textContent.replace(/\\s+/g, ' ').trim()`);
  const visivel = (aba, sel) => aba.avalia(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); return !!e && !e.hidden && e.offsetParent !== null; })()`);
  const preenche = (aba, nome, valor) => aba.avalia(`(() => { const e = document.querySelector('#f-editor [name="${nome}"]'); e.value = ${JSON.stringify(valor)}; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); return 1; })()`);

  /* ---------------- A. o SDR ---------------- */
  console.log('\nA. o SDR vê o R1');
  const S = await navS.aba(s.painel + '/', { largura: 1500, altura: 1100 });
  ok(await entra(S, 'rafa.sdr', SENHA), 'o SDR entra');
  ok((await txt(S, '#marca-sub')) === 'Jogador de Elite · R1' && (await txt(S, '#tab-meus')) === 'Meus R1' && (await txt(S, '#tab-versoes')) === 'Variações do R1', 'o topo e as abas falam de R1 (Meus R1, Variações do R1)');
  ok(!(await visivel(S, '#bt-novo')) && (await visivel(S, '#bt-novo-r1')) && !(await visivel(S, '#bt-importar')) && !(await visivel(S, '#filtro-etapa')) && !(await visivel(S, '#tab-todos')) && !(await visivel(S, '#tab-usu')), 'só o botão + Novo R1 (nada de Novo R2, importar, filtro de etapa, Todos nem Usuários)');
  ok((await visivel(S, '#ajuda-r1')) && !(await visivel(S, '#ajuda-r2')), 'a ajuda é a do R1');
  await S.ate("/Nenhum R1 ainda/.test(document.querySelector('#lista').textContent)", 8000);
  ok(/Nenhum R1 ainda/.test(await txt(S, '#lista')), 'a lista vazia diz "Nenhum R1 ainda"');
  await S.avalia("location.hash = '#/novo'; 1");
  await S.ate("!document.querySelector('#v-editor').hidden");
  ok((await txt(S, '#ed-titulo')) === 'Novo R1' && (await txt(S, '#ed-salvar')) === 'Salvar rascunho' && (await txt(S, '#bt-gerar-link')) === 'Gerar link do R1' && (await txt(S, '#ed-voltar')) === '← Meus R1', '#/novo pro SDR abre o editor do R1 (Novo R1, Salvar rascunho e, no fim, Gerar link do R1)');
  // desde 18/10/2026 o R1 também guarda pé, altura, categoria e onde joga (e as peneiras); o vídeo analisado e as oportunidades são só do R2
  const ocultos = ['#nt-bloco', '#f-editor [name=apelido]', '#f-editor [name=sonho]', '#f-editor [name=plano]', '#f-editor [name=gerente]', '#f-editor [name=prazoContato]', '#f-editor [name=prazoZyron]', '#s-leitura', '#selo-pos', '#s-video', '#s-oportunidades'];
  const vis = [];
  for (const sel of ocultos) if (await visivel(S, sel)) vis.push(sel);
  ok(!vis.length, 'o formulário do R1 esconde o que é só do R2 (nome na tela, apelido, sonho, plano, gerente, prazos, leitura, vídeo analisado e oportunidades)' + (vis.length ? ': aparecem ' + vis.join(', ') : ''));
  const mostra = [];
  for (const sel of ['#f-editor [name=nome]', '#f-editor [name=posicao]', '#f-editor [name=idade]', '#f-editor [name=cidade]', '#f-editor [name=origem]', '#f-editor [name=caracteristicas]', '#f-editor [name=experiencia]', '#f-editor [name=r2data]', '#f-editor [name=r2hm]', '#c-conferido', '#f-editor [name=pe]', '#f-editor [name=altura]', '#f-editor [name=categoria]', '#f-editor [name=clubeAtual]', '#f-editor [name=peneirasFeitas]', '#bt-gerar-link']) if (!(await visivel(S, sel))) mostra.push(sel);
  ok(!mostra.length, 'e mostra o que o R1 usa (nome, posição, idade, cidade, origem, o que chamou atenção, experiência, dia e hora da R2, nome conferido)' + (mostra.length ? ': faltam ' + mostra.join(', ') : ''));
  ok((await txt(S, '#s-versao > h2')) === 'Variação do R1' && (await txt(S, '#call-titulo')) === 'A R2 marcada', 'os títulos falam do R1 ("Variação do R1", "A R2 marcada")');
  const radios = await S.avalia("Array.from(document.querySelectorAll('#versoes input[name=versao]')).map(i => i.value).join()");
  ok(radios === 'r1-principal', 'a variação do R1: só a do R1 (r1-principal), marcada de partida (' + radios + ')');
  await tela(S, 'etapas-1-sdr-novo-r1.png');
  await preenche(S, 'nome', 'Lucas Almeida da Silva'); await preenche(S, 'posicao', 'volante'); await preenche(S, 'idade', '15'); await preenche(S, 'cidade', 'Natal');
  await preenche(S, 'r2data', hoje); await preenche(S, 'r2hm', '19:30');
  await S.avalia("document.querySelector('#c-conferido').click(); 1");
  const lis = await S.avalia("Array.from(document.querySelectorAll('#checklist li')).slice(0, 3).map(l => l.classList.contains('ok')).join()");
  ok((await S.avalia("document.querySelectorAll('#checklist li').length")) === 4 && lis === 'true,true,true', 'o checklist do R1 tem 3 itens (nome conferido, a ficha do slide 02, dia e hora da R2), todos feitos');
  await S.avalia("document.querySelector('#bt-gerar-link').click(); 1");
  ok(await S.ate("/R1 pronto/.test(document.querySelector('#aviso').textContent) && /#\\/r2\\/[a-z2-7]{26}/.test(location.hash)", 10000), 'Gerar link do R1 cria o R1 já com o link (aviso "R1 pronto") e abre o editor dele');
  await S.ate("document.querySelector('#ed-estado').textContent === 'Pronto' && !document.querySelector('#pv-fora').hidden", 10000); // o aviso sai antes de o salvar do nome conferido terminar
  const link = await S.avalia("document.querySelector('#lk-url').value");
  ok(link.startsWith(s.decks.r1 + '/?a=') && (await txt(S, '#lk-abrir')) === 'Abrir o R1' && (await txt(S, '#ed-estado')) === 'Pronto', 'o link é o do deck do R1, o botão diz "Abrir o R1" e a etiqueta é Pronto');
  ok(!(await visivel(S, '#pv')) && (await visivel(S, '#pv-fora')) && /Abrir o R1 em outra aba/.test(await txt(S, '#pv-fora')) && !(await visivel(S, '#s-leitura')), 'sem prévia no quadro: o R1 abre em outra aba (botão "Abrir o R1 em outra aba"), e sem Leitura do atleta');
  await tela(S, 'etapas-2-sdr-r1-criado.png');
  await S.avalia("location.hash = '#/'; 1");
  await S.ate("document.querySelectorAll('#lista .item').length === 1");
  ok(/Abrir o R1/.test(await txt(S, '#lista')) && !/Sem plano/.test(await txt(S, '#lista')), 'na lista, o botão é "Abrir o R1" e o card não fala de plano');

  /* ---------------- B. o closer ---------------- */
  console.log('\nB. o closer vê o R2 e importa o R1 do SDR');
  const C = await navC.aba(s.painel + '/', { largura: 1500, altura: 1100 });
  ok(await entra(C, 'carla.closer', SENHA), 'o closer entra');
  ok((await txt(C, '#marca-sub')) === 'Jogador de Elite · R2' && (await txt(C, '#tab-meus')) === 'Meus R2' && (await visivel(C, '#bt-novo')) && !(await visivel(C, '#bt-novo-r1')) && (await visivel(C, '#bt-importar')) && !(await visivel(C, '#filtro-etapa')), 'tudo do R2 (Meus R2, Novo R2, importar); nada de R1');
  await C.avalia("document.querySelector('#bt-importar').click(); 1");
  await C.ate("document.querySelector('#d-importar').open");
  ok(/Importar o R1 de um SDR/.test(await txt(C, '#di-titulo')), 'o diálogo de importar fala do R1 de um SDR');
  await C.avalia(`(() => { const i = document.querySelector('#di-link'); i.value = ${JSON.stringify(link)}; return 1; })()`);
  await C.avalia("document.querySelector('#di-ir').click(); 1");
  ok(await C.ate("!document.querySelector('#v-editor').hidden && document.querySelector('#f-editor [name=nome]').value === 'Lucas Almeida da Silva'", 10000), 'o closer cola o link do R1 do SDR e o editor do R2 abre com a ficha (nome)');
  ok((await C.avalia("document.querySelector('#f-editor [name=posicao]').value")) === 'volante' && (await C.avalia("document.querySelector('#f-editor [name=idade]').value")) === '15' && (await C.avalia("document.querySelector('#f-editor [name=cidade]').value")) === 'Natal' && (await C.avalia("document.querySelector('#f-editor [name=r2data]').value")) === hoje, 'com posição, idade, cidade e o dia da R2 que o SDR preencheu');
  ok((await txt(C, '#ed-titulo')) !== 'Novo R1' && (await visivel(C, '#s-foto')) && (await visivel(C, '#f-editor [name=plano]')), 'e é um R2 (foto e plano no formulário)');
  const radiosC = await C.avalia("Array.from(document.querySelectorAll('#versoes input[name=versao]')).map(i => i.value).join()");
  ok(radiosC.split(',').sort().join(',') === IDS_R2.slice().sort().join(','), 'o closer escolhe entre as páginas dos manifestos dos 3 decks do R2: ' + radiosC);
  ok((await C.avalia("document.querySelectorAll('#versoes .chip.deck').length")) === IDS_R2.length, 'cada variação mostra de que deck é');
  await C.avalia("document.querySelector('#versoes input[value=r2a-principal]').click(); 1");
  await espera(300);
  // desde 18/10/2026 o R2 anterior segue o Nome na tela e o apelido, como o R2 novo (antes mostrava só o primeiro nome)
  ok((await visivel(C, '#nt-bloco')) && (await visivel(C, '#foto-tela-bloco')) && !(await visivel(C, '#lead-nota')), 'numa variação do R2 anterior: o Nome na tela e a foto aparecem, como no R2 novo');
  ok(!(await visivel(C, '#opcionais')), '(e os slides opcionais, que esse deck não tem)');
  ok((await visivel(C, '#apelido-bloco')) && (await C.avalia("document.querySelector('#f-editor [name=apelido]').placeholder")) === 'Lucas Silva', '(e o campo "Como a gente chama ele", com o nome e o último sobrenome)');
  ok((await C.avalia("document.querySelectorAll('#checklist li').length")) === 6 && !/Prévia olhada/.test(await txt(C, '#checklist')), '(e o checklist tem 5 itens e a nota, sem "Prévia olhada": o R2 anterior abre em outra aba)');
  await tela(C, 'etapas-3-closer-r2-anterior.png');
  await C.avalia("document.querySelector('#versoes input[value=r2b-principal]').click(); 1");
  await espera(300);
  ok((await visivel(C, '#apelido-bloco')) && (await C.avalia("document.querySelector('#f-editor [name=apelido]').placeholder")) === 'Lucas Almeida' && /do jeito do deck/.test(await txt(C, '#apelido-ajuda')) && !(await visivel(C, '#nt-bloco')),
    'numa variação do R2 B o campo "Como a gente chama ele" aparece, com o nome do jeito do deck (Lucas Almeida) e sem a escolha Nome na tela');
  await C.avalia("document.querySelector('#versoes input[value=principal]').click(); 1");
  await espera(300);
  ok((await visivel(C, '#nt-bloco')) && (await visivel(C, '#foto-tela-bloco')), 'voltando pra Principal do R2 novo, o Nome na tela e a foto voltam');
  ok((await visivel(C, '#apelido-bloco')) && (await C.avalia("document.querySelector('#f-editor [name=apelido]').placeholder")) === 'Lucas Silva' && /da escolha acima/.test(await txt(C, '#apelido-ajuda')), '... e o campo "Como a gente chama ele" volta com o nome e o último sobrenome (Lucas Silva) e a ajuda de antes');
  ok((await C.avalia("document.querySelectorAll('#checklist li').length")) === 7 && /Prévia olhada/.test(await txt(C, '#checklist')), '... e o checklist volta a ter 6 itens com a "Prévia olhada"');

  /* ---------------- C. o admin ---------------- */
  console.log('\nC. o admin vê as duas etapas');
  const A = await navA.aba(s.painel + '/#/versoes', { largura: 1500, altura: 1300 });
  ok(await entra(A, s.adminLogin, s.adminSenha), 'o admin entra');
  const naoOculto = (aba, sel) => aba.avalia(`!document.querySelector(${JSON.stringify(sel)}).hidden`);
  ok((await txt(A, '#marca-sub')) === 'Jogador de Elite · R1 e R2' && (await txt(A, '#tab-meus')) === 'Meus leads' && (await txt(A, '#tab-versoes')) === 'Variações' && (await naoOculto(A, '#bt-novo')) && (await naoOculto(A, '#bt-novo-r1')) && (await naoOculto(A, '#ver-etapa')) && (await naoOculto(A, '#filtro-etapa')), 'topo e abas das duas etapas, com os dois botões de novo e os seletores de etapa');
  await A.ate("document.querySelectorAll('#versoes-lista .versao-card').length > 0");
  ok((await txt(A, '#vr-titulo')) === 'Variações do R2' && (await A.avalia("document.querySelectorAll('#versoes-lista .versao-card').length")) === IDS_R2.length, 'a aba Variações abre no R2, com as páginas dos 3 decks');
  const faixa = await txt(A, '#sinc-texto');
  ok(/Sincronizado com os decks/.test(faixa) && faixa.includes(IDS_R2.length + ' páginas') && /todas funcionando/.test(faixa)
    && [['r2', 'R2 novo'], ['r2-anterior', 'R2 anterior'], ['r2-b', 'R2 B']].every(([id, nome]) => faixa.includes(nome + ': ' + PAGINAS_R2[id].length + ' páginas')),
    'a faixa lista os 3 decks do R2 com as contagens dos manifestos, todos funcionando (' + faixa + ')');
  await tela(A, 'etapas-4-admin-variacoes-r2.png');
  const cardAnt = await txt(A, '#versoes-lista [data-v=r2a-principal]');
  ok(/R2 anterior/.test(cardAnt) && /foto no slide de escolha/.test(cardAnt) && !/Slides que dá pra tirar/.test(cardAnt), 'o cartão do R2 anterior diz de que deck é e o que ele faz com o nome e a foto, sem slide opcional');
  const ajAnt = await A.avalia("(() => { const d = document.querySelector('#versoes-lista details[data-v=r2a-principal]'); return { nome: d.querySelector('[data-aj=nome]').disabled, foto: d.querySelector('[data-aj=foto]').disabled }; })()");
  ok(ajAnt.nome === false && ajAnt.foto === false, 'nos ajustes do admin, o nome e a foto ficam livres no R2 anterior (segue o Nome na tela desde 18/10/2026)');
  const exemplo = await A.avalia("document.querySelector('#versoes-lista [data-v=r2a-principal] a[href^=http]').href");
  ok(exemplo === s.decks['r2-anterior'] + '/', '"Abrir exemplo" abre o deck da variação (o do R2 anterior)');
  await A.avalia("document.querySelector('#ver-etapa [data-etapa=r1]').click(); 1");
  await espera(300);
  ok((await txt(A, '#vr-titulo')) === 'Variações do R1' && (await A.avalia("document.querySelectorAll('#versoes-lista .versao-card').length")) === 1 && /R1: 1 página/.test(await txt(A, '#sinc-texto')) === false, 'trocando pra R1: 1 variação (a do R1)');
  ok(/Sincronizado com o deck/.test(await txt(A, '#sinc-texto')) && /1 página/.test(await txt(A, '#sinc-texto')) && /A cada lead, o SDR escolhe/.test(await txt(A, '#aba-versoes .painel > p.nota')), 'a faixa fala de um deck só e o texto de cima é o do SDR');
  ok(!/Nome e foto do lead na tela/.test(await txt(A, '#versoes-lista')), '(e o quadro "Nome e foto do lead na tela" é só do R2)');
  await tela(A, 'etapas-5-admin-variacoes-r1.png');
  await A.avalia("document.querySelector('#bt-nova-variacao').click(); 1");
  await A.ate("document.querySelector('#d-variacao').open");
  const bases = await A.avalia("Array.from(document.querySelectorAll('#dv-base option')).map(o => o.value).join()");
  ok(bases === 'r1-principal', 'nova variação com o R1 na tela: a base é só a página do R1 (' + bases + ')');
  ok((await A.avalia("document.querySelector('#dv-lead-nome').disabled")) === true && (await A.avalia("document.querySelector('#dv-lead-foto').disabled")) === false, 'e o nome e a foto ficam travados (o deck do R1 não segue essas escolhas)');
  await A.avalia("document.querySelector('#dv-nome').value = 'R1 de novembro'; document.querySelector('#dv-ir').click(); 1");
  ok(await A.ate("/Variação criada/.test(document.querySelector('#aviso').textContent)", 8000) && (await A.avalia("document.querySelectorAll('#versoes-lista .versao-card').length")) === 2, 'o admin cria uma variação do R1 e ela aparece na aba');
  await A.avalia("document.querySelector('#ver-etapa [data-etapa=r2]').click(); document.querySelector('#bt-nova-variacao').click(); 1");
  await A.ate("document.querySelector('#d-variacao').open");
  const bases2 = await A.avalia("Array.from(document.querySelectorAll('#dv-base option')).map(o => o.textContent.trim()).join('|')");
  ok(Object.entries(PAGINAS_R2).every(([id, ps]) => ps.every(p => bases2.includes(p.nome))) && /R2 novo/.test(bases2) && /R2 anterior/.test(bases2) && /R2 B/.test(bases2) && !/R1/.test(bases2), 'nova variação com o R2 na tela: as páginas dos 3 decks do R2, cada uma com o nome do deck');
  await A.avalia("document.querySelector('#dv-cancelar').click(); 1");
  // a lista de todos, com os dois R1 e o R2 e o filtro de etapa
  await A.avalia("location.hash = '#/todos'; 1");
  await A.ate("document.querySelectorAll('#lista .item').length >= 2");
  ok((await visivel(A, '#filtro-etapa')) && (await A.avalia("document.querySelectorAll('#lista .item .chip.r1').length")) >= 1, 'a lista do admin traz os leads das duas etapas, cada um com o chip da etapa');
  await A.avalia("document.querySelector('#filtro-etapa [data-etapa=r2]').click(); 1");
  await espera(200);
  ok((await A.avalia("document.querySelectorAll('#lista .item .chip.r1').length")) === 0, 'o filtro R2 tira os R1');
  // novo R1 pelo admin
  await A.avalia("location.hash = '#/novo-r1'; 1");
  await A.ate("!document.querySelector('#v-editor').hidden");
  ok((await txt(A, '#ed-titulo')) === 'Novo R1' && (await visivel(A, '#s-foto')), 'o admin abre um Novo R1 pelo botão dele (#/novo-r1)');
  // usuários
  await A.avalia("location.hash = '#/usuarios'; 1");
  await A.ate("!document.querySelector('#aba-usuarios').hidden");
  const papeis = await A.avalia("Array.from(document.querySelectorAll('#f-usuario [name=papel] option')).map(o => o.value).join()");
  ok(papeis === 'sdr,closer,admin', 'o admin cria usuário SDR, closer ou admin (' + papeis + ')');
  await A.ate("document.querySelectorAll('#usuarios tr').length >= 2");
  ok(/SDR \(R1\)/.test(await txt(A, '#usuarios')), 'e a lista mostra o papel SDR (R1)');
  await tela(A, 'etapas-6-admin-usuarios.png');

  const exc = [S, C, A].flatMap(a => a.console_.filter(m => /^EXC/.test(m)));
  ok(!exc.length, 'nenhuma exceção de JavaScript no painel' + (exc.length ? ': ' + exc.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await navS.fecha(); await navC.fecha(); await navA.fecha(); await s.fecha();
}
fim();
