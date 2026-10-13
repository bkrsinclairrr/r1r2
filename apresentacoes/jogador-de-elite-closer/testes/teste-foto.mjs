// Teste da foto pela API (o recorte no navegador está em teste-navegador.mjs). Driver de arquivo, nada sai da máquina.
// Uso: node testes/teste-foto.mjs
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZ_DECK } from './servidor.mjs';
import { Cliente, verificador, fotosDeTeste, b64 } from './_util.mjs';

const s = await sobe({ deck: false });
const { ok, fim } = verificador('Foto pela API');
const fotos = fotosDeTeste(RAIZ_DECK);
const F = n => path.join(fotos, n);
const arqDados = (...p) => path.join(s.dados, ...p);
const mexe = (t, muda) => { const a = arqDados('atletas', t + '.json'); const d = JSON.parse(fs.readFileSync(a, 'utf8')); muda(d); fs.writeFileSync(a, JSON.stringify(d)); };

try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  for (const [l, n] of [['ana.closer', 'Ana Closer'], ['beto.closer', 'Beto Closer']]) await admin.post('/api/usuarios', { login: l, nome: n, papel: 'closer', senha: 'senha-de-teste-123' });
  const ana = new Cliente(s.painel), beto = new Cliente(s.painel), pub = new Cliente(s.painel);
  await ana.entra('ana.closer', 'senha-de-teste-123');
  await beto.entra('beto.closer', 'senha-de-teste-123');
  const t = (await ana.post('/api/atletas', { ficha: { nome: 'Lucas Almeida', posicao: 'zagueiro' } })).j.t;
  const manda = (ret, av, extra) => ana.put('/api/foto?t=' + t, Object.assign({ retrato: ret, avatar: av, autorizo: true }, extra));
  const ret = b64(F('retrato-a.jpg')), av = b64(F('avatar-a.jpg'));

  const bom = await manda(ret, av);
  ok(bom.status === 200 && bom.j.registro.foto.versao === 1 && bom.j.registro.foto.autorizadoPor === 'Ana Closer (ana.closer)', 'JPEG bom: aceito, versão 1, com quem autorizou e quando');
  ok(bom.j.checklist.foto === true, 'o checklist marca a foto com autorização');
  const semAut = await ana.put('/api/foto?t=' + t, { retrato: ret, avatar: av });
  ok(semAut.status === 400 && /autorização/.test(semAut.j.erro), 'sem a autorização marcada: recusa (400)');
  const png = await manda(b64(F('png-disfarcado.jpg')), av);
  ok(png.status === 400 && /JPEG/.test(png.j.erro), 'PNG com nome de .jpg: recusa (400)');
  const html = await manda(b64(F('html.jpg')), av);
  ok(html.status === 400, 'HTML com nome de .jpg: recusa (400)');
  const corr = await manda(b64(F('corrompida.jpg')), av);
  ok(corr.status === 400, 'JPEG corrompido (cortado no meio): recusa (400)');
  const exif = await manda(b64(F('exif-gps.jpg')), av);
  ok(exif.status === 400 && /EXIF/.test(exif.j.erro), 'JPEG com EXIF e GPS: recusa (400), a foto tem que passar pelo recorte');
  const grande = await manda(b64(F('grande-5000.jpg')), av);
  ok(grande.status === 400 && /960 x 1280/.test(grande.j.erro), 'imagem de 5000 x 5000: recusa (400), o tamanho tem que ser o do recorte');
  const torto = await manda(b64(F('retrato-torto.jpg')), av);
  ok(torto.status === 400, 'retrato com 961 x 1280 (um pixel a mais): recusa (400)');
  const pesado = await manda(b64(F('retrato-pesado.jpg')), av);
  ok(pesado.status === 400 && /600 KB/.test(pesado.j.erro), 'retrato com mais de 600 KB: recusa (400)');
  const oito = await manda(b64(F('pesada-8mb.jpg')), av);
  ok(oito.status === 413, 'foto de 8 MB: o pedido passa do limite da função e volta 413');
  const avTroca = await manda(ret, ret);
  ok(avTroca.status === 400 && /avatar/i.test(avTroca.j.erro), 'retrato no lugar do avatar: recusa (400)');
  const lixo = await manda('isso-nao-e-base64!!', av);
  ok(lixo.status === 400, 'base64 inválido: recusa (400)');
  const deOutro = await beto.put('/api/foto?t=' + t, { retrato: ret, avatar: av, autorizo: true });
  ok(deOutro.status === 403, 'closer mandando foto no atleta de outro closer: recusa (403)');
  ok(fs.readdirSync(arqDados('fotos', t)).sort().join(',') === 'avatar-1.jpg,retrato-1.jpg', 'nenhuma recusa deixou arquivo no armazenamento');

  // trocar a foto: versão e endereço novos, a anterior some
  const troca = await manda(b64(F('retrato-b.jpg')), b64(F('avatar-b.jpg')));
  ok(troca.status === 200 && troca.j.registro.foto.versao === 2, 'trocar a foto: versão 2');
  ok((await pub.get('/api/foto?t=' + t + '&v=retrato&n=1')).status === 404 && (await pub.get('/api/foto?t=' + t + '&v=retrato&n=2')).status === 200, 'o endereço muda com a versão: n=1 dá 404 e n=2 serve');
  ok(fs.readdirSync(arqDados('fotos', t)).sort().join(',') === 'avatar-2.jpg,retrato-2.jpg', 'a versão anterior foi apagada do armazenamento');
  const servida = (await pub.get('/api/foto?t=' + t + '&v=avatar&n=2')).buf;
  ok(Buffer.compare(servida, fs.readFileSync(F('avatar-b.jpg'))) === 0, 'o avatar servido é byte a byte o que foi enviado');
  ok((await pub.get('/api/foto?t=' + t + '&v=outra&n=2')).status === 404 && (await pub.get('/api/foto?t=' + t + '&v=retrato')).status === 404, 'tipo inválido ou sem versão: 404');

  // vencida, sem autorização e revogada: 404 pra família; o dono vê no painel com o link revogado
  mexe(t, d => { d.foto.venceEm = new Date(Date.now() - 1000).toISOString(); });
  ok((await pub.get('/api/foto?t=' + t + '&v=retrato&n=2')).status === 404, 'foto vencida (90 dias): 404');
  ok(!(await pub.get('/api/r2?t=' + t)).j.foto, 'foto vencida não vai na /api/r2');
  mexe(t, d => { d.foto.venceEm = new Date(Date.now() + 864e5).toISOString(); delete d.foto.autorizadoEm; });
  ok((await pub.get('/api/foto?t=' + t + '&v=retrato&n=2')).status === 404, 'foto sem autorização registrada: 404');
  mexe(t, d => { d.foto.autorizadoEm = new Date().toISOString(); });
  await ana.post('/api/link?t=' + t + '&acao=revogar', {});
  ok((await pub.get('/api/foto?t=' + t + '&v=retrato&n=2')).status === 404, 'link revogado: 404 pra família');
  ok((await ana.get('/api/foto?t=' + t + '&v=retrato&n=2')).status === 200, 'link revogado: a dona ainda vê no painel (logada)');
  ok((await beto.get('/api/foto?t=' + t + '&v=retrato&n=2')).status === 404, 'link revogado: outro closer logado não vê (404)');
  await ana.post('/api/link?t=' + t + '&acao=reativar', {});
  ok((await pub.get('/api/foto?t=' + t + '&v=retrato&n=2')).status === 200, 'reativado: a foto volta');

  // a foto só vai na /api/r2 quando a tela dela mostra: com a foto fora da tela (semFoto, do closer ou da variação), o deck nem fica sabendo que
  // ela existe (vale também pros decks que não conhecem o semFoto, como o R2 B)
  const publico = async () => (await pub.get('/api/r2?t=' + t)).j;
  const salvaFicha = async muda => {
    const reg = (await ana.get('/api/atletas?t=' + t)).j.registro, ficha = Object.assign({}, reg.ficha);
    muda(ficha);
    return ana.put('/api/atletas?t=' + t, { ficha, base: reg.fichaEm });
  };
  const comTela = await publico();
  ok(comTela.foto && comTela.foto.ok === true && comTela.foto.versao === 2 && !('semFoto' in comTela.ficha), 'com a foto na tela, a /api/r2 manda a foto');
  const fora = await salvaFicha(f => { f.semFoto = 'sim'; });
  const semTela = await publico();
  ok(fora.status === 200 && !('foto' in semTela) && semTela.ficha.semFoto === 'sim', 'com a foto fora da tela (semFoto), a /api/r2 não manda a foto');
  ok((await ana.get('/api/atletas?t=' + t)).j.registro.foto.versao === 2, '(e a foto continua guardada no painel)');
  await salvaFicha(f => { delete f.semFoto; });
  ok((await publico()).foto && (await publico()).foto.versao === 2, 'tirando o semFoto, a foto volta');
  const geral = await admin.post('/api/versoes', { nome: 'Sem foto do lead', base: 'principal', lead: { foto: false } });
  await salvaFicha(f => { f.versao = geral.j.criada; });
  const geralPub = await publico();
  ok(geral.status === 201 && !('foto' in geralPub) && geralPub.ficha.semFoto === 'sim', 'numa variação que não mostra a foto do lead, a /api/r2 não manda a foto');
  await salvaFicha(f => { delete f.versao; });
  ok((await publico()).foto && (await publico()).foto.versao === 2, 'voltando pra Principal, a foto volta');

  // apagar a foto e apagar o atleta
  const apagaF = await ana.del('/api/foto?t=' + t);
  ok(apagaF.status === 200 && apagaF.j.registro.foto === null && (!fs.existsSync(arqDados('fotos', t)) || !fs.readdirSync(arqDados('fotos', t)).length), 'apagar a foto: as duas somem');
  await manda(ret, av);
  ok((await ana.del('/api/atletas?t=' + t)).status === 200 && (!fs.existsSync(arqDados('fotos', t)) || !fs.readdirSync(arqDados('fotos', t)).length), 'apagar o atleta: retrato e avatar somem junto');
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await s.fecha();
  fs.rmSync(fotos, { recursive: true, force: true });
}
fim();
