
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem, CartItem } from '../types';
import { MENU_ITEMS, CATEGORIES } from '../data/menu';
import MenuCard from './MenuCard';
import ProductDetailModal from './ProductDetailModal';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, size: string, name?: string) => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  cart: CartItem[];
  menuItems: MenuItem[];
}


const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart, onUpdateQuantity, cart, menuItems }) => {

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [panelOffset, setPanelOffset] = useState({ top: 0, left: 0 });
  const [panelSide, setPanelSide] = useState<'left' | 'right'>('right');

  const categoriesToDisplay = activeCategory === 'all' 
    ? CATEGORIES.filter(c => c.id !== 'all')
    : CATEGORIES.filter(c => c.id === activeCategory);

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
  };

  const handleProductDetail = (product: MenuItem, e: React.MouseEvent) => {
    const cardRect = e.currentTarget.getBoundingClientRect();
    const section = document.getElementById('menu-grid-section');
    
    if (section) {
      const sectionRect = section.getBoundingClientRect();
      const relativeTop = (cardRect.top - sectionRect.top) + (cardRect.height / 2);
      const relativeLeft = cardRect.left - sectionRect.left;
      
      const centerX = sectionRect.width / 2;
      const side = relativeLeft > centerX ? 'left' : 'right';
      
      setPanelSide(side);
      
      // Positionnement FIXED centré + 40px vers le haut
      const midPoint = (cardRect.top + cardRect.height / 2) - 40; 
      const isMobile = window.innerWidth < 768;
      const modalW = isMobile ? window.innerWidth * 0.9 : 550; 
      const halfH = isMobile ? 180 : 300;
      
      const clampedTop = Math.max(halfH + 20, Math.min(window.innerHeight - halfH - 20, midPoint));

      setPanelOffset({ 
        top: clampedTop, 
        left: side === 'right' ? (cardRect.left + cardRect.width + 20) : (cardRect.left - modalW - 20)
      });
    }
    
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };


  return (
    <section id="menu" className="py-24 bg-zinc-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-sm font-black text-brand-green uppercase tracking-[0.3em] mb-4">Notre Carte</h2>
            <h3 className="text-5xl font-serif font-bold text-zinc-900 leading-tight">
              Des saveurs qui <br /> racontent une histoire
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;

              return (
                <div key={cat.id} className="relative">
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                      isActive 
                        ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' 
                        : 'bg-white text-zinc-500 hover:bg-zinc-50 border border-zinc-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div id="menu-grid-section" className="relative">
          <div className="w-full">
            <div className="space-y-16">
          {categoriesToDisplay.map((cat) => {
            let items = menuItems.filter(item => item.category === cat.id);

            if (items.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-12">
                <div className="flex items-center gap-6">
                  <h4 className="text-3xl font-serif font-bold text-zinc-900 shrink-0 uppercase tracking-tight">
                    {cat.label}
                  </h4>
                  <div className="h-px bg-zinc-200 flex-grow" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-4 lg:gap-x-4 xl:grid-cols-5">
                  {items.map((item) => (
                    <MenuCard 
                      key={item.id} 
                      item={item} 
                      cartItems={cart.filter(i => i.id === item.id)}
                      onAddToCart={(size, name) => {
                        onAddToCart(item, size, name);
                        setIsDetailOpen(false);
                      }}
                      onUpdateQuantity={onUpdateQuantity}
                      onDetailClick={(e) => handleProductDetail(item, e)}
                      onMouseEnter={(e) => handleProductDetail(item, e)}
                      onMouseLeave={() => setIsDetailOpen(false)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
            </div>
          </div>

          <AnimatePresence>
            {isDetailOpen && selectedProduct && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: panelSide === 'right' ? -20 : 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed z-[100] border-4 border-white pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden bg-white"
                style={{ 
                  top: panelOffset.top,
                  left: panelOffset.left,
                  width: window.innerWidth < 768 ? '90vw' : '400px',
                  transform: 'translateY(-50%)',
                  maxHeight: '90vh'
                }}
              >
                <ProductDetailModal 
                  key={selectedProduct.id} 
                  isOpen={isDetailOpen} 
                  onClose={() => setIsDetailOpen(false)} 
                  product={selectedProduct} 
                  cart={cart}
                  onAddToCart={(productItem, size, name) => onAddToCart(productItem, size, name)}
                  onUpdateQuantity={onUpdateQuantity}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
