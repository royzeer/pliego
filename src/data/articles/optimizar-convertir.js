// Guías largas de las herramientas para optimizar y convertir.
export default [
  {
    slug: "como-comprimir-un-pdf-para-enviarlo-por-whatsapp-o-correo",
    tool: "comprimir-pdf",
    title: "Cómo comprimir un PDF para enviarlo por WhatsApp o correo",
    description: "Reduce el peso de un PDF eligiendo entre menor peso, equilibrado o mejor calidad. Gratis, sin límite de usos y sin subir tu archivo.",
    intro: [
      "Gmail no deja adjuntar archivos de más de 25 MB y WhatsApp tarda una eternidad con documentos pesados, sobre todo si quien lo recibe tiene pocos datos. Un PDF lleno de fotos o páginas escaneadas puede pesar decenas de megas sin necesidad.",
      "Comprimir PDF reduce el peso del archivo y te deja elegir el balance entre peso y calidad. Todo pasa dentro de tu dispositivo, así que también sirve con documentos privados.",
    ],
    when: [
      "El correo te dice que el adjunto es demasiado grande.",
      "Quieres que el PDF se envíe y se abra rápido por WhatsApp.",
      "Tu celular o tu Drive se están llenando de PDF pesados.",
      "Escaneaste documentos con el celular y cada página pesa varios megas.",
    ],
    steps: [
      "Abre Comprimir PDF y sube tu archivo.",
      "Elige la calidad: Menor peso si lo importante es que pese poco, Equilibrado para la mayoría de casos, o Mejor calidad si tiene fotos o letra pequeña.",
      "Haz clic en Comprimir PDF.",
      "Compara el peso antes y después, y descarga el archivo.",
      "Ábrelo y revisa que se lea bien antes de enviarlo.",
    ],
    tips: [
      "Empieza con Equilibrado. Si sigue pesando mucho, prueba Menor peso.",
      "Si una plataforma te exige un peso máximo exacto, usa Comprimir a peso exacto: eliges el límite y Pliego lo cumple.",
      "Guarda siempre el original. El PDF comprimido es para enviar, no para archivar.",
    ],
    sections: [
      {
        h: "Qué pasa con el texto al comprimir",
        p: [
          "Para reducir de verdad el peso, Pliego vuelve a guardar cada página como una imagen optimizada. Se ve igual al leerla, pero el texto ya no se puede seleccionar ni buscar.",
          "Si tu PDF ya estaba muy optimizado, por ejemplo uno creado en Word con solo texto, Pliego te devuelve el original, porque comprimirlo lo haría más pesado.",
        ],
      },
    ],
    faqs: [
      ["¿Cuánto se reduce el peso?", "Depende del archivo. Los PDF con fotos o escaneos suelen bajar mucho; los que solo tienen texto casi no cambian."],
      ["¿Se puede comprimir varias veces?", "Sí, pero cada vez se pierde algo de calidad. Es mejor elegir Menor peso una sola vez desde el original."],
    ],
  },
  {
    slug: "como-reparar-un-pdf-danado-que-no-abre",
    tool: "reparar-pdf",
    title: "Cómo reparar un PDF dañado que no abre",
    description: "El PDF dice que está dañado o no se puede abrir. Prueba a recuperarlo gratis, sin instalar programas y sin subirlo a internet.",
    intro: [
      "Un PDF se puede dañar por una descarga que se cortó, una memoria USB que se desconectó antes de tiempo, un correo que corrompió el adjunto o un programa que lo guardó mal. El resultado es el mismo: El archivo está dañado y no se puede reparar.",
      "Reparar PDF intenta recuperarlo en dos pasos. Primero reconstruye la estructura interna del archivo. Si eso no funciona, rehace el documento a partir de lo que sí se alcanza a leer, página por página.",
    ],
    when: [
      "Un PDF descargado no abre o se ve en blanco.",
      "Una plataforma dice que tu archivo está dañado o no es válido.",
      "El PDF abre en el computador pero no en el celular, o al revés.",
      "Algunas páginas cargan y otras no.",
    ],
    steps: [
      "Abre Reparar PDF y sube el archivo dañado.",
      "Haz clic en el botón para repararlo y espera; con archivos grandes puede tardar.",
      "Descarga el resultado y ábrelo para revisar todas las páginas.",
      "Si Pliego te avisa que el PDF se reconstruyó como imágenes, el contenido se ve, pero el texto ya no se podrá seleccionar.",
    ],
    tips: [
      "Antes de reparar, intenta descargar otra vez el archivo desde su origen. Muchas veces el problema fue solo la descarga.",
      "Si reparar no funciona, pide a quien te lo envió que lo exporte otra vez a PDF.",
      "Si después de la reparación necesitas el texto seleccionable, pasa el resultado por OCR PDF.",
    ],
    faqs: [
      ["¿Siempre se puede recuperar?", "No. Si el archivo está muy dañado o incompleto, puede que no se recupere nada o solo algunas páginas."],
      ["¿Sirve para PDF con contraseña?", "Si el PDF tiene contraseña, primero quítala con Desbloquear PDF y luego repáralo."],
    ],
  },
  {
    slug: "como-convertir-un-pdf-escaneado-en-texto-buscable-ocr",
    tool: "ocr-pdf",
    title: "Cómo volver buscable un PDF escaneado con OCR",
    description: "Convierte un PDF escaneado en un PDF con texto que se puede buscar y copiar, o saca el texto a un .txt. En español e inglés.",
    intro: [
      "Cuando escaneas un documento, el PDF que resulta es en realidad una foto: lo puedes leer, pero el computador no ve palabras. Por eso no puedes buscar una palabra con Ctrl + F, ni copiar un párrafo, ni pasarlo a Word.",
      "El OCR (reconocimiento óptico de caracteres) lee la imagen y detecta las letras. OCR PDF de Pliego crea un PDF buscable que se ve igual al original pero con el texto debajo, o te entrega solo el texto en un archivo .txt.",
    ],
    when: [
      "Necesitas copiar texto de un documento escaneado.",
      "Quieres buscar palabras dentro de un PDF escaneado largo.",
      "Vas a pasar un escaneo a Word o a resumirlo con IA, y primero necesitas el texto.",
      "Tienes fotos de apuntes o libros y quieres digitalizar el contenido.",
    ],
    steps: [
      "Abre OCR PDF y sube el PDF escaneado.",
      "Elige el idioma del documento: Español, Inglés o Ambos. Elegir bien el idioma mejora mucho el resultado.",
      "Elige el resultado: PDF buscable o Solo texto (.txt).",
      "Haz clic en el botón y espera. El OCR es más lento que otras herramientas porque lee cada página.",
      "Descarga el resultado y revisa el texto, sobre todo números y nombres propios.",
    ],
    tips: [
      "Entre más nítido el escaneo, mejor el resultado. Las fotos movidas, torcidas o con sombras generan errores.",
      "Si el escaneo está de lado, gíralo primero con Rotar PDF.",
      "El OCR funciona bien con letra impresa. Con letra a mano el resultado suele ser malo.",
      "Revisa siempre las cifras: un 8 confundido con un 3 puede ser grave en una factura o un certificado.",
    ],
    faqs: [
      ["¿Cuántas páginas puedo procesar?", "En el plan gratis, hasta 30 páginas por archivo, sin límite de usos. Si tu documento es más largo, divídelo primero."],
      ["¿Mi documento se sube a internet?", "No. El reconocimiento se hace dentro de tu navegador. La primera vez se descarga el modelo de reconocimiento del idioma, por eso puede tardar un poco más."],
      ["¿Por qué tarda tanto?", "El OCR analiza cada página como una imagen. En celulares de gama baja puede tardar varios segundos por página."],
    ],
  },
  {
    slug: "como-quitar-los-metadatos-de-un-pdf",
    tool: "quitar-metadatos",
    title: "Cómo quitar los metadatos ocultos de un PDF",
    description: "Borra el autor, el título, el programa y las fechas ocultas de un PDF antes de compartirlo. Gratis y sin subir el archivo.",
    intro: [
      "Además de lo que ves en las páginas, un PDF guarda información oculta llamada metadatos: quién es el autor, con qué programa se hizo, cuándo se creó y cuándo se modificó, y a veces un título o palabras clave. Cualquiera que reciba el archivo puede verlos en las propiedades del documento.",
      "Quitar metadatos borra esa información para que el PDF no revele más de lo necesario. No cambia nada de las páginas.",
    ],
    when: [
      "Vas a enviar un documento y no quieres que aparezca el nombre de tu computador o de tu empresa como autor.",
      "El PDF sale de una plantilla y conserva el nombre o el título de otra persona.",
      "Vas a publicar un documento en internet.",
      "No quieres que se vea la fecha en que se creó o modificó el archivo.",
    ],
    steps: [
      "Abre Quitar metadatos y sube tu PDF.",
      "Haz clic en el botón para limpiarlo.",
      "Descarga el PDF limpio.",
      "Si quieres comprobarlo, ábrelo en el computador y mira las propiedades del documento: los campos de autor, título y programa estarán vacíos.",
    ],
    tips: [
      "Haz esto como último paso, justo antes de enviar. Si después editas el PDF con otro programa, ese programa puede volver a escribir sus datos.",
      "Los metadatos no son lo mismo que el contenido. Si hay datos personales visibles en las páginas, usa Censurar PDF.",
    ],
    sections: [
      {
        h: "Qué se borra",
        list: ["Título, autor, asunto y palabras clave.", "El programa con el que se creó el PDF y el que lo produjo.", "Las fechas de creación y de modificación."],
      },
    ],
    faqs: [
      ["¿Cambia algo en las páginas?", "No. El contenido queda exactamente igual."],
      ["¿Para qué sirven los metadatos?", "Ayudan a organizar archivos y a que los buscadores entiendan un documento. Si no los necesitas, puedes borrarlos sin problema."],
    ],
  },
  {
    slug: "como-convertir-fotos-jpg-a-pdf",
    tool: "jpg-a-pdf",
    title: "Cómo convertir fotos JPG o PNG a PDF",
    description: "Convierte una o varias imágenes JPG, PNG o WEBP en un solo PDF, en carta, A4 o del tamaño de la foto. Gratis y sin marcas de agua.",
    intro: [
      "Muchas plataformas no aceptan imágenes, solo PDF. Pasa con recibos de pago, capturas de pantalla, fotos de certificados y documentos que te mandaron por WhatsApp.",
      "Imagen a PDF convierte una o varias imágenes en un solo PDF. Puedes elegir el tamaño de hoja, dejar margen o hacer que cada página tenga el tamaño exacto de la foto.",
    ],
    when: [
      "Te piden un comprobante de pago en PDF y solo tienes la captura.",
      "Quieres juntar varias fotos de un documento en un solo archivo.",
      "Necesitas imprimir fotos en hojas tamaño carta.",
      "Tienes una imagen PNG o WEBP que una plataforma no acepta.",
    ],
    steps: [
      "Abre Imagen a PDF y sube tus imágenes. Puedes elegir varias a la vez.",
      "Ordénalas arrastrándolas: cada imagen será una página.",
      "Elige el tamaño de hoja: Carta, A4 o Igual a la foto.",
      "Si elegiste carta o A4, decide si quieres dejar margen.",
      "Haz clic en Crear PDF y descárgalo.",
    ],
    tips: [
      "Usa Igual a la foto para capturas de pantalla: así no quedan franjas blancas.",
      "Usa Carta con margen para documentos que se van a imprimir.",
      "Si las fotos son de documentos en papel, Escanear a PDF es más cómodo porque abre la cámara directamente.",
    ],
    faqs: [
      ["¿Qué formatos acepta?", "JPG, PNG y WEBP."],
      ["¿Las fotos pierden calidad?", "No se reducen a propósito. Si el PDF queda muy pesado, puedes comprimirlo después."],
      ["¿Le pone marca de agua?", "No. Pliego nunca pone marcas de agua en tus archivos."],
    ],
  },
  {
    slug: "como-convertir-word-a-pdf-sin-programas",
    tool: "word-a-pdf",
    title: "Cómo convertir un Word a PDF sin tener Office",
    description: "Pasa un documento de Word (.docx) a PDF desde el celular o un computador sin Office instalado. Gratis y sin subir el archivo.",
    intro: [
      "Casi todos los trámites piden PDF, pero muchos documentos se escriben en Word: la hoja de vida, una carta, un trabajo de la universidad. Si no tienes Office en el computador, o estás en el celular, convertirlo puede ser un problema.",
      "Word a PDF convierte un archivo .docx a PDF dentro de tu navegador, sin instalar nada y sin subir el documento.",
    ],
    when: [
      "Te pidieron la hoja de vida en PDF y la tienes en Word.",
      "Estás en el celular o en un computador prestado sin Office.",
      "Quieres enviar un documento que nadie pueda modificar fácilmente.",
      "Necesitas que el documento se vea igual en cualquier dispositivo.",
    ],
    steps: [
      "Abre Word a PDF y sube tu archivo .docx.",
      "Espera a que Pliego lo convierta. Los documentos largos tardan un poco más.",
      "Descarga el PDF y revísalo página por página.",
    ],
    tips: [
      "Usa fuentes comunes como Arial o Calibri. Las fuentes raras pueden verse distintas en la conversión.",
      "Si tienes Word en el computador, la opción Guardar como PDF de Word da el resultado más fiel y con texto seleccionable.",
      "Si el documento es un .doc antiguo, ábrelo en Word o en Google Docs y guárdalo como .docx primero.",
    ],
    sections: [
      {
        h: "Lo que debes saber",
        p: ["Para que el PDF se vea igual al documento sin depender de un servidor, Pliego dibuja cada página como imagen. El resultado se ve bien y sirve para enviar o imprimir, pero el texto no se puede seleccionar. Si necesitas texto seleccionable, pasa el PDF por OCR PDF."],
      },
    ],
    faqs: [
      ["¿Acepta archivos .doc?", "Solo .docx, que es el formato de Word desde 2007."],
      ["¿Se ven las tablas y las imágenes?", "Sí. Tablas, imágenes, negrillas y colores se conservan. Algunos elementos avanzados, como cuadros de texto flotantes, pueden moverse un poco."],
    ],
  },
  {
    slug: "como-convertir-powerpoint-a-pdf",
    tool: "powerpoint-a-pdf",
    title: "Cómo convertir una presentación de PowerPoint a PDF",
    description: "Pasa diapositivas de PowerPoint (.pptx) a PDF para enviarlas o imprimirlas, desde el celular o el computador. Gratis.",
    intro: [
      "Un PDF se abre en cualquier dispositivo sin depender de que la otra persona tenga PowerPoint, y se imprime más fácil. Por eso muchos profesores y empresas piden las presentaciones en PDF.",
      "PowerPoint a PDF convierte cada diapositiva de un archivo .pptx en una página del PDF, dentro de tu navegador.",
    ],
    when: [
      "Te piden entregar las diapositivas de una exposición en PDF.",
      "Quieres imprimir una presentación.",
      "Vas a enviar una presentación por WhatsApp y quieres que se vea en cualquier celular.",
    ],
    steps: [
      "Abre PowerPoint a PDF y sube tu archivo .pptx.",
      "Espera a que se conviertan las diapositivas.",
      "Descarga el PDF y revisa cada página.",
    ],
    tips: [
      "Para imprimir sin gastar tanto, después usa Varias páginas por hoja y pon 2 o 4 diapositivas por hoja.",
      "Si la presentación es de Google Slides, descárgala como .pptx o directamente como PDF desde el menú Archivo.",
    ],
    sections: [
      {
        h: "Lo que debes saber",
        p: ["Pliego reproduce fondos, textos, formas e imágenes de cada diapositiva. Las animaciones y transiciones no pasan al PDF, y los diseños muy elaborados (efectos 3D, gráficos especiales, videos) pueden verse más simples. Para una presentación con mucho diseño, la opción Exportar a PDF de PowerPoint da el resultado más fiel."],
      },
    ],
    faqs: [
      ["¿Acepta archivos .ppt antiguos?", "Solo .pptx. Si tu archivo es .ppt, guárdalo como .pptx en PowerPoint o en Google Slides."],
      ["¿Los videos de la presentación se ven?", "No. El PDF no puede reproducir videos ni animaciones."],
    ],
  },
  {
    slug: "como-convertir-excel-a-pdf",
    tool: "excel-a-pdf",
    title: "Cómo convertir una hoja de Excel a PDF",
    description: "Convierte archivos de Excel (.xlsx, .xls o .csv) a PDF, en carta o A4, vertical u horizontal. Gratis y sin Office.",
    intro: [
      "Las hojas de cálculo son ideales para trabajar, pero no para enviar: el otro puede cambiar un valor sin querer, las columnas se ven distintas en cada programa y imprimirlas bien es un dolor de cabeza.",
      "Excel a PDF convierte cada hoja de tu libro en páginas de PDF, con sus tablas y bordes, en el tamaño y la orientación que elijas.",
    ],
    when: [
      "Vas a enviar un presupuesto, una cotización o un inventario y no quieres que lo modifiquen.",
      "Quieres imprimir una tabla grande.",
      "Te piden un reporte en PDF y lo tienes en Excel.",
      "Tienes un archivo CSV que quieres ver como tabla.",
    ],
    steps: [
      "Abre Excel a PDF y sube tu archivo .xlsx, .xls o .csv.",
      "Elige el tamaño de hoja: carta o A4.",
      "Elige la orientación: horizontal si la tabla tiene muchas columnas, vertical si tiene pocas.",
      "Haz clic en el botón para convertir y descarga el PDF.",
    ],
    tips: [
      "Borra las hojas que no quieres incluir antes de convertir: cada hoja del libro se convierte.",
      "Las tablas con muchas columnas se ven mejor en horizontal.",
      "Las fórmulas no pasan al PDF; se muestra el resultado de cada celda.",
    ],
    sections: [
      {
        h: "Lo que debes saber",
        p: ["Pliego convierte los datos y las tablas, pero no los gráficos de Excel ni el formato condicional avanzado. Cada página del PDF se dibuja como imagen, así que el texto no se puede seleccionar."],
      },
    ],
    faqs: [
      ["¿Se convierten todas las hojas?", "Sí. Cada hoja del libro aparece en el PDF con su nombre como título."],
      ["¿Puedo convertir un CSV?", "Sí. Pliego lo lee como una tabla."],
    ],
  },
  {
    slug: "como-convertir-html-a-pdf",
    tool: "html-a-pdf",
    title: "Cómo convertir un archivo o código HTML a PDF",
    description: "Convierte un archivo .html o código HTML pegado en un PDF tamaño carta o A4. Útil para facturas, reportes y plantillas.",
    intro: [
      "HTML es el lenguaje con el que se hacen las páginas web, y muchos sistemas generan reportes, facturas o correos en ese formato. Convertirlos a PDF sirve para archivarlos, imprimirlos o enviarlos como documento.",
      "HTML a PDF acepta un archivo .html o el código pegado directamente, y lo convierte en un PDF con el tamaño de hoja que elijas.",
    ],
    when: [
      "Un sistema te descargó un reporte o una factura en .html.",
      "Hiciste una plantilla en HTML y la quieres en PDF.",
      "Eres estudiante de programación y quieres guardar tu página como documento.",
    ],
    steps: [
      "Abre HTML a PDF.",
      "Sube un archivo .html o pega el código en el cuadro de texto.",
      "Elige carta o A4.",
      "Haz clic en el botón para convertir y descarga el PDF.",
    ],
    tips: [
      "Usa estilos dentro del mismo archivo (etiqueta style). Las hojas de estilo externas y las fuentes de internet pueden no cargarse.",
      "Las imágenes que dependen de rutas de tu computador no se ven. Usa imágenes incrustadas o enlaces completos.",
      "Por seguridad, Pliego no ejecuta los scripts del HTML.",
    ],
    faqs: [
      ["¿Puedo convertir una página web por su dirección?", "No. Para eso, abre la página en el navegador y usa la opción Imprimir > Guardar como PDF."],
      ["¿Funciona en el celular?", "Sí, aunque pegar código es más cómodo en el computador."],
    ],
  },
  {
    slug: "como-convertir-un-pdf-a-imagen-jpg-o-png",
    tool: "pdf-a-jpg",
    title: "Cómo convertir un PDF en imágenes JPG o PNG",
    description: "Convierte cada página de un PDF en una imagen JPG o PNG, en calidad normal, alta o para impresión. Gratis y sin subir el archivo.",
    intro: [
      "Hay sitios que solo aceptan imágenes: la foto de perfil de una plataforma, un estado de WhatsApp, una publicación en redes o un formulario que pide el documento como foto. También es útil para mostrar una página de un PDF dentro de una presentación.",
      "PDF a imagen convierte cada página en una imagen JPG o PNG y, si son varias, te las entrega juntas en un ZIP.",
    ],
    when: [
      "Una plataforma pide el documento como imagen y lo tienes en PDF.",
      "Quieres publicar una página de un PDF en redes sociales.",
      "Necesitas poner una página de un PDF dentro de Word o PowerPoint.",
      "Quieres enviar una sola página por WhatsApp como foto.",
    ],
    steps: [
      "Abre PDF a imagen y sube tu archivo.",
      "Elige el formato: JPG para fotos y archivos livianos, PNG para texto nítido y fondos transparentes.",
      "Elige la calidad: Normal para ver en pantalla, Alta para la mayoría de usos o Impresión si la vas a imprimir.",
      "Haz clic en Convertir a imagen y descarga.",
    ],
    tips: [
      "JPG pesa menos y es ideal para compartir. PNG pesa más pero deja el texto más nítido.",
      "Si solo necesitas una página, extráela primero con Extraer páginas para no generar imágenes de más.",
      "La calidad Impresión genera imágenes grandes; úsala solo si la vas a imprimir.",
    ],
    faqs: [
      ["¿Qué significan Normal, Alta e Impresión?", "Son 96, 150 y 300 puntos por pulgada. A más puntos, más nítida y más pesada la imagen."],
      ["¿Cómo abro el ZIP en el celular?", "Tócalo en la carpeta Descargas o en la app Archivos; el celular lo descomprime y te muestra las imágenes."],
    ],
  },
  {
    slug: "como-convertir-pdf-a-word-editable",
    tool: "pdf-a-word",
    title: "Cómo convertir un PDF a Word para editarlo",
    description: "Pasa un PDF a Word (.docx) editable o idéntico al original. Gratis, sin registro y sin subir tu documento a internet.",
    intro: [
      "Te mandaron un PDF y necesitas cambiarle algo: corregir un dato, actualizar una fecha o reutilizar el texto. Editar directamente un PDF es limitado, así que lo más práctico es pasarlo a Word.",
      "PDF a Word te da dos opciones: un Word editable con el texto en párrafos, o un Word que se ve idéntico al original, donde cada página es una imagen.",
    ],
    when: [
      "Necesitas modificar el texto de un documento que solo tienes en PDF.",
      "Quieres reutilizar el contenido de un PDF en otro documento.",
      "Te pidieron un archivo en Word y lo tienes en PDF.",
    ],
    steps: [
      "Abre PDF a Word y sube tu archivo.",
      "Elige el tipo de Word: Editable si vas a cambiar el texto, o Igual al original si solo necesitas que se vea igual en formato Word.",
      "Haz clic en el botón para convertir y descarga el .docx.",
      "Ábrelo en Word, Google Docs o WPS y revisa el formato.",
    ],
    tips: [
      "Si el PDF es escaneado, el modo editable no encuentra texto. Pásalo primero por OCR PDF.",
      "En el modo editable se conservan el texto y los párrafos, pero diseños complejos con columnas o tablas pueden necesitar ajustes.",
      "Si solo necesitas cambiar un dato pequeño, Editar PDF puede ser más rápido.",
    ],
    faqs: [
      ["¿Cuántas páginas puedo convertir?", "En el plan gratis, hasta 50 páginas por archivo, sin límite de usos."],
      ["¿Se conservan las imágenes?", "En el modo Igual al original, todo se ve como en el PDF. En el modo editable el objetivo es el texto."],
    ],
  },
  {
    slug: "como-convertir-pdf-a-powerpoint",
    tool: "pdf-a-powerpoint",
    title: "Cómo convertir un PDF a PowerPoint",
    description: "Convierte cada página de un PDF en una diapositiva de PowerPoint (.pptx) para presentarla o agregarle notas. Gratis.",
    intro: [
      "A veces el material de una exposición llega en PDF y necesitas presentarlo desde PowerPoint, agregarle diapositivas propias o mezclarlo con otra presentación.",
      "PDF a PowerPoint crea un archivo .pptx en el que cada página del PDF es una diapositiva, con el mismo tamaño y la misma apariencia.",
    ],
    when: [
      "Te pasaron unas diapositivas en PDF y las quieres proyectar desde PowerPoint.",
      "Quieres agregar tus propias diapositivas a un PDF.",
      "Necesitas combinar un PDF con otra presentación.",
    ],
    steps: [
      "Abre PDF a PowerPoint y sube tu archivo.",
      "Haz clic en el botón para convertir.",
      "Descarga el .pptx y ábrelo en PowerPoint, Google Slides o Keynote.",
    ],
    tips: [
      "Cada diapositiva queda como una imagen de la página. Puedes escribir encima, agregar notas del orador o insertar diapositivas nuevas entre ellas.",
      "Si necesitas cambiar el texto de una página, pasa el PDF primero a Word en modo editable y copia de ahí.",
    ],
    faqs: [
      ["¿Puedo editar el texto de las diapositivas?", "No directamente: cada diapositiva es una imagen de la página. Puedes agregar cuadros de texto encima."],
      ["¿Cuántas páginas puedo convertir?", "En el plan gratis, hasta 50 páginas por archivo, sin límite de usos."],
    ],
  },
  {
    slug: "como-pasar-una-tabla-de-pdf-a-excel",
    tool: "pdf-a-excel",
    title: "Cómo pasar una tabla de un PDF a Excel",
    description: "Saca las tablas de un PDF a una hoja de Excel para filtrarlas y hacer cuentas. Extractos, listas y reportes. Gratis.",
    intro: [
      "Copiar una tabla de un PDF y pegarla en Excel casi nunca funciona: todo cae en una sola columna. Pasa con extractos bancarios, listas de notas, inventarios y reportes que solo vienen en PDF.",
      "PDF a Excel detecta las filas y las columnas de cada página y las pasa a una hoja de cálculo, una hoja por página.",
    ],
    when: [
      "Quieres sumar o filtrar los movimientos de un extracto bancario.",
      "Te mandaron una lista de precios o un inventario en PDF.",
      "Necesitas hacer una conciliación o un análisis con datos que están en PDF.",
    ],
    steps: [
      "Abre PDF a Excel y sube tu archivo.",
      "Haz clic en el botón para convertir.",
      "Descarga el .xlsx y ábrelo en Excel o Google Sheets.",
      "Revisa que cada dato quedó en su columna y corrige lo que haga falta.",
    ],
    tips: [
      "Funciona mejor con PDF generados por un sistema, como extractos y reportes. Con tablas escaneadas, pasa primero el PDF por OCR PDF.",
      "Revisa los números con decimales y separadores de miles: según el formato regional de tu Excel, pueden necesitar ajuste.",
      "Si solo te interesa una tabla, extrae primero esa página con Extraer páginas.",
    ],
    faqs: [
      ["¿Funciona con cualquier tabla?", "Funciona bien con tablas ordenadas en filas y columnas. Las tablas con celdas combinadas o texto en varias líneas pueden necesitar ajustes."],
      ["¿Cuántas páginas puedo convertir?", "En el plan gratis, hasta 50 páginas por archivo, sin límite de usos."],
    ],
  },
  {
    slug: "que-es-pdf-a-y-como-convertir-un-pdf",
    tool: "pdf-a-pdfa",
    title: "Qué es un PDF/A y cómo convertir un PDF a PDF/A",
    description: "Qué es el formato PDF/A, cuándo lo piden y cómo convertir tu PDF a PDF/A-2b o PDF/A-1b gratis, sin subirlo a internet.",
    intro: [
      "PDF/A es una versión del PDF hecha para guardar documentos a largo plazo. Garantiza que el archivo se vea igual dentro de muchos años, porque guarda dentro de él todo lo que necesita para mostrarse, como las fuentes y los perfiles de color, y no depende de nada externo.",
      "Algunas entidades, juzgados, universidades y sistemas de gestión documental piden los archivos en PDF/A. PDF a PDF/A convierte tu documento a ese formato dentro de tu navegador.",
    ],
    when: [
      "Una plataforma o una entidad te pide expresamente un archivo PDF/A.",
      "Vas a archivar documentos importantes y quieres que se puedan abrir en el futuro.",
      "Tu trabajo de grado o tesis debe entregarse en PDF/A para el repositorio de la universidad.",
    ],
    steps: [
      "Abre PDF a PDF/A y sube tu archivo.",
      "Elige la versión: PDF/A-2b, recomendada para la mayoría de casos, o PDF/A-1b si te piden esa versión.",
      "Haz clic en el botón para convertir. La primera vez tarda un poco más porque descarga el motor de conversión.",
      "Descarga el archivo.",
    ],
    tips: [
      "Si la entidad te dice qué versión piden, usa esa. Si no dice nada, PDF/A-2b es la más aceptada.",
      "Los PDF con contraseña no pueden ser PDF/A. Quítala primero con Desbloquear PDF.",
      "Si la entidad tiene un validador propio, pasa tu archivo por él antes de entregarlo.",
    ],
    faqs: [
      ["¿Qué significa la b?", "Indica el nivel básico de cumplimiento: garantiza que el documento se vea igual en el futuro. Es el nivel que suelen pedir."],
      ["¿Se ve diferente después de convertirlo?", "No debería. El objetivo del PDF/A es justamente conservar la apariencia."],
    ],
  },
  {
    slug: "como-convertir-pdf-a-markdown-para-ia-o-notas",
    tool: "pdf-a-markdown",
    title: "Cómo convertir un PDF a Markdown para usarlo con IA o en tus notas",
    description: "Convierte un PDF en texto Markdown con títulos y listas, listo para ChatGPT, Claude, Notion u Obsidian. Hasta 50 páginas gratis.",
    intro: [
      "Markdown es un formato de texto simple que usa símbolos para marcar títulos, listas y negrillas. Lo usan aplicaciones de notas como Notion y Obsidian, programadores y asistentes de inteligencia artificial, porque es fácil de leer para personas y para máquinas.",
      "PDF a Markdown saca el texto de tu PDF y detecta los títulos por el tamaño de la letra, para que el resultado conserve la estructura del documento.",
    ],
    when: [
      "Quieres pegar el contenido de un PDF en un asistente de IA sin que se desordene.",
      "Tomas apuntes en Notion u Obsidian y quieres traer el contenido de un PDF.",
      "Vas a reutilizar el texto de un documento en una página web o en un repositorio.",
    ],
    steps: [
      "Abre PDF a Markdown y sube tu archivo.",
      "Haz clic en Convertir a Markdown.",
      "Copia el resultado o descarga el archivo .md.",
      "Pégalo en tu aplicación de notas o en el asistente de IA.",
    ],
    tips: [
      "Funciona con PDF que tienen texto. Si el PDF es escaneado, pásalo primero por OCR PDF.",
      "Revisa los títulos: si el documento usa tamaños de letra poco comunes, puede que algún título salga como texto normal.",
    ],
    faqs: [
      ["¿Cuántas páginas puedo convertir?", "En el plan gratis, hasta 50 páginas por archivo, sin límite de usos."],
      ["¿Se conservan las imágenes y tablas?", "El resultado es texto. Las imágenes no se incluyen y las tablas quedan como texto separado."],
    ],
  },
  {
    slug: "como-sacar-todo-el-texto-de-un-pdf",
    tool: "extraer-texto",
    title: "Cómo sacar todo el texto de un PDF a un archivo .txt",
    description: "Extrae todo el texto de un PDF en un archivo .txt para copiarlo, buscarlo o reutilizarlo. Gratis y sin subir el documento.",
    intro: [
      "Copiar el texto de un PDF largo página por página es lento y muchas veces trae saltos de línea raros. Extraer texto saca todo el texto del documento de una vez y lo guarda en un archivo .txt que se abre en cualquier dispositivo.",
      "Es la opción más simple cuando solo te interesa el texto, sin formato ni imágenes.",
    ],
    when: [
      "Necesitas citar o copiar fragmentos de un documento largo.",
      "Quieres buscar información dentro de varios documentos.",
      "Vas a traducir o analizar el texto en otro programa.",
      "Quieres leer el contenido en un dispositivo que no abre PDF.",
    ],
    steps: [
      "Abre Extraer texto y sube tu PDF.",
      "Haz clic en Extraer texto.",
      "Descarga el archivo .txt y ábrelo con el Bloc de notas, Notas o cualquier editor.",
    ],
    tips: [
      "Si el PDF es escaneado, no tiene texto que extraer y Pliego te lo avisará. En ese caso usa OCR PDF con la opción Solo texto (.txt).",
      "Si quieres conservar los títulos, usa PDF a Markdown.",
    ],
    faqs: [
      ["¿Se separan las páginas?", "Sí. El texto de cada página aparece en orden, separado del de la siguiente."],
      ["¿Funciona con documentos en otros idiomas?", "Sí. Extrae el texto tal como está en el PDF, en cualquier idioma."],
    ],
  },
];
