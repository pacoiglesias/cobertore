import React from 'react';
import { FileText, Plus, Clock, Trash2 } from 'lucide-react';
import { Timestamp, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

interface Order {
  id: string;
  folio: string;
  clientName: string;
  status: 'Cotizado' | 'En Producción' | 'Listo para Carga' | 'Entregado' | 'Cancelado' | 'Abandonado';
  updatedAt: Timestamp;
}

interface OrdersTabProps {
  orders: Order[];
}

export function OrdersTab({ orders }: OrdersTabProps) {
  const handleCreateOrder = async () => {
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
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await setDoc(doc(db, 'orders', orderId), { status: newStatus, updatedAt: Timestamp.now() }, { merge: true });
  };

  const handleDeleteOrder = async (orderId: string) => {
    if(confirm('¿Eliminar este pedido del rastreo?')) {
      await deleteDoc(doc(db, 'orders', orderId));
    }
  };

  return (
    <div>
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Control de Pedidos (Tracking)</h2>
          <p className="text-slate-400">Actualiza el estatus de las cotizaciones para que el cliente lo consulte en la web.</p>
        </div>
        <button 
          onClick={handleCreateOrder}
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
                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
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
              <button onClick={() => handleDeleteOrder(order.id)} className="text-red-500 hover:text-red-400 p-2">
                <Trash2 className="w-4 h-4"/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
