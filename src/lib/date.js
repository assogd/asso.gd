import moment from 'moment-timezone'

export function formatEventDate(startDate, endDate) {
  if (!startDate && !endDate) {
    return <span>Date and time not available</span>
  }

  const timezone = 'Europe/Stockholm'

  const start = startDate ? moment.tz(startDate, timezone) : null
  const end = endDate ? moment.tz(endDate, timezone) : null

  const dateFormat = 'MMMM D, YYYY'
  const timeFormat = 'HH:mm'

  if (start && (!end || start.isSame(end, 'day'))) {
    // If the event starts and ends on the same day, show the date and a time range
    const datePart = <span>{start.format(dateFormat)}</span>
    const timePart =
      start && end ? (
        <span>
          {start.format(timeFormat)}–{end.format(timeFormat)}
        </span>
      ) : (
        <span>{start.format(timeFormat)}</span> // Fallback to just start time if end time is not available
      )

    return (
      <>
        {datePart}
        <br />
        {timePart}
      </>
    )
  } else if (start && end) {
    // For events spanning multiple days, show full start and end dates with times on separate lines
    return (
      <>
        <span>{start.format(`${dateFormat} 'at' ${timeFormat}`)}</span>
        <br />
        <span>{end.format(`${dateFormat} 'at' ${timeFormat}`)}</span>
      </>
    )
  }
}
