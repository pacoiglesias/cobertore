# Changelog — Cobertores Web (Mano Fil S.A.)

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
