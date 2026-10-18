// Contrato da oferta alternativa e da ordem da garantia, sem tocar nos leads reais.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { RAIZES, sobe } from './servidor.mjs';
import { Cliente } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const raiz = RAIZES['r2-anterior'];
const caminho = '/variacoes/acompanhamento/';
const le = p => fs.readFileSync(path.join(raiz, p), 'utf8');

test('a oferta limita os planos no painel; as outras páginas continuam com três', async () => {
  await import('../regras.js');
  const R = globalThis.R2_REGRAS;
  const oferta = { id: 'r2a-acompanhamento', deck: 'r2-anterior', etapa: 'r2', caminho,
    opcionais: [], recursos: { nomeTela: false, foto: false, pular: false } };
  assert.deepEqual(R.planosDaVersao(oferta), ['Scout PRO', 'Assessoria de Elite Legacy']);
  assert.deepEqual(R.planosDaVersao({ id: 'principal', caminho: '/' }), R.PLANOS);
});

test('a garantia dos dois R2 anteriores vem depois do investimento e antes do Bem-vindo', () => {
  for (const pagina of ['index.html', 'variacoes/tecnica/index.html']) {
    const html = le(pagina);
    const slides = html.match(/<section class="slide(?: [^"]+)?"[\s\S]*?<\/section>/g);
    assert.match(slides.at(-3), /id="silencio"/);
    assert.match(slides.at(-2), /Garantia[\s\S]*incondicional/i);
    assert.doesNotMatch(slides.at(-2), /é preciso comprovar|se vocês aplicarem o método/i);
    assert.match(slides.at(-1), /Bem-vindo/);
  }
});

test('o manifesto cadastra a oferta no R2 anterior, com nome e foto', () => {
  const m = JSON.parse(le('variacoes.json'));
  const pagina = m.paginas.find(p => p.id === 'acompanhamento');
  assert.ok(pagina, 'falta a página de acompanhamento');
  assert.equal(pagina.caminho, caminho);
  assert.equal(pagina.lead.nome, true);
  assert.equal(pagina.lead.foto, true);
});

test('a oferta é descoberta pelo painel e funciona com o mesmo link, nome, planos e apresentador', async () => {
  assert.ok(fs.existsSync(path.join(raiz, caminho, 'index.html')), 'falta a página nova');
  const s = await sobe({ deck: true, decks: ['r2-anterior'] });
  const nav = await abreNavegador();
  try {
    const admin = new Cliente(s.painel);
    await admin.entra(s.adminLogin, s.adminSenha);
    const lista = (await admin.get('/api/versoes')).j;
    const variacao = lista.versoes.find(v => v.id === 'r2a-acompanhamento');
    assert.ok(variacao && variacao.saude.ok, 'o painel deve descobrir a página funcionando');
    const { limpaFicha } = await import('../api/_base.js');
    assert.equal(limpaFicha({ nome: 'Lucas', plano: 'Assessoria PRO', versao: variacao.id }, lista.versoes).plano, undefined);
    assert.equal(limpaFicha({ nome: 'Lucas', plano: 'Assessoria PRO' }, lista.versoes).plano, 'Assessoria PRO');
    const ui = await nav.aba(s.painel + '/#/novo/r2a-acompanhamento');
    await ui.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = ${JSON.stringify(s.adminLogin)}; f.senha.value = ${JSON.stringify(s.adminSenha)}; f.requestSubmit(); return 1; })()`);
    const opcoes = `[...document.querySelector('#f-editor [name="plano"]').options].map(o => o.value).filter(Boolean)`;
    assert.ok(await ui.ate(`!document.querySelector('#v-editor').hidden && (${opcoes}).length === 2`));
    assert.deepEqual(await ui.avalia(opcoes), ['Assessoria de Elite Legacy', 'Scout PRO']);
    await ui.avalia(`document.querySelector('#versoes input[value="principal"]').click(); 1`);
    assert.equal((await ui.avalia(opcoes)).length, 3, 'as outras páginas continuam com o intermediário');
    await ui.avalia(`const sel=document.querySelector('#f-editor [name="plano"]');sel.value='Assessoria PRO';sel.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#versoes input[value="r2a-acompanhamento"]').click(); 1`);
    assert.equal(await ui.avalia('document.querySelector(\'#f-editor [name="plano"]\').value'), '', 'trocar de oferta pede nova escolha quando o plano não existe');
    const comum = await admin.post('/api/atletas', { ficha: { nome: 'Pedro Silva', plano: 'Assessoria PRO' } });
    assert.equal(comum.status, 201);
    await ui.avalia(`location.hash = '#/r2/${comum.j.t}'; 1`);
    assert.ok(await ui.ate(`document.querySelector('#f-editor [name="nome"]').value === 'Pedro Silva'`));
    assert.equal(await ui.avalia('document.querySelector(\'#f-editor [name="plano"]\').value'), 'Assessoria PRO', 'abrir outro lead preserva o plano dele');
    const criado = await admin.post('/api/atletas', { etapa: 'r2', ficha: {
      nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: 'Assessoria de Elite Legacy',
      versao: 'r2a-acompanhamento', r2data: new Date(Date.now() + 864e5).toISOString().slice(0, 10), r2hm: '19:30'
    } });
    assert.equal(criado.status, 201, criado.texto);
    const a = await nav.aba(s.decks.r2 + '/?a=' + criado.j.t, { largura: 1920, altura: 1080 });
    assert.ok(await a.ate(`location.pathname === '${caminho}' && document.querySelector('#stage > .slide.active') && [...document.querySelectorAll('[data-bind="nome"]')].some(e => e.textContent === 'Lucas Silva')`));
    assert.equal(await a.avalia('new URLSearchParams(location.search).get("a")'), criado.j.t);
    const dados = await a.avalia(`(() => {
      const ss = [...document.querySelectorAll('#stage > .slide')];
      return { planos: window.PLANOS, roteiros: window.ROTEIRO.map(r => r.nome),
        nome: document.querySelector('[data-bind="nome"]').textContent,
        finais: ss.slice(-3).map(e => e.textContent),
        total: ss.length, conteudo: ss.map(e => e.textContent).join(' ') };
    })()`);
    assert.equal(dados.nome, 'Lucas Silva'); // nome e sobrenome na tela desde 18/10/2026
    assert.equal(dados.planos.length, 2);
    assert.deepEqual(dados.planos.map(p => p.preco), ['R$ 247,90', 'R$ 500']);
    assert.deepEqual(dados.planos.map(p => p.parcela), ['R$ 24,79', 'R$ 50']);
    assert.equal(dados.roteiros.length, dados.total);
    assert.match(dados.conteudo, /funcionamento da IA/);
    assert.match(dados.conteudo, /acompanhamento diário/i);
    assert.doesNotMatch(dados.conteudo, /o mais completo|R\$ 997|R\$ 1\.497|R\$ 2\.997/i);
    assert.match(dados.finais[0], /247,90/);
    assert.match(dados.finais[1], /incondicional/i);
    assert.match(dados.finais[2], /Bem-vindo/);
    const oferta = dados.total - 2;
    await a.vai(s.decks['r2-anterior'] + caminho + '?a=' + criado.j.t + '#' + oferta);
    assert.ok(await a.ate(`document.querySelector('#stage > .slide.active').id === 'silencio'`));
    await a.avalia(`document.querySelectorAll('#silencio [data-step]').forEach(e => e.classList.add('shown')); 1`);
    const fontes = await a.avalia(`['scouting', 'legacy'].flatMap(p => ['preco', 'parcela'].map(k => getComputedStyle(document.querySelector('#silencio [data-bind="' + p + '.' + k + '"]')).fontSize))`);
    assert.equal(new Set(fontes).size, 1, 'preços e parcelas têm o mesmo tamanho nos dois planos');
    const cabe = await a.avalia(`(() => { const s = document.querySelector('#stage').getBoundingClientRect();
      return [...document.querySelectorAll('#silencio .pl-vant p')].every(p => p.getBoundingClientRect().bottom < s.top + s.height * .94); })()`);
    assert.ok(cabe, 'todos os benefícios cabem acima do rodapé do slide');
    if (process.env.CAPTURAS) {
      fs.mkdirSync(process.env.CAPTURAS, { recursive: true });
      await espera(800);
      await a.foto(path.join(process.env.CAPTURAS, 'oferta.png'));
      for (const [numero, nome] of [[oferta - 1, 'acompanhamento'], [oferta + 1, 'garantia']]) {
        await a.avalia(`location.hash = '#${numero}'; 1`);
        await espera(900);
        await a.foto(path.join(process.env.CAPTURAS, nome + '.png'));
      }
      await a.avalia(`location.hash = '#${oferta}'; 1`);
      await espera(400);
    }
    await a.avalia(`document.body.dispatchEvent(new KeyboardEvent('keydown', {key:'s',bubbles:true})); 1`);
    assert.equal(await a.avalia('document.querySelector("#stage > .slide.active").id'), 'silencio');
    const p = await nav.aba(s.decks['r2-anterior'] + caminho + '?presenter&a=' + criado.j.t + '#' + oferta);
    assert.ok(await p.ate('!!document.querySelector("#pz-var")'));
    assert.equal(await p.avalia('window.ROTEIRO[window.ROTEIRO.length - 3].nome'), 'Os dois planos');
    assert.equal(await p.avalia('window.ROTEIRO[window.ROTEIRO.length - 2].nome'), 'Garantia incondicional');
    assert.match(await p.avalia('document.body.textContent'), /247,90/);
    assert.doesNotMatch(await p.avalia('document.body.textContent'), /o mais completo|R\$ 997|R\$ 1\.497|R\$ 2\.997/i);
    await p.avalia(`document.querySelector('[data-plano-troca="scouting"]').click(); 1`);
    await espera(500);
    assert.equal(await p.avalia(`JSON.parse(localStorage.getItem('je-r2-dossie-ficha-${criado.j.t}')).plano`), 'Scout PRO');
    assert.ok(!a.console_.some(e => e.startsWith('EXC')) && !p.console_.some(e => e.startsWith('EXC')), 'sem exceções de script');
  } finally { await nav.fecha(); await s.fecha(); }
});

test('o roteiro, as objeções e a referência do apresentador acompanham a garantia nos dois decks anteriores', async () => {
  const s = await sobe({ deck: true, decks: ['r2-anterior'] });
  const nav = await abreNavegador();
  try {
    for (const pagina of ['/', '/variacoes/tecnica/']) {
      const a = await nav.aba(s.decks['r2-anterior'] + pagina + '?presenter#29');
      assert.ok(await a.ate('!!document.querySelector("#pz-var")'));
      const fim = await a.avalia('window.ROTEIRO.slice(-3).map(r => r.nome)');
      assert.match(fim[0], /investimento/i);
      assert.equal(fim[1], 'Garantia incondicional');
      assert.equal(fim[2], 'Bem-vindo');
      assert.equal(await a.avalia('window.OBJECOES.find(o => /Tem garantia/.test(o.q)).slides[0]'), 29);
      assert.equal(await a.avalia('window.R2_REFERENCIA("21 (vazio: some)")'), '29 (vazio: some)');
      assert.ok(!a.console_.some(e => e.startsWith('EXC')));
    }
  } finally { await nav.fecha(); await s.fecha(); }
});
