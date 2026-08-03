import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lipenza CRM',
  description: 'Sistema CRM para Lipenza — Bienestar articular y antiinflamatorio natural',
  icons: { icon: '/lipenza-iso-64.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans">{children}</body>
    </html>
  );
}
