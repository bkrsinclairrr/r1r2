"""Fotos de teste do Painel do Closer, numa pasta temporária (nunca no deck nem no painel).
Fontes: só as fotos que já estão no deck (joaozinho-02.jpg e kaio-01.jpg) e imagens sintéticas.
Uso: python -I gera-fotos-teste.py <pasta-do-deck> <pasta-de-saida>
Saída: retrato-a.jpg e avatar-a.jpg (960 x 1280 e 400 x 400, do kaio-01), retrato-b.jpg e avatar-b.jpg (do joaozinho-02),
escura.jpg, clara.jpg e contraluz.jpg (variações pra comparar o tom navy com a cor), png-disfarcado.jpg, grande-5000.jpg,
pesada-8mb.jpg, corrompida.jpg, html.jpg, exif-gps.jpg (com EXIF e GPS, 960 x 1280), retrato-pesado.jpg (960 x 1280 com
mais de 600 KB), retrato-torto.jpg (961 x 1280), quadrada.png (1200 x 1200)."""
import io, os, random, sys
from PIL import Image, ImageEnhance, ImageDraw, ImageFilter

deck, saida = sys.argv[1], sys.argv[2]
os.makedirs(saida, exist_ok=True)
S = lambda n: os.path.join(saida, n)

def recorta(img, prop):  # recorte central na proporção (largura/altura), puxado pra cima (o rosto)
    w, h = img.size
    if w / h > prop:
        nw = int(h * prop); x = (w - nw) // 2
        return img.crop((x, 0, x + nw, h))
    nh = int(w / prop); y = max(0, int((h - nh) * 0.25))
    return img.crop((0, y, w, y + nh))

def jpeg(img, nome, q=86):
    img.convert('RGB').save(S(nome), 'JPEG', quality=q)  # PIL sem exif= não grava EXIF

# (a caixa do joaozinho-02 pega o menino, embaixo à esquerda; no kaio-01 o recorte central já pega o atleta)
for letra, arq, caixa in (('a', 'kaio-01.jpg', None), ('b', 'joaozinho-02.jpg', (45, 380, 525, 1020))):
    img = Image.open(os.path.join(deck, 'assets', arq)).convert('RGB')
    ret = (img.crop(caixa) if caixa else recorta(img, 3 / 4)).resize((960, 1280), Image.LANCZOS)
    jpeg(ret, 'retrato-' + letra + '.jpg')
    w, h = ret.size
    q = int(w * 0.62)
    av = ret.crop(((w - q) // 2, int(h * 0.12), (w - q) // 2 + q, int(h * 0.12) + q)).resize((400, 400), Image.LANCZOS)
    jpeg(av, 'avatar-' + letra + '.jpg')
    if letra == 'a':
        ret.save(S('fonte-a.png'))  # a fonte "do celular" pro teste do recorte no navegador

base = Image.open(S('retrato-a.jpg'))
jpeg(ImageEnhance.Brightness(base).enhance(0.45), 'escura.jpg')
jpeg(ImageEnhance.Brightness(base).enhance(1.6), 'clara.jpg')
# contraluz: o fundo estourado de luz e o rosto escuro
luz = Image.new('L', base.size, 0)
d = ImageDraw.Draw(luz)
d.ellipse((-200, -300, 1160, 700), fill=255)
luz = luz.filter(ImageFilter.GaussianBlur(120))
claro = ImageEnhance.Brightness(base).enhance(2.2)
jpeg(Image.composite(claro, ImageEnhance.Brightness(base).enhance(0.55), luz), 'contraluz.jpg')

# PNG com nome de .jpg
Image.new('RGB', (960, 1280), (30, 60, 90)).save(S('png-disfarcado.jpg'), 'PNG')
# 5000 x 5000
g = Image.new('RGB', (5000, 5000), (20, 30, 40))
dg = ImageDraw.Draw(g)
for i in range(0, 5000, 250):
    dg.rectangle((i, i, i + 200, i + 200), fill=(200, 184, 138))
jpeg(g, 'grande-5000.jpg', 90)
# uns 8 MB: ruído em qualidade alta
random.seed(7)
ruido = Image.frombytes('RGB', (2600, 2600), bytes(random.getrandbits(8) for _ in range(2600 * 2600 * 3)))
ruido.save(S('pesada-8mb.jpg'), 'JPEG', quality=97)
# corrompida: um JPEG bom cortado no meio
with open(S('retrato-a.jpg'), 'rb') as f:
    b = f.read()
with open(S('corrompida.jpg'), 'wb') as f:
    f.write(b[: len(b) // 2])
# HTML com nome de .jpg
with open(S('html.jpg'), 'w', encoding='utf-8') as f:
    f.write('<!doctype html><html><body><script>alert(1)</script></body></html>')
# EXIF com GPS (960 x 1280): o recorte do navegador tem que tirar; o servidor recusa se chegar com EXIF
exif = Image.Exif()
exif[0x010F] = 'CameraTeste'
gps = {1: 'S', 2: (5.0, 47.0, 0.0), 3: 'W', 4: (35.0, 12.0, 0.0)}
exif[0x8825] = gps
base.save(S('exif-gps.jpg'), 'JPEG', quality=86, exif=exif.tobytes())
# 960 x 1280 com mais de 600 KB
ruido.crop((0, 0, 960, 1280)).save(S('retrato-pesado.jpg'), 'JPEG', quality=100)
# dimensão errada por 1 pixel
jpeg(base.resize((961, 1280)), 'retrato-torto.jpg')
# quadrada em PNG (o navegador recorta em 3:4)
Image.open(S('retrato-b.jpg')).resize((1200, 1200)).save(S('quadrada.png'), 'PNG')
for n in sorted(os.listdir(saida)):
    print(n, os.path.getsize(S(n)))
