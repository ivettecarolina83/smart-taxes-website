# Plan de respuesta a incidentes del sitio web

## Propósito

Este plan establece cómo Smart Taxes identifica, contiene, investiga y recupera el sitio web y sus servicios relacionados ante un incidente de seguridad.

El plan cubre el sitio público, GitHub, Hostinger, el dominio y DNS, Google Apps Script y el correo utilizado por el formulario. No sustituye la evaluación profesional de obligaciones legales o regulatorias cuando exista exposición de información personal o tributaria.

Los nombres, teléfonos, cuentas, aseguradoras, contactos oficiales y métodos de recuperación se mantienen únicamente en el WISP interno restringido.

## Principios

- Proteger primero a las personas y detener la pérdida adicional de información.
- Actuar con rapidez sin destruir evidencia.
- Limitar el acceso a quienes necesiten participar en la respuesta.
- No restaurar, fusionar, redesplegar ni borrar registros hasta comprender el alcance.
- Comunicar hechos confirmados; no especular ni ocultar información que las personas afectadas necesiten para protegerse.
- Registrar decisiones, acciones, fechas y resultados sin copiar datos sensibles.

## Qué se considera un incidente

Entre las señales que requieren revisión se encuentran:

- cambios no autorizados en el contenido o el código;
- redirecciones a sitios desconocidos;
- advertencias del navegador, certificado o antivirus;
- sesiones, dispositivos, commits, despliegues o cambios DNS no reconocidos;
- pérdida de acceso a una cuenta administrativa;
- formularios alterados, correos inesperados o actividad automatizada anormal;
- archivos desconocidos en el alojamiento;
- interrupciones que no correspondan a mantenimiento o fallos conocidos del proveedor;
- avisos de GitHub, Google, Hostinger, el registrador del dominio o una autoridad;
- indicios de que información personal o tributaria pudo ser vista, copiada, modificada o divulgada.

Un evento técnico no confirmado se investiga. Solo se declara una filtración de datos cuando la evidencia disponible justifica esa conclusión.

## Niveles de respuesta

### Nivel 1: evento sospechoso

No existe evidencia de modificación, pérdida de control ni exposición de información.

- Registrar la alerta.
- Revisar sesiones, actividad, registros y estado de los proveedores.
- Confirmar que MFA, dominio, despliegue y formulario funcionan.
- Cerrar el evento si no se encuentran indicios adicionales.

### Nivel 2: compromiso del sitio o de una cuenta

Existe modificación no autorizada, redirección, pérdida de acceso, malware, cambio DNS, despliegue desconocido o interrupción provocada.

- Activar inmediatamente al responsable del incidente.
- Preservar evidencia.
- Contener la cuenta o servicio afectado.
- Suspender temporalmente el formulario o el sitio si continúa causando daño.
- Recuperar únicamente desde una fuente verificada y limpia.

### Nivel 3: posible exposición de información personal o tributaria

Existe evidencia o sospecha razonable de acceso a datos de clientes, correo, documentos fiscales, credenciales o información protegida.

- Tratar el evento como urgente.
- Solicitar apoyo técnico especializado y orientación legal o regulatoria.
- Determinar qué información, personas, estados y proveedores fueron afectados.
- Realizar las notificaciones exigidas según el alcance y las leyes aplicables.
- Seguir las instrucciones oficiales para profesionales tributarios.

## Roles

El WISP interno debe designar, como mínimo:

- **Responsable del incidente:** autoriza contención, recuperación y comunicaciones.
- **Responsable técnico:** conserva evidencia, coordina proveedores, cuentas y recuperación.
- **Responsable de comunicaciones:** prepara mensajes internos y externos aprobados.
- **Suplente:** actúa cuando la persona principal no está disponible.

Una misma persona puede cubrir más de un rol en una empresa pequeña, pero las decisiones y acciones deben quedar documentadas.

## Respuesta inmediata

1. **Registrar la alerta.** Anotar quién la detectó, fecha, hora, sistema, síntoma y cómo se recibió.
2. **No destruir evidencia.** No borrar archivos, mensajes, registros, historial, sesiones ni dispositivos. No restaurar de inmediato.
3. **Preservar información.** Guardar capturas, correos de alerta, direcciones afectadas, registros de actividad y referencias del proveedor. No copiar datos personales innecesarios.
4. **Determinar el alcance inicial.** Identificar si afecta GitHub, Hostinger, DNS, Google, Apps Script, correo, equipos o más de un sistema.
5. **Contener.** Restringir únicamente el acceso o servicio afectado. Si una credencial pudo quedar expuesta, cerrar sesiones no reconocidas y reemplazarla mediante un dispositivo confiable.
6. **Contactar al proveedor.** Abrir un caso con el servicio afectado y conservar el número de referencia.
7. **Mantener la continuidad.** Utilizar una página temporal segura o suspender el formulario cuando sea necesario para evitar daño adicional.

## Contención por sistema

### GitHub

- Revisar sesiones, actividad, commits, ramas, pull requests, colaboradores y claves autorizadas.
- No fusionar cambios sospechosos.
- Revocar accesos no reconocidos y proteger la rama principal.
- Comparar el estado afectado con un commit aprobado.

### Hostinger

- Revisar sesiones, archivos, despliegues, registros y cambios de configuración.
- Solicitar al proveedor que preserve registros cuando exista un compromiso posible.
- No restaurar sobre producción hasta seleccionar una copia anterior al incidente.
- Suspender temporalmente la publicación o el formulario cuando continúe el riesgo.

### Dominio y DNS

- Verificar registrador, nameservers, registros DNS, redirecciones, bloqueo de transferencia y datos de recuperación.
- Revertir únicamente cambios no autorizados después de preservar evidencia.
- Confirmar HTTPS y certificado al finalizar.

### Google, Gmail y Apps Script

- Revisar dispositivos, sesiones, eventos de seguridad, acceso al proyecto, versiones e implementaciones.
- Detener la implementación del formulario si pudiera enviar información a un destino no autorizado.
- Generar códigos de recuperación nuevos cuando exista riesgo de exposición.
- No copiar correos ni consultas completas en el registro del incidente.

## Investigación

La investigación debe responder:

- ¿Cuándo comenzó y cuándo fue detectado?
- ¿Cómo se obtuvo acceso?
- ¿Qué sistemas y cuentas fueron afectados?
- ¿Qué acciones realizó la persona no autorizada?
- ¿Se accedió a información personal o tributaria?
- ¿Cuántas personas podrían estar afectadas?
- ¿El acceso continúa?
- ¿Qué evidencia respalda cada conclusión?

Cuando el alcance supere la capacidad interna, Smart Taxes debe utilizar apoyo forense o de ciberseguridad calificado.

## Notificación y comunicación

No todos los ataques requieren una notificación pública. La decisión depende de la información afectada, la evidencia, los estados involucrados y las leyes aplicables.

Cuando exista posible exposición de información personal o tributaria, el equipo debe evaluar inmediatamente el contacto con:

- el proveedor afectado;
- la aseguradora, si existe cobertura;
- asesoría legal o de privacidad calificada;
- autoridades estatales aplicables;
- el Enlace de Partes Interesadas del IRS para profesionales tributarios;
- autoridades policiales y federales apropiadas;
- las personas afectadas, cuando corresponda.

Los mensajes deben indicar hechos confirmados, medidas tomadas, riesgos relevantes y acciones de protección. No deben incluir detalles que aumenten el riesgo ni promesas que no puedan cumplirse.

## Recuperación

1. Confirmar que la vía de acceso no autorizado fue cerrada.
2. Seleccionar una fuente limpia y anterior al incidente.
3. Recuperar primero en un entorno aislado cuando sea posible.
4. Verificar archivos, dependencias, enlaces, idiomas, páginas legales y configuración.
5. Revisar el destino del formulario y realizar pruebas solo con datos ficticios y no sensibles.
6. Redesplegar con autorización.
7. Comprobar HTTPS, encabezados de seguridad, DNS, navegación y correos.
8. Mantener vigilancia reforzada después de volver a producción.
9. Generar nuevas credenciales y códigos cuando sea necesario.
10. Informar el cierre únicamente cuando no existan nuevos indicios de compromiso.

El procedimiento detallado se encuentra en `docs/procedimiento-respaldo-recuperacion.md`.

## Registro del incidente

El registro interno debe contener:

- identificador interno;
- fecha y hora;
- persona que reportó;
- sistemas afectados;
- nivel asignado;
- evidencia preservada;
- acciones de contención;
- proveedores y autoridades contactados;
- decisiones de notificación;
- método de recuperación;
- validaciones realizadas;
- fecha de cierre;
- mejoras aprobadas.

No se deben copiar contraseñas, códigos de recuperación, números de identificación, documentos fiscales ni contenido completo de consultas.

## Después del incidente

- Corregir la causa raíz.
- Revisar accesos, MFA, copias, alertas y proveedores.
- Actualizar el WISP y este plan.
- Capacitar nuevamente a las personas autorizadas.
- Documentar qué funcionó y qué debe mejorar.
- Repetir la prueba de recuperación si se modificó el procedimiento.

## Pruebas y revisión

- Realizar un ejercicio de mesa al menos una vez al año.
- Revisar el plan cada trimestre y después de cambios importantes.
- Probar contactos y responsabilidades sin enviar códigos ni datos sensibles.
- Probar recuperación en un entorno aislado.
- Registrar los resultados y acciones correctivas.

## Fuentes oficiales

- IRS, *Identity theft information for tax professionals*: https://www.irs.gov/identity-theft-central/identity-theft-information-for-tax-professionals
- IRS, *Publication 4557, Safeguarding Taxpayer Data*: https://www.irs.gov/pub/irs-pdf/p4557.pdf
- FTC, *Data Breach Response: A Guide for Business*: https://www.ftc.gov/business-guidance/resources/data-breach-response-guide-business
- FTC, *Cybersecurity for Small Business*: https://www.ftc.gov/business-guidance/small-businesses/cybersecurity
