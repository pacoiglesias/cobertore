import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, Lock, Mail, MapPin } from 'lucide-react';
import { ManoFilLogo } from '../../components/ManoFilLogo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Aviso de Privacidad Integral",
  description: "Aviso de Privacidad Integral de Mano Fil S.A. de C.V. conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México.",
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
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Aviso de Privacidad Integral</h1>
          <p className="text-amber-500 tracking-widest uppercase text-xs font-bold">
            Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)
          </p>
          <p className="text-slate-500 text-xs mt-1">Última actualización y revisión legal: Octubre 2026</p>
        </div>

        <div className="space-y-10 text-slate-300 font-light leading-relaxed">
          {/* 1. Responsable */}
          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">1</span>
              Identidad y Domicilio del Responsable
            </h2>
            <p>
              <strong>Mano Fil S.A. de C.V.</strong> (en adelante, &quot;El Responsable&quot; o &quot;Mano Fil&quot;), con domicilio fiscal y operativo en <strong className="text-white">Calle El Grullo, Santa Ana Chiautempan, C.P. 90800, Tlaxcala, México</strong>, y portal web oficial <strong className="text-amber-500">https://cobertores.com</strong>, es el responsable del uso, tratamiento y protección de sus datos personales, en estricto apego a la <em>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</em>, su Reglamento y los <em>Lineamientos del Aviso de Privacidad</em> emitidos por el órgano garante nacional en México (INAI).
            </p>
          </section>

          {/* 2. Datos Recabados */}
          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">2</span>
              Datos Personales que Recabamos
            </h2>
            <p>
              Para llevar a cabo las finalidades descritas en el presente aviso, recabamos las siguientes categorías de datos personales mediante nuestros formularios en línea, comunicación directa por WhatsApp, vía telefónica o correo electrónico:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-400">
              <li><strong className="text-slate-200">Datos de identificación y contacto:</strong> Nombre completo del contacto o representante legal, razón social de la empresa, teléfono fijo, número móvil o WhatsApp, y correo electrónico corporativo o personal.</li>
              <li><strong className="text-slate-200">Datos de entrega y logística:</strong> Domicilio de entrega (calle, número, colonia, código postal, municipio/alcaldía, estado), persona facultada para recepción de carga y referencias de descarga.</li>
              <li><strong className="text-slate-200">Datos fiscales y de facturación (en caso de compra concretada):</strong> Registro Federal de Contribuyentes (RFC), régimen fiscal, domicilio fiscal y constancia de situación fiscal vigente emitida por el SAT.</li>
            </ul>
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">
              Importante: Mano Fil S.A. de C.V. NO recaba ni solicita bajo ninguna circunstancia datos personales sensibles (tales como origen racial o étnico, estado de salud presente o futuro, información genética, creencias religiosas, filosóficas o morales, afiliación sindical, opiniones políticas o preferencia sexual).
            </div>
          </section>

          {/* 3. Finalidades */}
          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">3</span>
              Finalidades del Tratamiento de los Datos
            </h2>
            <p className="font-medium text-white mb-2">A. Finalidades Primarias (necesarias para la relación jurídica y comercial):</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-6">
              <li>Elaborar, presupuestar y dar seguimiento a cotizaciones comerciales mayoristas de cobertores, tilmas y mantas térmicas.</li>
              <li>Validar la viabilidad logística, tiempos de producción y cubicaje de pedidos a escala corporativa o licitaciones.</li>
              <li>Procesar pedidos, gestionar la confección textil, emitir órdenes de carga y coordinar el flete o despacho con fleteras y paqueterías.</li>
              <li>Emisión de Comprobantes Fiscales Digitales por Internet (CFDI 4.0) y gestión de cobranza conforme a las disposiciones del SAT.</li>
              <li>Atención a solicitudes de muestras físicas y bonificación de importe en pedidos cerrados.</li>
            </ul>

            <p className="font-medium text-white mb-2">B. Finalidades Secundarias (no indispensables para la relación jurídica):</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li>Envío de actualizaciones de catálogo de temporada, fichas técnicas de nuevos productos textiles o noticias de la industria.</li>
              <li>Evaluación de la calidad del servicio logístico y atención al cliente.</li>
            </ul>
            <p className="text-xs text-slate-400">
              En caso de que no desee que sus datos personales sean tratados para estas finalidades secundarias, usted puede manifestar su negativa enviando un correo a <strong className="text-white">ventas@cobertores.com</strong> con el asunto &quot;Negativa Finalidades Secundarias&quot;. La negativa para el uso de sus datos para finalidades secundarias no será motivo para negarle la venta o prestación de los servicios solicitados.
            </p>
          </section>

          {/* 4. Transferencias */}
          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">4</span>
              Transferencia de Datos Personales
            </h2>
            <p>
              Mano Fil S.A. de C.V. no comercializa, no alquila ni cede sus datos personales a terceros con fines de publicidad o marketing ajeno. Sus datos únicamente podrán ser transferidos, sin requerir de su consentimiento en términos del artículo 37 de la LFPDPPP, en los siguientes supuestos:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-400">
              <li><strong className="text-slate-200">Empresas de autotransporte, carga consolidada y paquetería express:</strong> Exclusivamente para efecto de entregar físicamente la mercancía o muestras en el destino convenido.</li>
              <li><strong className="text-slate-200">Instituciones financieras y bancarias:</strong> Para la tramitación de cobros y conciliación de transferencias interbancarias (SPEI).</li>
              <li><strong className="text-slate-200">Autoridades fiscales y judiciales mexicanas:</strong> Para el debido cumplimiento de obligaciones legales, fiscales y requerimientos oficiales fundados y motivados.</li>
            </ul>
          </section>

          {/* 5. Derechos ARCO */}
          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">5</span>
              Ejercicio de Derechos ARCO y Revocación del Consentimiento
            </h2>
            <p>
              Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (<strong>Acceso</strong>). Asimismo, es su derecho solicitar la corrección de su información en caso de que esté desactualizada, sea inexacta o incompleta (<strong>Rectificación</strong>); que la eliminemos de nuestros registros cuando considere que no está siendo utilizada conforme a los principios de ley (<strong>Cancelación</strong>); así como oponerse al uso de sus datos para fines específicos (<strong>Oposición</strong>).
            </p>
            
            <h3 className="text-lg text-white font-medium mt-6 mb-3">Procedimiento y Plazos de Atención (Art. 32 LFPDPPP)</h3>
            <p className="text-slate-400 text-sm mb-4">
              Para ejercer cualquiera de los derechos ARCO o revocar su consentimiento, deberá enviar una solicitud por escrito al correo electrónico <strong className="text-amber-500">ventas@cobertores.com</strong> o mediante escrito libre dirigido a nuestro Departamento de Privacidad en nuestro domicilio en Santa Ana Chiautempan, Tlaxcala.
            </p>
            <p className="text-slate-400 text-sm mb-2">Su solicitud deberá contener:</p>
            <ol className="list-decimal pl-6 text-sm text-slate-400 space-y-1 mb-4">
              <li>Nombre del titular y correo electrónico o domicilio para comunicarle la respuesta.</li>
              <li>Copia de identificación oficial vigente (INE, pasaporte o poder notarial que acredite representación).</li>
              <li>Descripción clara y precisa de los datos personales respecto de los que se busca ejercer algún derecho ARCO.</li>
              <li>Cualquier otro elemento o documento que facilite la localización de los datos.</li>
            </ol>
            <p className="text-slate-400 text-sm">
              <strong className="text-white">Plazo legal:</strong> El Responsable le comunicará la determinación adoptada en un plazo máximo de <strong className="text-white">20 (veinte) días hábiles</strong> contados desde la fecha de recepción de la solicitud. Si resulta procedente, se hará efectiva dentro de los <strong className="text-white">15 (quince) días hábiles</strong> siguientes a la fecha en que se comunique la respuesta.
            </p>
          </section>

          {/* 6. Cookies */}
          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">6</span>
              Uso de Cookies y Tecnologías de Rastreo
            </h2>
            <p>
              Le informamos que en nuestro sitio web <strong className="text-white">cobertores.com</strong> utilizamos cookies técnicas y herramientas de almacenamiento local para garantizar la funcionalidad del portal, la seguridad de las sesiones de Intranet y la protección anti-spam en el envío de formularios. Para conocer a detalle los tipos de cookies y los mecanismos para deshabilitarlas desde su navegador, consulte nuestra <Link href="/cookies" className="text-amber-500 underline hover:text-amber-400">Política de Cookies</Link>.
            </p>
          </section>

          {/* 7. Cambios al aviso */}
          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">7</span>
              Modificaciones al Presente Aviso de Privacidad
            </h2>
            <p>
              El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de reformas legislativas, criterios jurisprudenciales, políticas internas o requerimientos para la oferta de nuestros productos textiles. Cualquier modificación será publicada oportunamente en nuestro portal oficial <strong className="text-amber-500">https://cobertores.com/privacidad</strong>.
            </p>
          </section>

          {/* 8. Autoridad Garante */}
          <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center border border-amber-500/20">8</span>
              Autoridad Garante
            </h2>
            <p className="text-slate-400 text-sm">
              Si usted considera que su derecho a la protección de sus datos personales ha sido lesionado por alguna conducta u omisión de nuestra parte, o presume alguna violación a las disposiciones previstas en la LFPDPPP, su Reglamento y demás ordenamientos aplicables, podrá interponer su inconformidad o denuncia ante el <strong className="text-white">Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)</strong>. Para mayor información, puede consultar el portal oficial en <a href="https://home.inai.org.mx" target="_blank" rel="noopener noreferrer" className="text-amber-500 underline hover:text-amber-400">home.inai.org.mx</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
