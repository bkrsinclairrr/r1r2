# Painel de Apresentações: etapas, decks e variações

O painel guarda as duas etapas da venda, cada uma com as suas apresentações:

| Etapa | Quem monta | Decks que ela tem | Papel no painel |
| --- | --- | --- | --- |
| **R1** | o SDR | R1 (`jogador-de-elite-r1`, 20 slides) | `sdr` |
| **R2** | o closer | R2 novo (`jogador-de-elite-r2-novo`, 33 slides), R2 anterior (`jogador-de-elite-r2`, 30 slides) e R2 B (`jogador-de-elite-r2-b`, 33 slides) | `closer` |

O **admin** vê as duas etapas. Cada papel vê só as variações, os leads e os decks da etapa dele. O SDR cria o R1 de um lead (aba "Meus R1", botão **+ Novo R1**); quando o lead vai pro closer, ele cola o link do R1 em **Importar o R1 de um SDR** e a ficha já vem pronta no R2.

**Uma variação é uma página de um deck.** O R2 novo tem a Principal e a Técnica; o R2 anterior e o R2 B também; o R1 tem a Principal. O id da variação no painel é o prefixo do deck mais o id da página: sem prefixo no R2 novo (`principal`, `tecnica`), `r2a-` no R2 anterior, `r2b-` no R2 B e `r1-` no R1 (`r1-principal`). A cada lead, quem monta escolhe a variação da etapa dele, diz se aparecem o nome, o sobrenome e a foto e gera a apresentação. Variação nova não cria link novo nem projeto novo na Vercel.

## O link do lead: um só por etapa

- **R1:** `https://jogador-de-elite-r1.vercel.app/?a=<código>`
- **R2:** `https://jogador-de-elite-r2-novo.vercel.app/?a=<código>`

Esses dois decks são os **decks de entrada**. A `/api/r2` diz ao deck de entrada onde fica a página da variação escolhida (`versao: { id, caminho, origem }`) e ele leva o lead pra lá, com o mesmo `?a=`, o mesmo `#slide` e o mesmo `?presenter`, uma vez só e na entrada (no meio da call, uma troca no painel não derruba a apresentação). Se a variação é de outro deck (o R2 anterior, o R2 B), o lead cai nesse deck, que lê o lead no painel pelo mesmo código. O destino da última resposta fica guardado na ficha deste navegador (`_v = { o: origem, c: caminho }`), pra a volta já ir direto pra página certa.

**A defesa:** o deck de entrada só segue **origens de uma lista fixa** (`DECKS_OK` no `assets/deck.js`, os 4 decks) e caminhos de página do cadastro (`/` ou `/variacoes/<slug>/`). Origem fora da lista, origem parecida (`...vercel.app.evil.example`) e caminho estranho (`//evil.example/`, `/../admin`) são ignorados: o lead fica onde está. O painel só responde (CORS) pras origens dos decks do catálogo.

**Os decks de antes** (R1 e R2 anterior) continuam lendo o lead pelo endereço que sempre usaram, `/api/publico?id=<código>`. No painel isso é um `rewrite` do `vercel.json` pra `/api/r2` (não é função nova), que responde no formato de antes (`{ id, ficha, atualizadoEm, versao, video?, leitura? }`) e 404 `{ erro }` pra link que não vale. O que mudou nesses decks foi o endereço do painel dentro do `assets/deck.js` (de `jogador-de-elite-painel` pra `jogador-de-elite-closer`) e uma alternativa: **os links que o painel antigo já mandou pras famílias seguem abrindo.** Quando este painel responde 404 pra um código que não tem o formato dele (26 letras, a-z e 2-7; os de antes são `nome-8letras`), o deck pergunta ao painel antigo, num endereço fixo (`PAINEL_DE_ANTES`), e o vídeo do lead sai do painel de onde veio o lead. Lead novo vai sempre pro painel novo, e um código no formato novo que não vale nunca é perguntado ao antigo. O painel antigo fica no ar só pra isso; quando não houver mais link dele em uso, é só tirar essa alternativa dos dois `deck.js` (e o R2 pode importar um R1 do painel antigo pelo código).

## O que cada deck faz (recursos)

O painel só oferece, na tela, o que o deck faz de verdade. Está no `regras.js`, em `DECKS`:

| Deck | Escolher "Nome na tela" | "Como a gente chama ele" (apelido) | Foto do lead | Tirar slide opcional | Vídeo e leitura do atleta | Prévia dentro do painel | O que aparece do lead |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R2 novo | sim | sim | sim | sim | sim | sim | nome e sobrenome, e a foto |
| R2 anterior | sim (desde 18/10/2026) | sim (desde 18/10/2026) | sim (slide 02; na Acompanhamento, também a capa e os quadros do dossiê) | não | sim | não (abre em outra aba) | nome e sobrenome (ou a escolha do painel), e a foto |
| R2 B | não | sim | sim | não | sim | sim | nome e primeiro sobrenome, e a foto |
| R1 | não | não (o deck ignora) | sim (slide 02) | não | não | não (abre em outra aba) | primeiro nome nas frases, nome e sobrenome na placa do slide 02, a foto e a ficha (posição, idade, cidade) |

Em `recursos`, `nomeTela`, `foto`, `pular`, `leitura` e `previa` são as colunas da tabela; `apelido: false` esconde o campo do apelido (falta = o deck usa) e `nomeFixo` (`so-nome` ou `primeiro-sobrenome`) diz o nome que um deck que não segue "Nome na tela" mostra sempre, pra o exemplo do campo bater com a tela. `previa: false` também tira o item "Prévia olhada" do checklist (o deck abre em outra aba, não há o que marcar). A foto é do servidor: a `/api/r2` só manda a foto ao deck quando a tela dela mostra (foto fora da tela por lead ou pela variação), então a escolha vale até no R2 B, que não conhece o `semFoto`. No R1 as rotas de vídeo e leitura recusam (400); a foto vale (slide 02). O checklist do R1 pede: nome conferido, ficha do slide 02 (posição, idade e cidade) e o dia e a hora da R2. O link do R1 vale 30 dias quando não tem data da R2.

## 1. Página nova num deck (texto e slides próprios): o painel descobre sozinho

Não tem cadastro no painel nem nada pra publicar nele. A página diz quem ela é, o deck publica a lista e o painel lê.

1. **A página no deck** (a pasta do projeto do deck): copie `variacoes/tecnica/` pra `variacoes/<slug>/` (no R2 novo, também `assets/variacoes/tecnica.js` pra `assets/variacoes/<slug>.js`, com `window.VARIACAO_NOME`). O slug é neutro de propósito (a família pode ver o endereço na tela compartilhada) e só aceita letras minúsculas, números e hífen. Os decks R2 (novo, anterior e B) são UTF-8 com **CRLF**; o R1 e o painel são com LF. As regras de conteúdo e do motor do R2 novo estão no `APRESENTACAO_R2_VARIACOES.md`.
2. **O cadastro, na própria página**: no `<head>`, o bloco `<script type="application/json" id="r2-variacao">` (copie o de outra página do mesmo deck e troque). O nome do bloco é `r2-variacao` em todos os decks, inclusive no R1:

   ```html
   <script type="application/json" id="r2-variacao">
   {
     "nome": "Lead quente",
     "resumo": "Vai direto ao plano.",
     "quando": "Já conversou com o estrategista.",
     "validacao": "nao-validada",
     "lead": { "nome": true, "foto": true },
     "opcionais": [
       { "id": "extra", "rotulo": "O que o {nome} ganha", "ajuda": "Um slide a mais." }
     ]
   }
   </script>
   ```

   `nome` (até 40 letras, único na etapa), `resumo` e `quando` (até 300 letras) são obrigatórios. `validacao` é a classificação de partida (`nao-validada` se faltar) e vale até o admin decidir no painel. `lead` diz o que a variação mostra: `{ "nome": true, "foto": true }` se faltar; apresentação geral, sem personalização, `{ "nome": false, "foto": false }`. Num deck que não mostra foto (R2 anterior, R1), `foto` fica `false`. Sem `<`, `>` nem travessão nos textos.
3. **Slides opcionais, se a página tiver** (só o R2 novo deixa tirar slide da sequência; lá são sete por página, e o painel aceita até 10): `data-opcional="<id>"` na tag do próprio slide (`<section class="slide" data-opcional="extra">`) e a entrada em `opcionais` do bloco. O número do slide o gerador acha sozinho. O `rotulo` pode ter `{nome}` (vira o primeiro nome do lead). Desmarcado, o deck passa direto por ele ao avançar e voltar, sem renumerar nada; ir direto ao slide (número mais Enter, visão geral, `#N`) continua funcionando. Não deixe tirar slide com preço, garantia ou nota legal.
4. **Gere e confira**: `node gera-manifesto.mjs` (na pasta do deck) escreve o `variacoes.json` (a lista das páginas com nome, quando usar, slides opcionais, número de slides e o hash de cada arquivo). Ele recusa a página com bloco faltando, JSON quebrado, opcional que não bate com o HTML, nome repetido, pasta com nome ruim e texto com travessão. `node gera-manifesto.mjs --confere` só confere, sem escrever. O gerador é o mesmo arquivo nos 4 decks.
5. **Publique o deck** (`npx --yes vercel deploy --prod --yes` na pasta dele; o `PUBLICAR-R2-NOVO.bat` já roda o gerador antes e para se alguma página estiver errada). O painel pega a página nova sozinho, em até 2 minutos depois de alguém abrir a aba, no Cron das 9h ou no botão **Sincronizar agora**. Se você mexer numa página depois e esquecer de gerar de novo, o painel avisa o admin ("variacoes.json velho"), mas a página segue funcionando.

Um id de página do R2 novo não pode começar com o prefixo de outro deck (`r2a-`, `r2b-`, `r1-`): o painel recusa o manifesto, pra um id nunca valer por dois decks.

A lista `RESERVA` do `regras.js` (por deck) virou só a reserva: vale se o painel nunca conseguiu ler o `variacoes.json` daquele deck. Página nova não precisa entrar lá.

## 2. Variação criada no painel (o admin, sem publicar nada)

Na aba de variações, o admin clica em **+ Nova variação**: nome, a **base** (a página de qualquer deck da etapa em que ela se apoia: as telas e o texto são os da base), quando usar, classificação e se aparecem o nome e o sobrenome do lead e a foto dele. A etapa e o deck vêm da base. O painel gera o slug (`tecnica-sem-foto-k7m2`: o nome sem acento mais quatro letras sorteadas) e a variação já aparece pros SDRs ou closers da etapa.

O que muda numa variação criada é só o que o painel controla: nome, descrição, nota, classificação e o que ela mostra do lead (e só o que o deck da base faz). Texto e slides novos exigem uma página nova no deck (jeito 1). O admin edita nome, descrição, classificação, nota e lead em "Ajustes do admin" e **arquiva** a que não serve mais (some pra quem monta; os leads que já usam ela continuam abrindo igual). A Principal de cada etapa não arquiva. Ficam no máximo 60 ativas (as arquivadas liberam vaga) e 300 guardadas. A base tem que ser uma página que está no deck agora (uma que saiu do deck é recusada, 400). Se a base quebra ou sai, a variação criada acompanha: os leads dela abrem a Principal.

## 3. Deck novo no catálogo

Um deck inteiro novo (um projeto novo na Vercel, por exemplo um R3 ou um R1 alternativo) entra assim:

1. **No deck:** `variacoes.json` gerado (copie `gera-manifesto.mjs`, o bloco `r2-variacao` em cada página e o `.vercelignore` que deixa o gerador de fora), `vercel.json` com `/variacoes.json` sem cache (`Cache-Control: no-cache`) e o `/admin` redirecionando pro painel, e o `PAINEL` do `assets/deck.js` apontando pra `https://jogador-de-elite-closer.vercel.app`. O deck lê o lead em `/api/publico?id=<código>` (formato de antes) ou em `/api/r2?t=<código>` (formato novo).
2. **No painel (`regras.js`):** uma entrada em `DECKS` (`id`, `etapa`, `nome`, `prefixo` único, `entrada: false`, `origem`, `leadTxt` e `recursos`, conforme o que o deck faz) e a reserva dele em `RESERVA`. O CORS das rotas públicas e a sincronização acompanham o catálogo sozinhos.
3. **Se o deck sabe abrir dentro do quadro de prévia** (`recursos.previa: true`): a origem entra no `frame-src` do `vercel.json` do painel.
4. **Nos decks de entrada** (R1 e R2 novo): a origem entra na lista `DECKS_OK` do `assets/deck.js` de cada um. Sem isso, o lead que escolher uma página do deck novo fica no deck de entrada.
5. **Nos testes:** `RAIZES` e `DECK_NO_AR` do `testes/servidor.mjs` e `IDS` e `PREFIXO` do `testes/teste-paginas.mjs`.
6. **Ordem de publicação:** os decks primeiro (o de entrada precisa conhecer a origem antes de o painel mandar o lead pra lá), o painel por último.

## Como o painel fica em dia com os decks

Cada deck publica `/variacoes.json`, sem cache. O painel (`api/_sincroniza.js`) lê o de **todos os decks do catálogo juntos**, cada um com o seu orçamento de tempo (um deck fora do ar não atrapalha os outros), e guarda o que leu em `versoes.json`, em `decks.<id do deck>`. A sincronização roda:

- sozinha, na primeira vez que alguém abre a lista de variações depois de 2 minutos da última;
- todo dia às 9h, junto da limpeza diária (o Cron);
- quando o admin clica em **Sincronizar agora** (`POST /api/versoes?acao=sincronizar`, só admin, em JSON como toda escrita).

Em cada página da lista o painel confere: abre (HTTP 200, sem redirecionar), tem o motor do deck (`assets/deck.js`) e tem o número de slides que o `variacoes.json` diz. Se o conteúdo mudou depois do manifesto (hash diferente), é só aviso pro admin: a página segue funcionando.

Limites que protegem o painel: um pedido não passa de 4 segundos e a sincronização de cada deck não passa de 7 (a função da Vercel para aos 10); cada arquivo lido não passa de 2 MB; redirecionamento não é seguido; o painel só pede o caminho que ele mesmo deriva do id da página (`/` ou `/variacoes/<id>/`), nunca um endereço escrito no manifesto; o texto que vem do manifesto sai sem HTML; o `variacoes.json` aceita de 1 a 40 páginas.

### O que acontece quando alguma coisa falha

| Situação | O que acontece |
| --- | --- |
| Uma conferência com falha | Selo "Conferindo de novo". Nada é bloqueado (pode ser um soluço de rede). O admin vê o motivo escrito no cartão. |
| Duas conferências seguidas com falha | "Com problema": o botão de gerar apresentação e a escolha no editor ficam desabilitados (o lead que já usa a página continua marcado), e a `/api/r2` abre a **Principal da etapa** em vez da página quebrada (só se a última conferência é de menos de 15 minutos). A ficha continua a da variação escolhida: se ela não mostra a foto do lead, a Principal também não mostra. A Principal nunca é bloqueada: é pra onde as outras caem. |
| A página sai do deck (some do `variacoes.json`) | Fica na lista como "Saiu do deck" (não conta como página com problema), bloqueada na hora, e os leads dela abrem a Principal. O admin pode arquivar. Se a página volta, volta ao normal. |
| `variacoes.json` com erro (JSON quebrado, formato desconhecido, sem a Principal, id repetido, caminho que não bate com o id, nome repetido, sem hash, grande demais, id com prefixo de outro deck) ou deck fora do ar | O painel fica com a última lista boa **daquele deck**, anota a falha (o admin vê o motivo na faixa; quem monta só vê que falhou) e continua conferindo as páginas que já conhece. Os outros decks seguem normais. Volta sozinho quando o arquivo volta ao normal. |
| O painel nunca leu o `variacoes.json` de um deck | Vale a reserva dele no `regras.js`. |

Nada disso faz o link do lead dar erro: no pior caso a família abre a Principal da etapa.

### O que a aba mostra

Uma faixa no alto: "Sincronizado com o deck há pouco · 3 páginas · todas funcionando", ou, com mais de um deck na etapa, uma linha por deck; e o botão **Sincronizar agora** (só admin). O admin escolhe a etapa (R1 ou R2) num filtro; SDR e closer veem direto a etapa deles. Em cada variação, ao lado da classificação: **Funcionando**, **Conferindo de novo**, **Com problema** ou **Saiu do deck**, e o nome do deck; e, só pro admin, **Nova no deck** (a página apareceu há menos de 7 dias) e **variacoes.json velho**. A página bloqueada traz o motivo escrito no cartão e no seletor do editor.

### Onde fica e de quem é cada parte

`versoes.json` na loja de Blob guarda: `ajustes.<id da variação>` (classificação, nota, lead, arquivada, quem e quando), `criadas` (id, `etapa`, nome, `base`, quando, classificação, nota, lead, arquivada, quem criou e quando) e `decks.<id do deck>` (`em`, `okEm`, `falha`, `origem`, `gerado`, `paginas`, `saude`, `sumiram`). O campo `deck` (no singular) do formato de antes vale como o do R2 novo e migra pra `decks.r2` na primeira gravação. O lead (`atletas/<código>.json`) tem `etapa` (`r1` ou `r2`; sem o campo, é R2) e `ficha.versao` com o id da variação.

As rotas: `api/versoes.js` (GET pra todo mundo logado, cada papel com as variações e os decks da etapa dele; POST e PUT só pro admin), `api/atletas.js`, `api/r2.js` (a pública, também servida em `/api/publico`), `api/chamada.js` (a presença do apresentador), `api/foto.js`, `api/video.js`, `api/leitura.js`, `api/link.js`, `api/usuarios.js`, `api/sessao.js`, `api/importar.js` e `api/limpeza.js`. **São as 12 funções do plano gratuito da Vercel: a próxima rota nova precisa entrar dentro de outra.** Os arquivos com `_` (`_base.js`, `_decks.js`, `_sincroniza.js`, `_armazenamento.js`) não viram função.

## A classificação e o que cada variação mostra do lead

A classificação (**Validada**, **Em validação**, **Não validada**) fica ao lado do nome da variação, na aba e no seletor do lead. Quem decide é o admin. SDRs e closers veem, e a lista vem do mais validado ao menos validado.

Em "Ajustes do admin" de cada variação o admin muda, sem publicar nada: a classificação, uma nota (até 160 letras, quem monta vê; ex.: "fechou 5 de 8 calls"), **Aparece o nome e o sobrenome do lead** e **Aparece a foto do lead** (só vale com o nome). Desmarcado o nome, a variação vira geral: a tela não mostra nome nem foto do lead, quem monta não vê as escolhas de nome e de foto, e o checklist não pede foto nem nome conferido. Desmarcada só a foto, o nome aparece e o quadro da foto mostra a inicial. Vale na hora, inclusive pros leads já salvos. O que o admin decide vale sobre o que a página diz no bloco `r2-variacao` (`validacao` e `lead`), e continua valendo nas sincronizações seguintes. Só vale o que o deck da página faz: num deck que não segue a escolha de nome, o nome sempre aparece; num que não mostra foto, a foto nunca aparece (o painel recusa marcar o contrário, 400).

## O que quem monta escolhe por lead (campos da ficha)

- `versao`: o id da variação (o slug, ou o id com prefixo de deck). A Principal da etapa não fica gravada. Um id que não existe, ou que é de outra etapa, é recusado (400), pra o lead não cair na Principal sem ninguém ver.
- `nomeTela`: vazio (padrão), `primeiro-sobrenome`, `so-nome` ou `sem` (só no R2 novo). Com `sem`, a tela não mostra nome, foto nem o vídeo do atleta, o checklist não pede foto nem nome conferido, e a fala do apresentador continua com o nome. Só aparece se a variação mostra o nome do lead e o deck segue a escolha.
- `semFoto` (`sim`): a foto do lead fora da tela. O nome continua, o quadro da foto mostra a inicial e a foto não é pedida no checklist. Só aparece se a variação mostra a foto e o deck usa foto.
- `pular`: ids dos slides opcionais tirados da sequência (só os da variação escolhida, só no R2 novo; trocar de variação derruba o que a nova não tem).

O que vale de verdade é a escolha dentro do que a variação e o deck deixam (`fichaEfetiva` no `_base.js`): é isso que a `/api/r2` manda ao deck e que o checklist usa.

## Testes

Todos sobem um painel e os decks locais, sem tocar na produção (`node testes/<nome>.mjs`; `node testes/servidor.mjs --todos-os-decks` sobe tudo à mão pra olhar). Os decks de verdade são lidos da pasta do lado (`DECK_PASTA`, `DECK_PASTA_R2_ANTERIOR`, `DECK_PASTA_R2_B` e `DECK_PASTA_R1` testam outra cópia). Os que abrem navegador rodam bem de dois em dois; com quatro ou mais Chromes juntos o `teste-navegador` (a presença do apresentador depende do tempo) e o `teste-leitura` ficam instáveis nesta máquina.

- `teste-manifesto.mjs`: o gerador do deck (o `variacoes.json` está em dia e o que o gerador recusa).
- `teste-sincronizacao.mjs`: a sincronização contra os decks de verdade e contra um deck de mentira (página nova, página que cai, que sai, manifesto estragado, deck fora do ar ou lento, o Cron, quem pode sincronizar, deck que cai sem derrubar os outros).
- `teste-etapas.mjs`: as duas etapas na API (papéis, R1 e R2 separados, variações por etapa, importar o R1, o `/api/publico` de antes, o CORS, os limites do R1 sem foto, vídeo e leitura).
- `teste-migracao.mjs`: a atualização em cima do que a loja já tinha (o `versoes.json` de antes, com o deck só em `deck` e variações criadas sem etapa, e leads sem etapa): nada se perde, `deck` vira `decks.r2` na primeira gravação e o R2 de antes abre na variação dele.
- `teste-etapas-telas.mjs [--telas <pasta>]`: a tela de cada papel no navegador (SDR, closer e admin), o R1, as variações por etapa e o recurso de cada deck (com `--telas`, guarda as capturas).
- `teste-decks.mjs`: os decks de verdade falando com o painel de verdade: o R1 e o R2 anterior lendo pelo endereço de antes, o deck de entrada levando o lead pra outro deck, trocar a variação com o mesmo link, a defesa contra origem fora da lista e os links do painel de antes (o servidor de teste sobe um painel de antes de mentira, `s.painelAntigo`, que o teste enche e confere os pedidos).
- `teste-paginas.mjs`: lê o `variacoes.json` de cada deck e confere cada página no navegador (o link de entrada da etapa leva até ela, nº de slides, nome e foto como ela declara, cada opcional sai e volta, a página de exemplos do R2 novo tem link pra ela). Não tem lista de páginas: página nova entra sozinha.
- `teste-sincronizacao-telas.mjs [--telas <pasta>]`: a faixa, os selos, o botão desabilitado, o seletor e o "Sincronizar agora" no navegador.
- `teste-versoes.mjs` (o link abre a variação certa, o slide opcional é pulado, as telas), `teste-versoes-admin.mjs` (classificação, o que a variação mostra do lead, foto fora da tela), `teste-variacoes-criadas.mjs` (as criadas no painel), `teste-igualdade.mjs`, `teste-concorrencia.mjs`, `teste-foto.mjs`, `teste-leitura.mjs`, `teste-isolamento.mjs` e `teste-navegador.mjs`.
