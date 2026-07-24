# Changelog — Cobertores Web (Mano Fil S.A.)

## [Unreleased]

### Fixed — pendiente de aplicar (en `cobertore-fixes-completo.zip`, sin confirmar deploy)
Un `git stash drop` accidental borró estos fixes antes de que llegaran a
GitHub; se reconstruyeron todos desde cero y se re-empaquetaron juntos en
un solo zip para evitar que se sigan fragmentando entre entregas:

- `layout.tsx`: `ReferenceError: logger is not defined` en cada carga de
  página — el `<script>` inline de registro del Service Worker usaba
  `logger.log`, pero ese script no tiene acceso a los imports de React.
- `QuoteGenerator.tsx` / `OfficialDocumentsManager.tsx`: quitado
  `allowTaint: true` de `html2canvas` (causaba `SecurityError` al exportar
  el PDF si las imágenes no tenían CORS configurado en Storage).
- `OfficialDocumentsManager.tsx`: `fetchDocuments` reordenada antes del
  `useEffect` que la llama (funcionaba por casualidad, ahora es explícito).
- `page.tsx` (home): agregado menú móvil completo (antes el nav estaba
  `hidden lg:flex`, invisible en celular/tablet sin alternativa), 6 links
  migrados de `<a>` a `<Link>`, `let`→`const` en el loop de service workers.
- `DualNavigation.tsx`: agregado `id="divisiones"` — el link del nav
  `#divisiones` no tenía a dónde apuntar.
- `seguimiento/page.tsx`, `intranet/page.tsx`: 2 links más migrados a `<Link>`.
- `intranet/dashboard/page.tsx`: botón "Volver al sitio público" agregado
  junto a "Cerrar Sesión" (antes no había forma de salir del dashboard).

### Fixed — confirmado en vivo y funcionando
- **RSS funcionando de extremo a extremo**, confirmado por Paco: "1
  noticia(s) nueva(s) importada(s) de 3 fuente(s)". Causa raíz: 2 permisos
  de Google Cloud faltantes (invocación pública de Cloud Run en
  `triggerNewsFetch`, y rol "Usuario de Cloud Datastore" para la cuenta de
  servicio default de Cloud Functions) — no eran bugs de código.

### Known issues / pendiente
- **Aplicar `cobertore-fixes-completo.zip`, correr `revisar-cobertore.bat`,
  y confirmar build limpio antes de desplegar** — es el primer paso de la
  siguiente sesión.
- **Auditoría en vivo de Cotizaciones (PDF), Oficios, y Catálogo — sigue
  sin hacerse.** Usar el navegador conectado (Claude para Chrome) para
  probar cada botón real.
- Confirmar si `fetchNewsPeriodically` (cron de 6h) también necesitaba el
  rol de Cloud Datastore o ya lo tenía.
- App Check, datos bancarios reales o de ejemplo, `npm audit` (esperar
  patch de Next), fotografía real vs. stock — sin cambios, prioridad baja.

### Lección de esta sesión
- **Nunca usar `git stash drop` sin haber confirmado antes que el trabajo
  ya se entregó/empaquetó.** Usar `git stash pop` como default, o revisar
  `git stash list` / `git diff` antes de descartar cualquier stash.
- Los scripts `respaldo-cobertore.bat` y `revisar-cobertore.bat` (ya
  entregados) existen precisamente para que esto no vuelva a pasar del
  lado del repo real — pero la sesión de Claude también necesita su propia
  disciplina de no descartar trabajo sin confirmar que está a salvo primero.

## 2026-07-24 (sesiones 1-3 — hardening, RSS, gráficos, ranking)
Ver entradas anteriores para el detalle completo: reglas de seguridad,
`firebase-functions` estable, año de fundación 1962, `og-image.png`,
íconos PWA, `manifest.json` correcto.

## 2026-XX-XX (retroactivo)
### Added
- Commit inicial (`c9bf2c1`): scaffold de `create-next-app`.
