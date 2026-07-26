'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Loader2, ShieldAlert } from 'lucide-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Redirige al login de la intranet si no está autenticado
        router.push('/intranet');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Zero-Flicker: Si está cargando o no hay usuario, mostramos un loader de seguridad
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 mb-6 animate-pulse">
          <ShieldAlert className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-serif text-white mb-2">Verificando Credenciales</h2>
        <p className="text-slate-400 text-sm mb-6">Estableciendo conexión cifrada con el servidor...</p>
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  // Si está autenticado, renderiza el dashboard
  return <>{children}</>;
}
