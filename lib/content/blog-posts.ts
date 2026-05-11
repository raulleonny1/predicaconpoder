export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  categories: string[];
  /** Ruta bajo `public/` (p. ej. `/images/foto.png`). Vista previa al compartir; si falta, se usa `/logo.png`. */
  openGraphImage?: string;
  body: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "eden-el-hogar-que-dios-preparo-y-la-esperanza-del-cielo",
    title: "Edén: el hogar que Dios preparó y la esperanza del cielo",
    excerpt:
      "Dios no nos creó para el dolor ni la soledad: plantó un huerto antes de formar al hombre. Del primer hogar al hogar eterno, la Escritura nos invita a confiar en sus promesas.",
    publishedAt: "2026-05-11",
    categories: ["Esperanza", "Reflexión", "Promesas"],
    openGraphImage: "/images/arbol-verde.png",
    body: `
En el principio, Dios no creó al ser humano para el dolor, la soledad ni el miedo. Lo colocó en el Edén, el primer hogar de la humanidad: un lugar preparado con amor, belleza y propósito. Allí comenzó nuestra historia, nuestra raza, nuestra vida. Cada árbol, cada río y cada amanecer hablaban del cuidado perfecto de Dios.

La Biblia lo dice con sencillez y profundidad: **"Y Jehová Dios plantó un huerto en Edén… y puso allí al hombre que había formado"** (Génesis 2:8). Antes de que Adán existiera, Dios ya había preparado su casa. No fue un detalle secundario; fue el orden de su corazón: primero el lugar, después la familia que lo habitaría.

### Más que un jardín: una declaración de amor

El Edén no era solo un jardín exuberante. Era la evidencia de que **Dios siempre piensa primero en sus hijos**. El cielo y la tierra, la luz y el orden, la comida y el descanso, la compañía y la misión: todo convergía en una sola verdad — el hombre y la mujer eran amados antes de ser llamados a obrar.

Cuando hoy sentimos cansancio, ansiedad o vacío, no es porque Dios haya cambiado de idea sobre el diseño del alma. Es el eco de una historia interrumpida por el pecado. La desobediencia cerró las puertas de aquel hogar perfecto y la humanidad quedó, en cierto sentido, lejos de casa. El dolor entró, la vergüenza creció y el miedo encontró terreno. Pero la historia no termina ahí.

### Dios no abandonó su sueño

La Escritura no minimiza la caída; y aun así, no nos deja sin esperanza. **Dios no abandonó su sueño** de vivir con su pueblo en paz, en presencia, en gozo. A lo largo de los siglos, prometió restauración, envió a su Hijo y abrió un camino nuevo. Lo que perdimos en Adán, lo recuperamos en Cristo — no como un regreso idéntico al huerto antiguo, sino como **una redención mayor**, sellada en sangre y confirmada en resurrección.

Pablo escribe palabras que abren el corazón hacia lo invisible: **"Cosas que ojo no vio, ni oído oyó, ni han subido en corazón de hombre, son las que Dios ha preparado para los que le aman"** (1 Corintios 2:9). Si el Edén fue preparado para el inicio de la humanidad, el cielo ha sido preparado para el **final glorioso de los redimidos**. Si el primer hogar era hermoso, ¿qué será el lugar eterno donde no habrá muerte, ni llanto, ni dolor, sino vida plena junto a Jesús (Apocalipsis 21:4)?

![Árboles y luz: recordatorio del primer hogar y de la casa que Dios prepara](/images/arbol-verde.png)

### Reflexión: tu corazón todavía recuerda el hogar

Tal vez hoy cargas preocupaciones que no puedes resolver de un día para otro, o una soledad que nadie ve del todo. Es humano anhelar un lugar donde seamos comprendidos, cuidados y en paz. Ese anhelo no es un error: **es una brújula** que apunta a lo que Dios siempre quiso darnos.

La fe no nos pide fingir que todo está bien. Nos invita a descansar en **Aquel que es bueno, fiel y cumple lo que promete**. Jesús dijo que iba a preparar lugar (Juan 14:2-3). No fue una frase bonita de despedida; fue la continuación del mismo Dios que plantó el huerto antes de formar al hombre. **La misma ternura, el mismo propósito, la misma fidelidad.**

### Confía en las promesas de Dios

Confiar no es ignorar el dolor; es anclar la vida en promesas que **permanecen firmes más allá de lo pasajero**. Algunas formas sencillas de practicar esa confianza hoy:

1. **Lee y repite en voz alta** una promesa concreta (por ejemplo, Romanos 8:28, Isaías 41:10 o Salmo 23) y pregúntate qué actitud de obediencia o de descanso en Dios te invita a vivir.
2. **Cuenta una evidencia reciente** de cuidado divino: un abrazo a tiempo, un versículo que llegó justo, la fuerza para un día difícil.
3. **Habla con Dios con honestidad** sobre lo que te asusta; Él ya lo sabe y sigue llamándote hijo o hija.
4. **Camina un paso de obediencia pequeña** — perdonar, servir, pedir ayuda, guardar silencio antes de reaccionar — como respuesta de gratitud, no como pago de una deuda.

La promesa final no depende de tu rendimiento perfecto, sino de **la fidelidad de Dios** en Cristo. Si estás en Él, el hogar eterno no es un rumor: es **un lugar ya asegurado** por quien jamás falló.

### Cierre: un ancla para el camino

Si el Edén nos enseña que Dios se adelanta con bondad, el cielo nos recuerda que **Él no deja su obra a medias**. El mismo que plantó el huerto prepara la morada eterna. Mientras tanto, caminamos con esperanza, llevando su paz a quienes aún sienten el frío de estar lejos de casa.

> "En la casa de mi Padre muchas moradas hay… voy, pues, a preparar lugar para vosotros… vendré otra vez, y os tomaré a mí mismo, para que donde yo esté, vosotros también estéis." (Juan 14:2-3)

Que esta verdad te sostenga hoy: **no fuiste creado para quedarte en el miedo**, sino para ser guiado, un día, a la presencia donde todo será **al fin** "muy bueno" otra vez.
    `.trim(),
  },
  {
    slug: "reflexion-sobre-fe-y-confianza",
    title: "Fe y confianza cuando no ves el camino completo",
    excerpt:
      "La fe cristiana no niega la realidad ni elimina las preguntas: nos enseña a caminar con Dios paso a paso, incluso en medio de la incertidumbre.",
    publishedAt: "2026-05-01",
    categories: ["Fe", "Confianza"],
    body: `
### Cuando creer parece dificil

Hay temporadas en las que la vida se vuelve pesada: una puerta que no se abre, una oración que parece tardar demasiado, una noticia que no esperabas. En esos momentos, hablar de fe puede sonar abstracto. Sin embargo, la Biblia presenta la fe como algo profundamente concreto: una confianza activa en el carácter de Dios, aun cuando no tenemos todas las respuestas.

La fe no es negar lo que duele; es decidir que el dolor no tendrá la última palabra. Confiar en Dios no significa cerrar los ojos a la realidad, sino abrir el corazón a su dirección en medio de ella.

### Que es la fe segun la Biblia

Hebreos 11:1 dice que la fe es "la certeza de lo que se espera, la conviccion de lo que no se ve". Esa definicion no habla de fantasia ni de autoengano; habla de una seguridad que nace de conocer a Dios.

En la Escritura, la fe siempre esta conectada a una persona: Dios mismo. Por eso la pregunta central no es "cuanta fe tengo", sino "en quien estoy poniendo mi confianza".

### Fe no es ausencia de dudas

Muchos creyentes piensan que dudar es fracasar espiritualmente. Pero la duda, bien llevada, puede convertirse en una puerta para profundizar la confianza. El problema no es tener preguntas; el problema es vivir lejos de Dios mientras preguntas.

Los salmos estan llenos de hombres y mujeres que presentan sus luchas con honestidad: "¿Hasta cuando, Senor?". Esa sinceridad no ofende a Dios. Al contrario, muestra una relacion viva, real y dependiente.

### Como crece la confianza en Dios

La confianza no crece solo por emocion; crece por relacion y obediencia. Algunas practicas sencillas ayudan:

1. **Recuerda la fidelidad pasada de Dios.** Haz memoria de oraciones respondidas, cuidado recibido y puertas abiertas en su tiempo.
2. **Permanece en la Palabra.** La fe se fortalece cuando escuchamos a Dios por encima del ruido del temor.
3. **Ora con honestidad.** No repitas frases vacias; habla con Dios tal como estas.
4. **Obedece en lo pequeno.** Cada paso de obediencia diaria entrena el corazon para confiar en decisiones mas grandes.
5. **Camina en comunidad.** La fe se sostiene mejor cuando compartimos cargas con otros creyentes.

### Confiar cuando el resultado es incierto

Confiar en Dios no siempre cambia de inmediato la circunstancia, pero siempre transforma la manera en que atravesamos la circunstancia. A veces, Dios calma la tormenta; otras veces, fortalece al que esta dentro de la tormenta.

La confianza biblica no dice "todo saldra como yo quiero", sino "Dios permanecera fiel, haga lo que haga". Esa conviccion trae paz, direccion y perseverancia.

### Una practica para hoy

Haz este ejercicio en oracion:

- Escribe una preocupacion concreta que estas cargando.
- Anota una promesa biblica relacionada con esa area.
- Define un paso pequeno de obediencia para esta semana.
- Ora entregando ese asunto a Dios cada dia.

La fe madura no aparece de golpe. Se forma en decisiones diarias de dependencia. Dios no te pide controlar el futuro; te invita a confiarle el siguiente paso.

> "Confia en el Senor con todo tu corazon, y no te apoyes en tu propia prudencia." (Proverbios 3:5)
    `.trim(),
  },
  {
    slug: "como-estudiar-la-biblia-con-claridad",
    title: "Como estudiar la Biblia con claridad: tecnicas que si funcionan",
    excerpt:
      "Estudiar la Biblia con profundidad no requiere ser experto: con un metodo claro, buenas preguntas y constancia, el texto se vuelve comprensible y transformador.",
    publishedAt: "2026-04-18",
    categories: ["Biblia", "Estudio"],
    body: `
### Por que muchos se frustran al estudiar la Biblia

Muchas personas abren la Biblia con buena intencion, pero se pierden porque leen sin metodo. Saltan de un texto a otro, dependen solo de lo que sienten en el momento o sacan conclusiones sin revisar el contexto.

La claridad llega cuando seguimos un proceso simple y repetible. No se trata de leer mas rapido, sino de leer mejor.

### Tecnica 1: empieza con oracion y objetivo claro

Antes de leer, ora brevemente y define una meta:

- **Conocer a Dios** en el pasaje.
- **Comprender el mensaje original**.
- **Aplicar una verdad concreta** hoy.

Este enfoque evita una lectura superficial y dirige tu atencion al proposito correcto.

### Tecnica 2: usa el metodo OIA (Observacion, Interpretacion, Aplicacion)

Este metodo ordena el estudio y reduce confusiones.

1. **Observacion (que dice el texto)**
   - Quien habla, a quien, cuando, donde y por que.
   - Palabras repetidas, contrastes, mandatos, promesas.
   - Idea principal en una frase.

2. **Interpretacion (que significa)**
   - Que quiso comunicar el autor a su audiencia original.
   - Como se conecta con el contexto anterior y posterior.
   - Que ensena sobre Dios, la humanidad, el pecado, la gracia y la obediencia.

3. **Aplicacion (que hare con esto)**
   - Que debo creer, abandonar, obedecer o compartir.
   - Una accion medible para las proximas 24-72 horas.

Si no hay aplicacion, hubo informacion; no transformacion.

### Tecnica 3: lee siempre en contexto

Para evitar errores comunes:

- Lee al menos el parrafo completo, no solo un versiculo aislado.
- Identifica el genero literario (narrativa, poesia, profecia, carta, sabiduria).
- Compara traducciones cuando una frase sea dificil.
- Revisa pasajes paralelos sobre el mismo tema.

Regla practica: un texto nunca debe significar hoy lo contrario de lo que significo cuando fue escrito.

### Tecnica 4: haz preguntas que abren el texto

En tu cuaderno, responde:

- Que revela este pasaje del caracter de Dios?
- Que muestra de la condicion humana?
- Hay un pecado que evitar, una promesa que abrazar, un mandato que obedecer?
- Como apunta este texto a Cristo y al plan de salvacion?
- Que decision concreta tomare hoy?

Las buenas preguntas suelen producir mejores respuestas que una lectura apresurada.

### Tecnica 5: estudia por bloques y no solo por impulsos

Un plan efectivo semanal:

- **Dia 1:** lectura general del capitulo.
- **Dia 2:** observacion detallada (palabras clave, estructura).
- **Dia 3:** interpretacion y contexto.
- **Dia 4:** conexiones biblicas con otros pasajes.
- **Dia 5:** aplicacion personal y oracion.
- **Dia 6:** compartir lo aprendido con alguien.
- **Dia 7:** repaso y memoria de un versiculo clave.

La constancia gana a la intensidad esporadica.

### Tecnica 6: combina estudio personal con comunidad

El estudio individual es esencial, pero la comunidad aporta equilibrio:

- Corrige interpretaciones apresuradas.
- Enriquece la comprension con diferentes experiencias.
- Fortalece la obediencia al rendir cuentas.

Aprender junto a otros no reemplaza tu devocion personal; la fortalece.

### Herramientas sencillas que ayudan mucho

- Una Biblia de estudio confiable.
- Diccionario biblico basico.
- Cuaderno de observaciones.
- Marcadores para temas (promesas, mandatos, preguntas, aplicaciones).

No necesitas una biblioteca enorme para crecer; necesitas fidelidad al metodo.

### Un ejemplo rapido (Santiago 1:22)

> "Sed hacedores de la palabra, y no tan solamente oidores..."

- **Observacion:** hay un mandato directo.
- **Interpretacion:** no basta escuchar verdad; hay que practicarla.
- **Aplicacion:** hoy obedecere una instruccion biblica especifica en mi trato con alguien.

Este tipo de estudio convierte la Biblia en una guia de vida, no solo en informacion religiosa.

### Conclusión

Estudiar la Biblia con claridad es posible para cualquier creyente. Con oracion, contexto, metodo y obediencia diaria, la Palabra deja de ser confusa y empieza a iluminar decisiones reales.

Empieza pequeno, pero empieza hoy: elige un pasaje, aplica OIA y toma una accion concreta. Ahí comienza el crecimiento verdadero.
    `.trim(),
  },
  {
    slug: "recurso-para-compartir-la-esperanza",
    title: "Guia practica para compartir la esperanza (lista para usar)",
    excerpt:
      "Una guia clara y accionable para conversar de fe con respeto, amor y enfoque biblico: incluye pasos, guion corto y plan de 7 dias.",
    publishedAt: "2026-04-05",
    categories: ["Evangelismo", "Recursos"],
    body: `
### Compartir esperanza de forma natural y biblica

Hablar de Jesus no es repetir frases memorizadas ni ganar discusiones. Es amar a las personas, escuchar su historia y presentar con claridad la esperanza del evangelio.

Esta guia te ayuda a hacerlo paso a paso, de manera sencilla y practica.

### 1) Preparate antes de hablar

Antes de cualquier conversacion:

- Ora por nombres especificos.
- Pide sensibilidad para escuchar.
- Decide hablar con humildad, no con superioridad.
- Recuerda: tu tarea es testificar con fidelidad, no controlar resultados.

Una preparacion espiritual correcta cambia el tono de toda la conversacion.

### 2) Empieza escuchando, no imponiendo

La mejor puerta suele ser una pregunta genuina:

- "Como has estado realmente en estas semanas?"
- "En que area sientes mas carga hoy?"
- "Tienes algun apoyo espiritual cuando pasas momentos duros?"

Escuchar primero comunica respeto. La persona siente que es amada, no usada como proyecto.

### 3) Cuenta tu testimonio en 3 minutos

Un testimonio breve y claro puede seguir esta estructura:

1. **Antes:** como vivias o que vacio tenias.
2. **Encuentro:** como conociste a Cristo.
3. **Ahora:** que cambio real produjo en tu vida.

Habla de hechos concretos, no de generalidades. La autenticidad conecta mas que la perfeccion.

### 4) Explica el mensaje central con claridad

Cuando llegue el momento, resume asi:

- Dios nos ama y nos creo para relacion con El.
- El pecado nos separa de Dios.
- Jesus murio y resucito para reconciliarnos.
- La respuesta es arrepentimiento y fe en Cristo.

Evita tecnicismos innecesarios. Usa lenguaje simple y directo.

### 5) Usa un texto biblico corto y una pregunta abierta

Pasajes utiles para iniciar:

- Juan 3:16
- Romanos 6:23
- Efesios 2:8-9

Despues de leer, pregunta:

- "Que entiendes de este texto?"
- "Que parte te llama mas la atencion?"
- "Te gustaria que oremos por esto ahora?"

La pregunta correcta abre el corazon mas que un monologo largo.

### 6) Cierra con una invitacion concreta

No dejes la conversacion en el aire. Ofrece un siguiente paso:

- Orar juntos en ese momento.
- Leer el evangelio de Marcos durante una semana.
- Reunirse de nuevo para conversar preguntas.
- Invitar a una reunion o estudio biblico.

Las decisiones pequenas y claras facilitan procesos profundos.

### 7) Haz seguimiento con amor

Compartir esperanza no termina en una sola charla. El seguimiento es clave:

- Escribe en 24 horas para preguntar como esta.
- Comparte un versiculo apropiado durante la semana.
- Ora por su nombre y hazle saber que lo estas haciendo.
- Mantente disponible para preguntas sinceras.

La constancia pastoral suele abrir puertas que la prisa cierra.

### Guion breve (modelo editable)

Puedes usar algo asi:

> "Gracias por abrir tu corazon. Yo tambien pase momentos de confusion, y conoci a Jesus de forma personal. Descubri que Dios no esta lejos: nos ama, nos llama y nos ofrece perdon y vida nueva por medio de Cristo. Si quieres, podemos leer un texto corto y orar juntos."

Adapta el tono a tu personalidad. Que suene a ti, no a libreto robotico.

### Plan de accion de 7 dias

- **Dia 1:** Ora por 3 personas por nombre.
- **Dia 2:** Escribe tu testimonio en 10 lineas.
- **Dia 3:** Memoriza Juan 3:16 o Romanos 6:23.
- **Dia 4:** Inicia una conversacion intencional.
- **Dia 5:** Comparte un texto biblico y escucha.
- **Dia 6:** Haz seguimiento a quien conversaste.
- **Dia 7:** Evalua, agradece y vuelve a empezar.

### Conclusión

Compartir la esperanza es un llamado para todos, no solo para algunos. Cuando oras, escuchas, hablas con claridad y acompanias con amor, Dios usa tu vida de maneras poderosas.

Empieza con un paso pequeno esta semana. La fidelidad diaria produce fruto duradero.
    `.trim(),
  },
];
