// Guías largas de las herramientas de trámites.
export default [
  {
    slug: "como-escanear-cedula-ambas-caras-en-una-hoja",
    tool: "cedula-ambas-caras",
    title: "Cómo escanear la cédula por ambas caras en una sola hoja",
    description: "Pon el frente y el reverso de tu cédula en una sola hoja PDF, a tamaño real, desde el celular y sin escáner. Paso a paso y gratis.",
    intro: [
      "Casi todos los trámites en Colombia piden lo mismo: una copia de la cédula por ambas caras, en una sola hoja. Lo piden los bancos para abrir una cuenta, las EPS para afiliarte, las universidades para la matrícula y las empresas cuando te contratan.",
      "Antes había que ir a una papelería a sacar una fotocopia. Hoy lo puedes hacer desde el celular en menos de un minuto: tomas una foto de cada cara y Pliego arma el PDF con las dos caras a tamaño real, listo para enviar o imprimir.",
    ],
    when: [
      "Te piden la cédula escaneada por correo o en una plataforma de empleo.",
      "Vas a abrir una cuenta bancaria o una billetera digital y te piden el documento en PDF.",
      "Necesitas imprimir la copia y quieres que salga del mismo tamaño que la original.",
      "Tienes la cédula digital y te piden una copia en papel de ambas caras.",
    ],
    steps: [
      "Pon la cédula sobre una superficie oscura y lisa, como una mesa o un cuaderno de tapa negra. El contraste ayuda a que se vea nítida.",
      "Toma la foto del frente desde arriba, sin flash, con el celular paralelo a la cédula para que no salga torcida.",
      "Voltea la cédula y toma la foto del reverso de la misma forma.",
      "Abre la herramienta Cédula ambas caras en Pliego y sube cada foto en su recuadro: Frente y Reverso.",
      "Si una foto quedó de lado, usa el botón de girar hasta que se vea derecha.",
      "Elige el tamaño de hoja (carta o A4) y descarga el PDF.",
    ],
    tips: [
      "Evita el flash: crea un brillo blanco que tapa los datos, sobre todo en la cédula amarilla con hologramas.",
      "Recorta lo menos posible al tomar la foto; Pliego se encarga de ajustar cada cara al tamaño exacto.",
      "Si la vas a imprimir, elige Tamaño real o 100 % en la impresora. Si eliges Ajustar a la página, la cédula sale más grande.",
      "Si la copia es para un trámite específico, agrégale una marca de agua que diga para qué es. Así nadie la puede reutilizar para otra cosa.",
    ],
    sections: [
      {
        h: "¿De qué tamaño queda la cédula?",
        p: [
          "La cédula colombiana, tanto la amarilla con hologramas como la digital, tiene el formato de las tarjetas de identificación estándar: 85,6 × 54 milímetros, el mismo de una tarjeta bancaria. Pliego pone cada cara exactamente con esa medida en la hoja, una encima de la otra, con espacio entre ellas.",
          "Por eso, si imprimes al 100 %, la copia queda igual a la original y la puedes recortar si te la piden suelta.",
        ],
      },
    ],
    faqs: [
      ["¿Sirve para la tarjeta de identidad o la cédula de extranjería?", "Sí. Tienen el mismo tamaño de tarjeta, así que quedan igual de bien. También sirve para el pase de conducción y el carné estudiantil."],
      ["¿Pliego guarda la foto de mi cédula?", "No. El PDF se arma dentro de tu navegador y las fotos nunca se envían a ningún servidor. Cuando cierras la página, desaparecen."],
      ["¿Puedo usarlo sin internet?", "Sí, si instalaste Pliego como app. La herramienta funciona dentro del celular, así que no necesita conexión para armar el PDF."],
    ],
  },
  {
    slug: "como-reducir-el-peso-de-un-pdf-a-1-mb-o-2-mb",
    tool: "comprimir-a-peso",
    title: "Cómo reducir el peso de un PDF a menos de 1 MB o 2 MB",
    description: "La plataforma te dice que el archivo pesa demasiado. Aprende a bajar un PDF a menos de 500 KB, 1 MB o 2 MB sin que deje de leerse.",
    intro: [
      "Pocas cosas desesperan tanto como llenar un formulario en línea y que al final aparezca: El archivo supera el tamaño máximo permitido. Pasa mucho en convocatorias de empleo público, inscripciones a universidades, el SENA, becas y plataformas de entidades del Estado, que suelen aceptar archivos de 1 o 2 MB como máximo.",
      "La mayoría de compresores te dan opciones como baja, media o alta, y tienes que probar a ciegas hasta que alguna pase. Con Comprimir a peso exacto de Pliego le dices el máximo que acepta la plataforma y la herramienta busca sola la mejor calidad que quepa en ese peso.",
    ],
    when: [
      "Una plataforma de empleo, de becas o de inscripción te rechaza el archivo por peso.",
      "Escaneaste documentos con el celular y cada página quedó pesando varios megas.",
      "Necesitas enviar un PDF por correo y el adjunto es demasiado grande.",
      "Tienes que unir varios soportes en un solo archivo que no supere cierto peso.",
    ],
    steps: [
      "Revisa en la plataforma cuál es el peso máximo. Normalmente aparece junto al botón de subir, por ejemplo Máximo 2 MB.",
      "Abre Comprimir a peso exacto en Pliego y sube tu PDF.",
      "Elige el peso: 500 KB, 1 MB, 2 MB o 5 MB. Si piden otro valor, escríbelo en megas, por ejemplo 1,5.",
      "Haz clic en Comprimir al peso. Pliego prueba varias calidades hasta encontrar la mejor que no pase del límite.",
      "Descarga el archivo y ábrelo para revisar que el texto se lea bien antes de subirlo.",
    ],
    tips: [
      "Pide un poco menos del máximo. Si la plataforma acepta 2 MB, elige 1,9 MB: algunas cuentan los megas de forma distinta y rechazan archivos que están justo en el límite.",
      "Si tienes que unir varios documentos, únelos primero y comprime al final. Comprimir cada uno por separado y luego unirlos suele dar un archivo más pesado.",
      "Si el PDF tiene muchas páginas y el límite es muy bajo, quita las páginas que no sean necesarias, como hojas en blanco o anexos que no te pidieron.",
      "Antes de subir el archivo, pásalo por el Revisor antes de subir para confirmar que no tenga otros problemas, como contraseña o páginas giradas.",
    ],
    sections: [
      {
        h: "¿Qué hace que un PDF pese tanto?",
        p: [
          "Casi siempre son las imágenes. Un PDF con solo texto escrito en el computador pesa muy poco, pero cada foto o página escaneada puede pesar entre 1 y 5 MB, porque el celular toma fotos con muchísima resolución, más de la que se necesita para leer un documento.",
          "Para llegar a un peso exacto, Pliego guarda cada página como una imagen optimizada y ajusta la resolución y la calidad hasta que el archivo completo quepa en el límite. Por eso el resultado se ve igual al leerlo, pero el texto ya no se puede seleccionar ni copiar.",
        ],
      },
    ],
    faqs: [
      ["¿Por qué no logra llegar al peso que pedí?", "Si el PDF tiene muchas páginas y el límite es muy bajo, cada página tendría que quedar tan pequeña que dejaría de leerse. En ese caso divide el documento en varios archivos o elimina páginas que no sean necesarias."],
      ["¿Se pierde calidad?", "Un poco, pero Pliego siempre elige la mejor calidad que cabe en el peso que pediste. En documentos de texto la diferencia casi no se nota."],
      ["¿Cuál es la diferencia con Comprimir PDF?", "Comprimir PDF reduce el peso con la calidad que tú eliges, sin garantizar un peso final. Comprimir a peso exacto garantiza que el archivo no pase del límite que le indicas."],
    ],
  },
  {
    slug: "como-unir-hoja-de-vida-y-documentos-en-un-solo-pdf",
    tool: "paquete-documentos",
    title: "Cómo unir la hoja de vida y los soportes en un solo PDF",
    description: "Junta hoja de vida, cédula, diplomas y certificados en un solo PDF ordenado y numerado, como lo piden las empresas y convocatorias.",
    intro: [
      "Cuando te postulas a un empleo, a una beca o a una convocatoria, casi siempre piden lo mismo: Adjunte en un solo archivo PDF la hoja de vida con sus soportes. El problema es que esos soportes están regados: la hoja de vida en Word, la cédula en una foto, el diploma escaneado y los certificados en PDF que te mandaron por correo.",
      "El Paquete de documentos de Pliego organiza todo en secciones, convierte las fotos a PDF, une todo en el orden correcto, numera las páginas y le pone al archivo un nombre claro. Es la forma más rápida de entregar una postulación ordenada.",
    ],
    when: [
      "Te postulas a una oferta de empleo que pide hoja de vida con soportes en un solo archivo.",
      "Vas a participar en una convocatoria pública o en un concurso de méritos.",
      "Una universidad te pide los documentos de matrícula o de grado juntos.",
      "Quieres tener lista una carpeta digital con todos tus documentos para enviarla cuando te la pidan.",
    ],
    steps: [
      "Ten a mano tus documentos: la hoja de vida en PDF, la cédula (puedes usar la herramienta Cédula ambas caras), los diplomas y los certificados laborales.",
      "Abre Paquete de documentos y sube cada archivo en su sección: Hoja de vida, Cédula, Diploma o acta de grado, Certificados laborales y Otros soportes. Puedes subir PDF o fotos.",
      "Si en una sección tienes varios archivos, ordénalos arrastrándolos. Por ejemplo, pon los certificados del más reciente al más antiguo.",
      "Escribe el nombre del archivo, por ejemplo Cervantes_Roycer_HojaDeVida.",
      "Deja marcada la opción Numerar páginas para que cada hoja diga 1 de 10, 2 de 10 y así.",
      "Haz clic en Crear paquete y descarga el PDF.",
    ],
    tips: [
      "Ordena los soportes en el mismo orden en que aparecen en tu hoja de vida. A quien revisa le queda más fácil comprobar cada dato.",
      "Si tu hoja de vida está en Word, conviértela primero con Word a PDF.",
      "Si la convocatoria limita el peso, comprime el paquete final con Comprimir a peso exacto.",
      "No uses tildes, eñes ni espacios en el nombre del archivo. Algunas plataformas cambian esos caracteres por símbolos raros.",
    ],
    sections: [
      {
        h: "¿En qué orden van los documentos?",
        p: [
          "Si la oferta no dice un orden, el más común en Colombia es este: primero la hoja de vida, luego la copia de la cédula, después los diplomas y actas de grado (del título más alto al más básico), luego los certificados laborales (del más reciente al más antiguo) y al final los demás soportes, como cursos o la libreta militar.",
          "Si la convocatoria sí indica un orden, sigue ese orden exacto. En los concursos públicos, entregar los soportes en otro orden puede hacer que no te valoren un documento.",
        ],
      },
    ],
    faqs: [
      ["¿Tengo que llenar todas las secciones?", "No. Todas son opcionales: el paquete solo incluye las secciones en las que subiste archivos."],
      ["¿Puedo subir fotos tomadas con el celular?", "Sí. Pliego convierte cada foto en una página tamaño carta con margen y la une con los demás PDF."],
      ["¿Mis documentos quedan guardados en Pliego?", "No. Todo se procesa dentro de tu navegador. Ni tu hoja de vida ni tus certificados se suben a internet."],
    ],
  },
  {
    slug: "por-que-una-plataforma-rechaza-mi-pdf",
    tool: "revisor",
    title: "Por qué una plataforma rechaza tu PDF y cómo saberlo antes de subirlo",
    description: "Peso, contraseña, páginas giradas o en blanco: las causas más comunes de rechazo de un PDF y cómo revisarlo gratis antes de subirlo.",
    intro: [
      "Subiste el archivo, la plataforma lo aceptó, y días después te dicen que el documento no era legible o que no se pudo abrir. O peor: la plataforma lo rechaza sin decir por qué. Casi siempre la causa es una de pocas cosas que se pueden revisar antes.",
      "El Revisor antes de subir de Pliego lee tu PDF y te dice en segundos si tiene algún problema que suele causar rechazos. Si encuentra algo, te lleva directo a la herramienta que lo arregla.",
    ],
    when: [
      "Vas a subir documentos a una convocatoria y no puedes darte el lujo de que te los rechacen.",
      "Una plataforma ya rechazó tu archivo y no sabes por qué.",
      "Te mandaron un PDF y quieres saber si tiene contraseña o páginas raras antes de reenviarlo.",
      "Armaste un PDF uniendo varios archivos y quieres confirmar que quedó bien.",
    ],
    steps: [
      "Abre el Revisor antes de subir y sube tu PDF.",
      "Elige el peso máximo que acepta la plataforma. Si no lo sabes, elige No sé.",
      "Haz clic en Revisar PDF.",
      "Lee el resultado: lo que está en verde está bien y lo que está en rojo hay que corregirlo.",
      "Usa el botón Corregir de cada problema para abrir la herramienta que lo arregla.",
      "Cuando termines, vuelve a pasar el archivo corregido por el revisor para confirmar.",
    ],
    tips: [
      "Revisa siempre el archivo final, el que vas a subir, y no una versión anterior.",
      "Si el revisor dice que el PDF tiene contraseña, quítala con Desbloquear PDF. Las plataformas casi nunca aceptan archivos protegidos.",
      "Si hay páginas en blanco, quítalas con Eliminar páginas: además de verse mal, suben el peso del archivo.",
    ],
    sections: [
      {
        h: "Las causas más comunes de rechazo",
        list: [
          "Pesa más de lo permitido. Es la causa número uno; las plataformas suelen aceptar entre 1 y 5 MB.",
          "Tiene contraseña. La plataforma no lo puede abrir para revisarlo o generar la vista previa.",
          "Tiene páginas giradas. Quien lo revisa tiene que voltear la pantalla, y algunas plataformas lo marcan como ilegible.",
          "Tiene páginas en blanco, que suelen salir al escanear por ambas caras.",
          "Mezcla tamaños de hoja, por ejemplo carta con oficio o con fotos, y al imprimirlo las páginas quedan desproporcionadas.",
        ],
      },
    ],
    faqs: [
      ["¿El revisor cambia mi archivo?", "No. Solo lo lee y te muestra el resultado. Las correcciones las haces tú con las herramientas que te recomienda."],
      ["¿Detecta si el PDF está dañado?", "Si el PDF no se puede abrir, el revisor te lo dice y te sugiere usar Reparar PDF."],
      ["¿Puedo revisar un PDF que me enviaron?", "Sí. Sirve para cualquier PDF, sin importar quién lo hizo."],
    ],
  },
  {
    slug: "como-hacer-una-cuenta-de-cobro-en-colombia",
    tool: "cuenta-de-cobro",
    title: "Cómo hacer una cuenta de cobro en Colombia (2026)",
    description: "Qué es una cuenta de cobro, qué debe llevar, quién la puede usar y cómo hacerla gratis en PDF con el valor en letras automático.",
    intro: [
      "La cuenta de cobro es el documento con el que una persona natural le cobra a otra persona o a una empresa por un trabajo o servicio que prestó. La usan mucho los trabajadores independientes y freelance, los contratistas por prestación de servicios, los profesores por horas, los diseñadores y quienes hacen trabajos ocasionales.",
      "Con la herramienta Cuenta de cobro de Pliego llenas un formulario corto y descargas el PDF listo para enviar, con el valor escrito en números y en letras, tus datos de pago y tu firma. Además, Pliego recuerda tus datos para la próxima vez.",
    ],
    when: [
      "Hiciste un trabajo independiente y necesitas cobrarlo de forma formal.",
      "Tienes un contrato de prestación de servicios y cada mes te piden una cuenta de cobro para pagarte.",
      "Una empresa te pide un documento soporte para registrar el pago que te va a hacer.",
      "Quieres dejar por escrito cuánto te deben, por qué y a qué cuenta te deben pagar.",
    ],
    steps: [
      "Abre Cuenta de cobro en Pliego.",
      "Llena tus datos: nombre completo, cédula, teléfono y correo.",
      "Llena los datos de quien te debe pagar: el nombre de la empresa o persona y su NIT o cédula.",
      "Escribe el concepto, es decir, qué trabajo hiciste. Sé específico: Diseño de 10 publicaciones para Instagram del mes de noviembre es mejor que Diseño.",
      "Escribe el valor en pesos. Pliego lo pasa a letras de forma automática.",
      "Completa el número de la cuenta de cobro, la ciudad y la fecha.",
      "Agrega tus datos de pago: banco, tipo de cuenta (ahorros, corriente, Nequi o Daviplata) y número.",
      "Si aplica, marca la nota de no responsable de IVA. Agrega tu firma si quieres y descarga el PDF.",
    ],
    sections: [
      {
        h: "Qué debe llevar una cuenta de cobro",
        p: ["No existe un formato oficial único, pero una cuenta de cobro bien hecha lleva:"],
        list: [
          "Ciudad y fecha.",
          "Un número consecutivo, para llevar control de tus cobros.",
          "El nombre y el NIT o la cédula de quien debe pagar.",
          "Tu nombre y tu cédula, con la frase debe a.",
          "El valor en números y en letras. Las dos cifras deben coincidir; si hay una diferencia, se presta para discusiones sobre cuál es el valor real.",
          "El concepto: qué servicio prestaste y en qué periodo.",
          "Los datos para el pago.",
          "Tu firma.",
        ],
      },
      {
        h: "Cuenta de cobro, factura y seguridad social",
        p: [
          "La cuenta de cobro la usan las personas que no están obligadas a facturar electrónicamente. Si tu actividad te obliga a expedir factura electrónica, la cuenta de cobro no la reemplaza. Si tienes dudas sobre tu caso, consulta con un contador o en la DIAN.",
          "Si cobras por un contrato de prestación de servicios, es común que la empresa te pida junto con la cuenta de cobro la planilla que demuestra que pagaste tu seguridad social como independiente (salud, pensión y riesgos laborales). Pregunta qué soportes piden antes de enviarla, para que no te retrasen el pago.",
          "También puede pasar que la empresa te descuente retención en la fuente sobre el valor. Eso depende del monto y de tu situación tributaria.",
        ],
      },
    ],
    tips: [
      "Lleva un consecutivo: 001, 002, 003. Te ayuda a saber qué has cobrado y a quién.",
      "Envíala en PDF, no en Word: así nadie puede cambiar el valor.",
      "Si cobras lo mismo cada mes, Pliego guarda tus datos y solo tendrás que cambiar la fecha, el número y el concepto.",
    ],
    faqs: [
      ["¿La cuenta de cobro tiene que estar firmada?", "No es obligatorio por ley, pero casi todas las empresas la piden firmada. Puedes dibujar tu firma directamente en Pliego."],
      ["¿Qué es la nota de no responsable de IVA?", "Es una frase que indica que no cobras IVA porque no eres responsable de ese impuesto. Solo márcala si es tu caso; si tienes dudas, consulta con un contador."],
      ["¿Mis datos se guardan en internet?", "No. Pliego guarda tus datos solo en tu navegador, para que no tengas que escribirlos otra vez. Nadie más los ve."],
    ],
  },
  {
    slug: "como-hacer-un-derecho-de-peticion",
    tool: "derecho-de-peticion",
    title: "Cómo hacer un derecho de petición paso a paso",
    description: "Qué es un derecho de petición, cuánto tiempo tienen para responder y cómo redactarlo gratis para una EPS, una empresa o una entidad pública.",
    intro: [
      "El derecho de petición es la herramienta que tiene cualquier persona en Colombia para hacer solicitudes respetuosas a las autoridades y obtener una respuesta. Está en el artículo 23 de la Constitución y lo regula la Ley 1755 de 2015. No necesitas abogado, no cuesta nada y lo puedes presentar por escrito o de forma electrónica.",
      "Con la herramienta Derecho de petición de Pliego escribes los hechos y lo que pides, y descargas un documento bien estructurado, con los datos de la entidad, el fundamento legal y tus datos para recibir la respuesta.",
    ],
    when: [
      "Tu EPS no te autoriza un procedimiento, un medicamento o una cita.",
      "Una empresa de servicios públicos te cobró mal y no te resuelve.",
      "Necesitas que una entidad te entregue una copia de un documento o información.",
      "Hiciste una solicitud verbal y nunca te dieron respuesta.",
      "Quieres dejar constancia escrita de un reclamo ante una empresa privada.",
    ],
    steps: [
      "Abre Derecho de petición en Pliego.",
      "Escribe el nombre de la entidad o empresa, la dependencia si la conoces y la ciudad.",
      "Escribe un asunto corto que resuma lo que pides, por ejemplo Solicitud de autorización de resonancia magnética.",
      "Escribe los hechos, uno por línea, en orden de fecha: qué pasó, cuándo y qué respuesta te dieron.",
      "Escribe las peticiones, una por línea: exactamente qué quieres que hagan.",
      "Llena tus datos: nombre, cédula, dirección, correo, teléfono, ciudad y fecha.",
      "Descarga el documento, fírmalo y radícalo en la entidad.",
    ],
    sections: [
      {
        h: "¿Cuánto tiempo tienen para responder?",
        p: ["La Ley 1755 de 2015 fija estos plazos, contados en días hábiles desde que radicas la petición:"],
        list: [
          "15 días hábiles para la mayoría de peticiones.",
          "10 días hábiles cuando pides documentos o información.",
          "30 días hábiles cuando haces una consulta sobre temas a cargo de la entidad.",
        ],
      },
      {
        h: "¿Dónde y cómo se radica?",
        p: [
          "Puedes radicarlo en la ventanilla de atención de la entidad, por correo electrónico o por el formulario de PQRS de su página web. Lo importante es que quede un número de radicado o una constancia con la fecha, porque desde ese día empieza a contar el plazo.",
          "Si lo entregas en papel, lleva dos copias y pide que te sellen una con la fecha de recibido. Si lo envías por correo, guarda el correo enviado y la respuesta automática si llega.",
          "Si no te responden dentro del plazo, o la respuesta no resuelve de fondo lo que pediste, puedes acudir a la acción de tutela para proteger tu derecho de petición.",
        ],
      },
    ],
    tips: [
      "Sé concreto: una petición clara recibe una respuesta clara.",
      "Escribe los hechos con fechas y, si tienes, números de radicado anteriores.",
      "Pide una sola cosa por línea en las peticiones. Así puedes revisar si respondieron cada una.",
      "Adjunta los soportes que tengas, como órdenes médicas, facturas o respuestas anteriores. Puedes unirlos con Unir PDF.",
    ],
    faqs: [
      ["¿Se puede presentar ante una empresa privada?", "Sí. La ley también permite presentar peticiones ante organizaciones privadas, por ejemplo EPS, bancos o empresas de servicios públicos."],
      ["¿Necesito un abogado?", "No. Cualquier persona lo puede presentar directamente y es gratis."],
      ["¿Pliego radica la petición por mí?", "No. Pliego te ayuda a redactar el documento. La radicación la haces tú ante la entidad, para que tengas tu propio número de radicado."],
    ],
  },
  {
    slug: "como-calcular-la-liquidacion-laboral-2026",
    tool: "liquidacion",
    title: "Cómo calcular la liquidación laboral en Colombia (2026)",
    description: "Calcula cesantías, intereses, prima y vacaciones con los valores de 2026: salario mínimo de $1.750.905 y auxilio de transporte de $249.095.",
    intro: [
      "Cuando termina un contrato de trabajo, el empleador debe pagarte la liquidación: las prestaciones sociales que se acumularon y aún no te han pagado. Saber cuánto te corresponde te ayuda a revisar que te paguen lo justo.",
      "La Calculadora de liquidación de Pliego usa los valores oficiales de 2026 y las fórmulas de la ley laboral colombiana. Te muestra cada concepto con su fórmula y te deja descargar el resultado en PDF.",
    ],
    when: [
      "Renunciaste o te despidieron y quieres saber cuánto te deben pagar.",
      "Te entregaron la liquidación y quieres comprobar que esté bien calculada.",
      "Eres empleador de una persona (por ejemplo, empleada doméstica) y quieres calcular lo que debes pagar.",
      "Quieres saber cuánto llevas acumulado de prima o cesantías.",
    ],
    steps: [
      "Abre la Calculadora de liquidación en Pliego.",
      "Escribe tu salario mensual.",
      "Pon la fecha de inicio y la fecha de terminación del contrato.",
      "Escribe cuántos días de vacaciones ya disfrutaste durante el contrato.",
      "Si te deben días del último mes, escríbelos en Días de salario sin pagar.",
      "Si ya te pagaron cesantías o prima en algún momento, pon hasta qué fecha te las pagaron.",
      "Revisa la opción del auxilio de transporte: Pliego la marca sola si ganas hasta 2 salarios mínimos.",
      "Mira el resultado con cada fórmula y descarga el PDF si lo necesitas.",
    ],
    sections: [
      {
        h: "Valores de 2026",
        list: [
          "Salario mínimo (SMLMV): $1.750.905 al mes.",
          "Auxilio de transporte: $249.095 al mes, para quienes ganan hasta 2 salarios mínimos ($3.501.810).",
        ],
      },
      {
        h: "Las fórmulas",
        p: ["En la liquidación laboral el año se cuenta como de 360 días y cada mes de 30. Como base se usa el salario más el auxilio de transporte, salvo en vacaciones, que solo se calculan con el salario."],
        list: [
          "Cesantías = (salario + auxilio) × días trabajados ÷ 360.",
          "Intereses sobre cesantías = cesantías × días trabajados × 12 % ÷ 360.",
          "Prima de servicios = (salario + auxilio) × días del semestre ÷ 360.",
          "Vacaciones = salario × días trabajados ÷ 720, que equivale a 15 días hábiles por año.",
        ],
      },
      {
        h: "Ejemplo",
        p: [
          "Una persona que gana el salario mínimo trabajó del 1 de enero al 30 de junio de 2026 (180 días), no tomó vacaciones y no le han pagado prestaciones. Su base es $1.750.905 + $249.095 = $2.000.000.",
          "Cesantías: $2.000.000 × 180 ÷ 360 = $1.000.000. Intereses: $1.000.000 × 180 × 12 % ÷ 360 = $60.000. Prima: $2.000.000 × 180 ÷ 360 = $1.000.000. Vacaciones: $1.750.905 × 180 ÷ 720 = $437.726. En total, unos $2.497.726.",
        ],
      },
    ],
    tips: [
      "Ten a mano tu contrato y tus desprendibles de pago para tener las fechas y el salario exactos.",
      "Si tu salario varía (comisiones, horas extra), el cálculo se hace con el promedio. La calculadora da un estimado con el salario que escribas.",
      "Si tienes salario integral o un contrato de prestación de servicios, esta liquidación no aplica: en esos casos no se pagan cesantías ni prima.",
      "Si no estás de acuerdo con la liquidación que te entregaron, puedes pedir una explicación por escrito o acudir al Ministerio del Trabajo.",
    ],
    faqs: [
      ["¿El resultado es exacto?", "Es un estimado con las fórmulas de ley. Puede variar si hay pagos que no conocemos, como recargos, comisiones o acuerdos especiales. Para un caso en disputa, consulta con un abogado laboral o con el Ministerio del Trabajo."],
      ["¿Las vacaciones incluyen el auxilio de transporte?", "No. El auxilio de transporte se suma para cesantías, intereses y prima, pero no para las vacaciones."],
      ["¿Cuándo me deben pagar la liquidación?", "Al terminar el contrato. Si el empleador se demora sin justificación, la ley prevé una indemnización por mora (artículo 65 del Código Sustantivo del Trabajo)."],
    ],
  },
];
