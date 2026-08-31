# Respuestas — Taller Introducción a React Native

Parte 1 — Componente teórico · Preguntas 1 a 4

---

## Pregunta 1 — Entorno de desarrollo y sistema operativo

### a) Papel de cada herramienta

| Herramienta | ¿Qué papel cumple? |
| --- | --- |
| Node.js y npm | Node.js es el entorno de ejecución de JavaScript fuera del navegador que usa el proyecto; npm es el gestor de paquetes que instala y administra las dependencias (React, Expo, Firebase, etc.) declaradas en `package.json`. |
| Metro bundler | Es el empaquetador de JavaScript de React Native: toma el código fuente y sus dependencias, las transforma y las combina en un bundle ejecutable en el dispositivo, además de habilitar la recarga en caliente. |
| JDK y Android SDK | El JDK compila el código Java/Kotlin nativo de Android; el SDK aporta las herramientas, librerías y el emulador necesarios para compilar y ejecutar apps Android. |
| Xcode | IDE oficial de Apple; incluye el compilador, los simuladores de iOS y las herramientas de firma necesarias para compilar y ejecutar apps en iOS. Solo corre en macOS. |
| Expo Go | App cliente que interpreta el bundle de JavaScript en un dispositivo real sin compilar código nativo, agilizando las pruebas durante el desarrollo. |

### b) Compilar para iOS desde Windows o Linux

Compilar para iOS requiere Xcode, que solo se ejecuta en macOS; Windows y Linux no tienen acceso al compilador ni a los simuladores de Apple, y Apple no lo licencia para otros sistemas operativos. Alternativas reales: usar EAS Build (servicio en la nube de Expo que compila el `.ipa` en servidores macOS remotos) o acceder a una Mac física o virtual (propia, prestada o alquilada, por ejemplo mediante MacStadium) para compilar y publicar en App Store Connect.

### c) Variables de entorno y emulador Android

Son valores que el sistema operativo mantiene disponibles y que los programas consultan al iniciarse (rutas de herramientas, configuración regional, etc.). El emulador de Android falla si `ANDROID_HOME` o el `PATH` están mal configurados porque las herramientas (`adb`, `emulator`, `sdkmanager`) no se encuentran en el sistema y los comandos no se reconocen. Una variable de usuario solo aplica a la sesión del usuario que la definió; una variable de sistema aplica a todos los usuarios y procesos de la máquina.

### d) Expo frente a React Native CLI

Expo — ventajas: configuración inicial mínima (no requiere Xcode/Android Studio para empezar) y actualizaciones OTA sin pasar por las tiendas; limitaciones: los módulos nativos personalizados exigen "prebuild"/eject, y algunas librerías nativas de terceros no son compatibles directamente. React Native CLI — ventajas: control total del código nativo (Java/Kotlin, Swift/Objective-C) y libertad para integrar cualquier librería nativa; limitaciones: exige instalar y mantener Android Studio/Xcode y la configuración es más compleja. Elegiría Expo para prototipos o apps sin necesidades nativas avanzadas, y CLI cuando el proyecto requiere módulos nativos muy específicos.

---

## Pregunta 2 — Fundamentos de React Native

### a) Equivalencia web → React Native

| En la web | En React Native |
| --- | --- |
| `<div>` | `View` |
| `<p>` o `<span>` | `Text` |
| `<img>` | `Image` |
| `<input>` | `TextInput` |
| Lista larga con scroll | `FlatList` (o `SectionList`) |

### b) Estilos de React Native vs CSS

Tres diferencias: (1) los estilos se definen como objetos de JavaScript (`StyleSheet.create`), no en archivos `.css` con selectores; (2) las medidas no llevan unidad — son *density-independent pixels*, sin porcentajes complejos ni media queries como en la web; (3) no hay cascada/herencia automática entre componentes (salvo en `Text`, cuyos hijos heredan el estilo de texto), cada componente se estila explícitamente. El valor por defecto de `flexDirection` es `"column"` (a diferencia de `"row"` en CSS web), porque las pantallas móviles son predominantemente verticales y el contenido natural fluye de arriba hacia abajo.

### c) Props vs estado

Las props son datos que un componente recibe desde su padre y no puede modificar (de solo lectura); el estado es información interna que el propio componente gestiona y puede cambiar con el tiempo, provocando un nuevo render. En una pantalla de lista de productos, el nombre y el precio de un producto (vienen del padre o del backend) serían props del componente `Item`; si el producto está seleccionado por el usuario, o si se muestra un indicador de carga, sería estado.

---

## Pregunta 3 — Manejo de pantallas y navegación

### a) Tipos de navegador

| Navegador | ¿Para qué sirve? | Caso de uso |
| --- | --- | --- |
| Stack | Apila pantallas una sobre otra; permite avanzar y regresar. | Lista de contactos → Detalle → Edición. |
| Tabs | Pestañas fijas (arriba o abajo) para secciones independientes de la app. | Alternar entre "Inicio", "Buscar" y "Perfil". |
| Drawer | Menú lateral deslizable, para muchas opciones o navegación secundaria. | Menú de configuración, ayuda, cerrar sesión. |

### b) Contenedor de la navegación

El `NavigationContainer` administra el árbol de navegación, conecta la app con el estado de navegación del dispositivo (botón atrás de Android, deep links, etc.) y sincroniza el historial de pantallas. Debe existir uno solo porque gestiona un único árbol de estado de navegación; tener más de uno generaría conflictos e inconsistencias entre el estado real de la app y lo que ve el usuario.

### c) Envío de parámetros

Se envía llamando a `navigation.navigate('Pantalla', { parametro: valor })` y se lee en la pantalla destino con `route.params.parametro`. Conviene enviar únicamente el identificador (`id`) y no el objeto completo, porque el dato puede cambiar en el origen (por ejemplo en Firestore) y enviar solo el id obliga a la pantalla destino a consultar siempre la versión más actual, evitando mostrar información desactualizada.

### d) Estado al regresar de una pantalla

Por defecto, React Navigation no recrea la pantalla A desde cero al regresar desde B: la mantiene montada en la pila y conserva su estado, como si la hubiera "pausado". Esto implica que si A muestra una lista que debe reflejar un registro creado en B, no basta con esperar a que A se remonte: hay que forzar la actualización explícitamente, por ejemplo con un listener en tiempo real (`onSnapshot`) o refrescando al recibir el evento `focus`.

### e) Botón / gesto de regresar en Android e iOS

En Android existe un botón físico/gesto de sistema para "atrás" que cualquier app debe interceptar; en iOS no existe ese botón y el retroceso se hace deslizando desde el borde izquierdo de la pantalla o tocando el botón de la cabecera. La librería de navegación resuelve esta diferencia dando un comportamiento unificado: intercepta el botón de Android y habilita automáticamente el gesto de swipe en iOS, sin que el desarrollador tenga que programar cada uno por separado.

---

## Pregunta 4 — Configuración base de Firebase

### a) Pasos para dejar Firebase listo

1. Crear el proyecto en la consola de Firebase.
2. Registrar dentro de él una app (tipo Web, ya que Expo/React Native usa el SDK web de Firebase).
3. Copiar el objeto de configuración (`apiKey`, `projectId`, etc.) que entrega la consola.
4. Habilitar Cloud Firestore y definir sus reglas de seguridad.
5. Instalar el SDK (`npm install firebase`) en el proyecto.
6. Centralizar la inicialización (`initializeApp` y `getFirestore`) en un único archivo que el resto de la app importe, leyendo los valores desde variables de entorno.

### b) Claves del objeto de configuración

| Clave | ¿Qué identifica? |
| --- | --- |
| apiKey | Clave que identifica la petición como perteneciente a un proyecto de Firebase concreto (no es un secreto de autenticación). |
| projectId | Identificador único del proyecto de Firebase al que pertenecen todos sus servicios (Firestore, Auth, etc.). |
| appId | Identificador único de esta aplicación específica registrada dentro del proyecto (puede haber varias apps —web, Android, iOS— por proyecto). |
| storageBucket | Nombre del bucket de Cloud Storage asociado al proyecto, usado para guardar archivos como imágenes. |

### c) apiKey visible en el paquete

No es una falla de seguridad por sí sola porque la `apiKey` solo identifica ante los servidores de Google a qué proyecto de Firebase pertenece la petición; no otorga permisos por sí misma. La protección real de los datos reside en las reglas de seguridad de Firestore (Firestore Security Rules), que del lado del servidor determinan quién puede leer o escribir cada documento, sin importar que la `apiKey` sea pública.

### d) Modo de prueba vs producción

En modo de prueba, Firestore permite lectura y escritura sin restricciones a cualquiera durante un plazo limitado (usualmente 30 días), pensado solo para desarrollo; en modo de producción las reglas deniegan todo por defecto y hay que declarar explícitamente qué operaciones se permiten y a quién. El riesgo concreto de publicar con reglas en modo de prueba es que cualquier persona con la configuración del proyecto (fácilmente extraíble) puede leer, modificar o borrar toda la base de datos sin autenticarse.

### e) Cloud Firestore vs Realtime Database

1. **Modelo de datos:** Firestore organiza la información en colecciones y documentos con subcolecciones anidadas; Realtime Database es un único árbol JSON gigante.
2. **Consultas:** Firestore soporta consultas compuestas, filtros e índices más potentes; Realtime Database tiene consultas más limitadas, sin filtros compuestos nativos.
3. **Escalabilidad y precio:** Firestore escala mejor horizontalmente y cobra por operación de lectura/escritura; Realtime Database cobra por ancho de banda y almacenamiento, y puede volverse lento con datasets grandes.

Para la app de la Parte 2 elegiría Cloud Firestore, porque el modelo de colección `contactos` con documentos independientes encaja naturalmente con su estructura y permite consultas y actualizaciones en tiempo real eficientes con `onSnapshot`.
