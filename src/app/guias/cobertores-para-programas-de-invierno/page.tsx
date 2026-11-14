import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Phone, Snowflake, Truck } from 'lucide-react';
import { ManoFilLogo } from '../../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  // Sin " | MANO FIL": la plantilla del layout ya añade "| MANO FIL Cobertores".
  // Artículo del clúster de guías (P1-4, auditoría SEO 14 nov 2026).
  title: "Cobertores para programas de invierno: guía para dependencias",
  description: "Cómo planear un programa invernal de cobertores: previsión de volúmenes, modelos para distribución masiva, entregas por lotes y logística a todo México. Guía para dependencias.",
  alternates: {
    canonical: '/guias/cobertores-para-programas-de-invierno',
  },
  openGraph: {
    title: "Cobertores para programas de invierno: guía para dependencias | MANO FIL Cobertores",
    description: "Cómo planear un programa invernal de cobertores: previsión de volúmenes, modelos para distribución masiva, entregas por lotes y logística a todo México. Guía para dependencias.",
    url: "https://cobertores.com/guias/cobertores-para-programas-de-invierno",
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
    title: "Cobertores para programas de invierno: guía para dependencias | MANO FIL Cobertores",
    description: "Cómo planear un programa invernal de cobertores: previsión de volúmenes, modelos para distribución masiva, entregas por lotes y logística a todo México. Guía para dependencias.",
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
        { "@type": "ListItem", "position": 3, "name": "Cobertores para programas de invierno", "item": "https://cobertores.com/guias/cobertores-para-programas-de-invierno" }
      ]
    },
    {
      "@type": "Article",
      "headline": "Cobertores para programas de invierno: guía para dependencias",
      "description": "Cómo planear un programa invernal de cobertores: previsión de volúmenes, modelos para distribución masiva, entregas por lotes y logística a todo México.",
      "author": { "@type": "Organization", "name": "Mano Fil S.A.", "url": "https://cobertores.com" },
      "publisher": { "@type": "Organization", "name": "Mano Fil S.A.", "url": "https://cobertores.com" },
      "datePublished": "2026-11-14",
      "dateModified": "2026-11-14",
      "mainEntityOfPage": "https://cobertores.com/guias/cobertores-para-programas-de-invierno",
      "inLanguage": "es-MX"
    }
  ]
};

export default function ProgramasInviernoPage() {
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
            <Snowflake className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-4">Guías Mano Fil · Fábrica de cobertores</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Cobertores para programas de invierno: guía para dependencias</h1>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            Un programa invernal se gana antes de que llegue el frío: con el volumen previsto, el modelo
            correcto para distribución masiva y un calendario de entregas por lotes. Así se planea.
          </p>
        </div>

        <div className="space-y-12 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Previsión: el volumen se decide con meses de anticipación</h2>
            <p>
              Las dependencias que distribuyen cobertores en temporada invernal —protección civil, DIF,
              programas sociales estatales y municipales— trabajan con padrones y zonas de riesgo definidos.
              Con ese volumen cerrado con anticipación, la fábrica programa producción y entregas sin
              contratiempos; Mano Fil mantiene inventario permanente y capacidad de respuesta inmediata para
              licitaciones y emergencias, con suministro a dependencias desde hace más de seis décadas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Modelos para distribución masiva</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/tilma-economica-1300-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Cobertor Tilma Económica de 1.300 KG</Link>: el modelo más solicitado para programas sociales y distribución masiva, por su equilibrio de abrigo y costo por pieza.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/tilma-ligera-1000-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Cobertor Tilma Ligera de 1.000 KG</Link>: cuando la logística manda; ocupa menos volumen por pieza y permite más unidades por viaje.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/manta-termica-2000-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Cobertor Manta Térmica de 2.000 KG</Link>: para zonas de frío extremo, contingencias y albergues.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/tilma-ribeteada-1150-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Cobertor Tilma Ribeteada de 1.150 KG</Link>: para dotaciones que seguirán en uso institucional tras la temporada, con acabado reforzado.</span></li>
            </ul>
            <p className="mt-4">
              El catálogo completo, con fichas técnicas de cada modelo, está en
              {' '}<Link href="/productos" className="text-white font-medium hover:text-amber-500 transition-colors">cobertores por mayoreo</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Entregas por lotes y logística a todo México</h2>
            <p>
              Para volúmenes institucionales adaptamos la capacidad de entrega por lotes programados, alineados
              al calendario de distribución de la dependencia: producción, consolidación y envío desde Santa
              Ana Chiautempan, Tlaxcala, a cualquier punto de la República, con fletes consolidados o viajes
              completos dedicados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Muestras para el comité de compras</h2>
            <p>
              Antes de adjudicar, el comité puede evaluar el producto real: las muestras físicas tienen un
              costo inicial que se bonifica íntegramente al concretar el pedido mayorista. Los requisitos de
              compra pública están en <Link href="/sectores/licitaciones" className="text-white font-medium hover:text-amber-500 transition-colors">licitaciones</Link> y
              el suministro institucional en <Link href="/sectores/gobierno" className="text-white font-medium hover:text-amber-500 transition-colors">cobertores para gobierno</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Checklist de la dependencia</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span>Volumen total y su desglose por municipio o zona de entrega.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span>Modelo y gramaje definidos según el clima de cada zona (ver la <Link href="/guias/gramajes-de-cobertores" className="text-white font-medium hover:text-amber-500 transition-colors">guía de gramajes</Link>).</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span>Calendario de entregas por lotes, con fechas compromiso anteriores al pico de frío.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span>Muestra física aprobada por el comité antes de la adjudicación.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span>Margen de contingencia para frentes fríos y emergencias no previstas.</span></li>
            </ul>
            <p className="mt-4">
              La visión general de compra está en la
              {' '}<Link href="/guia-cobertores-por-mayoreo" className="text-white font-medium hover:text-amber-500 transition-colors">guía de cobertores por mayoreo</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Truck className="w-6 h-6 text-amber-500" /> Solicitar cotización
            </h2>
            <p>
              Envíanos el volumen, el modelo y el calendario de tu programa: cotizamos directo de fábrica y
              programamos los lotes. WhatsApp +52 246 464 2891 o el formulario de cotización.
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
