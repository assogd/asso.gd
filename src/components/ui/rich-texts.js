import ReactMarkdown from 'react-markdown'

export const TextBlock = ({ content }) => {
  return (
    <section className="mx-auto text-center grid gap-4 col-span-full font-serif py-24 px-8 sm:px-12 max-w-[90rem] text-lg">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="uppercase font-sans text-sm">{children}</h2>
          )
        }}
      >
        {content.raw}
      </ReactMarkdown>
    </section>
  )
}

export const Caption = ({ content }) => {
  return (
    <figcaption className="">
      <ReactMarkdown>{content.raw}</ReactMarkdown>
    </figcaption>
  )
}
