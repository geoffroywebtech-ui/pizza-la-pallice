
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, CreditCard, MapPin, Clock, Star, Smartphone, ChevronRight, Gift, User, Pizza, Truck, MessageCircle, Bell, Pencil, Navigation } from 'lucide-react';

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
      'Appuyez sur "Ajouter" sur le produit souhaité',
      'Choisissez la taille : T1 (petite), T2 (moyenne) ou T3 (grande)',
      'Les produits en rupture affichent un bandeau "Rupture" et ne sont pas commandables',
      'Le badge "SÉLECTION" indique les produits recommandés par le chef',
    ],
  },
  {
    icon: Pencil,
    title: 'Personnaliser : nom sur la pizza',
    color: 'bg-indigo-500',
    items: [
      'Lors de l\'ajout au panier, un champ "Pour qui ?" apparaît',
      'Inscrivez un prénom (ex : "Pour : Tom") — utile quand on commande pour plusieurs personnes',
      'Ce nom apparaît sur le récapitulatif de commande et en cuisine',
      'Le champ est facultatif : laissez-le vide si vous commandez pour vous seul',
    ],
  },
  {
    icon: CreditCard,
    title: 'Valider la commande',
    color: 'bg-brand-yellow',
    items: [
      'Appuyez sur le bouton panier flottant (en bas à droite) pour voir votre sélection',
      'Vérifiez les articles, les noms personnalisés et les quantités (+/−)',
      'Appuyez sur "Commander" pour accéder au formulaire',
      'Remplissez : nom, téléphone, email et adresse (si livraison)',
      'Bouton "Ma position" : remplissage automatique de l\'adresse par GPS',
      'Appliquez un code promo si vous en avez un (voir liste en bas)',
      'Confirmez — votre commande est envoyée instantanément en cuisine !',
    ],
  },
  {
    icon: Clock,
    title: 'Suivi en temps réel & compteur d\'attente',
    color: 'bg-blue-500',
    items: [
      'Dès validation, votre commande passe par 4 étapes : Reçue → En préparation → En livraison → Terminée',
      'Un compteur affiche le temps écoulé depuis la prise de commande',
      'Vert : moins de 5 min — Jaune : 5 à 10 min — Rouge clignotant : plus de 10 min',
      'Ce compteur vous informe du délai avant la livraison ou le retrait',
    ],
  },
  {
    icon: Truck,
    title: 'Livraison : suivre le livreur',
    color: 'bg-emerald-500',
    items: [
      'Quand votre commande passe "En livraison", vous recevez un lien de suivi par WhatsApp ou SMS',
      'Cliquez dessus pour ouvrir la carte en direct',
      'Le point vert = le livreur, le point jaune = votre adresse',
      'La distance restante s\'affiche en temps réel (km ou mètres)',
      'La carte se recentre automatiquement quand le livreur se déplace',
    ],
  },
  {
    icon: User,
    title: 'Mon Espace (sans passer commande)',
    color: 'bg-purple-500',
    items: [
      'Appuyez sur "Mon Espace" dans le menu (icône personnage)',
      'Entrez votre email → appuyez sur "Recevoir le lien"',
      'Vérifiez votre boîte mail → cliquez sur le lien magique reçu',
      'Pas besoin de mot de passe : un lien unique et sécurisé suffit',
      'Votre espace s\'ouvre automatiquement avec votre historique',
      'Fonctionne même si vous n\'avez jamais passé de commande',
    ],
  },
  {
    icon: Gift,
    title: 'Programme de Fidélité',
    color: 'bg-brand-red',
    items: [
      'Chaque pizza achetée = 1 point de fidélité (cumulé automatiquement)',
      '10 points = 1 pizza offerte ! (badge "🎁" affiché)',
      'Barre de progression visible dans "Mon Espace"',
      'Seules les commandes terminées comptent pour les points',
      'Les points ne se perdent jamais — ils s\'accumulent commande après commande',
    ],
  },
  {
    icon: Bell,
    title: 'Notifications & alertes',
    color: 'bg-orange-500',
    items: [
      'Autorisez les notifications pour être prévenu de l\'avancement de votre commande',
      'Sur iPhone (PWA installée) : les notifications s\'affichent comme une appli native',
      'Le son de notification vous alerte même si l\'app est en arrière-plan',
    ],
  },
  {
    icon: Smartphone,
    title: 'Installer l\'appli (recommandé)',
    color: 'bg-zinc-700',
    items: [
      'iPhone : Safari → bouton Partage (carré ↑) → "Sur l\'écran d\'accueil"',
      'Android : Chrome → menu ⋮ → "Installer l\'application"',
      'L\'icône Pizza La Pallice apparaît sur votre écran d\'accueil',
      'Avantages : plein écran, accès rapide, notifications, fonctionne hors-ligne',
      'L\'app se met à jour automatiquement — rien à faire',
    ],
  },
];

const promos = [
  { code: 'PALLICE10', desc: '10% sur la première commande' },
  { code: 'PIZZA20', desc: '5€ de réduction sur les pizzas larges' },
];

const tips = [
  'Le bouton panier flottant affiche le nombre d\'articles et le total en temps réel',
  'Vous pouvez commander pour plusieurs personnes en personnalisant chaque pizza avec un prénom',
  'Pas besoin de créer de compte : l\'email + lien magique suffisent',
  'L\'app fonctionne sur tous les navigateurs : Safari, Chrome, Firefox, Brave',
  'Sur place ou en livraison — l\'application s\'adapte à votre choix',
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
                  <p className="text-sm opacity-80 mt-1">Tout savoir pour commander comme un pro</p>
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

              {/* Astuces */}
              <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 p-4">
                <h3 className="text-sm font-bold text-zinc-800 mb-3 flex items-center gap-2">
                  <Navigation size={16} className="text-brand-green" />
                  Bon à savoir
                </h3>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Note finale */}
              <p className="text-center text-xs text-zinc-400 pt-2 pb-2">
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
