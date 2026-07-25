import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Share2, MapPin, Mail, Phone, Building2, User as UserIcon, AlertCircle, Send } from 'lucide-react';
import { ManoFilLogo } from '../../../components/ManoFilLogo';
import { db, storage } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import emailjs from '@emailjs/browser';
import { logger } from '../../../lib/logger';

interface CatalogProduct {
  id: string;
  title: string;
  weight: string;
  desc: string;
  imgUrl?: string;
}

interface QuoteItem {
  id: string;
  productTitle: string;
  quantity: number;
  price: number;
  imgUrl?: string;
}

interface Props {
  products: CatalogProduct[];
  userEmail: string;
}

export function QuoteGenerator({ products, userEmail }: Props) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [clientName, setClientName] = useState('');
  const [sellerName, setSellerName] = useState('Paco Iglesias');
  const [sellerEmail, setSellerEmail] = useState(userEmail || 'paco@cobertores.com');
  const [globalLogoUrl, setGlobalLogoUrl] = useState('');
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'system_settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.logoUrl) setGlobalLogoUrl(data.logoUrl);
        }
      } catch (e) {
        logger.error("Error fetching global logo", e);
      }
    };
    fetchSettings();
  }, []);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [customProductTitle, setCustomProductTitle] = useState('');
  const [selectedImgUrl, setSelectedImgUrl] = useState('');

  const [validity, setValidity] = useState('15 días');
  const [deliveryTime, setDeliveryTime] = useState('3 a 4 semanas post-anticipo');
  
  const [bankName, setBankName] = useState('BBVA Bancomer');
  const [bankAccount, setBankAccount] = useState('0123456789');
  const [bankClabe, setBankClabe] = useState('012345678901234567');
  const [bankRfc, setBankRfc] = useState('MFI6212158B4');
  const [folio, setFolio] = useState('');

  const generateNewFolio = () => {
    const array = new Uint32Array(2);
    window.crypto.getRandomValues(array);
    const segment1 = (array[0] % 65536).toString(16).toUpperCase().padStart(4, '0');
    const segment2 = (array[1] % 65536).toString(16).toUpperCase().padStart(4, '0');
    return `COT-${segment1}-${segment2}`;
  };

  useEffect(() => {
    setFolio(generateNewFolio());
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = customProductTitle.trim();
    if (!finalTitle || quantity <= 0 || price <= 0) return;

    setItems([...items, {
      id: Date.now().toString(),
      productTitle: finalTitle,
      quantity,
      price,
      imgUrl: selectedImgUrl
    }]);
    
    setCustomProductTitle('');
    setSelectedProduct('');
    setSelectedImgUrl('');
    setQuantity(1);
    setPrice(0);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const generatePDF = async () => {
    const element = document.getElementById('quote-template-pdf');
    if (!element) return;
    
    setIsGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Cotizacion_${clientName.replace(/[^a-z0-9]/gi, '_') || 'Mano_Fil'}.pdf`);
    } catch (e) {
      logger.error("PDF Error:", e);
      alert('Error al generar PDF. Verifica que las imágenes carguen correctamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sharePDF = async () => {
    const element = document.getElementById('quote-template-pdf');
    if (!element) return;
    
    setIsGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `Cotizacion_${folio}.pdf`, { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Cotización Mano Fil S.A.`,
          text: `Adjunto cotización para ${clientName || 'usted'}.`,
        });
      } else {
        alert("Tu dispositivo o navegador no soporta compartir archivos directamente. Se descargará el PDF.");
        pdf.save(`Cotizacion_${clientName.replace(/[^a-z0-9]/gi, '_') || 'Mano_Fil'}.pdf`);
      }
    } catch (e) {
      logger.error("Share Error:", e);
      alert('Error al compartir el PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const [clientEmailInput, setClientEmailInput] = useState('');
  
  const sendEmail = async () => {
    if (!clientEmailInput) {
      alert("Por favor ingresa el correo del cliente.");
      return;
    }
    const element = document.getElementById('quote-template-pdf');
    if (!element) return;
    
    setIsGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');
      
      // 1. Upload to Firebase Storage
      const storageRef = ref(storage, `quotes/${folio}.pdf`);
      await uploadBytes(storageRef, pdfBlob);
      const downloadUrl = await getDownloadURL(storageRef);
      
      // 2. Send Email via EmailJS
      await emailjs.send(
        'service_xhdjd9e', 
        'template_g523gds', 
        {
          name: clientName || 'Cliente Estimado',
          phone: sellerName,
          email: clientEmailInput,
          quantity: items.length.toString(),
          message: `Adjuntamos la cotización oficial de Mano Fil S.A. Puedes descargar tu PDF seguro en el siguiente enlace: ${downloadUrl} (Cotización preparada por ${sellerName} - ${sellerEmail})`,
        }, 
        'rnWVm41Zez5G-ehqq'
      );
      
      alert('¡Cotización enviada exitosamente por correo!');
      setClientEmailInput('');
      setFolio(generateNewFolio());
    } catch (e) {
      logger.error("Email Error:", e);
      alert('Error al enviar la cotización.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formattedDate = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Controles del Formulario (Lado Izquierdo) */}
      <div className="lg:col-span-4 bg-[#0a0f1d] border border-white/10 p-6 rounded-3xl space-y-6">
        <div>
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Datos Generales</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Cliente / Empresa</label>
              <input type="text" value={clientName} onChange={e=>setClientName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-amber-500 outline-none" placeholder="Industrias SA de CV" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Vendedor</label>
              <input type="text" value={sellerName} onChange={e=>setSellerName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Correo de Contacto</label>
              <input type="text" value={sellerEmail} onChange={e=>setSellerEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-amber-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Agregar Artículos</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Descripción</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customProductTitle} 
                  onChange={e => setCustomProductTitle(e.target.value)} 
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-amber-500 outline-none" 
                  placeholder="Ej. Cobertor Lote A" 
                />
                <select 
                  value={selectedProduct} 
                  onChange={e => {
                    setSelectedProduct(e.target.value);
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) {
                      setCustomProductTitle(`${prod.title} (${prod.weight})`);
                      setSelectedImgUrl(prod.imgUrl || '');
                    }
                  }} 
                  className="w-12 bg-white/5 border border-white/10 rounded-xl p-3 text-transparent focus:border-amber-500 outline-none appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=%23f59e0b viewBox=0 0 24 24 xmlns=http://www.w3.org/2000/svg><path d=M7 10l5 5 5-5z/></svg>")', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5rem' }}
                >
                  <option value="" className="text-black">Catálogo...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} className="text-black">{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Cant.</label>
                <input type="number" min="1" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-amber-500 outline-none" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Precio ($)</label>
                <input type="number" min="0" step="0.01" value={price} onChange={e=>setPrice(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-amber-500 outline-none" />
              </div>
            </div>
            <button type="submit" disabled={!customProductTitle.trim()} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2">
              <Plus className="w-3 h-3"/> Añadir
            </button>
          </form>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Condiciones</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Vigencia</label>
              <input type="text" value={validity} onChange={e=>setValidity(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Entrega</label>
              <input type="text" value={deliveryTime} onChange={e=>setDeliveryTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-amber-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
          <button onClick={generatePDF} disabled={isGenerating || items.length === 0} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
            {isGenerating ? <span className="animate-pulse">Generando...</span> : <><Download className="w-4 h-4"/> Descargar PDF</>}
          </button>
          
          <div className="flex gap-3">
            <button onClick={sharePDF} disabled={isGenerating || items.length === 0} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
              <Share2 className="w-4 h-4"/> Compartir
            </button>
          </div>
          
          <div className="flex gap-2 mt-2">
            <input type="email" value={clientEmailInput} onChange={e=>setClientEmailInput(e.target.value)} placeholder="Correo del cliente..." className="flex-grow bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-amber-500 outline-none" />
            <button onClick={sendEmail} disabled={isGenerating || items.length === 0 || !clientEmailInput} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
              <Send className="w-4 h-4"/> Enviar
            </button>
          </div>
        </div>
      </div>

      {/* Vista Previa de la Hoja Membretada (Lado Derecho) */}
      <div className="lg:col-span-8 bg-[#03050a] p-4 sm:p-8 rounded-3xl border border-white/5 overflow-x-auto flex items-start justify-center">
        
        {/* Plantilla A4 Ultra Premium - INLINE STYLES FOR HTML2CANVAS COMPATIBILITY (NO TAILWIND COLORS) */}
        <div 
          id="quote-template-pdf" 
          className="relative flex flex-col shadow-2xl" 
          style={{ width: '794px', minHeight: '1123px', padding: '60px', backgroundColor: '#ffffff', color: '#0f172a' }}
        >
          {/* Decorative Top Border */}
          <div className="absolute top-0 left-0 w-full h-2" style={{ background: 'linear-gradient(to right, #0f172a, #b45309, #0f172a)' }}></div>

          {/* Watermark */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden" style={{ zIndex: 0, opacity: 0.03 }}>
            {globalLogoUrl ? (
              <img src={globalLogoUrl} alt="Watermark" className="w-[600px]" style={{ filter: 'grayscale(100%)' }} crossOrigin="anonymous" />
            ) : (
              <ManoFilLogo variant="brand" className="w-[600px]" showText={false} />
            )}
          </div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Header: Logo and Info */}
            <div className="flex justify-between items-start mb-12">
              <div className="w-40">
                {globalLogoUrl ? (
                  <img src={globalLogoUrl} alt="Logo" className="w-full h-auto" crossOrigin="anonymous" />
                ) : (
                  <ManoFilLogo variant="brand" className="w-full" showText={false} />
                )}
                <div className="mt-4">
                  <h1 className="text-sm font-bold tracking-widest uppercase" style={{ color: '#0f172a' }}>Mano Fil S.A.</h1>
                  <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>Suministro Textil</p>
                </div>
              </div>
              
              <div className="text-right">
                <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-4" style={{ color: '#64748b' }}>Cotización</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
                  <div className="text-[9px] uppercase tracking-widest font-bold" style={{ color: '#64748b' }}>Folio</div>
                  <div className="text-[11px] font-mono font-bold" style={{ color: '#0f172a' }}>{folio}</div>
                  
                  <div className="text-[9px] uppercase tracking-widest font-bold" style={{ color: '#64748b' }}>Fecha</div>
                  <div className="text-[11px]" style={{ color: '#334155' }}>{formattedDate}</div>
                </div>
              </div>
            </div>

            {/* Client & Seller Details (Minimalist Grid) */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-[9px] uppercase tracking-[0.2em] font-bold mb-3 pb-2" style={{ color: '#b45309', borderBottom: '1px solid #e2e8f0' }}>Preparado Para</h3>
                <p className="text-sm font-bold" style={{ color: '#0f172a' }}>{clientName || 'Nombre del Cliente / Empresa'}</p>
              </div>
              <div>
                <h3 className="text-[9px] uppercase tracking-[0.2em] font-bold mb-3 pb-2" style={{ color: '#b45309', borderBottom: '1px solid #e2e8f0' }}>Asesor Comercial</h3>
                <p className="text-sm font-bold" style={{ color: '#0f172a' }}>{sellerName}</p>
                <p className="text-xs mt-1" style={{ color: '#64748b' }}>{sellerEmail}</p>
              </div>
            </div>

            {/* Table */}
            <div className="flex-grow mb-12">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-2 text-[9px] font-bold uppercase tracking-widest text-center w-12" style={{ color: '#0f172a', borderBottom: '2px solid #0f172a' }}>Img</th>
                    <th className="py-3 px-2 text-[9px] font-bold uppercase tracking-widest" style={{ color: '#0f172a', borderBottom: '2px solid #0f172a' }}>Descripción del Artículo</th>
                    <th className="py-3 px-2 text-[9px] font-bold uppercase tracking-widest text-center w-16" style={{ color: '#0f172a', borderBottom: '2px solid #0f172a' }}>Cant.</th>
                    <th className="py-3 px-2 text-[9px] font-bold uppercase tracking-widest text-right w-24" style={{ color: '#0f172a', borderBottom: '2px solid #0f172a' }}>Precio U.</th>
                    <th className="py-3 px-2 text-[9px] font-bold uppercase tracking-widest text-right w-28" style={{ color: '#0f172a', borderBottom: '2px solid #0f172a' }}>Subtotal</th>
                    <th className="py-3 px-1 w-8" data-html2canvas-ignore style={{ borderBottom: '2px solid #0f172a' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[11px] italic" style={{ color: '#94a3b8' }}>No hay artículos en la cotización.</td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="py-3 px-2 text-center" style={{ borderBottom: '1px solid #f1f5f9' }}>
                          {item.imgUrl ? (
                            <img src={item.imgUrl} alt="Prod" className="w-8 h-8 object-cover rounded mx-auto" style={{ filter: 'grayscale(100%)', opacity: 0.8 }} crossOrigin="anonymous" />
                          ) : (
                            <div className="w-8 h-8 rounded mx-auto flex items-center justify-center text-[7px]" style={{ backgroundColor: '#f8fafc', color: '#cbd5e1' }}>N/A</div>
                          )}
                        </td>
                        <td className="py-3 px-2 text-[11px] font-semibold" style={{ color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{item.productTitle}</td>
                        <td className="py-3 px-2 text-[11px] font-mono text-center" style={{ color: '#475569', borderBottom: '1px solid #f1f5f9' }}>{item.quantity}</td>
                        <td className="py-3 px-2 text-[11px] font-mono text-right" style={{ color: '#475569', borderBottom: '1px solid #f1f5f9' }}>${item.price.toFixed(2)}</td>
                        <td className="py-3 px-2 text-[11px] font-bold font-mono text-right" style={{ color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>${(item.price * item.quantity).toFixed(2)}</td>
                        <td className="py-3 px-1 text-right" data-html2canvas-ignore style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-3 h-3"/>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Totals Section */}
              {items.length > 0 && (
                <div className="flex justify-end mt-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <span className="text-[10px] uppercase tracking-widest" style={{ color: '#64748b' }}>Subtotal</span>
                      <span className="text-[11px] font-mono font-bold" style={{ color: '#334155' }}>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <span className="text-[10px] uppercase tracking-widest" style={{ color: '#64748b' }}>I.V.A (16%)</span>
                      <span className="text-[11px] font-mono" style={{ color: '#64748b' }}>${iva.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 items-end">
                      <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: '#0f172a' }}>Total MXN</span>
                      <span className="text-xl font-bold font-mono leading-none" style={{ color: '#b45309' }}>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Bank Info */}
            <div className="mt-auto grid grid-cols-2 gap-12 mb-16 pt-8" style={{ borderTop: '1px solid #e2e8f0' }}>
              <div>
                <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#0f172a' }}>Términos y Condiciones</h4>
                <ul className="text-[9px] space-y-2 list-none p-0 leading-relaxed" style={{ color: '#475569' }}>
                  <li className="flex gap-2"><span style={{ color: '#f59e0b' }}>•</span> Vigencia de cotización: {validity}</li>
                  <li className="flex gap-2"><span style={{ color: '#f59e0b' }}>•</span> Tiempo de entrega: {deliveryTime}</li>
                  <li className="flex gap-2"><span style={{ color: '#f59e0b' }}>•</span> Los precios expresados SÍ incluyen el 16% de I.V.A.</li>
                  <li className="flex gap-2"><span style={{ color: '#f59e0b' }}>•</span> Gastos de flete y logística se cotizan por separado.</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#0f172a' }}>Datos Bancarios</h4>
                <div className="space-y-2 text-[9px]">
                  <div className="flex justify-between pb-1" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Institución:</span>
                    <span className="font-bold" style={{ color: '#0f172a' }}>{bankName}</span>
                  </div>
                  <div className="flex justify-between pb-1" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>RFC:</span>
                    <span className="font-bold font-mono" style={{ color: '#0f172a' }}>{bankRfc}</span>
                  </div>
                  <div className="flex justify-between pb-1" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Cuenta:</span>
                    <span className="font-bold font-mono" style={{ color: '#0f172a' }}>{bankAccount}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span style={{ color: '#64748b' }}>CLABE:</span>
                    <span className="font-bold font-mono" style={{ color: '#0f172a' }}>{bankClabe}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Contact Info */}
            <div className="pt-6 text-center" style={{ borderTop: '1px solid #e2e8f0' }}>
              <div className="flex items-center justify-center gap-6 text-[9px] font-medium uppercase tracking-widest mb-3" style={{ color: '#64748b' }}>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: '#d97706' }} /> +52 246 464 2891</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: '#d97706' }} /> paco@cobertores.com</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: '#d97706' }} /> Tlaxcala, México</span>
              </div>
              <p className="text-[8px] uppercase tracking-widest" style={{ color: '#94a3b8' }}>
                Documento generado por la Plataforma B2B de www.cobertores.com
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
