
import React, { useState } from 'react';
import { Plus, Minus, Star, Search, Check } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  cartItems: CartItem[];
  onAddToCart: (size: string, name?: string) => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onDetailClick: (e: React.MouseEvent) => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ 
  item, 
  cartItems, 
  onAddToCart, 
  onUpdateQuantity,
  onDetailClick,
  onMouseEnter,
  onMouseLeave 
}) => {
  const [selectedSize, setSelectedSize] = useState<'t1' | 't2' | 't3'>('t2');
  const [orderStep, setOrderStep] = useState<'idle' | 'size' | 'name'>('idle');
  const [tempName, setTempName] = useState('');

  const hasMultipleSizes = item.prices.t2 || item.prices.t3;
  const currentPrice = item.prices[selectedSize] || item.prices.t1;
  const itemInCart = cartItems.find(i => i.size === selectedSize);
  const quantity = itemInCart ? itemInCart.quantity : 0;
  const anyInCart = cartItems.length > 0;

  return (
    <div 
      className="group relative flex flex-col h-full cursor-pointer transition-all duration-300 transform hover:-translate-y-2"
      onClick={(e) => onDetailClick(e)}
      onMouseEnter={(e) => onMouseEnter(e)}
      onMouseLeave={() => onMouseLeave()}
    >
      {/* Background card with hover shading */}
      {/* Background card with hover shading */}
      <div className={`bg-white pt-6 pb-4 px-4 rounded-[2rem] shadow-sm border flex flex-col h-full transition-all duration-300 border-zinc-100 group-hover:shadow-[0_20px_50px_rgba(33,53,49,0.1)] group-hover:border-zinc-200 ${anyInCart ? 'bg-brand-green/5' : ''} ${item.isAvailable === false ? 'opacity-50 grayscale pointer-events-none' : ''}`}>

        
        {/* Image Container */}
        <div className="relative mx-auto aspect-square w-full max-w-[120px] mb-4">
          <div className="w-full h-full rounded-2xl shadow-xl border-4 border-white bg-zinc-50 overflow-hidden relative">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
              referrerPolicy="no-referrer"
              loading="lazy"

              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800';
              }}
            />
          </div>
          {anyInCart && (
            <div className="absolute top-0 right-0 z-40 bg-brand-green text-white p-1.5 rounded-full shadow-lg border-2 border-white transform translate-x-1/4 -translate-y-1/4">
               <Check size={12} strokeWidth={4} />
            </div>
          )}
          {item.popular && (
            <div className="absolute -top-1 -right-1 z-30 bg-brand-yellow text-brand-green text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg border border-white">
              SÉLECTION
            </div>
          )}

          {item.isVeggie && (
             <div className="absolute top-0 left-0 z-30 bg-brand-green text-white p-1 rounded-full shadow-md">
               <Star size={10} fill="currentColor" />
             </div>
          )}
          {item.isAvailable === false && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 rounded-2xl">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded-lg shadow-xl -rotate-12 border-2 border-white/50">Rupture</span>
            </div>
          )}
        </div>


        {/* Name and Ingredients */}
        <div className="flex-grow text-center">
          <h4 className="text-xl font-serif font-bold text-zinc-900 mb-2 leading-tight group-hover:text-brand-green transition-colors">
            {item.name}
          </h4>
          
          <p className="text-zinc-500 text-[10px] italic mb-3 line-clamp-2">
            {item.ingredients} 
          </p>

          {/* Qui prend quoi ? */}
          {cartItems.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-3 px-2">
              {cartItems.map((cartItem, idx) => (
                <div 
                  key={idx} 
                  onClick={e => e.stopPropagation()}
                  className="bg-brand-green/10 text-brand-green text-[8px] font-black uppercase px-2 py-0.5 rounded-md border border-brand-green/10 flex items-center gap-1 animate-in zoom-in-50 duration-300 pointer-events-auto"
                >
                  <span>{cartItem.customName || 'Sans nom'}</span>
                  <span className="opacity-50 text-[7px]">({cartItem.size.toUpperCase()})</span>
                </div>
              ))}
            </div>
          )}

          {/* Size Selector (Static - can be removed if using Step 1) */}
          {/* I keep it visible for quick selection, but Step 1 will enforce it for new adds */}
        </div>
        
        {/* Price and Cart Action */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-50" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col">
            <span className="text-[14px] font-serif font-bold text-brand-green">
              {currentPrice.toFixed(2)}€
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 w-full min-h-[44px]">
            {orderStep === 'size' && hasMultipleSizes ? (
              <div className="flex flex-col gap-2 w-full animate-in slide-in-from-right-2 duration-300">
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest text-center">Taille ?</span>
                <div className="flex gap-1">
                  {[
                    { id: 't1', label: 'T1' },
                    { id: 't2', label: 'T2' },
                    { id: 't3', label: 'T3' }
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => {
                        setSelectedSize(size.id as any);
                        setOrderStep('name');
                      }}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all border ${
                        selectedSize === size.id
                          ? 'bg-brand-green text-white border-brand-green'
                          : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-200'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                  <button 
                    onClick={() => setOrderStep('idle')}
                    className="px-3 bg-zinc-50 text-zinc-400 rounded-lg text-[10px] font-black"
                  >
                    X
                  </button>
                </div>
              </div>
            ) : orderStep === 'name' ? (
              <div className="flex flex-col gap-2 w-full animate-in slide-in-from-right-2 duration-300">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Pour qui ? (Optionnel)"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onAddToCart(selectedSize, tempName);
                      setOrderStep('idle');
                      setTempName('');
                    }
                  }}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 transition-all font-sans"
                />
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      onAddToCart(selectedSize, tempName);
                      setOrderStep('idle');
                      setTempName('');
                    }}
                    className="flex-1 bg-brand-green text-white py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all shadow-sm"
                  >
                    OK / Valider
                  </button>
                  <button 
                    onClick={() => {
                      // On peut aussi juste annuler ou ajouter sans nom
                      onAddToCart(selectedSize);
                      setOrderStep('idle');
                      setTempName('');
                    }}
                    className="px-3 bg-zinc-100 text-zinc-400 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                  >
                    Sauter
                  </button>
                </div>
              </div>
            ) : quantity > 0 ? (
              <div className="flex items-center gap-2 bg-brand-green/10 rounded-xl p-1 border border-brand-green/20 w-full justify-between">
                <button 
                  onClick={() => onUpdateQuantity(`${item.id}-${selectedSize}-${itemInCart?.customName || ''}`, -1)}
                  className="w-9 h-9 flex items-center justify-center bg-white text-brand-green rounded-lg shadow-sm hover:bg-brand-yellow transition-colors"
                >
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span className="text-base font-black text-brand-green min-w-[30px] text-center">
                  {quantity}
                </span>
                <button 
                  onClick={() => {
                    if (hasMultipleSizes) setOrderStep('size');
                    else setOrderStep('name');
                  }}
                  className="w-9 h-9 flex items-center justify-center bg-brand-green text-white rounded-lg shadow-sm hover:bg-zinc-900 transition-colors"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  if (hasMultipleSizes) setOrderStep('size');
                  else setOrderStep('name');
                }}
                className={`flex-1 bg-brand-green text-white p-2.5 rounded-xl font-black text-sm hover:bg-brand-yellow hover:text-brand-green transition-all shadow-md active:scale-95 flex items-center justify-center gap-2`}
              >
                <Plus size={18} />
                <span>Ajouter</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
