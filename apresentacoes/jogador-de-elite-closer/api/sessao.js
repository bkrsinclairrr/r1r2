// Sessão do painel, numa rota só (o plano da Vercel limita as funções por deploy):
// GET            quem está logado, e o endereço do deck (o painel abre direto na lista se a sessão ainda vale)
// POST           { login, senha } entra (cookie HttpOnly de 12 horas)
// DELETE         sai
// PUT            { atual, nova } troca a própria senha (vale pra qualquer usuário, inclusive o admin das variáveis)
import { achaUsuario, confereSenha, abreSessao, fechaSessao, exige, manda, corpo, espera, ehJson, hashSenha, mudaUsuarios, PAPEIS, ETAPAS_DO_PAPEL, DECK_URL, DRIVER, registraErro } from './_base.js';
import { decksDoCatalogo } from './_decks.js';

// deckUrl: o R2 novo (de antes do R1). decks: cada deck do catálogo, com a origem (as telas abrem exemplo e prévia por ela); etapas: o que o
// papel monta (o SDR o R1, o closer o R2, o admin as duas)
const config = papel => ({
  deckUrl: DECK_URL, armazenamento: DRIVER, etapas: ETAPAS_DO_PAPEL[papel] || [],
  decks: decksDoCatalogo().map(d => ({ id: d.id, nome: d.nome, etapa: d.etapa, origem: d.origem, entrada: d.entrada, prefixo: d.prefixo, recursos: d.recursos, leadTxt: d.leadTxt || '' }))
});

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const eu = await exige(req, res);
      if (!eu) return;
      return manda(res, 200, { usuario: Object.assign({ papelNome: PAPEIS[eu.papel] || eu.papel }, eu), config: config(eu.papel) });
    }
    if (req.method === 'POST') {
      if (!ehJson(req)) return manda(res, 415, { erro: 'Pedido em formato inválido.' });
      const b = await corpo(req);
      const u = await achaUsuario(b.login);
      const ok = confereSenha(b.senha, u && u.hash); // sem usuário, confere contra um hash falso: mesmo tempo de resposta
      if (!u || !ok) {
        await espera(600 + Math.random() * 400);
        return manda(res, 401, { erro: 'Usuário ou senha não conferem.' });
      }
      abreSessao(res, u);
      return manda(res, 200, { ok: true, usuario: { login: u.login, nome: u.nome, papel: u.papel, papelNome: PAPEIS[u.papel] || u.papel }, config: config(u.papel) });
    }
    if (req.method === 'DELETE') {
      fechaSessao(res);
      return manda(res, 200, { ok: true });
    }
    if (req.method === 'PUT') {
      const eu = await exige(req, res);
      if (!eu) return;
      const b = await corpo(req);
      const nova = String(b.nova || '');
      const u = await achaUsuario(eu.login);
      if (!u || !confereSenha(b.atual, u.hash)) { await espera(500); return manda(res, 400, { erro: 'A senha atual não confere.' }); }
      if (nova.length < 10) return manda(res, 400, { erro: 'A senha nova precisa de pelo menos 10 caracteres.' });
      const hash = hashSenha(nova);
      await mudaUsuarios(lista => {
        const i = lista.findIndex(x => x.login === eu.login);
        if (i < 0) lista.push({ login: eu.login, nome: u.nome, papel: u.papel, hash, criadoEm: new Date().toISOString() });
        else lista[i].hash = hash;
      });
      return manda(res, 200, { ok: true });
    }
    manda(res, 405, { erro: 'Pedido não aceito.' });
  } catch (e) {
    registraErro('sessao', e);
    manda(res, 500, { erro: 'O painel não conseguiu conferir agora. Tente de novo em instantes.' });
  }
}
