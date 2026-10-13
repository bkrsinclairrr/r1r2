/* Depois do roteiro da página: a posição do HTML também é a posição do apresentador.
   data-slide-origem aponta pro roteiro de antes; as páginas novas usam ROTEIROS_EXTRAS. */
(function () {
  'use strict';
  const antigos = window.ROTEIRO;
  const slides = Array.from(document.querySelectorAll('#stage > .slide'));
  const mapa = {};
  slides.forEach((s, i) => { if (s.dataset.slideOrigem) mapa[Number(s.dataset.slideOrigem)] = i + 1; });
  const texto = t => String(t).replace(/\b(slides? |no |do |pro |o |e o )(0?[1-9]|1\d|2[0-5])\b/g,
    (m, p, n) => mapa[Number(n)] ? p + String(mapa[Number(n)]).padStart(n.length, '0') : m)
    .replace(/garantia antes do número/gi, 'garantia depois dos preços')
    .replace(/A garantia vem antes do número de propósito[^.]*\./g, 'A garantia vem depois dos preços e antes do Bem-vindo.')
    .replace(/se vocês aplicarem o método e (?:entenderem que )?não (?:faz|fizer) sentido/gi, 'se não fizer sentido')
    .replace(/aplicou o método e não fez sentido/gi, 'não fez sentido')
    .replace(/Pra acionar, a família comprova que aplicou o método[^.]*\./g, 'A devolução não exige comprovar aplicação do método.')
    .replace(/Vocês mostram que aplicaram o método, como tá no contrato, e o valor volta inteiro\./g, 'Peçam a devolução dentro do prazo informado: o valor volta inteiro, sem comprovar aplicação do método.');
  const adapta = v => typeof v === 'string' ? texto(v) : Array.isArray(v) ? v.map(adapta) :
    v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, adapta(x)])) : v;
  const garantia = {
    nome: 'Garantia incondicional', min: 1,
    fala: ['"[pai], [mãe], o investimento não precisa virar uma aposta. Se não fizer sentido, vocês pedem a devolução dentro do prazo da garantia e recebem todo o valor de volta."',
      '"Não precisa provar treino, resultado ou aplicação do método. A garantia é do investimento, não de contratação por um clube."',
      'Se o prazo estiver preenchido: "O prazo é [prazo da garantia]." Confira o prazo efetivo antes da call.'],
    perguntas: ['Ficou claro como funciona a devolução?'], crm: [],
    atencao: 'Depois dos preços, antes do Bem-vindo. Informe o prazo da operação. Sem prazo confirmado, não invente um. Não condicione a devolução à aplicação do método e não prometa contratação.'
  };
  window.ROTEIRO = slides.map(s => s.dataset.slideOrigem === '21' ? garantia :
    adapta(s.dataset.roteiro ? (window.ROTEIROS_EXTRAS || {})[s.dataset.roteiro] : antigos[Number(s.dataset.slideOrigem) - 1]));
  window.ETAPAS = (window.ETAPAS || []).map(e => ({ ...e, slides: e.slides.map(n => mapa[n]).filter(Boolean) }));
  window.OBJECOES = (window.OBJECOES || []).map(o => ({ ...adapta(o), slides: [...new Set(o.slides.map(n => mapa[n]).filter(Boolean))] }));
  const obj = window.OBJECOES.find(o => /Tem garantia/.test(o.q));
  if (obj) { obj.prev = 'Garantia incondicional depois dos preços e antes do Bem-vindo.';
    obj.resposta = garantia.fala.slice(0, 2); }
  // A aba Ler antes usa só números de slide, sem números comerciais.
  window.R2_REFERENCIA = t => String(t).replace(/\b(0?[1-9]|1\d|2[0-5])\b/g,
    (n) => mapa[Number(n)] ? String(mapa[Number(n)]).padStart(n.length, '0') : n);
})();
