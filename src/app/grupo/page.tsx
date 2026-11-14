import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Building2, Factory } from 'lucide-react';
import { ManoFilLogo } from '../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  // Sin " | MANO FIL": la plantilla del layout ya añade "| MANO FIL Cobertores".
  // Página del grupo (P1-3, auditoría SEO 14 nov 2026): lo inmobiliario vive
  // aquí, fuera de la home y fuera del foco del sitemap principal.
  title: "Grupo Mano Fil — División Textil e Inmobiliaria",
  description: "Mano Fil S.A., grupo corporativo fundado en 1962 en Santa Ana Chiautempan, Tlaxcala: división textil (cobertores por mayoreo) y división inmobiliaria (naves industriales, desarrollos comerciales y activos residenciales).",
  alternates: {
    canonical: '/grupo',
  },
  openGraph: {
    title: "Grupo Mano Fil — División Textil e Inmobiliaria | MANO FIL Cobertores",
    description: "Mano Fil S.A., grupo corporativo fundado en 1962 en Santa Ana Chiautempan, Tlaxcala: división textil (cobertores por mayoreo) y división inmobiliaria.",
    url: "https://cobertores.com/grupo",
    siteName: "MANO FIL Cobertores",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Grupo Mano Fil — Fábrica de cobertores en Tlaxcala",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grupo Mano Fil — División Textil e Inmobiliaria | MANO FIL Cobertores",
    description: "Mano Fil S.A., grupo corporativo fundado en 1962 en Santa Ana Chiautempan, Tlaxcala: división textil (cobertores por mayoreo) y división inmobiliaria.",
    images: ["/og-cover.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://cobertores.com" },
    { "@type": "ListItem", "position": 2, "name": "Grupo Mano Fil", "item": "https://cobertores.com/grupo" }
  ]
};

export default function GrupoPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans selection:bg-amber-500/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="fixed w-full z-50 bg-[#070b14]/80 backdrop-blur-2xl border-b border-white/5 py-4">
        <div className="max-w-4xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest text-xs transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <ManoFilLogo variant="light" className="h-8" />
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 md:px-6">
        <div className="mb-12">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
            <Building2 className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-4">Mano Fil S.A. · Desde 1962</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Grupo Mano Fil</h1>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            Dos divisiones bajo una sola disciplina corporativa: la fábrica de cobertores por mayoreo
            de Santa Ana Chiautempan, Tlaxcala, y el desarrollo de patrimonio inmobiliario.
          </p>
        </div>

        <div className="space-y-10 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Factory className="w-6 h-6 text-amber-500" /> División Textil · Cobertores.com
            </h2>
            <p>
              Cobertores, blancos para el hogar, hilos y telas técnicas. Suministramos volúmenes corporativos
              por mayoreo desde 1962, desde nuestro centro de distribución en Santa Ana Chiautempan, Tlaxcala,
              con oficinas comerciales en CDMX y envíos a todo México.
            </p>
            <Link href="/productos" className="mt-6 inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest text-xs transition-colors">
              Ver el catálogo de cobertores <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-amber-500" /> División Inmobiliaria
            </h2>
            <p>
              Naves industriales, desarrollos comerciales y activos residenciales estratégicos, planeados
              con el mismo rigor operativo desde 1962: 300,000 m² de superficie desarrollada y administrada.
            </p>
            <Link href="/#contacto" className="mt-6 inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest text-xs transition-colors">
              Solicitar información <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
