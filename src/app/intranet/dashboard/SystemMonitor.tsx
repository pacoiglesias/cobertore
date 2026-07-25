import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap, RefreshCw, CheckCircle, AlertCircle, Trash2, Wifi, WifiOff } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { logger } from '../../../lib/logger';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export default function SystemMonitor() {
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'error'>('checking');
  const [latency, setLatency] = useState<number | null>(null);
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairSuccess, setRepairSuccess] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Comprobar variables de entorno
  const envVars = [
    { name: 'API Key', valid: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY },
    { name: 'Auth Domain', valid: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN },
    { name: 'Project ID', valid: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID },
    { name: 'Storage Bucket', valid: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET },
  ];

  const checkConnection = async () => {
    setDbStatus('checking');
    const start = performance.now();
    try {
      const testRef = doc(db, 'system_settings', 'global');
      await getDoc(testRef);
      const end = performance.now();
      setLatency(Math.round(end - start));
      setDbStatus('online');
    } catch (error) {
      logger.error("Connection check failed:", error);
      setDbStatus('error');
    }
  };

  useEffect(() => {
    checkConnection();
    // Re-check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRepair = () => {
    setShowConfirm(true);
  };

  const executeRepair = () => {
    setShowConfirm(false);
    setIsRepairing(true);
    setRepairSuccess('');

    // 1. Limpiar localStorage (sesiones trabadas, cachés)
    localStorage.clear();
    sessionStorage.clear();

    // 2. Limpiar Service Workers si hay PWA trabada
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
        }
      });
    }

    setTimeout(() => {
      setRepairSuccess('Cachés limpiados. Reconectando sistema...');
      setTimeout(() => {
        // Recargar limpiamente
        window.location.reload();
      }, 1500);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Activity className="w-6 h-6 text-emerald-500" />
            Monitor del Sistema
          </h2>
          <p className="text-slate-400 mt-1">Supervisión en tiempo real de Firebase y entorno</p>
        </div>
        <button 
          onClick={checkConnection}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-3 rounded-full transition-colors"
          title="Actualizar métricas"
        >
          <RefreshCw className={`w-5 h-5 ${dbStatus === 'checking' ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Conexión a Base de Datos */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 backdrop-blur-xl flex flex-col items-center justify-center text-center">
          {dbStatus === 'checking' ? (
            <RefreshCw className="w-16 h-16 text-slate-500 animate-spin mb-4" />
          ) : dbStatus === 'online' ? (
            <Wifi className="w-16 h-16 text-emerald-500 mb-4" />
          ) : (
            <WifiOff className="w-16 h-16 text-red-500 mb-4" />
          )}
          
          <h3 className="text-xl font-bold text-white mb-2">Conexión a Firestore</h3>
          {dbStatus === 'checking' && <p className="text-slate-400">Verificando conexión...</p>}
          {dbStatus === 'online' && (
            <>
              <p className="text-emerald-400 font-medium bg-emerald-400/10 px-4 py-1 rounded-full text-sm inline-block mb-3">En Línea</p>
              <p className="text-slate-400 text-sm">Latencia: <strong className="text-white">{latency}ms</strong></p>
            </>
          )}
          {dbStatus === 'error' && (
            <p className="text-red-400 font-medium bg-red-400/10 px-4 py-1 rounded-full text-sm inline-block">Sin Conexión o Error de Permisos</p>
          )}
        </div>

        {/* Variables de Entorno */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" /> Entorno de Seguridad
          </h3>
          <ul className="space-y-3">
            {envVars.map((env, idx) => (
              <li key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-300 text-sm font-medium">{env.name}</span>
                {env.valid ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </li>
            ))}
          </ul>
          {!envVars.every(e => e.valid) && (
            <p className="text-red-400 text-xs mt-4">Faltan variables críticas. La app no funcionará correctamente.</p>
          )}
        </div>
      </div>

      {/* Acciones de Reparación */}
      <div className="bg-amber-500/10 p-8 rounded-3xl border border-amber-500/20 backdrop-blur-xl">
        <div className="flex items-start gap-6">
          <div className="bg-amber-500/20 p-4 rounded-full">
            <Zap className="w-8 h-8 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-amber-500 mb-2">Reparación de Emergencia</h3>
            <p className="text-amber-500/80 text-sm mb-6">
              Si la página se queda congelada, no cargan los datos, o tienes problemas para ver actualizaciones, usa esta herramienta. 
              Borrará los cachés temporales de tu navegador web y forzará una descarga limpia de la base de datos de Firebase.
            </p>
            
            <button 
              onClick={handleRepair}
              disabled={isRepairing}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isRepairing ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> Reparando sistema...</>
              ) : (
                <><Trash2 className="w-5 h-5" /> Sincronizar y Reparar (Borrar Caché)</>
              )}
            </button>

            {repairSuccess && (
              <p className="mt-4 text-emerald-400 text-sm font-medium animate-pulse">
                {repairSuccess}
              </p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="¿Limpiar cachés y reparar sistema?"
        message="Esta acción borrará los datos temporales del navegador y forzará una resincronización. Tu sesión podría cerrarse."
        confirmLabel="Sí, reparar"
        cancelLabel="Cancelar"
        variant="warning"
        onConfirm={executeRepair}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
