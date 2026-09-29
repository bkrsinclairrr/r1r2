"""
Guardrails para o loop de decisao com Jev (TypeSafe AI) + geracao com Claude.

Isso NAO existe na API da TypeSafe nem da Anthropic. E logica sua, que
fica no seu codigo, controlando ate onde o agente pode ir sozinho antes
de precisar de aprovacao humana ou de parar.

IMPORTANTE: este modulo NAO sabe o preco de nenhuma API especifica.
Ele so acumula dolar. Quem chama `record_call()` calcula o custo real
da chamada que acabou de fazer (Jev, Claude, ou qualquer outra) usando
a tabela de preco certa, e passa o valor em USD. Isso existe porque a
versao anterior deste arquivo assumia que todo `input_tokens` que
passava por aqui era preco do Jev, e uma chamada ao Claude Haiku
(25 a 120x mais cara por token, dependendo se e input ou output)
passava batida, sem contar pro limite de gasto. Nao repita esse erro:
NUNCA chame `record_call()` sem calcular o custo com o preco certo do
provider que voce acabou de chamar.

Use `jev_cost(input_tokens)` pra chamadas ao Jev (output do Jev e
gratis, entao so input entra na conta). Pra Claude ou outro provider,
calcule voce mesmo no seu modulo, com o preco daquele modelo especifico
(varia por modelo e muda com o tempo, confira docs.claude.com antes de
hardcodar um numero por muito tempo).
"""

from __future__ import annotations

import json
import time
from dataclasses import dataclass, field
from pathlib import Path

JEV_INPUT_COST_PER_MILLION = 0.042


def jev_cost(input_tokens: int) -> float:
    """Custo em USD de uma chamada ao Jev. Output do Jev e gratis."""
    return (input_tokens / 1_000_000) * JEV_INPUT_COST_PER_MILLION


@dataclass
class RunState:
    """Estado persistido entre execucoes, para sobreviver a uma interrupcao."""

    actions_taken: int = 0
    spend_usd: float = 0.0
    started_at: float = field(default_factory=time.time)

    def save(self, path: Path) -> None:
        path.write_text(json.dumps(self.__dict__, indent=2), encoding="utf-8")

    @classmethod
    def load(cls, path: Path) -> "RunState":
        if path.exists():
            return cls(**json.loads(path.read_text(encoding="utf-8")))
        return cls()


class GuardrailViolation(Exception):
    """Levantada quando um limite de guardrail e ultrapassado."""


class Guardrails:
    def __init__(
        self,
        *,
        max_actions: int,
        max_spend_usd: float,
        confidence_threshold: float,
        state_path: Path,
    ) -> None:
        self.max_actions = max_actions
        self.max_spend_usd = max_spend_usd
        self.confidence_threshold = confidence_threshold
        self.state_path = state_path
        self.state = RunState.load(state_path)

    def check_before_call(self) -> None:
        """
        Chame isso ANTES de qualquer chamada que custe dinheiro (Jev,
        Claude, ou outra). Chame de novo entre chamadas dentro de um
        mesmo loop se houver retry, um "check" so no inicio do loop
        nao pega estouro de limite no meio de varias tentativas.
        """
        if self.state.actions_taken >= self.max_actions:
            raise GuardrailViolation(
                f"Limite de {self.max_actions} acoes atingido. "
                "Revise manualmente antes de continuar."
            )
        if self.state.spend_usd >= self.max_spend_usd:
            raise GuardrailViolation(
                f"Limite de gasto (${self.max_spend_usd:.2f}) atingido. "
                f"Gasto atual: ${self.state.spend_usd:.4f}."
            )

    def record_call(self, cost_usd: float) -> None:
        """
        Chame isso DEPOIS de cada chamada, com o custo real em USD
        daquela chamada especifica (nao tokens brutos, o CUSTO, ja
        calculado com o preco certo do provider que voce chamou).
        """
        self.state.actions_taken += 1
        self.state.spend_usd += cost_usd
        self.state.save(self.state_path)

    def passes_confidence(self, confidence: float) -> bool:
        """Confianca abaixo do limiar = nao e uma decisao automatica confiavel."""
        return confidence >= self.confidence_threshold

    def route_with_confidence_gate(self, choice: str, confidence: float, fallback: str) -> str:
        """
        Regra pratica: se a confianca do Jev vier abaixo do limiar,
        force a decisao para uma rota de revisao humana, mesmo que o
        'choice' escolhido pareca razoavel. Confianca nao e igual a
        probabilidade de acerto individual, e sim uma medida calibrada
        em grupo, entao trate o limiar como ponto de partida e ajuste
        com casos reais rotulados do seu proprio fluxo.
        """
        if not self.passes_confidence(confidence):
            return fallback
        return choice
