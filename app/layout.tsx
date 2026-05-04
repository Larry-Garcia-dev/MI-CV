import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0a0a1a' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a1a' },
  ],
};

export const metadata: Metadata = {
  title: 'Larry Garcia | Desarrollador de Software - Especialista en IA y Automatización',
  description: 'Desarrollador de Software Semi-Senior especializado en integración de IA, automatización con n8n y desarrollo full-stack. Experto en Alibaba Cloud Qwen, Node.js, React, Python, Linux y Windows Server.',
  generator: 'v0.app',
  keywords: [
    'Larry Garcia',
    'Desarrollador de Software',
    'Software Developer',
    'IA',
    'Inteligencia Artificial',
    'AI',
    'Automatización',
    'n8n',
    'React',
    'Node.js',
    'Python',
    'Full Stack',
    'Alibaba Cloud Qwen',
    'Linux',
    'Windows Server',
    'Colombia',
    'Ibagué',
  ],
  authors: [{ name: 'Larry Garcia', url: 'https://github.com/larrygarcia' }],
  creator: 'Larry Garcia',
  publisher: 'Larry Garcia',
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
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    alternateLocale: 'en_US',
    title: 'Larry Garcia | Desarrollador de Software - Especialista en IA y Automatización',
    description: 'Desarrollador de Software Semi-Senior especializado en integración de IA, automatización con n8n y desarrollo full-stack.',
    siteName: 'Larry Garcia Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Larry Garcia | Software Developer',
    description: 'Semi-Senior Software Developer specializing in AI integration and automation.',
    creator: '@larrygarcia',
  },
  category: 'technology',
  classification: 'Portfolio',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
