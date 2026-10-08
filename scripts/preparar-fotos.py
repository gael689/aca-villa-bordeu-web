"""Prepara las fotos del sitio: las copia a public/fotos en tamaño web y genera
lib/fotos.json con las dimensiones reales y un placeholder borroso por foto.

Uso (desde la raíz del repo):  python scripts/preparar-fotos.py
Fuentes: ../fotos-seleccion (las del dueño) y ../relevamiento/imagenes-sitio (sitio viejo, baja resolución).
"""
import base64, io, json, pathlib
from PIL import Image, ImageOps

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CLIENTE = RAIZ.parent
SALIDA = RAIZ / "public" / "fotos"
MAX = 2400

# Del sitio viejo solo se usan las que muestran el predio (no hay otras).
VIEJAS = {
    "predio/aerea-dia.jpg": "home-5-vista-aerea-diurna-complejo.jpg",
    "predio/aerea-noche.jpg": "home-1-vista-aerea-nocturna-complejo.jpg",
    "predio/cocheras-noche.jpg": "home-4-galeria-cocheras-nocturna.jpg",
    "predio/fachada.jpg": "home-2-fachada-edificio-restaurante.jpg",
    "predio/resto-vista-parque.jpg": "hab-5-restaurante-mesa-vista-parque.jpg",
}

def fuentes():
    for p in sorted((CLIENTE / "fotos-seleccion").rglob("*.jpg")):
        yield p.relative_to(CLIENTE / "fotos-seleccion").as_posix(), p
    for dest, orig in VIEJAS.items():
        yield dest, CLIENTE / "relevamiento" / "imagenes-sitio" / orig

dims, blur = {}, {}
for clave, origen in fuentes():
    im = ImageOps.exif_transpose(Image.open(origen)).convert("RGB")
    im.thumbnail((MAX, MAX), Image.LANCZOS)
    destino = SALIDA / clave
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, quality=88 if clave.startswith("portada/") else 84, optimize=True, progressive=True)
    dims[clave] = list(im.size)
    chica = im.copy()
    chica.thumbnail((16, 16))
    buf = io.BytesIO()
    chica.save(buf, "JPEG", quality=60)
    blur[clave] = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()
    print(clave, im.size)

(RAIZ / "lib").mkdir(exist_ok=True)
(RAIZ / "lib" / "fotos.json").write_text(json.dumps({"dims": dims, "blur": blur}, indent=1), encoding="utf-8")
