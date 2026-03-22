
import React from 'react';
import { MapPin, Clock, Phone, Instagram, Star, ChevronRight } from 'lucide-react';

const InfoSection = () => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[3rem] overflow-hidden aspect-square lg:aspect-auto lg:h-[600px]">
            <img 
              src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&q=80&w=1000" 
              alt="Pizzeria ambiance"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-8 left-8 right-8 bg-brand-yellow p-8 rounded-[2rem] shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white">
                  <Star className="w-6 h-6 fill-current text-brand-yellow" />
                </div>
                <div>
                  <p className="font-black text-brand-green">4.8/5 sur Google</p>
                  <p className="text-[10px] text-brand-green/60 uppercase tracking-widest font-black">Plus de 500 avis</p>
                </div>
              </div>
              <p className="text-brand-green italic font-serif font-bold">
                "La meilleure pizza de La Rochelle, sans aucun doute. La pâte est incroyable et l'accueil toujours chaleureux."
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="text-sm font-black text-brand-green uppercase tracking-[0.3em] mb-4">Où nous trouver</h2>
              <h3 className="text-5xl font-serif font-bold text-zinc-900 leading-tight mb-6">
                Passez nous voir <br /> à La Pallice
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-brand-green">
                  <MapPin className="w-5 h-5" />
                  <span className="font-black uppercase text-xs tracking-widest">Adresse</span>
                </div>
                <p className="text-zinc-600 leading-relaxed font-medium">
                  12 Rue du Port, <br />
                  17000 La Rochelle (La Pallice)
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-brand-green">
                  <Clock className="w-5 h-5" />
                  <span className="font-black uppercase text-xs tracking-widest">Horaires</span>
                </div>
                <p className="text-zinc-600 leading-relaxed font-medium">
                  Mar - Sam: 11h30 - 14h00 <br />
                  & 18h30 - 22h00 <br />
                  Dim: 18h30 - 22h00
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-brand-green">
                  <Phone className="w-5 h-5" />
                  <span className="font-black uppercase text-xs tracking-widest">Téléphone</span>
                </div>
                <p className="text-brand-green font-black text-2xl tracking-tighter">
                  05 46 42 21 02
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-brand-green">
                  <Instagram className="w-5 h-5" />
                  <span className="font-black uppercase text-xs tracking-widest">Suivez-nous</span>
                </div>
                <a 
                  href="https://www.instagram.com/la_pallice_pizza/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-brand-green transition-colors flex items-center gap-2 font-bold"
                >
                  @la_pallice_pizza <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="pt-8">
              <a href="tel:0546422102" className="w-full bg-brand-green text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-green/90 transition-all shadow-xl flex items-center justify-center gap-3">
                <Phone className="w-5 h-5" /> Appeler pour commander
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
