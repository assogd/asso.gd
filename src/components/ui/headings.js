'use client'
import clsx from 'clsx'
import { useState, useEffect, useMemo } from 'react'

export const Heading1 = ({ children, className }) => {
  return <h1 className={clsx('text-center text-2xl', className)}>{children}</h1>
}

export const Heading2 = ({ children }) => {
  return <h2 className="uppercase mb-4">{children}</h2>
}

export const Heading3 = ({ children }) => {
  const [isBlack, setIsBlack] = useState(true)

  // Set up the interval to toggle `isBlack` every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlack((prev) => !prev)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Memoize the split children array to prevent unnecessary re-calculations
  const characters = useMemo(() => children[0].split(''), [children])

  return (
    <h3 className="mb-1">
      {characters.map((char, index) => (
        <span
          key={index}
          className={clsx(
            isBlack
              ? index % 2 === 0
                ? 'text-black'
                : 'text-red'
              : index % 2 === 0
              ? 'text-red'
              : 'text-black'
          )}
        >
          {char}
        </span>
      ))}
    </h3>
  )
}
