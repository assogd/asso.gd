import { formatEventDate } from '../../lib/date'

export const OpeningHours = ({ startDate, endDate }) => {
  const eventDate = formatEventDate(startDate, endDate)

  return (
    <div className="mx-auto max-w-lg bg-secondaryWhite px-8 py-6 w-full rounded-lg leading-5 grid sm:grid-cols-2 gap-3 text-center">
      <div>
        <h3 className="uppercase font-mono text-sm mb-2 opacity-90">
          Date and time
        </h3>
        {(startDate || endDate) && <div>{eventDate}</div>}
      </div>
      <div>
        <h3 className="uppercase font-mono text-sm mb-2 opacity-90">
          Location
        </h3>
        Restaurang Forma
        <br />
        Hornsbruksgatan 28
      </div>
    </div>
  )
}
