
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, X, Phone, MapPin, Plus, ShoppingBag, Clock } from 'lucide-react';
import { Order, Promotion, MenuItem } from '../types';

interface RestaurantDashboardProps {
  orders: Order[];
  promotions: Promotion[];
  menuItems: MenuItem[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onUpdatePromotions: (promos: Promotion[]) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
  onExit: () => void;
}

const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({ 
  orders, 
  promotions, 
  menuItems,
  onUpdateStatus, 
  onUpdatePromotions, 
  onToggleAvailability,
  onExit 
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'promos' | 'inventory'>('orders');
  const [filter, setFilter] = useState<'all' | Order['status']>('all');
  const stats = {
    new: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivering: orders.filter(o => o.status === 'delivering').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  const [hasSeenNew, setHasSeenNew] = useState(true);
  const [now, setNow] = useState(Date.now());

  // Mettre à jour 'now' chaque minute pour les compteurs
  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Déclencher le clignotement si de nouvelles commandes arrivent et qu'on ne regarde pas l'onglet 'Nouveau'
  React.useEffect(() => {
    if (stats.new > 0 && filter !== 'new') {
      setHasSeenNew(false);
    } else if (stats.new === 0 || filter === 'new') {
      setHasSeenNew(true);
    }
  }, [stats.new, filter]);

  const getDuration = (timestamp: number) => {
    const diff = Math.floor((now - timestamp) / 60000);
    if (diff < 1) return "< 1 min";
    return `${diff} min`;
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-zinc-200 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-green/20">
            <Pizza size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-black tracking-tight text-brand-green">Cuisine Dashboard</h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Administration Live</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
          {[
            { id: 'orders', label: 'Commandes' },
            { id: 'promos', label: 'Promotions' },
            { id: 'inventory', label: 'Stock' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-brand-green shadow-sm border border-zinc-200' 
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button 
          onClick={onExit} 
          className="bg-zinc-900 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10"
        >
          <X size={18} /> Quitter
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {activeTab === 'orders' && (
          <div className="lg:col-span-1 space-y-2 flex flex-row lg:flex-col overflow-x-auto gap-2 pb-4 lg:pb-0">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'new', label: 'Nouveau' },
              { id: 'preparing', label: 'Préparation' },
              { id: 'delivering', label: 'Livraison' },
              { id: 'completed', label: 'Terminé' }
            ].map(({ id, label }) => (
              <motion.button 
                key={id} 
                onClick={() => setFilter(id as any)} 
                animate={id === 'new' && stats.new > 0 && !hasSeenNew ? {
                  backgroundColor: ['#ffffff', '#fefce8', '#ffffff'],
                  borderColor: ['#e4e4e7', '#facc15', '#e4e4e7'],
                  scale: [1, 1.02, 1]
                } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={`shrink-0 lg:w-full rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                  filter === id 
                    ? 'bg-white border-brand-green ring-1 ring-brand-green shadow-sm' 
                    : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                } ${id === 'new' && stats.new === 0 ? 'opacity-40 p-2 scale-95' : 'p-4'}`}
              >
                <span className={`text-[10px] font-black tracking-widest uppercase ${filter === id ? 'text-brand-green' : ''}`}>
                  {label}
                </span>
                <span className={`px-2 py-1 rounded text-[10px] font-black ${
                  filter === id ? 'bg-brand-green text-white' : 
                  id === 'new' && stats.new > 0 && !hasSeenNew ? 'bg-yellow-400 text-brand-green' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {id === 'all' ? orders.length : (stats as any)[id]}
                </span>
              </motion.button>
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
                    className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-5 relative overflow-hidden flex flex-col"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                      order.status === 'new' ? 'bg-red-500' :
                      order.status === 'preparing' ? 'bg-brand-yellow' :
                      order.status === 'delivering' ? 'bg-blue-500' : 'bg-brand-green'
                    }`} />

                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-zinc-400 font-black tracking-tighter uppercase">ID: {order.id.slice(0, 8)}</span>
                          <span className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold">
                            <Clock size={10} /> {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 className="text-xl font-black text-zinc-900 leading-none">{order.customer.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-brand-green tracking-tighter">{order.total.toFixed(2)}€</span>
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
                       <p className="text-zinc-600 text-xs font-bold flex items-center gap-2">
                        <Phone size={14} className="text-zinc-400" /> {order.customer.phone}
                      </p>
                      <p className="text-zinc-600 text-xs font-medium flex items-start gap-2">
                        <MapPin size={14} className="text-brand-yellow shrink-0 mt-0.5" /> {order.customer.address}
                      </p>
                    </div>

                    <div className="space-y-3 flex-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex flex-col border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-black text-zinc-800">{item.quantity}x {item.name}</span>
                            <span className="px-2 py-0.5 bg-zinc-100 rounded text-[9px] font-black uppercase text-zinc-500">{item.size}</span>
                          </div>
                          {item.customName && (
                            <div className="text-[9px] text-brand-green font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                              <span className="w-1 h-1 bg-brand-yellow rounded-full" /> Pour : {item.customName}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      {order.status === 'new' && (
                        <button onClick={() => onUpdateStatus(order.id, 'preparing')} className="w-full bg-brand-yellow text-brand-green py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-yellow/20 hover:scale-[1.02] transition-all">Prise en charge</button>
                      )}
                      {order.status === 'preparing' && (
                        <button onClick={() => onUpdateStatus(order.id, 'delivering')} className="w-full bg-blue-500 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">Envoyer en livraison</button>
                      )}
                      {order.status === 'delivering' && (
                        <button onClick={() => onUpdateStatus(order.id, 'completed',)} className="w-full bg-brand-green text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-green/20 hover:scale-[1.02] transition-all">Marquer livré</button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : activeTab === 'promos' ? (
              <motion.div 
                key="promos-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {promotions.map(promo => (
                  <div key={promo.id} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-brand-yellow bg-brand-yellow/10 px-2 py-1 rounded font-black uppercase tracking-[0.2em]">{promo.code}</span>
                        <h4 className="text-2xl font-serif font-black mt-2 text-zinc-900">{promo.description}</h4>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${promo.active ? 'bg-brand-green/10 text-brand-green' : 'bg-zinc-100 text-zinc-400'}`}>
                        {promo.active ? 'Active' : 'Désactivée'}
                      </div>
                    </div>
                    <div className="text-5xl font-serif font-black text-brand-green tracking-tighter">
                      {promo.type === 'percentage' ? `-${promo.discount * 100}%` : `-${promo.discount}€`}
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button 
                        onClick={() => onUpdatePromotions(promotions.map(p => p.id === promo.id ? { ...p, active: !p.active } : p))}
                        className="flex-1 bg-zinc-50 border border-zinc-200 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-100 transition-all"
                      >
                        {promo.active ? 'Désactiver' : 'Activer'}
                      </button>
                      <button 
                        onClick={() => onUpdatePromotions(promotions.filter(p => p.id !== promo.id))}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all border border-red-100"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                <button className="bg-zinc-50 p-8 rounded-3xl border border-dashed border-zinc-300 flex flex-col items-center justify-center gap-6 text-zinc-400 hover:text-brand-green hover:border-brand-green hover:bg-white transition-all group min-h-[250px]">
                  <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white group-hover:border-brand-green transition-all shadow-sm"><Plus size={32} /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Nouvelle promotion</span>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="inventory-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {menuItems.map(item => (
                  <div key={item.id} className={`p-4 rounded-2xl border transition-all ${item.isAvailable === false ? 'bg-zinc-50 border-red-100 opacity-60' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-zinc-900 truncate">{item.name}</h4>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter truncate">{item.category}</p>
                      </div>
                      <button 
                        onClick={() => onToggleAvailability(item.id, item.isAvailable === false)}
                        className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all shadow-sm ${item.isAvailable === false ? 'bg-red-500 text-white' : 'bg-brand-green text-white'}`}
                      >
                        {item.isAvailable === false ? 'RUPTURE' : 'STOCK'}
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
