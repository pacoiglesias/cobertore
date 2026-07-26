import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Building2, ShieldCheck, MapPin } from 'lucide-react';
import { dictionaries, Lang } from '../../lib/i18n/dictionaries';

// NOTA (2026-07-24): los 3 stats originales ("300,000 m²", "+15 países")
// se quitaron porque no eran cifras verificables/reales. En vez de
// inventar otras cifras "que se vean bien", se reemplazaron por frases
// cualitativas que solo repiten hechos que ya están confirmados en el
// resto del sitio (año de fundación en Heritage.tsx, alcance nacional en
// page.tsx, doble división en Heritage.tsx) — nada nuevo sin verificar.


const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: i * 0.08 },
  }),
};

export function AuthorityRibbon({ lang = 'es' }: { lang?: Lang }) {
  const t = dictionaries[lang].ribbon;
  const STATS = [
    { icon: ShieldCheck, value: t.s1v, label: t.s1l },
    { icon: MapPin, value: t.s2v, label: t.s2l },
    { icon: Building2, value: t.s3v, label: t.s3l },
  ];
  return (
    <section className="bg-slate-50 dark:bg-[#070b14] py-16 lg:py-20 border-t border-slate-200 dark:border-white/5 relative z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent dark:via-[#070b14] to-transparent dark:to-[#070b14] z-0 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="text-center mb-14"
        >
          <span className="inline-block font-mono text-[11px] tracking-[0.3em] uppercase text-amber-500 border border-amber-500/40 rounded-full px-4 py-1.5 shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-amber-500/5 backdrop-blur-sm">
            {t.badge}
          </span>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-6">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                className="text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-slate-200 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-slate-300 dark:border-white/10 group-hover:border-amber-500/30 transition-colors">
                    <Icon className="text-amber-500" size={26} strokeWidth={1.5} />
                </div>
                <p className="font-serif text-slate-900 dark:text-white text-3xl lg:text-4xl drop-shadow-md">{stat.value}</p>
                <p className="font-mono text-[11px] tracking-widest uppercase text-slate-600 dark:text-slate-400 mt-3 max-w-[200px] mx-auto">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
