# Bitácora de Auditoría de Automejora Continua
**Proyecto:** ERP Cobertores (Mano Fil S.A.)
**Fecha de Auditoría:** 2026-07-29

## Hallazgos y Resoluciones

### 1. [CRÍTICO] Full Table Scans en la Intranet (Firestore)
- **Fecha:** 2026-07-29
- **Archivo:** `src/app/intranet/dashboard/page.tsx`
- **Problema:** Los listeners `onSnapshot` de `leadsQuery`, `productsQuery`, `ordersQuery` e `intranet_files` no tenían límite de paginación (`limit()`), lo que provocaba la descarga íntegra de la base de datos al abrir el panel, resultando en lentitud extrema en el cliente y un consumo masivo de cuotas de lectura de Firebase.
- **Solución/Estado:** [RESUELTO] Se agregó `limit(150)` a todas las consultas del dashboard para proteger la memoria del navegador y la facturación de Firebase.

### 2. [CRÍTICO] Out of Memory (OOM) en Respaldo Automático
- **Fecha:** 2026-07-29
- **Archivo:** `functions/src/index.ts`
- **Problema:** La Cloud Function `backupDatabase` utilizaba `await db.collection(...).get()` y cargaba todo el array en memoria (`backupData`), lo que provocaría un error "Out of Memory" y la caída del servicio de respaldos al superar los límites de RAM de la función.
- **Solución/Estado:** [RESUELTO] Se refactorizó la función para utilizar `db.collection(...).stream()` y un `createWriteStream` hacia Google Cloud Storage, permitiendo respaldar gigabytes de datos con un consumo mínimo y estable de memoria.

### 3. [MODERADO] Bypass de Anti-Spam en Cotizaciones Públicas
- **Fecha:** 2026-07-29
- **Archivo:** `firestore.rules`
- **Problema:** Las reglas de la colección `leads` validaban el esquema de datos pero no exigían criptográficamente la validez del token de App Check (`request.app != null`), dejando la puerta abierta a bots que supieran el formato del JSON.
- **Solución/Estado:** [RESUELTO] Se agregó `request.app != null` a la regla `allow create` de `leads` para hacer obligatorio el token de reCAPTCHA v3 Enterprise.

### 4. [MODERADO] Arquitectura de Autenticación Basada en Email
- **Fecha:** 2026-07-29
- **Archivo:** `firestore.rules`
- **Problema:** La función `hasValidPrivilege` buscaba los roles del usuario quemando el `.email` como ID de documento, lo cual es frágil si el usuario cambia de correo.
- **Solución/Estado:** [RESUELTO] Se reescribió `hasValidPrivilege` usando variables (`let`) nativas de Firestore Rules v2 para soportar la búsqueda por `request.auth.uid` (recomendado) manteniendo la retrocompatibilidad con `request.auth.token.email` sin multiplicar los costos de lectura.

### 5. [BAJA PRIORIDAD] Congestión de Interfaz en el CRM (UI/UX)
- **Fecha:** 2026-07-29
- **Archivo:** src/app/intranet/dashboard/components/LeadsTab.tsx
- **Problema:** El CRM mostraba el 100% de las tarjetas de leads (prospectos) de golpe. En escenarios de cientos de leads, el navegador se trababa al intentar renderizar tantas tarjetas simultáneamente, afectando la experiencia en dispositivos móviles.
- **Solución/Estado:** [RESUELTO] Se introdujo un sistema de paginación visual ("Mostrar más") que renderiza únicamente de 20 en 20 tarjetas por columna, garantizando fluidez sin importar el volumen de prospectos.

### 6. [BAJA PRIORIDAD] Correos Súper Admin Hardcodeados (Mantenibilidad)
- **Fecha:** 2026-07-29
- **Archivo:** src/lib/authorization.ts y unctions/src/index.ts
- **Problema:** Los correos electrónicos de los súper administradores estaban "quemados" directamente en el código fuente. Esto es una mala práctica porque dificulta revocar o agregar acceso sin modificar el código fuente, hacer un nuevo commit y desplegar el sistema.
- **Solución/Estado:** [RESUELTO] Se abstrajeron los correos usando variables de entorno (NEXT_PUBLIC_SUPER_ADMIN_EMAILS en el frontend y SUPER_ADMIN_EMAILS en el backend) para inyectarlos dinámicamente y de forma segura.

### 7. [CRÍTICO] Bug de SEO: Canonical Hijacking en Rutas Internas
- **Fecha:** 2026-07-29
- **Archivo:** src/app/layout.tsx y src/app/noticias/[id]/page.tsx
- **Problema:** El layout principal forzaba la propiedad lternates: { canonical: '/' } a todas las páginas hijas. Como resultado, Google Search Console etiquetaba las noticias y páginas internas como "Duplicadas", negándose a indexarlas bajo la creencia de que todas eran simplemente la página principal (/es).
- **Solución/Estado:** [RESUELTO] Se eliminó la etiqueta canónica global del layout.tsx y se implementó una etiqueta dinámica canonical: '/noticias/[id]' en la plantilla de noticias.
