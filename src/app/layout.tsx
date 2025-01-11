import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'Agenda Tech Brasil',
  description: 'Eventos de tecnologia no Brasil',
  icons: '/favicon.ico',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Adicione outros tamanhos ou versões do ícone se necessário */}
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /> */}
        {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /> */}
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> */}
        {/* <link rel="manifest" href="/site.webmanifest" /> */}
      </Head>
      {/* ${geistSans.variable} ${geistMono.variable} */}
      <body className={`${inter} dark antialiased`}>{children}</body>
    </html>
  )
}
