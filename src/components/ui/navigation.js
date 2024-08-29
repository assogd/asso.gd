'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import useScroll from '@/hooks/use-scroll'
import clsx from 'clsx'
import { useMedia } from 'use-media'
import { usePathname } from 'next/navigation'

export const Navigation = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const scrolled = useScroll()
  const isMobile = useMedia({ maxWidth: '638px' })

  const linkClassName = 'block p-3 sm:p-6 uppercase'

  return (
    <nav
      className={clsx(
        'fixed inset-x-0 top-0 flex justify-between px-3 sm:px-6 py-4',
        'bg-gradient-to-b from-black to-transparent',
        'select-none'
      )}
    >
      <Link href="/" className={linkClassName}>
        Adam Richards
      </Link>
      <div className="flex">
        <Link href="/#projects" className={linkClassName}>
          Projects
        </Link>
        <Link href="/" className={linkClassName}>
          About
        </Link>
      </div>
    </nav>
  )
}
