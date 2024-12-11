import './globals.css'
import localFont from 'next/font/local'
import clsx from 'clsx'
import Loading from '@/components/loading'
import { fetchGraphQL } from '@/lib/graphql'
import PlausibleProvider from 'next-plausible'
import { Navigation } from '@/components/ui/navigation'
import { ThemeProvider } from 'next-themes'

const serif = localFont({
  src: [
    {
      path: '../../public/fonts/ABCSynt-Regular-Trial.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/ABCSynt-RegularItalic-Trial.woff2',
      weight: '400',
      style: 'italic'
    }
  ],
  variable: '--font-serif'
})

const sans = localFont({
  src: [
    {
      path: '../../public/fonts/HelveticaNeueLTStd-Ex.woff2',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-sans'
})

export const metadata = {
  metadataBase: new URL('https://www.asso.gd'),
  creator: 'Asso DDD',
  openGraph: {
    siteName: 'Association',
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
      className={clsx(
        `${serif.variable} ${sans.variable} font-serif overscroll-none`
      )}
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
          <Navigation />
          {children}
          <Navigation />
        </ThemeProvider>
      </body>
    </html>
  )
}
