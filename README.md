# Enterlist

Enterlist es una aplicación web orientada a la **gestión y organización de contenido de entretenimiento personal**, permitiendo a los usuarios llevar un registro estructurado de películas y libros que desean consumir o que ya han consumido, junto con información relevante como estado, calificación y notas.

El proyecto está desarrollado bajo una **arquitectura cliente–servidor apoyada en Firebase**, con un enfoque en **seguridad, modularidad y escalabilidad**, permitiendo la incorporación futura de nuevos tipos de contenido y servicios externos sin modificar la base del sistema.

---

## 🚀 Características principales

- Autenticación de usuarios mediante **Google Sign-In**.
- Creación y gestión de **listas de entretenimiento**.
- Búsqueda de contenido real mediante **APIs externas**.
- Gestión de estados (pendiente, en progreso, terminado).
- Calificaciones y notas personales.
- Persistencia de datos en la nube.
- Arquitectura preparada para futuras ampliaciones.

Actualmente, el sistema soporta:

- **Películas** (TMDb API)
- **Libros** (Google Books API)

---

## 🧱 Arquitectura del sistema

Enterlist utiliza una arquitectura basada en **Frontend + Firebase (Backend as a Service)**, separando claramente responsabilidades entre presentación, lógica de integración y persistencia de datos.

### Frontend

- HTML5
- CSS3
- JavaScript Vanilla
- Single Page Application (SPA)
- Enrutamiento del lado del cliente

El frontend se encuentra en la carpeta `public/` y se sirve mediante **Firebase Hosting**, utilizando reglas de reescritura para garantizar el correcto funcionamiento del routing.

### Backend / Servicios en la nube

- **Firebase Authentication**: gestión segura de usuarios mediante Google.
- **Cloud Firestore**: base de datos NoSQL para almacenar usuarios, listas e ítems de contenido.
- **Firebase Functions**: capa intermedia para la comunicación segura con APIs externas que requieren **API Keys privadas**.

El uso de Cloud Functions evita la exposición de credenciales sensibles en el frontend y centraliza el acceso a servicios externos.

---

## 🔌 APIs utilizadas

### TMDb API

- Uso: búsqueda y obtención de información de **películas**.
- Datos obtenidos: título, descripción, imagen de portada y fecha de lanzamiento.

### Google Books API

- Uso: búsqueda y obtención de información de **libros**.
- Datos obtenidos: título, autores, descripción, portada y número de páginas.

> Otras APIs y tipos de contenido están contemplados para versiones futuras, pero **no forman parte del alcance actual del proyecto**.

---

## 📁 Estructura del proyecto

```text
.firebaserc
.gitignore
.vscode/
functions/
live-server.json
public/
```

### Descripción de carpetas

- `public/`: contiene el frontend de la aplicación (HTML, CSS, JavaScript y recursos estáticos).
- `functions/`: contiene las **Firebase Cloud Functions**, responsables de la comunicación con APIs externas.
- `.firebaserc`: configuración del proyecto Firebase.
- `live-server.json`: configuración para entorno de desarrollo local (uso secundario).
- `.vscode/`: configuraciones del editor.

---

## ⚙️ Requisitos del sistema

- **Node.js** v20.16.0
- **Firebase CLI** v13.26.0
- Cuenta y proyecto activos en Firebase

---

## 🧪 Comandos principales

### Desarrollo local (recomendado)

Ejecución del proyecto utilizando **Firebase Emulator**, replicando el entorno real de producción y asegurando el correcto funcionamiento del enrutamiento SPA:

```bash
firebase emulators:start --only hosting,functions
```

Este comando levanta:
- Firebase Hosting local
- Firebase Functions locales

### Desarrollo local alternativo (no recomendado para producción)

```bash
live-server public --entry-file=index.html
```

### Despliegue del frontend (Hosting)

```bash
firebase deploy --only hosting
```

### Despliegue de Cloud Functions

```bash
firebase deploy --only functions
```

### Despliegue completo

```bash
firebase deploy
```

---

## 📈 Escalabilidad y evolución

El diseño del sistema permite:

- Integrar nuevas APIs de contenido.
- Añadir nuevos tipos de listas y elementos.
- Incorporar funcionalidades avanzadas o premium.
- Mejorar progresivamente pruebas, métricas y control de calidad del software.

---

## 👤 Autor

Proyecto académico desarrollado como parte de una materia de **Ingeniería de Software / Desarrollo de Proyectos Informáticos**.

---

> Este documento describe el **estado actual real del proyecto** y sirve como base para documentación técnica, académica y futura evolución del sistema.

