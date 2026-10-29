// Number of copies per half. The track holds two identical halves and slides
// by exactly one half, so the loop is seamless as long as one half is wider
// than the viewport.
const COPIES = 12

/**
 * Full-viewport-width looping ticker. `items` are rendered on one line, each
 * line break becoming a divider, and the whole row repeats to stay filled.
 */
export function Marquee({ items, gap = '3em', className = '' }) {
  const unit = items.map((item, index) => (
    <span key={index} className="inline-block whitespace-nowrap">
      {item}
      <span
        aria-hidden="true"
        className="inline-block"
        style={{ width: gap }}
      />
    </span>
  ))

  return (
    <div
      className={`marquee -mx-2 sm:-mx-4 w-screen overflow-hidden ${className}`}
    >
      <div className="marquee-track flex w-max">
        {[0, 1].map((half) => (
          <div
            key={half}
            aria-hidden={half === 1 || undefined}
            className="flex shrink-0"
          >
            {Array.from({ length: COPIES }, (_, copy) => (
              <span key={copy} className="flex shrink-0">
                {unit}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
