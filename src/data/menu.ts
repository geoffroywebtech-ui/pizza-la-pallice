
import { MenuItem, Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'Tout' },
  { id: 'pizzas', label: 'Les Pizzas' },
  { id: 'panini', label: 'Paninis' },
  { id: 'lasagne', label: 'Lasagnes Maison' },
  { id: 'dessert', label: 'Desserts' },
  { id: 'boisson', label: 'Boissons' },
];

export const MENU_ITEMS: MenuItem[] = [
  // --- BASE TOMATE ---
  { 
    id: '5', 
    name: 'Pepperoni', 
    ingredients: 'pepperoni, viande hachée, fromages, oeuf, olives, origan', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'images-produit/pizza/Pepperoni.png'
  },
  { 
    id: '6', 
    name: 'Charentaise', 
    ingredients: 'jambon, oignons, champignons, poitrine fumée, crème fraiche, persillade, fromages, olives, origan', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'images-produit/pizza/Charentaise.png'
  },
  { 
    id: '7', 
    name: 'Barbecue', 
    ingredients: 'viande hachée, cheddar, tomates fraîches, salade, oignons rouges, fromages, olives, origan, sauce barbecue', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'images-produit/pizza/Barbecue.png'
  },
  { 
    id: '8', 
    name: 'Orientale', 
    ingredients: 'champignons, merguez, oignons, poivrons, viande hachée, fromages, olives, origan', 
    prices: { t1: 11.00, t2: 13.00, t3: 15.00 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '9', 
    name: 'Margarita', 
    ingredients: 'fromages, olives, origan', 
    prices: { t1: 7.50, t2: 9.50, t3: 11.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'images-produit/pizza/Margherita.png',
    isVeggie: true
  },
  { 
    id: '10', 
    name: 'Bambini', 
    ingredients: 'jambon, fromages, olives, origan', 
    prices: { t1: 8.50, t2: 10.50, t3: 12.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '11', 
    name: 'Reine', 
    ingredients: 'jambon, champignons, fromages, olives, origan', 
    prices: { t1: 9.00, t2: 11.00, t3: 13.00 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'images-produit/pizza/Reine.png',
    popular: true
  },
  { 
    id: '12', 
    name: 'Roquefort', 
    ingredients: 'oignons, roquefort, crème fraiche, lardons, fromages, olives, origan', 
    prices: { t1: 9.50, t2: 11.50, t3: 13.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '13', 
    name: 'Romaine', 
    ingredients: "oignons, filets d'anchois, câpres, poivrons, fromages, olives, origan", 
    prices: { t1: 9.50, t2: 11.50, t3: 13.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '14', 
    name: 'Apache', 
    ingredients: 'oignons, poulet, crème fraiche, curry, fromages, olives, origan', 
    prices: { t1: 9.50, t2: 11.50, t3: 13.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '15', 
    name: 'Mixte', 
    ingredients: 'ananas, poulet, crème fraîche, curry, fromages, olives, origan', 
    prices: { t1: 9.50, t2: 11.50, t3: 13.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '16', 
    name: 'Vendéenne', 
    ingredients: 'jambon de pays, oignons, crème fraîche, fromages, olives, origan', 
    prices: { t1: 9.50, t2: 11.50, t3: 13.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '17', 
    name: 'Chevrette', 
    ingredients: 'chèvre, crème fraiche, fromages, olives, origan', 
    prices: { t1: 9.50, t2: 11.50, t3: 13.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    isVeggie: true
  },
  { 
    id: '18', 
    name: 'Végétarienne', 
    ingredients: 'oignons, poivrons, champignons, fromages, olives, origan', 
    prices: { t1: 9.50, t2: 11.50, t3: 13.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'images-produit/pizza/Végétarienne.png',
    isVeggie: true
  },
  { 
    id: '19', 
    name: 'Norvégienne', 
    ingredients: 'saumon fumé, crème fraîche, fromages, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '20', 
    name: 'Bolognaise', 
    ingredients: 'viande de boeuf hachée cuisinée, fromages, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '21', 
    name: 'Magret', 
    ingredients: 'magret, champignons, poivre vert, fromages, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '22', 
    name: 'Salaison', 
    ingredients: 'merguez, jambon, lardons, chorizo, fromages, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '23', 
    name: 'Champêtre', 
    ingredients: 'mozzarella, poivrons, chèvre, pesto, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    isVeggie: true
  },
  { 
    id: '42', 
    name: 'Calzone', 
    ingredients: 'jambon, champignons, oeuf, fromages, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '24', 
    name: 'Speciale', 
    ingredients: 'jambon, oignons, oeuf, poivrons, champignons, fromages, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '25', 
    name: 'La Pallice', 
    ingredients: 'jambon, gésiers, champignons, chèvre, fromages, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'images-produit/pizza/La-Pallice.png'
  },
  { 
    id: '26', 
    name: 'Campagnarde', 
    ingredients: 'oignons, champignons, lardons, jambon, fromages, oeuf, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    popular: true
  },
  { 
    id: '27', 
    name: 'Delicieuse', 
    ingredients: 'oignons, poulet, poivrons, chorizo, crème fraiche, fromages, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '28', 
    name: 'Parma', 
    ingredients: 'jambon de parme, tomates confites, parmesan, pesto, fromages, olives, origan', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '29', 
    name: 'Cesar', 
    ingredients: 'tenders de poulet, tomates confites, parmesan, salade, fromages, olives, origan, sauce césar', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Tomate',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },

  // --- BASE CRÈME ---
  { 
    id: '30', 
    name: 'Savoureuse', 
    ingredients: 'champignons, gésiers, magret fumé, foie gras, noix, salade, fromages, origan, vinaigre de framboise', 
    prices: { t1: 13.00, t2: 15.00, t3: 17.00 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '31', 
    name: '6 Fromages', 
    ingredients: 'chèvre, cheddar, reblochon, emmental, roquefort, mozzarella, olives, origan', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    isVeggie: true
  },
  { 
    id: '32', 
    name: 'Saumon', 
    ingredients: 'pommes de terre, saumon, persillade, fromages, olives, origan', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '33', 
    name: 'Montagnarde', 
    ingredients: 'jambon de pays, pommes de terre, coppa, jambon, raclette, fromages, olives, origan', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '34', 
    name: 'Burger', 
    ingredients: 'viande hachée, cheddar, tomates fraîches, salade, oignons, fromages, olives, origan, sauce burger', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    popular: true
  },
  { 
    id: '35', 
    name: 'Maya', 
    ingredients: 'lardons, tomates confites, chèvre, fromages, olives, origan, miel', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '36', 
    name: 'Forestière', 
    ingredients: "moutarde à l'ancienne, poulet, champignons, fromages, olives, origan", 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '37', 
    name: 'Cannibale', 
    ingredients: 'pommes de terre, poulet, viande hachée, kebab, lardons, chorizo, fromages, olives, origan, sauce samouraï', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '38', 
    name: 'Chicken', 
    ingredients: 'tenders de poulet, tomates fraiches, cheddar, salade, oignons rouges, fromages, olives, origan, sauce pomme frite', 
    prices: { t1: 11.80, t2: 13.80, t3: 15.80 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '39', 
    name: 'Chevre Miel', 
    ingredients: 'chèvre, miel, noix, fromages, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'images-produit/pizza/Chèvre-Miel.png',
    isVeggie: true
  },
  { 
    id: '40', 
    name: 'Savoyarde', 
    ingredients: 'pommes de terre, lardons, reblochon, fromages, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    popular: true
  },
  { 
    id: '1', 
    name: '4 Fromages', 
    ingredients: 'chèvre, roquefort, mozzarella, emmental, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'images-produit/pizza/4-Fromages.png',
    popular: true,
    isVeggie: true
  },
  { 
    id: '2', 
    name: 'Poularde', 
    ingredients: 'pommes de terre, poulet, oignons, oeuf, fromages, olives, origan', 
    prices: { t1: 10.50, t2: 12.50, t3: 14.50 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'images-produit/pizza/Poularde.png'
  },
  { 
    id: '3', 
    name: 'Kebab', 
    ingredients: 'poivrons, oignons, viande à kebab, fromages, olives, origan, sauce blanche', 
    prices: { t1: 11.00, t2: 13.00, t3: 15.00 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'images-produit/pizza/Kebab.png'
  },
  { 
    id: '4', 
    name: 'Texane', 
    ingredients: 'merguez, chorizo, poulet, viande hachée, oignons rouges, fromages, olives, origan', 
    prices: { t1: 11.00, t2: 13.00, t3: 15.00 }, 
    category: 'pizzas',
    subCategory: 'Base Crème',
    image: 'images-produit/pizza/Texane.png'
  },

  // --- PANINIS ---
  { 
    id: 'p1', 
    name: 'Panini Classique', 
    ingredients: 'Jambon ou Chorizo ou Viande hachée, fromages', 
    prices: { t1: 6.00 }, 
    category: 'panini',
    image: 'https://images.unsplash.com/photo-1520174691701-bc555a3404ca?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'p2', 
    name: 'Panini Curry', 
    ingredients: 'Sauce tomate, poulet, curry, fromages', 
    prices: { t1: 6.00 }, 
    category: 'panini',
    image: 'https://images.unsplash.com/photo-1520174691701-bc555a3404ca?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'p3', 
    name: 'Panini 4 Fromages', 
    ingredients: 'Roquefort, chèvre, mozzarella, emmental', 
    prices: { t1: 6.00 }, 
    category: 'panini',
    image: 'https://images.unsplash.com/photo-1520174691701-bc555a3404ca?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'p4', 
    name: 'Panini Saumon', 
    ingredients: 'Saumon fumé, crème fraiche, fromages', 
    prices: { t1: 6.00 }, 
    category: 'panini',
    image: 'https://images.unsplash.com/photo-1520174691701-bc555a3404ca?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'p5', 
    name: 'Panini Pays', 
    ingredients: 'Jambon de pays, chèvre, fromages', 
    prices: { t1: 6.00 }, 
    category: 'panini',
    image: 'https://images.unsplash.com/photo-1520174691701-bc555a3404ca?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'p6', 
    name: 'Panini Kebab', 
    ingredients: 'Kebab, poivrons, oignons, fromages', 
    prices: { t1: 6.00 }, 
    category: 'panini',
    image: 'https://images.unsplash.com/photo-1520174691701-bc555a3404ca?auto=format&fit=crop&q=80&w=800'
  },

  // --- LASAGNES ---
  { 
    id: 'l1', 
    name: 'Lasagnes Maison', 
    ingredients: '1 part (8.50€) / À partir de 4 parts (7.00€ la part)', 
    prices: { t1: 8.50 }, 
    category: 'lasagne',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=800'
  },

  // --- DESSERTS ---
  { 
    id: 'd1', 
    name: 'Pizza Nutella, Ananas ou Poires', 
    ingredients: 'Amandes effilées', 
    prices: { t1: 10.00 }, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'd2', 
    name: 'Pizza Nutella', 
    ingredients: '', 
    prices: { t1: 8.00 }, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'd3', 
    name: 'Panini Nutella', 
    ingredients: '', 
    prices: { t1: 5.50 }, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'd4', 
    name: 'Tiramisu Nubi', 
    ingredients: 'Saveurs du moment', 
    prices: { t1: 3.80 }, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'd5', 
    name: 'Muffin', 
    ingredients: 'Saveurs du moment', 
    prices: { t1: 3.80 }, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'd6', 
    name: 'Glace Häagen-Dazs', 
    ingredients: 'Saveurs du moment', 
    prices: { t1: 3.80 }, 
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },

  // --- BOISSONS ---
  { 
    id: 'b1', 
    name: 'Soda 33cl', 
    ingredients: 'Coca, Coca Cherry, Coca Zéro, Oasis, Ice Tea, Orangina', 
    prices: { t1: 2.00 }, 
    category: 'boisson',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'b2', 
    name: 'Soda Bouteille', 
    ingredients: 'Coca, Fanta, Ice Tea', 
    prices: { t1: 4.00 }, 
    category: 'boisson',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'b3', 
    name: 'Bières Canettes', 
    ingredients: '', 
    prices: { t1: 2.50 }, 
    category: 'boisson',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'b4', 
    name: 'Bières Bouteilles', 
    ingredients: '', 
    prices: { t1: 3.00 }, 
    category: 'boisson',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'b5', 
    name: 'Vins 75cl', 
    ingredients: 'Lambrusco, Rosé de Provence, Bordeaux Rouge', 
    prices: { t1: 12.00 }, 
    category: 'boisson',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800'
  }
];
