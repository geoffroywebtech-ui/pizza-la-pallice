
import React, { useEffect, useState } from 'react';
import { ShoppingBag, X, Minus, Plus, Trash2, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onFinalize: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity,
  onFinalize
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Délai pour activer la transition d'ouverture
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none flex justify-end">
      {/* Overlay flouté (attrape-clic pour fermer) */}
      <div 
        onClick={onClose} 
        className={`absolute inset-0 bg-brand-green/80 backdrop-blur-md pointer-events-auto transition-opacity duration-300 ${isOpen && isAnimating ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      {/* Panneau du panier */}
      <div 
        className={`relative h-full w-full sm:max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto transition-transform duration-400 ease-out transform ${isOpen && isAnimating ? 'translate-x-0' : 'translate-x-full'}`}
      >
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center"><ShoppingBag className="text-brand-green" /></div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-zinc-900">Votre panier</h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{cart.length} articles</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-zinc-50 text-zinc-400 hover:bg-brand-yellow hover:text-brand-green hover:shadow-lg transition-all active:scale-95"
              >
                <X size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Fermer</span>
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
              {cart.map((item) => {
                const cartId = `${item.id}-${item.size}-${item.customName || ''}`;
                return (
                  <div key={cartId} className="flex items-center gap-4 group">
                    <div className="w-20 h-20 bg-zinc-100 rounded-2xl shrink-0 flex items-center justify-center border border-zinc-200">
                      <ShoppingBag className="text-brand-green/30" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col mb-1 text-sm font-bold">
                        <span className="text-zinc-900 leading-tight">
                          {item.name}
                          <span className="ml-2 text-[8px] px-2 py-0.5 bg-zinc-100 rounded-full text-zinc-500 uppercase tracking-tighter">
                            {item.size}
                          </span>
                        </span>
                        {item.customName && (
                          <span className="text-[10px] text-brand-green font-black uppercase tracking-widest mt-0.5">
                            Pour: {item.customName}
                          </span>
                        )}
                      </div>
                      <p className="text-brand-green font-serif font-bold">{item.price.toFixed(2)}€</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center bg-zinc-100 rounded-lg p-1">
                          <button onClick={() => onUpdateQuantity(cartId, -1)} className="p-1 hover:bg-white rounded-md shadow-sm transition-all">
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(cartId, 1)} className="p-1 hover:bg-white rounded-md shadow-sm transition-all">
                            <Plus size={14} />
                          </button>
                        </div>
                        <button onClick={() => onUpdateQuantity(cartId, -item.quantity)} className="text-zinc-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {cart.length > 0 && (
              <div className="p-6 sm:p-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] border-t border-zinc-100 bg-zinc-50 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="font-black text-zinc-400 uppercase tracking-widest text-xs">Total à régler</span>
                  <span className="text-4xl font-serif font-bold text-brand-green">{total.toFixed(2)}€</span>
                </div>
                <div className="p-4 bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl flex gap-3">
                  <AlertCircle className="text-brand-green shrink-0" size={20} />
                  <p className="text-[12px] leading-tight text-brand-green font-medium">
                    <span className="font-black uppercase">Paiement :</span> Espèces uniquement à la livraison.
                  </p>
                </div>
                <button onClick={onFinalize} className="w-full bg-brand-green text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-yellow hover:text-brand-green transition-all shadow-xl active:scale-95">
                  Commander
                </button>
              </div>
            )}
          </div>
        </div>
  );
};

export default CartModal;
