// O inventário da loja de Blob do painel (20/10/2026) e, só com --apagar, a limpeza dos vídeos que sobraram de antes das 24 horas.
// Por padrão SÓ LISTA (não apaga nada): o total por pasta (fotos/, videos/, mapas/, atletas/, indices/, chamadas/ e os arquivos da raiz) e,
// por lead (pelo código, nunca pelo nome), cada arquivo de vídeo com o tamanho, a idade e se o registro do lead ainda aponta pra ele.
// Com --apagar: apaga o vídeo (e a capa) com mais de 25 horas e o que o registro não aponta mais (órfão ou sobra de envio). O registro não muda:
// o vídeo vencido já não é servido. Rode o inventário, confira, e só então rode com --apagar.
// Precisa do BLOB_READ_WRITE_TOKEN da loja deste painel. Na pasta do painel:
//   npx vercel env pull .env.blob --environment=production
//   node --env-file=.env.blob limpa-videos-da-loja.mjs            (só lista)
//   node --env-file=.env.blob limpa-videos-da-loja.mjs --apagar   (apaga)
//   apague o .env.blob no fim (o .gitignore e o .vercelignore seguram, mas não deixe o token no disco)
// Custo: uma listagem da loja inteira (operação avançada, de 1.000 em 1.000 arquivos) e a leitura do registro de quem tem vídeo. O del é de graça.
// Fica fora do deploy (.vercelignore).
import { list, get, del } from '@vercel/blob';

const APAGAR = process.argv.includes('--apagar');
const T_OK = /^[a-z2-7]{26}$/;
const H = 3600e3, LIMITE_H = 25;
if (!process.env.BLOB_READ_WRITE_TOKEN) { console.error('Falta o BLOB_READ_WRITE_TOKEN (rode com node --env-file=.env.blob, veja o começo deste arquivo).'); process.exit(1); }
const mb = n => (n / 1048576).toFixed(1).replace('.', ',') + ' MB';

const todos = [];
let cursor;
do {
  const pag = await list({ cursor, limit: 1000 });
  todos.push(...pag.blobs);
  cursor = pag.hasMore ? pag.cursor : undefined;
} while (cursor);

const pastas = {};
for (const b of todos) {
  const p = b.pathname.includes('/') ? b.pathname.split('/')[0] + '/' : '(raiz)';
  const o = pastas[p] || (pastas[p] = { arquivos: 0, bytes: 0 });
  o.arquivos++; o.bytes += b.size;
}
console.log('Loja do painel: ' + todos.length + ' arquivos, ' + mb(todos.reduce((s, b) => s + b.size, 0)) + '\n');
console.log('Por pasta:');
Object.entries(pastas).sort((a, b) => b[1].bytes - a[1].bytes).forEach(([p, o]) => console.log('  ' + p.padEnd(12) + String(o.arquivos).padStart(5) + ' arquivos  ' + mb(o.bytes).padStart(10)));

// os vídeos, por lead
const videos = todos.filter(b => b.pathname.startsWith('videos/'));
const porLead = new Map();
videos.forEach(b => { const t = b.pathname.split('/')[1]; if (!porLead.has(t)) porLead.set(t, []); porLead.get(t).push(b); });
const fora = [];
console.log('\nVídeos e capas, por lead (código):');
for (const [t, arqs] of porLead) {
  let reg = null;
  if (T_OK.test(t)) {
    try { const r = await get('atletas/' + t + '.json', { access: 'private', useCache: false }); if (r && r.statusCode === 200) reg = JSON.parse(await new Response(r.stream).text()); } catch { reg = null; }
  }
  const v = reg && reg.video;
  const atuais = v ? [v.arquivo, v.poster].filter(Boolean) : [];
  console.log('  ' + t.slice(0, 8) + '…' + (reg ? '' : '  (lead não existe mais)') + (v && v.venceEm ? '  vence ' + new Date(v.venceEm).toISOString().slice(0, 16).replace('T', ' ') + ' UTC' : ''));
  for (const b of arqs) {
    const idade = (Date.now() - new Date(b.uploadedAt).getTime()) / H;
    const aponta = atuais.includes(b.pathname);
    const sai = !reg || !aponta || idade > LIMITE_H;
    if (sai) fora.push(b);
    console.log('    ' + b.pathname.split('/').pop().padEnd(34) + mb(b.size).padStart(10) + '  ' + idade.toFixed(1).replace('.', ',') + ' h' + (aponta ? '  (o registro aponta)' : '  (órfão ou sobra)') + (sai ? '  → sai' : ''));
  }
}
const total = fora.reduce((s, b) => s + b.size, 0);
console.log('\n' + fora.length + ' arquivo(s) de vídeo pra sair (' + mb(total) + '): mais de ' + LIMITE_H + ' horas, órfão ou sobra de envio.');
if (!APAGAR) { console.log('Nada foi apagado. Confira a lista e rode de novo com --apagar.'); process.exit(0); }
for (let i = 0; i < fora.length; i += 500) await del(fora.slice(i, i + 500).map(b => b.url));
console.log('Apagados: ' + fora.length + ' arquivo(s), ' + mb(total) + '.');
