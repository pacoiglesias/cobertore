import React, { useState, useEffect, useRef } from 'react';
import { Newspaper, Trash2, CheckCircle, Clock, Rss, RefreshCw } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { db, storage, functions } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { logger } from '../../../lib/logger';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  body: string;
  imgUrl: string;
  storagePath: string;
  createdAt: Timestamp;
}

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [syncingRss, setSyncingRss] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    body: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setNews(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as NewsItem[]);
    }, (err) => { logger.error('Error en listener de noticias:', err); });
    return () => unsub();
  }, []);

  const handleSyncRss = async () => {
    setSyncingRss(true);
    try {
      const triggerNewsFetch = httpsCallable<unknown, { sourcesChecked: number; itemsImported: number }>(functions, 'triggerNewsFetch');
      const result = await triggerNewsFetch();
      const { sourcesChecked, itemsImported } = result.data;
      if (sourcesChecked === 0) {
        toast.error('No hay fuentes RSS activas configuradas.');
      } else if (itemsImported === 0) {
        toast.success(`Revisadas ${sourcesChecked} fuentes, sin noticias nuevas por ahora.`);
      } else {
        toast.success(`${itemsImported} noticia(s) nueva(s) importada(s) de ${sourcesChecked} fuente(s).`);
      }
    } catch (error) {
      logger.error(error);
      toast.error('No se pudo actualizar el RSS. Revisa la consola de Firebase Functions.');
    } finally {
      setSyncingRss(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgRef.current?.files?.[0]) {
      toast.error("Selecciona una imagen para la noticia.");
      return;
    }
    
    setUploading(true);
    try {
      const file = imgRef.current.files[0];
      const storagePath = `news/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'news'), {
        ...form,
        imgUrl: url,
        storagePath: storagePath,
        createdAt: Timestamp.now()
      });

      toast.success("Noticia publicada exitosamente.");
      setForm({ title: '', summary: '', body: '' });
      imgRef.current.value = '';
    } catch (error) {
      logger.error(error);
      toast.error("Error al publicar la noticia.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!confirm('¿Borrar esta noticia permanentemente?')) return;
    try {
      if (storagePath) {
        try {
          await deleteObject(ref(storage, storagePath));
        } catch (e) {
          logger.warn("Image not found in storage or already deleted", e);
        }
      }
      await deleteDoc(doc(db, 'news', id));
      toast.success("Noticia eliminada.");
    } catch (error) {
      logger.error(error);
      toast.error("Error al eliminar la noticia.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-amber-500" />
            Publicar Noticias (SEO)
          </h2>
          <p className="text-slate-400 mt-1">Sube contenido vivo para posicionar mejor en Google.</p>
        </div>
        <button
          onClick={handleSyncRss}
          disabled={syncingRss}
          className="flex items-center gap-2 bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-amber-500 font-bold py-3 px-5 rounded-xl uppercase tracking-widest text-xs transition-colors disabled:opacity-50"
          title="Trae noticias nuevas de las fuentes RSS activas ahora mismo, sin esperar al corte automático de 6 horas"
        >
          {syncingRss ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rss className="w-4 h-4" />}
          {syncingRss ? 'Actualizando...' : 'Actualizar RSS ahora'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl h-fit">
          <h3 className="text-lg font-bold text-white mb-4">Nueva Publicación</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Título Atractivo (SEO)</label>
              <input type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" placeholder="Ej: Nuevo Cobertor King Size..."/>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Resumen Breve</label>
              <textarea value={form.summary} onChange={e=>setForm({...form, summary: e.target.value})} required rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" placeholder="De qué trata el artículo..."/>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Contenido (Párrafos)</label>
              <textarea value={form.body} onChange={e=>setForm({...form, body: e.target.value})} required rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" placeholder="Escribe aquí toda la noticia..."/>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">Foto Portada</label>
              <input type="file" ref={imgRef} accept="image/*" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-slate-400 text-sm outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500 hover:file:text-white transition-all"/>
            </div>
            <button type="submit" disabled={uploading} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {uploading ? 'Publicando...' : <><CheckCircle className="w-4 h-4"/> Publicar</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {news.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-3xl text-slate-500 bg-slate-900/20">
              <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-slate-400 mb-1">Aún no hay noticias</h3>
              <p className="text-sm">Empieza a publicar para que Google te encuentre más rápido.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {news.map(n => (
                <div key={n.id} className="bg-slate-900/50 border border-white/5 p-4 rounded-3xl flex flex-col hover:border-amber-500/30 transition-all group overflow-hidden relative">
                  <img src={n.imgUrl} alt={n.title} className="w-full h-32 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-500" />
                  <h3 className="text-white font-bold mb-1 leading-tight">{n.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{n.summary}</p>
                  <div className="mt-auto flex justify-between items-center pt-3 border-t border-white/5">
                    <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {n.createdAt?.toDate().toLocaleDateString()}
                    </span>
                    <button onClick={() => handleDelete(n.id, n.storagePath)} className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Borrar Noticia">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
