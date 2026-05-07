# MUZQUIZ — Revue technique

> Document destiné à un développeur externe chargé d'auditer le projet.
> Il décrit l'architecture, les choix techniques, ce qui est fait, ce qui reste à faire,
> et les points qui méritent une attention particulière.

---

## 1. Présentation du produit

**MUZQUIZ** est une application web de quiz multijoueur en temps réel, pensée pour les bars, soirées et événements. Un hôte crée une salle, les joueurs rejoignent depuis leur téléphone, et la partie se déroule en direct sur un grand écran ou directement sur les appareils.

**URL de production** : https://muz-quiz-one.vercel.app  
**Dépôt** : dans le dossier `buzzy/`

### 4 modes de jeu
| Mode | Description |
|------|-------------|
| Quiz (QCM) | Questions à choix multiples, tous répondent en même temps |
| Blind Test | Audio/ambiance, tous répondent en même temps |
| Buzz Quiz | Questions QCM, le premier à buzzer répond |
| Buzz Blind Test | Blind Test + buzzer |

### 3 types d'abonnement
| Tier | Accès |
|------|-------|
| Free | Questions MUZQUIZ uniquement, 5 questions max |
| Pro | Packs de questions personnalisées, illimité |
| Premium | Pro + Quiz du Jour quotidien |

---

## 2. Stack technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js (App Router) | 14.2.3 |
| UI | React + Tailwind CSS | 18 / 3.4 |
| Langage | TypeScript | 5 |
| Backend / BDD | Supabase (PostgreSQL) | SDK 2.44 |
| Temps réel | Supabase Realtime + Broadcast | — |
| Auth | Supabase Auth (Google OAuth + email + anonyme) | — |
| Storage | Supabase Storage | — |
| IA (génération de questions) | Anthropic Claude (SDK 0.90) | — |
| Déploiement | Vercel | — |

**Pas de backend custom** — toute la logique métier est côté client (hooks React) et sécurisée par les politiques RLS de Supabase. Pas de serveur Express, pas d'API REST maison (sauf 3 routes Next.js pour le Quiz du Jour et la génération IA).

---

## 3. Structure des fichiers

```
buzzy/
├── app/                        Pages Next.js (App Router)
│   ├── page.tsx                 Accueil — création de salle, connexion
│   ├── login/page.tsx           Connexion email/Google
│   ├── signup/page.tsx          Inscription
│   ├── profile/page.tsx         Profil joueur + historique
│   ├── pricing/page.tsx         Tarifs
│   ├── questions/page.tsx       Gestion des packs de questions personnalisées
│   ├── admin/page.tsx           Dashboard admin (utilisateurs + Quiz du Jour)
│   ├── room/[code]/
│   │   ├── page.tsx             Salle de jeu (hôte + joueurs + écran public)
│   │   └── results/page.tsx     Page de résultats + replay
│   └── api/
│       ├── daily-quiz/route.ts          Récupère le quiz du jour
│       ├── daily-quiz/submit/route.ts   Soumet un score
│       └── generate-questions/route.ts  Génère des questions via Claude AI
│
├── components/
│   ├── PublicScreenView.tsx     Vue grand écran (TV / projecteur)
│   ├── PhoneControllerView.tsx  Vue téléphone joueur
│   ├── QuestionImage.tsx        Image normale ou flou progressif (blur reveal)
│   ├── InterLeaderboard.tsx     Classement inter-question (5 secondes)
│   ├── DailyQuiz.tsx            Widget Quiz du Jour
│   ├── MuzquizLogo.tsx          Logo SVG moustache
│   ├── BuzzerButton.tsx         Bouton buzzer
│   ├── QCMChoices.tsx           Boutons de réponse QCM
│   ├── Timer.tsx                Minuteur
│   ├── Scoreboard.tsx           Tableau des scores
│   ├── SettingsModal.tsx        Réglages de salle
│   └── RoomQRCode.tsx           QR code de la salle
│
├── hooks/
│   ├── useRoom.ts               Logique métier principale (state + actions)
│   └── useRealtime.ts           Abonnements Supabase Realtime
│
├── lib/
│   ├── supabase.ts              Client Supabase
│   └── questions.ts             Banque de questions MUZQUIZ (défaut)
│
├── types/index.ts               Tous les types TypeScript
│
└── SUPABASE_SCHEMA_COMPLET.sql  Schéma DB complet (unique source de vérité)
```

---

## 4. Base de données — Tables

```
rooms               Salles de jeu (code, mode, statut, pack, pause, écran public...)
room_players        Joueurs dans une salle (score, is_host, nickname)
buzzes              Enregistrements de buzz (qui a buzzé, quand)
qcm_answers         Réponses QCM des joueurs
profiles            Profils utilisateurs (nickname, avatar, subscription_tier)
question_packs      Packs de questions personnalisées
custom_questions    Questions dans les packs (texte, choix, image, type)
daily_quizzes       Quiz du Jour (1 par date, stocké en JSONB)
daily_quiz_scores   Scores quotidiens par joueur
monthly_winners     Archive des vainqueurs mensuels
```

Le fichier **`SUPABASE_SCHEMA_COMPLET.sql`** contient toutes les tables, colonnes, RLS, politiques de storage, triggers et fonctions RPC. C'est le seul fichier SQL à regarder.

---

## 5. Sécurité — Points à vérifier

### RLS (Row Level Security)
Toutes les tables ont RLS activé. Points sensibles :

| Table | Politique actuelle | À vérifier |
|-------|-------------------|------------|
| `rooms` | UPDATE : `auth.uid() = host_id` | OK — seul l'hôte modifie |
| `room_players` | INSERT/UPDATE : libre (`true`) | ⚠️ N'importe qui peut modifier les scores |
| `qcm_answers` | INSERT : libre | ⚠️ Un joueur pourrait soumettre plusieurs fois (unique constraint existe) |
| `profiles` | UPDATE : sans changer `subscription_tier` | OK — le tier ne peut pas être auto-promu |
| `custom_questions` | ALL : `owner_id = auth.uid()` | OK |

### Points critiques à auditer
- **Scores** : la mise à jour du score (`UPDATE room_players SET score`) est faite côté client par l'hôte. Un hôte malveillant pourrait modifier le score de n'importe quel joueur. Envisager une Edge Function Supabase pour sécuriser.
- **`subscription_tier`** : protégé par RLS mais la fonction `admin_set_tier` utilise SECURITY DEFINER — vérifier qu'elle ne peut pas être appelée en dehors du contexte prévu.
- **Génération IA** (`/api/generate-questions`) : la clé Anthropic est en variable d'environnement côté serveur (Next.js API route). Ne pas l'exposer côté client.
- **Clés Supabase** : `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont publiques par design (Supabase). La clé `service_role` ne doit jamais apparaître côté client.

---

## 6. Temps réel — Architecture

Le jeu utilise deux mécanismes Supabase :

1. **Postgres Changes** (via `useRealtime.ts`) : écoute les INSERT/UPDATE sur `rooms`, `room_players`, `buzzes`, `qcm_answers`. Fiable mais avec une latence de ~100-500ms.

2. **Broadcast** (via `broadcastChannelRef` dans `useRoom.ts`) : canal éphémère pour les événements critiques nécessitant une propagation immédiate (buzz, révélation QCM, replay). Fire-and-forget — aucune persistance.

Le **replay** utilise les deux en parallèle : broadcast pour la rapidité + écriture de `rooms.next_code` en DB pour la fiabilité (les joueurs qui ont raté le broadcast voient quand même le changement via Realtime).

---

## 7. Ce qui est implémenté

- [x] Authentification (Google OAuth, email/password, anonyme)
- [x] Création/gestion de salle en temps réel
- [x] 4 modes de jeu fonctionnels
- [x] Mode écran public (TV/projecteur)
- [x] Packs de questions personnalisées (CRUD complet)
- [x] Import CSV de questions
- [x] Génération de questions par IA (Claude)
- [x] Questions avec image (normale + flou progressif "blur reveal")
- [x] Système d'abonnement (Free / Pro / Premium) — UI seulement, pas de paiement
- [x] Quiz du Jour (Pro/Premium) avec classement mensuel
- [x] Dashboard admin (gestion utilisateurs + Quiz du Jour)
- [x] Scoring progressif (plus vite = plus de points)
- [x] Classement inter-question animé
- [x] Replay "rejouer avec les mêmes joueurs"
- [x] Pause totale (flou + blocage)
- [x] QR code de salle
- [x] Profil joueur + historique des parties

---

## 8. Ce qui n'est PAS encore implémenté

- [ ] **Paiement** : Stripe non intégré. Les abonnements Pro/Premium sont assignés manuellement par l'admin. À brancher avec des webhooks Stripe → Edge Function → `UPDATE profiles SET subscription_tier`.
- [ ] **Email transactionnel** : pas de confirmation d'inscription, pas de récupération de mot de passe custom (délégué à Supabase Auth par défaut).
- [ ] **Audio Blind Test** : le mode blind test existe mais l'hôte doit gérer sa propre musique. Pas de lecture audio intégrée dans l'app.
- [ ] **Modération** : pas de signalement, pas de filtre sur les pseudos.
- [ ] **Tests automatisés** : aucun test unitaire ou E2E en place.
- [ ] **Analytics** : aucun tracking des parties jouées, revenus, rétention.

---

## 9. Variables d'environnement requises

```env
NEXT_PUBLIC_SUPABASE_URL=        # URL du projet Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Clé anon (publique, OK dans le frontend)
ANTHROPIC_API_KEY=               # Clé Claude pour la génération de questions (serveur uniquement)
```

---

## 10. Déploiement

- **Hébergeur** : Vercel (déploiement automatique depuis GitHub)
- **DB** : Supabase (plan Free actuel)
- **Limites Supabase Free** : 500 MB DB, 1 GB Storage, 50 000 MAU, 200 connexions simultanées. À surveiller si la base d'utilisateurs croît.

---

## 11. Questions ouvertes pour le revieweur

1. La politique `room_players UPDATE USING (true)` est-elle acceptable ou faut-il restreindre la mise à jour du score aux seuls hôtes ?
2. Faut-il ajouter un rate limiting sur les API routes `/api/generate-questions` et `/api/daily-quiz/submit` pour éviter les abus ?
3. La logique de scoring (calcul des points dans le hook React côté hôte) devrait-elle être déplacée côté serveur pour éviter la triche ?
4. Les sessions anonymes Supabase sont persistées dans `localStorage` — est-ce un problème de confidentialité pour les joueurs ?
5. L'API key Anthropic est-elle bien isolée dans les routes API Next.js et jamais exposée en `NEXT_PUBLIC_` ?
