import './globals.css'
import localFont from 'next/font/local'
import clsx from 'clsx'
import PlausibleProvider from 'next-plausible'
import { ThemeProvider } from 'next-themes'
import { MegaCoverProvider } from '@/components/mega-cover-context'
import { FirstImageLoadedProvider } from '@/hooks/use-first-image-loaded'
import Header from '@/components/header'

const serif = localFont({
  src: [
    {
      path: '../../public/fonts/ABCSynt-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/ABCSynt-RegularItalic.woff2',
      weight: '400',
      style: 'italic'
    }
  ],
  variable: '--font-serif'
})

export const metadata = {
  metadataBase: new URL('https://www.asso.gd'),
  creator: 'Asso DDD',
  openGraph: {
    siteName: 'Asso',
    type: 'website'
  },
  appleWebApp: {
    statusBarStyle: 'black-translucent'
  }
}

export default async function Layout({ children, params }) {
  return (
    <html
      lang="en"
      className={clsx(`${serif.variable} font-serif overscroll-none`)}
      suppressHydrationWarning
    >
      <head>
        <PlausibleProvider domain="asso.gd" />
      </head>
      <body>
        <ThemeProvider
          defaultTheme="system"
          enableColorScheme
          enableSystem={true}
          themes={['light', 'vibrant', 'dark']}
          attribute="data-theme"
        >
          <MegaCoverProvider>
            <FirstImageLoadedProvider>
              <Header />
              {children}
            </FirstImageLoadedProvider>
          </MegaCoverProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
