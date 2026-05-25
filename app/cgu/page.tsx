// app/cgu/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = { title: "Conditions Générales d'Utilisation — MUZQUIZ" };

const usageRules = [
  "Ne pas utiliser le service à des fins illicites ou contraires à l'ordre public",
  "Ne pas créer de contenu offensant, discriminatoire, diffamatoire ou portant atteinte aux droits de tiers",
  "Ne pas tenter de contourner les mécanismes de sécurité ou de perturber le fonctionnement du service",
  "Ne pas reproduire, copier ou revendre tout ou partie du service sans autorisation",
  "Utiliser un pseudo approprié n'usurpant pas l'identité d'un tiers",
];

const features = [
  "Créer et rejoindre des salles de quiz ou de blind test en temps réel",
  "Jouer avec plusieurs participants simultanément via un système de buzzer virtuel",
  "Créer des packs de questions personnalisés (selon le niveau d'abonnement)",
  "Participer à un Quiz du Jour (selon le niveau d'abonnement)",
  "Consulter des classements en temps réel",
];

export default function CGU() {
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

        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>{"Conditions Générales d'Utilisation"}</h1>
        <p className="text-sm mb-10" style={{ color: 'rgba(240,244,255,0.35)' }}>Dernière mise à jour : mai 2025</p>

        <div className="flex flex-col gap-8" style={{ color: 'rgba(240,244,255,0.75)', lineHeight: '1.7' }}>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>1. Objet et acceptation</h2>
            <p>
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation de la plateforme{' '}
              <strong style={{ color: '#F0F4FF' }}>MUZQUIZ</strong>, service de quiz et blind test interactif en temps réel,
              édité par [NOM DE SOCIÉTÉ] (auto-entrepreneur).
            </p>
            <p className="mt-3">
              Toute utilisation du service implique l&apos;acceptation pleine et entière des présentes CGU.
              Si vous n&apos;acceptez pas ces conditions, vous devez cesser d&apos;utiliser le service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>2. Description du service</h2>
            <p>MUZQUIZ est une plateforme permettant de :</p>
            <ul className="mt-3 flex flex-col gap-2 pl-4">
              {features.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span style={{ color: '#FF00AA', flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Le service est disponible en version gratuite (Moustachu Découverte) et en versions payantes
              (Moustachu Essentiel, Pro, Expert) détaillées dans les{' '}
              <Link href="/cgv" className="underline" style={{ color: '#8B5CF6' }}>Conditions Générales de Vente</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>3. Accès au service et compte utilisateur</h2>
            <p>
              Le service est accessible à toute personne disposant d&apos;une connexion internet.
              Certaines fonctionnalités nécessitent la création d&apos;un compte utilisateur via une adresse e-mail valide.
            </p>
            <p className="mt-3">
              L&apos;utilisateur est seul responsable de la confidentialité de ses identifiants de connexion et de toute
              activité effectuée depuis son compte. En cas de compromission, il doit en informer l&apos;éditeur sans délai.
            </p>
            <p className="mt-3">
              L&apos;accès anonyme (sans compte) est possible pour rejoindre une salle de jeu en tant que participant.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>4. Règles d&apos;utilisation</h2>
            <p>L&apos;utilisateur s&apos;engage à :</p>
            <ul className="mt-3 flex flex-col gap-2 pl-4">
              {usageRules.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span style={{ color: '#FF00AA', flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              L&apos;éditeur se réserve le droit de suspendre ou supprimer tout compte ne respectant pas ces règles,
              sans préavis ni remboursement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>5. Contenu utilisateur</h2>
            <p>
              Les utilisateurs peuvent créer des packs de questions personnalisés. En publiant ce contenu,
              l&apos;utilisateur garantit qu&apos;il dispose des droits nécessaires et accorde à l&apos;éditeur une
              licence non exclusive, mondiale et gratuite pour stocker et afficher ce contenu dans le cadre du service.
            </p>
            <p className="mt-3">
              L&apos;éditeur ne saurait être tenu responsable du contenu créé par les utilisateurs.
              Tout contenu illicite signalé pourra être supprimé à la discrétion de l&apos;éditeur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>6. Disponibilité du service</h2>
            <p>
              L&apos;éditeur s&apos;efforce d&apos;assurer la disponibilité du service 24h/24, 7j/7, mais ne peut
              garantir une disponibilité continue. Des interruptions pour maintenance, mise à jour ou incidents techniques
              peuvent survenir. L&apos;éditeur ne saurait être tenu responsable des pertes résultant d&apos;une
              indisponibilité du service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>7. Propriété intellectuelle</h2>
            <p>
              Tous les éléments du service (marque MUZQUIZ, design, code, questions par défaut, sons) sont la propriété
              exclusive de l&apos;éditeur. Toute reproduction ou utilisation sans autorisation est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>8. Limitation de responsabilité</h2>
            <p>
              Le service est fourni « en l&apos;état ». L&apos;éditeur ne garantit pas que le service sera exempt
              d&apos;erreurs ou adapté à un usage particulier. La responsabilité de l&apos;éditeur ne pourra excéder
              les sommes versées par l&apos;utilisateur au cours des 12 derniers mois.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>9. Modification des CGU</h2>
            <p>
              L&apos;éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs inscrits
              seront informés par e-mail. La poursuite de l&apos;utilisation du service après modification vaut
              acceptation des nouvelles CGU.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>10. Droit applicable et juridiction</h2>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige, une solution amiable sera recherchée
              en priorité. À défaut, les tribunaux compétents du ressort du siège de l&apos;éditeur seront saisis.
            </p>
            <p className="mt-3">
              Conformément aux dispositions du Code de la consommation, vous pouvez également recourir à une procédure
              de médiation conventionnelle ou à tout autre mode alternatif de règlement des différends.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>11. Contact</h2>
            <p>
              Pour toute question relative aux présentes CGU :{' '}
              <a href="mailto:antoine.gegedu27@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>
                antoine.gegedu27@gmail.com
              </a>
            </p>
          </section>

        </div>

        <div className="mt-14 pt-6 flex flex-wrap gap-4 text-xs font-bold"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.3)' }}>
          <Link href="/mentions-legales" className="hover:opacity-80">Mentions légales</Link>
          <Link href="/cgv" className="hover:opacity-80">CGV</Link>
          <Link href="/confidentialite" className="hover:opacity-80">Confidentialité</Link>
        </div>

      </div>
    </div>
  );
}
