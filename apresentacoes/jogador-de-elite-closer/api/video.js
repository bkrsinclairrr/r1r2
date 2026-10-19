// O vídeo do atleta pro R2 (slide IA na Prática): GET ?t= devolve o vídeo e GET ?t=&poster=1 devolve o quadro de capa. O deck do R2
// anterior pede por ?id= (o nome do painel de antes): é o mesmo código.
// Sem login, com o código: quem não tem o link não acha nada. Só serve com o link valendo (não revogado nem vencido), a
// autorização do responsável registrada e dentro da validade do vídeo; fora disso, 404. Nunca mostra o caminho do arquivo.
// Logado como dono ou admin, o painel vê o vídeo mesmo com o link revogado ou vencido (pra marcar os lances).
// Em stream e em pedaços (Range, 206), pra a barra do player pular sem baixar o vídeo inteiro.
import { leRegistro, videoValido, foraDoAr, podeMexer, sessaoOpcional, T_OK, registraErro } from './_base.js';
import { leBin } from './_armazenamento.js';

function nao(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.end('Não encontrado.');
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); return res.end(); }
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
