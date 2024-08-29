import './globals.css'
import localFont from 'next/font/local'
import clsx from 'clsx'
import Loading from '@/components/loading'
import { fetchGraphQL } from '@/lib/graphql'
import PlausibleProvider from 'next-plausible'
import { Navigation } from '@/components/ui/navigation'

const serif = localFont({
  src: [
    {
      path: '../../public/fonts/untitled-serif-regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/untitled-serif-regular-italic.woff2',
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
  metadataBase: new URL('https://www.adamrichards.tv'),
  creator: 'Asso DDD',
  openGraph: {
    siteName: 'Adam Richards',
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
        'bg-black text-white',
        `${sans.variable} ${serif.variable} font-sans`
      )}
    >
      <head>
        <PlausibleProvider domain="adamrichards.tv" />
      </head>
      <body>
        {children}
        <Navigation />
      </body>
    </html>
  )
}
