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
