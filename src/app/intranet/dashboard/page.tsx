'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, Timestamp, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../../../lib/firebase';
import { LogOut, FileText, Download, Shield, Building2, Upload, Trash2, Image as ImageIcon, File, Loader2, Users, MessageSquare, Clock, Edit, Eye, X, FileSignature, Smartphone, Plus, Package } from 'lucide-react';
import Link from 'next/link';
import { QuoteGenerator } from './QuoteGenerator';
import { QuotesHistoryManager } from './QuotesHistoryManager';
import OfficialDocumentsManager from './OfficialDocumentsManager';
import SystemSettings from './SystemSettings';
import NewsManager from './NewsManager';
import SystemMonitor from './SystemMonitor';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { FilesTab } from './components/FilesTab';

import { SkeletonTable } from '@/components/Skeleton';
import { LeadsTab } from './components/LeadsTab';
import { OrdersTab } from './components/OrdersTab';
import { ProductsTab } from './components/ProductsTab';
import { getFileIcon, formatSize } from './components/utils';
import { toast } from 'react-hot-toast';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { logger } from '../../../lib/logger';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface IntranetFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: string;
  createdAt: Timestamp;
  storagePath: string;
}

interface UserPrivilege {
  id?: string;
  email: string;
  role: 'editor' | 'lector' | 'almacen';
  expiresAt: Timestamp | null;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  quantity: string;
  message: string;
  createdAt: Timestamp;
}

interface Order {
  id: string;
  folio: string;
  clientName: string;
  status: 'Cotizado' | 'En Producción' | 'Listo para Carga' | 'Entregado' | 'Cancelado' | 'Abandonado';
  updatedAt: Timestamp;
}

interface CatalogProduct {
  id: string;
  title: string;
  weight: string;
  desc: string;
  measures: string;
  composition: string;
  imgUrl: string;
  storagePath: string;
  createdAt: Timestamp;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'files' | 'leads' | 'orders' | 'users' | 'catalog' | 'quote-generator' | 'quotes-history' | 'documents' | 'settings' | 'news' | 'monitor' | 'analytics'>('files');
  const [leadSearchTerm, setLeadSearchTerm] = useState('');
  
  // Data States
  const [files, setFiles] = useState<IntranetFile[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [privileges, setPrivileges] = useState<UserPrivilege[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  
  // Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Privilege Form States
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'editor' | 'lector'>('lector');
  const [expireHours, setExpireHours] = useState<number>(0);

  // Previewer State
  const [previewFile, setPreviewFile] = useState<IntranetFile | null>(null);

  // Auth & Roles
  const SUPER_ADMINS = ['paco@cobertores.com', 'paco.iglesias@gmail.com', 'pacoismael@gmail.com'];
  const isSuperAdmin = user?.email ? SUPER_ADMINS.includes(user.email) : false;
  
  const [isEditor, setIsEditor] = useState(false);
  const [isAlmacen, setIsAlmacen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace('/intranet');
      } else {
        setUser(currentUser);
        
        // Verify Privileges if not super admin
        if (!SUPER_ADMINS.includes(currentUser.email || '')) {
          const privRef = doc(db, 'user_privileges', currentUser.email || 'unknown');
          const privSnap = await getDoc(privRef);
          if (privSnap.exists()) {
            const privData = privSnap.data() as UserPrivilege;
            const isNotExpired = !privData.expiresAt || privData.expiresAt.toDate() > new Date();
            if (isNotExpired) {
              if (privData.role === 'editor') setIsEditor(true);
              if (privData.role === 'almacen') {
                setIsAlmacen(true);
                setActiveTab('orders'); // Force Almacén to land on Orders tab
              }
            }
          }
        } else {
          setIsEditor(true); // Super admin is always editor
        }
        setLoading(false);
      }
    });

    // Listeners
    const filesQuery = query(collection(db, 'intranet_files'), orderBy('createdAt', 'desc'));
    const unsubscribeFiles = onSnapshot(filesQuery, (snapshot) => {
      setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IntranetFile[]);
    }, (err) => {
      logger.error('Error en listener:', err);
    });

    const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lead[]);
    }, (err) => {
      logger.error('Error en listener:', err);
    });

    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CatalogProduct[]);
    }, (err) => {
      logger.error('Error en listener:', err);
    });

    const ordersQuery = query(collection(db, 'orders'), orderBy('updatedAt', 'desc'));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]);
    }, (err) => {
      logger.error('Error en listener:', err);
    });

    let unsubscribePrivs = () => {};
    if (isSuperAdmin) {
      const privsQuery = collection(db, 'user_privileges');
      unsubscribePrivs = onSnapshot(privsQuery, (snapshot) => {
        setPrivileges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserPrivilege[]);
      }, (err) => {
        logger.error('Error en listener:', err);
      });
    }

    return () => {
      unsubscribeAuth();
      unsubscribeFiles();
      unsubscribeLeads();
      unsubscribeProducts();
      unsubOrders();
      if(isSuperAdmin) unsubscribePrivs();
    };
  }, [router, isSuperAdmin]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/intranet');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  // Utilities are now imported from ./components/utils
  // --- FILE MANAGEMENT ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user || !isEditor) return;
    
    const file = e.target.files[0];
    setUploading(true);
    setUploadProgress(`Subiendo ${file.name}...`);
    
    try {
      const storageRef = ref(storage, `intranet/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      await addDoc(collection(db, 'intranet_files'), {
        name: file.name,
        url: url,
        size: file.size,
        type: file.type,
        uploadedBy: user.email,
        createdAt: Timestamp.now(),
        storagePath: storageRef.fullPath
      });
    } catch (error) {
      logger.error(error);
      toast.error("Error al subir archivo. Revisa tus permisos o la conexión.");
    } finally {
      setUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = async (id: string, storagePath: string) => {
    if (!confirm('¿Seguro que deseas eliminar este archivo de forma permanente?')) return;
    try {
      await deleteObject(ref(storage, storagePath));
      await deleteDoc(doc(db, 'intranet_files', id));
    } catch (err) {
      logger.error(err);
      toast.error('Error eliminando el archivo.');
    }
  };

  const exportLeadsToCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ['Nombre', 'Teléfono', 'Volumen', 'Mensaje', 'Fecha'];
    
    const rows = leads.map(lead => [
      `"${lead.name || ''}"`,
      `"${lead.phone || ''}"`,
      `"${lead.quantity || ''}"`,
      `"${(lead.message || '').replace(/"/g, '""')}"`,
      `"${lead.createdAt?.toDate().toLocaleDateString('es-MX') || ''}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Prospectos_ManoFil_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRenameFile = async (fileId: string, currentName: string) => {
    if (!isEditor) return;
    const newName = prompt("Ingresa el nuevo nombre del archivo:", currentName);
    if (!newName || newName === currentName) return;
    try {
      await setDoc(doc(db, 'intranet_files', fileId), { name: newName }, { merge: true });
    } catch (error) {
      logger.error(error);
      toast.error("Error al renombrar. Revisar permisos.");
    }
  };


  // --- CATALOG MANAGEMENT ---
  const [productForm, setProductForm] = useState({ title: '', weight: '', desc: '', measures: '', composition: '' });
  const productImgRef = useRef<HTMLInputElement>(null);

  const handleProductUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImgRef.current?.files || productImgRef.current.files.length === 0 || !isEditor) return;
    
    setUploading(true);
    setUploadProgress('Subiendo producto al catálogo...');
    const file = productImgRef.current.files[0];
    
    try {
      const storageRef = ref(storage, `catalog/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      await addDoc(collection(db, 'products'), {
        ...productForm,
        imgUrl: url,
        storagePath: storageRef.fullPath,
        createdAt: Timestamp.now()
      });
      
      setProductForm({ title: '', weight: '', desc: '', measures: '', composition: '' });
      if (productImgRef.current) productImgRef.current.value = '';
      toast.success('Producto subido exitosamente.');
    } catch (error) {
      logger.error(error);
      toast.error("Error al subir el producto.");
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleDeleteProduct = async (productId: string, storagePath: string) => {
    if (!isEditor) return;
    if (!confirm('¿Borrar este producto del catálogo público?')) return;
    try {
      if (storagePath) await deleteObject(ref(storage, storagePath));
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      logger.error(error);
      toast.error("No se pudo borrar el producto.");
    }
  };

  // --- PRIVILEGE MANAGEMENT ---
  const handleAddPrivilege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !newEmail) return;
    
    let expirationTime = null;
    if (expireHours > 0) {
      const date = new Date();
      date.setHours(date.getHours() + Number(expireHours));
      expirationTime = Timestamp.fromDate(date);
    }

    try {
      await setDoc(doc(db, 'user_privileges', newEmail.toLowerCase()), {
        email: newEmail.toLowerCase(),
        role: newRole,
        expiresAt: expirationTime
      });
      setNewEmail('');
      toast.success(`Privilegios actualizados para ${newEmail}`);
    } catch (error) {
      logger.error(error);
      toast.error("Error guardando privilegios.");
    }
  };

  const handleDeletePrivilege = async (email: string) => {
    if (!isSuperAdmin) return;
    if (!confirm(`¿Revocar acceso a ${email}?`)) return;
    try {
      await deleteDoc(doc(db, 'user_privileges', email));
    } catch (error) {
      toast.error('Error al eliminar privilegio');
    }
  };

  const exportCatalogPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(234, 179, 8); // Amber 500
      doc.text("Catálogo Mano Fil S.A.", 105, 20, { align: "center" });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate 500
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });

      let yPos = 40;
      doc.setTextColor(0, 0, 0);

      products.forEach((prod, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${prod.title}`, 20, yPos);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        yPos += 7;
        doc.text(`Peso/Etiqueta: ${prod.weight} | Medidas: ${prod.measures} | Comp: ${prod.composition}`, 20, yPos);
        
        yPos += 7;
        doc.setFont("helvetica", "italic");
        doc.text(`Descripción: ${prod.desc.substring(0, 100)}${prod.desc.length > 100 ? '...' : ''}`, 20, yPos);
        
        yPos += 15;
      });

      doc.save(`Catalogo-ManoFil-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Catálogo exportado exitosamente");
    } catch (error) {
      logger.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF del catálogo");
    }
  };


  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans selection:bg-amber-500 selection:text-white">
      {/* Navbar Interno */}
      <nav className="bg-[#0a0f1d] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
              <Building2 className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h1 className="font-serif text-xl text-white">Mano Fil S.A.</h1>
              <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Plataforma Segura</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Botón PWA */}
            {deferredPrompt && (
              <button 
                onClick={async () => {
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  if (outcome === 'accepted') {
                    setDeferredPrompt(null);
                  }
                }} 
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold tracking-widest uppercase transition-all shadow-lg"
              >
                <Smartphone className="w-4 h-4" /> Instalar App
              </button>
            )}

            <div className="flex items-center gap-3 bg-[#0a0f1d] py-2 px-4 rounded-full border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-white">{user?.email || 'Usuario'}</p>
                <p className="text-[10px] text-amber-500 uppercase tracking-widest">{isSuperAdmin ? 'Súper Admin' : (isEditor ? 'Editor' : 'Lector')}</p>
              </div>
            </div>
            <Link
              href="/"
              className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-colors"
              title="Volver al sitio público"
            >
              <Building2 className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => signOut(auth)} 
              className="p-2 hover:bg-red-500/10 text-red-400 rounded-full transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>


      {/* Tabs NAVIGATION */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-white/5" role="tablist" aria-label="Navegación del Dashboard">
          <div className="flex gap-8 px-4 md:px-6 min-w-max">
            {isSuperAdmin && (
              <button 
                onClick={() => setActiveTab('analytics')}
                role="tab"
                aria-selected={activeTab === 'analytics'}
                className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Panel General
              </button>
            )}
            
            {(isSuperAdmin || isAlmacen) && (
              <button 
                onClick={() => setActiveTab('orders')}
                role="tab"
                aria-selected={activeTab === 'orders'}
                className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'orders' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'} flex items-center gap-2`}
              >
                <Package className="w-4 h-4" /> 
                Pedidos
                {orders.length > 0 && (
                  <span className="bg-amber-500 text-black px-2 py-0.5 rounded-full text-[10px] ml-1">
                    {orders.length}
                  </span>
                )}
              </button>
            )}

            {(isSuperAdmin || isEditor) && (
              <>
                <button 
                  onClick={() => setActiveTab('files')}
                  role="tab"
                  aria-selected={activeTab === 'files'}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'files' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  Documentos Web
                </button>
                <button 
                  onClick={() => setActiveTab('leads')}
                  role="tab"
                  aria-selected={activeTab === 'leads'}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'leads' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  Prospectos Web
                </button>
                <button 
                  onClick={() => setActiveTab('quote-generator')}
                  role="tab"
                  aria-selected={activeTab === 'quote-generator'}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'quote-generator' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'} flex items-center gap-2`}
                >
                  <FileSignature className="w-4 h-4"/> Crear Cotización
                </button>
                <button 
                  onClick={() => setActiveTab('quotes-history')}
                  role="tab"
                  aria-selected={activeTab === 'quotes-history'}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'quotes-history' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'} flex items-center gap-2`}
                >
                  <FileText className="w-4 h-4"/> Historial Cotizaciones
                </button>
                <button 
                  onClick={() => setActiveTab('catalog')}
                  role="tab"
                  aria-selected={activeTab === 'catalog'}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'catalog' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  Catálogo
                </button>
                <button 
                  onClick={() => setActiveTab('documents')}
                  role="tab"
                  aria-selected={activeTab === 'documents'}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'documents' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'} flex items-center gap-2`}
                >
                  <FileText className="w-4 h-4" /> Oficios
                </button>
              </>
            )}
            {isSuperAdmin && (
              <>
                <button 
                  onClick={() => setActiveTab('users')}
                  role="tab"
                  aria-selected={activeTab === 'users'}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'users' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  Empleados y Permisos
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  role="tab"
                  aria-selected={activeTab === 'settings'}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'settings' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  Configuración
                </button>
                <button 
                  onClick={() => setActiveTab('news')}
                  role="tab"
                  aria-selected={activeTab === 'news'}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'news' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  Noticias (SEO)
                </button>
                <button 
                  onClick={() => setActiveTab('monitor')}
                  role="tab"
                  aria-selected={activeTab === 'monitor'}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'monitor' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  Monitor
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  role="tab"
                  aria-selected={activeTab === 'analytics'}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'analytics' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  Analíticas
                </button>
              </>
            )}
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="max-w-7xl mx-auto px-4 w-full py-12">
             <div className="flex flex-col items-center justify-center opacity-50 mb-8">
               <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
               <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Cargando datos...</p>
             </div>
             <SkeletonTable />
          </div>
        )}

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            leadsCount={leads.length} 
            ordersCount={orders.length} 
            productsCount={products.length} 
          />
        )}
        
        {/* TABS CONTENT: FILES */}
        {activeTab === 'files' && (
          <FilesTab 
            files={files}
            isEditor={isEditor}
            uploading={uploading}
            uploadProgress={uploadProgress}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            handleRenameFile={handleRenameFile}
            handleDeleteFile={handleDeleteFile}
            setPreviewFile={setPreviewFile}
            getFileIcon={getFileIcon}
            formatSize={formatSize}
          />
        )}

        {/* PREVIEWER MODAL */}
        {previewFile && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-5xl flex justify-between items-center mb-4">
              <h3 className="text-white font-medium text-lg">{previewFile.name}</h3>
                  <div className="flex gap-4">
                    <a href={previewFile.url} target="_blank" rel="noopener noreferrer" className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                      <Download className="w-4 h-4"/> Descargar Original
                    </a>
                    <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-white bg-white/10 hover:bg-red-500 p-2 rounded-lg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="w-full max-w-5xl flex-grow bg-[#070b14] rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center relative">
                  {previewFile.type.includes('image') ? (
                    <img src={previewFile.url} alt={previewFile.name} className="max-w-full max-h-[80vh] object-contain" />
                  ) : previewFile.type.includes('pdf') ? (
                    <iframe src={previewFile.url} className="w-full h-full min-h-[80vh] border-0" title={previewFile.name} />
                  ) : (
                    <div className="text-center p-8">
                      <File className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">No hay previsualización disponible para este tipo de archivo.</p>
                      <a href={previewFile.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                        Descargar Archivo
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

        {/* TABS CONTENT: LEADS */}
        {activeTab === 'leads' && (isSuperAdmin || isEditor) && (
          <LeadsTab 
            leads={leads}
            leadSearchTerm={leadSearchTerm}
            setLeadSearchTerm={setLeadSearchTerm}
            exportLeadsToCSV={exportLeadsToCSV}
          />
        )}

        {/* TABS CONTENT: ORDERS (SEGUIMIENTO) */}
        {activeTab === 'orders' && (isSuperAdmin || isEditor || isAlmacen) && (
          <OrdersTab orders={orders} />
        )}

        {/* TABS CONTENT: QUOTE GENERATOR */}
        {activeTab === 'quote-generator' && (isSuperAdmin || isEditor) && (
          <div className="animate-fade-in">
            <div className="mb-12">
              <h2 className="text-3xl font-serif text-white mb-2">Generador de Cotizaciones PDF</h2>
              <p className="text-slate-400">Arma cotizaciones oficiales en hoja membretada y descárgalas al instante.</p>
            </div>
            <QuoteGenerator products={products} userEmail={user?.email || ''} />
          </div>
        )}

        {/* TABS CONTENT: QUOTES HISTORY */}
        {activeTab === 'quotes-history' && (isSuperAdmin || isEditor) && (
          <div className="animate-fade-in">
            <QuotesHistoryManager />
          </div>
        )}

        {/* Tab: Oficios */}
        {activeTab === 'documents' && (isSuperAdmin || isEditor) && (
          <div className="animate-fade-in">
            <OfficialDocumentsManager 
              isEditor={isEditor} 
              isSuperAdmin={isSuperAdmin}
              userEmail={user?.email || ''} 
            />
          </div>
        )}

        {/* TABS CONTENT: USERS (PERMISOS) */}
        {activeTab === 'users' && isSuperAdmin && (
          <div>
            <div className="mb-12">
              <h2 className="text-3xl font-serif text-white mb-2">Control de Privilegios</h2>
              <p className="text-slate-400">Asigna permisos por día, mes o ilimitados a tus empleados.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Formulario */}
              <div className="lg:col-span-1 bg-[#0a0f1d] border border-white/10 p-6 rounded-3xl">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-amber-500"/> Otorgar Permiso</h3>
                <form onSubmit={handleAddPrivilege} className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Correo del Empleado</label>
                    <input type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" placeholder="empleado@gmail.com"/>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Nivel de Acceso</label>
                    <select value={newRole} onChange={e=>setNewRole(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none appearance-none">
                      <option value="lector" className="text-black">Lector (Solo Descargar)</option>
                      <option value="editor" className="text-black">Editor (Subir, Borrar, Modificar)</option>
                      <option value="almacen" className="text-black">Almacén (Solo Ver Pedidos)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Expiración</label>
                    <select value={expireHours} onChange={e=>setExpireHours(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none appearance-none">
                      <option value="0" className="text-black">Ilimitado (No expira)</option>
                      <option value="24" className="text-black">1 Día (24 Horas)</option>
                      <option value="168" className="text-black">1 Semana</option>
                      <option value="720" className="text-black">1 Mes (30 Días)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-xs transition-colors">Guardar Privilegio</button>
                </form>
              </div>

              {/* Lista */}
              <div className="lg:col-span-2 space-y-4">
                {privileges.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-slate-500">
                    No has otorgado privilegios especiales aún.
                  </div>
                ) : (
                  privileges.map(priv => {
                    const isExpired = priv.expiresAt && priv.expiresAt.toDate() < new Date();
                    return (
                      <div key={priv.id} className={`bg-[#0a0f1d] border ${isExpired ? 'border-red-500/30' : 'border-white/10'} p-5 rounded-2xl flex items-center justify-between`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${priv.role === 'editor' ? 'bg-amber-500/10 text-amber-500' : priv.role === 'almacen' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {priv.role === 'editor' ? <Upload className="w-5 h-5"/> : priv.role === 'almacen' ? <Package className="w-5 h-5"/> : <Download className="w-5 h-5"/>}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{priv.email}</h4>
                            <div className="flex gap-2 items-center">
                              <span className={`text-[10px] uppercase tracking-widest font-bold ${priv.role === 'editor' ? 'text-amber-500' : priv.role === 'almacen' ? 'text-emerald-500' : 'text-blue-500'}`}>{priv.role}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <Clock className="w-4 h-4"/>
                            {priv.expiresAt 
                              ? (isExpired ? <span className="text-red-500 font-bold">¡Expirado!</span> : `Expira: ${priv.expiresAt.toDate().toLocaleDateString('es-MX')} ${priv.expiresAt.toDate().toLocaleTimeString('es-MX', {hour:'2-digit', minute:'2-digit'})}`) 
                              : 'Ilimitado'}
                          </div>
                          <button onClick={() => handleDeletePrivilege(priv.email)} className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* TABS CONTENT: CATALOGO */}
        {activeTab === 'catalog' && (isSuperAdmin || isEditor) && (
          <ProductsTab 
            products={products}
            productForm={productForm}
            setProductForm={setProductForm}
            uploading={uploading}
            productImgRef={productImgRef}
            handleProductUpload={handleProductUpload}
            handleDeleteProduct={handleDeleteProduct}
            exportCatalogPDF={exportCatalogPDF}
          />
        )}

        {activeTab === 'settings' && isSuperAdmin && (
          <SystemSettings />
        )}

        {activeTab === 'news' && isSuperAdmin && (
          <NewsManager />
        )}

        {activeTab === 'monitor' && isSuperAdmin && (
          <SystemMonitor />
        )}

        <div className="mt-20 pt-8 border-t border-slate-800 flex justify-center pb-8">
          <div className="flex items-center gap-4 text-[10px] text-slate-600 font-medium tracking-widest uppercase">
            <span>Mano Fil S.A. &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
