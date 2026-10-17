import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://toolflux.io'),
  title: {
    default: 'ToolFlux — Free Online Tools for Everyone',
    template: '%s | ToolFlux',
  },
  description:
    'ToolFlux offers powerful, free online tools: YouTube playlist length calculator, PDF utilities, image resizer, JSON to Pydantic converter, and more. Fast, ad-free, and privacy-friendly.',
  keywords: [
    'online tools',
    'youtube playlist length',
    'youtube video duration calculator',
    'pdf tools',
    'image resizer',
    'json to pydantic',
    'free online utilities',
  ],
  authors: [{ name: 'ToolFlux' }],
  creator: 'ToolFlux',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolflux.io',
    siteName: 'ToolFlux',
    title: 'ToolFlux — Free Online Tools for Everyone',
    description:
      'Powerful, free online tools: YouTube length calculator, PDF utilities, image resizer, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ToolFlux — Free Online Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolFlux — Free Online Tools for Everyone',
    description:
      'Powerful, free online tools: YouTube length calculator, PDF utilities, image resizer, and more.',
    images: ['/og-image.png'],
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
