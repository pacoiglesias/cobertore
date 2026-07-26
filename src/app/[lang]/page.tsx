import React from 'react';
import { Metadata } from 'next';
import LandingClient from './LandingClient';
import { Lang } from '../../lib/i18n/dictionaries';

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }];
}

// FIX 2026-07-25: /es y /en no tenian su propio canonical -- ambos
// heredaban "canonical: '/'" del layout raiz, y "/" ahora es solo una
// redireccion sin contenido. Le decia a Google que las dos paginas reales
// eran duplicados de una pagina vacia. Tambien se agrega hreflang para
// que Google sepa que /es y /en son la misma pagina en distintos idiomas
// (evita que compitan entre si en resultados de busqueda).
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const validLang = (params.lang === 'en' || params.lang === 'es') ? params.lang : 'es';
  return {
    alternates: {
      canonical: `/${validLang}`,
      languages: {
        'es': '/es',
        'en': '/en',
        'x-default': '/es',
      },
    },
  };
}

export default function Page({ params }: { params: { lang: string } }) {
  const validLang = (params.lang === 'en' || params.lang === 'es') ? (params.lang as Lang) : 'es';
  return <LandingClient lang={validLang} />;
}
