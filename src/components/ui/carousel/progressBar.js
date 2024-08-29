'use client'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const ProgressBar = ({ progress, isActive, isViewed, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={clsx('flex-1 py-2 relative', !isActive && 'cursor-pointer')}
    >
      <div
        className={clsx(
          'h-[1px] relative overflow-hidden',
          isViewed ? 'bg-black' : 'bg-[#E7E7E7]/50'
        )}
      >
        {isActive && (
          <motion.div
            className="h-full bg-black origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.016, ease: 'linear' }}
          />
        )}
      </div>
    </div>
  )
}

export default ProgressBar
