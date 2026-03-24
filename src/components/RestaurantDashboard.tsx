
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, X, Phone, MapPin, Plus, ShoppingBag, Clock, Navigation, MessageCircle, Copy, Check, Users, Search, Star, Mail, ChevronRight, BookOpen, Headphones } from 'lucide-react';
import { Order, Promotion, MenuItem } from '../types';
import { supabase } from '../lib/supabase';

interface RestaurantDashboardProps {
  orders: Order[];
  promotions: Promotion[];
  menuItems: MenuItem[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onUpdatePromotions: (promos: Promotion[]) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
  onExit: () => void;
  onOpenGuide?: () => void;
  onOpenSupport?: () => void;
}

interface ClientSummary {
  phone: string;
  name: string;
  emails: string[];
  addresses: string[];
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastOrderDate: number;
  orders: Order[];
}

const PIZZAS_FOR_FREE = 10;

const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({
  orders,
  promotions,
  menuItems,
  onUpdateStatus,
  onUpdatePromotions,
  onToggleAvailability,
  onExit,
  onOpenGuide,
  onOpenSupport
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'promos' | 'inventory' | 'clients'>('orders');
  const [filter, setFilter] = useState<'all' | Order['status']>('all');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientSummary | null>(null);

  // GPS tracking: watchId per orderId
  const watchRefs = useRef<Record<string, number>>({});

  const startTracking = (orderId: string) => {
    if (watchRefs.current[orderId]) return;
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        await supabase.from('orders').update({
          deliverer_location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            updated_at: Date.now(),
          }
        }).eq('id', orderId);
      },
      (err) => console.error('GPS error:', err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    watchRefs.current[orderId] = watchId;
  };

  const stopTracking = async (orderId: string) => {
    if (watchRefs.current[orderId]) {
      navigator.geolocation.clearWatch(watchRefs.current[orderId]);
      delete watchRefs.current[orderId];
    }
    await supabase.from('orders').update({ deliverer_location: null }).eq('id', orderId);
  };

  useEffect(() => {
    return () => {
      Object.values(watchRefs.current).forEach((watchId) => {
        navigator.geolocation.clearWatch(watchId as number);
      });
    };
  }, []);

  const handleSendDelivering = async (orderId: string) => {
    onUpdateStatus(orderId, 'delivering');
    startTracking(orderId);
  };

  const handleMarkDelivered = async (orderId: string) => {
    onUpdateStatus(orderId, 'completed');
    await stopTracking(orderId);
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const buildTrackingMessage = (order: Order) => {
    const url = `https://geoffroywebtech-ui.github.io/pizza-la-pallice/?track=${order.id}`;
    return `🍕 Votre commande Pizza La Pallice est en route !\nSuivez votre livreur en direct : ${url}\nMerci de votre confiance 🙏`;
  };

  const handleWhatsApp = (order: Order) => {
    const phone = order.customer.phone.replace(/\s/g, '').replace(/^0/, '33');
    const msg = buildTrackingMessage(order);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopy = async (order: Order) => {
    await navigator.clipboard.writeText(buildTrackingMessage(order));
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stats = {
    new: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivering: orders.filter(o => o.status === 'delivering').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  const [hasSeenNew, setHasSeenNew] = useState(true);
  const [now, setNow] = useState(Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

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

  const getTimerColor = (timestamp: number) => {
    const diff = Math.floor((now - timestamp) / 60000);
    if (diff < 5) return 'bg-green-100 text-green-700 border-green-200';
    if (diff < 10) return 'bg-brand-yellow/20 text-amber-700 border-brand-yellow/40';
    return 'bg-red-100 text-red-600 border-red-200';
  };

  const shouldPulse = (timestamp: number) => Math.floor((now - timestamp) / 60000) >= 10;

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  // ── Agrégation clients ──
  const clientList = useMemo(() => {
    const map = new Map<string, ClientSummary>();
    orders.forEach(order => {
      const key = order.customer.phone;
      const pts = order.status === 'completed'
        ? order.items.reduce((s, i) => s + i.quantity, 0)
        : 0;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          phone: order.customer.phone,
          name: order.customer.name,
          emails: order.customer.email ? [order.customer.email] : [],
          addresses: order.customer.address ? [order.customer.address] : [],
          totalOrders: 1,
          totalSpent: order.total,
          loyaltyPoints: pts,
          lastOrderDate: order.timestamp,
          orders: [order],
        });
      } else {
        existing.totalOrders++;
        existing.totalSpent += order.total;
        existing.loyaltyPoints += pts;
        existing.lastOrderDate = Math.max(existing.lastOrderDate, order.timestamp);
        existing.orders.push(order);
        if (order.customer.email && !existing.emails.includes(order.customer.email))
          existing.emails.push(order.customer.email);
        if (order.customer.address && !existing.addresses.includes(order.customer.address))
          existing.addresses.push(order.customer.address);
      }
    });
    return Array.from(map.values()).sort((a, b) => b.lastOrderDate - a.lastOrderDate);
  }, [orders]);

  const filteredClients = useMemo(() => {
    if (!clientSearch.trim()) return clientList;
    const q = clientSearch.toLowerCase();
    return clientList.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.emails.some(e => e.toLowerCase().includes(q))
    );
  }, [clientList, clientSearch]);

  const formatPhoneWA = (phone: string) =>
    phone.replace(/\s/g, '').replace(/^0/, '33');

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const statusLabel = (s: Order['status']) =>
    s === 'new' ? 'Reçue' : s === 'preparing' ? 'En préparation' : s === 'delivering' ? 'En livraison' : 'Terminée';

  const statusColor = (s: Order['status']) =>
    s === 'new' ? 'bg-red-50 text-red-600 border-red-100' :
    s === 'preparing' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
    s === 'delivering' ? 'bg-blue-50 text-blue-600 border-blue-100' :
    'bg-green-50 text-green-600 border-green-100';

  return (
    <div className="h-dvh bg-zinc-50 text-zinc-900 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center bg-white px-4 py-3 sm:px-6 border-b border-zinc-200 gap-3">
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
            { id: 'inventory', label: 'Stock' },
            { id: 'clients', label: 'Clients' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-brand-green shadow-sm border border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-brand-green hover:border-brand-green/30 transition-all"
            title="Mode d'emploi"
          >
            <BookOpen size={18} />
          </button>
          <button
            onClick={onOpenSupport}
            className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-purple-600 hover:border-purple-200 transition-all"
            title="Support technique"
          >
            <Headphones size={18} />
          </button>
          <button
            onClick={onExit}
            className="bg-zinc-900 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10"
          >
            <X size={18} /> Quitter
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-3 p-3">
        {activeTab === 'orders' && (
          <div className="lg:w-44 flex-shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto gap-1 pb-2 lg:pb-0">
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

        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' ? (
              <div className="flex-1 overflow-y-auto min-h-0">
              <motion.div
                key="orders-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid gap-1.5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
              >
                {filteredOrders.map(order => (
                  <motion.div
                    key={order.id}
                    layout
                    className="bg-white p-2.5 rounded-xl border border-zinc-200 shadow-sm space-y-2 relative overflow-hidden flex flex-col"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      order.status === 'new' ? 'bg-red-500' :
                      order.status === 'preparing' ? 'bg-brand-yellow' :
                      order.status === 'delivering' ? 'bg-blue-500' : 'bg-brand-green'
                    }`} />

                    <div className="flex justify-between items-start pt-0.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[8px] text-zinc-400 font-black tracking-tighter uppercase">ID: {order.id.slice(0, 8)}</span>
                        </div>
                        <h4 className="text-xs font-black text-zinc-900 leading-none truncate">{order.customer.name}</h4>
                      </div>
                      <div className="text-right shrink-0 ml-1">
                        <span className="text-xs font-black text-brand-green tracking-tighter">{order.total.toFixed(2)}€</span>
                      </div>
                    </div>

                    {(order.status === 'new' || order.status === 'preparing') && (
                      <motion.div
                        animate={shouldPulse(order.timestamp) ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border text-[8px] font-black w-fit ${getTimerColor(order.timestamp)}`}
                      >
                        <Clock size={8} className="shrink-0" />
                        {getDuration(order.timestamp)}
                      </motion.div>
                    )}

                    <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1">
                      <p className="text-zinc-600 text-[9px] font-bold flex items-center gap-1">
                        <Phone size={10} className="text-zinc-400 shrink-0" /> {order.customer.phone}
                      </p>
                      <p className="text-zinc-600 text-[9px] font-medium flex items-start gap-1">
                        <MapPin size={10} className="text-brand-yellow shrink-0 mt-0.5" /> <span className="truncate">{order.customer.address}</span>
                      </p>
                    </div>

                    <div className="space-y-1 flex-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex flex-col border-b border-zinc-100 pb-1 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-zinc-800">{item.quantity}x {item.name}</span>
                            <span className="px-1 py-0.5 bg-zinc-100 rounded text-[8px] font-black uppercase text-zinc-500">{item.size}</span>
                          </div>
                          {item.customName && (
                            <div className="text-[8px] text-brand-green font-black uppercase tracking-[0.15em] mt-0.5 flex items-center gap-1">
                              <span className="w-1 h-1 bg-brand-yellow rounded-full shrink-0" /> Pour : {item.customName}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div>
                      {order.status === 'new' && (
                        <button onClick={() => onUpdateStatus(order.id, 'preparing')} className="w-full bg-brand-yellow text-brand-green py-2 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-brand-yellow/20 hover:scale-[1.02] transition-all">Prise en charge</button>
                      )}
                      {order.status === 'preparing' && (
                        <button onClick={() => handleSendDelivering(order.id)} className="w-full bg-blue-500 text-white py-2 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-1">
                          <Navigation size={9} /> Envoyer en livraison
                        </button>
                      )}
                      {order.status === 'delivering' && (
                        <div className="space-y-1">
                          <button onClick={() => handleMarkDelivered(order.id)} className="w-full bg-brand-green text-white py-2 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-brand-green/20 hover:scale-[1.02] transition-all">Marquer livré</button>
                          <div className="flex gap-1">
                            <button onClick={() => handleWhatsApp(order)} className="flex-1 flex items-center justify-center gap-1 bg-[#25D366] text-white py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                              <MessageCircle size={9} /> WhatsApp
                            </button>
                            <button onClick={() => handleCopy(order)} className="flex-1 flex items-center justify-center gap-1 bg-zinc-100 text-zinc-600 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">
                              {copiedId === order.id ? <><Check size={9} className="text-brand-green" /> Copié</> : <><Copy size={9} /> Copier</>}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              </div>
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
            ) : activeTab === 'inventory' ? (
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
            ) : (
              /* ── Onglet Clients ── */
              <motion.div
                key="clients-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 overflow-hidden flex gap-4 min-h-0"
              >
                {/* Panneau gauche — liste */}
                <div className="w-80 flex-shrink-0 flex flex-col overflow-hidden gap-3">
                  {/* Recherche */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Nom, téléphone, email…"
                      value={clientSearch}
                      onChange={e => setClientSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-brand-green transition-all"
                    />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
                    {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''}
                  </p>
                  {/* Liste */}
                  <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5">
                    {filteredClients.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-dashed border-zinc-200 p-8 text-center">
                        <Users size={28} className="text-zinc-300 mx-auto mb-2" />
                        <p className="text-xs text-zinc-400 font-bold">Aucun client trouvé</p>
                      </div>
                    ) : filteredClients.map(client => (
                      <button
                        key={client.phone}
                        onClick={() => setSelectedClient(client)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                          selectedClient?.phone === client.phone
                            ? 'bg-brand-green/5 border-brand-green ring-1 ring-brand-green'
                            : 'bg-white border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-brand-green flex items-center justify-center text-white text-[10px] font-black shrink-0">
                          {getInitials(client.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-zinc-900 truncate">{client.name}</p>
                          <p className="text-[9px] text-zinc-400 font-bold">{client.phone}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[9px] font-black text-brand-green">{client.totalSpent.toFixed(0)}€</span>
                          <span className="bg-zinc-100 text-zinc-500 text-[8px] font-black px-1.5 py-0.5 rounded-full">
                            {client.totalOrders} cmd
                          </span>
                        </div>
                        <ChevronRight size={12} className="text-zinc-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Panneau droit — détail */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  {!selectedClient ? (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                        <Users size={28} className="text-zinc-300" />
                      </div>
                      <p className="text-sm font-bold text-zinc-400">Sélectionnez un client</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* En-tête client */}
                      <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-brand-green flex items-center justify-center text-white text-lg font-black shrink-0">
                            {getInitials(selectedClient.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-black text-zinc-900">{selectedClient.name}</h3>
                            <p className="text-xs text-zinc-500 font-bold">
                              Dernière commande : {new Date(selectedClient.lastOrderDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        {/* Infos contact */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-zinc-700 font-bold">
                            <Phone size={12} className="text-zinc-400 shrink-0" />
                            {selectedClient.phone}
                          </div>
                          {selectedClient.emails.map(email => (
                            <div key={email} className="flex items-center gap-2 text-xs text-zinc-700 font-bold">
                              <Mail size={12} className="text-zinc-400 shrink-0" />
                              {email}
                            </div>
                          ))}
                          {selectedClient.addresses.map((addr, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-zinc-700 font-bold">
                              <MapPin size={12} className="text-brand-yellow shrink-0 mt-0.5" />
                              {addr}
                            </div>
                          ))}
                        </div>

                        {/* Boutons contact */}
                        <div className="flex gap-2">
                          <a
                            href={`tel:${selectedClient.phone}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-zinc-50 border border-zinc-200 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:bg-zinc-100 transition-all"
                          >
                            <Phone size={12} /> Appeler
                          </a>
                          <a
                            href={`https://wa.me/${formatPhoneWA(selectedClient.phone)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                          >
                            <MessageCircle size={12} /> WhatsApp
                          </a>
                        </div>
                      </div>

                      {/* Fidélité */}
                      <div className="bg-brand-green rounded-2xl p-4 text-white flex items-center gap-4">
                        <div className="p-2 bg-white/10 rounded-xl">
                          <Star size={18} className="text-brand-yellow" fill="currentColor" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Programme Fidélité</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-sm font-black">
                              {selectedClient.loyaltyPoints % PIZZAS_FOR_FREE} / {PIZZAS_FOR_FREE} pts
                            </p>
                            {Math.floor(selectedClient.loyaltyPoints / PIZZAS_FOR_FREE) > 0 && (
                              <span className="bg-brand-yellow text-brand-green text-[9px] font-black px-2 py-0.5 rounded-full">
                                🎁 ×{Math.floor(selectedClient.loyaltyPoints / PIZZAS_FOR_FREE)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black leading-none">{selectedClient.totalOrders}</p>
                          <p className="text-[9px] text-white/60 font-bold">commandes</p>
                          <p className="text-sm font-black text-brand-yellow">{selectedClient.totalSpent.toFixed(2)}€</p>
                        </div>
                      </div>

                      {/* Historique commandes */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Historique</p>
                        {[...selectedClient.orders].sort((a, b) => b.timestamp - a.timestamp).map(order => (
                          <div key={order.id} className="bg-white rounded-xl border border-zinc-200 p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">#{order.id.slice(0, 8)}</p>
                                <p className="text-[10px] text-zinc-500 font-bold">
                                  {new Date(order.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${statusColor(order.status)}`}>
                                  {statusLabel(order.status)}
                                </span>
                                <span className="text-sm font-black text-brand-green">{order.total.toFixed(2)}€</span>
                              </div>
                            </div>
                            <div className="border-t border-zinc-50 pt-2 space-y-1">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-[10px]">
                                  <span className="font-bold text-zinc-700">{item.quantity}× {item.name} <span className="text-zinc-400 font-black uppercase">{item.size}</span></span>
                                  <span className="text-zinc-400 font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
