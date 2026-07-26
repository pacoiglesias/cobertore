import { MetadataRoute } from 'next';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cobertores.com';

  // FIX 2026-07-25: las paginas individuales de noticias (/noticias/[id])
  // ya existen y se indexan bien, pero el sitemap nunca las listaba --
  // Google no tenia forma facil de descubrirlas todas. Se agregan aqui
  // igual que generateStaticParams las genera, usando la misma coleccion.
  let newsEntries: MetadataRoute.Sitemap = [];
  try {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(150));
    const snap = await getDocs(q);
    newsEntries = snap.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
      return {
        url: `${baseUrl}/noticias/${doc.id}`,
        lastModified: createdAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      };
    });
  } catch (error) {
    console.error('Error generando entradas de noticias para el sitemap', error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/noticias`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...newsEntries,
    {
      url: `${baseUrl}/seguimiento`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    }
  ];
}
