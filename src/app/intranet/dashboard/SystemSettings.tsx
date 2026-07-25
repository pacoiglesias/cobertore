import React, { useState, useEffect } from 'react';
import { Settings, Upload, Image as ImageIcon, CheckCircle, AlertCircle, Search, Rss, Plus, Trash2, Shield, Landmark } from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ManoFilLogo } from '@/components/ManoFilLogo';
import { logger } from '../../../lib/logger';

type RssSource = {
  id: string;
  name: string;
  url: string;
  active: boolean;
};

export default function SystemSettings() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // SEO States
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isSavingSeo, setIsSavingSeo] = useState(false);
  const [seoSuccessMsg, setSeoSuccessMsg] = useState('');

  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankClabe, setBankClabe] = useState('');
  const [bankRfc, setBankRfc] = useState('');
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [bankSuccessMsg, setBankSuccessMsg] = useState('');

  // RSS States
  const [rssSources, setRssSources] = useState<RssSource[]>([]);
  const [newRssName, setNewRssName] = useState('');
  const [newRssUrl, setNewRssUrl] = useState('');
  const [isSavingRss, setIsSavingRss] = useState(false);
  const [rssSuccessMsg, setRssSuccessMsg] = useState('');
  const [rssItemsLimit, setRssItemsLimit] = useState<number>(20);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'system_settings', 'global');
      const docSnap = await getDoc(docRef);
      
      const defaultSources = [
        { id: '1', name: 'Tlaxcala (El Sol)', url: 'https://www.elsoldetlaxcala.com.mx/rss.xml', active: true },
        { id: '2', name: 'Deportes (Vanguardia MX)', url: 'https://vanguardia.com.mx/rss.xml', active: true },
        { id: '3', name: '24 Horas', url: 'https://www.24-horas.mx/feed/', active: true },
      ];
      
      const defaultSeoTitle = 'Cobertores Mano FIL - Distribución Textil y Desarrollo Inmobiliario';
      const defaultSeoDesc = 'Distribución masiva de cobertores, blancos y desarrollos inmobiliarios. Liderazgo corporativo y comercial desde 1962 en Tlaxcala para todo México.';

      // Estos son ejemplos -- si nadie los ha editado en este panel, se
      // muestran así de obvio para que no se confundan con datos reales.
      const defaultBankName = 'Banco de ejemplo (edita este campo)';
      const defaultBankAccount = '0000000000';
      const defaultBankClabe = '000000000000000000';
      const defaultBankRfc = 'RFC000000000';

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.logoUrl) setLogoPreview(data.logoUrl);
        
        setSeoTitle(data.seoTitle !== undefined ? data.seoTitle : defaultSeoTitle);
        setSeoDescription(data.seoDescription !== undefined ? data.seoDescription : defaultSeoDesc);
        setRssSources(data.newsSources !== undefined ? data.newsSources : defaultSources);
        setRssItemsLimit(data.rssItemsLimit !== undefined ? data.rssItemsLimit : 20);
        setBankName(data.bankName !== undefined ? data.bankName : defaultBankName);
        setBankAccount(data.bankAccount !== undefined ? data.bankAccount : defaultBankAccount);
        setBankClabe(data.bankClabe !== undefined ? data.bankClabe : defaultBankClabe);
        setBankRfc(data.bankRfc !== undefined ? data.bankRfc : defaultBankRfc);
      } else {
        setSeoTitle(defaultSeoTitle);
        setSeoDescription(defaultSeoDesc);
        setRssSources(defaultSources);
        setRssItemsLimit(20);
        setBankName(defaultBankName);
        setBankAccount(defaultBankAccount);
        setBankClabe(defaultBankClabe);
        setBankRfc(defaultBankRfc);
      }
    };
    fetchSettings();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setSuccessMsg('');
      setErrorMsg('');
    }
  };

  const handleUpload = async () => {
    if (!logoFile) return;
    setIsUploading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const storageRef = ref(storage, `system_assets/logo_${Date.now()}.png`);
      await uploadBytes(storageRef, logoFile);
      const downloadUrl = await getDownloadURL(storageRef);

      const settingsRef = doc(db, 'system_settings', 'global');
      await setDoc(settingsRef, { logoUrl: downloadUrl }, { merge: true });

      setSuccessMsg('¡Logo actualizado globalmente con éxito!');
      setLogoFile(null);
    } catch (error) {
      logger.error("Error al subir el logo:", error);
      setErrorMsg('Ocurrió un error al intentar guardar el logo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSeo = async () => {
    setIsSavingSeo(true);
    setSeoSuccessMsg('');
    try {
      const settingsRef = doc(db, 'system_settings', 'global');
      await setDoc(settingsRef, { 
        seoTitle, 
        seoDescription 
      }, { merge: true });
      setSeoSuccessMsg('¡Etiquetas SEO guardadas correctamente!');
      setTimeout(() => setSeoSuccessMsg(''), 3000);
    } catch (error) {
      logger.error("Error guardando SEO:", error);
    } finally {
      setIsSavingSeo(false);
    }
  };

  const handleSaveBank = async () => {
    setIsSavingBank(true);
    setBankSuccessMsg('');
    try {
      const settingsRef = doc(db, 'system_settings', 'global');
      await setDoc(settingsRef, {
        bankName,
        bankAccount,
        bankClabe,
        bankRfc
      }, { merge: true });
      setBankSuccessMsg('¡Datos bancarios guardados! Se verán en la próxima cotización que generes.');
      setTimeout(() => setBankSuccessMsg(''), 4000);
    } catch (error) {
      logger.error("Error guardando datos bancarios:", error);
    } finally {
      setIsSavingBank(false);
    }
  };

  const handleAddRss = () => {
    if (!newRssName || !newRssUrl) return;
    const newSource = {
      id: Date.now().toString(),
      name: newRssName,
      url: newRssUrl,
      active: true
    };
    setRssSources([...rssSources, newSource]);
    setNewRssName('');
    setNewRssUrl('');
  };

  const handleRemoveRss = (id: string) => {
    setRssSources(rssSources.filter(s => s.id !== id));
  };

  const handleToggleRss = (id: string) => {
    setRssSources(rssSources.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleSaveRss = async () => {
    setIsSavingRss(true);
    setRssSuccessMsg('');
    try {
      const settingsRef = doc(db, 'system_settings', 'global');
      await setDoc(settingsRef, { 
        newsSources: rssSources,
        rssItemsLimit: Number(rssItemsLimit)
      }, { merge: true });
      setRssSuccessMsg('¡Fuentes RSS guardadas correctamente!');
      setTimeout(() => setRssSuccessMsg(''), 3000);
    } catch (error) {
      logger.error("Error guardando RSS:", error);
    } finally {
      setIsSavingRss(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings className="w-6 h-6 text-amber-500" />
            Configuración Global
          </h2>
          <p className="text-slate-400 mt-1">Ajustes del sistema (Exclusivo para Super Admin)</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-8 backdrop-blur-xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-amber-500" /> Identidad Corporativa (Logo)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">
              Sube la imagen de tu logotipo. Éste se actualizará automáticamente en todas las cotizaciones, oficios y pantallas del sistema.
            </p>
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 transition-colors rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-900/50 relative overflow-hidden group">
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/svg+xml" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Upload className="w-10 h-10 text-slate-500 group-hover:text-amber-500 mb-4 transition-colors" />
              <p className="text-sm text-slate-300 font-medium">Haz clic o arrastra una imagen aquí</p>
              <p className="text-xs text-slate-500 mt-2">PNG, JPG o SVG (Recomendado: Fondo transparente)</p>
            </div>

            {successMsg && (
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 p-4 rounded-xl border border-green-400/20 text-sm">
                <CheckCircle className="w-5 h-5" /> {successMsg}
              </div>
            )}
            
            {errorMsg && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-sm">
                <AlertCircle className="w-5 h-5" /> {errorMsg}
              </div>
            )}

            <button 
              onClick={handleUpload}
              disabled={!logoFile || isUploading}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
            >
              {isUploading ? 'Guardando...' : 'Guardar y Aplicar Logo'}
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center border border-slate-200 shadow-xl relative min-h-[300px]">
            <p className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Vista Previa Actual</p>
            <div className="w-48 h-48 flex items-center justify-center mt-6">
              {logoPreview ? (
                <img src={logoPreview} alt="Preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <ManoFilLogo className="w-full h-full" showText={false} variant="brand" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-8 backdrop-blur-xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Search className="w-5 h-5 text-amber-500" /> Posicionamiento (SEO Google)
        </h3>
        
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200/80 rounded-2xl p-4 text-xs flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Requiere Publicación Manual</p>
              <p className="mt-1 leading-relaxed">
                Este sitio es un portal estático de alto rendimiento. Las configuraciones de SEO se guardan en la base de datos, pero requieren compilar y redesplegar el sitio desde la terminal con `npm run build && firebase deploy` para que surtan efecto en la web pública.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Título Principal (Meta Title)</label>
            <input 
              type="text" 
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Ej: Cobertores Ultra Suaves y Calientitos | MANO FIL"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <p className="text-xs text-slate-500">Se muestra en la pestaña del navegador y como título azul en Google. Ideal: menos de 60 caracteres.</p>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Descripción (Meta Description)</label>
            <textarea 
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Ej: Descubre la colección de cobertores..."
              rows={3}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
            />
            <p className="text-xs text-slate-500">El texto gris que aparece bajo el título en Google. Ideal: entre 120 y 155 caracteres.</p>
          </div>

          {seoSuccessMsg && (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 p-4 rounded-xl border border-green-400/20 text-sm">
              <CheckCircle className="w-5 h-5" /> {seoSuccessMsg}
            </div>
          )}

          <button 
            onClick={handleSaveSeo}
            disabled={isSavingSeo}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isSavingSeo ? 'Guardando SEO...' : 'Guardar Configuración SEO'}
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-8 backdrop-blur-xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-amber-500" /> Datos Bancarios (Cotizaciones)
        </h3>

        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200/80 rounded-2xl p-4 text-xs flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Estos datos aparecen en el PDF de cada cotización</p>
              <p className="mt-1 leading-relaxed">
                Antes estaban fijos en el código como ejemplo. Ahora los editas aquí y se guardan
                de inmediato en la base de datos -- no necesitas volver a compilar ni desplegar
                el sitio para que la siguiente cotización que generes ya los use.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Banco</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Ej: BBVA Bancomer"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">RFC</label>
              <input
                type="text"
                value={bankRfc}
                onChange={(e) => setBankRfc(e.target.value)}
                placeholder="Ej: MFI6212158B4"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Número de cuenta</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="Ej: 0123456789"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">CLABE interbancaria</label>
              <input
                type="text"
                value={bankClabe}
                onChange={(e) => setBankClabe(e.target.value)}
                placeholder="Ej: 012345678901234567"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {bankSuccessMsg && (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 p-4 rounded-xl border border-green-400/20 text-sm">
              <CheckCircle className="w-5 h-5" /> {bankSuccessMsg}
            </div>
          )}

          <button
            onClick={handleSaveBank}
            disabled={isSavingBank}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isSavingBank ? 'Guardando...' : 'Guardar Datos Bancarios'}
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-8 backdrop-blur-xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Rss className="w-5 h-5 text-amber-500" /> Fuentes de Noticias (Importación Automática)
        </h3>
        
        <div className="space-y-6">
          <p className="text-slate-400 text-sm">Agrega las URLs de los feeds RSS de donde quieres extraer las noticias automáticamente. El robot las procesará cada hora.</p>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-slate-300 text-sm font-medium">Categoría/Nombre</label>
              <input 
                type="text" 
                value={newRssName}
                onChange={(e) => setNewRssName(e.target.value)}
                placeholder="Ej: Deportes ESPN"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex-[2] space-y-2">
              <label className="text-slate-300 text-sm font-medium">URL del Feed RSS</label>
              <input 
                type="text" 
                value={newRssUrl}
                onChange={(e) => setNewRssUrl(e.target.value)}
                placeholder="https://www.dominio.com/rss.xml"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button 
              onClick={handleAddRss}
              disabled={!newRssName || !newRssUrl}
              className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl border border-slate-700 transition-colors disabled:opacity-50 mb-[2px]"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 bg-slate-800/30 rounded-2xl border border-slate-700 overflow-hidden">
            {rssSources.length === 0 ? (
              <p className="text-center text-slate-500 py-6 text-sm">No hay fuentes configuradas.</p>
            ) : (
              <ul className="divide-y divide-slate-700/50">
                {rssSources.map((source) => (
                  <li key={source.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleToggleRss(source.id)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${source.active ? 'bg-amber-500' : 'bg-slate-700'}`}
                      >
                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${source.active ? 'translate-x-6' : 'translate-x-0'}`}></span>
                      </button>
                      <div>
                        <p className="text-white font-medium text-sm flex items-center gap-2">
                          {source.name} {!source.active && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Inactivo</span>}
                        </p>
                        <p className="text-slate-500 text-xs">{source.url}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveRss(source.id)}
                      className="text-slate-500 hover:text-red-400 p-2 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between bg-slate-800/30 rounded-2xl border border-slate-700 p-4">
            <div>
              <p className="text-white font-medium text-sm">Límite de noticias por fuente</p>
              <p className="text-slate-500 text-xs mt-1">Cuántas noticias descargar de cada sitio (máximo 50).</p>
            </div>
            <input 
              type="number" 
              min="1" 
              max="50"
              value={rssItemsLimit}
              onChange={(e) => setRssItemsLimit(parseInt(e.target.value) || 20)}
              className="w-24 bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors text-center font-bold"
            />
          </div>

          {rssSuccessMsg && (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 p-4 rounded-xl border border-green-400/20 text-sm mt-4">
              <CheckCircle className="w-5 h-5" /> {rssSuccessMsg}
            </div>
          )}

          <button 
            onClick={handleSaveRss}
            disabled={isSavingRss}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4"
          >
            {isSavingRss ? 'Guardando...' : 'Guardar Fuentes RSS'}
          </button>
        </div>
      </div>
    </div>
  );
}

