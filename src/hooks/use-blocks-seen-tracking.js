'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'addd:homepage-blocks-seen'
const SENT_KEY = 'addd:homepage-blocks-seen:sent'
const EVENT_NAME = 'Homepage Blocks Seen'
const PLAUSIBLE_DOMAIN = 'asso.gd'
const PLAUSIBLE_ENDPOINT = 'https://plausible.io/api/event'
// A tile counts as "seen" once this fraction of it has been in the viewport.
const SEEN_THRESHOLD = 0.5

function readSeenIds() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function writeSeenIds(ids) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)))
  } catch {
    // Storage may be unavailable (private mode / quota) - tracking is best effort.
  }
}

// Exact counts up to 10, steps of 5 up to 50, steps of 10 up to 100, then 100+.
function bucketFor(count) {
  if (count <= 0) return '0'
  if (count <= 10) return String(count)
  if (count <= 50) {
    const low = Math.floor((count - 1) / 5) * 5 + 1
    return `${low}-${low + 4}`
  }
  if (count <= 100) {
    const low = Math.floor((count - 1) / 10) * 10 + 1
    return `${low}-${low + 9}`
  }
  return '100+'
}

function sendEvent(count) {
  // Strictly one event per session so every visitor lands in exactly one
  // bucket: report the first time they leave the homepage.
  if (count === 0 || window.sessionStorage.getItem(SENT_KEY)) return

  // Custom properties require a higher Plausible plan, so the bucket is
  // encoded in the event name itself - one goal per bucket in the dashboard.
  // Props are still attached in case they become available later.
  const bucket = bucketFor(count)
  const payload = JSON.stringify({
    n: `${EVENT_NAME}: ${bucket}`,
    u: window.location.href,
    d: PLAUSIBLE_DOMAIN,
    r: document.referrer || null,
    p: { count, bucket }
  })

  // Mirror next-plausible's script: skip localhost / dev so the dashboard
  // doesn't fill with test data.
  const { hostname } = window.location
  if (/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(hostname)) {
    return
  }

  let delivered = false
  if (navigator.sendBeacon) {
    // text/plain avoids a CORS preflight, which is what the Plausible script
    // itself relies on. sendBeacon survives tab close / navigation away.
    delivered = navigator.sendBeacon(
      PLAUSIBLE_ENDPOINT,
      new Blob([payload], { type: 'text/plain' })
    )
  }
  if (!delivered) {
    fetch(PLAUSIBLE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: payload,
      keepalive: true
    }).catch(() => {})
  }

  try {
    window.sessionStorage.setItem(SENT_KEY, '1')
  } catch {
    // ignore
  }
}

/**
 * Tracks how many unique homepage blocks a visitor has seen during their
 * session and reports it to Plausible as a custom event named
 * "Homepage Blocks Seen: <bucket>" once per session, the first time they
 * leave the page. Buckets: 1..10 exact, 11-15 … 46-50, 51-60 … 91-100, 100+.
 *
 * @param {boolean} enabled Only track when true (home feed).
 * @param {React.MutableRefObject<Map<string, {element: Element, item: {id: string|number}}>>} tileRefs
 * @param {Array} items Used to re-observe when the wall re-renders.
 */
export function useBlocksSeenTracking(enabled, tileRefs, items) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const seen = readSeenIds()

    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return
          const entry = tileRefs.current.get(target.dataset.arenaTileKey)
          const id = entry?.item?.id
          if (id == null) return
          const key = String(id)
          if (!seen.has(key)) {
            seen.add(key)
            changed = true
          }
        })
        if (changed) writeSeenIds(seen)
      },
      { threshold: SEEN_THRESHOLD }
    )

    tileRefs.current.forEach(({ element }) => observer.observe(element))

    const flush = () => sendEvent(seen.size)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }

    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      observer.disconnect()
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', handleVisibility)
      // Leaving the home feed via client-side navigation also counts as the
      // end of this viewing.
      flush()
    }
  }, [enabled, tileRefs, items])
}
