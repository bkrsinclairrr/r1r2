# AGENTS.md

Contexto pra qualquer IA (Claude Code, Codex, etc.) que for continuar
este projeto. Leia isso inteiro antes de tocar em qualquer arquivo.
Tudo aqui vem de uma investigacao real, com verificacao cruzada contra
documentacao oficial e codigo instalado, nao de suposicao.

## O que este projeto e

Camada de decisao usando Jev (TypeSafe AI, um "System One model") pra
tornar agentes de IA baratos e eficientes: Jev decide (roteamento,
classificacao, aprovacao, verificacao), um LLM (Claude) gera texto so
quando realmente precisa, e codigo comum executa. O caso de uso
concreto e um pipeline de SDR (vendas por WhatsApp/Instagram), mas a
arquitetura e generica.

Dono do projeto: usa Portugues do Brasil, informal e direto, sem
travessao. Prefere respostas assertivas e tecnicas, sem hedging
desnecessario. Aplique isso em qualquer texto/commit message/doc que
voce gerar pra ele.

## Estado atual (o que ja existe, nao refazer do zero)

- `guardrails.py` - limite de acoes, limite de gasto, e gate de
  confianca. Estado persistido em JSON local pra sobreviver a
  interrupcao. `Guardrails` e agnostico de provider: `record_call()`
  recebe o CUSTO EM USD ja calculado, nao tokens brutos, porque uma
  versao anterior assumia preco do Jev pra qualquer token que
  passasse por ali e o custo do Claude Haiku passava sem ser contado
  (achado real numa auditoria do subagente reviewer, corrigido e
  coberto por teste, ver "Bugs ja encontrados e corrigidos" abaixo).
  Use `jev_cost(input_tokens)` (exportado deste modulo) pra chamadas
  ao Jev; pra Claude ou outro provider, calcule o custo real no seu
  proprio modulo (`sdr_agent.py` tem `haiku_cost()`) antes de chamar
  `record_call()`.
- `chief.py` - orquestrador generico de exemplo: decide o proximo
  worker (research/write/review) e salva o handoff numa fila JSON
  local (`queue/<destino>/`). E um exemplo de roteamento, nao o
  pipeline principal.
- `sdr_router.py` - classificador em lote (CSV -> CSV) sobre historico
  de conversas: estagio, eficacia da mensagem do SDR, lead quente.
  So classifica, nao gera nada, nao decide nada de acao.
- `sdr_agent.py` - o pipeline principal, 3 camadas:
  1. Jev decide (estagio, eficacia, lead_quente, precisa_resposta) -
     uma chamada, 4 perguntas em paralelo.
  2. Se precisa_resposta for baixo, para ali (economia de token real,
     nao so latencia: nenhum LLM caro e chamado).
  3. Se precisar responder e a confianca for boa, Claude Haiku gera a
     mensagem. Depois disso, Jev verifica (`verifier.py`) se o texto
     gerado inventou algo fora do contexto. Reprovou -> tenta gerar de
     novo (ate `MAX_TENTATIVAS_VERIFICACAO`). Continuou reprovando ->
     vai pra fila de revisao humana, nunca sai sozinho.
- `verifier.py` - camada de verificacao/anti-alucinacao. Usa Jev
  (Noul) pra perguntar se o texto gerado contem algo que nao estava
  no contexto original. Decisao fechada, nao precisa de um segundo
  LLM caro pra revisar o primeiro.

## Decisoes ja tomadas (nao reabrir sem motivo forte)

- **Jev nunca gera texto.** Se voce se pegar pedindo pro Jev "escrever"
  algo, o design esta errado. Jev so responde Choice (escolha entre
  opcoes), Score (nota numa escala) ou Noul (probabilidade 0-1).
- **Toda decisao de auto-envio passa por 2 filtros: confianca E
  verificacao.** Confianca baixa OU lead/caso critico -> revisao
  humana antes mesmo de gerar. Texto gerado reprovado na verificacao
  -> revisao humana depois de gerar. Nunca sai sozinho quando qualquer
  um dos dois falha.
- **Custo e rastreado de verdade**, nao estimado: TODA chamada que
  custa dinheiro (Jev: decide + verify, Claude: generate_reply)
  calcula o custo real em USD com o preco certo do provider e chama
  `Guardrails.record_call(cost_usd)`. Nao adicione chamada nenhuma sem
  passar por esse tracking, e nao presuma que "gastei X tokens" e
  suficiente, o preco por token difere MUITO entre Jev e Claude
  (25 a 120x), somar tokens crus de providers diferentes na mesma
  conta da numero sem sentido.
- **`check_before_call()` roda de novo a cada tentativa dentro de um
  retry loop**, nao so uma vez no topo da funcao. Um loop com retry
  pode estourar o limite de gasto no meio, nao so na entrada.
- **Nada e enviado automaticamente pro lead/cliente.** O pipeline
  decide e prepara, a acao de enviar de fato e sempre separada,
  humana ou outra integracao explicita.

## Fatos verificados sobre as APIs (nao redescobrir, nao inventar sintaxe)

Confirmado instalando os pacotes de verdade e inspecionando as
assinaturas, nao só lendo doc de terceiro:

- `typesafe_sdk` (`pip install typesafe-sdk`), versao 0.7.1 no momento
  desta investigacao. `TypeSafeClient(api_key=..., model=...).system_one(state=..., questions={...})`
  retorna `SystemOneResponse` com campos `.model`, `.usage`, `.answers`.
  **`.answers` e um dict, nao `.choices`/`.scores`/`.nouls` separados**
  (isso so existe no wrapper `langchain_typesafe.TypeSafeClassifier`,
  que e uma biblioteca diferente). Varios guias na internet confundem
  os dois e quebram em runtime. `ChoiceAnswer` tem `.choice`,
  `.confidence`, `.probabilities`. `ScoreAnswer` tem `.score`,
  `.confidence`, `.legend`, `.probabilities`. **`NoulAnswer` so tem
  `.noul` (a propria probabilidade), NAO tem campo de confianca
  separado.** Nao invente um.
- Base URL: `https://api.typesafe.ai`, endpoint `/v1/systemone`.
  Modelo default do SDK: `jev-latest`. Pra producao, fixe uma versao
  (`jev-1.13.0`) em vez do alias.
- Preco: `$0.042` por milhao de tokens de input, output gratis (o
  modelo nao gera texto, entao nao ha o que cobrar de output).
- Contexto: 32K tokens, so aceita texto (string, JSON, lista de
  textos). Sem imagem/audio/video.
- Conta: sem waitlist (foi removida em 20-21/09/2026). Cadastro direto
  em `console.typesafe.ai`, ganha uns $5 de credito gratis.
- `anthropic` (pacote Python oficial), versao 1.8.0 no momento desta
  investigacao. `Anthropic(api_key=...).messages.create(model=..., max_tokens=..., system=..., messages=[...])`
  retorna `Message` com `.content` (lista de blocos, filtre por
  `block.type == "text"` e use `block.text`) e `.usage.input_tokens`
  / `.usage.output_tokens`.
- Modelo usado neste projeto: `claude-haiku-4-5-20251001`. Preco (na
  data desta investigacao): $1,00/milhao de tokens de input, $5,00/
  milhao de output. Antes de confiar em preco ou nome de modelo,
  confira `docs.claude.com`, isso muda.
- Integracao oficial LangChain existe (`langchain_typesafe`), com
  `TypeSafeClassifier`, `ModelRouterMiddleware` e `AutoModeMiddleware`.
  Este projeto NAO usa LangChain, e feito com o SDK puro de proposito
  (menos dependencia, mais controle). So migre pra LangChain se houver
  motivo concreto (ex: voce ja usa LangGraph pra outra coisa).

## Bugs ja encontrados e corrigidos (nao reintroduzir)

- **Custo do Claude nao entrava no guardrail.** `sdr_agent.py::run_agent`
  chamava `generate_reply` (Claude Haiku) e so acumulava os tokens numa
  variavel local pra imprimir no relatorio final, nunca chamava
  `guardrails.record_call()` com o custo daquela chamada. `MAX_SPEND_USD`
  ficava cego pra parte mais cara do pipeline (Claude e 25 a 120x mais
  caro por token que o Jev). Achado pelo subagente reviewer numa
  auditoria real (leu o codigo linha a linha, nao presumiu), confirmado
  rodando `python -c "import sdr_agent"` e vendo o `ModuleNotFoundError`
  de um problema relacionado (`guardrails.py` fisicamente ausente numa
  copia do projeto), e depois confirmado com teste funcional usando
  clients falsos (nao API de verdade): `guardrails.state.spend_usd`
  batendo exatamente com `haiku_cost(in_tok, out_tok) + jev_cost(...)`
  esperado, e um `MAX_SPEND_USD` baixo de fato bloqueando com
  `GuardrailViolation` antes da chamada estourar o limite. Corrigido:
  `record_call()` agora recebe custo em USD ja calculado (ver secao
  "Estado atual" acima), e `check_before_call()` roda de novo a cada
  tentativa do loop de retry, nao so uma vez na entrada da funcao.
- **Arquivos entregues em lotes separados, nem todos copiados pro
  projeto local.** Nao e bug de codigo, mas aconteceu: `guardrails.py`,
  `chief.py`, `sdr_router.py`, `requirements.txt` e `.env.example`
  foram entregues numa mensagem, `sdr_agent.py`/`verifier.py` noutra,
  `AGENTS.md`/`CLAUDE.md`/`.claude/agents/reviewer.md` noutra ainda, e
  uma copia local do projeto ficou com so parte deles. Se algo
  documentado aqui como "ja existe" nao estiver no diretorio, o
  diagnostico mais provavel e esse, nao um arquivo que nunca foi
  criado. Confirme com o dono do projeto antes de recriar do zero.

## O que falta construir (proximas tarefas concretas)

1. **Generalizar o padrao decide -> gera -> verifica -> escala pra um
   Orchestrator reutilizavel**, que hoje esta meio hardcoded dentro de
   `sdr_agent.py::run_agent`. Ideia: uma classe/funcao que recebe
   3 callbacks (decide_fn, generate_fn, verify_fn) com um contrato
   comum e aplica a mesma maquina de estado (decide -> filtra ->
   confianca -> gera -> verifica -> retry -> aprova ou escala) pra
   qualquer fluxo do negocio, nao so SDR. Esse e o proximo passo mais
   valioso: hoje, pra aplicar isso em outro fluxo (ex: um agente pro
   outro negocio do dono do projeto, WSA/ADM Soberana), seria preciso
   copiar e colar a logica de `run_agent` inteira. Nao deveria ser
   assim.
2. **Calibrar os limiares contra dados reais.** `CONFIDENCE_THRESHOLD`
   (0.85), `RESPOSTA_THRESHOLD` (0.5), `LEAD_QUENTE_REVISAO` (0.8),
   `ALUCINACAO_THRESHOLD` (0.3) sao todos chute inicial. Rode
   `sdr_router.py` sobre uns 100-500 casos reais rotulados a mao e
   ajuste cada limiar pra bater com o julgamento humano.
3. **`generate_reply` nao usa exemplos do que ja funcionou.** O
   `sdr_router.py` produz exatamente esse dado (mensagens com
   `eficacia_score` alto). Falta conectar: pegar os melhores exemplos
   classificados e injetar como few-shot no prompt de `generate_reply`.
4. **Persistencia de fila de revisao humana.** Hoje `revisao_humana`
   e so uma linha no CSV de saida. Se o volume crescer, isso precisa
   virar uma fila de verdade (tabela num banco, ou pelo menos pasta
   JSON como o `chief.py` ja faz), com um jeito de um humano marcar
   "aprovado, pode mandar" ou "rejeitado".
5. **Nao existe teste automatizado ainda.** Antes de expandir mais,
   vale ter alguns casos fixos (sem chamar a API de verdade, usando um
   client fake) que verificam a maquina de estado: precisa_resposta
   baixo -> sem_acao; confianca baixa -> revisao; verificacao reprova
   2x -> revisao com `motivo_revisao=falhou_verificacao_anti_alucinacao`.

## Erros ja cometidos por outras fontes (nao repetir)

Dois threads populares no X/Twitter sobre Jev (posts de "@0xMovez" e
"@0xCodila", semana de 15-18/09/2026) tem o mesmo bug: importam o SDK
puro (`typesafe_sdk`) mas usam `result.choices["campo"]`, sintaxe do
wrapper LangChain. Isso quebra com `AttributeError`. Os numeros de
benchmark desses threads (200x mais rapido, 400x mais barato) sao
reivindicacao do proprio vendor (TypeSafe), nao numero independente.
O unico numero medido de forma independente que confirmamos foi do
repositorio `browser-use/jev-ultrafast`: tempo mediano caiu de 9,450s
pra 7,092s (25%), chamadas de protocolo do browser cairam de 1.092
pra 101, em 3 repeticoes de uma tarefa, nao um benchmark geral.

## Convencoes

- Python 3.12+, `from __future__ import annotations` no topo de todo
  arquivo novo.
- Toda chamada ao Jev ou ao Claude passa pelo `Guardrails` (limite de
  acao, limite de gasto). Nao adicione uma chamada solta.
- Dataclasses pra resultado de cada camada (`Decision`, `Veredito`,
  `AgentResult`), nao dict solto.
- Nunca commitar chave de API. `.env.example` documenta as variaveis
  esperadas (`TYPESAFE_API_KEY`, `ANTHROPIC_API_KEY`).
- Nomes de variavel e comentario em portugues (e o padrao que o dono
  do projeto usa em todo o resto do codigo aqui), nomes de
  classe/funcao em ingles quando forem termos tecnicos padrao
  (`Decision`, `verify`, etc), sem misturar os dois no mesmo termo.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
