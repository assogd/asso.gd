'use client'
import clsx from 'clsx'
import { memo, useMemo } from 'react'
import { throttle } from 'lodash'

const ProgressBar = memo(
  ({ progress, isActive, isViewed, duration, totalDuration }) => {
    // Use throttled progress to limit updates
    const throttledProgress = useMemo(
      () => throttle(() => progress / 100, 100),
      [progress]
    )

    // Calculate the proportional width based on the duration of the slide relative to the total duration
    const proportionalWidth = (duration / totalDuration) * 100

    return (
      <div
        className={clsx('relative py-2', !isActive && 'cursor-pointer')}
        style={{ flexBasis: `${proportionalWidth}%` }} // Adjust width based on duration
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
                willChange: 'transform'
              }}
            />
          )}
        </div>
      </div>
    )
  }
)

// Assign a display name for debugging purposes
ProgressBar.displayName = 'ProgressBar'

export default ProgressBar
