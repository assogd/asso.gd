import './globals.css'
import localFont from 'next/font/local'
import clsx from 'clsx'
import PlausibleProvider from 'next-plausible'
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

export default async function Layout({ children, modal, params }) {
  return (
    <html
      lang="en"
      className={clsx(`${serif.variable} font-serif overscroll-none`)}
    >
      <head>
        <PlausibleProvider domain="asso.gd" />
      </head>
      <body>
        <MegaCoverProvider>
          <FirstImageLoadedProvider>
            <Header />
            {children}
            {modal}
          </FirstImageLoadedProvider>
        </MegaCoverProvider>
      </body>
    </html>
  )
}
