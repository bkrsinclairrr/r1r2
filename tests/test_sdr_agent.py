from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

from guardrails import GuardrailViolation, Guardrails, jev_cost
from sdr_agent import haiku_cost, run_agent


class FakeJev:
    def __init__(
        self,
        *,
        confidence: float = 0.95,
        lead_quente: float = 0.2,
        precisa_resposta: float = 0.9,
        verificacoes: tuple[float, ...] = (0.1,),
    ) -> None:
        self.calls = 0
        self.confidence = confidence
        self.lead_quente = lead_quente
        self.precisa_resposta = precisa_resposta
        self.verificacoes = verificacoes

    def system_one(self, *, state: dict, questions: dict) -> SimpleNamespace:
        self.calls += 1
        if self.calls == 1:
            return SimpleNamespace(
                answers={
                    "estagio": SimpleNamespace(
                        choice="abertura",
                        confidence=self.confidence,
                    ),
                    "eficacia": SimpleNamespace(score=2.0),
                    "lead_quente": SimpleNamespace(noul=self.lead_quente),
                    "precisa_resposta": SimpleNamespace(noul=self.precisa_resposta),
                },
                usage=SimpleNamespace(input_tokens=1_000),
            )

        indice = min(self.calls - 2, len(self.verificacoes) - 1)
        return SimpleNamespace(
            answers={"alucinou": SimpleNamespace(noul=self.verificacoes[indice])},
            usage=SimpleNamespace(input_tokens=500),
        )


class FakeClaudeMessages:
    def __init__(self) -> None:
        self.calls = 0

    def create(self, **kwargs: object) -> SimpleNamespace:
        self.calls += 1
        return SimpleNamespace(
            content=[SimpleNamespace(type="text", text="Resposta segura")],
            usage=SimpleNamespace(input_tokens=100, output_tokens=100),
        )


class FakeClaude:
    def __init__(self) -> None:
        self.messages = FakeClaudeMessages()


class RunAgentGuardrailTests(unittest.TestCase):
    def make_guardrails(self, temp_dir: str, *, limite: float = 1.0) -> Guardrails:
        return Guardrails(
            max_actions=10,
            max_spend_usd=limite,
            confidence_threshold=0.85,
            state_path=Path(temp_dir) / "state.json",
        )

    def test_bloqueia_verificador_quando_claude_esgota_orcamento(self) -> None:
        """Remover o check entre Claude e Jev deve permitir uma chamada paga indevida."""
        with tempfile.TemporaryDirectory() as temp_dir:
            limite = jev_cost(1_000) + haiku_cost(100, 100)
            guardrails = self.make_guardrails(temp_dir, limite=limite)
            jev = FakeJev()

            with self.assertRaises(GuardrailViolation):
                run_agent(
                    jev,
                    FakeClaude(),
                    guardrails,
                    "Contexto confirmado",
                    "Mensagem anterior",
                    "Quero saber mais",
                )

            self.assertEqual(jev.calls, 1)
            self.assertEqual(guardrails.state.actions_taken, 2)

    def test_nao_gera_resposta_quando_jev_indica_sem_acao(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            jev = FakeJev(precisa_resposta=0.1)
            claude = FakeClaude()

            resultado = run_agent(
                jev,
                claude,
                self.make_guardrails(temp_dir),
                "Contexto",
                "Mensagem anterior",
                "Ok",
            )

            self.assertEqual(resultado.destino, "sem_acao")
            self.assertIsNone(resultado.resposta_sugerida)
            self.assertEqual(jev.calls, 1)
            self.assertEqual(claude.messages.calls, 0)

    def test_confianca_baixa_encaminha_para_revisao_sem_gerar(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            jev = FakeJev(confidence=0.4)
            claude = FakeClaude()

            resultado = run_agent(
                jev,
                claude,
                self.make_guardrails(temp_dir),
                "Contexto",
                "Mensagem anterior",
                "Tenho interesse",
            )

            self.assertEqual(resultado.destino, "revisao_humana")
            self.assertEqual(resultado.motivo_revisao, "confianca_baixa")
            self.assertEqual(jev.calls, 1)
            self.assertEqual(claude.messages.calls, 0)

    def test_duas_reprovacoes_do_verificador_escalam_para_humano(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            jev = FakeJev(verificacoes=(0.9, 0.8))
            claude = FakeClaude()
            guardrails = self.make_guardrails(temp_dir)

            resultado = run_agent(
                jev,
                claude,
                guardrails,
                "Contexto",
                "Mensagem anterior",
                "Quero saber mais",
            )

            self.assertEqual(resultado.destino, "revisao_humana")
            self.assertEqual(
                resultado.motivo_revisao,
                "falhou_verificacao_anti_alucinacao",
            )
            self.assertEqual(resultado.verificacao_tentativas, 2)
            self.assertEqual(jev.calls, 3)
            self.assertEqual(claude.messages.calls, 2)
            self.assertEqual(guardrails.state.actions_taken, 5)


if __name__ == "__main__":
    unittest.main()
