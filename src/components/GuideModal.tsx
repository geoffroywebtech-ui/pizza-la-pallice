
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Pizza, ChevronRight, Shield, Clock, Truck, Users, Package,
  Tag, MessageCircle, MapPin, Star, Bell, Smartphone, Eye, Pencil, Mail,
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections = [
  {
    icon: Shield,
    title: 'Accéder au Dashboard',
    color: 'bg-brand-green',
    items: [
      'Appui long (1 seconde) sur le logo "La Pallice Pizza" → le cadenas s\'affiche',
      'Entrer le code d\'accès cuisine pour ouvrir le tableau de bord',
      'Pour revenir à la vue client : bouton "Quitter" en haut à droite',
    ],
  },
  {
    icon: Eye,
    title: 'Onglet Commandes',
    color: 'bg-blue-500',
    items: [
      'Toutes les commandes apparaissent en temps réel (max 20 visibles sans défiler)',
      'Filtres rapides : Toutes / Nouvelles / En préparation / En livraison / Terminées',
      'Le badge rouge sur "Nouvelles" clignote quand il y a des commandes non vues',
      'Un son de notification retentit à chaque nouvelle commande reçue',
    ],
  },
  {
    icon: Clock,
    title: 'Chronomètre de commande',
    color: 'bg-amber-500',
    items: [
      'Chaque commande affiche le temps écoulé depuis la prise de commande',
      'Vert : moins de 5 minutes — tout va bien',
      'Jaune : entre 5 et 10 minutes — attention',
      'Rouge clignotant : plus de 10 minutes — la commande prend du retard',
      'Le chronomètre se met à jour toutes les 10 secondes',
    ],
  },
  {
    icon: Truck,
    title: 'Gérer le statut & la livraison',
    color: 'bg-emerald-500',
    items: [
      'Cliquer sur le bouton de statut pour faire passer la commande à l\'étape suivante',
      'Workflow : Nouvelle → En préparation → En livraison → Terminée',
      'Quand on passe en "En livraison", le GPS du livreur s\'active automatiquement',
      'Le client peut suivre le livreur en temps réel sur la carte',
      'Quand la commande est "Terminée", le GPS s\'arrête automatiquement',
    ],
  },
  {
    icon: MessageCircle,
    title: 'Envoyer le lien de suivi',
    color: 'bg-green-500',
    items: [
      'Bouton WhatsApp : envoie un message pré-rempli au client avec le lien de suivi',
      'Bouton Copier : copie le message de suivi dans le presse-papier',
      'Le numéro du client est converti automatiquement au format international (06 → +33)',
      'Message envoyé : "Votre commande est en route ! Suivez votre livreur..."',
    ],
  },
  {
    icon: Package,
    title: 'Onglet Stock',
    color: 'bg-orange-500',
    items: [
      'Activer/désactiver la disponibilité de chaque produit en un clic',
      'Un produit désactivé affiche "Rupture" sur la carte client et ne peut plus être commandé',
      'Les changements de stock se propagent en temps réel à tous les clients connectés',
      'Utile en fin de soirée quand un ingrédient est épuisé',
    ],
  },
  {
    icon: Tag,
    title: 'Onglet Promotions',
    color: 'bg-purple-500',
    items: [
      'Créer et gérer les codes promo (pourcentage ou montant fixe)',
      'Activer/désactiver un code sans le supprimer',
      'Codes actuels : PALLICE10 (10%) et PIZZA20 (5€)',
      'Le client applique le code au moment du paiement',
    ],
  },
  {
    icon: Users,
    title: 'Onglet Clients',
    color: 'bg-indigo-500',
    items: [
      'Liste de tous les clients avec recherche par nom, téléphone ou email',
      'Fiche client : nombre de commandes, montant total dépensé, points fidélité',
      'Historique détaillé des commandes de chaque client',
      'Points fidélité : 1 pizza = 1 point, 10 points = 1 pizza offerte',
      'Les adresses et emails sont agrégés automatiquement depuis les commandes',
    ],
  },
  {
    icon: Pencil,
    title: 'Nom personnalisé sur les pizzas',
    color: 'bg-pink-500',
    items: [
      'Le client peut écrire un prénom sur chaque pizza (champ "Pour qui ?")',
      'Le nom apparaît dans le récapitulatif et sur le ticket en cuisine',
      'Pratique quand un client commande pour plusieurs personnes',
      'Champ facultatif — n\'apparaît que si rempli',
    ],
  },
  {
    icon: Star,
    title: 'Fidélité & Magic Link',
    color: 'bg-brand-yellow',
    items: [
      'Le client accède à son espace via "Mon Espace" → email → lien magique (sans mot de passe)',
      'Il voit son historique de commandes et ses points de fidélité',
      'Aucune action requise de votre part : tout est automatique',
      'Le client peut consulter son espace même sans passer de commande',
    ],
  },
  {
    icon: Smartphone,
    title: 'Application mobile (PWA)',
    color: 'bg-zinc-700',
    items: [
      'L\'app peut être installée sur iPhone et Android comme une vraie application',
      'Fonctionne en plein écran, avec notifications et accès hors-ligne',
      'L\'app se met à jour automatiquement à chaque visite',
      'Les clients installent depuis Safari (iPhone) ou Chrome (Android)',
    ],
  },
  {
    icon: Mail,
    title: 'Emails automatiques',
    color: 'bg-cyan-500',
    items: [
      'Email de confirmation envoyé automatiquement à chaque nouvelle commande (si le client a renseigné son email)',
      'Contenu : numéro de commande, liste des articles avec noms personnalisés, total, lien vers l\'espace client',
      'Magic Link : le client reçoit un lien de connexion sécurisé (sans mot de passe) pour accéder à son historique',
      'Service : Resend (SMTP) — 100 emails/jour gratuits, délivrabilité fiable',
      'Les emails arrivent en moins de 30 secondes',
      'Aucune action requise de votre part : tout est automatique via Supabase',
    ],
  },
  {
    icon: MapPin,
    title: 'Géolocalisation & carte',
    color: 'bg-teal-500',
    items: [
      'Le client peut remplir son adresse automatiquement via GPS (bouton "Ma position")',
      'La carte de suivi utilise OpenStreetMap (gratuit, sans licence)',
      'Le livreur est représenté par un point vert, le client par un point jaune',
      'La distance restante s\'affiche en km ou mètres en temps réel',
    ],
  },
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
            className="relative w-full sm:max-w-xl max-h-[92dvh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-zinc-900 p-6 pb-5 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Pizza size={22} className="text-brand-yellow" />
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Documentation Admin</span>
                  </div>
                  <h2 className="text-2xl font-serif font-black">Mode d'emploi</h2>
                  <p className="text-sm text-zinc-400 mt-1">Guide complet du tableau de bord</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4"
              style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            >
              {sections.map((sec, i) => (
                <details key={i} className="group rounded-2xl border border-zinc-100 overflow-hidden">
                  <summary className="flex items-center gap-3 px-4 py-3 bg-zinc-50 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                    <div className={`w-8 h-8 rounded-lg ${sec.color} text-white flex items-center justify-center flex-shrink-0`}>
                      <sec.icon size={16} />
                    </div>
                    <span className="text-sm font-bold text-zinc-800 flex-1">{sec.title}</span>
                    <ChevronRight size={14} className="text-zinc-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <ul className="px-4 py-3 space-y-2 border-t border-zinc-100">
                    {sec.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-zinc-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-green/40 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}

              <p className="text-center text-xs text-zinc-400 pt-2 pb-2">
                Pizza La Pallice — Documentation interne v1.0
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GuideModal;
