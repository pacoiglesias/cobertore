# Bitácora de Auditoría y Resoluciones Técnicas (Mano Fil ERP)

> Esta bitácora documenta todos los cambios técnicos profundos, optimizaciones y deuda saldada del proyecto para mantener un registro histórico en las auditorías de código.

## Auditoría Activa - v2.1.0 (2026-07-30)

### 🔴 Deuda Técnica Crítica
- **Problema:** `page.tsx` actuaba como un controlador masivo de 40KB que cargaba todos los módulos (Cotizador pesado con jsPDF, Tablas, Gráficas, CMS) en el hilo principal del cliente desde el primer montaje, causando bloqueos (*main thread blocking*).
- **Resolución:** Se refactorizó usando `next/dynamic` para implementar Lazy Loading en las 8 pestañas principales del Dashboard (`QuoteGenerator`, `AnalyticsDashboard`, `LeadsTab`, etc.). Ahora el JavaScript se transfiere al navegador de forma asíncrona solo si el usuario entra a esa pestaña.

### 🟡 Deuda de Rendimiento y Lógica
- **Problema:** Cálculos financieros (`subtotal`, `iva`, `total`) en `QuoteGenerator.tsx` se realizaban sin memoización en cada render del componente.
- **Resolución:** Se implementó `React.useMemo` envolviendo los cálculos matemáticos para que solo se recalculen cuando la variable `items` muta.

### 🔵 Seguridad y Rules
- **Problema:** En caso de que se vulneraran los sistemas de contraseñas, no había capa de contención secundaria en base de datos.
- **Resolución:** Se ajustó `firestore.rules` (funciones `isSuperAdmin` y `hasValidPrivilege`) inyectando validación mandatoria `request.auth.token.email_verified == true` (si el Auth Provider de Firebase lo soporta) previniendo ediciones de usuarios no verificados.

### 🟢 Experiencia Sensorial B2B
- **Problema:** Falta de *micro-feedback* durante las transacciones y layout shifts al gestionar prospectos.
- **Resolución:**
  1. Se inyectó `AnimatePresence` (`framer-motion`) en `LeadsTab.tsx` para animaciones fluidas (layout animations).
  2. Se desarrolló un hook propietario ultra-ligero `useAudioFeedback.ts` basado nativamente en la `Web Audio API` (osciladores) eliminando la necesidad de importar archivos estáticos `.mp3` o librerías externas pesadas. Se integró exitosamente a acciones críticas de `page.tsx` (borrar, editar, actualizar estados y notificaciones snapshot).

### 2026-07-30: Fase Pública SEO Avanzado
- **JSON-LD Schema FAQ**: Se corrigió el bug de interpolación literal en LandingClient.tsx que afectaba los fragmentos enriquecidos de Google.
- **Optimización de Imágenes (Next.js vs Static Export)**: Debido a las restricciones de output: export, Next.js no puede optimizar imágenes. Se conectaron los componentes de Catálogo y Noticias a un Helper Dinámico de **Cloudinary** (uildCloudinaryUrl) para garantizar que las imágenes se sirvan siempre en formato WebP/AVIF y mitigar la alerta HIGH de auditoría SEO.
- **Rutas Dinámicas (/noticias/[id])**: Se validó el inyector generateMetadata (OpenGraph/Twitter). Se actualizó para que consuma imágenes de Cloudinary y optimice el NewsArticle Schema.
- **Verificación de Compilación**: 
pm run build ejecutado exitosamente sin roturas de SSG.
