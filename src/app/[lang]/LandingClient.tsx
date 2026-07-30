'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Factory, MapPin, Phone, Mail, ArrowRight, ShieldCheck, Globe, Hammer, Star, Send, Loader2, Clock, Menu, X } from 'lucide-react';
import { ManoFilLogo } from '../../components/ManoFilLogo';
import { addDoc, collection, Timestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { AuthorityRibbon } from '../../components/landing/AuthorityRibbon';
import { DualNavigation } from '../../components/landing/DualNavigation';
import { Heritage } from '../../components/landing/Heritage';
import { Sustainability } from '../../components/landing/Sustainability';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

import { CatalogProduct, NewsItem } from '../../lib/types';
import { logger } from '../../lib/logger';
import { dictionaries, Lang } from '../../lib/i18n/dictionaries';
import { buildCloudinaryUrl } from '../../lib/cloudinary';


const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    
    const now = audioCtx.currentTime;
    
    oscillator.frequency.setValueAtTime(523.25, now); // C5
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    setTimeout(() => {
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.type = 'sine';
      
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      gain2.gain.setValueAtTime(0, audioCtx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      osc2.start(audioCtx.currentTime);
      osc2.stop(audioCtx.currentTime + 0.5);
    }, 150);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
    setTimeout(() => audioCtx.close(), 1500);
  } catch (e) {
    logger.log("Audio not supported");
  }
};


export default function LandingClient({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];

  // Los productos del catálogo se guardan en Firestore en español. Si el
  // documento incluye traducciones opcionales (title_en / desc_en /
  // measures_en / composition_en), se usan cuando el idioma es inglés;
  // si no existen, se muestra el español como respaldo (mejor que dejar
  // el campo vacío). Así el catálogo puede traducirse producto por
  // producto desde el dashboard, sin romper los que aún no lo estén.
  const traducirProducto = (p: any) => {
    if (lang !== 'en') return p;
    return {
      ...p,
      title: p.title_en || p.title,
      desc: p.desc_en || p.desc,
      measures: p.measures_en || p.measures,
      composition: p.composition_en || p.composition,
    };
  };
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  // Dynamic Catalog State
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);

  // Contact Form States
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', quantity: '', message: '', _honey: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [safeEmail, setSafeEmail] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch Dynamic Catalog
    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      setCatalogProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CatalogProduct[]);
    });

    // Fetch Latest News for SEO
    const newsQuery = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribeNews = onSnapshot(newsQuery, (snapshot) => {
      setLatestNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 3) as unknown as NewsItem[]);
    }, (error) => {
      logger.error("Error fetching news for SEO:", error);
    });

    // Anti-spam email assembly
    setSafeEmail(['ventas', '@', 'cobertores.com'].join(''));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeProducts();
      unsubscribeNews();
    };
  }, []);



  useEffect(() => {
    if (submitSuccess) {
      playSuccessSound();
    }
  }, [submitSuccess]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ANTI-SPAM 1: Honeypot (Si un bot llena este campo invisible, lo bloqueamos sin decirle)
    if (formData._honey !== '') {
      setSubmitSuccess(true); // Fake success for bots
      toast.success("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la brevedad.");
      return;
    }

    // ANTI-SPAM 2: Rate Limiting (Máximo 1 cotización cada 5 minutos por navegador)
    const lastSubmit = localStorage.getItem('last_lead_submit');
    const now = Date.now();
    if (lastSubmit) {
      const timeSinceLastLead = now - parseInt(lastSubmit);
      if (timeSinceLastLead < 300000) { // 5 minutes block
        toast.error("Hemos recibido tu mensaje anterior. Por favor espera 5 minutos para enviar otra cotización.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const { _honey, ...cleanData } = formData;
      await addDoc(collection(db, 'leads'), {
        ...cleanData,
        createdAt: Timestamp.now()
      });

      // ENVIAR NOTIFICACIÓN POR CORREO (EmailJS)
      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!, 
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!, 
          {
            name: cleanData.name,
            phone: cleanData.phone,
            email: cleanData.email,
            quantity: cleanData.quantity,
            message: cleanData.message,
          }, 
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        );
      } catch (emailError) {
        logger.error("Error enviando notificación de correo (EmailJS):", emailError);
      }

      localStorage.setItem('last_lead_submit', now.toString());
      setFormData({ name: '', phone: '', email: '', quantity: '', message: '', _honey: '' });
      toast.success("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la brevedad.");
    } catch (error) {
      logger.error("Error submitting form: ", error);
      toast.error("Hubo un error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const showWipToast = (e: React.MouseEvent) => {
    e.preventDefault();
    toast("Esta sección estará disponible pronto.", { icon: "🛠️" });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#070b14] font-sans text-slate-700 dark:text-slate-300 selection:bg-amber-500 selection:text-white overflow-x-hidden relative">
      
      {/* Luces cinematográficas de fondo global */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]"></div>
      </div>


      {/* HEADER NAVBAR - Glassmorphism extremo */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 py-3 shadow-xl dark:shadow-2xl' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ManoFilLogo variant="light" className="h-10 md:h-12 drop-shadow-2xl" />
            </motion.div>
          </div>
          
          <div className="hidden lg:flex gap-10 text-xs font-bold tracking-widest uppercase text-slate-400">
            <a href="#hero" className="hover:text-amber-500 transition-colors">{t.nav.home}</a>
            <a href="#productos" className="hover:text-amber-500 transition-colors">{t.nav.catalog}</a>
            <a href="#divisiones" className="hover:text-amber-500 transition-colors">{t.nav.divisions}</a>
            <a href="#herencia" className="hover:text-amber-500 transition-colors">{t.nav.legacy}</a>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <Link
              href={`/${lang === 'es' ? 'en' : 'es'}`}
              className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-amber-500 text-xs font-bold uppercase tracking-wider transition-colors mr-2"
              aria-label={lang === 'es' ? 'Cambiar idioma a Inglés' : 'Change language to Spanish'}
            >
              <Globe className="w-4 h-4" /> {lang === 'es' ? 'EN' : 'ES'}
            </Link>
            <Link href="/intranet" className="hidden md:block bg-white/5 hover:bg-amber-600 border border-slate-200 dark:border-white/10 hover:border-amber-500 text-slate-900 dark:text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              {t.nav.portal}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="lg:hidden text-white p-2 -mr-2"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil: el bloque de arriba (hidden lg:flex) solo se ve en pantallas grandes.
            Este panel cubre el mismo menú para celular/tablet, donde antes no había forma
            de navegar por secciones salvo hacer scroll manual. */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden overflow-hidden bg-slate-900/98 backdrop-blur-xl border-t border-white/10"
            >
              <div className="flex flex-col px-6 py-6 gap-1 text-sm font-bold tracking-widest uppercase text-slate-300">
                <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5 hover:text-amber-500 transition-colors">{t.nav.home}</a>
                <a href="#productos" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5 hover:text-amber-500 transition-colors">{t.nav.catalog}</a>
                <a href="#divisiones" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5 hover:text-amber-500 transition-colors">{t.nav.divisions}</a>
                <a href="#herencia" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5 hover:text-amber-500 transition-colors">{t.nav.legacy}</a>
                <Link href="/intranet" onClick={() => setIsMobileMenuOpen(false)} className="py-3 mt-2 text-center bg-amber-600 text-white rounded-full">{t.nav.portal}</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section Épico */}
      <section id="hero" className="relative h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden z-10">
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>
        
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#070b14] via-transparent to-slate-50 dark:to-[#070b14] z-10"></div>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            poster="/video-poster.webp"
            className="w-full h-full object-cover mix-blend-luminosity opacity-50"
          >
             {/* Placeholder industrial sewing/textile video. Replace with own corporate video when available */}
             <source src="https://cdn.coverr.co/videos/coverr-a-man-operating-a-sewing-machine-2810/1080p.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Central Content */}
        <div className="relative z-20 text-center px-4 md:px-6 max-w-6xl mx-auto mt-20 md:mt-0">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center backdrop-blur-md bg-white/30 dark:bg-black/30 p-8 md:p-16 rounded-[3rem] border border-white/40 dark:border-white/10 shadow-2xl">
            
            <motion.div variants={fadeUp} className="mb-8 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 py-2 px-6 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <Star className="w-4 h-4" /> {t.hero.since} <Star className="w-4 h-4" />
              </div>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-white mb-6 leading-[1.05] tracking-tight drop-shadow-2xl">
              {t.hero.title1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 italic pr-4">{t.hero.title2}</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-2xl text-slate-300 font-light max-w-3xl mx-auto mb-12 drop-shadow-lg leading-relaxed">
              {t.hero.desc}
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
              <a href="#productos" className="relative group bg-amber-600 text-white px-8 md:px-12 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {t.hero.btnCatalog} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a href="#herencia" className="bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-amber-500/50 px-8 md:px-12 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all backdrop-blur-md flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                {t.hero.btnMore}
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 15, 0], opacity: [0.3, 1, 0.3] }} 
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-amber-500/50 uppercase tracking-[0.3em] font-bold">Scroll</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-amber-500 to-transparent mx-auto"></div>
        </motion.div>
      </section>

      <AuthorityRibbon lang={lang} />

      {/* Pilares */}
      <section className="py-20 md:py-32 relative bg-[#0a0f1d] border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 drop-shadow-xl">{t.pillars?.title || 'Pilares de Nuestra Operación'}</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.8 }} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 md:p-10 hover:bg-white/[0.05] hover:border-amber-500/30 transition-all duration-300">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                <ShieldCheck className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-serif text-white mb-4">{t.pillars?.c1_title || 'Respuesta a Contingencias'}</h3>
              <p className="text-slate-400 font-light leading-relaxed">{t.pillars?.c1_desc || 'Nuestros productos son vitales durante emergencias (heladas, inundaciones, sismos). Garantizamos un servicio oportuno cuando más se necesita.'}</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 md:p-10 hover:bg-white/[0.05] hover:border-amber-500/30 transition-all duration-300">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <Factory className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-serif text-white mb-4">{t.pillars?.c2_title || 'Suministro de Alto Volumen'}</h3>
              <p className="text-slate-400 font-light leading-relaxed">{t.pillars?.c2_desc || 'Respaldados por alianzas estratégicas de alto nivel, contamos con la capacidad para surtir cantidades masivas en tiempos de entrega extraordinariamente cortos.'}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 md:p-10 hover:bg-white/[0.05] hover:border-amber-500/30 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                <Globe className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-serif text-white mb-4">{t.pillars?.c3_title || 'Compromiso Logístico'}</h3>
              <p className="text-slate-400 font-light leading-relaxed">{t.pillars?.c3_desc || 'Nuestra prioridad es la eficiencia comercial: cumplir con la entrega exacta y brindar un servicio y atención insuperable.'}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sección de Certificaciones / Autoridad (B2B Trust) */}
      <section className="py-16 md:py-24 relative bg-slate-50 dark:bg-[#070b14] border-t border-slate-200 dark:border-white/5 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h4 className="text-amber-500 tracking-[0.3em] uppercase text-xs font-bold mb-4">{lang === 'es' ? 'Nuestras Credenciales' : 'Our Credentials'}</h4>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white mb-6">
              {lang === 'es' ? 'Certificaciones de Industria' : 'Industry Certifications'}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white dark:bg-[#0a0f1d] border-2 border-slate-200 dark:border-white/10 flex items-center justify-center mb-4 shadow-xl group-hover:border-amber-500 transition-colors">
                <ShieldCheck className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-2">{lang === 'es' ? 'Calidad B2B' : 'B2B Quality'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'es' ? 'Estándares industriales de alta resistencia' : 'High resistance industrial standards'}</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white dark:bg-[#0a0f1d] border-2 border-slate-200 dark:border-white/10 flex items-center justify-center mb-4 shadow-xl group-hover:border-amber-500 transition-colors">
                <Globe className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-2">{lang === 'es' ? 'Red Nacional' : 'National Network'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'es' ? 'Capacidad logística a todo el país' : 'Nationwide logistics capacity'}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white dark:bg-[#0a0f1d] border-2 border-slate-200 dark:border-white/10 flex items-center justify-center mb-4 shadow-xl group-hover:border-amber-500 transition-colors">
                <Factory className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-2">{lang === 'es' ? 'Fabricante Directo' : 'Direct Manufacturer'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'es' ? 'Precios de fábrica sin intermediarios' : 'Factory prices without middlemen'}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white dark:bg-[#0a0f1d] border-2 border-slate-200 dark:border-white/10 flex items-center justify-center mb-4 shadow-xl group-hover:border-amber-500 transition-colors">
                <Star className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-2">{lang === 'es' ? '+60 Años' : '+60 Years'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'es' ? 'De experiencia textil ininterrumpida' : 'Of uninterrupted textile experience'}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catálogo de Productos Premium */}
      <section id="productos" className="py-24 md:py-32 relative z-10 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#070b14]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent dark:via-[#070b14] to-transparent dark:to-[#070b14] z-0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16 md:mb-24">
            <h4 className="text-amber-500 tracking-[0.3em] uppercase text-xs font-bold mb-4 flex items-center justify-center gap-4">
              <span className="w-12 h-[1px] bg-amber-500/50"></span>
              {t.products.tag}
              <span className="w-12 h-[1px] bg-amber-500/50"></span>
            </h4>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 drop-shadow-xl">{t.products.title}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
              {t.products.desc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 md:gap-8">
            {(catalogProducts.length > 0 ? (catalogProducts as any[]).map(traducirProducto) : t.products.items).map((item, index: number) => (
              <motion.div 
                key={item.id || index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.7, ease: "easeOut" }}
                className={`bg-white/[0.02] backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/5 hover:border-amber-500/50 group transition-all duration-500 flex flex-col hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] hover:-translate-y-2 relative md:col-span-3 lg:col-span-6`}
              >
                {/* Glow Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-amber-500/5 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>

                <div className="h-72 overflow-hidden relative p-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-[#070b14] to-transparent z-10 opacity-60"></div>
                  <Image src={buildCloudinaryUrl(item.imgUrl || item.img)} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transform group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md text-amber-500 text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full border border-amber-500/30 z-20 shadow-lg">
                    {item.weight}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow relative z-20 -mt-10">
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-4 drop-shadow-md">{item.title}</h3>
                  <p className="text-slate-400 text-sm font-light mb-8 flex-grow leading-relaxed">{item.desc}</p>
                  
                  <div className="space-y-4 mb-8 bg-black/20 p-5 rounded-2xl border border-white/5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span className="uppercase tracking-widest">{t.products.measures}</span>
                      <span className="font-bold text-white">{item.measures || '2m x 1.50m aprox.'}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span className="uppercase tracking-widest">{t.products.composition}</span>
                      <span className="font-bold text-white">{item.composition || '100% Regenerado'}</span>
                    </div>
                  </div>
                  
                  <button onClick={() => {
                    const el = document.getElementById('contacto');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }} className="w-full bg-amber-600/10 border border-amber-500/30 text-amber-500 hover:bg-amber-600 hover:text-white py-4 rounded-xl text-xs font-bold transition-all uppercase tracking-widest group/btn hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    {t.products.quote}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            className="mt-12 text-center md:text-left text-slate-500 text-xs md:text-sm font-light space-y-2 border-t border-white/5 pt-8 max-w-4xl mx-auto md:mx-0"
          >
            <p>{t.products.disclaimer1}</p>
            <p>{t.products.disclaimer2}</p>
          </motion.div>
        </div>
      </section>

      <DualNavigation lang={lang} />
      <Heritage lang={lang} />
      <Sustainability lang={lang} />

      {/* Sección de Noticias (SEO) */}
      {latestNews.length > 0 && (
        <section className="py-24 md:py-32 relative bg-slate-50 dark:bg-[#070b14] border-t border-slate-200 dark:border-white/5 z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <h4 className="text-amber-500 tracking-[0.3em] uppercase text-xs font-bold mb-4">{t.news.tag}</h4>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">{t.news.title}</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {latestNews.map((news) => (
                <Link href="/noticias" key={news.id} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all group flex flex-col hover:-translate-y-2">
                  <div className="h-48 overflow-hidden relative">
                    <Image src={buildCloudinaryUrl(news.imgUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000')} alt={news.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {news.createdAt ? (typeof news.createdAt === 'object' && 'toDate' in (news.createdAt as any) ? (news.createdAt as any).toDate() : new Date(news.createdAt as string)).toLocaleDateString('es-MX') : ''}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3 leading-tight">{news.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3">{news.summary}</p>
                    <span className="text-amber-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-amber-400">
                      {t.news.read} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/noticias" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
                {t.news.all}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section (SEO) */}
      <section className="py-20 md:py-24 relative bg-slate-50 dark:bg-[#070b14] border-t border-slate-200 dark:border-white/5 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <h4 className="text-amber-500 tracking-[0.3em] uppercase text-xs font-bold mb-4">{t.faq.tag}</h4>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">{t.faq.title}</h2>
          </div>
          <div className="space-y-4">
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-amber-500/30 transition-colors">
              <summary className="flex justify-between items-center font-bold text-lg text-white list-none">
                {t.faq.q1}
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-slate-400 mt-4 leading-relaxed font-light">En Mano Fil S.A. somos la fábrica principal en Tlaxcala especializada en la venta por mayoreo de cobertores, cobijas y tilmas. Hacemos envíos corporativos a todo México con capacidad de respuesta inmediata y precios de fábrica directo.</p>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-amber-500/30 transition-colors">
              <summary className="flex justify-between items-center font-bold text-lg text-white list-none">
                {t.faq.q2}
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-slate-400 mt-4 leading-relaxed font-light">Las tilmas económicas son cobertores rústicos y altamente duraderos, elaborados generalmente de material 100% regenerado. Se usan masivamente en mudanzas, donaciones, emergencias y uso industrial debido a su alta resistencia y bajo costo.</p>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-amber-500/30 transition-colors">
              <summary className="flex justify-between items-center font-bold text-lg text-white list-none">
                {t.faq.q3}
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-slate-400 mt-4 leading-relaxed font-light">Sí, nuestra división textil fabrica mantas y cobertores gruesos con retención térmica superior, ideales para programas sociales, hospitales y distribución mayorista durante contingencias de frío extremo.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Formulario de Cotización */}
      <section id="contacto" className="py-24 md:py-32 relative bg-[#0a0f1d] border-t border-white/5 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">{t.contact.title}</h2>
            <p className="text-slate-400 font-light">{t.contact.desc}</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"></div>
            
            {submitSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-center py-12"
              >
                <motion.div 
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <ShieldCheck className="w-10 h-10" />
                </motion.div>
                <h3 className="text-2xl font-serif text-white mb-2">¡Solicitud Enviada!</h3>
                <p className="text-slate-400">Nuestro equipo corporativo se pondrá en contacto contigo a la brevedad.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* HONEYPOT (Anti-Spam) */}
                <input aria-hidden="true" type="text" style={{display: 'none'}} value={formData._honey} onChange={e=>setFormData({...formData, _honey: e.target.value})} tabIndex={-1} autoComplete="off" />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="lead-name" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">{t.contact.name}</label>
                    <input id="lead-name" type="text" required minLength={2} maxLength={100} value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white focus:border-amber-500 outline-none transition-colors" placeholder={t.contact.namePh} />
                  </div>
                  <div>
                    <label htmlFor="lead-phone" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">{t.contact.phone}</label>
                    <input id="lead-phone" type="tel" required minLength={10} maxLength={20} pattern="[\d\s\-\+]+" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white focus:border-amber-500 outline-none transition-colors" placeholder="+52 123 456 7890" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="lead-email" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">{t.contact.email}</label>
                    <input id="lead-email" type="email" required maxLength={100} value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white focus:border-amber-500 outline-none transition-colors" placeholder={t.contact.emailPh} />
                  </div>
                  <div>
                    <label htmlFor="lead-quantity" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">{t.contact.qty}</label>
                    <input id="lead-quantity" type="text" required minLength={1} maxLength={50} value={formData.quantity} onChange={e=>setFormData({...formData, quantity: e.target.value})} className="w-full bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white focus:border-amber-500 outline-none transition-colors" placeholder={t.contact.qtyPh} />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="lead-message" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">{t.contact.msg}</label>
                  <textarea id="lead-message" required minLength={10} maxLength={1000} value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} rows={4} className="w-full bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white focus:border-amber-500 outline-none transition-colors resize-none" placeholder={t.contact.msgPh}></textarea>
                </div>
                
                <button type="submit" disabled={submitting} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {submitting ? <><Loader2 className="w-5 h-5 animate-spin"/> {t.contact.sending}</> : <><Send className="w-5 h-5"/> {t.contact.send}</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer id="footer" className="bg-[#03050a] text-slate-400 py-16 md:py-24 border-t border-white/5 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 relative z-10">
          
          <div className="lg:col-span-1">
            <div className="mb-6 md:mb-8 opacity-80">
              <ManoFilLogo variant="light" className="h-12" />
            </div>
            <p className="text-sm mb-8 font-light leading-relaxed" dangerouslySetInnerHTML={{__html: t.footer.desc}} />
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 md:mb-8 text-xs">{t.footer.locations}</h4>
            <ul className="space-y-6 text-sm font-light">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                <span className="leading-relaxed" dangerouslySetInnerHTML={{__html: t.footer.tlaxcala}} />
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                <span className="leading-relaxed" dangerouslySetInnerHTML={{__html: t.footer.cdmx}} />
              </li>
              <li className="flex items-center gap-4 pt-2 md:pt-4">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span>+52 246 464 2891</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 md:mb-8 text-xs">{t.footer.divs}</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><button onClick={showWipToast} className="hover:text-amber-500 transition-colors text-left">{t.footer.d1}</button></li>
              <li><button onClick={showWipToast} className="hover:text-amber-500 transition-colors text-left">{t.footer.d2}</button></li>
              <li><button onClick={showWipToast} className="hover:text-amber-500 transition-colors text-left">{t.footer.d3}</button></li>
              <li className="flex items-center gap-4 mt-6 pt-6 md:mt-8 md:pt-8 border-t border-white/5">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-white font-medium break-all">{safeEmail || 'v•••••@••••••••••.com'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 md:mb-8 text-xs">{t.footer.intra}</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link href="/intranet" className="hover:text-amber-500 transition-colors text-left">{t.footer.i1}</Link></li>
              <li><Link href="/noticias" className="hover:text-amber-500 transition-colors text-left">{t.news.portal}</Link></li>
              <li><Link href="/privacidad" className="hover:text-amber-500 transition-colors text-left">{t.footer.i2}</Link></li>
              <li><Link href="/terminos" className="hover:text-amber-500 transition-colors text-left">{t.footer.i3}</Link></li>
              <li><Link href="/cookies" className="hover:text-amber-500 transition-colors text-left">{t.footer.i4}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-16 md:mt-24 pt-8 border-t border-white/5 flex items-center justify-center text-center text-[10px] md:text-xs font-bold tracking-widest uppercase text-slate-600 relative z-10">
          <p>&copy; {new Date().getFullYear()} Mano Fil S.A. {t.footer.rights}</p>
        </div>
      </footer>

      {/* JSON-LD Schema para Catálogo de Productos */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": (catalogProducts.length > 0 ? (catalogProducts as any[]).map(traducirProducto) : t.products.items).map((item: { title: string; desc: string; imgUrl?: string; img?: string }, idx: number) => ({
              "@type": "Product",
              "@id": `https://cobertores.com/#product-${idx}`,
              "name": item.title,
              "image": `https://cobertores.com${item.imgUrl || item.img}`,
              "description": item.desc,
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": "24"
              },
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "MXN",
                "lowPrice": "0",
                "highPrice": "0",
                "offerCount": "1",
                "availability": "https://schema.org/InStock"
              }
            }))
          })
        }}
      />

      {/* JSON-LD Schema para FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": t.faq.q1,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "En Mano Fil S.A. somos la fábrica principal en Tlaxcala especializada en la venta por mayoreo de cobertores, cobijas y tilmas. Hacemos envíos corporativos a todo México con capacidad de respuesta inmediata y precios de fábrica directo."
                }
              },
              {
                "@type": "Question",
                "name": t.faq.q2,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Las tilmas económicas son cobertores rústicos y altamente duraderos, elaborados generalmente de material 100% regenerado. Se usan masivamente en mudanzas, donaciones, emergencias y uso industrial debido a su alta resistencia y bajo costo."
                }
              },
              {
                "@type": "Question",
                "name": t.faq.q3,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí, nuestra división textil fabrica mantas y cobertores gruesos con retención térmica superior, ideales para programas sociales, hospitales y distribución mayorista durante contingencias de frío extremo."
                }
              }
            ]
          })
        }}
      />

      {/* JSON-LD Schema para Video */}
      {/* NOTA 2026-07-26: aquí había un JSON-LD de tipo VideoObject que le
          declaraba a Google que este video mostraba "nuestras instalaciones
          y la producción en masa de cobertores en Tlaxcala". El video es en
          realidad material de archivo de coverr.co, no la planta real --
          declarar eso en datos estructurados es marcado engañoso y Google
          lo penaliza. Se eliminó el marcado; el video se conserva solo como
          fondo decorativo. Cuando exista video real de la planta, se puede
          restaurar este bloque apuntando al archivo propio.
      */}
    </main>
  );
}
