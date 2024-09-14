'use client'
import clsx from 'clsx'
import { memo, useMemo } from 'react'
import { throttle } from 'lodash'

const ProgressBar = memo(({ progress, isActive, isViewed, onClick }) => {
  // Use throttled progress to limit updates
  const throttledProgress = useMemo(
    () => throttle(() => progress / 100, 100),
    [progress]
  )

  return (
    <div
      onClick={onClick}
      className={clsx('flex-1 py-2 relative', !isActive && 'cursor-pointer')}
    >
      <div
        className={clsx(
          'h-[1px] relative overflow-hidden',
          isViewed ? 'bg-current' : 'bg-[#E7E7E7]/70'
        )}
      >
        {isActive && (
          <div
            className="h-full bg-current origin-left"
            style={{
              transform: `scaleX(${throttledProgress()})`,
              transition: 'transform 0.1s linear',
              willChange: 'transform' // Hint for optimization
            }}
          />
        )}
      </div>
    </div>
  )
})

// Assign a display name for debugging purposes
ProgressBar.displayName = 'ProgressBar'

export default ProgressBar
