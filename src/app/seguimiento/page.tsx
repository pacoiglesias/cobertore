'use client';

import React, { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search, Package, Clock, CheckCircle2, Truck, XCircle, UserX } from 'lucide-react';
import { ManoFilLogo } from '../../components/ManoFilLogo';
import Link from 'next/link';

interface OrderInfo {
  folio: string;
  clientName: string;
  status: 'Cotizado' | 'En Producción' | 'Listo para Carga' | 'Entregado' | 'Cancelado' | 'Abandonado';
  updatedAt: Date;
}

export default function SeguimientoPage() {
  const [folioInput, setFolioInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folioInput.trim()) return;
    
    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      const finalFolio = folioInput.trim().toUpperCase();
      const docRef = doc(db, 'orders', finalFolio);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        setError('No se encontró ningún pedido con este folio. Verifica que esté escrito correctamente.');
      } else {
        const docData = snapshot.data();
        setOrder({
          folio: docData.folio,
          clientName: docData.clientName,
          status: docData.status,
          updatedAt: docData.updatedAt.toDate()
        });
      }
    } catch (err) {
      console.error(err);
      setError('Error al consultar el sistema. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'Cotizado', label: 'Orden Recibida', icon: Package },
    { id: 'En Producción', label: 'En Producción', icon: Clock },
    { id: 'Listo para Carga', label: 'Listo para Carga', icon: Truck },
    { id: 'Entregado', label: 'Entregado', icon: CheckCircle2 }
  ];

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return steps.findIndex(s => s.id === order.status);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header Simplificado */}
      <nav className="fixed w-full z-50 bg-[#070b14]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <ManoFilLogo variant="light" className="h-8" />
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Volver al inicio
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-500 text-xs font-bold tracking-widest uppercase mb-8">
            <Search className="w-4 h-4" />
            Portal de Clientes
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Rastrea el Estatus <br/> de tu Pedido Industrial
          </h1>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
            Ingresa el folio que aparece en la parte superior derecha de tu cotización oficial para conocer el estado actual de tu lote en tiempo real.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex bg-[#0a0f1d] border border-white/10 rounded-2xl p-2 focus-within:border-amber-500/50 transition-colors">
              <input
                type="text"
                placeholder="Ej. COT-12345"
                value={folioInput}
                onChange={(e) => setFolioInput(e.target.value)}
                className="w-full bg-transparent px-4 py-3 text-white focus:outline-none uppercase placeholder:normal-case placeholder:text-slate-500 font-mono"
              />
              <button
                type="submit"
                disabled={loading || !folioInput.trim()}
                className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Buscando...' : 'Consultar'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 text-red-400 bg-red-400/10 border border-red-400/20 py-3 px-4 rounded-xl text-sm inline-block">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {order && (
        <section className="pb-32 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-8 md:p-12 rounded-3xl relative overflow-hidden">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/10 pb-8 gap-6">
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Folio de Rastreo</p>
                <h2 className="text-3xl font-bold font-mono text-white">{order.folio}</h2>
              </div>
              <div className="text-left md:text-right">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Preparado para</p>
                <p className="text-lg text-white font-medium">{order.clientName}</p>
                <p className="text-xs text-slate-400 mt-2">Última actualización: {order.updatedAt.toLocaleString('es-MX')}</p>
              </div>
            </div>

            {/* Stepper Vertical (Mobile) / Horizontal (Desktop) */}
            {order.status === 'Cancelado' || order.status === 'Abandonado' ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-red-500/5 border border-red-500/20 rounded-2xl">
                {order.status === 'Cancelado' 
                  ? <XCircle className="w-16 h-16 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" /> 
                  : <UserX className="w-16 h-16 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                }
                <h3 className="text-2xl font-serif text-white mb-3">
                  {order.status === 'Cancelado' ? 'Pedido Cancelado' : 'Seguimiento Abandonado'}
                </h3>
                <p className="text-slate-400 max-w-md">
                  {order.status === 'Cancelado' 
                    ? 'Este folio ha sido marcado como cancelado. Si consideras que esto es un error o deseas reactivar tu pedido, por favor contacta inmediatamente a tu ejecutivo de ventas.' 
                    : 'Este folio fue cerrado debido a la falta de seguimiento. Si deseas retomar tu cotización, comunícate con nosotros para actualizar los precios y la disponibilidad.'}
                </p>
                <a href="/" className="mt-8 px-6 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
                  Regresar al Inicio
                </a>
              </div>
            ) : (
              <div className="relative">
                {/* Línea conectora */}
                <div className="absolute top-0 bottom-0 left-6 md:left-0 md:right-0 md:top-6 md:bottom-auto w-[2px] md:w-full md:h-[2px] bg-white/10 -z-10" />
                
                <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-0">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const currentIndex = getCurrentStepIndex();
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div key={step.id} className="flex md:flex-col items-center gap-4 md:text-center w-full">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-[#070b14] transition-colors duration-500 ${
                          isCompleted 
                            ? 'bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-grow md:mt-2">
                          <h4 className={`font-bold text-sm uppercase tracking-widest ${isCurrent ? 'text-amber-500' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <p className="text-xs text-slate-400 mt-1">Estatus Actual</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

    </div>
  );
}
