'use client'
import { useEffect, useRef } from 'react'

const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = resolve
    img.onerror = reject
  })
}

const preloadVideo = (src) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = src
    video.preload = 'auto'
    video.onloadeddata = resolve
    video.onerror = reject
  })
}

export const usePreloadAdjacentAssets = (content, activeIndex) => {
  const preloadedSlides = useRef(new Set()) // Track preloaded slides

  const preloadAssetsForSlide = async (index) => {
    if (preloadedSlides.current.has(index) || !content[index]) return // Skip if already preloaded or invalid index

    try {
      const assets = content[index]?.assets || []
      await Promise.all(
        assets.map((asset) => {
          switch (asset.__typename) {
            case 'Image':
              return preloadImage(asset.file.url)
            case 'Video':
              return preloadVideo(asset.file.url)
            default:
              return Promise.resolve()
          }
        })
      )
      preloadedSlides.current.add(index) // Mark slide as preloaded
    } catch (error) {
      console.error(`Failed to preload assets for slide ${index}:`, error)
    }
  }

  useEffect(() => {
    const preloadAdjacentSlides = async () => {
      await preloadAssetsForSlide(activeIndex) // Preload current slide
      const prevIndex = activeIndex > 0 ? activeIndex - 1 : content.length - 1
      const nextIndex = activeIndex < content.length - 1 ? activeIndex + 1 : 0
      preloadAssetsForSlide(prevIndex) // Preload previous slide
      preloadAssetsForSlide(nextIndex) // Preload next slide
    }

    preloadAdjacentSlides()
  }, [activeIndex, content])
}
