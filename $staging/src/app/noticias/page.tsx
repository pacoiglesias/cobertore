import React from 'react';
import Link from 'next/link';
import { Newspaper, ChevronRight, Clock } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ManoFilLogo } from '@/components/ManoFilLogo';
import { NewsItem } from '@/lib/types';
import { logger } from '../../lib/logger';

// Configurar Next.js para regenerar esta ruta cada hora (ISR) y potenciar SEO
export const revalidate = 3600;

export const metadata = {
  title: "Noticias y Novedades Textiles | Mano Fil S.A.",
  description: "Entérate de las últimas tendencias, innovaciones y lanzamientos de cobertores industriales en México. Información directa desde nuestra fábrica en Tlaxcala.",
  alternates: {
    canonical: '/noticias',
  },
};

async function getNews(): Promise<NewsItem[]> {
  try {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(50));
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
        {news.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Próximamente</h3>
            <p className="text-slate-500">Estamos preparando nuestros primeros artículos de innovación textil.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item: NewsItem) => (
              <article key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={item.imgUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000'} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {item.sourceName && (
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {item.sourceName}
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-widest mb-4">
                    <Clock className="w-4 h-4" /> 
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Reciente'}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">{item.title}</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3">{item.summary}</p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    {item.originalUrl ? (
                      <a href={item.originalUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-amber-600 hover:text-amber-500 flex items-center gap-1 transition-colors">
                        Leer artículo completo <ChevronRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap line-clamp-2">{item.body}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Público Sencillo */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 flex flex-col items-center justify-center text-center text-slate-500 text-sm gap-2">
        <p>&copy; {new Date().getFullYear()} Mano Fil S.A. - Fabricantes de Cobertores por Mayoreo.</p>
      </footer>
    </div>
  );
}
