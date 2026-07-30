# Prompt: Cobertores Web v0.3.1 — estado al 2026-07-30

## ✅ Ya resuelto y confirmado (Fase 15: Public SEO Avanzado)
- **JSON-LD Schema FAQ**: Se corrigió el bug de interpolación literal en `LandingClient.tsx` que afectaba los fragmentos enriquecidos de Google.
- **Optimización de Imágenes (Next.js vs Static Export)**: Debido a las restricciones de `output: export`, Next.js no puede optimizar imágenes. Se conectaron los componentes de Catálogo y Noticias a un Helper Dinámico de **Cloudinary** (`buildCloudinaryUrl`) para garantizar que las imágenes se sirvan siempre en formato WebP/AVIF y mitigar la alerta HIGH de auditoría SEO.
- **Rutas Dinámicas (`/noticias/[id]`)**: Se validó el inyector `generateMetadata` (OpenGraph/Twitter). Se actualizó para que consuma imágenes de Cloudinary y optimice el `NewsArticle` Schema.

## ✅ Ya resuelto y confirmado (Fase 14: Optimización, SEO y Paginación)
- **Compresión de Imágenes**: Uploads de Noticias y Catálogo optimizados al vuelo (`browser-image-compression`) bajo 500KB.
- **Paginación Pública de Noticias**: Listado asíncrono implementado en `/noticias` protegiendo memoria RAM del cliente mediante queries fraccionados de Firestore (`startAfter`).
- **SEO Dinámico Avanzado**: Validación de inyección programática de Open Graph (`og:image`, `og:title`) en `/noticias/[id]/page.tsx`.
- **Respaldos de Base de Datos**: Actualización de la Cloud Function a frecuencia diaria para mayor seguridad.

## ✅ Ya resuelto y confirmado (Fase 13: UX Intuitiva y Refactorización Estricta)
- **CMS Markdown**: Módulo de noticias mejorado con editor enriquecido y soporte `react-markdown` público.
- **Cotizador Inteligente**: Cálculos automáticos de IVA y Subtotal inyectados dinámicamente en UI.
- **Deuda Técnica TypeScript**: Limpieza exhaustiva de tipos `: any` (`SystemSettings`, `ProductsTab`, `QuoteGenerator`). Compilación SSG validada al 100%.
- **Navegación Perfecta**: Incorporación de `trailingSlash` para eliminar errores 404 de payloads RSC en Firebase Hosting con URLs limpias.

## ✅ Ya resuelto y confirmado (Fase 12: i18n & Seguridad Zero-Flicker)
- **Internacionalización Real Estática (i18n)**: Migración a URLs físicas `/es` y `/en` con `generateStaticParams`, reteniendo velocidad 100% SSG.
- **Diccionarios Corporativos**: Se crearon diccionarios de traducciones (`src/lib/i18n`) con inglés industrial B2B americano. Redirección raíz implementada.
- **Seguridad Intranet (Zero-Flicker)**: Implementación de `AuthProvider.tsx` para bloquear vistas no autorizadas a nivel de React Render Tree sin necesidad de middleware de servidor, manteniendo el despliegue puramente estático.

## ✅ Ya resuelto y confirmado (Fase 9: SEO & UI Avanzado)
- **Modo Claro / Oscuro Inteligente**: Refactorización profunda de Landing Page para soportar Light Mode responsivo sin hardcoding de colores.
- **SEO & Palabras Clave Dinámicas**: Habilitadas palabras clave editables (`seoKeywords`) desde `SystemSettings.tsx`.
- **Rich Snippets B2B**: Inyección de esquemas JSON-LD (`VideoObject`, `FAQPage`, etc) resueltos y desplegados en Firebase Hosting, corrigiendo alertas de Google Search Console.
- **Video Corporativo**: Hero banner actualizado a `<video>` autoejecutable.

## ✅ Ya resuelto y confirmado (Fase 8 Enterprise)
- Solución definitiva al error de App Check: La validación invisible (ReCAPTCHA V3) ya protege la Intranet sin bloquear el guardado ni lectura de Oficios/Cotizaciones.
- Crawler RSS escalado a límite configurable de hasta 150 noticias.
- Bugs de RSS resueltos: El backend ya no exige "correo verificado" a usuarios internos, y se pueden borrar noticias importadas sin imagen local sin crashear.
- Las imágenes de productos en el frontend cargan correctamente con la etiqueta estática nativa tras retirar el `output: export` conflictivo de Next.js.
- Animaciones Framer Motion y Scroll-Jacking implementados exitosamente.
- Paginación (Infinite Scroll Manual) implementada en el historial de cotizaciones.
- Todos los cambios respaldados en git (`v0.4.0`).

## Prioridad 1 — Pendiente (Roadmap Futuro)
1. **Verificar Dominio en Google Search Console**: Indispensable para indexar las cientos de noticias que genere el RSS.
2. **Generar Llaves de AppCheck reales**: Cambiar de ambiente "Auditoría" a ambiente protegido con las llaves de ReCAPTCHA reales generadas por el administrador.

## Prioridad 2 — Pendiente conocido (sin cambios, baja prioridad)
- `npm audit`: confirmado que no hay arreglo seguro disponible ahora mismo
  ni en raíz ni en `functions/` sin forzar cambios que rompen algo. No
  insistir en esto hasta que el ecosistema publique parches.
- ~35 issues de ESLint catalogados (comillas sin
  escapar en páginas legales, imports sin usar) — cosmético, no urgente.
- Fotografía real vs. stock de Unsplash.
- El Universal y Marca (RSS) rotas a propósito, sin reemplazo buscado.

## Prioridad 3 — Ranking / gráficas (gestión de Paco o próxima sesión)
- Botón flotante de WhatsApp para cotización rápida.
- Google Search Console, Google Business Profile, backlinks, reseñas.
- Sección de certificaciones/"por qué elegirnos" si aplica.

## Reglas de higiene de git (siguen vigentes)
- Nunca `git stash drop` sin confirmar que el trabajo ya está a salvo.
- Antes de cerrar una tarea, `git status`/`git diff` para confirmar que
  los cambios esperados siguen presentes.
- `revisiones/`, `respaldos/`, y `functions/lib/` ya NO se versionan —
  no te sorprendas si `git status` no los muestra, es lo correcto ahora.

## Formato de entrega esperado
Por cada punto: qué encontraste, qué corregiste, y qué requiere mi
decisión. Prueba en vivo con el navegador conectado cuando sea posible.
