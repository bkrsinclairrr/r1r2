// Cada página de cada deck, do jeito que ela se declara no variacoes.json: o painel descobre a página, o link de entrada da etapa (o do deck do R1 pro
// SDR, o do deck do R2 pro closer) leva o lead até ela, o número de slides bate, o nome do lead aparece (ou não) como a página diz, a foto só é pedida nos
// decks que mostram, cada slide opcional sai e volta da sequência (nos decks que deixam) e nada quebra no navegador.
// Não tem lista de páginas aqui: ele lê o variacoes.json de cada deck (R2 novo, R2 anterior, R2 B e R1). Uma página nova (pasta + bloco r2-variacao +
// gera-manifesto.mjs) já entra nesta conferência sem ninguém acrescentar nada.
// Uso: node testes/teste-paginas.mjs   (DECK_PASTA, DECK_PASTA_R2_ANTERIOR, DECK_PASTA_R2_B e DECK_PASTA_R1 testam outra cópia dos decks)
import fs from 'node:fs';
import path from 'node:path';
import { sobe, RAIZES } from './servidor.mjs';
import { Cliente, verificador, fotosDeTeste, b64 } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const { ok, fim } = verificador('Páginas dos decks');
const IDS = ['r2', 'r2-anterior', 'r2-b', 'r1'];
const PREFIXO = { r2: '', 'r2-anterior': 'r2a-', 'r2-b': 'r2b-', r1: 'r1-' };
const PADRAO = { r1: 'r1-principal', r2: 'principal' }; // a variação padrão de cada etapa (não fica gravada no lead)
const manifesto = id => JSON.parse(fs.readFileSync(path.join(RAIZES[id], 'variacoes.json'), 'utf8'));
// o nome do lead (Lucas Almeida da Silva) como cada deck diz na tela: nome e último sobrenome (R2 novo e, desde 18/10/2026, R2 anterior), nome e
// primeiro sobrenome (R2 B) e só o primeiro nome (o título do R1, que chama pelo primeiro nome)
const NOME_NA_TELA = { r2: /^Lucas Silva$/, 'r2-b': /^Lucas Almeida$/, 'r2-anterior': /^Lucas Silva$/, r1: /^Lucas$/ };

const s = await sobe({ deck: true, decks: ['r2-anterior', 'r2-b', 'r1'] });
const fotos = fotosDeTeste(RAIZES.r2);
const nav = await abreNavegador();
try {
  const admin = new Cliente(s.painel);
  await admin.entra(s.adminLogin, s.adminSenha);
  const SENHA = 'senha-boa-123456';
  const cria = async (login, nome, papel) => { await admin.post('/api/usuarios', { login, nome, papel, senha: SENHA }); const c = new Cliente(s.painel); await c.entra(login, SENHA); return c; };
  const rafa = await cria('rafa.sdr', 'Rafa SDR', 'sdr'), carla = await cria('carla.closer', 'Carla Closer', 'closer');
  const hoje = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
  const FICHA = {
    r1: { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', idade: '15', cidade: 'Natal', r2data: hoje, r2hm: '19:30' },
    r2: { nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', plano: 'Assessoria PRO', r2data: hoje, r2hm: '19:30' }
  };
  // o lead de uma etapa: o SDR cria o R1 e o closer cria o R2 (com foto, que o R2 aceita mesmo que o deck da página não mostre)
  const criaLead = async (etapa, extra, comFoto) => {
    const cli = etapa === 'r1' ? rafa : carla;
    const r = await cli.post('/api/atletas', { ficha: Object.assign({}, FICHA[etapa], extra) });
    if (r.status !== 201) throw new Error('não criou o ' + etapa.toUpperCase() + ': ' + r.status + ' ' + r.texto);
    if (comFoto) {
      const f = await cli.put('/api/foto?t=' + r.j.t, { retrato: b64(path.join(fotos, 'retrato-a.jpg')), avatar: b64(path.join(fotos, 'avatar-a.jpg')), autorizo: true });
      if (f.status !== 200) throw new Error('não pôs a foto: ' + f.status + ' ' + f.texto);
    }
    return r.j.t;
  };
  const NOME = "Array.from(document.querySelectorAll('[data-bind=\"nome\"]')).map(e => e.textContent.trim()).filter(Boolean)[0] || ''";
  const fotoPedida = "Array.from(document.images).some(i => /api\\/foto/.test(i.src)) || performance.getEntriesByType('resource').some(r => /api\\/foto/.test(r.name))";
  const pronto = "document.querySelectorAll('#stage > .slide.active').length === 1 && window.getComputedStyle(document.querySelector('#viewport')).visibility !== 'hidden'";
  const tecla = (a, k) => a.avalia(`document.body.dispatchEvent(new KeyboardEvent('keydown', { key: ${JSON.stringify(k)}, bubbles: true, cancelable: true })); 1`);
  const anda = async (a, k) => {
    const antes = await a.avalia('location.hash');
    for (let i = 0; i < 40; i++) { await tecla(a, k); await espera(70); const d = await a.avalia('location.hash'); if (d !== antes) return d; }
    return antes;
  };
  const nSlide = h => parseInt(String(h).replace('#', ''), 10);
  const excecoes = [];
  // o Page.close pode nunca responder (a aba fecha antes): não espera a resposta além de 1,5 s
  const fechaAba = async a => { excecoes.push(...a.console_.filter(m => /^EXC/.test(m))); await Promise.race([a.envia('Page.close').catch(() => {}), espera(1500)]); };
  // abre a url e espera a página (origem e caminho) estar de pé, com o slide ativo
  const abre = async (url, origem, caminho) => {
    const a = await nav.aba(url, { largura: 1920, altura: 1080 });
    await a.ate('location.origin === ' + JSON.stringify(origem) + ' && location.pathname === ' + JSON.stringify(caminho) + ' && ' + pronto, 25000);
    return a;
  };

  // o painel descobre as páginas de todos os decks sozinho (a primeira abertura da lista sincroniza)
  const lista = (await admin.get('/api/versoes')).j;
  const doDeck = id => lista.decks.find(d => d.id === id);
  ok(lista.decks.length === IDS.length && IDS.every(id => doDeck(id) && doDeck(id).fonte === 'deck' && doDeck(id).falhou === false && doDeck(id).problemas === 0 && doDeck(id).desatualizadas === 0),
    'o painel leu o variacoes.json dos 4 decks, sem falha, sem página com problema e sem manifesto velho (' + IDS.map(id => id + ': ' + manifesto(id).paginas.map(p => p.id).join('+')).join('; ') + ')');

  for (const id of IDS) {
    const deck = doDeck(id), etapa = deck.etapa, entrada = s.decks[etapa === 'r1' ? 'r1' : 'r2']; // o deck de entrada da etapa
    console.log('\n=== ' + deck.nome + ' (' + etapa.toUpperCase() + ', ' + deck.origem + ')');
    for (const p of manifesto(id).paginas) {
      const gid = PREFIXO[id] + p.id;
      console.log('\n' + gid + '  (' + p.caminho + ', ' + p.slides + ' slides' + (p.opcionais.length ? ', opcionais: ' + p.opcionais.map(o => o.id + '@' + o.slide).join(', ') : '') + ')');
      const v = lista.versoes.find(x => x.id === gid);
      const rec = (v || {}).recursos || {};
      ok(!!v && v.deck === id && v.etapa === etapa && v.caminho === p.caminho && !!v.saude && v.saude.ok === true && v.saude.desatualizado === false, 'no painel: aparece como variação do ' + etapa.toUpperCase() + ', abre e o variacoes.json está em dia com a página');
      const mostraNome = rec.nomeTela ? p.lead.nome !== false : true, mostraFoto = !!(rec.foto && mostraNome && p.lead.foto);
      ok(!!v && JSON.stringify(v.opcionais) === JSON.stringify(p.opcionais) && v.lead.nome === mostraNome && v.lead.foto === mostraFoto, 'no painel: os slides opcionais e o que ela mostra do lead (nome ' + (mostraNome ? 'sim' : 'não') + ', foto ' + (mostraFoto ? 'sim' : 'não') + ') são os que a página e o deck dizem');
      const extra = gid === PADRAO[etapa] ? {} : { versao: gid };

      // o link de entrada da etapa leva até a página, com o mesmo código, o nome (e a foto) como ela diz
      if (gid==='r2a-acompanhamento') extra.plano='Scout PRO';
      const t = await criaLead(etapa, extra, mostraFoto);
      const A = await abre(entrada + '/?a=' + t + '#1', deck.origem, p.caminho);
      await espera(1800);
      ok((await A.avalia('location.origin')) === deck.origem && (await A.avalia('location.pathname')) === p.caminho && (await A.avalia('location.search')) === '?a=' + t,
        'o link do ' + etapa.toUpperCase() + ' (deck de entrada ' + new URL(entrada).host + ') leva até esta página, com o mesmo código');
      ok((await A.avalia("document.querySelectorAll('#stage > .slide').length")) === p.slides, 'o deck tem ' + p.slides + ' slides, como o variacoes.json diz');
      const nome = await A.avalia(NOME), texto = await A.avalia("Array.from(document.querySelectorAll('#stage > .slide')).map(x => x.textContent).join(' ')");
      if (mostraNome) ok(NOME_NA_TELA[id].test(nome), 'o nome do lead aparece na tela do jeito do deck (' + nome + ')');
      else ok(nome === '' && !/Lucas|Silva|Almeida/.test(texto), 'a página não mostra o nome do lead, e nenhum slide traz o nome');
      ok((await A.avalia(fotoPedida)) === mostraFoto, mostraFoto ? 'a foto do lead é pedida e aparece' : 'esta página não mostra a foto do lead: ela nem é pedida ao painel' + (etapa === 'r2' ? ' (o lead tem foto, mas o deck não usa)' : ''));
      await fechaAba(A);

      // sem link: abre como exemplo, no deck dela
      const E = await abre(deck.origem + p.caminho + '#1', deck.origem, p.caminho);
      ok((await E.avalia('location.pathname')) === p.caminho, 'sem link, a página abre como exemplo');
      await fechaAba(E);

      // cada slide opcional (só nos decks que deixam tirar slide da sequência): sai da sequência quando tirado, e o salto direto continua valendo
      for (const o of rec.pular ? p.opcionais : []) {
        const antes = o.slide - 1, depois = o.slide + 1;
        const tp = await criaLead(etapa, Object.assign({ pular: o.id }, extra), false);
        const Rr = await abre(entrada + '/?a=' + tp + '#' + (antes >= 1 ? antes : o.slide), deck.origem, p.caminho);
        await espera(800);
        if (antes >= 1 && depois <= p.slides) {
          ok(nSlide(await anda(Rr, 'ArrowRight')) === depois, 'opcional "' + o.id + '" (slide ' + o.slide + ') tirado: do ' + antes + ', a seta pra frente vai pro ' + depois);
          ok(nSlide(await anda(Rr, 'ArrowLeft')) === antes, '... e a seta pra trás, do ' + depois + ', volta pro ' + antes);
        } else ok(true, 'opcional "' + o.id + '" está na ponta da apresentação (slide ' + o.slide + ' de ' + p.slides + '): sem vizinho pra conferir a seta');
        await Rr.avalia("location.hash = '#" + o.slide + "'; 1"); await espera(500);
        ok(await Rr.avalia("document.querySelector('#stage > .slide.active').dataset.opcional === " + JSON.stringify(o.id)), '... e ir direto ao slide ' + o.slide + ' (hash) ainda abre ele');
        await fechaAba(Rr);
        if (antes >= 1) {
          const sem = await criaLead(etapa, extra, false);
          const S = await abre(entrada + '/?a=' + sem + '#' + antes, deck.origem, p.caminho);
          await espera(800);
          ok(nSlide(await anda(S, 'ArrowRight')) === o.slide, 'sem o opcional tirado, do ' + antes + ' a seta vai pro ' + o.slide + ' (o padrão não muda)');
          await fechaAba(S);
        }
      }
    }
  }

  // a página de exemplos do R2 novo (/variacoes/) tem um link pra cada página do variacoes.json dele: as de sempre estão no HTML, as novas entram pelo script
  const X = await nav.aba(s.decks.r2 + '/variacoes/', { largura: 1400, altura: 900 });
  const caminhos = manifesto('r2').paginas.map(p => p.caminho).filter(c => c !== '/');
  const temLinks = '(' + JSON.stringify(caminhos) + ").every(c => !!document.querySelector('a[href=\"' + c + '\"]'))";
  ok(await X.ate(temLinks, 10000), 'a página de exemplos do R2 novo (/variacoes/) tem um link pra cada página do variacoes.json dele (' + caminhos.join(', ') + ')');
  ok((await X.avalia("document.querySelectorAll('#sinc img, #sinc script').length")) === 0, '... e nada vindo do manifesto vira HTML nela');
  await fechaAba(X);
  ok(!excecoes.length, 'nenhuma exceção de JavaScript em nenhuma página' + (excecoes.length ? ': ' + excecoes.slice(0, 2).join(' | ') : ''));
} catch (e) {
  ok(false, 'o teste quebrou: ' + (e && e.stack || e));
} finally {
  await nav.fecha();
  await s.fecha();
  fs.rmSync(fotos, { recursive: true, force: true });
}
fim();
