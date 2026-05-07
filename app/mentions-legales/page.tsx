// app/mentions-legales/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = { title: 'Mentions légales — MUZQUIZ' };

export default function MentionsLegales() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Nav */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
            ← Accueil
          </Link>
          <MuzquizLogo width={80} textSize="1.2rem" />
        </div>

        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>Mentions légales</h1>
        <p className="text-sm mb-10" style={{ color: 'rgba(240,244,255,0.35)' }}>Dernière mise à jour : mai 2025</p>

        <div className="flex flex-col gap-8" style={{ color: 'rgba(240,244,255,0.75)', lineHeight: '1.7' }}>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>1. Éditeur du site</h2>
            <p>
              Le site <strong style={{ color: '#F0F4FF' }}>MUZQUIZ</strong> (accessible à l&apos;adresse
              muz-quiz-one.vercel.app) est édité par :
            </p>
            <div className="mt-3 p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p><strong style={{ color: '#F0F4FF' }}>Nom :</strong> [NOM DE SOCIÉTÉ]</p>
              <p className="mt-1"><strong style={{ color: '#F0F4FF' }}>Statut :</strong> Auto-entrepreneur</p>
              <p className="mt-1"><strong style={{ color: '#F0F4FF' }}>SIRET :</strong> [NUMÉRO SIRET]</p>
              <p className="mt-1"><strong style={{ color: '#F0F4FF' }}>Adresse :</strong> [ADRESSE COMPLÈTE]</p>
              <p className="mt-1"><strong style={{ color: '#F0F4FF' }}>E-mail :</strong> antoine.gegedu27@gmail.com</p>
            </div>
            <p className="mt-3 text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
              TVA non applicable — article 293 B du Code général des impôts (auto-entrepreneur sous le seuil de franchise).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>2. Hébergement</h2>
            <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p><strong style={{ color: '#F0F4FF' }}>Hébergeur :</strong> Vercel Inc.</p>
              <p className="mt-1"><strong style={{ color: '#F0F4FF' }}>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
              <p className="mt-1"><strong style={{ color: '#F0F4FF' }}>Site :</strong> vercel.com</p>
            </div>
            <p className="mt-3 text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
              La base de données et l&apos;authentification sont gérées par Supabase (Supabase Inc.,
              San Francisco, CA, États-Unis).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>3. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus présents sur MUZQUIZ (textes, graphismes, logos, icônes, sons, logiciels)
              est la propriété exclusive de l&apos;éditeur ou de ses partenaires et est protégé par les lois françaises
              et internationales relatives à la propriété intellectuelle.
            </p>
            <p className="mt-3">
              Toute reproduction, représentation, modification ou exploitation, totale ou partielle, du site ou de son
              contenu, par quelque procédé que ce soit, sans autorisation préalable et écrite de l&apos;éditeur, est
              strictement interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants
              du Code de la propriété intellectuelle.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>4. Responsabilité</h2>
            <p>
              L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations
              diffusées sur le site. Toutefois, il ne peut garantir l&apos;exactitude, la complétude ou
              l&apos;actualité des informations.
            </p>
            <p className="mt-3">
              L&apos;éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de
              l&apos;accès au site ou de l&apos;utilisation de son contenu, ni des interruptions ou
              indisponibilités du service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>5. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux
              français seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-3" style={{ color: '#FF00AA' }}>6. Contact</h2>
            <p>
              Pour toute question relative au site, vous pouvez contacter l&apos;éditeur à l&apos;adresse
              suivante :{' '}
              <a href="mailto:antoine.gegedu27@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>
                antoine.gegedu27@gmail.com
              </a>
            </p>
          </section>

        </div>

        {/* Footer liens */}
        <div className="mt-14 pt-6 flex flex-wrap gap-4 text-xs font-bold" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.3)' }}>
          <Link href="/cgu" className="hover:opacity-80">CGU</Link>
          <Link href="/cgv" className="hover:opacity-80">CGV</Link>
          <Link href="/confidentialite" className="hover:opacity-80">Confidentialité</Link>
        </div>

      </div>
    </div>
  );
}
