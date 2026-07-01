import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Essence Boutique - Admin',
  description: 'Sistema de Administração Essence Boutique',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   <html lang="pt-br">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}