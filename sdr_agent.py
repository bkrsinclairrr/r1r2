"""
sdr_agent.py - fecha o loop: decide com Jev, gera com Claude so quando precisa.

sdr_router.py (arquivo anterior) so classificava em lote. Este aqui e um
agente funcional: le uma troca, decide o que fazer, e executa.

Camadas:
  1. JEV DECIDE (barato, ~200ms): estagio da conversa, eficacia da ultima
     mensagem do SDR, se o lead esta quente, e se essa resposta do lead
     EXIGE uma resposta gerada agora (precisa_resposta). Isso e o filtro
     que economiza token: mensagem tipo "ok", "vlw", silencio, ou spam
     nao aciona o modelo caro.
  2. CLAUDE GERA (caro, so quando Jev manda): redige a proxima mensagem
     do SDR, usando Haiku (barato dentro da familia Claude), so quando
     precisa_resposta for alto E a confianca do Jev for boa.
  3. JEV VERIFICA (barato de novo): antes de aprovar o texto gerado,
     uma segunda chamada ao Jev, independente da primeira, pergunta se
     o texto inventou algo fora do contexto original. Se sim, tenta
     gerar de novo (ate MAX_TENTATIVAS_VERIFICACAO vezes). Se continuar
     falhando, vai pra revisao humana em vez de sair sozinho. Essa e a
     camada anti-alucinacao: nenhuma resposta sai sem passar por um
     segundo julgamento independente do que a gerou.
  4. CODIGO EXECUTA: nunca manda nada sozinho pro lead. Toda saida vai
     pra fila (auto_pronto ou revisao_humana). Enviar de fato continua
     sendo uma acao separada, sua.

Preco de referencia (input/output por milhao de tokens):
  Jev (jev-1.13):        $0.042 / $0 (output nao e cobrado)
  Claude Haiku 4.5:      $1.00  / $5.00
Ou seja: cada geracao evitada pelo filtro do passo 1 vale MUITO mais
que qualquer chamada ao Jev. E dai vem a economia real, nao so latencia.
"""

from __future__ import annotations

import csv
import os
import sys
from dataclasses import dataclass
from pathlib import Path

from anthropic import Anthropic
from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

from guardrails import Guardrails, GuardrailViolation, jev_cost
from verifier import verify

BASE_DIR = Path(__file__).resolve().parent
STATE_FILE = BASE_DIR / ".sdr_agent_state.json"

HAIKU_MODEL = "claude-haiku-4-5-20251001"
HAIKU_INPUT_COST_PER_MILLION = 1.00
HAIKU_OUTPUT_COST_PER_MILLION = 5.00


def haiku_cost(input_tokens: int, output_tokens: int) -> float:
    """Custo em USD de uma chamada ao Claude Haiku. Diferente do Jev, output custa."""
    return (
        (input_tokens / 1_000_000) * HAIKU_INPUT_COST_PER_MILLION
        + (output_tokens / 1_000_000) * HAIKU_OUTPUT_COST_PER_MILLION
    )

CONFIDENCE_THRESHOLD = 0.85
RESPOSTA_THRESHOLD = 0.5       # acima disso, Jev acha que precisa responder
LEAD_QUENTE_REVISAO = 0.8      # acima disso, forca revisao humana mesmo com boa confianca
ALUCINACAO_THRESHOLD = 0.3     # acima disso, o verificador rejeita o texto gerado
MAX_TENTATIVAS_VERIFICACAO = 2
MAX_ACTIONS = 200
MAX_SPEND_USD = 2.00

STAGES = {
    "abertura": "Primeiro contato, ainda quebrando gelo ou qualificando.",
    "apresentando_oferta": "Explicando o produto/servico e seus beneficios.",
    "tratando_objecao": "Lead levantou duvida, receio ou recusa e o SDR esta respondendo.",
    "fechamento": "Tratando de condicoes finais, prazo ou confirmacao de compra.",
    "perdido": "Lead parou de responder ou recusou de forma definitiva.",
}


@dataclass
class Decision:
    estagio: str
    estagio_confianca: float
    eficacia_score: float
    lead_quente_prob: float
    precisa_resposta_prob: float
    jev_input_tokens: int


@dataclass
class AgentResult:
    destino: str                 # "auto_pronto" | "revisao_humana" | "sem_acao"
    decisao: Decision
    resposta_sugerida: str | None
    claude_input_tokens: int
    claude_output_tokens: int
    verificacao_tentativas: int = 0
    verificacao_jev_tokens: int = 0
    motivo_revisao: str = ""


def build_jev_client() -> TypeSafeClient:
    api_key = os.environ.get("TYPESAFE_API_KEY")
    if not api_key:
        sys.exit("Defina TYPESAFE_API_KEY (console.typesafe.ai -> API Keys).")
    return TypeSafeClient(api_key=api_key, model="jev-latest")


def build_claude_client() -> Anthropic:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("Defina ANTHROPIC_API_KEY (console.anthropic.com -> API Keys).")
    return Anthropic(api_key=api_key)


def decide(jev: TypeSafeClient, contexto: str, mensagem_sdr: str, resposta_lead: str) -> Decision:
    """Camada 1: uma chamada, quatro perguntas em paralelo."""
    state = {
        "contexto_da_conversa": contexto,
        "ultima_mensagem_do_sdr": mensagem_sdr,
        "resposta_do_lead": resposta_lead,
    }

    result = jev.system_one(
        state=state,
        questions={
            "estagio": Choice(
                instructions="Em qual estagio da conversa de vendas isso esta?",
                criteria=STAGES,
            ),
            "eficacia": Score(
                instructions="O quanto a ultima mensagem do SDR avancou a conversa?",
                criteria=[
                    "Piorou ou travou a conversa",
                    "Neutra, nao mudou nada",
                    "Avancou um pouco",
                    "Avancou claramente a conversa",
                ],
            ),
            "lead_quente": Noul(
                instructions="O lead esta demonstrando sinais claros de compra agora?",
            ),
            "precisa_resposta": Noul(
                instructions=(
                    "A resposta do lead exige uma mensagem nova do SDR agora? "
                    "Responda nao (probabilidade baixa) se for so um agradecimento "
                    "sem pergunta, silencio, mensagem automatica, ou spam."
                ),
            ),
        },
    )

    a = result.answers
    return Decision(
        estagio=a["estagio"].choice,
        estagio_confianca=a["estagio"].confidence,
        eficacia_score=a["eficacia"].score,
        lead_quente_prob=a["lead_quente"].noul,
        precisa_resposta_prob=a["precisa_resposta"].noul,
        jev_input_tokens=result.usage.input_tokens,
    )


def generate_reply(claude: Anthropic, contexto: str, resposta_lead: str, estagio: str) -> tuple[str, int, int]:
    """Camada 2: so chamada quando a camada 1 mandou. Usa Haiku, nao um modelo caro."""
    system = (
        "Voce e um SDR experiente escrevendo a proxima mensagem de WhatsApp "
        "para um lead, em portugues do Brasil, informal e direto. "
        "Sem ultimato, sem tom de urgencia forcada. Poucas linhas."
    )
    user = (
        f"Estagio da conversa: {estagio}\n"
        f"Contexto: {contexto}\n"
        f"Ultima mensagem do lead: {resposta_lead}\n\n"
        "Escreva a proxima mensagem do SDR."
    )

    message = claude.messages.create(
        model=HAIKU_MODEL,
        max_tokens=300,
        system=system,
        messages=[{"role": "user", "content": user}],
    )

    texto = "".join(block.text for block in message.content if block.type == "text")
    return texto, message.usage.input_tokens, message.usage.output_tokens


def run_agent(
    jev: TypeSafeClient,
    claude: Anthropic,
    guardrails: Guardrails,
    contexto: str,
    mensagem_sdr: str,
    resposta_lead: str,
) -> AgentResult:
    guardrails.check_before_call()
    decisao = decide(jev, contexto, mensagem_sdr, resposta_lead)
    guardrails.record_call(jev_cost(decisao.jev_input_tokens))

    # Filtro que economiza token: nao gera nada se nao precisa.
    if decisao.precisa_resposta_prob < RESPOSTA_THRESHOLD:
        return AgentResult("sem_acao", decisao, None, 0, 0)

    # Confianca baixa OU lead muito quente (decisao de alto risco) -> humano decide.
    baixa_confianca = decisao.estagio_confianca < CONFIDENCE_THRESHOLD
    lead_critico = decisao.lead_quente_prob >= LEAD_QUENTE_REVISAO
    if baixa_confianca or lead_critico:
        motivo = "confianca_baixa" if baixa_confianca else "lead_critico"
        return AgentResult("revisao_humana", decisao, None, 0, 0, motivo_revisao=motivo)

    # Camada 2 + 3: gera, verifica, tenta de novo se a verificacao reprovar.
    total_claude_in = total_claude_out = 0
    total_verif_tokens = 0
    texto = ""

    for tentativa in range(1, MAX_TENTATIVAS_VERIFICACAO + 1):
        # Re-checa antes de CADA tentativa, nao so uma vez no topo da funcao:
        # um retry anterior nesta mesma troca ja pode ter estourado o limite.
        guardrails.check_before_call()

        texto, in_tok, out_tok = generate_reply(claude, contexto, resposta_lead, decisao.estagio)
        total_claude_in += in_tok
        total_claude_out += out_tok
        # Custo real da chamada ao Claude, com o preco do Claude, nao do Jev.
        # Essa linha faltava antes: os tokens do Haiku eram somados so pra
        # imprimir no final, nunca entravam no limite de gasto de verdade.
        guardrails.record_call(haiku_cost(in_tok, out_tok))

        # A geracao pode consumir o restante do orcamento. O verificador
        # tambem custa dinheiro, entao precisa de um gate proprio.
        guardrails.check_before_call()
        veredito = verify(jev, contexto, texto, threshold=ALUCINACAO_THRESHOLD)
        total_verif_tokens += veredito.input_tokens
        guardrails.record_call(jev_cost(veredito.input_tokens))

        if veredito.aprovado:
            return AgentResult(
                "auto_pronto", decisao, texto, total_claude_in, total_claude_out,
                verificacao_tentativas=tentativa, verificacao_jev_tokens=total_verif_tokens,
            )

    # Verificacao reprovou em todas as tentativas: nao sai sozinho, vai pra humano.
    return AgentResult(
        "revisao_humana", decisao, texto, total_claude_in, total_claude_out,
        verificacao_tentativas=MAX_TENTATIVAS_VERIFICACAO, verificacao_jev_tokens=total_verif_tokens,
        motivo_revisao="falhou_verificacao_anti_alucinacao",
    )


def process_csv(input_csv: Path, output_csv: Path) -> None:
    """Espera colunas: contexto, mensagem_sdr, resposta_lead."""
    jev = build_jev_client()
    claude = build_claude_client()
    guardrails = Guardrails(
        max_actions=MAX_ACTIONS,
        max_spend_usd=MAX_SPEND_USD,
        confidence_threshold=CONFIDENCE_THRESHOLD,
        state_path=STATE_FILE,
    )

    total_claude_in = total_claude_out = 0
    total_verif_tokens = 0
    contagem = {"auto_pronto": 0, "revisao_humana": 0, "sem_acao": 0}
    reprovadas_pela_verificacao = 0

    with input_csv.open(encoding="utf-8") as f_in, output_csv.open("w", newline="", encoding="utf-8") as f_out:
        reader = csv.DictReader(f_in)
        writer = csv.DictWriter(
            f_out,
            fieldnames=[
                "contexto", "mensagem_sdr", "resposta_lead",
                "destino", "motivo_revisao", "estagio", "eficacia_score", "lead_quente_prob",
                "precisa_resposta_prob", "resposta_sugerida", "verificacao_tentativas",
            ],
        )
        writer.writeheader()

        for row in reader:
            try:
                resultado = run_agent(
                    jev, claude, guardrails,
                    row["contexto"], row["mensagem_sdr"], row["resposta_lead"],
                )
            except GuardrailViolation as violation:
                print(f"Parado por guardrail: {violation}")
                break

            contagem[resultado.destino] += 1
            total_claude_in += resultado.claude_input_tokens
            total_claude_out += resultado.claude_output_tokens
            total_verif_tokens += resultado.verificacao_jev_tokens
            if resultado.motivo_revisao == "falhou_verificacao_anti_alucinacao":
                reprovadas_pela_verificacao += 1

            writer.writerow({
                **row,
                "destino": resultado.destino,
                "motivo_revisao": resultado.motivo_revisao,
                "estagio": resultado.decisao.estagio,
                "eficacia_score": round(resultado.decisao.eficacia_score, 2),
                "lead_quente_prob": round(resultado.decisao.lead_quente_prob, 2),
                "precisa_resposta_prob": round(resultado.decisao.precisa_resposta_prob, 2),
                "resposta_sugerida": resultado.resposta_sugerida or "",
                "verificacao_tentativas": resultado.verificacao_tentativas,
            })

    custo_claude = (
        (total_claude_in / 1_000_000) * HAIKU_INPUT_COST_PER_MILLION
        + (total_claude_out / 1_000_000) * HAIKU_OUTPUT_COST_PER_MILLION
    )
    total = sum(contagem.values())
    puladas = contagem["sem_acao"]

    print(f"\nProcessadas: {total}")
    print(f"  auto_pronto (resposta gerada e verificada): {contagem['auto_pronto']}")
    print(f"  revisao_humana (baixa confianca, lead critico, ou reprovada na verificacao): {contagem['revisao_humana']}")
    print(f"    das quais reprovadas pelo verificador anti-alucinacao: {reprovadas_pela_verificacao}")
    print(f"  sem_acao (geracao evitada): {puladas}")
    custo_jev = guardrails.state.spend_usd - custo_claude
    print(f"\nCusto Jev (decisao + verificacao, todas as {total} trocas): ${custo_jev:.4f}")
    print(f"Custo Claude Haiku (so as {contagem['auto_pronto']} que geraram resposta): ${custo_claude:.4f}")
    print(f"Custo total, o mesmo numero que MAX_SPEND_USD esta de fato controlando: ${guardrails.state.spend_usd:.4f}")
    if total:
        print(
            f"\nSe toda troca tivesse ido direto pro Claude sem o filtro do Jev, "
            f"voce teria pago Haiku {total} vezes em vez de {contagem['auto_pronto']}."
        )


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Uso: python sdr_agent.py entrada.csv saida.csv")
    process_csv(Path(sys.argv[1]), Path(sys.argv[2]))
