
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, X, Phone, MapPin, CheckCircle2, Plus } from 'lucide-react';
import { Order, Promotion } from '../types';

interface RestaurantDashboardProps {
  orders: Order[];
  promotions: Promotion[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onUpdatePromotions: (promos: Promotion[]) => void;
  onExit: () => void;
}

const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({ 
  orders, 
  promotions, 
  onUpdateStatus, 
  onUpdatePromotions, 
  onExit 
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'promos'>('orders');
  const [filter, setFilter] = useState<'all' | Order['status']>('all');
  
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  
  const stats = {
    new: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivering: orders.filter(o => o.status === 'delivering').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-12 bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center"><Pizza size={24} /></div>
          <h1 className="text-2xl font-serif font-bold">Cuisine <span className="text-brand-yellow">Dashboard</span></h1>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'orders' ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'text-zinc-500 hover:text-white'}`}
          >
            Commandes
          </button>
          <button 
            onClick={() => setActiveTab('promos')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'promos' ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'text-zinc-500 hover:text-white'}`}
          >
            Promotions
          </button>
        </div>

        <button onClick={onExit} className="bg-zinc-800 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-700 transition-colors">
          <X size={18} /> Quitter
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {activeTab === 'orders' && (
          <div className="lg:col-span-1 space-y-3 flex flex-row lg:flex-col overflow-x-auto gap-3 pb-4 lg:pb-0">
            {['all', 'new', 'preparing', 'delivering', 'completed'].map(id => (
              <button 
                key={id} 
                onClick={() => setFilter(id as any)} 
                className={`flex-shrink-0 lg:w-full p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                  filter === id ? 'bg-zinc-800 border-white/20' : 'bg-zinc-900 border-zinc-800 opacity-60'
                }`}
              >
                <span className="capitalize text-[10px] font-black tracking-widest">{id === 'all' ? 'Toutes' : id}</span>
                <span className="bg-brand-green px-2 py-1 rounded text-[10px]">{(stats as any)[id] || orders.length}</span>
              </button>
            ))}
          </div>
        )}
        
        <div className={activeTab === 'orders' ? "lg:col-span-3" : "lg:col-span-4"}>
          <AnimatePresence mode="wait">
            {activeTab === 'orders' ? (
              <motion.div 
                key="orders-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredOrders.map(order => (
                  <motion.div 
                    key={order.id} 
                    layout
                    className="bg-zinc-900/40 p-6 rounded-[2.5rem] border border-zinc-800 space-y-6 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                      order.status === 'new' ? 'bg-red-500' :
                      order.status === 'preparing' ? 'bg-brand-yellow' :
                      order.status === 'delivering' ? 'bg-blue-500' : 'bg-brand-green'
                    }`} />

                    <div className="flex justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-black">Ref: {order.id}</span>
                        <h4 className="text-xl font-bold">{order.customer.name}</h4>
                        <p className="text-zinc-500 text-sm flex items-center gap-2"><Phone size={14} /> {order.customer.phone}</p>
                      </div>
                      <span className="text-xl font-bold text-brand-green">{order.total.toFixed(2)}€</span>
                    </div>

                    <div className="p-4 bg-zinc-950 rounded-2xl text-xs sm:text-sm border border-zinc-800">
                      <p className="text-zinc-300 flex items-center gap-2 mb-2"><MapPin size={14} className="text-brand-yellow" /> {order.customer.address}</p>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex flex-col border-b border-zinc-800 pb-2 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-bold">{item.quantity}x {item.name}</span>
                            <span className="text-zinc-500 text-[10px] font-black uppercase">({item.size})</span>
                          </div>
                          {item.customName && (
                            <div className="text-[10px] text-brand-yellow font-black uppercase tracking-widest mt-1 italic">
                              POUR : {item.customName}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      {order.status === 'new' && (
                        <button onClick={() => onUpdateStatus(order.id, 'preparing')} className="w-full bg-brand-yellow text-brand-green py-3 rounded-xl text-xs font-black uppercase shadow-lg shadow-brand-yellow/10">Prise en charge</button>
                      )}
                      {order.status === 'preparing' && (
                        <button onClick={() => onUpdateStatus(order.id, 'delivering')} className="w-full bg-blue-500 text-white py-3 rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/10">Envoyer en livraison</button>
                      )}
                      {order.status === 'delivering' && (
                        <button onClick={() => onUpdateStatus(order.id, 'completed',)} className="w-full bg-brand-green text-white py-3 rounded-xl text-xs font-black uppercase shadow-lg shadow-brand-green/10">Marquer comme livré</button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="promos-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {promotions.map(promo => (
                  <div key={promo.id} className="bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800 space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-brand-yellow font-black uppercase tracking-[0.2em]">{promo.code}</span>
                        <h4 className="text-2xl font-serif font-bold mt-1 text-white">{promo.description}</h4>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${promo.active ? 'bg-brand-green text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                        {promo.active ? 'Active' : 'Désactivée'}
                      </div>
                    </div>
                    <div className="text-5xl font-serif font-bold text-brand-green">
                      {promo.type === 'percentage' ? `-${promo.discount * 100}%` : `-${promo.discount}€`}
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button 
                        onClick={() => onUpdatePromotions(promotions.map(p => p.id === promo.id ? { ...p, active: !p.active } : p))}
                        className="flex-1 bg-zinc-800 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-700 transition-all border border-zinc-700"
                      >
                        {promo.active ? 'Désactiver' : 'Activer'}
                      </button>
                      <button 
                        onClick={() => onUpdatePromotions(promotions.filter(p => p.id !== promo.id))}
                        className="p-3 bg-red-900/20 text-red-500 rounded-xl hover:bg-red-900/40 transition-all border border-red-900/20"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                <button className="bg-zinc-900/40 p-8 rounded-3xl border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-6 text-zinc-500 hover:text-white hover:border-zinc-600 transition-all group min-h-[250px]">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-all shadow-xl"><Plus size={32} /></div>
                  <span className="text-xs font-black uppercase tracking-widest">Ajouter une promotion</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
