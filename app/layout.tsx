import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '@/app/globals.css';
import Navbar from "@/components/NavBar/Navbar";
import { AuthProvider } from '@/contexts/authContext';
import { WindowProvider } from '@/contexts/windowContext';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title:
    'Stocky',
  description:
    'Stocky is an earning app designed to provide users with the opportunity to invest in shares and earn daily profits on their deposit amount.',
  keywords: ['stocky', 'stocky.uk', 'stocky.uk.com', 'stocky uk', 'stocky uk com', 'stocky pakistan', 'www.stocky.uk.com', 'www.stocky.uk', 'www stocky uk', 'www stocky uk com', 'stocky login', 'stocky register', 'stocky signup', 'stocky create acount', 'stocky market', 'stocky dashboard', 'stocky account', 'stocky account recovery', 'stocky forgot password', 'stocky forget'],
  icons: [
    {
      rel: 'shortcut icon',
      type: 'image/x-icon',
      url: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '76x76',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'mask-icon',
      type: 'image/svg',
      color: '#5bbad5',
      url: '/safari-pinned-tab.svg',
    },
  ],
  manifest: '/site.webmanifest',
  creator: 'Stocky.uk.com',
  publisher: 'Stocky.uk.com',
  metadataBase: new URL('https://stocky.uk.com'),
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://stocky.uk.com',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: '#ffffff',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <meta name="msapplication-TileColor" content="#da532c"></meta>
      <body className={`${montserrat.className} bg-custom overflow-hidden md:overflow-y-auto`}>
        <AuthProvider>
          <Navbar />
          <WindowProvider>
            {children}
          </WindowProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
