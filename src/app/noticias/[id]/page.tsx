import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { NewsItem } from '@/lib/types';
import { Metadata, ResolvingMetadata } from 'next';

// 1. generateStaticParams le dice a Next.js qué URLs de noticias pre-renderizar en build time
export async function generateStaticParams() {
  try {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(150));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error generating static params para noticias", error);
    return [];
  }
}

// 2. generateMetadata para SEO (OpenGraph y Title) por cada noticia
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const docRef = doc(db, 'news', id);
  const snap = await getDoc(docRef);
  
  if (!snap.exists()) {
    return { title: 'Noticia no encontrada' };
  }
  
  const news = snap.data() as any;
  const title = `${news.title} | MANO FIL`;
  const description = news.summary || news.body?.substring(0, 160) || '';
  
  return {
    title,
    description,
    alternates: {
      canonical: `/noticias/${id}`,
    },
    openGraph: {
      title,
      description,
      images: news.imgUrl ? [news.imgUrl] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: news.imgUrl ? [news.imgUrl] : [],
    }
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const docRef = doc(db, 'news', id);
  const snap = await getDoc(docRef);
  
  if (!snap.exists()) {
    notFound();
  }
  
  const data = snap.data();
  const news: NewsItem = {
    id: snap.id,
    title: data.title || '',
    summary: data.summary || '',
    body: data.body || '',
    sourceName: data.sourceName || '',
    originalUrl: data.originalUrl || '',
    imgUrl: data.imgUrl || '',
    createdAt: data.createdAt?.toDate().toISOString() || '',
  };

  const formattedDate = news.createdAt 
    ? new Date(news.createdAt as string).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Reciente';

  // Schema.org para Google News / Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    image: news.imgUrl ? [news.imgUrl] : [],
    datePublished: news.createdAt,
    dateModified: news.createdAt,
    author: [{
      '@type': 'Organization',
      name: news.sourceName || 'Mano Fil S.A.',
      url: news.originalUrl || 'https://cobertores.com'
    }],
    publisher: {
      '@type': 'Organization',
      name: 'MANO FIL Cobertores',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cobertores.com/logo-oficial.png'
      }
    },
    description: news.summary,
    articleBody: news.body
  };

  return (
    <div className="bg-slate-50 dark:bg-[#070b14] min-h-screen pt-24 pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/noticias" className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-500 mb-8 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver a Noticias
        </Link>
        
        <article className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200 dark:border-white/10 relative overflow-hidden">
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
            <span className="flex items-center gap-1.5 text-amber-600">
              <Clock className="w-4 h-4" />
              {formattedDate}
            </span>
            {news.sourceName && (
              <>
                <span>•</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {news.sourceName}
                </span>
              </>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white font-bold leading-tight mb-8">
            {news.title}
          </h1>
          
          {news.imgUrl && (
            <div className="w-full h-[400px] md:h-[500px] relative rounded-3xl overflow-hidden mb-12">
              <Image
                src={news.imgUrl}
                alt={news.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          
          <div className="prose prose-lg dark:prose-invert max-w-none prose-amber">
            {news.summary && (
              <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-300 font-medium mb-8">
                {news.summary}
              </p>
            )}
            
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              <ReactMarkdown>{news.body}</ReactMarkdown>
            </div>
          </div>
          
          {news.originalUrl && (
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10">
              <a 
                href={news.originalUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105"
              >
                Leer el artículo original completo
              </a>
            </div>
          )}
          
        </article>

        {/* Sección de Más Noticias (Spider Webbing SEO) */}
        <div className="mt-16 pt-16 border-t border-slate-200 dark:border-white/10">
          <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-8">Más noticias recientes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/noticias" className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 hover:border-amber-500/50 transition-all">
              <p className="text-amber-500 font-bold text-sm mb-2 group-hover:underline">Ver todas las publicaciones →</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Explora nuestra biblioteca completa de noticias y comunicados corporativos.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
