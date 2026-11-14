import { MetadataRoute } from 'next';

export const dynamic = "force-static";

// lastModified por página: fecha del último commit que tocó el archivo de
// cada ruta (git log -1 --format=%cs -- <ruta>), revisada 2026-11-05.
// NO usar new Date(): cada build marcaba todas las URLs como "recién
// cambiadas" aunque su contenido no hubiera cambiado.
// Al modificar una página, actualizar su fecha aquí con la del cambio.
const LAST_MODIFIED: Record<string, string> = {
  '/': '2026-11-14', // P1-3: bloque grupo corto + cinta sin cifra inmobiliaria (auditoría SEO 14 nov 2026)
  '/productos': '2026-11-14', // P1-1 Product en JSON-LD + P1-5 anclas «cobertor» (14 nov 2026)
  '/guia-cobertores-por-mayoreo': '2026-11-14', // guías relacionadas + enlace a hospitales (14 nov 2026)
  '/guias/cuanto-cuesta-un-cobertor-por-mayoreo': '2026-11-14', // artículo nuevo del clúster (P1-4)
  '/guias/gramajes-de-cobertores': '2026-11-14', // artículo nuevo del clúster (P1-4)
  '/guias/cobertores-para-programas-de-invierno': '2026-11-14', // artículo nuevo del clúster (P1-4)
  '/seguimiento': '2026-10-04',
  '/sectores/gobierno': '2026-11-05', // OG propio + título sin duplicar (b5a05ba/6a7017d)
  '/sectores/hoteleria': '2026-11-14', // bloque Airbnb + FAQ propia (P1-4, 14 nov 2026)
  '/sectores/hospitales': '2026-11-14', // página nueva del clúster por sector (P1-4)
  '/sectores/licitaciones': '2026-11-05', // OG propio + título sin duplicar (b5a05ba/6a7017d)
  '/productos/tilma-economica-1300-kg': '2026-11-14', // título/H1 «Cobertor» (P0) + Product JSON-LD (P1-1)
  '/productos/manta-termica-2000-kg': '2026-11-14', // título/H1 «Cobertor» (P0) + Product JSON-LD (P1-1)
  '/productos/tilma-ribeteada-1150-kg': '2026-11-14', // título/H1 «Cobertor» (P0) + Product JSON-LD (P1-1)
  '/productos/tilma-ligera-1000-kg': '2026-11-14', // título/H1 «Cobertor» (P0) + Product JSON-LD (P1-1)
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
    entry('/productos', 'weekly', 0.9),
    entry('/guia-cobertores-por-mayoreo', 'weekly', 0.8),
    entry('/guias/cuanto-cuesta-un-cobertor-por-mayoreo', 'weekly', 0.7),
    entry('/guias/gramajes-de-cobertores', 'weekly', 0.7),
    entry('/guias/cobertores-para-programas-de-invierno', 'weekly', 0.7),
    entry('/seguimiento', 'weekly', 0.7),
    entry('/sectores/gobierno', 'weekly', 0.8),
    entry('/sectores/hoteleria', 'weekly', 0.8),
    entry('/sectores/hospitales', 'weekly', 0.8),
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
