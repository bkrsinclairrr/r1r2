/* A base do Zyron no slide 10 (O seu lugar em campo): os dez clubes parceiros de sempre, com o país, na faixa
   ao lado do cartão do atleta (#clubes). Até 08/10/2026 eram dois desenhos (o encaixe, no antigo 10, e a rede de
   clubes com o atleta no centro, no antigo 11); na reformulação, viraram uma peça só, com o campo do atleta.
   Os clubes e os países são os mesmos da rede antiga, na mesma ordem: não acrescente nem troque nenhum.
   Carrega antes de assets/deck.js. O campo com o atleta marcado é do deck.js, porque depende da ficha. */
(function () {
  'use strict';
  const CLUBES = [
    ['Sport', 'Brasil'], ['Hertha BSC', 'Alemanha'], ['Ceará', 'Brasil'],
    ['Hannover 96', 'Alemanha'], ['Goiás', 'Brasil'], ['Wigan Athletic', 'Inglaterra'],
    ['Avaí', 'Brasil'], ['Darmstadt 98', 'Alemanha'], ['Ponte Preta', 'Brasil'],
    ['Náutico', 'Brasil']
  ];
  const lista = document.getElementById('clubes');
  if (!lista) return;
  lista.innerHTML = CLUBES.map(([clube, pais]) => '<li><b>' + clube + '</b><span>' + pais + '</span></li>').join('');
})();
