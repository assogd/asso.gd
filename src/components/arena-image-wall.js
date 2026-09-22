'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

function getStableColumnStart(id, columnCount, previousStart) {
  const value = String(id)
    .split('')
    .reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 7)

  const start = (value % columnCount) + 1

  if (start !== previousStart) {
    return start
  }

  return (start % columnCount) + 1
}

const PASS_COUNT = 3
const MIDDLE_PASS = 1

export function ArenaImageWall({ items = [] }) {
  const wallRef = useRef(null)
  const firstTileRef = useRef(null)
  // tileKey -> { element, item }
  const tileRefs = useRef(new Map())
  const eligibleTileKeysRef = useRef(new Set())
  const [activeTileKey, setActiveTileKey] = useState(null)

  const pickActiveTileKey = () => {
    const eligible = Array.from(eligibleTileKeysRef.current)

    if (eligible.length === 0) {
      return null
    }

    if (eligible.length === 1) {
      return eligible[0]
    }

    const viewportCenter = window.innerHeight / 2
    let closestKey = eligible[0]
    let closestDistance = Infinity

    eligible.forEach((key) => {
      const entry = tileRefs.current.get(key)
      if (!entry) return

      const { top, height } = entry.element.getBoundingClientRect()
      const distance = Math.abs(top + height / 2 - viewportCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestKey = key
      }
    })

    return closestKey
  }

  useEffect(() => {
    const wall = wallRef.current
    if (!wall) return

    const frame = window.requestAnimationFrame(() => {
      const firstTile = firstTileRef.current
      if (!firstTile) return

      const { top, height } = firstTile.getBoundingClientRect()
      const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize)
      window.scrollTo({
        top: window.scrollY + top + height / 2 - window.innerHeight / 2 + remInPx
      })

      // Show a caption immediately instead of waiting for the next scroll event.
      window.requestAnimationFrame(() => {
        setActiveTileKey(pickActiveTileKey())
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const wall = wallRef.current
    if (!wall) return

    let animationFrame = null
    let recenterFrame = null
    let currentLag = 0
    let targetLag = 0
    let lastScrollY = window.scrollY

    const settle = () => {
      currentLag += (targetLag - currentLag) * 0.08
      targetLag *= 0.9
      wall.style.setProperty('--arena-scroll-lag', `${currentLag}px`)

      if (Math.abs(currentLag) > 0.05 || Math.abs(targetLag) > 0.05) {
        animationFrame = window.requestAnimationFrame(settle)
      } else {
        currentLag = 0
        targetLag = 0
        wall.style.setProperty('--arena-scroll-lag', '0px')
        animationFrame = null
      }
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const loopHeight = wall.scrollHeight / PASS_COUNT
      const relativeScroll = scrollY - wall.offsetTop

      if (!recenterFrame && relativeScroll < loopHeight * 0.5) {
        recenterFrame = window.requestAnimationFrame(() => {
          window.scrollTo(0, window.scrollY + loopHeight)
          lastScrollY += loopHeight
          recenterFrame = null
        })
      } else if (!recenterFrame && relativeScroll > loopHeight * 1.5) {
        recenterFrame = window.requestAnimationFrame(() => {
          window.scrollTo(0, window.scrollY - loopHeight)
          lastScrollY -= loopHeight
          recenterFrame = null
        })
      }

      targetLag = Math.max(-32, Math.min(32, scrollY - lastScrollY))
      lastScrollY = scrollY

      // Only run the settle loop while there is meaningful lag to animate,
      // instead of continuously on every frame.
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(settle)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }
      if (recenterFrame) {
        window.cancelAnimationFrame(recenterFrame)
      }
    }
  }, [])

  useEffect(() => {
    const captionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          const key = target.dataset.arenaTileKey

          if (isIntersecting) {
            eligibleTileKeysRef.current.add(key)
          } else {
            eligibleTileKeysRef.current.delete(key)
          }
        })

        setActiveTileKey(pickActiveTileKey())
      },
      { threshold: 0.8 }
    )
    const nearViewportObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          target.classList.toggle('arena-image-tile-near', isIntersecting)
        })
      },
      { rootMargin: '200% 0px' }
    )

    tileRefs.current.forEach(({ element }) => {
      captionObserver.observe(element)
      nearViewportObserver.observe(element)
    })

    return () => {
      captionObserver.disconnect()
      nearViewportObserver.disconnect()
    }
  }, [items])

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">No images to display</p>
      </div>
    )
  }

  return (
    <>
    <section
      ref={wallRef}
      aria-label="Images from the Asso archive"
      className="grid grid-cols-12 gap-y-32 p-4"
    >
      {Array.from({ length: PASS_COUNT }, (_, pass) =>
        items.reduce(
        (rows, item, index) => {
          const previous = rows.at(-1)
          const mobileStart =
            index === 0
              ? 3
              : getStableColumnStart(item.id, 5, previous.mobileStart)
          const desktopStart =
            index === 0
              ? 4
              : getStableColumnStart(item.id, 7, previous.desktopStart)

          rows.push({
            item,
            index,
            mobileStart,
            desktopStart
          })
          return rows
        },
        []
        ).map(({ item, index, mobileStart, desktopStart }) => ({
          item,
          index: pass * items.length + index,
          mobileStart,
          desktopStart,
          pass
        }))
      ).flat().map(({ item, index, mobileStart, desktopStart, pass }) => {
        const tileKey = `${pass}-${item.id}`

        return (
        <figure
          key={tileKey}
          className="col-span-full grid grid-cols-12 grid-rows-[auto_auto]"
        >
          <div
            ref={(tile) => {
              if (pass === MIDDLE_PASS && index === items.length * MIDDLE_PASS) {
                firstTileRef.current = tile
              }
              if (tile) {
                tileRefs.current.set(tileKey, { element: tile, item })
              } else {
                tileRefs.current.delete(tileKey)
              }
            }}
            data-arena-tile-key={tileKey}
            className="arena-image-tile relative aspect-square w-full max-w-[30rem] justify-self-center sm:aspect-[4/3]"
            style={{
              '--arena-mobile-column-start': mobileStart,
              '--arena-desktop-column-start': desktopStart,
              '--arena-lag-factor': 0.7 + (index % 3) * 0.15
            }}
          >
            <Image
              src={item.image.url}
              alt={item.image.alt || item.title || 'Asso archive image'}
              fill
              className="object-contain"
              sizes="(min-width: 640px) 30rem, 100vw"
              quality={90}
              priority={index < 2}
            />
          </div>
        </figure>
        )
      })}
    </section>
    <div
      aria-live="polite"
      aria-label="Visible image captions"
      className="fixed inset-x-0 bottom-0 z-10 pointer-events-none flex flex-col gap-[0.15rem] px-2 sm:px-4 pt-2 pb-4"
    >
      {activeTileKey && tileRefs.current.get(activeTileKey) && (
        <figcaption className="m-0 text-center transition-opacity duration-75">
          {tileRefs.current.get(activeTileKey).item.title || 'Untitled'}
        </figcaption>
      )}
    </div>
    </>
  )
}
