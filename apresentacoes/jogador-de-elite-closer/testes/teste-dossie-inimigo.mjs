// O dossiê do atleta e o inimigo em comum (18/10/2026): os dois slides logo depois da IA na Prática nas sete páginas do R2 (R2 novo e R2 B,
// principal e técnica; R2 anterior, principal, técnica e Acompanhamento), com o painel e os decks locais e o driver de arquivo.
// Confere: o vídeo analisado ("Tenho o vídeo do jogador"), o mapa de calor (PUT /api/foto { mapa }) e as oportunidades que vêm do painel;
// o nome em cima da foto e os dados embaixo; a seta que pula o dossiê vazio; a IA na Prática que vira a ponte (vídeo sem lances); os números
// das peneiras contando do zero; o roteiro do apresentador; e que nenhuma tela mostra mais o número do dossiê nem "ilustrativo".
// O vídeo é o filme do Zyron que já está no deck (nenhum vídeo de atleta de verdade); o mapa é um JPEG gerado na hora.
// Uso: node testes/teste-dossie-inimigo.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { sobe, RAIZ_DECK } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const { ok, fim } = verificador('Dossiê do atleta e inimigo em comum');
const VIDEO = path.join(RAIZ_DECK, 'assets', 'video', 'zyron-filme.mp4');
const POSTER = path.join(RAIZ_DECK, 'assets', 'video', 'poster-zyron-filme.jpg');
const nomeAleatorio = () => { const a = 'abcdefghijkmnpqrstuvwxyz23456789'; return Array.from(crypto.randomBytes(24), x => a[x % a.length]).join(''); };
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'closer-dossie-'));
const MAPA = path.join(temp, 'mapa.jpg');
execFileSync('python', ['-I', '-c', `from PIL import Image, ImageDraw
im = Image.new('RGB', (900, 580), (22, 74, 46)); d = ImageDraw.Draw(im)
d.ellipse([420, 160, 700, 360], fill=(230, 60, 40)); d.rectangle([20, 20, 880, 560], outline=(240, 240, 240), width=4)
im.save(r'${MAPA}', 'JPEG', quality=85)`]);

const s = await sobe({ deck: true, decks: ['r2-anterior', 'r2-b'] });
const nav = await abreNavegador();
const OPS = 'Ferroviária~Série C · procura meia canhoto|Benfica~Portugal · base sub-19|Athletico-PR~Sub-20|Red Bull Bragantino~Sub-20';
const FICHA = { nome: 'Carlos Eduardo Souza', posicao: 'meia', idade: '17', altura: '178', pe: 'Canhoto', categoria: 'Sub-17', clubeAtual: 'Sub-17 do Vasco', cidade: 'Niterói',
  sonho: 'jogar na Europa', origem: 'Zyron', plano: 'Assessoria de Elite Legacy', temVideo: 'sim', oportunidades: OPS, peneirasFeitas: '6', gastoPeneiras: '4800', anosTentando: '3' };
const ativo = "[...document.querySelectorAll('#stage > .slide')].findIndex(s => s.classList.contains('active')) + 1";
const seta = "document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })); 1";
try {
  const admin = new Cliente(s.painel); await admin.entra(s.adminLogin, s.adminSenha);
  const versoes = (await admin.get('/api/versoes')).j.versoes; // a primeira leitura sincroniza com os decks
  const PAGINAS = [
    ['principal', 35, 18], ['tecnica', 35, 18], ['r2b-principal', 35, 18], ['r2b-tecnica', 35, 18],
    ['r2a-principal', 32, 16], ['r2a-tecnica', 32, 16], ['r2a-acompanhamento', 32, 16]
  ];
  const poeArquivo = (c, origem) => { const p = path.join(s.dados, ...c.split('/')); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.copyFileSync(origem, p); };
  async function sobeVideo(t) {
    const arq = 'videos/' + t + '/' + nomeAleatorio() + '.mp4', capa = 'videos/' + t + '/' + nomeAleatorio() + '.jpg';
    poeArquivo(arq, VIDEO); poeArquivo(capa, POSTER);
    await admin.put('/api/leitura?t=' + t, { autorizar: true });
    const r = await admin.put('/api/leitura?t=' + t, { video: { arquivo: arq, tipo: 'video/mp4', bytes: fs.statSync(VIDEO).size, duracaoS: 60, poster: capa } });
    return r.status === 200 && r.j.valido === true;
  }

  for (const [id, total, ds] of PAGINAS) {
    console.log('\n' + id);
    const ver = versoes.find(v => v.id === id);
    ok(!!ver, id + ': a variação está no catálogo');
    if (!ver) continue;
    // o completo: vídeo analisado, mapa, oportunidades e as peneiras
    const c = await admin.post('/api/atletas', { ficha: Object.assign({}, FICHA, { versao: id }) });
    const t = c.j.t;
    ok(c.status === 201 && t, id + ': gerado');
    ok(await sobeVideo(t), id + ': o vídeo analisado registrado');
    const m = await admin.put('/api/foto?t=' + t, { mapa: fs.readFileSync(MAPA).toString('base64') });
    ok(m.status === 200 && m.j.registro.mapa && m.j.registro.mapa.versao === 1, id + ': o mapa de calor salvo');
    const pub = (await new Cliente(s.painel).get('/api/r2?t=' + t)).j;
    ok(pub.estado === 'ok' && pub.mapa && pub.mapa.versao === 1 && pub.video && pub.video.ok && pub.ficha.oportunidades === OPS, id + ': a /api/r2 manda o mapa, o vídeo e as oportunidades');
    const a = await nav.aba(s.decks[ver.deck] + ver.caminho + '?a=' + t + '#' + ds, { largura: 1920, altura: 1080 });
    ok(await a.ate(`document.querySelectorAll('#stage > .slide').length === ${total} && document.querySelector('#stage > .slide.ds-slide.active .ds-nome') && document.querySelector('.ds-nome').textContent.length > 0`, 15000), id + ': ' + total + ' slides, o dossiê no ' + ds);
    await espera(900);
    const D = await a.avalia(`(() => { const s = document.querySelector('.ds-slide'); const vis = e => e && getComputedStyle(e).display !== 'none';
      return { nome: s.querySelector('.ds-nome').textContent, dados: [...s.querySelectorAll('.ds-dados .v')].map(e => e.textContent),
        video: (s.querySelector('#v-dossie') || {}).getAttribute ? s.querySelector('#v-dossie').getAttribute('src') || '' : '', videoVis: vis(s.querySelector('.ds-video')),
        mapa: s.querySelector('.ds-mapa-img img').getAttribute('src') || '', mapaVis: vis(s.querySelector('.ds-mapa')),
        ops: [...s.querySelectorAll('.ds-lista li')].map(li => li.querySelector('.ds-escudo b').textContent + ' ' + li.querySelector('.ds-clube').textContent),
        plano: vis(s.querySelector('.ds-direita .ds-plano')), titulo: s.querySelector('.ds-titulo').textContent,
        espaco: s.dataset.video || '' }; })()`);
    ok(D.nome === 'Carlos Eduardo Souza', id + ': o nome em cima da foto (' + D.nome + ')');
    ok(['Meia', '17 anos', '1,78 m', 'Canhoto', 'Sub-17', 'Sub-17 do Vasco'].every(x => D.dados.includes(x)), id + ': os dados embaixo da foto (' + D.dados.join(' · ') + ')');
    ok(D.videoVis && /\/api\/video\?t=/.test(D.video) && D.espaco === 'v-dossie', id + ': o vídeo analisado no centro, pelo código (o espaço do teclado é dele)');
    ok(D.mapaVis && /\/api\/foto\?t=.*&v=mapa&n=1/.test(D.mapa), id + ': o mapa de calor embaixo do vídeo');
    ok(D.ops.length === 4 && D.ops[0] === 'F Ferroviária' && D.ops[2] === 'AP Athletico-PR' && D.ops[3] === 'RB Red Bull Bragantino', id + ': as oportunidades com o escudo (' + D.ops.join(', ') + ')');
    ok(D.plano && /lido/i.test(D.titulo), id + ': o plano de carreira embaixo das oportunidades e o título "' + D.titulo + '"');
    ok(await a.ate(`(() => { const i = document.querySelector('.ds-mapa-img img'); return i.complete && i.naturalWidth > 0; })()`, 8000), id + ': o mapa abre pelo painel');
    // o inimigo em comum: os números da família, contando do zero, e o campo do avaliador
    await a.avalia(seta);
    ok(await a.ate(`${ativo} === ${ds + 1}`, 5000), id + ': a seta vai pro inimigo em comum (' + (ds + 1) + ')');
    ok(await a.ate(`[...document.querySelectorAll('.in-slide [data-conta]')].map(b => b.textContent).join('|') === '6|3|R$ 4.800'`, 6000), id + ': as peneiras, os anos e o gasto da família (6, 3, R$ 4.800), depois de contar');
    const I = await a.avalia(`(() => { const s = document.querySelector('.in-slide'); return { txt: s.innerText, voce: !!s.querySelector('.in-voce text'), dtag: (s.querySelector('.dtag') || {}).textContent || '' }; })()`);
    ok(/FALTA DE QUEM OLHASSE/i.test(I.txt) && /EXATAMENTE/i.test(I.txt) && /a gente te liga/i.test(I.txt) && I.voce, id + ': o título, a frase do "exatamente como você", a peneira e o campo com "você"');
    // a sequência: da IA na Prática a seta entra no dossiê; a IA na Prática é a ponte (vídeo sem lances: a leitura ao vivo)
    await a.vai('about:blank'); await a.vai(s.decks[ver.deck] + ver.caminho + '?a=' + t + '#' + (ds - 1));
    await a.ate(`${ativo} === ${ds - 1}`, 8000); await espera(500);
    if (id !== 'r2a-acompanhamento') ok(await a.avalia(`(() => { const s = document.querySelectorAll('#stage > .slide')[${ds - 2}]; const live = s.querySelector('[data-ifnot="videoOk"]'); return !!live && !live.classList.contains('off') && !s.dataset.video; })()`), id + ': a IA na Prática é a ponte (a leitura ao vivo), sem repetir o vídeo');
    for (let i = 0; i < 6 && (await a.avalia(ativo)) === ds - 1; i++) { await a.avalia(seta); await espera(150); }
    ok((await a.avalia(ativo)) === ds, id + ': da IA na Prática a seta entra no dossiê');
    // nada de número do dossiê nem "ilustrativo" em nenhum slide
    const tudo = await a.avalia("[...document.querySelectorAll('#stage > .slide')].map(s => s.innerText).join('\\n')");
    ok(!/\bn[ºo°]\s*[A-Z0-9]{8}\b/i.test(tudo) && !/ilustra|fictíci/i.test(tudo), id + ': nenhuma tela mostra o número do dossiê nem "ilustrativo"');
    // o apresentador: o roteiro dos dois slides
    const p = await nav.aba(s.decks[ver.deck] + ver.caminho + '?a=' + t + '&presenter', { largura: 1480, altura: 920 });
    await p.ate("document.querySelector('#pz-notes') && document.querySelector('#pz-notes').textContent.length > 0", 15000);
    const nomes = await p.avalia(`(window.ROTEIRO || []).slice(${ds - 1}, ${ds + 1}).map(r => r && r.nome).join(' | ')`);
    ok(nomes === 'O dossiê do atleta | O inimigo em comum', id + ': o roteiro do apresentador (' + nomes + ')');
    p.fecha(); a.fecha();

    // vazio (sem vídeo, mapa nem oportunidades): a seta passa direto pelo dossiê
    const v = await admin.post('/api/atletas', { ficha: { nome: 'Pedro Lima', versao: id, posicao: 'volante' } });
    const b = await nav.aba(s.decks[ver.deck] + ver.caminho + '?a=' + v.j.t + '#' + (ds - 1), { largura: 1920, altura: 1080 });
    await b.ate(`${ativo} === ${ds - 1} && document.querySelector('.ds-slide')`, 10000); await espera(600);
    for (let i = 0; i < 6 && (await b.avalia(ativo)) === ds - 1; i++) { await b.avalia(seta); await espera(150); }
    ok((await b.avalia(ativo)) === ds + 1, id + ': sem vídeo, mapa nem oportunidades, a seta pula o dossiê e vai pro inimigo em comum');
    ok(/A inscrição de cada peneira/.test(await b.avalia("document.querySelector('.in-slide').innerText")), id + ': sem os números, o quadro mostra a conta sem números');
    b.fecha();
  }

  // só as oportunidades (sem "Tenho o vídeo do jogador"): o dossiê aparece, o plano vai pro centro e o vídeo do 17 não some
  console.log('\nsó as oportunidades');
  const so = await admin.post('/api/atletas', { ficha: { nome: 'João Pedro da Silva', versao: 'principal', oportunidades: 'Ferroviária~Série C' } });
  const vOk = await sobeVideo(so.j.t);
  const ver = versoes.find(x => x.id === 'principal');
  const a = await nav.aba(s.decks[ver.deck] + ver.caminho + '?a=' + so.j.t + '#18', { largura: 1920, altura: 1080 });
  ok(vOk && await a.ate("document.querySelector('.ds-slide.active') && document.querySelectorAll('.ds-lista li').length === 1", 12000), 'o dossiê com uma oportunidade');
  const S = await a.avalia(`(() => { const s = document.querySelector('.ds-slide'), vis = e => e && getComputedStyle(e).display !== 'none'; return { video: vis(s.querySelector('.ds-video')), centro: vis(s.querySelector('.ds-centro .ds-plano')) }; })()`);
  ok(!S.video && S.centro, 'sem "Tenho o vídeo do jogador": o vídeo não entra no dossiê e o plano de carreira vai pro centro');
  await a.vai('about:blank'); await a.vai(s.decks[ver.deck] + ver.caminho + '?a=' + so.j.t + '#17');
  ok(await a.ate("document.querySelectorAll('#stage > .slide')[16].dataset.video === 'v-atleta'", 10000), 'e a IA na Prática segue com o vídeo dele, como antes');
  a.fecha();
} finally {
  await nav.fecha();
  await s.fecha();
  fs.rmSync(temp, { recursive: true, force: true });
}
fim();
