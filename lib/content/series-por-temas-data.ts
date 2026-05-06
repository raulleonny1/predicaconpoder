import type { LeccionSerie, SerieBiblica } from "@/lib/content/series-por-temas-types";

export const SERIES_BIBLICAS: SerieBiblica[] = [
  {
    slug: "fundamentos-de-la-fe",
    order: 1,
    emoji: "📖",
    title: "Serie 1: Fundamentos de la fe",
    subtitle: "Para iniciar con cualquier persona",
    description:
      "Seis encuentros para sentar bases claras: quién es Dios, relación personal con Él, confianza en la Biblia, lectura sencilla, propósito humano y el hilo conductor del amor de Dios.",
    notaParaElMaestro:
      "Puedes dar esta serie en orden. Cada lección dura entre 35 y 50 minutos según conversación y oración. Adapta textos a tu traducción preferida.",
    lecciones: [
      {
        slug: "quien-es-dios-realmente",
        order: 1,
        title: "¿Quién es Dios realmente?",
        body: `
### Objetivo

Ayudar a la persona a **conocer el carácter básico de Dios** según la Biblia: eterno, creador, santo, justo y amoroso — sin mezclar aún todas las doctrinas avanzadas.

### Textos sugeridos

- **Salmo 90:2** — de la eternidad de Dios.
- **Isaías 40:28** — poder, sabiduría, comprensión.
- **1 Juan 4:8** — Dios es amor.

### Preguntas para dialogar

1. Cuando piensa en “Dios”, ¿qué imagen o sentimiento aparece primero?
2. Según estos pasajes, ¿qué tres palabras describirían a Dios?
3. ¿Qué diferencia hay entre “creer que Dios existe” y **confiar** en Él?

### Aplicación

Invita a una oración breve de gratitud por lo que Dios es, aunque aún queden dudas.

### Para el siguiente encuentro

Anuncia que hablarán de **cómo acercarse a Dios personalmente**, no solo como idea abstracta.
        `.trim(),
      },
      {
        slug: "como-conocer-a-dios-personalmente",
        order: 2,
        title: "¿Cómo conocer a Dios personalmente?",
        body: `
### Objetivo

Mostrar que Dios **quiere relación**, no solo cumplimiento externo; introducir el camino de acercamiento mediante arrepentimiento, fe y oración.

### Textos sugeridos

- **Jeremías 29:13** — buscar con todo el corazón.
- **Juan 17:3** — vida eterna es conocer al Padre y a Jesús.
- **Santiago 4:8** — acercaos a Dios y Él se acercará a vosotros.

### Preguntas

1. ¿Qué cree usted que significa “conocer” a alguien en la vida diaria?
2. ¿Qué barreras siente entre usted y Dios hoy (culpa, dudas, tiempo, dolor)?
3. ¿Qué paso concreto podría dar esta semana para **acercarse** (oración, lectura, pedir ayuda)?

### Clave pastoral

No presiones una “experiencia emocional”. Valida honestidad; ofrece esperanza en Cristo como puente (se profundizará en series posteriores).

### Cierre

Ora por sabiduría para la persona y por un encuentro genuino con la verdad.
        `.trim(),
      },
      {
        slug: "la-biblia-palabra-confiable",
        order: 3,
        title: "La Biblia: ¿es confiable la Palabra de Dios?",
        body: `
### Objetivo

Dar **razones sencillas** de confianza en las Escrituras y separar mitos comunes (“es solo un libro antiguo”) sin entrar en debates académicos largos.

### Ideas claras (explícalas con tus palabras)

- La Biblia se sostiene en **historia**, manuscritos y el testimonio de millones transformados.
- Su mensaje central es **coherente**: la humanidad necesita a Dios y Él provee salvación.
- La fe no es contra la razón, pero tampoco se reduce a laboratorio: hay misterio y revelación.

### Textos sugeridos

- **2 Timoteo 3:16-17** — inspiración y utilidad.
- **Isaías 40:8** — la palabra de Dios permanece.
- **Salmo 119:105** — lámpara para el camino.

### Preguntas

1. ¿Ha leído alguna vez la Biblia? ¿Qué impresión le dejó?
2. ¿Qué dudas tiene sobre su confiabilidad?
3. Si la Biblia fuera verdadera, ¿qué cambiaría en su vida esta semana?

### Ejercicio opcional

Leer juntos **un párrafo corto** (p. ej. Salmo 23) y preguntar: “¿Qué le dice esto a usted hoy?”
        `.trim(),
      },
      {
        slug: "como-leer-y-entender-la-biblia",
        order: 4,
        title: "¿Cómo leer y entender la Biblia?",
        body: `
### Objetivo

Enseñar **hábitos simples** de lectura: contexto, oración, una idea principal y aplicación — sin ser erudito.

### Método sencillo (memorizable)

1. **Orar** — “Señor, enséñame.”
2. **Leer** despacio un pasaje corto.
3. **Preguntar**: ¿Qué decía esto en su tiempo? ¿Qué implica hoy?
4. **Vivir** — un paso práctico.

### Textos sugeridos

- **Salmo 119:18** — abre mis ojos.
- **Lucas 24:27** — Cristo en las Escrituras (visión general).
- **Santiago 1:22** — ser hacedores, no solo oidores.

### Consejos

- Mejor **poco y claro** que mucho y confuso.
- Si no entiende un versículo, **lea el párrafo completo** o el capítulo.

### Práctica en la sesión

Elijan juntos **4-8 versículos** de un salmo o evangelio. Apliquen las tres preguntas: ¿Qué dice? ¿Qué significa? ¿Qué hago?
        `.trim(),
      },
      {
        slug: "por-que-existe-el-ser-humano",
        order: 5,
        title: "¿Por qué existe el ser humano?",
        body: `
### Objetivo

Presentar el **propósito bíblico** del ser humano: glorificar a Dios, vivir en relación con Él y con los demás, y ejercer un mandato de cuidado y servicio — con dignidad y esperanza.

### Textos sugeridos

- **Génesis 1:26-27** — imagen de Dios, dignidad humana.
- **Eclesiastés 12:13** — el fin del todo: temer a Dios y guardar mandamientos.
- **Mateo 22:37-39** — amar a Dios y al prójimo.

### Preguntas

1. ¿De dónde cree usted que viene el sentido de la vida?
2. ¿Qué cambia si fuimos **diseñados con propósito** y no por accidente?
3. ¿Qué área de su vida necesita alinearse mejor con ese propósito (trabajo, familia, tiempo)?

### Puente al evangelio (ligero)

La humanidad **no cumplió** el diseño original; por eso necesitamos restauración — tema que profundizarás cuando corresponda en tu plan pastoral.

### Cierre

Destaca que cada persona **vale** ante Dios, sin comparaciones vanidosas.
        `.trim(),
      },
      {
        slug: "el-amor-de-dios-hacia-la-humanidad",
        order: 6,
        title: "El amor de Dios hacia la humanidad",
        body: `
### Objetivo

**Integrar la serie**: mostrar que el amor de Dios es el hilo que atraviesa todos los temas anteriores — quién es Él, cómo nos acercamos, por qué confiar en Su Palabra, cómo leerla y para qué existimos.

### Textos sugeridos

- **Juan 3:16** — amor que da.
- **Romanos 5:8** — Cristo por nosotros.
- **1 Juan 4:9-10** — amor manifestado.

### Repaso guiado (preguntas)

1. ¿Qué aprendimos sobre **quién es Dios** y cómo se relaciona con Su amor?
2. ¿Cómo el amor de Dios nos invita a **acercarnos** sin fingir perfección?
3. ¿Por qué la Biblia es **digna de confianza** si habla de amor y juicio con honestidad?
4. ¿Cómo cambia nuestra **lectura** saber que Dios escribió para bendecir, no para confundir?
5. ¿Cómo el propósito humano se llena cuando **respondemos** al amor de Dios?

### Aplicación final de la serie

Propón **un compromiso concreto** para la próxima semana: lectura diaria corta, oración al despertar, o asistencia a un grupo — según el momento espiritual de la persona.

### Oración

Agradece el amor de Dios manifestado en Cristo y pide que la semilla de esta serie dé fruto duradero.

> **Nota para el maestro:** esta lección puede extenderse o dividirse en dos reuniones si hay muchas preguntas o si es el momento de presentar claramente el evangelio de salvación.
        `.trim(),
      },
    ],
  },
];

export function getSerieBySlug(slug: string) {
  return SERIES_BIBLICAS.find((s) => s.slug === slug) ?? null;
}

export function getLeccionInSerie(serieSlug: string, leccionSlug: string): {
  serie: SerieBiblica;
  leccion: LeccionSerie;
} | null {
  const serie = getSerieBySlug(serieSlug);
  if (!serie) return null;
  const leccion = serie.lecciones.find((l) => l.slug === leccionSlug) ?? null;
  if (!leccion) return null;
  return { serie, leccion };
}

export function getLeccionNeighbors(serie: SerieBiblica, order: number) {
  const sorted = [...serie.lecciones].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((l) => l.order === order);
  if (idx === -1) return { prev: null as LeccionSerie | null, next: null as LeccionSerie | null };
  return {
    prev: sorted[idx - 1] ?? null,
    next: sorted[idx + 1] ?? null,
  };
}
