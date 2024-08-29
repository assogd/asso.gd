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

  return (
    <>
      <nav className={clsx('fixed right-0 top-0', 'select-none')}>
        <Link href="/about" className={'block p-4'}>
          About the Studio
        </Link>
      </nav>
      <div className={clsx('fixed left-0 bottom-4', 'select-none')}>
        <Link href="/" className={'block p-4'}>
          ADDD:
        </Link>
      </div>
    </>
  )
}
