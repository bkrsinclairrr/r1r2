# Painel do Closer: variáveis e publicação

Nada disso foi feito ainda: o painel novo e o R2 novo não estão no ar. São 6 passos, nesta ordem. O painel vai antes do R2 porque o R2 novo busca o atleta na rota `/api/r2`, que só existe no painel novo.

Nada aqui mexe no painel atual (`jogador-de-elite-painel`), no R1 ou no R2 atual. A loja de Blob deste painel é NOVA: nunca ligue a loja do painel atual a este projeto, porque ela aponta pros atletas que estão no ar.

## 0. Antes de começar

- O terminal precisa estar logado na Vercel, na mesma conta do painel atual (já está).
- Conferido em 11/10/2026: não existe projeto `jogador-de-elite-closer` na conta. Se aparecer um com esse nome que não seja este painel, use `jogador-de-elite-closer-2` e me avise (o endereço do painel muda junto, ver o passo 4).
- O projeto `jogador-de-elite-r2-novo` já existe na conta, ainda sem nada no ar. A pasta do R2 novo já está ligada a ele.

## 1. Os segredos (já feito)

- O `.env.local` desta pasta já foi gerado pelo `gera-segredos.mjs`, em 11/10/2026. Ele tem 6 variáveis e fica só no seu computador (o `.vercelignore` e o `.gitignore` seguram).
- A senha inicial do admin (login `admin`) está no relatório da entrega e em mais nenhum lugar. No arquivo vai só o hash dela.
- Perdeu a senha antes de publicar: apague o `.env.local` e rode `node gera-segredos.mjs` de novo. Sai uma senha nova, uma vez.

## 2. Criar o projeto e mandar as variáveis

Dois cliques no `ENVIA-VARIAVEIS.bat`. Ele cria o projeto `jogador-de-elite-closer` na Vercel, liga esta pasta a ele e manda as 6 variáveis pra Production, sem mostrar nenhum valor. Se a pasta estiver ligada a outro projeto, ele para sem mandar nada.

| Variável | Pra que serve | Tipo na Vercel |
| --- | --- | --- |
| `PAINEL_SEGREDO` | assina o cookie de login | Secret |
| `PAINEL_ADMIN_LOGIN` | o login do admin (`admin`) | Config |
| `PAINEL_ADMIN_HASH` | a senha do admin, em hash (a senha mesmo não vai) | Secret |
| `CRON_SECRET` | a senha da limpeza diária (a Vercel manda sozinha no Cron) | Secret |
| `DECK_ORIGINS` | o único site que pode ler o painel pelo navegador (o R2 novo) | Config |
| `DECK_URL` | o endereço do R2 novo, pro link do atleta e pra prévia | Config |

Se o `.bat` for bloqueado ou alguma variável falhar, dá pra fazer na mão: vercel.com, projeto `jogador-de-elite-closer`, Settings, Environment Variables, uma por uma, só em Production. Os valores estão no `.env.local` (abra no Bloco de Notas). O `PAINEL_ADMIN_HASH` vai sem as aspas simples do começo e do fim.

## 3. Criar a loja de Blob (privada) e ligar ao projeto

1. vercel.com, projeto `jogador-de-elite-closer`, aba Storage, Create Database, Blob.
2. Nome: `jogador-de-elite-closer-blob`. Acesso: Private (o mesmo tipo da loja do painel atual).
3. Connect Project: `jogador-de-elite-closer`, com Production marcado. A Vercel cria sozinha a variável `BLOB_READ_WRITE_TOKEN` neste projeto.
4. Confira em Settings, Environment Variables: as 6 do passo 2 e o `BLOB_READ_WRITE_TOKEN`. Nunca cole aqui o token de outra loja.

## 4. Publicar o painel

- Dois cliques no `PUBLICAR-CLOSER.bat`. Ele só publica se a pasta estiver ligada ao `jogador-de-elite-closer`.
- No fim, procure a linha "Aliased" (ou "Production"). O endereço do painel tem que ser `https://jogador-de-elite-closer.vercel.app`.
- Se a Vercel der outro endereço (acontece quando o nome curto já está em uso fora da conta, como aconteceu com o `mnkk`), pare aqui: não publique o R2 novo e me mande o endereço. Ele aparece em 3 lugares, que eu troco: o `PAINEL` no `assets/deck.js` do R2 novo, e o `frame-ancestors` e o `/admin` no `vercel.json` do R2 novo.
- Variável nova ou trocada só vale depois de publicar de novo.

## 5. Conferir o painel (uns 5 minutos)

1. Abra `https://jogador-de-elite-closer.vercel.app` e entre com `admin` e a senha inicial.
2. Trocar senha: troque pela sua. A inicial deixa de valer.
3. Usuários: crie um login pra cada closer, papel Closer (R2), com senha de pelo menos 10 caracteres.
4. Teste de fumaça da loja: crie um R2 com nome fictício, suba como foto uma imagem que não seja de atleta (a `kaio-01.jpg` do deck serve), marque a autorização e confira a prévia. Copie o link.
5. Leitura do atleta (opcional): no mesmo R2 de teste, envie um vídeo curto que não seja de atleta e marque dois lances. O envio de vídeo só funciona aqui, no ar.
6. No fim do passo 6, apague esse R2 de teste (Apagar tudo).

## 6. Publicar o R2 novo

- Só depois do passo 5. Dois cliques no `PUBLICAR-R2-NOVO.bat`, na pasta `jogador-de-elite-r2-novo` (ele continua igual).
- O endereço tem que ser `https://jogador-de-elite-r2-novo.vercel.app`, que é o que o painel usa no link e na prévia. Se sair outro: me mande. Ele entra no `DECK_URL` e no `DECK_ORIGINS` (Settings, Environment Variables, depois `PUBLICAR-CLOSER.bat` de novo) e no `frame-src` do `vercel.json` do painel.
- Abra o link do R2 de teste: a capa com o nome e a foto, o 19 (o que ele leva) e o 27. Aperte P pro apresentador.

## O que roda sozinho depois

- Todo dia, por volta das 6h de Brasília (9h UTC; no plano gratuito a Vercel escolhe o minuto dentro da hora), a limpeza apaga foto com mais de 90 dias, sobras de envio, presença velha e o registro do atleta 180 dias depois do link vencer. O log tem só contagem, nunca nome.
- O vídeo do atleta vence 24 horas depois do envio (desde 20/10/2026; o closer renova por mais 24 no painel). A passada dos vídeos apaga o vencido da loja: na limpeza das 9h, nos Crons leves das 3h, 15h e 21h UTC (/api/limpeza?so=videos) e, no máximo uma vez por hora, quando alguém usa o painel. Sem limite de tamanho por vídeo, mas com uma guarda do espaço de todos os vídeos juntos: VIDEOS_ESPACO_MAX_MB (opcional, padrão 600). Passou dela, o envio é recusado com a mensagem pra apagar vídeos de leads já apresentados na aba Gerados.
- O vídeo toca pelo link assinado do Blob (10 minutos, direto do CDN). Se algo der errado com ele, o painel volta sozinho pro stream pela função; pra forçar o stream, crie VIDEO_MODO=proxy (Config, Production) e publique de novo.
- Inventário da loja (espaço por pasta e os vídeos de cada lead, só lista): dois cliques no INVENTARIO-DA-LOJA.bat.
- O plano gratuito da Vercel aceita 12 funções por projeto. O painel usa as 12: a próxima rota nova precisa entrar dentro de outra.
- A sincronização com os 4 decks (R2 novo, R2 anterior, R2 B e R1) roda na abertura da lista de variações (se a última foi há mais de 2 minutos), junto da limpeza diária e no botão "Sincronizar agora".

## 7. Conferir as duas etapas (R1 do SDR e R2 do closer) e os 4 decks (uns 5 minutos, depois do passo 5)

1. Usuários: crie um login com papel SDR (R1). Ele só vê o R1 (Meus R1, + Novo R1 e as variações do R1).
2. Entre como o SDR (outro navegador, ou uma janela anônima): + Novo R1, com nome, posição, idade, cidade e o dia e a hora da R2. O link sai do deck do R1 (`https://jogador-de-elite-r1.vercel.app/?a=...`). Abra: o primeiro nome e a ficha (slide 02) têm que aparecer.
3. Entre como closer: Importar o R1 de um SDR, cole o link do R1. A ficha do R2 já vem pronta.
4. No R2, escolha a Principal do R2 anterior (ou a do R2 B) e salve. Abra o MESMO link do R2 (`https://jogador-de-elite-r2-novo.vercel.app/?a=...`): ele tem que cair no deck escolhido. Volte pra Principal do R2 novo e salve: o mesmo link volta pro R2 novo.
5. Entre como admin, aba Variações: o filtro R1 · SDR / R2 · Closer troca a etapa, **Sincronizar agora** tem que dizer "todas funcionando" nos 4 decks, e **+ Nova variação** cria uma variação sobre a página de qualquer deck da etapa.
6. Links que o painel de antes (`jogador-de-elite-painel`) já mandou pras famílias: abra um de R1 ou de R2 anterior de um lead antigo. Tem que seguir abrindo, com o nome.
7. Apague os leads de teste (Apagar tudo).

## Se algo der errado

- Não consigo entrar, ou erro logo no login: falta variável (passo 2) ou o painel foi publicado antes dela. Mande a variável e publique de novo.
- A foto não salva ("O painel não conseguiu salvar"): falta a loja de Blob ligada ao projeto (passo 3). Ligue e publique de novo.
- O R2 abre sem foto e sem nome: o endereço do painel no deck não bate com o do ar (passo 4), ou o painel está fora do ar. A família não vê erro, só o deck sem o nome; o apresentador avisa.
