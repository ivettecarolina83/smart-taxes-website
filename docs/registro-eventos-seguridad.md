# Registro técnico de eventos de seguridad

Este documento describe el registro privado utilizado por el formulario web de Smart Taxes como control técnico del WISP.

## Objetivo

Dejar evidencia de que los controles del formulario funcionan sin almacenar información personal ni el contenido de las consultas.

## Datos permitidos

Cada evento contiene únicamente:

- fecha y hora en UTC;
- fecha y hora del Este;
- tipo de evento;
- resultado;
- idioma del formulario;
- identificador técnico de la solicitud, cuando esté disponible.

## Datos prohibidos

El registro no debe almacenar:

- nombres;
- teléfonos;
- direcciones de correo electrónico;
- direcciones físicas;
- números de Seguro Social o ITIN;
- información bancaria o de tarjetas;
- documentos fiscales;
- texto de la consulta;
- contraseñas u otras credenciales.

## Eventos registrados

- solicitud aceptada;
- información sensible bloqueada;
- límite de frecuencia activado;
- tiempo de formulario inválido;
- campos obligatorios inválidos;
- selección inválida;
- envío automatizado bloqueado por el campo trampa;
- fallo de confirmación al cliente;
- error interno del servidor.

## Conservación

La política aprobada conserva los eventos durante 90 días y mantiene un máximo de 500 registros. Los eventos que superan el plazo y los registros más antiguos que exceden el límite se eliminan automáticamente.

Esta política fue comprobada con eventos sintéticos sin datos personales: se eliminó correctamente un evento con 91 días de antigüedad, se conservaron exactamente 500 registros al superar el límite y los eventos reales permanecieron intactos. Los eventos y el archivo temporal de prueba fueron eliminados al finalizar.

Los límites podrán modificarse en el futuro mediante una revisión documentada del WISP. Todo cambio deberá aplicarse también a la configuración técnica y someterse nuevamente a pruebas.

## Ubicación y acceso

El registro se guarda de forma privada en las propiedades del proyecto de Google Apps Script. No se publica en el sitio web y no se envía al cliente. Solo las personas autorizadas con acceso al proyecto pueden revisarlo mediante la función administrativa `reviewSecurityEvents`.

## Protección operativa

Un fallo del registro no debe impedir el funcionamiento del formulario. Los errores del propio registro se anotan únicamente en el registro de ejecución de Apps Script, sin copiar datos personales.
