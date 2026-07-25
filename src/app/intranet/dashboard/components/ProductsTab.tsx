import React from 'react';
import { ImageIcon, Package, Trash2, Download } from 'lucide-react';

interface CatalogProduct {
  id: string;
  title: string;
  weight: string;
  desc: string;
  measures: string;
  composition: string;
  imgUrl: string;
  storagePath: string;
}

interface ProductsTabProps {
  products: CatalogProduct[];
  productForm: any;
  setProductForm: React.Dispatch<React.SetStateAction<any>>;
  uploading: boolean;
  productImgRef: React.RefObject<HTMLInputElement | null>;
  handleProductUpload: (e: React.FormEvent) => Promise<void>;
  handleDeleteProduct: (id: string, path: string) => Promise<void>;
  exportCatalogPDF: () => void;
}

export function ProductsTab({
  products,
  productForm,
  setProductForm,
  uploading,
  productImgRef,
  handleProductUpload,
  handleDeleteProduct,
  exportCatalogPDF
}: ProductsTabProps) {
  return (
    <div>
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Gestión del Catálogo</h2>
          <p className="text-slate-400">Sube cobertores para que aparezcan en la página pública.</p>
        </div>
        {products.length > 0 && (
          <button
            onClick={exportCatalogPDF}
            className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Exportar Catálogo PDF
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1 bg-[#0a0f1d] border border-white/10 p-6 rounded-3xl self-start">
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
              <p className="text-slate-400 max-w-md mx-auto mb-6">
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
  );
}
