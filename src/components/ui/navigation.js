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
      {isHome ? (
        <motion.div
          className={clsx('fixed left-0 bottom-4 select-none bottom-4')}
          layoutId="addd"
        >
          <Link href="/" className={'block p-4'}>
            ADDD:
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className={clsx('fixed left-0 bottom-4 select-none', 'top-0')}
          layoutId="addd"
        >
          <Link href="/" className={'block p-4'}>
            ADDD:
            {!isHome && ' We can write something here, like an announcement'}
          </Link>
        </motion.div>
      )}
    </>
  )
}
