'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Mantiene el atributo `lang` del <html> en sincronía con la ruta.
 *
 * FIX 2026-07-26: el layout raíz declaraba `lang="es-MX"` fijo para todo
 * el sitio, incluida la versión en inglés. Eso le decía a Google que
 * /en estaba en español (perjudica el posicionamiento internacional) y
 * hacía que los lectores de pantalla leyeran el inglés con pronunciación
 * española.
 *
 * En exportación estática el layout raíz no puede conocer el segmento
 * [lang] en tiempo de compilación, así que se ajusta en el cliente.
 */
export function HtmlLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    const esIngles = pathname === '/en' || pathname.startsWith('/en/');
    document.documentElement.lang = esIngles ? 'en' : 'es-MX';
  }, [pathname]);

  return null;
}
