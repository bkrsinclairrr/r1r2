// O catálogo de decks como vale neste ambiente (o catálogo em si, com etapa, prefixo e recursos de cada deck, está no regras.js).
// Em produção as origens são as do catálogo, fixas no código (o R2 novo também pode vir da variável DECK_URL, como sempre foi): nada
// do que chega pela rede muda pra onde o painel vai buscar ou pra onde manda o lead. Fora de produção (testes e desenvolvimento) dá
// pra trocar as origens (DECKS_ORIGENS, um JSON { "<id do deck>": "http://127.0.0.1:4321" }) e escolher quais decks valem
// (DECKS_ATIVOS, ids separados por vírgula): é assim que os testes apontam o painel pra decks locais.
// Arquivos com _ na frente não viram rota no Vercel.
import '../regras.js';

const R = globalThis.R2_REGRAS;
const PRODUCAO = process.env.VERCEL_ENV === 'production';
const semBarra = s => String(s || '').trim().replace(/\/+$/, '');
const de = () => {
  let origens = {};
  if (!PRODUCAO && process.env.DECKS_ORIGENS) { try { origens = JSON.parse(process.env.DECKS_ORIGENS) || {}; } catch { origens = {}; } }
  const ativos = !PRODUCAO && process.env.DECKS_ATIVOS ? new Set(String(process.env.DECKS_ATIVOS).split(',').map(s => s.trim()).filter(Boolean)) : null;
  return { origens, ativos };
};

// o endereço do R2 novo: a variável DECK_URL (o que o painel sempre usou) ou o do catálogo
export const DECK_URL = semBarra(process.env.DECK_URL || R.deckPor('r2').origem);

// os decks que valem aqui, cada um com a origem de verdade (sem barra no fim)
export function decksDoCatalogo() {
  const { origens, ativos } = de();
  return R.DECKS.filter(d => !ativos || ativos.has(d.id)).map(d => Object.assign({}, d, {
    origem: semBarra(d.id === 'r2' ? (!PRODUCAO && origens.r2) || DECK_URL : (!PRODUCAO && origens[d.id]) || d.origem)
  }));
}
export const deckDoCatalogo = id => decksDoCatalogo().find(d => d.id === id) || null;
// o deck de entrada de uma etapa: dele sai o link do lead (/?a=<código>)
export const entradaDaEtapa = etapa => decksDoCatalogo().find(d => d.etapa === etapa && d.entrada) || null;
// o deck que tem essa origem (a /api/r2 manda ao deck de entrada a origem da variação, pra ele levar o lead pro deck certo)
export const deckDaOrigem = o => decksDoCatalogo().find(d => d.origem === semBarra(o)) || null;
// todas as origens dos decks daqui: o CORS das rotas públicas só responde a elas
export const origensDosDecks = () => decksDoCatalogo().map(d => d.origem);
