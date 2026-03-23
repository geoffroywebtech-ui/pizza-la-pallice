
import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { Promotion } from '../types';

interface HeroProps {
  promotions: Promotion[];
}

const Hero: React.FC<HeroProps> = ({ promotions }) => {
  const activePromos = promotions.filter(p => p.active);

  return (
    <section className="relative h-dvh flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=1920" 
          alt="Pizza artisanale"
          className="w-full h-full object-cover"
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
        />

        <div className="absolute inset-0 bg-brand-green/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl pt-16 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <h1 className="text-5xl md:text-8xl font-serif text-white font-black leading-[1.1] md:leading-[0.95] mb-8 tracking-tight">
            L'excellence de la <br />
            <span className="italic text-brand-yellow drop-shadow-sm">Pizza</span> à La Rochelle
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Pâte pétrie à la main, ingrédients frais du marché et passion italienne. 
            Découvrez le goût authentique de La Pallice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#menu" className="w-full sm:w-auto bg-brand-yellow text-brand-green px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-brand-yellow/40 text-center">
              Voir la Carte
            </a>
            <a href="#distributeur" className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all text-center">
              Notre Distributeur
            </a>
          </div>

          {/* Promotions Dynamiques */}
          {activePromos.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 flex flex-wrap justify-center gap-3"
            >
              {activePromos.map(promo => (
                <div key={promo.id} className="flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-xl">
                  <Tag className="text-brand-yellow" size={14} />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{promo.code}</span>
                  <span className="text-[10px] font-bold text-white/80">{promo.description}</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent mx-auto" />
      </motion.div>
    </section>
  );
};

export default Hero;
