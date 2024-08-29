'use client'
import { useEffect } from 'react'
import clsx from 'clsx'

export const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return null
}

export const ScrollToTopOnClick = ({ className, children }) => (
  <div
    className={clsx('cursor-n-resize', className)}
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  >
    {children}
  </div>
)
