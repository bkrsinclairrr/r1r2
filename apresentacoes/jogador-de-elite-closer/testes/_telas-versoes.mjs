// Telas do painel com as versões (screenshots pra conferir o visual). Uso: node testes/_telas-versoes.mjs <pasta-de-saida>
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZ_DECK } from './servidor.mjs';
import { Cliente, fotosDeTeste, b64 } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const SAIDA = path.resolve(process.argv[2] || 'telas-versoes');
fs.mkdirSync(SAIDA, { recursive: true });
const s = await sobe({ deck: true });
const fotos = fotosDeTeste(RAIZ_DECK);
const nav = await abreNavegador();
try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  const r = await admin.post('/api/atletas', { ficha: { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: 'Assessoria PRO', idade: '15', cidade: 'Natal', versao: 'tecnica', nomeTela: 'primeiro-sobrenome', pular: 'leva', r2data: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10), r2hm: '19:30' } });
  await admin.put('/api/foto?t=' + r.j.t, { retrato: b64(path.join(fotos, 'retrato-a.jpg')), avatar: b64(path.join(fotos, 'avatar-a.jpg')), autorizo: true });
  await admin.post('/api/atletas', { ficha: { nome: 'Pedro Henrique Costa', posicao: 'volante', plano: 'Scouting' } });
  await admin.put('/api/versoes?id=tecnica', { validacao: 'validada', nota: 'Fechou 5 de 8 calls' });
  await admin.put('/api/versoes?id=principal', { validacao: 'em-validacao', nota: 'Deck novo, em teste' });
  const cv = await admin.post('/api/versoes', { nome: 'Técnica sem foto', base: 'tecnica', quando: 'Lead que não autorizou a foto', validacao: 'validada', nota: 'Fechou 2 de 3 até agora', lead: { nome: true, foto: false } });
  await admin.post('/api/versoes', { nome: 'Principal geral', base: 'principal', quando: 'Apresentação sem personalização (grupo, evento)', lead: { nome: false } });
  for (const [nome, largura, altura] of [['desktop', 1500, 1000], ['celular', 390, 844]]) {
    const P = await nav.aba(s.painel + '/', { largura, altura, toque: nome === 'celular' });
    await P.ate("!document.querySelector('#v-entrar').hidden");
    await P.avalia(`(() => { const f = document.querySelector('#f-entrar'); f.login.value = ${JSON.stringify(s.adminLogin)}; f.senha.value = ${JSON.stringify(s.adminSenha)}; f.requestSubmit(); return 1; })()`);
    await P.ate("!document.querySelector('#v-app').hidden && document.querySelectorAll('#lista .item').length > 0");
    await espera(500);
    await P.foto(path.join(SAIDA, nome + '-1-lista.png'));
    await P.avalia("location.hash = '#/versoes'; 1"); await espera(700);
    await P.avalia("document.querySelector('#versoes-lista details[data-v=principal]').open = true; 1"); await espera(300);
    await P.foto(path.join(SAIDA, nome + '-2-versoes.png'));
    if (nome === 'desktop') {
      await P.avalia("document.querySelector('#bt-nova-variacao').click(); document.querySelector('#dv-nome').value = 'Principal sem foto'; document.querySelector('#dv-quando').value = 'Lead sem foto boa'; 1"); await espera(400);
      await P.foto(path.join(SAIDA, nome + '-2c-dialogo.png'));
      await P.avalia("document.querySelector('#dv-cancelar').click(); 1"); await espera(300);
    }
    await P.avalia("document.querySelector('#versoes-lista details[data-v=principal]').scrollIntoView({ block: 'center' }); 1"); await espera(400);
    await P.foto(path.join(SAIDA, nome + '-2b-ajustes.png'));
    await P.avalia("location.hash = '#/r2/" + r.j.t + "'; 1");
    await P.ate("!document.querySelector('#v-editor').hidden && document.querySelector('#versoes input')");
    await espera(4000); // a prévia (o deck, com a ida pra versão) leva um instante
    await P.avalia("document.querySelector('#s-nome').scrollIntoView({ block: 'start' }); window.scrollBy(0, -140); 1"); await espera(400);
    await P.foto(path.join(SAIDA, nome + '-3-nome.png'));
    await P.avalia("document.querySelector('#s-versao').scrollIntoView({ block: 'start' }); window.scrollBy(0, -140); 1"); await espera(400);
    await P.foto(path.join(SAIDA, nome + '-4-versao.png'));
    await P.avalia("document.querySelector('#versoes input[value=principal]').click(); 1"); await espera(400);
    await P.foto(path.join(SAIDA, nome + '-5-versao-trocada.png'));
    await P.avalia("window.scrollTo(0, 0); 1"); await espera(400);
    await P.foto(path.join(SAIDA, nome + '-6-topo.png'));
  }
  console.log('ok', SAIDA);
} finally { await nav.fecha(); await s.fecha(); fs.rmSync(fotos, { recursive: true, force: true }); }
