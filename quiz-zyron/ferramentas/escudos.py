"""Copia os escudos da casa (deck R2 novo) pro quiz, em 96 x 96 (o dobro do maior tamanho na tela), WebP qualidade 82.

Uso (na pasta quiz-zyron):
  uv run --python 3.12 --no-project --with pillow python -I ferramentas/escudos.py
"""
import os
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
ORIGEM = os.path.join(AQUI, '..', '..', 'apresentacoes', 'jogador-de-elite-r2-novo', 'assets', 'bloco', 'clubes')
DESTINO = os.path.join(AQUI, '..', 'assets', 'clubes')
# T07 (clubes que escolhem com dados, cada um com fonte) e T06 (clubes da nossa rede)
ESCUDOS = ['brighton', 'bologna', 'midtjylland', 'internacional', 'corinthians', 'sport', 'palmeiras',
           'braga', 'betis', 'feyenoord', 'anderlecht', 'fiorentina', 'lens', 'salzburg', 'gremio', 'athletico', 'fluminense']

os.makedirs(DESTINO, exist_ok=True)
for nome in ESCUDOS:
    img = Image.open(os.path.join(ORIGEM, nome + '.webp')).convert('RGBA')
    img.thumbnail((96, 96), Image.LANCZOS)
    tela = Image.new('RGBA', (96, 96), (0, 0, 0, 0))
    tela.paste(img, ((96 - img.width) // 2, (96 - img.height) // 2), img)
    saida = os.path.join(DESTINO, nome + '.webp')
    tela.save(saida, 'WEBP', quality=82, method=6)
    print(nome, os.path.getsize(saida))
