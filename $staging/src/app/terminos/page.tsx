import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';
import { ManoFilLogo } from '../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Términos y Condiciones Legales | Mano Fil S.A.",
  description: "Términos y condiciones legales para el uso del sitio web y transacciones comerciales de Mano Fil S.A.",
  alternates: {
    canonical: '/terminos',
  },
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans selection:bg-amber-500/30">
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
            <Building2 className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Términos y Condiciones</h1>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold">Vigentes a partir de Julio 2026</p>
        </div>

        <div className="space-y-8 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-xl text-white font-medium mb-4">1. Aceptación de los Términos</h2>
            <p>
              Al acceder, navegar y utilizar el sitio web <strong>cobertores.com</strong> (en adelante el "Sitio"), propiedad de <strong>Mano Fil S.A. de C.V.</strong>, usted acepta sin reservas los presentes Términos y Condiciones. Si no está de acuerdo con alguno de ellos, le solicitamos abstenerse de utilizar nuestro Sitio y nuestros servicios corporativos.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">2. Uso del Portal y Catálogo B2B</h2>
            <p>
              El contenido de este Sitio, incluyendo nuestro catálogo dinámico de productos (tilmas, cobertores, desarrollos inmobiliarios), está destinado principalmente para fines informativos y para facilitar cotizaciones comerciales a nivel industrial y de alto volumen (B2B).
            </p>
            <p className="mt-4">
              La solicitud de una cotización mediante el formulario no constituye un contrato vinculante de compraventa hasta que ambas partes firmen los acuerdos comerciales correspondientes y se realicen los pagos estipulados de forma directa con nuestros agentes de ventas.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">3. Intranet y Acceso Restringido</h2>
            <p>
              La sección denominada "Portal Privado" o "Intranet" es de uso exclusivo para empleados, administradores y personal autorizado de Mano Fil S.A. Cualquier intento de acceso no autorizado, vulneración de contraseñas, o extracción de información confidencial será reportado a las autoridades cibernéticas correspondientes.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">4. Propiedad Intelectual</h2>
            <p>
              Todas las marcas, logotipos, imágenes de productos, textos, diseños, arquitectura web y códigos fuente que aparecen en este Sitio son propiedad exclusiva de Mano Fil S.A. de C.V. o de sus respectivos licenciantes. Queda estrictamente prohibida su reproducción, distribución o uso con fines comerciales sin el consentimiento previo y por escrito de la empresa.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">5. Exactitud de la Información</h2>
            <p>
              Nos esforzamos por mantener las imágenes, pesos (ej. 1.300 KG) y especificaciones técnicas de nuestro catálogo dinámico lo más exactas posibles. Sin embargo, debido a la naturaleza de la producción textil a gran escala, pueden existir ligeras variaciones en gramajes, texturas o colores.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">6. Legislación Aplicable</h2>
            <p>
              Cualquier controversia que se derive de la interpretación o ejecución de los presentes Términos y Condiciones, se regirá por las leyes vigentes en los Estados Unidos Mexicanos, sometiéndose a la jurisdicción de los tribunales competentes en Tlaxcala, renunciando expresamente a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
