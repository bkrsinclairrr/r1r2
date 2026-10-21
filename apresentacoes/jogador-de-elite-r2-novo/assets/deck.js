/* Jogador de Elite · Deck R2 (Gestor de Carreiras)
   Modo família (a tela compartilhada) e modo apresentador (?presenter), sincronizados.
   Trinta e cinco slides, na ordem da Bíblia das Vendas (processo-r2): conexão (capa com o inimigo comum, por que você),
   a dor (03, o olhômetro), o plano (04, com o tripé), o bloco do Zyron (05 a 08: e se, Zyron, vídeo, cinco verbos), a plataforma (09, tela ilustrativa),
   quem olha por ele (11), o seu lugar em campo (12, o campo e o cartão do atleta), olhômetro contra Zyron (15), o que ninguém mais tem, IA na Prática (17, a leitura ao
   vivo), o dossiê do atleta (18: a foto e os dados, o vídeo analisado pela IA, o mapa de calor, as oportunidades e o plano de carreira; só
   com dado do painel) e o inimigo em comum (19: o avaliador que não olha todo mundo, e o que as peneiras custam), o depoimento de uma mãe (20, áudio), nem tudo é talento, AGN, a rede (23: AGN, clubes e o David), valor real (revelado item a item), até lá a gente investe,
   o filtro e a escada do sim, contrato, a vaga (o começo, fora do Legacy), os planos e o número (33, os três com o investimento de cada um, o da
   ficha destacado e o Silêncio), a garantia com os três valores na tela (34) e boas-vindas (35, com a miniatura do campo). Três planos (window.PLANOS, roteiro.js): o da
   ficha muda o 33 e o 35, e turma e vaga só aparecem no Legacy. Sem link de pagamento no deck. Elementos com data-step
   aparecem um avanço por vez. A leitura do atleta (17): com o vídeo dele no painel (?a=<id>), o 17 mostra o vídeo, o nome e o
   relatório que o Gestor deixou pronto (relatorio-leitura.js); sem vídeo, painel fora do ar ou vídeo que não carrega, o 17 de
   sempre, com a leitura ao vivo no Meet, sem erro na tela da família (o apresentador é que fica sabendo). */
(function () {
  'use strict';
  /* o Painel do Closer (projeto jogador-de-elite-closer): o único lugar de onde o deck lê o atleta do link (?a=<código>) */
  const PAINEL = 'https://jogador-de-elite-closer.vercel.app';
  const PAINEL_ORIGEM = new URL(PAINEL).origin;
  // a prévia do painel (o link ainda não foi gerado): a chave &p= vai em todo pedido ao painel (foto-atleta.js)
  const comChave = u => (window.FotoAtleta && window.FotoAtleta.comChave ? window.FotoAtleta.comChave(u) : u);
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  // o código do link: 26 letras (a-z e 2-7), sem nome nenhum. Outro formato não vale: o deck age como sem link
  // (a ficha deste navegador, o modo de teste de sempre)
  const T_OK = /^[a-z2-7]{26}$/;
  const AID = (() => { const a = (new URLSearchParams(location.search).get('a') || '').trim(); return T_OK.test(a) ? a : ''; })();
  // dentro do quadro da prévia do painel: sem HUD, sem apresentador, sem canal, sem presença e sem guardar nada no navegador
  const EMBUTIDO = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  const isPresenter = !EMBUTIDO && /[?&]presenter\b/.test(location.search);
  const slides = qsa('#stage > .slide');
  const N = slides.length;
  const ROT = window.ROTEIRO || [];
  // a ficha, o canal de sincronia e a janela do apresentador levam o código do link: dois atletas abertos no mesmo navegador
  // (duas abas, a call seguida com a aba da anterior aberta) são duas bolhas, uma não vê nem mexe na outra
  const FKEY = AID ? 'je-r2-ficha:' + AID : 'je-r2-ficha';
  const CANAL = 'je-r2:' + (AID || '_');
  const JANELA = 'je-r2-presenter-' + (AID || '_');
  // a foto do atleta em tom navy suave ('navy', o padrão) ou em cor ('cor'): troca aqui, num lugar só (D10)
  const FOTO_TOM = 'navy';
  if (FOTO_TOM === 'cor') document.documentElement.classList.add('foto-cor');
  const SILENCE_SLIDE = slides.findIndex(s => s.id === 'planos');
  const VAGA = SILENCE_SLIDE; // slide do número: os planos, com o da ficha destacado; Silêncio, "fale o número e pare" e o fechamento
  const TURMA = slides.findIndex(s => s.querySelector('#turma')); // a vaga (turma de 10, só no Legacy; nos outros, o começo)
  const MATRIZ = slides.findIndex(s => s.id === 'planos'); // os planos: os três com o investimento de cada um, e o da ficha destacado no último avanço

  /* <dados> da operação: vazios contam como vazios e nunca viram texto na tela */
  const DADOS = { gerente: '', analista: '', prazoContato: '', prazoZyron: '', faixaContrato: 'R$ 20 a 30 mil+', linkAgn: '', duracao: 50 };
  const ORIGENS = ['', 'Zyron', 'Formulário do Instagram', 'Frio, sem vídeo', 'Outro'];

  // no quadro da prévia, a ficha fica só na memória (nada do atleta é guardado no navegador do painel)
  const memoria = {};
  const store = {
    get(k, d) {
      if (EMBUTIDO) return k in memoria ? JSON.parse(memoria[k]) : d;
      try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
    },
    set(k, v) {
      if (EMBUTIDO) { memoria[k] = JSON.stringify(v); return; }
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ }
    },
    del(k) {
      if (EMBUTIDO) { delete memoria[k]; return; }
      try { localStorage.removeItem(k); } catch (e) { /* armazenamento indisponível */ }
    }
  };
  /* higiene: nome, cidade e o resto da ficha de um menor não ficam no navegador mais de 12 horas sem uso. Ao abrir, sai
     toda ficha (de link ou a sem link) com _vistoEm de mais de 12 horas, e ficam no máximo 5 fichas de link (a deste link
     nunca sai). Ficha antiga sem _vistoEm ganha a data de agora e passa a contar a partir daqui */
  const DOZE_HORAS = 12 * 3600 * 1000;
  function limpaFichasVelhas() {
    if (EMBUTIDO) return;
    try {
      const agora = Date.now(), links = [];
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (!k || k === FKEY || (k !== 'je-r2-ficha' && k.indexOf('je-r2-ficha:') !== 0)) continue;
        let f = null;
        try { f = JSON.parse(localStorage.getItem(k)); } catch (e) { f = null; }
        if (!f || typeof f !== 'object') { localStorage.removeItem(k); continue; }
        if (!Number(f._vistoEm)) { f._vistoEm = agora; localStorage.setItem(k, JSON.stringify(f)); }
        if (agora - Number(f._vistoEm) > DOZE_HORAS) localStorage.removeItem(k);
        else if (k !== 'je-r2-ficha') links.push([k, Number(f._vistoEm)]);
      }
      links.sort((a, b) => b[1] - a[1]).slice(AID ? 4 : 5).forEach(([k]) => localStorage.removeItem(k));
    } catch (e) { /* armazenamento indisponível */ }
  }
  let ficha = store.get(FKEY, {});
  // guarda: a chave já leva o código, mas uma ficha de outro link nunca vai pra tela deste
  if (AID && ficha._a !== AID) ficha = { _a: AID };
  // com a ficha deste link já guardada, o deck abre na hora e atualiza em silêncio; sem ela, espera o painel (até 2 s)
  const tinhaFicha = !!(AID && ficha.nome);
  ficha._vistoEm = Date.now();
  store.set(FKEY, ficha);
  limpaFichasVelhas();
  /* A versão do R2 do atleta é escolhida no painel e o link é um só (/?a=<código>): a /api/r2 manda onde fica a página da versão
     (versao: { caminho, origem }: a página e o deck dela), e o deck vai pra ela se não estiver nela (mesmo código, mesmo slide). A
     variação pode ser de outro deck (o R2 anterior ou o R2 B): este é o deck de entrada do R2 e leva o lead pra lá. Só na entrada, e na
     prévia do painel quando ele pede pra atualizar: no meio da call, uma troca no painel não derruba a apresentação. O destino da
     última resposta fica guardado na ficha (_v), pra a volta ir direto pra versão certa, sem passar pela errada. Só valem os caminhos
     do cadastro de versões (a raiz ou variacoes/<slug>/) e as origens desta lista (os decks do painel), nunca uma que vier da rede. */
  const CAMINHO_OK = /^\/(variacoes\/[a-z0-9-]+\/)?$/;
  const DECKS_OK = ['https://jogador-de-elite-r2-novo.vercel.app', 'https://jogador-de-elite-r2.vercel.app', 'https://jogador-de-elite-r2-b.vercel.app', 'https://jogador-de-elite-r1.vercel.app'];
  // { origem, caminho } da variação que o painel mandou (sem origem, é este deck), ou null se não vale
  const destinoDe = j => {
    const v = j && j.versao;
    if (!v || typeof v.caminho !== 'string' || !CAMINHO_OK.test(v.caminho)) return null;
    const o = typeof v.origem === 'string' && v.origem ? v.origem.replace(/\/+$/, '') : location.origin;
    return o === location.origin || DECKS_OK.indexOf(o) >= 0 ? { origem: o, caminho: v.caminho } : null;
  };
  // o destino guardado na ficha: o formato de antes (só o caminho, deste deck) ou { o, c }
  const destinoSalvo = () => {
    const v = ficha._v;
    if (typeof v === 'string') return destinoDe({ versao: { caminho: v } });
    return v && typeof v === 'object' ? destinoDe({ versao: { caminho: v.c, origem: v.o } }) : null;
  };
  function iraVersao(d) {
    if (!d || location.protocol === 'file:') return false;
    if (d.origem === location.origin && location.pathname.replace(/index\.html$/, '') === d.caminho) return false;
    location.replace(d.origem + d.caminho + location.search + location.hash);
    return true;
  }
  if (AID && !EMBUTIDO && iraVersao(destinoSalvo())) return;
  let cur = 0, curStep = null;
  // o vídeo, o quadro ou a foto do atleta não carregou: o 17 volta pra leitura ao vivo, a capa pro desenho e a foto pra
  // inicial do nome, sem erro na tela
  let videoFalhou = false, posterFalhou = false, fotoFalhou = false, avatarFalhou = false;
  // o estado do link no painel: carregando, ok, expirado, revogado, nao-encontrado ou sem-painel (fora do ar)
  let linkEstado = AID ? 'carregando' : '';

  /* ---------------- dados derivados ---------------- */
  const filled = v => v === true || (typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && v.trim() !== '');
  const str = v => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v));
  /* os três planos (window.PLANOS, roteiro.js), do degrau de baixo pro de cima. O da ficha é o que a tela mostra;
     vazio ou nome antigo (de antes dos três planos) vira o Legacy, e a ficha salva no navegador continua funcionando */
  const PLANOS = (window.PLANOS || []).filter(p => p && p.id);
  const PLANO_PADRAO = PLANOS.find(p => p.id === 'legacy') || PLANOS[PLANOS.length - 1] || null;
  // o nome de hoje ou um nome de antes do mesmo plano (antigos: o Scouting PRO virou Assessoria PRO)
  const planoPorNome = nome => PLANOS.find(p => p.nome === str(nome) || (p.antigos || []).includes(str(nome))) || null;
  const planoDe = nome => planoPorNome(nome) || PLANO_PADRAO;
  const comArtigo = p => (p.artigo || 'o') + ' ' + (p.curto || p.nome); // a Assessoria PRO, o Legacy
  const doPlano = p => (p.artigo === 'a' ? 'da ' : 'do ') + p.nome; // Tudo da Assessoria PRO, Tudo do Scouting
  // na ficha salva (no navegador ou no painel), o nome de antes vira o de hoje, e o select do apresentador acha o plano
  const nomeDeHoje = f => ['plano', 'planoFechado'].forEach(k => { const p = f[k] && planoPorNome(f[k]); if (p) f[k] = p.nome; });
  nomeDeHoje(ficha);
  const cap = k => k[0].toUpperCase() + k.slice(1);
  /* a posição da ficha (texto livre do painel) no campo do 12: caixa baixa, sem acento, e a primeira linha de
     window.CAMPO_POSICOES (roteiro.js) que casar. ZAG e VOL têm dois marcadores: com "esquerdo" ou "esquerda" no texto,
     o da esquerda; sem lado, o da direita. Não casou: vazio, e o campo fica sem destaque (nunca chuta posição) */
  const semAcento = s => str(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[-_/.,;:()]+/g, ' ').replace(/\s+/g, ' ').trim();
  /* Os nomes do atleta, a partir do nome completo. primeiro: como se fala (o primeiro nome; os dois primeiros, se for
     composto e comum, como João Pedro). tela: nome e sobrenome, o que aparece nos títulos, nas frases e no carimbo do
     dossiê. Por padrão é o último sobrenome (com Júnior, Filho ou Neto junto); com regra 'primeiro' (a escolha "Nome e
     primeiro sobrenome" do R2), o primeiro sobrenome (a primeira palavra depois do nome que não é "da", "de" ou "do", com o
     Júnior ou Filho que vier logo depois). Nas duas, se o nome tiver até três palavras e nenhuma for "da", "de" ou "do",
     ele todo. Até 24 letras; passou, perde o Júnior, depois o composto e por fim o que sobrar.
     O mesmo código está no deck.js e no regras.js do painel: o testes/teste-igualdade.mjs confere os dois. */
  const NOME_PARTICULAS = ['da', 'de', 'do', 'das', 'dos', 'e'];
  const NOME_SUFIXOS = ['junior', 'jr', 'filho', 'neto', 'sobrinho', 'segundo', 'terceiro'];
  const NOME_SEGUNDOS = ['pedro', 'henrique', 'vitor', 'victor', 'gabriel', 'felipe', 'eduardo', 'gustavo', 'miguel', 'guilherme', 'augusto', 'antonio', 'carlos', 'paulo',
    'luiz', 'luis', 'fernando', 'rafael', 'matheus', 'mateus', 'lucas', 'davi', 'daniel', 'emanuel', 'francisco', 'jose', 'marcos', 'rodrigo', 'thiago', 'tiago', 'vinicius',
    'arthur', 'artur', 'bernardo', 'enzo', 'heitor', 'joao', 'leonardo', 'murilo', 'nicolas', 'otavio', 'samuel', 'ricardo', 'roberto', 'andre', 'bruno', 'caio', 'diego',
    'igor', 'kaua', 'leandro', 'renan', 'wesley', 'yago', 'yuri', 'lucca', 'maria', 'ana', 'clara', 'beatriz', 'eduarda', 'julia', 'luiza', 'vitoria', 'fernanda', 'helena', 'laura'];
  function nomesDoAtleta(completo, regra) {
    const t = str(completo).replace(/\s+/g, ' ').split(' ').filter(Boolean);
    if (!t.length) return { primeiro: '', tela: '' };
    const composto = t.length > 2 && NOME_SEGUNDOS.indexOf(semAcento(t[1])) >= 0 ? 2 : 1;
    const primeiro = t.slice(0, composto).join(' ');
    if (t.length === 1) return { primeiro: primeiro, tela: primeiro };
    const resto = t.slice(composto);
    let sobrenome, sufixo = '';
    if (regra === 'primeiro') {
      const i = resto.findIndex(x => NOME_PARTICULAS.indexOf(semAcento(x)) < 0); // a primeira palavra que não é "da", "de", "do"...
      sobrenome = resto[i < 0 ? 0 : i];
      const seguinte = i >= 0 ? resto[i + 1] : '';
      sufixo = seguinte && NOME_SUFIXOS.indexOf(semAcento(seguinte)) >= 0 ? seguinte : '';
    } else {
      const ultimo = resto[resto.length - 1];
      const comSufixo = resto.length > 1 && NOME_SUFIXOS.indexOf(semAcento(ultimo)) >= 0;
      sobrenome = comSufixo ? resto[resto.length - 2] : ultimo;
      sufixo = comSufixo ? ultimo : '';
    }
    const todos = t.length <= 3 && !t.some(x => NOME_PARTICULAS.indexOf(semAcento(x)) >= 0) ? t.join(' ') : '';
    const lista = [todos, primeiro + ' ' + sobrenome + (sufixo ? ' ' + sufixo : ''), primeiro + ' ' + sobrenome, t[0] + ' ' + sobrenome].filter(Boolean);
    return { primeiro: primeiro, tela: lista.find(x => x.length <= 24) || t[0] };
  }
  function posicaoNoCampo(txt) {
    const t = semAcento(txt);
    if (!t) return '';
    const tem = termo => (' ' + t + ' ').indexOf(' ' + termo + ' ') >= 0;
    const regra = (window.CAMPO_POSICOES || []).find(([termos, , exato]) => termos.some(x => (exato ? t === x : tem(x))));
    if (!regra) return '';
    const id = regra[1];
    if (id === 'ZAG' || id === 'VOL') return id + (tem('esquerdo') || tem('esquerda') ? '-e' : '-d');
    return id;
  }
  // pé e altura, só pro cartão do 12: o que não dá pra ler com certeza não aparece
  function peTxt(v) {
    const t = semAcento(v);
    if (!t) return '';
    if (/\b(destro|destra|direito|direita)\b/.test(t)) return 'Destro';
    if (/\b(canhoto|canhota|esquerdo|esquerda)\b/.test(t)) return 'Canhoto';
    if (/\b(ambidestro|ambidestra|ambos|os dois)\b/.test(t)) return 'Ambidestro';
    const s = str(v);
    return s.length > 20 ? '' : s[0].toUpperCase() + s.slice(1);
  }
  // altura em centímetros (178) ou em metros (1,78); fora de 100 a 230 cm, não aparece
  function alturaTxt(v) {
    const n = parseFloat(str(v).replace(',', '.').replace(/[^\d.]/g, ''));
    if (!Number.isFinite(n)) return '';
    const cm = n < 3 ? Math.round(n * 100) : Math.round(n);
    return cm >= 100 && cm <= 230 ? (cm / 100).toFixed(2).replace('.', ',') + ' m' : '';
  }
  function derived() {
    const d = {};
    Object.keys(ficha).forEach(k => { d[k] = typeof ficha[k] === 'boolean' ? ficha[k] : str(ficha[k]); });
    // os prazos são de lista fixa (window.PRAZOS, promessa travada): texto fora da lista não vai pra tela
    const PRZ = window.PRAZOS || {};
    if (Array.isArray(PRZ.contato) && d.prazoContato && PRZ.contato.indexOf(d.prazoContato) < 0) d.prazoContato = '';
    if (Array.isArray(PRZ.zyron) && d.prazoZyron && PRZ.zyron.indexOf(d.prazoZyron) < 0) d.prazoZyron = '';
    ['gerente', 'analista', 'prazoContato', 'prazoZyron', 'faixaContrato', 'linkAgn'].forEach(k => { if (!filled(d[k])) d[k] = DADOS[k]; });
    // o nome: o da tela (o apelido; sem apelido, nome e sobrenome do nome completo), o falado (o apelido, ou o primeiro
    // nome: a fala do apresentador e a mensagem de confirmação), o completo (montado para) e o do dossiê (o mesmo nome e
    // sobrenome em caixa alta: carimbo da capa, contrato, anúncio e cartão do plano)
    // A escolha do painel "Nome na tela" (ficha.nomeTela): vazio, nome e último sobrenome; 'primeiro-sobrenome', nome e primeiro
    // sobrenome; 'so-nome', só o primeiro nome nos títulos e nas frases; 'sem', a apresentação geral, sem nome e sem foto na
    // tela (nem o vídeo dele). A fala do apresentador (nomeCurto) e o nome completo do roteiro seguem com o nome dele.
    // 'semFoto' (sim): só a foto fica de fora; o nome continua e o quadro dela mostra a inicial do nome.
    const modoNome = str(ficha.nomeTela), semNome = modoNome === 'sem', semFoto = str(ficha.semFoto) === 'sim';
    const nomeCompleto = str(ficha.nome).replace(/\s+/g, ' ');
    const nomes = nomesDoAtleta(nomeCompleto, modoNome === 'primeiro-sobrenome' ? 'primeiro' : '');
    d.nomeCurto = str(ficha.apelido) || nomes.primeiro;
    d.nome = semNome ? '' : str(ficha.apelido) || (modoNome === 'so-nome' ? nomes.primeiro : nomes.tela);
    d.nomeUp = d.nome.toUpperCase();
    d.nomeLongo = d.nome.length > 12 ? '1' : ''; // 13 letras ou mais: o titulo do 27 quebra em duas linhas e a lista precisa de menos folga
    d.nomeMuitoLongo = d.nome.length > 21 ? '1' : ''; // 22 letras ou mais: o titulo do 4 (110 px) quebra em duas linhas
    // o rótulo do nome no campo (12 e 35) é pequeno: até 12 letras leva o nome da tela; passou, o nome falado, ou só o primeiro nome
    d.nomeCampo = d.nome.length <= 12 ? d.nome : (d.nomeCurto.length <= 12 ? d.nomeCurto : (d.nomeCurto.split(' ')[0] || d.nome));
    d.nomeCampoUp = d.nomeCampo.toUpperCase();
    d.nomeCompleto = nomeCompleto;
    d.nomeAssinatura = semNome ? '' : nomes.tela; // a assinatura: nome e sobrenome do nome completo (o apelido não entra em documento)
    d.nomeDossie = d.nomeAssinatura.toUpperCase();
    d.fotoIni = window.FotoAtleta && window.FotoAtleta.iniciais ? window.FotoAtleta.iniciais(d.nome) : (d.nome[0] || '').toUpperCase(); // as iniciais do nome da tela (CS), no quadro sem foto
    d.montadoPara = nomeCompleto && !semNome ? 'Montado para ' + nomeCompleto + '.' : '';
    d.callTxt = str(ficha.r2dia) ? 'Call de ' + str(ficha.r2dia) + (str(ficha.r2hora) ? ', ' + str(ficha.r2hora) : '') + '.' : '';
    // a foto do painel (ficha._foto, do carregaPainel): o retrato 3:4 e o avatar quadrado, sempre pelo código do link e
    // com a versão no endereço. Sem link (teste com a ficha gravada à mão), de _foto.src e _foto.avatarSrc.
    // Foto que não carrega: cai na inicial do nome, nunca no ícone de imagem quebrada
    const ft = !semNome && !semFoto && ficha._foto && typeof ficha._foto === 'object' && ficha._foto.ok ? ficha._foto : null;
    const fv = ft ? parseInt(ft.versao, 10) || 0 : 0;
    d.fotoUrl = ft ? (AID ? (fv ? comChave(PAINEL + '/api/foto?t=' + AID + '&v=retrato&n=' + fv) : '') : str(ft.src)) : '';
    d.avatarUrl = ft ? (AID ? (fv ? comChave(PAINEL + '/api/foto?t=' + AID + '&v=avatar&n=' + fv) : '') : str(ft.avatarSrc || ft.src)) : '';
    d.fotoOk = d.fotoUrl && !fotoFalhou ? '1' : '';
    d.avatarOk = d.avatarUrl && !avatarFalhou ? '1' : '';
    d.fotoTxt = d.fotoOk ? 'sim' + (AID ? ', do painel, com a autorização do responsável' : ' (teste)') : '';
    // a garantia (window.GARANTIA, roteiro.js): o texto da tela sai de um lugar só
    const G = window.GARANTIA || {};
    d.garantiaTitulo = str(G.titulo); d.garantiaDestaque = str(G.destaque); d.garantiaCondicao = str(G.condicao);
    // a camada a mais (opção B do D1, ex.: 7 dias incondicionais) só existe se o contrato disser; vazia, some
    d.garantiaCamada1 = Array.isArray(G.camadas) && G.camadas.length ? str(G.camadas[0]) : '';
    // o tempo (slide 27, o que ele leva): o que a casa controla, nos prazos da lista fixa
    const comeca = s => (s ? s[0].toUpperCase() + s.slice(1) : '');
    d.tempoContato = (comeca(d.prazoContato) || 'Confirmado') + ', ' + (planoDe(ficha.plano) && planoDe(ficha.plano).id === 'legacy' ? 'o gerente de carreira' : 'a equipe') + ' entra em contato.';
    d.tempoZyron = (comeca(d.prazoZyron) || 'Imediatamente') + ', o Zyron começa.';
    const idade = parseInt(str(ficha.idade), 10);
    d.idade = Number.isFinite(idade) ? String(idade) : '';
    d.idadeMais1 = Number.isFinite(idade) ? String(idade + 1) : '';
    d.posicaoMin = str(ficha.posicao).toLowerCase();
    d.posicaoUp = str(ficha.posicao).toUpperCase();
    d.posId = posicaoNoCampo(ficha.posicao); // o marcador do atleta no campo (12 e 35): GOL, LD, ZAG-d, VOL-e...
    d.posCampo = d.posId ? str(ficha.posicao) + ' (' + d.posId.split('-')[0] + ')' : '';
    d.peTxt = peTxt(ficha.pe);
    d.alturaTxt = alturaTxt(ficha.altura);
    // o código do dossiê: os 8 caracteres finais do id do painel (?a=<id>), em caixa alta. É só o registro dele, nunca vaga ou fila
    const aid = AID || str(ficha._a);
    d.dossieCod = ''; // o número do dossiê saiu da tela (pedido do dono, 18/10/2026): nada na tela mostra o código do link
    d.dossieNo = '';
    // a leitura do atleta (17): o vídeo e o relatório que o painel guardou (ficha._video e ficha._leitura, do carregaPainel).
    // Com o link do painel, o vídeo sai de /api/video; sem ele (teste com a ficha gravada à mão), de _video.src
    const vid = !semNome && ficha._video && typeof ficha._video === 'object' ? ficha._video : null;
    const vidOk = !!(vid && vid.ok);
    d.videoSrc = vidOk ? (AID ? comChave(PAINEL + '/api/video?t=' + AID) : str(vid.src)) : '';
    d.posterUrl = vidOk && vid.temPoster ? (AID ? comChave(PAINEL + '/api/video?t=' + AID + '&poster=1') : str(vid.posterSrc)) : '';
    d.videoOk = d.videoSrc && !videoFalhou ? '1' : '';
    d.posterOk = d.posterUrl && !posterFalhou ? '1' : '';
    const RL = window.RelatorioLeitura;
    const lei = RL && d.videoOk ? RL.derivados(ficha._leitura, vid.duracaoS, d.trabalhar) : null;
    d.leituraOk = lei && lei.n && lei.leitura.origem ? '1' : '';
    d.leituraFonte = d.leituraOk ? lei.leitura.origem : '';
    d.leituraResumo = d.videoOk ? 'vídeo: sim' + (d.leituraOk ? ', ' + lei.n + ' lances, fonte ' + (lei.leitura.origem === 'zyron' ? 'Zyron' : 'equipe') : ', sem leitura') : '';
    const origem = str(ficha.origem);
    d.origemZyron = origem === 'Zyron' ? '1' : '';
    d.origemForm = origem.indexOf('Formulário') === 0 ? '1' : '';
    d.origemOutro = !d.origemZyron && !d.origemForm ? '1' : '';
    const v = parseInt(str(ficha.vagas), 10);
    d.vagasN = Number.isFinite(v) && v >= 1 && v <= 10 ? v : 0;
    d.vagas = d.vagasN ? String(d.vagasN) : '';
    d.vagasFrase2 = d.vagasN === 1 ? 'resta 1 vaga.' : d.vagasN ? 'restam ' + d.vagasN + ' vagas.' : '';
    // plano da ficha: planoId (scouting, pro ou legacy), os textos dele e as premissas (planoTurma, planoGarantia,
    // planoContrato, planoAncora, planoRetorno), que ligam e desligam partes da tela com data-if
    const pl = planoDe(ficha.plano) || {};
    d.planoId = str(pl.id);
    d.planoNome = str(pl.nome);
    ['descritor', 'promessa', 'ritmo', 'preco', 'parcela', 'rotulo', 'relacao', 'bemVindo', 'rotina', 'proximo'].forEach(k => { d['plano' + cap(k)] = str(pl[k]); });
    ['turma', 'garantia', 'contrato', 'ancora', 'retorno'].forEach(k => { d['plano' + cap(k)] = pl[k] ? '1' : ''; });
    d.planoSelo = str(pl.selo || pl.descritor); // o papel no cartão do 35, sem conta de preço
    d.planoExtras = Array.isArray(pl.extras) && pl.extras.length ? '1' : '';
    // cada plano, pra matriz do 33 e o tripé do 04: data-bind="pro.descritor", "legacy.ritmo", "scouting.passo"...
    PLANOS.forEach(p => ['nome', 'curto', 'descritor', 'ritmo', 'preco', 'parcela', 'passo'].forEach(k => { d[p.id + '.' + k] = str(p[k]); }));
    // o rótulo da parte de cada plano no 33: o primeiro degrau tem tudo, vitalício; os outros, tudo do degrau de baixo, mais
    PLANOS.forEach((p, i) => { d[p.id + '.mais'] = i ? 'Tudo ' + doPlano(PLANOS[i - 1]) + ', mais' : 'Vitalício, você tem'; });
    if (window.FotoAtleta) Object.assign(d, window.FotoAtleta.derivados(ficha, d, AID, PAINEL));
    // o dossiê do atleta (18) e o inimigo em comum (19): dossie-atleta.js
    if (window.DossieAtleta) Object.assign(d, window.DossieAtleta.derivados(ficha, d, AID, PAINEL));
    // "Tenho o vídeo do jogador" ligado e sem lances marcados: o vídeo analisado vai pro dossiê (18) e o 17 fica a ponte, a leitura ao
    // vivo de sempre (nunca o mesmo vídeo duas vezes seguidas, um deles com "Leitura em preparação")
    if (d.dsV && !d.leituraOk) { d.videoOk = ''; d.videoSrc = ''; d.leituraResumo = 'vídeo analisado: no dossiê (18), com o 17 de ponte'; }
    return d;
  }

  /* condição: a|b (qualquer), a&b (todos), !a (negação), k=v (igualdade) */
  function cond(expr, d) {
    return expr.split('|').some(any => any.split('&').every(t => {
      t = t.trim(); let neg = false;
      if (t[0] === '!') { neg = true; t = t.slice(1); }
      let r;
      if (t.indexOf('=') > 0) { const [k, val] = t.split('='); r = filled(d[k]) && String(d[k]) === val; }
      else r = filled(d[t]);
      return neg ? !r : r;
    }));
  }

  const posLabel = i => (i + 1) + ' / ' + N;
  /* revelação item a item: elementos com data-step="n" aparecem um avanço de cada vez */
  // só conta o que está ligado na tela (data-if, data-ifnot): o 17 só tem avanços quando a leitura veio do painel
  const ligado = e => !e.closest('[data-if]:not(.on), [data-ifnot].off');
  const stepsIn = i => (i >= 0 && i < N ? qsa('[data-step]', slides[i]).filter(ligado).reduce((m, e) => Math.max(m, parseInt(e.dataset.step, 10) || 0), 0) : 0);
  /* os slides que o painel tirou da sequência deste atleta (ficha.pular: ids do data-opcional do <section>, dos opcionais da versão):
     avançar e voltar passam direto por eles, sem renumerar (os números dos outros slides, o roteiro e as notas seguem como estão).
     Ir direto a um deles (hash, número + Enter, visão geral, apresentador) continua valendo: é a saída pra quando a família pergunta */
  const tirados = () => str(ficha.pular).split(',').map(s => s.trim()).filter(Boolean);
  // e o slide que só existe com dado do painel (data-so-se: o dossiê do 18, sem vídeo, mapa nem oportunidades) também sai da sequência
  let dAtual = null; // os dados da última pintura (applyBind)
  const pulaSlide = i => {
    if (!(i >= 0 && i < N)) return false;
    const o = slides[i].dataset.opcional, c = slides[i].dataset.soSe;
    if (o && tirados().indexOf(o) >= 0) return true;
    return !!c && !cond(c, dAtual || derived());
  };
  // o primeiro slide a partir de i, andando em dir (1 ou -1), que não foi tirado; -1 se acabou
  const vizinho = (i, dir) => { let k = i; while (k >= 0 && k < N && pulaSlide(k)) k += dir; return k >= 0 && k < N ? k : -1; };
  // data-soma mostra a soma dos data-valor já revelados (sobe a cada avanço); data-marca="n" ganha destaque a partir do passo n
  const brl = v => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
  const somaAte = (root, n) => qsa('[data-step][data-valor]', root).filter(e => n == null || (parseInt(e.dataset.step, 10) || 0) <= n).reduce((t, e) => t + (parseFloat(e.dataset.valor) || 0), 0);
  function contaAte(el, alvo) {
    const de = parseFloat(el.dataset.atual);
    el.dataset.atual = alvo;
    let reduz = false; try { reduz = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* sem matchMedia */ }
    if (!el.isConnected || !Number.isFinite(de) || de === alvo || reduz) { el.textContent = brl(alvo); return; }
    const t0 = performance.now(), dur = 500;
    const passo = t => {
      if (String(el.dataset.atual) !== String(alvo)) return; // outro avanço já mudou o alvo
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = brl(de + (alvo - de) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
    // janela escondida ou coberta pausa a animação: o valor certo entra mesmo assim
    setTimeout(() => { if (String(el.dataset.atual) === String(alvo)) el.textContent = brl(alvo); }, dur + 80);
  }
  function showSteps(root, n) {
    qsa('[data-step]', root).forEach(e => e.classList.toggle('shown', n == null || (parseInt(e.dataset.step, 10) || 0) <= n));
    qsa('[data-marca]', root).forEach(e => e.classList.toggle('marcado', n == null || n >= (parseInt(e.dataset.marca, 10) || 0)));
    qsa('[data-soma]', root).forEach(e => contaAte(e, somaAte(root, n)));
  }
  slides.forEach((s, i) => {
    const c = document.createElement('div'); c.className = 'counter';
    c.innerHTML = '<b>' + String(i + 1).padStart(2, '0') + '</b> / ' + String(N).padStart(2, '0');
    s.appendChild(c);
    s.dataset.title = ROT[i] ? ROT[i].nome : 'Slide ' + (i + 1);
  });

  /* ---------------- desenhos ---------------- */
  let uidN = 0;
  const uid = () => 'u' + (++uidN) + '_';
  function dossierClosed() {
    const u = uid();
    return '<svg viewBox="0 0 900 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs>' +
      '<linearGradient id="' + u + 'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#17273E"/><stop offset="1" stop-color="#0A121E"/></linearGradient>' +
      '<linearGradient id="' + u + 'k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F1C2E"/><stop offset="1" stop-color="#080E17"/></linearGradient>' +
      '<filter id="' + u + 'g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="26"/></filter>' +
      '<filter id="' + u + 's" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="6"/></filter></defs>' +
      '<ellipse cx="450" cy="604" rx="410" ry="40" fill="#000" opacity=".65" filter="url(#' + u + 's)"/>' +
      '<rect x="96" y="112" width="708" height="468" rx="16" fill="none" stroke="#E6DBB8" stroke-width="34" opacity=".3" filter="url(#' + u + 'g)"/>' +
      '<path d="M104 150 H372 L402 112 H788 a16 16 0 0 1 16 16 V564 a16 16 0 0 1 -16 16 H120 a16 16 0 0 1 -16 -16 Z" fill="url(#' + u + 'k)"/>' +
      '<rect x="112" y="158" width="676" height="412" rx="10" fill="#F1E9CF" opacity=".24" filter="url(#' + u + 's)"/>' +
      '<rect x="100" y="170" width="700" height="410" rx="14" fill="url(#' + u + 'b)" stroke="rgba(230,219,184,.32)" stroke-width="1.5"/>' +
      '<path d="M116 171 H784" stroke="#E6DBB8" stroke-opacity=".65" stroke-width="2"/>' +
      '<rect x="170" y="280" width="450" height="164" rx="6" fill="#0A1422" stroke="#C8B88A" stroke-opacity=".75" stroke-width="1.5"/>' +
      '<text x="200" y="330" font-family="Barlow Condensed" font-weight="600" font-size="26" letter-spacing="6" fill="#C8B88A">DOSSIÊ DO ATLETA</text>' +
      '<text x="198" y="400" font-family="Saira Condensed" font-weight="800" font-size="66" fill="#FFFFFF" data-bind="nomeDossie" data-fit-svg="390"></text>' +
      '<g transform="rotate(-8 566 226)"><rect x="472" y="196" width="188" height="60" rx="4" fill="rgba(6,11,20,.55)" stroke="#9DB06A" stroke-width="3"/><text x="566" y="237" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="32" letter-spacing="5" fill="#9DB06A">APROVADO</text></g>' +
      '<rect x="664" y="170" width="20" height="410" fill="#C8B88A" opacity=".85"/><rect x="664" y="170" width="4" height="410" fill="#F1E9CF" opacity=".6"/>' +
      '</svg>';
  }
  qsa('[data-dossier="closed"]').forEach(el => { el.innerHTML = dossierClosed(); });

  /* o campo (data-campo="cheio" no 12, "mini" no 35): formação 4-3-3 ilustrativa, vista de cima, com o ataque pra cima.
     O atleta (posId) vem preenchido em areia, com anel gelo estático e o nome num chip; os outros marcadores ficam apagados
     (aço sobre navy). Nenhum jogador, escudo ou clube. Sem posição reconhecida: o 12 fica sem destaque, com "O seu lugar entra
     aqui.", e o 35 esconde a miniatura (data-if="posId"). Na miniatura, os outros marcadores viram pontos, sem sigla. */
  const CAMPO_XY = { CA: [.5, .15], ALE: [.17, .25], ADD: [.83, .25], MC: [.5, .42], 'VOL-e': [.27, .56], 'VOL-d': [.73, .56],
    LE: [.12, .73], 'ZAG-e': [.37, .78], 'ZAG-d': [.63, .78], LD: [.88, .73], GOL: [.5, .92] };
  const CW = 500, CH = 773;
  function campoSvg(posId, mini, nome) {
    const u = uid(), m = 14, iw = CW - 2 * m, ih = CH - 2 * m, sx = iw / 68, sy = ih / 105;
    const n1 = v => v.toFixed(1), X = f => n1(m + f * iw), Y = f => n1(m + f * ih);
    const L = 'fill="none" stroke="rgba(200,184,138,.35)" stroke-width="' + (mini ? 3 : 2) + '"';
    const sigla = id => id.split('-')[0];
    let s = '<svg viewBox="0 0 ' + CW + ' ' + CH + '" aria-hidden="true"><defs><linearGradient id="' + u + 'g" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#14261F"/><stop offset="1" stop-color="#0D1A1B"/></linearGradient></defs>' +
      '<rect width="' + CW + '" height="' + CH + '" rx="6" fill="url(#' + u + 'g)"/>';
    for (let i = 0; i < 10; i += 2) s += '<rect x="' + m + '" y="' + n1(m + i * ih / 10) + '" width="' + iw + '" height="' + n1(ih / 10) + '" fill="rgba(157,176,106,.04)"/>';
    s += '<rect x="' + m + '" y="' + m + '" width="' + iw + '" height="' + ih + '" ' + L + '/>' +
      '<line x1="' + m + '" y1="' + Y(.5) + '" x2="' + (CW - m) + '" y2="' + Y(.5) + '" ' + L + '/>' +
      '<circle cx="' + X(.5) + '" cy="' + Y(.5) + '" r="' + n1(9.15 * sx) + '" ' + L + '/>';
    [[m, 1], [CH - m, -1]].forEach(([gy, d]) => {
      const pa = 16.5 * sy, ga = 5.5 * sy;
      s += '<rect x="' + n1(m + iw / 2 - 20.15 * sx) + '" y="' + n1(d > 0 ? gy : gy - pa) + '" width="' + n1(40.3 * sx) + '" height="' + n1(pa) + '" ' + L + '/>' +
        '<rect x="' + n1(m + iw / 2 - 9.15 * sx) + '" y="' + n1(d > 0 ? gy : gy - ga) + '" width="' + n1(18.3 * sx) + '" height="' + n1(ga) + '" ' + L + '/>';
    });
    const r = mini ? 14 : 33;
    Object.keys(CAMPO_XY).filter(id => id !== posId).forEach(id => {
      const [fx, fy] = CAMPO_XY[id];
      s += '<circle cx="' + X(fx) + '" cy="' + Y(fy) + '" r="' + r + '" fill="#0A1422" stroke="rgba(127,147,168,.6)" stroke-width="2"/>';
      if (!mini) s += '<text x="' + X(fx) + '" y="' + Y(fy) + '" text-anchor="middle" dominant-baseline="central" font-family="Barlow Condensed" font-weight="600" font-size="25" letter-spacing="1" fill="#8FA2B5">' + sigla(id) + '</text>';
    });
    // o chip do nome (ou o aviso sem posição): o ajustaChips acerta a largura depois que o nome entra
    const chip = (cx, cy, fs, txt, nome) => '<g class="chip" data-cx="' + n1(cx) + '"><rect x="' + n1(cx - 90) + '" y="' + n1(cy - fs * .75) + '" width="180" height="' + n1(fs * 1.5) + '" rx="4" fill="#060B14" stroke="#C8B88A" stroke-width="2"/>' +
      '<text x="' + n1(cx) + '" y="' + n1(cy) + '" text-anchor="middle" dominant-baseline="central" font-family="Saira Condensed" font-weight="800" font-size="' + fs + '" fill="#E6DBB8"' +
      (nome ? ' data-bind="nomeCampoUp" data-fb="VOCÊ" data-fit-svg="' + (CW - 60) + '"' : '') + '>' + esc(txt) + '</text></g>';
    if (posId && CAMPO_XY[posId]) {
      const [fx, fy] = CAMPO_XY[posId], cx = m + fx * iw, cy = m + fy * ih, R = mini ? 40 : 38, fs = mini ? 64 : 40;
      s += '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + (R + 24) + '" fill="none" stroke="rgba(127,196,234,.28)" stroke-width="2"/>' +
        '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + (R + 12) + '" fill="none" stroke="#7FC4EA" stroke-width="3"/>' +
        '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + R + '" fill="#C8B88A"/>' +
        '<text x="' + n1(cx) + '" y="' + n1(cy) + '" text-anchor="middle" dominant-baseline="central" font-family="Barlow Condensed" font-weight="700" font-size="' + (mini ? 44 : 28) + '" letter-spacing="1" fill="#060B14">' + sigla(posId) + '</text>';
      // o nome embaixo do marcador; se ali ele cobre outro marcador, em cima, à direita ou à esquerda (vale o lugar que cobre
      // menos, nessa ordem de preferência). Cada lugar é puxado pra dentro do campo antes de contar, e cobrir o marcador do
      // próprio atleta (e o anel dele) nunca vale: com nome e sobrenome o rótulo é largo e, na ponta ou no gol, não cabe do lado
      const gap = R + 30 + fs * .75, hw = (String(nome || 'VOCÊ').length * fs * .5 + fs) / 2, hh = fs * .75, lado = R + 20 + hw;
      const dentro = ([x, y]) => [Math.max(8 + hw, Math.min(CW - 8 - hw, x)), Math.max(8 + hh, Math.min(CH - 8 - hh, y))];
      const cobre = ([x, y]) => {
        const px = Math.max(0, hw + R + 24 - Math.abs(cx - x)), py = Math.max(0, hh + R + 24 - Math.abs(cy - y));
        return (px > 0 && py > 0 ? 1e9 + px * py : 0) + Object.keys(CAMPO_XY).filter(id => id !== posId).reduce((a, id) => {
          const ox = Math.max(0, hw + r - Math.abs(m + CAMPO_XY[id][0] * iw - x)), oy = Math.max(0, hh + r - Math.abs(m + CAMPO_XY[id][1] * ih - y));
          return a + ox * oy;
        }, 0);
      };
      const lugares = [[cx, cy + gap], [cx, cy - gap], [cx + lado, cy], [cx - lado, cy],
        [cx + hw * .5, cy + gap], [cx - hw * .5, cy + gap], [cx + hw * .5, cy - gap], [cx - hw * .5, cy - gap]].map(dentro);
      const [xc, yc] = lugares.reduce((melhor, l) => (cobre(l) < cobre(melhor) ? l : melhor));
      s += chip(xc, yc, fs, 'VOCÊ', true);
    } else if (!mini) {
      s += chip(m + iw / 2, m + .335 * ih, 34, 'O seu lugar entra aqui.', false);
    }
    return s + '</svg>';
  }
  // o chip acompanha a largura do texto e não sai do campo
  function ajustaChips(root) {
    qsa('[data-campo] .chip', root).forEach(g => {
      const r = qs('rect', g), tx = qs('text', g), cx = parseFloat(g.dataset.cx), fs = parseFloat(tx.getAttribute('font-size')) || 40;
      let w = 0;
      try { w = tx.getComputedTextLength(); } catch (e) { /* sem layout */ }
      if (!w) w = tx.textContent.length * fs * .5;
      const rw = w + fs, x = Math.max(8, Math.min(CW - 8 - rw, cx - rw / 2));
      r.setAttribute('x', x.toFixed(1)); r.setAttribute('width', rw.toFixed(1));
      tx.setAttribute('x', (x + rw / 2).toFixed(1));
    });
  }

  /* turma de 10 (slide da vaga): ocupadas, livres e a vaga dele, só com o número real da semana */
  function drawTurma(box, d) {
    if (!box) return;
    const n = d.vagasN, you = n ? 10 - n : -1;
    // redesenha só quando muda (a foto não recarrega a cada ficha salva)
    const k = n + '|' + d.nomeUp + '|' + d.avatarUrl + '|' + d.fotoIni;
    if (box.dataset.desenho === k) return;
    box.dataset.desenho = k;
    // a vaga dele leva o avatar (sem foto, a inicial); o bind logo depois preenche
    const dele = '<span class="ft ft-av tm-av" data-if="avatarOk"><img data-src="avatarUrl" alt="Foto do atleta"><span class="ft-tom"></span></span><b class="tm-ini" data-if="fotoIni&!avatarOk" data-bind="fotoIni"></b>';
    let row = '';
    for (let i = 0; i < 10; i++) row += '<i class="' + (i === you ? 'you' : n && i < you ? 'taken' : '') + '">' + (i === you ? dele : '') + '</i>';
    box.innerHTML = '<p class="hd"><span>Turma de 10</span>' + (n ? '<b>' + (n === 1 ? 'resta 1 vaga' : 'restam ' + n + ' vagas') + '</b>' : '') + '</p>' +
      '<div class="row">' + row + '</div>' +
      (n ? '<p class="you-l">Vaga reservada' + (d.nome ? ': ' + esc(d.nomeUp) : '') + '</p>' : '');
  }

  /* planos: o nome com a cor da marca (data-plano-marca="pro" ou "atual"), a parte de cada plano no 33, cargo por cargo
     (data-plano-vantagens="pro", de window.PLANOS[].vantagens), as listas do plano da ficha (data-plano-lista="inclui", sem tela por ora)
     e um texto do plano da ficha com o Zyron em azul (data-plano-campo="rotina") */
  const comZyron = t => esc(t).replace(/Zyron/g, '<span class="ice">Zyron</span>');
  function marcaHtml(p) {
    if (!p) return '';
    return (p.marca && p.marca.length ? p.marca : [[p.nome, '']]).map(([t, c]) => '<span class="pl-' + esc(c || 'br') + '">' + esc(t) + '</span>').join(' ');
  }
  function drawPlanos(root) {
    const atual = planoDe(ficha.plano);
    const porId = id => (id === 'atual' ? atual : PLANOS.find(p => p.id === id)) || null;
    qsa('[data-plano-atual]', root).forEach(e => { e.dataset.planoAtual = atual ? atual.id : ''; }); // a cor da etiqueta segue o plano
    qsa('[data-plano-marca]', root).forEach(e => { e.innerHTML = marcaHtml(porId(e.dataset.planoMarca)); });
    // a parte de cada plano no 33: [cargo, benefício], só o que ele acrescenta ao degrau de baixo
    qsa('[data-plano-vantagens]', root).forEach(e => {
      const p = porId(e.dataset.planoVantagens), v = p && Array.isArray(p.vantagens) ? p.vantagens : [];
      // [cargo, benefício, chave]: com chave, a linha só aparece se o plano tiver a chave (ex.: turma, P5)
      e.innerHTML = v.filter(([, , k]) => !k || !!p[k]).map(([c, t]) => '<p><b>' + comZyron(str(c)) + ':</b> ' + comZyron(str(t)) + '</p>').join('');
    });
    qsa('[data-plano-campo]', root).forEach(e => { e.innerHTML = comZyron(atual ? str(atual[e.dataset.planoCampo]) : ''); });
    qsa('[data-plano-lista]', root).forEach(e => {
      const v = atual ? atual[e.dataset.planoLista] : null, arr = Array.isArray(v) ? v.map(str).filter(Boolean) : [];
      e.innerHTML = arr.map(t => '<p>' + comZyron(t) + '</p>').join('');
      e.classList.toggle('vazio', !arr.length);
    });
  }

  /* ---------------- personalização ---------------- */
  function fitSvg(el) {
    const max = parseFloat(el.dataset.fitSvg);
    if (!el.dataset.base) el.dataset.base = el.getAttribute('font-size');
    let fs = parseFloat(el.dataset.base);
    el.setAttribute('font-size', fs);
    try {
      let len = el.getComputedTextLength(), guard = 0;
      while (len > max && fs > 10 && guard++ < 40) { fs *= .92; el.setAttribute('font-size', fs.toFixed(1)); len = el.getComputedTextLength(); }
    } catch (e) { /* elemento sem layout */ }
  }
  function fitHtml(el) {
    const max = parseFloat(el.dataset.fit);
    if (!el.dataset.base) el.dataset.base = parseFloat(getComputedStyle(el).fontSize) || 40;
    let fs = parseFloat(el.dataset.base), guard = 0;
    el.style.fontSize = fs + 'px';
    // nunca abaixo de 24 px (regra da casa: nada na tela abaixo de 24 px)
    while (el.scrollWidth > max && fs * .93 >= 24 && guard++ < 40) { fs *= .93; el.style.fontSize = fs.toFixed(1) + 'px'; }
  }
  function applyBind(root, d) {
    d = d || derived();
    // desenhos antes do bind: os nomes dentro deles também são preenchidos
    qsa('#turma', root).forEach(s => drawTurma(s, d));
    // o campo: redesenha só quando a posição muda (o nome entra pelo data-bind logo abaixo)
    qsa('[data-campo]', root).forEach(e => {
      const k = (d.posId || '-') + '|' + e.dataset.campo + '|' + d.nomeCampoUp;
      if (e.dataset.desenho !== k) { e.innerHTML = campoSvg(d.posId, e.dataset.campo === 'mini', d.nomeCampoUp); e.dataset.desenho = k; }
    });
    drawPlanos(root);
    // a leitura do atleta (17): o relatório é redesenhado só quando a leitura muda; todo texto do painel entra escapado
    const RL = window.RelatorioLeitura;
    if (RL) qsa('[data-rl]', root).forEach(e => {
      const dur = ficha._video && ficha._video.duracaoS;
      const k = d.leituraOk ? JSON.stringify(ficha._leitura) + '|' + d.trabalhar + '|' + dur : '';
      if (e.dataset.rlFeito === k) return;
      e.dataset.rlFeito = k;
      if (!k) { e.innerHTML = ''; return; }
      const dl = RL.derivados(ficha._leitura, dur, d.trabalhar), q = e.dataset.rl;
      if (q === 'fonte' || q === 'criterio') e.textContent = dl[q];
      else if (q === 'linha') e.innerHTML = RL.linha(dl, dur);
      else if (typeof RL[q] === 'function') e.innerHTML = RL[q](dl);
    });
    // o vídeo e o quadro do painel: troca só quando muda (não recarrega à toa); o apresentador não baixa o vídeo
    qsa('[data-src]', root).forEach(e => {
      if (isPresenter && e.tagName === 'VIDEO') return;
      const v = d[e.dataset.src] || '';
      if ((e.getAttribute('src') || '') !== v) { if (v) e.setAttribute('src', v); else e.removeAttribute('src'); }
    });
    qsa('[data-poster]', root).forEach(e => { const v = d[e.dataset.poster] || ''; if ((e.getAttribute('poster') || '') !== v) { if (v) e.setAttribute('poster', v); else e.removeAttribute('poster'); } });
    // o espaço e os capítulos só ligam no vídeo do atleta quando ele está na tela
    qsa('[data-video-se]', root).forEach(s => { if (d.videoOk) s.dataset.video = s.dataset.videoSe; else delete s.dataset.video; });
    qsa('[data-bind]', root).forEach(e => { const v = d[e.dataset.bind]; e.textContent = filled(v) ? v : (e.dataset.fb || ''); });
    // nome e sobrenome curtos (ate 14 letras) ficam juntos na mesma linha: a quebra vai antes do nome, nunca no meio dele
    qsa('[data-bind="nome"], [data-bind="nomeUp"]', root).forEach(e => e.classList.toggle('nm-junto', d.nome.length > 0 && d.nome.length <= 14));
    qsa('[data-if]', root).forEach(e => e.classList.toggle('on', cond(e.dataset.if, d)));
    qsa('[data-ifnot]', root).forEach(e => e.classList.toggle('off', cond(e.dataset.ifnot, d)));
    if (root === document) { qsa('[data-fit-svg]').forEach(fitSvg); qsa('[data-fit]').forEach(fitHtml); ajustaChips(document); }
    if (window.FotoAtleta) window.FotoAtleta.atualiza(root, d);
    if (window.DossieAtleta) window.DossieAtleta.atualiza(root, d);
    dAtual = d;
    return d;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------------- mensagens ---------------- */
  // o canal e as mensagens levam o código do link: o apresentador de um atleta nunca mexe na tela de outro
  let chan = null;
  if (!EMBUTIDO) { try { chan = new BroadcastChannel(CANAL); } catch (e) { chan = null; } }
  let peer = isPresenter ? window.opener : null;
  const me = isPresenter ? 'p' : 'd';
  const seen = new Set();
  function send(m) {
    m._id = Date.now() + '-' + Math.random().toString(36).slice(2);
    m._from = me;
    m._a = AID || '_';
    try { if (chan) chan.postMessage(m); } catch (e) { /* canal fechado */ }
    try { if (peer && !peer.closed) peer.postMessage(Object.assign({ __je2: 1 }, m), '*'); } catch (e) { /* janela fechada */ }
  }
  function listen(handler) {
    const recv = m => { if (!m || !m._id || m._from === me || m._a !== (AID || '_') || seen.has(m._id)) return; seen.add(m._id); handler(m); };
    if (chan) chan.onmessage = e => recv(e.data);
    window.addEventListener('message', e => { if (!e.data || !e.data.__je2) return; if (peer && e.source !== peer) return; recv(e.data); });
    if (!EMBUTIDO) window.addEventListener('storage', e => { if (e.key === FKEY) { ficha = store.get(FKEY, {}); handler({ t: 'local' }); } });
  }

  /* ---------------- o atleta do link: /api/r2?t=<código> no Painel do Closer ---------------- */
  // O painel guarda o que a família vê de cada atleta. Os campos que vêm de lá valem sobre os deste navegador (e o que foi
  // apagado lá some daqui); o resto da ficha, o que se anota na call, continua aqui. Link revogado, vencido ou que não
  // existe: a tela da família vira um aviso neutro, sem dado nenhum, e a ficha guardada deste link sai do navegador; o
  // apresentador vê o motivo. Painel fora do ar ou resposta estranha: segue com a ficha guardada deste link (ou o deck
  // genérico), sem erro pra família; o apresentador recebe o aviso.
  const MOTIVO = {
    revogado: 'Este link foi revogado no painel: a família vê só o aviso de link inativo. Reative no painel ou gere outro link.',
    expirado: 'Este link venceu: a família vê só o aviso de link inativo. Renove no painel.',
    'nao-encontrado': 'O painel não achou este link (apagado ou trocado por outro): a família vê só o aviso de link inativo.'
  };
  function carregaPainel(depois, aviso, vai) {
    if (!AID || typeof fetch !== 'function') { liberaTela(); return; }
    fetch(comChave(PAINEL + '/api/r2?t=' + AID), { cache: 'no-store' })
      .then(r => r.json().then(j => ({ status: r.status, j }), () => ({ status: r.status, j: null })))
      .then(({ status, j }) => {
        const est = j && j.estado;
        if (status === 200 && est === 'ok') {
          if (vai && iraVersao(destinoDe(j))) return; // a tela fica presa até a página da versão carregar (sem piscar a errada)
          const f = j.ficha && typeof j.ficha === 'object' ? j.ficha : {};
          (Array.isArray(ficha._p) ? ficha._p : []).forEach(k => { if (!(k in f)) delete ficha[k]; });
          Object.keys(f).forEach(k => { ficha[k] = f[k]; });
          nomeDeHoje(ficha);
          // a leitura do atleta (17) e a foto: vêm só do painel; o que sumiu lá some daqui. A marca de "não carregou" só
          // sai quando a foto ou o vídeo mudam de verdade (endereço novo): o navegador não repete o erro de um endereço que já falhou
          const videoAntes = JSON.stringify(ficha._video || null), fotoAntes = ficha._foto ? ficha._foto.versao : 0;
          if (j.video && j.video.ok) ficha._video = j.video; else delete ficha._video;
          if (j.video && j.video.ok && j.leitura) ficha._leitura = j.leitura; else delete ficha._leitura;
          if (j.foto && j.foto.ok && Number(j.foto.versao) > 0) ficha._foto = { ok: true, versao: Number(j.foto.versao) }; else delete ficha._foto;
          // o mapa de calor do dossiê (18): só vem com "Tenho o vídeo do jogador" ligado; a versão vai no endereço
          if (j.mapa && j.mapa.ok && Number(j.mapa.versao) > 0) ficha._mapa = { ok: true, versao: Number(j.mapa.versao) }; else delete ficha._mapa;
          if (JSON.stringify(ficha._video || null) !== videoAntes) { videoFalhou = false; posterFalhou = false; }
          if ((ficha._foto ? ficha._foto.versao : 0) !== fotoAntes) { fotoFalhou = false; avatarFalhou = false; }
          ficha._a = AID; ficha._p = Object.keys(f); ficha._vistoEm = Date.now();
          const dest = destinoDe(j);
          if (dest) ficha._v = { o: dest.origem, c: dest.caminho }; else delete ficha._v;
          store.set(FKEY, ficha);
          linkEstado = 'ok';
          liberaTela();
          depois();
          if (aviso) aviso('O atleta deste link veio do painel' + (f.nome ? ': ' + f.nome : '') + '. O que veio do painel vale sobre esta ficha; pra mudar de vez, mude no painel.' +
            (f.temVideo === 'sim' && j.video && j.video.ok ? (j.leitura ? ' O vídeo analisado entra no 17 (lance a lance) e no dossiê (18).' : ' O vídeo analisado entra no dossiê (18); o 17 fica de ponte, com a leitura ao vivo.')
              : j.video && j.video.ok ? (j.leitura ? '' : ' O vídeo está no painel, mas sem lances marcados: o 17 mostra só o vídeo.') : ' Sem vídeo no painel: o 17 vai pra leitura ao vivo.'), true);
          return;
        }
        if ((status === 200 || status === 404) && MOTIVO[est]) { linkInativo(est, aviso); depois(); return; }
        throw new Error(String(status));
      })
      .catch(() => {
        linkEstado = 'sem-painel';
        liberaTela();
        if (aviso) aviso('Não consegui falar com o painel agora. A tela usa ' + (ficha.nome ? 'a última ficha deste link guardada neste navegador.' : 'o deck sem o nome do atleta (não tem ficha deste link neste navegador).'), false);
      })
      .then(() => { if (EMBUTIDO) avisaPainel({ t: 'carregado', estado: linkEstado }); });
  }
  // link inativo: nada do atleta fica na tela nem no navegador
  function linkInativo(est, aviso) {
    linkEstado = est;
    store.del(FKEY);
    ficha = { _a: AID };
    if (isPresenter) { if (aviso) aviso(MOTIVO[est], false); }
    else mostraInativo();
    liberaTela();
  }
  function mostraInativo() {
    qsa('video, audio').forEach(v => { try { v.pause(); } catch (e) { /* nada */ } });
    const vp = qs('#viewport'); if (vp) vp.style.display = 'none';
    ['#hud', '#progress', '#overview'].forEach(s => { const x = qs(s); if (x) x.style.display = 'none'; });
    if (qs('#je-inativo')) return;
    const el = document.createElement('div');
    el.id = 'je-inativo'; el.setAttribute('role', 'status');
    el.style.cssText = 'position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;padding:32px;background:#060B14;text-align:center';
    const p = document.createElement('p');
    p.style.cssText = 'margin:0;max-width:960px;font:600 clamp(24px,3.4vw,44px)/1.3 var(--f-body);color:#E6DBB8';
    p.textContent = 'Este link não está mais ativo. Fale com o seu gestor de carreiras.';
    el.appendChild(p); document.body.appendChild(el);
  }
  // entrada sem piscar: com link e sem a ficha dele guardada, a tela espera a resposta do painel (no máximo 2 segundos)
  let telaPresa = false;
  function prendeTela() { const vp = qs('#viewport'); if (!vp) return; telaPresa = true; vp.style.visibility = 'hidden'; setTimeout(liberaTela, 2000); }
  function liberaTela() {
    if (!telaPresa) return;
    telaPresa = false;
    const vp = qs('#viewport'); if (vp) vp.style.visibility = '';
    // a entrada (.rise) roda de novo no slide da vez, agora com o nome dele
    const s = slides[cur];
    if (s && s.classList.contains('active')) { s.classList.remove('active'); void s.offsetWidth; s.classList.add('active'); }
  }
  // o quadro da prévia conversa só com o Painel do Closer
  function avisaPainel(m) { try { if (EMBUTIDO) window.parent.postMessage(m, PAINEL_ORIGEM); } catch (e) { /* sem painel */ } }
  function avisoPainel(txt, bom) {
    const p = qs('#pz-painel'); if (!p) return;
    p.hidden = false; p.textContent = txt; p.style.color = bom ? '' : '#E2552B';
  }

  /* ---------------- miniaturas ---------------- */
  function thumb(i, step) {
    const c = slides[i].cloneNode(true);
    c.classList.remove('active');
    showSteps(c, step);
    c.removeAttribute('data-video');
    qsa('[id]', c).forEach(e => { if (!e.closest('defs')) e.removeAttribute('id'); });
    // vídeo vira a capa: miniatura não carrega nem toca nada
    qsa('video', c).forEach(v => {
      const img = document.createElement('img');
      img.src = v.getAttribute('poster') || '';
      img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
      v.replaceWith(img);
    });
    qsa('audio', c).forEach(a => a.remove());
    qsa('.play, .ap-play', c).forEach(b => b.setAttribute('tabindex', '-1'));
    return c;
  }
  function mountThumb(box, i, step) {
    box.innerHTML = '';
    if (i == null || i < 0 || i >= N) return;
    const mini = document.createElement('div'); mini.className = 'mini'; mini.appendChild(thumb(i, step)); box.appendChild(mini);
    const f = () => { mini.style.transform = 'scale(' + (box.clientWidth / 1920) + ')'; };
    f(); requestAnimationFrame(f);
  }

  // imagem do painel que não carregou (fora do ar, link revogado no meio da call, foto vencida): o quadro do vídeo cai no
  // desenho e a foto e o avatar caem na inicial do nome, sem ícone quebrado e sem erro na tela da família. Um ouvinte só,
  // na captura, porque a vaga da turma cria a imagem dela depois
  document.addEventListener('error', e => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || !img.getAttribute('src')) return;
    const k = img.dataset.src;
    if (k === 'posterUrl' && !posterFalhou) { posterFalhou = true; applyBind(document); }
    else if (k === 'fotoUrl' && !fotoFalhou) { fotoFalhou = true; applyBind(document); send({ t: 'fotoFalhou' }); }
    else if (k === 'avatarUrl' && !avatarFalhou) { avatarFalhou = true; applyBind(document); send({ t: 'fotoFalhou' }); }
  }, true);
  window.addEventListener('je-foto-atleta', () => applyBind(document));
  // o vídeo, o quadro ou o mapa do dossiê não carregou: some da tela (dossie-atleta.js)
  window.addEventListener('je-dossie', () => applyBind(document));
  applyBind(document);
  // as medidas do nome (data-fit, o chip do campo) dependem da fonte: refaz quando ela termina de carregar
  try { document.fonts.ready.then(() => applyBind(document)); } catch (e) { /* sem document.fonts */ }
  if (isPresenter) presenter(); else deck();

  /* =============================================================
     MODO FAMÍLIA
     ============================================================= */
  function deck() {
    const stage = qs('#stage');
    const fit = () => document.documentElement.style.setProperty('--s', Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    fit(); window.addEventListener('resize', fit);

    const hashIdx = () => { const n = parseInt((location.hash || '').replace('#', ''), 10); return Number.isFinite(n) ? n - 1 : 0; };
    cur = hashIdx();
    if (!(cur >= 0 && cur < N)) cur = 0;
    // passo da revelação no slide atual: entrar avançando começa do zero; pular direto (hash, visão geral, apresentador) mostra tudo
    let step = stepsIn(cur);
    showSteps(slides[cur], step);
    // com link e sem a ficha dele guardada: a tela espera o painel (até 2 s) em vez de mostrar o deck sem o nome
    if (AID && !tinhaFicha) prendeTela();
    slides[cur].classList.add('active');
    updateHud();
    // dentro do quadro da prévia do painel: sem HUD e sem apresentador; o painel escolhe o slide e pede pra atualizar
    if (EMBUTIDO) {
      ['#hud', '#progress'].forEach(s => { const x = qs(s); if (x) x.style.display = 'none'; });
      window.addEventListener('message', e => {
        if (e.origin !== PAINEL_ORIGEM || e.source !== window.parent) return;
        const d = e.data || {};
        if (d.t === 'goto' && Number.isFinite(+d.i)) go(Math.max(0, Math.min(N - 1, Math.floor(+d.i))));
        else if (d.t === 'atualiza') carregaPainel(() => applyBind(document), null, true);
      });
      avisaPainel({ t: 'deck', n: N, titulos: slides.map(s => s.dataset.title) });
    }

    function go(i, n) {
      if (i == null || i < 0 || i >= N) return;
      const full = stepsIn(i);
      if (i === cur && n == null) return; // pedir o slide em que já está não muda o passo revelado
      n = n == null ? full : Math.max(0, Math.min(n, full));
      if (i === cur) {
        if (n === step) return;
        step = n; showSteps(slides[cur], step);
        send({ t: 'state', i: cur, step });
        return;
      }
      pauseIn(slides[cur]);
      slides[cur].classList.remove('active');
      cur = i; step = n;
      showSteps(slides[cur], step);
      slides[cur].classList.add('active');
      try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) { /* file:// */ }
      updateHud();
      send({ t: 'state', i: cur, step });
    }
    const next = () => { if (step < stepsIn(cur)) go(cur, step + 1); else { const k = vizinho(cur + 1, 1); if (k >= 0) go(k, 0); } };
    const prev = () => { if (step > 0) go(cur, step - 1); else { const k = vizinho(cur - 1, -1); if (k >= 0) go(k); } };
    function updateHud() {
      qs('#hud-pos').textContent = posLabel(cur);
      qs('#progress').style.width = ((cur + 1) / N * 100) + '%';
      document.title = 'Jogador de Elite · R2 · ' + posLabel(cur);
    }
    window.addEventListener('hashchange', () => go(hashIdx()));

    /* vídeo */
    const play = v => { const r = v && v.play(); if (r && r.catch) r.catch(() => {}); };
    function seek(v, t) { if (!v) return; try { v.currentTime = t; } catch (e) { /* ainda carregando */ } play(v); }
    function pauseIn(s) { qsa('video, audio', s).forEach(v => { try { v.pause(); } catch (e) { /* nada */ } }); }
    const slideVideo = () => { const id = slides[cur].dataset.video; return id ? document.getElementById(id) : null; };
    qsa('.player').forEach(p => {
      const v = qs('video', p), b = qs('.play', p);
      b.addEventListener('click', () => play(v));
      v.addEventListener('play', () => p.classList.add('playing'));
      v.addEventListener('ended', () => p.classList.remove('playing'));
    });
    // capítulos: o clique pula o vídeo e o item da vez acende. Delegado na lista, porque a do vídeo do atleta (17) é
    // montada depois, quando a leitura chega do painel
    qsa('.chapters').forEach(list => {
      const v = document.getElementById(list.dataset.for);
      list.addEventListener('click', e => { const li = e.target.closest('li[data-t]'); if (li) seek(v, parseFloat(li.dataset.t)); });
      v.addEventListener('timeupdate', () => {
        const items = qsa('li', list); let on = 0;
        items.forEach((li, k) => { if (v.currentTime >= parseFloat(li.dataset.t) - .2) on = k; });
        items.forEach((li, k) => li.classList.toggle('on', k === on && !v.paused));
      });
      v.addEventListener('pause', () => qsa('li', list).forEach(li => li.classList.remove('on')));
    });
    /* o vídeo do atleta (17): começa mudo, com o botão de som; os lances da linha do tempo e da lista curta pulam o vídeo
       (2 s antes do lance); a chamada do lance aparece sobre o vídeo quando o minuto passa por ele. Se o vídeo não carregar,
       o 17 volta pra leitura ao vivo sem erro na tela, e o apresentador recebe o aviso */
    const va = document.getElementById('v-atleta');
    if (va) {
      const pa = va.closest('.player'), ch = qs('.ia-chamada', pa), sl = va.closest('.slide');
      const marcaSom = () => pa.classList.toggle('com-som', !va.muted);
      qs('.som', pa).addEventListener('click', () => { va.muted = !va.muted; marcaSom(); });
      va.addEventListener('volumechange', marcaSom);
      sl.addEventListener('click', e => { const m = e.target.closest('.rl-m, .rl-curtos li[data-t]'); if (m) seek(va, Math.max(0, parseFloat(m.dataset.t) - 2)); });
      va.addEventListener('timeupdate', () => {
        const RL = window.RelatorioLeitura;
        const l = RL && ficha._leitura && ficha._video ? RL.derivados(ficha._leitura, ficha._video.duracaoS, '') : null;
        const x = l && RL.lanceEm(l, va.currentTime);
        ch.hidden = !x;
        if (x) { qs('.lk', ch).textContent = RL.mmss(x.t) + ' · ' + x.tipo + ' · ' + RL.LEITURA[x.leitura]; qs('.nt', ch).textContent = x.nota || ''; ch.classList.toggle('ajustar', x.leitura === 'ajustar'); }
      });
      va.addEventListener('error', () => {
        if (!va.getAttribute('src') || videoFalhou) return;
        videoFalhou = true; pauseIn(sl); applyBind(document); send({ t: 'videoFalhou' });
      });
    }
    /* áudio (depoimento): a onda acende até onde já tocou */
    const mmss = t => Number.isFinite(t) ? Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0') : '0:00';
    qsa('.audio-player').forEach(p => {
      const a = document.getElementById(p.dataset.for); if (!a) return;
      const onda = qs('.ap-onda', p), barras = qsa('i', onda), tempo = qs('.ap-tempo', p);
      const pinta = () => {
        const k = a.duration ? a.currentTime / a.duration : 0, n = Math.round(k * barras.length);
        barras.forEach((b, j) => b.classList.toggle('on', j < n));
        tempo.textContent = a.duration ? mmss(a.currentTime) + ' / ' + mmss(a.duration) : mmss(a.currentTime);
      };
      qs('.ap-play', p).addEventListener('click', () => { if (a.paused) play(a); else a.pause(); });
      onda.addEventListener('click', e => {
        const r = onda.getBoundingClientRect();
        if (a.duration) { a.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * a.duration; pinta(); }
      });
      a.addEventListener('play', () => p.classList.add('tocando'));
      a.addEventListener('pause', () => p.classList.remove('tocando'));
      a.addEventListener('ended', () => p.classList.remove('tocando'));
      ['timeupdate', 'loadedmetadata', 'durationchange', 'seeked'].forEach(ev => a.addEventListener(ev, pinta));
      pinta();
    });

    /* teclado */
    let numBuf = '', numT = 0;
    document.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if (qs('#overview').classList.contains('on')) { if (k === 'Escape' || k === 'g' || k === 'G') { e.preventDefault(); toggleOverview(false); } return; }
      if (k === ' ' && slideVideo()) { e.preventDefault(); const v = slideVideo(); if (v.paused) play(v); else v.pause(); }
      else if (k === 'ArrowRight' || k === 'PageDown' || k === 'ArrowDown' || k === ' ') { e.preventDefault(); next(); }
      else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'ArrowUp') { e.preventDefault(); prev(); }
      else if (k === 'Enter') { e.preventDefault(); if (numBuf) { const n = parseInt(numBuf, 10); numBuf = ''; go(n - 1); } }
      else if (k === 'Home') { e.preventDefault(); go(0); }
      else if (k === 'End') { e.preventDefault(); go(N - 1); }
      else if (k === 'f' || k === 'F') toggleFs();
      else if (k === 'p' || k === 'P') openPresenter();
      else if (k === 'g' || k === 'G') toggleOverview(true);
      else if (k === 'v' || k === 'V') abrirVariacoes();
      else if (/^\d$/.test(k)) { numBuf += k; clearTimeout(numT); numT = setTimeout(() => { const n = parseInt(numBuf, 10); numBuf = ''; go(n - 1); }, 900); }
    }, true);

    let tx = 0, ty = 0;
    stage.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { if (dx < 0) next(); else prev(); } }, { passive: true });

    let hudT = 0;
    const showHud = () => { document.body.classList.add('show-hud'); clearTimeout(hudT); hudT = setTimeout(() => document.body.classList.remove('show-hud'), 2200); };
    document.addEventListener('mousemove', showHud);
    qs('#hud').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const a = b.dataset.act;
      if (a === 'prev') prev(); if (a === 'next') next(); if (a === 'overview') toggleOverview(true); if (a === 'presenter') openPresenter(); if (a === 'fullscreen') toggleFs();
      if (a === 'variacoes') abrirVariacoes();
    });
    // Com o link de um atleta, a versão do R2 se escolhe no painel (o link é um só): abre o R2 dele lá, em outra aba. Sem link,
    // a página com as versões de exemplo. Antes da call: não é tela pra família. Não abre dentro da prévia do painel
    function abrirVariacoes() {
      if (EMBUTIDO) return;
      if (AID) { window.open(PAINEL + '/#/r2/' + AID, '_blank', 'noopener'); return; }
      location.href = '/variacoes/';
    }
    showHud();
    function toggleFs() {
      if (!document.fullscreenElement) { const r = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); if (r && r.catch) r.catch(() => {}); }
      else if (document.exitFullscreen) document.exitFullscreen();
    }

    let ovBuilt = false;
    function toggleOverview(on) {
      const ov = qs('#overview');
      if (on && !ovBuilt) {
        slides.forEach((s, i) => {
          const it = document.createElement('div'); it.className = 'ov-item';
          it.innerHTML = '<div class="th"></div><p class="nm"><b>' + String(i + 1).padStart(2, '0') + '</b>' + esc(s.dataset.title) + '</p>';
          it.addEventListener('click', () => { toggleOverview(false); go(i); });
          qs('#ov-grid').appendChild(it);
        });
        ovBuilt = true;
      }
      ov.classList.toggle('on', !!on);
      if (on) {
        qsa('.ov-item', ov).forEach((it, i) => {
          it.classList.toggle('cur', i === cur); mountThumb(qs('.th', it), i);
          const fora = pulaSlide(i); // fora da sequência deste atleta: o clique ainda abre, as setas passam direto
          it.style.opacity = fora ? '.4' : ''; it.title = fora ? 'Fora da sequência desta apresentação (as setas passam direto)' : '';
        });
        const c = qsa('.ov-item', ov)[cur]; if (c) c.scrollIntoView({ block: 'center' });
      }
    }
    // a janela do apresentador leva o código do link: o apresentador de um atleta nunca reaproveita a janela de outro
    function openPresenter() {
      if (EMBUTIDO) return;
      const url = location.pathname + location.search + (location.search ? '&' : '?') + 'presenter';
      const w = window.open(url, JANELA, 'width=1480,height=920');
      if (w) peer = w; else alert('Libere pop-ups pra abrir o modo apresentador.');
    }

    listen(m => {
      if (m.t === 'goto') go(m.i, m.step);
      else if (m.t === 'next') next();
      else if (m.t === 'prev') prev();
      else if (m.t === 'hello') send({ t: 'state', i: cur, step });
      else if (m.t === 'ficha') { ficha = m.ficha || {}; applyBind(document); }
      else if (m.t === 'local') applyBind(document);
      else if (m.t === 'seek') { go(m.slide); seek(document.getElementById(m.id), m.time); }
      else if (m.t === 'pause') pauseIn(slides[cur]);
      else if (m.t === 'som') { const v = document.getElementById(m.id || 'v-atleta'); if (v) v.muted = !v.muted; }
    });
    send({ t: 'state', i: cur, step });
    carregaPainel(() => { applyBind(document); send({ t: 'ficha', ficha }); }, null, true);
    // o closer mudou algo no painel com a apresentação aberta (nome, foto, variação, validade): ao voltar pra esta aba, o deck busca de
    // novo (no máximo a cada 5 s). Link vencido ou revogado nesse meio tempo: a tela troca pelo aviso de link inativo
    let buscouEm = Date.now();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible' || !AID || Date.now() - buscouEm < 5000) return;
      buscouEm = Date.now();
      carregaPainel(() => { applyBind(document); send({ t: 'ficha', ficha }); });
    });
  }

  /* =============================================================
     MODO APRESENTADOR
     ============================================================= */
  function presenter() {
    document.documentElement.classList.add('is-presenter');
    document.body.classList.add('is-presenter');
    qs('#hud').style.display = 'none'; qs('#progress').style.display = 'none';
    qsa('video, audio').forEach(v => { v.preload = 'none'; });

    const app = document.createElement('div');
    app.className = 'pz';
    app.innerHTML = `
      <header class="pz-top">
        <p class="pz-brand">Jogador de Elite <span>R2 · Gestor de Carreiras</span></p>
        <p id="pz-var" title="Versão do deck aberta na janela da família" style="margin:0;font:600 13px var(--f-label);letter-spacing:.18em;text-transform:uppercase;color:var(--sand-l);border:1px solid rgba(200,184,138,.45);border-radius:4px;padding:5px 8px;white-space:nowrap">${esc(window.VARIACAO_NOME || 'Deck padrão')}</p>
        <div class="pz-nav"><button data-a="prev">◀</button><span id="pz-pos">1</span><button data-a="next">▶</button></div>
        <div class="pz-clock"><span id="pz-time">00:00</span><span class="pz-small">/ ${DADOS.duracao}:00</span><button data-a="timer" id="pz-tbtn">Iniciar</button><button data-a="treset">Zerar</button></div>
        <button data-a="silence" id="pz-sil" title="Tecla S">Silêncio (S)</button>
        <p class="pz-link" id="pz-link">Conectando ao deck…</p>
      </header>
      <div id="pz-presenca" role="alert" style="display:none;gap:14px;align-items:center;padding:10px 20px;background:#2A1A10;border-bottom:1px solid #E2552B;color:#FFE3D6;font:500 15px var(--f-body)"><span id="pz-presenca-txt"></span><button data-a="assumir" title="Só para de avisar aqui: não bloqueia a outra janela">Assumir</button></div>
      <main class="pz-main">
        <section class="pz-left">
          <div class="pz-prev">
            <div><div class="pz-thumb" id="pz-cur"></div><p class="pz-cap">Agora na tela da família</p></div>
            <div><div class="pz-thumb" id="pz-next"></div><p class="pz-cap">Próximo</p></div>
          </div>
          <div id="pz-ctl"></div>
          <div class="pz-notes" id="pz-notes"></div>
        </section>
        <aside class="pz-right">
          <nav class="pz-tabs"><button data-tab="ficha" class="on">Ficha</button><button data-tab="ler">Ler antes</button><button data-tab="obj">Objeções</button><button data-tab="fech">Fechamento</button></nav>
          <div class="pz-tab on" id="tab-ficha"></div>
          <div class="pz-tab" id="tab-ler"></div>
          <div class="pz-tab" id="tab-obj"></div>
          <div class="pz-tab" id="tab-fech"></div>
        </aside>
      </main>
      <footer class="pz-foot"><b>Lembrete.</b> ${esc(window.PROIBIDOS || '')}</footer>`;
    document.body.appendChild(app);

    const first = s => String(s || '').trim().split(/\s+/)[0] || '';
    const minusc = s => (s ? s[0].toLowerCase() + s.slice(1) : '');
    function fill(s) {
      const d = derived(), pl = planoDe(ficha.plano) || {};
      const map = {
        '[atleta]': d.nomeCurto, '[responsável]': first(ficha.responsavel), '[pai]': first(ficha.pai), '[mãe]': first(ficha.mae), '[gerente]': d.gerente,
        '[idade]': d.idade, '[idade + 1]': d.idadeMais1, '[característica]': d.caracteristicas, '[experiência]': d.experiencia, '[sonho]': d.sonho,
        '[primeiro foco]': d.trabalhar, '[locomoção]': d.locomocao, '[dor]': d.dor, '[peneiras]': d.peneiras || d.inPeneirasTxt, '[investido]': d.investido || d.inGasto,
        '[nº de peneiras]': d.inPeneirasTxt, '[gasto com peneiras]': d.inGasto, '[anos tentando]': d.inAnosTxt, '[oportunidades]': (d.dsOps || []).map(o => o.clube).join(', ').replace(/, ([^,]*)$/, ' e $1'), '[vagas]': d.vagas,
        '[faixa]': d.faixaContrato, '[link AGN]': d.linkAgn,
        '[caso]': str(ficha.casoNome), '[clube do caso]': str(ficha.casoClube), '[país do caso]': str(ficha.casoPais), '[link do caso]': str(ficha.casoLink),
        '[hora]': str(ficha.horaRetorno), '[posição]': str(ficha.posicao).toLowerCase(),
        '[nome completo]': d.nomeCompleto, '[dia da call]': str(ficha.r2dia), '[hora da call]': str(ficha.r2hora),
        // a garantia, como se fala (window.GARANTIA, roteiro.js): o texto sai de um lugar só
        '[garantia]': str((window.GARANTIA || {}).fala),
        // do plano da ficha (vazio ou nome antigo: Legacy)
        '[plano]': str(pl.curto || pl.nome), '[preço]': pl.preco ? pl.preco + ', vitalício' : '', '[parcela]': str(pl.parcela), '[ritmo]': minusc(str(pl.ritmo)), '[por dia]': str(pl.porDia)
      };
      let out = esc(s);
      Object.keys(map).forEach(k => { if (map[k]) out = out.split(esc(k)).join('<b class="pz-name">' + esc(map[k]) + '</b>'); });
      return out;
    }
    function save(extra) {
      if (extra) Object.assign(ficha, extra);
      store.set(FKEY, ficha);
      send({ t: 'ficha', ficha });
      refreshAll(applyBind(document));
    }

    /* ----- trocar de plano (33 e aba Fechamento): a tela da família acompanha ----- */
    let troca = null; // a última troca: { de, para }, pra mostrar o que sai ao descer e o que entra ao subir
    const emLista = arr => (arr.length > 1 ? arr.slice(0, -1).join(', ') + ' e ' + arr[arr.length - 1] : arr[0] || '');
    function trocaHtml() {
      if (!troca) return '';
      const a = PLANOS.indexOf(troca.de), b = PLANOS.indexOf(troca.para);
      if (a < 0 || b < 0 || a === b || troca.para !== planoDe(ficha.plano)) return '';
      if (b < a) {
        // descer: sai o que cada degrau de baixo perde (sai[] de cada um)
        const sai = PLANOS.slice(b, a).reverse().reduce((t, p) => t.concat(p.sai || []), []);
        return `<p class="pz-say" style="margin-top:10px">${fill('"' + (troca.para.descer || 'Existe um formato mais enxuto, ' + comArtigo(troca.para)) + '. O que muda: sai ' + emLista(sai) + '."')}</p>` +
          (troca.para.id === 'scouting' ? '<p class="pz-small"><b>Diga em voz alta:</b> o encaminhamento pra clubes vem a partir da Assessoria PRO.</p>'
            : troca.de.id === 'legacy' ? '<p class="pz-small"><b>Diga em voz alta:</b> a conexão direta com clubes e AGN e os 15 encaminhamentos por mês são do Legacy; na Assessoria PRO, são pelo menos 5.</p>' : '');
      }
      // subir: entra o que cada degrau de cima acrescenta (diferenca de cada degrau de baixo)
      const entra = PLANOS.slice(a, b).map(p => p.diferenca).filter(Boolean);
      return `<p class="pz-say" style="margin-top:10px">${fill('"' + (troca.para.subir || 'Se vocês quiserem mais') + ', ' + comArtigo(troca.para) + ' acrescenta ' + emLista(entra) + '."')}</p>`;
    }
    function planoCtl(titulo) {
      const at = planoDe(ficha.plano);
      return `<div class="pz-ctl"><p class="pz-h">${titulo}</p><div class="pz-mode">${PLANOS.map(p => `<button data-plano-troca="${esc(p.id)}" class="${p === at ? 'on' : ''}">${esc(p.curto || p.nome)}</button>`).join('')}</div>${trocaHtml()}</div>`;
    }
    function trocarPlano(id) {
      const para = PLANOS.find(p => p.id === id), de = planoDe(ficha.plano);
      if (!para || planoPorNome(ficha.plano) === para) return;
      if (de !== para) troca = { de, para };
      save({ plano: para.nome }); syncForm();
    }

    /* ----- roteiro e controles do slide ----- */
    const list = arr => '<ul>' + arr.map(x => '<li>' + fill(x) + '</li>').join('') + '</ul>';
    // a etapa da Bíblia em que a call está (window.ETAPAS, roteiro.js); o 16 cobre duas
    const etapasDe = n => (window.ETAPAS || []).filter(e => (e.slides || []).indexOf(n) >= 0).map(e => e.nome);
    function renderNotes() {
      const r = ROT[cur] || {}, et = etapasDe(cur + 1);
      const sec = (title, arr, cls) => arr && arr.length ? `<div class="pz-sec ${cls || ''}"><p class="pz-h">${title}</p>${list(arr)}</div>` : '';
      qs('#pz-notes').innerHTML = `
        <div class="pz-title"><span>${String(cur + 1).padStart(2, '0')}</span>${esc(r.nome || '')}<em>${r.min ? String(r.min).replace('.', ',') + ' min' : ''}</em></div>
        <p class="pz-etapa">${et.length ? `Etapa da Bíblia: <b>${et.map(esc).join(' · ')}</b>` : ''}${r.silencio ? '<span class="pz-siltag">Pergunta e silêncio</span>' : ''}</p>
        ${objsHere()}
        ${r.silencio ? `<div class="pz-sec sil"><p class="pz-h">Pergunte e fique em silêncio · tecla S${cur === SILENCE_SLIDE ? '' : ' (o silêncio conta aqui, sem trocar de slide)'}</p><p class="pz-say">${fill(r.silencio)}</p></div>` : ''}
        ${sec('Fale', r.fala)}${sec('Modo B, se precisar (a tela não muda)', r.modoB)}${sec('Pergunte e espere a resposta', r.perguntas, 'ask')}${sec('Anote na ficha', r.crm, 'crm')}
        ${r.atencao ? `<div class="pz-sec warn"><p class="pz-h">Atenção</p><p>${fill(r.atencao)}</p></div>` : ''}`;
    }
    // o que o slide desarma: o inverso de OBJECOES[].slides (a fonte é uma só); clique e a resposta abre na aba Objeções
    function objsHere() {
      const list = (window.OBJECOES || []).map((o, k) => [o, k]).filter(([o]) => o.slides.indexOf(cur + 1) >= 0);
      return list.length ? `<div class="pz-sec desarma"><p class="pz-h">Este slide desarma</p><div class="pz-chips">${list.map(([o, k]) => `<button data-obj="${k}">${esc(o.q)}</button>`).join('')}</div></div>` : '';
    }
    function openObj(k) {
      qsa('.pz-tabs button').forEach(x => x.classList.toggle('on', x.dataset.tab === 'obj'));
      qsa('.pz-tab').forEach(x => x.classList.toggle('on', x.id === 'tab-obj'));
      const d = qs('.pz-obj[data-k="' + k + '"]'); if (!d) return;
      qsa('.pz-obj').forEach(x => { x.open = x === d; });
      d.scrollIntoView({ block: 'start' });
    }
    function renderCtl() {
      const box = qs('#pz-ctl'); const o = str(ficha.origem);
      let h = '';
      const vid = slides[cur].dataset.video;
      if (vid) {
        const el = document.getElementById(vid);
        // depoimento em áudio: tocar do início e pausar na tela da família
        if (el && el.tagName === 'AUDIO') h = `<div class="pz-ctl"><p class="pz-h">Áudio na tela da família (compartilhe com áudio)</p><div class="pz-mode"><button data-seek="0" data-vid="${vid}">Tocar do início</button><button data-a="vpause">Pausar</button></div><p class="pz-small">Espaço no deck também dá play e pausa.</p></div>`;
        else if (vid === 'v-dossie') h = `<div class="pz-ctl"><p class="pz-h">O vídeo analisado pela IA, na tela da família (compartilhe com áudio)</p><div class="pz-mode"><button data-seek="0" data-vid="v-dossie">Do início</button><button data-a="som" data-vid="v-dossie">Som</button><button data-a="vpause">Pausar</button></div><p class="pz-small">O vídeo começa mudo: Som liga o áudio. Espaço no deck também dá play e pausa.</p></div>`;
        else {
          const ch = qsa('.chapters li', slides[cur]).map(li => [li.dataset.t, qs('.tm', li).textContent, qs('.ct', li).textContent]);
          const atleta = vid === 'v-atleta', d = derived();
          h = `<div class="pz-ctl"><p class="pz-h">${atleta ? 'O vídeo do atleta na tela da família: clique num lance e o vídeo pula pra ele (2 s antes)' : 'Vídeo na tela da família (compartilhe com áudio)'}</p><div class="pz-mode">${atleta ? '<button data-seek="0" data-vid="v-atleta">Do início</button>' : ''}${ch.map(c => `<button data-seek="${c[0]}" data-vid="${vid}">${esc(c[1])} · ${esc(c[2])}</button>`).join('')}${atleta ? '<button data-a="som">Som</button>' : ''}<button data-a="vpause">Pausar</button></div>` +
            (atleta ? (d.leituraOk ? `<p class="pz-small"><b>Fonte desta leitura: ${d.leituraFonte === 'zyron' ? 'o Zyron' : 'a equipe'}.</b> ${d.leituraFonte === 'zyron' ? 'Pode dizer que o Zyron leu.' : 'Diga "a nossa equipe leu o seu vídeo". Não diga que o Zyron leu: esses lances foram marcados à mão.'} O vídeo começa mudo: Som liga o áudio.</p>` : '<p class="pz-small"><b>Só o vídeo, sem lances:</b> a tela mostra "Leitura em preparação". Marque os lances no painel (Leitura do atleta) e recarregue o deck.</p>') : '') + '</div>';
        }
      } else if (slides[cur].dataset.videoSe) {
        h = derived().dsV ? '<div class="pz-ctl"><p class="pz-h">O vídeo analisado entra no próximo slide (o dossiê, 18)</p><p class="pz-say">Com "Tenho o vídeo do jogador" ligado e sem lances marcados, o 17 é a ponte: "agora é com o seu". Não rode a leitura no Meet: avance e dê o play no dossiê.</p></div>'
          : '<div class="pz-ctl warn"><p class="pz-h">Sem vídeo do atleta no painel</p><p class="pz-say">O 17 está na leitura ao vivo, como sempre: troque o compartilhamento pro vídeo dele no Meet. Pra mostrar o jogo dele lance a lance, suba o vídeo na Leitura do atleta, no painel.</p></div>';
      }
      if (cur <= 1) h = `<div class="pz-ctl"><p class="pz-h">Origem do lead (muda o texto na tela)</p><div class="pz-mode">${[['Zyron', 'Zyron'], ['Formulário do Instagram', 'Formulário'], ['Frio, sem vídeo', 'Sem contexto']].map(([v, l]) => `<button data-origem="${esc(v)}" class="${o === v ? 'on' : ''}">${l}</button>`).join('')}</div></div>`;
      // os planos são também o slide do número: o último avanço destaca o plano da ficha; trocar aqui move o destaque na tela
      if (cur === MATRIZ) {
        // a fala vem do plano da ficha, sem link no deck
        const p = planoDe(ficha.plano) || {};
        const fala = fill('"[pai], [mãe], o investimento no [plano] é de [preço], em 10x sem juros de [parcela]."');
        h = `<div class="pz-ctl"><p class="pz-h">Fale o número e pare</p><p class="pz-say">${fala}</p><p class="pz-small"><b>Na tela, os três planos; o último avanço destaca:</b> ${esc(p.nome || '')}, ${esc(p.preco || '')} vitalício e 10x sem juros de ${esc(p.parcela || '')}. Link de pagamento: fora do deck, pelo WhatsApp, só depois do sim.</p></div>` +
          planoCtl('Plano da ficha (o último avanço destaca na tela como a sua recomendação). Trocar de plano é pelo escopo, nunca por desconto');
      }
      // o dossiê (18): o que está na tela agora; vazio, as setas passam direto. O inimigo em comum (19): os números da família
      if (slides[cur].classList.contains('ds-slide')) {
        const d = derived();
        h += d.dsMostra ? `<div class="pz-ctl"><p class="pz-h">No dossiê agora</p><p class="pz-say">${esc(d.dsResumo)}. Embaixo da foto: ${esc((d.dsDados || []).map(x => x[0].toLowerCase()).join(', ') || 'nenhum dado')}.</p><p class="pz-small">Oportunidades são clubes que procuram esse perfil, mapeados pela equipe: nunca diga que o clube já pediu o [atleta] nem prometa vaga, clube ou prazo.</p></div>`
          : '<div class="pz-ctl warn"><p class="pz-h">Dossiê vazio: as setas passam direto por ele</p><p class="pz-say">Pra ele aparecer: no painel, ligue "Tenho o vídeo do jogador" e suba o vídeo analisado ou o mapa de calor, ou preencha as oportunidades. Depois, Atualizar do painel.</p></div>';
      }
      if (slides[cur].classList.contains('in-slide')) {
        const d = derived(), nums = [d.inPeneirasTxt, d.inGasto ? d.inGasto + ' gastos' : '', d.inAnosTxt ? d.inAnosTxt + ' tentando' : ''].filter(Boolean);
        h += `<div class="pz-ctl"><p class="pz-h">O preço de procurar no escuro</p><p class="pz-say">${nums.length ? 'Na tela, os números da família: ' + esc(nums.join(', ')) + '. Eles contam do zero quando o slide entra.' : 'Sem números no painel: a tela mostra a conta sem números (inscrição, viagem, o dia de trabalho, a espera). Pergunte e anote no painel, em As peneiras dele.'}</p></div>`;
      }
      // o campo (12) e a miniatura (35) dependem da posição da ficha
      const campo = qs('[data-campo]', slides[cur]);
      if (campo) {
        const d = derived(), pos = str(ficha.posicao);
        h += d.posId
          ? `<div class="pz-ctl"><p class="pz-h">O campo na tela</p><p class="pz-say">${esc(pos)}: marcado como ${esc(d.posId.split('-')[0])}${d.peTxt || d.alturaTxt ? '' : '. Pé e altura vazios: o cartão mostra só o resto'}.</p></div>`
          : `<div class="pz-ctl warn"><p class="pz-h">${campo.dataset.campo === 'mini' ? 'A miniatura do campo não aparece' : 'O campo está sem destaque'}</p><p class="pz-say">Preencha a posição na ficha (aba Ficha, grupo Atleta).${pos ? ` "${esc(pos)}" não casa com nenhum marcador: escreva como goleiro, lateral direito, zagueiro, volante, meia, ponta esquerda ou atacante.` : ''}</p></div>`;
      }
      // slide com revelação item a item: o que está na tela e o que entra no próximo avanço
      const total = stepsIn(cur);
      if (total) {
        const s = curStep == null ? total : curStep;
        // texto do que entra no próximo avanço, sem os itens de outros passos que estão dentro dele; a soma vem à parte.
        // Só conta o que está ligado na tela (data-if); data-passo, se houver, dá o nome curto do avanço
        const texto = e => { const c = e.cloneNode(true); qsa('[data-step], [data-soma]', c).forEach(x => x.remove()); qsa('b', c).forEach(x => x.before(' ')); return c.textContent.replace(/\s+/g, ' ').trim(); };
        const visivel = e => !e.closest('[data-if]:not(.on), [data-ifnot].off');
        const proxEls = s < total ? qsa('[data-step="' + (s + 1) + '"]', slides[cur]).filter(visivel) : [];
        const passos = proxEls.map(e => e.dataset.passo).filter(Boolean);
        let prox = passos.length ? passos.join(' · ') : proxEls.filter(e => !e.classList.contains('legal') && !e.querySelector('[data-soma]')).map(texto).filter(Boolean).join(' · ').slice(0, 160);
        if (s < total && qs('[data-soma]', slides[cur])) prox += ' · soma na tela: ' + brl(somaAte(slides[cur], s + 1)) + ' por ano';
        h += `<div class="pz-ctl"><p class="pz-h">Revelação item a item · ${s} de ${total} na tela</p><p class="pz-say">${s < total ? 'Próximo avanço (→ ou espaço): ' + esc(prox) : 'Tudo na tela. O próximo avanço vai pro próximo slide.'}</p></div>`;
      }
      box.innerHTML = h;
    }
    app.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.origem != null) { save({ origem: b.dataset.origem }); syncForm(); return; }
      if (b.dataset.obj != null) { openObj(b.dataset.obj); return; }
      if (b.dataset.planoTroca != null) { trocarPlano(b.dataset.planoTroca); return; }
      if (b.dataset.go != null) { send({ t: 'goto', i: parseInt(b.dataset.go, 10) }); return; }
      if (b.dataset.seek != null) { send({ t: 'seek', id: b.dataset.vid, slide: cur, time: parseFloat(b.dataset.seek) }); return; }
      const a = b.dataset.a;
      if (a === 'vpause') send({ t: 'pause' });
      if (a === 'som') send({ t: 'som', id: b.dataset.vid || 'v-atleta' });
      if (a === 'prev') send({ t: 'prev' });
      if (a === 'next') send({ t: 'next' });
      if (a === 'timer') toggleTimer();
      if (a === 'treset') { elapsed = 0; timerOn = false; qs('#pz-tbtn').textContent = 'Iniciar'; tick(); }
      if (a === 'silence') toggleSilence();
      if (b.dataset.tab) { qsa('.pz-tabs button').forEach(x => x.classList.toggle('on', x === b)); qsa('.pz-tab').forEach(x => x.classList.toggle('on', x.id === 'tab-' + b.dataset.tab)); }
    });

    function show(i, s) {
      cur = i; curStep = s == null ? null : s;
      qs('#pz-pos').textContent = posLabelPz();
      mountThumbs();
      renderNotes(); renderCtl();
      if (!timerOn && !elapsed && cur > 0) toggleTimer();
    }
    function refreshAll(d) {
      d = d || derived();
      renderNotes(); renderCtl(); renderLer(d); renderObjBtns(); renderFech();
      qs('#pz-pos').textContent = posLabelPz();
      mountThumbs();
    }
    // "Próximo": o próximo item do mesmo slide, enquanto houver; depois, o próximo slide
    function mountThumbs() {
      const total = stepsIn(cur), s = curStep == null ? total : curStep;
      mountThumb(qs('#pz-cur'), cur, s);
      if (s < total) mountThumb(qs('#pz-next'), cur, s + 1);
      else { const prox = vizinho(cur + 1, 1); mountThumb(qs('#pz-next'), prox >= 0 ? prox : null, 0); }
    }
    function posLabelPz() {
      const total = stepsIn(cur), s = curStep == null ? total : curStep;
      return posLabel(cur) + (total ? ' · ' + s + '/' + total : '');
    }
    window.addEventListener('resize', mountThumbs);

    /* ----- cronômetro e silêncio ----- */
    let timerOn = false, elapsed = 0, t0 = 0;
    function tick() {
      const s = Math.floor((elapsed + (timerOn ? Date.now() - t0 : 0)) / 1000);
      const el = qs('#pz-time');
      el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
      el.classList.toggle('mid', s > DADOS.duracao * 60 && s <= 60 * 60);
      el.classList.toggle('late', s > 60 * 60);
      if (silOn) { const q = Math.floor((Date.now() - silStart) / 1000); qs('#pz-sil').textContent = 'Silêncio: ' + Math.floor(q / 60) + ':' + String(q % 60).padStart(2, '0'); }
    }
    function toggleTimer() { if (timerOn) { elapsed += Date.now() - t0; timerOn = false; } else { t0 = Date.now(); timerOn = true; } qs('#pz-tbtn').textContent = timerOn ? 'Pausar' : 'Iniciar'; }
    setInterval(tick, 250);
    let silOn = false, silStart = 0, silReturn = null;
    function toggleSilence() {
      const b = qs('#pz-sil');
      if (!silOn) {
        silOn = true; silStart = Date.now(); silReturn = null; b.classList.add('on');
        // nos pontos de pergunta e silêncio do roteiro (03 e 17, campo silencio), conta ali mesmo; de qualquer outro slide,
        // o Silêncio leva ao momento do número (33, data-silencio), sem revelar o que vem depois dele, e volta quando para
        const aqui = cur === SILENCE_SLIDE || !!(ROT[cur] && ROT[cur].silencio);
        if (!aqui) { silReturn = cur; const ps = parseInt(slides[SILENCE_SLIDE].dataset.silencio, 10); send({ t: 'goto', i: SILENCE_SLIDE, step: Number.isFinite(ps) ? ps : undefined }); }
      }
      else { silOn = false; b.classList.remove('on'); b.textContent = 'Silêncio (S)'; if (silReturn != null) send({ t: 'goto', i: silReturn }); silReturn = null; }
    }
    document.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); toggleSilence(); }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); send({ t: 'next' }); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); send({ t: 'prev' }); }
    });

    /* ----- ficha ----- */
    const F = [
      ['Atleta (a família vê)', [
        ['nome', 'Nome completo do atleta', 'text', 'Vai na capa (Montado para). A tela usa o nome e o último sobrenome daqui (João Pedro da Silva vira João Pedro Silva); com o link, a escolha "Nome na tela" do painel pode mudar isso'],
        ['apelido', 'Como a gente chama ele', 'text', 'Vazio: a tela usa nome e sobrenome e a fala, o primeiro nome. Escreva só se for outro jeito (Joãozinho, ou Lucas Almeida)'], ['idade', 'Idade', 'number'],
        ['posicao', 'Posição', 'text', 'Desenha o campo do slide 12 (e a miniatura do 35). Ex.: goleiro, lateral direito, zagueiro, volante, meia, ponta esquerda, atacante. Posição que o deck não reconhece: o campo fica sem destaque'], ['cidade', 'Cidade', 'text'],
        ['pe', 'Pé', 'select', 'Cartão do slide 12. Vazio: a linha some', ['', 'Destro', 'Canhoto', 'Ambidestro']],
        ['altura', 'Altura (cm)', 'number', 'Cartão do slide 12 e dossiê (18), em metros. Vazio: a linha some'],
        ['categoria', 'Categoria', 'text', 'Dossiê (18), embaixo da foto. Ex.: Sub-17'], ['clubeAtual', 'Onde joga hoje', 'text', 'Dossiê (18), embaixo da foto. Ex.: Sub-17 do Vasco'],
        ['origem', 'Origem do lead', 'select', 'Muda os slides 01 e 02: Zyron (o Zyron viu), formulário (a história dele) ou sem contexto', ORIGENS],
        ['caracteristicas', 'O que chamou atenção no Zyron', 'text', 'Do Contexto do CRM. Aparece no 02 se veio do Zyron'],
        ['experiencia', 'Experiência que ele contou no formulário', 'text', 'Do Contexto do CRM. Ex.: Sub-15 do América de Natal. Aparece no 02 se veio do formulário']
      ]],
      ['Alinhamento (só o sonho aparece na tela, no 04)', [
        ['sonho', 'Sonho do atleta', 'text', 'Vira o destino do plano (04)'], ['falta', 'O que ele acha que falta', 'text'], ['dor', 'Dor da família (palavras deles)', 'area'],
        ['treina', 'Treina hoje', 'text'], ['locomocao', 'Locomoção pra outro estado', 'text'],
        ['trabalhar', 'Primeiro foco do plano', 'text', 'Você define, a partir do vídeo e do Zyron. Aparece no 04']
      ]],
      ['Equipe', [
        ['gestor', 'Seu nome (Gestor)', 'text', 'Só na mensagem de confirmação'], ['gerente', 'Gerente de carreira', 'text'], ['analista', 'Analista de performance', 'text'],
        // os prazos são de lista fixa (window.PRAZOS): só o que a operação cumpre; texto antigo fora da lista não vai pra tela
        ['prazoContato', 'Quando o gerente entra em contato', 'select', 'Lista fixa: só o que a operação cumpre', [''].concat((window.PRAZOS || {}).contato || [])],
        ['prazoZyron', 'Quando o Zyron começa', 'select', 'Lista fixa: só o que a operação cumpre', [''].concat((window.PRAZOS || {}).zyron || [])]
      ]],
      ['Caso espelho (a família vê no 22)', [
        ['casoNome', 'Atleta nosso com o mesmo perfil', 'text', 'O "ele me lembra muito você". Só caso real: tabela do CASOS.md ou publicado na AGN. Vazio: o quadro some do 22'],
        ['casoClube', 'Clube que ele fechou', 'text', 'Ex.: Wigan Athletic'], ['casoPais', 'País do clube', 'text', 'Ex.: Inglaterra'],
        ['casoLink', 'Link da publicação dele na AGN', 'text', 'Pra mandar no WhatsApp na hora em que você fala o nome']
      ]],
      ['Contrato, garantia e AGN', [
        ['faixaContrato', 'Quanto um atleta nosso fecha', 'text', 'Aparece no 31, seguido de "por mês". Padrão: R$ 20 a 30 mil+. Só o que vocês comprovam com contrato'],
        ['garantiaPrazo', 'Prazo da garantia (se houver)', 'text', 'Ex.: nos primeiros 7 dias. Vazio: a linha some do 34'],
        ['linkAgn', 'Link da AGN Football', 'text', 'Pra mandar no WhatsApp durante os slides 22 e 23']
      ]],
      ['Turma e investimento', [
        ['vagas', 'Vagas restantes (número real da semana)', 'number', 'Só no Legacy (20, 30 e 32)'], ['proximaTurma', 'Próxima turma abre em', 'text', 'Só no Legacy (32)'],
        ['plano', 'Plano que vou recomendar', 'select', 'A tela da família mostra este plano: o destaque e o número do 33 e o 35 (turma e vaga só no Legacy). Regra da casa: Legacy se a ficha não mostra aperto financeiro; Assessoria PRO se a dor financeira é forte ou na objeção de caixa depois do Legacy; Scouting só se o caixa não comporta o PRO. Vazio ou nome antigo: a tela mostra o Legacy', [''].concat(PLANOS.map(p => p.nome))],
        ['horaRetorno', 'Hora do retorno (Modo B)', 'text', 'Ex.: 19h']
      ]],
      ['Peneiras (a família vê no 19)', [
        ['peneirasFeitas', 'Peneiras que ele já fez', 'number', 'O quadro do preço de procurar no escuro (19). Vazio: a conta sem números'],
        ['gastoPeneiras', 'Quanto já gastaram com peneiras (R$)', 'number'], ['anosTentando', 'Há quantos anos ele tenta', 'number']
      ]],
      ['Da R1 (só você vê)', [
        ['responsavel', 'Quem fala pela família', 'text'], ['pai', 'Pai', 'text'], ['mae', 'Mãe', 'text'], ['outro', 'Outro responsável', 'text'],
        ['decisores', 'Decisores e como decidem', 'area'], ['telefones', 'Telefones dos decisores', 'text'], ['dadosZyron', 'Dados do Zyron', 'area'],
        ['times', 'Times e experiências', 'area'], ['peneiras', 'Peneiras e avaliações', 'area', 'Falado no 03 (o olhômetro), no 15, no 16 e no 19'], ['investido', 'Já investiram (a régua, só falada)', 'text'],
        ['lucro', 'Respondeu que não faz sentido a gente lucrar em cima', 'check'], ['precomp', 'Pré-compromisso de decidir na R2', 'check'], ['empolgacao', 'Empolgação do atleta (0 a 10)', 'number'],
        ['objecoes', 'Objeções que apareceram', 'area'], ['budget', 'Sinais de budget', 'area'], ['confirmados', 'Todos os decisores confirmados', 'check'], ['r2dia', 'R2: dia', 'text'], ['r2hora', 'R2: hora', 'text']
      ]],
      ['Resultado da R2', [
        ['resultado', 'Resultado', 'select', '', ['', 'Venda', 'Retorno marcado', 'Ainda não']], ['mudou', 'O que mudou desde a R1', 'area'], ['aspiracao', 'Aspiração do atleta (palavras dele)', 'text'],
        ['planoFechado', 'Plano fechado', 'select', 'Produto e ticket vão pro CRM e pro cadastro em Vendas', [''].concat(PLANOS.map(p => p.nome))], ['objecoesR2', 'Objeções na R2', 'area'], ['proximoContato', 'Próximo contato', 'text'],
        ['indicacao', 'Indicação (contato do responsável)', 'text'], ['observacoes', 'Observações', 'area']
      ]]
    ];
    const tf = qs('#tab-ficha');
    function fieldHtml([id, lab, type, hint, opts]) {
      const v = ficha[id] == null ? '' : ficha[id];
      if (type === 'check') return `<label class="ck"><input type="checkbox" id="f-${id}"${v === true ? ' checked' : ''}> ${lab}</label>`;
      let input;
      if (type === 'area') input = `<textarea id="f-${id}" rows="2">${esc(v)}</textarea>`;
      else if (type === 'select') {
        // valor antigo, digitado antes da lista, continua visível
        const all = v !== '' && opts.indexOf(v) < 0 ? opts.concat([v]) : opts;
        input = `<select id="f-${id}">${all.map(o => `<option value="${esc(o)}"${o === v ? ' selected' : ''}>${esc(o || 'escolha')}</option>`).join('')}</select>`;
      }
      else input = `<input id="f-${id}" type="${type === 'number' ? 'number' : 'text'}" value="${esc(v)}">`;
      return `<label><span>${lab}</span>${input}${hint ? `<small>${hint}</small>` : ''}</label>`;
    }
    tf.innerHTML = `
      <p class="pz-small" id="pz-painel" hidden></p>
      ${AID ? '<p class="pz-small" id="pz-status" style="margin:4px 0 8px"></p><div class="pz-actions" style="margin:0 0 14px"><button id="pz-atualizar" class="ghost" title="Busca de novo no painel a foto, o nome e a ficha deste link">Atualizar do painel</button></div>' : ''}
      <fieldset class="pz-import"><legend>Importar a ficha da R1</legend>
        <label><span>Cole aqui a ficha do CRM (R1)</span><textarea id="imp-txt" placeholder="O texto do botão Copiar ficha pro CRM da R1"></textarea></label>
        <div class="pz-actions"><button id="imp-go">Ler ficha</button></div>
        <div id="imp-out"></div>
      </fieldset>
      ${F.map(([g, fields]) => `<fieldset><legend>${g}</legend>${fields.map(fieldHtml).join('')}</fieldset>`).join('')}
      <div class="pz-actions"><button id="f-crm">Copiar resultado pro CRM</button><button id="f-dia">Copiar resumo do mesmo dia</button>${AID ? '<button id="pz-encerrar" class="ghost" title="Apaga a ficha deste link deste navegador, avisa o painel e fecha o apresentador">Encerrar e limpar</button>' : '<button id="f-clear" class="ghost">Nova call (limpar ficha)</button>'}</div>
      <p class="pz-small">Copie pro CRM antes de limpar. A ficha guarda dados de menor só neste navegador${AID ? ' e sai sozinha depois de 12 horas sem uso. O link continua valendo pra família rever até a validade' : ''}.</p>`;
    const onField = e => {
      const t = e.target;
      if (!t.id || t.id.indexOf('f-') !== 0) return;
      const id = t.id.slice(2);
      const antes = planoDe(ficha.plano);
      ficha[id] = t.type === 'checkbox' ? t.checked : t.value;
      // trocar o plano pela ficha também mostra o que sai ou o que entra (no 33 e no Fechamento)
      if (id === 'plano') { const depois = planoDe(ficha.plano); if (antes && depois && antes !== depois) troca = { de: antes, para: depois }; }
      if (id === 'resultado' && t.value === 'Venda' && !str(ficha.planoFechado) && planoPorNome(ficha.plano)) { ficha.planoFechado = ficha.plano; setVal('planoFechado', ficha.plano); }
      save();
    };
    tf.addEventListener('input', onField); tf.addEventListener('change', onField);

    function setVal(id, v) { const el = qs('#f-' + id); if (!el) return; if (el.type === 'checkbox') el.checked = v === true; else el.value = v == null ? '' : v; }
    function syncForm() { F.forEach(([, fields]) => fields.forEach(f => setVal(f[0], ficha[f[0]]))); }

    /* importar a ficha da R1 */
    const LINHAS = {
      'Origem': ['origem', 'Origem'], 'Dados do Zyron': ['dadosZyron', 'Dados do Zyron'],
      'Características que chamaram atenção (Zyron)': ['caracteristicas', 'O que chamou atenção no Zyron'],
      'Experiência que ele contou (formulário)': ['experiencia', 'Experiência do formulário'],
      'Mora em': ['cidade', 'Cidade'], 'Decisores e como decidem': ['decisores', 'Decisores'], 'Telefones dos decisores': ['telefones', 'Telefones'],
      'Treina hoje': ['treina', 'Treina hoje'], 'Times e experiências': ['times', 'Times'], 'Peneiras e avaliações': ['peneiras', 'Peneiras'],
      'Sonho do atleta': ['sonho', 'Sonho'], 'O que ele acha que falta': ['falta', 'O que falta'], 'Dor da família (palavras deles)': ['dor', 'Dor'],
      'Já investiram': ['investido', 'Já investiram'], 'Locomoção pra outro estado': ['locomocao', 'Locomoção'],
      'Objeções que apareceram': ['objecoes', 'Objeções'], 'Sinais de budget': ['budget', 'Sinais de budget']
    };
    qs('#imp-go').addEventListener('click', () => {
      const txt = qs('#imp-txt').value || '';
      const got = [];
      const put = (k, v, lab) => { v = String(v == null ? '' : v).trim(); if (v === '') return; ficha[k] = v; got.push([lab || k, v]); };
      const yes = (k, v, lab) => { const t = String(v || '').trim().toLowerCase(); if (t === 'sim' || t === 'não' || t === 'nao') { ficha[k] = t === 'sim'; got.push([lab, t]); } };
      txt.split(/\r?\n/).forEach(line => {
        const i = line.indexOf(':'); if (i < 0) return;
        const lab = line.slice(0, i).trim(), val = line.slice(i + 1).trim();
        if (LINHAS[lab]) put(LINHAS[lab][0], val, LINHAS[lab][1]);
        else if (lab === 'Atleta') {
          const p = val.split(',').map(x => x.trim());
          put('nome', p[0], 'Nome'); put('idade', (p[1] || '').replace(/\D/g, ''), 'Idade'); put('posicao', p[2], 'Posição'); put('pe', (p[3] || '').replace(/^pé\s*/i, ''), 'Pé');
        }
        else if (lab === 'Pai') {
          const m = /^(.*?)\s*\|\s*Mãe:\s*(.*?)\s*\|\s*Outro responsável:\s*(.*)$/.exec(val);
          if (m) { put('pai', m[1], 'Pai'); put('mae', m[2], 'Mãe'); put('outro', m[3], 'Outro responsável'); } else put('pai', val, 'Pai');
        }
        else if (lab.indexOf('Empolgação') === 0) put('empolgacao', val, 'Empolgação');
        else if (lab === 'R2') {
          const parts = val.split('|'); const when = (parts[0] || '').trim();
          const m = /^(.*?)\s*(\d{1,2}\s*[h:]\s*\d{0,2})\s*$/i.exec(when);
          if (m) { put('r2dia', m[1].replace(/,\s*$/, ''), 'R2: dia'); put('r2hora', m[2], 'R2: hora'); } else put('r2dia', when, 'R2: dia');
          const c = /confirmados\?\s*(sim|não|nao)/i.exec(val); if (c) yes('confirmados', c[1], 'Decisores confirmados');
        }
      });
      // perguntas de sim ou não, que não têm dois-pontos
      const YN = [['Respondeu', 'lucro', 'Não faz sentido lucrar em cima'], ['Pré-compromisso', 'precomp', 'Pré-compromisso']];
      txt.split(/\r?\n/).forEach(line => {
        const m = /^(.*\?)\s*(sim|não|nao)\s*$/i.exec(line.trim()); if (!m || /^R2:/.test(line.trim())) return;
        const y = YN.find(x => m[1].indexOf(x[0]) === 0); if (y) yes(y[1], m[2], y[2]);
      });
      syncForm(); save();
      qs('#imp-out').innerHTML = got.length ? `<div class="pz-read-out"><p class="pz-h">Conferência: o que foi lido</p>${got.map(g => `<div><b>${esc(g[0])}:</b> ${esc(g[1])}</div>`).join('')}<p class="pz-small">Confira o que vai pra tela (origem, o que chamou atenção, experiência, sonho, dor) e defina o primeiro foco do plano.</p></div>` : '<p class="pz-small">Nenhuma linha reconhecida. Cole o texto do botão "Copiar ficha pro CRM" da R1.</p>';
    });

    const copy = (txt, btn, label) => {
      const done = () => { btn.textContent = 'Copiado'; setTimeout(() => { btn.textContent = label; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, () => fallback(txt, done)); else fallback(txt, done);
    };
    const fallback = (txt, done) => {
      const ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      if (ok) done(); else window.prompt('Não deu pra copiar sozinho. Copie daqui (Ctrl+C):', txt);
    };
    const plain = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    const resumoDia = () => plain(fill(window.FOLLOWUP.nao[0][1])).replace(/^"|"$/g, '');
    function crmText() {
      const d = derived(); const f = k => str(ficha[k]);
      const pf = planoPorNome(ficha.planoFechado);
      return [
        'Resultado da R2: ' + f('resultado'),
        'Atleta: ' + f('nome') + ', ' + d.idade + ', ' + f('posicao') + ', ' + f('cidade') + (d.peTxt ? ', ' + d.peTxt : '') + (d.alturaTxt ? ', ' + d.alturaTxt : ''),
        'Origem: ' + f('origem'),
        'O que mudou desde a R1: ' + f('mudou'),
        'Aspiração do atleta: ' + f('aspiracao'),
        'Primeiro foco do plano: ' + f('trabalhar'),
        'Plano fechado: ' + f('planoFechado') + (pf ? ' · ' + pf.ticket : ''),
        'Objeções na R2: ' + f('objecoesR2'),
        'Próximo contato: ' + f('proximoContato'),
        'Retorno combinado: ' + f('horaRetorno'),
        'Indicação: ' + f('indicacao'),
        'Observações: ' + f('observacoes')
      ].join('\n');
    }
    qs('#f-crm').addEventListener('click', e => copy(crmText(), e.target, 'Copiar resultado pro CRM'));
    qs('#f-dia').addEventListener('click', e => copy(resumoDia(), e.target, 'Copiar resumo do mesmo dia'));
    // sem link: limpar a ficha pra próxima call. Com link: "Encerrar e limpar" (mais abaixo, junto da presença)
    if (qs('#f-clear')) qs('#f-clear').addEventListener('click', () => {
      if (!confirm('Limpar a ficha desta call? Copie pro CRM antes de limpar.')) return;
      ficha = {}; troca = null; store.set(FKEY, ficha); send({ t: 'ficha', ficha });
      syncForm(); qs('#imp-out').innerHTML = ''; qs('#imp-txt').value = '';
      refreshAll(applyBind(document));
    });

    /* ----- ler antes ----- */
    const LER = [
      ['Foto do atleta (painel)', 'fotoTxt', '01, 02, 12, 18, 27 e 35 (grande); 09, 11, 23, 32 e 34 (pequena); sem foto, a inicial do nome no mesmo lugar'],
      ['Nome na tela (nome e sobrenome)', 'nome', '01, 02, 04, 09, 10, 11, 12, 13, 14, 17, 18, 19, 22, 23, 24, 25, 26, 27, 29, 30, 32, 33, 34 e 35 (e o selo de dossiê no canto)'], ['Como chamar (apelido)', 'apelido', 'no lugar do nome e sobrenome da tela e da fala; vazio: a tela usa nome e sobrenome e a fala, o primeiro nome'],
      ['Nome completo', 'nomeCompleto', '01 (Montado para), 31 (o contrato de exemplo) e 35 (o anúncio e o cartão do plano)'], ['Dia e hora da call', 'r2dia&r2hora', '01 (Call de ...)'],
      ['Origem do lead', 'origem', '01 e 02 (muda o texto)'],
      ['O que chamou atenção no Zyron', 'caracteristicas', '02, se veio do Zyron'], ['Experiência do formulário', 'experiencia', '02, se veio do formulário'],
      ['Posição, idade, cidade', 'posicao|idade|cidade', '02, 04, 18 (embaixo da foto, no dossiê) e o cartão do 12'], ['Posição que desenha o campo', 'posCampo', '12 (o campo) e 35 (a miniatura); vazio: campo sem destaque'],
      ['Pé e altura', 'peTxt|alturaTxt', 'cartão do 12 e 18 (embaixo da foto); vazio: a linha some'], ['Categoria e onde joga', 'categoria|clubeAtual', '18 (embaixo da foto, no dossiê); vazio: some'],
      ['Sonho do atleta', 'sonho', '04 e 18 (o destino do plano de carreira)'], ['O que falta', 'falta', 'só falado'],
      ['Dor com as palavras deles', 'dor', 'só falado'], ['Treina hoje', 'treina', 'só falado'], ['Locomoção', 'locomocao', 'só falado'], ['Primeiro foco do plano', 'trabalhar', '04, 18 (o "agora" do plano de carreira), falado no 08 e o primeiro foco do relatório do 17'],
      ['Vídeo e leitura do painel', 'leituraResumo', '17 (o jogo dele, lance a lance), 01 (o quadro na capa, sem foto), 04 e 09 (o quadro no cartão do vídeo); sem vídeo, o 17 é a leitura ao vivo'],
      ['O dossiê do atleta (painel)', 'dsResumo', '18: o vídeo analisado pela IA, o mapa de calor embaixo dele e as oportunidades; vazio, as setas passam direto pelo 18. Com o vídeo analisado e sem lances marcados, o 17 fica de ponte'],
      ['Peneiras, gasto e anos tentando (painel)', 'inPeneirasTxt|inGasto|inAnosTxt', '19 (o preço de procurar no escuro, contando do zero na tela); vazio: a conta sem números'],
      ['Peneiras que ele fez', 'peneiras', '03, 15, 16 e 19, só falado'], ['Caso espelho (nome, clube, país)', 'casoNome&casoClube', '02 (plantar), 22 (tela), 31 e 35'], ['Link do caso espelho', 'casoLink', '22, no WhatsApp'],
      ['Link da AGN', 'linkAgn', '22 e 23, no WhatsApp'], ['Já investiram (régua)', 'investido', '28, só falado'],
      ['Não faz sentido lucrar em cima', 'lucro', '31, só falado'], ['Quanto um atleta nosso fecha', 'faixaContrato', '31'], ['Prazo da garantia', 'garantiaPrazo', '34 (vazio: some)'],
      ['Plano que vou recomendar', 'plano', '11 (o selo "O seu plano"), 23 (a linha do plano e o "pronto pra encaminhar"), 27 (o que ele leva), 33 (o investimento de cada um, o destaque no último avanço e o número falado), 34 (os três valores de uma vez) e 35; turma e vaga (20, 30 e 32) só no Legacy; vazio mostra o Legacy'],
      ['Vagas e próxima turma', 'vagas', '32, só no Legacy'], ['Gerente de carreira', 'gerente', '35, só no Legacy (e falado no 32 e no 33)'],
      ['Prazos confirmados (lista fixa)', 'prazoContato&prazoZyron', '27 (o tempo), 32 e 35 (o contato do gerente, só no Legacy)'], ['Hora do retorno', 'horaRetorno', '33, Modo B']
    ];
    function renderLer(d) {
      d = d || derived();
      const shown = k => k.split(/[|&]/).map(x => { const v = d[x]; return v === true ? 'sim' : filled(v) ? String(v) : ''; }).filter(Boolean).join(' · ');
      qs('#tab-ler').innerHTML = `
        <table class="pz-read"><tr><th>O que ler na ficha</th><th>Valor agora</th><th>Onde usar</th></tr>
        ${LER.map(r => { const ok = cond(r[1], d); return `<tr><td>${esc(r[0])}</td><td class="${ok ? 'ok' : 'miss'}">${ok ? esc(shown(r[1])) : 'falta'}</td><td>${esc(r[2])}</td></tr>`; }).join('')}</table>
        <fieldset style="margin-top:12px"><legend>10 minutos antes da call</legend>${(window.CHECKLIST || []).map((c, k) => `<label class="ck"><input type="checkbox" data-chk="${k}"${ficha['chk' + k] ? ' checked' : ''}> ${esc(c)}</label>`).join('')}</fieldset>
        <div class="pz-actions"><button id="f-conf">Copiar mensagem de confirmação</button></div>`;
      qsa('[data-chk]', qs('#tab-ler')).forEach(c => c.addEventListener('change', () => { ficha['chk' + c.dataset.chk] = c.checked; store.set(FKEY, ficha); }));
      qs('#f-conf').addEventListener('click', e => {
        const t = (first(ficha.pai) || '[pai]') + ', aqui é o ' + (str(ficha.gestor) || '[seu nome]') + ', gestor de carreiras. Tô com o planejamento de carreira do ' + (d.nomeCurto || '[atleta]') + ' pronto pra nossa conversa das ' + (str(ficha.r2hora) || '[hora]') + '. Você, a ' + (first(ficha.mae) || '[mãe]') + ' e ele confirmados?';
        copy(t, e.target, 'Copiar mensagem de confirmação');
      });
    }

    /* ----- objeções ----- */
    qs('#tab-obj').innerHTML = `<div class="pz-method">${(window.METODO_OBJECAO || []).map(m => `<span>${esc(m)}</span>`).join('')}</div><p class="pz-small">${esc(window.PROIBIDO_OBJECAO || '')}</p>
      <div id="obj-list"></div>`;
    function renderObjBtns() {
      qs('#obj-list').innerHTML = (window.OBJECOES || []).map((o, k) => `<details class="pz-obj" data-k="${k}"><summary>${esc(o.q)}</summary>${o.prev ? `<p class="pz-small"><b>Prevenção:</b> ${fill(o.prev)}</p>` : ''}${list(o.resposta)}${o.proibido ? `<p class="pz-small"><b>Proibido:</b> ${esc(o.proibido)}</p>` : ''}<div class="pz-chips">${o.slides.filter(n => n >= 1 && n <= N).map(n => `<button data-go="${n - 1}">Slide ${String(n).padStart(2, '0')} · ${esc(ROT[n - 1] ? ROT[n - 1].nome : '')}</button>`).join('')}</div></details>`).join('');
    }

    /* ----- fechamento ----- */
    function renderFech() {
      const r = ROT[VAGA] || {};
      const p = planoDe(ficha.plano) || {}, n2 = i => String(i + 1).padStart(2, '0');
      qs('#tab-fech').innerHTML = `
        <div class="pz-chips">${TURMA >= 0 ? `<button data-go="${TURMA}">${p.turma ? 'A vaga' : 'O começo'} (${n2(TURMA)})</button>` : ''}${MATRIZ >= 0 ? `<button data-go="${MATRIZ}">Os planos e o número (${n2(MATRIZ)})</button>` : ''}<button data-a="silence">Silêncio (S)</button><button data-go="${N - 1}">Bem-vindo (${n2(N - 1)})</button></div>
        ${PLANOS.length ? `<div class="pz-sec plano"><p class="pz-h">Plano na tela da família (33 e 35)</p>
          <div class="pz-plan on"><div class="pz-plan-hd"><p class="pz-plan-nm">${esc(p.nome || '')}</p><b class="pz-plan-tk">${esc(p.ticket || '')}</b></div><p class="pz-plan-ds">${esc(p.descritor || '')} · ${/^A cada \d+ dias$/i.test(p.ritmo || '') ? '' : esc(p.ritmo || '') + ' · '}${esc(p.preco || '')} vitalício, 10x sem juros de ${esc(p.parcela || '')}</p></div>
          ${planoCtl('Trocar de plano, pelo escopo (a tela da família troca junto)')}
          <p class="pz-small">Link de pagamento: fora do deck. Depois do sim, mande no WhatsApp o link do plano fechado, na própria call, e acompanhe o pagamento na linha. Antes do sim, link nenhum.</p></div>` : ''}
        <div class="pz-sec"><p class="pz-h">Modo A: fechar na call</p>${list((r.fala || []).slice(r.fechaDe || 0))}</div>
        <div class="pz-sec"><p class="pz-h">Modo B: o retorno da equipe (a tela não muda)</p>${list(r.modoB || [])}</div>
        <div class="pz-sec ask"><p class="pz-h">Depois do sim</p>${list(window.FOLLOWUP.sim)}</div>
        <div class="pz-sec crm"><p class="pz-h">Depois do ainda não</p><p>${esc(window.FOLLOWUP.naoIntro)}</p><ul>${window.FOLLOWUP.nao.map(n => `<li><b>${esc(n[0])}:</b> ${fill(n[1])}</li>`).join('')}</ul>
        <div class="pz-actions"><button id="f-dia2">Copiar resumo do mesmo dia</button></div></div>`;
      qs('#f-dia2').addEventListener('click', e => copy(resumoDia(), e.target, 'Copiar resumo do mesmo dia'));
    }

    let linked = false;
    listen(m => {
      if (m.t === 'state') { if (!linked) { linked = true; qs('#pz-link').textContent = 'Deck conectado'; qs('#pz-link').classList.add('ok'); } show(m.i, m.step); }
      else if (m.t === 'ficha') { ficha = m.ficha || {}; syncForm(); refreshAll(applyBind(document)); }
      else if (m.t === 'local') { syncForm(); refreshAll(applyBind(document)); }
      else if (m.t === 'videoFalhou') { videoFalhou = true; refreshAll(applyBind(document)); avisoPainel('O vídeo do atleta não carregou na tela da família: o 17 voltou pra leitura ao vivo. Troque o compartilhamento pro vídeo dele no Meet.', false); }
      else if (m.t === 'fotoFalhou') avisoPainel('A foto do atleta não carregou na tela da família: lá aparece a inicial do nome no lugar dela. Confira a foto no painel e aperte Atualizar do painel.', false);
    });
    const h = parseInt((location.hash || '').replace('#', ''), 10);
    cur = Number.isFinite(h) && h >= 1 && h <= N ? h - 1 : 0;
    show(cur);
    refreshAll();

    /* ----- o atleta do link: a linha de status, "Atualizar do painel", a presença e "Encerrar e limpar" ----- */
    let validade = { link: '', foto: '' };
    const horaLocal = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); };
    function renderStatus() {
      const el = qs('#pz-status'); if (!el) return;
      if (linkEstado === 'carregando') { el.textContent = 'Buscando o atleta deste link no painel…'; return; }
      if (MOTIVO[linkEstado]) { el.textContent = ''; return; } // o motivo já está no aviso do painel, logo acima
      const temFoto = !!(ficha._foto && ficha._foto.ok);
      el.textContent = (linkEstado === 'sem-painel' ? 'Painel fora do ar agora: a tela usa a ficha guardada deste link. ' : '') +
        'Foto do painel: ' + (temFoto ? 'sim, autorizada' + (validade.foto ? ' até ' + validade.foto : '') : 'não tem (a tela mostra a inicial do nome)') + '.' +
        (validade.link ? ' Link vale até ' + validade.link + '.' : '');
    }
    carregaPainel(() => { syncForm(); refreshAll(applyBind(document)); renderStatus(); }, avisoPainel, true);
    renderStatus();
    if (AID) {
      // a presença: só o apresentador avisa o painel que está aberto (ao abrir e a cada minuto com a aba visível). Outra janela
      // com o mesmo link aberta há menos de 90 s: aviso aqui, com "Assumir" (que só passa o aviso pra outra; não bloqueia nada)
      const SIDK = 'je-r2-sid:' + AID;
      let sid = '';
      try { sid = sessionStorage.getItem(SIDK) || ''; } catch (e) { sid = ''; }
      if (!/^[a-z0-9]{16,40}$/.test(sid)) {
        const b = new Uint8Array(20);
        try { crypto.getRandomValues(b); } catch (e) { for (let i = 0; i < b.length; i++) b[i] = Math.floor(Math.random() * 256); }
        sid = Array.from(b, x => (x % 36).toString(36)).join('');
        try { sessionStorage.setItem(SIDK, sid); } catch (e) { /* sem sessionStorage: vale só nesta janela */ }
      }
      const URL_CHAMADA = PAINEL + '/api/chamada?t=' + AID;
      let encerrou = false;
      const presenca = extra => {
        if (encerrou || typeof fetch !== 'function') return;
        // texto puro: pedido simples, sem pré-voo de CORS
        fetch(URL_CHAMADA, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ t: AID, sid }, extra || {})), cache: 'no-store' })
          .then(r => (r.ok ? r.json() : null))
          .then(j => {
            if (!j) return;
            const al = qs('#pz-presenca');
            if (j.conflito && j.conflito.desde) { qs('#pz-presenca-txt').textContent = 'Este R2 já está aberto em outro lugar desde ' + horaLocal(j.conflito.desde) + '.'; al.style.display = 'flex'; }
            else al.style.display = 'none';
            if (j.validade) { validade = j.validade; renderStatus(); }
          })
          .catch(() => { /* falha de rede: silêncio, aqui e na tela da família */ });
      };
      const fim = () => { try { navigator.sendBeacon(URL_CHAMADA, new Blob([JSON.stringify({ t: AID, sid, fim: true })], { type: 'text/plain' })); } catch (e) { /* nada */ } };
      presenca();
      setInterval(() => { if (document.visibilityState === 'visible') presenca(); }, 60000);
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') presenca(); });
      window.addEventListener('pagehide', fim);
      app.addEventListener('click', e => { if (e.target.closest('[data-a="assumir"]')) { qs('#pz-presenca').style.display = 'none'; presenca({ assumir: true }); } });
      qs('#pz-atualizar').addEventListener('click', () => {
        avisoPainel('Buscando de novo no painel…', true);
        carregaPainel(() => { syncForm(); refreshAll(applyBind(document)); send({ t: 'ficha', ficha }); renderStatus(); }, avisoPainel);
        presenca();
      });
      qs('#pz-encerrar').addEventListener('click', () => {
        if (!confirm('Encerrar e limpar? A ficha deste link sai deste navegador (copie pro CRM antes) e o apresentador fecha. O link continua valendo pra família rever.')) return;
        encerrou = true;
        store.del(FKEY);
        fim();
        try { sessionStorage.removeItem(SIDK); } catch (e) { /* nada */ }
        window.close();
        setTimeout(() => avisoPainel('Ficha deste link apagada deste navegador. Pode fechar esta janela.', true), 300);
      });
    }
    send({ t: 'hello' });
    setTimeout(() => { if (!linked) qs('#pz-link').textContent = 'Abra o deck pelo botão Apresentador'; }, 1500);
  }
})();
