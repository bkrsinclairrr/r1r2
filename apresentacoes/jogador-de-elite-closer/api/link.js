// O link do R2 de um atleta. Precisa de login (dono ou admin). POST ?t=&acao= com corpo JSON:
// gerar       o rascunho ganha o link (só aqui o link passa a existir pra família). Validade escolhida fica; a automática conta de agora
// revogar     a família deixa de ver na hora (/api/r2 responde "revogado", foto e vídeo saem do ar)
// reativar    volta a valer (se ainda estiver dentro da validade)
// renovar     { dias } nova validade a partir de hoje, de 1 a 60 dias
// validade    { venceEm?, apagarAoVencer?, auto? } o dia e a hora em que o link expira, escolhidos por quem monta (daqui a pelo menos
//             1 minuto, até 60 dias), e se a limpeza diária apaga tudo do lead depois que vencer. auto: volta pra validade automática
//             (7 dias depois da call). A validade escolhida não muda quando o dia da call muda
// encerrar    a call aconteceu: só a etiqueta muda, o link continua valendo até a validade pra família rever
// reabrir     tira a etiqueta de encerrado
// regenerar   código novo: copia o registro, as fotos e o vídeo, apaga o antigo e atualiza o índice. O link velho passa a
//             responder "nao-encontrado"
import {
  exige, manda, corpo, le, grava, apaga, apagaPasta, lista, conflito, novoCodigo, caminho, caminhoChamada, mudaRegistro, mudaIndice, poeNoIndice,
  podeMexer, quem, anota, estadoGuardado, pacote, leVersoes, resumo, venceDoLink, validadePedida, etapaDe, PASTA_MAPA, T_OK, VALIDADE, DIA, R, registraErro
} from './_base.js';
import { copia } from './_armazenamento.js';

const TIPOS = { jpg: 'image/jpeg', mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime' };
const tipoDe = c => TIPOS[String(c).split('.').pop()] || 'application/octet-stream';
// a validade nova: fim do dia (São Paulo) daqui a N dias
const fimDoDia = dias => {
  const d = new Date(Date.now() + dias * DIA - 3 * 3600e3).toISOString().slice(0, 10);
  return new Date(Date.parse(d + 'T23:59:59-03:00')).toISOString();
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return manda(res, 405, { erro: 'Use POST.' });
  try {
    const eu = await exige(req, res);
    if (!eu) return;
    const t = String((req.query && req.query.t) || '');
    const acao = String((req.query && req.query.acao) || '');
    if (!T_OK.test(t)) return manda(res, 404, { erro: 'Esse lead não foi encontrado.' });
    const b = await corpo(req);
    const V = await leVersoes();
    let proibido = false, erro = null;
    const agora = () => new Date().toISOString();

    if (['gerar', 'revogar', 'reativar', 'renovar', 'encerrar', 'reabrir', 'validade'].includes(acao)) {
      const dias = Math.round(Number(b.dias));
      if (acao === 'renovar' && !(dias >= 1 && dias <= VALIDADE.linkMax)) return manda(res, 400, { erro: 'A validade nova vai de 1 a ' + VALIDADE.linkMax + ' dias.' });
      // a validade escolhida: conferida antes de abrir o registro
      let vence = null;
      if (acao === 'validade' && b.auto !== true && b.venceEm != null) {
        vence = validadePedida(b.venceEm);
        if (vence.erro) return manda(res, 400, { erro: vence.erro });
      }
      if (acao === 'validade' && b.auto !== true && !vence && typeof b.apagarAoVencer !== 'boolean') return manda(res, 400, { erro: 'Escolha a validade do link.' });
      const reg = await mudaRegistro(t, r => {
        erro = null;
        if (!podeMexer(eu, r)) { proibido = true; return false; }
        if (acao === 'gerar') {
          if (r.linkGerado !== false) return false; // já tem link: nada muda
          r.linkGerado = true; r.linkGeradoEm = agora();
          // a validade escolhida no rascunho já passou: o link não nasce vencido, volta pra automática (e o histórico diz)
          const vencida = r.venceManual && (!r.venceEm || Date.parse(r.venceEm) <= Date.now() + 60000);
          if (vencida) r.venceManual = false;
          if (!r.venceManual) r.venceEm = venceDoLink(r.ficha, agora(), etapaDe(r));
          anota(r, eu, vencida ? 'gerou o link (a validade escolhida já tinha passado: voltou pra automática)' : 'gerou o link');
        }
        if (acao === 'revogar') { r.estado = 'revogado'; r.revogadoEm = agora(); anota(r, eu, 'revogou o link'); }
        if (acao === 'reativar') {
          if (r.estado !== 'revogado') return false;
          r.estado = 'rascunho'; delete r.revogadoEm; anota(r, eu, 'reativou o link');
        }
        if (acao === 'renovar') { r.venceEm = fimDoDia(dias); r.venceManual = true; anota(r, eu, 'renovou o link por ' + dias + ' dias'); }
        if (acao === 'validade') {
          if (b.auto === true) { r.venceManual = false; r.venceEm = venceDoLink(r.ficha, agora(), etapaDe(r)); anota(r, eu, 'voltou a validade do link pra automática (até ' + R.dataCurta(r.venceEm) + ')'); }
          else if (vence) { r.venceEm = vence.venceEm; r.venceManual = true; anota(r, eu, 'escolheu a validade do link: até ' + R.dataCurta(r.venceEm)); }
          if (typeof b.apagarAoVencer === 'boolean' && b.apagarAoVencer !== !!r.apagarAoVencer) {
            r.apagarAoVencer = b.apagarAoVencer;
            anota(r, eu, b.apagarAoVencer ? 'marcou pra apagar tudo quando o link vencer' : 'desmarcou o apagar quando o link vencer');
          }
        }
        if (acao === 'encerrar') {
          if (r.estado === 'revogado') { erro = 'O link está revogado. Reative antes de encerrar.'; return false; }
          r.estado = 'encerrado'; r.encerradoEm = agora(); anota(r, eu, 'marcou a call como encerrada');
        }
        if (acao === 'reabrir') {
          if (r.estado !== 'encerrado') return false;
          r.estado = 'rascunho'; delete r.encerradoEm; anota(r, eu, 'reabriu o R2');
        }
        r.estado = estadoGuardado(r, V);
        r.atualizadoEm = agora(); r.atualizadoPor = quem(eu);
      });
      if (proibido) return manda(res, 403, { erro: 'Esse lead é de outra pessoa.' });
      if (!reg) return manda(res, 404, { erro: 'Esse lead não foi encontrado. Pode ter sido apagado.' });
      if (erro) return manda(res, 400, { erro });
      await poeNoIndice(reg);
      return manda(res, 200, await pacote(reg));
    }

    if (acao === 'regenerar') {
      // 1. tranca o código velho: a família deixa de ver na hora, e ninguém mexe enquanto copia
      const r1 = await mudaRegistro(t, r => {
        if (!podeMexer(eu, r)) { proibido = true; return false; }
        r.movendo = true; r.estado = 'revogado'; r.revogadoEm = agora();
      });
      if (proibido) return manda(res, 403, { erro: 'Esse lead é de outra pessoa.' });
      if (!r1) return manda(res, 404, { erro: 'Esse lead não foi encontrado. Pode ter sido apagado.' });
      const atual = (await le(caminho(t))).dados;
      // 2. código novo, fotos e vídeo copiados pra pasta dele (os caminhos do vídeo levam o código)
      let t2 = '';
      for (let i = 0; i < 5 && !t2; i++) { const c = novoCodigo(); if (!(await le(caminho(c)))) t2 = c; }
      if (!t2) throw new Error('não consegui sortear um código livre');
      const arquivos = (await lista('fotos/' + t + '/')).concat(await lista('videos/' + t + '/'), await lista(PASTA_MAPA + t + '/'));
      for (const a of arquivos) await copia(a.caminho, a.caminho.replace('/' + t + '/', '/' + t2 + '/'), tipoDe(a.caminho));
      const novo = JSON.parse(JSON.stringify(atual));
      novo.t = t2; novo.rev = (atual.rev || 0) + 1;
      delete novo.movendo; delete novo.revogadoEm;
      novo.estado = 'rascunho'; // o link novo nasce valendo (a etiqueta volta a seguir o checklist)
      if (novo.video) ['arquivo', 'poster'].forEach(k => { if (novo.video[k]) novo.video[k] = novo.video[k].replace('videos/' + t + '/', 'videos/' + t2 + '/'); });
      novo.atualizadoEm = agora(); novo.atualizadoPor = quem(eu);
      anota(novo, eu, 'gerou outro link');
      novo.estado = estadoGuardado(novo, V);
      try { await grava(caminho(t2), novo, { novo: true }); } catch (e) { if (conflito(e)) throw new Error('código novo já existia'); throw e; }
      // 3. o antigo some (registro, fotos, vídeo e presença) e o índice troca o código
      await apagaPasta('fotos/' + t + '/');
      await apagaPasta('videos/' + t + '/');
      await apagaPasta(PASTA_MAPA + t + '/');
      await apaga([caminhoChamada(t), caminho(t)]);
      await mudaIndice(novo.donoLogin, itens => { delete itens[t]; itens[t2] = resumo(novo); });
      return manda(res, 200, Object.assign({ t: t2 }, await pacote(novo)));
    }
    manda(res, 400, { erro: 'Ação desconhecida.' });
  } catch (e) {
    registraErro('link', e);
    manda(res, 500, { erro: 'O painel não conseguiu mudar o link agora. Tente de novo em instantes.' });
  }
}
