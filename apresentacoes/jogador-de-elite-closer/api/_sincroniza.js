// A sincronização com os decks: o painel lê o variacoes.json que cada deck do catálogo publica (as páginas que existem), guarda o que leu em
// versoes.json (em decks, por id de deck) e confere se cada página está funcionando. É assim que uma página nova de um deck aparece no
// painel sem ninguém cadastrar nada, e que uma página quebrada ou removida aparece pro admin antes de a família chegar nela. Os decks
// são sincronizados juntos, cada um com o seu orçamento de tempo; um deck fora do ar não atrapalha os outros.
//
// Quando roda: sozinha, na primeira vez que alguém abre a lista de variações depois de 2 minutos (TTL_MS); todo dia, no Cron da limpeza;
// e quando o admin clica em "Sincronizar agora". Nunca derruba nada: se o deck não responde ou o variacoes.json vem estranho, o painel
// fica com a última lista boa e só anota o que aconteceu.
//
// O que confere em cada página (GET no endereço do deck): abre (HTTP 200, sem redirecionar), tem o motor do deck (assets/deck.js) e tem
// o número de slides que o manifesto diz. Se o hash não bate, o manifesto ficou velho (a página mudou depois do gera-manifesto.mjs):
// vira aviso, não quebra nada. Falha sozinha não tira a página do ar: a /api/r2 só manda a família pra Principal depois de duas
// conferências seguidas com falha (ver r2.js).
import crypto from 'node:crypto';
import { R, textoLimpo, lePainelVersoes, mudaVersoes, estadoDoDeck } from './_base.js';
import { decksDoCatalogo } from './_decks.js';

export const TTL_MS = 2 * 60 * 1000;
// PRAZO_MS: o máximo de cada pedido. ORCAMENTO_MS: o máximo da sincronização inteira (o variacoes.json e depois as páginas): uma função
// da Vercel no plano gratuito para aos 10 segundos, e a aba de variações espera por ela
const PRAZO_MS = 4000, ORCAMENTO_MS = 7000, MAX_BYTES = 2 * 1024 * 1024;
let andando = null;

// o corpo da resposta, lido aos pedaços: passou do limite, cancela e devolve null (não baixa o resto pra memória)
async function leCorpo(r) {
  if (!r.body || !r.body.getReader) { const b = Buffer.from(await r.arrayBuffer()); return b.length > MAX_BYTES ? null : b; }
  const leitor = r.body.getReader(), partes = [];
  let n = 0;
  for (;;) {
    const { done, value } = await leitor.read();
    if (done) break;
    n += value.length;
    if (n > MAX_BYTES) { try { await leitor.cancel(); } catch { /* já fechou */ } return null; }
    partes.push(Buffer.from(value));
  }
  return Buffer.concat(partes);
}

// um GET com prazo e limite de tamanho; nunca lança
async function busca(url, prazo = PRAZO_MS) {
  const t0 = Date.now(), c = new AbortController(), t = setTimeout(() => c.abort(), prazo);
  try {
    const r = await fetch(url, { signal: c.signal, cache: 'no-store', redirect: 'manual' });
    if (Number(r.headers.get('content-length')) > MAX_BYTES) { try { await r.body.cancel(); } catch { /* nada */ } return { status: r.status, erro: 'grande demais', ms: Date.now() - t0 }; }
    const bytes = await leCorpo(r);
    if (!bytes) return { status: r.status, erro: 'grande demais', ms: Date.now() - t0 };
    return { status: r.status, bytes, texto: bytes.toString('utf8'), ms: Date.now() - t0 };
  } catch (e) {
    return { status: 0, erro: e && e.name === 'AbortError' ? 'demorou demais' : 'sem resposta', ms: Date.now() - t0 };
  } finally { clearTimeout(t); }
}

// o variacoes.json: confere tudo e devolve { paginas } normalizadas, ou { erro } (e aí o painel não troca a lista que já tem)
export function validaManifesto(m, deck) {
  const falha = erro => ({ erro: 'O variacoes.json do deck não serve: ' + erro });
  const reservados = deck && !deck.prefixo ? R.DECKS.filter(d => d.prefixo).map(d => d.prefixo) : [];
  if (!m || typeof m !== 'object' || m.v !== 1 || !Array.isArray(m.paginas)) return falha('formato que o painel não conhece');
  if (!m.paginas.length || m.paginas.length > 40) return falha('traz ' + m.paginas.length + ' páginas (de 1 a 40)');
  const ids = new Set(), nomes = new Set(), paginas = [];
  for (const p of m.paginas) {
    if (!p || typeof p !== 'object') return falha('uma página fora do formato');
    const id = String(p.id || '');
    if (!R.SLUG_OK.test(id) || id.length > 40) return falha('id de página inválido (' + id.slice(0, 20) + ')');
    const onde = 'a página ' + id + ' ';
    if (reservados.some(x => id.startsWith(x))) return falha(onde + 'usa um começo de id que é de outro deck (' + reservados.join(', ') + ')');
    if (p.caminho !== (id === R.VERSAO_PADRAO ? '/' : '/variacoes/' + id + '/')) return falha(onde + 'tem um caminho que não bate com o id');
    if (ids.has(id)) return falha('o id ' + id + ' aparece duas vezes');
    ids.add(id);
    const nome = textoLimpo(p.nome, 40), resumo = textoLimpo(p.resumo, 300), quando = textoLimpo(p.quando, 300);
    if (nome.length < 2 || !resumo || !quando) return falha(onde + 'está sem nome, resumo ou "quando usar"');
    if (nomes.has(R.semAcento(nome))) return falha('o nome ' + nome + ' é de duas páginas');
    nomes.add(R.semAcento(nome));
    const slides = Number(p.slides);
    if (!Number.isInteger(slides) || slides < 1 || slides > 200) return falha(onde + 'tem um número de slides inválido');
    if (!/^[a-f0-9]{40}$/.test(String(p.hash || ''))) return falha(onde + 'está sem o hash');
    const opcionais = [];
    for (const o of Array.isArray(p.opcionais) ? p.opcionais : []) {
      if (!o || typeof o !== 'object' || !R.SLUG_OK.test(String(o.id || '')) || o.id.length > 40) return falha(onde + 'tem um slide opcional fora do formato');
      const slide = Number(o.slide), rotulo = textoLimpo(o.rotulo, 60), ajuda = textoLimpo(o.ajuda, 200);
      if (!Number.isInteger(slide) || slide < 1 || slide > slides || !rotulo || !ajuda) return falha(onde + 'tem o opcional ' + o.id + ' fora do formato');
      if (opcionais.some(x => x.id === o.id)) return falha(onde + 'repete o opcional ' + o.id);
      opcionais.push({ id: o.id, slide, rotulo, ajuda });
    }
    if (opcionais.length > 10) return falha(onde + 'tem opcionais demais');
    const nomeLead = !p.lead || p.lead.nome !== false;
    paginas.push({
      id, caminho: p.caminho, nome, resumo, quando, validacao: R.VALIDACOES.some(n => n.id === p.validacao) ? p.validacao : R.VALIDACAO_PADRAO,
      lead: { nome: nomeLead, foto: nomeLead && (!p.lead || p.lead.foto !== false) }, slides, opcionais, hash: p.hash
    });
  }
  if (!ids.has(R.VERSAO_PADRAO)) return falha('falta a página principal');
  return { paginas };
}

// a saúde de cada página. anteriores: o que a conferência anterior achou (pra contar as falhas seguidas). inicio: quando a sincronização
// começou (as páginas dividem o que sobrou do orçamento)
async function confereSaude(origem, paginas, anteriores, agora, inicio) {
  const saude = {};
  const prazo = Math.max(1000, Math.min(PRAZO_MS, ORCAMENTO_MS - (Date.now() - inicio)));
  await Promise.all(paginas.map(async p => {
    const r = await busca(origem + p.caminho, prazo);
    let ok = true, motivo = '', desatualizado = false;
    if (r.erro) { ok = false; motivo = r.erro === 'grande demais' ? 'A página é grande demais (passa de 2 MB)' : 'A página não respondeu (' + r.erro + ')'; }
    else if (r.status !== 200) { ok = false; motivo = 'A página não abre (HTTP ' + r.status + ')'; }
    else if (!/assets\/deck\.js/.test(r.texto)) { ok = false; motivo = 'A página não tem o motor do deck'; }
    else {
      const n = (r.texto.replace(/<!--[\s\S]*?-->/g, '').match(/<section\b[^>]*\bclass="slide[^"]*"/g) || []).length;
      // sem variacoes.json lido ainda (a lista é a do código), não há número de slides nem hash pra comparar
      if (Number.isInteger(p.slides) && n !== p.slides) { ok = false; motivo = 'A página tem ' + n + ' slides e o variacoes.json diz ' + p.slides; }
      else if (p.hash && crypto.createHash('sha1').update(r.bytes).digest('hex') !== p.hash) desatualizado = true;
    }
    const antes = anteriores && anteriores[p.id];
    saude[p.id] = { ok, motivo, desatualizado, falhas: ok ? 0 : ((antes && antes.ok === false && Number(antes.falhas)) || 0) + 1, em: agora, ms: r.ms };
  }));
  return saude;
}

// um deck: lê e confere o variacoes.json, e confere a saúde das páginas (as do arquivo novo, ou as que já se tinha se ele falhou).
// Não grava nada: devolve o que achou
async function sincronizaDeck(deck, atual, inicio, agora) {
  const origem = deck.origem;
  let manifesto = null, falha = '';
  const r = await busca(origem + '/variacoes.json');
  if (r.erro || r.status !== 200) falha = 'O deck não entregou o variacoes.json (' + (r.erro || 'HTTP ' + r.status) + ')';
  else {
    let bruto = null;
    try { bruto = JSON.parse(r.texto); } catch { falha = 'O variacoes.json do deck não é um JSON válido'; }
    if (bruto) { const v = validaManifesto(bruto, deck); if (v.erro) falha = v.erro; else manifesto = { paginas: v.paginas, gerado: String(bruto.gerado || '').slice(0, 40) }; }
  }
  // a saúde vale pra lista nova, ou pra que já se tinha se o variacoes.json falhou (ou a reserva do deck, se nunca leu nada)
  const paginas = manifesto ? manifesto.paginas : (atual && Array.isArray(atual.paginas) && atual.paginas.length ? atual.paginas : (R.RESERVA[deck.id] || []));
  const saude = await confereSaude(origem, paginas, atual && atual.saude, agora, inicio);
  return { deck, manifesto, falha, saude };
}

async function sincronizaDeVerdade() {
  const inicio = Date.now(), agora = new Date().toISOString();
  const atual = await lePainelVersoes(true);
  const resultados = await Promise.all(decksDoCatalogo().map(d => sincronizaDeck(d, atual.decks[d.id], inicio, agora)));
  await mudaVersoes(dd => {
    for (const { deck, manifesto, falha, saude } of resultados) {
      const antes = dd.decks[deck.id] && typeof dd.decks[deck.id] === 'object' ? dd.decks[deck.id] : {};
      const novo = { em: agora, origem: deck.origem, falha, okEm: antes.okEm || '', gerado: antes.gerado || '', paginas: antes.paginas || [], saude, sumiram: antes.sumiram || {} };
      if (manifesto) {
        const vistas = new Map((antes.paginas || []).map(p => [p.id, p.visto]));
        novo.okEm = agora; novo.gerado = manifesto.gerado;
        novo.paginas = manifesto.paginas.map(p => Object.assign({}, p, { visto: vistas.get(p.id) || agora }));
        const ids = new Set(manifesto.paginas.map(p => p.id));
        // as que saíram do deck ficam guardadas (um lead pode usar); as que voltaram deixam de ser "saiu"
        (antes.paginas || []).forEach(p => { if (!ids.has(p.id)) novo.sumiram[p.id] = { pagina: p, em: agora }; });
        ids.forEach(id => { delete novo.sumiram[id]; });
      }
      dd.decks[deck.id] = novo;
    }
  });
}

// Uma sincronização por vez nesta instância. Nunca lança: o que deu errado fica anotado em falha, no deck
export function sincroniza() {
  if (!andando) {
    andando = sincronizaDeVerdade().catch(e => { console.error('sincroniza: ' + String((e && e.message) || e).slice(0, 200)); }).finally(() => { andando = null; });
  }
  return andando;
}
// só se a última foi há mais de TTL_MS em algum deck (ou nunca); devolve se sincronizou. Os decks vão juntos
export async function sincronizaSeVelho() {
  const { decks } = await lePainelVersoes();
  const velho = decksDoCatalogo().some(d => { const e = decks[d.id]; return !(e && e.em && Date.now() - Date.parse(e.em) < TTL_MS); });
  if (!velho) return false;
  await sincroniza();
  return true;
}
