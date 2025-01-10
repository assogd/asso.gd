import './globals.css'
import localFont from 'next/font/local'
import clsx from 'clsx'
import Loading from '@/components/loading'
import { fetchGraphQL } from '@/lib/graphql'
import PlausibleProvider from 'next-plausible'
import { Navigation } from '@/components/ui/navigation'
import { ThemeProvider } from 'next-themes'
import { MegaCoverProvider } from '@/components/mega-cover-context'
import { FirstImageLoadedProvider } from '@/hooks/use-first-image-loaded'

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
          defaultTheme="dark"
          enableColorScheme
          enableSystem={false}
          themes={['light', 'vibrant', 'dark']}
        >
          <MegaCoverProvider>
            <FirstImageLoadedProvider>
              <Navigation align="top" />
              {children}
              <Navigation />
            </FirstImageLoadedProvider>
          </MegaCoverProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
