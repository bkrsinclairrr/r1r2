# CL0 e vídeo do painel: plano de implementação

Data: 20/10/2026. **Executado no mesmo dia** (o resumo do que entrou e do que ficou de fora está em `apresentacoes/README.md`, seção "CL0, vídeo de 24 horas e mapa de calor por posição"). Ficaram de fora, de propósito: a recompressão e o faststart do B5 (pedem a medição do B0 no ar, que precisa do login do dono; o `?perf=1` do painel mede), o B3 (3) (revogar e encerrar não apagam o vídeo, porque voltam atrás; ele some sozinho em até 24 horas) e o `--apagar` do inventário da loja (só depois de o dono conferir a lista). A passada "de vez em quando" ficou em 1 hora, não 10 minutos (cada passada é uma listagem do Blob).

> **Pra quem for executar um bloco:** leia "Como se orientar" e "Regras que valem pra tudo", depois só o seu bloco. Cada bloco foi escrito pra rodar sozinho, sem o contexto da conversa que gerou o plano.

## Objetivo

1. **CL0**: uma variação nova do R2 anterior, copiada da Técnica (`https://jogador-de-elite-r2.vercel.app/variacoes/tecnica/`), com as poucas alterações que um closer pediu. Nada se recria.
2. **Painel e decks**: vídeo do atleta rápido, sem limite de tamanho e de tempo, que some em 1 dia e é apagado de verdade; mapa de calor escolhido numa lista por posição; nenhum campo obrigatório; "Quando o Zyron começa" vira "Imediatamente".

## Como se orientar

- `apresentacoes/` tem 4 decks e o painel. Leia `apresentacoes/README.md` e `apresentacoes/jogador-de-elite-closer/COMO-ACRESCENTAR-VERSAO.md` antes de mexer.
- O CL0 mora só no deck `jogador-de-elite-r2` (R2 anterior). No painel ele aparece sozinho como `r2a-cl0` depois que o deck publica o `variacoes.json`.
- O painel (`jogador-de-elite-closer`) tem 12 funções em `api/`, que é o limite do plano gratuito: **não crie rota nova**, entre dentro de uma existente. Os dados ficam no Vercel Blob privado.
- Os 3 decks do R2 (`jogador-de-elite-r2`, `jogador-de-elite-r2-novo`, `jogador-de-elite-r2-b`) usam o mesmo `assets/dossie-atleta.js` e `.css` (o `teste-igualdade.mjs` confere). O R1 não usa vídeo e não entra neste plano.
- Decks do R2 são UTF-8 com CRLF. O painel é LF. Preserve.
- Testes: `node testes/<nome>.mjs` dentro de `jogador-de-elite-closer` (lista no README). Os que abrem Chrome rodam no máximo 2 por vez nesta máquina.
- Antes de começar: `git status` e `git log --oneline -8`. Já houve revert automático de commits bons (ver memória "Incidente de revert do Codex").
- O deck no ar é idêntico ao da pasta (conferido byte a byte em `variacoes/tecnica/index.html`, `assets/variacoes/tecnica.js`, `assets/roteiro.js` e `assets/deck.js`).

## Regras que valem pra tudo

- Sem travessão em texto nenhum: tela, nota do apresentador, commit, doc. O `gera-manifesto.mjs` recusa.
- Nada abaixo de 24 px na tela, nada fora do palco de 1920x1080, nenhum texto sobre texto.
- Os preços não mudam: R$ 997, R$ 1.497 e R$ 2.997, em 10x sem juros.
- Nenhuma página que já existe no R2 anterior (principal, técnica, acompanhamento) pode mudar: confira por captura antes e depois de qualquer edição em arquivo compartilhado.
- Contrato aditivo: campo novo é opcional e a rota antiga continua funcionando, porque painel e decks são publicados em momentos diferentes.
- Não dê push. Publique pela CLI, como nas últimas vezes. Commits em português.

## O que a investigação mostrou (muda o plano)

1. **"O que você leva" não existe na Técnica do R2 anterior.** Esse slide (com a linha "IA" no avanço 1 e a linha "Garantia" no avanço 6) está no R2 novo e no R2 B (`data-opcional="leva"`, `data-passo="a garantia"` nos 4 arquivos `index.html`). No CL0, a mesma intenção vira: nenhuma menção a garantia antes do slide da garantia (slide 30, linha "Garantia total: todo o valor de volta."). Se o closer estava olhando o R2 novo ou o B, a tarefa A8 faz a mesma limpeza lá.
2. **O título dos planos já sai em caixa alta.** A classe `.t` tem `text-transform: uppercase` (`assets/deck.css:37`). Basta trocar o texto, não precisa mexer em CSS.
3. **A cópia do closer cabe no slide dos planos.** Testei no DOM da página no ar, sem gravar nada: com o cabeçalho enxuto (sem a linha "ritmo e passo", preço e parcela numa linha), a coluna mais comprida termina em 871 px de 988 px possíveis. O título novo cabe nos 1290 px que o atual usa.
4. **A lentidão não é a API.** Medi `GET /api/r2` em produção: 0,30 s com a função morna e 1,08 s fria (borda em São Paulo, função em `iad1`). Sobram como suspeitos o envio do arquivo, o vídeo servido byte a byte por dentro da função e o formato do arquivo. Por isso a tarefa B0 mede antes de consertar.
5. **"Salvar leitura" exige o que o próprio diálogo diz que é opcional.** `painel.js:1825-1826` e `api/leitura.js:118` exigem a fonte (Zyron ou Equipe) e pelo menos 1 lance, enquanto o aviso do diálogo (`index.html:438`) diz que os passos 3 a 5 são opcionais.
6. **Os limites que o dono quer tirar são três, não dois:** 250 MB (`api/_base.js:630`), 5 minutos (`:631`) e a caixa do vídeo no painel, travada em 16:9 com no máximo 440 px de altura (`painel.css:220`). Nos decks a caixa também é 16:9 fixa (`dossie-atleta.css:42-44`, `r2.css:350`, `index.html:307`).
7. **Tirar o limite de tamanho sem guarda pode travar o painel inteiro.** Pela documentação da Vercel (consultada em 20/10/2026), o Blob no plano gratuito inclui 1 GB e 2.000 operações avançadas por mês (put, list e copy contam), e estourar bloqueia o acesso ao Blob por até 30 dias. O painel guarda tudo no Blob: fichas, índices, usuários. Confirme o plano e o uso no dashboard (Storage > Blob > Usage).
8. **O Cron do plano gratuito roda 1 vez por dia, com precisão de ±59 minutos.** A retenção de 1 dia não pode depender só dele (`vercel.json` roda a limpeza às 9h UTC).
9. **A limpeza diária gasta operações à toa.** `api/limpeza.js:49` e `:54` fazem 2 `list` por lead por dia. Com 30 leads são 60 operações avançadas por dia, quase o limite mensal inteiro (2.000), se o plano for o gratuito. E a limpeza de "sobra de envio interrompido" existe pra foto e mapa, mas não pra vídeo.
10. **A Vercel não recomenda servir arquivo acima de 100 MB por dentro de função em Blob privado.** Existe link assinado de leitura (`issueSignedToken` e `presignUrl`), que já está no `@vercel/blob` 2.8.1 instalado. É o caminho pra o vídeo tocar rápido sem deixar de ser privado.
11. **`PRAZOS.zyron` mora em 3 arquivos** (`regras.js:36-39` do painel e `assets/roteiro.js:781-784` do R2 novo e do R2 B). O R2 anterior não valida a lista.

## Decisões do dono (o plano já adota o padrão da terceira coluna)

| # | Dúvida | Padrão adotado | Se for diferente |
| --- | --- | --- | --- |
| D1 | O nome é "CL0" com zero ou "CLO" com letra? | Zero, como digitado: nome `CL0`, pasta `cl0`, id no painel `r2a-cl0` | Troca em 3 lugares (bloco `r2-variacao`, pasta, `cl0.js`) |
| D2 | A base é a Técnica do R2 anterior (32 slides), como pedido? | Sim | Se o closer olhava o R2 novo, a base muda e este plano precisa ser refeito |
| D3 | "Vitalício" aparece em 3 lugares do deck e não aparece no texto do closer. Mantém? | Mantém (é promessa de preço já aprovada) | Tirar de `pl-pr`, do slide 30 e do rodapé |
| D4 | Slide 30 diz "R$ 30 mil+ em média" e o slide 27 passa a dizer "R$ 5 a 30 mil" | Alinha o slide 30 pra mesma faixa, sem "em média" | Esconder o bloco com `retorno: false` |
| D5 | Termos novos (assessor de carreira, Davi) contra os antigos (gerente de carreira, estrategista, David) | Só nos slides 29, 30, 32 e nas notas deles. O resto vira varredura depois da prévia | Varredura total: 16 ocorrências no HTML e 25 no roteiro da Técnica |
| D6 | Onde entra "ESCOLHA O ACOMPANHAMENTO PARA O SEU ATLETA" | No lugar da pergunta do canto superior direito, no último avanço | Linha acima da tabela |
| D7 | Vídeo some 1 dia depois do envio. E se o closer sobe na véspera da call? | 24 horas contadas do envio, com a hora do vencimento visível e botão "Renovar por 24 h" | Contar a partir da call |
| D8 | Autorização do responsável pelo vídeo | Mantém a caixa (é o registro de consentimento de menor), mas leve: uma marcação, sem passo extra | Tirar, se o jurídico aceitar |
| D9 | Sem limite de tamanho e tempo por vídeo | Sem limite por vídeo, com um teto global de espaço dos vídeos (padrão 600 MB, variável de ambiente) pra não travar o Blob | Sem teto nenhum, só se o plano da Vercel for Pro |
| D10 | O mapa escolhido na lista é típico da posição, não é dado do jogo dele, e o subtítulo do slide diz "onde o seu jogo acontece". O dono tirou os avisos de "ilustrativo" da tela em 18/10 | Sem aviso na tela. O subtítulo passa a "onde atua um <posição>" (afirmação verdadeira, não é aviso) e a nota do apresentador diz que o mapa é referência da posição e que ninguém fala dele como dado do atleta | Manter "onde o seu jogo acontece" |
| D11 | "Imediatamente" no lugar de "no dia seguinte" e "em até 48 horas" | A lista passa a ter só `imediatamente`, que vira o padrão. Valores antigos salvos viram `imediatamente` | Manter as duas opções antigas junto |
| D12 | Vídeo por link assinado de vida curta | Sim, 10 minutos. Revogar o link não derruba o vídeo que já está tocando por até 10 minutos | Continuar servindo pela função (mais lento) |

## Mapa das tarefas

Peso: leve (1 sessão curta), médio, pesado. "Opus" é sugestão: onde há investigação, desempenho ou layout, o raciocínio mais forte paga.

| ID | O que | Onde mexe | Peso | Depende de | Opus? |
| --- | --- | --- | --- | --- | --- |
| A1 | Criar a página CL0 (cópia da Técnica) | R2 anterior | leve | nada | não |
| A2 | Slide 27: "de R$ 5 a 30 mil por mês" | R2 anterior | leve | A1 | não |
| A3 | Slides 28 e 32: "imediatamente" | R2 anterior | leve | A1 | não |
| A4 | Slide 29: planos sem preço primeiro, copy do closer, título | R2 anterior | médio | A1 | sim |
| A5 | Slide 30: sem garantia, consistente com o 29 | R2 anterior | médio | A4 | não |
| A6 | Notas do apresentador do CL0 | R2 anterior | médio | A2 a A5 | não |
| A7 | Testes, prévia e publicação do CL0 | R2 anterior + painel | leve | A1 a A6 | não |
| A8 | (opcional) Tirar "Garantia" do "O que ele leva" do R2 novo e B | R2 novo e B | leve | nada | não |
| B0 | Medir o fluxo do vídeo antes de consertar | painel + decks | médio | nada | sim |
| B1 | Tirar limites de tamanho e tempo, com guarda de espaço | painel | médio | nada | não |
| B2 | Vídeo vence em 24 horas e pode renovar | painel | médio | nada | não |
| B3 | Apagar vídeo de verdade e gastar menos operações | painel | pesado | B2 | sim |
| B4 | "Salvar leitura" sem obrigatoriedade e rápido | painel | médio | nada | não |
| B5 | Envio mais rápido (capa automática, recompressão se a medição pedir) | painel | pesado | B0 | sim |
| B6 | Vídeo toca rápido (link assinado) e na proporção certa | painel + 3 decks | pesado | B0 | sim |
| B7 | Testar o envio no ambiente local | painel (testes) | médio | nada | não |
| C1 | Gerador de mapas de calor por posição | módulo novo | médio | nada | sim |
| C2 | Painel: escolher e pré-visualizar o mapa | painel | médio | C1 | não |
| C3 | Decks: desenhar o mapa escolhido | 3 decks | médio | C1, C2 | não |
| D1 | Nenhum campo obrigatório no editor | painel | leve | nada | não |
| E1 | "Imediatamente" na lista do Zyron | painel + R2 novo + R2 B | leve | nada | não |
| F1 | Documentação, testes finais e ordem de publicação | tudo | leve | todas | não |

**Ordem e paralelismo.** O bloco A (só R2 anterior) é independente dos blocos B a E. Dá pra rodar 3 sessões ao mesmo tempo: (1) A1 a A7; (2) B0 e depois B1 a B7; (3) C1 a C3, D1 e E1. Cuidado: B6 e C3 mexem no mesmo par `dossie-atleta.js` e `.css`, então ficam na mesma sessão ou um depois do outro. A3 e E1 conversam (o texto "imediatamente"), mas não travam um ao outro.

---

## Bloco A: a variação CL0

Todas as edições do bloco A ficam em `apresentacoes/jogador-de-elite-r2/`. Qualquer edição em arquivo compartilhado (`assets/deck.js`, `assets/r2.css`, `assets/roteiro.js`) tem que ser no-op pras outras páginas.

### A1. Criar a página CL0

**Fazer**

- [ ] Copiar `variacoes/tecnica/index.html` para `variacoes/cl0/index.html`, preservando CRLF. Os caminhos relativos (`../../assets/...`) continuam certos.
- [ ] Trocar o bloco `r2-variacao` (linhas 20-32): `nome: "CL0"`, `resumo` e `quando` novos (até 300 letras, sem `<`, `>` nem travessão), `validacao: "nao-validada"`, `lead: { nome: true, foto: true }`, `opcionais: []`. Sugestão de resumo: "Técnica com os ajustes do closer: planos antes dos preços, faixa de R$ 5 a 30 mil por mês e garantia só no slide da garantia." Sugestão de quando: "Mesma indicação da Técnica, quando o closer quiser mostrar os planos antes dos preços."
- [ ] Ajustar `<title>` e o comentário do topo; trocar o inline `window.VARIACAO_NOME` (linha 842) para `"CL0"`.
- [ ] Criar `assets/variacoes/cl0.js` **fino**, carregado logo depois de `tecnica.js` (linha 836, antes de `ordem-garantia.js`): ele não copia a Técnica, só sobrescreve o que o CL0 muda (`window.PLANOS`, entradas de `window.ROTEIRO`, `window.CHECKLIST`, `window.VARIACAO_NOME`). O padrão está em `assets/variacoes/acompanhamento.js` (`const [scouting, pro, legacy] = window.PLANOS; window.PLANOS = [...]`). Assim o diff do CL0 contra a Técnica fica pequeno e auditável, que é o que "só alterar algumas coisas" pede. Copiar o `tecnica.js` inteiro também é aceito pelo guia, se preferir.
- [ ] Acrescentar um cartão do CL0 em `variacoes/index.html` (o menu "Variações da R2" do deck), no molde do cartão da Técnica (linhas 55-77).
- [ ] `node gera-manifesto.mjs` (gera o `variacoes.json` com a página nova) e `node gera-manifesto.mjs --confere`.

**Pronto quando:** `https://<deck local>/variacoes/cl0/` abre com 32 slides, idênticos aos da Técnica; as 3 páginas antigas continuam com o mesmo `hash` no `variacoes.json`.

### A2. Slide 27 ("Interesse alinhado", origem 20)

**Onde:** `variacoes/cl0/index.html` linhas 626-628; fala em `assets/variacoes/tecnica.js:188` e `:195`.

- [ ] Linha de cima: "Hoje, um atleta que a gente coloca num clube fecha ganhando de" (sai o "por volta de").
- [ ] Número grande: texto fixo `R$ 5 a 30 mil` no lugar de `data-bind="faixaContrato"` (que vem do padrão `R$ 20 a 30 mil+` do `deck.js:29`). Sem o "+". Mantenha `white-space:nowrap`; o texto novo é mais curto que o atual, então cabe nos 250 px.
- [ ] Fala do apresentador (no `cl0.js`): ligar com o áudio da mãe do slide 18 (`assets/audio/depoimento-mae.mp3`): a mãe fala em R$ 5 mil por mês, e "R$ 5 mil" é o começo da faixa. **Ouça o áudio e confira o que ela diz antes de citar o valor.**

**Pronto quando:** o slide mostra "DE R$ 5 A 30 MIL POR MÊS" em caixa alta, sem estourar a largura, e o `[faixa]` sumiu da fala do CL0.

### A3. Slides 28 e 32: "imediatamente"

**Onde:** `variacoes/cl0/index.html` linhas 651-652 (slide 28) e 784 (slide 32).

- [ ] Trocar `data-fb="em seguida"` por `data-fb="imediatamente"` nos dois lugares (é o que aparece quando o painel não manda o prazo). Com o E1 pronto, o valor do painel também será "imediatamente".

**Pronto quando:** sem prazo na ficha, o slide 28 termina "…o Zyron começa a ler o jogo do <nome> imediatamente."

### A4. Slide 29 ("Os planos", origem 23): o coração do pedido

**Onde:** `variacoes/cl0/index.html` linhas 668-711; `assets/roteiro.js:518-609` (`window.PLANOS`, que o `cl0.js` sobrescreve); `assets/deck.js:197` (rótulo "Tudo do X, mais") e `:379-396` (`drawPlanos`); `assets/r2.css:167-200`.

**Fazer**

- [ ] **Título:** "Vocês não estão mais sozinhos." (a classe `.t` já deixa em caixa alta; mantenha o destaque em "sozinhos").
- [ ] **Textos dos planos:** use exatamente a cópia do closer (apêndice 1) no `window.PLANOS` do `cl0.js`. Cada `vantagens` é `[cargo, benefício]`, que é o formato "*Rótulo:* texto" do closer. Mantenha o `nome` interno de cada plano igual ao de hoje (`Assessoria de Elite Legacy` etc.), porque a ficha salva pelo painel procura o plano por esse nome; mude só a exibição (`marca`): `[['Assessoria Elite', 'pre'], ['Legacy', 'ou']]`. Escreva "PRO" em caixa alta, como o deck sempre fez, mesmo que o closer tenha escrito "Pro" no corpo.
- [ ] **Dois ajustes pequenos e compatíveis no `deck.js`** (R2 anterior): (a) `d[p.id + '.mais']` passa a respeitar um `p.mais` do plano, quando existir (o Scout PRO do closer não tem rótulo, o Legacy tem "Tudo da Assessoria PRO, com acompanhamento ampliado:"); (b) item de `vantagens` com cargo vazio não imprime `<b>:</b>` (serve pra "Grupo limitado a dez atletas."). Sem `p.mais` e com cargo preenchido, o comportamento é o de hoje. Se preferir não tocar no `deck.js`, escreva as colunas direto no HTML do CL0.
- [ ] **Preço só depois dos planos.** As colunas continuam nos avanços 1, 2 e 3. O preço e a parcela das três colunas ficam num elemento com `data-step="4"` (mesma linha "R$ 997 | 10x sem juros de R$ 99,70" do closer; o `opacity:0` do `r2.css:237` reserva o espaço, então nada pula quando aparece). A recomendação ("Minha recomendação", `.pl-rec`, e o "O ideal · minha recomendação" do Legacy) vai pro avanço 5. O texto "ESCOLHA O ACOMPANHAMENTO PARA O SEU ATLETA" entra no lugar da pergunta do canto (`.pl-perg`, hoje no avanço 3), também no avanço 5. Atualize os `data-passo`, que o apresentador mostra ("os preços dos três planos", "a recomendação e a pergunta").
- [ ] **Cabeçalho enxuto (recomendado).** Tire a linha "ritmo · passo" (`.pl-rt`) e deixe preço e parcela numa linha só, que é também o formato do closer. Na medição, a coluna do Scout PRO (a mais estreita, 380 px, por isso a mais alta) termina em 871 px de 988; sem enxugar o cabeçalho (mais ~92 px) ela termina perto de 963 px, ainda cabe mas com folga mínima. Mantenha 24 px ou mais.
- [ ] **Rodapé legal** (classe `legal`, 24 px, à esquerda do contador "29 / 32", entre 990 e 1040 px): "Encaminhamentos representam oportunidades reais, sem garantia de aprovação ou contratação." Sempre visível, nunca atrás de avanço.
- [ ] Decisão D3: "vitalício" fica ou sai da linha de preço.

Referência visual do encaixe: `docs/superpowers/plans/img/2026-10-20-cl0-teste-de-encaixe-slide-29.png`. É um teste (a cópia do closer injetada no DOM da página no ar, sem gravar nada), não o desenho final: a pergunta do canto e o selo "O ideal · minha recomendação" ainda são os de hoje, e os preços aparecem porque o teste revelou todos os avanços.

**Pronto quando**

- nos avanços 0 a 3 nenhum "R$" aparece na tela do slide 29 (confira por `getComputedStyle(...).opacity` dos elementos de preço);
- no avanço 4 aparecem os 3 preços; no 5, a recomendação e a pergunta;
- o texto dos 3 planos bate palavra por palavra com o apêndice 1;
- nada abaixo de 24 px, nada passando de 988 px de altura de tabela, sem texto sobre texto;
- `variacoes/tecnica/`, a principal e a acompanhamento continuam idênticas por captura.

### A5. Slide 30 ("O investimento", origem 24)

**Onde:** `variacoes/cl0/index.html` linhas 713-751.

- [ ] **Sem garantia:** `garantia: false` nos 3 planos do `cl0.js`. Isso apaga a linha 738 ("Garantia total: todo o valor de volta."). O slide 31 (a garantia de verdade) continua depois dele.
- [ ] **Coerência com o slide 29:** o `inclui` de cada plano (a lista da esquerda) usa a mesma redação do closer, mas **em uma linha cada** (até uns 62 caracteres, por exemplo "Assessor de carreira: acompanhamento diário"). A coluna da esquerda tem só uns 70 px de folga (o conteúdo termina em 925 px e o rodapé legal começa em 1000) e cada linha a mais custa uns 40 px.
- [ ] **Faixa (D4):** o bloco "Um atleta médio nosso fecha ganhando, em média, R$ 30 mil+ por mês" (linhas 744-747) passa a dizer a mesma faixa do slide 27, sem "em média".
- [ ] Rodapé legal do slide 30 (linha 750): se citar "vitalício", siga a D3.

**Pronto quando:** a palavra "garantia" não aparece em nenhum slide do CL0 antes do 31, e o 30 não passa de 925 px de conteúdo na esquerda.

### A6. Notas do apresentador do CL0

**Onde:** entradas de `window.ROTEIRO` em `assets/variacoes/tecnica.js` (por nome): "Interesse alinhado" (linha 186), "A vaga" (209), "Os planos" (221), "O investimento" (236), "Bem-vindo" (257). O `cl0.js` troca só essas. A entrada "Garantia total" (197) não precisa de edição: o `ordem-garantia.js` a substitui pela fala própria do slide 31.

- [ ] **Os planos:** a fala passa a apresentar os planos sem falar de dinheiro e só depois do avanço 4 dizer "R$ 997, R$ 1.497 e R$ 2.997, todos em 10x sem juros". Hoje essa frase vem antes (linha 227). Na `atencao`, registre o porquê, nas palavras do closer: quando a pessoa vê o preço, para de prestar atenção e começa a pensar no bolso. E registre que isso inverte, só no CL0, a decisão de 06/10/2026 (preço no topo da coluna).
- [ ] **O investimento:** tirar a fala "Com garantia total: todo o valor investido de volta." (linha 241) e apontar pro próximo slide, que é o da garantia.
- [ ] **Interesse alinhado e A vaga:** faixa "de R$ 5 a 30 mil" e a ligação com o áudio da mãe; "imediatamente" no lugar de "em seguida".
- [ ] **Termos (D5):** nas falas dos planos, usar os termos do closer. Ajuste também `fala`, `sai`, `diferenca`, `descer` e `subir` dos 3 planos no `cl0.js`, que o apresentador mostra quando o closer troca de plano.
- [ ] Checklist do CL0 (`window.CHECKLIST`): um item "Conferi que a garantia só aparece no slide 31".

**Pronto quando:** `node gera-manifesto.mjs --confere` passa (ele acusa travessão) e a aba "Ler antes" do apresentador mostra os números de slide certos.

### A7. Testes, prévia e publicação do CL0

- [ ] `node gera-manifesto.mjs`, depois rode (em `jogador-de-elite-closer`): `teste-manifesto`, `teste-sincronizacao`, `teste-paginas` (a página nova entra sozinha, é automático), `teste-igualdade`, `teste-decks`.
- [ ] Criar `testes/teste-cl0.mjs` (molde: `teste-sequencia-sem-combinado.mjs`) que confere, no navegador: título do 29; ausência de "R$" nos avanços 0 a 3 e presença no 4; recomendação no 5; texto do 29 igual ao apêndice 1; "5 a 30 mil" no 27; zero ocorrência de "garantia" antes do 31; "imediatamente" no 28 e no 32; as outras páginas intactas.
- [ ] Prints dos slides 27 a 32 a 1920x1080 (molde: `testes/telas-deck.mjs`) com o avanço final revelado. Mostre ao dono no relato.
- [ ] Publicar: na pasta do deck, `npx vercel link --project jogador-de-elite-r2 --yes`, `node gera-manifesto.mjs --confere`, `npx vercel deploy --prod --yes`. O CL0 é aditivo (nenhuma página existente muda), então pode publicar direto depois dos testes. O painel pega a página sozinho em até 2 minutos, ou pelo botão "Sincronizar agora".
- [ ] No ar: abrir `https://jogador-de-elite-r2.vercel.app/variacoes/cl0/`, criar um lead de teste no painel escolhendo a variação "CL0", abrir pelo link de entrada, passar pelos slides 27 a 32 e apagar o lead de teste.

### A8. (opcional) "O que ele leva" no R2 novo e no R2 B

Se o closer usa esses decks, aplique a mesma ideia: tirar a linha "Garantia" (`data-step="6" data-passo="a garantia"`, linha 810 no R2 novo e 773 no R2 B, em `index.html` e em `variacoes/tecnica/index.html`), ajustar a fala em `notas-do-gestor.md` (linha 28 do R2 novo) e a contagem de avanços. Fora do CL0, então só com decisão do dono.

---

## Bloco B: o vídeo do atleta

Pasta do painel: `apresentacoes/jogador-de-elite-closer/`. Fluxo de hoje: o navegador sobe o arquivo direto pro Blob (`painel.js:1720-1752`, SDK em `vendor/blob-client.js`), a rota `api/leitura.js` só libera o envio (POST) e registra (PUT), o deck lê por `api/video.js`, que entrega o arquivo byte a byte por dentro da função.

### B0. Medir antes de consertar

**Por quê:** o dono relata "demora um século até pra um vídeo de pouquíssimos segundos", mas a API medida é rápida (achado 4). Sem medir, o conserto vira chute.

- [ ] Instrumentar (temporário, atrás de `?perf=1` no painel e de um cabeçalho `Server-Timing` nas rotas `leitura` e `video`): tempo de `confereVideo` (`painel.js:1699`, tem um timeout de 20 s pra HEVC), do PUT de autorização, do POST do token, do envio (MB/s), do PUT que registra, do PUT "Salvar leitura" e do carregamento da prévia.
- [ ] Rodar com um lead de teste em produção e vídeos que não sejam de atleta: um clipe de 3 a 5 s de celular (~10 MB), um de 60 s (~60 MB) e um HEVC de iPhone. Registrar numa tabela: tamanho, codec, duração, se o `moov` está no começo (faststart) ou no fim, e cada tempo acima.
- [ ] Medir o vídeo tocando: tempo até o primeiro quadro no painel (`#lt-video`, rota `/api/video`) e no deck (slide do dossiê e IA na Prática). `curl -s -o /dev/null -w "%{time_starttransfer}\n" -H "Range: bytes=0-" -b <cookie> "<painel>/api/video?t=<código>"`.
- [ ] Reproduzir "Salvar leitura não funciona corretamente": lead novo, subir o clipe, marcar 2 lances, escolher a fonte, salvar. Anotar status, tempo e o que o deck mostra depois.
- [ ] Conferir no dashboard da Vercel: o plano, o uso do Blob (GB e operações avançadas no mês) e o tamanho de `videos/` hoje.
- [ ] Entregar a tabela e o gargalo. A regra pra decidir o B5: se o tempo é de bytes subindo e o arquivo passa de uns 8 Mbps ou 1080p, recomprimir no navegador; se o `moov` está no fim, faststart; se são viagens sequenciais pequenas, juntar as viagens (B4).
- [ ] Apagar o lead de teste e os arquivos no fim.

### B1. Tirar os limites de tamanho e tempo, com guarda de espaço

**Onde:** `api/_base.js:630-631` (`VIDEO_MAX_BYTES`, `VIDEO_MAX_S`), `:640-667` (`limpaLeitura`, usa `VIDEO_MAX_S` quando falta duração), `:675-676` (`limpaVideo`: "passa de 250 MB" e "passa de 5 minutos"); `api/leitura.js:46-53` (`maximumSizeInBytes`, `validUntil` de 60 min) e `:70` (`regras`); `painel.js:1702` e `:1713`; `index.html:270` e `:444`.

- [ ] Remover a recusa por tamanho e por duração no servidor e no navegador. Manter só: formato (mp4, webm, mov), `bytes > 0` e `duracaoS > 0`.
- [ ] Um **teto técnico** escondido no código (2 GB, `maximumSizeInBytes`) e o `validUntil` do token de envio de 60 minutos para 6 horas (sem limite de tamanho, o envio pode demorar mais de 1 hora).
- [ ] **Guarda global de espaço (D9):** antes de liberar o token, somar `videos/` (1 `list`). Acima de `VIDEOS_ESPACO_MAX_MB` (padrão 600), rodar a limpeza do B3; se ainda estiver acima, devolver "O espaço dos vídeos está cheio (X MB). Apague vídeos de leads já apresentados na aba Gerados." O GET da leitura devolve o espaço livre, e o navegador avisa antes de subir se o arquivo escolhido não cabe. A aba Gerados, que já mostra o espaço de cada lead, passa a mostrar também o total dos vídeos.
- [ ] Textos: `index.html:270` e `:444` ("até 5 minutos e 250 MB", "90 dias") passam a falar só do vencimento (B2).
- [ ] Testes: `teste-leitura.mjs:72` e `:88` (hoje recusam "mais de 5 minutos") mudam; acrescentar um caso de vídeo grande aceito e um de espaço cheio recusado.

**Pronto quando:** um vídeo declarado com 600 MB e 20 minutos é aceito pelo servidor (guarda de espaço permitindo); acima da guarda, a mensagem é clara e nada é gravado.

### B2. O vídeo vence em 24 horas e pode renovar

**Onde:** `api/_base.js:27` (`VALIDADE.videoDias: 90`), `:683` (`venceVideo`), `api/leitura.js:70`, `painel.js:1616` e `:1262` (mostram "Sai do ar em <data>"), `R.dataCurta` (`regras.js:253`, devolve só DD/MM, então precisa de uma versão com hora).

- [ ] `VALIDADE.videoHoras = 24` no lugar de `videoDias`; a foto continua em 90 dias. O vencimento é contado do envio.
- [ ] Mostrar data **e hora** do vencimento ("Sai do ar amanhã às 14h32") no diálogo e na seção "Vídeo analisado".
- [ ] Botão **"Renovar por 24 h"** (D7): `PUT /api/leitura {renovar:true}` refaz `venceEm` sem novo envio e anota no histórico. Sem ele, quem sobe o vídeo na véspera da call perde o vídeo antes da call.
- [ ] Vencido, o comportamento que já existe segue: `videoValido` falso, `/api/r2` não manda o vídeo, o deck volta pra "leitura ao vivo", e o item "Vídeo analisado enviado" do checklist (`painel.js:983`) fica pendente.
- [ ] Atualizar `teste-leitura.mjs:74` e `:91` (hoje conferem 90 dias) e `:187-200` (vencido); testar a renovação.
- [ ] Documentação do "90 dias" de vídeo: `PASSO-A-PASSO-VARIAVEIS.md:65`, `notas-do-gestor.md` dos 3 decks do R2 (linhas 19-20 no R2 novo e no B; a do R2 anterior está na linha 298), `index.html:270` e `:444`.

**Pronto quando:** o vídeo enviado agora tem `venceEm` daqui a 24 h (±2 min) e a foto continua com 90 dias.

### B3. Apagar de verdade e gastar menos operações

**Por quê:** vencido o vídeo deixa de ser servido na hora, mas o arquivo só some quando a limpeza passa (1 vez por dia, mais até 59 min). Envio que foi cancelado ou nunca registrou fica pra sempre num lead vivo. O Blob gratuito tem 1 GB e 2.000 operações avançadas por mês.

- [ ] **Passada de limpeza de vídeo** (função em `_base.js`, usada por `api/limpeza.js`, `api/leitura.js` e `api/link.js`): 1 `list` de `videos/` (uma operação avançada) e, só pros leads que têm arquivo velho, ler o registro. Apagar o que venceu, o que não é o vídeo ou a capa atual do registro e tem mais de 2 horas (sobra de envio interrompido, que hoje só foto e mapa têm), e o que é de lead que não existe mais. `del` é de graça.
- [ ] **Quando roda:** (1) na limpeza diária, (2) no máximo 1 vez a cada 10 minutos por instância quando alguém usa o painel (guardar o horário na memória da função), (3) na hora em que o closer marca "encerrar" e em "revogar" (`api/link.js`), apagando o vídeo desse lead. Confirme (3) com o dono: hoje "encerrar" só muda a etiqueta e o link segue valendo pra família rever.
- [ ] **Cron extra:** no plano gratuito cada job roda 1 vez por dia. Acrescentar jobs no `vercel.json` (`crons`) em horários diferentes (por exemplo 3h, 9h, 15h e 21h UTC) apontando pra `/api/limpeza?so=videos`, uma modalidade leve que só faz a passada de vídeo. Confira que o deploy aceita; com 4 jobs o arquivo vencido fica no máximo uns 7 horas.
- [ ] **Gastar menos operações na limpeza diária:** em `api/limpeza.js`, trocar os 2 `list` por lead (`:49` e `:54`) por 1 `list` de `fotos/` e 1 de `mapas/` pra todos, agrupando por código em memória. Isso corta de 2N pra 2 operações por dia.
- [ ] **Limpar o que já está no Blob hoje:** script `limpa-videos-da-loja.mjs` na raiz do painel (entra no `.vercelignore`), que lê `BLOB_READ_WRITE_TOKEN` (`npx vercel env pull .env.blob --environment=production`, apagar o arquivo depois). Por padrão só lista (dry-run): por lead (código, nunca nome), tamanho, idade e se o registro ainda aponta pro arquivo, mais o total por pasta (`fotos/`, `videos/`, `mapas/`, `atletas/`, `indices/`, `chamadas/`). Com `--apagar`, remove vídeo com mais de 25 horas ou órfão. **Rode o dry-run, mostre ao dono e só então apague.**
- [ ] Testes: lead com vídeo vencido some do Blob na passada; envio sem registro some depois de 2 h; o vídeo atual de lead vivo nunca é apagado; a passada de 10 em 10 minutos não roda duas vezes seguidas.

**Pronto quando:** depois da passada, `lista('videos/')` só tem o vídeo e a capa atuais de leads com vídeo válido.

### B4. "Salvar leitura" sem obrigatoriedade e rápido

**Onde:** `painel.js:1822-1832` (salvar), `api/leitura.js:115-122` (PUT da leitura), `api/_base.js:640-667` (`limpaLeitura`).

- [ ] No navegador: tirar os dois retornos antecipados (`:1825` fonte, `:1826` pelo menos 1 lance). Salvar o que estiver preenchido; se nada mudou (`!lt.sujo`), fechar sem chamar o servidor.
- [ ] No servidor: não exigir `origem` (`leitura.js:118`) nem lance. Sem fonte, o deck já esconde o relatório (`leituraOk` falso em `deck.js:174`) e mostra só o vídeo. Na tela do painel, dizer isso: "Sem a fonte, o relatório não aparece no slide".
- [ ] Linha inválida não derruba o salvamento: `limpaLeitura` (`:648-659`) hoje devolve `erros` e o PUT recusa tudo ("Corrija antes de salvar"). Passar a descartar só a linha ruim (ou ajustar o minuto pro limite do vídeo) e devolver `avisos`.
- [ ] Menos viagens ao Blob no PUT: rodar `apagaArquivos(lixo)` e `poeNoIndice(reg)` em paralelo (`leitura.js:129-130`), hoje em sequência.
- [ ] Não recarregar a prévia (`atualizaPrevia()`, `painel.js:1830`) quando a leitura salva não mudou nada visível.

**Pronto quando:** com vídeo enviado e nada mais preenchido, "Salvar leitura" fecha sem erro; com a fonte e 2 lances, salva e o deck mostra; com 1 lance de minuto inválido, salva os outros e avisa.

### B5. Envio mais rápido

Decida o alcance depois do B0. Itens que valem sempre:

- [ ] Rodar `confereVideo` em paralelo com o pedido do token e baixar o timeout de 20 s do HEVC (`painel.js:1709`) pra uns 8 s.
- [ ] **Capa automática:** tirar um quadro (por exemplo aos 0,5 s) do arquivo local e subir o JPEG em paralelo ao vídeo, registrando as duas coisas no mesmo PUT (`painel.js:1739` hoje não manda `poster`). O passo manual "Usar o quadro de agora como capa" (`:1763`) vira opcional. Isso também resolve o canvas "sujo" que o B6 cria quando o vídeo vem de outro domínio.
- [ ] Mostrar velocidade e tempo restante no progresso.

Só se o B0 pedir:

- [ ] **Faststart sem recomprimir** (mp4 e mov com o `moov` no fim): reescrever os offsets `stco` e `co64` e montar `ftyp + moov + mdat` com fatias do `File`, sem carregar o arquivo na memória. Sem perda de qualidade e sem codec.
- [ ] **Recompressão no navegador** quando o arquivo é grande (por exemplo acima de 25 MB), HEVC ou de bitrate alto: WebCodecs com `mp4box.js` pra ler e `mp4-muxer` pra escrever, H.264 até 720p a ~2,5 Mbps, áudio copiado quando for AAC, `fastStart`. Um clipe de 60 s fica em ~19 MB. As bibliotecas precisam ser copiadas pra `vendor/` (a CSP é `script-src 'self'`).

**Pronto quando:** a tabela do B0 refeita mostra o gargalo caindo; um clipe de 3 a 5 s sobe e fica pronto em poucos segundos.

### B6. O vídeo toca rápido e na proporção certa

**Rápido (link assinado, D12):**

- [ ] Em `api/video.js`, depois das mesmas checagens de hoje (link válido, autorização, validade), responder `302` pra uma URL assinada de leitura (`issueSignedToken({ operations: ['get'] })` guardado em memória até perto do vencimento, `presignUrl(..., { operation: 'get', access: 'private', validUntil: agora + 10 min })`) com `Cache-Control: private, max-age=300` no redirecionamento. Os bytes passam a sair do CDN do Blob, com Range, sem passar pela função. Os decks não mudam: continuam pedindo `/api/video`.
- [ ] Variável `VIDEO_MODO=proxy|assinado` pra voltar atrás sem novo código. Com o driver de arquivo (testes), continua o stream de hoje.
- [ ] CSP do painel (`vercel.json`): incluir o domínio privado do Blob em `media-src` (e em `img-src`, se a capa também for por link assinado).
- [ ] Se por algum motivo o link assinado não servir: no mínimo `maxDuration` de 60 em `api/video.js` (`vercel.json` só lista `limpeza`, `atletas` e `versoes`) e um cache de 20 s do registro em memória, pra o Range não ler o Blob duas vezes por pedido.

**Na proporção certa:**

- [ ] Guardar `largura` e `altura` do vídeo no envio (`videoWidth` e `videoHeight`, que o `confereVideo` já lê) em `limpaVideo` e devolver em `/api/r2` (`video: { ok, duracaoS, temPoster, largura, altura }`, `api/r2.js:58`).
- [ ] Painel: `.lt-video` (`painel.css:220`) sem `aspect-ratio:16/9` e sem `max-height:440px` fixos; usar `max-width`, `max-height` e `object-fit: contain`, na proporção real.
- [ ] Decks (`dossie-atleta.css:42-44`, `r2.css:350`, e o `style` do player em `index.html:307`): a caixa segue a proporção do vídeo. Vídeo em pé não pode virar uma faixa estreita no meio de um 16:9: definir a regra de layout (altura máxima, centralizado, mapa de calor ao lado quando o vídeo é vertical) e conferir com um clipe vertical e um horizontal nos 3 decks, no slide do dossiê e na IA na Prática.
- [ ] Sem `largura` e `altura` (vídeo antigo), cair no 16:9 de hoje.

**Pronto quando:** primeiro quadro em menos de 2 s num clipe de ~20 MB, no painel e nos 3 decks; vídeo vertical e vídeo horizontal preenchem a caixa sem corte e sem barras absurdas; `teste-dossie-inimigo` e `teste-leitura` passam.

### B7. Testar o envio no ambiente local

O envio só existe com o driver Blob (`api/leitura.js:28` responde 501 no driver de arquivo), então nenhum teste exercita o diálogo de ponta a ponta.

- [ ] No `testes/servidor.mjs`, simular o envio com o driver de arquivo: aceitar o corpo do arquivo numa rota de teste e devolver o mesmo formato do SDK (`pathname`). Assim o `teste-leitura` abre o diálogo no Chrome, sobe um clipe, marca lances e salva.
- [ ] Cobrir: sem limites, vencimento de 24 h, renovação, "Salvar leitura" vazio, vídeo vertical.

---

## Bloco C: mapa de calor por posição

Hoje o closer sobe uma imagem (`painel.js:1254-1312`, `PUT /api/foto { mapa }`, arquivo em `mapas/<código>/`). Passa a escolher numa lista, com prévia.

### C1. Gerador de mapas por posição

- [ ] Um módulo único, `mapa-calor.js`, com `window.MapaCalor = { lista, svg(id), temId(id) }`. 11 mapas, uma para cada posição que o deck reconhece em `regras.js:204-217`: `GOL`, `LD`, `LE`, `ZAG-d`, `ZAG-e`, `VOL-d`, `VOL-e`, `MC`, `ALE`, `ADD`, `CA` (apêndice 2). SVG gerado por código (manchas com gradiente radial sobre um campo desenhado), sem arquivo de imagem, sem pedido de rede, nítido em qualquer tamanho e igual no painel e nos decks.
- [ ] Convenção de desenho a documentar no arquivo: campo na horizontal, o time ataca da esquerda pra direita, o lado direito do time é o de baixo. Mapas determinísticos (sem sorteio).
- [ ] Cópias idênticas na raiz do painel e em `assets/` dos 3 decks do R2; um script de sincronização e a conferência no `teste-igualdade.mjs`.
- [ ] Teste: cada `id` devolve SVG válido, sem referência externa, com menos de uns 6 KB.

**Pronto quando:** as 11 prévias abrem lado a lado num HTML de teste e cada uma tem a mancha onde a posição joga.

### C2. Painel: escolher e pré-visualizar

**Onde:** `index.html:273-277` (bloco do mapa), `painel.js:1254-1312`, `api/_base.js:173-183` (`CAMPOS`) e `:361` (`PUBLICOS_R2`), `regras.js`.

- [ ] Trocar "Escolher o mapa de calor" (e o `<input type="file">`) por uma grade de miniaturas com o nome da posição, mais "Sem mapa". A posição da ficha (`R.posicaoNoCampo(f.posicao)`) vem pré-selecionada com a marca "sugerido". Clicar numa miniatura seleciona e mostra a prévia grande ao lado.
- [ ] Guardar a escolha na **ficha** (`mapaCalor`, com `opcoes` da lista em `CAMPOS`, e na lista `PUBLICOS_R2`), junto com o resto do rascunho. Não há mais envio separado, não há arquivo e não há `mapas/` pros leads novos.
- [ ] `dossieTemConteudo()` (`painel.js:1211-1216`), `resumo()` (`_base.js:491`) e o checklist passam a contar `mapaCalor` como conteúdo do dossiê.
- [ ] Compatibilidade: lead com mapa enviado antes continua mostrando aquele arquivo, com o botão "Trocar por um da lista" (que apaga o arquivo antigo). A rota `PUT /api/foto { mapa }` fica no lugar (as 12 funções), só sem botão no painel.
- [ ] Subtítulo do mapa (D10): o painel mostra, junto da escolha, como o slide vai dizer ("onde atua um zagueiro"). Nada de aviso de "ilustrativo" na tela.

### C3. Decks: desenhar o mapa escolhido

**Onde:** `assets/dossie-atleta.js` (`derivados`, linhas 42-87, e `atualiza`, 89-158) e `assets/dossie-atleta.css` (`.ds-mapa-img`, linhas 53-60), iguais nos 3 decks.

- [ ] `derivados` lê `f.mapaCalor` e produz o SVG inline (`dsMapaSvg`); `dsM` fica verdadeiro com o mapa escolhido ou com o arquivo antigo; o arquivo antigo, quando existe, tem prioridade.
- [ ] `atualiza` injeta o SVG em `.ds-mapa-img`; o CSS generaliza o seletor da animação de `.ds-mapa-img > img` pra incluir o SVG.
- [ ] Subtítulo (D10): hoje é texto fixo ("· onde o seu jogo acontece") em cada página que tem o slide. Vira `data-bind="dsMapaSub"` (calculado em `derivados`: "onde atua um <posição>" com o mapa da lista, o texto de hoje com o arquivo antigo). São 7 páginas: R2 novo (principal e técnica), R2 B (principal e técnica) e R2 anterior (principal, técnica e acompanhamento).
- [ ] Notas do apresentador do dossiê (`dossie-roteiro.js` e `dossie-roteiro-tecnica.js`, nos 3 decks): avisar que o mapa da lista é referência da posição e que não se fala dele como dado do atleta.
- [ ] Os 3 arquivos continuam idênticos entre os decks (`teste-igualdade`).
- [ ] Atualizar `teste-dossie-inimigo.mjs` (linhas 56-81 hoje sobem um JPEG por `PUT /api/foto`) e criar `teste-mapa-calor.mjs`: as 11 posições, a pré-seleção pela posição da ficha, a escolha que persiste, o mapa embaixo do vídeo nos 3 decks, o dossiê que ainda abre só com o mapa.

---

## Bloco D: nenhum campo obrigatório

**Onde:** `index.html:307`, `:308`, `:310` (asteriscos em Dia, Hora e Plano), `painel.js:956-989` (checklist), e o diálogo do vídeo (B4).

- [ ] Tirar os três `*`. O formulário de "Nova variação" (`index.html:408-409`, do admin) continua como está: variação sem nome não faz sentido.
- [ ] Checklist: manter como informação ("Pronto pra apresentar" só dá a etiqueta), sem nada travando o salvamento nem o "Gerar link". Revisar os textos pra não soarem como exigência.
- [ ] O servidor já não exige campo nenhum (`limpaFicha` descarta o inválido em silêncio, `_base.js:192-234`). Só confirmar por teste: salvar rascunho totalmente vazio, gerar o link sem nada, subir vídeo sem lances.
- [ ] A autorização do responsável pelo vídeo é a única trava que sobra (D8): uma marcação, sem passo a mais.

**Pronto quando:** dá pra salvar o rascunho vazio, subir só o vídeo e gerar o link sem preencher nada.

## Bloco E: "Imediatamente"

**Onde:** `regras.js:36-39` (`PRAZOS.zyron`), `assets/roteiro.js:781-784` do R2 novo e do R2 B (cópias que o `teste-igualdade` confere), `api/_base.js:173` (usa a lista do `regras.js`), `index.html:315` (o campo "Quando o Zyron começa"), `api/importar.js:13`, `deck.js:263` (R2 novo; R2 B equivalente) com o padrão "Em seguida".

- [ ] `PRAZOS.zyron = ['imediatamente']` nas 3 cópias; o campo vem com `imediatamente` por padrão. Valor antigo salvo (`no dia seguinte`, `em até 48 horas`) é lido como `imediatamente`, em vez de sumir: o `CAMPOS` do `_base.js:173` já aceita um mapa `antigos` por campo (o `plano` usa, com `PLANOS_ANTIGOS`).
- [ ] Padrão de tela dos decks que mostram o prazo: "Imediatamente, o Zyron começa." no lugar de "Em seguida" (R2 novo e B); `data-fb="imediatamente"` nas páginas do R2 anterior que mostram o prazo (o CL0 já sai assim pelo A3).
- [ ] Atualizar os testes que usam o prazo antigo: `teste-leitura.mjs:220-227`, `teste-navegador.mjs:124`, `telas-deck.mjs:22`, `teste-etapas-telas.mjs:52`.

**Pronto quando:** o painel só oferece "imediatamente", lead antigo continua abrindo, e `teste-igualdade` passa.

## Bloco F: fechamento

- [ ] Atualizar `apresentacoes/README.md` (seção nova com a data), `COMO-ACRESCENTAR-VERSAO.md` (limites do vídeo, vencimento em 24 h, mapa por posição, CL0) e `PASSO-A-PASSO-VARIAVEIS.md`.
- [ ] Rodar tudo em `jogador-de-elite-closer` (no máximo 2 de navegador por vez): `teste-foto-todos-decks`, `teste-dossie-acompanhamento`, `teste-oferta-acompanhamento`, `teste-paginas`, `teste-etapas`, `teste-etapas-telas`, `teste-bloco`, `teste-validade-gerados`, `teste-dossie-inimigo`, `teste-rascunho-link`, `teste-igualdade`, `teste-leitura`, `teste-cl0`, `teste-mapa-calor`. Na raiz: `python -m unittest discover -s tests -v`.
- [ ] **Ordem de publicação** (contrato aditivo, então qualquer ordem é segura; esta é a mais fácil de verificar): painel primeiro (campos novos opcionais, rota antiga viva), depois R2 novo, R2 B e R2 anterior (com o CL0). Em cada deck: `node gera-manifesto.mjs --confere` e `npx vercel deploy --prod --yes`.
- [ ] Verificação final no ar com um lead de teste: subir um clipe horizontal e um vertical, ver nos 3 decks e no CL0, escolher o mapa, marcar "encerrar", conferir que o vídeo sumiu do Blob, e apagar o lead.
- [ ] Se o modo automático bloquear o deploy em produção (já aconteceu em 09/10/2026), não contorne por outra ferramenta: avise o dono e peça pra ele repetir o pedido ou abrir o `.bat` do projeto. Enquanto isso, publique uma prévia privada (Artifact) dos slides, porque o dono julga pelo que vê no link.

## Riscos

| Risco | Mitigação |
| --- | --- |
| Estourar 1 GB ou 2.000 operações avançadas trava o Blob inteiro, e o painel guarda tudo lá | Guarda de espaço (B1), vencimento de 24 h (B2), limpeza que gasta menos operações (B3). Conferir o plano e o uso no dashboard antes de tudo (B0) |
| Link assinado fica valendo por até 10 minutos depois de revogar | Vida curta (D12); `VIDEO_MODO=proxy` volta ao comportamento de hoje |
| Vídeo some antes da call se o closer sobe na véspera | Hora visível e botão "Renovar" (B2, D7) |
| Edição em `deck.js` ou `r2.css` do R2 anterior mexe nas outras páginas | Mudança só quando o campo novo existe; captura antes e depois da principal, técnica e acompanhamento |
| B6 e C3 editam os mesmos arquivos | Mesma sessão ou em sequência |
| Mapa de calor genérico lido como dado do atleta | Subtítulo verdadeiro no slide e aviso na nota do apresentador (D10) |

---

## Apêndice 1: texto dos planos (fonte: closer, 20/10/2026)

O texto vem do WhatsApp com os asteriscos de negrito removidos e o espaço sobrando em "* Analista de performance:*" corrigido. O "Pro" do corpo vira "PRO" no deck. Confirmar "Davi" contra "David": o deck hoje escreve "David Willer" (3 vezes na Técnica e 15 contando o `roteiro.js` padrão); o closer escreveu "Davi".

**Chamada da tela:** ESCOLHA O ACOMPANHAMENTO PARA O SEU ATLETA

**SCOUT PRO.** Análise e formação para evoluir no futebol. R$ 997 | 10x sem juros de R$ 99,70

- Análise de vídeos com IA: identificação de pontos fortes e prioridades.
- Avaliação e evolução: diagnóstico inicial, relatórios de performance e histórico do atleta.
- Analista de performance: acompanhamento por nosso scout para desenvolvimento do atleta.
- Formação: acesso aos sete módulos de desenvolvimento.
- Preparação para peneiras: guia sobre os critérios observados pelos avaliadores.

**ASSESSORIA PRO.** Orientação semanal e acesso a oportunidades. R$ 1.497 | 10x sem juros de R$ 149,70

Tudo do Scout PRO, mais:

- Assessor de carreira: ligação semanal para orientar e acompanhar os próximos passos.
- Desenvolvimento orientado: aplicação dos sete módulos à realidade do atleta.
- Oportunidades: pelo menos cinco encaminhamentos por mês para clubes no Brasil e no exterior.
- Comunidade e aulas extras: troca com outros atletas e conteúdos complementares.

**ASSESSORIA ELITE LEGACY.** Acompanhamento diário e planejamento individual. R$ 2.997 | 10x sem juros de R$ 299,70

Tudo da Assessoria PRO, com acompanhamento ampliado:

- Assessor de carreira: acompanhamento diário, com relatório e ligação semanal.
- Davi Willer: encontro individual mensal e acompanhamento direto pelo WhatsApp.
- Plano de carreira personalizado: metas e próximos passos definidos para o atleta.
- Mais oportunidades: pelo menos 15 encaminhamentos por mês, com apresentação do perfil a clubes da rede e à AGN.
- Suporte para seletivas: organização de vídeos, avaliações e planejamento da logística com a família.
- Grupo limitado a dez atletas.

**Rodapé:** Encaminhamentos representam oportunidades reais, sem garantia de aprovação ou contratação.

## Apêndice 2: posições dos mapas de calor

| `id` | Posição | Onde a mancha se concentra (time atacando da esquerda pra direita) |
| --- | --- | --- |
| `GOL` | Goleiro | Pequena área e entorno do próprio gol |
| `LD` | Lateral direito | Corredor de baixo, do meio de campo ao fundo de ataque, com recuo ao defender |
| `LE` | Lateral esquerdo | Corredor de cima, no mesmo desenho |
| `ZAG-d` | Zagueiro (lado direito) | Defesa, faixa central-baixa, saída de bola até o meio |
| `ZAG-e` | Zagueiro (lado esquerdo) | Defesa, faixa central-alta |
| `VOL-d` | Volante (lado direito) | Frente da zaga e meio de campo, faixa central-baixa |
| `VOL-e` | Volante (lado esquerdo) | Frente da zaga e meio de campo, faixa central-alta |
| `MC` | Meia central | Meio de campo e entrada da área, no centro, com deslocamento lateral |
| `ALE` | Ponta esquerda | Corredor de cima no terço de ataque, com diagonais pra dentro |
| `ADD` | Ponta direita | Corredor de baixo no terço de ataque, com diagonais pra dentro |
| `CA` | Centroavante | Área, meia-lua e faixa central do terço de ataque |
