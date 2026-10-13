// As telas da sincronização com o deck: a faixa no alto da aba Variações do R2 (quando o painel falou com o deck, quantas páginas, se
// alguma está com problema), os selos de cada variação (funcionando, nova, conferindo, com problema, saiu do deck), o botão "Gerar
// apresentação pra um lead" desabilitado quando a página está quebrada, o seletor do editor, e o botão "Sincronizar agora" do admin.
// Dirige o painel de verdade (Chrome sem janela) contra um deck de mentira que o teste controla.
// Uso: node testes/teste-sincronizacao-telas.mjs [--telas <pasta>]   (com --telas, guarda as capturas de tela na pasta)
import fs from 'node:fs';
import path from 'node:path';
import { sobe } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';
import { sobeDeck, paginaFalsa } from './_deck-falso.mjs';

const { ok, fim } = verificador('Telas da sincronização');
const iT = process.argv.indexOf('--telas');
const PASTA = iT > 0 ? path.resolve(process.argv[iT + 1]) : '';
if (PASTA) fs.mkdirSync(PASTA, { recursive: true });

const deck = await sobeDeck();
const s = await sobe({ deck: false, deckExterno: deck.url });
const nav = await abreNavegador(), nav2 = await abreNavegador();
try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  const SENHA = 'senha-da-carla-123';
  await admin.post('/api/usuarios', { login: 'carla.closer', nome: 'Carla Closer', papel: 'closer', senha: SENHA });
  const carla = new Cliente(s.painel); await carla.entra('carla.closer', SENHA);
  const sinc = () => admin.post('/api/versoes?acao=sincronizar', {});
  const base = { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: 'Assessoria PRO', r2data: new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10), r2hm: '19:30' };
  const criaR2 = async (extra, cli = carla) => { // o R2 é de quem criou: a closer só abre os dela
    const r = await cli.post('/api/atletas', { ficha: Object.assign({}, base, extra) });
    if (r.status !== 201) throw new Error('não criou o R2: ' + r.status + ' ' + r.texto);
    return r.j.t;
  };

  // o deck: as duas páginas de sempre e uma nova, "Lead quente"
  const rapida = paginaFalsa('rapida', 5, { nome: 'Lead quente', resumo: 'Vai direto ao plano.', quando: 'Já conversou com o estrategista.', validacao: 'validada', lead: { nome: true, foto: false } });
  deck.poe(rapida.caminho, { corpo: rapida.html });
  deck.publica([rapida]);
  await sinc();
  const tRapida = await criaR2({ versao: 'rapida' });

  const entra = async (aba, login, senha) => {
    await aba.ate("!document.querySelector('#v-entrar').hidden");
    await aba.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = ${JSON.stringify(login)}; f.senha.value = ${JSON.stringify(senha)}; f.requestSubmit(); return 1; })()`);
    return aba.ate("!document.querySelector('#v-app').hidden");
  };
  const faixa = aba => aba.avalia("({ texto: document.querySelector('#sinc-texto').textContent.replace(/\\s+/g, ' '), problema: document.querySelector('#sinc-status').classList.contains('problema'), botao: !document.querySelector('#bt-sincroniza').hidden })");
  const cartao = (aba, id) => aba.avalia(`(() => {
    const c = document.querySelector('#versoes-lista .versao-card[data-v="${id}"]'); if (!c) return null;
    const g = c.querySelector('.acoes .bt.ouro');
    return { selos: Array.from(c.querySelectorAll('.versao-titulo .chip, .versao-titulo .saude')).map(x => x.textContent.trim()),
      gerar: g ? { tag: g.tagName, off: g.classList.contains('off'), href: g.getAttribute('href') || '', title: g.getAttribute('title') || '' } : null };
  })()`);
  const selos = async (aba, id) => (await cartao(aba, id) || { selos: [] }).selos.join(' | ');
  const cartoes = (aba, n) => aba.ate("document.querySelectorAll('#versoes-lista .versao-card').length === " + n);
  const foto = async (aba, nome) => { if (PASTA) await aba.foto(path.join(PASTA, nome)); };
  const clicaSinc = async aba => { await aba.avalia("document.querySelector('#bt-sincroniza').click(); 1"); await espera(300); };
  const recarrega = async (aba, n) => { await aba.avalia('location.reload(); 1'); await cartoes(aba, n); };

  const A = await nav.aba(s.painel + '/#/versoes', { largura: 1500, altura: 1100 });
  const C = await nav2.aba(s.painel + '/#/versoes', { largura: 1500, altura: 1100 });
  ok(await entra(A, s.adminLogin, s.adminSenha) && await cartoes(A, 3), 'o admin entra e vê as 3 páginas do deck (as duas de sempre e a nova)');
  ok(await entra(C, 'carla.closer', SENHA) && await cartoes(C, 3), 'a closer entra e vê as mesmas 3');

  /* ---------------- 1. tudo funcionando ---------------- */
  console.log('\n1. tudo funcionando');
  let f = await faixa(A);
  ok(/Sincronizado com o deck/.test(f.texto) && /3 páginas/.test(f.texto) && /todas funcionando/.test(f.texto) && !f.problema && f.botao, 'admin: a faixa diz "Sincronizado com o deck", 3 páginas, todas funcionando, e tem o botão "Sincronizar agora" (' + f.texto + ')');
  f = await faixa(C);
  ok(/Sincronizado com o deck/.test(f.texto) && /todas funcionando/.test(f.texto) && !f.problema && !f.botao, 'closer: a mesma faixa, sem o botão de sincronizar');
  ok(/Funcionando/.test(await selos(A, 'principal')) && /Funcionando/.test(await selos(A, 'tecnica')) && /Funcionando/.test(await selos(A, 'rapida')), 'cada variação mostra "Funcionando"');
  ok(/Nova no deck/.test(await selos(A, 'rapida')) && !/Nova no deck/.test(await selos(A, 'principal')), 'o admin vê "Nova no deck" na página que acabou de entrar');
  ok(!/Nova no deck/.test(await selos(C, 'rapida')), 'o closer não vê esse selo (é aviso pro admin)');
  let g = (await cartao(A, 'rapida')).gerar;
  ok(g.tag === 'A' && !g.off && g.href === '#/novo/rapida', 'o botão "Gerar apresentação pra um lead" é um link ativo');
  ok(/Lead quente/.test(await A.avalia("document.querySelector('#versoes-lista .versao-card').textContent")) && await A.avalia("document.querySelector('#versoes-lista .versao-card').dataset.v") === 'rapida', 'a página nova, que é a mais validada, vem primeiro na lista');
  await foto(A, 'sincronizacao-1-admin-funcionando.png');

  /* ---------------- 2. uma falha: só um aviso ---------------- */
  console.log('\n2. uma falha de conferência: aviso, sem bloquear');
  deck.poe(rapida.caminho, { status: 500, corpo: 'erro' });
  await clicaSinc(A);
  ok(await A.ate("/Conferindo de novo/.test(document.querySelector('#versoes-lista .versao-card[data-v=rapida]').textContent)", 8000), 'depois de "Sincronizar agora", a página mostra "Conferindo de novo"');
  ok((await faixa(A)).problema && /1 com problema/.test((await faixa(A)).texto), 'a faixa fica vermelha: "1 com problema"');
  g = (await cartao(A, 'rapida')).gerar;
  ok(g.tag === 'A' && !g.off && g.href === '#/novo/rapida', 'mas o botão de gerar continua ativo (uma falha só pode ser um soluço de rede)');
  ok(/HTTP 500/.test(await A.avalia("document.querySelector('#versoes-lista .versao-card[data-v=rapida] .chip[title*=HTTP]').title")), 'e o motivo está no selo (passando o mouse)');
  ok(/A última conferência falhou: A página não abre \(HTTP 500\)/.test(await A.avalia("document.querySelector('#versoes-lista .versao-card[data-v=rapida]').textContent")), 'e escrito no cartão do admin (no celular não tem mouse)');
  ok(await A.ate("/Sincronizado com o deck\\. 1 página com problema/.test(document.querySelector('#aviso').textContent)", 3000), 'o aviso do botão não diz só "sincronizado": diz que 1 página está com problema');

  /* ---------------- 3. duas falhas: bloqueia ---------------- */
  console.log('\n3. duas falhas seguidas: a página é bloqueada');
  await clicaSinc(A);
  ok(await A.ate("/Com problema/.test(document.querySelector('#versoes-lista .versao-card[data-v=rapida]').textContent)", 8000), 'a segunda falha vira "Com problema"');
  g = (await cartao(A, 'rapida')).gerar;
  ok(g.tag === 'SPAN' && g.off && !g.href && /HTTP 500/.test(g.title), 'o botão "Gerar apresentação pra um lead" fica desabilitado, e o motivo aparece no botão (' + g.title + ')');
  ok((await cartao(A, 'principal')).gerar.tag === 'A' && (await cartao(A, 'tecnica')).gerar.tag === 'A', 'as outras páginas seguem com o botão ativo');
  await foto(A, 'sincronizacao-2-admin-pagina-com-problema.png');
  await recarrega(C, 3);
  ok(await selos(C, 'rapida') === 'Validada | Com problema' && (await cartao(C, 'rapida')).gerar.off === true, 'a closer, ao abrir a aba, vê "Com problema" e o botão desabilitado');
  ok(/Indisponível agora: A página não abre \(HTTP 500\)\. Os R2 que usam essa página abrem a Principal até ela voltar/.test(await C.avalia("document.querySelector('#versoes-lista .versao-card[data-v=rapida]').textContent")), 'e o motivo está escrito no cartão, em texto');
  ok(!/Indisponível agora/.test(await C.avalia("document.querySelector('#versoes-lista .versao-card[data-v=principal]').textContent")), '(só na página que está com problema)');
  await C.avalia("location.hash = '#/novo'; 1");
  await C.ate("!document.querySelector('#v-editor').hidden && document.querySelectorAll('#versoes .versao').length === 3");
  const sel = await C.avalia("Array.from(document.querySelectorAll('#versoes .versao')).map(l => l.querySelector('input').value + ':' + (l.querySelector('input').disabled ? 'off' : 'on') + ':' + l.classList.contains('off')).join(',')");
  ok(/rapida:off:true/.test(sel) && /principal:on:false/.test(sel) && /tecnica:on:false/.test(sel), 'no editor de um R2 novo, a página com problema não pode ser escolhida (' + sel + ')');
  ok(/Indisponível agora/.test(await C.avalia("document.querySelector('#versoes input[value=rapida]').closest('label').textContent")), '... e o seletor explica por quê');
  ok(await C.avalia("document.querySelector('#versoes input[value=principal]').checked"), 'a Principal segue marcada de partida');
  await foto(C, 'sincronizacao-3-closer-seletor.png');
  // um R2 que já usa a página: a escolha dele continua marcada e o editor avisa
  await C.avalia("location.hash = '#/r2/" + tRapida + "'; 1");
  await C.ate("!document.querySelector('#v-editor').hidden && document.querySelector('#versoes input[value=rapida]')");
  await C.ate("document.querySelector('#versoes input[value=rapida]').checked", 8000);
  ok(await C.avalia("(() => { const i = document.querySelector('#versoes input[value=rapida]'); return i.checked && !i.disabled; })()"), 'num R2 que já usa a página, a escolha dele continua marcada (e não some)');
  ok(/não está funcionando agora/.test(await C.avalia("document.querySelector('#vr-nota').textContent")) && /abre a Principal/.test(await C.avalia("document.querySelector('#vr-nota').textContent")), 'e o editor avisa que o link do lead abre a Principal até a página voltar');
  await C.avalia("location.hash = '#/versoes'; 1");
  await cartoes(C, 3);

  /* ---------------- 4. a página sai do deck ---------------- */
  console.log('\n4. a página sai do deck');
  deck.publica([]);
  await clicaSinc(A);
  ok(await A.ate("/Saiu do deck/.test(document.querySelector('#versoes-lista .versao-card[data-v=rapida]').textContent)", 8000), 'o admin vê "Saiu do deck" na página');
  f = await faixa(A);
  ok(/2 páginas/.test(f.texto) && /1 saiu do deck/.test(f.texto), 'a faixa conta 2 páginas e "1 saiu do deck" (' + f.texto + ')');
  g = (await cartao(A, 'rapida')).gerar;
  ok(g.tag === 'SPAN' && g.off && /saiu do deck/.test(g.title), 'o botão de gerar está desabilitado, com o motivo "A página saiu do deck"');
  ok(/Indisponível agora: A página saiu do deck\. Os R2 que usam essa página abrem a Principal\. Se não vai mais usar, arquive\./.test(await A.avalia("document.querySelector('#versoes-lista .versao-card[data-v=rapida]').textContent")), 'e o cartão explica, e sugere arquivar (pro admin)');
  await foto(A, 'sincronizacao-4-admin-saiu-do-deck.png');

  /* ---------------- 5. a página volta e o admin sincroniza ---------------- */
  console.log('\n5. a página volta');
  deck.publica([rapida]);
  deck.poe(rapida.caminho, { corpo: rapida.html });
  await clicaSinc(A);
  ok(await A.ate("/Funcionando/.test(document.querySelector('#versoes-lista .versao-card[data-v=rapida]').textContent)", 8000), 'depois de "Sincronizar agora", a página volta a "Funcionando"');
  g = (await cartao(A, 'rapida')).gerar;
  ok(g.tag === 'A' && !g.off, 'e o botão de gerar volta a funcionar');
  ok(/todas funcionando/.test((await faixa(A)).texto) && !(await faixa(A)).problema, 'a faixa volta a "todas funcionando"');

  /* ---------------- 6. o variacoes.json é mais novo que a página ---------------- */
  console.log('\n6. a página mudou depois do variacoes.json');
  deck.poe(rapida.caminho, { corpo: rapida.html.replace('<body>', '<body><!-- mexi -->') });
  await clicaSinc(A);
  ok(await A.ate("/variacoes\\.json velho/.test(document.querySelector('#versoes-lista .versao-card[data-v=rapida]').textContent)", 8000), 'o admin vê o selo "variacoes.json velho" na página (ela funciona, mas o manifesto ficou pra trás)');
  ok(/rode o gera-manifesto/.test((await faixa(A)).texto) && !(await faixa(A)).problema, 'a faixa avisa pra rodar o gera-manifesto.mjs, sem ficar vermelha');
  await recarrega(C, 3);
  ok(!/velho/.test(await selos(C, 'rapida')) && /Funcionando/.test(await selos(C, 'rapida')), 'o closer não vê esse aviso');
  deck.poe(rapida.caminho, { corpo: rapida.html });

  /* ---------------- 7. o deck todo fora do ar ---------------- */
  console.log('\n7. o deck fora do ar');
  deck.global({ derruba: true });
  await clicaSinc(A);
  ok(await A.ate("/Não consegui falar com o deck/.test(document.querySelector('#sinc-texto').textContent)", 12000), 'a faixa diz "Não consegui falar com o deck" e o motivo');
  f = await faixa(A);
  ok(f.problema && /sem resposta/.test(f.texto) && /A lista é a de/.test(f.texto), 'em vermelho, com o motivo e dizendo de quando é a lista que ficou (' + f.texto + ')');
  ok(await A.avalia("document.querySelectorAll('#versoes-lista .versao-card').length") === 3, 'a lista continua na tela');
  await recarrega(C, 3);
  const fc = await faixa(C);
  ok(/Não consegui falar com o deck/.test(fc.texto) && /A lista é a de/.test(fc.texto) && !/variacoes\.json|sem resposta/.test(fc.texto) && fc.problema, 'a closer vê a faixa vermelha, sem o texto técnico (' + fc.texto + ')');
  ok(/Não consegui falar com o deck/.test(await A.avalia("document.querySelector('#aviso').textContent")), 'o aviso do botão diz que não deu');
  await foto(A, 'sincronizacao-5-admin-deck-fora.png');
  deck.global({});
  await clicaSinc(A);
  ok(await A.ate("/Sincronizado com o deck/.test(document.querySelector('#sinc-texto').textContent) && !document.querySelector('#sinc-status').classList.contains('problema')", 12000), 'o deck volta: a faixa volta ao normal');

  /* ---------------- 8. texto do deck na tela ---------------- */
  console.log('\n8. o que o deck escreve não vira HTML na tela');
  const suja = paginaFalsa('suja', 3, { nome: '<img src=x onerror="window.__xss=1">Boa', resumo: 'Tem <script>window.__xss=2</script> dentro.', quando: '<b>Negrito</b> &lt;i&gt; e "aspas"' });
  deck.poe(suja.caminho, { corpo: suja.html });
  deck.publica([rapida, suja]);
  await clicaSinc(A);
  ok(await A.ate("document.querySelectorAll('#versoes-lista .versao-card').length === 4", 8000), 'a página com texto malicioso aparece');
  ok(await A.avalia("document.querySelector('#versoes-lista .versao-card[data-v=suja] h3').textContent") === 'Boa' && await A.avalia("document.querySelectorAll('#versoes-lista img, #versoes-lista script').length") === 0 && await A.avalia('typeof window.__xss') === 'undefined', 'o nome sai limpo, e nenhum <img> nem <script> entrou na tela');
  await recarrega(C, 4);
  ok(await C.avalia('typeof window.__xss') === 'undefined' && await C.avalia("document.querySelectorAll('#versoes-lista img, #versoes-lista script').length") === 0, 'o mesmo na tela da closer');

  const exc = [A, C].flatMap(a => a.console_.filter(m => /^EXC/.test(m)));
  ok(!exc.length, 'nenhuma exceção de JavaScript no painel' + (exc.length ? ': ' + exc.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha(); await nav2.fecha();
  await s.fecha(); await deck.fecha();
}
fim();
