import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yeboah Michael — Developer & Designer',
  description: 'Portfolio of Yeboah Michael, a Software Developer, Graphic Designer, and UI/UX Designer crafting premium digital experiences.',
  icons: {
    icon: '/Miek_sLogo-removebg-preview.png',
    shortcut: '/Miek_sLogo-removebg-preview.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
