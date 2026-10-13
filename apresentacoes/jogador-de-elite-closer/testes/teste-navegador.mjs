// Teste de ponta a ponta no navegador (Chrome sem janela), com o painel e o R2 novo locais e o driver de arquivo.
// Uso: node testes/teste-navegador.mjs [pasta-pras-telas]
// Login, novo R2, foto pelo recorte (roda do mouse, arrastar, pinça, autorização) com a foto saindo sem EXIF nem GPS,
// os outros formatos pelo recorte (PNG, 5000 x 5000, 8 MB, HTML disfarçado, corrompida), a ficha até "Pronto", sair com
// mudança não salva, o 409 sem perder o que foi digitado, a prévia dos slides, o link, o R2 aberto pelo link, a presença
// de dois apresentadores, trocar a foto e ver no R2 com "Atualizar do painel", painel fora do ar e "Encerrar e limpar".
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZ_DECK } from './servidor.mjs';
import { Cliente, verificador, fotosDeTeste } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const TELAS = process.argv[2] ? path.resolve(process.argv[2]) : '';
if (TELAS) fs.mkdirSync(TELAS, { recursive: true });
const tela = async (aba, nome) => { if (TELAS) await aba.foto(path.join(TELAS, nome + '.png')); };
const s = await sobe({ deck: true });
const { ok, fim } = verificador('Navegador');
const fotos = fotosDeTeste(RAIZ_DECK);
const F = n => path.join(fotos, n);
const SENHA = 'senha-da-carla-123';
const sof = buf => { // dimensões e se tem APP1 (EXIF)
  let i = 2, app1 = false;
  while (i + 4 <= buf.length && buf[i] === 0xFF) {
    const m = buf[i + 1]; if (m === 0xDA || m === 0xD9) break;
    const len = buf.readUInt16BE(i + 2); if (m === 0xE1) app1 = true;
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return { a: buf.readUInt16BE(i + 5), l: buf.readUInt16BE(i + 7), app1 };
    i += 2 + len;
  }
  return { app1 };
};
const nav = await abreNavegador();
try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  await admin.post('/api/usuarios', { login: 'carla.closer', nome: 'Carla Closer', papel: 'closer', senha: SENHA });
  const carla = new Cliente(s.painel); await carla.entra('carla.closer', SENHA);

  /* ---------- login e novo R2 ---------- */
  const P = await nav.aba(s.painel + '/', { toque: true });
  // se o Chrome demorar demais pra abrir a primeira página (máquina ocupada), tenta uma vez de novo; se não abrir, diz o que viu
  let abriu = await P.ate("!document.querySelector('#v-entrar').hidden");
  if (!abriu) { await P.vai(s.painel + '/'); abriu = await P.ate("!document.querySelector('#v-entrar').hidden"); }
  if (!abriu) console.log('  diagnóstico: ' + JSON.stringify(await P.avalia("({ href: location.href, estado: document.readyState, texto: (document.body && document.body.innerText || '').slice(0, 160) })").catch(e => String(e))) + ' | console: ' + JSON.stringify(P.console_.slice(0, 3)));
  ok(abriu, 'abre na tela de entrar');
  await P.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = 'carla.closer'; f.senha.value = ${JSON.stringify(SENHA)}; f.requestSubmit(); return 1; })()`);
  ok(await P.ate("!document.querySelector('#v-app').hidden && /Nenhum R2/.test(document.querySelector('#lista').textContent)"), 'entra e vê a lista vazia');
  await P.avalia("location.hash = '#/novo'; 1");
  await P.ate("!document.querySelector('#v-editor').hidden");
  const poe = (nome, valor) => P.avalia(`(() => { const e = document.querySelector('#f-editor').elements.namedItem(${JSON.stringify(nome)}); e.value = ${JSON.stringify(valor)}; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); return e.value; })()`);
  await poe('nome', 'Lucas Almeida da Silva');
  ok((await P.avalia("document.querySelector('#ex-nome').textContent")) === 'Lucas Silva, você foi escolhido.', 'o exemplo ao vivo, com nome e sobrenome: "Lucas Silva, você foi escolhido."');
  await poe('apelido', 'Luquinhas');
  ok((await P.avalia("document.querySelector('#ex-nome').textContent")) === 'Luquinhas, você foi escolhido.', 'com apelido, o exemplo usa o apelido');
  await poe('apelido', '');
  await P.avalia("document.querySelector('#ed-salvar').click(); 1");
  ok(await P.ate("/^#\\/r2\\/[a-z2-7]{26}$/.test(location.hash) && !document.querySelector('#s-link').hidden"), 'cria o R2: o endereço vira #/r2/<código> e o link aparece');
  const t = (await P.avalia('location.hash')).slice(5);

  /* ---------- foto pelo recorte: EXIF e GPS na entrada, nada na saída ---------- */
  const orig = fs.readFileSync(F('exif-gps.jpg'));
  ok(sof(orig).app1 && orig.includes(Buffer.from('Exif')), 'a foto de entrada tem EXIF (com GPS)');
  await P.arquivos('#ft-arquivo', [F('exif-gps.jpg')]);
  ok(await P.ate("!document.querySelector('#ft-recorte').hidden"), 'o recorte abre com a foto');
  await P.avalia("document.querySelector('#ft-canvas').scrollIntoView({ block: 'center' }); 1");
  await espera(300);
  const r = await P.avalia("(() => { const b = document.querySelector('#ft-canvas').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; })()");
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  const mini = () => P.avalia("document.querySelector('#ft-mini-ret').toDataURL() + '|' + document.querySelector('#ft-mini-av').toDataURL()");
  const z0 = +(await P.avalia("document.querySelector('#ft-zoom').value"));
  await P.roda(cx, cy, -500); await espera(150);
  const z1 = +(await P.avalia("document.querySelector('#ft-zoom').value"));
  ok(z1 > z0, 'roda do mouse dá zoom (' + z0 + ' → ' + z1 + ')');
  const m1 = await mini();
  await P.arrasta(cx, r.y + r.h * 0.94, cx + 40, r.y + r.h * 0.94 - 60); await espera(150);
  const m2 = await mini();
  ok(m1.split('|')[0] !== m2.split('|')[0], 'arrastar a foto muda o retrato');
  await P.arrasta(cx, r.y + r.h * 0.3, cx - 20, r.y + r.h * 0.26); await espera(150);
  const m3 = await mini();
  ok(m2.split('|')[1] !== m3.split('|')[1], 'arrastar o quadrado muda o avatar');
  await P.pinca(cx, r.y + r.h * 0.9, 60, 180); await espera(200);
  const z2 = +(await P.avalia("document.querySelector('#ft-zoom').value"));
  ok(z2 > z1, 'pinça com dois dedos dá zoom (' + z1 + ' → ' + z2 + ')');
  ok(await P.avalia("document.querySelector('#ft-salvar').disabled"), 'sem a autorização marcada, o botão de salvar fica desligado');
  await P.avalia("document.querySelector('#ft-autoriza').click(); 1");
  ok(!(await P.avalia("document.querySelector('#ft-salvar').disabled")), 'marcou a autorização: o botão liga');
  await tela(P, 'n1-recorte');
  await P.avalia("document.querySelector('#ft-salvar').click(); 1");
  ok(await P.ate("!document.querySelector('#ft-atual').hidden && document.querySelector('#ft-atual-ret').complete && document.querySelector('#ft-atual-ret').naturalWidth === 960"), 'a foto salva aparece no editor (retrato 960 de largura)');
  const ret1 = fs.readFileSync(path.join(s.dados, 'fotos', t, 'retrato-1.jpg')), av1 = fs.readFileSync(path.join(s.dados, 'fotos', t, 'avatar-1.jpg'));
  const i1 = sof(ret1), i2 = sof(av1);
  ok(i1.l === 960 && i1.a === 1280 && i2.l === 400 && i2.a === 400, 'no armazenamento: retrato 960 x 1280 e avatar 400 x 400');
  ok(!i1.app1 && !i2.app1 && !ret1.includes(Buffer.from('Exif')) && !av1.includes(Buffer.from('Exif')) && !ret1.includes(Buffer.from('GPS')), 'o que saiu do recorte não tem EXIF nem GPS (conferido nos bytes)');
  ok(/autorizada por Carla Closer/i.test(await P.avalia("document.querySelector('#ft-atual-info').textContent")) && /Some em \d\d\/\d\d/.test(await P.avalia("document.querySelector('#ft-atual-info').textContent")), 'mostra quem autorizou e a validade ("some em DD/MM")');

  // os outros formatos, pelo recorte do navegador
  const viaRecorte = async (arq, nome) => {
    await P.avalia("document.querySelector('#ft-erro').textContent = ''; 1");
    await P.arquivos('#ft-arquivo', [F(arq)]);
    const abriu = await P.ate("!document.querySelector('#ft-recorte').hidden || document.querySelector('#ft-erro').textContent", 15000);
    const erro = await P.avalia("document.querySelector('#ft-erro').textContent");
    if (erro || !abriu) return { erro: erro || 'não abriu' };
    await P.avalia("document.querySelector('#ft-autoriza').click(); document.querySelector('#ft-salvar').click(); 1");
    const salvou = await P.ate("document.querySelector('#ft-recorte').hidden || document.querySelector('#ft-erro').textContent", 20000);
    return { salvou, erro: await P.avalia("document.querySelector('#ft-erro').textContent") };
  };
  const png = await viaRecorte('quadrada.png');
  ok(png.salvou && !png.erro, 'PNG (1200 x 1200): o recorte transforma em JPEG 3:4 e salva');
  const g5 = await viaRecorte('grande-5000.jpg');
  ok(g5.salvou && !g5.erro, 'imagem de 5000 x 5000: reduz no navegador e salva');
  const p8 = await viaRecorte('pesada-8mb.jpg');
  ok(p8.salvou && !p8.erro, 'JPEG de uns 9 MB: o recorte sai leve e salva');
  const htm = await viaRecorte('html.jpg');
  ok(htm.erro && /não abriu/i.test(htm.erro), 'HTML com nome de .jpg: "essa foto não abriu" e nada é enviado (' + htm.erro.slice(0, 40) + '...)');
  const corr = await viaRecorte('corrompida.jpg');
  ok(corr.erro && /incompleta/i.test(corr.erro), 'JPEG cortado no meio: o painel recusa antes do recorte ("essa foto está incompleta") e nada é enviado');
  const nVersoes = fs.readdirSync(path.join(s.dados, 'fotos', t));
  ok(nVersoes.length === 2, 'trocar a foto apaga a anterior: só a versão atual no armazenamento (' + nVersoes.join(', ') + ')');

  /* ---------- a ficha até "Pronto" ---------- */
  for (const [k, v] of [['posicao', 'zagueiro'], ['idade', '15'], ['cidade', 'Natal'], ['pe', 'Destro'], ['altura', '178'], ['origem', 'Zyron'], ['caracteristicas', 'leitura de jogo'],
    ['sonho', 'jogar na Europa'], ['plano', 'Assessoria de Elite Legacy'], ['vagas', '4'], ['r2data', '2026-10-15'], ['r2hm', '19:30'], ['gerente', 'Rafael'], ['prazoContato', 'ainda hoje'], ['prazoZyron', 'no dia seguinte']]) await poe(k, v);
  ok(/Reconhecida no campo: ZAG-d/.test(await P.avalia("document.querySelector('#selo-pos').textContent")), 'o selo da posição: "Reconhecida no campo: ZAG-d"');
  ok((await P.avalia("document.querySelector('#ex-call').textContent")) === 'Na capa: Call de quinta, 15/10 · 19h30.', 'a call formatada: quinta, 15/10 · 19h30');
  await P.avalia("document.querySelector('#c-conferido').click(); 1");
  await P.avalia("document.querySelector('#ed-salvar').click(); 1");
  ok(await P.ate("document.querySelector('#ed-estado').textContent === 'Pronto' && !document.querySelector('#ed-salvo').classList.contains('sujo')"), 'salvou: a etiqueta vira "Pronto" (foto, nome conferido, posição, plano, dia e hora)');

  /* ---------- sair com mudança não salva avisa, e o 409 não perde o que foi digitado ---------- */
  await poe('cidade', 'Recife');
  P.dialogo.aceita = false;
  await P.avalia("location.hash = '#/'; 1"); await espera(400);
  ok(P.dialogo.ultimos.some(m => /não salva/i.test(m)) && (await P.avalia('location.hash')) === '#/r2/' + t && (await P.avalia("document.querySelector('#f-editor').elements.cidade.value")) === 'Recife', 'sair com mudança não salva: pergunta, e ficando, o que foi digitado continua');
  P.dialogo.aceita = true;
  const atual = (await carla.get('/api/atletas?t=' + t)).j.registro;
  await carla.put('/api/atletas?t=' + t, { ficha: Object.assign({}, atual.ficha, { sonho: 'jogar no Grêmio' }), base: atual.fichaEm, conferido: { nome: true } });
  await P.avalia("document.querySelector('#ed-salvar').click(); 1");
  ok(await P.ate("document.querySelector('#d-conflito').open"), 'outra pessoa salvou antes: o 409 abre o diálogo');
  ok(/Carla Closer salvou esta ficha/.test(await P.avalia("document.querySelector('#dc-texto').textContent")) && (await P.avalia("document.querySelector('#f-editor').elements.cidade.value")) === 'Recife', 'o diálogo diz quem salvou e quando, e o que foi digitado continua no formulário');
  await tela(P, 'n2-conflito');
  await P.avalia("document.querySelector('#dc-sobrescrever').click(); 1");
  ok(await P.ate("!document.querySelector('#ed-salvo').classList.contains('sujo') && !document.querySelector('#d-conflito').open"), 'sobrescrever salva');
  ok((await carla.get('/api/atletas?t=' + t)).j.registro.ficha.cidade === 'Recife', 'no servidor ficou o que foi sobrescrito');

  /* ---------- a prévia ---------- */
  ok(await P.ate("!!document.querySelector('#pv') && document.querySelectorAll('.pv-bt').length === 5", 10000), 'a prévia carrega o deck de verdade num quadro');
  await espera(2500);
  for (const nome of ['Capa', 'Por que você', 'O seu lugar em campo', 'Bem-vindo']) {
    await P.avalia(`(() => { const b = [...document.querySelectorAll('.pv-bt')].find(x => x.dataset.pv === ${JSON.stringify(nome)}); b.click(); return 1; })()`);
    await espera(900);
    await tela(P, 'n3-previa-' + nome.replace(/\W+/g, '-').toLowerCase());
  }
  ok(await P.ate("[...document.querySelectorAll('#checklist li.ok')].length === 6", 8000), 'abriu os 4 slides na prévia: o checklist marca "Prévia olhada" (6 de 6)');

  /* ---------- o link e o R2 aberto por ele ---------- */
  const link = await P.avalia("document.querySelector('#lk-url').value");
  ok(link === s.deck + '/?a=' + t, 'o link é o deck com ?a=<código> (' + link.replace(s.deck, '…') + ')');
  const Fam = await nav.aba(link + '#2', { largura: 1920, altura: 1080 });
  ok(await Fam.ate("(() => { const i = document.querySelector('#stage > .slide.active img[data-src=\"selecaoFotoUrl\"]'); return i && i.complete && i.naturalWidth === 960; })()", 12000), 'o R2 pelo link mostra o retrato no slide de escolha');
  ok(/Dossiê · Lucas Silva/.test(await Fam.avalia("document.querySelector('.selo').textContent")) && /Montado para Lucas Almeida da Silva/.test(await Fam.avalia("document.querySelector('.cp-montado').textContent")), 'e o nome: "Dossiê · Lucas Silva" e "Montado para Lucas Almeida da Silva."');
  await tela(Fam, 'n4-r2-capa');

  /* ---------- presença: dois apresentadores no mesmo link ---------- */
  const Pz1 = await nav.aba(link + '&presenter');
  ok(await Pz1.ate("/Foto do painel: sim, autorizada até \\d\\d\\/\\d\\d/.test(document.querySelector('#pz-status').textContent) && /Link vale até \\d\\d\\/\\d\\d/.test(document.querySelector('#pz-status').textContent)", 12000), 'o apresentador mostra "Foto do painel: sim, autorizada até DD/MM" e "Link vale até DD/MM"');
  ok(await carla.get('/api/atletas?t=' + t).then(x => !!x.j.emCall), 'o painel vê "em call agora"');
  const Pz2 = await nav.aba(link + '&presenter');
  ok(await Pz2.ate("document.querySelector('#pz-presenca').style.display === 'flex' && /já está aberto em outro lugar desde \\d\\d:\\d\\d/.test(document.querySelector('#pz-presenca').textContent)", 12000), 'o segundo apresentador avisa: "Este R2 já está aberto em outro lugar desde HH:MM", com Assumir');
  await tela(Pz2, 'n5-presenca');
  await Pz1.envia('Page.close');
  await espera(1200);
  await Pz2.avalia("document.querySelector('#pz-atualizar').click(); 1");
  ok(await Pz2.ate("document.querySelector('#pz-presenca').style.display === 'none'", 20000), 'fechou o primeiro: o aviso some no segundo');

  /* ---------- trocar a foto e ver no R2 com "Atualizar do painel" ---------- */
  const nAntes = (await carla.get('/api/atletas?t=' + t)).j.registro.foto.versao;
  await P.avalia("document.querySelector('#ft-trocar').scrollIntoView(); 1");
  const tr = await viaRecorte('fonte-a.png');
  ok(tr.salvou && !tr.erro, 'troca a foto no painel');
  const nDepois = (await carla.get('/api/atletas?t=' + t)).j.registro.foto.versao;
  ok(nDepois === nAntes + 1, 'a versão sobe (' + nAntes + ' → ' + nDepois + ')');
  await Pz2.avalia("document.querySelector('#pz-atualizar').click(); 1");
  ok(await Fam.ate(`(() => { const i = document.querySelector('#stage > .slide.active img[data-src="selecaoFotoUrl"]'); return i && /&n=${nDepois}$/.test(i.getAttribute('src')) && i.complete && i.naturalWidth === 960; })()`, 12000), '"Atualizar do painel" no apresentador: a tela da família troca pra foto nova');

  /* ---------- painel fora do ar: a família segue com a ficha guardada, sem erro ---------- */
  await Fam.envia('Network.enable');
  await Fam.envia('Network.setBlockedURLs', { urls: [s.painel + '/*'] });
  await Fam.vai('about:blank'); await Fam.vai(link + '#2');
  await espera(2500);
  const famTxt = await Fam.avalia("document.body.innerText");
  ok(/LUCAS SILVA[\s\S]*VOCÊ FOI/i.test(famTxt) && !/erro|não consegui|indisponível/i.test(famTxt) && !(await Fam.avalia("!!document.querySelector('#je-inativo')")), 'painel fora do ar: a família vê o deck com a ficha guardada deste link e nenhum erro');
  await Fam.envia('Network.setBlockedURLs', { urls: [] });

  /* ---------- "Encerrar e limpar" ---------- */
  ok(await Fam.avalia(`!!localStorage.getItem('je-r2-ficha:${t}')`), 'antes de encerrar, a ficha deste link está no navegador');
  await Pz2.avalia("document.querySelector('#pz-encerrar').click(); 1");
  await espera(800);
  ok(!(await Fam.avalia(`localStorage.getItem('je-r2-ficha:${t}')`)), '"Encerrar e limpar" apaga a ficha deste link do navegador');
  let emCall = true; // a presença sai do painel logo depois do "Encerrar" (espera até sair, com teto)
  for (let i = 0; i < 60 && emCall; i++) { emCall = !!(await carla.get('/api/atletas?t=' + t)).j.emCall; if (emCall) await espera(250); }
  ok(!emCall, 'e a presença sai do painel (fim)');

  // a lista
  await P.avalia("location.hash = '#/'; 1");
  ok(await P.ate("document.querySelectorAll('#lista .item').length === 1 && /Pronto/.test(document.querySelector('#lista .item').textContent)", 8000), 'a lista mostra o R2 com a etiqueta');
  await tela(P, 'n6-lista');
  const exc = [P, Fam, Pz2].flatMap(a => a.console_.filter(m => /^EXC/.test(m)));
  ok(!exc.length, 'nenhuma exceção de JavaScript' + (exc.length ? ': ' + exc.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha();
  await s.fecha();
  fs.rmSync(fotos, { recursive: true, force: true });
}
fim();
