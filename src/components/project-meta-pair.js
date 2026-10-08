'use client'

import { useLayoutEffect, useRef } from 'react'

export function ProjectMetaPair({ image, meta }) {
  const pairRef = useRef(null)

  useLayoutEffect(() => {
    const pair = pairRef.current
    const imageElement = pair?.querySelector('.project-meta-pair-image')
    const metaElement = pair?.querySelector('.project-meta-pair-meta')
    const contentElement = pair?.querySelector('.project-meta-pair-content')

    if (!pair || !imageElement || !metaElement || !contentElement) return

    function updateDimensions() {
      const imageHeight = imageElement.getBoundingClientRect().height
      const contentRect = contentElement.getBoundingClientRect()
      const metaRect = metaElement.getBoundingClientRect()
      const contentTop = contentRect.top - metaRect.top
      const lift =
        parseFloat(
          getComputedStyle(pair).getPropertyValue('--project-image-lift')
        ) || 0
      const imageOffset = Math.max(
        0,
        contentTop + (contentRect.height - imageHeight) / 2 - lift
      )

      pair.style.setProperty(
        '--project-meta-slack',
        `${Math.max(0, metaRect.bottom - contentRect.bottom)}px`
      )
      pair.style.setProperty('--project-image-height', `${imageHeight}px`)
      pair.style.setProperty('--project-image-offset', `${imageOffset}px`)
      pair.style.setProperty(
        '--project-image-exit-distance',
        `${imageOffset + imageHeight}px`
      )
    }

    const observer = new ResizeObserver(updateDimensions)
    observer.observe(imageElement)
    observer.observe(contentElement)
    observer.observe(pair)
    updateDimensions()
    pair.dataset.ready = ''

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={pairRef} className="project-meta-pair flex w-full flex-col items-center">
      {image}
      {meta}
      <div className="project-meta-pair-spacer" aria-hidden="true" />
    </div>
  )
}
