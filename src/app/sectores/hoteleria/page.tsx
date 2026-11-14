import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BedDouble, Sparkles, RefreshCw } from 'lucide-react';
import { ManoFilLogo } from '../../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  // Sin " | MANO FIL": la plantilla del layout ya añade "| MANO FIL Cobertores"
  // y antes el título salía duplicado ("... | MANO FIL | MANO FIL Cobertores").
  title: "Blancos y Cobertores para Hotelería por Mayoreo",
  description: "Cobertores y blancos por mayoreo para hoteles y hospedaje. Calidad consistente, reposición programada y suministro directo de fábrica en Tlaxcala.",
  alternates: {
    canonical: '/sectores/hoteleria',
  },
  // OG/Twitter propios: antes heredaban título, descripción e imagen de la home.
  openGraph: {
    title: "Blancos y Cobertores para Hotelería por Mayoreo | MANO FIL Cobertores",
    description: "Cobertores y blancos por mayoreo para hoteles y hospedaje. Calidad consistente, reposición programada y suministro directo de fábrica en Tlaxcala.",
    url: "https://cobertores.com/sectores/hoteleria",
    siteName: "MANO FIL Cobertores",
    images: [
      {
        url: "/hero-bg.webp",
        width: 1920,
        height: 1080,
        alt: "Fábrica textil Mano Fil S.A. en Tlaxcala",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blancos y Cobertores para Hotelería por Mayoreo | MANO FIL Cobertores",
    description: "Cobertores y blancos por mayoreo para hoteles y hospedaje. Calidad consistente, reposición programada y suministro directo de fábrica en Tlaxcala.",
    images: ["/hero-bg.webp"],
  },
};

// Preguntas frecuentes del sector (P1-4, auditoría SEO 14 nov 2026): la misma
// fuente alimenta la sección visible y el FAQPage del JSON-LD.
const faqs = [
  {
    q: "¿Qué gramaje de cobertor se recomienda para un hotel?",
    a: "Para rotación alta y lavandería constante, la Tilma Ribeteada de 1.150 KG, por su acabado reforzado por ultrasonido. Para uso estándar en habitaciones, la Tilma Económica de 1.300 KG. Para suites y destinos de frío, la Manta Térmica de 2.000 KG."
  },
  {
    q: "¿Atienden a Airbnb y rentas vacacionales?",
    a: "Sí. Suministramos a anfitriones y administradoras de rentas vacacionales con volúmenes desde 50 a 100 piezas, el mismo suministro directo de fábrica que reciben los hoteles, con reposición por temporada."
  },
  {
    q: "¿Cada cuándo conviene reponer los cobertores de un hotel?",
    a: "Depende de la ocupación y de los ciclos de lavandería industrial. Trabajamos con programas de reposición por temporada o por ocupación, para que el inventario se renueve sin quedarse corto en temporada alta."
  },
  {
    q: "¿Hacen envíos a todo México?",
    a: "Sí. Despachamos desde Santa Ana Chiautempan, Tlaxcala, con cobertura en todo México y oficinas comerciales en CDMX."
  }
];

// Service + FAQPage (P1-4). El Service conserva el proveedor y la dirección
// canónicos del sitio (Calle El Grullo 7, Santa Ana Chiautempan, Tlaxcala).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "name": "Suministro de blancos y cobertores para hotelería",
      "description": "Fabricación y suministro de cobertores y blancos por mayoreo para hoteles, cadenas de hospedaje y servicios de hospitalidad en México.",
      "provider": {
        "@type": "Organization",
        "name": "Mano Fil S.A.",
        "url": "https://cobertores.com",
        "telephone": "+522464642891",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Calle El Grullo 7",
          "addressLocality": "Santa Ana Chiautempan",
          "addressRegion": "Tlaxcala",
          "postalCode": "90800",
          "addressCountry": "MX"
        }
      },
      "areaServed": "MX",
      "url": "https://cobertores.com/sectores/hoteleria"
    },
    {
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    }
  ]
};

export default function HoteleriaPage() {
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
            <BedDouble className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-4">Hospitalidad y hospedaje</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Blancos y Cobertores para Hotelería</h1>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            Suministro directo de fábrica para hoteles, cadenas de hospedaje y servicios de hospitalidad.
            Calidad consistente lote tras lote, con reposición programada según tu ocupación.
          </p>
        </div>

        <div className="space-y-10 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-500" /> Calidad uniforme en cada habitación
            </h2>
            <p>
              En hotelería, la consistencia lo es todo. Producimos con estrictos controles de calidad para que cada
              cobertor mantenga el mismo gramaje, textura y acabado, habitación tras habitación y reposición tras reposición.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-amber-500" /> Reposición programada
            </h2>
            <p>
              Trabajamos con programas de reposición por temporada o por ocupación, para que nunca te falte inventario
              en temporada alta. Nuestros productos para el sector:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium"><Link href="/productos/tilma-ribeteada-1150-kg" className="hover:text-amber-500 transition-colors">Cobertor Tilma Ribeteada de 1.150 KG:</Link></strong> acabado reforzado por ultrasonido, alta durabilidad ante lavados constantes.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium"><Link href="/productos/tilma-economica-1300-kg" className="hover:text-amber-500 transition-colors">Cobertor Tilma Económica de 1.300 KG:</Link></strong> tejido compacto que soporta uso intensivo y lavandería industrial.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium"><Link href="/productos/manta-termica-2000-kg" className="hover:text-amber-500 transition-colors">Cobertor Manta Térmica de 2.000 KG:</Link></strong> para destinos de frío o habitaciones premium.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <BedDouble className="w-6 h-6 text-amber-500" /> Cobertores al mayoreo para hoteles y Airbnb
            </h2>
            <p>
              El mismo cobertor que rota en un hotel rota en una renta vacacional: lavado frecuente, huéspedes
              distintos cada semana y reposición sin fricción. Suministramos a hoteles, cadenas de hospedaje,
              anfitriones de Airbnb y administradoras de rentas vacacionales con volúmenes desde 50 a 100 piezas,
              directo de fábrica y sin intermediarios.
            </p>
            <p className="mt-4">
              Para rentas vacacionales recomendamos la <Link href="/productos/tilma-ribeteada-1150-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Tilma Ribeteada</Link> en
              las unidades de mayor rotación y la <Link href="/productos/tilma-ligera-1000-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Tilma Ligera</Link> como
              respaldo y rotación: pesa menos, ocupa menos espacio de almacenaje y se repone rápido entre estancias.
              El catálogo completo está en <Link href="/productos" className="text-white font-medium hover:text-amber-500 transition-colors">cobertores por mayoreo</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Preguntas frecuentes de hotelería</h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="text-white font-medium mb-2">{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Cotización por volumen</h2>
            <p>
              Cotizamos por número de habitaciones o piezas, con precios de mayoreo directo de fábrica, sin intermediarios.
              Atendemos hoteles independientes, cadenas y administradoras de propiedades vacacionales en todo México.
            </p>
            <Link href="/#contacto" className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-colors">
              Solicitar cotización <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
