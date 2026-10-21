'use client'

import { useEffect, useState } from 'react'

/**
 * Hard-blinks its children: fully visible for `visibleFor` seconds, then
 * fully invisible for `hiddenFor` seconds, with no fade. Invisible children
 * keep their layout space. Stays visible for users who prefer reduced motion.
 */
export function Blink({
  children,
  visibleFor = 1,
  hiddenFor = 0.5,
  as: Tag = 'span',
  className
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timeout = window.setTimeout(
      () => setVisible((prev) => !prev),
      (visible ? visibleFor : hiddenFor) * 1000
    )

    return () => window.clearTimeout(timeout)
  }, [visible, visibleFor, hiddenFor])

  return (
    <Tag className={className} style={{ opacity: visible ? 1 : 0 }}>
      {children}
    </Tag>
  )
}
