
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Tag, ShoppingBag, Star, Navigation, Mail, Send, CheckCircle2 } from 'lucide-react';
import { Order, Promotion } from '../types';
import DeliveryTrackerModal from './DeliveryTrackerModal';
import { supabase } from '../lib/supabase';

interface CustomerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  promotions: Promotion[];
  currentUserEmail?: string | null;
}

const PIZZAS_FOR_FREE = 10;

const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  promotions,
  currentUserEmail
}) => {
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [sending, setSending] = useState(false);

  const myOrders = currentUserEmail
    ? orders.filter(o => o.customer.email === currentUserEmail)
    : [];

  // Points de fidélité : 1 point par article commandé dans les commandes terminées
  const loyaltyPoints = myOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.items.reduce((s, item) => s + item.quantity, 0), 0);

  const pointsToNext = PIZZAS_FOR_FREE - (loyaltyPoints % PIZZAS_FOR_FREE);
  const progressPct = ((loyaltyPoints % PIZZAS_FOR_FREE) / PIZZAS_FOR_FREE) * 100;
  const freeEarned = Math.floor(loyaltyPoints / PIZZAS_FOR_FREE);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    setSending(true);
    await supabase.auth.signInWithOtp({
      email: loginEmail,
      options: { emailRedirectTo: window.location.origin + '/pizza-la-pallice/' }
    });
    setSending(false);
    setLinkSent(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-60"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-zinc-50 shadow-2xl z-70 overflow-hidden flex flex-col pt-safe"
          >
            {/* Header */}
            <div className="bg-white p-6 sm:p-8 border-b border-zinc-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-serif font-bold text-zinc-900">Mon Espace</h2>
                <p className="text-sm text-zinc-500 font-medium">
                  {currentUserEmail ? currentUserEmail : 'Historique & Fidélité'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-full bg-zinc-50 text-zinc-400 hover:bg-brand-yellow hover:text-brand-green transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grow overflow-y-auto p-6 space-y-8">

              {/* ── Connexion sans commande ── */}
              {!currentUserEmail && (
                <section className="bg-white rounded-3xl border border-dashed border-brand-green/30 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
                      <Mail size={18} className="text-brand-green" />
                    </div>
                    <div>
                      <p className="font-black text-zinc-900 text-sm">Accès rapide</p>
                      <p className="text-xs text-zinc-400 font-medium">Reçois un lien magique par email</p>
                    </div>
                  </div>

                  {linkSent ? (
                    <div className="flex items-center gap-3 bg-brand-green/5 border border-brand-green/20 rounded-2xl p-4">
                      <CheckCircle2 size={20} className="text-brand-green shrink-0" />
                      <p className="text-sm font-bold text-brand-green">Lien envoyé à <span className="font-black">{loginEmail}</span> — vérifie ta boîte mail !</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendMagicLink} className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="ton@email.com"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:border-brand-green focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={sending}
                        className="bg-brand-green text-white px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-black hover:bg-brand-green/90 transition-all disabled:opacity-50 shrink-0"
                      >
                        <Send size={14} />
                        {sending ? '...' : 'Envoyer'}
                      </button>
                    </form>
                  )}
                </section>
              )}

              {/* ── Promotions ── */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-brand-green">
                  <Tag size={18} />
                  <h3 className="font-black uppercase tracking-widest text-xs">Offres du moment</h3>
                </div>
                {promotions.filter(p => p.active).length > 0 ? (
                  <div className="grid gap-3">
                    {promotions.filter(p => p.active).map(promo => (
                      <div key={promo.id} className="bg-white p-4 rounded-2xl border border-dashed border-brand-green/30 flex items-center justify-between hover:border-brand-green transition-all">
                        <div>
                          <p className="text-xs font-black text-brand-green uppercase mb-1">{promo.code}</p>
                          <p className="text-sm font-bold text-zinc-800">{promo.description}</p>
                        </div>
                        <span className="text-lg font-black text-brand-green">
                          {promo.type === 'percentage' ? `-${promo.discount * 100}%` : `-${promo.discount}€`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-2xl border border-dashed border-zinc-200 text-center">
                    <p className="text-sm text-zinc-400 font-medium italic">Aucune promotion active pour le moment.</p>
                  </div>
                )}
              </section>

              {/* ── Historique commandes ── */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-900">
                  <Clock size={18} />
                  <h3 className="font-black uppercase tracking-widest text-xs">Mes Commandes</h3>
                </div>

                {!currentUserEmail ? (
                  <div className="bg-white p-8 rounded-3xl border border-dashed border-zinc-200 text-center space-y-2">
                    <Mail className="text-zinc-300 mx-auto" size={28} />
                    <p className="text-sm font-bold text-zinc-400">Connecte-toi via le formulaire ci-dessus pour voir ton historique.</p>
                  </div>
                ) : myOrders.length > 0 ? (
                  <div className="space-y-4">
                    {myOrders.map(order => (
                      <div key={order.id} className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                              Commande #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-xs font-bold text-zinc-500">
                              {new Date(order.timestamp).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'long', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              order.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                              order.status === 'delivering' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              order.status === 'preparing' ? 'bg-brand-yellow/10 text-brand-green border-brand-yellow/20' :
                              'bg-zinc-50 text-zinc-500 border-zinc-100'
                            }`}>
                              {order.status === 'new' ? 'Reçue' :
                               order.status === 'preparing' ? 'En préparation' :
                               order.status === 'delivering' ? '🛵 En livraison' : 'Terminée'}
                            </span>
                            {order.status === 'delivering' && (
                              <motion.button
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 1.8 }}
                                onClick={() => setTrackingOrder(order)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-green text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-brand-green/30"
                              >
                                <Navigation size={10} /> Suivre ma livraison
                              </motion.button>
                            )}
                          </div>
                        </div>
                        <div className="border-t border-zinc-50 pt-4 space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-800">
                                  {item.quantity}× {item.name}
                                  <span className="ml-2 text-[10px] text-zinc-400 font-black uppercase">{item.size}</span>
                                </span>
                                {item.customName && (
                                  <span className="text-[10px] text-brand-green font-black uppercase tracking-widest">
                                    Pour : {item.customName}
                                  </span>
                                )}
                              </div>
                              <span className="text-zinc-500 font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-zinc-50 mt-4 pt-4 flex justify-between items-center">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total</p>
                          <p className="text-lg font-serif font-bold text-brand-green">{order.total.toFixed(2)}€</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-12 rounded-3xl border border-zinc-100 text-center space-y-4">
                    <ShoppingBag className="text-zinc-300 mx-auto" size={32} />
                    <p className="text-sm text-zinc-400 font-bold">Aucune commande pour le moment. Vos pizzas apparaîtront ici !</p>
                  </div>
                )}
              </section>
            </div>

            {/* ── Fidélité (footer) ── */}
            <div className="shrink-0 p-6 bg-brand-green text-white pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Star className="text-brand-yellow" size={20} fill="currentColor" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Programme Fidélité</p>
                  <p className="text-base font-serif font-bold leading-tight">La Pallice & Moi</p>
                </div>
                {currentUserEmail && (
                  <div className="text-right">
                    <p className="text-2xl font-black leading-none">{loyaltyPoints % PIZZAS_FOR_FREE}</p>
                    <p className="text-[9px] font-bold text-white/60 uppercase">/ {PIZZAS_FOR_FREE} pts</p>
                  </div>
                )}
              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-brand-yellow rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: currentUserEmail ? `${progressPct}%` : '0%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              {currentUserEmail ? (
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-white/70">
                    {pointsToNext === PIZZAS_FOR_FREE
                      ? 'Commence à commander pour gagner des points !'
                      : `Plus que ${pointsToNext} pizza${pointsToNext > 1 ? 's' : ''} pour une pizza offerte !`}
                  </p>
                  {freeEarned > 0 && (
                    <span className="bg-brand-yellow text-brand-green text-[9px] font-black px-2 py-0.5 rounded-full ml-2 shrink-0">
                      🎁 ×{freeEarned}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-[10px] font-bold text-white/60 uppercase">Connecte-toi pour voir tes points</p>
              )}
            </div>
          </motion.div>
        </>
      )}
      {trackingOrder && (
        <DeliveryTrackerModal
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </AnimatePresence>
  );
};

export default CustomerHistoryModal;
