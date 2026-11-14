import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Phone, Scale, Truck } from 'lucide-react';
import { ManoFilLogo } from '../../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  // Sin " | MANO FIL": la plantilla del layout ya añade "| MANO FIL Cobertores".
  // Artículo del clúster de guías (P1-4, auditoría SEO 14 nov 2026).
  title: "Gramajes de cobertores: cuál elegir para gobierno, hoteles y programas sociales",
  description: "Qué es el gramaje de un cobertor y qué peso conviene a cada sector: gobierno y programas sociales, hoteles, hospitales y frío extremo. Guía de la fábrica Mano Fil.",
  alternates: {
    canonical: '/guias/gramajes-de-cobertores',
  },
  openGraph: {
    title: "Gramajes de cobertores: cuál elegir para gobierno, hoteles y programas sociales | MANO FIL Cobertores",
    description: "Qué es el gramaje de un cobertor y qué peso conviene a cada sector: gobierno y programas sociales, hoteles, hospitales y frío extremo. Guía de la fábrica Mano Fil.",
    url: "https://cobertores.com/guias/gramajes-de-cobertores",
    siteName: "MANO FIL Cobertores",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Cobertores por mayoreo — Fábrica Mano Fil en Tlaxcala",
      },
    ],
    locale: "es_MX",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gramajes de cobertores: cuál elegir para gobierno, hoteles y programas sociales | MANO FIL Cobertores",
    description: "Qué es el gramaje de un cobertor y qué peso conviene a cada sector: gobierno y programas sociales, hoteles, hospitales y frío extremo. Guía de la fábrica Mano Fil.",
    images: ["/og-cover.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://cobertores.com" },
        { "@type": "ListItem", "position": 2, "name": "Guía de cobertores por mayoreo", "item": "https://cobertores.com/guia-cobertores-por-mayoreo" },
        { "@type": "ListItem", "position": 3, "name": "Gramajes de cobertores", "item": "https://cobertores.com/guias/gramajes-de-cobertores" }
      ]
    },
    {
      "@type": "Article",
      "headline": "Gramajes de cobertores: cuál elegir para gobierno, hoteles y programas sociales",
      "description": "Qué es el gramaje de un cobertor y qué peso conviene a cada sector: gobierno y programas sociales, hoteles, hospitales y frío extremo.",
      "author": { "@type": "Organization", "name": "Mano Fil S.A.", "url": "https://cobertores.com" },
      "publisher": { "@type": "Organization", "name": "Mano Fil S.A.", "url": "https://cobertores.com" },
      "datePublished": "2026-11-14",
      "dateModified": "2026-11-14",
      "mainEntityOfPage": "https://cobertores.com/guias/gramajes-de-cobertores",
      "inLanguage": "es-MX"
    }
  ]
};

export default function GramajesPage() {
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
            <Scale className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-4">Guías Mano Fil · Fábrica de cobertores</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Gramajes de cobertores: cuál elegir para gobierno, hoteles y programas sociales</h1>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            El gramaje es el peso de cada cobertor, y es la decisión que define su abrigo, su durabilidad y su
            costo logístico. Así se elige el correcto para cada uso.
          </p>
        </div>

        <div className="space-y-12 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Qué es el gramaje y por qué manda</h2>
            <p>
              El gramaje es el peso por pieza: a mayor gramaje, más fibra, más abrigo y más retención térmica;
              a menor gramaje, menos volumen de almacenaje y de flete por pieza. No hay un gramaje «correcto»
              en abstracto: hay un gramaje correcto para cada trabajo. Nuestro catálogo de
              {' '}<Link href="/productos" className="text-white font-medium hover:text-amber-500 transition-colors">cobertores por mayoreo</Link>{' '}
              cubre de 1.000 a 2.000 KG por pieza.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Los cuatro gramajes de línea</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/tilma-ligera-1000-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Cobertor Tilma Ligera de 1.000 KG</Link>: el de menor peso y volumen; distribución ágil y masiva.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/tilma-ribeteada-1150-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Cobertor Tilma Ribeteada de 1.150 KG</Link>: gramaje medio con acabado reforzado por ultrasonido perimetral.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/tilma-economica-1300-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Cobertor Tilma Económica de 1.300 KG</Link>: tejido compacto y duradero; el equilibrio de volumen para distribución masiva.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/manta-termica-2000-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Cobertor Manta Térmica de 2.000 KG</Link>: el mayor gramaje del catálogo, aislamiento térmico de grado superior.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Gramaje por sector</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Gobierno y programas sociales:</strong> la Tilma Económica (1.300 KG) cuando manda el abrigo por pieza y la Tilma Ligera (1.000 KG) cuando manda la logística: más piezas por viaje y reparto más rápido.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Hoteles:</strong> la Tilma Ribeteada (1.150 KG) por su acabado reforzado ante lavados constantes, y la Tilma Económica como estándar de habitación. Detalle en <Link href="/sectores/hoteleria" className="text-white font-medium hover:text-amber-500 transition-colors">cobertores para hotelería</Link>.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Hospitales y clínicas:</strong> Ribeteada y Económica por durabilidad en lavandería industrial; Ligera para rotación rápida. Detalle en <Link href="/sectores/hospitales" className="text-white font-medium hover:text-amber-500 transition-colors">cobertores para hospitales y clínicas</Link>.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Frío extremo y emergencias:</strong> la Manta Térmica de 2.000 KG, para contingencias, programas invernales y destinos de montaña.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Más allá del peso</h2>
            <p>
              El gramaje no lo es todo: el acabado perimetral decide la vida útil en lavandería, el volumen por
              pieza decide el costo de flete y almacenaje, y la consistencia entre lotes decide que la
              reposición sea idéntica a la dotación original. La visión completa está en la
              {' '}<Link href="/guia-cobertores-por-mayoreo" className="text-white font-medium hover:text-amber-500 transition-colors">guía de cobertores por mayoreo</Link>.
              Además de los modelos estándar, desarrollamos gramajes específicos y dimensiones a la medida
              bajo volumen concertado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Truck className="w-6 h-6 text-amber-500" /> Solicitar cotización
            </h2>
            <p>
              Dinos el sector, el volumen y el destino: te recomendamos el gramaje y te cotizamos directo de
              fábrica. WhatsApp +52 246 464 2891 o el formulario de cotización.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/#contacto" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-colors">
                Solicitar cotización <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://wa.me/522464642891?text=Hola%2C%20solicito%20cotizaci%C3%B3n%20de%20cobertores%20por%20mayoreo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-colors">
                <Phone className="w-4 h-4" /> Cotizar por WhatsApp
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
