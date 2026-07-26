'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Newspaper, ChevronRight, Clock } from 'lucide-react';
import { db } from '@/lib/firebase';
import { NewsItem } from '@/lib/types';
import { logger } from '@/lib/logger';

function BlurImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ${isLoaded ? 'scale-100 blur-0 opacity-100' : 'scale-110 blur-xl opacity-0'} absolute inset-0`}
      />
    </div>
  );
}

interface NewsGridProps {
  initialNews: NewsItem[];
}

// Se renderiza primero con `initialNews` (la foto fija que Next.js generó
// en build time, buena para SEO/crawleo). Luego, en el navegador, vuelve a
// consultar Firestore directo -- así, si el RSS trajo noticias nuevas
// después del último deploy, el visitante las ve sin que nadie tenga que
// hacer `npm run build && firebase deploy` de nuevo.
export function NewsGrid({ initialNews }: NewsGridProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true); // Asumimos que si inicialNews tiene 12, podría haber más

  useEffect(() => {
    let cancelled = false;

    async function refreshFromFirestore() {
      setRefreshing(true);
      try {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(12));
        const snap = await getDocs(q);
        const fresh: NewsItem[] = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || '',
            summary: data.summary || '',
            body: data.body || '',
            sourceName: data.sourceName || '',
            originalUrl: data.originalUrl || '',
            imgUrl: data.imgUrl || '',
            createdAt: data.createdAt?.toDate().toISOString() || '',
          };
        });
        if (!cancelled && fresh.length > 0) {
          setNews(fresh);
          setLastDoc(snap.docs[snap.docs.length - 1]);
          setHasMore(snap.docs.length === 12);
        }
      } catch (error) {
        logger.error('Error refrescando noticias en vivo:', error);
      } finally {
        if (!cancelled) setRefreshing(false);
      }
    }

    refreshFromFirestore();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoadMore = async () => {
    if (!lastDoc) return;
    setRefreshing(true);
    try {
      const q = query(
        collection(db, 'news'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(12)
      );
      const snap = await getDocs(q);
      const newItems: NewsItem[] = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          summary: data.summary || '',
          body: data.body || '',
          sourceName: data.sourceName || '',
          originalUrl: data.originalUrl || '',
          imgUrl: data.imgUrl || '',
          createdAt: data.createdAt?.toDate().toISOString() || ''
        };
      });

      if (newItems.length > 0) {
        setNews(prev => [...prev, ...newItems]);
        setLastDoc(snap.docs[snap.docs.length - 1]);
      }
      if (snap.docs.length < 12) {
        setHasMore(false);
      }
    } catch (e) {
      logger.error('Error cargando más noticias:', e);
    } finally {
      setRefreshing(false);
    }
  };

  if (news.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Próximamente</h3>
        <p className="text-slate-500">Estamos preparando nuestros primeros artículos de innovación textil.</p>
      </div>
    );
  }



  return (
    <div>
      {refreshing && (
        <p className="text-xs text-slate-400 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Actualizando con las noticias más recientes…
        </p>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item: NewsItem) => (
          <article key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all group flex flex-col">
            <div className="h-64 overflow-hidden relative">
              <BlurImage
                src={item.imgUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000'}
                alt={item.title}
                className="w-full h-full group-hover:scale-105 transition-transform duration-700 absolute inset-0"
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
                {item.createdAt 
                  ? (typeof item.createdAt === 'object' && 'toDate' in (item.createdAt as any) 
                      ? (item.createdAt as any).toDate() 
                      : new Date(item.createdAt as string)).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) 
                  : 'Reciente'}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">{item.title}</h2>
              <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3">{item.summary}</p>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                <a href={`/noticias/${item.id}`} className="text-sm font-bold text-amber-600 hover:text-amber-500 flex items-center gap-1 transition-colors">
                  Leer artículo completo <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-12 text-center">
          <button 
            onClick={handleLoadMore}
            disabled={refreshing}
            className="bg-white border-2 border-slate-200 hover:border-amber-500 text-slate-700 hover:text-amber-600 font-bold py-3 px-8 rounded-full transition-all hover:shadow-lg shadow-sm disabled:opacity-50"
          >
            {refreshing ? 'Cargando...' : 'Cargar Más Noticias'}
          </button>
        </div>
      )}
    </div>
  );
}
