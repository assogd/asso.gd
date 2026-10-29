import './globals.css'
import localFont from 'next/font/local'
import clsx from 'clsx'
import PlausibleProvider from 'next-plausible'
import { MegaCoverProvider } from '@/components/mega-cover-context'
import { FirstImageLoadedProvider } from '@/hooks/use-first-image-loaded'
import { getAboutContent } from '@/lib/about'
import Header from '@/components/header'
import siteContent from '@/content/site.json'
import { SITE_URL } from '@/lib/site'

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
  alternates: { canonical: './' },
  openGraph: {
    siteName: 'Asso',
    type: 'website'
  },
  appleWebApp: {
    statusBarStyle: 'black-translucent'
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Asso',
      url: SITE_URL,
      description: siteContent.seo.home.description,
      sameAs: ['https://www.instagram.com/asso4077'],
      areaServed: 'Worldwide',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Stockholm',
        addressCountry: 'SE'
      }
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Asso',
      publisher: { '@id': `${SITE_URL}/#organization` }
    }
  ]
}

export default async function Layout({ children, modal, params }) {
  const { intro } = await getAboutContent()
  return (
    <html
      lang="en"
      className={clsx(`${serif.variable} font-serif overscroll-none`)}
    >
      <head>
        <PlausibleProvider domain="asso.gd" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <MegaCoverProvider>
          <FirstImageLoadedProvider>
            <Header intro={intro} />
            {children}
            {modal}
          </FirstImageLoadedProvider>
        </MegaCoverProvider>
      </body>
    </html>
  )
}
