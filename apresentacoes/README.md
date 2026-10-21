# Apresentações e painel de vendas

Código do painel e dos quatro decks publicados na Vercel. As pastas ficam lado a lado porque os testes do painel usam os decks reais.

| Pasta | Produção |
| --- | --- |
| `jogador-de-elite-closer` | https://jogador-de-elite-closer.vercel.app |
| `jogador-de-elite-r1` | https://jogador-de-elite-r1.vercel.app |
| `jogador-de-elite-r2` | https://jogador-de-elite-r2.vercel.app |
| `jogador-de-elite-r2-novo` | https://jogador-de-elite-r2-novo.vercel.app |
| `jogador-de-elite-r2-b` | https://jogador-de-elite-r2-b.vercel.app |

O R2 anterior tem a variação `/variacoes/acompanhamento/`: Scout PRO por R$247,90 (10x de R$24,79) e Legacy por R$500 (10x de R$50). A sequência termina em preços, garantia incondicional e Bem-vindo. O painel oferece só esses dois planos nessa página.

Nessa variação, o R2 preenche a seção **Dossiê do atleta e clubes compatíveis** antes da call: categoria, leitura do perfil, prioridade, nota geral e indicadores opcionais, além de até três clubes com liga, posição, categoria, motivo do encaixe e percentual opcional. Os números vão de 0 a 100 e devem vir do relatório preparado do Zyron. Campos vazios não ganham valores de exemplo.

Em todos os decks, a foto autorizada aparece no slide 02 (a escolha do jogador) e nos quadros de foto que o deck tem: a capa com o “Montado para”, o cartão do atleta, os planos, a garantia e o Bem-vindo, conforme o deck (desde 18/10/2026; de 13 a 17/10 ficava só no slide 02 e os outros quadros mostravam uma inicial solta). Com a foto fora da tela no painel, ou sem foto, os quadros mostram as iniciais do nome e sobrenome (Carlos Eduardo Souza vira CS). Todos os campos da ficha são opcionais: dá pra salvar o rascunho vazio, subir a foto direto no painel e gerar o link só no fim (desde 18/10/2026, o link só existe depois de "Gerar link da apresentação"). Sem imagem, o slide usa iniciais; sem nome, usa uma chamada genérica.

O plano de entrada agora se chama **Scout PRO** e inclui os **sete módulos de formação**, com um slide dedicado em todas as páginas. A análise do Zyron, a formação e o acompanhamento humano são apresentados com seus respectivos papéis; as entregas humanas seguem o plano escolhido. Os preços foram preservados.

Na variação de acompanhamento, a IA na prática mostra o relatório já pronto, sem vídeo do atleta nem cálculo ao vivo. O slide 28 chama o jogador pelo nome da tela antes de “você foi escolhido”. A referência de contratação separada soma R$20.000 por ano; a oferta mantém R$247,90 e R$500. O dossiê é entregue somente às apresentações dessa página, e cada jogador tem armazenamento e canal próprios no navegador.

## Bloco da página institucional (17/10/2026)

Seis slides da página `/institucional` (aizyron.com/institucional) entraram nos decks: o método (a IA encontra, a gente conduz), o campo animado olhômetro × IA, o encaixe ("você não precisa ser o próximo Neymar", com o radar), os 326 atletas enviados, os clubes e parceiros e o mosaico "cada rosto, uma história".

| Deck | Slides | Slides do bloco | Opcionais no painel |
| --- | --- | --- | --- |
| R2 novo (principal e técnica) | 33 (eram 27) | 10, 13, 14, 22, 23 e 24 | sim, os seis (sete com o "leva") |
| R2 B (principal e técnica) | 33 (eram 27) | 10, 13, 14, 22, 23 e 24 | não: o deck não tira slide da sequência |
| R2 anterior (principal, técnica e acompanhamento) | 30 (eram 24) | 9, 11, 12, 19, 20 e 21 (na acompanhamento, 9, 10, 12, 19, 20 e 21) | não |
| R1 | 20 (eram 16) | 7 (campo), 13 (326), 14 (clubes e parceiros) e 18 (mosaico) | não |

No campo, dois botões que o closer clica (olhômetro e inteligência artificial) trocam o modo no mesmo slide. A tela não mostra nota, velocidade nem percentual de ninguém: `window.BLOCO.numeros = true` devolve. `?bloco=estatico` no fim do endereço para a animação. As exceções à regra "só `.rise`" e a auditoria estão no `AUDITORIA_R2_NOVO.md` do R2 novo; as ferramentas que geram e inserem os slides, em `ferramentas-bloco/README.md`; o `testes/teste-bloco.mjs` confere as posições, a regra de 24 px, os botões do campo e o contador do 326 nos quatro decks.

Para o painel: o R2 novo declara sete opcionais por página no `variacoes.json` (o painel aceita até 10) e o `regras.js` guarda os mesmos na reserva. Os textos fixos do painel falam do slide 17 (a IA na prática do R2 novo) e do slide 20 (o último do R1).

## Regras da casa nos decks antigos (17/10/2026)

A auditoria de regras da casa (texto de 24 px ou mais, nada fora do palco, texto sobre texto, palavras proibidas, travessão) achou problemas antigos que foram corrigidos nos quatro decks: slides de escolha e de formação com texto de 19 a 23 px e o título cobrindo a grade com nome longo; texto pequeno no R1 e no R2 anterior (janela de chamada do Zyron, contrato, casos, post, dossiê da acompanhamento); o campo do R2 anterior com o mesmo posicionamento de nome do R2 novo; "o melhor da peneira" que virou "o destaque da peneira" no R1; e a linha "A gente só ganha se você ganhar." que cobria a nota legal no slide dos planos com o Scout PRO (R2 anterior). Na acompanhamento, clubes com nome muito longo passam a ter o nome limitado a 2 linhas no slide 11 e a liga e o motivo a 1 e 3 linhas no slide 18, pra o texto de 24 px caber acima do rodapé; o card do clube na tela do relatório mantém as etiquetas. A palavra "incondicional" na garantia do R2 anterior fica, por decisão do dono (17/10/2026), mesmo com a auditoria acusando. O detalhe está no `AUDITORIA_R2_NOVO.md` do R2 novo e do R2 B.

## Nome, foto, validade e Gerados (18/10/2026)

- **Nome e sobrenome em todos os decks.** O R2 anterior (principal, técnica e Acompanhamento) usa a mesma regra do R2 novo: a tela mostra nome e sobrenome (Lucas Almeida da Silva vira Lucas Silva) e segue a escolha "Nome na tela" e o apelido do painel; a fala do apresentador continua com o primeiro nome. As placas ("Montado para", "Apresentação preparada para") são sempre nome e sobrenome, inclusive no R1, que segue chamando pelo primeiro nome nas frases. (Na segunda rodada do mesmo dia, o código do dossiê saiu da tela: nenhum slide mostra mais "Nº" nem código do link.)
- **A capa da Acompanhamento** mostra a foto, "Montado para" e o nome e sobrenome (o "Dossiê nº" saiu na segunda rodada). Era ali o "Montado para Carlos Nº ..." com um "C" no lugar da foto.
- **Validade escolhida.** No editor, a seção "Validade do link" tem atalhos (2 h depois da call, no fim do dia da call, 1 dia depois da call, em 24 horas, 3, 7 ou 30 dias) e o dia e a hora à mão, de 1 minuto a 60 dias. Escolhida, a validade não segue mais o dia da call; "Automática" volta pra regra da casa. Vale também na hora de gerar. A caixa "apagar tudo quando o link expirar" deixa a limpeza diária (6h) apagar o lead vencido. Rotas: `POST /api/atletas` com `link: { venceEm, apagarAoVencer }` e `POST /api/link?acao=validade`.
- **Link vencido ou revogado** mostra "Este link não está mais ativo" em todos os decks (o R2 anterior e o R1 antes seguiam com a ficha guardada no navegador). Com a apresentação aberta, ao voltar pra aba do deck, ele busca o painel de novo (nome, foto, validade).
- **Gerados.** Aba nova no painel com tudo o que foi gerado, o espaço de cada um (ficha, foto e vídeo), filtros (apresentados, expirados ou revogados, ainda não apresentados), "Marcar como apresentado" e exclusão um por um ou em lote (`DELETE /api/atletas` com `{ ts }`, até 50 por pedido). O closer vê os dele; o admin, os de todos.
- Teste: `testes/teste-validade-gerados.mjs` (74 verificações).

## Dossiê do atleta, inimigo em comum e link no fim (18/10/2026, segunda rodada)

- **O link só nasce no fim.** Salvar no editor guarda um rascunho: a lista mostra "Em preparo · sem link" e a família não acha nada pelo código (a `/api/r2`, a `/api/publico`, a foto, o vídeo e o mapa respondem como se o código não existisse). O link passa a existir no botão "Gerar link da apresentação", no fim do editor (`POST /api/link?acao=gerar`). Enquanto é rascunho, a prévia do painel e o "Abrir" usam uma chave de 3 horas (`&p=`), que os quatro decks repassam em todo pedido ao painel (`FotoAtleta.comChave`).
- **Fora da tela:** o número do dossiê ("Nº XXXXXXXX", o código do link) e os avisos de "ilustrativo" ("Tela ilustrativa", "Formação ilustrativa", "Ilustração com valores fictícios"). As notas do apresentador que diziam "a tela diz isso" agora dizem que quem fala é o closer.
- **Campos novos no painel:** onde ele joga hoje e categoria (R1 e R2), "Tenho o vídeo do jogador" (o vídeo que a IA analisou, pela mesma rota do vídeo, e o mapa de calor, em `PUT /api/foto` com `{ mapa }`, guardado em `mapas/<código>/`), oportunidades (até 6 clubes, cada um com um detalhe opcional; na ficha, `Clube~detalhe|Clube~detalhe`) e as peneiras (quantas, quanto gastaram e há quantos anos).
- **Dois slides novos logo depois da IA na Prática**, nos três decks do R2 (sete páginas; o R1 não muda): o **dossiê do atleta** (o nome em cima da foto e os dados embaixo, o vídeo analisado no centro com o mapa de calor embaixo, as oportunidades e o plano de carreira à direita) e o **inimigo em comum** (o avaliador que olha 22 em vinte minutos, "em algum time, alguém precisa de um jogador exatamente como você", o campo com a luz do avaliador e o quadro "O preço de procurar no escuro" com os números da família, que contam do zero quando o slide entra). O dossiê só aparece com vídeo, mapa ou oportunidades; sem nada disso, as setas passam direto (`data-so-se`). Com o vídeo analisado e sem lances marcados, a IA na Prática vira a ponte (a leitura ao vivo de sempre) e o vídeo entra no dossiê. O código e o estilo moram em `assets/dossie-atleta.js` e `assets/dossie-atleta.css`, iguais nos três decks.

| Deck | Slides | Dossiê e inimigo | O que andou |
| --- | --- | --- | --- |
| R2 novo e R2 B (principal e técnica) | 35 (eram 33) | 18 e 19 | do 18 ao 33 de antes, duas casas: os opcionais do bloco viraram 24, 25 e 26, o "leva" 27 e o Bem-vindo 35 |
| R2 anterior (principal, técnica e Acompanhamento) | 32 (eram 30) | 16 e 17 (origens 107 e 108 no roteiro) | do 16 em diante, duas casas (o roteiro troca os números sozinho, pela origem) |

- Teste: `testes/teste-dossie-inimigo.mjs` (os dois slides nas sete páginas, a sequência que pula o dossiê vazio, o vídeo, o mapa e as oportunidades vindos do painel, a contagem e a prévia com a chave) e `testes/teste-rascunho-link.mjs` (o rascunho, a chave da prévia e o "Gerar link").

## CL0, vídeo de 24 horas e mapa de calor por posição (20/10/2026)

O plano é o `docs/superpowers/plans/2026-10-20-cl0-e-video-do-painel.md` (blocos A a F).

- **CL0** (`/variacoes/cl0/` do R2 anterior, `r2a-cl0` no painel, "Não validada"): a Técnica com os ajustes de um closer. O 27 diz "fecha ganhando de R$ 5 a 30 mil por mês" (a mãe do áudio do 18 diz "ofereceram 5 mil por mês", conferido no áudio); o 28 e o 32 dizem "imediatamente" e falam do assessor de carreira; o 29 ("Vocês não estão mais sozinhos") mostra os três planos com o texto do closer e sem preço nos avanços 1 a 3, os três preços juntos no 4 e a recomendação e a chamada "Escolha o acompanhamento para o seu atleta" no 5, com o rodapé "Encaminhamentos representam oportunidades reais, sem garantia de aprovação ou contratação." sempre na tela; o 30 não tem a linha da garantia e usa a mesma faixa do 27. A garantia aparece só no 31. Os preços não mudaram (R$ 997, R$ 1.497 e R$ 2.997, vitalícios, em 10x sem juros). O nome é David Willer, como no resto da casa (o closer escreveu "Davi"; a mãe do áudio diz "David"). O roteiro do CL0 fica em `assets/variacoes/cl0.js` (só o que muda em relação à Técnica) e o estilo em `assets/variacoes/cl0.css` (só essa página carrega); o `deck.js` do R2 anterior ganhou dois ajustes que não mudam as outras páginas (conferido por captura): o rótulo da lista do plano pode vir do plano (`mais`) e linha sem cargo sai sem negrito. Atenção no roteiro: o `ordem-garantia.js` troca número depois de "o " (até no fim de "avanço"), então os avanços vão por extenso ("o quarto avanço").
- **"O que ele leva" no R2 novo e no R2 B**: saiu a linha "Garantia" (seis linhas viraram cinco). A garantia segue no slide dela.
- **Vídeo do atleta**: sem limite de tamanho e de tempo (só o teto técnico de 2 GB por arquivo e uma guarda do espaço de todos os vídeos juntos, `VIDEOS_ESPACO_MAX_MB`, padrão 600). Vence 24 horas depois do envio (era 90 dias), com o dia e a hora na tela e o botão "Renovar por 24 h". Vencido, ele sai da loja: a passada dos vídeos (uma listagem de `videos/`) roda na limpeza das 9h, em três Crons leves (3h, 15h e 21h UTC, `/api/limpeza?so=videos`) e, no máximo uma vez por hora, quando alguém usa o painel; ela também tira sobra de envio com mais de 2 horas e arquivo de lead que não existe mais. A limpeza diária lista cada pasta uma vez só (eram duas listagens por lead). O envio ficou mais rápido: o arquivo começa a subir enquanto o painel lê a duração e as medidas, a capa sai sozinha de um quadro do começo do vídeo e sobe junto, o progresso mostra a velocidade e o tempo que falta, e o HEVC que não abre é avisado em 8 segundos (eram 20). O vídeo toca pelo link assinado do Blob (10 minutos, direto do CDN, com Range); o link se confere sozinho e, se o CDN recusar, o vídeo segue em stream pela função (`VIDEO_MODO=proxy` força o stream). O painel e os decks mostram o vídeo na proporção dele: em pé, o dossiê põe o mapa de calor do lado (com o campo em pé) e a IA na Prática encolhe a caixa na largura (antes o vídeo em pé saía cortado). `?perf=1` no endereço do painel mostra o tempo de cada parte do envio no console, e as rotas `leitura` e `video` mandam `Server-Timing`.
- **"Salvar leitura"**: nada é obrigatório (sem a fonte, o slide só não mostra o relatório; sem lances, também). Sem mudança, fecha sem ir ao servidor; linha estragada fica de fora com aviso e o resto é salvo.
- **Mapa de calor por posição**: o closer escolhe numa grade com as 11 posições do campo (Goleiro, Laterais, Zagueiros e Volantes de cada lado, Meia central, Pontas e Centroavante), mais "Sem mapa". A posição da ficha vem sugerida. O desenho é um SVG do `mapa-calor.js` (sem imagem e sem rede), igual no painel e nos três decks (`node copia-mapa-calor.mjs` na pasta do painel copia; o `teste-igualdade` confere). O slide diz "Mapa de calor · onde atua um zagueiro": é o mapa típico da posição, não do jogo dele, e a nota do apresentador avisa. O mapa enviado como imagem antes disso segue valendo até o closer trocar por um da lista. Fica na ficha (`mapaCalor`).
- **Nenhum campo obrigatório** no editor (Dia, Hora e Plano perderam o asterisco); o checklist só dá a etiqueta Pronto.
- **"Quando o Zyron começa"**: só "imediatamente", que já vem marcado. Lead salvo antes com "no dia seguinte" ou "em até 48 horas" passa a mostrar "imediatamente".
- **Inventário da loja**: `INVENTARIO-DA-LOJA.bat` (dois cliques na pasta do painel) lista o espaço por pasta e os vídeos de cada lead, sem apagar nada. O `limpa-videos-da-loja.mjs --apagar` apaga os vídeos de antes das 24 horas (mais de 25 horas) e os órfãos; rode só depois de conferir o inventário.
- Testes novos: `teste-cl0.mjs`, `teste-mapa-calor.mjs`, `teste-video.mjs` (o envio de ponta a ponta no Chrome, com um Blob de mentira no servidor de teste) e as capturas `telas-cl0.mjs` e `telas-mapa-video.mjs`.

## Testar

Na pasta `jogador-de-elite-closer`:

```powershell
npm ci
node --test testes/teste-foto-todos-decks.mjs
node testes/teste-dossie-acompanhamento.mjs
node testes/teste-oferta-acompanhamento.mjs
node testes/teste-paginas.mjs
node testes/teste-etapas.mjs
node testes/teste-etapas-telas.mjs
node testes/teste-bloco.mjs
node testes/teste-validade-gerados.mjs
node testes/teste-dossie-inimigo.mjs
node testes/teste-rascunho-link.mjs
node testes/teste-igualdade.mjs
node testes/teste-leitura.mjs
node testes/teste-cl0.mjs
node testes/teste-mapa-calor.mjs
node testes/teste-video.mjs
```

Os testes usam armazenamento temporário e não acessam os leads de produção. Os testes de navegador usam o Chrome instalado, configurável pela variável `CHROME`.

## Publicar

Dentro da pasta do projeto correspondente, vincule o checkout com `npx vercel link --project <nome-do-projeto> --yes`. Nos decks, rode `node gera-manifesto.mjs --confere` antes de `npx vercel deploy --prod --yes`. Para atualizar o manifesto depois de editar páginas, use `node gera-manifesto.mjs`.

As credenciais, as pastas `.vercel`, os dados locais e `node_modules` ficam fora do Git. Configure as variáveis do painel conforme o `PASSO-A-PASSO-VARIAVEIS.md` dele.
