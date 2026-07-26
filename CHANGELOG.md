# Changelog — Cobertores Web (Mano Fil S.A.)

## [0.5.3] — 2026-07-26 (Fase 14: Optimización, SEO y Paginación Pública)

### Added
- **Compresión Inteligente de Imágenes**: Se integró `browser-image-compression` en `NewsManager.tsx` y `ProductsTab.tsx` para reducir hasta un 90% el tamaño de las fotografías locales (límite de 500KB o 1920px) antes de la subida a Firebase Storage, mejorando el rendimiento y reduciendo el consumo de ancho de banda.
- **Paginación Pública de Firestore**: El listado principal de noticias (`/noticias`) ahora pre-renderiza únicamente las últimas 12 publicaciones. La carga dinámica bajo demanda ("Cargar Más") utiliza cursores nativos (`startAfter`) para proteger la memoria RAM en dispositivos móviles.
- **SEO Dinámico Verificado**: Validación y ratificación del sistema `generateMetadata` en las URL individuales de artículos (`/noticias/[id]`), asegurando pre-renderización limpia de Open Graph (og:title, og:image) para una máxima compatibilidad al compartir en Facebook y WhatsApp.
- **Respaldos Intensivos de Base de Datos**: Reconfiguración de la Cloud Function `backupDatabase` de semanal (domingos) a **diario** (`every 24 hours`), garantizando recuperación granular del historial de cotizaciones.

## [0.5.1] — 2026-07-26 (Fase 13: UX Intuitiva y Refactorización Estricta)

### Added
- **CMS Markdown**: Se implementó un mini-editor Markdown en el módulo de Noticias (`NewsManager.tsx`) para permitir negritas, cursivas y listas; con renderizado dinámico en la web pública mediante `react-markdown`.
- **Cotizador Proactivo**: `QuoteGenerator.tsx` ahora muestra cálculos de Subtotal e IVA (16%) en tiempo real en la interfaz izquierda del formulario antes de la exportación a PDF.

### Fixed
- **Deuda Técnica TypeScript**: Se solucionaron múltiples errores de tipado (eliminación masiva de `: any`) en `SystemProvider`, `LandingClient`, `QuoteGenerator`, y más; validando el tipado estricto a través de `npm run build` con 100% de éxito.
- **Rendimiento React**: Eliminación de `useEffect` redundantes con dependencias vacías que hacían doble llamada a Firestore (optimizando la carga de Logos y Datos Bancarios en Cotizaciones).

## [0.5.0] — 2026-07-26 (Fase 12: Internacionalización y Seguridad Zero-Flicker)

### Added
- **Internacionalización Real Estática (i18n)**: Se implementaron las rutas `/es` y `/en` mediante `generateStaticParams` en Next.js. El renderizado estático (`output: 'export'`) se mantiene al 100% (cero servidor Node requerido). 
- **Diccionarios Corporativos**: Refactorización de traducciones (Inglés) hacia un tono industrial americano (e.g. "Standard Industrial Tilma").
- **Protección Zero-Flicker en Intranet**: Se creó `AuthProvider.tsx` como Route Guard para evitar parpadeos de interfaz y bloquear completamente accesos no autorizados a `/intranet/dashboard` en un entorno 100% estático, reemplazando la necesidad de `middleware.ts`.
- **Redirección Raíz**: La ruta principal `/` ahora ejecuta una redirección automática a `/es`.

## [0.4.0] — 2026-07-25 (Fase 9: SEO Avanzado, Modo Claro/Oscuro y Video)

### Added
- **Modo Claro / Oscuro Inteligente**: Refactorización de la Landing Page para soportar temas responsivos con `next-themes`. Nuevo Toggle en el Navbar público.
- **Video Corporativo IA**: Implementación de `<video>` HTML5 en autoplay, mute y loop (sin UI controls) con fallback de imagen en el hero principal.
- **SEO Dinámico (Palabras Clave)**: Ahora las etiquetas `<meta name="keywords">` se pueden modificar en vivo desde `SystemSettings.tsx` en la Intranet (leídas desde `system_settings/global`).
- **Esquemas JSON-LD (Rich Snippets)**: Integración de `VideoObject` y `FAQPage` en `page.tsx` para potenciar visibilidad en SERPs y corregir errores críticos de Search Console.
- **Backups y Despliegues Locales exitosos**: Validada la ejecución de `respaldo-cobertore.bat` y `firebase deploy`.

## [0.3.1] — 2026-07-25 (Fase 8 Enterprise & Bugfixes)

### Added
- **Paginación en Cotizaciones**: Implementación de Infinite Scroll manual ("Cargar más") en `QuotesHistoryManager` limitando a 20 documentos por petición.
- **Animaciones UI Premium**: Se integró `framer-motion` para transiciones fluidas en la Landing Page, Dual Navigation y la línea del tiempo móvil de Herencia Industrial.

### Fixed
- **App Check Permission Denied**: Se reestableció exitosamente la inicialización de `ReCaptchaV3Provider` en `firebase.ts`. Las reglas de Firestore ahora procesan el token y permiten nuevamente crear, editar y visualizar Oficios y Cotizaciones de forma segura.
- **Bugs en RSS Manager**: 
  - Se corrigió el error "Error al eliminar la noticia" agregando un bloque `try/catch` envolvente en `deleteObject` (Storage) dentro de `NewsManager.tsx`, ya que los items importados por RSS no poseen archivo de imagen físico y colapsaban el proceso de borrado.
  - Se corrigió "No se pudo actualizar el RSS" removiendo el requerimiento estricto `email_verified` en la Cloud Function `triggerNewsFetch`, asegurando que usuarios tipo 'Editor' creados de forma manual en consola puedan detonar el importador.
- **Renderizado Estático de Imágenes**: Tras problemas en despliegues SSG (`output: 'export'`), se revirtió el uso del componente `<Image>` de Next.js regresando al tag estándar `<img>` HTML en `DualNavigation.tsx` y listado de productos, restaurando las gráficas caídas en producción.
- Crawler RSS ampliado para importar hasta 150 elementos configurables desde Firebase.

## [0.2.0] — 2026-07-25

### Added
- **Datos bancarios editables**: nueva sección en `Configuración` del
  dashboard (Banco, RFC, Cuenta, CLABE). Antes estaban quemados como
  ejemplo en `QuoteGenerator.tsx` sin forma de cambiarlos. Se guardan en
  `system_settings/global` y se aplican **al instante** en la siguiente
  cotización (no requiere rebuild, a diferencia del SEO).
- **Oficios: guardado automático.** "Descargar" y "Enviar (WhatsApp)" ahora
  guardan el documento en el Historial como parte del mismo clic, en vez de
  depender de que también le dieras clic por separado a "Guardar Nuevo
  Documento" (botón que estaba lejos, en otra sección de la pantalla).

### Fixed
- RSS confirmado funcionando con fuentes reales: `Vanguardia MX` y
  `24-horas.mx` reemplazaron a ESPN/TVNotas (URLs muertas). Verificado
  trayendo artículos nuevos en español en vivo.
- `SystemSettings.tsx`: el "respaldo" de fuentes RSS (solo se usa si nadie
  ha guardado nada todavía) seguía apuntando a las URLs de Infobae que ya
  habíamos descartado — corregido para que coincida con lo que sí funciona.
- Reordenado `fetchDocuments` antes del `useEffect` que la usa en
  `OfficialDocumentsManager.tsx` (mismo patrón de bug ya corregido antes,
  se había vuelto a colar).

### Housekeeping
- `.gitignore`: agregado `/revisiones/`, `/respaldos/`, `/functions/lib/`
  — reportes de diagnóstico, backups locales y build compilado ya no se
  versionan en git (siguen existiendo en tu disco, solo dejan de subirse).
- Versión del proyecto: `0.1.0` → `0.2.0`.

### Known issues / pendiente
- **`npm audit fix` en `functions/` no cambió nada realmente** — se probó
  y confirmó que no hay diff en el lockfile; `brace-expansion` no tiene
  arreglo disponible sin forzar en este árbol de dependencias, y `uuid`
  requiere `--force` (degradaría `firebase-admin` a v10, no hacerlo).
  Queda en espera de que el ecosistema publique una versión compatible.
- App Check sigue sin implementar.
- El Universal y Marca (RSS) siguen rotas, dejadas así a propósito.
- 8 usos de `: any` en TypeScript, ~35 errores de ESLint catalogados
  (comillas sin escapar, imports sin usar) — ninguno bloqueante.
- 3 `high` en `npm audit` raíz (Next.js/PostCSS/sharp) — esperar patch de
  Next, no forzar downgrade.
- Fotografía real pendiente de reemplazar el stock de Unsplash.
- **Confirmar que `firebase login --reauth` + deploy de hosting y
  functions haya terminado bien** — se cortó por sesión de Firebase CLI
  expirada al cierre de esta sesión.
- **Sigue sin haber ningún respaldo (`respaldo-cobertore.bat`) corrido.**

## 2026-07-24 (sesiones previas)
Ver detalle completo en el historial de este archivo: hardening de
seguridad, IAM/Cloud Run para RSS, año de fundación 1962, `og-image.png`,
tamaño Carta en PDFs, menú móvil, y todo lo demás documentado sesión por
sesión.

## 2026-XX-XX (retroactivo)
### Added
- Commit inicial (`c9bf2c1`): scaffold de `create-next-app`.
