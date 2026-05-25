// app/confidentialite/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = {
  title: 'Politique de confidentialité — MUZQUIZ',
  alternates: { canonical: 'https://www.muzquiz.fr/confidentialite' },
};

type Section = { num: string; title: string; items?: string[]; content: React.ReactNode };

const block = (children: React.ReactNode) => (
  <div className="p-4 rounded-xl text-sm flex flex-col gap-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
    {children}
  </div>
);

const list = (items: string[]) => (
  <ul className="mt-2 flex flex-col gap-1 ml-3">
    {items.map(i => <li key={i} style={{ color: 'rgba(240,244,255,0.65)' }}>— {i}</li>)}
  </ul>
);

const SECTIONS: Section[] = [
  {
    num: '1', title: 'Responsable du traitement',
    content: block(<>
      <p><strong style={{ color: '#F0F4FF' }}>Dimitri Bouville – La Caravane Game</strong></p>
      <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Statut :</span> Micro-entrepreneur</p>
      <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>SIRET :</span> 80424567800029</p>
      <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Adresse :</span> 29 rue du Traité de Rome, 14370 Moult-Chicheboville, France</p>
      <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>E-mail :</span>{' '}
        <a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a>
      </p>
    </>),
  },
  {
    num: '2', title: 'Objet de la présente politique',
    content: <p>La présente politique a pour objet d&apos;informer les utilisateurs du site MUZ QUIZ sur la manière dont leurs données personnelles sont collectées, utilisées, conservées et protégées conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation française applicable.</p>,
  },
  {
    num: '3', title: 'Données collectées',
    content: <>
      <p>Selon l&apos;utilisation du service, les données suivantes peuvent être collectées.</p>
      {[
        { label: 'Création et gestion du compte', items: ['adresse e-mail', 'pseudo', 'mot de passe sécurisé et chiffré', 'photo de profil (facultative)', 'couleur d\'avatar ou préférences utilisateur'] },
        { label: 'Données de jeu', items: ['scores', 'statistiques de parties', 'classements', 'historique des parties', 'quiz créés', 'questions créées', 'packs personnalisés', 'participation aux événements et défis'] },
        { label: 'Données techniques', items: ['adresse IP', 'type de navigateur', 'système d\'exploitation', 'informations de connexion', 'journaux techniques de sécurité', 'informations relatives aux appareils utilisés'] },
        { label: 'Données liées aux abonnements', items: ['formule souscrite', 'date de souscription', 'historique de facturation', 'statut des paiements', 'identifiants de transaction transmis par Stripe'] },
        { label: 'Connexion via fournisseurs tiers (Google / Discord)', items: ['nom du profil', 'adresse e-mail', 'identifiant utilisateur fourni par le service', 'photo de profil éventuellement associée'] },
        { label: 'Newsletter et communications (avec consentement)', items: ['adresse e-mail', 'préférences de communication', 'historique d\'inscription ou de désinscription'] },
      ].map(g => (
        <div key={g.label} className="mt-3">
          <p className="text-sm font-bold" style={{ color: '#F0F4FF' }}>{g.label}</p>
          {list(g.items)}
        </div>
      ))}
    </>,
  },
  {
    num: '4', title: 'Données non collectées',
    content: <>
      <p>MUZ QUIZ ne collecte pas volontairement de données sensibles au sens du RGPD, notamment :</p>
      {list(['origine raciale ou ethnique', 'opinions politiques', 'convictions religieuses', 'données de santé', 'orientation sexuelle', 'données biométriques'])}
    </>,
  },
  {
    num: '5', title: 'Finalités du traitement',
    content: <>
      {[
        { label: 'Gestion du compte', items: ['créer le compte utilisateur', 'authentifier l\'utilisateur', 'permettre l\'accès aux fonctionnalités du service'] },
        { label: 'Fonctionnement du jeu', items: ['gérer les parties', 'enregistrer les scores', 'afficher les classements', 'sauvegarder les quiz créés', 'fournir les fonctionnalités souscrites'] },
        { label: 'Gestion des abonnements', items: ['traiter les paiements', 'gérer les renouvellements', 'gérer les annulations', 'assurer le suivi administratif et comptable'] },
        { label: 'Amélioration du service', items: ['mesurer l\'audience', 'détecter les dysfonctionnements', 'améliorer les performances', 'développer de nouvelles fonctionnalités'] },
        { label: 'Sécurité', items: ['prévenir les fraudes', 'lutter contre les abus', 'détecter les accès non autorisés', 'protéger les utilisateurs et les infrastructures techniques'] },
        { label: 'Communication', items: ['répondre aux demandes de support', 'informer des modifications importantes', 'envoyer des communications liées au fonctionnement du service'] },
      ].map(g => (
        <div key={g.label} className="mt-3">
          <p className="text-sm font-bold" style={{ color: '#F0F4FF' }}>{g.label}</p>
          {list(g.items)}
        </div>
      ))}
    </>,
  },
  {
    num: '6', title: 'Bases légales du traitement',
    content: <>
      {[
        { label: 'Exécution du contrat', items: ['création du compte', 'utilisation du service', 'gestion des abonnements', 'accès aux fonctionnalités proposées'] },
        { label: 'Obligation légale', items: ['conservation des données comptables', 'respect des obligations fiscales', 'demandes des autorités compétentes'] },
        { label: 'Intérêt légitime', items: ['sécurité du service', 'prévention de la fraude', 'amélioration technique de la plateforme', 'gestion des statistiques anonymisées'] },
        { label: 'Consentement', items: ['utilisation éventuelle de certains cookies', 'envoi d\'une newsletter', 'certaines communications facultatives'] },
      ].map(g => (
        <div key={g.label} className="mt-3">
          <p className="text-sm font-bold" style={{ color: '#F0F4FF' }}>{g.label}</p>
          {list(g.items)}
        </div>
      ))}
    </>,
  },
  {
    num: '7', title: 'Durée de conservation',
    content: <>
      {[
        { label: 'Compte utilisateur actif', text: 'Les données sont conservées tant que le compte reste actif.' },
        { label: 'Suppression du compte', text: 'Les données sont supprimées ou anonymisées dans un délai maximal de 30 jours après suppression du compte, sauf obligation légale contraire.' },
        { label: 'Données de facturation', text: 'Les données comptables sont conservées pendant 10 ans conformément aux obligations légales.' },
        { label: 'Journaux techniques', text: 'Les logs de connexion et de sécurité sont conservés pour une durée maximale de 90 jours.' },
        { label: 'Newsletter', text: 'Les données liées à la newsletter sont conservées jusqu\'au retrait du consentement ou à la désinscription.' },
      ].map(g => (
        <div key={g.label} className="mt-3">
          <p className="text-sm font-bold" style={{ color: '#F0F4FF' }}>{g.label}</p>
          <p className="mt-1">{g.text}</p>
        </div>
      ))}
    </>,
  },
  {
    num: '8', title: 'Destinataires des données',
    content: <>
      <p>Les données peuvent être traitées par les prestataires techniques suivants :</p>
      {[
        { name: 'Vercel', role: 'Hébergement et déploiement de l\'application.' },
        { name: 'Supabase', role: 'Base de données, authentification et stockage.' },
        { name: 'Stripe', role: 'Gestion des paiements et des abonnements.' },
        { name: 'Google', role: 'Authentification, statistiques et services associés.' },
        { name: 'Discord', role: 'Authentification utilisateur facultative.' },
      ].map(p => (
        <div key={p.name} className="mt-2 ml-3">
          <span style={{ color: '#F0F4FF', fontWeight: 700 }}>{p.name}</span>
          <span style={{ color: 'rgba(240,244,255,0.65)' }}> — {p.role}</span>
        </div>
      ))}
      <p className="mt-3">Ces prestataires n&apos;accèdent aux données que dans le cadre des services qu&apos;ils fournissent.</p>
    </>,
  },
  {
    num: '9', title: 'Transferts internationaux',
    content: <><p>Certains prestataires peuvent être situés hors de l&apos;Union européenne. Lorsque cela est nécessaire, ces transferts sont encadrés par des garanties appropriées telles que :</p>{list(['clauses contractuelles types approuvées par la Commission européenne', 'mécanismes reconnus par la réglementation applicable', 'mesures complémentaires de sécurité lorsque nécessaire'])}</>,
  },
  {
    num: '10', title: 'Sécurité des données',
    content: <><p>MUZ QUIZ met en œuvre des mesures de sécurité adaptées, notamment :</p>{list(['chiffrement des communications via HTTPS', 'authentification sécurisée', 'protection des accès administrateurs', 'journalisation des événements de sécurité', 'restrictions d\'accès aux données', 'mécanismes de sauvegarde et de récupération'])}<p className="mt-3">Malgré ces mesures, aucun système ne peut garantir une sécurité absolue.</p></>,
  },
  {
    num: '11', title: 'Vos droits',
    content: <>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      {[
        { label: 'Droit d\'accès', text: 'Obtenir une copie des données vous concernant.' },
        { label: 'Droit de rectification', text: 'Corriger des informations inexactes ou incomplètes.' },
        { label: 'Droit à l\'effacement', text: 'Demander la suppression de vos données personnelles lorsque cela est légalement possible.' },
        { label: 'Droit à la limitation', text: 'Demander la suspension temporaire d\'un traitement.' },
        { label: 'Droit d\'opposition', text: 'Vous opposer à certains traitements fondés sur l\'intérêt légitime.' },
        { label: 'Droit à la portabilité', text: 'Recevoir vos données dans un format structuré et réutilisable.' },
        { label: 'Retrait du consentement', text: 'Retirer à tout moment votre consentement lorsqu\'un traitement repose sur celui-ci.' },
      ].map(r => (
        <div key={r.label} className="mt-2 ml-3">
          <span style={{ color: '#F0F4FF', fontWeight: 700 }}>{r.label}</span>
          <span style={{ color: 'rgba(240,244,255,0.65)' }}> — {r.text}</span>
        </div>
      ))}
    </>,
  },
  {
    num: '12', title: 'Exercice des droits',
    content: <><p>Pour exercer vos droits, contactez :</p><p className="mt-2"><a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a></p><p className="mt-2">Une réponse sera apportée dans un délai maximal d&apos;un mois, sauf circonstances particulières prévues par la réglementation.</p></>,
  },
  {
    num: '13', title: 'Réclamation auprès de la CNIL',
    content: <><p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de :</p><p className="mt-2"><strong style={{ color: '#F0F4FF' }}>CNIL – Commission Nationale de l&apos;Informatique et des Libertés</strong></p><p className="mt-1"><a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="underline" style={{ color: '#8B5CF6' }}>https://www.cnil.fr</a></p></>,
  },
  {
    num: '14', title: 'Suppression du compte',
    content: <><p>L&apos;utilisateur peut demander la suppression de son compte à tout moment depuis les fonctionnalités disponibles sur la plateforme ou en adressant une demande à <a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a>.</p><p className="mt-2">La suppression entraîne la désactivation du compte ainsi que l&apos;effacement ou l&apos;anonymisation des données associées, sous réserve des obligations légales de conservation.</p></>,
  },
  {
    num: '15', title: 'Modifications de la présente politique',
    content: <p>La présente politique peut être modifiée afin de tenir compte des évolutions légales, réglementaires ou techniques du service. La date de mise à jour figurant en tête du document sera alors modifiée.</p>,
  },
  {
    num: '16', title: 'Contact',
    content: block(<><p><a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a></p></>),
  },
];

export default function ConfidentialitePage() {
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
        <div className="flex flex-col gap-8" style={{ color: 'rgba(240,244,255,0.72)', lineHeight: '1.75', fontSize: '0.9rem' }}>
          {SECTIONS.map(s => (
            <section key={s.num}>
              <h2 className="text-base font-black mb-4" style={{ color: '#8B5CF6' }}>{s.num}. {s.title}</h2>
              {s.content}
            </section>
          ))}
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
