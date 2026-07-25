import React from 'react';
import { Upload, Loader2, Edit, Trash2, Eye, Download } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

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

interface FilesTabProps {
  files: IntranetFile[];
  isEditor: boolean;
  uploading: boolean;
  uploadProgress: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRenameFile: (id: string, currentName: string) => void;
  handleDeleteFile: (id: string, storagePath: string) => void;
  setPreviewFile: (file: IntranetFile | null) => void;
  getFileIcon: (type: string) => React.ReactNode;
  formatSize: (bytes: number) => string;
}

export function FilesTab({
  files,
  isEditor,
  uploading,
  uploadProgress,
  fileInputRef,
  handleFileUpload,
  handleRenameFile,
  handleDeleteFile,
  setPreviewFile,
  getFileIcon,
  formatSize
}: FilesTabProps) {
  return (
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
    </div>
  );
}
