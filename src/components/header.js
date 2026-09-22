'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import Link from 'next/link'

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    if (pathname === '/about') {
      window.scrollTo({ top: 0, left: 0 })
    }
  }, [pathname])

  return (
    <>
    {isHome && <><div className="fixed inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" /><div className="fixed inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" /></>}
    <header className={clsx(isHome ? "fixed inset-x-0 top-0" : "pb-0", "flex w-screen p-2 sm:p-4 z-10")}>
      <p
        className={clsx(
          isHome ? 'truncate whitespace-nowrap select-none' : 'hyphens-auto'
        )}
      >
        {!isHome && (
          <Link
            href="/"
            className="button-style whitespace-nowrap float-right mb-4 ml-4"
          >
            Images
          </Link>
        )}
        Asso is a design studio committed to creating well-reasoned visual
        concepts for institutions, artists, and commercial clients. We seek
        partnerships with those daring to challenge conventions and those
        committed to making a positive societal impact, whether in the cultural
        field or industries striving to innovate and improve society. Our work
        has taken shape in various forms, including books, visual identities,
        installations, magazines, websites, videos, posters, and more.
      </p>
      {isHome && (
        <nav className="basis-32">
          <Link href="/about" className="button-style whitespace-nowrap">
            Texts
          </Link>
        </nav>
      )}
    </header>
</>
  )
}
