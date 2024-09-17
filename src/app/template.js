'use client'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Template({ children }) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/about' && theme !== 'light') {
      setTheme('light')
    } else if (pathname === '/' && theme !== 'dark') {
      setTheme('dark')
    }
  }, [pathname])

  return children
}
