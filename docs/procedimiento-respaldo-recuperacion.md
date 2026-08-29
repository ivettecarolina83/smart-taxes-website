# Procedimiento de respaldo y recuperación

## Propósito

Este procedimiento establece cómo Smart Taxes protege y recupera el sitio web público ante una pérdida de archivos, un despliegue defectuoso o una interrupción del proveedor.

Este documento cubre únicamente el sitio web y su código. No autoriza almacenar en el repositorio, en las copias del sitio ni en archivos temporales números de Seguro Social, ITIN, documentos fiscales, información bancaria, contraseñas, códigos de recuperación ni datos de consultas.

La información interna del WISP, las identidades de las personas autorizadas y los métodos de recuperación de cuentas se mantienen en documentación separada con acceso restringido.

## Responsabilidad y autorización

- Smart Taxes designa un responsable principal para coordinar copias, comprobaciones y recuperaciones.
- Solo una persona autorizada puede iniciar una recuperación o un redespliegue.
- No se debe restaurar directamente sobre producción sin confirmar el alcance, la fecha de la copia y el plan de reversión.
- Toda recuperación debe registrar fecha, responsable, motivo, fuente utilizada, resultado y errores observados, sin incluir datos personales.

## Sistemas cubiertos

### GitHub

GitHub conserva la fuente oficial del sitio y el historial de cambios.

- La rama principal representa la versión aprobada para producción.
- Las ramas y los pull requests conservan cambios que todavía no han sido aprobados.
- Un pull request no debe fusionarse como parte de una recuperación salvo autorización expresa.
- La descarga ZIP permite comprobar que el código puede recuperarse sin modificar el repositorio.

### Hostinger

Hostinger aloja la versión publicada y mantiene puntos de respaldo administrados por el proveedor.

- Se debe comprobar periódicamente que exista una copia reciente y un historial de fechas.
- Preparar o descargar una copia no equivale a restaurarla.
- Una restauración devuelve el sitio al estado de la fecha seleccionada y puede reemplazar cambios posteriores.
- Si la descarga o preparación falla, no se deben repetir intentos indefinidamente. El incidente se documenta y se utiliza GitHub como fuente alternativa mientras se revisa la conexión o se consulta al proveedor.

### Google Apps Script

El formulario utiliza un proyecto restringido de Google Apps Script.

- El acceso al proyecto se limita a cuentas autorizadas.
- El código y la configuración deben revisarse por separado del sitio estático.
- No se deben incluir credenciales, códigos de recuperación ni datos de clientes en copias del repositorio.
- Después de recuperar el sitio, se verifica que el formulario apunte a la implementación autorizada, sin realizar envíos con datos reales.

## Custodia de mecanismos de recuperación

- Los códigos de recuperación se conservan impresos, separados por servicio y dentro de sobres sellados.
- Las contraseñas no se guardan junto con los códigos.
- La responsabilidad administrativa y la custodia física pueden corresponder temporalmente a personas distintas cuando exista separación geográfica.
- La asignación de responsables, la ubicación física y cualquier transferencia se documentan únicamente en el WISP interno restringido.
- Los códigos no se fotografían, digitalizan ni transmiten por correo, mensajería o almacenamiento en la nube.
- Una transferencia se realiza en persona o mediante un método físico autorizado, sellado y rastreable.
- Si un sobre se abre, un código se utiliza o existe sospecha de exposición, se generan códigos nuevos, se reemplaza la copia anterior y se registra el incidente sin copiar los códigos.

## Procedimiento de recuperación

1. **Identificar el incidente.** Determinar si afecta archivos, publicación, configuración del formulario o acceso a una cuenta.
2. **Detener cambios adicionales.** No fusionar, redesplegar ni restaurar mientras el alcance sea incierto.
3. **Elegir la fuente.**
   - Usar GitHub para recuperar el código aprobado y revisar el historial.
   - Usar Hostinger para regresar a un punto de respaldo del alojamiento cuando sea necesario.
   - Revisar Google Apps Script por separado cuando el incidente afecte el formulario o los correos.
4. **Trabajar de forma aislada.** Descargar o extraer la copia en una carpeta temporal fuera del repositorio local y fuera del directorio público del hosting.
5. **Comprobar la estructura.** Verificar como mínimo la página principal, hojas de estilo, JavaScript, recursos visuales, versión en inglés, servicios y páginas legales.
6. **Comprobar el funcionamiento.** Abrir la copia local, revisar diseño, imágenes, navegación, idiomas y páginas legales. No enviar formularios, llamadas ni mensajes desde la copia.
7. **Autorizar la restauración.** Documentar la copia elegida, los cambios que podrían perderse y el método de reversión antes de tocar producción.
8. **Restaurar o redesplegar.** Ejecutar una sola acción controlada y esperar su finalización.
9. **Validar producción.** Revisar HTTPS, navegación, idiomas, recursos, páginas legales y formulario con datos ficticios y no sensibles.
10. **Cerrar la prueba.** Eliminar archivos temporales y registrar el resultado sin datos personales.

## Prueba realizada el 15 de agosto de 2026

### Hostinger

- Se confirmó la existencia de varios puntos históricos.
- Se confirmó la generación diaria de copias recientes.
- La preparación inicial de una copia finalizó correctamente; dos intentos de descarga fallaron por restablecimiento de conexión.
- El 29 de agosto de 2026 se repitió la prueba con una copia reciente y la descarga se completó correctamente.
- Se verificó la estructura del respaldo, incluido el contenido operativo dentro de `domains/smartaxesusa.com/public_html`.
- La página principal del respaldo abrió correctamente de forma local sin enviar el formulario.
- No se ejecutó ninguna restauración y la página publicada no fue modificada.
- La copia descargada y la carpeta temporal fueron eliminadas después de la comprobación.
- La prueba de descarga y recuperación desde Hostinger fue satisfactoria.

### GitHub

- Se descargó correctamente un archivo ZIP de la rama principal.
- La copia se extrajo en una ubicación local separada.
- Se verificaron la página principal, estilos, JavaScript, recursos, versión inglesa, servicios y páginas legales.
- La copia abrió correctamente en español y en inglés.
- Las páginas legales cargaron en el idioma seleccionado.
- No se enviaron formularios ni se utilizaron acciones de contacto.
- El archivo ZIP y la carpeta temporal de prueba fueron eliminados después de la comprobación.
- La prueba de recuperación desde GitHub fue satisfactoria.

## Frecuencia de revisión

Este procedimiento se revisa:

- al menos una vez por trimestre;
- después de un cambio importante del sitio, hosting o formulario;
- después de modificar cuentas autorizadas;
- después de un incidente o una restauración;
- antes de declarar completa una actualización relevante del WISP.

## Lista de comprobación

- [ ] Existe una copia reciente en Hostinger.
- [ ] El historial contiene más de un punto de recuperación.
- [ ] La rama principal de GitHub corresponde a la versión aprobada.
- [ ] Los cambios pendientes permanecen en su pull request sin fusionar.
- [ ] La copia puede descargarse o existe una fuente alternativa verificada.
- [ ] La estructura del sitio está completa.
- [ ] Español, inglés y páginas legales funcionan.
- [ ] No se usaron datos reales en la prueba.
- [ ] Los archivos temporales fueron eliminados.
- [ ] El resultado quedó documentado sin datos personales.
