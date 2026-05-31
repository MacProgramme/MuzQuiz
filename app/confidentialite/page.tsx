// app/confidentialite/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = { title: 'Politique de confidentialité — MUZQUIZ' };

const sections = [
  { title: '1. Responsable du traitement', content: `Dimitri Bouville – La Caravane Game\nMicro-entrepreneur – SIRET : 80424567800029\n29 rue du Traité de Rome, 14370 Moult-Chicheboville, France\nlacaravanegame@gmail.com` },
  { title: '2. Objet', content: `La présente politique a pour objet d'informer les utilisateurs du site MUZ QUIZ sur la manière dont leurs données personnelles sont collectées, utilisées, conservées et protégées conformément au RGPD et à la législation française applicable.` },
  { title: '3. Données collectées', content: `Création et gestion du compte : adresse e-mail, pseudo, mot de passe sécurisé et chiffré, photo de profil (facultative), couleur d'avatar.\n\nDonnées de jeu : scores, statistiques de parties, classements, historique des parties, quiz créés, questions créées, packs personnalisés.\n\nDonnées techniques : adresse IP, type de navigateur, système d'exploitation, informations de connexion, journaux techniques de sécurité.\n\nDonnées liées aux abonnements : formule souscrite, date de souscription, historique de facturation, statut des paiements, identifiants de transaction transmis par Stripe.\n\nConnexion via fournisseurs tiers (Google, Discord) : nom du profil, adresse e-mail, identifiant utilisateur, photo de profil éventuellement associée au compte.\n\nNewsletter et communications (avec consentement) : adresse e-mail, préférences de communication.` },
  { title: '4. Données non collectées', content: `MUZ QUIZ ne collecte pas volontairement de données sensibles au sens du RGPD : origine raciale ou ethnique, opinions politiques, convictions religieuses, données de santé, orientation sexuelle, données biométriques.` },
  { title: '5. Finalités du traitement', content: `Gestion du compte : créer le compte, authentifier l'utilisateur, permettre l'accès aux fonctionnalités.\n\nFonctionnement du jeu : gérer les parties, enregistrer les scores, afficher les classements, sauvegarder les quiz créés.\n\nGestion des abonnements : traiter les paiements, gérer les renouvellements et annulations, assurer le suivi comptable.\n\nAmélioration du service : mesurer l'audience, détecter les dysfonctionnements, améliorer les performances.\n\nSécurité : prévenir les fraudes, lutter contre les abus, détecter les accès non autorisés.\n\nCommunication : répondre aux demandes de support, informer des modifications importantes.` },
  { title: '6. Bases légales du traitement', content: `Exécution du contrat : création du compte, utilisation du service, gestion des abonnements.\n\nObligation légale : conservation des données comptables, respect des obligations fiscales.\n\nIntérêt légitime : sécurité du service, prévention de la fraude, amélioration technique.\n\nConsentement : certains cookies, envoi de newsletter, communications facultatives.` },
  { title: '7. Durée de conservation', content: `Compte utilisateur actif : données conservées tant que le compte reste actif.\n\nSuppression du compte : suppression ou anonymisation dans un délai maximal de 30 jours.\n\nDonnées de facturation : conservées pendant 10 ans conformément aux obligations légales.\n\nJournaux techniques : conservés 90 jours maximum.\n\nNewsletter : jusqu'au retrait du consentement.` },
  { title: '8. Destinataires des données', content: `Vercel — hébergement et déploiement.\nSupabase — base de données, authentification et stockage.\nStripe — gestion des paiements et abonnements.\nGoogle — authentification, statistiques et services associés.\nDiscord — authentification utilisateur facultative.\n\nCes prestataires n'accèdent aux données que dans le cadre des services qu'ils fournissent.` },
  { title: '9. Transferts internationaux', content: `Certains prestataires peuvent être situés hors de l'Union européenne. Lorsque cela est nécessaire, ces transferts sont encadrés par des garanties appropriées telles que des clauses contractuelles types approuvées par la Commission européenne.` },
  { title: '10. Sécurité des données', content: `MUZ QUIZ met en œuvre des mesures de sécurité adaptées : chiffrement des communications via HTTPS, authentification sécurisée, protection des accès administrateurs, journalisation des événements de sécurité, restrictions d'accès aux données, mécanismes de sauvegarde. Malgré ces mesures, aucun système ne peut garantir une sécurité absolue.` },
  { title: '11. Vos droits', content: `Conformément au RGPD, vous disposez des droits suivants :\n- Droit d'accès : obtenir une copie des données vous concernant.\n- Droit de rectification : corriger des informations inexactes.\n- Droit à l'effacement : demander la suppression de vos données.\n- Droit à la limitation : suspendre temporairement un traitement.\n- Droit d'opposition : vous opposer à certains traitements.\n- Droit à la portabilité : recevoir vos données dans un format structuré.\n- Retrait du consentement : à tout moment pour les traitements basés sur celui-ci.` },
  { title: '12. Exercice des droits', content: `Pour exercer vos droits, contactez : lacaravanegame@gmail.com\n\nUne réponse sera apportée dans un délai maximal d'un mois.` },
  { title: '13. Réclamation auprès de la CNIL', content: `Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de la CNIL : https://www.cnil.fr` },
  { title: '14. Suppression du compte', content: `L'utilisateur peut demander la suppression de son compte depuis la plateforme ou en adressant une demande à lacaravanegame@gmail.com. La suppression entraîne la désactivation du compte et l'effacement ou l'anonymisation des données associées, sous réserve des obligations légales.` },
  { title: '15. Modifications', content: `La présente politique peut être modifiée pour tenir compte des évolutions légales, réglementaires ou techniques. La date de mise à jour figurant en tête du document sera alors modifiée.` },
  { title: '16. Contact', content: `lacaravanegame@gmail.com` },
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
        <p className="text-sm mb-10" style={{ color: 'rgba(240,244,255,0.35)' }}>Dernière mise à jour : mai 2026</p>
        <div className="flex flex-col gap-8">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-base font-black mb-3" style={{ color: '#8B5CF6' }}>{s.title}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(240,244,255,0.65)' }}>{s.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 flex flex-wrap gap-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.3)' }}>
          <Link href="/mentions-legales" className="hover:opacity-70">Mentions légales</Link>
          <Link href="/cookies" className="hover:opacity-70">Politique de cookies</Link>
          <Link href="/cgu" className="hover:opacity-70">CGU</Link>
          <Link href="/cgv" className="hover:opacity-70">CGV</Link>
        </div>
      </div>
    </div>
  );
}
