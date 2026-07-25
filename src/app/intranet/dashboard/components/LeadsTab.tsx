import React from 'react';
import { User as UserIcon, MessageSquare, Phone, Download } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface Lead {
  id: string;
  name: string;
  phone: string;
  quantity: string;
  message: string;
  createdAt: Timestamp;
}

interface LeadsTabProps {
  leads: Lead[];
  leadSearchTerm: string;
  setLeadSearchTerm: (val: string) => void;
  exportLeadsToCSV: () => void;
}

export function LeadsTab({
  leads,
  leadSearchTerm,
  setLeadSearchTerm,
  exportLeadsToCSV
}: LeadsTabProps) {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Prospectos de Ventas (Leads)</h2>
          <p className="text-slate-400">Mensajes recibidos desde el formulario de la página principal.</p>
        </div>
        <button 
          onClick={exportLeadsToCSV}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Exportar a CSV
        </button>
      </div>
      
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Buscar prospectos por nombre, teléfono o mensaje..." 
          value={leadSearchTerm}
          onChange={(e) => setLeadSearchTerm(e.target.value)}
          className="w-full bg-[#0a0f1d] border border-white/10 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition-colors"
        />
      </div>

      <div className="space-y-4">
        {leads.length === 0 && (
          <div className="text-center py-12 bg-[#0a0f1d] border border-white/5 rounded-2xl">
            <p className="text-slate-400">Aún no hay prospectos registrados.</p>
          </div>
        )}
        {leads.filter(lead => 
          (lead.name || '').toLowerCase().includes(leadSearchTerm.toLowerCase()) || 
          (lead.message || '').toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
          (lead.phone || '').includes(leadSearchTerm)
        ).map(lead => (
          <div key={lead.id} className="bg-[#0a0f1d] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-amber-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <UserIcon className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">{lead.name || 'Sin nombre'}</h3>
                <div className="flex items-center gap-4 text-slate-400 text-sm mt-1">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-grow md:mx-8 bg-white/5 p-4 rounded-xl relative">
              <MessageSquare className="w-4 h-4 text-amber-500 absolute top-4 left-4" />
              <p className="text-slate-300 text-sm pl-8 italic">"{lead.message}"</p>
              <div className="pl-8 mt-2 text-xs font-bold text-emerald-500">Cantidad solicitada: {lead.quantity}</div>
            </div>
            
            <div className="text-right whitespace-nowrap">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-1">Recibido</span>
              <span className="text-amber-500 font-medium">
                {lead.createdAt?.toDate().toLocaleDateString('es-MX')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
