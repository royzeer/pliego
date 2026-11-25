// Guías de cada herramienta: texto útil para el usuario y para Google.
// intro: explicación corta. steps: pasos. faqs: preguntas frecuentes propias de la herramienta.

export const GUIDES = {
  "cedula-ambas-caras": {
    intro: "Bancos, EPS, universidades y empresas suelen pedir la cédula por ambas caras en una sola hoja. Con esta herramienta subes una foto del frente y otra del reverso, y Pliego las pone en una hoja carta o A4 a tamaño real (85,6 × 54 mm), listas para imprimir o enviar.",
    steps: ["Toma una foto del frente de tu cédula sobre una mesa oscura, sin flash.", "Toma la foto del reverso de la misma forma.", "Sube las dos fotos. Si alguna sale girada, usa el botón de girar.", "Elige carta o A4 y descarga el PDF."],
    faqs: [
      ["¿Sale del tamaño real de la cédula?", "Sí. Cada cara queda de 85,6 × 54 mm, el tamaño estándar de las tarjetas de identidad, así que al imprimir al 100 % se ve igual a la original."],
      ["¿Es seguro subir mi cédula?", "Las fotos nunca salen de tu dispositivo: Pliego arma el PDF dentro de tu navegador. Aun así, te recomendamos ponerle una marca de agua que diga para qué trámite es."],
    ],
  },
  "comprimir-a-peso": {
    intro: "Muchas plataformas de empleo, universidades y entidades solo aceptan archivos de hasta 1 o 2 MB. En vez de adivinar la calidad, aquí eliges el peso máximo y Pliego prueba varias calidades hasta entregarte la mejor que quepa.",
    steps: ["Sube tu PDF.", "Elige el peso máximo: 500 KB, 1 MB, 2 MB, 5 MB o escribe otro.", "Haz clic en Comprimir al peso y espera unos segundos.", "Descarga el PDF y revisa que se lea bien."],
    faqs: [
      ["¿Por qué a veces no llega al peso?", "Si el PDF tiene muchas páginas y el peso que pides es muy bajo, no se puede bajar más sin que deje de leerse. En ese caso divide el PDF o pide un peso un poco mayor."],
      ["¿Se puede seleccionar el texto después?", "No. Para lograr pesos exactos, cada página se guarda como imagen optimizada. Si necesitas copiar el texto, guarda una copia del original."],
    ],
  },
  "paquete-documentos": {
    intro: "Para postularte a un empleo, una beca o una matrícula casi siempre te piden un solo PDF con todo: hoja de vida, cédula, diplomas y certificados. Esta herramienta los ordena por secciones, convierte las fotos a PDF y los une en un solo archivo numerado y con un nombre claro.",
    steps: ["Sube cada documento en su sección. Puedes subir PDF o fotos.", "Ordena los archivos dentro de cada sección si hace falta.", "Escribe el nombre del archivo, por ejemplo Apellido_Nombre_HojaDeVida.", "Haz clic en Crear paquete y descarga."],
    faqs: [
      ["¿Tengo que llenar todas las secciones?", "No. Todas son opcionales: solo se incluyen las que tengan archivos."],
      ["¿Qué nombre le pongo al archivo?", "Usa tu apellido, tu nombre y el documento, sin tildes ni espacios. Así lo encuentran fácil quienes reciben muchas hojas de vida."],
    ],
  },
  revisor: {
    intro: "Antes de subir un PDF a una plataforma, el revisor comprueba lo que más causa rechazos: que pese demasiado, que tenga contraseña, que mezcle tamaños de hoja, que tenga páginas giradas o en blanco. Si encuentra algo, te lleva a la herramienta que lo corrige.",
    steps: ["Sube tu PDF.", "Elige el peso máximo que pide la plataforma, o No sé.", "Haz clic en Revisar PDF.", "Si algo sale en rojo, usa el botón Corregir."],
    faqs: [["¿El revisor modifica mi archivo?", "No. Solo lo lee y te muestra el resultado."]],
  },
  "unir-pdf": {
    intro: "Junta varios PDF en uno solo, en el orden que quieras. Sirve para enviar varios soportes en un archivo, armar un trabajo con portadas o unir escaneos sueltos.",
    steps: ["Sube dos o más PDF.", "Arrástralos o usa las flechas para ordenarlos.", "Haz clic en Unir PDF y descarga el resultado."],
    faqs: [["¿Cuántos PDF puedo unir?", "En el plan gratis puedes unir hasta 20 archivos por vez, las veces que quieras."]],
  },
  "dividir-pdf": {
    intro: "Separa un PDF en varios archivos, por rangos de páginas o una página por archivo. Si salen varios archivos, se descargan juntos en un ZIP.",
    steps: ["Sube tu PDF.", "Elige Por rangos (por ejemplo 1-3, 4-6) o Cada página.", "Haz clic en Dividir PDF y descarga."],
    faqs: [["¿Cómo escribo los rangos?", "Separa con comas y usa guion para los rangos. Por ejemplo, 1-3, 5, 8-10 crea tres archivos."]],
  },
  "eliminar-paginas": {
    intro: "Quita las páginas que sobran de un PDF, como hojas en blanco, portadas repetidas o anexos que no necesitas enviar.",
    steps: ["Sube tu PDF.", "Escribe las páginas que quieres quitar, por ejemplo 2, 5-7.", "Haz clic en Eliminar páginas y descarga."],
    faqs: [["¿Puedo ver las páginas antes de borrarlas?", "Sí. Usa Ordenar PDF: ahí ves cada página en miniatura y la quitas con un clic."]],
  },
  "extraer-paginas": {
    intro: "Saca solo las páginas que necesitas de un PDF largo, en un archivo nuevo o una página por archivo.",
    steps: ["Sube tu PDF.", "Escribe las páginas que quieres, por ejemplo 1, 4-6.", "Marca Una página por archivo si las quieres separadas.", "Haz clic en Extraer páginas y descarga."],
    faqs: [],
  },
  "ordenar-pdf": {
    intro: "Ve todas las páginas de tu PDF en miniatura y organízalas arrastrándolas. También puedes girar o quitar páginas antes de guardar.",
    steps: ["Sube tu PDF y espera a que carguen las miniaturas.", "Arrastra las páginas al orden que quieras.", "Gira o quita páginas con los botones de cada miniatura.", "Haz clic en Guardar PDF."],
    faqs: [],
  },
  "intercalar-pdf": {
    intro: "Si escaneaste todas las caras de un documento y luego todos los reversos, quedan en dos archivos separados. Esta herramienta los intercala para que queden en orden: 1, 2, 3, 4…",
    steps: ["Sube el PDF de las caras (páginas impares).", "Sube el PDF de los reversos (páginas pares).", "Deja marcada la opción de orden inverso si volteaste el paquete al escanear.", "Haz clic en Intercalar y descarga."],
    faqs: [],
  },
  "varias-por-hoja": {
    intro: "Pon 2 o 4 páginas en cada hoja para imprimir menos. Ideal para diapositivas, apuntes y lecturas de clase.",
    steps: ["Sube tu PDF.", "Elige 2 o 4 páginas por hoja y el tamaño de hoja.", "Haz clic en Crear hojas y descarga."],
    faqs: [],
  },
  "escanear-pdf": {
    intro: "Convierte en PDF las fotos que tomas con el celular. Es la forma más rápida de digitalizar un documento cuando no tienes escáner.",
    steps: ["Toca el recuadro: en el celular se abre la cámara.", "Toma una foto por cada hoja, con buena luz y sin sombras.", "Ordena las fotos si hace falta.", "Haz clic en Crear PDF."],
    faqs: [],
  },
  "comprimir-pdf": {
    intro: "Reduce el peso de un PDF para enviarlo por correo o WhatsApp, o subirlo a una plataforma. Elige entre menor peso, equilibrado o mejor calidad.",
    steps: ["Sube tu PDF.", "Elige la calidad.", "Haz clic en Comprimir PDF y descarga."],
    faqs: [["¿Y si necesito un peso exacto?", "Usa Comprimir a peso exacto: eliges el máximo (por ejemplo 2 MB) y Pliego lo logra."]],
  },
  "reparar-pdf": {
    intro: "Intenta recuperar un PDF que no abre o que da error. Primero se reconstruye su estructura; si no se puede, se rehace a partir de lo que sí se alcanza a leer.",
    steps: ["Sube el PDF dañado.", "Haz clic en Reparar PDF.", "Descarga el resultado y revisa que esté completo."],
    faqs: [],
  },
  "quitar-metadatos": {
    intro: "Los PDF guardan datos ocultos como el nombre del autor, el programa con el que se hicieron y las fechas. Esta herramienta los borra antes de que compartas el archivo.",
    steps: ["Sube tu PDF.", "Haz clic en Quitar metadatos y descarga."],
    faqs: [],
  },
  "jpg-a-pdf": {
    intro: "Convierte una o varias imágenes (JPG, PNG o WEBP) en un PDF. Puedes ajustarlas a hoja carta o A4 con margen, o dejar el tamaño original de la foto.",
    steps: ["Sube tus imágenes.", "Ordénalas si hace falta.", "Elige el tamaño de hoja.", "Haz clic en Crear PDF."],
    faqs: [],
  },
  "pdf-a-jpg": {
    intro: "Convierte cada página de un PDF en una imagen JPG o PNG. Útil para publicar en redes, insertar en presentaciones o enviar por chat.",
    steps: ["Sube tu PDF.", "Elige el formato y la calidad.", "Haz clic en Convertir a imagen. Si son varias páginas, se descargan en un ZIP."],
    faqs: [],
  },
  "pdf-a-markdown": {
    intro: "Saca el texto de un PDF en formato Markdown, con títulos y listas detectados. Sirve para tomar notas, pegarlo en herramientas de IA o publicarlo en la web.",
    steps: ["Sube tu PDF (con texto, no escaneado).", "Haz clic en Convertir a Markdown.", "Descarga el archivo .md."],
    faqs: [["¿Hay límite?", "El plan gratis convierte hasta 50 páginas por archivo, sin límite de usos."]],
  },
  "extraer-texto": {
    intro: "Copia todo el texto de un PDF a un archivo .txt, separado por páginas.",
    steps: ["Sube tu PDF.", "Haz clic en Extraer texto y descarga el .txt."],
    faqs: [["¿Funciona con PDF escaneados?", "No: un escaneo es una imagen. Para eso se necesita OCR, que llega pronto a Pliego."]],
  },
  "rotar-pdf": {
    intro: "Gira todas las páginas de un PDF o solo algunas, 90° a la derecha, 90° a la izquierda o 180°.",
    steps: ["Sube tu PDF.", "Elige el giro.", "Escribe las páginas o déjalo vacío para girar todas.", "Haz clic en Rotar PDF."],
    faqs: [],
  },
  "numeros-de-pagina": {
    intro: "Agrega números de página en la posición que quieras, con formato 1, 2, 3 o 1 de 10. Muy útil para trabajos y documentos que piden foliar.",
    steps: ["Sube tu PDF.", "Elige la posición, el formato y en qué número empezar.", "Haz clic en Numerar páginas."],
    faqs: [],
  },
  "marca-de-agua": {
    intro: "Pon un texto en diagonal sobre cada página, como COPIA o SOLO PARA TRÁMITE. Es una buena práctica antes de enviar copias de documentos personales.",
    steps: ["Sube tu PDF.", "Escribe el texto y ajusta transparencia y tamaño.", "Haz clic en Poner marca de agua."],
    faqs: [],
  },
  "recortar-pdf": {
    intro: "Quita márgenes de todas las páginas indicando cuántos milímetros recortar en cada lado.",
    steps: ["Sube tu PDF.", "Escribe los milímetros de cada margen.", "Haz clic en Recortar PDF."],
    faqs: [],
  },
  "proteger-pdf": {
    intro: "Ponle contraseña a tu PDF para que nadie lo abra sin ella. También bloquea copiar y editar el contenido.",
    steps: ["Sube tu PDF.", "Escribe una contraseña de al menos 4 caracteres.", "Haz clic en Proteger PDF."],
    faqs: [["¿Y si olvido la contraseña?", "No se puede recuperar. Guárdala en un lugar seguro."]],
  },
  "desbloquear-pdf": {
    intro: "Quita la contraseña de un PDF del que conoces la clave, para no tener que escribirla cada vez o para poder subirlo a plataformas que no aceptan archivos protegidos.",
    steps: ["Sube tu PDF.", "Escribe la contraseña actual.", "Haz clic en Desbloquear PDF."],
    faqs: [],
  },
  "firmar-pdf": {
    intro: "Firma contratos, cartas, cuentas de cobro o formularios sin imprimir ni escanear. Dibuja tu firma con el dedo o el mouse, escríbela con letra de firma o súbele una foto, y ponla donde quieras en el PDF.",
    steps: ["Sube el PDF que vas a firmar.", "Haz clic en la página donde va la firma.", "Dibuja, escribe o sube la foto de tu firma y dale Poner firma en la página.", "Arrástrala a su lugar y ajusta el tamaño con el punto azul.", "Si quieres, agrega la fecha de hoy y guarda el PDF."],
    faqs: [["¿Esta firma tiene validez legal?", "Es una firma escaneada o electrónica simple, válida para la mayoría de documentos del día a día. Algunos trámites exigen firma digital certificada; revisa qué pide la entidad."], ["¿Se guarda mi firma?", "No. Se crea en tu navegador y desaparece al cerrar la página."]],
  },
  "editar-pdf": {
    intro: "Escribe sobre un PDF, agrega imágenes o logos, y tapa con un recuadro lo que no quieres que se vea. Ideal para llenar formatos que no tienen campos, corregir un dato o agregar una nota.",
    steps: ["Sube tu PDF.", "Haz clic en la página que quieres editar.", "Agrega un texto, una imagen o un recuadro.", "Muévelos, cambia su tamaño y color, y guarda."],
    faqs: [["¿Puedo cambiar el texto que ya trae el PDF?", "Puedes taparlo con un recuadro blanco y escribir encima el texto nuevo."]],
  },
  "formularios-pdf": {
    intro: "Llena formularios PDF que traen campos (cuadros de texto, casillas y listas) sin necesidad de programas instalados. Pliego detecta los campos y te los muestra en una lista para que los completes.",
    steps: ["Sube el formulario PDF.", "Llena los campos que aparecen.", "Marca Aplanar si no quieres que lo vuelvan a editar.", "Guarda el formulario."],
    faqs: [["¿Y si mi PDF no tiene campos?", "Usa Editar PDF para escribir encima de cualquier parte de la página."]],
  },
  "encabezado-pie": {
    intro: "Agrega un texto arriba o abajo de todas las páginas: el nombre de la institución, el título del trabajo, la fecha o el número de página en formato 1 de 10.",
    steps: ["Sube tu PDF.", "Escribe el encabezado, el pie o ambos. Usa {n}, {total} y {fecha} si los necesitas.", "Elige la alineación y el tamaño.", "Haz clic en Agregar encabezado y pie."],
    faqs: [],
  },
  "censurar-pdf": {
    intro: "Tapa de verdad datos sensibles antes de compartir un documento: números de cédula, cuentas bancarias, direcciones o firmas. A diferencia de un recuadro negro normal, Pliego borra lo que hay debajo, así nadie lo puede copiar ni recuperar.",
    steps: ["Sube tu PDF.", "Arrastra sobre la página para tapar zonas, o busca un texto para taparlo en todo el documento.", "Revisa que todo lo sensible quede cubierto.", "Haz clic en Censurar y guardar."],
    faqs: [["¿Por qué las páginas censuradas quedan como imagen?", "Es la forma segura de que el texto tapado desaparezca del archivo. Las páginas sin cambios se conservan igual."]],
  },
  "comparar-pdf": {
    intro: "Encuentra qué cambió entre dos versiones de un documento, como un contrato, una cotización o un trabajo. Pliego compara el texto página por página y te muestra en verde lo agregado y en rojo lo quitado.",
    steps: ["Sube la versión original.", "Sube la versión nueva.", "Haz clic en Comparar y revisa los cambios por página."],
    faqs: [["¿Compara imágenes o diseño?", "No, compara el texto. Si los PDF son escaneados, primero pásalos por OCR."]],
  },
  "ocr-pdf": {
    intro: "Convierte un PDF escaneado o una foto en un documento en el que puedes buscar y copiar el texto. El OCR lee las letras de la imagen y agrega una capa de texto invisible encima, sin cambiar cómo se ve el documento.",
    steps: ["Sube el PDF escaneado.", "Elige el idioma del documento.", "Elige si quieres un PDF buscable o solo el texto.", "Haz clic en Hacer OCR y espera a que lea cada página."],
    faqs: [["¿Qué tan exacto es?", "Funciona muy bien con documentos impresos y escaneos nítidos. Con letra a mano o fotos borrosas puede tener errores."], ["¿Hay límite?", "El plan gratis lee hasta 30 páginas por archivo, sin límite de usos."]],
  },
  "cuenta-de-cobro": {
    intro: "Si trabajas como independiente o por prestación de servicios, la cuenta de cobro es el documento con el que le cobras a tu cliente. Llena el formulario y Pliego arma el PDF con el valor en números y en letras, tus datos de pago y tu firma.",
    steps: ["Escribe tus datos. Se guardan en tu dispositivo para la próxima vez.", "Escribe a quién le cobras, el concepto y el valor.", "Agrega tu cuenta bancaria o Nequi y, si quieres, tu firma.", "Haz clic en Crear cuenta de cobro y descarga el PDF."],
    faqs: [["¿El valor en letras sale automático?", "Sí. Escribe el valor en números y Pliego lo escribe en letras, por ejemplo Un millón quinientos mil pesos m/cte."], ["¿Necesito factura electrónica?", "Depende de tus ingresos y de tu régimen tributario. Confírmalo con un contador o en la DIAN."]],
  },
  "derecho-de-peticion": {
    intro: "El derecho de petición te permite pedir información, documentos o una solución a una entidad pública o a una empresa privada, y obliga a responderte dentro de los plazos de ley. Llena los hechos y lo que pides, y Pliego arma el documento con la estructura correcta.",
    steps: ["Escribe la entidad a la que va dirigido.", "Cuenta los hechos, uno por línea.", "Escribe tus peticiones, una por línea.", "Agrega tus datos de notificación y tu firma, y descarga el PDF."],
    faqs: [["¿En cuánto tiempo deben responder?", "La Ley 1755 de 2015 fija plazos de respuesta según el tipo de petición. Guarda el comprobante de radicación con la fecha."]],
  },
  liquidacion: {
    intro: "Calcula cuánto te deben pagar al terminar tu contrato: cesantías, intereses sobre cesantías, prima de servicios y vacaciones no disfrutadas, con las fórmulas del Código Sustantivo del Trabajo y los valores de 2026.",
    steps: ["Escribe tu salario mensual y las fechas de inicio y terminación.", "Indica cuántos días de vacaciones ya disfrutaste.", "Revisa si aplica el auxilio de transporte (hasta 2 salarios mínimos).", "Mira el resultado y descárgalo en PDF."],
    faqs: [["¿Qué valores usa para 2026?", "Salario mínimo de $1.750.905 y auxilio de transporte de $249.095."], ["¿Incluye la indemnización por despido?", "No. La indemnización depende del tipo de contrato y del motivo de terminación; consúltalo con un abogado."]],
  },
};

export const getGuide = (id) => GUIDES[id];
