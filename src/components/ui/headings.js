'use client'
import clsx from 'clsx'
import React, { useState, useEffect, useMemo, useRef } from 'react'

export const Heading1 = ({ children, className }) => {
  return <h1 className={clsx('text-center text-2xl', className)}>{children}</h1>
}

export const Heading2 = ({ children, className }) => {
  return <h2 className={clsx('uppercase mb-4', className)}>{children}</h2>
}

export const Heading3 = ({ children }) => {
  const [isBlinking, setIsBlinking] = useState(true)

  // Toggle `isBlinking` every 1000ms
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking((prev) => !prev)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Utility function to process children
  const processChildren = (nodes) => {
    if (typeof nodes === 'string') {
      return [{ content: nodes, isBold: false }]
    }

    if (Array.isArray(nodes)) {
      return nodes.flatMap(processChildren)
    }

    if (React.isValidElement(nodes)) {
      const isBold = nodes.type === 'strong' || nodes.type === 'b'
      return processChildren(nodes.props.children).map((child) => ({
        ...child,
        isBold
      }))
    }

    return []
  }

  // Processed children to identify bolded and non-bolded parts
  const parts = useMemo(() => processChildren(children), [children])

  return (
    <h3 className="">
      {parts.map((part, partIndex) =>
        part.isBold ? (
          // Render bolded text with blinking effect
          [...part.content].map((char, charIndex) => (
            <span
              key={`${partIndex}-${charIndex}`}
              className={clsx(
                isBlinking
                  ? charIndex % 2 === 0
                    ? 'text-current'
                    : 'text-red'
                  : charIndex % 2 === 0
                  ? 'text-red'
                  : 'text-current'
              )}
            >
              {char}
            </span>
          ))
        ) : (
          // Render non-bolded text as normal
          <span key={partIndex}>{part.content}</span>
        )
      )}
      :
    </h3>
  )
}
