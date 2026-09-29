"""
verifier.py - camada de verificacao/anti-alucinacao.

Antes de um texto gerado pelo Claude (em sdr_agent.py) ser aprovado pra
sair sozinho, uma segunda chamada ao Jev, independente da que gerou a
decisao original, pergunta se aquele texto inventou algo fora do
contexto da conversa. Nao usa um segundo LLM caro pra revisar o
primeiro: e a mesma logica de "Jev decide, nunca gera" aplicada a
verificacao (ver AGENTS.md, secao "Decisoes ja tomadas").
"""

from __future__ import annotations

from dataclasses import dataclass

from typesafe_sdk import Noul, TypeSafeClient


@dataclass
class Veredito:
    aprovado: bool
    alucinacao_prob: float
    input_tokens: int


def verify(jev: TypeSafeClient, contexto: str, texto_gerado: str, *, threshold: float) -> Veredito:
    """
    Pergunta ao Jev se `texto_gerado` afirma, promete ou inventa algo
    que nao esta presente em `contexto`. Reprova (aprovado=False)
    quando a probabilidade de alucinacao for maior ou igual a
    `threshold` (ver ALUCINACAO_THRESHOLD em sdr_agent.py).
    """
    state = {
        "contexto_original": contexto,
        "texto_gerado": texto_gerado,
    }

    result = jev.system_one(
        state=state,
        questions={
            "alucinou": Noul(
                instructions=(
                    "O texto gerado afirma, promete ou inventa algo que nao "
                    "esta presente no contexto original? Responda sim "
                    "(probabilidade alta) se o texto trouxer fato, numero, "
                    "prazo ou promessa que nao aparece no contexto."
                ),
            ),
        },
    )

    alucinacao_prob = result.answers["alucinou"].noul
    return Veredito(
        aprovado=alucinacao_prob < threshold,
        alucinacao_prob=alucinacao_prob,
        input_tokens=result.usage.input_tokens,
    )
