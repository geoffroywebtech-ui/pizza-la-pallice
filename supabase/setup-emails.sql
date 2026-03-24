-- ============================================================
-- Pizza La Pallice — Email de confirmation de commande
-- ============================================================
-- PRÉ-REQUIS :
--   1. Créer un compte gratuit sur https://resend.com
--   2. Copier votre API Key (re_xxxxxxxx)
--   3. Remplacer 'VOTRE_CLE_API_RESEND' ci-dessous par votre vraie clé
--   4. Exécuter ce script dans Supabase > SQL Editor
-- ============================================================

-- 1. Activer l'extension pg_net (appels HTTP depuis la base)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Fonction d'envoi d'email de confirmation
CREATE OR REPLACE FUNCTION public.send_order_confirmation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  resend_api_key TEXT := 're_2P6iqKeP_Dw2fPEdvLwJy9B7Ne6EYqAYL';
  customer_email TEXT;
  customer_name  TEXT;
  customer_phone TEXT;
  order_total    NUMERIC;
  order_id_short TEXT;
  items_html     TEXT;
  email_html     TEXT;
BEGIN
  -- Extraire les infos client
  customer_email := NEW.customer->>'email';
  customer_name  := NEW.customer->>'name';
  customer_phone := NEW.customer->>'phone';
  order_total    := NEW.total;
  order_id_short := UPPER(SUBSTRING(NEW.id::text, 1, 8));

  -- Pas d'email = pas d'envoi
  IF customer_email IS NULL OR customer_email = '' THEN
    RETURN NEW;
  END IF;

  -- Construire la liste des articles en HTML
  SELECT STRING_AGG(
    FORMAT(
      '<tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">%s x %s%s</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">%s</td></tr>',
      item->>'quantity',
      item->>'name',
      CASE
        WHEN item->>'customName' IS NOT NULL AND item->>'customName' != ''
        THEN FORMAT(' <span style="color:#1B5E20;font-weight:600">(Pour : %s)</span>', item->>'customName')
        ELSE ''
      END,
      item->>'size'
    ),
    ''
  ) INTO items_html
  FROM jsonb_array_elements(NEW.items) AS item;

  -- Template HTML complet
  email_html := FORMAT(
    '<!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f5f5f5">
      <div style="max-width:500px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

        <!-- Header -->
        <div style="background:#1B5E20;padding:32px 24px;text-align:center">
          <h1 style="color:#FFD700;margin:0;font-size:28px;font-family:Georgia,serif">🍕 Pizza La Pallice</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase">Confirmation de commande</p>
        </div>

        <!-- Body -->
        <div style="padding:24px">
          <p style="font-size:16px;color:#333;margin:0 0 4px">Bonjour <strong>%s</strong>,</p>
          <p style="font-size:14px;color:#666;margin:0 0 20px">Votre commande a bien été reçue ! Notre équipe la prépare avec soin.</p>

          <!-- Order ID -->
          <div style="background:#f8f8f8;border-radius:12px;padding:16px;text-align:center;margin-bottom:20px">
            <p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:2px">Commande n°</p>
            <p style="margin:4px 0 0;font-size:24px;font-weight:800;color:#1B5E20;letter-spacing:3px">%s</p>
          </div>

          <!-- Items table -->
          <table style="width:100%%;border-collapse:collapse;font-size:14px;color:#333">
            <thead>
              <tr style="background:#1B5E20">
                <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:1px">Article</th>
                <th style="padding:10px 12px;text-align:right;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:1px">Taille</th>
              </tr>
            </thead>
            <tbody>
              %s
            </tbody>
          </table>

          <!-- Total -->
          <div style="margin-top:16px;padding:16px;background:#1B5E20;border-radius:12px;text-align:center">
            <span style="color:rgba(255,255,255,0.7);font-size:12px;text-transform:uppercase;letter-spacing:1px">Total</span>
            <p style="margin:4px 0 0;font-size:28px;font-weight:800;color:#FFD700">%s€</p>
          </div>

          <!-- Info -->
          <div style="margin-top:20px;padding:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px">
            <p style="margin:0;font-size:13px;color:#92400e">
              📱 Vous recevrez un lien de suivi par WhatsApp ou SMS dès que votre commande sera en livraison.
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align:center;margin-top:24px">
            <a href="https://geoffroywebtech-ui.github.io/pizza-la-pallice/"
               style="display:inline-block;background:#1B5E20;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:14px">
              Voir mon espace
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:20px 24px;background:#f8f8f8;text-align:center;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#999">Pizza La Pallice — La Rochelle</p>
          <p style="margin:4px 0 0;font-size:11px;color:#bbb">Pizzas artisanales, pâte pétrie à la main</p>
        </div>
      </div>
    </body>
    </html>',
    customer_name,
    order_id_short,
    items_html,
    order_total
  );

  -- Envoyer via Resend API
  PERFORM net.http_post(
    url := 'https://api.resend.com/emails'::TEXT,
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_api_key,
      'Content-Type', 'application/json'
    )::JSONB,
    body := jsonb_build_object(
      'from', 'Pizza La Pallice <onboarding@resend.dev>',
      'to', customer_email,
      'subject', FORMAT('🍕 Commande %s confirmée — Pizza La Pallice', order_id_short),
      'html', email_html
    )::JSONB
  );

  RETURN NEW;
END;
$$;

-- 3. Trigger : se déclenche à chaque nouvelle commande
DROP TRIGGER IF EXISTS on_new_order_send_email ON public.orders;
CREATE TRIGGER on_new_order_send_email
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.send_order_confirmation();

-- ============================================================
-- VÉRIFICATION : Insérez une commande test pour vérifier
-- que l'email arrive bien.
-- ============================================================
