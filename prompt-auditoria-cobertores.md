# Prompt: Cobertores Web — estado real (2026-07-24, fin de sesión)

## Primer paso obligatorio de la próxima sesión
Antes que nada, aplicar `cobertore-fixes-completo.zip` (8 archivos) al
repo, correr `revisar-cobertore.bat`, y confirmar build limpio. Ese zip
reconstruye trabajo que se perdió por un `git stash drop` accidental — ver
`CHANGELOG.md` para el detalle exacto de qué contiene.

## 📓 Flujo de trabajo (usa los scripts, en este orden)
1. `respaldo-cobertore.bat` — antes de tocar cualquier cosa.
2. Aplicar cambios.
3. `revisar-cobertore.bat` — confirma que build/tipos/lint siguen sanos.
4. `deploy-cobertore.bat` — solo si el paso 3 salió limpio.
5. Actualizar `CHANGELOG.md` bajo `[Unreleased]` (regla ya en `AGENTS.md`).

## ✅ Ya resuelto y confirmado EN VIVO
- RSS funcionando de extremo a extremo (probado, importó noticias reales).
  Causa raíz: permisos de Google Cloud IAM, no código.
- Seguridad de rules, versión estable de `firebase-functions`, año de
  fundación consistente, `og-image.png`, íconos PWA, manifest correcto.

## ⏳ Reconstruido pero sin confirmar deploy (aplicar primero)
- Fix de `logger is not defined`, menú móvil, `#divisiones`, 8 links a
  `Link`, fix de PDF (`allowTaint`), botón volver al inicio en dashboard.
  Todo en `cobertore-fixes-completo.zip`.

## Prioridad 1 — Pendiente real
1. **Auditoría en vivo de Cotizaciones (PDF), Oficios, y Catálogo** — no
   se ha hecho todavía. Usar el navegador conectado, probar cada botón
   real, y si algo falla revisar logs reales en Cloud Run → Registros
   antes de asumir la causa (así se encontraron los bugs de IAM).
2. Confirmar si `fetchNewsPeriodically` también necesitaba el rol de
   Cloud Datastore.

## Prioridad 2 — Pendiente conocido (sin cambios)
- App Check, datos bancarios en `QuoteGenerator.tsx`, `npm audit`
  (esperar patch de Next, no forzar downgrade), fotografía real vs. stock,
  8 usos de `: any`.

## Prioridad 3 — Ranking (gestión de Paco, fuera del código)
- Google Search Console, Google Business Profile, backlinks, reseñas.

## Reglas de higiene de git para esta sesión
- Nunca `git stash drop` sin haber confirmado antes que el trabajo ya se
  entregó o está seguro en otro lado. Preferir `git stash pop`.
- Antes de cerrar una tarea, confirmar con `git status`/`git diff` que los
  cambios esperados siguen presentes, no solo que se hicieron en algún
  momento de la sesión.

## Formato de entrega esperado
Por cada punto: qué encontraste, qué corregiste, y qué requiere mi
decisión. Si es posible probarlo en vivo con el navegador conectado,
pruébalo — no asumas que un fix de código funciona hasta verlo funcionar
en la app real.
