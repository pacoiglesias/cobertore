import { MetadataRoute } from 'next';

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/intranet', '/intranet/'],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Slurp',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
          'Applebot',
          'facebookexternalhit',
          'Twitterbot',
          'GPTBot',
          'ChatGPT-User',
          'Claude-Web',
          'ClaudeBot',
          'PerplexityBot'
        ],
        allow: '/',
        disallow: ['/intranet', '/intranet/'],
      }
    ],
    sitemap: 'https://cobertores.com/sitemap.xml',
    // La directiva `Host` de robots.txt lleva solo el dominio (sin esquema).
    // Con 'https://cobertores.com' Next la emitía tal cual y no es un host válido.
    host: 'cobertores.com',
  };
}

