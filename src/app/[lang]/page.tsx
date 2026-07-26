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

  // FIX 2026-07-26: /en heredaba el título y la descripción en español
  // del layout raíz. En los resultados de búsqueda en inglés, la página
  // aparecía con texto en español -- mata el porcentaje de clics y
  // confunde al comprador internacional. Ahora cada idioma tiene los
  // suyos, con las palabras clave que de verdad buscaría cada mercado.
  const meta = {
    es: {
      title: 'Cobertores y Cobijas por Mayoreo | Fábrica Textil desde 1962',
      description: 'Fábrica de cobertores, cobijas y tilmas en Tlaxcala. Venta por mayoreo a escala corporativa con precios directos de fábrica. Más de 60 años de experiencia.',
    },
    en: {
      title: 'Wholesale Blankets & Thermal Textiles | Mexican Manufacturer Since 1962',
      description: 'Leading blanket manufacturer in Tlaxcala, Mexico. Heavy-duty thermal blankets and tilmas for corporate wholesale, with direct factory pricing and large-volume capacity.',
    },
  }[validLang];

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${validLang}`,
      languages: {
        'es': '/es',
        'en': '/en',
        'x-default': '/es',
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: validLang === 'en' ? 'en_US' : 'es_MX',
      type: 'website',
      url: `https://cobertores.com/${validLang}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LandingClient lang={resolveLang(lang)} />;
}
