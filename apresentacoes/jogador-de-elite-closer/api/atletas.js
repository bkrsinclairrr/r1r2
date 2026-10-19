// Os leads de cada atleta, um registro por atleta (atletas/<t>.json), de uma etapa: R1 (o SDR) ou R2 (o closer). Precisa de login.
// GET                 os leads do usuário (o admin vê todos com ?todos=1), com a etiqueta de cada um e a etapa. Com ?gerados=1 (a seção
//                     Gerados), também o espaço que cada um ocupa na loja (espaco: { ficha, foto, video, total }, em bytes) e o total
// GET ?t=             o registro inteiro, o link, a etiqueta, o checklist e a presença (dono ou admin)
// POST                cria { ficha, etapa?, link?: { venceEm?, apagarAoVencer? } } e devolve { t, link, registro }; a personalização é opcional. A
//                     etapa é a do papel: o SDR cria R1, o closer cria R2; o admin escolhe (R2 se não disser). Pedir a etapa de outro papel dá 403.
//                     link.venceEm: o dia e a hora em que o link expira, escolhidos por quem monta (sem ela, a automática: 7 dias depois da call);
//                     link.apagarAoVencer: a limpeza diária apaga tudo do lead depois que o link vence
//                     rascunho: true cria a apresentação SEM link (o painel monta a foto, o vídeo e a ficha e só no fim aperta "Gerar link",
//                     POST /api/link?acao=gerar). Sem o rascunho, o link já nasce valendo (como sempre foi)
// PUT ?t=             { ficha, base, nota?, conferido? } salva a ficha (dono ou admin). base é a versão da ficha que o
//                     formulário carregou (fichaEm): se outra pessoa salvou depois, 409 com quem salvou e quando.
//                     Foto, vídeo e link têm versão própria e não geram conflito com a ficha.
// PUT ?t=             { previa: true } marca que a prévia foi olhada nesta versão da ficha e da foto
// PUT ?t=             { dono: 'login' } troca o dono (só o admin); o dono novo tem que montar a etapa do lead
// DELETE ?t=          apaga em cascata: registro, fotos, vídeo, presença e o item do índice do dono (dono ou admin)
// DELETE              { ts: [códigos] } apaga vários de uma vez (a seção Gerados), até 50 por pedido; devolve { apagados, recusados }
import {
  exige, manda, corpo, limpaFicha, versaoInvalida, textoLimpo, grava, le, conflito, novoCodigo, caminho, caminhoChamada, leRegistro, mudaRegistro,
  quem, podeMexer, anota, venceDoLink, maisTarde, estadoGuardado, pacote, leVersoesCom, resumo, mudaIndice, poeNoIndice, leIndice, leTodosIndices,
  emCallAgora, apagaTudo, apagaArquivos, tiraDosIndices, achaUsuario, chavesDaEtapa, etapaDe, podeEtapa, validadePedida, espacoPorLead, PRESENCA_MS, T_OK, R,
  registraErro
} from './_base.js';

// as palavras da etapa na tela: o R1 é do SDR, o R2 do closer
const rotulo = etapa => (etapa === 'r1' ? 'R1' : 'R2');
const deOutro = etapa => (etapa === 'r1' ? 'Esse R1 é de outro SDR.' : 'Esse R2 é de outro closer.');
const NAO_ACHEI = 'Esse lead não foi encontrado. Pode ter sido apagado.';

async function presenca(t) {
  const c = await le(caminhoChamada(t));
  const d = c && c.dados;
  return d && d.sid && d.visto && Date.now() - Date.parse(d.visto) < PRESENCA_MS ? { desde: d.desde, visto: d.visto } : null;
}

export default async function handler(req, res) {
  try {
    const eu = await exige(req, res);
    if (!eu) return;
    const t = String((req.query && req.query.t) || '');
    if (t && !T_OK.test(t)) return manda(res, 404, { erro: 'Esse lead não foi encontrado.' });

    if (req.method === 'GET' && !t) {
      const todos = eu.papel === 'admin' && String((req.query && req.query.todos) || '') === '1';
      const gerados = String((req.query && req.query.gerados) || '') === '1';
      const [itens, emCall, espaco] = await Promise.all([todos ? leTodosIndices() : leIndice(eu.login), emCallAgora(), gerados ? espacoPorLead() : null]);
      const vazio = { ficha: 0, foto: 0, video: 0, total: 0 };
      const lista = Object.values(itens).map(it => Object.assign({}, it, {
        etapa: it.etapa === 'r1' ? 'r1' : 'r2', // o item de antes do R1 não tem a etapa: era R2
        estadoTela: it.linkGerado === false ? 'preparo' : it.estado === 'revogado' ? 'revogado' : it.venceEm && Date.parse(it.venceEm) <= Date.now() ? 'expirado' : it.estado || 'rascunho',
        emCall: emCall.has(it.t)
      }, espaco ? { espaco: espaco[it.t] || vazio } : {}));
      const saida = { itens: lista, hoje: R.hojeSP(), todos };
      if (espaco) saida.totalBytes = lista.reduce((s, it) => s + it.espaco.total, 0);
      return manda(res, 200, saida);
    }

    if (req.method === 'GET') {
      const r = await leRegistro(t);
      if (!r) return manda(res, 404, { erro: NAO_ACHEI });
      if (!podeMexer(eu, r.dados)) return manda(res, 403, { erro: deOutro(etapaDe(r.dados)) });
      return manda(res, 200, Object.assign(await pacote(r.dados), { emCall: await presenca(t) }));
    }

    if (req.method === 'POST') {
      const b = await corpo(req);
      const entrada = b.ficha;
      // a etapa é a do papel (o SDR monta o R1, o closer o R2); o admin escolhe, e sem dizer é R2
      const etapa = b.etapa === 'r1' || b.etapa === 'r2' ? b.etapa : (eu.papel === 'sdr' ? 'r1' : 'r2');
      if (!podeEtapa(eu.papel, etapa)) return manda(res, 403, { erro: etapa === 'r1' ? 'Só o SDR e o admin montam o R1.' : 'Só o closer e o admin montam o R2.' });
      const V = await leVersoesCom(entrada && entrada.versao);
      const ficha = limpaFicha(entrada, V, etapa);
      if (versaoInvalida(entrada, ficha, etapa)) return manda(res, 400, { erro: 'Essa variação do ' + rotulo(etapa) + ' não existe mais. Recarregue a página e escolha de novo.' });
      // a validade que quem monta escolheu ao gerar (opcional); sem ela, a automática (7 dias depois da call)
      const lk = b.link && typeof b.link === 'object' ? b.link : {};
      let venceEscolhido = '';
      if (lk.venceEm != null && lk.venceEm !== '') {
        const v = validadePedida(lk.venceEm);
        if (v.erro) return manda(res, 400, { erro: v.erro });
        venceEscolhido = v.venceEm;
      }
      const agora = new Date().toISOString();
      let reg = null;
      // o código é aleatório; se por acaso já existir, sorteia outro (gravação só se o arquivo não existe)
      for (let i = 0; i < 5 && !reg; i++) {
        const novo = {
          t: novoCodigo(), v: 1, rev: 1, etapa, estado: 'rascunho', donoLogin: eu.login, dono: quem(eu), criadoPor: quem(eu), criadoEm: agora,
          atualizadoPor: quem(eu), atualizadoEm: agora, fichaPor: quem(eu), fichaEm: agora, venceEm: venceEscolhido || venceDoLink(ficha, agora, etapa),
          venceManual: !!venceEscolhido, apagarAoVencer: lk.apagarAoVencer === true, linkGerado: b.rascunho !== true,
          ficha, foto: null, video: null, leitura: null, nota: '', conferido: {}, historico: []
        };
        anota(novo, eu, b.rascunho === true ? 'começou o ' + rotulo(etapa) + ' (rascunho, ainda sem link)' : 'criou o ' + rotulo(etapa) + ' e gerou o link' + (venceEscolhido ? ' (expira em ' + R.dataCurta(venceEscolhido) + ')' : ''));
        novo.estado = estadoGuardado(novo, V);
        try { await grava(caminho(novo.t), novo, { novo: true }); reg = novo; } catch (e) { if (!conflito(e)) throw e; }
      }
      if (!reg) throw new Error('não consegui sortear um código livre');
      await poeNoIndice(reg);
      return manda(res, 201, Object.assign({ t: reg.t }, await pacote(reg)));
    }

    if (req.method === 'PUT' && t) {
      const b = await corpo(req);
      let proibido = false;
      const r0 = await leRegistro(t);
      if (!r0) return manda(res, 404, { erro: NAO_ACHEI });
      const etapa = etapaDe(r0.dados);

      // o admin troca o dono: o item sai do índice do antigo e entra no do novo. O dono novo tem que montar a etapa do lead
      if (b.dono != null) {
        if (eu.papel !== 'admin') return manda(res, 403, { erro: 'Só o admin troca o dono de um ' + rotulo(etapa) + '.' });
        const alvo = await achaUsuario(b.dono);
        if (!alvo) return manda(res, 400, { erro: 'Esse usuário não existe.' });
        if (!podeEtapa(alvo.papel, etapa)) return manda(res, 400, { erro: 'Esse usuário não monta ' + rotulo(etapa) + '.' });
        let antigo = '';
        const reg = await mudaRegistro(t, r => {
          antigo = r.donoLogin;
          if (antigo === alvo.login) return false;
          r.donoLogin = alvo.login; r.dono = quem(alvo);
          r.atualizadoEm = new Date().toISOString(); r.atualizadoPor = quem(eu);
          anota(r, eu, 'passou o ' + rotulo(etapa) + ' pra ' + alvo.login);
        });
        if (!reg) return manda(res, 404, { erro: NAO_ACHEI });
        if (antigo && antigo !== alvo.login) await mudaIndice(antigo, itens => { delete itens[t]; });
        await poeNoIndice(reg);
        return manda(res, 200, await pacote(reg));
      }

      // a prévia foi olhada nesta versão da ficha e da foto (não mexe na versão da ficha)
      const V = await leVersoesCom(b.ficha && b.ficha.versao);
      if (b.previa === true) {
        const reg = await mudaRegistro(t, r => {
          if (!podeMexer(eu, r)) { proibido = true; return false; }
          r.conferido = Object.assign({}, r.conferido, { previa: r.fichaEm, previaFoto: (r.foto && r.foto.versao) || 0 });
          r.estado = estadoGuardado(r, V);
        });
        if (proibido) return manda(res, 403, { erro: deOutro(etapa) });
        if (!reg) return manda(res, 404, { erro: NAO_ACHEI });
        await poeNoIndice(reg);
        return manda(res, 200, await pacote(reg));
      }

      // a ficha, com versão: se mudou desde que o formulário carregou, 409 (o painel pergunta: recarregar ou sobrescrever)
      const ficha = limpaFicha(b.ficha, V, etapa);
      if (versaoInvalida(b.ficha, ficha, etapa)) return manda(res, 400, { erro: 'Essa variação do ' + rotulo(etapa) + ' não existe mais. Recarregue a página e escolha de novo.' });
      let conflitoCom = null, mudou = [];
      const reg = await mudaRegistro(t, r => {
        conflitoCom = null; mudou = [];
        if (!podeMexer(eu, r)) { proibido = true; return false; }
        if (String(b.base || '') !== String(r.fichaEm || '')) {
          conflitoCom = { por: (r.fichaPor && r.fichaPor.nome) || '', em: r.fichaEm, base: r.fichaEm };
          return false;
        }
        const antes = r.ficha || {};
        r.ficha = Object.assign({}, antes);
        // grava só os campos da ficha, campo por campo: o resto do registro (foto, vídeo, link) fica como está
        mudou = chavesDaEtapa(etapa).filter(k => String(antes[k] || '') !== String(ficha[k] || ''));
        mudou.forEach(k => { if (ficha[k]) r.ficha[k] = ficha[k]; else delete r.ficha[k]; });
        if (b.nota !== undefined) r.nota = textoLimpo(b.nota, 600);
        // "conferi o nome": vale pro nome exato que foi conferido (mudou o nome, precisa conferir de novo)
        r.conferido = Object.assign({}, r.conferido);
        if (b.conferido && b.conferido.nome === true) r.conferido.nome = r.ficha.nome;
        if (b.conferido && b.conferido.nome === false) delete r.conferido.nome;
        // a call mudou de dia: o link passa a valer até 7 dias depois dela (nunca encurta). A validade que quem monta escolheu não muda
        if (mudou.includes('r2data') && !r.venceManual) r.venceEm = maisTarde(r.venceEm, venceDoLink(r.ficha, undefined, etapa));
        const agora = new Date().toISOString();
        r.fichaEm = agora; r.fichaPor = quem(eu); r.atualizadoEm = agora; r.atualizadoPor = quem(eu);
        anota(r, eu, mudou.length ? 'salvou a ficha (' + mudou.join(', ') + ')' : 'salvou a ficha');
        r.estado = estadoGuardado(r, V);
      });
      if (proibido) return manda(res, 403, { erro: deOutro(etapa) });
      if (!reg) return manda(res, 404, { erro: NAO_ACHEI });
      if (conflitoCom) return manda(res, 409, { erro: (conflitoCom.por || 'Outra pessoa') + ' salvou esta ficha depois que você abriu.', conflito: conflitoCom });
      await poeNoIndice(reg);
      return manda(res, 200, await pacote(reg));
    }

    // vários de uma vez (Gerados): cada um conferido (dono ou admin), os arquivos apagados e cada índice mexido uma vez só
    if (req.method === 'DELETE' && !t) {
      const b = await corpo(req);
      const ts = [...new Set((Array.isArray(b.ts) ? b.ts : []).map(String))].filter(x => T_OK.test(x));
      if (!ts.length) return manda(res, 400, { erro: 'Escolha o que excluir.' });
      if (ts.length > 50) return manda(res, 400, { erro: 'Exclua no máximo 50 de uma vez.' });
      const apagados = [], recusados = [], sumidos = [], porDono = {};
      for (const x of ts) {
        const r = await leRegistro(x);
        if (!r) { sumidos.push(x); apagados.push(x); continue; }
        if (!podeMexer(eu, r.dados)) { recusados.push(x); continue; }
        await apagaArquivos(x);
        (porDono[r.dados.donoLogin] = porDono[r.dados.donoLogin] || []).push(x);
        apagados.push(x);
      }
      for (const [dono, lista] of Object.entries(porDono)) if (dono) await mudaIndice(dono, itens => { lista.forEach(x => { delete itens[x]; }); });
      // o que já não existia sai do índice de quem pediu (e, pro admin, de qualquer índice que ainda tenha)
      if (sumidos.length) {
        await mudaIndice(eu.login, itens => { sumidos.forEach(x => { delete itens[x]; }); });
        if (eu.papel === 'admin') await tiraDosIndices(sumidos);
      }
      return manda(res, 200, { ok: true, apagados, recusados });
    }

    if (req.method === 'DELETE' && t) {
      const r = await leRegistro(t);
      if (r) {
        if (!podeMexer(eu, r.dados)) return manda(res, 403, { erro: 'Só o dono do ' + rotulo(etapaDe(r.dados)) + ' ou o admin pode apagar.' });
        await apagaTudo(t, r.dados.donoLogin);
      }
      await mudaIndice(eu.login, itens => { delete itens[t]; });
      return manda(res, 200, { ok: true });
    }
    manda(res, 405, { erro: 'Pedido não aceito.' });
  } catch (e) {
    registraErro('atletas', e);
    manda(res, 500, { erro: 'O painel não conseguiu salvar agora. Tente de novo em instantes.' });
  }
}
