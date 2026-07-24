import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, FileText, MousePointerClick } from 'lucide-react';

const mockDataTraffic = [
  { name: 'Lun', visitas: 400 },
  { name: 'Mar', visitas: 300 },
  { name: 'Mié', visitas: 200 },
  { name: 'Jue', visitas: 278 },
  { name: 'Vie', visitas: 189 },
  { name: 'Sáb', visitas: 239 },
  { name: 'Dom', visitas: 349 },
];

const mockDataDivisions = [
  { name: 'Textil', clicks: 400 },
  { name: 'Inmobiliaria', clicks: 300 },
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Panel de Analíticas</h2>
        <p className="text-slate-400 text-sm">Resumen de tráfico y conversiones. <span className="text-amber-500 font-medium">Nota:</span> Google Analytics 4 (GA4) está activo recolectando datos. Para visualizar métricas reales en vivo aquí, se requiere vincular la API de Google Analytics o BigQuery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a0f1d] border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Visitas Semanales</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-white font-mono">1,955</p>
          <p className="text-xs text-green-500 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% vs sem. pasada</p>
        </div>
        <div className="bg-[#0a0f1d] border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Cotizaciones Generadas</h3>
            <FileText className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-white font-mono">34</p>
          <p className="text-xs text-green-500 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +5% este mes</p>
        </div>
        <div className="bg-[#0a0f1d] border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Tasa de Rebote</h3>
            <MousePointerClick className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-black text-white font-mono">32%</p>
          <p className="text-xs text-slate-500 mt-2">Promedio 2.4 min/sesión</p>
        </div>
        <div className="bg-[#0a0f1d] border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Módulo Estrella</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-xl font-bold text-white">División Textil</p>
          <p className="text-xs text-slate-500 mt-2">57% del tráfico total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a0f1d] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Tráfico Semanal (Simulado)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDataTraffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="visitas" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0a0f1d] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Interacción por División</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDataDivisions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                <Bar dataKey="clicks" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
