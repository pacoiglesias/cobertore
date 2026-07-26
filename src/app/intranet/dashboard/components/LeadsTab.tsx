import React from 'react';
import { User as UserIcon, MessageSquare, Phone, Download, Clock, CheckCircle, CheckSquare, Inbox, Edit, Trash2, Smartphone } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface Lead {
  id: string;
  name: string;
  phone: string;
  quantity: string;
  message: string;
  createdAt: Timestamp;
  status?: string;
}

interface LeadsTabProps {
  leads: Lead[];
  leadSearchTerm: string;
  setLeadSearchTerm: (val: string) => void;
  exportLeadsToCSV: () => void;
  updateLeadStatus?: (id: string, status: string) => void;
  deleteLead?: (id: string) => void;
  editLead?: (id: string, data: any) => void;
}

const CRM_COLUMNS = [
  { id: 'nuevo', title: 'Nuevos', icon: Inbox, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'contactado', title: 'Contactados', icon: Phone, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 'cotizado', title: 'Cotizados', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'cerrado', title: 'Cerrados', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' }
];

export function LeadsTab({
  leads,
  leadSearchTerm,
  setLeadSearchTerm,
  exportLeadsToCSV,
  updateLeadStatus,
  deleteLead,
  editLead
}: LeadsTabProps) {
  
  const filteredLeads = leads.filter(lead => 
    (lead.name || '').toLowerCase().includes(leadSearchTerm.toLowerCase()) || 
    (lead.message || '').toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
    (lead.phone || '').includes(leadSearchTerm)
  );

  const getLeadsByStatus = (statusId: string) => {
    return filteredLeads.filter(lead => {
      const s = lead.status || 'nuevo';
      return s === statusId;
    });
  };

  const openWhatsApp = (phone: string, name: string, quantity: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      alert('Número de teléfono inválido (muy corto).');
      return;
    }
    const finalPhone = cleanPhone.length === 10 ? `52${cleanPhone}` : cleanPhone;
    const message = `Hola ${name || ''}, somos de Mano Fil. Recibimos tu cotización web por ${quantity} unidades. ¿En qué te podemos ayudar?`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Cálculos para Estadísticas
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => (l.status || 'nuevo') === 'nuevo').length;
  const closedLeads = leads.filter(l => l.status === 'cerrado').length;
  const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;

  const getNextStatusInfo = (currentStatus: string) => {
    switch (currentStatus || 'nuevo') {
      case 'nuevo': return { nextId: 'contactado', label: 'Marcar Contactado →', color: 'bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white' };
      case 'contactado': return { nextId: 'cotizado', label: 'Avanzar a Cotizado →', color: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white' };
      case 'cotizado': return { nextId: 'cerrado', label: '¡Cerrar Venta! 🎉', color: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' };
      case 'cerrado': return null;
      default: return { nextId: 'contactado', label: 'Contactar →', color: 'bg-amber-500/20 text-amber-500' };
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">CRM de Ventas</h2>
          <p className="text-slate-400">Gestiona los prospectos que llegan desde la página web.</p>
        </div>
        <button 
          onClick={exportLeadsToCSV}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Exportar a CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0a0f1d] border border-white/5 rounded-xl p-4 shadow-lg">
          <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Prospectos</h4>
          <p className="text-2xl font-serif text-white">{totalLeads}</p>
        </div>
        <div className="bg-[#0a0f1d] border border-blue-500/20 rounded-xl p-4 shadow-lg">
          <h4 className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Nuevos Pendientes</h4>
          <p className="text-2xl font-serif text-white">{newLeads}</p>
        </div>
        <div className="bg-[#0a0f1d] border border-emerald-500/20 rounded-xl p-4 shadow-lg">
          <h4 className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ventas Cerradas</h4>
          <p className="text-2xl font-serif text-white">{closedLeads}</p>
        </div>
        <div className="bg-[#0a0f1d] border border-purple-500/20 rounded-xl p-4 shadow-lg">
          <h4 className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-1">Tasa de Cierre</h4>
          <p className="text-2xl font-serif text-white">{conversionRate}%</p>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {CRM_COLUMNS.map(col => {
          const colLeads = getLeadsByStatus(col.id);
          const Icon = col.icon;
          
          return (
            <div key={col.id} className="bg-[#0a0f1d] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 min-h-[500px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${col.bg} ${col.border} border`}>
                    <Icon className={`w-4 h-4 ${col.color}`} />
                  </div>
                  <h3 className="text-white font-bold">{col.title}</h3>
                </div>
                <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {colLeads.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="flex-1 space-y-4">
                {colLeads.length === 0 ? (
                  <div className="text-center p-4 text-sm text-slate-500 italic">
                    Sin prospectos
                  </div>
                ) : (
                  colLeads.map(lead => (
                    <div key={lead.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-500/50 transition-colors relative group">
                      {/* Acciones de Edición/Borrado */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            if (!editLead) return;
                            const newName = prompt('Editar nombre:', lead.name);
                            if (newName === null) return; // Cancelado
                            const newPhone = prompt('Editar teléfono:', lead.phone);
                            if (newPhone === null) return;
                            const newQty = prompt('Editar cantidad:', lead.quantity);
                            if (newQty === null) return;
                            editLead(lead.id, { name: newName, phone: newPhone, quantity: newQty });
                          }}
                          className="p-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md transition-colors"
                          title="Editar prospecto"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => deleteLead && deleteLead(lead.id)}
                          className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                          title="Eliminar prospecto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex justify-between items-start mb-3 pr-14">
                        <h4 className="text-white font-medium text-sm">{lead.name || 'Sin nombre'}</h4>
                        <span className="text-[10px] text-slate-400">
                          {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString('es-MX') : ''}
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-300 mb-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-slate-500" /> 
                          <span className="flex-1">{lead.phone}</span>
                          <button 
                            onClick={() => openWhatsApp(lead.phone, lead.name, lead.quantity)}
                            className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors"
                            title="Abrir Chat"
                          >
                            <Smartphone className="w-3 h-3" /> Chat
                          </button>
                        </div>
                        <p className="flex items-center gap-2"><CheckSquare className="w-3 h-3 text-slate-500" /> Cantidad: <span className="font-bold text-emerald-400">{lead.quantity}</span></p>
                      </div>

                      <div className="bg-[#0a0f1d] rounded-lg p-3 text-xs text-slate-400 mb-4 italic line-clamp-3 relative">
                        <MessageSquare className="w-3 h-3 text-slate-600 absolute top-3 left-3" />
                        <span className="pl-6 block">{lead.message}</span>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex gap-2 items-center">
                        <div className="flex-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1 block">Estado</label>
                          <select 
                            value={lead.status || 'nuevo'}
                            onChange={(e) => updateLeadStatus && updateLeadStatus(lead.id, e.target.value)}
                            className="w-full bg-[#0a0f1d] border border-white/10 rounded-lg p-2 text-white text-xs focus:border-amber-500 outline-none appearance-none"
                          >
                            {CRM_COLUMNS.map(opt => (
                              <option key={opt.id} value={opt.id} className="text-black">{opt.title}</option>
                            ))}
                          </select>
                        </div>
                        
                        {(() => {
                          const next = getNextStatusInfo(lead.status || 'nuevo');
                          if (!next) return null;
                          return (
                            <button
                              onClick={() => updateLeadStatus && updateLeadStatus(lead.id, next.nextId)}
                              className={`mt-4 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${next.color}`}
                              title="Avanzar estado"
                            >
                              {next.label}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
