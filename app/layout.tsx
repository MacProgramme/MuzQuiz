// app/layout.tsx
import type { Metadata } from 'next';
import { Black_Han_Sans, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const blackHan = Black_Han_Sans({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-black-han',
});

export const metadata: Metadata = {
  title: 'MUZQUIZ — Quiz & Blind Test en temps réel',
  description: 'La plateforme de quiz et blind test interactif. Jouez en temps réel avec vos buzzers virtuels !',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${blackHan.variable}`}>
      <body className={inter.className} style={{ background: '#0D1B3E', minHeight: '100vh' }}>
        {/* Grain cinématique — toujours au-dessus, jamais bloquant */}
        <div className="muz-grain" aria-hidden="true" />
        {/* Gradient SVG partagé — référencé par id="muz-logo-grad" dans tous les logos */}
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="muz-logo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF00AA" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#00E5D1" />
            </linearGradient>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
