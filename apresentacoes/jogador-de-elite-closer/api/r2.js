// O que os decks leem do lead: GET ?t=<código>. Sem login, com CORS só pros endereços dos decks do catálogo (e DECK_ORIGINS).
// 200 { estado: 'ok', t, atualizadoEm, versao: { id, caminho, origem }, ficha, foto?: { ok, versao }, video?: { ok, duracaoS, temPoster, largura?, altura? }, leitura? }
//     versao é a página que abre: a da variação escolhida, ou a principal da etapa se aquela saiu do deck ou falhou em duas conferências
//     seguidas (a última há menos de 15 minutos). origem é o deck dessa página: o deck de entrada (o R1 num endereço, o R2 noutro) leva o
//     lead pra lá se for outro. A ficha segue a variação escolhida (é ela que diz se o nome e a foto do lead aparecem).
// 200 { estado: 'expirado' } ou { estado: 'revogado' }, sem dado nenhum
// 404 { estado: 'nao-encontrado' }, na mesma forma, pra código que não existe (ou de outro formato)
// Nunca devolve: dono, quem criou, nota, histórico, quem autorizou, validade, caminho de arquivo. A foto sai só por
// /api/foto e o vídeo só por /api/video, sempre com o código.
//
// O formato dos decks de antes (GET /api/publico?id=<código>, que o vercel.json reescreve pra cá): os decks do R1 e do R2 anterior leem
// o lead por ele. Responde { id, ficha, atualizadoEm, video?, leitura?, versao } e, pra link que não vale (não existe, revogado ou
// vencido), 404 { erro }: esses decks só olham se deu certo. Sem foto: eles não usam.
import { manda, cors, le, caminho, fichaPublica, fotoValida, linkVencido, linkGerado, previaOk, videoValido, limpaLeitura, novoCodigo, leVersoesCom, etapaDe, T_OK, R, registraErro } from './_base.js';

export default async function handler(req, res) {
  cors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'GET') return manda(res, 405, { erro: 'Use GET.' });
  try {
    const q = req.query || {};
    const legado = q.t === undefined && q.id !== undefined;
    const t = String(legado ? q.id : q.t || '');
    // código de outro formato também lê o armazenamento (um código sorteado, que não existe): o tempo de resposta não
    // separa "formato errado" de "não existe"
    const r = await le(caminho(T_OK.test(t) ? t : novoCodigo()));
    const reg = T_OK.test(t) && r ? r.dados : null;
    const nao = () => (legado ? manda(res, 404, { erro: 'Apresentação não encontrada.' }) : null);
    // o rascunho (o link ainda não foi gerado no painel) responde igual a um código que não existe
    if (!reg || reg.movendo || (!linkGerado(reg) && !previaOk(t, q.p))) return legado ? nao() : manda(res, 404, { estado: 'nao-encontrado' });
    if (reg.estado === 'revogado') return legado ? nao() : manda(res, 200, { estado: 'revogado' });
    if (linkGerado(reg) && linkVencido(reg)) return legado ? nao() : manda(res, 200, { estado: 'expirado' }); // o rascunho não vence: não tem link
    // versao: a página do deck que mostra este atleta (o link é um só por etapa; o deck abre a variação escolhida no painel)
    // as variações como valem agora: o admin pode ter mudado o que a variação mostra do lead (nome e foto) depois que o lead foi salvo
    const etapa = etapaDe(reg);
    const lista = await leVersoesCom((reg.ficha || {}).versao);
    const ver = R.versaoPor((reg.ficha || {}).versao, lista, etapa), principal = R.versaoPor(R.padraoDe(etapa), lista, etapa);
    // a página da variação saiu do deck, ou falhou em duas conferências seguidas e a última foi há pouco: a família abre a principal em vez
    // de uma página que não existe (uma falha só, ou uma conferência velha, não conta)
    const s = ver.saude;
    const quebrada = ver.sumiu || !!(s && s.ok === false && s.falhas >= 2 && Date.now() - Date.parse(s.em) < 15 * 60 * 1000);
    // a ficha segue a variação escolhida (é ela que diz se o nome e a foto do lead aparecem); só a página muda
    const aberta = quebrada && ver.id !== principal.id ? principal : ver;
    const versao = { id: aberta.id, caminho: aberta.caminho, origem: aberta.origem || '' };
    const ficha = fichaPublica(reg.ficha || {}, ver);
    const saida = legado
      ? { id: t, ficha, atualizadoEm: reg.atualizadoEm || null, versao }
      : { estado: 'ok', t, atualizadoEm: reg.atualizadoEm || null, versao, ficha };
    // a foto só vai quando a tela dela mostra: com a foto fora da tela (semFoto, que a variação ou o closer mandam), o deck nem fica sabendo que
    // ela existe. Vale também pros decks que não conhecem o semFoto (o R2 B): a promessa do painel é do servidor, não do deck
    if (ficha.semFoto !== 'sim' && fotoValida(reg.foto)) saida.foto = { ok: true, versao: reg.foto.versao };
    const v = reg.video;
    // "tenho o vídeo do jogador": o vídeo analisado e o mapa de calor vão pro slide do dossiê em qualquer página (também na Acompanhamento,
    // que sem isso não usa vídeo). Sem nome nem foto na tela (apresentação geral), nada do atleta vai
    const comVideo = ficha.temVideo === 'sim' && ficha.nomeTela !== 'sem';
    if (comVideo && reg.mapa && reg.mapa.versao) saida.mapa = { ok: true, versao: reg.mapa.versao, largura: reg.mapa.largura || 0, altura: reg.mapa.altura || 0 };
    if (videoValido(v) && (!R.temDossie(ver) || comVideo)) {
      saida.video = Object.assign({ ok: true, duracaoS: v.duracaoS, temPoster: !!v.poster }, v.largura && v.altura ? { largura: v.largura, altura: v.altura } : {});
      const l = !R.temDossie(ver) && reg.leitura && limpaLeitura(reg.leitura, v.duracaoS).leitura;
      if (l && l.origem && l.lances.length) saida.leitura = { origem: l.origem, criterio: l.criterio, lances: l.lances, fortes: l.fortes, prioridades: l.prioridades };
    }
    manda(res, 200, saida);
  } catch (e) {
    registraErro('r2', e);
    manda(res, 500, { erro: 'Painel indisponível agora.' });
  }
}
