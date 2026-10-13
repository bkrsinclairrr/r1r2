// As variações como valem agora, das duas etapas (R1, do SDR, e R2, do closer): as páginas que cada deck do catálogo publica (o
// variacoes.json dele, sincronizado sozinho: ver _sincroniza.js) e as que o admin cria no painel, cada uma com classificação (Validada,
// Em validação, Não validada), nota e o que mostra do lead (nome e sobrenome, foto). Quem ajusta e cria é o admin, sem publicar nada.
// Precisa de login.
// GET            { versoes, niveis, decks, deck }  cada papel vê as variações da sua etapa (o SDR as do R1, o closer as do R2, o admin
//                todas), do mais validado ao menos; só o admin recebe quem criou e quem ajustou, e quando. Sincroniza com os decks antes,
//                se a última vez foi há mais de 2 minutos. decks diz como está a sincronização com cada deck da etapa (quando, se
//                falhou, quantas páginas, quantas com problema); deck é o do R2 novo (formato de antes do R1). Cada variação traz etapa,
//                deck, origem, recursos (o que o deck faz com a escolha do painel), saude { ok, motivo, desatualizado, falhas
//                (conferências seguidas com falha), em }, nova (a página apareceu no deck há pouco) e sumiu (saiu do deck).
// POST ?acao=sincronizar   só o admin: sincroniza agora e devolve o mesmo que o GET.
// POST           { nome, base, quando?, validacao?, nota?, lead?: { nome?, foto? } }  só o admin: cria uma variação sobre a página
//                de um deck (a base; a etapa é a dela), gera o slug e devolve { criada: <slug>, versoes, niveis }.
// PUT ?id=       { validacao?, nota?, lead?, arquivada?, nome?, quando? }  só o admin; devolve { versoes, niveis }.
//                lead.nome: aparece o nome e o sobrenome do lead; lead.foto: aparece a foto dele (só vale com o nome). Só nos decks
//                que seguem a escolha (recursos): num deck que não segue, o nome sempre aparece e a foto nunca.
//                arquivada: some pros closers e SDRs (os leads que já usam ela continuam); a principal de cada etapa não arquiva.
//                nome e quando só mudam nas criadas no painel.
// Página nova com texto e slides próprios entra no deck dela (pasta + bloco r2-variacao + gera-manifesto.mjs) e o painel descobre
// sozinho: ver COMO-ACRESCENTAR-VERSAO.md.
import { exige, manda, corpo, textoLimpo, leVersoes, lePainelVersoes, mudaVersoes, montaVersoes, novoSlug, quem, ETAPAS_DO_PAPEL, R, registraErro } from './_base.js';
import { sincroniza, sincronizaSeVelho } from './_sincroniza.js';
import { decksDoCatalogo } from './_decks.js';

// o limite é das ativas (as arquivadas liberam vaga); o arquivo guarda no máximo 300, contando as arquivadas
const LIMITE_ATIVAS = 60, LIMITE_GUARDADAS = 300;
// as variações que o papel vê: as da etapa dele (o admin vê as duas)
const visiveis = (lista, papel) => lista.filter(v => (ETAPAS_DO_PAPEL[papel] || []).includes(v.etapa || 'r2'));
const saida = (lista, admin) => R.ordenaVersoes(lista).map(v => {
  const o = { id: v.id, etapa: v.etapa, deck: v.deck, origem: v.origem, recursos: v.recursos, nome: v.nome, caminho: v.caminho, resumo: v.resumo, quando: v.quando, opcionais: v.opcionais, validacao: v.validacao, nota: v.nota, lead: v.lead, arquivada: v.arquivada, criada: v.criada, base: v.base,
    saude: v.saude ? { ok: v.saude.ok, motivo: v.saude.motivo, desatualizado: v.saude.desatualizado, falhas: v.saude.falhas, em: v.saude.em } : null, nova: !!v.nova, sumiu: !!v.sumiu };
  if (admin) { o.ajustadoPor = v.ajustadoPor; o.ajustadoEm = v.ajustadoEm; o.criadoPor = v.criadoPor; o.criadoEm = v.criadoEm; }
  return o;
});
// como está a sincronização com um deck (sem nada que o closer não deva ver). O detalhe técnico da falha só vai pro admin: pro closer
// e pro SDR basta saber que falhou
const sobreODeck = (d, estado, lista, admin) => {
  const paginas = lista.filter(v => v.deck === d.id && !v.criada && !v.sumiu);
  return {
    id: d.id, nome: d.nome, etapa: d.etapa, origem: d.origem, em: estado ? estado.em : '', okEm: estado ? estado.okEm : '', falhou: !!(estado && estado.falha),
    falha: admin && estado ? estado.falha : '', gerado: estado ? estado.gerado : '', fonte: estado && estado.okEm ? 'deck' : 'codigo',
    paginas: paginas.length, problemas: paginas.filter(v => v.saude && v.saude.ok === false).length,
    desatualizadas: paginas.filter(v => v.saude && v.saude.desatualizado).length, sumiram: lista.filter(v => v.deck === d.id && !v.criada && v.sumiu).length
  };
};
// papel: o que ele vê dos decks (os da etapa dele). O deck, no singular, é o do R2 novo (o formato de antes do R1)
const resposta = async (extra, papel = 'admin') => {
  const { lista, decks } = await lePainelVersoes(true);
  const admin = papel === 'admin';
  const dosDecks = decksDoCatalogo().filter(d => (ETAPAS_DO_PAPEL[papel] || []).includes(d.etapa)).map(d => sobreODeck(d, decks[d.id], lista, admin));
  return Object.assign({ versoes: saida(visiveis(lista, papel), admin), niveis: R.VALIDACOES, decks: dosDecks, deck: dosDecks.find(x => x.id === 'r2') || null }, extra);
};
const mesmoNome = (a, b) => R.semAcento(a) === R.semAcento(b);

// o lead do pedido: só booleanos de verdade; null se o formato não serve
function leadDoPedido(l) {
  if (!l || typeof l !== 'object' || Array.isArray(l)) return null;
  const out = {};
  if (l.nome !== undefined) out.nome = l.nome === true;
  if (l.foto !== undefined) out.foto = l.foto === true;
  return out;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const eu = await exige(req, res);
      if (!eu) return;
      await sincronizaSeVelho(); // nunca lança; se um deck não responde, fica a última lista boa dele
      return manda(res, 200, await resposta({}, eu.papel));
    }

    if (req.method === 'POST' && String((req.query && req.query.acao) || '') === 'sincronizar') {
      const eu = await exige(req, res, { admin: true });
      if (!eu) return;
      await sincroniza();
      return manda(res, 200, await resposta());
    }

    if (req.method === 'POST') {
      const eu = await exige(req, res, { admin: true });
      if (!eu) return;
      const b = await corpo(req);
      const nome = textoLimpo(b.nome, 40);
      if (nome.length < 2) return manda(res, 400, { erro: 'Dê um nome pra variação (de 2 a 40 letras).' });
      const base = (await leVersoes(true)).find(v => v.id === b.base && !v.criada && !v.sumiu);
      if (!base) return manda(res, 400, { erro: 'Escolha em qual apresentação do deck a variação se baseia.' });
      const validacao = b.validacao === undefined ? R.VALIDACAO_PADRAO : b.validacao;
      if (!R.VALIDACOES.some(n => n.id === validacao)) return manda(res, 400, { erro: 'Escolha a classificação: Validada, Em validação ou Não validada.' });
      const lead = b.lead === undefined ? {} : leadDoPedido(b.lead);
      if (!lead) return manda(res, 400, { erro: 'Pedido em formato inválido.' });
      const feito = await mudaVersoes(d => {
        if (d.criadas.filter(c => !c.arquivada).length >= LIMITE_ATIVAS) return { erro: 'Já são ' + LIMITE_ATIVAS + ' variações ativas. Arquive as que não servem mais.' };
        if (d.criadas.length >= LIMITE_GUARDADAS) return { erro: 'O painel guarda no máximo ' + LIMITE_GUARDADAS + ' variações criadas, contando as arquivadas.' };
        const todas = montaVersoes(d);
        if (todas.some(v => v.etapa === base.etapa && mesmoNome(v.nome, nome))) return { erro: 'Já existe uma variação com esse nome.' };
        const agora = new Date().toISOString();
        // o deck que não segue a escolha de nome mostra sempre o nome; o que não mostra a foto, nunca a foto
        const nomeLead = !base.recursos.nomeTela || lead.nome !== false;
        const c = {
          id: novoSlug(nome, todas.map(v => v.id)), etapa: base.etapa, nome, base: base.id, quando: textoLimpo(b.quando, 300), validacao, nota: textoLimpo(b.nota, 160),
          lead: { nome: nomeLead, foto: base.recursos.foto && nomeLead && lead.foto !== false }, arquivada: false, criadoPor: quem(eu), criadoEm: agora, por: quem(eu), em: agora
        };
        d.criadas.push(c);
        return { id: c.id };
      });
      if (feito.erro) return manda(res, 400, { erro: feito.erro });
      return manda(res, 201, await resposta({ criada: feito.id }));
    }

    if (req.method === 'PUT') {
      const eu = await exige(req, res, { admin: true });
      if (!eu) return;
      const id = String((req.query && req.query.id) || '');
      const atual = (await leVersoes(true)).find(v => v.id === id);
      if (!atual) return manda(res, 404, { erro: 'Essa variação não existe.' });
      const b = await corpo(req);
      const novo = {};
      if (b.validacao !== undefined) {
        if (!R.VALIDACOES.some(n => n.id === b.validacao)) return manda(res, 400, { erro: 'Escolha a classificação: Validada, Em validação ou Não validada.' });
        novo.validacao = b.validacao;
      }
      if (b.nota !== undefined) novo.nota = textoLimpo(b.nota, 160);
      if (b.lead !== undefined) {
        novo.lead = leadDoPedido(b.lead);
        if (!novo.lead) return manda(res, 400, { erro: 'Pedido em formato inválido.' });
        if (novo.lead.nome === false && !atual.recursos.nomeTela) return manda(res, 400, { erro: 'O deck ' + (R.deckPor(atual.deck) || { nome: '' }).nome + ' não deixa tirar o nome do lead da tela.' });
        if (novo.lead.foto === true && !atual.recursos.foto) return manda(res, 400, { erro: 'O deck ' + (R.deckPor(atual.deck) || { nome: '' }).nome + ' não mostra a foto do lead.' });
      }
      if (b.arquivada !== undefined) {
        if (id === R.padraoDe(atual.etapa) && b.arquivada === true) return manda(res, 400, { erro: 'A variação Principal não pode ser arquivada.' });
        novo.arquivada = b.arquivada === true;
      }
      if (b.nome !== undefined || b.quando !== undefined) {
        if (!atual.criada) return manda(res, 400, { erro: 'Só as variações criadas no painel mudam de nome e de descrição.' });
        if (b.nome !== undefined) {
          novo.nome = textoLimpo(b.nome, 40);
          if (novo.nome.length < 2) return manda(res, 400, { erro: 'Dê um nome pra variação (de 2 a 40 letras).' });
        }
        if (b.quando !== undefined) novo.quando = textoLimpo(b.quando, 300);
      }
      if (!Object.keys(novo).length) return manda(res, 400, { erro: 'Nada pra mudar.' });
      const feito = await mudaVersoes(d => {
        const agora = new Date().toISOString();
        const aplica = a => {
          if (novo.validacao !== undefined) a.validacao = novo.validacao;
          if (novo.nota !== undefined) a.nota = novo.nota;
          if (novo.arquivada !== undefined) a.arquivada = novo.arquivada;
          if (novo.lead) {
            a.lead = Object.assign({}, a.lead, novo.lead);
            if (a.lead.nome === false) a.lead.foto = false; // a foto só aparece com o nome
          }
          a.por = quem(eu); a.em = agora;
          return a;
        };
        if (atual.criada) {
          const c = d.criadas.find(x => x.id === id);
          if (!c) return { erro: 'Essa variação não existe.' };
          if (novo.nome !== undefined && montaVersoes(d).some(v => v.id !== id && mesmoNome(v.nome, novo.nome))) return { erro: 'Já existe uma variação com esse nome.' };
          if (novo.nome !== undefined) c.nome = novo.nome;
          if (novo.quando !== undefined) c.quando = novo.quando;
          aplica(c);
        } else d.ajustes[id] = aplica(Object.assign({}, d.ajustes[id]));
        return {};
      });
      if (feito.erro) return manda(res, feito.erro === 'Essa variação não existe.' ? 404 : 400, { erro: feito.erro });
      return manda(res, 200, await resposta());
    }
    manda(res, 405, { erro: 'Pedido não aceito.' });
  } catch (e) {
    registraErro('versoes', e);
    manda(res, 500, { erro: 'O painel não conseguiu salvar agora. Tente de novo em instantes.' });
  }
}
