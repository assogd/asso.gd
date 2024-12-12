'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function Template({ children }) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false) // State to track visibility

  useEffect(() => {
    if (pathname === '/about' && theme !== 'light') {
      setTheme('light')
      //} else if (pathname === '/' && theme !== 'dark') {
      //setTheme('dark')
    }

    // Add a delay before setting the content to visible
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000) // 1 second delay

    // Cleanup the timer on unmount
    return () => clearTimeout(timer)
  }, [pathname])

  // Conditionally render the children based on the isVisible state
  return (
    <>
      <div
        className={clsx(
          isVisible && 'opacity-0',
          'duration-200 fixed inset-0 flex flex-col gap-[.15em] justify-center items-center select-none pointer-events-none z-20 p-4 pb-8 text-center'
        )}
      >
        <div className="uppercase">Association</div>
        <div className="">
          <span className="hidden sm:inline-block">Office for&nbsp;</span>
          Direction, Design and Development
        </div>
        <div className="">Vita bergen, Stockholm</div>
      </div>
      <div className={clsx(!isVisible && 'opacity-0', 'duration-200')}>
        {children}
      </div>
    </>
  )
}
