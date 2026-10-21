// A leitura do atleta (o slide IA na Prática do R2 e o dossiê): o vídeo dele e os lances marcados. Precisa de login (dono ou admin).
// GET ?t=      o vídeo e a leitura completos, pra editar, e o espaço dos vídeos que esta instância já sabe (usado, ou null, e o máximo,
//              em bytes), sem listar a loja: a conferência que vale é a do envio
// PUT ?t=      { autorizar: true }  registra quem autorizou o uso do vídeo e quando (antes de qualquer envio)
//              { video: {...} }     registra o vídeo que o navegador acabou de subir, e a capa se veio junto (trocar apaga o anterior e a
//                                   leitura dele). O vídeo vence 24 horas depois do envio
//              { renovar: true }    mais 24 horas a partir de agora, sem enviar de novo (o vídeo ainda não pode ter vencido)
//              { poster: '...' }    troca o quadro de capa
//              { leitura: {...} }   salva os lances, os pontos fortes, as prioridades, a fonte e o critério. Nada é obrigatório (sem a fonte,
//                                   o slide só não mostra o relatório); linha estragada fica de fora e volta em avisos, o resto é salvo
// DELETE ?t=   apaga o vídeo, o quadro e a leitura (os arquivos também)
// POST         o envio do vídeo e do quadro, direto do navegador pro Blob privado: esta rota só gera o token (a função da
//              Vercel não recebe corpo grande). Era a rota leitura-upload do painel atual; ficou aqui porque o plano da Vercel
//              limita as funções por deploy. Só com o Blob (com o driver de arquivo responde 501, menos no teste local que simula o envio,
//              ENVIO_DE_TESTE=1). Sem limite de tamanho nem de tempo por vídeo: só o teto técnico de 2 GB e a guarda do espaço de todos os
//              vídeos juntos (VIDEOS_ESPACO_MAX_MB): antes de liberar, soma videos/, roda a limpeza se passar e recusa se ainda não couber.
// Vídeo vencido: qualquer PUT apaga os arquivos e limpa o vídeo e a leitura antes de seguir. O GET também roda a passada de limpeza dos
// vídeos de vez em quando (no máximo uma vez por hora por instância).
import {
  exige, manda, corpo, leRegistro, mudaRegistro, poeNoIndice, podeMexer, quem, anota, limpaLeitura, limpaVideo, caminhoVideoOk,
  videoValido, videoVencido, venceVideo, apaga, apagaPasta, TIPOS_LANCE, TIPOS_VIDEO, VALIDADE, VIDEO_TETO_BYTES, VIDEO_TETO_S, POSTER_MAX_BYTES,
  espacoVideos, espacoSabido, passadaVideos, passadaDeVezEmQuando, etapaDe, mede, T_OK, DRIVER, registraErro
} from './_base.js';

const ERROS = {
  caminho: 'Arquivo em lugar inválido.',
  registro: 'Esse lead não foi encontrado. Pode ter sido apagado.',
  dono: 'Esse lead é de outra pessoa.',
  etapa: 'O R1 não usa vídeo nem leitura.',
  autorizacao: 'Marque a autorização do responsável antes de enviar o vídeo.'
};
const MB = 1024 * 1024;
const mb = n => Math.round(n / MB).toLocaleString('pt-BR');
const apagaArquivos = async caminhos => { const c = caminhos.filter(Boolean); if (c.length) { try { await apaga(c); } catch { /* já não existe */ } } };
const envioDeTeste = () => DRIVER !== 'blob' && process.env.ENVIO_DE_TESTE === '1';

// o espaço dos vídeos pra um arquivo de "bytes" caber: soma videos/ (fresco), roda a passada se não couber e confere de novo
async function cabe(bytes) {
  let e = await espacoVideos({ fresco: true });
  if (e.usado + bytes <= e.max) return null;
  const p = await passadaVideos();
  e = { usado: p.usado, max: e.max };
  if (e.usado + bytes <= e.max) return null;
  return 'O espaço dos vídeos está cheio (' + mb(e.usado) + ' MB de ' + mb(e.max) + ' MB' + (bytes ? '; este arquivo tem ' + mb(bytes) + ' MB' : '') +
    '). Apague vídeos de leads já apresentados na aba Gerados e tente de novo.';
}

async function envio(req, res, eu) {
  if (DRIVER !== 'blob' && !envioDeTeste()) return manda(res, 501, { erro: 'O envio de vídeo só funciona com a loja de Blob (no ar).' });
  const body = await corpo(req);
  if (!body || body.type !== 'blob.generate-client-token') return manda(res, 400, { erro: 'Pedido não aceito.' });
  const { handleUpload } = await import('@vercel/blob/client');
  let semEspaco = '';
  try {
    const r = await handleUpload({
      request: req,
      body,
      // no teste local (driver de arquivo) o token é assinado com uma chave de mentira e o envio vai pro Blob de mentira do servidor de teste
      token: envioDeTeste() ? 'vercel_blob_rw_testelocal_' + 'x'.repeat(32) : undefined,
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
        if (!poster) {
          const bytes = Math.max(0, Math.round(Number(p.bytes)) || 0);
          semEspaco = await cabe(bytes);
          if (semEspaco) throw new Error('espaco');
        }
        return {
          allowedContentTypes: poster ? ['image/jpeg'] : Object.keys(TIPOS_VIDEO),
          maximumSizeInBytes: poster ? POSTER_MAX_BYTES : VIDEO_TETO_BYTES,
          addRandomSuffix: false,
          allowOverwrite: false,
          // sem limite de tamanho o envio pode passar de 1 hora numa conexão lenta
          validUntil: Date.now() + 6 * 3600 * 1000,
          tokenPayload: JSON.stringify({ t, por: eu.login })
        };
      }
    });
    manda(res, 200, r);
  } catch (e) {
    registraErro('leitura-envio', e);
    manda(res, 400, { erro: (e && e.message === 'espaco' && semEspaco) || ERROS[e && e.message] || 'O painel não conseguiu liberar o envio agora. Tente de novo.' });
  }
}

export default async function handler(req, res) {
  mede(res, 'leitura');
  try {
    const eu = await exige(req, res);
    if (!eu) return;
    if (req.method === 'POST') return envio(req, res, eu);
    const t = String((req.query && req.query.t) || '');
    if (!T_OK.test(t)) return manda(res, 404, { erro: ERROS.registro });
    const regras = { tipos: TIPOS_LANCE, validadeHoras: VALIDADE.videoHoras, tetoBytes: VIDEO_TETO_BYTES, tetoSegundos: VIDEO_TETO_S, envio: DRIVER === 'blob' || envioDeTeste() };

    if (req.method === 'GET') {
      // a passada de limpeza dos vídeos (de vez em quando) e o espaço que esta instância já sabe, junto da leitura do lead
      await passadaDeVezEmQuando();
      const r = await leRegistro(t), espaco = espacoSabido();
      if (!r) return manda(res, 404, { erro: ERROS.registro });
      if (!podeMexer(eu, r.dados)) return manda(res, 403, { erro: ERROS.dono });
      if (etapaDe(r.dados) === 'r1') return manda(res, 400, { erro: ERROS.etapa });
      const v = r.dados.video || null;
      return manda(res, 200, {
        t, nome: (r.dados.ficha && r.dados.ficha.nome) || '', apelido: (r.dados.ficha && r.dados.ficha.apelido) || '', video: v, leitura: r.dados.leitura || null,
        valido: videoValido(v), vencido: videoVencido(v), regras, espaco
      });
    }

    if (req.method === 'PUT') {
      const b = await corpo(req);
      let erro = null, lixo = [], proibido = false, avisos = [];
      const reg = await mudaRegistro(t, r => {
        erro = null; lixo = []; avisos = [];
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
            r.leitura = null; // os lances eram do vídeo anterior
          }
          // a capa velha sai quando chega outra (ou quando o vídeo troca e a nova não veio)
          if (antes.poster && antes.poster !== lv.video.poster && (lv.video.poster || antes.arquivo !== lv.video.arquivo)) lixo.push(antes.poster);
          const capa = lv.video.poster || (antes.arquivo === lv.video.arquivo ? antes.poster || '' : '');
          r.video = Object.assign({}, antes, lv.video, { poster: capa, enviadoEm: new Date().toISOString(), venceEm: venceVideo() });
          if (!lv.video.largura) { delete r.video.largura; delete r.video.altura; }
          anota(r, eu, 'enviou o vídeo (sai do ar em ' + VALIDADE.videoHoras + ' horas)');
        }
        if (b.renovar === true) {
          if (!videoValido(r.video)) { erro = 'O vídeo já saiu do ar. Envie de novo.'; return false; }
          r.video.venceEm = venceVideo();
          anota(r, eu, 'renovou o vídeo por mais ' + VALIDADE.videoHoras + ' horas');
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
          avisos = erros.slice(0, 8);
          r.leitura = Object.assign(leitura, { por: eu.login, em: new Date().toISOString() });
          anota(r, eu, 'salvou a leitura (' + leitura.lances.length + ' lances' + (leitura.origem ? '' : ', sem a fonte') + ')');
        }
        r.atualizadoPor = quem(eu); r.atualizadoEm = new Date().toISOString();
      });
      if (proibido) return manda(res, 403, { erro: ERROS.dono });
      if (!reg) return manda(res, 404, { erro: ERROS.registro });
      // com erro, nada foi gravado: os arquivos ficam (o vencido é apagado no próximo salvamento que der certo)
      if (erro) return manda(res, 400, { erro });
      await Promise.all([apagaArquivos(lixo), poeNoIndice(reg)]);
      return manda(res, 200, { video: reg.video || null, leitura: reg.leitura || null, valido: videoValido(reg.video), avisos });
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
