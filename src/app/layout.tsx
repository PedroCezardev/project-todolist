import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tarefex',
  description: 'Aumente sua produtividade a cada dia.',
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