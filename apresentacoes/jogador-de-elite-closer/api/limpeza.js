// Limpeza diária (Cron da Vercel, configurado no vercel.json): GET com Authorization: Bearer $CRON_SECRET (a Vercel manda
// sozinha quando a variável existe). Foto de menor e vídeo de menor não ficam guardados além do combinado:
// - o vídeo vence 24 horas depois do envio (a passada dos vídeos apaga o vencido, a sobra de envio interrompido e o de lead que não existe);
// - foto vencida (90 dias) some, com os arquivos;
// - versões velhas de foto e de mapa que sobraram de um envio interrompido somem;
// - arquivos de um atleta que não existe mais somem;
// - presença do apresentador com mais de um dia some;
// - o registro inteiro (e tudo dele) some 180 dias depois que o link venceu;
// - o lead que quem monta marcou pra apagar quando o link vencer (apagarAoVencer) some na primeira limpeza depois do vencimento.
// - sincroniza com o deck (as variações do R2 e a saúde de cada página);
// GET ?so=videos: só a passada dos vídeos (leve: uma listagem de videos/ e o registro de quem tem arquivo lá). É o que os Crons de 3h,
// 15h e 21h (UTC) rodam: no plano gratuito cada Cron roda uma vez por dia, então o vídeo vencido não espera o dia seguinte pra sumir.
// Desde 20/10/2026 a limpeza lista cada pasta uma vez só (fotos/, mapas/, videos/), em vez de duas listagens por lead: a listagem é uma
// operação avançada do Blob, e o plano gratuito tem 2.000 por mês. O log só tem contagem: nunca nome, foto ou conteúdo.
import crypto from 'node:crypto';
import {
  manda, le, lista, apaga, mudaRegistro, poeNoIndice, apagaTudo, fotoVencida, videoVencido, estadoGuardado, leVersoes, passadaVideos,
  caminhoFoto, caminhoMapa, PASTA, PASTA_MAPA, VALIDADE, DIA, registraErro
} from './_base.js';
import { sincroniza } from './_sincroniza.js';

const igual = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const codigoDe = (c, pasta) => c.slice(pasta.length).split('/')[0];
// os caminhos de uma pasta agrupados pelo código do lead (uma listagem só, pra todos)
const porLead = (itens, pasta) => {
  const m = new Map();
  itens.forEach(i => { const t = codigoDe(i.caminho, pasta); if (!m.has(t)) m.set(t, []); m.get(t).push(i.caminho); });
  return m;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') return manda(res, 405, { erro: 'Use GET.' });
  const segredo = process.env.CRON_SECRET || '';
  if (segredo.length < 16 || !igual(req.headers.authorization || '', 'Bearer ' + segredo)) return manda(res, 401, { erro: 'Não autorizado.' });
  if (String((req.query && req.query.so) || '') === 'videos') {
    try {
      const p = await passadaVideos();
      console.log('limpeza (vídeos): ' + JSON.stringify(p));
      return manda(res, 200, Object.assign({ ok: true }, p));
    } catch (e) {
      registraErro('limpeza-videos', e);
      return manda(res, 500, { erro: 'A passada dos vídeos parou no meio. Roda de novo no próximo Cron.' });
    }
  }
  const conta = { registros: 0, apagados: 0, apagadosAoVencer: 0, fotosVencidas: 0, videosVencidos: 0, sobras: 0, presencas: 0 };
  try {
    const agora = Date.now();
    // os vídeos primeiro: a passada vê a validade de cada um no registro (o vencido sai, o registro é limpo logo abaixo)
    const pv = await passadaVideos(agora);
    conta.sobras += pv.sobras + pv.orfaos;
    const V = await leVersoes();
    const vivos = new Set();
    const [regs, fotos, mapas] = await Promise.all([lista(PASTA), lista('fotos/'), lista(PASTA_MAPA)]);
    const fotosDe = porLead(fotos, 'fotos/'), mapasDe = porLead(mapas, PASTA_MAPA);
    for (const item of regs) {
      const r = await le(item.caminho);
      if (!r || !r.dados || !r.dados.t) continue;
      const reg = r.dados, t = reg.t;
      conta.registros++;
      if (reg.venceEm && Date.parse(reg.venceEm) + VALIDADE.registroDepoisDoLink * DIA <= agora) {
        await apagaTudo(t, reg.donoLogin); conta.apagados++; continue;
      }
      // só o link que existe vence: o rascunho marcado pra apagar espera o link nascer
      if (reg.apagarAoVencer && reg.linkGerado !== false && reg.venceEm && Date.parse(reg.venceEm) <= agora) {
        await apagaTudo(t, reg.donoLogin); conta.apagadosAoVencer++; continue;
      }
      vivos.add(t);
      let mudou = false;
      const dele = fotosDe.get(t) || [];
      if (fotoVencida(reg.foto)) { if (dele.length) await apaga(dele); conta.fotosVencidas++; mudou = true; }
      else {
        // sobra de envio interrompido: qualquer arquivo de foto que não é a versão atual
        const n = reg.foto && reg.foto.versao;
        const certos = n ? [caminhoFoto(t, 'retrato', n), caminhoFoto(t, 'avatar', n)] : [];
        const sobra = dele.filter(c => !certos.includes(c));
        if (sobra.length) { await apaga(sobra); conta.sobras += sobra.length; }
      }
      // versão velha do mapa de calor que sobrou de um envio interrompido
      const certoMapa = reg.mapa && reg.mapa.versao ? caminhoMapa(t, reg.mapa.versao) : '';
      const sobraMapa = (mapasDe.get(t) || []).filter(c => c !== certoMapa);
      if (sobraMapa.length) { await apaga(sobraMapa); conta.sobras += sobraMapa.length; }
      // os arquivos do vídeo vencido a passada já apagou: aqui só o registro fica limpo
      if (videoVencido(reg.video)) { conta.videosVencidos++; mudou = true; }
      if (mudou) {
        const novo = await mudaRegistro(t, x => {
          if (fotoVencida(x.foto)) x.foto = null;
          if (videoVencido(x.video)) { x.video = null; x.leitura = null; }
          x.estado = estadoGuardado(x, V);
        });
        if (novo) await poeNoIndice(novo);
      }
    }
    // fotos e mapas de atleta que não existe mais (os vídeos órfãos a passada já tirou)
    for (const [pasta, mapa] of [['fotos/', fotosDe], [PASTA_MAPA, mapasDe]]) {
      const orfaos = [];
      mapa.forEach((cs, t) => { if (!vivos.has(t)) orfaos.push(...cs); });
      if (orfaos.length) { await apaga(orfaos); conta.sobras += orfaos.length; }
    }
    // presença velha (o apresentador manda sinal a cada minuto; um dia sem sinal é sobra)
    const velhas = (await lista('chamadas/')).filter(c => agora - Date.parse(c.enviadoEm) > DIA).map(c => c.caminho);
    if (velhas.length) { await apaga(velhas); conta.presencas = velhas.length; }
    await sincroniza(); // todo dia, mesmo que ninguém abra a lista de variações (nunca lança)
    console.log('limpeza: ' + JSON.stringify(conta));
    manda(res, 200, Object.assign({ ok: true }, conta));
  } catch (e) {
    registraErro('limpeza', e);
    manda(res, 500, Object.assign({ erro: 'A limpeza parou no meio. Roda de novo amanhã.' }, conta));
  }
}
