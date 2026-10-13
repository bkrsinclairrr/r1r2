// A atualização em cima do que o painel já guardou: o versoes.json de antes (um deck só, em "deck"; variações criadas sem "etapa") e os leads de
// antes (sem "etapa", que eram todos R2) seguem valendo no painel de duas etapas e quatro decks. Nada se perde (a classificação e a nota do admin, a
// variação criada, o R2 que já usa ela) e, na primeira gravação, o campo "deck" vira "decks.r2". Os arquivos de antes são escritos à mão ANTES do
// primeiro pedido ao painel, como num deploy novo em cima da loja de antes.
// Uso: node testes/teste-migracao.mjs
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZES } from './servidor.mjs';
import { Cliente, verificador } from './_util.mjs';

const { ok, fim } = verificador('Atualização sobre os dados de antes');
const s = await sobe({ deck: true, decks: ['r2-anterior', 'r2-b', 'r1'] });
const dado = (...p) => path.join(s.dados, ...p);
const lePasta = p => JSON.parse(fs.readFileSync(p, 'utf8'));
try {
  // o versoes.json de antes: o formato da rodada da sincronização (só o R2 novo, em "deck"; as criadas sem etapa)
  const manifesto = lePasta(path.join(RAIZES.r2, 'variacoes.json'));
  const antes = new Date(Date.now() - 3600e3).toISOString();
  const paginas = manifesto.paginas.map(p => ({ id: p.id, caminho: p.caminho, nome: p.nome, resumo: p.resumo, quando: p.quando, validacao: p.validacao, lead: p.lead, slides: p.slides, opcionais: p.opcionais, hash: p.hash, visto: antes }));
  const saude = Object.fromEntries(paginas.map(p => [p.id, { ok: true, motivo: '', desatualizado: false, falhas: 0, em: antes, ms: 40 }]));
  const SLUG = 'tecnica-curta-k7m2';
  const antigo = {
    v: 1,
    ajustes: { principal: { validacao: 'validada', nota: 'fechou 5 de 8 calls', por: 'Admin (admin)', em: antes } },
    criadas: [{ id: SLUG, nome: 'Técnica curta', base: 'tecnica', quando: 'Lead com pouco tempo', validacao: 'em-validacao', nota: '', lead: { nome: true, foto: false },
      arquivada: false, criadoPor: 'Admin (admin)', criadoEm: antes, por: 'Admin (admin)', em: antes }],
    deck: { em: antes, origem: s.decks.r2, falha: '', okEm: antes, gerado: String(manifesto.gerado || ''), paginas, saude, sumiram: {} }
  };
  fs.writeFileSync(dado('versoes.json'), JSON.stringify(antigo));

  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  const SENHA = 'senha-boa-123456';
  for (const [login, nome, papel] of [['carla.closer', 'Carla Closer', 'closer'], ['rafa.sdr', 'Rafa SDR', 'sdr']]) await admin.post('/api/usuarios', { login, nome, papel, senha: SENHA });
  const carla = new Cliente(s.painel), rafa = new Cliente(s.painel);
  await carla.entra('carla.closer', SENHA);
  await rafa.entra('rafa.sdr', SENHA);

  // um R2 de antes: na variação que o admin criou (o pedido lê o versoes.json de antes), e depois sem a etapa, como era
  const hoje = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
  const novo = await carla.post('/api/atletas', { ficha: { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: 'Assessoria PRO', r2data: hoje, r2hm: '19:30', versao: SLUG } });
  ok(novo.status === 201 && novo.j.registro.ficha.versao === SLUG, 'a variação criada no formato de antes (sem etapa) vale pro R2 novo: o closer escolhe ela e o lead nasce nela');
  const t = novo.j.t;
  const arqLead = dado('atletas', t + '.json'), arqIndice = dado('indices', 'carla.closer.json');
  const reg = lePasta(arqLead); delete reg.etapa; fs.writeFileSync(arqLead, JSON.stringify(reg));
  const ind = lePasta(arqIndice); Object.values(ind).forEach(it => { delete it.etapa; }); fs.writeFileSync(arqIndice, JSON.stringify(ind));
  ok(!('etapa' in lePasta(arqLead)) && Object.values(lePasta(arqIndice)).every(it => !('etapa' in it)), 'o lead e o índice ficam sem etapa, como eram antes do painel de duas etapas');

  // o painel lê o que já tinha: o ajuste do admin, a variação criada e o deck de antes
  const l1 = (await admin.get('/api/versoes')).j;
  const vp = l1.versoes.find(v => v.id === 'principal'), vc = l1.versoes.find(v => v.id === SLUG);
  ok(vp && vp.validacao === 'validada' && vp.nota === 'fechou 5 de 8 calls' && vp.etapa === 'r2' && vp.deck === 'r2', 'a classificação e a nota que o admin deu à Principal seguem valendo (e ela é do R2, deck R2 novo)');
  ok(vc && vc.criada === true && vc.base === 'tecnica' && vc.etapa === 'r2' && vc.deck === 'r2' && vc.caminho === '/variacoes/tecnica/' && vc.lead.foto === false, 'a variação criada segue lá, na página da base, agora com a etapa e o deck (R2, R2 novo) deduzidos da base');
  ok(l1.decks.length === 4 && l1.decks.every(d => d.fonte === 'deck' && d.falhou === false && d.problemas === 0), 'a primeira abertura da lista sincroniza os 4 decks (o de antes tinha só o R2 novo), sem problema');
  ok(l1.versoes.some(v => v.id === 'r1-principal') && l1.versoes.some(v => v.id === 'r2a-tecnica') && l1.versoes.some(v => v.id === 'r2b-principal'), 'e as variações dos outros 3 decks aparecem');

  // na primeira gravação o "deck" de antes vira "decks.r2", e nada do que era do admin se perde
  const depois = lePasta(dado('versoes.json'));
  ok(!('deck' in depois) && depois.decks && Object.keys(depois.decks).sort().join() === 'r1,r2,r2-anterior,r2-b', 'o campo deck de antes virou decks, com os 4 decks');
  ok(depois.ajustes.principal && depois.ajustes.principal.validacao === 'validada' && depois.ajustes.principal.nota === 'fechou 5 de 8 calls' && depois.criadas.length === 1 && depois.criadas[0].id === SLUG, 'os ajustes e a variação criada continuam no arquivo, do jeito que estavam');
  ok(depois.decks.r2.paginas.every(p => p.visto === antes), 'o "visto pela primeira vez" de cada página do R2 novo foi mantido (nenhuma vira "nova no deck" por causa da atualização)');

  // o R2 de antes (sem etapa) abre na variação dele, no deck dele, pelos dois endereços
  const pub = new Cliente(s.painel);
  const r = await pub.get('/api/r2?t=' + t);
  ok(r.status === 200 && r.j.estado === 'ok' && r.j.versao.id === SLUG && r.j.versao.caminho === '/variacoes/tecnica/' && r.j.versao.origem === s.decks.r2 && r.j.ficha.nome === 'Lucas Almeida da Silva', 'o R2 sem etapa abre pelo /api/r2 na variação criada (página da técnica, deck R2 novo)');
  const leg = await pub.get('/api/publico?id=' + t);
  ok(leg.status === 200 && leg.j.id === t && leg.j.ficha.nome === 'Lucas Almeida da Silva', 'e pelo /api/publico?id= dos decks de antes');

  // as listas: o lead sem etapa é R2 (o closer e o admin veem, o SDR não)
  const lc = (await carla.get('/api/atletas')).j.itens, la = (await admin.get('/api/atletas?todos=1')).j.itens, lr = (await rafa.get('/api/atletas')).j.itens;
  ok(lc.length === 1 && lc[0].t === t && lc[0].etapa === 'r2' && la.some(x => x.t === t && x.etapa === 'r2') && !lr.some(x => x.t === t), 'na lista, o lead sem etapa é R2: a closer e o admin veem, o SDR não');
  const ver = await carla.get('/api/atletas?t=' + t);
  ok(ver.status === 200 && ver.j.etapa === 'r2' && ver.j.registro.ficha.versao === SLUG && ver.j.link.startsWith(s.decks.r2 + '/?a='), 'a closer abre o editor dele (etapa R2, link do deck de entrada do R2)');
  ok((await rafa.get('/api/atletas?t=' + t)).status === 403, 'o SDR não abre um R2 (403)');

  // salvar um lead de antes grava a etapa, e o painel segue funcionando
  const salva = await carla.put('/api/atletas?t=' + t, { ficha: Object.assign({}, ver.j.registro.ficha, { cidade: 'Natal' }), base: ver.j.registro.fichaEm });
  ok(salva.status === 200 && salva.j.registro.ficha.cidade === 'Natal' && salva.j.registro.ficha.versao === SLUG, 'salvar o lead de antes funciona e a variação continua a mesma');
  const r2 = await pub.get('/api/r2?t=' + t);
  ok(r2.status === 200 && r2.j.ficha.cidade === 'Natal', 'e o que foi salvo chega ao deck');

  // a variação criada segue podendo ser ajustada e arquivada (o arquivo já está no formato novo e continua legível)
  const aj = await admin.put('/api/versoes?id=' + SLUG, { nota: 'ajustada depois da atualização' });
  ok(aj.status === 200 && aj.j.versoes.find(v => v.id === SLUG).nota === 'ajustada depois da atualização', 'o admin ajusta a variação criada depois da atualização');
  const final = lePasta(dado('versoes.json'));
  ok(!('deck' in final) && final.criadas[0].nota === 'ajustada depois da atualização' && final.ajustes.principal.nota === 'fechou 5 de 8 calls', 'e o arquivo segue no formato novo, com tudo no lugar');
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await s.fecha();
}
fim();
