import React from 'react';
import { motion, Variants } from 'framer-motion';
import { CldImage } from 'next-cloudinary';
import { ArrowRight, ChevronRight, Building2, Factory } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: i * 0.08 },
  }),
};

function SectionEyebrow({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <p
      className={`font-mono text-[11px] tracking-[0.28em] uppercase text-amber-500 font-bold ${className}`}
    >
      {children}
    </p>
  );
}

function DivisionCard({ id, eyebrow, title, copy, bullets, ctaLabel, image, alt, variant }: { id: string; eyebrow: string; title: string; copy: string; bullets: string[]; ctaLabel: string; image: string; alt: string; variant: 'textil' | 'inmobiliaria' }) {
  const isTextil = variant === "textil";
  // Construimos una URL absoluta para que Cloudinary la haga 'fetch' desde producción
  const absoluteUrl = `https://cobertores.com${image}`;
  return (
    <motion.article
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`relative overflow-hidden rounded-[2.5rem] min-h-[540px] flex flex-col p-9 lg:p-12 border transition-all duration-500 group ${
        isTextil ? "bg-white dark:bg-[#0a0f1d] border-slate-200 dark:border-white/5 hover:border-amber-500/30" : "bg-slate-50 dark:bg-[#070b14] border-slate-200 dark:border-white/5 hover:border-amber-500/30"
      }`}
    >
      <CldImage
        src={absoluteUrl}
        deliveryType="fetch"
        alt={alt}
        width={800}
        height={800}
        sizes="(max-width: 768px) 100vw, 50vw"
        format="webp"
        className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 grayscale group-hover:grayscale-0 mix-blend-luminosity absolute inset-0"
      />
      <div
        className={`absolute inset-0 ${
          isTextil
            ? "bg-gradient-to-t from-white via-white/85 to-white/60 dark:from-[#0a0f1d] dark:via-[#0a0f1d]/85 dark:to-[#0a0f1d]/60"
            : "bg-gradient-to-t from-slate-50 via-slate-50/85 to-slate-50/60 dark:from-[#070b14] dark:via-[#070b14]/85 dark:to-[#070b14]/60"
        }`}
      />
      
      {/* Icon */}
      <div className="absolute top-10 right-10 z-20">
         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border backdrop-blur-md shadow-xl dark:shadow-2xl transition-colors ${
            isTextil ? "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white group-hover:border-slate-300 dark:group-hover:border-white/30" : "bg-amber-600/10 border-amber-500/20 text-amber-500 group-hover:border-amber-500/50"
         }`}>
           {isTextil ? <Factory size={24} /> : <Building2 size={24} />}
         </div>
      </div>

      <div className="relative flex flex-col h-full z-20">
        <SectionEyebrow className={isTextil ? "text-slate-500 dark:text-slate-400" : "text-amber-500"}>{eyebrow}</SectionEyebrow>
        <h3 className="font-serif text-slate-900 dark:text-white text-3xl mt-6 leading-snug drop-shadow-md">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 mt-5 leading-relaxed font-light">{copy}</p>
        <ul className="mt-8 space-y-3 font-mono text-[12px] tracking-wide text-slate-600 dark:text-slate-300">
          {bullets.map((b: string) => (
            <li key={b} className="flex items-start gap-3">
              <ChevronRight size={16} className={`${isTextil ? "text-slate-400 dark:text-slate-500" : "text-amber-500"} mt-0.5 shrink-0`} />
              {b}
            </li>
          ))}
        </ul>
        <a
          href="#contacto"
          className={`mt-auto pt-10 inline-flex items-center gap-2 font-mono text-[12px] tracking-widest uppercase font-bold transition-colors w-fit ${
            isTextil ? "text-slate-800 dark:text-white hover:text-amber-500 dark:hover:text-amber-500" : "text-amber-500 hover:text-amber-400"
          }`}
        >
          {ctaLabel}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </motion.article>
  );
}

export function DualNavigation() {
  return (
    <section id="divisiones" className="py-24 lg:py-32 bg-white dark:bg-[#0a0f1d] relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-2xl mb-16"
        >
          <SectionEyebrow className="mb-4">Dos divisiones, un mismo grupo</SectionEyebrow>
          <h2 className="font-serif text-3xl lg:text-5xl text-slate-900 dark:text-white leading-tight drop-shadow-xl">
            Comercialización logística y patrimonio inmobiliario, bajo una sola disciplina corporativa.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <DivisionCard
            id="textil"
            variant="textil"
            eyebrow="División Textil · Cobertores.com"
            title="Distribución Textil de Alta Gama."
            copy="Cobertores, blancos para el hogar, hilos y telas técnicas. Suministramos volúmenes corporativos respaldados por rigurosos controles de calidad y alianzas estratégicas a nivel nacional e internacional."
            bullets={[
              "Cobertores y blancos para el hogar",
              "Hilos industriales y telas técnicas",
              "Distribución logística certificada",
            ]}
            ctaLabel="Explorar catálogo textil"
            image="/division-textile.webp"
            alt="Textura de cobertor de lujo sobre telar industrial"
          />
          <DivisionCard
            id="inmobiliaria"
            variant="inmobiliaria"
            eyebrow="División Inmobiliaria"
            title="Bienes raíces & desarrollos industriales."
            copy="Naves industriales, desarrollos comerciales y activos residenciales estratégicos, planeados con el mismo rigor operativo que ha definido a nuestra comercialización logística desde 1962. Patrimonio que se administra, no solo se construye."
            bullets={[
              "Naves y parques industriales",
              "Desarrollos comerciales",
              "Activos residenciales estratégicos",
            ]}
            ctaLabel="Ver portafolio inmobiliario"
            image="/division-realestate.webp"
            alt="Fachada de nave industrial moderna del portafolio inmobiliario"
          />
        </div>
      </div>
    </section>
  );
}
