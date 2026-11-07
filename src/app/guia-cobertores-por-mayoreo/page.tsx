import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Package, Truck, ShieldCheck, Phone, Factory } from 'lucide-react';
import { ManoFilLogo } from '../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  // Sin " | MANO FIL": la plantilla del layout ya añade "| MANO FIL Cobertores".
  title: "Guía de Cobertores por Mayoreo",
  description: "Qué es un cobertor, tipos y gramajes, cómo elegir por mayoreo y para qué sector sirve cada modelo. Guía de compra de la fábrica Mano Fil en Tlaxcala, desde 1962.",
  alternates: {
    canonical: '/guia-cobertores-por-mayoreo',
  },
  openGraph: {
    title: "Guía de Cobertores por Mayoreo | MANO FIL Cobertores",
    description: "Qué es un cobertor, tipos y gramajes, cómo elegir por mayoreo y para qué sector sirve cada modelo. Guía de compra de la fábrica Mano Fil en Tlaxcala, desde 1962.",
    url: "https://cobertores.com/guia-cobertores-por-mayoreo",
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
    title: "Guía de Cobertores por Mayoreo | MANO FIL Cobertores",
    description: "Qué es un cobertor, tipos y gramajes, cómo elegir por mayoreo y para qué sector sirve cada modelo. Guía de compra de la fábrica Mano Fil en Tlaxcala, desde 1962.",
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
        { "@type": "ListItem", "position": 2, "name": "Guía de cobertores por mayoreo", "item": "https://cobertores.com/guia-cobertores-por-mayoreo" }
      ]
    },
    {
      "@type": "Article",
      "headline": "Guía de cobertores por mayoreo",
      "description": "Qué es un cobertor, tipos y gramajes, cómo elegir por mayoreo y para qué sector sirve cada modelo.",
      "author": { "@type": "Organization", "name": "Mano Fil S.A.", "url": "https://cobertores.com" },
      "publisher": { "@type": "Organization", "name": "Mano Fil S.A.", "url": "https://cobertores.com" },
      "datePublished": "2026-11-06",
      "dateModified": "2026-11-06",
      "mainEntityOfPage": "https://cobertores.com/guia-cobertores-por-mayoreo",
      "inLanguage": "es-MX"
    }
  ]
};

export default function GuiaCobertoresPage() {
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
            <BookOpen className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-4">Fábrica Mano Fil · Tlaxcala · Desde 1962</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Guía de cobertores por mayoreo</h1>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            Qué es un cobertor, qué tipos y gramajes existen, cómo elegir por volumen y para qué sector
            sirve cada modelo. Una guía práctica para comprar cobertores por mayoreo directo de fábrica.
          </p>
        </div>

        <div className="space-y-12 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl text-white font-medium mb-4">¿Qué es un cobertor?</h2>
            <p>
              Un cobertor es una manta gruesa pensada para abrigar y proteger del frío. Los cobertores de
              Mano Fil son cobertores industriales: tejidos para uso intensivo y lavados constantes, con
              retención térmica superior y durabilidad extrema en aplicaciones de alto volumen.
            </p>
            <p className="mt-4">
              Están fabricados con fibras 100% regeneradas, es decir, fibras recicladas (mezcla de acrílico,
              lana, poliéster y otras fibras). Los colores y las medidas pueden variar un 5%.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Package className="w-6 h-6 text-amber-500" /> Tipos y gramajes: los 4 modelos de línea
            </h2>
            <p>
              El gramaje —el peso por pieza— es lo que define el abrigo y el uso de cada cobertor. Estos son
              los cuatro modelos de nuestro <Link href="/productos" className="text-white font-medium hover:text-amber-500 transition-colors">catálogo por mayoreo</Link>:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/tilma-economica-1300-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Tilma Económica 1.300 KG</Link>: un cobertor industrial de tejido compacto y duradero; el modelo más solicitado para distribución masiva, programas sociales, gobierno y hotelería.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/manta-termica-2000-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Manta Térmica 2.000 KG</Link>: el cobertor industrial de mayor gramaje del catálogo, para frío extremo, contingencias, programas invernales y hotelería premium.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/tilma-ribeteada-1150-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Tilma Ribeteada 1.150 KG</Link>: un cobertor industrial con acabados reforzados por ultrasonido perimetral y vida útil prolongada, para hotelería y lavados constantes.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><Link href="/productos/tilma-ligera-1000-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Tilma Ligera 1.000 KG</Link>: un cobertor industrial de peso y volumen optimizados, perfecta para distribución ágil, programas sociales y gobierno.</span></li>
            </ul>
            <p className="mt-4">
              Además de los modelos estándar, podemos desarrollar gramajes específicos, dimensiones a la
              medida y acabados perimetrales por ultrasonido o ribete continuo bajo volumen concertado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">¿Cómo comprar cobertores por mayoreo?</h2>
            <p>
              Manejamos esquemas comerciales escalonados. Atendemos pedidos a partir de medio mayoreo (desde
              50 a 100 piezas) y precios preferenciales de fábrica para volúmenes mayores (500, 1,000 y
              10,000+ piezas). Para licitaciones y compras industriales, adaptamos la capacidad de entrega
              por lotes programados.
            </p>
            <p className="mt-4">
              Los precios son solo por cotización, sin cifras publicadas. Se pueden solicitar muestras
              físicas para evaluación de tu comité de compras o licitación: tienen un costo inicial que se
              bonifica íntegramente al concretar el pedido mayorista.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-500" /> Usos por sector
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Gobierno y ayuda humanitaria:</strong> suministro textil para protección civil, programas gubernamentales, DIF y brigadas de ayuda humanitaria en contingencias climáticas (heladas, inundaciones y sismos). Más en <Link href="/sectores/gobierno" className="text-white font-medium hover:text-amber-500 transition-colors">cobertores para gobierno</Link>.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Hotelería:</strong> blancos y cobertores para hoteles, con modelos de alta durabilidad ante lavados constantes. Más en <Link href="/sectores/hoteleria" className="text-white font-medium hover:text-amber-500 transition-colors">cobertores para hotelería</Link>.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Licitaciones públicas:</strong> suministro por lotes programados con capacidad de respuesta inmediata. Más en <Link href="/sectores/licitaciones" className="text-white font-medium hover:text-amber-500 transition-colors">cobertores para licitaciones</Link>.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Factory className="w-6 h-6 text-amber-500" /> Comprar directo de fábrica
            </h2>
            <p>
              Mano Fil S.A. fabrica cobertores desde 1962 en Santa Ana Chiautempan, Tlaxcala, con oficinas
              comerciales en CDMX. Contamos con inventario permanente y capacidad de respuesta inmediata para
              licitaciones y emergencias, con más de seis décadas de suministro a dependencias de gobierno,
              protección civil y programas de ayuda humanitaria.
            </p>
            <p className="mt-4">
              Realizamos envíos a toda la República Mexicana y exportaciones a Estados Unidos, Canadá,
              Centroamérica y el Caribe, con fletes consolidados y viajes completos dedicados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Truck className="w-6 h-6 text-amber-500" /> Solicitar cotización
            </h2>
            <p>
              Para cotizar por volumen, contáctanos por WhatsApp al +52 246 464 2891 o llena el formulario de
              cotización. Si tu compra es por licitación pública, revisa también los requisitos en nuestra
              página de <Link href="/sectores/licitaciones" className="text-white font-medium hover:text-amber-500 transition-colors">licitaciones</Link>.
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
