-- Schéma pour la table 'orders'
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT now(),
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  total FLOAT8 NOT NULL,
  status TEXT DEFAULT 'new'
);

-- Schéma pour la table 'stock'
CREATE TABLE IF NOT EXISTS stock (
  id TEXT PRIMARY KEY,
  is_available BOOLEAN DEFAULT true,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Politique de sécurité (RLS) - À ajuster selon vos besoins
-- Par défaut, nous autorisons tout le monde à lire et écrire (à sécuriser en production)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access" ON orders FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access" ON stock FOR ALL USING (true) WITH CHECK (true);

-- Insertion initiale pour les produits existants (facultatif si l'app fait des upserts)
-- INSERT INTO stock (id, is_available) VALUES ('p1', true), ('p2', true) ON CONFLICT (id) DO NOTHING;
