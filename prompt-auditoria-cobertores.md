# Prompt: Cobertores Web v0.2.0 — estado al 2026-07-25

## Primer paso obligatorio de la próxima sesión
1. Confirmar que `firebase login --reauth` + `firebase deploy --only
   hosting,functions` terminaron bien (se cortó por sesión expirada al
   cierre de la sesión anterior).
2. Aplicar `cobertore-final-v0.2.0.zip` (datos bancarios editables +
   `.gitignore` limpio + versión 0.2.0) si no se ha hecho.
3. Correr estos 2 comandos de limpieza de git (quitan del control de
   versiones el build compilado y los reportes de diagnóstico, que ahora
   están en `.gitignore` — se quedan en tu disco, solo dejan de subirse):
   ```
   git rm -r --cached functions/lib revisiones
   ```
4. **Correr `respaldo-cobertore.bat` — sigue sin haber ningún respaldo
   hecho en todas estas sesiones.** Es la prioridad de higiene más
   importante pendiente.

## 📓 Flujo de trabajo (sin cambios)
1. `respaldo-cobertore.bat` — antes de tocar cualquier cosa.
2. Aplicar cambios.
3. `revisar-cobertore.bat` — confirma build/tipos/lint sanos (ya limpia
   `.next`/`out`/`functions\lib` antes de compilar).
4. `todo-en-uno.bat` o los pasos manuales — solo si el paso 3 salió limpio.
5. Actualizar `CHANGELOG.md` bajo `[Unreleased]` (regla ya en `AGENTS.md`).

## ✅ Ya resuelto y confirmado
- RSS funcionando con fuentes reales (Vanguardia, 24-horas, Tlaxcala,
  Coldwell Banker).
- Oficios: guardado automático al descargar/enviar.
- Datos bancarios editables desde el dashboard, sin necesitar rebuild.
- Seguridad de rules, PDFs en tamaño Carta, año de fundación consistente,
  menú móvil, logger corregido, `og-image.png`, íconos PWA.

## Prioridad 1 — Pendiente real
1. Confirmar visualmente que los PDFs de Cotizaciones/Oficios abren bien.
2. Auditoría en vivo de Catálogo — sigue sin hacerse.
3. App Check (falta reCAPTCHA v3 site key, la genera Paco).

## Prioridad 2 — Pendiente conocido (sin cambios, baja prioridad)
- `npm audit`: confirmado que no hay arreglo seguro disponible ahora mismo
  ni en raíz ni en `functions/` sin forzar cambios que rompen algo. No
  insistir en esto hasta que el ecosistema publique parches.
- 8 usos de `: any`, ~35 issues de ESLint catalogados (comillas sin
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
