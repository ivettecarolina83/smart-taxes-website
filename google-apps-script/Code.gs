const RECIPIENT_EMAIL = 'smarttaxes2@gmail.com';
const ALLOWED_SERVICES = [
  'Preparación de impuestos',
  'Contabilidad y nómina',
  'Resolución con el IRS',
  'Protección financiera',
  'Otra consulta'
];
const ALLOWED_CONTACT_METHODS = ['Llamada', 'Mensaje de texto', 'Correo electrónico'];

function doPost(e) {
  try {
    const data = e && e.parameter ? e.parameter : {};

    // Campo trampa: los visitantes reales no pueden verlo.
    if (clean_(data.website, 200)) {
      return response_({ ok: true });
    }

    const name = clean_(data.nombre, 100);
    const phone = clean_(data.telefono, 25);
    const email = clean_(data.correo, 120).toLowerCase();
    const contactMethod = clean_(data.contacto_preferido, 40);
    const service = clean_(data.servicio, 80);
    const message = clean_(data.mensaje, 1200);
    const consent = clean_(data.consentimiento, 5);

    if (!name || !phone || !isEmail_(email) || !message || consent !== 'Sí') {
      return response_({ ok: false, error: 'Datos obligatorios inválidos.' });
    }

    if (
      ALLOWED_SERVICES.indexOf(service) === -1 ||
      ALLOWED_CONTACT_METHODS.indexOf(contactMethod) === -1
    ) {
      return response_({ ok: false, error: 'Selección inválida.' });
    }

    if (isRateLimited_(email)) {
      return response_({ ok: false, error: 'Espera unos minutos antes de enviar otra solicitud.' });
    }

    const subject = 'Nueva solicitud web: ' + service;
    const body = [
      'Nueva solicitud de asesoría desde el sitio web de Smart Taxes',
      '',
      'Nombre: ' + name,
      'Teléfono: ' + phone,
      'Correo: ' + email,
      'Contacto preferido: ' + contactMethod,
      'Servicio: ' + service,
      '',
      'Consulta:',
      message,
      '',
      'Consentimiento para contacto: Sí',
      'Fecha: ' + new Date().toISOString()
    ].join('\n');

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: subject,
      body: body,
      replyTo: email,
      name: 'Formulario web de Smart Taxes'
    });

    const confirmationBody = [
      'Hola ' + name + ',',
      '',
      'Hemos recibido tu solicitud de asesoría en Smart Taxes.',
      '',
      'Servicio solicitado: ' + service,
      'Medio de contacto preferido: ' + contactMethod,
      '',
      'Nuestro equipo revisará la información y podrá comunicarse contigo por el medio indicado.',
      '',
      'Por tu seguridad, no respondas con números de Seguro Social, ITIN, información bancaria, contraseñas ni documentos fiscales.',
      '',
      'Tu tranquilidad es nuestra especialidad. Somos tu punto de contacto.',
      'Smart Taxes',
      '',
      'Este es un mensaje automático de confirmación.'
    ].join('\n');

    try {
      MailApp.sendEmail({
        to: email,
        subject: 'Recibimos tu solicitud | Smart Taxes',
        body: confirmationBody,
        replyTo: RECIPIENT_EMAIL,
        name: 'Smart Taxes'
      });
    } catch (confirmationError) {
      console.error('No se pudo enviar la confirmación al cliente:', confirmationError);
    }

    return response_({ ok: true });
  } catch (error) {
    console.error(error);
    return response_({ ok: false, error: 'No fue posible procesar la solicitud.' });
  }
}

function clean_(value, maxLength) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function isEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isRateLimited_(email) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email);
  const key = 'form_' + Utilities.base64EncodeWebSafe(digest).slice(0, 40);
  const cache = CacheService.getScriptCache();

  if (cache.get(key)) return true;

  cache.put(key, '1', 300);
  return false;
}

function response_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
