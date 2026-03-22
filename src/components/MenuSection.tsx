
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { MENU_ITEMS, CATEGORIES } from '../data/menu';
import MenuCard from './MenuCard';
import ProductDetailModal from './ProductDetailModal';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, size: string, name?: string) => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  cart: CartItem[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart, onUpdateQuantity, cart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [panelOffset, setPanelOffset] = useState({ top: 0, left: 0 });
  const [panelSide, setPanelSide] = useState<'left' | 'right'>('right');
  const [isPizzasHovered, setIsPizzasHovered] = useState(false);

  const categoriesToDisplay = activeCategory === 'all' 
    ? CATEGORIES.filter(c => c.id !== 'all')
    : CATEGORIES.filter(c => c.id === activeCategory);

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    setActiveSubCategory(null);
  };

  const handleSubCategoryClick = (subId: string) => {
    setActiveCategory('pizzas');
    setActiveSubCategory(subId);
    setIsPizzasHovered(false);
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
              const isPizzas = cat.id === 'pizzas';
              const isActive = activeCategory === cat.id;

              return (
                <div 
                  key={cat.id} 
                  className="relative"
                  onMouseEnter={() => isPizzas && setIsPizzasHovered(true)}
                  onMouseLeave={() => isPizzas && setIsPizzasHovered(false)}
                >
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                      isActive 
                        ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' 
                        : 'bg-white text-zinc-500 hover:bg-zinc-50 border border-zinc-100'
                    }`}
                  >
                    {cat.label}
                    {isPizzas && <ChevronDown size={14} className={`transition-transform ${isPizzasHovered ? 'rotate-180' : ''}`} />}
                  </button>

                  {isPizzas && (
                    <AnimatePresence>
                      {isPizzasHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-[80%] left-0 pt-4 w-56 z-50 pointer-events-auto"
                        >
                          <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-2 overflow-hidden">
                            <button
                              onClick={() => handleSubCategoryClick('Base Tomate')}
                              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:bg-brand-green hover:text-white transition-all flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                              Pizza Sauce Tomate
                            </button>
                            <button
                              onClick={() => handleSubCategoryClick('Base Crème')}
                              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:bg-brand-green hover:text-white transition-all flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-100 border border-zinc-200" />
                              Pizza Sauce Crème Fraîche
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div id="menu-grid-section" className="relative">
          <div className="w-full">
            <div className="space-y-16">
          {categoriesToDisplay.map((cat) => {
            let items = MENU_ITEMS.filter(item => item.category === cat.id);
            if (cat.id === 'pizzas' && activeSubCategory) {
              items = items.filter(i => i.subCategory === activeSubCategory);
            }
            
            if (items.length === 0) return null;

            const itemsWithSubCategory = items.filter(i => i.subCategory);
            const itemsWithoutSubCategory = items.filter(i => !i.subCategory);
            const subCategories = Array.from(new Set(itemsWithSubCategory.map(i => i.subCategory))).filter(Boolean);

            return (
              <div key={cat.id} className="space-y-12">
                <div className="flex items-center gap-6">
                  <h4 className="text-3xl font-serif font-bold text-zinc-900 shrink-0 uppercase tracking-tight">
                    {activeSubCategory && cat.id === 'pizzas' ? `Pizzas : ${activeSubCategory}` : cat.label}
                  </h4>
                  <div className="h-px bg-zinc-200 flex-grow" />
                </div>

                {subCategories.length > 0 ? (
                  <div className="space-y-16">
                    {subCategories.map(subCat => {
                      const subItems = itemsWithSubCategory.filter(i => i.subCategory === subCat);
                      return (
                        <div key={subCat as string} className="space-y-8">
                          <div className="flex items-center gap-4">
                            <h5 className="text-lg font-bold text-brand-green uppercase tracking-widest pl-4 border-l-4 border-brand-green">
                              {subCat}
                            </h5>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-4 lg:gap-x-4 xl:grid-cols-5">
                            {subItems.map((item) => (
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
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-4 lg:gap-x-4 xl:grid-cols-5">
                    {itemsWithoutSubCategory.map((item) => (
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
                )}
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
                className="fixed z-[100] pointer-events-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white"
                style={{ 
                  top: panelOffset.top,
                  left: panelOffset.left,
                  width: window.innerWidth < 768 ? '90vw' : '550px',
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
