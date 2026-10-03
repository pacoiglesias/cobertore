'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQProps {
  lang?: 'es' | 'en';
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: Record<'es' | 'en', {
  tag: string;
  title: string;
  subtitle: string;
  items: FAQItem[];
}> = {
  es: {
    tag: 'Preguntas Frecuentes',
    title: 'Dudas Comunes sobre Suministro Mayorista',
    subtitle: 'Todo lo que necesitas saber para compras corporativas, licitaciones y distribución masiva.',
    items: [
      {
        question: '¿Cuál es el volumen mínimo para acceder a precios de mayoreo?',
        answer: 'Manejamos esquemas comerciales escalonados. Atendemos pedidos a partir de medio mayoreo (desde 50 a 100 piezas) y precios preferenciales de fábrica para volúmenes mayores (500, 1,000, 10,000+ piezas). Para licitaciones y compras industriales, adaptamos la capacidad de entrega por lotes programados.'
      },
      {
        question: '¿Realizan envíos a toda la República Mexicana y exportaciones?',
        answer: 'Sí. Contamos con una sólida red logística con base en Santa Ana Chiautempan, Tlaxcala, y oficinas en CDMX. Coordinamos fletes consolidados y viajes completos dedicados a cualquier estado de México, así como despacho aduanal para exportación a Estados Unidos, Canadá, Centroamérica y el Caribe.'
      },
      {
        question: '¿Tienen capacidad de respuesta inmediata para licitaciones y emergencias?',
        answer: 'Absolutamente. Hemos participado por más de 6 décadas en el suministro textil para protección civil, programas gubernamentales, DIF, brigadas de ayuda humanitaria y situaciones de contingencia climática (heladas, inundaciones y sismos), con inventario permanente y capacidad de respuesta rápida.'
      },
      {
        question: '¿Fabrican medidas especiales, composiciones o personalización de cobertores?',
        answer: 'Sí. Además de nuestros modelos estándar de línea (Tilma Económica 1.300 KG, Manta Térmica 2.000 KG, Tilma Ribeteada 1.150 KG y Tilma Ligera 1.000 KG), podemos desarrollar gramajes específicos, dimensiones a la medida y acabados perimetrales por ultrasonido o ribete continuo bajo volumen concertado.'
      },
      {
        question: '¿Cómo puedo solicitar muestras físicas de los cobertores?',
        answer: 'Puedes solicitar muestras físicas para evaluación de tu comité de compras o licitación contactando a nuestro equipo comercial por WhatsApp al +52 246 464 2891 o llenando el formulario directo en esta página. Enviamos muestras por mensajería express a cualquier parte del país. Las muestras y su envío tienen un costo inicial; sin embargo, al concretar tu pedido mayorista, dicho importe se bonifica íntegramente en tu factura final.'
      }
    ]
  },
  en: {
    tag: 'Frequently Asked Questions',
    title: 'Common Wholesale Supply Inquiries',
    subtitle: 'Everything you need to know for corporate procurement, government tenders, and bulk distribution.',
    items: [
      {
        question: 'What is the minimum order quantity (MOQ) for wholesale pricing?',
        answer: 'We operate tiered commercial pricing. We serve orders starting from mid-wholesale (50 to 100 units) up to preferred factory pricing for large-scale volumes (500, 1,000, 10,000+ units). For institutional tenders and corporate procurement, we configure scheduled batch delivery programs.'
      },
      {
        question: 'Do you ship across Mexico and handle international exports?',
        answer: 'Yes. Based out of our central manufacturing facilities in Santa Ana Chiautempan, Tlaxcala, and our commercial offices in Mexico City, we coordinate consolidated freight and dedicated full truckloads across Mexico, as well as customs export logistics to the USA, Canada, Central America, and the Caribbean.'
      },
      {
        question: 'Do you have immediate response capacity for emergency relief and tenders?',
        answer: 'Absolutely. For over six decades, Mano Fil S.A. has supported civil protection agencies, disaster relief programs, humanitarian aid brigades, and emergency freeze responses with guaranteed production capacity and rapid logistics deployment.'
      },
      {
        question: 'Can you manufacture custom dimensions, weights, or branded specifications?',
        answer: 'Yes. In addition to our core catalog (Economy Tilma 1.300 KG, Thermal Blanket 2.000 KG, Trimmed Tilma 1.150 KG, Lightweight Tilma 1.000 KG), we engineer custom GSM weights, tailored dimensions, and ultrasonic or stitched perimeter finishes for contractual volumes.'
      },
      {
        question: 'How can I request physical fabric and blanket samples?',
        answer: 'You can request physical samples for procurement review by contacting our corporate team via WhatsApp at +52 246 464 2891 or by completing the direct quotation form on this page. We dispatch samples via express courier worldwide. Samples and shipping carry an initial nominal cost; however, upon closing your bulk wholesale order, the full sample cost is credited directly towards your final invoice.'
      }
    ]
  }
};

export function FAQ({ lang = 'es' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const data = FAQ_DATA[lang];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Schema.org FAQPage JSON-LD
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': data.items.map((item) => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  };

  return (
    <section id="faq" className="py-24 md:py-32 relative bg-[#070b14] border-t border-white/5 z-10 scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-900/10 via-[#070b14] to-[#070b14] z-0 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5" />
            {data.tag}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 drop-shadow-xl">
            {data.title}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {data.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white/[0.04] border-amber-500/40 shadow-[0_10px_30px_rgba(245,158,11,0.08)]'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left p-6 md:p-7 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg md:text-xl text-white font-medium">
                    {item.question}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? 'bg-amber-500 text-black border-amber-400 rotate-180'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-amber-500/30'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 md:px-7 md:pb-7 text-slate-400 font-light leading-relaxed border-t border-white/5 pt-4 text-sm md:text-base">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* JSON-LD Schema FAQPage for Google & Bing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </section>
  );
}
