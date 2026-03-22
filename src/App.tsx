/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pizza, 
  MapPin, 
  Phone, 
  Instagram, 
  Clock, 
  ChevronRight, 
  Star, 
  ShoppingBag,
  Menu as MenuIcon,
  X
} from 'lucide-react';

// --- Types ---
interface MenuItem {
  id: string;
  name: string;
  ingredients: string;
  price: number;
  category: 'classique' | 'speciale' | 'vegetarienne' | 'dessert' | 'boisson' | 'menu';
  image: string;
  popular?: boolean;
}

// --- Constants ---
const MENU_ITEMS: MenuItem[] = [
  { 
    id: '1', 
    name: '4 Fromages', 
    ingredients: 'chèvre, roquefort, mozzarella, emmental, olives, origan', 
    price: 10.50, 
    category: 'classique',
    image: 'images-produit/pizza/4-Fromages.png'
  },
  { 
    id: '2', 
    name: 'Poularde', 
    ingredients: 'pommes de terre, poulet, oignons, oeuf, fromages, olives, origan', 
    price: 10.50, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '3', 
    name: 'Kebab', 
    ingredients: 'poivrons, oignons, viande à kebab, fromages, olives, origan, sauce blanche', 
    price: 11.00, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '4', 
    name: 'Texane', 
    ingredients: 'merguez, chorizo, poulet, viande hachée, oignons rouges, fromages, olives, origan', 
    price: 11.00, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '5', 
    name: 'Pepperoni', 
    ingredients: 'pepperoni, viande hachée, fromages, oeuf, olives, origan', 
    price: 11.80, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '6', 
    name: 'Charentaise', 
    ingredients: 'jambon, oignons, champignons, poitrine fumée, crème fraiche, persillade, fromages, olives, origan', 
    price: 11.80, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '7', 
    name: 'Barbecue', 
    ingredients: 'viande hachée, cheddar, tomates fraîches, salade, oignons rouges, fromages, olives, origan, sauce barbecue', 
    price: 11.80, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '8', 
    name: 'Orientale', 
    ingredients: 'champignons, merguez, oignons, poivrons, viande hachée, fromages, olives, origan', 
    price: 11.00, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '9', 
    name: 'Margarita', 
    ingredients: 'fromages, olives, origan', 
    price: 7.50, 
    category: 'classique',
    image: 'images-produit/pizza/Margherita.png'
  },
  { 
    id: '10', 
    name: 'Bambini', 
    ingredients: 'jambon, fromages, olives, origan', 
    price: 8.50, 
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '11', 
    name: 'Reine', 
    ingredients: 'jambon, champignons, fromages, olives, origan', 
    price: 9.00, 
    category: 'classique',
    image: 'images-produit/pizza/Reine.png'
  },
  { 
    id: '12', 
    name: 'Roquefort', 
    ingredients: 'oignons, roquefort, crème fraiche, lardons, fromages, olives, origan', 
    price: 9.50, 
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '13', 
    name: 'Romaine', 
    ingredients: "oignons, filets d'anchois, câpres, poivrons, fromages, olives, origan", 
    price: 9.50, 
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '14', 
    name: 'Apache', 
    ingredients: 'oignons, poulet, crème fraiche, curry, fromages, olives, origan', 
    price: 9.50, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '15', 
    name: 'Mixte', 
    ingredients: 'ananas, poulet, crème fraîche, curry, fromages, olives, origan', 
    price: 9.50, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '16', 
    name: 'Vendéenne', 
    ingredients: 'jambon de pays, oignons, crème fraîche, fromages, olives, origan', 
    price: 9.50, 
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '17', 
    name: 'Chevrette', 
    ingredients: 'chèvre, crème fraiche, fromages, olives, origan', 
    price: 9.50, 
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '18', 
    name: 'Végétarienne', 
    ingredients: 'oignons, poivrons, champignons, fromages, olives, origan', 
    price: 9.50, 
    category: 'vegetarienne',
    image: 'images-produit/pizza/Vegetarienne.png'
  },
  { 
    id: '19', 
    name: 'Norvégienne', 
    ingredients: 'saumon fumé, crème fraîche, fromages, olives, origan', 
    price: 10.50, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '20', 
    name: 'Bolognaise', 
    ingredients: 'viande de boeuf hachée cuisinée, fromages, olives, origan', 
    price: 10.50, 
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '21', 
    name: 'Magret', 
    ingredients: 'magret, champignons, poivre vert, fromages, olives, origan', 
    price: 10.50, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '22', 
    name: 'Salaison', 
    ingredients: 'merguez, jambon, lardons, chorizo, fromages, olives, origan', 
    price: 10.50, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '23', 
    name: 'Champêtre', 
    ingredients: 'mozzarella, poivrons, chèvre, pesto, olives, origan', 
    price: 10.50, 
    category: 'vegetarienne',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '24', 
    name: 'Speciale', 
    ingredients: 'jambon, oignons, oeuf, poivrons, champignons, fromages, olives, origan', 
    price: 10.50, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '25', 
    name: 'La Pallice', 
    ingredients: 'jambon, gésiers, champignons, chèvre, fromages, olives, origan', 
    price: 10.50, 
    category: 'speciale',
    image: 'images-produit/pizza/La-Pallice.png'
  },
  { 
    id: '26', 
    name: 'Campagnarde', 
    ingredients: 'oignons, champignons, lardons, jambon, fromages, oeuf, olives, origan', 
    price: 10.50, 
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '27', 
    name: 'Delicieuse', 
    ingredients: 'oignons, poulet, poivrons, chorizo, crème fraiche, fromages, olives, origan', 
    price: 10.50, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '28', 
    name: 'Parma', 
    ingredients: 'jambon de parme, tomates confites, parmesan, pesto, fromages, olives, origan', 
    price: 11.80, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '29', 
    name: 'Cesar', 
    ingredients: 'tenders de poulet, tomates confites, parmesan, salade, fromages, olives, origan, sauce césar', 
    price: 11.80, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '30', 
    name: 'Savoureuse', 
    ingredients: 'champignons, gésiers, magret fumé, foie gras, noix, salade, fromages, origan, vinaigre de framboise', 
    price: 13.00, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '31', 
    name: '6 Fromages', 
    ingredients: 'chèvre, cheddar, reblochon, emmental, roquefort, mozzarella, olives, origan', 
    price: 11.80, 
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '32', 
    name: 'Saumon', 
    ingredients: 'pommes de terre, saumon, persillade, fromages, olives, origan', 
    price: 11.80, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '33', 
    name: 'Montagnarde', 
    ingredients: 'jambon de pays, pommes de terre, coppa, jambon, raclette, fromages, olives, origan', 
    price: 11.80, 
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '34', 
    name: 'Burger', 
    ingredients: 'viande hachée, cheddar, tomates fraîches, salade, oignons, fromages, olives, origan, sauce burger', 
    price: 11.80, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '35', 
    name: 'Maya', 
    ingredients: 'lardons, tomates confites, chèvre, fromages, olives, origan, miel', 
    price: 11.80, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '36', 
    name: 'Forestière', 
    ingredients: "moutarde à l'ancienne, poulet, champignons, fromages, olives, origan", 
    price: 11.80, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '37', 
    name: 'Cannibale', 
    ingredients: 'pommes de terre, poulet, viande hachée, kebab, lardons, chorizo, fromages, olives, origan, sauce samouraï', 
    price: 11.80, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '38', 
    name: 'Chicken', 
    ingredients: 'tenders de poulet, tomates fraiches, cheddar, salade, oignons rouges, fromages, olives, origan, sauce pomme frite', 
    price: 11.80, 
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '39', 
    name: 'Chevre Miel', 
    ingredients: 'chèvre, miel, noix, fromages, olives, origan', 
    price: 10.50, 
    category: 'speciale',
    image: 'images-produit/pizza/Chèvre-Miel.png'
  },
  { 
    id: '40', 
    name: 'Savoyarde', 
    ingredients: 'pommes de terre, lardons, reblochon, fromages, origan', 
    price: 10.50, 
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '41', 
    name: 'Pizza Nutella', 
    ingredients: 'Pâte à pizza, Nutella', 
    price: 6.00, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '42', 
    name: 'Panini Nutella', 
    ingredients: 'Pain panini, Nutella', 
    price: 4.00, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '43', 
    name: 'Tiramisu', 
    ingredients: 'Dessert italien au café', 
    price: 3.50, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '44', 
    name: 'Tarte Daim', 
    ingredients: 'Tarte au chocolat et éclats de Daim', 
    price: 3.50, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '45', 
    name: 'Fondant Chocolat', 
    ingredients: 'Gâteau au chocolat au cœur coulant', 
    price: 3.50, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '46', 
    name: 'Glace Häagen-Dazs (100ml)', 
    ingredients: 'Pot de glace 100ml', 
    price: 3.50, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '47', 
    name: 'Glace Häagen-Dazs (460ml)', 
    ingredients: 'Pot de glace 460ml', 
    price: 6.50, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '48', 
    name: 'Soda 33cl', 
    ingredients: 'Canette 33cl', 
    price: 2.00, 
    category: 'boisson',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '49', 
    name: 'Soda 1.5L', 
    ingredients: 'Bouteille 1.5L', 
    price: 3.50, 
    category: 'boisson',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '50', 
    name: 'Bière Heineken 33cl', 
    ingredients: 'Bière blonde 33cl', 
    price: 2.50, 
    category: 'boisson',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '51', 
    name: 'Bière Desperados 33cl', 
    ingredients: 'Bière aromatisée 33cl', 
    price: 3.00, 
    category: 'boisson',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '52', 
    name: 'Vin Rosé 75cl', 
    ingredients: 'Bouteille de vin rosé 75cl', 
    price: 9.00, 
    category: 'boisson',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '53', 
    name: 'Menu Enfant', 
    ingredients: '1 petite pizza au choix + 1 compote + 1 Capri-Sun', 
    price: 7.50, 
    category: 'menu',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '54', 
    name: 'Océane', 
    ingredients: 'fruits de mer, ail, persillade, fromages, olives, origan', 
    price: 11.50, 
    category: 'speciale',
    image: 'images-produit/pizza/Oceane.png'
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tout' },
  { id: 'classique', label: 'Classiques' },
  { id: 'speciale', label: 'Spéciales' },
  { id: 'vegetarienne', label: 'Végé' },
  { id: 'dessert', label: 'Desserts' },
  { id: 'boisson', label: 'Boissons' },
  { id: 'menu', label: 'Menus' },
];

// --- Components ---

const PizzaVisual = ({ id }: { id: string }) => {
  const isCalzone = id === '8';
  
  // Base colors
  const crustColor = "#D2B48C";
  const tomatoSauce = "#C62828";
  const creamSauce = "#FFF9C4";
  const cheeseColor = "#FFFDE7";
  
  const getSauceColor = (id: string) => {
    const whiteBase = ['4', '7'];
    return whiteBase.includes(id) ? creamSauce : tomatoSauce;
  };

  const renderToppings = (id: string) => {
    switch (id) {
      case '1': // Margherita: olives, origan
        return (
          <>
            <circle cx="50" cy="30" r="2" fill="#212121" />
            <circle cx="70" cy="60" r="2" fill="#212121" />
            <circle cx="35" cy="65" r="2" fill="#212121" />
            {[...Array(20)].map((_, i) => (
              <circle key={i} cx={20 + Math.random() * 60} cy={20 + Math.random() * 60} r="0.5" fill="#2E7D32" />
            ))}
          </>
        );
      case '2': // Reine: jambon, champignons, olives
        return (
          <>
            <rect x="30" y="30" width="8" height="8" fill="#F48FB1" rx="1" />
            <rect x="60" y="40" width="8" height="8" fill="#F48FB1" rx="1" />
            <rect x="45" y="65" width="8" height="8" fill="#F48FB1" rx="1" />
            <circle cx="40" cy="45" r="5" fill="#BCAAA4" />
            <circle cx="65" cy="25" r="5" fill="#BCAAA4" />
            <circle cx="25" cy="60" r="5" fill="#BCAAA4" />
            <circle cx="50" cy="50" r="2" fill="#212121" />
          </>
        );
      case '3': // 4 Fromages: different cheese spots
        return (
          <>
            <circle cx="40" cy="35" r="10" fill="#E1F5FE" opacity="0.6" />
            <circle cx="65" cy="55" r="8" fill="#FFF59D" opacity="0.8" />
            <circle cx="35" cy="65" r="7" fill="#81C784" opacity="0.4" />
          </>
        );
      case '4': // La Pallice: lardons, oignons, pommes de terre
        return (
          <>
            <rect x="30" y="35" width="4" height="10" fill="#E57373" rx="1" />
            <rect x="65" y="45" width="4" height="10" fill="#E57373" rx="1" />
            <circle cx="50" cy="30" r="8" fill="#FFF176" opacity="0.7" />
            <circle cx="40" cy="60" r="8" fill="#FFF176" opacity="0.7" />
            <circle cx="50" cy="50" r="12" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
          </>
        );
      case '5': // Océane: fruits de mer
        return (
          <>
            <path d="M40,40 Q45,35 50,40" stroke="#FFAB91" fill="none" strokeWidth="3" />
            <circle cx="60" cy="30" r="4" fill="#FFCCBC" />
            <circle cx="30" cy="60" r="3" fill="#B2EBF2" />
            {[...Array(15)].map((_, i) => (
              <circle key={i} cx={20 + Math.random() * 60} cy={20 + Math.random() * 60} r="0.8" fill="#4CAF50" />
            ))}
          </>
        );
      case '6': // Végétarienne: poivrons, aubergines, courgettes
        return (
          <>
            <rect x="30" y="30" width="15" height="3" fill="#43A047" rx="1" transform="rotate(45 30 30)" />
            <rect x="60" y="50" width="15" height="3" fill="#E53935" rx="1" transform="rotate(-30 60 50)" />
            <circle cx="45" cy="60" r="7" fill="#7E57C2" opacity="0.6" />
            <circle cx="50" cy="35" r="6" fill="#81C784" opacity="0.8" />
          </>
        );
      case '7': // Chèvre Miel: chèvre, miel, noix
        return (
          <>
            <circle cx="40" cy="40" r="8" fill="white" />
            <circle cx="65" cy="60" r="8" fill="white" />
            <path d="M30,30 C50,20 50,80 70,70" stroke="#FFB300" fill="none" strokeWidth="2" opacity="0.6" />
            <circle cx="55" cy="35" r="4" fill="#795548" />
          </>
        );
      case '9': // Orientale: merguez, poivrons, œuf
        return (
          <>
            <rect x="35" y="35" width="12" height="4" fill="#8D6E63" rx="2" />
            <rect x="60" y="60" width="12" height="4" fill="#8D6E63" rx="2" />
            <rect x="30" y="60" width="10" height="2" fill="#43A047" rx="1" />
            <circle cx="50" cy="50" r="12" fill="white" />
            <circle cx="50" cy="50" r="5" fill="#FFD600" />
          </>
        );
      case '10': // Paysanne: lardons, oignons, œuf
        return (
          <>
            <rect x="30" y="30" width="4" height="8" fill="#E57373" rx="1" />
            <rect x="65" y="40" width="4" height="8" fill="#E57373" rx="1" />
            <circle cx="50" cy="50" r="12" fill="white" />
            <circle cx="50" cy="50" r="5" fill="#FFD600" />
            <circle cx="40" cy="65" r="10" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
          </>
        );
      case '11': // Bolognaise: viande hachée, oignons
        return (
          <>
            {[...Array(30)].map((_, i) => (
              <circle key={i} cx={25 + Math.random() * 50} cy={25 + Math.random() * 50} r="1.5" fill="#5D4037" />
            ))}
            <circle cx="40" cy="40" r="12" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
            <circle cx="60" cy="60" r="12" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
          </>
        );
      case '12': // Hawaïenne: jambon, ananas
        return (
          <>
            <rect x="30" y="30" width="8" height="8" fill="#F48FB1" rx="1" />
            <rect x="60" y="40" width="8" height="8" fill="#F48FB1" rx="1" />
            <rect x="40" y="60" width="6" height="6" fill="#FFEE58" rx="1" />
            <rect x="65" y="25" width="6" height="6" fill="#FFEE58" rx="1" />
            <rect x="25" y="55" width="6" height="6" fill="#FFEE58" rx="1" />
          </>
        );
      default:
        return null;
    }
  };

  if (isCalzone) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
        <path d="M10,50 A40,40 0 0,1 90,50 L10,50 Z" fill={crustColor} />
        <path d="M15,50 A35,35 0 0,1 85,50 L15,50 Z" fill={tomatoSauce} opacity="0.3" />
        <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#A1887F" strokeWidth="2" strokeDasharray="4 2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
      {/* Crust */}
      <circle cx="50" cy="50" r="48" fill={crustColor} />
      <circle cx="50" cy="50" r="45" fill="#BCAAA4" opacity="0.3" />
      
      {/* Sauce */}
      <circle cx="50" cy="50" r="40" fill={getSauceColor(id)} />
      
      {/* Cheese Base */}
      <circle cx="50" cy="50" r="38" fill={cheeseColor} opacity="0.8" />
      
      {/* Toppings */}
      {renderToppings(id)}
      
      {/* Final Gloss/Texture */}
      <circle cx="50" cy="50" r="38" fill="url(#gloss)" opacity="0.2" />
      <defs>
        <radialGradient id="gloss" cx="30%" cy="30%" r="50%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  );
};

const Navbar = () => {
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
        
        <div className="hidden md:flex items-center gap-8">
          {['Menu', 'Distributeur', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className={`text-sm font-bold uppercase tracking-widest hover:text-brand-yellow transition-colors ${isScrolled ? 'text-brand-green' : 'text-white'}`}
            >
              {item}
            </a>
          ))}
          <button className="bg-brand-green text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-brand-green/90 transition-colors shadow-lg shadow-brand-green/20">
            Commander
          </button>
        </div>

        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? 'text-brand-green' : 'text-white'} />
          ) : (
            <MenuIcon className={isScrolled ? 'text-brand-green' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
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
            <button className="bg-brand-green text-white px-6 py-3 rounded-xl text-center font-bold">
              Commander maintenant
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=1920" 
          alt="Pizza artisanale"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-brand-green/70 backdrop-grayscale-[0.2]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-brand-yellow text-brand-green text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-xl">
            Artisanal & Local
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-white font-bold leading-[0.9] mb-8 tracking-tighter">
            L'excellence de la <br />
            <span className="italic text-brand-yellow">Pizza</span> à La Rochelle
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Pâte pétrie à la main, ingrédients frais du marché et passion italienne. 
            Découvrez le goût authentique de La Pallice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-brand-yellow text-brand-green px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-brand-yellow/40">
              Voir la Carte
            </button>
            <button className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
              Notre Distributeur
            </button>
          </div>
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

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-sm font-black text-brand-green uppercase tracking-[0.3em] mb-4">Notre Carte</h2>
            <h3 className="text-5xl font-serif font-bold text-zinc-900 leading-tight">
              Des saveurs qui <br /> racontent une histoire
            </h3>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-brand-green text-white shadow-lg' 
                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative flex flex-col h-full">
              <div className="relative z-20 mb-[-4rem] px-4">
                <div className="relative aspect-square w-full max-w-[280px] mx-auto">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full shadow-2xl border-[6px] border-white bg-zinc-100"
                  />
                  {item.popular && (
                    <div className="absolute -top-2 -right-2 z-30 bg-brand-yellow text-brand-green text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl border-2 border-white transform rotate-12">
                      Best Seller
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white pt-20 pb-8 px-8 rounded-[2.5rem] shadow-lg border border-zinc-100 flex flex-col h-full">
                <div className="flex-grow text-center">
                  <h4 className="text-2xl font-serif font-bold text-zinc-900 mb-3">
                    {item.name}
                  </h4>
                  <p className="text-zinc-500 text-sm italic">
                    {item.ingredients}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Prix</span>
                    <span className="text-2xl font-serif font-bold text-brand-green">
                      {item.price.toFixed(2)}€
                    </span>
                  </div>
                  <button className="bg-brand-green text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-brand-yellow hover:text-brand-green transition-all shadow-lg">
                    Commander
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-3xl shadow-lg border border-zinc-100 max-w-3xl mx-auto">
          <h3 className="text-2xl font-serif font-bold text-center text-zinc-900 mb-6">Suppléments</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-zinc-50 rounded-2xl">
              <span className="block font-bold text-zinc-900">Oeuf</span>
              <span className="text-brand-green font-serif font-bold">1.00€</span>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl">
              <span className="block font-bold text-zinc-900">Viande</span>
              <span className="text-brand-green font-serif font-bold">2.00€</span>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl">
              <span className="block font-bold text-zinc-900">Fromage</span>
              <span className="text-brand-green font-serif font-bold">1.50€</span>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl">
              <span className="block font-bold text-zinc-900">Légumes</span>
              <span className="text-brand-green font-serif font-bold">1.00€</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DistributorSection = () => {
  return (
    <section id="distributeur" className="relative py-24 overflow-hidden">
      {/* Stripe Background */}
      <div className="absolute inset-0 bg-stripes-vertical opacity-10 z-0" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-brand-green rounded-[3rem] p-12 md:p-20 text-white shadow-2xl overflow-hidden relative">
          {/* Decorative Pizza Illustration Style */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-1 rounded-full bg-brand-yellow text-brand-green text-xs font-black uppercase tracking-[0.2em] mb-6">
                  7J/7 • 24H/24
                </span>
                <h2 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
                  Notre <span className="text-brand-yellow">Distributeur</span> Automatique
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Retrouvez nos best-sellers réalisés tous les jours avec des produits frais, 
                  directement dans notre distributeur automatique. La qualité artisanale, à toute heure !
                </p>
              </div>
              
              <div className="flex items-start gap-4 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                <MapPin className="w-6 h-6 text-brand-yellow shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-xl mb-1">358 Av. Jean Guiton</p>
                  <p className="text-white/60 uppercase text-xs tracking-widest font-bold">17000 La Rochelle</p>
                </div>
              </div>
              
              <button className="bg-brand-yellow text-brand-green px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-all shadow-xl">
                Itinéraire vers le distributeur
              </button>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-white rounded-[2.5rem] p-8 shadow-inner flex items-center justify-center overflow-hidden border-8 border-brand-yellow">
                <div className="text-center space-y-4">
                  <Pizza className="w-24 h-24 text-brand-green mx-auto" />
                  <p className="text-brand-green font-black text-2xl uppercase tracking-tighter">Prêt en 3 minutes</p>
                  <div className="w-16 h-1 bg-brand-yellow mx-auto" />
                  <p className="text-zinc-400 text-sm font-medium">Pizzas artisanales fraîches</p>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-brand-yellow text-brand-green p-6 rounded-full shadow-2xl rotate-12 border-4 border-brand-green">
                <p className="font-black text-center leading-none">
                  <span className="text-xs uppercase block">À partir de</span>
                  <span className="text-3xl">7,50€</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

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
                  05 46 00 00 00
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
              <button className="w-full bg-brand-green text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-green/90 transition-all shadow-xl flex items-center justify-center gap-3">
                <Phone className="w-5 h-5" /> Appeler pour commander
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-brand-green text-white py-16 relative overflow-hidden">
      {/* Stripe Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-stripes z-0" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-12 mb-12">
          <div className="flex items-center gap-2">
            <Pizza className="w-8 h-8 text-brand-yellow" />
            <span className="text-2xl font-serif font-bold tracking-tight">
              La Pallice Pizza
            </span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-white/60 uppercase tracking-widest">
            <a href="#" className="hover:text-brand-yellow transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-brand-yellow transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-brand-yellow transition-colors">Cookies</a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-[10px] uppercase tracking-[0.2em] font-black">
          <p>© 2024 La Pallice Pizza. Tous droits réservés.</p>
          <p>Fait avec passion à La Rochelle</p>
        </div>
      </div>
    </footer>
  );
};

const IngredientsSection = () => {
  const ingredients = [
    {
      title: "Pâte Artisanale",
      description: "Pétrie chaque jour dans notre atelier avec une farine de qualité supérieure pour une croûte croustillante et légère.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
      icon: "🥖"
    },
    {
      title: "Tomates de Saison",
      description: "Nos sauces sont cuisinées à partir de tomates mûries au soleil, sélectionnées pour leur goût intense et sucré.",
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

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand-yellow selection:text-brand-green">
      <Navbar />
      <Hero />
      <MenuSection />
      <IngredientsSection />
      <DistributorSection />
      <InfoSection />
      <Footer />
    </div>
  );
}
