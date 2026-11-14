import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Package, Truck, Phone, ShieldCheck, Factory } from 'lucide-react';
import { ManoFilLogo } from '../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  // Sin " | MANO FIL": la plantilla del layout ya añade "| MANO FIL Cobertores".
  title: "Cobertores por Mayoreo — Catálogo",
  description: "Catálogo de cobertores por mayoreo: Tilma Económica 1.300 KG, Manta Térmica 2.000 KG, Tilma Ribeteada 1.150 KG y Tilma Ligera 1.000 KG. Fábrica textil en Tlaxcala desde 1962, envíos a todo México.",
  alternates: {
    canonical: '/productos',
  },
  openGraph: {
    title: "Cobertores por Mayoreo — Catálogo | MANO FIL Cobertores",
    description: "Catálogo de cobertores por mayoreo: Tilma Económica 1.300 KG, Manta Térmica 2.000 KG, Tilma Ribeteada 1.150 KG y Tilma Ligera 1.000 KG. Fábrica textil en Tlaxcala desde 1962, envíos a todo México.",
    url: "https://cobertores.com/productos",
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
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cobertores por Mayoreo — Catálogo | MANO FIL Cobertores",
    description: "Catálogo de cobertores por mayoreo: Tilma Económica 1.300 KG, Manta Térmica 2.000 KG, Tilma Ribeteada 1.150 KG y Tilma Ligera 1.000 KG. Fábrica textil en Tlaxcala desde 1962, envíos a todo México.",
    images: ["/og-cover.jpg"],
  },
};

// BreadcrumbList + ItemList del catálogo + los 4 Product (P1-1, auditoría
// SEO 14 nov 2026). Los Product van SIN Offer (precios solo por cotización;
// la decisión de precio «desde», P1-2, sigue pendiente de Paco) y enlazan por
// @id a los de cada ficha y a la Organization del layout.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://cobertores.com" },
        { "@type": "ListItem", "position": 2, "name": "Productos", "item": "https://cobertores.com/productos" }
      ]
    },
    {
      "@type": "ItemList",
      "name": "Catálogo de cobertores por mayoreo",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Cobertor Tilma Económica 1.300 KG", "url": "https://cobertores.com/productos/tilma-economica-1300-kg" },
        { "@type": "ListItem", "position": 2, "name": "Cobertor Manta Térmica 2.000 KG", "url": "https://cobertores.com/productos/manta-termica-2000-kg" },
        { "@type": "ListItem", "position": 3, "name": "Cobertor Tilma Ribeteada 1.150 KG", "url": "https://cobertores.com/productos/tilma-ribeteada-1150-kg" },
        { "@type": "ListItem", "position": 4, "name": "Cobertor Tilma Ligera 1.000 KG", "url": "https://cobertores.com/productos/tilma-ligera-1000-kg" }
      ]
    },
    {
      "@type": "Product",
      "@id": "https://cobertores.com/productos/tilma-economica-1300-kg#producto",
      "name": "Cobertor Tilma Económica 1.300 KG",
      "description": "Cobertor industrial de tejido compacto y duradero, para distribución masiva, programas sociales, gobierno y hotelería. Soporta uso industrial y lavados constantes.",
      "url": "https://cobertores.com/productos/tilma-economica-1300-kg",
      "image": "https://cobertores.com/products/tilma-eco-1-3kg.webp",
      "category": "Cobertores por mayoreo",
      "material": "Fibras 100% regeneradas (mezcla de acrílico, lana, poliéster y otras fibras)",
      "weight": { "@type": "QuantitativeValue", "value": 1.3, "unitCode": "KGM" },
      "brand": { "@type": "Brand", "name": "Mano Fil" },
      "manufacturer": { "@id": "https://cobertores.com/#organization" }
    },
    {
      "@type": "Product",
      "@id": "https://cobertores.com/productos/manta-termica-2000-kg#producto",
      "name": "Cobertor Manta Térmica 2.000 KG",
      "description": "Cobertor industrial de mayor gramaje del catálogo, con aislamiento térmico de grado superior para frío extremo, contingencias, programas invernales y hotelería premium.",
      "url": "https://cobertores.com/productos/manta-termica-2000-kg",
      "image": "https://cobertores.com/products/manta-eco-2kg.webp",
      "category": "Cobertores por mayoreo",
      "material": "Fibras 100% regeneradas (mezcla de acrílico, lana, poliéster y otras fibras)",
      "weight": { "@type": "QuantitativeValue", "value": 2, "unitCode": "KGM" },
      "brand": { "@type": "Brand", "name": "Mano Fil" },
      "manufacturer": { "@id": "https://cobertores.com/#organization" }
    },
    {
      "@type": "Product",
      "@id": "https://cobertores.com/productos/tilma-ribeteada-1150-kg#producto",
      "name": "Cobertor Tilma Ribeteada 1.150 KG",
      "description": "Cobertor industrial con acabados reforzados por ultrasonido perimetral y vida útil prolongada, diseñado para soportar lavados constantes sin perder forma. Ideal para hotelería.",
      "url": "https://cobertores.com/productos/tilma-ribeteada-1150-kg",
      "image": "https://cobertores.com/products/tilma-ribeteada.webp",
      "category": "Cobertores por mayoreo",
      "material": "Fibras 100% regeneradas (mezcla de acrílico, lana, poliéster y otras fibras)",
      "weight": { "@type": "QuantitativeValue", "value": 1.15, "unitCode": "KGM" },
      "brand": { "@type": "Brand", "name": "Mano Fil" },
      "manufacturer": { "@id": "https://cobertores.com/#organization" }
    },
    {
      "@type": "Product",
      "@id": "https://cobertores.com/productos/tilma-ligera-1000-kg#producto",
      "name": "Cobertor Tilma Ligera 1.000 KG",
      "description": "Cobertor industrial de peso y volumen optimizados para distribución ágil, programas sociales y gobierno: ocupa menos, pesa menos y se mueve más rápido.",
      "url": "https://cobertores.com/productos/tilma-ligera-1000-kg",
      "image": "https://cobertores.com/products/tilma-eco-1kg.webp",
      "category": "Cobertores por mayoreo",
      "material": "Fibras 100% regeneradas (mezcla de acrílico, lana, poliéster y otras fibras)",
      "weight": { "@type": "QuantitativeValue", "value": 1, "unitCode": "KGM" },
      "brand": { "@type": "Brand", "name": "Mano Fil" },
      "manufacturer": { "@id": "https://cobertores.com/#organization" }
    }
  ]
};

const PRODUCTS = [
  {
    href: "/productos/tilma-economica-1300-kg",
    title: "Cobertor Tilma Económica 1.300 KG",
    weight: "1.300 KG",
    img: "/products/tilma-eco-1-3kg.webp",
    alt: "Tilma Económica 1.300 KG, un cobertor industrial por mayoreo",
    desc: "Un cobertor industrial de tejido compacto y duradero. Soporta uso industrial y lavados constantes; el modelo más solicitado para distribución masiva, programas sociales, gobierno y hotelería.",
  },
  {
    href: "/productos/manta-termica-2000-kg",
    title: "Cobertor Manta Térmica 2.000 KG",
    weight: "2.000 KG",
    img: "/products/manta-eco-2kg.webp",
    alt: "Manta Térmica 2.000 KG, un cobertor industrial por mayoreo",
    desc: "El cobertor industrial de mayor gramaje del catálogo: aislamiento térmico de grado superior, pensado para frío extremo, contingencias, programas invernales y hotelería premium.",
  },
  {
    href: "/productos/tilma-ribeteada-1150-kg",
    title: "Cobertor Tilma Ribeteada 1.150 KG",
    weight: "1.150 KG",
    img: "/products/tilma-ribeteada.webp",
    alt: "Tilma Ribeteada 1.150 KG, un cobertor industrial por mayoreo",
    desc: "Un cobertor industrial con acabados reforzados por ultrasonido perimetral y vida útil prolongada, diseñado para soportar lavados constantes sin perder forma. Ideal para hotelería.",
  },
  {
    href: "/productos/tilma-ligera-1000-kg",
    title: "Cobertor Tilma Ligera 1.000 KG",
    weight: "1.000 KG",
    img: "/products/tilma-eco-1kg.webp",
    alt: "Tilma Ligera 1.000 KG, un cobertor industrial por mayoreo",
    desc: "Un cobertor industrial de peso y volumen optimizados, perfecta para distribución ágil: ocupa menos, pesa menos y se mueve más rápido. Para programas sociales y gobierno.",
  },
];

export default function ProductosPage() {
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
            <Factory className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-4">Fábrica textil en Tlaxcala desde 1962</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Cobertores por Mayoreo</h1>
          <p className="text-slate-400 font-light leading-relaxed text-lg">
            Catálogo de cobertores, cobijas y tilmas por mayoreo de Mano Fil S.A. Cuatro modelos de línea,
            fabricados en nuestra planta de Santa Ana Chiautempan, Tlaxcala, para gobierno, hotelería,
            licitaciones y distribución masiva. Envíos a todo México y exportación internacional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {PRODUCTS.map((p) => (
            <Link key={p.href} href={p.href} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/50 group transition-all duration-500 flex flex-col hover:-translate-y-1">
              <div className="h-56 overflow-hidden relative">
                <img src={p.img} alt={p.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-amber-500 text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full border border-amber-500/30">
                  {p.weight}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="font-serif text-2xl text-white mb-3">{p.title}</h2>
                <p className="text-slate-400 text-sm font-light leading-relaxed flex-grow">{p.desc}</p>
                <span className="mt-5 text-amber-500 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 group-hover:text-amber-400">
                  Ver la ficha del cobertor <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="space-y-10 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Package className="w-6 h-6 text-amber-500" /> Volúmenes y muestras
            </h2>
            <p>
              Atendemos pedidos a partir de medio mayoreo (desde 50 a 100 piezas) y precios preferenciales de
              fábrica para volúmenes mayores (500, 1,000 y 10,000+ piezas). Los precios son solo por cotización,
              sin cifras publicadas. Se pueden solicitar muestras físicas para evaluación: tienen un costo inicial
              que se bonifica íntegramente al concretar el pedido mayorista.
            </p>
            <p className="mt-4">
              Si no sabes qué modelo te conviene, consulta nuestra <Link href="/guia-cobertores-por-mayoreo" className="text-white font-medium hover:text-amber-500 transition-colors">guía de cobertores por mayoreo</Link>,
              con los gramajes, los usos por sector y cómo elegir por volumen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-500" /> Sectores que suministramos
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3"><span className="text-amber-500">—</span><Link href="/sectores/gobierno" className="text-white font-medium hover:text-amber-500 transition-colors">Cobertores para gobierno y ayuda humanitaria</Link></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><Link href="/sectores/hoteleria" className="text-white font-medium hover:text-amber-500 transition-colors">Blancos y cobertores para hotelería</Link></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><Link href="/sectores/hospitales" className="text-white font-medium hover:text-amber-500 transition-colors">Cobertores para hospitales y clínicas</Link></li>
              <li className="flex gap-3"><span className="text-amber-500">—</span><Link href="/sectores/licitaciones" className="text-white font-medium hover:text-amber-500 transition-colors">Cobertores para licitaciones públicas</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white font-medium mb-4 flex items-center gap-3">
              <Truck className="w-6 h-6 text-amber-500" /> Envíos y exportación
            </h2>
            <p>
              Realizamos envíos a toda la República Mexicana y exportaciones a Estados Unidos, Canadá,
              Centroamérica y el Caribe, con fletes consolidados y viajes completos dedicados.
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
