# Conectar el formulario con Gmail mediante Google Apps Script

El formulario ya está diseñado en `index.html`. Para activarlo hay que publicar el archivo `google-apps-script/Code.gs` desde la cuenta **smarttaxes2@gmail.com** y copiar en la web la URL generada.

> Nunca compartas la contraseña de Gmail ni códigos de verificación.

## 1. Crear el proyecto

1. Inicia sesión en Google con **smarttaxes2@gmail.com**.
2. Abre [Google Apps Script](https://script.google.com/).
3. Selecciona **Nuevo proyecto**.
4. Cambia el nombre del proyecto a **Formulario Smart Taxes**.
5. Abre el archivo `google-apps-script/Code.gs` de este repositorio.
6. Copia todo su contenido.
7. En Apps Script, elimina el código de ejemplo del archivo `Code.gs` y pega el código copiado.
8. Pulsa **Guardar proyecto**.

## 2. Publicar como aplicación web

1. En la esquina superior derecha, pulsa **Implementar**.
2. Selecciona **Nueva implementación**.
3. En **Seleccionar tipo**, elige **Aplicación web**.
4. En la descripción escribe: **Formulario web Smart Taxes**.
5. En **Ejecutar como**, selecciona **Yo (smarttaxes2@gmail.com)**.
6. En **Quién tiene acceso**, selecciona **Cualquier usuario**.
7. Pulsa **Implementar**.
8. Google solicitará autorización. Revisa los permisos y autoriza el envío de correos.
9. Copia la **URL de la aplicación web**. Debe terminar en `/exec`.

La URL de prueba terminada en `/dev` no debe colocarse en la página pública.

## 3. Conectar la URL con el formulario

En `index.html` existe esta línea:

```html
<form class="consultation-form" id="consultation-form" data-endpoint="" novalidate>
```

Coloca la URL copiada entre las comillas de `data-endpoint`:

```html
<form class="consultation-form" id="consultation-form" data-endpoint="PEGA_AQUÍ_LA_URL_TERMINADA_EN_EXEC" novalidate>
```

También puedes enviar esa URL en la conversación de Codex para que se actualice el archivo por ti. La URL de implementación no es la contraseña de Gmail.

## 4. Probar

1. Abre la página publicada.
2. Completa el formulario usando datos de prueba que no sean confidenciales.
3. Pulsa **Enviar solicitud**.
4. Revisa la bandeja de entrada y la carpeta de spam de **smarttaxes2@gmail.com**.
5. Confirma que el mensaje contiene el nombre, teléfono, correo, servicio y consulta.

## 5. Seguridad y mantenimiento

- El formulario prohíbe enviar SSN, ITIN, información bancaria, contraseñas y documentos fiscales.
- Incluye validación en la página, validación en Apps Script, un campo antispam y un límite básico de una solicitud por correo cada cinco minutos.
- Gmail y Apps Script aplican cuotas diarias. Si el volumen crece, conviene migrar a un sistema de formularios transaccional.
- Si modificas `Code.gs`, crea una nueva versión desde **Administrar implementaciones** para publicar el cambio.
- No publiques contraseñas, claves privadas ni códigos de recuperación en GitHub.
