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
    host: 'https://cobertores.com',
  };
}

