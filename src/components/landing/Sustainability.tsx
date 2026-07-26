import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: i * 0.08 },
  }),
};

export function Sustainability() {
  return (
    <section id="sustentabilidad" className="py-24 lg:py-32 bg-white dark:bg-[#0a0f1d] border-t border-slate-200 dark:border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-2xl mb-16 text-center mx-auto"
        >
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-amber-500 font-bold mb-4">Compromiso ambiental</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-slate-900 dark:text-white leading-tight drop-shadow-md">
            Solidez industrial con responsabilidad de largo plazo.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {[
            {
              tag: "Producción Textil",
              title: "Procesos textiles de menor impacto",
              copy: "Optimización del consumo hídrico y energético en el proceso de hilado y teñido, uso creciente de fibras de origen responsable, y tratamiento de aguas residuales previo a su reincorporación al proceso productivo.",
            },
            {
              tag: "Desarrollo Inmobiliario",
              title: "Edificaciones de bajo impacto",
              copy: "Criterios de eficiencia energética e hídrica en el diseño de naves y desarrollos comerciales, gestión responsable de residuos de obra y selección de materiales de menor huella ambiental en cada proyecto.",
            },
          ].map((block, i) => (
            <motion.div
              key={block.tag}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-white/5 p-9 lg:p-10 rounded-3xl hover:border-amber-500/30 dark:hover:bg-white/[0.02] transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 mb-6">
                <Leaf className="text-amber-500" size={24} strokeWidth={1.5} />
              </div>
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-amber-500/80 font-bold">
                {block.tag}
              </span>
              <h3 className="font-serif text-slate-900 dark:text-white text-2xl mt-4">{block.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-light">{block.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
