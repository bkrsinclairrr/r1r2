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

Em todos os decks, a foto autorizada aparece somente no slide 02, dedicado à escolha do jogador e ao contexto do seu perfil. O nome aparece em outros pontos essenciais da apresentação. Todos os campos da ficha são opcionais: é possível gerar o link vazio e adicionar a foto diretamente no painel antes de preencher qualquer dado. Sem imagem, o slide usa iniciais; sem nome, usa uma chamada genérica.

O plano de entrada agora se chama **Scout PRO** e inclui os **sete módulos de formação**, com um slide dedicado em todas as páginas. A análise do Zyron, a formação e o acompanhamento humano são apresentados com seus respectivos papéis; as entregas humanas seguem o plano escolhido. Os preços foram preservados.

Na variação de acompanhamento, a IA na prática mostra o relatório já pronto, sem vídeo do atleta nem cálculo ao vivo. O slide 22 chama o jogador pelo primeiro nome antes de “você foi escolhido”. A referência de contratação separada soma R$20.000 por ano; a oferta mantém R$247,90 e R$500. O dossiê é entregue somente às apresentações dessa página, e cada jogador tem armazenamento e canal próprios no navegador.

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
```

Os testes usam armazenamento temporário e não acessam os leads de produção. Os testes de navegador usam o Chrome instalado, configurável pela variável `CHROME`.

## Publicar

Dentro da pasta do projeto correspondente, vincule o checkout com `npx vercel link --project <nome-do-projeto> --yes`. Nos decks, rode `node gera-manifesto.mjs --confere` antes de `npx vercel deploy --prod --yes`. Para atualizar o manifesto depois de editar páginas, use `node gera-manifesto.mjs`.

As credenciais, as pastas `.vercel`, os dados locais e `node_modules` ficam fora do Git. Configure as variáveis do painel conforme o `PASSO-A-PASSO-VARIAVEIS.md` dele.
