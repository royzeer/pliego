// Guías largas de las herramientas para organizar páginas.
export default [
  {
    slug: "como-unir-varios-pdf-en-uno-desde-el-celular",
    tool: "unir-pdf",
    title: "Cómo unir varios PDF en uno desde el celular o el computador",
    description: "Junta varios PDF en un solo archivo, en el orden que quieras, gratis, sin instalar nada y sin subir tus documentos a internet.",
    intro: [
      "Unir PDF es una de las tareas más comunes con documentos: juntar los soportes de un trámite, armar un trabajo de la universidad con su portada y anexos, o enviar varios escaneos en un solo correo.",
      "Muchas páginas te piden registrarte o te limitan a dos o tres uniones al día. En Pliego puedes unir hasta 20 archivos por vez, las veces que quieras, y los archivos nunca salen de tu dispositivo.",
    ],
    when: [
      "Una plataforma solo deja subir un archivo y tienes varios documentos.",
      "Quieres enviar por WhatsApp o correo un solo PDF en vez de muchos.",
      "Tienes un trabajo dividido en partes (portada, contenido, anexos) y lo quieres en un solo archivo.",
      "Escaneaste un documento en varias tandas y cada tanda quedó en un PDF diferente.",
    ],
    steps: [
      "Abre Unir PDF en Pliego.",
      "Toca el recuadro y elige los PDF que quieres unir. En el celular se abre el administrador de archivos; puedes elegir varios a la vez.",
      "Ordena los archivos: arrástralos o usa las flechas hasta que queden en el orden correcto. El de arriba será el primero.",
      "Haz clic en Unir PDF.",
      "Descarga el archivo. En el celular queda en la carpeta Descargas o en la app Archivos.",
    ],
    tips: [
      "Antes de unir, revisa que ningún archivo tenga contraseña. Si alguno tiene, quítala primero con Desbloquear PDF.",
      "Si después de unir necesitas mover páginas sueltas, usa Ordenar PDF: ahí ves cada página en miniatura.",
      "Si el resultado pesa mucho, comprímelo al final con Comprimir a peso exacto.",
      "Si tienes fotos en vez de PDF, conviértelas primero con Imagen a PDF, o usa Paquete de documentos, que acepta fotos y PDF mezclados.",
    ],
    sections: [
      {
        h: "¿Funciona en iPhone y Android?",
        p: ["Sí. Pliego funciona en el navegador, así que sirve igual en Chrome para Android, en Safari para iPhone y en cualquier computador. Si lo instalas como app desde el aviso de la página, puedes unir PDF incluso sin internet."],
      },
    ],
    faqs: [
      ["¿Cuántos archivos puedo unir?", "Hasta 20 archivos por vez en el plan gratis, sin límite de veces al día. Si necesitas más, une en tandas y luego une los resultados."],
      ["¿Se pierde calidad al unir?", "No. Unir PDF copia las páginas tal como están, sin comprimirlas ni convertirlas."],
      ["¿Se mantienen los enlaces y el texto seleccionable?", "El texto sigue siendo seleccionable porque las páginas no se modifican."],
    ],
  },
  {
    slug: "como-dividir-un-pdf-en-varios-archivos",
    tool: "dividir-pdf",
    title: "Cómo dividir un PDF en varios archivos",
    description: "Separa un PDF por rangos de páginas o en una página por archivo. Gratis, sin registro y sin subir el documento a internet.",
    intro: [
      "A veces tienes todo en un solo PDF y necesitas lo contrario: separarlo. Por ejemplo, el banco te mandó los extractos de todo el año en un archivo y solo necesitas tres meses, o escaneaste varios documentos juntos y cada uno debe ir por aparte.",
      "Con Dividir PDF de Pliego eliges cómo cortar el documento: por rangos que tú defines o una página por archivo. Si salen varios archivos, se descargan juntos en un ZIP.",
    ],
    when: [
      "Escaneaste varios documentos en una sola pasada y quieres separarlos.",
      "Una plataforma te pide subir cada documento por separado.",
      "El PDF pesa demasiado y quieres enviarlo en partes.",
      "Necesitas entregar solo algunos capítulos de un libro o informe.",
    ],
    steps: [
      "Abre Dividir PDF y sube tu archivo.",
      "Elige Por rangos si quieres decidir qué páginas van en cada archivo, o Cada página para separar todas.",
      "Si elegiste rangos, escríbelos separados por comas. Por ejemplo, 1-3, 4-6, 7 crea tres archivos.",
      "Haz clic en Dividir PDF.",
      "Descarga el ZIP y ábrelo para ver los archivos. En el celular, toca el ZIP en la carpeta Descargas para descomprimirlo.",
    ],
    tips: [
      "Si no sabes qué página es cuál, abre primero el PDF o usa Ordenar PDF para ver las miniaturas y anotar los números.",
      "Si solo necesitas una parte del documento y no todas, usa Extraer páginas: te da un único archivo con las páginas que elijas.",
      "Cambia el nombre de cada archivo al descomprimir el ZIP, para que quien lo reciba sepa qué es cada uno.",
    ],
    sections: [
      {
        h: "Cómo escribir los rangos",
        list: [
          "1-3 crea un archivo con las páginas 1, 2 y 3.",
          "5 crea un archivo con solo la página 5.",
          "1-3, 4-10 crea dos archivos: uno con las páginas 1 a 3 y otro con las páginas 4 a 10.",
          "Puedes dejar páginas por fuera: 1-2, 5-6 ignora las páginas 3 y 4.",
        ],
      },
    ],
    faqs: [
      ["¿Qué es un ZIP?", "Es un archivo que guarda varios archivos juntos. Los celulares y computadores lo abren con un toque o doble clic."],
      ["¿Se modifica el PDF original?", "No. Pliego crea archivos nuevos y el original queda igual."],
      ["¿Hay límite de páginas?", "El límite del plan gratis es por peso: hasta 100 MB por archivo."],
    ],
  },
  {
    slug: "como-eliminar-paginas-de-un-pdf",
    tool: "eliminar-paginas",
    title: "Cómo eliminar páginas de un PDF sin programas",
    description: "Quita páginas en blanco, portadas repetidas o anexos de un PDF en segundos. Gratis, desde el celular o el computador.",
    intro: [
      "Las páginas que sobran hacen que un documento se vea descuidado y pese más. Aparecen sobre todo al escanear por ambas caras, cuando los reversos en blanco también quedan en el archivo, o cuando descargas un documento que trae páginas de publicidad o términos que no necesitas.",
      "Con Eliminar páginas escribes los números de las páginas que quieres quitar y descargas el PDF limpio.",
    ],
    when: [
      "Tu escaneo quedó con hojas en blanco entre página y página.",
      "Vas a enviar un documento y hay páginas con información que no quieres compartir.",
      "El PDF tiene una portada o una página repetida.",
      "Necesitas bajar el peso del archivo y algunas páginas sobran.",
    ],
    steps: [
      "Abre el PDF en tu celular o computador y anota los números de las páginas que sobran.",
      "Abre Eliminar páginas en Pliego y sube el archivo.",
      "Escribe las páginas que quieres quitar, por ejemplo 2, 5-7. El guion indica un rango.",
      "Haz clic en Eliminar páginas y descarga el resultado.",
    ],
    tips: [
      "Si prefieres ver las páginas antes de quitarlas, usa Ordenar PDF: ahí aparecen en miniatura y las quitas con el botón de la papelera.",
      "El Revisor antes de subir te avisa si tu PDF tiene páginas en blanco y cuáles son.",
      "Eliminar una página no borra la información para siempre del archivo original: el original sigue igual en tu dispositivo. Si se trata de datos sensibles, borra también el original o usa Censurar PDF.",
    ],
    faqs: [
      ["¿Puedo quitar varias páginas a la vez?", "Sí. Escribe todas separadas por comas, por ejemplo 1, 3, 8-10."],
      ["¿Y si me equivoco de página?", "El archivo original no cambia, así que puedes volver a empezar con él."],
      ["¿Funciona con PDF escaneados?", "Sí. Funciona con cualquier PDF, sea escaneado o creado en el computador."],
    ],
  },
  {
    slug: "como-extraer-paginas-de-un-pdf",
    tool: "extraer-paginas",
    title: "Cómo sacar solo algunas páginas de un PDF",
    description: "Extrae las páginas que necesitas de un PDF largo en un archivo nuevo, o una página por archivo. Gratis y sin subir tu documento.",
    intro: [
      "Extraer páginas es lo contrario de eliminar: en vez de decir qué sobra, dices qué necesitas. Es lo más práctico cuando tienes un documento largo y solo te piden una parte, por ejemplo una página de un contrato, el certificado que viene dentro de un paquete o el capítulo de un libro que vas a leer en clase.",
      "Con Extraer páginas de Pliego escribes las páginas que quieres y obtienes un PDF nuevo solo con ellas. También puedes pedir que cada página quede en un archivo separado.",
    ],
    when: [
      "Te piden solo la primera página de un documento, como la portada de un contrato o la hoja de un certificado.",
      "Tienes un libro o una guía en PDF y solo necesitas un capítulo.",
      "Quieres enviar algunas páginas de un extracto bancario sin compartir todo el documento.",
      "Necesitas cada página de un documento como archivo independiente.",
    ],
    steps: [
      "Abre Extraer páginas y sube tu PDF.",
      "Escribe las páginas que quieres, por ejemplo 1, 4-6.",
      "Marca Una página por archivo si las quieres separadas. Si no la marcas, todas quedan juntas en un PDF.",
      "Haz clic en Extraer páginas y descarga el resultado.",
    ],
    tips: [
      "Las páginas se extraen en el orden en que aparecen en el documento. Si las necesitas en otro orden, después usa Ordenar PDF.",
      "Extraer páginas es una buena forma de compartir menos información: envía solo lo que te pidieron.",
    ],
    faqs: [
      ["¿Cuál es la diferencia con Dividir PDF?", "Dividir PDF corta todo el documento en partes. Extraer páginas solo saca las páginas que elijas y deja el resto por fuera."],
      ["¿El texto sigue siendo seleccionable?", "Sí. Las páginas se copian tal cual, sin convertirlas."],
    ],
  },
  {
    slug: "como-ordenar-las-paginas-de-un-pdf",
    tool: "ordenar-pdf",
    title: "Cómo ordenar, girar y borrar páginas de un PDF viéndolas",
    description: "Organiza las páginas de un PDF arrastrando miniaturas: cambia el orden, gira las que están de lado y quita las que sobran.",
    intro: [
      "Cuando escaneas un documento con prisa, las hojas suelen quedar en desorden, alguna de lado y otra repetida. Arreglarlo escribiendo números de página es lento si no sabes cuál es cuál.",
      "Ordenar PDF te muestra todas las páginas en miniatura para que las organices viéndolas: arrastras cada página a su lugar, giras las que quedaron de lado y quitas las que sobran. Cuando todo está bien, guardas el PDF.",
    ],
    when: [
      "Escaneaste hojas sueltas y quedaron en desorden.",
      "Uniste varios PDF y necesitas mover algunas páginas.",
      "Hay páginas de lado o al revés.",
      "Quieres revisar un documento página por página antes de enviarlo.",
    ],
    steps: [
      "Abre Ordenar PDF y sube tu archivo. Espera a que aparezcan las miniaturas.",
      "Arrastra cada página a la posición que le corresponde.",
      "Usa el botón de girar en las páginas que estén de lado o al revés.",
      "Usa el botón de la papelera en las páginas que sobran.",
      "Cuando todo esté en orden, haz clic en Guardar PDF y descarga.",
    ],
    tips: [
      "En el celular, mantén presionada una miniatura un momento antes de arrastrarla.",
      "Si el PDF tiene muchas páginas, las miniaturas pueden tardar unos segundos en cargar.",
      "Si solo necesitas girar páginas y no reordenarlas, Rotar PDF es más rápido.",
    ],
    faqs: [
      ["¿Puedo deshacer un cambio?", "Mientras no guardes, puedes volver a mover o girar cualquier página. El archivo original nunca cambia."],
      ["¿Las páginas giradas pierden calidad?", "No. El giro se guarda como una propiedad de la página; el contenido no se vuelve a procesar."],
    ],
  },
  {
    slug: "como-unir-escaneo-de-caras-y-reversos-en-orden",
    tool: "intercalar-pdf",
    title: "Cómo unir un escaneo de caras y reversos en el orden correcto",
    description: "Escaneaste primero todas las caras y luego todos los reversos. Intercálalos en un solo PDF en orden 1, 2, 3, 4 en segundos.",
    intro: [
      "Muchas impresoras de casa y de oficina solo escanean por un lado. Para digitalizar un documento impreso por ambas caras, lo normal es escanear el paquete completo por delante, voltearlo y escanear los reversos. El resultado son dos PDF: uno con las páginas 1, 3, 5… y otro con las 2, 4, 6…, muchas veces en orden inverso.",
      "Intercalar páginas resuelve esto en un paso: subes los dos archivos y Pliego los mezcla en el orden correcto. Ninguna otra herramienta popular lo hace tan directo.",
    ],
    when: [
      "Escaneaste un contrato, un pagaré o un certificado impreso por ambas caras con un escáner de un solo lado.",
      "Usas el alimentador automático de una fotocopiadora que no escanea a doble cara.",
      "Tienes dos PDF que deben quedar alternados, página por página.",
    ],
    steps: [
      "Escanea todas las caras del paquete. Ese es tu primer PDF (páginas impares).",
      "Voltea el paquete completo y escanea los reversos. Ese es tu segundo PDF (páginas pares).",
      "Abre Intercalar páginas en Pliego y sube cada PDF en su lugar.",
      "Deja marcada la opción Los reversos están en orden inverso si volteaste el paquete al escanear. Es lo más común.",
      "Haz clic en Intercalar y revisa el resultado.",
    ],
    tips: [
      "Si el resultado quedó con los reversos cruzados (la página 2 donde debería ir la última), desmarca la opción de orden inverso y vuelve a intentar.",
      "Si los reversos quedaron de cabeza, gíralos 180 grados con Rotar PDF.",
      "Si algunos reversos estaban en blanco, quítalos después con Eliminar páginas.",
    ],
    faqs: [
      ["¿Qué pasa si los dos PDF no tienen el mismo número de páginas?", "Pliego intercala mientras haya páginas en ambos y pone al final las páginas que sobren del archivo más largo."],
      ["¿Por qué quedan en orden inverso?", "Al voltear el paquete para escanear los reversos, la última hoja queda de primera. Por eso el segundo PDF empieza con el reverso de la última página."],
    ],
  },
  {
    slug: "como-imprimir-varias-paginas-de-un-pdf-en-una-hoja",
    tool: "varias-por-hoja",
    title: "Cómo poner 2 o 4 páginas de un PDF en una sola hoja",
    description: "Ahorra papel y tinta imprimiendo 2 o 4 páginas por hoja. Ideal para diapositivas, lecturas y apuntes de clase.",
    intro: [
      "Imprimir unas diapositivas de 60 páginas o una lectura larga para la universidad gasta mucho papel y dinero. Si las páginas se leen bien a menor tamaño, puedes poner 2 o 4 en cada hoja y pagar la mitad o la cuarta parte.",
      "Varias páginas por hoja crea un PDF nuevo con 2 o 4 páginas por hoja, listo para imprimir en cualquier papelería, sin tener que configurar la impresora.",
    ],
    when: [
      "Vas a imprimir diapositivas de una clase o de una presentación.",
      "Tienes una lectura larga y quieres imprimirla más barata.",
      "Quieres hacer un resumen o una guía de estudio compacta.",
      "La papelería te cobra por hoja y quieres gastar menos.",
    ],
    steps: [
      "Abre Varias páginas por hoja y sube el PDF.",
      "Elige 2 o 4 páginas por hoja.",
      "Elige el tamaño de hoja: carta, A4 u oficio.",
      "Haz clic en Crear hojas y descarga el PDF.",
      "Imprime al 100 % o en tamaño real.",
    ],
    tips: [
      "Con 2 por hoja, las páginas verticales quedan una al lado de la otra en una hoja horizontal; es lo más cómodo para leer texto.",
      "Con 4 por hoja, el texto queda pequeño. Úsalo para diapositivas con letra grande, no para documentos de texto.",
      "Si además imprimes por ambas caras, una presentación de 60 diapositivas a 4 por hoja ocupa solo 8 hojas.",
    ],
    faqs: [
      ["¿Funciona con diapositivas horizontales?", "Sí. Pliego acomoda cada página en su espacio sin deformarla."],
      ["¿Puedo llevar el archivo a la papelería?", "Sí. Es un PDF normal; puedes enviarlo por WhatsApp o llevarlo en una memoria."],
    ],
  },
  {
    slug: "como-escanear-documentos-con-el-celular-a-pdf",
    tool: "escanear-pdf",
    title: "Cómo escanear documentos con el celular y guardarlos en PDF",
    description: "Convierte en PDF las fotos de tus documentos tomadas con el celular, sin instalar apps de escáner. Gratis y sin marcas de agua.",
    intro: [
      "No necesitas un escáner ni una app especial para digitalizar un documento. La cámara de tu celular es suficiente, siempre que tomes bien las fotos. El problema es que las fotos sueltas no sirven para un trámite: casi siempre te piden un PDF.",
      "Escanear a PDF de Pliego abre la cámara, te deja tomar una foto por hoja y une todo en un solo PDF. Sin registros, sin marcas de agua y sin subir tus documentos a ningún servidor.",
    ],
    when: [
      "Te piden un documento en PDF y solo lo tienes en papel.",
      "Quieres guardar una copia digital de recibos, facturas o certificados.",
      "Necesitas enviar firmado un documento que imprimiste.",
      "Estás lejos de una papelería y necesitas digitalizar algo ya.",
    ],
    steps: [
      "Busca un lugar con buena luz, ojalá luz natural, y pon el documento sobre una superficie oscura.",
      "Abre Escanear a PDF en Pliego y toca el recuadro. En el celular se abre la cámara.",
      "Toma una foto por cada hoja, con el celular paralelo al papel y sin sombras.",
      "Revisa el orden de las fotos y cámbialo si hace falta.",
      "Haz clic en Crear PDF y descárgalo.",
    ],
    tips: [
      "Las sombras de tu mano o del celular son el error más común. Ponte de lado respecto a la luz para no tapar la hoja.",
      "No uses el zoom: acércate al documento. El zoom digital reduce la nitidez.",
      "Si el PDF quedó muy pesado, comprímelo con Comprimir a peso exacto antes de enviarlo.",
      "Si necesitas que el texto se pueda buscar o copiar, pasa el PDF por OCR PDF.",
    ],
    faqs: [
      ["¿Puedo escanear varias hojas en un solo PDF?", "Sí. Toma todas las fotos que necesites; cada una será una página del PDF."],
      ["¿Funciona en el computador?", "Sí, pero en el computador eliges fotos que ya tengas guardadas en vez de abrir la cámara."],
      ["¿Las fotos se suben a internet?", "No. El PDF se arma dentro de tu celular."],
    ],
  },
];
