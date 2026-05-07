from pathlib import Path
import re

base = Path(__file__).resolve().parent.parent / "public" / "resources"
base.mkdir(parents=True, exist_ok=True)

contents = {
    "guia-rapida-para-estudios-biblicos-personales.pdf": (
        "Guía rápida para estudios bíblicos personales\n\n"
        "Esta guía incluye pasos claros para estudiar la Biblia con mayor propósito y estructura.\n\n"
        "1. Ora antes de leer.\n"
        "2. Selecciona un pasaje breve.\n"
        "3. Escribe una idea central.\n"
        "4. Aplica en un paso práctico.\n\n"
        "Que Dios te guíe en tu estudio."
    ),
    "plantilla-seguimiento-espiritual.pdf": (
        "Plantilla de seguimiento espiritual\n\n"
        "Usa esta hoja para anotar: fecha, versículo, punto clave, oración y próximo paso.\n\n"
        "Puedes completarla luego de cada estudio para reforzar tu crecimiento espiritual.\n\n"
        "Dios te fortalece en el camino."
    ),
    "ebook-fundamentos-de-la-fe.pdf": (
        "Ebook: Fundamentos de la fe\n\n"
        "Este ebook presenta conceptos básicos de la fe cristiana de forma accesible.\n\n"
        "Incluye temas como: quien es Dios, la importancia de la Biblia, propósito humano y amor divino.\n\n"
        "Lee con atención y comparte con alguien que esté empezando.\n"
    ),
}


def escape_pdf(text: str) -> str:
    return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

for filename, text in contents.items():
    output_path = base / filename
    lines = text.split("\n")
    escaped_content = " ".join(line for line in lines if line)
    escaped_content = escape_pdf(escaped_content)

    content_stream = f"BT /F1 12 Tf 50 760 Td ({escaped_content}) Tj ET"

    header = b"%PDF-1.4\n%\xC3\xA2\xC3\xA4\xC3\xA6\n"
    objects = [
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
        b"2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n",
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
        f"4 0 obj\n<< /Length {len(content_stream)} >>\nstream\n{content_stream}\nendstream\nendobj\n".encode("latin1"),
        b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    ]

    body = b""
    offsets = [0]
    offset = len(header)
    for obj in objects:
        offsets.append(offset)
        body += obj
        offset += len(obj)

    xref_start = len(header) + len(body)
    xref = b"xref\n0 6\n0000000000 65535 f \n"
    for off in offsets[1:]:
        xref += f"{off:010d} 00000 n \n".encode("latin1")

    trailer = b"trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + str(xref_start).encode("latin1") + b"\n%%EOF\n"
    pdf = header + body + xref + trailer
    output_path.write_bytes(pdf)
    print(f"Created {output_path}")
