// O vídeo do atleta pro R2 (slide IA na Prática e dossiê): GET ?t= devolve o vídeo e GET ?t=&poster=1 devolve o quadro de capa. O deck do R2
// anterior pede por ?id= (o nome do painel de antes): é o mesmo código.
// Sem login, com o código: quem não tem o link não acha nada. Só serve com o link valendo (não revogado nem vencido), a
// autorização do responsável registrada e dentro da validade do vídeo (24 horas); fora disso, 404. Nunca mostra o caminho do arquivo.
// Logado como dono ou admin, o painel vê o vídeo mesmo com o link revogado ou vencido (pra marcar os lances).
// O vídeo (desde 20/10/2026): com o Blob, depois das mesmas checagens, um redirecionamento (302) pra um link assinado de leitura que vale
// 10 minutos. Os bytes saem do CDN do Blob, com Range, sem passar pela função: o vídeo começa a tocar rápido e não há limite de tamanho
// servido por função. O redirecionamento fica no cache do navegador por 5 minutos (revogar o link não derruba o que já está tocando por
// até 10 minutos). VIDEO_MODO=proxy volta pro jeito de antes sem mexer em código: o vídeo em stream e em pedaços (Range, 206) por dentro
// da função, como no driver de arquivo (testes). A capa continua sempre em stream (é pequena). O link assinado se confere sozinho (1 byte,
// de 10 em 10 minutos por instância): se o CDN recusar, o vídeo segue em stream, sem erro na tela.
// ?via=proxy (só pra quem pode mexer no lead, logado): o vídeo em stream, do mesmo endereço do painel. É o que o painel usa pra tirar a capa
// de um quadro do vídeo (um vídeo de outro endereço não deixa o navegador copiar o quadro).
import { leRegistro, videoValido, foraDoAr, podeMexer, sessaoOpcional, mede, T_OK, registraErro } from './_base.js';
import { leBin, linkAssinadoConferido } from './_armazenamento.js';

function nao(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.end('Não encontrado.');
}
const modoProxy = () => String(process.env.VIDEO_MODO || '').trim().toLowerCase() === 'proxy';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); return res.end(); }
  mede(res, 'video');
  try {
    const t = String((req.query && (req.query.t !== undefined ? req.query.t : req.query.id)) || '');
    const poster = String((req.query && req.query.poster) || '') === '1';
    if (!T_OK.test(t)) return nao(res);
    const r = await leRegistro(t);
    const reg = r && r.dados;
    if (!reg || reg.movendo) return nao(res);
    if (foraDoAr(reg, req.query && req.query.p)) { // revogado, vencido ou rascunho sem link (a prévia do painel passa com a chave)
      const eu = req.headers.cookie ? await sessaoOpcional(req) : null;
      if (!podeMexer(eu, reg)) return nao(res);
    }
    const v = reg.video;
    if (!videoValido(v)) return nao(res);
    const caminho = poster ? v.poster : v.arquivo;
    if (!caminho) return nao(res);
    // ?via=proxy: o painel do dono, no mesmo endereço (pra copiar um quadro como capa)
    const viaProxy = String((req.query && req.query.via) || '') === 'proxy' && req.headers.cookie && podeMexer(await sessaoOpcional(req), reg);
    // o vídeo pelo link assinado (o CDN do Blob serve, com Range)
    if (!poster && !modoProxy() && !viaProxy) {
      let url = null;
      try { url = await linkAssinadoConferido(caminho, { segundos: 600 }); } catch (e) { registraErro('video-assinado', e); }
      if (url) {
        res.statusCode = 302;
        res.setHeader('Location', url);
        res.setHeader('Cache-Control', 'private, max-age=300');
        res.setHeader('Referrer-Policy', 'no-referrer');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        return res.end();
      }
    }
    const range = !poster && /^bytes=\d*-\d*$/.test(String(req.headers.range || '')) ? String(req.headers.range) : '';
    const b = await leBin(caminho, { range });
    if (!b) return nao(res);
    res.statusCode = b.parte ? 206 : 200;
    res.setHeader('Content-Type', poster ? 'image/jpeg' : v.tipo);
    if (b.tamanho) res.setHeader('Content-Length', String(b.tamanho));
    if (b.parte) res.setHeader('Content-Range', b.parte);
    if (!poster) res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    if (req.method === 'HEAD') { b.fluxo.destroy(); return res.end(); }
    b.fluxo.on('error', () => res.destroy());
    res.on('close', () => b.fluxo.destroy());
    b.fluxo.pipe(res);
  } catch (e) {
    registraErro('video', e);
    if (!res.headersSent) nao(res); else res.destroy();
  }
}
