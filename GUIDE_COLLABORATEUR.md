# GUIDE COLLABORATEUR — MUZQUIZ

> Document de référence complet pour prendre en main, modifier et déployer le projet.
> Mis à jour : mai 2026.

---

## 1. ACCÈS AUX SERVICES (changer email/mot de passe)

### Supabase (base de données)
- URL du projet : `https://fgkduwcpeinpxwrcfait.supabase.co`
- Tableau de bord : https://supabase.com → se connecter → Settings → Account
- **Changer email/MDP** : supabase.com → cliquer sur l'avatar en haut à droite → Account Settings
- Après changement de projet ou de clés : mettre à jour `.env.local` (voir section 2)

### Vercel (hébergement / déploiement)
- Tableau de bord : https://vercel.com → se connecter
- **Changer email/MDP** : vercel.com → Settings → Account → Email / Password
- Les variables d'environnement sont dans : Vercel → projet muzquiz → Settings → Environment Variables
  - Elles doivent correspondre exactement au contenu de `.env.local`

### Anthropic (IA pour la suggestion de timestamps)
- Tableau de bord : https://console.anthropic.com
- **Changer la clé API** : console.anthropic.com → API Keys → créer une nouvelle → mettre à jour `.env.local`

---

## 2. FICHIER DE CONFIGURATION — `.env.local`

Fichier à la racine du projet. **Ne jamais le committer sur GitHub.**

```
NEXT_PUBLIC_SUPABASE_URL=       # URL de ton projet Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Clé publique Supabase (anon)
SUPABASE_SERVICE_ROLE_KEY=      # Clé privée Supabase (service role) — ne jamais exposer côté client
ANTHROPIC_API_KEY=              # Clé API Claude (Anthropic) — pour la suggestion de timestamps
```

> Sur Vercel, ces 4 variables doivent aussi être renseignées dans Settings → Environment Variables.

---

## 3. SCHÉMA BASE DE DONNÉES

**Fichier unique de référence : `SUPABASE_SCHEMA_COMPLET.sql`**

C'est **LE** fichier qui contient toute la structure de la base. Si tu modifies la base de données (ajouter une colonne, une table, une politique RLS…), tu dois :
1. Exécuter le SQL dans le dashboard Supabase → SQL Editor
2. **Répercuter le changement dans `SUPABASE_SCHEMA_COMPLET.sql`**

Ne jamais créer de nouveaux fichiers SQL séparés — tout va dans ce fichier.

---

## 4. STRUCTURE DU PROJET

```
buzzy/
├── app/                    → Pages (Next.js App Router)
├── components/             → Composants React réutilisables
├── hooks/                  → Hooks React personnalisés
├── lib/                    → Utilitaires (Supabase client, questions)
├── types/                  → Types TypeScript globaux
├── public/                 → Assets statiques (logo SVG)
├── .env.local              → Variables d'environnement (secrets)
├── SUPABASE_SCHEMA_COMPLET.sql  → Schéma complet de la BDD
└── GUIDE_COLLABORATEUR.md  → Ce fichier
```

---

## 5. PAGES — OÙ ALLER POUR MODIFIER QUOI

| Je veux modifier… | Fichier |
|---|---|
| La page d'accueil (créer/rejoindre une salle) | `app/page.tsx` |
| La page de jeu en salle | `app/room/[code]/page.tsx` |
| L'écran public (TV/grand écran) | `components/PublicScreenView.tsx` |
| L'interface téléphone joueur | `components/PhoneControllerView.tsx` |
| Les résultats finaux | `app/room/[code]/results/page.tsx` |
| La page de connexion | `app/login/page.tsx` |
| La page d'inscription | `app/signup/page.tsx` |
| Le profil utilisateur | `app/profile/page.tsx` |
| La gestion des packs de questions | `app/questions/page.tsx` |
| La page des tarifs/abonnements | `app/pricing/page.tsx` |
| La page admin (codes promo, etc.) | `app/admin/page.tsx` |
| La page rejoindre via lien permanent | `app/j/[invite_code]/page.tsx` |
| La page profil public d'un joueur | `app/u/[invite_code]/page.tsx` |
| Les **mentions légales** | `app/mentions-legales/page.tsx` |
| Les **CGU** (Conditions Générales d'Utilisation) | `app/cgu/page.tsx` |
| Les **CGV** (Conditions Générales de Vente) | `app/cgv/page.tsx` |
| La politique de **confidentialité** | `app/confidentialite/page.tsx` |
| Le layout global (head, fonts, balises meta) | `app/layout.tsx` |
| Les styles globaux (CSS, animations) | `app/globals.css` |

---

## 6. COMPOSANTS — À QUOI SERT CHAQUE FICHIER

| Composant | Rôle |
|---|---|
| `BuzzerButton.tsx` | Bouton buzz rouge sur l'écran joueur |
| `DailyQuiz.tsx` | Widget Quiz du Jour (accueil) |
| `FloatingMustaches.tsx` | Animation moustaches flottantes sur fond (layout global) |
| `InterLeaderboard.tsx` | Classement inter-questions (plein écran temporaire) |
| `InviteQRCode.tsx` | Génère le QR code du lien d'invitation permanent |
| `LeaderboardQuizDuJour.tsx` | Classement du Quiz du Jour (page profil) |
| `MustacheMedal.tsx` | Médaille moustache (or/argent/bronze) pour le classement |
| `MuzquizLogo.tsx` | Logo animé MUZQUIZ (réutilisé partout) |
| `PhoneControllerView.tsx` | Vue complète du téléphone joueur pendant la partie |
| `PublicScreenView.tsx` | Vue complète de l'écran public (TV) pendant la partie |
| `QCMChoices.tsx` | Grille des 4 choix de réponse (A/B/C/D) |
| `QRScanner.tsx` | Scanner QR via la caméra du téléphone |
| `QuestionImage.tsx` | Affichage des images attachées aux questions |
| `RoomQRCode.tsx` | QR code du code de salle éphémère |
| `Scoreboard.tsx` | Classement (composant legacy, non utilisé dans le jeu principal) |
| `SettingsModal.tsx` | Modal réglages de l'hôte (durée timer, son) |
| `Timer.tsx` | Barre de progression du timer (vue téléphone) |
| `YouTubePlayer.tsx` | Lecteur YouTube intégré (blind test) |

---

## 7. HOOKS — LOGIQUE MÉTIER

| Hook | Rôle |
|---|---|
| `hooks/useRoom.ts` | **Cœur du jeu** : état de la salle, joueurs, réponses, scoring, toutes les actions (buzz, QCM, reveal, pause, start…) |
| `hooks/useRealtime.ts` | Abonnements Supabase Realtime : écoute les changements en temps réel (salle, joueurs, buzz, réponses) |

---

## 8. API ROUTES

| Route | Rôle |
|---|---|
| `app/api/suggest-start-time/route.ts` | IA (Claude Haiku) qui suggère le timestamp de départ d'une chanson YouTube (refrain, couplet…) |
| `app/api/generate-questions/route.ts` | IA qui génère des questions QCM automatiquement |
| `app/api/daily-quiz/route.ts` | Récupère les questions du Quiz du Jour |
| `app/api/daily-quiz/submit/route.ts` | Enregistre le score du Quiz du Jour |
| `app/api/redeem-code/route.ts` | Validation et activation d'un code promo |
| `app/api/test-quiz/route.ts` | Route de test interne (non exposée en prod) |

---

## 9. LIBRAIRIES UTILITAIRES

| Fichier | Rôle |
|---|---|
| `lib/supabase.ts` | Initialise le client Supabase (clés depuis `.env.local`) |
| `lib/questions.ts` | Questions par défaut MUZQUIZ (Buzz/QCM), constantes de limite gratuite |
| `types/index.ts` | **Tous les types TypeScript** : `Room`, `Player`, `Buzz`, `QCMAnswer`, `GameMode`, tiers d'abonnement, etc. |

---

## 10. MODES DE JEU

Le projet supporte 4 modes (défini dans `types/index.ts` → `GameMode`) :

| Mode | Description | Mécanique |
|---|---|---|
| `quiz` | QCM classique — tous répondent en même temps | QCM |
| `blind_test` | QCM avec une musique YouTube à identifier | QCM |
| `buzz_quiz` | Il faut buzzer avant de pouvoir répondre | Buzz |
| `buzz_blind_test` | Musique YouTube + buzz pour répondre | Buzz |

---

## 11. TIERS D'ABONNEMENT

Définis dans `types/index.ts` → `SubscriptionTier` et `TIER_LIMITS` :

| Tier | Max joueurs | Fonctionnalités |
|---|---|---|
| `decouverte` | 4 | Quiz + Buzz Quiz, questions MUZQUIZ seulement |
| `essentiel` | 8 | + Quiz du Jour, + packs perso |
| `pro` | 20 | + Blind Test, + Buzz Blind Test |
| `expert` | 50 | Tout débloqqué |

Les emails admins (accès page `/admin`) sont listés dans `SUPABASE_SCHEMA_COMPLET.sql` dans la politique RLS de la table `promo_codes`.

---

## 12. DÉPLOIEMENT

### Déployer une mise à jour
```bash
git add .
git commit -m "description du changement"
git push origin main
```
Vercel détecte le push sur `main` et redéploie automatiquement.

### Fichiers .bat à la racine
- `DEPLOYER_GITHUB.bat` — Raccourci Windows pour pusher sur GitHub
- `INSTALLER.bat` — Installe les dépendances (`npm install`)
- `METTRE_A_JOUR.bat` — Met à jour et relance le serveur local

### Lancer en local
```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## 13. FLUX PRINCIPAL D'UNE PARTIE

```
1. Hôte crée une salle (app/page.tsx)
   → room créée en DB, hôte inscrit comme is_host=true

2. Joueurs rejoignent (app/page.tsx ou app/j/[invite_code]/page.tsx)
   → insérés dans room_players

3. Hôte lance la partie
   → room.status = 'playing', room.current_question = 0

4. Joueurs répondent (via useRoom.ts)
   → buzz : INSERT dans table buzzes
   → QCM : INSERT dans table qcm_answers

5. Révélation (useRoom.ts → revealQCMAndNext)
   → scores mis à jour dans room_players
   → broadcast 'qcm_reveal' à tous via Supabase Realtime

6. Question suivante (après 10s)
   → room.current_question += 1

7. Fin de partie
   → room.status = 'finished'
   → redirect vers app/room/[code]/results/page.tsx
```

---

## 14. FICHIERS À NE PAS TOUCHER SANS RAISON

- `.env.local` → contient les secrets, ne jamais publier
- `SUPABASE_SCHEMA_COMPLET.sql` → source de vérité de la BDD
- `lib/supabase.ts` → initialisation du client, ne pas modifier sauf si on change de projet Supabase
- `types/index.ts` → tout changement ici impacte tout le projet

---

*Pour toute question sur l'architecture ou une fonctionnalité spécifique, se référer aux commentaires en haut de chaque fichier — chaque page et composant commence par un commentaire expliquant son rôle.*
