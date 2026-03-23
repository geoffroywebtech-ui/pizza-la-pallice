
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Tag, ChevronRight, ShoppingBag, Star } from 'lucide-react';
import { Order, Promotion } from '../types';

interface CustomerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  promotions: Promotion[];
}

const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  orders, 
  promotions 
}) => {
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
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-50 shadow-2xl z-70 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-white p-8 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-zinc-900">Mon Espace</h2>
                <p className="text-sm text-zinc-500 font-medium">Historique & Promotions</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-full bg-zinc-50 text-zinc-400 hover:bg-brand-yellow hover:text-brand-green transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grow overflow-y-auto p-6 space-y-8">
              {/* Promotions Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-brand-green mb-4">
                  <Tag size={18} />
                  <h3 className="font-black uppercase tracking-widest text-xs">Offres du moment</h3>
                </div>
                
                {promotions.length > 0 ? (
                  <div className="grid gap-3">
                    {promotions.map(promo => (
                      <div key={promo.id} className="bg-white p-4 rounded-2xl border border-dashed border-brand-green/30 flex items-center justify-between group hover:border-brand-green transition-all cursor-pointer">
                        <div>
                          <p className="text-xs font-black text-brand-green uppercase mb-1">{promo.code}</p>
                          <p className="text-sm font-bold text-zinc-800">{promo.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-brand-green">
                            {promo.type === 'percentage' ? `-${promo.discount * 100}%` : `-${promo.discount}€`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-2xl border border-dashed border-zinc-200 text-center">
                    <p className="text-sm text-zinc-400 font-medium italic">Aucune promotion active pour le moment. Revenez bientôt !</p>
                  </div>
                )}
              </section>

              {/* Order History Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 mb-4">
                  <Clock size={18} />
                  <h3 className="font-black uppercase tracking-widest text-xs">Mes Commandes</h3>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                              Commande #{order.id}
                            </p>
                            <p className="text-xs font-bold text-zinc-500">
                              {new Date(order.timestamp).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            order.status === 'completed' 
                              ? 'bg-green-50 text-green-600 border-green-100'
                              : order.status === 'preparing'
                              ? 'bg-brand-yellow/10 text-brand-green border-brand-yellow/20'
                              : 'bg-zinc-50 text-zinc-500 border-zinc-100'
                          }`}>
                            {order.status === 'new' ? 'Nouveau' : 
                             order.status === 'preparing' ? 'Préparation' : 
                             order.status === 'delivering' ? 'Livraison' : 
                             order.status === 'completed' ? 'Terminé' : order.status}
                          </span>
                        </div>

                        <div className="border-t border-zinc-50 pt-4 space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-800">
                                  {item.quantity}x {item.name}
                                  <span className="ml-2 text-[10px] text-zinc-400 font-black uppercase">{item.size}</span>
                                </span>
                                {item.customName && (
                                  <span className="text-[10px] text-brand-green font-black uppercase tracking-widest">
                                    Pour: {item.customName}
                                  </span>
                                )}
                              </div>
                              <span className="text-zinc-500 font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-zinc-50 mt-4 pt-4 flex justify-between items-center">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Payé</p>
                          <p className="text-lg font-serif font-bold text-brand-green">{order.total.toFixed(2)}€</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-12 rounded-3xl border border-zinc-100 text-center space-y-4">
                    <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingBag className="text-zinc-300" size={32} />
                    </div>
                    <p className="text-sm text-zinc-400 font-bold leading-relaxed">Vous n'avez pas encore passé de commande. Vos futures pizzas apparaîtront ici !</p>
                  </div>
                )}
              </section>
            </div>

            {/* Footer Loyalty Card Mockup */}
            <div className="p-8 bg-brand-green text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Star className="text-brand-yellow" size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/60">Programme Fidélité</p>
                  <p className="text-lg font-serif font-bold">La Pallice & Moi</p>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-brand-yellow w-2/3" />
              </div>
              <p className="text-[10px] font-bold text-white/60 uppercase">Plus que 3 pizzas pour votre pizza offerte !</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomerHistoryModal;
