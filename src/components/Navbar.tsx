
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  onLogoClick?: () => void;
}


const Navbar: React.FC<NavbarProps> = ({ onOpenHistory, onLogoClick }) => {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);

  const startLongPress = () => {
    const timer = window.setTimeout(() => {
      onLogoClick?.();
      setLongPressTimer(null);
    }, 1000); // 1 seconde
    setLongPressTimer(timer);
  };

  const cancelLongPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };


  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/95 backdrop-blur-md border-b border-zinc-100 ${isScrolled ? 'py-2' : 'py-3'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group select-none relative"
          onMouseDown={startLongPress}
          onMouseUp={cancelLongPress}
          onMouseLeave={cancelLongPress}
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
        >
          <div className="relative">
            <Pizza className="w-8 h-8 transition-transform group-active:scale-95 text-brand-green" />
            {longPressTimer && (
              <svg className="absolute -top-1 -left-1 w-10 h-10 -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray="113.1"
                  className="text-brand-green/20"
                />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray="113.1"
                  initial={{ strokeDashoffset: 113.1 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1, ease: "linear" }}
                  className="text-brand-green"
                />
              </svg>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-xl md:text-2xl font-serif font-black tracking-tighter text-brand-green">
              La Pallice Pizza
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-brand-yellow/10 text-brand-green text-[9px] font-black uppercase tracking-widest border border-brand-yellow/20">
              Artisanal & Local
            </span>
          </div>
        </div>


        
        <div className="hidden md:flex items-center gap-6">
          {['Menu', 'Distributeur', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className={`text-sm font-bold uppercase tracking-widest hover:text-brand-yellow transition-colors text-brand-green`}
            >
              {item}
            </a>
          ))}
          <div className="h-6 w-px bg-current opacity-20 mx-2" />
          <button 
            onClick={onOpenHistory}
            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-brand-yellow transition-colors text-brand-green`}
          >
            <User size={18} />
            <span>Mon Espace</span>
          </button>
          <a href="#menu" className="bg-brand-green text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-brand-green/90 transition-colors shadow-lg shadow-brand-green/20">
            Commander
          </a>
        </div>

        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="text-brand-green" />
          ) : (
            <Menu className="text-brand-green" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl p-6 flex flex-col gap-4 md:hidden"
          >
            {['Menu', 'Distributeur', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-lg font-bold text-brand-green border-b border-zinc-100 pb-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => {
                onOpenHistory();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-lg font-bold text-brand-green border-b border-zinc-100 pb-2"
            >
              <User size={20} />
              <span>Mon Espace</span>
            </button>
            <a href="#menu" onClick={() => setIsMobileMenuOpen(false)} className="bg-brand-green text-white px-6 py-3 rounded-xl text-center font-bold">
              Commander maintenant
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
