import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seguimiento de Órdenes y Logística | Mano Fil S.A.',
  description: 'Rastrea el estatus de tu cotización u orden de compra corporativa en tiempo real en nuestra plataforma logística B2B.',
  alternates: {
    canonical: '/seguimiento',
  },
};

export default function SeguimientoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
