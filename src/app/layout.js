import './globals.css'
import localFont from 'next/font/local'
import clsx from 'clsx'
import Loading from '@/components/loading'
import { fetchGraphQL } from '@/lib/graphql'
import PlausibleProvider from 'next-plausible'
import { Navigation } from '@/components/ui/navigation'
import { ThemeProvider } from 'next-themes'

const mono = localFont({
  src: [
    {
      path: '../../public/fonts/PanamaMonospaceRegular.woff',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-mono'
})

export const metadata = {
  metadataBase: new URL('https://www.asso.gd'),
  creator: 'Asso DDD',
  openGraph: {
    siteName: 'ADDD',
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
      className={clsx(`${mono.variable} font-mono overscroll-none`)}
      suppressHydrationWarning
    >
      <head>
        <PlausibleProvider domain="asso.gd" />
      </head>
      <body>
        <ThemeProvider
          defaultTheme="offWhite"
          enableColorScheme
          enableSystem={false}
          themes={['light', 'vibrant', 'dark']}
        >
          <Navigation />
          {children}
          <Navigation />
        </ThemeProvider>
      </body>
    </html>
  )
}
