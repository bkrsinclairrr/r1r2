// As versões do R2 (variações) centralizadas no painel: o cadastro (regras.js) contra as páginas do deck, a ficha na API
// (versão, nome na tela, slides tirados da sequência), o que o deck recebe de /api/r2, o deck abrindo a versão certa pelo mesmo
// link, pulando o slide que o painel tirou e mostrando o nome como foi escolhido (inclusive sem nome e sem foto), e as telas do
// painel (aba Versões do R2, a seção Versão do R2 no editor, o chip na lista e a prévia).
// Uso: node testes/teste-versoes.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { sobe, RAIZ_DECK, RAIZ_PAINEL } from './servidor.mjs';
import { Cliente, verificador, fotosDeTeste, b64 } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const { ok, fim } = verificador('Versões do R2');

/* ---------------- A. o cadastro contra as páginas do deck ---------------- */
const painelCtx = { window: {} }; vm.createContext(painelCtx);
vm.runInContext(fs.readFileSync(path.join(RAIZ_PAINEL, 'regras.js'), 'utf8'), painelCtx);
const R = painelCtx.window.R2_REGRAS;
const CAMINHO_OK = /^\/(variacoes\/[a-z0-9-]+\/)?$/;
ok(R.VERSOES.length >= 2 && new Set(R.VERSOES.map(v => v.id)).size === R.VERSOES.length && R.VERSOES.every(v => /^[a-z0-9-]+$/.test(v.id)), 'o cadastro tem ids únicos e simples (' + R.VERSOES.map(v => v.id).join(', ') + ')');
ok(R.VERSOES.some(v => v.id === R.VERSAO_PADRAO) && R.versaoPor('inexistente').id === R.VERSAO_PADRAO && R.versaoPor('').id === R.VERSAO_PADRAO, 'a versão padrão existe e id desconhecido cai nela');
ok(R.VERSOES.every(v => CAMINHO_OK.test(v.caminho)) && new Set(R.VERSOES.map(v => v.caminho)).size === R.VERSOES.length, 'cada versão tem um caminho próprio, no formato que o deck aceita (a raiz ou variacoes/<slug>/)');
ok(R.VERSOES.every(v => v.nome && v.resumo && v.quando && Array.isArray(v.opcionais)), 'toda versão tem nome, resumo, quando usar e a lista de slides opcionais');
ok(R.VERSOES.every(v => !new RegExp('[' + String.fromCharCode(0x2014, 0x2013) + ']').test(v.nome + v.resumo + v.quando + v.opcionais.map(o => o.rotulo + o.ajuda).join(''))), 'sem travessão nos textos do cadastro');
const paginas = {};
for (const v of R.VERSOES) {
  const arq = path.join(RAIZ_DECK, ...v.caminho.split('/').filter(Boolean), 'index.html');
  const existe = fs.existsSync(arq);
  ok(existe, 'a página da versão ' + v.id + ' existe no deck (' + path.relative(RAIZ_DECK, arq) + ')');
  if (!existe) continue;
  const html = fs.readFileSync(arq, 'utf8');
  paginas[v.id] = html;
  const secoes = [...html.matchAll(/<section class="slide[^>]*>/g)].map(m => m[0]);
  const marcados = [...html.matchAll(/data-opcional="([a-z0-9-]+)"/g)].map(m => m[1]);
  ok(secoes.length === 35, 'a página ' + v.id + ' tem 35 slides (' + secoes.length + ')');
  ok(v.opcionais.every(o => secoes[o.slide - 1] && secoes[o.slide - 1].includes('data-opcional="' + o.id + '"')), 'em ' + v.id + ', cada slide opcional do cadastro está marcado no slide certo (' + v.opcionais.map(o => o.id + '=' + o.slide).join(', ') + ')');
  ok(marcados.length === v.opcionais.length && marcados.every(id => v.opcionais.some(o => o.id === id)), 'em ' + v.id + ', nenhum data-opcional fica fora do cadastro (' + marcados.join(', ') + ')');
  ok(v.opcionais.every(o => /^[a-z0-9-]+$/.test(o.id) && o.slide >= 1 && o.slide <= 35 && o.rotulo && o.ajuda), 'em ' + v.id + ', os opcionais têm id simples, slide de 1 a 35, rótulo e ajuda');
}

const s = await sobe({ deck: true });
const fotos = fotosDeTeste(RAIZ_DECK);
const F = n => path.join(fotos, n);
const nav = await abreNavegador();
try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  const base = { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: 'Assessoria PRO', r2data: new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10), r2hm: '19:30' };
  const cria = async (extra, foto) => {
    const r = await admin.post('/api/atletas', { ficha: Object.assign({}, base, extra) });
    if (r.status !== 201) throw new Error('não criou: ' + r.status + ' ' + r.texto);
    if (foto) await admin.put('/api/foto?t=' + r.j.t, { retrato: b64(F('retrato-a.jpg')), avatar: b64(F('avatar-a.jpg')), autorizo: true });
    return r.j.t;
  };
  const le = async t => (await admin.get('/api/atletas?t=' + t)).j;
  const publico = async t => (await fetch(s.painel + '/api/r2?t=' + t, { headers: { Origin: s.deck } })).json();

  /* ---------------- B. a ficha na API ---------------- */
  const t1 = await cria({ versao: 'tecnica', nomeTela: 'primeiro-sobrenome', pular: 'leva' });
  const j1 = await le(t1);
  ok(j1.registro.ficha.versao === 'tecnica' && j1.registro.ficha.nomeTela === 'primeiro-sobrenome' && j1.registro.ficha.pular === 'leva', 'a ficha grava versão, nome na tela e slides tirados');
  ok(j1.link === s.deck + '/?a=' + t1, 'o link é sempre o mesmo formato (/?a=<código>), qualquer que seja a versão');
  const lista = (await admin.get('/api/atletas')).j.itens;
  ok((lista.find(i => i.t === t1) || {}).versao === 'tecnica', 'a lista leva a versão de cada R2 (o chip)');
  const t2 = await cria({ versao: 'principal', nomeTela: '' });
  const f2 = (await le(t2)).registro.ficha;
  ok(!('versao' in f2) && !('nomeTela' in f2) && !('pular' in f2), 'o padrão não fica gravado (versão principal, nome e sobrenome, nada tirado)');
  const t3 = await cria({ nomeTela: 'qualquer', pular: 'nada' });
  const f3 = (await le(t3)).registro.ficha;
  ok(!('nomeTela' in f3) && !('pular' in f3), 'nome na tela e slide que não existem são descartados');
  const r3 = await admin.post('/api/atletas', { ficha: Object.assign({}, base, { versao: 'xyz' }) });
  ok(r3.status === 400 && /não existe mais/.test(r3.j.erro), 'variação que não existe é recusada (400), e não vira Principal em silêncio');
  const t4 = await cria({ pular: 'zzz, leva ,leva,outro' });
  ok((await le(t4)).registro.ficha.pular === 'leva', 'slides tirados: só os da versão, sem repetir e sem espaço (zzz, leva, leva, outro vira leva)');
  const t5 = await cria({ versao: 'tecnica' });
  const dep = await admin.put('/api/atletas?t=' + t5, { ficha: Object.assign({}, base, { versao: 'tecnica', pular: 'leva' }), base: (await le(t5)).registro.fichaEm });
  ok(dep.status === 200 && dep.j.registro.ficha.pular === 'leva' && /versao|pular/.test(dep.j.registro.historico.slice(-1)[0].o), 'salvar a ficha com a versão e o slide tirado vale, e o histórico anota o campo (' + dep.j.registro.historico.slice(-1)[0].o + ')');
  const volta = await admin.put('/api/atletas?t=' + t5, { ficha: Object.assign({}, base), base: dep.j.registro.fichaEm });
  ok(volta.status === 200 && !('versao' in volta.j.registro.ficha) && !('pular' in volta.j.registro.ficha), 'voltar pro padrão apaga a versão e o que estava tirado');

  /* o que o deck recebe */
  const p1 = await publico(t1), p2 = await publico(t2);
  ok(p1.estado === 'ok' && p1.versao.id === 'tecnica' && p1.versao.caminho === '/variacoes/tecnica/' && p1.ficha.nomeTela === 'primeiro-sobrenome' && p1.ficha.pular === 'leva', '/api/r2 manda a versão (id e caminho), o nome na tela e os slides tirados');
  ok(p2.versao.id === 'principal' && p2.versao.caminho === '/' && !('nomeTela' in p2.ficha) && !('pular' in p2.ficha), 'R2 sem escolha: versão principal e nada a mais na ficha pública');
  ok(!('versao' in p1.ficha), 'a versão vai fora da ficha (é do link, não da ficha)');
  // registro antigo, de antes das versões: abre na principal
  const arqAntigo = path.join(s.dados, 'atletas', t2 + '.json');
  const antigo = JSON.parse(fs.readFileSync(arqAntigo, 'utf8')); delete antigo.ficha.versao; delete antigo.ficha.nomeTela; delete antigo.ficha.pular;
  fs.writeFileSync(arqAntigo, JSON.stringify(antigo));
  ok((await publico(t2)).versao.id === 'principal', 'registro de antes das versões abre na principal');

  /* sem nome nem foto: o checklist não pede foto nem nome conferido */
  const t6 = await cria({ nomeTela: 'sem' });
  const j6 = await le(t6);
  ok(j6.checklist.foto && j6.checklist.nome && j6.estado === 'pronto', 'sem nome na tela, a foto e o nome conferido não são pedidos e o R2 fica Pronto (' + j6.estado + ')');
  const t7 = await cria({});
  ok(!(await le(t7)).checklist.foto && (await le(t7)).estado === 'rascunho', 'com nome na tela, continua pedindo a foto (sem ela é rascunho)');

  /* ---------------- C. o deck ---------------- */
  const NOME = "Array.from(document.querySelectorAll('[data-bind=\"nome\"]')).map(e => e.textContent.trim()).filter(Boolean)[0] || ''";
  const caminho = a => a.avalia('location.pathname');
  const tecla = (a, k) => a.avalia(`document.body.dispatchEvent(new KeyboardEvent('keydown', { key: ${JSON.stringify(k)}, bubbles: true, cancelable: true })); 1`);
  const anda = async (a, k) => {
    const antes = await a.avalia('location.hash');
    for (let i = 0; i < 40; i++) { await tecla(a, k); await espera(70); const d = await a.avalia('location.hash'); if (d !== antes) return d; }
    return antes;
  };

  // C1. o mesmo link abre a versão escolhida no painel
  const A = await nav.aba(s.deck + '/?a=' + t1 + '#2', { largura: 1920, altura: 1080 });
  ok(await A.ate(`location.pathname === '/variacoes/tecnica/' && window.VARIACAO_NOME === ${JSON.stringify(R.versaoPor('tecnica').nome)} && document.querySelectorAll('#stage > .slide.active').length === 1`, 15000), 'o link /?a= de um R2 da versão técnica abre a página da técnica');
  ok((await A.avalia('location.search')) === '?a=' + t1 && (await A.avalia('location.hash')) === '#2', 'a ida pra versão mantém o código e o slide (?a=<código>#2)');
  await espera(1500);
  ok((await caminho(A)) === '/variacoes/tecnica/', 'e fica nela (sem ir e voltar)');
  const vSalvo = JSON.parse(await A.avalia(`localStorage.getItem('je-r2-ficha:${t1}')`))._v;
  ok(vSalvo && vSalvo.c === '/variacoes/tecnica/' && vSalvo.o === s.deck, 'a ficha guardada leva o destino da versão, deck e caminho (a volta já vai direto)');
  const B = await nav.aba(s.deck + '/variacoes/tecnica/?a=' + t2 + '#2', { largura: 1920, altura: 1080 });
  ok(await B.ate(`location.pathname === '/' && window.VARIACAO_NOME === ${JSON.stringify(R.versaoPor('principal').nome)}`, 15000), 'o inverso: R2 da versão principal aberto pela página da técnica vai pra principal');
  const C = await nav.aba(s.deck + '/?a=' + t1 + '&presenter#3');
  ok(await C.ate("location.pathname === '/variacoes/tecnica/' && /[?&]presenter\\b/.test(location.search) && document.querySelector('#pz-var')", 15000), 'o apresentador também vai pra versão (e mantém o ?presenter)');
  ok((await C.avalia("document.querySelector('#pz-var').textContent")) === R.versaoPor('tecnica').nome, 'o topo do apresentador mostra a versão aberta');
  // código que não existe: nada de ir pra lugar nenhum
  const X = await nav.aba(s.deck + '/variacoes/tecnica/?a=' + 'a'.repeat(26) + '#1', { largura: 1920, altura: 1080 });
  await X.ate("!!document.querySelector('#je-inativo')", 10000); await espera(500); // o aviso é criado quando a resposta chega; a margem é pra ver que o deck não saiu da página
  ok((await caminho(X)) === '/variacoes/tecnica/' && !!(await X.avalia("!!document.querySelector('#je-inativo')")), 'link que não existe fica onde está, com o aviso de link inativo');
  // sem link: a página é a que foi aberta
  const Y = await nav.aba(s.deck + '/variacoes/tecnica/#1', { largura: 1920, altura: 1080 });
  await espera(1200);
  ok((await caminho(Y)) === '/variacoes/tecnica/', 'sem link, a página da variação abre como sempre (exemplo)');
  // a troca no painel no meio da call não derruba a tela; ao recarregar, vale a nova
  const D = await nav.aba(s.deck + '/?a=' + t2 + '#4', { largura: 1920, altura: 1080 });
  await D.ate("document.querySelectorAll('#stage > .slide.active').length === 1");
  const fichaD = (await le(t2)).registro;
  const trocou = await admin.put('/api/atletas?t=' + t2, { ficha: Object.assign({}, base, { versao: 'tecnica' }), base: fichaD.fichaEm });
  ok(trocou.status === 200, 'o painel troca a versão do R2 aberto (principal para técnica)');
  await espera(2500);
  ok((await caminho(D)) === '/' && (await D.avalia('location.hash')) === '#4', 'a tela aberta fica onde está (a troca não derruba a apresentação)');
  await D.avalia('location.reload(); 1');
  ok(await D.ate("location.pathname === '/variacoes/tecnica/'", 15000), 'ao recarregar, o mesmo link abre a versão nova');

  // C2. o slide tirado da sequência: as setas passam direto, o salto direto continua valendo
  const nSlide = h => parseInt(String(h).replace('#', ''), 10);
  const tp = await cria({ pular: 'leva' }), tn = await cria({});
  const Pu = await nav.aba(s.deck + '/?a=' + tp + '#26', { largura: 1920, altura: 1080 });
  await Pu.ate("document.querySelectorAll('#stage > .slide.active').length === 1 && document.querySelector('[data-opcional]') && (window.getComputedStyle(document.querySelector('#viewport')).visibility !== 'hidden')");
  await espera(800);
  ok(nSlide(await anda(Pu, 'ArrowRight')) === 28, 'principal com o 27 tirado: do 26, a seta pra frente vai pro 28');
  ok(nSlide(await anda(Pu, 'ArrowLeft')) === 26, 'e a seta pra trás, do 28, volta pro 26');
  await Pu.avalia("location.hash = '#27'; 1"); await espera(500);
  ok(await Pu.avalia("document.querySelector('#stage > .slide.active').dataset.opcional === 'leva'"), 'ir direto ao 27 (hash) ainda abre o slide: é a saída quando a família pergunta');
  ok(nSlide(await anda(Pu, 'ArrowRight')) === 28, 'e dali a seta pra frente segue pro 28');
  const Pn = await nav.aba(s.deck + '/?a=' + tn + '#26', { largura: 1920, altura: 1080 });
  await Pn.ate("document.querySelectorAll('#stage > .slide.active').length === 1");
  await espera(800);
  ok(nSlide(await anda(Pn, 'ArrowRight')) === 27, 'sem nada tirado, do 26 a seta vai pro 27 (o padrão não mudou)');
  // na técnica também
  const tt = await cria({ versao: 'tecnica', pular: 'leva' });
  const Tt = await nav.aba(s.deck + '/?a=' + tt + '#26', { largura: 1920, altura: 1080 });
  await Tt.ate("location.pathname === '/variacoes/tecnica/' && document.querySelectorAll('#stage > .slide.active').length === 1", 15000);
  await espera(800);
  ok(nSlide(await anda(Tt, 'ArrowRight')) === 28, 'na versão técnica, com o 27 tirado, do 26 a seta vai pro 28');
  // o apresentador: o "Próximo" pula o tirado
  const Ap = await nav.aba(s.deck + '/?a=' + tp + '&presenter#26');
  await Ap.ate("document.querySelector('#pz-next') && document.querySelector('#pz-next .mini .slide, #pz-next .mini [class]')");
  await espera(800);
  const proxTxt = await Ap.avalia("(document.querySelector('#pz-next .counter') || {}).textContent || ''");
  ok(/^28\b/.test(proxTxt.trim()), 'no apresentador, a miniatura do Próximo é o 28 (o 27 está fora da sequência): "' + proxTxt.trim() + '"');
  // a visão geral marca o slide tirado
  await Pu.avalia("location.hash = '#1'; 1"); await espera(300);
  await tecla(Pu, 'g'); await espera(600);
  ok(await Pu.avalia("(() => { const it = document.querySelectorAll('#ov-grid .ov-item')[26]; return !!it && it.style.opacity === '0.4'; })()"), 'a visão geral deixa o 27 apagado (fora da sequência) e o 26 normal');

  // C3. o nome na tela
  const NOMES = [['', 'Lucas Silva'], ['primeiro-sobrenome', 'Lucas Almeida'], ['so-nome', 'Lucas']];
  for (const [modo, esperado] of NOMES) {
    const t = await cria(modo ? { nomeTela: modo } : {}, true);
    const N = await nav.aba(s.deck + '/?a=' + t + '#2', { largura: 1920, altura: 1080 });
    await N.ate(`${NOME} !== ''`, 12000);
    await espera(600);
    const visto = await N.avalia(NOME);
    ok(visto === esperado, 'nome na tela "' + (modo || 'padrão') + '": a tela diz "' + esperado + '" (' + JSON.stringify(visto) + ')');
    ok(/Montado para Lucas Almeida da Silva\./.test(await N.avalia("document.body.textContent")), '... e a capa continua com "Montado para" e o nome completo');
  }
  // sem nome e sem foto, com foto e vídeo no painel
  const ts = await cria({ nomeTela: 'sem', apelido: 'Luquinhas' }, true), tc = await cria({}, true);
  for (const t of [ts, tc]) {
    const arq = path.join(s.dados, 'atletas', t + '.json');
    const reg = JSON.parse(fs.readFileSync(arq, 'utf8'));
    reg.video = { arquivo: 'videos/' + t + '/abcdefghijklm.mp4', tipo: 'video/mp4', bytes: 1000, duracaoS: 10, poster: '', autorizadoEm: new Date().toISOString(), venceEm: new Date(Date.now() + 864e5).toISOString() };
    reg.leitura = { origem: 'equipe', criterio: 'selecao', lances: [{ t: 1, tipo: 'Passe', leitura: 'bom', nota: 'ok' }], fortes: [], prioridades: [] };
    fs.writeFileSync(arq, JSON.stringify(reg));
  }
  const Sm = await nav.aba(s.deck + '/?a=' + ts + '#2', { largura: 1920, altura: 1080 });
  await Sm.ate("document.querySelectorAll('#stage > .slide.active').length === 1 && window.getComputedStyle(document.querySelector('#viewport')).visibility !== 'hidden'");
  await espera(1800);
  const textoSlides = await Sm.avalia("Array.from(document.querySelectorAll('#stage > .slide')).map(s => s.textContent).join(' ')");
  ok(!/Lucas|Silva|Almeida|Luquinhas/.test(textoSlides), 'sem nome na tela: nenhum slide traz o nome do atleta, nem o apelido');
  ok(/você/i.test(await Sm.avalia("document.querySelector('#stage > .slide.active').textContent")), 'sem nome na tela: o slide 2 usa "você"');
  ok(!(await Sm.avalia("Array.from(document.images).some(i => /api\\/foto/.test(i.src)) || performance.getEntriesByType('resource').some(r => /api\\/foto/.test(r.name))")), 'sem nome na tela: a foto não é nem pedida ao painel');
  ok(!(await Sm.avalia("document.querySelector('#v-atleta').getAttribute('src')")), 'sem nome na tela: o vídeo do atleta também não vai pra tela');
  const Cm = await nav.aba(s.deck + '/?a=' + tc + '#2', { largura: 1920, altura: 1080 });
  await Cm.ate("document.querySelectorAll('#stage > .slide.active').length === 1 && window.getComputedStyle(document.querySelector('#viewport')).visibility !== 'hidden'");
  await espera(1800);
  ok(await Cm.avalia("Array.from(document.images).some(i => /api\\/foto/.test(i.src)) || performance.getEntriesByType('resource').some(r => /api\\/foto/.test(r.name))") && !!(await Cm.avalia("document.querySelector('#v-atleta').getAttribute('src')")), 'o controle: com nome na tela, a foto e o vídeo do atleta vão pra tela');
  const PS = await nav.aba(s.deck + '/?a=' + ts + '&presenter#2');
  await PS.ate("document.querySelector('#f-nome') && document.querySelector('#f-nome').value !== ''");
  ok((await PS.avalia("document.querySelector('#f-nome').value")) === 'Lucas Almeida da Silva', 'sem nome na tela, o apresentador continua com o nome dele na ficha');
  ok(/Luquinhas/.test(await PS.avalia("document.querySelector('#pz-notes').textContent")), 'e a fala dele chama o atleta pelo nome ([atleta] vira "Luquinhas")');

  const exc = [A, B, C, D, Pu, Pn, Tt, Ap, Sm, Cm, PS].flatMap(a => a.console_.filter(m => /^EXC/.test(m)));
  ok(!exc.length, 'nenhuma exceção de JavaScript no deck' + (exc.length ? ': ' + exc.slice(0, 2).join(' | ') : ''));

  /* ---------------- D. as telas do painel ---------------- */
  const P = await nav.aba(s.painel + '/', { largura: 1500, altura: 1000 });
  ok(await P.ate("!document.querySelector('#v-entrar').hidden"), 'o painel abre na tela de entrar');
  await P.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = ${JSON.stringify(s.adminLogin)}; f.senha.value = ${JSON.stringify(s.adminSenha)}; f.requestSubmit(); return 1; })()`);
  ok(await P.ate("!document.querySelector('#v-app').hidden"), 'entra no painel');
  await P.avalia("location.hash = '#/versoes'; 1");
  ok(await P.ate("!document.querySelector('#aba-versoes').hidden && document.querySelectorAll('#versoes-lista .versao-card').length === " + R.VERSOES.length), 'a aba Versões do R2 mostra uma ficha por versão do cadastro (' + R.VERSOES.length + ')');
  const cartoes = await P.avalia("Array.from(document.querySelectorAll('#versoes-lista .versao-card')).map(c => c.textContent).join(' | ')");
  ok(R.VERSOES.every(v => cartoes.includes(v.nome) && cartoes.includes(v.quando.slice(0, 30))), 'cada ficha traz o nome e o "quando usar" da versão');
  ok(await P.avalia("document.querySelectorAll('#versoes-lista .versoes-nome-lista li').length === 4") && /Lucas Almeida/.test(await P.avalia("document.querySelector('#versoes-lista .versoes-nome-lista').textContent")), 'e as quatro escolhas de nome na tela, com o exemplo');
  const abrirExemplo = await P.avalia("Array.from(document.querySelectorAll('#versoes-lista a')).filter(a => /Abrir exemplo/.test(a.textContent)).map(a => a.getAttribute('href'))");
  ok(abrirExemplo.length === R.VERSOES.length && abrirExemplo.includes(s.deck + '/variacoes/tecnica/') && abrirExemplo.includes(s.deck + '/'), 'Abrir exemplo leva às páginas das versões, sem atleta');
  ok(await P.avalia("document.querySelector('#tab-versoes').getAttribute('aria-current') === 'page'"), 'a aba Versões do R2 fica marcada');

  // o botão "Criar R2 com esta versão" leva ao editor com a versão marcada
  await P.avalia("document.querySelector('#versoes-lista a[href=\"#/novo/tecnica\"]').click(); 1");
  ok(await P.ate("!document.querySelector('#v-editor').hidden && document.querySelector('#versoes input[value=tecnica]').checked"), '"Criar R2 com esta versão" abre o editor novo com a técnica marcada');
  ok(await P.avalia("document.querySelectorAll('#opcionais-lista input[type=checkbox]').length === 7 && [...document.querySelectorAll('#opcionais-lista input')].every(c => c.checked) && !document.querySelector('#opcionais').hidden"), 'e os sete slides opcionais da versão aparecem marcados (entram na sequência)');
  const poe = (nome, valor) => P.avalia(`(() => { const e = document.querySelector('#f-editor').elements.namedItem(${JSON.stringify(nome)}); e.value = ${JSON.stringify(valor)}; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); return e.value; })()`);
  await poe('nome', 'Lucas Almeida da Silva');
  ok(/O que o Lucas leva/.test(await P.avalia("document.querySelector('#opcionais-lista').textContent")), 'o rótulo do slide opcional leva o nome do atleta ("O que o Lucas leva")');
  const opcoesNome = await P.avalia("Array.from(document.querySelector('#f-editor').elements.namedItem('nomeTela').options).map(o => o.value + '=' + o.textContent)");
  ok(opcoesNome.length === 4 && opcoesNome.some(o => o === 'primeiro-sobrenome=Nome e primeiro sobrenome · Lucas Almeida') && opcoesNome.some(o => o === '=Nome e sobrenome · Lucas Silva') && opcoesNome.some(o => o === 'so-nome=Só o primeiro nome · Lucas'), 'o select de nome na tela mostra como o nome digitado ficaria em cada escolha');
  await poe('nomeTela', 'primeiro-sobrenome');
  ok((await P.avalia("document.querySelector('#ex-nome').textContent")) === 'Lucas Almeida, você foi escolhido.', 'o exemplo ao vivo segue a escolha: "Lucas Almeida, você foi escolhido."');
  await poe('nomeTela', 'so-nome');
  ok((await P.avalia("document.querySelector('#ex-nome').textContent")) === 'Lucas, você foi escolhido.', '... só o primeiro nome: "Lucas, você foi escolhido."');
  await poe('apelido', 'Luquinhas');
  ok(/preenchido e manda/.test(await P.avalia("document.querySelector('#ex-nome-nota').textContent")) && (await P.avalia("document.querySelector('#ex-nome').textContent")) === 'Luquinhas, você foi escolhido.', 'com apelido, o apelido manda e a tela avisa');
  await poe('apelido', '');
  await poe('nomeTela', 'primeiro-sobrenome');
  await P.avalia("document.querySelector('#opcionais-lista input[value=leva]').click(); 1");
  ok(await P.avalia("!document.querySelector('#opcionais-lista input[value=leva]').checked && document.querySelector('#ed-salvo').classList.contains('sujo')"), 'desmarcar o slide conta como mudança não salva');
  await P.avalia("document.querySelector('#bt-gerar-link').click(); 1");
  ok(await P.ate("/^#\\/r2\\/[a-z2-7]{26}$/.test(location.hash) && !document.querySelector('#s-link').hidden"), 'Gerar link do R2: o R2 nasce e o endereço vira #/r2/<código>');
  const tU = (await P.avalia('location.hash')).slice(5);
  const reg = (await le(tU)).registro.ficha;
  ok(reg.versao === 'tecnica' && reg.nomeTela === 'primeiro-sobrenome' && reg.pular === 'leva', 'o R2 criado pela tela grava a versão técnica, o primeiro sobrenome e o "leva" tirado');
  ok((await P.avalia("document.querySelector('#lk-url').value")) === s.deck + '/?a=' + tU, 'o link do R2 é o de sempre, /?a=<código>');
  ok(await P.avalia("document.querySelector('#pv').getAttribute('src') === " + JSON.stringify(s.deck + '/?a=' + tU + '#1')) && await P.avalia("document.querySelector('.pv-bt[data-pv=\"O que ele leva\"]').classList.contains('fora')"), 'a prévia carrega o mesmo link, e o botão do 19 aparece como fora da sequência');
  const caminhoPrevia = async () => { const tree = await P.envia('Page.getFrameTree'); const f = (tree.frameTree.childFrames || [])[0]; return f ? new URL(f.frame.url).pathname : ''; };
  let cp = ''; for (let i = 0; i < 80 && cp !== '/variacoes/tecnica/'; i++) { cp = await caminhoPrevia(); if (cp !== '/variacoes/tecnica/') await espera(200); }
  ok(cp === '/variacoes/tecnica/', 'a prévia, aberta pelo mesmo link, mostra a página da versão técnica (' + cp + ')');

  // trocar a versão num R2 que já existe
  await P.avalia("document.querySelector('#versoes input[value=principal]').click(); 1");
  ok(await P.ate("/Salve pra o link/.test(document.querySelector('#vr-nota').textContent) && document.querySelector('#ed-salvo').classList.contains('sujo')"), 'trocar a versão avisa que o link só muda depois de salvar');
  ok(await P.avalia("!document.querySelector('#opcionais-lista input[value=leva]').checked"), '... e o slide que já estava tirado continua desmarcado na versão nova');
  await P.avalia("document.querySelector('#ed-salvar').click(); 1");
  ok(await P.ate("document.querySelector('#vr-nota').textContent === '' && !document.querySelector('#ed-salvo').classList.contains('sujo')"), 'salvar tira o aviso');
  const reg2 = (await le(tU)).registro.ficha;
  ok(!('versao' in reg2) && reg2.pular === 'leva' && reg2.nomeTela === 'primeiro-sobrenome', 'a ficha voltou pra principal (versão sai da ficha) e mantém o resto');
  cp = ''; for (let i = 0; i < 80 && cp !== '/'; i++) { cp = await caminhoPrevia(); if (cp !== '/') await espera(200); }
  ok(cp === '/', 'e a prévia, ao salvar, segue pra página da versão nova (' + cp + ')');

  // sem nome e sem foto: o checklist e a nota da foto
  await poe('nomeTela', 'sem');
  ok(/mostra o nome nem a foto|não mostra nome nem foto/.test(await P.avalia("document.querySelector('#nt-ajuda').textContent")) && !(await P.avalia("document.querySelector('#ft-nota-sem').hidden")), 'sem nome na tela: a ajuda explica e a seção da foto avisa');
  ok((await P.avalia("document.querySelector('#ex-nome').textContent")) === 'Você foi escolhido.', '... e o exemplo vira "Você foi escolhido."');
  ok(await P.avalia("Array.from(document.querySelectorAll('#checklist li')).slice(0, 2).every(li => li.classList.contains('ok') && /Não precisa/.test(li.textContent))"), '... e o checklist não pede foto nem nome conferido');
  await P.avalia("document.querySelector('#versoes input[value=tecnica]').click(); 1");
  await P.avalia("document.querySelector('#ed-salvar').click(); 1");
  await P.ate("!document.querySelector('#ed-salvo').classList.contains('sujo')");
  await P.avalia("location.hash = '#/'; 1");
  ok(await P.ate("document.querySelectorAll('#lista .item').length > 0"), 'volta pra lista');
  await P.avalia("(() => { const b = document.querySelector('#busca'); b.value = 'Lucas'; b.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('.filtro[data-filtro=todos]').click(); return 1; })()");
  const chips = await P.avalia("Array.from(document.querySelectorAll('#lista .item')).filter(i => i.querySelector('a[href=\"#/r2/" + tU + "\"]')).map(i => i.textContent)[0] || ''");
  ok(/Técnica/.test(chips), 'na lista, o R2 da técnica ganha o chip com o nome da versão');
  const excP = P.console_.filter(m => /^EXC/.test(m));
  ok(!excP.length, 'nenhuma exceção de JavaScript no painel' + (excP.length ? ': ' + excP.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha();
  await s.fecha();
  fs.rmSync(fotos, { recursive: true, force: true });
}
fim();
