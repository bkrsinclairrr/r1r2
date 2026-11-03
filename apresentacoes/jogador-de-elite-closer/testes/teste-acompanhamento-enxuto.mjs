// A Acompanhamento enxuta (03/11/2026, pedido do closer Pedro): 24 slides em vez de 32. A capa e o "Por que você" são um slide só, o Zyron
// e o vídeo dele são um slide só, e saíram os cinco verbos, o encaixe ("próximo Neymar"), o seu perfil em campo, as duas tabelas do
// olhômetro e as oportunidades do perfil. No plano de R$ 500 o David sai (entra Pedro ou Cleiton), o estrategista esportivo deixa de
// repetir o estrategista da linha de cima e "Gestão de carreiras" vira "Oportunidades". Confere a ordem, as fusões, o plano, o roteiro
// do apresentador e as regras da casa (24 px, nada fora do palco), com o painel e o deck locais.
// Uso: node --test testes/teste-acompanhamento-enxuto.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { RAIZES, sobe } from './servidor.mjs';
import { Cliente } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const raiz = RAIZES['r2-anterior'];
const caminho = '/variacoes/acompanhamento/';
// a ordem de origem (data-slide-origem) dos 24 slides; 'x' é o slide do acompanhamento diário, que se liga pelo data-roteiro
const ORDEM = ['2', '4', '5', '6', '7', '101', '102', '13', '107', '108', '14', '15', '104', '105', '106', '17', '18', '19', '20', '22', 'x', '24', '21', '25'];
const SAIRAM = ['1', '8', '9', '103', '10', '11', '12', '16'];
const html = fs.readFileSync(path.join(raiz, 'variacoes/acompanhamento/index.html'), 'utf8');

test('a página tem os 24 slides na ordem, sem os que saíram, e o Zyron com o vídeo no mesmo slide', () => {
  const secoes = [...html.matchAll(/<section\b[^>]*>/g)].map(m => (m[0].match(/data-slide-origem="(\d+)"/) || [])[1] || 'x');
  assert.deepEqual(secoes, ORDEM);
  for (const o of SAIRAM) assert.ok(!secoes.includes(o), 'saiu a origem ' + o);
  const zyron = html.match(/<section class="slide zy-slide"[\s\S]*?<\/section>/)[0];
  assert.match(zyron, /data-slide-origem="7"/);
  assert.match(zyron, /data-video="v-zyron"/);
  assert.match(zyron, /<video id="v-zyron"/);
  assert.equal((zyron.match(/<li data-t=/g) || []).length, 7, 'os sete capítulos do vídeo vão pro apresentador');
  assert.equal((html.match(/id="v-zyron"/g) || []).length, 1, 'um player só');
  assert.ok(!html.includes('\x08'), 'sem caractere de controle perdido no arquivo');
});

test('o manifesto diz 24 slides e o resumo não promete o que saiu', () => {
  const m = JSON.parse(fs.readFileSync(path.join(raiz, 'variacoes.json'), 'utf8'));
  const p = m.paginas.find(x => x.id === 'acompanhamento');
  assert.equal(p.slides, 24);
  assert.doesNotMatch(p.resumo, /clubes compatíveis/i);
});

test('na tela: abertura única, Zyron com vídeo, plano de R$ 500 sem o David e roteiro sincronizado', async () => {
  const s = await sobe({ deck: true, decks: ['r2-anterior'] });
  const nav = await abreNavegador();
  try {
    const admin = new Cliente(s.painel);
    await admin.entra(s.adminLogin, s.adminSenha);
    await admin.get('/api/versoes'); // a primeira leitura sincroniza com os decks
    const criado = await admin.post('/api/atletas', { etapa: 'r2', ficha: {
      nome: 'Lucas Almeida da Silva', posicao: 'zagueiro', idade: '15', cidade: 'Natal', plano: 'Assessoria de Elite Legacy',
      versao: 'r2a-acompanhamento', r2data: new Date(Date.now() + 864e5).toISOString().slice(0, 10), r2hm: '19:30' } });
    assert.equal(criado.status, 201, criado.texto);
    const a = await nav.aba(s.decks.r2 + '/?a=' + criado.j.t, { largura: 1920, altura: 1080 });
    assert.ok(await a.ate(`location.pathname === '${caminho}' && document.querySelectorAll('#stage > .slide').length > 0 && [...document.querySelectorAll('[data-bind="nome"]')].some(e => e.textContent === 'Lucas Silva')`, 20000));
    await a.avalia(`(() => { const st = document.createElement('style'); st.textContent = '*{animation:none!important;transition:none!important}.hud,.progress{display:none!important}'; document.head.appendChild(st); return 1; })()`);

    const d = await a.avalia(`(() => {
      const ss = [...document.querySelectorAll('#stage > .slide')];
      return { total: ss.length, origens: ss.map(x => x.dataset.slideOrigem || 'x'), roteiro: window.ROTEIRO.map(r => r.nome),
        texto: ss.map(x => x.textContent).join(' '), primeiro: ss[0].className, chapters: ss[4].querySelectorAll('.chapters li').length,
        player: !!ss[4].querySelector('#p-zyron video#v-zyron'), videoDoSlide: ss[4].dataset.video,
        hud: document.querySelector('#hud-pos').textContent, tudo: JSON.stringify([window.ROTEIRO, window.OBJECOES, window.PLANOS, window.CHECKLIST]),
        etapas: window.ETAPAS.flatMap(e => e.slides), objecoes: window.OBJECOES.flatMap(o => o.slides),
        garantia: window.OBJECOES.find(o => /Tem garantia/.test(o.q)).slides };
    })()`);
    assert.equal(d.total, 24);
    assert.deepEqual(d.origens, ORDEM);
    assert.equal(d.roteiro.length, 24, 'o roteiro tem um item por slide');
    assert.match(d.primeiro, /escolha-atleta/, 'a apresentação abre no slide de escolha (nome, foto e perfil)');
    assert.equal(d.roteiro[0], 'Abertura: por que você');
    assert.equal(d.roteiro[4], 'Zyron e o vídeo');
    assert.ok(d.player && d.videoDoSlide === 'v-zyron' && d.chapters === 7, 'o vídeo e os sete capítulos moram no slide do Zyron');
    assert.match(d.hud, /\/ 24$/);
    assert.deepEqual(d.roteiro.slice(-3), ['Os dois planos', 'Garantia incondicional', 'Bem-vindo']);

    // o que saiu não volta (o texto de cada slide que saiu)
    for (const re of [/este plano\s*é seu/i, /em cinco verbos/i, /próximo\s*Neymar/i, /talento precisa\s*de encaixe/i,
      /O olhômetro olha\. O\s*Zyron mede/i, /Peneira decide no\s*olhômetro/i, /seu jogo tem\s*um contexto/i, /Compatibilidades do seu relatório/i])
      assert.doesNotMatch(d.texto, re, 'não pode voltar: ' + re);

    // o roteiro: sem número velho, sem David, referências no lugar certo, avanços por extenso
    assert.doesNotMatch(d.tudo, /David|Willer/, 'o David saiu do roteiro, das objeções, dos planos e do checklist');
    assert.ok([...d.etapas, ...d.objecoes].every(n => n >= 1 && n <= 24), 'etapas e objeções só apontam pra slide que existe');
    assert.deepEqual(d.garantia, [23]);
    const r = await a.avalia(`(() => ({ zyron: window.ROTEIRO[4].atencao, metodo: window.ROTEIRO[5].fala.join(' '), eSe: window.ROTEIRO[3].atencao, abertura: window.ROTEIRO[0].fala.join(' ') }))()`);
    assert.match(r.zyron, /resposta ao olhômetro do 02/, 'a referência à tabela do olhômetro segue a posição nova');
    assert.match(r.zyron, /no 08: aqui, rode só/, 'e a do relatório com o vídeo do atleta');
    assert.match(r.metodo, /Primeiro avanço/);
    assert.match(r.metodo, /Segundo avanço/);
    assert.doesNotMatch(r.metodo, /Avanço \d/, 'o ordem-garantia trocaria "Avanço 2" por "Avanço 1"');
    assert.doesNotMatch(r.eSe, /slides 0\d a 0\d|\(10\)|\(11\)/, 'sem apontar pro campo e pra tabela que saíram');
    assert.match(r.abertura, /prazer\. Eu sou o gestor de carreiras/, 'a fala da capa foi pra abertura');
    assert.doesNotMatch(r.abertura, /slide 16/);

    // o plano de R$ 500: Pedro ou Cleiton, Oportunidades, e um estrategista só
    await a.avalia(`location.hash = '#22'; 1`);
    assert.ok(await a.ate(`document.querySelector('#stage > .slide.active').id === 'silencio'`));
    await a.avalia(`document.querySelectorAll('#silencio [data-step]').forEach(e => e.classList.add('shown')); 1`);
    await espera(300);
    const L = await a.avalia(`[...document.querySelectorAll('#silencio .pl-col.legacy .pl-vant p')].map(p => p.innerText.replace(/\\s+/g, ' ').trim())`);
    assert.equal(L.length, 8, 'oito linhas no Legacy: ' + JSON.stringify(L));
    assert.ok(L.some(l => /^Pedro ou Cleiton: assessoria individual todo mês e contato no WhatsApp\.$/.test(l)));
    assert.ok(L.some(l => /^Oportunidades: pelo menos 15 encaminhamentos por mês, no Brasil e no mundo\.$/.test(l)));
    assert.ok(!L.some(l => /David|Willer|Gestão de carreiras/i.test(l)), 'sem David nem "Gestão de carreiras"');
    assert.equal(L.filter(l => /estrategista/i.test(l)).length, 1, 'o estrategista aparece uma vez só');
    assert.ok(!L.some(l => /Estrategista esportivo/i.test(l)));
    assert.match(L[0], /^Estrategista e gerente de carreira: .*relatório e ligação toda semana.*sete módulos/);
    const preco = await a.avalia(`['legacy', 'scouting'].map(p => ['preco', 'parcela'].map(k => document.querySelector('#silencio [data-bind="' + p + '.' + k + '"]').textContent))`);
    assert.deepEqual(preco, [['R$ 500', 'R$ 50'], ['R$ 247,90', 'R$ 24,79']], 'os preços não mudaram');
    assert.ok(await a.avalia(`(() => { const st = document.querySelector('#stage').getBoundingClientRect();
      return [...document.querySelectorAll('#silencio .pl-vant p')].every(p => p.getBoundingClientRect().bottom < st.top + st.height * .94); })()`), 'todas as linhas cabem acima do rodapé');

    // as regras da casa nos slides novos e no do plano: texto de 24 px ou mais e nada fora do palco
    for (const n of [1, 5, 22]) {
      await a.avalia(`location.hash = '#${n}'; 1`);
      assert.ok(await a.ate(`[...document.querySelectorAll('#stage > .slide')].findIndex(x => x.classList.contains('active')) === ${n - 1}`));
      await a.avalia(`document.querySelectorAll('#stage > .slide.active [data-step]').forEach(e => e.classList.add('shown')); 1`);
      await espera(400);
      const A = await a.avalia(`(() => {
        const s = document.querySelector('#stage > .slide.active'), r = s.getBoundingClientRect(), pequenas = [], fora = [];
        const visivel = el => { for (let e = el; e && e !== s.parentElement; e = e.parentElement) { const cs = getComputedStyle(e);
          if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.5) return false; } return true; };
        const w = document.createTreeWalker(s, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) { const tx = w.currentNode, t = tx.textContent.trim(); if (!t) continue; const el = tx.parentElement; if (!visivel(el)) continue;
          if (parseFloat(getComputedStyle(el).fontSize) < 24) pequenas.push(t.slice(0, 30));
          const b = el.getBoundingClientRect(); if (b.width && (b.right > r.right + 3 || b.bottom > r.bottom + 3 || b.left < r.left - 3 || b.top < r.top - 3)) fora.push(t.slice(0, 30)); }
        return { pequenas, fora };
      })()`);
      assert.deepEqual(A, { pequenas: [], fora: [] }, 'slide ' + n + ': 24 px ou mais e nada fora do palco');
    }

    // a seta do "E se alguém visse cada lance seu?" (4) vai direto pro Zyron com o vídeo (5), e o 5 vai pro método (6)
    await a.avalia(`location.hash = '#4'; 1`); await espera(300);
    await a.avalia(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })); 1`);
    assert.ok(await a.ate(`document.querySelector('#stage > .slide.active').classList.contains('zy-slide')`), 'a seta vai pro Zyron com o vídeo');
    assert.ok(await a.avalia(`document.querySelector('#v-zyron').getAttribute('src') || document.querySelector('#v-zyron source').getAttribute('src')`).then(x => /zyron-filme\.mp4$/.test(x)));
    await a.avalia(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })); 1`);
    assert.ok(await a.ate(`document.querySelector('#stage > .slide.active').classList.contains('bl-metodo')`), 'e do Zyron vai pro método');

    // o apresentador: o roteiro do Zyron com o vídeo, os capítulos e a aba Ler antes sem número de slide que saiu
    const p = await nav.aba(s.decks['r2-anterior'] + caminho + '?presenter&a=' + criado.j.t + '#5', { largura: 1480, altura: 920 });
    assert.ok(await p.ate(`document.querySelector('#pz-notes') && document.querySelector('#pz-notes').textContent.includes('Zyron e o vídeo')`, 15000));
    assert.match(await p.avalia(`document.body.textContent`), /A leitura lance a lance/, 'o apresentador mostra os capítulos do vídeo');
    const ler = await p.avalia(`document.querySelector('#tab-ler').textContent`);
    assert.doesNotMatch(ler, /\b103\b|David/, 'a aba Ler antes não lista o que saiu');
    assert.ok(!a.console_.some(e => e.startsWith('EXC')) && !p.console_.some(e => e.startsWith('EXC')), 'sem exceções de script');
  } finally { await nav.fecha(); await s.fecha(); }
});
