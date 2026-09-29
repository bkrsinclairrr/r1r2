# jev-starter

Kit minimo pra rodar decisoes tipadas com Jev (TypeSafe AI) em vez de
gastar chamada de LLM em roteamento, score e aprovacao sim/nao.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env                # preencha TYPESAFE_API_KEY
export TYPESAFE_API_KEY=sua-chave   # ou use um pacote tipo python-dotenv
```

Chave em: https://console.typesafe.ai (login direto, sem espera. Ganha
$5 de credito, ~120 milhoes de tokens de input).

## Arquivos

- `guardrails.py` — limite de acoes, limite de gasto e gate de confianca.
  Isso e logica sua, nao vem pronta da TypeSafe.
- `chief.py` — orquestrador generico: le um objetivo + trabalho feito,
  pergunta ao Jev quem age a seguir (Choice), a urgencia (Score) e se
  precisa de revisao humana (Noul), tudo numa chamada. Salva o
  resultado em `queue/<destino>/<id>.json`.
- `sdr_router.py` — mesma ideia aplicada a conversas de lead: le um CSV
  de trocas (contexto, mensagem do SDR, resposta do lead) e classifica
  estagio da conversa, eficacia da mensagem do SDR e se o lead esta
  quente. Pensado pra rodar sobre o historico de WhatsApp/Instagram que
  voce ja tem, em lote, pra achar padrao do que funciona. So classifica,
  nao gera nada.
- `sdr_agent.py` — o agente funcional de verdade, 3 camadas.
  Jev decide 4 coisas por troca (estagio, eficacia, lead quente, se
  precisa de resposta agora) numa chamada so. Se a resposta do lead
  nao pede nada (tipo "ok", silencio, spam), PARA por ai, sem gastar
  nada com geracao. So quando precisa responder e a confianca do Jev
  e boa, chama Claude Haiku pra redigir a mensagem, e o texto gerado
  passa pelo `verifier.py` antes de ser aprovado (tenta de novo se
  reprovar, escala pra humano se continuar reprovando). Lead muito
  quente ou confianca baixa vai direto pra fila de revisao humana,
  nunca sai sozinho. No final imprime quantas geracoes caras foram
  evitadas, quantas foram reprovadas na verificacao, e o custo real
  de cada camada, separado.
- `verifier.py` — camada de verificacao/anti-alucinacao. Usa Jev de
  novo (nao um segundo LLM caro) pra checar se o texto gerado inventou
  algo fora do contexto original.
- `AGENTS.md` — contexto pra outra IA (Claude Code, Codex, etc.)
  continuar este projeto sem perder as decisoes ja tomadas. Leia esse
  arquivo antes de pedir pra uma IA mexer no codigo.

## Rodar

```bash
python chief.py
# ou
python sdr_router.py conversas.csv resultado.csv     # so classifica
python sdr_agent.py conversas.csv resultado.csv       # decide + gera + guardrails
```

`conversas.csv` precisa ter as colunas: `contexto,mensagem_sdr,resposta_lead`

`sdr_agent.py` tambem precisa de `ANTHROPIC_API_KEY` (console.anthropic.com),
alem da `TYPESAFE_API_KEY`.

## Testar

Os testes usam clientes falsos e nao chamam Jev nem Claude:

```bash
python -m unittest discover -s tests -v
```

## Antes de confiar nisso em producao

1. **Calibre o limiar de confianca** (`CONFIDENCE_THRESHOLD` em
   `chief.py`) contra uns 100-500 casos reais do seu proprio fluxo,
   ja rotulados a mao. O numero 0.85 do guia original e chute de
   largada, nao verdade universal.
2. **Ajuste `MAX_ACTIONS` e `MAX_SPEND_USD`** pro seu volume real.
3. Isso NAO publica, envia mensagem, nem executa nada sozinho. So
   classifica e roteia. A acao final continua no seu codigo ou com
   aprovacao humana.
4. Jev so aceita texto (string, JSON, lista de textos). Nada de
   imagem, audio ou video ainda.
