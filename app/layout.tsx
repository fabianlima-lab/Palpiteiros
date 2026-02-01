import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Palpiteiros - Rumores do Futebol Brasileiro',
  description: 'Acompanhe transferências, veja o que os influenciadores dizem e dê seu palpite. O termômetro dos rumores do futebol brasileiro.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Palpiteiros',
  },
  openGraph: {
    title: 'Palpiteiros - O termômetro dos rumores do futebol',
    description: 'Acompanhe transferências, veja o que os influenciadores dizem e dê seu palpite',
    url: 'https://palpiteiro-mvp.vercel.app',
    siteName: 'Palpiteiros',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Palpiteiros - Rumores do Futebol Brasileiro',
    description: 'Acompanhe transferências, veja o que os influenciadores dizem e dê seu palpite',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f0f1a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
