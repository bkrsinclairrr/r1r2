// Dossiê preparado antes da call: campos do painel, foto autorizada, relatório e oportunidades do atleta.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { RAIZES, sobe } from './servidor.mjs';
import { Cliente, fotosDeTeste, b64 } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

const raiz = RAIZES['r2-anterior'], pagina = '/variacoes/acompanhamento/';

test('a oferta tem resposta completa, relatório sem vídeo e ancoragem de R$20 mil', () => {
  const html = fs.readFileSync(path.join(raiz, 'variacoes/acompanhamento/index.html'), 'utf8');
  const slides = html.match(/<section class="slide(?: [^"]+)?"[\s\S]*?<\/section>/g);
  assert.equal(slides.length, 24, 'a oferta está no slide 22 (desde 03/11/2026 a página tem 24 slides: sem a capa, os cinco verbos, o encaixe, o seu perfil em campo, as duas tabelas do olhômetro e as oportunidades; o Zyron e o vídeo são um slide só)');
  assert.ok(!/<td class="c3"><\/td>/.test(slides[1]), 'A resposta tem conteúdo em todas as linhas');
  assert.doesNotMatch(slides[7], /v-atleta|data-video|ao vivo|nesta chamada|data-rl|Resultado aparece/i);
  const valores = [...slides[15].matchAll(/data-valor="(\d+)"/g)].map(m => Number(m[1]));
  assert.equal(valores.reduce((a, b) => a + b, 0), 20000);
  assert.doesNotMatch(slides[15], /30\.000/);
  assert.match(slides[21], /data-bind="nome"/);
});

test('o painel guarda o relatório e os matches, entrega só à oferta e mostra foto sem vídeo', async () => {
  const s = await sobe({ deck: true, decks: ['r2-anterior', 'r1'] });
  const nav = await abreNavegador();
  const fotos = fotosDeTeste(RAIZES.r2);
  try {
    const admin = new Cliente(s.painel); await admin.entra(s.adminLogin, s.adminSenha);
    const lista = (await admin.get('/api/versoes')).j.versoes;
    const v = lista.find(v => v.id === 'r2a-acompanhamento');
    assert.equal(v.recursos.foto, true); assert.equal(v.recursos.leitura, false);
    const criado = await admin.post('/api/atletas', { ficha: {
      nome: 'Gabriel Rocha da Silva', posicao: 'meia', idade: '19', cidade: 'Brasília', pe: 'Esquerdo', altura: '178',
      plano: 'Assessoria de Elite Legacy', versao: v.id, r2data: new Date(Date.now() + 864e5).toISOString().slice(0, 10), r2hm: '19:30',
      zyronCategoria: 'Sub-20', zyronResumo: 'Passe e leitura de jogo são os pontos fortes.', zyronFoco: 'Acelerar a decisão no último terço.',
      zyronGeral: '87', zyronPasse: '93', zyronLeitura: '92', zyronDominio: '91', zyronAtaque: '0',
      zyronDefesa: '101', zyronChute: '-1', zyronDrible: '99.5',
      match1Clube: 'Estoril Praia', match1Pais: 'Portugal', match1Liga: 'Primeira Liga', match1Posicao: 'Meia-atacante',
      match1Categoria: 'Sub-20', match1Compatibilidade: '96', match1Motivo: 'Perfil técnico compatível com a função de criação.',
      match2Clube: 'Clube de Teste', match2Pais: 'Brasil', match2Motivo: '<b>Perfil da posição</b>', match2Compatibilidade: '200'
    } });
    assert.equal(criado.status, 201, criado.texto); const t = criado.j.t;
    const ficha = criado.j.registro.ficha;
    assert.equal(ficha.zyronGeral, '87'); assert.equal(ficha.zyronAtaque, '0');
    assert.equal(ficha.zyronDefesa, undefined); assert.equal(ficha.zyronChute, undefined); assert.equal(ficha.zyronDrible, undefined);
    assert.equal(ficha.match2Compatibilidade, undefined); assert.equal(ficha.match2Motivo, 'Perfil da posição');
    const salvo = await admin.put('/api/foto?t=' + t, { retrato: b64(path.join(fotos, 'retrato-a.jpg')), avatar: b64(path.join(fotos, 'avatar-a.jpg')), autorizo: true });
    assert.equal(salvo.status, 200, salvo.texto);
    const atual = (await admin.get('/api/atletas?t=' + t)).j.registro;
    const completo = { ...atual.ficha, zyronDefesa: '80', zyronChute: '84', zyronDrible: '90', zyronMarcacao: '78', zyronFinalizacao: '86', zyronVelocidade: '85',
      zyronResumo: 'Passe e leitura de jogo são os pontos fortes. Mantém boa visão dos espaços, aproxima os setores e encontra opções para acelerar a circulação da bola. A leitura preparada orienta o desenvolvimento dentro do seu perfil.',
      zyronFoco: 'Acelerar a decisão no último terço, escolher o momento do passe vertical e manter constância na recomposição. Trabalhar essa prioridade na rotina com a equipe.',
      match3Clube: 'Terceiro Clube', match3Pais: 'Brasil', match3Liga: 'Competição de teste', match3Posicao: 'Meia-atacante', match3Categoria: 'Sub-20', match3Compatibilidade: '88',
      match3Motivo: 'Perfil compatível com a função de criação entre linhas, circulação de bola e participação no último terço. A equipe valida o cenário antes de encaminhar o atleta.' };
    assert.equal((await admin.put('/api/atletas?t=' + t, { ficha: completo, base: atual.fichaEm })).status, 200);
    const publico = await admin.get('/api/publico?id=' + t);
    assert.equal(publico.j.ficha.match1Clube, 'Estoril Praia'); assert.equal(publico.j.foto.ok, true); assert.equal(publico.j.video, undefined);
    const comum = await admin.post('/api/atletas', { ficha: { nome: 'Pedro Silva', plano: 'Scout PRO', versao: 'r2a-principal', zyronGeral: '87' } });
    assert.equal((await admin.get('/api/publico?id=' + comum.j.t)).j.ficha.zyronGeral, undefined, 'outros decks não recebem o relatório');
    const vazio = await admin.post('/api/atletas', { ficha: { nome: 'Ana Silva', plano: 'Scout PRO', versao: v.id } });
    assert.equal(vazio.status, 201);
    const url = s.decks['r2-anterior'] + pagina + '?a=' + t;
    const a = await nav.aba(url + '#8', { largura: 1920, altura: 1080 });
    assert.ok(await a.ate(`document.querySelector('#stage > .slide.active [data-dossie="indicadores"]')?.textContent.includes('93')`));
    // desde 18/10/2026 a foto autorizada vai pros quadros do dossiê (abertura, relatório, dossiê, oferta e Bem-vindo), não só pro slide 02
    assert.ok(await a.ate(`/api\\/foto/.test(document.querySelector('#stage>.slide.active img[data-src="avatarUrl"]').getAttribute('src')||'')`), 'a foto aparece no avatar do relatório');
    assert.equal(await a.avalia(`document.querySelectorAll('#stage > .slide.active .zx-indicador').length`), 10);
    const limites = await a.avalia(`(() => {const box=e=>({classe:e.className,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,altura:e.offsetHeight});return [document.querySelector('.zx-report'),document.querySelector('.zx-topbar'),document.querySelector('.zx-report-ident'),document.querySelector('.zx-tabs'),...document.querySelectorAll('.zx-report-main > .zx-card')].map(box)})()`);
    assert.ok(limites.slice(4).every(e=>e.bottom<limites[0].bottom-10), 'o relatório completo cabe no quadro: '+JSON.stringify(limites));
    const texto = await a.avalia(`document.querySelector('#stage > .slide.active').innerText`);
    assert.match(texto, /Gabriel/); assert.match(texto, /87/); assert.doesNotMatch(texto, /Gabriel Rocha(?! da Silva)|ao vivo|vídeo do atleta/i);
    // o relatório (8) leva o primeiro clube, em destaque; o slide das oportunidades (os três clubes) saiu em 03/11/2026, então os outros ficam só no painel
    assert.match(texto, /Estoril Praia/); assert.match(texto, /96%/);
    assert.ok(await a.avalia(`document.querySelector('#stage > .slide.active [data-dossie="destaque"]').getBoundingClientRect().bottom<document.querySelector('#stage').getBoundingClientRect().bottom-85`), 'o clube em destaque cabe no relatório');
    assert.ok(await a.avalia(`![...document.querySelectorAll('#stage > .slide')].some(sl => /Clube de Teste|Terceiro Clube/.test(sl.textContent))`), 'os outros clubes do painel não aparecem em slide nenhum');
    const longo = { ...completo };
    for (const n of [1, 2, 3]) Object.assign(longo, { ['match'+n+'Clube']: 'Clube de Futebol da Cidade e Associação Esportiva de Formação', ['match'+n+'Liga']: 'Campeonato Nacional de Futebol da Segunda Divisão', ['match'+n+'Posicao']: 'Meia-atacante pelo lado esquerdo', ['match'+n+'Categoria']: 'Sub-20 e equipe de desenvolvimento', ['match'+n+'Motivo']: completo.match3Motivo });
    const baseLonga = (await admin.get('/api/atletas?t='+t)).j.registro.fichaEm;
    assert.equal((await admin.put('/api/atletas?t='+t,{ficha:longo,base:baseLonga})).status,200);
    const extensa = await nav.aba(url+'#8',{largura:1920,altura:1080});
    assert.ok(await extensa.ate(`document.querySelector('.zx-report [data-dossie="destaque"] .zx-match')`));
    await espera(250);
    assert.ok(await extensa.avalia(`(() => {const r=document.querySelector('.zx-report').getBoundingClientRect();return [...document.querySelectorAll('.zx-report-main > .zx-card')].every(e=>e.getBoundingClientRect().bottom<r.bottom-10)})()`), 'o relatório e o clube com textos longos cabem no quadro');
    await extensa.avalia('location.hash="#1";1'); await espera(250);
    await extensa.envia('Network.enable'); await extensa.envia('Network.setCacheDisabled', { cacheDisabled: true });
    await extensa.envia('Network.setBlockedURLs', { urls: ['*/api/foto*'] }); await extensa.envia('Page.reload', { ignoreCache: true });
    assert.ok(await extensa.ate(`document.querySelector('#stage>.slide.active .escolha-inicial span')?.textContent==='GS' && getComputedStyle(document.querySelector('#stage>.slide.active .escolha-inicial')).display==='flex' && !document.querySelector('#stage>.slide.active img[data-src="selecaoFotoUrl"]').getAttribute('src')`), 'foto indisponível usa inicial e remove a imagem quebrada');
    const depoisLonga = (await admin.get('/api/atletas?t='+t)).j.registro.fichaEm;
    assert.equal((await admin.put('/api/atletas?t='+t,{ficha:completo,base:depoisLonga})).status,200);
    for (const n of [1, 8, 9, 22, 24]) { // desde 03/11/2026: a abertura (1), o relatório (8), o dossiê do atleta (9), a oferta (22) e o Bem-vindo (24) têm a foto
      await a.avalia(`location.hash='#${n}';1`); await espera(250);
      assert.ok(await a.avalia(`[...document.querySelectorAll('#stage>.slide.active img')].some(i=>/api\\/foto/.test(i.src))`), 'foto no quadro do slide ' + n);
    }
    assert.ok(await a.avalia(`document.querySelectorAll('#stage video#v-atleta').length === 0`));
    assert.ok(await a.avalia(`![...performance.getEntriesByType('resource')].some(r => /api\\/video/.test(r.name))`), 'não pede vídeo do lead');
    await a.avalia('location.hash="#22";1'); await espera(300);
    assert.match(await a.avalia(`document.querySelector('#silencio .titulo-oferta').innerText`), /^Gabriel Silva, você foi escolhido/i);
    const sem = await nav.aba(s.decks['r2-anterior'] + pagina + '?a=' + vazio.j.t + '#8');
    assert.ok(await sem.ate(`document.querySelector('[data-bind="nome"]').textContent === 'Ana Silva'`));
    assert.doesNotMatch(await sem.avalia(`document.querySelector('#stage > .slide.active').innerText`), /Estoril|96%|Gabriel/);
    assert.match(await sem.avalia(`document.querySelector('#stage > .slide.active').innerText`), /compatibilidade|perfil/i);
    await a.avalia('location.hash="#8";1'); await espera(400);
    assert.match(await a.avalia(`document.querySelector('#stage > .slide.active').innerText`), /Gabriel[\s\S]*93/, 'abrir outra atleta não altera esta apresentação');
    const ui = await nav.aba(s.painel + '/#/r2/' + t);
    await ui.avalia(`(() => { const f=document.querySelector('#f-entrar');f.login.value=${JSON.stringify(s.adminLogin)};f.senha.value=${JSON.stringify(s.adminSenha)};f.requestSubmit();return 1;})()`);
    assert.ok(await ui.ate(`document.querySelector('#f-editor [name="match1Clube"]')?.value === 'Estoril Praia'`));
    assert.equal(await ui.avalia(`document.querySelector('#s-dossie').hidden`), false);
    assert.equal(await ui.avalia(`document.querySelector('#va-lances').hidden`), true, 'na Acompanhamento, sem marcar lances (a variação não tem a IA na Prática)');
    await ui.avalia(`const geral=document.querySelector('#f-editor [name="zyronGeral"]');geral.value='101';geral.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#ed-salvar').click();1`);
    assert.ok(await ui.ate(`/0 a 100/.test(document.querySelector('#ed-erro').textContent)`), 'nota inválida é explicada antes de salvar');
    assert.equal((await admin.get('/api/publico?id=' + t)).j.ficha.zyronGeral, '87');
    await ui.avalia(`{const geral=document.querySelector('#f-editor [name="zyronGeral"]');geral.value='87';geral.dispatchEvent(new Event('input',{bubbles:true}));}1`);
    await ui.avalia(`const c=document.querySelector('#f-editor [name="match1Clube"]');c.value='Novo Clube';c.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#ed-salvar').click();1`);
    assert.ok(await ui.ate(`/salv[oa]/i.test(document.querySelector('#aviso').textContent)`));
    assert.equal((await admin.get('/api/publico?id=' + t)).j.ficha.match1Clube, 'Novo Clube');
    const apresentador = await nav.aba(url+'&presenter#8');
    assert.ok(await apresentador.ate(`document.querySelector('#pz-painel')?.textContent.includes('Gabriel')`));
    assert.doesNotMatch(await apresentador.avalia(`document.querySelector('#pz-painel').textContent`), /leitura ao vivo|Sem vídeo/i);
    assert.doesNotMatch(await apresentador.avalia(`document.querySelector('#tab-ler').textContent`), /sem vídeo, o \d+ é a leitura ao vivo/i);
    if (process.env.CAPTURAS) {
      fs.mkdirSync(process.env.CAPTURAS, { recursive: true });
      await a.avalia(`const css=document.createElement('style');css.textContent='*,*::before,*::after{transition:none!important;animation:none!important}';document.head.append(css);1`);
      for (const n of [1, 3, 5, 8, 9, 22]) { await a.avalia(`location.hash='#${n}';1`); assert.ok(await a.ate(`document.querySelector('#stage > .slide.active')===document.querySelector('#stage > .slide:nth-child(${n})')`)); await a.avalia(`document.querySelectorAll('#stage > .slide:nth-child(${n}) [data-step]').forEach(e=>e.classList.add('shown'));1`); await espera(350); await a.foto(path.join(process.env.CAPTURAS, 'slide-' + n + '.png')); }
      await ui.avalia(`document.querySelector('#s-dossie').scrollIntoView({block:'start'});1`); await espera(200);
      await ui.foto(path.join(process.env.CAPTURAS, 'painel.png'));
    }
    assert.ok(!a.console_.some(e => e.startsWith('EXC')) && !ui.console_.some(e => e.startsWith('EXC')));
  } finally { await nav.fecha(); await s.fecha(); fs.rmSync(fotos, { recursive: true, force: true }); }
});
