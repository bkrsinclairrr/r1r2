import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { sobe, RAIZES } from './servidor.mjs';
import { Cliente, fotosDeTeste, b64 } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

test('todas as páginas aceitam foto, ficha vazia e exibem a imagem em um único slide', async () => {
  const s = await sobe({ deck: true, decks: ['r2-anterior', 'r2-b', 'r1'] });
  const nav = await abreNavegador(), fotos = fotosDeTeste(RAIZES.r2);
  try {
    const admin = new Cliente(s.painel); await admin.entra(s.adminLogin, s.adminSenha);
    const versoes = (await admin.get('/api/versoes')).j.versoes;
    for (const v of versoes.filter(v=>!v.criada)) {
      assert.equal(v.recursos.foto, true, v.id+' oferece foto no painel');
      const c=await admin.post('/api/atletas',{etapa:v.etapa,ficha:{versao:v.id}});
      assert.equal(c.status,201,v.id+': campos opcionais');
      const t=c.j.t;
      assert.equal((await admin.put('/api/foto?t='+t,{retrato:b64(path.join(fotos,'retrato-a.jpg')),avatar:b64(path.join(fotos,'avatar-a.jpg')),autorizo:true})).status,200,v.id+': foto em qualquer etapa');
      const publico=await admin.get('/api/publico?id='+t); assert.equal(publico.j.foto.ok,true,v.id);
      const antes=(await admin.get('/api/atletas?t='+t)).j.registro;
      assert.equal((await admin.put('/api/atletas?t='+t,{base:antes.fichaEm,ficha:{nome:'Gabriel Rocha da Silva',versao:v.id,caracteristicas:'Atleta com boa leitura de jogo, domínio em espaços curtos e presença no meio-campo. Busca desenvolver a tomada de decisão e a consistência em cada partida.'}})).status,200);
      const a=await nav.aba(s.decks[v.deck]+v.caminho+'?a='+t+'#2',{largura:1920,altura:1080});
      assert.ok(await a.ate(`document.querySelector('#stage>.slide.active img[data-src="selecaoFotoUrl"]')?.naturalWidth>0`),v.id+': foto no slide de escolha');
      const fotoEm=await a.avalia(`[...document.querySelectorAll('#stage>.slide')].flatMap((sl,i)=>[...sl.querySelectorAll('img')].some(img=>/api\\/foto/.test(img.src))?[i+1]:[])`);
      assert.deepEqual(fotoEm,[2],v.id+': foto somente no slide 2');
      assert.match(await a.avalia(`document.querySelector('#stage>.slide.active').innerText`),/Gabriel|GABRIEL/);
      assert.match(await a.avalia(`document.querySelector('.escolha-retrato-rodape strong').innerText`),/Gabriel|GABRIEL/);
      await a.avalia('document.fonts.ready.then(()=>1)'); await espera(500);
      assert.ok(await a.avalia(`document.querySelector('.escolha-texto').getBoundingClientRect().bottom < document.querySelector('.escolha-legal').getBoundingClientRect().top - 10`), v.id+': contexto e nome cabem no slide');
      assert.equal(await a.avalia(`document.querySelectorAll('.formacao-atleta').length`),1);
      assert.match(await a.avalia(`document.querySelector('.formacao-atleta').textContent`),/7[\s\S]*módulos/);
      const modulo=await a.avalia(`[...document.querySelectorAll('#stage>.slide')].findIndex(s=>s.classList.contains('formacao-atleta'))+1`);
      await a.avalia(`location.hash='#${modulo}';1`); await espera(400);
      assert.ok(await a.avalia(`document.querySelector('.formacao-intro h2').getBoundingClientRect().bottom < document.querySelector('.formacao-grid').getBoundingClientRect().top`), v.id+': título dos módulos cabe no slide');
      if(process.env.CAPTURAS) {fs.mkdirSync(process.env.CAPTURAS,{recursive:true});await espera(1000);await a.foto(path.join(process.env.CAPTURAS,v.id+'-modulos.png'));}
      await a.avalia(`location.hash='#2';1`); await espera(400);
      if(v.etapa==='r2') {
        assert.equal(await a.avalia(`window.PLANOS.find(p=>p.id==='scouting').nome`),'Scout PRO');
        assert.ok(await a.avalia(`window.PLANOS.find(p=>p.id==='scouting').vantagens.some(x=>/sete|7/i.test(x.join(' ')))`),'sete módulos no Scout PRO');
      }
      assert.ok(!a.console_.some(e=>e.startsWith('EXC')));
      if(process.env.CAPTURAS) {fs.mkdirSync(process.env.CAPTURAS,{recursive:true});await a.avalia('document.fonts.ready.then(()=>1)');await espera(2400);await a.foto(path.join(process.env.CAPTURAS,v.id+'.png'));}
      await Promise.race([a.envia('Page.close').catch(()=>{}),espera(700)]);
    }
    // Foto pelo próprio painel, antes de preencher a ficha.

    const a=await nav.aba(s.painel+'/#/novo-r1');
    assert.ok(await a.ate(`!document.querySelector('#v-entrar').hidden`));
    await a.avalia(`(()=>{const f=document.querySelector('#f-entrar');f.login.value=${JSON.stringify(s.adminLogin)};f.senha.value=${JSON.stringify(s.adminSenha)};f.requestSubmit();return 1})()`);
    assert.ok(await a.ate(`!document.querySelector('#v-editor').hidden`));
    assert.equal(await a.avalia(`document.querySelectorAll('#f-editor [required]').length`),0);
    assert.equal(await a.avalia(`document.querySelector('#s-foto').hidden`),false);
    assert.equal(await a.avalia(`document.querySelector('#ft-zona').hidden`),false);
    await a.arquivos('#ft-arquivo',[path.join(fotos,'retrato-a.jpg')]);
    assert.ok(await a.ate(`!document.querySelector('#ft-recorte').hidden`),await a.avalia(`document.querySelector('#ft-erro').textContent`));
    await a.avalia(`document.querySelector('#ft-autoriza').click();document.querySelector('#ft-salvar').click();1`);
    assert.ok(await a.ate(`!document.querySelector('#ft-atual').hidden && location.hash.startsWith('#/r2/') && location.hash.length===31`), 'foto cria apresentação sem exigir os campos: '+JSON.stringify(await a.avalia(`({foto:document.querySelector('#ft-erro').textContent,ficha:document.querySelector('#ed-erro').textContent,aviso:document.querySelector('#aviso').textContent,hash:location.hash})`)));
    assert.equal(await a.avalia(`document.querySelector('#f-editor [name="nome"]').value`),'');
    await a.avalia(`location.hash='#/novo/r2a-acompanhamento';1`); await espera(400);
    await a.avalia(`document.querySelector('#ed-salvar').click();1`);
    assert.ok(await a.ate(`location.hash.startsWith('#/r2/') && location.hash.length===31 && !document.querySelector('#s-link').hidden`));
    assert.equal(await a.avalia(`document.querySelector('#f-editor [name="nome"]').value`),'');
    assert.ok(!a.console_.some(e=>e.startsWith('EXC')));
  } finally {await nav.fecha();await s.fecha();fs.rmSync(fotos,{recursive:true,force:true});}
});
