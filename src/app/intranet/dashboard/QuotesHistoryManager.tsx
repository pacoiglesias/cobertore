'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { FileText, Download, ExternalLink, Loader2, Calendar, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { logger } from '../../../lib/logger';
import { toast } from 'react-hot-toast';

interface QuoteHistoryItem {
  id: string; // folio
  folio: string;
  clientName: string;
  sellerName: string;
  sellerEmail: string;
  total: number;
  subtotal: number;
  pdfUrl: string;
  itemsCount: number;
  createdAt: Timestamp;
}

export function QuotesHistoryManager() {
  const [quotes, setQuotes] = useState<QuoteHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(20);
  const [quoteToDelete, setQuoteToDelete] = useState<QuoteHistoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'quotes_history'),
      orderBy('createdAt', 'desc'),
      limit(displayLimit)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: QuoteHistoryItem[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as QuoteHistoryItem);
      });
      setQuotes(data);
      setLoading(false);
    }, (error) => {
      logger.error('Error fetching quotes history', error);
      toast.error('Error al cargar historial');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [displayLimit]);

  const loadMore = () => setDisplayLimit(prev => prev + 20);

  // No existia ninguna forma de borrar una cotizacion del historial --
  // solo se podia ver/descargar el PDF. Reglas de Firestore ya permitian
  // el borrado (isSuperAdmin || editor), solo faltaba el boton.
  const handleDeleteQuote = async () => {
    if (!quoteToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'quotes_history', quoteToDelete.id));
      toast.success('Cotización eliminada del historial.');
    } catch (error) {
      logger.error('Error deleting quote', error);
      toast.error('No se pudo eliminar la cotización.');
    } finally {
      setIsDeleting(false);
      setQuoteToDelete(null);
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'Fecha desconocida';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp as unknown as string | number);
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Cargando historial de cotizaciones...</p>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="bg-[#0a0f1d] border border-white/10 p-8 rounded-3xl text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-white font-bold mb-2">No hay cotizaciones guardadas</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Las cotizaciones generadas, compartidas o enviadas por correo aparecerán aquí automáticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0a0f1d] border border-white/10 p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Historial de Cotizaciones</h2>
          <p className="text-sm text-slate-400">
            Últimas {quotes.length} cotizaciones generadas en el sistema.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-5 hover:border-amber-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-amber-500" />
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-bold">{quote.clientName}</h3>
                  <span className="bg-white/5 px-2 py-0.5 rounded text-xs font-mono text-amber-400 border border-white/10">
                    {quote.folio}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(quote.createdAt)}
                  </span>
                  <span>Vendedor: {quote.sellerName}</span>
                  <span>{quote.itemsCount} producto{quote.itemsCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Total</p>
                <p className="text-white font-bold text-lg">{formatMoney(quote.total)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <a
                  href={quote.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-white/10 p-2.5 rounded-lg text-white transition-colors"
                  aria-label={`Ver PDF de ${quote.folio}`}
                  title="Ver documento PDF"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setQuoteToDelete(quote)}
                  className="bg-white/5 hover:bg-red-500 hover:text-white p-2.5 rounded-lg text-red-400 transition-colors"
                  aria-label={`Eliminar cotización ${quote.folio}`}
                  title="Eliminar del historial"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
      
      {quotes.length >= displayLimit && (
        <div className="mt-12 text-center">
          <button 
            onClick={loadMore}
            className="bg-white/5 border border-white/10 hover:bg-amber-600 hover:border-amber-500 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
          >
            Cargar Más
          </button>
        </div>
      )}

      <ConfirmDialog
        open={!!quoteToDelete}
        title="¿Eliminar esta cotización?"
        message={`Se eliminará "${quoteToDelete?.folio}" del historial permanentemente. El PDF ya descargado no se ve afectado.`}
        confirmLabel={isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleDeleteQuote}
        onCancel={() => setQuoteToDelete(null)}
      />
    </div>
  );
}
