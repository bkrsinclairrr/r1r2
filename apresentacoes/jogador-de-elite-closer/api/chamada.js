// Presença do apresentador: POST ?t=<código> { t, sid, fim?, assumir? }. Sem login, com o código, CORS só do deck.
// Aceita JSON ou texto puro (o sendBeacon e o fetch sem pré-voo mandam texto). Grava chamadas/<t>.json com
// { sid, desde, visto }: um número de sessão aleatório e dois horários, nunca quem é.
// Responde { conflito: { desde, visto } } se outra sessão deu sinal há menos de 90 segundos, ou { conflito: null }.
// Não bloqueia nada: "assumir" só passa a presença pra esta sessão (o aviso vai pra outra). fim: true apaga a presença.
// Junto vai a validade (só as datas) pra a linha de status do apresentador: a /api/r2 não manda validade nenhuma.
import { manda, cors, corpo, le, apaga, caminho, caminhoChamada, linkVencido, fotoValida, PRESENCA_MS, T_OK, R, registraErro } from './_base.js';
import { mudaJson } from './_armazenamento.js';

const SID_OK = /^[a-z0-9]{16,40}$/;

export default async function handler(req, res) {
  cors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') return manda(res, 405, { erro: 'Use POST.' });
  try {
    const b = await corpo(req);
    const t = String((req.query && req.query.t) || b.t || '');
    const sid = String(b.sid || '');
    if (!T_OK.test(t) || !SID_OK.test(sid)) return manda(res, 400, { erro: 'Pedido inválido.' });
    const r = await le(caminho(t));
    const reg = r && r.dados;
    if (!reg || reg.movendo) return manda(res, 404, { estado: 'nao-encontrado' });
    if (reg.estado === 'revogado') return manda(res, 200, { estado: 'revogado' });
    if (linkVencido(reg)) return manda(res, 200, { estado: 'expirado' });
    const c = caminhoChamada(t);

    if (b.fim === true) {
      const atual = await le(c);
      if (atual && atual.dados.sid === sid) await apaga([c]);
      return manda(res, 200, { conflito: null });
    }
    const agora = Date.now();
    let conflito = null;
    await mudaJson(c, () => ({ sid: '', desde: '', visto: '' }), d => {
      conflito = null;
      const fresco = d.sid && d.visto && agora - Date.parse(d.visto) < PRESENCA_MS;
      if (fresco && d.sid !== sid && b.assumir !== true) { conflito = { desde: d.desde, visto: d.visto }; return false; }
      if (d.sid !== sid) d.desde = new Date(agora).toISOString();
      d.sid = sid; d.visto = new Date(agora).toISOString();
    });
    manda(res, 200, {
      conflito,
      validade: { link: R.dataCurta(reg.venceEm), foto: fotoValida(reg.foto) ? R.dataCurta(reg.foto.venceEm) : '' }
    });
  } catch (e) {
    registraErro('chamada', e);
    manda(res, 500, { erro: 'Painel indisponível agora.' });
  }
}
