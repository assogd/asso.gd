'use client'

import { useLayoutEffect, useRef } from 'react'

export function ProjectMetaPair({ image, meta }) {
  const pairRef = useRef(null)

  useLayoutEffect(() => {
    const pair = pairRef.current
    const imageElement = pair?.querySelector('.project-meta-pair-image')
    const metaElement = pair?.querySelector('.project-meta-pair-meta')

    if (!pair || !imageElement || !metaElement) return

    function updateDimensions() {
      pair.style.setProperty(
        '--project-pair-page-top',
        `${pair.getBoundingClientRect().top + window.scrollY}px`
      )
      pair.style.setProperty(
        '--project-image-height',
        `${imageElement.getBoundingClientRect().height}px`
      )
      pair.style.setProperty(
        '--project-meta-height',
        `${metaElement.getBoundingClientRect().height}px`
      )
    }

    const observer = new ResizeObserver(updateDimensions)
    observer.observe(imageElement)
    observer.observe(metaElement)
    window.addEventListener('resize', updateDimensions)
    updateDimensions()
    pair.dataset.ready = ''

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  return (
    <div ref={pairRef} className="project-meta-pair">
      {image}
      {meta}
    </div>
  )
}
