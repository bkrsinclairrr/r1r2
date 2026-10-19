// A foto do atleta: o retrato (960 x 1280) e o avatar (400 x 400), recortados no navegador do closer.
// PUT ?t=      { retrato, avatar, autorizo: true } (JPEG em base64, num pedido só: a versão troca de uma vez e o deck nunca
//              vê o retrato de uma foto com o avatar de outra). Dono ou admin. Sem a autorização marcada, recusa.
//              Confere cada arquivo: começo FF D8 FF, fim FF D9, sem EXIF (o recorte em canvas já tira; aqui é a garantia),
//              dimensões exatas pelo marcador SOF e tamanho máximo. Grava com versão nova e apaga a anterior.
// DELETE ?t=   apaga as duas (dono ou admin)
// O mapa de calor do atleta (slide do dossiê, embaixo do vídeo) usa esta mesma rota (o plano da Vercel não tem função sobrando):
// PUT ?t=      { mapa } (JPEG em base64, normalizado no navegador, de 300 a 2400 px de lado, sem EXIF, até 900 KB): versão nova, apaga a anterior
// DELETE ?t=&v=mapa   apaga só o mapa
// GET ?t=&v=mapa&n=<versão>   pública, com as mesmas regras do link (fora do ar, só o dono e o admin veem)
// GET ?t=&v=retrato|avatar&n=<versão>   pública, com o código: serve a imagem só se o link vale (não revogado nem vencido),
//              a autorização está registrada, a foto está dentro da validade (90 dias) e n é a versão atual. Senão, 404.
//              Logado como dono ou admin, o painel vê a foto mesmo com o link revogado ou vencido.
import {
  exige, sessaoOpcional, manda, corpo, deBase64, jpegInfo, caminhoFoto, leRegistro, mudaRegistro, mudaIndice, poeNoIndice, podeMexer, quem, anota,
  estadoGuardado, pacote, leVersoes, resumo, fotoValida, foraDoAr, venceFoto, apaga, apagaPasta, conflito, etapaDe, caminhoMapa, PASTA_MAPA, T_OK, FOTO, MAPA,
  registraErro
} from './_base.js';
import { gravaBin, leBin } from './_armazenamento.js';


function nao(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.end('Não encontrado.');
}
// confere um dos dois arquivos; devolve o buffer ou o erro pra tela
function confereJpeg(b64, v) {
  const regra = FOTO[v], nome = v === 'retrato' ? 'O retrato' : 'O avatar';
  const buf = deBase64(b64);
  if (!buf) return { erro: nome + ' não chegou inteiro. Tente de novo.' };
  if (buf.length > regra.maxBytes) return { erro: nome + ' passou de ' + Math.round(regra.maxBytes / 1024) + ' KB.' };
  const info = jpegInfo(buf);
  if (!info) return { erro: nome + ' não é um JPEG válido. Escolha a foto de novo.' };
  if (info.exif) return { erro: nome + ' ainda tem dados da câmera (EXIF). Use o recorte do painel.' };
  if (info.largura !== regra.largura || info.altura !== regra.altura) return { erro: nome + ' precisa ter ' + regra.largura + ' x ' + regra.altura + '. Use o recorte do painel.' };
  return { buf };
}
// o mapa de calor: JPEG sem EXIF, de 300 a 2400 px de lado e até 900 KB (o painel já manda assim)
function confereMapa(b64) {
  const buf = deBase64(b64);
  if (!buf) return { erro: 'O mapa de calor não chegou inteiro. Tente de novo.' };
  if (buf.length > MAPA.maxBytes) return { erro: 'O mapa de calor passou de ' + Math.round(MAPA.maxBytes / 1024) + ' KB.' };
  const info = jpegInfo(buf);
  if (!info) return { erro: 'O mapa de calor não é uma imagem válida. Escolha de novo.' };
  if (info.exif) return { erro: 'O mapa de calor ainda tem dados da câmera (EXIF). Escolha pelo painel.' };
  if ([info.largura, info.altura].some(x => x < MAPA.min || x > MAPA.max)) return { erro: 'O mapa de calor precisa ter de ' + MAPA.min + ' a ' + MAPA.max + ' px de lado.' };
  return { buf, largura: info.largura, altura: info.altura };
}

export default async function handler(req, res) {
  const t = String((req.query && req.query.t) || '');
  try {
    if (req.method === 'GET' || req.method === 'HEAD') {
      const v = String((req.query && req.query.v) || ''), n = parseInt(String((req.query && req.query.n) || ''), 10);
      if (!T_OK.test(t) || !(FOTO[v] || v === 'mapa') || !(n > 0)) return nao(res);
      const r = await leRegistro(t);
      const reg = r && r.dados;
      if (!reg || reg.movendo) return nao(res);
      if (foraDoAr(reg, req.query && req.query.p)) { // revogado, vencido ou rascunho sem link (a prévia do painel passa com a chave)
        // fora do ar pra família; o dono e o admin continuam vendo no painel
        const eu = req.headers.cookie ? await sessaoOpcional(req) : null;
        if (!podeMexer(eu, reg)) return nao(res);
      }
      if (v === 'mapa' ? !(reg.mapa && reg.mapa.versao === n) : (!fotoValida(reg.foto) || reg.foto.versao !== n)) return nao(res);
      const b = await leBin(v === 'mapa' ? caminhoMapa(t, n) : caminhoFoto(t, v, n));
      if (!b) return nao(res);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/jpeg');
      if (b.tamanho) res.setHeader('Content-Length', String(b.tamanho));
      res.setHeader('Content-Disposition', 'inline');
      // a versão está no endereço: foto nova é endereço novo, então dá pra guardar uma hora no navegador
      res.setHeader('Cache-Control', 'private, max-age=3600');
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      if (req.method === 'HEAD') { b.fluxo.destroy(); return res.end(); }
      b.fluxo.on('error', () => res.destroy());
      res.on('close', () => b.fluxo.destroy());
      return b.fluxo.pipe(res);
    }

    const eu = await exige(req, res);
    if (!eu) return;
    if (!T_OK.test(t)) return manda(res, 404, { erro: 'Esse lead não foi encontrado.' });
    const r0 = await leRegistro(t);
    if (!r0) return manda(res, 404, { erro: 'Esse lead não foi encontrado. Pode ter sido apagado.' });
    if (!podeMexer(eu, r0.dados)) return manda(res, 403, { erro: etapaDe(r0.dados) === 'r1' ? 'Esse R1 é de outro SDR.' : 'Esse R2 é de outro closer.' });
    const V = await leVersoes();

    if (req.method === 'PUT') {
      const b = await corpo(req);
      if (b.mapa !== undefined) {
        if (etapaDe(r0.dados) === 'r1') return manda(res, 400, { erro: 'O R1 não usa o mapa de calor.' });
        const m = confereMapa(b.mapa);
        if (m.erro) return manda(res, 400, { erro: m.erro });
        let versao = ((r0.dados.mapa && r0.dados.mapa.versao) || 0) + 1, gravou = false;
        for (let i = 0; i < 6 && !gravou; i++) {
          try { await gravaBin(caminhoMapa(t, versao), m.buf, { tipo: 'image/jpeg', novo: true }); gravou = true; } catch (e) { if (!conflito(e)) throw e; versao++; }
        }
        if (!gravou) throw new Error('não consegui gravar o mapa');
        const agora = new Date().toISOString();
        let anterior = 0, valeu = false;
        const reg = await mudaRegistro(t, r => {
          const atual = (r.mapa && r.mapa.versao) || 0;
          valeu = atual < versao;
          if (!valeu) return false;
          anterior = atual;
          r.mapa = { versao, largura: m.largura, altura: m.altura, enviadoEm: agora, enviadoPor: eu.login };
          r.atualizadoEm = agora; r.atualizadoPor = quem(eu);
          anota(r, eu, anterior ? 'trocou o mapa de calor' : 'enviou o mapa de calor');
        });
        if (!reg) { await apaga([caminhoMapa(t, versao)]); return manda(res, 404, { erro: 'Esse lead não foi encontrado. Pode ter sido apagado.' }); }
        if (!valeu) await apaga([caminhoMapa(t, versao)]);
        else if (anterior) await apaga([caminhoMapa(t, anterior)]);
        await poeNoIndice(reg);
        return manda(res, 200, await pacote(reg));
      }
      if (b.autorizo !== true) return manda(res, 400, { erro: 'Marque a autorização do responsável legal antes de enviar a foto.' });
      const ret = confereJpeg(b.retrato, 'retrato');
      if (ret.erro) return manda(res, 400, { erro: ret.erro });
      const av = confereJpeg(b.avatar, 'avatar');
      if (av.erro) return manda(res, 400, { erro: av.erro });
      // os dois arquivos com a versão nova, sem sobrescrever nada. Se outro envio pegou a mesma versão, vai pra próxima
      // (quem grava primeiro o retrato de uma versão fica com ela; o avatar vem sempre depois do retrato)
      let versao = ((r0.dados.foto && r0.dados.foto.versao) || 0) + 1, gravou = false;
      for (let i = 0; i < 6 && !gravou; i++) {
        try {
          await gravaBin(caminhoFoto(t, 'retrato', versao), ret.buf, { tipo: 'image/jpeg', novo: true });
          await gravaBin(caminhoFoto(t, 'avatar', versao), av.buf, { tipo: 'image/jpeg', novo: true });
          gravou = true;
        } catch (e) { if (!conflito(e)) throw e; versao++; }
      }
      if (!gravou) throw new Error('não consegui gravar a foto');
      const agora = new Date().toISOString();
      let anterior = 0, valeu = false;
      const reg = await mudaRegistro(t, r => {
        const atual = (r.foto && r.foto.versao) || 0;
        valeu = atual < versao;
        if (!valeu) return false; // outro envio já gravou uma versão mais nova
        anterior = atual;
        r.foto = { versao, autorizadoPor: eu.nome + ' (' + eu.login + ')', autorizadoEm: agora, enviadoEm: agora, venceEm: venceFoto() };
        r.atualizadoEm = agora; r.atualizadoPor = quem(eu);
        anota(r, eu, anterior ? 'trocou a foto' : 'enviou a foto');
        r.estado = estadoGuardado(r, V);
      });
      if (!reg) { await apaga([caminhoFoto(t, 'retrato', versao), caminhoFoto(t, 'avatar', versao)]); return manda(res, 404, { erro: 'Esse lead não foi encontrado. Pode ter sido apagado.' }); }
      if (!valeu) await apaga([caminhoFoto(t, 'retrato', versao), caminhoFoto(t, 'avatar', versao)]);
      else if (anterior) await apaga([caminhoFoto(t, 'retrato', anterior), caminhoFoto(t, 'avatar', anterior)]);
      await poeNoIndice(reg);
      // duas fotos ao mesmo tempo: vale a de versão maior, e quem mandou a outra fica sabendo
      return manda(res, 200, Object.assign(await pacote(reg), valeu ? {} : { aviso: 'Outra foto deste atleta foi salva no mesmo instante e ficou valendo. Confira a foto.' }));
    }

    if (req.method === 'DELETE' && String((req.query && req.query.v) || '') === 'mapa') {
      await apagaPasta(PASTA_MAPA + t + '/');
      const reg = await mudaRegistro(t, r => {
        if (!r.mapa) return false;
        r.mapa = null;
        r.atualizadoEm = new Date().toISOString(); r.atualizadoPor = quem(eu);
        anota(r, eu, 'apagou o mapa de calor');
      });
      if (reg) await poeNoIndice(reg);
      return manda(res, 200, reg ? await pacote(reg) : { ok: true });
    }

    if (req.method === 'DELETE') {
      await apagaPasta('fotos/' + t + '/');
      const reg = await mudaRegistro(t, r => {
        if (!r.foto) return false;
        r.foto = null;
        r.atualizadoEm = new Date().toISOString(); r.atualizadoPor = quem(eu);
        anota(r, eu, 'apagou a foto');
        r.estado = estadoGuardado(r, V);
      });
      if (reg) await poeNoIndice(reg);
      return manda(res, 200, reg ? await pacote(reg) : { ok: true });
    }
    manda(res, 405, { erro: 'Pedido não aceito.' });
  } catch (e) {
    registraErro('foto', e);
    if (req.method === 'GET' || req.method === 'HEAD') { if (!res.headersSent) nao(res); else res.destroy(); return; }
    manda(res, 500, { erro: 'O painel não conseguiu salvar a foto agora. Tente de novo em instantes.' });
  }
}
