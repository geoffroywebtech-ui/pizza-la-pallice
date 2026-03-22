
import React from 'react';
import { motion } from 'framer-motion';

const IngredientsSection = () => {
  const ingredients = [
    {
      title: "Pâte Artisanale",
      description: "Notre pâte repose 48h minimum pour garantir une légèreté et un croustillant incomparable à chaque bouchée.",
      image: "https://images.unsplash.com/photo-1556291931-e1e57c638e9d?auto=format&fit=crop&q=80&w=800",
      icon: "🥖"
    },
    {
      title: "Tomates Fraîches",
      description: "Une sauce élaborée à partir de tomates italiennes mûries au soleil et de basilic frais pour un goût authentique.",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
      icon: "🍅"
    },
    {
      title: "Mozzarella Fondante",
      description: "Une mozzarella crémeuse qui fond délicatement pour lier tous les ingrédients dans une harmonie parfaite.",
      image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&q=80&w=800",
      icon: "🧀"
    },
    {
      title: "Légumes Frais",
      description: "Poivrons, aubergines, champignons... tous nos légumes sont coupés chaque matin pour garantir leur fraîcheur.",
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=800",
      icon: "🥬"
    }
  ];

  return (
    <section className="py-24 bg-zinc-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-brand-green uppercase tracking-[0.3em] mb-4">Le Secret du Goût</h2>
          <h3 className="text-5xl font-serif font-bold text-zinc-900 leading-tight">
            La Qualité <span className="text-brand-green italic">avant tout</span>
          </h3>
          <div className="w-24 h-1 bg-brand-yellow mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {ingredients.map((ing, index) => (
            <motion.div
              key={ing.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-zinc-100 group"
            >
              <div className="w-full md:w-48 h-48 shrink-0 rounded-3xl overflow-hidden relative">
                <img 
                  src={ing.image} 
                  alt={ing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-green/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg">
                  {ing.icon}
                </div>
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h4 className="text-2xl font-serif font-bold text-zinc-900 group-hover:text-brand-green transition-colors">
                  {ing.title}
                </h4>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  {ing.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IngredientsSection;
