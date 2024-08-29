'use client'
import MuxPlayer from '@mux/mux-player-react/lazy'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useMedia } from 'use-media'
import { Button } from '@/components/ui/buttons'

export const StandardPlayer = ({
  file,
  muted,
  controls,
  className,
  caption
}) => {
  const playerRef = useRef(null)
  const [isMuted, setIsMuted] = useState(muted)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoadedData = () => {
    setIsLoaded(true)
  }

  const handlePlayWithSound = () => {
    setIsMuted(false)
  }

  return (
    <motion.div
      className={clsx('relative w-full aspect-video')}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      <MuxPlayer
        ref={playerRef}
        playbackId={file?.playbackId}
        muted={isMuted}
        nohotkeys={!controls}
        autoPlay={'any'}
        className={clsx(
          (!controls || isMuted) && 'no-controls absolute w-full h-full'
        )}
        thumbnailTime={0}
        loop={!controls || isMuted}
        accentColor="#D5B56E"
        primaryColor="rgba(245, 245, 245, 1)"
        onCanPlay={handleLoadedData}
      />
      <AnimatePresence>
        {isLoaded && isMuted && controls && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            whileHover={{ background: 'none' }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Button
              onTap={handlePlayWithSound}
              className={
                'border rounded uppercase pt-2 px-2 pb-1 text-sm opacity-90'
              }
            >
              Play with sound
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
