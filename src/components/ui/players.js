'use client'
import MuxPlayer from '@mux/mux-player-react/lazy'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useMedia } from 'use-media'
import { Button } from '@/components/ui/buttons'

export const StandardPlayer = ({ file, muted, className, paused }) => {
  const ref = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoadedData = () => {
    setIsLoaded(true)
  }

  useEffect(() => {
    if (ref?.current && paused) {
      ref?.current?.pause()
    } else {
      ref?.current?.play()
    }
  }, [ref?.current, paused])

  return (
    <MuxPlayer
      ref={ref}
      playbackId={file?.playbackId}
      muted={muted}
      nohotkeys
      autoPlay={'any'}
      className={clsx('no-controls w-full', className)}
      thumbnailTime={0}
      loop
      onCanPlay={handleLoadedData}
    />
  )
}
