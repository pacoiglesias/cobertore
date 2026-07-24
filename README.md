# Mano Fil S.A. - Plataforma Corporativa B2B (cobertores.com)

Este repositorio contiene el código fuente de la plataforma web de Mano Fil S.A., desarrollada en Next.js (con App Router y exportación estática) y desplegada en Firebase Hosting.

---

## 🏗️ Arquitectura del Sistema

- **Frontend:** Next.js 16.2.11 (React 19.2.4) + TailwindCSS v4.
- **Backend:** Firebase (Firestore + Cloud Storage + Auth Anónimo/Email).
- **Despliegue:** Firebase Hosting.
- **SSG Export:** `output: 'export'` habilitado (Next.js genera archivos estáticos en la carpeta `out/`).

---

## 📂 Directorios Clave

- `/src/app`: Rutas del frontend (Páginas públicas, noticias, intranet, seguimiento, etc.).
- `/src/components`: Componentes reutilizables de UI (Logos, cards, etc.).
- `/functions`: Código de Firebase Cloud Functions (ej. descarga/sincronización RSS de noticias).
- `/public`: Archivos estáticos públicos (imágenes WebP optimizadas, logos oficiales, manifest.json).
- `/tests`: Pruebas unitarias de las reglas de seguridad de Firestore (`firestore.rules`).

---

## 🔒 Reglas de Seguridad y Configuración

### 1. Firestore (`firestore.rules`)
- **Súper Administradores:** Lista blanca estricta basada en correos electrónicos autorizados (`pacoismael@gmail.com`, `paco@cobertores.com`, `paco.iglesias@gmail.com`).
- **Verificación de Privilegios:** La función `hasValidPrivilege` verifica la existencia del documento en `user_privileges` usando `exists()` antes de consultar los datos de expiración con `get()`, evitando fallos silenciosos.

### 2. Cloud Storage (`storage.rules`)
- Los archivos en `/intranet/**` solo pueden ser cargados por Súper Administradores o usuarios con rol de `editor` verificado mediante consultas Firestore en vivo directamente desde las reglas de Storage.
- Los PDFs de cotizaciones `/quotes/**` son públicos para lectura (permitiendo descargas mediante enlaces compartidos), pero restringidos en escritura a usuarios del sistema.

---

## ⚡ Optimización de Imágenes para Core Web Vitals
Las imágenes del catálogo corporativo (`public/products/`) se encuentran en formato **WebP** y han sido reducidas en peso en un **90%** (de ~800KB a ~80KB cada una), lo que optimiza directamente la velocidad de carga y posicionamiento SEO móvil.

---

## 🧪 Pruebas Unitarias de Reglas (Emulator)

Para ejecutar las pruebas locales de seguridad para Firestore:

1. Asegúrate de tener el Firebase CLI instalado globalmente:
   ```bash
   npm install -g firebase-tools
   ```

2. Instala las dependencias necesarias de testing en la raíz:
   ```bash
   npm install -D @firebase/rules-unit-testing jest
   ```

3. Inicia el emulador de Firestore:
   ```bash
   firebase emulators:start --only firestore
   ```

4. En otra terminal, ejecuta los tests con Jest:
   ```bash
   npx jest tests/firestore-rules.spec.js
   ```

---

## 🚀 Despliegue en Producción

Dado que este proyecto está configurado para exportación estática (`output: 'export'`), cualquier actualización en configuraciones globales de SEO o plantillas RSS requiere recompilar y desplegar nuevamente:

```bash
# 1. Compilar el frontend
npm run build

# 2. Desplegar solo los archivos estáticos en Firebase Hosting
firebase deploy --only hosting
```
