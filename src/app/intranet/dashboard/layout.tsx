import React from 'react';
import { AuthProvider } from '../../../components/providers/AuthProvider';

export const metadata = {
  title: 'Portal Intranet - Mano Fil S.A.',
  robots: { index: false, follow: false }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
