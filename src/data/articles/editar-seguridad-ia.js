// Guías largas de las herramientas para editar, seguridad e inteligencia artificial.
export default [
  {
    slug: "como-rotar-un-pdf-y-guardarlo-girado",
    tool: "rotar-pdf",
    title: "Cómo girar un PDF y guardarlo así",
    description: "Gira todas o algunas páginas de un PDF 90 o 180 grados y guárdalo girado. Gratis, desde el celular o el computador.",
    intro: [
      "Girar un PDF en el visor solo sirve mientras lo estás viendo: al cerrarlo o enviarlo, vuelve a quedar de lado. Es un problema común con escaneos hechos con el celular o con documentos que mezclan hojas verticales y horizontales.",
      "Rotar PDF gira las páginas de verdad y guarda el archivo así, para que cualquiera que lo abra lo vea derecho.",
    ],
    when: [
      "Escaneaste un documento y algunas páginas quedaron de lado o de cabeza.",
      "Una plataforma te rechazó el archivo por tener páginas giradas.",
      "El documento tiene tablas horizontales que quedaron verticales.",
    ],
    steps: [
      "Abre Rotar PDF y sube tu archivo.",
      "Elige cuánto girar: 90° a la derecha, 180° o 90° a la izquierda.",
      "Si solo quieres girar algunas páginas, escríbelas, por ejemplo 2, 5-6. Si dejas el campo vacío, se giran todas.",
      "Haz clic en Rotar PDF y descarga el resultado.",
    ],
    tips: [
      "Si hay páginas que necesitan giros distintos, hazlo en dos pasos o usa Ordenar PDF, donde giras cada página viéndola.",
      "Una página de cabeza se arregla con 180°.",
      "El Revisor antes de subir te avisa si tu PDF tiene páginas giradas.",
    ],
    faqs: [
      ["¿Se pierde calidad al girar?", "No. El giro se guarda como una propiedad de la página, sin volver a procesar el contenido."],
      ["¿El texto sigue siendo seleccionable?", "Sí. Nada del contenido cambia, solo la orientación."],
    ],
  },
  {
    slug: "como-numerar-las-paginas-de-un-pdf",
    tool: "numeros-de-pagina",
    title: "Cómo ponerle números de página a un PDF",
    description: "Numera las páginas de un PDF en la posición que quieras, con formato 1, 2, 3 o 1 de 10, y empezando en el número que elijas.",
    intro: [
      "Los números de página ayudan a que quien recibe un documento sepa si está completo y pueda ubicarse en él. Muchas convocatorias y trámites los piden, sobre todo cuando entregas varios soportes en un solo archivo.",
      "Números de página agrega la numeración a cada página del PDF, en la esquina o el centro que elijas, sin tener que volver al documento original.",
    ],
    when: [
      "Una convocatoria pide los documentos foliados o numerados.",
      "Uniste varios PDF y quieres que la numeración sea continua.",
      "Vas a imprimir un documento largo y quieres que no se desordene.",
      "Tu trabajo de la universidad debe llevar las páginas numeradas.",
    ],
    steps: [
      "Abre Números de página y sube tu PDF.",
      "Elige la posición: abajo o arriba, a la izquierda, al centro o a la derecha.",
      "Elige el formato: 1, 2, 3 o 1 de 10.",
      "Si no quieres empezar en 1, cambia el número de inicio.",
      "Haz clic en el botón para numerar y descarga el PDF.",
    ],
    tips: [
      "Si vas a unir varios documentos, únelos primero y numera al final.",
      "Si tu documento tiene portada y no quieres numerarla, numera todo empezando en 0, o separa la portada, numera el resto y luego únelos.",
      "Si necesitas también un texto fijo, como el nombre del documento, usa Encabezado y pie.",
    ],
    faqs: [
      ["¿Qué es foliar?", "Es numerar las hojas de un expediente. Para trámites digitales, numerar las páginas del PDF suele ser suficiente; si te piden un formato especial, sigue sus indicaciones."],
      ["¿Tapa el contenido?", "El número va en el margen. Si tu documento no tiene margen, prueba otra posición."],
    ],
  },
  {
    slug: "como-poner-marca-de-agua-a-un-pdf",
    tool: "marca-de-agua",
    title: "Cómo ponerle una marca de agua a un PDF",
    description: "Agrega un texto como SOLO PARA TRÁMITE o CONFIDENCIAL sobre cada página de un PDF, con la transparencia y el tamaño que quieras.",
    intro: [
      "Una marca de agua es un texto grande y semitransparente sobre cada página. Sirve para dejar claro para qué es un documento o de quién es, y hace más difícil que alguien lo reutilice con otro fin.",
      "Es una buena costumbre al enviar copias de documentos personales: si mandas la copia de tu cédula para abrir una cuenta, con la marca Solo para apertura de cuenta en Banco X nadie la puede usar para otra cosa sin que se note.",
    ],
    when: [
      "Envías copia de tu cédula u otros documentos personales.",
      "Compartes un borrador y quieres que se sepa que no es la versión final.",
      "Envías un documento confidencial o una muestra de tu trabajo.",
      "Quieres marcar tus diseños o fotos antes de mostrarlos a un cliente.",
    ],
    steps: [
      "Abre Marca de agua y sube tu PDF.",
      "Escribe el texto, por ejemplo SOLO PARA TRÁMITE o BORRADOR.",
      "Ajusta la transparencia: entre más baja, menos tapa el contenido.",
      "Ajusta el tamaño del texto.",
      "Haz clic en el botón para aplicarla y descarga el PDF.",
    ],
    tips: [
      "Para documentos de identidad, escribe para qué y para quién es la copia, y la fecha. Por ejemplo: Solo para afiliación EPS, noviembre 2026.",
      "Una transparencia entre 15 % y 30 % deja leer el documento y la marca a la vez.",
      "Revisa que la marca no tape datos que deben leerse, como números de documento.",
    ],
    faqs: [
      ["¿Se puede quitar la marca después?", "Con programas de edición avanzados es posible. Para que sea más difícil, después puedes comprimir el PDF: así la marca queda fundida con la página."],
      ["¿Puedo poner una imagen o un logo?", "Esta herramienta pone texto. Para poner un logo, usa Editar PDF y agrega una imagen."],
    ],
  },
  {
    slug: "como-recortar-los-margenes-de-un-pdf",
    tool: "recortar-pdf",
    title: "Cómo recortar los márgenes de un PDF",
    description: "Quita márgenes blancos o bordes de un escaneo recortando las páginas de un PDF en milímetros. Gratis y sin subir el archivo.",
    intro: [
      "Algunos PDF tienen márgenes enormes que hacen que el texto se vea pequeño en el celular, o escaneos con bordes negros y pedazos de la mesa. Recortar las páginas deja solo lo importante.",
      "Recortar PDF te deja indicar cuántos milímetros quitar arriba, abajo, a la izquierda y a la derecha de cada página.",
    ],
    when: [
      "Vas a leer un PDF en el celular y los márgenes hacen que la letra se vea pequeña.",
      "Un escaneo quedó con bordes oscuros o con partes de la mesa.",
      "Quieres quitar un encabezado o pie que no necesitas mostrar.",
    ],
    steps: [
      "Abre Recortar PDF y sube tu archivo.",
      "Escribe cuántos milímetros quieres quitar en cada lado: arriba, abajo, izquierda y derecha.",
      "Haz clic en el botón para recortar y descarga el PDF.",
      "Ábrelo y revisa que no hayas cortado contenido. Si pasó, vuelve a intentar con menos milímetros.",
    ],
    tips: [
      "Como referencia, una hoja carta mide 216 × 279 mm. Un margen normal de Word es de unos 25 mm.",
      "Empieza con poco, por ejemplo 10 mm por lado, y aumenta si hace falta.",
      "El recorte oculta lo que queda fuera, pero esa parte sigue dentro del archivo. Si quieres eliminar información sensible, usa Censurar PDF.",
    ],
    faqs: [
      ["¿Se recortan todas las páginas igual?", "Sí. El mismo recorte se aplica a todas las páginas."],
      ["¿Se pierde calidad?", "No. Solo cambia el área visible de la página."],
    ],
  },
  {
    slug: "como-editar-un-pdf-gratis-agregar-texto-e-imagenes",
    tool: "editar-pdf",
    title: "Cómo editar un PDF gratis: agregar texto, imágenes y recuadros",
    description: "Escribe sobre un PDF, agrega imágenes o logos y tapa partes con recuadros, desde el celular o el computador. Sin registro.",
    intro: [
      "No siempre necesitas convertir un PDF a Word para cambiarle algo. Si tienes que llenar un formato impreso, agregar una fecha, poner un logo o tapar un dato con un recuadro, lo puedes hacer directamente sobre el PDF.",
      "Editar PDF te muestra cada página y te deja agregar textos, imágenes y recuadros, moverlos y cambiarles el tamaño, como en una presentación.",
    ],
    when: [
      "Tienes que llenar un formato en PDF que no tiene campos para escribir.",
      "Quieres agregar una fecha, una nota o un dato que falta.",
      "Necesitas poner tu logo en una cotización o un documento.",
      "Quieres corregir un dato poniendo un recuadro blanco encima y escribiendo el valor correcto.",
    ],
    steps: [
      "Abre Editar PDF y sube tu archivo.",
      "Elige la página que vas a editar.",
      "Agrega un texto, una imagen o un recuadro con los botones de la herramienta.",
      "Arrástralo a su lugar y ajusta el tamaño. Para los textos puedes cambiar el tamaño de letra y el color.",
      "Repite en las demás páginas que necesites.",
      "Guarda y descarga el PDF.",
    ],
    tips: [
      "Para corregir un dato, pon un recuadro blanco sobre el texto viejo y encima un texto con el valor nuevo.",
      "Un recuadro blanco tapa lo que se ve, pero no borra el texto que hay debajo. Si es un dato sensible, usa Censurar PDF.",
      "Si el formato tiene campos para llenar, Formularios PDF es más rápido.",
      "Si lo que necesitas es firmar, usa Firmar PDF.",
    ],
    faqs: [
      ["¿Puedo cambiar el texto que ya tiene el PDF?", "No directamente. Puedes taparlo con un recuadro y escribir encima, o pasar el PDF a Word para editarlo completo."],
      ["¿Funciona en el celular?", "Sí. Puedes mover y ajustar los elementos con el dedo."],
    ],
  },
  {
    slug: "como-llenar-un-formulario-pdf",
    tool: "formularios-pdf",
    title: "Cómo llenar un formulario PDF sin imprimirlo",
    description: "Llena los campos de un formulario PDF (texto, casillas y listas) desde el celular o el computador, y guárdalo listo para enviar.",
    intro: [
      "Muchos formatos oficiales vienen como formularios PDF con campos para escribir: solicitudes, formatos de afiliación, formularios de bancos. En algunos visores no se pueden llenar o se pierde lo que escribiste al guardar.",
      "Formularios PDF detecta los campos del documento y te los muestra como un formulario normal. Llenas cada dato, y si quieres, aplanas el resultado para que ya no se pueda modificar.",
    ],
    when: [
      "Te mandaron un formulario PDF para llenar y devolver.",
      "Estás en el celular y el visor no te deja escribir en los campos.",
      "Quieres que nadie cambie lo que llenaste después de enviarlo.",
    ],
    steps: [
      "Abre Formularios PDF y sube el formulario.",
      "Pliego te muestra la lista de campos que encontró: cuadros de texto, casillas de verificación y listas para elegir.",
      "Llena cada campo.",
      "Marca Aplanar si quieres que los datos queden fijos y no se puedan editar.",
      "Descarga el PDF lleno.",
    ],
    tips: [
      "Si Pliego dice que no encontró campos, el PDF no es un formulario rellenable. En ese caso usa Editar PDF para escribir encima.",
      "Aplana el formulario si lo vas a enviar a una entidad: así se ve igual en cualquier visor.",
      "Si además lo tienes que firmar, llénalo primero y luego usa Firmar PDF.",
    ],
    faqs: [
      ["¿Qué significa aplanar?", "Convertir los campos en texto normal de la página. Se ve igual, pero ya no se puede cambiar."],
      ["¿Mis datos se guardan?", "No. Todo se procesa en tu dispositivo."],
    ],
  },
  {
    slug: "como-agregar-encabezado-y-pie-de-pagina-a-un-pdf",
    tool: "encabezado-pie",
    title: "Cómo agregar encabezado y pie de página a un PDF",
    description: "Escribe un texto arriba o abajo de cada página de un PDF, con número de página, total de páginas y fecha automáticos.",
    intro: [
      "El encabezado y el pie de página son los textos que se repiten en todas las páginas de un documento: el nombre de la institución, el título del trabajo, el número de página o la fecha. Ponerlos en el documento original no siempre es posible, sobre todo si ya está en PDF.",
      "Encabezado y pie agrega esos textos a cada página del PDF. Puedes usar códigos que se reemplazan solos con el número de página, el total de páginas y la fecha.",
    ],
    when: [
      "Tu trabajo de la universidad debe llevar el nombre de la institución en todas las páginas.",
      "Vas a enviar un informe y quieres que cada página diga de qué empresa es.",
      "Uniste varios documentos y quieres que tengan un pie común.",
    ],
    steps: [
      "Abre Encabezado y pie y sube tu PDF.",
      "Escribe el encabezado, por ejemplo Universidad del Magdalena · Informe final.",
      "Escribe el pie, por ejemplo Página {n} de {total}.",
      "Elige la alineación (izquierda, centro o derecha) y el tamaño de letra.",
      "Haz clic en el botón para aplicarlo y descarga el PDF.",
    ],
    sections: [
      {
        h: "Códigos automáticos",
        list: ["{n} se reemplaza por el número de la página.", "{total} se reemplaza por el total de páginas.", "{fecha} se reemplaza por la fecha de hoy."],
      },
    ],
    tips: [
      "Puedes dejar vacío el encabezado o el pie si solo necesitas uno de los dos.",
      "Usa una letra pequeña, entre 8 y 10, para que no compita con el contenido.",
      "Si solo necesitas la numeración, Números de página es más rápido.",
    ],
    faqs: [
      ["¿Tapa el contenido de la página?", "El texto va en el margen superior e inferior. Si el documento no tiene márgenes, puede quedar encima del contenido."],
      ["¿Puedo poner un logo?", "Esta herramienta agrega texto. Para logos, usa Editar PDF."],
    ],
  },
  {
    slug: "como-ponerle-contrasena-a-un-pdf",
    tool: "proteger-pdf",
    title: "Cómo ponerle contraseña a un PDF",
    description: "Protege un PDF con contraseña y cifrado AES-256 para que solo lo abra quien la conozca. Gratis y sin subir el archivo.",
    intro: [
      "Si vas a enviar un documento con información sensible, como extractos, historias clínicas, contratos o documentos de identidad, una contraseña evita que cualquiera que lo reciba por error lo pueda abrir.",
      "Proteger PDF cifra el archivo con AES-256, uno de los métodos de cifrado más seguros que existen. Sin la contraseña, el contenido no se puede leer.",
    ],
    when: [
      "Envías por correo documentos con datos personales o financieros.",
      "Guardas documentos importantes en la nube o en una memoria USB.",
      "Compartes un archivo por un canal que no controlas, como un grupo de WhatsApp.",
    ],
    steps: [
      "Abre Proteger PDF y sube tu archivo.",
      "Escribe una contraseña de al menos 4 caracteres. Entre más larga, más segura.",
      "Haz clic en el botón para protegerlo y descarga el PDF.",
      "Envía la contraseña por un canal distinto al del archivo.",
    ],
    tips: [
      "Nunca envíes la contraseña en el mismo correo que el PDF. Si el archivo va por correo, manda la contraseña por mensaje o dila por llamada.",
      "Guarda la contraseña en un lugar seguro. Si la olvidas, no hay forma de recuperar el archivo.",
      "No subas PDF con contraseña a plataformas de trámites: casi nunca los aceptan.",
    ],
    faqs: [
      ["¿Qué tan seguro es?", "El cifrado AES-256 es el estándar más fuerte que soportan los PDF. La seguridad real depende de que la contraseña sea larga y difícil de adivinar."],
      ["¿Pliego guarda mi contraseña?", "No. La contraseña se usa dentro de tu navegador para cifrar el archivo y no se guarda ni se envía a ningún lado."],
    ],
  },
  {
    slug: "como-quitar-la-contrasena-de-un-pdf",
    tool: "desbloquear-pdf",
    title: "Cómo quitar la contraseña de un PDF si la conoces",
    description: "Quita la contraseña de un PDF del que conoces la clave, como extractos y certificados, para abrirlo sin escribirla cada vez.",
    intro: [
      "Los bancos, las EPS y muchas empresas envían los extractos y certificados con contraseña, que suele ser tu número de cédula. Es una buena medida de seguridad, pero se vuelve un problema cuando necesitas subir ese documento a una plataforma, unirlo con otros o imprimirlo en una papelería.",
      "Desbloquear PDF crea una copia del documento sin contraseña. Solo funciona si conoces la contraseña: no adivina claves.",
    ],
    when: [
      "Tienes que subir un extracto bancario a una plataforma y no acepta archivos con contraseña.",
      "Quieres unir un certificado protegido con otros documentos.",
      "Vas a imprimir el documento en una papelería y no quieres darles tu contraseña.",
    ],
    steps: [
      "Abre Desbloquear PDF y sube el archivo protegido.",
      "Escribe la contraseña actual del PDF.",
      "Haz clic en el botón para desbloquear y descarga la copia sin contraseña.",
    ],
    tips: [
      "Si no sabes la contraseña, revisa el correo con el que te llegó el documento: casi siempre explica cuál es, por ejemplo tu cédula sin puntos.",
      "Guarda la copia desbloqueada solo mientras la necesites. Si contiene datos sensibles, bórrala después.",
    ],
    faqs: [
      ["¿Puede quitar una contraseña que no conozco?", "No. Pliego solo desbloquea PDF de los que conoces la contraseña. Romper la protección de documentos ajenos no es legal ni es el objetivo de esta herramienta."],
      ["¿El original sigue protegido?", "Sí. Pliego crea una copia nueva; el original no cambia."],
    ],
  },
  {
    slug: "como-firmar-un-pdf-desde-el-celular",
    tool: "firmar-pdf",
    title: "Cómo firmar un PDF desde el celular sin imprimirlo",
    description: "Dibuja tu firma con el dedo, escríbela o súbela en foto y ponla en el lugar exacto de tu PDF. Gratis y sin registrarte.",
    intro: [
      "Imprimir un documento solo para firmarlo y volverlo a escanear es una pérdida de tiempo y de papel. Hoy puedes firmar un contrato, una carta o una cuenta de cobro directamente en el PDF.",
      "Firmar PDF te deja crear tu firma de tres formas: dibujándola con el dedo o el mouse, escribiendo tu nombre con letra de firma o subiendo una foto de tu firma en papel. Luego la pones en el lugar exacto del documento.",
    ],
    when: [
      "Te mandaron un contrato o un documento para devolver firmado.",
      "Necesitas firmar una cuenta de cobro o una carta.",
      "Tienes que firmar un formato y no tienes impresora cerca.",
    ],
    steps: [
      "Abre Firmar PDF y sube tu documento.",
      "Crea tu firma: dibújala, escríbela o sube una foto de tu firma sobre papel blanco.",
      "Elige el color: negro o azul.",
      "Agrega la firma a la página y arrástrala hasta su lugar. Ajusta el tamaño desde la esquina.",
      "Si hay que firmar varias páginas, repite en cada una.",
      "Descarga el PDF firmado.",
    ],
    sections: [
      {
        h: "¿Tiene validez una firma así?",
        p: [
          "Una firma dibujada o escaneada sobre un PDF es una firma electrónica simple. En Colombia, la Ley 527 de 1999 reconoce los documentos electrónicos y las firmas electrónicas, y muchas empresas y entidades aceptan este tipo de firma para documentos del día a día.",
          "Para trámites que exigen firma digital certificada, como algunas actuaciones ante entidades o contratos de alto valor, se necesita un certificado expedido por una entidad de certificación. Si tienes dudas, pregunta a quien recibe el documento qué tipo de firma acepta.",
        ],
      },
    ],
    tips: [
      "Para subir una foto de tu firma, fírmate en una hoja blanca con esfero negro y toma la foto con buena luz.",
      "Usa azul si quieren distinguir fácilmente la firma del texto impreso.",
      "Después de firmar, puedes proteger el PDF con contraseña o enviarlo tal cual.",
    ],
    faqs: [
      ["¿Pliego guarda mi firma?", "No. Tu firma se crea y se usa dentro de tu navegador; no se envía a ningún servidor."],
      ["¿Puedo firmar en varias páginas?", "Sí. Puedes poner la firma en todas las páginas que necesites."],
    ],
  },
  {
    slug: "como-tachar-datos-de-un-pdf-de-forma-segura",
    tool: "censurar-pdf",
    title: "Cómo tachar datos de un PDF de forma segura",
    description: "Oculta números de cédula, cuentas o nombres en un PDF de verdad, no solo encima. Busca el texto o dibuja recuadros. Gratis.",
    intro: [
      "Poner un recuadro negro encima de un dato con un editor común no lo borra: el texto sigue debajo y cualquiera lo puede copiar o descubrir quitando el recuadro. Muchos documentos públicos han filtrado datos personales por ese error.",
      "Censurar PDF borra de verdad la información. Buscas el dato o dibujas recuadros sobre lo que quieres ocultar, y Pliego reconstruye esas páginas para que el contenido tapado ya no exista en el archivo.",
    ],
    when: [
      "Vas a compartir un extracto y quieres ocultar números de cuenta o saldos.",
      "Publicas un documento que tiene cédulas, direcciones o teléfonos de otras personas.",
      "Envías una factura o un contrato como ejemplo y quieres ocultar los datos del cliente.",
    ],
    steps: [
      "Abre Censurar PDF y sube tu documento.",
      "Escribe el texto que quieres ocultar, por ejemplo un número de cédula, y búscalo. Pliego pone un recuadro en cada lugar donde aparece.",
      "Si quieres tapar algo más, como una firma o una foto, dibuja recuadros encima.",
      "Revisa las marcas y aplica la censura.",
      "Descarga el PDF y comprueba que los datos ya no se pueden copiar ni buscar.",
    ],
    tips: [
      "Busca el dato con distintos formatos: con puntos, sin puntos y con espacios, porque puede aparecer escrito de varias formas.",
      "Revisa también los metadatos con Quitar metadatos: a veces el nombre del autor está ahí.",
      "Las páginas censuradas se convierten en imagen, así que su texto ya no se podrá seleccionar. Las demás páginas quedan igual.",
    ],
    faqs: [
      ["¿Por qué un recuadro negro no es suficiente?", "Porque en un PDF el recuadro y el texto son elementos separados. El texto sigue en el archivo y se puede copiar o leer con otras herramientas."],
      ["¿Se puede deshacer la censura?", "No en el archivo nuevo, y esa es la idea. Guarda el original por si lo necesitas."],
    ],
  },
  {
    slug: "como-comparar-dos-pdf-y-ver-que-cambio",
    tool: "comparar-pdf",
    title: "Cómo comparar dos PDF y ver qué cambió",
    description: "Compara dos versiones de un PDF y mira qué texto se agregó o se quitó. Ideal para contratos y documentos que te devuelven corregidos.",
    intro: [
      "Te devuelven un contrato con cambios y te dicen que solo ajustaron una cláusula. ¿Cómo estar seguro de que no cambiaron nada más? Leer dos documentos largos lado a lado es lento y es fácil que se te pase algo.",
      "Comparar PDF analiza el texto de las dos versiones y te muestra lo que se agregó y lo que se quitó, resaltado con colores.",
    ],
    when: [
      "Te devolvieron un contrato o un acuerdo corregido.",
      "Tienes dos versiones de un documento y no sabes cuál es la final.",
      "Quieres revisar los cambios que hicieron a tu trabajo o informe.",
    ],
    steps: [
      "Abre Comparar PDF.",
      "Sube la versión anterior y la versión nueva.",
      "Haz clic en el botón para comparar.",
      "Revisa las diferencias: lo agregado y lo eliminado aparecen resaltados en colores distintos.",
    ],
    tips: [
      "Compara siempre contra la última versión que tú aprobaste.",
      "Presta atención especial a cifras, fechas, plazos y palabras como no, siempre o únicamente: un cambio pequeño puede cambiar mucho el sentido.",
      "Funciona con PDF que tienen texto. Si alguno es escaneado, pásalo primero por OCR PDF.",
    ],
    faqs: [
      ["¿Compara imágenes y formato?", "No. Compara el texto. Cambios de diseño, colores o imágenes no aparecen."],
      ["¿Mis documentos se suben?", "No. La comparación se hace dentro de tu navegador."],
    ],
  },
  {
    slug: "como-resumir-un-pdf-con-inteligencia-artificial",
    tool: "resumir-pdf",
    title: "Cómo resumir un PDF con inteligencia artificial gratis",
    description: "Obtén las ideas clave de un PDF en segundos con IA: lecturas, informes o documentos largos. Gratis hasta 20 páginas por archivo.",
    intro: [
      "Una lectura de 20 páginas para mañana, un informe que tienes que presentar o un documento largo que solo necesitas entender por encima. Resumir con IA lee el texto de tu PDF y te entrega las ideas principales en un resumen claro.",
      "Puedes copiar el resumen o descargarlo en Word para seguir trabajando en él.",
    ],
    when: [
      "Necesitas entender rápido de qué trata una lectura antes de leerla completa.",
      "Vas a preparar una exposición o un resumen para clase.",
      "Tienes que revisar un informe o una norma larga.",
    ],
    steps: [
      "Abre Resumir con IA y sube tu PDF.",
      "Haz clic en el botón para resumir y espera unos segundos.",
      "Lee el resumen y cópialo o descárgalo en Word.",
    ],
    sections: [
      {
        h: "Cómo funciona y qué tan confiable es",
        p: [
          "Pliego saca el texto del PDF en tu dispositivo y solo ese texto se envía a un modelo de inteligencia artificial de Cloudflare para hacer el resumen. El archivo no se sube y el texto no se guarda.",
          "La IA es muy útil para tener una idea general, pero puede equivocarse u omitir detalles importantes. Para un examen, un trabajo o una decisión importante, usa el resumen como guía y verifica los datos en el documento original.",
        ],
      },
    ],
    tips: [
      "Funciona con PDF que tienen texto. Si tu PDF es escaneado, pásalo primero por OCR PDF.",
      "Si el documento es muy largo, divídelo por capítulos y resume cada uno.",
      "Después de resumir, usa Pregúntale al PDF para profundizar en lo que no te quedó claro.",
    ],
    faqs: [
      ["¿Cuántas páginas puedo resumir?", "En el plan gratis, hasta 20 páginas por archivo, sin límite de usos."],
      ["¿Puedo usar el resumen en mis trabajos?", "Sirve como apoyo para estudiar. Si lo entregas, revisa lo que piden tus profesores sobre el uso de IA y cita el documento original."],
    ],
  },
  {
    slug: "como-traducir-un-pdf-de-ingles-a-espanol",
    tool: "traducir-pdf",
    title: "Cómo traducir un PDF de inglés a español (y a otros idiomas)",
    description: "Traduce el texto de un PDF a español, inglés, portugués, francés, italiano o alemán con IA, y descárgalo en Word. Gratis.",
    intro: [
      "Muchas lecturas universitarias, manuales y artículos científicos están en inglés. Traducir párrafo por párrafo en un traductor es lento y se pierde el orden del documento.",
      "Traducir PDF lee el texto de tu documento y lo traduce completo con inteligencia artificial. Puedes leerlo en pantalla o descargarlo en Word.",
    ],
    when: [
      "Tienes una lectura en inglés para la universidad.",
      "Necesitas entender un manual o un documento técnico en otro idioma.",
      "Quieres enviar un documento a alguien que habla otro idioma.",
    ],
    steps: [
      "Abre Traducir PDF y sube tu archivo.",
      "Elige el idioma al que quieres traducir: español, inglés, portugués, francés, italiano o alemán.",
      "Haz clic en el botón para traducir y espera. Los documentos largos tardan un poco más.",
      "Lee la traducción y descárgala en Word si la necesitas.",
    ],
    tips: [
      "La traducción conserva el texto, pero no el diseño original: tablas e imágenes no se traducen.",
      "Para documentos oficiales que vas a presentar ante una entidad, normalmente se exige una traducción oficial hecha por un traductor certificado.",
      "Si el PDF es escaneado, pásalo primero por OCR PDF.",
    ],
    faqs: [
      ["¿Qué tan buena es la traducción?", "Es buena para entender el contenido, pero puede tener errores en términos técnicos o frases complejas. Revisa las partes importantes."],
      ["¿Cuántas páginas puedo traducir?", "En el plan gratis, hasta 20 páginas por archivo, sin límite de usos."],
    ],
  },
  {
    slug: "como-hacerle-preguntas-a-un-pdf-con-ia",
    tool: "chat-pdf",
    title: "Cómo hacerle preguntas a un PDF con IA",
    description: "Pregúntale a tu PDF lo que necesitas saber y recibe respuestas basadas en el documento. Contratos, lecturas y manuales. Gratis.",
    intro: [
      "A veces no necesitas leer todo el documento, sino encontrar una respuesta: cuál es el plazo de un contrato, qué dice el reglamento sobre las faltas o cuáles son los requisitos de una convocatoria.",
      "Pregúntale al PDF te deja escribir preguntas sobre tu documento, como en un chat. La IA busca las partes relevantes del texto y responde basándose en ellas.",
    ],
    when: [
      "Quieres encontrar un dato específico en un documento largo.",
      "Estás estudiando y quieres comprobar si entendiste bien una lectura.",
      "Revisas un contrato, un reglamento o una convocatoria y tienes dudas puntuales.",
    ],
    steps: [
      "Abre Pregúntale al PDF y sube tu documento.",
      "Escribe tu pregunta, por ejemplo ¿Cuál es la fecha límite de inscripción?",
      "Lee la respuesta y haz más preguntas si las tienes.",
    ],
    tips: [
      "Haz preguntas concretas. ¿Cuántos días de vacaciones da el contrato? funciona mejor que ¿Qué dice el contrato?",
      "Para datos importantes, busca la respuesta en el documento original y confírmala. La IA puede equivocarse.",
      "Si el PDF es escaneado, pásalo primero por OCR PDF.",
    ],
    sections: [
      {
        h: "Cómo funciona",
        p: ["Pliego saca el texto del PDF en tu dispositivo. Cuando haces una pregunta, elige las partes del texto que más se relacionan con ella y solo esas partes se envían a la IA de Cloudflare para responder. El archivo no se sube y el texto no se guarda."],
      },
    ],
    faqs: [
      ["¿Puede responder cosas que no están en el documento?", "Está indicada para responder solo con base en el texto. Si la respuesta no está en el documento, debería decírtelo."],
      ["¿Cuántas páginas puede tener el PDF?", "En el plan gratis, hasta 20 páginas por archivo, sin límite de usos."],
    ],
  },
];
