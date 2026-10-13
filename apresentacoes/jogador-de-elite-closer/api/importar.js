// Importar a ficha que o SDR já preencheu, pra não redigitar: o R1 dele neste painel, ou a apresentação do painel de antes (o que
// serviu o R1 e o R2 enquanto este não existia).
// POST { id }: o código do lead (deste painel: o do link ?a= do R1 que o SDR mandou) ou o da apresentação do painel de antes, ou o link
// inteiro com ?a=. Precisa de login. Não salva nada: devolve a ficha mapeada pros campos de um R2, e o closer confere e salva no editor.
// Só a ficha, sem foto nem vídeo (P9). O endereço do painel de antes é fixo aqui: nunca se busca uma URL que veio do pedido.
import { exige, manda, corpo, limpaFicha, leVersoes, leRegistro, T_OK, R, registraErro } from './_base.js';

const PAINEL_ATUAL = 'https://jogador-de-elite-painel.vercel.app';
const ID_OK = /^[a-z0-9-]{6,80}$/;
const ROTULOS = {
  nome: 'Nome', idade: 'Idade', posicao: 'Posição', cidade: 'Cidade', pe: 'Pé', altura: 'Altura', origem: 'Origem do lead',
  caracteristicas: 'O que chamou atenção', experiencia: 'Experiência', plano: 'Plano', vagas: 'Vagas (só no Legacy)', gerente: 'Gerente',
  prazoContato: 'Quando o gerente entra em contato (fora da lista fixa)', prazoZyron: 'Quando o Zyron começa (fora da lista fixa)', proximaTurma: 'Próxima turma (só no Legacy)'
};

// "quinta, 09/10" ou "09/10/2026" vira 2026-10-09; sem ano, o ano de hoje (ou o próximo, se a data já passou há mais de 2 meses)
function leData(txt) {
  const m = /(\d{1,2})\s*\/\s*(\d{1,2})(?:\s*\/\s*(\d{2,4}))?/.exec(String(txt || ''));
  if (!m) return '';
  const hoje = R.hojeSP(), ano0 = Number(hoje.slice(0, 4));
  let ano = m[3] ? Number(m[3].length === 2 ? '20' + m[3] : m[3]) : ano0;
  const iso = a => a + '-' + String(m[2]).padStart(2, '0') + '-' + String(m[1]).padStart(2, '0');
  if (!m[3] && Date.parse(iso(ano) + 'T12:00:00Z') < Date.parse(hoje + 'T12:00:00Z') - 60 * 864e5) ano++;
  return R.diaDaCall(iso(ano)) ? iso(ano) : '';
}
// "19h30", "19:30", "19h" vira 19:30
function leHora(txt) {
  const m = /(\d{1,2})\s*[h:]\s*(\d{2})?/i.exec(String(txt || ''));
  if (!m) return '';
  const hm = String(m[1]).padStart(2, '0') + ':' + (m[2] || '00');
  return R.horaDaCall(hm) ? hm : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return manda(res, 405, { erro: 'Use POST.' });
  try {
    const eu = await exige(req, res);
    if (!eu) return;
    const b = await corpo(req);
    const bruto = String(b.id || '').trim();
    const doLink = /[?&]a=([^&#\s]+)/.exec(bruto);
    let id = '';
    try { id = decodeURIComponent(doLink ? doLink[1] : bruto).trim().toLowerCase(); } catch { id = ''; }
    if (!ID_OK.test(id)) return manda(res, 400, { erro: 'Cole o link do R1 (o que tem ?a= no fim), ou só o código.' });
    // um lead deste painel (o R1 do SDR): a ficha já está no formato daqui, só se leva o que um R2 usa
    if (T_OK.test(id)) {
      const lead = await leRegistro(id);
      if (!lead || !lead.dados || lead.dados.movendo) return manda(res, 404, { erro: 'Não achei esse lead. Confira o link.' });
      const f = lead.dados.ficha || {};
      const entrada = {};
      ['nome', 'apelido', 'idade', 'posicao', 'cidade', 'pe', 'altura', 'origem', 'caracteristicas', 'experiencia', 'sonho', 'plano', 'vagas', 'gerente', 'prazoContato', 'prazoZyron', 'proximaTurma', 'r2data', 'r2hm']
        .forEach(k => { if (f[k] != null && String(f[k]).trim()) entrada[k] = String(f[k]); });
      const ficha = limpaFicha(entrada, await leVersoes(), 'r2');
      if (!ficha.nome) return manda(res, 400, { erro: 'Esse lead está sem nome.' });
      return manda(res, 200, { ficha, fora: Object.keys(entrada).filter(k => !ficha[k]).map(k => ROTULOS[k] || k) });
    }
    let r;
    try { r = await fetch(PAINEL_ATUAL + '/api/publico?id=' + encodeURIComponent(id), { cache: 'no-store', signal: AbortSignal.timeout(8000) }); }
    catch { return manda(res, 502, { erro: 'O painel atual não respondeu agora. Tente de novo em instantes.' }); }
    if (r.status === 404) return manda(res, 404, { erro: 'Não achei essa apresentação no painel atual. Confira o link.' });
    if (!r.ok) return manda(res, 502, { erro: 'O painel atual não respondeu agora. Tente de novo em instantes.' });
    let j;
    try { j = await r.json(); } catch { return manda(res, 502, { erro: 'O painel atual mandou uma resposta estranha.' }); }
    const f = (j && j.ficha && typeof j.ficha === 'object') ? j.ficha : {};
    const entrada = {};
    ['nome', 'idade', 'posicao', 'cidade', 'pe', 'altura', 'origem', 'caracteristicas', 'experiencia', 'plano', 'vagas', 'gerente', 'prazoContato', 'prazoZyron', 'proximaTurma']
      .forEach(k => { if (f[k] != null && String(f[k]).trim()) entrada[k] = String(f[k]); });
    // idade e altura de lá podem vir com texto ("15 anos"): fica o número
    ['idade', 'altura'].forEach(k => { if (entrada[k]) entrada[k] = (entrada[k].match(/\d+/) || [''])[0]; });
    // os prazos de lá são texto livre: entram só se baterem com a lista fixa (promessa travada)
    ['prazoContato', 'prazoZyron'].forEach(k => {
      if (!entrada[k]) return;
      const achou = R.PRAZOS[k === 'prazoContato' ? 'contato' : 'zyron'].find(p => R.semAcento(p) === R.semAcento(entrada[k]));
      if (achou) entrada[k] = achou;
    });
    if (f.r2dia) entrada.r2data = leData(f.r2dia);
    if (f.r2hora) entrada.r2hm = leHora(f.r2hora);
    const ficha = limpaFicha(entrada, await leVersoes(), 'r2');
    // o que veio de lá e não entrou (pro closer conferir na mão)
    const fora = Object.keys(entrada).filter(k => !ficha[k] && entrada[k] && !['r2data', 'r2hm'].includes(k)).map(k => ROTULOS[k] || k);
    if (f.r2dia && !ficha.r2data) fora.push('Dia da call (' + String(f.r2dia).slice(0, 30) + ')');
    if (f.r2hora && !ficha.r2hm) fora.push('Hora da call (' + String(f.r2hora).slice(0, 12) + ')');
    if (!ficha.nome) return manda(res, 400, { erro: 'A apresentação de lá está sem nome.' });
    manda(res, 200, { ficha, fora });
  } catch (e) {
    registraErro('importar', e);
    manda(res, 500, { erro: 'O painel não conseguiu importar agora. Tente de novo em instantes.' });
  }
}
