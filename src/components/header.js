'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

const DEFAULT_INTRO =
  'Asso is a design studio committed to creating well-reasoned visual concepts for institutions, artists, and commercial clients. We seek partnerships with those daring to challenge conventions and those committed to making a positive societal impact, whether in the cultural field or industries striving to innovate and improve society. Our work has taken shape in various forms, including books, visual identities, installations, magazines, websites, videos, posters, and more.'

export default function Header({ intro }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isAbout = pathname === '/about'
  const isProject = pathname.startsWith('/project/')

  useEffect(() => {
    if (pathname === '/about') {
      window.scrollTo({ top: 0, left: 0 })
    }
  }, [pathname])

  return (
    <>
      {!isAbout && (
        <>
          <div className="fixed inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          {!isProject && (
            <div className="fixed inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          )}
        </>
      )}
      <header
        className={clsx(
          'flex w-screen p-2 sm:p-4 z-10',
          !isAbout ? 'fixed inset-x-0 top-0' : 'pb-4'
        )}
      >
        <div
          className={clsx(
            !isAbout ? 'truncate whitespace-nowrap select-none' : 'hyphens-auto'
          )}
        >
          {isAbout && (
            <Link
              href="/"
              className="button-style whitespace-nowrap float-right mb-4 ml-4"
            >
              Images
            </Link>
          )}
          <ReactMarkdown
            allowedElements={['p', 'a', 'em', 'strong']}
            unwrapDisallowed
            components={{
              p: ({ children }) =>
                isAbout ? (
                  <p className="mb-4 last:mb-0">{children}</p>
                ) : (
                  <span>{children} </span>
                ),
              a: ({ node, href = '', ...props }) => {
                const linkClass = '!no-underline hover:!underline'
                const isInline = href.startsWith('/') || href.startsWith('#')
                return isInline ? (
                  <Link href={href} className={linkClass} {...props} />
                ) : (
                  <a
                    href={href}
                    {...props}
                    className={linkClass}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                )
              }
            }}
          >
            {intro || DEFAULT_INTRO}
          </ReactMarkdown>
        </div>
        {!isAbout && (
          <nav className="basis-32">
            <Link href="/about" className="button-style whitespace-nowrap">
              About
            </Link>
          </nav>
        )}
      </header>
    </>
  )
}
