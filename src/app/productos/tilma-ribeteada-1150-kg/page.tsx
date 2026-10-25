import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Layers, Truck, PackageCheck, Phone } from 'lucide-react';
import { ManoFilLogo } from '../../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Tilma Ribeteada 1.150 KG por Mayoreo | MANO FIL",
  description: "Tilma Ribeteada de 1.150 KG por mayoreo. Acabados reforzados por ultrasonido perimetral y alta durabilidad ante lavados constantes para hotelería.",
  alternates: {
    canonical: '/productos/tilma-ribeteada-1150-kg',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "name": "Tilma Ribeteada 1.150 KG",
      "description": "Tilma Ribeteada de 1.150 KG por mayoreo. Acabados reforzados por ultrasonido perimetral y alta durabilidad ante lavados constantes para hotelería.",
      "image": "https://cobertores.com/products/tilma-ribeteada.webp",
      "brand": {
        "@type": "Brand",
        "name": "Mano Fil"
      },
      "manufacturer": {
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
      "weight": {
        "@type": "QuantitativeValue",
        "value": 1.15,
        "unitCode": "KGM"
      },
      "url": "https://cobertores.com/productos/tilma-ribeteada-1150-kg"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": "https://cobertores.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Productos",
          "item": "https://cobertores.com/#productos"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Tilma Ribeteada 1.150 KG",
          "item": "https://cobertores.com/productos/tilma-ribeteada-1150-kg"
        }
      ]
    }
  ]
};

export default function ProductPage() {
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
            <Layers className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-4">Hotelería y reposición programada</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Tilma Ribeteada 1.150 KG por Mayoreo</h1>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            Acabados reforzados por ultrasonido perimetral y vida útil prolongada. La Tilma Ribeteada de 1.150 KG está diseñada para soportar lavados constantes sin perder forma.
          </p>
        </div>

        <div className="mb-12 rounded-3xl overflow-hidden border border-white/5">
          <img src="/products/tilma-ribeteada.webp" alt="Tilma Ribeteada 1.150 KG" className="w-full h-72 object-cover" />
        </div>

        <div className="space-y-10 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <PackageCheck className="w-6 h-6 text-amber-500" /> Ficha del modelo
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Gramaje:</strong> 1.150 KG por pieza.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Usos recomendados:</strong> Hotelería y reposición programada: hoteles, cadenas de hospedaje y administradoras que necesitan el mismo cobertor, lote tras lote.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Acabados:</strong> gramajes específicos, dimensiones a la medida y acabados perimetrales por ultrasonido o ribete continuo bajo volumen concertado.</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span><strong className="text-white font-medium">Composición:</strong> 100% regenerado, es decir, fibras recicladas (mezcla de acrílico, lana, poliéster y otras fibras).</span></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><span>Los colores y las medidas pueden variar un 5%.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Truck className="w-6 h-6 text-amber-500" /> Volúmenes y muestras
            </h2>
            <p>
              Atendemos pedidos a partir de medio mayoreo (desde 50 a 100 piezas) y precios preferenciales de fábrica
              para volúmenes mayores (500, 1,000 y 10,000+ piezas). Los precios son solo por cotización, sin cifras
              publicadas. Se pueden solicitar muestras físicas para evaluación: tienen un costo inicial que se bonifica
              íntegramente al concretar el pedido mayorista.
            </p>
            <p className="mt-4">
              Fabricamos en nuestra planta de Santa Ana Chiautempan, Tlaxcala, con oficinas comerciales en CDMX.
              Realizamos envíos a toda la República Mexicana y exportaciones a Estados Unidos, Canadá, Centroamérica
              y el Caribe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Solicitar cotización</h2>
            <p>
              Para cotizar este modelo por volumen, contáctanos por WhatsApp al +52 246 464 2891 o llena el formulario
              de cotización. Si tu compra es por licitación pública, también puedes revisar los requisitos en nuestra
              página de <Link href="/sectores/licitaciones" className="text-white font-medium hover:text-amber-500 transition-colors">licitaciones</Link>.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/#contacto" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-colors">
                Solicitar cotización <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://wa.me/522464642891?text=Hola%2C%20solicito%20cotizaci%C3%B3n%20de%20Tilma%20Ribeteada%20por%20mayoreo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-colors">
                <Phone className="w-4 h-4" /> Cotizar por WhatsApp
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Modelos relacionados</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><Link href="/productos/tilma-economica-1300-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Tilma Económica 1.300 KG</Link></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><Link href="/productos/manta-termica-2000-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Manta Térmica 2.000 KG</Link></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><Link href="/productos/tilma-ligera-1000-kg" className="text-white font-medium hover:text-amber-500 transition-colors">Tilma Ligera 1.000 KG</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4">Sectores que lo utilizan</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><Link href="/sectores/hoteleria" className="text-white font-medium hover:text-amber-500 transition-colors">Blancos y cobertores para hotelería</Link></li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
