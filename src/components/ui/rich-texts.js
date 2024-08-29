import { RichText } from '@graphcms/rich-text-react-renderer'

export const TextBlock = ({ content }) => {
  return (
    <section className="mx-auto text-center grid gap-4 col-span-full font-serif py-24 px-8 sm:px-12 max-w-[90rem] text-lg">
      <RichText
        content={content.raw}
        renderers={{
          h2: ({ children }) => (
            <h2 className="uppercase font-sans text-sm">{children}</h2>
          )
        }}
      />
    </section>
  )
}

export const Caption = ({ content }) => {
  return (
    <figcaption className="">
      <RichText content={content.raw} />
    </figcaption>
  )
}
