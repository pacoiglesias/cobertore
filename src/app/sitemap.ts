import { MetadataRoute } from 'next';

export const dynamic = "force-static";

// lastModified por página: fecha del último commit que tocó el archivo de
// cada ruta (git log -1 --format=%cs -- <ruta>), revisada 2026-11-05.
// NO usar new Date(): cada build marcaba todas las URLs como "recién
// cambiadas" aunque su contenido no hubiera cambiado.
// Al modificar una página, actualizar su fecha aquí con la del cambio.
const LAST_MODIFIED: Record<string, string> = {
  '/': '2026-11-05', // pasada SEO 3 (39bd293)
  '/seguimiento': '2026-10-04',
  '/sectores/gobierno': '2026-11-05', // OG propio + título sin duplicar (b5a05ba/6a7017d)
  '/sectores/hoteleria': '2026-11-05', // OG propio + título sin duplicar (b5a05ba/6a7017d)
  '/sectores/licitaciones': '2026-11-05', // OG propio + título sin duplicar (b5a05ba/6a7017d)
  '/productos/tilma-economica-1300-kg': '2026-11-05', // pasada SEO 3 (39bd293)
  '/productos/manta-termica-2000-kg': '2026-11-05', // pasada SEO 3 (39bd293)
  '/productos/tilma-ribeteada-1150-kg': '2026-11-05', // pasada SEO 3 (39bd293)
  '/productos/tilma-ligera-1000-kg': '2026-11-05', // pasada SEO 3 (39bd293)
  '/privacidad': '2026-10-04',
  '/terminos': '2026-10-04',
  '/cookies': '2026-10-04',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cobertores.com';

  const entry = (
    path: string,
    changeFrequency: 'weekly' | 'yearly',
    priority: number,
  ): MetadataRoute.Sitemap[number] => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(LAST_MODIFIED[path]),
    changeFrequency,
    priority,
  });

  return [
    entry('/', 'weekly', 1.0),
    entry('/seguimiento', 'weekly', 0.7),
    entry('/sectores/gobierno', 'weekly', 0.8),
    entry('/sectores/hoteleria', 'weekly', 0.8),
    entry('/sectores/licitaciones', 'weekly', 0.8),
    entry('/productos/tilma-economica-1300-kg', 'weekly', 0.8),
    entry('/productos/manta-termica-2000-kg', 'weekly', 0.8),
    entry('/productos/tilma-ribeteada-1150-kg', 'weekly', 0.8),
    entry('/productos/tilma-ligera-1000-kg', 'weekly', 0.8),
    entry('/privacidad', 'yearly', 0.3),
    entry('/terminos', 'yearly', 0.3),
    entry('/cookies', 'yearly', 0.3),
  ];
}
