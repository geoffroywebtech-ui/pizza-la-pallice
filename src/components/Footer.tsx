
import React from 'react';
import { Pizza, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-green py-24 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Pizza className="text-brand-green" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold">Pizza La Pallice</h1>
                <p className="text-[10px] text-brand-yellow font-black uppercase tracking-[0.3em]">Depuis 2012</p>
              </div>
            </div>
            <p className="text-white/60 text-lg max-w-sm font-medium">L'art de la pizza napolitaine au coeur de La Rochelle. Ingrédients d'origine contrôlée et passion du goût.</p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-brand-yellow hover:text-brand-green transition-all"><Instagram size={20} /></a>
              <a href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-brand-yellow hover:text-brand-green transition-all"><Facebook size={20} /></a>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-yellow">Navigation</p>
            <ul className="space-y-4 font-bold text-white/80">
              <li><a href="#menu" className="hover:text-white transition-colors">Notre Carte</a></li>
              <li><a href="#distributeur" className="hover:text-white transition-colors">Distributeur 24/7</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-[10px] uppercase tracking-[0.2em] font-black">
          <p>© 2024 La Pallice Pizza. Tous droits réservés.</p>
          <div className="flex gap-4">
            <p>Fait avec passion à La Rochelle</p>
            <button onClick={() => (window as any).toggleAdmin()} className="hover:text-brand-yellow transition-colors cursor-pointer">• Accès Restaurant</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
