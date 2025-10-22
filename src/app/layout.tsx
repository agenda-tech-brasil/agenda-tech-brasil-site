import './globals.css'

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Agenda Tech Brasil',
    template: '%s | Agenda Tech Brasil',
  },
  description: 'Eventos de tecnologia no Brasil',
  metadataBase: new URL('https://agenda-tech-brasil-site.js.org/'),
  keywords: [
    'tecnologia',
    'eventos tech',
    'conferências Brasil',
    'meetups desenvolvimento',
    'hackathons',
    'workshops programação',
  ],
  authors: [
    {
      name: 'Agenda Tech Brasil',
      url: 'https://agenda-tech-brasil-site.js.org',
    },
  ],
  creator: 'Agenda Tech Brasil',
  publisher: 'Agenda Tech Brasil',
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/pt-BR',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    // verification: {
    //   google: 'your-google-verification-code',
    // },
    title: 'Agenda Tech Brasil',
    description: 'Eventos de tecnologia no Brasil',
    url: 'https://agenda-tech-brasil-site.js.org',
    siteName: 'Agenda Tech Brasil',
    images: [
      {
        url: '/bg-preview.png',
        width: 1200,
        height: 630,
        alt: 'Background Preview Agenda Tech Brasil',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agenda Tech Brasil',
    description: 'Eventos de tecnologia no Brasil',
    creator: '@agendatechbrasil',
    images: ['/bg-preview.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],

  },
  manifest: '/site.webmanifest',
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#000000" />
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
