import React from 'react';

// FIX SEO 2026-08-04: /intranet (la pantalla de login del portal privado)
// está enlazada desde el menú y el footer del sitio público, pero no tenía
// noindex -- solo /intranet/dashboard lo tenía. robots.txt bloquea el
// rastreo de /intranet/, pero eso solo evita que Google lea el contenido;
// no evita que la URL aparezca listada en resultados de búsqueda (puede
// mostrarse sin descripción, solo por estar enlazada). El noindex explícito
// es la forma correcta de asegurar que no aparezca del todo.
export const metadata = {
  title: 'Portal Intranet - Mano Fil S.A.',
  robots: { index: false, follow: false },
};

export default function IntranetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
