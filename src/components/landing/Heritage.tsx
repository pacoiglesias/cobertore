import React from 'react';
import { motion } from 'framer-motion';

interface HeritageProps {
  lang?: 'es' | 'en';
}

const TIMELINE = {
  es: [
    {
      year: "1964",
      title: "Fundación del taller textil",
      copy: "Inicio de operaciones de manufactura textil, con foco en calidad de hilado y confección a escala.",
    },
    {
      year: "1980—1990",
      title: "Expansión industrial",
      copy: "Modernización de maquinaria y consolidación como proveedor mayorista de cobertores y blancos para el hogar.",
    },
    {
      year: "2000",
      title: "Nace la División Inmobiliaria",
      copy: "La experiencia en administración de activos industriales se traduce en desarrollo y arrendamiento de naves y desarrollos comerciales.",
    },
    {
      year: "Hoy",
      title: "Grupo consolidado de doble división",
      copy: "Manufactura textil de exportación y un portafolio inmobiliario en crecimiento sostenido, bajo una misma disciplina corporativa.",
    },
  ],
  en: [
    {
      year: "1964",
      title: "Textile Mill Foundation",
      copy: "Commencement of textile manufacturing operations, focusing on yarn quality and scalable tailoring.",
    },
    {
      year: "1980—1990",
      title: "Industrial Expansion",
      copy: "Machinery modernization and consolidation as a wholesale supplier of blankets and home textiles.",
    },
    {
      year: "2000",
      title: "Real Estate Division Founded",
      copy: "Expertise in industrial asset management evolves into development and leasing of industrial warehouses and commercial developments.",
    },
    {
      year: "Today",
      title: "Consolidated Dual-Division Group",
      copy: "Export-grade textile manufacturing and a steadily expanding real estate portfolio, governed by uniform corporate discipline.",
    },
  ],
};

const TEXTS = {
  es: {
    eyebrow: "Herencia industrial",
    title: "De un telar a un grupo empresarial.",
    p1: "Mano Fil S.A. nació en 1964 como un taller textil familiar orientado a la calidad manufacturera. Ese mismo rigor —precisión en el proceso, disciplina en la administración, visión de largo plazo— fue lo que, décadas después, nos permitió capitalizar nuestros activos y expandirnos hacia el desarrollo inmobiliario e industrial. Hoy, el grupo opera dos divisiones que comparten un mismo principio: construir valor que perdura.",
  },
  en: {
    eyebrow: "Industrial Heritage",
    title: "From a single loom to an enterprise group.",
    p1: "Mano Fil S.A. was founded in 1964 as a family textile mill focused on manufacturing quality. That same rigor—process precision, administrative discipline, long-term vision—allowed us decades later to leverage our assets and expand into industrial and commercial real estate development. Today, the group operates two divisions sharing the same core principle: building enduring value.",
  },
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: i * 0.08 },
  }),
};

export function Heritage({ lang = 'es' }: HeritageProps) {
  const content = TEXTS[lang];
  const items = TIMELINE[lang];

  return (
    <section id="herencia" className="py-24 lg:py-40 bg-[#070b14] relative overflow-hidden z-10 border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/5 via-[#070b14] to-[#070b14] z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-14 relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="lg:col-span-5"
        >
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-amber-500 font-bold mb-4">{content.eyebrow}</p>
          <h2 className="font-serif text-white text-4xl sm:text-5xl lg:text-6xl leading-tight drop-shadow-xl">
            {content.title}
          </h2>
          <p className="text-slate-400 font-light text-lg mt-8 leading-relaxed">
            {content.p1}
          </p>
        </motion.div>

        <div className="lg:col-span-7 lg:pl-16 lg:border-l border-white/10 space-y-16 mt-8 lg:mt-0">
          {items.map((item, i) => (
            <motion.div
              key={item.year}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="relative pl-8"
            >
              <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <p className="font-mono text-[13px] font-bold tracking-widest text-amber-500">{item.year}</p>
              <p className="font-serif text-white text-2xl mt-3">{item.title}</p>
              <p className="text-slate-400 font-light mt-3 leading-relaxed max-w-xl">{item.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
