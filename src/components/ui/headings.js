'use client'
import clsx from 'clsx'
import { useState, useEffect, useMemo } from 'react'

export const Heading1 = ({ children, className }) => {
  return <h1 className={clsx('text-center text-2xl', className)}>{children}</h1>
}

export const Heading2 = ({ children, className }) => {
  return <h2 className={clsx('uppercase mb-4', className)}>{children}</h2>
}

export const Heading3 = ({ children }) => {
  const [isCurrentColor, setIsCurrentColor] = useState(true)

  // Set up the interval to toggle `isCurrentColor` every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setIsCurrentColor((prev) => !prev)
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
            isCurrentColor
              ? index % 2 === 0
                ? 'text-current'
                : 'text-red'
              : index % 2 === 0
              ? 'text-red'
              : 'text-current'
          )}
        >
          {char}
        </span>
      ))}
    </h3>
  )
}
