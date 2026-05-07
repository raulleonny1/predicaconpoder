from pathlib import Path
from fpdf import FPDF

base = Path(__file__).resolve().parent.parent / "public" / "resources"
base.mkdir(parents=True, exist_ok=True)

resources = [
    {
        "filename": "guia-rapida-para-estudios-biblicos-personales.pdf",
        "title": "Guía rápida para estudios bíblicos personales",
        "content": (
            "Esta guía incluye pasos claros para estudiar la Biblia con mayor propósito y estructura.\n\n"
            "1. Ora antes de leer.\n"
            "2. Selecciona un pasaje breve.\n"
            "3. Escribe una idea central.\n"
            "4. Aplica en un paso práctico.\n\n"
            "Que Dios te guíe en tu estudio."
        ),
    },
    {
        "filename": "plantilla-seguimiento-espiritual.pdf",
        "title": "Plantilla de seguimiento espiritual",
        "content": (
            "Usa esta hoja para anotar: fecha, versículo, punto clave, oración y próximo paso.\n\n"
            "Puedes completarla luego de cada estudio para reforzar tu crecimiento espiritual.\n\n"
            "Dios te fortalece en el camino."
        ),
    },
    {
        "filename": "ebook-fundamentos-de-la-fe.pdf",
        "title": "Ebook: Fundamentos de la fe",
        "content": (
            "Este ebook presenta conceptos básicos de la fe cristiana de forma accesible.\n\n"
            "Incluye temas como: quien es Dios, la importancia de la Biblia, propósito humano y amor divino.\n\n"
            "Lee con atención y comparte con alguien que esté empezando."
        ),
    },
]

for item in resources:
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, item["title"], ln=True)
    pdf.ln(5)
    pdf.set_font("Arial", size=12)
    for line in item["content"].split("\n"):
        pdf.multi_cell(0, 8, line)
    output_path = base / item["filename"]
    pdf.output(str(output_path))
    print(f"Created {output_path}")
