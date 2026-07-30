import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ManoFilLogo } from '../../components/ManoFilLogo';
import { ObfuscatedEmail } from '../../components/ObfuscatedEmail';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Mano Fil S.A.",
  description: "Políticas de privacidad y tratamiento de datos personales de Mano Fil S.A.",
  alternates: {
    canonical: '/privacidad',
  },
};

export default function PrivacidadPage() {
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
            <ShieldCheck className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Aviso de Privacidad</h1>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold">Última actualización: Julio 2026</p>
        </div>

        <div className="space-y-8 text-slate-400 font-light leading-relaxed">
          <section>
            <h2 className="text-xl text-white font-medium mb-4">1. Identidad y domicilio del Responsable</h2>
            <p>
              <strong>Mano Fil S.A. de C.V.</strong> (en adelante "El Responsable"), con domicilio en Calle El Grullo, Santa Ana Chiautempan 90800, Tlaxcala, México, es responsable del tratamiento y protección de sus datos personales, en estricto apego a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de los Estados Unidos Mexicanos y normativas internacionales aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">2. Datos Personales que Recabamos</h2>
            <p>Para las finalidades señaladas en el presente aviso, podemos recabar sus datos personales cuando nos los proporciona directamente a través del formulario de "Cotización Directa":</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Nombre completo o razón social de la empresa.</li>
              <li>Número de teléfono (fijo o móvil) / WhatsApp.</li>
              <li>Correo electrónico institucional o personal.</li>
              <li>Detalles de su proyecto, necesidades comerciales o volumen de productos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">3. Finalidades del Tratamiento de Datos</h2>
            <p>Los datos personales que recabamos tienen las siguientes finalidades primarias y necesarias para el servicio que solicita:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Identificarle como cliente o prospecto B2B.</li>
              <li>Responder a sus solicitudes de cotización sobre nuestros cobertores, tilmas y desarrollos.</li>
              <li>Contactarle para seguimiento de ventas o acuerdos comerciales.</li>
              <li>Prestar los servicios industriales o inmobiliarios que nos solicite.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">4. Seguridad de sus Datos (Infraestructura Tecnológica)</h2>
            <p>
              Sus datos son procesados utilizando sistemas de cifrado de extremo a extremo. Nuestro portal web opera bajo infraestructura tecnológica de alto rendimiento (Google Cloud / Firebase) para garantizar que la información enviada mediante los formularios no sea interceptada ni utilizada con fines de spam.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">5. Ejercicio de los Derechos ARCO</h2>
            <p>
              Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición).
            </p>
            <p className="mt-4">
              Para el ejercicio de cualquiera de los derechos ARCO, usted deberá presentar la solicitud respectiva enviando un correo a <strong><ObfuscatedEmail user="ventas" domain="cobertores.com" className="font-semibold text-white" /></strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white font-medium mb-4">6. Cambios al Aviso de Privacidad</h2>
            <p>
              El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales, de nuestras propias necesidades por los productos o servicios que ofrecemos, de nuestras prácticas de privacidad o por cambios en nuestro modelo de negocio.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
