import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, ShieldCheck, Lock, Settings } from 'lucide-react';
import { ManoFilLogo } from '../../components/ManoFilLogo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Política de Cookies y Tecnologías de Rastreo",
  description: "Información transparente sobre el uso de cookies técnicas, analíticas y de seguridad en el portal corporativo de Mano Fil S.A. de C.V.",
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
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold">
            Transparencia Tecnológica y Protección al Usuario
          </p>
          <p className="text-slate-500 text-xs mt-1">Última actualización: Octubre 2026</p>
        </div>

        <div className="space-y-10 text-slate-300 font-light leading-relaxed">
          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">1</span>
              ¿Qué son las Cookies y Tecnologías Similares?
            </h2>
            <p>
              Una cookie es un pequeño archivo de texto que se descarga en su dispositivo (computadora, tableta o teléfono móvil) al acceder a un sitio web. Permite que el portal recuerde información sobre su visita, como su idioma preferido, estado de sesión y opciones de navegación, facilitando su próxima visita y haciendo que el sitio sea más útil y seguro.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">2</span>
              ¿Qué tipo de Cookies utilizamos en cobertores.com?
            </h2>
            <p className="mb-4">
              En <strong>Mano Fil S.A. de C.V.</strong> adoptamos una política estricta de privacidad: <strong>NO utilizamos cookies de terceros para perfilamiento publicitario invasivo ni vendemos su información de navegación</strong>. Las cookies que utilizamos se dividen en:
            </p>

            <div className="space-y-4">
              <div className="border border-white/5 p-4 rounded-xl bg-white/[0.01]">
                <h3 className="text-white font-medium text-base mb-1">A. Cookies Técnicas y Estrictamente Necesarias</h3>
                <p className="text-slate-400 text-sm">
                  Son esenciales para el funcionamiento básico del portal. Incluyen las cookies de autenticación de <strong>Firebase Authentication</strong> en el &quot;Portal Privado / Intranet&quot; para permitir el acceso cifrado y seguro del personal y transportistas autorizados.
                </p>
              </div>

              <div className="border border-white/5 p-4 rounded-xl bg-white/[0.01]">
                <h3 className="text-white font-medium text-base mb-1">B. Cookies de Rendimiento y Analítica Agregada (Google Analytics 4)</h3>
                <p className="text-slate-400 text-sm">
                  Utilizamos Google Analytics de forma anónima para conocer métricas de rendimiento del sitio (páginas más visitadas, tiempos de carga y procedencia geográfica de visitas mayoristas). Estos datos se procesan de forma agregada sin asociar direcciones IP a la identidad personal del visitante.
                </p>
              </div>

              <div className="border border-white/5 p-4 rounded-xl bg-white/[0.01]">
                <h3 className="text-white font-medium text-base mb-1">C. Almacenamiento Local (Local Storage Anti-Spam)</h3>
                <p className="text-slate-400 text-sm">
                  Para proteger nuestro servidor y los buzones de cotización contra ataques automatizados de denegación de servicio (DoS) o bots de correo masivo, almacenamos una marca de tiempo temporal en el navegador al enviar una solicitud de cotización. Esto impide duplicar envíos en un lapso menor a 5 minutos.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">3</span>
              ¿Cómo puede controlar o desactivar las Cookies?
            </h2>
            <p className="mb-4">
              Usted tiene en todo momento la libertad de permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador web que utilice:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 text-sm">
              <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
              <li><strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad &amp; Seguridad &gt; Cookies y datos del sitio.</li>
              <li><strong>Apple Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear todas las cookies.</li>
              <li><strong>Microsoft Edge:</strong> Configuración &gt; Permisos del sitio &gt; Cookies y datos guardados.</li>
            </ul>
            <p className="text-xs text-slate-500 mt-4">
              Nota: Si decide inhabilitar las cookies técnicas indispensables, algunas funcionalidades del portal (como el acceso a la Intranet o la confirmación ágil de cotizaciones) podrían no operar de forma óptima.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">4</span>
              Relación con el Aviso de Privacidad
            </h2>
            <p className="text-sm">
              El tratamiento de cualquier dato recabado a través de nuestra plataforma se rige conforme a lo dispuesto en nuestro <Link href="/privacidad" className="text-amber-500 underline hover:text-amber-400">Aviso de Privacidad Integral</Link>, elaborado bajo la normativa de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de los Estados Unidos Mexicanos.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
