import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tarifs & Abonnements',
  description: 'Découvrez les offres MUZQUIZ : Découverte gratuite, Essentiel, Pro et Expert. Quiz et blind test illimités, buzzers virtuels, classements en temps réel.',
  alternates: {
    canonical: 'https://www.muzquiz.fr/pricing',
  },
  openGraph: {
    title: 'Tarifs MUZQUIZ — Offres Quiz & Blind Test',
    description: 'De la formule gratuite à l\'offre Expert. Lancez vos premières parties gratuitement.',
    url: 'https://www.muzquiz.fr/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
