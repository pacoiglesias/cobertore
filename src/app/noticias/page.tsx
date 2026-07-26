import React from 'react';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ManoFilLogo } from '@/components/ManoFilLogo';
import { NewsItem } from '@/lib/types';
import { logger } from '../../lib/logger';
import { NewsGrid } from './NewsGrid';

// NOTA: se quitó `export const revalidate = 3600` -- ISR no existe en
// `output: 'export'` (sitio 100% estático), esa línea no hacía nada. La
// frescura del contenido ahora la da `NewsGrid`, que vuelve a consultar
// Firestore en el navegador después de la carga inicial.

export const metadata = {
  title: "Noticias y Novedades Textiles | Mano Fil S.A.",
  description: "Entérate de las últimas tendencias, innovaciones y lanzamientos de cobertores industriales en México. Información directa desde nuestra fábrica en Tlaxcala.",
  alternates: {
    canonical: '/noticias',
  },
};

async function getNews(): Promise<NewsItem[]> {
  try {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(12));
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        summary: data.summary || '',
        body: data.body || '',
        sourceName: data.sourceName || '',
        originalUrl: data.originalUrl || '',
        imgUrl: data.imgUrl || '',
        // Convertir Timestamp a string para que no falle en Server Components
        createdAt: data.createdAt?.toDate().toISOString() || ''
      };
    });
  } catch (error) {
    logger.error("Error fetching news during SSG build:", error);
    return [];
  }
}

export default async function NoticiasPage() {
  const news = await getNews();

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-amber-500 selection:text-white">
      {/* Header Público Simplificado */}
      <nav className="bg-slate-900 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <ManoFilLogo className="w-10 h-10 group-hover:scale-105 transition-transform" showText={false} variant="light" />
            <div>
              <h1 className="font-serif text-xl text-white">Mano Fil S.A.</h1>
              <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Portal de Noticias</span>
            </div>
          </Link>
          <Link href="/" className="text-white hover:text-amber-500 text-sm font-bold uppercase tracking-widest transition-colors">
            Volver al Inicio
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-slate-900 pt-16 pb-24 border-b border-amber-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-full text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Newspaper className="w-4 h-4" /> Sala de Prensa
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">Novedades y Lanzamientos</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Mantente al día con la innovación en la industria textil. Todo lo que sucede en nuestra fábrica de cobertores.
          </p>
        </div>
      </div>

      {/* Grid de Noticias */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <NewsGrid initialNews={news} />
      </div>
      
      {/* Footer Público Sencillo */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 flex flex-col items-center justify-center text-center text-slate-500 text-sm gap-2">
        <p>&copy; {new Date().getFullYear()} Mano Fil S.A. - Fabricantes de Cobertores por Mayoreo.</p>
      </footer>
    </div>
  );
}
