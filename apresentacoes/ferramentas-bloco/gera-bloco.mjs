// Gera o HTML dos seis slides do Bloco Voxen | Zyron (17/10/2026), trazidos da pagina /institucional, para o R2 novo e variacoes.
// Uso (como modulo): import { slidesBloco } from './gera-bloco.mjs'; slidesBloco({ pre: 'assets/bloco/', numeros: [10,13,14,22,23,24] })
// Cada slide volta como { id, html }. O comentario de cabecalho leva o numero final do slide.
// Regras da casa respeitadas aqui: sem travessao, texto de 24 px ou mais, sem nota nem atributo (os numeros ficam atras da chave BLOCO.numeros).

const ESC = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICONE_IA = '<svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="none" stroke="#7FC4EA" stroke-width="3"/><path d="M8 32 C18 16 46 16 56 32 C46 48 18 48 8 32 Z" fill="none" stroke="#7FC4EA" stroke-width="3"/><circle cx="32" cy="32" r="8" fill="#7FC4EA"/></svg>';
const ICONE_EQ = '<svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="22" r="12" fill="none" stroke="#C8B88A" stroke-width="3"/><path d="M8 58 C8 42 20 36 32 36 C44 36 56 42 56 58" fill="none" stroke="#C8B88A" stroke-width="3" stroke-linecap="round"/></svg>';

// ---- dados da institucional (src/pages/institucional/data.ts) ----
const INDICADORES = [
  ['Leitura de jogo', 92], ['Passe', 93], ['Domínio', 91], ['Drible', 90], ['Ataque', 89],
  ['Finalização', 86], ['Velocidade', 85], ['Chute', 84], ['Defesa', 80], ['Marcação', 79]
];
const PERFIL_CLUBE = [88, 90, 86, 84, 87, 80, 90, 78, 76, 75];

const BRASIL = [['botafogo', 'Botafogo'], ['gremio', 'Grêmio'], ['internacional', 'Internacional'], ['corinthians', 'Corinthians'], ['palmeiras', 'Palmeiras'],
  ['fluminense', 'Fluminense'], ['vasco', 'Vasco da Gama'], ['athletico', 'Athletico Paranaense'], ['goias', 'Goiás'], ['vilanova', 'Vila Nova'],
  ['gama', 'Gama'], ['goianesia', 'Goianésia'], ['nautico', 'Náutico'], ['sport', 'Sport Recife'], ['ceara', 'Ceará'], ['coritiba', 'Coritiba'],
  ['chapecoense', 'Chapecoense'], ['pontepreta', 'Ponte Preta'], ['mirassol', 'Mirassol']];
const MUNDO = [['aeklondon', 'A.E.K. London'], ['montreal', 'Sport Club Montreal'], ['alnasr', 'Al-Nasr (Dubai)'], ['adidas', 'Adidas', 1],
  ['brighton', 'Brighton & Hove Albion'], ['betis', 'Real Betis'], ['braga', 'Sporting Braga'], ['feyenoord', 'Feyenoord'], ['nike', 'Nike', 1],
  ['lens', 'RC Lens'], ['fiorentina', 'ACF Fiorentina'], ['brugge', 'Club Brugge'], ['villarreal', 'Villarreal'], ['salzburg', 'Red Bull Salzburg'],
  ['estoril', 'Estoril Praia'], ['girona', 'Girona'], ['bologna', 'Bologna'], ['midtjylland', 'FC Midtjylland'], ['realsociedad', 'Real Sociedad'],
  ['olympiacos', 'Olympiacos'], ['anderlecht', 'Anderlecht']];
const PARCEIROS = [['adidas.svg', 'Adidas', 'parceiros/'], ['nike.svg', 'Nike', 'parceiros/'], ['cloudflare.svg', 'Cloudflare', 'parceiros/'],
  ['aws.svg', 'AWS Amazon', 'parceiros/'], ['aeklondon.webp', 'A.E.K. London', 'parceiros/']];

// ---- helpers de geometria ----
const f1 = v => v.toFixed(1);
const R = 190, N = 10;
const ang = i => (Math.PI * 2 * i) / N - Math.PI / 2;
const pontos = (vals, esc = 1) => vals.map((v, i) => { const r = ((v - 50) / 50) * R * esc; return f1(Math.cos(ang(i)) * r) + ',' + f1(Math.sin(ang(i)) * r); }).join(' ');

const CASA = [[70, 320], [210, 130], [200, 260], [200, 380], [210, 510], [350, 190], [330, 320], [350, 450], [470, 140], [500, 320], [470, 500]];
const FORA = [[930, 320], [790, 140], [800, 265], [800, 375], [790, 500], [650, 120], [640, 260], [640, 380], [650, 520], [560, 250], [560, 390]];

function campoSvg() {
  let s = '<svg class="bl-pitch-svg" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true"><defs>' +
    '<linearGradient id="bl-grama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14261F"/><stop offset="1" stop-color="#0D1A1B"/></linearGradient>' +
    '<radialGradient id="bl-focog"><stop offset="0%" stop-color="rgba(226,85,43,.36)"/><stop offset="70%" stop-color="rgba(226,85,43,.1)"/><stop offset="100%" stop-color="rgba(226,85,43,0)"/></radialGradient></defs>' +
    '<rect width="1000" height="640" fill="url(#bl-grama)"/>';
  for (let i = 0; i < 10; i += 2) s += '<rect x="' + (i * 100) + '" y="0" width="100" height="640" fill="rgba(157,176,106,.05)"/>';
  s += '<g fill="none" stroke="rgba(200,184,138,.4)" stroke-width="2"><rect x="30" y="30" width="940" height="580"/><line x1="500" y1="30" x2="500" y2="610"/><circle cx="500" cy="320" r="78"/>' +
    '<rect x="30" y="170" width="140" height="300"/><rect x="830" y="170" width="140" height="300"/><rect x="30" y="250" width="50" height="140"/><rect x="920" y="250" width="50" height="140"/></g>';
  s += '<circle class="bl-foco" r="150" cx="500" cy="320" fill="url(#bl-focog)"/>';
  [...CASA.map(p => [p, 'c']), ...FORA.map(p => [p, 'v'])].forEach(([[x, y], t]) => {
    s += '<g class="bl-pl bl-pl-' + t + '" transform="translate(' + x + ' ' + y + ')"><rect class="bl-pl-box" x="-17" y="-22" width="34" height="44" rx="3"/><circle class="bl-pl-dot" r="9"/></g>';
  });
  return s + '<circle class="bl-bola" r="7" cx="500" cy="320"/></svg>';
}

function radarSvg() {
  const atleta = INDICADORES.map(x => x[1]);
  let s = '<svg viewBox="-370 -320 740 640" aria-hidden="true">';
  [.25, .5, .75, 1].forEach(e => { s += '<polygon class="bl-r-grade" points="' + pontos(Array(N).fill(100), e) + '"/>'; });
  for (let i = 0; i < N; i++) s += '<line class="bl-r-eixo" x1="0" y1="0" x2="' + f1(Math.cos(ang(i)) * R) + '" y2="' + f1(Math.sin(ang(i)) * R) + '"/>';
  s += '<polygon class="bl-r-clube" points="' + pontos(PERFIL_CLUBE) + '" pathLength="1"/><polygon class="bl-r-atleta" points="' + pontos(atleta) + '"/></svg>';
  let rot = '';
  INDICADORES.forEach(([nome], i) => {
    const x = 370 + Math.cos(ang(i)) * (R + 28), y = 320 + Math.sin(ang(i)) * (R + 28);
    const cls = i === 0 ? 'cima' : i === 5 ? 'baixo' : i < 5 ? 'dir' : 'esq';
    rot += '<p class="rot ' + cls + '" style="left:' + f1(x) + 'px;top:' + f1(y) + 'px">' + ESC(nome) + '</p>';
  });
  const dif = atleta.reduce((a, v, i) => a + Math.abs(v - PERFIL_CLUBE[i]), 0) / N;
  return { svg: s, rotulos: rot, compat: Math.round(100 - dif) };
}

function escudos(lista, pre) {
  return lista.map(([slug, nome, marca]) => '<span class="bl-escudo" title="' + ESC(nome) + '"><img ' + (marca ? 'class="marca" src="' + pre + 'parceiros/' + slug + '.svg"' : 'src="' + pre + 'clubes/' + slug + '.webp"') + ' alt="' + ESC(nome) + '" width="108" height="108" loading="eager" decoding="async"></span>').join('');
}
function faixa(lista, pre, topo, seg, rev) {
  const trilha = escudos(lista, pre);
  return '<div class="bl-faixa' + (rev ? ' rev' : '') + '" style="top:' + topo + 'px;--bl-seg:' + seg + 's"><div class="bl-trilha">' + trilha + '</div><div class="bl-trilha" aria-hidden="true">' + trilha + '</div></div>';
}

export function slidesBloco({ pre = 'assets/bloco/', numeros = [10, 13, 14, 22, 23, 24], tom = 'padrao', origem = false, opcional = true, tema = 'r2' } = {}) {
  const [nM, nC, nE, nR, nB, nF] = numeros;
  const T = tom === 'tecnica'; // variacao tecnica: de par pra par, "observacao" no lugar de "olhometro", sem explicar o basico
  const out = [];

  // 1) O MÉTODO
  const barras = INDICADORES.map(([nome, v], i) => '<li style="--d:' + (0.45 + i * 0.13).toFixed(2) + 's"><span>' + ESC(nome) + '</span><i><b></b></i><em><span class="ok">✓</span><span class="bl-n">' + v + '</span></em></li>').join('');
  out.push({ id: 'metodo', html: `<!-- ============ ${nM} O MÉTODO: A IA ENCONTRA, A GENTE CONDUZ (novo, 17/10/2026: da página /institucional) ============ -->
<!-- A IA observa cada lance e lê dez indicadores (barras que se enchem, uma a uma, com o visto no fim; sem nota nem atributo: com
     BLOCO.numeros = true os números voltam). A equipe é o agente humano: interpreta e planeja, acompanha cada vídeo, faz a conexão (um
     avanço por linha). Fica entre a plataforma e o "Quem olha por ele": aqui é o princípio, lá é o ritmo de cada plano. Opcional. -->
<section class="slide bl-slide bl-metodo" data-opcional="metodo">
  <div class="fill" style="background:radial-gradient(44% 62% at 28% 64%,rgba(127,196,234,.1),rgba(6,11,20,0) 72%),radial-gradient(40% 60% at 84% 62%,rgba(200,184,138,.07),rgba(6,11,20,0) 72%)"></div>
  <p class="a dtag" data-if="nome">O método · <span data-bind="nome"></span></p>
  <p class="a label ice" style="left:120px;top:96px">Voxen | Zyron · O método</p>
  <p class="a t rise" style="left:116px;top:160px;width:1700px;font-size:124px;white-space:nowrap;--d:.04s">A IA <span class="ice">encontra</span>. A <span class="sand-l">gente</span> conduz.</p>
  <div class="bl-card ia rise" style="left:120px;top:330px;width:820px;height:660px;--d:.1s">
    <div class="hd">${ICONE_IA}<div><p class="nm">A inteligência artificial</p><p class="tg">${T ? 'Sem cansaço, sem preferência' : 'Sem cansaço, sem olhômetro'}</p></div></div>
    <ul class="bl-barras">${barras}</ul>
    <p class="bl-nota">Dez indicadores lidos em cada atleta.</p>
  </div>
  <div class="bl-card eq rise" style="left:980px;top:330px;width:820px;height:660px;--d:.14s">
    <div class="hd">${ICONE_EQ}<div><p class="nm">A equipe</p><p class="tg">Um agente humano dedicado a você</p></div></div>
    <ol class="bl-passos">
      <li data-step="1"><span class="n">1</span><div><h4>Interpreta e planeja</h4><p>Lê o relatório da IA e define o plano de evolução.</p></div></li>
      <li data-step="2"><span class="n">2</span><div><h4>Acompanha cada vídeo</h4><p>Cada vídeo novo vira uma nova leitura e o próximo foco.</p></div></li>
      <li data-step="3"><span class="n">3</span><div><h4>Faz a conexão</h4><p>Leva o perfil a quem decide, com vídeo e relatório na mão.</p></div></li>
    </ol>
  </div>
</section>
` });

  // 2) O CAMPO: OLHÔMETRO × IA
  out.push({ id: 'campo', html: `<!-- ============ ${nC} O CAMPO: OLHÔMETRO SEGUE A BOLA, A IA VÊ OS 22 (novo, 17/10/2026: da página /institucional) ============ -->
<!-- O campo animado da institucional (bloco.js): 22 jogadores se movendo e a bola passando. Abre no olhômetro: o foco (laranja-sinal,
     que é só do olhômetro) chega atrasado na bola e só quem está perto fica aceso ("3 de 22 observados"). Os dois botões do lado (clique) trocam
     pra IA: os 22 acesos e rastreados, em gelo; é o mesmo slide, sem avanço de passo. O veredito fica sempre na tela. Nenhum jogador, escudo ou clube escalado: formação ilustrativa. Opcional. -->
<section class="slide bl-slide bl-campo" data-opcional="campo" data-bl="campo">
  <div class="fill" style="background:radial-gradient(40% 60% at 34% 64%,rgba(226,85,43,.06),rgba(6,11,20,0) 70%),radial-gradient(34% 56% at 88% 40%,rgba(127,196,234,.07),rgba(6,11,20,0) 70%)"></div>
  <p class="a dtag" data-if="nome">O campo · <span data-bind="nome"></span></p>
  <p class="a t rise" style="left:116px;top:84px;width:1700px;font-size:96px;white-space:nowrap;--d:.04s">${T ? 'A <span class="sig">observação</span>' : 'O <span class="sig">olhômetro</span>'} segue a bola. A <span class="ice">IA</span> vê os 22.</p>
  <div class="bl-pitch rise" style="left:120px;top:222px;width:1160px;height:742px;--d:.08s">${campoSvg()}</div>
  <div class="bl-side rise" style="left:1330px;top:222px;width:470px;--d:.12s">
    <div class="bl-pills"><button type="button" class="bl-pill o" data-bl-modo="olho" aria-pressed="true">${T ? 'Observação' : 'Olhômetro'}</button><button type="button" class="bl-pill i" data-bl-modo="ia" aria-pressed="false">Inteligência artificial</button></div>
    <p class="bl-dica">Clique para alternar</p>
    <p class="bl-conta"><strong>3</strong><span>de 22 jogadores observados agora</span></p>
    <div class="bl-legenda">
      <p class="o">${T ? 'Na observação, o foco <b>segue a bola</b>. Quem está longe dela fica fora da análise.' : 'No olhômetro, a atenção <b>segue a bola</b>. Quem está longe dela não é visto.'}</p>
      <p class="i">Com IA, cada atleta é <b>identificado e medido</b> do primeiro ao último minuto.</p>
    </div>
  </div>
  <p class="bl-veredito" style="left:1330px;top:836px;width:470px;font-size:38px">O problema nunca foi o talento. <span class="sig">Sempre foi o método.</span></p>
</section>
` });

  // 3) O ENCAIXE (NEYMAR)
  const rd = radarSvg();
  out.push({ id: 'encaixe', html: `<!-- ============ ${nE} O ENCAIXE: VOCÊ NÃO PRECISA SER O PRÓXIMO NEYMAR (novo, 17/10/2026: da página /institucional) ============ -->
<!-- A cadeia desce (uma linha por avanço, a linha de gelo cresce de uma bolinha à outra) e o radar acompanha: no 1 o perfil do atleta
     abre em areia, no 2 o contorno do que o clube procura se desenha, no 3 e no 4 o fecho. Radar ilustrativo, valores fictícios,
     sem nome, sem nota e sem percentual na tela (BLOCO.numeros = true devolve o percentual). Nenhum clube nomeado: quem decide é o
     clube, a gente encaminha. Opcional. -->
<section class="slide bl-slide bl-encaixe" data-opcional="encaixe">
  <div class="fill" style="background:radial-gradient(40% 64% at 78% 52%,rgba(127,196,234,.09),rgba(6,11,20,0) 72%)"></div>
  <p class="a dtag" data-if="nome">O encaixe · <span data-bind="nome"></span></p>
  <i class="bl-f bl-f1" data-step="1"></i><i class="bl-f bl-f2" data-step="2"></i><i class="bl-f bl-f3" data-step="3"></i><i class="bl-f bl-f4" data-step="4"></i>
  <p class="a t rise" style="left:116px;top:84px;width:940px;font-size:104px;--d:.04s">Você não precisa ser<br>o próximo <span class="sand-l">Neymar</span>.</p>
  <p class="bl-sub rise" style="left:120px;top:306px;width:930px;--d:.1s">${T ? 'Precisa ser o perfil que <b>um clube</b> procura. A carência de elenco, em dado.' : 'Precisa ser o atleta que <b>um clube</b> está procurando.'}</p>
  <ol class="bl-cadeia" style="left:120px;top:452px;width:930px">
    <li data-step="1"><span class="n">1</span><div><h4>A IA coleta.</h4><p>Cada lance vira dado: dez indicadores individuais do seu jogo.</p></div></li>
    <li data-step="2"><span class="n">2</span><div><h4>O perfil encontra o clube.</h4><p>As suas características são cruzadas com o que cada clube da nossa rede precisa.</p></div></li>
    <li data-step="3"><span class="n">3</span><div><h4>A gente conecta.</h4><p>O seu perfil é encaminhado a clubes que procuram esse perfil. Quem decide é o clube.</p></div></li>
    <li class="fim" data-step="4"><span class="n">✓</span><div><h4>O encaixe é método.</h4><p>Não é sorte.</p></div></li>
  </ol>
  <div class="bl-radar rise" style="left:1060px;top:200px;width:740px;height:640px;--d:.14s">${rd.svg}${rd.rotulos}</div>
  <p class="bl-legenda-radar" style="left:1100px;top:858px"><span><i class="at"></i>Perfil do atleta</span><span><i class="cl"></i>O que o clube procura</span></p>
  <p class="bl-encaixe-sel" data-step="2" style="left:1100px;top:908px"><i></i>Encaixe encontrado<span class="bl-n">${rd.compat}%</span></p>
  <p class="bl-aviso" style="left:1100px;top:960px;width:700px">Ilustração com valores fictícios, não do atleta.</p>
</section>
` });

  // 4) 326 ATLETAS
  out.push({ id: 'registro', html: `<!-- ============ ${nR} 326 ATLETAS ENVIADOS (novo, 17/10/2026: da página /institucional) ============ -->
<!-- O cartão creme da institucional: o número sobe de 0 a 326 e a arte (a mesma publicada no Instagram da casa) cai do lado. "Enviados" é a
     palavra da arte; não troque por "contratados": enviado é o que a casa fez, contratar é do clube. O número e o Instagram são da casa
     (o dono confirmou). Opcional. -->
<section class="slide bl-slide bl-registro" data-opcional="registro">
  <div class="fill" style="background:radial-gradient(46% 62% at 50% 50%,rgba(230,219,184,.08),rgba(6,11,20,0) 72%)"></div>
  <p class="a dtag" data-if="nome">O registro · <span data-bind="nome"></span></p>
  <div class="bl-creme rise" style="left:120px;top:100px;width:1680px;height:860px;--d:.04s">
    <p class="k" style="left:84px;top:66px">Registro · Voxen | Zyron</p>
    <p class="num" style="left:66px;top:150px"><span data-bl-conta="326">326</span></p>
    <p class="tit" style="left:84px;top:480px">atletas enviados.</p>
    <p class="txt" style="left:84px;top:604px;width:760px">Cada um com nome, posição e clube de destino. Tudo registrado no nosso Instagram.</p>
    <p class="ig" style="left:84px;top:776px">@assessoria.voxen</p>
    <div class="bl-moldura" style="left:996px;top:26px;width:600px;height:808px"><img src="${pre}326-atletas.webp" alt="Arte Voxen | Zyron com o número 326 e a frase atletas enviados" width="538" height="732"></div>
  </div>
</section>
` });

  // 5) CLUBES E PARCEIROS
  const parc = PARCEIROS.map(([arq, nome, dir]) => '<div class="bl-parc"><span class="lg"><img src="' + pre + dir + arq + '" alt="" width="190" height="80"></span><span>' + ESC(nome) + '</span></div>').join('');
  out.push({ id: 'clubes', html: `<!-- ============ ${nB} CLUBES E PARCEIROS: DO SUL AO NORDESTE, DA INGLATERRA AO CANADÁ (novo, 17/10/2026: da página /institucional) ============ -->
<!-- Duas faixas de escudos rolando em sentidos opostos (Brasil e mundo) e os parceiros comerciais (acordo confirmado pelo dono com cada um).
     É a rede da casa, não clube que usa dados: a nota legal fica na tela e a fala nunca diz que o clube usa o Zyron nem que há vaga.
     Escudos e marcas são dos titulares. Opcional. -->
<section class="slide bl-slide bl-clubes" data-opcional="clubes">
  <div class="fill" style="background:radial-gradient(52% 40% at 50% 42%,rgba(200,184,138,.07),rgba(6,11,20,0) 72%)"></div>
  <p class="a dtag" data-if="nome">A rede · <span data-bind="nome"></span></p>
  <p class="a label" style="left:120px;top:66px">Clubes e parceiros</p>
  <p class="a t rise" style="left:116px;top:136px;width:1700px;font-size:96px;--d:.04s">Do Sul ao Nordeste.<br>Da <span class="sand-l">Inglaterra</span> ao <span class="sand-l">Canadá</span>.</p>
  <p class="bl-rotulo" style="left:120px;top:336px;width:1680px">Clubes da nossa rede · Brasil</p>
  ${faixa(BRASIL, pre, 376, 72, false)}
  <p class="bl-rotulo" style="left:120px;top:514px;width:1680px">Clubes da nossa rede · Mundo</p>
  ${faixa(MUNDO, pre, 554, 78, true)}
  <p class="bl-rotulo" style="left:120px;top:690px;width:1680px">Parceiros comerciais · Quem caminha com a gente</p>
  <div class="bl-parceiros" style="left:120px;top:742px">${parc}</div>
  <p class="bl-legal" style="left:120px;top:972px;width:1560px">Escudos e marcas pertencem aos seus titulares e não indicam patrocínio, uso da plataforma nem promessa de clube.</p>
</section>
` });

  // 6) MOSAICO
  const telhas = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 8; c++) {
    const d = Math.hypot(c - 3.5, (r - 4) * 0.9);
    telhas.push('<i style="--d:' + (0.25 + d * 0.16).toFixed(2) + 's"></i>');
  }
  out.push({ id: 'rostos', html: `<!-- ============ ${nF} CADA ROSTO, UMA HISTÓRIA QUE ACOMPANHAMOS (novo, 17/10/2026: da página /institucional) ============ -->
<!-- O mosaico de fotos da trajetória, em painel de 864 x 1080 (a proporção da imagem, sem cortar rostos) e não em tela cheia: a arte tem
     1122 px de largura e esticada a 1920 ficaria mole. As 72 telhas se abrem do centro pra fora e a foto respira devagar. Fecha a prova:
     o dono pediu este slide e o texto da institucional. Opcional. -->
<section class="slide bl-slide bl-rostos" data-opcional="rostos">
  <div class="fill" style="background:radial-gradient(44% 60% at 22% 58%,rgba(200,184,138,.08),rgba(6,11,20,0) 72%)"></div>
  <p class="a dtag" data-if="nome">Arquivo · <span data-bind="nome"></span></p>
  <div class="bl-mosaico"><img src="${pre}mosaico.webp" alt="Mosaico com dezenas de fotos de atletas acompanhados pela equipe em clubes, campos, aeroportos e assinaturas" width="1122" height="1402"><div class="bl-veu"></div><div class="bl-telhas" aria-hidden="true">${telhas.join('')}</div></div>
  <p class="a label" style="left:120px;top:96px">Arquivo</p>
  <p class="bl-rostos-t rise" style="left:116px;top:200px;width:940px;white-space:nowrap;--d:.04s">Cada rosto,<br><span class="sand-l">uma história</span><br>que acompanhamos.</p>
  <p class="a b b-44 rise" style="left:120px;top:540px;width:800px;color:var(--white);--d:.16s">Um recorte das fotos da nossa trajetória.</p>
  <p class="bl-ig rise" style="left:120px;top:680px;width:820px;--d:.22s">O arquivo completo está no Instagram:<br><b style="color:var(--white)">@assessoria.voxen</b></p>
</section>
` });

  // decks com data-slide-origem (R2 anterior e suas variacoes): origens novas 101 a 106 e o roteiro vem de ROTEIROS_EXTRAS (assets/bloco-roteiro.js)
  if (origem) {
    const ORIG = { metodo: 101, campo: 102, encaixe: 103, registro: 104, clubes: 105, rostos: 106 };
    out.forEach(s => { s.html = s.html.replace('data-opcional="' + s.id + '"', (opcional ? 'data-opcional="' + s.id + '" ' : '') + 'data-slide-origem="' + ORIG[s.id] + '" data-roteiro="bloco-' + s.id + '"'); });
  }
  // decks sem o recurso de tirar slide da sequencia e sem origem (R1): o slide nao leva data-opcional
  if (!opcional && !origem) out.forEach(s => { s.html = s.html.replace(' data-opcional="' + s.id + '"', ''); });
  // tema do R1 (preto, dourado e azul; sem selo de dossie e sem avanco por passo): tira o selo e deixa o campo virar sozinho do olhometro pra IA
  if (tema === 'r1') {
    out.forEach(s => {
      s.html = s.html.replace(/<p class="a dtag"[^\n]*<\/p>\n/, '');
      if (s.id === 'campo') s.html = s.html.replace('data-bl="campo"', 'data-bl="campo" data-bl-auto="7000"');
    });
  }
  return out;
}
