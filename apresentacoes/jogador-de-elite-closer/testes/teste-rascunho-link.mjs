// O link só nasce no fim (18/10/2026): salvar no editor guarda um rascunho, sem link; a família não acha nada pelo código (nem nos decks de
// antes, que leem /api/publico); a prévia do painel abre com a chave de 3 horas (&p=), que o deck repassa em todo pedido ao painel; e o
// "Gerar link da apresentação", no fim do editor, faz o link existir. Painel e decks locais, driver de arquivo, Chrome headless.
// Uso: node testes/teste-rascunho-link.mjs
import path from 'node:path';
import { sobe, RAIZES } from './servidor.mjs';
import { Cliente, verificador, fotosDeTeste, b64 } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const { ok, fim } = verificador('Rascunho e Gerar link');
const s = await sobe({ deck: true, decks: ['r2-anterior', 'r1'] });
const nav = await abreNavegador();
const fotos = fotosDeTeste(RAIZES.r2);
const SENHA = 'senha-da-dani-123';
const INATIVO = "/não está mais ativo/.test(document.body.innerText)";
try {
  const admin = new Cliente(s.painel); await admin.entra(s.adminLogin, s.adminSenha);
  await admin.post('/api/usuarios', { login: 'dani.closer', nome: 'Dani Closer', papel: 'closer', senha: SENHA });
  const versoes = (await admin.get('/api/versoes')).j.versoes;

  /* ---------------- 1. pelas rotas: o rascunho não existe pra família ---------------- */
  console.log('\n1. o rascunho pelas rotas');
  const c = await admin.post('/api/atletas', { rascunho: true, ficha: { nome: 'Carlos Eduardo Souza', posicao: 'meia' } });
  const t = c.j.t, chave = new URL(c.j.previa).searchParams.get('p');
  ok(c.status === 201 && c.j.linkGerado === false && c.j.link === '' && !!chave, 'rascunho: sem link, com o endereço da prévia (chave de 3 horas)');
  const ft = await admin.put('/api/foto?t=' + t, { retrato: b64(path.join(fotos, 'retrato-a.jpg')), avatar: b64(path.join(fotos, 'avatar-a.jpg')), autorizo: true });
  ok(ft.status === 200, 'a foto sobe no rascunho');
  const pub = new Cliente(s.painel);
  ok((await pub.get('/api/r2?t=' + t)).status === 404 && (await pub.get('/api/publico?id=' + t)).status === 404, 'a família não acha o rascunho (nem pelo formato de antes)');
  ok((await pub.get('/api/foto?t=' + t + '&v=retrato&n=1')).status === 404, 'nem a foto dele');
  ok((await pub.get('/api/foto?t=' + t + '&v=retrato&n=1&p=' + encodeURIComponent(chave))).status === 200, 'com a chave da prévia, a foto abre');
  ok((await pub.get('/api/r2?t=' + t + '&p=' + encodeURIComponent('0.' + 'a'.repeat(24)))).status === 404, 'chave errada: nada');
  // a validade só conta depois que o link existe: um rascunho com a data planejada no passado continua na prévia e a limpeza não apaga
  {
    const fs = await import('node:fs');
    const arq = path.join(s.dados, 'atletas', t + '.json');
    const mexe = muda => { const d = JSON.parse(fs.readFileSync(arq, 'utf8')); muda(d); fs.writeFileSync(arq, JSON.stringify(d)); };
    mexe(d => { d.venceEm = new Date(Date.now() - 3600e3).toISOString(); d.venceManual = true; d.apagarAoVencer = true; });
    const pr = await pub.get('/api/r2?t=' + t + '&p=' + encodeURIComponent(chave));
    ok(pr.j && pr.j.estado === 'ok', 'rascunho com a validade planejada já no passado: a prévia continua abrindo (' + (pr.j && pr.j.estado) + ')');
    const lp = await new Cliente(s.painel).get('/api/limpeza', { cabecalhos: { Authorization: 'Bearer ' + s.cronSecret } });
    ok(lp.status === 200 && fs.existsSync(arq), 'a limpeza não apaga o rascunho marcado "apagar quando vencer" (o link nem existe)');
    const rg = (await admin.get('/api/atletas?t=' + t)).j;
    ok(rg.estado === 'preparo', 'o estado do rascunho é "preparo", não "expirado" (' + rg.estado + ')');
    const g = await admin.post('/api/link?t=' + t + '&acao=gerar', {});
    ok(g.status === 200 && Date.parse(g.j.registro.venceEm) > Date.now() && g.j.registro.venceManual === false, 'gerar com a validade escolhida já vencida: o link não nasce vencido (volta pra automática)');
    ok((await pub.get('/api/r2?t=' + t)).j.estado === 'ok', 'e a família já acha o link gerado');
  }

  /* ---------------- 2. nos decks: sem a chave, link inativo; com ela, a apresentação dele ---------------- */
  console.log('\n2. a prévia nos decks');
  for (const id of ['principal', 'r2a-principal', 'r1-principal']) {
    const ver = versoes.find(v => v.id === id);
    const r = await admin.post('/api/atletas', { rascunho: true, etapa: ver.etapa, ficha: { nome: 'Lucas Almeida da Silva', versao: id } });
    const base = s.decks[ver.deck] + ver.caminho + '?a=' + r.j.t;
    await admin.put('/api/foto?t=' + r.j.t, { retrato: b64(path.join(fotos, 'retrato-a.jpg')), avatar: b64(path.join(fotos, 'avatar-a.jpg')), autorizo: true });
    const a = await nav.aba(base + '#2', { largura: 1920, altura: 1080 });
    ok(await a.ate(INATIVO, 12000), id + ': sem a chave, o deck mostra o link inativo');
    const p = new URL(r.j.previa).searchParams.get('p');
    await a.vai('about:blank'); await a.vai(base + '&p=' + encodeURIComponent(p) + '#2');
    ok(await a.ate(`/LUCAS/i.test(document.querySelector('#stage > .slide.active').innerText) && !(${INATIVO})`, 12000), id + ': com a chave, a apresentação dele (o nome no 02)');
    ok(await a.ate(`(() => { const i = document.querySelector('#stage > .slide.active img[data-src="selecaoFotoUrl"]'); return i && /&p=/.test(i.getAttribute('src') || '') && i.complete && i.naturalWidth > 0; })()`, 10000), id + ': a foto do 02 vem com a chave e abre');
    // gerado: o link vale sem chave
    const g = await admin.post('/api/link?t=' + r.j.t + '&acao=gerar', {});
    ok(g.status === 200 && g.j.linkGerado === true && /\?a=/.test(g.j.link), id + ': Gerar link: o link nasce');
    await a.vai('about:blank'); await a.vai(base + '#2');
    ok(await a.ate(`/LUCAS/i.test(document.querySelector('#stage > .slide.active').innerText) && !(${INATIVO})`, 12000), id + ': gerado, o link abre sem chave');
    a.fecha();
  }

  /* ---------------- 3. no painel: salvar é rascunho, o link nasce no fim ---------------- */
  {
    const html = (await import('node:fs')).readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    const repetidos = [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))];
    ok(!repetidos.length, 'nenhum id repetido no painel (o segundo nunca receberia a ação)' + (repetidos.length ? ': ' + repetidos.join(', ') : ''));
  }
  console.log('\n3. no painel');
  const P = await nav.aba(s.painel + '/');
  ok(await P.ate("!document.querySelector('#v-entrar').hidden"), 'abre na tela de entrar');
  await P.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = 'dani.closer'; f.senha.value = ${JSON.stringify(SENHA)}; f.requestSubmit(); return 1; })()`);
  ok(await P.ate("!document.querySelector('#v-app').hidden"), 'entra');
  await P.avalia("location.hash = '#/novo'; 1");
  await P.ate("!document.querySelector('#v-editor').hidden");
  const poe = (nome, valor) => P.avalia(`(() => { const e = document.querySelector('#f-editor').elements.namedItem(${JSON.stringify(nome)}); e.value = ${JSON.stringify(valor)}; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); return 1; })()`);
  await poe('nome', 'Pedro Henrique da Silva Júnior');
  ok(await P.avalia("!document.querySelector('#s-gerar').hidden && /Gerar link/.test(document.querySelector('#bt-gerar-link').textContent) && document.querySelector('#s-link').hidden"), 'no fim do editor, o "Gerar link da apresentação"; o link ainda não existe');
  await P.avalia("document.querySelector('#ed-salvar').click(); 1");
  ok(await P.ate("/^#\\/r2\\/[a-z2-7]{26}$/.test(location.hash) && document.querySelector('#s-link').hidden && !document.querySelector('#s-gerar').hidden", 12000), 'Salvar: vira rascunho (o endereço tem o código, o link continua sem existir)');
  const tp = (await P.avalia('location.hash')).slice(5);
  ok((await pub.get('/api/r2?t=' + tp)).status === 404, 'o rascunho salvo pelo painel: a família não acha nada');
  // as oportunidades e as peneiras pelo editor
  await P.avalia("document.querySelector('#op-clube').value = 'Ferroviária'; document.querySelector('#op-detalhe').value = 'Série C'; document.querySelector('#op-adicionar').click(); 1");
  await P.avalia("document.querySelector('#op-clube').value = 'Benfica'; document.querySelector('#op-adicionar').click(); 1");
  ok(await P.ate("document.querySelectorAll('#op-lista li').length === 2"), 'as oportunidades entram na lista do editor');
  await poe('peneirasFeitas', '6'); await poe('gastoPeneiras', '4800');
  await P.avalia("document.querySelector('#bt-gerar-link').click(); 1");
  ok(await P.ate("!document.querySelector('#s-link').hidden && /\\?a=[a-z2-7]{26}/.test(document.querySelector('#lk-url').value) && document.querySelector('#s-gerar').hidden", 15000), 'Gerar link: salva o que mudou, o link aparece e o botão sai');
  const reg = (await admin.get('/api/atletas?t=' + tp)).j.registro;
  ok(reg.linkGerado !== false && reg.ficha.oportunidades === 'Ferroviária~Série C|Benfica' && reg.ficha.peneirasFeitas === '6' && reg.ficha.gastoPeneiras === '4800', 'o que estava no editor foi junto (' + reg.ficha.oportunidades + ')');
  ok((await pub.get('/api/r2?t=' + tp)).j.estado === 'ok', 'gerado: a família acha');
  P.fecha();
} finally {
  await nav.fecha();
  await s.fecha();
}
fim();
