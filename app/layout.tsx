// app/layout.tsx
import type { Metadata } from 'next';
import { Black_Han_Sans, Inter } from 'next/font/google';
import './globals.css';
import { FloatingMustaches } from '@/components/FloatingMustaches';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const blackHan = Black_Han_Sans({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-black-han',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.muzquiz.fr'),
  title: {
    default: 'MUZQUIZ — Quiz & Blind Test en temps réel',
    template: '%s | MUZQUIZ',
  },
  description: 'Organisez des quiz et blind tests multijoueurs en temps réel. Buzzers virtuels sur smartphone, classements live, packs musicaux. Parfait pour bars, animateurs et événements.',
  keywords: [
    'quiz en ligne', 'blind test', 'quiz multijoueur', 'quiz temps réel',
    'blind test en ligne', 'buzzer quiz', 'animation bar', 'quiz bar',
    'blind test bar', 'animateur quiz', 'quiz soirée', 'muzquiz',
  ],
  authors: [{ name: 'MUZQUIZ', url: 'https://www.muzquiz.fr' }],
  creator: 'MUZQUIZ',
  publisher: 'MUZQUIZ',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.muzquiz.fr',
    siteName: 'MUZQUIZ',
    title: 'MUZQUIZ — Quiz & Blind Test en temps réel',
    description: 'Organisez des quiz et blind tests multijoueurs en temps réel. Buzzers virtuels sur smartphone, classements live, packs musicaux.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MUZQUIZ — Quiz & Blind Test en temps réel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MUZQUIZ — Quiz & Blind Test en temps réel',
    description: 'Organisez des quiz et blind tests multijoueurs en temps réel. Buzzers virtuels, classements live, packs musicaux.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.muzquiz.fr',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${blackHan.variable}`}>
      <body className={inter.className} style={{ background: '#0D1B3E', minHeight: '100vh' }}>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "MUZQUIZ",
                "url": "https://www.muzquiz.fr",
                "description": "Plateforme de quiz et blind test multijoueur en temps réel",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://www.muzquiz.fr/?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "MUZQUIZ",
                "url": "https://www.muzquiz.fr",
                "logo": "https://www.muzquiz.fr/logo.png",
                "sameAs": [],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer support",
                  "availableLanguage": "French"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "MUZQUIZ",
                "applicationCategory": "GameApplication",
                "operatingSystem": "Web",
                "url": "https://www.muzquiz.fr",
                "description": "Organisez des quiz et blind tests multijoueurs en temps réel avec buzzers virtuels sur smartphone.",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "EUR"
                }
              }
            ])
          }}
        />
        {/* Moustaches flottantes décoratives */}
        <FloatingMustaches />
        {/* Grain cinématique — toujours au-dessus, jamais bloquant */}
        <div className="muz-grain" aria-hidden="true" />
        {/* Gradient SVG partagé — référencé par id="muz-logo-grad" dans tous les logos */}
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="muz-logo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF00AA" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="