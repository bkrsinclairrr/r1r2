// Os decks de verdade falando com o painel de verdade (tudo local): o R1 e o R2 anterior leem o lead do painel novo pelo endereço de antes
// (/api/publico), o R2 novo (entrada do R2) leva o lead pra variação escolhida mesmo quando ela é de outro deck, e nenhum deck sai da lista de
// origens fixas, e os links que o painel de antes já mandou pras famílias seguem abrindo (o R1 e o R2 anterior perguntam ao painel de antes
// quando o novo responde 404 pra um código que não é do formato dele). Abre cada deck no Chrome: nome, ficha do R1, redirecionamentos, a volta,
// a defesa e o painel de antes.
// Uso: node testes/teste-decks.mjs
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZES } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const { ok, fim } = verificador('Decks e painel');
const s = await sobe({ deck: true, decks: ['r2-anterior', 'r2-b', 'r1'] });
const nav = await abreNavegador();
try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  const SENHA = 'senha-boa-123456';
  const cria = async (login, nome, papel) => { await admin.post('/api/usuarios', { login, nome, papel, senha: SENHA }); const c = new Cliente(s.painel); await c.entra(login, SENHA); return c; };
  const rafa = await cria('rafa.sdr', 'Rafa SDR', 'sdr'), carla = await cria('carla.closer', 'Carla Closer', 'closer');
  const hoje = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
  const R1 = s.decks.r1, R2 = s.decks.r2, ANT = s.decks['r2-anterior'], B = s.decks['r2-b'];
  // entre parênteses: o || solto, colado com && e === nas esperas, faria a espera passar com qualquer texto (a tela mostra "atleta" antes de o lead chegar)
  const NOME = "(Array.from(document.querySelectorAll('[data-bind=\"nome\"]')).map(e => e.textContent.trim()).filter(Boolean)[0] || '')";
  const bind = nome => `(Array.from(document.querySelectorAll('[data-bind="${nome}"]')).map(e => e.textContent.trim()).filter(Boolean)[0] || '')`;
  const excecoes = [];
  const fechaAba = async a => { excecoes.push(...a.console_.filter(m => /^EXC/.test(m))); await Promise.race([a.envia('Page.close').catch(() => {}), espera(1500)]); };
  const abre = async (url, ate, ms = 25000) => {
    const a = await nav.aba(url, { largura: 1920, altura: 1080 });
    const bom = await a.ate(ate, ms);
    return { a, bom };
  };
  const novoR2 = async (extra, cli = carla) => {
    const r = await cli.post('/api/atletas', { ficha: Object.assign({ nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: 'Assessoria PRO', r2data: hoje, r2hm: '19:30' }, extra) });
    if (r.status !== 201) throw new Error('não criou: ' + r.status + ' ' + r.texto);
    return r.j.t;
  };

  /* ---------------- A. o R1 (o deck de entrada do R1, que lê pelo endereço de antes) ---------------- */
  console.log('\nA. o R1 do SDR no deck do R1');
  const r1 = await rafa.post('/api/atletas', { ficha: { nome: 'Lucas Almeida da Silva', posicao: 'volante', idade: '15', cidade: 'Natal', r2data: hoje, r2hm: '19:30' } });
  const tR1 = r1.j.t;
  ok(r1.j.link === R1 + '/?a=' + tR1, 'o link do R1 sai do deck do R1');
  let { a: A, bom } = await abre(r1.j.link, NOME + " === 'Lucas'");
  ok(bom, 'o deck do R1 abre o link e mostra o primeiro nome do lead (Lucas), que veio do painel novo');
  ok(await A.avalia("document.querySelector('[data-bind=selecaoPerfil]').textContent.includes('volante · 15 anos · Natal')"), 'a ficha do atleta (slide 02): posição, idade e cidade');
  ok((await A.avalia('location.origin')) === R1 && (await A.avalia('location.pathname')) === '/', 'e fica no deck do R1 (a variação é a principal dele)');
  const ficha1 = JSON.parse(await A.avalia("localStorage.getItem('je-r1-ficha-" + tR1 + "')"));
  ok(ficha1._a === tR1 && ficha1.nome === 'Lucas Almeida da Silva' && ficha1.r2dia && ficha1.r2hora === '19h30', 'a ficha guardada tem o dia e a hora da R2 (r2dia, r2hora), como o deck espera');
  await fechaAba(A);
  // o R1 com uma variação criada pelo admin em cima da principal: a mesma página
  const cv = await admin.post('/api/versoes', { nome: 'R1 curto', base: 'r1-principal' });
  const tCr = (await rafa.post('/api/atletas', { ficha: { nome: 'Pedro Costa', posicao: 'meia', idade: '14', cidade: 'Natal', versao: cv.j.criada } })).j.t;
  ({ a: A, bom } = await abre(R1 + '/?a=' + tCr, NOME + " === 'Pedro'"));
  ok(bom && (await A.avalia('location.origin')) === R1, 'uma variação criada em cima da página do R1 abre a mesma página, com o lead');
  await fechaAba(A);

  /* ---------------- B. o R2 novo, o deck de entrada do R2 ---------------- */
  console.log('\nB. o R2 no deck de entrada');
  const tP = await novoR2({});
  ({ a: A, bom } = await abre(R2 + '/?a=' + tP + '#1', NOME + " === 'Lucas Silva'"));
  ok(bom && (await A.avalia('location.origin')) === R2 && (await A.avalia('location.pathname')) === '/', 'a Principal do R2 novo: o lead aparece (Lucas Silva) e fica nela');
  await fechaAba(A);
  const tT = await novoR2({ versao: 'tecnica' });
  ({ a: A, bom } = await abre(R2 + '/?a=' + tT + '#2', "location.pathname === '/variacoes/tecnica/'"));
  ok(bom && (await A.avalia('location.origin')) === R2 && (await A.avalia('location.search')) === '?a=' + tT && (await A.avalia('location.hash')) === '#2', 'a Técnica do R2 novo (mesmo deck): vai pra página dela, com o mesmo código e o mesmo slide');
  await fechaAba(A);

  /* ---------------- C. o R2 numa variação de outro deck: o deck de entrada leva o lead ---------------- */
  console.log('\nC. a variação é de outro deck: o deck de entrada leva o lead');
  const tAp = await novoR2({ versao: 'r2a-principal' });
  ({ a: A, bom } = await abre(R2 + '/?a=' + tAp + '#3', "location.origin === " + JSON.stringify(ANT) + " && " + NOME + " === 'Lucas Silva'"));
  ok(bom, 'R2 na Principal do R2 anterior: o link do deck de entrada leva pro deck do R2 anterior, que carrega o lead pelo endereço de antes (nome e sobrenome: Lucas Silva)');
  ok((await A.avalia('location.pathname')) === '/' && (await A.avalia('location.search')) === '?a=' + tAp && (await A.avalia('location.hash')) === '#3', 'com o mesmo código e o mesmo slide');
  ok(/Lucas/.test(await A.avalia(NOME)), 'o R2 anterior mostra o nome do lead (' + await A.avalia(NOME) + ')');
  ok(JSON.parse(await A.avalia("localStorage.getItem('je-r2-ficha:" + tAp + "') || localStorage.getItem('je-r2-ficha-" + tAp + "') || 'null'")) !== null, 'e guardou a ficha dele neste navegador');
  await fechaAba(A);
  const tAt = await novoR2({ versao: 'r2a-tecnica' });
  ({ a: A, bom } = await abre(R2 + '/?a=' + tAt, "location.origin === " + JSON.stringify(ANT) + " && location.pathname === '/variacoes/tecnica/' && " + NOME + " === 'Lucas Silva'"));
  ok(bom, 'R2 na Técnica do R2 anterior: vai pra página técnica do deck dele');
  await fechaAba(A);
  const tBp = await novoR2({ versao: 'r2b-principal' });
  ({ a: A, bom } = await abre(R2 + '/?a=' + tBp, "location.origin === " + JSON.stringify(B) + " && " + NOME + " === 'Lucas Almeida'"));
  ok(bom, 'R2 na Principal do R2 B: vai pro deck B, que diz nome e primeiro sobrenome (Lucas Almeida)');
  await fechaAba(A);

  /* ---------------- D. trocar a variação no painel muda pra onde o mesmo link leva ---------------- */
  console.log('\nD. trocar a variação, com o mesmo link');
  const fichaDe = async t => (await carla.get('/api/atletas?t=' + t)).j.registro;
  const reg = await fichaDe(tP);
  const troca = await carla.put('/api/atletas?t=' + tP, { ficha: Object.assign({}, reg.ficha, { versao: 'r2a-principal' }), base: reg.fichaEm });
  ok(troca.status === 200 && troca.j.registro.ficha.versao === 'r2a-principal', 'a closer troca a variação do R2 pra Principal do R2 anterior (o link é o mesmo)');
  ({ a: A, bom } = await abre(R2 + '/?a=' + tP, "location.origin === " + JSON.stringify(ANT) + " && " + NOME + " === 'Lucas Silva'"));
  ok(bom, 'o mesmo link do deck de entrada agora leva pro deck do R2 anterior');
  // abrir de novo no mesmo navegador: o destino guardado leva direto, sem passar pela página de antes
  await A.vai(R2 + '/?a=' + tP);
  ok(await A.ate("location.origin === " + JSON.stringify(ANT), 20000), 'e na volta (ficha guardada) vai direto');
  await fechaAba(A);
  const reg2 = await fichaDe(tP);
  await carla.put('/api/atletas?t=' + tP, { ficha: Object.assign({}, reg2.ficha, { versao: 'principal' }), base: reg2.fichaEm });
  delete reg2.ficha.versao;
  ({ a: A, bom } = await abre(R2 + '/?a=' + tP, "location.origin === " + JSON.stringify(R2) + " && location.pathname === '/' && " + NOME + " === 'Lucas Silva'"));
  ok(bom, 'voltando pra Principal do R2 novo, o mesmo link volta pro R2 novo');
  await fechaAba(A);

  /* ---------------- E. o deck de entrada só vai pras origens da lista ---------------- */
  console.log('\nE. a defesa: nenhuma origem fora da lista');
  const stub = resp => `(() => { const f = window.fetch; window.fetch = function (u, o) { if (/\\/api\\/(r2|publico)/.test(String(u))) return Promise.resolve(new Response(${JSON.stringify(JSON.stringify(resp))}, { status: 200, headers: { 'Content-Type': 'application/json' } })); return f.apply(this, arguments); }; })();`;
  const defesa = async (rotulo, entrada, resp, esperaNome) => {
    const a = await nav.aba('about:blank', { largura: 1920, altura: 1080 });
    await a.envia('Page.addScriptToEvaluateOnNewDocument', { source: stub(resp) });
    await a.vai(entrada);
    const noMesmo = await a.ate(esperaNome, 20000);
    await espera(1500);
    const aqui = await a.avalia('location.origin');
    ok(aqui === new URL(entrada).origin && noMesmo, rotulo + ' (ficou em ' + aqui + ')');
    await fechaAba(a);
  };
  const fichaOk = { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: 'Assessoria PRO' };
  const codigo = 'a'.repeat(26);
  await defesa('o deck do R2 não segue uma origem fora da lista', R2 + '/?a=' + codigo, { estado: 'ok', t: codigo, versao: { id: 'x', caminho: '/', origem: 'https://evil.example' }, ficha: fichaOk }, NOME + " === 'Lucas Silva'");
  await defesa('nem uma origem parecida com a de um deck (https://jogador-de-elite-r1.vercel.app.evil.example)', R2 + '/?a=' + codigo, { estado: 'ok', t: codigo, versao: { id: 'x', caminho: '/', origem: 'https://jogador-de-elite-r1.vercel.app.evil.example' }, ficha: fichaOk }, NOME + " === 'Lucas Silva'");
  await defesa('nem um caminho que não é de página do deck (//evil.example/)', R2 + '/?a=' + codigo, { estado: 'ok', t: codigo, versao: { id: 'x', caminho: '//evil.example/', origem: R2 }, ficha: fichaOk }, NOME + " === 'Lucas Silva'");
  await defesa('o deck do R1 também não segue uma origem fora da lista', R1 + '/?a=' + codigo, { id: codigo, ficha: { nome: 'Lucas Almeida da Silva' }, versao: { id: 'x', caminho: '/', origem: 'https://evil.example' } }, NOME + " === 'Lucas'");
  await defesa('nem um caminho fora do formato no R1 (/../admin)', R1 + '/?a=' + codigo, { id: codigo, ficha: { nome: 'Lucas Almeida da Silva' }, versao: { id: 'x', caminho: '/../admin', origem: R1 } }, NOME + " === 'Lucas'");

  /* ---------------- F. os links que o painel de antes já mandou seguem abrindo ---------------- */
  console.log('\nF. leads do painel de antes: os links já enviados seguem abrindo');
  const antigo = s.painelAntigo;
  const aguarda = async (cond, ms = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (cond()) return true; await espera(150); } return cond(); };
  const prontoSlide = "document.querySelectorAll('#stage > .slide.active').length === 1";
  const idJoao = 'joao-pereira-k7m2p3xa', idMaria = 'maria-souza-q4w8e2rt'; // o formato de antes: nome-8letras
  antigo.leads[idJoao] = { ficha: { nome: 'João Pereira', posicao: 'meia', idade: '14', cidade: 'Recife' } };
  antigo.leads[idMaria] = { ficha: { nome: 'Maria Souza', posicao: 'volante', plano: 'Assessoria PRO' }, video: { ok: true, duracaoS: 30, temPoster: true } };
  antigo.pedidos.length = 0;
  ({ a: A, bom } = await abre(R1 + '/?a=' + idJoao, NOME + " === 'João'"));
  ok(bom, 'o deck do R1 abre o link de um lead do painel de antes: o painel novo responde 404 e o deck pergunta ao de antes (João)');
  ok((await A.avalia(bind('selecaoPerfil'))).includes('meia · 14 anos · Recife'), 'com a ficha dele (posição, idade e cidade)');
  ok(antigo.pedidos.includes('GET /api/publico?id=' + idJoao), 'e o pedido foi ao painel de antes, no endereço de sempre (/api/publico?id=)');
  await fechaAba(A);
  ({ a: A, bom } = await abre(ANT + '/?a=' + idMaria, NOME + " === 'Maria Souza'"));
  ok(bom, 'o deck do R2 anterior também (Maria)');
  ok(await aguarda(() => antigo.pedidos.some(p => p.startsWith('GET /api/video?id=' + idMaria))), 'e o vídeo dela é pedido ao painel de antes, de onde veio o lead');
  await fechaAba(A);
  // o lead do painel novo nunca é perguntado ao painel de antes (confere o código dele nos pedidos, não o total: um pedido de vídeo atrasado de uma
  // aba anterior, ainda fechando, não pode contar)
  const pediuAoAntigo = id => antigo.pedidos.some(p => p.includes('id=' + id));
  ({ a: A, bom } = await abre(R1 + '/?a=' + tR1, NOME + " === 'Lucas'"));
  await espera(1200);
  ok(bom && !pediuAoAntigo(tR1), 'um lead do painel novo abre sem nenhum pedido ao painel de antes');
  await fechaAba(A);
  // um código no formato do painel novo que ele não conhece (link inventado, revogado ou vencido) também não vai ao painel de antes
  const falsoNovo = 'a'.repeat(26);
  ({ a: A, bom } = await abre(R1 + '/?a=' + falsoNovo, prontoSlide));
  await espera(1500);
  ok(bom && !pediuAoAntigo(falsoNovo), 'um código no formato do painel novo que ele não conhece não é perguntado ao painel de antes');
  await fechaAba(A);
  // um código que nenhum dos dois conhece: o deck pergunta aos dois e mostra o aviso de link inativo (desde 18/10/2026, como o R2 novo; antes
  // seguia com a ficha deste navegador)
  const inativo = "(document.querySelector('#je-inativo')||{}).textContent === 'Este link não está mais ativo. Fale com o seu gestor de carreiras.'";
  ({ a: A, bom } = await abre(R1 + '/?a=fantasma-zzzzzzzz', inativo));
  ok(bom && await aguarda(() => antigo.pedidos.includes('GET /api/publico?id=fantasma-zzzzzzzz')), 'um código de antes que nenhum painel conhece: o deck do R1 pergunta aos dois e mostra o aviso de link inativo');
  await fechaAba(A);
  ({ a: A, bom } = await abre(ANT + '/?a=fantasma-zzzzzzzz', inativo));
  ok(bom, '... e o do R2 anterior também');
  await fechaAba(A);

  /* ---------------- G. o que os arquivos dos decks dizem ---------------- */
  console.log('\nG. os arquivos dos decks');
  const lerDeck = (id, rel) => fs.readFileSync(path.join(RAIZES[id], ...rel.split('/')), 'utf8');
  ok(['r1', 'r2-anterior'].every(id => {
    const js = lerDeck(id, 'assets/deck.js');
    return /const PAINEL = 'https:\/\/jogador-de-elite-closer\.vercel\.app';/.test(js) && /const PAINEL_DE_ANTES = 'https:\/\/jogador-de-elite-painel\.vercel\.app';/.test(js)
      && /e\.message === '404' && !CODIGO_NOVO\.test\(AID\) \? buscaLead\(PAINEL_DE_ANTES\)/.test(js) && (js.match(/jogador-de-elite-painel\.vercel\.app/g) || []).length === 1;
  }), 'o R1 e o R2 anterior leem do painel novo e só perguntam ao de antes (um endereço fixo) quando o novo diz 404 pra um código que não é do formato dele');
  ok(['r1', 'r2-anterior', 'r2-b', 'r2'].every(id => { const j = JSON.parse(lerDeck(id, 'vercel.json')); return j.redirects[0].destination === 'https://jogador-de-elite-closer.vercel.app/' && j.headers.some(h => h.source === '/variacoes.json' && h.headers.some(x => x.key === 'Cache-Control' && x.value === 'no-cache')); }), 'o /admin de cada deck vai pro painel novo e o variacoes.json sai sem cache');
  ok(['r1', 'r2-anterior', 'r2-b', 'r2'].every(id => /gera-manifesto\.mjs/.test(lerDeck(id, '.vercelignore'))), 'o gerador do variacoes.json não vai pro ar');
  ok(['r1', 'r2'].every(id => (lerDeck(id, 'assets/deck.js').match(/DECKS_OK = \[([^\]]*)\]/) || ['', ''])[1].split(',').length === 4), 'os dois decks de entrada têm a lista fixa de 4 origens');

  ok(!excecoes.length, 'nenhuma exceção de JavaScript em nenhum deck' + (excecoes.length ? ': ' + excecoes.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha();
  await s.fecha();
}
fim();
