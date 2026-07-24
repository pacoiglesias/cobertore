'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, Timestamp, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../../../lib/firebase';
import { LogOut, FileText, Download, Shield, Building2, User as UserIcon, Upload, Trash2, Image as ImageIcon, File, Loader2, Users, MessageSquare, Clock, Edit, Eye, X, Globe, FileSignature, Smartphone, Plus, Package } from 'lucide-react';
import Link from 'next/link';
import { QuoteGenerator } from './QuoteGenerator';
import OfficialDocumentsManager from './OfficialDocumentsManager';
import SystemSettings from './SystemSettings';
import NewsManager from './NewsManager';
import SystemMonitor from './SystemMonitor';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { BarChart as BarChartIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { logger } from '../../../lib/logger';

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
  role: 'editor' | 'lector';
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
  const [activeTab, setActiveTab] = useState<'files' | 'leads' | 'orders' | 'users' | 'catalog' | 'quote-generator' | 'documents' | 'settings' | 'news' | 'monitor' | 'analytics'>('files');
  
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
  const SUPER_ADMINS = ['paco@cobertores.com', 'paco.iglesias@gmail.com'];
  const isSuperAdmin = user?.email ? SUPER_ADMINS.includes(user.email) : false;
  
  // Check if current user has editor rights via privileges
  const [isEditor, setIsEditor] = useState(false);
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
            if (isNotExpired && privData.role === 'editor') {
              setIsEditor(true);
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
    });

    const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lead[]);
    });

    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CatalogProduct[]);
    });

    const ordersQuery = query(collection(db, 'orders'), orderBy('updatedAt', 'desc'));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]);
    });

    let unsubscribePrivs = () => {};
    if (isSuperAdmin) {
      const privsQuery = collection(db, 'user_privileges');
      unsubscribePrivs = onSnapshot(privsQuery, (snapshot) => {
        setPrivileges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserPrivilege[]);
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
    await signOut(auth);
    router.replace('/intranet');
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon className="w-6 h-6 text-blue-400 group-hover:text-amber-500 transition-colors" />;
    if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-400 group-hover:text-amber-500 transition-colors" />;
    return <File className="w-6 h-6 text-slate-400 group-hover:text-amber-500 transition-colors" />;
  };

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
    await deleteDoc(doc(db, 'user_privileges', email));
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

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

      {/* Tabs */}
      <div className="border-b border-white/5 bg-[#0a0f1d]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-8">
          <button 
            onClick={() => setActiveTab('files')}
            className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'files' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Repositorio
          </button>
          {(isSuperAdmin || isEditor) && (
            <>
              <button 
                onClick={() => setActiveTab('leads')}
                className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'leads' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Prospectos Web
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'orders' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Seguimiento Pedidos
              </button>
              <button 
                onClick={() => setActiveTab('quote-generator')}
                className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'quote-generator' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'} flex items-center gap-2`}
              >
                <FileSignature className="w-4 h-4"/> Crear Cotización
              </button>
              <button 
                onClick={() => setActiveTab('catalog')}
                className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'catalog' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Catálogo
              </button>
              <button 
                onClick={() => setActiveTab('documents')}
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
                className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'users' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Empleados y Permisos
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'settings' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Configuración
              </button>
              <button 
                onClick={() => setActiveTab('news')}
                className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'news' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Noticias (SEO)
              </button>
              <button 
                onClick={() => setActiveTab('monitor')}
                className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'monitor' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Monitor
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'analytics' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Analíticas
              </button>
            </>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        
        {/* TABS CONTENT: FILES */}
        {activeTab === 'files' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-serif text-white mb-2">Repositorio de Archivos</h2>
                <p className="text-slate-400">Documentos internos y políticas de empresa blindadas.</p>
              </div>
              {isEditor && (
                <div>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> {uploadProgress}</> : <><Upload className="w-4 h-4" /> Subir Archivo Nuevo</>}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <div key={file.id} className="bg-[#0a0f1d] border border-white/5 hover:border-amber-500/30 rounded-2xl p-6 flex flex-col group transition-all relative overflow-hidden shadow-lg">
                  {isEditor && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleRenameFile(file.id, file.name)} className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors" title="Renombrar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteFile(file.id, file.storagePath)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/5">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <h3 className="text-white font-medium mb-1 pr-16 break-words">{file.name}</h3>
                  <div className="text-[10px] text-slate-500 mb-6 flex-grow space-y-1">
                    <p>Subido por: <span className="text-slate-400">{file.uploadedBy}</span></p>
                    <p>{file.createdAt?.toDate().toLocaleDateString('es-MX')} • {file.createdAt?.toDate().toLocaleTimeString('es-MX', {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{formatSize(file.size)}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPreviewFile(file)} className="text-blue-500 hover:text-white p-2 bg-blue-500/10 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase" title="Previsualizar">
                        <Eye className="w-4 h-4" />
                      </button>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-white p-2 bg-amber-500/10 hover:bg-amber-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase" title="Descargar">
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
          </div>
        )}

        {/* TABS CONTENT: LEADS (PROSPECTOS WEB) */}
        {activeTab === 'leads' && (isSuperAdmin || isEditor) && (
          <div>
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-serif text-white mb-2">Prospectos de Cotización (Web)</h2>
                <p className="text-slate-400">Leads capturados desde el formulario de contacto público.</p>
              </div>
              <button 
                onClick={exportLeadsToCSV}
                disabled={leads.length === 0}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> Exportar a CSV
              </button>
            </div>
            
            {/* GRÁFICA DE ANALÍTICAS */}
            {leads.length > 0 && (
              <div className="bg-[#0a0f1d] border border-white/5 p-6 rounded-3xl mb-8">
                <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">Volumen de Prospectos Mensual</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={leads.reduce((acc, lead) => {
                        if (!lead.createdAt) return acc;
                        const date = lead.createdAt.toDate();
                        const month = date.toLocaleString('es-MX', { month: 'short', year: 'numeric' }).toUpperCase();
                        const existing = acc.find(item => item.name === month);
                        if (existing) {
                          existing.prospectos += 1;
                        } else {
                          acc.push({ name: month, prospectos: 1 });
                        }
                        return acc;
                      }, [] as { name: string, prospectos: number }[]).reverse()}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip 
                        cursor={{fill: '#ffffff05'}}
                        contentStyle={{ backgroundColor: '#070b14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                        itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="prospectos" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {leads.length === 0 && (
                <div className="p-16 text-center border-2 border-dashed border-white/5 bg-slate-900/20 rounded-3xl">
                  <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Sin prospectos web</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Los contactos que llenen el formulario en la página pública aparecerán aquí automáticamente para que puedas darles seguimiento.
                  </p>
                </div>
              )}
              {leads.map(lead => (
                <div key={lead.id} className="bg-[#0a0f1d] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <MessageSquare className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">{lead.name}</h4>
                      <p className="text-slate-400 text-sm">{lead.phone}</p>
                    </div>
                  </div>
                  <div className="flex-grow md:text-center">
                    <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">Volumen</span>
                    <span className="text-amber-500 font-bold">{lead.quantity}</span>
                  </div>
                  <div className="max-w-md text-sm text-slate-300 italic border-l border-white/10 pl-4 py-2">
                    "{lead.message}"
                  </div>
                  <div className="text-right text-[10px] text-slate-500 uppercase font-bold tracking-widest shrink-0">
                    {lead.createdAt?.toDate().toLocaleDateString('es-MX')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABS CONTENT: ORDERS (SEGUIMIENTO) */}
        {activeTab === 'orders' && (isSuperAdmin || isEditor) && (
          <div>
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-serif text-white mb-2">Control de Pedidos (Tracking)</h2>
                <p className="text-slate-400">Actualiza el estatus de las cotizaciones para que el cliente lo consulte en la web.</p>
              </div>
              <button 
                onClick={async () => {
                  const folio = prompt("Ingresa el Folio de la Cotización (ej. COT-12345):");
                  if (!folio) return;
                  const client = prompt("Nombre del Cliente:");
                  if (!client) return;
                  const finalFolio = folio.toUpperCase().trim();
                  await setDoc(doc(db, 'orders', finalFolio), {
                    folio: finalFolio,
                    clientName: client,
                    status: 'Cotizado',
                    updatedAt: Timestamp.now()
                  });
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Registrar Nuevo Pedido
              </button>
            </div>
            
            <div className="space-y-4">
              {orders.length === 0 && (
                <div className="p-16 text-center border-2 border-dashed border-white/5 bg-slate-900/20 rounded-3xl">
                  <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Aún no hay pedidos</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    No tienes ningún pedido registrado en el sistema. Haz clic en "Registrar Nuevo Pedido" para comenzar el seguimiento.
                  </p>
                </div>
              )}
              {orders.map(order => (
                <div key={order.id} className="bg-[#0a0f1d] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                      <Clock className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{order.folio}</h4>
                      <p className="text-slate-400 text-sm">{order.clientName}</p>
                    </div>
                  </div>
                  
                  <div className="flex-grow flex items-center gap-4">
                    <select
                      value={order.status}
                      onChange={async (e) => {
                        await setDoc(doc(db, 'orders', order.id), { status: e.target.value, updatedAt: Timestamp.now() }, { merge: true });
                      }}
                      className="bg-[#070b14] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none w-48"
                    >
                      <option value="Cotizado">Cotizado (En Espera)</option>
                      <option value="En Producción">En Producción</option>
                      <option value="Listo para Carga">Listo para Carga</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Cancelado">Cancelado</option>
                      <option value="Abandonado">Abandonado / No Responde</option>
                    </select>
                  </div>
                  
                  <div className="text-right text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-4">
                    <span>Actualizado: {order.updatedAt?.toDate().toLocaleDateString('es-MX')}</span>
                    <button onClick={async () => {
                      if(confirm('¿Eliminar este pedido del rastreo?')) await deleteDoc(doc(db, 'orders', order.id));
                    }} className="text-red-500 hover:text-red-400 p-2">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${priv.role === 'editor' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {priv.role === 'editor' ? <Upload className="w-5 h-5"/> : <Download className="w-5 h-5"/>}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{priv.email}</h4>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Rol: {priv.role}</p>
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
          <div>
            <div className="mb-12">
              <h2 className="text-3xl font-serif text-white mb-2">Gestión del Catálogo</h2>
              <p className="text-slate-400">Sube cobertores para que aparezcan en la página pública.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Formulario */}
              <div className="lg:col-span-1 bg-[#0a0f1d] border border-white/10 p-6 rounded-3xl">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-amber-500"/> Subir Producto</h3>
                <form onSubmit={handleProductUpload} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Nombre del Producto</label>
                    <input type="text" value={productForm.title} onChange={e=>setProductForm({...productForm, title: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" placeholder="Ej. Tilma Ecológica"/>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Etiqueta/Peso</label>
                    <input type="text" value={productForm.weight} onChange={e=>setProductForm({...productForm, weight: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" placeholder="Ej. 1.5 kg"/>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Descripción</label>
                    <textarea value={productForm.desc} onChange={e=>setProductForm({...productForm, desc: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" placeholder="Descripción corta..."></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Medidas</label>
                      <input type="text" value={productForm.measures} onChange={e=>setProductForm({...productForm, measures: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" placeholder="2m x 1.50m"/>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Composición</label>
                      <input type="text" value={productForm.composition} onChange={e=>setProductForm({...productForm, composition: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" placeholder="100% Acrílico"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Foto (Requerida)</label>
                    <input type="file" ref={productImgRef} accept="image/*" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-slate-400 text-sm outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500 hover:file:text-white transition-all"/>
                  </div>
                  <button type="submit" disabled={uploading} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-xs transition-colors disabled:opacity-50">
                    {uploading ? 'Subiendo...' : 'Publicar Producto'}
                  </button>
                </form>
              </div>

              {/* Lista */}
              <div className="lg:col-span-2 space-y-4">
                {products.length === 0 ? (
                  <div className="p-16 text-center border-2 border-dashed border-white/5 bg-slate-900/20 rounded-3xl h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Catálogo Vacío</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      Agrega tu primer producto en el panel izquierdo para que los clientes puedan verlo en la página pública.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {products.map(product => (
                      <div key={product.id} className="bg-[#0a0f1d] border border-white/10 p-4 rounded-2xl flex gap-4 hover:border-amber-500/30 transition-colors">
                        <img src={product.imgUrl} alt={product.title} className="w-24 h-24 object-cover rounded-xl" />
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="text-white font-medium">{product.title}</h4>
                            <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">{product.weight}</p>
                          </div>
                          <div className="text-right">
                            <button onClick={() => handleDeleteProduct(product.id, product.storagePath)} className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Borrar">
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
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
