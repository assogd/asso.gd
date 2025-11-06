'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

export default function Template({ children }) {
  const [showOverlay, setShowOverlay] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {children}
      {showOverlay && (
        <div
          className={clsx(
            'fixed inset-0 z-20 bg-black',
            'p-4 pb-8',
            'flex flex-col gap-[.25em] justify-center items-center text-center',
            'select-none pointer-events-none'
          )}
        >
          <div className="uppercase">Asso (DDD) 2019–</div>
          <div>
            <span className="hidden sm:inline-block">Office for&nbsp;</span>
            Direction, Design and Development
          </div>
          <div>Vita bergen, Stockholm</div>
        </div>
      )}
    </>
  )
}
