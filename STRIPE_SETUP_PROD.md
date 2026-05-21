# 🔧 Configuration Stripe Production — Muzquiz

## Étape 1 — Produits & Price IDs

Stripe dashboard → **mode Production** → Catalogue de produits → + Ajouter un produit

| Plan       | Prix       | Price ID (à remplir)     |
|------------|------------|--------------------------|
| Essentiel  | 9.99€/mois | `price_live_____________` |
| Pro        | 19.99€/mois| `price_live_____________` |
| Expert     | 29.99€/mois| `price_live_____________` |

---

## Étape 2 — Clé secrète API

Stripe → **Développeurs** → **Clés API**

- Copier la clé `sk_live_...` (cliquer "Révéler")

```
STRIPE_SECRET_KEY = sk_live_...
```

---

## Étape 3 — Webhook

Stripe → **Développeurs** → **Webhooks** → **+ Ajouter une destination**

- **Périmètre** : Votre compte
- **Événements à sélectionner** (onglet "Tous les événements", cocher les 4) :
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
- **Type** : Webhook
- **URL** : `https://www.muzquiz.fr/api/stripe-webhook`

Une fois créé → cliquer sur le webhook → **Signing secret** → Révéler

```
STRIPE_WEBHOOK_SECRET = whsec_live_...
```

---

## Étape 4 — Variables d'environnement Vercel

Vercel → Projet Buzzy → **Settings** → **Environment Variables** → sélectionner **Production**

| Variable                    | Valeur                          |
|-----------------------------|---------------------------------|
| `STRIPE_SECRET_KEY`         | `sk_live_...`                   |
| `STRIPE_WEBHOOK_SECRET`     | `whsec_live_...`                |
| `STRIPE_PRICE_ID_ESSENTIEL` | `price_live_...` (Essentiel)    |
| `STRIPE_PRICE_ID_PRO`       | `price_live_...` (Pro)          |
| `STRIPE_PRICE_ID_EXPERT`    | `price_live_...` (Expert)       |
| `NEXT_PUBLIC_APP_URL`       | `https://www.muzquiz.fr`        |

Après avoir ajouté toutes les variables → **Redéployer** la production.

---

## Étape 5 — Supabase (migrations SQL)

Supabase → **SQL Editor** → exécuter :

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id     TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_price_id        TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pending_discount_percent INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pending_discount_code_id UUID;
```

---

## Étape 6 — Packs par défaut

Supabase → **SQL Editor** → exécuter le fichier `SEED_PACKS_DEFAUT.sql`
(10 packs : 5 QCM + 5 Blind Test)

---

## Étape 7 — Activer les factures automatiques Stripe

Stripe → **Paramètres** → **Facturation** → **Emails clients**
→ Activer **"Paiements réussis"**

---

## ✅ Checklist finale

- [ ] 3 produits créés en prod avec leurs Price IDs
- [ ] Clé API `sk_live_...` copiée
- [ ] Webhook créé sur `muzquiz.fr/api/stripe-webhook`
- [ ] Secret webhook `whsec_live_...` copié
- [ ] 6 variables Vercel ajoutées en Production
- [ ] Vercel redéployé
- [ ] Migrations Supabase exécutées
- [ ] SEED_PACKS_DEFAUT.sql exécuté
- [ ] Factures automatiques activées
- [ ] Test d'un vrai paiement Stripe ✅
