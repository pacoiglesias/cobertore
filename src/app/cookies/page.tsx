import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';
import { ManoFilLogo } from '../../components/ManoFilLogo';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Política de Cookies | Mano Fil S.A.",
  description: "Información sobre el uso de cookies y tecnologías de rastreo en nuestro sitio web corporativo.",
  alternates: {
    canonical: '/cookies',
  },
};

export default function CookiesPage() {
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
            <Cookie className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Política de Cookies</h1>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold">Transparencia Tecnológica</p>
        </div>

        <div className="space-y-8 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-xl text-white font-medium mb-4">¿Qué son las Cookies?</h2>
            <p>
              Una cookie es un pequeño archivo de texto que un sitio web almacena en su computadora o dispositivo móvil cuando usted lo visita. Permite que el portal web recuerde sus acciones y preferencias (como inicio de sesión, idioma, tamaño de fuente y otras preferencias de visualización) durante un período de tiempo.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">¿Cómo utilizamos las Cookies en Mano Fil S.A.?</h2>
            <p>En <strong>cobertores.com</strong> utilizamos cookies estrictamente necesarias para el funcionamiento del sitio y la seguridad del sistema. No utilizamos cookies para rastreo publicitario intrusivo (marketing de terceros).</p>
            
            <h3 className="text-lg text-white mt-6 mb-2">1. Cookies Estrictamente Necesarias (Intranet)</h3>
            <p>
              Utilizamos cookies administradas por <strong>Firebase Authentication</strong> para mantener la sesión segura de nuestros empleados y administradores al acceder al "Portal Privado" o Intranet. Sin estas cookies, la zona privada del sitio no funcionaría.
            </p>
            
            <h3 className="text-lg text-white mt-6 mb-2">2. Cookies de Seguridad y Prevención de Spam (Local Storage)</h3>
            <p>
              Para proteger nuestros servidores de ataques maliciosos o correos basura masivos, utilizamos el almacenamiento local de su navegador (`localStorage`) para registrar el momento en el que envía una solicitud de "Cotización Directa". Esto nos permite aplicar una regla de <em>Rate Limiting</em> (límite de velocidad) que impide enviar más de un correo cada 5 minutos.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">Control de Cookies</h2>
            <p>
              Usted puede controlar y/o eliminar las cookies cuando lo desee. Puede borrar todas las cookies que ya están en su computadora y puede configurar la mayoría de los navegadores para evitar que se coloquen. Sin embargo, si hace esto, es posible que tenga que ajustar manualmente algunas preferencias cada vez que visite nuestro sitio y que algunos servicios y funcionalidades (como el inicio de sesión de la Intranet o el envío de cotizaciones) no funcionen correctamente.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
