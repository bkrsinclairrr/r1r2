// Gera assets/bloco-r1.css (o bloco.css com a paleta do R1: preto, dourado e azul, sem o laranja-sinal) a partir do bloco.css do R2 novo.
// O R1 tambem nao tem o avanco por passo do R2, entao leva as regras de [data-step] e as classes de cor dos titulos.
// Uso: node gera-bloco-r1-css.mjs <bloco.css do R2 novo> <saida: assets/bloco-r1.css do R1>
import fs from 'node:fs';

const [, , entrada, saida] = process.argv;
let css = fs.readFileSync(entrada, 'utf8').replace(/\r\n/g, '\n');
const TROCAS = [
  ['rgba(200,184,138,', 'rgba(201,162,74,'], ['rgba(127,196,234,', 'rgba(127,174,255,'], ['rgba(6,11,20,', 'rgba(7,8,10,'],
  ['rgba(226,85,43,', 'rgba(201,162,74,'], ['#FFD9CC', '#F3E3B8'], ['#0A1422', '#0A0D12'],
  ['var(--signal)', 'var(--gold)'], ['var(--sand-l)', 'var(--gold-l)'], ['var(--sand)', 'var(--gold)'], ['var(--ice)', 'var(--blue)']
];
for (const [a, b] of TROCAS) css = css.split(a).join(b);
const cab = '/* Bloco Voxen | Zyron para o R1 (17/10/2026): o bloco.css do R2 novo com a paleta do R1 (preto, dourado e azul; o olhometro vai em dourado,\n' +
  '   porque o laranja-sinal e so do R2). Gerado por ferramentas-r2/gera-bloco-r1-css.mjs: mudou o bloco.css? Gere de novo. */\n';
const extra = `
/* ---------- tema do R1 ---------- */
.bl-slide p{margin:0}
.bl-slide .sand-l{color:var(--gold-l)}
.bl-slide .ice{color:var(--blue)}
.bl-slide .sig{color:var(--gold)}
#bl-focog stop:nth-child(1){stop-color:rgba(201,162,74,.36)}
#bl-focog stop:nth-child(2){stop-color:rgba(201,162,74,.1)}
#bl-focog stop:nth-child(3){stop-color:rgba(201,162,74,0)}
/* o R1 nao tem o avanco por passo do R2: o campo revela o que tem data-step sozinho (data-bl-auto, em bloco.js) */
.bl-slide [data-step]{opacity:0;transform:translateY(14px);transition:opacity .4s ease,transform .4s ease}
.bl-slide [data-step].shown{opacity:1;transform:none}
@media print{.bl-slide [data-step]{opacity:1!important;transform:none!important}}
`;
fs.writeFileSync(saida, cab + css + extra, 'utf8');
console.log('gerado', saida, '(' + (cab + css + extra).length + ' bytes)');
