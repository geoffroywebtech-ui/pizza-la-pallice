-- ============================================================
-- Pizza La Pallice — Création des tables Supabase
-- ============================================================
-- Exécuter ce script dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- -------------------------
-- TABLE : orders
-- -------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer            JSONB NOT NULL,
  -- { name: string, phone: string, address: string, email?: string, notes?: string }
  items               JSONB NOT NULL,
  -- CartItem[]: { id, name, price, size ('t1'|'t2'|'t3'), quantity, customName? }
  total               NUMERIC(10, 2) NOT NULL,
  status              TEXT NOT NULL DEFAULT 'new'
                        CHECK (status IN ('new', 'preparing', 'delivering', 'completed')),
  deliverer_location  JSONB DEFAULT NULL,
  -- { lat: number, lng: number, updated_at: number (timestamp ms) }
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les requêtes triées par date
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);

-- Activer les mises à jour temps réel
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Politique : lecture publique (les clients peuvent voir les commandes via leur session)
CREATE POLICY "Allow public read" ON public.orders
  FOR SELECT USING (true);

-- Politique : insertion publique (les clients peuvent passer commande)
CREATE POLICY "Allow public insert" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Politique : mise à jour publique (statuts, position livreur)
CREATE POLICY "Allow public update" ON public.orders
  FOR UPDATE USING (true);

-- -------------------------
-- TABLE : stock
-- -------------------------
CREATE TABLE IF NOT EXISTS public.stock (
  id           TEXT PRIMARY KEY,
  -- Correspond à MenuItem.id dans src/data/menu.ts (ex: '1', '2', '5', ...)
  is_available BOOLEAN NOT NULL DEFAULT true,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_stock_updated_at ON public.stock;
CREATE TRIGGER set_stock_updated_at
  BEFORE UPDATE ON public.stock
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Activer les mises à jour temps réel
ALTER TABLE public.stock REPLICA IDENTITY FULL;

-- Row Level Security
ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;

-- Politique : lecture publique (le menu affiche la disponibilité)
CREATE POLICY "Allow public read" ON public.stock
  FOR SELECT USING (true);

-- Politique : upsert public (l'admin met à jour le stock via toggleItemAvailability)
CREATE POLICY "Allow public upsert" ON public.stock
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Activer la réplication temps réel dans Supabase
-- (à faire aussi dans Dashboard > Database > Replication)
-- ============================================================
-- Si la commande ci-dessous échoue, activer manuellement dans le Dashboard.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders, public.stock;
  END IF;
END;
$$;

-- ============================================================
-- VÉRIFICATION
-- ============================================================
-- Après exécution, vérifier :
-- SELECT * FROM public.orders LIMIT 5;
-- SELECT * FROM public.stock LIMIT 5;
-- ============================================================
