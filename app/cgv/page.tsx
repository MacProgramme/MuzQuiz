// app/cgv/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = { title: 'Conditions Générales de Vente — MUZQUIZ' };

const plans = [
  { name: "Moustachu Découverte", price: "Gratuit", description: "Accès aux modes Quiz et Buzz Quiz, jusqu'à 10 joueurs, questions par défaut" },
  { name: "Moustachu Essentiel", price: "9,99 € / mois", description: "Quiz du Jour, jusqu'à 20 joueurs, 3 packs personnalisés" },
  { name: "Moustachu Pro", price: "19,99 € / mois", description: "Tous les modes (Blind Test inclus), jusqu'à 50 joueurs, packs illimités, écran public" },
  { name: "Moustachu Expert", price: "29,99 € / mois", description: "Toutes les fonctionnalités Pro, jusqu'à 100 joueurs, support prioritaire" },
];

export default function CGV() {
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

        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>Conditions Générales de Vente</h1>
        <p className="text-sm mb-10" style={{ color: 'rgba(240,244,255,0.35)' }}>Dernière mise à jour : mai 2025</p>

        <div className="flex flex-col gap-8" style={{ color: 'rgba(240,244,255,0.75)', lineHeight: '1.7' }}>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>1. Vendeur</h2>
            <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p><strong style={{ color: '#F0F4FF' }}>Nom :</strong> [NOM DE SOCIÉTÉ]</p>
              <p className="mt-1"><strong style={{ color: '#F0F4FF' }}>Statut :</strong> Auto-entrepreneur</p>
              <p className="mt-1"><strong style={{ color: '#F0F4FF' }}>SIRET :</strong> [NUMÉRO SIRET]</p>
              <p className="mt-1"><strong style={{ color: '#F0F4FF' }}>E-mail :</strong> antoine.gegedu27@gmail.com</p>
              <p className="mt-1 text-xs" style={{ color: 'rgba(240,244,255,0.4)' }}>TVA non applicable — art. 293 B du CGI</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>2. Produits et tarifs</h2>
            <p className="mb-4">MUZQUIZ propose les abonnements mensuels suivants :</p>
            <div className="flex flex-col gap-3">
              {plans.map((plan) => (
                <div key={plan.name} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sm" style={{ color: '#F0F4FF' }}>{plan.name}</span>
                    <span className="font-black text-sm" style={{ color: '#FF00AA' }}>{plan.price}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(240,244,255,0.4)' }}>{plan.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
              Les prix sont indiqués en euros, toutes taxes comprises. TVA non applicable selon l&apos;article 293 B du CGI.
              L&apos;éditeur se réserve le droit de modifier ses tarifs à tout moment. Les abonnements en cours ne sont
              pas affectés par une modification tarifaire jusqu&apos;au renouvellement suivant.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>3. Commande et paiement</h2>
            <p>
              La souscription à un abonnement payant s&apos;effectue directement depuis la plateforme. Le paiement est
              réalisé via un prestataire de paiement sécurisé. En finalisant votre commande, vous acceptez les présentes CGV.
            </p>
            <p className="mt-3">
              L&apos;abonnement est à renouvellement mensuel automatique. Le montant est prélevé chaque mois à la date
              anniversaire de la souscription.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>4. Droit de rétractation</h2>
            <p>
              Conformément à l&apos;article L221-18 du Code de la consommation, vous disposez d&apos;un délai de{' '}
              <strong style={{ color: '#F0F4FF' }}>14 jours</strong> à compter de la souscription pour exercer votre
              droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
            </p>
            <p className="mt-3">
              Cependant, en cochant la case prévue à cet effet lors de la souscription, vous reconnaissez expressément
              renoncer à votre droit de rétractation pour les services dont l&apos;exécution a commencé avant
              l&apos;expiration du délai de 14 jours, conformément à l&apos;article L221-28 du Code de la consommation.
            </p>
            <p className="mt-3">
              Pour exercer ce droit (si applicable), envoyez une demande à{' '}
              <a href="mailto:antoine.gegedu27@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>
                antoine.gegedu27@gmail.com
              </a>{' '}
              en précisant votre adresse e-mail de compte et la date de souscription.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>5. Résiliation et annulation</h2>
            <p>
              Vous pouvez résilier votre abonnement à tout moment depuis votre espace personnel ou en contactant
              l&apos;éditeur par e-mail. La résiliation prend effet à la fin de la période de facturation en cours.
              Aucun remboursement au prorata n&apos;est effectué pour la période restante.
            </p>
            <p className="mt-3">
              En cas de non-paiement, l&apos;éditeur se réserve le droit de suspendre l&apos;accès aux fonctionnalités
              payantes sans préavis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>6. Exécution du service</h2>
            <p>
              L&apos;accès aux fonctionnalités de l&apos;abonnement souscrit est activé immédiatement après confirmation
              du paiement. Le service est fourni par voie électronique, de manière continue pendant la durée de
              l&apos;abonnement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>7. Responsabilité du vendeur</h2>
            <p>
              L&apos;éditeur s&apos;engage à fournir le service avec soin et compétence. Sa responsabilité ne pourra
              être engagée qu&apos;en cas de faute prouvée. En tout état de cause, la responsabilité de l&apos;éditeur
              est limitée au montant des sommes versées par l&apos;acheteur au cours des 12 derniers mois.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>8. Données personnelles</h2>
            <p>
              Les données collectées lors de la commande sont traitées conformément à notre{' '}
              <Link href="/confidentialite" className="underline" style={{ color: '#8B5CF6' }}>
                Politique de confidentialité
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>9. Médiation et litiges</h2>
            <p>
              En cas de litige, nous vous invitons à contacter notre service en priorité à{' '}
              <a href="mailto:antoine.gegedu27@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>
                antoine.gegedu27@gmail.com
              </a>.
            </p>
            <p className="mt-3">
              Conformément aux articles L.616-1 et R.616-1 du Code de la consommation, vous pouvez recourir gratuitement
              à un service de médiation. La Commission européenne met également à disposition une plateforme de règlement
              en ligne des litiges accessible à :{' '}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
                className="underline" style={{ color: '#8B5CF6' }}>
                ec.europa.eu/consumers/odr
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>10. Droit applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit français. Tout litige sera soumis aux juridictions compétentes
              du ressort du siège de l&apos;éditeur.
            </p>
          </section>

        </div>

        <div className="mt-14 pt-6 flex flex-wrap gap-4 text-xs font-bold"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.3)' }}>
          <Link href="/mentions-legales" className="hover:opacity-80">Mentions légales</Link>
          <Link href="/cgu" className="hover:opacity-80">CGU</Link>
          <Link href="/confidentialite" className="hover:opacity-80">Confidentialité</Link>
        </div>

      </div>
    </div>
  );
}
