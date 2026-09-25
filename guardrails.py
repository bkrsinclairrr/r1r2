"""
chief.py - roteador de decisao usando Jev (TypeSafe AI).

Fluxo: voce descreve o estado da tarefa (o que e o objetivo, o que ja
foi feito). O Jev responde, em paralelo, numa unica chamada:
  - next_worker (Choice): quem deve agir agora
  - urgency     (Score):  quao urgente e o item
  - needs_review (Noul):  se um humano deveria olhar antes de seguir

O resultado e salvo como um arquivo JSON dentro de queue/<destino>/.
Isso NAO publica nada e NAO executa nenhuma acao sozinho. E so o
roteamento. Quem consome a fila (humano ou outro script) decide o que
fazer com cada job.

Rode: python chief.py
Requer: variavel de ambiente TYPESAFE_API_KEY (pegue em console.typesafe.ai)
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from uuid import uuid4

from typesafe_sdk import Choice, Noul, Score, TypeSafeAPIError, TypeSafeClient

from guardrails import Guardrails, GuardrailViolation, jev_cost

BASE_DIR = Path(__file__).resolve().parent
QUEUE_DIR = BASE_DIR / "queue"
STATE_FILE = BASE_DIR / ".run_state.json"

# Ajuste estes tres numeros ao seu caso antes de rodar em producao.
MAX_ACTIONS = 50
MAX_SPEND_USD = 1.00
CONFIDENCE_THRESHOLD = 0.85


def build_client() -> TypeSafeClient:
    api_key = os.environ.get("TYPESAFE_API_KEY")
    if not api_key:
        sys.exit(
            "TYPESAFE_API_KEY nao encontrada.\n"
            "Rode: export TYPESAFE_API_KEY='sua-chave-aqui'\n"
            "(pegue a chave em console.typesafe.ai -> API Keys)"
        )
    # model="jev-latest" e o default do SDK. Para producao, prefira fixar
    # uma versao (ex: "jev-1.13.0") para o comportamento nao mudar sob voce.
    return TypeSafeClient(api_key=api_key, model="jev-latest")


def available_workers() -> dict[str, str]:
    """
    Menu dinamico (passo 06 do guia): construa esta lista a partir dos
    workers que existem DE VERDADE no seu sistema agora, nao uma lista
    fixa no codigo. Aqui esta fixa so pra exemplo.
    """
    return {
        "research": "Falta evidencia/dados para o objetivo.",
        "write": "Ha evidencia suficiente para redigir o entregavel.",
        "review": "Objetivo pouco claro, fora de escopo, ou trabalho concluido.",
    }


def ask_jev(client: TypeSafeClient, goal: str, completed_work: str) -> tuple[dict, int]:
    state = {"goal": goal, "completed_work": completed_work}

    try:
        result = client.system_one(
            state=state,
            questions={
                "next_worker": Choice(
                    instructions="Escolha o proximo passo para este objetivo.",
                    criteria=available_workers(),
                ),
                "urgency": Score(
                    instructions="Qual a urgencia deste item?",
                    criteria=["Baixa", "Media", "Alta", "Critica"],
                ),
                "needs_review": Noul(
                    instructions="Um humano deveria revisar isso antes de prosseguir?",
                ),
            },
        )
    except TypeSafeAPIError as error:
        sys.exit(f"Erro da API TypeSafe (status {error.status}): {error}")

    next_worker = result.answers["next_worker"]
    urgency = result.answers["urgency"]
    needs_review = result.answers["needs_review"]

    payload = {
        "goal": goal,
        "completed_work": completed_work,
        "next_worker": {
            "choice": next_worker.choice,
            "confidence": next_worker.confidence,
            "probabilities": next_worker.probabilities,
        },
        "urgency_score": urgency.score,
        "needs_human_review": needs_review.noul >= 0.5,
        "model": result.model,
    }
    return payload, result.usage.input_tokens


def save_handoff(payload: dict, destination: str) -> Path:
    folder = QUEUE_DIR / destination
    folder.mkdir(parents=True, exist_ok=True)
    job_path = folder / f"{uuid4().hex}.json"
    job_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return job_path


def main() -> None:
    client = build_client()
    guardrails = Guardrails(
        max_actions=MAX_ACTIONS,
        max_spend_usd=MAX_SPEND_USD,
        confidence_threshold=CONFIDENCE_THRESHOLD,
        state_path=STATE_FILE,
    )

    goal = input("Objetivo: ").strip()
    if not goal:
        sys.exit("Digite um objetivo.")
    completed_work = input("Trabalho ja feito: ").strip() or "Nada ainda."

    try:
        guardrails.check_before_call()
    except GuardrailViolation as violation:
        sys.exit(f"Guardrail bloqueou a execucao: {violation}")

    payload, input_tokens = ask_jev(client, goal, completed_work)
    guardrails.record_call(jev_cost(input_tokens))

    # Confianca baixa OU sinal explicito de revisao -> forca para 'review',
    # independente do que o Choice escolheu.
    destination = guardrails.route_with_confidence_gate(
        choice=payload["next_worker"]["choice"],
        confidence=payload["next_worker"]["confidence"],
        fallback="review",
    )
    if payload["needs_human_review"]:
        destination = "review"

    job_path = save_handoff(payload, destination)

    print(f"\nDestino: {destination}")
    print(f"Confianca: {payload['next_worker']['confidence']:.2f}")
    print(f"Urgencia (0-3): {payload['urgency_score']:.2f}")
    print(f"Handoff salvo em: {job_path}")
    print(
        f"Custo acumulado nesta sessao: ${guardrails.state.spend_usd:.4f} "
        f"({guardrails.state.actions_taken}/{MAX_ACTIONS} acoes)"
    )


if __name__ == "__main__":
    main()
