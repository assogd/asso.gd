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

export function ArenaImageWall({ items = [] }) {
  const wallRef = useRef(null)
  const firstTileRef = useRef(null)
  const tileRefs = useRef(new Map())
  const captionTimer = useRef(null)
  const eligibleIdsRef = useRef([])
  const [eligibleIds, setEligibleIds] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [captionVisible, setCaptionVisible] = useState(false)
  eligibleIdsRef.current = eligibleIds

  useEffect(() => {
    const wall = wallRef.current
    if (!wall) return

    const frame = window.requestAnimationFrame(() => {
      const firstTile = firstTileRef.current
      if (!firstTile) return

      const { top, height } = firstTile.getBoundingClientRect()
      window.scrollTo({
        top: window.scrollY + top + height / 2 - window.innerHeight / 2
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const wall = wallRef.current
    if (!wall) return

    let animationFrame
    let recenterFrame = null
    let currentLag = 0
    let targetLag = 0
    let lastScrollY = window.scrollY

    const settle = () => {
      currentLag += (targetLag - currentLag) * 0.08
      wall.style.setProperty('--arena-scroll-lag', `${currentLag}px`)
      targetLag *= 0.9
      animationFrame = window.requestAnimationFrame(settle)
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const loopHeight = wall.scrollHeight / 5
      const relativeScroll = scrollY - wall.offsetTop

      if (!recenterFrame && relativeScroll < loopHeight * 1.25) {
        recenterFrame = window.requestAnimationFrame(() => {
          window.scrollTo(0, window.scrollY + loopHeight * 2)
          lastScrollY += loopHeight * 2
          recenterFrame = null
        })
      } else if (!recenterFrame && relativeScroll > loopHeight * 3.75) {
        recenterFrame = window.requestAnimationFrame(() => {
          window.scrollTo(0, window.scrollY - loopHeight * 2)
          lastScrollY -= loopHeight * 2
          recenterFrame = null
        })
      }

      targetLag = Math.max(-32, Math.min(32, scrollY - lastScrollY))
      lastScrollY = scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    animationFrame = window.requestAnimationFrame(settle)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.cancelAnimationFrame(animationFrame)
      if (recenterFrame) {
        window.cancelAnimationFrame(recenterFrame)
      }
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          const id = target.dataset.arenaImageId

          setEligibleIds((current) =>
            isIntersecting
              ? current.includes(id)
                ? current
                : [...current, id]
              : current.filter((currentId) => currentId !== id)
          )
        })
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

    tileRefs.current.forEach((tile) => {
      observer.observe(tile)
      nearViewportObserver.observe(tile)
    })

    return () => {
      observer.disconnect()
      nearViewportObserver.disconnect()
    }
  }, [items])

  useEffect(() => {
    return () => {
      if (captionTimer.current) {
        clearTimeout(captionTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    if (activeId && eligibleIds.includes(activeId)) {
      if (captionTimer.current) {
        clearTimeout(captionTimer.current)
        captionTimer.current = null
      }
      setCaptionVisible(true)
      return
    }

    if (captionTimer.current) {
      return
    }

    if (activeId) {
      setCaptionVisible(false)
      captionTimer.current = setTimeout(() => {
        const nextId =
          eligibleIdsRef.current.find((id) => id !== activeId) || null
        setActiveId(nextId)
        setCaptionVisible(Boolean(nextId))
        captionTimer.current = null
      }, 900)
      return
    }

    const nextId = eligibleIds[0] || null
    if (nextId) {
      setActiveId(nextId)
      setCaptionVisible(true)
    }
  }, [activeId, eligibleIds])

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
      {Array.from({ length: 5 }, (_, pass) =>
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
      ).flat().map(({ item, index, mobileStart, desktopStart, pass }) => (
        <figure
          key={`${pass}-${item.id}`}
          className="col-span-full grid grid-cols-12 grid-rows-[auto_auto]"
        >
          <div
            ref={(tile) => {
              const tileKey = `${pass}-${item.id}`
              if (pass === 2 && index === items.length * 2) {
                firstTileRef.current = tile
              }
              if (tile) {
                tileRefs.current.set(tileKey, tile)
              } else {
                tileRefs.current.delete(tileKey)
              }
            }}
            data-arena-image-id={item.id}
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
              sizes="(max-width: 640px) 66.666vw, 50vw"
              priority={index < 2}
            />
          </div>
        </figure>
      ))}
    </section>
    <div
      aria-live="polite"
      aria-label="Visible image captions"
      className="fixed inset-x-0 bottom-0 z-10 pointer-events-none flex flex-col gap-[0.15rem] px-2 sm:px-4 pt-2 pb-4"
    >
      {activeId && (
        <figcaption
          className={`m-0 text-center transition-opacity duration-[200ms] ease-in-out ${
            captionVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {items.find((item) => String(item.id) === activeId)?.title ||
            'Untitled'}
        </figcaption>
      )}
    </div>
    </>
  )
}
