import Link from 'next/link';
import { ArrowLeft, Search, Factory } from 'lucide-react';
import { ManoFilLogo } from '@/components/ManoFilLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-amber-600/10 blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[40%] rounded-full bg-slate-600/10 blur-[100px]"></div>
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] z-0"></div>

      {/* Header */}
      <header className="w-full relative z-20 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <ManoFilLogo variant="light" className="h-10 drop-shadow-xl" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-20 px-6 text-center">
        <div className="backdrop-blur-md bg-white/40 dark:bg-black/40 p-10 md:p-16 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-2xl max-w-2xl w-full mx-auto relative">
          
          <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <Search className="w-10 h-10 text-amber-500" />
          </div>

          <h1 className="text-8xl md:text-9xl font-serif text-slate-900 dark:text-white drop-shadow-lg mb-2">404</h1>
          <h2 className="text-2xl md:text-3xl font-serif text-slate-800 dark:text-slate-200 font-bold mb-6">Sección No Encontrada</h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-md mx-auto font-light">
            Parece que te has perdido en nuestro almacén logístico. La página que buscas no existe o ha sido movida temporalmente.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] tracking-widest text-sm uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              Regresar al Inicio
            </Link>
            
            <Link 
              href="/#productos" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-transparent dark:border-white/10 text-slate-900 dark:text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 tracking-widest text-sm uppercase"
            >
              <Factory className="w-4 h-4" />
              Ver Catálogo
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
