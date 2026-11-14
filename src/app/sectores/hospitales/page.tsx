import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, HeartPulse, RefreshCw, ShieldCheck } from 'lucide-react';
import { ManoFilLogo } from '../../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  // Sin " | MANO FIL": la plantilla del layout ya añade "| MANO FIL Cobertores"
  // y antes el título salía duplicado ("... | MANO FIL | MANO FIL Cobertores").
  // Página nueva del clúster por sector (P1-4, auditoría SEO 14 nov 2026).
  title: "Cobertores por Mayoreo para Hospitales y Clínicas",
  description: "Cobertores industriales por mayoreo para hospitales, clínicas y centros de salud: lavandería industrial, rotación constante y reposición programada, directo de fábrica en Tlaxcala.",
  alternates: {
    canonical: '/sectores/hospitales',
  },
  // OG/Twitter propios: antes heredaban título, descripción e imagen de la home.
  openGraph: {
    title: "Cobertores por Mayoreo para Hospitales y Clínicas | MANO FIL Cobertores",
    description: "Cobertores industriales por mayoreo para hospitales, clínicas y centros de salud: lavandería industrial, rotación constante y reposición programada, directo de fábrica en Tlaxcala.",
    url: "https://cobertores.com/sectores/hospitales",
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
    title: "Cobertores por Mayoreo para Hospitales y Clínicas | MANO FIL Cobertores",
    description: "Cobertores industriales por mayoreo para hospitales, clínicas y centros de salud: lavandería industrial, rotación constante y reposición programada, directo de fábrica en Tlaxcala.",
    images: ["/hero-bg.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Suministro de cobertores para hospitales y clínicas",
  "description": "Fabricación y suministro de cobertores industriales por mayoreo para hospitales, clínicas y centros de salud en México, con reposición programada.",
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
  "url": "https://cobertores.com/sectores/hospitales"
};

export default function HospitalesPage() {
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
            <HeartPulse className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-4">Sector salud</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Cobertores por Mayoreo para Hospitales y Clínicas</h1>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            Suministro directo de fábrica para hospitales, clínicas y centros de salud. Cobertores industriales
            que soportan lavandería constante y rotación diaria, con la misma calidad lote tras lote.
          </p>
        </div>

        <div className="space-y-10 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-500" /> Pensados para lavandería industrial y rotación constante
            </h2>
            <p>
              En un hospital, el cobertor entra y sale de lavandería todos los días. Nuestros modelos están tejidos
              para soportar ese ritmo: tejido compacto, acabados que no se deshacen con los lavados y un gramaje
              consistente en cada lote, para que la reposición sea idéntica a la dotación original.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Modelos recomendados para el sector salud</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium"><Link href="/productos/tilma-ribeteada-1150-kg" className="hover:text-amber-500 transition-colors">Cobertor Tilma Ribeteada de 1.150 KG:</Link></strong> acabado reforzado por ultrasonido perimetral; la opción de mayor vida útil para hospitalización y rotación intensa.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium"><Link href="/productos/tilma-economica-1300-kg" className="hover:text-amber-500 transition-colors">Cobertor Tilma Económica de 1.300 KG:</Link></strong> tejido compacto y duradero para áreas generales y dotaciones de volumen.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium"><Link href="/productos/tilma-ligera-1000-kg" className="hover:text-amber-500 transition-colors">Cobertor Tilma Ligera de 1.000 KG:</Link></strong> peso y volumen optimizados para logística interna, urgencias y rotación rápida entre servicios.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium"><Link href="/productos/manta-termica-2000-kg" className="hover:text-amber-500 transition-colors">Cobertor Manta Térmica de 2.000 KG:</Link></strong> el mayor abrigo del catálogo, para zonas frías y áreas que requieren aislamiento térmico superior.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-amber-500" /> Reposición programada y volúmenes institucionales
            </h2>
            <p>
              Cotizamos por volumen directo de fábrica, sin intermediarios, y trabajamos con programas de
              reposición por consumo o por temporada. Atendemos hospitales públicos y privados, clínicas y
              centros de salud en todo México, con entregas desde Santa Ana Chiautempan, Tlaxcala. El catálogo
              completo está en <Link href="/productos" className="text-white font-medium hover:text-amber-500 transition-colors">cobertores por mayoreo</Link>.
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
