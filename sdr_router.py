"""
sdr_router.py - classificador em lote (CSV -> CSV) sobre historico de
conversas de SDR.

So classifica, nao gera nada, nao decide nenhuma acao: pra cada troca
(contexto, mensagem do SDR, resposta do lead), Jev classifica o estagio
da conversa, a eficacia da mensagem do SDR, e se o lead esta quente.
Pensado pra rodar em lote sobre o historico de WhatsApp/Instagram que
voce ja tem, pra achar padrao do que funciona antes de automatizar
qualquer resposta (isso quem faz e o sdr_agent.py, arquivo seguinte).
"""

from __future__ import annotations

import csv
import os
import sys
from pathlib import Path

from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

from guardrails import Guardrails, GuardrailViolation, jev_cost

BASE_DIR = Path(__file__).resolve().parent
STATE_FILE = BASE_DIR / ".sdr_router_state.json"

MAX_ACTIONS = 500
MAX_SPEND_USD = 1.00
CONFIDENCE_THRESHOLD = 0.85

STAGES = {
    "abertura": "Primeiro contato, ainda quebrando gelo ou qualificando.",
    "apresentando_oferta": "Explicando o produto/servico e seus beneficios.",
    "tratando_objecao": "Lead levantou duvida, receio ou recusa e o SDR esta respondendo.",
    "fechamento": "Tratando de condicoes finais, prazo ou confirmacao de compra.",
    "perdido": "Lead parou de responder ou recusou de forma definitiva.",
}


def build_client() -> TypeSafeClient:
    api_key = os.environ.get("TYPESAFE_API_KEY")
    if not api_key:
        sys.exit("Defina TYPESAFE_API_KEY (console.typesafe.ai -> API Keys).")
    return TypeSafeClient(api_key=api_key, model="jev-latest")


def classify(jev: TypeSafeClient, contexto: str, mensagem_sdr: str, resposta_lead: str) -> dict:
    """Uma chamada, tres perguntas em paralelo. So classifica, nao decide acao."""
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
        },
    )

    a = result.answers
    return {
        "estagio": a["estagio"].choice,
        "estagio_confianca": a["estagio"].confidence,
        "eficacia_score": a["eficacia"].score,
        "lead_quente_prob": a["lead_quente"].noul,
        "input_tokens": result.usage.input_tokens,
    }


def process_csv(input_csv: Path, output_csv: Path) -> None:
    """Espera colunas: contexto, mensagem_sdr, resposta_lead."""
    jev = build_client()
    guardrails = Guardrails(
        max_actions=MAX_ACTIONS,
        max_spend_usd=MAX_SPEND_USD,
        confidence_threshold=CONFIDENCE_THRESHOLD,
        state_path=STATE_FILE,
    )

    total = 0
    with input_csv.open(encoding="utf-8") as f_in, output_csv.open("w", newline="", encoding="utf-8") as f_out:
        reader = csv.DictReader(f_in)
        writer = csv.DictWriter(
            f_out,
            fieldnames=[
                "contexto", "mensagem_sdr", "resposta_lead",
                "estagio", "estagio_confianca", "eficacia_score", "lead_quente_prob",
            ],
        )
        writer.writeheader()

        for row in reader:
            try:
                guardrails.check_before_call()
            except GuardrailViolation as violation:
                print(f"Parado por guardrail: {violation}")
                break

            resultado = classify(jev, row["contexto"], row["mensagem_sdr"], row["resposta_lead"])
            guardrails.record_call(jev_cost(resultado["input_tokens"]))
            total += 1

            writer.writerow({
                **row,
                "estagio": resultado["estagio"],
                "estagio_confianca": round(resultado["estagio_confianca"], 2),
                "eficacia_score": round(resultado["eficacia_score"], 2),
                "lead_quente_prob": round(resultado["lead_quente_prob"], 2),
            })

    print(f"\nClassificadas {total} trocas.")
    print(f"Custo Jev total: ${guardrails.state.spend_usd:.4f} ({guardrails.state.actions_taken} chamadas)")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Uso: python sdr_router.py entrada.csv saida.csv")
    process_csv(Path(sys.argv[1]), Path(sys.argv[2]))
