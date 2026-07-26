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

export default function RootPage() {
  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <p>
        Redirigiendo a <Link href="/es">cobertores.com/es</Link>...
      </p>
      <RedirectClient />
    </div>
  );
}
