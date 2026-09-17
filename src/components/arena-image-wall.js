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
  const tileRefs = useRef(new Map())
  const captionTimer = useRef(null)
  const eligibleIdsRef = useRef([])
  const [eligibleIds, setEligibleIds] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [captionVisible, setCaptionVisible] = useState(false)
  eligibleIdsRef.current = eligibleIds

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

    tileRefs.current.forEach((tile) => observer.observe(tile))

    return () => {
      observer.disconnect()
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
      aria-label="Images from the Asso archive"
      className="grid grid-cols-12 gap-y-32 p-4"
    >
      {items.reduce(
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
      ).map(({ item, index, mobileStart, desktopStart }) => (
        <figure
          key={item.id}
          className="col-span-full grid grid-cols-12 grid-rows-[auto_auto]"
        >
          <div
            ref={(tile) => {
              if (tile) {
                tileRefs.current.set(String(item.id), tile)
              } else {
                tileRefs.current.delete(String(item.id))
              }
            }}
            data-arena-image-id={item.id}
            className="arena-image-tile relative aspect-[4/3] w-full max-w-[28rem] justify-self-center"
            style={{
              '--arena-mobile-column-start': mobileStart,
              '--arena-desktop-column-start': desktopStart
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
      className="arena-caption-container fixed inset-x-0 bottom-0 z-10"
    >
      {activeId && (
        <p className={`arena-caption ${captionVisible ? 'is-visible' : ''}`}>
          {items.find((item) => String(item.id) === activeId)?.title ||
            'Untitled'}
        </p>
      )}
    </div>
    </>
  )
}
