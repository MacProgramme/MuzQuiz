// app/confidentialite/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = { title: 'Politique de confidentialité — MUZQUIZ' };

const dataTable = [
  { category: "Compte utilisateur", data: "Adresse e-mail, pseudo, couleur d'avatar, photo de profil (optionnelle)", basis: "Exécution du contrat" },
  { category: "Données de jeu", data: "Scores, historique des parties, packs de questions créés, résultats du Quiz du Jour", basis: "Exécution du contrat" },
  { category: "Connexion anonyme", data: "Pseudo choisi pour la session, identifiant temporaire", basis: "Intérêt légitime" },
  { category: "Données techniques", data: "Adresse IP, type de navigateur, logs de connexion (collectés par Vercel et Supabase)", basis: "Intérêt légitime (sécurité)" },
  { category: "Abonnement", data: "Niveau d'abonnement souscrit, historique de facturation (géré par le prestataire de paiement)", basis: "Exécution du contrat" },
];

const retentionTable = [
  { type: "Données de compte actif", duration: "Durée d'utilisation du service" },
  { type: "Données après suppression du compte", duration: "30 jours puis suppression définitive" },
  { type: "Données de connexion anonyme", duration: "30 jours maximum" },
  { type: "Données de facturation", duration: "10 ans (obligation légale comptable)" },
  { type: "Logs techniques", duration: "90 jours (selon Vercel et Supabase)" },
];

const subProcessors = [
  { name: "Vercel Inc.", role: "Hébergement et déploiement de l'application", location: "États-Unis", link: "vercel.com/legal/privacy-policy" },
  { name: "Supabase Inc.", role: "Base de données, authentification, stockage fichiers", location: "États-Unis (serveurs EU disponibles)", link: "supabase.com/privacy" },
  { name: "Google LLC (YouTube)", role: "Lecture des pistes audio pour les blind tests", location: "États-Unis", link: "policies.google.com/privacy" },
];

const rights = [
  { right: "Droit d'accès", desc: "Obtenir une copie de vos données personnelles" },
  { right: "Droit de rectification", desc: "Corriger des données inexactes ou incomplètes" },
  { right: "Droit à l'effacement", desc: "Demander la suppression de vos données" },
  { right: "Droit à la portabilité", desc: "Recevoir vos données dans un format lisible par machine" },
  { right: "Droit d'opposition", desc: "Vous opposer à un traitement basé sur l'intérêt légitime" },
  { right: "Droit à la limitation", desc: "Demander la suspension temporaire d'un traitement" },
];

const purposes = [
  "Créer et gérer votre compte utilisateur",
  "Permettre le fonctionnement du service de jeu en temps réel",
  "Gérer votre abonnement et la facturation",
  "Afficher les classements et scores",
  "Améliorer le service (analyses d'usage anonymisées)",
  "Assurer la sécurité et prévenir les abus",
  "Vous contacter en cas de besoin (support, modifications importantes)",
];

export default function Confidentialite() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
      <div className="max-w-2xl mx-auto px-6 py-12">

        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
            ← Accueil
          </Link>
          <MuzquizLogo width={80} textSize="1.2rem" />
        </div>

        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>Politique de confidentialité</h1>
        <p className="text-sm mb-2" style={{ color: 'rgba(240,244,255,0.35)' }}>Dernière mise à jour : mai 2025</p>
        <p className="text-sm mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Conformément au RGPD (Règlement UE 2016/679) et à la loi Informatique et Libertés.
        </p>

        <div className="flex flex-col gap-8" style={{ color: 'rgba(240,244,255,0.75)', lineHeight: '1.7' }}>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>1. Responsable du traitement</h2>
            <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p><strong style={{ color: '#F0F4FF' }}>Identité :</strong> [NOM DE SOCIÉTÉ] (auto-entrepreneur)</p>
              <p className="mt-1"><strong style={{ color: '#F0F4FF' }}>E-mail :</strong> antoine.gegedu27@gmail.com</p>
              <p className="mt-1"><strong style={{ color: '#F0F4FF' }}>SIRET :</strong> [NUMÉRO SIRET]</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>2. Données collectées</h2>
            <p className="mb-3">Selon votre utilisation du service, nous collectons les données suivantes :</p>
            <div className="flex flex-col gap-3">
              {dataTable.map((item) => (
                <div key={item.category} className="p-4 rounded-xl text-sm"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="font-black mb-1" style={{ color: '#F0F4FF' }}>{item.category}</p>
                  <p style={{ color: 'rgba(240,244,255,0.6)' }}>{item.data}</p>
                  <p className="mt-1 text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>Base légale : {item.basis}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
              Nous ne collectons pas de données sensibles (origine ethnique, opinions politiques, données de santé, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="mt-3 flex flex-col gap-2 pl-4">
              {purposes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span style={{ color: '#FF00AA', flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>4. Durée de conservation</h2>
            <div className="flex flex-col gap-0 text-sm rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {retentionTable.map((item, i) => (
                <div key={item.type} className="flex items-start justify-between gap-4 px-4 py-3"
                  style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)' }}>
                  <span style={{ color: 'rgba(240,244,255,0.7)' }}>{item.type}</span>
                  <span className="text-right font-bold flex-shrink-0" style={{ color: '#8B5CF6' }}>{item.duration}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>5. Sous-traitants et transferts</h2>
            <p className="mb-3">Nous faisons appel aux prestataires suivants :</p>
            <div className="flex flex-col gap-3 text-sm">
              {subProcessors.map((item) => (
                <div key={item.name} className="p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="font-black" style={{ color: '#F0F4FF' }}>{item.name}</p>
                  <p className="mt-1" style={{ color: 'rgba(240,244,255,0.6)' }}>{item.role}</p>
                  <p className="mt-1 text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>
                    Localisation : {item.location} —{' '}
                    <a href={`https://${item.link}`} target="_blank" rel="noopener noreferrer"
                      className="underline" style={{ color: '#8B5CF6' }}>
                      Politique de confidentialité
                    </a>
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
              Ces transferts hors UE sont encadrés par des garanties appropriées (clauses contractuelles types de la
              Commission européenne ou décision d&apos;adéquation).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>6. Vos droits</h2>
            <p className="mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
            <div className="flex flex-col gap-2 text-sm">
              {rights.map((item) => (
                <div key={item.right} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="font-black flex-shrink-0" style={{ color: '#FF00AA' }}>{item.right}</span>
                  <span style={{ color: 'rgba(240,244,255,0.6)' }}>— {item.desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à{' '}
              <a href="mailto:antoine.gegedu27@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>
                antoine.gegedu27@gmail.com
              </a>
              . Nous répondrons dans un délai maximum de <strong style={{ color: '#F0F4FF' }}>30 jours</strong>.
            </p>
            <p className="mt-3 text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer"
                className="underline" style={{ color: '#8B5CF6' }}>CNIL</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>7. Cookies</h2>
            <p>
              Le site utilise des cookies et technologies similaires (localStorage) uniquement pour le fonctionnement
              du service (maintien de session, préférences de jeu). Ces cookies sont strictement nécessaires et ne
              nécessitent pas de consentement préalable.
            </p>
            <p className="mt-3">Nous n&apos;utilisons pas de cookies publicitaires ou de tracking tiers.</p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>8. Sécurité</h2>
            <p>
              Vos données sont protégées par des mesures techniques appropriées : connexions chiffrées (HTTPS),
              authentification sécurisée, accès aux données restreint par des politiques de sécurité au niveau
              de la base de données (Row Level Security).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>9. Modifications</h2>
            <p>
              Cette politique peut être mise à jour pour refléter des changements dans nos pratiques ou la
              réglementation. En cas de modification substantielle, les utilisateurs inscrits seront informés par e-mail.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>10. Contact</h2>
            <p>
              Pour toute question relative à la protection de vos données :{' '}
              <a href="mailto:antoine.gegedu27@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>
                antoine.gegedu27@gmail.com
              </a>
            </p>
          </section>

        </div>

        <div className="mt-14 pt-6 flex flex-wrap gap-4 text-xs font-bold"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.3)' }}>
          <Link href="/mentions-legales" className="hover:opacity-80">Mentions légales</Link>
          <Link href="/cgu" className="hover:opacity-80">CGU</Link>
          <Link href="/cgv" className="hover:opacity-80">CGV</Link>
        </div>

      </div>
    </div>
  );
}
