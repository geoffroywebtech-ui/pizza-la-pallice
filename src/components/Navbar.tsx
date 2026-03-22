
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenHistory }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Pizza className={`w-8 h-8 ${isScrolled ? 'text-brand-green' : 'text-brand-yellow'}`} />
          <span className={`text-2xl font-serif font-bold tracking-tight ${isScrolled ? 'text-brand-green' : 'text-white'}`}>
            La Pallice Pizza
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          {['Menu', 'Distributeur', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className={`text-sm font-bold uppercase tracking-widest hover:text-brand-yellow transition-colors ${isScrolled ? 'text-brand-green' : 'text-white'}`}
            >
              {item}
            </a>
          ))}
          <div className="h-6 w-px bg-current opacity-20 mx-2" />
          <button 
            onClick={onOpenHistory}
            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-brand-yellow transition-colors ${isScrolled ? 'text-brand-green' : 'text-white'}`}
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
            <X className={isScrolled ? 'text-brand-green' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-brand-green' : 'text-white'} />
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
