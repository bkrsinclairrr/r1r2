// A remoção de uma tela precisa manter o roteiro e os atalhos na mesma posição da apresentação.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sobe } from './servidor.mjs';
import { Cliente } from './_util.mjs';
import { abreNavegador, espera } from './_chrome.mjs';

test('a sequência sem o alinhamento mantém a oferta, a garantia e os atalhos sincronizados', async () => {
  const s=await sobe({deck:true,decks:['r2-anterior','r2-b','r1']});
  const nav=await abreNavegador();
  try {
    const admin=new Cliente(s.painel);await admin.entra(s.adminLogin,s.adminSenha);
    const versoes=(await admin.get('/api/versoes')).j.versoes.filter(v=>!v.criada);
    for(const v of versoes) {
      const a=await nav.aba(s.decks[v.deck]+v.caminho+'#3',{largura:1920,altura:1080});
      assert.ok(await a.ate(`document.querySelectorAll('#stage>.slide.active').length===1`),v.id);
      const anterior=v.deck==='r2-anterior';
      assert.equal(await a.avalia(`document.querySelectorAll('#stage>.slide').length`),anterior?32:v.deck==='r1'?20:35,v.id); // desde 18/10/2026: o dossiê e o inimigo em comum
      assert.ok(await a.avalia(`!window.ROTEIRO.some(r=>r?.nome==='O combinado')`),v.id);
      assert.equal(await a.avalia(`window.ROTEIRO.length`),anterior?32:v.deck==='r1'?20:35,v.id+': roteiro na mesma sequência');
      if(anterior) {
        assert.equal(await a.avalia(`document.querySelector('#stage>.slide.active').dataset.slideOrigem`),'4',v.id+': próximo conteúdo é a terceira tela');
        assert.equal(await a.avalia(`window.ROTEIRO[2].nome`),['r2a-tecnica','r2a-cl0'].includes(v.id)?'O que a observação deixa passar':'O olhômetro',v.id);
        const fim=await a.avalia(`(()=>{const ss=[...document.querySelectorAll('#stage>.slide')];return ss.slice(-3).map((sl,i)=>[sl.id,window.ROTEIRO[ss.length-3+i].nome])})()`);
        assert.deepEqual(fim,[['silencio',v.id==='r2a-acompanhamento'?'Os dois planos':'O investimento'],['','Garantia incondicional'],['','Bem-vindo']],v.id+': fechamento preservado');
        assert.equal(await a.avalia(`window.OBJECOES.find(o=>/Tem garantia/.test(o.q)).slides[0]`),31);
        assert.ok(await a.avalia(`window.ETAPAS.every(e=>e.slides.every(n=>n>=1&&n<=32))`));
        assert.match(await a.avalia(`window.ROTEIRO[4].atencao`), /slides 05 a 08/);
        assert.match(await a.avalia(`window.ROTEIRO[4].atencao`), v.id==='r2a-acompanhamento'?/O 11 e o 13/:/O 10 e o 13/);
        if(v.id==='r2a-principal') assert.match(await a.avalia(`window.OBJECOES.find(o=>o.q.startsWith('Já tentamos')).prev`), /slides 13 e 14/);
        const p=await nav.aba(s.decks[v.deck]+v.caminho+'?presenter#30');
        assert.ok(await p.ate(`document.querySelector('#pz-notes')?.textContent.includes(${JSON.stringify(v.id==='r2a-acompanhamento'?'Os dois planos':'O investimento')})`),v.id+': apresentador no preço correto');
        assert.ok(await p.avalia(`![...document.querySelectorAll('[data-go]')].some(e=>Number(e.dataset.go)>31)`),v.id+': atalhos não apontam para tela removida');
        await p.avalia(`document.querySelector('[data-tab="fech"]').click();document.querySelector('#tab-fech [data-go="31"]').click();1`);
        assert.ok(await p.ate(`document.querySelector('#pz-notes')?.textContent.includes('Bem-vindo')`),v.id+': atalho vai ao novo último slide');
        await Promise.race([p.envia('Page.close').catch(()=>{}),espera(500)]);
      }
      assert.deepEqual(a.console_.filter(e=>e.startsWith('EXC')),[],v.id);
      await Promise.race([a.envia('Page.close').catch(()=>{}),espera(500)]);
    }
  } finally {await nav.fecha();await s.fecha();}
});
