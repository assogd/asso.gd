'use client'
import clsx from 'clsx'
import { useState, useEffect } from 'react'

export const TextWithHeadline = ({
  children,
  headlineText = 'About',
  className = {}
}) => {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    setShouldLoad(true)
  }, [])

  if (shouldLoad)
    return (
      <section className={clsx('text-center', className?.section)}>
        <h2 className="font-expandedSans uppercase text-[0.6em] tracking-wider grid">
          {headlineText}
        </h2>
        <div className="text-sm xs:text-base">{children}</div>
      </section>
    )

  return <div className="text-center">Loading...</div>
}
