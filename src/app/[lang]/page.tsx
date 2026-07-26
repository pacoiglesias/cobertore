import React from 'react';
import { Metadata } from 'next';
import LandingClient from './LandingClient';
import { Lang } from '../../lib/i18n/dictionaries';

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }];
}

function resolveLang(raw: string | undefined): Lang {
  return raw === 'en' ? 'en' : 'es';
}

// FIX CRÍTICO 2026-07-26: en Next.js 15+ `params` es una Promise y hay
// que esperarla con await. Este archivo usaba el patrón síncrono viejo
// (`params.lang`), que sobre una Promise devuelve `undefined` -- así que
// la validación fallaba siempre y caía al respaldo 'es'. Resultado: la
// ruta /en servía el sitio COMPLETO en español, anulando toda la función
// de internacionalización. (La ruta /noticias/[id] sí usaba el patrón
// correcto, por eso esa sí funcionaba.)
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;
  const validLang = resolveLang(lang);

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

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LandingClient lang={resolveLang(lang)} />;
}
