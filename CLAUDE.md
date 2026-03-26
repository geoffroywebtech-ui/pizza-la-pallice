# Règles d'Or pour l'Agent Antigravity sur ce projet

Ce fichier doit être lu par tout Agent travaillant sur ce dépôt pour garantir une expérience utilisateur optimale et économique.

## 1. Économie de Tokens (Priorité Haute)
- **Batching :** Ne jamais faire 3 petites modifications quand une seule commande groupée (`command1 ; command2 ; command3`) peut régler le problème.
- **Directivité :** Éviter les questions de confirmation pour les corrections techniques mineures. Agir d'abord (en étant sûr de soi), expliquer ensuite.
- **Réduction du bruit :** Ne renvoyer que les informations essentielles.

## 2. Rigueur Technique Web (Leçons Apprises)
- **Noms de fichiers :** Interdire les espaces et les accents dans les noms de dossiers et fichiers (ex: `images-produit` est obligatoire, `image produit` est banni).
- **Liens relatifs :** Toujours privilégier les chemins relatifs dans le code React pour assurer la compatibilité entre Local (localhost) et GitHub Pages.
- **Blocages Système :** Sur Windows, si une action de renommage échoue, utiliser `Force` immédiatement car le dossier est probablement utilisé par `npm run dev`.

## 3. Déploiement GitHub
- Toujours vérifier la présence de `.nojekyll` pour éviter les blocages de fichiers par le moteur Jekyll de GitHub.
- Vérifier que le `base path` dans `vite.config.ts` correspond bien à l'URL de production (`/pizza-la-pallice/`).
- Le CI/CD se déclenche sur push vers `main` ou `master` via `.github/workflows/deploy.yml`.

---

## 4. Architecture du Projet

### Stack Technique
| Technologie | Version | Rôle |
|---|---|---|
| React | 19.0.0 | UI framework |
| TypeScript | ~5.8.2 | Typage statique |
| Vite | 6.2.0 | Build tool + HMR |
| Tailwind CSS | 4.1.14 | Styles utilitaires |
| Framer Motion (`motion`) | 12.23.24 | Animations |
| Supabase | 2.99.3 | Backend + BDD temps réel |
| Leaflet + react-leaflet | 1.9.4 | Cartes (suivi livraison) |
| Tesseract.js | 7.0.0 | OCR |
| vite-plugin-pwa | 1.2.0 | Progressive Web App |
| Lucide React | 0.546.0 | Icônes |
| @google/genai | 1.29.0 | API Gemini AI |

### Structure des Dossiers
```
src/
├── components/       # Composants React (voir liste ci-dessous)
├── data/
│   └── menu.ts       # ~50 articles menu (MenuItem[]), DONNÉES STATIQUES
├── lib/
│   └── supabase.ts   # Client Supabase (URL + clé publique)
├── types/
│   └── index.ts      # Interfaces TypeScript partagées
├── App.tsx           # Composant racine — toute la logique d'état
├── main.tsx          # Point d'entrée + enregistrement Service Worker PWA
└── index.css         # Tailwind v4 @theme + polices Google Fonts

public/
├── images-produit/pizza/   # Images PNG des pizzas (NOM SANS ESPACES ni accents)
├── icons/                  # Icônes PWA
└── menu-tarif/             # PDFs tarifs (exclus du cache SW)

supabase/
├── setup-tables.sql        # Script de création des tables orders + stock
├── setup-emails.sql        # Trigger Supabase pour email de confirmation (Resend)
└── magic-link-template.html

.github/workflows/
└── deploy.yml              # CI/CD → GitHub Pages (Node 20, npm ci, vite build)
```

### Composants Clés
| Composant | Rôle |
|---|---|
| `App.tsx` | État global: cart, orders, promotions, menuItems, modales |
| `Navbar.tsx` | Nav responsive — clic logo → modal auth admin |
| `MenuSection.tsx` | Grille menu avec filtrage par catégorie |
| `MenuCard.tsx` | Carte produit individuelle |
| `CartModal.tsx` | Panier (drawer latéral) |
| `CheckoutModal.tsx` | Tunnel commande + codes promo |
| `RestaurantDashboard.tsx` | Dashboard admin (commandes, stock, promos, clients) |
| `DeliveryTrackerModal.tsx` | Suivi GPS livraison (Leaflet + Supabase real-time) |
| `CustomerHistoryModal.tsx` | Historique client (auth magic link) |

---

## 5. Base de Données Supabase

### Tables
**`orders`**
```sql
id               UUID PRIMARY KEY DEFAULT gen_random_uuid()
customer         JSONB   -- { name, phone, address, email?, notes? }
items            JSONB   -- CartItem[] : { id, name, price, size, quantity, customName? }
total            NUMERIC(10,2)
status           TEXT    -- 'new' | 'preparing' | 'delivering' | 'completed'
deliverer_location JSONB -- { lat, lng, updated_at } | null
created_at       TIMESTAMPTZ DEFAULT now()
```

**`stock`**
```sql
id           TEXT PRIMARY KEY  -- correspond à MenuItem.id (ex: '1', '2', ...)
is_available BOOLEAN NOT NULL DEFAULT true
updated_at   TIMESTAMPTZ DEFAULT now()
```

### Abonnements Temps Réel (dans `App.tsx`)
- `orders` INSERT → notification système + son + ajout local
- `orders` UPDATE → mise à jour statut + position livreur
- `stock` `*` → mise à jour disponibilité produit dans menuItems

### Script de Setup
Exécuter `supabase/setup-tables.sql` dans le dashboard Supabase > SQL Editor pour créer les tables avec RLS.

---

## 6. Variables d'Environnement

| Variable | Usage |
|---|---|
| `GEMINI_API_KEY` | API Google Gemini (injectée via Vite `define`) |
| `APP_URL` | URL de déploiement (Cloud Run / GitHub Pages) |

Le fichier `.env.example` sert de référence. Ne jamais committer `.env`.

---

## 7. Scripts NPM
```bash
npm run dev      # Dev server sur port 3000 (0.0.0.0)
npm run build    # Production build → dist/
npm run preview  # Preview du build local
npm run lint     # tsc --noEmit (vérification TypeScript)
npm run clean    # rm -rf dist
```

---

## 8. Conventions de Code

### TypeScript
- `tsconfig.json` : target ES2022, moduleResolution bundler, JSX react-jsx
- Alias `@/` → racine du projet (ex: `@/src/types`)
- `skipLibCheck: true`, `allowJs: true`

### Styles (Tailwind v4)
- Couleurs brand : `brand-green` (#1B5E20), `brand-yellow` (#FFD700), `brand-red` (#D32F2F)
- Polices : `font-sans` (Inter), `font-serif` (Libre Baskerville)
- Safe area iOS/Android : utiliser `env(safe-area-inset-*)` pour les éléments fixés

### Animations (Framer Motion)
- Import depuis `motion` (pas `framer-motion`)
- `AnimatePresence` pour les sorties d'écran (modales, drawers)

### Images Produits
- Chemin : `images-produit/pizza/NomPizza.png` (relatif, sans `/pizza-la-pallice/`)
- Vite résout le `base` automatiquement à la compilation

---

## 9. Accès Admin

- **Code** : `pizzza` (5 caractères, triple z)
- **Déclencheur** : clic long sur le logo Navbar OU bouton "Accès Restaurant" en footer
- Le dashboard admin gère : commandes temps réel, statuts, gestion stock, codes promo, base clients

---

## 10. PWA & Cache

- Service Worker auto-update via `vite-plugin-pwa`
- Cache `CacheFirst` 30 jours pour `images-produit/`
- Cache `CacheFirst` 7 jours pour tuiles OpenStreetMap
- `navigateFallback` → `index.html` (SPA routing)
- Les PDFs `menu-tarif/` sont **exclus** du cache SW (`globIgnores`)

---

*Dernière mise à jour : 26 Mars 2026*
