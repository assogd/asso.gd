'use client'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import Link from 'next/link'

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
    {isHome && <><div className="fixed inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" /><div className="fixed inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" /></>}
    <header className={clsx(isHome ? "fixed inset-x-0 top-0" : "pb-0", "flex w-screen p-2 sm:p-4 z-10")}>
      <p
        className={clsx(
          '',
          isHome ? 'truncate whitespace-nowrap select-none' : ''
        )}
      >
        Asso is a design studio committed to creating well-reasoned visual
        concepts for institutions, artists, and commercial clients. We seek
        partnerships with those daring to challenge conventions and those
        committed to making a positive societal impact, whether in the cultural
        field or industries striving to innovate and improve society. Our work
        has taken shape in various forms, including books, visual identities,
        installations, magazines, websites, videos, posters, and more.
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
              className="fixed top-2 sm:top-4 right-2 sm:right-4 button-style whitespace-nowrap"
            >
              Images
            </Link>
          </>
        )}
      </nav>
    </header>
</>
  )
}
