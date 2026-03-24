
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, CreditCard, MapPin, Clock, Star, Smartphone, Send, ChevronRight, Gift, User, Pizza } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: ShoppingBag,
    title: 'Choisir vos pizzas',
    color: 'bg-brand-green',
    items: [
      'Parcourez la carte en faisant défiler la page',
      'Filtrez par catégorie : Sauce Tomate, Sauce Crème, Paninis, Lasagnes, Desserts, Boissons',
      'Appuyez sur "Ajouter" pour mettre un produit dans le panier',
      'Choisissez la taille si plusieurs options',
    ],
  },
  {
    icon: CreditCard,
    title: 'Valider la commande',
    color: 'bg-brand-yellow',
    items: [
      'Appuyez sur le bouton panier (en bas à droite) pour voir votre sélection',
      'Modifiez les quantités avec + et −',
      'Appuyez sur "Commander" puis remplissez : nom, téléphone, email, adresse (si livraison)',
      'Ajoutez un code promo si vous en avez un',
      'Confirmez — c\'est envoyé !',
    ],
  },
  {
    icon: Clock,
    title: 'Suivre la commande',
    color: 'bg-blue-500',
    items: [
      'Votre commande passe par : Reçue → En préparation → En livraison → Terminée',
      'Si livraison : vous recevez un lien de suivi par WhatsApp ou SMS',
      'Cliquez dessus pour suivre le livreur en temps réel sur la carte',
    ],
  },
  {
    icon: User,
    title: 'Mon Espace (historique & fidélité)',
    color: 'bg-purple-500',
    items: [
      'Appuyez sur "Mon Espace" dans le menu',
      'Entrez votre email → vous recevez un lien de connexion par mail',
      'Cliquez sur le lien → votre espace s\'ouvre automatiquement',
      'Consultez l\'historique de toutes vos commandes',
    ],
  },
  {
    icon: Gift,
    title: 'Programme Fidélité',
    color: 'bg-brand-red',
    items: [
      'Chaque pizza achetée = 1 point de fidélité',
      '10 points = 1 pizza offerte !',
      'Suivez votre progression dans "Mon Espace"',
      'Les points se cumulent automatiquement à chaque commande',
    ],
  },
  {
    icon: Smartphone,
    title: 'Installer l\'appli sur le téléphone',
    color: 'bg-zinc-700',
    items: [
      'iPhone : Safari → bouton Partage (↑) → "Sur l\'écran d\'accueil"',
      'Android : Chrome → menu ⋮ → "Installer l\'appli"',
      'L\'icône Pizza La Pallice apparaît comme une vraie application',
      'Accès rapide, plein écran, sans barre de navigateur',
    ],
  },
];

const promos = [
  { code: 'PALLICE10', desc: '10% sur la première commande' },
  { code: 'PIZZA20', desc: '5€ de réduction sur les pizzas larges' },
];

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-lg max-h-[92dvh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-brand-green p-6 pb-5 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Pizza size={22} />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">Pizza La Pallice</span>
                  </div>
                  <h2 className="text-2xl font-serif font-black">Mode d'emploi</h2>
                  <p className="text-sm opacity-80 mt-1">Tout pour commander en quelques clics</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-5"
              style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            >
              {steps.map((step, i) => (
                <div key={i} className="rounded-2xl border border-zinc-100 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50">
                    <div className={`w-8 h-8 rounded-lg ${step.color} text-white flex items-center justify-center flex-shrink-0`}>
                      <step.icon size={16} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Étape {i + 1}</span>
                      <ChevronRight size={12} className="text-zinc-300" />
                      <span className="text-sm font-bold text-zinc-800">{step.title}</span>
                    </div>
                  </div>
                  <ul className="px-4 py-3 space-y-2">
                    {step.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-zinc-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-green/40 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Codes promo */}
              <div className="rounded-2xl border border-brand-yellow/30 bg-brand-yellow/5 p-4">
                <h3 className="text-sm font-bold text-zinc-800 mb-3 flex items-center gap-2">
                  <Star size={16} className="text-brand-yellow" />
                  Codes promo disponibles
                </h3>
                <div className="space-y-2">
                  {promos.map((p) => (
                    <div key={p.code} className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-brand-green text-white text-xs font-black tracking-wider">
                        {p.code}
                      </span>
                      <span className="text-sm text-zinc-600">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note finale */}
              <p className="text-center text-xs text-zinc-400 pt-2">
                Besoin d'aide ? Appelez-nous directement ou passez en boutique.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GuideModal;
