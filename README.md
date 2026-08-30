# Directorio de Contactos

**Nombre completo:** [Completar con tu nombre completo]

**Sistema operativo:** Linux

Aplicación móvil de tres pantallas (lista, detalle y registro) hecha con Expo, React Navigation (Stack) y Cloud Firestore. Taller de Introducción a React Native — Tecnológico de Antioquia.

## Requisitos

- Node.js LTS
- Expo Go en el celular, o un emulador Android
- Una cuenta de Google para la consola de Firebase

## Cómo ejecutar el proyecto

1. Clonar el repositorio e instalar dependencias:

```bash
git clone <url-del-repositorio>
cd directorio-contactos-mobile
npm install
```

2. Copiar el archivo de ejemplo de variables de entorno y llenarlo con las claves de tu proyecto de Firebase (consola → Project settings → Your apps → app web):

```bash
cp .env.example .env
```

3. En Firebase Console:

   - Crear un proyecto y registrar una aplicación web.
   - Activar Cloud Firestore (modo de prueba está bien para el taller).
   - Crear la colección `contactos`.
   - Agregar manualmente tres documentos con los campos `nombre`, `telefono` y `ciudad` (sin tilde en `telefono`).

4. Arrancar Metro y abrir la app:

```bash
npx expo start
```

Escanea el código QR con Expo Go (Android) o la cámara (iOS). En Linux, para emulador Android:

```bash
npx expo start --android
```

Después de cambiar el `.env` hay que detener Metro y volver a ejecutar `npx expo start` para que tome las variables.

## Capturas

La carpeta `capturas/` debe incluir cuatro imágenes:

1. Pantalla de lista de contactos
2. Pantalla de detalle
3. Pantalla de nuevo contacto
4. Consola de Firestore mostrando un contacto creado desde el dispositivo
