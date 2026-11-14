import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, DollarSign, Phone, Truck } from 'lucide-react';
import { ManoFilLogo } from '../../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  // Sin " | MANO FIL": la plantilla del layout ya añade "| MANO FIL Cobertores".
  // Artículo del clúster de guías (P1-4, auditoría SEO 14 nov 2026). Explica los
  // factores del precio; NO publica cifras: los precios de la casa son solo por
  // cotización y la decisión de precio «desde» (P1-2) sigue pendiente de Paco.
  title: "Cuánto cuesta un cobertor por mayoreo y de qué depende",
  description: "El precio de un cobertor por mayoreo depende del gramaje, el volumen, los acabados y el flete. Qué factores lo fijan y cómo cotizar directo de fábrica en Tlaxcala.",
  alternates: {
    canonical: '/guias/cuanto-cuesta-un-cobertor-por-mayoreo',
  },
  openGraph: {
    title: "Cuánto cuesta un cobertor por mayoreo y de qué depende | MANO FIL Cobertores",
    description: "El precio de un cobertor por mayoreo depende del gramaje, el volumen, los acabados y el flete. Qué factores lo fijan y cómo cotizar directo de fábrica en Tlaxcala.",
    url: "https://cobertores.com/guias/cuanto-cuesta-un-cobertor-por-mayoreo",
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
    title: "Cuánto cuesta un cobertor por mayoreo y de qué depende | MANO FIL Cobertores",
    description: "El precio de un cobertor por mayoreo depende del gramaje, el volumen, los acabados y el flete. Qué factores lo fijan y cómo cotizar directo de fábrica en Tlaxcala.",
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
        { "@type": "ListItem", "position": 3, "name": "Cuánto cuesta un cobertor por mayoreo", "item": "https://cobertores.com/guias/cuanto-cuesta-un-cobertor-por-mayoreo" }
      ]
    },
    {
      "@type": "Article",
      "headline": "Cuánto cuesta un cobertor por mayoreo y de qué depende",
      "description": "El precio de un cobertor por mayoreo depende del gramaje, el volumen, los acabados y el flete. Qué factores lo fijan y cómo cotizar directo de fábrica.",
      "author": { "@type": "Organization", "name": "Mano Fil S.A.", "url": "https://cobertores.com" },
      "publisher": { "@type": "Organization", "name": "Mano Fil S.A.", "url": "https://cobertores.com" },
      "datePublished": "2026-11-14",
      "dateModified": "2026-11-14",
      "mainEntityOfPage": "https://cobertores.com/guias/cuanto-cuesta-un-cobertor-por-mayoreo",
      "inLanguage": "es-MX"
    }
  ]
};

export default function CuantoCuestaPage() {
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
            <DollarSign className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-4">Guías Mano Fil · Fábrica de cobertores</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Cuánto cuesta un cobertor por mayoreo y de qué depende</h1>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            No hay un precio único de lista: el costo por pieza de un cobertor al mayoreo se construye con el
            gramaje, el volumen del pedido, los acabados y el destino. Esto es lo que realmente lo mueve.
          </p>
        </div>

        <div className="space-y-12 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl text-white font-medium mb-4">La respuesta corta</h2>
            <p>
              Un cobertor por mayoreo cuesta menos por pieza entre mayor sea el volumen y más sencillo el modelo,
              y cuesta más cuando sube el gramaje o se piden acabados y medidas especiales. Por eso en Mano Fil
              los precios son solo por cotización, sin cifras publicadas: cada cotización se calcula sobre tu
              volumen y tu destino reales, directo de fábrica y sin intermediarios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Los factores que fijan el precio</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">El modelo y su gramaje:</strong> más peso por pieza es más fibra y más abrigo. La <Link href="/productos/tilma-ligera-1000-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Tilma Ligera de 1.000 KG</Link> y la <Link href="/productos/tilma-economica-1300-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Tilma Económica de 1.300 KG</Link> son los modelos de volumen; la <Link href="/productos/manta-termica-2000-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Manta Térmica de 2.000 KG</Link> es el tope de gramaje del catálogo.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">El volumen del pedido:</strong> trabajamos esquemas escalonados: medio mayoreo desde 50 a 100 piezas y precios preferenciales de fábrica para 500, 1,000 y 10,000+ piezas.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Acabados y medidas especiales:</strong> el ribete reforzado por ultrasonido de la <Link href="/productos/tilma-ribeteada-1150-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Tilma Ribeteada de 1.150 KG</Link>, los gramajes específicos y las dimensiones a la medida se cotizan según el volumen concertado.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">El flete y el destino:</strong> enviamos a toda la República con fletes consolidados o viajes completos dedicados; el destino y la urgencia forman parte del costo total entregado.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">El canal de compra:</strong> comprar directo de fábrica elimina intermediarios. En licitaciones, además, la entrega puede programarse por lotes, lo que ordena el flujo y el costo logístico.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Las muestras no son un gasto perdido</h2>
            <p>
              Puedes solicitar muestras físicas para que tu comité de compras o licitación evalúe el producto
              real. Tienen un costo inicial que se bonifica íntegramente al concretar el pedido mayorista: la
              muestra se convierte en parte de tu compra, no en un gasto aparte.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Cómo pedir tu cotización</h2>
            <p>
              Para cotizarte con precisión necesitamos tres datos: el modelo (o el uso que le darás), el número
              de piezas y el destino de entrega. Con eso recibes precio de fábrica por volumen. Revisa primero
              el <Link href="/productos" className="text-white font-medium hover:text-amber-500 transition-colors">catálogo de cobertores por mayoreo</Link> y,
              si aún no tienes claro el modelo, la <Link href="/guia-cobertores-por-mayoreo" className="text-white font-medium hover:text-amber-500 transition-colors">guía de cobertores por mayoreo</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Truck className="w-6 h-6 text-amber-500" /> Solicitar cotización
            </h2>
            <p>
              Contáctanos por WhatsApp al +52 246 464 2891 o llena el formulario de cotización con tu modelo,
              volumen y destino.
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
