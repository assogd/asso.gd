import './globals.css'
import localFont from 'next/font/local'
import clsx from 'clsx'
import Loading from '@/components/loading'
import { fetchGraphQL } from '@/lib/graphql'
import PlausibleProvider from 'next-plausible'
import { Navigation } from '@/components/ui/navigation'

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
      className={clsx(
        'bg-white text-black',
        `${mono.variable} font-mono overscroll-none`
      )}
    >
      <head>
        <PlausibleProvider domain="asso.gd" />
      </head>
      <body>
        {children}
        <Navigation />
      </body>
    </html>
  )
}
