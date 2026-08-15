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

La configuración provisional conserva los eventos durante 90 días y mantiene un máximo de 500 registros. Los eventos más antiguos se eliminan automáticamente. Este plazo debe revisarse al aprobar la política general de conservación del WISP.

## Ubicación y acceso

El registro se guarda de forma privada en las propiedades del proyecto de Google Apps Script. No se publica en el sitio web y no se envía al cliente. Solo las personas autorizadas con acceso al proyecto pueden revisarlo mediante la función administrativa `reviewSecurityEvents`.

## Protección operativa

Un fallo del registro no debe impedir el funcionamiento del formulario. Los errores del propio registro se anotan únicamente en el registro de ejecución de Apps Script, sin copiar datos personales.
