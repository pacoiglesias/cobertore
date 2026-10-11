import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, PackageCheck } from 'lucide-react';
import { ManoFilLogo } from '../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Cobertores para Gobierno y Ayuda Humanitaria | MANO FIL",
  description: "Suministro de cobertores y tilmas por mayoreo para gobierno, protección civil y ayuda humanitaria. Respuesta inmediata a contingencias desde Tlaxcala.",
  alternates: {
    canonical: '/sectores/gobierno',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Suministro de cobertores para gobierno y ayuda humanitaria",
  "description": "Fabricación y suministro de cobertores, tilmas y mantas térmicas por mayoreo para dependencias de gobierno, protección civil y organismos de ayuda humanitaria.",
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
  "url": "https://cobertores.com/sectores/gobierno"
};

export default function GobiernoPage() {
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
            <ShieldCheck className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-4">Sector público y asistencia social</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Cobertores para Gobierno y Ayuda Humanitaria</h1>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            Fabricamos y suministramos cobertores, tilmas y mantas térmicas por mayoreo para dependencias de gobierno,
            protección civil y organismos de asistencia. Capacidad de respuesta inmediata ante contingencias en todo México.
          </p>
        </div>

        <div className="space-y-10 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Truck className="w-6 h-6 text-amber-500" /> Respuesta inmediata a contingencias
            </h2>
            <p>
              Ante desastres naturales y emergencias, el tiempo es crítico. Nuestra planta en Santa Ana Chiautempan, Tlaxcala,
              mantiene capacidad de producción y logística para surtir grandes volúmenes de cobertores en plazos cortos,
              con distribución a nivel nacional.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <PackageCheck className="w-6 h-6 text-amber-500" /> Productos para programas sociales
            </h2>
            <p>
              Suministramos a programas de apoyo invernal, albergues y campañas de asistencia social. Nuestros productos
              más solicitados por el sector público:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Manta Térmica 2.000 KG:</strong> máximo gramaje para frío extremo y situaciones de emergencia.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Tilma Económica 1.300 KG:</strong> tejido compacto y duradero, ideal para distribución masiva.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Tilma Ligera 1.000 KG:</strong> optimización de peso y volumen para logística ágil.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Cotización para dependencias</h2>
            <p>
              Atendemos requerimientos de dependencias federales, estatales y municipales, así como de organismos de la
              sociedad civil. Emitimos cotizaciones formales por volumen con especificaciones técnicas del producto,
              tiempos de entrega y condiciones comerciales.
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
