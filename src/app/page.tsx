import { Metadata } from 'next';
import Link from 'next/link';
import RedirectClient from './RedirectClient';

// FIX 2026-07-25: redirect() de 'next/navigation' NO produce una
// redireccion HTTP real en exportacion estatica (output: 'export') --
// no hay servidor que la ejecute. En produccion esto dejaba la pagina
// raiz mostrando "This page couldn't load", en blanco, para cualquiera
// que entrara a cobertores.com directo. La solucion principal es la
// regla de redirect en firebase.json (HTTP real, siempre funciona); esto
// de aqui es un respaldo (meta-refresh + JS) por si acaso, y un link
// visible por si el usuario tiene JS desactivado.
export const metadata: Metadata = {
  alternates: { canonical: '/es' },
  other: { 'refresh': '0; url=/es' },
};

// FIX SEO/GEO 2026-08-04: esta página casi no tenía contenido (una sola
// línea de texto), y era la causa más probable del bajo porcentaje de
// "Contenido Renderizado" reportado por herramientas de auditoría GEO/LLM.
// El 301 real está en firebase.json y lo siguen Googlebot y la mayoría de
// rastreadores, pero cualquier herramienta que analice "/" sin seguir la
// redirección (o que la ejecute solo vía JS) se encontraba con una página
// prácticamente vacía. Se añade contenido real y sustantivo aquí como
// respaldo; el <link rel="canonical"> a /es (ya presente en metadata)
// evita cualquier problema de contenido duplicado con la versión completa.
export default function RootPage() {
  return (
    <div style={{ padding: 40, maxWidth: 720, margin: '0 auto', fontFamily: 'sans-serif', lineHeight: 1.6 }}>
      <h1>Mano Fil S.A. — Fábrica de Cobertores y Tilmas por Mayoreo</h1>
      <p>
        Mano Fil S.A. es una fábrica textil mexicana fundada en 1962, con sede en Santa Ana
        Chiautempan, Tlaxcala. Fabricamos y distribuimos cobertores térmicos, cobijas y tilmas
        para clientes corporativos, con suministro industrial de alto volumen y precios directos
        de fábrica.
      </p>
      <p>
        Estás siendo redirigido a la versión completa del sitio en{' '}
        <Link href="/es">español (cobertores.com/es)</Link> o puedes verla en{' '}
        <Link href="/en">inglés (cobertores.com/en)</Link>.
      </p>
      <RedirectClient />
    </div>
  );
}
