'use client'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import Link from 'next/link'

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <header className="flex w-screen p-4 pb-0">
      <p className={clsx('', isHome ? 'truncate whitespace-nowrap' : '')}>
        Asso is a design studio committed to creating well-reasoned and
        impactful visual concepts for institutions, artists, and commercial
        clients. We seek partnerships with those daring to challenge conventions
        and those committed to making a positive societal impact, whether in the
        cultural field or industries striving to innovate and improve society.
        Our work has taken shape in various forms, including books, visual
        identities, installations, magazines, websites, videos, posters, and
        more.
      </p>
      <nav className="basis-32">
        {isHome ? (
          <Link href="/about" className="button-style whitespace-nowrap">
            Texts
          </Link>
        ) : (
          <>
            <span
              aria-hidden="true"
              className="button-style whitespace-nowrap opacity-0"
            >
              Images
            </span>
            <Link
              href="/"
              className="fixed top-4 right-4 button-style whitespace-nowrap"
            >
              Images
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
