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
        {children}
      </body>
    </html>
  );
}
