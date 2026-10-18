// Insere o Bloco Voxen | Zyron (6 slides, 4 no R1) numa pagina de deck e liga o CSS e o JS dele.
// Uso (da pasta apresentacoes): node ferramentas-bloco/aplica-bloco.mjs <pasta-do-deck> <pagina.html relativa> <prefixo-dos-assets> [opcoes]
//   ex.: node ferramentas-bloco/aplica-bloco.mjs jogador-de-elite-r2-novo index.html assets/ --refaz
//        node ferramentas-bloco/aplica-bloco.mjs jogador-de-elite-r2-novo variacoes/tecnica/index.html ../../assets/ --tom=tecnica --refaz
// Os comandos de cada deck estao em ferramentas-bloco/README.md. Depois, sempre: node gera-manifesto.mjs na pasta do deck.
// Opcoes:
//   --tom=tecnica        copia de par pra par ("observacao" no lugar de "olhometro")
//   --refaz              tira o bloco que ja esta na pagina e gera de novo (a pagina fica igual se nada mudou)
//   --sem-opcional       nao marca data-opcional (R2 B, R2 anterior e R1: o deck nao tem o recurso de tirar slide da sequencia)
//   --layout=origem      decks com data-slide-origem (R2 anterior e variacoes): ancora pelo data-slide-origem dos slides antigos,
//                        os novos ganham origem 101 a 106 e data-roteiro="bloco-<id>" (o roteiro vem de assets/<--extras>)
//     --ancoras=10,11,17   origem dos slides ANTES dos quais entram: o metodo; o campo e o encaixe; os tres da prova
//     --numeros=9,11,12,19,20,21  posicao final de cada slide novo (so pros comentarios de cabecalho)
//     --extras=bloco-roteiro.js   o script do roteiro dos novos (entra antes do ordem-garantia.js)
//     --grupos=metodo|campo,encaixe|registro,clubes,rostos   quais slides entram em cada ancora (padrao). Na acompanhamento: metodo,encaixe|campo|registro,clubes,rostos
//   --layout=posicao     R1 (sem data-slide-origem): ancora pela posicao do slide; --ancoras=7,12,15 e --grupos="campo|registro,clubes|rostos"
//   --tema=r1            paleta do R1 (assets/bloco-r1.css), sem selo de dossie, e o campo vira sozinho pra IA
// No layout padrao (R2 novo e R2 B): ancora pelos cabecalhos de comentario 11, 15 e 25 (a numeracao de 33 slides).
// Idempotente: se a pagina ja tem o bloco, nao faz nada (sem --refaz). Preserva CRLF.
import fs from 'node:fs';
import path from 'node:path';
import { slidesBloco } from './gera-bloco.mjs';

const args = process.argv.slice(2);
const pos = args.filter(a => !a.startsWith('--'));
const opt = n => { const a = args.find(x => x.startsWith('--' + n + '=')); return a ? a.slice(n.length + 3) : null; };
const [pasta, rel, assets = 'assets/'] = pos;
if (!pasta || !rel) { console.error('uso: node aplica-bloco.mjs <pasta-do-deck> <pagina.html> <prefixo-assets> [opcoes]'); process.exit(1); }
const arq = path.join(pasta, rel);
const bruto = fs.readFileSync(arq, 'utf8');
const crlf = bruto.includes('\r\n');
let t = bruto.replace(/\r\n/g, '\n');
const REFAZ = args.includes('--refaz');
const ORIGEM = opt('layout') === 'origem';
const TOM = opt('tom') === 'tecnica' || args.includes('--tom=tecnica') ? 'tecnica' : 'padrao';
const IDS = ['metodo', 'campo', 'encaixe', 'registro', 'clubes', 'rostos'];
const POSICAO = opt('layout') === 'posicao'; // R1: sem data-slide-origem; ancora pela posicao do slide (1 a N) e o roteiro e por indice
const TEMA = opt('tema') === 'r1' ? 'r1' : 'r2';
const CSS = TEMA === 'r1' ? 'bloco-r1.css' : 'bloco.css';

if (/bloco(?:-r1)?\.css/.test(t) && !REFAZ) { console.log('ja tem o bloco: nada a fazer (' + rel + '); use --refaz pra gerar de novo'); process.exit(0); }
if (REFAZ) {
  // tira os 6 slides do bloco (do comentario de cabecalho ate o </section>), os links e os opcionais, e refaz tudo
  t = t.replace(/<!-- ============ \d+ [^\n]*\(novo, 17\/10\/2026: da página \/institucional\) ============ -->\n[\s\S]*?<\/section>\n\n?/g, '');
  t = t.replace(/\n<link rel="stylesheet" href="[^"]*bloco(?:-r1)?\.css">/, '').replace(/\n<script src="[^"]*bloco\.js"><\/script>/, '').replace(/\n<script src="[^"]*bloco-roteiro[^"]*\.js"><\/script>/, '');
  t = t.replace(/(<script type="application\/json" id="r2-variacao">\s*)([\s\S]*?)(\s*<\/script>)/, (_, a, j, c) => {
    const o = JSON.parse(j); o.opcionais = (o.opcionais || []).filter(x => !IDS.includes(x.id)); return a + JSON.stringify(o, null, 2) + c;
  });
}
const secoes = s => (s.replace(/<!--[\s\S]*?-->/g, '').match(/<section\b[^>]*\bclass="slide[^"]*"/g) || []).length;
const antesN = secoes(t);

// numeros finais dos slides novos (so aparecem no comentario de cabecalho de cada um)
const NUM = (opt('numeros') || '10,13,14,22,23,24').split(',').map(Number);
const SEM_OPC = args.includes('--sem-opcional'); // decks antigos, sem o recurso de tirar slide da sequencia (nao tem pulaSlide no deck.js)
const slides = Object.fromEntries(slidesBloco({ pre: assets + 'bloco/', numeros: NUM, tom: TOM, origem: ORIGEM, opcional: !SEM_OPC, tema: TEMA }).map(s => [s.id, s.html]));
let inseridos = 6;

function inserirAntesDe(indice, trechos) {
  t = t.slice(0, indice) + trechos.join('\n') + '\n' + t.slice(indice);
}
if (POSICAO) {
  // a n-esima tag <section class="slide">, ou o primeiro dos comentarios colados antes dela (contando so as fora de comentario)
  const tags = []; { const sem = t.replace(/<!--[\s\S]*?-->/g, m => ' '.repeat(m.length)); const re = /<section\b[^>]*\bclass="slide[^"]*"/g; let m; while ((m = re.exec(sem))) tags.push(m.index); }
  const ancora = n => {
    if (!tags[n - 1]) throw new Error('nao achei o slide ' + n + ' em ' + rel);
    let i = tags[n - 1];
    for (;;) { const antes = t.slice(0, i).replace(/\s+$/, ''); if (!antes.endsWith('-->')) break; const ini = antes.lastIndexOf('<!--'); if (ini < 0) break; i = ini; }
    return i;
  };
  const ancs = (opt('ancoras') || '7,12,15').split(',').map(Number);
  const gs = (opt('grupos') || 'campo|registro,clubes|rostos').split('|').map(g => g.split(','));
  const idx = ancs.map(ancora);
  inseridos = gs.reduce((a, g) => a + g.length, 0);
  for (let k = gs.length - 1; k >= 0; k--) inserirAntesDe(idx[k], gs[k].map(id => slides[id])); // do fim pro comeco
} else if (!ORIGEM) {
  // o cabecalho de comentario dos slides antigos JA renumerados (11 = "Quem olha por ele", 15 = "Olhometro x Zyron", 25 = "O que ele leva")
  const ancora = num => { const m = new RegExp('<!-- ============ ' + num + ' ').exec(t); if (!m) throw new Error('nao achei o cabecalho do slide ' + num + ' em ' + rel); return m.index; };
  inserirAntesDe(ancora('11'), [slides.metodo]);
  inserirAntesDe(ancora('15'), [slides.campo, slides.encaixe]);
  inserirAntesDe(ancora('25'), [slides.registro, slides.clubes, slides.rostos]);
} else {
  // a tag <section data-slide-origem="N">, ou o primeiro dos comentarios que vem colado antes dela
  const [a1, a2, a3] = (opt('ancoras') || '10,11,17').split(',');
  const ancora = n => {
    const m = new RegExp('<section\\b[^>]*\\bdata-slide-origem="' + n + '"').exec(t);
    if (!m) throw new Error('nao achei o slide com data-slide-origem="' + n + '" em ' + rel);
    let i = m.index;
    for (;;) {
      const antes = t.slice(0, i).replace(/\s+$/, '');
      if (!antes.endsWith('-->')) break;
      const ini = antes.lastIndexOf('<!--');
      if (ini < 0) break;
      i = ini;
    }
    return i;
  };
  const i1 = ancora(a1), i2 = ancora(a2), i3 = ancora(a3);
  // do fim pro comeco, pra os indices anteriores continuarem valendo
  const [g1, g2, g3] = (opt('grupos') || 'metodo|campo,encaixe|registro,clubes,rostos').split('|').map(g => g.split(','));
  inserirAntesDe(i3, g3.map(id => slides[id]));
  inserirAntesDe(i2, g2.map(id => slides[id]));
  inserirAntesDe(i1, g1.map(id => slides[id]));
}

// css depois do r2.css, js depois do deck.js (e, no layout origem, o roteiro dos novos antes do ordem-garantia.js)
t = t.replace(TEMA === 'r1' ? /(<link rel="stylesheet" href="[^"]*assets\/deck\.css">)/ : /(<link rel="stylesheet" href="[^"]*assets\/r2\.css">)/, '$1\n<link rel="stylesheet" href="' + assets + CSS + '">');
t = t.replace(/(<script src="[^"]*assets\/deck\.js"><\/script>)/, '$1\n<script src="' + assets + 'bloco.js"></script>');
if (ORIGEM) {
  const ex = opt('extras') || 'bloco-roteiro.js';
  if (!/<script src="[^"]*ordem-garantia\.js"><\/script>/.test(t)) throw new Error('sem ordem-garantia.js em ' + rel);
  t = t.replace(/(<script src="[^"]*ordem-garantia\.js"><\/script>)/, '<script src="' + assets + ex + '"></script>\n$1');
}
if (!t.includes(assets + CSS) || !t.includes(assets + 'bloco.js')) throw new Error('nao consegui ligar o css/js em ' + rel);

// o bloco r2-variacao: os opcionais (cada slide novo e opcional) e o texto do "leva"
const re = /(<script type="application\/json" id="r2-variacao">\s*)([\s\S]*?)(\s*<\/script>)/;
const mm = re.exec(t);
if (!mm) throw new Error('sem bloco r2-variacao em ' + rel);
const v = JSON.parse(mm[2]);
const campoNome = TOM === 'tecnica' ? 'observação' : 'olhômetro';
const OPC = ORIGEM ? [
  { id: 'metodo', rotulo: 'O método: a IA encontra, a gente conduz', ajuda: 'Mostra como a IA lê dez indicadores e o que a equipe faz com a leitura. Sem ele, a apresentação segue direto para o seu lugar em campo.' },
  { id: 'campo', rotulo: 'O campo: ' + campoNome + ' × IA', ajuda: 'O campo animado: ' + (TOM === 'tecnica' ? 'a observação' : 'o olhômetro') + ' só vê quem está perto da bola, a IA vê os 22. Sem ele, a apresentação vai do seu lugar em campo direto para o encaixe.' },
  { id: 'encaixe', rotulo: 'Você não precisa ser o próximo Neymar', ajuda: 'O perfil do atleta se encaixando no que o clube procura. Sem ele, a apresentação vai do campo direto para a tabela do ' + (TOM === 'tecnica' ? 'Zyron.' : 'olhômetro × Zyron.') },
  { id: 'registro', rotulo: '326 atletas enviados', ajuda: 'O número da casa e a arte do Instagram. Sem ele, a apresentação segue direto para os clubes e parceiros.' },
  { id: 'clubes', rotulo: 'Clubes e parceiros', ajuda: 'As faixas de escudos e os parceiros comerciais, com a nota legal. Sem ele, a apresentação segue direto para o mosaico de rostos.' },
  { id: 'rostos', rotulo: 'Cada rosto, uma história', ajuda: 'O mosaico de fotos da trajetória da casa. Sem ele, a apresentação segue direto para "O valor real".' }
] : [
  { id: 'metodo', rotulo: 'O método: a IA encontra, a gente conduz', ajuda: 'Mostra como a IA lê dez indicadores e o que a equipe faz com a leitura. Sem ele, a apresentação passa da plataforma direto para "Quem olha por ele".' },
  { id: 'campo', rotulo: 'O campo: ' + campoNome + ' × IA', ajuda: 'O campo animado: ' + (TOM === 'tecnica' ? 'a observação' : 'o olhômetro') + ' só vê quem está perto da bola, a IA vê os 22. Sem ele, a apresentação vai do seu lugar em campo direto para o encaixe.' },
  { id: 'encaixe', rotulo: 'Você não precisa ser o próximo Neymar', ajuda: 'O perfil do atleta se encaixando no que o clube procura. Sem ele, a apresentação vai do campo direto para a tabela do ' + (TOM === 'tecnica' ? 'Zyron.' : 'olhômetro × Zyron.') },
  { id: 'registro', rotulo: '326 atletas enviados', ajuda: 'O número da casa e a arte do Instagram. Sem ele, a apresentação passa da rede direto para os clubes e parceiros.' },
  { id: 'clubes', rotulo: 'Clubes e parceiros', ajuda: 'As faixas de escudos e os parceiros comerciais, com a nota legal. Sem ele, a apresentação segue direto para o mosaico de rostos.' },
  { id: 'rostos', rotulo: 'Cada rosto, uma história', ajuda: 'O mosaico de fotos da trajetória da casa. Sem ele, a apresentação segue direto para "O que ele leva".' }
];
const leva = (v.opcionais || []).find(o => o.id === 'leva');
if (leva) leva.ajuda = 'Resume o que ele recebe, com o nome e a foto dele. Sem ele, a apresentação vai direto para "O valor real".';
// a ordem final e a da apresentacao
const ORDEM = [...IDS, 'leva'];
if (!SEM_OPC) v.opcionais = [...OPC, ...(v.opcionais || [])].sort((a, b) => ORDEM.indexOf(a.id) - ORDEM.indexOf(b.id));
t = t.replace(re, (_, a, _b, c) => a + JSON.stringify(v, null, 2) + c);

// o contador estatico do HUD e a nota da variacao tecnica ("os mesmos 27 slides nas mesmas posicoes")
const total = antesN + inseridos;
t = t.replace(/(id="hud-pos">1 \/ )\d+</, '$1' + total + '<');
t = t.replace(/(os mesmos )\d+( slides nas mesmas pos)/g, '$1' + total + '$2');

const n = secoes(t);
console.log(rel + ': ' + antesN + ' -> ' + n + ' slides');
if (n !== total) throw new Error('esperava ' + total + ' slides, deu ' + n + ' (' + rel + ')');
fs.writeFileSync(arq, crlf ? t.replace(/\n/g, '\r\n') : t, 'utf8');
console.log('gravado ' + rel);
