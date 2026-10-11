import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, FileCheck, ClipboardList, Award } from 'lucide-react';
import { ManoFilLogo } from '../../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Proveedor de Cobertores para Licitaciones | MANO FIL",
  description: "Fabricante de cobertores para licitaciones públicas. Cumplimiento de especificaciones técnicas, capacidad de producción y entrega a nivel nacional.",
  alternates: {
    canonical: '/sectores/licitaciones',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Proveedor fabricante de cobertores para licitaciones públicas",
  "description": "Fabricación y suministro de cobertores y tilmas por mayoreo para licitaciones públicas, con cumplimiento de especificaciones técnicas y capacidad de entrega nacional.",
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
  "url": "https://cobertores.com/sectores/licitaciones"
};

export default function LicitacionesPage() {
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
            <FileCheck className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-4">Compras públicas</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Proveedor de Cobertores para Licitaciones</h1>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            Somos fabricantes, no intermediarios. Participamos como proveedores en licitaciones públicas de cobertores,
            tilmas y mantas, cumpliendo especificaciones técnicas y tiempos de entrega a nivel nacional.
          </p>
        </div>

        <div className="space-y-10 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-500" /> Ventaja de ser fabricantes
            </h2>
            <p>
              Al producir directamente en nuestra planta de Tlaxcala, controlamos gramaje, composición y acabados,
              lo que nos permite apegarnos a las fichas técnicas de cada licitación y ofrecer precios competitivos
              sin intermediarios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-amber-500" /> Lo que podemos documentar
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span>Especificaciones técnicas por producto: gramaje, medidas, composición y acabados.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span>Muestras físicas para evaluación contra ficha técnica.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span>Capacidad de producción y programa de entregas por etapas.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span>Facturación y documentación fiscal en regla como Mano Fil S.A.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Inicia el proceso</h2>
            <p>
              Si estás integrando un requerimiento o preparando una licitación que incluya cobertores o tilmas,
              contáctanos para recibir ficha técnica, muestras y cotización formal por volumen.
            </p>
            <Link href="/#contacto" className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-colors">
              Solicitar información <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
