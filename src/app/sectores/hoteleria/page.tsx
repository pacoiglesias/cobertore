import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BedDouble, Sparkles, RefreshCw } from 'lucide-react';
import { ManoFilLogo } from '../../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blancos y Cobertores para Hotelería por Mayoreo | MANO FIL",
  description: "Cobertores y blancos por mayoreo para hoteles y hospedaje. Calidad consistente, reposición programada y suministro directo de fábrica en Tlaxcala.",
  alternates: {
    canonical: '/sectores/hoteleria',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
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
      "streetAddress": "Calle El Grullo",
      "addressLocality": "Santa Ana Chiautempan",
      "addressRegion": "Tlaxcala",
      "postalCode": "90800",
      "addressCountry": "MX"
    }
  },
  "areaServed": "MX",
  "url": "https://cobertores.com/sectores/hoteleria"
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
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium"><Link href="/productos/tilma-ribeteada-1150-kg" className="hover:text-amber-500 transition-colors">Tilma Ribeteada 1.150 KG:</Link></strong> acabado reforzado por ultrasonido, alta durabilidad ante lavados constantes.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium"><Link href="/productos/tilma-economica-1300-kg" className="hover:text-amber-500 transition-colors">Tilma Económica 1.300 KG:</Link></strong> tejido compacto que soporta uso intensivo y lavandería industrial.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium"><Link href="/productos/manta-termica-2000-kg" className="hover:text-amber-500 transition-colors">Manta Térmica 2.000 KG:</Link></strong> para destinos de frío o habitaciones premium.</span></li>
            </ul>
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
