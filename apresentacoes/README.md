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

Em todos os decks, a foto autorizada aparece no slide 02 (a escolha do jogador) e nos quadros de foto que o deck tem: a capa com o “Montado para”, o cartão do atleta, os planos, a garantia e o Bem-vindo, conforme o deck (desde 18/10/2026; de 13 a 17/10 ficava só no slide 02 e os outros quadros mostravam uma inicial solta). Com a foto fora da tela no painel, ou sem foto, os quadros mostram as iniciais do nome e sobrenome (Carlos Eduardo Souza vira CS). Todos os campos da ficha são opcionais: é possível gerar o link vazio e adicionar a foto diretamente no painel antes de preencher qualquer dado. Sem imagem, o slide usa iniciais; sem nome, usa uma chamada genérica.

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

- **Nome e sobrenome em todos os decks.** O R2 anterior (principal, técnica e Acompanhamento) usa a mesma regra do R2 novo: a tela mostra nome e sobrenome (Lucas Almeida da Silva vira Lucas Silva) e segue a escolha "Nome na tela" e o apelido do painel; a fala do apresentador continua com o primeiro nome. As placas ("Montado para", "Apresentação preparada para") são sempre nome e sobrenome, inclusive no R1, que segue chamando pelo primeiro nome nas frases. O código do dossiê é o mesmo em todos os slides (8 caracteres).
- **A capa da Acompanhamento** mostra a foto, "Montado para", o nome e sobrenome e "Dossiê nº". Era ali o "Montado para Carlos Nº ..." com um "C" no lugar da foto.
- **Validade escolhida.** No editor, a seção "Validade do link" tem atalhos (2 h depois da call, no fim do dia da call, 1 dia depois da call, em 24 horas, 3, 7 ou 30 dias) e o dia e a hora à mão, de 1 minuto a 60 dias. Escolhida, a validade não segue mais o dia da call; "Automática" volta pra regra da casa. Vale também na hora de gerar. A caixa "apagar tudo quando o link expirar" deixa a limpeza diária (6h) apagar o lead vencido. Rotas: `POST /api/atletas` com `link: { venceEm, apagarAoVencer }` e `POST /api/link?acao=validade`.
- **Link vencido ou revogado** mostra "Este link não está mais ativo" em todos os decks (o R2 anterior e o R1 antes seguiam com a ficha guardada no navegador). Com a apresentação aberta, ao voltar pra aba do deck, ele busca o painel de novo (nome, foto, validade).
- **Gerados.** Aba nova no painel com tudo o que foi gerado, o espaço de cada um (ficha, foto e vídeo), filtros (apresentados, expirados ou revogados, ainda não apresentados), "Marcar como apresentado" e exclusão um por um ou em lote (`DELETE /api/atletas` com `{ ts }`, até 50 por pedido). O closer vê os dele; o admin, os de todos.
- Teste: `testes/teste-validade-gerados.mjs` (74 verificações).

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
node testes/teste-igualdade.mjs
```

Os testes usam armazenamento temporário e não acessam os leads de produção. Os testes de navegador usam o Chrome instalado, configurável pela variável `CHROME`.

## Publicar

Dentro da pasta do projeto correspondente, vincule o checkout com `npx vercel link --project <nome-do-projeto> --yes`. Nos decks, rode `node gera-manifesto.mjs --confere` antes de `npx vercel deploy --prod --yes`. Para atualizar o manifesto depois de editar páginas, use `node gera-manifesto.mjs`.

As credenciais, as pastas `.vercel`, os dados locais e `node_modules` ficam fora do Git. Configure as variáveis do painel conforme o `PASSO-A-PASSO-VARIAVEIS.md` dele.
