'use client'
import MuxPlayer from '@mux/mux-player-react/lazy'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useMedia } from 'use-media'
import { Button } from '@/components/ui/buttons'

export const StandardPlayer = ({ file, muted, className }) => {
  const playerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoadedData = () => {
    setIsLoaded(true)
  }

  return (
    <MuxPlayer
      ref={playerRef}
      playbackId={file?.playbackId}
      muted={muted}
      nohotkeys
      autoPlay={'any'}
      className={clsx('no-controls', className)}
      thumbnailTime={0}
      loop
      onCanPlay={handleLoadedData}
    />
  )
}
