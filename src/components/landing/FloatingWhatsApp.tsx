'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingWhatsAppProps {
  lang?: 'es' | 'en';
}

export function FloatingWhatsApp({ lang = 'es' }: FloatingWhatsAppProps) {
  const [isHovered, setIsHovered] = useState(false);

  const texts = {
    es: {
      tooltip: 'Cotizar por Mayoreo',
      status: 'En línea',
      message: 'Hola, solicito cotización de cobertores por mayoreo.',
      aria: 'Contactar por WhatsApp para cotización mayorista',
    },
    en: {
      tooltip: 'Wholesale Quote',
      status: 'Online now',
      message: 'Hello, I would like to request a wholesale quote for blankets.',
      aria: 'Contact via WhatsApp for wholesale inquiry',
    },
  };

  const t = texts[lang];
  const whatsappUrl = `https://wa.me/522464642891?text=${encodeURIComponent(t.message)}`;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip Pill */}
      <AnimatePresence>
        {(isHovered || true) && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex items-center gap-2.5 bg-[#0a0f1d]/95 backdrop-blur-xl border border-white/10 text-white px-4 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] pointer-events-none"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wide text-slate-200">
              {t.tooltip}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.aria}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative group flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all duration-300 border border-white/20"
      >
        {/* Pulsing halo */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 group-hover:scale-125 transition-transform duration-500 animate-pulse pointer-events-none"></span>

        {/* WhatsApp Official SVG */}
        <svg 
          className="w-7 h-7 fill-current relative z-10 drop-shadow-md" 
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.18-.543-1.895-.788-3.078-2.73-3.172-2.857-.093-.127-.768-1.02-.768-1.947 0-.927.483-1.382.655-1.571.172-.189.378-.236.505-.236.126 0 .252.002.362.008.117.006.273-.044.426.326.157.379.537 1.309.584 1.405.047.095.078.207.016.333-.063.127-.094.206-.188.318-.094.111-.197.248-.282.333-.095.095-.194.198-.083.389.111.191.493.813 1.057 1.317.727.649 1.34.851 1.531.947.191.095.303.079.414-.048.111-.127.476-.556.603-.746.127-.191.254-.159.428-.095.174.063 1.111.524 1.302.619.191.095.318.143.365.222.048.079.048.459-.096.864zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.436 5.178L2 22l4.978-1.308A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.634 0-3.15-.478-4.425-1.303l-.317-.206-2.957.777.79-2.883-.226-.359C3.992 14.801 3.5 13.456 3.5 12 3.5 7.313 7.313 3.5 12 3.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/>
        </svg>
      </motion.a>
    </div>
  );
}
