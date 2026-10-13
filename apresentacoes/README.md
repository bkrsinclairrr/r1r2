# Apresentações e painel de vendas

Código do painel e dos quatro decks publicados na Vercel. As pastas ficam lado a lado porque os testes do painel usam os decks reais.

| Pasta | Produção |
| --- | --- |
| `jogador-de-elite-closer` | https://jogador-de-elite-closer.vercel.app |
| `jogador-de-elite-r1` | https://jogador-de-elite-r1.vercel.app |
| `jogador-de-elite-r2` | https://jogador-de-elite-r2.vercel.app |
| `jogador-de-elite-r2-novo` | https://jogador-de-elite-r2-novo.vercel.app |
| `jogador-de-elite-r2-b` | https://jogador-de-elite-r2-b.vercel.app |

O R2 anterior tem a variação `/variacoes/acompanhamento/`: Scouting por R$247,90 (10x de R$24,79) e Legacy por R$500 (10x de R$50). A sequência termina em preços, garantia incondicional e Bem-vindo. O painel oferece só esses dois planos nessa página.

## Testar

Na pasta `jogador-de-elite-closer`:

```powershell
npm ci
node testes/teste-oferta-acompanhamento.mjs
node testes/teste-paginas.mjs
node testes/teste-etapas.mjs
node testes/teste-etapas-telas.mjs
```

Os testes usam armazenamento temporário e não acessam os leads de produção. Os testes de navegador usam o Chrome instalado, configurável pela variável `CHROME`.

## Publicar

Dentro da pasta do projeto correspondente, vincule o checkout com `npx vercel link --project <nome-do-projeto> --yes`. Nos decks, rode `node gera-manifesto.mjs --confere` antes de `npx vercel deploy --prod --yes`. Para atualizar o manifesto depois de editar páginas, use `node gera-manifesto.mjs`.

As credenciais, as pastas `.vercel`, os dados locais e `node_modules` ficam fora do Git. Configure as variáveis do painel conforme o `PASSO-A-PASSO-VARIAVEIS.md` dele.
