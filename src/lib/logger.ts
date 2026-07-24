/**
 * Logger simple que se silencia en producción.
 * En desarrollo (`npm run dev` / `NODE_ENV=development`) se comporta igual que `console`.
 * En producción, `log` y `warn` no imprimen nada; `error` sí se mantiene
 * (útil para depurar problemas reales en el sitio ya desplegado vía herramientas
 * externas de monitoreo, sin filtrar datos de negocio en `log`/`warn`).
 */
const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};
