'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit, FileText, Download, Share2, MapPin, Mail, Phone, Shield } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { ManoFilLogo } from '../../../components/ManoFilLogo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { logger } from '../../../lib/logger';

interface OfficialDocument {
  id: string;
  folio: string;
  title: string;
  recipient: string;
  body: string;
  date: string;
  createdAt: Timestamp;
}

export default function OfficialDocumentsManager({ 
  isEditor = false, 
  isSuperAdmin = false,
  userEmail = ''
}: { 
  isEditor?: boolean, 
  isSuperAdmin?: boolean,
  userEmail?: string 
}) {
  const [documents, setDocuments] = useState<OfficialDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Editor state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [folio, setFolio] = useState('');
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [body, setBody] = useState('');
  const [date, setDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Reference for PDF generation
  const pdfRef = useRef<HTMLDivElement>(null);

  const generateSecureFolio = () => {
    const array = new Uint32Array(2);
    window.crypto.getRandomValues(array);
    const segment1 = (array[0] % 65536).toString(16).toUpperCase().padStart(4, '0');
    const segment2 = (array[1] % 65536).toString(16).toUpperCase().padStart(4, '0');
    return `MF-OF-${segment1}-${segment2}`;
  };

  useEffect(() => {
    fetchDocuments();
    // Default date to today
    const today = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    setDate(`Santa Ana Chiautempan, Tlax. a ${today}`);
    setFolio(generateSecureFolio());
  }, []);

  const fetchDocuments = async () => {
    try {
      const q = query(collection(db, 'official_documents'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const docsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OfficialDocument[];
      setDocuments(docsData);
    } catch (error) {
      logger.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setRecipient('');
    setBody('');
    const today = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    setDate(`Santa Ana Chiautempan, Tlax. a ${today}`);
    setFolio(generateSecureFolio());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditor) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, 'official_documents', editingId), {
          title,
          recipient,
          body,
          date,
          folio
        });
      } else {
        await addDoc(collection(db, 'official_documents'), {
          title,
          recipient,
          body,
          date,
          folio,
          author: userEmail,
          createdAt: serverTimestamp()
        });
      }
      resetForm();
      fetchDocuments();
    } catch (error) {
      logger.error("Error saving document:", error);
      alert("Hubo un error al guardar el documento.");
    }
  };

  const handleEdit = (doc: OfficialDocument) => {
    setEditingId(doc.id);
    setFolio(doc.folio || '');
    setTitle(doc.title || '');
    setRecipient(doc.recipient || '');
    setBody(doc.body || '');
    setDate(doc.date || '');
  };

  const handleDelete = async (id: string) => {
    if (!isSuperAdmin) return;
    if (confirm('¿Estás seguro de que deseas eliminar este documento? Esta acción solo la puede realizar el Super Admin.')) {
      try {
        await deleteDoc(doc(db, 'official_documents', id));
        fetchDocuments();
      } catch (error) {
        logger.error("Error deleting document:", error);
      }
    }
  };

  const generatePDF = async () => {
    if (!pdfRef.current) return;
    setIsGenerating(true);
    
    try {
      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Oficio_${folio}.pdf`);
    } catch (error) {
      logger.error("Error al generar PDF:", error);
      alert("Hubo un error al generar el PDF. Verifica que todas las imágenes hayan cargado correctamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const sharePDF = async () => {
    if (!pdfRef.current) return;
    setIsGenerating(true);
    
    try {
      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `Oficio_${folio}.pdf`, { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Oficio Mano Fil S.A.`,
          text: `Adjunto documento oficial.`,
        });
      } else {
        alert("Tu dispositivo no soporta el envío directo a WhatsApp. Se descargará el PDF.");
        pdf.save(`Oficio_${folio}.pdf`);
      }
    } catch (error) {
      logger.error("Error al generar PDF:", error);
      alert("Hubo un error al compartir el PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatBody = (text: string) => {
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-6 text-justify leading-relaxed" style={{ color: '#1e293b', fontSize: '14px', lineHeight: '1.6' }}>
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Panel Izquierdo: Lista y Formulario */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#070b14] p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Gestor de Oficios
            </h2>
            {editingId && (
              <button 
                onClick={resetForm}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                + Nuevo
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Folio Interno</label>
                <input 
                  type="text" 
                  value={folio} 
                  onChange={e => setFolio(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none font-mono" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Asunto / Título corto</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required
                  placeholder="Ej. Carta de Presentación"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Lugar y Fecha</label>
              <input 
                type="text" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" 
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">A Quien Corresponda (Destinatario)</label>
              <input 
                type="text" 
                value={recipient} 
                onChange={e => setRecipient(e.target.value)} 
                required
                placeholder="Ej. Lic. Carlos Mendoza - Director de Compras"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none font-bold" 
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Cuerpo del Documento</label>
              <textarea 
                value={body} 
                onChange={e => setBody(e.target.value)} 
                required
                rows={8}
                placeholder="Redacte aquí el contenido formal..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none resize-none" 
              />
            </div>

            <button 
              type="submit" 
              disabled={!isEditor}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4"/> {editingId ? 'Actualizar Documento' : 'Guardar Nuevo Documento'}
            </button>
          </form>
        </div>

        {/* Lista de Documentos (Solo Super Admin) */}
        {isSuperAdmin ? (
          <div className="bg-[#070b14] p-6 rounded-3xl border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Historial de Oficios (Vista de Admin)</h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                <p className="text-slate-400 text-sm italic">Cargando...</p>
              ) : documents.length === 0 ? (
                <p className="text-slate-400 text-sm italic">No hay documentos guardados.</p>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="bg-white/5 rounded-xl p-4 flex justify-between items-center group">
                    <div className="overflow-hidden">
                      <p className="font-bold text-amber-500 text-sm truncate">{doc.folio} - {doc.title}</p>
                      <p className="text-xs text-slate-400 truncate mt-1">Para: {doc.recipient}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(doc)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="bg-amber-900/20 p-6 rounded-3xl border border-amber-500/20 text-amber-200/70 text-sm text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Por medidas de seguridad, el historial de oficios solo es visible para el Administrador del Sistema. Puedes crear y generar tus PDFs libremente aquí arriba.</p>
          </div>
        )}
      </div>

      {/* Panel Derecho: Vista Previa y PDF */}
      <div className="lg:col-span-7 space-y-4">
        
        <div className="flex justify-end gap-4">
           <button 
            onClick={generatePDF} 
            disabled={isGenerating || !body} 
            className="flex-1 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-6 rounded-xl uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4"/> Descargar
          </button>
          <button 
            onClick={sharePDF} 
            disabled={isGenerating || !body} 
            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="w-4 h-4"/> Enviar (WhatsApp)
          </button>
        </div>

        <div className="bg-[#070b14] p-4 rounded-3xl border border-white/5 overflow-x-auto flex items-start justify-center">
          
           {/* Contenedor exacto A4 para html2canvas: width: 794px, min-height: 1123px */}
          <div id="official-document-pdf" ref={pdfRef} className="relative flex flex-col overflow-hidden" style={{ width: '794px', minHeight: '1123px', backgroundColor: '#ffffff', color: '#000000', padding: '64px' }}>
            
            {/* Marca de agua (Watermark) transparente */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-0">
              <ManoFilLogo variant="dark" className="w-[450px]" />
            </div>

            <div className="relative z-10 flex flex-col h-full" style={{ height: '995px' }}>
              
              {/* Header Corporativo (Limpio y Blanco) */}
              <div className="flex justify-between items-start mb-10 pb-6" style={{ borderBottom: '2px solid #f1f5f9' }}>
                <div className="flex items-center gap-5">
                  <div className="h-16 w-20 flex items-center justify-center">
                    <ManoFilLogo className="h-full w-full" showText={false} variant="brand" />
                  </div>
                  <div>
                    <h1 className="font-serif font-black tracking-tight" style={{ color: '#0f172a', fontSize: '24px' }}>Mano Fil S.A.</h1>
                    <p className="text-[10px] mt-1 font-bold tracking-widest uppercase" style={{ color: '#d97706' }}>Suministro Textil Especializado</p>
                  </div>
                </div>
                <div className="text-right pl-6 flex flex-col justify-end items-end h-16" style={{ borderLeft: '2px solid #f1f5f9' }}>
                  <div className="text-right mt-auto">
                    <div className="flex items-baseline justify-end gap-2">
                      <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#d97706' }}>Ref.</span>
                      <span className="font-serif tracking-wider" style={{ color: '#1e293b', fontSize: '18px' }}>{folio || '---'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fecha y Destinatario */}
              <div className="mb-8 text-right">
                <p className="font-medium" style={{ color: '#475569', fontSize: '13px' }}>{date || 'Lugar y Fecha'}</p>
                {title && <p className="font-bold mt-2 uppercase" style={{ color: '#0f172a', fontSize: '12px' }}>Asunto: {title}</p>}
              </div>

              <div className="mb-8">
                <p className="font-black" style={{ color: '#0f172a', fontSize: '15px' }}>{recipient || 'A Quien Corresponda'}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>Presente.-</p>
              </div>

              {/* Cuerpo del Documento */}
              <div className="flex-grow mb-8" style={{ color: '#1e293b' }}>
                {body ? formatBody(body) : (
                  <p className="italic text-center mt-20" style={{ color: '#cbd5e1' }}>El cuerpo del documento aparecerá aquí...</p>
                )}
              </div>

              {/* Despedida y Firma */}
              <div className="mt-auto mb-10 pt-4">
                <p className="text-justify leading-relaxed mb-12" style={{ color: '#1e293b', fontSize: '14px' }}>
                  Sin más por el momento, quedo a su entera disposición para cualquier aclaración o duda al respecto.
                </p>
                
                <div className="text-center w-56 mx-auto">
                  <div className="pt-3 mb-1" style={{ borderTop: '1px solid #0f172a' }}></div>
                  <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#0f172a' }}>Atentamente</p>
                  <p className="text-xs font-bold mt-2" style={{ color: '#334155' }}>Mano Fil S.A.</p>
                  <p className="text-[9px] uppercase tracking-widest font-medium mt-1" style={{ color: '#64748b' }}>Firma Autorizada</p>
                </div>
              </div>

              {/* Footer Corporativo */}
              <div className="text-center p-6 -mx-16 -mb-16 mt-auto" style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mb-3 px-4">
                  <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#475569' }}>
                    <Phone className="w-3.5 h-3.5" style={{ color: '#d97706' }} /> <span>+52 246 464 2891</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#475569' }}>
                    <Mail className="w-3.5 h-3.5" style={{ color: '#d97706' }} /> <span>paco@cobertores.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#475569' }}>
                    <MapPin className="w-3.5 h-3.5" style={{ color: '#d97706' }} /> <span>Santa Ana Chiautempan, Tlaxcala</span>
                  </div>
                </div>
                <p className="text-[8px] uppercase tracking-widest font-medium" style={{ color: '#94a3b8' }}>
                  Documento oficial generado tecnológicamente por la Plataforma B2B de <span className="font-bold" style={{ color: '#d97706' }}>www.cobertores.com</span>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
