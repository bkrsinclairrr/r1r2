// Limpeza diária (Cron da Vercel, configurado no vercel.json): GET com Authorization: Bearer $CRON_SECRET (a Vercel manda
// sozinha quando a variável existe). Foto de menor e vídeo de menor não ficam guardados além do combinado:
// - foto e vídeo vencidos (90 dias) somem, com os arquivos;
// - versões velhas de foto que sobraram de um envio interrompido somem;
// - arquivos de um atleta que não existe mais somem;
// - presença do apresentador com mais de um dia some;
// - o registro inteiro (e tudo dele) some 180 dias depois que o link venceu.
// - sincroniza com o deck (as variações do R2 e a saúde de cada página);
// O log só tem contagem: nunca nome, foto ou conteúdo.
import crypto from 'node:crypto';
import {
  manda, le, lista, apaga, apagaPasta, mudaRegistro, mudaIndice, poeNoIndice, resumo, apagaTudo, fotoVencida, videoVencido, estadoGuardado, leVersoes,
  caminhoFoto, PASTA, VALIDADE, DIA, registraErro
} from './_base.js';
import { sincroniza } from './_sincroniza.js';

const igual = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const codigoDe = (c, pasta) => c.slice(pasta.length).split('/')[0];

export default async function handler(req, res) {
  if (req.method !== 'GET') return manda(res, 405, { erro: 'Use GET.' });
  const segredo = process.env.CRON_SECRET || '';
  if (segredo.length < 16 || !igual(req.headers.authorization || '', 'Bearer ' + segredo)) return manda(res, 401, { erro: 'Não autorizado.' });
  const conta = { registros: 0, apagados: 0, fotosVencidas: 0, videosVencidos: 0, sobras: 0, presencas: 0 };
  try {
    const agora = Date.now();
    const V = await leVersoes();
    const vivos = new Set();
    for (const item of await lista(PASTA)) {
      const r = await le(item.caminho);
      if (!r || !r.dados || !r.dados.t) continue;
      const reg = r.dados, t = reg.t;
      conta.registros++;
      if (reg.venceEm && Date.parse(reg.venceEm) + VALIDADE.registroDepoisDoLink * DIA <= agora) {
        await apagaTudo(t, reg.donoLogin); conta.apagados++; continue;
      }
      vivos.add(t);
      let mudou = false;
      if (fotoVencida(reg.foto)) { await apagaPasta('fotos/' + t + '/'); conta.fotosVencidas++; mudou = true; }
      else {
        // sobra de envio interrompido: qualquer arquivo de foto que não é a versão atual
        const n = reg.foto && reg.foto.versao;
        const certos = n ? [caminhoFoto(t, 'retrato', n), caminhoFoto(t, 'avatar', n)] : [];
        const sobra = (await lista('fotos/' + t + '/')).map(f => f.caminho).filter(c => !certos.includes(c));
        if (sobra.length) { await apaga(sobra); conta.sobras += sobra.length; }
      }
      if (videoVencido(reg.video)) { await apagaPasta('videos/' + t + '/'); conta.videosVencidos++; mudou = true; }
      if (mudou) {
        const novo = await mudaRegistro(t, x => {
          if (fotoVencida(x.foto)) x.foto = null;
          if (videoVencido(x.video)) { x.video = null; x.leitura = null; }
          x.estado = estadoGuardado(x, V);
        });
        if (novo) await poeNoIndice(novo);
      }
    }
    // arquivos de atleta que não existe mais
    for (const pasta of ['fotos/', 'videos/']) {
      const orfaos = (await lista(pasta)).map(f => f.caminho).filter(c => !vivos.has(codigoDe(c, pasta)));
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
