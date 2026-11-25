import { useEffect } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "../components/Layout";
import { SITE, PAGES } from "../data/site";

const usePage = (path) => {
  const page = PAGES.find((p) => p.path === path);
  useEffect(() => { document.title = page.title; }, [page]);
  return page;
};

const Doc = ({ children }) => (
  <article className="card doc" style={{ maxWidth: 860 }}>{children}</article>
);

export function Acerca() {
  const page = usePage("/acerca");
  return (
    <>
      <TopBar title={page.h1} subtitle="Quiénes somos y cómo funciona" />
      <Doc>
        <h2>Qué es Pliego</h2>
        <p>Pliego es una página de herramientas PDF gratis y sin límite de usos, pensada para los trámites del día a día en Colombia y Latinoamérica: subir la cédula por ambas caras, dejar un PDF por debajo de 2 MB, armar el paquete de una hoja de vida o revisar un archivo antes de subirlo a una plataforma.</p>
        <h2>Tus archivos se quedan contigo</h2>
        <p>Casi todas las herramientas funcionan dentro de tu navegador. Eso quiere decir que tus documentos no se suben a ningún servidor: se procesan en tu celular o computador y el resultado se descarga directo. Por eso Pliego puede ser gratis e ilimitado.</p>
        <h2>Quién lo hace</h2>
        <p>Pliego lo crea {SITE.owner}, desarrollador web en {SITE.city}. Si tienes una idea de herramienta o encontraste un error, <Link to="/contacto">escríbenos</Link>.</p>
        <h2>Aviso</h2>
        <p>Pliego no es una página oficial ni está vinculada a ninguna entidad del Estado. Verifica siempre los requisitos de cada trámite en la página de la entidad correspondiente.</p>
      </Doc>
    </>
  );
}

export function Contacto() {
  const page = usePage("/contacto");
  return (
    <>
      <TopBar title={page.h1} subtitle="Te respondemos lo antes posible" />
      <Doc>
        <p>Escríbenos para reportar un error, sugerir una herramienta nueva, preguntar por los planes o por publicidad en Pliego.</p>
        <p style={{ margin: "18px 0" }}>
          <a className="btn btn-primary" href={`mailto:${SITE.email}?subject=Contacto%20desde%20Pliego`}>Escribir a {SITE.email}</a>
        </p>
        <p className="muted small">Para reportar un error, cuéntanos qué herramienta usabas, desde qué dispositivo y qué pasó. Nunca te vamos a pedir que nos envíes tus documentos.</p>
      </Doc>
    </>
  );
}

export function Privacidad() {
  const page = usePage("/privacidad");
  return (
    <>
      <TopBar title={page.h1} subtitle={`Última actualización: ${SITE.updated}`} />
      <Doc>
        <h2>1. Responsable</h2>
        <p>{SITE.name} ({SITE.url}) es operado por {SITE.owner}, {SITE.city}. Contacto: {SITE.email}.</p>

        <h2>2. Tus archivos</h2>
        <p>Las herramientas marcadas como "Se procesa en tu dispositivo" trabajan dentro de tu navegador. Tus archivos no se envían, no se guardan y no se pueden ver desde nuestros servidores. Cuando cierras la página, desaparecen de la memoria del navegador.</p>
        <p>Las herramientas de inteligencia artificial (Resumir, Traducir y Pregúntale al PDF) tampoco suben tu archivo: Pliego saca el texto en tu dispositivo y solo ese texto se envía a Workers AI de Cloudflare para generar la respuesta. Pliego no guarda ese texto ni las respuestas.</p>

        <h2>3. Datos que se guardan en tu navegador</h2>
        <p>Pliego guarda en el almacenamiento local de tu navegador (localStorage) datos que nunca salen de tu dispositivo: el tema claro u oscuro, las herramientas que usaste hace poco, estadísticas de uso como el número de archivos procesados, los datos que escribes en las plantillas para no volver a escribirlos y, una copia de los datos de tu cuenta (correo y plan) y, si tienes Pro, tus firmas y tus clientes guardados. Puedes borrarlos cuando quieras desde la configuración de tu navegador.</p>

        <h2>4. Publicidad y cookies de terceros</h2>
        <p>Pliego puede mostrar anuncios de Google AdSense para mantenerse gratis. Proveedores externos, incluido Google, usan cookies para mostrar anuncios basados en las visitas anteriores del usuario a este sitio web u otros sitios web.</p>
        <p>Las cookies de publicidad permiten que Google y sus socios muestren anuncios a los usuarios en función de sus visitas a este sitio o a otros sitios de internet. Puedes desactivar la publicidad personalizada en la <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">configuración de anuncios de Google</a>, o desactivar las cookies de otros proveedores en <a href="https://www.aboutads.info/choices" target="_blank" rel="noreferrer">www.aboutads.info</a>.</p>
        <p>Más información sobre cómo usa Google los datos: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">policies.google.com/technologies/partner-sites</a>.</p>

        <h2>5. Tu cuenta</h2>
        <p>Crear una cuenta es opcional y solo se necesita para Pliego Pro. Si creas una, guardamos tu correo, la fecha en que la creaste, tu plan y, si tienes Pro, tus firmas y clientes guardados. Tu contraseña se cifra en tu propio dispositivo antes de enviarse y en nuestra base de datos solo queda una huella cifrada que no permite recuperarla.</p>
        <p>Usamos tu correo solo para tu cuenta: entrar, restablecer la contraseña y temas de tus pagos. Para iniciar sesión usamos una cookie propia y necesaria, que no sirve para publicidad. Puedes borrar tu cuenta cuando quieras desde Mi cuenta.</p>

        <h2>6. Estadísticas de visitas</h2>
        <p>Podemos usar herramientas de medición (como las estadísticas de Cloudflare) para saber cuántas personas visitan el sitio y qué páginas usan. Esa información es agregada y no incluye el contenido de tus archivos.</p>

        <h2>7. Pagos</h2>
        <p>Los pagos de Pliego Pro se hacen en Mercado Pago. Tus datos de pago (tarjeta, cuenta bancaria, correo) los recibe y trata Mercado Pago según su propia política de privacidad; Pliego no los ve ni los guarda.</p>
        <p>Para activar Pro, el servidor de Pliego consulta a Mercado Pago si el pago fue aprobado y guarda el número de la operación, el plan, el valor y la fecha, ligados a tu cuenta.</p>

        <h2>8. Tus derechos</h2>
        <p>De acuerdo con la Ley 1581 de 2012 de Colombia, puedes conocer, actualizar, rectificar y pedir que se borren tus datos personales escribiendo a {SITE.email}. También puedes borrar tu cuenta tú mismo desde Mi cuenta.</p>

        <h2>9. Menores de edad</h2>
        <p>Pliego no está dirigido a menores de 13 años ni recopila intencionalmente sus datos.</p>

        <h2>10. Cambios</h2>
        <p>Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha de actualización.</p>
      </Doc>
    </>
  );
}

export function Terminos() {
  const page = usePage("/terminos");
  return (
    <>
      <TopBar title={page.h1} subtitle={`Última actualización: ${SITE.updated}`} />
      <Doc>
        <h2>1. Uso del servicio</h2>
        <p>Pliego ofrece herramientas para trabajar con archivos PDF e imágenes. Puedes usarlas gratis y sin límite de usos, con los límites por archivo que indica cada herramienta.</p>
        <h2>2. Tus archivos son tuyos</h2>
        <p>Eres responsable de los documentos que procesas y de tener derecho a usarlos. No uses Pliego para falsificar documentos, quitar protecciones de archivos que no te pertenecen ni para ningún fin ilegal.</p>
        <h2>3. Sin garantías</h2>
        <p>Las herramientas se ofrecen "tal como están". Hacemos lo posible para que funcionen bien, pero revisa siempre el resultado antes de enviarlo. Guarda una copia de tus archivos originales.</p>
        <h2>4. Trámites</h2>
        <p>Pliego no es una página oficial ni está vinculada a ninguna entidad del Estado. Los requisitos de cada trámite los define cada entidad; verifícalos en su página oficial.</p>
        <h2>5. Calculadoras y plantillas</h2>
        <p>Las calculadoras y plantillas son guías de referencia y no reemplazan la asesoría de un abogado o contador.</p>
        <h2>6. Publicidad</h2>
        <p>El plan gratis puede mostrar anuncios. Pliego Pro no los muestra.</p>
        <h2>7. Pliego Pro</h2>
        <p>Pliego Pro cuesta $9.900 por 30 días o $99.000 por 365 días, en pesos colombianos. Es un pago único hecho en Mercado Pago: no es una suscripción y no se renueva solo. Pro empieza el día en que Mercado Pago aprueba el pago.</p>
        <p>Para comprar Pro necesitas una cuenta de Pliego. Pro queda ligado a esa cuenta: lo usas entrando con tu correo en tus propios dispositivos. La cuenta es personal; no compartas tu contraseña. Si compras otro plan antes de que se venza, los días se suman.</p>
        <p>Pro sube los límites por archivo, quita los anuncios y guarda tus firmas y clientes en tu cuenta. Los límites exactos están en la página de Planes.</p>
        <p>Si tienes un problema con tu pago o con Pro, escríbenos a {SITE.email} con el número de la operación de Mercado Pago y lo revisamos.</p>
        <h2>8. Cambios</h2>
        <p>Podemos actualizar estos términos. La versión vigente siempre estará en esta página.</p>
        <h2>9. Contacto</h2>
        <p>Preguntas sobre estos términos: {SITE.email}.</p>
      </Doc>
    </>
  );
}
