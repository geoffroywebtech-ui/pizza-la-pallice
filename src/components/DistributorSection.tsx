
import React from 'react';
import { Pizza } from 'lucide-react';

const DistributorSection = () => {
  return (
    <section id="distributeur" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-brand-green rounded-[3rem] p-12 md:p-20 text-white shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-1 rounded-full bg-brand-yellow text-brand-green text-xs font-black uppercase tracking-[0.2em] mb-6">7J/7 • 24H/24</span>
                <h2 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">Notre <span className="text-brand-yellow">Distributeur</span> Automatique</h2>
                <p className="text-white/80 text-lg leading-relaxed">Artisanat à toute heure au 358 Av. Jean Guiton.</p>
              </div>
            </div>
            <div className="relative aspect-square bg-white rounded-[2.5rem] p-8 shadow-inner flex items-center justify-center overflow-hidden border-8 border-brand-yellow">
              <Pizza className="w-24 h-24 text-brand-green" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributorSection;
