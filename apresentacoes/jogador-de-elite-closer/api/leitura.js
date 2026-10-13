// A leitura do atleta (o slide IA na Prática do R2): o vídeo dele e os lances marcados. Precisa de login (dono ou admin).
// GET ?t=      o vídeo e a leitura completos, pra editar
// PUT ?t=      { autorizar: true }  registra quem autorizou o uso do vídeo e quando (antes de qualquer envio)
//              { video: {...} }     registra o vídeo que o navegador acabou de subir (trocar apaga o anterior e a leitura dele)
//              { poster: '...' }    troca o quadro de capa
//              { leitura: {...} }   salva os lances, os pontos fortes, as prioridades, a fonte e o critério
// DELETE ?t=   apaga o vídeo, o quadro e a leitura (os arquivos também)
// POST         o envio do vídeo e do quadro, direto do navegador pro Blob privado: esta rota só gera o token (a função da
//              Vercel não recebe corpo grande). Era a rota leitura-upload do painel atual; ficou aqui porque o plano da Vercel
//              limita as funções por deploy. Só com o Blob: com o driver de arquivo (teste) responde 501.
// Vídeo vencido (90 dias): qualquer PUT apaga os arquivos e limpa o vídeo e a leitura antes de seguir.
import {
  exige, manda, corpo, leRegistro, mudaRegistro, mudaIndice, poeNoIndice, resumo, podeMexer, quem, anota, limpaLeitura, limpaVideo, caminhoVideoOk,
  videoValido, videoVencido, venceVideo, apaga, apagaPasta, TIPOS_LANCE, TIPOS_VIDEO, VALIDADE, VIDEO_MAX_BYTES, VIDEO_MAX_S, POSTER_MAX_BYTES,
  etapaDe, T_OK, DRIVER, registraErro
} from './_base.js';

const ERROS = {
  caminho: 'Arquivo em lugar inválido.',
  registro: 'Esse lead não foi encontrado. Pode ter sido apagado.',
  dono: 'Esse lead é de outra pessoa.',
  etapa: 'O R1 não usa vídeo nem leitura.',
  autorizacao: 'Marque a autorização do responsável antes de enviar o vídeo.'
};
const apagaArquivos = async caminhos => { const c = caminhos.filter(Boolean); if (c.length) { try { await apaga(c); } catch { /* já não existe */ } } };

async function envio(req, res, eu) {
  if (DRIVER !== 'blob') return manda(res, 501, { erro: 'O envio de vídeo só funciona com a loja de Blob (no ar).' });
  const body = await corpo(req);
  if (!body || body.type !== 'blob.generate-client-token') return manda(res, 400, { erro: 'Pedido não aceito.' });
  const { handleUpload } = await import('@vercel/blob/client');
  try {
    const r = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let p = {};
        try { p = JSON.parse(clientPayload || '{}'); } catch { p = {}; }
        const t = String(p.t || ''), poster = p.tipo === 'poster';
        if (!T_OK.test(t) || !caminhoVideoOk(t, pathname, poster)) throw new Error('caminho');
        const reg = await leRegistro(t);
        if (!reg) throw new Error('registro');
        if (!podeMexer(eu, reg.dados)) throw new Error('dono');
        if (etapaDe(reg.dados) === 'r1') throw new Error('etapa');
        if (!(reg.dados.video && reg.dados.video.autorizadoEm)) throw new Error('autorizacao');
        return {
          allowedContentTypes: poster ? ['image/jpeg'] : Object.keys(TIPOS_VIDEO),
          maximumSizeInBytes: poster ? POSTER_MAX_BYTES : VIDEO_MAX_BYTES,
          addRandomSuffix: false,
          allowOverwrite: false,
          validUntil: Date.now() + 60 * 60 * 1000,
          tokenPayload: JSON.stringify({ t, por: eu.login })
        };
      }
    });
    manda(res, 200, r);
  } catch (e) {
    registraErro('leitura-envio', e);
    manda(res, 400, { erro: ERROS[e && e.message] || 'O painel não conseguiu liberar o envio agora. Tente de novo.' });
  }
}

export default async function handler(req, res) {
  try {
    const eu = await exige(req, res);
    if (!eu) return;
    if (req.method === 'POST') return envio(req, res, eu);
    const t = String((req.query && req.query.t) || '');
    if (!T_OK.test(t)) return manda(res, 404, { erro: ERROS.registro });
    const regras = { tipos: TIPOS_LANCE, validadeDias: VALIDADE.videoDias, maxBytes: VIDEO_MAX_BYTES, maxSegundos: VIDEO_MAX_S, envio: DRIVER === 'blob' };

    if (req.method === 'GET') {
      const r = await leRegistro(t);
      if (!r) return manda(res, 404, { erro: ERROS.registro });
      if (!podeMexer(eu, r.dados)) return manda(res, 403, { erro: ERROS.dono });
      if (etapaDe(r.dados) === 'r1') return manda(res, 400, { erro: ERROS.etapa });
      const v = r.dados.video || null;
      return manda(res, 200, {
        t, nome: (r.dados.ficha && r.dados.ficha.nome) || '', apelido: (r.dados.ficha && r.dados.ficha.apelido) || '', video: v, leitura: r.dados.leitura || null,
        valido: videoValido(v), vencido: videoVencido(v), regras
      });
    }

    if (req.method === 'PUT') {
      const b = await corpo(req);
      let erro = null, lixo = [], proibido = false;
      const reg = await mudaRegistro(t, r => {
        erro = null; lixo = [];
        if (!podeMexer(eu, r)) { proibido = true; return false; }
        if (etapaDe(r) === 'r1') { erro = ERROS.etapa; return false; }
        if (videoVencido(r.video)) { lixo.push(r.video.arquivo, r.video.poster); r.video = null; r.leitura = null; }
        if (b.autorizar === true) {
          r.video = Object.assign({}, r.video, { autorizadoPor: eu.nome + ' (' + eu.login + ')', autorizadoEm: new Date().toISOString() });
          anota(r, eu, 'registrou a autorização do vídeo');
        }
        if (b.video) {
          if (!(r.video && r.video.autorizadoEm)) { erro = ERROS.autorizacao; return false; }
          const lv = limpaVideo(t, b.video);
          if (lv.erro) { erro = lv.erro; return false; }
          const antes = r.video || {};
          if (antes.arquivo && antes.arquivo !== lv.video.arquivo) {
            lixo.push(antes.arquivo);
            if (antes.poster && antes.poster !== lv.video.poster) lixo.push(antes.poster);
            r.leitura = null; // os lances eram do vídeo anterior
          }
          r.video = Object.assign({}, antes, lv.video, { enviadoEm: new Date().toISOString(), venceEm: venceVideo() });
          anota(r, eu, 'enviou o vídeo');
        }
        if (typeof b.poster === 'string') {
          if (!videoValido(r.video)) { erro = 'Suba o vídeo antes do quadro.'; return false; }
          if (b.poster && !caminhoVideoOk(t, b.poster, true)) { erro = 'Quadro inválido.'; return false; }
          if (r.video.poster && r.video.poster !== b.poster) lixo.push(r.video.poster);
          r.video.poster = b.poster;
        }
        if (b.leitura) {
          if (!videoValido(r.video)) { erro = 'Suba o vídeo antes de salvar a leitura.'; return false; }
          const { leitura, erros } = limpaLeitura(b.leitura, r.video.duracaoS);
          if (!leitura.origem) { erro = 'Escolha a fonte da leitura: Zyron ou Equipe.'; return false; }
          if (erros.length) { erro = 'Corrija antes de salvar: ' + erros.slice(0, 5).join(' '); return false; }
          r.leitura = Object.assign(leitura, { por: eu.login, em: new Date().toISOString() });
          anota(r, eu, 'salvou a leitura (' + leitura.lances.length + ' lances)');
        }
        r.atualizadoPor = quem(eu); r.atualizadoEm = new Date().toISOString();
      });
      if (proibido) return manda(res, 403, { erro: ERROS.dono });
      if (!reg) return manda(res, 404, { erro: ERROS.registro });
      // com erro, nada foi gravado: os arquivos ficam (o vencido é apagado no próximo salvamento que der certo)
      if (erro) return manda(res, 400, { erro });
      await apagaArquivos(lixo);
      await poeNoIndice(reg);
      return manda(res, 200, { video: reg.video || null, leitura: reg.leitura || null, valido: videoValido(reg.video) });
    }

    if (req.method === 'DELETE') {
      const r0 = await leRegistro(t);
      if (!r0) return manda(res, 404, { erro: ERROS.registro });
      if (!podeMexer(eu, r0.dados)) return manda(res, 403, { erro: ERROS.dono });
      if (etapaDe(r0.dados) === 'r1') return manda(res, 400, { erro: ERROS.etapa });
      await apagaPasta('videos/' + t + '/');
      const reg = await mudaRegistro(t, r => {
        r.video = null; r.leitura = null;
        r.atualizadoPor = quem(eu); r.atualizadoEm = new Date().toISOString();
        anota(r, eu, 'apagou o vídeo e a leitura');
      });
      if (reg) await poeNoIndice(reg);
      return manda(res, 200, { ok: true });
    }
    manda(res, 405, { erro: 'Pedido não aceito.' });
  } catch (e) {
    registraErro('leitura', e);
    manda(res, 500, { erro: 'O painel não conseguiu salvar a leitura agora. Tente de novo em instantes.' });
  }
}
