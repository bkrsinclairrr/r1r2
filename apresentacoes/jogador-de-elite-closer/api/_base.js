// Base do Painel do Closer: sessão (cookie assinado), senhas (scrypt), usuários, o código do link, a ficha do atleta,
// o registro e o índice por closer, a presença do apresentador, o CORS e a Leitura do atleta (vídeo e lances).
// Arquivos com _ na frente não viram rota no Vercel. Tudo que lê ou grava passa por _armazenamento.js.
import crypto from 'node:crypto';
import '../regras.js';
import { le, grava, mudaJson, apagaPasta, apaga, lista, conflito, DRIVER } from './_armazenamento.js';
import { DECK_URL, decksDoCatalogo, entradaDaEtapa, origensDosDecks } from './_decks.js';

export const R = globalThis.R2_REGRAS;
export { DRIVER, conflito };
const COOKIE = 'je_closer';
const DURACAO = 12 * 60 * 60; // a sessão dura 12 horas
const USUARIOS = 'usuarios.json';
export const PASTA = 'atletas/';
export const T_OK = /^[a-z2-7]{26}$/; // o código do link: 16 bytes aleatórios em base32 minúsculo (128 bits)
// O SDR monta o R1, o closer monta o R2, o admin vê tudo e cuida das duas etapas. Cada lead (atletas/<t>.json) é de uma etapa:
// reg.etapa 'r1' ou 'r2' (sem o campo, é R2, como eram todos antes do R1 entrar no painel).
export const PAPEIS = { sdr: 'SDR (R1)', closer: 'Closer (R2)', admin: 'Admin' };
export const ETAPAS_DO_PAPEL = { sdr: ['r1'], closer: ['r2'], admin: ['r1', 'r2'] };
export const podeEtapa = (papel, etapa) => (ETAPAS_DO_PAPEL[papel] || []).includes(etapa);
export const etapaDe = reg => ((reg && reg.etapa) === 'r1' ? 'r1' : 'r2');
export { DECK_URL };
const DIA = 864e5;
// D6: o link vale até 7 dias depois da call (sem data, 7 dias depois de criado), renovável até 60 dias a partir de hoje;
// foto e vídeo, 90 dias; o registro é apagado 180 dias depois que o link vence
// r1SemData: o R1 vem antes da R2 e muitas vezes ainda sem dia marcado: o link dele vale 30 dias a partir de quando foi criado
export const VALIDADE = { linkDepoisDaCall: 7, r1SemData: 30, linkMax: 60, fotoDias: 90, videoDias: 90, registroDepoisDoLink: 180 };
export const FOTO = { retrato: { largura: 960, altura: 1280, maxBytes: 600 * 1024 }, avatar: { largura: 400, altura: 400, maxBytes: 150 * 1024 } };

/* ---------------- respostas, corpo e log ---------------- */
export function manda(res, status, corpo) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(corpo));
}
// o corpo JSON: a Vercel já entrega req.body pronto; fora dela (ou texto puro, como o sendBeacon manda), lê aqui
export async function corpo(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  let texto = typeof req.body === 'string' ? req.body : Buffer.isBuffer(req.body) ? req.body.toString('utf8') : null;
  if (texto == null) {
    texto = await new Promise((ok, erro) => {
      const partes = [];
      req.on('data', p => partes.push(Buffer.from(p)));
      req.on('end', () => ok(Buffer.concat(partes).toString('utf8')));
      req.on('error', erro);
    });
  }
  try { const j = JSON.parse(texto || '{}'); return j && typeof j === 'object' ? j : {}; } catch { return {}; }
}
export const espera = ms => new Promise(r => setTimeout(r, ms));
export const ehJson = req => String(req.headers['content-type'] || '').toLowerCase().includes('application/json');
// texto que vem do painel ou de um JSON: sem HTML, sem quebra, aparado e com tamanho máximo
export function textoLimpo(v, max) {
  return String(v == null ? '' : v).replace(/<[^>]*>/g, ' ').replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}
// log sem dado do atleta: só a rota, a mensagem e o código truncado (nunca nome, foto, cidade ou conteúdo)
export function registraErro(rota, e) {
  const msg = String((e && e.message) || e || '').replace(/[a-z2-7]{26}/g, c => c.slice(0, 6) + '…').slice(0, 200);
  console.error(rota + ': ' + msg);
}

/* ---------------- senhas ---------------- */
export function hashSenha(senha) {
  const sal = crypto.randomBytes(16);
  const h = crypto.scryptSync(String(senha), sal, 64);
  return 'scrypt$' + sal.toString('hex') + '$' + h.toString('hex');
}
const FALSO = hashSenha(crypto.randomBytes(12).toString('hex')); // pra login inexistente gastar o mesmo tempo
export function confereSenha(senha, guardado) {
  const [alg, sal, h] = String(guardado || FALSO).split('$');
  if (alg !== 'scrypt' || !sal || !h) return false;
  const calc = crypto.scryptSync(String(senha || ''), Buffer.from(sal, 'hex'), 64);
  const ref = Buffer.from(h, 'hex');
  return ref.length === calc.length && crypto.timingSafeEqual(ref, calc);
}
export const normLogin = l => String(l || '').trim().toLowerCase();
export const loginValido = l => /^[a-z0-9._-]{3,32}$/.test(l) && !/\.\./.test(l);

/* ---------------- sessão: cookie HttpOnly assinado com PAINEL_SEGREDO ---------------- */
function assina(texto) {
  const s = process.env.PAINEL_SEGREDO || '';
  if (s.length < 32) throw new Error('PAINEL_SEGREDO não configurado');
  return crypto.createHmac('sha256', s).update(texto).digest('base64url');
}
export function abreSessao(res, u) {
  const dados = Buffer.from(JSON.stringify({ l: u.login, e: Math.floor(Date.now() / 1000) + DURACAO })).toString('base64url');
  res.setHeader('Set-Cookie', `${COOKIE}=${dados}.${assina(dados)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${DURACAO}`);
}
export function fechaSessao(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}
function loginDaSessao(req) {
  const m = String(req.headers.cookie || '').match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)'));
  if (!m) return null;
  const [dados, ass] = m[1].split('.');
  if (!dados || !ass) return null;
  const a = Buffer.from(ass), b = Buffer.from(assina(dados));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const d = JSON.parse(Buffer.from(dados, 'base64url').toString('utf8'));
    return d.e && d.e > Date.now() / 1000 ? normLogin(d.l) : null;
  } catch { return null; }
}
// confere a sessão e se o usuário ainda existe (quem foi removido perde o acesso na hora).
// Escrita só com corpo JSON: formulário de outro site não consegue mandar isso (proteção contra CSRF).
export async function exige(req, res, { admin = false } = {}) {
  const login = loginDaSessao(req);
  const u = login ? await achaUsuario(login) : null;
  if (!u) { fechaSessao(res); manda(res, 401, { erro: 'Sua sessão acabou. Entre de novo.' }); return null; }
  if (admin && u.papel !== 'admin') { manda(res, 403, { erro: 'Só o admin pode fazer isso.' }); return null; }
  if (req.method !== 'GET' && req.method !== 'HEAD' && !ehJson(req)) { manda(res, 415, { erro: 'Pedido em formato inválido.' }); return null; }
  return { login: u.login, nome: u.nome, papel: u.papel };
}
// a sessão, se houver (rotas públicas que mostram mais pra quem está logado); nunca responde nada
export async function sessaoOpcional(req) {
  try {
    const login = loginDaSessao(req);
    const u = login ? await achaUsuario(login) : null;
    return u ? { login: u.login, nome: u.nome, papel: u.papel } : null;
  } catch { return null; }
}

/* ---------------- usuários: usuarios.json, mais o admin das variáveis de ambiente ---------------- */
// O admin de PAINEL_ADMIN_LOGIN/PAINEL_ADMIN_HASH existe sempre (ninguém fica trancado fora). Se ele trocar a senha
// pelo painel, entra um registro com o mesmo login no usuarios.json, que passa a valer.
function adminDoAmbiente() {
  const login = normLogin(process.env.PAINEL_ADMIN_LOGIN || 'admin');
  const hash = process.env.PAINEL_ADMIN_HASH;
  return hash ? { login, nome: 'Admin', papel: 'admin', hash, ambiente: true } : null;
}
export async function leUsuarios() {
  const r = await le(USUARIOS);
  const lista = (r && r.dados.usuarios) || [];
  const adm = adminDoAmbiente();
  return adm && !lista.some(u => u.login === adm.login) ? lista.concat([adm]) : lista;
}
export async function achaUsuario(login) {
  login = normLogin(login);
  if (!loginValido(login)) return null;
  return (await leUsuarios()).find(u => u.login === login) || null;
}
export const mudaUsuarios = muda => mudaJson(USUARIOS, () => ({ usuarios: [] }), d => muda(d.usuarios));
export const semHash = u => ({ login: u.login, nome: u.nome, papel: u.papel, criadoEm: u.criadoEm || null, ambiente: !!u.ambiente });

/* ---------------- o código do link ---------------- */
const B32 = 'abcdefghijklmnopqrstuvwxyz234567';
// 16 bytes de crypto.randomBytes em base32 minúsculo: 26 caracteres, nada legível (sem nome, sem data)
export function novoCodigo() {
  let bits = 0, val = 0, s = '';
  for (const x of crypto.randomBytes(16)) {
    val = ((val << 8) | x) & 0xfff; bits += 8;
    while (bits >= 5) { s += B32[(val >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) s += B32[(val << (5 - bits)) & 31];
  return s;
}
// o link do lead: o do deck de entrada da etapa (o R1 num, o R2 noutro); o deck leva o lead pra variação escolhida
export const linkDo = (t, etapa) => ((entradaDaEtapa(etapa === 'r1' ? 'r1' : 'r2') || { origem: DECK_URL }).origem) + '/?a=' + t;

/* ---------------- a ficha: só o que está aqui entra; o que a casa promete não é campo ---------------- */
// Fora do que o closer edita (promessa travada): preço, garantia e o prazo dela, faixa de contrato e números da rede.
// O deck usa os padrões dele pra esses (DADOS no deck.js).
const CAMPOS = {
  ...Object.fromEntries(R.CAMPOS_DOSSIE.map(c => [c.chave, c.numero ? { numero: c.numero } : { max: c.max }])),
  nome: { max: 80 }, apelido: { max: 24 }, idade: { numero: [6, 40] }, posicao: { max: 40 }, cidade: { max: 60 },
  pe: { opcoes: R.PES }, altura: { numero: [100, 230] },
  origem: { opcoes: R.ORIGENS }, caracteristicas: { max: 160 }, experiencia: { max: 160 }, sonho: { max: 120 },
  r2data: { data: true }, r2hm: { hora: true },
  plano: { opcoes: R.PLANOS, antigos: R.PLANOS_ANTIGOS }, vagas: { numero: [1, 10] }, proximaTurma: { max: 40 },
  gerente: { max: 60 }, prazoContato: { opcoes: R.PRAZOS.contato }, prazoZyron: { opcoes: R.PRAZOS.zyron },
  // a versão do R2 (R.VERSOES), como o nome aparece na tela (R.NOMES_TELA), a foto do lead fora da tela (semFoto: "sim") e os
  // slides opcionais tirados da sequência (ids separados por vírgula, dos opcionais da versão escolhida). Só o que sai do
  // padrão fica gravado.
  versao: { dinamica: true }, nomeTela: { opcoes: R.NOMES_TELA.map(n => n.id).filter(Boolean) }, semFoto: { opcoes: ['sim'] }, pular: { lista: true }
};
export const CHAVES_FICHA = Object.keys(CAMPOS);
// o R1 usa só o que o deck dele mostra (a ficha do atleta e o dia e a hora da R2) e o que vai pro CRM; plano, vídeo e prazos são do R2
const CHAVES_R1 = ['nome', 'idade', 'posicao', 'cidade', 'origem', 'caracteristicas', 'experiencia', 'r2data', 'r2hm', 'versao', 'semFoto'];
export const chavesDaEtapa = etapa => (etapa === 'r1' ? CHAVES_R1 : CHAVES_FICHA);
// texto aparado e sem HTML, opção fora da lista e número fora da faixa ficam de fora. versoes: as variações como valem agora
// (leVersoes); sem ela, a reserva do código. etapa: r1 ou r2 (sem ela, r2): só valem os campos e as variações dela
export function limpaFicha(entrada, versoes, etapa) {
  const et = etapa === 'r1' ? 'r1' : 'r2';
  const f = {};
  const e = entrada && typeof entrada === 'object' ? entrada : {};
  const todas = Array.isArray(versoes) && versoes.length ? versoes : R.RESERVA_TODAS;
  const ids = todas.filter(v => (v.etapa || 'r2') === et).map(v => v.id);
  const chaves = chavesDaEtapa(et);
  for (const [k, regra] of Object.entries(CAMPOS)) {
    if (!chaves.includes(k) || e[k] == null) continue;
    const v = textoLimpo(e[k], 300);
    if (!v) continue;
    if (regra.dinamica) { if (ids.includes(v)) f[k] = v; continue; } // a variação: uma das que existem agora nesta etapa
    if (regra.opcoes) { const o = (regra.antigos && regra.antigos[v]) || v; if (regra.opcoes.includes(o)) f[k] = o; continue; }
    if (regra.numero) {
      const n = parseInt(v, 10);
      if (/^\d+$/.test(v) && n >= regra.numero[0] && n <= regra.numero[1]) f[k] = String(n);
      continue;
    }
    if (regra.data) { if (R.diaDaCall(v) && Math.abs(Date.parse(v + 'T12:00:00Z') - Date.now()) < 400 * DIA) f[k] = v; continue; }
    if (regra.hora) { if (R.horaDaCall(v)) f[k] = v; continue; }
    if (regra.lista) { f[k] = v; continue; } // conferida abaixo, contra a versão escolhida
    f[k] = v.slice(0, regra.max);
  }
  // vagas e próxima turma são só do Legacy (a turma de 10); nos outros planos não existem
  if (f.plano !== R.LEGACY) { delete f.vagas; delete f.proximaTurma; }
  // a variação padrão da etapa não fica gravada
  if (f.versao === R.padraoDe(et)) delete f.versao;
  // o que o deck da variação escolhida não faz não fica na ficha: a escolha de nome na tela, a foto fora da tela e os slides tirados
  // da sequência só valem nos decks que seguem (recursos). Trocar de variação derruba o que a nova não tem
  const ver = R.versaoPor(f.versao, todas, et), rec = ver.recursos || { nomeTela: true, foto: true, pular: true };
  if (f.plano && !R.planosDaVersao(ver).includes(f.plano)) delete f.plano;
  if (!rec.nomeTela) delete f.nomeTela;
  if (!rec.foto) delete f.semFoto;
  // os slides tirados da sequência são só os opcionais da variação escolhida (sem repetir, em ordem fixa)
  if (f.pular) {
    const dela = rec.pular ? ver.opcionais.map(o => o.id) : [];
    const pedidos = f.pular.split(',').map(s => s.trim());
    const ficam = dela.filter(id => pedidos.includes(id));
    if (ficam.length) f.pular = ficam.join(','); else delete f.pular;
  }
  return f;
}
/* ---------------- as variações como valem agora: o que os decks publicam, mais o que o admin fez ---------------- */
// Cada deck do catálogo (regras.js, DECKS) publica o variacoes.json dele: as páginas que existem, cada uma com nome, quando usar, slides
// opcionais e hash. O painel sincroniza com todos sozinho (_sincroniza.js) e guarda o que leu em versoes.json, em decks:
// { <id do deck>: { em, okEm, falha, origem, gerado, paginas, saude, sumiram } } (o campo deck, no singular, é o formato de antes do R1:
// vale como o do R2 novo e migra pra decks na primeira gravação). Página nova num deck aparece aqui sem ninguém cadastrar nada. Sem
// nenhuma leitura boa de um deck, vale a reserva dele (regras.js, RESERVA). Cada página vira uma variação: o id é o prefixo do deck mais
// o da página (o R2 novo não tem prefixo), e ela leva a etapa (r1 ou r2), o deck, a origem e o que o deck sabe fazer (recursos).
// Por cima disso, o que o admin fez no painel: { ajustes: { <id da variação>: { validacao, nota, lead: { nome, foto }, arquivada, por, em } },
// criadas: [ { id (o slug), etapa, nome, base (o id de uma variação do deck), quando, validacao, nota, lead, arquivada, criadoPor, criadoEm,
// por, em } ] }. A classificação, a nota e o que a variação mostra do lead valem sobre o que o deck diz. Uma variação criada usa a página
// de uma do deck (a base) e muda o resto.
const VERSOES_ARQ = 'versoes.json';
const VERSOES_TTL = 20 * 1000; // a /api/r2 roda a cada abertura do deck: não lê o arquivo toda vez (a escrita limpa o cache daqui)
const CAMINHO_PAGINA = /^\/(variacoes\/[a-z0-9]+(-[a-z0-9]+)*\/)?$/;
let versoesCache = null;
const paginaOk = p => !!(p && R.SLUG_OK.test(String(p.id || '')) && CAMINHO_PAGINA.test(String(p.caminho || '')) && p.nome && Array.isArray(p.opcionais));
// as páginas de um deck que valem agora: a última leitura boa do variacoes.json (confere de novo o que guardou) ou, sem ela, a reserva do
// deck. As que saíram do deck ficam na lista, marcadas (um lead pode estar usando)
function paginasDoDeck(deck, estado) {
  const salvas = estado && Array.isArray(estado.paginas) ? estado.paginas.filter(paginaOk) : [];
  const lista = salvas.some(p => p.id === R.VERSAO_PADRAO) ? salvas.slice() : (R.RESERVA[deck.id] || []).map(v => Object.assign({}, v));
  const ids = new Set(lista.map(p => p.id));
  Object.values((estado && estado.sumiram) || {}).forEach(x => { if (x && paginaOk(x.pagina) && !ids.has(x.pagina.id)) lista.push(Object.assign({}, x.pagina, { sumiu: true })); });
  return lista;
}
// o que o painel guardou de um deck (o formato de antes do R1 tinha um só, em deck: o do R2 novo)
export const estadoDoDeck = (cfg, deck) => (cfg && cfg.decks && cfg.decks[deck.id]) || (deck.id === 'r2' && cfg && cfg.deck) || null;
export function montaVersoes(cfg) {
  const aj = (cfg && cfg.ajustes) || {};
  const validacaoDe = (v, padrao) => (R.VALIDACOES.some(n => n.id === v) ? v : (R.VALIDACOES.some(n => n.id === padrao) ? padrao : R.VALIDACAO_PADRAO));
  // o que a variação mostra do lead: o deck que não segue a escolha de nome sempre mostra o nome; o que não mostra foto, nunca a foto
  const leadDe = (l, base, rec) => {
    const nome = rec.nomeTela ? (l && l.nome !== undefined ? !!l.nome : base.nome !== false) : true;
    const foto = rec.foto && nome && (l && l.foto !== undefined ? !!l.foto : base.foto !== false); // a foto só aparece com o nome
    return { nome, foto };
  };
  const saudeDe = (est, id) => {
    const x = est.saude && est.saude[id];
    return x ? { ok: x.ok !== false, motivo: String(x.motivo || ''), desatualizado: !!x.desatualizado, falhas: Number(x.falhas) || 0, em: String(x.em || '') } : null;
  };
  // as páginas de cada deck, com o que o admin ajustou
  const paginas = [];
  for (const d of decksDoCatalogo()) {
    const est = estadoDoDeck(cfg, d) || {};
    const reserva = R.RESERVA[d.id] || [];
    for (const p of paginasDoDeck(d, est)) {
      const id = d.prefixo + p.id, a = aj[id] || {};
      const rec = R.recursosDaPagina(d, p);
      paginas.push(Object.assign({}, p, {
        id, idLocal: p.id, deck: d.id, etapa: d.etapa, origem: d.origem, recursos: rec,
        validacao: validacaoDe(a.validacao, p.validacao), nota: String(a.nota || ''), lead: leadDe(a.lead, p.lead || {}, rec),
        arquivada: id !== R.padraoDe(d.etapa) && !!a.arquivada, base: null, criada: false, criadoPor: null, criadoEm: null,
        ajustadoPor: a.por || null, ajustadoEm: a.em || null, saude: saudeDe(est, p.id), sumiu: !!p.sumiu,
        // nova: apareceu no deck há menos de uma semana (as páginas de reserva, as de sempre, não contam)
        nova: !reserva.some(v => v.id === p.id) && !!p.visto && Date.now() - Date.parse(p.visto) < 7 * DIA
      }));
    }
  }
  // as variações que o admin criou no painel: usam a página de uma do deck (a base) e mudam o resto
  const ids = new Set(paginas.map(p => p.id));
  const criadas = (cfg && Array.isArray(cfg.criadas) ? cfg.criadas : []).filter(c => c && R.SLUG_OK.test(String(c.id || '')) && !ids.has(c.id)).map(c => {
    const base = paginas.find(v => v.id === c.base) || paginas.find(v => v.id === R.padraoDe(c.etapa === 'r1' ? 'r1' : 'r2')) || paginas[0];
    return {
      id: c.id, idLocal: c.id, deck: base.deck, etapa: base.etapa, origem: base.origem, recursos: base.recursos,
      nome: String(c.nome || c.id), caminho: base.caminho, resumo: base.resumo, quando: String(c.quando || ''), opcionais: base.opcionais,
      validacao: validacaoDe(c.validacao, R.VALIDACAO_PADRAO), nota: String(c.nota || ''), lead: leadDe(c.lead, {}, base.recursos),
      arquivada: !!c.arquivada, base: base.id, criada: true, criadoPor: c.criadoPor || null, criadoEm: c.criadoEm || null,
      ajustadoPor: c.por || null, ajustadoEm: c.em || null, saude: base.saude, sumiu: base.sumiu, nova: false
    };
  });
  return paginas.concat(criadas);
}
// a lista como vale agora e o que o painel sabe da sincronização com cada deck (decks, por id; deck é o do R2 novo, pra quem lê um só).
// fresco: lê de novo, sem olhar o cache
export async function lePainelVersoes(fresco) {
  if (!fresco && versoesCache && Date.now() - versoesCache.em < VERSOES_TTL) return versoesCache;
  const r = await le(VERSOES_ARQ);
  const cfg = r && r.dados;
  const decks = {};
  for (const d of decksDoCatalogo()) decks[d.id] = estadoDoDeck(cfg, d);
  versoesCache = { em: Date.now(), lista: montaVersoes(cfg), decks, deck: decks.r2 || null };
  return versoesCache;
}
export async function leVersoes(fresco) { return (await lePainelVersoes(fresco)).lista; }
// as versões, lidas de novo se o id pedido não está no cache (uma variação que o admin criou há instantes, noutra instância)
export async function leVersoesCom(id) {
  const lista = await leVersoes();
  return !id || lista.some(v => v.id === id) ? lista : leVersoes(true);
}
export const mudaVersoes = async muda => {
  try {
    return await mudaJson(VERSOES_ARQ, () => ({ v: 1, ajustes: {}, criadas: [], decks: {} }), d => {
      d.ajustes = d.ajustes && typeof d.ajustes === 'object' ? d.ajustes : {};
      d.criadas = Array.isArray(d.criadas) ? d.criadas : [];
      d.decks = d.decks && typeof d.decks === 'object' ? d.decks : {};
      // o formato de antes do R1 guardava um deck só (deck): passa a ser o do R2 novo, em decks
      if (d.deck) { if (!d.decks.r2) d.decks.r2 = d.deck; delete d.deck; }
      return muda(d);
    });
  } finally { versoesCache = null; }
};
// o slug de uma variação nova: o nome sem acento e com hífen, mais quatro letras sorteadas (tecnica-sem-foto-k7m2). Nada legível
// na barra de endereço da família: o slug fica só no painel
export function novoSlug(nome, ocupados) {
  const base = R.semAcento(nome).replace(/[^a-z0-9 ]+/g, ' ').trim().replace(/\s+/g, '-').slice(0, 28).replace(/-+$/, '') || 'variacao';
  for (let i = 0; i < 30; i++) {
    let suf = '';
    for (const x of crypto.randomBytes(4)) suf += B32[x % 32];
    if (!ocupados.includes(base + '-' + suf)) return base + '-' + suf;
  }
  throw new Error('não consegui gerar um slug livre');
}
// a versão do registro, entre as que valem agora (id que não existe mais cai na padrão)
export const versaoDoReg = (reg, lista) => R.versaoPor(((reg && reg.ficha) || {}).versao, lista, etapaDe(reg));
// o que a versão deixa aparecer do lead: sem nome, a tela fica sem nome e sem foto; sem foto, só a foto fica de fora. É o que
// vale de verdade, mesmo que o closer tenha marcado outra coisa antes de o admin mudar a versão
export function fichaEfetiva(f, ver) {
  const out = Object.assign({}, f);
  if (out.plano) out.plano = R.PLANOS_ANTIGOS[out.plano] || out.plano;
  const lead = (ver && ver.lead) || { nome: true, foto: true };
  if (!lead.nome) out.nomeTela = 'sem';
  if (!lead.foto || out.nomeTela === 'sem') out.semFoto = 'sim';
  return out;
}
// o que a família vê (o deck lê pela /api/r2): o dia e a hora já no formato da tela. O R1 só leva a ficha do atleta e o que vai pro CRM
// (o deck dele não usa apelido, plano nem escolha do formato do nome); o R2, tudo
const PUBLICOS_R2 = ['nome', 'apelido', 'idade', 'posicao', 'cidade', 'pe', 'altura', 'origem', 'caracteristicas', 'experiencia', 'sonho', 'plano', 'gerente', 'prazoContato', 'prazoZyron', 'nomeTela', 'semFoto', 'pular'];
const PUBLICOS_R1 = ['semFoto', 'nome', 'idade', 'posicao', 'cidade', 'origem', 'caracteristicas', 'experiencia'];
export function fichaPublica(f0, ver) {
  const f = fichaEfetiva(f0, ver), out = {};
  const r1 = !!(ver && ver.etapa === 'r1');
  (r1 ? PUBLICOS_R1 : PUBLICOS_R2).forEach(k => { if (f && f[k]) out[k] = f[k]; });
  if (!r1 && R.temDossie(ver)) R.CAMPOS_DOSSIE.forEach(c => { if (f && f[c.chave]) out[c.chave] = f[c.chave]; });
  if (f && f.r2data) out.r2dia = R.diaDaCall(f.r2data);
  if (f && f.r2hm) out.r2hora = R.horaDaCall(f.r2hm);
  if (!r1 && f && f.plano === R.LEGACY) { if (f.vagas) out.vagas = f.vagas; if (f.proximaTurma) out.proximaTurma = f.proximaTurma; }
  return out;
}

/* ---------------- o registro do atleta: atletas/<t>.json ---------------- */
export const caminho = t => PASTA + t + '.json';
export const caminhoChamada = t => 'chamadas/' + t + '.json';
export const leRegistro = async t => (T_OK.test(String(t || '')) ? le(caminho(t)) : null);
// lê, muda e grava o registro com versão (ifMatch); sem registro, devolve null. muda(reg) devolve false pra não gravar.
// Cada gravação soma 1 em rev: o índice só aceita o resumo de uma revisão igual ou mais nova (ver poeNoIndice)
export const mudaRegistro = (t, muda) => mudaJson(caminho(t), null, async r => {
  const volta = await muda(r);
  if (volta !== false) r.rev = (r.rev || 0) + 1;
  return volta;
});
export const quem = eu => ({ login: eu.login, nome: eu.nome });
export const podeMexer = (eu, reg) => !!(eu && reg && (eu.papel === 'admin' || reg.donoLogin === eu.login));
// as últimas 30 ações: quando, quem (login) e o quê; nunca o conteúdo da ficha
export function anota(reg, eu, o) {
  reg.historico = (Array.isArray(reg.historico) ? reg.historico : []).concat([{ em: new Date().toISOString(), por: eu ? eu.login : 'sistema', o }]).slice(-30);
}
// validade do link a partir da call: fim do dia da call (São Paulo, sem horário de verão desde 2019) mais 7 dias
export function venceDoLink(ficha, base, etapa) {
  const ini = ficha && ficha.r2data ? Date.parse(ficha.r2data + 'T23:59:59-03:00') : Date.parse(base || new Date().toISOString());
  const dias = etapa === 'r1' && !(ficha && ficha.r2data) ? VALIDADE.r1SemData : VALIDADE.linkDepoisDaCall;
  const t = Math.min(ini + dias * DIA, Date.now() + VALIDADE.linkMax * DIA);
  return new Date(t).toISOString();
}
export const maisTarde = (a, b) => (Date.parse(a || 0) >= Date.parse(b || 0) ? a : b);
// a validade que quem monta escolheu (o dia e a hora em que o link expira): daqui a pelo menos 1 minuto e no máximo linkMax dias.
// Com ela, o link deixa de seguir a call (venceManual): mudar o dia da call não muda mais a validade
export function validadePedida(v) {
  const t = Date.parse(String(v == null ? '' : v));
  if (!Number.isFinite(t)) return { erro: 'Escolha o dia e a hora em que o link expira.' };
  if (t < Date.now() + 60e3) return { erro: 'Escolha um horário daqui pra frente (pelo menos 1 minuto). Pra tirar do ar agora, use Revogar.' };
  if (t > Date.now() + VALIDADE.linkMax * DIA + 60e3) return { erro: 'O link vale no máximo ' + VALIDADE.linkMax + ' dias a partir de hoje.' };
  return { venceEm: new Date(t).toISOString() };
}
export const fotoValida = f => !!(f && f.versao && f.autorizadoEm && f.venceEm && Date.parse(f.venceEm) > Date.now());
export const fotoVencida = f => !!(f && f.versao && f.venceEm && Date.parse(f.venceEm) <= Date.now());
export const linkVencido = reg => !!(reg && reg.venceEm && Date.parse(reg.venceEm) <= Date.now());
// o que falta pra apresentar: os cinco primeiros dão a etiqueta "pronto"; a prévia é o sexto (só nos decks que abrem no quadro de prévia
// do painel: nos outros ela abre em outra aba e o item vem cumprido). versoes: as versões como valem agora (leVersoes): o que a versão do
// R2 mostra do lead decide se a foto e o nome conferido são pedidos
export function checklist(reg, versoes) {
  const ver = versaoDoReg(reg, versoes), c = reg.conferido || {}, f = fichaEfetiva(reg.ficha || {}, ver);
  const semPrevia = !!(ver && ver.recursos && ver.recursos.previa === false);
  const semNome = f.nomeTela === 'sem'; // a tela não mostra nome nem foto: não há o que autorizar nem o que conferir
  // o R1 não tem foto, plano nem prévia aqui (o deck dele não usa foto e abre em outra aba): o que falta é o nome conferido, a ficha do
  // slide 02 (posição, idade e cidade) e o dia e a hora da R2
  if (etapaDe(reg) === 'r1') return { foto: true, nome: semNome || !!(f.nome && c.nome === f.nome), posicao: !!(f.posicao && f.idade && f.cidade), plano: true, call: !!(f.r2data && f.r2hm), previa: true };
  const semFoto = semNome || f.semFoto === 'sim'; // a tela não mostra a foto: não há o que autorizar
  return {
    foto: semFoto || fotoValida(reg.foto),
    nome: semNome || !!(f.nome && c.nome === f.nome),
    posicao: !!R.posicaoNoCampo(f.posicao),
    plano: !!f.plano,
    call: !!(f.r2data && f.r2hm),
    previa: semPrevia || !!(c.previa && c.previa === reg.fichaEm && c.previaFoto === ((reg.foto && reg.foto.versao) || 0))
  };
}
const prontoPraApresentar = (reg, versoes) => { const c = checklist(reg, versoes); return c.foto && c.nome && c.posicao && c.plano && c.call; };
// o estado guardado: revogado e encerrado ficam até alguém mudar; o resto segue o checklist
export function estadoGuardado(reg, versoes) {
  if (reg.estado === 'revogado' || reg.estado === 'encerrado') return reg.estado;
  return prontoPraApresentar(reg, versoes) ? 'pronto' : 'rascunho';
}
// o R2 pediu uma variação que não existe (ou foi apagada do cadastro): a ficha limpa a derrubaria sem avisar e o R2 ficaria na
// Principal. A rota recusa em vez disso. A Principal (padrão, que não fica gravada) e o campo vazio são válidos
export const versaoInvalida = (entrada, ficha, etapa) => {
  const v = String((entrada && entrada.versao) || '').trim();
  return !!v && v !== R.padraoDe(etapa === 'r1' ? 'r1' : 'r2') && !ficha.versao;
};
// o pacote que as rotas devolvem ao painel: o registro, o link (sempre /?a=<código>), a etiqueta e o checklist
export async function pacote(reg) {
  const versoes = await leVersoesCom((reg.ficha || {}).versao);
  return { registro: reg, link: linkDo(reg.t, etapaDe(reg)), etapa: etapaDe(reg), estado: estadoDe(reg), checklist: checklist(reg, versoes) };
}
// o estado que a tela mostra: vencido vira expirado (revogado vale mais)
export function estadoDe(reg) {
  if (reg.estado === 'revogado') return 'revogado';
  if (linkVencido(reg)) return 'expirado';
  return reg.estado || 'rascunho';
}

/* ---------------- índice por closer: indices/<login>.json ---------------- */
const caminhoIndice = login => 'indices/' + login + '.json';
export function resumo(reg) {
  const f = reg.ficha || {};
  return {
    t: reg.t, etapa: etapaDe(reg), nome: f.nome || '', apelido: f.apelido || '', posicao: f.posicao || '', plano: f.plano || '', versao: f.versao || '',
    r2data: f.r2data || '', r2hm: f.r2hm || '', estado: reg.estado || 'rascunho', venceEm: reg.venceEm || '',
    venceManual: !!reg.venceManual, apagarAoVencer: !!reg.apagarAoVencer, encerradoEm: reg.encerradoEm || '',
    foto: fotoValida(reg.foto) ? reg.foto.versao : 0, video: videoValido(reg.video),
    donoLogin: reg.donoLogin, donoNome: (reg.dono && reg.dono.nome) || (reg.criadoPor && reg.criadoPor.nome) || '',
    criadoEm: reg.criadoEm, atualizadoEm: reg.atualizadoEm, rev: reg.rev || 0
  };
}
export const mudaIndice = (login, muda) => mudaJson(caminhoIndice(login), () => ({ itens: {} }), d => { d.itens = d.itens || {}; return muda(d.itens); });
// o resumo do registro no índice do dono. Várias rotas gravando o mesmo atleta ao mesmo tempo terminam em ordem qualquer:
// o índice fica com a revisão mais nova, nunca volta pra uma mais velha
export const poeNoIndice = reg => mudaIndice(reg.donoLogin, itens => {
  const novo = resumo(reg), velho = itens[reg.t];
  if (velho && (velho.rev || 0) > novo.rev) return false;
  itens[reg.t] = novo;
});
export async function leIndice(login) {
  const r = await le(caminhoIndice(login));
  if (r) return r.dados.itens || {};
  // sem índice (primeira vez ou arquivo perdido): remonta lendo os registros desse closer e grava, pra não repetir
  const itens = {};
  for (const b of await lista(PASTA)) {
    const a = await le(b.caminho);
    if (a && a.dados && a.dados.t && a.dados.donoLogin === login) itens[a.dados.t] = resumo(a.dados);
  }
  await mudaIndice(login, atual => Object.assign(atual, itens));
  return itens;
}
export async function leTodosIndices() {
  const itens = {};
  for (const b of await lista('indices/')) {
    const a = await le(b.caminho);
    if (a && a.dados && a.dados.itens) Object.assign(itens, a.dados.itens);
  }
  return itens;
}
// quem está com o apresentador aberto agora: o arquivo de presença foi gravado há menos de 90 segundos
export const PRESENCA_MS = 90 * 1000;
export async function emCallAgora() {
  const agora = Date.now(), out = new Set();
  for (const b of await lista('chamadas/')) {
    if (agora - Date.parse(b.enviadoEm) < PRESENCA_MS) out.add(b.caminho.slice('chamadas/'.length, -'.json'.length));
  }
  return out;
}
// o espaço que cada lead ocupa na loja (a seção Gerados): o registro, as fotos e o vídeo, somados pelo código. Três listagens no total,
// nunca uma por lead. { <t>: { ficha, foto, video, total } } em bytes
export async function espacoPorLead() {
  const out = {};
  const conta = (t, k, n) => {
    if (!T_OK.test(String(t || ''))) return;
    const o = out[t] || (out[t] = { ficha: 0, foto: 0, video: 0, total: 0 });
    o[k] += Number(n) || 0; o.total += Number(n) || 0;
  };
  const [regs, fotos, videos] = await Promise.all([lista(PASTA), lista('fotos/'), lista(PASTA_VIDEO)]);
  regs.forEach(b => conta(b.caminho.slice(PASTA.length).replace(/\.json$/, ''), 'ficha', b.tamanho));
  fotos.forEach(b => conta(b.caminho.split('/')[1], 'foto', b.tamanho));
  videos.forEach(b => conta(b.caminho.split('/')[1], 'video', b.tamanho));
  return out;
}
// apaga tudo de um atleta: fotos, vídeo, presença, registro e o item do índice do dono
export async function apagaTudo(t, donoLogin) {
  await apagaArquivos(t);
  if (donoLogin) await mudaIndice(donoLogin, itens => { delete itens[t]; });
}
// só os arquivos do atleta (fotos, vídeo, presença e registro); quem chama tira do índice (a exclusão em lote tira vários de uma vez)
export async function apagaArquivos(t) {
  await apagaPasta('fotos/' + t + '/');
  await apagaPasta(PASTA_VIDEO + t + '/');
  await apaga([caminhoChamada(t), caminho(t)]);
}
// tira códigos de todos os índices que ainda têm eles (item que sobrou no índice de alguém depois que o registro sumiu)
export async function tiraDosIndices(ts) {
  const alvo = new Set(ts);
  for (const b of await lista('indices/')) {
    const a = await le(b.caminho);
    const itens = (a && a.dados && a.dados.itens) || {};
    if (!Object.keys(itens).some(t => alvo.has(t))) continue;
    const login = b.caminho.slice('indices/'.length).replace(/\.json$/, '');
    if (loginValido(login)) await mudaIndice(login, it => { let mudou = false; alvo.forEach(t => { if (t in it) { delete it[t]; mudou = true; } }); return mudou ? undefined : false; });
  }
}

/* ---------------- CORS das rotas públicas: só os endereços do deck ---------------- */
function origemOk(o) {
  const lista = String(process.env.DECK_ORIGINS || '').split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean).concat(origensDosDecks());
  if (lista.includes(o)) return true;
  return process.env.VERCEL_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(o);
}
export function cors(req, res, metodos) {
  res.setHeader('Vary', 'Origin');
  const o = String(req.headers.origin || '');
  if (o && origemOk(o)) {
    res.setHeader('Access-Control-Allow-Origin', o);
    res.setHeader('Access-Control-Allow-Methods', metodos);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '600');
  }
}

/* ---------------- a foto: JPEG conferido byte a byte ---------------- */
// base64 puro (sem prefixo data:), conferido antes de decodificar
export function deBase64(s) {
  const t = String(s || '');
  if (!t || t.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(t)) return null;
  return Buffer.from(t, 'base64');
}
// o começo FF D8 FF, o fim FF D9, nenhum EXIF (APP1) e as dimensões lidas do marcador SOF, sem biblioteca
export function jpegInfo(buf) {
  if (!buf || buf.length < 64 || buf[0] !== 0xFF || buf[1] !== 0xD8 || buf[2] !== 0xFF) return null;
  if (buf[buf.length - 2] !== 0xFF || buf[buf.length - 1] !== 0xD9) return null;
  let i = 2, exif = false;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xFF) return null;
    let m = buf[i + 1];
    while (m === 0xFF && i + 2 < buf.length) { i++; m = buf[i + 1]; }
    if (m === 0xD8 || m === 0xD9 || m === 0xDA) return null; // começo de novo, fim ou imagem antes do tamanho: arquivo estranho
    if ((m >= 0xD0 && m <= 0xD7) || m === 0x01) { i += 2; continue; }
    const len = buf.readUInt16BE(i + 2);
    if (len < 2 || i + 2 + len > buf.length) return null;
    if (m === 0xE1) exif = true;
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) {
      if (len < 8) return null;
      return { altura: buf.readUInt16BE(i + 5), largura: buf.readUInt16BE(i + 7), exif };
    }
    i += 2 + len;
  }
  return null;
}
export const caminhoFoto = (t, v, n) => 'fotos/' + t + '/' + v + '-' + n + '.jpg';

/* ---------------- leitura do atleta: o vídeo dele e os lances marcados (o slide IA na Prática) ---------------- */
// O relatório é feito de dados guardados aqui (marcados no painel ou importados de um JSON do Zyron). Nada é estimado.
export const TIPOS_LANCE = ['Passe', 'Condução', 'Drible', 'Finalização', 'Desarme', 'Marcação', 'Posicionamento', 'Cobertura', 'Jogo sem a bola', 'Bola parada', 'Defesa'];
export const ORIGENS_LEITURA = ['zyron', 'equipe'];
export const CRITERIOS = ['todos', 'selecao'];
export const PASTA_VIDEO = 'videos/';
export const VIDEO_MAX_BYTES = 250 * 1024 * 1024; // até 250 MB
export const VIDEO_MAX_S = 300; // até 5 minutos
export const POSTER_MAX_BYTES = 2 * 1024 * 1024;
export const TIPOS_VIDEO = { 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' };
const LANCES_MAX = 200, TEXTO_MAX = 70, LISTA_MAX = 3;
// o caminho do arquivo é sempre videos/<t>/<nome aleatório>.<ext>; o navegador escolhe o nome, o servidor confere
export const caminhoVideoOk = (t, p, poster) => T_OK.test(String(t || '')) && typeof p === 'string' && p.startsWith(PASTA_VIDEO + t + '/') &&
  new RegExp('^' + PASTA_VIDEO + t + '/[a-z0-9]{12,40}\\.' + (poster ? 'jpg' : '(mp4|webm|mov)') + '$').test(p);

// confere a leitura inteira; devolve a leitura limpa e a lista do que ficou de fora (pra importação mostrar)
export function limpaLeitura(entrada, duracaoS) {
  const e = entrada && typeof entrada === 'object' ? entrada : {};
  const erros = [];
  const dur = Number(duracaoS) > 0 ? Number(duracaoS) : VIDEO_MAX_S;
  const origem = ORIGENS_LEITURA.includes(e.origem) ? e.origem : '';
  if (e.origem != null && e.origem !== '' && !origem) erros.push('Fonte inválida: use "zyron" ou "equipe".');
  const criterio = CRITERIOS.includes(e.criterio) ? e.criterio : 'selecao';
  const lances = [];
  (Array.isArray(e.lances) ? e.lances : []).forEach((l, i) => {
    const n = i + 1;
    if (lances.length >= LANCES_MAX) { erros.push('Lance ' + n + ': passou de ' + LANCES_MAX + ' lances.'); return; }
    if (!l || typeof l !== 'object') { erros.push('Lance ' + n + ': formato inválido.'); return; }
    const t = Number(l.t);
    if (!Number.isFinite(t) || t < 0 || t > dur) { erros.push('Lance ' + n + ': o minuto (' + textoLimpo(l.t, 12) + ') está fora do vídeo.'); return; }
    const tipo = TIPOS_LANCE.find(x => x.toLowerCase() === String(l.tipo || '').trim().toLowerCase());
    if (!tipo) { erros.push('Lance ' + n + ': tipo "' + textoLimpo(l.tipo, 30) + '" fora da lista.'); return; }
    const leitura = l.leitura === 'bom' || l.leitura === 'ajustar' ? l.leitura : '';
    if (!leitura) { erros.push('Lance ' + n + ': a leitura tem que ser "bom" ou "ajustar".'); return; }
    lances.push({ t: Math.round(t * 10) / 10, tipo, leitura, nota: textoLimpo(l.nota, TEXTO_MAX) });
  });
  lances.sort((a, b) => a.t - b.t);
  const listaDe = (v, nome) => {
    const arr = (Array.isArray(v) ? v : []).map(x => textoLimpo(x, TEXTO_MAX)).filter(Boolean);
    if (arr.length > LISTA_MAX) erros.push(nome + ': só entram ' + LISTA_MAX + '.');
    return arr.slice(0, LISTA_MAX);
  };
  return { leitura: { origem, criterio, lances, fortes: listaDe(e.fortes, 'Pontos fortes'), prioridades: listaDe(e.prioridades, 'Prioridades') }, erros };
}
// os dados do vídeo que o navegador manda depois do upload (o servidor completa quem autorizou e a validade)
export function limpaVideo(t, entrada) {
  const e = entrada && typeof entrada === 'object' ? entrada : {};
  const tipo = TIPOS_VIDEO[e.tipo] ? e.tipo : '';
  const bytes = Math.round(Number(e.bytes));
  const duracaoS = Math.round(Number(e.duracaoS) * 10) / 10;
  if (!caminhoVideoOk(t, e.arquivo, false) || !tipo) return { erro: 'Vídeo inválido: envie mp4, webm ou mov.' };
  if (!(bytes > 0 && bytes <= VIDEO_MAX_BYTES)) return { erro: 'O vídeo passa de 250 MB.' };
  if (!(duracaoS > 0 && duracaoS <= VIDEO_MAX_S + 1)) return { erro: 'O vídeo passa de 5 minutos.' };
  const poster = e.poster && caminhoVideoOk(t, e.poster, true) ? e.poster : '';
  return { video: { arquivo: e.arquivo, tipo, bytes, duracaoS, poster } };
}
// o vídeo só existe pra fora com autorização registrada, dentro da validade
export const videoValido = v => !!(v && v.arquivo && v.autorizadoEm && v.venceEm && Date.parse(v.venceEm) > Date.now());
export const videoVencido = v => !!(v && v.arquivo && v.venceEm && Date.parse(v.venceEm) <= Date.now());
export const venceVideo = () => new Date(Date.now() + VALIDADE.videoDias * DIA).toISOString();
export const venceFoto = () => new Date(Date.now() + VALIDADE.fotoDias * DIA).toISOString();
export { grava, le, apaga, apagaPasta, lista, DIA };
