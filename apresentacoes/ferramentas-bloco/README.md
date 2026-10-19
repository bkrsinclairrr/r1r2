# Bloco da página institucional: as ferramentas

Os seis slides que vieram da página `/institucional` (aizyron.com/institucional) entram nos decks por estes scripts, para o texto de um lugar só valer nos quatro decks. Rodam com o Node, sem instalar nada. Todos os comandos abaixo partem da pasta `apresentacoes`.

Os seis slides: o método (a IA encontra, a gente conduz), o campo olhômetro × IA (com dois botões que o closer clica), o encaixe ("você não precisa ser o próximo Neymar", com o radar), os 326 atletas enviados, os clubes e parceiros e o mosaico "cada rosto, uma história".

| Arquivo | O que faz |
| --- | --- |
| `gera-bloco.mjs` | Gera o HTML dos seis slides. Os textos da tela estão dentro dele. Opções: `tom` (`tecnica` troca "olhômetro" por "observação"), `origem` (decks com `data-slide-origem`), `opcional` e `tema` (`r1`). |
| `aplica-bloco.mjs` | Põe os slides numa página, liga o CSS e o JS e declara os opcionais no bloco `r2-variacao`. Com `--refaz`, tira o bloco que já está na página e gera de novo. |
| `gera-bloco-roteiro.mjs` | Gera `assets/bloco-roteiro.js` e `assets/bloco-roteiro-tecnica.js` do R2 anterior (`window.ROTEIROS_EXTRAS`), a partir do roteiro do R2 novo. |
| `gera-bloco-r1-css.mjs` | Gera `assets/bloco-r1.css` (a paleta preto, dourado e azul do R1) a partir do `bloco.css` do R2 novo. |

Onde cada deck leva o bloco:

| Deck | Slides | Opcionais no painel | Comando |
| --- | --- | --- | --- |
| R2 novo | 10, 13, 14, 24, 25 e 26 (eram 22, 23 e 24 até o dossiê e o inimigo em comum entrarem no 18 e no 19, em 18/10/2026) | sim, os seis | `node ferramentas-bloco/aplica-bloco.mjs jogador-de-elite-r2-novo index.html assets/ --refaz` e, na técnica, `... variacoes/tecnica/index.html ../../assets/ --tom=tecnica --refaz` |
| R2 B | os mesmos | não (o deck não tira slide) | os mesmos comandos, com `--sem-opcional` |
| R2 anterior (principal, técnica e acompanhamento) | 9, 11, 12, 21, 22 e 23 (na acompanhamento, 9, 10, 12, 21, 22 e 23) | não | `--layout=origem --ancoras=10,11,17 --numeros=9,11,12,21,22,23 --sem-opcional --extras=bloco-roteiro.js` (na técnica, `--tom=tecnica --extras=bloco-roteiro-tecnica.js`; na acompanhamento, `--numeros=9,12,10,21,22,23 --grupos="metodo,encaixe\|campo\|registro,clubes,rostos"`) |
| R1 | 7, 13, 14 e 18 | não | `--layout=posicao --tema=r1 --ancoras=7,12,15 --grupos="campo\|registro,clubes\|rostos" --sem-opcional --numeros=0,7,0,13,14,18` |

Depois de rodar, sempre: `node gera-manifesto.mjs` na pasta do deck (e `--confere` antes de publicar).

O que não é gerado por aqui: o roteiro do R2 novo e o da técnica (as falas dos seis slides estão em `assets/roteiro.js` e `assets/variacoes/tecnica.js`), as notas do gestor (`notas-do-gestor.md`) e o `assets/bloco.css` e `assets/bloco.js`, que são escritos à mão e copiados para cada deck.

Chaves do bloco, em qualquer deck:

- `?bloco=estatico` no fim do endereço, `window.BLOCO.animar = false` ou o "reduzir movimento" do aparelho: tudo para no quadro final.
- `window.BLOCO.numeros = true`: devolve a velocidade de cada jogador, os números das barras e o percentual do radar. Ficam desligados porque a casa não dá nota nem atributo na tela.
- No campo, os botões "Olhômetro" e "Inteligência artificial" trocam o modo com um clique. O campo abre sempre no olhômetro. No R1 ele também vira sozinho para a IA em 7 segundos, se ninguém clicar.

Teste: `node testes/teste-bloco.mjs`, na pasta `jogador-de-elite-closer`. Ele abre os quatro decks e confere onde cada slide do bloco está, a regra de 24 px, os dois botões do campo, o contador do 326, o `?bloco=estatico` e os opcionais do manifesto.

Regras que o bloco respeita (conferidas pela auditoria da casa): texto de 24 px ou mais, nada fora do palco, sem travessão, sem nota nem percentual de atleta, sem clube como quem usa dados e "enviados", nunca "contratados", no 326.
